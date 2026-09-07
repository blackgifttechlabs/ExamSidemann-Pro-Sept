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
} from 'lucide-react';

// ─── Accurate IEC-style symbols and physical construction diagrams ──────────
const FixedResistorSymbol = () => (
  <svg viewBox="0 0 120 72" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="IEC fixed resistor circuit symbol">
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 32h24M88 32h24"/><rect x="32" y="22" width="56" height="20" rx="1"/>
    </g>
    <text x="60" y="62" textAnchor="middle" fontSize="10" fill="currentColor">IEC fixed resistor</text>
  </svg>
);

const WirewoundResistorSymbol = () => (
  <svg viewBox="0 0 120 72" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Wire-wound resistor construction">
    <path d="M7 32h20M93 32h20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <rect x="27" y="20" width="66" height="24" rx="11" fill="#e2e8f0" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M33 22l8 20 8-20 8 20 8-20 8 20 8-20 7 18" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinejoin="round"/>
    <text x="60" y="62" textAnchor="middle" fontSize="10" fill="currentColor">resistance wire on ceramic</text>
  </svg>
);

const VariableLinearSymbol = () => (
  <svg viewBox="0 0 120 78" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Linear potentiometer circuit symbol">
    <defs><marker id="pot-linear-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 37h23M89 37h23"/><rect x="31" y="27" width="58" height="20"/><path d="M60 8v14"/><path d="M60 22v10" markerEnd="url(#pot-linear-arrow)"/>
    </g>
    <text x="60" y="68" textAnchor="middle" fontSize="10" fill="currentColor">linear potentiometer</text>
  </svg>
);

const VariableLogSymbol = () => (
  <svg viewBox="0 0 120 78" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Logarithmic potentiometer circuit symbol">
    <defs><marker id="pot-log-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 37h23M89 37h23"/><rect x="31" y="27" width="58" height="20"/><path d="M60 8v24" markerEnd="url(#pot-log-arrow)"/>
    </g>
    <path d="M76 20c7 0 11-4 11-10" fill="none" stroke="#7c3aed" strokeWidth="1.8"/>
    <text x="94" y="13" fontSize="8" fill="#7c3aed">LOG</text>
    <text x="60" y="68" textAnchor="middle" fontSize="10" fill="currentColor">logarithmic potentiometer</text>
  </svg>
);

const PresetResistorSymbol = () => (
  <svg viewBox="0 0 120 78" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Preset trimmer potentiometer circuit symbol">
    <defs><marker id="preset-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 39h23M89 39h23"/><rect x="31" y="29" width="58" height="20"/><path d="M60 9v25" markerEnd="url(#preset-arrow)"/><path d="M52 9h16"/>
    </g>
    <text x="60" y="69" textAnchor="middle" fontSize="10" fill="currentColor">preset / trimmer</text>
  </svg>
);

// Physical capacitor construction (not circuit symbols).
const PaperCapacitor = () => (
  <svg viewBox="0 0 150 96" className="mx-auto h-auto w-full max-w-[180px]" role="img" aria-label="Rolled paper capacitor cutaway">
    <path d="M8 48h25M117 48h25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <rect x="31" y="21" width="88" height="54" rx="8" fill="#f8fafc" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M75 28c23 0 34 6 34 20S98 68 75 68 41 62 41 48s11-20 34-20zm0 8c15 0 24 4 24 12S90 60 75 60s-24-4-24-12 9-12 24-12zm0 8c7 0 13 1 13 4s-6 4-13 4-13-1-13-4 6-4 13-4z" fill="none" stroke="#b45309" strokeWidth="2"/>
    <path d="M34 39h28M88 57h28" stroke="#64748b" strokeWidth="2"/>
    <text x="75" y="90" textAnchor="middle" fontSize="10" fill="currentColor">interleaved foil + waxed paper</text>
  </svg>
);

const MicaCapacitor = () => (
  <svg viewBox="0 0 150 96" className="mx-auto h-auto w-full max-w-[180px]" role="img" aria-label="Stacked silver-mica capacitor cutaway">
    <path d="M8 48h28M114 48h28" stroke="currentColor" strokeWidth="2.4"/>
    <rect x="34" y="20" width="82" height="56" rx="6" fill="#dbeafe" stroke="currentColor" strokeWidth="1.8"/>
    {[30, 38, 46, 54, 62].map((y, index) => <rect key={y} x={index % 2 ? 46 : 40} y={y} width="64" height="4" fill={index % 2 ? '#94a3b8' : '#f8fafc'} stroke="#475569" strokeWidth=".7"/>)}
    <path d="M36 33h12M102 41h12M36 49h12M102 57h12" stroke="#475569" strokeWidth="1.5"/>
    <text x="75" y="90" textAnchor="middle" fontSize="10" fill="currentColor">silver electrodes on mica sheets</text>
  </svg>
);

