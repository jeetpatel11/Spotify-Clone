import TopBar from '@/components/TopBar'
import FeaturedGridSkeleton from '@/skelotons/FeaturedGridSkeleton';
import { useMusicStore } from '@/stores/useMusicStore';
import React, { useEffect } from 'react'
import FeaturedSection from './components/FeaturedSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import SectionGrid from './components/SectionGrid';

function HomePage() {

  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    error,
    madeForYouSongs,
    featuredSongs,
    trendingSongs
  } = useMusicStore();
  


    useEffect(() => {
      fetchFeaturedSongs();
      fetchMadeForYouSongs();
      fetchTrendingSongs();
    },[fetchFeaturedSongs,
      fetchMadeForYouSongs,
      fetchTrendingSongs
    ])


  return (
    <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
      <TopBar/>
      <ScrollArea className='h-[calc(100vh-180px)]'>
        <div className='p-4 sm:p-6'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good Afternoon</h1>
          <FeaturedSection/>

        <div className='space-y-8'>
          <SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title='Trending' songs={trendingSongs}  isLoading={isLoading} />
        </div>

        </div>
      </ScrollArea>
    </main>
  )
}

export default HomePage
