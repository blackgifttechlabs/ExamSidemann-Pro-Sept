import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  Layout,
  Edit,
  Target,
  Shield,
  ListChecks,
  Type,
  BookOpen,
  Book,
  Focus,
  Minimize,
  FileText,
  Scissors,
  Archive,
  Database,
  User,
  Calendar,
  CheckCircle,
  Send,
  ShieldCheck,
  Bell,
  RefreshCw,
  File,
  Folder,
  Clipboard,
  Mail,
  Lock,
  Eye,
  AlertCircle,
  Trash2,
  Cloud,
  Server,
  HardDrive,
  Disc,
  Box,
  Home,
  Warehouse,
  Zap,
  MapPin,
  DollarSign,
  Sun,
  FireExtinguisher,
  Bug,
  Users,
  Phone,
  MessageSquare,
  Headphones,
  Award,
  Briefcase,
  Clock,
  Coffee,
  ThumbsUp,
  HelpCircle,
  AlertTriangle,
  Mic,
  Video,
  Camera,
  Share2,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  BarChart,
  PieChart,
  Inbox,
  SendToBack,
  Package,
  Stamp,
  Truck,
  Bookmark,
  FileCheck,
  FileSearch,
  FileWarning,
  FileX,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Handshake,
  Heart,
  Star,
  Gem,
  Crown,
  Building,
  DoorOpen,
  Sofa,
  Paintbrush,
  Sparkles as SparklesIcon,
  Sparkle,
  Utensils,
  CupSoda,
  Cookie,
  Apple,
  Wine,
  PhoneForwarded,
  PhoneOff,
  Voicemail,
  Headset,
  BadgeCheck,
  Trophy,
  Medal,
  Microscope,
  FlaskRound,
  Beaker,
  TestTube,
  Thermometer,
  Droplet,
  Lightbulb,
  Fan,
  Wrench,
  Hammer,
  Drill,
  Recycle,
  Leaf,
  Flower,
  BookMarked,
  Library,
  PanelTop,
  Scan,
  Fingerprint,
  KeyRound,
  Siren,
  Flame,
  Waves,
  Copy,
  Film,
  Search as SearchIcon,
  Clock as ClockIcon,
  HardDrive as HardDriveIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Circle as CircleIcon,
  Scissors as ScissorsIcon,
  Award as AwardIcon,
  Globe as Twitter,
  Camera as Instagram,
  Briefcase as Linkedin,
  Share2 as Facebook,
  Video as Youtube,
  Scissors as Comb,
  User as Shirt,
  MapPin as Shoe,
  Wrench as Saw,
  Leaf as Tree,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'types', label: 'Disaster Types' },
  { id: 'effects', label: 'Effects on Records' },
  { id: 'phases', label: 'Planning Phases' },
  { id: 'components', label: 'Plan Components' },
  { id: 'significance', label: 'Significance' },
  { id: 'mitigation', label: 'Mitigation Measures' },
  { id: 'dmc', label: 'DMC Roles' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'evaluation', label: 'Plan Evaluation' },
  { id: 'priority', label: 'Priority Lists' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'training', label: 'Training' },
  { id: 'recovery', label: 'Disaster Recovery' },
  { id: 'salvage', label: 'Salvage Protocols' },
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
        text: 'The 1966 Florence flood devastated the National Library of Florence, damaging over 1.3 million items and sparking the modern disaster planning movement in archives.',
      },
      {
        title: 'Pro Tip',
        text: 'Always prioritise staff safety over collection salvage – human life is irreplaceable, while many materials can be restored or are insured.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six phases of disaster planning with "R-P-P-R-R-E": Risk Assessment, Prevention, Preparedness, Response, Recovery, Evaluation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions create a disaster plan but never test it with drills – a plan that isn\'t practiced is almost useless when a real disaster strikes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The 1966 Florence flood devastated the National Library of Florence, damaging over 1.3 million items and sparking the modern disaster planning movement in archives.',
      },
      {
        title: 'Pro Tip',
        text: 'Always prioritise staff safety over collection salvage – human life is irreplaceable, while many materials can be restored or are insured.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six phases of disaster planning with "R-P-P-R-R-E": Risk Assessment, Prevention, Preparedness, Response, Recovery, Evaluation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions create a disaster plan but never test it with drills – a plan that isn\'t practiced is almost useless when a real disaster strikes.',
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
            Disaster Planning, Recovery &{' '}
            <span className="text-amber-300 font-bold italic">
              Salvage Protocols
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to disaster types, effects, planning phases, plan components, mitigation, recovery, salvage protocols, and awareness.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Siren size={14} className="inline mr-1" /> Disaster
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Recovery
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Salvage
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
                placeholder="Search for a concept, phase, protocol..."
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
            {/* SECTION 1: Types of Disasters */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Disasters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Natural Disasters: The Unpredictable Forces of Nature',
                    icon: <Waves size={16} />,
                    content: 'Natural disasters are events caused by the Earth\'s natural processes, often with little or no warning. These include earthquakes, floods, hurricanes, tornadoes, wildfires, and volcanic eruptions. Earthquakes can cause structural damage to buildings, leading to the collapse of storage facilities and the destruction of records. Floods can inundate archives, soaking materials and promoting mold growth. Hurricanes and tornadoes can cause widespread damage from wind, rain, and debris, scattering and destroying collections. Wildfires can incinerate records and archives, leaving behind only ashes. Volcanic eruptions can blanket areas with ash and debris, contaminating and damaging materials. These events are often unpredictable and can have catastrophic consequences, making disaster preparedness and mitigation crucial for protecting valuable records.',
                  },
                  {
                    title: '2. Technological Disasters: The Failures of Human Systems',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Technological disasters are events caused by failures in human-made systems or technologies. These include fires caused by electrical faults, explosions from gas leaks, chemical spills, and cyberattacks. Fires, even small ones, can quickly spread and destroy records and archives. Explosions can cause significant structural damage and scatter materials. Chemical spills can contaminate and damage records, making them unusable. Cyberattacks can compromise digital records, leading to data loss, corruption, or unauthorized access. These disasters can be caused by human error, negligence, or equipment malfunction. The increasing reliance on digital technologies makes cyberattacks a growing concern for archival institutions. Preventive measures, such as regular maintenance of equipment, fire suppression systems, and cybersecurity protocols, are essential for mitigating the risks of technological disasters.',
                  },
                  {
                    title: '3. Human-Caused Disasters: The Intentional and Unintentional Acts',
                    icon: <Users size={16} />,
                    content: 'Human-caused disasters are events caused by intentional or unintentional human actions. These include acts of terrorism, vandalism, theft, and war. Acts of terrorism can target cultural institutions and archives, aiming to destroy valuable records and cultural heritage. Vandalism and theft can result in the loss or damage of irreplaceable materials. War can cause widespread destruction of buildings and infrastructure, leading to the loss of records and archives. Unintentional human actions, such as improper handling or storage of records, can also lead to damage and deterioration. These disasters can be motivated by political, ideological, or personal reasons. Security measures, such as access control, surveillance systems, and emergency response plans, are crucial for protecting records from human-caused threats.',
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

            {/* SECTION 2: Effects of Disasters on Records and Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['effects'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Effects of Disasters on Records and Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Physical Damage: The Tangible Loss of Materials',
                    icon: <AlertTriangle size={16} />,
                    content: 'Disasters can cause significant physical damage to record and archives, including tearing, crushing, soaking, and burning. Water damage from floods or leaks can cause paper to swell, inks to run, and photographs to stick together. Fire can incinerate materials, leaving behind only ashes. Debris from explosions or structural collapses can crush and tear records. Physical damage can render records unusable, leading to the loss of valuable information and cultural heritage. Salvage and restoration efforts can be time-consuming and expensive, and some materials may be irreparable.',
                  },
                  {
                    title: '2. Data Loss and Corruption: The Vulnerability of Digital Records',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Digital records are particularly vulnerable to data loss and corruption during disasters. Power outages, hardware failures, and cyberattacks can result in the loss of digital files. Water damage and fire can destroy electronic storage media, such as hard drives and servers. Data corruption can render digital files unreadable or unusable. Cloud storage and backup systems can help mitigate data loss, but they are not fool proof. Archivists must implement robust data backup and recovery plans to ensure the long-term preservation of digital records.',
                  },
                  {
                    title: '3. Contamination: The Threat of Mold, Chemicals, and Debris',
                    icon: <AlertCircle size={16} />,
                    content: 'Disasters can contaminate records with mold, chemicals, and debris. Water damage can promote mold growth, which can cause irreversible damage to paper and other organic materials. Chemical spills can contaminate records with harmful substances, making them hazardous to handle. Debris from explosions or structural collapses can contaminate records with dust, dirt, and other pollutants. Contamination can pose health risks to archivists and users, and it can make salvage and restoration efforts more difficult. Proper cleaning and decontamination procedures are essential for protecting records and ensuring their safety.',
                  },
                  {
                    title: '4. Loss of Context and Provenance: The Disruption of Information',
                    icon: <LayersIcon size={16} />,
                    content: 'Disasters can disrupt the context and provenance of records, making it difficult to understand their meaning and significance. Physical damage can scatter records, making it challenging to reconstruct their original order and arrangement. Data loss and corruption can erase metadata, which provides essential information about the creation and use of records. Loss of context and provenance can diminish the research value of records and hinder their interpretation. Archivists must document the original context and provenance of records and develop strategies for reconstructing lost information.',
                  },
                  {
                    title: '5. Disruption of Access and Services: The Interruption of Operations',
                    icon: <ClockIcon size={16} />,
                    content: 'Disasters can disrupt access to records and archives, hindering research and other activities. Damage to buildings and infrastructure can force institutions to close temporarily or permanently. Data loss and corruption can make digital records inaccessible. Disruption of access can have significant consequences for researchers, historians, and the public. Archivists must develop disaster recovery plans that address the restoration of access and services.',
                  },
                  {
                    title: '6. Psychological Impact: The Emotional Toll on Staff and Users',
                    icon: <Heart size={16} />,
                    content: 'Disasters can have a significant psychological impact on archivists, staff, and users. The loss of valuable records and cultural heritage can be emotionally distressing. The disruption of operations and the challenges of salvage and restoration can be overwhelming. Archivists must provide support and resources for staff and users during and after disasters. This includes offering counselling, training, and other forms of assistance.',
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

            {/* SECTION 3: Phases/Stages in Disaster Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['phases'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Phases/Stages in Disaster Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Disaster planning is a crucial process for any institution responsible for preserving records and archives. It involves a series of phases or stages designed to mitigate the impact of disasters and ensure the continuity of operations. Here is a breakdown of these stages:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Risk Assessment: Identifying Potential Threats and Vulnerabilities',
                    icon: <Target size={16} />,
                    content: 'The initial phase of disaster planning involves a thorough risk assessment. This stage aims to identify potential threats that could affect the institution, such as natural disasters, technological failures, or human-caused incidents. It also involves assessing the vulnerabilities of the institution\'s facilities, collections, and staff. This includes evaluating the structural integrity of buildings, the condition of storage environments, and the adequacy of security measures. The risk assessment should consider the likelihood and potential impact of each identified threat. This involves analysing historical data, consulting with experts, and conducting site visits. The results of the risk assessment will inform the development of subsequent stages of the disaster plan. It is crucial to be as thorough as possible, since overlooked risks can lead to serious consequences during a real disaster.',
                  },
                  {
                    title: '2. Prevention and Mitigation: Taking Proactive Measures to Reduce Risks',
                    icon: <ShieldCheck size={16} />,
                    content: 'Based on the risk assessment, the next phase involves implementing preventive and mitigative measures to reduce the likelihood and impact of potential disasters. This may include installing fire suppression systems, upgrading security measures, improving storage conditions, and implementing data backup and recovery plans. It also involves training staff in disaster preparedness and response procedures. Preventive measures aim to eliminate or minimize the causes of disasters, while mitigative measures aim to reduce the severity of their consequences. For example, installing water detectors and automatic shut-off valves can prevent water damage from leaks. Regular maintenance of equipment and facilities can reduce the risk of technological failures. Implementing cybersecurity protocols can protect digital records from cyberattacks. This phase requires a proactive approach and a commitment to ongoing maintenance and improvement.',
                  },
                  {
                    title: '3. Preparedness: Developing a Comprehensive Disaster Response Plan',
                    icon: <ListChecks size={16} />,
                    content: 'The preparedness phase involves developing a comprehensive disaster response plan that outlines the steps to be taken during and immediately after a disaster. This plan should include procedures for evacuating staff and collections, salvaging damaged materials, and restoring operations. It should also include contact information for emergency services, insurance providers, and other relevant organizations. The disaster response plan should be tailored to the specific needs of the institution and should be regularly updated and tested. This involves conducting drills and simulations to ensure that staff are familiar with the procedures and that the plan is effective. Preparedness also involves assembling emergency supplies, such as first-aid kits, flashlights, and protective gear. Clear communication protocols are essential for coordinating response efforts and keeping staff informed.',
                  },
                  {
                    title: '4. Response: Implementing the Plan During a Disaster',
                    icon: <Send size={16} />,
                    content: 'The response phase involves implementing the disaster response plan during a disaster. This requires quick and decisive action to protect staff, collections, and facilities. The priority is to ensure the safety of staff and to minimize damage to records and archives. This may involve evacuating buildings, salvaging materials, and documenting damage. The response phase requires clear communication, coordination, and leadership. It also requires flexibility and adaptability, as unexpected situations may arise. Documentation is critical, as it aids in insurance claims and recovery efforts.',
                  },
                  {
                    title: '5. Recovery: Restoring Operations and Salvaging Damaged Materials',
                    icon: <RefreshCw size={16} />,
                    content: 'The recovery phase involves restoring operations and salvaging damaged materials after a disaster. This may include cleaning and drying wet records, repairing damaged buildings, and restoring digital data. The recovery phase requires careful planning and coordination to ensure that materials are salvaged and restored properly. This may involve hiring specialized conservators and restoration experts. The recovery phase also involves assessing the damage and developing a plan for long-term restoration. This may include replacing damaged equipment, rebuilding storage facilities, and updating disaster preparedness plans. It is also important to address the mental health of staff since they may have experienced traumatic events.',
                  },
                  {
                    title: '6. Evaluation and Revision: Learning from Experience and Improving the Plan',
                    icon: <Clipboard size={16} />,
                    content: 'The final phase involves evaluating the effectiveness of the disaster response plan and revising it as needed. This involves reviewing the actions taken during the disaster, assessing the damage, and identifying areas for improvement. This phase is crucial for learning from experience and ensuring that the disaster plan is effective for future events. It also involves updating the disaster plan to reflect changes in technology, staffing, and facilities. Regular evaluation and revision are essential for maintaining a robust and effective disaster preparedness program. This process should be ongoing because threats and vulnerabilities evolve over time.',
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

            {/* SECTION 4: Components of a Disaster Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of a Disaster Plan
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A comprehensive disaster plan is essential for any institution safeguarding records and archives. It should be a well-structured document, covering all aspects of disaster preparedness, response, and recovery. Here is a breakdown of the key components:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Emergency Contact Information: Quick Access to Critical Personnel',
                    icon: <Phone size={16} />,
                    content: 'This section provides a comprehensive list of contact information for key personnel, emergency services, and relevant organizations. It should include names, phone numbers (both office and mobile), email addresses, and alternative contact methods. This section should be easily accessible and updated regularly. It is crucial to include contact information for staff members responsible for various aspects of the disaster plan, such as building security, IT support, and collections management. Emergency services contacts, including fire departments, police, and medical personnel, should also be listed. External contacts, such as insurance providers, conservators, and restoration experts, should be included as well. A clear chain of command and communication protocols should be established to ensure that everyone knows who to contact and what information to provide.',
                  },
                  {
                    title: '2. Evacuation Procedures: Ensuring Staff and Collection Safety',
                    icon: <DoorOpen size={16} />,
                    content: 'This section outlines the procedures for safely evacuating staff and collections in the event of a disaster. It should include clear instructions on evacuation routes, assembly points, and emergency exits. Maps of the building and surrounding area should be included, highlighting evacuation routes and safety zones. The plan should specify procedures for securing collections during evacuation, such as covering materials with protective sheets or moving them to safe locations. It should also include procedures for accounting for all staff members and ensuring that no one is left behind. Regular evacuation drills should be conducted to familiarize staff with the procedures and to identify any potential problems. This section should be tailored to the specific layout and characteristics of the institution\'s facilities.',
                  },
                  {
                    title: '3. Salvage and Recovery Procedures: Minimizing Damage and Restoring Materials',
                    icon: <Package size={16} />,
                    content: 'This section provides detailed procedures for salvaging and recovering damaged materials after a disaster. It should include instructions on how to handle different types of materials, such as paper, photographs, and electronic media, to minimize further damage. It should also include information on appropriate cleaning and drying techniques, as well as contact information for specialized conservators and restoration experts. This section should be prioritized towards the most valuable and at-risk materials. It is important to note what materials can be saved, and what materials are a loss. The plan should include procedures for documenting the damage and the salvage process, which is essential for insurance claims and restoration efforts. It should also outline procedures for prioritizing and triaging materials for salvage, based on their value and condition.',
                  },
                  {
                    title: '4. Data Backup and Recovery: Safeguarding Digital Assets',
                    icon: <Cloud size={16} />,
                    content: 'This section addresses the procedures for backing up and recovering digital data in the event of a disaster. It should include information on backup schedules, storage locations, and recovery procedures. It should also include instructions on how to restore data from backups and how to verify the integrity of restored files. This section is vital since digital data is often the lifeblood of modern archives and records management. Off-site backups and cloud storage solutions should be considered to protect against data loss from local disasters. Regular testing of backup and recovery procedures is essential to ensure that they are effective. The plan should also include procedures for recovering from cyberattacks and other digital security breaches.',
                  },
                  {
                    title: '5. Communication Plan: Maintaining Information Flow',
                    icon: <MessageSquare size={16} />,
                    content: 'This section outlines the procedures for communicating with staff, users, and the public during and after a disaster. It should include information on how to disseminate information, such as through email, phone calls, or social media. It should also include procedures for communicating with the media and handling public inquiries. This section is critical for maintaining clear and consistent communication during a crisis. It should include procedures for establishing a communication centre and for designating spokespersons. It should also include procedures for communicating with external stakeholders, such as donors, researchers, and government agencies.',
                  },
                  {
                    title: '6. Insurance Information: Securing Financial Protection',
                    icon: <DollarSign size={16} />,
                    content: 'This section provides information on the institution\'s insurance policies, including coverage details, contact information for insurance providers, and procedures for filing claims. It is crucial to have adequate insurance coverage to protect against financial losses from disasters. This section should include copies of insurance policies and a list of covered items. The plan should also include procedures for documenting damage and losses, which is essential for filing insurance claims. Regular reviews of insurance coverage are essential to ensure that it remains adequate.',
                  },
                  {
                    title: '7. Training and Drills: Ensuring Staff Preparedness',
                    icon: <Users size={16} />,
                    content: 'This section outlines the procedures for training staff in disaster preparedness and response. It should include information on regular training sessions, drills, and simulations. It should also include procedures for documenting training activities and for evaluating the effectiveness of training programs. Regular training is essential for ensuring that staff are familiar with the disaster plan and that they can respond effectively in a crisis. This section should include procedures for training new staff members and for providing refresher training for existing staff.',
                  },
                  {
                    title: '8. Plan Review and Updates: Maintaining Relevance and Effectiveness',
                    icon: <RefreshCw size={16} />,
                    content: 'This section outlines the procedures for reviewing and updating the disaster plan. It should include information on how often the plan will be reviewed and who is responsible for updating it. This section is critical for ensuring that the disaster plan remains relevant and effective. Regular reviews should be conducted to reflect changes in technology, staffing, and facilities. The plan should also be updated after each disaster or drill to incorporate lessons learned. This section should include procedures for documenting changes to the plan and for distributing updated versions.',
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

            {/* SECTION 5: Significance of Disaster Planning */}
            <div
              ref={(el) => {
                sectionRefs.current['significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of Disaster Planning
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Disaster planning is not merely a precautionary measure for archives and record-keeping institutions; it is a fundamental necessity that ensures the preservation of cultural heritage, continuity of operations, and the safety of personnel. Here is a look at the significance of having a robust disaster plan:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Protection of Irreplaceable Assets: Safeguarding Cultural and Historical Heritage',
                    icon: <AwardIcon size={16} />,
                    content: 'Archives and records often contain irreplaceable materials that document history, culture, and scientific advancements. Disasters can destroy these assets in moments, leading to the permanent loss of invaluable information. Disaster planning aims to mitigate this risk by establishing procedures for protecting and salvaging materials. By having a well-defined plan, institutions can prioritize the most valuable and at-risk items for protection and recovery. This includes identifying safe storage areas, implementing preventive measures like fire suppression and water detection systems, and outlining salvage procedures for damaged materials. The significance lies in preserving the collective memory of humanity, ensuring that future generations have access to their past.',
                  },
                  {
                    title: '2. Ensuring Continuity of Operations: Maintaining Essential Services',
                    icon: <Zap size={16} />,
                    content: 'Disasters can disrupt an institution\'s operations, hindering its ability to provide essential services to users and stakeholders. For government archives, this could mean the loss of vital records needed for legal or administrative functions. For research institutions, it could mean the interruption of crucial research projects. Disaster planning aims to minimize this disruption by establishing procedures for restoring operations as quickly and efficiently as possible. This includes having backup systems for digital data, alternative workspaces for staff, and communication protocols for keeping users informed. The significance lies in ensuring that institutions can continue to fulfil their mission, even in the face of adversity.',
                  },
                  {
                    title: '3. Minimizing Financial Losses: Reducing the Economic Impact of Disasters',
                    icon: <DollarSign size={16} />,
                    content: 'Disasters can result in significant financial losses, including damage to buildings, equipment, and collections. Salvage and restoration efforts can be costly, and the loss of digital data can require substantial investment in recovery. Disaster planning aims to minimize these financial losses by implementing preventive measures and developing strategies for rapid recovery. This includes having adequate insurance coverage, establishing contingency funds, and documenting the value of collections. The significance lies in protecting the institution\'s financial stability and ensuring that it can recover from a disaster without incurring crippling losses.',
                  },
                  {
                    title: '4. Protecting Human Life and Safety: Prioritizing the Well-Being of Staff and Users',
                    icon: <Shield size={16} />,
                    content: 'The most significant aspect of disaster planning is protecting human life and safety. Disasters can pose serious risks to staff and users, including injuries from building collapses, exposure to hazardous materials, and psychological trauma. Disaster planning aims to minimize these risks by establishing clear evacuation procedures, providing safety training, and ensuring that emergency services are readily available. The significance lies in prioritizing the well-being of individuals and ensuring that they can safely navigate a disaster.',
                  },
                  {
                    title: '5. Facilitating Effective Response and Recovery: Streamlining Post-Disaster Actions',
                    icon: <Target size={16} />,
                    content: 'A well-developed disaster plan provides a framework for coordinating response and recovery efforts. It outlines clear roles and responsibilities, establishes communication protocols, and provides step-by-step instructions for salvaging materials and restoring operations. This streamlined approach helps minimize confusion and delays, ensuring that resources are used efficiently. The significance lies in enabling a swift and effective response, minimizing damage, and accelerating the recovery process.',
                  },
                  {
                    title: '6. Enhancing Public Trust and Confidence: Demonstrating Institutional Responsibility',
                    icon: <Users size={16} />,
                    content: 'Institutions that have a robust disaster plan demonstrate their commitment to responsible stewardship and accountability. This enhances public trust and confidence, assuring users and stakeholders that their valuable assets are protected. In the aftermath of a disaster, a well-executed plan can help maintain the institution\'s reputation and credibility. The significance lies in building and maintaining strong relationships with the community and ensuring that the institution is seen as a reliable and responsible custodian of its collections.',
                  },
                  {
                    title: '7. Legal and Regulatory Compliance: Meeting Mandated Requirements',
                    icon: <Clipboard size={16} />,
                    content: 'Many institutions are subject to legal and regulatory requirements related to disaster preparedness and response. Government agencies, for example, may be required to have disaster plans in place to ensure the continuity of essential services. Failure to comply with these requirements can result in penalties and legal liabilities. Disaster planning aims to ensure that institutions meet their legal and regulatory obligations. The significance lies in avoiding legal complications and ensuring that the institution operates within the bounds of the law.',
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

            {/* SECTION 6: Measures in Mitigating Disasters */}
            <div
              ref={(el) => {
                sectionRefs.current['mitigation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Measures in Mitigating Disasters
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Mitigating disasters involves taking proactive steps to reduce their impact on records, archives, and the institutions that house them. These measures encompass a range of strategies, from preventative actions to post-disaster recovery planning. Here is a breakdown of key mitigation measures:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Building and Infrastructure Protection: Fortifying Physical Spaces',
                    icon: <Building size={16} />,
                    content: 'One of the first lines of defence against disasters is ensuring that buildings and infrastructure are robust. This involves structural modifications to withstand potential hazards. For example, in earthquake-prone areas, buildings should be reinforced with seismic bracing. In flood-prone areas, buildings should be elevated or waterproofed. Fire suppression systems, such as sprinklers and smoke detectors, should be installed and regularly inspected. Climate control systems, including HVAC, should be maintained to regulate temperature and humidity, minimizing environmental risks. Secure storage areas, with sturdy shelving and protective enclosures, should be used for valuable records. Regular maintenance of electrical systems and plumbing can prevent technological disasters like fires or water leaks. This proactive approach strengthens the physical environment, reducing the potential for damage during a disaster.',
                  },
                  {
                    title: '2. Collection Management and Storage: Safeguarding Materials Directly',
                    icon: <Archive size={16} />,
                    content: 'Proper collection management and storage techniques play a vital role in mitigating disaster damage. This involves using archival-quality materials, such as acid-free boxes and folders, to protect records from deterioration. Records should be stored in stable environments with controlled temperature and humidity. Fragile materials should be stored in protective enclosures and handled with care. Digital records should be backed up regularly and stored in multiple locations, including off-site and cloud storage. A thorough inventory of collections is essential for tracking materials and assessing damage after a disaster. Implementing a system of regular inspections can help identify and address potential problems before they escalate. This proactive approach to collection management and storage minimizes the risk of damage and facilitates recovery efforts.',
                  },
                  {
                    title: '3. Digital Preservation Strategies: Ensuring the Longevity of Digital Assets',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Digital records require specialized preservation strategies to mitigate the risks of data loss and corruption. This involves implementing robust data backup and recovery plans, including off-site and cloud backups. Digital files should be stored in multiple formats and on multiple media to prevent obsolescence. Metadata should be carefully managed to ensure the context and provenance of digital records. Cybersecurity measures, such as firewalls and antivirus software, should be implemented to protect against cyberattacks. Regular testing of data recovery procedures is essential to ensure their effectiveness. Digital preservation planning should be integrated into the institution\'s overall disaster preparedness strategy. This proactive approach ensures that digital assets remain accessible and usable, even after a disaster.',
                  },
                  {
                    title: '4. Emergency Response Planning: Preparing for Immediate Action',
                    icon: <Send size={16} />,
                    content: 'A well-developed emergency response plan is crucial for mitigating the impact of disasters. This plan should outline clear procedures for evacuating staff and collections, salvaging damaged materials, and restoring operations. It should also include contact information for emergency services, insurance providers, and restoration experts. Staff should be trained in emergency response procedures, and regular drills should be conducted to test the plan\'s effectiveness. The plan should be tailored to the specific needs of the institution and should be regularly updated and revised. A clear communication plan is essential for coordinating response efforts and keeping stakeholders informed. This proactive approach ensures that the institution can respond quickly and effectively to a disaster, minimizing damage and facilitating recovery.',
                  },
                  {
                    title: '5. Insurance and Financial Planning: Securing Resources for Recovery',
                    icon: <DollarSign size={16} />,
                    content: 'Adequate insurance coverage is essential for mitigating the financial impact of disasters. This involves insuring buildings, collections, and equipment against potential losses. The insurance policy should cover the full replacement value of the assets, including the cost of salvage and restoration. A contingency fund should be established to cover unexpected expenses during a disaster. Financial planning should also include strategies for accessing emergency funding and grants. This proactive approach ensures that the institution has the financial resources to recover from a disaster and restore its operations.',
                  },
                  {
                    title: '6. Community Collaboration and Resource Sharing: Building Support Networks',
                    icon: <Handshake size={16} />,
                    content: 'Building strong relationships with other institutions and organizations can enhance disaster mitigation efforts. This involves participating in regional and national networks for disaster preparedness and response. Sharing resources, such as equipment and expertise, can help institutions recover more quickly from a disaster. Collaborating with local emergency services and community organizations can improve coordination and communication. This proactive approach builds a support network that can help during and after a disaster, enhancing the institution\'s resilience.',
                  },
                  {
                    title: '7. Staff Training and Education: Empowering Personnel',
                    icon: <Users size={16} />,
                    content: 'Staff training and education are crucial for effective disaster mitigation. All staff members should be trained in emergency response procedures, including evacuation, first aid, and salvage techniques. Regular training sessions and drills should be conducted to reinforce these skills. Staff should also be educated about the potential risks and vulnerabilities of the institution\'s collections. This proactive approach empowers staff to take appropriate actions during a disaster, minimizing damage and ensuring the safety of personnel and collections.',
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

            {/* SECTION 7: Roles and Responsibilities of DMC */}
            <div
              ref={(el) => {
                sectionRefs.current['dmc'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Roles and Responsibilities of Disaster Management Committee (DMC)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A Disaster Management Committee (DMC) is a critical component of any institution's disaster preparedness and response strategy. It is responsible for coordinating and implementing actions to mitigate the impact of disasters on records, archives, and personnel. Here is a breakdown of the key roles and responsibilities of a DMC:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Developing and Maintaining the Disaster Plan: Creating a Comprehensive Framework',
                    icon: <Clipboard size={16} />,
                    content: 'The DMC is primarily responsible for creating, documenting, and regularly updating the institution\'s disaster plan. This involves conducting risk assessments, identifying potential hazards, and developing strategies for prevention, preparedness, response, and recovery. The plan should be comprehensive, covering all aspects of disaster management, from evacuation procedures to data recovery. The DMC must ensure that the plan is tailored to the specific needs of the institution and that it complies with relevant laws and regulations. Regular reviews and revisions are essential to keep the plan up to date with changes in technology, staffing, and facilities. This responsibility ensures that the institution has a well-defined framework for managing disasters and minimizing their impact.',
                  },
                  {
                    title: '2. Conducting Risk Assessments and Identifying Vulnerabilities: Proactive Threat Analysis',
                    icon: <Target size={16} />,
                    content: 'The DMC plays a crucial role in conducting thorough risk assessments to identify potential hazards and vulnerabilities. This involves analysing the institution\'s physical infrastructure, collections, and digital assets. It also involves considering external factors, such as natural disasters and human-caused incidents. The DMC must assess the likelihood and potential impact of each identified risk and prioritize mitigation efforts accordingly. This proactive approach allows the institution to anticipate potential threats and take steps to prevent or minimize their impact. Identifying vulnerabilities, such as inadequate fire suppression systems or outdated data backup procedures, helps the DMC focus its resources on the most critical areas.',
                  },
                  {
                    title: '3. Coordinating Emergency Response: Leading During a Crisis',
                    icon: <Send size={16} />,
                    content: 'During a disaster, the DMC takes the lead in coordinating the institution\'s emergency response. This involves activating the disaster plan, communicating with staff and emergency services, and overseeing evacuation and salvage operations. The DMC must ensure that all staff members are aware of their roles and responsibilities during a crisis. Clear communication and coordination are essential for ensuring a swift and effective response. The DMC must also make critical decisions under pressure, such as prioritizing salvage efforts and allocating resources. This responsibility demands strong leadership and a calm, decisive approach.',
                  },
                  {
                    title: '4. Managing Salvage and Recovery Operations: Restoring and Protecting Assets',
                    icon: <Package size={16} />,
                    content: 'The DMC is responsible for managing salvage and recovery operations after a disaster. This involves assessing the damage, prioritizing materials for salvage, and coordinating restoration efforts. The DMC must ensure that salvage and recovery operations are conducted in a safe and efficient manner, minimizing further damage to records and archives. This may involve hiring specialized conservators and restoration experts. The DMC is also responsible for documenting the salvage and recovery process, which is essential for insurance claims and future planning. This responsibility requires expertise in handling various types of materials and a thorough understanding of restoration techniques.',
                  },
                  {
                    title: '5. Overseeing Data Backup and Recovery: Safeguarding Digital Information',
                    icon: <Cloud size={16} />,
                    content: 'For institutions with digital records, the DMC is responsible for overseeing data backup and recovery procedures. This involves ensuring that regular backups are performed, and that data can be restored in the event of a disaster. The DMC must also ensure that data backups are stored in secure, off-site locations to protect against data loss from local disasters. This responsibility demands technical expertise and a thorough understanding of data management principles. Implementing and maintaining appropriate cybersecurity measures is also a vital function of the DMC.',
                  },
                  {
                    title: '6. Communicating with Stakeholders: Maintaining Transparency and Information Flow',
                    icon: <MessageSquare size={16} />,
                    content: 'The DMC is responsible for communicating with stakeholders during and after a disaster. This includes staff, users, donors, and the public. The DMC must ensure that accurate and timely information is disseminated to all relevant parties. This may involve using various communication channels, such as email, phone calls, and social media. Clear and consistent communication is essential for maintaining trust and confidence during a crisis. The DMC must also be prepared to handle media inquiries and public relations issues.',
                  },
                  {
                    title: '7. Conducting Training and Drills: Ensuring Staff Preparedness',
                    icon: <Users size={16} />,
                    content: 'The DMC is responsible for conducting regular training sessions and drills to ensure that staff members are prepared to respond to disasters. This involves familiarizing staff with the disaster plan, evacuation procedures, and salvage techniques. The DMC must also ensure that training is tailored to the specific needs of different departments and roles. Regular drills are essential for testing the effectiveness of the disaster plan and identifying areas for improvement. This responsibility demands strong organizational skills and a commitment to ongoing staff development.',
                  },
                  {
                    title: '8. Evaluating and Revising the Disaster Plan: Continuous Improvement',
                    icon: <RefreshCw size={16} />,
                    content: 'After a disaster or drill, the DMC is responsible for evaluating the effectiveness of the disaster plan and revising it as needed. This involves reviewing the actions taken, assessing the damage, and identifying areas for improvement. The DMC must ensure that lessons learned are incorporated into the plan and that it remains relevant and effective. Regular evaluations and revisions are essential for maintaining a robust and adaptable disaster preparedness program. This responsibility requires a commitment to continuous improvement and a willingness to learn from experience.',
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

            {/* SECTION 8: Implement a Disaster Preparedness Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['implementation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implement a Disaster Preparedness Plan
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Implementing a disaster preparedness plan is a multi-faceted process that requires careful attention to detail and ongoing commitment. It is not a one-time activity, but rather a continuous cycle of planning, training, and evaluation. Here is a breakdown of the key steps involved in implementing a disaster preparedness plan:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Establish a Dedicated Disaster Management Committee (DMC): The Core Team',
                    icon: <Users size={16} />,
                    content: 'The first step is to establish a dedicated DMC, a team responsible for overseeing all aspects of disaster preparedness and response. This committee should consist of representatives from various departments, including collections management, IT, security, and administration. Assigning clear roles and responsibilities within the DMC is crucial. This team will be the driving force behind the plan\'s implementation, ensuring that all necessary actions are taken. They should meet regularly to discuss progress, address challenges, and update the plan as needed. The DMC\'s authority to make decisions and allocate resources should be clearly defined.',
                  },
                  {
                    title: '2. Conduct a Thorough Risk Assessment: Understanding Potential Threats',
                    icon: <Target size={16} />,
                    content: 'Before implementing any specific measures, a comprehensive risk assessment is essential. This involves identifying potential hazards, such as natural disasters, technological failures, and human-caused incidents. The likelihood and potential impact of each hazard should be evaluated. This assessment will inform the development of specific mitigation and preparedness strategies. For example, if the institution is located in a flood-prone area, flood mitigation measures, such as elevating storage areas and installing water detectors, will be prioritized. If cyberattacks are a concern, robust cybersecurity protocols will be implemented. The risk assessment should be documented and regularly reviewed to ensure its continued relevance.',
                  },
                  {
                    title: '3. Develop and Document Detailed Procedures: Creating the Blueprint',
                    icon: <Clipboard size={16} />,
                    content: 'Based on the risk assessment, detailed procedures should be developed for each phase of disaster management: prevention, preparedness, response, and recovery. These procedures should be clearly documented and easily accessible to all staff members. This includes creating evacuation plans, salvage and recovery protocols, data backup and restoration procedures, and communication plans. Each procedure should include step-by-step instructions, contact information for relevant personnel and organizations, and checklists to ensure that all necessary actions are taken. The procedures should be tailored to the specific needs of the institution and should be regularly reviewed and updated to reflect changes in technology, staffing, and facilities.',
                  },
                  {
                    title: '4. Procure Necessary Equipment and Supplies: Equipping for Emergencies',
                    icon: <Package size={16} />,
                    content: 'Implementing a disaster preparedness plan requires access to appropriate equipment and supplies. This may include fire extinguishers, water detectors, protective gear, salvage materials, and data backup systems. A budget should be allocated for procuring these items, and a system should be established for maintaining and replenishing supplies. Regular inspections and testing of equipment are essential to ensure its functionality. The procurement process should consider the long-term needs of the institution and should prioritize items that are essential for protecting staff and collections.',
                  },
                  {
                    title: '5. Conduct Regular Training and Drills: Preparing Staff for Action',
                    icon: <Users size={16} />,
                    content: 'Staff training is crucial for ensuring that everyone knows their roles and responsibilities during a disaster. Regular training sessions and drills should be conducted to familiarize staff with the disaster plan and to test its effectiveness. Training should cover various aspects of disaster response, including evacuation procedures, first aid, salvage techniques, and communication protocols. Drills should simulate realistic disaster scenarios and should be conducted at least annually. Feedback from staff members should be incorporated into the training program to improve its effectiveness. Documentation of training activities is essential for demonstrating compliance and for evaluating the program\'s impact.',
                  },
                  {
                    title: '6. Establish Clear Communication Protocols: Maintaining Information Flow',
                    icon: <MessageSquare size={16} />,
                    content: 'Effective communication is essential during a disaster. Clear communication protocols should be established to ensure that information is disseminated quickly and accurately. This includes establishing communication channels for internal and external stakeholders, such as staff, users, emergency services, and the media. A communication plan should outline procedures for disseminating information, such as through email, phone calls, social media, and public announcements. Designating spokespersons and establishing a communication centre can help streamline communication efforts. Regular testing of communication systems is essential to ensure their functionality.',
                  },
                  {
                    title: '7. Implement Data Backup and Recovery Procedures: Safeguarding Digital Assets',
                    icon: <Cloud size={16} />,
                    content: 'For institutions with digital records, implementing robust data backup and recovery procedures is crucial. This involves establishing regular backup schedules, storing backups in secure off-site locations, and testing data restoration procedures. Data backups should be stored in multiple formats and on multiple media to prevent obsolescence. Cybersecurity measures, such as firewalls and antivirus software, should be implemented to protect against cyberattacks. Regular testing of data recovery procedures is essential to ensure their effectiveness.',
                  },
                  {
                    title: '8. Secure Insurance Coverage: Protecting Against Financial Losses',
                    icon: <DollarSign size={16} />,
                    content: 'Adequate insurance coverage is essential for mitigating the financial impact of disasters. This involves insuring buildings, collections, and equipment against potential losses. The insurance policy should cover the full replacement value of the assets, including the cost of salvage and restoration. Regular reviews of insurance coverage are essential to ensure that it remains adequate. Developing a contingency fund can help cover unexpected expenses during a disaster.',
                  },
                  {
                    title: '9. Establish Collaborative Partnerships: Building a Support Network',
                    icon: <Handshake size={16} />,
                    content: 'Building strong relationships with other institutions and organizations can enhance disaster preparedness and response efforts. This involves participating in regional and national networks for disaster management. Sharing resources, such as equipment and expertise, can help institutions recover more quickly from a disaster. Collaborating with local emergency services and community organizations can improve coordination and communication. These partnerships can provide valuable support during and after a disaster.',
                  },
                  {
                    title: '10. Regularly Review and Update the Plan: Ensuring Ongoing Relevance',
                    icon: <RefreshCw size={16} />,
                    content: 'Disaster preparedness is an ongoing process that requires regular review and updates. The disaster plan should be reviewed at least annually, or more frequently if there are significant changes in technology, staffing, or facilities. After each disaster or drill, the plan should be evaluated and revised to incorporate lessons learned. This iterative process ensures that the plan remains relevant and effective in addressing the institution\'s evolving needs and risks.',
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

            {/* SECTION 9: Evaluation of a Disaster Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluation of a Disaster Plan
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Evaluating a disaster plan is a crucial step in ensuring its effectiveness and relevance. It is not enough to simply create a plan; it must be tested, reviewed, and revised to address potential weaknesses and adapt to changing circumstances. Here is a breakdown of the key aspects of evaluating a disaster plan:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Regular Review and Updates: Maintaining Relevance Over Time',
                    icon: <RefreshCw size={16} />,
                    content: 'A disaster plan should not be a static document. It must be regularly reviewed and updated to reflect changes in the institution\'s facilities, collections, technology, and staffing. This involves scheduling periodic reviews, at least annually, to assess the plan\'s continued relevance and effectiveness. Changes in contact information, emergency procedures, and insurance policies should be incorporated into the plan. Technological advancements, such as new data backup systems or communication tools, should be evaluated and integrated into the plan as appropriate. After each disaster or drill, the plan should be reviewed and revised to incorporate lessons learned and address any identified weaknesses. This ongoing process ensures that the plan remains current and effective in mitigating the impact of disasters.',
                  },
                  {
                    title: '2. Drills and Simulations: Testing the Plan\'s Effectiveness',
                    icon: <Target size={16} />,
                    content: 'Conducting regular drills and simulations is essential for testing the plan\'s effectiveness and identifying potential problems. These exercises should simulate realistic disaster scenarios, such as fires, floods, or cyberattacks. Drills should involve all relevant staff members and should test various aspects of the plan, including evacuation procedures, communication protocols, and salvage operations. The results of the drills should be documented and used to identify areas for improvement. Feedback from staff members should be incorporated into the evaluation process. Drills should be conducted at least annually, or more frequently if there are significant changes in the institution\'s operations or facilities. These exercises provide valuable insights into the plan\'s strengths and weaknesses, allowing for necessary adjustments.',
                  },
                  {
                    title: '3. Post-Disaster Analysis: Learning from Real-World Events',
                    icon: <AlertCircle size={16} />,
                    content: 'In the event of an actual disaster, a thorough post-disaster analysis is crucial for evaluating the plan\'s effectiveness and identifying areas for improvement. This involves documenting the actions taken during the disaster, assessing the damage, and evaluating the plan\'s impact on the institution\'s operations. The analysis should consider the effectiveness of communication protocols, evacuation procedures, salvage operations, and data recovery efforts. Feedback from staff members, users, and external stakeholders should be incorporated into the analysis. The results of the post-disaster analysis should be used to revise the disaster plan and to develop strategies for preventing similar incidents in the future. This process ensures that the institution learns from its experiences and continuously improves its disaster preparedness capabilities.',
                  },
                  {
                    title: '4. External Audits and Assessments: Seeking Expert Opinions',
                    icon: <Microscope size={16} />,
                    content: 'Engaging external experts to conduct audits and assessments of the disaster plan can provide valuable insights and identify potential weaknesses. These experts can bring a fresh perspective and offer recommendations based on their experience and knowledge of best practices. External audits can assess the plan\'s compliance with relevant laws and regulations, as well as its alignment with industry standards. The feedback from external audits should be incorporated into the plan\'s revision process. This process ensures that the plan is aligned with best practices and incorporates expert opinions.',
                  },
                  {
                    title: '5. Staff Feedback and Input: Incorporating Frontline Perspectives',
                    icon: <Users size={16} />,
                    content: 'Staff members are often the first responders during a disaster, so their feedback and input are crucial for evaluating the plan\'s effectiveness. Regular meetings and surveys should be conducted to gather staff feedback on the plan\'s clarity, practicality, and effectiveness. Staff members should be encouraged to report any problems or concerns they encounter during drills or real-world events. Their insights can help identify areas for improvement and ensure that the plan is tailored to the needs of the institution. This process ensures that the plan is practical and addresses the needs of the people who will be implementing it.',
                  },
                  {
                    title: '6. Documentation and Record-Keeping: Maintaining a Clear History',
                    icon: <Clipboard size={16} />,
                    content: 'Thorough documentation and record-keeping are essential for evaluating the disaster plan. This involves maintaining records of all drills, simulations, post-disaster analyses, and plan revisions. Documentation should include details about the actions taken, the results achieved, and any problems encountered. This information can be used to track the plan\'s effectiveness over time and to identify trends and patterns. Documentation should also include records of staff training, equipment maintenance, and insurance coverage. This process ensures that there is a clear history of the plan\'s development and implementation.',
                  },
                  {
                    title: '7. Performance Metrics and Key Indicators: Measuring Success',
                    icon: <TrendingUp size={16} />,
                    content: 'Developing performance metrics and key indicators can help measure the success of the disaster plan. These metrics can include the time it takes to evacuate staff and collections, the percentage of data recovered after a disaster, and the cost of damage and restoration. Regularly tracking these metrics can provide insights into the plan\'s effectiveness and identify areas for improvement. Key indicators can also include the number of staff members trained in disaster response procedures and the frequency of drills and simulations. This process ensures that there is a quantifiable way to measure the plan\'s success.',
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

            {/* SECTION 10: Priority Lists and Resources Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['priority'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Priority Lists and Resources Requirements
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In disaster planning and recovery, priority lists and resource requirements are essential for ensuring that the most critical assets and functions are protected and restored first. They provide a structured approach to allocating limited resources and making informed decisions during a crisis. Here is a breakdown of these crucial elements:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Priority Lists: Establishing a Hierarchy of Importance',
                    icon: <ListChecks size={16} />,
                    content: 'Priority lists are essential tools for identifying and ranking the most critical assets, functions, and collections within an institution. They establish a hierarchy of importance, guiding decision-making during salvage and recovery operations. For example, a priority list might rank irreplaceable historical documents higher than routine administrative records. Similarly, critical IT systems necessary for essential services would be prioritized over less vital systems. This ranking is typically based on factors such as the value of the assets, their importance to the institution\'s mission, their fragility, and their recovery time. Priority lists help ensure that limited resources are allocated effectively, focusing on the most crucial items first. They also provide a clear framework for decision-making during a crisis, minimizing confusion and delays. The development of priority lists requires input from various stakeholders, including collections managers, IT personnel, and administrators.',
                  },
                  {
                    title: '2. Resource Requirements: Identifying Necessary Tools and Expertise',
                    icon: <Package size={16} />,
                    content: 'Resource requirements encompass the tools, equipment, personnel, and expertise needed for disaster response and recovery. This includes items such as protective gear, salvage materials (e.g., drying equipment, specialized cleaning supplies), data recovery tools, and temporary storage space. It also includes the personnel required for salvage operations, data restoration, and building repairs. Identifying resource requirements involves assessing the specific needs of the institution based on the types of materials held and the potential hazards they face. For instance, a museum with water-sensitive artifacts would require specialized drying equipment and trained conservators. An archive with extensive digital collections would need robust data recovery tools and IT expertise. Resource requirements also include financial resources for covering expenses such as equipment rental, personnel costs, and insurance deductibles. A comprehensive resource inventory should be maintained and regularly updated to ensure that necessary items are readily available.',
                  },
                  {
                    title: '3. Prioritization Based on Material Type and Condition: Tailoring Salvage Efforts',
                    icon: <FileText size={16} />,
                    content: 'Different types of materials require different salvage techniques and resources. Paper-based records, for example, require careful drying and stabilization to prevent mold growth and further deterioration. Photographic materials require specialized handling to prevent emulsion damage. Electronic media require data recovery tools and expertise. Prioritizing salvage efforts based on material type and condition ensures that appropriate techniques are used and that resources are allocated effectively. Materials in poor condition or those that are highly susceptible to damage may be prioritized for immediate salvage. This approach minimizes further damage and maximizes the chances of successful recovery. The prioritization process should involve input from conservators, archivists, and other experts who are familiar with the specific materials held by the institution.',
                  },
                  {
                    title: '4. Staff Expertise and Training: Building Internal Capacity',
                    icon: <Users size={16} />,
                    content: 'Staff expertise and training are essential components of resource requirements. Staff members should be trained in emergency response procedures, including evacuation, first aid, and salvage techniques. They should also be familiar with the disaster plan and their specific roles and responsibilities. Specialized training may be required for handling different types of materials, such as wet paper or electronic media. Regular training sessions and drills are essential for reinforcing these skills. Building internal capacity ensures that the institution has the necessary expertise to respond effectively to a disaster. This approach minimizes reliance on external resources and facilitates a more efficient and coordinated response.',
                  },
                  {
                    title: '5. External Resources and Partnerships: Leveraging Outside Support',
                    icon: <Handshake size={16} />,
                    content: 'In some cases, internal resources may not be sufficient to handle all aspects of disaster recovery. External resources and partnerships can provide valuable support during a crisis. This may include collaborating with other institutions, such as museums, libraries, and archives, to share resources and expertise. It may also involve engaging with restoration companies, conservators, and data recovery specialists. Building strong relationships with these external partners before a disaster occurs can facilitate a more efficient and coordinated response. External funding, through grants or insurance, is another key external resource.',
                  },
                  {
                    title: '6. Financial Resources and Budgeting: Planning for Recovery Costs',
                    icon: <DollarSign size={16} />,
                    content: 'Financial resources are essential for covering the costs of disaster recovery. This includes expenses such as equipment rental, personnel costs, restoration services, and insurance deductibles. A budget should be developed to cover these expenses, and contingency funds should be established to address unexpected costs. Regular reviews of insurance coverage are essential to ensure that it remains adequate. Financial planning should also include strategies for accessing emergency funding and grants. This approach ensures that the institution has the financial resources to recover from a disaster without incurring crippling losses.',
                  },
                  {
                    title: '7. Technology and Infrastructure: Restoring Digital Capabilities',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Technology and infrastructure are critical resources for disaster recovery, especially for institutions with digital records. This includes data recovery tools, backup systems, and communication equipment. It also includes temporary workspaces and IT support for staff members. Restoring digital capabilities is essential for ensuring the continuity of operations and for accessing critical information. A technology recovery plan should be developed and regularly tested to ensure its effectiveness. This plan should include procedures for restoring data, communications systems, and other essential technologies.',
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

            {/* SECTION 11: Ways of Raising Awareness of Disasters */}
            <div
              ref={(el) => {
                sectionRefs.current['awareness'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Ways of Raising Awareness of Disasters
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Raising awareness about disasters is crucial for building resilient communities and ensuring that individuals and institutions are prepared for potential emergencies. Effective awareness campaigns can educate people about risks, promote preparedness measures, and encourage proactive responses. Here are several ways to raise disaster awareness:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Public Education Campaigns: Reaching Broad Audiences',
                    icon: <Users size={16} />,
                    content: 'Public education campaigns are essential for disseminating information about disaster risks and preparedness measures to a broad audience. These campaigns can utilize various media channels, including television, radio, print, and online platforms. Educational materials, such as brochures, posters, and videos, can be distributed through community centres, schools, and libraries. Public service announcements (PSAs) can be aired on television and radio to reach a wide audience. Interactive workshops and seminars can be organized to provide hands-on training and demonstrations. These campaigns should be tailored to the specific needs and demographics of the target audience, using clear and accessible language. They should also emphasize the importance of personal responsibility and community involvement in disaster preparedness. These campaigns are vital for creating a culture of preparedness and ensuring that individuals have the knowledge and skills to protect themselves and their families.',
                  },
                  {
                    title: '2. Community Outreach Programs: Engaging Local Populations',
                    icon: <Home size={16} />,
                    content: 'Community outreach programs involve engaging directly with local populations to raise awareness about disaster risks and preparedness measures. These programs can include door-to-door campaigns, community meetings, and participation in local events. Community leaders, such as religious leaders, teachers, and neighbourhood association representatives, can play a crucial role in disseminating information and promoting preparedness. These programs should be tailored to the specific needs and cultural context of the community. They should also emphasize the importance of community involvement and mutual support during a disaster. Community outreach programs are effective for building trust and fostering a sense of collective responsibility.',
                  },
                  {
                    title: '3. School-Based Programs: Educating Future Generations',
                    icon: <BookOpen size={16} />,
                    content: 'School-based programs are essential for educating children and adolescents about disaster risks and preparedness measures. These programs can integrate disaster preparedness into the school curriculum, using age-appropriate materials and activities. School-based drills and simulations can provide hands-on training and reinforce preparedness skills. Student-led initiatives, such as disaster preparedness clubs and awareness campaigns, can promote peer-to-peer learning and engagement. School-based programs are effective for instilling a culture of preparedness in future generations and empowering them to take an active role in disaster risk reduction.',
                  },
                  {
                    title: '4. Social Media and Online Platforms: Leveraging Digital Channels',
                    icon: <GlobeIcon size={16} />,
                    content: 'Social media and online platforms offer powerful tools for raising disaster awareness and disseminating information quickly and efficiently. These platforms can be used to share educational content, provide real-time updates during a disaster, and facilitate communication among community members. Interactive online tools, such as quizzes and simulations, can engage users and promote learning. Social media campaigns can be used to raise awareness about specific disaster risks and preparedness measures. Online forums and discussion groups can provide platforms for community members to share information and support each other. Social media and online platforms are effective for reaching a wide audience and disseminating information in a timely and accessible manner.',
                  },
                  {
                    title: '5. Partnerships with Media Outlets: Collaborating for Wider Reach',
                    icon: <Share2 size={16} />,
                    content: 'Collaborating with media outlets, such as newspapers, television stations, and radio stations, can significantly expand the reach of disaster awareness campaigns. Media outlets can help disseminate information about disaster risks, preparedness measures, and emergency response procedures. They can also provide real-time updates during a disaster and facilitate communication among community members. Partnerships with media outlets can involve joint campaigns, interviews with experts, and the production of educational content. These collaborations are effective for reaching a wide audience and ensuring that accurate and timely information is disseminated.',
                  },
                  {
                    title: '6. Training and Workshops: Building Capacity and Skills',
                    icon: <Users size={16} />,
                    content: 'Providing training and workshops to community members, first responders, and other stakeholders can build capacity and enhance preparedness skills. These programs can cover a range of topics, including first aid, search and rescue, and disaster communication. Hands-on training and simulations can provide practical experience and reinforce learning. Training programs can be tailored to the specific needs of different groups, such as healthcare professionals, emergency responders, and community volunteers. Training and workshops are effective for building a skilled and prepared workforce that can respond effectively during a disaster.',
                  },
                  {
                    title: '7. Utilizing Visual Aids and Infographics: Enhancing Information Retention',
                    icon: <Eye size={16} />,
                    content: 'Visual aids and infographics can enhance information retention and make complex concepts more accessible. These tools can be used to illustrate disaster risks, preparedness measures, and emergency response procedures. Maps, charts, and diagrams can help visualize data and convey information effectively. Infographics can be used to summarize key messages and provide actionable steps. Visual aids and infographics are effective for engaging diverse audiences and promoting understanding.',
                  },
                  {
                    title: '8. Developing Mobile Applications: Providing On-the-Go Information',
                    icon: <Phone size={16} />,
                    content: 'Mobile applications can provide on-the-go information and resources for disaster preparedness and response. These apps can include real-time alerts, emergency contact information, and interactive maps. They can also provide checklists and step-by-step instructions for preparedness measures. Mobile applications are effective for providing immediate access to critical information and facilitating communication during a disaster.',
                  },
                  {
                    title: '9. Community-Based Drills and Exercises: Practicing Preparedness',
                    icon: <Target size={16} />,
                    content: 'Community-based drills and exercises can provide opportunities for residents to practice preparedness skills and test emergency response plans. These exercises can simulate realistic disaster scenarios and involve participation from various community groups. They can also help identify potential problems and improve coordination among different stakeholders. Community-based drills and exercises are effective for building community resilience and enhancing preparedness.',
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

            {/* SECTION 12: Training Needs and Resources */}
            <div
              ref={(el) => {
                sectionRefs.current['training'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Training Needs and Resources
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Training needs and resources are critical components of any successful archival or records management program, especially when dealing with disaster preparedness. Identifying and addressing training needs ensures that staff members have the knowledge and skills necessary to protect and preserve valuable materials. Here is a breakdown of key aspects:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying Training Needs: Assessing Skill Gaps and Priorities',
                    icon: <Target size={16} />,
                    content: 'The first step in developing a training program is to identify the specific training needs of staff members. This involves assessing their current skills and knowledge, as well as identifying any gaps or areas where improvement is needed. This assessment can be conducted through surveys, interviews, and performance evaluations. It is crucial to consider the diverse roles within the institution and tailor training to the specific responsibilities of each position. For instance, conservators may require specialized training in salvage techniques, while IT staff may need training in data recovery procedures. The identification of training needs should also consider the potential risks and vulnerabilities identified in the institution\'s disaster plan. Prioritizing training needs based on the urgency and importance of the skills ensures that resources are allocated effectively. This process ensures that training is targeted and relevant, addressing the most pressing needs of the institution.',
                  },
                  {
                    title: '2. Developing Training Programs: Tailoring Content and Delivery',
                    icon: <Clipboard size={16} />,
                    content: 'Once training needs have been identified, the next step is to develop comprehensive training programs. These programs should be tailored to the specific needs of the staff and should incorporate a variety of training methods. This may include classroom instruction, hands-on workshops, online courses, and simulations. The content of the training programs should be clear, concise, and relevant to the staff\'s daily work. Training materials should be developed using clear and accessible language and should incorporate visual aids and real-world examples. Hands-on workshops and simulations are particularly effective for developing practical skills and reinforcing theoretical knowledge. The training programs should also include opportunities for staff members to ask questions and receive feedback. Developing effective training programs ensures that staff members acquire the necessary knowledge and skills to perform their duties effectively.',
                  },
                  {
                    title: '3. Providing Access to Training Resources: Ensuring Availability and Accessibility',
                    icon: <BookOpen size={16} />,
                    content: 'Providing access to training resources is essential for ensuring that staff members can participate in training programs. This may involve providing access to online learning platforms, purchasing training materials, and securing funding for external training programs. Training resources should be readily available and accessible to all staff members, regardless of their location or work schedule. This may involve offering training programs at different times and locations and providing access to online resources that can be accessed remotely. It is also important to consider the diverse learning styles of staff members and to provide training resources in a variety of formats. Providing access to training resources ensures that staff members have the opportunity to develop their skills and knowledge.',
                  },
                  {
                    title: '4. Utilizing Internal Expertise: Leveraging Existing Knowledge',
                    icon: <Users size={16} />,
                    content: 'Many institutions have staff members with specialized knowledge and expertise that can be used to develop and deliver training programs. This may include conservators, IT specialists, and records managers. Utilizing internal expertise can reduce the cost of training programs and ensure that the content is relevant to the institution\'s specific needs. It also provides opportunities for staff members to share their knowledge and expertise with their colleagues. Internal experts can develop and deliver training programs on a variety of topics, including salvage techniques, data recovery procedures, and disaster communication. Utilizing internal expertise can also foster a culture of learning and collaboration within the institution.',
                  },
                  {
                    title: '5. Seeking External Expertise: Filling Knowledge Gaps',
                    icon: <GlobeIcon size={16} />,
                    content: 'In some cases, internal expertise may not be sufficient to address all training needs. Seeking external expertise can help fill knowledge gaps and provide staff members with access to specialized training. This may involve hiring consultants, attending workshops and conferences, and collaborating with other institutions. External experts can provide training on a variety of topics, including advanced conservation techniques, digital preservation strategies, and disaster response planning. They can also provide valuable insights and best practices from other institutions. Seeking external expertise can ensure that staff members receive high-quality training, and that the institution stays abreast of the latest developments in the field.',
                  },
                  {
                    title: '6. Evaluating Training Effectiveness: Measuring Impact and Improvement',
                    icon: <CheckCircle size={16} />,
                    content: 'Evaluating the effectiveness of training programs is crucial for ensuring that they are meeting their objectives. This involves assessing the impact of training on staff knowledge, skills, and performance. Evaluation methods may include surveys, quizzes, and performance evaluations. Feedback from staff members should also be incorporated into the evaluation process. The results of the evaluation should be used to improve the training programs and to identify areas for future training. Regular evaluations ensure that training programs remain relevant and effective.',
                  },
                  {
                    title: '7. Budgeting for Training: Allocating Resources Strategically',
                    icon: <DollarSign size={16} />,
                    content: 'Training programs require financial resources for developing materials, hiring instructors, and providing access to external training. A budget should be developed to cover these expenses, and resources should be allocated strategically. This may involve prioritizing training programs that address the most critical needs of the institution. It may also involve seeking grant funding and other external sources of support. Budgeting for training ensures that the institution has the financial resources to develop and deliver high-quality training programs.',
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

            {/* SECTION 13: Disaster Recovery */}
            <div
              ref={(el) => {
                sectionRefs.current['recovery'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Disaster Recovery
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Disaster recovery is the process of restoring an organization's operations and data after a disruptive event. It is a critical component of disaster planning, focusing on the actions taken after a disaster to minimize downtime and ensure business continuity. Here is a breakdown of key aspects:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Damage Assessment: Evaluating the Extent of Loss',
                    icon: <SearchIcon size={16} />,
                    content: 'The first step in disaster recovery is to assess the damage caused by the event. This involves evaluating the physical damage to buildings, equipment, and collections, as well as the extent of data loss and corruption. A thorough damage assessment is essential for determining the scope of recovery efforts and prioritizing actions. This process involves documenting the damage, identifying salvageable materials, and estimating the cost of restoration. It is crucial to involve experts, such as conservators and IT specialists, in the damage assessment process. This comprehensive evaluation provides a clear picture of the situation, enabling informed decisions about recovery strategies.',
                  },
                  {
                    title: '2. Salvage Operations: Recovering Damaged Materials',
                    icon: <Package size={16} />,
                    content: 'Salvage operations involve recovering and stabilizing damaged materials to prevent further deterioration. This may include drying wet records, cleaning contaminated materials, and repairing damaged equipment. Salvage operations must be conducted quickly and efficiently to minimize damage. Prioritization is key, focusing on the most valuable and at-risk materials first. This process requires specialized knowledge and expertise, particularly for delicate materials like photographs and electronic media. It is essential to document all salvage efforts, including the methods used and the condition of the materials, for insurance and restoration purposes. Salvage operations are crucial for preserving valuable assets and ensuring their long-term preservation.',
                  },
                  {
                    title: '3. Data Recovery: Restoring Digital Information',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Data recovery is a critical aspect of disaster recovery for institutions with digital records. This involves restoring lost or corrupted data from backups or other sources. Data recovery procedures should be clearly documented and regularly tested. This process may involve using specialized software and hardware to recover data from damaged storage media. It is essential to verify the integrity of recovered data to ensure that it is accurate and complete. Data recovery efforts should be prioritized based on the importance of the data and the impact of its loss on operations. Robust data backup and recovery systems are essential for minimizing data loss and ensuring business continuity.',
                  },
                  {
                    title: '4. Building and Infrastructure Restoration: Rebuilding Physical Spaces',
                    icon: <Building size={16} />,
                    content: 'Building and infrastructure restoration involves repairing or rebuilding damaged facilities and equipment. This may include repairing structural damage, replacing damaged equipment, and restoring utilities. Building restoration efforts should be prioritized based on the impact of the damage on operations and the safety of staff and users. This process may involve hiring contractors and other specialists to perform restoration work. It is essential to ensure that restored facilities and equipment meet safety standards and are compliant with relevant regulations. Building and infrastructure restoration is crucial for restoring normal operations and ensuring the safety of personnel.',
                  },
                  {
                    title: '5. Business Continuity: Resuming Essential Operations',
                    icon: <Zap size={16} />,
                    content: 'Business continuity involves resuming essential operations as quickly as possible after a disaster. This may involve establishing temporary workspaces, restoring communication systems, and accessing alternative data sources. Business continuity planning should identify critical functions and develop strategies for resuming them in a timely manner. This process requires clear communication and coordination among staff members and external stakeholders. It is essential to prioritize essential functions and allocate resources accordingly. Business continuity measures are crucial for minimizing downtime and ensuring that the institution can continue to provide essential services.',
                  },
                  {
                    title: '6. Communication and Public Relations: Maintaining Transparency',
                    icon: <MessageSquare size={16} />,
                    content: 'Communication and public relations are essential during disaster recovery. This involves communicating with staff, users, donors, and the public about the status of recovery efforts. It is essential to provide accurate and timely information to maintain trust and confidence. This process may involve using various communication channels, such as email, phone calls, and social media. It is also essential to designate spokespersons and establish a communication centre. Effective communication and public relations strategies are crucial for managing the institution\'s reputation and maintaining positive relationships with stakeholders.',
                  },
                  {
                    title: '7. Documentation and Record-Keeping: Maintaining a Clear History',
                    icon: <Clipboard size={16} />,
                    content: 'Thorough documentation and record-keeping are essential during disaster recovery. This involves documenting all actions taken, damage assessed, and resources used. This information is crucial for insurance claims, legal proceedings, and future planning. Documentation should include details about salvage operations, data recovery efforts, and building restoration. It is also essential to maintain records of communication with staff, users, and external stakeholders. This process ensures that there is a clear history of the recovery efforts and that lessons learned can be incorporated into future disaster plans.',
                  },
                  {
                    title: '8. Evaluation and Improvement: Learning from Experience',
                    icon: <RefreshCw size={16} />,
                    content: 'After the recovery process is complete, it is essential to evaluate the effectiveness of the disaster recovery plan and identify areas for improvement. This involves reviewing the actions taken, assessing the outcomes, and gathering feedback from staff members and stakeholders. The evaluation should consider the efficiency of salvage operations, the effectiveness of data recovery efforts, and the impact of the disaster on operations. The results of the evaluation should be used to revise the disaster recovery plan and to develop strategies for preventing similar incidents in the future. This process ensures that the institution learns from its experiences and continuously improves its disaster preparedness and recovery capabilities.',
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

            {/* SECTION 14: Salvage Protocols */}
            <div
              ref={(el) => {
                sectionRefs.current['salvage'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Salvage Protocols
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Salvage protocols are a critical component of disaster recovery plans, particularly for institutions that house valuable and irreplaceable materials like archives, libraries, and museums. These protocols outline the specific steps to be taken to recover and stabilize damaged materials after a disaster, minimizing further deterioration and maximizing the chances of successful restoration. Here is a breakdown of the key elements of salvage protocols:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Safety First: Prioritizing Human Life',
                    icon: <Shield size={16} />,
                    content: 'The primary concern during any salvage operation is the safety of personnel. Before any salvage work begins, a thorough assessment of the site must be conducted to identify potential hazards, such as structural instability, electrical hazards, or chemical spills. All personnel involved in salvage operations must wear appropriate protective gear, including gloves, respirators, and safety glasses. Training in safe handling practices and hazard awareness is essential. This emphasis on safety ensures that salvage operations are conducted without endangering the lives or health of those involved.',
                  },
                  {
                    title: '2. Damage Assessment and Prioritization: Identifying Critical Materials',
                    icon: <Target size={16} />,
                    content: 'A rapid and thorough damage assessment is crucial for prioritizing salvage efforts. This involves evaluating the extent of damage to materials, identifying the types of damage (e.g., water damage, mold growth, fire damage), and assessing the condition of the storage environment. Based on this assessment, materials should be prioritized for salvage based on their value, fragility, and the urgency of their preservation needs. Irreplaceable historical documents, for example, would typically be prioritized over less significant materials. This systematic approach ensures that limited resources are allocated effectively and that the most critical materials are addressed first.',
                  },
                  {
                    title: '3. Stabilization and Immediate Action: Preventing Further Damage',
                    icon: <Zap size={16} />,
                    content: 'Once materials have been prioritized, immediate action must be taken to stabilize them and prevent further damage. This may involve removing wet materials from standing water, separating wet materials to prevent sticking, or freezing wet materials to inhibit mold growth. It also may involve creating a safe and stable environment by controlling temperature and humidity. For fire damaged materials, loose ash and debris should be carefully removed. This step is essential to mitigate ongoing deterioration and to make materials more manageable for subsequent restoration.',
                  },
                  {
                    title: '4. Documentation: Recording the Salvage Process',
                    icon: <Clipboard size={16} />,
                    content: 'Thorough documentation of the salvage process is essential for several reasons. It provides a record of the damage, the actions taken, and the condition of the materials after salvage. This information is crucial for insurance claims, restoration planning, and future disaster preparedness. Documentation should include photographs, written descriptions, and detailed notes on the condition of materials and the methods used for salvage. This meticulous record-keeping ensures accountability and facilitates informed decision-making throughout the recovery process.',
                  },
                  {
                    title: '5. Material-Specific Salvage Techniques: Tailoring Approaches',
                    icon: <FileText size={16} />,
                    content: 'Different types of materials require different salvage techniques. Paper-based materials, for example, should be air-dried or frozen to prevent mold growth. Photographic materials require careful handling to prevent emulsion damage. Electronic media require specialized data recovery tools and expertise. Salvage protocols should include material-specific guidelines for handling and stabilizing various types of materials. This specialized knowledge ensures that the most appropriate techniques are used for each type of material, maximizing the chances of successful recovery.',
                  },
                  {
                    title: '6. Environmental Control: Creating a Safe Space',
                    icon: <Sun size={16} />,
                    content: 'Controlling the environment during salvage operations is crucial for preventing further damage. This involves regulating temperature, humidity, and airflow to minimize mold growth and prevent further deterioration of materials. Dehumidifiers, fans, and air purifiers may be necessary to create a stable environment. Environmental control measures should be tailored to the specific needs of the materials being salvaged. This controlled environment creates a safe space for salvage operations and minimizes the risk of ongoing damage.',
                  },
                  {
                    title: '7. Collaboration with Experts: Seeking Specialized Assistance',
                    icon: <Handshake size={16} />,
                    content: 'Salvage operations often require specialized expertise that may not be available in-house. This may include conservators, restoration experts, and data recovery specialists. Collaboration with these experts is essential for ensuring that materials are salvaged and restored properly. Salvage protocols should include contact information for relevant experts and guidelines for coordinating their involvement. This collaborative approach ensures that the institution has access to the necessary expertise and resources for successful recovery.',
                  },
                  {
                    title: '8. Post-Salvage Assessment and Planning: Preparing for Restoration',
                    icon: <Target size={16} />,
                    content: 'After salvage operations are complete, a post-salvage assessment should be conducted to evaluate the condition of the materials and to develop a restoration plan. This assessment should consider the extent of damage, the feasibility of restoration, and the cost of restoration. The restoration plan should outline the specific steps to be taken to restore the materials to their original condition. This proactive approach ensures that the institution is prepared for the next phase of the recovery process and that resources are allocated effectively.',
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
                  💡 Disaster Insight
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
                  <span>Disaster Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Planning Phases</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Plan Components</span>
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
                Disasters fall into three categories: natural, technological, and human-caused. Effects include physical damage, data loss, contamination, loss of context, disruption, and psychological impact. Disaster planning has six phases: Risk Assessment, Prevention, Preparedness, Response, Recovery, Evaluation. A comprehensive plan includes emergency contacts, evacuation, salvage, data backup, communication, insurance, training, and regular reviews. The DMC coordinates all efforts. Mitigation measures include building protection, collection management, digital preservation, emergency planning, insurance, collaboration, and training.
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
                <strong className="text-white">Disaster Types &amp; Effects</strong> – Natural (earthquakes, floods), technological (fires, cyberattacks), human-caused (vandalism, war). Effects include physical damage, data loss, contamination, loss of context, disruption, and psychological impact.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Planning Phases</strong> – Six phases: Risk Assessment, Prevention and Mitigation, Preparedness, Response, Recovery, Evaluation and Revision. Each phase builds on the previous to create a comprehensive plan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Plan Components &amp; DMC</strong> – Eight components: emergency contacts, evacuation, salvage, data backup, communication, insurance, training, and plan review. The DMC leads development, risk assessment, response, salvage, data oversight, communication, training, and evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mitigation &amp; Recovery</strong> – Mitigation measures: building protection, collection management, digital preservation, emergency planning, insurance, collaboration, training. Recovery involves damage assessment, salvage, data recovery, building restoration, business continuity, communication, and evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Salvage Protocols</strong> – Safety first, damage assessment, stabilisation, documentation, material-specific techniques, environmental control, expert collaboration, and post-salvage planning. These ensure effective recovery of damaged materials.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 4 (Disaster Planning &amp; Recovery)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;