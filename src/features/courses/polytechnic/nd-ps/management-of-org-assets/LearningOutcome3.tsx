import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  LayersIcon,
  FileText,
  Users,
  ClipboardCheck,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Gavel,
  UserCheck,
  ClipboardList,
  Clock,
  Filter,
  Brain,
  PenTool,
  Workflow,
  UserCog,
  UserPlus,
  FileUser,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  LayoutIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'planning', label: 'HR Planning' },
  { id: 'administration', label: 'HR Administration' },
  { id: 'job-descriptions', label: 'Job Descriptions' },
  { id: 'advertising', label: 'Adverts' },
  { id: 'recruitment', label: 'Recruitment & Selection' },
  { id: 'sifting', label: 'Sifting Applications' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'contracts', label: 'Employment Contracts' },
  { id: 'grades', label: 'Employee Grades' },
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
        text: 'Effective HR planning can reduce recruitment costs by up to 40% by anticipating workforce needs and developing internal talent pipelines.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating job descriptions, always conduct a thorough job analysis first. Understanding the job\'s true requirements prevents mismatched hires and reduces turnover.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the HRP cycle: Analyse current supply, Forecast future demand, Identify gaps, Plan strategies, Monitor and evaluate. "A FIPM" helps recall the full cycle.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rush the selection process. Structured interviews and thorough reference checks are essential. A bad hire can cost up to 30% of the employee\'s annual salary.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Effective HR planning can reduce recruitment costs by up to 40% by anticipating workforce needs and developing internal talent pipelines.',
      },
      {
        title: 'Pro Tip',
        text: 'When creating job descriptions, always conduct a thorough job analysis first. Understanding the job\'s true requirements prevents mismatched hires and reduces turnover.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the HRP cycle: Analyse current supply, Forecast future demand, Identify gaps, Plan strategies, Monitor and evaluate. "A FIPM" helps recall the full cycle.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rush the selection process. Structured interviews and thorough reference checks are essential. A bad hire can cost up to 30% of the employee\'s annual salary.',
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

  // Helper to render a clean card
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
            <FolderTree size={14} className="inline mr-1" /> HUMAN RESOURCE MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            HR Planning &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Recruitment
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to human resource planning, recruitment and selection, job descriptions, employment contracts, and employee grades.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> HR Planning
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileUser size={14} className="inline mr-1" /> Recruitment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Contracts
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
                placeholder="Search for a concept, process, contract term..."
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
            {/* SECTION 1: Figuring Out How Many People a Company Needs */}
            <div
              ref={(el) => {
                sectionRefs.current['planning'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Figuring Out How Many People a Company Needs (HR Planning)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are planning a big project, like building a treehouse or putting on a school play. You need to know how many people will help, and what skills they should have. Companies do the same thing when they figure out their "human resources requirements." It is about looking ahead and deciding how many workers they will need, and what kind of jobs they will do, to keep things running smoothly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Strategic Planning', icon: <Target size={16} />, content: 'Looking at the company\'s plans — if they plan to sell more products or open a new store, they need more people. This connects staffing needs to overall business goals. Expansion or contraction directly impacts the number of staff needed.' },
                  { title: '2. Current Workforce Analysis', icon: <Users size={16} />, content: 'Checking who they already have — what jobs people do, if anyone is planning to leave. This helps figure out if they have enough people or need to hire more. Prevents overstaffing or understaffing by providing a clear picture of the current workforce.' },
                  { title: '3. Skills Gap Analysis', icon: <Brain size={16} />, content: 'Thinking about what skills are needed — new technology may require people with new skills. Identifying the type of people that need to be hired based on required competencies.' },
                  { title: '4. External Factors', icon: <GlobeIcon size={16} />, content: 'Looking at what\'s happening outside the company — economic conditions, new laws, industry trends that can affect staffing needs. The economy and new regulations are examples of external factors.' },
                  { title: '5. Forecasting', icon: <Clock size={16} />, content: 'Planning for the future — how many people needed, what skills, when they are needed. Proactive planning instead of reactive, allowing the company to be prepared.' },
                  { title: '6. Monitoring and Evaluation', icon: <RefreshCw size={16} />, content: 'Checking the plan regularly — things change, so they need to adjust. Ensures the plan is still relevant and effective, like checking a blueprint as you go.' },
                  { title: '7. Stakeholder Input', icon: <Users size={16} />, content: 'Using information from everyone — managers, workers, customers give ideas about what kind of people are needed. Ensures the plan accurately reflects the needs of the company.' },
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

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase mt-12">
                Human Resource Planning Cycle
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The HR planning cycle is like planning a big school project that needs a team. You need to figure out who is already on the team, who else you need, what skills they should have, and how to keep everyone working together.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Analysing Current Supply', icon: <ClipboardList size={16} />, content: 'Checking who\'s already on the team — what jobs they do, skills they have, how long they\'ve been there, and who\'s planning to leave. Provides a clear picture of the current workforce.' },
                  { title: '2. Forecasting Demand', icon: <Target size={16} />, content: 'Guessing who you\'ll need later — looking at company plans for expansion, new technology, or economic changes. Looking into the future to avoid being caught short-staffed.' },
                  { title: '3. Analysing Supply and Demand (Gap Analysis)', icon: <BarChart3 size={16} />, content: 'Finding the gaps — comparing who you have now with who you think you\'ll need later. The heart of the HRP cycle — identifying areas where the company needs to act.' },
                  { title: '4. Developing and Implementing Strategies', icon: <Workflow size={16} />, content: 'Planning to fill the gaps — hiring new people, training current employees, or changing how people work. This is where planning turns into action.' },
                  { title: '5. Monitoring and Evaluating', icon: <RefreshCw size={16} />, content: 'Checking if the plan works — seeing if you\'re getting the right people and if they\'re doing a good job. Ongoing check ensures the company stays on track.' },
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

            {/* SECTION 2: Human Resource Administration */}
            <div
              ref={(el) => {
                sectionRefs.current['administration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Human Resource Administration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Human resource administration is like the behind-the-scenes work that keeps a company's people happy and productive. It is about managing all the things related to employees, from hiring and paying them to making sure they are following the rules.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Managing Employee Records', icon: <ClipboardList size={16} />, content: 'Keeping track of contact information, job history, salary and benefits details, attendance records, and training certificates. Accurate record keeping helps with legal compliance and payroll accuracy.' },
                  { title: '2. Handling Payroll and Benefits', icon: <FileText size={16} />, content: 'Calculating pay checks, processing direct deposits, managing health insurance and retirement plans, handling tax deductions. Accuracy is key — getting payroll wrong causes big problems.' },
                  { title: '3. Ensuring Compliance with Employment Laws', icon: <Shield size={16} />, content: 'Following equal employment opportunity laws, wage and hour laws, safety regulations, and data privacy laws. Helps avoid legal trouble and ensures a fair workplace.' },
                  { title: '4. Administering Employee Policies', icon: <ListChecks size={16} />, content: 'Creating and updating employee handbooks, answering policy questions, handling disciplinary actions. Clear policies create a consistent and fair workplace.' },
                  { title: '5. Assisting with Recruitment and Onboarding', icon: <UserPlus size={16} />, content: 'Posting job openings, scheduling interviews, preparing new employee paperwork, conducting orientation sessions. A smooth onboarding process helps new employees start on the right foot.' },
                  { title: '6. Objectives of HR Administration', icon: <Target size={16} />, content: 'Hire the right people, ensure correct and timely payment, keep good records, help employees understand policies, follow employment laws, and keep the workplace organized and efficient.' },
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

            {/* SECTION 3: Job Descriptions */}
            <div
              ref={(el) => {
                sectionRefs.current['job-descriptions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How Companies Create Job Descriptions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A job description is a detailed map for a specific role. It is not just a title; it is a guide that explains what someone will do, what skills they need, and what the job is all about.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Job Analysis', icon: <Search size={16} />, content: 'Understanding the job\'s "DNA" — gathering detailed information about tasks, skills, working conditions, and responsibilities. The foundation of any job description.' },
                  { title: '2. Job Description (The Blueprint)', icon: <FileText size={16} />, content: 'Written document summarizing job analysis — job title, job summary, duties and responsibilities, reporting relationships, and working conditions.' },
                  { title: '3. Job Specification (Ideal Candidate Profile)', icon: <UserCheck size={16} />, content: 'Focusing on qualifications — education, experience, skills, knowledge, personal attributes needed to perform the job successfully.' },
                  { title: '4. Job Design', icon: <PenTool size={16} />, content: 'Shaping the job for success — organizing tasks, duties, and responsibilities to maximize employee satisfaction and productivity through task variety, significance, autonomy, and feedback.' },
                  { title: '5. Important Elements of a Job Description', icon: <ListChecks size={16} />, content: 'Job Title (clear and understandable), Job Summary (overview of purpose), Duties and Responsibilities (detailed tasks using action words), Reporting Relationships (who they report to), Working Conditions (environment, travel, physical demands).' },
                  { title: '6. Important Elements of a Job Specification', icon: <ClipboardList size={16} />, content: 'Education (required level), Experience (years and type), Skills (technical, communication, problem-solving), Knowledge (software or industry expertise), Personal Attributes (team player, organized, detail-oriented).' },
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

            {/* SECTION 4: Placing Adverts */}
            <div
              ref={(el) => {
                sectionRefs.current['advertising'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Placing Adverts and Job Advertising Media
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When a company has a job opening, they need to tell people about it. This is like putting up a sign or posting on social media to let people know about an opportunity.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Job Advertisement Components', icon: <FileText size={16} />, content: 'Job Title (clear and attention-grabbing), Company Information (who they are), Job Description Summary (overview), Key Responsibilities (main tasks), Required Skills and Qualifications, Benefits and Perks, How to Apply, Company Culture, Equal Opportunity Statement, Call to Action.' },
                  { title: '2. Job Advertising Media', icon: <GlobeIcon size={16} />, content: 'Online Job Boards (Indeed, LinkedIn), Company Website, Social Media (Facebook, Twitter), Professional Associations, Newspapers and Magazines, Recruitment Agencies, University and College Career Services.' },
                  { title: '3. Considerations in Choosing Media', icon: <Target size={16} />, content: 'Target Audience (who you want to reach), Cost (budget), Time Sensitivity (how fast you need someone), Job Type (what kind of job), Media Reach (where they\'re looking), Analytics (tracking results), Company Image.' },
                  { title: '4. Structuring a Job Advertisement', icon: <LayoutIcon size={16} />, content: 'Headline (clear and concise), Company Overview (brief intro), Job Summary (overview of purpose), Key Responsibilities (using action verbs), Required Skills and Qualifications, Benefits and Perks, How to Apply, Call to Action. Use clear language, highlight benefits, make it easy to apply, proofread carefully, and use keywords.' },
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

            {/* SECTION 5: Recruitment and Selection */}
            <div
              ref={(el) => {
                sectionRefs.current['recruitment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Recruitment and Selection
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Recruitment and selection are the steps a company takes to find and hire new employees. It is like building a sports team – you need to find the best players and make sure they fit well together.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Recruitment Sources (Internal)', icon: <Users size={16} />, content: 'Looking within the company — promoting or transferring existing employees. Efficient as candidates are familiar with the system and culture. Boosts employee morale by showing advancement opportunities.' },
                  { title: '2. Recruitment Sources (External)', icon: <UserPlus size={16} />, content: 'Online Job Boards (Indeed, LinkedIn), Company Website, Social Media, Recruitment Agencies, University Career Services, Employee Referrals, Professional Associations, Print Media. Each has advantages and disadvantages depending on the role and target audience.' },
                  { title: '3. Recruitment Process', icon: <Workflow size={16} />, content: 'Job Analysis and Description → Job Advertising → Screening and Shortlisting → Interviews → Background Checks and References → Job Offer → Onboarding. A systematic process for finding and hiring the right people.' },
                  { title: '4. Selection Defined', icon: <Target size={16} />, content: 'The process of choosing the most suitable candidate from a pool of applicants. About carefully evaluating each person\'s skills, experience, and cultural fit.' },
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

              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4">Selection Methods/Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Application Forms and Resumes', icon: <FileText size={16} />, content: 'Foundational tools providing structured overviews of qualifications. Application forms standardize information, while resumes highlight unique experiences. Serve as the initial filter.' },
                  { title: '2. Interviews', icon: <Users size={16} />, content: 'Dynamic interaction for deeper understanding of suitability. Assess communication abilities, problem-solving approaches, and cultural fit. Behavioural interviews predict future performance from past experiences.' },
                  { title: '3. Tests', icon: <ClipboardCheck size={16} />, content: 'Aptitude Tests (cognitive abilities), Personality Tests (work style and values), Skills Tests (proficiency in specific areas). Provide direct measures of a candidate\'s capabilities.' },
                  { title: '4. Background and Reference Checks', icon: <Shield size={16} />, content: 'Verifying information — criminal records, credit checks, professional licenses. Provides qualitative insights into past performance and work ethic from former supervisors and colleagues.' },
                  { title: '5. Assessment Centres & Work Samples', icon: <Target size={16} />, content: 'Assessment Centres provide simulated work environments with role-playing and case studies. Work Samples provide tangible evidence of work quality and ability to apply skills to real-world tasks.' },
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

            {/* SECTION 6: Sifting Applications */}
            <div
              ref={(el) => {
                sectionRefs.current['sifting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sifting Applications and Recruitment Sources
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When lots of people apply for a job, companies need a way to narrow down the choices. This is where sifting applications and understanding recruitment sources come in.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Process of Sifting Applications', icon: <Filter size={16} />, content: 'Reviewing the Job Description → Initial Resume Screening → Keyword Search (ATS) → Checking Essential Qualifications → Evaluating Experience and Skills → Assessing Cover Letters → Ranking Candidates to create a shortlist for interviews.' },
                  { title: '2. Advantages of Recruitment Sources', icon: <Users size={16} />, content: 'Online Job Boards (wide reach), Company Website (cost-effective, brand reinforcement), Social Media (diverse audience, culture promotion), Recruitment Agencies (network, time-saving), University Services (recent graduates), Employee Referrals (cost-effective, cultural fit), Print Media (local audiences).' },
                  { title: '3. Disadvantages of Recruitment Sources', icon: <AlertCircle size={16} />, content: 'Online Job Boards (unqualified applicants, cost), Company Website (limited reach), Social Media (time-consuming, less serious applicants), Recruitment Agencies (expensive, less control), University Services (limited to graduates), Employee Referrals (potential bias, diversity limits), Print Media (declining readership, cost).' },
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

            {/* SECTION 7: Interview Types and Selection Process */}
            <div
              ref={(el) => {
                sectionRefs.current['interviews'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Interview Types and the Selection Process
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Interviews are a key part of hiring. They help companies see if a person is a good fit for the job and the company.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Interview Types', icon: <Users size={16} />, content: 'Structured (pre-determined questions), Unstructured (conversational), Behavioural (past behaviour predicts future), Situational (hypothetical scenarios), Panel (multiple interviewers), Stress (handling pressure), Phone/Video (remote).' },
                  { title: '2. Preparation for Interviewers', icon: <ClipboardCheck size={16} />, content: 'Review job description and resume, prepare questions, set up comfortable space, review testing results. Ensures a consistent and professional interview experience.' },
                  { title: '3. Preparation for Candidates', icon: <UserCheck size={16} />, content: 'Research the company, practice common questions, prepare questions to ask, dress professionally, arrive on time. Helps candidates present themselves effectively.' },
                  { title: '4. Selection Process Steps', icon: <Workflow size={16} />, content: 'Application Review → Initial Interviews → In-Person Interviews → Testing/Assessments → Background Checks and References → Job Offer → Onboarding. A systematic approach to finding and hiring the right person.' },
                  { title: '5. Problems in Selection and Countermeasures', icon: <AlertCircle size={16} />, content: 'Bias (use structured interviews), Halo Effect (score each answer individually), Lack of Consistency (standardized forms), Poor Communication (clear instructions and feedback), Rushing the Process (follow all steps), Not Checking References (always verify).' },
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

            {/* SECTION 8: Contract of Employment */}
            <div
              ref={(el) => {
                sectionRefs.current['contracts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Contract of Employment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A contract of employment is a legally binding agreement that outlines the terms and conditions of a worker's job. It is like a rulebook that both the employer and employee agree to follow.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Definition', icon: <FileText size={16} />, content: 'A legal agreement between employer and employee specifying rights and responsibilities — job duties, pay, working hours, termination procedures. The foundation of the employment relationship.' },
                  { title: '2. Importance of Contracts', icon: <Shield size={16} />, content: 'Clarity and Certainty (minimizes misunderstandings), Legal Protection (enforceable document), Setting Expectations (clear job duties), Financial Security (compensation transparency), Dispute Resolution (mediation/arbitration), Compliance (employment laws), Record Keeping (written record).' },
                  { title: '3. Types of Employment Contracts', icon: <LayersIcon size={16} />, content: 'Fixed-Term (specific start/end date), Permanent (no set end date, ongoing), Part-Time (fewer hours), Full-Time (standard hours), Casual (as-needed), Independent Contractor (self-employed), Zero-Hour (no guaranteed hours).' },
                  { title: '4. Essential Elements', icon: <ListChecks size={16} />, content: 'Identity of Parties, Job Title and Description, Commencement Date, Remuneration (pay), Working Hours, Place of Work, Leave Entitlements, Termination Provisions, Confidentiality/Non-Compete Clauses, Company Policies, Intellectual Property Rights, Dispute Resolution, Governing Law, Severability Clause, Signatures.' },
                  { title: '5. How to Design a Contract', icon: <PenTool size={16} />, content: 'Use clear and concise language, be specific and detailed, ensure compliance with relevant statutes, include all necessary clauses, seek legal advice if needed, review regularly, provide a copy, define company policies, establish performance expectations, address remote work if applicable.' },
                  { title: '6. Relevant Statutes', icon: <Gavel size={16} />, content: 'Basic Conditions of Employment Act, Labour Relations Act, Employment Equity Act, Occupational Health and Safety Act, Minimum Wage Laws, Equal Employment Opportunity Laws, Data Protection Laws. Consult legal professionals to ensure compliance with specific jurisdiction.' },
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

            {/* SECTION 9: Employee Grades */}
            <div
              ref={(el) => {
                sectionRefs.current['grades'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Employee Grades
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Employee grades are more than just labels; they are a fundamental component of an organization's talent management strategy. They provide a structured framework for defining roles, managing compensation, and facilitating career development.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Definition', icon: <UserCog size={16} />, content: 'A formalized, hierarchical system categorizing positions based on relative value and complexity. Serves as a foundation for Compensation Management, Career Development, Performance Management, and Organizational Structure. Creates transparency and consistency.' },
                  { title: '2. Reasons for Reviewing Grades', icon: <RefreshCw size={16} />, content: 'Market Competitiveness (stay competitive), Organizational Restructuring (align with change), Technological Advancements (evolving roles), Employee Performance and Growth (recognize development), Internal Equity (fairness), Legal Compliance (equal pay laws), Job Role Evolution (keep accurate), Budgetary Planning (financial accuracy).' },
                  { title: '3. Grade Review Process', icon: <Workflow size={16} />, content: 'Job Analysis (uncovering the role), Job Evaluation (determining relative value), Market Analysis (benchmarking), Internal Comparison (ensuring consistency), Performance Evaluation Integration, Managerial Input, HR Review and Oversight, Grade Adjustment Decisions, Communication and Transparency, Documentation, Regular Monitoring, Appeal Process.' },
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
                  💡 HR Insight
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
                  <span>HRP Cycle Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Selection Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Contract Types</span>
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
                Effective HR management starts with strategic planning — understanding workforce needs, creating accurate job descriptions, and using appropriate recruitment channels. The selection process must be thorough and fair, using structured interviews and verified reference checks. Employment contracts are legal documents that protect both parties and must comply with relevant statutes. Regular grade reviews ensure compensation remains competitive and equitable.
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
                <strong className="text-white">HR Planning</strong> – involves strategic planning, workforce analysis, skills gap analysis, external factor consideration, forecasting, monitoring, and stakeholder input to ensure the right people are in the right roles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">HR Administration</strong> – manages employee records, payroll and benefits, legal compliance, employee policies, and recruitment/onboarding to keep the workforce organized and productive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Job Descriptions</strong> – created through job analysis, resulting in job descriptions (the blueprint) and job specifications (the ideal candidate profile). Include clear title, summary, duties, reporting, and working conditions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Recruitment &amp; Selection</strong> – recruitment sources can be internal or external; the selection process uses methods like application reviews, interviews, tests, background checks, and assessment centres to find the best candidate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Contracts &amp; Grades</strong> – employment contracts are legally binding agreements detailing rights and responsibilities; employee grades provide a structured framework for compensation, career development, and performance management.
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
            Sidemann Academic Registry • Human Resource Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;