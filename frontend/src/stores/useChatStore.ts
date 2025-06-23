import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: (token: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async (token: string) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: res.data });
    } catch (error: any) {
      set({ error: error.message });
      console.error("Fetch users failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
