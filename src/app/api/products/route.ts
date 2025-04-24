import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;

    const products = await prisma.product.findMany({
        where: {
            name: { contains: search, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { 
            category: true,
            orderItems: {
                where: {
                    order: {
                        status: "COMPLETED"
                    }
                },
                select: {
                    quantity: true
                }
            }
        },
    });

    // Transform products to include sales count
    const productsWithSales = products.map(product => ({
        ...product,
        sales: product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    }));

    const total = await prisma.product.count({
        where: {
            name: { contains: search, mode: "insensitive" },
        },
    });

    return NextResponse.json({ products: productsWithSales, total });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        const imageData = await uploadImage(body.imageBase64);

        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                brand: body.brand,
                price: body.price,
                stock: body.stock,
                category: {
                    connect: { id: body.category },
                },
                image: imageData,
            },
        });

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("[PRODUCT_POST_ERROR]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}