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
  Layout,
  Server,
  HardDrive,
  Wifi,
  Lock,
  FolderKanban,
  UserCheck,
  FileCode,
  GraduationCap,
  Calendar,
  DollarSign,
  Briefcase,
  Lightbulb,
  Rocket,
  BookOpen,
  X as XIcon,
  Sparkles,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
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
  PenTool,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'purpose', label: 'Purpose & Goals' },
  { id: 'audience', label: 'Target Audience' },
  { id: 'content', label: 'Content' },
  { id: 'work-plan', label: 'Work Plan' },
  { id: 'feasibility', label: 'Feasibility' },
  { id: 'team-roles', label: 'Team Roles' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'documents', label: 'Supporting Docs' },
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
        text: 'The first website was created by Tim Berners-Lee in 1991. It was a simple text-based page explaining the World Wide Web project.',
      },
      {
        title: 'Pro Tip',
        text: 'Always define SMART goals for your website: Specific, Measurable, Achievable, Relevant, and Time-bound. This makes success measurable.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 stages of website planning: Purpose → Audience → Content → Structure → Design → Launch.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the feasibility study. Many website projects fail because they weren\'t properly assessed for technical, economic, or operational viability.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first website was created by Tim Berners-Lee in 1991. It was a simple text-based page explaining the World Wide Web project.',
      },
      {
        title: 'Pro Tip',
        text: 'Always define SMART goals for your website: Specific, Measurable, Achievable, Relevant, and Time-bound. This makes success measurable.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 6 stages of website planning: Purpose → Audience → Content → Structure → Design → Launch.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the feasibility study. Many website projects fail because they weren\'t properly assessed for technical, economic, or operational viability.',
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
            <Globe size={14} className="inline mr-1" /> LEARNING OUTCOME 1
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Website{' '}
            <span className="text-emerald-300 font-bold italic">
              Planning &amp; Analysis
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master the fundamentals of website purpose, business goals, target audience identification, content creation, work plans, feasibility studies, and team structures.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Strategic Goals
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Audience Focus
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Project Planning
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
                placeholder="Search for a concept, feasibility, audience..."
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
            {/* Section 1: Purpose of a Website & Business Goals */}
            <div
              ref={(el) => {
                sectionRefs.current['purpose'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Website Purpose &amp; Business Goals
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A website is like a digital storefront or brochure for an organization. It's where people learn about what the organization does, its products or services, and how to get in touch.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Why Organizations Need Websites</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Visibility:</strong> Websites make organisations visible to a wider audience.</li>
                  <li><strong>Credibility:</strong> A well-designed website enhances professionalism.</li>
                  <li><strong>Information Hub:</strong> Central repository for news, events, contact details.</li>
                  <li><strong>Customer Service:</strong> FAQs, contact forms, online support.</li>
                  <li><strong>Marketing and Sales:</strong> E-commerce, newsletters, social media integration.</li>
                  <li><strong>Networking:</strong> Connect with other individuals and organisations.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Identifying Business Goals</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Business goals are specific objectives an organisation wants to achieve through its website. They should align with the overall business strategy.
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Focus',
                    'Measurement',
                    'Alignment',
                    'Prioritisation',
                    'Budget Allocation',
                    'User Experience',
                    'Return on Investment',
                    'Decision Making',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-3">Goal Setting Process</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Conduct thorough analysis (SWOT, competitive, audience research)</li>
                  <li>Define clear SMART objectives</li>
                  <li>Consider key performance indicators (KPIs)</li>
                  <li>Involve stakeholders</li>
                  <li>Refine and iterate continuously</li>
                </ul>
              </div>
            </div>

            {/* Section 2: Target Audience */}
            <div
              ref={(el) => {
                sectionRefs.current['audience'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying the Target Audience
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Target audience refers to the specific group of people that an organization wants to reach with its website.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Ways to Identify Target Audience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Demographic Information',
                    'Psychographic Information',
                    'Behavioral Information',
                    'Customer Research',
                    'Analytics Data',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Why It Matters</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Tailored content that engages users</li>
                  <li>Effective messaging that resonates</li>
                  <li>Better user experience design</li>
                  <li>Focused marketing efforts</li>
                  <li>Higher return on investment</li>
                </ul>
              </div>
            </div>

            {/* Section 3: Website Content */}
            <div
              ref={(el) => {
                sectionRefs.current['content'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Content
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Website content refers to the text, images, videos, and other multimedia elements that make up a website. It's the information visitors see and interact with.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Creating Good Website Content</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Know your audience:</strong> Understand their needs and tailor content accordingly.</li>
                  <li><strong>Define your goals:</strong> Align content with business objectives.</li>
                  <li><strong>Create high-quality content:</strong> Clear, engaging text with high-quality images.</li>
                  <li><strong>Optimise for SEO:</strong> Use relevant keywords and meta descriptions.</li>
                  <li><strong>Regularly update content:</strong> Keep the website fresh and relevant.</li>
                  <li><strong>Use varied formats:</strong> Blog posts, articles, infographics, videos.</li>
                  <li><strong>Promote content:</strong> Share on social media and encourage subscriptions.</li>
                  <li><strong>Track and analyse results:</strong> Use analytics to refine content strategy.</li>
                </ul>
              </div>
            </div>

            {/* Section 4: Work Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['work-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Work Plan
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A work plan is a detailed document outlining the steps, resources, and timeline required to complete a website project.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-3">Importance of Project Planning</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Organisation',
                    'Time Management',
                    'Resource Allocation',
                    'Risk Management',
                    'Communication',
                    'Decision Making',
                    'Measurement',
                    'Accountability',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Characteristics of a Successful Work Plan</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Clear and concise</li>
                  <li>Detailed with task scope and deliverables</li>
                  <li>Realistic timeline and resource estimates</li>
                  <li>Flexible enough to accommodate changes</li>
                  <li>Communicated to all team members</li>
                  <li>Regularly reviewed and updated</li>
                  <li>Measurable goals and objectives</li>
                  <li>Aligned with business goals</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Website Project Plan Template</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Project Overview:</strong> Name, description, goals, scope, timeline, budget</li>
                  <li><strong>Team Members:</strong> List of members and their roles</li>
                  <li><strong>Task Breakdown:</strong> Tasks, descriptions, dependencies, timelines</li>
                  <li><strong>Communication Plan:</strong> Channels, meeting schedule, reporting</li>
                  <li><strong>Risk Management Plan:</strong> Risks and mitigation strategies</li>
                  <li><strong>Deliverables:</strong> List of deliverables and due dates</li>
                  <li><strong>Evaluation and Measurement:</strong> KPIs and evaluation methods</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Example: Masvingo Polytechnic Website Project Plan</h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Task</th>
                        <th className="border p-2 text-left font-bold">Duration</th>
                        <th className="border p-2 text-left font-bold">Start</th>
                        <th className="border p-2 text-left font-bold">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Project Planning', '2 weeks', 'Sep 23', 'Oct 7'],
                        ['Design & Wireframing', '3 weeks', 'Oct 8', 'Oct 28'],
                        ['Content Creation', '4 weeks', 'Oct 29', 'Nov 25'],
                        ['Development', '6 weeks', 'Nov 26', 'Jan 13'],
                        ['Testing', '2 weeks', 'Jan 14', 'Jan 27'],
                        ['Launch', '1 week', 'Jan 28', 'Feb 3'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                          <td className="border p-2">{item[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Item</th>
                        <th className="border p-2 text-left font-bold">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Web Development', '$20,000'],
                        ['Content Creation', '$5,000'],
                        ['Design Services', '$10,000'],
                        ['Hosting & Domain', '$2,000'],
                        ['Contingency', '$3,000'],
                        ['Total', '$40,000'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 5: Feasibility Study */}
            <div
              ref={(el) => {
                sectionRefs.current['feasibility'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Feasibility Study
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A feasibility study determines if a website project is viable and worth pursuing.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">The Feasibility Study Process</h4>
                <ol className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Define Project Scope:</strong> Goals, objectives, audience, features.</li>
                  <li><strong>Conduct Market Research:</strong> Competitors, market preferences, demand.</li>
                  <li><strong>Evaluate Technical Feasibility:</strong> Technology, skills, challenges.</li>
                  <li><strong>Assess Economic Feasibility:</strong> Costs, revenue, ROI.</li>
                  <li><strong>Evaluate Legal Feasibility:</strong> Requirements, legal risks.</li>
                  <li><strong>Consider Organisational Feasibility:</strong> Resources, expertise, alignment.</li>
                  <li><strong>Document Findings:</strong> Report with recommendations.</li>
                </ol>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Exam Tip:</span> The feasibility study is often tested. Remember the key types: Technical, Economic, Operational, Legal, and Schedule.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Team Roles */}
            <div
              ref={(el) => {
                sectionRefs.current['team-roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Development Team Roles
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Users size={16} />, title: 'Project Manager', desc: 'Oversees entire project, ensures schedule, budget, and objectives are met.' },
                  { icon: <FileCode size={16} />, title: 'Web Developer', desc: 'Develops front-end and back-end, coding, design, and functionality.' },
                  { icon: <Layout size={16} />, title: 'Designer', desc: 'Creates visual elements: layout, colours, typography.' },
                  { icon: <FileText size={16} />, title: 'Content Creator', desc: 'Develops and writes website content: text, images, videos.' },
                  { icon: <UserCheck size={16} />, title: 'SME', desc: 'Subject Matter Expert on the specific topic or industry.' },
                  { icon: <PenTool size={16} />, title: 'Copywriter', desc: 'Writes persuasive and engaging copy.' },
                  { icon: <Search size={16} />, title: 'SEO Specialist', desc: 'Optimises website for search engines.' },
                  { icon: <Eye size={16} />, title: 'UX Designer', desc: 'Designs user experience, navigation, and usability.' },
                  { icon: <CheckCircle size={16} />, title: 'QA Tester', desc: 'Tests website for bugs, errors, and usability issues.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                      {icon} {title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Team Structure &amp; Success Factors</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Structure:</strong> Project Manager → Development Team → QA Team → SMEs</li>
                  <li><strong>Hire the right people</strong> with necessary skills</li>
                  <li><strong>Foster collaborative culture</strong> with good communication</li>
                  <li><strong>Provide clear goals</strong> and define roles</li>
                  <li><strong>Offer professional development</strong> opportunities</li>
                  <li><strong>Provide adequate resources</strong> and tools</li>
                  <li><strong>Encourage work-life balance</strong> to avoid burnout</li>
                  <li><strong>Continuously evaluate</strong> and improve performance</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Hardware & Software Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['requirements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware &amp; Software Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <HardDrive size={16} /> Hardware
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Reliable server for traffic and storage</li>
                    <li>Sufficient storage space</li>
                    <li>Stable high-speed internet connection</li>
                    <li>Firewall for security</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Server size={16} /> Software
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Operating System (Linux/Windows)</li>
                    <li>Web Server (Apache/Nginx)</li>
                    <li>Database Management System (MySQL/PostgreSQL)</li>
                    <li>Content Management System (CMS)</li>
                    <li>Programming Languages (HTML, CSS, JavaScript, PHP)</li>
                    <li>Development Tools (IDEs, text editors)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 8: Supporting Documents */}
            <div
              ref={(el) => {
                sectionRefs.current['documents'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Gathering Supporting Documents
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Essential documents to gather from clients for a successful project:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { doc: 'Project Brief', desc: 'Goals, objectives, and scope' },
                    { doc: 'Target Audience Profile', desc: 'Demographics, interests, behaviours' },
                    { doc: 'Existing Website/Competitors', desc: 'Examples the client admires' },
                    { doc: 'Content and Imagery', desc: 'Existing content to be used' },
                    { doc: 'Branding Guidelines', desc: 'Logo, colours, typography' },
                    { doc: 'Technical Requirements', desc: 'System integration, compliance' },
                    { doc: 'Budget and Timeline', desc: 'Financial and time constraints' },
                  ].map(({ doc, desc }) => (
                    <div key={doc} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{doc}</span>
                      <p className="text-slate-600 dark:text-slate-400">{desc}</p>
                    </div>
                  ))}
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
                  💡 Planning Insight
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
                  <span>Key Planning Areas</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Team Roles Covered</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">9</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Successful website planning starts with clear purpose, defined business goals, and a deep understanding of the target audience. A well-structured work plan, thorough feasibility study, and the right team are essential. Don't skip the planning phase — it saves time and money in the long run.
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
                <strong className="text-white">Website Purpose</strong> – websites provide visibility, credibility, information, customer service, marketing, and networking opportunities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Business Goals</strong> – define SMART objectives that align with strategy; use KPIs to measure success.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Target Audience</strong> – understand demographics, psychographics, and behaviours to tailor content and user experience.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Work Plan</strong> – includes project scope, timeline, budget, task breakdown, and risk management; essential for project success.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Feasibility &amp; Team</strong> – assess technical, economic, operational, legal, and schedule feasibility; build a team with complementary skills.
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
            Sidemann Academic Registry • Website Planning &amp; Analysis 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;