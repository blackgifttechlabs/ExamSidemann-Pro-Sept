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
  { id: 'difference', label: 'Preservation vs Conservation' },
  { id: 'types', label: 'Preservation Types' },
  { id: 'preservation-principles', label: 'Preservation Principles' },
  { id: 'conservation-principles', label: 'Conservation Principles' },
  { id: 'significance', label: 'Significance' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'care-repair', label: 'Care & Repair Methods' },
  { id: 'repair-methods', label: 'Repair Techniques' },
  { id: 'equipment', label: 'Equipment & Materials' },
  { id: 'conservator', label: 'Conservator Duties' },
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
        text: 'The oldest surviving book in the world is the Diamond Sutra, a Buddhist text printed in 868 AD, which is preserved in the British Library.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear cotton gloves when handling photographs and negatives – the oils from your skin can cause permanent damage to the emulsion layer.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Preservation = Preventive (creating conditions to avoid damage), Conservation = Corrective (repairing existing damage).',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store paper records in basements or attics where temperature and humidity fluctuate, accelerating deterioration. Always store in climate‑controlled environments.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The oldest surviving book in the world is the Diamond Sutra, a Buddhist text printed in 868 AD, which is preserved in the British Library.',
      },
      {
        title: 'Pro Tip',
        text: 'Always wear cotton gloves when handling photographs and negatives – the oils from your skin can cause permanent damage to the emulsion layer.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Preservation = Preventive (creating conditions to avoid damage), Conservation = Corrective (repairing existing damage).',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store paper records in basements or attics where temperature and humidity fluctuate, accelerating deterioration. Always store in climate‑controlled environments.',
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Preservation, Conservation &{' '}
            <span className="text-emerald-300 font-bold italic">
              Record Care
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to preservation vs conservation, principles, significance, challenges, repair methods, equipment, and conservator responsibilities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Preservation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Microscope size={14} className="inline mr-1" /> Conservation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Repair
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
                placeholder="Search for a concept, method, principle..."
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
            {/* SECTION 1: Difference Between Preservation and Conservation */}
            <div
              ref={(el) => {
                sectionRefs.current['difference'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Preservation and Conservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is common for people to use "preservation" and "conservation" interchangeably, but in archival and museum contexts, they have distinct meanings. Understanding this difference is crucial for proper care of valuable cultural materials. Here is a comparison and contrast:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Scope of Action',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Preservation:</strong> Preservation is a broad term encompassing all actions taken to prevent or minimize deterioration of cultural property. It focuses on creating a stable environment and implementing policies that extend the lifespan of collections. This includes environmental controls (temperature, humidity, light), proper storage, handling guidelines, and disaster preparedness. Essentially, preservation is about creating the right conditions to prevent damage from occurring in the first place.</p>
                        <p><strong>Conservation:</strong> Conservation refers to the specific actions taken to repair or stabilize damaged cultural property. It involves direct intervention in the physical or chemical makeup of an object to restore its condition and slow further deterioration. Conservation is about fixing existing damage and preventing further decay of individual items.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Level of Intervention',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Preservation:</strong> Preservation is primarily preventive, focusing on indirect actions that affect the entire collection or large segments of it. It is about maintaining a stable environment and implementing best practices for handling and storage.</p>
                        <p><strong>Conservation:</strong> Conservation is interventive, focusing on direct treatment of individual objects. It involves physical and chemical processes to repair damage and stabilize materials.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Focus',
                    icon: <Focus size={16} />,
                    content: (
                      <>
                        <p><strong>Preservation:</strong> Preservation has a collection-wide focus. It aims to create optimal conditions for the long-term survival of the entire collection.</p>
                        <p><strong>Conservation:</strong> Conservation has an object-specific focus. It addresses the unique needs of individual items that have already suffered damage.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Examples',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p><strong>Preservation:</strong> Installing climate control systems in storage areas. Using archival-quality boxes and folders. Establishing guidelines for handling fragile documents. Creating a disaster recovery plan.</p>
                        <p><strong>Conservation:</strong> Repairing torn pages in a manuscript. Cleaning mold from photographs. Deacidifying acidic paper. Strengthening weakened book bindings.</p>
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

            {/* SECTION 2: Preservation, Restorative Preservation, Preventive Conservation, Content Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preservation, Restorative Preservation, Preventive Conservation, Content Preservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When discussing the long-term care of archival materials, it is important to understand the nuances of different preservation and conservation approaches. Here is a breakdown of the terms:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preservation',
                    icon: <Shield size={16} />,
                    content: 'Preservation is the overarching term encompassing all actions taken to prolong the lifespan of cultural heritage materials. It is a broad strategy that aims to minimize deterioration and ensure that records and artifacts remain accessible for future generations. This includes a wide range of activities, from controlling environmental conditions (temperature, humidity, light) to implementing proper storage and handling procedures. Preservation is about creating a stable and safe environment for collections, preventing damage before it occurs. It also includes creating policies and procedures for disaster preparedness and response. Preservation is a holistic approach, focusing on the overall well-being of the collection rather than individual items.',
                  },
                  {
                    title: '2. Restorative Preservation (Conservation Treatment)',
                    icon: <Wrench size={16} />,
                    content: 'Restorative preservation, often simply called "conservation treatment," involves direct intervention to repair or stabilize damaged objects. This is where a conservator works directly on an item to reverse or slow deterioration. It might involve cleaning, repairing tears, strengthening weakened materials, or removing harmful substances. The goal is to restore the object to a stable condition and, in some cases, to improve its aesthetic appearance. Conservation treatment is a specialized process that requires expertise in materials science and conservation techniques. It is applied to individual items that have already suffered damage, aiming to extend their lifespan and maintain their integrity.',
                  },
                  {
                    title: '3. Preventive Conservation',
                    icon: <ShieldCheck size={16} />,
                    content: 'Preventive conservation focuses on avoiding damage and deterioration through proactive measures. It involves creating a stable and controlled environment for collections, implementing proper storage and handling procedures, and monitoring conditions to identify and address potential problems. This approach emphasizes minimizing risks rather than treating existing damage. Preventive conservation includes activities like controlling temperature and humidity, filtering light and pollutants, using archival-quality storage materials, and establishing integrated pest management programs. It is a proactive strategy that aims to prevent damage from occurring in the first place, ensuring the long-term preservation of collections.',
                  },
                  {
                    title: '4. Content Preservation',
                    icon: <Database size={16} />,
                    content: 'Content preservation focuses on preserving the informational content of records, regardless of their physical form. This is especially relevant in the digital age, where information can be easily transferred and transformed. It involves ensuring that the intellectual or informational content of a record remains accessible and understandable over time. Content preservation might involve digitizing documents, migrating digital files to newer formats, or creating metadata to describe and contextualize information. The focus is on preserving the information itself, rather than the physical carrier. This approach acknowledges that the information contained within a record is often more valuable than the physical object itself, and that it must be preserved even as technology changes.',
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

            {/* SECTION 3: Principles of Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['preservation-principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Preservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The principles of preservation guide archivists, librarians, and museum professionals in their efforts to prolong the life of cultural heritage materials. These principles emphasize a proactive and holistic approach to care, aiming to prevent damage and ensure long-term access. Here is a breakdown of the key principles:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preventive Care as Priority',
                    icon: <Shield size={16} />,
                    content: 'This principle emphasizes that preventing damage is more effective and cost-efficient than repairing it. It advocates for creating a stable and controlled environment to minimize deterioration. This involves managing factors like temperature, humidity, light exposure, and air pollution, which can significantly impact the longevity of materials. It also includes implementing proper handling and storage procedures to minimize physical stress. By focusing on preventive measures, institutions can avoid costly conservation treatments and ensure that collections remain in good condition for future generations. This approach recognizes that consistent, proactive care is the foundation of long-term preservation.',
                  },
                  {
                    title: '2. Minimal Intervention',
                    icon: <Minimize size={16} />,
                    content: 'This principle advises that interventions should be as minimal as possible, only addressing necessary issues. It encourages a "do no harm" approach, where any treatment or alteration of an object is carefully considered and justified. The goal is to avoid unnecessary interventions that could potentially cause further damage or alter the original character of the material. This principle is especially important in conservation treatments, where reversible and non-invasive techniques are preferred. It acknowledges that every intervention carries a risk, and that the best approach is often to leave the object as it is, as long as it is stable.',
                  },
                  {
                    title: '3. Reversibility',
                    icon: <RefreshCw size={16} />,
                    content: 'This principle states that any conservation treatment should be reversible, allowing for future interventions or corrections if necessary. It acknowledges that conservation techniques may evolve over time, and that what is considered best practice today may be outdated or harmful in the future. Reversible treatments ensure that future conservators have the option to undo or modify previous interventions, minimizing the risk of permanent damage. This principle is crucial for maintaining the long-term integrity of cultural heritage materials.',
                  },
                  {
                    title: '4. Compatibility',
                    icon: <LayersIcon size={16} />,
                    content: 'This principle emphasizes the use of materials that are compatible with the original object. Any materials used in conservation treatments or storage should be chemically stable and not cause adverse reactions with the original materials. This includes using archival-quality papers, adhesives, and storage containers that are acid-free and lignin-free. Compatibility ensures that conservation efforts do not introduce new problems or accelerate deterioration. This principle is very important when working with complex materials, and materials that may react with each other.',
                  },
                  {
                    title: '5. Documentation',
                    icon: <Clipboard size={16} />,
                    content: 'This principle stresses the importance of thorough documentation of all preservation and conservation activities. This includes detailed records of environmental conditions, storage methods, handling procedures, and any treatments performed. Documentation provides a complete history of the object\'s care, allowing future conservators to understand past interventions and make informed decisions. It also serves as a valuable resource for research and analysis, providing insights into the object\'s condition and history. Proper documentation ensures transparency and accountability in preservation practices.',
                  },
                  {
                    title: '6. Integrated Pest Management (IPM)',
                    icon: <Bug size={16} />,
                    content: 'This principal advocates for a holistic approach to pest control, minimizing the use of harmful chemicals. IPM involves regular monitoring for pests, implementing preventive measures, and using targeted treatments when necessary. This approach aims to protect collections from damage caused by insects, rodents, and other pests, while also protecting human health and the environment. IPM recognizes that a proactive approach is more effective than reactive pest control.',
                  },
                  {
                    title: '7. Disaster Preparedness and Response',
                    icon: <AlertTriangle size={16} />,
                    content: 'This principle emphasizes the importance of planning for and responding to disasters that could damage collections. This includes developing disaster preparedness plans, conducting regular drills, and establishing emergency response teams. It also involves implementing measures to mitigate damage during and after a disaster, such as salvaging wet materials and stabilizing damaged objects. This principle ensures that institutions are prepared to protect their collections in the event of a fire, flood, or other disaster.',
                  },
                  {
                    title: '8. Appropriate Environmental Controls',
                    icon: <Thermometer size={16} />,
                    content: 'This principal advocates for maintaining stable and appropriate environmental conditions for collections. This includes controlling temperature, humidity, light exposure, and air pollution. Stable environmental conditions minimize the rate of deterioration and prolong the lifespan of materials. Regular monitoring and adjustments are essential for maintaining optimal conditions. This principle is fundamental for creating a safe and stable environment for collections.',
                  },
                  {
                    title: '9. Education and Training',
                    icon: <Users size={16} />,
                    content: 'This principle emphasizes the importance of educating and training staff, volunteers, and users about proper preservation practices. This includes providing training on handling, storage, and environmental controls. It also involves raising awareness of the importance of preservation among the public. Education and training ensure that everyone involved in the care of collections understands and adheres to best practices.',
                  },
                  {
                    title: '10. Collaboration and Cooperation',
                    icon: <Handshake size={16} />,
                    content: 'This principle encourages collaboration and cooperation among institutions and professionals in the field of preservation. This includes sharing knowledge, expertise, and resources. Collaboration can lead to the development of best practices, the sharing of resources, and the advancement of preservation research. This principle recognizes that preservation is a collaborative effort, and that working together can lead to better outcomes.',
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

            {/* SECTION 4: Principles of Conservation */}
            <div
              ref={(el) => {
                sectionRefs.current['conservation-principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Conservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conservation principles guide the actions of conservators when treating and preserving cultural heritage objects. These principles aim to minimize damage, respect the object's integrity, and ensure that treatments are reversible and well-documented. Here is a breakdown of the key conservation principles:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Minimal Intervention',
                    icon: <Minimize size={16} />,
                    content: 'This principle dictates that any conservation treatment should be as minimal as possible, only addressing the necessary issues to stabilize or repair an object. The goal is to avoid unnecessary alterations that could potentially cause further damage or compromise the object\'s original character. Conservators strive to intervene only when absolutely necessary, focusing on the least invasive methods to achieve the desired outcome. This principle acknowledges that every intervention carries a risk, and that the best approach is often to leave the object as it is, as long as it is stable.',
                  },
                  {
                    title: '2. Reversibility',
                    icon: <RefreshCw size={16} />,
                    content: 'Ideally, any conservation treatment should be reversible, allowing for future interventions or corrections if necessary. This acknowledges that conservation techniques and materials may evolve over time, and what is considered best practice today might be outdated or harmful in the future. Reversible treatments ensure that future conservators have the option to undo or modify previous interventions, minimizing the risk of permanent damage. This principle is crucial for maintaining the long-term integrity of cultural heritage materials.',
                  },
                  {
                    title: '3. Compatibility',
                    icon: <LayersIcon size={16} />,
                    content: 'This principle emphasizes the use of materials that are compatible with the original object. Any materials used in conservation treatments or storage should be chemically stable and not cause adverse reactions with the original materials. This includes using archival-quality adhesives, solvents, and supports that are inert and non-reactive. Compatibility ensures that conservation efforts do not introduce new problems or accelerate deterioration. This is especially important when dealing with complex objects or materials that may react with each other.',
                  },
                  {
                    title: '4. Documentation',
                    icon: <Clipboard size={16} />,
                    content: 'Thorough documentation of all conservation treatments is essential. This includes detailed records of the object\'s condition before, during, and after treatment, as well as the materials and techniques used. Documentation provides a complete history of the object\'s care, allowing future conservators to understand past interventions and make informed decisions. It also serves as a valuable resource for research and analysis, providing insights into the object\'s condition and history. Proper documentation ensures transparency and accountability in conservation practices.',
                  },
                  {
                    title: '5. Respect for Original Materials and Craftsmanship',
                    icon: <Award size={16} />,
                    content: 'Conservators strive to preserve the original materials and craftsmanship of an object. This involves avoiding unnecessary alterations or replacements that could compromise the object\'s historical or artistic value. The goal is to maintain the object\'s authenticity and integrity, respecting the intent of the original creator. This principle acknowledges that the object\'s materials and construction are integral to its cultural significance.',
                  },
                  {
                    title: '6. Ethical Considerations',
                    icon: <Shield size={16} />,
                    content: 'Conservation practices are guided by ethical considerations, including respect for cultural values, community sensitivities, and the object\'s historical context. Conservators must consider the potential impact of their treatments on the object\'s cultural significance and consult with stakeholders when necessary. Ethical considerations also include avoiding conflicts of interest and maintaining professional integrity.',
                  },
                  {
                    title: '7. Scientific Analysis',
                    icon: <Microscope size={16} />,
                    content: 'Conservation treatments are often informed by scientific analysis of the object\'s materials and condition. This involves using techniques such as microscopy, spectroscopy, and chromatography to identify materials, assess deterioration, and evaluate the effectiveness of treatments. Scientific analysis ensures that conservation decisions are based on sound evidence and that treatments are appropriate for the object\'s specific needs.',
                  },
                  {
                    title: '8. Preventive Conservation Integration',
                    icon: <ShieldCheck size={16} />,
                    content: 'Conservation treatments should be integrated with preventive conservation measures to ensure the long-term preservation of the object. This involves creating a stable and controlled environment, implementing proper storage and handling procedures, and monitoring conditions to prevent future damage. Conservators work closely with other professionals, such as curators and collection managers, to ensure that objects are properly cared for.',
                  },
                  {
                    title: '9. Collaboration and Communication',
                    icon: <Handshake size={16} />,
                    content: 'Conservation often involves collaboration with other professionals, such as curators, scientists, and historians. Effective communication is essential for ensuring that all stakeholders understand the object\'s condition, the proposed treatments, and the potential risks and benefits. Collaboration ensures that conservation decisions are informed by diverse perspectives and that the object\'s cultural significance is properly considered.',
                  },
                  {
                    title: '10. Ongoing Research and Development',
                    icon: <TrendingUp size={16} />,
                    content: 'The field of conservation is constantly evolving, with new materials and techniques being developed. Conservators participate in ongoing research and development to improve their practices and ensure that they are using the most effective and ethical methods. This includes staying up to date on the latest scientific findings and sharing knowledge with colleagues. Ongoing research and development are essential for advancing the field of conservation and ensuring the long-term preservation of cultural heritage.',
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

            {/* SECTION 5: Significance of Preserving Records in Information Centres */}
            <div
              ref={(el) => {
                sectionRefs.current['significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of Preserving Records in Information Centres
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preserving records in information centres, whether they are archives, libraries, or records management facilities, is of paramount importance. These records serve as the collective memory of organizations, communities, and societies. Here is a breakdown of the significance:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ensuring Accountability and Transparency',
                    icon: <Shield size={16} />,
                    content: 'Records document actions, decisions, and transactions. In government, businesses, and other organizations, these records provide evidence of past activities, enabling accountability and transparency. They allow for the tracking of processes, the verification of claims, and the evaluation of performance. Without properly preserved records, it becomes difficult to hold individuals or institutions accountable for their actions. This is crucial for maintaining public trust and ensuring that organizations operate ethically and responsibly. Properly kept records can also help to prevent corruption and make it easier to detect if it has occurred.',
                  },
                  {
                    title: '2. Supporting Legal and Regulatory Compliance',
                    icon: <Clipboard size={16} />,
                    content: 'Many records are legally required to be maintained for specific periods. These might include financial records, contracts, legal documents, and regulatory filings. Preserving these records ensures compliance with laws and regulations, avoiding potential legal penalties or disputes. In legal cases, records can serve as crucial evidence, supporting claims or defences. This function is vital for protecting the rights of individuals and organizations. It also allows for the proper function of a legal system.',
                  },
                  {
                    title: '3. Facilitating Historical Research and Understanding',
                    icon: <BookOpen size={16} />,
                    content: 'Records provide invaluable insights into the past, documenting the evolution of societies, cultures, and organizations. They serve as primary sources for historical research, enabling scholars to reconstruct past events and understand historical contexts. Preserving records ensures that future generations have access to this information, fostering a deeper understanding of their heritage. This allows for the writing of accurate history and helps to preserve the collective memory of a group of people.',
                  },
                  {
                    title: '4. Enabling Efficient Decision-Making and Knowledge Management',
                    icon: <Target size={16} />,
                    content: 'Records contain valuable information that can inform decision-making processes. By preserving relevant records, organizations can access past experiences, lessons learned, and best practices. This can improve efficiency, reduce errors, and enhance strategic planning. Records also serve as a repository of institutional knowledge, ensuring that valuable information is not lost due to staff turnover or organizational changes. This helps to prevent the re-invention of the wheel and allows for the efficient transfer of knowledge.',
                  },
                  {
                    title: '5. Protecting Intellectual Property and Cultural Heritage',
                    icon: <Award size={16} />,
                    content: 'Records can document intellectual property rights, such as patents, copyrights, and trademarks. Preserving these records protects the rights of creators and innovators. Records also document cultural heritage, preserving artistic works, literary creations, and other forms of cultural expression. This function is essential for safeguarding cultural identity and promoting creativity. These records are the physical manifestation of cultural output and preserving them protects that output.',
                  },
                  {
                    title: '6. Ensuring Business Continuity and Disaster Recovery',
                    icon: <ShieldCheck size={16} />,
                    content: 'In the event of a disaster, such as a fire, flood, or cyberattack, records can be crucial for business continuity and recovery. Preserving backup copies of essential records ensures that organizations can resume operations quickly and efficiently. Records can also be used to reconstruct lost or damaged information. This helps to minimize disruption and ensure that organizations can recover from unexpected events.',
                  },
                  {
                    title: '7. Supporting Scientific Research and Innovation',
                    icon: <Microscope size={16} />,
                    content: 'Scientific records, such as research data, experimental results, and technical reports, are essential for advancing scientific knowledge and innovation. Preserving these records ensures that research findings are accessible to future scientists, enabling them to build upon past discoveries. Records also document the development of technologies and innovations, providing valuable insights into the history of science and technology. This allows for the continuation of scientific progress.',
                  },
                  {
                    title: '8. Promoting Public Awareness and Education',
                    icon: <Users size={16} />,
                    content: 'Records can be used to create educational resources, exhibitions, and public programs. This helps to raise public awareness of historical events, cultural heritage, and scientific discoveries. Records can also be used to educate the public about important social issues, promoting civic engagement and informed decision-making. This helps to create a more informed and engaged public.',
                  },
                  {
                    title: '9. Facilitating Genealogical Research',
                    icon: <Tree size={16} />,
                    content: 'Records such as birth certificates, marriage licenses, and census records are crucial for genealogical research. Preserving these records enables individuals to trace their family histories and connect with their ancestors. This helps people to understand their family history, and to connect with their past.',
                  },
                  {
                    title: '10. Maintaining Institutional Memory',
                    icon: <Archive size={16} />,
                    content: 'Records serve as the institutional memory of organizations. They document the history, evolution, and achievements of an organization, providing a sense of continuity and identity. Preserving these records ensures that valuable knowledge and experience are not lost over time. This helps to maintain the identity of an organization, and to preserve its history.',
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

            {/* SECTION 6: Challenges to Long Term Preservation of Records */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges to Long Term Preservation of Records
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The long-term preservation of records, whether physical or digital, faces a multitude of challenges that archivists, librarians, and information professionals must address. Here is a breakdown of some significant hurdles:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Environmental Degradation of Physical Records',
                    icon: <Sun size={16} />,
                    content: 'Physical records, especially those made of paper, are susceptible to environmental factors like fluctuations in temperature and humidity, light exposure, and air pollution. These factors can cause deterioration, including fading, brittleness, mold growth, and chemical decay. Even seemingly stable materials like photographs and audio-visual recordings can degrade over time. Controlling these environmental factors requires significant resources and ongoing monitoring, and even under optimal conditions, natural aging processes cannot be completely halted. This challenge demands careful planning, specialized storage, and continuous monitoring.',
                  },
                  {
                    title: '2. Physical Damage and Wear',
                    icon: <AlertTriangle size={16} />,
                    content: 'Physical records are vulnerable to damage from handling, accidents, and natural disasters. Frequent use can lead to wear and tear, while mishandling can result in tears, folds, and stains. Disasters like floods, fires, and earthquakes can cause extensive damage or complete loss of records. Repairing damaged records is often time-consuming and expensive, and some damage may be irreversible. This challenge requires careful handling procedures, robust storage infrastructure, and disaster preparedness plans.',
                  },
                  {
                    title: '3. Format Obsolescence in Digital Records',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Digital records face a unique challenge: format obsolescence. As technology evolves, older file formats and storage media become obsolete, making it difficult or impossible to access the data. This requires constant migration of digital objects to newer, more stable formats, a process that can be complex and resource intensive. Ensuring long-term access to digital information requires ongoing vigilance and proactive format management. This is a continuous battle against changing technology.',
                  },
                  {
                    title: '4. Data Migration and Integrity',
                    icon: <RefreshCw size={16} />,
                    content: 'Moving digital data from one storage medium or format to another can introduce errors or data loss. Ensuring the integrity of migrated data requires rigorous verification and validation processes. Maintaining the authenticity and reliability of digital records during migration is a critical challenge, especially for large and complex datasets. This is a very technical process and requires specialized skills and tools to avoid data corruption.',
                  },
                  {
                    title: '5. Storage and Scalability of Digital Data',
                    icon: <Server size={16} />,
                    content: 'Digital archives require vast amounts of storage space, which can become increasingly expensive as collections grow. Scalability is crucial to accommodate future growth and ensure efficient access to data. Managing large volumes of digital data requires robust storage infrastructure and efficient data management strategies. Cloud storage offers potential solutions, but also introduces new challenges related to security and long-term costs. The costs of digital storage, and the need to expand it, are always increasing.',
                  },
                  {
                    title: '6. Metadata Management',
                    icon: <Database size={16} />,
                    content: 'Metadata, or data about data, is essential for describing and organizing digital archives. Creating and maintaining accurate and consistent metadata is crucial for discoverability and long-term access. However, metadata creation can be time-consuming and labour-intensive. Developing effective metadata schemas and ensuring interoperability across different systems are significant challenges. If the metadata is poorly managed, the archives become difficult to use.',
                  },
                  {
                    title: '7. Authenticity and Provenance of Digital Records',
                    icon: <Fingerprint size={16} />,
                    content: 'Establishing the authenticity and provenance of digital records can be challenging, especially when dealing with born-digital materials. Digital objects can be easily altered or manipulated, making it difficult to verify their original state. Developing methods for digital forensics and ensuring the integrity of digital records is crucial for preserving their evidential value. This is especially important for legal and historical records.',
                  },
                  {
                    title: '8. Legal and Ethical Issues',
                    icon: <Shield size={16} />,
                    content: 'Digital archives raise complex legal and ethical issues related to copyright, privacy, and data ownership. Ensuring compliance with relevant laws and regulations is crucial for protecting the rights of creators and users. Developing clear policies for data access and use is essential for maintaining trust and transparency. These legal issues are constantly evolving and require ongoing monitoring and adaptation.',
                  },
                  {
                    title: '9. Technological Dependence and Rapid Change',
                    icon: <Zap size={16} />,
                    content: 'Digital archives are heavily dependent on technology, which can create vulnerabilities. Hardware and software failures, cyberattacks, and power outages can lead to data loss or inaccessibility. Keeping up with the rapid pace of technological change requires constant investment in new systems and training. This makes digital archives vulnerable to technological change.',
                  },
                  {
                    title: '10. Funding and Resource Constraints',
                    icon: <DollarSign size={16} />,
                    content: 'Long-term preservation, whether physical or digital, requires significant financial and human resources. Many archives and information centres face budget constraints and limited staffing, making it difficult to implement comprehensive preservation strategies. This challenge is exacerbated by the increasing complexity of digital preservation and the need for specialized expertise. This is a constant struggle for many institutions.',
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

            {/* SECTION 7: Standard Methods of Care and Repair, As Well As Reformatting Options */}
            <div
              ref={(el) => {
                sectionRefs.current['care-repair'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Standard Methods of Care and Repair, As Well As Reformatting Options
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When caring for and repairing archival materials, and when considering reformatting options, archivists follow established standards and best practices to ensure the preservation of valuable records. Here is a breakdown of standard methods:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Standard Methods of Care',
                    icon: <Shield size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Environmental Control:</strong> Maintaining stable and appropriate environmental conditions is fundamental to preservation. This includes controlling temperature, humidity, light exposure, and air pollution. Fluctuations in these factors can cause significant damage to archival materials. Archives often use climate control systems, UV filters on lights, and air filtration systems to create a stable environment. Regular monitoring and adjustments are essential for ensuring optimal conditions. This approach aims to minimize the rate of deterioration and prolong the lifespan of records.</li>
                        <li><strong>Proper Storage:</strong> Using archival-quality storage materials is crucial for protecting records from physical and chemical damage. This includes acid-free boxes, folders, and interleaving paper, as well as inert plastic sleeves and enclosures. Proper storage also involves organizing materials in a way that minimizes handling and physical stress. Shelving and storage areas should be clean, dry, and free from pests. This method aims to prevent damage from occurring in the first place, and to prolong the life of the records.</li>
                        <li><strong>Handling Guidelines:</strong> Implementing strict handling guidelines is essential for minimizing physical damage during use. This includes training staff and researchers on proper handling techniques, such as wearing gloves, using book cradles, and avoiding excessive pressure or bending. Clear instructions and signage can also help to prevent damage. This method helps to prevent damage from occurring during research, or other uses of the records.</li>
                        <li><strong>Integrated Pest Management (IPM):</strong> Employing an integrated pest management approach is crucial for protecting collections from damage caused by insects, rodents, and other pests. IPM involves regular monitoring, preventive measures, and targeted treatments when necessary. This approach minimizes the use of harmful chemicals and protects both collections and human health. This method makes sure that pests do not damage the collections.</li>
                        <li><strong>Disaster Preparedness and Response:</strong> Developing and implementing disaster preparedness and response plans is essential for mitigating damage in the event of a fire, flood, or other disaster. This includes conducting regular drills, establishing emergency response teams, and implementing measures to salvage and stabilize damaged materials. This method helps to minimize damage, if and when, a disaster occurs.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Standard Methods of Repair (Conservation Treatment)',
                    icon: <Wrench size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Surface Cleaning:</strong> Removing surface dirt, dust, and mold is often the first step in conservation treatment. This can be done using soft brushes, erasers, and vacuum cleaners with HEPA filters. Surface cleaning helps to prevent further damage and improve the aesthetic appearance of records.</li>
                        <li><strong>Tear Repair and Mending:</strong> Repairing tears and mending weakened areas is a common conservation treatment. This may involve using archival-quality papers, adhesives, and tapes. The goal is to stabilize the damage and prevent further tearing.</li>
                        <li><strong>Humidification and Flattening:</strong> Humidifying and flattening curled or creased documents can help to restore their original shape and prevent further damage. This involves carefully introducing moisture into the paper and then pressing it between blotters or weights.</li>
                        <li><strong>Deacidification:</strong> Deacidifying acidic paper is a crucial treatment for prolonging the life of many documents. This involves neutralizing the acids that cause paper to become brittle and deteriorate.</li>
                        <li><strong>Encapsulation and Lamination (with caution):</strong> Encapsulation and lamination can provide physical support and protection for fragile documents. However, these methods should be used with caution, as they can be difficult to reverse and may not be suitable for all materials. Encapsulation involves sealing a document in inert plastic, while lamination involves bonding it to a plastic film. Lamination is generally frowned upon, and encapsulation is used sparingly.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Reformatting Options',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Digitization:</strong> Digitizing archival materials involves creating digital copies of documents, photographs, and other records. This makes them accessible online and reduces the need for physical handling. Digitization also enables advanced search and retrieval capabilities.</li>
                        <li><strong>Microfilming:</strong> Microfilming involves creating photographic copies of documents on microfilm. This provides a long-term preservation option and reduces storage space requirements. Microfilm is a stable medium with a long lifespan.</li>
                        <li><strong>Photocopying (with caution):</strong> Photocopying can be used to create working copies of documents, reducing the need to handle originals. However, this method should be used with caution, as some photocopying processes can damage fragile materials.</li>
                        <li><strong>Audio and Video Reformatting:</strong> Reformatting audio and video recordings involve transferring them to newer, more stable formats. This is essential for preserving the content of these recordings, as older formats can become obsolete.</li>
                        <li><strong>Transcription:</strong> Transcription, the process of converting audio or handwritten documents into text, can be done. This greatly aids in searching records.</li>
                        <li><strong>Born Digital migration:</strong> Born digital records, such as email, and digital documents, must be migrated to newer file formats, and storage mediums, to ensure long term access.</li>
                      </ul>
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

            {/* SECTION 8: Methods Used in Repairing Damaged Records */}
            <div
              ref={(el) => {
                sectionRefs.current['repair-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods Used in Repairing Damaged Records
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Repairing damaged records requires careful consideration and specialized techniques to ensure the preservation of valuable materials. Conservators employ a variety of methods, depending on the type and extent of damage. Here is a breakdown of common repair techniques:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Surface Cleaning',
                    icon: <Sparkle size={16} />,
                    content: 'Often the first step in any repair process, surface cleaning involves removing loose dirt, dust, mold, and other debris from the surface of the record. This is typically done using soft brushes, erasers, and specialized vacuum cleaners with HEPA filters. The goal is to prevent further damage from abrasive particles or biological growth. This method is crucial because it creates a clean working environment, and also helps to identify any further damage that may be hidden under the dirt.',
                  },
                  {
                    title: '2. Tear Repair and Mending',
                    icon: <Scissors size={16} />,
                    content: 'Tears and small holes are common forms of damage, especially in paper documents. Conservators use archival-quality paper mending tissues and adhesives to repair these damages. The mending tissue is carefully applied to the tear, ensuring that it aligns with the original fibres of the paper. Adhesives are chosen for their stability and reversibility, minimizing the risk of future damage. This method helps to restore the structural integrity of the record.',
                  },
                  {
                    title: '3. Paper Pulp Repair (Paper Casting)',
                    icon: <File size={16} />,
                    content: 'For records with significant losses or holes, paper pulp repair, also known as paper casting, can be used. This technique involves filling the losses with a pulp made from cotton or other archival-quality fibres. The pulp is carefully matched to the colour and texture of the original paper, creating a seamless repair. This method is used for more extensive damage, where mending tissue is not enough.',
                  },
                  {
                    title: '4. Humidification and Flattening',
                    icon: <RefreshCw size={16} />,
                    content: 'Curled, creased, or folded documents can be difficult to handle and may be prone to further damage. Humidification involves carefully introducing moisture into the paper to relax the fibres and make them more pliable. Once humidified, the document is flattened between blotters or weights to restore its original shape. This method makes the documents easier to handle and read.',
                  },
                  {
                    title: '5. Deacidification',
                    icon: <Droplet size={16} />,
                    content: 'Acidic paper is a major cause of deterioration in many archival documents. Deacidification involves neutralizing the acids in the paper, preventing it from becoming brittle and discoloured. This can be done using various chemical solutions, either by immersion or spraying. This method is a preventative measure, that stops further decay of the paper.',
                  },
                  {
                    title: '6. Encapsulation',
                    icon: <Lock size={16} />,
                    content: 'Encapsulation involves sealing a document in inert polyester film. This provides physical support and protection, making the document easier to handle and view. Encapsulation is typically used for fragile or frequently handled documents. While it does not repair existing damage, it prevents further deterioration. This is a protective measure, rather than a repair method.',
                  },
                  {
                    title: '7. Lining and Backing',
                    icon: <LayersIcon size={16} />,
                    content: 'Weakened or fragile documents can be strengthened by lining or backing them with archival-quality paper or fabric. This provides additional support and prevents further tearing or damage. The lining or backing material is carefully adhered to the back of the document, ensuring that it is compatible with the original materials. This method is a structural support method.',
                  },
                  {
                    title: '8. Specialized Treatments for Photographs and Audio-Visual Materials',
                    icon: <Camera size={16} />,
                    content: 'Photographs and audio-visual materials require specialized conservation techniques due to their unique composition. This may involve cleaning, stabilizing, or rehousing these materials in appropriate enclosures. Digital reformatting is often used to create working copies and minimize handling of originals. These items have their own specialized repair methods.',
                  },
                  {
                    title: '9. Binding Repair',
                    icon: <Book size={16} />,
                    content: 'Bound records, such as books and ledgers, may require binding repair to restore their structural integrity. This can involve repairing or replacing damaged spines, covers, or pages. Binding repair ensures that the records can be handled and used without further damage. This is a specialized skill and requires a book binder.',
                  },
                  {
                    title: '10. Mold Remediation',
                    icon: <AlertCircle size={16} />,
                    content: 'Records affected by mold require specialized treatment to remove the mold and prevent its recurrence. This involves cleaning the records with appropriate solutions and ensuring that they are thoroughly dried. Environmental controls are also crucial for preventing mold growth. This is a specialized repair, and requires careful handling, as mold can be a health hazard.',
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

            {/* SECTION 9: Equipment and Materials Used in a Conservation Unit */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Equipment and Materials Used in a Conservation Unit
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A conservation unit, dedicated to the preservation and repair of archival and museum materials, requires a range of specialized equipment and materials. These tools and supplies enable conservators to perform their work effectively and safely, ensuring the long-term care of valuable collections. Here is a breakdown of the essential equipment and materials:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Conservation Workstations and Tools',
                    icon: <Wrench size={16} />,
                    content: 'Conservation workstations provide a clean, stable, and well-lit workspace for conservators. These workstations are often equipped with adjustable lighting, magnification tools, and fume hoods for working with solvents. Hand tools are also essential, including scalpels, spatulas, tweezers, brushes, and bone folders. These tools are used for delicate tasks such as tear repair, surface cleaning, and adhesive application. Precision and control are paramount in conservation work, making high-quality tools essential. The workstations are designed to be adjustable, and ergonomic, to ensure the conservator can work comfortably for long periods of time.',
                  },
                  {
                    title: '2. Specialized Cleaning Supplies',
                    icon: <Sparkle size={16} />,
                    content: 'Cleaning archival materials requires specialized supplies that are gentle and non-reactive. This includes soft brushes, erasers (such as grated vinyl erasers), sponges, and cotton swabs. Specialized vacuum cleaners with HEPA filters are used to remove dust and debris from delicate surfaces. Solvents, such as ethanol and acetone, are used for more thorough cleaning, but require proper ventilation and safety precautions. These supplies ensure that cleaning is effective without causing further damage to the artifacts.',
                  },
                  {
                    title: '3. Adhesives and Mending Materials',
                    icon: <Package size={16} />,
                    content: 'A variety of archival-quality adhesives and mending materials are essential for repairing tears, mending weakened areas, and reattaching detached pieces. These include heat-set tissue, Japanese paper, starch paste, and synthetic adhesives. Adhesives are selected for their stability, reversibility, and compatibility with the original materials. Mending materials are chosen for their strength, flexibility, and archival quality. These materials are used to create repairs that are both strong, and long lasting.',
                  },
                  {
                    title: '4. Humidification and Flattening Equipment',
                    icon: <RefreshCw size={16} />,
                    content: 'Humidification chambers and ultrasonic humidifiers are used to introduce moisture into paper documents, making them more pliable for flattening. Flattening presses, weights, and blotters are then used to flatten curled or creased documents. These tools help to restore documents to their original shape and prevent further damage. This equipment is used to make damaged documents easier to handle and read.',
                  },
                  {
                    title: '5. Deacidification Equipment and Solutions',
                    icon: <Droplet size={16} />,
                    content: 'Deacidification involves neutralizing the acids in paper documents to prevent them from becoming brittle and discoloured. This can be done using various chemical solutions and equipment, such as sprayers, immersion tanks, and mass deacidification systems. These solutions and equipment are used to slow the deterioration of acidic paper.',
                  },
                  {
                    title: '6. Encapsulation and Mounting Materials',
                    icon: <Lock size={16} />,
                    content: 'Encapsulation involves sealing documents in inert polyester film to provide physical support and protection. This requires specialized heat-sealing equipment and polyester film. Mounting materials, such as archival-quality boards and adhesives, are used to mount documents and photographs for display or storage. These materials are used to protect fragile documents and make them easier to handle.',
                  },
                  {
                    title: '7. Binding Repair Tools and Materials',
                    icon: <Book size={16} />,
                    content: 'Binding repair requires specialized tools and materials, such as bone folders, awls, needles, threads, and leather paring tools. Archival-quality binding materials, such as linen thread, leather, and book cloth, are used to repair or replace damaged bindings. These tools and materials are used to restore the structural integrity of bound records.',
                  },
                  {
                    title: '8. Photographic Conservation Equipment and Supplies',
                    icon: <Camera size={16} />,
                    content: 'Photographic conservation requires specialized equipment and supplies for cleaning, stabilizing, and rehousing photographs. This includes specialized cleaning solutions, archival-quality enclosures, and cold storage for certain types of photographs. Digital imaging equipment is also used to create digital surrogates of photographs. These items are used to care for and preserve photographic records.',
                  },
                  {
                    title: '9. Audio-Visual Conservation Equipment and Supplies',
                    icon: <Video size={16} />,
                    content: 'Audio-visual conservation involves specialized equipment for reformatting and preserving audio and video recordings. This includes playback equipment, digitization equipment, and specialized storage solutions. These items are used to transfer recordings to newer, more stable formats.',
                  },
                  {
                    title: '10. Analytical Equipment',
                    icon: <Microscope size={16} />,
                    content: 'Analytical equipment, such as microscopes, spectrometers, and pH meters, is used to examine materials and assess their condition. This equipment helps conservators identify materials, assess deterioration, and evaluate the effectiveness of treatments. This equipment allows conservators to make informed decisions about conservation treatments.',
                  },
                  {
                    title: '11. Safety Equipment',
                    icon: <Shield size={16} />,
                    content: 'Safety equipment is essential for protecting conservators from hazardous materials and working conditions. This includes fume hoods, respirators, gloves, and eye protection. Proper ventilation and safety protocols are also crucial. These items are used to ensure the safety of the conservators.',
                  },
                  {
                    title: '12. Documentation Equipment and Software',
                    icon: <Clipboard size={16} />,
                    content: 'Documentation is a crucial part of conservation work. This includes digital cameras, scanners, and specialized software for documenting the condition of objects before, during, and after treatment. Detailed documentation ensures transparency and accountability in conservation practices. This equipment is used to create detailed records of conservation treatments.',
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

            {/* SECTION 10: Duties and Responsibilities of a Conservator */}
            <div
              ref={(el) => {
                sectionRefs.current['conservator'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Duties and Responsibilities of a Conservator
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A conservator plays a vital role in preserving cultural heritage, whether it is in archives, museums, or libraries. Their duties and responsibilities are diverse and require a blend of scientific knowledge, artistic skill, and ethical considerations. Here is a breakdown of their key roles:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Examination and Assessment of Objects',
                    icon: <Microscope size={16} />,
                    content: 'Conservators begin by thoroughly examining objects to assess their condition and identify any damage or deterioration. This involves visual inspection, scientific analysis, and documentation. They analyse materials, identify causes of damage, and determine the extent of deterioration. This assessment is crucial for developing appropriate treatment plans. They must be able to recognize different types of materials and understand how they degrade over time. This stage is the foundation for all subsequent conservation work.',
                  },
                  {
                    title: '2. Development and Implementation of Treatment Plans',
                    icon: <Target size={16} />,
                    content: 'Based on the examination, conservators develop treatment plans that outline the necessary conservation interventions. These plans are tailored to the specific needs of each object, considering its materials, condition, and historical significance. They select appropriate conservation techniques and materials, ensuring compatibility and reversibility. They also document the treatment process, including materials used and procedures followed. This stage requires careful planning and consideration, as every treatment can have long-term effects on the object.',
                  },
                  {
                    title: '3. Conservation Treatment and Stabilization',
                    icon: <Wrench size={16} />,
                    content: 'Conservators perform hands-on treatments to repair damage and stabilize objects. This might involve cleaning, repairing tears, mending broken pieces, consolidating fragile materials, or removing harmful substances. They use specialized tools and techniques to minimize further deterioration and preserve the object\'s integrity. This stage requires precision, skill, and a deep understanding of materials and conservation methods. They must be able to work carefully and meticulously, often under magnification.',
                  },
                  {
                    title: '4. Preventive Conservation',
                    icon: <Shield size={16} />,
                    content: 'Conservators also implement preventive conservation measures to minimize future damage. This involves monitoring environmental conditions (temperature, humidity, light) and recommending appropriate storage and display methods. They advise on handling procedures, pest management, and disaster preparedness. They work to create a stable and safe environment for collections, preventing damage before it occurs. This proactive approach is crucial for long-term preservation.',
                  },
                  {
                    title: '5. Documentation and Record Keeping',
                    icon: <Clipboard size={16} />,
                    content: 'Conservators maintain detailed records of all examinations, treatments, and preventive conservation measures. This documentation is essential for tracking the object\'s condition and treatment history. It also serves as a valuable resource for research and future conservation efforts. Accurate and thorough documentation ensures transparency and accountability in conservation practices. This is vital for understanding the object\'s history, and for informing future conservation decisions.',
                  },
                  {
                    title: '6. Research and Analysis',
                    icon: <TrendingUp size={16} />,
                    content: 'Conservators conduct research on conservation materials, techniques, and best practices. They stay up to date on new developments in the field and contribute to the advancement of conservation science. They analyse materials and assess the effectiveness of treatments. This research ensures that conservation practices are based on sound scientific principles. They also conduct research into the history of objects, to better understand their construction, and previous repairs.',
                  },
                  {
                    title: '7. Collaboration and Communication',
                    icon: <Handshake size={16} />,
                    content: 'Conservators collaborate with curators, collection managers, and other professionals to ensure the proper care of collections. They communicate their findings and recommendations clearly and effectively. They also work with researchers and the public to educate them about conservation practices. This collaboration ensures that conservation decisions are informed by diverse perspectives.',
                  },
                  {
                    title: '8. Ethical Considerations',
                    icon: <Shield size={16} />,
                    content: 'Conservators adhere to ethical guidelines that prioritize the preservation of cultural heritage and respect the integrity of objects. They avoid unnecessary interventions and strive for reversibility in their treatments. They also consider the cultural significance of objects and consult with stakeholders when necessary. These ethical considerations guide their decision-making and ensure that conservation practices are responsible and respectful.',
                  },
                  {
                    title: '9. Training and Education',
                    icon: <Users size={16} />,
                    content: 'Conservators often participate in training and education activities to share their knowledge and expertise. They may teach workshops, give presentations, or mentor students. They also stay up to date on new developments in the field through continuing education. This helps to ensure that conservation practices are passed on to future generations.',
                  },
                  {
                    title: '10. Advocacy for Preservation',
                    icon: <Award size={16} />,
                    content: 'Conservators advocate for the importance of preservation and the need for adequate resources to support conservation efforts. They raise awareness of the challenges facing cultural heritage and promote best practices for its care. They work to ensure that preservation is a priority in institutions and communities. This advocacy helps to ensure the long-term survival of cultural heritage.',
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
                  💡 Preservation Insight
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
                  <span>Preservation Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Conservation Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Repair Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Preservation prevents damage (environmental control, storage, handling); conservation repairs existing damage (treatment, restoration). Both follow key principles: minimal intervention, reversibility, compatibility, documentation, and preventive care. Records preservation ensures accountability, compliance, historical research, decision-making, and cultural heritage protection. Challenges include environmental degradation, format obsolescence, and funding. Conservators examine, treat, research, and advocate for cultural heritage preservation.
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
                <strong className="text-white">Preservation vs Conservation</strong> – Preservation prevents damage (environmental control, storage, handling). Conservation repairs existing damage (treatment, restoration). Both are essential for record care.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation Principles</strong> – Preventive care, minimal intervention, reversibility, compatibility, documentation, IPM, disaster preparedness, environmental controls, education, and collaboration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conservation Principles</strong> – Minimal intervention, reversibility, compatibility, documentation, respect for original materials, ethics, scientific analysis, preventive integration, collaboration, and ongoing research.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Significance &amp; Challenges</strong> – Preservation ensures accountability, legal compliance, historical research, and cultural heritage protection. Challenges include environmental degradation, format obsolescence, metadata management, and funding constraints.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Repair &amp; Conservation</strong> – Standard methods: surface cleaning, tear repair, humidification, deacidification, encapsulation. Conservators examine, treat, research, advocate, and collaborate to preserve cultural heritage.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 1 (Preservation &amp; Conservation)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;