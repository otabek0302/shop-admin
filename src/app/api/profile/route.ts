import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Get user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('[PROFILE_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// PUT - Update user profile
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { email, password, name, image } = body;

        // Validate input
        if (!email && !password && !name && !image) {
            return new NextResponse('No fields to update', { status: 400 });
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        id: session.user.id
                    }
                }
            });

            if (existingUser) {
                return new NextResponse('Email already in use', { status: 400 });
            }
        }

        // Prepare update data
        const updateData: {
            name?: string;
            email?: string;
            password?: string;
            image?: string;
        } = {};

        if (name) {
            updateData.name = name;
        }

        if (email) {
            updateData.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (image) {
            updateData.image = image;
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('[PROFILE_UPDATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
