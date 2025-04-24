"use client";

import OrderTableToolbar from "@/components/admin-ui/orders/order-toolbar";
import Pagination from "@/components/ui/pagination";
import OrderList from "@/components/admin-ui/orders/order-list";
import OrderModal from "@/components/admin-ui/orders/order-modal";

import { useEffect, useState } from "react";
import { Order } from "@/interfaces/orders";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | undefined>();

  const refreshOrders = async () => {
    const res = await fetch(`/api/orders?search=${search}&page=${page}`);
    const data = await res.json();
    console.log(data);
    setOrders(data.orders);
    setTotal(data.total);
  };

  useEffect(() => {
    refreshOrders();
  }, [search, page]);

  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) refreshOrders();
  };

  return (
    <section className="h-full space-y-4 p-4 flex flex-col justify-between">
      <OrderTableToolbar
        search={search}
        setSearch={setSearch}
        onAddClick={() => {
          setEditOrder(undefined);
          setModalOpen(true);
        }}
      />
      <OrderList orders={orders} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />

      <OrderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditOrder(undefined);
        }}
        initialData={editOrder}
        onSuccess={refreshOrders}
      />
    </section>
  );
};

export default OrdersPage;
