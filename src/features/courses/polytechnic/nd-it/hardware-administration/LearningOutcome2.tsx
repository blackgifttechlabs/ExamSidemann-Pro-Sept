import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Microchip,
  Keyboard,
  Mouse,
  Printer,
  HardDrive,
  Wrench,
  Search,
  ClipboardList,
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
  Layers,
  Workflow,
  Monitor,
  Gamepad,
  Camera,
  Mic,
  Video,
  MemoryStick,
  Cog,
  FileText,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'peripheral', label: 'Peripherals' },
  { id: 'input', label: 'Input' },
  { id: 'output', label: 'Output' },
  { id: 'storage', label: 'Storage' },
  { id: 'install', label: 'Install' },
  { id: 'disassembly', label: 'Disassembly' },
  { id: 'printer', label: 'Printer' },
  { id: 'performance', label: 'Performance' },
  { id: 'config', label: 'Config' },
  { id: 'document', label: 'Document' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const SERVICE_IMAGE_BASE = '/images/courses/nd-it/hardware-administration/learning-outcome-2';

const ServiceSteps: React.FC<{ steps: { title: string; text: string; image: string }[] }> = ({ steps }) => (
  <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {steps.map((step, index) => (
      <li key={step.image} className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <h5 className="text-base font-bold text-slate-900 dark:text-white">{index + 1}. {step.title}</h5>
        <p className="mt-2 mb-3 text-base text-slate-600 dark:text-slate-400">{step.text}</p>
        <img src={`${SERVICE_IMAGE_BASE}/${step.image}.webp`} alt={step.title} width={384} height={384} loading="lazy" decoding="async" className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-lg bg-white object-contain" />
      </li>
    ))}
  </ol>
);

export const LearningOutcome2: React.FC = () => {
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
        text: 'The first computer mouse was made of wood and had only one button. It was invented by Douglas Engelbart in 1964.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear an anti-static wrist strap when handling internal components. A tiny static discharge can fry a modern CPU.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the categories: Input (in), Output (out), Storage (save). Think of them as the three ways a computer talks to the outside world.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t force components when assembling. If it doesn\'t fit easily, check alignment. Forcing can break connectors or damage pins.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer mouse was made of wood and had only one button. It was invented by Douglas Engelbart in 1964.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear an anti-static wrist strap when handling internal components. A tiny static discharge can fry a modern CPU.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the categories: Input (in), Output (out), Storage (save). Think of them as the three ways a computer talks to the outside world.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t force components when assembling. If it doesn\'t fit easily, check alignment. Forcing can break connectors or damage pins.',
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
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
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
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-sm pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-sm md:text-base font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-base font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-sm transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
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
      <table className="w-full border-collapse text-base">
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
            <Microchip size={14} className="inline mr-1" /> HARDWARE COMPONENTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Hardware Components
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the fundamentals of computer hardware: peripheral devices,
            installation, disassembly, performance testing, and documentation.
            Understand how to build, configure, and test a complete system.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-base text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Keyboard size={14} className="inline mr-1" /> Input
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Monitor size={14} className="inline mr-1" /> Output
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
                placeholder="Search for a device, connector, or concept..."
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
        <div className="grid grid-cols-1 gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                System Architecture & Methodologies
              </h2>

              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
  <p className="text-base md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This module explores the specific lifecycle, design patterns, and methodologies required
                    to master hardware components. It focuses on systematic approaches, professional standards,
                    and real‑world implementation strategies used by modern engineering teams.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-slate-700 dark:text-slate-300" size={20} />
                  <span className="font-black uppercase text-slate-800 dark:text-slate-300">Quick Reminder</span>
                </div>
                <p className="text-slate-900 dark:text-slate-100 italic">
                  You don't need to memorize any of this word for word. Read it, understand what's being talked
                  about, and when you're in that exam room, explain it in YOUR words. Even simple English is
                  perfectly fine. Understanding beats memorizing every single time.
                </p>
              </div>
            </div>

            {/* ─── Section 2: Peripheral Devices ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['peripheral'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What is a Peripheral Device?
              </h2>

              <div className="py-2">
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  A peripheral device is any device connected to a computer to give it more information, get
                  information out of it, or store information on it. Peripherals are not essential for basic
                  function, but they make the computer actually useful to us.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <p className="text-base text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Three main categories:</span> Input, Output, and Storage.
                </p>
              </div>
            </div>

            {/* ─── Section 3: Input Devices ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['input'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Input Devices
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-400 italic mb-4">
                Input devices send information INTO the computer. You use them to give the computer instructions or data.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Keyboard size={16} /> Keyboard
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">The most basic input device. Every key press sends a signal to the computer.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/keyboard-v2.webp"
                    alt="Desktop keyboard with keys for entering text and commands"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mouse size={16} /> Mouse
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Controls the cursor on screen – move, click, drag, scroll.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/mouse-v2.webp"
                    alt="Computer mouse with buttons and a scroll wheel"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Touchpad</h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Built‑into laptops, works like a mouse – slide to move cursor, tap to click.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/touchpad-v2.webp"
                    alt="Laptop palm rest showing the built-in touchpad"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera size={16} /> Scanner
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Converts physical documents or photos into digital files.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/scanner-v2.webp"
                    alt="Open flatbed scanner for capturing documents"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Camera size={16} /> Webcam
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Captures video and images for calls, streaming, and recording.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/webcam-v2.webp"
                    alt="USB webcam with a mounting clip"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mic size={16} /> Microphone
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Captures audio – voice or any sound – for calls, recording, and gaming.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/microphone-v2.webp"
                    alt="Desktop microphone on a stand"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Gamepad size={16} /> Game Controller
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Designed for gaming with buttons, triggers, and thumbsticks.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/game-controller-v2.webp"
                    alt="Game controller with buttons and thumbsticks"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ─── Section 4: Output Devices ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['output'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Output Devices
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-400 italic mb-4">
                Output devices take information FROM the computer and present it to you in a way you can understand
                – visually, as sound, or as a physical printout.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Monitor size={16} /> Monitor
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">The most important output device. Shows everything visually.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/monitor.webp"
                    alt="Desktop monitor displaying a blue abstract screen"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Printer size={16} /> Printer
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Prints digital documents onto paper – creates physical copies.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/printer.webp"
                    alt="Desktop printer with paper output"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Speakers</h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Output sound – music, movies, games, notifications.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/speakers.webp"
                    alt="Pair of desktop speakers"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Video size={16} /> Projector
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Projects display onto a large surface – wall or screen.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/projector.webp"
                    alt="Video projector with a visible lens"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ─── Section 5: Storage Devices ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['storage'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Storage Devices
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-400 italic mb-4">
                Storage devices store data – temporarily while the computer is running, or permanently for later use.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HardDrive size={16} /> External HDD
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Large storage via USB. Stores data on spinning disks. Cheap but slower than SSDs.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/external-hdd.webp"
                    alt="Portable external hard disk drive with USB cable"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Microchip size={16} /> Solid‑State Drive (SSD)
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Uses flash memory, no moving parts. Much faster than HDD – boots faster, loads programs quicker.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/ssd.webp"
                    alt="Internal SATA solid-state drive with connectors"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MemoryStick size={16} /> USB Flash Drive
                  </h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1 mb-4">Small, portable storage. Perfect for carrying files between computers.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-2/usb-flash-drive.webp"
                    alt="USB flash drive with exposed USB connector"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-48 rounded-xl bg-white object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ─── Section 6: Installing and Configuring ──────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['install'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing and Configuring Peripheral Devices
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Plug‑and‑Play Devices</h4>
                  <img src={`${SERVICE_IMAGE_BASE}/install-plug-play.webp`} alt="Plug‑and‑Play Devices" width={384} height={384} loading="lazy" decoding="async" className="my-3 aspect-square w-full rounded-lg bg-white object-contain" />
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Most keyboards and mice are plug‑and‑play – just plug in and they work. The OS auto‑detects and installs basic drivers.</p>
                </div>

                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Monitors</h4>
                  <img src={`${SERVICE_IMAGE_BASE}/install-monitor.webp`} alt="Monitors" width={384} height={384} loading="lazy" decoding="async" className="my-3 aspect-square w-full rounded-lg bg-white object-contain" />
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Connect via HDMI or DisplayPort. May need graphics driver updates for best performance.</p>
                </div>

                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Outdated/Legacy Ports</h4>
                  <img src={`${SERVICE_IMAGE_BASE}/install-legacy-ports.webp`} alt="Outdated/Legacy Ports" width={384} height={384} loading="lazy" decoding="async" className="my-3 aspect-square w-full rounded-lg bg-white object-contain" />
                  <div className="mt-2 space-y-4">
                    <div className="py-1">
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">VGA</span>
                      <p className="pl-4 text-sm text-slate-600 dark:text-slate-400">Older analog monitor standard.</p>
                    </div>
                    <div className="py-1">
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">DVI</span>
                      <p className="pl-4 text-sm text-slate-600 dark:text-slate-400">Digital Visual Interface, superseded by HDMI.</p>
                    </div>
                    <div className="py-1">
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">MODEM</span>
                      <p className="pl-4 text-sm text-slate-600 dark:text-slate-400">Dial‑up internet – essentially obsolete.</p>
                    </div>
                    <div className="py-1">
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">COM (Serial)</span>
                      <p className="pl-4 text-sm text-slate-600 dark:text-slate-400">Rarely seen on modern computers.</p>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Printers</h4>
                  <img src={`${SERVICE_IMAGE_BASE}/install-printer.webp`} alt="Printers" width={384} height={384} loading="lazy" decoding="async" className="my-3 aspect-square w-full rounded-lg bg-white object-contain" />
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Connect via USB; require driver software to communicate with the printer model.</p>
                </div>

                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Storage Drives (Internal)</h4>
                  <img src={`${SERVICE_IMAGE_BASE}/install-storage.webp`} alt="Storage Drives (Internal)" width={384} height={384} loading="lazy" decoding="async" className="my-3 aspect-square w-full rounded-lg bg-white object-contain" />
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Older drives used IDE/EIDE/SCSI; today SATA is standard. When installing a primary drive, configure boot order in BIOS.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 7: Disassembly and Assembly ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['disassembly'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Disassembly and Assembly of Computers
              </h2>

              <div className="space-y-4">
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Desktop</h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Relatively easy to open. Components are larger and more accessible.</p>
                  <ServiceSteps steps={[
                    { title: "Power off and unplug", text: "Shut down the computer and disconnect its power cable.", image: "desktop-power" },
                    { title: "Remove the side panel", text: "Remove the case screws and set the side panel aside.", image: "desktop-panel" },
                    { title: "Identify components", text: "Locate the motherboard, RAM, storage drives and cooling fan.", image: "desktop-components" },
                    { title: "Disconnect and remove", text: "Disconnect the relevant cables, remove screws and keep them organized.", image: "desktop-remove" },
                    { title: "Reassemble", text: "Reinstall components and reconnect cables in reverse order, then replace the panel.", image: "desktop-reassemble" },
                  ]} />
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Laptop</h4>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Compact and portable – components are smaller, more fragile, tightly packed. Requires more patience.</p>
                  <ServiceSteps steps={[
                    { title: "Power off and disconnect", text: "Unplug the charger and remove the battery before servicing. For an internal battery, follow the model’s service manual.", image: "laptop-power" },
                    { title: "Remove the bottom panel", text: "Remove the bottom screws, organize them and gently lift the cover.", image: "laptop-panel" },
                    { title: "Locate accessible components", text: "Identify RAM, storage and the wireless card.", image: "laptop-components" },
                    { title: "Handle ribbon cables gently", text: "Release the connector latch before moving a ribbon cable.", image: "laptop-ribbon" },
                    { title: "Consult the service manual", text: "Use the model-specific manual for advanced tasks and reassembly.", image: "laptop-manual" },
                  ]} />
                </div>
              </div>
            </div>

            {/* ─── Section 8: Printer Disassembly ─────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['printer'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Disassembly of a Printer
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-400">The illustrations show an inkjet printer. Follow the service manual for the specific model.</p>
              <ServiceSteps steps={[
                { title: "Safety first", text: "Turn off and unplug. Remove ink or toner cartridges carefully; wear gloves for toner. Let a laser printer’s fuser cool before servicing.", image: "printer-safety" },
                { title: "Remove trays and covers", text: "Remove paper trays and access covers, then release casing screws and plastic clips according to the service manual.", image: "printer-casing" },
                { title: "Access internal components", text: "Identify rollers, separation pads and, for inkjet printers, the printhead. Follow the service manual for removal and cleaning.", image: "printer-components" },
                { title: "Reassemble and test", text: "Reassemble in reverse order, reconnect cables, reinstall cartridges and run a test print.", image: "printer-reassembly" },
              ]} />
            </div>

            {/* ─── Section 9: Performance Testing ─────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['performance'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Performance Testing of Assembled Components
              </h2>

              <div className="space-y-4">
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">CPU and General System</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>CPU Benchmarks:</strong> Use Cinebench R23 – compare scores. Lower than expected may indicate thermal throttling.</li>
                    <li><strong>System Benchmarks:</strong> PCMark 10 simulates everyday tasks (browsing, documents, video editing).</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Graphics Performance</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>3DMark:</strong> Run demanding 3D scenes to test the GPU.</li>
                    <li><strong>In‑game benchmarks:</strong> Many games report FPS; 60 FPS is smooth, below 30 is choppy.</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Storage Performance</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>CrystalDiskMark:</strong> Tests read/write speeds. Slow storage makes the whole system sluggish.</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Monitoring Tools</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Task Manager (Windows) / Activity Monitor (macOS):</strong> Show real‑time CPU, RAM, disk, and network usage.</li>
                  </ul>
                </div>
                <div className="py-2 md:col-span-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Printer Performance Testing</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Print a standard test page and measure time.</li>
                    <li>Inspect output – sharp text? Accurate colors? Streaks or smudges indicate issues like clogged print heads.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 10: Configuring Assembled Hardware ────────────── */}
            <div
              ref={(el) => { sectionRefs.current['config'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configuring Assembled Hardware
              </h2>

              <div className="space-y-4">
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Operating System Configuration</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Initial setup: language, user account, Wi‑Fi.</li>
                    <li><strong>Driver installation:</strong> Download specific drivers from manufacturer websites.</li>
                    <li><strong>Windows Settings:</strong> Display resolution, power plan, network.</li>
                    <li><strong>Software:</strong> Install browser, office, antivirus, etc.</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">BIOS Configuration</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Boot Order:</strong> Where to look for an OS when starting.</li>
                    <li><strong>Overclocking (Advanced):</strong> Run CPU/RAM faster than rated – can cause instability.</li>
                    <li><strong>Virtualization:</strong> Enable for virtual machines.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 11: Documenting Testing ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['document'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Documenting Testing – Why It Matters
              </h2>

              <div className="py-2">
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Documentation tells the next technician exactly what was tested, what results were found, and
                  what was done. Without it, the next technician starts from scratch.
                </p>
              </div>

              <div className="py-2 mt-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">What Good Documentation Looks Like</h4>
                <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                  <li><span className="font-bold">Title</span> – what was tested.</li>
                  <li><span className="font-bold">Date and tester name</span>.</li>
                  <li><span className="font-bold">Hardware/Software specifications</span> – model numbers, versions.</li>
                  <li><span className="font-bold">Testing methodology</span> – step‑by‑step description.</li>
                  <li><span className="font-bold">Expected results</span> – baseline for comparison.</li>
                  <li><span className="font-bold">Actual test results</span> – scores, temperatures, error messages.</li>
                  <li><span className="font-bold">Pass/Fail criteria</span> – what counts as passing.</li>
                  <li><span className="font-bold">Analysis and recommendations</span> – what do results mean? Next steps?</li>
                </ul>
              </div>

              <h4 className="text-lg font-bold text-stone-600 dark:text-stone-400 mt-6 mb-2">Real Examples</h4>
              <div className="space-y-4">
                <div className="py-2">
                  <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Testing a CPU</span>
                  <p className="pl-4 text-base text-slate-600 dark:text-slate-400">Record benchmark score and temperatures. Compare to expected. Pass if score exceeds baseline and temp stays under limit.</p>
                </div>
                <div className="py-2">
                  <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Testing a Keyboard</span>
                  <p className="pl-4 text-base text-slate-600 dark:text-slate-400">Connect, test every key, test special keys, assess comfort. Pass if all keys register and ergonomics are good.</p>
                </div>
                <div className="py-2">
                  <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Verifying a Desktop Assembly</span>
                  <p className="pl-4 text-base text-slate-600 dark:text-slate-400">Visual inspection, power on, listen for abnormal sounds, check fans, BIOS detection, boot into OS. Pass if all steps succeed.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 12: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Input, Output, Storage</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li><strong>Input:</strong> Keyboard, Mouse, Scanner, Mic, Webcam</li>
                    <li><strong>Output:</strong> Monitor, Printer, Speakers, Projector</li>
                    <li><strong>Storage:</strong> External HDD, SSD, USB Flash Drive</li>
                  </ul>
                </div>
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Installation & Config</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li><strong>Plug‑and‑play:</strong> Automatic driver install</li>
                    <li><strong>Monitor ports:</strong> HDMI, DisplayPort, VGA, DVI</li>
                    <li><strong>BIOS:</strong> Boot order, Virtualization, Overclocking</li>
                    <li><strong>Drivers:</strong> Required for printers, GPUs, specialised hardware</li>
                  </ul>
                </div>
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Testing & Documentation</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li><strong>CPU/GPU:</strong> Cinebench, 3DMark</li>
                    <li><strong>Storage:</strong> CrystalDiskMark</li>
                    <li><strong>Document:</strong> Date, Specs, Methodology, Results</li>
                    <li><strong>Goal:</strong> Prove hardware works and create a record</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-base font-bold text-slate-800 dark:text-slate-300">Exam Tip</p>
                    <p className="text-base text-slate-700 dark:text-slate-300">
                      "Explain the difference between input, output, and storage devices" or "How would you test
                      a newly assembled PC?" are common questions. Use real‑world examples and explain the
                      reasoning behind each testing step.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-slate-800 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Input it. Output it. Store it. Test it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
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
        <div className="mt-8 p-6 bg-slate-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-base">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Peripheral devices</strong> are classified into Input, Output,
                and Storage – each serves a distinct purpose in interacting with a computer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Installation</strong> involves plug‑and‑play, driver updates,
                and BIOS configuration for legacy and modern devices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disassembly and assembly</strong> requires systematic steps
                and care – desktops are easier than laptops, printers need special precautions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Performance testing</strong> uses benchmarks and monitoring
                tools to validate that hardware meets expected standards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation</strong> is critical – it records what was done
                and proves the hardware works, helping future technicians.
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
            Sidemann Academic Registry • Hardware Components 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;