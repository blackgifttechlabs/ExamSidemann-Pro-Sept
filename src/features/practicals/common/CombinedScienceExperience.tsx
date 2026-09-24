import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import './combinedScienceExperience.css';

export type PerformanceAction = {
  id: string; label: string; target: [number, number, number];
  gesture?: 'press' | 'grip' | 'pour' | 'stir' | 'rinse' | 'observe';
  perform?: () => void; done?: boolean; seconds?: number;
};
type Script = { actions: PerformanceAction[]; reset: () => void; prepare?: () => void; handScale?: number };
type Runtime = { action?: PerformanceAction; elapsed: number; contacted: boolean; scale: number; contact?: () => void };
type Experience = {
  immersive: boolean; running: boolean; paused: boolean; run: number;
  script: React.MutableRefObject<Script | null>; runtime: React.MutableRefObject<Runtime>;
  report: (label: string, complete?: boolean) => void;
};
const Context = createContext<Experience | null>(null);
export function useFirstPersonScience() { return useContext(Context)?.immersive ?? false; }

export function CombinedScienceExperience({ title, children }: { title: string; children: ReactNode }) {
  const [immersive, setImmersive] = useState(true);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [label, setLabel] = useState('');
  const [complete, setComplete] = useState(false);
  const script = useRef<Script | null>(null);
  const runtime = useRef<Runtime>({ elapsed: 0, contacted: false, scale: 2.2 });
  const report = React.useCallback((text: string, finished = false) => {
    setLabel(text); if (finished) { setRunning(false); setComplete(true); }
  }, []);
  const start = () => {
    if (!script.current) return;
    script.current.reset(); script.current.prepare?.();
    setComplete(false); setPaused(false); setRun(n => n + 1); setRunning(true);
  };
  const changeMode = (next: boolean) => {
    if (running) script.current?.reset();
    setRunning(false); setPaused(false); setComplete(false); setImmersive(next);
  };
  return <Context.Provider value={{ immersive, running, paused, run, script, runtime, report }}>
    <div className={`science-experience ${immersive ? 'first-person-science' : 'learning-science'}`}>
      <header className="science-experience-header">
        <button type="button" aria-label="Back to Combined Science" onClick={() => window.history.back()}>←</button>
        <strong>{title}</strong>
        {immersive && running && <span className="science-action-status" aria-live="polite">{label}</span>}
        <div className="science-experience-actions">
          {immersive && running && <button onClick={() => setPaused(p => !p)}>{paused ? 'Resume' : 'Pause hands'}</button>}
          {immersive && running && <button onClick={() => { script.current?.reset(); setRunning(false); setComplete(false); }}>Stop</button>}
          <button aria-pressed={immersive} onClick={() => changeMode(true)}>First person</button>
          <button aria-pressed={!immersive} onClick={() => changeMode(false)}>Learning</button>
        </div>
      </header>
      <div className="science-experiment-content">{children}</div>
      {immersive && !running && <div className="science-start-screen"><button onClick={start}>{complete ? 'Replay experiment' : 'Start'}</button>{complete && <span>Experiment complete</span>}</div>}
    </div>
  </Context.Provider>;
}

/** Every contact invokes the practical's existing operation; completion waits for its real state. */
export function useExperimentPerformance(config: Script) {
  const context = useContext(Context);
  const latest = useRef(config); latest.current = config;
  if (context) context.script.current = config;
  const immersive = context?.immersive ?? false;
  useEffect(() => { if (immersive) latest.current.prepare?.(); }, [immersive]);
  const running = context?.running ?? false, paused = context?.paused ?? false, run = context?.run ?? 0;
  const pausedRef = useRef(paused); pausedRef.current = paused;
  useEffect(() => {
    if (!context || !immersive || !running) return;
    let index = 0, elapsed = 0, contacted = false, previous = performance.now();
    const runtime = context.runtime.current;
    const contact = () => {
      if (contacted || pausedRef.current) return;
      contacted = true; runtime.contacted = true;
      latest.current.actions[index]?.perform?.();
    };
    runtime.contact = contact;
    const timer = window.setInterval(() => {
      const now = performance.now(), delta = Math.min(.1, (now - previous) / 1000); previous = now;
      if (pausedRef.current) return;
      const action = latest.current.actions[index];
      if (!action) { context.report('Experiment complete', true); return; }
      elapsed += delta;
      runtime.action = action; runtime.elapsed = elapsed; runtime.scale = latest.current.handScale ?? 2.2;
      if (elapsed <= delta + .001) context.report(action.label);
      if (elapsed >= 1.25) contact();
      if (contacted && elapsed >= (action.seconds ?? 3) && (action.done ?? true)) {
        index++; elapsed = 0; contacted = false; runtime.contacted = false;
      }
    }, 50);
    return () => { window.clearInterval(timer); runtime.contact = undefined; runtime.action = undefined; };
  }, [immersive, running, run, context?.report]);
  return immersive;
}

