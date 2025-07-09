import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Map<string, Message[]>;
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: new Map(),
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: Message) => {
        set((state) => {
          const messagesMap = new Map(state.messages);
          const userMessages = messagesMap.get(message.senderId) || [];
          if (!userMessages.some((m) => m._id === message._id)) {
            messagesMap.set(message.senderId, [...userMessages, message]);
          }
          return { messages: messagesMap };
        });
      });

      socket.on("message_sent", (message: Message) => {
        set((state) => {
          const messagesMap = new Map(state.messages);
          const userMessages = messagesMap.get(message.senderId) || [];
          if (!userMessages.some((m) => m._id === message._id)) {
            messagesMap.set(message.senderId, [...userMessages, message]);
          }
          return { messages: messagesMap };
        });
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket || !content.trim()) return;

    const messages = get().messages.get(senderId) || [];
    const lastSent = messages[messages.length - 1]?.createdAt;
    const now = new Date().getTime();
    if (lastSent && now - new Date(lastSent).getTime() < 500) return;

    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching messages for userId:", userId, "Auth Token:", axiosInstance.defaults.headers.Authorization);
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      console.log("Response data:", response.data);
      set((state) => {
        const messagesMap = new Map(state.messages);
        messagesMap.set(userId, response.data);
        return { messages: messagesMap };
      });
    } catch (error: any) {
      console.error("Fetch messages error:", error.response?.data || error.message, "Status:", error.response?.status);
      set({ error: error.response?.data?.message || "Failed to fetch messages" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
