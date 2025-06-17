import { axiosInstance } from '@/lib/axios';
import type { Album, Song } from '@/types';
import {create} from 'zustand';

interface MusicStore{
    songs:Song[],
    albums:Album[],
    isLoading:boolean,
    error:string|null,
    currentAlbum:Album|null,


    fetchAlbums:()=>Promise<void>;
    fetchAlbumById:(id:string)=>Promise<void>;

}

export const useMusicStore=create<MusicStore>((set,get)=>({
    albums:[],
    songs:[],
    isLoading:false,
    error:null,
    currentAlbum:null,


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
    },

    fetchAlbumById:async(id)=>{
        set({isLoading:true,error:null})

        try{
            const res=await axiosInstance.get(`/albums/${id}`);
            set({currentAlbum:res.data})
        }
        catch (e)
        {
            set({ error: e instanceof Error? e.message : String(e) })
        }
        finally
        {
            set({isLoading:false});
        }
    }
}))