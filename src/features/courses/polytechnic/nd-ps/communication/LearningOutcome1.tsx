import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  SearchIcon,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Type,
  BookOpen,
  LayersIcon,
  FileText,
  Scissors,
  CircleIcon,
  Archive,
  Database,
  DollarSign,
  Users,
  Wrench,
  BarChart,
  MessageSquare,
  Calendar,
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
  Link2,
  Zap,
  Globe,
  FileCode,
  FolderTree as FolderTreeIcon,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  BookOpen as BookOpenIcon,
  FileText as FileTextIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'reports', label: 'Written Reports' },
  { id: 'transmitting', label: 'Transmitting Information' },
  { id: 'submitting', label: 'Submit on Time' },
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
        text: 'The first written reports date back to ancient Mesopotamia, where scribes recorded grain harvests and trade transactions on clay tablets.',
      },
      {
        title: 'Pro Tip',
        text: 'Always tailor your communication medium to your audience. Senior executives often prefer concise summaries, while technical teams may need detailed data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 key aspects of written reports: Clarity, Accuracy, Purpose, Structure, Visual Aids, KPIs, Recommendations, and Regular Schedules.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse urgency with importance. A message may be important but not urgent – choose the medium accordingly.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first written reports date back to ancient Mesopotamia, where scribes recorded grain harvests and trade transactions on clay tablets.',
      },
      {
        title: 'Pro Tip',
        text: 'Always tailor your communication medium to your audience. Senior executives often prefer concise summaries, while technical teams may need detailed data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 8 key aspects of written reports: Clarity, Accuracy, Purpose, Structure, Visual Aids, KPIs, Recommendations, and Regular Schedules.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse urgency with importance. A message may be important but not urgent – choose the medium accordingly.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Written Reports &{' '}
            <span className="text-emerald-300 font-bold italic">
              Effective Communication
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to producing written reports, transmitting information using proper media, and submitting to stakeholders on time.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Written Reports
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MessageSquare size={14} className="inline mr-1" /> Communication
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Timely Submission
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
                placeholder="Search for a concept, clarity, media, deadlines..."
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
            {/* SECTION 1: PRODUCING EFFECTIVE WRITTEN REPORTS */}
            <div
              ref={(el) => {
                sectionRefs.current['reports'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Producing Effective Written Reports
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Producing written reports is a fundamental practice for disseminating information effectively and maintaining transparency. These reports serve as formal documents that communicate key findings, analyses, recommendations, and performance metrics to stakeholders. They are not simply summaries of data; they are strategic tools that facilitate informed decision-making, track progress, and ensure accountability.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Producing well-structured and informative written reports is essential for effective communication and collaboration within the purchasing and supply management function.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Here's a breakdown of the key aspects of producing effective written reports:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Type size={16} /> Clarity and Conciseness
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Written reports should be clear, concise, and easy to understand. This involves using plain language, avoiding jargon, and structuring the report logically. The report should focus on the key information and avoid unnecessary details. The report should have a clear executive summary.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Target size={16} /> Accuracy and Reliability of Data
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The data presented in the report must be accurate and reliable. This involves verifying data sources, ensuring data integrity, and using appropriate data analysis techniques. Any assumptions or limitations should be clearly stated. Accurate data is essential for building credibility and making informed decisions. All data sources, should be referenced.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Users size={16} /> Purpose and Audience Definition
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Before writing the report, it's crucial to define its purpose and identify the target audience. The purpose of the report will determine the content and format, while the audience will influence the level of detail and the language used. Tailoring the report to the specific needs of the audience ensures that the information is relevant and impactful.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Layout size={16} /> Structured Format and Logical Flow
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Written reports should follow a structured format with a logical flow. This typically includes an introduction, a methodology section, findings, analysis, conclusions, and recommendations. The introduction should provide context and state the purpose of the report. The methodology section should explain how the data was collected and analyzed. The findings section should present the key results, and the analysis section should interpret these results. The conclusions should summarize the key takeaways, and the recommendations should outline proposed actions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <BarChart size={16} /> Use of Visual Aids
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Visual aids, such as charts, graphs, and tables, can enhance the clarity and impact of written reports. These aids can help to present complex data in a more accessible format. However, it's essential to ensure that visual aids are clear, accurate, and relevant to the content of the report. All visual aids should be clearly labeled.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <ListChecks size={16} /> Focus on Key Performance Indicators (KPIs)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Reports should focus on key performance indicators (KPIs) that are relevant to the purchasing and supply management function. This might include metrics such as cost savings, supplier performance, inventory turnover, and order fulfillment rates. Presenting KPIs in a clear and concise manner allows stakeholders to track progress and assess performance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> Actionable Recommendations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Written reports should include actionable recommendations that are based on the analysis of data. These recommendations should be specific, measurable, achievable, relevant, and time-bound (SMART). Actionable recommendations provide a clear path forward and facilitate implementation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Calendar size={16} /> Regular Reporting Schedules
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Establishing regular reporting schedules ensures that information is disseminated in a timely manner. This might involve producing daily, weekly, monthly, or quarterly reports, depending on the needs of the organization. Consistent reporting allows for ongoing monitoring of performance and facilitates proactive decision-making.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Edit size={16} /> Proofreading and Editing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Before submitting the report, it's essential to proofread and edit it carefully. This involves checking for grammatical errors, spelling mistakes, and inconsistencies. Proofreading ensures that the report is professional and error-free.
                </p>
              </div>
            </div>

            {/* SECTION 2: TRANSMITTING INFORMATION USING PROPER MEDIA */}
            <div
              ref={(el) => {
                sectionRefs.current['transmitting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transmitting Information Using Proper Media
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In purchasing and supply management, effective communication is paramount. This hinges on transmitting information using the proper media, which means selecting the most suitable channel for conveying specific messages to intended recipients. It's not a one-size-fits-all approach; it's a strategic decision based on the nature of the information, the urgency, the audience, and the desired outcome. Choosing the right media ensures clarity, efficiency, and minimizes misunderstandings.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Here's a breakdown of the key aspects of transmitting information using proper media:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> Understanding the Nature of the Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The type of information being transmitted dictates the most appropriate medium. For example:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Complex data or detailed reports:</strong> Written reports, presentations, or shared documents are best.</li>
                  <li><strong>Urgent updates or quick questions:</strong> Instant messaging, phone calls, or short emails are more efficient.</li>
                  <li><strong>Visual information or demonstrations:</strong> Presentations, videos, or shared screens are ideal.</li>
                  <li><strong>Formal contracts or legal documents:</strong> Paper documents or secure digital signatures are often required.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Users size={16} /> Identifying the Target Audience
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Knowing the audience is crucial for selecting the right medium. Consider their:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Preferences:</strong> Some may prefer email, while others may be more responsive to phone calls or instant messages.</li>
                  <li><strong>Technical capabilities:</strong> Ensure the chosen medium is accessible and usable by the audience.</li>
                  <li><strong>Location and availability:</strong> Consider time zones and availability when selecting a communication method.</li>
                  <li><strong>Level of formality required:</strong> Some audiences require formal written communication.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <ClockIcon size={16} /> Considering the Urgency of the Message
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Time-sensitive information requires immediate communication. In such cases:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Phone calls or instant messaging:</strong> Provide instant communication.</li>
                  <li><strong>Emails:</strong> Offer a relatively quick response, but not as immediate as phone calls.</li>
                  <li><strong>Written reports or formal presentations:</strong> Are not suitable for urgent matters.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <LayersIcon size={16} /> Choosing the Appropriate Communication Channel
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Various communication channels are available, each with its strengths and weaknesses:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Email:</strong> Suitable for formal communication, detailed information, and asynchronous communication.</li>
                  <li><strong>Instant Messaging:</strong> Ideal for quick questions, urgent updates, and informal communication.</li>
                  <li><strong>Phone Calls:</strong> Provide immediate feedback and allow for direct conversation.</li>
                  <li><strong>Video Conferencing:</strong> Facilitates face-to-face communication, especially for remote teams or complex discussions.</li>
                  <li><strong>Written Reports:</strong> Offer detailed information, formal documentation, and a record of communication.</li>
                  <li><strong>Presentations:</strong> Effective for conveying complex information, visual aids, and interactive discussions.</li>
                  <li><strong>Shared Documents/Cloud based platforms:</strong> Effective for collaborative work.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <SearchIcon size={16} /> Ensuring Clarity and Accuracy
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Regardless of the chosen medium, the information transmitted must be clear, accurate, and concise. This involves:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Using plain language and avoiding jargon.</li>
                  <li>Proofreading written communications for errors.</li>
                  <li>Organizing information logically.</li>
                  <li>Providing context and background information.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Archive size={16} /> Maintaining a Record of Communication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  It's essential to maintain a record of communication, especially for important decisions or agreements. This might involve:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Saving emails and instant messages.</li>
                  <li>Documenting phone calls and meetings.</li>
                  <li>Storing written reports and presentations.</li>
                  <li>Using a centralized document management system.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Shield size={16} /> Security Considerations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  When transmitting sensitive data, ensure the chosen medium is secure. This may involve:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Encrypting emails or files.</li>
                  <li>Using secure messaging platforms.</li>
                  <li>Adhering to data privacy regulations.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Feedback and Follow-up
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Encourage feedback and follow-up to ensure that the information has been received and understood. This helps to clarify any misunderstandings and ensures that actions are taken as needed.
                </p>
              </div>
            </div>

            {/* SECTION 3: SUBMIT TO STAKEHOLDERS ON TIME */}
            <div
              ref={(el) => {
                sectionRefs.current['submitting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Submit to Stakeholders On Time
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In the dynamic realm of purchasing and supply management, timely information dissemination is paramount. Submitting reports, analyses, and updates to stakeholders "on time" is not merely a matter of meeting deadlines; it's a critical practice that fosters trust, enables informed decision-making, and ensures the smooth flow of operations. Late submissions can lead to missed opportunities, delayed projects, and strained relationships with stakeholders. Delivering information promptly demonstrates professionalism, reliability, and a commitment to keeping stakeholders informed and engaged.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Here's a breakdown of the key aspects of submitting information to stakeholders on time:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Calendar size={16} /> Establishing Clear Deadlines and Schedules
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The foundation of timely submissions lies in establishing clear deadlines and schedules. This involves creating a calendar of reporting requirements, identifying key milestones, and communicating these deadlines to all relevant parties. These deadlines should be realistic and achievable, taking into account the complexity of the information being prepared. Regular updates and reminders can help to keep everyone on track. This also includes defining who is responsible for each submission. A well-defined schedule, prevents last minute rushes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Target size={16} /> Prioritization and Time Management
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Effective prioritization and time management are essential for meeting deadlines. This involves identifying the most critical tasks and allocating sufficient time for their completion. Breaking down large tasks into smaller, manageable steps can help to improve efficiency. Utilizing time management tools, such as calendars, task lists, and project management software, can further enhance productivity. It is vital to avoid procrastination.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <FileText size={16} /> Preparation of High-Quality Information in Advance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Rushing to prepare information at the last minute can lead to errors and omissions. It's crucial to begin preparing reports and analyses well in advance of deadlines. This allows for thorough data collection, analysis, and review. Preparing templates, and standard operating procedures, will greatly aid in quicker report generation. Preperation also allows for time to get the information reviewed.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Utilizing Technology for Efficiency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Technology can play a significant role in improving the efficiency of information preparation and submission. This might involve using automated reporting tools, data analytics software, and cloud-based collaboration platforms. These tools can help to streamline workflows, reduce manual effort, and minimize the risk of errors. Automatic reminders, and notifications, are also helpful.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Maintaining Open Communication with Stakeholders
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  If unforeseen circumstances arise that may impact deadlines, it's crucial to maintain open communication with stakeholders. This involves promptly informing them of any potential delays and providing regular updates on progress. Transparency and proactive communication can help to mitigate any negative impact of delays. Even if there are no delays, regular communication is important.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <ListChecks size={16} /> Regular Review and Improvement of Processes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Regularly reviewing and improving processes can help to ensure that deadlines are consistently met. This involves analyzing past performance, identifying bottlenecks, and implementing corrective actions. Seeking feedback from stakeholders can also provide valuable insights for process improvement. The review process, should be documented.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Shield size={16} /> Establishing a Culture of Accountability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Creating a culture of accountability can help to ensure that deadlines are taken seriously. This involves clearly defining roles and responsibilities, setting performance expectations, and providing regular feedback. A culture of accountability promotes a sense of ownership and encourages timely completion of tasks.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Archive size={16} /> Contingency Planning
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  It is always a good idea to have a contingency plan in place. Things like technical issues, or staff shortages, can cause delays. Having a plan in place, will allow for a quick response, and reduce the impact of the delay.
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
                  💡 Communication Insight
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
                  <span>Report Key Aspects</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Media Channels</span>
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
                Effective reports are clear, accurate, and tailored to the audience. Choose the right medium based on urgency, audience, and information type. Timely submission builds trust and ensures smooth operations. Master these principles to become a professional communicator in any organisation.
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
                <strong className="text-white">Written Reports</strong> – must be clear, accurate, audience-focused, structured, and include visual aids, KPIs, actionable recommendations, and be proofread.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transmitting Information</strong> – choose the right medium based on information type, audience, urgency, and security needs. Record and follow up.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Timely Submission</strong> – set clear deadlines, prioritise, prepare in advance, use technology, communicate proactively, review processes, and build a culture of accountability.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
