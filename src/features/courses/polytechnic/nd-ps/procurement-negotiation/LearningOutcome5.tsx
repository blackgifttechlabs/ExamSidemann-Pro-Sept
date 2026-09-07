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
  AlertTriangle,
  ArrowUpDown,
  Users,
  Paperclip,
  CircleIcon,
  ClockIcon,
  Layout,
  Archive,
  Scissors,
  Book,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'reynolds', label: 'Reynolds Model' },
  { id: 'tactics', label: 'Negotiation Tactics' },
  { id: 'ei', label: 'Emotional Intelligence' },
  { id: 'influencing', label: 'Influencing' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Robert Cialdini identified six principles of influence: Reciprocity, Scarcity, Authority, Consistency, Liking, and Social Proof. These are powerful tools in any negotiator’s arsenal.',
      },
      {
        title: 'Pro Tip',
        text: 'When using the "Good Cop/Bad Cop" tactic, remember that the "good cop" should appear to be on your side, making you more likely to accept their reasonable offer.',
      },
      {
        title: 'Memory Trick',
        text: 'Reynolds’ persuasion model can be remembered by the acronym CEURFR: Credibility, Empathy (understand needs), Use logic and emotion, Frame message, Rapport, Reciprocity.',
      },
      {
        title: 'Common Mistake',
        text: 'Using the "Now or Never" tactic too often can backfire, as it may make you seem untrustworthy or desperate. Use it sparingly and with genuine urgency.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Robert Cialdini identified six principles of influence: Reciprocity, Scarcity, Authority, Consistency, Liking, and Social Proof. These are powerful tools in any negotiator’s arsenal.',
      },
      {
        title: 'Pro Tip',
        text: 'When using the "Good Cop/Bad Cop" tactic, remember that the "good cop" should appear to be on your side, making you more likely to accept their reasonable offer.',
      },
      {
        title: 'Memory Trick',
        text: 'Reynolds’ persuasion model can be remembered by the acronym CEURFR: Credibility, Empathy (understand needs), Use logic and emotion, Frame message, Rapport, Reciprocity.',
      },
      {
        title: 'Common Mistake',
        text: 'Using the "Now or Never" tactic too often can backfire, as it may make you seem untrustworthy or desperate. Use it sparingly and with genuine urgency.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Persuasion Methods &amp;{' '}
            <span className="text-rose-300 font-bold italic">
              Influence
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to persuasion methods, negotiation tactics, emotional intelligence, and influencing strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Reynolds Model
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Paperclip size={14} className="inline mr-1" /> Tactics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> EI
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Book size={14} className="inline mr-1" /> Yukl &amp; Cialdini
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
                placeholder="Search for a persuasion method, tactic, EI element..."
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
            {/* SECTION 1: Introduction – What are Persuasion Methods? */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What are Persuasion Methods?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>Definition:</strong> Persuasion methods are ways to convince someone to agree with you or do what you want. It is about using different techniques to influence their thoughts and actions.
                  </p>
</div>
            </div>

            {/* SECTION 2: Reynolds' Persuasion Methods Model */}
            <div
              ref={(el) => {
                sectionRefs.current['reynolds'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reynolds' Persuasion Methods Model
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>Key Principles:</strong> Reynolds' model emphasizes that effective persuasion is not about manipulation, but about building rapport, understanding the other person's needs, and presenting information in a way that resonates with them.
                  </p>
</div>

              {[
                {
                  title: '1. Establish Credibility',
                  icon: <Shield size={16} />,
                  content: (
                    <>
                      <p><strong>Show that you are trustworthy and knowledgeable.</strong></p>
                      <p>People are more likely to be persuaded by someone they trust and respect. Establish your credibility by demonstrating your expertise, providing evidence to support your claims, and being honest and transparent. Share your credentials, experience, or relevant successes. If you are negotiating a business deal, show them relevant data that supports your claims. If you are negotiating a salary, show them your qualifications. Building trust is essential for effective persuasion.</p>
                    </>
                  ),
                },
                {
                  title: '2. Understand the Other Person\'s Needs',
                  icon: <Target size={16} />,
                  content: (
                    <>
                      <p><strong>Figure out what the other person wants and needs.</strong></p>
                      <p>Effective persuasion involves understanding the other person's needs, motivations, and values. By understanding what they want, you can tailor your message and offer solutions that address their specific concerns. Ask open-ended questions, listen actively, and pay attention to their verbal and non-verbal cues. If you are negotiating a deal, ask them what their most important needs are. If you are selling a product, ask them what problems they are trying to solve. This demonstrates that you care about their needs and are not just focused on your own agenda.</p>
                    </>
                  ),
                },
                {
                  title: '3. Use Logic and Emotion',
                  icon: <Hash size={16} />,
                  content: (
                    <>
                      <p><strong>Use both facts and feelings to make your case.</strong></p>
                      <p>People are persuaded by a combination of logic and emotion. Use logical arguments, data, and evidence to support your claims. However, also appeal to their emotions by highlighting the benefits and positive outcomes of your proposal. Tell stories, use vivid language, and connect with their values. If you are trying to convince someone to invest in a project, show them the potential financial returns, and also tell them how the project will benefit the community. Using both logic and emotion makes your message more compelling and persuasive.</p>
                    </>
                  ),
                },
                {
                  title: '4. Frame Your Message Effectively',
                  icon: <Layout size={16} />,
                  content: (
                    <>
                      <p><strong>Present your ideas in a way that is easy to understand and appealing.</strong></p>
                      <p>The way you frame your message can have a significant impact on its persuasiveness. Use clear and concise language, avoid jargon, and focus on the benefits for the other person. Frame your message in a positive light, highlighting the opportunities and potential rewards. If you are trying to convince someone to try a new product, focus on how it will improve their life. If you are trying to convince someone to change their mind, frame the change as a positive opportunity. Effective framing makes your message more persuasive and easier to understand.</p>
                    </>
                  ),
                },
                {
                  title: '5. Build Rapport',
                  icon: <GlobeIcon size={16} />,
                  content: (
                    <>
                      <p><strong>Create a friendly and positive connection with the other person.</strong></p>
                      <p>People are more likely to be persuaded by someone they like and trust. Build rapport by being friendly, approachable, and respectful. Find common ground, show genuine interest in their perspectives, and use humour appropriately. If you are negotiating with someone, start by finding common interests. If you are trying to persuade someone, make them feel comfortable and valued. Building rapport creates a positive atmosphere and makes the other person more receptive to your message.</p>
                    </>
                  ),
                },
                {
                  title: '6. Use Reciprocity',
                  icon: <ListChecks size={16} />,
                  content: (
                    <>
                      <p><strong>Give something first to make them feel like they should give something back.</strong></p>
                      <p>The principle of reciprocity states that people are more likely to comply with a request if they feel obligated to return a favour. Offer something of value to the other person before making your request. This could be a small gift, a helpful piece of information, or a concession. If you are asking someone for a favour, offer to do something for them first. If you are negotiating a deal, make a concession early in the negotiation. Using reciprocity creates a sense of obligation and increases the likelihood of compliance.</p>
                    </>
                  ),
                },
              ].map((item) => renderCard(item.title, item.icon, item.content))}
            </div>

            {/* SECTION 3: Employing Negotiation Tactics */}
            <div
              ref={(el) => {
                sectionRefs.current['tactics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Employing Negotiation Tactics
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Negotiation Tactics?</strong> Negotiation tactics are specific strategies used during a negotiation to gain an advantage or achieve a desired outcome. It is like having different plays in a sports game; each play is used to try and score.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Add-on',
                    icon: <Paperclip size={16} />,
                    content: (
                      <>
                        <p><strong>After agreeing on a main deal, adding extra things that cost more.</strong></p>
                        <p>This tactic involves securing an agreement on the core terms of a deal and then subtly adding on extra items or services that increase the overall cost. For example, after agreeing on the price of a car, the salesperson might add on extra features, extended warranties, or service packages. This tactic works by taking advantage of the other party's commitment to the initial agreement. To defend against this, carefully review all terms before finalizing the deal and be wary of last-minute additions.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Bogey',
                    icon: <CircleIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Pretending something is very important to you, but it is not.</strong></p>
                        <p>The bogey tactic involves pretending that a particular issue is extremely important to you, even though it is not. This allows you to use it as a bargaining chip, trading it away for something you actually value. For example, you might strongly insist on a specific clause in a contract, knowing that you are willing to drop it later in the negotiation. This creates the illusion of making a significant concession. To counter this, try to identify the other party's true priorities and avoid getting caught up in their feigned importance.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Chicken',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>A risky game where both sides threaten to do something harmful, and whoever backs down first loses.</strong></p>
                        <p>The chicken tactic involves a high-stakes confrontation where both parties threaten to take a course of action that would be detrimental to both of them. The party that backs down first "loses." This tactic is inherently risky and can lead to negative outcomes for both sides. An example is two companies threatening to sue each other, knowing it will be expensive for both. To defend against this, try to de-escalate the situation, find common ground, and seek mutually beneficial solutions.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Good Cop/Bad Cop',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>One person is nice, and the other is mean, to pressure you into agreeing.</strong></p>
                        <p>This tactic involves two negotiators playing contrasting roles. The "bad cop" is aggressive, confrontational, and intimidating, while the "good cop" is friendly, understanding, and supportive. The goal is to create a sense of pressure and relief, making the other party more likely to agree to the "good cop's" proposals. To counter this, recognize the tactic and avoid being swayed by the emotional manipulation.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Lowball/Highball',
                    icon: <ArrowUpDown size={16} />,
                    content: (
                      <>
                        <p><strong>Making an extremely low (or high) initial offer to anchor the negotiation.</strong></p>
                        <p>This tactic involves making an extremely low initial offer when buying or an extremely high initial offer when selling. This anchors the negotiation in a favourable position for the offering party. The other party then feels like any subsequent offer is a concession. To defend against this, recognize the tactic, research market values, and counter with a reasonable offer of your own.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Mother Hubbard',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p><strong>Claiming you have nothing more to give, even if you do.</strong></p>
                        <p>This tactic involves claiming you have no more room to make concessions, that you have given everything that you can. For example, saying "That is the absolute lowest price I can offer". This is used to stop the other party from asking for more. To defend against this, you must analyse if that statement is actually true, and if not, continue negotiating.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Now or Never',
                    icon: <ClockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Creating a sense of urgency to pressure someone into agreeing quickly.</strong></p>
                        <p>This tactic involves creating a sense of urgency by imposing a limited time offer or deadline. The goal is to pressure the other party into making a quick decision without thoroughly considering the implications. For example, "This offer is only valid for today." To counter this, resist the pressure, take your time, and seek independent advice.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Russian Front',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Making many demands at once, then slowly dropping them one by one.</strong></p>
                        <p>This tactic consists of making many demands at the beginning of the negotiation, and then slowly dropping those demands one at a time. This gives the other party the feeling that they are winning the negotiation, when in fact, the demands that are most important to the person using the tactic, are the last to be dropped. To counter this, analyse the demands, and determine which demands are the most important to the other party.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. The Salami',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p><strong>Taking small slices of what you want over time, instead of asking for it all at once.</strong></p>
                        <p>This tactic involves making a series of small, incremental demands over time, rather than asking for everything at once. The goal is to gradually wear down the other party's resistance. For example, asking for small concessions or changes to a contract over an extended period. To defend against this, recognize the pattern and address each demand individually.</p>
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

            {/* SECTION 4: Emotional Intelligence Elements */}
            <div
              ref={(el) => {
                sectionRefs.current['ei'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Emotional Intelligence Elements
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Emotional Intelligence?</strong> Emotional intelligence is like being smart about your feelings and other people's feelings. It is about understanding how emotions work and using that knowledge to handle situations well.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Self-Awareness',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Knowing your own feelings and how they affect you.</strong></p>
                        <p>Self-awareness is the ability to recognize and understand your own emotions, moods, and drives, as well as their effect on others. It involves being conscious of your strengths, weaknesses, values, and goals. People with high self-awareness are able to accurately assess their own emotional state and understand how their feelings influence their behaviour. For example, they might recognize when they are feeling stressed or angry and take steps to manage those emotions. This awareness allows them to make more informed decisions and communicate more effectively. In a negotiation, this means being aware of how your emotions might impact your bargaining position and making sure that you do not make decisions based on emotional responses. It is about knowing yourself.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Emotional Resilience',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Being able to bounce back from setbacks and handle stress.</strong></p>
                        <p>Emotional resilience is the ability to withstand and recover from stress, setbacks, and adversity. It involves being able to manage your emotions in challenging situations and maintain a positive outlook. People with high emotional resilience are able to cope with pressure, adapt to change, and persevere in the face of obstacles. For example, they might be able to remain calm and focused during a difficult negotiation or recover quickly from a failed project. This resilience allows them to maintain their effectiveness and achieve their goals, even in the face of adversity. In a negotiation, it is vital to keep a level head, even when things are not going well.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Motivation',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Being driven and enthusiastic about achieving goals.</strong></p>
                        <p>Motivation is the drive to achieve goals and pursue excellence. It involves having a passion for what you do and a strong desire to succeed. People with high motivation are proactive, persistent, and optimistic. They are driven by internal factors, such as a desire for achievement or a sense of purpose. For example, they might set ambitious goals for themselves and work hard to achieve them. This motivation allows them to overcome challenges and achieve their full potential. In a negotiation, this means having the drive to reach a mutually beneficial agreement.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Interpersonal Sensitivity',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Understanding and caring about other people's feelings.</strong></p>
                        <p>Interpersonal sensitivity is the ability to understand and empathize with the feelings and perspectives of others. It involves being aware of social cues and responding appropriately to the needs of others. People with high interpersonal sensitivity are able to build strong relationships, communicate effectively, and work collaboratively. For example, they might be able to recognize when someone is feeling upset and offer support. This sensitivity allows them to create a positive and supportive environment. In a negotiation, this is the ability to understand where the other side is coming from, and to react accordingly.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Influencing',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p><strong>Being able to persuade and inspire others.</strong></p>
                        <p>Influencing is the ability to persuade, inspire, and motivate others. It involves being able to communicate effectively, build rapport, and create a shared vision. People with high influencing skills are able to inspire others to take action and achieve common goals. For example, they might be able to persuade a team to support a new project or inspire others to embrace change. This influence allows them to lead effectively and achieve positive outcomes. In a negotiation, this is the ability to convince the other side that your solution is the best one.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Intuitiveness',
                    icon: <Hash size={16} />,
                    content: (
                      <>
                        <p><strong>Trusting your gut feelings and making quick decisions.</strong></p>
                        <p>Intuitiveness is the ability to make decisions based on gut feelings and implicit knowledge. It involves being able to recognize patterns, make connections, and understand complex situations without conscious analysis. People with high intuitiveness are able to make quick and accurate decisions in uncertain environments. For example, they might be able to sense when something is wrong or recognize a hidden opportunity. This intuition allows them to navigate complex situations and make effective decisions. In a negotiation, this could be sensing when the other side is not being truthful.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Integrity',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Being honest and having strong moral principles.</strong></p>
                        <p>Integrity is the adherence to moral and ethical principles. It involves being honest, trustworthy, and reliable. People with high integrity are able to build trust and maintain strong relationships. For example, they might be able to admit their mistakes and take responsibility for their actions. This integrity allows them to create a culture of trust and respect. In a negotiation, this is being honest and fair in your dealings with the other party.</p>
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

            {/* SECTION 5: Practicing Influencing in Negotiations */}
            <div
              ref={(el) => {
                sectionRefs.current['influencing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Practicing Influencing in Negotiations
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Influencing in Negotiations?</strong> Influencing in negotiations is about persuading the other party to see things your way and agree to your terms. It is about using various techniques to guide their decisions and actions.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Combining Yukl's and Cialdini's Theories:</strong> To be an effective influencer in negotiations, it is beneficial to draw from both Yukl's and Cialdini's theories. Yukl's focuses on specific tactics, while Cialdini's highlights psychological principles.
                  </p>
</div>

              {renderCard(
                'Yukl\'s Influence Tactics',
                <BookOpen size={16} />,
                <>
                  <p><strong>Rational Persuasion:</strong> Using facts and logic to convince someone.</p>
                  <p>This involves presenting logical arguments, factual evidence, and reasoned explanations to persuade the other party. In negotiations, this could involve presenting market data, financial projections, or expert opinions to support your position. For example, if you are negotiating the price of a product, you might present data showing that the price is fair based on market averages. This tactic is most effective when the other party is analytical and values logic.</p>
                  <p className="mt-2"><strong>Inspirational Appeals:</strong> Appealing to someone's values and emotions.</p>
                  <p>This involves appealing to the other party's values, ideals, and aspirations to inspire them to support your proposal. In negotiations, this could involve highlighting the shared benefits of an agreement or emphasizing the positive impact of a deal. For example, if you are negotiating a partnership, you might emphasize the shared vision and goals of both organizations. This tactic is most effective when the other party is motivated by emotions and values.</p>
                  <p className="mt-2"><strong>Consultation:</strong> Asking for someone's input and involving them in the decision-making process.</p>
                  <p>This involves seeking the other party's input and involving them in the decision-making process. In negotiations, this could involve asking for their suggestions, considering their concerns, and incorporating their ideas into the final agreement. For example, you might ask the other party for their feedback on a proposed contract or invite them to participate in a joint brainstorming session. This tactic builds trust and commitment.</p>
                  <p className="mt-2"><strong>Ingratiation:</strong> Being friendly and complimentary to create a positive impression.</p>
                  <p>This involves using flattery, praise, and friendly behaviour to create a positive impression and build rapport. In negotiations, this could involve complimenting the other party's expertise, expressing appreciation for their time, or finding common ground. For example, you might compliment the other party on their negotiation skills or express appreciation for their willingness to collaborate. This tactic can help to create a more favourable atmosphere.</p>
                </>
              )}

              {renderCard(
                'Cialdini\'s Principles of Influence',
                <Target size={16} />,
                <>
                  <p><strong>Reciprocity:</strong> People feel obligated to return favours.</p>
                  <p>In negotiations, offer concessions or favours to the other party, creating a sense of obligation to reciprocate. For example, offer a small concession early in the negotiation to encourage the other party to make a concession in return.</p>
                  <p className="mt-2"><strong>Scarcity:</strong> People want what is limited.</p>
                  <p>Highlight the limited availability of resources or opportunities to create a sense of urgency. For example, emphasize that a special offer is only available for a limited time or that a key resource is in high demand.</p>
                  <p className="mt-2"><strong>Authority:</strong> People trust experts and authority figures.</p>
                  <p>Establish your credibility and expertise by highlighting your qualifications, experience, or endorsements from reputable sources. For example, cite relevant research or expert opinions to support your claims.</p>
                  <p className="mt-2"><strong>Consistency:</strong> People want to be consistent with their past commitments.</p>
                  <p>Encourage the other party to make small commitments early in the negotiation, increasing the likelihood that they will follow through with larger commitments later on. For example, ask them to agree to a minor point before moving on to more significant issues.</p>
                  <p className="mt-2"><strong>Liking:</strong> People are more likely to be persuaded by those they like.</p>
                  <p>Build rapport by finding common ground, showing empathy, and being friendly and approachable. For example, engage in small talk to establish a personal connection.</p>
                  <p className="mt-2"><strong>Social Proof:</strong> People look to others for cues on how to behave.</p>
                  <p>Highlight the popularity or widespread acceptance of your proposal. For example, mention that many other companies have adopted a similar approach.</p>
                </>
              )}

              {renderCard(
                'Practicing Influencing',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Prepare:</strong> Before the negotiation, identify which tactics and principles are most likely to be effective with the other party.</li>
                    <li><strong>Adapt:</strong> Be flexible and adapt your approach based on the other party's responses.</li>
                    <li><strong>Practice:</strong> Practice using these techniques in low-stakes situations to build your confidence and skill.</li>
                    <li><strong>Ethical Consideration:</strong> Always use influence tactics ethically and responsibly. Avoid manipulation or deception.</li>
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
                  💡 Persuasion Insight
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
                  <span>Reynolds Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Negotiation Tactics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>EI Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Persuasion is built on credibility, understanding needs, logic &amp; emotion, effective framing, rapport, and reciprocity. Use negotiation tactics like Add-on, Bogey, Chicken, Good Cop/Bad Cop, Lowball/Highball, Mother Hubbard, Now or Never, Russian Front, and Salami wisely. Develop your emotional intelligence (self-awareness, resilience, motivation, sensitivity, influencing, intuitiveness, integrity) and practice influencing using Yukl's tactics and Cialdini's principles.
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
                <strong className="text-white">Reynolds Persuasion Model</strong> – Build credibility, understand needs, use logic &amp; emotion, frame effectively, build rapport, and apply reciprocity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Negotiation Tactics</strong> – Add-on, Bogey, Chicken, Good Cop/Bad Cop, Lowball/Highball, Mother Hubbard, Now or Never, Russian Front, and Salami. Use them strategically and ethically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Emotional Intelligence</strong> – Seven elements: self-awareness, resilience, motivation, interpersonal sensitivity, influencing, intuitiveness, and integrity. High EQ enhances negotiation outcomes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Influencing Strategies</strong> – Combine Yukl's tactics (rational persuasion, inspirational appeals, consultation, ingratiation) with Cialdini's principles (reciprocity, scarcity, authority, consistency, liking, social proof) for maximum impact.
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
            Sidemann Academic Registry • Persuasion &amp; Influence Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
