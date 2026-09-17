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
  Sliders,
  Sun as SunIcon,
  Globe,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Atom,
} from 'lucide-react';

// ─── 3D Central Sun (Using downloaded /models/the_sun.glb) ───────────────────
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

function Sun({ sunMass }: { sunMass: number }) {
  const { scene } = useGLTF('/models/the_sun.glb');
  const sunGroupRef = useRef<THREE.Group>(null);

  const visualScale = 3.6 * Math.pow(sunMass, 0.28);

  const preparedSun = useMemo(() => {
    return prepareSunModel(scene, visualScale);
  }, [scene, visualScale]);

  useFrame((_, delta) => {
    if (sunGroupRef.current) {
      sunGroupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={sunGroupRef}>
      <primitive object={preparedSun} />
      <pointLight
        position={[0, 0, 0]}
        color="#fff5e0"
        intensity={22 * sunMass}
        distance={95}
        decay={0.75}
      />
    </group>
  );
}

// ─── 3D Orbit Ring ─────────────────────────────────────────────────────────────
function OrbitPath({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 144;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color="#38bdf8"
      lineWidth={1.2}
      transparent
      opacity={0.35}
    />
  );
}

// ─── 3D Vector Arrow Component with Correct Quaternion Alignment ──────────────
function Arrow3D({
  start,
  direction,
  length,
  color,
  headLength = 0.55,
  headRadius = 0.22,
  shaftRadius = 0.06,
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

    // Shaft center
    const sPos = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(shaftLen / 2));
    // Head center
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
        mat.metalness = 0.05;
        mat.needsUpdate = true;
      });
    }
  });

  const wrapper = new THREE.Group();
  wrapper.add(clone);
  return wrapper;
}

// ─── 3D Earth Object with Correct Physical Vectors ─────────────────────────────
function EarthObject({
  radius,
  sunMass,
  simAngleRef,
  showGravity,
  showVelocity,
}: {
  radius: number;
  sunMass: number;
  simAngleRef: React.MutableRefObject<number>;
  showGravity: boolean;
  showVelocity: boolean;
}) {
  const { scene } = useGLTF('/models/earth.glb');
  const earthOrbitRef = useRef<THREE.Group>(null);
  const earthSpinRef = useRef<THREE.Group>(null);

  const [currentAngle, setCurrentAngle] = useState(0);

  const preparedEarth = useMemo(() => {
    return prepareModel(scene, 1.15);
  }, [scene]);

  // Scaled physical arrow lengths based on gravity and orbital velocity
  const normalizedDist = radius / 8.5;
  const gravityPullMag = Math.min(Math.max(2.4 * (sunMass / Math.pow(normalizedDist, 2)), 0.8), 6.5);
  const orbitalVelocityMag = Math.min(Math.max(2.2 * Math.sqrt(sunMass / normalizedDist), 1.0), 5.5);

  useFrame((_, delta) => {
    const angle = simAngleRef.current;
    setCurrentAngle(angle);

    if (earthOrbitRef.current) {
      earthOrbitRef.current.position.x = Math.cos(angle) * radius;
      earthOrbitRef.current.position.z = Math.sin(angle) * radius;
    }

    if (earthSpinRef.current) {
      earthSpinRef.current.rotation.y += delta * 0.9;
    }
  });

  const earthPos: [number, number, number] = [
    Math.cos(currentAngle) * radius,
    0,
    Math.sin(currentAngle) * radius,
  ];

  // Inward gravity direction: pointing straight at origin (the Sun)
  const inwardGravityDir: [number, number, number] = [
    -Math.cos(currentAngle),
    0,
    -Math.sin(currentAngle),
  ];

  // Forward orbital velocity: tangent to circular trajectory in direction of motion
  const forwardVelocityDir: [number, number, number] = [
    -Math.sin(currentAngle),
    0,
    Math.cos(currentAngle),
  ];

  return (
    <>
      <group ref={earthOrbitRef}>
        <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
          <group ref={earthSpinRef}>
            <primitive object={preparedEarth} />
          </group>
        </group>
      </group>

      {/* Gravity Pull Vector (Orange Arrow towards Sun) */}
      {showGravity && (
        <Arrow3D
          start={earthPos}
          direction={inwardGravityDir}
          length={gravityPullMag}
          color="#f97316"
          headLength={0.52}
          headRadius={0.2}
          shaftRadius={0.05}
        />
      )}

      {/* Orbital Velocity Vector (Emerald Arrow forward tangent) */}
      {showVelocity && (
        <Arrow3D
          start={earthPos}
          direction={forwardVelocityDir}
          length={orbitalVelocityMag}
          color="#10b981"
          headLength={0.5}
          headRadius={0.19}
          shaftRadius={0.05}
        />
      )}
    </>
  );
}

