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
        const { items, status } = await req.json();

        console.log("[ORDER_PATCH] Request data:", { orderId, items, status });

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
            console.log("[ORDER_PATCH] Order not found:", orderId);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        console.log("[ORDER_PATCH] Existing order:", existingOrder);

        // Check stock availability for new items if status is not CANCELLED
        if (status !== OrderStatus.CANCELLED) {
            for (const item of items) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });
                
                if (!product) {
                    console.log("[ORDER_PATCH] Product not found:", item.productId);
                    return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
                }
                
                // Calculate available stock considering current order items
                const currentOrderItem = existingOrder.orderItems.find(oi => oi.productId === item.productId);
                const availableStock = product.stock + (currentOrderItem?.quantity || 0);
                
                console.log("[ORDER_PATCH] Stock check:", {
                    productId: item.productId,
                    currentStock: product.stock,
                    currentOrderQuantity: currentOrderItem?.quantity,
                    availableStock,
                    requestedQuantity: item.quantity
                });
                
                if (availableStock < item.quantity) {
                    return NextResponse.json({ 
                        error: `Insufficient stock for ${product.name}. Available: ${availableStock}, Requested: ${item.quantity}` 
                    }, { status: 400 });
                }
            }
        }

        // Calculate new items and total
        const newItems = items.map((item: { productId: string; quantity: number; price: number }) => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
        }));

        const total = newItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);

        console.log("[ORDER_PATCH] New items and total:", { newItems, total });

        // Update order and handle stock changes in a transaction
        const updatedOrder = await prisma.$transaction(async (tx) => {
            try {
                // 1. Return stock for existing order items if status is changing to CANCELLED
                if (existingOrder.status !== OrderStatus.CANCELLED && status === OrderStatus.CANCELLED) {
                    console.log("[ORDER_PATCH] Returning stock for cancelled order");
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
                    console.log("[ORDER_PATCH] Handling stock changes for new items");
                    // Return stock for removed items
                    for (const existingItem of existingOrder.orderItems) {
                        const newItem = items.find((item: { productId: string; quantity: number; price: number }) => item.productId === existingItem.productId);
                        if (!newItem) {
                            console.log("[ORDER_PATCH] Returning stock for removed item:", existingItem.productId);
                            await tx.product.update({
                                where: { id: existingItem.productId },
                                data: {
                                    stock: {
                                        increment: existingItem.quantity
                                    }
                                }
                            });
                        } else if (newItem.quantity < existingItem.quantity) {
                            console.log("[ORDER_PATCH] Returning partial stock:", {
                                productId: existingItem.productId,
                                oldQuantity: existingItem.quantity,
                                newQuantity: newItem.quantity
                            });
                            await tx.product.update({
                                where: { id: existingItem.productId },
                                data: {
                                    stock: {
                                        increment: existingItem.quantity - newItem.quantity
                                    }
                                }
                            });
                        } else if (newItem.quantity > existingItem.quantity) {
                            console.log("[ORDER_PATCH] Decreasing stock:", {
                                productId: existingItem.productId,
                                oldQuantity: existingItem.quantity,
                                newQuantity: newItem.quantity
                            });
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
                console.log("[ORDER_PATCH] Deleting existing order items");
                await tx.orderItem.deleteMany({
                    where: { orderId },
                });

                // 4. Update order and recreate items
                console.log("[ORDER_PATCH] Creating new order items");
                return await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: status || OrderStatus.PENDING,
                        total,
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

        console.log("[ORDER_PATCH] Successfully updated order:", updatedOrder);
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

        // First delete all order items associated with this order
        await prisma.orderItem.deleteMany({
            where: { orderId }
        });

        // Then delete the order
        await prisma.order.delete({
            where: { id: orderId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ORDER_DELETE_ERROR]", error);
        return NextResponse.json({ 
            error: "Failed to delete order",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}