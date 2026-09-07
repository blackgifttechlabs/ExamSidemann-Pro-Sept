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
  Grid,
  ToggleLeft,
} from 'lucide-react';

// ─── Standard component symbols and semiconductor diagrams ──────────────────
const DiodeSymbol = () => (
  <svg viewBox="0 0 120 70" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="PN junction diode symbol with anode and cathode labelled">
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 32h31M81 32h31"/><path d="M39 14v36l42-18zM81 14v36"/></g>
    <text x="28" y="61" fontSize="9" fill="currentColor">A (P)</text><text x="79" y="61" fontSize="9" fill="currentColor">K (N)</text>
  </svg>
);

const LightEmittingDiodeSymbol = () => (
  <svg viewBox="0 0 130 76" className="mx-auto h-auto w-full max-w-[160px]" role="img" aria-label="Light emitting diode circuit symbol with outward light arrows">
    <defs><marker id="led-light-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0l5 2.5L0 5z" fill="#f59e0b"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 40h31M81 40h30"/><path d="M39 22v36l42-18zM81 22v36"/></g>
    <g stroke="#f59e0b" strokeWidth="2" markerEnd="url(#led-light-arrow)"><path d="M82 23l18-15"/><path d="M91 31l22-18"/></g>
    <text x="60" y="71" textAnchor="middle" fontSize="10" fill="currentColor">LED: arrows point outward</text>
  </svg>
);

const NpnTransistorSymbol = () => (
  <svg viewBox="0 0 120 100" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="NPN transistor symbol with emitter arrow pointing out">
    <defs><marker id="npn-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 50h39M47 25v50M47 34l29-20h24M47 66l29 20h24"/><path d="M60 75l13 9" markerEnd="url(#npn-arrow)"/></g>
    <text x="12" y="44" fontSize="9" fill="currentColor">B</text><text x="102" y="17" fontSize="9" fill="currentColor">C</text><text x="102" y="90" fontSize="9" fill="currentColor">E</text><text x="60" y="98" textAnchor="middle" fontSize="9" fill="currentColor">NPN: arrow Not Pointing iN</text>
  </svg>
);

const PnpTransistorSymbol = () => (
  <svg viewBox="0 0 120 100" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="PNP transistor symbol with emitter arrow pointing in">
    <defs><marker id="pnp-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 50h39M47 25v50M47 34l29-20h24M47 66l29 20h24"/><path d="M73 84L60 75" markerEnd="url(#pnp-arrow)"/></g>
    <text x="12" y="44" fontSize="9" fill="currentColor">B</text><text x="102" y="17" fontSize="9" fill="currentColor">C</text><text x="102" y="90" fontSize="9" fill="currentColor">E</text><text x="60" y="98" textAnchor="middle" fontSize="9" fill="currentColor">PNP: arrow Points iN</text>
  </svg>
);

const JfetSymbol = () => (
  <svg viewBox="0 0 120 100" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="N-channel JFET symbol with gate, drain and source">
    <defs><marker id="jfet-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M72 12v20M72 32v36M72 68v20M20 50h34"/><path d="M54 50h13" markerEnd="url(#jfet-arrow)"/></g>
    <text x="78" y="17" fontSize="9" fill="currentColor">D</text><text x="78" y="90" fontSize="9" fill="currentColor">S</text><text x="21" y="44" fontSize="9" fill="currentColor">G</text><text x="60" y="98" textAnchor="middle" fontSize="9" fill="currentColor">n-channel JFET</text>
  </svg>
);

const DiagramFrame = ({ children, caption }: { children: React.ReactNode; caption: string }) => <figure className="my-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#161616]">{children}<figcaption className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">{caption}</figcaption></figure>;

const EnergyBandDiagram = () => <DiagramFrame caption="Allowed energy bands: a conductor has overlapping bands, a semiconductor has a small forbidden gap, and an insulator has a large gap."><svg viewBox="0 0 720 220" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Energy band diagrams for conductor semiconductor and insulator">
  {[110,360,610].map((x) => <line key={x} x1={x} y1="30" x2={x} y2="190" stroke="#cbd5e1" strokeWidth="1"/>)}
  <g fontSize="14" textAnchor="middle" fill="currentColor"><text x="110" y="20">CONDUCTOR</text><text x="360" y="20">SEMICONDUCTOR</text><text x="610" y="20">INSULATOR</text></g>
  <g stroke="#2563eb" strokeWidth="20"><path d="M35 86h150M285 56h150M535 45h150"/></g><g stroke="#f59e0b" strokeWidth="20"><path d="M35 99h150M285 137h150M535 157h150"/></g>
  <g fontSize="11" textAnchor="middle" fill="currentColor"><text x="110" y="81">overlapping</text><text x="110" y="105">bands</text><text x="360" y="101">small E<tspan baselineShift="sub">g</tspan> ≈ 1.1 eV (Si)</text><text x="610" y="106">large forbidden gap</text></g>
  <g stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4"><path d="M285 86h150M535 95h150"/></g>
