import { create } from "zustand";
import { ProductInBusket } from "@/interfaces/products";

interface ClientOrderStore {
    // State
    busket: { products: ProductInBusket[]; quantity: number };
    total: number;
    subtotal: number;
    discount: number;
    loading: boolean;
    error: string | null;

    // Actions
    setTotal: (total: number) => void;
    setDiscount: (discount: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setBusket: (products: ProductInBusket[], quantity: number) => void;
    addToBusket: (product: ProductInBusket) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    applyDiscount: (amount: number) => void;

    // Selectors / Calculated values
    getSubtotal: () => number;
    getTotal: () => number;
    getQuantityForProduct: (productId: string) => number;

    // Async logic
    createOrder: (data: { items: { productId: string; quantity: number; price: number }[]; status: string }) => Promise<void>;
}

export const useClientOrderStore = create<ClientOrderStore>((set, get) => ({
    // --- Initial state ---
    busket: { products: [], quantity: 0 },
    total: 0,
    subtotal: 0,
    discount: 0,
    loading: false,
    error: null,

    // --- State updaters ---
    setTotal: (total) => set({ total }),
    setDiscount: (discount) => set({ discount }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setBusket: (products, quantity) => set({ busket: { products, quantity } }),

    // --- Add item to basket ---
    addToBusket: (product) => {
        set((state) => {
            const existing = state.busket.products.find((p) => p.id === product.id);
            let updatedProducts;

            if (existing) {
                // If already in basket, increase quantity
                updatedProducts = state.busket.products.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            } else {
                // Else add as new item
                updatedProducts = [...state.busket.products, { ...product, quantity: 1 }];
            }

            const totalQuantity = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);

            return { busket: { products: updatedProducts, quantity: totalQuantity } };
        });
    },

    // --- Update item quantity or remove ---
    updateQuantity: (productId, quantity) => {
        set((state) => {
            const updatedProducts =
                quantity === 0
                    ? state.busket.products.filter((p) => p.id !== productId)
                    : state.busket.products.map((p) =>
                        p.id === productId ? { ...p, quantity } : p
                    );

            const totalQuantity = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);

            return { busket: { products: updatedProducts, quantity: totalQuantity } };
        });
    },

    // --- Apply discount safely ---
    applyDiscount: (amount) => {
        const subtotal = get().getSubtotal();
        if (!isNaN(amount) && amount > 0) {
            set({ discount: Math.min(amount, subtotal) });
        } else {
            set({ discount: 0 });
        }
    },

    // --- Calculate subtotal: sum of item prices x quantity ---
    getSubtotal: () => {
        return get().busket.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    // --- Calculate final total: subtotal - discount ---
    getTotal: () => {
        const { discount } = get();
        const subtotal = get().getSubtotal();
        return subtotal - discount;
    },

    // --- Get quantity for a specific product ---
    getQuantityForProduct: (productId) => {
        const item = get().busket.products.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    },

    // --- Create order via API ---
    createOrder: async (data) => {
        try {
            set({ loading: true, error: null });

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create order");
            }

            // Reset cart after success
            set({ busket: { products: [], quantity: 0 }, discount: 0, total: 0 });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error creating order";
            console.error("[CREATE_ORDER_ERROR]", message);
            set({ error: message });
            throw new Error(message);
        } finally {
            set({ loading: false });
        }
    },
}));