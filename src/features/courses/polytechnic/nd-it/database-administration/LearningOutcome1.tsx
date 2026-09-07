import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
  import {
    Code,
    GraduationCap,
    Rocket,
    Brain,
    ChevronRight,
    Terminal,
    Database,
    Layout,
    CheckCircle,
    Clock,
    BookOpen,
    ChevronUp,
    X,
    Sparkles,
    BookMarked,
    Target,
    Users,
    Scale,
    AlertTriangle,
    Globe,
    Swords,
    HeartHandshake,
    Flag,
    RefreshCw,
    Search,
    Lightbulb,
    Play,
    Pause,
    Maximize2,
    ArrowLeft,
  } from 'lucide-react';

  import { SQLConsole } from './XAMPPSQLCode';
  import { AdSense } from '../../../../analytics/AdSense';
  import { useLessonState } from '../../../lessonProgress';

  // ──────────────────────────────────────────────────────────────────────────────
  // SECTION TABS FOR NAVIGATION
  // ──────────────────────────────────────────────────────────────────────────────
  const SECTION_TABS = [
    { id: 'intro', label: 'Intro' },
    { id: 'what-is-db-design', label: 'What Is Design?' },
    { id: 'end-users', label: 'End Users' },
    { id: 'user-views', label: 'User Views' },
    { id: 'outputs', label: 'Outputs' },
    { id: 'crud', label: 'CRUD' },
    { id: 'entities', label: 'Entities' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'keys', label: 'Keys' },
    { id: 'erds', label: 'ERDs' },
    { id: 'redundancy', label: 'Redundancy' },
    { id: 'dbms', label: 'DBMS' },
    { id: 'normalization', label: 'Normalization' },
    { id: 'strong-weak', label: 'Strong vs Weak' },
    { id: 'file-org', label: 'File Organization' },
    { id: 'practice', label: 'Practice' },
    { id: 'cheat-sheet', label: 'Cheat Sheet' },
  ];

  // ──────────────────────────────────────────────────────────────────────────────
  // MAIN COMPONENT
  // ──────────────────────────────────────────────────────────────────────────────
  export const LearningOutcome1: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
    const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
      null
    );

    // ERD signal-flow animation state
    const [isErd1Playing, setIsErd1Playing] = useState(false);
    const [erd1PlayKey, setErd1PlayKey] = useState(0);
    const [isErd2Playing, setIsErd2Playing] = useState(false);
    const [erd2PlayKey, setErd2PlayKey] = useState(0);

    // ERD fullscreen (mobile) state
    const [isErd1Fullscreen, setIsErd1Fullscreen] = useState(false);
    const [isErd2Fullscreen, setIsErd2Fullscreen] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    // Track device orientation so the fullscreen ERD view can fake landscape
    // on phones that stay physically portrait (no orientation-lock support).
    useEffect(() => {
      const mq = window.matchMedia('(orientation: portrait)');
      const updateOrientation = () => setIsPortrait(mq.matches);
      updateOrientation();
      mq.addEventListener('change', updateOrientation);
      return () => mq.removeEventListener('change', updateOrientation);
    }, []);

    // Lock body scroll while an ERD is shown fullscreen
    useEffect(() => {
      if (isErd1Fullscreen || isErd2Fullscreen) {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const closeFullscreen = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            setIsErd1Fullscreen(false);
            setIsErd2Fullscreen(false);
          }
        };

        window.addEventListener('keydown', closeFullscreen);
        return () => {
          document.body.style.overflow = prevOverflow;
          window.removeEventListener('keydown', closeFullscreen);
        };
      }
    }, [isErd1Fullscreen, isErd2Fullscreen]);

    // Wrapper style that fakes a landscape view on a physically-portrait phone
    const landscapeFullscreenStyle: React.CSSProperties = isPortrait
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vh',
          height: '100vw',
          transform: 'rotate(90deg) translateY(-100%)',
          transformOrigin: 'top left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };

    const renderFullscreenErd = (
      diagram: React.ReactNode,
      isPlaying: boolean,
      toggleAnimation: () => void,
      close: () => void,
      label: string
    ) => createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-white overscroll-none"
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div style={landscapeFullscreenStyle}>
          <div className="relative flex h-full w-full items-center justify-center">
            <button
              type="button"
              onClick={close}
              className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-slate-800"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              onClick={toggleAnimation}
              aria-label={isPlaying ? 'Stop signal animation' : 'Play signal animation'}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-700"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <div className="flex h-[94%] w-[94%] items-center justify-center p-4">
              {diagram}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

    const toggleErd1 = () => {
      if (isErd1Playing) {
        setIsErd1Playing(false);
      } else {
        setErd1PlayKey((k) => k + 1);
        setIsErd1Playing(true);
      }
    };

    const toggleErd2 = () => {
      if (isErd2Playing) {
        setIsErd2Playing(false);
      } else {
        setErd2PlayKey((k) => k + 1);
        setIsErd2Playing(true);
      }
    };

    const renderErd1Svg = () => (
      <svg viewBox="0 0 700 400" className="w-full h-auto max-w-2xl" xmlns="http://www.w3.org/2000/svg">
        <line x1="90" y1="78" x2="108" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="205" y1="78" x2="172" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="500" y1="215" x2="480" y2="292" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="590" y1="215" x2="610" y2="292" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="210" y1="187" x2="295" y2="187" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="405" y1="187" x2="470" y2="187" stroke="#94a3b8" strokeWidth="1.5" />

        <rect x="60" y="160" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
        <text x="135" y="193" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">STUDENT</text>

        <rect x="470" y="160" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
        <text x="545" y="193" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">FEE</text>

        <polygon points="350,157 405,187 350,217 295,187" fill="#faf5ff" stroke="#9333ea" strokeWidth="2" />
        <text x="350" y="191" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">PAYS</text>
        <text x="245" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">1</text>
        <text x="440" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">M</text>

        <ellipse cx="90" cy="50" rx="55" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <text x="90" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">StudentID (PK)</text>
        <ellipse cx="215" cy="50" rx="48" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
        <text x="215" y="54" textAnchor="middle" fontSize="10" fill="#1e293b">Name</text>

        <ellipse cx="480" cy="320" rx="55" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <text x="480" y="324" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">FeeID (PK)</text>
        <ellipse cx="612" cy="320" rx="55" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
        <text x="612" y="324" textAnchor="middle" fontSize="10" fill="#1e293b">AmountDue</text>

        {isErd1Playing && (
          <>
            <path id="erd1-pays-path" d="M 210,187 L 470,187" fill="none" stroke="none" />
            <g key={`erd1-signal-${erd1PlayKey}`}>
              <circle fill="#f59e0b" opacity="0.2">
                <animateMotion dur="2.2s" repeatCount="indefinite">
                  <mpath href="#erd1-pays-path" xlinkHref="#erd1-pays-path" />
                </animateMotion>
                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle fill="#f59e0b">
                <animateMotion dur="2.2s" repeatCount="indefinite">
                  <mpath href="#erd1-pays-path" xlinkHref="#erd1-pays-path" />
                </animateMotion>
                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
              </circle>

              <circle fill="#d97706" opacity="0.2">
                <animate attributeName="cx" values="90;108" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="78;160" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle fill="#d97706">
                <animate attributeName="cx" values="90;108" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="78;160" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>

              <circle fill="#16a34a" opacity="0.2">
                <animate attributeName="cx" values="205;172" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="78;160" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle fill="#16a34a">
                <animate attributeName="cx" values="205;172" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="78;160" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>

              <circle fill="#d97706" opacity="0.2">
                <animate attributeName="cx" values="500;480" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="215;292" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle fill="#d97706">
                <animate attributeName="cx" values="500;480" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="215;292" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>

              <circle fill="#16a34a" opacity="0.2">
                <animate attributeName="cx" values="590;610" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="215;292" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle fill="#16a34a">
                <animate attributeName="cx" values="590;610" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="215;292" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>
          </>
        )}
      </svg>
    );

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
          text: 'Database design is like building a house – you need a blueprint (ERD) before you start construction (writing SQL).',
        },
        {
          title: 'Pro Tip',
          text: 'Normalization is your friend! Aim for at least 3NF (Third Normal Form) to avoid data redundancy and anomalies.',
        },
        {
          title: 'Memory Trick',
          text: 'Remember CRUD as "Create, Read, Update, Delete" – the four fundamental database operations.',
        },
        {
          title: 'Common Mistake',
          text: 'Don\'t store multiple values in one column (like "Maths, English, Science") – that violates 1NF. Use separate rows instead.',
        },
      ];
      setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    }, []);

    const refreshRandomTip = () => {
      const tips = [
        {
          title: 'Did you know?',
          text: 'Database design is like building a house – you need a blueprint (ERD) before you start construction (writing SQL).',
        },
        {
          title: 'Pro Tip',
          text: 'Normalization is your friend! Aim for at least 3NF (Third Normal Form) to avoid data redundancy and anomalies.',
        },
        {
          title: 'Memory Trick',
          text: 'Remember CRUD as "Create, Read, Update, Delete" – the four fundamental database operations.',
        },
        {
          title: 'Common Mistake',
          text: 'Don\'t store multiple values in one column (like "Maths, English, Science") – that violates 1NF. Use separate rows instead.',
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

    const headerTextClasses = isDarkMode ? 'text-white' : 'text-gray-900';

    return (
      <div className={containerClasses}>
        {/* ─── Header ───────────────────────────────────────────────────────── */}
        <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
          <div className="mx-auto px-[5px] sm:px-6 md:px-8">
            <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
              <Database size={14} className="inline mr-1" /> DATABASE ADMINISTRATION
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
              Learning Outcome 1{' '}
              <span className="text-emerald-300 font-bold italic">
                Database Design
              </span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
              Master the fundamentals of database design: entities, attributes,
              keys, normalization, ERDs, CRUD operations, and file organization.
              Build a solid foundation for database administration.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
              <span className="bg-white/10 px-3 py-1 rounded-full">
                📚 {SECTION_TABS.length} sections
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full">
                <Database size={14} className="inline mr-1" /> Design
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full">
                <Code size={14} className="inline mr-1" /> SQL
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
                  placeholder="Search for a concept, key, or term..."
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
            {/* List of sections */}
            <div ref={listContainerRef} className="space-y-12">
              {/* Introduction */}
              <div
                ref={(el) => {
                  sectionRefs.current['intro'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                  Introduction to Database Design
                </h2>

                <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      Welcome, student! This guide will teach you everything in
                      Learning Outcome 1: Designing a Database — from scratch,
                      in plain English. No complicated jargon, no confusion.
                      Think of it like a conversation between you and a
                      knowledgeable friend who wants you to pass your exams.
                      Each concept is explained with everyday examples.
                    </p>
  </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                    <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                  </div>
                  <p className="text-amber-900 dark:text-amber-100 italic">
                    Think of a database like a very smart, carefully arranged notebook
                    that stores all information so you can find it quickly, update it
                    easily, and never lose it. Database design is the plan you make
                    BEFORE you build that system.
                  </p>
                </div>
              </div>

              {/* What is Database Design */}
              <div
                ref={(el) => {
                  sectionRefs.current['what-is-db-design'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  What Is Database Design?
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A <span className="font-bold">database</span> is an organized system
                  that stores information so you can find it quickly, update it easily,
                  and never lose it. <span className="font-bold">Database design</span>
                  is the plan you make BEFORE you build that system.
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                  Just like you don't just start building a house without a blueprint,
                  you don't just start entering data without first designing the structure.
                  A well-designed database saves you from headaches later — no duplicate
                  records, no missing information, no messy data.
                </p>

                <div className="mt-4">
                  <SQLConsole
                    code={`-- Creating our tuck shop database\nCREATE DATABASE ZimTuckShop;\n\nUSE ZimTuckShop;\n\n-- Designing the first table\nCREATE TABLE Products (\n  product_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  category VARCHAR(50),\n  price DECIMAL(10, 2),\n  stock_quantity INT DEFAULT 0\n);`}
                    isDarkMode={isDarkMode}
                    databaseName="ZimTuckShop"
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Think of the Zimbabwe Electoral Commission (ZEC) voter roll. It stores every registered voter's name, ID number, constituency, and polling station. That is a database. The design determines how quickly officers can find your name, whether your details can be duplicated, and how reports are generated after elections.</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">In the exam, 'database design' questions often ask you to explain WHY design matters. Always mention: reducing redundancy, improving data integrity, meeting user needs, and making queries efficient.</p>
                </div>
              </div>

              {/* End Users */}
              <div
                ref={(el) => {
                  sectionRefs.current['end-users'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Identifying End Users
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  The very first step in designing any database is asking: 'Who is going
                  to USE this?' These people are called <span className="font-bold">end users</span>.
                  They are divided into two groups:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Internal Users</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">People inside the organization – managers, cashiers, accountants, HR staff.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">External Users</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">People outside the organization – customers, suppliers, government inspectors.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">At a Zimbabwean hospital like Parirenyatwa, internal users include doctors, nurses, pharmacists, and hospital administrators. External users include patients checking their appointment status online. Each needs a completely different view of the hospital's database.</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">If asked to identify end users in a scenario, always distinguish between <span className="font-bold">internal and external</span> users and give examples of the specific information each group needs.</p>
                </div>
              </div>

              {/* End User Views */}
              <div
                ref={(el) => {
                  sectionRefs.current['user-views'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  End User Views
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Once you know who the users are, the next step is defining exactly
                  <span className="font-bold"> what</span> each user group should see
                  and <span className="font-bold">how</span> they will interact with
                  the data. This is called defining <span className="font-bold">end user views</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Salesperson View</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Shows customer names, numbers, and balances – not engineering diagrams.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Manager View</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Shows dashboards with graphs – new customers, revenue, and performance metrics.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">At a school like Hartzell High, a teacher's view shows student marks and attendance. The headmaster's view shows school-wide performance statistics. The accounts department's view shows school fees payments. Same database, different views.</p>
                </div>
              </div>

              {/* Specifying Outputs */}
              <div
                ref={(el) => {
                  sectionRefs.current['outputs'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Specifying Outputs
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  After knowing who uses the database and what they see, we now need
                  to define the <span className="font-bold">outputs</span> — meaning
                  what information comes out of the system, in what format, and for
                  which purpose.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Sales Report</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Monthly sales report showing products sold, broken into regions, with charts comparing years.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Customer View</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Simple screen showing one customer's name, contact number, and last purchase date.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Think of your ZIMSEC results slip. That output is specifically designed for you as a student – your name, subject, and grade. The chief examiner's output would be a national statistics report showing pass rates per province.</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">When specifying outputs in an exam question, always state: (1) what information is shown, (2) who it is for, (3) what format it takes (report/screen/chart), and (4) how often it is produced.</p>
                </div>
              </div>

              {/* CRUD */}
              <div
                ref={(el) => {
                  sectionRefs.current['crud'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Transaction Processing Requirements (CRUD)
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">Transaction processing requirements</span>
                  simply mean: what actions will users perform on the data? In database
                  language, there are four basic actions known as <span className="font-bold">CRUD</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Create</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Adding new records, like registering a new customer at a bank.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Read</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Looking up information, like searching for a product price.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Update</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Changing existing information, like editing a customer's phone number.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Delete</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Removing records, like removing a product that is no longer being sold.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">CRUD questions are very common! If asked 'What transaction processing requirements does a system need?' — list all four CRUD operations with a relevant example from the scenario given. Never just write 'CRUD' without explaining each one.</p>
                </div>
              </div>

              {/* Entities */}
              <div
                ref={(el) => {
                  sectionRefs.current['entities'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Entities – The Building Blocks
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  An <span className="font-bold">entity</span> is simply a thing or
                  object about which you want to store information. Think of entities
                  as the main 'nouns' in your system.
                </p>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-4">
                  <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Entity</th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Real-Life Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr><td className="p-3 font-bold">CUSTOMER</td><td className="p-3">A person who shops at TM Pick n Pay</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">PRODUCT</td><td className="p-3">A 2kg bag of Roller Meal</td></tr>
                      <tr><td className="p-3 font-bold">ORDER</td><td className="p-3">A purchase transaction made on a specific day</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">EMPLOYEE</td><td className="p-3">A staff member working at Econet</td></tr>
                      <tr><td className="p-3 font-bold">BRANCH</td><td className="p-3">The Bulawayo branch of CBZ Bank</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">In the exam, if asked to 'identify entities from a scenario', look for the important NOUNS — things, people, places, or events that need to be tracked. Each distinct noun is likely an entity.</p>
                </div>
              </div>

              {/* Attributes */}
              <div
                ref={(el) => {
                  sectionRefs.current['attributes'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Attributes – Describing Your Entities
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  If entities are the 'nouns', then <span className="font-bold">attributes</span>
                  are the 'adjectives' — the specific details and properties that
                  describe each entity.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Entity: STUDENT</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>student_id</li>
                      <li>first_name</li>
                      <li>last_name</li>
                      <li>date_of_birth</li>
                      <li>gender</li>
                      <li>form_level</li>
                      <li>home_address</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Entity: PRODUCT</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>product_code</li>
                      <li>product_name</li>
                      <li>unit_price</li>
                      <li>quantity_in_stock</li>
                      <li>category</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Two Rules for Attributes</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li><span className="font-bold">Atomicity</span> – an attribute should not be divisible into smaller meaningful parts. Split "full_name" into "first_name" and "last_name".</li>
                    <li><span className="font-bold">Relevance</span> – every attribute must actually belong to that entity and be useful.</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">A common exam mistake is writing 'address' as a single attribute. Always split it into atomic parts: street, city, province, country. Same with 'name' — split into first_name and last_name.</p>
                </div>
              </div>

              {/* Keys */}
              <div
                ref={(el) => {
                  sectionRefs.current['keys'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Keys – The Unique Identifiers
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A <span className="font-bold">key</span> is an attribute (or a combination
                  of attributes) that uniquely identifies each record in a table.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Candidate Key</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Any attribute that CAN uniquely identify a record. E.g., both student_id AND national_id_number can uniquely identify a student.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Primary Key</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The ONE chosen candidate key. Cannot be NULL. Must be unique. E.g., student_id is chosen as the main identifier.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Alternate Key</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">A candidate key NOT chosen as primary. Still unique. E.g., national_id_number is still unique, but not the main key.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Know the difference between these three key types cold! Examiners love asking: 'What is the difference between a primary key and a candidate key?' Answer: All primary keys are candidate keys, but not all candidate keys become primary keys.</p>
                </div>
              </div>

              {/* ERDs */}
              <div
                ref={(el) => {
                  sectionRefs.current['erds'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Entity-Relationship Diagrams (ERDs)
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  An <span className="font-bold">ERD</span> is a visual diagram that
                  shows all the entities in your database, their attributes, and most
                  importantly, the <span className="font-bold">relationships</span>
                  between them.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Rectangle</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Represents an entity (the box with the entity name inside).</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Oval/Ellipse</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Represents an attribute (connected to its entity with a line).</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Diamond</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Represents a relationship between entities (the verbs — like 'ENROLLED IN').</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-4">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">Reading Cardinality — What "1 : M" Means</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    Cardinality is the number written next to a relationship line. It tells you HOW MANY records on one
                    side can be linked to HOW MANY records on the other side.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">1 : 1 (One-to-One)</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">One record on each side links to exactly one on the other. E.g. one LECTURER HAS one STAFF OFFICE.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">1 : M (One-to-Many)</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">One record on the "1" side links to MANY on the "M" side, but each "M" record links back to only one "1" record. E.g. one STUDENT PAYS many FEE records — but every FEE record belongs to only that one STUDENT.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">M : M (Many-to-Many)</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Many records on BOTH sides can link to many on the other. E.g. many STUDENTs ENROLL IN many COURSEs. When building real tables, M:M is always split into a separate linking table.</p>
                    </div>
                  </div>
                </div>

                {/* Worked ERD Examples */}
                <div className="mt-6 space-y-8">
                  <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-wide">
                          Worked Example 1: Simple ERD — Student Paying Fees
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          A minimal two-entity ERD. One STUDENT can generate many FEE records — a 1&nbsp;:&nbsp;M relationship.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-white dark:bg-[#121212]">
                    {isErd1Fullscreen && renderFullscreenErd(
                      renderErd1Svg(),
                      isErd1Playing,
                      toggleErd1,
                      () => setIsErd1Fullscreen(false),
                      'Student paying fees ERD fullscreen view'
                    )}
                    <div className="relative bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsErd2Fullscreen(false);
                          setIsErd1Fullscreen(true);
                        }}
                        aria-label="View diagram fullscreen"
                        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-800 text-white flex items-center justify-center shadow-md transition-colors"
                      >
                        <Maximize2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={toggleErd1}
                        aria-label={isErd1Playing ? 'Stop signal animation' : 'Play signal animation'}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-colors"
                      >
                        {isErd1Playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      {!isErd1Fullscreen && renderErd1Svg()}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">
                      🟡 Amber oval = Primary Key attribute · 🟢 Green oval = ordinary attribute · Purple diamond = relationship, labelled with a verb. Tap ▶ on the diagram to watch the signal travel STUDENT → PAYS → FEE. On mobile, tap the expand icon to view it larger in landscape.
                    </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-wide">
                          Worked Example 2: Harare Polytechnic Academic System
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          A four-entity ERD — LECTURER, COURSE, STUDENT and FEE — with three relationships and mixed cardinalities.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-white dark:bg-[#121212]">
                    {(() => {
                      const erd2Diagram = (
                      <svg viewBox="0 0 900 680" className="w-full h-auto min-w-[700px] max-h-full" xmlns="http://www.w3.org/2000/svg">
                        {/* attribute connector lines */}
                        <line x1="75" y1="78" x2="80" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="165" y1="78" x2="145" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="425" y1="78" x2="430" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="540" y1="78" x2="505" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="230" y1="485" x2="222" y2="572" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="300" y1="485" x2="335" y2="572" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="590" y1="485" x2="583" y2="572" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="670" y1="485" x2="695" y2="572" stroke="#94a3b8" strokeWidth="1.5" />

                        {/* relationship connector lines */}
                        <line x1="190" y1="167" x2="220" y2="167" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="320" y1="167" x2="400" y2="167" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="475" y1="195" x2="475" y2="265" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="475" y1="335" x2="315" y2="430" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="350" y1="457" x2="410" y2="457" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="490" y1="457" x2="560" y2="457" stroke="#94a3b8" strokeWidth="1.5" />

                        {/* LECTURER entity */}
                        <rect x="40" y="140" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                        <text x="115" y="173" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">LECTURER</text>

                        {/* COURSE entity */}
                        <rect x="400" y="140" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                        <text x="475" y="173" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">COURSE</text>

                        {/* STUDENT entity */}
                        <rect x="200" y="430" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                        <text x="275" y="463" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">STUDENT</text>

                        {/* FEE entity */}
                        <rect x="560" y="430" width="150" height="55" rx="6" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                        <text x="635" y="463" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">FEE</text>

                        {/* TEACHES diamond */}
                        <polygon points="270,137 320,167 270,197 220,167" fill="#faf5ff" stroke="#9333ea" strokeWidth="2" />
                        <text x="270" y="171" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">TEACHES</text>
                        <text x="205" y="158" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">1</text>
                        <text x="335" y="158" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">M</text>

                        {/* ENROLLS IN diamond */}
                        <polygon points="475,265 515,300 475,335 435,300" fill="#faf5ff" stroke="#9333ea" strokeWidth="2" />
                        <text x="475" y="297" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">ENROLLS</text>
                        <text x="475" y="308" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">IN</text>
                        <text x="460" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">M</text>
                        <text x="400" y="375" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">M</text>

                        {/* PAYS diamond */}
                        <polygon points="450,427 490,457 450,487 410,457" fill="#faf5ff" stroke="#9333ea" strokeWidth="2" />
                        <text x="450" y="461" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">PAYS</text>
                        <text x="365" y="448" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">1</text>
                        <text x="505" y="448" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9333ea">M</text>

                        {/* LECTURER attributes */}
                        <ellipse cx="60" cy="50" rx="55" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                        <text x="60" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">StaffID (PK)</text>
                        <ellipse cx="170" cy="50" rx="52" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                        <text x="170" y="54" textAnchor="middle" fontSize="10" fill="#1e293b">FullName</text>

                        {/* COURSE attributes */}
                        <ellipse cx="420" cy="50" rx="60" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                        <text x="420" y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">CourseCode (PK)</text>
                        <ellipse cx="545" cy="50" rx="58" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                        <text x="545" y="54" textAnchor="middle" fontSize="10" fill="#1e293b">CourseName</text>

                        {/* STUDENT attributes */}
                        <ellipse cx="220" cy="600" rx="58" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                        <text x="220" y="604" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">StudentID (PK)</text>
                        <ellipse cx="345" cy="600" rx="52" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                        <text x="345" y="604" textAnchor="middle" fontSize="10" fill="#1e293b">Programme</text>

                        {/* FEE attributes */}
                        <ellipse cx="580" cy="600" rx="52" ry="28" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                        <text x="580" y="604" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">FeeID (PK)</text>
                        <ellipse cx="700" cy="600" rx="58" ry="28" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                        <text x="700" y="604" textAnchor="middle" fontSize="10" fill="#1e293b">AmountPaid</text>

                        {/* Signal-flow animation: follows each relationship's direction */}
                        {isErd2Playing && (
                          <>
                            {/* LECTURER → TEACHES → COURSE */}
                            <path id="erd2-teaches-path" d="M 190,167 L 400,167" fill="none" stroke="none" />
                            {/* STUDENT → ENROLLS IN → COURSE */}
                            <path id="erd2-enrolls-path" d="M 315,430 L 475,300 L 475,195" fill="none" stroke="none" />
                            {/* STUDENT → PAYS → FEE */}
                            <path id="erd2-pays-path" d="M 350,457 L 560,457" fill="none" stroke="none" />

                            <g key={`erd2-signal-${erd2PlayKey}`}>
                              {/* TEACHES — amber */}
                              <circle fill="#f59e0b" opacity="0.2">
                                <animateMotion dur="2.2s" repeatCount="indefinite">
                                  <mpath href="#erd2-teaches-path" xlinkHref="#erd2-teaches-path" />
                                </animateMotion>
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#f59e0b">
                                <animateMotion dur="2.2s" repeatCount="indefinite">
                                  <mpath href="#erd2-teaches-path" xlinkHref="#erd2-teaches-path" />
                                </animateMotion>
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>

                              {/* ENROLLS IN — pink */}
                              <circle fill="#ec4899" opacity="0.2">
                                <animateMotion dur="2.6s" repeatCount="indefinite">
                                  <mpath href="#erd2-enrolls-path" xlinkHref="#erd2-enrolls-path" />
                                </animateMotion>
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#ec4899">
                                <animateMotion dur="2.6s" repeatCount="indefinite">
                                  <mpath href="#erd2-enrolls-path" xlinkHref="#erd2-enrolls-path" />
                                </animateMotion>
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s" repeatCount="indefinite" />
                              </circle>

                              {/* PAYS — green */}
                              <circle fill="#22c55e" opacity="0.2">
                                <animateMotion dur="2.2s" repeatCount="indefinite">
                                  <mpath href="#erd2-pays-path" xlinkHref="#erd2-pays-path" />
                                </animateMotion>
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#22c55e">
                                <animateMotion dur="2.2s" repeatCount="indefinite">
                                  <mpath href="#erd2-pays-path" xlinkHref="#erd2-pays-path" />
                                </animateMotion>
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: StaffID (PK) → LECTURER, amber */}
                              <circle fill="#d97706" opacity="0.2">
                                <animate attributeName="cx" values="75;80" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#d97706">
                                <animate attributeName="cx" values="75;80" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: FullName → LECTURER, green */}
                              <circle fill="#16a34a" opacity="0.2">
                                <animate attributeName="cx" values="165;145" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#16a34a">
                                <animate attributeName="cx" values="165;145" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: CourseCode (PK) → COURSE, amber */}
                              <circle fill="#d97706" opacity="0.2">
                                <animate attributeName="cx" values="425;430" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#d97706">
                                <animate attributeName="cx" values="425;430" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: CourseName → COURSE, green */}
                              <circle fill="#16a34a" opacity="0.2">
                                <animate attributeName="cx" values="540;505" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#16a34a">
                                <animate attributeName="cx" values="540;505" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="78;140" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: StudentID (PK) → STUDENT, amber */}
                              <circle fill="#d97706" opacity="0.2">
                                <animate attributeName="cx" values="230;222" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#d97706">
                                <animate attributeName="cx" values="230;222" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: Programme → STUDENT, green */}
                              <circle fill="#16a34a" opacity="0.2">
                                <animate attributeName="cx" values="300;335" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#16a34a">
                                <animate attributeName="cx" values="300;335" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: FeeID (PK) → FEE, amber */}
                              <circle fill="#d97706" opacity="0.2">
                                <animate attributeName="cx" values="590;583" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#d97706">
                                <animate attributeName="cx" values="590;583" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>

                              {/* attribute line: AmountPaid → FEE, green */}
                              <circle fill="#16a34a" opacity="0.2">
                                <animate attributeName="cx" values="670;695" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="2;7;2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.2;0.55;0.2" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                              <circle fill="#16a34a">
                                <animate attributeName="cx" values="670;695" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="cy" values="485;572" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="r" values="0.8;3;0.8" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="1.6s" repeatCount="indefinite" />
                              </circle>
                            </g>
                          </>
                        )}
                      </svg>
                      );

                      return (
                        <>
                          {isErd2Fullscreen && renderFullscreenErd(
                            React.cloneElement(erd2Diagram, { className: 'h-full w-full' }),
                            isErd2Playing,
                            toggleErd2,
                            () => setIsErd2Fullscreen(false),
                            'Harare Polytechnic academic system ERD fullscreen view'
                          )}
                          <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
                            <button
                              type="button"
                              onClick={() => {
                                setIsErd1Fullscreen(false);
                                setIsErd2Fullscreen(true);
                              }}
                              aria-label="View diagram fullscreen"
                              className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white shadow-md transition-colors hover:bg-slate-800"
                            >
                              <Maximize2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={toggleErd2}
                              aria-label={isErd2Playing ? 'Stop signal animation' : 'Play signal animation'}
                              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-700"
                            >
                              {isErd2Playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                            </button>
                            {!isErd2Fullscreen && erd2Diagram}
                          </div>
                        </>
                      );
                    })()}
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">
                      Read the cardinality closest to each entity: a LECTURER (1) TEACHES many COURSEs (M); STUDENTs (M) ENROLL IN many COURSEs (M); a STUDENT (1) PAYS many FEE records (M). Tap ▶ to send a signal along each relationship: amber = TEACHES, pink = ENROLLS IN, green = PAYS.
                    </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Imagine drawing a simple ERD for Econet Zimbabwe's customer system: A SUBSCRIBER entity is connected to a SIM_CARD entity through a relationship called 'OWNS'.</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">In ERD questions, always use the CORRECT SHAPES: Rectangle = Entity, Oval/Ellipse = Attribute, Diamond = Relationship. Mixing these up loses marks immediately.</p>
                </div>
              </div>

              {/* Redundancy */}
              <div
                ref={(el) => {
                  sectionRefs.current['redundancy'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Minimizing Redundancy &amp; Validating the Model
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">Redundancy</span> means storing the same
                  data in more than one place. This causes <span className="font-bold">update anomalies</span>,
                  <span className="font-bold">insert anomalies</span>, and <span className="font-bold">delete anomalies</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Update Anomaly</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">You update data in one table but forget another.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Insert Anomaly</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">You cannot add data without adding unnecessary related data first.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Delete Anomaly</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Deleting one record accidentally removes other important data.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Remember the three types of anomalies caused by redundancy: UPDATE anomaly, INSERT anomaly, and DELETE anomaly. If asked 'Why is redundancy a problem?' — name all three with a brief example.</p>
                </div>
              </div>

              {/* DBMS */}
              <div
                ref={(el) => {
                  sectionRefs.current['dbms'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Evaluating &amp; Choosing a DBMS
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A <span className="font-bold">DBMS</span> (Database Management System)
                  is the software that will actually run your database.
                </p>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-4">
                  <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Factor</th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What to Consider</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr><td className="p-3 font-bold">Pricing</td><td className="p-3">Open-source (MySQL, PostgreSQL = free) vs Commercial (Oracle, SQL Server = costly)</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Functionality</td><td className="p-3">Does it support the features you need? (stored procedures, encryption, reporting)</td></tr>
                      <tr><td className="p-3 font-bold">Scalability</td><td className="p-3">Can it grow from 1,000 to 10,000,000 users without breaking?</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Migration</td><td className="p-3">If you have old data, how easily can it be moved to the new system?</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">When comparing DBMS options in an exam, never just list names. Always explain the CRITERIA you are using to evaluate them (pricing, functionality, scalability, migration).</p>
                </div>
              </div>

              {/* Normalization */}
              <div
                ref={(el) => {
                  sectionRefs.current['normalization'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Normalization – Organizing Tables Properly
                </h2>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">Normalization</span> is the process of
                  organizing your database tables so that data is stored efficiently
                  — without unnecessary repetition and without the risk of errors.
                </p>

                <div className="space-y-6 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">1NF (First Normal Form)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Atomic values + Primary key + No duplicate rows. No repeating groups.</p>
                    <SQLConsole
                      code={`CREATE TABLE StudentSubjects (\n  student_id INT,\n  student_name VARCHAR(50),\n  subject_name VARCHAR(50),\n  PRIMARY KEY (student_id, subject_name)\n);`}
                      isDarkMode={isDarkMode}
                      tableName="StudentSubjects"
                    />
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">2NF (Second Normal Form)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">1NF + No partial dependencies (every non-key attribute depends on the WHOLE key).</p>
                    <SQLConsole
                      code={`CREATE TABLE Students (\n  student_id INT PRIMARY KEY,\n  student_name VARCHAR(50)\n);\n\nCREATE TABLE Results (\n  student_id INT,\n  subject_code VARCHAR(10),\n  marks INT,\n  PRIMARY KEY (student_id, subject_code)\n);`}
                      isDarkMode={isDarkMode}
                      tableName="Normalized_2NF"
                    />
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">3NF (Third Normal Form)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">2NF + No transitive dependencies (non-key attributes depend ONLY on the key).</p>
                    <SQLConsole
                      code={`CREATE TABLE Branches (\n  branch_id INT PRIMARY KEY,\n  branch_name VARCHAR(50),\n  branch_address VARCHAR(100)\n);\n\nCREATE TABLE Employees (\n  emp_id INT PRIMARY KEY,\n  name VARCHAR(50),\n  branch_id INT,\n  FOREIGN KEY (branch_id) REFERENCES Branches(branch_id)\n);`}
                      isDarkMode={isDarkMode}
                      tableName="Normalized_3NF"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Imagine a table with student results: student_id, subject_code, student_name, subject_name, marks. The primary key is (student_id + subject_code). student_name depends only on student_id — that's a partial dependency violating 2NF. Fix it by creating separate STUDENT and SUBJECT tables.</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Normalization is one of the HIGHEST VALUE exam topics. Practice identifying which normal form a table violates and HOW to fix it. Always show the BEFORE table (with the problem) and the AFTER tables (after splitting).</p>
                </div>
              </div>

              {/* Strong vs Weak Entities */}
              <div
                ref={(el) => {
                  sectionRefs.current['strong-weak'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Strong vs Weak Entities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Strong Entity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Has its own primary key. Exists independently. Example: CUSTOMER exists with or without orders. EMPLOYEE exists without a specific project.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Weak Entity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">No full primary key of its own. Depends on a strong entity. Example: ORDER_ITEM depends on ORDER. DEPENDENT depends on EMPLOYEE.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">When drawing ERDs in an exam, use DOUBLE RECTANGLES for weak entities and DOUBLE DIAMONDS for their identifying relationships. Always state WHY the entity is weak — because it cannot exist without its parent entity.</p>
                </div>
              </div>

              {/* File Organization */}
              <div
                ref={(el) => {
                  sectionRefs.current['file-org'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  File Organization &amp; Access Methods
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Heap (Unordered)</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Records stored in arrival order. Fast INSERT, slow SEARCH. Best for: bulk loading data.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Sequential</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Records sorted by a key field. Efficient for ordered processing. Best for: batch reports run in sequence.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Indexed</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Index points to record locations. Fast SEARCH using the index. Best for: frequent search queries.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Hashed</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Hash function calculates exact record location. Very fast direct access. Best for: single-record lookups by key.</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Real Life Example</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Think of searching for a song on an old mixed tape (heap), vs a properly labeled CD with track numbers (sequential), vs Spotify's search bar (indexed), vs typing an exact URL directly into a browser (hashed).</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">File organization questions often ask you to 'recommend a suitable file organization method for a given scenario.' Always justify your choice — WHY is hashed/indexed/sequential best for that specific use case?</p>
                </div>
              </div>

              {/* Practice Questions */}
              <div
                ref={(el) => {
                  sectionRefs.current['practice'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Practice Exercise Questions &amp; Answers
                </h2>

                <div className="space-y-6 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q1: Explain what a database is and why database design is important. Use a local example.</p>
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">A database is an organized collection of related data. For example, ZIMRA uses a database to store taxpayer details and payment records. Database design is important because poor design leads to data redundancy, inconsistencies, and inefficient queries.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q2: What is the difference between an internal and external end user? Give examples for a bank.</p>
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Internal: Bank Tellers (view/update balances). External: Account Holders (view own balance via mobile banking).</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q3: List and briefly explain the four CRUD operations with examples from a school system.</p>
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">CREATE – Adding a new student. READ – Retrieving student marks. UPDATE – Changing student address. DELETE – Removing a student record when they leave.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q4: What is the difference between a Candidate Key, a Primary Key, and an Alternate Key?</p>
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Candidate Key: any attribute that can uniquely identify a record. Primary Key: the ONE chosen candidate key. Alternate Key: candidate key NOT chosen as primary.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Q5: A table called STUDENT_SUBJECT has columns: student_id, subject_code, student_name, teacher_name, marks. Primary key is (student_id + subject_code). What normal form violation exists? How do you fix it?</p>
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Partial dependency violations (not in 2NF). student_name depends only on student_id; teacher_name depends only on subject_code. Fix: Create three tables: STUDENT (student_id, student_name), SUBJECT (subject_code, teacher_name), and RESULT (student_id, subject_code, marks).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div
                ref={(el) => {
                  sectionRefs.current['cheat-sheet'] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                  Quick Revision Cheat Sheet
                </h2>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Concept</th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Key Point to Remember</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      <tr><td className="p-3 font-bold">Database Design</td><td className="p-3">Planning structure before building. Goal: reduce redundancy, improve integrity.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">End Users</td><td className="p-3">Internal (employees) vs External (customers, auditors).</td></tr>
                      <tr><td className="p-3 font-bold">CRUD</td><td className="p-3">Create, Read, Update, Delete — four operations every database must support.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Entity</td><td className="p-3">A thing you store data about. Must be independent and uniquely identifiable.</td></tr>
                      <tr><td className="p-3 font-bold">Attribute</td><td className="p-3">A property of an entity. Must be ATOMIC (not divisible) and RELEVANT.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Primary Key</td><td className="p-3">THE CHOSEN unique identifier. Cannot be NULL. Only one per table.</td></tr>
                      <tr><td className="p-3 font-bold">ERD Symbols</td><td className="p-3">Rectangle = Entity. Oval = Attribute. Diamond = Relationship.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">1NF</td><td className="p-3">Atomic values + Primary key + No duplicate rows.</td></tr>
                      <tr><td className="p-3 font-bold">2NF</td><td className="p-3">1NF + No partial dependencies.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">3NF</td><td className="p-3">2NF + No transitive dependencies.</td></tr>
                      <tr><td className="p-3 font-bold">Strong Entity</td><td className="p-3">Has own primary key. Exists independently. Single rectangle.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Weak Entity</td><td className="p-3">No full primary key. Depends on strong entity. DOUBLE rectangle.</td></tr>
                      <tr><td className="p-3 font-bold">Heap</td><td className="p-3">Unordered storage. Fast INSERT, slow SEARCH.</td></tr>
                      <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Indexed</td><td className="p-3">Index speeds up SEARCH. Uses extra storage.</td></tr>
                      <tr><td className="p-3 font-bold">Hashed</td><td className="p-3">Hash function = direct access. Fastest for individual key lookups.</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                  <p className="text-xl font-bold">You've got this! Study smart, revise often, and believe in yourself. 🚀</p>
                </div>
              </div>
            </div>

            {/* ─── Sidebar ──────────────────────────────────────────────────── */}
            <aside className={`space-y-6 lg:sticky lg:top-24 h-fit ${(isErd1Fullscreen || isErd2Fullscreen) ? 'hidden' : ''}`}>
              {/* Random Tip Card */}
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    💡 Database Insight
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
                    <span>Normal Forms</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Key Types</span>
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
                  Database design is about planning before building. Understand
                  your users, define your entities and attributes, normalize your
                  tables, and choose the right file organization. Master these,
                  and you'll build efficient, reliable databases.
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
                  <strong className="text-white">Database design</strong> is the blueprint phase – identify users, define entities and attributes, and plan relationships before building.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-300 font-bold">•</span>
                <span>
                  <strong className="text-white">CRUD</strong> (Create, Read, Update, Delete) are the four fundamental operations every database must support.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Keys</strong> – Candidate (any unique identifier), Primary (the chosen one), Alternate (candidate not chosen).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Normalization</strong> – 1NF (atomic), 2NF (no partial dependencies), 3NF (no transitive dependencies) – eliminates redundancy and anomalies.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-300 font-bold">•</span>
                <span>
                  <strong className="text-white">File organization</strong> – Heap (fast insert), Sequential (ordered processing), Indexed (fast search), Hashed (direct access).
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
              Sidemann Academic Registry • Database Design 1.0
            </span>
          </div>
        </footer>
      </div>
    );
  };

  export default LearningOutcome1;