// ─── Main Gravity Scene ───────────────────────────────────────────────────────
function GravityScene({
  sunMass,
  earthDistance,
  simAngleRef,
  showGravity,
  showVelocity,
}: {
  sunMass: number;
  earthDistance: number;
  simAngleRef: React.MutableRefObject<number>;
  showGravity: boolean;
  showVelocity: boolean;
}) {
  return (
    <>
      <Stars radius={120} depth={70} count={6000} factor={4} fade speed={0.2} />
      <ambientLight color="#1e293b" intensity={0.7} />

      {/* Authentic Glowing Central Sun */}
      <Sun sunMass={sunMass} />

      {/* Orbit Ring */}
      <OrbitPath radius={earthDistance} />

      {/* Earth & Gravitational Force Arrows */}
      <EarthObject
        radius={earthDistance}
        sunMass={sunMass}
        simAngleRef={simAngleRef}
        showGravity={showGravity}
        showVelocity={showVelocity}
      />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={250}
        target={[-1.5, 0, 0]}
      />
    </>
  );
}

// ─── Canvas Frame Updater Hook ─────────────────────────────────────────────────
function FrameUpdater({ onFrame }: { onFrame: (state: any, delta: number) => void }) {
  useFrame((state, delta) => {
    onFrame(state, delta);
  });
  return null;
}

