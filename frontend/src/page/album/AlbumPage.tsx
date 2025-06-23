import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/stores/useMusicStore';
import { Clock, Play } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function AlbumPage() {
    const {id}=useParams()
    console.log("album ",{id})
    const {fetchAlbumById,currentAlbum,isLoading}=useMusicStore();
    console.log({currentAlbum})

    useEffect(()=>{
        if(id) fetchAlbumById(id)
    },[fetchAlbumById,id])



    const formatDuration=(duration: number)=>{
        const minutes=Math.floor(duration/60);
        const seconds=Math.floor(duration%60);
        return `${minutes}:${seconds.toString().padStart(2,'0')}`
    }

  return (
    <div className='h-full '>
        <ScrollArea className='h-full  scrollbar-hide rounded-md'>

            {/*MAIN CoNTENT*/ }

            <div className='relative h-screen'>
                {/*bg gradiant*/ }
               <div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
               to-zinc-900 pointer-events-none' aria-hidden="true"
               />
                {/*Content*/ }
                    <div className='relative z-10'>
                        <div className='flex p-6 gap-6 pb-6'>
                            <img 
                            src={currentAlbum?.imageUrl} 
                            alt={currentAlbum?.title} 
                            className='w-[240px] h-[240px] shadow-xl rounded'/>
                            <div className='flex flex-col justify-end'>
                                <p className='text-sm font-medium'>
                                 Album
                                </p>
                                <h1 className='text-7xl font-bold my-4'>{currentAlbum?.title } </h1>
                                <div className='flex gap-2 items-center  text-sm text-zinc-100 '>
                                    <span className=' font-medium text-white'>
                                        {currentAlbum?.artist} 
                                    </span>
                                    <span >
                                         ●  {currentAlbum?.songs?.length} songs
                                    </span>
                                    <span >
                                        ● {currentAlbum?.realeaseYear}
                                    </span>
                                </div>    
                            </div>
                        </div>

                        {/* play button*/ }
                        <div className='px-6 pb-4 flex items-center gap-6'>
                            <Button
                            size='icon'
                            className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all '
                            >
                                <Play className='w-7 h-7 text-black'/>
                            </Button>
                        </div>

                        {/*Table section*/}
                        <div className='bg-black/20 backdrop-blur-sm'>
                        {/*Table section*/}
                        <div className='grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm font-semibold text-zinc-400 border-b border-white/10'>

                            <div>#</div>
                            <div>Title</div>
                            <div>Released Date</div>
                            <div>
                                <Clock className='h-4 w-4'/>
                            </div>
                        </div>

                        {/* Song list */}

                        <div >
  <div>
    {currentAlbum?.songs?.map((song, index) => (
      <div key={song._id}>
        {/* Apply group HERE */}
        <div className='group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm rounded-sm text-zinc-400 border-b border-white/5 hover:bg-white/5 transition'>
          <div className='flex items-center justify-center'>
            {/* This will toggle correctly on group hover now */}
            <span className='group-hover:hidden'>{index + 1}</span>
            <Play className='hidden group-hover:block h-4 w-4 text-white' />
          </div>

          <div className='flex items-center gap-2'>
            <img
              src={song.imageUrl}
              alt={song.title}
              className='size-10'
            />
            <div>
              <div className='font-medium text-white'>{song.title}</div>
              <div>{song.artist}</div>
            </div>
          </div>

          <div className='flex items-center'>
            {song.createdAt.split("T")[0]}
          </div>
          <div className='flex items-center'>{formatDuration(song.duration)}</div>
        </div>
      </div>
    ))}
  </div>
</div>

                        </div>
                    </div> 
            </div>
        </ScrollArea>
    </div>
  )
}

export default AlbumPage
