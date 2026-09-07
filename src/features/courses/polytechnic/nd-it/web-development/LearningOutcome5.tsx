import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  Type,
  Layout,
  Smartphone,
  RefreshCw,
  BookOpen,
  ShoppingCart,
  Users,
  Phone,
  HelpCircle,
  Briefcase,
  File,
  Image,
  Settings,
  Globe,
  Server,
  Code,
  CheckCircle,
  Bug,
  Zap,
  Shield,
  Eye,
  BarChart3,
  Repeat,
  Tablet,
  Monitor,
  AppWindow,
  Download,
  Cloud,
  TrendingUp,
  PenTool,
  ListChecks,
  TestTube,
  Crosshair,
  ClipboardCheck,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Target,
  ClipboardList,
  FileCode,
  FolderTree,
  UserCheck,
  GraduationCap,
  Calendar,
  DollarSign,
  Briefcase as BriefcaseIcon,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings as SettingsIcon,
  BookOpen as BookOpenIcon,
  Link,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'content-writing', label: 'Content Writing' },
  { id: 'cms', label: 'CMS Evaluation' },
  { id: 'server-client', label: 'Server vs Client' },
  { id: 'languages', label: 'Dev Languages' },
  { id: 'testing-objectives', label: 'Testing Objectives' },
  { id: 'automated-manual', label: 'Auto vs Manual' },
  { id: 'testing-checklist', label: 'Testing Checklist' },
  { id: 'test-types', label: 'Test Types' },
  { id: 'cross-browser', label: 'Cross-Browser' },
  { id: 'test-report', label: 'Test Report' },
  { id: 'mobile-vs-app', label: 'Mobile vs App' },
  { id: 'mobile-vs-responsive', label: 'Mobile vs Responsive' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Cross-browser testing dates back to the late 1990s when websites had to work on Internet Explorer, Netscape, and Opera. Today, browser compatibility remains a key challenge.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test your website on both Chrome and Firefox during development. These two browsers often render CSS and JavaScript differently, and catching issues early saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 testing objectives with "F.U.C.P.S.A.C.C": Functionality, Usability, Compatibility, Performance, Security, Accessibility, Content Accuracy, Cross-Browser.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse mobile websites with responsive websites. A mobile site is a separate version; a responsive site adapts to any screen size using the same codebase.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Cross-browser testing dates back to the late 1990s when websites had to work on Internet Explorer, Netscape, and Opera. Today, browser compatibility remains a key challenge.',
      },
      {
        title: 'Pro Tip',
        text: 'Always test your website on both Chrome and Firefox during development. These two browsers often render CSS and JavaScript differently, and catching issues early saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 testing objectives with "F.U.C.P.S.A.C.C": Functionality, Usability, Compatibility, Performance, Security, Accessibility, Content Accuracy, Cross-Browser.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse mobile websites with responsive websites. A mobile site is a separate version; a responsive site adapts to any screen size using the same codebase.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <PenTool size={14} className="inline mr-1" /> LEARNING OUTCOME 5
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Content Writing, Testing &{' '}
            <span className="text-rose-300 font-bold italic">
              Cross-Browser
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master content rules, CMS evaluation, server/client programming, testing objectives, automated vs manual testing, cross‑browser compatibility, and mobile vs responsive design.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Content Writing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TestTube size={14} className="inline mr-1" /> Testing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Cross‑Browser
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
                placeholder="Search for a concept, testing, cross-browser..."
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
            {/* Section 1: Content Writing Rules */}
            <div
              ref={(el) => {
                sectionRefs.current['content-writing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Rules &amp; Guidelines for Website Content Writing
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Good website content is clear, relevant, well-organised, and visually appealing. It must also be accessible, mobile-friendly, and regularly updated.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Key Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {[
                    'Clarity & Conciseness',
                    'Relevance to Audience',
                    'Logical Organisation',
                    'Visual Appeal',
                    'Clear Call to Action',
                    'Proofreading & Editing',
                    'Accessibility (WCAG)',
                    'Mobile Optimization',
                    'Regular Updates',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">8 Types of Website Content</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {['Blog Posts', 'Product Pages', 'About Us', 'Contact Pages', 'FAQs', 'Case Studies', 'Whitepapers', 'Visual Content'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300 text-center">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: CMS Evaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['cms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluate Content Management Systems (CMS)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  When choosing a CMS, consider these factors:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    { label: 'Ease of Use', desc: 'Intuitive for non‑technical users.' },
                    { label: 'Features', desc: 'Blogging, e‑commerce, SEO tools.' },
                    { label: 'Customization', desc: 'Ability to modify design and functionality.' },
                    { label: 'Scalability', desc: 'Handles growing traffic and data.' },
                    { label: 'Community Support', desc: 'Active community for help and resources.' },
                    { label: 'Cost', desc: 'Licensing fees and additional costs.' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{label}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Server-Side vs Client-Side */}
            <div
              ref={(el) => {
                sectionRefs.current['server-client'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Server‑Side vs Client‑Side Programming
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Server‑Side</th>
                      <th className="border p-2 text-left font-bold">Client‑Side</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Execution Location', 'Server', 'Client browser'],
                      ['Purpose', 'Database, logic, security', 'Interactive UI'],
                      ['Languages', 'PHP, Python, Ruby, Java', 'JavaScript, HTML, CSS'],
                      ['Data Processing', 'On server', 'On client device'],
                      ['Security', 'More secure', 'Less secure (vulnerabilities)'],
                      ['Performance', 'Impact on server load', 'Improves user experience'],
                      ['SEO', 'Can be optimized', 'Less impact'],
                      ['Dependencies', 'Web server + database', 'Runs in browser'],
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

            {/* Section 4: Development Languages */}
            <div
              ref={(el) => {
                sectionRefs.current['languages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluate Website Development Languages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Front‑End</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">HTML</span> – structure and content</li>
                    <li><span className="font-bold">CSS</span> – styling and layout</li>
                    <li><span className="font-bold">JavaScript</span> – interactivity and dynamics</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Back‑End</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">PHP</span> – popular server‑side scripting</li>
                    <li><span className="font-bold">Python</span> – versatile web applications</li>
                    <li><span className="font-bold">Ruby</span> – Ruby on Rails framework</li>
                    <li><span className="font-bold">Java</span> – large‑scale enterprise apps</li>
                    <li><span className="font-bold">Node.js</span> – JavaScript on the server</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Tip:</span> Choose languages based on your team's expertise, project requirements, and desired features.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Testing Objectives */}
            <div
              ref={(el) => {
                sectionRefs.current['testing-objectives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                8 Objectives of Website Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Functionality',
                    'Usability',
                    'Compatibility',
                    'Performance',
                    'Security',
                    'Accessibility',
                    'Content Accuracy',
                    'Cross-Browser Compatibility',
                  ].map((item) => (
                    <div key={item} className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "F.U.C.P.S.A.C.C" – Functionality, Usability, Compatibility, Performance, Security, Accessibility, Content Accuracy, Cross-Browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Automated vs Manual Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['automated-manual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Automated vs Manual Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Automated Testing</th>
                      <th className="border p-2 text-left font-bold">Manual Testing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Execution', 'Software', 'Humans'],
                      ['Speed', 'Faster', 'Slower'],
                      ['Accuracy', 'More accurate', 'Prone to errors'],
                      ['Efficiency', 'Great for repetitive tasks', 'Time-consuming'],
                      ['Cost', 'Higher upfront, saves long‑term', 'Lower upfront, higher long‑term'],
                      ['Coverage', 'Wide range of scenarios', 'Limited coverage'],
                      ['Repeatability', 'Easily repeated', 'Difficult to repeat'],
                      ['Objectivity', 'More objective', 'Can be subjective'],
                      ['Maintenance', 'Ongoing maintenance needed', 'Less maintenance'],
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
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">How to Set Up Automated Tests</h3>
                <ul className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Choose a Testing Tool</span> – Selenium, Cypress, TestComplete.</li>
                  <li><span className="font-bold">Set Up Test Environment</span> – Mimic production environment.</li>
                  <li><span className="font-bold">Write Test Scripts</span> – Automate functional, performance, security tests.</li>
                  <li><span className="font-bold">Run Tests</span> – Execute scripts to identify defects.</li>
                  <li><span className="font-bold">Analyze Results</span> – Review reports and fix issues.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Testing Checklist */}
            <div
              ref={(el) => {
                sectionRefs.current['testing-checklist'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Testing Checklist
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Functional Testing',
                    'Usability Testing',
                    'Compatibility Testing',
                    'Performance Testing',
                    'Security Testing',
                    'Accessibility Testing',
                    'Content Accuracy Testing',
                    'Cross-Browser Testing',
                    'Mobile Testing',
                    'Regression Testing',
                  ].map((item) => (
                    <div key={item} className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 8: Types of Website Tests */}
            <div
              ref={(el) => {
                sectionRefs.current['test-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Website Tests
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Functionality Testing', desc: 'Verify all features work as intended.' },
                  { title: 'Usability Testing', desc: 'Evaluate ease of navigation and user experience.' },
                  { title: 'Interface Testing', desc: 'Check visual appeal, intuitiveness, and UI consistency.' },
                  { title: 'Database Testing', desc: 'Verify data integrity, accuracy, and retrieval.' },
                  { title: 'Compatibility Testing', desc: 'Test across browsers, devices, and OS.' },
                  { title: 'Performance Testing', desc: 'Measure speed, responsiveness, and scalability.' },
                  { title: 'Security Testing', desc: 'Identify vulnerabilities (SQL injection, XSS, CSRF).' },
                  { title: 'Crowd Testing', desc: 'Engage a large group to test and provide feedback.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9: Cross-Browser Compatibility */}
            <div
              ref={(el) => {
                sectionRefs.current['cross-browser'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cross‑Browser Compatibility
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Cross‑browser compatibility means a website works consistently across different browsers (Chrome, Firefox, Safari, Edge, etc.).
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">8 Reasons It Matters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                  {['Wider Audience', 'Better UX', 'SEO Benefit', 'Accessibility', 'Professionalism', 'Cost-Effectiveness', 'User Trust', 'Future-Proofing'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300 text-center">{item}</div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mt-3">8 Common Issues</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                  {['CSS Rendering', 'JS Inconsistencies', 'HTML5 Support', 'Font Rendering', 'Viewport Meta', 'Media Queries', 'Browser Bugs', 'Plugin Compatibility'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300 text-center">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 10: Test Report */}
            <div
              ref={(el) => {
                sectionRefs.current['test-report'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Test Report
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A test report summarises testing activities, objectives, scope, test cases, defects, and overall quality assessment.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">Structure</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Executive Summary</li>
                  <li>Introduction</li>
                  <li>Test Plan</li>
                  <li>Test Environment</li>
                  <li>Test Cases</li>
                  <li>Defects</li>
                  <li>Metrics</li>
                  <li>Conclusion</li>
                  <li>Appendices</li>
                </ul>
              </div>
            </div>

            {/* Section 11: Mobile Websites vs Mobile Apps */}
            <div
              ref={(el) => {
                sectionRefs.current['mobile-vs-app'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Mobile Websites vs Mobile Apps
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Mobile Website</th>
                      <th className="border p-2 text-left font-bold">Mobile App</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Platform', 'Accessed via browser', 'Downloaded & installed'],
                      ['Performance', 'Slower (network)', 'Faster (native)'],
                      ['Offline', 'Limited/none', 'Can work offline'],
                      ['UX', 'Limited by browser', 'Immersive & tailored'],
                      ['Development', 'Web tech (HTML/CSS/JS)', 'Native (Swift, Kotlin)'],
                      ['Distribution', 'Web browser', 'App stores'],
                      ['Updates', 'Automatic by owner', 'User-initiated updates'],
                      ['Cost', 'Usually free', 'May have purchase/subscription'],
                      ['Device Features', 'Limited', 'Full access (camera, GPS, notifications)'],
                      ['Security', 'Vulnerable', 'Enhanced security'],
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

            {/* Section 12: Mobile Websites vs Responsive Websites */}
            <div
              ref={(el) => {
                sectionRefs.current['mobile-vs-responsive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Mobile Websites vs Responsive Websites
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Mobile Website</th>
                      <th className="border p-2 text-left font-bold">Responsive Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Design Approach', 'Designed for mobile only', 'Adapts to all screen sizes'],
                      ['URL Structure', 'May have separate URL (m.)', 'Same URL for all devices'],
                      ['Content', 'Simplified/reduced content', 'Same content, adjusted layout'],
                      ['Development', 'Separate versions needed', 'Single codebase'],
                      ['Performance', 'Optimised for mobile', 'Often optimised for all'],
                      ['UX', 'Tailored for mobile users', 'Consistent across devices'],
                      ['SEO', 'Separate strategies', 'Single strategy helps SEO'],
                      ['Maintenance', 'Two codebases to maintain', 'Single codebase'],
                      ['Cost', 'Higher development cost', 'More cost-effective'],
                      ['Flexibility', 'Less adaptable', 'More flexible'],
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
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <AlertCircle size={14} className="inline mr-1" />
                  <span className="font-bold">Key Distinction:</span> A mobile site is a separate version; a responsive site adapts dynamically to any screen size using the same codebase.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Testing Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span>Testing Objectives</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Test Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Good content follows clear guidelines; CMS selection impacts ease of use and scalability. Understand the difference between server‑side and client‑side programming. Testing is essential for quality; combine automated and manual testing. Cross‑browser compatibility ensures a consistent user experience. Know the distinctions between mobile websites, apps, and responsive design – these are common exam topics.
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
                <strong className="text-white">Content Writing</strong> – clear, relevant, organised, and accessible content with regular updates is essential for user engagement and SEO.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">CMS Evaluation</strong> – consider ease of use, features, customisation, scalability, support, and cost when choosing a platform.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Server vs Client</strong> – server‑side handles data and security; client‑side manages UI and interactivity. Each has distinct languages and purposes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing</strong> – 8 objectives (Functionality, Usability, Compatibility, Performance, Security, Accessibility, Content Accuracy, Cross-Browser). Combine automated and manual testing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mobile vs Responsive</strong> – mobile sites are separate versions; responsive sites adapt dynamically to any screen size with one codebase. Apps offer more features but require installation.
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
            Sidemann Academic Registry • Content, Testing &amp; Cross‑Browser 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;