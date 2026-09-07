import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { AutomotiveMathProvider, InlineMath, MathBlockText } from './AutomotiveMath';
import { useLessonState } from '../../../lessonProgress';

type BoxColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'indigo' | 'cyan' | 'orange';

interface ChildrenProps {
  children: React.ReactNode;
}

interface MathFormulaProps extends ChildrenProps {
  isDarkMode?: boolean;
}

interface ExBoxProps extends ChildrenProps {
  title?: React.ReactNode;
  color?: BoxColor;
  isDarkMode?: boolean;
}

interface CardProps extends ChildrenProps {
  color?: BoxColor;
  isDarkMode: boolean;
}

interface TableProps {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  isDarkMode: boolean;
}

// ─── Math rendering helpers ───────────────────────────────────────────────────
const MathFormula = ({ children }: MathFormulaProps) => <InlineMath>{children}</InlineMath>;

const MathBlock = ({ children }: MathFormulaProps) => <MathBlockText>{children}</MathBlockText>;

const ExBox = ({ title, children, color = 'blue' }: ExBoxProps) => {
  const colors: Record<BoxColor, string> = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/10',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/10',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10',
    cyan: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10',
    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/10',
  };
  return (
    <div className={` ${colors[color]} rounded-r-lg p-4 my-3`}>
      {title && <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{title}</p>}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">{children}</div>
    </div>
  );
};

