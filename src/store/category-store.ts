import { create } from "zustand";
import { Category } from "@/interfaces/category";

interface CategoryState {
    categories: Category[];
    total: number;
    page: number;
    search: string;
    deleteData: Category | null;
    editData: Category | null;
    loading: boolean;
    setDeleteData: (data: Category | null) => void;
    setEditData: (data: Category | null) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    fetchCategories: () => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    editCategory: (id: string, name: string) => Promise<void>;
    createCategory: (name: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
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
    fetchCategories: async () => {
        set({ loading: true });
        try {
            const { search, page } = get();
            const res = await fetch(`/api/categories?search=${search}&page=${page}`);
            const data = await res.json();
            set({ categories: data.categories, total: data.total });
        } catch (error) {
            console.error("[FETCH_CATEGORIES_ERROR]", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteCategory: async (id: string) => {
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (res.ok) {
            get().fetchCategories();
            get().setDeleteData(null);
        }
    },
    editCategory: async (id: string, name: string) => {
        const res = await fetch(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) });
        if (res.ok) {
            get().fetchCategories();
            get().setEditData(null);
        }
    },
    createCategory: async (name: string) => {
        const res = await fetch(`/api/categories`, { method: "POST", body: JSON.stringify({ name }) });
        if (res.ok) {
            get().fetchCategories();
        }
    },
}));
