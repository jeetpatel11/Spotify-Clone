import { axiosInstance } from '@/lib/axios';
import { Album } from 'lucide-react';
import {create} from 'zustand';

interface MusicStore{
    songs:any[],
    albums:any[],
    isLoading:boolean,
    error:string|null


    fetchAlbums:()=>Promise<void>;
}

export const useMusicStore=create<MusicStore>((set,get)=>({
    albums:[],
    songs:[],
    isLoading:false,
    error:null,


    fetchAlbums:async()=>{
        
        set({isLoading:true,error:null})

        try{
            const res=await axiosInstance.get("/albums");
            set({albums:res.data})
        }
        catch (e)
        {
            set({ error: e instanceof Error ? e.message : String(e) })
        }
        finally
        {
            set({isLoading:false});
        }
    }
}))