</svg></DiagramFrame>;

const DopingDiagram = () => <DiagramFrame caption="Carrier balance: intrinsic silicon creates electron–hole pairs in equal numbers; donor doping adds majority electrons (N-type), while acceptor doping creates majority holes (P-type)."><svg viewBox="0 0 720 230" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Intrinsic N type and P type semiconductor carrier comparison">
  {[20,260,500].map((x)=><rect key={x} x={x} y="38" width="200" height="160" rx="12" fill="#f8fafc" stroke="#64748b" strokeWidth="1.7"/>)}<g fontSize="14" fontWeight="700" textAnchor="middle" fill="currentColor"><text x="120" y="25">INTRINSIC Si</text><text x="360" y="25">N-TYPE</text><text x="600" y="25">P-TYPE</text></g>
  {[70,120,170].flatMap((x)=>[80,130,180].map((y)=><circle key={`i-${x}-${y}`} cx={x} cy={y} r="15" fill="#dbeafe" stroke="#2563eb"/>))}{[310,360,410].flatMap((x)=>[80,130,180].map((y)=><circle key={`n-${x}-${y}`} cx={x} cy={y} r="15" fill="#dbeafe" stroke="#2563eb"/>))}{[550,600,650].flatMap((x)=>[80,130,180].map((y)=><circle key={`p-${x}-${y}`} cx={x} cy={y} r="15" fill="#dbeafe" stroke="#2563eb"/>))}
  <circle cx="360" cy="130" r="15" fill="#dcfce7" stroke="#16a34a"/><text x="360" y="135" textAnchor="middle" fontSize="10" fill="#166534">P</text><text x="440" y="112" fontSize="23" fill="#2563eb">e⁻</text><circle cx="600" cy="130" r="15" fill="#fee2e2" stroke="#dc2626"/><text x="600" y="135" textAnchor="middle" fontSize="10" fill="#991b1b">B</text><text x="673" y="112" fontSize="22" fill="#dc2626">h⁺</text><text x="120" y="220" textAnchor="middle" fontSize="11" fill="currentColor">electrons = holes</text><text x="360" y="220" textAnchor="middle" fontSize="11" fill="currentColor">donor → extra electron</text><text x="600" y="220" textAnchor="middle" fontSize="11" fill="currentColor">acceptor → hole</text>
</svg></DiagramFrame>;

const PnJunctionDiagram = () => <DiagramFrame caption="At equilibrium, diffusion leaves fixed ions in the depletion region. The built-in electric field points from positive donor ions on the N side toward negative acceptor ions on the P side."><svg viewBox="0 0 720 230" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Unbiased PN junction showing depletion region fixed ions and electric field">
  <defs><marker id="field-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0l7 3.5L0 7z" fill="#dc2626"/></marker></defs><rect x="50" y="45" width="310" height="140" fill="#fecdd3"/><rect x="360" y="45" width="310" height="140" fill="#bfdbfe"/><rect x="310" y="45" width="100" height="140" fill="#f8fafc" opacity=".92" stroke="#64748b" strokeDasharray="4 3"/>
  <g fontSize="16" fontWeight="700" textAnchor="middle" fill="currentColor"><text x="180" y="35">P-type: holes majority</text><text x="540" y="35">N-type: electrons majority</text><text x="360" y="210">depletion region</text></g>
  {[325,345].map((x) => [75,105,135,165].map((y) => <text key={`${x}-${y}`} x={x} y={y} fill="#2563eb" fontWeight="700">−</text>))}{[375,395].map((x) => [75,105,135,165].map((y) => <text key={`${x}-${y}`} x={x} y={y} fill="#dc2626" fontWeight="700">+</text>))}
  <path d="M430 115H290" stroke="#dc2626" strokeWidth="3" markerEnd="url(#field-arrow)"/><text x="360" y="103" textAnchor="middle" fontSize="12" fill="#dc2626">built-in E field</text>
</svg></DiagramFrame>;

