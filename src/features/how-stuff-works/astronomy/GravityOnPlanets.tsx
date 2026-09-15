import React, { useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stars, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  ArrowLeft,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Moon as MoonIcon,
  Eye,
  EyeOff,
  Info,
  X,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

// ─── Types & Definitions ───────────────────────────────────────────────────────
interface MoonDef {
  id: string;
  name: string;
  orbitRadius: number;
  diameter: number;
  orbitSpeed: number;
  initialAngle: number;
  color: string;
}

interface PlanetDef {
  id: string;
  name: string;
  modelUrl: string;
  orbitRadius: number;
  targetDiameter: number;
  tiltDeg: number;
  rotationSpeed: number;
  orbitalSpeedFactor: number;
  initialAngle: number;
  realPeriod: string;
  realSpeed: string;
  realDistance: string;
  color: string;
  funFact: string;
  moons: MoonDef[];
}

const PLANETS: PlanetDef[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    modelUrl: '/models/mercury.glb',
    orbitRadius: 4.8,
    targetDiameter: 0.65,
    tiltDeg: 0.03,
    rotationSpeed: 0.05,
    orbitalSpeedFactor: 4.15, // 88 days
    initialAngle: 0.4,
    realPeriod: '88 days',
    realSpeed: '47.4 km/s',
    realDistance: '57.9M km',
    color: '#94a3b8',
    funFact: 'Closest to the Sun; experiences the strongest gravitational pull and races fastest.',
    moons: [],
  },
  {
    id: 'venus',
    name: 'Venus',
    modelUrl: '/models/venus.glb',
    orbitRadius: 6.3,
    targetDiameter: 0.95,
    tiltDeg: 177.3,
    rotationSpeed: -0.03,
    orbitalSpeedFactor: 1.62, // 225 days
    initialAngle: 1.8,
    realPeriod: '225 days',
    realSpeed: '35.0 km/s',
    realDistance: '108.2M km',
    color: '#eab308',
    funFact: 'Spins backwards compared to most planets, with a runaway greenhouse atmosphere.',
    moons: [],
  },
  {
    id: 'earth',
    name: 'Earth',
    modelUrl: '/models/earth.glb',
    orbitRadius: 7.9,
    targetDiameter: 1.05,
    tiltDeg: 23.5,
    rotationSpeed: 0.5,
    orbitalSpeedFactor: 1.0, // 365.25 days
    initialAngle: 3.2,
    realPeriod: '365.25 days',
    realSpeed: '29.8 km/s',
    realDistance: '149.6M km',
    color: '#38bdf8',
    funFact: 'Our home planet; holds liquid water and life in the habitable Goldilocks zone.',
    moons: [
      {
        id: 'the-moon',
        name: 'The Moon',
        orbitRadius: 1.45,
        diameter: 0.28,
        orbitSpeed: 2.2,
        initialAngle: 0,
        color: '#e2e8f0',
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    modelUrl: '/models/mars.glb',
    orbitRadius: 9.6,
    targetDiameter: 0.75,
    tiltDeg: 25.2,
    rotationSpeed: 0.45,
    orbitalSpeedFactor: 0.53, // 687 days
    initialAngle: 4.5,
    realPeriod: '687 days',
    realSpeed: '24.1 km/s',
    realDistance: '227.9M km',
    color: '#f97316',
    funFact: 'The Red Planet; home to Olympus Mons, the largest volcano in the Solar System.',
    moons: [
      {
        id: 'phobos',
        name: 'Phobos',
        orbitRadius: 0.95,
        diameter: 0.16,
        orbitSpeed: 3.2,
        initialAngle: 0.5,
        color: '#d6d3d1',
      },
      {
        id: 'deimos',
        name: 'Deimos',
        orbitRadius: 1.35,
        diameter: 0.12,
        orbitSpeed: 1.9,
        initialAngle: 2.8,
        color: '#a8a29e',
      },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    modelUrl: '/models/realistic_jupiter.glb',
    orbitRadius: 12.2,
    targetDiameter: 2.2,
    tiltDeg: 3.1,
    rotationSpeed: 0.8,
    orbitalSpeedFactor: 0.28, // 11.86 years
    initialAngle: 0.9,
    realPeriod: '11.86 years',
    realSpeed: '13.1 km/s',
    realDistance: '778.5M km',
    color: '#fbbf24',
    funFact: 'The giant of our system, with more mass than all other planets combined.',
    moons: [
      {
        id: 'io',
        name: 'Io',
        orbitRadius: 2.1,
        diameter: 0.28,
        orbitSpeed: 3.2,
        initialAngle: 0.2,
        color: '#fef08a',
      },
      {
        id: 'europa',
        name: 'Europa',
        orbitRadius: 2.7,
        diameter: 0.25,
        orbitSpeed: 2.3,
        initialAngle: 1.9,
        color: '#e0f2fe',
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        orbitRadius: 3.4,
        diameter: 0.38,
        orbitSpeed: 1.6,
        initialAngle: 3.8,
        color: '#cbd5e1',
      },
      {
        id: 'callisto',
        name: 'Callisto',
        orbitRadius: 4.1,
        diameter: 0.34,
        orbitSpeed: 1.1,
        initialAngle: 5.4,
        color: '#94a3b8',
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    modelUrl: '/models/saturn.glb',
    orbitRadius: 15.4,
    targetDiameter: 2.8,
    tiltDeg: 26.7,
    rotationSpeed: 0.7,
    orbitalSpeedFactor: 0.18, // 29.4 years
    initialAngle: 5.1,
    realPeriod: '29.4 years',
    realSpeed: '9.7 km/s',
    realDistance: '1.43B km',
    color: '#fde047',
    funFact: 'Famous for its dazzling rings made of countless particles of ice and rock.',
    moons: [
      {
        id: 'enceladus',
        name: 'Enceladus',
        orbitRadius: 2.3,
        diameter: 0.18,
        orbitSpeed: 2.8,
        initialAngle: 1.2,
        color: '#ffffff',
      },
      {
        id: 'titan',
        name: 'Titan',
        orbitRadius: 3.6,
        diameter: 0.38,
        orbitSpeed: 1.7,
        initialAngle: 4.1,
        color: '#fed7aa',
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    modelUrl: '/models/uranus.glb',
    orbitRadius: 18.5,
    targetDiameter: 1.3,
    tiltDeg: 97.8,
    rotationSpeed: -0.4,
    orbitalSpeedFactor: 0.12, // 84 years
    initialAngle: 2.4,
    realPeriod: '84 years',
    realSpeed: '6.8 km/s',
    realDistance: '2.87B km',
    color: '#2dd4bf',
    funFact: 'An ice giant that orbits the Sun nearly on its side (98° axial tilt).',
    moons: [
      {
        id: 'titania',
        name: 'Titania',
        orbitRadius: 1.8,
        diameter: 0.24,
        orbitSpeed: 1.9,
        initialAngle: 0.8,
        color: '#e2e8f0',
      },
      {
        id: 'oberon',
        name: 'Oberon',
        orbitRadius: 2.4,
        diameter: 0.22,
        orbitSpeed: 1.4,
        initialAngle: 3.5,
        color: '#cbd5e1',
      },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    modelUrl: '/models/neptune.glb',
    orbitRadius: 21.6,
    targetDiameter: 1.3,
    tiltDeg: 28.3,
    rotationSpeed: 0.45,
    orbitalSpeedFactor: 0.08, // 165 years
    initialAngle: 3.9,
    realPeriod: '165 years',
    realSpeed: '5.4 km/s',
    realDistance: '4.50B km',
    color: '#60a5fa',
    funFact: 'The windiest planet in the Solar System, with supersonic storm systems.',
    moons: [
      {
        id: 'triton',
        name: 'Triton',
        orbitRadius: 1.9,
        diameter: 0.3,
        orbitSpeed: -2.0, // Retrograde orbit
        initialAngle: 1.5,
        color: '#c7d2fe',
      },
    ],
  },
  {
    id: 'pluto',
    name: 'Pluto',
    modelUrl: '/models/pluto.glb',
    orbitRadius: 24.2,
    targetDiameter: 0.5,
    tiltDeg: 122.5,
    rotationSpeed: 0.1,
    orbitalSpeedFactor: 0.05, // 248 years
    initialAngle: 1.2,
    realPeriod: '248 years',
    realSpeed: '4.7 km/s',
    realDistance: '5.91B km',
    color: '#cbd5e1',
    funFact: 'A distant dwarf planet in the Kuiper Belt with a heart-shaped nitrogen glacier.',
    moons: [
      {
        id: 'charon',
        name: 'Charon',
        orbitRadius: 0.85,
        diameter: 0.22,
        orbitSpeed: 1.8,
        initialAngle: 2.1,
        color: '#e2e8f0',
      },
    ],
  },
];

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

// ─── Individual Orbit Ring ─────────────────────────────────────────────────────
function PlanetOrbitRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.9}
      transparent
      opacity={0.35}
    />
  );
}

// ─── Moon Component ────────────────────────────────────────────────────────────
function MoonObject({
  moon,
  simTimeRef,
  moonModelScene,
}: {
  moon: MoonDef;
  simTimeRef: React.MutableRefObject<number>;
  moonModelScene: THREE.Group;
}) {
  const moonOrbitRef = useRef<THREE.Group>(null);
  const moonSpinRef = useRef<THREE.Group>(null);

  const prepared = useMemo(() => {
    return prepareModel(moonModelScene, moon.diameter);
  }, [moonModelScene, moon.diameter]);

  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * moon.orbitRadius, 0, Math.sin(a) * moon.orbitRadius]);
    }
    return pts;
  }, [moon.orbitRadius]);

  useFrame((_, delta) => {
    const t = simTimeRef.current * moon.orbitSpeed + moon.initialAngle;
    if (moonOrbitRef.current) {
      moonOrbitRef.current.position.x = Math.cos(t) * moon.orbitRadius;
      moonOrbitRef.current.position.z = Math.sin(t) * moon.orbitRadius;
    }
    if (moonSpinRef.current) {
      moonSpinRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <>
      {/* Delicate orbital ring around parent planet */}
      <Line
        points={ringPoints}
        color={moon.color || '#cbd5e1'}
        lineWidth={0.5}
        transparent
        opacity={0.22}
      />
      <group ref={moonOrbitRef}>
        <group ref={moonSpinRef}>
          <primitive object={prepared} />
        </group>
      </group>
    </>
  );
}

// ─── Sun Component ─────────────────────────────────────────────────────────────
function Sun() {
  const { scene } = useGLTF('/models/the_sun.glb');
  const sunGroupRef = useRef<THREE.Group>(null);

  const preparedSun = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.6 / maxDim;
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
  }, [scene]);

  useFrame((_, delta) => {
    if (sunGroupRef.current) {
      sunGroupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={sunGroupRef}>
      <primitive object={preparedSun} />
      <pointLight position={[0, 0, 0]} color="#fff5e0" intensity={22} distance={95} decay={0.75} />
    </group>
  );
}

// ─── Single Planet Mesh ────────────────────────────────────────────────────────
function PlanetObject({
  planet,
  simTimeRef,
  showMoons,
  moonModelScene,
  onSelect,
}: {
  planet: PlanetDef;
  simTimeRef: React.MutableRefObject<number>;
  showMoons: boolean;
  moonModelScene: THREE.Group;
  onSelect: (p: PlanetDef) => void;
}) {
  const { scene } = useGLTF(planet.modelUrl);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  const prepared = useMemo(() => {
    return prepareModel(scene, planet.targetDiameter);
  }, [scene, planet.targetDiameter]);

  useFrame((_, delta) => {
    const t = simTimeRef.current * 0.25 * planet.orbitalSpeedFactor + planet.initialAngle;

    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(t) * planet.orbitRadius;
      orbitGroupRef.current.position.z = Math.sin(t) * planet.orbitRadius;
    }

    if (spinGroupRef.current) {
      spinGroupRef.current.rotation.y += delta * planet.rotationSpeed;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      {/* Axial Tilt */}
      <group rotation={[0, 0, planet.tiltDeg * (Math.PI / 180)]}>
        {/* Self Spin & Click */}
        <group
          ref={spinGroupRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(planet);
          }}
        >
          <primitive object={prepared} />
        </group>
      </group>

      {/* Orbiting Moons */}
      {showMoons && planet.moons.length > 0 && (
        <group>
          {planet.moons.map((moon) => (
            <MoonObject
              key={moon.id}
              moon={moon}
              simTimeRef={simTimeRef}
              moonModelScene={moonModelScene}
            />
          ))}
        </group>
      )}
    </group>
  );
}

// ─── Solar System Scene ────────────────────────────────────────────────────────
function SolarSystemScene({
  simTimeRef,
  visiblePlanets,
  showMoons,
  onSelectPlanet,
}: {
  simTimeRef: React.MutableRefObject<number>;
  visiblePlanets: Record<string, boolean>;
  showMoons: boolean;
  onSelectPlanet: (p: PlanetDef) => void;
}) {
  // Load the downloaded moon model once for all moons
  const { scene: moonScene } = useGLTF('/models/moon.glb');

  return (
    <>
      <Stars radius={120} depth={70} count={6000} factor={4} fade speed={0.25} />
      <ambientLight color="#1a2538" intensity={0.85} />
      <Sun />

      {PLANETS.map((planet) => {
        const isVisible = visiblePlanets[planet.id] !== false;
        if (!isVisible) return null; // Unchecked: completely hidden including its ring and moons

        return (
          <React.Fragment key={planet.id}>
            <PlanetOrbitRing radius={planet.orbitRadius} color="#ffffff" />
            <PlanetObject
              planet={planet}
              simTimeRef={simTimeRef}
              showMoons={showMoons}
              moonModelScene={moonScene}
              onSelect={onSelectPlanet}
            />
          </React.Fragment>
        );
      })}

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={300}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const GravityOnPlanets: React.FC = () => {
  const navigate = useNavigate();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetDef>(
    PLANETS.find((p) => p.id === 'earth') || PLANETS[0]
  );
  const [showBottomExplanation, setShowBottomExplanation] = useState(false);

  // Visibility & Moon toggles
  const [visiblePlanets, setVisiblePlanets] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PLANETS.forEach((p) => (initial[p.id] = true));
    return initial;
  });
  const [showMoons, setShowMoons] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Time accumulator for smooth continuous motion
  const simTimeRef = useRef(0);

  const handleCanvasFrame = (_: any, delta: number) => {
    if (isPlaying) {
      simTimeRef.current += delta * speedMultiplier;
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 2, 5, 10];
    const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
    setSpeedMultiplier(speeds[nextIdx]);
  };

  const togglePlanet = (planetId: string) => {
    setVisiblePlanets((prev) => ({
      ...prev,
      [planetId]: !prev[planetId],
    }));
  };

  const handleToggleInfo = (planet: PlanetDef) => {
    if (selectedPlanet.id === planet.id && showBottomExplanation) {
      setShowBottomExplanation(false);
    } else {
      setSelectedPlanet(planet);
      setShowBottomExplanation(true);
    }
  };

  // Toggle all planets visibility logic
  const allVisible = PLANETS.every((p) => visiblePlanets[p.id] !== false);
  const visibleCount = PLANETS.filter((p) => visiblePlanets[p.id] !== false).length;

  const handleToggleAll = () => {
    const nextState = !allVisible;
    const updated: Record<string, boolean> = {};
    PLANETS.forEach((p) => (updated[p.id] = nextState));
    setVisiblePlanets(updated);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col select-none overflow-hidden font-sans">
      {/* ─── Top Bar: Clean Back Arrow (no bg) & Title only ─── */}
      <div className="absolute top-0 left-0 z-30 p-4 sm:p-6 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => navigate('/how-stuff-works/astronomy/')}
          className="text-white hover:text-cyan-400 transition-colors p-1 cursor-pointer flex items-center justify-center group focus:outline-none"
          aria-label="Back to Astronomy"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
          How Orbits Work
        </h1>
      </div>

      <div className="absolute top-0 right-0 z-30 p-4 sm:p-6 flex items-center gap-2 sm:gap-3">
        {/* Toggle Right Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer ${
            isSidebarOpen
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
          }`}
          title="Toggle Planets Sidebar"
        >
          {isSidebarOpen ? (
            <>
              <span className="text-xs font-bold">Hide</span>
              <ArrowRight size={14} />
            </>
          ) : (
            <>
              <SlidersHorizontal size={15} />
              <span className="text-xs font-bold sm:inline">Planets &amp; Moons</span>
            </>
          )}
        </button>
      </div>

      {/* ─── 3D Simulation Canvas ─── */}
      <div className="flex-1 w-full h-full">
        <Canvas
          camera={{ position: [0, 18, 30], fov: 46, far: 2000 }}
          style={{ background: '#000000', width: '100%', height: '100%' }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        >
          <FrameUpdater onFrame={handleCanvasFrame} />
          <React.Suspense fallback={null}>
            <SolarSystemScene
              simTimeRef={simTimeRef}
              visiblePlanets={visiblePlanets}
              showMoons={showMoons}
              onSelectPlanet={(p) => {
                setSelectedPlanet(p);
                setShowBottomExplanation(true);
              }}
            />
          </React.Suspense>
        </Canvas>
      </div>

      {/* ─── Right Sidebar: Clean & Minimalistic Planet Cards ─── */}
      <div
        className={`absolute top-0 right-0 bottom-0 z-20 w-80 sm:w-88 bg-black/90 backdrop-blur-2xl border-l border-white/15 flex flex-col transition-transform duration-300 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        style={{ paddingTop: '5.5rem' }}
      >
        {/* Sidebar Header Controls */}
        <div className="px-4 pb-3 border-b border-white/15 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-300">
              Solar System Objects
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                {visibleCount}/{PLANETS.length} Visible
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                title="Hide Sidebar"
              >
                <span>Hide</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Master Show All / Hide All & Moons Toggle */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleToggleAll}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-gray-200 transition-all cursor-pointer"
            >
              {allVisible ? (
                <Eye size={14} className="text-cyan-400" />
              ) : (
                <EyeOff size={14} className="text-gray-400" />
              )}
              <span>{allVisible ? 'Hide All' : 'Show All'}</span>
            </button>

            {/* See Moons Toggle Switch */}
            <button
              onClick={() => setShowMoons(!showMoons)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showMoons
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'bg-white/10 border-white/15 text-gray-400 hover:text-white'
              }`}
              title="Toggle all planetary moons on/off"
            >
              <MoonIcon size={13} className={showMoons ? 'text-purple-300' : 'text-gray-500'} />
              <span>Moons {showMoons ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Planet List with Clean, High-Contrast Minimal Cards */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-white/20">
          {PLANETS.map((planet) => {
            const isVisible = visiblePlanets[planet.id] !== false;
            const isSelected = selectedPlanet.id === planet.id;

            return (
              <div
                key={planet.id}
                onClick={() => {
                  setSelectedPlanet(planet);
                  setShowBottomExplanation(true);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-[#141f2d] border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-[#12141a] hover:bg-[#181c26] border-white/15 hover:border-white/30'
                } ${!isVisible ? 'opacity-40 hover:opacity-60' : ''}`}
              >
                {/* Top Row: Color Dot, Planet Name, Orbit Tag & Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: planet.color,
                        boxShadow: isVisible ? `0 0 10px ${planet.color}` : 'none',
                      }}
                    />
                    <span className="text-sm font-black text-white tracking-wide truncate">
                      {planet.name}
                    </span>
                    <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40 whitespace-nowrap">
                      {planet.realPeriod}
                    </span>
                  </div>

                  {/* Clean Action Icons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* (i) Info icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleInfo(planet);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        showBottomExplanation && selectedPlanet.id === planet.id
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 hover:bg-white/15 border-white/10 text-gray-400 hover:text-white'
                      }`}
                      title="Toggle bottom stats"
                      aria-label={`Show ${planet.name} stats at bottom`}
                    >
                      <Info size={14} />
                    </button>

                    {/* Eye icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlanet(planet.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isVisible
                          ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/60'
                          : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
                      }`}
                      title={isVisible ? 'Hide from 3D scene' : 'Show in 3D scene'}
                      aria-label={`Toggle ${planet.name} visibility`}
                    >
                      {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Key Metrics & Moons tag */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase text-gray-400">Speed:</span>
                    <span className="text-emerald-400 font-bold">{planet.realSpeed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase text-gray-400">Dist:</span>
                    <span className="text-cyan-300 font-bold">{planet.realDistance}</span>
                  </div>
                  {planet.moons.length > 0 && (
                    <div className="flex items-center gap-1 text-purple-300 font-bold text-[10px] bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/30">
                      <MoonIcon size={10} />
                      <span>{planet.moons.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Bottom Floating UI: Clean Playback & Stats Dock ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-3 sm:px-6 pb-4 sm:pb-6 pointer-events-none flex flex-col items-center gap-3">
        {showBottomExplanation ? (
          /* Planet Minimal Stats Card & Playback Controls */
          <div className="pointer-events-auto w-full max-w-xl bg-black/85 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 sm:p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 10px ${selectedPlanet.color}`,
                  }}
                />
                <h3 className="font-black text-white text-base leading-none">
                  {selectedPlanet.name}
                </h3>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  {selectedPlanet.realPeriod} orbit
                </span>
                {showMoons && selectedPlanet.moons.length > 0 && (
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-800/40 flex items-center gap-1">
                    <MoonIcon size={11} />
                    {selectedPlanet.moons.map((m) => m.name).join(', ')}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowBottomExplanation(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss details"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5">
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Orbital Speed:</span>
                  <span className="text-emerald-400 font-black">{selectedPlanet.realSpeed}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Distance:</span>
                  <span className="text-cyan-300 font-black">{selectedPlanet.realDistance}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Resume'}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={cycleSpeed}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    speedMultiplier > 1
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                  title="Toggle Speed"
                >
                  <FastForward size={13} className={speedMultiplier > 1 ? 'animate-pulse' : ''} />
                  <span>{speedMultiplier}x</span>
                </button>

                <button
                  onClick={() => {
                    simTimeRef.current = 0;
                    setSpeedMultiplier(1);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                  title="Reset simulation time"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Compact Playback Bar */
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Resume'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={cycleSpeed}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                speedMultiplier > 1
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
              title="Toggle Speed"
            >
              <FastForward size={14} className={speedMultiplier > 1 ? 'animate-pulse' : ''} />
              <span>{speedMultiplier}x</span>
            </button>

            <button
              onClick={() => {
                simTimeRef.current = 0;
                setSpeedMultiplier(1);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Reset simulation time"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={() => setShowBottomExplanation(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer ml-1"
              title={`Show specs for ${selectedPlanet.name}`}
            >
              <Info size={14} />
              <span className="hidden sm:inline">{selectedPlanet.name}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Canvas Frame Updater Hook ─────────────────────────────────────────────────
function FrameUpdater({ onFrame }: { onFrame: (state: any, delta: number) => void }) {
  useFrame((state, delta) => {
    onFrame(state, delta);
  });
  return null;
}

// ─── Preload All Models Including Moon ─────────────────────────────────────────
useGLTF.preload('/models/the_sun.glb');
useGLTF.preload('/models/mercury.glb');
useGLTF.preload('/models/venus.glb');
useGLTF.preload('/models/earth.glb');
useGLTF.preload('/models/mars.glb');
useGLTF.preload('/models/realistic_jupiter.glb');
useGLTF.preload('/models/saturn.glb');
useGLTF.preload('/models/uranus.glb');
useGLTF.preload('/models/neptune.glb');
useGLTF.preload('/models/pluto.glb');
useGLTF.preload('/models/moon.glb');
