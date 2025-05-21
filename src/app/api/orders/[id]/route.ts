import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// PATCH - Update Order and OrderItems
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        const { items, status, discount } = await req.json();

        // Validate status if provided
        if (status && !Object.values(OrderStatus).includes(status)) {
            return NextResponse.json({
                error: "Invalid status value. Must be one of: PENDING, PROCESSING, COMPLETED, CANCELLED"
            }, { status: 400 });
        }

        // Get the existing order to check its current status
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // If only discount is being updated
        if (!status && !items && typeof discount === 'number') {
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { discount },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return NextResponse.json(updatedOrder);
        }

        // If only status is being updated
        if (status && !items) {
            try {
                // Handle stock changes in a transaction
                const updatedOrder = await prisma.$transaction(async (tx) => {
                    // Return stock if changing to CANCELLED
                    if (existingOrder.status !== OrderStatus.CANCELLED && status === OrderStatus.CANCELLED) {
                        for (const item of existingOrder.orderItems) {
                            await tx.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: {
                                        increment: item.quantity
                                    }
                                }
                            });
                        }
                    }
                    // Deduct stock if changing from CANCELLED
                    else if (existingOrder.status === OrderStatus.CANCELLED && status !== OrderStatus.CANCELLED) {
                        for (const item of existingOrder.orderItems) {
                            const product = await tx.product.findUnique({
                                where: { id: item.productId }
                            });

                            if (!product) {
                                throw new Error(`Product ${item.productId} not found`);
                            }

                            if (product.stock < item.quantity) {
                                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
                            }

                            await tx.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: {
                                        decrement: item.quantity
                                    }
                                }
                            });
                        }
                    }
                    // Deduct stock if changing from not COMPLETED to COMPLETED
                    else if (existingOrder.status !== OrderStatus.COMPLETED && status === OrderStatus.COMPLETED) {
                        for (const item of existingOrder.orderItems) {
                            const product = await tx.product.findUnique({
                                where: { id: item.productId }
                            });

                            if (!product) {
                                throw new Error(`Product ${item.productId} not found`);
                            }

                            if (product.stock < item.quantity) {
                                throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
                            }

                            await tx.product.update({
                                where: { id: item.productId },
                                data: {
                                    stock: {
                                        decrement: item.quantity
                                    }
                                }
                            });
                        }
                    }

                    // Update order status
                    return await tx.order.update({
                        where: { id: orderId },
                        data: {
                            status: status as OrderStatus,
                            discount: typeof discount === 'number' ? discount : existingOrder.discount
                        },
                        include: {
                            orderItems: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    });
                });

                return NextResponse.json(updatedOrder);
            } catch (error) {
                console.error("[ORDER_PATCH_TRANSACTION_ERROR]", error);
                return NextResponse.json({
                    error: error instanceof Error ? error.message : "Failed to update order status",
                    details: error instanceof Error ? error.stack : undefined
                }, { status: 500 });
            }
        }

        // If items are being updated, proceed with the existing logic
        if (!items) {
            return NextResponse.json({ error: "Items are required for order update" }, { status: 400 });
        }

        // Check stock availability for new items if status is not CANCELLED
        if (status !== OrderStatus.CANCELLED) {
            for (const item of items) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
                }

                // Calculate available stock considering current order items
                const currentOrderItem = existingOrder.orderItems.find(oi => oi.productId === item.productId);
                const availableStock = product.stock + (currentOrderItem?.quantity || 0);

                if (availableStock < item.quantity) {
                    return NextResponse.json({
                        error: `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}`
                    }, { status: 400 });
                }
            }
        }

        // Calculate new items and subtotal
        const newItems = items.map((item: { productId: string; quantity: number; price: number }) => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
        }));

        const subtotal = newItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
        const total = Math.max(0, subtotal - discount);

        // Update order and handle stock changes in a transaction
        const updatedOrder = await prisma.$transaction(async (tx) => {
            try {
                // 1. Return stock for existing order items if status is changing to CANCELLED
                if (existingOrder.status !== OrderStatus.CANCELLED && status === OrderStatus.CANCELLED) {
                    for (const item of existingOrder.orderItems) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: {
                                    increment: item.quantity
                                }
                            }
                        });
                    }
                }
                // 2. Handle stock changes for new items
                else if (status !== OrderStatus.CANCELLED) {
                    // Return stock for removed items
                    for (const existingItem of existingOrder.orderItems) {
                        const newItem = items.find((item: { productId: string; quantity: number; price: number }) => item.productId === existingItem.productId);
                        if (!newItem) {
                            await tx.product.update({
                                where: { id: existingItem.productId },
                                data: {
                                    stock: {
                                        increment: existingItem.quantity
                                    }
                                }
                            });
                        } else if (newItem.quantity < existingItem.quantity) {
                            await tx.product.update({
                                where: { id: existingItem.productId },
                                data: {
                                    stock: {
                                        increment: existingItem.quantity - newItem.quantity
                                    }
                                }
                            });
                        } else if (newItem.quantity > existingItem.quantity) {
                            await tx.product.update({
                                where: { id: existingItem.productId },
                                data: {
                                    stock: {
                                        decrement: newItem.quantity - existingItem.quantity
                                    }
                                }
                            });
                        }
                    }
                }

                // 3. Delete existing order items
                await tx.orderItem.deleteMany({
                    where: { orderId },
                });

                // 4. Update order and recreate items
                return await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: status || OrderStatus.PENDING,
                        total,
                        discount,
                        orderItems: {
                            create: newItems.map((item: { productId: string; quantity: number; price: number; total: number }) => ({
                                product: {
                                    connect: { id: item.productId }
                                },
                                quantity: item.quantity,
                                price: item.price,
                                total: item.total
                            }))
                        },
                    },
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
            } catch (error) {
                console.error("[ORDER_PATCH_TRANSACTION_ERROR]", error);
                throw error;
            }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("[ORDER_PATCH_ERROR]", error);
        if (error instanceof Error) {
            console.error("[ORDER_PATCH_ERROR] Details:", {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

// DELETE - Delete Order and its OrderItems
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const orderId = params.id;

        // First get the order with its items to handle stock restoration
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Handle stock restoration in a transaction
        await prisma.$transaction(async (tx) => {
            // Restore stock only for PENDING or PROCESSING orders
            if (order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING) {
                for (const item of order.orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    });
                }
            } else if (order.status === OrderStatus.COMPLETED) {
                throw new Error("Cannot delete a completed order. Please cancel the order first if you need to return the items.");
            }

            // Delete all order items associated with this order
            await tx.orderItem.deleteMany({
                where: { orderId }
            });

            // Delete the order
            await tx.order.delete({
                where: { id: orderId }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ORDER_DELETE_ERROR]", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to delete order",
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

// GET: Fetch single order
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDER_GET_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}