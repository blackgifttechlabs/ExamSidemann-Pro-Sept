import React, { Suspense, useLayoutEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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

function CameraFit() {
  const { camera, size } = useThree();
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
    camera.zoom = Math.min((size.width - 24) / extent.x, (size.height - 32) / extent.y);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function bubblePosition(object: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }) {
  const point = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld).project(camera);
  // Html is centered on this point; reserve half its width on either side.
  return [
    THREE.MathUtils.clamp((point.x * 0.5 + 0.5) * size.width, 88, Math.max(88, size.width - 88)),
    THREE.MathUtils.clamp((-point.y * 0.5 + 0.5) * size.height - 48, 56, Math.max(56, size.height - 56)),
  ];
}

export function TailSaltScene({ time, onReady }: { time: number; onReady: () => void }) {
  const beat = [...SALT_BEATS].reverse().find(item => time >= item.at) ?? SALT_BEATS[0];
  return (
    <div className="relative isolate h-[330px] w-full sm:h-[390px]" role="img" aria-label={beat.caption}>
      <SceneBoundary>
        <Canvas shadows orthographic camera={{ position: [7, 10, 17], zoom: 35, near: 0.1, far: 80 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <CameraFit />
          <ambientLight intensity={0.8} />
          <hemisphereLight args={['#e7f1ff', '#8c826b', 1.3]} />
          <directionalLight position={[0, 14, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.04} />
          <Suspense fallback={<Html center><span className="whitespace-nowrap text-sm text-slate-500">Loading the neighbourhood…</span></Html>}>
            <SaltModel time={time} onReady={onReady} />
          </Suspense>
          {beat.words && <Html center calculatePosition={bubblePosition} position={[beat.x, 4.5, 1.6]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <div className="relative w-40 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center text-sm leading-snug text-slate-800 shadow-md">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">{beat.speaker}</span>
              {beat.words}
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white" />
            </div>
          </Html>}
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
