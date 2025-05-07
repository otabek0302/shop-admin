import { create } from "zustand";
import { Order } from "@/interfaces/orders";

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  total: number;
  perPage: number;
  editData: Order | null;
  deleteData: Order | null;
  setOrders: (orders: Order[]) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setEditData: (order: Order | null) => void;
  setDeleteData: (order: Order | null) => void;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  updateOrder: (id: string, orderData: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  search: "",
  page: 1,
  total: 0,
  perPage: 10,
  editData: null,
  deleteData: null,
  setOrders: (orders) => set({ orders }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setTotal: (total) => set({ total }),
  setEditData: (order) => set({ editData: order }),
  setDeleteData: (order) => set({ deleteData: order }),

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const { search, page, perPage } = get();
      const res = await fetch(`/api/orders?search=${search}&page=${page}&perPage=${perPage}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to fetch orders" }));
        throw new Error(error.message);
      }
      const data = await res.json();
      set({ orders: data.orders, total: data.total });
    } catch (err: unknown) {
      console.error("[FETCH_ORDERS_ERROR]", err);
      set({ error: err instanceof Error ? err.message : "Error fetching orders" });
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }
      await get().fetchOrders();
    } catch (err) {
      console.error("[CREATE_ORDER_ERROR]", err);
      set({ error: err instanceof Error ? err.message : "Error creating order" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update order");
      }
      await get().fetchOrders();
    } catch (err) {
      console.error("[UPDATE_ORDER_ERROR]", err);
      set({ error: err instanceof Error ? err.message : "Error updating order" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete order");
      }
      await get().fetchOrders();
    } catch (err) {
      console.error("[DELETE_ORDER_ERROR]", err);
      set({ error: err instanceof Error ? err.message : "Error deleting order" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
})); 