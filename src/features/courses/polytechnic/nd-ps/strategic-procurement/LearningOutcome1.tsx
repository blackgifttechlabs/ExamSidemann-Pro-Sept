import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Link as LinkIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  ClockIcon,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  Database,
  SearchIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'meaning', label: 'Meaning' },
  { id: 'types', label: 'Types of Risks' },
  { id: 'analytical', label: 'Analytical Elements' },
  { id: 'ranking', label: 'Risk Ranking' },
  { id: 'mitigation', label: 'Mitigation Plan' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'Risk management is not just about avoiding problems; it’s also about identifying opportunities. A well-managed risk can turn into a competitive advantage.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a comprehensive risk identification process. The more risks you identify early, the better prepared you will be.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five types of risks with the acronym "F-O-L-R-E-S": Financial, Operational, Legal, Reputational, Environmental, Strategic.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations skip the periodic review of their risk rankings. Risks change over time, so your priorities should too.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Risk management is not just about avoiding problems; it’s also about identifying opportunities. A well-managed risk can turn into a competitive advantage.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a comprehensive risk identification process. The more risks you identify early, the better prepared you will be.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five types of risks with the acronym "F-O-L-R-E-S": Financial, Operational, Legal, Reputational, Environmental, Strategic.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations skip the periodic review of their risk rankings. Risks change over time, so your priorities should too.',
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

  // ─── Content sections data ──────────────────────────────────────────────
  const sections = [
    {
      id: 'meaning',
      title: '1. Meaning of Risk Management: Proactive Planning for Uncertainty',
      content: (
        <>
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong>Thinking about things that could go wrong and making plans to stop them or deal with them if they happen.</strong>
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                Risk management is essentially about being prepared. It's the process of identifying potential problems, assessing how likely they are to occur, and figuring out what steps to take to minimize their impact.
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                This isn't just about avoiding bad things; it's also about taking advantage of opportunities. In any project or business, there are always uncertainties. Risk management helps us understand these uncertainties and make informed decisions. For example, if you're building a new warehouse, you might identify risks like delays in getting materials, unexpected weather conditions, or changes in building regulations. By thinking about these risks beforehand, you can create contingency plans, like having backup suppliers or adjusting your construction schedule. Risk management is not about predicting the future; it is about being prepared for a range of possible outcomes. It is about being proactive rather than reactive, so you can handle problems calmly and efficiently when they arise.
              </p>
</div>
        </>
      ),
    },
    {
      id: 'types',
      title: '2. Different Types of Risks: Categorizing Potential Problems',
      content: (
        <>
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Breaking down the different kinds of bad things that could happen. Risks are not all the same. They can come from different sources and affect different parts of a project or business.
              </p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: 'Financial Risks',
                icon: <Hash size={16} />,
                content: 'These involve money, like losing investments, going over budget, or facing unexpected expenses. For example, a sudden drop in sales or a rise in interest rates can pose financial risks.',
              },
              {
                title: 'Operational Risks',
                icon: <HardDriveIcon size={16} />,
                content: 'These risks affect the day-to-day operations of a business, such as equipment failures, supply chain disruptions, or employee errors. For example, if a key piece of machinery breaks down, it can halt production.',
              },
              {
                title: 'Legal Risks',
                icon: <BookOpen size={16} />,
                content: 'These involve breaking laws or facing lawsuits, such as violating environmental regulations or breaching contracts. For example, failing to comply with safety regulations can lead to legal penalties.',
              },
              {
                title: 'Reputational Risks',
                icon: <GlobeIcon size={16} />,
                content: 'These risks affect the public image of a business, such as negative media coverage or customer complaints. For example, a product recall or a data breach can damage a company\'s reputation.',
              },
              {
                title: 'Environmental Risks',
                icon: <LayersIcon size={16} />,
                content: 'These risks involve damage to the environment. Such as spills, or the releasing of gasses that are bad for the ozone layer.',
              },
              {
                title: 'Strategic Risks',
                icon: <Target size={16} />,
                content: 'These risks involve bad decisions that affect the long-term goals of a company. Such as, choosing to enter a new market, at the wrong time.',
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
        </>
      ),
    },
    {
      id: 'analytical',
      title: '3. Analytical Elements',
      content: (
        <>
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong>What are Analytical Elements?</strong>
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                Imagine you are trying to figure out why your plant is not growing. Instead of just saying "it's not growing," you would look at the different parts that could be causing the problem: the soil, the water, the sunlight, the temperature. These parts are the "analytical elements." They are the things you break down and study to understand the bigger problem. So, analytical elements are the smaller pieces of a bigger problem or situation that you look at closely to figure things out.
              </p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: '1. Identifying Key Variables in a Problem',
                icon: <SearchIcon size={16} />,
                content: (
                  <>
                    <p><strong>Figuring out the most important things that affect a problem, like the main ingredients in a recipe.</strong></p>
                    <p>When faced with a complex problem, it is easy to get overwhelmed by all the information. Analytical elements help us to focus on the most important aspects. Identifying key variables means pinpointing the factors that have the biggest impact on the problem. For example, if you are trying to understand why your company's sales are declining, the key variables might be: the price of your product, the quality of your customer service, the effectiveness of your marketing, and the actions of your competitors. You would not waste time focusing on things that have little to no impact, like the colour of the office walls. By identifying these key variables, you can then analyse each one individually, gathering data and information to understand how they contribute to the overall problem. This allows you to prioritize your efforts and develop targeted solutions. It is like a doctor figuring out what vital signs to check when a patient is sick, rather than checking every single part of the body.</p>
                  </>
                ),
              },
              {
                title: '2. Breaking Down Data into Meaningful Components',
                icon: <Database size={16} />,
                content: (
                  <>
                    <p><strong>Taking a big pile of numbers or information and sorting it into smaller, easier-to-understand pieces.</strong></p>
                    <p>In many situations, you will have a large amount of data to analyse. Analytical elements help you to break down this data into smaller, more manageable components. For example, if you are analysing customer feedback, you might break it down into categories like product quality, delivery time, customer support, and pricing. This allows you to see patterns and trends that would be difficult to spot in the raw data. By breaking down the data into meaningful components, you can identify areas where you are doing well and areas where you need to improve. This allows you to make data-driven decisions and improve your overall performance. It is like taking a big puzzle and sorting the pieces by colour or shape before you start putting it together.</p>
                  </>
                ),
              },
              {
                title: '3. Analysing Relationships Between Different Factors',
                icon: <LinkIcon size={16} />,
                content: (
                  <>
                    <p><strong>Seeing how different things are connected to each other and how they affect each other.</strong></p>
                    <p>Analytical elements also involve understanding the relationships between different factors. This means looking at how changes in one factor can affect other factors. For example, if you are analysing the impact of a new marketing campaign, you might look at how it affects sales, customer satisfaction, and brand awareness. By understanding these relationships, you can identify cause-and-effect patterns and make predictions about future outcomes. This allows you to make informed decisions about your strategies and investments. It is like understanding how different parts of a machine work together to make it function properly.</p>
                  </>
                ),
              },
              {
                title: '4. Identifying Patterns and Trends Over Time',
                icon: <ClockIcon size={16} />,
                content: (
                  <>
                    <p><strong>Looking at how things change over time and finding regular things that happen.</strong></p>
                    <p>Analytical elements help us to identify patterns and trends over time. This means looking at how data changes over a period and identifying any recurring patterns or trends. For example, if you are analysing sales data, you might look for seasonal trends, such as increased sales during the holiday season. By identifying these patterns and trends, you can make predictions about future performance and adjust your strategies accordingly. This allows you to anticipate changes in the market and stay ahead of the competition. It is like a meteorologist studying weather patterns to predict future weather conditions.</p>
                  </>
                ),
              },
              {
                title: '5. Evaluating the Impact of External Factors',
                icon: <GlobeIcon size={16} />,
                content: (
                  <>
                    <p><strong>Looking at how things outside the company or situation can affect what is happening inside.</strong></p>
                    <p>Analytical elements also involve considering the impact of external factors. This means looking at how changes in the economy, technology, or regulations can affect your business or project. For example, if you are analysing the impact of a new government policy, you might look at how it affects your costs, your customers, and your competitors. By evaluating these external factors, you can identify potential risks and opportunities and develop strategies to mitigate the risks and capitalize on the opportunities. It is like a sailor checking the weather forecast and sea conditions before setting sail.</p>
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
        </>
      ),
    },
    {
      id: 'ranking',
      title: '4. Risk Ranking According to Set Criteria',
      content: (
        <>
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong>What is Risk Ranking?</strong>
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                Imagine you have a list of things that could go wrong. Instead of worrying about everything at once, you want to figure out which problems are the most important. Risk ranking is like sorting those problems from the most dangerous to the least dangerous. You use specific rules (criteria) to decide which problems are the biggest threats. This helps you focus on the most important things first.
              </p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: '1. Defining Clear and Measurable Criteria',
                icon: <ListChecks size={16} />,
                content: (
                  <>
                    <p><strong>Making a list of rules that everyone agrees on to decide how dangerous a problem is.</strong></p>
                    <p>The first and most crucial step in risk ranking is to establish clear and measurable criteria. These criteria act as the yardstick by which each risk is evaluated. Without them, the ranking process would be subjective and inconsistent. For example, criteria might include: "Likelihood of occurrence" (how often this problem happens), "Severity of impact" (how bad it is when it happens), "Financial loss" (how much money it costs), and "Reputational damage" (how much it hurts the company's image). Each criterion should be clearly defined and, if possible, assigned numerical values or categories (e.g., low, medium, high). This ensures that everyone involved in the ranking process understands the criteria in the same way. By establishing these criteria, you remove the guesswork and personal opinions from the ranking process, making it more objective and reliable. This allows for clear, repeatable results.</p>
                  </>
                ),
              },
              {
                title: '2. Assessing the Likelihood of Occurrence',
                icon: <Target size={16} />,
                content: (
                  <>
                    <p><strong>Figuring out how often a problem is likely to happen.</strong></p>
                    <p>Once the criteria are defined, the next step is to assess the likelihood of each risk occurring. This involves evaluating the probability or frequency of the risk event. For example, a risk like "a power outage" might be considered highly likely in an area prone to storms, while a risk like "a major earthquake" might be considered less likely in a stable region. Historical data, expert opinions, and statistical analysis can be used to estimate the likelihood of occurrence. It is important to consider both internal factors (e.g., equipment failures, human errors) and external factors (e.g., market fluctuations, regulatory changes). By accurately assessing the likelihood of occurrence, you can prioritize risks that are more likely to materialize, allowing you to take pre-emptive measures.</p>
                  </>
                ),
              },
              {
                title: '3. Evaluating the Severity of Impact',
                icon: <Edit size={16} />,
                content: (
                  <>
                    <p><strong>Figuring out how bad it would be if a problem happened.</strong></p>
                    <p>In addition to likelihood, it is essential to evaluate the potential impact or consequences of each risk. This involves assessing the severity of the damage that could occur if the risk event materializes. For example, a risk like "a data breach" could have a severe impact on a company's reputation and financial stability, even if the likelihood of it occurring is relatively low. On the other hand, a risk like "a minor delay in delivery" might have a low impact, even if it occurs frequently. The severity of impact can be assessed in terms of financial losses, operational disruptions, legal liabilities, and reputational damage. By evaluating the severity of impact, you can prioritize risks that could have the most significant consequences, even if they are less likely to occur.</p>
                  </>
                ),
              },
              {
                title: '4. Combining Likelihood and Impact for Overall Risk Score',
                icon: <Hash size={16} />,
                content: (
                  <>
                    <p><strong>Putting together how likely a problem is and how bad it would be to get an overall danger score.</strong></p>
                    <p>After assessing the likelihood and impact of each risk, these two factors are combined to calculate an overall risk score or rating. This is often done using a risk matrix, where likelihood and impact are plotted against each other to determine the level of risk (e.g., low, medium, high). For example, a risk with a high likelihood and a high impact would receive a high risk score, while a risk with a low likelihood and a low impact would receive a low risk score. The method of combining likelihood and impact should be clearly defined and consistently applied. This overall risk score allows for a clear and concise prioritization of risks, enabling you to focus your resources on the most critical areas.</p>
                  </>
                ),
              },
              {
                title: '5. Periodic Review and Updating of Risk Rankings',
                icon: <ClockIcon size={16} />,
                content: (
                  <>
                    <p><strong>Checking the danger list regularly and changing it if things have changed.</strong></p>
                    <p>Risk rankings are not static; they need to be reviewed and updated periodically to reflect changes in the internal and external environment. New risks may emerge, existing risks may change in likelihood or impact, and the effectiveness of risk mitigation measures may need to be reassessed. This periodic review ensures that the risk rankings remain relevant and accurate. It also allows you to identify emerging trends and anticipate potential problems. For example, changes in technology, market conditions, or regulatory requirements can introduce new risks or alter the severity of existing risks. By regularly reviewing and updating the risk rankings, you can maintain a proactive approach to risk management and ensure that your organization is prepared to handle any challenges that may arise.</p>
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
        </>
      ),
    },
    {
      id: 'mitigation',
      title: '5. Drawing a Risk Mitigation Plan',
      content: (
        <>
          <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <strong>What is Drawing a Risk Mitigation Plan?</strong>
              </p>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                Imagine you are planning a picnic. You know it might rain, so you think about what you will do if it does (bring umbrellas, find a covered area). Drawing a risk mitigation plan is like making a map of all the bad things that could happen and writing down what you will do to stop them or handle them if they do happen. It is a way to be prepared.
              </p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[
              {
                title: '1. Identifying and Listing Potential Risks',
                icon: <ListChecks size={16} />,
                content: (
                  <>
                    <p><strong>Making a list of all the things that could go wrong in your project or plan.</strong></p>
                    <p>The first step in creating a risk mitigation plan is to identify all potential risks. This involves brainstorming and thinking about every possible thing that could go wrong. For example, if you are building a website, risks might include technical glitches, budget overruns, delays in getting content, or even a competitor launching a similar product. You want to be thorough and consider both obvious and less obvious risks. This list should be as comprehensive as possible, covering all aspects of your project or plan. It is like making a checklist of everything you need to watch out for. This list is the foundation of your plan, so it is important to take your time and think carefully about all the possibilities.</p>
                  </>
                ),
              },
              {
                title: '2. Assessing the Severity and Likelihood of Each Risk',
                icon: <Target size={16} />,
                content: (
                  <>
                    <p><strong>Deciding how bad each problem would be and how likely it is to happen.</strong></p>
                    <p>Once you have a list of risks, you need to assess how serious each one is and how likely it is to occur. This helps you prioritize which risks you should focus on. For example, a minor delay might be likely but not very serious, while a major data breach might be less likely but very serious. You can use a scale to rate the severity and likelihood of each risk (e.g., low, medium, high). This assessment helps you understand which risks pose the greatest threat to your project or plan. It is like deciding which problems need your immediate attention and which ones can wait. This allows you to allocate your resources effectively and focus on the most critical risks.</p>
                  </>
                ),
              },
              {
                title: '3. Developing Mitigation Strategies for High-Priority Risks',
                icon: <Edit size={16} />,
                content: (
                  <>
                    <p><strong>Writing down what you will do to stop the worst problems from happening or to handle them if they do.</strong></p>
                    <p>For the high-priority risks (those that are both likely and serious), you need to develop specific mitigation strategies. These are actions you will take to reduce the likelihood or impact of the risk. For example, if you are worried about technical glitches on your website, you might implement a rigorous testing process or have a backup server. These strategies should be specific, measurable, achievable, relevant, and time-bound (SMART). This means that each strategy should clearly state what will be done, how it will be measured, who will be responsible, and when it will be completed. It is like creating a step-by-step plan for dealing with each major problem.</p>
                  </>
                ),
              },
              {
                title: '4. Assigning Responsibilities and Timelines',
                icon: <SettingsIcon size={16} />,
                content: (
                  <>
                    <p><strong>Deciding who will do what and when they will do it.</strong></p>
                    <p>For each mitigation strategy, you need to assign responsibilities and timelines. This means clearly stating who will be responsible for implementing the strategy and when they need to complete it. This ensures that everyone knows their roles and responsibilities and that the mitigation plan is implemented effectively. For example, you might assign the IT team to implement the backup server and set a deadline for them to complete it. This helps to avoid confusion and ensures that the mitigation plan is implemented in a timely manner. It is like assigning tasks to different people on a team to make sure everything gets done.</p>
                  </>
                ),
              },
              {
                title: '5. Monitoring and Reviewing the Plan',
                icon: <ClockIcon size={16} />,
                content: (
                  <>
                    <p><strong>Checking regularly to see if the plan is working and making changes if needed.</strong></p>
                    <p>A risk mitigation plan is not a one-time thing. It needs to be monitored and reviewed regularly to ensure that it is still effective. This means tracking the progress of the mitigation strategies, identifying any new risks that may have emerged, and adjusting the plan as needed. For example, if you find that a mitigation strategy is not working, you might need to develop a new strategy or allocate more resources. This ongoing monitoring and review help to ensure that your project or plan stays on track and that you are prepared to handle any challenges that may arise. It is like checking the weather forecast regularly to see if you need to adjust your picnic plans.</p>
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
        </>
      ),
    },
  ];

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Risk Management &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Analytical Thinking
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to risk management, types of risks, analytical elements, risk ranking, and mitigation planning.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Risk Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Analytical Elements
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ListChecks size={14} className="inline mr-1" /> Risk Ranking
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <SettingsIcon size={14} className="inline mr-1" /> Mitigation
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
                placeholder="Search for a concept, risk type, mitigation step..."
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
            {sections.map((section, idx) => (
              <div
                key={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                  {section.title}
                </h2>
                {section.content}
              </div>
            ))}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Risk Insight
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
                  <span>Types of Risks</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Analytical Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Risk Ranking Steps</span>
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
                Risk management is about proactive planning for uncertainty. Identify risks across financial, operational, legal, reputational, environmental, and strategic categories. Use analytical elements to break down problems, identify variables, analyse relationships, and spot trends. Rank risks by likelihood and impact to prioritise. Develop a mitigation plan with specific strategies, responsibilities, timelines, and regular reviews.
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
                <strong className="text-white">Risk Management</strong> – Proactive planning to identify, assess, and mitigate potential problems, turning uncertainties into manageable challenges.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types of Risks</strong> – Six categories: Financial, Operational, Legal, Reputational, Environmental, and Strategic. Each requires specific attention and mitigation strategies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Analytical Elements</strong> – Five key aspects: identifying key variables, breaking down data, analysing relationships, spotting patterns, and evaluating external factors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk Ranking &amp; Mitigation</strong> – Use clear criteria to assess likelihood and impact, combine them for an overall risk score, and develop a mitigation plan with specific actions, responsibilities, timelines, and regular reviews.
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
            Sidemann Academic Registry • Risk Management &amp; Analytical Thinking Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
