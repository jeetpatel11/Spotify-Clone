import { create } from "zustand";
import type { Song } from "@/types";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number, socket?: any) => void;
  setcurrentSong: (song: Song | null, socket?: any) => void;
  tooglePlay: (socket?: any) => void;
  playNext: (socket?: any) => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0, socket) => {
    if (songs.length === 0) {
      return;
    }
    const song = songs[startIndex];

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "Playing " + song.title,
      });
    }

    set({ queue: songs, currentSong: song, currentIndex: startIndex, isPlaying: true });
  },

  setcurrentSong: (song: Song | null, socket) => {
    if (!song) {
      return;
    }

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "Playing " + song.title,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  tooglePlay: (socket) => {
    const willStartPlaying = !get().isPlaying;
    const currentSong = get().currentSong;

    if (socket?.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: willStartPlaying && currentSong ? "Playing " + currentSong.title : "idle",
      });
    }

    set({ isPlaying: willStartPlaying });
  },

  playNext: (socket) => {
    const { currentIndex, queue } = get();
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Playing " + nextSong.title,
        });
      }

      set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true });
    } else {
      set({ isPlaying: false });

      if (socket?.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      set({ currentSong: prevSong, currentIndex: prevIndex, isPlaying: true });
    } else {
      set({ isPlaying: false });
    }
  },
}));