import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  FileText,
  Award,
  AlertTriangle,
  Wrench,
  Recycle,
  UserCheck,
  CheckCircle,
  ClipboardList,
  HardHat,
  Trash2,
  FlameIcon,
  User,
  Landmark,
  Lightbulb,
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
  { id: 'hse', label: 'HSE Framework' },
  { id: 'ppe', label: 'PPE' },
  { id: 'health-safety', label: 'Health & Safety' },
  { id: 'drills', label: 'Safety Drills' },
  { id: 'risk', label: 'Risk & Accidents' },
  { id: 'responsibility', label: 'Responsibilities' },
  { id: 'waste', label: 'Waste Management' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The first safety helmet was invented in 1919 by Edward Bullard, inspired by the steel helmets worn by soldiers in World War I. It revolutionised workplace safety in construction and mining.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting PPE, always conduct a thorough risk assessment first. The right equipment depends on the specific hazards present, not just the job title.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the hierarchy of controls: Elimination, Substitution, Engineering, Administrative, PPE — "ESAP" helps recall the order from most to least effective.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely solely on PPE as your primary safety measure. Engineering and administrative controls are more effective at eliminating hazards at the source.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first safety helmet was invented in 1919 by Edward Bullard, inspired by the steel helmets worn by soldiers in World War I. It revolutionised workplace safety in construction and mining.',
      },
      {
        title: 'Pro Tip',
        text: 'When selecting PPE, always conduct a thorough risk assessment first. The right equipment depends on the specific hazards present, not just the job title.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the hierarchy of controls: Elimination, Substitution, Engineering, Administrative, PPE — "ESAP" helps recall the order from most to least effective.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely solely on PPE as your primary safety measure. Engineering and administrative controls are more effective at eliminating hazards at the source.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> HEALTH, SAFETY &amp; ENVIRONMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Safety Clothing, PPE &amp;{' '}
            <span className="text-amber-300 font-bold italic">
              Workplace Safety
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to HSE, PPE, risk reduction, accident prevention, emergency drills, waste management, and responsibilities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardHat size={14} className="inline mr-1" /> PPE
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> HSE
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Trash2 size={14} className="inline mr-1" /> Waste Management
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
                placeholder="Search for a concept, PPE type, safety procedure..."
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
            {/* SECTION 1: HSE Framework */}
            <div
              ref={(el) => {
                sectionRefs.current['hse'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Requirements for Safety Clothing &amp; HSE Framework
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When determining the necessary safety clothing for a job, it is crucial to understand the broader context of health, safety, and environment. These three elements are interconnected and form the foundation of a safe and responsible workplace.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> Defining Health, Safety, and Environment (HSE)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Health:</strong> Refers to the overall well-being of employees, encompassing physical, mental, and social aspects. It involves preventing work related illnesses and promoting a healthy work environment.</li>
                    <li><strong>Safety:</strong> Focuses on preventing accidents and injuries in the workplace. This includes identifying and mitigating hazards, providing safety equipment, and implementing safe work procedures.</li>
                    <li><strong>Environment:</strong> Concerns the impact of work activities on the natural world. It involves minimizing pollution, conserving resources, and promoting sustainable practices.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <FileText size={16} /> Health and Safety Policy
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A health and safety policy is a written statement that outlines an organization's commitment to protecting the health and safety of its employees and other stakeholders. It serves as a guiding document for all health and safety activities within the workplace.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Key Elements:</strong> Statement of Intent, Responsibilities, Arrangements, Risk Assessment, Consultation, Training, Emergency Procedures, Monitoring, Safety Clothing Requirements, Legal Compliance, Continuous Improvement, Documentation.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 2: PPE */}
            <div
              ref={(el) => {
                sectionRefs.current['ppe'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Personal Protective Equipment (PPE)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Personal Protective Equipment (PPE) is specialized clothing or equipment worn by employees to protect them from workplace hazards. It is essentially the last line of defence, used when engineering controls and safe work practices cannot eliminate risks.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Shield size={16} /> Definition of PPE
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Any equipment designed to be worn or held by a worker to protect them from one or more health and safety hazards.</li>
                    <li>Used to minimize exposure to risks that can cause injuries or illnesses.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ListChecks size={16} /> Types of PPE
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Head Protection:</strong> Safety helmets/hard hats</li>
                    <li><strong>Eye Protection:</strong> Safety glasses, goggles, face shields</li>
                    <li><strong>Hearing Protection:</strong> Earplugs, earmuffs</li>
                    <li><strong>Respiratory Protection:</strong> Respirators, dust masks</li>
                    <li><strong>Hand Protection:</strong> Gloves (chemical, cut, heat-resistant)</li>
                    <li><strong>Foot Protection:</strong> Safety shoes, boots</li>
                    <li><strong>Body Protection:</strong> Coveralls, aprons, vests</li>
                    <li><strong>Fall Protection:</strong> Harnesses, lanyards</li>
                    <li><strong>Skin Protection:</strong> Barrier creams, sunscreen</li>
                    <li><strong>Life Jackets/Flotation Devices</strong></li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <CheckCircle size={16} /> Ensuring Proper Use of PPE
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Selection:</strong> Choose right PPE for specific hazard</li>
                    <li><strong>Fitting:</strong> Ensure proper fit</li>
                    <li><strong>Training:</strong> Teach correct use, maintenance</li>
                    <li><strong>Maintenance &amp; Inspection:</strong> Regular checks</li>
                    <li><strong>Consistent Use:</strong> Always wear when exposed</li>
                    <li><strong>Storage:</strong> Clean, dry place</li>
                    <li><strong>Supervision:</strong> Monitor usage</li>
                    <li><strong>Review &amp; Update:</strong> Regular review</li>
                    <li><strong>Documentation:</strong> Record training, inspections</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Award size={16} /> Importance and Benefits of PPE
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Injury and illness prevention</li>
                    <li>Reduced severity of injuries</li>
                    <li>Increased productivity</li>
                    <li>Legal compliance</li>
                    <li>Improved employee morale</li>
                    <li>Reduced costs</li>
                    <li>Enhanced company reputation</li>
                    <li>Protection from environmental hazards</li>
                    <li>Peace of mind</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Wrench size={16} /> Maintenance of PPE
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Regular Inspections:</strong> Check before each use for damage, wear, defects</li>
                  <li><strong>Cleaning:</strong> Clean according to manufacturer's instructions</li>
                  <li><strong>Sanitization:</strong> Especially for respirators, hearing protection</li>
                  <li><strong>Proper Storage:</strong> Clean, dry, cool place away from sunlight, chemicals</li>
                  <li><strong>Repairs:</strong> Only by trained personnel or per manufacturer guidelines</li>
                  <li><strong>Replacement:</strong> Replace when beyond useful lifespan</li>
                  <li><strong>Record Keeping:</strong> Maintain inspection, cleaning, maintenance records</li>
                  <li><strong>Manufacturer Guidelines:</strong> Always follow manufacturer instructions</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Health and Safety */}
            <div
              ref={(el) => {
                sectionRefs.current['health-safety'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Health and Safety
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A safe workplace requires constant vigilance and a proactive approach.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Health and Safety Risks
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Physical:</strong> Related to the environment (noise, temperature, radiation)</li>
                    <li><strong>Chemical:</strong> Related to hazardous substances (fumes, liquids, dust)</li>
                    <li><strong>Biological:</strong> Related to living organisms (bacteria, viruses, fungi)</li>
                    <li><strong>Ergonomic:</strong> Related to workplace design (repetitive motions, poor posture)</li>
                    <li><strong>Psychosocial:</strong> Related to stress, workload, workplace culture</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Search size={16} /> How to Identify Safety and Health Hazards
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Workplace inspections</li>
                    <li>Job Hazard Analysis (JHA)</li>
                    <li>Reviewing accident and incident reports</li>
                    <li>Employee feedback and reporting</li>
                    <li>Material Safety Data Sheets (MSDS/SDS)</li>
                    <li>Monitoring and measurement</li>
                    <li>Consulting with experts</li>
                    <li>Observation of work practices</li>
                    <li>Equipment and machinery assessments</li>
                    <li>Environmental monitoring</li>
                    <li>Regulatory compliance audits</li>
                    <li>Task analysis</li>
                    <li>Change management reviews</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Lightbulb size={16} /> Meaning of Health and Safety Awareness
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Knowing the risks associated with one's job</li>
                    <li>Understanding safety procedures and policies</li>
                    <li>Being able to identify and report hazards</li>
                    <li>Taking personal responsibility for safety</li>
                    <li>Understanding how to use PPE</li>
                    <li>Knowing emergency procedures</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Award size={16} /> Importance of Health and Safety Awareness Program
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Prevention of accidents and injuries</li>
                    <li>Reduction of occupational illnesses</li>
                    <li>Improved employee morale</li>
                    <li>Legal compliance</li>
                    <li>Reduced costs</li>
                    <li>Enhanced company reputation</li>
                    <li>Increased productivity</li>
                    <li>Empowerment of employees</li>
                    <li>Positive safety culture</li>
                    <li>Effective emergency response</li>
                    <li>Reduced absenteeism</li>
                    <li>Improved communication</li>
                    <li>Proactive risk management</li>
                    <li>Shared responsibility</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Important Health and Safety Awareness Program Elements
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Behavioural Change:</strong> Focus on changing behaviours through interactive training, role-playing</li>
                  <li><strong>Continuous Improvement:</strong> Regular evaluation and updates based on feedback</li>
                  <li><strong>Leadership Involvement:</strong> Visible commitment from management</li>
                  <li><strong>Integration:</strong> Connect with performance management, quality control, wellness</li>
                  <li><strong>Accessibility:</strong> Accessible to all employees regardless of language or disability</li>
                  <li><strong>Positive Reinforcement:</strong> Reward and recognise employees who follow safety procedures</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Safety Drills */}
            <div
              ref={(el) => {
                sectionRefs.current['drills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Safety Drills and Emergency Preparedness
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Safety drills are practice exercises designed to prepare employees for emergency situations. They provide an opportunity to test emergency procedures, identify weaknesses, and ensure that everyone knows what to do in a real emergency.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <FlameIcon size={16} /> Types of Drills
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Fire Drills:</strong> Evacuation, extinguisher use, assisting disabled</li>
                    <li><strong>Evacuation Drills:</strong> Chemical spills, bomb threats, natural disasters</li>
                    <li><strong>Shelter-in-Place Drills:</strong> Sealing rooms, communication, extended shelter</li>
                    <li><strong>First Aid Drills:</strong> CPR, AED use, injury treatment</li>
                    <li><strong>Chemical Spill Drills:</strong> Containment, clean-up, PPE use</li>
                    <li><strong>Active Shooter Drills:</strong> Run, hide, fight strategies</li>
                    <li><strong>Severe Weather Drills:</strong> Tornadoes, hurricanes, blizzards</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Award size={16} /> Importance of Mock Drills
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Preparedness and psychological conditioning</li>
                    <li>Refinement of communication and coordination</li>
                    <li>Identification of vulnerabilities</li>
                    <li>Evaluation of external response integration</li>
                    <li>Enhancement of situational awareness</li>
                    <li>Validation of training effectiveness</li>
                    <li>Fostering continuous improvement</li>
                    <li>Minimizing disruption and ensuring business continuity</li>
                    <li>Building community resilience</li>
                    <li>Demonstrating commitment to stakeholders</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Tips for Conducting Effective Workplace Drills
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Choose Relevant Scenarios:</strong> Tailor to local risks and industry-specific hazards</li>
                  <li><strong>Set Appropriate Frequency:</strong> Regular drills, vary schedule, include new employees</li>
                  <li><strong>Keep Them Unannounced:</strong> Create realism, but consider health issues</li>
                  <li><strong>Add Surprises:</strong> Introduce unexpected elements to challenge adaptability</li>
                  <li><strong>Establish Success Metrics:</strong> Clear objectives, time measurement, procedure adherence, communication assessment</li>
                  <li><strong>Debrief After Each Drill:</strong> Gather feedback, identify improvements, document lessons learned</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Risk Reduction, Causes, Measures */}
            <div
              ref={(el) => {
                sectionRefs.current['risk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Health and Safety Risk Reduction, Causes of Accidents &amp; Measures
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Shield size={16} /> Risk Reduction Methods
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Hazard Elimination:</strong> Complete removal of hazard</li>
                    <li><strong>Substitution:</strong> Replace with less hazardous alternative</li>
                    <li><strong>Engineering Controls:</strong> Modify workplace or equipment</li>
                    <li><strong>Administrative Controls:</strong> Change work procedures</li>
                    <li><strong>Personal Protective Equipment (PPE):</strong> Last line of defence</li>
                    <li><strong>Training and Education:</strong> Knowledge and skills</li>
                    <li><strong>Regular Inspections and Audits:</strong> Identify and correct hazards</li>
                    <li><strong>Risk Assessments:</strong> Evaluate likelihood and severity</li>
                    <li><strong>Emergency Preparedness:</strong> Practice procedures</li>
                    <li><strong>Communication and Consultation:</strong> Open dialogue</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Causes of Accidents
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Human error (fatigue, distraction, lack of training)</li>
                    <li>Equipment failure (wear, maintenance issues)</li>
                    <li>Lack of training (initial and refresher)</li>
                    <li>Inadequate supervision</li>
                    <li>Poor housekeeping</li>
                    <li>Environmental conditions (lighting, temperature, noise)</li>
                    <li>Failure to use PPE</li>
                    <li>Rushing and taking shortcuts</li>
                    <li>Lack of hazard identification</li>
                    <li>Psychological factors (stress, bullying)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <CheckCircle size={16} /> Measures to Reduce Accidents
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Implement comprehensive safety management system</li>
                  <li>Conduct regular risk assessments</li>
                  <li>Provide thorough training</li>
                  <li>Enforce safety rules and procedures</li>
                  <li>Maintain equipment and machinery</li>
                  <li>Improve housekeeping</li>
                  <li>Optimize environmental conditions</li>
                  <li>Provide and enforce use of PPE</li>
                  <li>Promote a culture of safety</li>
                  <li>Investigate accidents and near misses</li>
                </ul>
              </div>
            </div>

            {/* SECTION 6: Responsibility for Health and Safety */}
            <div
              ref={(el) => {
                sectionRefs.current['responsibility'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Responsibility for Health and Safety
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Health and safety are a collective responsibility, requiring the active participation of all stakeholders.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <UserCheck size={16} /> Of the Employer
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Provide a safe workplace</li>
                    <li>Conduct risk assessments</li>
                    <li>Provide training and information</li>
                    <li>Provide and maintain PPE</li>
                    <li>Develop and implement safety policies</li>
                    <li>Investigate accidents and incidents</li>
                    <li>Maintain records</li>
                    <li>Consult with employees</li>
                    <li>Comply with regulations</li>
                    <li>Provide emergency procedures</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <User size={16} /> Of the Employee
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Follow safety rules and procedures</li>
                    <li>Use PPE properly</li>
                    <li>Report hazards and incidents</li>
                    <li>Participate in training</li>
                    <li>Take reasonable care for self and others</li>
                    <li>Cooperate with the employer</li>
                    <li>Do not tamper with safety equipment</li>
                    <li>Maintain a clean workspace</li>
                    <li>Report any health concerns</li>
                    <li>Ask questions when unsure</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Landmark size={16} /> Of Government &amp; NSSA
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">Government:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Develop and enforce legislation</li>
                    <li>Conduct inspections</li>
                    <li>Provide guidance and resources</li>
                    <li>Investigate major accidents</li>
                    <li>Set standards</li>
                    <li>Promote awareness</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold mt-2">NSSA:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Provide social security benefits</li>
                    <li>Promote prevention</li>
                    <li>Collect and analyse data</li>
                    <li>Compensation</li>
                    <li>Rehabilitation</li>
                    <li>Education and research</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 7: Waste Management */}
            <div
              ref={(el) => {
                sectionRefs.current['waste'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Waste Management and Disposal
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Waste, in its simplest form, is any substance or object that is discarded after its primary use or is otherwise unwanted.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Trash2 size={16} /> What is Waste?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Waste is any material that is no longer needed or wanted. It can be generated from various sources, including households, industries, and commercial activities. It is crucial to manage waste effectively to minimize its environmental impact and protect public health.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ListChecks size={16} /> Types of Waste
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Municipal Solid Waste (MSW)</li>
                    <li>Industrial Waste</li>
                    <li>Hazardous Waste</li>
                    <li>Construction and Demolition (C&D) Waste</li>
                    <li>Electronic Waste (E-waste)</li>
                    <li>Agricultural Waste</li>
                    <li>Medical Waste (Biohazard)</li>
                    <li>Radioactive Waste</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Recycle size={16} /> Waste Disposal Methods
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Landfilling</li>
                    <li>Incineration</li>
                    <li>Recycling</li>
                    <li>Composting</li>
                    <li>Waste-to-Energy (WtE)</li>
                    <li>Anaerobic Digestion</li>
                    <li>Hazardous Waste Treatment</li>
                    <li>Source Reduction (Waste Prevention)</li>
                    <li>Secure Storage</li>
                    <li>Exporting Waste</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Target size={16} /> Importance of Waste Disposal
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Public health protection</li>
                    <li>Environmental protection</li>
                    <li>Resource conservation</li>
                    <li>Aesthetic preservation</li>
                    <li>Regulatory compliance</li>
                    <li>Prevention of climate change</li>
                    <li>Prevents soil and water contamination</li>
                    <li>Reduces landfill space needed</li>
                    <li>Improves air quality</li>
                    <li>Promotes a sustainable future</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <FileText size={16} /> Waste Management Policy
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A documented plan that outlines an organization's or community's approach to handling and disposing of waste. It should cover all aspects of waste management, from prevention and reduction to collection, transportation, and disposal. The policy should be tailored to the specific types of waste generated and the regulatory requirements of the region.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <ClipboardList size={16} /> Waste Disposal Procedure
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Waste segregation</li>
                    <li>Waste collection</li>
                    <li>Waste transportation</li>
                    <li>Waste processing</li>
                    <li>Final disposal</li>
                    <li>Documentation</li>
                    <li>Training</li>
                    <li>Regular audits</li>
                    <li>Emergency procedures</li>
                    <li>Continuous improvement</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Regulations on Waste Disposal
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Waste Classification:</strong> Defining different types of waste and their associated hazards</li>
                  <li><strong>Permitting and Licensing:</strong> Requiring permits for waste disposal facilities</li>
                  <li><strong>Landfill Standards:</strong> Design, operation, and monitoring standards</li>
                  <li><strong>Hazardous Waste Management:</strong> Handling, treatment, disposal regulations</li>
                  <li><strong>Recycling Requirements:</strong> Mandating or incentivizing recycling</li>
                  <li><strong>Transportation Regulations:</strong> Regulating waste transport</li>
                  <li><strong>International Treaties:</strong> Basel Convention and others</li>
                  <li><strong>Local Ordinances:</strong> Local government regulations</li>
                  <li><strong>Environmental Impact Assessments:</strong> For large disposal projects</li>
                  <li><strong>Monitoring and Reporting:</strong> Compliance verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Safety Insight
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
                  <span>PPE Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Hazard Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Waste Types</span>
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
                Health, safety, and environment are interconnected. PPE is the last line of defence — prioritise elimination, substitution, and engineering controls first. Regular safety drills and hazard identification are essential for prevention. Waste management protects public health and the environment. Everyone has a responsibility: employers provide, employees follow, and governments enforce.
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
                <strong className="text-white">HSE Framework</strong> – Health, Safety, and Environment are interconnected. A strong health and safety policy includes statement of intent, responsibilities, arrangements, risk assessment, training, and emergency procedures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Personal Protective Equipment (PPE)</strong> – includes head, eye, hearing, respiratory, hand, foot, body, and fall protection. Proper selection, fitting, training, maintenance, and consistent use are essential for effectiveness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Health &amp; Safety</strong> – risks can be physical, chemical, biological, ergonomic, or psychosocial. Hazard identification methods include inspections, JHA, incident review, employee feedback, and monitoring.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Safety Drills</strong> – fire, evacuation, shelter-in-place, first aid, chemical spill, active shooter, and severe weather drills prepare employees for emergencies. Regular drills improve preparedness and identify weaknesses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk Reduction &amp; Responsibility</strong> – hierarchy of controls: elimination, substitution, engineering, administrative, PPE. Employers, employees, and government all share responsibility for workplace safety.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Waste Management</strong> – proper segregation, collection, processing, and disposal of waste protect public health and the environment. Types include MSW, industrial, hazardous, e-waste, and medical waste.
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
            Sidemann Academic Registry • Health, Safety &amp; Environment 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;