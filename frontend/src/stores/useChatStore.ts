import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";



interface ChatStore{
    users:any[],
    isLoading:boolean,
    error:string|null,
    
    fetchUsers:()=>Promise<void>;

}


export const useChatStore=create<ChatStore>((set,get)=>({
    users:[],
    isLoading:false,
    error:null,
    fetchUsers:async()=>{
        set({isLoading:true});
        try{
            const res=await axiosInstance.get('/users');
            set({users:res.data});
        }catch(error){
            console.log(error);
        }
    }

}))