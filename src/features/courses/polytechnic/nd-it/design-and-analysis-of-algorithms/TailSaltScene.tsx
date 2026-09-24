import React, { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

import timeline from './tailSaltTimeline.json';

export const SALT_BEATS = timeline.beats;
export const SALT_DURATION = timeline.duration;
export const SALT_BASE_AT = timeline.baseAt;
export const SALT_RETURN_AT = timeline.returnStart;


class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="p-6 text-center text-sm text-slate-500">The 3D scene could not load. The captions below describe each step.</p>
      : this.props.children;
  }
}

function SaltModel({ time, onReady }: { time: number; onReady: () => void }) {
  const gltf = useGLTF('/models/tail-salt.glb?v=6-houses');
  const scene = useMemo(() => {
    const model = clone(gltf.scene);
    model.traverse(object => {
      if (object.name.startsWith('Speech')) object.visible = false;
      if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
    });
    return model;
  }, [gltf.scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  useLayoutEffect(() => {
    const actions = gltf.animations.map(clip => {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      return action;
    });
    onReady();
    return () => { actions.forEach(action => action.stop()); mixer.uncacheRoot(scene); };
  }, [gltf.animations, mixer, scene, onReady]);
  useLayoutEffect(() => {
    // Re-enable finished actions so replay and seeking also work after the last frame.
    gltf.animations.forEach(clip => { mixer.clipAction(clip).paused = false; });
    mixer.setTime(Math.min(time, SALT_DURATION - 0.001));
  }, [time, mixer, gltf.animations]);
  return <primitive object={scene} />;
}

const ZOOM_IN = 1.8;      // how much closer than the full view when following a person
const OUT_LEAD = 0.7;     // seconds to zoom out before the base case
const OUT_HOLD = 2;       // seconds held zoomed out while they speak
const IN_BACK = 0.9;      // seconds to zoom back in afterwards

function followX(time: number) {
  const pts = SALT_BEATS as Array<{ at: number; x: number }>;
  if (!pts.length) return 0;
  if (time <= pts[0].at) return pts[0].x;
  for (let i = 0; i < pts.length - 1; i++) {
    if (time < pts[i + 1].at) {
      const t = THREE.MathUtils.smootherstep((time - pts[i].at) / Math.max(0.001, pts[i + 1].at - pts[i].at), 0, 1);
      return THREE.MathUtils.lerp(pts[i].x, pts[i + 1].x, t);
    }
  }
  return pts[pts.length - 1].x;
}

function zoomOutAmount(time: number) {
  const a = SALT_BASE_AT - OUT_LEAD;
  const b = SALT_BASE_AT;
  const c = SALT_BASE_AT + OUT_HOLD;
  const d = c + IN_BACK;
  if (time < a || time >= d) return 0;
  if (time < b) return THREE.MathUtils.smootherstep((time - a) / (b - a), 0, 1);
  if (time < c) return 1;
  return 1 - THREE.MathUtils.smootherstep((time - c) / (d - c), 0, 1);
}

function CameraFit({ time }: { time: number }) {
  const { camera, size } = useThree();
  const fitZoom = useRef(35);
  const cx = useRef(followX(0));
  const clock = useRef(time);
  clock.current = time;
  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    camera.position.set(7, 11, 23);
    camera.lookAt(0, 1.3, 0);
    camera.updateMatrixWorld(true);
    // Fit the entire island in camera space, including roofs and dialogue headroom.
    const bounds = new THREE.Box3();
    for (const x of [-12.7, 12.7]) {
      for (const y of [-0.35, 4.6]) {
        for (const z of [-3.6, 3.6]) {
          bounds.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
        }
      }
    }
    const extent = bounds.getSize(new THREE.Vector3());
    fitZoom.current = Math.min((size.width - 24) / extent.x, (size.height - 32) / extent.y);
  }, [camera, size]);
  useFrame((_, delta) => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const out = zoomOutAmount(clock.current);
    const targetZoom = fitZoom.current * THREE.MathUtils.lerp(ZOOM_IN, 1, out);
    const targetX = THREE.MathUtils.lerp(followX(clock.current), 0, out);
    const k = 1 - Math.exp(-delta * 6);
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, k);
    cx.current = THREE.MathUtils.lerp(cx.current, targetX, k);
    const lookY = THREE.MathUtils.lerp(2.7, 1.3, out);
    camera.position.set(7 + cx.current, 11 + (lookY - 1.3), 23);
    camera.lookAt(cx.current, lookY, 0);
    camera.updateProjectionMatrix();
  });
  return null;
}

