import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Shield,
  Wrench,
  Bolt,
  UserCog,
  HardDrive,
  Recycle,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Brain,
  Sparkles,
  RefreshCw,
  ChevronUp,
  BookOpen,
  X,
  Search,
  Eye,
  EarOff,
  Glasses,
  Microchip,
  FireExtinguisher,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'safety-rules', label: 'Safety Rules' },
  { id: 'electrical', label: 'Electrical Safety' },
  { id: 'tool-safety', label: 'Tool Safety' },
  { id: 'ergonomics', label: 'Ergonomics' },
  { id: 'regulations', label: 'Regulations' },
  { id: 'hardware-security', label: 'Hardware Security' },
  { id: 'antistatic', label: 'ESD & EMI' },
  { id: 'power-management', label: 'Power Management' },
  { id: 'health-hazards', label: 'Health Hazards' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'safety-tools', label: 'Safety Tools' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        text: 'The first recorded "computer bug" was an actual moth found in the Harvard Mark II computer in 1947.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear an anti-static wrist strap when handling internal components – a tiny static discharge can destroy a modern microchip.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Ps of workshop safety: Personal Protection, Power Down, and Proper Tools.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the power-down step. Even after unplugging, capacitors can hold dangerous charges for several minutes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first recorded "computer bug" was an actual moth found in the Harvard Mark II computer in 1947.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear an anti-static wrist strap when handling internal components – a tiny static discharge can destroy a modern microchip.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Ps of workshop safety: Personal Protection, Power Down, and Proper Tools.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the power-down step. Even after unplugging, capacitors can hold dangerous charges for several minutes.',
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Copy to clipboard (kept for potential code blocks) ──────────────
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Syntax highlighting (kept for consistency) ──────────────────────
  const highlightSyntax = (code: string): React.ReactNode => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholders: Record<string, string> = {};
    let counter = 0;

    escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
      const key = `__COMMENT_${counter++}__`;
      placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
      return key;
    });

    escaped = escaped.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
      const key = `__STRING_${counter++}__`;
      placeholders[key] = `<span class="text-[#D69D85] dark:text-[#ce9178]">${match}</span>`;
      return key;
    });

    const keywords = [
      'int', 'void', 'char', 'double', 'float', 'if', 'else', 'return', 'for',
      'while', 'do', 'break', 'continue', 'switch', 'case', 'default', 'class',
      'struct', 'public', 'private', 'protected', 'namespace', 'using', 'include',
      'define', 'endl', 'cout', 'cin', 'main', 'bool', 'const', 'new', 'delete',
      'virtual', 'override', 'final', 'template', 'typename', 'auto', 'static',
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'cerr'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'Node'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');
    escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#16a34a] dark:text-[#b5cea8]">$1</span>');

    Object.keys(placeholders).forEach(key => {
      escaped = escaped.replace(key, placeholders[key]);
    });

    const lines = escaped.split('\n');
    return lines.map((line, idx) => (
      <div key={idx} className="flex min-h-[1.5rem] hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-md transition-colors">
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-xs pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-white dark:bg-[#0a0a0b] p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  // ─── Table component ────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> IT WORKSHOP SAFETY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Safety, Security & Environmental Responsibility
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master IT workshop safety, hardware security, and environmental
            responsibility. Understand the rules, regulations, and best practices
            that keep you, your equipment, and the planet safe.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Safety
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <UserCog size={14} className="inline mr-1" /> Security
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
                placeholder="Search for a safety rule, tool, or regulation..."
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
                  <X size={18} className="text-indigo-200" />
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
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Workshop Safety
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome focuses on <span className="font-bold">responsibility</span> – your
                    responsibility for your own safety, the safety of others in the workshop, the security of
                    the equipment you work on, and even your responsibility to the environment.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Quick Reminder</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Don't cram this word for word. Read it, understand what's being discussed, and explain it in
                  your own words in the exam. A simple, clear explanation that shows you <span className="font-bold underline decoration-amber-500">get it</span>
                  is worth far more than a memorised paragraph.
                </p>
              </div>
            </div>

            {/* ─── Section 2: Safety Rules ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['safety-rules'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                IT Workshop Safety Rules and Regulations
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">
                Before we even touch a computer or tool in a workshop, there are rules that exist to keep everyone safe.
                These rules are not there to annoy you – they exist because workshops deal with electrical equipment,
                sharp tools, and delicate components that can seriously hurt you or get damaged if you're not careful.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Personal Protective Equipment (PPE)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Gear worn to protect from harm – safety glasses, anti-static wrist straps, closed-toe shoes. Different tasks require different PPE.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">No Food or Drinks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Spills cause short circuits and electrocution. Food crumbs damage keyboards. Keep food and drinks completely out of the workshop.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">No Horseplay</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mucking around, pranking, or doing anything silly is dangerous. Workshops have tools, electrical equipment, and expensive components. Behave professionally.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Report Hazards Immediately</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Notice something wrong? Report it right away. Don't ignore it thinking "someone else will deal with it."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Clean Up Your Workspace</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">After finishing, clean up. Put tools back, dispose of waste properly. A messy workspace is a hazardous workspace.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Emergency Procedures</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Know where emergency exits, fire extinguishers, and first-aid kits are located. Know what to do in an emergency before anything happens.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 3: Electrical Safety ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['electrical'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Electrical Safety
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Power Down Before Working</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Always turn off and unplug before working. Working on a live device can cause electric shock, short circuits, and destroy components. Capacitors can hold charge even after unplugging.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Wet Hands or Wet Floors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Water conducts electricity. Never work with electrical equipment if your hands or the floor are wet. Dry your hands first and deal with spills immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Damaged Cords</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A power cord with damaged insulation can expose live wires. Never use damaged cords. Report them immediately so they can be replaced.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Surge Protectors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Surge protectors absorb excess voltage spikes. Every computer and sensitive device should be plugged into a surge protector, not directly into the wall.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Tool Safety ─────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['tool-safety'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Tool Safety
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Use the right tool for the job.</span> Don't improvise – using the wrong tool damages both the tool and the thing you're working on.</li>
                  <li><span className="font-bold">Keep tools in good condition.</span> Dull, broken, or damaged tools are dangerous. Report any poor condition tools.</li>
                  <li><span className="font-bold">Handle tools with care.</span> Don't wave them around or point them at people.</li>
                  <li><span className="font-bold">Store tools properly.</span> Put them back where they belong to keep the workspace safe and organised.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 5: Ergonomics ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['ergonomics'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Ergonomics
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Posture:</span> Sit up straight, keep screen at eye level, keep wrists straight. Slouching causes back pain; awkward wrist positions cause repetitive strain injuries like Carpal Tunnel Syndrome.</li>
                  <li><span className="font-bold">Take breaks:</span> Stand up, stretch, walk around briefly to reduce fatigue and eye strain.</li>
                  <li><span className="font-bold">Lifting:</span> Bend knees, lift with legs, keep load close. Ask for help if something is too heavy. Back injuries from improper lifting can be serious.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 6: Zimbabwe Regulations ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['regulations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Zimbabwe Government Health and Safety Regulations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">The Primary Laws</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>The Factories and Works Act (Chapter 20 of 1948)</strong> – Sets out rules for electrical safety, safe use of machinery, and safe working conditions.</li>
                    <li><strong>The Labour Act (No. 16 of 1985)</strong> – Places legal responsibility on employers to ensure the health, safety, and welfare of every worker.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Who Enforces These Laws?</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Ministry of Public Service, Labour and Social Welfare</strong> – Enforces occupational safety laws and conducts inspections.</li>
                    <li><strong>National Social Security Authority (NSSA)</strong> – Manages workers' compensation and accident prevention.</li>
                    <li><strong>Zimbabwe Occupational Safety and Health Council (ZOSHC)</strong> – Promotes good safety practices and provides guidelines.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 7: Hardware Security ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['hardware-security'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware Security
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Why Hardware Security Matters</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Software security (antivirus, firewalls) is important, but hardware security adds another layer.
                  Even if an attacker gets past your software defenses, strong hardware security can still protect your data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Hardware Security Module (HSM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A dedicated physical device that stores and manages encryption keys.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Trusted Platform Module (TPM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A chip on many modern motherboards that handles security functions like verifying the boot process and storing encryption keys securely.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Physical Security Measures</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li><strong>Access control:</strong> Security doors, key cards, PIN pads, cameras, visitor logs.</li>
                    <li><strong>Equipment security:</strong> Kensington locks, full-disk encryption.</li>
                    <li><strong>Environmental controls:</strong> Temperature/humidity regulation, fire suppression, backup power.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Biometric Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Uses physical characteristics like fingerprints, facial recognition, or iris scans for identity verification.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Real-Time Monitoring & Audits</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Security cameras, network monitoring, and system logs detect suspicious activity. Security audits systematically check for vulnerabilities.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Behavioral Controls</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li><strong>Security awareness training:</strong> Educates on phishing, social engineering.</li>
                    <li><strong>Acceptable Use Policy (AUP):</strong> Sets expectations for proper use.</li>
                    <li><strong>Data classification:</strong> Categorises data by sensitivity.</li>
                    <li><strong>Data Loss Prevention (DLP):</strong> Monitors and blocks unauthorised data transfers.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 8: Antistatic Precautions ──────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['antistatic'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Antistatic Precautions – ESD & EMI
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Electrostatic Discharge (ESD)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sudden flow of electricity between two differently charged objects. Even a tiny shock can permanently damage microchips.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Prevention:</strong> Anti-static wrist strap, static-dissipative mat, anti-static bags, touch grounded metal before handling components.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Electromagnetic Interference (EMI)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Electromagnetic energy from one device interfering with another. Can corrupt data signals and cause malfunctions.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Prevention:</strong> Metal computer cases act as shields, grounded cables, separate and organise cables, keep EMI-generating devices away from sensitive electronics.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 9: Power Management ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['power-management'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Power Management Problems and Solutions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Power Outages</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Complete loss of electricity. Can cause data loss and file corruption if the computer shuts down abruptly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Voltage Sags & Spikes</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sags are temporary drops in voltage; spikes are sudden surges. Both can cause reboots, erratic behaviour, or immediate damage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Power Line Noise</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Electrical interference on the power line causing subtle malfunctions over time.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Surge Suppressors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Divert excess voltage spikes to ground. Protect against spikes only, not outages or sags.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Uninterruptible Power Supply (UPS)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provides battery backup during outages, plus voltage regulation. Essential for critical equipment.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Standby Power Supply (SPS)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Similar to UPS but with a slower transfer time; less sophisticated but more affordable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Power Conditioner</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Cleans and regulates power, smoothing fluctuations and filtering noise. No battery backup, but provides stable power quality.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 10: Health Hazards ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['health-hazards'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Health Hazards in Computer Repair
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">High Voltage from PSU & Capacitors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Capacitors inside power supplies can hold dangerous charges even after unplugging. Always wait several minutes and wear insulated gloves when working near the PSU.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">CRT Monitors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Old CRT monitors operate at extremely high voltages and can hold charge. The glass tube can implode if mishandled. Handle with safety glasses and gloves.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Laser Hazards</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">CD/DVD drives use lasers. Never look directly into the lens; it can damage your eyesight.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Blue Light & Eye Strain</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Prolonged screen exposure causes eye strain and disrupts sleep. Use the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds) and blue light filters.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Additional Hazards</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li><span className="font-bold">Solder fumes:</span> Use ventilation or fume extractors when soldering.</li>
                    <li><span className="font-bold">Chemical exposure:</span> Wear gloves when using cleaning products or thermal paste.</li>
                    <li><span className="font-bold">Ergonomic hazards:</span> Poor posture can lead to Repetitive Strain Injuries (RSI).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 11: Environmental Lifecycle ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['lifecycle'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Environmental Life Cycle of Computer Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Design & Manufacturing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mining raw materials causes habitat destruction and pollution. Manufacturing uses hazardous chemicals and consumes large amounts of energy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">During Use</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Computers consume electricity and generate heat, contributing to carbon emissions and requiring cooling energy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Disposal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">E-waste contains toxic materials (lead, mercury) that leach into soil and water if landfilled. Valuable materials like gold and copper are wasted.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">What Can Be Done</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li><span className="font-bold">Sustainable design:</span> Use recycled materials and design for repairability.</li>
                  <li><span className="font-bold">Energy efficiency:</span> Choose efficient components and turn off devices when not in use.</li>
                  <li><span className="font-bold">Proper e-waste recycling:</span> Use certified recyclers who safely recover materials and dispose of toxins.</li>
                  <li><span className="font-bold">Extend the lifespan:</span> Repair and upgrade rather than replacing entire machines.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 12: Safety Tools ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['safety-tools'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Workshop Safety Tools – Know What Each One Is For
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Emergency Stop Button: Immediately shuts down machinery in an emergency.",
                  "Fire Extinguisher: Use the right type for the right fire. CO₂ or dry powder for electrical fires – never water.",
                  "Gangway Markings: Yellow floor markings that designate clear walkways, separating work areas from transit areas.",
                  "Lab Coats: Protect clothing and skin from dust, chemicals, and other hazards.",
                  "Safety Goggles: Protect eyes from flying debris, chemical splashes, and hazardous light.",
                  "Ear Muffs: Protect hearing from loud equipment. Hearing loss is permanent.",
                  "Safety Boots: Protect feet from heavy objects, sharp objects, and slippery surfaces.",
                  "Antistatic Gloves: Allow handling of electronics without risk of ESD damage.",
                  "Dust Masks: Prevent inhalation of dust particles when cleaning or working in dusty environments.",
                  "ESD Tools: Conductive tweezers and ESD-safe screwdrivers that don't generate static.",
                  "Cleaning Tools: Brushes, lint-free cloths, and appropriate solutions for safe cleaning."
                ].map((tool, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Section 13: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Safety Rules</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Use PPE: glasses, wrist strap, closed-toe shoes</li>
                    <li>No food/drink; no horseplay</li>
                    <li>Report hazards immediately</li>
                    <li>Clean workspace; know emergency procedures</li>
                    <li>Power down and unplug before working</li>
                    <li>Avoid wet hands/floors; never use damaged cords</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Hardware Security</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>HSM & TPM:</strong> Encryption key storage and secure boot</li>
                    <li><strong>Physical:</strong> Access control, locks, environmental controls</li>
                    <li><strong>Biometrics:</strong> Fingerprint, facial, iris recognition</li>
                    <li><strong>Monitoring:</strong> Cameras, network logs, alerts</li>
                    <li><strong>Behavioral:</strong> Training, AUP, data classification, DLP</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Environmental & Power</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>ESD/EMI:</strong> Wrist straps, shielded cables, case grounding</li>
                    <li><strong>Power:</strong> Surge protectors, UPS, SPS, power conditioners</li>
                    <li><strong>Lifecycle:</strong> Manufacturing, use, disposal – reduce, reuse, recycle</li>
                    <li><strong>Health hazards:</strong> High voltage, lasers, blue light, ergonomics</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      This whole learning outcome is about <span className="font-bold">responsibility</span> – your
                      responsibility for your own safety, the safety of others, the security of equipment, and the
                      environment. When answering, explain <span className="italic">why</span> each rule or measure
                      exists, not just <span className="italic">what</span> it is. Understanding the reasoning
                      behind the rules demonstrates real comprehension.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Protect it. Secure it. Recycle it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Safety Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span>Safety Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6+</span>
                </li>
                <li className="flex justify-between">
                  <span>Safety Tools Listed</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">11</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                An examiner is impressed when you can explain not just "wear a wrist strap" but
                <span className="font-bold"> why</span> – because static electricity from your body can
                permanently damage microchips. That level of understanding is what separates a good
                answer from a great one. You've got this!
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
                <strong className="text-white">Workshop safety</strong> is about personal responsibility –
                PPE, no food/drink, no horseplay, reporting hazards, and knowing emergency procedures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Electrical safety</strong> requires powering down, avoiding
                wet conditions, inspecting cords, and using surge protectors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hardware security</strong> includes HSM/TPM, physical access
                controls, biometrics, monitoring, and behavioral controls.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Environmental responsibility</strong> means considering the
                full lifecycle – design, use, and disposal – and recycling e-waste properly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Health hazards</strong> include high voltage, lasers, blue light,
                and ergonomic risks – each requires specific precautions.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • IT Workshop Safety, Security & Environmental Responsibility 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;