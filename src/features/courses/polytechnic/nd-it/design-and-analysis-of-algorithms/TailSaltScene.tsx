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

function DynamicCamera({ time, targetX }: { time: number; targetX: number }) {
  const { camera, size } = useThree();
  const currentLookX = useRef(targetX);
  const currentZoom = useRef(35);

  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      currentLookX.current = targetX;
      camera.position.set(targetX + 3.5, 8.5, 18);
      camera.lookAt(targetX, 1.3, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((_, delta) => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    // Zoom out for 2 seconds when reaching the base case (at 27.3s when Neighbour 5 speaks)
    const isBaseCaseZoomOut = time >= SALT_BASE_AT && time <= (SALT_BASE_AT + 2.0);

    const goalX = isBaseCaseZoomOut ? 0 : targetX;
    const fullFitZoom = Math.min((size.width - 24) / 25.4, (size.height - 32) / 8.5);
    const goalZoom = isBaseCaseZoomOut ? Math.max(30, fullFitZoom) : (size.width < 640 ? 52 : 68);

    const blend = 1 - Math.exp(-delta * 5);

    currentLookX.current = THREE.MathUtils.lerp(currentLookX.current, goalX, blend);
    currentZoom.current = THREE.MathUtils.lerp(currentZoom.current, goalZoom, blend);

    camera.position.set(currentLookX.current + 3.5, 8.5, 18);
    camera.lookAt(currentLookX.current, 1.3, 0);
    camera.zoom = currentZoom.current;
    camera.updateProjectionMatrix();
  });

  return null;
}

export function TailSaltScene({ time, onReady }: { time: number; onReady: () => void }) {
  const beat = [...SALT_BEATS].reverse().find(item => time >= item.at) ?? SALT_BEATS[0];
  return (
    <div className="relative isolate h-[330px] w-full sm:h-[390px]" role="img" aria-label={beat.caption}>
      <SceneBoundary>
        <Canvas shadows orthographic camera={{ position: [7, 10, 17], zoom: 35, near: 0.1, far: 80 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <DynamicCamera time={time} targetX={beat.x} />
          <ambientLight intensity={0.8} />
          <hemisphereLight args={['#e7f1ff', '#8c826b', 1.3]} />
          <directionalLight position={[0, 14, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-17} shadow-camera-right={17} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.04} />
          <Suspense fallback={<Html center><span className="whitespace-nowrap text-sm text-slate-500">Loading the neighbourhood…</span></Html>}>
            <SaltModel time={time} onReady={onReady} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
