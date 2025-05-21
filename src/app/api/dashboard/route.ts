import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || "1");
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

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
      outOfStockProductsList,
      productsList,
      soldProductsList,
      dailyStats,
      totalDiscountGiven
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
          status: "COMPLETED",
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
          order: {
            status: "COMPLETED",
            createdAt: { gte: startDate, lte: endDate },
          }
        },
        _sum: { quantity: true },
      }),

      prisma.product.count({
        where: {
          stock: 0,
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
          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.product.findMany({
        select: {
          price: true,
          stock: true,
        },
      }),

      prisma.orderItem.findMany({
        where: {
          order: {
            status: "COMPLETED"
          }
        },
        select: {
          quantity: true,
          price: true
        }
      }),

      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: { id: true },
        _sum: { total: true },
        orderBy: { createdAt: 'asc' },
      }),

      prisma.order.aggregate({
        _sum: { discount: true },
        where: { status: 'COMPLETED' }
      }),
    ]);

    // Explicitly type the lists
    const productsListTyped = productsList as Array<{ price: number; stock: number }>;
    const soldProductsListTyped = soldProductsList as Array<{ price: number; quantity: number }>;

    // Calculate value of products currently in stock
    const totalRevenueOfProductsInStock = productsListTyped.reduce((sum: number, p) => {
      return sum + (p.price * p.stock);
    }, 0);

    // Calculate gross value of sold products (before discount)
    const soldProductsGrossValue = soldProductsListTyped.reduce((sum: number, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Fill missing days with zeros
    const days: Date[] = [];
    for (let d = new Date(startDate); d <= endDate;) {
      days.push(new Date(d));
      d = new Date(d.setDate(d.getDate() + 1));
    }

    const formattedDailyStats = days.map((day: Date) => {
      const dateStr = day.toISOString().split('T')[0];
      const stat = (dailyStats as Array<{ createdAt: Date; _sum?: { total?: number }; _count?: { id?: number } }>).find((s) => s.createdAt.toISOString().split('T')[0] === dateStr);
      return {
        date: dateStr,
        revenue: stat && stat._sum && typeof stat._sum.total === 'number' ? stat._sum.total : 0,
        orders: stat && stat._count && typeof stat._count.id === 'number' ? stat._count.id : 0,
      };
    });

    return NextResponse.json({
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      processingOrders,
      totalRevenue: totalRevenue._sum?.total ?? 0,
      totalProducts,
      productsInStore: productsInStore._sum?.stock ?? 0,
      soldProducts: soldProducts._sum?.quantity ?? 0,
      outOfStockProducts,
      outOfStockProductsList: outOfStockProductsList.map(product => ({
        ...product,
        category: product.category?.name || null,
      })),
      totalRevenueOfProductsInStock,
      soldProductsGrossValue,
      totalDiscountGiven: totalDiscountGiven._sum?.discount ?? 0,
      dailyStats: formattedDailyStats,
    });

  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}