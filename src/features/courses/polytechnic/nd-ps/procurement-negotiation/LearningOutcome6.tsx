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
  Swords,
  Minimize2,
  Handshake,
  Heart,
  Scale,
  Mic,
  Users,
  FileCheck,
  GitBranch,
  AlertCircle,
  Eye,
  ThumbsUp,
  List,
  CheckSquare,
  Brain,
  UserX,
  AlertTriangle,
  User,
  Clock,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'tki', label: 'TKI Modes' },
  { id: 'subliminal', label: 'Subliminal Linguistics' },
  { id: 'summarization', label: 'Summarization' },
  { id: 'prisoner', label: 'Prisoner\'s Dilemma' },
  { id: 'gametheory', label: 'Game Theory Matrix' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'The Thomas-Kilmann Conflict Mode Instrument (TKI) was developed by Kenneth Thomas and Ralph Kilmann in the 1970s. It remains one of the most widely used conflict resolution tools in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'When using subliminal linguistics, be ethical. These techniques are powerful, but using them to manipulate or deceive can damage trust and relationships.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five TKI modes by the acronym "CACAC": Competing, Avoiding, Collaborating, Accommodating, Compromising.',
      },
      {
        title: 'Common Mistake',
        text: 'Many negotiators default to "Compromising" too quickly. Sometimes "Collaborating" can create more value, even if it takes longer.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Thomas-Kilmann Conflict Mode Instrument (TKI) was developed by Kenneth Thomas and Ralph Kilmann in the 1970s. It remains one of the most widely used conflict resolution tools in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'When using subliminal linguistics, be ethical. These techniques are powerful, but using them to manipulate or deceive can damage trust and relationships.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five TKI modes by the acronym "CACAC": Competing, Avoiding, Collaborating, Accommodating, Compromising.',
      },
      {
        title: 'Common Mistake',
        text: 'Many negotiators default to "Compromising" too quickly. Sometimes "Collaborating" can create more value, even if it takes longer.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Conflict Management, Subliminal Linguistics &amp;{' '}
            <span className="text-cyan-300 font-bold italic">
              Game Theory
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to Thomas-Kilmann Conflict Modes, subliminal linguistics, summarization techniques, and game theory in negotiation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Swords size={14} className="inline mr-1" /> TKI Modes
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Mic size={14} className="inline mr-1" /> Subliminal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ThumbsUp size={14} className="inline mr-1" /> Summarization
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Game Theory
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
                placeholder="Search for a conflict mode, linguistic technique, game theory concept..."
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
                Introduction to Conflict &amp; Game Theory
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome covers essential tools for managing conflict and making strategic decisions. You will explore the Thomas-Kilmann Conflict Mode Instrument to understand your preferred conflict style, learn about subliminal linguistics to recognise subtle persuasive language, master summarisation and ratification techniques to close negotiations effectively, and dive into game theory including the Prisoner's Dilemma to analyse strategic interactions.
                  </p>
</div>
            </div>

            {/* SECTION 2: Thomas-Kilmann Conflict Mode Instrument */}
            <div
              ref={(el) => {
                sectionRefs.current['tki'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Using Thomas-Kilmann Conflict Mode Instrument Elements
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is the Thomas-Kilmann Conflict Mode Instrument (TKI)?</strong> The TKI is a tool that helps you understand your preferred style of handling conflict. It identifies five different conflict-handling modes, each with its own strengths and weaknesses.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Competing',
                    icon: <Swords size={16} />,
                    content: (
                      <>
                        <p><strong>Assertive and Uncooperative – standing your ground and pushing for your own way.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The competing mode is characterized by assertiveness and a focus on pursuing one's own concerns at the other person's expense. It involves taking a firm stance, defending your position, and using power or authority to win. This mode is appropriate when quick, decisive action is vital, in emergencies, or when defending a vital principle. However, it can damage relationships and create resentment if overused.</p>
                        <p><strong>When to Use:</strong> In emergencies requiring quick decisions; when defending vital issues or principles; when you know you are right and need to take a stand.</p>
                        <p><strong>When to avoid:</strong> When relationships are important; when you are wrong; when there is time to find a mutually beneficial solution.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Avoiding',
                    icon: <Minimize2 size={16} />,
                    content: (
                      <>
                        <p><strong>Unassertive and Uncooperative – ignoring the conflict or withdrawing from it.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The avoiding mode involves withdrawing from the conflict, ignoring disagreements, or postponing discussions. It is characterized by unassertiveness and a lack of cooperation. This mode is appropriate when the issue is trivial, when the potential damage of confrontation outweighs the benefits, or when you need time to cool down. However, it can lead to unresolved issues and damaged relationships if used excessively.</p>
                        <p><strong>When to Use:</strong> When the issue is trivial or unimportant; when the potential damage of confrontation outweighs the benefits; when you need time to cool down or gather information.</p>
                        <p><strong>When to avoid:</strong> When the issue is important; when relationships are important; when postponing the conflict will make it worse.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Collaborating',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p><strong>Assertive and Cooperative – working together to find a solution that satisfies everyone.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The collaborating mode involves working together to find a mutually beneficial solution. It is characterized by assertiveness and cooperation. This mode is appropriate when both parties have important concerns, when a creative solution is needed, or when building relationships is important. However, it can be time-consuming and requires a high level of trust.</p>
                        <p><strong>When to Use:</strong> When both parties have important concerns; when a creative solution is needed; when building relationships is important.</p>
                        <p><strong>When to avoid:</strong> When time is limited; when the issue is trivial; when one party is unwilling to cooperate.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Accommodating',
                    icon: <Heart size={16} />,
                    content: (
                      <>
                        <p><strong>Unassertive and Cooperative – giving in to the other person's wishes.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The accommodating mode involves putting the other person's needs before your own. It is characterized by unassertiveness and cooperation. This mode is appropriate when preserving relationships is important, when you are willing to yield, or when you are wrong. However, it can lead to feelings of resentment if overused.</p>
                        <p><strong>When to Use:</strong> When preserving relationships is important; when you are willing to yield or admit you are wrong; when the issue is more important to the other person.</p>
                        <p><strong>When to avoid:</strong> When your own concerns are important; when you feel you are being taken advantage of; when giving in will not resolve the issue.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Compromising',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p><strong>Moderately Assertive and Cooperative – finding a middle ground where both sides give up something.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The compromising mode involves finding a middle ground where both parties give up something to reach a mutually acceptable solution. It is characterized by moderate assertiveness and cooperation. This mode is appropriate when time is limited, when a temporary solution is needed, or when both parties are willing to make concessions. However, it can lead to suboptimal solutions if important concerns are overlooked.</p>
                        <p><strong>When to Use:</strong> When time is limited; when a temporary solution is needed; when both parties are willing to make concessions.</p>
                        <p><strong>When to avoid:</strong> When important principles are at stake; when a creative solution is possible; when one party is unwilling to compromise fairly.</p>
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

            {/* SECTION 3: Analysis of Subliminal Linguistics */}
            <div
              ref={(el) => {
                sectionRefs.current['subliminal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analysis of Subliminal Linguistics
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Subliminal Linguistics?</strong> Subliminal linguistics refers to the use of language in a way that influences people subconsciously, without them being fully aware of it. It is about using words and phrases that subtly shape thoughts, feelings, and behaviours.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Command',
                    icon: <Mic size={16} />,
                    content: (
                      <>
                        <p><strong>Using words that directly tell someone what to do, but in a subtle way.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Command subliminal linguistics involves embedding direct or indirect commands within statements, using phrasing that subtly directs the listener's actions. This can be done by using implied imperatives, suggestive phrasing, or embedded suggestions. For example, instead of saying "Buy this product," a command might be phrased as "Imagine how much better your life could be with this product." The word "imagine" is a softer command, that leads the person to visualize the product. These commands often bypass conscious resistance by being delivered in a seemingly innocuous manner. This tactic can be used in advertising, sales, or even interpersonal communication to subtly guide behaviour.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Consensus',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Using words that make it seem like everyone agrees with you.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Consensus subliminal linguistics relies on creating the perception of widespread agreement or social proof. Phrases like "everyone knows," "it's common knowledge," or "most people agree" are used to imply that a particular idea or belief is universally accepted. This creates a sense of social pressure and encourages the listener to conform to the perceived majority opinion. This tactic is effective because people tend to be influenced by the actions and beliefs of others. This is very commonly used in political campaigns, and marketing.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Contractor',
                    icon: <FileCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Using words that make it seem like you are making a deal or agreement, even if you are not.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Contractor subliminal linguistics involves using language that suggests a formal agreement or obligation, even when no explicit contract exists. Phrases like "we understand," "it's understood," or "we're on the same page" are used to create a sense of commitment and shared understanding. This tactic can be used to subtly bind the listener to a particular course of action or belief. This can also be used by someone to subtly take charge of a situation.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Choice',
                    icon: <GitBranch size={16} />,
                    content: (
                      <>
                        <p><strong>Giving someone options, but subtly guiding them to the one you want.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Choice subliminal linguistics involves presenting the listener with a limited set of options, subtly directing them towards the preferred outcome. This can be done by framing the choices in a way that makes the desired option seem more appealing or by emphasizing the negative consequences of the other options. For example, instead of asking "Do you want to buy this?" you might ask "Do you want to pay with cash or credit?" This tactic creates the illusion of choice while subtly guiding the listener's decision. This is a very common sales tactic.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Confuse',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Using words that are confusing or unclear to distract someone.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Confuse subliminal linguistics involves using ambiguous language, jargon, or complex phrasing to disorient the listener and bypass their critical thinking. This can be done by using vague terms, shifting the topic, or presenting contradictory information. The goal is to create a state of confusion that makes the listener more susceptible to suggestion. This tactic is often used in scams, and by people trying to avoid answering direct questions.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Clairvoyant',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Using words that make it seem like you know what someone is thinking or feeling.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Clairvoyant subliminal linguistics involves using language that suggests you have insight into the listener's thoughts, feelings, or intentions. Phrases like "I know what you're thinking," "you're probably wondering," or "you're feeling..." are used to create a sense of connection and understanding. This tactic can be used to build rapport or to subtly influence the listener's beliefs. This tactic can be used by salespeople, or people that are trying to build trust.</p>
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

            {/* SECTION 4: Carrying Out Summarizing and Ratification Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['summarization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Carrying Out Summarizing and Ratification Techniques
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Summarizing and Ratification Techniques?</strong> Summarizing and ratification techniques are used at the end of a negotiation to ensure everyone understands and agrees on what has been decided. It is like double-checking your work before submitting it.
                  </p>
</div>

              {renderCard(
                '1. Thank and Bank',
                <ThumbsUp size={16} />,
                <>
                  <p><strong>Thanking the other side and summarizing the key agreements.</strong></p>
                  <p><strong>Detailed Explanation:</strong> "Thank and Bank" is a technique used to conclude a negotiation on a positive note while reinforcing the key agreements.</p>
                  <p><strong>Thank:</strong> Begin by expressing gratitude to the other party for their time, cooperation, and willingness to work together. This helps to maintain a positive relationship and create a sense of closure.</p>
                  <p><strong>Bank:</strong> Then, summarize the key agreements that have been reached, clearly and concisely. This reinforces the understanding of both parties and helps to prevent misunderstandings later on. For example, "Thank you for your time today, we have agreed on the price of X, the delivery date of Y, and the terms of Z."</p>
                  <p>This technique is effective because it ends the negotiation on a positive note while ensuring that everyone is on the same page regarding the key agreements.</p>
                </>
              )}

              {renderCard(
                '2. Summarizing',
                <List size={16} />,
                <>
                  <p><strong>Briefly stating the main points of the agreement.</strong></p>
                  <p><strong>Detailed Explanation:</strong> Summarizing involves restating the key agreements and points of understanding that have been reached during the negotiation. This is done to ensure that both parties have a clear and consistent understanding of what has been agreed upon.</p>
                  <p><strong>Key Aspects of Summarizing:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Clarity:</strong> Use clear and concise language to avoid ambiguity.</li>
                    <li><strong>Accuracy:</strong> Ensure that the summary accurately reflects the agreements that have been made.</li>
                    <li><strong>Comprehensiveness:</strong> Include all key points of agreement but avoid unnecessary details.</li>
                    <li><strong>Confirmation:</strong> Ask the other party to confirm that the summary accurately reflects their understanding.</li>
                  </ul>
                  <p>Summarizing is crucial because it helps to prevent misunderstandings and ensures that both parties are aligned on the terms of the agreement.</p>
                </>
              )}

              {renderCard(
                '3. Ratification',
                <CheckSquare size={16} />,
                <>
                  <p><strong>Formally confirming and agreeing to the final agreement.</strong></p>
                  <p><strong>Detailed Explanation:</strong> Ratification is the formal process of confirming and agreeing to the final agreement that has been reached during the negotiation. This typically involves a formal acknowledgment or approval, either verbally or in writing.</p>
                  <p><strong>Key Aspects of Ratification:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Formal Agreement:</strong> Ratification typically involves a formal acknowledgment or approval of the agreement.</li>
                    <li><strong>Documentation:</strong> In many cases, ratification involves signing a written agreement or contract.</li>
                    <li><strong>Authorization:</strong> Ensure that the individuals ratifying the agreement have the authority to do so.</li>
                    <li><strong>Clarity:</strong> The agreement should be clearly documented and understood by all parties.</li>
                  </ul>
                  <p>Ratification is important because it provides legal and binding confirmation of the agreement, ensuring that both parties are committed to fulfilling their obligations. This provides a sense of finality to the process.</p>
                  <p><strong>Example:</strong> Signing a contract or providing an e-mail that states "I agree to the terms listed above."</p>
                </>
              )}
            </div>

            {/* SECTION 5: The Prisoner's Dilemma Scenario */}
            <div
              ref={(el) => {
                sectionRefs.current['prisoner'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Prisoner's Dilemma Scenario
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Game Theory?</strong> Game theory is the study of strategic decision-making. It is about how people or groups make choices when their outcomes depend on the choices of others. It is like a game of chess, where your move depends on what your opponent might do.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Brain size={16} /> The Setup
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Imagine two criminals, let us call them Alice and Bob, are arrested for a crime. The police do not have enough evidence for a conviction, so they separate Alice and Bob and offer each of them a deal:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Confess:</strong> If one confesses and implicates the other, and the other remains silent, the confessor goes free, and the silent one gets a long prison sentence (e.g., 10 years).</li>
                    <li><strong>Both Confess:</strong> If both confess, they each get a moderate prison sentence (e.g., 5 years).</li>
                    <li><strong>Both Remain Silent:</strong> If both remain silent, they each get a short prison sentence (e.g., 1 year) for a lesser charge.</li>
                  </ul>
                  <p><strong>The Dilemma:</strong> Here is the tricky part: Alice and Bob cannot communicate with each other. They must make their decisions independently.</p>
                  <p>From Alice's perspective:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>If Bob remains silent, Alice is better off confessing (going free instead of 1 year).</li>
                    <li>If Bob confesses, Alice is also better off confessing (5 years instead of 10 years).</li>
                  </ul>
                  <p>The same logic applies to Bob. Therefore, regardless of what Bob does, Alice's best individual strategy is to confess. Similarly, Bob's best individual strategy is to confess.</p>
                  <p><strong>The Outcome:</strong> If both Alice and Bob act rationally based on their individual self-interest, they will both confess, and they will each receive a moderate prison sentence (5 years).</p>
                  <p><strong>The Paradox:</strong> The paradox is that if they had both cooperated and remained silent, they would have each received a much shorter prison sentence (1 year). However, because they could not trust each other, they ended up with a worse outcome.</p>
                  <p><strong>Key Concepts:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Rational Self-Interest:</strong> Each prisoner acts in a way they believe will maximize their own benefit.</li>
                    <li><strong>Lack of Communication:</strong> The prisoners cannot communicate or coordinate their actions.</li>
                    <li><strong>Dominant Strategy:</strong> Confessing is the dominant strategy for both prisoners, regardless of what the other does.</li>
                    <li><strong>Nash Equilibrium:</strong> The outcome where both prisoners confess is a Nash Equilibrium, meaning neither prisoner has an incentive to change their strategy, given the other prisoner's strategy.</li>
                  </ul>
                  <p><strong>Real-World Applications:</strong> The Prisoner's Dilemma is used to model various real-world situations, including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Business competition:</strong> Companies may choose to lower prices to gain market share, even though it hurts the overall industry.</li>
                    <li><strong>Arms races:</strong> Countries may choose to build up their military, even though it increases the risk of war.</li>
                    <li><strong>Environmental issues:</strong> Individuals may choose to pollute, even though it harms the environment as a whole.</li>
                    <li>Any situation where short-term individual gain, harms long term collective gain.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 6: Game Theory Negotiation Matrix */}
            <div
              ref={(el) => {
                sectionRefs.current['gametheory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Game Theory Negotiation Matrix
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is a Game Theory Negotiation Matrix?</strong> A game theory negotiation matrix helps us visualize and understand the potential outcomes of a negotiation based on the strategies each party chooses. It is like a table that shows how different choices lead to different results, helping us predict and plan our moves.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    In a negotiation matrix, we typically represent two parties and their potential strategies, usually "Collaborate" and "Compete." The matrix then shows the outcomes for each party based on the combination of strategies.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Collaborate/Collaborate',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p><strong>Both sides work together to find a win-win solution.</strong></p>
                        <p><strong>Detailed Explanation:</strong> In this scenario, both parties choose to collaborate, meaning they prioritize cooperation, open communication, and finding mutually beneficial solutions. They focus on building trust, sharing information, and exploring creative options to maximize joint gains. This approach leads to a win-win outcome, where both parties achieve their goals and strengthen their relationship. For example, two companies negotiating a joint venture might choose to collaborate by sharing resources, expertise, and market access, resulting in a successful partnership. The outcome of this scenario is that both players are better off than they would be if they competed. This type of negotiation strengthens relationships and builds trust.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Compete/Collaborate',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>One side tries to win at the other's expense, while the other tries to cooperate.</strong></p>
                        <p><strong>Detailed Explanation:</strong> In this scenario, one party chooses to compete, meaning they prioritize their own interests and seek to maximize their gains at the expense of the other party. Meanwhile, the other party chooses to collaborate, meaning they prioritize cooperation and seek to find mutually beneficial solutions. This leads to a win-lose outcome, where the competing party gains an advantage, and the collaborating party is at a disadvantage. For example, a supplier might choose to compete by demanding higher prices, while a buyer chooses to collaborate by seeking a long-term partnership. The supplier may gain a short-term profit, while the buyer may suffer financial loss. This scenario often leaves the collaborating party feeling exploited and can damage relationships.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Collaborate/Compete',
                    icon: <UserX size={16} />,
                    content: (
                      <>
                        <p><strong>One side tries to cooperate, while the other tries to win at their expense.</strong></p>
                        <p><strong>Detailed Explanation:</strong> This scenario is the reverse of the previous one. Here, one party chooses to collaborate, while the other chooses to compete. This also leads to a win-lose outcome, but the roles are reversed. The competing party gains an advantage, and the collaborating party is at a disadvantage. This situation is similar to the previous one, where the collaborating party will feel exploited, and the relationship will be damaged. For example, a company might choose to collaborate by sharing confidential information, while a competitor chooses to compete by using that information to gain a competitive advantage. This scenario highlights the risks of collaboration when the other party is not trustworthy.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Compete/Compete',
                    icon: <Swords size={16} />,
                    content: (
                      <>
                        <p><strong>Both sides try to win at each other's expense.</strong></p>
                        <p><strong>Detailed Explanation:</strong> In this scenario, both parties choose to compete, meaning they prioritize their own interests and seek to maximize their gains at the expense of the other party. This leads to a lose-lose outcome, where both parties suffer losses or achieve suboptimal results. This is because both parties are trying to maximize their own gain, without care for the other side. For example, two companies engaged in a price war might choose to compete by lowering prices below cost, resulting in financial losses for both companies. This scenario highlights the destructive nature of competition when both parties are unwilling to cooperate. This scenario can also lead to damaged relationships.</p>
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
                  💡 Conflict Insight
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
                  <span>TKI Modes</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Subliminal Techniques</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Game Theory Scenarios</span>
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
                The TKI modes (Competing, Avoiding, Collaborating, Accommodating, Compromising) help you choose your conflict style. Subliminal linguistics (Command, Consensus, Contractor, Choice, Confuse, Clairvoyant) subtly influence decisions. Use summarization and ratification (Thank and Bank, Summarizing, Ratification) to close negotiations effectively. The Prisoner's Dilemma illustrates the tension between individual and collective rationality. The Game Theory Matrix (Collaborate/Compete combinations) helps predict outcomes based on strategy choices.
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
                <strong className="text-white">Thomas-Kilmann Conflict Modes</strong> – Five styles: Competing, Avoiding, Collaborating, Accommodating, Compromising. Choose the right mode based on the situation and importance of the relationship.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Subliminal Linguistics</strong> – Six techniques: Command, Consensus, Contractor, Choice, Confuse, Clairvoyant. Use them ethically to influence perceptions and decisions subtly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Summarization &amp; Ratification</strong> – Close negotiations with "Thank and Bank," clear summarization, and formal ratification to ensure mutual understanding and commitment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prisoner's Dilemma</strong> – Demonstrates how rational self-interest can lead to suboptimal outcomes when cooperation is not possible. Highlights the importance of trust and communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Game Theory Matrix</strong> – Four scenarios (Collaborate/Collaborate, Compete/Collaborate, Collaborate/Compete, Compete/Compete) show outcomes based on strategy combinations. Strive for win-win where possible.
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
            Sidemann Academic Registry • Conflict &amp; Game Theory Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
