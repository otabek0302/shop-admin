"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, PackageCheck, ShoppingCart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChartAreaInteractive } from "@/components/admin-ui/charts/chart-area-interactive"

interface DashboardData {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalProducts: number;
  productsInStore: number;
  soldProducts: number;
  bestSelling: {
    name: string;
    quantity: number;
  } | null;
  leastSelling: {
    name: string;
    quantity: number;
  } | null;
  newProducts: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="p-4">Loading...</div>;

  return (
    <section className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{data.totalOrders}</p>
            <div className="flex gap-2">
              <Badge variant="default">Completed: {data.completedOrders}</Badge>
              <Badge variant="destructive">Cancelled: {data.cancelledOrders}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(data.totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5" /> Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>Total: {data.totalProducts}</p>
            <p>In Stock: {data.productsInStore}</p>
            <p>Sold: {data.soldProducts}</p>
            <p>New This Month: {data.newProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" /> Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>🔥 Best Seller: <strong>{data.bestSelling?.name || "-"}</strong> ({data.bestSelling?.quantity || 0})</p>
            <p>🧊 Least Seller: <strong>{data.leastSelling?.name || "-"}</strong> ({data.leastSelling?.quantity || 0})</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartAreaInteractive />
      </div>
    </section>
  );
}
