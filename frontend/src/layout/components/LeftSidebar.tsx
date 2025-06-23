import { buttonVariants } from '@/components/ui/button'
import { HomeIcon, Library, LibraryBigIcon, MessageCircleIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SignedIn } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import  PlaylistSkeloton  from '@/skelotons/PlaylistSkeleton.tsx'
import { useEffect, useState } from 'react'
import { useMusicStore } from '@/stores/useMusicStore'


function LeftSidebar() {

  const {songs,albums,fetchAlbums,isLoading}=useMusicStore();

    useEffect(()=>{
      fetchAlbums()
    },[fetchAlbums])

  console.log({albums})

  return (
    <div className='flex h-full flex-col gap-2'>

      {/* Navigation Menu */ }
      <div className='rounded-lg bg-zinc-900 p-4 '>
        <div className='space-y-2 items-start'>
            
          <Link 
          to={'/'}
          className={cn(
            buttonVariants({
            variant:'ghost',
            className: 'w-full justify-start hover:bg-zinc-800 text-white'
          })
        )}
          >
            <HomeIcon className='mr-2 size-5'/>
            <span className='hidden md:inline'>Home</span>
          </Link>
          
          <SignedIn>
          <Link 
          to={'/chat'}
          className={cn(
            buttonVariants({
            variant:'ghost',
            className:'w-full justify-start hover:bg-zinc-800 text-white '
          })
        )}
          >
            <MessageCircleIcon className='mr-2 size-5'/>
            <span className='hidden md:inline'>Message</span>
          </Link>
          </SignedIn>
           
        </div>
      </div>

      {/* Library section */ }

        <div className='flex-1 rounded-lg bg-zinc-900 p-4'>
          <div className=' items-center justify-center mb-4'>
            <div className='flex items-center text-white px-2'>
              <Library className='size-5 mr-2' />
              <span className=' hidden md:inline'>Playlist</span>
            </div>
          </div>

          <ScrollArea className='h-[calc(100bh-300px)]'>
            <div className='space-y-2'>
              {isLoading?(
                <PlaylistSkeloton/>
              ):(
                albums.map((album)=>{
                  return(
                    <Link to={`/albums/${album._id}`} 
                    key={album._id}
                    className='p-2 hover:bg-zinc-800 rounded-md flex item-center gap-3 group cursor-pointer'
                    >
                      <img src={album.imageUrl} alt={album.title} className='size-12  rounded-md flex-shrink-0 object-cover '/>
                      <div className='felx-1 min-w-0 hidden md:block text-white'>
                        <p className='font-medium truncate'>{album.title}</p>
                        <p className='text-xs text-zinc-400 group-hover:text-white truncate'>{album.artist}</p>
                      </div>
                    
                    </Link>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
    </div>
  )
}

export default LeftSidebar