const Card = ({ color = 'blue', children, isDarkMode }: CardProps) => {
  const borders: Record<BoxColor, string> = { blue: 'border-blue-500', green: 'border-green-500', purple: 'border-purple-500', amber: 'border-amber-500', red: 'border-red-500', indigo: 'border-indigo-500', cyan: 'border-cyan-500', orange: 'border-orange-500' };
  return (
    <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-lg shadow-md p-5 mb-5 ${borders[color] || borders.blue}`}>
      {children}
    </div>
  );
};

// ─── Table component ──────────────────────────────────────────────────────────
const Table = ({ headers, rows, isDarkMode }: TableProps) => (
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

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'mass-density', label: 'Mass & Density' },
  { id: 'motion-speed', label: 'Motion & Speed' },
  { id: 'acceleration', label: 'Acceleration' },
  { id: 'newtons-laws', label: "Newton's Laws" },
  { id: 'levers', label: 'Levers & Moments' },
  { id: 'gravity', label: 'Centre of Gravity' },
  { id: 'work-energy', label: 'Work & Energy' },
  { id: 'engine-power', label: 'Engine Power' },
  { id: 'tractive-effort', label: 'Tractive Effort' },
  { id: 'friction', label: 'Friction' },
  { id: 'stress-strain', label: 'Stress & Strain' },
  { id: 'machines', label: 'Simple Machines' },
  { id: 'heat', label: 'Heat' },
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
        text: 'Mass is an intrinsic property of an object and remains constant regardless of location, while weight is the force of gravity acting on that mass.',
      },
      {
        title: 'Pro Tip',
        text: 'When calculating braking distance, always remember that braking distance increases with the square of velocity — doubling your speed quadruples your stopping distance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember Newton\'s Three Laws: "I" (Inertia), "F" (Force = ma), and "A" (Action & Reaction).',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse heat and temperature — heat is energy transferred, while temperature measures the average kinetic energy of particles.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Mass is an intrinsic property of an object and remains constant regardless of location, while weight is the force of gravity acting on that mass.',
      },
      {
        title: 'Pro Tip',
        text: 'When calculating braking distance, always remember that braking distance increases with the square of velocity — doubling your speed quadruples your stopping distance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember Newton\'s Three Laws: "I" (Inertia), "F" (Force = ma), and "A" (Action & Reaction).',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse heat and temperature — heat is energy transferred, while temperature measures the average kinetic energy of particles.',
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

  // ─── Helper text classes ────────────────────────────────────────────────
  const textHead = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const subHead = isDarkMode ? 'text-blue-400' : 'text-blue-700';
  const theadBg = isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100';
  const rowBg = (alt: boolean) => isDarkMode ? (alt ? 'bg-[#1e1e1e]' : 'bg-[#252526]') : (alt ? 'bg-[#f8f9fa]' : 'bg-white');
  const examTipClasses = isDarkMode
    ? 'bg-yellow-900/30 p-4 rounded-[5px] my-5'
    : 'bg-yellow-50 p-4 rounded-[5px] my-5';

  return (
    <AutomotiveMathProvider>
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Zap size={14} className="inline mr-1" /> SCIENCE & TECHNOLOGY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Simply Easy{' '}
            <span className="text-sky-300 font-bold italic">
              Learning
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Step-by-step tutorials tracking the syllabus. This outcome focuses on{' '}
            <span className="text-white font-bold underline decoration-cyan-400">Learning Outcome 2: Science</span>.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Mechanics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Flame size={14} className="inline mr-1" /> Heat
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Power
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
                placeholder="Search for force, heat, friction, stress, energy..."
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
            {/* SECTION 1: Mass, Specific Gravity, Relative Density */}
            <div
              ref={(el) => {
                sectionRefs.current['mass-density'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Mass, Specific Gravity &amp; Relative Density
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: '1.1 Mass',
                    color: 'blue',
                    icon: <Scale size={24} className="mb-2 text-blue-600 dark:text-blue-400" />,
                    content: (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Definition:</strong> Mass is a fundamental property of an object that measures
                          its resistance to acceleration. It is often described as the amount of "stuff" or matter
                          an object contains.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          <strong>SI Unit:</strong> The standard SI unit of mass is the kilogram (kg). Other
                          common units include grams (g) and pounds (lbs).
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <li>Mass is an intrinsic property of an object and remains constant regardless of its location.</li>
                          <li>Mass is different from weight. Weight is the force exerted on an object by gravity, while mass is the amount of matter in the object.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '1.2 Specific Gravity',
                    color: 'cyan',
                    icon: <BarChart size={24} className="mb-2 text-cyan-600 dark:text-cyan-400" />,
                    content: (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Definition:</strong> Specific gravity is the ratio of the density of a substance
                          to the density of a reference substance. Usually, the reference substance is water at
                          4°C, which has a density of approximately 1 g/cm³ or 1000 kg/m³.
                        </p>
                        <MathBlock isDarkMode={isDarkMode}>Specific Gravity = (Density of substance) / (Density of water)</MathBlock>
                        <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <li>Specific gravity is a dimensionless quantity (it has no units).</li>
                          <li>If the specific gravity of a substance is greater than 1, it is denser than water and will sink. If it is less than 1, it is less dense than water and will float.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '1.3 Relative Density',
                    color: 'indigo',
                    icon: <Layers size={24} className="mb-2 text-indigo-600 dark:text-indigo-400" />,
                    content: (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <strong>Definition:</strong> Relative density is essentially the same as specific gravity.
                          It is the ratio of the density of a substance to the density of a reference substance.
                          In most practical applications, the reference substance is water.
                        </p>
                        <MathBlock isDarkMode={isDarkMode}>Relative Density = (Density of substance) / (Density of reference substance)</MathBlock>
                        <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <li>Relative density is also a dimensionless quantity.</li>
                          <li>In many contexts, "relative density" and "specific gravity" are used interchangeably. When the reference substance is water, the numerical values of specific gravity and relative density are identical.</li>
                        </ul>
                      </>
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    item.color === 'blue' ? 'border-blue-500' : item.color === 'cyan' ? 'border-cyan-500' : 'border-indigo-500'
                  }`}>
                    {item.icon}
                    <h4 className={`font-black uppercase text-base mb-3 ${textHead}`}>{item.title}</h4>
                    {item.content}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Distance, Time, Speed */}
            <div
              ref={(el) => {
                sectionRefs.current['motion-speed'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Distance, Time &amp; Speed
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Distance', u: 'meter (m)', d: 'The total length of the path travelled by an object.' },
                  { t: 'Time', u: 'second (s)', d: 'The duration of an event or the interval between two events.' },
                  { t: 'Speed', u: 'meters per second (m/s)', d: 'The rate at which an object covers distance. It tells us how fast an object is moving.' },
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                    <h4 className={`font-black uppercase text-base mb-1 ${textHead}`}>{item.t}</h4>
                    <p className={`text-xs mb-2 text-cyan-600 dark:text-cyan-400 font-bold`}>SI Unit: {item.u}</p>
                    <p className={`text-sm ${textMuted}`}>{item.d}</p>
                  </div>
                ))}
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>Relationship Between Distance, Time, and Speed</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { f: 'Speed = Distance / Time', d: 'Speed is directly proportional to distance and inversely proportional to time.' },
                    { f: 'Distance = Speed × Time', d: 'Distance is directly proportional to both speed and time.' },
                    { f: 'Time = Distance / Speed', d: 'Time is directly proportional to distance and inversely proportional to speed.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <MathBlock isDarkMode={isDarkMode}>{item.f}</MathBlock>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-yellow-600" size={18} />
                    <span className={`font-black uppercase text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>The Distance, Speed, Time Triangle</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>
                    Cover "Distance" → left with Speed × Time. Cover "Speed" → left with Distance / Time. Cover "Time" → left with Distance / Speed.
                  </p>
                </div>
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Velocity as a Vector Quantity</h3>
                <p className={`text-sm mb-3 ${textMuted}`}>
                  Velocity is the rate of change of an object's position with respect to time. It is a <strong>vector quantity</strong>, meaning it has both magnitude (size) and direction.
                </p>
                <p className={`text-sm mb-3 ${textMuted}`}>
                  Speed, on the other hand, is a <strong>scalar quantity</strong> — it only has magnitude and tells us how fast an object is moving. Velocity tells us how fast <em>and in what direction</em>.
                </p>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Example:</p>
                  <p className={`text-sm ${textMuted}`}>A car traveling at 60 km/h north has a <em>velocity</em> of 60 km/h north. A car traveling at 60 km/h has a <em>speed</em> of 60 km/h.</p>
                  <p className={`text-sm mt-2 ${textMuted}`}>The direction component of velocity is crucial in describing motion, especially in situations involving changes in direction, such as circular motion or projectile motion.</p>
                </div>
              </div>

              {/* Linear and Angular Motion */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Linear and Angular Motion</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-bold mb-3 ${subHead} uppercase`}>Linear Motion</h4>
                    <div className="space-y-2">
                      {[
                        { l: 'Distance (d)', f: 'd = s × t (where s is speed and t is time)' },
                        { l: 'Speed (s)', f: 's = d / t' },
                        { l: 'Time (t)', f: 't = d / s' },
                        { l: 'Velocity (v)', f: 'v = Δd / Δt (where Δd is the change in displacement and Δt is the change in time)' },
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{item.l}: </span>
                          <MathFormula isDarkMode={isDarkMode}>{item.f}</MathFormula>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold mb-3 ${subHead} uppercase`}>Angular Motion</h4>
                    <div className="space-y-2">
                      {[
                        { l: 'Angular Displacement (θ)', f: 'θ = ω × t (ω is angular speed, t is time)' },
                        { l: 'Angular Speed (ω)', f: 'ω = θ / t  [rad/s]' },
                        { l: 'Time (t)', f: 't = θ / ω' },
                        { l: 'Angular Velocity (α)', f: 'α = Δθ / Δt' },
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                          <span className={`text-xs font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>{item.l}: </span>
                          <MathFormula isDarkMode={isDarkMode}>{item.f}</MathFormula>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-blue-50'} border border-blue-200 dark:border-blue-900`}>
                  <p className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Relationship between Linear and Angular Motion:</p>
                  <MathBlock isDarkMode={isDarkMode}>v = r × ω  (linear velocity = radius × angular velocity)</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>d = r × θ  (arc length = radius × angular displacement)</MathBlock>
                  <p className={`text-sm ${textMuted}`}>Linear motion describes movement along a straight line. Angular motion describes rotational movement around an axis. Linear velocity is tangent to the circular path of an object in angular motion.</p>
                </div>
              </div>

              {/* Calculating Distance Examples */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Calculating Distance — Worked Examples</h3>
                <MathBlock isDarkMode={isDarkMode}>Distance (d) = Speed (s) × Time (t)</MathBlock>
                <p className={`text-sm mb-4 ${textMuted}`}>Remember to ensure that the units of speed and time are compatible. If speed is in km/h, time should be in hours. If speed is in m/s, time should be in seconds.</p>
                {[
                  {
                    t: 'Example 1: A Car Trip',
                    q: 'A car travels at a constant speed of 80 km/h for 2.5 hours. Calculate the distance covered.',
                    steps: ['Speed (s) = 80 km/h', 'Time (t) = 2.5 hours', 'Distance (d) = s × t = 80 km/h × 2.5 hours = 200 km'],
                    ans: 'The car covered a distance of 200 kilometres.'
                  },
                  {
                    t: "Example 2: A Runner's Sprint",
                    q: 'A runner sprints at a speed of 10 m/s for 15 seconds. Calculate the distance covered.',
                    steps: ['Speed (s) = 10 m/s', 'Time (t) = 15 seconds', 'Distance (d) = s × t = 10 m/s × 15 s = 150 metres'],
                    ans: 'The runner covered a distance of 150 metres.'
                  },
                  {
                    t: 'Example 3: A Train Journey with Unit Conversion',
                    q: 'A train travels at a speed of 120 km/h for 20 minutes. Calculate the distance travelled.',
                    steps: ['Convert: 20 minutes ÷ 60 = 1/3 hour (0.3333...)', 'Speed (s) = 120 km/h', 'Time (t) = 1/3 hours', 'Distance (d) = 120 km/h × (1/3) h = 40 km'],
                    ans: 'The train travelled 40 kilometres.'
                  },
                ].map((ex, i) => (
                  <div key={i} className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-black text-sm uppercase mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{ex.t}</p>
                    <p className={`text-sm italic mb-2 ${textMuted}`}>{ex.q}</p>
                    <div className="space-y-1 mb-2">
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                    </div>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {ex.ans}</p>
                  </div>
                ))}
              </div>

              {/* Velocity-Time Graphs */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Velocity-Time Graphs (Distance Representation)</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>In a velocity-time graph, the <strong>area under the curve</strong> represents the distance travelled. If the velocity is constant, the graph is a horizontal line, and the area is a rectangle. If the velocity is changing (acceleration), the graph will be a sloping line, and the area might be a triangle or a trapezoid.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      t: 'Example 1: Constant Velocity',
                      d: 'A car travels at a constant velocity of 20 m/s for 10 seconds.',
                      calc: 'Distance = Area = Velocity × Time = 20 m/s × 10 s = 200 metres',
                      note: 'Area of the rectangle under the horizontal line.'
                    },
                    {
                      t: 'Example 2: Uniform Acceleration',
                      d: 'A motorcycle accelerates uniformly from rest to 30 m/s in 10 seconds.',
                      calc: 'Distance = Area = (1/2) × Base × Height = (1/2) × 10 s × 30 m/s = 150 metres',
                      note: 'Area of the triangle under the sloping line.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-sm uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs mb-2 ${textMuted}`}>{ex.d}</p>
                      <MathBlock isDarkMode={isDarkMode}>{ex.calc}</MathBlock>
                      <p className={`text-xs italic ${textMuted}`}>{ex.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance-Time Graphs */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>5 Distance-Time Graphs (Velocity Representation)</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>In a distance-time graph, the <strong>slope of the line</strong> represents the velocity. A straight, sloping line indicates constant velocity. A curved line indicates changing velocity (acceleration). A horizontal line indicates that the object is stationary.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      t: 'Example 1: Constant Velocity',
                      d: 'A bicyclist travels 50 metres in 10 seconds at a constant velocity.',
                      calc: 'Velocity = Slope = Change in Distance / Change in Time = 50 m / 10 s = 5 m/s',
                      note: 'The straight sloping line has a constant gradient.'
                    },
                    {
                      t: 'Example 2: Changing Velocity (Deceleration)',
                      d: 'A skateboarder travels, slowing down, and covers less distance per second.',
                      calc: 'The curve shows that the slope (velocity) is decreasing over time.',
                      note: 'To find instantaneous velocity at any point, draw a tangent line to the curve at that point and calculate its slope. A downward-curving line means the object is decelerating.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-sm uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs mb-2 ${textMuted}`}>{ex.d}</p>
                      <MathBlock isDarkMode={isDarkMode}>{ex.calc}</MathBlock>
                      <p className={`text-xs italic ${textMuted}`}>{ex.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: Acceleration, Deceleration, Braking */}
            <div
              ref={(el) => {
                sectionRefs.current['acceleration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Acceleration, Deceleration, Braking Distance &amp; Efficiency
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { t: 'Linear Acceleration (a)', f: 'a = (vf – vi) / t', u: 'm/s²', d: 'The rate of change of linear velocity. vf = final velocity, vi = initial velocity, t = time.' },
                  { t: 'Linear Deceleration', f: 'a = (vf – vi) / t  [negative result]', u: 'm/s²', d: 'Linear acceleration with a negative value, indicating a decrease in velocity.' },
                  { t: 'Angular Acceleration (α)', f: 'α = (ωf – ωi) / t', u: 'rad/s²', d: 'The rate of change of angular velocity. ωf = final angular velocity, ωi = initial angular velocity, t = time.' },
                  { t: 'Angular Deceleration', f: 'α = (ωf – ωi) / t  [negative result]', u: 'rad/s²', d: 'Angular acceleration with a negative value, indicating a decrease in angular velocity.' },
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${i < 2 ? 'border-blue-500' : 'border-purple-500'}`}>
                    <h4 className={`font-black uppercase text-base mb-1 ${textHead}`}>{item.t}</h4>
                    <MathBlock isDarkMode={isDarkMode}>{item.f}</MathBlock>
                    <p className={`text-xs font-bold mb-1 text-cyan-600 dark:text-cyan-400`}>SI Unit: {item.u}</p>
                    <p className={`text-xs ${textMuted}`}>{item.d}</p>
                  </div>
                ))}
              </div>

              {/* Worked examples */}
              {[
                {
                  heading: '3.1 Linear Acceleration/Deceleration Examples',
                  examples: [
                    {
                      label: 'Example 1 (Acceleration)',
                      q: 'A car accelerates from rest to 25 m/s in 5 seconds. Calculate the car\'s acceleration.',
                      steps: ['a = (vf − vi) / t', 'a = (25 m/s − 0 m/s) / 5 s', 'a = 25 / 5 = 5 m/s²'],
                      ans: 'The car\'s acceleration is 5 m/s².'
                    },
                    {
                      label: 'Example 2 (Deceleration)',
                      q: 'A train traveling at 30 m/s applies its brakes and comes to a stop in 10 seconds. Calculate the train\'s deceleration.',
                      steps: ['a = (vf − vi) / t', 'a = (0 m/s − 30 m/s) / 10 s', 'a = −30 / 10 = −3 m/s²'],
                      ans: 'The train\'s deceleration is 3 m/s². (The negative sign indicates deceleration.)'
                    }
                  ]
                },
                {
                  heading: '3.2 Angular Acceleration/Deceleration Examples',
                  examples: [
                    {
                      label: 'Example 1 (Acceleration)',
                      q: 'A flywheel starts from rest and accelerates to an angular velocity of 10 rad/s in 2 seconds. Calculate the flywheel\'s angular acceleration.',
                      steps: ['α = (ωf − ωi) / t', 'α = (10 rad/s − 0 rad/s) / 2 s', 'α = 10 / 2 = 5 rad/s²'],
                      ans: 'The flywheel\'s angular acceleration is 5 rad/s².'
                    },
                    {
                      label: 'Example 2 (Deceleration)',
                      q: 'A rotating disc slows down from an angular velocity of 15 rad/s to 3 rad/s in 4 seconds. Calculate the disc\'s angular deceleration.',
                      steps: ['α = (ωf − ωi) / t', 'α = (3 rad/s − 15 rad/s) / 4 s', 'α = −12 / 4 = −3 rad/s²'],
                      ans: 'The disc\'s angular deceleration is 3 rad/s².'
                    }
                  ]
                }
              ].map((group, gi) => (
                <div key={gi} className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>{group.heading}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {group.examples.map((ex, i) => (
                      <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                        <p className={`font-bold text-sm mb-1 ${subHead}`}>{ex.label}</p>
                        <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                        {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                        <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {ex.ans}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Braking Distance */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Braking Distance</h3>
                <MathBlock isDarkMode={isDarkMode}>vf² = vi² + 2ad</MathBlock>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      label: 'Example 1',
                      q: 'A car traveling at 20 m/s applies its brakes and decelerates at 4 m/s². Calculate the braking distance.',
                      steps: ['vf² = vi² + 2ad', '0² = 20² + 2(−4)d', '0 = 400 − 8d', '8d = 400', 'd = 400 / 8 = 50 m'],
                      ans: 'The braking distance is 50 metres.'
                    },
                    {
                      label: 'Example 2',
                      q: 'A motorcycle traveling at 28 m/s needs to stop within 35 metres to avoid an obstacle. What deceleration is required?',
                      steps: ['vf² = vi² + 2ad', '0² = 28² + 2a(35)', '0 = 784 + 70a', '−784 = 70a', 'a = −784 / 70 = −11.2 m/s²'],
                      ans: 'The required deceleration is 11.2 m/s².'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{ex.label}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Braking Efficiency */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Braking Efficiency</h3>
                <MathBlock isDarkMode={isDarkMode}>Braking Efficiency = (Theoretical Braking Distance / Actual Braking Distance) × 100%</MathBlock>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      label: 'Example 1',
                      q: "A vehicle's actual braking distance is 45 m, while the theoretical braking distance is 40 m. Calculate the braking efficiency.",
                      steps: ['Braking Efficiency = (40 m / 45 m) × 100%', '= 0.8888 × 100% = 88.88%'],
                      ans: 'The braking efficiency is approximately 88.88%.'
                    },
                    {
                      label: 'Example 2',
                      q: "A vehicle with a braking efficiency of 92% has a theoretical braking distance of 38 m. What is the actual braking distance?",
                      steps: ['0.92 = 38 / Actual Braking Distance', 'Actual Braking Distance = 38 / 0.92 = 41.3 m'],
                      ans: 'The actual braking distance is approximately 41.3 metres.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>{ex.label}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors Affecting Braking */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-base mb-4 ${textHead}`}>5 Factors Affecting Braking Distance</h3>
                  <ul className="space-y-2">
                    {['Initial Velocity: Higher velocity results in a significantly longer braking distance.','Road Conditions: Slippery surfaces (wet, icy, or oily) increase braking distance.','Vehicle Weight: Heavier vehicles require a longer distance to stop.','Brake Condition: Worn or malfunctioning brakes increase braking distance.','Tire Condition: Worn or improperly inflated tires reduce grip and increase braking distance.','Road Gradient: Downhill slopes increase braking distance, while uphill slopes decrease it.','Driver Reaction Time: The time it takes a driver to react to a hazard increases the overall stopping distance.'].map((item, i) => (
                      <li key={i} className={`text-sm flex gap-2 items-start ${textMuted}`}><CheckCircle size={14} className="mt-0.5 text-red-500 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-base mb-4 ${textHead}`}>6 Factors Affecting Braking Efficiency</h3>
                  <ul className="space-y-2">
                    {['Brake System Condition: Properly maintained and functioning brakes maximize efficiency.','Tire Condition: Tires with good tread and proper inflation enhance braking efficiency.','Brake Pad/Disc Wear: Worn brake pads or discs reduce braking effectiveness.','Hydraulic System Integrity: A leak-free and properly functioning hydraulic system ensures optimal brake performance.','ABS (Anti-lock Braking System): Vehicles equipped with ABS have improved braking efficiency, especially in slippery conditions.','Weight Distribution: Proper weight distribution of the vehicle improves braking efficiency.','Road Surface: A high friction road surface will increase braking efficiency.'].map((item, i) => (
                      <li key={i} className={`text-sm flex gap-2 items-start ${textMuted}`}><CheckCircle size={14} className="mt-0.5 text-orange-500 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Uniform vs Variable Velocity Table */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>7 Uniform Velocity vs. Variable Velocity</h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Feature', 'Uniform Velocity', 'Variable Velocity']}
                  rows={[
                    ['Definition', 'Velocity remains constant in both magnitude and direction.', 'Velocity changes in magnitude, direction, or both.'],
                    ['Acceleration', 'Zero acceleration.', 'Non-zero acceleration.'],
                    ['Distance-Time Graph', 'Straight, sloping line.', 'Curved line or a series of straight lines with different slopes.'],
                    ['Velocity-Time Graph', 'Horizontal line.', 'Sloping or curved line.'],
                    ['Motion', 'Movement in a straight line at a constant speed.', 'Movement with changing speed or direction, or both.'],
                    ['Example', 'A car traveling on a straight highway at a constant 60 km/h.', 'A car accelerating from a stop, or a car going around a curve.'],
                    ['Mathematical Representation', 'v = constant', 'v = a function of time: v(t)'],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 4: Newton's Laws & Force */}
            <div
              ref={(el) => {
                sectionRefs.current['newtons-laws'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Newton's Laws of Motion &amp; Force
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { n: '1st Law', sub: 'Law of Inertia', d: 'An object at rest stays at rest, and an object in motion stays in motion with a constant velocity, unless acted upon by a net external force.', color: 'blue' },
                  { n: '2nd Law', sub: 'Law of Acceleration', d: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. F = ma (where F is force, m is mass, and a is acceleration).', color: 'green', f: 'F = ma' },
                  { n: '3rd Law', sub: 'Law of Action and Reaction', d: 'For every action, there is an equal and opposite reaction. When one object exerts a force on a second object, the second object simultaneously exerts a force equal in magnitude and opposite in direction on the first object.', color: 'purple' },
                ].map((law, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    law.color === 'blue' ? 'border-blue-500' : law.color === 'green' ? 'border-green-500' : 'border-purple-500'
                  }`}>
                    <h4 className={`font-black uppercase text-xl mb-1 ${textHead}`}>{law.n}</h4>
                    <p className={`text-xs font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} uppercase`}>{law.sub}</p>
                    <p className={`text-sm ${textMuted}`}>{law.d}</p>
                    {law.f && <MathBlock isDarkMode={isDarkMode}>{law.f}</MathBlock>}
                  </div>
                ))}
              </div>

              {/* Force definition */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Force</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>A force is a push or pull upon an object resulting from the object's interaction with another object. It is a <strong>vector quantity</strong>, meaning it has both magnitude and direction.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { l: 'Magnitude', d: 'The strength or intensity of the force, measured in Newtons (N).' },
                    { l: 'Direction', d: 'The line of action along which the force acts.' },
                    { l: 'Point of Application', d: 'The specific location where the force is applied to an object.' },
                    { l: 'Vector Quantity', d: 'Force is a vector, so it can be represented by arrows, where the length indicates magnitude and the arrow direction indicates the direction of the force.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <span className={`text-xs font-bold uppercase ${subHead}`}>{item.l}: </span>
                      <span className={`text-xs ${textMuted}`}>{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problems involving force and acceleration */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Problems Involving Force and Acceleration</h3>
                {[
                  {
                    t: 'Example 1: Accelerating a Box',
                    q: 'A box with a mass of 5 kg is pushed with a force of 20 N. Calculate the acceleration of the box.',
                    steps: ['F = ma', '20 N = 5 kg × a', 'a = 20 N / 5 kg', 'a = 4 m/s²'],
                    ans: 'The acceleration of the box is 4 m/s².'
                  },
                  {
                    t: 'Example 2: Accelerating a Car',
                    q: 'A car with a mass of 1200 kg accelerates from rest to a speed of 30 m/s in 10 seconds. Calculate the force required.',
                    steps: ['First, calculate acceleration: a = (vf – vi) / t = (30 m/s - 0 m/s) / 10 s = 3 m/s²', 'Then, apply Newton\'s second law: F = ma = 1200 kg × 3 m/s² = 3600 N'],
                    ans: 'The force required is 3600 N.'
                  },
                  {
                    t: 'Example 3: Force Required to Decelerate',
                    q: 'A bowling ball with a mass of 7 kg is moving at 10 m/s. It must be stopped within 2 seconds. What force is required to decelerate the ball?',
                    steps: ['First, calculate deceleration: a = (0 m/s - 10 m/s) / 2 s = -5 m/s²', 'Then, apply Newton\'s second law: F = ma = 7 kg × -5 m/s² = -35 N'],
                    ans: 'The force required is 35 N. The negative sign indicates that the force is acting in the opposite direction of the ball\'s motion.'
                  }
                ].map((ex, i) => (
                  <div key={i} className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-black text-sm uppercase mb-1 ${subHead}`}>{ex.t}</p>
                    <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                    {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                    <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {ex.ans}</p>
                  </div>
                ))}
              </div>

              {/* Equilibrant vs Resultant Table */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Equilibrant vs. Resultant</h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Feature', 'Resultant', 'Equilibrant']}
                  rows={[
                    ['Definition', 'The single force that produces the same effect as all the individual forces acting together.', 'The force that, when added to the resultant, produces equilibrium (net force of zero).'],
                    ['Purpose', 'To find the combined effect of multiple forces.', 'To balance or cancel out the resultant force.'],
                    ['Direction', 'The direction of the net force.', 'Opposite in direction to the resultant force.'],
                    ['Magnitude', 'The magnitude of the net force.', 'Equal in magnitude to the resultant force.'],
                    ['Effect', 'Causes acceleration.', 'Causes no acceleration, maintains equilibrium.'],
                    ['Mathematical operation', 'Found by vector addition of all forces.', 'Found by calculating the negative of the resultant force.'],
                  ]}
                />
              </div>

              {/* Forces in straight line, Parallelogram, Triangle, Polygon, Bow's Notation */}
              <div className="space-y-4">
                {[
                  {
                    t: '4.4 Forces in a Straight Line',
                    d: 'When forces act along a straight line (collinear forces), they can be: Acting in the Same Direction — the resultant force is the sum of the magnitudes of the individual forces. Acting in Opposite Directions — the resultant force is the difference between the magnitudes, acting in the direction of the larger force. Equilibrium — if the forces acting in opposite directions are equal in magnitude, the resultant force is zero and the object is in equilibrium (no acceleration).',
                    color: 'blue'
                  },
                  {
                    t: '4.5 Parallelogram of Forces',
                    d: 'If two forces acting simultaneously on a body at a point are represented in magnitude and direction by the two adjacent sides of a parallelogram, then the diagonal of the parallelogram represents their resultant in both magnitude and direction. Graphical steps: (1) Draw two force vectors F₁ and F₂ from the same point. (2) Complete the parallelogram by drawing parallel lines from each vector head. (3) Draw a diagonal from the starting point to the opposite corner — this diagonal is the resultant. (4) Measure the magnitude with a ruler and the angle with a protractor.',
                    color: 'green'
                  },
                  {
                    t: "4.6 Triangle of Forces",
                    d: "If three forces acting at a point are in equilibrium, they can be represented in magnitude and direction by the sides of a triangle taken in order. The three forces F1, F2, and F3 form a closed triangle when drawn head-to-tail. This method is useful for finding unknown forces in equilibrium conditions.",
                    color: 'purple'
                  },
                  {
                    t: "4.7 Bow's Notation (Space and Vector Diagrams)",
                    d: "Bow's Notation is a system of labelling used in structural mechanics and force diagrams. Spaces between forces are labelled with capital letters (A, B, C, etc.). Forces themselves are labelled with lowercase letters (a, b, c, etc.). Each space is labelled with capital letters and each force with lowercase letters. This notation helps simplify complex force diagrams and ensures each element is correctly identified.",
                    color: 'amber'
                  },
                  {
                    t: '4.8 Polygon of Forces',
                    d: 'If several forces acting at a point are represented in magnitude and direction by the sides of a closed polygon taken in order, then the system of forces is in equilibrium. If the polygon does not close, the closing side represents the resultant force. Graphical steps for four forces example (F1=20N East, F2=30N at 45°, F3=25N West, F4=35N South): (1) Draw F1 from point A. (2) From endpoint of F1, draw F2. (3) From endpoint of F2, draw F3. (4) From endpoint of F3, draw F4. (5) Draw a line from starting point A to the endpoint of F4 — this is the resultant. Measure magnitude with a ruler and direction with a protractor.',
                    color: 'cyan'
                  }
                ].map((sec, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    sec.color === 'blue' ? 'border-blue-500' : sec.color === 'green' ? 'border-green-500' : sec.color === 'purple' ? 'border-purple-500' : sec.color === 'amber' ? 'border-amber-500' : 'border-cyan-500'
                  }`}>
                    <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{sec.t}</h4>
                    <p className={`text-sm ${textMuted}`}>{sec.d}</p>
                  </div>
                ))}
              </div>

              {/* Resolving Forces with Trig */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>9 Resolving Forces Using Trigonometry</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>A force acting at an angle can be split into a horizontal component and a vertical component.</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <MathBlock isDarkMode={isDarkMode}>Fx = F × cos(θ)  [Horizontal Component]</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>Fy = F × sin(θ)  [Vertical Component]</MathBlock>
                    <p className={`text-xs ${textMuted}`}>Where F is the magnitude of the force and θ is the angle between the force and the horizontal axis.</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-sm mb-2 ${subHead}`}>Example: 100 N force at 30°</p>
                    <MathBlock isDarkMode={isDarkMode}>Fx = 100 N × cos(30°) ≈ 100 × 0.866 ≈ 86.6 N</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>Fy = 100 N × sin(30°) = 100 × 0.5 = 50 N</MathBlock>
                    <p className={`text-xs ${textMuted}`}>Both Fx and Fy are positive because the force is in the first quadrant.</p>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border border-blue-300 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Direction Rules: If Fx is to the right → positive; to the left → negative. If Fy is upward → positive; downward → negative.</p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Levers, Moments, Equilibrium */}
            <div
              ref={(el) => {
                sectionRefs.current['levers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Levers, Moments &amp; Equilibrium
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'First-Class Lever', d: 'Fulcrum is located between the effort and the load. Can provide either a force advantage or a speed advantage, depending on the relative distances. Examples: scissors, pliers, seesaws.', color: 'blue' },
                  { t: 'Second-Class Lever', d: 'Load is located between the fulcrum and the effort. Always provides a force advantage (multiplies force). Examples: wheelbarrows, nutcrackers, bottle openers.', color: 'green' },
                  { t: 'Third-Class Lever', d: 'Effort is located between the fulcrum and the load. Always provides a speed or distance advantage (multiplies distance). Examples: tweezers, fishing rods, the human forearm.', color: 'amber' },
                ].map((lev, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    lev.color === 'blue' ? 'border-blue-500' : lev.color === 'green' ? 'border-green-500' : 'border-amber-500'
                  }`}>
                    <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{lev.t}</h4>
                    <p className={`text-sm ${textMuted}`}>{lev.d}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Moment of a Force', f: 'Moment = Force × Perpendicular Distance', u: 'Newton-meters (Nm)', d: 'The turning effect of a force about a pivot point (fulcrum).' },
                  { t: 'Turning Moment', f: 'Turning Moment = Force × Perpendicular Distance', u: 'Newton-meters (Nm)', d: 'Synonymous with the moment of a force. The rotational effect produced by a force acting at a distance from a pivot point.' },
                  { t: 'Torque (τ)', f: 'Torque = Force × Radius × sin(θ)', u: 'Newton-meters (Nm)', d: 'A rotational force that causes an object to rotate. When the force is perpendicular to the radius, sin(90°)=1, so Torque = Force × Radius.' },
                ].map((def, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                    <h4 className={`font-black uppercase text-sm mb-1 ${textHead}`}>{def.t}</h4>
                    <MathBlock isDarkMode={isDarkMode}>{def.f}</MathBlock>
                    <p className={`text-xs font-bold mb-1 ${subHead}`}>Units: {def.u}</p>
                    <p className={`text-xs ${textMuted}`}>{def.d}</p>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-xl bg-blue-700 text-white shadow-lg`}>
                <h3 className="text-xl font-black mb-3 flex items-center gap-2"><Target className="text-yellow-400" /> Principle of Moments &amp; Conditions for Equilibrium</h3>
                <p className="text-blue-100 mb-4">The principle of moments states that for a body in rotational equilibrium, the sum of the clockwise moments about a pivot is equal to the sum of the counter-clockwise moments about the same pivot.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-black uppercase text-sm mb-1">Translational Equilibrium</p>
                    <p className="text-blue-100 text-sm">The net force acting on the object must be zero (ΣF = 0). The object is not accelerating linearly.</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-black uppercase text-sm mb-1">Rotational Equilibrium</p>
                    <p className="text-blue-100 text-sm">The net moment acting on the object must be zero (ΣM = 0). The object is not accelerating rotationally.</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Solving Problems on Simple Levers</h3>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-1 ${subHead}`}>Example</p>
                  <p className={`text-xs italic mb-3 ${textMuted}`}>A seesaw is 4 metres long, with the fulcrum at its centre. A child weighing 300 N sits 1.5 metres from the fulcrum. How much weight must another child have to balance the seesaw if they sit at the opposite end?</p>
                  <MathBlock isDarkMode={isDarkMode}>Clockwise moment = Counter-clockwise moment</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>(Force1 × Distance1) = (Force2 × Distance2)</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>(300 N × 1.5 m) = (Force2 × 2 m)</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>450 Nm = Force2 × 2 m</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>Force2 = 450 Nm / 2 m = 225 N</MathBlock>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: The other child must weigh 225 N.</p>
                </div>
              </div>

              {/* Newton's 3rd Law Engineering Applications */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Newton's 3rd Law: Common Engineering Applications</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>"To every action, there is an equal and opposite reaction." The action and reaction forces always occur in pairs and act on different objects — they do not cancel each other out because they act on different objects.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { t: 'Rocket Propulsion', d: 'A rocket expels hot gases downward (action), and the gases exert an equal and opposite force upward on the rocket (reaction), propelling it into space.' },
                    { t: 'Jet Engines', d: 'Jet engines expel high-velocity gases backward (action), creating a forward thrust on the aircraft (reaction).' },
                    { t: 'Vehicle Tires', d: 'Tires push backward on the road (action), and the road pushes forward on the tires (reaction), propelling the vehicle.' },
                    { t: 'Firearms', d: 'A firearm exerts a force on a bullet (action), and the bullet exerts an equal and opposite force on the firearm (reaction), causing recoil.' },
                    { t: 'Walking', d: 'When a person walks, they push backward on the ground (action), and the ground pushes forward on the person (reaction), propelling them forward.' },
                    { t: 'Propellers', d: 'Propellers on ships or airplanes push water or air backwards (action), and the water or air pushes the propeller, and the craft, forward (reaction).' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reactions on Beams */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Solving Problems Involving Reactions on Beams</h3>
                <div className="space-y-3 mb-4">
                  {['Draw a Free-Body Diagram (FBD): Represent the beam as a horizontal line, show all external forces including applied loads and reactions at supports, label all forces and distances.', 'Apply Equilibrium Equations: ΣFy = 0 (sum of vertical forces), ΣFx = 0 (sum of horizontal forces), ΣM = 0 (sum of moments about any point).', 'Solve for Unknown Reactions: Use the equilibrium equations to solve for the unknown reaction forces at the supports.', 'Check Your Results: Substitute the calculated reaction forces back into the equilibrium equations to verify.'].map((step, i) => (
                    <div key={i} className={`flex gap-3 items-start p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 bg-blue-600`}>{i + 1}</span>
                      <p className={`text-sm ${textMuted}`}>{step}</p>
                    </div>
                  ))}
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-1 ${subHead}`}>Example</p>
                  <p className={`text-xs italic mb-3 ${textMuted}`}>A beam 6 metres long is supported at its ends. A point load of 10 kN is applied 2 metres from the left support. Calculate the reactions at the supports.</p>
                  <MathBlock isDarkMode={isDarkMode}>ΣFy = 0:  Ra + Rb − 10 kN = 0</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>ΣM (about Ra) = 0:  (10 kN × 2 m) − (Rb × 6 m) = 0</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>Rb = 20 kNm / 6 m = 3.33 kN</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>Ra = 10 kN − 3.33 kN = 6.67 kN</MathBlock>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: Ra = 6.67 kN, Rb = 3.33 kN</p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Centre of Gravity */}
            <div
              ref={(el) => {
                sectionRefs.current['gravity'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Centre of Gravity (CG)
              </h2>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <p className={`text-sm mb-4 ${textMuted}`}><strong>Definition:</strong> The center of gravity of an object is the point at which the entire weight of the object appears to act. It is the point where the object would balance if suspended.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-black uppercase text-sm mb-3 ${textHead}`}>Experimental Methods</h4>
                    <ul className="space-y-2">
                      {['Plumb Line Method: Suspend the object from different points and draw plumb lines. The intersection of the plumb lines indicates the CG.', 'Balancing Method: Balance the object on a pivot. The point of balance is the CG.'].map((m, i) => (
                        <li key={i} className={`text-sm flex gap-2 items-start ${textMuted}`}><CheckCircle size={14} className="mt-0.5 text-blue-500 shrink-0" />{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className={`font-black uppercase text-sm mb-3 ${textHead}`}>Analytical Methods</h4>
                    <ul className="space-y-2">
                      {['For simple shapes, the CG can be determined using formulas.', 'For complex shapes, the CG can be calculated by dividing the object into smaller parts and using the principle of moments.'].map((m, i) => (
                        <li key={i} className={`text-sm flex gap-2 items-start ${textMuted}`}><CheckCircle size={14} className="mt-0.5 text-green-500 shrink-0" />{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    t: '6.1 Wheelbase (Longitudinal CG)',
                    d: 'Place the vehicle on two scales, one under each axle. Measure the weight on each scale (Wf for front axle, Wr for rear axle). Measure the wheelbase (L). Calculate the distance of the CG from the front axle (X).',
                    f: 'X = (Wr × L) / (Wf + Wr)',
                    note: 'By comparing the weight on the front axle to the rear axle and knowing the distance between the two, you can calculate the longitudinal position of the CG along the wheelbase.',
                    color: 'blue'
                  },
                  {
                    t: '6.2 Track (Lateral CG)',
                    d: 'Tilt the vehicle sideways and measure the change in weight distribution. Place the vehicle on a platform that can be tilted. Measure the weight on each side when tilted. Use trigonometric calculations and the vehicle\'s dimensions to determine the lateral CG.',
                    f: 'Alternatively: place scales under each wheel on one side, lift the opposite side, compare weights.',
                    note: 'By changing the angle of the vehicle, you change the way gravity acts on it, and therefore change the weight distribution. These changes allow you to calculate the lateral CG.',
                    color: 'purple'
                  }
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${item.color === 'blue' ? 'border-blue-500' : 'border-purple-500'}`}>
                    <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{item.t}</h4>
                    <p className={`text-sm mb-3 ${textMuted}`}>{item.d}</p>
                    <MathBlock isDarkMode={isDarkMode}>{item.f}</MathBlock>
                    <p className={`text-xs italic ${textMuted}`}>{item.note}</p>
                  </div>
                ))}
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Importance of Centre of Gravity</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      t: 'Stability',
                      points: [
                        'The CG determines how a load will react to forces. If the CG is outside the support base, the load will likely tip over.',
                        'Knowing the CG allows for proper weight distribution, ensuring the load remains balanced during lifting and transportation.'
                      ]
                    },
                    {
                      t: 'Safety',
                      points: [
                        'Incorrectly estimating or ignoring the CG can lead to serious accidents, including load drops, equipment damage, and injuries.',
                        'Understanding the CG helps operators predict how a load will move and react to changes in direction or speed.'
                      ]
                    },
                    {
                      t: 'Efficiency',
                      points: [
                        'Lifting equipment has rated capacities affected by the load\'s CG. Knowing the CG allows operators to maximize lifting capacity without exceeding its limits.',
                        'Properly securing a load with its CG in the optimal position minimizes load shifting during transport.'
                      ]
                    },
                  ].map((cat, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black uppercase text-sm mb-3 ${subHead}`}>{cat.t}</p>
                      <ul className="space-y-2">
                        {cat.points.map((p, j) => (
                          <li key={j} className={`text-xs flex gap-2 items-start ${textMuted}`}><CheckCircle size={12} className="mt-0.5 text-blue-500 shrink-0" />{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-2 ${subHead}`}>Practical Examples:</p>
                  <ul className="space-y-1">
                    {['Cranes: Crane operators must carefully consider the CG of the load to prevent tipping and ensure a safe lift.', 'Forklifts: Forklift operators must position the forks correctly to ensure the load\'s CG is within the stability triangle of the forklift.', 'Trucks: Truck drivers must distribute cargo evenly to maintain a low CG and prevent rollovers.', 'Aircraft: Aircraft weight and balance calculations are crucial for maintaining stability and control during flight, with the CG being a primary factor.'].map((item, i) => (
                      <li key={i} className={`text-xs flex gap-2 items-start ${textMuted}`}><ArrowRight size={12} className="mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 7: Work, Energy, Power */}
            <div
              ref={(el) => {
                sectionRefs.current['work-energy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Work, Energy &amp; Power
              </h2>

              {/* Work */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Work</h3>
                <p className={`text-sm mb-3 ${textMuted}`}>Work is defined as the energy transferred to or from an object by means of a force acting on the object along a displacement. Work is done when a force causes an object to move. SI Unit of Work Done: <strong>Joule (J)</strong>. Force: Newton (N). Torque: Newton-meter (Nm).</p>
                <div className="space-y-3">
                  {[
                    { l: 'Work Done in a Straight Line', f: 'W = F × d × cos(θ)  [θ is angle between force and displacement direction]' },
                    { l: 'Work Done on Lifting Objects', f: 'W = Weight (mg) × Height (h)' },
                    { l: 'Work Done on an Incline', f: 'W = F × d  [F = force required up incline, d = distance along incline]' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className={`text-xs font-bold uppercase mb-1 ${subHead}`}>{item.l}</p>
                      <MathBlock isDarkMode={isDarkMode}>{item.f}</MathBlock>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      t: 'Example: Straight Line',
                      q: 'A box is pushed horizontally across a floor with a force of 50 N for a distance of 10 metres.',
                      steps: ['W = F × d', 'W = 50 N × 10 m', 'W = 500 J'],
                      ans: 'The work done is 500 Joules.'
                    },
                    {
                      t: 'Example: With Angle',
                      q: 'A person pulls a sled with a force of 80 N at 30° to the horizontal for 15 metres.',
                      steps: ['W = F × d × cos(θ)', 'W = 80 N × 15 m × cos(30°)', 'W = 80 × 15 × 0.866 ≈ 1039.2 J'],
                      ans: 'The work done is approximately 1039.2 Joules.'
                    },
                    {
                      t: 'Example: Against Gravity',
                      q: 'A 2 kg object is lifted vertically to a height of 5 metres.',
                      steps: ['W = mgh', 'W = 2 kg × 9.8 m/s² × 5 m', 'W = 98 J'],
                      ans: 'The work done is 98 Joules.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Energy</h3>
                <p className={`text-sm mb-4 ${textMuted}`}><strong>Definition:</strong> Energy is the capacity to do work.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {['Kinetic Energy (KE) — Energy of motion', 'Potential Energy (PE) — Stored energy', 'Gravitational Potential Energy — Energy stored due to height', 'Elastic Potential Energy — Energy stored in a stretched or compressed object', 'Thermal Energy — Heat energy', 'Chemical Energy — Energy stored in chemical bonds', 'Electrical Energy — Energy of moving electrons', 'Nuclear Energy — Energy stored in the nucleus', 'Radiant Energy — Energy of electromagnetic waves (light, etc.)'].map((e, i) => (
                    <div key={i} className={`p-3 rounded-lg text-xs ${isDarkMode ? 'bg-[#1e1e1e] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>{e}</div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      t: 'Potential Energy (PE)',
                      q: 'A 3 kg object is placed on a shelf 4 metres above the ground.',
                      steps: ['PE = mgh', 'PE = 3 kg × 9.8 m/s² × 4 m', 'PE = 117.6 J'],
                      ans: 'The potential energy is 117.6 Joules.'
                    },
                    {
                      t: 'Kinetic Energy (KE)',
                      q: 'A car with a mass of 1000 kg is moving at a speed of 20 m/s.',
                      steps: ['KE = 1/2 × mv²', 'KE = 1/2 × 1000 kg × (20 m/s)²', 'KE = 1/2 × 1000 × 400 = 200,000 J'],
                      ans: 'The kinetic energy is 200,000 Joules.'
                    },
                    {
                      t: 'PE to KE Conversion',
                      q: 'A 1 kg ball is dropped from a height of 10 metres. Calculate its kinetic energy just before hitting the ground.',
                      steps: ['PE (initial) = mgh = 1 kg × 9.8 × 10 m = 98 J', 'KE (final) = PE (initial) = 98 J (assuming no energy loss)'],
                      ans: 'The kinetic energy just before hitting the ground is 98 Joules.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Done in Rotation */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Work Done in Rotation</h3>
                <p className={`text-sm mb-3 ${textMuted}`}>Work done in rotation occurs when a torque causes an object to rotate about an axis. It's the energy transferred due to a rotational force acting over an angular displacement.</p>
                <MathBlock isDarkMode={isDarkMode}>W = τ × θ  (where τ is the torque and θ is the angular displacement in radians)</MathBlock>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    { t: 'Engine Torque', d: 'The engine of a motor vehicle produces torque, which is the rotational force that turns the crankshaft. This torque is transmitted through the drivetrain (clutch, gearbox, differential) to the wheels.' },
                    { t: 'Gear Ratios', d: 'Gear ratios in the transmission affect the torque and angular velocity of the wheels. Lower gears provide higher torque for acceleration, while higher gears provide lower torque for cruising at higher speeds.' },
                    { t: 'Power Transmission', d: 'The work done in rotation is directly related to the power output of the engine. Power = Torque × Angular Velocity.' },
                    { t: 'Representing Work on Graphs', d: 'For rotational motion: use a Torque-Angular Displacement graph. The area under the torque-angular displacement curve represents the work done in rotation (W = τ × θ).' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Power</h3>
                <p className={`text-sm mb-3 ${textMuted}`}>Power is the rate at which work is done or energy is transferred. SI Unit: Watt (W). 1 Watt = 1 Joule per second. 1 horsepower (hp) ≈ 746 Watts.</p>
                <MathBlock isDarkMode={isDarkMode}>Power (P) = Work (W) / Time (t)</MathBlock>
                <MathBlock isDarkMode={isDarkMode}>P = (Force × Distance) / Time</MathBlock>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      t: 'Example 1',
                      q: 'A machine does 1500 Joules of work in 5 seconds.',
                      steps: ['P = W / t', 'P = 1500 J / 5 s', 'P = 300 W'],
                      ans: 'The power output is 300 Watts.'
                    },
                    {
                      t: 'Example 2',
                      q: 'A motor lifts a 50 kg object to a height of 10 metres in 20 seconds.',
                      steps: ['W = mgh = 50 × 9.8 × 10 = 4900 J', 'P = W / t = 4900 J / 20 s = 245 W'],
                      ans: 'The power output is 245 Watts.'
                    },
                    {
                      t: 'Example 3',
                      q: 'A car engine exerts a force of 2000 N to move the car 500 metres in 25 seconds.',
                      steps: ['W = F × d = 2000 × 500 = 1,000,000 J', 'P = W/t = 1,000,000 / 25 = 40,000 W = 40 kW'],
                      ans: 'The power output is 40,000 Watts or 40 kW.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 8: Engine Power */}
            <div
              ref={(el) => {
                sectionRefs.current['engine-power'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Engine Power &amp; Performance
              </h2>

              {/* 4-stroke cycle */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Power Production in an Engine Cylinder (4-Stroke Cycle)</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { n: '1. Intake Stroke', d: 'The intake valve opens, and the piston moves downward, drawing in a mixture of air and fuel (gasoline engine) or just air (diesel engine).' },
                    { n: '2. Compression Stroke', d: 'Both intake and exhaust valves are closed. The piston moves upward, compressing the air-fuel mixture, increasing its temperature and pressure.' },
                    { n: '3. Power Stroke', d: 'Near the top of the compression stroke, the air-fuel mixture is ignited. The rapid combustion creates high heat and pressure. Expanding gases force the piston downward, producing power.' },
                    { n: '4. Exhaust Stroke', d: 'The exhaust valve opens, and the piston moves upward, expelling the burned gases from the cylinder. This cycle then repeats.' },
                  ].map((stroke, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} ${i === 2 ? 'border-red-500' : 'border-blue-500'}`}>
                      <p className={`font-black text-xs uppercase mb-2 ${i === 2 ? (isDarkMode ? 'text-red-400' : 'text-red-700') : subHead}`}>{stroke.n}</p>
                      <p className={`text-xs ${textMuted}`}>{stroke.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicated and Brake Power */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Indicated Power (IP)</h3>
                  <p className={`text-sm mb-3 ${textMuted}`}>The theoretical power developed inside the engine cylinders by the combustion of fuel. It represents the power available before any losses due to friction or other factors.</p>
                  <MathBlock isDarkMode={isDarkMode}>IP = (P × L × A × N) / 60  [for one cylinder]</MathBlock>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mt-3`}>
                    <p className={`text-xs font-bold mb-2 ${subHead}`}>Where:</p>
                    <ul className={`text-xs space-y-1 ${textMuted}`}>
                      <li>P = Indicated mean effective pressure (IMEP) in N/m² or Pa</li>
                      <li>L = Length of the piston stroke in metres</li>
                      <li>A = Area of the piston in m²</li>
                      <li>N = Number of power strokes per second (4-stroke: N = RPM/120; 2-stroke: N = RPM/60)</li>
                    </ul>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mt-3`}>
                    <p className={`text-xs font-bold mb-1 ${subHead}`}>Example: 4-Cylinder Engine</p>
                    <p className={`text-xs ${textMuted} mb-1`}>IMEP = 800 kPa, Stroke = 100 mm, Bore = 80 mm, 3000 RPM</p>
                    <MathBlock isDarkMode={isDarkMode}>A = π(0.04)² ≈ 0.005027 m²</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>N = 3000/120 = 25 power strokes/sec</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>IP = (800000 × 0.1 × 0.005027 × 25) / 60 ≈ 1.67 kW per cylinder</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>IP (engine) = 1.67 kW × 4 ≈ 6.68 kW</MathBlock>
                  </div>
                </div>
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Brake Power (BP)</h3>
                  <p className={`text-sm mb-3 ${textMuted}`}>The actual power delivered by the engine at the crankshaft or flywheel. It is the power available to drive the vehicle after accounting for friction and other losses.</p>
                  <MathBlock isDarkMode={isDarkMode}>BP = (2πNT) / 60</MathBlock>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mt-3`}>
                    <p className={`text-xs font-bold mb-2 ${subHead}`}>Where:</p>
                    <ul className={`text-xs space-y-1 ${textMuted}`}>
                      <li>π ≈ 3.14159</li>
                      <li>N = Engine speed in RPM</li>
                      <li>T = Torque at the crankshaft in Nm</li>
                    </ul>
                  </div>
                  <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                    <p className={`text-xs font-bold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Farnborough Indicator</p>
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>A device that measures pressure inside an engine cylinder during combustion. It produces a pressure-volume (PV) diagram from which the IMEP can be determined, allowing calculation of indicated power.</p>
                  </div>
                </div>
              </div>

              {/* Morse Test */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Morse Test Procedure</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>The Morse test is a method used to determine the indicated power (IP) of a multi-cylinder internal combustion engine.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Procedure</p>
                    <div className="space-y-2">
                      {['Run the engine at constant speed and load.', 'Measure brake power (BP) using a dynamometer.', 'Cut out one cylinder (short spark plug or disconnect fuel).', 'Adjust engine load to maintain the same speed.', 'Measure the new brake power output.', 'Repeat steps 3–5 for each cylinder.', 'Calculate IP for each cylinder and total IP.'].map((step, i) => (
                        <div key={i} className={`flex gap-2 items-start p-2 rounded ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 bg-blue-600`}>{i + 1}</span>
                          <p className={`text-xs ${textMuted}`}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Formulas &amp; Example</p>
                    <MathBlock isDarkMode={isDarkMode}>IP (cylinder) = BP (all cylinders) − BP (cylinder cut out)</MathBlock>
                    <MathBlock isDarkMode={isDarkMode}>FP = IP − BP</MathBlock>
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mt-3`}>
                      <p className={`text-xs font-bold mb-2 ${subHead}`}>Example (4-cylinder engine):</p>
                      <p className={`text-xs ${textMuted}`}>BP (all) = 40 kW | Cut 1: 30 kW | Cut 2: 31 kW | Cut 3: 32 kW | Cut 4: 33 kW</p>
                      <MathBlock isDarkMode={isDarkMode}>IP cyl1 = 40−30=10 kW  |  IP cyl2 = 40−31=9 kW</MathBlock>
                      <MathBlock isDarkMode={isDarkMode}>IP cyl3 = 40−32=8 kW  |  IP cyl4 = 40−33=7 kW</MathBlock>
                      <MathBlock isDarkMode={isDarkMode}>Total IP = 10+9+8+7 = 34 kW</MathBlock>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mechanical Efficiency, Fuel Consumption, Thermal Efficiency */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    t: '8.5 Mechanical Efficiency (ηm)',
                    d: 'The ratio of brake power (BP) to indicated power (IP). Represents the proportion of indicated power actually delivered at the crankshaft. The higher the mechanical efficiency, the less power is lost to friction.',
                    f: 'ηm = (BP / IP) × 100%',
                    ex: 'IP = 50 kW, BP = 40 kW → ηm = (40/50) × 100% = 80%',
                    color: 'blue'
                  },
                  {
                    t: '8.6 Fuel Consumption',
                    d: 'The amount of fuel an engine uses per unit of time or distance. Measured in litres per 100 km (L/100 km) or miles per gallon (mpg). Specific fuel consumption (SFC) is the amount of fuel consumed per unit of power output per unit of time (e.g., kg/kWh).',
                    f: 'SFC = Fuel mass / (Power × Time)',
                    ex: 'Factors: Engine design, driving conditions, vehicle aerodynamics, maintenance, fuel quality.',
                    color: 'green'
                  },
                  {
                    t: '8.7 Thermal Efficiency (ηth)',
                    d: 'The ratio of the work done by the engine to the heat energy supplied by the fuel. Thermal efficiency is always less than 100% due to heat losses. Factors: compression ratio, combustion efficiency, engine design, operating conditions.',
                    f: 'ηth = (Work Output / Heat Input) × 100%',
                    ex: 'Higher compression ratios generally increase thermal efficiency.',
                    color: 'purple'
                  }
                ].map((item, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    item.color === 'blue' ? 'border-blue-500' : item.color === 'green' ? 'border-green-500' : 'border-purple-500'
                  }`}>
                    <h4 className={`font-black uppercase text-sm mb-2 ${textHead}`}>{item.t}</h4>
                    <p className={`text-xs mb-3 ${textMuted}`}>{item.d}</p>
                    <MathBlock isDarkMode={isDarkMode}>{item.f}</MathBlock>
                    <p className={`text-xs italic ${textMuted}`}>{item.ex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 9: Tractive Effort and Resistance */}
            <div
              ref={(el) => {
                sectionRefs.current['tractive-effort'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tractive Effort &amp; Resistance
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>Tractive Effort</h4>
                  <p className={`text-sm ${textMuted}`}>The force exerted by a vehicle's engine or motor to propel it forward. It is the force that overcomes resistance and accelerates the vehicle.</p>
                </div>
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>Resistance</h4>
                  <p className={`text-sm ${textMuted}`}>The opposing force that hinders the motion of a vehicle. Includes factors like rolling resistance, air resistance, and gradient resistance.</p>
                </div>
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Level Ground</h3>
                <MathBlock isDarkMode={isDarkMode}>Constant velocity: T = R</MathBlock>
                <MathBlock isDarkMode={isDarkMode}>Acceleration: T − R = ma</MathBlock>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    { t: 'Constant Velocity', q: 'A car traveling at constant speed on a level road experiences a resistance of 500 N.', steps: ['T = R', 'T = 500 N'], ans: 'Tractive effort = 500 N.' },
                    { t: 'Acceleration', q: 'A train (10,000 kg) accelerates at 0.5 m/s² on a level track. Resistance = 2,000 N.', steps: ['T = ma + R', 'T = (10000 × 0.5) + 2000', 'T = 5000 + 2000 = 7000 N'], ans: 'Tractive effort = 7,000 N.' },
                    { t: 'Rolling Resistance', q: 'A truck (5000 kg) at constant velocity. Rolling resistance = 0.02 × weight.', steps: ['Weight = 5000 × 9.8 = 49000 N', 'Rolling resistance = 0.02 × 49000 = 980 N', 'T = 980 N'], ans: 'Tractive effort = 980 N.' }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Inclined Plane</h3>
                <MathBlock isDarkMode={isDarkMode}>Constant velocity up incline: T = R + Wsinθ</MathBlock>
                <MathBlock isDarkMode={isDarkMode}>Acceleration up incline: T − R − Wsinθ = ma</MathBlock>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      t: 'Constant Velocity Up Incline',
                      q: 'A car (weight 15,000 N) travels up a 10° incline at constant speed. Resistance = 800 N.',
                      steps: ['T = R + Wsinθ', 'T = 800 + (15000 × sin10°)', 'T = 800 + (15000 × 0.1736)', 'T = 800 + 2604 = 3404 N'],
                      ans: 'Tractive effort = 3,404 N.'
                    },
                    {
                      t: 'Acceleration Up Incline',
                      q: 'A truck (8,000 kg) accelerates at 0.2 m/s² up a 5° incline. Resistance = 1,200 N.',
                      steps: ['W = 8000 × 9.8 = 78400 N', 'T = ma + R + Wsinθ', 'T = (8000×0.2) + 1200 + (78400×sin5°)', 'T = 1600 + 1200 + 6836 = 9636 N'],
                      ans: 'Tractive effort = 9,636 N.'
                    },
                    {
                      t: 'Constant Velocity Down Incline',
                      q: 'A bicycle+rider (800 N) travel down a 7° incline at constant velocity. Air resistance = 50 N. What braking force is required?',
                      steps: ['Braking force = Wsinθ − air resistance', 'Braking force = 800×sin7° − 50', 'Braking force = 97.44 − 50 = 47.44 N'],
                      ans: 'Required braking force = 47.44 N.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 10: Friction */}
            <div
              ref={(el) => {
                sectionRefs.current['friction'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Friction
              </h2>

              <p className={`text-sm ${textMuted}`}>Friction is a force that opposes the relative motion or tendency of relative motion of two surfaces in contact. It acts parallel to the surfaces and in the opposite direction of motion or intended motion.</p>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Boundary Friction', d: 'Occurs when two surfaces are in contact with each other, but there is a very thin layer of lubricant between them. The lubricant layer is not thick enough to completely separate the surfaces, so some direct contact occurs. Relatively high friction; can lead to wear if the lubricant film is insufficient. Examples: piston rings against cylinder walls during cold starts; valve train components.', color: 'amber' },
                  { t: 'Dry Friction (Coulomb Friction)', d: 'Occurs when two solid surfaces are in direct contact with no lubricant present. Independent of the contact area. Dependent on the normal force and the coefficient of friction. Can be static (opposing the start of motion) or kinetic (opposing motion once it has started). Examples: brake pads pressing against rotors; tires sliding on dry pavement during a skid; clutch plates during engagement.', color: 'red' },
                  { t: 'Fluid Friction (Viscous Friction)', d: 'Occurs when there is a fluid (liquid or gas) between the surfaces. The fluid acts as a lubricant, separating the surfaces and reducing friction. Dependent on the viscosity of the fluid and the relative velocity of the surfaces. Examples: engine bearings lubricated by oil; transmission gears lubricated by oil; air resistance on vehicle body; viscous damping in shock absorbers.', color: 'blue' },
                ].map((type, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    type.color === 'amber' ? 'border-amber-500' : type.color === 'red' ? 'border-red-500' : 'border-blue-500'
                  }`}>
                    <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{type.t}</h4>
                    <p className={`text-sm ${textMuted}`}>{type.d}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h4 className={`font-black uppercase text-base mb-3 ${textHead}`}>Factors Affecting Frictional Resistance</h4>
                  <ul className="space-y-2">
                    {['Nature of the Materials: Rougher surfaces generally have higher friction.', 'Normal Force: Greater normal force results in higher friction.', 'Surface Roughness: Rougher surfaces interlock more, increasing friction.', 'Presence of Lubricants: Lubricants reduce friction by separating the surfaces.', 'Temperature: Can affect the properties of materials and lubricants.', 'Velocity: The relative velocity can affect friction, especially in fluid friction.'].map((item, i) => (
                      <li key={i} className={`text-sm flex gap-2 items-start ${textMuted}`}><CheckCircle size={14} className="mt-0.5 text-blue-500 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h4 className={`font-black uppercase text-base mb-3 ${textHead}`}>Laws of Friction</h4>
                  <div className="space-y-3">
                    {[
                      { l: 'Law 1 (Normal Force)', d: 'The force of friction is directly proportional to the normal force pressing the surfaces together.' },
                      { l: 'Law 2 (Independence of Area)', d: 'The force of friction is independent of the apparent area of contact between the surfaces.' },
                      { l: 'Law 3 (Nature of Surfaces)', d: 'The force of friction depends on the nature of the materials in contact.' },
                      { l: 'Law 4 (Static vs. Kinetic)', d: 'The force of static friction (opposing the start of motion) is generally greater than the force of kinetic friction (opposing motion once it has started).' },
                    ].map((law, i) => (
                      <div key={i}>
                        <span className={`text-xs font-bold uppercase ${subHead}`}>{law.l}: </span>
                        <span className={`text-xs ${textMuted}`}>{law.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Friction Formula and Examples */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Solving Problems Involving Frictional Resistance</h3>
                <MathBlock isDarkMode={isDarkMode}>Frictional Force (Ff) = Coefficient of Friction (μ) × Normal Force (N)</MathBlock>
                <MathBlock isDarkMode={isDarkMode}>Ff = μN</MathBlock>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      t: 'Example 1: Horizontal Surface',
                      q: 'A 50 kg box rests on a horizontal floor. Coefficient of static friction = 0.4. Calculate the force required to start moving the box.',
                      steps: ['N = mg = 50 × 9.8 = 490 N', 'Ff = μsN = 0.4 × 490 = 196 N'],
                      ans: 'The force required to start moving the box is 196 N.'
                    },
                    {
                      t: 'Example 2: Inclined Plane',
                      q: 'A 100 N block on an inclined plane at 30°. Coefficient of kinetic friction = 0.2. Calculate the frictional force as it slides down.',
                      steps: ['N = Wcos(θ) = 100 × cos(30°) ≈ 86.6 N', 'Ff = μkN = 0.2 × 86.6 ≈ 17.32 N'],
                      ans: 'The frictional force is approximately 17.32 N.'
                    },
                    {
                      t: 'Example 3: Finding Coefficient of Friction',
                      q: 'A 20 kg object is pulled horizontally with 80 N and moves at constant velocity. Calculate the coefficient of kinetic friction.',
                      steps: ['N = mg = 20 × 9.8 = 196 N', 'Ff = 80 N (constant velocity → applied force = friction)', 'μk = Ff / N = 80 / 196 ≈ 0.408'],
                      ans: 'The coefficient of kinetic friction is approximately 0.408.'
                    },
                    {
                      t: 'Example 4: Force to Prevent Sliding',
                      q: 'A 10 kg box rests on a 20° incline. Coefficient of static friction = 0.3. What force parallel to the incline prevents sliding?',
                      steps: ['N = mg×cos(20°) = 98 × 0.9396 = 92.08 N', 'Ff = μs×N = 0.3 × 92.08 = 27.62 N', 'Force down incline = mg×sin(20°) = 98 × 0.342 = 33.52 N', 'Force required = 33.52 − 27.62 = 5.9 N'],
                      ans: 'The force required is 5.9 N.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friction in Bearings, Clutch */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-base mb-3 ${textHead}`}>2 Friction in Bushed and Shell Bearings</h3>
                  <div className="space-y-3">
                    {[
                      { t: 'Bushed Bearings', d: 'A cylindrical bush (sleeve) fits into a housing with a rotating shaft inside. Primarily boundary friction occurs during start-up or low-speed operation. As speed increases, a hydrodynamic film can develop, reducing friction to fluid friction. Factors: load, speed, lubricant viscosity, surface finish.' },
                      { t: 'Shell Bearings', d: 'Two or more half-shells fit around a journal (shaft). Designed for hydrodynamic lubrication, minimizing boundary friction. Fluid friction predominates during normal operation with a full fluid film separating the journal and shell. Used in high load and high RPM applications like crankshaft main bearings and connecting rod bearings.' },
                    ].map((item, i) => (
                      <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                        <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{item.t}</p>
                        <p className={`text-xs ${textMuted}`}>{item.d}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs mb-2 ${subHead}`}>Frictional Torque in Bearings:</p>
                    <MathBlock isDarkMode={isDarkMode}>Tf = μ × N × r</MathBlock>
                    <p className={`text-xs italic mb-2 ${textMuted}`}>Example: Load = 5000 N, radius = 50 mm, μ = 0.02</p>
                    <MathBlock isDarkMode={isDarkMode}>Tf = 0.02 × 5000 × 0.05 = 5 Nm</MathBlock>
                  </div>
                </div>
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-base mb-3 ${textHead}`}>3 Torque Transmission by a Clutch</h3>
                  <p className={`text-xs mb-3 ${textMuted}`}>A clutch engages or disengages power transmission between two rotating shafts using friction. When engaged, friction between the clutch plate and flywheel transmits torque from the engine to the transmission.</p>
                  <MathBlock isDarkMode={isDarkMode}>T = μ × Fa × rm × n</MathBlock>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mt-2`}>
                    <p className={`text-xs font-bold mb-1 ${subHead}`}>Where: μ = Coefficient of friction, Fa = Axial force (N), rm = Mean radius (m), n = Number of friction surfaces</p>
                    <p className={`text-xs italic mb-2 ${textMuted}`}>Example: Single-plate clutch, rm = 0.15 m, Fa = 3000 N, μ = 0.3</p>
                    <MathBlock isDarkMode={isDarkMode}>T = 0.3 × 3000 × 0.15 × 2 = 270 Nm</MathBlock>
                  </div>
                  <div className="space-y-2 mt-3">
                    <p className={`font-bold text-xs uppercase ${subHead}`}>Factors Affecting Clutch Torque:</p>
                    {['Coefficient of Friction (μ): Higher friction materials transmit more torque.', 'Number of Friction Surfaces (n): More friction surfaces = greater torque.', 'Mean Radius (rm): Larger mean radius provides greater moment arm.', 'Axial Force (Fa): Greater axial force increases frictional force and torque capacity.', 'Condition of Friction Surfaces: Worn or contaminated surfaces reduce torque.'].map((f, i) => (
                      <p key={i} className={`text-xs ${textMuted}`}>• {f}</p>
                    ))}
                  </div>
                  <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>Clutch Safety Factor</p>
                    <MathBlock isDarkMode={isDarkMode}>Safety Factor = Maximum Clutch Torque / Engine Torque</MathBlock>
                    <p className={`text-xs ${textMuted}`}>A safety factor greater than 1 means the clutch can transmit more torque than the engine produces. For example, a safety factor of 1.5 means the clutch can handle 1.5 times the engine's torque output.</p>
                  </div>
                </div>
              </div>

              {/* Lubricants */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Effects of Lubricants on Frictional Surfaces</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {[
                    { t: 'Reduced Friction', d: 'Lubricants create a thin film between surfaces, reducing direct contact and thus minimizing friction. This reduces wear, heat generation, and power loss.' },
                    { t: 'Wear Prevention', d: 'Lubricants prevent direct contact between surfaces, reducing abrasive wear and extending the lifespan of components.' },
                    { t: 'Heat Dissipation', d: 'Lubricants can carry away heat generated by friction, preventing overheating and thermal damage.' },
                    { t: 'Corrosion Protection', d: 'Lubricants can form a protective barrier against moisture and corrosive substances, preventing rust and corrosion.' },
                    { t: 'Noise Reduction', d: 'Lubricants can dampen vibrations and reduce noise generated by friction.' },
                    { t: 'Types of Lubrication', d: 'Boundary Lubrication: Lubricant film is very thin, some direct contact occurs. Fluid Lubrication (Hydrodynamic/Hydrostatic): Full fluid film separates the surfaces, minimizing friction.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
                <div className={examTipClasses}>
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="text-yellow-600" size={16} />
                    <span className={`font-black uppercase text-xs ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Extreme Pressure (EP) / Hypoid Oils for Heavy Loads</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>Under heavy loads, conventional lubricants may fail. EP additives form a protective layer on metal surfaces, preventing welding and scuffing. Hypoid gears (used in vehicle differentials) have sliding contact between teeth, resulting in very high pressures and temperatures — hypoid oils with EP additives are specifically formulated for these conditions. Requirements: High load-carrying capacity, anti-wear properties, thermal stability, oxidation resistance, and corrosion protection. Applications: Vehicle differentials with hypoid gears, heavy-duty transmissions, industrial gear drives.</p>
                </div>
              </div>
            </div>

            {/* SECTION 11: Stress and Strain */}
            <div
              ref={(el) => {
                sectionRefs.current['stress-strain'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Stress, Strain &amp; Materials
              </h2>

              {/* Types of Forces on Motor Vehicle Equipment */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Types of Forces Acting on Motor Vehicle Equipment</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { t: 'Tensile Force', d: 'A pulling force that tends to stretch or elongate a material. Examples: tow cables, timing belts, bolts holding cylinder heads, tie rods.', arrow: '←——[Material]——→' },
                    { t: 'Compressive Force', d: 'A pushing force that tends to compress or shorten a material. Examples: suspension springs, engine connecting rods during compression stroke, vehicle chassis when loaded, pillars during a roll over.', arrow: '→——[Material]——←' },
                    { t: 'Shear Force', d: 'A force that tends to cause one part of a material to slide past another. Examples: bolts holding wheel hubs, rivets joining body panels, keyways in shafts, brake caliper bolts.', arrow: '[Top]→ / ←[Bottom]' },
                    { t: 'Compound Force', d: 'A combination of two or more forces acting simultaneously. Examples: crankshaft during engine operation (tension + compression + shear), suspension components during cornering, gear teeth.', arrow: 'Multiple forces combined' },
                    { t: 'Torsion Force', d: 'A twisting force that tends to rotate a material. Examples: drive shafts, axles, crankshaft, steering shafts.', arrow: '↻ Twisting motion ↺' },
                  ].map((type, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} ${
                      i === 0 ? 'border-blue-500' : i === 1 ? 'border-green-500' : i === 2 ? 'border-red-500' : i === 3 ? 'border-purple-500' : 'border-amber-500'
                    }`}>
                      <p className={`font-black text-xs uppercase mb-1 ${textHead}`}>{type.t}</p>
                      <p className={`text-xs mb-2 ${textMuted}`}>{type.d}</p>
                      <p className={`font-mono text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>{type.arrow}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stress and Strain */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Stress (Normal or Direct)</h3>
                  <p className={`text-sm mb-3 ${textMuted}`}>Stress (normal or direct) is the internal resistance offered by a material to an externally applied force per unit area.</p>
                  <MathBlock isDarkMode={isDarkMode}>Stress (σ) = Force (F) / Area (A)</MathBlock>
                  <p className={`text-xs mb-4 ${textMuted}`}>SI Units: Pascal (Pa) = N/m². Common units: MPa, kPa, psi.</p>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`text-xs italic mb-2 ${textMuted}`}>Example: Steel rod, area = 0.001 m², force = 10,000 N</p>
                    <MathBlock isDarkMode={isDarkMode}>σ = 10,000 / 0.001 = 10,000,000 Pa = 10 MPa</MathBlock>
                  </div>
                </div>
                <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Direct Strain</h3>
                  <p className={`text-sm mb-3 ${textMuted}`}>Direct strain (ε) is the measure of deformation of a material when subjected to a force. It is a dimensionless quantity.</p>
                  <MathBlock isDarkMode={isDarkMode}>ε = ΔL / L  (change in length / original length)</MathBlock>
                  <p className={`text-xs mb-4 ${textMuted}`}>Strain is dimensionless — it represents the amount of deformation per unit length.</p>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`text-xs italic mb-2 ${textMuted}`}>Example: 2-metre metal bar stretched by 2 mm</p>
                    <MathBlock isDarkMode={isDarkMode}>ε = 0.002 m / 2 m = 0.001 (dimensionless)</MathBlock>
                  </div>
                </div>
              </div>

              {/* Elasticity and Hooke's Law */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Elasticity, Hooke's Law &amp; Young's Modulus</h3>
                <p className={`text-sm mb-3 ${textMuted}`}><strong>Elasticity</strong> is the ability of a material to return to its original shape after the removal of an applied force.</p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>Hooke's Law</p>
                    <p className={`text-xs mb-2 ${textMuted}`}>Within the elastic limit, stress is directly proportional to strain.</p>
                    <MathBlock isDarkMode={isDarkMode}>σ = E × ε</MathBlock>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>Young's Modulus (E)</p>
                    <p className={`text-xs mb-2 ${textMuted}`}>The modulus of elasticity. E = Stress / Strain.</p>
                    <MathBlock isDarkMode={isDarkMode}>E = σ / ε</MathBlock>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>Example</p>
                    <p className={`text-xs mb-1 ${textMuted}`}>E = 200 GPa, σ = 400 MPa</p>
                    <MathBlock isDarkMode={isDarkMode}>ε = σ / E = 400/200000 = 0.002</MathBlock>
                  </div>
                </div>

                {/* Worked problems */}
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      t: 'Tensile Stress and Strain',
                      q: 'A steel wire (original length 5 m) is stretched by 5 mm by a tensile force of 1000 N. Cross-sectional area = 1 mm².',
                      steps: ['A = 1 mm² = 1×10⁻⁶ m²', 'σ = 1000 / 1×10⁻⁶ = 1×10⁹ Pa = 1 GPa', 'ΔL = 5 mm = 0.005 m', 'ε = 0.005 / 5 = 0.001'],
                      ans: 'Stress = 1 GPa, Strain = 0.001.'
                    },
                    {
                      t: 'Compressive Stress and Strain',
                      q: 'A concrete cylinder (diameter 150 mm, height 300 mm) is subjected to a compressive force of 500 kN. Height decreases by 0.5 mm.',
                      steps: ['A = π(0.075)² ≈ 0.01767 m²', 'σ = 500000 / 0.01767 ≈ 28.3 MPa', 'ε = 0.0005 / 0.3 ≈ 0.00167'],
                      ans: 'Stress ≈ 28.3 MPa, Strain ≈ 0.00167.'
                    },
                    {
                      t: "Young's Modulus Example",
                      q: 'A steel rod (2 m long, area 2 cm²) is stretched by 1 mm under a tensile force of 40 kN.',
                      steps: ['A = 2×10⁻⁴ m²', 'σ = 40000 / 2×10⁻⁴ = 200 MPa', 'ε = 0.001 / 2 = 0.0005', 'E = 200×10⁶ / 0.0005 = 400 GPa'],
                      ans: "Young's Modulus = 400 GPa."
                    },
                    {
                      t: 'Force from Young\'s Modulus',
                      q: 'Wire of length 4 m, diameter 2 mm, stretched by 1 mm. Young\'s modulus = 200 GPa.',
                      steps: ['A = π×(0.001)² ≈ 3.14159×10⁻⁶ m²', 'ε = 0.001/4 = 0.00025', 'σ = E × ε = 200×10⁹ × 0.00025 = 50×10⁶ Pa', 'F = σ × A = 50×10⁶ × 3.14×10⁻⁶ ≈ 157.08 N'],
                      ans: 'Force applied is approximately 157.08 N.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load-Extension Diagram */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>5 Points on a Load-Extension Diagram</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { t: 'Limit of Proportionality', d: 'The point up to which stress is directly proportional to strain. Hooke\'s law is valid up to this point. Beyond this, the relationship becomes non-linear.', c: 'blue' },
                    { t: 'Elastic Limit', d: 'The maximum stress a material can withstand without permanent deformation. If the load is removed before this point, the material returns to its original shape.', c: 'green' },
                    { t: 'Yield Point', d: 'The point at which the material begins to deform significantly without a substantial increase in load. There may be upper and lower yield points. This is where plastic deformation begins.', c: 'amber' },
                    { t: 'Maximum Load (UTS)', d: 'The highest load (or stress) the material can withstand before it begins to neck down (reduce in cross-sectional area). Beyond this, load-carrying capacity decreases.', c: 'orange' },
                    { t: 'Fracture Point (Breaking Point)', d: 'The point at which the material breaks or fractures. The load drops rapidly at this point — where the material physically fails.', c: 'red' },
                  ].map((point, i) => (
                    <div key={i} className={`p-4 rounded-lg ${
                      point.c === 'blue' ? 'border-blue-500' : point.c === 'green' ? 'border-green-500' : point.c === 'amber' ? 'border-amber-500' : point.c === 'orange' ? 'border-orange-500' : 'border-red-500'
                    } ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-1 ${textHead}`}>{point.t}</p>
                      <p className={`text-xs ${textMuted}`}>{point.d}</p>
                    </div>
                  ))}
                </div>

                {/* Elastic Limits Table */}
                <div className="mt-6">
                  <h4 className={`font-black uppercase text-sm mb-3 ${textHead}`}>Elastic Limits for Common Engineering Materials</h4>
                  <Table
                    isDarkMode={isDarkMode}
                    headers={['Material', 'Elastic Limit (approx.)']}
                    rows={[
                      ['Mild Steel', '200–250 MPa'],
                      ['High-Strength Steel', '300–1000 MPa or more'],
                      ['Aluminum Alloys', '50–500 MPa (depending on alloy and temper)'],
                      ['Copper Alloys', '50–400 MPa'],
                      ['Gray Cast Iron', '100–300 MPa (in compression)'],
                      ['Concrete', '2–5 MPa (tension), 20–50 MPa (compression)'],
                      ['Wood', 'Varies widely depending on species and grain direction'],
                    ]}
                  />
                </div>
              </div>

              {/* Effects of Overloading */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>6 Effects of Overloading on Materials</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { t: 'Elastic Deformation', d: 'If the load is within the elastic limit, the material will deform but return to its original shape when the load is removed.' },
                    { t: 'Plastic Deformation', d: 'If the load exceeds the elastic limit, the material will undergo permanent deformation, meaning it will not return to its original shape.' },
                    { t: 'Yielding', d: 'At the yield point, the material begins to deform significantly with little or no increase in load.' },
                    { t: 'Fracture', d: 'If the load continues to increase beyond the ultimate tensile strength, the material will eventually fracture or break.' },
                    { t: 'Fatigue Failure', d: 'Repeated overloading can lead to fatigue failure even if the load is below the yield strength. This occurs due to the accumulation of microscopic damage.' },
                    { t: 'Creep', d: 'Under sustained loading at elevated temperatures, materials can experience creep — a slow and continuous deformation over time.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shear Stress and Strain */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>7 Shear Stress, Shear Strain &amp; Shear Modulus</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-2 ${subHead}`}>Shear Stress (τ)</p>
                    <p className={`text-xs mb-2 ${textMuted}`}>Stress component that acts parallel to a cross-sectional area. Arises when forces cause sliding.</p>
                    <MathBlock isDarkMode={isDarkMode}>τ = F / A</MathBlock>
                    <p className={`text-xs ${textMuted}`}>Units: Pa, MPa</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-2 ${subHead}`}>Shear Strain (γ)</p>
                    <p className={`text-xs mb-2 ${textMuted}`}>Deformation caused by shear stress. Defined as the tangent of the angle of deformation.</p>
                    <MathBlock isDarkMode={isDarkMode}>γ = Δx / L  or  γ = tan(θ)</MathBlock>
                    <p className={`text-xs ${textMuted}`}>Dimensionless</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <p className={`font-bold text-xs uppercase mb-2 ${subHead}`}>Shear Modulus (G)</p>
                    <p className={`text-xs mb-2 ${textMuted}`}>Within the elastic limit, shear stress is directly proportional to shear strain.</p>
                    <MathBlock isDarkMode={isDarkMode}>τ = G × γ  →  G = τ / γ</MathBlock>
                    <p className={`text-xs ${textMuted}`}>Units: GPa</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      t: 'Shear Stress Calculation',
                      q: 'A bolt (diameter 10 mm) is subjected to a shear force of 5 kN.',
                      steps: ['A = π(0.005)² ≈ 7.85×10⁻⁵ m²', 'τ = 5000 / 7.85×10⁻⁵ ≈ 63.69 MPa'],
                      ans: 'Shear stress ≈ 63.69 MPa.'
                    },
                    {
                      t: 'Shear Strain Calculation',
                      q: 'A rectangular block: top surface displaces laterally by 0.5 mm, height = 50 mm.',
                      steps: ['γ = Δx / L = 0.0005 / 0.05 = 0.01'],
                      ans: 'Shear strain = 0.01.'
                    },
                    {
                      t: 'Shear Modulus Calculation',
                      q: 'Shear stress = 30 MPa, shear strain = 0.0002.',
                      steps: ['G = τ / γ = 30×10⁶ / 0.0002 = 150×10⁹ Pa = 150 GPa'],
                      ans: 'Shear modulus = 150 GPa.'
                    },
                    {
                      t: 'Displacement Calculation',
                      q: 'A steel cube (100 mm sides): shear modulus = 80 GPa, shear stress = 40 MPa. Find top surface displacement.',
                      steps: ['γ = τ / G = 40×10⁶ / 80×10⁹ = 0.0005', 'Displacement = γ × L = 0.0005 × 100 mm = 0.05 mm'],
                      ans: 'Top surface displaces 0.05 mm.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Factor */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>8 Importance of Safety Factor on Materials</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>The safety factor (or factor of safety) is the ratio of the material's ultimate strength to the working stress. It ensures that the material can withstand loads beyond its design capacity.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {['Preventing Failure: Accounts for uncertainties in material properties, manufacturing variations, and load estimations.', 'Accounting for Dynamic Loads: Dynamic loads (impact, vibration) can cause stresses higher than static loads. The safety factor provides a buffer.', 'Allowing for Environmental Factors: Temperature, corrosion, and other environmental factors can weaken materials.', 'Providing a Margin of Error: Design calculations may have inaccuracies or simplifications.', 'Accounting for Material Defects: Materials may have microscopic flaws or imperfections.', 'Ensuring Longevity: Reduces fatigue failure due to repeated loading, extending service life.', 'Maintaining Public Safety: In critical applications (bridges, aircraft), a high safety factor is essential.'].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${textMuted}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 12: Simple Machines */}
            <div
              ref={(el) => {
                sectionRefs.current['machines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Simple Machines
              </h2>

              <p className={`text-sm ${textMuted}`}>A simple machine is a basic mechanical device that modifies force or motion. It makes work easier by changing the magnitude or direction of a force. Simple machines reduce the amount of force required to do a specific task, but they do not reduce the amount of work required.</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { t: 'Lever', d: 'A rigid bar that pivots on a fixed point (fulcrum). Can amplify force or distance. Used for lifting heavy objects, prying, and cutting. Examples: crowbars, seesaws, scissors.' },
                  { t: 'Inclined Plane', d: 'A flat surface tilted at an angle. Reduces the force required to move an object vertically by spreading the work over a longer distance. Examples: ramps, screws.' },
                  { t: 'Screw Jack', d: 'Uses a screw thread to convert rotational motion into linear motion. Provides a large mechanical advantage for lifting heavy loads. Examples: car jacks, adjustable table legs.' },
                  { t: 'Hydraulic Jack and Press', d: 'Uses pressurized fluid to transmit force and amplify it, based on Pascal\'s principle. Examples: vehicle lifts, hydraulic presses, hydraulic brakes.' },
                  { t: 'Pulley Block System', d: 'Uses multiple pulleys and ropes to reduce the force required to lift a load. The mechanical advantage increases with the number of supporting ropes. Examples: block and tackle, cranes.' },
                  { t: 'Gear Systems', d: 'Uses toothed wheels to transmit and modify rotational motion and torque. Can change speed, torque, or direction of rotation. Examples: vehicle gearboxes, power tools, watches. Can decrease speed while increasing torque, and vice versa.' },
                ].map((machine, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                    ['border-blue-500', 'border-green-500', 'border-amber-500', 'border-purple-500', 'border-cyan-500', 'border-red-500'][i]
                  }`}>
                    <Wrench className={`mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                    <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{machine.t}</h4>
                    <p className={`text-sm ${textMuted}`}>{machine.d}</p>
                  </div>
                ))}
              </div>

              {/* MA, VR, ME Definitions */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Mechanical Advantage (MA)', f: 'MA = Load / Effort', d: 'The ratio of the output force (load) to the input force (effort). Indicates how much a machine multiplies the applied force.' },
                  { t: 'Velocity Ratio (VR)', f: 'VR = Effort Distance / Load Distance', d: 'The ratio of the distance moved by the effort to the distance moved by the load. Indicates how much the machine amplifies the distance moved.' },
                  { t: 'Mechanical Efficiency (ME)', f: 'ME = (MA / VR) × 100%', d: 'The ratio of the output work to the input work. Represents the effectiveness of a machine in converting input energy into useful output work.' },
                ].map((def, i) => (
                  <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                    <h4 className={`font-black uppercase text-sm mb-1 ${textHead}`}>{def.t}</h4>
                    <MathBlock isDarkMode={isDarkMode}>{def.f}</MathBlock>
                    <p className={`text-xs ${textMuted}`}>{def.d}</p>
                  </div>
                ))}
              </div>

              {/* Solving Problems for Each Machine */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-6 ${textHead}`}>1 Solving Problems Related to Simple Machines</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      t: '1. Lever',
                      formulas: ['MA = Load / Effort', 'VR = Effort Arm / Load Arm', 'ME = (MA / VR) × 100%'],
                      q: 'Lever lifts 500 N load with 100 N effort. Effort arm = 2 m, load arm = 0.4 m.',
                      steps: ['MA = 500/100 = 5', 'VR = 2/0.4 = 5', 'ME = (5/5) × 100% = 100%'],
                      ans: 'MA=5, VR=5, ME=100%'
                    },
                    {
                      t: '2. Inclined Plane',
                      formulas: ['MA = Load / Effort', 'VR = Length of Plane / Height of Plane', 'ME = (MA / VR) × 100%'],
                      q: '2000 N box pushed up a 5 m ramp to height 1 m. Force = 500 N.',
                      steps: ['MA = 2000/500 = 4', 'VR = 5/1 = 5', 'ME = (4/5) × 100% = 80%'],
                      ans: 'MA=4, VR=5, ME=80%'
                    },
                    {
                      t: '3. Screw Jack',
                      formulas: ['MA = Load / Effort', 'VR = 2πL / Pitch', 'ME = (MA / VR) × 100%'],
                      q: 'Handle length = 0.5 m, pitch = 0.005 m, load = 10,000 N, effort = 100 N.',
                      steps: ['MA = 10000/100 = 100', 'VR = (2π×0.5)/0.005 ≈ 628.32', 'ME = (100/628.32) × 100% ≈ 15.91%'],
                      ans: 'MA=100, VR≈628.32, ME≈15.91%'
                    },
                    {
                      t: '4. Hydraulic Jack',
                      formulas: ['MA = Area of Output Piston / Area of Input Piston', 'Force Output = Force Input × MA'],
                      q: 'Input piston area = 10 cm², output piston area = 100 cm², input force = 50 N.',
                      steps: ['MA = 100/10 = 10', 'Force Output = 50 × 10 = 500 N'],
                      ans: 'Force Output = 500 N'
                    },
                    {
                      t: '5. Pulley Block System',
                      formulas: ['MA = Load / Effort', 'VR = Number of Supporting Ropes', 'ME = (MA / VR) × 100%'],
                      q: '4 supporting ropes lift an 800 N load with an effort of 250 N.',
                      steps: ['MA = 800/250 = 3.2', 'VR = 4', 'ME = (3.2/4) × 100% = 80%'],
                      ans: 'MA=3.2, VR=4, ME=80%'
                    },
                    {
                      t: '6. Gear Systems',
                      formulas: ['Gear Ratio = Teeth on Driven Gear / Teeth on Driving Gear', 'Gear Ratio = Speed of Driving Gear / Speed of Driven Gear'],
                      q: 'Driving gear: 20 teeth. Driven gear: 60 teeth.',
                      steps: ['Gear Ratio = 60/20 = 3'],
                      ans: 'Gear Ratio = 3:1'
                    }
                  ].map((machine, i) => (
                    <div key={i} className={`p-5 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <h4 className={`font-black text-sm uppercase mb-2 ${subHead}`}>{machine.t}</h4>
                      <div className="mb-2">
                        {machine.formulas.map((f, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{f}</MathBlock>)}
                      </div>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{machine.q}</p>
                      {machine.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: {machine.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gearbox, Steering Box, Final Drive Ratios */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Gearbox, Steering Box &amp; Final Drive Ratios</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[
                    { t: 'Gearbox Ratios', d: 'Example gearbox: 1st = 3.5:1, 2nd = 2.0:1, 3rd = 1.3:1, 4th = 1:1, 5th = 0.8:1. In 1st gear, the engine turns 3.5 times for every 1 turn of the output shaft. Overall ratio = gearbox ratio × final drive ratio.' },
                    { t: 'Steering Box Ratios', d: 'Indicate how many degrees the steering wheel must turn to turn the wheels a certain degree. Example: A steering box ratio of 16:1 means the steering wheel must turn 16 degrees to turn the wheels 1 degree.' },
                    { t: 'Final Drive Ratios', d: 'The ratio between the ring gear and pinion gear in the differential. Example: 4.10:1 means the pinion turns 4.10 times for every 1 turn of the ring gear. Overall ratio = gearbox ratio × final drive ratio.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-2 ${subHead}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-2 ${subHead}`}>Problem Example</p>
                  <p className={`text-xs italic mb-2 ${textMuted}`}>A car has a gearbox ratio of 3:1 in first gear and a final drive ratio of 4:1. If the engine is turning at 3000 RPM, what is the speed of the drive wheels?</p>
                  <MathBlock isDarkMode={isDarkMode}>Overall Ratio = 3 × 4 = 12:1</MathBlock>
                  <MathBlock isDarkMode={isDarkMode}>Drive Wheel Speed = 3000 RPM / 12 = 250 RPM</MathBlock>
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Answer: Drive wheels rotate at 250 RPM.</p>
                </div>
              </div>
            </div>

            {/* SECTION 13: Heat */}
            <div
              ref={(el) => {
                sectionRefs.current['heat'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Heat
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <Flame className={`mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} size={28} />
                  <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>What is Heat?</h4>
                  <p className={`text-sm mb-2 ${textMuted}`}>Heat is a form of energy transferred between objects or systems due to a temperature difference. It flows from a region of higher temperature to a region of lower temperature.</p>
                  <p className={`text-sm ${textMuted}`}>SI Unit of Heat: Joule (J). Historically, the calorie (cal) was used — 1 calorie = approximately 4.186 joules.</p>
                </div>
                <div className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                  <Thermometer className={`mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={28} />
                  <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>What is Temperature?</h4>
                  <p className={`text-sm ${textMuted}`}>Temperature is a measure of the average kinetic energy of the particles within a substance. It indicates the degree of hotness or coldness of an object or system.</p>
                </div>
              </div>

              {/* Heat vs Temperature Table */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>1 Difference Between Heat and Temperature</h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Feature', 'Heat', 'Temperature']}
                  rows={[
                    ['Definition', 'Form of energy transferred due to temperature difference.', 'Measure of the average kinetic energy of particles.'],
                    ['Nature', 'Energy in transit.', 'A property of a substance.'],
                    ['Measurement', 'Measured in Joules (J) or calories (cal).', 'Measured in °C, K, or °F.'],
                    ['Transfer', 'Flows from hot to cold objects.', 'Does not flow; it is a state.'],
                    ['Quantity', 'Depends on the mass of the substance.', 'Independent of the mass of the substance.'],
                    ['Effect', 'Causes changes in temperature, phase, or volume.', 'Indicates the average kinetic energy of particles.'],
                    ['Example', 'The heat from a stove burner warms a pot of water.', 'The reading on a thermometer indicates the water\'s temperature.'],
                    ['Microscopic view', 'Total kinetic energy of all molecules in a substance.', 'Average kinetic energy of molecules in a substance.'],
                  ]}
                />
              </div>

              {/* Effects of Heat on Materials */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>2 Effects of Heat on Materials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { t: '1. Shape/Size (Thermal Expansion)', d: 'When materials are heated, their particles vibrate more vigorously, causing them to move further apart. This results in an increase in the material\'s dimensions. Conversely, cooling causes contraction. Motor vehicle examples: expansion of engine components (pistons, cylinders) during operation; expansion of brake rotors causing brake fade; expansion of vehicle body in hot weather.' },
                    { t: '2. Condition (Phase Changes)', d: 'Heat can cause materials to change their physical state (solid → liquid → gas). Melting: solid to liquid. Boiling/Evaporation: liquid to gas. Sublimation: solid to gas. Motor vehicle examples: fuel vaporization in combustion chamber; coolant boiling in radiator due to overheating; melting of solder in electrical connections.' },
                    { t: '3. Composition (Chemical Changes)', d: 'Heat can accelerate or initiate chemical reactions, leading to changes in chemical composition. Includes oxidation (rusting), combustion, and thermal decomposition. Motor vehicle examples: oxidation of exhaust system components; degradation of engine oil; combustion of fuel in the engine.' },
                    { t: '4. Colour (Incandescence/Changes)', d: 'Heating can cause materials to emit light (incandescence) or change their color. Motor vehicle examples: exhaust manifolds glowing red-hot under heavy load; paint fading due to prolonged exposure to sunlight and engine heat; discoloration of brake rotors due to overheating.' },
                    { t: '5. Electrical Effects (Thermoelectric)', d: 'Heat can induce electrical effects: thermoelectric generation (Seebeck effect) and changes in electrical resistance. Motor vehicle examples: thermocouples used in engine temperature sensors; increased resistance in electrical wiring due to heat causing voltage drops; overheating of electrical components causing failure.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-1 ${textHead}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods of Heat Transfer */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>3 Methods of Heat Transfer in Motor Vehicles</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { t: 'Conduction', d: 'Heat transfer through direct contact between particles of a material. Heat flows from hotter to colder regions. Motor vehicle examples: heat transfer from combustion chamber to cylinder walls; heat transfer from brake pads to rotors; heat transfer through radiator fins; heat transfer along the metal body.', c: 'red' },
                    { t: 'Convection', d: 'Heat transfer through the movement of fluids (liquids or gases). Hotter fluids rise, colder fluids sink, creating convection currents. Motor vehicle examples: cooling of engine by circulation of coolant; heating of passenger compartment by warm air from heater core; cooling of radiator by fan airflow.', c: 'blue' },
                    { t: 'Radiation', d: 'Heat transfer through electromagnetic waves. Does not require a medium. Motor vehicle examples: heat transfer from exhaust manifold to surrounding air; heat transfer from the sun to the vehicle body; heat radiated from hot brake rotors; heat radiated from the engine compartment.', c: 'amber' },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 ${
                      item.c === 'red' ? 'border-red-500' : item.c === 'blue' ? 'border-blue-500' : 'border-amber-500'
                    }`}>
                      <h4 className={`font-black uppercase text-base mb-2 ${textHead}`}>{item.t}</h4>
                      <p className={`text-sm ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temperature Scales and Conversions */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>4 Temperature Scales &amp; Conversions</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className={`font-bold text-sm mb-3 ${subHead}`}>Scales</p>
                    <ul className={`text-sm space-y-1 ${textMuted}`}>
                      <li><strong>Metric:</strong> Celsius (°C), Kelvin (K)</li>
                      <li><strong>Imperial:</strong> Fahrenheit (°F)</li>
                    </ul>
                    <p className={`font-bold text-sm mt-4 mb-3 ${subHead}`}>Mercury-in-Glass Thermometer</p>
                    <p className={`text-xs ${textMuted}`}>A glass tube with a bulb at one end containing mercury. When heated, mercury expands and rises in the tube; when cooled, it contracts and falls. The height of the mercury column indicates the temperature. Advantages: accurate, wide temperature range, relatively inexpensive. Disadvantages: fragile, contains toxic mercury, requires direct line of sight.</p>
                  </div>
                  <div>
                    <p className={`font-bold text-sm mb-3 ${subHead}`}>Conversion Formulas</p>
                    {[
                      { l: '°C to °F', f: '°F = (°C × 9/5) + 32' },
                      { l: '°C to K', f: 'K = °C + 273.15' },
                      { l: '°F to °C', f: '°C = (°F − 32) × 5/9' },
                      { l: 'K to °C', f: '°C = K − 273.15' },
                    ].map((item, i) => (
                      <div key={i} className="mb-2">
                        <span className={`text-xs font-bold ${subHead}`}>{item.l}: </span>
                        <MathFormula isDarkMode={isDarkMode}>{item.f}</MathFormula>
                      </div>
                    ))}
                    <p className={`font-bold text-sm mt-4 mb-2 ${subHead}`}>Examples</p>
                    {['0 °C → °F: (0×9/5)+32 = 32 °F', '0 °C → K: 0+273.15 = 273.15 K', '32 °F → °C: (32−32)×5/9 = 0 °C', '273.15 K → °C: 273.15−273.15 = 0 °C'].map((ex, i) => (
                      <MathBlock key={i} isDarkMode={isDarkMode}>{ex}</MathBlock>
                    ))}
                  </div>
                </div>
              </div>

              {/* Effects of Temperature on Motor Vehicle Fluids */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>5 Effects of Temperature Change on Motor Vehicle Fluids</h3>
                <Table
                  isDarkMode={isDarkMode}
                  headers={['Fluid', 'Low Temperature Effect', 'High Temperature Effect']}
                  rows={[
                    ['Diesel Fuel', 'Can thicken (waxing), leading to fuel flow problems and difficulty starting.', 'Can decrease density, affecting fuel delivery and combustion.'],
                    ['Petrol (Gasoline)', 'Can reduce volatility, making starting difficult.', 'Can vaporize excessively, leading to vapor lock and fuel delivery issues.'],
                    ['Electrolyte (Battery Acid)', 'Reduces battery capacity and performance.', 'Can accelerate corrosion and electrolyte evaporation.'],
                    ['Brake Fluid', 'Can increase viscosity, affecting brake response.', 'Can lead to boiling (vapor lock), causing brake failure.'],
                    ['Oils (Engine/Transmission/Differential)', 'Increases viscosity, reducing lubrication and increasing wear.', 'Decreases viscosity, reducing lubrication and accelerating oxidation.'],
                    ['Water in Radiator (Coolant)', 'Can freeze and damage the cooling system (hence the use of antifreeze).', 'Can boil, leading to overheating and coolant loss.'],
                    ['Power Steering Fluid', 'Lower temperatures thicken it.', 'High temperatures thin it out.'],
                    ['Windshield Washer Fluid', 'Should have anti-freeze property to prevent freezing.', 'Generally unaffected at normal operating temperatures.'],
                  ]}
                />
              </div>

              {/* Quantity of Heat */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>6 Determining the Quantity of Heat</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    { t: 'Calorimetry', d: 'Measures heat using an insulated container (calorimeter). Procedure: heat/cool a known mass, measure temperature change, calculate heat using Q = mcΔT.' },
                    { t: 'Electrical Heating', d: 'A heating element with known power is used. Measure voltage, current, and time to determine electrical energy supplied. Use Q = mcΔT to calculate specific heat capacity.' },
                    { t: 'Phase Change Measurements', d: 'Used to determine latent heat of fusion or vaporization. A known mass is heated until phase change, then the amount of heat is measured using Q = mL.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-2 ${subHead}`}>{item.t}</p>
                      <p className={`text-xs ${textMuted}`}>{item.d}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} mb-4`}>
                  <p className={`font-bold text-sm mb-2 ${subHead}`}>Factors Affecting the Quantity of Heat in a Body</p>
                  <ul className={`text-xs space-y-1 ${textMuted}`}>
                    <li><strong>Mass (m):</strong> A larger mass requires more heat to achieve the same temperature change.</li>
                    <li><strong>Specific Heat Capacity (c):</strong> The amount of heat required to raise the temperature of 1 kg of a substance by 1 °C. Different materials have different specific heat capacities.</li>
                    <li><strong>Temperature Change (ΔT):</strong> The greater the temperature change, the more heat is required.</li>
                  </ul>
                  <MathBlock isDarkMode={isDarkMode}>Q = m × c × ΔT</MathBlock>
                </div>

                <h4 className={`font-bold text-base mb-3 ${textHead}`}>Heat Transfer in Mixtures</h4>
                <p className={`text-xs mb-3 ${textMuted}`}>When substances at different temperatures are mixed, heat flows from hotter to colder until thermal equilibrium. Heat Lost = Heat Gained.</p>
                <MathBlock isDarkMode={isDarkMode}>Qlost = m1c1(T1 − Tf)  and  Qgained = m2c2(Tf − T2)</MathBlock>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      t: 'Mixing Water',
                      q: '100 g of water at 80 °C mixed with 200 g of water at 20 °C. (c_water = 4.186 J/g°C)',
                      steps: ['100(80−Tf) = 200(Tf−20)', '8000 − 100Tf = 200Tf − 4000', '12000 = 300Tf', 'Tf = 40 °C'],
                      ans: 'Final temperature = 40 °C.'
                    },
                    {
                      t: 'Metal in Water',
                      q: '50 g iron at 300 °C dropped into 150 g water at 20 °C. (c_iron=0.45, c_water=4.186 J/g°C)',
                      steps: ['50×0.45×(300−Tf) = 150×4.186×(Tf−20)', '6750 − 22.5Tf = 627.9Tf − 12558', '19308 = 650.4Tf', 'Tf ≈ 29.7 °C'],
                      ans: 'Final temperature ≈ 29.7 °C.'
                    },
                    {
                      t: 'Latent Heat Example',
                      q: 'How much heat to melt 200 g of ice at 0 °C? (Latent heat of fusion = 334 J/g)',
                      steps: ['Q = mL', 'Q = 200 g × 334 J/g', 'Q = 66,800 J = 66.8 kJ'],
                      ans: '66.8 kJ of heat required.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change of State / Latent Heat */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>7 Change of State &amp; Latent Heat</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Types of Phase Transitions</h4>
                    <ul className="space-y-2">
                      {['Melting: Solid to liquid (e.g., ice to water)', 'Freezing (Solidification): Liquid to solid', 'Vaporization (Boiling/Evaporation): Liquid to gas', 'Condensation: Gas to liquid', 'Sublimation: Solid to gas (e.g., dry ice → CO₂ gas)', 'Deposition (Desublimation): Gas to solid (e.g., water vapor → frost)'].map((item, i) => (
                        <li key={i} className={`text-sm ${textMuted} flex gap-2 items-start`}><ArrowRight size={12} className="mt-1 shrink-0" />{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Sensible vs. Latent Heat</h4>
                    <div className="space-y-3">
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                        <p className={`font-bold text-xs uppercase mb-1 ${textHead}`}>Sensible Heat</p>
                        <p className={`text-xs ${textMuted}`}>Heat energy that causes a change in temperature without changing state. Can be "sensed" because it results in a temperature change.</p>
                        <MathBlock isDarkMode={isDarkMode}>Q = m × c × ΔT</MathBlock>
                      </div>
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                        <p className={`font-bold text-xs uppercase mb-1 ${textHead}`}>Latent Heat</p>
                        <p className={`text-xs ${textMuted}`}>Heat energy that causes a change in state without changing temperature. Energy required to break or form intermolecular bonds. Latent Heat of Fusion (melt/freeze) and Latent Heat of Vaporization (vaporize/condense).</p>
                        <MathBlock isDarkMode={isDarkMode}>Q = m × L</MathBlock>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {[
                    {
                      t: 'Melting Ice',
                      q: 'How much heat to melt 500 g of ice at 0 °C? (Latent heat of fusion = 334 J/g)',
                      steps: ['Q = mL = 500 × 334 = 167,000 J = 167 kJ'],
                      ans: '167 kJ of heat required.'
                    },
                    {
                      t: 'Vaporizing Water',
                      q: 'How much heat to vaporize 200 g of water at 100 °C? (Latent heat of vaporization = 2260 J/g)',
                      steps: ['Q = mL = 200 × 2260 = 452,000 J = 452 kJ'],
                      ans: '452 kJ of heat required.'
                    },
                    {
                      t: 'Ice to Steam (Combined)',
                      q: 'Convert 100 g of ice at −10 °C to steam at 100 °C. (c_ice=2.1, c_water=4.186 J/g°C; L_fusion=334, L_vap=2260 J/g)',
                      steps: ['Q1 = 100×2.1×10 = 2,100 J (ice −10→0°C)', 'Q2 = 100×334 = 33,400 J (melt ice)', 'Q3 = 100×4.186×100 = 41,860 J (water 0→100°C)', 'Q4 = 100×2260 = 226,000 J (vaporize)', 'Total = 303,360 J = 303.36 kJ'],
                      ans: '303.36 kJ of heat required.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thermal Expansion */}
              <div className={`p-6 ${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                <h3 className={`font-black uppercase text-lg mb-4 ${textHead}`}>8 Thermal Expansion</h3>
                <p className={`text-sm mb-4 ${textMuted}`}>Solids expand when heated (particles vibrate more vigorously, moving further apart) and contract when cooled. Liquids also expand when heated; hotter liquids are less dense than colder ones.</p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[
                    { t: 'Linear Expansion (α)', f: 'ΔL = α × L₀ × ΔT', d: 'α = (ΔL / L₀) / ΔT — the fractional change in length per °C.' },
                    { t: 'Superficial (Area) Expansion (β)', f: 'ΔA = β × A₀ × ΔT\nβ ≈ 2α', d: 'The fractional change in area per °C.' },
                    { t: 'Cubical (Volume) Expansion (γ)', f: 'ΔV = γ × V₀ × ΔT\nγ ≈ 3α', d: 'The fractional change in volume per °C.' },
                  ].map((coeff, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-black text-xs uppercase mb-2 ${subHead}`}>{coeff.t}</p>
                      <MathBlock isDarkMode={isDarkMode}>{coeff.f}</MathBlock>
                      <p className={`text-xs ${textMuted}`}>{coeff.d}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {[
                    {
                      t: 'Linear Expansion Example',
                      q: 'Steel rod (2 m) heated from 20 °C to 100 °C. α_steel = 12×10⁻⁶/°C.',
                      steps: ['ΔL = α × L₀ × ΔT', 'ΔL = 12×10⁻⁶ × 2 × 80', 'ΔL = 0.00192 m = 1.92 mm'],
                      ans: 'Change in length = 1.92 mm.'
                    },
                    {
                      t: 'Superficial Expansion Example',
                      q: 'Square aluminum plate (area 0.5 m²) heated from 15 °C to 80 °C. α_Al = 24×10⁻⁶/°C.',
                      steps: ['β = 2α = 48×10⁻⁶/°C', 'ΔA = 48×10⁻⁶ × 0.5 × 65', 'ΔA = 0.00156 m²'],
                      ans: 'Change in area = 0.00156 m².'
                    },
                    {
                      t: 'Cubical Expansion Example',
                      q: 'Brass cube (volume 0.1 m³) heated from 25 °C to 125 °C. α_brass = 19×10⁻⁶/°C.',
                      steps: ['γ = 3α = 57×10⁻⁶/°C', 'ΔV = 57×10⁻⁶ × 0.1 × 100', 'ΔV = 0.00057 m³'],
                      ans: 'Change in volume = 0.00057 m³.'
                    }
                  ].map((ex, i) => (
                    <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                      <p className={`font-bold text-xs uppercase mb-1 ${subHead}`}>{ex.t}</p>
                      <p className={`text-xs italic mb-2 ${textMuted}`}>{ex.q}</p>
                      {ex.steps.map((s, j) => <MathBlock key={j} isDarkMode={isDarkMode}>{s}</MathBlock>)}
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{ex.ans}</p>
                    </div>
                  ))}
                </div>

                {/* Expansion rates comparison */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Comparing Materials' Expansion Rates</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { t: 'High Expansion Rates', items: ['Aluminum: ~23–24 × 10⁻⁶/°C', 'Plastics: Generally high (varies by type)'] },
                      { t: 'Moderate Expansion Rates', items: ['Brass: ~19 × 10⁻⁶/°C', 'Copper: ~17 × 10⁻⁶/°C'] },
                      { t: 'Low Expansion Rates', items: ['Steel: ~11–12 × 10⁻⁶/°C', 'Invar: Very low (near zero in certain ranges)', 'Ceramics: Generally low'] },
                    ].map((group, i) => (
                      <div key={i}>
                        <p className={`font-bold text-xs uppercase mb-2 ${textHead}`}>{group.t}</p>
                        {group.items.map((item, j) => (
                          <p key={j} className={`text-xs ${textMuted}`}>• {item}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motor Vehicle Components Fitted by Expansion/Contraction */}
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                  <p className={`font-bold text-sm mb-3 ${subHead} uppercase`}>Motor Vehicle Components Fitted by Expansion or Contraction</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { t: 'Interference Fits', items: ['Bearings pressed into housings: housing is heated to expand, bearing inserted, housing cools and contracts creating a tight fit.', 'Cylinder liners inserted into engine blocks: similar to bearings.', 'Valve seat inserts in cylinder heads.'] },
                      { t: 'Shrink Fits', items: ['Gears or pulleys fitted onto shafts: the gear/pulley is heated to expand, placed onto the shaft, shrinks as it cools.', 'Connecting rod small end bushings.'] },
                      { t: 'Heat-Shrink Tubing', items: ['Electrical connections: heat-shrink tubing is placed over connections and heated to shrink, providing insulation and protection.'] },
                      { t: 'Snap Fits', items: ['Some plastic components are designed with snap fits that take advantage of the material\'s flexibility and slight thermal expansion.'] },
                    ].map((group, i) => (
                      <div key={i}>
                        <p className={`font-bold text-xs uppercase mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{group.t}</p>
                        {group.items.map((item, j) => (
                          <p key={j} className={`text-xs mb-1 ${textMuted}`}>• {item}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Science Insight
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
                  <span>Newton's Laws</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Heat Transfer Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Simple Machines</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Lever Classes</span>
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
                Master the fundamentals: mass, density, and motion. Understand speed, velocity, and
                acceleration. Know Newton's three laws and how they apply. Learn about levers, moments,
                and equilibrium. Understand centre of gravity and its importance. Work, energy, and power
                are interconnected concepts. Engine power, tractive effort, and friction are critical for
                vehicle performance. Stress, strain, and material properties determine strength and safety.
                Simple machines multiply force. Heat transfer, temperature, and thermal expansion affect
                all mechanical systems.
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
                <strong className="text-white">Mass, Density &amp; Motion</strong> – Mass is intrinsic
                property; specific gravity and relative density compare substances. Speed, velocity,
                and acceleration describe motion; distance-time and velocity-time graphs represent motion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Newton's Laws &amp; Force</strong> – 1st (Inertia), 2nd
                (F=ma), 3rd (Action/Reaction). Force is a vector; resultant and equilibrant balance forces.
                Trigonometry resolves forces into components.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Levers, Moments &amp; Gravity</strong> – Three classes of
                levers; moment = force × distance; equilibrium requires ΣF=0 and ΣM=0. Centre of gravity
                affects stability, safety, and efficiency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Work, Energy &amp; Power</strong> – Work = F×d; kinetic
                (½mv²) and potential (mgh) energy; power = work/time; rotational work = τ×θ; engine
                power (IP, BP, efficiency).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Friction, Stress &amp; Strain</strong> – Boundary, dry,
                and fluid friction; factors affecting friction; Hooke's law (σ=Eε); stress, strain,
                Young's modulus; safety factor ensures reliability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Simple Machines &amp; Heat</strong> – Levers, inclined
                planes, screw jacks, hydraulic systems, pulleys, gears; MA, VR, efficiency. Heat vs
                temperature; conduction, convection, radiation; latent heat; thermal expansion.
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
            Sidemann Academic Registry • Simply Easy Science — LO2
          </span>
        </div>
      </footer>
    </div>
    </AutomotiveMathProvider>
  );
};

export default LearningOutcome2;
