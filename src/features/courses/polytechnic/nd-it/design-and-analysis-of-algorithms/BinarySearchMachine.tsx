import React, { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const LIST = [2, 5, 8, 12, 16, 23, 38, 56];
const TARGET = 38;
const STEPS: { l: number; r: number; m: number | null; text: string; found?: boolean }[] = [
  { l: 0, r: 7, m: null, text: 'Look for 38. Start with the whole list.' },
  { l: 0, r: 7, m: 3, text: 'Check the middle: 12.' },
  { l: 4, r: 7, m: 3, text: '12 is too small. Drop the left half.' },
  { l: 4, r: 7, m: 5, text: 'Check the new middle: 23.' },
  { l: 6, r: 7, m: 5, text: '23 is too small. Drop the left half again.' },
  { l: 6, r: 7, m: 6, text: 'Check the middle: 38.' },
  { l: 6, r: 7, m: 6, text: '38 found at index 6!', found: true },
];
const SPEEDS = [0.5, 1, 1.5, 2];

export function BinarySearchMachine() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const cur = STEPS[step];
  const last = step === STEPS.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (last) { setPlaying(false); return; }
    const t = window.setTimeout(() => setStep((s) => s + 1), 2800 / speed);
    return () => window.clearTimeout(t);
  }, [playing, step, speed, last]);

  const toggle = () => { if (last) { setStep(0); setPlaying(true); } else setPlaying((p) => !p); };
  const restart = () => { setStep(0); setPlaying(true); };
  const btn = 'grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50';

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-semibold text-slate-500">
          Find <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-600">{TARGET}</span> in the sorted list
        </p>

        <div className="mt-6 grid grid-cols-8 gap-1.5 sm:gap-2">
          {LIST.map((n, i) => {
            const inside = i >= cur.l && i <= cur.r;
            const isMid = cur.m === i;
            const hit = cur.found && isMid;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`grid aspect-square w-full place-items-center rounded-xl border font-mono text-base font-bold transition-all duration-700 ease-in-out sm:text-xl ${
                    hit ? 'scale-110 border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : isMid ? 'scale-110 border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : inside ? 'border-slate-300 bg-white text-slate-800'
                    : 'border-slate-100 bg-slate-50 text-slate-300'
                  }`}
                >
                  {n}
                </div>
                <span className="text-[10px] text-slate-400 sm:text-xs">{i}</span>
                <span className="h-4 text-[10px] font-bold leading-4 sm:text-xs">
                  {i === cur.l && <span className="text-emerald-600">L</span>}
                  {isMid && <span className="text-indigo-600">M</span>}
                  {i === cur.r && <span className="text-rose-500">R</span>}
                </span>
              </div>
            );
          })}
        </div>

        <p
          key={step}
          className={`mt-5 text-lg font-semibold leading-snug transition-opacity duration-500 sm:text-xl ${cur.found ? 'text-emerald-600' : 'text-slate-800'}`}
        >
          {cur.text}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : last ? 'Replay' : 'Play'} className={btn}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
        <button type="button" onClick={restart} aria-label="Restart" className={btn}><RotateCcw size={15} /></button>
        <button type="button" onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])} aria-label="Playback speed" className={`${btn} w-auto px-3 text-sm font-semibold`}>{speed}x</button>
      </div>
    </div>
  );
}

export default BinarySearchMachine;
