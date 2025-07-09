import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        
        try {
            const res = await axiosInstance.get("/admin/check");
            console.log('Admin Check Response:', res.data);
            
            // Check if the response indicates admin status
            if (res.data && res.data.admin === true) {
                set({ isAdmin: true, error: null });
            } else {
                set({ isAdmin: false, error: "Not an admin user" });
            }
        } catch (error: any) {
            console.error('Admin check failed:', error);
            
            // Handle different types of errors
            let errorMessage = "Failed to verify admin status";
            let shouldRetry = false;
            
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 401) {
                    if (data.message && data.message.includes('timestamp issue')) {
                        errorMessage = "Authentication timing issue - please try again";
                        shouldRetry = true;
                    } else {
                        errorMessage = "Unauthorized - Please log in";
                    }
                } else if (status === 403) {
                    errorMessage = "Access denied - Admin privileges required";
                } else if (data && data.message) {
                    errorMessage = data.message;
                    // Check if it's a timing issue that might resolve on retry
                    if (data.message.includes('timestamp') || data.message.includes('clock')) {
                        shouldRetry = true;
                    }
                }
            } else if (error.request) {
                // Network error
                errorMessage = "Network error - Unable to connect to server";
                shouldRetry = true;
            }
            
            set({ 
                isAdmin: false, 
                error: errorMessage 
            });

            // Auto-retry once for timing issues after a short delay
            if (shouldRetry && !get().isLoading) {
                console.log('Retrying admin check due to timing issue...');
                setTimeout(() => {
                    // Only retry if we're not already loading and the error is still timing-related
                    const currentState = get();
                    if (!currentState.isLoading && currentState.error?.includes('timing')) {
                        get().checkAdminStatus();
                    }
                }, 2000); // Wait 2 seconds before retry
            }
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}))

