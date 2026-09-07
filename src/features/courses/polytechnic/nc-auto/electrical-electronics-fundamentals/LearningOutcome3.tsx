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
} from 'lucide-react';

// ─── Standard symbols and practical circuit diagrams ────────────────────────
const NpnTransistorSymbol = () => (
  <svg viewBox="0 0 120 100" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="NPN transistor with emitter arrow pointing outward">
    <defs><marker id="lo3-npn-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 50h39M47 25v50M47 34l29-20h24M47 66l29 20h24"/><path d="M60 75l13 9" markerEnd="url(#lo3-npn-arrow)"/></g>
    <text x="12" y="44" fontSize="9" fill="currentColor">B</text><text x="102" y="17" fontSize="9" fill="currentColor">C</text><text x="102" y="90" fontSize="9" fill="currentColor">E</text>
  </svg>
);

const LogicGateSymbol = ({ type }: { type: string }) => {
  const getPath = (type: string) => {
    switch (type) {
      case 'AND':
        return <path d="M24 16h22a24 24 0 0 1 0 48H24z" fill="none" stroke="currentColor" strokeWidth="2.4"/>;
      case 'OR':
        return <path d="M22 16c17 0 31 4 45 24-14 20-28 24-45 24 9-14 9-34 0-48zm0 0c10 14 10 34 0 48" fill="none" stroke="currentColor" strokeWidth="2.4"/>;
      case 'NOT':
        return (
          <>
            <path d="M25 18v44l36-22z" fill="none" stroke="currentColor" strokeWidth="2.4"/>
            <circle cx="66" cy="40" r="5" fill="none" stroke="currentColor" strokeWidth="2.4"/>
          </>
        );
      default:
        return <rect x="20" y="30" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>;
    }
  };
  return (
    <svg viewBox="0 0 90 88" className="mx-auto h-auto w-full max-w-[120px]" role="img" aria-label={`${type} logic gate symbol`}>
      {type === 'NOT' ? <line x1="8" y1="40" x2="25" y2="40" stroke="currentColor" strokeWidth="2.4"/> : <><line x1="8" y1="29" x2="24" y2="29" stroke="currentColor" strokeWidth="2.4"/><line x1="8" y1="51" x2="24" y2="51" stroke="currentColor" strokeWidth="2.4"/></>}
      {getPath(type)}
      <line x1={type === 'NOT' ? 71 : 70} y1="40" x2="84" y2="40" stroke="currentColor" strokeWidth="2.4"/>
      <text x="45" y="82" textAnchor="middle" fontSize="10" fill="currentColor">{type}</text>
    </svg>
  );
};

const DiagramFrame = ({ children, caption }: { children: React.ReactNode; caption: string }) => <figure className="my-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161616]">{children}<figcaption className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">{caption}</figcaption></figure>;

const BreadboardDiagram = () => <DiagramFrame caption="Solderless breadboard connectivity: each five-hole terminal strip is connected internally; the centre trench separates IC pin rows; long power rails run along the edges."><svg viewBox="0 0 720 250" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Breadboard internal connection layout">
  <rect x="35" y="20" width="650" height="210" rx="18" fill="#f8fafc" stroke="#64748b" strokeWidth="2"/><path d="M60 55h600M60 78h600M60 191h600M60 214h600" stroke="#dc2626" strokeWidth="3"/><path d="M60 65h600M60 201h600" stroke="#2563eb" strokeWidth="3"/>
  {[95,155,215,275,335,395,455,515,575,635].map((x)=><g key={x}>{[105,120,135,165,180].map((y)=><circle key={y} cx={x} cy={y} r="4" fill="#334155"/>)}<path d={`M${x} 101v38M${x} 161v23`} stroke="#94a3b8" strokeWidth="5" opacity=".5"/></g>)}<rect x="58" y="144" width="604" height="12" fill="#e2e8f0"/><text x="360" y="153" textAnchor="middle" fontSize="10" fill="#475569">centre trench</text>
</svg></DiagramFrame>;

