import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Mail,
  CheckSquare,
  Inbox,
  TrashIcon,
  UsersIcon,
  CheckCircle,
  ClockIcon,
  FolderTree,
  FilterIcon,
  FileTextIcon,
  XCircle,
  Keyboard,
  LinkIcon,
  Shield,
  RefreshCwIcon,
  PackageIcon,
  Target,
  SettingsIcon,
  ListChecks,
  MessageSquare,
  Send,
  UserIcon,
  Smartphone,
  SearchIcon,
  FlagIcon,
  BellIcon,
  MessageCircle,
  LayersIcon,
  TagIcon,
  Archive,
  ListTodo,
  EyeIcon,
  FolderIcon,
  CalendarIcon,
  FileText,
  Hand,
  AlertCircle,
  Paperclip,
  FileText as FileTextIcon2,
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
  ClipboardList,
  Trash2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: '4ds', label: 'The 4Ds' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mastering', label: 'Mastering Email' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'processing', label: 'Processing' },
  { id: 'registering', label: 'Registering Emails' },
  { id: 'functions', label: 'Email Functions' },
  { id: 'overload', label: 'Email Overload' },
  { id: 'folders', label: 'Working with Folders' },
  { id: 'sorting', label: 'Sorting & Filing' },
  { id: 'tracking', label: 'Tracking Important' },
  { id: 'outlook-tasks', label: 'Outlook Tasks' },
  { id: 'filing-procedures', label: 'Filing Procedures' },
  { id: 'tools', label: 'Email Tools' },
  { id: 'etiquette', label: 'Email Etiquette' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The average professional spends about 28% of their workweek managing emails – that’s over 13 hours per week!',
      },
      {
        title: 'Pro Tip',
        text: 'Use the 2‑minute rule: if an email can be answered in under two minutes, do it immediately. This keeps your inbox moving.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4Ds with "D‑D‑D‑D": Delete, Delegate, Do, Defer. Process every email with one of these actions.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people check email constantly. Set specific times (e.g., 10 AM, 2 PM, 4 PM) to process emails instead of reacting all day.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The average professional spends about 28% of their workweek managing emails – that’s over 13 hours per week!',
      },
      {
        title: 'Pro Tip',
        text: 'Use the 2‑minute rule: if an email can be answered in under two minutes, do it immediately. This keeps your inbox moving.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4Ds with "D‑D‑D‑D": Delete, Delegate, Do, Defer. Process every email with one of these actions.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people check email constantly. Set specific times (e.g., 10 AM, 2 PM, 4 PM) to process emails instead of reacting all day.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Mail size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Email Management —{' '}
            <span className="text-amber-300 font-bold italic">
              Strategies, Tools &amp; Best Practices
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to the 4Ds, email management strategies, folder organisation, Outlook Tasks, email etiquette, tools, and dealing with email overload.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckSquare size={14} className="inline mr-1" /> 4Ds
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> Folders
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
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
                placeholder="Search for a concept, strategy, tool..."
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
            {/* SECTION 1: Managing Emails Using the 4Ds */}
            <div
              ref={(el) => {
                sectionRefs.current['4ds'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Managing Emails Using the 4Ds
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The 4Ds—Delete, Delegate, Do, and Defer—offer a practical framework for processing emails efficiently.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Delete',
                    icon: <TrashIcon size={16} />,
                    content: 'The "Delete" strategy involves immediately removing emails that are irrelevant, spam, or no longer needed. This action helps to declutter the inbox and eliminate unnecessary distractions. By promptly deleting non-essential emails, you free up valuable time and mental space, allowing you to focus on more important tasks. This step is about being ruthless with your inbox, and not allowing useless emails to take up your time. This should be the first step in processing emails.',
                  },
                  {
                    title: 'Delegate',
                    icon: <UsersIcon size={16} />,
                    content: 'The "Delegate" strategy involves forwarding emails that require action from someone else. This action not only reduces your workload but also ensures that tasks are handled by the most appropriate individuals. When delegating, provide clear instructions and deadlines to ensure that the recipient understands the task and can complete it effectively. This allows you to focus on your own tasks and ensures that everyone is working on what they are best suited for.',
                  },
                  {
                    title: 'Do',
                    icon: <CheckCircle size={16} />,
                    content: 'The "Do" strategy involves immediately addressing emails that can be handled within a few minutes. This action helps to prevent emails from piling up and ensures that quick tasks are completed promptly. By addressing short emails immediately, you maintain a sense of momentum and avoid procrastination. This also helps to prevent small tasks from becoming large, overwhelming tasks.',
                  },
                  {
                    title: 'Defer',
                    icon: <Clock size={16} />,
                    content: 'The "Defer" strategy involves scheduling time to address emails that require more time or attention. This action helps to manage your workload and ensures that important emails are not overlooked. When deferring, assign a specific time slot in your calendar to address these emails. This helps to ensure that you do not forget about them, and that you set aside adequate time to address them.',
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

            {/* SECTION 2: Best Email Management Practices */}
            <div
              ref={(el) => {
                sectionRefs.current['best-practices'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Best Email Management Practices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Consistent Folder Organisation',
                    icon: <FolderTree size={16} />,
                    content: 'Creating and maintaining a well-structured folder system is essential for organising emails. This involves categorising emails based on sender, project, or topic, and using clear and consistent folder names. Regularly moving emails from the inbox to the appropriate folders ensures that important information is easily accessible. This also allows for the ability to quickly find old emails.',
                  },
                  {
                    title: 'Utilising Email Filters and Rules',
                    icon: <FilterIcon size={16} />,
                    content: 'Email filters and rules automate the sorting and organisation of incoming emails. This involves setting up criteria to automatically move emails to specific folders, mark them as read, or delete them. This helps to reduce clutter and ensure that important emails are prioritised. This frees up time, to allow the user to focus on more important tasks.',
                  },
                  {
                    title: 'Limiting Email Check Frequency',
                    icon: <ClockIcon size={16} />,
                    content: 'Constantly checking emails can be a significant distraction. Setting aside specific times of the day to check emails helps to maintain focus and productivity. This allows you to concentrate on other tasks without constant interruptions. This also helps to prevent "email burnout".',
                  },
                  {
                    title: 'Employing Email Templates',
                    icon: <FileTextIcon size={16} />,
                    content: 'Using email templates for frequently sent messages saves time and ensures consistency. This involves creating pre-written messages for common inquiries or responses. This also helps to ensure that all emails have a consistent format.',
                  },
                  {
                    title: 'Maintaining a Clean Inbox',
                    icon: <Inbox size={16} />,
                    content: 'Regularly deleting or archiving old emails helps to maintain a clean and manageable inbox. This prevents the inbox from becoming overwhelming and ensures that important emails are easily accessible. This also helps to improve email client performance.',
                  },
                  {
                    title: 'Unsubscribing from Unnecessary Emails',
                    icon: <XCircle size={16} />,
                    content: 'Regularly unsubscribing from newsletters, promotional emails, and other unwanted subscriptions helps to reduce the volume of incoming emails. This minimises distractions and ensures that your inbox remains focused on essential communications. This also helps to prevent spam emails from filling up your inbox.',
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

            {/* SECTION 3: Mastering Email Management */}
            <div
              ref={(el) => {
                sectionRefs.current['mastering'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Mastering Email Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Implementing the Zero-Inbox Strategy',
                    icon: <Inbox size={16} />,
                    content: 'The zero-inbox strategy aims to keep the inbox empty by processing emails promptly. This involves using the 4Ds to address each email and ensuring that the inbox remains a tool for action, not a repository. This helps to reduce stress and improve productivity.',
                  },
                  {
                    title: 'Using Email Snooze and Reminders',
                    icon: <ClockIcon size={16} />,
                    content: 'Email snooze and reminder features allow you to temporarily remove emails from your inbox and receive them again at a later time. This is useful for deferring emails that require action at a specific time. This helps to ensure that you do not forget about important emails.',
                  },
                  {
                    title: 'Creating Email Shortcuts and Hotkeys',
                    icon: <Keyboard size={16} />,
                    content: 'Using email shortcuts and hotkeys can significantly speed up email processing. This involves learning keyboard shortcuts for common email actions, such as replying, forwarding, and deleting. This helps to improve efficiency and reduce the time spent on email management.',
                  },
                  {
                    title: 'Integrating Email with Task Management Tools',
                    icon: <LinkIcon size={16} />,
                    content: 'Integrating email with task management tools allows you to convert emails into tasks and track them alongside other projects. This helps to ensure that email-related tasks are not overlooked. This also helps to improve workflow.',
                  },
                  {
                    title: 'Setting Email Boundaries and Communication Guidelines',
                    icon: <Shield size={16} />,
                    content: 'Establishing clear email boundaries and communication guidelines helps to manage expectations and reduce email overload. This involves defining response times, setting out-of-office messages, and communicating email etiquette to colleagues. This also helps to prevent unnecessary emails.',
                  },
                  {
                    title: 'Regularly Reviewing and Optimising Email Workflow',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'Regularly reviewing and optimising your email workflow ensures that it remains efficient and effective. This involves analysing your email habits, identifying areas for improvement, and implementing new strategies. This also helps to ensure that you are using the most efficient email management practices.',
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

            {/* SECTION 4: Strategies to Email Management */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies to Email Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Batch Processing Emails',
                    icon: <PackageIcon size={16} />,
                    content: 'Batch processing emails involves setting aside specific times of the day to process emails in bulk. This helps to minimise distractions and allows for focused email management. This also helps to prevent constant interruptions.',
                  },
                  {
                    title: 'Using Email Delegation Tools',
                    icon: <UsersIcon size={16} />,
                    content: 'Email delegation tools allow you to assign emails to other team members and track their progress. This helps to distribute workload and ensure that emails are handled efficiently. This also helps to improve team collaboration.',
                  },
                  {
                    title: 'Creating Email Templates for Common Responses',
                    icon: <FileTextIcon size={16} />,
                    content: 'Creating email templates for common responses saves time and ensures consistency. This involves developing pre-written messages for frequently asked questions or requests. This also helps to ensure that all emails have a consistent tone and style.',
                  },
                  {
                    title: 'Prioritising Emails Based on Urgency and Importance',
                    icon: <Target size={16} />,
                    content: 'Prioritising emails based on urgency and importance helps to ensure that critical emails are addressed promptly. This involves using email flags, labels, or categories to identify important emails. This also helps to prevent important emails from being overlooked.',
                  },
                  {
                    title: 'Implementing Email Automation',
                    icon: <SettingsIcon size={16} />,
                    content: 'Implementing email automation tools helps to automate repetitive email tasks. This includes setting up auto-responders, email sequences, and automated email campaigns. This also helps to improve efficiency and reduce the time spent on manual email tasks.',
                  },
                  {
                    title: 'Developing an Email Communication Policy',
                    icon: <FileTextIcon size={16} />,
                    content: 'Developing an email communication policy helps to establish guidelines for email usage within the organisation. This includes defining email etiquette, response times, and security protocols. This also helps to ensure that all email communication is professional and consistent.',
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

            {/* SECTION 5: Processing Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['processing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Processing Strategies
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Time Blocking',
                    icon: <ClockIcon size={16} />,
                    content: 'Allocate specific time blocks in your schedule for processing emails. This prevents constant interruptions and allows for focused attention. For example, dedicate 30 minutes in the morning and afternoon to address emails. This structured approach ensures that you do not get side-tracked by emails throughout the day and allows you to focus on other tasks.',
                  },
                  {
                    title: 'Email Triage',
                    icon: <Target size={16} />,
                    content: 'Quickly scan your inbox and categorise emails based on urgency and importance. This involves using the 4Ds (Delete, Delegate, Do, Defer) to prioritise emails. Address urgent and important emails first and defer less critical ones. This allows you to address the most important emails first, and not waste time on less important ones.',
                  },
                  {
                    title: 'Batch Actions',
                    icon: <ListChecks size={16} />,
                    content: 'Perform similar actions on multiple emails at once. For example, delete all spam emails, archive old emails, or move related emails to a specific folder. This reduces the time spent on individual email actions. This allows you to quickly process a large number of emails.',
                  },
                  {
                    title: 'Contextual Responses',
                    icon: <MessageSquare size={16} />,
                    content: 'Provide clear and concise responses that address the specific context of the email. This avoids unnecessary back-and-forth communication. If possible, answer all questions in the first response. This helps to prevent long email chains.',
                  },
                  {
                    title: 'Automated Responses',
                    icon: <Send size={16} />,
                    content: 'Use automated responses for frequently asked questions or out-of-office messages. This saves time and ensures that recipients receive timely responses. This also helps to manage expectations, and lets people know when they can expect a response.',
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

            {/* SECTION 6: Process of Registering Emails */}
            <div
              ref={(el) => {
                sectionRefs.current['registering'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Process of Registering Emails
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Account Creation',
                    icon: <UserIcon size={16} />,
                    content: 'Choose an email provider (e.g., Gmail, Outlook, Yahoo) and create an account. Provide the necessary information, such as your name, desired email address, and password. This step involves agreeing to the terms of service and privacy policy of the email provider.',
                  },
                  {
                    title: 'Address Configuration',
                    icon: <SettingsIcon size={16} />,
                    content: 'Configure your email address to your preferences, including display name, signature, and any aliases. This step involves customising your email settings to reflect your professional or personal identity.',
                  },
                  {
                    title: 'Security Setup',
                    icon: <Shield size={16} />,
                    content: 'Enable security features, such as two-factor authentication and strong passwords, to protect your account from unauthorised access. This step is essential for safeguarding your email account and preventing data breaches.',
                  },
                  {
                    title: 'Contact Synchronisation',
                    icon: <UsersIcon size={16} />,
                    content: 'Synchronise your email account with your contacts list to ensure that you have easy access to your contacts\' email addresses. This step helps to streamline communication and avoid manual entry of email addresses.',
                  },
                  {
                    title: 'Email Client Integration',
                    icon: <Smartphone size={16} />,
                    content: 'Integrate your email account with your preferred email client (e.g., Outlook, Thunderbird) or mobile device. This step allows you to access and manage your emails from multiple devices.',
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

            {/* SECTION 7: Using Email Functions */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Using Email Functions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Search Functionality',
                    icon: <SearchIcon size={16} />,
                    content: 'Use the search function to quickly find specific emails based on keywords, sender, or date. This saves time and ensures that you can easily retrieve important information.',
                  },
                  {
                    title: 'Email Flags and Labels',
                    icon: <FlagIcon size={16} />,
                    content: 'Use email flags and labels to categorise and prioritise emails. This helps to ensure that important emails are not overlooked.',
                  },
                  {
                    title: 'Email Scheduling',
                    icon: <ClockIcon size={16} />,
                    content: 'Schedule emails to be sent at a later time. This is useful for sending emails outside of working hours or when you want to ensure that they are received at a specific time.',
                  },
                  {
                    title: 'Email Threading',
                    icon: <MessageSquare size={16} />,
                    content: 'Use email threading to keep related emails together. This helps to maintain context and avoid confusion.',
                  },
                  {
                    title: 'Email Forwarding and Redirecting',
                    icon: <Send size={16} />,
                    content: 'Use email forwarding and redirecting to automatically send emails to other email addresses. This is useful for out of office replies or sending specific emails to a group of people.',
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

            {/* SECTION 8: Dealing with Email Overload */}
            <div
              ref={(el) => {
                sectionRefs.current['overload'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Dealing with Email Overload
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Set Email Boundaries',
                    icon: <Shield size={16} />,
                    content: 'Establish clear boundaries for email communication, such as response times and availability. Communicate these boundaries to colleagues and clients.',
                  },
                  {
                    title: 'Limit Email Notifications',
                    icon: <BellIcon size={16} />,
                    content: 'Disable or reduce email notifications to minimise interruptions. Check emails at scheduled times instead of constantly.',
                  },
                  {
                    title: 'Use Email Summaries',
                    icon: <FileTextIcon size={16} />,
                    content: 'Use email summary features to receive a daily or weekly digest of important emails. This helps to reduce the number of individual emails that you need to process.',
                  },
                  {
                    title: 'Implement Email Delegation',
                    icon: <UsersIcon size={16} />,
                    content: 'Delegate email tasks to other team members when appropriate. This helps to distribute the workload and ensure that emails are handled efficiently.',
                  },
                  {
                    title: 'Prioritise Email Communication',
                    icon: <MessageCircle size={16} />,
                    content: 'If possible, use other communication methods for less important conversations. Instant messaging or phone calls can be more efficient.',
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

            {/* SECTION 9: Working Smarter with Folders */}
            <div
              ref={(el) => {
                sectionRefs.current['folders'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Working Smarter with Folders
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Create a Logical Folder Structure',
                    icon: <FolderTree size={16} />,
                    content: 'Develop a folder structure that aligns with your workflow and communication patterns. This may involve creating folders based on projects, clients, or departments.',
                  },
                  {
                    title: 'Use Subfolders and Nested Labels',
                    icon: <LayersIcon size={16} />,
                    content: 'Use subfolders and nested labels to further categorise emails within folders. This helps to maintain a clean and organised folder system.',
                  },
                  {
                    title: 'Automate Folder Organisation',
                    icon: <SettingsIcon size={16} />,
                    content: 'Use email filters and rules to automatically move emails to the appropriate folders. This saves time and ensures that emails are organised consistently.',
                  },
                  {
                    title: 'Regularly Review and Clean Up Folders',
                    icon: <RefreshCwIcon2 size={16} />,
                    content: 'Regularly review and clean up your folders to remove unnecessary emails and folders. This helps to maintain a manageable folder system.',
                  },
                  {
                    title: 'Use Search Within Folders',
                    icon: <SearchIcon size={16} />,
                    content: 'When looking for a specific email, use the search function, but specify the folder that you want to search within. This helps to narrow down the search and find the email faster.',
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

            {/* SECTION 10: Sorting and Filing Emails */}
            <div
              ref={(el) => {
                sectionRefs.current['sorting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sorting and Filing Emails
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Consistent Folder Structure',
                    icon: <FolderTree size={16} />,
                    content: 'Establish a hierarchical folder structure that reflects your workflow. This could be based on projects, clients, departments, or urgency. For example, you might have top-level folders for "Clients," "Projects," and "Internal," with subfolders for specific clients or projects. Consistency in naming conventions is key.',
                  },
                  {
                    title: 'Labelling and Tagging',
                    icon: <TagIcon size={16} />,
                    content: 'Utilise labels or tags to categorise emails within folders. This allows for more granular organisation and easier searching. For example, you could label emails as "Action Required," "Pending," or "Reference." This is especially useful for emails that fit into multiple categories.',
                  },
                  {
                    title: 'Automated Filtering',
                    icon: <FilterIcon size={16} />,
                    content: 'Set up email filters or rules to automatically sort incoming emails into designated folders or apply labels. This saves time and ensures that emails are organised consistently. For example, emails from a specific sender or with a particular subject line could be automatically moved to a project folder.',
                  },
                  {
                    title: 'Regular Archiving',
                    icon: <Archive size={16} />,
                    content: 'Archive older emails that are no longer actively needed but may be required for future reference. This keeps your inbox and main folders clean. Most email clients have an archive function that removes emails from the inbox but keeps them searchable.',
                  },
                  {
                    title: 'Search Function Mastery',
                    icon: <SearchIcon size={16} />,
                    content: 'Become proficient in using your email client\'s search function. Learn advanced search operators to quickly locate emails based on sender, subject, date, or keywords. This helps to quickly find emails when needed, even if they are archived.',
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

            {/* SECTION 11: Tracking Important Emails */}
            <div
              ref={(el) => {
                sectionRefs.current['tracking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tracking Important Emails
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Flagging and Starring',
                    icon: <FlagIcon size={16} />,
                    content: 'Use flags or stars to mark emails that require immediate attention or follow-up. This provides a visual cue and helps to prioritise important emails. Regularly review your flagged or starred emails to ensure that tasks are completed.',
                  },
                  {
                    title: 'Creating To-Do Lists',
                    icon: <ListTodo size={16} />,
                    content: 'Convert important emails into tasks or to-do list items. Many email clients integrate with task management tools, or you can manually create a to-do list. This ensures that action items are tracked and completed.',
                  },
                  {
                    title: 'Setting Reminders and Follow-Ups',
                    icon: <ClockIcon size={16} />,
                    content: 'Use email reminders or follow-up features to schedule notifications for important emails. This helps to ensure that you do not forget to respond or take action. Some email clients allow you to snooze emails, so they reappear in your inbox at a later time.',
                  },
                  {
                    title: 'Using Email Tracking Tools',
                    icon: <EyeIcon size={16} />,
                    content: 'For critical emails, consider using email tracking tools that provide notifications when emails are opened, or links are clicked. This is especially useful for sales or business communication where you need to know if your email has been seen.',
                  },
                  {
                    title: 'Creating Dedicated Folders for Critical Communication',
                    icon: <FolderIcon size={16} />,
                    content: 'Create a folder, or set of folders, that are used only for the most critical communication. This allows for a quick visual scan of the most important emails.',
                  },
                  {
                    title: 'Regular Review of Sent Emails',
                    icon: <Send size={16} />,
                    content: 'Review sent emails to ensure that you have received responses or that follow-up actions have been taken. This helps to ensure that important communications are not lost.',
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

            {/* SECTION 12: Using Outlook Tasks */}
            <div
              ref={(el) => {
                sectionRefs.current['outlook-tasks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Using Outlook Tasks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Creating Tasks from Emails',
                    icon: <Mail size={16} />,
                    content: 'Outlook allows you to create tasks directly from emails. Simply drag an email to the Tasks icon in the navigation pane, or right-click the email and select "Follow Up" to set a reminder or create a task. This integrates your email communication with your task management.',
                  },
                  {
                    title: 'Setting Task Details',
                    icon: <SettingsIcon size={16} />,
                    content: 'When creating a task, you can set various details, including subject, due date, priority, and status. You can also add notes and attachments. This allows for detailed task management.',
                  },
                  {
                    title: 'Categorising and Organising Tasks',
                    icon: <LayersIcon size={16} />,
                    content: 'Use categories and folders to organise your tasks. This helps to keep your task list organised and allows you to prioritise tasks based on project, client, or urgency.',
                  },
                  {
                    title: 'Setting Reminders',
                    icon: <BellIcon size={16} />,
                    content: 'Set reminders for tasks to ensure that you do not miss deadlines. Outlook will provide pop-up notifications or sound alerts to remind you of upcoming tasks.',
                  },
                  {
                    title: 'Assigning Tasks',
                    icon: <UsersIcon size={16} />,
                    content: 'Outlook allows you to assign tasks to other people within your organisation. This is useful for delegating work and tracking team progress.',
                  },
                  {
                    title: 'Task Integration with Calendar',
                    icon: <CalendarIcon size={16} />,
                    content: 'Outlook tasks integrate well with the calendar. This allows you to visually see when tasks are due, and to schedule time to complete them.',
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

            {/* SECTION 13: Procedures in Filing Emails */}
            <div
              ref={(el) => {
                sectionRefs.current['filing-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures in Filing Emails
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Consistent Folder Structure',
                    icon: <FolderTree size={16} />,
                    content: 'Establish a consistent folder structure that aligns with your workflow. This could be based on projects, clients, departments, or time periods. Use clear and descriptive folder names.',
                  },
                  {
                    title: 'Automated Rules',
                    icon: <SettingsIcon size={16} />,
                    content: 'Set up automated rules to move incoming emails to the appropriate folders. This saves time and ensures that emails are filed consistently. For example, create a rule to move all emails from a specific sender to a dedicated folder.',
                  },
                  {
                    title: 'Regular Filing',
                    icon: <Inbox size={16} />,
                    content: 'File emails regularly to prevent your inbox from becoming cluttered. This could be done daily or weekly, depending on your email volume.',
                  },
                  {
                    title: 'Archiving',
                    icon: <Archive size={16} />,
                    content: 'Archive older emails that are no longer actively needed. This keeps your main folders clean and improves email client performance.',
                  },
                  {
                    title: 'Search Function',
                    icon: <SearchIcon size={16} />,
                    content: 'Even with perfect filing, sometimes you will need to search for an email. Be sure to understand the search functionality of your email client.',
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

            {/* SECTION 14: Recommended Email Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Recommended Email Tools
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Email Clients',
                    icon: <Mail size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Microsoft Outlook:</strong> A comprehensive email client with integrated calendar, tasks, and contacts.</li>
                        <li><strong>Gmail:</strong> A user-friendly web-based email client with powerful search and filtering capabilities.</li>
                        <li><strong>Thunderbird:</strong> A free and open-source email client with extensive customisation options.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Email Management Tools',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>SaneBox:</strong> Uses AI to filter unimportant emails and prioritise important ones.</li>
                        <li><strong>Boomerang for Gmail/Outlook:</strong> Allows you to schedule emails, set reminders, and track email opens.</li>
                        <li><strong>Mailstrom:</strong> Helps to clean up your inbox by grouping related emails and providing bulk actions.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Email Security Tools',
                    icon: <Shield size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Mimecast:</strong> Provides email security, archiving, and continuity services.</li>
                        <li><strong>Proofpoint:</strong> Offers advanced threat protection and email security solutions.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Email Automation Tools',
                    icon: <SettingsIcon size={16} />,
                    content: 'Many CRM programs, and marketing programs offer email automation.',
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

            {/* SECTION 15: Email Etiquette */}
            <div
              ref={(el) => {
                sectionRefs.current['etiquette'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Email Etiquette
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Clear Subject Lines',
                    icon: <FileTextIcon size={16} />,
                    content: 'Use clear and concise subject lines that accurately reflect the content of the email.',
                  },
                  {
                    title: 'Professional Tone',
                    icon: <MessageSquare size={16} />,
                    content: 'Maintain a professional tone and use proper grammar and spelling. Avoid informal language or slang.',
                  },
                  {
                    title: 'Concise Messages',
                    icon: <FileText size={16} />,
                    content: 'Keep emails concise and to the point. Use bullet points or numbered lists to enhance readability.',
                  },
                  {
                    title: 'Appropriate Greetings and Closings',
                    icon: <Hand size={16} />,
                    content: 'Use appropriate greetings and closings, such as "Dear [Name]" and "Sincerely" or "Best regards."',
                  },
                  {
                    title: 'Avoid All Caps',
                    icon: <AlertCircle size={16} />,
                    content: 'Avoid using all caps, as it can be interpreted as shouting.',
                  },
                  {
                    title: 'Proofread',
                    icon: <CheckCircle size={16} />,
                    content: 'Proofread emails before sending them to prevent errors.',
                  },
                  {
                    title: 'Timely Responses',
                    icon: <ClockIcon size={16} />,
                    content: 'Respond to emails promptly, especially if they require action.',
                  },
                  {
                    title: 'Use BCC Appropriately',
                    icon: <UsersIcon size={16} />,
                    content: 'Use BCC when sending emails to a large number of recipients to protect their privacy.',
                  },
                  {
                    title: 'Avoid Forwarding Spam',
                    icon: <XCircle size={16} />,
                    content: 'Never forward Spam or chain emails.',
                  },
                  {
                    title: 'Be Mindful of Attachments',
                    icon: <Paperclip size={16} />,
                    content: 'Only send attachments that are necessary, and make sure that they are not too large.',
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
                  💡 Email Insight
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
                  <span>4Ds</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Best Practices</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Etiquette Tips</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Master email management with the 4Ds – Delete, Delegate, Do, Defer. Use folders, filters, and automation to stay organised. Set boundaries, limit check frequency, and leverage Outlook Tasks for action items. Always follow email etiquette: clear subject lines, professional tone, and timely responses. Use tools like SaneBox, Boomerang, and security solutions to enhance productivity and safety.
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
                <strong className="text-white">The 4Ds</strong> – Delete, Delegate, Do, Defer. Process every email with one of these actions to keep your inbox under control.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Use folders, filters, and templates. Limit check frequency, unsubscribe from junk, and maintain a clean inbox to boost productivity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mastering Email</strong> – Achieve zero-inbox, use snooze/reminders, integrate with task tools, and set clear boundaries. Regularly review and optimise your workflow.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Outlook Tasks</strong> – Create tasks from emails, set details, categorise, assign, and integrate with the calendar to turn emails into actionable items.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Etiquette &amp; Tools</strong> – Clear subject lines, professional tone, timely responses, and BCC usage. Leverage tools like SaneBox, Boomerang, and security solutions for efficiency and safety.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 4
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;