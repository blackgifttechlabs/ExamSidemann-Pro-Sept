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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'question-types', label: 'Question Types' },
  { id: 'batna', label: 'BATNA' },
  { id: 'zopa', label: 'ZOPA' },
  { id: 'goals', label: 'Goals & Targets' },
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
        text: 'The concept of BATNA (Best Alternative to a Negotiated Agreement) was introduced by Roger Fisher and William Ury in their 1981 book "Getting to Yes." It is one of the most powerful concepts in negotiation theory.',
      },
      {
        title: 'Pro Tip',
        text: 'Always define your walk-away point before entering a negotiation. Knowing your bottom line prevents you from making a deal you\'ll regret.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four negotiation targets: Ideal (dream), Optimal (realistic), Fallback (acceptable), Walk-Away (minimum).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t ask too many closed questions in a row — they can make the other person feel interrogated. Mix in open and reflective questions to build rapport.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of BATNA (Best Alternative to a Negotiated Agreement) was introduced by Roger Fisher and William Ury in their 1981 book "Getting to Yes." It is one of the most powerful concepts in negotiation theory.',
      },
      {
        title: 'Pro Tip',
        text: 'Always define your walk-away point before entering a negotiation. Knowing your bottom line prevents you from making a deal you\'ll regret.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four negotiation targets: Ideal (dream), Optimal (realistic), Fallback (acceptable), Walk-Away (minimum).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t ask too many closed questions in a row — they can make the other person feel interrogated. Mix in open and reflective questions to build rapport.',
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

  // Helper to render a clean card (no coloured left border)
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> NEGOTIATION &amp; QUESTIONING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Developing Questioning{' '}
            <span className="text-purple-300 font-bold italic">
              Techniques
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to questioning techniques, BATNA, ZOPA, and setting negotiation goals and targets.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Type size={14} className="inline mr-1" /> Question Types
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> BATNA &amp; ZOPA
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Hash size={14} className="inline mr-1" /> Goals
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
                placeholder="Search for a technique, concept, target..."
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
            {/* SECTION 1: Intro – What are Questioning Techniques? */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What are Questioning Techniques?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Questioning techniques are different ways of asking questions to get specific types of information. It is like having different tools in a toolbox; each tool is used for a different purpose. In a negotiation, using the right questioning technique can help you gather information, understand the other person's perspective, and guide the conversation.
                  </p>
</div>
            </div>

            {/* SECTION 2: Question Types */}
            <div
              ref={(el) => {
                sectionRefs.current['question-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Question Types
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Open Questions', icon: <Type size={16} />, content: 'Questions that encourage detailed answers. Typically begin with "what," "why," "how," or "describe." Useful for building rapport, understanding perspectives, and gathering in-depth information.' },
                  { title: '2. Leading Questions', icon: <Target size={16} />, content: 'Questions that suggest a desired answer. Contain implied suggestions or biases. Can be useful for confirming assumptions but may be manipulative if overused.' },
                  { title: '3. Cool Questions', icon: <Shield size={16} />, content: 'Neutral questions that do not cause emotional reactions. Used to maintain a calm and objective atmosphere, gather factual information, and avoid conflict.' },
                  { title: '4. Planned Questions', icon: <ListChecks size={16} />, content: 'Questions that you prepare in advance. Strategized and formulated beforehand to ensure all important topics are covered and the conversation stays on track.' },
                  { title: '5. Treat Questions', icon: <GlobeIcon size={16} />, content: 'Questions that make the other person feel good or valued. Acknowledge expertise or contributions, build rapport, and create a positive atmosphere.' },
                  { title: '6. Window Questions', icon: <LayersIcon size={16} />, content: 'Questions that open up new areas of discussion. Explore hidden information, expand the scope of conversation, and reveal new perspectives.' },
                  { title: '7. Directive Questions', icon: <Edit size={16} />, content: 'Questions that guide the conversation in a specific direction. More focused than open questions, used to keep the conversation on track and achieve specific goals.' },
                  { title: '8. Gauging Questions', icon: <Target size={16} />, content: 'Questions that check the other person\'s understanding or feelings. Assess agreement, ensure everyone is on the same page, and address concerns.' },
                  { title: '9. Tag Questions', icon: <Hash size={16} />, content: 'Short questions added to the end of a statement, such as "isn\'t it?" or "don\'t you?" Used to confirm understanding or seek agreement.' },
                  { title: '10. Multiple Questions', icon: <LayersIcon size={16} />, content: 'Asking several questions at once. Efficient but can be overwhelming — use sparingly and ensure questions are related.' },
                  { title: '11. Reflective Questions', icon: <Target size={16} />, content: 'Questions that repeat or rephrase what the other person said. Show active listening, confirm understanding, and encourage further elaboration.' },
                  { title: '12. Hypothetical Questions', icon: <GlobeIcon size={16} />, content: 'Questions that ask about imaginary situations. Often begin with "what if" or "imagine." Useful for brainstorming and exploring new possibilities.' },
                  { title: '13. Closed Questions', icon: <Hash size={16} />, content: 'Questions that can be answered with a "yes" or "no." Useful for confirming facts but can limit the conversation and detailed responses.' },
                  { title: '14. Probing Questions', icon: <Search size={16} />, content: 'Questions that dig deeper into a specific topic. Follow-up questions that seek to clarify or expand on previous responses, uncovering underlying issues.' },
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

            {/* SECTION 3: Formulating Your BATNA */}
            <div
              ref={(el) => {
                sectionRefs.current['batna'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Formulating Your Best Alternative to a Negotiated Agreement (BATNA)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are trying to sell your old bicycle. If you cannot get a good price, you need to decide what you will do instead. Will you keep it? Sell it to someone else? Give it away? Your BATNA is your best option if you cannot reach an agreement in the current negotiation. It is your "Plan B."
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Know Your BATNA', icon: <Target size={16} />, content: 'Figure out your best option if the negotiation fails. Identify and evaluate all potential alternatives. Ask yourself "What will I do if I can\'t reach an agreement?" Your BATNA gives you confidence and leverage in the negotiation.' },
                  { title: '2. Improving Your BATNA', icon: <Edit size={16} />, content: 'Make your "Plan B" as strong as possible. Take steps to make your alternative options more attractive. This enhances your bargaining power and gives you more flexibility. Strengthen your fallback plan.' },
                  { title: '3. Disclose Your BATNA', icon: <Shield size={16} />, content: 'Sometimes, tell the other person about your "Plan B." Disclosing a strong BATNA can strengthen your position by signalling you are willing to walk away. Disclosing a weak BATNA can weaken your position. Use with care.' },
                  { title: '4. Consider the Other Side\'s BATNA', icon: <GlobeIcon size={16} />, content: 'Try to figure out what the other person\'s "Plan B" is. Understanding their alternatives gives you insights into their bargaining position and motivations. Anticipate their moves and develop strategies.' },
                  { title: '5. BATNA-less', icon: <Hash size={16} />, content: 'What happens if you do not have a good "Plan B"? Being BATNA-less puts you at a significant disadvantage — you are forced to accept whatever terms are offered. You have very little leverage. Always explore alternatives before entering a negotiation.' },
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

            {/* SECTION 4: Adopting the Zone of Possible Agreement (ZOPA) */}
            <div
              ref={(el) => {
                sectionRefs.current['zopa'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Adopting the Zone of Possible Agreement (ZOPA)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are trying to buy a used video game. You have a maximum price you are willing to pay, and the seller has a minimum price they are willing to accept. The ZOPA is the range of prices where you both could agree. It is the overlap between your acceptable range and their acceptable range.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>The Harvard Business School ZOPA Model:</strong> Divides the negotiation space into four zones, helping to understand how different offers are perceived.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Reasonable Zone', icon: <Target size={16} />, content: 'Offers that are good for both sides. Mutually acceptable and beneficial — both parties feel like they are getting a good deal. The goal of any negotiation is to find a solution in this zone.' },
                  { title: '2. Credible Zone', icon: <ListChecks size={16} />, content: 'Offers that are okay, but maybe not the best. Within the realm of possibility but might not be ideal. May require concessions or compromises. Can lead to agreements but might not be as satisfying.' },
                  { title: '3. Extreme Zone', icon: <Shield size={16} />, content: 'Offers that are very one-sided and might make the other person upset. Highly favourable to one party and unfavourable to the other. Often used as an anchor or starting point to move toward a more reasonable offer.' },
                  { title: '4. Insult Zone', icon: <Hash size={16} />, content: 'Offers that are so bad they are offensive. Far outside the realm of possibility, disrespectful, and likely to terminate the negotiation. Avoid entering this zone at all costs.' },
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

            {/* SECTION 5: Determining Negotiation Goals and Targets */}
            <div
              ref={(el) => {
                sectionRefs.current['goals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Determining Negotiation Goals and Targets
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When you go into a negotiation, you need to know what you want to achieve. It is like going to the grocery store with a shopping list. You have your "ideal" items, your "okay" items, your "backup" items, and things you absolutely will not buy. These are your goals and targets.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Ideal Target', icon: <Target size={16} />, content: 'The best possible outcome you can imagine. Your "dream scenario" or "best-case scenario." Ambitious but realistic. Provides a clear vision and strong foundation for your negotiation strategy.' },
                  { title: '2. Optimal Target', icon: <Edit size={16} />, content: 'A very good outcome that is still realistic. Your "most likely scenario." Challenging but attainable. Serves as a practical goal you are confident you can reach with effective negotiation.' },
                  { title: '3. Fallback', icon: <Shield size={16} />, content: 'An acceptable outcome that you are willing to settle for. Your "backup plan" or "minimum acceptable outcome." Should still meet your essential needs. Prevents you from walking away empty-handed.' },
                  { title: '4. Walk-Away', icon: <Hash size={16} />, content: 'The point where you will walk away from the negotiation because the deal is too bad. Your bottom line or reservation point. Firmly established before negotiating. Prevents you from accepting an unfavourable agreement.' },
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
                  💡 Questioning Insight
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
                  <span>Question Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">14</span>
                </li>
                <li className="flex justify-between">
                  <span>BATNA Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>ZOPA Zones</span>
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
                Effective questioning is essential for successful negotiation. Use a mix of open, closed, reflective, and probing questions to gather information and build rapport. Your BATNA (Plan B) gives you leverage and confidence. Understand the ZOPA (Zone of Possible Agreement) to identify where a deal can be struck. Set clear goals: Ideal (dream), Optimal (realistic), Fallback (acceptable), and Walk-Away (minimum).
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
                <strong className="text-white">Questioning Techniques</strong> – include open, closed, leading, cool, planned, treat, window, directive, gauging, tag, multiple, reflective, hypothetical, and probing questions — each serves a different purpose.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">BATNA</strong> – your Best Alternative to a Negotiated Agreement. Know it, improve it, consider disclosing it, and understand the other side's BATNA. Being BATNA-less puts you at a disadvantage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ZOPA</strong> – the Zone of Possible Agreement. Four zones: Reasonable (mutually beneficial), Credible (acceptable but not ideal), Extreme (one-sided), and Insult (offensive).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Negotiation Targets</strong> – Ideal (dream), Optimal (realistic), Fallback (acceptable), Walk-Away (minimum). Define these before entering any negotiation.
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
            Sidemann Academic Registry • Negotiation &amp; Questioning Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;