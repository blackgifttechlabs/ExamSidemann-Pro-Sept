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
  Hash,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'integrative', label: 'Integrative' },
  { id: 'distributive', label: 'Distributive' },
  { id: 'perceived', label: 'Win/Perceived Win' },
  { id: 'team', label: 'Team Preparation' },
  { id: 'agenda', label: 'Agenda Setting' },
  { id: 'swot', label: 'SWOT Analysis' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'Integrative negotiation is often called "win-win" because it focuses on creating value, not just claiming it. It was popularized by the Harvard Negotiation Project in the 1980s.',
      },
      {
        title: 'Pro Tip',
        text: 'In distributive negotiation, always set a strong but reasonable anchor. Your first offer can significantly influence the final outcome.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five steps of team preparation: Select Participants, Assign Roles, Agree Priorities, Devise a Code, Set Rules of Engagement. These ensure a cohesive negotiation team.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the SWOT analysis before negotiating. Understanding your strengths, weaknesses, opportunities, and threats is essential for strategic planning.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Integrative negotiation is often called "win-win" because it focuses on creating value, not just claiming it. It was popularized by the Harvard Negotiation Project in the 1980s.',
      },
      {
        title: 'Pro Tip',
        text: 'In distributive negotiation, always set a strong but reasonable anchor. Your first offer can significantly influence the final outcome.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five steps of team preparation: Select Participants, Assign Roles, Agree Priorities, Devise a Code, Set Rules of Engagement. These ensure a cohesive negotiation team.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the SWOT analysis before negotiating. Understanding your strengths, weaknesses, opportunities, and threats is essential for strategic planning.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> NEGOTIATION &amp; CONFLICT RESOLUTION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Negotiation Strategies{' '}
            <span className="text-emerald-300 font-bold italic">
              &amp; Development
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to negotiation strategies, team preparation, agenda setting, and SWOT analysis for effective negotiations.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Strategies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ListChecks size={14} className="inline mr-1" /> Team
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> Agenda
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
                placeholder="Search for a concept, technique, step..."
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
            {/* SECTION 1: Intro – What are Negotiation Strategies? */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What are Negotiation Strategies?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are trying to buy a used car. You and the seller both want something: you want a good car at a low price, and they want to sell the car for a high price. How you approach this conversation – whether you try to work together to find a price you both like and try to get the best deal for yourself even if it means the other person loses – that is your negotiation strategy.
                  </p>
</div>
            </div>

            {/* SECTION 2: Integrative Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['integrative'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Integrative (Win/Win) Negotiation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Working together with the other person to find a solution that makes both of you happy.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Integrative negotiation focuses on creating value for both parties involved. It is about finding common ground and exploring options that satisfy everyone's needs. Instead of seeing the negotiation as a battle, you see it as a problem-solving exercise. For example, in a business deal, instead of just arguing about price, you might also discuss things like delivery schedules, payment terms, or additional services. By exploring these different aspects, you can often find ways to create a "win-win" situation where both parties feel like they have gotten a good deal. To develop this strategy, you need to be open and honest with the other party, actively listen to their concerns, and be willing to compromise. It is important to establish trust and look for areas where both parties’ interests align. This method is best used when there is a long-term relationship that is valued.
                </p>
              </div>
            </div>

            {/* SECTION 3: Distributive Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['distributive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Distributive (Win/Lose) Negotiation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Hash size={16} /> Trying to get the biggest piece of the pie for yourself, even if it means the other person gets a small piece or nothing.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Distributive negotiation is a competitive approach where the goal is to maximize your own gain, even at the expense of the other party. It's often used in situations where there's a fixed amount of resources to be divided, like negotiating the price of a single item. For example, when buying a car, you might try to get the lowest possible price, even if it means the seller makes very little profit. This strategy involves using tactics like making aggressive offers, hiding information, and threatening to walk away from the deal. To develop this strategy, you need to be assertive, have strong negotiating skills, and be prepared to use leverage. It is important to know your bottom line, and to be willing to walk away from the deal. This method is best used when there is a one-off deal, and there is no expectation of a long-term relationship.
                </p>
              </div>
            </div>

            {/* SECTION 4: Win/Perceived Win Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['perceived'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Win/Perceived Win Negotiation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <GlobeIcon size={16} /> Making the other person feel like they have won, even if you have actually gotten the better deal.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Win/perceived win negotiation is a strategy where you aim to create the impression that the other party has achieved their goals, even if you have actually gained more. This involves using psychological tactics and framing the negotiation in a way that makes the other party feel satisfied. For example, you might offer small concessions or make them feel like they have negotiated a unique benefit. You need to understand the other party’s needs, and what they value. For example, if you know they value a quick deal, you might offer that. This strategy is often used in sales and marketing, where the goal is to create a positive customer experience. To develop this strategy, you need to be skilled at persuasion and have a good understanding of human psychology. It is important to be ethical, and not to deceive the other party.
                </p>
              </div>
            </div>

            {/* SECTION 5: Determining the Negotiation Team */}
            <div
              ref={(el) => {
                sectionRefs.current['team'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Determining the Negotiation Team
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are going to a big game with your friends. You want to pick the best people for your team, give everyone a job to do, agree on what is most important, have secret signals, and know how you will all act during the game. That is what determining the negotiation team is like. You are building a team to get the best deal, and you need to make sure everyone works together smoothly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Selecting the Participants', icon: <ListChecks size={16} />, content: 'Picking the right people with the right skills for your team. Identify individuals with necessary skills, knowledge, and experience – a mix of technical, financial, and legal experts. Also consider personality and communication skills to ensure cohesion.' },
                  { title: '2. Team Roles', icon: <SettingsIcon size={16} />, content: 'Giving everyone on the team a specific job to do during the negotiation. Assign a lead negotiator, financial analyst, note-taker, etc. Clearly defined roles prevent confusion and ensure all aspects are covered.' },
                  { title: '3. Agreeing Priorities', icon: <Target size={16} />, content: 'Deciding what is most important to your team before you start talking to the other side. Identify key objectives and rank priorities so you know which areas are negotiable and which are non-negotiable.' },
                  { title: '4. Devising a Code Amongst Team Members', icon: <Shield size={16} />, content: 'Creating secret signals or words so you can talk to each other without the other side knowing. Allows discreet communication to avoid giving away strategy.' },
                  { title: '5. Rules of Engagement', icon: <BookOpen size={16} />, content: 'Deciding how your team will act and talk during the negotiation. Agree on respectful communication, decision-making processes, and how to handle disagreements. Ensures a professional and effective approach.' },
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

            {/* SECTION 6: Deciding the Negotiation Agenda */}
            <div
              ref={(el) => {
                sectionRefs.current['agenda'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Deciding the Negotiation Agenda
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are planning a meeting to discuss a big project. You need to decide what you will talk about, where you will meet, how the room will be set up, when you will meet, and what order you will talk about things. That is what deciding the negotiation agenda is like. It is about planning the meeting, so it is organized and productive.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Structure', icon: <Layout size={16} />, content: 'Deciding the plan for how the meeting will go. Organise topics, allocate time, and decide discussion format. A well-structured agenda keeps the meeting focused and prevents side‑tracking.' },
                  { title: '2. Home or Away', icon: <HardDriveIcon size={16} />, content: 'Deciding if the meeting will be at your place or their place. Home advantage offers control and familiarity; away shows respect and willingness to compromise. Choice impacts comfort and dynamics.' },
                  { title: '3. Room Ergonomics', icon: <LayersIcon size={16} />, content: 'Deciding how the room will be set up to make everyone comfortable and focused. Seating, lighting, temperature, and technology affect communication. A well‑designed space reduces distractions.' },
                  { title: '4. Timings', icon: <ClockIcon size={16} />, content: 'Deciding when the meeting will start and how long it will last. Schedule at convenient times, allow sufficient time for all topics, and build in flexibility for unexpected delays.' },
                  { title: '5. Agenda Item Positioning', icon: <Edit size={16} />, content: 'Deciding what order you will talk about things, putting the most important things first. Start with key issues to allow more time; consider psychological impact – a small early win can build momentum.' },
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

            {/* SECTION 7: Carrying Out a Negotiation SWOT Analysis */}
            <div
              ref={(el) => {
                sectionRefs.current['swot'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Carrying Out a Negotiation SWOT Analysis
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are about to play a game of chess. Before you start, you want to think about what you are good at, what you are not good at, what good things could happen, and what bad things could happen. That is what a negotiation SWOT analysis is like. It is about looking at your strengths, weaknesses, opportunities, and threats before you start negotiating, so you are prepared.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Strengths (Internal Advantages)', icon: <Target size={16} />, content: 'What advantages do you bring to the negotiation? What are you good at? Consider reputation, track record, unique product, market share, specialized knowledge, or financial stability. Leverage these to negotiate favourable terms.' },
                  { title: '2. Weaknesses (Internal Disadvantages)', icon: <Edit size={16} />, content: 'What disadvantages do you have in the negotiation? What are you not good at? Examples: limited resources, lack of experience, weak bargaining position, or internal conflicts. Identify and develop strategies to mitigate them.' },
                  { title: '3. Opportunities (External Favourable Factors)', icon: <GlobeIcon size={16} />, content: 'What external factors could benefit you in the negotiation? Opportunities might include a growing market, competitor weakness, regulatory changes, or new technology. Use them to your advantage.' },
                  { title: '4. Threats (External Unfavourable Factors)', icon: <Shield size={16} />, content: 'What external factors could harm you in the negotiation? Threats could be strong competitors, economic downturns, unfavourable regulations, or changing market conditions. Anticipate and develop contingency plans.' },
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
                  <span>Negotiation Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Team Preparation Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Agenda Elements</span>
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
                Successful negotiation requires a clear strategy. Choose between integrative (win-win), distributive (win-lose), or win/perceived win based on the relationship and context. Prepare your team by selecting the right participants, assigning roles, agreeing priorities, devising a code, and setting rules. Plan the agenda carefully — structure, location, ergonomics, timings, and item order all influence outcomes. Finally, conduct a SWOT analysis to understand your strengths, weaknesses, opportunities, and threats.
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
                <strong className="text-white">Negotiation Strategies</strong> – Integrative (win‑win), Distributive (win‑lose), and Win/Perceived Win each suit different contexts and relationships.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Team Preparation</strong> – select participants with the right mix of skills, assign clear roles, agree on priorities, devise a communication code, and set rules of engagement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Agenda Setting</strong> – plan the meeting structure, choose home or away location, optimise room ergonomics, schedule appropriate timings, and position agenda items strategically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">SWOT Analysis</strong> – assess internal Strengths and Weaknesses, and external Opportunities and Threats to prepare effectively and anticipate challenges.
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
            Sidemann Academic Registry • Negotiation &amp; Conflict Resolution 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;