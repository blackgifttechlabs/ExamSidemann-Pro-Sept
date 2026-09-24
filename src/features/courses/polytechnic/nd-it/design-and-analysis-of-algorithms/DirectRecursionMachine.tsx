import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { ChevronDown, Pause, Play, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];
const STEP_SECONDS = 3;
const LAST_STEP = 10;
const LENGTH = STEP_SECONDS * LAST_STEP;
const RESULTS = [1, 1, 2, 6, 24, 120];

function frameAt(step: number) {
  if (step < 5) return {
    count: step + 1,
    line: step === 4 ? 2 : 3,
    caption: step === 0 ? 'factorial(5) starts.' : `factorial(${6 - step}) calls factorial(${5 - step}).`,
    equation: Array.from({ length: step + 1 }, (_, i) => 5 - i).join(' × '),
  };
  if (step === 5) return { count: 5, line: 2, caption: 'Base case: factorial(1) returns 1.', equation: '5 × 4 × 3 × 2 × 1 = ?' };
  if (step < LAST_STEP) {
    const n = step - 4;
    return { count: 10 - step, line: 3, caption: `${n} × ${RESULTS[n - 1]} = ${RESULTS[n]}. Return ${RESULTS[n]}.`, equation: [...Array.from({ length: 5 - n }, (_, i) => String(5 - i)), String(RESULTS[n])].join(' × ') };
  }
  return { count: 0, line: 6, caption: 'All calls have returned.', equation: '5! = 120' };
}

class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="p-8 text-center text-slate-600 dark:text-slate-300">The 3D view is unavailable. Follow the highlighted code and result below.</p>
      : this.props.children;
  }
}

function CallBlock({ index, step, time, reducedMotion }: { index: number; step: number; time: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const wasVisible = useRef(false);
  const count = frameAt(step).count;
  const n = 5 - index;
  const fraction = (time % STEP_SECONDS) / STEP_SECONDS;
  const progress = reducedMotion ? 1 : THREE.MathUtils.smoothstep(fraction, 0, 0.38);
  const leaving = step >= 6 && step < LAST_STEP && index === count;
  const entering = step < 5 && index === count - 1;
  const slide = reducedMotion ? 1 : THREE.MathUtils.smootherstep(fraction, 0, 0.36);
  const settle = reducedMotion ? 1 : THREE.MathUtils.smootherstep(fraction, 0.3, 0.54);
  const alpha = leaving ? 1 - progress : 1;
  const visible = index < count || (leaving && alpha > 0.01);
  const base = step >= 5 && n === 1;
  const returning = step >= 6 && index === count - 1;
  useFrame((_, delta) => {
    if (!group.current) { wasVisible.current = false; return; }
    // Slide above the stack first, then lower the block into place.
    const x = entering ? (1 - slide) * 6 : 0;
    const y = 0.39 + index * 0.59 + (entering ? (1 - settle) * 0.5 : leaving ? progress * 0.7 : 0);
    const blend = reducedMotion || !wasVisible.current ? 1 : 1 - Math.exp(-delta * 18);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x, blend);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, y, blend);
    wasVisible.current = true;
  });
  if (!visible) return null;
  return (
    <group ref={group} position={[0, 0.39 + index * 0.59, 0]}>
      <RoundedBox args={[3.7, 0.53, 1.85]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={base ? '#f5a623' : returning ? '#357b78' : '#315a81'} roughness={0.42} metalness={0.12} transparent opacity={alpha} />
      </RoundedBox>
      <Html transform occlude position={[0, -0.015, 0.94]} distanceFactor={4.2} zIndexRange={[10, 0]} style={{ pointerEvents: 'none', opacity: alpha }}>
        <div style={{ width: 280, display: 'flex', justifyContent: 'space-between', color: '#fff', fontFamily: 'ui-monospace, monospace', fontSize: 26, fontWeight: 700, textShadow: '0 1px 2px #0008' }}>
          <span>n = {n}</span><span>{base ? '→ 1' : returning ? `→ ${RESULTS[n]}` : ''}</span>
        </div>
      </Html>
    </group>
  );
}

function StackCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(65, size.width / 6);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width]);
  return null;
}

function StackScene({ time, step, reducedMotion }: { time: number; step: number; reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 7, 5]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[4, 3, -2]} intensity={1} />
      <group rotation={[0, -0.06, 0]} position={[0, -1.2, 0]}>
        <RoundedBox args={[4.1, 0.17, 2.18]} radius={0.07} smoothness={3} receiveShadow>
          <meshStandardMaterial color="#d8dde4" roughness={0.65} metalness={0.15} />
        </RoundedBox>
        {Array.from({ length: 5 }, (_, index) => <CallBlock key={index} index={index} time={time} step={step} reducedMotion={reducedMotion} />)}
      </group>
    </>
  );
}

function CodeExample({ line, step, time, reducedMotion }: { line: number; step: number; time: number; reducedMotion: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const functionName = useRef<HTMLSpanElement>(null);
  const recursiveCall = useRef<HTMLSpanElement>(null);
  const markerId = `call-arrow-${useId().replace(/:/g, '')}`;
  const [arrow, setArrow] = useState({ width: 1, height: 1, path: '' });
  const arrowPath = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const calling = step < 4;
  const base = step === 4 || step === 5;
  const returning = step >= 6 && step < LAST_STEP;
  const keyword = 'text-sky-300';
  const name = 'text-fuchsia-300';
  const ring = 'rounded-md bg-slate-500/60 px-1 text-yellow-300 outline outline-2 outline-offset-2 outline-yellow-300';
  useLayoutEffect(() => {
    const measure = () => {
      if (!root.current || !functionName.current || !recursiveCall.current) return;
      const box = root.current.getBoundingClientRect();
      const target = functionName.current.getBoundingClientRect();
      const source = recursiveCall.current.getBoundingClientRect();
      const x = source.right - box.left + 5;
      const y = source.top - box.top + source.height / 2;
      const right = box.width - 5;
      const endX = target.left - box.left + target.width / 2;
      const endY = target.top - box.top - 5;
      const top = Math.max(5, endY - 16);
      const path = `M ${x} ${y} H ${right - 7} Q ${right} ${y} ${right} ${y - 7} V ${top + 7} Q ${right} ${top} ${right - 7} ${top} H ${endX + 7} Q ${endX} ${top} ${endX} ${top + 7} V ${endY}`;
      setArrow(previous => previous.path === path && previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height, path });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    const path = arrowPath.current;
    const circle = dot.current;
    if (!path || !circle) return;
    const fraction = (time % STEP_SECONDS) / STEP_SECONDS;
    const t = reducedMotion ? 1 : THREE.MathUtils.smootherstep(fraction, 0, 0.54);
    const point = path.getPointAtLength(path.getTotalLength() * t);
    circle.setAttribute('cx', String(point.x));
    circle.setAttribute('cy', String(point.y));
  }, [time, arrow.path, calling, reducedMotion]);
  const lines = [
    <><span className={keyword}>int</span> <span ref={functionName} className={name}>factorial</span>(<span className={keyword}>int</span> n) {'{'}</>,
    <>  <span className={keyword}>if</span> (<span className={base ? ring : ''}>n &lt;= 1</span>) <span className={keyword}>return</span> 1;</>,
    <>  <span className={keyword}>return</span> <span className={returning ? ring : ''}>n *</span> <span ref={recursiveCall} className={calling ? ring : ''}><span className={name}>factorial</span>(n - 1)</span>;</>,
    <>{'}'}</>,
    <>{' '}</>,
    <><span className={name}>factorial</span>(5);</>,
  ];
  const explanation = calling
    ? `${5 - step} − 1 = ${4 - step} → factorial(${4 - step})`
    : base ? 'n = 1: stop calling and return 1.'
    : returning ? `${step - 4} × ${RESULTS[step - 5]} = ${RESULTS[step - 4]}`
    : 'Return 120 to the first call.';
  return <div className="mx-auto w-full min-w-0 max-w-md lg:mx-0">
    <div ref={root} className="relative rounded-xl border-2 border-indigo-400 bg-slate-900 px-2 pb-4 pt-12 font-mono text-base font-bold leading-[2.6rem] text-white shadow-lg sm:text-xl" aria-label="C++ factorial function">
      {lines.map((content, index) => <div key={index} className={`flex border-l-4 px-2 ${line === index + 1 ? 'border-yellow-300 bg-slate-500/60' : 'border-transparent'}`}><span aria-hidden="true" className="mr-4 w-6 shrink-0 select-none text-right text-slate-400">{index + 1}</span><code className="whitespace-pre">{content}</code></div>)}
      {calling && arrow.path && <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-yellow-300" viewBox={`0 0 ${arrow.width} ${arrow.height}`}>
        <defs><marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" /></marker></defs>
        <path ref={arrowPath} d={arrow.path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" markerEnd={`url(#${markerId})`} />
        <circle ref={dot} r="6" fill="currentColor" stroke="#fff" strokeWidth="2" />
      </svg>}
    </div>
    <p className="mt-3 text-center text-lg font-bold sm:text-xl">{calling && <span className="mr-2 text-cyan-600 dark:text-cyan-300">Calls itself:</span>}<span className="rounded-md bg-slate-500/60 px-2 py-1 font-mono text-yellow-300">{explanation}</span></p>
  </div>;
}

export function DirectRecursionMachine() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasAutoPlayed = useRef(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!speedOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) setSpeedOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSpeedOpen(false);
        speedMenuRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
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
    if (!playing || !visible) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min((now - last) / 1000, 0.2);
      last = now;
      setTime(current => Math.min(LENGTH, current + elapsed * speed));
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing, visible, speed]);
  useEffect(() => { if (time >= LENGTH) setPlaying(false); }, [time]);
  const step = Math.min(LAST_STEP, Math.floor(time / STEP_SECONDS));
  const frame = frameAt(step);
  const label = reducedMotion ? (time >= LENGTH ? 'Replay' : 'Next step') : playing ? 'Pause' : time >= LENGTH ? 'Replay' : 'Play';
  const toggle = () => {
    if (reducedMotion) { setTime(time >= LENGTH ? 0 : Math.min(LENGTH, (step + 1) * STEP_SECONDS)); return; }
    if (time >= LENGTH) setTime(0);
    setPlaying(current => !current);
  };
  const restart = () => {
    setTime(0);
    setPlaying(!reducedMotion);
  };
  return (
    <div ref={container} className="mx-auto mt-5 grid max-w-xl gap-4 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-8">
      <CodeExample line={frame.line} step={step} time={time} reducedMotion={reducedMotion} />
      <div className="min-w-0">
      <div className="relative isolate h-[310px] overflow-hidden sm:h-[360px]" role="img" aria-label={`Call stack: ${frame.count} calls. ${frame.caption}`}>
        {visible && <SceneBoundary><Canvas shadows orthographic dpr={[1, 1.5]} camera={{ position: [2, 4.8, 10], zoom: 65, near: 0.1, far: 50 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl, camera }) => { gl.setClearColor(0x000000, 0); camera.lookAt(0, 0.1, 0); }}><StackCamera /><StackScene time={time} step={step} reducedMotion={reducedMotion} /></Canvas></SceneBoundary>}
        <span className="absolute left-0 top-2 text-base font-bold text-slate-700 dark:text-slate-200">Call stack</span>
        {step === 5 && <span className="absolute right-0 top-3 text-sm font-bold text-amber-700 dark:text-amber-400">Base case</span>}
      </div>
      <p className="text-center font-mono text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{frame.equation}</p>
      <div className="mt-2 flex flex-col items-center gap-2">
        <p aria-live="polite" aria-atomic="true" className="text-center text-sm text-slate-700 dark:text-slate-300">{frame.caption}</p>
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
