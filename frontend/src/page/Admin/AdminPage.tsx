import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'
import DashboardStats from './component/DashboardStats';
import Headre from './component/Headre';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Album, Music } from 'lucide-react';
import { TabsContent } from '@radix-ui/react-tabs';
import AlbumsTabContent from './component/AlbumsTabContent';
import SongsTabContent from './component/SongsTabContent';
import { useMusicStore } from '@/stores/useMusicStore';

function AdminPage() {

  const {isAdmin,isLoading}=useAuthStore();

  const {fetchSongs,fetchAlbums,fetchstats}=useMusicStore();
  const {checkAdminStatus}=useAuthStore();

  useEffect(()=>{
    checkAdminStatus();
  },[])

  useEffect(()=>{
    fetchSongs();
    fetchAlbums();
    fetchstats();

  },[fetchSongs,fetchAlbums,fetchstats])

  if(!isAdmin&& !isLoading) return <div>Unauthorized</div>  

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8'>
      <Headre/>

      <DashboardStats/>

      <Tabs defaultValue='songs' className='space-y-6'>
        <TabsList className='p-1 bg-zinc-800/50'>
          <TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
            <Music className='mr-2 size=4'/>
            Songs
          </TabsTrigger>
          <TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
            <Album className='mr-2 size=4'/>
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value='songs'>
          <SongsTabContent />
        </TabsContent>
        
        <TabsContent value='albums'>
          <AlbumsTabContent/>
        </TabsContent>


      </Tabs>
    </div>
  )
}

export default AdminPage
