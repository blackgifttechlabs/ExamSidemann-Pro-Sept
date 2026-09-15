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
} from 'lucide-react';

// ─── 3D Central Sun (Using downloaded /models/the_sun.glb) ───────────────────
function prepareSunModel(rawScene: THREE.Group, targetDiameter: number) {
  const clone = rawScene.clone(true);
  const box = new THREE.Box3().setFromObject(clone);
  const center = new THREE.Vector3();
  box.getCenter(center);
  clone.position.sub(center);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetDiameter / maxDim;
  clone.scale.set(scale, scale, scale);

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
  const box = new THREE.Box3().setFromObject(clone);
  const center = new THREE.Vector3();
  box.getCenter(center);
  clone.position.sub(center);

  const size = new THREE.Vector3();
  box.getSize(size);
  const currentMaxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetDiameter / currentMaxDim;
  clone.scale.set(scale, scale, scale);

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
      <div className="absolute top-0 left-0 z-20 p-4 sm:p-6 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => navigate('/how-stuff-works/astronomy/')}
          className="text-white hover:text-cyan-400 transition-colors p-1 cursor-pointer flex items-center justify-center group focus:outline-none"
          aria-label="Back to Astronomy"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
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
          className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all cursor-pointer"
        >
          <Sliders size={14} className="text-cyan-400" />
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

      {/* ─── Clean & Minimalistic Right Sidebar ─── */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-30 w-full sm:w-[380px] lg:w-[410px] bg-zinc-950/85 backdrop-blur-2xl border-l border-white/10 flex flex-col justify-between p-5 sm:p-6 transition-transform duration-300 shadow-2xl overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-300">
                Physics Lab &amp; Controls
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              title="Hide Sidebar"
            >
              <span>Hide</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Core Physics Principle (Explanation Card) */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Core Physics Principle
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              &ldquo;The Sun&apos;s gravity constantly pulls Earth inward. Earth&apos;s forward velocity keeps it moving sideways. The delicate balance of both creates a stable orbit.&rdquo;
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_#fb923c]" />
                <span>Gravity Pull</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span>Forward Inertia</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Grid */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-2">
              Live Telemetry
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Gravity Pull
                </span>
                <span className="text-sm font-black text-orange-400 block">
                  {gravityPullG}x
                </span>
                <span className="text-[9px] text-gray-400">Sun standard</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Velocity
                </span>
                <span className="text-sm font-black text-emerald-400 block">
                  {orbitalSpeedKmS}
                </span>
                <span className="text-[9px] text-gray-400">km/s</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Orbit Year
                </span>
                <span className="text-sm font-black text-cyan-300 block">
                  {periodDays}
                </span>
                <span className="text-[9px] text-gray-400">days</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameters & Sliders */}
          <div className="space-y-3.5 pt-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block">
              Experiment Variables
            </span>

            {/* Sun Mass Slider */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SunIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-gray-200">Sun Mass</span>
                  {sunMass === 1.0 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-medium">
                      Standard
                    </span>
                  )}
                  {sunMass > 1.5 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 rounded text-amber-300 font-medium">
                      Heavy Sun
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                <span>0.5x</span>
                <span>Range: 0.5x – 3.0x</span>
                <span>3.0x</span>
              </div>
            </div>

            {/* Earth Distance Slider */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-gray-200">Earth Distance</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {(earthDistance / 8.5).toFixed(2)} AU
                  </span>
                  <span className="text-[10px] text-gray-400 block">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                <span>0.6 AU</span>
                <span>Range: 0.6 – 1.6 AU</span>
                <span>1.6 AU</span>
              </div>
            </div>
          </div>

          {/* Vector Visibility Toggles */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-2">
              Force Vectors
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowGravity(!showGravity)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  showGravity
                    ? 'bg-orange-500/15 border-orange-500/50 text-orange-300'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      showGravity ? 'bg-orange-400 shadow-[0_0_6px_#fb923c]' : 'bg-gray-600'
                    }`}
                  />
                  <span>Gravity</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{showGravity ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setShowVelocity(!showVelocity)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  showVelocity
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      showVelocity ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-gray-600'
                    }`}
                  />
                  <span>Velocity</span>
                </div>
                <span className="text-[10px] uppercase font-bold">{showVelocity ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions & Navigation */}
        <div className="pt-4 mt-4 border-t border-white/10 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/how-stuff-works/astronomy/orbits/')}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-900/30"
          >
            <span>View Full Solar System</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>
    </div>
  );
};

// ─── Preload 3D Models ─────────────────────────────────────────────────────────
useGLTF.preload('/models/the_sun.glb');
useGLTF.preload('/models/earth.glb');