function TailAnchor({ time, tailRef }: { time: number; tailRef: React.RefObject<HTMLDivElement | null> }) {
  const { camera } = useThree();
  const clock = useRef(time);
  clock.current = time;
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const el = tailRef.current;
    if (!el) return;
    const beat = [...SALT_BEATS].reverse().find(item => clock.current >= item.at) ?? SALT_BEATS[0];
    camera.updateMatrixWorld();
    v.set(beat.x, 2.5, 0).project(camera);
    el.style.setProperty('--tail', `${THREE.MathUtils.clamp((v.x * 0.5 + 0.5) * 100, 8, 92)}%`);
  });
  return null;
}

const TYPE_CPS = 26; // characters typed per second of lesson time

export function TailSaltScene({ time, onReady }: { time: number; onReady: () => void }) {
  const beat = [...SALT_BEATS].reverse().find(item => time >= item.at) ?? SALT_BEATS[0];
  const tailRef = useRef<HTMLDivElement>(null);
  const full: string = beat.words ?? '';
  const shown = Math.min(full.length, Math.max(0, Math.floor((time - beat.at) * TYPE_CPS)));
  const typing = shown < full.length;
  const asker = /^do you have salt/i.test(full);
  const num = /(\d+)/.exec(beat.speaker)?.[1] ?? (beat.speaker === 'Cook' ? 'C' : '');
  const grad = asker ? 'from-blue-500 via-blue-700 to-slate-900 shadow-blue-900/30' : 'from-emerald-400 via-teal-600 to-slate-900 shadow-teal-900/30';
  const tailColor = asker ? 'bg-blue-600' : 'bg-teal-600';
  return (
    <div>
      <div className="relative isolate h-[380px] w-full sm:h-[460px]" role="img" aria-label={beat.caption}>
        <SceneBoundary>
          <Canvas shadows orthographic camera={{ position: [7, 10, 17], zoom: 35, near: 0.1, far: 80 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
            <CameraFit time={time} />
            <TailAnchor time={time} tailRef={tailRef} />
            <ambientLight intensity={0.8} />
            <hemisphereLight args={['#e7f1ff', '#8c826b', 1.3]} />
            <directionalLight position={[0, 14, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.04} />
            <Suspense fallback={<Html center><span className="whitespace-nowrap text-sm text-slate-500">Loading the neighbourhood…</span></Html>}>
              <SaltModel time={time} onReady={onReady} />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      </div>
      <div ref={tailRef} className="relative mt-4 h-[210px] sm:h-[170px]" style={{ '--tail': '50%' } as React.CSSProperties}>
        {full && (
          <div key={beat.at} className={`relative animate-[bubble-pop_.35s_ease-out] rounded-3xl bg-gradient-to-br ${grad} px-6 py-5 shadow-xl ring-1 ring-white/20 sm:px-8 sm:py-6`}>
            <style>{`@keyframes bubble-pop{0%{opacity:0;transform:translateY(8px) scale(.96)}100%{opacity:1;transform:none}}`}</style>
            <span aria-hidden="true" className={`absolute -top-2.5 h-5 w-5 rotate-45 rounded-sm ${tailColor}`} style={{ left: 'calc(var(--tail) - 10px)' }} />
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-sky-100">
              <span className={`h-2 w-2 rounded-full bg-emerald-300 ${typing ? 'animate-pulse' : ''}`} />
              {num && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-black text-slate-900">{num}</span>}
              {beat.speaker} · {asker ? 'asking' : 'answering'}
            </span>
            <p className="relative text-xl font-semibold leading-snug text-white sm:text-2xl">
              <span className="invisible">{full}</span>
              <span className="absolute inset-0" aria-hidden="true">
                {full.slice(0, shown)}
                {typing && <span className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-0.5 animate-pulse rounded-full bg-white align-baseline" />}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