const TransistorSwitchDiagram = () => <DiagramFrame caption="Correct low-side NPN switch: the load is between +12 V and collector, the emitter is grounded, and a base resistor limits control current. Add a flyback diode across an inductive load."><svg viewBox="0 0 720 300" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="NPN low side transistor switch circuit">
  <defs><marker id="switch-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs><g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M360 25v35M360 60h90v62M360 60h-90v62M270 122v45M450 122v45M270 167h90M450 167h-90M360 167v26M360 193l-36 25M360 193l36 25M324 218v35M396 218v35M324 253h72M360 253v28M95 193h85M180 178h90v30h-90zM270 193h54"/><path d="M379 207l14 10" markerEnd="url(#switch-arrow)"/></g><rect x="320" y="96" width="80" height="28" rx="4" fill="#fde68a" stroke="#92400e"/><text x="360" y="115" textAnchor="middle" fontSize="11" fill="#451a03">RELAY COIL</text><path d="M425 96v28M415 104l10 6-10 6z" fill="none" stroke="#2563eb" strokeWidth="2"/><g fontSize="12" fill="currentColor"><text x="374" y="24">+12 V</text><text x="115" y="185">ECU output</text><text x="225" y="173">R<tspan baselineShift="sub">B</tspan></text><text x="405" y="241">NPN</text><text x="372" y="294">0 V</text></g>
</svg></DiagramFrame>;

const DarlingtonDiagram = () => <DiagramFrame caption="Darlington connection: Q1 emitter feeds Q2 base and both collectors are joined. The pair has very high current gain but about two base-emitter drops and a higher saturation voltage."><svg viewBox="0 0 720 260" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Darlington pair transistor connection">
  <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M70 130h100M170 95v70M170 108l75-48h110M170 152l75 48h55M300 165v70M300 178l75-48h150M300 222l75 28h150M245 60v-25M375 130V35M245 35h130"/></g><path d="M220 184l21 13-7-24zM350 232l21 16-5-25z" fill="currentColor"/><g fontSize="13" fill="currentColor"><text x="155" y="86">Q1</text><text x="285" y="156">Q2</text><text x="52" y="124">IN</text><text x="530" y="125">joined collectors</text><text x="530" y="250">OUT emitter</text></g>
</svg></DiagramFrame>;

const OscillatorWaveforms = () => <DiagramFrame caption="Multivibrator outputs: astable runs continuously, monostable produces one timed pulse after a trigger, and bistable changes state only when set or reset."><svg viewBox="0 0 720 260" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Astable monostable and bistable timing waveforms">
  <g stroke="#cbd5e1" strokeWidth="1"><path d="M130 35h550M130 120h550M130 205h550"/></g><g fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinejoin="round"><path d="M130 75h55V35h55v40h55V35h55v40h55V35h55v40h55V35h55v40h55V35h55"/><path d="M130 160h170v-40h135v40h245"/><path d="M130 245h135v-40h210v40h205"/></g><g fontSize="13" fill="currentColor"><text x="25" y="58">ASTABLE</text><text x="25" y="143">MONOSTABLE</text><text x="25" y="228">BISTABLE</text><text x="291" y="113">trigger</text><text x="254" y="198">set</text><text x="464" y="198">reset</text></g>
</svg></DiagramFrame>;

const PcmDiagram = () => <DiagramFrame caption="PCM conversion sequence: anti-alias filter → sample and hold → quantizer → binary encoder. Quantization maps each sample to the nearest discrete level."><svg viewBox="0 0 720 270" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Pulse code modulation sampling quantization and encoding stages">
  <g stroke="#64748b" strokeWidth="1"><path d="M30 190h170M260 190h170M490 190h200"/></g><path d="M30 160c35-90 70-90 105 0s70 90 105 0" fill="none" stroke="#2563eb" strokeWidth="3"/>{[285,315,345,375,405].map((x,i)=><g key={x}><path d={`M${x} 190v-${[25,62,91,58,20][i]}`} stroke="#7c3aed" strokeWidth="2"/><circle cx={x} cy={190-[25,62,91,58,20][i]} r="4" fill="#7c3aed"/></g>)}<path d="M500 170h30v-55h35v30h35v-70h35v95h35" fill="none" stroke="#16a34a" strokeWidth="3"/><g fontSize="12" textAnchor="middle" fill="currentColor"><text x="120" y="225">analog input</text><text x="345" y="225">sampled + quantized</text><text x="590" y="225">binary PCM pulses</text><text x="345" y="252">011 · 101 · 111 · 100 · 010</text></g>
</svg></DiagramFrame>;

