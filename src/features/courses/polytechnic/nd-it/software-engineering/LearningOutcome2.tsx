import React, { useState, useEffect, useRef, Activity } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Code,
  Shield,
  Users,
  Target,
  ClipboardList,
  Calendar,
  DollarSign,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Layers,
  FileText,
  CheckCircle,
  TrendingUp,
  GitBranch,
  Terminal,
  Database,
  Table,
  Box,
  Layout,
  Eye,
  Link2,
  ActivityIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'logical-vs-conceptual', label: 'Logical vs Conceptual' },
  { id: 'er-modelling', label: 'ER Modelling' },
  { id: 'functional-vs-data', label: 'Functional vs Data' },
  { id: 'top-down-vs-bottom-up', label: 'Top‑Down vs Bottom‑Up' },
  { id: 'cohesion-coupling', label: 'Cohesion & Coupling' },
  { id: 'design-heuristics', label: 'Design Heuristics' },
  { id: 'ui-design', label: 'UI Design' },
  { id: 'menu-types', label: 'Menu Types' },
  { id: 'case-tools', label: 'CASE Tools' },
  { id: 'uml', label: 'UML' },
  { id: 'architectural-design', label: 'Architecture' },
  { id: 'practice-questions', label: 'Practice Qs' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
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
        text: 'The first ERD (Entity-Relationship Diagram) was introduced by Peter Chen in 1976. It remains one of the most widely used data modelling techniques today.',
      },
      {
        title: 'Pro Tip',
        text: 'High cohesion and low coupling are the golden rules of software design. Always ask: "Does this module do one thing well?" and "Does it depend too much on others?"',
      },
      {
        title: 'Memory Trick',
        text: 'Remember UML diagrams by their purpose: Class = structure, Sequence = interaction, Use Case = requirements, State = lifecycle, Activity = workflow, Object = instances, Collaboration = roles.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse logical design with physical design. Logical design is technology‑independent, focusing on data structures and relationships. Physical design considers specific DBMS and hardware.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first ERD (Entity-Relationship Diagram) was introduced by Peter Chen in 1976. It remains one of the most widely used data modelling techniques today.',
      },
      {
        title: 'Pro Tip',
        text: 'High cohesion and low coupling are the golden rules of software design. Always ask: "Does this module do one thing well?" and "Does it depend too much on others?"',
      },
      {
        title: 'Memory Trick',
        text: 'Remember UML diagrams by their purpose: Class = structure, Sequence = interaction, Use Case = requirements, State = lifecycle, Activity = workflow, Object = instances, Collaboration = roles.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse logical design with physical design. Logical design is technology‑independent, focusing on data structures and relationships. Physical design considers specific DBMS and hardware.',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              System Design &amp; Architecture
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master logical/conceptual design, ER modelling, modularity, cohesion/coupling, UI design, UML, architectural patterns, and more.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> ER Modelling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> UML
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> Architecture
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, ERD, cohesion..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
            {/* Section 1: Logical vs Conceptual Design */}
            <div
              ref={(el) => {
                sectionRefs.current['logical-vs-conceptual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Logical vs Conceptual Design
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Before writing code, software engineers design the system at two levels: conceptual (high‑level, technology‑independent) and logical (more detailed, closer to implementation).
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Conceptual Design</th>
                      <th className="border p-2 text-left font-bold">Logical Design</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Focus', 'High‑level functionalities, entities, relationships', 'Detailed data structures, attributes, relationships'],
                      ['Detail Level', 'Abstract, technology‑independent', 'More detailed, closer to implementation'],
                      ['User Perspective', 'Strong focus on user needs', 'Limited focus on user perspective'],
                      ['Stability', 'Relatively stable throughout development', 'May evolve based on chosen technology'],
                    ].map((item, idx) => (
                      <tr key={item[0]} className={rowBg(idx)}>
                        <td className="border p-2 font-bold">{item[0]}</td>
                        <td className="border p-2">{item[1]}</td>
                        <td className="border p-2">{item[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: ER Modelling */}
            <div
              ref={(el) => {
                sectionRefs.current['er-modelling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Entity‑Relationship Modelling (ERM)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">What it is:</span> A technique to visually represent the data a system needs and the relationships between data pieces. The output is an Entity‑Relationship Diagram (ERD).
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <Box size={16} /> Entities
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rectangles – real‑world objects (Student, Course).</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Link2 size={16} /> Attributes
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ovals – properties of entities (StudentID, Name).</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <GitBranch size={16} /> Relationships
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Diamonds – connections (ENROLS IN, TEACHES).</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
                    <span className="font-bold">1:1</span> – One‑to‑One
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                    <span className="font-bold">1:M</span> – One‑to‑Many
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                    <span className="font-bold">M:N</span> – Many‑to‑Many
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Functional vs Data-Oriented Design */}
            <div
              ref={(el) => {
                sectionRefs.current['functional-vs-data'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Functional vs Data‑Oriented Design
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ActivityIcon size={16} /> Functional Design
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Starts with "What must this system DO?" Focuses on behaviour and tasks.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1">Starting with verbs – calculate, generate, send.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Database size={16} /> Data‑Oriented Design
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Starts with "What DATA must this system manage?" Focuses on data integrity.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-1">Starting with nouns – employees, salaries, departments.</p>
                </div>
              </div>
            </div>

            {/* Section 4: Top-Down vs Bottom-Up Design */}
            <div
              ref={(el) => {
                sectionRefs.current['top-down-vs-bottom-up'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Top‑Down vs Bottom‑Up Design
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Top‑Down</th>
                      <th className="border p-2 text-left font-bold">Bottom‑Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Starting Point', 'High‑level system functionalities', 'Individual modules/components'],
                      ['Process', 'Decompose whole into smaller modules', 'Build pieces and integrate upward'],
                      ['Focus', 'Overall system structure', 'Functionality of individual modules'],
                      ['Testing', 'System‑level first', 'Unit testing first'],
                      ['Best For', 'Large, complex projects with clear requirements', 'Smaller projects or when reusable modules exist'],
                    ].map((item, idx) => (
                      <tr key={item[0]} className={rowBg(idx)}>
                        <td className="border p-2 font-bold">{item[0]}</td>
                        <td className="border p-2">{item[1]}</td>
                        <td className="border p-2">{item[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Cohesion & Coupling */}
            <div
              ref={(el) => {
                sectionRefs.current['cohesion-coupling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Modularity, Cohesion &amp; Coupling
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Modularity</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Degree to which a system is divided into independent, self‑contained modules. High modularity improves maintainability, reusability, and parallel development.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Cohesion</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Measures how focused elements within a module are. Aim for <span className="font-bold text-green-600 dark:text-green-400">HIGH</span> cohesion.</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">1. Functional (Best)</div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">2. Logical</div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">3. Procedural</div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">4. Communicational</div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">5. Coincidental (Worst)</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Coupling</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Measures interdependence between modules. Aim for <span className="font-bold text-green-600 dark:text-green-400">LOW</span> coupling.</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">Data Coupling (Best)</div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">Stamp Coupling</div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">Control Coupling</div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">Common Coupling</div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">Content Coupling (Worst)</div>
                </div>
              </div>
            </div>

            {/* Section 6: Design Heuristics */}
            <div
              ref={(el) => {
                sectionRefs.current['design-heuristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Design Heuristics
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Practical guidelines for good design:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Favour smaller, more focused modules</li>
                  <li>Strive for high cohesion within modules</li>
                  <li>Minimise coupling between modules</li>
                  <li>Design for maintainability</li>
                  <li>Reuse existing components when possible</li>
                  <li>Use clear and meaningful naming conventions</li>
                  <li>Document your design decisions</li>
                  <li>Test your design thoroughly</li>
                </ul>
              </div>
            </div>

            {/* Section 7: UI Design */}
            <div
              ref={(el) => {
                sectionRefs.current['ui-design'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                User Interface Design
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  UI design is the process of designing how users visually interact with software. A great system with a poor UI will fail.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">5 Reasons UI Design Matters</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Usability</span> – intuitive, reduces training and support costs</li>
                  <li><span className="font-bold">User Experience</span> – positive impression encourages adoption</li>
                  <li><span className="font-bold">Efficiency</span> – minimises steps and clicks</li>
                  <li><span className="font-bold">Brand Identity</span> – communicates professionalism</li>
                  <li><span className="font-bold">Accessibility</span> – makes software usable by people with disabilities</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">8 UI Design Guidelines</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>User‑Centred Design – driven by user research</li>
                  <li>Simplicity and Clarity – clean, plain language</li>
                  <li>Consistency – same actions behave the same way</li>
                  <li>Feedback and Error Handling – tell users what's happening</li>
                  <li>Accessibility – support screen readers, keyboard navigation</li>
                  <li>Responsiveness – work across devices</li>
                  <li>Visual Hierarchy – guide attention with size/colour/spacing</li>
                  <li>Usability Testing – test with real users</li>
                </ul>
              </div>
            </div>

            {/* Section 8: Menu Types */}
            <div
              ref={(el) => {
                sectionRefs.current['menu-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Menus
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    { name: 'Dropdown', desc: 'Click to reveal list below', ex: 'File menu in Word' },
                    { name: 'Mega Menu', desc: 'Large multi‑column dropdown', ex: 'Large retail sites' },
                    { name: 'Hamburger', desc: 'Collapsed ☰ icon on mobile', ex: 'Mobile apps' },
                    { name: 'Tab Menu', desc: 'Horizontal tabs to switch content', ex: 'Product specs tab' },
                    { name: 'Breadcrumb', desc: 'Shows location in hierarchy', ex: 'Home > Electronics > Phones' },
                    { name: 'Context Menu', desc: 'Appears on right‑click', ex: 'Right‑click on a file' },
                  ].map((item) => (
                    <div key={item.name} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="font-bold">{item.name}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                      <p className="text-xs italic text-slate-500 dark:text-slate-500">Example: {item.ex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 9: CASE Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['case-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                CASE Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Computer‑Aided Software Engineering tools automate and support development tasks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages (5)</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>Improved Design Quality</li>
                      <li>Increased Productivity</li>
                      <li>Enhanced Communication</li>
                      <li>Better Documentation</li>
                      <li>Improved Maintainability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages (5)</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>Cost</li>
                      <li>Learning Curve</li>
                      <li>Vendor Lock‑in</li>
                      <li>Over‑reliance</li>
                      <li>Limited Flexibility</li>
                    </ul>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">7 Types of CASE Tools</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Upper CASE', 'Lower CASE', 'ICASE', 'Data Modelling', 'Process Modelling', 'Repository', 'Reverse Engineering'].map(t => (
                    <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 10: UML */}
            <div
              ref={(el) => {
                sectionRefs.current['uml'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Object‑Oriented Design with UML
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  UML is the standard notation for modelling object‑oriented systems. It has 7 diagram types:
                </p>
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Diagram</th>
                        <th className="border p-2 text-left font-bold">Shows</th>
                        <th className="border p-2 text-left font-bold">When to use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Class', 'Classes, attributes, operations, relationships', 'System structure'],
                        ['Object', 'Specific objects and values', 'Concrete examples'],
                        ['Sequence', 'Message order between objects', 'Interaction design'],
                        ['Collaboration', 'Object roles and relationships', 'Collaboration overview'],
                        ['State Machine', 'States and transitions', 'Object lifecycle'],
                        ['Activity', 'Workflow and process flow', 'Business processes'],
                        ['Use Case', 'Actors and system functionalities', 'Requirements communication'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 11: Architectural Design */}
            <div
              ref={(el) => {
                sectionRefs.current['architectural-design'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Architectural Design
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Architecture is the fundamental organisation of a system — its components, their interactions, and key design principles.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Key Architectural Decisions</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Technology Stack</li>
                  <li>System Decomposition</li>
                  <li>Communication Protocols</li>
                  <li>Security Considerations</li>
                </ul>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Common Architectural Patterns</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Layered</span> – Presentation, Business, Data</li>
                  <li><span className="font-bold">N‑Tier</span> – Each layer on separate hardware</li>
                  <li><span className="font-bold">SOA</span> – Loosely coupled services</li>
                  <li><span className="font-bold">Microservices</span> – Many small, independent services</li>
                  <li><span className="font-bold">Event‑Driven</span> – Publish/subscribe model</li>
                </ul>
              </div>
            </div>

            {/* Section 12: Practice Questions */}
            <div
              ref={(el) => {
                sectionRefs.current['practice-questions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Questions
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Q1. Differentiate between Conceptual Design and Logical Design.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Conceptual design focuses on the high‑level functionalities and overall structure, independent of specific technologies. It is relatively stable and user‑focused. Logical design adds detail — data structures, attributes, relationships — and is closer to implementation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Q2. Define Cohesion and Coupling, and explain the ideal levels for each.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Cohesion is how focused elements within a module are — aim for <strong>high</strong> cohesion. Coupling is interdependence between modules — aim for <strong>low</strong> coupling. High cohesion and low coupling lead to more maintainable, reusable software.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Q3. List FOUR types of UML diagrams and describe their purpose.</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Class</strong> – structure of classes and relationships</li>
                    <li><strong>Sequence</strong> – chronological order of messages</li>
                    <li><strong>Use Case</strong> – actor‑system interactions</li>
                    <li><strong>State Machine</strong> – states and transitions of an object</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Q4. Compare Top‑Down vs Bottom‑Up design.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Top‑Down starts from high‑level system requirements and decomposes into smaller pieces. Bottom‑Up starts with individual modules and integrates upward. Top‑Down is suited for large, complex projects; Bottom‑Up for smaller projects or when reusable components exist.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Design Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Key Design Concepts</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8+</span>
                </li>
                <li className="flex justify-between">
                  <span>UML Diagrams</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Software design is about making smart decisions early. Master the differences between conceptual/logical design, use ERDs and UML to communicate structure, and always aim for high cohesion and low coupling. These skills separate professional engineers from casual coders.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Design Levels</strong> – Conceptual (high‑level, tech‑independent) vs Logical (detailed, closer to implementation).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">ER Modelling</strong> – Entities (rectangles), Attributes (ovals), Relationships (diamonds). Cardinalities: 1:1, 1:M, M:N.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Modularity</strong> – High cohesion (focus) and low coupling (independence) are the golden rules.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">UML</strong> – 7 diagram types (Class, Sequence, Use Case, etc.) cover structure, behaviour, and interaction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Architecture</strong> – Choose patterns (layered, microservices, SOA) based on project needs; consider technology stack, decomposition, and security early.
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
            Sidemann Academic Registry • Software Engineering – System Design 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;