const CeramicCapacitor = () => (
  <svg viewBox="0 0 150 96" className="mx-auto h-auto w-full max-w-[180px]" role="img" aria-label="Ceramic disc capacitor">
    <path d="M55 65v23M95 65v23" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <circle cx="75" cy="42" r="28" fill="#f59e0b" stroke="#92400e" strokeWidth="2"/>
    <path d="M55 65c2-9 4-16 7-22M95 65c-2-9-4-16-7-22" fill="none" stroke="#92400e" strokeWidth="2"/>
    <text x="75" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#451a03">104</text>
    <text x="75" y="53" textAnchor="middle" fontSize="8" fill="#451a03">100 nF</text>
  </svg>
);

const PolyesterCapacitor = () => (
  <svg viewBox="0 0 150 96" className="mx-auto h-auto w-full max-w-[180px]" role="img" aria-label="Boxed polyester film capacitor">
    <path d="M51 67v21M99 67v21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <rect x="35" y="18" width="80" height="51" rx="5" fill="#fde68a" stroke="#92400e" strokeWidth="2"/>
    <path d="M43 25h64v36H43z" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
    <text x="75" y="40" textAnchor="middle" fontSize="11" fontWeight="700" fill="#451a03">100n J</text>
    <text x="75" y="54" textAnchor="middle" fontSize="8" fill="#451a03">polyester film</text>
  </svg>
);

const ElectrolyticCapacitor = () => (
  <svg viewBox="0 0 150 96" className="mx-auto h-auto w-full max-w-[180px]" role="img" aria-label="Polarized aluminium electrolytic capacitor">
    <path d="M52 70v18M98 70v18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <ellipse cx="75" cy="20" rx="33" ry="9" fill="#94a3b8" stroke="#334155" strokeWidth="1.7"/>
    <path d="M42 20v47c0 5 15 9 33 9s33-4 33-9V20" fill="#64748b" stroke="#334155" strokeWidth="1.7"/>
    <path d="M91 17v54" stroke="#e2e8f0" strokeWidth="10"/><path d="M91 26h7m-7 12h7m-7 12h7m-7 12h7" stroke="#475569" strokeWidth="1.3"/>
    <path d="M47 15h12M53 9v12" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
    <text x="67" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f8fafc">470 µF</text>
    <text x="67" y="59" textAnchor="middle" fontSize="8" fill="#f8fafc">25 V</text>
  </svg>
);

const VariableCapacitorSymbol = () => (
  <svg viewBox="0 0 120 72" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Variable capacitor circuit symbol">
    <defs><marker id="variable-cap-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M8 35h39M73 35h39"/><path d="M47 18v34M73 18v34"/><path d="M32 54L84 7" markerEnd="url(#variable-cap-arrow)"/>
    </g>
    <text x="60" y="68" textAnchor="middle" fontSize="10" fill="currentColor">variable capacitor</text>
  </svg>
);

const TrimmerCapacitorSymbol = () => (
  <svg viewBox="0 0 120 72" className="mx-auto h-auto w-full max-w-[150px]" role="img" aria-label="Preset trimmer capacitor circuit symbol">
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M8 35h39M73 35h39"/><path d="M47 18v34M73 18v34"/><path d="M33 54L82 9M76 4l12 11"/>
    </g>
    <text x="60" y="68" textAnchor="middle" fontSize="10" fill="currentColor">preset trimmer capacitor</text>
  </svg>
);

const CapacitorParallelDiagram = () => (
  <svg viewBox="0 0 180 108" className="mx-auto h-auto w-full max-w-[250px]" role="img" aria-label="Two capacitors correctly connected in parallel">
    <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M8 54h22M150 54h22M30 24v60M150 24v60"/>
      <path d="M30 32h48M102 32h48M78 20v24M102 20v24"/>
      <path d="M30 76h48M102 76h48M78 64v24M102 64v24"/>
    </g>
    <circle cx="30" cy="54" r="3.3" fill="currentColor"/><circle cx="150" cy="54" r="3.3" fill="currentColor"/>
    <text x="90" y="14" textAnchor="middle" fontSize="10" fill="currentColor">C₁</text><text x="90" y="104" textAnchor="middle" fontSize="10" fill="currentColor">C₂</text>
  </svg>
);

