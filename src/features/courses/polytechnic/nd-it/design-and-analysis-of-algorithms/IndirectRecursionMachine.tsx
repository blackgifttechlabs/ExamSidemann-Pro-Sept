import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { ChevronDown, Pause, Play, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

type Actor = 'A' | 'B';

const STEP_MS = 2600;
const LAST_STEP = 8;
const PACKET_TRAVEL_MS = 2200;
const TYPEWRITER_CHAR_MS = 110;
const TYPEWRITER_LINE_PAUSE_MS = 1100;
const TYPEWRITER_COMPLETION_PAUSE_MS = 450;

function getTypingDuration(text: string) {
  return text.length * TYPEWRITER_CHAR_MS + (text.match(/\n/g)?.length ?? 0) * TYPEWRITER_LINE_PAUSE_MS;
}
const ACTORS: Actor[] = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A'];
const PHASE: Array<'down' | 'base' | 'up'> = ['down', 'down', 'down', 'down', 'base', 'up', 'up', 'up', 'up'];

// Full text typed onto the ACTIVE computer's screen at each step.
const SCREEN_MESSAGES: string[] = [
  'Is 4 even?\nI don\'t know...\nLet me ask B about 3',
  'Is 3 even?\nI don\'t know...\nLet me ask A about 2',
  'Is 2 even?\nI don\'t know...\nLet me ask B about 1',
  'Is 1 even?\nI don\'t know...\nLet me ask A about 0',
  'Is 0 even?\nYes! 0 is even.',
  'So 1 is odd!',
  'So 2 is even!',
  'So 3 is odd!',
  'So 4 is even! ✓',
];

// The value that flies between the two screens BEFORE each step (transition into step i is PACKET_VALUES[i-1]).
const PACKET_VALUES = ['3', '2', '1', '0', 'true', 'true', 'true', 'true'];
const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

const CAPTIONS = [
  'Computer A does not know if 4 is even, so it sends 3 to Computer B.',
  'Computer B does not know if 3 is odd, so it sends 2 to Computer A.',
  'Computer A does not know if 2 is even, so it sends 1 to Computer B.',
  'Computer B does not know if 1 is odd, so it sends 0 to Computer A.',
  'Computer A already has the rule "0 is even" — no need to ask further.',
  'The answer true travels back to Computer B.',
  'The answer true travels back to Computer A.',
  'The answer true travels back to Computer B.',
  'The answer arrives back at Computer A — 4 is even, confirmed! ✓',
];

const POS: Record<Actor, number> = { A: -8.5, B: 8.5 };
const MOBILE_POS: Record<Actor, number> = { A: -2.25, B: 2.25 };

class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="p-8 text-center text-slate-600 dark:text-slate-300">The 3D view is unavailable. Follow the captions below instead.</p>
      : this.props.children;
  }
}

function useTypewriter(text: string, active: boolean, reducedMotion: boolean) {
  const [count, setCount] = useState(reducedMotion ? text.length : 0);
  useLayoutEffect(() => {
    setCount(reducedMotion || !active ? text.length : 0);
  }, [text, active, reducedMotion]);
  useEffect(() => {
    if (reducedMotion || !active || count >= text.length) return;
    const delay = count > 0 && text[count - 1] === '\n' ? TYPEWRITER_LINE_PAUSE_MS : TYPEWRITER_CHAR_MS;
    const timer = window.setTimeout(() => setCount((c) => Math.min(c + 1, text.length)), delay);
    return () => window.clearTimeout(timer);
  }, [count, text, active, reducedMotion]);
  return text.slice(0, count);
}

