import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  BookOpen,
  FileText,
  Archive,
  Users,
  BarChart,
  MessageSquare,
  Link,
  Award,
  Eye,
  Megaphone,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  ClockIcon,
  Scale,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'engagement', label: 'Active Engagement' },
  { id: 'oversight', label: 'Public Oversight' },
  { id: 'information', label: 'Roles of Information' },
  { id: 'monitoring', label: 'Monitoring' },
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
        text: 'Active engagement in public procurement means not just following procedures, but also contributing ideas, asking questions, and seeking to understand the "why" behind the process.',
      },
      {
        title: 'Pro Tip',
        text: 'Public oversight is most effective when citizens have easy access to information and clear channels to report concerns.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key roles of information for procurement officers with the acronym "M-T-C-C-S-D-L-R-S": Market research, Tender preparation, Contract management, Compliance, Stakeholder communication, Performance monitoring, Decision-making, Legal updates, Supplier management, Record keeping.',
      },
      {
        title: 'Common Mistake',
        text: 'Monitoring is often overlooked after a contract is awarded. Effective monitoring throughout the contract lifecycle is essential for ensuring performance and value for money.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Active engagement in public procurement means not just following procedures, but also contributing ideas, asking questions, and seeking to understand the "why" behind the process.',
      },
      {
        title: 'Pro Tip',
        text: 'Public oversight is most effective when citizens have easy access to information and clear channels to report concerns.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key roles of information for procurement officers with the acronym "M-T-C-C-S-D-L-R-S": Market research, Tender preparation, Contract management, Compliance, Stakeholder communication, Performance monitoring, Decision-making, Legal updates, Supplier management, Record keeping.',
      },
      {
        title: 'Common Mistake',
        text: 'Monitoring is often overlooked after a contract is awarded. Effective monitoring throughout the contract lifecycle is essential for ensuring performance and value for money.',
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
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Active Engagement &amp;{' '}
            <span className="text-amber-300 font-bold italic">
              Public Oversight
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to active engagement, procedures, public oversight, roles of information for procurement officers, and monitoring.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Engagement
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Oversight
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Information
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Monitoring
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
                placeholder="Search for a concept, role, procedure..."
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
                Introduction to Active Engagement &amp; Oversight
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome covers the essential concepts of active engagement and public oversight in procurement. It explores the relationship between active participation and procedures, the importance of public oversight, the various roles of information for procurement officers, and the critical process of monitoring.
                  </p>
</div>
            </div>

            {/* SECTION 2: Active Engagement */}
            <div
              ref={(el) => {
                sectionRefs.current['engagement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Active Engagement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    "Active engagement" and "procedures" are two essential components of effective processes, whether in business, government, or any organized activity. They work together to ensure that things get done efficiently, fairly, and with the best possible outcomes.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Active engagement is like being fully present and involved in what's happening. It means participating, asking questions, and contributing to the process, rather than just passively observing. Procedures are the step-by-step instructions that guide how things should be done.
                  </p>
</div>

              {renderCard(
                'Active Engagement',
                <Users size={16} />,
                <>
                  <p><strong>Meaning:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Active engagement involves active participation, proactive involvement, and a sense of ownership in a process.</li>
                    <li>It means going beyond simply following instructions and instead, contributing ideas, asking questions, and seeking to understand the "why" behind the process.</li>
                  </ul>
                  <p><strong>Aspects:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Participation:</strong> Actively taking part in meetings, discussions, and decision-making.</li>
                    <li><strong>Communication:</strong> Openly sharing ideas, concerns, and feedback.</li>
                    <li><strong>Understanding:</strong> Seeking to understand the purpose and rationale behind procedures.</li>
                    <li><strong>Contribution:</strong> Offering insights and suggestions for improvement.</li>
                    <li><strong>Responsibility:</strong> Taking ownership of one's role and responsibilities.</li>
                  </ul>
                  <p><strong>Importance:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Active engagement leads to better outcomes by fostering collaboration, innovation, and a sense of shared responsibility.</li>
                    <li>It helps to identify and address potential problems early on, and it ensures that procedures are implemented effectively.</li>
                    <li>It increases moral, and buy in to the process.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Procedures',
                <ListChecks size={16} />,
                <>
                  <p><strong>Meaning:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Procedures are standardized, documented steps that guide how tasks should be performed.</li>
                    <li>They provide a consistent and repeatable approach to completing activities, ensuring uniformity and efficiency.</li>
                  </ul>
                  <p><strong>Aspects:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Standardization:</strong> Establishing uniform methods for performing tasks.</li>
                    <li><strong>Documentation:</strong> Recording procedures in written or electronic formats.</li>
                    <li><strong>Clarity:</strong> Ensuring that procedures are easy to understand and follow.</li>
                    <li><strong>Consistency:</strong> Applying procedures consistently across all relevant activities.</li>
                    <li><strong>Efficiency:</strong> Streamlining processes to minimize waste and maximize productivity.</li>
                  </ul>
                  <p><strong>Importance:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Procedures ensure consistency and predictability, reducing errors and improving efficiency.</li>
                    <li>They provide a framework for training and onboarding new personnel.</li>
                    <li>They enable accountability and facilitate audits and evaluations.</li>
                    <li>They create a predictable and repeatable process.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'The Functional Relationship',
                <Link size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Active engagement and procedures are mutually reinforcing. Procedures provide the framework, while active engagement ensures that the framework is implemented effectively and that it remains relevant.</li>
                    <li>Active engagement helps to identify areas where procedures can be improved, while procedures provide a structure for implementing those improvements.</li>
                    <li>When people are actively engaged, they are more likely to understand and adhere to procedures, leading to better compliance and outcomes.</li>
                    <li>For example, in a public procurement setting, the procedures are the legal framework, and the active engagement is the proper following of those rules, and the communication between all involved parties to make sure that the procedures are being followed, and that the best result is achieved.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 3: Public Oversight */}
            <div
              ref={(el) => {
                sectionRefs.current['oversight'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Public Oversight
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Public oversight is a critical component of good governance, particularly in areas involving public funds and services. It essentially means that the public has the right and the means to scrutinize the actions and decisions of those in power, ensuring accountability and transparency.
                  </p>
</div>

              {renderCard(
                'Core Meaning',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Public oversight involves the mechanisms and processes that enable citizens and civil society to monitor and evaluate the performance of government and other public institutions.</li>
                    <li>It's about ensuring that those in positions of authority are held accountable for their actions and decisions.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Aspects of Public Oversight',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Access to Information:</strong> This is fundamental to public oversight. Citizens must have access to relevant information about government activities, policies, and expenditures. This includes access to public records, reports, and data.</li>
                    <li><strong>Transparency:</strong> Public institutions should operate in a transparent manner, making their processes and decisions visible to the public. This involves open meetings, public disclosure of documents, and clear communication.</li>
                    <li><strong>Accountability:</strong> Public officials and institutions must be held accountable for their actions and decisions. This involves mechanisms for reporting irregularities, investigating complaints, and imposing sanctions.</li>
                    <li><strong>Citizen Participation:</strong> Public oversight involves active participation by citizens and civil society organizations. This includes participation in public hearings, consultations, and monitoring activities.</li>
                    <li><strong>Independent Audits and Reviews:</strong> Independent audits and reviews are essential for evaluating the performance of public institutions. This includes financial audits, performance audits, and evaluations of programs and policies.</li>
                    <li><strong>Media Scrutiny:</strong> The media plays a vital role in public oversight by investigating and reporting on government activities. This includes investigative journalism, reporting on public meetings, and disseminating information to the public.</li>
                    <li><strong>Legislative Oversight:</strong> Legislatures have a crucial role in overseeing the executive branch of government. This involves parliamentary committees, budget reviews, and question periods.</li>
                    <li><strong>Judicial Review:</strong> The judiciary provides a mechanism for reviewing the legality of government actions. This includes court cases challenging government decisions and upholding the rule of law.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Importance of Public Oversight',
                <Award size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Preventing Corruption:</strong> Public oversight helps to deter corruption by making it more difficult to engage in unethical or illegal activities.</li>
                    <li><strong>Ensuring Accountability:</strong> It holds public officials and institutions accountable for their actions, promoting responsible use of public funds and resources.</li>
                    <li><strong>Improving Governance:</strong> It enhances the quality of governance by promoting transparency, participation, and responsiveness.</li>
                    <li><strong>Building Public Trust:</strong> It fosters trust between citizens and their government by demonstrating that public institutions are operating in the public interest.</li>
                    <li><strong>Protecting Public Interest:</strong> It ensures that public resources are used effectively and efficiently, and that public services are delivered in a fair and equitable manner.</li>
                    <li><strong>Empowering Citizens:</strong> It gives citizens a voice in how their government operates, and gives them a sense of ownership in the governing process.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Roles of Information for Public Procurement Officers */}
            <div
              ref={(el) => {
                sectionRefs.current['information'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Roles of Information for Public Procurement Officers
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement officers rely on information in many ways. Below are the key roles that information plays in their daily work.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Market Research and Analysis',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procurement officers need information about market trends, supplier capabilities, and pricing to make informed purchasing decisions.</li>
                          <li>They use information to identify potential suppliers, assess their qualifications, and negotiate favorable contract terms.</li>
                          <li>This includes information about new technologies, alternative products, and emerging market conditions.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '2. Tender Preparation and Evaluation',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Information is essential for preparing tender documents, including specifications, evaluation criteria, and contract terms.</li>
                          <li>They use information to evaluate bids, assess supplier performance, and select the most advantageous offer.</li>
                          <li>Information regarding past tenders, and successful and unsuccessful bidders is also important.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '3. Contract Management',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procurement officers need information to monitor contract performance, track deliveries, and manage payments.</li>
                          <li>They use information to ensure that contractors comply with contract terms, address any issues that arise, and resolve disputes.</li>
                          <li>This includes information about contractor performance, contract amendments, and claims.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '4. Compliance and Risk Management',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Information is crucial for ensuring compliance with procurement laws, regulations, and policies.</li>
                          <li>They use information to identify and mitigate risks, prevent fraud and corruption, and maintain accurate records.</li>
                          <li>This includes information about legal requirements, ethical standards, and audit findings.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '5. Stakeholder Communication and Engagement',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procurement officers need information to communicate effectively with stakeholders, including suppliers, government agencies, and the public.</li>
                          <li>They use information to provide updates on procurement activities, respond to inquiries, and address concerns.</li>
                          <li>Information related to the status of a tender, or contract is very important to disseminate.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '6. Performance Monitoring and Reporting',
                    icon: <BarChart size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Information is essential for monitoring procurement performance, tracking indicators, and generating reports.</li>
                          <li>They use information to evaluate the effectiveness of procurement processes, identify areas for improvement, and demonstrate accountability.</li>
                          <li>This includes information about cost savings, efficiency gains, and compliance rates.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '7. Decision-Making and Strategic Planning',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procurement officers rely on information to make informed decisions about procurement strategies, policies, and procedures.</li>
                          <li>They use information to identify trends, anticipate future needs, and align procurement activities with organizational goals.</li>
                          <li>Information about future needs of the organization is very important.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '8. Legal and Regulatory Updates',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Procurement officers must remain up to date on changes to the legal, and regulatory framework that governs procurement.</li>
                          <li>This ensures that all actions taken are within the bounds of the Law.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '9. Supplier Relationship Management',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Information regarding the history of a supplier, their performance, and their financial stability is very important.</li>
                          <li>This allows procurement officers to make informed decisions about who to work with, and how to manage those relationships.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '10. Record Keeping',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>All procurement processes must be recorded.</li>
                          <li>This information must be kept safe, and be easily retrievable.</li>
                        </ul>
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

            {/* SECTION 5: Monitoring */}
            <div
              ref={(el) => {
                sectionRefs.current['monitoring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Monitoring
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Monitoring is essentially the systematic and continuous observation and checking of a process, activity, or system over time. It's about keeping a watchful eye to ensure that things are progressing as planned and that desired outcomes are being achieved.
                  </p>
</div>

              {renderCard(
                'Core Meaning',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Monitoring involves the ongoing collection and analysis of data to track progress, identify deviations, and make necessary adjustments.</li>
                    <li>It's a proactive approach to ensure that activities are on track and that goals are met.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Aspects of Monitoring',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Systematic Observation:</strong> Monitoring is not random; it follows a structured approach with predefined indicators and methods. It involves regularly collecting data at specific intervals.</li>
                    <li><strong>Data Collection:</strong> Monitoring relies on gathering relevant data to track progress and performance. This can include quantitative data (e.g., numbers, statistics) and qualitative data (e.g., observations, feedback).</li>
                    <li><strong>Data Analysis:</strong> The collected data is analyzed to identify trends, patterns, and deviations from planned outcomes. This analysis helps to understand what's working well and what needs improvement.</li>
                    <li><strong>Comparison to Standards:</strong> Monitoring involves comparing actual performance to predetermined standards, targets, or benchmarks. This comparison helps to identify gaps and areas where corrective action is needed.</li>
                    <li><strong>Regular Reporting:</strong> Monitoring results are typically reported regularly to stakeholders, providing updates on progress and performance. These reports may include charts, graphs, and other visualizations to make the data easier to understand.</li>
                    <li><strong>Feedback and Adjustment:</strong> Monitoring provides feedback that can be used to adjust plans, strategies, or activities. This feedback loop is crucial for ensuring that activities remain on track and that goals are achieved.</li>
                    <li><strong>Early Detection:</strong> One of the most important aspects of monitoring is the ability to detect problems early. This allows for the problems to be addressed before they become major issues.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Importance of Monitoring',
                <Award size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Tracking Progress:</strong> Monitoring helps to track progress towards goals and objectives, ensuring that activities are moving in the right direction.</li>
                    <li><strong>Identifying Problems:</strong> It enables the early detection of problems, allowing for timely intervention and corrective action.</li>
                    <li><strong>Improving Performance:</strong> Monitoring provides feedback that can be used to improve performance and efficiency.</li>
                    <li><strong>Ensuring Accountability:</strong> It promotes accountability by providing evidence of performance and progress.</li>
                    <li><strong>Making Informed Decisions:</strong> Monitoring provides data that can be used to make informed decisions about future actions.</li>
                    <li><strong>Demonstrating Effectiveness:</strong> It allows for the demonstration of the effectiveness of a program, or process.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Engagement Insight
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
                  <span>Active Engagement Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Public Oversight Aspects</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Roles of Information</span>
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
                Active engagement and procedures work together to ensure effective processes. Public oversight involves transparency, accountability, and citizen participation to prevent corruption and build trust. Procurement officers rely on information for market research, tender preparation, contract management, compliance, stakeholder communication, performance monitoring, decision-making, legal updates, supplier management, and record keeping. Monitoring is a systematic process of observation, data collection, analysis, and feedback to track progress and ensure desired outcomes.
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
                <strong className="text-white">Active Engagement &amp; Procedures</strong> – Active participation, communication, and understanding enhance the effectiveness of procedures. Procedures provide structure, while engagement ensures relevance and compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Public Oversight</strong> – Essential for preventing corruption, ensuring accountability, improving governance, building trust, protecting the public interest, and empowering citizens through access to information, transparency, participation, audits, media scrutiny, legislative oversight, and judicial review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Roles of Information</strong> – Procurement officers need information for market research, tender preparation, contract management, compliance, stakeholder communication, performance monitoring, decision-making, legal updates, supplier management, and record keeping.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Monitoring</strong> – Systematic observation, data collection, analysis, and feedback to track progress, identify problems early, improve performance, ensure accountability, and make informed decisions.
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
            Sidemann Academic Registry • Engagement &amp; Oversight Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
