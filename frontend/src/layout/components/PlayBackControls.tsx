import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/page/album/AlbumPage';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { icons, Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, Volume1 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'

function PlayBackControls() {

    const {currentSong,isPlaying,tooglePlay,playNext,playPrevious} = usePlayerStore();
    const [voulume,setVolume] = React.useState(75);
    const [duration,setDuration] = React.useState(0);
    const [currentTime,setCurrentTime] = React.useState(0);
    const [isDraging,setIsDraging] = React.useState(false);

    const audioRef=useRef<HTMLAudioElement>(null);

    

    useEffect(()=>{
        audioRef.current=document.querySelector("audio");

        const audio = audioRef.current;
        if(!audio){
            return;
        }
        const updateTime = () =>setCurrentTime(audio.currentTime);
        const updateDuration = () =>setDuration(audio.duration);

        audio.addEventListener("timeupdate",updateTime);
        audio.addEventListener("loadedmetadata",updateDuration);

        const handleEnded = () =>{
          usePlayerStore.setState({isPlaying:false});
      }
        audio.addEventListener("ended",handleEnded);


        return ()=>{
            audio.removeEventListener("timeupdate",updateTime);
            audio.removeEventListener("loadedmetadata",updateDuration);
            audio.removeEventListener("ended",handleEnded);
        }

      },[currentSong  ]);

      const handleseek=(value:number[])=>{
        if(audioRef.current){
            audioRef.current.currentTime=value[0];
        }

      }

  return (
    <footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
        <div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
          {/* current playing song*/}
          
          <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
            {currentSong&&(
              <>
                <img src={currentSong.imageUrl}
                alt={currentSong.title}
                className='h-14 w-14 object-cover rounded-md'
                />
                <div className='flex-1 min-w-0'>
                  <div className='font-medium truncate hover:underline cursor-pointer'>{currentSong.title}</div>
                  <div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>{currentSong.artist}</div>
                </div>
              </>
            )}
          </div>

          {/* play controls */}
          <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
            <div className='flex items-center gap-4 sm:gap-6'>
              <Button 
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400'>
                <Shuffle className='h-4 w-4'/>

              </Button>
              <Button 
              size='icon'
              variant='ghost'
              onClick={playPrevious}
              disabled={!currentSong}
              className='  hover:text-white text-zinc-400'>
                <SkipBack className='h-4 w-4'/>

              </Button>
              
              
              <Button 
              size='icon'
              onClick={tooglePlay}
              disabled={!currentSong}
              className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'>
                 {isPlaying ?(
                                <Pause className='h-5 w-5 ' />
                              ):(
                                
                                <Play className='w-5 h-5 '/>
                              )}
              </Button>


              <Button
              size='icon'
              variant='ghost'
              onClick={playNext}
              disabled={!currentSong}
              className='  hover:text-white text-zinc-400'>
                <SkipBack className='h-4 w-4 rotate-180'/>

              </Button>


              <Button
              size='icon'
              variant='ghost'
              className='hidden sm:inline-flex hover:text-white text-zinc-400'>
                <Repeat className='h-4 w-4'/>

              </Button>
            </div>

            {/* slider */}
            <div className='hidden sm:flex items-center gap-2 w-full'>
              <span className='text-xs text-zinc-400'>{formatDuration(currentTime)}</span>
              <Slider
              value={[currentTime]}
              max={duration||100}
              step={1}
              className='w-full hover:cursor-grab active:cursor-grabbing'
              onValueChange={handleseek}/>
              <div className='text-xs text-zinc-400'>{formatDuration(duration)}</div>
              </div>
            </div>
            {/* volume slider */}

            <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
              <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                <Mic2 className='h-4 w-4'/>
              </Button>
              <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                <ListMusic className='h-4 w-4'/>
              </Button>
              <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                <Laptop2 className='h-4 w-4'/>
              </Button>


            <div className='flex items-center gap-2'>
              <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                <Volume1 className='h-4 w-4'/>
              </Button>

              <Slider
              value={[voulume]}
              max={100}
              step={1}
              className='w-24 hover:cursor-grab active:cursor-grabbing'
              onValueChange={(value)=>{setVolume(value[0])
              if (audioRef.current) {
                audioRef.current.volume = value[0] / 100; // Convert to a decimal value between 0 and 1 for the volume level of the audio element
              }}}/>
            </div>
              
            </div>
          </div> 
    </footer>
  )
}

export default PlayBackControls
