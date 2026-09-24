import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { useLabAsset as useGLTF } from './LabAssets';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import './combinedScienceExperience.css';

export type PerformanceAction = {
  id: string; label: string; target: [number, number, number];
  follow?: string; followOffset?: [number, number, number];
  gesture?: 'press' | 'grip' | 'pour' | 'stir' | 'rinse' | 'observe';
  perform?: () => void; done?: boolean; seconds?: number;
};
type Script = { actions: PerformanceAction[]; reset: () => void; prepare?: () => void; handScale?: number };
type Runtime = { action?: PerformanceAction; elapsed: number; contacted: boolean; scale: number; contact?: () => void };
type Experience = {
  immersive: boolean; running: boolean; paused: boolean; run: number;
  script: React.MutableRefObject<Script | null>; runtime: React.MutableRefObject<Runtime>;
  report: (label: string, complete?: boolean) => void;
  markReady: () => void;
};
const Context = createContext<Experience | null>(null);
export function useFirstPersonScience() { return useContext(Context)?.immersive ?? false; }

export function CombinedScienceExperience({ title, children }: { title: string; children: ReactNode }) {
  const [immersive, setImmersive] = useState(true);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [label, setLabel] = useState('');
  const [sceneReady, setSceneReady] = useState(false);
  const loading = useProgress();
  const markReady = React.useCallback(() => setSceneReady(true), []);
  const ready = sceneReady && !loading.active;
  const [complete, setComplete] = useState(false);
  const script = useRef<Script | null>(null);
  const runtime = useRef<Runtime>({ elapsed: 0, contacted: false, scale: 2.2 });
  const report = React.useCallback((text: string, finished = false) => {
    setLabel(text); if (finished) { setRunning(false); setComplete(true); }
  }, []);
  const start = () => {
    if (!script.current || !ready) return;
    script.current.reset(); script.current.prepare?.();
    setComplete(false); setPaused(false); setRun(n => n + 1); setRunning(true);
  };
  const changeMode = (next: boolean) => {
    if (running) script.current?.reset();
    setRunning(false); setPaused(false); setComplete(false); setImmersive(next);
  };
  return <Context.Provider value={{ immersive, running, paused, run, script, runtime, report, markReady }}>
    <div data-performance-status={running ? (paused ? "paused" : "running") : complete ? "complete" : ready ? "ready" : "loading"} className={`science-experience ${immersive ? 'first-person-science' : 'learning-science'}`}>
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
      {immersive && !ready && <div className="science-loading-screen" role="status" aria-live="polite">
        <strong>{loading.errors.length ? 'The lab could not finish loading' : 'Loading your science lab'}</strong>
        <progress max={100} value={Math.min(99, Math.round(100 * loading.loaded / Math.max(1, loading.total)))} />
        <span>{loading.errors.length ? 'Check your connection and retry.' : `${Math.min(99, Math.round(100 * loading.loaded / Math.max(1, loading.total)))}% · Preparing room, equipment and hands`}</span>
        {loading.errors.length > 0 && <button onClick={() => window.location.reload()}>Retry loading</button>}
      </div>}
      {immersive && ready && !running && <div className="science-start-screen"><button onClick={start}>{complete ? 'Replay experiment' : 'Start'}</button>{complete && <span>Experiment complete</span>}</div>}
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
      const now = performance.now(), delta = Math.min(.5, (now - previous) / 1000); previous = now;
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

/** Arm segments join the camera's shoulder anchors to the wrist on every frame. */
function RiggedHands() {
  const context = useContext(Context)!;
  const { scene } = useGLTF('/models/science-lab/props/first-person-hands.glb?v=anatomy-compressed3');
  const hands = React.useMemo(() => [clone(scene), clone(scene)], [scene]);
  const restJoints = React.useMemo(() => {
    const rotations = new Map<THREE.Bone, THREE.Quaternion>();
    hands.forEach(hand => hand.traverse(o => { if (o instanceof THREE.Bone) rotations.set(o, o.quaternion.clone()); }));
    return rotations;
  }, [hands]);
  const wrists = [useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const uppers = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const lowers = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const elbows = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const { camera, controls, scene: world } = useThree();
  const saved = useRef<{ position: THREE.Vector3; quaternion: THREE.Quaternion; fov: number } | null>(null);
  const look = useRef(new THREE.Vector3());
  const time = useRef(0), loadedFrames = useRef(0), reported = useRef(false);
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const smoothTarget = useRef<THREE.Vector3 | null>(null);
  useEffect(() => {
    saved.current = { position: camera.position.clone(), quaternion: camera.quaternion.clone(), fov: (camera as THREE.PerspectiveCamera).fov };
    camera.getWorldDirection(look.current).multiplyScalar(3).add(camera.position);
    const controller = controls as unknown as { enabled?: boolean } | null;
    const enabled = controller?.enabled;
    if (controller) controller.enabled = false;
    const perspective = camera as THREE.PerspectiveCamera;
    perspective.fov = 62; perspective.updateProjectionMatrix();
    return () => {
      if (controller && enabled !== undefined) controller.enabled = enabled;
      if (saved.current) { camera.position.copy(saved.current.position); camera.quaternion.copy(saved.current.quaternion); perspective.fov = saved.current.fov; perspective.updateProjectionMatrix(); }
    };
  }, [camera, controls]);
  const segment = (mesh: THREE.Mesh | null, from: THREE.Vector3, to: THREE.Vector3, radius: number) => {
    if (!mesh) return;
    const direction = to.clone().sub(from);
    mesh.position.copy(from).add(to).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    mesh.scale.set(radius, direction.length(), radius);
  };
  useFrame((_, delta) => {
    if (!reported.current && world.getObjectByName('Blender science laboratory') && ++loadedFrames.current > 3) {
      reported.current = true; context.markReady();
    }
    const runtime = context.runtime.current, action = runtime.action;
    if (!context.paused) time.current += delta;
    const t = time.current;
    const target = action ? new THREE.Vector3(...action.target) : null;
    if (context.running && target) {
      if (!smoothTarget.current) smoothTarget.current = target.clone();
      smoothTarget.current.lerp(target, 1 - Math.exp(-delta * 2.5));
      // Keep the apparatus, forearms and surrounding bench visible throughout the action.
      const eye = smoothTarget.current.clone().add(new THREE.Vector3(.1, 1.28, 3.15));
      const speed = 1 - Math.exp(-delta * (reduced.current ? 6 : 1.5));
      camera.position.lerp(eye, speed); look.current.lerp(smoothTarget.current, speed);
      camera.lookAt(look.current);
    }
    wrists.forEach((ref, i) => {
      const hand = ref.current; if (!hand) return;
      const side = i ? 1 : -1;
      const scale = runtime.scale;
      const resting = new THREE.Vector3(side * .34, -.36, -.92).applyQuaternion(camera.quaternion).add(camera.position);
      const reaching = target && context.running && action?.gesture !== 'observe';
      const reach = reaching ? THREE.MathUtils.smoothstep(runtime.elapsed, .25, 1.25) : 0;
      let destination = resting.clone();
      if (target && i === 1 && reaching) {
        const followed = action?.follow ? world.getObjectByName(action.follow) : null;
        const contactTarget = followed ? followed.localToWorld(new THREE.Vector3(...(action?.followOffset ?? [0,0,0]))) : target;
        const fingertip = (action?.gesture === 'press' ? new THREE.Vector3(-.033, .006, -.166) : new THREE.Vector3(-.015, -.008, -.11)).multiplyScalar(scale).applyQuaternion(camera.quaternion);
        destination = contactTarget.clone().sub(fingertip);
        if (action?.gesture === 'stir') { destination.x += Math.sin(t * 4) * .055; destination.z += Math.cos(t * 4) * .055; }
        if (action?.gesture === 'rinse') destination.y += Math.sin(t * 2) * .025;
      }
      const wrist = resting.clone().lerp(destination, i === 1 ? reach : 0);
      hand.position.lerp(wrist, 1 - Math.exp(-delta * 9));
      hand.quaternion.copy(camera.quaternion);
      if (i === 1 && action?.gesture === 'pour') hand.rotateZ(-.45 * reach);
      hand.scale.set(side * scale, scale, scale);
      const cuff = new THREE.Vector3(0, -.012 * scale, .145 * scale).applyQuaternion(hand.quaternion).add(hand.position);
      const shoulder = new THREE.Vector3(side * .48, -.64, .16).applyQuaternion(camera.quaternion).add(camera.position);
      const elbow = shoulder.clone().lerp(cuff, .52).add(new THREE.Vector3(side * .23, -.20, .13).applyQuaternion(camera.quaternion));
      segment(uppers[i].current, shoulder, elbow, .050 * scale);
      segment(lowers[i].current, elbow, cuff, .038 * scale);
      if (elbows[i].current) { elbows[i].current!.position.copy(elbow); elbows[i].current!.scale.setScalar(.052 * scale); }
      const grip = i === 1 && reaching ? reach * .58 : .13;
      hands[i].traverse(object => {
        if (!(object instanceof THREE.Bone) || !object.name.includes('finger')) return;
        const isIndex = object.name.includes('index');
        const curl = action?.gesture === 'press' && isIndex ? .045 : grip;
        object.quaternion.copy(restJoints.get(object)!).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -curl));
      });
    });
  });
  return <>{hands.map((hand, i) => <React.Fragment key={i}>
    <group ref={wrists[i]} name={`First-person ${i ? 'right' : 'left'} hand`}><primitive object={hand} dispose={null} /></group>
    <mesh ref={uppers[i]} castShadow><cylinderGeometry args={[.94, 1, 1, 16]} /><meshStandardMaterial color="#d2d9d4" roughness={.9} /></mesh>
    <mesh ref={lowers[i]} castShadow><cylinderGeometry args={[.9, 1.24, 1, 16]} /><meshStandardMaterial color="#d2d9d4" roughness={.9} /></mesh>
    <mesh ref={elbows[i]} castShadow><sphereGeometry args={[1,16,10]} /><meshStandardMaterial color="#d2d9d4" roughness={.9} /></mesh>
  </React.Fragment>)}
    {context.running && context.runtime.current.action && <mesh position={context.runtime.current.action.target} onClick={event => { event.stopPropagation(); context.runtime.current.contact?.(); }}><sphereGeometry args={[.18, 12, 8]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>}
  </>;
}
export function FirstPersonScienceActor() {
  const context = useContext(Context);
  if (!context?.immersive) return null;
  return <React.Suspense fallback={null}><RiggedHands /></React.Suspense>;
}
