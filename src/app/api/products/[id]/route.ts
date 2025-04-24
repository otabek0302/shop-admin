import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Find current product
        const existing = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let imageData = existing.image;
        
        // 2. Handle image update if new image is provided
        if (body.imageBase64) {
            // Delete old image from Cloudinary if exists
            if (existing.image && typeof existing.image === 'object' && 'public_id' in existing.image) {
                const publicId = existing.image.public_id;
                if (typeof publicId === 'string') {
                    await deleteImage(publicId);
                }
            }
            // Upload new image
            imageData = await uploadImage(body.imageBase64);
        }

        // 3. Update product with all fields
        const updated = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                brand: body.brand,
                price: body.price,
                stock: body.stock,
                category: { connect: { id: body.category } },
                image: imageData as any,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PRODUCT_UPDATE_ERROR]", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const existing = await prisma.product.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        // Remove image from Cloudinary
        if (existing.image && typeof existing.image === 'object' && 'public_id' in existing.image) {
            const publicId = existing.image.public_id;
            if (typeof publicId === 'string') {
                await deleteImage(publicId);
            }
        }

        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[PRODUCT_DELETE_ERROR]", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}