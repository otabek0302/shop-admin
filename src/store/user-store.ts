import { create } from "zustand";

interface User {
    id: string;
    name: string;
    email?: string;
    role?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserStore {
    users: User[];
    total: number;
    page: number;
    search: string;
    deleteData: User | null;
    editData: User | null;
    setDeleteData: (data: User | null) => void;
    setEditData: (data: User | null) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    fetchUsers: () => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    editUser: (id: string, data: Partial<User>) => Promise<void>;
    createUser: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    total: 0,
    page: 1,
    search: "",
    deleteData: null,
    editData: null,

    setDeleteData: (data) => set({ deleteData: data }),
    setEditData: (data) => set({ editData: data }),
    setSearch: (search) => set({ search }),
    setPage: (page) => set({ page }),

    fetchUsers: async () => {
        try {
            const { search, page } = get();
            const res = await fetch(`/api/users?search=${search}&page=${page}`);
            const data = await res.json();
            set({ users: data.users, total: data.total });
        } catch (err) {
            console.error("[FETCH_USERS_ERROR]", err);
        }
    },

    deleteUser: async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[DELETE_USER_ERROR]", err);
        }
    },

    editUser: async (id: string, data: Partial<User>) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[EDIT_USER_ERROR]", err);
        }
    },

    createUser: async (data: Partial<User>) => {
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) get().fetchUsers();
        } catch (err) {
            console.error("[CREATE_USER_ERROR]", err);
        }
    },
}));
