
import SectionGridSkeleton from './SectionGridSkeleton';
import { Button } from '@/components/ui/button';
import type { Song } from '@/types';
import PlayButton from './PlayButton';

type SectionGridProps={
    title:string,
    songs:Song[];
    isLoading:boolean;
}

function SectionGrid({title,songs,isLoading}:SectionGridProps) {
    if(isLoading){
        return <div><SectionGridSkeleton/></div>
    }
  return (
    <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl sm:text-xl font-bold'>{title}</h2>
            <Button variant='link' className='text-sm text-zinc-400 hover:text-zinc-100 transition-colors'>
                See all
            </Button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {songs.map((song)=>(
              <div key={song._id} className='   hover:bg-zinc-700/50 p-4 rounded-md hover:bg-zinc-800/100 group transition-colors cursor-pointer'>

              <div className='relative mb-4'>
                <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                    <img src={song.imageUrl} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'/>
                </div>
                {/* <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-black/90 p-2 rounded-b-md'>
                    
                    </div> */}
                    <PlayButton song={song}/>
              </div>
              <h3 className='font-medium mb-2 truncate' >{song.title}</h3>
              <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
              </div>
            ))}
        </div>

    </div>
  )
}

export default SectionGrid
