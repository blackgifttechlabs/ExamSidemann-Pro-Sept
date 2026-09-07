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
  Users,
  User,
  Mail,
  Calendar,
  CheckSquare,
  Clipboard,
  PenTool,
  MessageCircle,
  File,
  Book,
  BookMarked,
  List,
  BarChart,
  PieChart,
  TrendingUp,
  Eye,
  Link,
  UserCheck,
  Clock,
  AlertCircle,
  Check,
  X,
  HelpCircle,
  Info,
  CreditCard,
  Building,
  Truck,
  Store,
  Package,
  Hand,
  Briefcase,
  GraduationCap,
  FileCheck,
  FileX,
  FolderOpen,
  FolderPlus,
  UserPlus,
  UserMinus,
  Share2,
  Download,
  Upload,
  ShieldCheck,
  Lock,
  Key,
  PenTool as PenToolIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  User as UserIcon,
  Mail as MailIcon,
  CheckSquare as CheckSquareIcon,
  Clipboard as ClipboardIcon,
  List as ListIcon,
  ClipboardList,
  Layers,
  MapPin,
  RefreshCw,
  ThumbsUp,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  Monitor,
  Cpu,
  Link2,
  Zap,
  Globe,
  FileCode,
  FolderTree as FolderTreeIcon,
  UserCheck as UserCheckIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon2,
  MessageSquare,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'memos-letters', label: 'Memos & Letters' },
  { id: 'examples', label: 'Examples' },
  { id: 'arranging-meetings', label: 'Arranging Meetings' },
  { id: 'conduct-meetings', label: 'Conduct Meetings' },
  { id: 'accurate-records', label: 'Accurate Records' },
  { id: 'presentation-skills', label: 'Presentation Skills' },
  { id: 'evaluation-forms', label: 'Evaluation Forms' },
  { id: 'participant-register', label: 'Participant Register' },
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
        text: 'The first recorded memo was written by the Roman Emperor Julius Caesar, who used "commentarii" to communicate orders to his generals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always proofread your memos and letters aloud. Reading aloud helps catch awkward phrasing and errors that silent reading might miss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 steps for writing effective memos: Purpose → Audience → Gather → Format → Write → Review → Adhere to Standards.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to include a clear subject line in memos and a proper salutation in letters. These are the first things recipients notice.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first recorded memo was written by the Roman Emperor Julius Caesar, who used "commentarii" to communicate orders to his generals.',
      },
      {
        title: 'Pro Tip',
        text: 'Always proofread your memos and letters aloud. Reading aloud helps catch awkward phrasing and errors that silent reading might miss.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 steps for writing effective memos: Purpose → Audience → Gather → Format → Write → Review → Adhere to Standards.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to include a clear subject line in memos and a proper salutation in letters. These are the first things recipients notice.',
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

  // ─── Helper to render a card with title, icon, and content ─────────────
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
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Memos &amp; Letters{' '}
            <span className="text-sky-300 font-bold italic">
              and Professional Communication
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to writing effective memos and letters, arranging meetings, conducting agenda-driven meetings, producing accurate records, presentation skills, evaluation forms, and participant registers.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Memos &amp; Letters
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Meetings
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Communication
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
                placeholder="Search for a concept, memo, agenda, minutes..."
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
            {/* SECTION 1: Writing Effective Memos and Letters */}
            <div
              ref={(el) => {
                sectionRefs.current['memos-letters'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Writing Effective Memos and Letters: A Step-by-Step Guide
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Writing effective memos and letters according to laid-down standards involves a systematic approach that ensures clarity, professionalism, and adherence to organizational guidelines. Here's a step-by-step guide:
                  </p>
</div>

              {[
                { title: '1. Understand the Purpose and Audience', icon: <Target size={16} />, content: (
                  <>
                    <p><strong>Purpose:</strong> Clearly define the reason for the memo or letter. Is it to inform, request, persuade, or document? Knowing the purpose will shape the tone and content.</p>
                    <p><strong>Audience:</strong> Identify the recipient(s). Consider their level of familiarity with the subject, their role in the organization, and their expectations. Tailor the language and level of detail accordingly.</p>
                  </>
                )},
                { title: '2. Gather Information and Plan', icon: <Clipboard size={16} />, content: (
                  <>
                    <p><strong>Collect all relevant data:</strong> Ensure you have accurate and complete information.</p>
                    <p><strong>Organize your thoughts:</strong> Create an outline or bullet points to structure your message logically.</p>
                    <p><strong>Determine the appropriate tone:</strong> Formal, semi-formal, or informal, depending on the recipient and the context.</p>
                    <p><strong>Review laid-down standards:</strong> If your organisation has style guides, or templates, review these. This will include things like font types, letter head usage, and memo formatting.</p>
                  </>
                )},
                { title: '3. Format the Memo', icon: <FileText size={16} />, content: (
                  <>
                    <p><strong>Header:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>To:</strong> Recipient's name and title.</li>
                      <li><strong>From:</strong> Your name and title.</li>
                      <li><strong>Date:</strong> Current date.</li>
                      <li><strong>Subject:</strong> Clear and concise description of the memo's content.</li>
                    </ul>
                    <p><strong>Body:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Introduction:</strong> Briefly state the purpose of the memo.</li>
                      <li><strong>Body paragraphs:</strong> Provide detailed information, using clear and concise language.</li>
                      <li><strong>Conclusion:</strong> Summarize key points and state any required actions.</li>
                    </ul>
                    <p><strong>Signature/Initials:</strong> Add your initials at the end of the memo.</p>
                  </>
                )},
                { title: '4. Format the Letter', icon: <Mail size={16} />, content: (
                  <>
                    <p><strong>Letterhead (if applicable):</strong> Use official company letterhead.</p>
                    <p><strong>Date:</strong> Current date.</p>
                    <p><strong>Recipient's Address:</strong> Include the full address.</p>
                    <p><strong>Salutation:</strong> Use a professional salutation (e.g., "Dear Mr./Ms. [Last Name]").</p>
                    <p><strong>Body:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Introduction:</strong> Briefly state the purpose of the letter.</li>
                      <li><strong>Body paragraphs:</strong> Provide detailed information, using clear and concise language.</li>
                      <li><strong>Conclusion:</strong> Summarize key points and state any required actions.</li>
                    </ul>
                    <p><strong>Closing:</strong> Use a professional closing (e.g., "Sincerely," "Best regards," "Yours faithfully").</p>
                    <p><strong>Signature:</strong> Sign your name, followed by your typed name and title.</p>
                  </>
                )},
                { title: '5. Write the Body', icon: <PenTool size={16} />, content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use clear and concise language: Avoid jargon or technical terms unless necessary.</li>
                    <li>Be direct and to the point: State your message clearly and avoid ambiguity.</li>
                    <li>Use active voice: Active voice makes writing more direct and engaging.</li>
                    <li>Maintain a professional tone: Even in informal memos, maintain a respectful and professional tone.</li>
                    <li>Use bullet points or numbered lists: These make information easier to read and digest.</li>
                    <li>One topic per paragraph: Keep paragraphs focused and concise.</li>
                  </ul>
                )},
                { title: '6. Review and Revise', icon: <CheckSquare size={16} />, content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Proofread carefully: Check for grammatical errors, spelling mistakes, and typos.</li>
                    <li>Review for clarity and conciseness: Ensure your message is easy to understand.</li>
                    <li>Check for accuracy: Verify all information and data.</li>
                    <li>Ensure consistency: Check that formatting and style are consistent.</li>
                    <li>Read it aloud: This can help you identify awkward phrasing or grammatical errors.</li>
                    <li>Have someone else review it: A fresh pair of eyes can catch errors you might miss.</li>
                  </ul>
                )},
                { title: '7. Adhere to Laid-Down Standards', icon: <SettingsIcon size={16} />, content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Company Style Guide:</strong> Follow the organization's specific guidelines for formatting, tone, and language.</li>
                    <li><strong>Templates:</strong> Use provided templates to ensure consistency and efficiency.</li>
                    <li><strong>Legal and Compliance:</strong> Ensure the content complies with any relevant legal or regulatory requirements.</li>
                    <li><strong>Record Keeping:</strong> Keep copies of all memos and letters for your records. This is especially important for formal letters.</li>
                  </ul>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 2: Examples of Memo and Letter */}
            <div
              ref={(el) => {
                sectionRefs.current['examples'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Examples of Memo and Letter
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Below are practical examples of a memo and a letter to illustrate the formatting and content standards discussed above.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Example 1: Memo (Internal Communication)
                </h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {`To: All Department Heads
From: Mr. T. Kunyadini, Principal
Date: 2024-10-27
Subject: Implementation of New Online Student Registration System

Introduction:
This memo serves to inform all department heads about the upcoming implementation of the new online student registration system, scheduled to launch on November 15, 2024.

Body:
The new system, developed by our IT department, aims to streamline the student registration process, reduce administrative workload, and enhance data accuracy. Key features include:

- Online application and document submission.
- Real-time fee payment and confirmation.
- Automated course allocation and timetable generation.
- Integrated student data management.

Training sessions for all staff involved in the registration process will be conducted from November 5 to November 9 in the Computer Lab. A detailed schedule will be circulated by the IT department by November 1.

We understand that the transition may present some challenges. Your cooperation and active participation in the training sessions are crucial for the successful implementation of this system.

Conclusion:
Please ensure that all relevant staff members are informed about this change and attend the scheduled training. Your support is greatly appreciated.

TM`}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-2">
                  <Mail size={16} /> Example 2: Letter (External Communication)
                </h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                  {`Masvingo Polytechnic
[Address of Masvingo Polytechnic]
Masvingo, Zimbabwe
2024-10-27

Mr. J. Dube
[Address of Potential Partner Organisation]
Masvingo, Zimbabwe

Dear Mr. Dube,

I am writing to you on behalf of Masvingo Polytechnic to express our keen interest in establishing a collaborative partnership between our institutions.

Masvingo Polytechnic has a long-standing commitment to providing quality technical and vocational education to the Masvingo community and beyond. We believe that a partnership with your organization, which has a strong reputation in [mention area of expertise], would greatly benefit our students and contribute to the development of skilled professionals in the region.

We are particularly interested in exploring opportunities for:
- Student internships and work placements.
- Joint research projects and knowledge sharing.
- Curriculum development and industry input.
- Guest lectures from your staff.

We believe that a collaborative partnership would be mutually beneficial, enabling us to enhance our educational programs and provide your organization with access to skilled graduates.

We would be delighted to schedule a meeting to discuss potential areas of collaboration in more detail. Please feel free to contact me at [Phone Number] or [Email Address] to arrange a convenient time.

Thank you for your consideration.

Yours faithfully,

[Signature]
Mr. T. Mutasa
Principal
Masvingo Polytechnic`}
                </div>
              </div>
            </div>

            {/* SECTION 3: Arranging Meetings */}
            <div
              ref={(el) => {
                sectionRefs.current['arranging-meetings'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Arranging Meetings: Compliance and Best Practices
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Arranging meetings according to set rules for compliance is a structured process designed to ensure that meetings adhere to legal, regulatory, and organizational requirements. It's about establishing a framework that guarantees transparency, accountability, and proper documentation, particularly in contexts where decisions have significant implications. Compliance in meetings is crucial for avoiding legal challenges, maintaining ethical standards, and ensuring that decisions are made in a fair and auditable manner.
                  </p>
</div>

              {[
                { title: '1. Establish Clear Meeting Policies and Procedures', icon: <Shield size={16} />, content: (
                  <>
                    <p><strong>Document Rules:</strong> Create a comprehensive document outlining the organization's rules for conducting meetings. This should include guidelines on:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Notice periods for meetings.</li>
                      <li>Quorum requirements.</li>
                      <li>Voting procedures.</li>
                      <li>Minutes taking and distribution.</li>
                      <li>Confidentiality and data security.</li>
                      <li>Conflict of interest management.</li>
                      <li>Accessibility requirements.</li>
                    </ul>
                    <p><strong>Legal and Regulatory Compliance:</strong> Ensure that meeting policies comply with all relevant laws and regulations, such as data privacy laws, open meeting laws, and industry-specific regulations.</p>
                    <p><strong>Disseminate Policies:</strong> Make sure that all relevant personnel are aware of and understand the meeting policies.</p>
                  </>
                )},
                { title: '2. Plan the Meeting', icon: <Calendar size={16} />, content: (
                  <>
                    <p><strong>Define the Purpose:</strong> Clearly define the purpose of the meeting and the desired outcomes. This helps to ensure that the meeting stays focused and productive.</p>
                    <p><strong>Set the Agenda:</strong> Develop a detailed agenda that outlines the topics to be discussed, the order of discussion, and the time allocated to each topic. The agenda should be distributed to attendees in advance.</p>
                    <p><strong>Determine Attendance:</strong> Identify the individuals who are required or authorized to attend the meeting. Ensure that the attendance list complies with quorum requirements.</p>
                    <p><strong>Send Meeting Notices:</strong> Send out formal meeting notices to all attendees, including the date, time, location, and agenda. Adhere to the required notice period.</p>
                    <p><strong>Prepare Meeting Materials:</strong> Gather and distribute all necessary meeting materials, such as reports, presentations, and supporting documents, in advance.</p>
                  </>
                )},
                { title: '3. Conduct the Meeting', icon: <Users size={16} />, content: (
                  <>
                    <p><strong>Follow the Agenda:</strong> Stick to the agenda and ensure that all topics are discussed within the allocated time.</p>
                    <p><strong>Adhere to Voting Procedures:</strong> If voting is required, follow the established voting procedures. Ensure that all votes are properly recorded.</p>
                    <p><strong>Manage Conflicts of Interest:</strong> If any conflicts of interest arise, address them according to the organization's policies. This may involve recusal or disclosure.</p>
                    <p><strong>Maintain Order and Decorum:</strong> Ensure that the meeting is conducted in a professional and respectful manner.</p>
                    <p><strong>Record Minutes:</strong> Appoint someone to take accurate and detailed minutes of the meeting. The minutes should include:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Date, time, and location of the meeting.</li>
                      <li>List of attendees and absentees.</li>
                      <li>Summary of discussions.</li>
                      <li>Decisions made and actions taken.</li>
                      <li>Voting results.</li>
                      <li>Action items and responsible parties.</li>
                    </ul>
                  </>
                )},
                { title: '4. Follow Up After the Meeting', icon: <CheckSquare size={16} />, content: (
                  <>
                    <p><strong>Distribute Minutes:</strong> Distribute the meeting minutes to all attendees and relevant stakeholders within the required timeframe.</p>
                    <p><strong>Implement Action Items:</strong> Ensure that all action items are assigned and tracked. Follow up with responsible parties to ensure that actions are completed.</p>
                    <p><strong>Maintain Records:</strong> Keep accurate records of all meeting materials, including agendas, minutes, and supporting documents. Store these records in accordance with the organization's record retention policies.</p>
                    <p><strong>Review and Improve:</strong> Regularly review meeting policies and procedures to identify areas for improvement. Incorporate feedback from attendees to enhance the effectiveness of future meetings.</p>
                    <p><strong>Confidentiality:</strong> Ensure all attendees are aware of any confidential information, and that it is handled according to policy.</p>
                  </>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 4: Conduct Meetings According to Prescribed Agenda */}
            <div
              ref={(el) => {
                sectionRefs.current['conduct-meetings'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conduct Meetings According to Prescribed Agenda: Maximizing Efficiency
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conducting meetings according to a prescribed agenda is a fundamental practice for ensuring productivity, efficiency, and focus. It's not merely about having a list of topics; it's about adhering to a structured plan that guides the discussion, keeps participants on track, and facilitates the achievement of meeting objectives. A well constructed agenda provides a roadmap for the meeting, outlining the topics to be covered, the order of discussion, and the time allocated to each item. By sticking to the agenda, meetings become more organized, time-efficient, and outcome-oriented.
                  </p>
</div>

              {[
                { title: 'Agenda as a Roadmap and Timekeeper', icon: <MapPin size={16} />, content: (
                  <p>The prescribed agenda serves as a roadmap, guiding participants through the meeting and ensuring that all relevant topics are covered. It also acts as a timekeeper, helping to allocate time efficiently and prevent discussions from veering off-topic. By adhering to the agenda, the meeting stays focused and productive, maximizing the use of participants' time. The agenda also allows participants to prepare for the meeting, and gather relevant information. Participants can follow along, and know what to expect. This also allows the meeting to end on time, which is very important.</p>
                )},
                { title: 'Structured Discussion and Focused Outcomes', icon: <Target size={16} />, content: (
                  <p>A prescribed agenda provides a structured framework for discussion, ensuring that topics are addressed in a logical and sequential manner. This helps to prevent rambling and ensures that all relevant points are covered. The agenda also helps to focus the discussion on achieving specific outcomes. Each agenda item should have a clear objective, and the discussion should be directed towards achieving that objective. This focus on outcomes ensures that the meeting is productive and that decisions are made efficiently. It also ensures, that items are not missed.</p>
                )},
                { title: 'Efficient Time Management and Prevention of Tangents', icon: <Clock size={16} />, content: (
                  <p>One of the most significant benefits of adhering to a prescribed agenda is efficient time management. By allocating specific time slots to each agenda item, the meeting leader can prevent discussions from dragging on and ensure that all topics are addressed within the allotted time. The agenda also helps to prevent tangents and off-topic discussions, which can waste valuable time. When a discussion starts to stray, the agenda can be used to bring it back on track. This time management ensures that the meeting stays on schedule and that participants' time is used effectively.</p>
                )},
                { title: 'Clarity and Transparency for Participants', icon: <Eye size={16} />, content: (
                  <p>A prescribed agenda provides clarity and transparency for participants, ensuring that everyone is aware of the topics to be discussed and the expected outcomes. This allows participants to prepare for the meeting and contribute effectively. The agenda also helps to create a sense of fairness and impartiality, as all participants have an equal opportunity to contribute to the discussion. This clarity and transparency foster a collaborative and productive meeting environment. The pre-circulated agenda, allows participants to gather any information they may need.</p>
                )},
                { title: 'Documentation and Accountability', icon: <FileText size={16} />, content: (
                  <p>The prescribed agenda serves as a valuable document for recording meeting outcomes and ensuring accountability. The agenda can be used to track progress on action items and ensure that decisions are implemented. By adhering to the agenda, the meeting leader can ensure that accurate and complete minutes are taken, which serve as a record of the meeting's proceedings. The agenda, along with the minutes, create a record of what was discussed, and what decisions were made.</p>
                )},
                { title: 'Preparation and Organization', icon: <Clipboard size={16} />, content: (
                  <p>Creating a prescribed agenda requires careful preparation and organization. This includes identifying the key topics to be discussed, allocating time slots, and distributing the agenda to participants in advance. This preparation ensures that the meeting is well-organized and that participants are prepared to contribute effectively. The time allocated to each item, should be appropriate to the complexity of the item.</p>
                )},
                { title: 'Flexibility within Structure', icon: <Layers size={16} />, content: (
                  <p>While adhering to the prescribed agenda is essential, it's also important to maintain a degree of flexibility. Unexpected issues may arise during the meeting, or discussions may take longer than anticipated. The meeting leader should be prepared to adjust the agenda as needed, while still ensuring that the meeting's objectives are achieved. A good meeting leader, will be able to manage this flexibility.</p>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 5: Produce Accurate Records */}
            <div
              ref={(el) => {
                sectionRefs.current['accurate-records'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Produce Accurate Records for Meeting Proceedings
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Producing accurate records for meeting proceedings, commonly known as meeting minutes, is a critical practice for maintaining transparency, accountability, and continuity within an organization. These records serve as a formal and objective account of what transpired during a meeting, including discussions, decisions, and action items. They're not simply a summary; they're a legal and historical document that ensures that all participants have a shared understanding of the meeting's outcomes. Accurate meeting minutes are essential for tracking progress, resolving disputes, and ensuring compliance with regulatory requirements.
                  </p>
</div>

              {[
                { title: 'Comprehensive Capture of Essential Information', icon: <ClipboardList size={16} />, content: (
                  <p>Accurate meeting minutes should capture all essential information, including the date, time, and location of the meeting, a list of attendees and absentees, and a clear summary of the discussions and decisions made. This involves recording key points raised by participants, the rationale behind decisions, and any dissenting opinions. The minutes should reflect the substance of the discussion, not just the conclusions reached. This level of detail ensures that the minutes provide a complete and accurate representation of the meeting proceedings. The minutes should be written in a neutral, and objective tone.</p>
                )},
                { title: 'Precise Documentation of Action Items and Responsibilities', icon: <ListChecks size={16} />, content: (
                  <p>One of the most crucial aspects of accurate meeting minutes is the precise documentation of action items and assigned responsibilities. This involves clearly stating what actions need to be taken, who is responsible for each action, and the deadlines for completion. This level of detail ensures accountability and facilitates follow-up. Action items should be specific, measurable, achievable, relevant, and time bound (SMART). The minutes should also indicate any supporting materials or resources that are needed to complete the action items.</p>
                )},
                { title: 'Objective and Unbiased Language', icon: <Shield size={16} />, content: (
                  <p>Meeting minutes should be written in objective and unbiased language, avoiding personal opinions or interpretations. The goal is to provide a neutral and factual account of the meeting proceedings. This involves using clear and concise language and avoiding jargon or technical terms that may be misunderstood. The minutes should focus on the facts and avoid subjective judgments. This objectivity ensures that the minutes are reliable and credible.</p>
                )},
                { title: 'Verification and Approval Process', icon: <CheckSquare size={16} />, content: (
                  <p>To ensure accuracy, meeting minutes should undergo a verification and approval process. This may involve circulating the minutes to attendees for review and feedback before they are finalized. Any corrections or revisions should be documented and incorporated into the final version. The approved minutes should be signed or initialed by the meeting chair or designated authority. This process ensures that the minutes are accurate and that all participants have a shared understanding of the meeting's outcomes.</p>
                )},
                { title: 'Timely Distribution and Accessibility', icon: <Share2 size={16} />, content: (
                  <p>Accurate meeting minutes are only valuable if they are distributed in a timely manner and are easily accessible to relevant parties. Minutes should be distributed to attendees and other stakeholders as soon as possible after the meeting. They should be stored in a secure and accessible location, such as a shared drive or document management system. Timely distribution ensures that action items are addressed promptly and that decisions are implemented effectively. Accessibility ensures that the minutes are available for future reference.</p>
                )},
                { title: 'Compliance with Legal and Regulatory Requirements', icon: <ShieldCheck size={16} />, content: (
                  <p>Meeting minutes may be subject to legal and regulatory requirements, particularly in certain industries or organizations. Accurate and complete minutes are essential for demonstrating compliance and avoiding potential legal challenges. Organizations should establish clear policies and procedures for record retention and document security. This is particularly important for publicly traded companies, or government agencies.</p>
                )},
                { title: 'Use of Templates and Standardized Formats', icon: <FileText size={16} />, content: (
                  <p>Using templates and standardized formats can help to ensure consistency and accuracy in meeting minutes. This involves creating a predefined structure for the minutes, including sections for attendance, agenda items, discussions, decisions, and action items. Templates can also help to ensure that all essential information is captured. Standardized formats simplify the process of reviewing and comparing minutes from different meetings.</p>
                )},
                { title: 'Retention and Archiving', icon: <Archive size={16} />, content: (
                  <p>Meeting minutes should be retained and archived in accordance with the organization's record retention policies. This ensures that the minutes are available for future reference and that they are protected from loss or damage. Archiving procedures should be clearly defined and followed consistently. Digital archiving, is preferable.</p>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 6: Demonstration of Presentation Skills */}
            <div
              ref={(el) => {
                sectionRefs.current['presentation-skills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Demonstration of Presentation Skills: Engaging and Influencing Your Audience
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Demonstrating effective presentation skills is crucial in today's professional landscape. It's not simply about conveying information; it's about engaging an audience, building rapport, and delivering a message that resonates and drives action. Strong presentation skills are essential for influencing stakeholders, communicating complex ideas, and fostering collaboration. They involve a combination of verbal and nonverbal communication, visual aids, and audience engagement techniques. A successful presentation is one that is clear, concise, and compelling, leaving a lasting impact on the audience.
                  </p>
</div>

              {[
                { title: 'Clear and Concise Communication', icon: <MessageCircle size={16} />, content: (
                  <p>Effective presenters use clear and concise language, avoiding jargon or technical terms that may confuse the audience. They structure their message logically, using a clear introduction, body, and conclusion. They focus on the key points and avoid unnecessary details. Clarity is also found in the tone of voice, and the pacing of the words. The use of simple language, and short sentences, is also very helpful. The ability to articulate complex ideas in a simple, and easy to understand way, is a vital skill.</p>
                )},
                { title: 'Engaging Visual Aids', icon: <Layout size={16} />, content: (
                  <p>Visual aids, such as slides, charts, and graphs, can enhance the clarity and impact of a presentation. However, they should be used strategically and should complement, not replace, the spoken message. Visual aids should be visually appealing, easy to read, and relevant to the content of the presentation. A good presentation, will have a consistent theme, and color scheme. The use of relevant images, and short videos, can also be very helpful. The visuals should enhance the presentation, and not distract from it.</p>
                )},
                { title: 'Confident and Engaging Delivery', icon: <UserCheck size={16} />, content: (
                  <p>A confident and engaging delivery is essential for capturing and maintaining the audience's attention. This involves using appropriate body language, maintaining eye contact, and varying vocal tone and pace. Projecting enthusiasm and passion for the topic can also help to engage the audience. The presenter should appear comfortable and relaxed, even if they are nervous. Practicing the presentation beforehand, helps with confidence.</p>
                )},
                { title: 'Audience Engagement and Interaction', icon: <Users size={16} />, content: (
                  <p>Effective presenters engage their audience by asking questions, encouraging participation, and creating opportunities for interaction. This helps to create a dynamic and interactive presentation experience. It also allows the presenter to gauge the audience's understanding and address any questions or concerns. The use of polls, and Q&A sessions, are good ways to engage the audience. A good presenter, will be able to adapt their presentation to the audience's reactions.</p>
                )},
                { title: 'Storytelling and Narrative', icon: <BookOpen size={16} />, content: (
                  <p>Using storytelling and narrative techniques can make a presentation more memorable and impactful. This involves weaving a compelling story that connects with the audience on an emotional level. Stories can help to illustrate key points and make complex concepts more relatable. Personal anecdotes, and real world examples, are very effective. The narrative, should be relevant to the audience.</p>
                )},
                { title: 'Handling Questions and Feedback', icon: <HelpCircle size={16} />, content: (
                  <p>Effective presenters are prepared to handle questions and feedback from the audience. This involves listening carefully, providing clear and concise answers, and acknowledging different perspectives. They also know how to handle difficult questions or challenging situations. The ability to handle questions with confidence, and grace, is a very important skill.</p>
                )},
                { title: 'Adaptability and Flexibility', icon: <RefreshCw size={16} />, content: (
                  <p>Presenters should be able to adapt their presentation to the audience's needs and preferences. This might involve adjusting the level of detail, changing the pace, or incorporating new information. They should also be prepared to handle unexpected situations, such as technical difficulties or interruptions. The ability to think on ones feet, is very important.</p>
                )},
                { title: 'Use of Appropriate Technology', icon: <Layers size={16} />, content: (
                  <p>In today's digital age, presenters should be comfortable using technology, such as presentation software, video conferencing tools, and interactive whiteboards. They should also be able to troubleshoot any technical issues that may arise. However, the technology should not be the focus of the presentation. The technology, should enhance the presentation.</p>
                )},
                { title: 'Practice and Preparation', icon: <Calendar size={16} />, content: (
                  <p>Effective presentation skills are developed through practice and preparation. This involves rehearsing the presentation multiple times, anticipating potential questions, and familiarizing oneself with the technology and equipment. Practice builds confidence, and reduces anxiety.</p>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 7: Filling In and Completion of Evaluation Forms */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation-forms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Filling In and Completion of Evaluation Forms by Participants
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The process of having participants fill in and complete evaluation forms is a critical step in gathering feedback and assessing the effectiveness of training programs, workshops, presentations, or any other event where participant input is valued. It's not merely a formality; it's a valuable opportunity to obtain insights into participant experiences, identify areas for improvement, and ensure that future events are tailored to meet the needs of the audience. Well-designed evaluation forms, coupled with a clear and encouraging process, can yield valuable data that informs decision making and enhances the quality of future engagements.
                  </p>
</div>

              {[
                { title: 'Clear Instructions and Purpose Explanation', icon: <Info size={16} />, content: (
                  <p>Participants should be provided with clear and concise instructions on how to complete the evaluation form. This includes explaining the purpose of the evaluation, how the feedback will be used, and the importance of their honest and thoughtful responses. The purpose of the evaluation must be made clear, so that participants understand why the form is being given to them. This transparency builds trust and encourages participants to provide valuable feedback. If there are any specific sections of the form that require special attention, this should also be explained.</p>
                )},
                { title: 'Design of User-Friendly Evaluation Forms', icon: <FileText size={16} />, content: (
                  <p>The evaluation form itself should be designed to be user-friendly and easy to complete. This involves using clear and concise language, avoiding jargon, and providing ample space for written responses. The form should be logically organized, with questions grouped into relevant sections. The use of a mix of question types, such as multiple choice, rating scales, and open-ended questions, can provide a more comprehensive understanding of participant experiences. The form should not be overly long, and should be aesthetically pleasing.</p>
                )},
                { title: 'Provision of Sufficient Time and a Conducive Environment', icon: <Clock size={16} />, content: (
                  <p>Participants should be given sufficient time to complete the evaluation form without feeling rushed. A quiet and comfortable environment should be provided to minimize distractions and encourage thoughtful responses. Rushing the evaluation process can lead to incomplete or inaccurate feedback. If evaluations are done directly after a training, or presentation, ensure that there is a break period built into the schedule.</p>
                )},
                { title: 'Ensuring Anonymity and Confidentiality', icon: <Shield size={16} />, content: (
                  <p>Participants should be assured that their responses will be kept anonymous and confidential. This encourages them to provide honest and candid feedback without fear of reprisal. Anonymity can be achieved by using unmarked forms or by collecting completed forms in a sealed box. Confidentiality ensures that individual responses are not shared with unauthorized personnel. This assurance is vital for building trust and encouraging participants to provide meaningful feedback.</p>
                )},
                { title: 'Availability of Assistance and Clarification', icon: <HelpCircle size={16} />, content: (
                  <p>Participants should be given the opportunity to ask questions or seek clarification if they encounter any difficulties while completing the evaluation form. This might involve having a facilitator or support staff available to answer questions and provide assistance. This availability ensures that participants understand the questions and are able to provide accurate and relevant feedback.</p>
                )},
                { title: 'Collection and Processing of Completed Forms', icon: <Clipboard size={16} />, content: (
                  <p>A clear process should be established for collecting and processing completed evaluation forms. This might involve using a designated collection point or having participants submit forms electronically. The collected data should be processed and analyzed in a timely manner to ensure that the feedback is used effectively. The data should be stored securely.</p>
                )},
                { title: 'Expressing Appreciation for Participant Feedback', icon: <ThumbsUp size={16} />, content: (
                  <p>Participants should be thanked for taking the time to complete the evaluation form. Expressing appreciation for their feedback reinforces the importance of their input and encourages them to participate in future evaluations. This can be done verbally or in writing.</p>
                )},
                { title: 'Use of Digital Forms', icon: <Upload size={16} />, content: (
                  <p>Digital forms, such as online surveys, can streamline the evaluation process and improve data collection. Digital forms allow for easy data analysis, and can be set to automatically generate reports. Digital forms also reduce the amount of paper used.</p>
                )},
                { title: 'Follow Up', icon: <Mail size={16} />, content: (
                  <p>When appropriate, inform the participants of any changes that were made, based on their feedback. This shows the participants that their time and input was valued.</p>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 8: Participant Register */}
            <div
              ref={(el) => {
                sectionRefs.current['participant-register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Participant Register: Maintaining Accurate and Up-to-Date Records
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Producing a complete participant register is essential for accurate record-keeping, effective communication, and efficient management of events, training programs, or any activity involving a group of individuals. It's not just a list of names; it's a comprehensive document that captures vital information about each participant, ensuring that you have a reliable and up-to-date record. A well-maintained participant register facilitates tracking attendance, distributing materials, issuing certificates, and communicating with participants.
                  </p>
</div>

              {[
                { title: 'Gathering Essential Participant Information', icon: <User size={16} />, content: (
                  <p>The register should include core information such as the participant's full name, contact details (phone number, email address, postal address), and any relevant identification numbers. Depending on the context, you may also need to collect information such as their organization, job title, or specific dietary requirements. It is vital to determine what data is required, before the event. This allows for the collection of all needed data.</p>
                )},
                { title: 'Utilizing Standardized Data Collection Methods', icon: <ClipboardList size={16} />, content: (
                  <p>To ensure consistency and accuracy, use standardized data collection methods. This might involve using registration forms, online registration systems, or sign-in sheets. The chosen method should be user-friendly and efficient, minimizing the risk of errors. Standardized forms, also allow for easy data entry, into electronic systems.</p>
                )},
                { title: 'Maintaining Accuracy and Completeness', icon: <Check size={16} />, content: (
                  <p>Accuracy is paramount in a participant register. Double-check all information for errors and ensure that all fields are completed. Regularly update the register to reflect any changes in participant information. This includes things like updated phone numbers, and email addresses. A register with inaccurate data, is useless.</p>
                )},
                { title: 'Implementing Secure Data Storage', icon: <Lock size={16} />, content: (
                  <p>Participant registers often contain sensitive personal information. It's crucial to implement secure data storage practices to protect this information from unauthorized access or disclosure. This might involve using password-protected databases, encrypted files, or secure cloud storage. Adhering to data privacy regulations is also essential.</p>
                )},
                { title: 'Creating a User-Friendly Format', icon: <Layout size={16} />, content: (
                  <p>The participant register should be formatted in a clear and user-friendly manner. This might involve using spreadsheets, databases, or specialized event management software. The format should allow for easy searching, sorting, and filtering of participant information. The register should be easy to read, and understand.</p>
                )},
                { title: 'Including Attendance Tracking', icon: <Calendar size={16} />, content: (
                  <p>If applicable, the participant register should include a section for tracking attendance. This might involve using sign-in sheets, barcode scanners, or electronic attendance tracking systems. Attendance tracking allows you to monitor participant engagement and generate attendance reports. This information is very useful for reporting, and for certification purposes.</p>
                )},
                { title: 'Adding Relevant Notes and Comments', icon: <PenTool size={16} />, content: (
                  <p>The register should allow for the addition of relevant notes and comments. This might include information about participant preferences, special needs, or any other relevant details. These notes can be helpful for personalizing communications and providing tailored support.</p>
                )},
                { title: 'Regularly Backing Up Data', icon: <HardDriveIcon size={16} />, content: (
                  <p>To prevent data loss, it's crucial to regularly back up the participant register. This might involve creating copies of the register on external drives, cloud storage, or other secure locations. Regular backups ensure that you have a reliable record of participant information, even in the event of technical difficulties.</p>
                )},
                { title: 'Data Protection Compliance', icon: <ShieldCheck size={16} />, content: (
                  <p>Ensure all data collection, storage, and usage complies with relevant data protection regulations, such as GDPR or local equivalents. Obtain necessary consent from participants for data collection and usage.</p>
                )},
                { title: 'Using the Register for Communication', icon: <Mail size={16} />, content: (
                  <p>The register should be used to communicate with participants. This includes sending out important information, such as event updates, schedule changes, or follow-up materials. The register can also be used to send out surveys, or other feedback requests.</p>
                )},
              ].map(({ title, icon, content }) => (
                <div key={title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    {icon} {title}
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    {content}
                  </div>
                </div>
              ))}
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
                  <span>Memos & Letters Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Meeting Compliance Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Presentation Skills</span>
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
                Professional communication is built on clear, well-structured memos and letters, effective meeting management, accurate records, and strong presentation skills. Always tailor your message to your audience, follow organisational standards, and ensure timely submission and follow-up. These skills are essential for success in any organisation.
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
                <strong className="text-white">Memos & Letters</strong> – follow a structured process: define purpose, gather information, format correctly, write clearly, review, and adhere to standards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Meetings</strong> – comply with policies, plan with clear agendas, conduct meetings efficiently, and follow up with accurate minutes and action items.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Accurate Records</strong> – capture essential information, document action items, use objective language, and ensure timely distribution and secure storage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Presentation Skills</strong> – communicate clearly, use engaging visual aids, deliver confidently, interact with the audience, and practice thoroughly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evaluation & Registers</strong> – design user-friendly forms, ensure anonymity, process feedback, and maintain accurate, secure participant registers.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Memos &amp; Letters 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
