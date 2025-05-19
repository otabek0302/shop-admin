export interface DailyPoint {
    date: string;
    count: number;
}

export interface DashboardData {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    processingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    productsInStore: number;
    soldProducts: number;
    outOfStockProducts: number;
    totalStoreValue: number;
    totalRevenueOfProductsInStock: number;
    dailyOrders: DailyPoint[];
    outOfStockProductsList: Array<{
        id: string;
        name: string;
        image: {
            url: string;
        };
        price: number;
        category: string;
    }>;
}