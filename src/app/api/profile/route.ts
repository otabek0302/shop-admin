import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET - Fetch profile of current logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        
        const user = await prisma.user.findUnique({
            where: { id: session?.user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PUT - Update profile of current logged-in user
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, email, password, phone } = body;

        if (!name && !email && !password && !phone) {
            return new NextResponse("No fields to update", { status: 400 });
        }

        if (email) {
            const existing = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: { id: session.user.id },
                },
            });

            if (existing) {
                return new NextResponse("Email already in use", { status: 400 });
            }
        }

        const updateData: {
            name?: string;
            email?: string;
            password?: string;
            phone?: string;
        } = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (phone) updateData.phone = phone;

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}