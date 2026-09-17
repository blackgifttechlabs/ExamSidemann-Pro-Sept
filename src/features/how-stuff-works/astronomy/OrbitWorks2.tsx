import React, { useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Sun as SunIcon,
  Moon as MoonIcon,
  Orbit,
  ChevronRight,
  ArrowRight,
  Sliders,
  Sparkles,
} from 'lucide-react';

// ─── Model Preparer Helper ─────────────────────────────────────────────────────
function prepareModel(rawScene: THREE.Group, targetDiameter: number) {
  const clone = rawScene.clone(true);

  // Step 1: measure size BEFORE scaling to compute scale factor
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const currentMaxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetDiameter / currentMaxDim;
  clone.scale.set(scale, scale, scale);

  // Step 2: re-measure in POST-scale space to get the true center offset
  clone.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(clone);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  clone.position.sub(center);

  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        mat.roughness = 0.65;
        mat.metalness = 0.1;
        mat.needsUpdate = true;
      });
    }
  });

  const wrapper = new THREE.Group();
  wrapper.add(clone);
  return wrapper;
}

// ─── 3D Sun Model (Using downloaded /models/the_sun.glb) ───────────────────────
function prepareSunModel(rawScene: THREE.Group, targetDiameter: number) {
  const clone = rawScene.clone(true);

  // Step 1: measure size BEFORE scaling to compute scale factor
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetDiameter / maxDim;
  clone.scale.set(scale, scale, scale);

  // Step 2: re-measure in POST-scale space for correct centering
  clone.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(clone);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  clone.position.sub(center);

  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        if (mat.map) {
          mat.emissiveMap = mat.map;
          mat.emissive = new THREE.Color('#ffffff');
          mat.emissiveIntensity = 1.35;
        } else {
          mat.emissive = new THREE.Color('#ff8c00');
          mat.emissiveIntensity = 1.6;
        }
        mat.roughness = 0.3;
        mat.metalness = 0.0;
        mat.needsUpdate = true;
      });
    }
  });

  const wrapper = new THREE.Group();
  wrapper.add(clone);
  return wrapper;
}

function Sun() {
  const { scene } = useGLTF('/models/the_sun.glb');
  const sunRef = useRef<THREE.Group>(null);

  const preparedSun = useMemo(() => {
    return prepareSunModel(scene, 3.8);
  }, [scene]);

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={sunRef}>
      <primitive object={preparedSun} />
      <pointLight position={[0, 0, 0]} color="#fff5e0" intensity={25} distance={110} decay={0.75} />
    </group>
  );
}

