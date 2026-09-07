import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Type,
  Edit,
  Hash,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  AlertTriangle,
  Eye,
  ShieldAlert,
  ClipboardMinus,
  FileWarning,
  Clock,
  Scale,
  UserRoundX,
  HandPlatter,
  Computer,
  MessageSquareWarning,
  UsersRound,
  FileStack,
  FileSearch,
  NotepadText,
  MessageSquare,
  CheckCircle,
  Gavel,
  ChevronRight,
  BadgeCheck,
  Microscope,
  ScrollText,
  DoorOpen, 
  Lock,
  ClipboardList,
  Users,
  Archive,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'review', label: 'Review Process' },
  { id: 'appeal', label: 'Appeal Process' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'powers', label: 'Investigator Powers' },
  { id: 'completion', label: 'Completion Procedures' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome9: React.FC = () => {
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
        text: 'The most common challenges in procurement include lack of transparency, corruption, inefficient planning, and poorly defined specifications. Addressing these requires strong governance and oversight.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every step of the procurement review process. Thorough documentation ensures accountability and provides a clear audit trail in case of appeals or investigations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key challenges in procurement with the acronym "T-C-I-L-D-S-T": Transparency, Corruption, Inefficient planning, Legal compliance, Delays, Supplier performance, Technology.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of a structured appeal process. A clear and fair appeal mechanism builds trust and reduces the risk of protracted disputes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The most common challenges in procurement include lack of transparency, corruption, inefficient planning, and poorly defined specifications. Addressing these requires strong governance and oversight.',
      },
      {
        title: 'Pro Tip',
        text: 'Always document every step of the procurement review process. Thorough documentation ensures accountability and provides a clear audit trail in case of appeals or investigations.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key challenges in procurement with the acronym "T-C-I-L-D-S-T": Transparency, Corruption, Inefficient planning, Legal compliance, Delays, Supplier performance, Technology.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of a structured appeal process. A clear and fair appeal mechanism builds trust and reduces the risk of protracted disputes.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PUBLIC PROCUREMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Procurement Challenges &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Review Processes
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to procurement challenges, review panels, appeal processes, investigations, and investigator powers.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Challenges
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <UsersRound size={14} className="inline mr-1" /> Review Process
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Appeals
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Investigations
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
                placeholder="Search for a challenge, review step, investigator power..."
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
            {/* SECTION 1: Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Procurement Challenges &amp; Review
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement proceedings, especially in the public sector, are complex and fraught with potential challenges. This learning outcome covers the common challenges in procurement, the review process conducted by review panels, the appeal mechanisms available to affected parties, the investigation process by authorities, and the powers of investigators.
                  </p>
</div>
            </div>

            {/* SECTION 2: Challenges in Procurement Proceedings */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Procurement Proceedings
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement proceedings, especially in the public sector, are complex and fraught with potential challenges. These challenges can hinder efficiency, transparency, and value for money.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Lack of Transparency and Accountability',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Insufficient disclosure of information about procurement processes, decisions, and outcomes. Weak mechanisms for holding procurement officials accountable for their actions.</p>
                        <p><strong>Impact:</strong> Increased risk of corruption and fraud. Erosion of public trust. Difficulty in detecting and addressing irregularities.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Corruption and Fraud',
                    icon: <ShieldAlert size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Bribery, bid rigging, collusion, and other forms of corruption. Fraudulent activities, such as falsifying documents or misrepresenting qualifications.</p>
                        <p><strong>Impact:</strong> Loss of public funds. Distortion of competition. Damage to the integrity of the procurement system.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Inefficient Planning and Needs Assessment',
                    icon: <ClipboardMinus size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Inadequate planning and needs assessment, leading to unclear specifications and unrealistic requirements. Lack of coordination between different departments or agencies.</p>
                        <p><strong>Impact:</strong> Procurement of unsuitable goods or services. Delays and cost overruns. Wasted resources.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Poorly Defined Specifications and Evaluation Criteria',
                    icon: <FileWarning size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Vague or ambiguous specifications that do not accurately describe the required goods or services. Subjective or biased evaluation criteria.</p>
                        <p><strong>Impact:</strong> Difficulty in comparing bids and selecting the most advantageous offer. Disputes and legal challenges. Compromised quality of goods or services.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Delays and Time Overruns',
                    icon: <Clock size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Lengthy procurement processes, bureaucratic delays, and inefficient procedures. Poor project management and coordination.</p>
                        <p><strong>Impact:</strong> Increased costs. Missed deadlines and project delays. Disruption of public services.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Legal and Regulatory Compliance',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Complex and constantly changing procurement laws and regulations. Lack of understanding or compliance with legal requirements.</p>
                        <p><strong>Impact:</strong> Legal challenges and disputes. Penalties and fines. Delays and disruptions.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Inadequate Capacity and Skills',
                    icon: <UserRoundX size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Lack of qualified procurement professionals with the necessary skills and expertise. Insufficient training and capacity building.</p>
                        <p><strong>Impact:</strong> Inefficient procurement processes. Poor contract management. Increased risk of errors and irregularities.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Supplier Performance and Contract Management',
                    icon: <HandPlatter size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Poor supplier performance and non-compliance with contract terms. Weak contract management and monitoring.</p>
                        <p><strong>Impact:</strong> Delays and cost overruns. Compromised quality of goods or services. Disputes and legal challenges.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. Technological Challenges',
                    icon: <Computer size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Lack of access to or effective use of e-procurement platforms and other technologies. Cybersecurity risks and data breaches.</p>
                        <p><strong>Impact:</strong> Inefficiencies and delays. Increased vulnerability to fraud and corruption. Reduced transparency.</p>
                      </>
                    ),
                  },
                  {
                    title: '10. Stakeholder Engagement and Communication',
                    icon: <MessageSquareWarning size={16} />,
                    content: (
                      <>
                        <p><strong>Issue:</strong> Lack of effective communication and engagement with stakeholders, including suppliers, civil society, and the public. Insufficient feedback mechanisms.</p>
                        <p><strong>Impact:</strong> Lack of trust and confidence in the procurement process. Missed opportunities for collaboration and innovation. Increased risk of disputes.</p>
                      </>
                    ),
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

            {/* SECTION 3: The Review Process */}
            <div
              ref={(el) => {
                sectionRefs.current['review'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Review Process
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The review process by a review panel, especially in the context of procurement or similar competitive processes, is designed to ensure fairness, transparency, and objectivity.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Establishment of the Review Panel',
                    icon: <UsersRound size={16} />,
                    content: (
                      <>
                        <p><strong>Composition:</strong> Typically composed of individuals with relevant expertise, experience, and impartiality. Members may include technical experts, financial analysts, legal professionals, and representatives from relevant departments. The panel should be free from conflicts of interest.</p>
                        <p><strong>Mandate:</strong> Clearly defined, outlining responsibilities and authority, including the scope of the review, evaluation criteria, and procedures.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Review Initiation',
                    icon: <FileStack size={16} />,
                    content: (
                      <>
                        <p><strong>Submission of Documents:</strong> All relevant documents, such as bids, proposals, evaluation reports, and supporting materials, are provided in a standardized format.</p>
                        <p><strong>Briefing:</strong> The panel may receive a briefing on the background of the procurement, requirements, and evaluation process.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Review and Evaluation',
                    icon: <FileSearch size={16} />,
                    content: (
                      <>
                        <p><strong>Independent Assessment:</strong> Each panel member independently reviews and evaluates documents based on predetermined criteria.</p>
                        <p><strong>Technical Evaluation:</strong> Technical experts assess specifications, methodologies, and qualifications.</p>
                        <p><strong>Financial Evaluation:</strong> Financial analysts review pricing, cost breakdowns, and financial stability.</p>
                        <p><strong>Compliance Review:</strong> Legal professionals review for legal and regulatory compliance.</p>
                        <p><strong>Documentation Review:</strong> Verification that all procedures were followed correctly.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Deliberation and Discussion',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <>
                        <p><strong>Panel Meetings:</strong> Panel members share their evaluations, raise questions, and address discrepancies.</p>
                        <p><strong>Consensus Building:</strong> Strive for consensus on evaluation results and recommendations. Dissenting opinions may be recorded.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Reporting and Recommendations',
                    icon: <NotepadText size={16} />,
                    content: (
                      <>
                        <p><strong>Preparation of Report:</strong> Comprehensive report summarizing findings, evaluations, and recommendations with detailed justifications.</p>
                        <p><strong>Submission:</strong> Report submitted to the appropriate authority (e.g., head of procuring entity or designated committee).</p>
                        <p><strong>Recommendations:</strong> May include confirming results, recommending changes, corrective actions, or a full re-tender.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Decision and Follow-up',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Decision Making:</strong> Appropriate authority reviews the panel's report and makes a final decision.</p>
                        <p><strong>Notification:</strong> Decision communicated to relevant parties.</p>
                        <p><strong>Implementation:</strong> Any corrective actions are implemented.</p>
                        <p><strong>Documentation:</strong> All documentation retained.</p>
                      </>
                    ),
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

              {renderCard(
                'Principles',
                <BadgeCheck size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Impartiality:</strong> The review panel must be impartial and free from bias.</li>
                    <li><strong>Objectivity:</strong> The evaluation must be based on objective criteria and evidence.</li>
                    <li><strong>Transparency:</strong> The review process should be transparent and documented.</li>
                    <li><strong>Confidentiality:</strong> Confidential information must be protected.</li>
                    <li><strong>Accountability:</strong> The review panel is accountable for its findings and recommendations.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Appeal Process */}
            <div
              ref={(el) => {
                sectionRefs.current['appeal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Appeal Process
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An appeal process against the decisions of a review panel provides a mechanism for parties to challenge the panel's findings and seek redress if they believe the review was flawed or unfair.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Grounds for Appeal',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Procedural Irregularities:</strong> The review panel did not follow the established procedures.</li>
                          <li><strong>Bias or Conflict of Interest:</strong> A panel member had a conflict of interest or demonstrated bias.</li>
                          <li><strong>Errors in Evaluation:</strong> The panel made errors in evaluating the bids or proposals.</li>
                          <li><strong>New Evidence:</strong> New evidence has come to light that was not available during the initial review.</li>
                          <li><strong>Misinterpretation of Law or Regulations:</strong> The panel misinterpreted or misapplied relevant laws or regulations.</li>
                          <li><strong>Unreasonable or Arbitrary Decision:</strong> The panel's decision was unreasonable or arbitrary.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '2. Filing an Appeal',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Notice of Appeal:</strong> Formal notice filed within a specified timeframe, stating grounds and providing evidence.</p>
                        <p><strong>Supporting Documents:</strong> Copies of original bid, review panel report, evidence of irregularities, legal arguments.</p>
                        <p><strong>Fees:</strong> May be associated with filing an appeal.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Review of the Appeal',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p><strong>Independent Review Body:</strong> Typically a higher-level review board, administrative tribunal, or court of law.</p>
                        <p><strong>Review of Evidence:</strong> Examines evidence submitted by both parties, may request additional information or hold hearings.</p>
                        <p><strong>Legal and Procedural Review:</strong> Assesses whether the review panel followed correct procedures and applied the law correctly.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Decision and Outcome',
                    icon: <Gavel size={16} />,
                    content: (
                      <>
                        <p><strong>Decision:</strong> May uphold, overturn, or modify the panel's decision, or order a re-evaluation or new review.</p>
                        <p><strong>Remedies:</strong> May include awarding the contract, compensation, or corrective actions.</p>
                        <p><strong>Notification:</strong> Decision communicated to all relevant parties.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Further Appeals',
                    icon: <ChevronRight size={16} />,
                    content: (
                      <>
                        <p>In some cases, the appealing party may have the right to further appeals to higher authorities or courts of law, depending on applicable laws and regulations.</p>
                      </>
                    ),
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

              {renderCard(
                'Considerations',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Time Limits:</strong> Strict time limits are typically imposed for filing appeals.</li>
                    <li><strong>Evidence:</strong> The appealing party must provide strong evidence to support their claims.</li>
                    <li><strong>Legal Counsel:</strong> It is advisable to seek legal counsel when filing an appeal.</li>
                    <li><strong>Transparency:</strong> The appeal process should be transparent and documented.</li>
                    <li><strong>Impartiality:</strong> The review body must be impartial and free from bias.</li>
                    <li><strong>Jurisdiction:</strong> The appeal process depends on the jurisdiction.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 5: Investigations by Authority */}
            <div
              ref={(el) => {
                sectionRefs.current['investigations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Investigations by Authority
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine a police officer investigating a crime. They follow certain steps: gather evidence, interview witnesses, look at documents, and decide if someone broke the law. That's what an authority does when they investigate something, but they might be looking into things like fraud, corruption, or rule-breaking in government or business.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Initiation of Investigation',
                    icon: <FileSearch size={16} />,
                    content: (
                      <>
                        <p><strong>How the investigation starts.</strong> Can be initiated by a complaint, information from other agencies, internal audit report, media reports, or routine monitoring. The authority must have a legal basis to initiate the investigation.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Gathering Evidence',
                    icon: <Search size={16} />,
                    content: (
                      <>
                        <p><strong>Collecting clues and information.</strong> Involves conducting interviews, collecting documents and electronic data, performing site visits, obtaining forensic evidence, and using surveillance. Evidence must be collected lawfully and ethically.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Interviews and Interrogations',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Talking to people to get their side of the story.</strong> Interviews gather information from witnesses and suspects; interrogations are more formal. Individuals have the right to legal representation. Statements must be recorded accurately and voluntarily.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Document Review and Analysis',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Looking at papers and computer files to find information.</strong> Examines financial records, emails, contracts, and other documents. Forensic analysis may be used to recover deleted data or authenticate documents.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Report Preparation',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p><strong>Writing down what they found and what it means.</strong> A detailed report summarizing allegations, evidence, analysis, conclusions, and recommendations. The report must be objective, impartial, and evidence-based.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Decision and Action',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Deciding what to do next.</strong> May include referring the case for criminal prosecution, imposing administrative sanctions, recommending policy changes, or closing the investigation. Decision must be based on evidence and consistent with laws.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Confidentiality and Transparency',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Keeping some things secret and telling the public other things.</strong> Sensitive information must be kept confidential to protect integrity and rights. Authorities also have a duty to be transparent and accountable.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Legal Compliance and Due Process',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p><strong>Following all the rules and being fair to everyone.</strong> All investigative procedures must comply with applicable laws and regulations. Individuals have the right to due process, including the right to be heard and present evidence.</p>
                      </>
                    ),
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

            {/* SECTION 6: The Powers of an Investigator */}
            <div
              ref={(el) => {
                sectionRefs.current['powers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Powers of an Investigator
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The powers of an investigator vary depending on the jurisdiction, the nature of the investigation, and the specific laws or regulations that grant those powers.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Power to Gather Evidence',
                    icon: <Microscope size={16} />,
                    content: (
                      <>
                        <p>This is the fundamental power. It involves the ability to collect information, documents, and physical evidence related to the investigation. This can include conducting interviews, obtaining documents, collecting physical evidence, taking photographs, and gathering electronic data.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Power to Compel Testimony and Production of Documents (Subpoena Power)',
                    icon: <ScrollText size={16} />,
                    content: (
                      <>
                        <p>In many cases, investigators can issue subpoenas, legal orders that require individuals to appear and give testimony or to produce documents. This power is essential for obtaining information from reluctant individuals and is often regulated by law.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Power to Conduct Searches and Seizures',
                    icon: <DoorOpen size={16} />,
                    content: (
                      <>
                        <p>In certain circumstances, investigators may have the power to conduct searches of premises or to seize property. This is typically subject to strict legal requirements, such as obtaining a search warrant from a judge based on probable cause.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Power to Conduct Surveillance',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p>Investigators may have the power to conduct physical or electronic surveillance, such as wiretapping or monitoring electronic communications. This is often subject to legal restrictions and requires authorization from a court or other authority.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Power to Make Arrests or Refer Cases for Prosecution',
                    icon: <BadgeCheck size={16} />,
                    content: (
                      <>
                        <p>Depending on the investigator's role, they may have the power to make arrests or to refer cases to prosecutors for criminal prosecution. Law enforcement officers typically have arrest powers, while other investigators may only refer cases. Investigators can also recommend administrative sanctions.</p>
                      </>
                    ),
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

            {/* SECTION 7: Procedures on Completion of Investigation */}
            <div
              ref={(el) => {
                sectionRefs.current['completion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures on Completion of Investigation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Report Compilation and Documentation',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Writing down everything that happened during the investigation, like a detailed story.</strong></p>
                        <p>Once all evidence has been gathered and analyzed, the investigator creates a comprehensive report. This is the official record of the entire investigation, detailing every step, evidence collected, analysis, and conclusions. The report must be clear, organized, accurate, and complete.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Review and Verification',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Checking the report to make sure it's correct and makes sense.</strong></p>
                        <p>Before finalisation, the report is reviewed by a supervisor or another experienced investigator to ensure accuracy and that all findings are supported by evidence. This helps ensure reliability and that the investigation was conducted properly.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Decision on Action',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Deciding what to do next, based on what the investigation found.</strong></p>
                        <p>Based on the findings, the authority may refer the case for prosecution, impose administrative penalties, or close the case. The decision must be based on the evidence and follow applicable rules and regulations.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Notification and Communication',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <>
                        <p><strong>Telling the people involved what the investigation found and what's going to happen.</strong></p>
                        <p>The findings and actions are communicated to the investigated party, witnesses, and other relevant parties. This ensures transparency and fairness. The method and extent of communication depend on laws and policies.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Record Retention and Storage',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p><strong>Keeping all the papers and information safe for future use.</strong></p>
                        <p>All records, including the report, witness statements, and evidence, are retained and stored securely. This ensures availability for future legal proceedings or audits, in accordance with applicable laws and regulations.</p>
                      </>
                    ),
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
                  💡 Investigation Insight
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
                  <span>Challenges</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Review Process Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Investigator Powers</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Procurement challenges include lack of transparency, corruption, inefficient planning, poor specifications, delays, legal compliance issues, capacity gaps, supplier performance problems, technological challenges, and poor stakeholder engagement. The review process involves a panel with impartial members who evaluate evidence, deliberate, and report. Appeals are allowed on specific grounds. Investigations follow a structured process and investigators have powers to gather evidence, compel testimony, conduct searches, surveil, and refer cases. Upon completion, reports are compiled, reviewed, decisions made, parties notified, and records retained.
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
                <strong className="text-white">Procurement Challenges</strong> – Ten key challenges: Lack of Transparency, Corruption, Inefficient Planning, Poorly Defined Specifications, Delays, Legal Compliance, Inadequate Capacity, Supplier Performance, Technological Challenges, and Poor Stakeholder Engagement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Review Process</strong> – Conducted by an impartial review panel with clear mandate. Steps include: establishment, review initiation, independent evaluation (technical, financial, compliance), deliberation, reporting with recommendations, and final decision with follow-up.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Appeal Process</strong> – Allowed on grounds such as procedural irregularities, bias, evaluation errors, new evidence, misinterpretation of law, or unreasonable decisions. Requires timely filing, strong evidence, and may involve independent review bodies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Investigations &amp; Investigator Powers</strong> – Investigations follow structured steps: initiation, evidence gathering, interviews, document review, report writing, decision, notification, and record retention. Investigators have powers to gather evidence, compel testimony, conduct searches, conduct surveillance, and refer cases for prosecution.
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
            Sidemann Academic Registry • Procurement Challenges &amp; Review Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome9;