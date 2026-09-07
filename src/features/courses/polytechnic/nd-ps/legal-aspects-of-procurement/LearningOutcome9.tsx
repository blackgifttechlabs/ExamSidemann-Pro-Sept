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
  DollarSign,
  TrendingUp,
  Users,
  ClipboardCheck,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Scale,
  Gavel,
  Briefcase,
  Handshake,
  CheckCircle,
  Clock,
  Heart,
  Wrench,
  Receipt,
  AlertTriangle,
  Lock,
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
  { id: 'contractor-vs-servant', label: 'Contractor vs Servant' },
  { id: 'employment-rights', label: 'Employment Rights' },
  { id: 'duties', label: 'Employer & Employee Duties' },
  { id: 'independent-contractor', label: 'Independent Contractor vs Employee' },
  { id: 'termination', label: 'Termination' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome9: React.FC = () => {
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
        text: 'The distinction between an employee and an independent contractor has significant legal implications for liability, taxes, and employment rights. Misclassification can lead to costly legal disputes.',
      },
      {
        title: 'Pro Tip',
        text: 'When hiring, clearly define the nature of the relationship in writing. A well-drafted contract specifying independent contractor status can help avoid misclassification claims.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the "control test": employees are controlled by the employer, independent contractors control their own work methods. Also consider "integration" – employees are part of the business, contractors are separate.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that paying someone by invoice makes them an independent contractor. Courts look at the totality of the relationship, not just the payment method.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The distinction between an employee and an independent contractor has significant legal implications for liability, taxes, and employment rights. Misclassification can lead to costly legal disputes.',
      },
      {
        title: 'Pro Tip',
        text: 'When hiring, clearly define the nature of the relationship in writing. A well-drafted contract specifying independent contractor status can help avoid misclassification claims.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the "control test": employees are controlled by the employer, independent contractors control their own work methods. Also consider "integration" – employees are part of the business, contractors are separate.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that paying someone by invoice makes them an independent contractor. Courts look at the totality of the relationship, not just the payment method.',
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

  // Helper to render a card with standard styling
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
            <FolderTree size={14} className="inline mr-1" /> EMPLOYMENT LAW
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Contractor vs Servant &{' '}
            <span className="text-emerald-300 font-bold italic">
              Employment Rights
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to contractor vs servant distinctions, employment rights, duties of employers and employees, independent contractor vs employee, and termination of contracts.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Briefcase size={14} className="inline mr-1" /> Employment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Contractor vs Servant
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
                placeholder="Search for a concept, duty, right..."
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
            {/* SECTION 1: Intro */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Employment Law
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Employment law governs the relationship between employers and employees. It defines the rights and duties of each party, the distinction between employees and independent contractors, and the procedures for termination. Understanding these concepts is essential for both employers and workers.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Briefcase size={16} /> Core Concepts
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Employee (Servant):</strong> Someone who works under the control and direction of an employer, with an ongoing relationship, and is integrated into the business.</li>
                  <li><strong>Independent Contractor:</strong> Someone who provides services to a client but retains control over how the work is performed, uses their own tools, and is not integrated into the client's business.</li>
                  <li><strong>Employment Rights:</strong> Legal protections afforded to employees, including fair labour standards, freedom of association, protection against unfair dismissal, and non-discrimination.</li>
                  <li><strong>Duties:</strong> Employers must pay wages, provide a safe workplace, and treat employees fairly; employees must perform their duties with care, obey reasonable instructions, and act in good faith.</li>
                  <li><strong>Termination:</strong> Contracts can end by agreement, performance, expiry, breach, frustration, operation of law, notice, or rescission.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Contractor vs Servant */}
            <div
              ref={(el) => {
                sectionRefs.current['contractor-vs-servant'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Contractor vs. Servant
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of a servant (employee) as someone you directly control—you tell them exactly what to do and how to do it. A contractor is more like someone you hire to do a specific job, and they decide how to do it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Control', icon: <Target size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Employer has significant control over what, how, and when work is performed.</p>
                      <p><strong>Contractor:</strong> Client has less control; contractor decides how to achieve the outcome.</p>
                    </>
                  ) },
                  { title: '2. Relationship', icon: <HeartHandshake size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Ongoing, continuous relationship with permanence.</p>
                      <p><strong>Contractor:</strong> Temporary relationship for a specific project or task.</p>
                    </>
                  ) },
                  { title: '3. Tools and Equipment', icon: <Wrench size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Employer provides tools and resources.</p>
                      <p><strong>Contractor:</strong> Contractor provides their own tools and equipment.</p>
                    </>
                  ) },
                  { title: '4. Payment', icon: <DollarSign size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Regular wage/salary, often with benefits.</p>
                      <p><strong>Contractor:</strong> Fixed fee or hourly rate for specific tasks.</p>
                    </>
                  ) },
                  { title: '5. Liability', icon: <Shield size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Employer is vicariously liable for servant's actions within scope of employment.</p>
                      <p><strong>Contractor:</strong> Contractor is liable for their own actions and negligence.</p>
                    </>
                  ) },
                  { title: '6. Taxes and Deductions', icon: <Receipt size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Employer withholds taxes and makes deductions.</p>
                      <p><strong>Contractor:</strong> Contractor responsible for their own taxes.</p>
                    </>
                  ) },
                  { title: '7. Integration', icon: <LayersIcon size={16} />, content: (
                    <>
                      <p><strong>Servant:</strong> Work is integrated into the employer's business operations.</p>
                      <p><strong>Contractor:</strong> Work is separate from the client's business.</p>
                    </>
                  ) },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Employment Rights */}
            <div
              ref={(el) => {
                sectionRefs.current['employment-rights'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Employment Rights
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Employment law defines the rights of employees and the duties of employers. In Zimbabwe, the Labour Relations Act [Chapter 28:01] is the primary legislation that governs employment relations.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Briefcase size={16} /> Definition of Employment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Employment is a formal agreement where an employee provides labour or services in return for wages or salary. Key elements include work/services, compensation, an employer-employee relationship, and control by the employer.</p>
              </div>

              <h3 className="text-sm font-bold text-green-600 dark:text-green-400 mt-4">Fundamental Rights of Employees in Zimbabwe (Labour Relations Act)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Right to Fair Labour Standards', icon: <Shield size={16} />, content: 'Reasonable working hours, safe and healthy conditions, adequate rest and leave, and fair wages.' },
                  { title: '2. Right to Freedom of Association and Collective Bargaining', icon: <Users size={16} />, content: 'Right to form and join trade unions and engage in collective bargaining.' },
                  { title: '3. Right to Protection Against Unfair Labour Practices', icon: <AlertCircle size={16} />, content: 'Protection against unfair dismissal, discrimination, harassment, and unlawful deductions.' },
                  { title: '4. Right to Protection Against Discrimination', icon: <Scale size={16} />, content: 'Protected from discrimination based on race, colour, religion, sex, marital status, age, disability, or political affiliation.' },
                  { title: '5. Right to Maternity Leave', icon: <Heart size={16} />, content: 'Female employees are entitled to paid maternity leave as prescribed.' },
                  { title: '6. Right to Sick Leave', icon: <Clock size={16} />, content: 'Employees are entitled to paid sick leave subject to conditions.' },
                  { title: '7. Right to Termination of Employment', icon: <FileText size={16} />, content: 'Procedures for termination, including notice periods and severance pay.' },
                  { title: '8. Right to Information', icon: <Search size={16} />, content: 'Right to information relating to their employment.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Duties of Employer and Employee */}
            <div
              ref={(el) => {
                sectionRefs.current['duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties of Employer and Employee
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Both employers and employees have specific duties that form the foundation of the employment relationship. Understanding these duties ensures a harmonious and legally compliant workplace.
                  </p>
</div>

              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-4">Duties of the Employer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Duty to Pay Wages', icon: <DollarSign size={16} />, content: 'Pay agreed wages/salary on time, without unauthorised deductions, and provide clear payslips.' },
                  { title: '2. Duty to Provide a Safe and Healthy Work Environment', icon: <Shield size={16} />, content: 'Ensure safety, provide equipment, conduct risk assessments, and comply with health and safety regulations.' },
                  { title: '3. Duty to Provide Work', icon: <Briefcase size={16} />, content: 'Provide work consistent with the employment contract, with clear instructions and resources.' },
                  { title: '4. Duty to Treat Employees Fairly and Without Discrimination', icon: <Scale size={16} />, content: 'Establish transparent policies, provide diversity training, and address discrimination complaints promptly.' },
                  { title: '5. Duty to Provide Reasonable Notice of Termination', icon: <AlertCircle size={16} />, content: 'Give reasonable notice or pay in lieu, with written reasons and outplacement support.' },
                  { title: '6. Duty to Maintain Confidentiality', icon: <Lock size={16} />, content: 'Protect employee personal data and medical records with appropriate security measures.' },
                  { title: '7. Duty to Adhere to Labour Laws', icon: <Gavel size={16} />, content: 'Comply with all applicable labour laws, including working hours, overtime, and leave entitlements.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-4">Duties of the Employee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Duty to Perform Work with Reasonable Skill and Care', icon: <Target size={16} />, content: 'Perform tasks with skill, diligence, and care, using tools correctly and continuously improve skills.' },
                  { title: '2. Duty to Obey Lawful and Reasonable Instructions', icon: <ClipboardCheck size={16} />, content: 'Follow lawful and reasonable instructions from employer or supervisors, demonstrating cooperation.' },
                  { title: '3. Duty of Loyalty and Good Faith', icon: <HeartHandshake size={16} />, content: 'Act in the employer\'s best interests, avoid conflicts, and maintain confidentiality.' },
                  { title: '4. Duty to Maintain Confidentiality', icon: <Lock size={16} />, content: 'Safeguard sensitive information, trade secrets, and customer data.' },
                  { title: '5. Duty to Give Reasonable Notice of Resignation', icon: <Clock size={16} />, content: 'Provide reasonable notice of resignation to allow for a smooth transition.' },
                  { title: '6. Duty to Adhere to Workplace Policies', icon: <FileText size={16} />, content: 'Familiarise with and follow workplace policies and procedures.' },
                  { title: '7. Duty to Act in a Safe Manner', icon: <Shield size={16} />, content: 'Follow safety protocols, report hazards, and use safety equipment properly.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Independent Contractor vs Employee */}
            <div
              ref={(el) => {
                sectionRefs.current['independent-contractor'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Independent Contractor vs. Employee
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of an employee like someone who works "inside" your company. You tell them what to do, how to do it, and when to do it. An independent contractor is like someone you hire "from the outside" to do a specific job. They decide how to do it, and you just care about the result.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Who\'s in Charge? (Control)', icon: <Target size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Employer controls what, how, and when work is done.</p>
                      <p><strong>Independent Contractor:</strong> Contractor controls how to achieve the result.</p>
                    </>
                  ) },
                  { title: '2. How Long Does It Last? (Relationship)', icon: <Clock size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Ongoing, permanent role.</p>
                      <p><strong>Independent Contractor:</strong> Specific project or fixed term.</p>
                    </>
                  ) },
                  { title: '3. Who Uses What Tools? (Tools)', icon: <Wrench size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Employer provides tools and equipment.</p>
                      <p><strong>Independent Contractor:</strong> Contractor provides own tools.</p>
                    </>
                  ) },
                  { title: '4. How Do You Get Paid? (Payment)', icon: <DollarSign size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Regular salary/wage with benefits.</p>
                      <p><strong>Independent Contractor:</strong> Fee upon completion, invoicing.</p>
                    </>
                  ) },
                  { title: '5. Who\'s Responsible? (Liability)', icon: <Shield size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Employer is vicariously liable.</p>
                      <p><strong>Independent Contractor:</strong> Contractor is personally liable.</p>
                    </>
                  ) },
                  { title: '6. Who Pays the Taxes? (Taxes)', icon: <Receipt size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Employer withholds taxes.</p>
                      <p><strong>Independent Contractor:</strong> Contractor pays own taxes.</p>
                    </>
                  ) },
                  { title: '7. Are You Part of the Team? (Integration)', icon: <LayersIcon size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> Integrated into the business.</p>
                      <p><strong>Independent Contractor:</strong> Separate from the business.</p>
                    </>
                  ) },
                  { title: '8. Who Takes the Risk? (Risk)', icon: <TrendingUp size={16} />, content: (
                    <>
                      <p><strong>Employee:</strong> No business risk; gets paid regardless.</p>
                      <p><strong>Independent Contractor:</strong> Takes business risk; losses if job goes wrong.</p>
                    </>
                  ) },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: Termination of a Contract */}
            <div
              ref={(el) => {
                sectionRefs.current['termination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Termination of a Contract
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The termination of a contract signifies the end of the legal obligations and rights created by the agreement. It can occur in various ways, each with its own legal implications.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Termination by Agreement', icon: <Handshake size={16} />, content: 'Parties mutually agree to end the contract, either through a new agreement or exercising a termination clause.' },
                  { title: '2. Termination by Performance', icon: <CheckCircle size={16} />, content: 'Contract ends when all parties have fully performed their obligations.' },
                  { title: '3. Termination by Expiry of Time', icon: <Clock size={16} />, content: 'If contract specifies a fixed duration, it automatically terminates when that time expires.' },
                  { title: '4. Termination by Breach', icon: <AlertTriangle size={16} />, content: 'A material breach by one party gives the other the right to terminate the contract.' },
                  { title: '5. Termination by Frustration', icon: <AlertCircle size={16} />, content: 'Unforeseen event makes performance impossible, beyond control of both parties.' },
                  { title: '6. Termination by Operation of Law', icon: <Gavel size={16} />, content: 'Legal events such as bankruptcy, death, or illegality automatically terminate the contract.' },
                  { title: '7. Termination by Notice', icon: <FileText size={16} />, content: 'Contract clause allows either party to terminate by giving a specified period of notice.' },
                  { title: '8. Termination by Rescission', icon: <RefreshCw size={16} />, content: 'Setting the contract aside as if it never existed, due to misrepresentation, fraud, or duress.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
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
                  💡 Employment Insight
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
                  <span>Contractor vs Servant Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Employee Rights (Zimbabwe)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Methods of Termination</span>
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
                The distinction between employee and independent contractor affects liability, taxes, and employment rights. Employers must ensure proper classification to avoid legal penalties. Employees have fundamental rights under the Labour Relations Act. Both parties have duties that must be fulfilled. Termination of a contract must be handled properly to avoid claims of unfair dismissal.
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
                <strong className="text-white">Contractor vs Servant</strong> – key differences: control, relationship, tools, payment, liability, taxes, and integration into the business.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Employment Rights</strong> – employees have rights to fair labour standards, freedom of association, protection against unfair practices, non-discrimination, maternity/sick leave, and information.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Duties</strong> – employers must pay wages, ensure safety, provide work, treat fairly, give notice, maintain confidentiality, and comply with laws; employees must perform with care, obey instructions, be loyal, maintain confidentiality, give notice, and adhere to policies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Independent Contractor vs Employee</strong> – same factors as contractor vs servant, but focuses on the relationship with the hiring entity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Termination</strong> – contracts can end by agreement, performance, expiry, breach, frustration, operation of law, notice, or rescission.
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
            Sidemann Academic Registry • Legal Studies – Employment Law 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome9;