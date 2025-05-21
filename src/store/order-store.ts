import { create } from "zustand";
import { Order, CreateOrderDTO, UpdateOrderDTO, OrderItem } from "@/interfaces/orders";
import { Product } from "@/interfaces/products";

interface OrderStore {
  orders: Order[];
  orderItems: OrderItem[];
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
  createOrder: (orderData: CreateOrderDTO) => Promise<void>;
  updateOrder: (id: string, orderData: UpdateOrderDTO) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  orders: [],
  orderItems: [],
  loading: false,
  error: null,
  search: "",
  page: 1,
  total: 0,
  perPage: 10,
  editData: null,
  deleteData: null,
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  ...initialState,

  setOrders: (orders) => set({ orders }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setTotal: (total) => set({ total }),
  setEditData: (order) => set({ editData: order }),
  setDeleteData: (order) => set({ deleteData: order }),

  reset: () => set(initialState),

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
      const errorMessage = err instanceof Error ? err.message : "Error fetching orders";
      console.error("[FETCH_ORDERS_ERROR]", err);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  createOrder: async (orderData: CreateOrderDTO) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create order');
      }

      await get().fetchOrders();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating order';
      console.error('[CREATE_ORDER_ERROR]', err);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id: string, orderData: UpdateOrderDTO) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update order');
      }

      await get().fetchOrders();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating order';
      console.error('[UPDATE_ORDER_ERROR]', err);
      set({ error: errorMessage });
      throw new Error(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting order";
      console.error("[DELETE_ORDER_ERROR]", err);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  addOrderItem: (product: Product, currentOrderItems: OrderItem[] = []): OrderItem[] => {
    const existingItemIndex = currentOrderItems.findIndex((item) => item.productId === product.id);

    if (existingItemIndex !== -1) {
      const newOrderItems = [...currentOrderItems];
      const item = newOrderItems[existingItemIndex];
      item.quantity += 1;
      item.total = item.price * item.quantity;
      return newOrderItems;
    }

    const newItem: OrderItem = {
      id: "",
      orderId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productId: product.id,
      quantity: 1,
      discount: 0,
      price: product.price,
      total: product.price,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image.url || "",
      },
    };
    return [...currentOrderItems, newItem];
  },

  removeOrderItem: (index: number, currentOrderItems: OrderItem[] = []): OrderItem[] => {
    return currentOrderItems.filter((_, i) => i !== index);
  },

  calculateOrderTotal: (orderItems: OrderItem[] = []): number => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  },

  updateOrderItem: (index: number, field: keyof OrderItem, value: string | number, currentOrderItems: OrderItem[] = []): OrderItem[] => {
    const newOrderItems = [...currentOrderItems];
    const item = newOrderItems[index];

    if (field === "quantity") {
      const newQuantity = typeof value === "number" ? value : parseInt(value as string);
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        item.total = item.price * item.quantity;
      }
    }

    newOrderItems[index] = item;
    return newOrderItems;
  },

})); 