// ─── Top Level Component ──────────────────────────────────────────────────────
export const HowGravityWorks: React.FC = () => {
  const navigate = useNavigate();

  // Interactive experiment controls
  const [sunMass, setSunMass] = useState(1.0); // 0.5x to 3.0x
  const [earthDistance, setEarthDistance] = useState(8.5); // 5.0 to 14.0

  // Playback & Vector toggles
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGravity, setShowGravity] = useState(true);
  const [showVelocity, setShowVelocity] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Simulation accumulator
  const simAngleRef = useRef(0);

  // Orbital physics calculations
  // Angular velocity omega = sqrt(G * M / r^3)
  const normalizedR = earthDistance / 8.5;
  const angularSpeed = 0.5 * Math.sqrt(sunMass / Math.pow(normalizedR, 3));
  const gravityPullG = (sunMass / (normalizedR * normalizedR)).toFixed(2);
  const orbitalSpeedKmS = (29.8 * Math.sqrt(sunMass / normalizedR)).toFixed(1);
  const periodDays = (365.25 * Math.sqrt(Math.pow(normalizedR, 3) / sunMass)).toFixed(0);

  const handleFrame = (_: any, delta: number) => {
    if (isPlaying) {
      simAngleRef.current += delta * angularSpeed;
    }
  };

  const handleReset = () => {
    setSunMass(1.0);
    setEarthDistance(8.5);
    simAngleRef.current = 0;
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden font-sans text-white select-none">
      {/* ─── Top Bar: Clean Back Arrow & Minimal Title ─── */}
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
            How Gravity Works
          </h1>
          <p className="text-[11px] text-cyan-400 font-semibold mt-0.5 hidden sm:block">
            Orbital Velocity &amp; Gravitational Physics Experiment
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
          <span>Physics Lab Controls</span>
        </button>
      )}

      {/* ─── 3D Simulation Canvas ─── */}
      <div className="flex-1 w-full h-full">
        <Canvas
          camera={{ position: [-1.5, 16, 24], fov: 44, far: 2000 }}
          style={{ background: '#000000', width: '100%', height: '100%' }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        >
          <FrameUpdater onFrame={handleFrame} />
          <React.Suspense fallback={null}>
            <GravityScene
              sunMass={sunMass}
              earthDistance={earthDistance}
              simAngleRef={simAngleRef}
              showGravity={showGravity}
              showVelocity={showVelocity}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* ─── Duolingo Minimalistic Physics Lab Sidebar ─── */}
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
                <Atom size={16} />
              </span>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white">
                  Physics Lab &amp; Controls
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

          {/* Core Physics Principle (Explanation Card) */}
          <div className="rounded-2xl border-2 border-b-4 border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400">
                <Sparkles size={13} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Core Physics Principle
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              &ldquo;The Sun&apos;s gravity constantly pulls Earth inward. Earth&apos;s forward velocity keeps it moving sideways. The delicate balance of both creates a stable orbit.&rdquo;
            </p>
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                <span>Gravity Pull</span>
              </div>
              <div className="flex items-center gap-2 text-[#58cc02]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#58cc02] shadow-[0_0_8px_rgba(88,204,2,0.5)]" />
                <span>Forward Inertia</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Grid */}
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">
              Live Telemetry
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl border-2 border-b-4 border-amber-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Gravity Pull
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 block tracking-tight">
                  {gravityPullG}x
                </span>
                <span className="text-[9px] font-bold text-slate-400">Sun standard</span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-b-4 border-emerald-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Velocity
                </span>
                <span className="text-base sm:text-lg font-black text-[#58cc02] block tracking-tight">
                  {orbitalSpeedKmS}
                </span>
                <span className="text-[9px] font-bold text-slate-400">km/s</span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-b-4 border-sky-500/25 bg-slate-900/90 text-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Orbit Year
                </span>
                <span className="text-base sm:text-lg font-black text-[#1cb0f6] block tracking-tight">
                  {periodDays}
                </span>
                <span className="text-[9px] font-bold text-slate-400">days</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameters & Sliders */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block">
              Experiment Variables
            </span>

            {/* Sun Mass Slider */}
            <div className="p-3.5 rounded-2xl border-2 border-b-4 border-slate-800 bg-slate-900/90">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <SunIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white">Sun Mass</span>
                  {sunMass === 1.0 && (
                    <span className="text-[9px] px-2 py-0.5 bg-white/10 rounded-lg text-slate-300 font-black uppercase tracking-wider">
                      Standard
                    </span>
                  )}
                  {sunMass > 1.5 && (
                    <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 font-black uppercase tracking-wider">
                      Heavy Sun
                    </span>
                  )}
                  {sunMass < 1.0 && (
                    <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 rounded-lg text-amber-400/90 font-black uppercase tracking-wider">
                      Light Sun
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-black text-amber-400">
                  {sunMass.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={sunMass}
                onChange={(e) => setSunMass(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>0.5x</span>
                <span>Range: 0.5x – 3.0x</span>
                <span>3.0x</span>
              </div>
            </div>

            {/* Earth Distance Slider */}
            <div className="p-3.5 rounded-2xl border-2 border-b-4 border-slate-800 bg-slate-900/90">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white">Earth Distance</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs font-black text-[#1cb0f6] inline-block">
                    {(earthDistance / 8.5).toFixed(2)} AU
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                    {(earthDistance * 17.6).toFixed(0)}M km
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="5.0"
                max="14.0"
                step="0.25"
                value={earthDistance}
                onChange={(e) => setEarthDistance(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>0.6 AU</span>
                <span>Range: 0.6 – 1.6 AU</span>
                <span>1.6 AU</span>
              </div>
            </div>
          </div>

          {/* Vector Visibility Toggles */}
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-2">
              Force Vectors
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowGravity(!showGravity)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                  showGravity
                    ? 'bg-[#ff9600] border-[#ff9600] border-b-4 border-b-[#d97706] text-white active:border-b-2'
                    : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-400 hover:bg-slate-800 active:border-b-2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${showGravity ? 'bg-white' : 'bg-slate-600'}`} />
                  <span>Gravity</span>
                </div>
                <span className="text-[10px] uppercase font-black">{showGravity ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setShowVelocity(!showVelocity)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer select-none active:translate-y-0.5 ${
                  showVelocity
                    ? 'bg-[#58cc02] border-[#58cc02] border-b-4 border-b-[#46a302] text-white active:border-b-2'
                    : 'bg-slate-850/80 border-slate-700 border-b-4 border-b-slate-800 text-slate-400 hover:bg-slate-800 active:border-b-2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${showVelocity ? 'bg-white' : 'bg-slate-600'}`} />
                  <span>Velocity</span>
                </div>
                <span className="text-[10px] uppercase font-black">{showVelocity ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Navigation */}
        <div className="pt-4 mt-4 border-t-2 border-slate-800 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5 select-none ${
                isPlaying
                  ? 'bg-slate-800 border-slate-700 border-b-4 border-b-slate-900 text-white hover:bg-slate-750 active:border-b-2'
                  : 'bg-[#58cc02] border-[#58cc02] border-b-4 border-b-[#46a302] text-white hover:bg-[#61e002] active:border-b-2'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 border-slate-700 border-b-4 border-b-slate-900 bg-slate-800 hover:bg-slate-750 text-slate-200 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/how-stuff-works/astronomy/orbits/')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1cb0f6] border-2 border-[#1cb0f6] border-b-4 border-b-[#1899d6] hover:bg-[#20b8ff] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none"
          >
            <span>View Full Solar System</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
};

// ─── Preload 3D Models ─────────────────────────────────────────────────────────
useGLTF.preload('/models/the_sun.glb');
useGLTF.preload('/models/earth.glb');
