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
  Mail,
  User,
  Headphones,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
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
  FileText as FileTextIcon,
  MessageSquare as MessageSquareIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'communication-procedures', label: 'Communication Procedures' },
  { id: 'customer-problems', label: 'Customer Service' },
  { id: 'scheduling-meetings', label: 'Scheduling Meetings' },
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
        text: 'The first customer service call center was established in the 1960s by the airline industry. Today, customer service has evolved into a multi-billion dollar industry.',
      },
      {
        title: 'Pro Tip',
        text: 'Always listen actively to customers before offering solutions. Often, customers just want to feel heard and understood before they accept a resolution.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 steps for solving customer problems: Understand Standards → Listen → Gather Info → Provide Solutions → Use Resources → Stay Professional → Document → Escalate → Seek Feedback → Comply with Regulations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to document customer interactions. Proper documentation protects both the customer and the organisation and helps improve future service.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first customer service call center was established in the 1960s by the airline industry. Today, customer service has evolved into a multi-billion dollar industry.',
      },
      {
        title: 'Pro Tip',
        text: 'Always listen actively to customers before offering solutions. Often, customers just want to feel heard and understood before they accept a resolution.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 steps for solving customer problems: Understand Standards → Listen → Gather Info → Provide Solutions → Use Resources → Stay Professional → Document → Escalate → Seek Feedback → Comply with Regulations.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to document customer interactions. Proper documentation protects both the customer and the organisation and helps improve future service.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Communication Procedures &{' '}
            <span className="text-purple-300 font-bold italic">
              Customer Service
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Comprehensive guide to communication procedures, solving customer problems, and scheduling departmental meetings.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Mail size={14} className="inline mr-1" /> Communication Procedures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Headphones size={14} className="inline mr-1" /> Customer Service
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calendar size={14} className="inline mr-1" /> Meeting Scheduling
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
                placeholder="Search for a concept, policies, customer service..."
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
            {/* SECTION 1: Communication Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['communication-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Communication Procedures: Ensuring Clarity and Professionalism
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Adhering to appropriate communication procedures in line with company policy is a fundamental aspect of maintaining a cohesive and professional work environment. It's not merely about sending emails or making phone calls; it's about ensuring that all communication, both internal and external, reflects the organization's values, protects its interests, and complies with legal and ethical standards. Following these procedures fosters clear, consistent, and respectful communication, minimizing misunderstandings and promoting a positive organizational culture.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <BookOpen size={16} /> Understanding and Internalizing Company Communication Policies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The first step involves thoroughly understanding and internalizing the company's communication policies. These policies typically cover a wide range of topics, including email etiquette, social media usage, internal and external communication protocols, confidentiality, data security, and brand voice. It's crucial to go beyond simply reading the policy document and to actively seek clarification on any points that are unclear. This ensures that you have a comprehensive understanding of the organization's expectations and can apply them consistently in your daily communication. A deep understanding of these policies helps prevent accidental breaches of protocol, and ensures all employees are communicating in a uniform manner.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <LayersIcon size={16} /> Selecting the Appropriate Communication Channels for Different Situations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Different communication channels are appropriate for different types of messages and audiences. Company policies often outline specific channels for various communication scenarios. For instance, formal announcements may require official memos or emails, while quick updates may be best conveyed through instant messaging or phone calls. Choosing the right channel ensures that the message is delivered effectively and efficiently. It also helps to maintain a clear distinction between formal and informal communication. Using approved communication channels, also helps to protect company data.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Users size={16} /> Maintaining Professionalism and Respect in All Communications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Professionalism and respect should be the cornerstones of all communication, regardless of the channel or audience. This involves using appropriate language and tone, avoiding offensive or discriminatory remarks, and being mindful of cultural differences. It also entails respecting confidentiality and avoiding the disclosure of sensitive information. Maintaining a professional demeanor builds trust and fosters positive working relationships, both internally and externally. This also aids in preventing any legal issues, that could arise from unprofessional communication.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Shield size={16} /> Adhering to Confidentiality and Data Security Protocols
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Protecting sensitive information is paramount in today's business environment. Company policies often include strict guidelines on confidentiality and data security. This involves avoiding the sharing of confidential information with unauthorized individuals, using secure communication channels, and complying with data privacy regulations. It's also crucial to be mindful of the information shared on social media and to avoid discussing internal company matters in public forums. A company's reputation, and legal standing, can be severely damaged by breaches in confidentiality.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Archive size={16} /> Documenting Important Communications for Record-Keeping and Accountability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Maintaining accurate records of important communications is essential for record-keeping and accountability. This might involve saving emails, instant messages, or chat logs, taking notes during meetings, or documenting phone calls. These records provide a clear audit trail and can be invaluable in resolving disputes or clarifying misunderstandings. It is also important to know how long certain records must be kept, according to company policy, and legal requirements.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> Following Brand Voice and Messaging Guidelines in External Communications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  When communicating with external stakeholders, it's crucial to adhere to the company's brand voice and messaging guidelines. This ensures consistency and reinforces the company's image. All external communications should reflect the organization's values and promote a positive perception of the brand. This also helps to ensure that all marketing, and public relations, materials are consistent.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <ClockIcon size={16} /> Responding Promptly and Appropriately to Communications
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Prompt and appropriate responses to communications demonstrate professionalism and respect for others' time. This involves acknowledging receipt of messages, providing timely updates, and addressing any questions or concerns. It is also important to be mindful of response times, and to set expectations accordingly.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Utilizing Approved Communication Tools and Platforms
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Using only approved communication tools and platforms, such as company email, instant messaging systems, or project management software, ensures data security and compliance with company policies. This also helps to maintain consistency in communication practices across the organization.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <SearchIcon size={16} /> Seeking Clarification When Unsure
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  If you are unsure about any aspect of the company's communication policies, seek clarification from your supervisor or HR department. It is better to ask, than to make a mistake.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ListChecks size={16} /> Regular Review of Policies and Updates
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Company communication policies can evolve, and it is important to stay informed of any updates or changes. Regularly reviewing policy documents ensures that you are adhering to the most current guidelines.
                </p>
              </div>
            </div>

            {/* SECTION 2: Solving Customers' Problems */}
            <div
              ref={(el) => {
                sectionRefs.current['customer-problems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Solving Customers' Problems: Meeting Service Standards and Building Loyalty
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Solving customers' problems and queries in line with set service standards is a critical aspect of building customer loyalty and maintaining a positive brand reputation. It's not just about providing answers; it's about delivering solutions that meet or exceed customer expectations while adhering to established service protocols. This approach ensures consistency, efficiency, and a high level of customer satisfaction.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> Understanding and Applying Service Standards
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Familiarize yourself with the organization's service standards, which outline expected behaviors, response times, and problem-solving procedures. These standards are designed to ensure consistent and high-quality customer service.</li>
                  <li>Internalize these standards so that they become second nature in your customer interactions.</li>
                  <li>If the standards are not clear, seek clarification from management.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Users size={16} /> Active Listening and Empathy
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Listen attentively to the customer's problem or query, demonstrating empathy and understanding.</li>
                  <li>Acknowledge their concerns and show that you are genuinely interested in helping them.</li>
                  <li>Avoid interrupting or making assumptions.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <SearchIcon size={16} /> Accurate Information Gathering
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Ask clarifying questions to gather all relevant information needed to understand the customer's issue.</li>
                  <li>Ensure that you have a complete picture of the situation before attempting to provide a solution.</li>
                  <li>If needed, utilize CRM or other company tools to find customer information.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ClockIcon size={16} /> Providing Timely and Accurate Solutions
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Provide solutions that are accurate, relevant, and timely, in line with the service standards.</li>
                  <li>If you are unable to provide an immediate solution, inform the customer of the steps you will take and the expected timeframe.</li>
                  <li>Always follow through on your commitments.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Database size={16} /> Utilizing Company Resources and Knowledge Bases
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Utilize company resources, such as knowledge bases, FAQs, and internal support systems, to find accurate and up-to-date information.</li>
                  <li>This ensures that you are providing consistent and reliable solutions.</li>
                  <li>If you cannot find the answer, escalate the issue to the appropriate team or supervisor.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Maintaining Professionalism and Courtesy
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Maintain a professional and courteous demeanor throughout the interaction, even when dealing with difficult customers.</li>
                  <li>Use positive language and avoid negative or defensive statements.</li>
                  <li>Always thank the customer for their patience and understanding.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <FileText size={16} /> Documenting Customer Interactions
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Document all customer interactions, including the nature of the problem or query, the solutions provided, and any follow-up actions taken.</li>
                  <li>This helps to maintain accurate records and provides valuable insights for improving customer service.</li>
                  <li>Proper documentation can also protect the company in any future disputes.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <LayersIcon size={16} /> Following Escalation Procedures
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>If you are unable to resolve a customer's issue, follow the established escalation procedures.</li>
                  <li>This ensures that the issue is addressed by the appropriate team or supervisor.</li>
                  <li>Clearly communicate the escalation process to the customer.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Target size={16} /> Seeking Feedback and Continuous Improvement
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Seek feedback from customers to identify areas for improvement.</li>
                  <li>Use this feedback to refine your problem-solving skills and enhance the customer experience.</li>
                  <li>Stay updated on changes to company policies, products, and services.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Shield size={16} /> Adhering to Legal and Regulatory Requirements
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Be aware of, and adhere to, any legal and regulatory requirements that relate to customer service within your industry.</li>
                  <li>This is especially important in industries such as finance, healthcare, and telecommunications.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Scheduling Departmental Meetings */}
            <div
              ref={(el) => {
                sectionRefs.current['scheduling-meetings'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Scheduling Departmental Meetings to an Events Calendar: Enhancing Organization and Communication
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Scheduling departmental meetings to an events calendar is a fundamental practice that fosters organizational efficiency, transparency, and collaboration. It transcends the simple act of noting appointments; it's a strategic approach to managing time, coordinating schedules, and ensuring that all relevant parties are informed and prepared. By integrating departmental meetings into a centralized events calendar, organizations create a shared resource that minimizes scheduling conflicts, enhances communication, and promotes accountability. A well-maintained events calendar serves as a vital tool for streamlining operations and maximizing productivity.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Calendar size={16} /> Centralized Visibility and Coordination
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Integrating departmental meetings into a shared events calendar provides a centralized hub for all scheduling information. This eliminates the confusion and potential conflicts that can arise from relying on individual calendars or scattered communication. All department members gain a clear overview of upcoming meetings, allowing them to plan their schedules accordingly. This centralized visibility fosters better coordination, minimizes double-bookings, and ensures that everyone is on the same page. This allows for better time management, and reduces the chance of missed meetings. When all team members, have access to the same information, it creates a much more efficient workflow.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <ClockIcon size={16} /> Minimizing Scheduling Conflicts and Maximizing Attendance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  By utilizing an events calendar, departments can proactively identify and resolve potential scheduling conflicts. Before scheduling a meeting, individuals can check the calendar to ensure that there are no overlapping appointments or conflicting commitments. This proactive approach minimizes disruptions and maximizes attendance. Calendar systems, also allow for the setting of reminders, which greatly increases attendance. This is especially important for meetings that are scheduled well in advance. Having a clear view of other scheduled meetings, also allows for the scheduling of meetings at times, that are convenient for the most amount of people.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <MessageSquare size={16} /> Enhancing Communication and Information Sharing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  An events calendar serves as a valuable tool for enhancing communication and information sharing within the department. Meeting details, such as agendas, locations, and required attendees, can be easily added to the calendar event. This ensures that all participants have access to the necessary information before the meeting. Furthermore, calendar systems often include features for sending notifications and reminders, keeping everyone informed of any changes or updates. This also allows for the sharing of relevant documents, before the meeting. This promotes a culture of transparency and ensures that everyone is well-prepared.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <ListChecks size={16} /> Promoting Accountability and Tracking Meeting Outcomes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Scheduling meetings on an events calendar promotes accountability by creating a clear record of when meetings were held and who attended. This information can be valuable for tracking meeting outcomes and ensuring that action items are followed up on. Additionally, calendar systems may allow for the attachment of meeting minutes or other relevant documents, providing a comprehensive record of the meeting proceedings. This creates a valuable historical record, that can be accessed at a later date. This also ensures that there is a record of decisions, and action items.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Streamlining Meeting Scheduling Processes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Utilizing an events calendar streamlines meeting scheduling processes by providing a user-friendly interface for creating and managing meeting invitations. This eliminates the need for manual scheduling or cumbersome email exchanges. Calendar systems often include features for setting recurring meetings, sending automatic reminders, and managing attendee responses. This automation saves time and effort, allowing department members to focus on more important tasks. This also reduces the chance of human error, during the scheduling process.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <GlobeIcon size={16} /> Supporting Remote and Hybrid Work Environments
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  In today's increasingly remote and hybrid work environments, an events calendar is essential for coordinating schedules and facilitating communication. Calendar systems often integrate with video conferencing platforms, allowing for seamless scheduling of virtual meetings. This ensures that remote participants can easily access meeting links and participate effectively. This is vital for maintaining good communication, within a dispersed team.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Target size={16} /> Improving Time Management and Productivity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  By having a clear overview of upcoming meetings, department members can better manage their time and prioritize tasks. This helps to improve overall productivity and ensures that deadlines are met. An events calendar also allows for the allocation of specific time slots for meetings, preventing them from encroaching on other important activities. This allows for better planning of daily workloads.
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
                  <span>Communication Key Points</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Customer Service Steps</span>
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
                Effective communication procedures ensure professionalism and consistency. Customer service is about meeting service standards, listening actively, and providing timely solutions. Scheduling meetings on a shared events calendar improves coordination, reduces conflicts, and enhances transparency. Master these skills to build trust and efficiency in any organisation.
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
                <strong className="text-white">Communication Procedures</strong> – understand and follow company policies, choose appropriate channels, maintain professionalism, protect confidentiality, document communications, and stay updated on policy changes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Customer Problem Solving</strong> – apply service standards, listen actively, gather accurate information, provide timely solutions, use company resources, maintain professionalism, document interactions, follow escalation procedures, seek feedback, and comply with regulations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Scheduling Meetings</strong> – use a shared events calendar for centralised visibility, minimise conflicts, enhance communication, promote accountability, streamline processes, support remote work, and improve time management.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – Communication &amp; Customer Service 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
