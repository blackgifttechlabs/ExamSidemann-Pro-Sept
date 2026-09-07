import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Gavel,
  Handshake,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  Briefcase,
  RefreshCw,
  Heart,
  UserCheck,
  UserMinus,
  UserX,
  Clipboard,
  Eye,
  AlertCircle,
  HelpCircle,
  Info,
  Building2,
  Package,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'how-arises', label: 'How Agency Arises' },
  { id: 'types', label: 'Types of Agents' },
  { id: 'rights-duties', label: 'Rights & Duties' },
  { id: 'termination', label: 'Termination' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'The law of agency dates back to Roman law, where "mandatum" allowed one person to act on behalf of another. It is now a cornerstone of modern commercial law.',
      },
      {
        title: 'Pro Tip',
        text: 'When appointing an agent, always define the scope of authority clearly in writing. Ambiguity can lead to disputes and unintended liability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 ways agency can arise: Express Authority, Implied Authority, Agency by Necessity, Apparent Authority, Ratification, Stipulations Alteri, and Maggotorium Gestio.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse an agent with an employee. An agent has authority to bind the principal in contracts; an employee typically does not have that authority.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The law of agency dates back to Roman law, where "mandatum" allowed one person to act on behalf of another. It is now a cornerstone of modern commercial law.',
      },
      {
        title: 'Pro Tip',
        text: 'When appointing an agent, always define the scope of authority clearly in writing. Ambiguity can lead to disputes and unintended liability.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 ways agency can arise: Express Authority, Implied Authority, Agency by Necessity, Apparent Authority, Ratification, Stipulations Alteri, and Maggotorium Gestio.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse an agent with an employee. An agent has authority to bind the principal in contracts; an employee typically does not have that authority.',
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

  // ─── Helper to render a card ─────────────────────────────────────────────
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
            Law of Agency &{' '}
            <span className="text-indigo-300 font-bold italic">
              Principal-Agent Relationships
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the law of agency, how agency arises, types of agents, rights and duties of agents and principals, and termination of agency.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Agency
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Principal-Agent
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Termination
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
                placeholder="Search for a concept, agency, ratification..."
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
            {/* SECTION 1: Law of Agency */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Law of Agency
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The law of agency is a fundamental legal concept that governs the relationship between two parties: a principal and an agent. It essentially establishes the rules under which one person (the agent) can act on behalf of another (the principal) and bind them in legal transactions.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Imagine you hire a real estate agent to sell your house. The agent acts on your behalf, showing the house to potential buyers and negotiating offers. The law of agency sets the rules for how the agent must act and how their actions affect you.
                  </p>
</div>

              <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-4">Key Aspects of the Law of Agency</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Definition and Purpose', icon: <Target size={16} />, content: 'Agency is a legal relationship in which one person (the agent) is authorized to act on behalf of another person (the principal). The purpose is to allow principals to conduct business and enter transactions through agents, expanding their capacity to act.' },
                  { title: '2. Creation of Agency', icon: <SettingsIcon size={16} />, content: (
                    <>
                      <p>Agency can be created in several ways:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li><strong>Express Agreement:</strong> Formal agreement, written or oral.</li>
                        <li><strong>Implied Agreement:</strong> Inferred from conduct.</li>
                        <li><strong>Apparent Authority:</strong> Principal leads third party to believe agent has authority.</li>
                        <li><strong>Agency by Ratification:</strong> Principal approves unauthorized act.</li>
                      </ul>
                    </>
                  ) },
                  { title: '3. Types of Agents', icon: <Users size={16} />, content: (
                    <>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>General Agent:</strong> Broad authority.</li>
                        <li><strong>Special Agent:</strong> Limited to specific task.</li>
                        <li><strong>Factors:</strong> Entrusted with goods to sell.</li>
                        <li><strong>Brokers:</strong> Bring parties together.</li>
                      </ul>
                    </>
                  ) },
                  { title: '4. Duties of the Agent', icon: <ListChecks size={16} />, content: (
                    <>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Duty of Loyalty</li>
                        <li>Duty of Obedience</li>
                        <li>Duty of Care</li>
                        <li>Duty of Accounting</li>
                        <li>Duty of Disclosure</li>
                      </ul>
                    </>
                  ) },
                  { title: '5. Rights of the Agent', icon: <Award size={16} />, content: (
                    <>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Right to Compensation</li>
                        <li>Right to Reimbursement</li>
                        <li>Right to Indemnification</li>
                      </ul>
                    </>
                  ) },
                  { title: '6. Liability of the Principal', icon: <Shield size={16} />, content: 'The principal is liable for the agent\'s actions within the scope of their authority. The principal may also be liable for the agent\'s torts committed within the scope of employment.' },
                  { title: '7. Termination of Agency', icon: <Clock size={16} />, content: (
                    <>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Agreement of parties</li>
                        <li>Lapse of time</li>
                        <li>Fulfilment of purpose</li>
                        <li>Revocation by principal</li>
                        <li>Renunciation by agent</li>
                        <li>Death or incapacity</li>
                      </ul>
                    </>
                  ) },
                  { title: '8. Third-Party Interactions', icon: <GlobeIcon size={16} />, content: 'When an agent acts within their authority, they bind the principal in contracts with third parties. The third party can generally hold the principal liable for the agent\'s actions.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: How Agency Arises */}
            <div
              ref={(el) => {
                sectionRefs.current['how-arises'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How Agency Arises
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine someone acting on your behalf. They can do this because you explicitly told them to, because it is understood they would, because the law says so, or because you approved their actions later. Here is a look at the different ways this happens.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Express Authority', icon: <FileText size={16} />, content: 'This is the clearest form of agency. It arises when the principal directly and explicitly grants authority to the agent, either orally or in writing. For example, a written power of attorney explicitly grants an agent the authority to handle specific financial transactions. Or, a simple verbal agreement, such as "go buy groceries for me", creates an express agency.' },
                  { title: '2. Implied Authority', icon: <LayersIcon size={16} />, content: 'Implied authority arises when the principal\'s actions or the nature of the agent\'s role suggest that the agent has the authority to act, even if it has not been explicitly stated. For example, if you hire a store manager, it is implied that they have the authority to make sales, order inventory, and hire staff.' },
                  { title: '3. Agency of Necessity', icon: <AlertCircle size={16} />, content: 'In certain emergency situations, the law may imply an agency relationship to protect the principal\'s interests. This usually occurs when it is impossible to obtain the principal\'s express consent. For example, if a ship captain must make emergency repairs to save the ship.' },
                  { title: '4. Apparent Authority (Agency by Estoppel)', icon: <Eye size={16} />, content: 'This arises when the principal\'s conduct leads a third party to reasonably believe that the agent has authority, even if they do not. The principal is then "estopped" (prevented) from denying the agent\'s authority.' },
                  { title: '5. Ratification', icon: <CheckCircle size={16} />, content: 'Ratification occurs when an agent acts without authority, but the principal later approves or adopts the agent\'s actions. For example, if an unauthorized person enters a contract on your behalf, you can later ratify the contract, making it legally binding.' },
                  { title: '6. Stipulations Alteri', icon: <FileText size={16} />, content: 'This is a legal concept where a contract is made between two parties, but a third-party benefits from it. While not strictly agency, it shares similarities. For example, life insurance policies where a beneficiary receives benefits upon the policyholder\'s death.' },
                  { title: '7. Maggotorium Gestio', icon: <HelpCircle size={16} />, content: 'This occurs when someone voluntarily manages another person\'s affairs without their knowledge or consent, typically in an emergency. For example, if you take care of your neighbour\'s property during a flood while they are away.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Types of Agents */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Agents
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Agents are individuals or entities authorized to act on behalf of a principal. The nature of their authority and the scope of their actions vary, leading to different classifications.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. General Agent', icon: <Briefcase size={16} />, content: 'A general agent is authorized to conduct a broad range of transactions on behalf of the principal. They have a continuous and ongoing relationship with the principal. For example, a business manager authorized to handle day-to-day operations is a general agent.' },
                  { title: '2. Special Agent', icon: <Target size={16} />, content: 'A special agent is authorized to conduct a specific transaction or task on behalf of the principal. Their authority is limited to that task. For example, a real estate agent hired to sell a specific property is a special agent.' },
                  { title: '3. Factor', icon: <Package size={16} />, content: 'A factor is an agent who is entrusted with goods to sell on behalf of the principal. They typically have possession of the goods and are authorized to sell them in their own name. For example, a consignment agent who sells goods on behalf of a manufacturer.' },
                  { title: '4. Broker', icon: <Handshake size={16} />, content: 'A broker is an agent who brings parties together for a transaction. They typically do not have possession of the goods or property involved. For example, a stockbroker who facilitates the buying and selling of securities.' },
                  { title: '5. Auctioneer', icon: <Gavel size={16} />, content: 'An auctioneer is an agent who conducts auctions on behalf of the principal. They are authorized to sell goods or property to the highest bidder. They are agents for the seller.' },
                  { title: '6. Estate Agent (Real Estate Agent)', icon: <Building2 size={16} />, content: 'An estate agent is a special type of agent who facilitates the buying, selling, or renting of real property. They act on behalf of the principal (buyer or seller) and are authorized to negotiate terms and complete transactions.' },
                  { title: '7. Maggotorium Gestio', icon: <HelpCircle size={16} />, content: 'This is a unique situation where someone (the gestor) voluntarily manages another person\'s (the principal) affairs without their knowledge or consent, typically in an emergency. For example, if you take care of your neighbour\'s property during a flood while they are away.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Rights and Duties of Agents and Principals */}
            <div
              ref={(el) => {
                sectionRefs.current['rights-duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Rights and Duties of Agents and Principals
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you hire someone to do a job for you. They have certain rights, like getting paid, and certain duties, like doing the job properly. You, as the person who hired them, also have rights and duties. Here is a breakdown.
                  </p>
</div>

              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-4">Duties of the Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Duty of Loyalty', icon: <Heart size={16} />, content: 'The agent must act solely in the principal\'s best interests, avoiding any conflicts of interest. They cannot prioritize their own interests or those of a third party over the principal\'s. For example, a real estate agent must disclose any personal relationship they have with a potential buyer.' },
                  { title: '2. Duty of Obedience', icon: <UserCheck size={16} />, content: 'The agent must follow the principal\'s lawful instructions and act within the scope of their authority. They cannot deviate from these instructions without the principal\'s consent. If a principal instructs an agent to sell a product at a specific price, the agent must adhere to that price.' },
                  { title: '3. Duty of Care', icon: <Shield size={16} />, content: 'The agent must act with reasonable care, skill, and diligence. They must perform their duties competently and avoid negligence. For example, an investment agent must conduct thorough research before making investment recommendations.' },
                  { title: '4. Duty of Accounting', icon: <Clipboard size={16} />, content: 'The agent must keep accurate records of all transactions made on behalf of the principal and provide a full accounting of all funds and property received or disbursed. This ensures transparency and prevents misappropriation of funds.' },
                  { title: '5. Duty of Disclosure', icon: <Eye size={16} />, content: 'The agent must disclose to the principal all relevant information that may affect the principal\'s interests. This includes any conflicts of interest or material facts that could influence the principal\'s decisions.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mt-4">Rights of the Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Right to Compensation', icon: <DollarSign size={16} />, content: 'The agent holds an inherent right to receive agreed-upon compensation for the services they provide. This compensation is typically stipulated in the agency agreement and can take various forms, including a fixed salary, a commission based on completed transactions, or a combination of both.' },
                  { title: '2. Right to Reimbursement', icon: <RefreshCw size={16} />, content: 'The agent is entitled to reimbursement for all reasonable expenses incurred while acting within the scope of their authority on behalf of the principal. This right ensures that the agent is not burdened with out-of-pocket costs associated with carrying out their duties.' },
                  { title: '3. Right to Indemnification', icon: <Shield size={16} />, content: 'The agent has the right to be indemnified by the principal for any losses, liabilities, or damages incurred while acting within the scope of their authority. This right protects the agent from financial or legal repercussions arising from actions taken on behalf of the principal.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-4">Duties of the Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Duty to Compensate', icon: <DollarSign size={16} />, content: 'The principal must pay the agent the agreed-upon compensation for their services.' },
                  { title: '2. Duty to Reimburse', icon: <RefreshCw size={16} />, content: 'The principal must reimburse the agent for reasonable expenses incurred while acting on their behalf.' },
                  { title: '3. Duty to Indemnify', icon: <Shield size={16} />, content: 'The principal must indemnify the agent for any losses or liabilities incurred while acting within the scope of their authority.' },
                  { title: '4. Duty to Cooperate', icon: <Handshake size={16} />, content: 'The principal must cooperate with the agent, and not hinder the agent\'s ability to complete their task.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-4">Rights of the Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Right to Control', icon: <SettingsIcon size={16} />, content: 'The principal holds the fundamental right to direct and oversee the agent\'s actions, ensuring they align with the agreed-upon terms of the agency agreement. This control extends to providing specific instructions, setting parameters for decision-making, and dictating the methods by which the agent carries out their duties.' },
                  { title: '2. Right to Performance', icon: <Target size={16} />, content: 'The principal is entitled to expect that the agent will execute their duties with a level of skill, care, and diligence that is considered reasonable within the context of the agency relationship.' },
                  { title: '3. Right to Information', icon: <Info size={16} />, content: 'The principal has the undeniable right to be fully informed of all matters that pertain to the agency relationship. This includes access to all relevant documents, records, and communications.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Termination of the Contract of Agency */}
            <div
              ref={(el) => {
                sectionRefs.current['termination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Termination of the Contract of Agency
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Just like any agreement, an agency contract can end for various reasons. It might finish when the agreed time is up, when the job is done, if both parties agree, if the job becomes impossible, or if either the agent or the principal decides to end it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Expiry of Time', icon: <Clock size={16} />, content: 'If the agency contract specifies a specific duration, it automatically terminates when that time expires. For example, if you hire an agent for six months, the agency relationship ends after those six months.' },
                  { title: '2. Completion of Mandate', icon: <CheckCircle size={16} />, content: 'If the agency contract is for a specific task or purpose, it terminates when that task or purpose is completed. For example, if you hire a real estate agent to sell your house, the agency relationship ends when the house is sold.' },
                  { title: '3. Mutual Consent', icon: <Handshake size={16} />, content: 'Both the principal and the agent can agree to terminate the agency contract at any time, even if it has not expired or the task has not been completed. This requires both parties to willingly agree to end the agreement.' },
                  { title: '4. Impossibility of Performance', icon: <AlertTriangle size={16} />, content: 'If the task or purpose of the agency contract becomes impossible to perform due to unforeseen circumstances, the contract is terminated. For example, if the property being sold is destroyed in a fire.' },
                  { title: '5. Renunciation by Agent', icon: <UserX size={16} />, content: 'The agent has the right to terminate the agency contract by renouncing their authority. However, they may be liable for breach of contract if they do so without a valid reason. The agent must give proper notice to the principal.' },
                  { title: '6. Revocation by Principal', icon: <UserMinus size={16} />, content: 'The principal has the right to terminate the agency contract by revoking the agent\'s authority. However, they may be liable for breach of contract if they do so without a valid reason. The principal must give proper notice to the agent.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
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
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Agency Insight
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
                  <span>Ways Agency Arises</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Types of Agents</span>
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
                The law of agency is fundamental to business and commercial transactions. Agency can be created in various ways, and the parties have specific rights and duties. Understanding how agency arises, the different types of agents, and the rights and duties of both principals and agents is crucial. Termination of agency can occur through several mechanisms. Master these concepts to navigate principal-agent relationships effectively.
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
                <strong className="text-white">Law of Agency</strong> – governs the relationship where one person (agent) acts on behalf of another (principal), binding them in legal transactions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">How Agency Arises</strong> – express authority, implied authority, agency of necessity, apparent authority, ratification, stipulations alteri, and maggotorium gestio.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types of Agents</strong> – general, special, factors, brokers, auctioneers, estate agents, and maggotorium gestio.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Rights &amp; Duties</strong> – agents owe duties of loyalty, obedience, care, accounting, and disclosure; principals must compensate, reimburse, indemnify, and cooperate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Termination</strong> – expiry of time, completion of mandate, mutual consent, impossibility, renunciation by agent, or revocation by principal.
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
            Sidemann Academic Registry • Legal Studies – Law of Agency 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;
