import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "30d";
    const endDate = new Date();
    const startDate = new Date();
    if (timeRange === "90d") startDate.setDate(endDate.getDate() - 89);
    else if (timeRange === "30d") startDate.setDate(endDate.getDate() - 29);
    else startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);

    const [
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      processingOrders,
      totalRevenue,
      totalProducts,
      productsInStore,
      soldProducts,
      outOfStockProducts,
      totalStoreValue,
      outOfStockProductsList,
      totalRevenueOfProductsInStock,
      dailyOrders
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

      prisma.order.count({
        where: {
          status: "PENDING",
          createdAt: { gte: startDate, lte: endDate },
        },
      }),

      prisma.order.count({
        where: {
          status: "PROCESSING",
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

      prisma.product.count({
        where: {
          stock: 0,
        },
      }),

      prisma.product.aggregate({
        _sum: {
          price: true,
        },
      }),

      prisma.product.findMany({
        where: {
          stock: 0,
        },
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          category: true,
        },
      }),

      prisma.product.aggregate({
        where: {
          stock: { gt: 0 },
        },
        _sum: {
          price: true,
        },
      }),

      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    // Group by day: get orders and revenue per day
    const dailyStats = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
      _sum: { total: true },
      orderBy: { createdAt: 'asc' },
    });

    // Fill missing days with zeroes
    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    const formattedDailyStats = days.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      const stat = dailyStats.find(s => s.createdAt.toISOString().split('T')[0] === dateStr);
      return {
        date: dateStr,
        revenue: stat && stat._sum && typeof stat._sum.total === 'number' ? stat._sum.total : 0,
        orders: stat && stat._count && typeof stat._count.id === 'number' ? stat._count.id : 0,
      };
    });

    // Transform daily orders data
    const formattedDailyOrders = dailyOrders.map(order => ({
      date: order.createdAt.toISOString(),
      count: order._count.id,
    }));

    return NextResponse.json({
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      processingOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      productsInStore: productsInStore._sum.stock || 0,
      soldProducts: soldProducts._sum.quantity || 0,
      outOfStockProducts,
      totalStoreValue: totalStoreValue._sum.price || 0,
      outOfStockProductsList,
      totalRevenueOfProductsInStock: totalRevenueOfProductsInStock._sum.price || 0,
      dailyStats: formattedDailyStats,
      dailyOrders: formattedDailyOrders,
    });
  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
