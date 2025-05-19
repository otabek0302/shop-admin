'use client';

import OrderList from '@/components/admin-ui/orders/order-list';
import OrderToolbar from '@/components/admin-ui/orders/order-toolbar';
import Pagination from '@/components/ui/pagination';

import { useEffect } from 'react';
import { useOrderStore } from '@/store/order-store';

export default function OrdersPage() {
  const { fetchOrders, page, total, perPage, setPage } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page]);

  return (
    <div className="flex h-full flex-col justify-between space-y-4 p-4">
      <OrderToolbar />
      <OrderList />
      <Pagination page={page} setPage={setPage} total={total} perPage={perPage} />
    </div>
  );
}
