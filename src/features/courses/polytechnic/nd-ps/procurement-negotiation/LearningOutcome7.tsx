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
  Users,
  Target as TargetIcon,
  Anchor,
  AlertCircle,
  Activity,
  RefreshCw,
  Lightbulb,
  Brain,
  Play,
  Eye,
  Crown,
  Calendar,
  AlertTriangle,
  Swords,
  Globe,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'kolb', label: 'Learning Cycle' },
  { id: 'cultural', label: 'Cultural Dimensions' },
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
        text: 'Kolb’s Experiential Learning Cycle emphasizes that learning is a continuous process where experience, reflection, conceptualization, and experimentation feed into each other. It’s a powerful framework for skill development.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating a negotiation, always include post-negotiation monitoring. The effectiveness of a contract often reveals itself only after the deal is implemented.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember Hofstede\'s five dimensions with the acronym P-I-U-M-L: Power Distance, Individualism, Uncertainty Avoidance, Masculinity, Long-Term Orientation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t neglect cultural dimensions in international negotiations. A tactic that works in one culture may be offensive in another. Always research the cultural background of your counterpart.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Kolb’s Experiential Learning Cycle emphasizes that learning is a continuous process where experience, reflection, conceptualization, and experimentation feed into each other. It’s a powerful framework for skill development.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating a negotiation, always include post-negotiation monitoring. The effectiveness of a contract often reveals itself only after the deal is implemented.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember Hofstede\'s five dimensions with the acronym P-I-U-M-L: Power Distance, Individualism, Uncertainty Avoidance, Masculinity, Long-Term Orientation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t neglect cultural dimensions in international negotiations. A tactic that works in one culture may be offensive in another. Always research the cultural background of your counterpart.',
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
            Negotiation Evaluation, Learning &amp;{' '}
            <span className="text-indigo-300 font-bold italic">
              Cultural Dimensions
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to negotiation evaluation, Kolb's Experiential Learning Cycle, and Hofstede's Cultural Dimensions.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <RefreshCw size={14} className="inline mr-1" /> Evaluation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lightbulb size={14} className="inline mr-1" /> Learning Cycle
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Cultural Dimensions
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
                placeholder="Search for a method, learning stage, cultural dimension..."
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
                Introduction to Negotiation Evaluation &amp; Culture
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome covers the essential skills for evaluating your negotiation performance, using Kolb's Experiential Learning Cycle to continuously improve, and understanding how cultural dimensions (Hofstede) impact negotiations across borders.
                  </p>