const CapacitorSeriesDiagram = () => (
  <svg viewBox="0 0 180 92" className="mx-auto h-auto w-full max-w-[250px]" role="img" aria-label="Two capacitors correctly connected in series">
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M8 46h38M62 46h48M126 46h46"/><path d="M46 25v42M62 25v42M110 25v42M126 25v42"/>
    </g>
    <text x="54" y="17" textAnchor="middle" fontSize="10" fill="currentColor">C₁</text><text x="118" y="17" textAnchor="middle" fontSize="10" fill="currentColor">C₂</text>
    <circle cx="86" cy="46" r="3.2" fill="currentColor"/><text x="86" y="82" textAnchor="middle" fontSize="9" fill="currentColor">single shared junction</text>
  </svg>
);

const CoilTurns = () => <path d="M23 46c0-17 12-17 12 0s12 17 12 0 12-17 12 0 12 17 12 0 12-17 12 0 12 17 12 0" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>;

const AirCoreInductor = () => (
  <svg viewBox="0 0 130 82" className="mx-auto h-auto w-full max-w-[170px]" role="img" aria-label="Air-core inductor with no magnetic core">
    <path d="M7 46h16M107 46h16" stroke="currentColor" strokeWidth="2.5"/><CoilTurns />
    <path d="M37 35h56" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3"/><text x="65" y="22" textAnchor="middle" fontSize="9" fill="currentColor">air (no core)</text>
    <text x="65" y="76" textAnchor="middle" fontSize="10" fill="currentColor">copper winding</text>
  </svg>
);

const IronCoreInductor = () => (
  <svg viewBox="0 0 130 82" className="mx-auto h-auto w-full max-w-[170px]" role="img" aria-label="Iron-core inductor construction">
    <path d="M7 46h16M107 46h16" stroke="currentColor" strokeWidth="2.5"/><rect x="28" y="32" width="74" height="13" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="1.5"/><CoilTurns />
    <text x="65" y="22" textAnchor="middle" fontSize="9" fill="currentColor">solid iron core</text><text x="65" y="76" textAnchor="middle" fontSize="10" fill="currentColor">low-frequency choke</text>
  </svg>
);

const FerriteCoreInductor = () => (
  <svg viewBox="0 0 130 82" className="mx-auto h-auto w-full max-w-[170px]" role="img" aria-label="Ferrite-core inductor construction">
    <path d="M7 46h16M107 46h16" stroke="currentColor" strokeWidth="2.5"/><rect x="28" y="32" width="74" height="13" rx="6" fill="#27272a" stroke="#09090b" strokeWidth="1.5"/><path d="M36 37h58" stroke="#71717a" strokeWidth="1" strokeDasharray="2 3"/><CoilTurns />
    <text x="65" y="22" textAnchor="middle" fontSize="9" fill="currentColor">ferrite rod core</text><text x="65" y="76" textAnchor="middle" fontSize="10" fill="currentColor">low-loss high-frequency core</text>
  </svg>
);

const LaminatedCoreInductor = () => (
  <svg viewBox="0 0 130 82" className="mx-auto h-auto w-full max-w-[170px]" role="img" aria-label="Laminated steel-core inductor construction">
    <path d="M7 46h16M107 46h16" stroke="currentColor" strokeWidth="2.5"/><rect x="28" y="29" width="74" height="17" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5"/><path d="M29 33h72M29 37h72M29 41h72" stroke="#64748b" strokeWidth="1"/><CoilTurns />
    <text x="65" y="20" textAnchor="middle" fontSize="9" fill="currentColor">insulated steel laminations</text><text x="65" y="76" textAnchor="middle" fontSize="10" fill="currentColor">reduced eddy-current loss</text>
  </svg>
);

