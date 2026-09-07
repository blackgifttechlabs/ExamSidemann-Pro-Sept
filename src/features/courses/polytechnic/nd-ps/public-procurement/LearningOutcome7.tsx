import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  SettingsIcon,
  FileText,
  Archive,
  File,
  Megaphone,
  Users,
  MessageCircle,
  Mail,
  CheckCircle,
  Award,
  AlertTriangle,
  MessageSquare,
  Users2,
  Eye,
  Handshake,
  Clipboard,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'competitive', label: 'Competitive Bidding' },
  { id: 'restricted', label: 'Restricted Bidding' },
  { id: 'consultancy', label: 'Consultancy Services' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'Competitive bidding is the most transparent procurement method and is often legally required for high-value contracts to ensure fairness and value for money.',
      },
      {
        title: 'Pro Tip',
        text: 'Always ensure your tender documents are clear and unambiguous. Ambiguity leads to confusion, disputes, and potentially unsuccessful procurement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight steps of competitive bidding with the acronym "P-A-P-S-B-E-A-D": Preparation, Advertisement, Pre-bid meeting, Submission, Bid opening, Evaluation, Award, Debriefing.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations rush through the evaluation phase. Take time to thoroughly evaluate each bid against the criteria to ensure the best value for money.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Competitive bidding is the most transparent procurement method and is often legally required for high-value contracts to ensure fairness and value for money.',
      },
      {
        title: 'Pro Tip',
        text: 'Always ensure your tender documents are clear and unambiguous. Ambiguity leads to confusion, disputes, and potentially unsuccessful procurement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight steps of competitive bidding with the acronym "P-A-P-S-B-E-A-D": Preparation, Advertisement, Pre-bid meeting, Submission, Bid opening, Evaluation, Award, Debriefing.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations rush through the evaluation phase. Take time to thoroughly evaluate each bid against the criteria to ensure the best value for money.',
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Competitive Bidding &amp;{' '}
            <span className="text-indigo-300 font-bold italic">
              Procurement
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to competitive bidding, restricted bidding, procurement of consultancy services, and the entire tender process.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <File size={14} className="inline mr-1" /> Competitive Bidding
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Restricted Bidding
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Consultancy
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
                placeholder="Search for a step, method, concept..."
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
                Introduction to Competitive Bidding
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine your school needs new computers. You want to get the best deal, so you tell many computer companies what you need. They all give you their best offers, and you pick the best one. That's competitive bidding.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    This module covers the complete tender process for competitive bidding, restricted bidding, and the procurement of consultancy services.
                  </p>
</div>
            </div>

            {/* SECTION 2: Competitive Bidding */}
            <div
              ref={(el) => {
                sectionRefs.current['competitive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Competitive Bidding
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preparation of Tender Documents',
                    icon: <File size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Writing down exactly what you need in a clear list.</p>
                        <p>The procuring entity (the buyer) prepares detailed tender documents that clearly specify the requirements for the goods, services, or works being procured.</p>
                        <p>These documents include specifications, evaluation criteria, contract terms, and instructions to bidders.</p>
                        <p>Clear and unambiguous tender documents are crucial for ensuring that all bidders understand the requirements and can submit comparable bids.</p>
                        <p>This step is vital, as it sets the stage for the entire process. Any ambiguity in the tender documents can lead to confusion, disputes, and ultimately, a less than optimal outcome.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Advertisement of Tender',
                    icon: <Megaphone size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Telling everyone who might be interested that you're looking for offers.</p>
                        <p>The tender opportunity is advertised publicly through appropriate channels, such as newspapers, websites, or official gazettes.</p>
                        <p>The advertisement provides information about the procurement, including the deadline for submitting bids and how to obtain the tender documents.</p>
                        <p>Public advertisement ensures that a wide range of potential bidders are aware of the opportunity and can participate.</p>
                        <p>This step is how the public knows that an opportunity exists, and it is a part of the transparency of the process.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Pre-Bid Meeting (Optional)',
                    icon: <MessageCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> A meeting where everyone can ask questions before they make their offers.</p>
                        <p>A pre-bid meeting may be held to allow potential bidders to ask questions and seek clarifications on the tender documents.</p>
                        <p>This meeting helps to ensure that all bidders have a clear understanding of the requirements and can submit responsive bids.</p>
                        <p>Minutes of the pre-bid meeting, including questions and answers, are typically distributed to all bidders.</p>
                        <p>This step is very useful for complex projects, as it allows for a clear understanding of what is needed.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Submission of Bids',
                    icon: <Mail size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Companies send in their best offers by a certain time.</p>
                        <p>Bidders prepare and submit their bids according to the instructions provided in the tender documents.</p>
                        <p>Bids are typically submitted in sealed envelopes or electronically through an e-procurement platform.</p>
                        <p>Bids must be submitted by the specified deadline to be considered.</p>
                        <p>This is where the companies make their offers, and it is important that this is done in a secure way.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Bid Opening',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Opening all the offers at the same time in front of everyone.</p>
                        <p>Bids are opened publicly at a designated time and place.</p>
                        <p>The names of the bidders and their bid prices are announced and recorded.</p>
                        <p>Public bid opening ensures transparency and fairness.</p>
                        <p>This step is vital to ensure that there is no tampering with the bids.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Evaluation of Bids',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Checking all the offers carefully to see which one is the best.</p>
                        <p>Bids are evaluated based on the predetermined criteria outlined in the tender documents.</p>
                        <p>The evaluation may involve technical evaluations, financial evaluations, and other assessments.</p>
                        <p>The evaluation process should be objective, impartial, and documented.</p>
                        <p>This step is where the procuring entity determines which bid is the best value.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Award of Contract',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Giving the job to the company with the best offer.</p>
                        <p>The contract is awarded to the bidder who submits the most advantageous bid, based on the evaluation criteria.</p>
                        <p>The successful bidder is notified of the award, and a contract is signed.</p>
                        <p>Unsuccessful bidders may be notified of the outcome.</p>
                        <p>This is the final step in the process, and it is important that it is done in a timely manner.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Debriefing (Optional)',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <>
                        <p><strong>Simple Explanation:</strong> Telling the companies that didn't win why they didn't get the job.</p>
                        <p>Unsuccessful bidders may be offered a debriefing to provide feedback on their bids and explain why they were not selected.</p>
                        <p>Debriefing helps to improve the transparency of the process and allows bidders to learn from their experiences.</p>
                        <p>This step is a good way to improve the relationship with the companies that did not win the tender.</p>
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

            {/* SECTION 3: Restricted Bidding */}
            <div
              ref={(el) => {
                sectionRefs.current['restricted'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Restricted Bidding
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Restricted bidding, or limited tendering, involves inviting only a select group of pre-qualified suppliers to submit bids. This method is used when open competition is not feasible or desirable due to specific circumstances.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Justification and Approval',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Determine Suitability:</strong> The procuring entity must first determine if restricted bidding is justified. This could be due to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Specialized expertise or technology.</li>
                          <li>Limited number of qualified suppliers.</li>
                          <li>Urgency or emergency situations.</li>
                          <li>Proprietary items.</li>
                        </ul>
                        <p>This justification must be properly documented.</p>
                        <p><strong>Obtain Approvals:</strong> Internal approvals from relevant authorities (e.g., management, legal, finance) are required before proceeding with restricted bidding.</p>
                        <p>This ensures accountability and compliance with regulations.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Identification and Selection of Bidders',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Pre-Qualification:</strong> The procuring entity may have a pre-qualified list of suppliers based on past performance, experience, or technical capabilities.</p>
                        <p>If not, they must identify potential suppliers who meet the required criteria.</p>
                        <p><strong>Selection Criteria:</strong> Clear and objective criteria for selecting bidders should be established. These criteria may include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Technical expertise.</li>
                          <li>Financial stability.</li>
                          <li>Past performance.</li>
                          <li>Capacity to deliver.</li>
                        </ul>
                        <p>The selection process must be documented to maintain transparency.</p>
                        <p><strong>Invitation to Bid:</strong> Formal invitations are sent to the selected suppliers, outlining the requirements and instructions for submitting bids.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Preparation and Issuance of Tender Documents',
                    icon: <File size={16} />,
                    content: (
                      <>
                        <p><strong>Tender Documents:</strong> The procuring entity prepares detailed tender documents, including:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Specifications of the goods, services, or works.</li>
                          <li>Evaluation criteria.</li>
                          <li>Contract terms and conditions.</li>
                          <li>Instructions to bidders.</li>
                        </ul>
                        <p>These documents should be clear and unambiguous.</p>
                        <p><strong>Issuance:</strong> The tender documents are issued to the selected bidders within a specified timeframe.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Submission and Opening of Bids',
                    icon: <Mail size={16} />,
                    content: (
                      <>
                        <p><strong>Bid Submission:</strong> Bidders prepare and submit their bids according to the instructions provided in the tender documents.</p>
                        <p>Bids are typically submitted in sealed envelopes or electronically.</p>
                        <p>A deadline for submission is set and strictly enforced.</p>
                        <p><strong>Bid Opening:</strong> Bids are opened at a designated time and place.</p>
                        <p>The opening process is documented, and the names of the bidders and their bid prices may be recorded.</p>
                        <p>Depending on the laws of the jurisdiction, this step may or may not be public.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Evaluation of Bids',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Evaluation Criteria:</strong> Bids are evaluated based on the predetermined criteria outlined in the tender documents.</p>
                        <p>The evaluation process should be objective, impartial, and documented.</p>
                        <p><strong>Technical and Financial Evaluation:</strong> The evaluation may involve technical evaluations, financial evaluations, and other assessments.</p>
                        <p>A report of the evaluation process is generated.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Award of Contract',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p><strong>Award Decision:</strong> The contract is awarded to the bidder who submits the most advantageous bid, based on the evaluation criteria.</p>
                        <p>The award decision is documented.</p>
                        <p><strong>Notification:</strong> The successful bidder is notified of the award, and a contract is signed.</p>
                        <p>Unsuccessful bidders may be notified of the outcome.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Contract Management',
                    icon: <Clipboard size={16} />,
                    content: (
                      <>
                        <p><strong>Contract Execution:</strong> The contract is executed according to the agreed-upon terms and conditions.</p>
                        <p><strong>Performance Monitoring:</strong> The procuring entity monitors the supplier's performance and ensures compliance with the contract.</p>
                        <p><strong>Payment and Closeout:</strong> Payments are processed according to the contract terms.</p>
                        <p>The contract is closed out upon completion of all obligations.</p>
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
                'Considerations for Restricted Bidding',
                <AlertTriangle size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Transparency:</strong> Even in restricted bidding, transparency should be maintained as much as possible.</li>
                    <li><strong>Documentation:</strong> Thorough documentation is crucial for justifying the use of restricted bidding and ensuring accountability.</li>
                    <li><strong>Fairness:</strong> The selection of bidders and the evaluation process should be fair and impartial.</li>
                    <li><strong>Compliance:</strong> Adherence to applicable laws, regulations, and organizational policies is essential.</li>
                    <li><strong>Justification:</strong> The most important part of this method is the justification. Without a solid, well documented, and legal justification, this method should not be used.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Procurement of Consultancy Services */}
            <div
              ref={(el) => {
                sectionRefs.current['consultancy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procurement of Consultancy Services
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Procurement of consultancy services requires a structured approach to ensure that the organization selects the right consultant with the necessary expertise and experience.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Defining the Need and Scope',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Identify the Problem:</strong> Clearly define the problem or need that requires consultancy services. What are the specific objectives and desired outcomes?</p>
                        <p><strong>Develop a Scope of Work (SOW):</strong> Create a detailed SOW that outlines the project's objectives, deliverables, timelines, and reporting requirements. The SOW should be specific, measurable, achievable, relevant, and time-bound (SMART).</p>
                        <p>The SOW should also define the required expertise, qualifications, and experience of the consultant.</p>
                        <p><strong>Estimate the Budget:</strong> Develop a realistic budget for the consultancy services, considering factors such as the complexity of the project, the consultant's expertise, and the duration of the engagement.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Selecting the Procurement Method',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Determine the Appropriate Method:</strong> Choose a procurement method based on the value and complexity of the consultancy services. Common methods include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Request for Proposals (RFP):</strong> Used for complex projects requiring detailed proposals.</li>
                          <li><strong>Request for Quotations (RFQ):</strong> Used for simpler projects with clearly defined requirements.</li>
                          <li><strong>Direct Selection:</strong> Used in exceptional circumstances, such as when there is only one qualified consultant.</li>
                        </ul>
                        <p><strong>Justify the Selection:</strong> Document the rationale for selecting the chosen procurement method.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Developing the RFP/RFQ',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Prepare the Document:</strong> Develop a comprehensive RFP or RFQ that includes:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>The SOW.</li>
                          <li>Evaluation criteria.</li>
                          <li>Instructions to consultants.</li>
                          <li>Contract terms and conditions.</li>
                          <li>Submission requirements.</li>
                        </ul>
                        <p><strong>Ensure Clarity:</strong> Use clear and concise language to avoid ambiguity. Provide sufficient information for consultants to prepare their proposals.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Advertising and Issuing the RFP/RFQ',
                    icon: <Megaphone size={16} />,
                    content: (
                      <>
                        <p><strong>Advertise the Opportunity:</strong> Advertise the RFP/RFQ through appropriate channels, such as online platforms, newspapers, or industry publications. Ensure that the advertisement reaches a wide range of potential consultants.</p>
                        <p><strong>Issue the Document:</strong> Issue the RFP/RFQ to interested consultants. Provide a clear deadline for proposal submissions.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Evaluating Proposals',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Establish an Evaluation Committee:</strong> Form an evaluation committee with members who have relevant expertise.</p>
                        <p><strong>Evaluate Proposals Based on Criteria:</strong> Evaluate proposals based on the predetermined evaluation criteria, which may include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Technical expertise and experience.</li>
                          <li>Proposed methodology.</li>
                          <li>Project management plan.</li>
                          <li>Cost.</li>
                          <li>References.</li>
                        </ul>
                        <p><strong>Document the Evaluation:</strong> Document the evaluation process and maintain records of the evaluation results.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Negotiating and Awarding the Contract',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p><strong>Negotiate Contract Terms:</strong> Negotiate contract terms with the selected consultant, including fees, payment schedules, and deliverables.</p>
                        <p><strong>Award the Contract:</strong> Award the contract to the successful consultant. Issue a written contract that clearly outlines the terms of the agreement.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Managing the Contract',
                    icon: <Clipboard size={16} />,
                    content: (
                      <>
                        <p><strong>Monitor Performance:</strong> Monitor the consultant's performance and ensure compliance with the contract. Conduct regular progress meetings and reviews.</p>
                        <p><strong>Manage Payments:</strong> Process payments according to the agreed-upon schedule.</p>
                        <p><strong>Document the Project:</strong> Maintain accurate records of all project activities and deliverables.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Contract Closure',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p><strong>Final Review:</strong> Conduct a final review of the consultant's performance and deliverables.</p>
                        <p><strong>Final Payment:</strong> Process the final payment upon satisfactory completion of the contract.</p>
                        <p><strong>Document Closure:</strong> Document the contract closure and maintain records for future reference.</p>
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
                'Considerations for Consultancy Procurement',
                <AlertTriangle size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Conflict of Interest:</strong> Ensure that there are no conflicts of interest among evaluation committee members or consultants.</li>
                    <li><strong>Confidentiality:</strong> Maintain confidentiality of all proposals and information.</li>
                    <li><strong>Transparency:</strong> Maintain transparency throughout the procurement process.</li>
                    <li><strong>Value for Money:</strong> Focus on obtaining the best value for money, considering both cost and quality.</li>
                    <li><strong>Legal Compliance:</strong> Adhere to all applicable laws, regulations, and organizational policies.</li>
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
                  💡 Bidding Insight
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
                  <span>Competitive Bidding Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Restricted Bidding Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Consultancy Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Competitive bidding involves eight steps: Preparation, Advertisement, Pre-bid meeting, Submission, Bid opening, Evaluation, Award, and Debriefing. Restricted bidding requires strong justification, fair selection of bidders, and thorough documentation. Consultancy procurement focuses on defining needs, selecting the right method (RFP/RFQ), evaluating proposals based on expertise, and managing the contract effectively. Always prioritise transparency, fairness, and value for money.
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
                <strong className="text-white">Competitive Bidding</strong> – Eight steps: Preparation of tender documents, Advertisement, Pre-bid meeting, Submission of bids, Bid opening, Evaluation of bids, Award of contract, and Debriefing. Promotes transparency, fairness, and value for money.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Restricted Bidding</strong> – Used when open competition is not feasible. Requires strong justification, approval, selection of qualified bidders, and thorough documentation. Key considerations: transparency, fairness, compliance, and justification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Consultancy Services</strong> – Procurement involves defining the need and scope, selecting the method (RFP/RFQ), developing documents, advertising, evaluating proposals (technical and cost), negotiating, awarding, managing, and closing the contract. Emphasise conflict of interest, confidentiality, and value for money.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Best Practices</strong> – Always document justifications, maintain transparency, ensure fair evaluation, and comply with legal and regulatory requirements.
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
            Sidemann Academic Registry • Competitive Bidding Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;