const MultiplexerDiagram = () => <DiagramFrame caption="A multiplexer selects one input for a shared line using address bits; a demultiplexer uses an address to route that line to one output."><svg viewBox="0 0 720 260" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Multiplexer bus and demultiplexer block diagram">
  <g fill="#ede9fe" stroke="#6d28d9" strokeWidth="2"><path d="M170 45l130 35v100l-130 35z"/><path d="M550 45l-130 35v100l130 35z"/></g><g stroke="currentColor" strokeWidth="2.3">{[75,115,155,195].map((y)=><path key={y} d={`M35 ${y}h135M550 ${y}h135`}/>)}<path d="M300 130h120M235 225v-35M485 225v-35"/></g><g fontSize="13" fill="currentColor" textAnchor="middle"><text x="235" y="126">4-to-1 MUX</text><text x="485" y="126">1-to-4 DEMUX</text><text x="235" y="245">address select</text><text x="485" y="245">address select</text><text x="360" y="120">shared</text><text x="360" y="140">data bus</text></g>
</svg></DiagramFrame>;

const VehicleControlLoopDiagram = () => <DiagramFrame caption="Vehicle closed-loop control: a sensor measures a physical condition, the ECU processes it, a protected driver powers the actuator, and feedback confirms the result."><svg viewBox="0 0 720 250" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Automotive sensor ECU actuator feedback control loop">
  <defs><marker id="loop-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0l7 3.5L0 7z" fill="#475569"/></marker></defs><g fill="#f8fafc" stroke="#475569" strokeWidth="2"><rect x="30" y="85" width="130" height="70" rx="10"/><rect x="215" y="85" width="130" height="70" rx="10"/><rect x="400" y="85" width="130" height="70" rx="10"/><rect x="585" y="85" width="105" height="70" rx="10"/></g><g stroke="#475569" strokeWidth="2.5" markerEnd="url(#loop-arrow)"><path d="M160 120h55M345 120h55M530 120h55M638 155v60H95v-60" fill="none"/></g><g fontSize="14" fontWeight="700" textAnchor="middle" fill="currentColor"><text x="95" y="113">SENSOR</text><text x="95" y="133" fontSize="10">temperature / speed</text><text x="280" y="113">ECU</text><text x="280" y="133" fontSize="10">decision + diagnostics</text><text x="465" y="113">DRIVER</text><text x="465" y="133" fontSize="10">transistor / relay</text><text x="638" y="113">ACTUATOR</text><text x="638" y="133" fontSize="10">motor / solenoid</text><text x="360" y="235" fontSize="11">physical feedback</text></g>
</svg></DiagramFrame>;

const DiagnosticSignalDiagram = () => <DiagramFrame caption="A sound diagnostic sequence measures first, compares the waveform or live value with specifications, isolates wiring/component causes, repairs, then verifies under the same conditions."><svg viewBox="0 0 720 250" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Automotive electronic fault diagnosis workflow">
  <defs><marker id="diag-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0l7 3.5L0 7z" fill="#475569"/></marker></defs>{[['READ DTCs',20],['MEASURE',160],['COMPARE',300],['ISOLATE',440],['REPAIR + VERIFY',580]].map(([label,x])=><g key={label}><rect x={Number(x)} y="80" width={label==='REPAIR + VERIFY'?125:110} height="65" rx="9" fill="#f8fafc" stroke="#475569" strokeWidth="2"/><text x={Number(x)+(label==='REPAIR + VERIFY'?62:55)} y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{label}</text></g>)}<g stroke="#475569" strokeWidth="2.4" markerEnd="url(#diag-arrow)"><path d="M130 112h30M270 112h30M410 112h30M550 112h30"/></g><path d="M180 205c20-45 40-45 60 0s40 45 60 0 40-45 60 0 40 45 60 0" fill="none" stroke="#7c3aed" strokeWidth="3"/><text x="300" y="235" textAnchor="middle" fontSize="11" fill="currentColor">scope waveform / live-data trend</text>
</svg></DiagramFrame>;

const COMPONENT_IMAGE_ROOT = '/images/courses/nc-auto/electrical-electronics-fundamentals';
const ComponentPhoto = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#161616]"><img src={`${COMPONENT_IMAGE_ROOT}/${src}`} alt={alt} loading="lazy" decoding="async" className="h-64 w-full bg-white object-contain p-3"/><figcaption className="border-t border-slate-200 px-3 py-2 text-center text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">{caption}</figcaption></figure>;

