import { create } from "zustand";
import { Product, ProductFormData } from "@/interfaces/products";

interface ProductState {
    products: Product[];
    total: number;
    page: number;
    search: string;
    deleteData: Product | null;
    editData: Product | null;
    loading: boolean;
    setDeleteData: (data: Product | null) => void;
    setEditData: (data: Product | null) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    fetchProducts: () => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    editProduct: (id: string, data: ProductFormData) => Promise<void>;
    createProduct: (data: ProductFormData) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    total: 0,
    page: 1,
    search: "",
    deleteData: null,
    editData: null,
    loading: true,
    setDeleteData: (data) => set({ deleteData: data }),
    setEditData: (data) => set({ editData: data }),
    setSearch: (search) => set({ search }),
    setPage: (page) => set({ page }),
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const { search, page } = get();
            const res = await fetch(`/api/products?search=${search}&page=${page}`);
            const data = await res.json();
            set({ products: data.products, total: data.total });
        } catch (error) {
            console.error("[FETCH_PRODUCTS_ERROR]", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteProduct: async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            
            if (!res.ok) {
                if (res.status === 400) {
                    // This is the case where product has active orders
                    throw new Error(data.error);
                }
                throw new Error('Failed to delete product');
            }
            
            await get().fetchProducts();
            get().setDeleteData(null);
        } catch (error) {
            console.error("[DELETE_PRODUCT_ERROR]", error);
            throw error;
        }
    },
    editProduct: async (id, data) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                await get().fetchProducts();
                get().setEditData(null);
            }
        } catch (error) {
            console.error("[EDIT_PRODUCT_ERROR]", error);
        } finally {
            set({ loading: false });
        }
    },
    createProduct: async (data) => {
        set({ loading: true });
        try {
            const res = await fetch(`/api/products`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create product');
            }

            await get().fetchProducts();
        } catch (error) {
            console.error("[CREATE_PRODUCT_ERROR]", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));
