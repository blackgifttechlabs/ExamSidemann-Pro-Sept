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
} from 'lucide-react';
import { AutomotiveMathProvider, InlineMath, MathBlockText } from './AutomotiveMath';
import { useLessonState } from '../../../lessonProgress';

type BoxColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'indigo';
type CourseIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

interface MathInlineProps {
  c: string;
}

interface ChildrenProps {
  children: React.ReactNode;
}

interface MathBlockProps extends ChildrenProps {
  className?: string;
}

interface StepProps extends ChildrenProps {
  n: React.ReactNode;
}

interface ExBoxProps extends ChildrenProps {
  title?: React.ReactNode;
  color?: BoxColor;
}

interface SectionHeaderProps {
  icon?: CourseIcon;
  title: React.ReactNode;
  isDark: boolean;
}

interface DefProps extends ChildrenProps {
  term: React.ReactNode;
}

interface RuleProps {
  name: React.ReactNode;
  formula: React.ReactNode;
  note?: React.ReactNode;
}

interface TableProps {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  isDark: boolean;
}

interface CardProps extends ChildrenProps {
  color?: BoxColor;
  isDark: boolean;
}

// ─── Math rendering helpers ───────────────────────────────────────────────────
const M = ({ c }: MathInlineProps) => <InlineMath>{c}</InlineMath>;

const MBlock = ({ children, className = '' }: MathBlockProps) => (
  <MathBlockText className={className}>{children}</MathBlockText>
);

const Step = ({ n, children }: StepProps) => (
  <div className="flex gap-3 items-start my-1.5">
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{n}</span>
    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
  </div>
);