function Computer({
  actor,
  active,
  base,
  message,
  reducedMotion,
  isDesktop,
}: {
  actor: Actor;
  active: boolean;
  base: boolean;
  message: string;
  reducedMotion: boolean;
  isDesktop: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const shown = useTypewriter(message, active, reducedMotion);
  const cursorOn = active && !reducedMotion && shown.length < message.length;

  useFrame((_, delta) => {
    if (!group.current) return;
    const desktopScale = isDesktop ? 4 : 1;
    const targetScale = desktopScale;
    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 9);
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale, blend);
    group.current.scale.setScalar(s);
    group.current.rotation.z = 0;
  });

  const positions = isDesktop ? POS : MOBILE_POS;

  return (
    <group position={[positions[actor], 0, 0]}>
      <group ref={group} scale={isDesktop ? 4 : 1} rotation={[0, actor === 'A' ? 0.09 : -0.09, 0]}>
        {/* Weighted aluminum foot, tapered upright and rear hinge. */}
        <RoundedBox args={[1.12, 0.065, 0.68]} radius={0.025} smoothness={4} position={[0, 0.065, 0.12]} castShadow receiveShadow>
          <meshStandardMaterial color="#b9c1cb" roughness={0.3} metalness={0.72} />
        </RoundedBox>
        <RoundedBox args={[0.9, 0.025, 0.5]} radius={0.01} smoothness={3} position={[0, 0.024, 0.12]}>
          <meshStandardMaterial color="#272b31" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[0.24, 0.52, 0.12]} radius={0.025} smoothness={4} position={[0, 0.34, -0.09]} rotation={[-0.16, 0, 0]} castShadow>
          <meshStandardMaterial color="#aeb8c5" roughness={0.28} metalness={0.75} />
        </RoundedBox>
        <mesh position={[0, 0.65, -0.08]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.38, 20]} />
          <meshStandardMaterial color="#727c89" roughness={0.35} metalness={0.7} />
        </mesh>
        {/* Layered enclosure leaves a fine rim around the inset glass. */}
        <RoundedBox args={[2.7, 1.8, 0.16]} radius={0.055} smoothness={5} position={[0, 1.3, -0.035]} castShadow receiveShadow>
          <meshStandardMaterial color="#4b515b" roughness={0.32} metalness={0.6} />
        </RoundedBox>
        <RoundedBox args={[2.66, 1.76, 0.035]} radius={0.04} smoothness={4} position={[0, 1.3, 0.054]}>
          <meshStandardMaterial color="#15191f" roughness={0.42} metalness={0.25} />
        </RoundedBox>
        <mesh position={[0, 1.325, 0.073]}>
          <planeGeometry args={[2.52, 1.57]} />
          <meshPhysicalMaterial color="#101b29" roughness={0.22} metalness={0.12} clearcoat={1} clearcoatRoughness={0.18} emissive="#13263d" emissiveIntensity={active ? 0.22 : 0.08} />
        </mesh>
        {/* A restrained glass reflection keeps the lesson text legible. */}
        <mesh position={[-0.65, 1.66, 0.075]} rotation={[0, 0, -0.32]}>
          <planeGeometry args={[0.36, 0.7]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.035} depthWrite={false} />
        </mesh>
        <mesh position={[0, 2.145, 0.076]}>
          <circleGeometry args={[0.016, 16]} />
          <meshStandardMaterial color="#080c12" roughness={0.18} metalness={0.4} />
        </mesh>
        <mesh position={[1.16, 0.472, 0.076]}>
          <circleGeometry args={[0.011, 12]} />
          <meshBasicMaterial color={base ? '#34d399' : active ? '#a5e5ff' : '#64748b'} />
        </mesh>
        <RoundedBox args={[0.23, 0.018, 0.008]} radius={0.004} smoothness={2} position={[0, 0.473, 0.077]}>
          <meshStandardMaterial color="#737d8a" metalness={0.65} roughness={0.4} />
        </RoundedBox>
        {/* Low-profile keyboard and mouse give the workstation a human scale. */}
        <RoundedBox args={[1.55, 0.065, 0.48]} radius={0.035} smoothness={3} position={[-0.12, 0.07, 0.92]} castShadow receiveShadow>
          <meshStandardMaterial color="#aab3bf" metalness={0.55} roughness={0.4} />
        </RoundedBox>
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: row === 3 ? 5 : 12 }, (_, col) => (
            <RoundedBox key={`${row}-${col}`} args={[row === 3 && col === 2 ? 0.62 : 0.09, 0.025, 0.075]} radius={0.009} smoothness={2}
              position={[row === 3 ? [-0.7, -0.55, -0.12, 0.31, 0.46][col] : -0.76 + col * 0.116, 0.115, 0.76 + row * 0.103]} castShadow>
              <meshStandardMaterial color="#303640" roughness={0.65} />
            </RoundedBox>
          ))
        )}
        <mesh position={[0.99, 0.105, 0.91]} scale={[0.13, 0.085, 0.22]} castShadow receiveShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#b9c1cb" roughness={0.35} metalness={0.45} />
        </mesh>
        <Html
          transform
          occlude
          position={[0, 1.325, 0.082]}
          distanceFactor={3.15}
          zIndexRange={[10, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex h-[300px] w-[450px] flex-col items-center justify-center px-6 text-center">
            <p className="whitespace-pre-line font-sans text-[26px] font-bold leading-relaxed text-white">
              {shown.split(/(\d+)/).map((part, index) =>
                /\d+/.test(part)
                  ? <span key={index} className="text-yellow-300">{part}</span>
                  : part
              )}
              {cursorOn && <span className="ml-0.5 inline-block h-[1em] w-[10px] translate-y-0.5 animate-pulse bg-white align-baseline" />}
            </p>
          </div>
        </Html>
        <Html center position={[0, -0.42, 0.46]} style={{ pointerEvents: 'none' }}>
          <span className="whitespace-nowrap text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Computer {actor}
          </span>
        </Html>
      </group>
    </group>
  );
}