// ─── 3D Orbit Circular Path ───────────────────────────────────────────────────
function CircularOrbitRing({ radius, color = '#38bdf8', opacity = 0.35 }: { radius: number; color?: string; opacity?: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 144;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  return <Line points={points} color={color} lineWidth={1.1} transparent opacity={opacity} />;
}

// ─── 3D Vector Arrow Component with Correct Quaternion Alignment ──────────────
function Arrow3D({
  start,
  direction,
  length,
  color,
  headLength = 0.5,
  headRadius = 0.2,
  shaftRadius = 0.05,
}: {
  start: [number, number, number];
  direction: [number, number, number];
  length: number;
  color: string;
  headLength?: number;
  headRadius?: number;
  shaftRadius?: number;
}) {
  const { orientation, shaftPos, headPos, actualShaftLen, actualHeadLen } = useMemo(() => {
    const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

    const actualHeadLen = Math.min(headLength, length * 0.45);
    const shaftLen = Math.max(0.01, length - actualHeadLen);

    const sPos = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(shaftLen / 2));
    const hPos = new THREE.Vector3(...start).add(
      dir.clone().multiplyScalar(shaftLen + actualHeadLen / 2)
    );

    return {
      orientation: quat,
      shaftPos: [sPos.x, sPos.y, sPos.z] as [number, number, number],
      headPos: [hPos.x, hPos.y, hPos.z] as [number, number, number],
      actualShaftLen: shaftLen,
      actualHeadLen,
    };
  }, [start, direction, length, headLength]);

  return (
    <group>
      {/* 3D Cylinder Shaft */}
      <mesh position={shaftPos} quaternion={orientation}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, actualShaftLen, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* 3D Cone Head */}
      <mesh position={headPos} quaternion={orientation}>
        <coneGeometry args={[headRadius, actualHeadLen, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// ─── Space Satellite Object ────────────────────────────────────────────────────
function SatelliteObject({
  satOrbitRadius,
  simTimeRef,
  satSpeed = 3.0,
  showVectors,
}: {
  satOrbitRadius: number;
  simTimeRef: React.MutableRefObject<number>;
  satSpeed?: number;
  showVectors: boolean;
}) {
  const { scene } = useGLTF('/models/space_satellite.glb');
  const satRef = useRef<THREE.Group>(null);
  const [satAngle, setSatAngle] = useState(0);

  const preparedSatellite = useMemo(() => {
    return prepareModel(scene, 0.45);
  }, [scene]);

  useFrame(() => {
    const a = simTimeRef.current * satSpeed;
    setSatAngle(a);
    if (satRef.current) {
      satRef.current.position.x = Math.cos(a) * satOrbitRadius;
      satRef.current.position.z = Math.sin(a) * satOrbitRadius;
      satRef.current.rotation.y = -a + Math.PI / 2;
    }
  });

  const satPos: [number, number, number] = [
    Math.cos(satAngle) * satOrbitRadius,
    0,
    Math.sin(satAngle) * satOrbitRadius,
  ];

  // Directions relative to Earth
  const inwardToEarth: [number, number, number] = [
    -Math.cos(satAngle),
    0,
    -Math.sin(satAngle),
  ];
  const tangentForward: [number, number, number] = [
    -Math.sin(satAngle),
    0,
    Math.cos(satAngle),
  ];

  return (
    <group>
      <CircularOrbitRing radius={satOrbitRadius} color="#22d3ee" opacity={0.45} />
      <group ref={satRef}>
        <primitive object={preparedSatellite} />
      </group>

      {/* Vectors for Satellite */}
      {showVectors && (
        <group>
          {/* Gravity Pull inward toward Earth */}
          <Arrow3D
            start={satPos}
            direction={inwardToEarth}
            length={0.95}
            color="#f97316"
            headLength={0.22}
            headRadius={0.09}
            shaftRadius={0.025}
          />
          {/* Forward Velocity */}
          <Arrow3D
            start={satPos}
            direction={tangentForward}
            length={1.15}
            color="#10b981"
            headLength={0.22}
            headRadius={0.09}
            shaftRadius={0.025}
          />
        </group>
      )}
    </group>
  );
}

// ─── Moon Object ───────────────────────────────────────────────────────────────
// ─── Moon Object (Physically Accurate 5.14° Orbital Tilt, Non-Eclipse Phase) ──
function MoonObject({
  orbitRadius,
  simTimeRef,
  showVectors,
}: {
  orbitRadius: number;
  simTimeRef: React.MutableRefObject<number>;
  showVectors: boolean;
}) {
  const { scene } = useGLTF('/models/moon.glb');
  const moonRef = useRef<THREE.Group>(null);
  const [moonAngle, setMoonAngle] = useState(Math.PI / 2.3);

  const preparedMoon = useMemo(() => {
    return prepareModel(scene, 0.48);
  }, [scene]);

  // Real astrophysics: Moon's orbit is tilted 5.14° to the ecliptic plane
  const moonTiltX = (5.14 * Math.PI) / 180;
  const moonTiltZ = (8.0 * Math.PI) / 180;

  useFrame(() => {
    // Non-eclipse quarter-phase offset so the Moon is illuminated from the side by the Sun
    const a = simTimeRef.current * 0.9 + Math.PI / 2.3;
    setMoonAngle(a);
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(a) * orbitRadius;
      moonRef.current.position.z = Math.sin(a) * orbitRadius;
    }
  });

  const moonPos: [number, number, number] = [
    Math.cos(moonAngle) * orbitRadius,
    0,
    Math.sin(moonAngle) * orbitRadius,
  ];

  const inwardToEarth: [number, number, number] = [
    -Math.cos(moonAngle),
    0,
    -Math.sin(moonAngle),
  ];
  const forwardTangent: [number, number, number] = [
    -Math.sin(moonAngle),
    0,
    Math.cos(moonAngle),
  ];

  return (
    // Inclined 5.14° orbit plane prevents monthly eclipses, matching real physics
    <group rotation={[moonTiltX, 0, moonTiltZ]}>
      <CircularOrbitRing radius={orbitRadius} color="#e2e8f0" opacity={0.35} />
      <group ref={moonRef}>
        <primitive object={preparedMoon} />
      </group>

      {/* Vectors for Moon */}
      {showVectors && (
        <group>
          {/* Gravity pull inward to Earth */}
          <Arrow3D
            start={moonPos}
            direction={inwardToEarth}
            length={1.2}
            color="#f97316"
            headLength={0.3}
            headRadius={0.12}
            shaftRadius={0.03}
          />
          {/* Forward velocity */}
          <Arrow3D
            start={moonPos}
            direction={forwardTangent}
            length={1.4}
            color="#10b981"
            headLength={0.3}
            headRadius={0.12}
            shaftRadius={0.03}
          />
        </group>
      )}
    </group>
  );
}

// ─── Earth System (Dynamically renders based on viewMode) ──────────────────────
function EarthSystem({
  sunOrbitRadius,
  simTimeRef,
  earthSpeed,
  showVectors,
  currentEarthPosRef,
  viewMode,
}: {
  sunOrbitRadius: number;
  simTimeRef: React.MutableRefObject<number>;
  earthSpeed: number;
  showVectors: boolean;
  currentEarthPosRef: React.MutableRefObject<THREE.Vector3>;
  viewMode: 'solar' | 'earth-moon' | 'satellite';
}) {
  const { scene: earthScene } = useGLTF('/models/earth.glb');
  const earthOrbitRef = useRef<THREE.Group>(null);
  const earthSpinRef = useRef<THREE.Group>(null);

  const [orbitAngle, setOrbitAngle] = useState(0);

  const preparedEarth = useMemo(() => {
    return prepareModel(earthScene, 1.25);
  }, [earthScene]);

  useFrame((_, delta) => {
    const a = simTimeRef.current * earthSpeed;
    setOrbitAngle(a);

    const ex = Math.cos(a) * sunOrbitRadius;
    const ez = Math.sin(a) * sunOrbitRadius;

    if (earthOrbitRef.current) {
      earthOrbitRef.current.position.x = ex;
      earthOrbitRef.current.position.z = ez;
      currentEarthPosRef.current.set(ex, 0, ez);
    }

    if (earthSpinRef.current) {
      earthSpinRef.current.rotation.y += delta * 0.8;
    }
  });

  const earthPos: [number, number, number] = [
    Math.cos(orbitAngle) * sunOrbitRadius,
    0,
    Math.sin(orbitAngle) * sunOrbitRadius,
  ];

  // Vectors for Earth around Sun
  const inwardToSun: [number, number, number] = [
    -Math.cos(orbitAngle),
    0,
    -Math.sin(orbitAngle),
  ];
  const tangentForward: [number, number, number] = [
    -Math.sin(orbitAngle),
    0,
    Math.cos(orbitAngle),
  ];

  return (
    <>
      <group ref={earthOrbitRef}>
        {/* Earth Axial Tilt */}
        <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
          <group ref={earthSpinRef}>
            <primitive object={preparedEarth} />
          </group>
        </group>

        {/* In Satellite View: Render ONLY Earth and Satellite (NO Moon) */}
        {viewMode === 'satellite' && (
          <SatelliteObject
            satOrbitRadius={1.85}
            simTimeRef={simTimeRef}
            satSpeed={3.0}
            showVectors={showVectors}
          />
        )}

        {/* In Earth & Moon View: Render ONLY Earth and Moon (NO Satellite) */}
        {viewMode === 'earth-moon' && (
          <MoonObject
            orbitRadius={3.0}
            simTimeRef={simTimeRef}
            showVectors={showVectors}
          />
        )}
      </group>

      {/* Earth Vectors: Inward Sun Gravity & Forward Velocity (Shown in Solar View) */}
      {showVectors && viewMode === 'solar' && (
        <group>
          <Arrow3D
            start={earthPos}
            direction={inwardToSun}
            length={3.0}
            color="#f97316"
            headLength={0.55}
            headRadius={0.22}
            shaftRadius={0.06}
          />
          <Arrow3D
            start={earthPos}
            direction={tangentForward}
            length={3.2}
            color="#10b981"
            headLength={0.55}
            headRadius={0.22}
            shaftRadius={0.06}
          />
        </group>
      )}
    </>
  );
}

// ─── Camera Controller: Locks Earth in center when focusing on it ─────────────
function CameraRig({
  viewMode,
  currentEarthPosRef,
  controlsRef,
}: {
  viewMode: 'solar' | 'earth-moon' | 'satellite';
  currentEarthPosRef: React.MutableRefObject<THREE.Vector3>;
  controlsRef: React.MutableRefObject<any>;
}) {
  useFrame(() => {
    if (!controlsRef.current) return;

    if (viewMode === 'solar') {
      // Focus Sun in the center
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.06);
      controlsRef.current.update();
    } else if (viewMode === 'earth-moon' || viewMode === 'satellite') {
      const earthPos = currentEarthPosRef.current;
      // Calculate delta movement to track Earth perfectly in center with zero drift
      const delta = earthPos.clone().sub(controlsRef.current.target);
      controlsRef.current.target.copy(earthPos);
      controlsRef.current.object.position.add(delta);
      controlsRef.current.update();
    }
  });

  return null;
}

// ─── Main Scene Component ─────────────────────────────────────────────────────
function Scene({
  simTimeRef,
  currentEarthPosRef,
  showVectors,
  viewMode,
  controlsRef,
}: {
  simTimeRef: React.MutableRefObject<number>;
  currentEarthPosRef: React.MutableRefObject<THREE.Vector3>;
  showVectors: boolean;
  viewMode: 'solar' | 'earth-moon' | 'satellite';
  controlsRef: React.MutableRefObject<any>;
}) {
  const sunOrbitRadius = 11.5;

  return (
    <>
      <Stars radius={130} depth={80} count={6500} factor={4} fade speed={0.2} />
      <ambientLight color="#1e293b" intensity={0.75} />

      {/* Authentic Glowing Central Sun */}
      <Sun />

      {/* Earth Sun Orbit Path */}
      <CircularOrbitRing radius={sunOrbitRadius} color="#38bdf8" opacity={0.35} />

      {/* Earth System */}
      <EarthSystem
        sunOrbitRadius={sunOrbitRadius}
        simTimeRef={simTimeRef}
        earthSpeed={0.35}
        showVectors={showVectors}
        currentEarthPosRef={currentEarthPosRef}
        viewMode={viewMode}
      />

      <CameraRig
        viewMode={viewMode}
        currentEarthPosRef={currentEarthPosRef}
        controlsRef={controlsRef}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.5}
        maxDistance={250}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ─── Top Level View Component ──────────────────────────────────────────────────
export const OrbitWorks2: React.FC = () => {
  const navigate = useNavigate();

  // Playback & Simulation
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showKeyVisual, setShowKeyVisual] = useState(false);
  const [viewMode, setViewMode] = useState<'solar' | 'earth-moon' | 'satellite'>('solar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Time accumulator
  const simTimeRef = useRef(0);
  const currentEarthPosRef = useRef(new THREE.Vector3(11.5, 0, 0));
  const controlsRef = useRef<any>(null);

  const handleFrame = (_: any, delta: number) => {
    if (isPlaying) {
      simTimeRef.current += delta * speedMultiplier;
    }
  };

  // Switch camera view & set initial camera offsets
  const switchView = (mode: 'solar' | 'earth-moon' | 'satellite') => {
    setViewMode(mode);
    if (!controlsRef.current) return;

    if (mode === 'solar') {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 22, 28);
    } else if (mode === 'earth-moon') {
      const e = currentEarthPosRef.current;
      controlsRef.current.target.copy(e);
      controlsRef.current.object.position.set(e.x - 2.8, e.y + 4.2, e.z + 7.2);
    } else if (mode === 'satellite') {
      const e = currentEarthPosRef.current;
      controlsRef.current.target.copy(e);
      controlsRef.current.object.position.set(e.x, e.y + 2.2, e.z + 4.2);
    }
    controlsRef.current.update();
  };

  // Trigger the "Key Visual" Pause & Force Vector action
  const toggleKeyVisual = () => {
    if (!showKeyVisual) {
      setIsPlaying(false); // Pause motion
      setShowKeyVisual(true); // Show forward velocity & gravity arrows
    } else {
      setShowKeyVisual(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden font-sans text-white select-none">
      {/* ─── Top Bar: Clean Back Arrow & Title ─── */}
      <div className="absolute top-0 left-0 z-20 px-4 md:px-6 lg:px-8 py-4 sm:py-5 flex items-center gap-3.5 pointer-events-auto">
        <button
          onClick={() => navigate('/how-stuff-works/astronomy/')}
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer shadow-md"
          aria-label="Back to Astronomy"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            How Orbits Work 2: Earth &amp; Satellites
          </h1>
          <p className="text-[11px] text-cyan-400 font-semibold mt-0.5 hidden sm:block">
            Sun, Earth, Moon &amp; Space Satellite Orbits with Force Vector Analysis
          </p>
        </div>
      </div>

      {/* ─── Mobile / Collapsed Sidebar Opener Button ─── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 sm:top-5 right-4 md:right-6 lg:right-8 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border-2 border-b-4 border-slate-700 text-xs font-black text-white shadow-2xl backdrop-blur-md transition-all cursor-pointer active:translate-y-0.5 active:border-b-2"
        >
          <Sliders size={14} className="text-[#1cb0f6]" />
          <span>Orbit Lab Controls</span>
        </button>
      )}

      {/* ─── 3D Simulation Canvas ─── */}
      <div className="flex-1 w-full h-full">
        <Canvas
          camera={{ position: [0, 20, 28], fov: 45, far: 2000 }}
          style={{ background: '#000000', width: '100%', height: '100%' }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        >
          <FrameUpdater onFrame={handleFrame} />
          <React.Suspense fallback={null}>
            <Scene
              simTimeRef={simTimeRef}
              currentEarthPosRef={currentEarthPosRef}
              showVectors={showKeyVisual}
              viewMode={viewMode}
              controlsRef={controlsRef}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* ─── Duolingo Minimalistic Orbit Lab Sidebar ─── */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-30 w-full sm:w-[390px] lg:w-[420px] bg-slate-950/92 dark:bg-[#0f172a]/95 backdrop-blur-2xl border-l-2 border-slate-800 flex flex-col justify-between p-5 sm:p-6 transition-transform duration-300 shadow-2xl overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#1cb0f6] border-2 border-b-4 border-[#1899d6] text-white shadow-sm">
                <Orbit size={16} />
              </span>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white">
                  Orbit Lab &amp; Controls
                </h2>
                <span className="text-[10px] font-bold text-slate-400">Interactive Simulation</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-b-4 border-slate-700 bg-slate-850 hover:bg-slate-800 text-xs font-black text-slate-200 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer"
              title="Hide Sidebar"
            >
              <span>Hide</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Guided Focus Modes */}
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">
              Exploration Modes
            </span>
            <div className="flex flex-col gap-2">
              {/* Mode 1 */}
              <button
                onClick={() => switchView('solar')}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                  viewMode === 'solar'
                    ? 'bg-amber-500/20 border-amber-400 border-b-4 border-b-amber-500 text-amber-300 active:border-b-2'
                    : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-300 hover:bg-slate-800 active:border-b-2'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <SunIcon size={16} />
                  </div>
                  <span>1. Earth around Sun</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300">
                  Solar Orbit
                </span>
              </button>

              {/* Mode 2 */}
              <button
                onClick={() => switchView('earth-moon')}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                  viewMode === 'earth-moon'
                    ? 'bg-purple-500/20 border-purple-400 border-b-4 border-b-purple-500 text-purple-300 active:border-b-2'
                    : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-300 hover:bg-slate-800 active:border-b-2'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <MoonIcon size={16} />
                  </div>
                  <span>2. Earth &amp; Moon</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300">
                  5.14° Tilt
                </span>
              </button>

              {/* Mode 3 */}
              <button
                onClick={() => switchView('satellite')}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                  viewMode === 'satellite'
                    ? 'bg-cyan-500/20 border-cyan-400 border-b-4 border-b-cyan-500 text-cyan-300 active:border-b-2'
                    : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-300 hover:bg-slate-800 active:border-b-2'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Orbit size={16} />
                  </div>
                  <span>3. Earth &amp; Satellite</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300">
                  Low Orbit
                </span>
              </button>
            </div>
          </div>

          {/* Key Visual Force Vectors Toggle */}
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">
              Force Vector Analysis
            </span>
            <button
              onClick={toggleKeyVisual}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                showKeyVisual
                  ? 'bg-[#ff9600] border-[#ff9600] border-b-4 border-b-[#d97706] text-white active:border-b-2'
                  : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-300 hover:bg-slate-800 active:border-b-2'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap size={14} className={showKeyVisual ? 'text-white' : 'text-amber-400'} />
                <span>Force Vectors (Key Visual)</span>
              </div>
              <span className="text-[10px] uppercase font-black">{showKeyVisual ? 'PAUSED' : 'OFF'}</span>
            </button>
          </div>

          {/* Core Physics Explanation Card */}
          <div className="rounded-2xl border-2 border-b-4 border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-400">
                <Sparkles size={13} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                Balance of Forces
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {viewMode === 'solar' &&
                '“The Sun constantly pulls Earth inward. Earth is also moving forward at 29.8 km/s, so instead of falling into the Sun, it perpetually curves into a stable orbit.”'}
              {viewMode === 'earth-moon' &&
                '“The Moon orbits Earth with an inclination of 5.14° relative to the ecliptic plane, preventing monthly eclipses. Earth’s gravity curves its 1.0 km/s forward path.”'}
              {viewMode === 'satellite' &&
                '“A space satellite travels at 7.8 km/s. Earth’s gravity pulls it downward, but it travels horizontally so fast that Earth curves away under it at the exact same rate.”'}
            </p>
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                <span>Inward Gravity</span>
              </div>
              <div className="flex items-center gap-2 text-[#58cc02]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#58cc02] shadow-[0_0_8px_rgba(88,204,2,0.5)]" />
                <span>Forward Velocity</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry for Current Focus */}
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">
              {viewMode === 'solar' ? 'Earth Telemetry' : viewMode === 'earth-moon' ? 'Moon Telemetry' : 'Satellite Telemetry'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl border-2 border-b-4 border-emerald-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Orbital Speed
                </span>
                <span className="text-base sm:text-lg font-black text-[#58cc02] block tracking-tight">
                  {viewMode === 'solar' ? '29.8' : viewMode === 'earth-moon' ? '1.0' : '7.8'}
                </span>
                <span className="text-[9px] font-bold text-slate-400">km/s</span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-b-4 border-sky-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Orbit Radius
                </span>
                <span className="text-base sm:text-lg font-black text-[#1cb0f6] block tracking-tight">
                  {viewMode === 'solar' ? '1.0 AU' : viewMode === 'earth-moon' ? '384k' : '400'}
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  {viewMode === 'solar' ? '150M km' : 'km dist'}
                </span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-b-4 border-amber-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Period
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 block tracking-tight">
                  {viewMode === 'solar' ? '365 d' : viewMode === 'earth-moon' ? '27.3 d' : '92 m'}
                </span>
                <span className="text-[9px] font-bold text-slate-400">orbit time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Controls */}
        <div className="pt-4 mt-4 border-t-2 border-slate-800 space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5 select-none ${
                isPlaying
                  ? 'bg-slate-800 border-slate-700 border-b-4 border-b-slate-900 text-white hover:bg-slate-750 active:border-b-2'
                  : 'bg-[#58cc02] border-[#58cc02] border-b-4 border-b-[#46a302] text-white hover:bg-[#61e002] active:border-b-2'
              }`}
              title={isPlaying ? 'Pause' : 'Resume'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Speed Multiplier */}
            <button
              onClick={() => {
                const speeds = [1, 2, 5];
                const next = speeds[(speeds.indexOf(speedMultiplier) + 1) % speeds.length];
                setSpeedMultiplier(next);
              }}
              className="flex items-center justify-center gap-1 py-2.5 rounded-2xl border-2 border-slate-700 border-b-4 border-b-slate-900 bg-slate-800 hover:bg-slate-750 text-slate-200 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none"
              title="Change Speed"
            >
              <span>{speedMultiplier}x</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                simTimeRef.current = 0;
                setIsPlaying(true);
                setShowKeyVisual(false);
                setSpeedMultiplier(1);
              }}
              className="flex items-center justify-center gap-1 py-2.5 rounded-2xl border-2 border-slate-700 border-b-4 border-b-slate-900 bg-slate-800 hover:bg-slate-750 text-slate-200 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none"
              title="Reset defaults"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/how-stuff-works/astronomy/orbits/')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1cb0f6] border-2 border-[#1cb0f6] border-b-4 border-b-[#1899d6] hover:bg-[#20b8ff] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none"
          >
            <span>Explore All Planetary Orbits</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
};

// ─── Frame Updater ─────────────────────────────────────────────────────────────
function FrameUpdater({ onFrame }: { onFrame: (state: any, delta: number) => void }) {
  useFrame((state, delta) => {
    onFrame(state, delta);
  });
  return null;
}

// ─── Preload 3D Models ─────────────────────────────────────────────────────────
useGLTF.preload('/models/the_sun.glb');
useGLTF.preload('/models/earth.glb');
useGLTF.preload('/models/moon.glb');
useGLTF.preload('/models/space_satellite.glb');