const BiasDiagram = () => <DiagramFrame caption="Forward bias reduces and narrows the barrier; reverse bias increases and widens it. Conventional current flows from P to N only in forward bias."><svg viewBox="0 0 720 230" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Forward and reverse biased PN junction comparison">
  <g fontSize="15" fontWeight="700" textAnchor="middle" fill="currentColor"><text x="180" y="25">FORWARD BIAS</text><text x="540" y="25">REVERSE BIAS</text></g>
  <g stroke="currentColor" strokeWidth="2" fill="none"><path d="M35 115h45M280 115h45M395 115h45M640 115h45"/><path d="M35 115v70h290v-70M395 115v70h290v-70"/></g>
  <rect x="80" y="65" width="92" height="100" fill="#fecdd3"/><rect x="188" y="65" width="92" height="100" fill="#bfdbfe"/><rect x="172" y="65" width="16" height="100" fill="#f8fafc" stroke="#64748b"/>
  <rect x="440" y="65" width="70" height="100" fill="#fecdd3"/><rect x="570" y="65" width="70" height="100" fill="#bfdbfe"/><rect x="510" y="65" width="60" height="100" fill="#f8fafc" stroke="#64748b"/>
  <g fontSize="13" fontWeight="700" textAnchor="middle"><text x="126" y="120" fill="#be123c">P</text><text x="234" y="120" fill="#1d4ed8">N</text><text x="475" y="120" fill="#be123c">P</text><text x="605" y="120" fill="#1d4ed8">N</text></g>
  <g fontSize="13" fontWeight="700"><text x="29" y="111" fill="#dc2626">+</text><text x="325" y="111" fill="#2563eb">−</text><text x="389" y="111" fill="#2563eb">−</text><text x="685" y="111" fill="#dc2626">+</text></g><text x="180" y="214" textAnchor="middle" fontSize="12" fill="#16a34a">narrow barrier → current</text><text x="540" y="214" textAnchor="middle" fontSize="12" fill="#dc2626">wide barrier → leakage only</text>
</svg></DiagramFrame>;

const DiodeIvDiagram = () => <DiagramFrame caption="Representative silicon diode I–V curve (not to scale): exponential forward current after the knee, tiny reverse leakage, then breakdown at −VBR."><svg viewBox="0 0 720 300" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Silicon diode current voltage characteristic curve">
  <defs><marker id="axis-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0l7 3.5L0 7z" fill="currentColor"/></marker></defs><g stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#axis-arrow)"><path d="M50 150h630"/><path d="M390 270V25"/></g>
  <path d="M390 150c65 0 88-5 104-28 18-26 24-61 31-96M390 150c-90 2-165 3-245 5-16 1-20 32-23 112" fill="none" stroke="#7c3aed" strokeWidth="4"/>
  <path d="M486 140v20M122 140v20" stroke="#64748b" strokeWidth="1.5"/><g fontSize="12" fill="currentColor"><text x="686" y="143">V</text><text x="400" y="24">I</text><text x="470" y="177">≈0.7 V knee</text><text x="82" y="177">−V<tspan baselineShift="sub">BR</tspan></text><text x="170" y="145">reverse leakage</text><text x="515" y="54">forward conduction</text><text x="70" y="260">breakdown</text></g>
</svg></DiagramFrame>;