function Packet({ step, reducedMotion, isDesktop }: { step: number; reducedMotion: boolean; isDesktop: boolean }) {
  const group = useRef<THREE.Group>(null);
  const stepStart = useRef(performance.now());
  useEffect(() => { stepStart.current = performance.now(); }, [step]);

  const traveling = step > 0;
  const fromActor: Actor = traveling ? ACTORS[step - 1] : 'A';
  const toActor: Actor = traveling ? ACTORS[step] : 'A';
  const value = traveling ? PACKET_VALUES[step - 1] : '';
  const goingUp = traveling && PHASE[step - 1] !== 'down' && PHASE[step - 1] !== undefined && step > 4;
  const positions = isDesktop ? POS : MOBILE_POS;

  // Timeline: RISE (climb the dome) → HOLD (pause at the peak, enlarged, so the value is readable) → FALL (descend to the other computer)
  const RISE_END = 0.3;
  const HOLD_END = 0.78;
  const TOTAL_DURATION = 2.2;

  useFrame(() => {
    if (!group.current) return;
    if (reducedMotion || !traveling) {
      group.current.visible = false;
      return;
    }
    const elapsed = (performance.now() - stepStart.current) / 1000;
    const progress = THREE.MathUtils.clamp(elapsed / TOTAL_DURATION, 0, 1);
    if (progress >= 1) { group.current.visible = false; return; }
    group.current.visible = true;

    // Horizontal position: moves during RISE, holds still at the peak, then finishes moving during FALL.
    let travelFraction: number;
    if (progress <= RISE_END) {
      travelFraction = THREE.MathUtils.smootherstep(progress / RISE_END, 0, 1) * 0.5;
    } else if (progress <= HOLD_END) {
      travelFraction = 0.5;
    } else {
      const fallProgress = (progress - HOLD_END) / (1 - HOLD_END);
      travelFraction = 0.5 + THREE.MathUtils.smootherstep(fallProgress, 0, 1) * 0.5;
    }
    const x = THREE.MathUtils.lerp(positions[fromActor], positions[toActor], travelFraction);

    // Vertical position: a dome arc — rises to a peak height, holds there, then descends.
    let heightFraction: number;
    if (progress <= RISE_END) {
      heightFraction = Math.sin(THREE.MathUtils.smootherstep(progress / RISE_END, 0, 1) * (Math.PI / 2));
    } else if (progress <= HOLD_END) {
      heightFraction = 1;
    } else {
      const fallProgress = (progress - HOLD_END) / (1 - HOLD_END);
      heightFraction = Math.cos(THREE.MathUtils.smootherstep(fallProgress, 0, 1) * (Math.PI / 2));
    }
    const arc = heightFraction * (isDesktop ? 3.2 : 1.35);
    // Launch and land above the monitor so the value travels over the computers.
    const monitorTop = isDesktop ? 7.85 : 2.5;
    group.current.position.set(x, monitorTop + arc, 0.35);

    // Scale: grows noticeably at the peak so the n − 1 value is easy to read, then shrinks back down as it descends.
    const isHolding = progress > RISE_END && progress <= HOLD_END;
    const growIn = progress <= RISE_END ? THREE.MathUtils.smootherstep(progress / RISE_END, 0, 1) : 1;
    const shrinkOut = progress > HOLD_END ? THREE.MathUtils.smootherstep((progress - HOLD_END) / (1 - HOLD_END), 0, 1) : 0;
    const baseScale = 1;
    const peakScale = 5;
    const scale = isHolding
      ? peakScale
      : progress <= RISE_END
      ? THREE.MathUtils.lerp(baseScale, peakScale, growIn)
      : THREE.MathUtils.lerp(peakScale, baseScale, shrinkOut);
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} visible={false}>
      <RoundedBox args={[0.72, 0.52, 0.08]} radius={0.07} smoothness={3} castShadow>
        <meshStandardMaterial
          color={goingUp ? '#10b981' : '#f59e0b'}
          emissive={goingUp ? '#10b981' : '#f59e0b'}
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </RoundedBox>
      <Html center transform distanceFactor={3.2} position={[0, 0, 0.05]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none', zIndex: 20 }}>
        <span className="font-mono text-lg font-black text-white">{value}</span>
      </Html>
    </group>
  );
}

function IndirectCamera({ isDesktop }: { isDesktop: boolean }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.position.set(0, isDesktop ? 8 : 3.6, 24);
      camera.lookAt(0, isDesktop ? 3.5 : 1.05, 0);
      camera.zoom = isDesktop ? Math.min(22, size.width / 34) : Math.min(48, size.width / 8);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, isDesktop]);
  return null;
}

