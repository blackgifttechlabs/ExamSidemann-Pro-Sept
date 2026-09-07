import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'software-overview', label: 'Software Overview' },
  { id: 'ethics-roles', label: 'Ethics & Roles' },
  { id: 'problem-analysis', label: 'Problem & Analysis' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'methodologies', label: 'Methodologies' },
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
        text: 'The first software engineering conference was held in 1968 in Garmisch, Germany, which is often considered the birth of the discipline.',
      },
      {
        title: 'Pro Tip',
        text: 'A well-written problem statement is half the solution. Spend time defining the problem clearly before writing any code.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 attributes of good software: FURPS (Functionality, Usability, Reliability, Performance, Security) plus Maintainability, Scalability, and Testability.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse functional requirements (what the system does) with non-functional requirements (how the system performs). Both are essential for complete specifications.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first software engineering conference was held in 1968 in Garmisch, Germany, which is often considered the birth of the discipline.',
      },
      {
        title: 'Pro Tip',
        text: 'A well-written problem statement is half the solution. Spend time defining the problem clearly before writing any code.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 attributes of good software: FURPS (Functionality, Usability, Reliability, Performance, Security) plus Maintainability, Scalability, and Testability.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse functional requirements (what the system does) with non-functional requirements (how the system performs). Both are essential for complete specifications.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Fundamentals of Software Engineering
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Clear, detailed, and exam‑ready study guide covering software, its importance, professional ethics, requirements engineering, and more.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> Software
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Ethics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Requirements
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
                placeholder="Search for a concept, feasibility, SRS..."
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
            {/* Section 1: Software Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['software-overview'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Software Overview
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Software is the intangible set of instructions that makes hardware useful. It is the backbone of modern computing.
                  </p>
</div>

              {/* What is Software */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">What is Software?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Software is a collection of instructions — called programs — that tell a computer what to do. It is <span className="font-bold">intangible</span> (cannot be touched) and fundamentally different from hardware (tangible physical components).
                </p>
                <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm text-indigo-800 dark:text-indigo-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    Think of it this way: a smartphone (hardware) without software is just an expensive piece of glass and metal.
                  </p>
                </div>
              </div>

              {/* Importance of Software Engineering */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Importance of Software Engineering</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Software engineering is the systematic, disciplined approach to building software. It brings order, quality, and reliability.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    '1. Quality Assurance',
                    '2. Maintainability',
                    '3. Reduced Costs',
                    '4. Scalability',
                    '5. Security',
                    '6. Predictability',
                    '7. Reusability',
                    '8. Client Satisfaction',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributes of Good Software */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Attributes of Good Software</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Functionality',
                    'Usability',
                    'Reliability',
                    'Performance',
                    'Security',
                    'Maintainability',
                    'Scalability',
                    'Testability',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Ethics & Roles */}
            <div
              ref={(el) => {
                sectionRefs.current['ethics-roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Professional Ethics &amp; Roles
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Professional Ethics (8 Principles)</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Competence:</strong> Only take on work you are qualified to do.</li>
                  <li><strong>Confidentiality:</strong> Protect sensitive client information.</li>
                  <li><strong>Client Honesty:</strong> Be truthful about possibilities, timelines, and costs.</li>
                  <li><strong>Fairness:</strong> Treat all colleagues and clients with respect.</li>
                  <li><strong>Intellectual Property:</strong> Respect others' work and copyright.</li>
                  <li><strong>Software Quality:</strong> Deliver reliable and secure software.</li>
                  <li><strong>Social Responsibility:</strong> Consider the broader impact of your work.</li>
                  <li><strong>Professional Development:</strong> Commit to continuous learning.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Roles in Software Engineering</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Software Developers',
                    'Software Testers (QA)',
                    'Software Architects',
                    'System Engineers',
                    'Project Managers',
                    'Requirements Engineers',
                    'UI Designers',
                    'Database Administrators',
                  ].map((role) => (
                    <div key={role} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {role}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Software Engineering vs Computer Science</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Software Engineering</th>
                        <th className="border p-2 text-left font-bold">Computer Science</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Focus', 'Building/maintaining systems', 'Theoretical foundations'],
                        ['Methodology', 'Disciplined, process-driven', 'Research-oriented'],
                        ['Key Skills', 'Programming, design, testing', 'Algorithms, theory'],
                        ['Career Paths', 'Developer, QA, architect', 'Researcher, academic'],
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

            {/* Section 3: Problem & Analysis */}
            <div
              ref={(el) => {
                sectionRefs.current['problem-analysis'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Problem Statement &amp; Analysis
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Problem Statement</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  A clear, concise description of the gap between the current and desired situation. It is the starting point for any project.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-2">8 Reasons for Importance:</h4>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {[
                    'Clarity & Focus',
                    'Improved Communication',
                    'Guides Research',
                    'Evaluation & Measurement',
                    'Increased Creativity',
                    'Project Feasibility',
                    'Prioritisation',
                    'Decision‑Making',
                  ].map((item) => (
                    <div key={item} className="p-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-2">6 Steps to Write One:</h4>
                <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Identify the Problem</li>
                  <li>Context</li>
                  <li>Impact</li>
                  <li>Desired Outcome</li>
                  <li>Target Audience</li>
                  <li>Conciseness and Clarity</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Analysing Software Development</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Understand the problem by investigating target users, tasks/workflows, and pain points.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Evaluate alternative solutions on 6 factors: Functionality, Usability, Technical Feasibility, Scalability, Cost, Security.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Feasibility Study</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An objective assessment of project viability. 4 types:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Technical:</strong> Can we build it?</li>
                  <li><strong>Economic:</strong> Does it make financial sense?</li>
                  <li><strong>Operational:</strong> Can the organisation support it?</li>
                  <li><strong>Schedule:</strong> Can we finish on time?</li>
                </ul>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold">8 Reasons it matters:</span> Informed decisions, risk mitigation, better planning, communication, cost savings, higher success rate, investor confidence, project optimisation.
                </div>
              </div>
            </div>

            {/* Section 4: Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['requirements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Requirements Engineering
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-xs font-bold text-green-700 dark:text-green-400">Functional Requirements</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">WHAT the system does (features).</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Example: "Login with username and password."</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400">Non-Functional Requirements</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">HOW the system performs (quality).</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Example: "Response time &lt; 2 seconds."</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>User vs System Requirements:</strong> User requirements are high-level user needs (plain language); System requirements are detailed technical specifications.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Requirements Engineering Process (6 Stages)</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Feasibility Study</strong> – Initial viability check.</li>
                  <li><strong>Requirements Elicitation</strong> – Gather from stakeholders.</li>
                  <li><strong>Requirements Analysis</strong> – Check completeness, consistency.</li>
                  <li><strong>Requirements Documentation</strong> – Write SRS.</li>
                  <li><strong>Requirements Validation</strong> – Verify accuracy.</li>
                  <li><strong>Requirements Management</strong> – Handle changes and traceability.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Requirements Analysis – CAUV Criteria</h3>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {['Complete', 'Consistent', 'Attainable', 'Unambiguous', 'Verifiable'].map((c) => (
                    <div key={c} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Software Requirements Specification (SRS)</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The official document recording all requirements. It is the single source of truth.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2">Key Components:</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Introduction</li>
                  <li>Product Description</li>
                  <li>Software Requirements (functional)</li>
                  <li>External Interface Requirements</li>
                  <li>Non-Functional Requirements</li>
                </ul>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold">7 Benefits for Developers:</span> Clear Understanding, Improved Design, Enhanced Communication, Effective Testing, Reduced Errors, Efficient Change Management, Improved Project Management.
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Fact‑Finding Techniques</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Reviewing Documentation',
                    'Interviews',
                    'Questionnaires',
                    'Observation',
                    'Prototyping',
                    'Joint Application Design (JAD)',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-2">Fact Recording Tools:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Note-Taking Apps', 'Audio Recorders', 'Mind Mapping', 'Spreadsheets', 'Document Management'].map((t) => (
                    <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Methodologies */}
            <div
              ref={(el) => {
                sectionRefs.current['methodologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Development Approaches
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Bottom‑Up vs Top‑Down</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Bottom‑Up</th>
                        <th className="border p-2 text-left font-bold">Top‑Down</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Starting Point', 'Individual modules', 'High‑level system'],
                        ['Development Process', 'Build pieces then integrate', 'Break whole into parts'],
                        ['Focus', 'Module functionality', 'Overall architecture'],
                        ['Best Suited For', 'Smaller projects, unclear requirements', 'Large, complex projects with clear requirements'],
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
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
                  <p><strong>Bottom‑Up</strong>: Build small pieces first, then combine.</p>
                  <p><strong>Top‑Down</strong>: Define the big picture, then break down.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">User Involvement &amp; Requirements Validation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">6 Reasons User Involvement is Crucial:</span> Accurate Requirements, Improved Usability, Increased User Buy‑In, Early Detection of Issues, Prioritisation, Reduced Development Costs.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="font-bold">Requirements Validation</span> checks that documented requirements are accurate and complete. 8 reasons it's essential: Improved Quality, Reduced Costs, Enhanced Scope Management, Increased User Satisfaction, Improved Communication, Reduced Risk of Failure, Stronger Testing Foundation, Improved Traceability.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Requirements Management</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ongoing process of handling requirements throughout the lifecycle. 5 key activities:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Requirements Gathering</li>
                  <li>Requirements Analysis</li>
                  <li>Requirements Documentation</li>
                  <li>Requirements Change Management</li>
                  <li>Requirements Traceability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Software Engineering Insight
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
                  <span>Key Topics</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10+</span>
                </li>
                <li className="flex justify-between">
                  <span>Exam Cheat Sheet</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">✔</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Software engineering is about discipline, quality, and meeting real needs. Master the fundamentals: what software is, its importance, professional ethics, roles, problem statements, requirements engineering, and development approaches. These concepts are the foundation of the entire discipline.
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
                <strong className="text-white">Software</strong> – intangible instructions; software engineering brings discipline and quality.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">8 Attributes</strong> – Functionality, Usability, Reliability, Performance, Security, Maintainability, Scalability, Testability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Professional Ethics</strong> – competence, confidentiality, honesty, fairness, IP respect, quality, social responsibility, continuous learning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Requirements Engineering</strong> – 6-stage process; distinguish functional vs non‑functional; use SRS and validate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Approaches</strong> – Bottom‑Up vs Top‑Down; each suited to different project contexts.
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
            Sidemann Academic Registry • Software Engineering Fundamentals 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;