const BridgeRectifierDiagram = () => <DiagramFrame caption="Full-wave bridge rectifier: alternate diode pairs conduct on opposite half-cycles, keeping load current in the same direction."><svg viewBox="0 0 720 300" className="mx-auto h-auto w-full max-w-[760px]" role="img" aria-label="Full wave bridge rectifier with four diodes and load across the DC output">
  <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M85 150h115l120-90 120 90-120 90-120-90M440 150h115M320 60h250v38M320 240h250v-38"/><rect x="545" y="98" width="50" height="104"/></g>
  {[[260,105,-37],[380,105,-143],[260,195,-143],[380,195,-37]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`} stroke="#2563eb" strokeWidth="2" fill="none"><path d="M-18 0h10M8 0h10M-8-10v20L8 0zM8-10v20"/></g>)}
  <g fontSize="12" fill="currentColor"><text x="62" y="143">AC</text><text x="558" y="143">AC</text><text x="332" y="53">+ DC</text><text x="332" y="257">− DC</text><text x="620" y="145">LOAD R<tspan baselineShift="sub">L</tspan></text></g><path d="M610 112v68" stroke="#dc2626" strokeWidth="2"/><path d="M605 176l5 8 5-8" fill="#dc2626"/>
</svg></DiagramFrame>;

const COMPONENT_IMAGE_ROOT = '/images/courses/nc-auto/electrical-electronics-fundamentals';
const ComponentPhoto = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#161616]"><img src={`${COMPONENT_IMAGE_ROOT}/${src}`} alt={alt} loading="lazy" decoding="async" className="h-56 w-full bg-white object-contain p-3"/><figcaption className="border-t border-slate-200 px-3 py-2 text-center text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">{caption}</figcaption></figure>;

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
  { id: 'band-theory', label: 'Energy Band Theory' },
  { id: 'intrinsic-extrinsic', label: 'Intrinsic & Extrinsic' },
  { id: 'pn-junction', label: 'PN Junction' },
  { id: 'biasing', label: 'Forward & Reverse Bias' },
  { id: 'diode-characteristics', label: 'Diode I‑V Characteristics' },
  { id: 'rectification', label: 'Rectification' },
  { id: 'optoelectronic', label: 'Opto‑Electronic Devices' },
  { id: 'bjt', label: 'Bipolar Transistors' },
  { id: 'fet', label: 'Unipolar Transistors' },
  { id: 'ics', label: 'Integrated Circuits' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'The Shockley diode equation describes the current‑voltage characteristic of a diode: I = Iₛ(e^(V/Vₜ) − 1). It was developed by William Shockley, one of the inventors of the transistor.',
      },
      {
        title: 'Pro Tip',
        text: 'When testing a diode with a multimeter, forward bias should show about 0.6‑0.7V for silicon, and reverse bias should show OL (over limit) or a very high resistance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three regions of a MOSFET: Ohmic (linear), Active (saturation), and Cutoff. Think "O‑A‑C" for the three operating modes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners confuse NPN and PNP transistors — remember: NPN turns ON when the base is positive relative to the emitter (V_BE ≈ +0.7V), while PNP turns ON when the base is negative (V_BE ≈ -0.7V).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Shockley diode equation describes the current‑voltage characteristic of a diode: I = Iₛ(e^(V/Vₜ) − 1). It was developed by William Shockley, one of the inventors of the transistor.',
      },
      {
        title: 'Pro Tip',
        text: 'When testing a diode with a multimeter, forward bias should show about 0.6‑0.7V for silicon, and reverse bias should show OL (over limit) or a very high resistance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three regions of a MOSFET: Ohmic (linear), Active (saturation), and Cutoff. Think "O‑A‑C" for the three operating modes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners confuse NPN and PNP transistors — remember: NPN turns ON when the base is positive relative to the emitter (V_BE ≈ +0.7V), while PNP turns ON when the base is negative (V_BE ≈ -0.7V).',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Zap size={14} className="inline mr-1" /> ELECTRICAL & ELECTRONICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Semiconductor{' '}
            <span className="text-sky-300 font-bold italic">
              Physics &amp; Devices
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Energy band theory, PN junctions, diodes, rectification, transistors, optoelectronics,
            and integrated circuits.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> Band Theory
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> PN Junction
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Radio size={14} className="inline mr-1" /> Transistors &amp; ICs
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
                placeholder="Search for diodes, transistors, FETs, rectifiers..."
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
            {/* SECTION 1: Energy Band Theory */}
            <div
              ref={(el) => {
                sectionRefs.current['band-theory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conduction in Electronic Materials: Energy Band Theory
              </h2>
              <EnergyBandDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  In electronic materials, conduction is explained using energy band theory, which
                  describes how electrons behave in different energy levels. The two main bands are:
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>
                    <strong>Valence Band (VB):</strong> Contains electrons that are bound to atoms and
                    do not contribute to conduction.
                  </li>
                  <li>
                    <strong>Conduction Band (CB):</strong> Contains free electrons that can move and
                    conduct electricity.
                  </li>
                  <li>
                    <strong>Band Gap (Eg):</strong> The energy gap between the valence and conduction
                    bands. If electrons gain enough energy to jump from the VB to the CB, conduction
                    occurs.
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Intrinsic and Extrinsic */}
            <div
              ref={(el) => {
                sectionRefs.current['intrinsic-extrinsic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Intrinsic and Extrinsic Conduction
              </h2>
              <DopingDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Intrinsic Conduction</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Occurs in pure semiconductors (e.g., silicon, germanium).</li>
                  <li>At room temperature or higher, some electrons in the valence band absorb thermal energy and jump to the conduction band, creating electron-hole pairs.</li>
                  <li>The number of free electrons equals the number of holes.</li>
                  <li>Conductivity depends on temperature and the material's intrinsic properties.</li>
                </ul>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Extrinsic Conduction</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Occurs in doped semiconductors, where impurities are added to increase conductivity.</li>
                  <li>Two types:
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>n-type semiconductor:</strong> Doped with a pentavalent element (e.g., phosphorus in silicon), providing extra electrons. Majority carriers = electrons.</li>
                      <li><strong>p-type semiconductor:</strong> Doped with a trivalent element (e.g., boron in silicon), creating extra holes. Majority carriers = holes.</li>
                    </ul>
                  </li>
                  <li>Conductivity is much higher than intrinsic semiconductors.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Thermometer size={16} /> Effect of Thermal Agitation and Light on Conductivity
                </h3>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-2">Effect of Thermal Agitation</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>As temperature increases, more electrons gain energy to cross the band gap, increasing conductivity.</li>
                  <li>In intrinsic semiconductors, higher temperatures generate more electron-hole pairs.</li>
                  <li>In extrinsic semiconductors, too much heat can ionize dopant atoms, potentially reducing controlled conductivity.</li>
                </ul>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Effect of Light (Photoexcitation)</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Photoconductivity:</strong> When light with energy equal to or greater than the band gap hits a semiconductor, electrons absorb photons and jump to the conduction band.</li>
                  <li>This principle is used in photoresistors, solar cells, and photodiodes.</li>
                  <li>More light → More free electrons and holes → Increased conductivity.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: PN Junction */}
            <div
              ref={(el) => {
                sectionRefs.current['pn-junction'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Formation of a PN Junction
              </h2>
              <PnJunctionDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A PN junction is formed when a p-type semiconductor and an n-type semiconductor are
                  joined together. This junction is the basic structure of diodes, transistors, and many
                  other semiconductor devices.
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Step-by-Step Formation:</p>
                <ol className="list-decimal pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Bringing P-type and N-type together</strong> – Electrons diffuse from n-region to p-region, holes diffuse from p-region to n-region.</li>
                  <li><strong>Formation of the Depletion Region</strong> – Recombination leaves immobile ions, creating a zone with no free charge carriers.</li>
                  <li><strong>Formation of the Built-in Electric Field</strong> – Immobile ions create an electric field from n-side to p-side, preventing further diffusion.</li>
                  <li><strong>Equilibrium Condition</strong> – Diffusion is balanced by the electric field, resulting in a stable built-in potential (≈0.7V for Si, 0.3V for Ge).</li>
                </ol>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example Applications:</strong> Diodes (one‑way current), Solar cells (light to electricity).
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Formation of Potential Barrier and Depletion Layer in an Unbiased PN Junction
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Depletion Layer:</strong> Region around the junction with no free carriers, only fixed ions.</li>
                  <li><strong>Potential Barrier:</strong> Electric potential that prevents further movement of carriers (≈0.7V for Si, 0.3V for Ge).</li>
                  <li>Thickness depends on doping – higher doping = thinner depletion layer.</li>
                  <li>Higher temperature increases carrier generation, slightly reducing the barrier.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Biasing */}
            <div
              ref={(el) => {
                sectionRefs.current['biasing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Forward and Reverse Biasing of a PN Junction
              </h2>
              <BiasDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Forward Bias:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">P-side to positive, N-side to negative.</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Depletion region narrows, barrier potential reduces → large current flows.</li>
                  <li>Used in LEDs, rectifiers, voltage regulators.</li>
                </ul>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Reverse Bias:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">P-side to negative, N-side to positive.</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Depletion region widens, barrier potential increases → almost no current (only tiny leakage current).</li>
                  <li>Used in Zener diodes, photodiodes, protection circuits.</li>
                </ul>
                <div className="flex flex-wrap justify-center gap-8 mt-4">
                  <div className="text-center"><DiodeSymbol /><p className="text-sm">Diode symbol</p></div>
                  <div className="text-center"><LightEmittingDiodeSymbol /><p className="text-sm">LED symbol</p></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Zap size={16} /> Effect of Minority Charge Carriers on Blocking Current in Reverse Bias
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Minority carriers (electrons in P‑region, holes in N‑region) exist due to thermal excitation.</li>
                  <li>In reverse bias, these minority carriers move towards the terminals, creating a small reverse saturation current (I<sub>s</sub>).</li>
                  <li>Temperature increases minority carriers → higher leakage current.</li>
                  <li>At very high reverse voltage: Zener breakdown (heavily doped, low voltage) or Avalanche breakdown (lightly doped, high voltage).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Thermometer size={16} /> Effect of Temperature on Forward and Reverse Current
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Forward bias:</strong> Temperature increases forward current (more carriers) and reduces threshold voltage (≈ -2.5mV/°C for Si).</li>
                  <li><strong>Reverse bias:</strong> Temperature increases reverse leakage current (doubles every 10°C for Si).</li>
                  <li>High temperature can lead to thermal runaway and diode failure.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Zener and Avalanche Effects
                </h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Feature', 'Zener Breakdown', 'Avalanche Breakdown']}
                  rows={[
                    ['Doping Level', 'Highly doped', 'Lightly doped'],
                    ['Depletion Layer', 'Narrow', 'Wide'],
                    ['Voltage Range', 'Low (2V–5V)', 'High (6V–50V)'],
                    ['Cause', 'Strong electric field pulls electrons', 'Impact ionization (carrier collisions)'],
                    ['Application', 'Voltage regulation (Zener diodes)', 'High‑voltage protection'],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 5: Diode I-V Characteristics */}
            <div
              ref={(el) => {
                sectionRefs.current['diode-characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Current‑Voltage (I‑V) Characteristics of a Diode
              </h2>
              <DiodeIvDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">The I‑V curve of a diode has three regions:</p>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Forward Bias Region:</strong> Current increases exponentially after threshold voltage (≈0.7V for Si).</li>
                  <li><strong>Reverse Bias Region:</strong> Very small reverse saturation current (I<sub>s</sub>).</li>
                  <li><strong>Breakdown Region:</strong> Large reverse current after breakdown voltage (V<sub>br</sub>).</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Testing:</strong> Use variable DC supply, resistor, ammeter, and voltmeter. In forward bias,
                  measure voltage across diode and current; in reverse bias, reverse the diode connections.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Thermometer size={16} /> Effect of Temperature on Static Characteristics
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Forward voltage (V<sub>f</sub>) decreases with temperature (≈ -2.5 mV/°C).</li>
                  <li>Reverse saturation current (I<sub>s</sub>) increases exponentially (doubles every 10°C).</li>
                  <li>Reverse breakdown voltage (V<sub>br</sub>) decreases slightly.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Zap size={16} /> Power Dissipation and Maximum Ratings
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Power dissipation:</strong> P<sub>d</sub> = V<sub>f</sub> × I<sub>f</sub> (watts).</li>
                  <li><strong>Maximum forward voltage (V<sub>f_max</sub>):</strong> Highest safe forward voltage.</li>
                  <li><strong>Maximum forward current (I<sub>f_max</sub>):</strong> Highest safe forward current.</li>
                  <li><strong>Peak Inverse Voltage (PIV) or V<sub>R</sub>:</strong> Maximum reverse voltage without breakdown.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Layers size={16} /> Equivalent Models
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Ideal diode:</strong> Short circuit in forward bias, open circuit in reverse bias.</li>
                  <li><strong>Constant voltage drop model:</strong> Ideal diode + battery (V<sub>D</sub> = 0.7V for Si) in series with small resistance.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 6: Rectification */}
            <div
              ref={(el) => {
                sectionRefs.current['rectification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Rectification of Alternating Current (AC)
              </h2>
              <BridgeRectifierDiagram />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Half‑Wave Rectification:</strong> Single diode allows only one half‑cycle to pass.
                  Output is pulsating DC with gaps.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Full‑Wave Rectification (Bridge Rectifier):</strong> Four diodes convert both
                  half‑cycles to DC, producing smoother output.
                </p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Type', 'Number of Diodes', 'Efficiency', 'Ripple Factor']}
                  rows={[
                    ['Half‑Wave', '1', 'Low', 'High'],
                    ['Full‑Wave Bridge', '4', 'High', 'Low'],
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Diode Faults
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Open circuit:</strong> No current in either direction.</li>
                  <li><strong>Short circuit:</strong> Current flows both ways.</li>
                  <li><strong>Leakage current:</strong> Small reverse current (aging).</li>
                  <li><strong>Breakdown:</strong> Excessive reverse voltage destroys junction.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Testing Diodes with Multimeter:</strong> Forward bias → 0.6‑0.7V (Si), reverse bias → OL
                  (over limit). Open shows OL both ways, short shows 0V both ways.
                </p>
              </div>
            </div>

            {/* SECTION 7: Opto-Electronic Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['optoelectronic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Opto‑Electronic Devices
              </h2>
              <ComponentPhoto src="red-led.jpg" alt="Real red through-hole light emitting diode with epoxy lens and two leads" caption="Real through-hole LED. The longer lead is normally the anode; the flat rim and larger internal electrode identify the cathode." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Opto‑electronic devices convert electricity to light or light to electricity.
                </p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Device', 'Function', 'Working Principle', 'Applications']}
                  rows={[
                    ['LED', 'Emits visible/infrared light', 'Forward bias, electron‑hole recombination', 'Displays, indicators, lighting'],
                    ['Laser Diode', 'Emits coherent light beam', 'Forward bias with optical feedback', 'Fiber optics, barcode scanners, CD/DVD'],
                    ['Photodiode', 'Converts light to current', 'Reverse bias, light generates electron‑hole pairs', 'Light sensors, optical communication'],
                    ['Phototransistor', 'Light‑sensitive transistor', 'Light on base generates current', 'Remote control receivers, security systems'],
                    ['Optocoupler', 'Isolates circuits via light', 'LED + photodetector in one package', 'Power electronics, noise isolation'],
                    ['Solar Cell', 'Converts sunlight to DC power', 'Photovoltaic effect', 'Solar panels, calculators, spacecraft'],
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Eye size={16} /> Photoconductive Cell (LDR)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Construction:</strong> Cadmium sulfide (CdS) or cadmium selenide (CdSe) semiconductor with two electrodes.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Operation:</strong> Resistance decreases with increasing light (photoconductivity).</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Applications:</strong> Automatic streetlights, camera light meters, security alarms.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Eye size={16} /> Photodiode
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Construction:</strong> PN junction with a transparent window, operated in reverse bias.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Operation:</strong> Light generates electron‑hole pairs → increases reverse current.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Applications:</strong> Fiber optics, smoke detectors, medical instruments.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Light‑Emitting Diode (LED)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Construction:</strong> Gallium‑based materials (GaAs, GaN, GaP) in a transparent plastic dome.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Operation:</strong> Forward bias causes electron‑hole recombination, emitting photons. Color depends on bandgap energy.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Applications:</strong> Display screens, automotive lighting, optical communication.</p>
              </div>
            </div>

            {/* SECTION 8: Bipolar Junction Transistors */}
            <div
              ref={(el) => {
                sectionRefs.current['bjt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Bipolar Junction Transistors (BJTs)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A transistor is a semiconductor device used for amplification and switching. BJTs come in
                  two types: NPN and PNP.
                </p>
                <div className="flex flex-wrap justify-center gap-8 mt-4">
                  <div className="text-center"><NpnTransistorSymbol /><p className="text-sm">NPN</p></div>
                  <div className="text-center"><PnpTransistorSymbol /><p className="text-sm">PNP</p></div>
                </div>
                <ul className="list-disc pl-5 mt-4 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>NPN:</strong> Current flows from collector to emitter when base is positive. V<sub>BE</sub> ≈ +0.7V.</li>
                  <li><strong>PNP:</strong> Current flows from emitter to collector when base is negative. V<sub>BE</sub> ≈ -0.7V.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Grid size={16} /> Transistor Configurations
                </h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Configuration', 'Input', 'Output', 'Current Gain', 'Applications']}
                  rows={[
                    ['Common Base (CB)', 'Emitter‑Base', 'Collector‑Base', 'α < 1', 'High‑frequency amplifiers'],
                    ['Common Emitter (CE)', 'Base‑Emitter', 'Collector‑Emitter', 'β = 20‑200', 'General amplification'],
                    ['Common Collector (CC)', 'Base‑Collector', 'Emitter‑Collector', 'High current, low voltage', 'Impedance matching (buffer)'],
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Important Transistor Parameters
                </h3>
                <ul className="list-disc pl-5 mt-1 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Voltage gain (A<sub>v</sub>):</strong> A<sub>v</sub> = V<sub>out</sub> / V<sub>in</sub> (unitless).</li>
                  <li><strong>Current gain (β):</strong> β = I<sub>C</sub> / I<sub>B</sub> (20‑500).</li>
                  <li><strong>Current gain (α):</strong> α = I<sub>C</sub> / I<sub>E</sub> (≈0.95‑0.99). α = β / (β+1).</li>
                  <li><strong>Power gain:</strong> P<sub>gain</sub> = A<sub>v</sub> × β.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ToggleLeft size={16} /> Transistor Switching Circuits
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Transistor acts as a switch: <strong>Cutoff</strong> (OFF) and <strong>Saturation</strong> (ON).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Phototransistor:</strong> Light‑sensitive BJT. Light on base turns transistor ON.
                  Used in optical switching.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Darlington Pair:</strong> Two BJTs connected to achieve very high current gain
                  (β<sub>total</sub> = β<sub>1</sub> × β<sub>2</sub>). Used for high‑power switching.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Thyristor (SCR):</strong> Four‑layer PNPN device. Needs a gate pulse to turn ON
                  and stays ON until current drops to zero. Used in power control, dimmers.
                </p>
              </div>
            </div>

            {/* SECTION 9: Unipolar Transistors */}
            <div
              ref={(el) => {
                sectionRefs.current['fet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Unipolar Transistors (FETs)
              </h2>
              <ComponentPhoto src="power-mosfet.jpg" alt="Real three-terminal TO-220 power MOSFET package" caption="Real TO-220 power MOSFET package. Always confirm gate, drain and source from its datasheet because package pinouts vary." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Unipolar transistors use only one type of charge carrier (electrons or holes) and are
                  voltage‑controlled.
                </p>
                <div className="flex justify-center my-4"><JfetSymbol /></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>JFET (Junction Field‑Effect Transistor):</strong> N‑channel (electrons) or P‑channel
                  (holes). Operates in three regions: Ohmic, Active (Saturation), Cutoff. Used in low‑noise
                  amplifiers.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>MOSFET (Metal‑Oxide Semiconductor FET):</strong> Extremely high input impedance.
                  Two types: Enhancement (normally OFF) and Depletion (normally ON). Used in microprocessors,
                  power amplifiers, digital circuits.
                </p>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Feature', 'JFET', 'MOSFET']}
                  rows={[
                    ['Input Impedance', 'High', 'Very high'],
                    ['Power Consumption', 'Low', 'Lower'],
                    ['Speed', 'Moderate', 'Faster'],
                    ['Applications', 'Low‑noise amplifiers', 'Power circuits, ICs'],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 10: Integrated Circuits */}
            <div
              ref={(el) => {
                sectionRefs.current['ics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Integrated Circuits (ICs)
              </h2>
              <ComponentPhoto src="integrated-circuit-die.jpg" alt="Microscope photograph of an integrated circuit die showing patterned semiconductor structures" caption="A real integrated-circuit die. Its patterned layers implement many interconnected semiconductor devices on one substrate." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>What are ICs?</strong> Miniature electronic circuits where multiple components
                  (transistors, resistors, capacitors) are fabricated onto a single silicon chip. They
                  enable fast processing, compact size, and low power consumption.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Types:</strong> Analog ICs (signal processing, amplifiers), Digital ICs
                  (microprocessors, memory), Mixed‑Signal ICs (ADCs, DACs).
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Applications:</strong> Computers, smartphones, communication systems, automobiles
                  (ECUs), medical devices (pacemakers).
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
                  💡 Semiconductor Insight
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
                  <span>Semiconductor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Opto‑Electronic Devices</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Transistor Configurations</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>FET Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Energy band theory explains conduction — valence band, conduction band, and band gap.
                Intrinsic (pure) vs extrinsic (doped) semiconductors. PN junction forms depletion
                region and potential barrier. Forward bias reduces barrier (current flows); reverse
                bias increases barrier (current blocked). I‑V characteristics show exponential
                forward current, small reverse saturation, and breakdown. Rectification converts AC
                to DC. Opto‑electronic devices include LEDs, photodiodes, LDRs, solar cells. BJTs
                (NPN/PNP) amplify current; FETs (JFET/MOSFET) are voltage‑controlled. ICs integrate
                thousands of components on a single chip.
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
                <strong className="text-white">Energy Band Theory</strong> – Valence band (bound
                electrons), conduction band (free electrons), band gap (energy required for conduction).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Intrinsic &amp; Extrinsic</strong> – Intrinsic: pure
                semiconductors, electron‑hole pairs. Extrinsic: doped (n‑type with extra electrons,
                p‑type with extra holes). Thermal agitation and light affect conductivity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">PN Junction</strong> – Formed by joining p‑type and
                n‑type semiconductors. Depletion region and potential barrier (≈0.7V for Si).
                Forward bias → conduction; reverse bias → blocking (small leakage).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Diode I‑V Characteristics</strong> – Three regions:
                forward (exponential), reverse (saturation), breakdown. Models: ideal diode,
                constant voltage drop model.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Rectification</strong> – Half‑wave (one diode) and
                full‑wave bridge (four diodes) convert AC to DC. Diode faults: open, short, leakage,
                breakdown.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Opto‑Electronic Devices</strong> – LEDs, laser diodes,
                photodiodes, phototransistors, optocouplers, solar cells, LDRs. Convert electricity
                to light or light to electricity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transistors</strong> – BJTs (NPN/PNP) amplify current;
                configurations: CB, CE, CC. FETs (JFET/MOSFET) are voltage‑controlled. ICs integrate
                many components on a single chip.
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
            Sidemann Academic Registry • Semiconductor Physics &amp; Devices — LO2
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