// ─── Table component ──────────────────────────────────────────────────────────
const Table = ({ headers, rows, isDarkMode }: { headers: string[]; rows: string[][]; isDarkMode: boolean }) => (
  <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className={isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100'}>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-2 text-left font-black text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? (isDarkMode ? 'bg-[#252526]' : 'bg-white') : (isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50')}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 text-xs">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'constructing', label: 'Constructing Circuits' },
  { id: 'transistor-switch', label: 'Transistor as Switch' },
  { id: 'darlington', label: 'Darlington Transistor' },
  { id: 'switching-circuits', label: 'Switching Circuits' },
  { id: 'oscillators', label: 'Oscillators' },
  { id: 'digital-circuits', label: 'Digital Circuits' },
  { id: 'pcm', label: 'PCM' },
  { id: 'microprocessors', label: 'Microprocessors' },
  { id: 'sensors-actuators', label: 'Sensors & Actuators' },
  { id: 'diagnostics', label: 'Diagnostic Techniques' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'The first integrated circuit was invented in 1958 by Jack Kilby at Texas Instruments. It contained just one transistor and a few other components on a single piece of germanium.',
      },
      {
        title: 'Pro Tip',
        text: 'When testing a transistor switch circuit, always measure the base-emitter voltage (V_BE) to ensure the transistor is properly biased — around 0.7V for silicon NPN transistors.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three basic logic gate functions: NOT (inverts), AND (both inputs must be 1), OR (either input can be 1). Think "N-O-A" for NOT, OR, AND.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners forget to include a current-limiting resistor at the base of a transistor switch, which can damage the transistor or the signal source.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first integrated circuit was invented in 1958 by Jack Kilby at Texas Instruments. It contained just one transistor and a few other components on a single piece of germanium.',
      },
      {
        title: 'Pro Tip',
        text: 'When testing a transistor switch circuit, always measure the base-emitter voltage (V_BE) to ensure the transistor is properly biased — around 0.7V for silicon NPN transistors.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three basic logic gate functions: NOT (inverts), AND (both inputs must be 1), OR (either input can be 1). Think "N-O-A" for NOT, OR, AND.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners forget to include a current-limiting resistor at the base of a transistor switch, which can damage the transistor or the signal source.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Zap size={14} className="inline mr-1" /> ELECTRICAL & ELECTRONICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Construct{' '}
            <span className="text-purple-300 font-bold italic">
              Electronic Circuits
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Construction, inspection, switching circuits, oscillators, digital logic, sensors,
            actuators, and diagnostics.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Construction
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CircuitBoard size={14} className="inline mr-1" /> Digital Logic
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cctv size={14} className="inline mr-1" /> Diagnostics
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
                placeholder="Search for transistors, logic gates, oscillators, sensors..."
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
            {/* SECTION 1: Constructing Circuits */}
            <div
              ref={(el) => {
                sectionRefs.current['constructing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Construct Electronic Circuits
              </h2>
              <BreadboardDiagram />
              <ComponentPhoto src="breadboard-circuit.jpg" alt="Real solderless breadboard populated with electronic components and jumper wires" caption="A real breadboard prototype. Follow the internal terminal-strip connections—not the visual proximity of holes—when tracing the circuit." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  When constructing and inspecting electronic circuits, it is essential to follow industry
                  standards and safety guidelines to ensure reliability and functionality.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Box size={16} /> 1. Constructing Basic Circuits Using Electronic Components
                </h3>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">Essential Electronic Components</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✔ Resistors – Limit current flow.</li>
                  <li>✔ Capacitors – Store and release electrical energy.</li>
                  <li>✔ Diodes – Allow current flow in one direction.</li>
                  <li>✔ Transistors – Act as switches or amplifiers.</li>
                  <li>✔ Integrated Circuits (ICs) – Perform complex functions.</li>
                  <li>✔ Power Sources (Batteries/Adapters) – Supply voltage.</li>
                  <li>✔ Wires and PCB (Printed Board) – Connect components.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Steps for Constructing a Basic Circuit
                </h3>
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>
                    <strong>Step 1: Gather Components</strong> – Identify required components based on
                    circuit diagram. Check specifications and ratings.
                  </li>
                  <li>
                    <strong>Step 2: Read Diagram</strong> – Follow standard schematic symbols and wiring
                    layout. Ensure proper polarity (especially for diodes and electrolytic capacitors).
                  </li>
                  <li>
                    <strong>Step 3: Assemble on a Breadboard (Prototype Stage)</strong> – Use a breadboard
                    to test the circuit before soldering. Check for short circuits or wrong connections.
                  </li>
                  <li>
                    <strong>Step 4: Transfer to a PCB (Printed Board)</strong> – Once tested, transfer
                    components to a PCB for a permanent setup. Use proper soldering techniques.
                  </li>
                  <li>
                    <strong>Step 5: Test the Circuit</strong> – Measure voltage, current, and resistance
                    using a multimeter. Ensure circuit meets performance standards.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> 3. Inspecting Electronic Circuits According to Standards
                </h3>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">Industry Standards for Inspection</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✔ IPC-A-600 – PCB acceptance standard.</li>
                  <li>✔ IEC 61131 – Standard for industrial electronic circuits.</li>
                  <li>✔ ISO 9001 – Ensures quality in electronics manufacturing.</li>
                  <li>✔ IEEE Standards – Follow guidelines for circuit design and testing.</li>
                </ul>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Inspection Process</p>
                <ol className="list-decimal pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>
                    <strong>Visual Inspection:</strong> Check for damaged components, loose connections,
                    soldering defects. Verify component placement matches diagram.
                  </li>
                  <li>
                    <strong>Electrical Testing:</strong> Measure voltage/current with multimeter. Ensure
                    components are within specs.
                  </li>
                  <li>
                    <strong>Functionality Testing:</strong> Power ON and check expected operation.
                    Identify faulty components and replace.
                  </li>
                  <li>
                    <strong>Safety Check:</strong> Ensure proper insulation, grounding, and EMI standards.
                  </li>
                </ol>
              </div>
            </div>

            {/* SECTION 2: Transistor as Switch */}
            <div
              ref={(el) => {
                sectionRefs.current['transistor-switch'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Experiment with a Transistor as a Switch
              </h2>
              <TransistorSwitchDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  In this experiment, we will use an NPN transistor as a switch to control the flow of
                  current through a load (like an LED) with a low control current at the base. When the
                  transistor is ON, it allows current to flow from the collector to the emitter, turning
                  the load on.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Components Needed:</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>NPN Transistor (e.g., 2N2222)</li>
                  <li>Resistors: Base resistor (R<sub>B</sub>) = 1 kΩ, Load resistor (R<sub>L</sub>) = 220 Ω</li>
                  <li>Power Supply: 5V DC</li>
                  <li>LED</li>
                  <li>Switch (for base control)</li>
                  <li>Connecting Wires</li>
                </ul>
                <div className="flex justify-center my-4"><NpnTransistorSymbol /></div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">Explanation of the Circuit:</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Power Supply (5V) supplies constant voltage.</li>
                  <li>Load resistor R<sub>L</sub> limits LED current.</li>
                  <li>LED lights when transistor is ON.</li>
                  <li>NPN Transistor: Base connected to switch via current‑limiting resistor; Collector to LED; Emitter to ground.</li>
                  <li>Switch when closed allows current to base, turning transistor ON.</li>
                  <li>Base resistor R<sub>B</sub> protects base by limiting current.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Operation:</strong> Switch open → no base current → transistor OFF → LED off.
                  Switch closed → base current → transistor ON → LED lights.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Important Notes:</strong> Base current is controlled by R<sub>B</sub>. The
                  transistor acts as a switch, turning LED on/off via small control current. Used in
                  digital switching, amplification, relay control.
                </p>
              </div>
            </div>

            {/* SECTION 3: Darlington Transistor */}
            <div
              ref={(el) => {
                sectionRefs.current['darlington'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Experiment with a Darlington Transistor as a Switching Amplifier
              </h2>
              <DarlingtonDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A Darlington transistor is a pair of transistors connected together to form a single
                  device with high current gain. This configuration is used in switching applications
                  to amplify weak signals.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Components Required:</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Darlington Transistor (e.g., TIP120)</li>
                  <li>Resistors: R<sub>B</sub> (1kΩ), R<sub>L</sub> (220Ω or as required)</li>
                  <li>Power Supply (9V battery or DC)</li>
                  <li>Switch</li>
                  <li>LED or Motor (load)</li>
                  <li>Connecting Wires</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Explanation:</strong> Power supply provides voltage. Load resistor limits current
                  through LED/motor. Darlington transistor base receives small current from switch via R<sub>B</sub>.
                  When switch closed, base current turns transistor ON, allowing large collector current to
                  flow through load.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Operation:</strong> Switch open → no base current → OFF → load off. Switch closed →
                  small base current → high collector current → load on.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Key Features:</strong> High current gain (β≥1000), higher V<sub>CE(sat)</sub> (~1.2V),
                  slower switching speed.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications:</strong> Amplifying weak signals, PWM motor control, relay switching.
                </p>
              </div>
            </div>

            {/* SECTION 4: Switching Circuits */}
            <div
              ref={(el) => {
                sectionRefs.current['switching-circuits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Switching Circuits
              </h2>
              <TransistorSwitchDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Switching circuits turn ON and OFF the flow of electrical current. They are critical in
                  digital electronics, logic gates, amplifiers, and signal processing.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Types of Switching Circuits</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Mechanical Switches:</strong> Physical devices (push button, toggle).</li>
                  <li><strong>Solid-State Switches:</strong> Transistors, thyristors, FETs (no moving parts).</li>
                  <li><strong>Relay-Based Switching Circuits:</strong> Electrically operated switch using coil and contacts.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Transistor Switches:</strong> NPN transistor: small base current allows larger
                  collector-emitter current. ON state when base current present, OFF when no base current.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>MOSFETs as Switches:</strong> Voltage‑controlled; used in high‑power applications.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Relays:</strong> Electromagnet moves contacts; can switch high currents with low
                  control current. Used in automotive, home automation.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Switching States:</strong> ON (closed) – current flows; OFF (open) – no current.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications:</strong> Digital logic gates, amplifiers, motor control, PWM,
                  home automation.
                </p>
              </div>
            </div>

            {/* SECTION 5: Oscillators */}
            <div
              ref={(el) => {
                sectionRefs.current['oscillators'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Oscillators
              </h2>
              <OscillatorWaveforms />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Oscillators generate continuous periodic waveforms without an external signal. They
                  consist of an amplifier and a feedback network.
                </p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Oscillator Type', 'Stable States', 'Output', 'Applications']}
                  rows={[
                    ['Astable Multivibrator', 'No stable state (free‑running)', 'Continuous square wave', 'Pulse generation, PWM, tone generation'],
                    ['Monostable Multivibrator', 'One stable state', 'Single pulse output', 'Timers, pulse stretching'],
                    ['Bistable Multivibrator (Flip‑Flop)', 'Two stable states', 'Binary output', 'Memory storage, counters, state machines'],
                    ['Schmitt Trigger', 'Two threshold states', 'Clean digital signal', 'Noise filtering, signal conditioning, waveform shaping'],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 6: Digital Circuits */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-circuits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Circuits
              </h2>
              <DiagramFrame caption="IEC/ANSI logic shapes below use two distinct inputs for AND and OR; the inversion bubble on NOT indicates logical complement."><div className="grid grid-cols-3 gap-3"><LogicGateSymbol type="NOT"/><LogicGateSymbol type="AND"/><LogicGateSymbol type="OR"/></div></DiagramFrame>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Digital circuits use discrete binary signals (0 and 1). They are based on Boolean
                  algebra and logic gates.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Types:</strong> Combinational circuits (output depends only on current inputs)
                  and Sequential circuits (output depends on current inputs and past history – memory).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Examples of Combinational Circuits:</strong> Logic gates, adders, multiplexers,
                  encoders, decoders.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Examples of Sequential Circuits:</strong> Flip‑flops, registers, counters,
                  state machines.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications:</strong> Computers, signal processing, control systems,
                  communication, embedded systems.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <CircuitBoard size={16} /> Logic Gates
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-[#1e1e1e] p-2 rounded shadow text-center border border-slate-200 dark:border-slate-700">
                    <LogicGateSymbol type="NOT" />
                    <p className="text-sm">NOT</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Y = A'</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e1e1e] p-2 rounded shadow text-center border border-slate-200 dark:border-slate-700">
                    <LogicGateSymbol type="AND" />
                    <p className="text-sm">AND</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Y = A·B</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e1e1e] p-2 rounded shadow text-center border border-slate-200 dark:border-slate-700">
                    <LogicGateSymbol type="OR" />
                    <p className="text-sm">OR</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Y = A+B</p>
                  </div>
                </div>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Gate', 'Symbol', 'Truth Table', 'Boolean Expression']}
                  rows={[
                    ['NOT', 'Inverter', '0→1, 1→0', 'Y = A\''],
                    ['AND', '&', 'Only 1+1→1', 'Y = A·B'],
                    ['OR', '≥1', 'Any 1→1', 'Y = A+B'],
                    ['NAND', 'AND + NOT', 'Only 1+1→0', 'Y = (A·B)\''],
                    ['NOR', 'OR + NOT', 'Only 0+0→1', 'Y = (A+B)\''],
                    ['XOR', '⊕', 'Different→1', 'Y = A⊕B'],
                    ['XNOR', '⊕ with NOT', 'Same→1', 'Y = (A⊕B)\''],
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Calculator size={16} /> Boolean Algebra Examples
                </h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Example 1:</strong> (A + B) × (A′ + C) = A·C + B·A′ + B·C</li>
                  <li><strong>Example 2 (De Morgan):</strong> (A + B)′ = A′·B′</li>
                  <li><strong>Example 3:</strong> A·(B + C) + A′·C = A·B + C</li>
                  <li><strong>Example 4:</strong> (A + B)·(C + D)′ = A·C′·D′ + B·C′·D′</li>
                </ul>
              </div>
            </div>

            {/* SECTION 7: PCM */}
            <div
              ref={(el) => {
                sectionRefs.current['pcm'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Pulse Code Modulation (PCM)
              </h2>
              <PcmDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  PCM is a method to digitally represent analog signals. Steps: Sampling, Quantization,
                  Encoding, Transmission/Storage.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications:</strong> Telecommunications, audio recording (CDs), video
                  compression, data storage, radar/sonar.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Advantages:</strong> High accuracy, noise resistance, easy signal processing.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Disadvantages:</strong> Requires high bandwidth, quantization error.
                </p>
              </div>
            </div>

            {/* SECTION 8: Microprocessors and Multiplexing */}
            <div
              ref={(el) => {
                sectionRefs.current['microprocessors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Microprocessors and Multiplexing
              </h2>
              <MultiplexerDiagram />
              <ComponentPhoto src="integrated-circuit-die.jpg" alt="Microscope photograph of an integrated circuit die" caption="Real integrated-circuit die containing patterned transistor and interconnection layers." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A microprocessor is the central unit of a computer or electronic system that performs
                  processing tasks.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>PCM fundamental parts:</strong> Sampling, Quantization, Encoding, Transmission/Storage.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Computer interface, memories, information processing.</strong>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Remote Switching:</strong> Controlling devices from a distance via communication
                  network.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Multiplexing:</strong> Combining multiple signals into one data stream.
                  Types: TDM, FDM, CDM.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Key Components:</p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Component', 'Function']}
                  rows={[
                    ['Decoder', 'Converts multiplexed signal back to individual components'],
                    ['Data Bus', 'Physical connections carrying multiplexed data'],
                    ['Address', 'Identifier to select specific channel/device'],
                    ['Time Division', 'Divides transmission into time slots (TDM)'],
                    ['Mux', 'Combines multiple signals into one'],
                    ['Demux', 'Separates multiplexed signal into original signals'],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 9: Sensors and Actuators */}
            <div
              ref={(el) => {
                sectionRefs.current['sensors-actuators'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sensors and Actuators in Vehicles
              </h2>
              <VehicleControlLoopDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Sensors:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detect physical quantities (temperature, pressure, speed, position) and convert to
                  electrical signals.
                </p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Level Sensors:</strong> Fuel, coolant, oil levels (float/capacitance).</li>
                  <li><strong>Position Sensors:</strong> Throttle position, brake pedal (potentiometer, inductive).</li>
                  <li><strong>Gas Sensors:</strong> Oxygen, CO, NOx (electrochemical, MOS).</li>
                  <li><strong>Engine Knock Sensors:</strong> Piezoelectric crystal detecting pre‑detonation.</li>
                  <li><strong>Temperature Sensors:</strong> Thermistors, thermocouples, RTDs.</li>
                  <li><strong>Airflow Sensors (MAF):</strong> Hot‑wire or vane type measuring intake air.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Actuators:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Convert energy into physical motion.</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>
                    <strong>Solenoid Actuators:</strong> Moving winding, moving field, double‑acting,
                    double wound. Used in pinball machines, valves, locks.
                  </li>
                  <li>
                    <strong>Electric Motor Actuators:</strong> Linear motors (straight‑line motion for
                    elevators, AGVs); Rotary motors (AC/DC for fans, pumps, EVs).
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 10: Diagnostics */}
            <div
              ref={(el) => {
                sectionRefs.current['diagnostics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Logical Fault Diagnostic Techniques
              </h2>
              <DiagnosticSignalDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Oscilloscope:</strong> Measures time‑varying signals. Connect probe to circuit,
                  set time base and voltage scale. Interpret waveform – normal periodic vs irregularities
                  (missing pulses, distortion). Diagnose sensor misfires, power supply issues.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Engine Analyser:</strong> Connects via OBD‑II port, performs diagnostic scan,
                  reads trouble codes, displays real‑time data (fuel pressure, oxygen sensor). Detects
                  misfires, sensor failures.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Computerized Diagnostic Equipment (OBD‑II Scanner):</strong> Reads and clears
                  trouble codes, monitors live data. Example: P0301 (cylinder 1 misfire), P0171 (lean mixture).
                </p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Equipment', 'Function', 'Fault Diagnostic Application']}
                  rows={[
                    ['Oscilloscope', 'Measures waveforms', 'Irregular signals, sensor faults'],
                    ['Engine Analyser', 'Reads error codes, engine parameters', 'Misfires, fuel/ignition issues'],
                    ['OBD‑II Scanner', 'Retrieves trouble codes, live data', 'Sensor failures, emissions problems'],
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Cctv size={16} /> Using OBD‑II to Interpret Digital Signals and Evaluate Data
                </h3>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">Interpreting Digital Signals:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Connect scanner, access live data (RPM, throttle position, oxygen sensor voltage).
                  Valid vs invalid signals, consistency.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Digital/Graphical Displays:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Numeric readouts (temperature, pressure) and graphical trends (oxygen sensor oscillation,
                  coolant warm‑up).
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Evaluating Diagnostic Data:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Retrieve DTCs (e.g., P0420 catalytic converter efficiency). Assess live data (fuel trims,
                  coolant temp). Clear codes after repair and verify.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Circuit Insight
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
                  <span>Logic Gates</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Oscillator Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Sensor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Diagnostic Tools</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Constructing circuits requires careful component selection, diagram reading,
                prototyping on breadboard, and final PCB assembly. Transistor switches use a
                small base current to control a larger collector current. Darlington pairs
                provide very high current gain. Oscillators generate periodic waveforms —
                astable, monostable, bistable, and Schmitt trigger. Digital circuits use logic
                gates (NOT, AND, OR, NAND, NOR, XOR, XNOR) based on Boolean algebra. PCM
                digitises analog signals. Microprocessors and multiplexing enable complex
                digital systems. Sensors (temperature, position, gas, knock) and actuators
                (solenoids, motors) are essential in automotive systems. Diagnostic tools
                include oscilloscopes, engine analysers, and OBD‑II scanners.
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
                <strong className="text-white">Constructing Circuits</strong> – Gather components,
                read diagrams, prototype on breadboard, transfer to PCB, and test. Inspect against
                industry standards (IPC-A-600, IEC 61131, ISO 9001).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transistor as Switch</strong> – NPN transistor controls
                load with small base current. ON when base current flows, OFF when no base current.
                Darlington pair provides very high current gain (β≥1000).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Switching Circuits</strong> – Mechanical, solid‑state,
                and relay‑based switches. Used in digital logic, amplifiers, motor control, PWM,
                and home automation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Oscillators</strong> – Generate periodic waveforms.
                Types: astable (free‑running), monostable (one‑shot), bistable (flip‑flop), and
                Schmitt trigger (noise filtering).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Digital Circuits &amp; Logic</strong> – Logic gates
                (NOT, AND, OR, NAND, NOR, XOR, XNOR) implement Boolean algebra. Combinational and
                sequential circuits form the basis of computers and digital systems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">PCM, Microprocessors &amp; Multiplexing</strong> – PCM
                digitises analog signals. Microprocessors are the central processing unit. Multiplexing
                combines multiple signals into one data stream.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sensors, Actuators &amp; Diagnostics</strong> – Sensors
                detect physical quantities; actuators convert energy to motion. Diagnostic tools
                include oscilloscopes, engine analysers, and OBD‑II scanners to interpret signals
                and evaluate data.
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
            Sidemann Academic Registry • Construct Electronic Circuits — LO3
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