function RiggedHands() {
  const context = useContext(Context)!;
  const { scene } = useGLTF('/models/science-lab/props/first-person-hands.glb?v=1');
  const hands = React.useMemo(() => [clone(scene), clone(scene)], [scene]);
  const refs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const { camera, controls } = useThree();
  const saved = useRef<{ position: THREE.Vector3; quaternion: THREE.Quaternion; fov: number } | null>(null);
  const look = useRef(new THREE.Vector3());
  const time = useRef(0);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    saved.current = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: (camera as THREE.PerspectiveCamera).fov };
    camera.getWorldDirection(look.current).multiplyScalar(2).add(camera.position);
    const controller = controls as unknown as { enabled?: boolean } | null;
    const enabled = controller?.enabled;
    if (controller) controller.enabled = false;
    return () => {
      if (controller && enabled !== undefined) controller.enabled = enabled;
      if (saved.current) { camera.position.copy(saved.current.position); camera.quaternion.copy(saved.current.quaternion); }
    };
  }, [camera, controls]);
  useFrame((_, delta) => {
    const runtime = context.runtime.current, action = runtime.action;
    if (!context.paused) time.current += delta;
    const t = time.current;
    const target = action ? new THREE.Vector3(...action.target) : null;
    if (context.running && target) {
      const eye = target.clone().add(new THREE.Vector3(.18, 1.12, 1.9));
      const speed = 1 - Math.exp(-delta * (reduced.current ? 6 : 2));
      camera.position.lerp(eye, speed); look.current.lerp(target.clone().add(new THREE.Vector3(0, .05, 0)), speed);
      camera.lookAt(look.current);
    }
    refs.forEach((ref, i) => {
      const hand = ref.current; if (!hand) return;
      const resting = new THREE.Vector3(i ? .28 : -.28, -.32, -.55).applyQuaternion(camera.quaternion).add(camera.position);
      const reach = target && context.running ? THREE.MathUtils.smoothstep(runtime.elapsed, .25, 1.25) : 0;
      const activeHand = i === 1;
      let destination = resting;
      if (target && activeHand) {
        destination = target.clone().add(new THREE.Vector3(.05, .10, .22));
        if (action?.gesture === 'stir') { destination.x += Math.sin(t * 4) * .055; destination.z += Math.cos(t * 4) * .055; }
        if (action?.gesture === 'rinse') destination.y += Math.sin(t * 2) * .035;
      }
      hand.position.copy(resting).lerp(destination, activeHand ? reach : 0);
      hand.quaternion.copy(camera.quaternion);
      if (activeHand && action?.gesture === 'pour') hand.rotateZ(-.6 * reach);
      const grip = activeHand && action?.gesture !== 'observe' ? reach * .8 : .12;
      hands[i].traverse(object => {
        if (!(object instanceof THREE.Bone) || !object.name.includes('finger')) return;
        object.rotation.x = -(action?.gesture === 'press' && object.name.includes('index') ? .08 : grip);
      });
    });
  });
  return <>{hands.map((hand, i) => <group key={i} ref={refs[i]} scale={[i ? 2.2 : -2.2, 2.2, 2.2]}><primitive object={hand} dispose={null} /></group>)}
    {context.running && context.runtime.current.action && <mesh position={context.runtime.current.action.target} onClick={event => { event.stopPropagation(); context.runtime.current.contact?.(); }}><sphereGeometry args={[.18, 12, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>}
  </>;
}
export function FirstPersonScienceActor() {
  const context = useContext(Context);
  if (!context?.immersive) return null;
  return <React.Suspense fallback={null}><RiggedHands /></React.Suspense>;
}
