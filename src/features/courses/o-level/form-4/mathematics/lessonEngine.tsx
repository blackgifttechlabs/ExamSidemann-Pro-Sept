import { MathStrokeExpression } from './MathStrokeExpression';
import { MathFraction, MathPowers, powerTokens, simpleFractions } from './mathPowers';
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
  // HTML reserves enough height for a fraction inside a raised exponent.
  // Retain the same source-character timing as the SVG pen writer.
  if (simpleFractions(text).length || tokens.some(token => token.power && token.text.includes('/'))) {
    return <div className="gc-ink py-2 text-[28px] font-bold leading-[2] text-blue-900"><MathStrokeExpression value={text} upTo={upTo} live={live} /></div>;
  }
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

const WorkingRow = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(frame); }, []);
  return <div className={`math-working-row ${visible ? 'is-visible' : ''}`}><div className="math-working-row-content">{children}</div></div>;
};

const SCENE_DURATION = 5200;

export const PenSolver = ({ title, problem, problemFraction, steps, answer, autoStart = false, numbered = true, stepGrid = false, manualStart = false, controlsUnderQuestion = false }: any) => {
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [started, setStarted] = useState(autoStart);
  const [done, setDone] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Start writing once the box scrolls into view.
  useEffect(() => {
    if (manualStart) return undefined;
    const el = stepGrid ? boxRef.current?.querySelector('.lesson-writing-header') : boxRef.current;
    if (!el || started) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setStarted(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [started, stepGrid, manualStart]);

  // One frame clock controls the movement. Pause and speed changes restart from
  // the current position, rather than letting an independent animation run on.
  useEffect(() => {
    const cur = steps[step];
    if (!started || done || paused || !cur?.scene || sceneElapsed >= SCENE_DURATION) return undefined;
    const initial = sceneElapsed;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = Math.min(SCENE_DURATION, initial + (now - start) * speed);
      setSceneElapsed(elapsed);
      if (elapsed < SCENE_DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, done, paused, step, speed, steps]);

  useEffect(() => {
    if (!started || done || paused) return undefined;
    const cur = steps[step];
    if (!cur) { setDone(true); return undefined; }
    if (cur.scene && sceneElapsed < SCENE_DURATION) return undefined;
    if (chars < cur.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 170 / speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (step + 1 >= steps.length) setDone(true);
      else { setStep(step + 1); setChars(0); setSceneElapsed(0); }
    }, 1100 / speed);
    return () => clearTimeout(t);
  }, [started, done, paused, step, chars, sceneElapsed, speed, steps]);

  const replay = () => { setPaused(false); setStep(0); setChars(0); setSceneElapsed(0); setDone(false); setStarted(true); };
  const skip = () => { setPaused(false); setStarted(true); setStep(steps.length - 1); setChars(steps[steps.length - 1].text.length); setDone(true); };

  const controls = (
      <div className="lesson-writing-controls flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-3 py-2">
        <button type="button" onClick={() => setPaused((value) => !value)} disabled={!started || done} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40">{paused ? 'Resume' : 'Pause'}</button>
        <button type="button" onClick={replay} className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 active:scale-95">{!started && manualStart ? 'Show me working' : 'Replay'}</button>
        <button type="button" onClick={skip} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Show all</button>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500">
          {steps.some((item: any) => item.scene) ? 'Animation speed' : 'Writing speed'}
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm text-neutral-700 outline-none">
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
          </select>
        </label>
      </div>
  );

  return (
    <div ref={boxRef} className={`lesson-writing-example overflow-hidden bg-white ${autoStart ? '' : 'my-3 rounded-xl border border-slate-200'}`}>
      <style>{`@keyframes dvWrite { 0% { stroke-dashoffset: 240; stroke-width: 1.6; fill-opacity: 0; } 65% { stroke-dashoffset: 0; stroke-width: 1.6; fill-opacity: 0; } 100% { stroke-dashoffset: 0; stroke-width: 0.4; fill-opacity: 1; } } @keyframes dvPop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }`}</style>
      {(title || problem) && (
        <div className="lesson-writing-header border-b border-slate-100 px-4 py-3">
          <div className="text-sm font-bold uppercase tracking-wide text-slate-600">{title}</div>
          <p className={`gc-ink break-words text-[19px] font-bold text-slate-900 ${problemFraction ? 'mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 leading-relaxed' : powerTokens(problem ?? '').some(token => token.power && token.text.includes('/')) ? 'mt-4 leading-[2]' : 'mt-1 leading-snug'}`}>{problemFraction ? <><MathPowers text={problemFraction.prefix ?? ''} /><MathFraction {...problemFraction} /><MathPowers text={problemFraction.suffix ?? ''} /></> : <MathPowers text={problem} />}</p>
        </div>
      )}
      {controlsUnderQuestion && controls}
      <div className={`lesson-writing-steps min-h-[60px] px-4 py-2 ${stepGrid ? 'lesson-step-grid' : ''}`}>
        {!started && !stepGrid && <p className="py-4 text-[15px] text-slate-400">The working will be written here…</p>}
        {(started || stepGrid) && steps.map((st: any, i: number) => {
          const full = done || i < step;
          const partial = !done && i === step;
          if (!stepGrid && !full && !partial) return null;
          const pending = !started || (!full && !partial);
          const showWhy = full || chars >= st.text.length;
          const Scene = st.scene;
          return (
            <WorkingRow key={i}><div className="lesson-working-step flex gap-3 border-b border-dashed border-slate-200 py-2.5 last:border-0" data-working-step={i + 1}>
              {numbered && <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{i + 1}</span>}
              <div className="min-w-0 flex-1" style={{ visibility: pending ? 'hidden' : undefined }}>
                {Scene && <Scene progress={full ? 1 : Math.min(1, (partial ? sceneElapsed / SCENE_DURATION : 0))} />}
                <div className="min-h-[34px]"><HandLine text={st.text} upTo={full ? st.text.length : chars} live={partial} /></div>
                {st.why && <p className="mt-1 text-[14px] leading-snug text-slate-500 transition-opacity duration-500" style={{ opacity: showWhy ? 1 : 0 }}><MathPowers text={st.why} /></p>}
              </div>
            </div></WorkingRow>
          );
        })}
        {answer && (done || stepGrid) && (
          <div className="lesson-writing-answer mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5" style={{ visibility: done ? 'visible' : 'hidden', animation: done ? 'dvPop .4s ease-out' : undefined }}>
            <span className="mr-2 text-sm font-bold uppercase tracking-wide text-slate-600">Answer</span>
            <span className="gc-ink text-[20px] font-bold text-slate-800"><MathPowers text={answer} /></span>
          </div>
        )}
      </div>
      {!controlsUnderQuestion && controls}

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
  if (q.manualStart) return (
    <article className="algebra-question-card" data-exam-question={n + 1}>
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 font-bold text-violet-800">{n + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-500">{q.topic}</p>
          <div className="space-y-1 font-semibold">{q.lines.map((line, i) => <p key={i}>{richText(line)}</p>)}</div>
          {q.skill && <p className="mt-2 text-sm text-slate-500">{q.skill}</p>}
          {q.sourceUrl && <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-violet-700 underline">Open original paper</a>}
          <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}
            className="mt-3 rounded-lg bg-violet-700 px-4 py-2 font-bold text-white hover:bg-violet-800">
            {open ? 'Hide working' : 'Show me working'}
          </button>
        </div>
      </div>
      {open && <PenSolver autoStart numbered stepGrid={Boolean(q.stepGrid)} controlsUnderQuestion
        steps={q.workingSteps ?? q.solution.map(line => ({ text: plainText(line) }))} />}
    </article>
  );
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
            {q.skill && <p className="mt-2 text-sm text-slate-500">{q.skill}</p>}
            {q.sourceUrl && <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-violet-700 underline">Open original paper</a>}
          </div>
        </div>
        <div className="flex cursor-pointer items-center justify-between border-t border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">
          <span className="group-open:hidden">{q.manualStart ? 'Show me working' : 'Show solution'}</span>
          <span className="hidden group-open:inline">Hide solution</span>
          <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
        </div>
      </summary>
      {/* Mounted only while open, so the working is written out afresh each time. */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50">
          <PenSolver autoStart numbered={Boolean(q.stepGrid)} stepGrid={Boolean(q.stepGrid)} steps={q.solution.map((line) => ({ text: plainText(line) }))} />
        </div>
      )}
    </details>
  );
};

export const ExamQuestions = ({ items, title = 'What ZIMSEC usually asks' }) => {
  let lastLevel = '';
  return (
    <div>
      {title && <h3 className="lesson-h mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h3>}
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
      <div key={g} className={`lesson-content-group space-y-2 text-[0.95rem] leading-relaxed text-slate-700 ${group.some((block) => block.exam) ? '' : 'rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5'}`}>
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
          if (block.exam) {
            if (!block.examFindings) return <ExamQuestions key={i} items={block.exam} title={block.title} />;
            // Only sets that contain real past-paper cards may claim to show what was asked before.
            const hasPastPaper = block.exam.some((q: any) => q.kind === 'past-paper');
            return <section key={i} className="algebra-question-set" data-question-set="true">
              <h3 className="lesson-h mb-4">{hasPastPaper ? 'What ZIMSEC has asked before' : 'Practice questions'}</h3>
              <p className="mb-3">{richText(block.examFindings)}</p>
              <p className="mb-6">{hasPastPaper ? 'Verified ZIMSEC cards link to the original paper. The other cards are extra practice. Each question has a worked answer. Difficulty labels are our teaching guide.' : 'Each question has a worked answer. Click Show me working when you are ready. Difficulty labels are our teaching guide.'}</p>
              <ExamQuestions items={block.exam} title={block.title} />
            </section>;
          }
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
