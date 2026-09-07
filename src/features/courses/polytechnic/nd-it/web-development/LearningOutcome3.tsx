import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Code,
  GitBranch,
  Wrench,
  Bug,
  TestTube,
  Rocket,
  Users,
  Puzzle,
  LayoutTemplate,
  Sparkles,
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  Database,
  Shield,
  Gauge,
  Smartphone,
  Accessibility,
  BookOpen,
  Search,
  X as XIcon,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Layers,
  Link2,
  Zap,
  Globe,
  Target,
  ClipboardList,
  HardDrive,
  Server,
  Settings,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  GitBranch as GitBranchIcon,
  Terminal,
  Table,
  Box,
  Play,
  Palette,
  FolderTree,
  UserCheck,
  FileCode,
  GraduationCap,
  DollarSign,
  Briefcase,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'dev-tools', label: 'Dev Tools' },
  { id: 'evaluate-tools', label: 'Evaluate Tools' },
  { id: 'templates', label: 'Templates' },
  { id: 'ai-design', label: 'AI in Design' },
  { id: 'prototypes', label: 'Prototypes' },
  { id: 'content-plan', label: 'Content Plan' },
  { id: 'qa-process', label: 'QA Process' },
  { id: 'database', label: 'Database Requirements' },
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
        text: 'The first website was created by Tim Berners-Lee in 1991 using a NeXT computer. It was a simple text page explaining the World Wide Web project.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use version control (Git) for your web projects. It allows you to track changes, collaborate with others, and revert to previous versions if something breaks.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the QA process as "P-T-E-D-R-T-C": Planning, Test Case Design, Environment Setup, Execution, Defect Reporting, Retesting, Closure.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip prototyping. A prototype helps you catch design flaws and usability issues before you invest time and money in full development.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first website was created by Tim Berners-Lee in 1991 using a NeXT computer. It was a simple text page explaining the World Wide Web project.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use version control (Git) for your web projects. It allows you to track changes, collaborate with others, and revert to previous versions if something breaks.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the QA process as "P-T-E-D-R-T-C": Planning, Test Case Design, Environment Setup, Execution, Defect Reporting, Retesting, Closure.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip prototyping. A prototype helps you catch design flaws and usability issues before you invest time and money in full development.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> LEARNING OUTCOME 3
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Web Dev Tools, Templates &{' '}
            <span className="text-purple-300 font-bold italic">
              Quality Assurance
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master development tools, website templates, AI in design, prototyping, content planning, QA processes, and database requirements.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> Dev Tools
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <LayoutTemplate size={14} className="inline mr-1" /> Templates &amp; AI
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="inline mr-1" /> QA Process
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
                placeholder="Search for a concept, QA, prototyping..."
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
            {/* Section 1: Features of a Web Development Tool */}
            <div
              ref={(el) => {
                sectionRefs.current['dev-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Features of a Web Development Tool
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Web development tools help developers write, test, and deploy code efficiently. A good development tool combines an editor, version control, debugging, and deployment features.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { icon: <FileCode size={14} />, label: 'Code Editor' },
                    { icon: <GitBranch size={14} />, label: 'Version Control' },
                    { icon: <Wrench size={14} />, label: 'Build Automation' },
                    { icon: <Bug size={14} />, label: 'Debugging' },
                    { icon: <TestTube size={14} />, label: 'Testing Framework' },
                    { icon: <Rocket size={14} />, label: 'Deployment Tools' },
                    { icon: <Users size={14} />, label: 'Collaboration Features' },
                    { icon: <Puzzle size={14} />, label: 'Extensions & Plugins' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="text-orange-500">{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Evaluating Web Development Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluate-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating Web Development Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  When choosing a web development tool, consider these factors:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    { label: 'Language Support', desc: 'Supports your chosen languages and frameworks' },
                    { label: 'Features', desc: 'Meets your specific development needs' },
                    { label: 'Ease of Use', desc: 'Learning curve and intuitiveness' },
                    { label: 'Community', desc: 'Active community for support and resources' },
                    { label: 'Performance', desc: 'Speed and efficiency' },
                    { label: 'Cost', desc: 'Licensing and additional costs' },
                    { label: 'Integration', desc: 'Works with other tools and technologies' },
                    { label: 'Scalability', desc: 'Handles large projects and growing teams' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{label}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Website Template */}
            <div
              ref={(el) => {
                sectionRefs.current['templates'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Template
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A website template is a pre-designed framework that provides structure and layout for a website, including headers, footers, navigation, and content sections.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Characteristics of a Good Template</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Responsiveness',
                    'Customization',
                    'SEO-Friendly',
                    'Ease of Use',
                    'CMS Compatibility',
                    'Fast Loading Speed',
                    'Accessibility (WCAG)',
                    'Modern Design',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Using AI in Website Template Design */}
            <div
              ref={(el) => {
                sectionRefs.current['ai-design'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Using AI in Website Template Design
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Benefits</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Efficiency:</span> Automates design generation and optimization.</li>
                    <li><span className="font-bold">Personalization:</span> Creates tailored templates based on user data.</li>
                    <li><span className="font-bold">Accessibility:</span> Ensures compliance with WCAG guidelines.</li>
                    <li><span className="font-bold">Creativity:</span> Generates innovative design ideas.</li>
                    <li><span className="font-bold">Optimization:</span> Improves speed, UX, and SEO.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Drawbacks</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Lack of Human Touch:</span> May miss creativity and nuance.</li>
                    <li><span className="font-bold">Overreliance:</span> Can reduce critical thinking.</li>
                    <li><span className="font-bold">Technical Limits:</span> May not understand complex concepts.</li>
                    <li><span className="font-bold">Ethical Concerns:</span> Bias, privacy, job displacement.</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Key Takeaway:</span> Combine AI with human expertise for the best results. AI accelerates design, but human creativity ensures quality and originality.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Defining a Website Prototype */}
            <div
              ref={(el) => {
                sectionRefs.current['prototypes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Defining a Website Prototype
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A website prototype is a preliminary version that allows stakeholders to visualize and interact with the design before development begins.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Creating a Prototype from a Wireframe</h4>
                <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Choose a prototyping tool:</span> Figma, Adobe XD, InVision, Balsamiq.</li>
                  <li><span className="font-bold">Import the wireframe:</span> Digital wireframes can be imported directly.</li>
                  <li><span className="font-bold">Add visual elements:</span> Images, colours, fonts, and other design elements.</li>
                  <li><span className="font-bold">Create interactions:</span> Define button actions, navigation, and animations.</li>
                  <li><span className="font-bold">Test and iterate:</span> Gather feedback and refine the prototype.</li>
                </ol>
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    <CheckCircle size={14} className="inline mr-1" />
                    Prototyping catches design flaws and usability issues early, saving time and money.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Website Content Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['content-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Defining a Website Content Plan
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A website content plan outlines the goals, target audience, topics, formats, and schedule for creating and publishing content.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">Steps to Create a Content Plan</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Define Goals:</span> Increase traffic, generate leads, build awareness.</li>
                  <li><span className="font-bold">Identify Target Audience:</span> Demographics, interests, needs.</li>
                  <li><span className="font-bold">Research Keywords:</span> Find relevant search terms.</li>
                  <li><span className="font-bold">Create Content Calendar:</span> Schedule publication dates.</li>
                  <li><span className="font-bold">Determine Content Types:</span> Blogs, videos, infographics.</li>
                  <li><span className="font-bold">Assign Responsibilities:</span> Who creates and edits content.</li>
                  <li><span className="font-bold">Set Quality Standards:</span> Style, tone, accuracy.</li>
                  <li><span className="font-bold">Measure and Analyze:</span> Track performance with analytics.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Quality Assurance Process */}
            <div
              ref={(el) => {
                sectionRefs.current['qa-process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Quality Assurance Process
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Quality assurance ensures the website meets defined quality standards and provides a positive user experience.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Requirements</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Clear Objectives:</span> Define quality standards and goals.</li>
                  <li><span className="font-bold">Comprehensive Testing:</span> Identify and address defects.</li>
                  <li><span className="font-bold">Documentation:</span> Test cases, results, defect reports.</li>
                  <li><span className="font-bold">Communication:</span> Between dev, QA, and stakeholders.</li>
                  <li><span className="font-bold">Continuous Improvement:</span> Regular process refinement.</li>
                </ul>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">QA Steps</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Test Planning',
                    'Test Case Design',
                    'Test Environment Setup',
                    'Test Execution',
                    'Defect Reporting',
                    'Defect Retesting',
                    'Test Closure',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "P-T-E-D-R-T-C" – Planning, Test Design, Environment, Execution, Defect Reporting, Retesting, Closure.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8: Database and Data Structures Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['database'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database &amp; Data Structures Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Database size={16} /> Data Integrity &amp; Consistency
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Data Validation:</span> Ensure only valid data enters the database.</li>
                    <li><span className="font-bold">Data Normalization:</span> Reduce redundancy and improve integrity.</li>
                    <li><span className="font-bold">Data Consistency:</span> Maintain consistency across the application.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Gauge size={16} /> Performance &amp; Scalability
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Indexing:</span> Optimize database queries with indexes.</li>
                    <li><span className="font-bold">Query Optimization:</span> Analyze and enhance query performance.</li>
                    <li><span className="font-bold">Scalability:</span> Design for future growth and data volumes.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield size={16} /> Security
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Access Control:</span> Protect sensitive data from unauthorized access.</li>
                    <li><span className="font-bold">Encryption:</span> Encrypt sensitive data for added security.</li>
                    <li><span className="font-bold">Backup &amp; Recovery:</span> Reliable plan to protect against data loss.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Link2 size={16} /> Integration &amp; Quality
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">APIs:</span> Define integration points with other systems.</li>
                    <li><span className="font-bold">Data Exchange:</span> Establish protocols for external data exchange.</li>
                    <li><span className="font-bold">Data Cleansing:</span> Correct inaccurate or incomplete data.</li>
                    <li><span className="font-bold">Data Governance:</span> Policies for managing data quality.</li>
                  </ul>
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
                  <span>QA Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Dev Tool Features</span>
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
                Good web development tools boost productivity and code quality. Templates save time but require customization. AI can accelerate design but needs human oversight. Prototyping catches issues early. Quality Assurance is non-negotiable for professional websites. Database design must prioritize integrity, security, and performance.
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
                <strong className="text-white">Dev Tools</strong> – combine code editors, version control, debugging, testing, and deployment features for efficient development.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Templates &amp; AI</strong> – templates provide structure; AI can automate design and optimization, but human oversight remains essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prototypes</strong> – create prototypes from wireframes to catch design and usability issues before development begins.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">QA Process</strong> – follows 7 steps: Planning → Test Design → Environment → Execution → Defect Reporting → Retesting → Closure.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database Design</strong> – prioritise data integrity, performance, security, and integration for robust web applications.
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
            Sidemann Academic Registry • Web Dev Tools &amp; QA 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;