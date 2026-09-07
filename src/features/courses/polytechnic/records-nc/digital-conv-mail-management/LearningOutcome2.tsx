import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Mail,
  MailOpen,
  Shield,
  Megaphone,
  FileCheck,
  ShieldCheck,
  Zap,
  Inbox,
  Send,
  Database,
  Printer,
  Scan,
  Cloud,
  ClipboardList,
  FileTextIcon,
  CalendarIcon,
  BookOpen,
  LinkIcon,
  FolderTree,
  MessageSquare,
  Archive,
  SettingsIcon,
  FilterIcon,
  UsersIcon,
  ArrowRight,
  AtSign,
  Paperclip,
  FolderPlus,
  FolderMinus,
  Reply,
  AlertCircle,
  RefreshCwIcon,
  TrendingUp,
  HeartIcon,
  Lock,
  Building,
  Key,
  EyeIcon,
  ListChecks,
  ClockIcon,
  UserIcon,
  SearchIcon,
  Target,
  XCircle,
  AlignLeft,
  Layout,
  CheckCircle,
  FileText,
  Trash2,
  ClipboardList as ClipboardListIcon,
  BookOpen as BookOpenIcon,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  Clock,
  Hash,
  CheckCircle as CheckCircleIcon,
  RefreshCw as RefreshCwIcon2,
  Sun,
  Thermometer,
  Sofa as Chair,
  Volume2,
  Plug,
  AlertCircle as AlertCircleIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'basic-concepts', label: 'Basic Concepts' },
  { id: 'classes', label: 'Mail Classes' },
  { id: 'policy', label: 'Policy & Guidelines' },
  { id: 'in-out', label: 'Incoming & Outgoing' },
  { id: 'ict', label: 'ICT & Mail' },
  { id: 'sorting', label: 'Sorting & Recording' },
  { id: 'filing', label: 'Organising & Filing' },
  { id: 'control-docs', label: 'Control Docs' },
  { id: 'email-mgmt', label: 'Email Management' },
  { id: 'routing', label: 'Electronic Routing' },
  { id: 'saving', label: 'Saving Emails' },
  { id: 'linked-folders', label: 'Linked Folders' },
  { id: 'send-reply', label: 'Sending & Replying' },
  { id: 'security-benefits', label: 'Security Benefits' },
  { id: 'access-control', label: 'Access Control' },
  { id: 'effective-mail', label: 'Effective Mail' },
  { id: 'suspicious', label: 'Suspicious Mail' },
  { id: 'franking', label: 'Franking' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'inbox-mgmt', label: 'Inbox Management' },
  { id: 'effective-email', label: 'Effective Email' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'The first postage stamp, the Penny Black, was issued in the United Kingdom in 1840 and featured Queen Victoria.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a clear subject line in emails – it helps recipients prioritise and quickly understand the purpose.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five mail classes with "F-C-S-R-E": First‑Class, Certified, Standard, Registered, Express.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations confuse "Reply" and "Reply All" – using Reply All unnecessarily can clutter inboxes and cause information overload.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first postage stamp, the Penny Black, was issued in the United Kingdom in 1840 and featured Queen Victoria.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a clear subject line in emails – it helps recipients prioritise and quickly understand the purpose.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five mail classes with "F-C-S-R-E": First‑Class, Certified, Standard, Registered, Express.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations confuse "Reply" and "Reply All" – using Reply All unnecessarily can clutter inboxes and cause information overload.',
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

  // ─── Helper to render a clean card ──────────────────────────────────────
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Mail size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mail Management —{' '}
            <span className="text-sky-300 font-bold italic">
              Procedures &amp; Security
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to mail classes, processing procedures, ICT integration, email management, security, access control, and best practices for effective mail communication.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Mail size={14} className="inline mr-1" /> Mail
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Inbox size={14} className="inline mr-1" /> Inbox
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
                placeholder="Search for a concept, mail class, procedure..."
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
                  <XIcon size={18} className="text-indigo-200" />
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
            {/* SECTION 1: Basic Concepts in Mail Management */}
            <div
              ref={(el) => {
                sectionRefs.current['basic-concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Concepts in Mail Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Mail management encompasses the processes and procedures involved in receiving, sorting, distributing, and dispatching mail, both physical and electronic. Its core objectives are:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-700 dark:text-slate-300">
                    <li><strong>Efficiency:</strong> Ensuring mail is handled quickly and accurately to minimise delays.</li>
                    <li><strong>Security:</strong> Protecting sensitive information contained in mail from unauthorised access.</li>
                    <li><strong>Organisation:</strong> Maintaining a systematic approach to mail handling for easy retrieval and tracking.</li>
                    <li><strong>Compliance:</strong> Adhering to relevant regulations and organisational policies.</li>
                    <li><strong>Cost-effectiveness:</strong> Optimising mail handling to minimise expenses.</li>
                  </ul>
</div>
            </div>

            {/* SECTION 19: Best Practices for Mail Management */}
            <div
              ref={(el) => {
                sectionRefs.current['best-practices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Best Practices for Mail Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Establish Clear Policies and Procedures',
                    icon: <FileTextIcon size={16} />,
                    content: 'Developing and implementing comprehensive mail management policies and procedures ensures consistency and efficiency. This includes defining protocols for receiving, sorting, distributing, and dispatching mail, as well as guidelines for handling confidential or sensitive information. Clear policies help to minimise errors, reduce delays, and maintain compliance with relevant regulations. Regular reviews and updates of these policies are essential to adapt to changing needs and technologies. This includes making sure all employees understand and follow the policies.',
                  },
                  {
                    title: 'Implement a Centralised Mail System',
                    icon: <Building size={16} />,
                    content: 'Centralising mail processing in a dedicated mailroom or department streamlines operations and improves accountability. This allows for standardised procedures, centralised tracking, and efficient resource allocation. A centralised system also facilitates better control over mail security and ensures that all mail is handled consistently. Using a centralised system also allows for easier tracking of mail, and the ability to find lost or misplaced mail.',
                  },
                  {
                    title: 'Utilise Mail Tracking and Management Systems',
                    icon: <SearchIcon size={16} />,
                    content: 'Implementing mail tracking and management systems enhances visibility and control over mail flow. These systems provide real-time tracking of mail items, automate routing and distribution, and generate reports for analysis. Utilising digital mailroom solutions can further streamline processes by digitising incoming physical mail and integrating with electronic document management systems. This increases the ability to quickly see where a piece of mail is in the system.',
                  },
                  {
                    title: 'Ensure Security and Confidentiality',
                    icon: <Shield size={16} />,
                    content: 'Protecting the security and confidentiality of mail is paramount. This includes implementing access controls, using secure mail services for sensitive items, and training employees on proper handling procedures. Regular security audits and risk assessments help to identify and mitigate potential vulnerabilities. Shredding confidential documents and using encryption for electronic mail are also essential security measures. This also includes proper training of employees to recognise and report suspicious mail.',
                  },
                  {
                    title: 'Optimise Mailroom Operations',
                    icon: <SettingsIcon size={16} />,
                    content: 'Optimising mailroom operations involves streamlining workflows, minimising waste, and maximising efficiency. This includes using appropriate equipment and supplies, organising the mailroom layout for efficient processing, and implementing automated sorting and routing systems. Regular assessments of mailroom performance and identification of areas for improvement are essential. This includes making sure that the mailroom is well stocked, and that the equipment is well maintained.',
                  },
                  {
                    title: 'Embrace Digital Mail Management',
                    icon: <Cloud size={16} />,
                    content: 'Transitioning to digital mail management reduces reliance on physical mail and enhances efficiency. This includes using email for communication, implementing electronic document management systems, and utilising cloud-based mail services. Digital solutions offer benefits such as faster delivery, improved searchability, and reduced storage costs. This includes properly training employees on how to use the digital systems.',
                  },
                  {
                    title: 'Regularly Audit and Review Mail Processes',
                    icon: <ClipboardListIcon size={16} />,
                    content: 'Regularly auditing and reviewing mail processes ensures that they remain effective and efficient. This includes analysing mail volume, identifying bottlenecks, and evaluating the performance of mail management systems. Audits help to identify areas for improvement and ensure that mail processes are aligned with organisational goals. This includes reviewing all policies and updating them when needed.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 20: Managing Your Email Inbox */}
            <div
              ref={(el) => {
                sectionRefs.current['inbox-mgmt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Managing Your Email Inbox
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Implement a Filing System',
                    icon: <FolderTree size={16} />,
                    content: 'Create a structured filing system with folders and labels to organise emails based on sender, subject, or project. Regularly move emails from your inbox to the appropriate folders to keep it clean and organised. Using subfolders and nested labels can further enhance organisation. This system should be easy to use, and intuitive.',
                  },
                  {
                    title: 'Use Filters and Rules',
                    icon: <FilterIcon size={16} />,
                    content: 'Set up filters and rules to automatically sort incoming emails into folders or prioritise them based on specific criteria. This helps to reduce clutter and ensure that important emails are not missed. Most email clients offer advanced filtering options that can be customised to your needs. This frees up time, to allow the user to focus on more important tasks.',
                  },
                  {
                    title: 'Prioritise and Delegate',
                    icon: <Target size={16} />,
                    content: 'Quickly assess incoming emails and prioritise them based on urgency and importance. Delegate tasks or forward emails to the appropriate individuals when necessary. This helps to ensure that emails are addressed promptly and efficiently. This also helps to prevent information bottlenecks.',
                  },
                  {
                    title: 'Use the "Two-Minute Rule"',
                    icon: <ClockIcon size={16} />,
                    content: 'If an email can be addressed in two minutes or less, do it immediately. This helps to clear your inbox quickly and prevent emails from piling up. This helps to prevent small tasks from becoming large, overwhelming tasks.',
                  },
                  {
                    title: 'Unsubscribe from Unnecessary Emails',
                    icon: <XCircle size={16} />,
                    content: 'Regularly unsubscribe from newsletters, promotional emails, and other unwanted subscriptions. This helps to reduce the volume of incoming emails and minimise distractions. Most email clients have an easy "unsubscribe" button.',
                  },
                  {
                    title: 'Set Aside Time for Email Management',
                    icon: <ClockIcon size={16} />,
                    content: 'Allocate specific times of the day for checking and processing emails. This helps to prevent constant interruptions and allows for focused work. Setting specific times for email, helps to prevent constant distractions.',
                  },
                  {
                    title: 'Archive or Delete Old Emails',
                    icon: <Archive size={16} />,
                    content: 'Regularly archive or delete old emails that are no longer needed. This helps to maintain a clean and manageable inbox. Most email clients have robust archiving tools.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 21: Creating Effective Email Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['effective-email'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Creating Effective Email Communication
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Write Clear and Concise Subject Lines',
                    icon: <FileTextIcon size={16} />,
                    content: 'Use subject lines that accurately reflect the content of the email. This helps recipients quickly understand the purpose of the email and prioritise it accordingly. Avoid vague or generic subject lines.',
                  },
                  {
                    title: 'Use Professional Language and Tone',
                    icon: <MessageSquare size={16} />,
                    content: 'Maintain a professional tone and use proper grammar and spelling. Avoid informal language, slang, or jargon that the recipient may not understand. Proofread emails before sending them to prevent errors.',
                  },
                  {
                    title: 'Keep Emails Concise and to the Point',
                    icon: <AlignLeft size={16} />,
                    content: 'Avoid lengthy emails and get straight to the point. Use bullet points, headings, and short paragraphs to enhance readability. Focus on conveying the essential information clearly and efficiently.',
                  },
                  {
                    title: 'Tailor Emails to the Recipient',
                    icon: <UsersIcon size={16} />,
                    content: 'Consider the recipient\'s knowledge level, communication style, and cultural background when crafting emails. Tailoring emails to the recipient helps to ensure that the message is relevant and impactful.',
                  },
                  {
                    title: 'Use Proper Formatting and Structure',
                    icon: <Layout size={16} />,
                    content: 'Use proper formatting, such as bolding, italics, and underlining, to highlight key information. Structure emails with a clear introduction, body, and conclusion. This helps to guide the recipient through the message.',
                  },
                  {
                    title: 'Include a Clear Call to Action',
                    icon: <Target size={16} />,
                    content: 'If the email requires action from the recipient, clearly state what needs to be done and when. This helps to ensure that tasks are completed promptly and efficiently.',
                  },
                  {
                    title: 'Proofread and Review Before Sending',
                    icon: <CheckCircleIcon size={16} />,
                    content: 'Always proofread emails before sending them to prevent errors and ensure that the message is clear and professional. This helps to maintain a positive impression and avoid misunderstandings.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Mail Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span>Mail Classes</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Benefits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Best Practices</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Mail management covers both physical and electronic mail. Key classes: First‑Class, Standard, Certified, Registered, Express. Procedures include receiving, sorting, recording, and distributing. ICT has transformed mail with email, digital mailrooms, and cloud services. Security is critical – implement access control, encryption, and regular audits. Effective email communication requires clarity, professionalism, and proper organisation.
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
                <strong className="text-white">Mail Classes</strong> – First‑Class (priority), Standard (bulk), Certified (proof of delivery), Registered (highest security), Express (overnight). Choose based on urgency, cost, and security needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Processing Procedures</strong> – Incoming: receive, sort, open, log, distribute. Outgoing: prepare, sort, track, dispatch. Document with mail logs, routing slips, and retention schedules.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ICT &amp; Digital Mail</strong> – Email, EDMS, online postage, digital mailrooms, and cloud services have transformed mail management. Use filters, rules, and automation to streamline electronic communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security &amp; Access Control</strong> – Protect sensitive information with encryption, access controls, and least privilege. Prevent malware and spam. Comply with regulations (GDPR, HIPAA). Regular audits and employee training are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Establish clear policies, centralise mail, use tracking systems, optimise mailrooms, embrace digital solutions, and conduct regular reviews. Effective email communication requires clear subject lines, professional tone, and a structured approach.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 2
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;