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
  Scale,
  HeartHandshake,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'types', label: 'Types of Partners' },
  { id: 'duties', label: 'Duties of Partners' },
  { id: 'comparison', label: 'vs Company' },
  { id: 'termination', label: 'Termination' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
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
        text: 'A partnership is not a separate legal entity; it is simply a relationship between the partners. This means the partners are personally liable for the debts of the business.',
      },
      {
        title: 'Pro Tip',
        text: 'Always have a written partnership agreement. It clarifies roles, profit-sharing, and what happens if a partner leaves or dies, preventing disputes down the road.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the types of partners: General, Limited, Active, Silent, Nominal, Partner in Profits Only, and Managing Partner.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a partnership with a company. In a company, shareholders have limited liability; in a partnership, general partners have unlimited liability.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A partnership is not a separate legal entity; it is simply a relationship between the partners. This means the partners are personally liable for the debts of the business.',
      },
      {
        title: 'Pro Tip',
        text: 'Always have a written partnership agreement. It clarifies roles, profit-sharing, and what happens if a partner leaves or dies, preventing disputes down the road.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the types of partners: General, Limited, Active, Silent, Nominal, Partner in Profits Only, and Managing Partner.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a partnership with a company. In a company, shareholders have limited liability; in a partnership, general partners have unlimited liability.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> BUSINESS LAW
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Partnership &{' '}
            <span className="text-orange-300 font-bold italic">
              Types of Partners
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to partnership definition, types of partners, duties, comparison with companies, termination methods, and consequences.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Partnership
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Partner Types
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Termination
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
                placeholder="Search for a concept, partner type, duty..."
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
            {/* SECTION 1: Intro – Partnership and Types of Partners */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Partnership and Types of Partners
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you and a friend decide to start a business together. You both put in money and effort, and you share the profits and losses. That is a partnership. But not everyone in a partnership is the same. Some are more involved than others.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Handshake size={16} /> Definition of Partnership
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A partnership is a legal relationship formed when two or more individuals agree to carry on a business together with the intention of sharing profits. It is a way for people to pool resources, skills, and knowledge to achieve a common business goal.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  The core of a partnership is the agreement between the partners. This agreement can be formal, like a written contract, or informal, like a verbal understanding. The key is that there is a mutual agreement to work together and share the outcomes.
                </p>
              </div>
            </div>

            {/* SECTION 2: Types of Partners */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Partners
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Partners can have different roles and levels of involvement. Here are the main types.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. General Partner',
                    icon: <Users size={16} />,
                    content:
                      'A general partner is actively involved in the day-to-day management of the partnership. They have unlimited liability for the partnership\'s debts and obligations. This means that if the partnership owes money, the general partner\'s personal assets can be used to pay those debts. They are the ones who are making the everyday decisions. They have the most responsibility.',
                  },
                  {
                    title: '2. Limited Partner',
                    icon: <Shield size={16} />,
                    content:
                      'A limited partner is an investor who contributes capital to the partnership but is not actively involved in management. Their liability is limited to the amount of their investment. This means that their personal assets are protected. They only risk losing the money they invested. They are generally only investors. They are not making management decisions.',
                  },
                  {
                    title: '3. Active Partner',
                    icon: <UserCheck size={16} />,
                    content:
                      'An active partner is involved in the day-to-day operations and management of the partnership. This term is often used interchangeably with general partner. This term is used to emphasize the partner\'s involvement in the business.',
                  },
                  {
                    title: '4. Silent Partner',
                    icon: <Eye size={16} />,
                    content:
                      'A silent partner contributes capital to the partnership but is not actively involved in management and their involvement is not publicly known. These partners are often investors who want to remain in the background.',
                  },
                  {
                    title: '5. Nominal Partner (Partner by Estoppel)',
                    icon: <UserX size={16} />,
                    content:
                      'A nominal partner is not actually a partner but allows their name to be used to represent the partnership, leading others to believe they are a partner. They may be held liable for the partnership\'s debts. This type of partner is not a real partner. They are only held liable because they allowed their name to be used.',
                  },
                  {
                    title: '6. Partner in Profits Only',
                    icon: <DollarSign size={16} />,
                    content:
                      'This type of partner shares in the profits of the business, but does not share in the losses, nor are they involved in the management of the business. This is a limited form of partnership.',
                  },
                  {
                    title: '7. Managing Partner',
                    icon: <SettingsIcon size={16} />,
                    content:
                      'This is a general partner who is assigned specific duties to manage the partnership. This partner has extra duties and responsibilities.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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

            {/* SECTION 3: Duties of Partners */}
            <div
              ref={(el) => {
                sectionRefs.current['duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties of Partners
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When you are in a partnership, you have certain responsibilities to your partners. You need to be honest, fair, and work together for the good of the business.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Duty of Good Faith and Fair Dealing',
                    icon: <Heart size={16} />,
                    content:
                      'Partners must act honestly and in good faith towards each other. This means they should avoid any actions that could harm the partnership or their fellow partners. This duty is the cornerstone of any partnership. It requires partners to be transparent, truthful, and to act in the best interests of the business, rather than pursuing personal gain at the expense of the partnership.',
                  },
                  {
                    title: '2. Duty of Loyalty',
                    icon: <HeartHandshake size={16} />,
                    content:
                      'Partners must prioritize the interests of the partnership over their own personal interests. They must avoid conflicts of interest and refrain from competing with the partnership. This duty means that partners should not engage in activities that could undermine the partnership\'s success. For example, they should not secretly divert business opportunities to themselves or engage in a competing business without the consent of their partners.',
                  },
                  {
                    title: '3. Duty of Care',
                    icon: <Shield size={16} />,
                    content:
                      'Partners must exercise reasonable care and diligence in managing the partnership\'s affairs. They must act prudently and avoid negligence. This means that partners should make informed decisions, keep accurate records, and take reasonable steps to protect the partnership\'s assets. They should act as a reasonably prudent person would in similar circumstances.',
                  },
                  {
                    title: '4. Duty of Accounting',
                    icon: <Clipboard size={16} />,
                    content:
                      'Partners must keep accurate and complete records of all partnership transactions and provide full access to these records to their fellow partners. This duty ensures transparency and accountability within the partnership. Partners should be able to review the partnership\'s financial records and understand how the business is being managed.',
                  },
                  {
                    title: '5. Duty of Disclosure',
                    icon: <Eye size={16} />,
                    content:
                      'Partners must disclose to their fellow partners all relevant information that could affect the partnership\'s interests. This includes disclosing any conflicts of interest, potential liabilities, or other material facts that could impact the partnership\'s operations or financial performance.',
                  },
                  {
                    title: '6. Duty to Contribute Capital and Share Losses',
                    icon: <DollarSign size={16} />,
                    content:
                      'Partners are generally obligated to contribute capital to the partnership as agreed upon in the partnership agreement. They are also responsible for sharing in the partnership\'s losses according to the agreed-upon ratio. This ensures that all partners are invested in the success of the business.',
                  },
                  {
                    title: '7. Duty to Participate in Management',
                    icon: <Briefcase size={16} />,
                    content:
                      'Unless otherwise agreed, partners have the right and responsibility to participate in the management of the partnership. This ensures that all partners have a voice in how the business is run.',
                  },
                  {
                    title: '8. Duty to Observe the Partnership Agreement',
                    icon: <FileText size={16} />,
                    content:
                      'Partners are bound by the terms of the partnership agreement and must adhere to its provisions. This is the document that outlines the rules for the partnership.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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

            {/* SECTION 4: Partnership vs. Company */}
            <div
              ref={(el) => {
                sectionRefs.current['comparison'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Partnership vs. Company
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of a partnership as a close-knit team where everyone is directly involved and responsible. A company is more like a structured organization with clear roles and limited personal responsibility.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Scale size={16} /> Partnership vs. Company: Detailed Comparison
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Legal Structure:</strong> A partnership is typically a less formal arrangement, governed by a partnership agreement. It is not a separate legal entity from its owners. This means that the partnership itself does not have a separate legal existence. The partners are the business. A company (corporation) is a separate legal entity, distinct from its shareholders. It is governed by its articles of incorporation and bylaws. This separate legal entity is very important, because it allows the company to enter contracts, sue, and be sued, in its own name.
                  </li>
                  <li>
                    <strong>Liability:</strong> General partners have unlimited personal liability for the partnership's debts and obligations. This is a major disadvantage of partnerships. Shareholders have limited liability, meaning their personal assets are generally protected from the company's debts. This limited liability is a major advantage of companies.
                  </li>
                  <li>
                    <strong>Management:</strong> Partners are typically actively involved in the management of the partnership. Management is often shared between all the partners. Management is typically delegated to a board of directors and officers, who are elected or appointed by the shareholders. This allows for a more structured and professional management style.
                  </li>
                  <li>
                    <strong>Taxation:</strong> Partnerships are typically "pass-through" entities, meaning profits and losses are passed through to the partners' individual tax returns. This avoids double taxation. Companies are subject to corporate income tax, and shareholders may also be taxed on dividends (double taxation). This double taxation is a major disadvantage of companies.
                  </li>
                  <li>
                    <strong>Formation:</strong> Partnerships are relatively easy and inexpensive to form. This ease of formation is a major advantage of partnerships. Companies require more formal procedures and are generally more expensive to form. This is a disadvantage of companies.
                  </li>
                  <li>
                    <strong>Ownership Transfer:</strong> Transferring ownership in a partnership can be complex and may require the consent of all partners. This can cause issues when partners wish to leave the partnership. Ownership in a company can be easily transferred through the sale of shares. This ease of transfer is a major advantage of companies.
                  </li>
                  <li>
                    <strong>Continuity:</strong> Partnerships can dissolve upon the death, withdrawal, or bankruptcy of a partner. This lack of continuity is a major disadvantage of partnerships. Companies have perpetual existence, meaning they continue to exist even if shareholders or directors change. This continuity is a major advantage of companies.
                  </li>
                  <li>
                    <strong>Raising Capital:</strong> Partnerships may find it more difficult to raise capital compared to companies. They are limited to the funds of the partners, and loans. Companies can raise capital by issuing shares or bonds. This ability to raise capital is a major advantage of companies.
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Termination of Partnership */}
            <div
              ref={(el) => {
                sectionRefs.current['termination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Termination of Partnership
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A partnership does not last forever. It can end when the partners agree, when the agreed time is up, or when something unexpected happens, like a partner dying.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Agreement of Partners',
                    icon: <Handshake size={16} />,
                    content:
                      'Partners can mutually agree to dissolve the partnership at any time. This can be done through a written agreement or a verbal understanding. This is the most straightforward method. If all partners concur that the business should cease operations, they can formally agree to terminate the partnership.',
                  },
                  {
                    title: '2. Expiry of Term',
                    icon: <Clock size={16} />,
                    content:
                      'If the partnership agreement specifies a fixed term or duration, the partnership automatically terminates upon the expiration of that term. For instance, if the partnership was formed for a period of five years, it will dissolve at the end of that five-year period, unless the partners agree to extend it.',
                  },
                  {
                    title: '3. Completion of Undertaking',
                    icon: <CheckCircle size={16} />,
                    content:
                      'If the partnership was formed for a specific project or undertaking, it terminates upon the completion of that project or undertaking. For example, if a partnership was formed to build a specific building, it will terminate upon the completion of the building.',
                  },
                  {
                    title: '4. Death of a Partner',
                    icon: <UserX size={16} />,
                    content:
                      'In most jurisdictions, the death of a partner automatically dissolves the partnership, unless the partnership agreement provides otherwise. The partnership agreement can contain clauses that allow the partnership to continue even if a partner dies, but if there is no clause, the partnership will terminate.',
                  },
                  {
                    title: '5. Bankruptcy of a Partner or the Partnership',
                    icon: <AlertTriangle size={16} />,
                    content:
                      'The bankruptcy of a partner or the partnership itself can lead to the dissolution of the partnership. Bankruptcy proceedings can disrupt the partnership\'s operations and make it impossible for the business to continue.',
                  },
                  {
                    title: '6. Court Order',
                    icon: <Gavel size={16} />,
                    content:
                      'A court may order the dissolution of a partnership under certain circumstances, such as: When a partner is permanently incapable of performing their duties. When a partner\'s conduct is prejudicial to the partnership\'s business. When the partnership can only be carried on at a loss. When it is just and equitable to dissolve the partnership.',
                  },
                  {
                    title: '7. Notice of Dissolution',
                    icon: <FileText size={16} />,
                    content:
                      'In a partnership at will (where there is no fixed term), any partner can give notice of their intention to dissolve the partnership. This notice must be communicated to all other partners.',
                  },
                  {
                    title: '8. Illegality',
                    icon: <AlertCircle size={16} />,
                    content:
                      'If the partnership\'s business becomes illegal, the partnership is automatically dissolved. For example, if the business is selling a product that is then banned, the partnership will be dissolved.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Consequences of Termination
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Upon termination, the partnership's assets must be liquidated, and the proceeds distributed among the partners according to their agreed-upon shares.</li>
                  <li>The partners remain liable for any outstanding debts or obligations of the partnership.</li>
                  <li>Notification of the termination to any relevant third parties is also very important.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Partnership Insight
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
                  <span>Types of Partners</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Duties of Partners</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Ways to Terminate</span>
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
                A partnership is a flexible business structure but comes with unlimited liability for general partners. Understanding the types of partners, their duties, and the differences from a company is crucial for any business owner. Termination of a partnership can occur through various means, and proper planning (e.g., a written partnership agreement) can prevent disputes.
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
                <strong className="text-white">Partnership</strong> – a relationship where two or more people agree to carry on a business together with the intention of sharing profits.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types of Partners</strong> – general, limited, active, silent, nominal, partner in profits only, and managing partner – each with different roles and liabilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Duties of Partners</strong> – include good faith, loyalty, care, accounting, disclosure, contribution, participation, and observance of the partnership agreement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Partnership vs. Company</strong> – key differences in legal structure, liability, management, taxation, formation, ownership transfer, continuity, and raising capital.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Termination</strong> – can occur by agreement, expiry, completion, death, bankruptcy, court order, notice, or illegality; with consequences like liquidation and remaining liability.
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
            Sidemann Academic Registry • Legal Studies – Partnership Law 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;