const ExBox = ({ title, children, color = 'blue' }: ExBoxProps) => {
  const colors: Record<BoxColor, string> = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/10',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/10',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    indigo: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10',
  };
  return (
    <div className={` ${colors[color]} rounded-r-lg p-4 my-3`}>
      {title && <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{title}</p>}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">{children}</div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, isDark }: SectionHeaderProps) => (
  <div className="flex items-center gap-4 dark:border-indigo-500 pl-6 mb-6">
    <h2 className={`text-2xl sm:text-3xl font-bold inline-block uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {Icon && <span className="inline-flex items-center gap-3"><Icon className="text-indigo-500" size={28} /> {title}</span>}
      {!Icon && title}
    </h2>
  </div>
);

const SubHead = ({ children }: ChildrenProps) => (
  <h3 className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-8 mb-3 flex items-center gap-2">
    <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block"></span>
    {children}
  </h3>
);

const Def = ({ term, children }: DefProps) => (
  <div className="mb-3">
    <span className="font-black text-gray-900 dark:text-white">{term}: </span>
    <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</span>
  </div>
);

const Rule = ({ name, formula, note }: RuleProps) => (
  <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
    <p className="font-black text-sm text-indigo-600 dark:text-indigo-400 uppercase mb-1">{name}</p>
    <MBlock>{formula}</MBlock>
    {note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note}</p>}
  </div>
);

// ─── TABLE component ──────────────────────────────────────────────────────────
const Table = ({ headers, rows, isDark }: TableProps) => (
  <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className={isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100'}>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-2 text-left font-black text-xs uppercase tracking-widest text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? (isDark ? 'bg-[#252526]' : 'bg-white') : (isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50')}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 font-mono text-xs">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── CARD component ───────────────────────────────────────────────────────────
const Card = ({ color = 'blue', children, isDark }: CardProps) => {
  const borders: Record<BoxColor, string> = { blue: 'border-blue-500', green: 'border-green-500', purple: 'border-purple-500', amber: 'border-amber-500', red: 'border-red-500', indigo: 'border-indigo-500' };
  return (
    <div className={`${isDark ? 'bg-[#252526]' : 'bg-white'} rounded-lg shadow-md p-5 mb-5 ${borders[color] || borders.blue}`}>
      {children}
    </div>
  );
};

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'numbers-algebra', label: 'Numbers & Algebra' },
  { id: 'polynomials-logs', label: 'Polynomials & Logs' },
  { id: 'area-volume-engines', label: 'Area, Volume & Engines' },
  { id: 'calculus-matrices', label: 'Calculus & Matrices' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const LearningOutcome1 = () => {
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
        text: 'The laws of indices are derived from the basic definition of repeated multiplication – they are not arbitrary rules, but logical consequences.',
      },
      {
        title: 'Pro Tip',
        text: 'When solving simultaneous equations, always check your solution by substituting back into the original equations.',
      },
      {
        title: 'Memory Trick',
        text: 'BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction – the order in which operations are performed.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to change the sign when transposing terms across the equals sign – always remember: + becomes − and − becomes +.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The laws of indices are derived from the basic definition of repeated multiplication – they are not arbitrary rules, but logical consequences.',
      },
      {
        title: 'Pro Tip',
        text: 'When solving simultaneous equations, always check your solution by substituting back into the original equations.',
      },
      {
        title: 'Memory Trick',
        text: 'BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction – the order in which operations are performed.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to change the sign when transposing terms across the equals sign – always remember: + becomes − and − becomes +.',
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
    <AutomotiveMathProvider>
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <BookOpen size={14} className="inline mr-1" /> MATHEMATICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Simply Easy{' '}
            <span className="text-emerald-300 font-bold italic">
              Maths
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete notes for Learning Outcome 1 — Numbers, Algebra, Geometry, Calculus &amp; Matrices.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Hash size={14} className="inline mr-1" /> Numbers
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Algebra
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Grid3x3 size={14} className="inline mr-1" /> Matrices
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
                placeholder="Search for a concept, formula, example..."
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
            {/* SECTION 1: Numbers & Algebra */}
            <div
              ref={(el) => {
                sectionRefs.current['numbers-algebra'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Numbers &amp; Algebra
              </h2>

              <SubHead>Types of Numbers</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                In mathematics, numbers are grouped into different <strong>sets</strong> depending on their properties. Think of these sets like circles inside each other — every Natural Number is also a Real Number, but not every Real Number is a Natural Number. Understanding which set a number belongs to tells you what operations are safe to use on it and what kind of answer to expect.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Natural Numbers (ℕ)', color: 'blue', content: (<><p className="text-sm text-gray-600 dark:text-gray-300 mb-2">The positive integers used for counting.</p><MBlock>{'ℕ = {1, 2, 3, 4, 5, ...}'}</MBlock></>) },
                  { label: 'Real Numbers (ℝ)', color: 'green', content: (<p className="text-sm text-gray-600 dark:text-gray-300">Includes all rational and irrational numbers — any number representable on a number line.</p>) },
                  { label: 'Rational Numbers (ℚ)', color: 'purple', content: (<><p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Expressible as <M c="p/q" /> where p, q are integers and <M c="q ≠ 0" />. Includes all integers, terminating decimals (0.25), and repeating decimals (0.333...).</p><MBlock>{'Examples: −3,  0,  5,  0.25,  0.333...'}</MBlock></>) },
                  { label: 'Irrational Numbers (𝕀)', color: 'amber', content: (<><p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Cannot be expressed as <M c="p/q" />. Non-terminating, non-repeating decimals.</p><MBlock>{'Examples: √2,  π,  e (Euler\'s number)'}</MBlock></>) },
                ].map(({ label, color, content }) => (
                  <Card key={label} color={color as BoxColor} isDark={isDarkMode}>
                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm mb-2">{label}</h4>
                    {content}
                  </Card>
                ))}
              </div>

              <SubHead>Approximation — Rounding Off</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                In real engineering and science problems, answers are rarely neat whole numbers. Rounding lets us express a number to a <strong>useful level of precision</strong> without dragging endless decimal places around. There are two ways to round: to a given number of <em>decimal places</em> (how many digits after the point) or to a given number of <em>significant figures</em> (how many meaningful digits overall). The rule is always the same — look at the <em>next</em> digit and decide whether to round up or leave alone.
              </p>
              <div className="bg-indigo-600 dark:bg-indigo-800 text-white rounded-lg p-5 mb-4">
                <p className="font-black uppercase text-sm mb-2">Rule for Rounding to Decimal Places</p>
                <p className="text-indigo-100 text-sm">If the digit <em>after</em> the desired place is <strong>≥ 5</strong>, round up. If it is <strong>{'< 5'}</strong>, leave unchanged.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  ['Round 3.14159 to 2 d.p.', 'Digit after 2nd place = 1  →  round down', '3.14159  ≈  3.14'],
                  ['Round 12.789 to 1 d.p.', 'Digit after 1st place = 8  →  round up', '12.789  ≈  12.8'],
                  ['Round 0.9997 to 3 d.p.', 'Digit after 3rd place = 7  →  round up', '0.9997  ≈  1.000'],
                ].map(([q, reason, ans]) => (
                  <ExBox key={q} title="Example" color="blue">
                    <p className="font-bold">{q}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{reason}</p>
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Rounding to Significant Figures</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Significant figures (s.f.) measure the <strong>total number of meaningful digits</strong> in a number — regardless of where the decimal point sits. This matters most in science and engineering: a measurement of <M c="0.0057" /> has 2 significant figures, while <M c="5700" /> could have 2, 3, or 4 depending on context. The key skill is identifying which digits count as significant, then applying the same round-up-or-leave rule.
              </p>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4`}>
                <p className="font-black text-sm uppercase text-indigo-600 dark:text-indigo-400 mb-2">Rules for Significant Figures</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-none">
                  {[
                    'All non-zero digits are significant.',
                    'Zeros between non-zero digits are significant.',
                    'Trailing zeros in a number with a decimal point are significant.',
                    'Leading zeros are NOT significant.',
                    'If the next digit is ≥ 5, round up; otherwise round down.',
                  ].map((r, i) => (
                    <li key={i} className="flex gap-2"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />{r}</li>
                  ))}
                </ul>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  ['12345 → 3 s.f.', 'Next digit = 4 (round down)', '12345  ≈  12300'],
                  ['0.005678 → 2 s.f.', 'Next digit = 7 (round up)', '0.005678  ≈  0.0057'],
                  ['3.14159 → 4 s.f.', 'Next digit = 5 (round up)', '3.14159  ≈  3.142'],
                  ['10.05 → 3 s.f.', 'Next digit = 5 (round up)', '10.05  ≈  10.1'],
                  ['1005 → 3 s.f.', 'Next digit = 5 (round up)', '1005  ≈  1010'],
                ].map(([q, r, a]) => (
                  <ExBox key={q} title="Example" color="purple">
                    <p className="font-bold">{q}</p>
                    <p className="text-xs text-gray-400">{r}</p>
                    <MBlock>{a}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Number System Bases</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                We normally count in <strong>base 10 (decimal)</strong> because humans have 10 fingers. But computers use <strong>base 2 (binary)</strong> because electronic switches have only two states — on (1) or off (0). Octal (base 8) and hexadecimal (base 16) are shorthand ways of writing binary that are easier for humans to read. The <em>base</em> tells you how many different digit symbols exist before you "carry over" to the next column. In base 10 you carry at 10; in base 2 you carry at 2.
              </p>
              <Table
                isDark={isDarkMode}
                headers={['Base Name', 'Base', 'Digits Used']}
                rows={[
                  ['Denary (Decimal)', '10', '0 – 9'],
                  ['Binary', '2', '0 – 1'],
                  ['Octal', '8', '0 – 7'],
                  ['Duodecimal', '12', '0 – 9, A=10, B=11'],
                  ['Hexadecimal', '16', '0 – 9, A=10, B=11, C=12, D=13, E=14, F=15'],
                ]}
              />

              <SubHead>Conversion Methods</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Converting between bases sounds tricky but follows a simple mechanical process. <strong>To go from decimal to any base</strong>: keep dividing by the new base and collect the remainders — then read them bottom to top. <strong>To go from any base back to decimal</strong>: each digit is worth (digit × base<sup>position</sup>), where the rightmost position is 0. Add all those values together and you have the decimal answer.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Decimal → Other Base</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Repeated Division:</strong> Divide the decimal number by the target base repeatedly, noting remainders. Read remainders in <em>reverse order</em>.</p>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Other Base → Decimal</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Positional Notation:</strong> Multiply each digit by the base raised to the power of its position (starting from 0 on the right), then sum all results.</p>
                </Card>
              </div>

              {/* Conversion example 250 */}
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-gray-50'} rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700`}>
                <p className="font-black text-indigo-600 dark:text-indigo-400 uppercase text-sm mb-4">Example: Convert Decimal 250 to All Bases</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: '→ Binary (Base 2)', steps: ['250 ÷ 2 = 125 R 0','125 ÷ 2 = 62  R 1','62 ÷ 2  = 31  R 0','31 ÷ 2  = 15  R 1','15 ÷ 2  = 7   R 1','7 ÷ 2   = 3   R 1','3 ÷ 2   = 1   R 1','1 ÷ 2   = 0   R 1'], result: '11111010₂', color: 'text-blue-600 dark:text-blue-400' },
                    { title: '→ Octal (Base 8)', steps: ['250 ÷ 8 = 31 R 2','31 ÷ 8  = 3  R 7','3 ÷ 8   = 0  R 3'], result: '372₈', color: 'text-green-600 dark:text-green-400' },
                    { title: '→ Duodecimal (Base 12)', steps: ['250 ÷ 12 = 20 R 10 (A)','20 ÷ 12  = 1  R 8','1 ÷ 12   = 0  R 1'], result: '18A₁₂', color: 'text-purple-600 dark:text-purple-400' },
                    { title: '→ Hexadecimal (Base 16)', steps: ['250 ÷ 16 = 15 R 10 (A)','15 ÷ 16  = 0  R 15 (F)'], result: 'FA₁₆', color: 'text-amber-600 dark:text-amber-400' },
                  ].map(({ title, steps, result, color }) => (
                    <div key={title} className={`${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg p-3 border border-gray-100 dark:border-gray-700`}>
                      <p className="font-black text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">{title}</p>
                      <div className="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                        {steps.map((s, i) => <div key={i}>{s}</div>)}
                      </div>
                      <div className={`mt-2 font-black text-sm ${color}`}>Result: {result}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back to decimal */}
              <p className="font-black text-indigo-600 dark:text-indigo-400 uppercase text-sm mb-3">Converting Back to Decimal (Positional Notation)</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ExBox title="Binary 11111010₂ → Decimal" color="blue">
                  <MBlock>{'(1×2⁷)+(1×2⁶)+(1×2⁵)+(1×2⁴)+(1×2³)+(0×2²)+(1×2¹)+(0×2⁰)\n= 128+64+32+16+8+0+2+0\n= 250'}</MBlock>
                </ExBox>
                <ExBox title="Octal 372₈ → Decimal" color="green">
                  <MBlock>{'(3×8²) + (7×8¹) + (2×8⁰)\n= 192 + 56 + 2\n= 250'}</MBlock>
                </ExBox>
                <ExBox title="Duodecimal 18A₁₂ → Decimal" color="purple">
                  <MBlock>{'(1×12²) + (8×12¹) + (10×12⁰)\n= 144 + 96 + 10\n= 250'}</MBlock>
                </ExBox>
                <ExBox title="Hexadecimal FA₁₆ → Decimal" color="amber">
                  <MBlock>{'(15×16¹) + (10×16⁰)\n= 240 + 10\n= 250'}</MBlock>
                </ExBox>
              </div>

              {/* 178 example */}
              <SubHead>Example: Convert Decimal 178</SubHead>
              <div className="space-y-3">
                <ExBox title="Step 1 — Decimal 178 → Octal" color="blue">
                  <MBlock>{'178 ÷ 8 = 22  R 2\n22 ÷ 8  = 2   R 6\n2 ÷ 8   = 0   R 2\nResult: 262₈'}</MBlock>
                </ExBox>
                <ExBox title="Step 2 — Octal 262 → Binary (convert each digit to 3-bit)" color="green">
                  <MBlock>{'2 → 010\n6 → 110\n2 → 010\nCombine: 010 110 010\nResult: 10110010₂'}</MBlock>
                </ExBox>
                <ExBox title="Step 3 — Octal 262 → Hexadecimal (via binary grouping)" color="purple">
                  <MBlock>{'Binary: 010110010\nGroup into 4-bit chunks from right: 0101  1001  0\nPad: 0000 0101  1001\n0101 = 5\n1001 = 9\nResult: 59₁₆'}</MBlock>
                </ExBox>
              </div>

              {/* 350 example */}
              <SubHead>Example: Convert Decimal 350</SubHead>
              <div className="space-y-3">
                <ExBox title="Step 1 — Decimal 350 → Octal" color="blue">
                  <MBlock>{'350 ÷ 8 = 43  R 6\n43 ÷ 8  = 5   R 3\n5 ÷ 8   = 0   R 5\nResult: 536₈'}</MBlock>
                </ExBox>
                <ExBox title="Step 2 — Octal 536 → Binary" color="green">
                  <MBlock>{'5 → 101\n3 → 011\n6 → 110\nCombine: 101 011 110\nResult: 101011110₂'}</MBlock>
                </ExBox>
                <ExBox title="Step 3 — Octal 536 → Hexadecimal (via binary)" color="purple">
                  <MBlock>{'Binary: 101011110\nGroup into 4-bit chunks: 0001  0101  1110\n0001 = 1\n0101 = 5\n1110 = E\nResult: 15E₁₆'}</MBlock>
                </ExBox>
              </div>

              {/* Laws */}
              <SubHead>Fundamental Mathematical Laws</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                These three laws are the <strong>rules of arithmetic</strong> that always hold true. They look obvious, but knowing them by name lets you deliberately use them to rearrange and simplify complex expressions. You will use all three constantly when expanding brackets, factorising, and solving equations.
              </p>
              <div className="space-y-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-gray-900 dark:text-white uppercase text-sm mb-1">1. Commutative Laws (Order doesn't matter)</p>
                  <MBlock>{'Addition:       a + b = b + a\nMultiplication: a × b = b × a'}</MBlock>
                  <ExBox title="Example" color="blue">
                    <p>Calculate <M c="12 + 25 + 8" /></p>
                    <MBlock>{'Rearrange: 12 + 8 + 25 = 20 + 25 = 45'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-gray-900 dark:text-white uppercase text-sm mb-1">2. Associative Laws (Grouping doesn't matter)</p>
                  <MBlock>{'Addition:       (a + b) + c = a + (b + c)\nMultiplication: (a × b) × c = a × (b × c)'}</MBlock>
                  <ExBox title="Example" color="green">
                    <p>Calculate <M c="2 × (5 × 9)" /></p>
                    <MBlock>{'(2 × 5) × 9 = 10 × 9 = 90'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="purple" isDark={isDarkMode}>
                  <p className="font-black text-gray-900 dark:text-white uppercase text-sm mb-1">3. Distributive Law</p>
                  <MBlock>{'a × (b + c) = (a × b) + (a × c)\na × (b − c) = (a × b) − (a × c)'}</MBlock>
                  <ExBox title="Example 1 — Expanding" color="purple">
                    <p>Calculate <M c="7 × (10 + 3)" /></p>
                    <MBlock>{'7 × (10 + 3) = (7×10) + (7×3) = 70 + 21 = 91'}</MBlock>
                  </ExBox>
                  <ExBox title="Example 2 — Factoring (reverse)" color="purple">
                    <p>Factor <M c="15x + 10" /></p>
                    <MBlock>{'15x + 10 = 5(3x + 2)'}</MBlock>
                  </ExBox>
                </Card>
              </div>

              {/* Combined */}
              <ExBox title="Combined Application of All Three Laws" color="indigo">
                <p>Simplify <M c="4×(2x+3) + 6x + 8" /></p>
                <MBlock>{'1. Distributive:  4×(2x+3) = 8x + 12\n   Expression: 8x + 12 + 6x + 8\n2. Commutative:  8x + 6x + 12 + 8\n3. Associative:  (8x + 6x) + (12 + 8)\n4. Simplify:      14x + 20'}</MBlock>
              </ExBox>

              {/* BODMAS */}
              <SubHead>BODMAS — Order of Operations</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                If there were no agreed order for operations, the expression <M c="2 + 3 × 4" /> could mean either <M c="20" /> (add first) or <M c="14" /> (multiply first) — two different answers from the same expression. BODMAS is the <strong>universally agreed rule</strong> that removes this ambiguity. Every mathematician, engineer, and calculator follows BODMAS, so you must too. The order is not random — it reflects the "strength" of each operation, from most powerful (brackets/exponents) down to least (addition/subtraction).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                {[['B','Brackets','bg-blue-500'],['O','Orders (Exponents)','bg-indigo-500'],['D','Division','bg-purple-500'],['M','Multiplication','bg-pink-500'],['A','Addition','bg-orange-500'],['S','Subtraction','bg-red-500']].map(([letter, name, bg]) => (
                  <div key={letter} className={`${bg} text-white rounded-lg p-3 text-center`}>
                    <div className="text-2xl font-black">{letter}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-1 opacity-90">{name}</div>
                  </div>
                ))}
              </div>
              <ExBox title="Key Points" color="amber">
                <ul className="text-xs space-y-1">
                  <li>• Division and Multiplication have equal priority — perform left to right.</li>
                  <li>• Addition and Subtraction have equal priority — perform left to right.</li>
                  <li>• Nested brackets: solve innermost first.</li>
                </ul>
              </ExBox>
              <ExBox title="Example: Simplify 10 + 2 × (15 − 5) ÷ 4" color="blue">
                <MBlock>{'Step 1 — Brackets:    15 − 5 = 10\n         → 10 + 2 × 10 ÷ 4\nStep 2 — Multiply:    2 × 10 = 20\n         → 10 + 20 ÷ 4\nStep 3 — Divide:      20 ÷ 4 = 5\n         → 10 + 5\nStep 4 — Add:         10 + 5 = 15\nAnswer: 15'}</MBlock>
              </ExBox>

              {/* Equations */}
              <SubHead>Equations</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                An equation is a <strong>balanced scale</strong> — whatever is on the left equals whatever is on the right. Your job when solving an equation is to isolate the unknown variable (usually <M c="x" />) on one side by performing the same operation to <em>both</em> sides, keeping the scale balanced. The moment you do something to one side without doing it to the other, the equation breaks.
              </p>
              <Def term="Equation">A mathematical statement asserting equality of two expressions, using an equals sign (=). The goal is usually to find the value(s) of the unknown that make it true.</Def>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Expression vs Equation</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Expression (no = sign)</p>
                      <MBlock>{'3x + 5\na² − 2ab + b²'}</MBlock>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Equation (has = sign)</p>
                      <MBlock>{'3x + 5 = 11\na² − 2ab + b² = 0'}</MBlock>
                    </div>
                  </div>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Properties of Equality</p>
                  <MBlock>{'If a = b, then:\na + c = b + c   (add same to both sides)\na − c = b − c   (subtract same)\na × c = b × c   (multiply same)\na ÷ c = b ÷ c   (divide by same ≠ 0)'}</MBlock>
                </Card>
              </div>

              <SubHead>Transposition</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Transposition is a <strong>shortcut for rearranging equations</strong>. Instead of writing "add 5 to both sides", you simply move the term across the equals sign and flip its sign. Think of it like this: a term that is <em>adding</em> on one side becomes <em>subtracting</em> on the other, and a term that is <em>multiplying</em> on one side becomes <em>dividing</em> on the other. Master this and you can rearrange any formula in seconds.
              </p>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Transposition moves terms across the equals sign, <em>changing their sign/operation</em>:</p>
                <MBlock>{'+ becomes −   when moved across\n− becomes +\n× becomes ÷\n÷ becomes ×'}</MBlock>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ExBox title="Example 1: Solve 2x − 5 = 9" color="blue">
                  <MBlock>{'2x − 5 = 9\n2x = 9 + 5   (transpose −5)\n2x = 14\nx = 14 ÷ 2\nx = 7'}</MBlock>
                </ExBox>
                <ExBox title="Example 2: Solve y/3 + 1 = 4" color="green">
                  <MBlock>{'y/3 + 1 = 4\ny/3 = 4 − 1   (transpose +1)\ny/3 = 3\ny = 3 × 3     (transpose ÷3)\ny = 9'}</MBlock>
                </ExBox>
              </div>

              <SubHead>Transposing Formulas</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Every formula is just an equation with specific real-world meaning. A motor vehicle technician needs to rearrange formulas constantly — for example, if you know the torque and the lever arm but need the force, you rearrange <M c="T = F × r" /> to get <M c="F = T / r" />. The same formula, three different subjects. Transposing is the skill that makes one formula do the work of many.
              </p>
              <div className="space-y-3">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Motor Vehicle Technology</p>
                  <MBlock>{'Torque: T = F × r\n  → F = T / r\n  → r = T / F\n\nPower:  P = T × ω\n  → T = P / ω\n  → ω = P / T'}</MBlock>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Physics / Science</p>
                  <MBlock>{"Newton's 2nd Law: F = m × a\n  → a = F / m\n  → m = F / a\n\nOhm's Law: V = I × R\n  → I = V / R\n  → R = V / I\n\nKinematics: v = u + at\n  → a = (v − u) / t\n  → t = (v − u) / a\n  → u = v − at"}</MBlock>
                </Card>
              </div>

              {/* Simultaneous */}
              <SubHead>Solving Simultaneous Equations</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Sometimes one equation is not enough — you have <strong>two unknowns</strong> and need <strong>two equations</strong> to pin them both down. Simultaneous equations are solved by either eliminating one unknown (substitution or elimination method) until only one remains, solving that, then substituting back. A real example: you know the total cost of petrol and oil together, and you know their combined volume — two equations let you find the price of each separately.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ExBox title="Substitution Method" color="purple">
                  <p className="font-bold mb-1">Solve: 2x + y = 7 and x − y = 2</p>
                  <MBlock>{'From eq.2:  y = x − 2\nSub into eq.1:\n  2x + (x − 2) = 7\n  3x − 2 = 7\n  3x = 9  →  x = 3\ny = 3 − 2 = 1\nSolution: x = 3, y = 1'}</MBlock>
                </ExBox>
                <ExBox title="Elimination (Equating Coefficients)" color="amber">
                  <p className="font-bold mb-1">Solve: 4x+3y=10 and 2x−5y=−14</p>
                  <MBlock>{'Multiply eq.2 × 2: 4x − 10y = −28\nSubtract from eq.1:\n  13y = 38  →  y = 2\nSub y=2 into eq.2:\n  2x − 10 = −14\n  2x = −4  →  x = −2\nSolution: x = −2, y = 2'}</MBlock>
                </ExBox>
              </div>

              <SubHead>Three Unknown Variables</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                With three unknowns you need three equations. The strategy is the same — eliminate variables one at a time. Combine pairs of equations to cancel one unknown, reducing your three-equation system to two equations with two unknowns, then one equation with one unknown. It is the same domino process repeated twice.
              </p>
              <ExBox title="Solve: x+y+z=6,  2x−y+z=3,  x+2y−z=2" color="blue">
                <MBlock>{'Eq1 + Eq2: 3x + 2z = 9   ...(4)\nEq1 + Eq3: 2x + 3y = 8   ...(5)\nEq2 + Eq3: 3x + y = 5  →  y = 5 − 3x\n\nSub into (5): 2x + 3(5−3x) = 8\n  2x + 15 − 9x = 8\n  −7x = −7  →  x = 1\n\ny = 5 − 3(1) = 2\nSub x=1 into (4): 3+2z = 9 → z = 3\n\nSolution: x = 1, y = 2, z = 3'}</MBlock>
              </ExBox>

              {/* Polynomials mult/div */}
              <SubHead>Algebraic Expressions — Multiplication of Polynomials</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                A <strong>polynomial</strong> is an expression made up of terms with variables raised to whole-number powers, like <M c="x² + 3x + 2" />. When you multiply two polynomials together, you use the distributive law: every term in the first bracket multiplies every term in the second bracket. Then collect like terms (terms with the same power). A useful memory trick: for two binomials, multiply in an F-O-I-L pattern — <em>First, Outer, Inner, Last</em>.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Use the <strong>distributive property</strong>: multiply each term in the first polynomial by each term in the second, then combine like terms.</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { q: '(x+2)(x+3)', sol: 'x(x+3) + 2(x+3)\n= x²+3x+2x+6\n= x²+5x+6' },
                  { q: '(2a−1)(3a+4)', sol: '2a(3a+4) − 1(3a+4)\n= 6a²+8a−3a−4\n= 6a²+5a−4' },
                  { q: '(x+1)(x²−x+1)', sol: 'x(x²−x+1)+1(x²−x+1)\n= x³−x²+x+x²−x+1\n= x³+1' },
                ].map(({ q, sol }) => (
                  <ExBox key={q} title={`Expand: ${q}`} color="blue">
                    <MBlock>{sol}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Division of Polynomials</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                Dividing polynomials is the reverse of multiplying them. The easiest approach is <strong>factorisation and cancelling</strong> — if you can factor the numerator and spot the denominator as one of those factors, it cancels cleanly. When factorisation is not obvious, use <strong>polynomial long division</strong>, which works exactly like numeric long division: divide the leading term, multiply back, subtract, bring down the next term, and repeat.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                {[
                  { q: '(x²+5x+6)÷(x+2)', sol: 'Factor: (x+2)(x+3)\n         (x+2)\n= x+3' },
                  { q: '(x³−8)÷(x−2)', sol: 'Factor: (x−2)(x²+2x+4)\n         (x−2)\n= x²+2x+4' },
                  { q: '(x²+7x+12)÷(x+3)', sol: 'Factor: (x+3)(x+4)\n         (x+3)\n= x+4' },
                ].map(({ q, sol }) => (
                  <ExBox key={q} title={q} color="green">
                    <MBlock>{sol}</MBlock>
                  </ExBox>
                ))}
              </div>
              <ExBox title="Polynomial Long Division: (x²+4x+3) ÷ (x+1)" color="purple">
                <MBlock>{'          x + 3\n    ──────────────\nx+1 │ x² + 4x + 3\n      −(x² + x)\n      ──────────\n           3x + 3\n          −(3x + 3)\n          ─────────\n               0\nResult: x + 3'}</MBlock>
              </ExBox>

              <SubHead>Indices (Exponents)</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                An index (or exponent) is simply a <strong>shorthand for repeated multiplication</strong>. Instead of writing <M c="2 × 2 × 2 × 2" /> you write <M c="2⁴" />. Fractional indices extend this idea to roots: <M c="x^(1/2)" /> means the square root of x, because squaring it twice gives x back. Negative indices mean "one over" — so <M c="x⁻²" /> means <M c="1/x²" />. Once you know these three types, all eight rules of indices follow naturally.
              </p>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Whole Number:</strong> <M c="xⁿ = x×x×...×x (n times)" />  e.g. <M c="2⁴ = 16" /></p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Fractional:</strong> <M c="xᵐ/ⁿ = (ⁿ√x)ᵐ" />  e.g. <M c="8²/³ = (∛8)² = 4" /></p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Decimal:</strong> <M c="x⁰·⁵ = x¹/² = √x" />  e.g. <M c="9²·⁵ = 9⁵/² = (√9)⁵ = 3⁵ = 243" /></p>
              </div>

              <SubHead>Factorisation</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Factorisation is the <strong>reverse of expanding brackets</strong>. You are looking for what was multiplied together to produce the expression you see. It is one of the most important algebraic skills — it is how you solve quadratic equations, simplify fractions, and find roots of polynomials. There are three main methods to learn: <em>common grouping</em> (pull out a shared factor), <em>difference of two squares</em> (a special pattern), and <em>quadratic trinomial</em> (split the middle term).
              </p>
              <div className="space-y-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">By Common Grouping</p>
                  <ExBox title="Factor ax+ay+bx+by" color="blue">
                    <MBlock>{'Group: (ax+ay) + (bx+by)\nFactor: a(x+y) + b(x+y)\nResult: (x+y)(a+b)'}</MBlock>
                  </ExBox>
                  <ExBox title="Factor 2xy+6x+3y+9" color="blue">
                    <MBlock>{'Group: (2xy+6x) + (3y+9)\nFactor: 2x(y+3) + 3(y+3)\nResult: (y+3)(2x+3)'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Difference of Two Squares</p>
                  <MBlock>{'a² − b² = (a+b)(a−b)'}</MBlock>
                  <ExBox title="Factor x² − 25" color="green"><MBlock>{'(x+5)(x−5)'}</MBlock></ExBox>
                  <ExBox title="Factor 4y² − 9x²" color="green"><MBlock>{'(2y)²−(3x)² = (2y+3x)(2y−3x)'}</MBlock></ExBox>
                </Card>
                <Card color="purple" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Quadratic Expressions ax²+bx+c</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Case a=1: find two numbers that multiply to c and add to b.</p>
                  <ExBox title="Factor x²+7x+12" color="purple"><MBlock>{'Numbers → 3×4=12, 3+4=7\nResult: (x+3)(x+4)'}</MBlock></ExBox>
                  <ExBox title="Factor x²−2x−15" color="purple"><MBlock>{'Numbers → −5×3=−15, −5+3=−2\nResult: (x−5)(x+3)'}</MBlock></ExBox>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 mb-2">Case a≠1: find numbers that multiply to ac and add to b, then group.</p>
                  <ExBox title="Factor 2x²+5x+2" color="purple"><MBlock>{'ac = 4; find: 4×1=4, 4+1=5\nRewrite: 2x²+4x+x+2\nGroup: 2x(x+2)+1(x+2)\nResult: (x+2)(2x+1)'}</MBlock></ExBox>
                  <ExBox title="Factor 3x²−10x+8" color="purple"><MBlock>{'ac = 24; find: −6×−4=24, −6+(−4)=−10\nRewrite: 3x²−6x−4x+8\nGroup: 3x(x−2)−4(x−2)\nResult: (x−2)(3x−4)'}</MBlock></ExBox>
                </Card>
              </div>

              <SubHead>Perfect Square Trinomials</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                A perfect square trinomial is a special quadratic that factors into a <strong>binomial squared</strong>, like <M c="(x+3)²" />. Recognising this pattern saves time — instead of splitting the middle term and grouping, you can write the answer directly. The test: check that the first and last terms are perfect squares, and that the middle term equals exactly twice the product of their square roots.
              </p>
              <MBlock>{'a² + 2ab + b² = (a+b)²\na² − 2ab + b² = (a−b)²'}</MBlock>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { q: 'x²+6x+9', steps: 'x² ✓, 9=3² ✓, 2×x×3=6x ✓', ans: '(x+3)²' },
                  { q: '4x²−12x+9', steps: '4x²=(2x)² ✓, 9=3² ✓, 2×2x×3=12x ✓', ans: '(2x−3)²' },
                  { q: 'x²+5x+4', steps: 'x² ✓, 4=2², but 2×x×2=4x ≠ 5x ✗', ans: 'NOT a perfect square' },
                ].map(({ q, steps, ans }) => (
                  <ExBox key={q} title={`Is ${q} a perfect square?`} color="amber">
                    <p className="text-xs text-gray-500">{steps}</p>
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              {/* Quadratic equations */}
              <SubHead>Solving Quadratic Equations</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                A quadratic equation has the form <M c="ax² + bx + c = 0" /> and always has exactly <strong>two solutions</strong> (which may be equal, or complex). There are three methods — choose the easiest for the situation. <em>Factoring</em> is fastest when the numbers work out nicely. <em>Completing the square</em> always works and is essential for deriving the quadratic formula. The <em>quadratic formula</em> works on every quadratic without needing to spot a pattern first — it is your guaranteed fallback.
              </p>
              <div className="space-y-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Method 1 — Factoring</p>
                  <ExBox title="Solve x²−5x+6=0" color="blue"><MBlock>{'Factor: (x−2)(x−3)=0\nx−2=0 → x=2\nx−3=0 → x=3\nSolutions: x=2, x=3'}</MBlock></ExBox>
                  <ExBox title="Solve 2x²+7x+3=0" color="blue"><MBlock>{'Factor: (2x+1)(x+3)=0\n2x+1=0 → x=−½\nx+3=0  → x=−3\nSolutions: x=−½, x=−3'}</MBlock></ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Method 2 — Completing the Square</p>
                  <ExBox title="Solve x²+6x+5=0" color="green"><MBlock>{'x²+6x = −5\nAdd (6/2)²=9 to both sides:\nx²+6x+9 = 4\n(x+3)² = 4\nx+3 = ±2\nx = −1  or  x = −5'}</MBlock></ExBox>
                  <ExBox title="Solve 2x²−8x+6=0" color="green"><MBlock>{'Divide by 2: x²−4x+3=0\nx²−4x = −3\nAdd (−4/2)²=4:\n(x−2)² = 1\nx−2 = ±1\nx = 3  or  x = 1'}</MBlock></ExBox>
                </Card>
                <Card color="purple" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Method 3 — Quadratic Formula</p>
                  <MBlock>{'For ax² + bx + c = 0:\n\n         −b ± √(b²−4ac)\n    x = ─────────────────\n               2a'}</MBlock>
                  <ExBox title="Solve 2x²−5x+3=0" color="purple"><MBlock>{'a=2, b=−5, c=3\nx = (5 ± √(25−24)) / 4\nx = (5 ± 1) / 4\nx = 6/4 = 3/2   or   x = 4/4 = 1'}</MBlock></ExBox>
                  <ExBox title="Solve x²+4x+1=0" color="purple"><MBlock>{'a=1, b=4, c=1\nx = (−4 ± √(16−4)) / 2\nx = (−4 ± √12) / 2\nx = (−4 ± 2√3) / 2\nx = −2 ± √3'}</MBlock></ExBox>
                </Card>
              </div>

              {/* Function Notation */}
              <SubHead>Function Notation & Polynomial Functions</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                A <strong>function</strong> is a rule that takes an input and produces exactly one output. The notation <M c="f(x)" /> is just a tidy way of writing "the output when the input is x". It is more powerful than writing <M c="y =" /> because you can evaluate multiple inputs without confusion — <M c="f(2)" /> and <M c="f(5)" /> are unambiguous, whereas using <M c="y" /> for both would be confusing. A <strong>polynomial function</strong> is any function built from non-negative integer powers of x — the most common type you will work with in this course.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card color="indigo" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Function Notation f(x)</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If <M c="y = 2x+1" />, write as <M c="f(x) = 2x+1" />. To find <M c="f(3)" />, substitute x=3:</p>
                  <MBlock>{'f(3) = 2(3) + 1 = 7'}</MBlock>
                </Card>
                <Card color="amber" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Evaluating Polynomials</p>
                  <ExBox title="Evaluate 3x²−2x+5 when x=2" color="amber"><MBlock>{'3(2)²−2(2)+5 = 12−4+5 = 13'}</MBlock></ExBox>
                  <ExBox title="Evaluate x³−4x when x=−1" color="amber"><MBlock>{'(−1)³−4(−1) = −1+4 = 3'}</MBlock></ExBox>
                </Card>
              </div>
            </div>

            {/* SECTION 2: Polynomial Functions, Indices & Logarithms */}
            <div
              ref={(el) => {
                sectionRefs.current['polynomials-logs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Polynomial Functions, Indices &amp; Logarithms
              </h2>

              <SubHead>Horner's (Nesting) Method for Evaluating Polynomials</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Evaluating a polynomial like <M c="3x⁴ − 2x³ + 5x² − x + 7" /> at a given value of x by substituting directly means computing four separate powers. Horner's method avoids this by <strong>rewriting the polynomial as nested multiplications</strong> — you only ever multiply by x, never raise x to a power. This is faster, has fewer steps, and produces fewer rounding errors. It is also the basis of synthetic division. The key insight: work from the highest-degree coefficient inward, alternating multiply-then-add.
              </p>
              <div className={`${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-600'} text-white rounded-lg p-5 mb-4`}>
                <p className="font-black uppercase text-sm mb-2">Concept</p>
                <p className="text-indigo-100 text-sm mb-2">Rewrite <M c="p(x) = aₙxⁿ+...+a₁x+a₀" /> as nested multiplications to minimise computation and rounding errors.</p>
                <MBlock>{'p(c) = a₀ + c(a₁ + c(a₂ + ... + c(aₙ₋₁ + c·aₙ)...))'}</MBlock>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg p-4 mb-4">
                <div className="flex gap-2 items-center mb-1"><Info size={14} className="text-yellow-600" /><span className="font-black text-xs uppercase text-yellow-700 dark:text-yellow-300">Steps</span></div>
                <ol className="text-sm text-yellow-900 dark:text-yellow-100 space-y-1 list-decimal list-inside">
                  <li>Start with the coefficient of the highest power (aₙ).</li>
                  <li>Multiply by the substitution value c.</li>
                  <li>Add the next coefficient.</li>
                  <li>Multiply again by c.</li>
                  <li>Repeat until you add the constant term (a₀).</li>
                </ol>
              </div>

              <div className="space-y-4">
                <ExBox title="Example 1: Evaluate p(x)=2x²−3x+5 at x=4" color="blue">
                  <MBlock>{'Coefficients: 2, −3, 5  →  c = 4\nStart:   2\n× 4:     8\n+ (−3):  5\n× 4:     20\n+ 5:     25\np(4) = 25'}</MBlock>
                </ExBox>
                <ExBox title="Example 2: Evaluate p(x)=x³−4x²+6x−2 at x=3" color="green">
                  <MBlock>{'Coefficients: 1, −4, 6, −2  →  c = 3\nStart:   1\n× 3:     3\n+ (−4): −1\n× 3:    −3\n+ 6:     3\n× 3:     9\n+ (−2):  7\np(3) = 7'}</MBlock>
                </ExBox>
                <ExBox title="Example 3: Evaluate p(x)=3x⁴−2x³+5x²−x+7 at x=−2" color="purple">
                  <MBlock>{'Coefficients: 3, −2, 5, −1, 7  →  c = −2\nStart:   3\n× (−2): −6\n+ (−2): −8\n× (−2): 16\n+ 5:    21\n× (−2):−42\n+ (−1):−43\n× (−2): 86\n+ 7:    93\np(−2) = 93'}</MBlock>
                </ExBox>
              </div>

              <SubHead>The Remainder Theorem</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                When you divide a polynomial by a linear expression like <M c="(x − c)" />, you get a quotient and a <strong>remainder</strong>. The Remainder Theorem says you do not need to perform the full division to find that remainder — just substitute <M c="x = c" /> into the polynomial and evaluate it. That result <em>is</em> the remainder. This saves a huge amount of working, especially for higher-degree polynomials.
              </p>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Statement:</strong> If p(x) is divided by (x − c), the remainder equals <M c="p(c)" />.</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">No long division needed — just substitute!</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ExBox title="Find remainder: p(x)=x³−4x²+5x+3 ÷ (x−2)" color="blue">
                  <MBlock>{'Remainder = p(2)\n= 8 − 16 + 10 + 3\n= 5'}</MBlock>
                </ExBox>
                <ExBox title="Find remainder: p(x)=2x³+3x²−4x+1 ÷ (x+1)" color="green">
                  <MBlock>{'x+1 → c = −1\np(−1) = −2+3+4+1\n= 6'}</MBlock>
                </ExBox>
              </div>

              <SubHead>The Factor Theorem</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                The Factor Theorem is the Remainder Theorem taken one step further. If the remainder when dividing by <M c="(x − c)" /> is <strong>zero</strong>, then <M c="(x − c)" /> divides in perfectly — meaning it is a <em>factor</em>. This gives you a practical method to fully factorise cubic and higher-degree polynomials: try small integer values of x until you find one that makes the polynomial equal zero, then use that factor to reduce the degree and factorise the rest.
              </p>
              <div className={`${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-50'} border border-indigo-200 dark:border-indigo-900 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-indigo-800 dark:text-indigo-200"><strong>(x − c) is a factor of p(x)</strong> if and only if <M c="p(c) = 0" />.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <ExBox title="Is (x−1) a factor of x³−6x²+11x−6?" color="blue">
                  <MBlock>{'p(1) = 1−6+11−6 = 0 ✓\nYes, (x−1) is a factor.'}</MBlock>
                </ExBox>
                <ExBox title="Is (x+2) a factor of x³+8?" color="green">
                  <MBlock>{'p(−2) = −8+8 = 0 ✓\nYes, (x+2) is a factor.'}</MBlock>
                </ExBox>
              </div>
              <ExBox title="Fully Factorize p(x)=x³−2x²−5x+6" color="purple">
                <MBlock>{'Try x=1: 1−2−5+6 = 0  → (x−1) is a factor\nDivide: x³−2x²−5x+6 ÷ (x−1) = x²−x−6\nFactor quadratic: (x−3)(x+2)\n\nFull factorization:\np(x) = (x−1)(x−3)(x+2)'}</MBlock>
              </ExBox>

              <SubHead>Rules of Indices (Laws of Exponents)</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                These eight rules let you <strong>simplify any expression involving powers</strong> without a calculator. They all come from the basic meaning of an index as repeated multiplication. For example, <M c="a² × a³" /> is really <M c="(a×a) × (a×a×a) = a⁵" /> — you just add the indices. Learn these rules until they are automatic; they appear in every topic from here onward, including logarithms, standard form, and calculus.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { rule: 'Rule 1 — Multiplication (same base)', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ', ex: '2² × 2³ = 2⁵ = 32' },
                  { rule: 'Rule 2 — Division (same base)', formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ', ex: '3⁵ ÷ 3² = 3³ = 27' },
                  { rule: 'Rule 3 — Power of a power', formula: '(aᵐ)ⁿ = aᵐⁿ', ex: '(4²)³ = 4⁶ = 4096' },
                  { rule: 'Rule 4 — Zero index', formula: 'a⁰ = 1  (a ≠ 0)', ex: '7⁰ = 1' },
                  { rule: 'Rule 5 — Negative index', formula: 'a⁻ⁿ = 1/aⁿ', ex: '2⁻³ = 1/8' },
                  { rule: 'Rule 6 — Fractional index', formula: 'a¹/ⁿ = ⁿ√a\naᵐ/ⁿ = (ⁿ√a)ᵐ', ex: '8¹/³ = ∛8 = 2\n4³/² = (√4)³ = 8' },
                  { rule: 'Rule 7 — Power of a product', formula: '(ab)ⁿ = aⁿbⁿ', ex: '(2x)³ = 8x³' },
                  { rule: 'Rule 8 — Power of a quotient', formula: '(a/b)ⁿ = aⁿ/bⁿ', ex: '(3/4)² = 9/16' },
                ].map(({ rule, formula, ex }) => (
                  <Rule key={rule} name={rule} formula={`${formula}\n\nExample: ${ex}`} />
                ))}
              </div>

              <SubHead>Applying Indices — Simplification Examples</SubHead>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { q: 'Simplify (x³y²)×(x⁴y⁵)', sol: 'x³⁺⁴y²⁺⁵ = x⁷y⁷' },
                  { q: 'Simplify (12a⁵b³)÷(4a²b)', sol: '(12/4)a⁵⁻²b³⁻¹ = 3a³b²' },
                  { q: 'Simplify (3x²)⁴', sol: '3⁴(x²)⁴ = 81x⁸' },
                  { q: 'Simplify 16¹/²', sol: '√16 = 4' },
                  { q: 'Simplify 8⁻²/³', sol: '1/8²/³ = 1/(∛8)² = 1/4' },
                  { q: 'Simplify (2x³y⁻¹)÷(x⁻²y²)', sol: '2x³⁻(⁻²)y⁻¹⁻² = 2x⁵y⁻³ = 2x⁵/y³' },
                ].map(({ q, sol }) => (
                  <ExBox key={q} title={q} color="indigo">
                    <MBlock>{sol}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Standard Form (Scientific Notation)</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="font-black text-sm text-indigo-600 dark:text-indigo-400 uppercase mb-2">Form: a × 10ⁿ where 1 ≤ |a| {'<'} 10, n is an integer</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Move decimal until one non-zero digit is on the left.</li>
                  <li>• Count moves: left → n is positive; right → n is negative.</li>
                </ul>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {[
                  { q: '5,400,000', steps: 'Move decimal 6 places left', ans: '5.4 × 10⁶' },
                  { q: '0.00037', steps: 'Move decimal 4 places right', ans: '3.7 × 10⁻⁴' },
                  { q: '234.567', steps: 'Move decimal 2 places left', ans: '2.34567 × 10²' },
                  { q: '0.0987', steps: 'Move decimal 2 places right', ans: '9.87 × 10⁻²' },
                ].map(({ q, steps, ans }) => (
                  <ExBox key={q} title={`${q} in standard form`} color="blue">
                    <p className="text-xs text-gray-500">{steps}</p>
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Operations in Standard Form</SubHead>
              <MBlock>{'Multiplication: (a×10ⁿ) × (b×10ᵐ) = (a×b) × 10ⁿ⁺ᵐ\nDivision:       (a×10ⁿ) ÷ (b×10ᵐ) = (a÷b) × 10ⁿ⁻ᵐ\nAddition:       (a×10ⁿ) ± (b×10ⁿ) = (a±b) × 10ⁿ  [same power only]'}</MBlock>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { q: '(3×10⁵) × (2×10³)', ans: '(3×2) × 10⁵⁺³ = 6 × 10⁸' },
                  { q: '(8×10⁷) ÷ (4×10⁴)', ans: '(8÷4) × 10⁷⁻⁴ = 2 × 10³' },
                  { q: '(5×10⁴) + (3×10⁴)', ans: '(5+3) × 10⁴ = 8 × 10⁴' },
                  { q: '(6×10⁵) + (4×10³)', ans: '= 6×10⁵ + 0.04×10⁵\n= 6.04 × 10⁵' },
                ].map(({ q, ans }) => (
                  <ExBox key={q} title={q} color="green">
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              {/* Logarithms */}
              <SubHead>Logarithms</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">A logarithm is the <em>inverse of exponentiation</em>.</p>
                <MBlock>{'If  bʸ = x  then  logb(x) = y\n\nExample: 10² = 100  →  log₁₀(100) = 2'}</MBlock>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>Base (b)</strong>: number raised to the power. <strong>Argument (x)</strong>: the number. <strong>Logarithm (y)</strong>: the exponent.</p>
              </div>

              <SubHead>Laws of Logarithms</SubHead>
              <div className="space-y-2">
                {[
                  { name: 'Product Rule', formula: 'logb(mn) = logb(m) + logb(n)', ex: 'log₂(8×4) = log₂8 + log₂4 = 3+2 = 5' },
                  { name: 'Quotient Rule', formula: 'logb(m/n) = logb(m) − logb(n)', ex: 'log₁₀(1000/10) = 3−1 = 2' },
                  { name: 'Power Rule', formula: 'logb(mᵖ) = p × logb(m)', ex: 'log₅(25³) = 3×log₅25 = 3×2 = 6' },
                  { name: 'Change of Base', formula: 'logb(m) = logc(m) / logc(b)', ex: 'log₂(8) = log₁₀8 / log₁₀2 ≈ 3' },
                  { name: 'Log of 1', formula: 'logb(1) = 0', ex: 'log₅(1) = 0' },
                  { name: 'Log of Base', formula: 'logb(b) = 1', ex: 'log₁₀(10) = 1' },
                ].map(({ name, formula, ex }) => (
                  <Rule key={name} name={name} formula={`${formula}\n\nExample: ${ex}`} />
                ))}
              </div>

              <SubHead>Anti-Logarithms (Converting Back)</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If <M c="logb(x) = y" />, then <M c="x = bʸ" />.</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  ['log₁₀(1000) = 3', '1000 = 10³'],
                  ['log₂(16) = 4', '16 = 2⁴'],
                  ['log₃(81) = 4', '81 = 3⁴'],
                  ['logₑ(x) = 2', 'x = e²  (e ≈ 2.71828)'],
                ].map(([from, to]) => (
                  <ExBox key={from} title={from} color="blue">
                    <MBlock>{to}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Natural (Napierian) Logarithms — ln(x)</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Natural logarithms use base <M c="e ≈ 2.71828" />. Denoted <M c="ln(x)" /> or <M c="logₑ(x)" />.</p>
                <MBlock>{'Example: ln(64) ≈ 4.1589'}</MBlock>
              </div>

              <SubHead>Solving Indicial Equations Using Logarithms</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">In indicial equations, the <em>variable appears in the exponent</em>. Strategy: take log of both sides, then use the Power Rule to bring the exponent down.</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { q: 'Solve 2ˣ = 16', sol: 'log(2ˣ) = log(16)\nx·log(2) = log(16)\nx = log(16)/log(2)\nx ≈ 1.2041/0.3010 ≈ 4\nCheck: 2⁴ = 16 ✓' },
                  { q: 'Solve 3²ˣ⁻¹ = 81', sol: '(2x−1)·log(3) = log(81)\n2x−1 = log(81)/log(3)\n2x−1 = 4\n2x = 5  →  x = 2.5\nCheck: 3²⁽²·⁵⁾⁻¹ = 3⁴ = 81 ✓' },
                  { q: 'Solve 5ˣ = 20', sol: 'x·log(5) = log(20)\nx = log(20)/log(5)\nx ≈ 1.8614' },
                  { q: 'Solve e²ˣ = 10', sol: 'ln(e²ˣ) = ln(10)\n2x·ln(e) = ln(10)\n2x·1 = ln(10)\nx = ln(10)/2\nx ≈ 1.1513' },
                ].map(({ q, sol }) => (
                  <ExBox key={q} title={q} color="indigo">
                    <MBlock>{sol}</MBlock>
                  </ExBox>
                ))}
              </div>
            </div>

            {/* SECTION 3: Area, Volume & Engine Calculations */}
            <div
              ref={(el) => {
                sectionRefs.current['area-volume-engines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Area, Volume &amp; Engine Calculations
              </h2>

              <SubHead>Areas of Common Shapes</SubHead>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { shape: 'Circle', formula: 'A = πr²', ex: 'r = 5 cm\nA = π(5)² = 25π ≈ 78.54 cm²', color: 'blue' },
                  { shape: 'Annulus (Ring)', formula: 'A = π(R²−r²)\nR = outer radius, r = inner radius', ex: 'R=8, r=3\nA = π(64−9) = 55π ≈ 172.79 cm²', color: 'green' },
                  { shape: 'Cone', formula: 'Base area = πr²\nCurved surface = πrl\nTotal surface = πr(r+l)\nl = slant height', ex: 'r=4, l=7\nA = π(4)(11) = 44π ≈ 138.23 cm²', color: 'purple' },
                  { shape: 'Sphere', formula: 'A = 4πr²', ex: 'r = 6 cm\nA = 4π(36) = 144π ≈ 452.39 cm²', color: 'amber' },
                  { shape: 'Hemisphere', formula: 'Total = 3πr²\nCurved = 2πr²\nFlat = πr²', ex: 'r = 5 cm\nA = 3π(25) = 75π ≈ 235.62 cm²', color: 'red' },
                  { shape: 'Ellipse', formula: 'A = πab\na = semi-major, b = semi-minor', ex: 'a=7, b=4\nA = π(7)(4) = 28π ≈ 87.96 cm²', color: 'indigo' },
                ].map(({ shape, formula, ex, color }) => (
                  <Card key={shape} color={color as BoxColor} isDark={isDarkMode}>
                    <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">{shape}</p>
                    <MBlock>{formula}</MBlock>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-2 mb-1">Example</p>
                    <MBlock>{ex}</MBlock>
                  </Card>
                ))}
              </div>

              <SubHead>Volumes of Common Solids</SubHead>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { shape: 'Cylinder', formula: 'V = πr²h', exs: [{ l: 'r=3, h=7', s: 'V = π(9)(7) = 63π ≈ 197.92 cm³' }, { l: 'diameter=10m, h=12m  (r=5)', s: 'V = π(25)(12) = 300π ≈ 942.48 m³' }], color: 'blue' },
                  { shape: 'Cube', formula: 'V = s³', exs: [{ l: 's=4 in', s: 'V = 4³ = 64 in³' }, { l: 's=6.5 cm', s: 'V = 6.5³ = 274.625 cm³' }], color: 'green' },
                  { shape: 'Hollow Cylinder (Shell)', formula: 'V = π(R²−r²)h', exs: [{ l: 'R=8, r=6, h=10', s: 'V = π(64−36)(10) = 280π ≈ 879.65 cm³' }, { l: 'outer d=10, inner d=8, h=50 cm  (R=5,r=4)', s: 'V = π(25−16)(50) = 450π ≈ 1413.72 cm³' }], color: 'purple' },
                  { shape: 'Sphere', formula: 'V = (4/3)πr³', exs: [{ l: 'r=6 cm', s: 'V = (4/3)π(216) = 288π ≈ 904.78 cm³' }, { l: 'diameter=12 m  (r=6)', s: 'V = 288π ≈ 904.78 m³' }], color: 'amber' },
                  { shape: 'Cone', formula: 'V = (1/3)πr²h', exs: [{ l: 'r=5, h=9', s: 'V = (1/3)π(25)(9) = 75π ≈ 235.62 cm³' }, { l: 'diameter=10, h=15  (r=5)', s: 'V = (1/3)π(25)(15) = 125π ≈ 392.70 in³' }], color: 'red' },
                ].map(({ shape, formula, exs, color }) => (
                  <Card key={shape} color={color as BoxColor} isDark={isDarkMode}>
                    <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">{shape}</p>
                    <MBlock>{formula}</MBlock>
                    {exs.map(({ l, s }) => (
                      <div key={l}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{l}</p>
                        <MBlock>{s}</MBlock>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>

              <SubHead>Engine & Transmission Calculations</SubHead>
              <div className="space-y-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">1. Swept Volume (Vs)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Volume displaced as piston moves from BDC to TDC.</p>
                  <MBlock>{'Vs = πr²h\nr = bore radius,  h = stroke length'}</MBlock>
                  <ExBox title="Example: Bore=80mm, Stroke=90mm" color="blue">
                    <MBlock>{'r = 80/2 = 40 mm\nVs = π(40)²(90) = 144000π mm³\n   ≈ 452.39 cm³'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">2. Total Volume (Vt)</p>
                  <MBlock>{'Vt = Vs + Vc\n(Swept Volume + Clearance Volume)'}</MBlock>
                  <ExBox title="Example: Vs=452.39, Vc=50 cm³" color="green">
                    <MBlock>{'Vt = 452.39 + 50 = 502.39 cm³'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="purple" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">3. Compression Ratio (CR)</p>
                  <MBlock>{'CR = Vt / Vc'}</MBlock>
                  <ExBox title="Example: Vt=502.39, Vc=50 cm³" color="purple">
                    <MBlock>{'CR = 502.39 / 50 ≈ 10.05 : 1'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="amber" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">4. Gear Ratios & Belt Drives</p>
                  <MBlock>{'Gear Ratio       = Teeth(driven) / Teeth(driving)\nFinal Drive Ratio = Teeth(ring gear) / Teeth(pinion)\nTotal Ratio      = Gearbox ratio × Final drive ratio\nBelt Drive Ratio = Diameter(driven) / Diameter(driving)'}</MBlock>
                  <ExBox title="Example: 1st gear=3.5:1, final drive=4:1" color="amber">
                    <MBlock>{'Total 1st gear ratio = 3.5 × 4 = 14:1'}</MBlock>
                  </ExBox>
                  <ExBox title="Example: Air-Fuel Ratio (AFR)" color="amber">
                    <MBlock>{'Stoichiometric AFR = 14.7 : 1\n(14.7 kg air per 1 kg fuel)'}</MBlock>
                  </ExBox>
                  <ExBox title="Camshaft Drive Ratio Example" color="amber">
                    <MBlock>{'Crankshaft: 20 teeth, Camshaft: 40 teeth\nRatio = 40/20 = 2:1\n(Camshaft runs at half crankshaft speed)'}</MBlock>
                  </ExBox>
                </Card>
              </div>

              <SubHead>Types of Angles & Triangles</SubHead>
              <div className="grid md:grid-cols-2 gap-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Angle Types</p>
                  <Table isDark={isDarkMode} headers={['Type', 'Measure']} rows={[
                    ['Acute', '< 90°'],
                    ['Right', '= 90°'],
                    ['Obtuse', '> 90° and < 180°'],
                    ['Straight', '= 180°'],
                    ['Reflex', '> 180° and < 360°'],
                    ['Full Rotation', '= 360°'],
                  ]} />
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mt-3 mb-2">Angle Relationships</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• <strong>Adjacent:</strong> share a vertex and side</li>
                    <li>• <strong>Complementary:</strong> sum = 90°</li>
                    <li>• <strong>Supplementary:</strong> sum = 180°</li>
                    <li>• <strong>Vertical:</strong> opposite angles formed by intersecting lines (equal)</li>
                  </ul>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Triangle Types</p>
                  <Table isDark={isDarkMode} headers={['Type', 'Property']} rows={[
                    ['Acute-angled', 'All angles < 90°'],
                    ['Right-angled', 'One angle = 90°'],
                    ['Obtuse-angled', 'One angle > 90°'],
                    ['Equilateral', 'All sides & angles equal (60° each)'],
                    ['Isosceles', 'Two equal sides & angles'],
                  ]} />
                </Card>
              </div>

              <SubHead>Engine Kinematics</SubHead>
              <div className="space-y-4">
                <Card color="indigo" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Ignition Timing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Expressed in degrees of crankshaft rotation <strong>Before Top Dead Centre (BTDC)</strong>.</p>
                  <ExBox title="Example" color="indigo">
                    <p>Timing of <M c="10° BTDC" /> means the spark fires when the crankshaft is 10° before TDC.</p>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                      <li>• Heavy load → timing <em>retarded</em> (reduced) to prevent knock.</li>
                      <li>• Idle → timing may be <em>advanced</em> for smoother idle.</li>
                    </ul>
                  </ExBox>
                </Card>
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Piston Travel</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Distance piston moves from TDC to any point in its stroke.</p>
                  <MBlock>{'Full formula:\nx = r(1−cosθ) + l(1 − √(1 − (r/l)²sin²θ))\n\nSimplified (approximate):\nx = r(1 − cosθ)\n\nWhere:\n  x = piston travel\n  r = crank radius (stroke/2)\n  l = connecting rod length\n  θ = crank angle from TDC'}</MBlock>
                  <ExBox title="Example: r=40mm, l=160mm, θ=60°" color="blue">
                    <MBlock>{'x = 40(1−cos60°) + 160(1 − √(1 − (40/160)²·sin²60°))\n= 40(1−0.5) + 160(1 − √(1 − 0.0625×0.75))\n= 20 + 160(1 − √0.9531)\n= 20 + 160(1 − 0.9763)\n= 20 + 4.56\nx ≈ 24.56 mm'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Angle of Obliquity (φ)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Angle between connecting rod and cylinder centreline.</p>
                  <MBlock>{'sinφ = (r/l)·sinθ\nφ = arcsin((r/l)·sinθ)'}</MBlock>
                  <ExBox title="Example: r=40, l=160, θ=60°" color="green">
                    <MBlock>{'sinφ = (40/160)·sin60°\n     = 0.25 × 0.866 = 0.2165\nφ = arcsin(0.2165) ≈ 12.5°'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="purple" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Crank Angle from Piston Travel or Obliquity</p>
                  <MBlock>{'From piston travel:\n  cosθ = (r+l − √(l²−x(2l−x))) / r\n\nFrom obliquity angle:\n  sinθ = (l/r)·sinφ'}</MBlock>
                  <ExBox title="Using obliquity: φ=12.5°, r=40, l=160" color="purple">
                    <MBlock>{'sinθ = (160/40)·sin12.5°\n     = 4 × 0.2164 = 0.8656\nθ = arcsin(0.8656) ≈ 60°'}</MBlock>
                  </ExBox>
                </Card>
              </div>
            </div>

            {/* SECTION 4: Coordinate Geometry, Calculus & Matrices */}
            <div
              ref={(el) => {
                sectionRefs.current['calculus-matrices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Coordinate Geometry, Calculus &amp; Matrices
              </h2>

              <SubHead>Coordinate Geometry</SubHead>
              <div className="grid md:grid-cols-2 gap-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Midpoint of a Line Segment</p>
                  <MBlock>{'Midpoint = ( (x₁+x₂)/2 , (y₁+y₂)/2 )'}</MBlock>
                  <ExBox title="Find midpoint of A(2,5) and B(6,1)" color="blue">
                    <MBlock>{'M = ((2+6)/2, (5+1)/2)\n  = (8/2, 6/2)\n  = (4, 3)'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Slope (Gradient) of a Line</p>
                  <MBlock>{'m = (y₂−y₁) / (x₂−x₁)'}</MBlock>
                  <ExBox title="Slope through C(1,3) and D(4,9)" color="green">
                    <MBlock>{'m = (9−3)/(4−1)\n  = 6/3\n  = 2'}</MBlock>
                  </ExBox>
                </Card>
              </div>

              <SubHead>Equation of a Tangent to a Curve</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Differentiate the curve to get dy/dx.</li>
                  <li>Substitute the x-coordinate of the point to find the slope m.</li>
                  <li>Use point-slope form: <M c="y − y₁ = m(x − x₁)" /></li>
                  <li>Simplify.</li>
                </ol>
              </div>
              <ExBox title="Find tangent to y=x² at (2,4)" color="blue">
                <MBlock>{'dy/dx = 2x\nAt x=2: m = 4\ny−4 = 4(x−2)\ny = 4x − 4'}</MBlock>
              </ExBox>

              <SubHead>Sketching Straight Lines (y = mx + c)</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2`}>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>1. Identify y-intercept (c): the point (0, c).</li>
                  <li>2. Use slope m = rise/run: from (0,c) move up 'm' and right '1'.</li>
                  <li>3. Plot the two points; draw the line through them.</li>
                </ul>
              </div>
              <ExBox title="Sketch y = 2x − 1" color="blue">
                <MBlock>{'y-intercept: b = −1  →  point (0,−1)\nSlope m = 2  →  rise 2, run 1\nSecond point: (0+1, −1+2) = (1,1)\nDraw line through (0,−1) and (1,1)'}</MBlock>
              </ExBox>

              <SubHead>Sketching Quadratic Graphs (Maxima & Minima)</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-black mb-2">Steps for y = ax²+bx+c:</p>
                <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Vertex x-coordinate: <M c="x = −b/(2a)" /></li>
                  <li>Substitute to find vertex y-coordinate.</li>
                  <li>a {'>'} 0 → opens up (minimum); a {'<'} 0 → opens down (maximum).</li>
                  <li>y-intercept: set x=0 → y=c.</li>
                  <li>x-intercepts: solve ax²+bx+c=0.</li>
                  <li>Plot all points; sketch smooth parabola.</li>
                </ol>
              </div>
              <ExBox title="Sketch y = x²−4x+3" color="green">
                <MBlock>{'Vertex: x = −(−4)/(2×1) = 2\n         y = 4−8+3 = −1  →  vertex (2,−1)\nDirection: a=1>0 → opens upward (minimum)\ny-intercept: y = 0−0+3 = 3  →  (0,3)\nx-intercepts: (x−3)(x−1)=0 → x=1 and x=3\nKey points: (2,−1), (0,3), (1,0), (3,0)'}</MBlock>
              </ExBox>

              {/* Differentiation */}
              <SubHead>Differentiation</SubHead>
              <div className="space-y-2 mb-4">
                {[
                  { name: 'Power Rule', formula: 'If y = xⁿ  →  dy/dx = n·xⁿ⁻¹\nIf y = axⁿ →  dy/dx = an·xⁿ⁻¹' , note: "" },
                  { name: 'Constant Rule', formula: 'If y = c  →  dy/dx = 0' , note: "" },
                  { name: 'Sum/Difference Rule', formula: 'If y = u(x) ± v(x)  →  dy/dx = u\'(x) ± v\'(x)' , note: "" },
                ].map(({ name, formula }) => (
                  <Rule key={name} name={name} formula={formula} />
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { q: 'y = x³', ans: 'dy/dx = 3x²' },
                  { q: 'y = 5x⁴', ans: 'dy/dx = 20x³' },
                  { q: 'y = 7', ans: 'dy/dx = 0' },
                  { q: 'y = 2x³+4x²−6x+1', ans: 'dy/dx = 6x²+8x−6' },
                ].map(({ q, ans }) => (
                  <ExBox key={q} title={q} color="blue">
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Finding Slope of a Curve Algebraically</SubHead>
              <ExBox title="Find slope of y=x² at x=3" color="green">
                <MBlock>{'dy/dx = 2x\nAt x=3: slope = 2(3) = 6'}</MBlock>
              </ExBox>

              <SubHead>Velocity & Acceleration via Differentiation</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <MBlock>{'s(t) = position\nv(t) = ds/dt        (velocity = 1st derivative)\na(t) = dv/dt = d²s/dt² (acceleration = 2nd derivative)'}</MBlock>
              </div>
              <ExBox title="s(t)=t³−6t²+9t — find v and a at t=2" color="purple">
                <MBlock>{'v(t) = ds/dt = 3t²−12t+9\na(t) = dv/dt = 6t−12\n\nAt t=2:\n  v(2) = 3(4)−24+9 = −3\n  a(2) = 12−12 = 0'}</MBlock>
              </ExBox>

              {/* Integration */}
              <SubHead>Integration</SubHead>
              <div className="space-y-2 mb-4">
                {[
                  { name: 'Power Rule of Integration', formula: '∫xⁿ dx  = xⁿ⁺¹/(n+1) + C    (n ≠ −1)\n∫axⁿ dx = a·xⁿ⁺¹/(n+1) + C' , note: "" },
                  { name: 'Constant Rule', formula: '∫c dx = cx + C' , note: "" },
                  { name: 'Sum/Difference Rule', formula: '∫[u(x)±v(x)] dx = ∫u dx ± ∫v dx' , note: "" },
                ].map(({ name, formula }) => (
                  <Rule key={name} name={name} formula={formula} />
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { q: '∫x² dx', ans: 'x³/3 + C' },
                  { q: '∫4x³ dx', ans: 'x⁴ + C' },
                  { q: '∫5 dx', ans: '5x + C' },
                  { q: '∫(3x²+2x−1) dx', ans: 'x³ + x² − x + C' },
                ].map(({ q, ans }) => (
                  <ExBox key={q} title={q} color="indigo">
                    <MBlock>{ans}</MBlock>
                  </ExBox>
                ))}
              </div>

              <SubHead>Finding the Constant of Integration (C)</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">Use an initial condition (a known point on the curve) to solve for C.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ExBox title="Integrate f(x)=2x, passes through (1,5)" color="blue">
                  <MBlock>{'∫2x dx = x² + C\nSub x=1, y=5:\n  5 = 1 + C  →  C = 4\nFunction: y = x² + 4'}</MBlock>
                </ExBox>
                <ExBox title="Integrate f(x)=3x²+2x, passes through (2,10)" color="green">
                  <MBlock>{'∫(3x²+2x) dx = x³+x² + C\nSub x=2, y=10:\n  10 = 8+4+C  →  C = −2\nFunction: y = x³+x²−2'}</MBlock>
                </ExBox>
              </div>

              {/* Matrices */}
              <SubHead>Matrices</SubHead>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Types of Matrices</p>
                  <Table isDark={isDarkMode} headers={['Type', 'Definition', 'Example']} rows={[
                    ['Row', '1 row only', '[1, 2, 3]'],
                    ['Column', '1 column only', '[4]\n[5]'],
                    ['Square', 'Rows = Columns', '[1,2]\n[3,4]'],
                    ['Zero (Null)', 'All elements = 0', '[0,0]\n[0,0]'],
                    ['Identity (I)', '1s on diagonal', '[1,0]\n[0,1]'],
                    ['Diagonal', 'Off-diagonal = 0', '[2,0]\n[0,5]'],
                  ]} />
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Matrix Notation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Matrices are denoted by <em>uppercase letters</em>. Elements by <M c="aᵢⱼ" /> (row i, column j). A matrix with m rows and n columns is <M c="m × n" />.</p>
                  <MBlock>{'       ┌ a₁₁  a₁₂  ⋯  a₁ₙ ┐\nA  =   │ a₂₁  a₂₂  ⋯  a₂ₙ │\n       │  ⋮    ⋮   ⋱   ⋮  │\n       └ aₘ₁  aₘ₂  ⋯  aₘₙ ┘'}</MBlock>
                </Card>
              </div>

              <SubHead>Matrix Addition & Subtraction</SubHead>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Only possible when matrices have the <strong>same dimensions</strong>. Add/subtract corresponding elements.</p>
              <div className="grid md:grid-cols-3 gap-3">
                <ExBox title="Addition 2×2" color="blue">
                  <MBlock>{'A = [2,3]  B = [5,1]\n    [1,4]      [2,0]\n\nA+B = [7,4]\n      [3,4]'}</MBlock>
                </ExBox>
                <ExBox title="Subtraction 2×2" color="green">
                  <MBlock>{'C = [8,6]  D = [3,5]\n    [9,2]      [1,7]\n\nC−D = [5,1]\n      [8,−5]'}</MBlock>
                </ExBox>
                <ExBox title="Addition 3×3" color="purple">
                  <MBlock>{'E = [1,2,3]  F = [9,8,7]\n    [4,5,6]      [6,5,4]\n    [7,8,9]      [3,2,1]\n\nE+F = [10,10,10]\n      [10,10,10]\n      [10,10,10]'}</MBlock>
                </ExBox>
              </div>

              <SubHead>Matrix Multiplication</SubHead>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Scalar Multiplication</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Multiply each element by the scalar.</p>
                  <ExBox title="3 × A where A=[2,3][1,4]" color="blue">
                    <MBlock>{'3A = [6,9]\n     [3,12]'}</MBlock>
                  </ExBox>
                  <ExBox title="−2 × A where A=[4,−1][0,2]" color="blue">
                    <MBlock>{'−2A = [−8, 2]\n      [ 0,−4]'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Matrix × Matrix</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Columns of A must equal rows of B. Element (i,j) = dot product of row i of A and column j of B.</p>
                  <ExBox title="A=[1,2][3,4] × B=[5,6][7,8]" color="green">
                    <MBlock>{'Row 1 × Col 1: 1×5+2×7 = 19\nRow 1 × Col 2: 1×6+2×8 = 22\nRow 2 × Col 1: 3×5+4×7 = 43\nRow 2 × Col 2: 3×6+4×8 = 50\n\nA×B = [19,22]\n      [43,50]'}</MBlock>
                  </ExBox>
                </Card>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <ExBox title="A=[2,1][0,3] × B=[1,−2][4,5]" color="indigo">
                  <MBlock>{'A×B = [2×1+1×4,  2×−2+1×5]\n      [0×1+3×4,  0×−2+3×5]\n    = [6, 1]\n      [12,15]'}</MBlock>
                </ExBox>
                <ExBox title="C=[1,0,−1] × D=[2][3][4]" color="purple">
                  <MBlock>{'C×D = [1×2+0×3+(−1)×4]\n    = [2+0−4]\n    = [−2]'}</MBlock>
                </ExBox>
                <ExBox title="E=[1,2][3,4][5,6] × F=[7,8][9,10]" color="amber">
                  <MBlock>{'E×F = [1×7+2×9,  1×8+2×10]\n      [3×7+4×9,  3×8+4×10]\n      [5×7+6×9,  5×8+6×10]\n    = [25,28]\n      [57,68]\n      [89,100]'}</MBlock>
                </ExBox>
              </div>

              <SubHead>Solving Simultaneous Equations Using Matrices</SubHead>
              <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-white'} border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4`}>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Write the system as <M c="AX = B" />, then solve: <M c="X = A⁻¹B" /></p>
                <MBlock>{'A = coefficient matrix\nX = variable matrix (column)\nB = constant matrix (column)\n\nFor 2×2: A⁻¹ = (1/det(A)) × [d, −b][-c, a]\nwhere A=[a,b][c,d] and det(A) = ad−bc'}</MBlock>
              </div>
              <ExBox title="Solve: 2x+y=5 and x−y=1" color="blue">
                <MBlock>{'A = [2, 1]  B = [5]\n    [1,−1]      [1]\n\ndet(A) = (2×−1)−(1×1) = −3\nA⁻¹ = (1/−3)×[−1,−1]\n              [−1, 2]\n    = [1/3,  1/3]\n      [1/3, −2/3]\n\nX = A⁻¹B:\nx = (1/3)×5 + (1/3)×1 = 2\ny = (1/3)×5 + (−2/3)×1 = 1\nSolution: x=2, y=1'}</MBlock>
              </ExBox>

              {/* Vectors */}
              <SubHead>Vectors & Scalars</SubHead>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Vectors — Magnitude AND Direction</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Velocity (60 km/h east)</li>
                    <li>• Force (10 N downward)</li>
                    <li>• Displacement, Acceleration</li>
                  </ul>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Scalars — Magnitude only</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Temperature, Mass, Time</li>
                    <li>• Distance, Speed, Energy</li>
                  </ul>
                </Card>
              </div>

              <SubHead>Vector Notation</SubHead>
              <MBlock>{'Boldface letter:    v  or  F\nArrow notation:     →v  or  →F\n2D component form:  v = (vₓ, vy)  or  v = vₓi + vyj\n3D component form:  v = (vₓ, vy, vz)\nMagnitude:         |v|\nUnit vector:        v̂  (magnitude = 1)'}</MBlock>

              <SubHead>Types of Vectors</SubHead>
              <Table isDark={isDarkMode}
                headers={['Type', 'Description']}
                rows={[
                  ['Zero Vector', 'Magnitude = 0, no specific direction. Notation: 0'],
                  ['Unit Vector', 'Magnitude = 1. Used to indicate direction. Notation: â'],
                  ['Position Vector', 'Specifies position of a point relative to origin.'],
                  ['Displacement Vector', 'Change in position from initial to final.'],
                  ['Equal Vectors', 'Same magnitude AND direction.'],
                  ['Negative Vectors', 'Same magnitude, opposite direction.'],
                ]}
              />

              <SubHead>Vector Addition</SubHead>
              <div className="grid md:grid-cols-2 gap-4">
                <Card color="blue" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Method 1 — Component-wise</p>
                  <MBlock>{'A = (Aₓ, Ay),  B = (Bₓ, By)\nA+B = (Aₓ+Bₓ, Ay+By)'}</MBlock>
                  <ExBox title="2D: A=(3,4), B=(1,−2)" color="blue">
                    <MBlock>{'A+B = (3+1, 4+(−2)) = (4, 2)'}</MBlock>
                  </ExBox>
                  <ExBox title="3D: C=(1,−4,3), D=(2,0,−1)" color="blue">
                    <MBlock>{'C+D = (3, −4, 2)'}</MBlock>
                  </ExBox>
                  <ExBox title="Three vectors: E=(2,−1), F=(0,3), G=(−4,−2)" color="blue">
                    <MBlock>{'E+F+G = (2+0+(−4), −1+3+(−2))\n       = (−2, 0)'}</MBlock>
                  </ExBox>
                </Card>
                <Card color="green" isDark={isDarkMode}>
                  <p className="font-black text-sm uppercase text-gray-900 dark:text-white mb-2">Method 2 — Head-to-Tail (Graphical)</p>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>1. Draw vector A as an arrow.</p>
                    <p>2. Place the <em>tail</em> of B at the <em>head</em> of A.</p>
                    <p>3. Draw the resultant from tail of A to head of B.</p>
                  </div>
                  <div className={`mt-3 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'} rounded p-3 text-xs text-gray-500 dark:text-gray-400 font-mono`}>
                    <p>Properties:</p>
                    <p>• Commutative: A+B = B+A</p>
                    <p>• Associative: A+(B+C) = (A+B)+C</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Maths Insight
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
                  <span>Number Systems</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Algebraic Laws</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Indices Rules</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Matrix Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Master the number systems, rounding, and BODMAS. Understand equations, transposition,
                and factorisation. Learn the laws of indices and logarithms. Practice area, volume,
                and engine calculations. Grasp coordinate geometry, differentiation, integration,
                matrices, and vectors. These skills are essential for engineering and science.
                Work through examples and check your answers.
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
                <strong className="text-white">Numbers &amp; Algebra</strong> – Understand number sets,
                rounding, base conversions, BODMAS, equations, transposition, factorisation, quadratic
                equations, and function notation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Polynomials, Indices &amp; Logarithms</strong> – Horner's
                method, Remainder and Factor Theorems, eight rules of indices, standard form, laws of
                logarithms, and solving indicial equations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Area, Volume &amp; Engines</strong> – Area and volume
                formulas for common shapes (circle, cone, sphere, cylinder, etc.), engine calculations
                (swept volume, compression ratio, gear ratios), angle types, and engine kinematics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Calculus &amp; Matrices</strong> – Coordinate geometry,
                tangent equations, sketching lines and quadratics, differentiation (power rule),
                integration (power rule, constant of integration), matrix operations (addition,
                multiplication, inverse), and vectors.
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
            Sidemann Academic Registry • Simply Easy Maths — LO1
          </span>
        </div>
      </footer>
    </div>
    </AutomotiveMathProvider>
  );
};

export default LearningOutcome1;
