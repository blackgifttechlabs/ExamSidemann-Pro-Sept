import { MathPowers, powerTokens } from './mathPowers';
import React, { useState, useRef, useEffect, type ComponentType } from 'react';

/*
 * Shared lesson engine for the maths lessons (Variation, Probabilities).
 * A lesson is a list of blocks: see variationLessonData.ts for the format.
 * Extra block: { diagram: 'name', caption? } draws a component from the
 * `diagrams` registry passed to <VariationLesson>.
 */

// Pen-written step solver (same behaviour as the one in the Inequalities lesson):
// each line is written out letter by letter, with a short reason underneath.
export const HandLine = ({ text, upTo, live }: { text: string; upTo: number; live: boolean }) => {
  const tokens = powerTokens(text);
  const displayLength = tokens.reduce((sum, token) => sum + token.text.length * (token.power ? 0.7 : 1), 0);
  // Size the drawing to the line, so short lines stay large on a phone.
  const width = Math.min(760, Math.max(240, Math.ceil(displayLength * 15.5) + 24));
  return (
    <svg viewBox={`0 0 ${width} 44`} className="block h-auto w-full" style={{ overflow: 'visible', maxWidth: width, marginInline: 0 }} role="img" aria-label={text}>
      <text x="2" y="32" className="gc-ink" fontSize="28" fontWeight="700" style={{ whiteSpace: 'pre' }}>
        {tokens.map((token, tokenIndex) => {
          const count = Math.max(0, upTo - token.start - token.offset);
          const shown = token.text.slice(0, count);
          if (!shown) return null;
          return <tspan key={tokenIndex} baselineShift={token.power ? 'super' : 'baseline'} fontSize={token.power ? 19 : 28}>
            {shown.split('').map((ch, j) => {
              const isNew = live && token.start + token.offset + j === upTo - 1;
              return <tspan key={j} fill="#1e3a8a" stroke="#1e3a8a" strokeLinejoin="round" strokeLinecap="round"
                strokeWidth={0.4} strokeDasharray={isNew ? 240 : undefined}
                style={isNew ? { animation: 'dvWrite 0.9s ease-in-out forwards' } : undefined}>
                {ch === ' ' ? '\u00A0' : ch}
              </tspan>;
            })}
          </tspan>;
        })}
      </text>
    </svg>
  );
};

export const PenSolver = ({ title, problem, steps, answer, autoStart = false, numbered = true }: any) => {
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(autoStart);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Start writing once the box scrolls into view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || started) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setStarted(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || done || paused) return undefined;
    const cur = steps[step];
    if (!cur) { setDone(true); return undefined; }
    if (chars < cur.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 170 / speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (step + 1 >= steps.length) setDone(true);
      else { setStep(step + 1); setChars(0); }
    }, 1100 / speed);
    return () => clearTimeout(t);
  }, [started, done, paused, step, chars, speed, steps]);

  const replay = () => { setPaused(false); setStep(0); setChars(0); setDone(false); setStarted(true); };
  const skip = () => { setPaused(false); setStarted(true); setStep(steps.length - 1); setChars(steps[steps.length - 1].text.length); setDone(true); };

  return (
    <div ref={boxRef} className={`overflow-hidden bg-white ${autoStart ? '' : 'my-3 rounded-xl border border-slate-200'}`}>
      <style>{`@keyframes dvWrite { 0% { stroke-dashoffset: 240; stroke-width: 1.6; fill-opacity: 0; } 65% { stroke-dashoffset: 0; stroke-width: 1.6; fill-opacity: 0; } 100% { stroke-dashoffset: 0; stroke-width: 0.4; fill-opacity: 1; } } @keyframes dvPop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }`}</style>
      {(title || problem) && (
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-600">{title}</div>
          <p className="gc-ink mt-1 break-words text-[19px] font-bold leading-snug text-slate-900"><MathPowers text={problem} /></p>
        </div>
      )}
      <div className="min-h-[60px] px-4 py-2">
        {!started && <p className="py-4 text-[15px] text-slate-400">The working will be written here…</p>}
        {started && steps.map((st: any, i: number) => {
          const full = done || i < step;
          const partial = !done && i === step;
          if (!full && !partial) return null;
          const showWhy = full || chars >= st.text.length;
          return (
            <div key={i} className="flex gap-3 border-b border-dashed border-slate-200 py-2.5 last:border-0">
              {numbered && <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{i + 1}</span>}
              <div className="min-w-0 flex-1">
                <div className="min-h-[34px]"><HandLine text={st.text} upTo={full ? st.text.length : chars} live={partial} /></div>
                {st.why && <p className="mt-1 text-[14px] leading-snug text-slate-500 transition-opacity duration-500" style={{ opacity: showWhy ? 1 : 0 }}><MathPowers text={st.why} /></p>}
              </div>
            </div>
          );
        })}
        {done && answer && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5" style={{ animation: 'dvPop .4s ease-out' }}>
            <span className="mr-2 text-sm font-bold uppercase tracking-wide text-slate-600">Answer</span>
            <span className="gc-ink text-[20px] font-bold text-slate-800"><MathPowers text={answer} /></span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-3 py-2">
        <button type="button" onClick={() => setPaused((value) => !value)} disabled={!started || done} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40">{paused ? 'Resume' : 'Pause'}</button>
        <button type="button" onClick={replay} className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 active:scale-95">Replay</button>
        <button type="button" onClick={skip} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Show all</button>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500">
          Writing speed
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm text-neutral-700 outline-none">
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>
        </label>
      </div>
    </div>
  );
};