function IndirectCode({ step }: { step: number }) {
  const lineFor = (n: number) => (n === 4 ? 4 : ACTORS[n] === 'A' ? 5 : 10);
  const activeLine = lineFor(step);
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const pathEl = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  const [geo, setGeo] = useState({ w: 1, h: 1, d: '', step: -1 });
  const lines = [
    'bool isOdd(int n);',
    '',
    'bool isEven(int n) {',
    '  if (n == 0) return true;',
    '  return isOdd(n - 1);',
    '}',
    '',
    'bool isOdd(int n) {',
    '  if (n == 0) return false;',
    '  return isEven(n - 1);',
    '}',
    '',
    'isEven(4);',
  ];

  // Measure the path from the previous call line to the header of the function now running.
  useLayoutEffect(() => {
    if (step === 0 || !root.current) { setGeo({ w: 1, h: 1, d: '', step }); return; }
    const rb = root.current.getBoundingClientRect();
    const pt = (line: number) => {
      const el = rows.current[line - 1]?.querySelector('code');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.right - rb.left + 8, y: r.top - rb.top + r.height / 2 };
    };
    const a = pt(lineFor(step - 1));
    const b = pt(ACTORS[step] === 'A' ? 3 : 8);
    if (!a || !b) return;
    const xr = rb.width - 16;
    setGeo({ w: rb.width, h: rb.height, step, d: `M ${a.x} ${a.y} C ${xr} ${a.y}, ${xr} ${b.y}, ${b.x} ${b.y}` });
  }, [step]);

  // Dot uses the same timing and easing as the packet flying between the computers.
  useEffect(() => {
    const path = pathEl.current;
    const circle = dot.current;
    if (!path || !circle || !geo.d || geo.step !== step) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const pr = Math.min(1, (performance.now() - start) / 1000 / 2.2);
      const sm = (x: number) => THREE.MathUtils.smootherstep(x, 0, 1);
      const t = pr <= 0.3 ? sm(pr / 0.3) * 0.5 : pr <= 0.78 ? 0.5 : 0.5 + sm((pr - 0.78) / 0.22) * 0.5;
      const pos = path.getPointAtLength(path.getTotalLength() * t);
      const bump = pr <= 0.3 ? sm(pr / 0.3) : pr <= 0.78 ? 1 : 1 - sm((pr - 0.78) / 0.22);
      const grow = 1 + 0.35 * bump;
      circle.setAttribute('transform', `translate(${pos.x} ${pos.y}) scale(${grow})`);
      circle.style.opacity = String(Math.min(1, pr / 0.08, (1 - pr) / 0.08));
      circle.style.visibility = pr >= 1 ? 'hidden' : 'visible';
      if (pr < 1) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [geo, step]);

  const kw = 'text-sky-300';
  const fn = 'text-fuchsia-300';
  const chip = 'rounded-md bg-slate-500/60 px-1 text-yellow-300 outline outline-2 outline-offset-2 outline-yellow-300';
  const render = (line: string, index: number) => {
    const isActive = activeLine === index + 1;
    return line.split(/(n == 0|isEven\(n - 1\)|isOdd\(n - 1\)|bool|int|if|return|true|false|isEven|isOdd)/g).map((part, token) => {
      if (!part) return null;
      const hot = isActive && (part === 'n == 0' || /\(n - 1\)$/.test(part));
      if (hot) return <span key={token} className={chip}>{part}</span>;
      const cls = /^(isEven|isOdd)$/.test(part) ? fn : /^(bool|int|if|return|true|false)$/.test(part) ? kw : undefined;
      return <span key={token} className={cls}>{part}</span>;
    });
  };

  return (
    <div className="min-w-0 lg:self-center">
      <div ref={root} className="relative overflow-x-auto rounded-xl border-2 border-indigo-400 bg-slate-900 px-2 py-5 font-mono text-sm font-bold leading-[2.2rem] text-white shadow-lg sm:text-lg sm:leading-[2.6rem]" aria-label="C++ indirect recursion between isEven and isOdd">
        {lines.map((line, index) => (
          <div key={index} ref={(el) => { rows.current[index] = el; }} className={`flex border-l-4 px-2 ${activeLine === index + 1 ? 'border-yellow-300 bg-slate-500/60' : 'border-transparent'}`}>
            <span aria-hidden="true" className="mr-4 w-6 shrink-0 select-none text-right text-slate-400">{index + 1}</span>
            <code className="whitespace-pre">{render(line, index)}</code>
          </div>
        ))}
        {geo.d && geo.step === step && (
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-yellow-300" viewBox={`0 0 ${geo.w} ${geo.h}`}>
            <path ref={pathEl} d={geo.d} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" opacity="0.7" />
            <g ref={dot}>
              <rect x="-34" y="-15" width="68" height="30" rx="15" fill="currentColor" stroke="#fff" strokeWidth="2.5" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">{step <= 4 ? `n = ${PACKET_VALUES[step - 1]}` : PACKET_VALUES[step - 1]}</text>
            </g>
          </svg>
        )}
      </div>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-lg font-bold sm:text-xl">
        <span className="rounded-md bg-slate-500/60 px-2 py-1 text-cyan-300">Computer A: <code className="text-yellow-300">isEven</code></span>
        <span className="rounded-md bg-slate-500/60 px-2 py-1 text-cyan-300">Computer B: <code className="text-yellow-300">isOdd</code></span>
      </p>
    </div>
  );
}

