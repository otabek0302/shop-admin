import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || `${new Date().getMonth() + 1}`); // 1-indexed
    const year = parseInt(searchParams.get("year") || `${new Date().getFullYear()}`);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalProducts,
      productsInStore,
      soldProducts,
      bestSelling,
      leastSelling,
      newProducts
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.order.count({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.order.count({
        where: {
          status: "CANCELLED",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { total: true },
      }),

      prisma.product.count(),

      prisma.product.aggregate({
        _sum: { stock: true },
      }),

      prisma.orderItem.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { quantity: true },
      }),

      prisma.orderItem.findFirst({
        where: { createdAt: { gte: startDate, lte: endDate } },
        orderBy: { quantity: "desc" },
        include: { product: true },
      }),

      prisma.orderItem.findFirst({
        where: { createdAt: { gte: startDate, lte: endDate } },
        orderBy: { quantity: "asc" },
        include: { product: true },
      }),

      prisma.product.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      })
    ]);

    return NextResponse.json({
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      productsInStore: productsInStore._sum.stock || 0,
      soldProducts: soldProducts._sum.quantity || 0,
      bestSelling,
      leastSelling,
      newProducts,
    });
  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
