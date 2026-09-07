import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // ─── Icons used in the LO1 template ────────────────────────────────────
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,

  // ─── Icons specific to this LO4 content ────────────────────────────────
  FolderTree,
  Home,
  Leaf,
  Globe,
  Users,
  Database,
  Heart,
  HeartPulse,
  Apple,
  Scale,
  FileText as FileTextIcon,
  Archive as ArchiveIcon,
  Shield as ShieldIcon,
  BookOpen as BookOpenIcon2,
  AlertCircle,
  MessageSquare,
  Building,
  Sun,
  Eye,
  Brain,
  Link,
  AlertTriangle,
  Handshake,
  TrendingUp,
  Clock as ClockIcon,
  Mic,
  Pill,
  Share2,
  Lightbulb,
  Award as AwardIcon,
  Lock,
  Copy,
  Quote,
  ListChecks,
  Edit,
  Clipboard,
  Briefcase,
  Layers as LayersIcon,
  User,
  UserCheck,
  Scale as ScaleIcon,
  Bug,
  FlaskRound,
  HardDrive as HardDriveIcon,
  Scan,
  Wrench,
  Sparkle,
  ThumbsUp,
  Camera,
  Video,
  Microscope,
  Box,
  HardDrive,
  Cloud,
  Server,
  Layout,
  DollarSign,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'concepts', label: 'Concepts' },
  { id: 'significance', label: 'Significance' },
  { id: 'prioritization', label: 'Prioritization' },
  { id: 'programme', label: 'Programme' },
  { id: 'steps', label: 'Steps' },
  { id: 'survey', label: 'Survey' },
  { id: 'budget', label: 'Budget' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The first formal preservation plans were developed in the 1970s as libraries and archives began to recognise the need for systematic approaches to conservation.',
      },
      {
        title: 'Pro Tip',
        text: 'When prioritising preservation actions, always consider both the intrinsic value of the item and its risk of loss – the most valuable and most vulnerable items should come first.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of a preservation programme: Policy, Environment, Handling, and Disaster Preparedness.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions create a preservation plan but fail to allocate ongoing resources for implementation – a plan without budget and staff is just a wish list.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first formal preservation plans were developed in the 1970s as libraries and archives began to recognise the need for systematic approaches to conservation.',
      },
      {
        title: 'Pro Tip',
        text: 'When prioritising preservation actions, always consider both the intrinsic value of the item and its risk of loss – the most valuable and most vulnerable items should come first.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of a preservation programme: Policy, Environment, Handling, and Disaster Preparedness.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions create a preservation plan but fail to allocate ongoing resources for implementation – a plan without budget and staff is just a wish list.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Preservation Planning &amp; Programme Management —{' '}
            <span className="text-amber-300 font-bold italic">
              Strategy, Prioritisation &amp; Budgeting
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to preservation planning concepts, significance, prioritization, programme development, surveys, and budgeting.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Planning
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <DollarSign size={14} className="inline mr-1" /> Budget
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Programme
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
                placeholder="Search for a concept, value, process step..."
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
            {/* SECTION 1: Concepts in Preservation Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Concepts in Preservation Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preservation planning is the systematic process of developing and implementing strategies to ensure the long-term protection and accessibility of records and information. It involves assessing risks, setting priorities, and allocating resources to prevent deterioration and ensure the continued usability of valuable materials.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Key concepts in preservation planning include:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Risk Assessment:</strong> Identifying and evaluating potential threats to records, such as environmental factors, physical damage, and technological obsolescence.</li>
                  <li><strong>Preventive Conservation:</strong> Implementing measures to minimize deterioration, such as environmental control, proper storage, and handling procedures.</li>
                  <li><strong>Remedial Conservation:</strong> Developing strategies for repairing and restoring damaged records through conservation treatments.</li>
                  <li><strong>Disaster Preparedness and Recovery:</strong> Creating plans to protect records from disasters and to recover them in the event of damage.</li>
                  <li><strong>Resource Allocation:</strong> Determining the financial, human, and technological resources required for preservation activities.</li>
                  <li><strong>Policy Development:</strong> Establishing guidelines and procedures for preservation practices.</li>
                  <li><strong>Collaboration and Partnerships:</strong> Working with other institutions and organizations to share expertise and resources.</li>
                  <li><strong>Ongoing Monitoring and Evaluation:</strong> Regularly assessing the effectiveness of preservation plans and making necessary adjustments.</li>
                  <li><strong>Prioritization:</strong> Determining which collections or items are most valuable, and most at risk, and therefore which should be given the highest priority.</li>
                  <li><strong>Sustainability:</strong> Planning for long term preservation, that takes into account long term costs, and environmental impact.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Significance of Preservation Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of Preservation Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preservation planning is essential for safeguarding cultural heritage, historical records, and vital organizational information.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Ensuring Long-Term Access:</strong> Preservation planning ensures that records remain accessible and usable for future generations, preserving valuable information and knowledge.</li>
                  <li><strong>Protecting Cultural Heritage:</strong> It plays a crucial role in protecting cultural heritage by preserving historical documents, artifacts, and artistic works.</li>
                  <li><strong>Maintaining Organizational Memory:</strong> For organizations, preservation planning helps maintain institutional memory, ensuring that valuable records are not lost or destroyed.</li>
                  <li><strong>Complying with Legal and Regulatory Requirements:</strong> Many organizations are required to retain records for legal and regulatory purposes. Preservation planning helps ensure compliance.</li>
                  <li><strong>Minimizing Costs:</strong> Proactive preservation measures can prevent costly remedial conservation treatments and reduce the risk of data loss.</li>
                  <li><strong>Enhancing Research and Scholarship:</strong> Preservation planning supports research and scholarship by ensuring that valuable records are available for study and analysis.</li>
                  <li><strong>Promoting Public Access:</strong> It facilitates public access to information, promoting transparency and accountability.</li>
                  <li><strong>Risk Mitigation:</strong> It allows for the identification and mitigation of threats to the collections before damage occurs.</li>
                  <li><strong>Efficient Resource Allocation:</strong> A well made preservation plan allows for the most efficient use of available funds.</li>
                  <li><strong>Professional Responsibility:</strong> It reinforces the professional responsibility of information professionals to preserve and protect valuable records.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Factors to Consider When Prioritizing */}
            <div
              ref={(el) => {
                sectionRefs.current['prioritization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Prioritizing Preservation Action
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Prioritizing preservation actions involves a careful evaluation of various factors to ensure that resources are allocated effectively and that the most valuable and vulnerable records are protected.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Value and Significance:</strong> Assess the intrinsic value and significance of the records. Consider their historical, cultural, legal, and informational importance. Are they unique? Do they document significant events or periods? Are they essential for organizational operations?</li>
                  <li><strong>Condition and Vulnerability:</strong> Evaluate the current condition of the records and their vulnerability to deterioration. Are they physically damaged, chemically unstable, or at risk from environmental factors? Are they in a format that is becoming obsolete?</li>
                  <li><strong>Frequency of Use and Access:</strong> Consider how frequently the records are used and accessed. High-demand items may require immediate attention to prevent further damage. Are they essential for research, education, or public access?</li>
                  <li><strong>Legal and Regulatory Requirements:</strong> Identify any legal or regulatory requirements that mandate the preservation of specific records. Compliance with these requirements should take precedence.</li>
                  <li><strong>Availability of Resources:</strong> Assess the availability of financial, human, and technological resources. Prioritize actions that can be accomplished with the available resources.</li>
                  <li><strong>Risk of Loss:</strong> Evaluate the potential consequences of losing the records. Would their loss have a significant impact on the organization or society? Are they irreplaceable?</li>
                  <li><strong>Urgency:</strong> Consider the urgency of the preservation needs. Some items may be in a state of rapid deterioration, demanding immediate action.</li>
                  <li><strong>Interdependence:</strong> Consider if the preservation of one collection will affect the preservation of another collection. Sometimes a single action can affect multiple collections.</li>
                  <li><strong>Community Impact:</strong> Consider the impact the loss of the collections would have on the community.</li>
                  <li><strong>Existing Preservation Policies:</strong> Ensure that the prioritization is in line with the existing preservation policies of the organization.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Preservation Programme */}
            <div
              ref={(el) => {
                sectionRefs.current['programme'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preservation Programme
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A Preservation Programme is a structured and ongoing set of activities, policies, and procedures designed to ensure the long-term protection and accessibility of an organization's records and information. It provides a framework for managing preservation activities, allocating resources, and mitigating risks to valuable materials.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '7 Reasons for Having a Preservation Programme',
                    icon: <ListChecks size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Safeguarding Valuable Assets:</strong> A preservation programme protects an organization's valuable records, including historical documents, research data, and business records, ensuring their continued availability for future use.</li>
                        <li><strong>Ensuring Legal and Regulatory Compliance:</strong> Many organizations are required to retain records for legal and regulatory purposes. A preservation programme helps ensure compliance with these requirements, avoiding potential penalties.</li>
                        <li><strong>Maintaining Organizational Memory:</strong> Preservation programmes help maintain institutional memory by protecting records that document the organization's history, decisions, and activities.</li>
                        <li><strong>Supporting Research and Scholarship:</strong> Preserved records support research and scholarship by providing access to valuable information and data.</li>
                        <li><strong>Minimizing Costs:</strong> Proactive preservation measures can prevent costly remedial conservation treatments and reduce the risk of data loss.</li>
                        <li><strong>Enhancing Public Trust and Reputation:</strong> Demonstrating a commitment to preservation enhances public trust and strengthens the organization's reputation.</li>
                        <li><strong>Risk Mitigation:</strong> A preservation programme identifies and mitigates risks to records, such as environmental factors, physical damage, and technological obsolescence.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Elements That Make Up a Preservation Management Programme',
                    icon: <Layout size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Policy and Planning:</strong> This element includes the development of preservation policies, plans, and procedures that guide preservation activities. It involves setting goals, establishing priorities, and allocating resources.</li>
                        <li><strong>Environmental Control:</strong> This element focuses on maintaining stable and appropriate environmental conditions for records storage, including temperature, humidity, light, and air quality.</li>
                        <li><strong>Storage and Handling:</strong> This element involves implementing proper storage and handling procedures to minimize physical damage to records. It includes the use of archival-quality materials and training staff on safe handling techniques.</li>
                        <li><strong>Disaster Preparedness and Recovery:</strong> This element focuses on developing plans and procedures for responding to disasters, such as floods, fires, and earthquakes. It includes creating disaster recovery plans and conducting drills.</li>
                        <li><strong>Conservation Treatments:</strong> This element involves the physical repair and restoration of damaged records through conservation treatments. It includes cleaning, repairing, and strengthening materials.</li>
                        <li><strong>Digitization and Reformatting:</strong> This element involves converting analog records to digital formats or reformatting deteriorating materials to more stable formats.</li>
                        <li><strong>Training and Education:</strong> This element involves providing training and education to staff and users on preservation best practices. It includes raising awareness about the importance of preservation.</li>
                        <li><strong>Monitoring and Evaluation:</strong> This element involves regularly monitoring and evaluating the effectiveness of preservation activities. It includes conducting audits and assessments to identify areas for improvement.</li>
                        <li><strong>Metadata Management:</strong> The creation and maintenance of metadata to describe the records. This allows for easier location, and contextualization of the records.</li>
                        <li><strong>Security:</strong> This includes steps to prevent unauthorized access to, or theft of the records.</li>
                      </ul>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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

            {/* SECTION 5: Steps in Planning for a Preservation Programme */}
            <div
              ref={(el) => {
                sectionRefs.current['steps'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Steps in Planning for a Preservation Programme
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Planning a preservation programme involves a systematic approach to ensure comprehensive coverage and effective implementation. Here are the numerated steps:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Needs Assessment and Risk Evaluation:</strong> Begin by assessing the current state of your records and information. Identify potential risks, such as environmental hazards, physical damage, and technological obsolescence. This step involves a thorough evaluation of the collection's condition and vulnerabilities.</li>
                  <li><strong>Policy and Goal Setting:</strong> Develop clear and concise preservation policies that align with the organization's mission and goals. Establish specific, measurable, achievable, relevant, and time-bound (SMART) objectives for the preservation programme.</li>
                  <li><strong>Resource Allocation:</strong> Determine the financial, human, and technological resources required to implement the preservation programme. This includes budgeting for equipment, materials, personnel, and training.</li>
                  <li><strong>Prioritization of Collections:</strong> Prioritize collections or individual items based on their value, significance, condition, and risk of loss. This ensures that the most critical materials receive immediate attention.</li>
                  <li><strong>Environmental Control Planning:</strong> Develop a plan for maintaining stable and appropriate environmental conditions, including temperature, humidity, light, and air quality. This may involve upgrading HVAC systems, installing monitoring equipment, and implementing pest management strategies.</li>
                  <li><strong>Storage and Handling Procedures Development:</strong> Establish procedures for the proper storage and handling of records, including the use of archival-quality materials and safe handling techniques.</li>
                  <li><strong>Disaster Preparedness and Recovery Planning:</strong> Create a disaster recovery plan that outlines procedures for responding to emergencies, such as floods, fires, and earthquakes. This includes establishing backup systems and conducting regular drills.</li>
                  <li><strong>Conservation Treatment Planning:</strong> Develop a plan for the conservation treatment of damaged records, including the selection of appropriate techniques and materials. This may involve hiring professional conservators.</li>
                  <li><strong>Digitization and Reformatting Strategy:</strong> Determine which records should be digitized or reformatted for preservation and access. This involves selecting appropriate formats and developing workflows.</li>
                  <li><strong>Training and Education Programme:</strong> Develop and implement training programmes for staff and users on preservation best practices. This includes raising awareness about the importance of preservation and providing hands-on training.</li>
                  <li><strong>Monitoring and Evaluation System:</strong> Establish a system for regularly monitoring and evaluating the effectiveness of the preservation programme. This includes conducting audits, tracking key performance indicators, and gathering feedback.</li>
                  <li><strong>Documentation and Reporting:</strong> Maintain thorough documentation of all preservation activities, including condition assessments, treatment records, and environmental monitoring data. Generate regular reports to track progress and identify areas for improvement.</li>
                  <li><strong>Review and Update:</strong> Schedule regular reviews of the preservation programme to ensure it remains relevant and effective. Update policies, procedures, and plans as needed to reflect changes in technology, regulations, and organizational priorities.</li>
                </ol>
              </div>
            </div>

            {/* SECTION 6: Conducting a Preservation Survey */}
            <div
              ref={(el) => {
                sectionRefs.current['survey'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conducting a Preservation Survey
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A preservation survey is a systematic assessment of the condition of an organization's records and collections to identify preservation needs and prioritize actions. It provides a snapshot of the overall health of the materials and serves as a foundation for developing a comprehensive preservation plan.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Purpose and Scope Definition:</strong> Clearly define the purpose of the survey, whether it's to assess the entire collection or a specific segment. Determine the scope of the survey, including the types of materials, locations, and time frame. This step sets the boundaries for the survey and ensures focused data collection.</li>
                  <li><strong>Survey Team Formation and Training:</strong> Assemble a team of individuals with relevant expertise, such as librarians, archivists, and conservators. Provide thorough training on survey procedures, data collection methods, and the use of survey tools. This ensures consistency and accuracy in data gathering.</li>
                  <li><strong>Development of Survey Tools and Forms:</strong> Create standardized survey forms or digital tools to capture consistent data on the condition of records. Include fields for material type, condition assessment, environmental factors, and storage conditions. This ensures that all surveyors are collecting the same information.</li>
                  <li><strong>Environmental Assessment:</strong> Evaluate the environmental conditions in storage areas, including temperature, humidity, light levels, and air quality. Use monitoring equipment to gather data and identify potential risks. This helps to determine if the environment is contributing to deterioration.</li>
                  <li><strong>Physical Condition Assessment:</strong> Conduct a detailed assessment of the physical condition of records, noting any signs of damage, such as tears, mold, fading, or brittleness. Document the extent and severity of damage. This step provides a clear picture of the physical state of the collection.</li>
                  <li><strong>Storage Assessment:</strong> Evaluate the storage conditions, including the types of storage materials, shelving, and organization. Assess the adequacy of storage conditions for different media formats. This helps to identify any storage-related risks.</li>
                  <li><strong>Data Collection and Documentation:</strong> Collect data systematically, using the standardized survey tools. Document observations with photographs and detailed notes. Ensure accurate and consistent data entry. This step ensures that all data is recorded correctly.</li>
                  <li><strong>Data Analysis and Interpretation:</strong> Analyze the collected data to identify patterns, trends, and areas of concern. Interpret the findings to prioritize preservation actions and allocate resources. This step translates raw data into actionable information.</li>
                  <li><strong>Report Generation and Recommendations:</strong> Generate a comprehensive report summarizing the survey findings and providing recommendations for preservation actions. Include prioritized recommendations, cost estimates, and timelines. This step provides a clear plan for moving forward.</li>
                  <li><strong>Follow-up and Implementation:</strong> Develop an action plan to implement the survey recommendations. Monitor progress and make necessary adjustments. Conduct periodic follow-up surveys to assess the effectiveness of preservation efforts. This step ensures that the survey leads to tangible improvements.</li>
                </ol>
              </div>
            </div>

            {/* SECTION 7: Elements of a Comprehensive Preservation Budget */}
            <div
              ref={(el) => {
                sectionRefs.current['budget'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Elements of a Comprehensive Preservation Budget: Safeguarding Cultural Heritage
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Developing a robust preservation budget is crucial for any institution entrusted with the care of cultural heritage materials. It's not merely a matter of allocating funds, but rather a strategic investment in the long-term survival and accessibility of valuable collections. A comprehensive budget should encompass a wide range of expenses, reflecting the multifaceted nature of preservation work.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Personnel Costs: The Human Foundation of Preservation:</strong> The most significant element of a preservation budget is often personnel costs. This encompasses the salaries and benefits of the dedicated staff who carry out preservation activities. Conservators, archivists, technicians, and other specialists are essential for the proper care and maintenance of collections. These individuals possess specialized knowledge and skills, enabling them to assess the condition of materials, perform conservation treatments, and implement preventive measures. Investing in qualified personnel ensures that preservation work is conducted to the highest standards, safeguarding the integrity of the collections. Furthermore, ongoing professional development is vital to keep staff abreast of the latest preservation techniques and technologies. Adequate staffing levels are also crucial to keep up with the demands of a living collection.</li>
                  <li><strong>Conservation Treatment Costs: Restoring and Stabilizing Materials:</strong> Conservation treatment costs cover the expenses associated with the physical repair and stabilization of damaged or deteriorating materials. This includes professional cleaning, repairing, and strengthening of artifacts, documents, and other items. Conservation treatments are often performed by highly skilled conservators who specialize in specific materials or techniques. These treatments can be costly, especially for complex or fragile items. However, they are essential for preserving the long-term integrity and usability of collections. A well-planned budget will allocate sufficient funds for both routine maintenance and specialized treatments. This also includes the cost of the specialized materials needed to perform the conservation treatments.</li>
                  <li><strong>Environmental Control Costs: Creating a Stable Preservation Environment:</strong> Maintaining stable environmental conditions is fundamental to the preservation of cultural heritage materials. Fluctuations in temperature, humidity, and light can accelerate deterioration and damage collections. Environmental control costs encompass the expenses associated with maintaining optimal environmental conditions, including HVAC system maintenance, environmental monitoring equipment, and energy costs. Regular monitoring and maintenance are essential to ensure that environmental conditions remain within acceptable ranges. This includes the cost of replacement filters, or the calibration of monitoring equipment. Energy costs can also be a significant factor, particularly for large storage facilities.</li>
                  <li><strong>Storage Materials Costs: Providing Archival-Quality Protection:</strong> Archival-quality storage materials are essential for protecting collections from physical damage and environmental factors. This includes acid-free boxes, folders, sleeves, and other enclosures. Storage materials costs cover the expenses associated with purchasing and maintaining these materials. Selecting appropriate storage materials is crucial for ensuring the long-term preservation of collections. This includes finding the right size, shape, and material for the item that is being stored.</li>
                  <li><strong>Digitization and Reformatting Costs: Expanding Access and Ensuring Preservation:</strong> Digitization and reformatting are increasingly important preservation strategies. Digitization involves creating digital copies of analog materials, while reformatting involves transferring information from one format to another. These processes can enhance access to collections, reduce handling of fragile originals, and ensure long-term preservation. Digitization and reformatting costs cover the expenses associated with equipment, software, and services. This may include the purchase of scanners, cameras, and other digitization equipment, as well as the cost of outsourcing digitization projects.</li>
                  <li><strong>Disaster Preparedness and Recovery Costs: Mitigating Risks and Ensuring Resilience:</strong> Disaster preparedness and recovery are essential components of a comprehensive preservation program. Disaster recovery costs cover the expenses associated with developing and implementing disaster recovery plans, maintaining backup systems, and acquiring emergency supplies. This includes the cost of fire suppression systems, water damage mitigation equipment, and emergency response training. A well-prepared institution can minimize the impact of disasters and ensure the rapid recovery of its collections.</li>
                  <li><strong>Training and Education Costs: Empowering Staff and Users:</strong> Training and education are crucial for ensuring that staff and users understand and implement best practices in preservation. Training and education costs cover the expenses associated with staff training, workshops, and educational materials. This includes training on handling and storing materials, implementing preventive measures, and responding to emergencies. Investing in training and education enhances the overall preservation capacity of the institution.</li>
                  <li><strong>Equipment and Supplies Costs: Maintaining a Well-Equipped Preservation Lab:</strong> Preservation equipment and supplies are essential for conducting preservation activities. This includes monitoring devices, cleaning supplies, tools, and other equipment. Equipment and supplies costs cover the expenses associated with purchasing and maintaining these items. Regular maintenance and calibration of equipment are crucial for ensuring accurate and reliable results.</li>
                  <li><strong>Facilities Costs: Maintaining a Suitable Preservation Environment:</strong> Facilities costs cover the expenses associated with maintaining preservation storage facilities. This includes rent, utilities, and maintenance. Adequate storage space and environmental controls are essential for the long-term preservation of collections.</li>
                  <li><strong>Travel and Conference Costs: Staying Current with Preservation Practices:</strong> Travel and conference costs cover the expenses associated with staff travel to conferences and workshops for professional development. Attending conferences and workshops allows staff to stay current with the latest preservation techniques, technologies, and best practices.</li>
                  <li><strong>Contingency Funds: Preparing for the Unexpected:</strong> Contingency funds are essential for addressing unexpected preservation needs or emergencies. This includes unexpected repairs, emergency conservation treatments, and disaster recovery efforts. Setting aside a contingency fund ensures that the institution is prepared to handle unforeseen circumstances.</li>
                  <li><strong>External Services: Leveraging Specialized Expertise:</strong> External services costs cover the expenses associated with hiring external consultants or service providers. This may include specialized conservation treatments, digitization projects, or disaster recovery services. Leveraging external expertise can enhance the institution's preservation capacity and ensure that specialized tasks are performed to the highest standards.</li>
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
                  💡 Planning Insight
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
                  <span>Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Planning Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">13</span>
                </li>
                <li className="flex justify-between">
                  <span>Budget Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Preservation planning is a systematic process covering risk assessment, preventive and remedial conservation, disaster preparedness, and resource allocation. It ensures long-term access, protects cultural heritage, and maintains organisational memory. Prioritise actions based on value, condition, use, legal requirements, and urgency. A preservation programme includes policy, environment, handling, disaster plans, conservation, digitisation, training, and monitoring. Planning follows 13 steps from needs assessment to review. A comprehensive budget covers personnel, treatments, environmental control, storage, digitisation, disaster preparedness, training, equipment, facilities, contingency, and external services.
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
                <strong className="text-white">Preservation Planning</strong> – Systematic process of risk assessment, preventive and remedial conservation, disaster preparedness, and resource allocation to ensure long-term access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Significance</strong> – Protects cultural heritage, maintains organisational memory, ensures legal compliance, and supports research and public access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prioritisation</strong> – Consider value, condition, frequency of use, legal requirements, resources, risk of loss, urgency, and community impact.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation Programme</strong> – Includes policy, environmental control, storage and handling, disaster preparedness, conservation, digitisation, training, monitoring, metadata, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Planning Steps</strong> – 13 steps from needs assessment and policy setting to implementation, monitoring, and periodic review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Budget Elements</strong> – Personnel, treatments, environmental control, storage materials, digitisation, disaster preparedness, training, equipment, facilities, contingency, and external services.
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
            Sidemann Academic Registry • Preservation Planning &amp; Programme Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;