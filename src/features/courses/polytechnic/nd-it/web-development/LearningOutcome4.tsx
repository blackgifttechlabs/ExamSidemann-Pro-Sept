import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  SpellCheck,
  Globe,
  Code,
  Layout,
  Server,
  Database,
  Shield,
  BookOpen,
  Link,
  Zap,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Users,
  TrendingUp,
  Search,
  Wifi,
  HardDrive,
  Clock,
  DollarSign,
  Box,
  GitBranch,
  Terminal,
  BookOpen as BookOpenIcon,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Eye,
  Target,
  ClipboardList,
  FileCode,
  FolderTree,
  UserCheck,
  GraduationCap,
  Calendar,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'industry-content', label: 'Industry Content' },
  { id: 'grammar-checks', label: 'Grammar Checks' },
  { id: 'builder-vs-coding', label: 'Builder vs Coding' },
  { id: 'web-tools', label: 'Web Tools' },
  { id: 'database-driven', label: 'Database-Driven' },
  { id: 'tech-docs', label: 'Tech Docs' },
  { id: 'user-docs', label: 'User Docs' },
  { id: 'api', label: 'API' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The first website was created by Tim Berners-Lee in 1991. It was a simple text page explaining the World Wide Web project, and it was hosted on a NeXT computer.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating technical documentation, always consider your audience. User documentation should be simple and step-by-step, while developer documentation can be more technical and detailed.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Static websites = fixed content (like a brochure). Dynamic websites = content that changes (like a blog or e-commerce store).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a CMS (like WordPress) with a website builder. A CMS gives you more control and flexibility, while a website builder is simpler but more restrictive.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first website was created by Tim Berners-Lee in 1991. It was a simple text page explaining the World Wide Web project, and it was hosted on a NeXT computer.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating technical documentation, always consider your audience. User documentation should be simple and step-by-step, while developer documentation can be more technical and detailed.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Static websites = fixed content (like a brochure). Dynamic websites = content that changes (like a blog or e-commerce store).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a CMS (like WordPress) with a website builder. A CMS gives you more control and flexibility, while a website builder is simpler but more restrictive.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> LEARNING OUTCOME 4
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Industry Content, Tools &{' '}
            <span className="text-amber-300 font-bold italic">
              Technical Docs
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master industry‑specific content, grammar checks, website builders vs coding, web development tools, database‑driven sites, technical documentation, and APIs.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Industry Content
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> Dev Tools
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Tech Docs
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
                placeholder="Search for a concept, API, CMS, static vs dynamic..."
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
            {/* Section 1: Industry-Specific Content */}
            <div
              ref={(el) => {
                sectionRefs.current['industry-content'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Industry‑Specific Content
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Industry‑specific content is tailored to a particular audience or niche. It demonstrates expertise, improves relevance, and builds trust with your target audience.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Reasons for Producing Industry‑Specific Content</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Relevance to target audience',
                    'Demonstrates expertise & authority',
                    'SEO benefits with niche keywords',
                    'Networking with professionals',
                    'Customer satisfaction & loyalty',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Grammar and Spelling Checks */}
            <div
              ref={(el) => {
                sectionRefs.current['grammar-checks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Grammar &amp; Spelling Checks
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Grammatical and spelling errors detract from professionalism and credibility. Ensure your content is error‑free with these practices:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    { label: 'Proofread Carefully', desc: 'Read through content to identify mistakes.' },
                    { label: 'Use Checkers', desc: 'Built-in tools or dedicated software for errors.' },
                    { label: 'Hire an Editor', desc: 'Professional editing for important documents.' },
                    { label: 'Read Aloud', desc: 'Catch errors you might miss when reading silently.' },
                    { label: 'Seek Feedback', desc: 'Ask others to review your content.' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{label}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Website Builder vs Coding Yourself */}
            <div
              ref={(el) => {
                sectionRefs.current['builder-vs-coding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Builder vs Coding Yourself
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Website Builder</th>
                      <th className="border p-2 text-left font-bold">Coding Yourself</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Ease of Use', 'Simple and intuitive', 'Requires technical skills'],
                      ['Customization', 'Limited', 'Full control'],
                      ['Cost', 'Often free or subscription', 'Can be more expensive'],
                      ['Time', 'Faster development', 'Can take longer'],
                      ['Flexibility', 'Less flexible', 'Highly flexible'],
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">✅ Website Builder Pros</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Easy to use, no coding required</li>
                    <li>Cost‑effective (often free options)</li>
                    <li>Quick development time</li>
                    <li>User‑friendly visual interface</li>
                    <li>Built‑in features (forms, e‑commerce)</li>
                  </ul>
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mt-3">❌ Website Builder Cons</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Limited customization</li>
                    <li>Vendor lock‑in</li>
                    <li>Performance limitations</li>
                    <li>Less control over code</li>
                    <li>Limited scalability</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">✅ Coding Yourself Pros</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Full control over design & functionality</li>
                    <li>Highly flexible and customizable</li>
                    <li>Scalable for complex projects</li>
                    <li>Cost‑effective in the long run</li>
                    <li>Valuable learning experience</li>
                  </ul>
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mt-3">❌ Coding Yourself Cons</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Time‑consuming</li>
                    <li>Requires strong technical skills</li>
                    <li>Can be expensive with hired developers</li>
                    <li>Steeper learning curve</li>
                    <li>Potential for coding errors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Web Development Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['web-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Development Tools
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <FileCode size={16} />, title: 'HTML', color: 'blue', desc: 'Standard markup language for structuring web content.' },
                  { icon: <Palette size={16} />, title: 'CSS', color: 'purple', desc: 'Style sheet language for layout, design, and appearance.' },
                  { icon: <Server size={16} />, title: 'PHP', color: 'green', desc: 'Server-side scripting for dynamic web pages and databases.' },
                  { icon: <Terminal size={16} />, title: 'JavaScript', color: 'amber', desc: 'Client-side language for interactive and dynamic features.' },
                  { icon: <Box size={16} />, title: 'WordPress', color: 'teal', desc: 'Popular CMS for creating and managing websites.' },
                  { icon: <Database size={16} />, title: 'MySQL', color: 'red', desc: 'Open-source relational database management system.' },
                  { icon: <Server size={16} />, title: 'XAMPP', color: 'indigo', desc: 'Local development stack: Apache, MySQL, PHP, Perl.' },
                ].map(({ icon, title, color, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? `text-${color}-400` : `text-${color}-700`}`}>
                      {icon} {title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Database-Driven Websites */}
            <div
              ref={(el) => {
                sectionRefs.current['database-driven'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database‑Driven Websites
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Static Websites</th>
                      <th className="border p-2 text-left font-bold">Dynamic Websites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Content Creation', 'Manually edited HTML', 'Managed through CMS'],
                      ['Content Updates', 'Manual HTML editing', 'Easy via CMS'],
                      ['Database', 'No database', 'Uses database'],
                      ['User Interaction', 'Limited', 'Interactive (forms, search)'],
                      ['Performance', 'Generally faster', 'May need more server resources'],
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Benefits</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Flexibility – easy content updates</li>
                    <li>Scalability – handle large data & traffic</li>
                    <li>Personalization – tailored content</li>
                    <li>Interactivity – user accounts, comments</li>
                    <li>Search functionality</li>
                    <li>E‑commerce capabilities</li>
                    <li>SEO benefits</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Problems</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>More complex to develop & maintain</li>
                    <li>Requires more server resources</li>
                    <li>Security vulnerabilities</li>
                    <li>Higher development & hosting costs</li>
                    <li>Technical skills required</li>
                    <li>Dependency on database availability</li>
                    <li>Potentially slower load times</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Technical Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['tech-docs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Technical Documentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Technical documentation explains how a product, system, or service works. It serves as a reference for users, developers, and support staff.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">8 Reasons It Matters</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'User Education',
                    'Problem Solving',
                    'Support Efficiency',
                    'Training Resource',
                    'Knowledge Transfer',
                    'Compliance',
                    'Legal Protection',
                    'Development Efficiency',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Key Components</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Introduction', 'Scope', 'Glossary', 'User Guides', 'Reference Manuals', 'Installation Guides', 'Troubleshooting Guides', 'Appendices'].map(item => (
                    <span key={item} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 7: User Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['user-docs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                User Documentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  User documentation provides instructions and guidance for end‑users of a product or system, helping them achieve their desired outcomes.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">8 Reasons It Matters</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'User Education',
                    'Independent Problem Solving',
                    'Reduced Support Burden',
                    'Increased User Satisfaction',
                    'Compliance',
                    'Legal Protection',
                    'Product Adoption',
                    'Knowledge Transfer',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 8: API */}
            <div
              ref={(el) => {
                sectionRefs.current['api'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                API (Application Programming Interface)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  An API is a set of rules and protocols that allow different software applications to communicate and interact. It acts as an intermediary for requesting services from another system.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">How to Interface with an API</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Authentication:</span> Provide credentials (API keys, tokens) to verify identity.</li>
                  <li><span className="font-bold">Making Requests:</span> Construct HTTP requests to the API endpoint.</li>
                  <li><span className="font-bold">Handling Responses:</span> Receive and interpret the API's response (data, errors).</li>
                  <li><span className="font-bold">Error Handling:</span> Implement mechanisms to handle errors or exceptions.</li>
                </ul>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Example:</span> Using the Twitter API requires obtaining API keys, constructing requests to endpoints, and parsing JSON responses.
                  </p>
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
                  💡 Dev Insight
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
                  <span>Web Dev Tools</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Static vs Dynamic</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5 differences</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Industry content builds authority; grammar checks ensure professionalism. Choose between website builders (simplicity) and coding (control) based on your needs. Understand the web development stack (HTML, CSS, PHP, JavaScript, MySQL). Know the difference between static and dynamic websites. Technical and user documentation are essential for adoption and support. APIs enable integration with other systems.
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
                <strong className="text-white">Industry Content</strong> – builds authority, improves SEO, and engages the target audience with relevant information.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Grammar Checks</strong> – proofreading, tools, and feedback ensure professional, error‑free content.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Website Builder vs Coding</strong> – builders offer simplicity and speed; coding offers control and flexibility. Choose based on project needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Web Stack</strong> – HTML (structure), CSS (style), PHP (server), JavaScript (client), MySQL (database), XAMPP (local dev).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation &amp; APIs</strong> – technical docs support developers; user docs help end‑users; APIs enable integration between applications.
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
            Sidemann Academic Registry • Industry Content &amp; Technical Docs 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;