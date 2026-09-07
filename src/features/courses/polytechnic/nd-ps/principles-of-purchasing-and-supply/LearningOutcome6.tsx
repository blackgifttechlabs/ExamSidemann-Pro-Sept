import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  ListChecks,
  Users,
  Handshake,
  Lightbulb,
  Scale,
  Ear,
  Smile,
  Anchor,
  Gavel,
  Drama,
  Gift,
  DoorOpen,
  ShoppingCart,
  Truck,
  MessageSquare,
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
  { id: 'principles', label: 'Principles' },
  { id: 'tactics', label: 'Tactics & Techniques' },
  { id: 'roleplay', label: 'Roleplay Example' },
  { id: 'bargaining', label: 'Bargaining Strength' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'The Harvard Negotiation Project developed the "principled negotiation" approach, which focuses on separating people from the problem, focusing on interests, inventing options, and using objective criteria.',
      },
      {
        title: 'Pro Tip',
        text: 'Active listening is one of the most powerful negotiation techniques. Paraphrase what the other party says to confirm understanding and build rapport.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four principles of negotiation: Separate People from Problem, Focus on Interests, Invent Options for Mutual Gain, Use Objective Criteria — "SPIN" can help recall them.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t make the first offer without careful consideration. Anchoring is powerful, but an unrealistic anchor can damage your credibility.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Harvard Negotiation Project developed the "principled negotiation" approach, which focuses on separating people from the problem, focusing on interests, inventing options, and using objective criteria.',
      },
      {
        title: 'Pro Tip',
        text: 'Active listening is one of the most powerful negotiation techniques. Paraphrase what the other party says to confirm understanding and build rapport.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four principles of negotiation: Separate People from Problem, Focus on Interests, Invent Options for Mutual Gain, Use Objective Criteria — "SPIN" can help recall them.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t make the first offer without careful consideration. Anchoring is powerful, but an unrealistic anchor can damage your credibility.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; NEGOTIATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Assessing the Principles of{' '}
            <span className="text-cyan-300 font-bold italic">
              Negotiation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to negotiation principles, tactics, role-play scenarios, and buyer-supplier bargaining strength.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Negotiation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Principles
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Tactics
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
                placeholder="Search for a principle, tactic, concept..."
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
            {/* SECTION 1: Principles of Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What are the Principles of Negotiation?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the core ideas that help people reach agreements. It is like having a set of guidelines to follow when you are trying to solve a problem with someone else.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Separate the People from the Problem', icon: <Users size={16} />, content: 'Focus on solving the issue, not attacking the other person. This principle emphasizes distinguishing between the people involved and the actual problem. By avoiding personal attacks and focusing on the problem, negotiators can preserve relationships and create a collaborative environment.' },
                  { title: '2. Focus on Interests, Not Positions', icon: <Target size={16} />, content: 'Understand why someone wants something, not just what they want. Positions are stated demands; interests are underlying needs. Focusing on interests allows exploration of creative solutions that satisfy everyone\'s needs, building trust and rapport.' },
                  { title: '3. Invent Options for Mutual Gain', icon: <Lightbulb size={16} />, content: 'Brainstorm different solutions that benefit everyone. This encourages exploring a wide range of potential solutions before committing. By generating multiple options, negotiators avoid getting locked into a single solution and increase the chance of a win-win outcome.' },
                  { title: '4. Insist on Using Objective Criteria', icon: <Scale size={16} />, content: 'Use fair standards and facts to decide on the best solution. Objective criteria (market value, industry standards, legal precedents) ensure fairness and impartiality, reducing subjective biases and emotional arguments.' },
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

            {/* SECTION 2: Tactics and Techniques of Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['tactics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tactics and Techniques of Negotiation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What are Negotiation Tactics and Techniques? These are the specific actions and strategies people use during a negotiation to try and get what they want. They are like the moves you make in a game of chess.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Active Listening', icon: <Ear size={16} />, content: 'Really paying attention to what the other person is saying. Involves verbal and nonverbal cues, clarifying questions, summarizing, and empathy. Builds rapport, gains information, and avoids misunderstandings.' },
                  { title: '2. Building Rapport', icon: <Smile size={16} />, content: 'Making the other person feel comfortable and building a connection. Achieved through small talk, finding common ground, and empathy. Creates a collaborative atmosphere and productive negotiations.' },
                  { title: '3. Anchoring', icon: <Anchor size={16} />, content: 'Making the first offer to set the tone of the negotiation. Leverages the psychological principle of relying heavily on the first piece of information. Must be reasonable and justifiable to maintain credibility.' },
                  { title: '4. Using Objective Criteria', icon: <Gavel size={16} />, content: 'Using facts and fair standards to support your arguments. Relies on independent standards like market data or legal precedents. Ensures fairness and reduces bias.' },
                  { title: '5. The "Good Guy/Bad Guy" Technique', icon: <Drama size={16} />, content: 'One person acts tough, the other acts nice to get you to agree. Creates urgency and pressure, leading to concessions. Easily spotted and can damage relationships.' },
                  { title: '6. The "Nibble" Technique', icon: <Gift size={16} />, content: 'Asking for small extras at the end of a negotiation. Leverages the tendency to agree to small requests after a larger commitment. Use sparingly to avoid being perceived as manipulative.' },
                  { title: '7. The "Walk Away" Technique', icon: <DoorOpen size={16} />, content: 'Threatening to leave the negotiation if your demands are not met. Creates pressure to avoid losing the deal. Use cautiously as it can damage relationships and end negotiations.' },
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

            {/* SECTION 3: Example of a Roleplay Negotiation */}
            <div
              ref={(el) => {
                sectionRefs.current['roleplay'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Example of a Roleplay Negotiation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Scenario
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Company A (You):</strong> A small, growing tech company specializing in AI powered marketing tools. You are looking to lease a new office space in a prime downtown location to accommodate your expanding team.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Company B (Me):</strong> A commercial real estate agency representing the landlord of a desirable office building.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>Your Goal:</strong> Secure a lease for a suitable office space at a favourable price and with flexible terms.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  <strong>My Goal:</strong> Secure a long-term lease at the highest possible price and with terms that protect the landlord's interests.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <MessageSquare size={16} /> The Negotiation
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p><strong>Me:</strong> "Welcome to the offices of 'Downtown Properties.' I am happy to show you the available space on the 10th floor. It's a fantastic location, with stunning city views and modern amenities."</p>
                  <p><strong>You:</strong> "Thank you for having us. The space does look impressive. However, location is just one factor for us. We are a growing tech company, so flexibility and cost are crucial. Before we go up, could you give me a general idea of the leasing terms?"</p>
                  <p><strong>Me:</strong> "Certainly. The standard lease term for this space is five years, with a monthly rental rate of $6,000. This includes basic utilities and building maintenance."</p>
                  <p><strong>You:</strong> "Five years is a significant commitment for a company like ours. We are growing rapidly, and our needs could change. Also, $6,000 is a bit higher than our budget. Could we discuss some flexibility on the lease term and rental rate?"</p>
                  <p><strong>Me:</strong> "Well, the landlord prefers long-term leases to ensure stability. However, we might be able to offer a three-year lease with an option to renew. As for the rental rate, $6,000 is the market rate for this prime location."</p>
                  <p><strong>You:</strong> "A three-year lease with an option to renew is better. What about the rent? We have done some market research, and we believe a fair rate for this space would be closer to $5,000 per month. Could we also discuss some tenant improvements, like installing additional network cabling?"</p>
                  <p><strong>Me:</strong> "I understand your position, but $5,000 is significantly below our target. However, to show our commitment to finding a mutually beneficial agreement, we could offer a rental rate of $5,750 per month. As for tenant improvements, we could include basic cabling, but any extensive modifications would be at your expense."</p>
                  <p><strong>You:</strong> "That's a step in the right direction. $5,500 would be more in line with our budget. And regarding the cabling, we would need to have a clearer understanding of what 'basic cabling' entails. Could we get a detailed list of included improvements?"</p>
                  <p><strong>Me:</strong> "We can definitely provide that. How about this: $5,600 per month, and we will provide a detailed list of included cabling within 24 hours. We can also include a clause that allows you to sublease a portion of the space if your team grows faster than expected."</p>
                  <p><strong>You:</strong> "The subleasing clause is a good addition. How about we finalize at $5,550, and we have a deal?"</p>
                  <p><strong>Me:</strong> "Alright, $5,550 it is. We will draw up the lease agreement with all the agreed upon terms, and we will send it to you for review. We are happy to have you as a tenant."</p>
                  <p><strong>You:</strong> "Excellent. We look forward to moving in."</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Analysis
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Active Listening:</strong> Both parties listened to each other's concerns and needs.</li>
                  <li><strong>Focus on Interests:</strong> You focused on flexibility and cost, while I focused on long-term stability and market rates.</li>
                  <li><strong>Invent Options:</strong> We explored different lease terms, rental rates, and tenant improvements.</li>
                  <li><strong>Objective Criteria:</strong> You used market research to support your rental rate proposal.</li>
                  <li><strong>Compromise and Concessions:</strong> Both parties made concessions to reach a mutually agreeable outcome.</li>
                  <li><strong>Building Rapport:</strong> Both parties remained professional and friendly.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Buyer and Supplier Bargaining Strength */}
            <div
              ref={(el) => {
                sectionRefs.current['bargaining'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Buyer and Supplier Bargaining Strength
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    What is Bargaining Strength? It is about how much power a buyer or a supplier has in a negotiation. Imagine a tug-of-war; bargaining strength is like how much each side can pull.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ShoppingCart size={16} /> 1. Buyer's Bargaining Strength
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    How much power the person buying something must get a good deal.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Number of Suppliers:</strong> Many suppliers increase buyer power.</li>
                    <li><strong>Volume of Purchases:</strong> Large buyers are more important to suppliers.</li>
                    <li><strong>Substitute Products:</strong> Many substitutes increase buyer options.</li>
                    <li><strong>Vertical Integration:</strong> Ability to produce the product themselves.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Truck size={16} /> 2. Supplier's Bargaining Strength
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    How much power the person selling something must get a good deal.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Number of Suppliers:</strong> Few suppliers increase supplier power.</li>
                    <li><strong>Substitute Products:</strong> Few substitutes reduce buyer options.</li>
                    <li><strong>Customer Base:</strong> Diverse customers reduce dependency on a single buyer.</li>
                    <li><strong>Forward Integration:</strong> Ability to sell directly to consumers.</li>
                  </ul>
                </div>
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
                  <span>Negotiation Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Negotiation Tactics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Bargaining Strength Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4 each</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Negotiation is not about winning at all costs; it's about finding mutually beneficial solutions. Separate people from the problem, focus on interests, invent options for mutual gain, and use objective criteria. Effective tactics like active listening, anchoring, and building rapport can improve outcomes. Understand the bargaining strength of both buyers and suppliers to negotiate effectively.
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
                <strong className="text-white">Negotiation Principles</strong> – Separate People from Problem, Focus on Interests, Invent Options for Mutual Gain, Use Objective Criteria (SPIN).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Negotiation Tactics</strong> – Active Listening, Building Rapport, Anchoring, Objective Criteria, Good Guy/Bad Guy, Nibble, Walk Away.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Bargaining Strength</strong> – Buyer power increases with many suppliers, large volume, substitutes, and vertical integration. Supplier power increases with few suppliers, few substitutes, diverse customers, and forward integration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Win‑Win Outcomes</strong> – Effective negotiation seeks mutual gain through collaboration, compromise, and creative problem-solving.
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
            Sidemann Academic Registry • Procurement &amp; Negotiation 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;