function IndirectScene({
  step,
  screenA,
  screenB,
  reducedMotion,
  typingReady,
  isDesktop,
}: {
  step: number;
  screenA: string;
  screenB: string;
  reducedMotion: boolean;
  typingReady: boolean;
  isDesktop: boolean;
}) {
  const activeActor = ACTORS[step];
  const isBase = PHASE[step] === 'base';
  return (
    <>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={['#e5efff', '#9a8d7d', 1.15]} />
      <directionalLight position={[-12, 18, 12]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={18} shadow-camera-bottom={-12}
        shadow-camera-far={65} shadow-normalBias={0.035} shadow-bias={-0.0001} shadow-radius={4} />
      <directionalLight position={[4, 3, -2]} intensity={0.9} />
      <group position={[0, -1.1, 0]}>
        <RoundedBox args={[isDesktop ? 30 : 8, 0.14, isDesktop ? 10 : 3.5]} radius={0.06} smoothness={3} receiveShadow position={[0, -0.02, 0]}>
          <meshStandardMaterial color="#e0ddd7" roughness={0.85} metalness={0.02} />
        </RoundedBox>
        <Computer actor="A" active={activeActor === 'A' && typingReady} base={activeActor === 'A' && isBase} message={activeActor === 'A' && !typingReady ? '' : screenA} reducedMotion={reducedMotion} isDesktop={isDesktop} />
        <Computer actor="B" active={activeActor === 'B' && typingReady} base={false} message={activeActor === 'B' && !typingReady ? '' : screenB} reducedMotion={reducedMotion} isDesktop={isDesktop} />
        <Packet step={step} reducedMotion={reducedMotion} isDesktop={isDesktop} />
      </group>
    </>
  );
}

export function IndirectRecursionMachine() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [typingReady, setTypingReady] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const hasAutoPlayed = useRef(false);
  const frozen = useRef<Record<Actor, string>>({ A: 'Ready...', B: 'Waiting...' });
  const prevStep = useRef(0);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false); };
    update();
    query.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (container.current) observer.observe(container.current);
    const desktopQuery = window.matchMedia('(min-width: 640px)');
    const updateDesktop = () => setIsDesktop(desktopQuery.matches);
    updateDesktop();
    desktopQuery.addEventListener('change', updateDesktop);
    return () => { observer.disconnect(); query.removeEventListener('change', update); desktopQuery.removeEventListener('change', updateDesktop); };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion || hasAutoPlayed.current) return;
    hasAutoPlayed.current = true;
    setPlaying(true);
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!playing || !visible) return;
    const typingDuration = reducedMotion ? 0 : getTypingDuration(SCREEN_MESSAGES[step]);
    const packetWait = reducedMotion || step === 0 ? 0 : PACKET_TRAVEL_MS;
    const timer = window.setTimeout(() => {
      const nextStep = step >= LAST_STEP ? 0 : step + 1;
      setTypingReady(nextStep === 0 || reducedMotion);
      setStep(nextStep);
    }, Math.max(STEP_MS / speed, packetWait + typingDuration + TYPEWRITER_COMPLETION_PAUSE_MS));
    return () => window.clearTimeout(timer);
  }, [playing, visible, reducedMotion, speed, step]);

  useEffect(() => {
    if (!speedOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) setSpeedOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [speedOpen]);

  useEffect(() => {
    if (reducedMotion || step === 0) { setTypingReady(true); return; }
    setTypingReady(false);
    const timer = window.setTimeout(() => setTypingReady(true), PACKET_TRAVEL_MS);
    return () => window.clearTimeout(timer);
  }, [step, reducedMotion]);

  // Freeze the previous active computer's message once we move to the next step.
  useEffect(() => {
    if (step === 0) {
      frozen.current = { A: 'Ready...', B: 'Waiting...' };
      prevStep.current = 0;
      forceRender((v) => v + 1);
      return;
    }
    const previousActor = ACTORS[step - 1];
    frozen.current = { ...frozen.current, [previousActor]: SCREEN_MESSAGES[step - 1] };
    prevStep.current = step;
    forceRender((v) => v + 1);
  }, [step]);

  const activeActor = ACTORS[step];
  const screenA = activeActor === 'A' ? SCREEN_MESSAGES[step] : frozen.current.A;
  const screenB = activeActor === 'B' ? SCREEN_MESSAGES[step] : frozen.current.B;

  const label = reducedMotion ? (step >= LAST_STEP ? 'Replay' : 'Next step') : playing ? 'Pause' : step >= LAST_STEP ? 'Replay' : 'Play';
  const toggle = () => {
    if (reducedMotion) { setStep((s) => (s >= LAST_STEP ? 0 : s + 1)); return; }
    if (step >= LAST_STEP) { setStep(0); setPlaying(true); return; }
    setPlaying((p) => !p);
  };
  const restart = () => {
    setStep(0);
    setPlaying(!reducedMotion);
  };

  return (
    <div ref={container} className="mx-auto mt-5 grid max-w-xl gap-4 sm:max-w-3xl lg:max-w-none lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-8">
      <IndirectCode step={step} />
      <div className="min-w-0">
      <div className="relative isolate h-[420px] overflow-hidden sm:h-[400px]" role="img" aria-label={`Two computers exchanging the question: ${CAPTIONS[step]}`}>
        {visible && (
          <SceneBoundary>
            <Canvas
              shadows
              orthographic
              dpr={[1, 1.5]}
              camera={{ position: [0, isDesktop ? 8 : 3.6, 24], zoom: isDesktop ? 22 : 48, near: 0.1, far: 80 }}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl, camera }) => { gl.setClearColor(0x000000, 0); camera.lookAt(0, isDesktop ? 3.5 : 1.05, 0); }}
            >
              <IndirectCamera isDesktop={isDesktop} />
              <IndirectScene step={step} screenA={screenA} screenB={screenB} reducedMotion={reducedMotion} typingReady={typingReady} isDesktop={isDesktop} />
            </Canvas>
          </SceneBoundary>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center gap-2">
        <p aria-live="polite" aria-atomic="true" className="w-full min-w-0 whitespace-normal break-words text-center text-sm leading-snug font-medium text-slate-700 dark:text-slate-300 sm:text-base">
          {CAPTIONS[step]}
        </p>
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

export default IndirectRecursionMachine;
