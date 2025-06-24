import { usePlayerStore } from '@/stores/usePlayerStore';
import React, { useEffect, useRef } from 'react';

function AudioPlayer() {
  const audioref = useRef<HTMLAudioElement | null>(null);
  const prevSongRef = useRef<string | null>(null);
  const { currentSong, isPlaying,playNext } = usePlayerStore();

  useEffect(() => {
    if (isPlaying) {
      audioref.current?.play();
    } else {
      audioref.current?.pause();
    }
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioref.current;
    const handleEnded = () => {
        playNext();
    };
    audio?.addEventListener('ended', handleEnded);
    return () => {
      audio?.removeEventListener('ended', handleEnded);
    };
  }, [playNext]); // Or [playNext] if it's from context

  // handle song changes
  useEffect(() => {
    if (!audioref.current || !currentSong) {
      return;
    }

    const audio = audioref.current;
    const isSongChange = prevSongRef.current !== currentSong.audioUrl;

    if (isSongChange) {
      if (audio && currentSong.audioUrl) {
        audio.src = currentSong.audioUrl;
        audio.currentTime = 0;
        prevSongRef.current = currentSong.audioUrl;
        if (isPlaying) {
          audio.play();
        }
      }
    }
  }, [currentSong,isPlaying]);

  return <audio ref={audioref} />;
}

export default AudioPlayer;
