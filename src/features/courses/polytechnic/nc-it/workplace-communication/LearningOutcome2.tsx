import React, { useState, useEffect, useRef } from 'react';
import {
  Flag,
  FileText,
  Mail,
  Users,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  X,
  ArrowRight,
  CornerDownRight,
  Award,
  Briefcase,
  MessageCircle,
  FileSpreadsheet,
  PenTool,
  BookOpen,
  Target,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  Lightbulb,
  UserCheck,
  Building,
  Globe,
  Download,
  Upload,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusCircle,
  PlusCircle,
  ExternalLink,
  Eye as EyeIcon,
  EyeOff,
  MessageSquare,
  Hash,
  Layout,
  Layers,
  List,
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users2,
  UserPlus,
  UserMinus,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Map as MapIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Printer,
  Save,
  Edit,
  Trash2,
  Copy,
  File as FileIcon,
  Folder,
  FolderOpen,
  Paperclip,
  Link2,
  Image,
  Video,
  Music,
  Headphones,
  Speaker,
  Mic,
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  BellOff,
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  ChevronUp,
  Sparkles,
  BookMarked,
  RefreshCw,
  Search,
  X as XIcon,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'memo', label: 'Memo' },
  { id: 'reports', label: 'Reports' },
  { id: 'invitations', label: 'Invitations' },
  { id: 'acceptance', label: 'Acceptance' },
  { id: 'enquiry', label: 'Enquiry' },
  { id: 'notice-meeting', label: 'Notice of Meeting' },
  { id: 'quotation', label: 'Quotation' },
  { id: 'summary', label: 'Summary' },
  { id: 'tips', label: 'Tips' },
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
        text: 'The word "memo" is short for "memorandum," which comes from Latin meaning "something to be remembered."',
      },
      {
        title: 'Pro Tip',
        text: 'When writing a report, always include a clear "Terms of Reference" section – it defines the scope and limitations of your investigation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key parts of a report with "T-P-F-C-R": Terms of Reference, Procedure, Findings, Conclusions, Recommendations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "enquiry" (request for information) with "inquiry" (formal investigation). In business, you send an enquiry letter to ask about products or services.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "memo" is short for "memorandum," which comes from Latin meaning "something to be remembered."',
      },
      {
        title: 'Pro Tip',
        text: 'When writing a report, always include a clear "Terms of Reference" section – it defines the scope and limitations of your investigation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key parts of a report with "T-P-F-C-R": Terms of Reference, Procedure, Findings, Conclusions, Recommendations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "enquiry" (request for information) with "inquiry" (formal investigation). In business, you send an enquiry letter to ask about products or services.',
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Mail size={14} className="inline mr-1" /> BUSINESS CORRESPONDENCE & REPORTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Business Correspondence &amp; Reports
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master the essential business documents: memos, reports, invitations,
            acceptance letters, enquiry and quotation letters, and notices of
            meeting. Build professional writing skills for the workplace.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Memos & Reports
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <PenTool size={14} className="inline mr-1" /> Correspondence
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a document type, structure, or term..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-blue-200" />
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
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Business Correspondence &amp; Reports
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Effective business writing is essential for professional
                    communication. This learning outcome covers the key business
                    documents you'll need to write in the workplace: memos,
                    reports, invitations, acceptance letters, enquiry and
                    quotation letters, and notices of meeting.
                  </p>
</div>
            </div>

            {/* Memo */}
            <div
              ref={(el) => {
                sectionRefs.current['memo'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memorandum (Memo)
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Memorandum?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">memorandum</span> (commonly called a <span className="font-bold">memo</span>) is a brief written communication used for internal communication within an organization. It's a quick, efficient way to share information with colleagues, departments, or teams.
              </p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <Lightbulb className="text-amber-600 dark:text-amber-400 inline mr-2" size={18} />
                <span className="text-sm text-slate-700 dark:text-slate-300">Think of a memo as a sticky note for the whole office—but more formal. It's a quick, efficient way to get information to everyone who needs it.</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Memo Structure
              </h3>

              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm mt-2">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`MEMORANDUM

TO: [Recipient's Name and Title/Department]
FROM: [Sender's Name and Title]
DATE: [Current Date]
REF: [Reference Number - optional but recommended]
SUBJECT: [Brief, Specific Topic in Capital Letters]

[Opening statement of purpose]

[Body paragraphs with details]

[Action statement if needed]

[Positive closing]

[Your Initials]
/[Typist's Initials]`}
                </pre>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Example Memo
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`MEMORANDUM

TO: Miss P Madondo
FROM: Mr B Nyakasikana, Personnel Officer
DATE: 12 June 2001
REF: STF/101
SUBJECT: PROMOTION TO CHIEF ACCOUNTANT

This serves to notify you that you have been promoted to the post of Chief Accountant with effect from 1 July 2001.

The interview panel was impressed by your performance and recommended your appointment. Your salary will be $45,000 per annum.

Please report to the Human Resources Department on 25 June 2001 to sign your new contract and collect your letter of appointment.

Congratulations on your achievement. We look forward to your continued contribution to the organization.

BN
/hh`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Memo Writing Tips</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Keep it brief – people are busy</li>
                    <li>Be direct – get to the point quickly</li>
                    <li>Use a clear subject line</li>
                    <li>Organize information logically</li>
                    <li>Use bullet points for key items</li>
                    <li>State deadlines clearly</li>
                    <li>Proofread carefully</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Uses of a Memo</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Announcing policy changes</li>
                    <li>Requesting information from colleagues</li>
                    <li>Providing project updates</li>
                    <li>Confirming meeting decisions</li>
                    <li>Conveying personnel matters</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reports */}
            <div
              ref={(el) => {
                sectionRefs.current['reports'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Reports
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Report?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">report</span> is a structured document that presents factual information and analysis about a specific topic. It's a formal way of presenting findings, conclusions, and recommendations.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Principles of Report Writing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Objectivity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Present facts without bias. Use formal, impersonal language.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Conciseness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Say what needs to be said in as few words as possible.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Clarity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use logical structure, simple language, and visual aids.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Accuracy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Verify all facts, cite sources, proofread thoroughly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Audience Awareness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Consider the reader's knowledge level and needs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Timeliness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Meet deadlines and use current information.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Layout of a Schematic Report
              </h3>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Title</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clearly and concisely state what the report is about. Example: "Report on the Deterioration of Food Quality in the XYZ Technical College Dining Hall"</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Terms of Reference</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Define the scope and limitations – who commissioned it, what problem is being investigated, and when it's due.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Procedure</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detail the methods used to gather information – interviews, surveys, observations, financial records review.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Findings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Present the results objectively and clearly – this is the core of the report.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Conclusions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Summarize key findings and draw logical inferences based on the evidence.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Recommendations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Offer specific, actionable solutions based on the findings and conclusions.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Memory Trick</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Remember the key parts of a report with <span className="font-bold">"T-P-F-C-R"</span>: Terms of Reference, Procedure, Findings, Conclusions, Recommendations.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                4 Types of Reports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Formal Reports</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Informal Reports</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Informational Reports</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Analytical Reports</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Investigative Reports</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Progress Reports</span>
                </div>
              </div>
            </div>

            {/* Invitations */}
            <div
              ref={(el) => {
                sectionRefs.current['invitations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Invitations
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is an Invitation?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An <span className="font-bold">invitation</span> is a written or verbal request asking someone to attend an event. It sets the tone and provides all essential information.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Key Elements of an Invitation
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Element</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What It Includes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Host's Details</td><td className="p-3">Who is inviting (individuals or organizations)</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Guest's Name</td><td className="p-3">Who is being invited (full name, titles)</td></tr>
                    <tr><td className="p-3 font-bold">Event Type</td><td className="p-3">What kind of event (graduation, wedding, dinner)</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Date and Time</td><td className="p-3">When the event will take place</td></tr>
                    <tr><td className="p-3 font-bold">Venue</td><td className="p-3">Where the event will be held (full address)</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">RSVP Details</td><td className="p-3">How and when to respond</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Invitation Example
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`INVITATION

THE GENERAL MANAGER AND STAFF OF MASVINGO POLYTECHNIC
REQUEST THE PLEASURE OF THE COMPANY OF MR BENALO
TO A GRADUATION CEREMONY
ON SATURDAY 15 JUNE 2025
AT THE MAIN HALL, MASVINGO POLYTECHNIC
AT 1400 HOURS

RSVP
MASVINGO POLYTECHNIC
P O BOX 1234
Masvingo
TEL: 0777 123 456`}
                </pre>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Layout Guidelines</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Write on blank paper – no lines</li>
                  <li>Center the text</li>
                  <li>Use capital letters for handwriting</li>
                  <li>Space lines evenly</li>
                  <li>Check spelling carefully</li>
                </ul>
              </div>
            </div>

            {/* Acceptance Letters */}
            <div
              ref={(el) => {
                sectionRefs.current['acceptance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Acceptance Letters
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is an Acceptance Letter?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An <span className="font-bold">acceptance letter</span> is a formal way of confirming that you will attend an event you've been invited to. It's your written "yes, I'll be there!"
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Key Elements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Guest's Details</span> – your name or the names of those accepting</li>
                <li><span className="font-bold">Gratitude</span> – expression of thanks for the invitation</li>
                <li><span className="font-bold">Confirmation</span> – clear statement that you will attend</li>
                <li><span className="font-bold">Event Details</span> – repeating the event type, date, and venue</li>
                <li><span className="font-bold">Date of Writing</span> – when you wrote the letter</li>
              </ul>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Acceptance Example
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`ACCEPTANCE

MR AND MRS MUFARO
HAVE MUCH PLEASURE
IN ACCEPTING THE KIND INVITATION OF
THE GENERAL MANAGER AND STAFF OF UNITED BOTTLERS
TO A FUNDRAISING DINNER DANCE
ON SATURDAY 30 OCTOBER 1999
AT THE FLAMBOYANT HOTEL

MASVINGO TECHNICAL COLLEGE
P O BOX 800
Masvingo
TEL: 52269
20 OCTOBER 1999`}
                </pre>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">"Have much pleasure" expresses enthusiasm. Repeats all event details confirming understanding.</p>
            </div>

            {/* Enquiry Letters */}
            <div
              ref={(el) => {
                sectionRefs.current['enquiry'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Enquiry Letters
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is an Enquiry Letter?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An <span className="font-bold">enquiry letter</span> is written to request information about goods or services offered by an organization. It's a formal way of asking "tell me more about..."
              </p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Common Mistake</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Don't confuse "enquiry" (request for information) with "inquiry" (formal investigation). In business, you send an enquiry letter to ask about products or services.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Key Elements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Sender's address and date</li>
                <li>Recipient's address</li>
                <li>Subject line – brief summary of your enquiry</li>
                <li>Salutation – Dear Sir/Madam or specific name</li>
                <li>Introduction – state purpose, refer to advertisement if relevant</li>
                <li>Body – specific questions and details</li>
                <li>Conclusion – express gratitude and state what you're requesting</li>
                <li>Closing – Yours faithfully (if you don't know name) or Yours sincerely (if you do)</li>
                <li>Signature and printed name</li>
              </ul>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Enquiry Letter Example
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`Masvingo Polytechnic
P.O. Box 900
Masvingo

Our Ref: E/001

April 14, 2015

The Sales Manager
ABC Business Machines
P. Bag 6713
Causeway
Harare

SUBJECT: ENQUIRY REGARDING COPY PRINTERS

Dear Sir/Madam,

We are writing to enquire about the copy printers advertised in the Chronicle on Monday, April 12, 2010.

We require information on a model with memory capabilities.

We would be grateful if you could send us a catalogue, price list, and details on the Value Added Tax.

Yours faithfully,

[Signature]

Paul Mutema
Buyer`}
                </pre>
              </div>
            </div>

            {/* Notice of Meeting */}
            <div
              ref={(el) => {
                sectionRefs.current['notice-meeting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Notice of Meeting
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Notice of Meeting?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">notice of meeting</span> is a formal announcement that a meeting will take place. It provides all the essential information recipients need to attend and participate effectively.
              </p>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Element</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">What It Includes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Heading</td><td className="p-3">'NOTICE OF MEETING' prominently displayed</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Organization</td><td className="p-3">Who is holding the meeting</td></tr>
                    <tr><td className="p-3 font-bold">Purpose</td><td className="p-3">Why the meeting is being called</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Date and Time</td><td className="p-3">When the meeting will occur</td></tr>
                    <tr><td className="p-3 font-bold">Location</td><td className="p-3">Where the meeting will be held</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Called By</td><td className="p-3">Who is convening the meeting</td></tr>
                    <tr><td className="p-3 font-bold">Contact</td><td className="p-3">Who to contact with questions</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Distribution</td><td className="p-3">Who is receiving the notice</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Notice of Meeting Example
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`NOTICE OF MEETING

Organization: Neighborhood Watch Committee

Purpose: Special Meeting to Discuss Recent Security Concerns

Date: Wednesday, December 6, 2023 at 7:00 PM

Location: Community Hall, 123 Main Street

Called by: John Smith, Committee Chairperson

Contact: Jane Doe, Secretary
         (555-123-4567 or jane.doe@email.com)

Distributed to: All Neighborhood Watch Committee Members and Interested Residents`}
                </pre>
              </div>
            </div>

            {/* Quotation Letters */}
            <div
              ref={(el) => {
                sectionRefs.current['quotation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Quotation Letters
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Quotation Letter?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">quotation letter</span> is written in response to an enquiry letter. When someone asks for information about products or services, you send a quotation with specific details and pricing.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Key Elements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Acknowledgement – thanks for the enquiry</li>
                <li>Pricing Details – specific prices, discounts, payment terms</li>
                <li>Attachments – brochures, catalogues, price lists</li>
                <li>Price Inclusions – what the price covers (packaging, delivery, tax)</li>
                <li>Delivery Timeline – when goods can be delivered</li>
                <li>Quotation Validity – how long prices are good for</li>
              </ul>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Quotation Letter Example
              </h3>
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 font-mono text-sm">
                <pre className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
{`ABC Business Machines
P. Bag 6713
Causeway
Harare

Our Ref: QOT/121
Your Ref: E/001

15 April 2015

The Buyer
Masvingo Polytechnic
PO Box 800
Masvingo

SUBJECT: QUOTATION FOR COPY PRINTER

Dear Sir,

Further to your enquiry dated 14 April 2010, we are pleased to enclose details of the latest copy printers.

All models illustrated in the catalogue can be supplied from stock at competitive prices ranging from $600.00 to $950.00. These prices are inclusive of discounts and Value Added Tax. Delivery is seven (7) days from date of order.

We suggest a visit to our showroom for us to demonstrate the various machines and, at the same time, show you a range of equipment we have in stock.

Yours faithfully,

[Signature]

Praise Kunyadini
Sales Manager`}
                </pre>
              </div>
            </div>

            {/* Summary */}
            <div
              ref={(el) => {
                sectionRefs.current['summary'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Summary – Key Differences Between Business Documents
              </h2>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Document</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Purpose</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Audience</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Key Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Memo</td><td className="p-3">Internal communication</td><td className="p-3">Colleagues within organization</td><td className="p-3">Brief, direct, heading format</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Report</td><td className="p-3">Present findings and analysis</td><td className="p-3">Decision-makers</td><td className="p-3">Structured sections, objective</td></tr>
                    <tr><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Invitation</td><td className="p-3">Request attendance</td><td className="p-3">Guests</td><td className="p-3">Centered, formal, event details</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Acceptance</td><td className="p-3">Confirm attendance</td><td className="p-3">Hosts</td><td className="p-3">Gratitude, confirmation, repeat details</td></tr>
                    <tr><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Enquiry</td><td className="p-3">Request information</td><td className="p-3">Suppliers/Vendors</td><td className="p-3">Specific questions, reference to ad</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Quotation</td><td className="p-3">Provide pricing</td><td className="p-3">Potential customers</td><td className="p-3">Prices, terms, delivery, validity</td></tr>
                    <tr><td className="p-3 font-bold text-blue-600 dark:text-blue-400">Notice of Meeting</td><td className="p-3">Announce meeting</td><td className="p-3">Meeting participants</td><td className="p-3">All meeting details, contact info</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Tips for Success
              </h2>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={20} className="text-blue-500" /> For All Business Documents
                </h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                  <li><span className="font-bold">Know your purpose</span> – Why are you writing? What do you want to achieve?</li>
                  <li><span className="font-bold">Know your audience</span> – Who will read this? What do they need to know?</li>
                  <li><span className="font-bold">Be clear and concise</span> – Say what needs to be said, no more, no less</li>
                  <li><span className="font-bold">Be accurate</span> – Check names, dates, figures, and spelling</li>
                  <li><span className="font-bold">Be professional</span> – Use appropriate format, tone, and language</li>
                  <li><span className="font-bold">Proofread everything</span> – Errors undermine credibility</li>
                  <li><span className="font-bold">Keep copies</span> – Maintain records of all business correspondence</li>
                  <li><span className="font-bold">Respond promptly</span> – Timely responses show respect and professionalism</li>
                  <li><span className="font-bold">Use templates</span> – Consistent formats save time and look professional</li>
                  <li><span className="font-bold">When in doubt, be more formal</span> – It's easier to soften formality than to recover from being too casual</li>
                </ul>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-yellow-300" />
                <p className="text-lg font-bold mb-2">Remember:</p>
                <p className="text-sm text-blue-100">
                  Every piece of business correspondence represents you and your organization. Take pride in your writing, pay attention to detail, and always consider the reader's needs. Good communication builds trust, strengthens relationships, and opens doors to opportunity.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Business Writing Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Document Types</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Report Principles</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Every business document you write represents your professionalism.
                Master the formats, understand your audience, and communicate
                with clarity and purpose.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memos</strong> – brief internal communications with a standard heading format (TO, FROM, DATE, REF, SUBJECT).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reports</strong> – structured documents presenting findings, conclusions, and recommendations. Follow T-P-F-C-R: Terms of Reference, Procedure, Findings, Conclusions, Recommendations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Invitations</strong> – centered format with host details, guest name, event type, date/time, venue, and RSVP details.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acceptance letters</strong> – confirm attendance, express gratitude, repeat event details.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Enquiry &amp; Quotation</strong> – enquiry requests information; quotation provides pricing and terms in response.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Notice of Meeting</strong> – announces all meeting details: purpose, date, time, location, contact information.
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
            Sidemann Academic Registry • Business Correspondence & Reports 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;