const COMPONENT_IMAGE_ROOT = '/images/courses/nc-auto/electrical-electronics-fundamentals';
const ComponentPhoto = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#161616]">
    <img src={`${COMPONENT_IMAGE_ROOT}/${src}`} alt={alt} loading="lazy" decoding="async" className="h-52 w-full object-contain bg-white p-3" />
    <figcaption className="border-t border-slate-200 px-3 py-2 text-center text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">{caption}</figcaption>
  </figure>
);

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'resistors', label: 'Resistors' },
  { id: 'electrostatics', label: 'Electrostatics' },
  { id: 'capacitors', label: 'Capacitors' },
  { id: 'inductors', label: 'Inductors' },
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
        text: 'The first practical capacitor, the Leyden jar, was invented in 1745 by Pieter van Musschenbroek. It stored electric charge using a glass jar lined with metal foil.',
      },
      {
        title: 'Pro Tip',
        text: 'Always check the voltage rating of a capacitor before using it in a circuit – exceeding this rating can cause catastrophic failure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember resistor color code order: "Bright Bears Run Over Yellow Grass, Bringing Violet Grey Wool" – Black, Brown, Red, Orange, Yellow, Green, Blue, Violet, Grey, White.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners confuse inductance with resistance – inductance opposes changes in current, while resistance opposes steady current flow.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first practical capacitor, the Leyden jar, was invented in 1745 by Pieter van Musschenbroek. It stored electric charge using a glass jar lined with metal foil.',
      },
      {
        title: 'Pro Tip',
        text: 'Always check the voltage rating of a capacitor before using it in a circuit – exceeding this rating can cause catastrophic failure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember resistor color code order: "Bright Bears Run Over Yellow Grass, Bringing Violet Grey Wool" – Black, Brown, Red, Orange, Yellow, Green, Blue, Violet, Grey, White.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners confuse inductance with resistance – inductance opposes changes in current, while resistance opposes steady current flow.',
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

  // ─── Table helper ──────────────────────────────────────────────────────
  const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
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
                <td key={j} className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-mono text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Zap size={14} className="inline mr-1" /> ELECTRICAL & ELECTRONICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Electrical & Electronics{' '}
            <span className="text-emerald-300 font-bold italic">
              Fundamentals
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master passive components, resistors, capacitors, inductors, electrostatics, and circuit analysis.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> Passive Components
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CircuitBoard size={14} className="inline mr-1" /> Resistors & Capacitors
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Waves size={14} className="inline mr-1" /> Inductors
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
                placeholder="Search for resistors, capacitors, inductors..."
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
            {/* SECTION 1: Resistors */}
            <div
              ref={(el) => {
                sectionRefs.current['resistors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Resistors as Passive Components
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Electrical and Electronics Fundamentals refers to the basic principles and concepts that
                    govern the behaviour of electrical and electronic circuits and systems. It covers the
                    foundational knowledge needed to understand how electrical and electronic devices operate,
                    how they are constructed, and how they are applied.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Box size={16} /> Passive Components
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>Definition:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Passive components are electronic components that do not require an external power source to operate.</li>
                    <li>They cannot amplify or generate electrical signals. Instead, they either dissipate, store, or release energy.</li>
                  </ul>
                  <p><strong>Characteristics:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>They do not provide gain or amplification.</li>
                    <li>They can control the flow of current and voltage.</li>
                    <li>They can store or dissipate energy.</li>
                    <li>Examples include resistors, capacitors, and inductors.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Zap size={16} /> Resistors as Passive Components
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>Function:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Resistors oppose the flow of electrical current.</li>
                    <li>They convert electrical energy into heat, which is then dissipated, meaning it is released or dispersed into the surrounding environment, typically as thermal energy.</li>
                  </ul>
                  <p><strong>Why they are passive:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Resistors do not generate their own electrical signals.</li>
                    <li>They do not amplify or increase the power of a signal.</li>
                    <li>They simply resist the flow of current, causing a voltage drop and dissipating power as heat.</li>
                    <li>They do not require an external power source to function.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Symbols for the different types of resistors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <FixedResistorSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">i. Fixed Resistors - Carbon Composition/Metal Oxide</p>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">Carbon Composition/Metal Oxide: These resistors have a fixed resistance value determined by their material and construction. Carbon composition resistors use a mixture of carbon and a binder, while metal oxide resistors use a metal oxide film. They are commonly used for general-purpose applications.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <WirewoundResistorSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">ii. Wire-wound Resistors</p>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">These resistors are made by winding a resistive wire around a ceramic core. They are used for high-power applications and where precise resistance values are required.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <VariableLinearSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">iii. Variable Resistors - Linear</p>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">These resistors, also known as potentiometers, have a resistance value that can be adjusted mechanically. In a linear potentiometer, the resistance changes at a constant rate as you rotate the control knob. For example, if you turn the knob halfway, the resistance will be approximately half of the total resistance.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <VariableLogSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">iv. Variable Resistors - Logarithmic</p>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">These potentiometers also have an adjustable resistance, but the resistance change is logarithmic. The change in resistance is smaller at the beginning of the rotation and larger at the end. This means that the resistance increases (or decreases) exponentially as you turn the knob.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <PresetResistorSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">v. Preset Resistors</p>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">These are small variable resistors designed for infrequent adjustments, often during circuit calibration. They are typically mounted on a circuit board and adjusted with a screwdriver.</p>
                </div>
              </div>
              <ComponentPhoto src="resistors-array.jpg" alt="Assortment of axial lead resistors showing different body sizes and colour bands" caption="Real axial resistors: body size mainly reflects power rating; colour bands encode resistance and tolerance." />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Settings size={16} /> Resistor Specifications
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>i) Nominal Value (E12 Series):</strong> The nominal value is the intended or designated resistance of a resistor, measured in ohms (Ω).</p>
                  <p>E12 Series: This is a standard series of preferred resistor values. It provides a logarithmic progression of values within each decade (e.g., 10-100 Ω, 100-1000 Ω). The E12 series has 12 values per decade, which are: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82. To get other values you multiply those values by powers of 10. For example, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820. Symbol: Ω (Ohm)</p>
                  <p className="mt-2"><strong>ii) Power Rating:</strong> The power rating indicates the maximum amount of power (in watts, W) that a resistor can safely dissipate as heat without being damaged. Exceeding the power rating can lead to overheating and failure. Factors: The power rating depends on the resistor's size, material, and construction. Symbol: W (Watt)</p>
                  <p className="mt-2"><strong>iii) Stability:</strong> Stability refers to how much the resistance value of a resistor changes over time or with variations in temperature, voltage, or humidity. High stability means the resistance remains relatively constant under different operating conditions. Factors: Temperature Coefficient (ppm/°C), Voltage Coefficient (ppm/V), Long-term Stability. Units: ppm/°C, ppm/V.</p>
                  <p className="mt-2"><strong>iv) Tolerance:</strong> Tolerance specifies the permissible deviation of the actual resistance value from the nominal value. It is expressed as a percentage (%). A lower tolerance indicates a more precise resistor. Example: A 100 Ω resistor with a 5% tolerance could have an actual resistance value between 95 Ω and 105 Ω. Symbol: % (Percentage)</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Resistor Color Codes</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>What it is:</strong> Colored bands on resistors tell you their resistance value and how accurate it is (tolerance).</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>How it works:</strong> Each color stands for a number. You read the bands left to right.</p>
                <Table
                  headers={['Color', 'Number', 'Multiplier', 'Tolerance']}
                  rows={[
                    ['Black', '0', '1', '-'],
                    ['Brown', '1', '10', '±1%'],
                    ['Red', '2', '100', '±2%'],
                    ['Orange', '3', '1,000', '-'],
                    ['Yellow', '4', '10,000', '-'],
                    ['Green', '5', '100,000', '±0.5%'],
                    ['Blue', '6', '1,000,000', '±0.25%'],
                    ['Violet', '7', '10,000,000', '±0.1%'],
                    ['Grey', '8', '100,000,000', '-'],
                    ['White', '9', '1,000,000,000', '-'],
                    ['Gold', '-', '0.1', '±5%'],
                    ['Silver', '-', '0.01', '±10%'],
                  ]}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Example (4 bands):</strong> Red, Red, Orange, Gold = 22,000 ohms (22 kΩ), ±5% tolerance.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Printed Codes</strong></p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>What it is:</strong> Numbers printed on resistors, especially small ones.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>How it works:</strong> "103" = 10 x 10³ (10,000) ohms = 10 kΩ. The first two numbers are the significant digits, the third number is the number of zeros. "R" means a decimal point. Example: 4R7 = 4.7 ohms.</p>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Non-Linear Resistors</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Non-linear resistors are components where the resistance changes in a non-proportional way with variations in voltage, temperature, or light. This contrasts with linear resistors, which maintain a constant resistance.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>i) NTC and PTC Thermistors:</strong> Thermistors are temperature-sensitive resistors. NTC (Negative Temperature Coefficient): resistance decreases as temperature increases. Used for temperature sensing, temperature compensation, and inrush current limiting. PTC (Positive Temperature Coefficient): resistance increases as temperature increases. Used for overcurrent protection, self-regulating heaters, and temperature sensing. Applications: Temperature measurement in thermostats, appliances, and industrial processes; overheating protection in power supplies and electronic devices; inrush current limiting in power supplies to prevent damage during start-up.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>ii) Voltage Dependent Resistors (VDRs) or Varistors:</strong> Their resistance changes significantly with applied voltage. At low voltages, high resistance; at high voltages, resistance drops sharply. Used for surge protection. Applications: Protecting electronic circuits from voltage spikes and surges, such as those caused by lightning or power line fluctuations; used in power supplies, telecommunications equipment, and automotive electronics.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>iii) Light Dependent Resistors (LDRs) or Photoresistors:</strong> Their resistance changes with light intensity. In darkness, high resistance; in bright light, resistance decreases. Used for light sensing and control. Applications: Automatic lighting control (streetlights, security lights); light detection in cameras and light meters; alarm systems and optical switches.</p>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Resistor Faults</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>1. Open :</strong> Complete break, infinite resistance. Causes: overstress from excessive current or voltage, physical damage, thermal stress, manufacturing defects. Effects: circuit interrupted, current flow stops.</li>
                  <li><strong>2. Increased Resistance:</strong> Value increases beyond tolerance. Causes: overheating, aging, moisture ingress, damage from voltage surges. Effects: degraded performance, wrong voltage output.</li>
                  <li><strong>3. Decreased Resistance:</strong> Value decreases below tolerance. Rare, due to certain types of electrical overstress. Effects: increased current flow, potential damage to other components.</li>
                  <li><strong>4. Short :</strong> Resistance near zero. Causes: severe electrical overstress, physical damage. Effects: excessive current, damage, fire hazard.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Factors Contributing to Resistor Faults:</strong> Overheating (exceeding power rating), environmental factors (moisture, humidity, temperature variations), physical stress (impact, vibration), electrical stress (voltage surges, excessive current), manufacturing defects, aging.</p>
              </div>
            </div>

            {/* SECTION 2: Electrostatics */}
            <div
              ref={(el) => {
                sectionRefs.current['electrostatics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Electrostatic Principles
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>1. Electric Charge:</strong> Everything is made of atoms, which have positive (protons), negative (electrons), and neutral (neutrons) parts. Usually, things have the same number of positive and negative parts, so they are neutral. But sometimes electrons can move, making something have more or less negative charge. This imbalance creates an electric charge. Objects can become charged by rubbing them together (transferring electrons). Like charges repel, opposite charges attract. Charge measured in Coulombs (C).</p>
                  <p className="mt-2"><strong>2. Coulomb's Law:</strong> F = k * (q1 * q2) / r², where k = 8.99×10⁹ N m²/C². Force is directly proportional to product of charges, inversely proportional to square of distance. If you double one charge, force doubles; if you double distance, force becomes one quarter.</p>
                  <p className="mt-2"><strong>3. Electric Fields:</strong> Region around a charged object where another charged object feels a force. Field lines go from positive to negative. Strength shown by line density. Electric field E = F/q. Direction is the force on a positive test charge.</p>
                  <p className="mt-2"><strong>4. Electric Potential (Voltage):</strong> Energy needed to move a charge in an electric field. Measured in volts (V). Voltage between two points is difference in electric potential (energy per unit charge).</p>
                  <p className="mt-2"><strong>5. Static Electricity:</strong> Buildup of charge on a surface (e.g., rubbing). Sudden discharge is electrostatic discharge (ESD). One object gains positive charge, the other negative.</p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Capacitors */}
            <div
              ref={(el) => {
                sectionRefs.current['capacitors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Capacitor Construction
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Capacitors store electrical energy in an electric field. They consist of two conductive plates separated by an insulating material called a dielectric.</p>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Fixed Capacitors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <PaperCapacitor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Paper Capacitors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Thin sheets of metal foil separated by waxed paper, rolled. Characteristics: Inexpensive, moderate tolerance, older technology. Non-polarized.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <MicaCapacitor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Mica Capacitors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Thin mica sheets sandwiched between metal foil. Characteristics: High stability, low losses, high precision, used in high-frequency. Non-polarized.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <CeramicCapacitor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Ceramic Capacitors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Ceramic dielectric coated with metal electrodes. Characteristics: Wide range, small size, inexpensive and non-polarized.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <PolyesterCapacitor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Polyester Capacitors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Polyester film between metal foil, rolled or stacked. Characteristics: Good stability, high insulation resistance, wide temperature range. Non-polarized.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <ElectrolyticCapacitor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Electrolytic Capacitors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Metal foil and electrolyte, oxide layer dielectric. Characteristics: High capacitance in small size, polarized. Types: Aluminum, tantalum.</p>
                </div>
              </div>
              <ComponentPhoto src="ceramic-capacitor.jpg" alt="Real orange ceramic disc capacitor with two radial leads" caption="A real ceramic disc capacitor. Its short radial leads and printed value code distinguish it from a polarized electrolytic capacitor." />

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Variable Capacitors (Air Capacitors)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <VariableCapacitorSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Variable Capacitors (Air Capacitors)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Construction: Two sets of plates (stator and rotor), air dielectric. Capacitance varied by rotating rotor. Used in radio tuning circuits. Non-polarized.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <TrimmerCapacitorSymbol />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Pre-set Capacitors (Trimmer Capacitors)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Small variable capacitors for infrequent adjustments, often ceramic or mica dielectrics. Used for fine-tuning circuits. Non-polarized.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Factors Determining Capacitance
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>1. Plate Area:</strong> Bigger plates → more capacitance (like a bigger bucket).</li>
                  <li><strong>2. Distance Between Plates:</strong> Smaller distance → more capacitance (stronger electric field).</li>
                  <li><strong>3. Dielectric Material:</strong> Higher dielectric constant → more capacitance.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">How to calculate capacitance variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <CapacitorParallelDiagram />
                  <p className="mt-2 font-bold text-slate-800 dark:text-slate-200">Capacitors in Parallel</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Formula: C<sub>t</sub> = C₁ + C₂ + ... + C<sub>n</sub></p>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">Example: 10µF + 20µF = 30µF</p>
                  <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">When capacitors are connected in parallel, they effectively increase total plate area, increasing total capacitance. Just add the values.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <CapacitorSeriesDiagram />
                  <p className="mt-2 font-bold text-slate-800 dark:text-slate-200">Capacitors in Series</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Formula: 1/C<sub>t</sub> = 1/C₁ + 1/C₂ + ... + 1/C<sub>n</sub></p>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">Example: (10µF × 20µF)/(10µF+20µF) = 6.67µF</p>
                  <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">When capacitors are connected in series, they effectively increase distance between plates, decreasing total capacitance. Use reciprocal formula.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Capacitor specifications</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>1. Capacitance (C):</strong> Ability to store charge (Farads, µF, nF, pF).</li>
                  <li><strong>2. Voltage Rating (WVDC or VDC):</strong> Maximum safe DC voltage.</li>
                  <li><strong>3. Tolerance:</strong> Permissible deviation (%).</li>
                  <li><strong>4. Temperature Coefficient:</strong> Change in capacitance per °C.</li>
                  <li><strong>5. Equivalent Series Resistance (ESR):</strong> Internal resistance, lower is better.</li>
                  <li><strong>6. Leakage Current:</strong> Small DC current through dielectric.</li>
                  <li><strong>7. Dielectric Type:</strong> Ceramic, electrolytic, film, etc.</li>
                  <li><strong>8. Operating Temperature Range.</strong></li>
                  <li><strong>9. Frequency Response.</strong></li>
                  <li><strong>10. Polarization:</strong> Polarized (electrolytic) vs non‑polarized.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ClipboardList size={16} /> Specifications (continued)
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>1. Nominal Values (E12 Series):</strong> Preferred values: 10,12,15,18,22,27,33,39,47,56,68,82 (multiply by powers of 10). Using preferred values simplifies manufacturing and ensures availability.</p>
                  <p><strong>2. Working Voltage (WVDC or VDC):</strong> Maximum continuous DC voltage. Always choose a capacitor with working voltage higher than the circuit's maximum voltage to provide a safety margin.</p>
                  <p><strong>3. Tolerance:</strong> Expressed as percentage; lower tolerance = more accurate. Critical for timing circuits, filters, oscillators.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Dielectrics</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>What are Dielectrics?</strong> Insulating materials that can be polarized when an electric field is applied. They store electrical energy by rearranging internal charges.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Types:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Non-Polar:</strong> Molecules have evenly distributed charges (air, benzene, paraffin). Induced dipoles when field applied.</li>
                  <li><strong>Polar:</strong> Molecules have permanent dipole moment (water, alcohol). Dipoles align with field.</li>
                  <li><strong>Linear:</strong> Polarization ∝ electric field (predictable).</li>
                  <li><strong>Non-Linear:</strong> Polarization not proportional to field; may exhibit hysteresis (ferroelectric materials like barium titanate, PZT).</li>
                  <li><strong>Ferroelectric:</strong> Spontaneous polarization that can be reversed; used in capacitors, sensors, memory devices.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Capacitor Color Code</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Similar to resistor color code; values in picofarads (pF). Bands or dots indicate significant digits, multiplier, tolerance, sometimes voltage rating.</p>
                <Table
                  headers={['Color', 'Digit', 'Multiplier', 'Tolerance']}
                  rows={[
                    ['Black', '0', '1', '±20%'],
                    ['Brown', '1', '10', '±1%'],
                    ['Red', '2', '100', '±2%'],
                    ['Orange', '3', '1,000', '-'],
                    ['Yellow', '4', '10,000', '-'],
                    ['Green', '5', '100,000', '±5%'],
                    ['Blue', '6', '1,000,000', '-'],
                    ['Violet', '7', '-', '-'],
                    ['Grey', '8', '-', '-'],
                    ['White', '9', '-', '±10%'],
                    ['Gold', '-', '0.1', '±5%'],
                    ['Silver', '-', '0.01', '±10%'],
                  ]}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Example 1:</strong> Red, Yellow, Orange, Green → 24 × 1000 = 24,000 pF = 24 nF, ±5%.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Example 2:</strong> Brown, Black, Red, Silver → 10 × 100 = 1,000 pF = 1 nF, ±10%.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Example 3:</strong> Green, Blue, Brown → 56 × 10 = 560 pF.</p>
              </div>
            </div>

            {/* SECTION 4: Inductors */}
            <div
              ref={(el) => {
                sectionRefs.current['inductors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Inductance
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Inductance is essentially a circuit's opposition to changes in current. It's a property of an electrical conductor that resists changes in current, due to the magnetic field created by the current itself.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>How it works:</strong> When current flows through a wire, it generates a magnetic field. If the current changes, the magnetic field changes, inducing a voltage (back EMF) that opposes the change.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Key points:</strong> Measured in henrys (H). Inductors store energy in a magnetic field. Inductors oppose AC current, allow DC current once stable.</p>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Types of Inductors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <AirCoreInductor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Air-Cored Inductors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Coil of wire with no core (air filled). Low inductance, low core losses, high frequency, less saturation. Used in RF circuits.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <IronCoreInductor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Iron-Cored Inductors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Solid iron core. High inductance, high core losses at high frequencies, prone to saturation. Used in low-frequency power supplies.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <FerriteCoreInductor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Dust/Ferrite-Cored Inductors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Powdered iron or ferrite core. Moderate to high inductance, lower core losses than iron, less saturation. Used in RF, filters, power supplies.</p>
                </div>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <LaminatedCoreInductor />
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">Laminated-Core Inductors</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Thin insulated laminations reduce eddy current losses. High inductance, suitable for low-frequency high-power applications (transformers).</p>
                </div>
              </div>
              <ComponentPhoto src="inductor-assortment.jpg" alt="Assortment of real inductors with ferrite cores and copper windings" caption="Real inductors vary in winding, core geometry and current rating; the magnetic core is inside or around the copper winding." />

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Inductor Characteristics</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Nominal Value (Inductance):</strong> Specified inductance in H, mH, µH. Higher value = greater opposition to current changes. Example: 10 mH opposes changes more strongly than 1 mH.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Frequency Range:</strong> Air-core → high frequency; ferrite/powdered iron → mid frequency; laminated iron → low frequency. Parasitic capacitance and core losses affect performance at high frequencies.</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400"><strong>Working Current (Current Rating):</strong> Maximum safe current. Exceeding causes saturation (inductance drops) or overheating. Thicker wire allows higher current; iron cores saturate more easily than ferrite or air.</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Electronics Insight
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
                  <span>Resistor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Capacitor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5+</span>
                </li>
                <li className="flex justify-between">
                  <span>Inductor Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Color Code Colors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Resistors oppose current and come in fixed, wire‑wound, variable, and preset types.
                Their value is read via color codes. Non‑linear resistors include thermistors,
                varistors, and LDRs. Electrostatics deals with charge, Coulomb's law, electric fields,
                potential, and static electricity. Capacitors store energy in an electric field;
                types include paper, mica, ceramic, polyester, electrolytic, and variable. Capacitance
                depends on plate area, distance, and dielectric. Inductors oppose changes in current;
                types include air‑core, iron‑core, ferrite‑core, and laminated‑core.
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
                <strong className="text-white">Resistors</strong> – Passive components that oppose current
                flow. Fixed, wire‑wound, variable (linear/log), and preset types. Color codes identify
                resistance, tolerance, and multiplier. Non‑linear types include thermistors, varistors,
                and LDRs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Electrostatics</strong> – Electric charge (Coulomb's law),
                electric fields, potential (voltage), and static electricity. Fundamental principles
                underlying capacitors and circuit behaviour.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Capacitors</strong> – Store energy in an electric field.
                Types: paper, mica, ceramic, polyester, electrolytic, variable, trimmer. Capacitance
                depends on plate area, distance, dielectric material. Capacitors in parallel add; in
                series, reciprocal. Colour codes specify value and tolerance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inductors</strong> – Oppose changes in current. Types:
                air‑cored, iron‑cored, ferrite‑cored, laminated‑core. Key specifications: inductance,
                frequency range, working current. Inductors store energy in magnetic fields and are
                essential in filters and power supplies.
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
            Sidemann Academic Registry • Electrical &amp; Electronics Fundamentals — LO1
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
