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

  // ─── Icons specific to this LO2 content ────────────────────────────────
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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'composition', label: 'Composition' },
  { id: 'preservation', label: 'Preservation Measures' },
  { id: 'abuse-mishandling', label: 'Abuse & Mishandling' },
  { id: 'enclosures', label: 'Storage Enclosures' },
  { id: 'storage-discussion', label: 'Storage Discussion' },
  { id: 'conditions', label: 'Storage Conditions' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'advantages', label: 'Advantages' },
  { id: 'facilities', label: 'Choosing Facilities' },
  { id: 'housekeeping', label: 'Housekeeping' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'The ideal storage conditions for paper records are 65-70°F (18-21°C) and 30-50% relative humidity to prevent chemical and biological deterioration.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use archival-quality storage materials like acid-free boxes and inert plastic sleeves to prevent chemical reactions with records.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five factors for choosing storage facilities: Environment, Security, Pest control, Disaster readiness, and Accessibility.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that once records are stored, they don’t need regular inspection – but periodic checks are essential to catch early signs of deterioration.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ideal storage conditions for paper records are 65-70°F (18-21°C) and 30-50% relative humidity to prevent chemical and biological deterioration.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use archival-quality storage materials like acid-free boxes and inert plastic sleeves to prevent chemical reactions with records.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five factors for choosing storage facilities: Environment, Security, Pest control, Disaster readiness, and Accessibility.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that once records are stored, they don’t need regular inspection – but periodic checks are essential to catch early signs of deterioration.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Records Composition, Storage &amp; Preservation —{' '}
            <span className="text-sky-300 font-bold italic">
              Materials, Enclosures &amp; Maintenance
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to composition of records, preservation measures, storage enclosures, conditions, maintenance, and housekeeping.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Storage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDrive size={14} className="inline mr-1" /> Digital
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> Enclosures
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
            {/* SECTION 1: Composition and Structure of Records */}
            <div
              ref={(el) => {
                sectionRefs.current['composition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Composition and Structure of Records in Different Media
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Records exist in various media, each with unique compositions and structures that influence their preservation needs.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Paper Records',
                    icon: <FileText size={16} />,
                    content:
                      'Composed primarily of cellulose fibers, fillers, and additives. Their structure can vary from single sheets to bound volumes. Deterioration is often caused by acidity, light, and humidity.',
                  },
                  {
                    title: 'Photographic Records',
                    icon: <Camera size={16} />,
                    content:
                      'Include film, negatives, and prints. Their composition varies based on the photographic process (e.g., gelatin silver, albumen). Deterioration can result from chemical instability, light exposure, and humidity.',
                  },
                  {
                    title: 'Audio Records',
                    icon: <Mic size={16} />,
                    content:
                      'Include analog (e.g., vinyl, tapes) and digital formats. Analog records are composed of magnetic coatings or grooves. Digital records consist of encoded data. Deterioration can be caused by physical damage, magnetic field degradation, and technological obsolescence.',
                  },
                  {
                    title: 'Video Records',
                    icon: <Video size={16} />,
                    content:
                      'Similar to audio, video records include analog (e.g., VHS, film) and digital formats. Analog video is composed of magnetic tape or film. Digital video consists of encoded data. Deterioration can result from physical damage, magnetic degradation, and technological obsolescence.',
                  },
                  {
                    title: 'Digital Records',
                    icon: <HardDrive size={16} />,
                    content:
                      'Composed of binary data stored on various media (e.g., hard drives, CDs, cloud storage). Their structure is defined by file formats and data organization. Deterioration can be caused by hardware failures, software obsolescence, and data corruption.',
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

            {/* SECTION 2: Measures for Proper Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['preservation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Measures for Proper Preservation of Records in Different Media
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Environmental Control:</strong> Maintain stable temperature and humidity levels to minimize chemical and physical deterioration. Implement air filtration to reduce pollutants. Tailor the environment to the specific media type.</li>
                  <li><strong>Appropriate Storage:</strong> Use archival-quality storage materials (e.g., acid-free boxes, inert sleeves). Store records in designated areas with proper shelving and organization. For digital media, redundant backup systems are essential.</li>
                  <li><strong>Regular Inspection:</strong> Conduct periodic inspections to identify signs of deterioration, such as mold growth, fading, or physical damage.</li>
                  <li><strong>Digitization and Migration:</strong> Digitize analog records to create digital copies for preservation and access. Migrate digital records to new formats and media to prevent obsolescence.</li>
                  <li><strong>Disaster Preparedness:</strong> Develop and implement disaster recovery plans to protect records from floods, fires, and other disasters.</li>
                  <li><strong>Pest Management:</strong> Implement integrated pest management (IPM) strategies to prevent damage from insects and rodents.</li>
                  <li><strong>Handling Procedures:</strong> Establish and enforce safe handling procedures to minimize physical damage. Train staff on proper handling techniques.</li>
                  <li><strong>Conservation Treatments:</strong> Employ professional conservators to perform necessary repairs and stabilization treatments.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Measures Against Abuse and Mishandling */}
            <div
              ref={(el) => {
                sectionRefs.current['abuse-mishandling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Measures Against Abuse and Mishandling of Materials in Different Formats
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Access Restrictions:</strong> Limit access to valuable or fragile records to authorized personnel. Implement sign-out systems and monitor usage.</li>
                  <li><strong>Handling Training:</strong> Provide comprehensive training on proper handling techniques for different media. Emphasize the importance of clean hands and appropriate support.</li>
                  <li><strong>Protective Equipment:</strong> Require the use of protective equipment, such as gloves and masks, when handling sensitive materials.</li>
                  <li><strong>Controlled Access Areas:</strong> Designate specific areas for handling and viewing records, minimizing the risk of damage from food, drinks, or other contaminants.</li>
                  <li><strong>Copying Policies:</strong> Establish clear policies on copying records, limiting the use of original materials. Encourage the use of digital copies or reproductions.</li>
                  <li><strong>Exhibition Guidelines:</strong> Develop guidelines for exhibiting records, including limitations on light exposure, handling, and environmental conditions.</li>
                  <li><strong>Security Measures:</strong> Implement security measures to prevent theft or unauthorized access to records. Use security cameras and access control systems.</li>
                  <li><strong>Emergency Procedures:</strong> Have clearly posted and well-known emergency procedures for the handling of damaged or mishandled materials. This includes who to contact, and what steps to take.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Storage Containers (Preservation Enclosures) */}
            <div
              ref={(el) => {
                sectionRefs.current['enclosures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Storage Containers (Preservation Enclosures)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preservation enclosures are crucial for protecting records from environmental factors and physical damage. They come in various materials, each suited for specific types of records.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Paper Enclosures',
                    icon: <FileText size={16} />,
                    content:
                      'These enclosures are made from acid-free and lignin-free paper or board. They are ideal for storing paper-based records, such as documents, manuscripts, and photographs. Paper enclosures provide a stable environment and prevent chemical deterioration caused by acidic materials.',
                  },
                  {
                    title: 'Plastic Enclosures',
                    icon: <Box size={16} />,
                    content:
                      'These enclosures are made from inert plastics, such as polyester, polyethylene, or polypropylene. They are suitable for storing photographs, films, and other non-paper-based records. Plastic enclosures provide a barrier against moisture, dust, and pollutants. It is very important to use only inert plastics.',
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

            {/* SECTION 5: Discussion of Storage of Information Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['storage-discussion'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Discussion of Storage of Information Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Effective storage of information materials involves several key considerations:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Environmental Control:</strong> Maintaining stable temperature and humidity levels is essential for preventing deterioration. Fluctuations can cause materials to expand and contract, leading to damage.</li>
                  <li><strong>Storage Materials:</strong> Using archival-quality storage materials, such as acid-free boxes and folders, is crucial for preventing chemical deterioration.</li>
                  <li><strong>Handling Procedures:</strong> Implementing safe handling procedures, such as wearing gloves and avoiding excessive handling, can minimize physical damage.</li>
                  <li><strong>Pest Management:</strong> Implementing integrated pest management (IPM) strategies can prevent damage from insects and rodents.</li>
                  <li><strong>Organization and Labeling:</strong> Organizing and labeling records effectively can ensure easy retrieval and prevent mishandling.</li>
                  <li><strong>Disaster Preparedness:</strong> Developing and implementing disaster recovery plans can protect records from floods, fires, and other disasters.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 6: Assessing Storage Conditions */}
            <div
              ref={(el) => {
                sectionRefs.current['conditions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assessing Storage Conditions for Materials in Different Formats
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Paper',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Ideal conditions:</strong> Temperature 65-70°F (18-21°C), relative humidity 30-50%. Storage: Acid-free boxes and folders, away from direct light and pollutants. Avoid high humidity, and large swings in temperature.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Film',
                    icon: <Camera size={16} />,
                    content: (
                      <>
                        <p><strong>Ideal conditions:</strong> Cool and dry, temperature below 68°F (20°C), relative humidity 30-40%. Storage: Archival-quality enclosures, in a cool, dark place. Avoid fluctuations in temperature and humidity, and exposure to light.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Digital Formats',
                    icon: <HardDrive size={16} />,
                    content: (
                      <>
                        <p><strong>Ideal conditions:</strong> Stable temperature and humidity, away from magnetic fields. Storage: Redundant backups on multiple media, in a climate-controlled environment. Cloud storage is also very useful. Regular migration to new formats and media is essential to prevent obsolescence.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Audio-Visual Records',
                    icon: <Video size={16} />,
                    content: (
                      <>
                        <p><strong>Ideal conditions:</strong> Cool and dry, temperature below 68°F (20°C), relative humidity 30-40%. Storage: Vertical storage for tapes, in archival-quality enclosures. Avoid exposure to magnetic fields, and large variations in temperature and humidity.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Micrographics',
                    icon: <Microscope size={16} />,
                    content: (
                      <>
                        <p><strong>Ideal conditions:</strong> Cool and dry, temperature 60-70°F (15-21°C), relative humidity 30-40%. Storage: Archival-quality enclosures, in a dark, clean place. Avoid scratches, fingerprints, and exposure to light.</p>
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

            {/* SECTION 7: Maintenance of Storage Equipment */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintenance of Storage Equipment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintaining storage equipment is crucial for ensuring the longevity and integrity of stored records. This involves regular inspections, cleaning, and repairs to prevent equipment failures and maintain optimal storage conditions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Climate Control Systems:</strong> Regularly inspect and clean air filters in HVAC systems to ensure proper airflow and prevent dust buildup. Calibrate temperature and humidity sensors to maintain accurate readings. Schedule routine maintenance for compressors, fans, and other components to prevent breakdowns.</li>
                  <li><strong>Shelving and Racks:</strong> Inspect shelving and racks for stability and structural integrity. Ensure that shelves are level and that weight limits are not exceeded. Clean shelves regularly to remove dust and debris. Check for rust or corrosion and repair or replace damaged components.</li>
                  <li><strong>Storage Containers:</strong> Inspect storage containers for damage, such as cracks, tears, or warping. Replace damaged containers to prevent further deterioration of records. Clean containers regularly to remove dust and contaminants. Ensure that containers are properly labeled and organized.</li>
                  <li><strong>Monitoring Equipment:</strong> Calibrate and test environmental monitoring equipment, such as thermometers and hygrometers, to ensure accurate readings. Regularly check and replace batteries in monitoring devices. Maintain accurate records of environmental data.</li>
                  <li><strong>Digital Storage Devices:</strong> Regularly check hard drives, servers, and other digital storage devices for errors and data corruption. Perform routine backups and verify data integrity. Keep firmware and software up-to-date. Clean and maintain server rooms to prevent overheating and dust buildup.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 8: Advantages of Proper Storage */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages of Proper Storage
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Proper storage of records offers numerous advantages, contributing to their long-term preservation and accessibility.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Prolonged Lifespan:</strong> Proper storage conditions, such as controlled temperature and humidity, slow down the rate of deterioration, extending the lifespan of records.</li>
                  <li><strong>Protection from Damage:</strong> Appropriate storage materials and handling procedures protect records from physical damage, such as tears, creases, and abrasions.</li>
                  <li><strong>Prevention of Chemical Deterioration:</strong> Acid-free storage materials and controlled environments prevent chemical reactions that can cause discoloration, brittleness, and other forms of deterioration.</li>
                  <li><strong>Protection from Biological Hazards:</strong> Controlled humidity and integrated pest management (IPM) strategies prevent mold growth, insect infestation, and rodent damage.</li>
                  <li><strong>Improved Accessibility:</strong> Proper organization and labeling of records ensure efficient retrieval and reduce the risk of mishandling.</li>
                  <li><strong>Enhanced Security:</strong> Secure storage facilities and access control measures protect records from theft, unauthorized access, and vandalism.</li>
                  <li><strong>Disaster Preparedness:</strong> Proper storage practices, such as off-site backups and raised shelving, minimize the impact of disasters, such as floods and fires.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 9: Factors to Consider When Choosing Storage Facilities */}
            <div
              ref={(el) => {
                sectionRefs.current['facilities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Choosing Storage Facilities for Different Records Formats
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Selecting appropriate storage facilities is crucial for preserving records in various formats. Several factors should be considered:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Environmental Control:</strong> Ensure that the facility can maintain stable temperature and humidity levels suitable for the specific record format. Consider the need for air filtration and UV-filtering lighting.</li>
                  <li><strong>Storage Materials:</strong> Select storage facilities that use archival-quality materials, such as acid-free boxes, inert plastics, and appropriate shelving.</li>
                  <li><strong>Security:</strong> Evaluate the facility's security measures, including access control, surveillance systems, and fire suppression systems.</li>
                  <li><strong>Pest Management:</strong> Assess the facility's pest management strategies to ensure that records are protected from insects and rodents.</li>
                  <li><strong>Disaster Preparedness:</strong> Consider the facility's disaster recovery plans and its ability to withstand natural disasters, such as floods and earthquakes.</li>
                  <li><strong>Accessibility:</strong> Evaluate the facility's accessibility for authorized personnel and the ease of retrieving records.</li>
                  <li><strong>Space and Capacity:</strong> Ensure that the facility has sufficient space to accommodate current and future storage needs.</li>
                  <li><strong>Specialized Requirements:</strong> Consider any specialized requirements for specific record formats, such as cold storage for film or secure digital storage for electronic records.</li>
                  <li><strong>Location:</strong> Consider the location of the storage facility, with respect to the location of the records, and the ease of access.</li>
                  <li><strong>Costs:</strong> Evaluate the costs associated with storage, including rental fees, maintenance costs, and insurance premiums.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 10: Applying Housekeeping Measures */}
            <div
              ref={(el) => {
                sectionRefs.current['housekeeping'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Applying Housekeeping Measures to Records in Different Media/Formats
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Housekeeping measures are essential for maintaining the cleanliness and order of records, preventing deterioration, and ensuring easy access. These measures vary depending on the media/format of the records.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Paper Records',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Dusting:</strong> Use soft brushes or microfiber cloths to gently remove dust from paper surfaces. Avoid using feather dusters, as they can scratch or tear paper. For bound volumes, dust the top edges and spine.</li>
                        <li><strong>Surface Cleaning:</strong> Use archival-quality erasers or soft cloths to remove surface dirt and smudges. Avoid using water or harsh cleaning solutions, as they can damage paper.</li>
                        <li><strong>Organization:</strong> Store paper records in acid-free folders and boxes. Label folders and boxes clearly for easy retrieval. Maintain a consistent filing system.</li>
                        <li><strong>Regular Inspections:</strong> Check for signs of mold, insect infestation, or physical damage. Address any issues promptly to prevent further deterioration.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Photographic Records',
                    icon: <Camera size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Handling:</strong> Wear cotton or nitrile gloves when handling photographs. Avoid touching the image surface. Handle photographs by the edges.</li>
                        <li><strong>Dust Removal:</strong> Use soft brushes or compressed air to remove dust from photographic surfaces. Avoid wiping photographs with cloths, as this can cause scratches.</li>
                        <li><strong>Storage:</strong> Store photographs in archival-quality sleeves or enclosures. Store negatives and film in individual sleeves. Store photographs in a cool, dry, and dark place.</li>
                        <li><strong>Regular Inspections:</strong> Check for signs of fading, discoloration, or chemical deterioration. Inspect film for scratches or damage.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Audio-Visual Records',
                    icon: <Video size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Handling:</strong> Handle audio-visual records by the edges or center hole. Avoid touching the recording surface. Keep records away from magnetic fields.</li>
                        <li><strong>Cleaning:</strong> Use specialized cleaning solutions and cloths to clean discs and tapes. Follow the manufacturer's instructions for cleaning.</li>
                        <li><strong>Storage:</strong> Store tapes vertically in their original cases. Store discs in their original cases or archival-quality sleeves. Store audio-visual records in a cool, dry place.</li>
                        <li><strong>Regular Inspections:</strong> Check for signs of mold, physical damage, or magnetic tape degradation. Test digital media for data corruption.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Digital Records',
                    icon: <HardDrive size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Organization:</strong> Organize digital files into logical folders and subfolders. Use consistent file naming conventions. Maintain a backup system.</li>
                        <li><strong>Data Integrity:</strong> Regularly check for data corruption and perform data integrity checks. Use antivirus and anti-malware software to protect against threats. Migrate data to new storage mediums before the old mediums fail.</li>
                        <li><strong>Storage:</strong> Store digital media in a cool, dry place away from magnetic fields. Keep backup copies in separate locations.</li>
                        <li><strong>Regular Backups:</strong> Regularly backup all data. Verify the backups are valid.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Micrographics',
                    icon: <Microscope size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Handling:</strong> Wear cotton gloves when handling micrographics. Avoid touching the film surface. Use specialized readers and equipment.</li>
                        <li><strong>Cleaning:</strong> Use compressed air or soft brushes to remove dust. Avoid using liquids or harsh cleaning solutions.</li>
                        <li><strong>Storage:</strong> Store micrographics in archival-quality enclosures. Store in a cool, dry, and dark place.</li>
                        <li><strong>Regular Inspections:</strong> Check for scratches, fingerprints, or signs of deterioration. Check for vinegar syndrome in film.</li>
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Storage Insight
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
                  <span>Record Media</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Storage Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Housekeeping Areas</span>
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
                Proper storage begins with understanding the composition of records in different media. Preservation measures include environmental control, appropriate storage materials, regular inspection, digitization, and disaster preparedness. Protect records from abuse through access restrictions, handling training, and security. Use acid-free paper or inert plastic enclosures tailored to the material. Assess and maintain stable storage conditions for each format. Regular housekeeping—dusting, cleaning, and organizing—extends the life of records and ensures accessibility.
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
                <strong className="text-white">Composition & Structure</strong> – Records in paper, photographic, audio, video, and digital media have unique compositions that influence preservation needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation Measures</strong> – Environmental control, appropriate storage materials, regular inspection, digitization, and disaster preparedness are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Abuse & Mishandling</strong> – Implement access restrictions, handling training, protective equipment, and security measures to prevent damage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage Enclosures</strong> – Use acid-free paper enclosures for paper records and inert plastic enclosures for photographs, films, and other non-paper materials.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conditions & Maintenance</strong> – Maintain stable temperature and humidity for each format; regularly inspect and maintain storage equipment and facilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Housekeeping</strong> – Regular dusting, cleaning, organization, and inspections tailored to each media type are vital for long‑term preservation.
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
            Sidemann Academic Registry • Records Composition, Storage &amp; Preservation 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;