import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { Message } from "@/types";
import { io } from "socket.io-client";

interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  socket:any;
  isconnected:boolean;
  onlineUsers:Set<string>;
  userActivities:Map<string,string>;
  messages:Message[];
  fetchUsers: (token: string) => Promise<void>;
  initSocket:(userId:string)=>void;
  disconnectSocket:()=>void;
  sendMessage:(recevierId:string,senderId:string,content:string)=>void;
}

const baseUrl="https://localhost:3000";

const socket=io(baseUrl,{
  autoConnect:false, //only connect when user
  withCredentials:true, //send cookies
});

export const useChatStore = create<ChatStore>((set,get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket:null,
  isconnected:false,
  onlineUsers:new Set(),
  userActivities:new Map(),
  messages:[],

 

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

  initSocket:(userId:string)=>{
    if(!get().isconnected){
      socket.auth={
        userId,
      };
      socket.connect(); 
      socket.connect();
      socket.emit("setup",userId);
      socket.on("user_online",(users:string[])=>{
        set({onlineUsers:new Set(users)})
      })

      socket.on("activites",(activites:[string,string][])=>{
        set({userActivities:new Map(activites)})
      })

      socket.on("user_connected",(userId:string)=>{
        set((state) => ({onlineUsers: new Set([...state.onlineUsers, userId])}))
      })

      socket.on("user_disconnected",(userId:string)=>{
        set((state)=>{
          const newOnlineUsers=new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return {onlineUsers:newOnlineUsers};
        })
      })

      socket.on("receive_message",(message:Message)=>{
        set((state)=>({
            messages:[...state.messages,message],
        }));
      })


      socket.on("message_sent",(message:Message)=>{
        set((state)=>({
            messages:[...state.messages,message],
        }));
      })


      socket.on("activity_updated",({userId,activity})=>{
        set((state)=>{
          const newUserActivities=new Map(state.userActivities);
          newUserActivities.set(userId,activity);
          return {userActivities:newUserActivities};
        })
      })


      set({socket,isconnected:true});



    } 
  },

  disconnectSocket:()=>{
    if(get().isconnected){
      socket.disconnect();
      
      set({isconnected:false});
    }
  },

  sendMessage:(recevierId:string,senderId:string,content:string)=>{
    
  }




}));
