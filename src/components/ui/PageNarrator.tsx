/**
 * PageNarrator.tsx
 *
 * A play button that lives in the top-bar. When clicked it:
 *  1. Scrapes the meaningful text visible on the current page.
 *  2. Sends it to Gemini to be rewritten as a warm, friendly spoken explanation
 *     with natural human expressions like [laughs], [pauses], [sighs].
 *  3. Converts that explanation to speech via Gemini TTS.
 *  4. Plays the audio back with a floating mini-player bar (pause / stop / progress).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Loader2,
  Volume2,
  X,
  Sparkles,
} from 'lucide-react';
import { requestGeminiCompletion, requestGeminiSpeech } from '../../services/gemini';

// ─── Types ────────────────────────────────────────────────────────────────────

type NarratorState = 'idle' | 'generating' | 'loading-audio' | 'playing' | 'paused' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Scrapes meaningful text from the page, ignoring navigation, header, footer,
 * code blocks and scripts so the AI gets only study-content.
 */
function scrapePageText(): string {
  const clone = document.body.cloneNode(true) as HTMLElement;

  const remove = (selector: string) =>
    clone.querySelectorAll(selector).forEach((el) => el.remove());
  remove('header, nav, footer, script, style, noscript, [aria-hidden="true"]');
  remove('[data-narrator-ignore]');
  remove('button, input, textarea, select, [role="navigation"], [role="banner"], [role="complementary"]');

  const rawText = clone.innerText || clone.textContent || '';

  return rawText
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 6000);
}

/**
 * Builds the Gemini prompt that turns raw notes into a warm, human-like spoken
 * explanation with natural voice expressions.
 */
function buildNarratorPrompt(pageText: string): string {
  return `You are a warm, engaging tutor explaining study notes out loud to a student.
Your job is to turn the raw notes below into a clear, friendly spoken explanation.

Rules:
- Speak in plain, conversational English — like talking to a friend, not reading a textbook.
- Break every complex idea into simple, clear sentences.
- Use natural human speech expressions where they naturally fit.
  Use ONLY these expression tags exactly: [laughs], [chuckles], [sighs], [pauses], [exhales], [clears throat], [hmm], [wow].
  Place them inline, e.g. "And that is actually pretty cool [laughs] — let me explain why."
- Do not use bullet lists or headers — speak continuously in paragraphs.
- Do not invent facts. Only explain what is in the notes.
- Keep it around 250-400 words. Prioritise the most important points.
- Start with a warm greeting like "Alright, let us dig into this together."
- End with a short encouraging closing like "And that is the key idea — you have got this!"

Raw notes:
"""
${pageText}
"""

Now write the spoken explanation:`;
}

// ─── Waveform animation ───────────────────────────────────────────────────────

const WaveBar: React.FC<{ delay: number; active: boolean }> = ({ delay, active }) => (
  <motion.div
    className="w-0.5 rounded-full bg-current"
    animate={active ? {
      height: ['6px', '16px', '4px', '14px', '6px'],
    } : { height: '4px' }}
    transition={active ? {
      duration: 0.9,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    } : { duration: 0.2 }}
  />
);