</div>
            </div>

            {/* SECTION 2: Negotiation Evaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Negotiation Evaluation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Negotiation Evaluation?</strong> Negotiation evaluation is like reviewing a game after it is over. You look at what you did well, what you could have done better, and what you learned for next time. It helps you improve your negotiation skills.
                  </p>
</div>

              {[
                {
                  title: '1. Feedback from Peers/Key Stakeholders',
                  icon: <Users size={16} />,
                  content: (
                    <>
                      <p><strong>Asking your team and other important people what they thought of your negotiation.</strong></p>
                      <p><strong>Detailed Explanation:</strong> Gathering feedback from peers and key stakeholders provides valuable insights into your negotiation performance. Peers can offer perspectives on your tactics, communication style, and overall effectiveness. Key stakeholders, such as managers, clients, or partners, can provide feedback on how well the negotiation aligned with their interests and expectations.</p>
                      <p><strong>How to Gather Feedback:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Structured Interviews:</strong> Conduct interviews with specific questions about your negotiation performance.</li>
                        <li><strong>Surveys:</strong> Use surveys to gather feedback from a larger group of stakeholders.</li>
                        <li><strong>Debriefing Sessions:</strong> Hold debriefing sessions with your team to discuss the negotiation and identify areas for improvement.</li>
                        <li><strong>Focus on Specific Behaviours:</strong> Ask for feedback on specific behaviours, such as active listening, assertiveness, and problem-solving.</li>
                      </ul>
                      <p>This feedback can reveal blind spots and provide valuable suggestions for improvement.</p>
                    </>
                  ),
                },
                {
                  title: '2. Outcomes Versus Goals',
                  icon: <TargetIcon size={16} />,
                  content: (
                    <>
                      <p><strong>Comparing what you actually got to what you wanted to get.</strong></p>
                      <p><strong>Detailed Explanation:</strong> This involves comparing the actual outcomes of the negotiation to the goals and targets you set beforehand. Did you achieve your ideal target, optimal target, or fallback position? Did you meet your key objectives?</p>
                      <p><strong>How to Analyse:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Quantitative Measures:</strong> Compare quantifiable outcomes, such as price, terms, and deadlines, to your pre-negotiation targets.</li>
                        <li><strong>Qualitative Measures:</strong> Assess qualitative outcomes, such as relationship building, trust, and satisfaction.</li>
                        <li><strong>Identify Deviations:</strong> Identify any significant deviations between the actual outcomes and your goals.</li>
                        <li><strong>Analyse Reasons for Deviations:</strong> Determine the reasons for these deviations, such as unexpected developments, miscalculations, or ineffective tactics.</li>
                      </ul>
                      <p>This analysis helps you assess the effectiveness of your negotiation strategy and identify areas for improvement.</p>
                    </>
                  ),
                },
                {
                  title: '3. Use of BATNA',
                  icon: <Anchor size={16} />,
                  content: (
                    <>
                      <p><strong>Checking if you used your "Plan B" effectively.</strong></p>
                      <p><strong>Detailed Explanation:</strong> Evaluate how effectively you used your Best Alternative to a Negotiated Agreement (BATNA) during the negotiation. Did you accurately assess your BATNA? Did you use it to set realistic goals and targets? Did you leverage your BATNA to gain leverage and influence the outcome?</p>
                      <p><strong>How to Analyse:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>BATNA Assessment:</strong> Review your pre-negotiation assessment of your BATNA and compare it to the actual alternatives available.</li>
                        <li><strong>BATNA Utilization:</strong> Evaluate how you used your BATNA during the negotiation, such as when to disclose it or when to walk away.</li>
                        <li><strong>BATNA Improvement:</strong> Assess whether you took steps to improve your BATNA before or during the negotiation.</li>
                        <li><strong>Counterparty BATNA:</strong> Consider how well you understood and addressed the other party's BATNA.</li>
                      </ul>
                      <p>This evaluation helps you refine your BATNA analysis and utilization skills for future negotiations.</p>
                    </>
                  ),
                },
                {
                  title: '4. Critical Incident Analysis',
                  icon: <AlertCircle size={16} />,
                  content: (
                    <>
                      <p><strong>Looking at the most important moments of the negotiation and figuring out what happened and why.</strong></p>
                      <p><strong>Detailed Explanation:</strong> This involves analysing specific critical incidents or turning points during the negotiation. These are moments that had a significant impact on the outcome.</p>
                      <p><strong>How to Analyse:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Identify Critical Incidents:</strong> Identify key moments, such as crucial offers, unexpected developments, or emotional reactions.</li>
                        <li><strong>Describe the Situation:</strong> Describe the situation, including what happened, who was involved, and what was said.</li>
                        <li><strong>Analyse Your Actions:</strong> Analyse your actions and decisions during the incident, including your thoughts, feelings, and behaviours.</li>
                        <li><strong>Evaluate the Impact:</strong> Evaluate the impact of your actions on the outcome of the negotiation.</li>
                        <li><strong>Identify Lessons Learned:</strong> Identify lessons learned from the incident and develop strategies for future negotiations.</li>
                      </ul>
                      <p>This analysis helps you understand the dynamics of the negotiation and identify areas for improvement.</p>
                    </>
                  ),
                },
                {
                  title: '5. Monitoring Post-Negotiation Behaviour/Effectiveness of Contract in Practice',
                  icon: <Activity size={16} />,
                  content: (
                    <>
                      <p><strong>Checking if the agreement is working well after the negotiation is over.</strong></p>
                      <p><strong>Detailed Explanation:</strong> This involves monitoring the behaviour of both parties after the negotiation to ensure that they are fulfilling their obligations and that the agreement is working as intended. This is especially important for long-term agreements or contracts.</p>
                      <p><strong>How to Monitor:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Track Performance:</strong> Track key performance indicators (KPIs) and milestones to ensure that both parties are meeting their commitments.</li>
                        <li><strong>Maintain Communication:</strong> Maintain regular communication with the other party to address any issues or concerns.</li>
                        <li><strong>Review Contracts:</strong> Periodically review contracts and agreements to ensure that they are still relevant and effective.</li>
                        <li><strong>Seek Feedback:</strong> Seek feedback from stakeholders on the effectiveness of the agreement.</li>
                        <li><strong>Adapt and Adjust:</strong> Be prepared to adapt and adjust the agreement as needed to address changing circumstances.</li>
                      </ul>
                      <p>This monitoring helps to ensure that the negotiation leads to a successful and lasting outcome.</p>
                    </>
                  ),
                },
              ].map((item) => renderCard(item.title, item.icon, item.content))}
            </div>

            {/* SECTION 3: Kolb's Experiential Learning Cycle */}
            <div
              ref={(el) => {
                sectionRefs.current['kolb'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implementing Kolb's Experiential Learning Cycle
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What is Kolb's Experiential Learning Cycle?</strong> Kolb's cycle is a way to learn by doing, reflecting on what you did, understanding why it happened, and then trying it again with improvements. It is like a loop that helps you turn experiences into knowledge.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. ACT: Concrete Experience',
                    icon: <Play size={16} />,
                    content: (
                      <>
                        <p><strong>Doing something new or having a specific experience.</strong></p>
                        <p><strong>Detailed Explanation:</strong> This is the starting point of the learning cycle. It involves actively engaging in a new experience or situation. This could be anything from participating in a negotiation, trying a new problem-solving technique, or working on a project. The key is to be fully present and involved in the experience. For example, if you are learning to negotiate, you might participate in a mock negotiation scenario. This stage is about immersing yourself in the experience and gathering raw data through your senses and actions. It is about being in the moment, and fully experiencing what is happening. This is the base of the learning experience, without this experience, there is nothing to reflect on.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. ANALYSE: Reflective Observation',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Thinking about what happened and what you observed.</strong></p>
                        <p><strong>Detailed Explanation:</strong> After the concrete experience, the next step is to reflect on what happened. This involves carefully observing and analysing the experience from different perspectives. You might ask yourself questions like: What did I notice? What were my feelings and reactions? What were the key events and interactions? It is vital to objectively examine the experience, considering both the positive and negative aspects. For example, after the mock negotiation, you might reflect on your communication style, your negotiation tactics, and the other party's reactions. This stage is about stepping back from the experience and examining it critically. You might write down your observations, discuss them with others, or simply take time to think about them. It is important to be honest with yourself during this stage, to ensure that you get the most out of the learning experience.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. ABSTRACT: Conceptualization/Generalization',
                    icon: <Lightbulb size={16} />,
                    content: (
                      <>
                        <p><strong>Drawing conclusions and creating general principles from your observations.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Based on your reflective observations, you then move to the conceptualization stage. This involves making sense of your observations and drawing conclusions or creating general principles. You might identify patterns, develop theories, or create models to explain what happened. For example, you might realize that using a specific negotiation tactic led to a positive outcome, and you might develop a principle about the effectiveness of that tactic. This stage is about transforming your observations into abstract concepts that can be applied to other situations. You might read relevant theories, research best practices, or consult with experts to deepen your understanding. This stage is where you take the raw information and turn it into usable knowledge.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. ADJUST: Active Experimentation',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p><strong>Trying out your new understanding in a new situation.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The final stage of the cycle is active experimentation. This involves applying your new understanding and principles to a new situation or experience. You might test your theories, try out new strategies, or implement changes based on your learning. For example, you might use your new negotiation principles in a real-world negotiation. This stage is about putting your learning into practice and seeing if it works. You might make adjustments along the way, based on your new experiences. This is where you test your hypothesis, and then the cycle begins again. You take what you learned, and put it into practice, and then reflect on that experience.</p>
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

            {/* SECTION 4: Hofstede's Cultural Dimensions */}
            <div
              ref={(el) => {
                sectionRefs.current['cultural'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Understanding Cultural Dimensions (Hofstede's Model)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>What are Cultural Dimensions?</strong> Cultural dimensions are like different ways of thinking and behaving that are common in certain groups of people. They help us understand why people from different countries or backgrounds might act differently in certain situations.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Hofstede's Model:</strong> Geert Hofstede's cultural dimensions theory describes the effects of a society's culture on the values of its members, and how these values relate to behaviour.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Power Distance Index (PDI)',
                    icon: <Crown size={16} />,
                    content: (
                      <>
                        <p><strong>How much people accept that some people have more power than others.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The Power Distance Index (PDI) measures the extent to which less powerful members of institutions and organizations within a country expect and accept that power is distributed unequally. In high PDI cultures, there is a hierarchical structure where people accept their place, and authority is respected. In low PDI cultures, there is a flatter structure, and people feel more comfortable questioning authority. For example, in a high PDI culture, employees might be hesitant to challenge their boss's decisions, while in a low PDI culture, they might feel comfortable expressing their opinions. This dimension is important because it influences how people communicate, make decisions, and interact with authority figures. Knowing a cultures PDI allows one to know how to properly address people, and how much respect is expected.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Individualism (IDV)',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Whether people focus on themselves and their immediate family, or on the group they belong to.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Individualism (IDV) measures the degree to which individuals are integrated into groups. In individualistic cultures, people prioritize personal goals, independence, and self-reliance. In collectivistic cultures, people prioritize group goals, interdependence, and loyalty. For example, in an individualistic culture, people might value personal achievements and promotions, while in a collectivistic culture, they might value team harmony and group success. This dimension impacts how people work, communicate, and build relationships. In individualistic cultures, direct communication is valued, and personal responsibility is emphasized. In collectivistic cultures, indirect communication is preferred, and group harmony is prioritized.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Uncertainty Avoidance Index (UAI)',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>How comfortable people are with uncertainty and change.</strong></p>
                        <p><strong>Detailed Explanation:</strong> The Uncertainty Avoidance Index (UAI) measures the extent to which the members of a society feel threatened by ambiguous or unknown situations and have created beliefs and institutions that try to avoid these. In high UAI cultures, people prefer clear rules, structured environments, and stability. In low UAI cultures, people are more comfortable with ambiguity, risk, and change. For example, in a high UAI culture, people might prefer detailed contracts and strict procedures, while in a low UAI culture, they might be more flexible and adaptable. This dimension affects how people plan, make decisions, and respond to change.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Masculinity (MAS)',
                    icon: <Swords size={16} />,
                    content: (
                      <>
                        <p><strong>Whether a society values assertiveness, competition, and achievement, or caring, cooperation, and quality of life.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Masculinity (MAS) measures the distribution of emotional roles between genders. In masculine cultures, people value assertiveness, competition, achievement, and material success. In feminine cultures, people value caring, cooperation, quality of life, and relationships. For example, in a masculine culture, people might prioritize career advancement and material rewards, while in a feminine culture, they might prioritize work-life balance and social harmony. This dimension influences how people work, communicate, and define success.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Long-Term Orientation (LTO)',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p><strong>Whether people focus on the future and long-term rewards, or on the present and past.</strong></p>
                        <p><strong>Detailed Explanation:</strong> Long-Term Orientation (LTO) measures the extent to which a society exhibits a pragmatic future-oriented perspective rather than a conventional historical or short-term point of view. In long-term oriented cultures, people value perseverance, thrift, and a sense of shame. In short-term oriented cultures, people value tradition, fulfilling social obligations, and saving face. For example, in a long-term oriented culture, people might prioritize long-term investments and education, while in a short-term oriented culture, they might prioritize immediate gratification and social status. This dimension affects how people plan, make decisions, and view time.</p>
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
                  💡 Learning Insight
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
                  <span>Evaluation Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Learning Cycle Stages</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Cultural Dimensions</span>
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
                Evaluate negotiations through peer feedback, outcomes vs goals, BATNA analysis, critical incidents, and post-negotiation monitoring. Use Kolb's cycle (ACT → ANALYSE → ABSTRACT → ADJUST) to turn experience into lasting skill improvement. Understand Hofstede's cultural dimensions (Power Distance, Individualism, Uncertainty Avoidance, Masculinity, Long-Term Orientation) to navigate cross-cultural negotiations effectively.
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
                <strong className="text-white">Negotiation Evaluation</strong> – Five methods: Peer Feedback, Outcomes vs Goals, BATNA Analysis, Critical Incident Analysis, and Post-Negotiation Monitoring. Use these to continuously improve your negotiation skills.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Kolb's Experiential Learning Cycle</strong> – ACT (Concrete Experience) → ANALYSE (Reflective Observation) → ABSTRACT (Conceptualization) → ADJUST (Active Experimentation). This iterative process transforms experience into knowledge.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hofstede's Cultural Dimensions</strong> – Five dimensions: Power Distance, Individualism, Uncertainty Avoidance, Masculinity, and Long-Term Orientation. Understanding these helps navigate cross-cultural negotiations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Continuous Improvement</strong> – Evaluation, learning, and cultural awareness are interconnected. Regularly assess your performance, learn from experiences, and adapt to cultural contexts to become a more effective negotiator.
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
            Sidemann Academic Registry • Evaluation &amp; Culture Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;