export const richText = (text) =>
  text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith('`')) return <span key={i} className="font-serif font-bold italic text-slate-900"><MathPowers text={part.slice(1, -1)} /></span>;
    if (part.startsWith('**')) return <strong key={i}><MathPowers text={part.slice(2, -2)} /></strong>;
    return <MathPowers key={i} text={part} />;
  });


const plainText = (text) => text.replace(/[`*]/g, '');

const ExamCard = ({ q, n }) => {
  const [open, setOpen] = useState(false);
  return (
    <details className="group mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="list-none [&::-webkit-details-marker]:hidden">
        <div className="flex gap-3 px-4 pt-3 pb-2">
          <span className="mt-0.5 flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded border border-slate-300 px-1 text-xs font-bold text-slate-700">{n + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{q.topic}</p>
            <div className="mt-1 space-y-0.5 text-[1.05rem] font-bold leading-snug text-slate-900">
              {q.lines.map((line, i) => <p key={i}>{richText(line)}</p>)}
            </div>
            <p className="mt-2 text-sm text-slate-500">{q.skill}</p>
          </div>
        </div>
        <div className="flex cursor-pointer items-center justify-between border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">
          <span className="group-open:hidden">Show solution</span>
          <span className="hidden group-open:inline">Hide solution</span>
          <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
        </div>
      </summary>
      {/* Mounted only while open, so the working is written out afresh each time. */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50">
          <PenSolver autoStart numbered={false} steps={q.solution.map((line) => ({ text: plainText(line) }))} />
        </div>
      )}
    </details>
  );
};

export const ExamQuestions = ({ items, title = 'What ZIMSEC usually asks' }) => {
  let lastLevel = '';
  return (
    <div>
      <h3 className="lesson-h mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h3>
      {items.map((q, n) => {
        const showLevel = q.level !== lastLevel;
        lastLevel = q.level;
        return (
          <div key={n}>
            {showLevel && <h4 className={`mb-2 text-xl font-extrabold text-slate-700 sm:text-2xl ${n === 0 ? '' : 'mt-6'}`}>{q.level}</h4>}
            <ExamCard q={q} n={n} />
          </div>
        );
      })}
    </div>
  );
};

export const VariationLesson = ({ lesson, diagrams = {} }: { lesson: any[]; diagrams?: Record<string, ComponentType> }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  // A { c: true } marker in the lesson starts a new container.
  const groups = lesson.reduce((all, block) => {
    if (block.c) all.push([]);
    else all[all.length - 1].push(block);
    return all;
  }, [[]]);
  return (
    <div className="mb-6 w-full min-w-0 max-w-full space-y-4">
      {groups.map((group, g) => (
      <div key={g} className={`space-y-2 text-[0.95rem] leading-relaxed text-slate-700 ${group.some((block) => block.exam) ? '' : 'rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5'}`}>
        {group.map((block, i) => {
          if (block.h) return <h3 key={i} className={`lesson-h font-extrabold text-slate-900 ${block.big ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} ${i === 0 ? '' : 'pt-4'}`}>{block.h}</h3>;
          if (block.p) return <p key={i}>{richText(block.p)}</p>;
          if (block.diagram) {
            const Diagram = diagrams[block.diagram];
            if (!Diagram) return null;
            return (
              <figure key={i} className="my-2 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto p-2 sm:p-3"><Diagram /></div>
                {block.caption && <figcaption className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">{richText(block.caption)}</figcaption>}
              </figure>
            );
          }
          if (block.exam) return <ExamQuestions key={i} items={block.exam} title={block.title} />;
          if (block.solver) return <PenSolver key={i} {...block.solver} />;
          if (block.f) return <p key={i} className="font-serif text-xl font-bold italic text-slate-900"><MathPowers text={block.f} /></p>;
          if (block.table) {
            const [head, ...rows] = block.table;
            const horizontal = head.length > 2; // x / y tables read across
            return (
              <table key={i} className={block.tableSize === 'large' ? 'w-full table-fixed border-collapse text-left text-base sm:text-lg' : 'border-collapse text-center text-sm'}>
                <tbody>
                  {(horizontal ? block.table : [head, ...rows]).map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => {
                        const isHead = horizontal ? c === 0 : r === 0;
                        return <td key={c} className={`border border-slate-200 ${block.tableSize === 'large' ? 'px-3 py-4 sm:px-6 sm:py-5 break-words' : 'px-3 py-1'} ${isHead ? 'bg-slate-50 font-bold text-slate-600' : ''}`}><MathPowers text={String(cell)} /></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          if (block.practice) {
            return (
              <div key={i} className="space-y-2">
                <ol className="list-inside list-decimal space-y-1.5">
                  {block.practice.map((q, n) => (
                    <li key={n}>
                      {richText(q)}
                      {showAnswers && <div className="ml-5 text-emerald-700">Answer: {richText(block.answers[n])}</div>}
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => setShowAnswers((open) => !open)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700" aria-expanded={showAnswers}>
                  {showAnswers ? 'Hide answers' : 'Show answers'}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      ))}
    </div>
  );
};
