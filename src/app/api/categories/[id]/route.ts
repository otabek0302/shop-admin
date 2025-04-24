import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const updated = await prisma.category.update({
        where: { id: params.id },
        data: { name: body.name },
    });
    return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}