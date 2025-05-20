import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// GET: Fetch paginated orders with search
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;

    try {
        let where: Prisma.OrderWhereInput = {};

        if (search) {
            where = {
                orderItems: {
                    some: {
                        product: {
                            name: {
                                contains: search
                            },
                        },
                    },
                },
            };
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
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
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({ orders, total });
    } catch (error) {
        console.error("[ORDER_GET]", error);
        // Add more detailed error logging
        if (error instanceof Error) {
            console.error("[ORDER_GET] Error details:", {
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

// POST: Create a new order with order items
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        console.log("[ORDER_POST] Request body:", body);
        
        const { items, status = OrderStatus.PENDING, discount = 0 } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Items are required" }, { status: 400 });
        }

        // Check stock availability first
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });
            
            if (!product) {
                return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
            }
            
            if (product.stock < item.quantity) {
                return NextResponse.json({ 
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                }, { status: 400 });
            }
        }

        let subtotal = 0;
        const orderItems = items.map((item: { productId: string; quantity: number; price: number }) => {
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal,
            };
        });

        // Calculate final total after discount
        const total = Math.max(0, subtotal - discount);

        console.log("[ORDER_POST] Calculated values:", {
            subtotal,
            discount,
            total,
            orderItems
        });

        // Create order and update stock in a transaction
        const order = await prisma.$transaction(async (tx) => {
            try {
                // Create the order
                const newOrder = await tx.order.create({
                    data: {
                        status,
                        total,
                        discount,
                        orderItems: {
                            create: orderItems,
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

                // Update stock for each product
                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }

                return newOrder;
            } catch (error) {
                console.error("[ORDER_POST_TRANSACTION_ERROR]", error);
                throw error;
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("[ORDER_POST]", error);
        if (error instanceof Error) {
            console.error("[ORDER_POST] Error details:", {
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