import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stars, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sun as SunIcon,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Sliders,
  Timer,
  Zap,
  Radio,
  Compass,
  Gauge,
} from 'lucide-react';

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

// ─── 3D Sun Model (Using downloaded /models/the_sun.glb) ───────────────────────
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

// ─── Emitter: The Sun (1 AU) ──────────────────────────────────────────────────
function SunEmitter({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/the_sun.glb');
  const sunRef = useRef<THREE.Group>(null);

  const preparedSun = useMemo(() => {
    return prepareSunModel(scene, 3.6);
  }, [scene]);

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={position} ref={sunRef}>
      <primitive object={preparedSun} />
      {/* Local corona lighting only — does NOT illuminate Earth across space */}
      <pointLight position={[0, 0, 0]} color="#fff5e0" intensity={18} distance={8} decay={1.0} />
      {/* Radiant Solar Corona Glow */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── Emitter: Distant Star (100 Light-Years) ──────────────────────────────────
function DistantStarEmitter({ position }: { position: [number, number, number] }) {
  const starRef = useRef<THREE.Group>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.1;
    }
    if (flareRef.current) {
      flareRef.current.rotation.z -= delta * 0.08;
    }
  });

  return (
    <group position={position} ref={starRef}>
      {/* Brilliant Blue-White Stellar Core */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>

      {/* Outer Cyan Halo */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Local star point light only */}
      <pointLight position={[0, 0, 0]} color="#38bdf8" intensity={18} distance={8} decay={1.0} />
    </group>
  );
}

// ─── Receiver: Planet Earth (Starts Dark, Illuminates on Arrival) ──────────────
function EarthReceiver({
  position,
  hasArrived,
  litRatio,
  isStarMode,
}: {
  position: [number, number, number];
  hasArrived: boolean;
  litRatio: number;
  isStarMode: boolean;
}) {
  const { scene } = useGLTF('/models/earth.glb');
  const earthRef = useRef<THREE.Group>(null);

  const preparedEarth = useMemo(() => {
    return prepareModel(scene, 1.4);
  }, [scene]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group position={position}>
      <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
        <group ref={earthRef}>
          <primitive object={preparedEarth} />
        </group>
      </group>
    </group>
  );
}

// ─── Growing Triangular Light Beam ───────────────────────────────────────────
function GrowingTriangularBeam({
  progress,
  startX,
  endX,
  isStarMode,
}: {
  progress: number;
  startX: number;
  endX: number;
  isStarMode: boolean;
}) {
  const travelDistance = endX - startX;
  const currentLength = Math.max(0.1, travelDistance * progress);
  const currentX = startX + currentLength;
  const centerX = startX + currentLength / 2;

  // Expanding triangular radii: starts at Sun size and widens dramatically
  const radiusBase = isStarMode ? 1.5 : 1.85;
  const radiusFront = radiusBase + (isStarMode ? 2.8 : 3.3) * progress;

  const primaryColor = isStarMode ? '#38bdf8' : '#fbbf24';
  const outerColor = isStarMode ? '#0284c7' : '#ea580c';
  const coreColor = isStarMode ? '#e0f2fe' : '#fef08a';

  // 8 longitudinal guide rays along the cone mantle
  const rayLines = useMemo(() => {
    const rays: [[number, number, number], [number, number, number]][] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const p1: [number, number, number] = [startX, radiusBase * cos, radiusBase * sin];
      const p2: [number, number, number] = [currentX, radiusFront * cos, radiusFront * sin];
      rays.push([p1, p2]);
    }
    return rays;
  }, [startX, currentX, radiusBase, radiusFront]);

  return (
    <group>
      {/* Reference orbital transit axis */}
      <Line
        points={[
          [startX, 0, 0],
          [endX, 0, 0],
        ]}
        color="#ffffff"
        lineWidth={0.6}
        transparent
        opacity={0.15}
        dashed
      />

      {/* ── 1. Big Outer Volumetric Triangular Light Cone ── */}
      <mesh position={[centerX, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[radiusFront, radiusBase, currentLength, 48, 1, true]} />
        <meshBasicMaterial
          color={outerColor}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 2. Mid Volumetric Glowing Body ── */}
      <mesh position={[centerX, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry
          args={[radiusFront * 0.72, radiusBase * 0.82, currentLength, 48, 1, true]}
        />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 3. High-Energy Core Cone ── */}
      <mesh position={[centerX, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry
          args={[radiusFront * 0.42, radiusBase * 0.52, currentLength, 48, 1, true]}
        />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 4. Longitudinal Boundary Ray Lines ── */}
      {rayLines.map((line, idx) => (
        <Line
          key={idx}
          points={line}
          color={primaryColor}
          lineWidth={2.0}
          transparent
          opacity={0.5}
        />
      ))}

      {/* ── 5. Expanding Wavefront Cap at Front Edge ── */}
      <group position={[currentX, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Semi-transparent wavefront planar disc */}
        <mesh>
          <circleGeometry args={[radiusFront, 48]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Bright perimeter ring marking the light wavefront */}
        <mesh>
          <ringGeometry args={[Math.max(0, radiusFront - 0.22), radiusFront + 0.04, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {/* Secondary harmonic wavefront ring */}
        <mesh>
          <ringGeometry
            args={[Math.max(0, radiusFront * 0.55 - 0.12), radiusFront * 0.55 + 0.04, 36]}
          />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ── 6. Central High-Energy Photon Pulse Core ── */}
      <mesh position={[currentX, 0, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[currentX, 0, 0]}>
        <sphereGeometry args={[0.65, 20, 20]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function LightScene({
  mode,
  progress,
  hasArrived,
}: {
  mode: 'sun' | 'star';
  progress: number;
  hasArrived: boolean;
}) {
  const startX = -10.0;
  const beamStartX = -8.2; // Sun surface
  const endX = 10.0;
  const beamEndX = 9.25; // Earth sunlit side

  // Earth starts dark: illumination only turns on as beam reaches Earth (progress > 0.85)
  const litRatio = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  return (
    <>
      <Stars radius={140} depth={90} count={8000} factor={4} fade speed={0.2} />
      {/* Deep space ambient — kept very dark so Earth starts dark */}
      <ambientLight color="#050814" intensity={0.04} />

      {/* Left side: Light Source */}
      {mode === 'sun' ? (
        <SunEmitter position={[startX, 0, 0]} />
      ) : (
        <DistantStarEmitter position={[startX, 0, 0]} />
      )}

      {/* Right side: Earth Receiver (starts dark, illuminated as beam arrives) */}
      <EarthReceiver
        position={[endX, 0, 0]}
        hasArrived={hasArrived}
        litRatio={litRatio}
        isStarMode={mode === 'star'}
      />

      {/* Directional beam light pointed at Earth — only illuminates Earth as beam reaches it */}
      <directionalLight
        position={[-10, 0, 0]}
        color={mode === 'star' ? '#bae6fd' : '#fffbeb'}
        intensity={litRatio * 5.2}
      />

      {/* Big Expanding Triangular Light Beam */}
      <GrowingTriangularBeam
        progress={progress}
        startX={beamStartX}
        endX={beamEndX}
        isStarMode={mode === 'star'}
      />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={300}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ─── Top Level View Component ──────────────────────────────────────────────────
export const HowLightTravels: React.FC = () => {
  const navigate = useNavigate();

  // Mode: 'sun' (1 AU: 8 min 20 sec) vs 'star' (100 Light-Years: 100 years)
  const [mode, setMode] = useState<'sun' | 'star'>('sun');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Animation duration in real-time seconds for one crossing
  const crossingDuration = 7.0;

  // Frame runner for smooth light travel
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + delta / crossingDuration;
          if (next >= 1) {
            return 1;
          }
          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, crossingDuration]);

  const hasArrived = progress >= 0.999;

  // ─── Live Calculations for m/s, Minutes, & Distance Animations ─────────────
  // Speed of Light: exactly 299,792,458 m/s
  const speedOfLightMs = 299792458;
  const speedFormatted = `${speedOfLightMs.toLocaleString()} m/s`;

  // 1. Cosmic Minutes & Seconds
  // In Sun mode: 0 to 500 seconds (8 min 20 sec)
  const currentSunSeconds = Math.min(500, Math.floor(progress * 500));
  const sunMin = Math.floor(currentSunSeconds / 60);
  const sunSec = currentSunSeconds % 60;
  const sunTimerFormatted = `${sunMin.toString().padStart(2, '0')} min ${sunSec.toString().padStart(2, '0')} sec`;

  // In Star mode: 0 to 100 years
  const currentStarYears = (progress * 100).toFixed(1);
  const starMinutes = Math.floor(progress * 100 * 365.25 * 24 * 60);
  const starTimerFormatted = `${currentStarYears} years`;

  // 2. Distance Traveled Animations
  // In Sun mode: 0 km to 149,597,870 km (1 AU)
  const currentSunKm = Math.floor(progress * 149597870);
  const currentSunKmFormatted = `${currentSunKm.toLocaleString()} km`;
  const currentSunAu = (progress * 1.0).toFixed(3);

  // In Star mode: 0 to 100 light years (approx 946 trillion km)
  const currentStarKm = Math.floor(progress * 946073047258080);
  const currentStarKmFormatted = `${currentStarKm.toLocaleString()} km`;
  const currentStarLy = (progress * 100).toFixed(1);

  // Actions
  const handleSwitchToStar = () => {
    setMode('star');
    setProgress(0);
    setIsPlaying(true);
  };

  const handleSwitchToSun = () => {
    setMode('sun');
    setProgress(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden font-sans text-white select-none">
      {/* ─── Top Bar: Clean Back Arrow & Title ─── */}
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
            How Light Travels
          </h1>
          <p className="text-[11px] text-cyan-400 font-semibold mt-0.5 hidden sm:block">
            Cosmic Distances &amp; The Speed of Light (c = 299,792,458 m/s)
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
          <span>Speed of Light Lab</span>
        </button>
      )}

      {/* ─── Prominent In-Canvas Live Cosmic Telemetry HUD (m/s, minutes, distances) ─── */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[94vw] w-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-zinc-950/85 border border-white/15 backdrop-blur-xl shadow-[0_0_35px_rgba(0,0,0,0.85)]">
          {/* 1. SPEED IN M/S */}
          <div className="flex items-center gap-2.5 pr-2 sm:pr-4 sm:border-r border-white/10">
            <div
              className={`p-1.5 rounded-lg ${
                mode === 'star' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <Zap size={16} />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                Speed of Light (m/s)
              </div>
              <div className="font-mono text-xs sm:text-sm font-black text-white tracking-tight flex items-baseline gap-1">
                <span>{speedFormatted}</span>
              </div>
            </div>
          </div>

          {/* 2. LIVE MINUTES / ELAPSED TIME */}
          <div className="flex items-center gap-2.5 pr-2 sm:pr-4 sm:border-r border-white/10">
            <div
              className={`p-1.5 rounded-lg ${
                mode === 'star' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <Timer size={16} />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                {mode === 'sun' ? 'Travel Time (Minutes)' : 'Deep Space Time'}
              </div>
              <div className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-tight">
                {mode === 'sun' ? sunTimerFormatted : starTimerFormatted}
              </div>
            </div>
          </div>

          {/* 3. LIVE DISTANCE ANIMATION */}
          <div className="flex items-center gap-2.5 pr-2 sm:pr-4 sm:border-r border-white/10">
            <div
              className={`p-1.5 rounded-lg ${
                mode === 'star' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <Compass size={16} />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                Distance Traveled
              </div>
              <div className="font-mono text-xs sm:text-sm font-black text-cyan-300 tracking-tight">
                {mode === 'sun' ? currentSunKmFormatted : currentStarKmFormatted}
              </div>
            </div>
          </div>

          {/* 4. BEAM TRANSIT PROGRESS BAR */}
          <div className="flex items-center gap-2.5">
            <div className="w-14 sm:w-20">
              <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1">
                <span>BEAM</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 ${
                    mode === 'star'
                      ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                      : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  }`}
                  style={{ width: `${Math.max(2, progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3D Simulation Canvas ─── */}
      <div className="flex-1 w-full h-full">
        <Canvas
          camera={{ position: [0, 6, 24], fov: 45, far: 2000 }}
          style={{ background: '#000000', width: '100%', height: '100%' }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <React.Suspense fallback={null}>
            <LightScene mode={mode} progress={progress} hasArrived={hasArrived} />
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
                Light Speed Lab
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

          {/* Source Selection Buttons */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-2">
              Cosmic Emitter Source
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSwitchToSun}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  mode === 'sun'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.07]'
                }`}
              >
                <SunIcon size={16} className="text-amber-400" />
                <div className="text-left">
                  <span className="block">The Sun</span>
                  <span className="text-[9px] font-normal text-gray-400">1 AU (150M km)</span>
                </div>
              </button>

              <button
                onClick={handleSwitchToStar}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  mode === 'star'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/[0.07]'
                }`}
              >
                <Sparkles size={16} className="text-cyan-400" />
                <div className="text-left">
                  <span className="block">Distant Star</span>
                  <span className="text-[9px] font-normal text-gray-400">100 Light-Years</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Interaction Action Button */}
          <div>
            {mode === 'sun' ? (
              <button
                onClick={handleSwitchToStar}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-cyan-500/40 hover:border-cyan-400 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/40 group"
              >
                <div className="flex items-center gap-2">
                  <Zap
                    size={15}
                    className="text-cyan-400 group-hover:scale-110 transition-transform"
                  />
                  <span>Make the star 100 light-years away</span>
                </div>
                <ChevronRight size={15} className="text-cyan-400" />
              </button>
            ) : (
              <button
                onClick={handleSwitchToSun}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/40 hover:border-amber-400 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-950/40 group"
              >
                <div className="flex items-center gap-2">
                  <SunIcon
                    size={15}
                    className="text-amber-400 group-hover:scale-110 transition-transform"
                  />
                  <span>Reset to the Sun (1 AU)</span>
                </div>
                <ChevronRight size={15} className="text-amber-400" />
              </button>
            )}
          </div>

          {/* Cosmic Timer & Minutes Card */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Timer size={14} className={mode === 'sun' ? 'text-amber-400' : 'text-cyan-400'} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Light Travel Time
              </span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-mono font-black my-1 ${
                mode === 'sun' ? 'text-amber-400' : 'text-cyan-300'
              }`}
            >
              {mode === 'sun' ? sunTimerFormatted : starTimerFormatted}
            </div>
            <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Radio size={11} className="text-emerald-400 animate-pulse" />
              <span>
                {hasArrived ? 'Beam arrived at Earth!' : 'Beam traveling across space...'}
              </span>
            </div>
          </div>

          {/* Core Physics Principle / Educational Explanation */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Cosmic Insight
              </span>
            </div>

            {mode === 'sun' ? (
              <div className="space-y-2 text-xs">
                <p className="text-amber-300 font-bold leading-relaxed">
                  &ldquo;The sunlight you see now left the Sun about 8 minutes and 20 seconds
                  ago.&rdquo;
                </p>
                <p className="text-gray-300 leading-relaxed font-normal">
                  Because light travels at a finite speed of 299,792,458 m/s (300,000 km/s), it
                  takes over 8 minutes to cross the 150 million kilometer distance to Earth.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-cyan-300 font-bold leading-relaxed">
                  &ldquo;You are seeing this star as it was about 100 years ago.&rdquo;
                </p>
                <p className="text-gray-300 leading-relaxed font-normal">
                  Looking out into space is literally looking back in time! The light entering your
                  eyes tonight set off across space when your great-grandparents were young
                  ({starMinutes.toLocaleString()} minutes ago).
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                <span>Speed: 299,792,458 m/s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
                <span>Cosmic Delay</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry Grid (m/s, minutes, and distances) */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 block mb-2">
              Telemetry
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Speed (m/s)
                </span>
                <span className="text-xs font-black text-emerald-400 block font-mono">
                  299.79M
                </span>
                <span className="text-[9px] text-gray-400">m/s</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Distance
                </span>
                <span className="text-xs font-black text-cyan-300 block font-mono">
                  {mode === 'sun' ? `${currentSunAu} AU` : `${currentStarLy} ly`}
                </span>
                <span className="text-[9px] text-gray-400 truncate block">
                  {mode === 'sun' ? currentSunKmFormatted : '946T km'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[9px] font-semibold uppercase text-gray-400 block mb-0.5">
                  Transit Time
                </span>
                <span className="text-xs font-black text-amber-300 block font-mono">
                  {mode === 'sun' ? `${sunMin}m ${sunSec}s` : `${currentStarYears}y`}
                </span>
                <span className="text-[9px] text-gray-400">
                  {mode === 'sun' ? `${currentSunSeconds}s / 500s` : '100 years'}
                </span>
              </div>
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
              onClick={handleRestart}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Emit Again</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/how-stuff-works/astronomy/')}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-900/30"
          >
            <span>Back to All Astronomy Topics</span>
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


