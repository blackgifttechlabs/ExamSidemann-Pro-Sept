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

  // ─── Icons specific to this LO1 content ────────────────────────────────
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
  Minimize,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'deterioration', label: 'Deterioration' },
  { id: 'causes', label: 'Causes' },
  { id: 'control-methods', label: 'Control Methods' },
  { id: 'advantages-limitations', label: 'Advantages & Limitations' },
  { id: 'conservation', label: 'Conservation Methods' },
  { id: 'applying-methods', label: 'Applying Methods' },
  { id: 'principles', label: 'Principles' },
  { id: 'worksheet', label: 'Worksheet' },
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
        text: 'The oldest known archives date back over 5,000 years to ancient Mesopotamia, where clay tablets were used to record administrative and legal documents.',
      },
      {
        title: 'Pro Tip',
        text: 'Always store records in a climate-controlled environment with stable temperature (18-20°C) and relative humidity (45-55%) to slow chemical deterioration.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six causes of deterioration: Environmental, Biological, Chemical, Physical, Technological, and Human (Handling).',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that once records are digitised, the originals can be discarded – but original materials often have legal, historical, or intrinsic value beyond their informational content.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The oldest known archives date back over 5,000 years to ancient Mesopotamia, where clay tablets were used to record administrative and legal documents.',
      },
      {
        title: 'Pro Tip',
        text: 'Always store records in a climate-controlled environment with stable temperature (18-20°C) and relative humidity (45-55%) to slow chemical deterioration.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six causes of deterioration: Environmental, Biological, Chemical, Physical, Technological, and Human (Handling).',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that once records are digitised, the originals can be discarded – but original materials often have legal, historical, or intrinsic value beyond their informational content.',
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
            Records Deterioration &amp; Conservation Methods —{' '}
            <span className="text-emerald-300 font-bold italic">
              Preservation &amp; Restoration
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to records deterioration categories, causes, control methods, conservation techniques, and conservation worksheets.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Deterioration
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Conservation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Restoration
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
            {/* SECTION 1: Records Deterioration */}
            <div
              ref={(el) => {
                sectionRefs.current['deterioration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Deterioration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records deterioration refers to the gradual degradation and damage that records undergo over time, affecting their physical integrity and informational content. It is the process by which records lose their original quality and become less usable or even unusable.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Categories of Records Deterioration
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Physical Deterioration:</strong> This category involves damage to the physical materials of the record, such as paper, film, or magnetic media. Examples include tears, creases, fading, brittleness, and mold growth. Physical deterioration can be caused by factors like poor handling, improper storage, and environmental conditions.</li>
                  <li><strong>Chemical Deterioration:</strong> Chemical deterioration occurs when the materials of the record undergo chemical reactions, leading to their breakdown. This can be caused by factors such as acidity in paper, oxidation of film, or the breakdown of adhesives. Chemical deterioration often results in discoloration, embrittlement, and the release of harmful substances.</li>
                  <li><strong>Biological Deterioration:</strong> Biological deterioration is caused by living organisms, such as insects, mold, and rodents. These organisms can feed on or damage the record materials, leading to significant deterioration. High humidity and temperature can encourage biological growth.</li>
                  <li><strong>Environmental Deterioration:</strong> Environmental deterioration is caused by external factors such as light, temperature, humidity, and pollutants. Excessive light can cause fading and discoloration, while fluctuating temperature and humidity can lead to warping and cracking. Air pollutants can react with record materials, causing chemical deterioration.</li>
                  <li><strong>Mechanical Deterioration:</strong> This damage is caused by physical forces. This can include damage from improper handling, such as folding documents, or from damage from equipment, such as a paper shredder.</li>
                  <li><strong>Information Deterioration:</strong> While not always physical, this is the loss of the information contained within the record. This can occur with digital media that becomes obsolete, or with data corruption. This can also occur when written records become unreadable due to physical or chemical deterioration.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Causes of Records Deterioration */}
            <div
              ref={(el) => {
                sectionRefs.current['causes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Causes of Records Deterioration
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records deterioration is a complex process influenced by a variety of factors, both internal and external. Understanding these causes is crucial for developing effective preservation strategies.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Environmental Factors',
                    icon: <Sun size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Temperature and Humidity:</strong> Fluctuations in temperature and humidity can cause materials to expand and contract, leading to warping, cracking, and embrittlement. High humidity promotes mold growth and insect infestation, while excessive dryness can cause materials to become brittle.</li>
                        <li><strong>Light:</strong> Ultraviolet (UV) and visible light can cause fading, discoloration, and chemical breakdown of record materials. Prolonged exposure to light can weaken paper and other organic materials.</li>
                        <li><strong>Pollutants:</strong> Air pollutants, such as sulfur dioxide, nitrogen oxides, and ozone, can react with record materials, causing chemical deterioration. These pollutants can come from industrial emissions, vehicle exhaust, and other sources.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Biological Factors',
                    icon: <Bug size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Mold and Fungi:</strong> High humidity and poor ventilation create ideal conditions for mold and fungi growth. These organisms can stain, weaken, and ultimately destroy record materials.</li>
                        <li><strong>Insects and Rodents:</strong> Insects, such as silverfish and bookworms, and rodents, such as mice and rats, can feed on and damage record materials. They can chew through paper, cardboard, and other materials, leaving behind droppings and other debris.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Chemical Factors',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Acidic Materials:</strong> Many paper-based records are made from acidic materials, which can cause them to become brittle and discolored over time. Acid hydrolysis is a primary cause of paper deterioration.</li>
                        <li><strong>Oxidation:</strong> Oxidation reactions can cause the breakdown of materials, such as film and magnetic media. This process is accelerated by exposure to oxygen, light, and heat.</li>
                        <li><strong>Internal Chemical Decay:</strong> Some materials, particularly older plastics and films, contain chemicals that breakdown over time, causing damage to the items.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Physical Factors',
                    icon: <Handshake size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Improper Handling:</strong> Rough handling, such as folding, tearing, and dropping records, can cause physical damage.</li>
                        <li><strong>Poor Storage:</strong> Inadequate storage conditions, such as overcrowding, improper shelving, and the use of inappropriate storage materials, can contribute to physical deterioration.</li>
                        <li><strong>Disasters:</strong> Natural disasters, such as floods, fires, and earthquakes, can cause significant damage to records.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Technological Factors',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Obsolescence:</strong> Digital records can become inaccessible due to technological obsolescence. Hardware and software become outdated, making it difficult or impossible to retrieve data.</li>
                        <li><strong>Data Corruption:</strong> Digital data can be corrupted due to hardware failures, software errors, or malicious attacks.</li>
                        <li><strong>Media Degradation:</strong> Digital storage media, such as CDs, DVDs, and hard drives, have a limited lifespan and can degrade over time.</li>
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

            {/* SECTION 3: Methods to Control Damage and Deterioration */}
            <div
              ref={(el) => {
                sectionRefs.current['control-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods to Control Damage and Deterioration of Records
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Controlling damage and deterioration of records involves a range of methods aimed at preventing or mitigating the various factors that contribute to their degradation.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Environmental Control:</strong> This method focuses on maintaining stable and appropriate environmental conditions within storage areas. It involves regulating temperature, humidity, light, and air pollutants to minimize chemical, physical, and biological deterioration. This includes using climate control systems, air filtration, and UV-filtering lighting.</li>
                  <li><strong>Proper Storage and Handling:</strong> This method emphasizes the use of appropriate storage materials and handling techniques to protect records from physical damage. It includes using acid-free boxes and folders, proper shelving, and training staff on safe handling procedures. This also includes proper packing and moving of records.</li>
                  <li><strong>Integrated Pest Management (IPM):</strong> IPM is a strategy for controlling pests, such as insects and rodents, that can damage records. It involves monitoring pest activity, implementing preventive measures, and using targeted treatments when necessary. This approach minimizes the use of harmful pesticides.</li>
                  <li><strong>Disaster Preparedness and Recovery:</strong> This method focuses on developing plans and procedures for responding to disasters, such as floods, fires, and earthquakes. It includes creating disaster recovery plans, conducting drills, and establishing emergency response teams. This also includes backing up digital records.</li>
                  <li><strong>Digitization and Reformatting:</strong> This method involves converting analog records to digital formats or reformatting deteriorating materials to more stable formats. This helps to preserve the informational content of records and improve access.</li>
                  <li><strong>Conservation Treatments:</strong> This method entails the physical treatment of damaged records, such as cleaning, repairing, and strengthening materials. This is done by professional conservators, and is used to restore records to their original condition as much as possible.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Advantages and Limitations of Each Method */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages-limitations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages and Limitations of Each Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Environmental Control',
                    icon: <Sun size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Prolongs the lifespan of records by minimizing deterioration.</li>
                          <li>Creates a stable environment that reduces chemical and biological damage.</li>
                          <li>Helps to prevent mold growth and insect infestation.</li>
                          <li>Can control the rate of chemical reactions.</li>
                          <li>Provides a safe environment for a wide array of media.</li>
                          <li>Reduces the need for constant remedial conservation.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>High initial and ongoing costs for equipment and energy.</li>
                          <li>Requires constant monitoring and maintenance.</li>
                          <li>Can be difficult to achieve and maintain stable conditions in all areas.</li>
                          <li>Equipment failures can lead to rapid deterioration.</li>
                          <li>Can be difficult to implement in older buildings.</li>
                          <li>May not be effective against existing damage.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Proper Storage and Handling',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Relatively low cost and easy to implement.</li>
                          <li>Reduces physical damage from mishandling.</li>
                          <li>Provides a protective barrier against dust and pollutants.</li>
                          <li>Helps to organize and locate records efficiently.</li>
                          <li>Prevents crushing and warping of records.</li>
                          <li>Can be implemented in almost any setting.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Does not address chemical or biological deterioration.</li>
                          <li>Requires ongoing training and enforcement.</li>
                          <li>Can be labor-intensive to implement and maintain.</li>
                          <li>Inadequate storage materials can cause damage.</li>
                          <li>Can take up a large amount of space.</li>
                          <li>Relies on human behavior, which can be inconsistent.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Integrated Pest Management (IPM)',
                    icon: <Bug size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Minimizes the use of harmful pesticides.</li>
                          <li>Provides a long-term solution to pest problems.</li>
                          <li>Reduces the risk of damage from insects and rodents.</li>
                          <li>Helps to maintain a clean and healthy environment.</li>
                          <li>Can be tailored to specific pest problems.</li>
                          <li>Is less harmful to humans and records than chemical pest control.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Requires ongoing monitoring and inspection.</li>
                          <li>Can be time-consuming and labor-intensive.</li>
                          <li>May not be effective against severe infestations.</li>
                          <li>Requires knowledge of pest biology and behavior.</li>
                          <li>Can be slow to produce results.</li>
                          <li>Requires consistent application of IPM principles.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Disaster Preparedness and Recovery',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Minimizes the impact of disasters on records.</li>
                          <li>Ensures business continuity and recovery.</li>
                          <li>Protects valuable and irreplaceable records.</li>
                          <li>Provides a framework for responding to emergencies.</li>
                          <li>Helps to prioritize records for recovery.</li>
                          <li>Can reduce insurance costs.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Requires significant planning and resources.</li>
                          <li>Can be difficult to predict and prepare for all types of disasters.</li>
                          <li>Recovery efforts can be time-consuming and expensive.</li>
                          <li>Damage may be irreversible in some cases.</li>
                          <li>Plans must be regularly updated.</li>
                          <li>Human error during a disaster can worsen the situation.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Digitization and Reformatting',
                    icon: <Scan size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Improves access to records.</li>
                          <li>Reduces the need to handle original records.</li>
                          <li>Creates backup copies of records.</li>
                          <li>Can enhance the quality of deteriorating records.</li>
                          <li>Saves physical storage space.</li>
                          <li>Allows for easy sharing and distribution.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>High initial costs for equipment and labor.</li>
                          <li>Requires ongoing maintenance of digital files.</li>
                          <li>Technological obsolescence can render digital files inaccessible.</li>
                          <li>Digital files can be vulnerable to data corruption and cyberattacks.</li>
                          <li>Copyright and privacy issues can arise.</li>
                          <li>Quality of digital copies may not always match the original.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Conservation Treatments',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Restores damaged records to their original condition.</li>
                          <li>Prolongs the lifespan of valuable records.</li>
                          <li>Reverses the effects of deterioration.</li>
                          <li>Can stabilize fragile materials.</li>
                          <li>Maintains the original artifact.</li>
                          <li>Can be used to treat a wide variety of materials.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Highly specialized and expensive.</li>
                          <li>Can be time-consuming and labor-intensive.</li>
                          <li>May not be able to fully reverse severe damage.</li>
                          <li>Requires specialized equipment and facilities.</li>
                          <li>Risk of further damage if not performed correctly.</li>
                          <li>May not be cost-effective for all records.</li>
                        </ul>
                      </>
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

            {/* SECTION 5: Records Conservation Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['conservation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Conservation Methods
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records conservation refers to the specialized techniques and treatments used to repair, stabilize, and preserve damaged or deteriorating records. It aims to extend the lifespan of records by addressing physical and chemical deterioration, ensuring their continued accessibility and usability.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Sparkle size={16} /> Examining Records Conservation Methods
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Surface Cleaning:</strong> This method involves the removal of dust, dirt, mold, and other surface contaminants from records. It can be done using soft brushes, erasers, or specialized cleaning solutions. This is a first step in many conservation processes.</li>
                  <li><strong>Paper Repair:</strong> This includes techniques for repairing tears, holes, and weakened areas in paper records. Methods include using archival-quality tapes, Japanese tissue paper, and starch paste.</li>
                  <li><strong>Deacidification:</strong> This process neutralizes the acids in paper that cause it to become brittle and discolored. It involves applying alkaline solutions to the paper, either through spraying, immersion, or vapor treatment.</li>
                  <li><strong>Encapsulation:</strong> This method involves sealing records in archival-quality polyester or other inert materials. It provides a protective barrier against dust, pollutants, and physical damage.</li>
                  <li><strong>Bookbinding and Repair:</strong> This involves the repair and restoration of bound records, such as books and manuscripts. Techniques include rebinding, spine repair, and replacing damaged covers.</li>
                  <li><strong>Photographic Conservation:</strong> This includes specialized techniques for preserving photographic materials, such as film, negatives, and prints. Methods include cleaning, stabilizing, and rehousing photographs.</li>
                  <li><strong>Digitization:</strong> While not always thought of as purely conservation, digitization creates a stable copy of the item. This allows the original to be stored safely, and the digital copy to be used.</li>
                  <li><strong>Cold Storage:</strong> Storing records in a cold environment greatly slows the chemical deterioration of records. This is especially useful for photographs, and film.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 6: Applying Various Methods to Deteriorating Records */}
            <div
              ref={(el) => {
                sectionRefs.current['applying-methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Applying Various Methods to Deteriorating Records
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>For brittle, acidic paper records:</strong> Deacidification followed by encapsulation or paper repair would be appropriate. Deacidification will neutralize the acids that are causing the paper to degrade, while encapsulation or repair will provide physical support.</li>
                  <li><strong>For records with mold growth:</strong> Surface cleaning with appropriate mold removal techniques is essential. Environmental control to reduce humidity is also crucial to prevent future mold growth.</li>
                  <li><strong>For torn or damaged paper records:</strong> Paper repair using archival-quality materials would be necessary. The specific technique would depend on the extent and type of damage.</li>
                  <li><strong>For fading photographs:</strong> Photographic conservation techniques, such as cleaning and stabilizing, would be needed. Digitization can create a backup. Cold storage can slow further fading.</li>
                  <li><strong>For deteriorating bound records:</strong> Bookbinding and repair techniques would be used to restore the structural integrity of the book. This might involve rebinding, spine repair, or replacing damaged covers.</li>
                  <li><strong>For digital records that risk obsolescence:</strong> Migration of the data to modern formats, and storage on modern media is essential. Regular checks of the data integrity is also important.</li>
                  <li><strong>For records damaged by water:</strong> Freezing the records to stabilize them, followed by vacuum freeze drying is a common method. Then once dried, conservation methods can be used to repair remaining damage.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 7: Adhering to Principles and Guidelines */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Adhering to Principles and Guidelines in Conservation Treatment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conservation treatment must be conducted with meticulous care and adherence to established principles and guidelines to ensure the long-term preservation of records. These principles prioritize the preservation of the original artifact and minimize any irreversible interventions.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Principle of Reversibility',
                    icon: <RefreshCw size={16} />,
                    content:
                      'Conservation treatments should be reversible whenever possible. This means that any materials or techniques used should be removable or modifiable in the future, allowing for potential re-treatment or correction. This principle acknowledges that conservation knowledge and techniques may evolve over time.',
                  },
                  {
                    title: 'Principle of Minimal Intervention',
                    icon: <Minimize size={16} />,
                    content:
                      'Conservation treatments should be limited to the minimum necessary to stabilize and preserve the record. Over-treatment can cause unnecessary damage or alteration to the original artifact. The aim is to preserve as much of the original material and historical integrity as possible.',
                  },
                  {
                    title: 'Principle of Compatibility',
                    icon: <Link size={16} />,
                    content:
                      'All materials used in conservation treatments must be compatible with the original materials of the record. This means that they should not cause any adverse chemical or physical reactions. Archival-quality, inert materials are preferred.',
                  },
                  {
                    title: 'Principle of Documentation',
                    icon: <Clipboard size={16} />,
                    content:
                      'All conservation treatments must be thoroughly documented. This includes recording the condition of the record before, during, and after treatment, as well as the materials and techniques used. Detailed documentation provides a record of the treatment and allows for future evaluation and re-treatment if necessary.',
                  },
                  {
                    title: 'Principle of Respect for Originality',
                    icon: <Heart size={16} />,
                    content:
                      'Conservation treatments should respect the original materials, design, and historical significance of the record. The aim is to preserve the artifact\'s authenticity and integrity, rather than to create a new or idealized version.',
                  },
                  {
                    title: 'Principle of Professional Competence',
                    icon: <AwardIcon size={16} />,
                    content:
                      'Conservation treatments should be carried out by trained and experienced conservators who adhere to professional ethics and standards. This ensures that treatments are performed correctly and that the record is handled with care.',
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

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Guidelines for Implementation
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Condition Assessment:</strong> Begin with a thorough assessment of the record's condition to determine the appropriate treatment.</li>
                  <li><strong>Material Testing:</strong> Test all conservation materials for compatibility with the record's materials.</li>
                  <li><strong>Controlled Environment:</strong> Conduct treatments in a controlled environment to minimize environmental risks.</li>
                  <li><strong>Ethical Considerations:</strong> Consider the ethical implications of all treatment options and prioritize the long-term preservation of the record.</li>
                  <li><strong>Ongoing Monitoring:</strong> Monitor the condition of treated records over time to ensure the effectiveness of the treatment.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 8: Conservation Worksheet */}
            <div
              ref={(el) => {
                sectionRefs.current['worksheet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conservation Worksheet
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A conservation worksheet is a standardized document used by conservators to record detailed information about the condition, treatment, and materials used for a specific record or artifact. It serves as a comprehensive record of the conservation process, ensuring transparency, accountability, and the ability to track changes over time.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Elements of a Conservation Worksheet
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Identification Information:</strong> This section includes details about the record, such as its title, author, date, accession number, and any other identifying information.</li>
                  <li><strong>Condition Assessment:</strong> This section provides a detailed description of the record's condition before treatment. It includes observations about physical and chemical deterioration, such as tears, stains, mold growth, and discoloration.</li>
                  <li><strong>Photographic Documentation:</strong> This element includes photographs of the record before, during, and after treatment. Visual documentation is essential for recording the condition and changes resulting from conservation efforts.</li>
                  <li><strong>Materials Analysis:</strong> This section records the materials used in the record, such as paper type, ink, and binding materials. This information is crucial for selecting compatible conservation materials.</li>
                  <li><strong>Treatment Plan:</strong> This element outlines the proposed conservation treatment, including the specific techniques and materials to be used. It also includes a rationale for the chosen treatment.</li>
                  <li><strong>Treatment Documentation:</strong> This section provides a detailed record of the conservation treatment, including the steps taken, materials used, and any observations made during the process.</li>
                  <li><strong>Materials Used:</strong> A complete list of all materials used during the conservation process, including brand names, product numbers, and any relevant specifications.</li>
                  <li><strong>Environmental Conditions:</strong> Information about the environmental conditions during the treatment, such as temperature and humidity.</li>
                  <li><strong>Conservator Information:</strong> This section includes the name and contact information of the conservator who performed the treatment.</li>
                  <li><strong>Date of Treatment:</strong> This element records the date(s) on which the conservation treatment was performed.</li>
                  <li><strong>Post-Treatment Condition Assessment:</strong> This section provides a description of the record's condition after treatment. It includes observations about any changes resulting from the treatment.</li>
                  <li><strong>Storage Recommendations:</strong> Any recommendations about the best way to store the conserved item.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Clipboard size={16} /> Designing a Conservation Worksheet
                </h3>
                <div className={`p-4 rounded-md font-mono text-sm ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="font-bold text-lg">Conservation Worksheet</p>
                  <hr className="my-2 border-gray-400 dark:border-gray-600" />
                  
                  <p className="font-semibold mt-3">Identification Information:</p>
                  <p>Title: _______________________________</p>
                  <p>Author: _______________________________</p>
                  <p>Date: _______________________________</p>
                  <p>Accession Number: _______________________________</p>
                  <p>Other Identifying Information: _______________________________</p>

                  <p className="font-semibold mt-3">Condition Assessment:</p>
                  <p>Detailed Description of Condition: _______________________________</p>
                  <p>Photographic Documentation: (Attach photos)</p>

                  <p className="font-semibold mt-3">Materials Analysis:</p>
                  <p>Materials Used: _______________________________</p>

                  <p className="font-semibold mt-3">Treatment Plan:</p>
                  <p>Proposed Treatment: _______________________________</p>
                  <p>Rationale: _______________________________</p>

                  <p className="font-semibold mt-3">Treatment Documentation:</p>
                  <p>Steps Taken: _______________________________</p>
                  <p>Materials Used: _______________________________</p>
                  <p>Observations: _______________________________</p>
                  <p>Environmental Conditions during treatment: _______________________________</p>

                  <p className="font-semibold mt-3">Materials Used List:</p>
                  <p>Material Name: _______________________________</p>
                  <p>Brand/Product Number: _______________________________</p>
                  <p>Specifications: _______________________________</p>

                  <p className="font-semibold mt-3">Conservator Information:</p>
                  <p>Name: _______________________________</p>
                  <p>Contact Information: _______________________________</p>

                  <p className="font-semibold mt-3">Date of Treatment:</p>
                  <p>Date(s): _______________________________</p>

                  <p className="font-semibold mt-3">Post-Treatment Condition Assessment:</p>
                  <p>Detailed Description of Condition: _______________________________</p>
                  <p>Photographic Documentation: (Attach photos)</p>

                  <p className="font-semibold mt-3">Storage Recommendations:</p>
                  <p>Recommendations: _______________________________</p>
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
                  <span>Deterioration Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Control Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Conservation Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Records deterioration can be physical, chemical, biological, environmental, mechanical, or informational. Control methods include environmental control, proper storage, IPM, disaster preparedness, digitization, and conservation treatments. Each method has advantages and limitations. Conservation treatments must adhere to principles of reversibility, minimal intervention, compatibility, documentation, respect for originality, and professional competence. A conservation worksheet documents the entire treatment process.
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
                <strong className="text-white">Records Deterioration</strong> – Six categories: Physical, Chemical, Biological, Environmental, Mechanical, and Information deterioration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Causes</strong> – Environmental (temperature, humidity, light, pollutants), Biological (mold, insects, rodents), Chemical (acidity, oxidation), Physical (handling, storage, disasters), Technological (obsolescence, data corruption).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Control Methods</strong> – Environmental control, proper storage and handling, IPM, disaster preparedness, digitization, and conservation treatments – each with distinct advantages and limitations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conservation Principles</strong> – Reversibility, minimal intervention, compatibility, documentation, respect for originality, and professional competence are essential guidelines.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conservation Worksheet</strong> – A comprehensive document capturing identification, condition, treatment plan, materials, and post-treatment assessment ensures accountability and traceability.
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
            Sidemann Academic Registry • Records Deterioration &amp; Conservation Methods 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;