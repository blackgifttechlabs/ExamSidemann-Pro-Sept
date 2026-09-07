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
  Type,
  Edit,
  Hash,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  Scale,
  Flag,
  GitMerge,
  Anchor,
  Gift,
  AlertTriangle,
  Building2,
  Book,
  Users,
  User,
  Eye,
  Brain,
  Calendar,
  Handshake,
  Gavel,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'tradeables', label: 'Tradeables' },
  { id: 'first-offer', label: 'First Offer' },
  { id: 'power', label: 'Negotiation Power' },
  { id: 'personalities', label: 'Personalities' },
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
        text: 'The concept of "straw issues" comes from the idea of a straw man – something that looks real but is actually hollow. In negotiation, straw issues are concessions you pretend to care about but can easily give away.',
      },
      {
        title: 'Pro Tip',
        text: 'When analysing a first offer, always compare it to your BATNA. If the offer is worse than your best alternative, you have little reason to accept it.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five sources of negotiation power: Reward, Coercive, Legitimate, Expert, and Referent – think of them as the "RCLER" power sources.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that all negotiators think like you. Use the MBTI framework to understand their personality preferences and tailor your approach accordingly.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of "straw issues" comes from the idea of a straw man – something that looks real but is actually hollow. In negotiation, straw issues are concessions you pretend to care about but can easily give away.',
      },
      {
        title: 'Pro Tip',
        text: 'When analysing a first offer, always compare it to your BATNA. If the offer is worse than your best alternative, you have little reason to accept it.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five sources of negotiation power: Reward, Coercive, Legitimate, Expert, and Referent – think of them as the "RCLER" power sources.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that all negotiators think like you. Use the MBTI framework to understand their personality preferences and tailor your approach accordingly.',
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
            Tradeables, Straw Issues &amp;{' '}
            <span className="text-amber-300 font-bold italic">
              Negotiation Power
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to tradeables and straw issues, analysing first offers, negotiation power, and studying negotiator personalities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Tradeables
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> First Offer
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gift size={14} className="inline mr-1" /> Power Sources
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <User size={14} className="inline mr-1" /> MBTI
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
                placeholder="Search for a concept, power source, personality type..."
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
            {/* SECTION 1: Tradeables and Straw Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['tradeables'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tradeables and Straw Issues
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Tradeables and Straw Issues?</strong><br />
                    In a negotiation, you will have things you really care about and things you do not care about as much. "Tradeables" are things you are willing to give up getting something you want. "Straw issues" are things you pretend to care about, but you are actually willing to give them up easily.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Reynolds Negotiation Behaviour Model:</strong> Reynolds' model helps us understand how people behave during negotiations, including how they use tradeables and straw issues.
                  </p>
</div>

              {renderCard(
                '1. Identifying Tradeables',
                <Scale size={16} />,
                <>
                  <p><strong>Figuring out what things you are willing to give up getting what you really want.</strong></p>
                  <p><strong>Detailed Explanation:</strong></p>
                  <p>Tradeables are items or concessions that you are willing to exchange with the other party to achieve your primary objectives. These are areas where you have flexibility and are willing to compromise. To identify tradeables, you need to assess your priorities and determine which issues are less important to you. For example, in a contract negotiation, you might be willing to offer a longer payment term in exchange for a lower price. Or you might offer to complete a project faster, in exchange for more resources. Tradeables are valuable tools for building rapport and creating mutually beneficial agreements. The key is to know what you can give away, and what you will receive in return, to ensure you are getting a beneficial trade.</p>
                </>
              )}

              {renderCard(
                '2. Identifying Straw Issues',
                <Flag size={16} />,
                <>
                  <p><strong>Figuring out what things you can pretend to care about, but you are actually willing to give up easily.</strong></p>
                  <p><strong>Detailed Explanation:</strong></p>
                  <p>Straw issues are items or concessions that you present as important but are actually of little or no value to you. They are used as bargaining chips to gain leverage or create the illusion of making significant concessions. For example, you might insist on a specific clause in a contract, knowing that you are willing to drop it later in the negotiation. Or you can strongly state that a certain feature is vital, when in actuality it is not. Straw issues can be effective for creating a sense of reciprocity and building trust. However, it is important to use them ethically and avoid being deceptive. Reynolds model shows that using straw issues can be a useful negotiation tactic, but it is important to not overuse them, because the other party might see through the tactic.</p>
                </>
              )}

              {renderCard(
                '3. How Reynolds\' Model Relates',
                <GitMerge size={16} />,
                <>
                  <p>Reynolds' negotiation behaviour model emphasizes that successful negotiators understand the dynamics of give-and-take. It highlights the importance of:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Strategic Concessions:</strong> Using tradeables effectively to make concessions that benefit both parties.</li>
                    <li><strong>Creating Value:</strong> Identifying and leveraging straw issues to create the perception of value without sacrificing important goals.</li>
                    <li><strong>Understanding Priorities:</strong> Recognizing the other party's priorities and using that knowledge to guide the negotiation.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 2: Analysing the First Offer */}
            <div
              ref={(el) => {
                sectionRefs.current['first-offer'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analysing the First Offer
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Analysing the First Offer?</strong><br />
                    When someone makes the first offer in a negotiation, it is like the opening move in a chess game. You need to analyse it carefully to understand their strategy and plan your response.
                  </p>
</div>

              {renderCard(
                '1. The Extreme but Credible Market Model',
                <Target size={16} />,
                <>
                  <p><strong>The other person makes a very high (or very low) offer, but it is still somewhat believable.</strong></p>
                  <p><strong>Detailed Explanation:</strong></p>
                  <p>This model describes a common negotiation tactic where the initial offer is deliberately extreme, pushing the boundaries of what might be considered reasonable. However, the offer is still designed to be "credible" enough to avoid immediate rejection. The idea is to anchor the negotiation in a favourable position for the offering party.</p>
                  <p><strong>How to Analyse:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Assess Credibility:</strong> Determine if the offer, while extreme, is still within the realm of possibility. Research market values, comparable deals, and industry standards to see if there is any basis for the offer.</li>
                    <li><strong>Identify Anchoring:</strong> Recognize that the extreme offer is likely intended to anchor your expectations. Do not let it intimidate you or set the tone for the entire negotiation.</li>
                    <li><strong>Look for Patterns:</strong> See if the offer reveals any underlying assumptions or priorities of the other party.</li>
                  </ul>
                  <p><strong>Example:</strong> In a real estate negotiation, the seller might initially ask for a price that is significantly above market value, but they might justify it by highlighting unique features or recent comparable sales. This tactic can be used to see how much room for negotiation there actually is.</p>
                </>
              )}

              {renderCard(
                '2. Use of BATNA',
                <Anchor size={16} />,
                <>
                  <p><strong>Compare the first offer to your "Plan B" to see if it is worth considering.</strong></p>
                  <p><strong>Detailed Explanation:</strong></p>
                  <p>Your Best Alternative to a Negotiated Agreement (BATNA) is your fallback option if you cannot reach an agreement in the current negotiation. Analysing the first offer in relation to your BATNA is crucial for determining its value.</p>
                  <p><strong>How to Analyse:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Compare to BATNA:</strong> Evaluate whether the first offer is better or worse than your BATNA. If the offer is worse, you might be better off pursuing your alternative option.</li>
                    <li><strong>Assess Leverage:</strong> If the offer is significantly better than your BATNA, you have strong leverage. If it is only slightly better, your leverage is weaker.</li>
                    <li><strong>Consider Timing:</strong> If you have a strong BATNA, you might be more willing to reject the first offer and wait for a better one. If your BATNA is weak, you might feel pressure to accept the offer.</li>
                  </ul>
                  <p><strong>Example:</strong> If you are negotiating a job offer and your BATNA is another job offer with a higher salary, you can use that information to assess the value of the first offer. If the first offer is lower than your BATNA, you might reject it or counter with a higher salary. By comparing the offer to your BATNA, you can make an informed decision about whether to accept, reject, or counter it.</p>
                </>
              )}
            </div>

            {/* SECTION 3: Determining Negotiation Power */}
            <div
              ref={(el) => {
                sectionRefs.current['power'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Determining Negotiation Power
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Negotiation Power?</strong><br />
                    Negotiation power is like having influence in a conversation. It is about how much you can affect the outcome of the negotiation. Different things can give you power, like having something the other person wants, or being seen as an expert.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Reward Power',
                    icon: <Gift size={16} />,
                    content: (
                      <>
                        <p><strong>The power to give someone something they want.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p>Reward power stems from the ability to provide positive incentives or rewards to the other party. This could include things like bonuses, promotions, favourable terms, or access to valuable resources. If you have the ability to offer something that the other party desires, you have reward power. For example, a manager negotiating a salary increase has reward power because they can offer a higher salary. A company negotiating a contract has reward power if they can offer a lucrative deal. This power is effective when the other party values the rewards you can offer.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Coercive Power',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>The power to punish someone or take away something they want.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p>Coercive power comes from the ability to impose penalties or sanctions on the other party. This could include things like demotions, fines, withholding resources, or ending the negotiation. If you have the ability to inflict negative consequences, you have coercive power. For example, a boss who can fire an employee has coercive power. A supplier who can withhold essential materials has coercive power. This power is often effective in the short term, but it can damage relationships and create resentment.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Legitimate Power',
                    icon: <Building2 size={16} />,
                    content: (
                      <>
                        <p><strong>The power that comes from having a formal position or authority.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p>Legitimate power is derived from a person's formal position or authority within an organization or hierarchy. This could include titles like CEO, manager, or team leader. People with legitimate power have the right to make decisions and give orders. For example, a CEO negotiating a merger has legitimate power because they represent the company. A judge in a courtroom has legitimate power due to their position. This power is effective when the other party recognizes and respects the authority of the position.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Expert Power',
                    icon: <Book size={16} />,
                    content: (
                      <>
                        <p><strong>The power that comes from having special knowledge or skills.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p>Expert power is based on specialized knowledge, skills, or expertise in a particular area. If you have unique knowledge or skills that the other party values, you have expert power. For example, a lawyer negotiating a legal settlement has expert power because they understand the law. A consultant with specialized industry knowledge has expert power. This power is effective when the other party recognizes and values the expertise.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Referent Power',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>The power that comes from being liked or respected by others.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p>Referent power is derived from personal charisma, likability, or respect. If the other party admires or identifies with you, you have referent power. This could be due to your personality, reputation, or relationships. For example, a popular leader has referent power because people want to be associated with them. A trusted colleague has referent power because people value their opinions. This power is effective when the other party wants to maintain a positive relationship.</p>
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

            {/* SECTION 4: Studying Personalities of Negotiators */}
            <div
              ref={(el) => {
                sectionRefs.current['personalities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Studying Personalities of Negotiators
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Studying Personalities of Negotiators?</strong><br />
                    Everyone has a different way of thinking and acting. Understanding these differences can help you figure out how someone might behave in a negotiation. It is like knowing if someone prefers to talk a lot or listen, or if they make decisions based on logic or feelings.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>The Four Dimensions of Personality (MBTI):</strong>
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Extraversion (E) or Introversion (I)',
                    icon: <User size={16} />,
                    content: (
                      <>
                        <p><strong>Whether someone gets their energy from being around people or from being alone.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p><strong>Extraverts (E)</strong> tend to be outgoing, assertive, and energized by social interaction. They often think out loud and enjoy brainstorming with others. In a negotiation, they might be more vocal, assertive, and focused on building relationships. They might also be more comfortable with spontaneous discussions and less structured negotiations.</p>
                        <p><strong>Introverts (I)</strong> tend to be reserved, reflective, and energized by spending time alone. They often think before they speak and prefer to process information internally. In a negotiation, they might be more quiet, thoughtful, and focused on analysing information. They might also prefer structured negotiations with clear agendas and ample time for preparation.</p>
                        <p>Understanding whether a negotiator is an extravert or introvert helps you anticipate their communication style and preferred negotiation approach. Extraverts may need to be given opportunities to speak, and introverts may need to be given time to process information.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Sensing (S) or Intuition (N)',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Whether someone focuses on facts and details or on possibilities and the big picture.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p><strong>Sensing (S)</strong> individuals focus on concrete facts, details, and practical realities. They prefer to work with tangible information and rely on past experiences. In a negotiation, they might be more focused on specific data, measurable outcomes, and established procedures. They might also be more cautious and risk averse.</p>
                        <p><strong>Intuition (N)</strong> individuals focus on abstract concepts, possibilities, and future implications. They prefer to work with patterns, insights, and innovative ideas. In a negotiation, they might be more focused on the big picture, long-term goals, and creative solutions. They might also be more comfortable with ambiguity and change.</p>
                        <p>Understanding whether a negotiator prefers sensing or intuition helps you tailor your communication to their preferred way of processing information. Sensing negotiators will want to see the data, while intuitive negotiators will want to discuss possibilities.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Thinking (T) or Feeling (F)',
                    icon: <Brain size={16} />,
                    content: (
                      <>
                        <p><strong>Whether someone makes decisions based on logic or based on feelings and values.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p><strong>Thinking (T)</strong> individuals make decisions based on logic, objective analysis, and impersonal criteria. They prioritize fairness and consistency. In a negotiation, they might be more focused on facts, data, and logical arguments. They might also be more detached and less concerned with emotional considerations.</p>
                        <p><strong>Feeling (F)</strong> individuals make decisions based on personal values, empathy, and social harmony. They prioritize relationships and strive to create win-win situations. In a negotiation, they might be more focused on building rapport, understanding the other party's needs, and maintaining positive relationships. They might also be more sensitive to emotional cues.</p>
                        <p>Knowing whether a negotiator prefers thinking or feeling helps you understand their decision-making process and communication style. Thinking negotiators will want to see the logic, while feeling negotiators will want to understand the impact on people.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Judging (J) or Perceiving (P)',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p><strong>Whether someone prefers structure and planning or flexibility and spontaneity.</strong></p>
                        <p><strong>Detailed Explanation:</strong></p>
                        <p><strong>Judging (J)</strong> individuals prefer structure, organization, and planning. They like to make decisions quickly and stick to schedules. In a negotiation, they might be more focused on deadlines, agendas, and clear outcomes. They might also be more decisive and less flexible.</p>
                        <p><strong>Perceiving (P)</strong> individuals prefer flexibility, spontaneity, and adaptability. They like to keep their options open and explore different possibilities. In a negotiation, they might be more open to changing plans, exploring new ideas, and adapting to unexpected situations. They might also be more comfortable with ambiguity and less focused on deadlines.</p>
                        <p>Understanding whether a negotiator prefers judging or perceiving helps you anticipate their approach to planning and decision-making. Judging negotiators will want a clear plan, while perceiving negotiators will want to explore options.</p>
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
                  💡 Negotiation Insight
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
                  <span>Sub‑topics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">14</span>
                </li>
                <li className="flex justify-between">
                  <span>Power Sources</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Personality Dimensions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Tradeables are genuine concessions; straw issues are tactical decoys. Analyse the first offer for credibility and compare to your BATNA. Leverage the five power sources (Reward, Coercive, Legitimate, Expert, Referent) and adapt to your counterpart's MBTI personality type (E/I, S/N, T/F, J/P) for more effective negotiations.
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
                <strong className="text-white">Tradeables &amp; Straw Issues</strong> – Tradeables are genuine concessions; straw issues are tactical decoys. Use Reynolds' model to strategically exchange value and create the perception of compromise.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Analysing the First Offer</strong> – Assess credibility against market benchmarks, avoid anchoring bias, and compare the offer to your BATNA (Best Alternative to a Negotiated Agreement) to decide whether to accept, reject, or counter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Negotiation Power</strong> – Five sources: Reward (give what they want), Coercive (punish), Legitimate (formal authority), Expert (knowledge), and Referent (likability). Use them ethically and strategically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Personalities (MBTI)</strong> – Adapt to your counterpart's preference: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving. Tailor your communication, information sharing, and decision-making style accordingly.
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
            Sidemann Academic Registry • Tradeables &amp; Negotiation Power Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
