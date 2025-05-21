'use client';

import Loading from './loading';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageCheck, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ChartAreaInteractive } from '@/components/admin-ui/charts/chart-area-interactive';
import { DashboardData } from '@/interfaces/dashboard';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

const locales = {
  uz: uz,
  en: uz,
};

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchDashboardData = useCallback(
    async (date: Date) => {
      setLoading(true);
      setError(null);
      try {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const res = await fetch(`/api/dashboard?month=${month}&year=${year}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json: DashboardData = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(t('components.dashboard.errors.fetch'));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchDashboardData(selectedDate);
  }, [fetchDashboardData, selectedDate]);

  const handlePreviousMonth = useCallback(() => {
    setSelectedDate((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedDate((d) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  }, []);

  const isAtCurrentMonth = useMemo(() => {
    const now = new Date();
    return selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() === now.getMonth();
  }, [selectedDate]);

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <section className="h-full space-y-4 p-4 xl:h-screen">
      <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <h1 className="text-2xl font-bold">{t('components.dashboard.title')}</h1>
        <div className="mt-3 flex items-center gap-4 md:mt-0">
          <Button variant="outline" onClick={handlePreviousMonth} className="cursor-pointer">
            {t('components.dashboard.previous-month')}
          </Button>
          <span className="text-center text-sm font-semibold md:text-base">{format(selectedDate, 'MMMM yyyy', { locale: locales[i18n.language as keyof typeof locales] })}</span>
          <Button variant="outline" onClick={handleNextMonth} disabled={isAtCurrentMonth} className="cursor-pointer">
            {t('components.dashboard.next-month')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {/* Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('components.dashboard.card.orders')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{data.totalOrders}</p>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="default" className="w-full dark:text-white">
                {t('components.dashboard.content.completed-orders')}: {data.completedOrders}
              </Badge>
              <Badge variant="secondary" className="w-full dark:text-white">
                {t('components.dashboard.content.pending-orders')}: {data.pendingOrders}
              </Badge>
              <Badge variant="secondary" className="w-full dark:text-white">
                {t('components.dashboard.content.processing-orders')}: {data.processingOrders}
              </Badge>
              <Badge variant="destructive" className="w-full dark:text-white">
                {t('components.dashboard.content.cancelled-orders')}: {data.cancelledOrders}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('components.dashboard.card.revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold">{formatCurrency(data.totalRevenue)}</p>
            <div className="flex flex-col gap-2">
              <Badge variant="outline">
                {t('components.dashboard.content.revenue-in-stock')}: {formatCurrency(data.totalRevenueOfProductsInStock)}
              </Badge>
              <Badge variant="outline">
                {t('components.dashboard.content.sold-products-gross-value', 'Gross value of sold products')}: {formatCurrency(data.soldProductsGrossValue)}
              </Badge>
              <Badge variant="destructive">
                {t('components.dashboard.content.total-discount')}: {formatCurrency(data.totalDiscountGiven)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              {t('components.dashboard.card.products')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.total-products')}: {data.totalProducts}
              </Badge>
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.products-in-store')}: {data.productsInStore}
              </Badge>
              <Badge variant="outline" className="w-full dark:text-white">
                {t('components.dashboard.content.sold-products')}: {data.soldProducts}
              </Badge>
              <Badge variant="destructive" className="w-full dark:text-white">
                {t('components.dashboard.content.out-of-stock')}: {data.outOfStockProducts}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Out of Stock Products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Chart */}
        <div className="flex-1">
          <ChartAreaInteractive />
        </div>

        {/* Out of Stock Products List */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive h-5 w-5" />
                {t('components.dashboard.card.stock-status')}
                <Badge variant="destructive" className="ml-2">
                  {data?.outOfStockProducts}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.outOfStockProductsList.length > 0 ? (
                <div className="space-y-1">
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {data?.outOfStockProductsList.map((p) => (
                      <div key={p.id} className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-10 w-10 overflow-hidden rounded border">
                            <Image src={p?.image?.url} alt={p.name} fill className="object-cover" />
                          </div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-muted-foreground text-sm">{p.category?.name || t('components.dashboard.content.no-category')}</p>
                        </div>
                        <Badge variant="destructive">{formatCurrency(p.price)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-[300px] items-center justify-center">{t('components.dashboard.content.no-out-of-stock')}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
