import { create } from "zustand";

interface Profile {
  name: string;
  email: string;
  role: string;
  phone: string;
  currentPassword?: string;
  newPassword?: string;
}

interface ProfileStore {
  profile: Profile;
  loading: boolean;
  error: string | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (profile: Profile) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    name: "",
    email: "",
    role: "",
    phone: "",
  },
  loading: false,
  error: null,
  setProfile: (profile) => set({ profile }),

  updateProfile: async (profile) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        set({ profile });
      } else {
        const error = await res.json();
        set({ error: error.message || "Failed to update profile" });
      }
    } catch (err) {
      console.error("[UPDATE_PROFILE_ERROR]", err);
      set({ error: "Unexpected error while updating" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/profile");
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to fetch profile" }));
        throw new Error(error.message);
      }
      const profile = await res.json();
      set({ profile });
    } catch (err: unknown) {
      console.error("[FETCH_PROFILE_ERROR]", err);
      set({ error: err instanceof Error ? err.message : "Error fetching profile" });
    } finally {
      set({ loading: false });
    }
  },
}));