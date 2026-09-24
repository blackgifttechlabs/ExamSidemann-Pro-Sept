import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  const RETURN_STARTS = [30, 31.6, 33.2, 34.8];
  const returning = time >= 30 && time < 36.4;
  const cyc = Math.min(4, Math.max(0, Math.floor((time - 1.5) / 6)));
  const local = time - 1.5 - 6 * cyc;
  const house = returning ? (RETURN_STARTS.filter(t => time >= t).length ? 5 - RETURN_STARTS.filter(t => time >= t).length : 4) : time >= 36.4 ? 1 : cyc + 1;
  const activeLine = time >= 36.4 || time < 1.5 ? 6 : returning ? 3 : local < 1.8 ? 0 : (local < 3.1 || house === 5) ? 2 : 3;
  const note = time >= 36.4 ? 'salt is back with the cook'
    : time < 1.5 ? 'the cook starts at house 1'
    : returning ? 'return the salt, unchanged'
    : activeLine === 0 ? `entering house ${house}`
    : activeLine === 2 ? (house === 5 ? 'salt found! stop here' : 'no salt here')
    : 'pass it on to the next house';
  const dotKind: 'call' | 'ret' | null = returning ? 'ret' : (time < 30 && house < 5 && local >= 4.5) ? 'call' : null;
  const retIdx = RETURN_STARTS.filter(t => time >= t).length - 1;
  const dotProgress = dotKind === 'call' ? (local - 4.5) / 1.5 : dotKind === 'ret' ? (time - RETURN_STARTS[Math.max(0, retIdx)]) / 1.6 : 0;
  const dotLabel = dotKind === 'call' ? `house = ${house + 1}` : 'salt';

  const codeRoot = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const pathEl = useRef<SVGPathElement>(null);
  const dotEl = useRef<SVGGElement>(null);
  const [pathD, setPathD] = useState('');
  useLayoutEffect(() => {
    const measure = () => {
      const root = codeRoot.current;
      const from = rows.current[3]?.querySelector('code');
      const to = rows.current[0]?.querySelector('code');
      if (!root || !from || !to) return;
      const rb = root.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const ax = a.right - rb.left + 10, ay = a.top - rb.top + a.height / 2;
      const bx = b.right - rb.left + 10, by = b.top - rb.top + b.height / 2;
      const xr = Math.max(ax, bx) + 34;
      setPathD(`M ${ax} ${ay} C ${xr} ${ay}, ${xr} ${by}, ${bx} ${by}`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (codeRoot.current) observer.observe(codeRoot.current);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    const path = pathEl.current, dot = dotEl.current;
    if (!path || !dot || !pathD) return;
    if (!dotKind) { dot.style.visibility = 'hidden'; return; }
    const x = Math.min(1, Math.max(0, dotProgress));
    const e = x * x * x * (x * (x * 6 - 15) + 10);
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * (dotKind === 'call' ? e : 1 - e));
    dot.setAttribute('transform', `translate(${pt.x} ${pt.y}) scale(${1 + 0.25 * Math.sin(x * Math.PI)})`);
    dot.style.opacity = String(Math.min(1, x / 0.08, (1 - x) / 0.08));
    dot.style.visibility = 'visible';
  }, [pathD, dotKind, dotProgress]);

  return (
    <div ref={container} style={{ overflowAnchor: 'none' }} className="mx-auto mt-5 grid max-w-xl gap-6 lg:max-w-none lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-8">
      <div className="min-w-0">
        <div ref={codeRoot} className="relative overflow-x-auto rounded-xl border-2 border-indigo-400 bg-slate-900 px-2 py-5 font-mono text-sm font-bold leading-[2.2rem] text-white shadow-lg sm:text-lg sm:leading-[2.6rem]" aria-label="C++ tail recursion: ask the next house for salt">
          <div className="absolute right-3 top-2 z-10 rounded-full bg-yellow-300 px-3 py-0.5 text-xs font-black text-slate-900 shadow sm:text-sm">house = {house}</div>
          {CODE.map((line, index) => {
            const active = index === activeLine;
            return (
              <div key={index} ref={(el) => { rows.current[index] = el; }} className={`relative flex items-center border-l-4 px-2 transition-colors duration-300 ${active ? 'border-yellow-300 bg-slate-500/60' : 'border-transparent'}`}>
                <span aria-hidden="true" className={`mr-4 w-6 shrink-0 select-none text-right ${active ? 'text-yellow-300' : 'text-slate-400'}`}>{index + 1}</span>
                <code className="whitespace-pre">{line.split(/(house \+ 1|salt\[house\]|house == 6|Salt|int|if|return|nullptr|askForSalt)/g).map((part, token) => {
                  if (!part) return null;
                  if (active && (part === 'house + 1' || part === 'salt[house]' || part === 'house == 6')) return <span key={token} className="rounded-md bg-slate-500/60 px-1 text-yellow-300 outline outline-2 outline-offset-2 outline-yellow-300">{part}</span>;
                  const cls = part === 'askForSalt' ? 'text-fuchsia-300' : /^(Salt|int|if|return|nullptr)$/.test(part) ? 'text-sky-300' : undefined;
                  return <span key={token} className={cls}>{part}</span>;
                })}</code>
                {active && <span key={`${activeLine}-${house}`} className="absolute right-3 top-1/2 hidden -translate-y-1/2 animate-pulse whitespace-nowrap rounded-md bg-emerald-500/25 px-2 text-xs font-black text-emerald-300 sm:inline sm:text-sm">← {note}</span>}
              </div>
            );
          })}
          {pathD && (
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <path ref={pathEl} d={pathD} fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity={dotKind ? 0.7 : 0.15} />
              <g ref={dotEl} style={{ visibility: 'hidden' }}>
                <rect x="-46" y="-15" width="92" height="30" rx="15" fill={dotKind === 'ret' ? '#6ee7b7' : '#fde047'} stroke="#fff" strokeWidth="2.5" />
                <text textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">{dotLabel}</text>
              </g>
            </svg>
          )}
        </div>
        <ul className="mt-5 space-y-3 text-lg font-medium leading-snug text-slate-800 dark:text-slate-100 sm:text-xl">
          {[
            <>The call is the <span className="rounded-md bg-slate-500/60 px-1.5 py-0.5 font-black text-cyan-300">last step</span>.</>,
            <>No salt here? <span className="rounded-md bg-slate-500/60 px-1.5 py-0.5 font-black text-lime-300">Pass it on</span> to <code className="font-black">house + 1</code>.</>,
            <>Salt found: <span className="rounded-md bg-slate-500/60 px-1.5 py-0.5 font-black text-emerald-300">return the jar</span>, unchanged.</>,
            <>House <span className="rounded-md bg-slate-500/60 px-1.5 py-0.5 font-black text-yellow-300">6</span>: no houses left, return <code className="font-black">nullptr</code>.</>,
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-black text-white">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <div className="h-[606px] sm:h-[646px]" style={{ overflowAnchor: 'none' }}>{visible && <TailSaltScene time={time} onReady={onReady} />}</div>
        <div className="mt-2 flex flex-col items-center gap-2">
          <p aria-live="polite" aria-atomic="true" className="sr-only">{beat.caption}</p>
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
