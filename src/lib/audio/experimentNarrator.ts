import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";

export interface NarratorHandle {
  play: (src: string, onEnded?: () => void, startAtSeconds?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  currentSrc: string | null;
  /**
   * The element doing the talking. Captions and any scene action that has to
   * land on a particular word read `currentTime` off this rather than running
   * their own timers, so nothing can drift away from the voice.
   */
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}

/**
 * Owns one reusable HTMLAudioElement for an experiment. Every new play request
 * interrupts the previous clip, so menus, guide interactions and walkthroughs
 * can safely share the same narrator without overlapping voices.
 */
export function useExperimentNarrator(): NarratorHandle {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endedCallbackRef = useRef<(() => void) | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const playRequestRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    const handlePause = () => {
      const hasActiveClip = currentSrcRef.current !== null;
      setIsPlaying(false);
      // A user can pause while the clip is still buffering at currentTime 0.
      // It is still a resumable active clip, so keep the paused UI state.
      setIsPaused(hasActiveClip && !audio.ended);
    };
    const handleEnded = () => {
      const onEnded = endedCallbackRef.current;
      endedCallbackRef.current = null;
      currentSrcRef.current = null;
      setCurrentSrc(null);
      setIsPlaying(false);
      setIsPaused(false);
      onEnded?.();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      playRequestRef.current += 1;
      endedCallbackRef.current = null;
      currentSrcRef.current = null;
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    playRequestRef.current += 1;
    endedCallbackRef.current = null;
    currentSrcRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentSrc(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const play = useCallback((src: string, onEnded?: () => void, startAtSeconds = 0) => {
    const audio = audioRef.current;
    if (!audio) return;

    playRequestRef.current += 1;
    const requestId = playRequestRef.current;
    endedCallbackRef.current = null;
    currentSrcRef.current = null;
    audio.pause();
    audio.currentTime = 0;

    currentSrcRef.current = src;
    endedCallbackRef.current = onEnded ?? null;
    setCurrentSrc(src);
    setIsPaused(false);
    audio.src = src;
    audio.load();
    if (startAtSeconds > 0) {
      audio.currentTime = startAtSeconds;
    }

    void audio.play().catch(() => {
      if (playRequestRef.current !== requestId) return;
      endedCallbackRef.current = null;
      currentSrcRef.current = null;
      setCurrentSrc(null);
      setIsPlaying(false);
      setIsPaused(false);
    });
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused || audio.ended || !currentSrcRef.current) return;
    audio.pause();
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.paused || audio.ended || !currentSrcRef.current) return;
    const requestId = playRequestRef.current;
    void audio.play().catch(() => {
      if (playRequestRef.current !== requestId) return;
      setIsPlaying(false);
      setIsPaused(true);
    });
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    currentSrc,
    audioRef,
  };
}
