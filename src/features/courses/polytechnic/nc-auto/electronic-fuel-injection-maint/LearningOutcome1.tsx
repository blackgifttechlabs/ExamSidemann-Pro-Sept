import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  FolderTree,
  Handshake,
  DollarSign,
  Package,
  Copy,
  User,
  Layers,
  Building,
  Globe,
  AlertCircle,
  ListChecks,
  Layout,
  Lock,
  Tag,
  Share2,
  Users,
  Settings,
  Award,
  MessageSquare,
  Brain,
  Heart,
  Mic,
  Film,
  Image,
  Music,
  ThumbsDown,
  Server,
  HelpCircle,
  Zap,
  ThumbsUp,
  Cloud,
  Database,
  BarChart,
  PieChart,
  Send,
  Calculator,
  FunctionSquare,
  Grid3x3,
  ArrowRight,
  Info,
  Lightbulb,
  Wrench,
  Thermometer,
  Scale,
  Flame,
  Activity,
  Cpu,
  Map,
  Box,
  TrendingUp,
  Battery,
  CircuitBoard,
  Waves,
  Sliders,
  Eye,
  Ear,
  Radio,
  Cctv,
  ToggleLeft,
  Fuel,
  ZapOff,
  ShieldAlert,
  Microscope,
  Scan,
} from 'lucide-react';

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'safety', label: 'Safety Precautions' },
  { id: 'electronic-aspects', label: 'Electronic Aspects' },
  { id: 'operation', label: 'System Operation' },
  { id: 'components', label: 'Components' },
  { id: 'ecu', label: 'ECU Identifying' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Modern fuel injection systems operate at pressures up to 2000 psi (138 bar) in direct injection engines, requiring extreme precision and safety during servicing.',
      },
      {
        title: 'Pro Tip',
        text: 'Always relieve fuel pressure before disconnecting any fuel line; otherwise, fuel can spray violently and cause serious injury or fire.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three core feedback loops: Air (MAF/MAP), Fuel (Injectors), and Spark (Ignition). All three must be synchronised for proper engine operation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many technicians forget to reset the ECU after repairs; without resetting, adaptive memory may retain old values and cause driveability issues.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Modern fuel injection systems operate at pressures up to 2000 psi (138 bar) in direct injection engines, requiring extreme precision and safety during servicing.',
      },
      {
        title: 'Pro Tip',
        text: 'Always relieve fuel pressure before disconnecting any fuel line; otherwise, fuel can spray violently and cause serious injury or fire.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three core feedback loops: Air (MAF/MAP), Fuel (Injectors), and Spark (Ignition). All three must be synchronised for proper engine operation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many technicians forget to reset the ECU after repairs; without resetting, adaptive memory may retain old values and cause driveability issues.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Card helper ──────────────────────────────────────────────────────────
  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      purple: 'border-purple-500',
      amber: 'border-amber-500',
      red: 'border-red-500',
      indigo: 'border-indigo-500',
    };
    const borderColor = colorMap[color] || colorMap.blue;
    return `${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6 ${borderColor}`;
  };

  // ─── Helper to render a clean card ──────────────────────────────────────
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Fuel size={14} className="inline mr-1" /> AUTOMOTIVE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Fuel Injection{' '}
            <span className="text-emerald-300 font-bold italic">
              System Inspection
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to fuel injection system safety, electronic aspects, operation, components,
            sensors, actuators, ECU identification, and diagnostics.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShieldAlert size={14} className="inline mr-1" /> Safety
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> ECU
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Microscope size={14} className="inline mr-1" /> Diagnostics
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for safety, sensors, ECU, components..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* SECTION 1: Safety Precautions */}
            <div
              ref={(el) => {
                sectionRefs.current['safety'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Safety Precautions
              </h2>

              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                  <ShieldAlert size={20} /> Fuel Handling
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Ventilation:</strong> Work in a well-ventilated area to prevent accumulation of flammable fuel vapours.</li>
                  <li><strong>No Smoking/Open Flames:</strong> Absolutely no smoking or open flames near the fuel system. Fuel is highly flammable.</li>
                  <li><strong>Fuel Spills:</strong> Clean up any fuel spills immediately with absorbent materials. Dispose of them properly.</li>
                  <li><strong>Pressure Relief:</strong> Before disconnecting any fuel lines, relieve the fuel pressure in the system. Follow the manufacturer's instructions. Often done by removing the fuel pump fuse and trying to start the car to use up the fuel in the fuel rail.</li>
                  <li><strong>Eye Protection:</strong> Wear safety glasses to protect your eyes from fuel spray.</li>
                  <li><strong>Skin Protection:</strong> Wear nitrile gloves to protect your skin from fuel, which can be irritating and harmful.</li>
                  <li><strong>Fire Extinguisher:</strong> Keep a fire extinguisher readily available.</li>
                </ul>
              </div>

              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <ZapOff size={20} /> Electrical Safety
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Battery Disconnect:</strong> Disconnect the vehicle's battery (negative terminal first) before working on any electrical components of the fuel injection system. Prevents accidental shorts and electrical damage.</li>
                  <li><strong>Proper Tools:</strong> Use insulated tools when working on electrical components.</li>
                  <li><strong>Component Handling:</strong> Handle electronic components carefully to avoid static discharge, which can damage them.</li>
                  <li><strong>High Pressure:</strong> Fuel injection systems operate at high pressure. Never loosen or disconnect fuel lines while the system is pressurised.</li>
                  <li><strong>Hot Engine:</strong> Do not work on the fuel system when the engine is hot. Allow it to cool down to prevent burns.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Electronic Aspects */}
            <div
              ref={(el) => {
                sectionRefs.current['electronic-aspects'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Electronic Aspects
              </h2>

              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Sensors</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Mass Airflow (MAF) Sensor / Manifold Absolute Pressure (MAP) Sensor:</strong> Measures the amount of air entering the engine.</li>
                  <li><strong>Oxygen (O₂) Sensor:</strong> Monitors the oxygen content in the exhaust gases, providing feedback for fuel mixture adjustments.</li>
                  <li><strong>Throttle Position Sensor (TPS):</strong> Detects the position of the throttle plate, indicating the driver's demand for power.</li>
                  <li><strong>Engine Coolant Temperature (ECT) Sensor:</strong> Measures the engine's temperature, influencing fuel mixture and timing.</li>
                  <li><strong>Crankshaft Position Sensor (CKP) and Camshaft Position Sensor (CMP):</strong> Provide information about the engine's rotational speed and position.</li>
                </ul>
              </div>

              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Electronic Control Unit (ECU)</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The ECU is the "brain" of the fuel injection system. It receives input from the sensors, processes the data, and controls the fuel injectors and other actuators. It uses pre-programmed maps and adaptive learning to optimise fuel delivery for various driving conditions.</p>
              </div>

              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 text-purple-600 dark:text-purple-400">Actuators</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Fuel Injectors:</strong> Electrically controlled valves that spray fuel into the engine's intake manifold or directly into the cylinders.</li>
                  <li><strong>Fuel Pump:</strong> An electric pump that delivers fuel from the fuel tank to the engine.</li>
                  <li><strong>Idle Air Control (IAC) Valve / Electronic Throttle Control:</strong> Controls the amount of air bypassing the throttle plate at idle.</li>
                </ul>
              </div>

              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">Diagnostics</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>On-Board Diagnostics (OBD-II):</strong> Allows technicians to access diagnostic trouble codes (DTCs) that indicate problems with the fuel injection system.</li>
                  <li><strong>Scan Tools:</strong> Used to read DTCs, monitor sensor data, and perform other diagnostic tests.</li>
                  <li><strong>Wiring and Connections:</strong> All wiring and connectors must be inspected for corrosion, damage, or loose connections.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Fuel Injection System Operation */}
            <div
              ref={(el) => {
                sectionRefs.current['operation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Fuel Injection System Operation
              </h2>

              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">Fuel Delivery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The fuel pump draws fuel from the fuel tank and sends it through a fuel filter to the fuel rail. The fuel rail distributes fuel to the individual fuel injectors.</p>
              </div>

              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Air Intake</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Air enters the engine through the air intake system, passing through an air filter and the throttle body. Sensors measure the amount of air entering the engine.</p>
              </div>

              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Fuel Injection</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  <li>The ECU determines the appropriate amount of fuel to inject based on sensor data.</li>
                  <li>The ECU sends electrical pulses to the fuel injectors, causing them to open and spray fuel into the intake manifold or cylinders.</li>
                  <li>The length of the electrical pulse (pulse width) determines the amount of fuel injected.</li>
                </ul>
              </div>

              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">Combustion</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The fuel and air mixture is compressed in the cylinders and ignited by the spark plugs. The resulting combustion produces power to drive the vehicle.</p>
              </div>

              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Exhaust</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The exhaust gases are expelled from the cylinders and pass through the exhaust system. The O₂ sensor monitors the exhaust gases to provide feedback for fuel mixture adjustments.</p>
              </div>

              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 text-purple-600 dark:text-purple-400">Feedback Loop</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The engine sensors provide constant feedback to the ECU, allowing it to adjust fuel delivery and other parameters in real time. This creates a closed loop system, allowing for the most efficient engine operation.</p>
              </div>
            </div>

            {/* SECTION 4: Components Within a Fuel Injection System */}
            <div
              ref={(el) => {
                sectionRefs.current['components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components Within a Fuel Injection System
              </h2>

              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Sensors</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Mass Airflow (MAF) Sensor / Manifold Absolute Pressure (MAP) Sensor:</strong> MAF measures the mass of air entering the engine (hot-wire/hot film). MAP measures pressure in the intake manifold to calculate air density. Critical for correct air/fuel ratio.</li>
                  <li><strong>Oxygen (O₂) Sensor:</strong> Monitors oxygen content in exhaust. Provides feedback for closed-loop fuel control, allowing precise air/fuel mixture adjustments.</li>
                  <li><strong>Engine Coolant Temperature (ECT) Sensor:</strong> Measures coolant temperature. Influences fuel mixture, ignition timing, and other engine parameters.</li>
                  <li><strong>Crankshaft Position Sensor (CKP) and Camshaft Position Sensor (CMP):</strong> CKP determines crankshaft position and engine speed. CMP determines camshaft position (valve position). Essential for accurate fuel injection and ignition timing.</li>
                </ul>
              </div>

              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Actuators</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Fuel Injectors (Injection Valves):</strong> Electrically controlled valves that spray fuel. ECU controls opening duration (pulse width) to determine fuel amount.</li>
                  <li><strong>Electric Fuel Pump:</strong> Delivers fuel from tank to engine at high pressure. Modern pumps are typically in-tank, submerged in fuel for cooling.</li>
                  <li><strong>Stepper Motor:</strong> Used to control idle speed and, in some systems, to adjust the air/fuel mixture. Provides precise incremental adjustments.</li>
                </ul>
              </div>

              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">Fuel System Components (Mechanical / Electro-Mechanical)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Fuel Accumulator:</strong> Maintains residual fuel pressure after engine shut-off. Helps prevent vapour lock and ensures quick restarts.</li>
                  <li><strong>Fuel Filter:</strong> Removes contaminants from fuel, protecting injectors and other components.</li>
                  <li><strong>Primary Pressure Regulator:</strong> Maintains constant fuel pressure in the fuel rail. Ensures consistent fuel delivery to injectors.</li>
                  <li><strong>Air-Flow Sensor (Air-Flow Meter):</strong> In mechanical systems (e.g., K-Jetronic), a mechanical flap that moves in response to airflow. Its movement controls the fuel distributor.</li>
                  <li><strong>Fuel Distributor:</strong> In mechanical systems, distributes fuel to individual injectors based on air-flow sensor position. Divides fuel flow into equal portions.</li>
                  <li><strong>Differential Pressure Valves:</strong> Maintain a constant pressure difference across the fuel metering slits in the fuel distributor. Ensures correct fuel delivery.</li>
                  <li><strong>Warm-Up Regulator (Enrichment):</strong> In mechanical systems, regulates fuel pressure during engine warm-up. Provides richer mixture for cold starts and warm-up.</li>
                  <li><strong>Thermo-Time Switch and Cold-Start Valve:</strong> Thermo-Time Switch controls cold-start valve operation based on engine temperature. Cold-Start Valve provides extra fuel during cold starts.</li>
                  <li><strong>Auxiliary Air Device:</strong> Bypasses the throttle plate to provide extra air during cold starts, increasing idle speed.</li>
                </ul>
              </div>

              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 text-purple-600 dark:text-purple-400">Adjustments</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Idle Mixture Adjustment Screw:</strong> Adjusts the air/fuel mixture at idle. Used to fine-tune idle quality.</li>
                  <li><strong>Idle Speed Adjustment Screw:</strong> Adjusts the idle speed by controlling the amount of air bypassing the throttle plate.</li>
                  <li><strong>Throttle Valve (Throttle Plate):</strong> Controls the amount of air entering the engine. Controlled by the driver via the accelerator pedal.</li>
                </ul>
              </div>

              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">Differences</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Older mechanical systems (e.g., K-Jetronic):</strong> Rely on mechanical components and fuel pressure to control fuel delivery.</li>
                  <li><strong>Modern electronic systems:</strong> Use sensors, an ECU, and electrically controlled injectors for precise fuel control.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Electronic Control Unit (ECU) Identifying */}
            <div
              ref={(el) => {
                sectionRefs.current['ecu'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Electronic Control Unit (ECU) — Identifying
              </h2>

              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Safety Precautions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Electrical Safety:</strong> Always disconnect the vehicle's battery (negative terminal first) before working on any ECU or related wiring. Prevents accidental shorts and potential damage to sensitive electronics. Use proper grounding techniques to avoid static discharge. Be aware of potential voltage spikes when disconnecting or connecting components.</li>
                  <li><strong>Component Handling:</strong> ECUs are delicate electronic devices. Handle with care to avoid physical damage. Avoid exposing the ECU to extreme temperatures, moisture, or strong magnetic fields.</li>
                  <li><strong>Software Safety:</strong> When using diagnostic tools or reprogramming the ECU, ensure reliable and compatible software. Incorrect software can cause serious damage. Always back up any existing ECU data before making changes.</li>
                </ul>
              </div>

              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Computer Operation</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Processing Power:</strong> ECUs contain microprocessors that process data from sensors and execute control algorithms. Processing power determines ability to handle complex calculations and real-time control.</li>
                  <li><strong>Memory:</strong> ECUs have memory to store program data, sensor readings, and diagnostic information. Types: ROM (Read-Only Memory), RAM (Random Access Memory), or flash memory.</li>
                  <li><strong>Communication:</strong> ECUs communicate with other vehicle systems and diagnostic tools through protocols like CAN (Controller Area Network), OBD-II (On-Board Diagnostics II), and others. Understanding these is vital for diagnostics and reprogramming.</li>
                  <li><strong>Software:</strong> The software loaded onto the ECU dictates how the car operates. Calibrated by vehicle manufacturers and sometimes aftermarket companies.</li>
                </ul>
              </div>

              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Sensors — Input Devices</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Input Devices:</strong> Sensors provide the ECU with real-time information about vehicle operating conditions.</li>
                  <li><strong>Common Sensors:</strong> Temperature sensors (engine coolant, air intake), pressure sensors (manifold, fuel), position sensors (crankshaft, camshaft, throttle), flow sensors (air mass), oxygen sensors.</li>
                  <li><strong>Signal Processing:</strong> The ECU receives analog or digital signals from sensors and converts them into processable data.</li>
                </ul>
              </div>

              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 text-amber-600 dark:text-amber-400">Actuators — Output Devices</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Output Devices:</strong> Actuators are devices the ECU controls to affect vehicle operation.</li>
                  <li><strong>Common Actuators:</strong> Fuel injectors, ignition coils, throttle control motors, variable valve timing actuators, relays that control various systems.</li>
                  <li><strong>Control Signals:</strong> The ECU sends control signals to actuators based on sensor data and programmed control algorithms.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Fuel Injection Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Sensor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4+</span>
                </li>
                <li className="flex justify-between">
                  <span>Actuator Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3+</span>
                </li>
                <li className="flex justify-between">
                  <span>Mechanical Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Always prioritise safety — ventilate, avoid flames, relieve fuel pressure, wear PPE,
                and disconnect the battery before electrical work. Understand the electronic aspects:
                sensors, ECU, actuators, and diagnostics. Know the 6-step operation: fuel delivery,
                air intake, injection, combustion, exhaust, and feedback loop. Identify all components
                from sensors to actuators, mechanical parts, adjustments, and differences between
                mechanical and electronic systems. When identifying the ECU, follow safety protocols,
                understand computer operation, and know the distinction between input sensors and
                output actuators.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Safety Precautions</strong> – Work in ventilated areas,
                avoid flames, relieve fuel pressure, wear PPE, disconnect battery, handle electronics
                carefully, and keep a fire extinguisher ready.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Electronic Aspects</strong> – Sensors (MAF/MAP, O₂,
                TPS, ECT, CKP/CMP), ECU (processing, memory, communication), Actuators (injectors,
                fuel pump, IAC), and Diagnostics (OBD-II, scan tools, wiring inspection).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">System Operation</strong> – Six-step process:
                Fuel Delivery, Air Intake, Fuel Injection, Combustion, Exhaust, and Feedback Loop
                (closed-loop control).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Components</strong> – Sensors (MAF, MAP, O₂, ECT,
                CKP, CMP), Actuators (injectors, fuel pump, stepper motor), Mechanical components
                (accumulator, filter, regulator, distributor, warm‑up regulator, cold‑start valve,
                auxiliary air device), and adjustments (idle mixture, idle speed, throttle valve).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ECU Identifying</strong> – Follow safety protocols,
                understand ECU computer operation (processing, memory, communication, software),
                recognise input sensors and output actuators, and appreciate the difference between
                older mechanical and modern electronic systems.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Fuel Injection System Inspection — LO1
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;