const Waveform: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="flex items-center gap-0.5 h-4">
    {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.6, 0.45].map((delay, i) => (
      <WaveBar key={i} delay={delay} active={active} />
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const PageNarrator: React.FC = () => {
  const [state, setState] = useState<NarratorState>('idle');
  const [statusText, setStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [narrationText, setNarrationText] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);
  const abortRef = useRef(false);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stopAudioCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAudioCleanup = () => {
    abortRef.current = true;
    audioQueueRef.current.clear();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
  };

  // ── Stop helper (public) ─────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    abortRef.current = true;
    audioQueueRef.current.clear();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setState('idle');
    setShowPlayer(false);
    setCurrentTime(0);
    setDuration(0);
    setNarrationText('');
  }, []);

  // ── Chunk text into sentences ────────────────────────────────────────────
  const chunkTextIntoSentences = (text: string): string[] => {
    // Split by sentence-ending punctuation, but handle edge cases
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 10) // Only keep meaningful chunks
      .map((s, i, arr) => {
        // For the last chunk, combine short sentences
        if (i === arr.length - 1 && s.length < 30 && i > 0) {
          return null;
        }
        return s;
      })
      .filter((s): s is string => s !== null);
  };

  // ── Audio queue management ──────────────────────────────────────────────
  const audioQueueRef = useRef<Map<number, Blob>>(new Map());
  
  const playAudioQueue = useCallback(async (totalChunks: number) => {
    // Play all chunks in order
    for (let i = 0; i < totalChunks && !abortRef.current; i++) {
      let blob = audioQueueRef.current.get(i);
      
      // Wait for chunk to be available (with timeout)
      let waitCount = 0;
      while (!blob && waitCount < 300) { // 30 seconds max wait
        await new Promise(resolve => setTimeout(resolve, 100));
        blob = audioQueueRef.current.get(i);
        waitCount++;
      }
      
      if (!blob || abortRef.current) continue;
      
      try {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        
        let resolvePlay: (() => void) | null = null;
        const playPromise = new Promise<void>(resolve => {
          resolvePlay = resolve;
        });
        
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(url);
          if (resolvePlay) resolvePlay();
        }, { once: true });
        
        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration || 0);
        });
        
        await audio.play();
        setState('playing');
        setStatusText('');
        await playPromise;
      } catch (err) {
        console.error(`Error playing audio chunk ${i}:`, err);
      }
    }
    
    // Clean up queue
    audioQueueRef.current.clear();
    if (!abortRef.current) {
      setState('idle');
      setShowPlayer(false);
      setCurrentTime(0);
    }
  }, []);

  // ── Main narrate flow with streaming ────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (state === 'paused' && audioRef.current) {
      audioRef.current.play();
      setState('playing');
      return;
    }

    if (state === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setState('paused');
      return;
    }

    if (state === 'generating' || state === 'loading-audio') return;

    abortRef.current = false;
    setErrorMsg('');
    setNarrationText('');
    audioQueueRef.current.clear();
    setState('generating');
    setShowPlayer(true);
    setStatusText('Understanding the page…');

    try {
      const pageText = scrapePageText();
      if (!pageText || pageText.length < 30) {
        throw new Error('Not enough page content to narrate.');
      }

      setStatusText('Crafting explanation…');
      const prompt = buildNarratorPrompt(pageText);
      const explanation = await requestGeminiCompletion({
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 800,
        temperature: 0.72,
      });

      if (abortRef.current) return;
      setNarrationText(explanation);

      setState('loading-audio');
      setStatusText('Generating voice (streaming)…');
      
      // Split into sentences and convert to speech in parallel
      const sentences = chunkTextIntoSentences(explanation);
      if (sentences.length === 0) {
        throw new Error('Could not break explanation into chunks.');
      }
      
      // Generate all audio chunks in parallel
      const audioGenerationPromises = sentences.map(async (sentence, idx) => {
        try {
          const audioBlob = await requestGeminiSpeech(sentence, 'Kore');
          audioQueueRef.current.set(idx, audioBlob);
          setStatusText(`Generating voice (${audioQueueRef.current.size}/${sentences.length})…`);
        } catch (err) {
          console.error(`Failed to generate audio for chunk ${idx}:`, err);
        }
      });

      // Wait for all chunks to be generated
      await Promise.all(audioGenerationPromises);

      if (abortRef.current) return;

      // Play all queued chunks sequentially
      await playAudioQueue(sentences.length);
    } catch (err: unknown) {
      if (!abortRef.current) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        setErrorMsg(msg);
        setState('error');
        setStatusText('');
        setTimeout(() => {
          setState('idle');
          setShowPlayer(false);
          setErrorMsg('');
        }, 5000);
      }
    }
  }, [state, playAudioQueue]);

  // ── Seek ─────────────────────────────────────────────────────────────────
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  // ── Derived ──────────────────────────────────────────────────────────────
  const isLoading = state === 'generating' || state === 'loading-audio';
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isError = state === 'error';

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* ── Play button (lives in header) ───────────────────────────────────── */}
      <button
        onClick={handlePlay}
        disabled={isError}
        title={
          isLoading ? statusText :
          isPlaying ? 'Pause narration' :
          isPaused ? 'Resume narration' :
          'Explain this page aloud'
        }
        className={[
          'relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold',
          'transition-all duration-200 select-none shrink-0',
          isLoading
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 cursor-wait'
            : isError
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 cursor-default'
            : isPlaying
            ? 'bg-violet-600 dark:bg-violet-500 text-white shadow-lg shadow-violet-500/30'
            : isPaused
            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-400/60'
            : 'bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 border border-gray-200 dark:border-white/10',
        ].join(' ')}
      >
        {isLoading ? (
          <Loader2 size={13} className="animate-spin shrink-0" />
        ) : isPlaying ? (
          <Pause size={13} className="shrink-0" />
        ) : (
          <Play size={13} className="shrink-0" />
        )}
        <span className="hidden sm:inline whitespace-nowrap">
          {isLoading ? 'Generating…' :
           isPlaying ? 'Pause' :
           isPaused ? 'Resume' :
           'Listen'}
        </span>
        {!isLoading && !isPlaying && !isPaused && !isError && (
          <Sparkles size={10} className="hidden sm:inline shrink-0 opacity-60" />
        )}
      </button>

      {/* ── Floating mini-player bar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 w-[min(440px,calc(100vw-2rem))]"
          >
            <div className="flex flex-col gap-2 rounded-2xl bg-white/95 dark:bg-[#1a1a2e]/95 border border-violet-200/60 dark:border-violet-500/20 shadow-2xl shadow-violet-900/10 backdrop-blur-xl px-4 py-3">
              {/* Top row */}
              <div className="flex items-center gap-3">
                {/* Icon orb */}
                <div className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  isPlaying
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/40'
                    : 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300',
                ].join(' ')}>
                  {isLoading
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Volume2 size={15} />}
                </div>

                {/* Label + waveform */}
                <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {isLoading ? statusText :
                       isError ? 'Narration failed' :
                       'Page Explanation'}
                    </span>
                    {isPlaying && (
                      <span className="shrink-0 rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
                        Live
                      </span>
                    )}
                  </div>

                  {(isPlaying || isPaused) && (
                    <div className={`text-violet-500 dark:text-violet-400 ${isPaused ? 'opacity-40' : ''}`}>
                      <Waveform active={isPlaying} />
                    </div>
                  )}
                  {isLoading && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by Gemini AI</p>
                  )}
                  {isError && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 truncate">{errorMsg}</p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {(isPlaying || isPaused) && (
                    <>
                      <button
                        onClick={handlePlay}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow"
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                      <button
                        onClick={stopAudio}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
                        title="Stop"
                      >
                        <Square size={12} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={stopAudio}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Seek bar */}
              {(isPlaying || isPaused) && duration > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500 w-8 shrink-0">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.5}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 accent-violet-600 cursor-pointer"
                  />
                  <span className="text-[10px] tabular-nums text-slate-400 dark:text-slate-500 w-8 shrink-0 text-right">
                    {formatTime(duration)}
                  </span>
                </div>
              )}

              {/* Narration text preview */}
              {narrationText && !isLoading && (
                <details className="group">
                  <summary className="cursor-pointer text-[10px] font-bold text-violet-500 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 list-none select-none flex items-center gap-1 mt-0.5">
                    <Sparkles size={9} />
                    View explanation text
                  </summary>
                  <p className="mt-1.5 max-h-36 overflow-y-auto text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap pr-1">
                    {narrationText}
                  </p>
                </details>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
