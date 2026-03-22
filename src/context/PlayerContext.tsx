import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { getStreamUrl } from "@/api/beats";
import type { Beat } from "@/api/types";

type PlayerState = {
  activeBeat: Beat | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  play: (beat: Beat) => void;
  togglePlayPause: () => void;
  seek: (timeInSeconds: number) => void;
  setVolume: (v: number) => void;
  isActive: (beatId: number) => boolean;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeBeat, setActiveBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const play = useCallback((beat: Beat) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Same beat: toggle
    if (activeBeat?.id === beat.id) {
      if (audio.paused) {
        void audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    // New beat
    const url = getStreamUrl(beat);
    if (!url) return;

    setActiveBeat(beat);
    audio.src = url;
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    void audio.play();
    setIsPlaying(true);
  }, [activeBeat?.id]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !activeBeat) return;

    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [activeBeat]);

  const seek = useCallback((timeInSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const isActive = useCallback((beatId: number) => activeBeat?.id === beatId, [activeBeat?.id]);

  return (
    <PlayerContext.Provider value={{
      activeBeat, isPlaying, duration, currentTime, volume,
      play, togglePlayPause, seek, setVolume, isActive,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
