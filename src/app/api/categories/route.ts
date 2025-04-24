import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

// GET all categories
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;

    try {
        const categories = await prisma.category.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const total = await prisma.category.count({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });

        return NextResponse.json({ categories, total });
    } catch (error) {
        console.error("[GET_CATEGORIES_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

// POST new category
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const category = await prisma.category.create({ data: { name: body.name } });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("[CATEGORY_POST_ERROR]", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}