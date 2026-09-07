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
  { id: 'elements', label: 'Environmental Elements' },
  { id: 'control', label: 'Control Measures' },
  { id: 'tropical', label: 'Tropical Challenges' },
  { id: 'digital-challenges', label: 'Digital Challenges' },
  { id: 'digital-strategies', label: 'Digital Strategies' },
  { id: 'handling-storage', label: 'Handling & Storage' },
  { id: 'env-security', label: 'Environmental Security' },
  { id: 'format-issues', label: 'Format Handling Issues' },
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
        text: 'The ideal temperature for archival storage is between 65°F and 70°F (18°C and 21°C) with relative humidity between 30% and 50%.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use acid-free enclosures for paper records – acidic materials accelerate deterioration and can cause irreversible damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key environmental factors with "T-H-L-P-B": Temperature, Humidity, Light, Pollutants, Biological agents.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store digital files on a single hard drive without backups, risking permanent data loss from hardware failure.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ideal temperature for archival storage is between 65°F and 70°F (18°C and 21°C) with relative humidity between 30% and 50%.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use acid-free enclosures for paper records – acidic materials accelerate deterioration and can cause irreversible damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key environmental factors with "T-H-L-P-B": Temperature, Humidity, Light, Pollutants, Biological agents.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations store digital files on a single hard drive without backups, risking permanent data loss from hardware failure.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Preservation Challenges, Digital Strategies &{' '}
            <span className="text-sky-300 font-bold italic">
              Environmental Security
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to environmental factors, control measures, tropical challenges, digital preservation, handling, storage, and environmental security.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Thermometer size={14} className="inline mr-1" /> Environment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> Digital
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
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
                placeholder="Search for a concept, strategy, challenge..."
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
            {/* SECTION 1: How Different Elements Affect the Stability of Records */}
            <div
              ref={(el) => {
                sectionRefs.current['elements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How Different Elements Affect the Stability of Records in Different Media
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Temperature Fluctuations and Their Impact',
                    icon: <Thermometer size={16} />,
                    content: 'Temperature, while seemingly benign, plays a critical role in the longevity of records. Rapid or extreme temperature changes can cause significant damage. For paper-based records, fluctuations lead to expansion and contraction of fibres, resulting in warping, cracking, and embrittlement over time. Think of it like bending a paperclip back and forth; eventually, it weakens and breaks. For photographic materials, temperature variations can accelerate chemical reactions, causing fading, discoloration, and the breakdown of the image layer. In electronic media, like magnetic tapes or optical discs, temperature extremes can distort the physical substrate, leading to data loss. High temperatures can also accelerate the degradation of the binders and adhesives used in these materials. In essence, a stable, moderate temperature is crucial for preserving the physical integrity and chemical stability of all types of records, preventing premature deterioration, and ensuring long-term accessibility.',
                  },
                  {
                    title: '2. Relative Humidity and Its Destructive Power',
                    icon: <Droplet size={16} />,
                    content: 'Relative humidity (RH) refers to the amount of moisture in the air. Too much or too little moisture can be disastrous for records. High RH promotes mold growth on paper, parchment, and even some photographic materials, leading to staining and irreversible damage. It can also cause the swelling and sticking of photographic emulsions, ruining image quality. For electronic media, excessive humidity can corrode metallic components and lead to the breakdown of magnetic layers. Conversely, low RH can cause paper to become brittle and crack, and photographic emulsions to shrink and crack. The ideal RH for most archival materials is a stable, moderate level, typically between 30% and 50%, to minimize these risks. Controlling RH is vital for preventing biological decay, physical distortion, and chemical degradation, ensuring that records remain intact and readable.',
                  },
                  {
                    title: '3. Light Exposure and Its Fading Effects',
                    icon: <Lightbulb size={16} />,
                    content: 'Light, especially ultraviolet (UV) radiation, is a potent agent of deterioration. Paper exposed to light can yellow, fade, and become brittle. Inks and dyes can also fade, making written or printed information illegible. Photographic materials are particularly sensitive to light, with both colour and black-and-white images susceptible to fading and discoloration. Light can break down the chemical bonds in the image layer, leading to irreversible damage. Even electronic media can be affected, as prolonged light exposure can cause the breakdown of protective coatings on optical discs and the deterioration of plastic components. To mitigate these effects, records should be stored in dark or dimly lit environments. UV-filtering materials should be used for display or storage, and light exposure should be minimized during handling and digitization. This precaution is essential for preserving the visual and informational integrity of records.',
                  },
                  {
                    title: '4. Pollutants and Their Corrosive Nature',
                    icon: <AlertCircle size={16} />,
                    content: 'Air pollutants, such as sulphur dioxide, nitrogen oxides, and ozone, can react with the materials in records, causing chemical degradation. These pollutants can acidify paper, leading to embrittlement and disintegration. They can also corrode metallic components in electronic media and damage the image layer in photographic materials. Dust and particulate matter can act as abrasives, scratching, and damaging surfaces, and can also provide a breeding ground for mold and insects. In archival storage, air filtration systems are crucial for removing pollutants and dust from the environment. Records should be stored in acid-free enclosures and handled with clean gloves to prevent the introduction of contaminants. Regular cleaning and maintenance are essential for minimizing the impact of pollutants and ensuring the long-term preservation of records.',
                  },
                  {
                    title: '5. Biological Agents and Their Destructive Activities',
                    icon: <Bug size={16} />,
                    content: 'Biological agents, including mold, insects, and rodents, pose a significant threat to records. Mold thrives in high humidity and can cause irreversible damage to paper, parchment, and photographic materials. Insects, such as silverfish and bookworms, can consume paper and other organic materials, leaving behind holes and debris. Rodents can gnaw on records, causing physical damage and contamination. To prevent biological damage, records should be stored in clean, dry environments. Regular inspections and pest control measures are essential for detecting and eliminating infestations. Proper storage in sealed, acid-free containers can also help protect records from biological agents.',
                  },
                  {
                    title: '6. Handling and Physical Stress',
                    icon: <Handshake size={16} />,
                    content: 'Physical handling, while necessary for access and use, can cause significant damage to records. Frequent handling can lead to tears, creases, and abrasions on paper-based materials. Improper handling of photographic materials can result in scratches, fingerprints, and the separation of image layers. Electronic media can be damaged by rough handling, leading to data loss and physical distortion. To minimize physical stress, records should be handled with care, using clean gloves and appropriate support materials. Digitization can reduce the need for frequent handling, and proper storage in sturdy, protective enclosures can prevent damage during transport and storage. Training staff and users in proper handling techniques is crucial for preserving the physical integrity of records.',
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

            {/* SECTION 2: How These Effects Can Be Controlled */}
            <div
              ref={(el) => {
                sectionRefs.current['control'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How These Effects Can Be Controlled to Reduce the Rate of Deterioration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Temperature Control Through Environmental Regulation',
                    icon: <Thermometer size={16} />,
                    content: 'To mitigate the damaging effects of temperature fluctuations, a stable and moderate environment is essential. This involves using climate control systems, such as HVAC (Heating, Ventilation, and Air Conditioning), to maintain a consistent temperature. Ideally, archival storage should be kept at a temperature between 65°F and 70°F (18°C and 21°C). Gradual temperature changes are preferred over sudden shifts, so systems should be designed to avoid rapid fluctuations. Monitoring temperature with data loggers allows for precise tracking and adjustments. Insulating storage areas can also help buffer against external temperature changes. For institutions with limited resources, prioritizing the storage of the most sensitive materials in climate-controlled areas is a practical approach. Regular maintenance of HVAC systems ensures their efficiency and prevents breakdowns that could lead to damaging temperature swings.',
                  },
                  {
                    title: '2. Relative Humidity Management for Moisture Stability',
                    icon: <Droplet size={16} />,
                    content: 'Controlling relative humidity (RH) is crucial for preventing moisture-related damage. This can be achieved through the use of dehumidifiers and humidifiers, depending on the specific needs of the environment. The ideal RH for most archival materials is between 30% and 50%, with minimal fluctuations. Monitoring RH with hygrometers and data loggers is essential for maintaining stability. Air circulation is also important, as stagnant air can lead to localized areas of high humidity. Proper ventilation helps ensure even distribution of moisture. For particularly sensitive materials, individual storage in sealed, climate-controlled enclosures can provide an extra layer of protection. Buildings in humid climates may require more robust dehumidification systems, while those in dry climates may need humidification to prevent embrittlement. Regular maintenance of these systems and consistent monitoring are vital for long-term preservation.',
                  },
                  {
                    title: '3. Light Reduction and UV Filtration',
                    icon: <Lightbulb size={16} />,
                    content: 'To minimize the harmful effects of light, especially UV radiation, records should be stored in dark or dimly lit environments. Windows in storage areas should be covered with UV-filtering films or blinds. Artificial lighting should be low-level and use bulbs that emit minimal UV radiation, such as LED lights with UV filters. For display purposes, records should be rotated regularly to limit exposure, and UV-filtering display cases should be used. Digitization of records can reduce the need for physical handling and light exposure. When handling records, avoid direct sunlight and bright artificial light. Implementing a comprehensive lighting policy that addresses storage, display, and handling is essential for preserving the integrity of records.',
                  },
                  {
                    title: '4. Pollution Control Through Air Filtration and Cleanliness',
                    icon: <Cloud size={16} />,
                    content: 'To control the damaging effects of pollutants, air filtration systems are crucial. These systems should be capable of removing particulate matter and gaseous pollutants, such as sulphur dioxide and nitrogen oxides. Regular maintenance of these systems is essential for their effectiveness. Storage areas should be kept clean and dust-free through regular cleaning and vacuuming. Records should be stored in acid-free enclosures and handled with clean gloves to prevent the introduction of contaminants. Limiting the use of materials that emit harmful chemicals, such as certain plastics and adhesives, is also important. For institutions located in areas with high levels of air pollution, more robust filtration systems and air quality monitoring may be necessary.',
                  },
                  {
                    title: '5. Biological Pest Management and Prevention',
                    icon: <Bug size={16} />,
                    content: 'Preventing biological damage involves maintaining a clean and dry environment. Regular inspections for signs of mold, insects, and rodents are essential. If infestations are detected, prompt action should be taken to eliminate them. Integrated pest management (IPM) strategies, which combine preventive measures with targeted treatments, are recommended. Storage areas should be kept clean and free of food and debris that could attract pests. Records should be stored in sealed, acid-free containers to prevent access by insects and rodents. Regular cleaning and monitoring of storage areas, combined with appropriate pest control measures, are essential for long-term preservation.',
                  },
                  {
                    title: '6. Handling Protocols and Protective Measures',
                    icon: <Handshake size={16} />,
                    content: 'To minimize physical damage from handling, strict protocols should be implemented. Records should be handled with clean, lint-free gloves to prevent the transfer of oils and dirt. Support materials, such as book cradles and archival trays, should be used to prevent stress and damage during handling. Digitization can reduce the need for frequent handling, and high-resolution digital copies can be used for access and research. Storage in sturdy, protective enclosures, such as acid-free boxes and folders, can prevent damage during transport and storage. Training staff and users in proper handling techniques is crucial for ensuring that records are handled with care. Regular inspections for signs of damage and prompt repairs can prevent further deterioration.',
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

            {/* SECTION 3: Challenges in Records Preservation in Tropical Regions */}
            <div
              ref={(el) => {
                sectionRefs.current['tropical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Records Preservation in Tropical Regions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preserving records in tropical regions presents unique and significant challenges due to the specific environmental conditions prevalent in these areas. Here is a breakdown of these challenges:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. High Temperatures and Humidity',
                    icon: <Thermometer size={16} />,
                    content: 'Tropical regions are characterized by consistently high temperatures and humidity levels, creating an environment that accelerates the deterioration of archival materials. The combination of heat and moisture promotes rapid chemical reactions, leading to the breakdown of paper, photographic emulsions, and electronic media. Paper becomes acidic and brittle, photographic images fade and become discoloured, and electronic storage devices are prone to corrosion and data loss. High humidity fosters the growth of mold and fungi, which can cause irreversible damage to organic materials. Traditional climate control systems may struggle to maintain stable conditions in the face of extreme heat and humidity, requiring robust and energy-intensive solutions. The constant battle against these elements demands meticulous monitoring and proactive preservation strategies.',
                  },
                  {
                    title: '2. Biological Infestations',
                    icon: <Bug size={16} />,
                    content: 'Tropical climates provide ideal breeding grounds for insects, rodents, and mold, posing a persistent threat to records and archives. Insects like termites, silverfish, and cockroaches thrive in warm, humid environments, consuming paper, textiles, and other organic materials. Mold and fungi flourish in high humidity, causing staining, decay, and irreversible damage. Rodents can gnaw on records, causing physical destruction and contamination. Traditional pest control methods may be less effective in tropical regions due to the rapid reproduction rates of pests and the constant influx of new infestations. Integrated pest management (IPM) strategies, which combine preventive measures with targeted treatments, are essential for long-term preservation. Regular inspections, proper storage in sealed containers, and environmental controls are crucial for minimizing biological damage.',
                  },
                  {
                    title: '3. Intense Sunlight and UV Radiation',
                    icon: <Sun size={16} />,
                    content: 'Tropical regions experience intense sunlight throughout the year, with high levels of ultraviolet (UV) radiation. This constant exposure accelerates the fading and degradation of records, especially those made from organic materials. Paper yellows and becomes brittle, inks and dyes fade, and photographic images lose their colour and clarity. UV radiation can also damage electronic media, causing the breakdown of protective coatings and the deterioration of plastic components. Traditional methods of light control, such as window coverings and UV-filtering materials, may not be sufficient to counteract the intense sunlight in tropical regions. Robust light management strategies, including the use of specialized storage enclosures and controlled lighting systems, are necessary to protect records from this damaging radiation.',
                  },
                  {
                    title: '4. Seasonal Variations and Extreme Weather Events',
                    icon: <Waves size={16} />,
                    content: 'Tropical regions often experience distinct wet and dry seasons, with heavy rainfall, high winds, and even cyclones or hurricanes. These extreme weather events can cause significant damage to records and archives. Flooding can lead to water damage, mold growth, and the loss of irreplaceable materials. High winds can damage buildings and storage facilities, exposing records to the elements. The unpredictability of these events necessitates robust disaster preparedness and response plans. Secure storage facilities, elevated shelving, and waterproof containers are essential for protecting records from water damage. Regular maintenance of buildings and infrastructure is crucial for withstanding extreme weather.',
                  },
                  {
                    title: '5. Limited Resources and Infrastructure',
                    icon: <DollarSign size={16} />,
                    content: 'Many tropical regions face challenges related to limited resources and infrastructure, which can hinder records preservation efforts. Access to reliable electricity, climate control systems, and specialized preservation materials may be limited. Skilled personnel and training programs may also be scarce. These logistical challenges can make it difficult to implement and maintain effective preservation strategies. The cost of maintaining stable environmental conditions in the face of extreme heat and humidity can be prohibitive for many institutions. International collaboration and resource sharing can help address these challenges, but sustainable, locally adapted solutions are essential for long-term preservation.',
                  },
                  {
                    title: '6. Cultural Practices and Traditional Materials',
                    icon: <Tree size={16} />,
                    content: 'Tropical regions often have rich cultural traditions and unique archival materials, such as palm leaf manuscripts, backcloth, and organic dyes. These materials require specialized preservation techniques that may differ from those used for Western archival materials. Traditional preservation methods, such as the use of natural preservatives and specialized storage techniques, may be more effective in these contexts. Cultural sensitivity and collaboration with local communities are essential for developing appropriate preservation strategies. Balancing the preservation of cultural heritage with modern preservation practices requires careful consideration and adaptation.',
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

            {/* SECTION 4: Challenges in Preserving Digital Content */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Preserving Digital Content and The Implications
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preserving digital content presents a unique set of challenges that differ significantly from those encountered with traditional archival materials. These challenges have profound implications for the long-term accessibility and integrity of our digital heritage.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Rapid Technological Obsolescence',
                    icon: <Zap size={16} />,
                    content: 'Digital technologies evolve at an astonishing pace, leading to rapid obsolescence of hardware and software. Files created with today\'s applications may become unreadable in the future as those applications become outdated. Older storage media, like floppy disks or CD-ROMs, may no longer be compatible with modern computers. This constant cycle of change makes it difficult to ensure the long-term accessibility of digital content. The implications are significant: valuable information, cultural artifacts, and historical records could be lost if they cannot be migrated to newer formats and systems. This necessitates ongoing migration and emulation strategies, which are resource-intensive and require specialized expertise.',
                  },
                  {
                    title: '2. File Format Fragility and Diversity',
                    icon: <FileText size={16} />,
                    content: 'Digital content is created and stored in a vast array of file formats, each with its own specifications and dependencies. Some formats are proprietary and may become obsolete or inaccessible if the software required to open them is no longer available. Others are open standards but may still require specific software or hardware to render correctly. The fragility of digital files means that even minor errors or corruption can render them unusable. This diversity and fragility make it challenging to develop universal preservation strategies. The implications include the potential loss of valuable data and the need for constant monitoring and validation of file integrity.',
                  },
                  {
                    title: '3. Storage Media Longevity and Reliability',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Digital storage media, such as hard drives, SSDs, and optical discs, are not immune to degradation and failure. Unlike traditional archival materials, which can last for centuries under proper conditions, digital storage media have a limited lifespan. Hard drives can fail due to mechanical issues, SSDs can experience data corruption, and optical discs can degrade over time. The implications are significant: data stored on these media is vulnerable to loss, necessitating regular backups and data migration. This requires robust storage infrastructure, redundancy, and ongoing monitoring to ensure data integrity.',
                  },
                  {
                    title: '4. Data Volume and Scalability',
                    icon: <Database size={16} />,
                    content: 'The sheer volume of digital content being created is growing exponentially, posing significant challenges for storage, management, and preservation. The scalability of digital preservation systems is crucial for handling this ever-expanding digital universe. Traditional archival methods are not equipped to handle the petabytes and exabytes of data generated daily. The implications include the need for massive storage capacity, efficient data management systems, and scalable preservation strategies. Cloud storage and distributed systems offer potential solutions, but they also introduce new challenges related to data security and accessibility.',
                  },
                  {
                    title: '5. Metadata and Contextual Information',
                    icon: <Clipboard size={16} />,
                    content: 'Metadata, which provides information about digital content, is essential for its long-term preservation and accessibility. Without accurate and comprehensive metadata, digital files can become meaningless. Metadata helps describe the content, format, provenance, and context of digital objects. However, metadata creation and management can be complex and time-consuming. The implications are significant: the lack of adequate metadata can render digital content unusable or difficult to interpret, leading to the loss of valuable information. Metadata standards and best practices are crucial for ensuring the long-term accessibility and understanding of digital content.',
                  },
                  {
                    title: '6. Authenticity and Integrity',
                    icon: <Fingerprint size={16} />,
                    content: 'Ensuring the authenticity and integrity of digital content is crucial for its long-term trustworthiness. Digital files can be easily altered or manipulated, making it difficult to verify their provenance and accuracy. Digital signatures, checksums, and blockchain technologies can help establish authenticity, but they require robust security measures and ongoing maintenance. The implications include the potential for fraud, misinformation, and the loss of trust in digital records. Digital preservation strategies must address these concerns to ensure the reliability and trustworthiness of digital content.',
                  },
                  {
                    title: '7. Legal and Ethical Considerations',
                    icon: <Shield size={16} />,
                    content: 'Digital preservation involves complex legal and ethical considerations, including copyright, privacy, and access rights. Digital content may be subject to various legal restrictions, making it challenging to preserve and provide access to it. Privacy concerns arise when preserving personal data, requiring careful consideration of ethical guidelines and legal frameworks. The implications include the need for clear policies and procedures for handling digital content, ensuring compliance with relevant laws and ethical principles. Digital preservation strategies must address these concerns to ensure responsible and ethical access to digital heritage.',
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

            {/* SECTION 5: Digital Preservation Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Preservation Strategies
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital preservation strategies are essential for ensuring that digital content remains accessible and usable over the long term. These strategies encompass a range of approaches and techniques designed to combat the challenges posed by technological obsolescence, file format fragility, and other digital preservation risks.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Migration: Moving Data to Newer Formats',
                    icon: <RefreshCw size={16} />,
                    content: 'Migration involves transferring digital content from one file format or storage medium to another, newer one, to ensure its continued accessibility. This strategy addresses the problem of technological obsolescence by keeping data compatible with current hardware and software. For instance, migrating older word processing documents to a modern, open-source format like OpenDocument Text ensures they can be opened and read in the future. Similarly, migrating images from outdated formats to widely supported ones like TIFF or JPEG 2000 enhances their longevity. Migration requires careful planning and execution to maintain data integrity and avoid loss of information. It is an ongoing process, as new formats and technologies emerge, requiring continuous monitoring and updates.',
                  },
                  {
                    title: '2. Emulation: Recreating the Original Environment',
                    icon: <LayersIcon size={16} />,
                    content: 'Emulation involves recreating the original hardware and software environment in which digital content was created. This strategy allows users to access older files and applications as if they were using the original systems. Emulators can be used to run outdated operating systems, software applications, and even hardware devices on modern computers. This approach is particularly useful for preserving complex digital objects, such as video games, interactive multimedia, and software applications, where the original user experience is crucial. Emulation can be technically challenging, as it requires detailed knowledge of the original systems and ongoing maintenance of the emulators themselves.',
                  },
                  {
                    title: '3. Normalization: Standardizing File Formats',
                    icon: <FileText size={16} />,
                    content: 'Normalization involves converting digital content to standardized, widely supported file formats. This strategy aims to reduce the diversity of file formats and ensure that data is stored in formats that are likely to be supported in the future. Open-source formats, such as TIFF for images and PDF/A for documents, are often preferred for normalization because they are less susceptible to obsolescence and vendor lock-in. Normalization simplifies the management and preservation of digital content by reducing the number of formats that need to be supported. It also enhances interoperability and ensures that data can be easily accessed and exchanged.',
                  },
                  {
                    title: '4. Checksums and Fixity Checking: Ensuring Data Integrity',
                    icon: <CheckCircle size={16} />,
                    content: 'Checksums and fixity checking are techniques used to verify the integrity of digital files. Checksums are unique digital fingerprints that are calculated for each file. By comparing the current checksum of a file to its original checksum, it is possible to detect any changes or corruption. Fixity checking involves regularly verifying the integrity of digital files using checksums or other methods. This strategy is crucial for ensuring that digital content remains unchanged and authentic over time. It helps detect and prevent data loss, corruption, and unauthorized modifications.',
                  },
                  {
                    title: '5. Metadata Management: Describing and Contextualizing Data',
                    icon: <Clipboard size={16} />,
                    content: 'Metadata, which provides information about digital content, is essential for its long-term preservation and accessibility. Metadata helps describe the content, format, provenance, and context of digital objects. Metadata management involves creating, storing, and maintaining metadata records. Metadata standards, such as Dublin Core and PREMIS, are used to ensure consistency and interoperability. Effective metadata management enhances the discoverability, accessibility, and usability of digital content. It also helps preserve the context and meaning of digital objects.',
                  },
                  {
                    title: '6. Storage Redundancy and Replication: Preventing Data Loss',
                    icon: <Cloud size={16} />,
                    content: 'Storage redundancy and replication involve creating multiple copies of digital content and storing them in different locations. This strategy helps prevent data loss due to hardware failure, natural disasters, or other unforeseen events. Redundant storage systems, such as RAID (Redundant Array of Independent Disks), provide multiple copies of data on different drives. Replication involves creating copies of data on geographically dispersed servers or storage systems. Cloud storage services often offer built-in redundancy and replication features. This strategy ensures that data remains accessible even if one or more storage locations become unavailable.',
                  },
                  {
                    title: '7. Digital Preservation Policies and Procedures: Establishing Frameworks',
                    icon: <SettingsIcon size={16} />,
                    content: 'Digital preservation policies and procedures provide a framework for managing and preserving digital content. These policies define the goals, strategies, and responsibilities for digital preservation. They also establish guidelines for selecting, storing, and accessing digital content. Digital preservation procedures outline the specific steps and workflows for implementing preservation strategies. Developing and implementing comprehensive policies and procedures is essential for ensuring that digital preservation efforts are consistent, sustainable, and aligned with institutional goals.',
                  },
                  {
                    title: '8. Community Collaboration and Standards Development: Shared Solutions',
                    icon: <Users size={16} />,
                    content: 'Digital preservation is a complex and evolving field that requires collaboration and cooperation among institutions, organizations, and individuals. Community collaboration involves sharing knowledge, expertise, and resources to develop and implement effective preservation strategies. Standards development involves creating and promoting best practices and guidelines for digital preservation. Organizations like the Open Preservation Foundation (OPF) and the Digital Preservation Coalition (DPC) play a crucial role in fostering collaboration and developing standards. This collaborative approach helps ensure that digital preservation efforts are aligned with best practices and address the evolving needs of the community.',
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

            {/* SECTION 6: Handling and Storage of Materials in Different Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['handling-storage'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Handling and Storage of Materials in Different Formats
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Handling and storing archival materials in different formats require specialized techniques and environments to prevent deterioration and ensure long-term preservation. Each format presents unique challenges, necessitating tailored approaches.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Paper-Based Materials (Documents, Books, Maps): Gentle Support and Stable Climates',
                    icon: <FileText size={16} />,
                    content: 'Paper-based materials, including documents, books, maps, and manuscripts, are susceptible to damage from physical handling, environmental fluctuations, and biological agents. Handling should always be done with clean, lint-free gloves to prevent the transfer of oils and dirt. Documents and maps should be stored flat in acid-free folders and boxes, while books should be shelved vertically with adequate support to prevent warping. Large-format materials like maps and posters may require specialized flat storage or rolling techniques using archival-quality tubes. Environmental control is crucial, with stable temperatures (around 65-70°F or 18-21°C) and relative humidity (30-50%) to minimize chemical degradation and mold growth. Acid-free enclosures are essential to prevent the transfer of acidity to the materials. Regular inspections for signs of insect infestation or mold are necessary, and proper ventilation is vital to prevent stagnant air that can promote deterioration.',
                  },
                  {
                    title: '2. Photographic Materials (Prints, Negatives, Slides): Cool, Dry, and Dark Conditions',
                    icon: <Camera size={16} />,
                    content: 'Photographic materials, including prints, negatives, and slides, are highly sensitive to light, humidity, and temperature. Handling should be minimal and always with clean, lint-free gloves. Prints should be stored in archival-quality sleeves or enclosures made from inert materials like polyethylene or polyester. Negatives and slides should be stored individually in similar protective sleeves, preferably in cool, dry, and dark conditions. Ideal storage temperatures are below 68°F (20°C) with low relative humidity (30-50%). Light, especially UV radiation, can cause fading and discoloration, so storage in light-tight boxes or cabinets is essential. Regular inspections for signs of deterioration, such as fading, discoloration, or emulsion breakdown, are crucial. For particularly fragile materials, cold storage (below freezing) may be considered, but this requires specialized facilities and careful acclimatization before handling.',
                  },
                  {
                    title: '3. Audio-Visual Materials (Magnetic Tapes, Films, Discs): Controlled Environments and Specialized Equipment',
                    icon: <Video size={16} />,
                    content: 'Audio-visual materials, including magnetic tapes, films, and discs, require specialized handling and storage to prevent degradation. Magnetic tapes are susceptible to print-through, binder breakdown, and signal loss, so they should be stored vertically in a cool, dry environment (around 60-65°F or 15-18°C and 30-40% RH). Films are prone to vinegar syndrome (acetate film) or nitrate deterioration (nitrate film), requiring cold storage (below freezing) and specialized ventilation for nitrate film. Optical discs are vulnerable to scratches, delamination, and data loss, so they should be stored vertically in protective cases in a cool, dry environment. Handling should be minimal and always with clean hands, avoiding fingerprints on the recording surfaces. Regular playback and migration to newer formats are essential to prevent data loss due to media degradation or obsolescence of playback equipment.',
                  },
                  {
                    title: '4. Electronic Media (Hard Drives, SSDs, USB Drives): Stable Temperatures and Data Integrity',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Electronic media, including hard drives, SSDs, and USB drives, require careful handling and storage to prevent data loss. Hard drives are susceptible to mechanical failure from shock or vibration, so they should be stored in anti-static bags and protective cases. SSDs are less vulnerable to physical shock but can experience data corruption from electrical surges or extreme temperatures. USB drives are prone to data loss from physical damage or corruption, so they should be stored in protective cases and handled with care. Ideal storage temperatures for electronic media are between 50-77°F (10-25°C) with low relative humidity. Regular backups and data integrity checks are essential to prevent data loss. Migration to newer storage media and file formats is necessary to combat technological obsolescence.',
                  },
                  {
                    title: '5. Three-Dimensional Objects (Artifacts, Textiles, Natural History Specimens): Inert Materials and Stable Conditions',
                    icon: <Box size={16} />,
                    content: 'Three-dimensional objects, including artifacts, textiles, and natural history specimens, require specialized handling and storage to prevent physical damage and deterioration. Artifacts should be stored in inert materials, such as polyethylene foam or acid-free tissue, and supported to prevent stress or breakage. Textiles are sensitive to light, humidity, and pests, requiring storage in acid-free boxes or rolled on archival-quality tubes. Natural history specimens may require specialized storage conditions, such as controlled humidity or temperature, to prevent decay or insect infestation. Handling should be minimal and always with clean gloves, using appropriate support materials. Regular inspections for signs of deterioration, such as fading, cracking, or insect damage, are crucial. Environmental control is essential, with stable temperatures and relative humidity to minimize degradation.',
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

            {/* SECTION 7: Environmental Security */}
            <div
              ref={(el) => {
                sectionRefs.current['env-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Environmental Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Environmental security is a broad concept that addresses the threats posed by environmental degradation to human well-being, national security, and global stability. It recognizes that environmental issues are not just ecological concerns, but also have profound social, economic, and political implications. Here is a breakdown of key aspects:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Resource Scarcity and Conflict',
                    icon: <AlertTriangle size={16} />,
                    content: 'One of the most pressing aspects of environmental security is the link between resource scarcity and conflict. As populations grow and consumption patterns increase, the demand for essential resources like water, food, and energy intensifies. Climate change exacerbates this scarcity by altering rainfall patterns, reducing agricultural yields, and increasing the frequency of extreme weather events. This can lead to competition and conflict over diminishing resources, particularly in regions already facing political instability or social inequality. For example, water scarcity can fuel tensions between neighbouring countries that rely on shared river basins. Food shortages can trigger social unrest and migration, destabilizing entire regions. Securing access to these resources becomes a matter of national and international security, demanding cooperative management and sustainable practices to prevent conflict.',
                  },
                  {
                    title: '2. Climate Change and Displacement',
                    icon: <Users size={16} />,
                    content: 'Climate change is driving a new form of displacement, as rising sea levels, desertification, and extreme weather events force people to leave their homes. Climate refugees, or environmental migrants, are increasingly becoming a reality, posing significant challenges to national and international security. Mass migrations triggered by environmental disasters can strain resources, exacerbate social tensions, and destabilize political systems. The implications are far-reaching, requiring international cooperation to address the root causes of climate change, provide humanitarian assistance to displaced populations, and develop sustainable adaptation strategies. The security implications of climate-induced displacement are a growing concern, demanding a proactive and comprehensive approach.',
                  },
                  {
                    title: '3. Environmental Degradation and Public Health',
                    icon: <Heart size={16} />,
                    content: 'Environmental degradation, including air and water pollution, deforestation, and soil degradation, has significant impacts on public health. Polluted air contributes to respiratory diseases, while contaminated water spreads infectious diseases. Deforestation can lead to the spread of zoonotic diseases, as humans encroach on wildlife habitats. The implications are profound, affecting the well-being and productivity of populations, and placing a strain on healthcare systems. Environmental security requires addressing these health risks by promoting clean energy, sustainable agriculture, and responsible waste management. Protecting ecosystems and biodiversity is also crucial for preventing the emergence of new diseases.',
                  },
                  {
                    title: '4. Ecosystem Stability and National Security',
                    icon: <Tree size={16} />,
                    content: 'Healthy ecosystems provide essential services, such as water purification, flood control, and climate regulation, which are vital for human well-being and national security. Ecosystem degradation can disrupt these services, leading to environmental disasters and social instability. For example, deforestation can increase the risk of floods and landslides, while the loss of wetlands can reduce water filtration and flood control capacity. Protecting and restoring ecosystems is therefore crucial for maintaining national security. This involves promoting sustainable land use practices, conserving biodiversity, and managing natural resources responsibly. Recognizing the intrinsic value of ecosystems and their role in providing security is essential for long-term stability.',
                  },
                  {
                    title: '5. Transboundary Environmental Issues',
                    icon: <GlobeIcon size={16} />,
                    content: 'Many environmental issues, such as air pollution, water pollution, and climate change, transcend national borders, requiring international cooperation to address. Transboundary pollution can affect the health and well-being of populations in neighbouring countries, while climate change impacts are felt globally. International agreements and treaties are essential for managing these issues and promoting sustainable development. However, enforcing these agreements and ensuring compliance can be challenging, requiring strong political will and international collaboration. Environmental security demands a global perspective and a commitment to addressing transboundary issues through cooperative solutions.',
                  },
                  {
                    title: '6. Environmental Governance and Conflict Prevention',
                    icon: <Shield size={16} />,
                    content: 'Effective environmental governance is essential for preventing conflicts and promoting sustainable development. This involves establishing clear policies and regulations, promoting transparency and accountability, and ensuring the participation of all stakeholders. Environmental governance can help manage resource conflicts, mitigate the impacts of climate change, and promote sustainable practices. However, weak governance, corruption, and lack of enforcement can undermine these efforts. Environmental security requires strengthening environmental governance at all levels, from local to international, to ensure that environmental issues are addressed effectively and equitably. This includes promoting the rule of law, strengthening institutions, and fostering cooperation among nations.',
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

            {/* SECTION 8: Issues to Consider When Handling Records in Different Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['format-issues'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Issues to Consider When Handling Records in Different Formats
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Handling records in different formats requires careful consideration of their unique physical and chemical properties to prevent damage and ensure long-term preservation. Here is a breakdown of key issues:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Physical Fragility and Structural Integrity',
                    icon: <AlertCircle size={16} />,
                    content: 'Each record format has its own inherent physical fragility. Paper-based materials, for instance, are susceptible to tearing, creasing, and abrasion, especially if they are old or acidic. Photographic materials have delicate emulsion layers that can be easily scratched or damaged by fingerprints. Audio-visual materials like magnetic tapes and films can be brittle and prone to breakage, while optical discs are vulnerable to scratches and delamination. Electronic media, such as hard drives and USB drives, are susceptible to damage from shock, vibration, and static electricity. Understanding the physical fragility of each format is crucial for developing appropriate handling procedures. This includes using proper support materials, such as archival trays and book cradles, and minimizing physical stress during handling. For delicate materials, digitization may be a preferable option to reduce handling.',
                  },
                  {
                    title: '2. Chemical Instability and Degradation',
                    icon: <FlaskRound size={16} />,
                    content: 'Many record formats are susceptible to chemical degradation over time. Paper can become acidic and brittle, photographic materials can fade and discolour, and magnetic tapes can undergo binder breakdown. Environmental factors, such as temperature, humidity, and light, can accelerate these processes. Chemical instability is a major concern for long-term preservation, necessitating careful control of storage conditions. Acid-free enclosures, stable temperature and humidity levels, and low light conditions are essential for slowing down chemical degradation. Regular inspections for signs of deterioration, such as yellowing, fading, or embrittlement, are crucial for identifying and addressing potential issues.',
                  },
                  {
                    title: '3. Environmental Sensitivity and Control',
                    icon: <SettingsIcon size={16} />,
                    content: 'Environmental factors, such as temperature, humidity, and light, play a significant role in the deterioration of records. Different formats have varying degrees of environmental sensitivity. Paper-based materials are susceptible to damage from high humidity and fluctuating temperatures, while photographic materials are highly sensitive to light and UV radiation. Audio-visual materials require stable temperature and humidity levels to prevent degradation. Electronic media are vulnerable to extreme temperatures and humidity, as well as magnetic fields. Maintaining stable environmental conditions is crucial for long-term preservation. This involves using climate control systems, such as HVAC, to regulate temperature and humidity, and implementing light control measures, such as UV-filtering materials and low-level lighting.',
                  },
                  {
                    title: '4. Handling Techniques and Best Practices',
                    icon: <Handshake size={16} />,
                    content: 'Improper handling is a major cause of damage to records. Handling techniques should be tailored to the specific format and its physical properties. Clean, lint-free gloves should always be used to prevent the transfer of oils and dirt. Support materials, such as book cradles and archival trays, should be used to prevent stress and damage during handling. Records should be handled with care, avoiding unnecessary bending, folding, or pressure. Training staff and users in proper handling techniques is crucial for ensuring that records are handled safely and responsibly.',
                  },
                  {
                    title: '5. Storage Conditions and Enclosures',
                    icon: <Archive size={16} />,
                    content: 'Proper storage conditions and enclosures are essential for protecting records from physical damage and environmental factors. Records should be stored in acid-free enclosures, such as folders, boxes, and sleeves, to prevent the transfer of acidity and other harmful substances. Storage areas should be clean, dry, and well-ventilated. Records should be stored in a way that minimizes physical stress and prevents damage from dust, pests, and other contaminants. For particularly fragile materials, specialized storage solutions, such as cold storage or inert gas storage, may be necessary.',
                  },
                  {
                    title: '6. Data Migration and Technological Obsolescence',
                    icon: <RefreshCw size={16} />,
                    content: 'Electronic media and digital records present unique challenges related to data migration and technological obsolescence. Hardware and software become outdated quickly, making it difficult to access older digital files. Data migration involves transferring digital content from one format or storage medium to another to ensure its continued accessibility. Regular migration is essential for preventing data loss and ensuring that digital records remain usable. Digital preservation strategies, such as emulation and normalization, are also crucial for addressing technological obsolescence.',
                  },
                  {
                    title: '7. Security and Access Control',
                    icon: <Lock size={16} />,
                    content: 'Records may contain sensitive or confidential information that requires protection. Access control measures are essential for ensuring that only authorized individuals have access to records. This involves implementing security protocols, such as passwords, encryption, and access logs. Physical security measures, such as locked storage areas and security cameras, are also important for preventing unauthorized access. Maintaining the integrity of records is also crucial, ensuring that they are not altered or tampered with. Digital signatures and checksums can help verify the authenticity and integrity of digital records.',
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
                  <span>Environmental Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Digital Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Tropical Challenges</span>
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
                Environmental factors – temperature, humidity, light, pollutants, biological agents, and handling – all impact record stability. Control them with climate control, humidity management, UV filtration, air filtration, IPM, and handling protocols. Tropical regions face unique challenges: high heat, humidity, pests, intense sunlight, extreme weather, and limited resources. Digital preservation challenges include technological obsolescence, format fragility, storage media longevity, data volume, metadata, authenticity, and legal issues. Digital strategies include migration, emulation, normalization, checksums, metadata management, storage redundancy, policies, and collaboration.
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
                <strong className="text-white">Environmental Elements</strong> – Temperature, humidity, light, pollutants, biological agents, and handling affect record stability. Control with climate control, humidity management, UV filtration, air filtration, IPM, and handling protocols.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tropical Challenges</strong> – High temperatures, humidity, biological infestations, intense sunlight, extreme weather, and limited resources pose unique preservation challenges in tropical regions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Digital Preservation</strong> – Challenges: technological obsolescence, format fragility, storage media longevity, data volume, metadata, authenticity, and legal issues. Strategies: migration, emulation, normalization, checksums, metadata management, storage redundancy, policies, and collaboration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Handling &amp; Storage</strong> – Paper: gentle support and stable climates. Photos: cool, dry, dark conditions. AV: controlled environments. Electronic: stable temperatures and data integrity. 3D objects: inert materials and stable conditions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Environmental Security</strong> – Resource scarcity, climate displacement, public health, ecosystem stability, transboundary issues, and governance are all linked to national and global security.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 2 (Preservation Challenges &amp; Strategies)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;