import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Pause, Play, RotateCcw } from 'lucide-react';

import { SALT_BASE_AT, SALT_BEATS, SALT_DURATION, SALT_RETURN_AT, TailSaltScene } from './TailSaltScene';

const DURATION = SALT_DURATION;
const SPEED_OPTIONS = [0.5, 1, 1.5, 2];
const CODE = [
  'Salt* askForSalt(int house) {',
  '  if (house == 6) return nullptr;',
  '  if (salt[house]) return salt[house];',
  '  return askForSalt(house + 1);',
  '}',
  '',
  'askForSalt(1);',
];

export function TailRecursionMachine() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const beat = [...SALT_BEATS].reverse().find(item => time >= item.at) ?? SALT_BEATS[0];
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasAutoPlayed = useRef(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!speedOpen) return;
    const close = (event: PointerEvent) => {
      if (!speedMenuRef.current?.contains(event.target as Node)) setSpeedOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSpeedOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [speedOpen]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false); };
    update();
    query.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (container.current) observer.observe(container.current);
    return () => { observer.disconnect(); query.removeEventListener('change', update); };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion || hasAutoPlayed.current) return;
    hasAutoPlayed.current = true;
    setPlaying(true);
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!playing || !visible || !ready || reducedMotion) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      setTime(current => Math.min(DURATION, current + elapsed * speed));
    }, 33);
    return () => window.clearInterval(timer);
  }, [playing, visible, ready, reducedMotion, speed]);
  useEffect(() => { if (time >= DURATION) setPlaying(false); }, [time]);

  const isBase = time >= SALT_BASE_AT && time < SALT_RETURN_AT;
  const finished = time >= DURATION;
  const label = reducedMotion ? (finished ? 'Replay' : 'Next step') : playing ? 'Pause' : finished ? 'Replay' : 'Play';
  const toggle = () => {
    if (reducedMotion) { setTime(SALT_BEATS.find(item => item.at > time)?.at ?? 0); return; }
    if (finished) setTime(0);
    setPlaying(current => !current);
  };
  const restart = () => { setTime(0); setPlaying(!reducedMotion); };

  return (
    <div ref={container} className="mx-auto mt-5 grid max-w-xl gap-6 lg:max-w-none lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-8">
      <div className="min-w-0">
        <div className="overflow-x-auto py-4 font-mono text-xs leading-6 text-slate-900 dark:text-slate-100 sm:text-sm" aria-label="C++ tail recursion: ask the next house for salt">
          {CODE.map((line, index) => (
            <div key={index} className={`flex px-2 ${index === (isBase ? 2 : 3) ? 'bg-amber-100/80 dark:bg-amber-900/35' : ''}`}>
              <span aria-hidden="true" className="mr-4 w-5 shrink-0 select-none text-right text-slate-400">{index + 1}</span>
              <code className="whitespace-pre">{line.split(/(Salt|int|if|return|nullptr|askForSalt)/g).map((part, token) => <span key={token} className={part === 'askForSalt' ? 'text-emerald-700 dark:text-emerald-300' : /^(Salt|int|if|return|nullptr)$/.test(part) ? 'text-purple-700 dark:text-purple-300' : undefined}>{part}</span>)}</code>
            </div>
          ))}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Six houses: the cook lives at index 0, with five neighbours at indexes 1–5. <code>salt</code> holds a salt jar pointer for each house, or <code>nullptr</code> when there is none.</p>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">The recursive call is returned directly. The salt comes back unchanged; there is no calculation after the call returns.</p>
      </div>
      <div className="min-w-0">
        {visible && <TailSaltScene time={time} onReady={onReady} />}
        <div className="mt-2 flex flex-col items-center gap-2">
          <p aria-live="polite" aria-atomic="true" className="min-h-10 text-center text-sm text-slate-700 dark:text-slate-300">{beat.caption}</p>
        <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-slate-100 px-2 py-1 shadow-[5px_5px_12px_rgba(148,163,184,0.35),-5px_-5px_12px_rgba(255,255,255,0.9)] dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-[5px_5px_12px_rgba(15,23,42,0.55),-5px_-5px_12px_rgba(71,85,105,0.25)]">
          <button
            type="button"
            onClick={toggle}
            aria-label={label}
            title={label}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            onClick={restart}
            aria-label="Restart"
            title="Restart"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw size={16} />
          </button>
          <div ref={speedMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setSpeedOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={speedOpen}
              aria-label="Playback speed"
              title="Playback speed"
              className="flex h-9 items-center gap-1 rounded-full border border-slate-300 bg-white/40 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-500 dark:border-slate-600 dark:bg-slate-700/40 dark:text-slate-200 dark:hover:bg-slate-700/70"
            >
              {speed}x
              <ChevronDown size={15} aria-hidden="true" />
            </button>
            {speedOpen && (
              <div role="listbox" aria-label="Playback speed options" className="absolute right-0 top-full z-20 mt-2 min-w-20 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 shadow-[5px_5px_12px_rgba(148,163,184,0.35),-5px_-5px_12px_rgba(255,255,255,0.9)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[5px_5px_12px_rgba(15,23,42,0.55),-5px_-5px_12px_rgba(71,85,105,0.25)]">
                {SPEED_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={speed === option}
                    onClick={() => { setSpeed(option); setSpeedOpen(false); }}
                    className={`block w-full rounded-xl px-3 py-1.5 text-left text-sm font-semibold transition-colors ${speed === option ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700/70'}`}
                  >
                    {option}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default TailRecursionMachine;
