"use client";

import { useEffect } from "react";
import OrderList from "@/components/admin-ui/orders/order-list";
import OrderToolbar from "@/components/admin-ui/orders/order-toolbar";
import { useOrderStore } from "@/store/order-store";
import Pagination from "@/components/ui/pagination";

export default function OrdersPage() {
  const { fetchOrders, page, total, perPage, setPage } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page]);

  return (
    <div className="h-full space-y-4 p-4 flex flex-col justify-between">
      <OrderToolbar />
      <OrderList />
      <Pagination 
        page={page} 
        setPage={setPage} 
        total={total} 
        perPage={perPage} 
      />
    </div>
  );
}
