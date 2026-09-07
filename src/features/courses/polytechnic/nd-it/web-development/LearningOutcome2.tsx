import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Globe,
  Target,
  Users,
  FileText,
  ClipboardList,
  TrendingUp,
  Shield,
  Smartphone,
  CheckCircle,
  Clock,
  BarChart3,
  Search,
  LayoutDashboard,
  Server,
  HardDrive,
  Wifi,
  Lock,
  FolderTree,
  UserCheck,
  FileCode,
  GraduationCap,
  Calendar,
  DollarSign,
  Briefcase,
  Lightbulb,
  Rocket,
  Menu,
  MousePointer,
  Monitor,
  Touchpad,
  Grid3X3,
  Palette,
  BookOpen,
  X as XIcon,
  Sparkles,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Layers,
  Eye,
  Link2,
  Zap,
  Globe as GlobeIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  ClipboardList as ClipboardListIcon,
  FileText as FileTextIcon,
  HardDrive as HardDriveIcon,
  Server as ServerIcon,
  Settings,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  GitBranch,
  Terminal,
  Database,
  Table,
  Box,
  Play,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'sitemap', label: 'Sitemap' },
  { id: 'ui-ux', label: 'UI/UX Guidelines' },
  { id: 'layout', label: 'Website Layout' },
  { id: 'budget', label: 'Budget' },
  { id: 'timeline', label: 'Project Timelines' },
  { id: 'tech-outline', label: 'Tech & Content Outline' },
  { id: 'desktop-mobile', label: 'Desktop vs Mobile' },
  { id: 'framework', label: 'Website Framework' },
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
        text: 'XML sitemaps were introduced by Google in 2005 to help webmasters ensure search engines could find and index all pages on their sites.',
      },
      {
        title: 'Pro Tip',
        text: 'Always create both XML and HTML sitemaps. XML helps search engines crawl efficiently; HTML helps users navigate your site structure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember UI vs UX: UI is what users SEE (buttons, colours, layout). UX is what users FEEL (ease of use, navigation, satisfaction).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget about mobile responsiveness. More than 60% of web traffic now comes from mobile devices. If your site isn\'t mobile-friendly, you\'re losing visitors.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'XML sitemaps were introduced by Google in 2005 to help webmasters ensure search engines could find and index all pages on their sites.',
      },
      {
        title: 'Pro Tip',
        text: 'Always create both XML and HTML sitemaps. XML helps search engines crawl efficiently; HTML helps users navigate your site structure.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember UI vs UX: UI is what users SEE (buttons, colours, layout). UX is what users FEEL (ease of use, navigation, satisfaction).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget about mobile responsiveness. More than 60% of web traffic now comes from mobile devices. If your site isn\'t mobile-friendly, you\'re losing visitors.',
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
            <FolderTree size={14} className="inline mr-1" /> LEARNING OUTCOME 2
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Sitemaps, UI/UX &{' '}
            <span className="text-sky-300 font-bold italic">
              Website Planning
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master sitemaps, user interface design, layout principles, budgets, timelines, technology outlines, and framework selection.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> Sitemaps
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Palette size={14} className="inline mr-1" /> UI/UX Design
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Rocket size={14} className="inline mr-1" /> Frameworks
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
                placeholder="Search for a concept, sitemap, UI, framework..."
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
            {/* Section 1: Sitemap */}
            <div
              ref={(el) => {
                sectionRefs.current['sitemap'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sitemap
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A sitemap is a hierarchical list of all the pages on a website. It provides a structured overview of the website's content, making it easier for both search engines and users to navigate.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Purpose of Sitemaps</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Improved Search Engine Visibility:</strong> Search engines use sitemaps to crawl and index pages efficiently.</li>
                  <li><strong>Enhanced User Experience:</strong> Users can understand the website's structure and find information quickly.</li>
                  <li><strong>Content Management:</strong> Helps manage and organize content, ensuring all pages are accessible.</li>
                  <li><strong>SEO Benefits:</strong> Ensures all important pages are indexed by search engines.</li>
                  <li><strong>Accessibility:</strong> Provides a clear overview of the site's structure for users with disabilities.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Types of Sitemaps</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>XML Sitemap:</strong> A file listing all URLs with metadata (last modified, change frequency, priority). Used by search engines.</li>
                  <li><strong>HTML Sitemap:</strong> A human‑readable version designed to help users navigate the website. Typically linked from the footer.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Sitemap Generator Tools</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Google Search Console:</strong> Free tool to create and submit XML sitemaps.</li>
                  <li><strong>XML-Sitemaps.com:</strong> Online tool for both XML and HTML sitemaps.</li>
                  <li><strong>Yoast SEO (WordPress):</strong> Automatically generates XML sitemaps for WordPress sites.</li>
                  <li><strong>Screaming Frog SEO Spider:</strong> Powerful tool for XML sitemap generation and site analysis.</li>
                </ul>
              </div>
            </div>

            {/* Section 2: UI/UX Guidelines */}
            <div
              ref={(el) => {
                sectionRefs.current['ui-ux'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Guidelines for UI &amp; UX Design
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  UI design and UX are essential for a successful website. UI focuses on the visual interface; UX focuses on the overall experience.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Key Guidelines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Consistency',
                    'Clarity',
                    'Simplicity',
                    'Hierarchy',
                    'Navigation',
                    'Accessibility',
                    'Responsiveness',
                    'Speed',
                    'Usability Testing',
                    'Iterative Design',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Key Distinction:</span> UI is what users SEE (buttons, colours, layout). UX is what users FEEL (ease of use, navigation, satisfaction).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Website Layout */}
            <div
              ref={(el) => {
                sectionRefs.current['layout'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Layout
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Website layout refers to the arrangement of elements on a web page. A well-designed layout significantly impacts user experience.
                </p>
                <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-3">Features of a Good Layout</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Balance',
                    'Alignment',
                    'Proximity',
                    'Contrast',
                    'Whitespace',
                    'Typography',
                    'Color Scheme',
                    'Hierarchy',
                    'Navigation',
                    'Responsiveness',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Budget */}
            <div
              ref={(el) => {
                sectionRefs.current['budget'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Budget
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A budget is a financial plan outlining estimated costs and revenues for a project. It helps allocate resources effectively and ensures the project stays within financial constraints.
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { item: 'Development Costs', desc: 'Developer and designer fees' },
                    { item: 'Hosting & Domain', desc: 'Server costs and domain registration' },
                    { item: 'Content Creation', desc: 'Writing, images, video production' },
                    { item: 'Maintenance', desc: 'Ongoing updates and support' },
                    { item: 'Marketing', desc: 'SEO, advertising, promotion' },
                    { item: 'Contingency', desc: 'Buffer for unexpected costs' },
                  ].map(({ item, desc }) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item}</span>
                      <p className="text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Project Timelines */}
            <div
              ref={(el) => {
                sectionRefs.current['timeline'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Project Timelines
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A timeline is a visual representation of the project schedule, showing start and end dates for each task or milestone.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Characteristics of a Good Timeline</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Clear and concise</li>
                  <li>Realistic duration estimates</li>
                  <li>Flexible to accommodate changes</li>
                  <li>Visual representation (e.g., Gantt chart)</li>
                  <li>Detailed with specific dates and dependencies</li>
                  <li>Communicated to all stakeholders</li>
                  <li>Updated regularly</li>
                  <li>Aligned with project goals</li>
                </ul>
              </div>
            </div>

            {/* Section 6: Technology and Content Outline */}
            <div
              ref={(el) => {
                sectionRefs.current['tech-outline'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Technology &amp; Content Outline
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A technology and content outline defines the technical requirements and content strategy for a web development project.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Key Components</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Technology Stack',
                    'Content Strategy',
                    'Wireframes & Mockups',
                    'Technical Specifications',
                    'Content Calendar',
                    'SEO Strategy',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">How It's Done</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Gather Requirements from the client</li>
                  <li>Define Technology Stack based on needs</li>
                  <li>Develop Content Strategy and calendar</li>
                  <li>Create Wireframes and Mockups</li>
                  <li>Write Technical Specifications</li>
                  <li>Implement SEO Strategy</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Desktop vs Mobile */}
            <div
              ref={(el) => {
                sectionRefs.current['desktop-mobile'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Desktop vs Mobile Websites
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Desktop</th>
                      <th className="border p-2 text-left font-bold">Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Screen Size', 'Larger', 'Smaller'],
                      ['Input Method', 'Keyboard and mouse', 'Touchscreen'],
                      ['Navigation', 'Complex menus', 'Simplified (hamburger, bottom nav)'],
                      ['Content Layout', 'More space for images/text', 'Smaller, focused layout'],
                      ['Interaction', 'Precise mouse clicks', 'Touch gestures'],
                      ['Loading Speed', 'Generally faster', 'Requires optimisation'],
                      ['User Behavior', 'Longer sessions, complex tasks', 'Shorter sessions, simple tasks'],
                      ['Design Priority', 'Screen real estate, detail', 'Readability, touch-friendliness, speed'],
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

            {/* Section 8: Website Framework */}
            <div
              ref={(el) => {
                sectionRefs.current['framework'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Framework
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A website framework is a pre-built structure that provides tools, libraries, and guidelines to streamline development.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Why Use a Framework?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Efficiency',
                    'Consistency',
                    'Scalability',
                    'Security',
                    'Community Support',
                    'SEO Optimization',
                    'Cross-Browser Compatibility',
                    'Simplified Maintenance',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">Evaluating Frameworks</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Learning Curve:</span> How easy is it to learn?</li>
                  <li><span className="font-bold">Features:</span> Does it meet your project requirements?</li>
                  <li><span className="font-bold">Community Support:</span> Is there active community and resources?</li>
                  <li><span className="font-bold">Performance:</span> Speed and efficiency.</li>
                  <li><span className="font-bold">Scalability:</span> Can it handle growth?</li>
                  <li><span className="font-bold">Security:</span> Built-in security features.</li>
                  <li><span className="font-bold">Cost:</span> Licensing and development costs.</li>
                  <li><span className="font-bold">Integration:</span> How well does it work with other tools?</li>
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
                  <span>Sitemap Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>UI/UX Guidelines</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Good website planning covers sitemaps (XML and HTML), UI/UX guidelines, layout principles, budgets, timelines, technology outlines, and framework selection. Always consider both desktop and mobile users. A well-structured sitemap helps both search engines and users navigate effectively.
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
                <strong className="text-white">Sitemaps</strong> – XML for search engines, HTML for users. Both improve visibility and navigation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">UI/UX Design</strong> – UI is what users SEE (buttons, colours); UX is what users FEEL (ease, satisfaction). Both are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Layout &amp; Budget</strong> – Good layout uses balance, alignment, contrast, and whitespace. Budget covers development, hosting, content, and contingency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Desktop vs Mobile</strong> – Different screen sizes, input methods, and user behaviours. Mobile-first design is now essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Frameworks</strong> – Provide efficiency, consistency, security, and community support. Evaluate based on learning curve, features, and scalability.
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
            Sidemann Academic Registry • Website Planning – Sitemaps &amp; UI/UX 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;