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
  Circle,
  Grid,
  Cpu,
  RotateCw,
  Link,
  Film,
  CreditCard,
  ZoomIn,
  Copy,
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
  { id: 'equipment', label: 'Filming Equipment' },
  { id: 'camera-components', label: 'Camera Components' },
  { id: 'microfilm-cameras', label: 'Microfilm Cameras' },
  { id: 'film-types', label: 'Film Types & Bases' },
  { id: 'film-structure', label: 'Film Structure' },
  { id: 'microforms', label: 'Microforms Types' },
  { id: 'microforms-characteristics', label: 'Microforms Characteristics' },
  { id: 'project-factors', label: 'Project Factors' },
  { id: 'duplication', label: 'Duplication Generations' },
  { id: 'duplicate-factors', label: 'Duplicate Factors' },
  { id: 'indexing', label: 'Indexing & Retrieval' },
  { id: 'disposal', label: 'Disposal Requirements' },
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
        text: 'The first microfilm was created in 1839 by John Benjamin Dancer, who used a microscope to photograph a 1.5-inch document.',
      },
      {
        title: 'Pro Tip',
        text: 'When microfilming, always use a test strip to check exposure and developer strength before processing the entire film roll.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key microforms with "1-3-M-A-U": 16mm, 35mm, Microfiche, Aperture Cards, Ultrafiche.',
      },
      {
        title: 'Common Mistake',
        text: 'Many projects neglect to index microfilm properly, making retrieval nearly impossible. Always plan your indexing strategy before filming.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first microfilm was created in 1839 by John Benjamin Dancer, who used a microscope to photograph a 1.5-inch document.',
      },
      {
        title: 'Pro Tip',
        text: 'When microfilming, always use a test strip to check exposure and developer strength before processing the entire film roll.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key microforms with "1-3-M-A-U": 16mm, 35mm, Microfiche, Aperture Cards, Ultrafiche.',
      },
      {
        title: 'Common Mistake',
        text: 'Many projects neglect to index microfilm properly, making retrieval nearly impossible. Always plan your indexing strategy before filming.',
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
            Filming Equipment, Microforms &{' '}
            <span className="text-emerald-300 font-bold italic">
              Microfilm Projects
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to filming equipment, camera components, microfilm types, microforms, project facilitation, duplication, indexing, and disposal.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Camera size={14} className="inline mr-1" /> Equipment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Film size={14} className="inline mr-1" /> Microforms
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <SearchIcon size={14} className="inline mr-1" /> Indexing
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
                placeholder="Search for a concept, equipment, microform type..."
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
            {/* SECTION 1: Filming Equipment and Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Filming Equipment and Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Filming equipment and materials encompass a wide range of tools used to capture moving images. The specific equipment used varies depending on the type of filming project, from large-scale cinematic productions to simple video recordings. However, some core components are essential across most filming scenarios.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Cameras',
                    icon: <Camera size={16} />,
                    content: 'The camera is the primary tool for capturing images. Modern cameras range from professional cinema cameras with high-resolution sensors and advanced features to portable camcorders and smartphone cameras. The choice of camera depends on the desired image quality, budget, and portability requirements.',
                  },
                  {
                    title: 'Lenses',
                    icon: <Circle size={16} />,
                    content: 'Lenses are optical devices that focus light onto the camera\'s sensor. Different lenses offer varying focal lengths, affecting the field of view and depth of field. Wide-angle lenses capture a broad scene, while telephoto lenses magnify distant objects. Lenses are also very important for controlling how much light enters the camera.',
                  },
                  {
                    title: 'Lighting Equipment',
                    icon: <Lightbulb size={16} />,
                    content: 'Lighting is crucial for creating well-lit and visually appealing images. Lighting equipment includes lamps, reflectors, diffusers, and filters. Proper lighting enhances image quality, creates mood, and ensures that subjects are clearly visible.',
                  },
                  {
                    title: 'Sound Recording Equipment',
                    icon: <Mic size={16} />,
                    content: 'Sound is an integral part of most filming projects. Sound recording equipment includes microphones, recorders, and mixers. Different microphones capture sound in various ways, from directional microphones for isolating specific sounds to omnidirectional microphones for capturing ambient sound.',
                  },
                  {
                    title: 'Tripods and Stabilization Equipment',
                    icon: <Package size={16} />,
                    content: 'Tripods and stabilization equipment, such as gimbals and steady cams, are used to keep the camera steady and prevent shaky footage. This is especially important for capturing smooth and professional-looking shots.',
                  },
                  {
                    title: 'Editing Equipment and Software',
                    icon: <Edit size={16} />,
                    content: 'After filming, footage is typically edited using specialized software on computers. Editing software allows filmmakers to cut, arrange, and enhance footage, add effects, and create a final product.',
                  },
                  {
                    title: 'Storage Media',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Filmed footage has to be stored. This can be done on memory cards, hard drives, or cloud storage. The type of storage used will depend on the camera, and the amount of footage being captured.',
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

            {/* SECTION 2: Components of a Camera */}
            <div
              ref={(el) => {
                sectionRefs.current['camera-components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of a Camera
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Lens',
                    icon: <Circle size={16} />,
                    content: 'The lens is like the camera\'s eye. It gathers light from the scene and focuses it onto the sensor. Different lenses change how close or far away things look, and how much of the scene is in focus.',
                  },
                  {
                    title: 'Sensor',
                    icon: <Grid size={16} />,
                    content: 'The sensor is the part that captures the light and turns it into an image. It is like the film in an old camera, but it is electronic. The size and quality of the sensor affect how clear and detailed the images are.',
                  },
                  {
                    title: 'Aperture',
                    icon: <Circle size={16} />,
                    content: 'The aperture is like the pupil of the eye. It is an opening in the lens that controls how much light enters the camera. A wider aperture lets in more light, which is useful in dark situations, and it also affects how blurry the background looks.',
                  },
                  {
                    title: 'Shutter',
                    icon: <ClockIcon size={16} />,
                    content: 'The shutter is like a curtain that opens and closes to control how long the sensor is exposed to light. Shutter speed affects how motion is captured. A fast shutter speed freezes motion, while a slow shutter speed creates a blur.',
                  },
                  {
                    title: 'Image Processor',
                    icon: <Cpu size={16} />,
                    content: 'This is the camera\'s brain. It takes the raw data from the sensor and turns it into a viewable image. It handles things like colour balance, sharpness, and noise reduction.',
                  },
                  {
                    title: 'Viewfinder/LCD Screen',
                    icon: <Eye size={16} />,
                    content: 'These are how you see what the camera is seeing. The viewfinder is a small screen you look through, and the LCD screen is a larger screen on the back of the camera. They help you frame your shots and review your recordings.',
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

            {/* SECTION 3: Types of Cameras Used in Microfilming */}
            <div
              ref={(el) => {
                sectionRefs.current['microfilm-cameras'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Cameras Used in Microfilming
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Microfilming involves capturing images of documents or other materials onto microfilm for archival purposes. Specialized cameras are used for this process, designed to handle the unique requirements of microfilming.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Rotary Cameras',
                    icon: <RotateCw size={16} />,
                    content: 'Rotary cameras are used for high-volume microfilming of documents that can be fed through the camera continuously. They use a rotating drum to transport documents past the lens, capturing images at a rapid pace. These cameras are ideal for large-scale digitization projects.',
                  },
                  {
                    title: 'Planetary Cameras',
                    icon: <GlobeIcon size={16} />,
                    content: 'Planetary cameras are used for capturing images of bound documents, books, and other materials that cannot be fed through a rotary camera. They use a flat surface to hold the documents in place while the camera captures images from above. These cameras are often used in libraries and archives.',
                  },
                  {
                    title: 'Step-and-Repeat Cameras',
                    icon: <LayersIcon size={16} />,
                    content: 'These cameras are designed to take a sequence of images of small documents, and then to step the film to the next frame, and repeat. They are used for documents such as index cards, and other small format items.',
                  },
                  {
                    title: 'Specialized Microfilm Cameras',
                    icon: <Camera size={16} />,
                    content: 'There are also many other specialized cameras, designed for specific microfilm applications. Such as cameras designed to microfilm engineering drawings, or very large format documents.',
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

            {/* SECTION 4: Types of Film and Film Bases */}
            <div
              ref={(el) => {
                sectionRefs.current['film-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types of Film and Film Bases
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Film, in its traditional photographic sense, consists of a light-sensitive emulsion coated onto a flexible base. The base provides support for the emulsion.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Film Types',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Black and White Film:</strong> This film is sensitive to variations in light intensity, rendering images in shades of grey. It is used for artistic photography, archival purposes, and scientific applications.</li>
                        <li><strong>Colour Negative Film:</strong> This film captures images in colour, producing a negative image where colours are reversed. It is used for general photography and is processed to create positive prints.</li>
                        <li><strong>Colour Reversal Film (Slide Film):</strong> This film produces a positive image directly on the film, which can be projected as a slide. It is known for its vibrant colours and is used for professional photography and presentations.</li>
                        <li><strong>Microfilm:</strong> Specifically designed for archival purposes, microfilm is used to capture images of documents and other materials at a reduced size. It is known for its longevity and high resolution.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Film Bases',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Cellulose Triacetate (CTA):</strong> Historically, this was a common film base known for its flexibility and durability. However, it is susceptible to degradation over time, known as "vinegar syndrome," which releases acetic acid.</li>
                        <li><strong>Polyester (PET):</strong> This is now the most common film base due to its superior stability and longevity. It is resistant to tearing, moisture, and chemical degradation, making it ideal for archival purposes.</li>
                        <li><strong>Cellulose Nitrate:</strong> This was used in very early films. It is highly flammable and very unstable and is no longer used.</li>
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

            {/* SECTION 5: Film Structure */}
            <div
              ref={(el) => {
                sectionRefs.current['film-structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Film Structure
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The structure of photographic film generally consists of several layers, each serving a specific purpose. Here is a simplified illustration:
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm mb-4">
                  <div className="border-b border-gray-400 dark:border-gray-600 py-1">Protective Overcoat</div>
                  <div className="border-b border-gray-400 dark:border-gray-600 py-1">Emulsion Layers (Light-sensitive)</div>
                  <div className="border-b border-gray-400 dark:border-gray-600 py-1">Adhesive Layer</div>
                  <div className="border-b border-gray-400 dark:border-gray-600 py-1">Film Base</div>
                  <div className="py-1">Anti-halation Layer</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Protective Overcoat',
                      icon: <Shield size={16} />,
                      content: 'This is a thin, transparent layer that protects the emulsion from scratches, abrasion, and other damage.',
                    },
                    {
                      title: 'Emulsion Layers',
                      icon: <LayersIcon size={16} />,
                      content: 'These are the light-sensitive layers that contain silver halide crystals. In colour film, there are multiple emulsion layers, each sensitive to a different colour of light.',
                    },
                    {
                      title: 'Adhesive Layer',
                      icon: <Link size={16} />,
                      content: 'This layer bonds the emulsion layers to the film base, ensuring that they adhere properly.',
                    },
                    {
                      title: 'Film Base',
                      icon: <FileText size={16} />,
                      content: 'This is the flexible support material that provides the foundation for the emulsion layers. As mentioned above, this is commonly polyester (PET) today.',
                    },
                    {
                      title: 'Anti-halation Layer',
                      icon: <Eye size={16} />,
                      content: 'This layer is located on the back of the film and prevents halation, which is the formation of a halo around bright light sources. It absorbs light that passes through the emulsion, preventing it from reflecting back and causing unwanted effects.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-3 bg-white dark:bg-[#121212] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-1">
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

            {/* SECTION 6: Types and Characteristics of Microforms */}
            <div
              ref={(el) => {
                sectionRefs.current['microforms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Types and Characteristics of Microforms
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Microforms are miniaturized images of documents, books, and other materials, stored on film or other media. They are used primarily for archival purposes, offering long-term preservation and space-saving benefits.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '16mm Microfilm',
                    icon: <Film size={16} />,
                    content: '16mm microfilm is a narrow film format, typically used for capturing images of documents such as checks, correspondence, and other smaller-sized records. Its compact size makes it ideal for storing large volumes of documents in a relatively small space. This type of microfilm is often used in rotary cameras, which allow for continuous, high-speed filming of documents. The images are usually arranged in a single row along the film, and the film can be stored on reels or in cartridges. The high reduction ratio achieved with 16mm microfilm means that a significant amount of information can be stored on a single reel, which is a major advantage for organizations with extensive archives. The film\'s durability and longevity make it suitable for long-term storage, ensuring that records remain accessible for many years. The 16mm format is also relatively inexpensive, making it a cost-effective solution for large-scale microfilming projects.',
                  },
                  {
                    title: '35mm Microfilm',
                    icon: <Film size={16} />,
                    content: '35mm microfilm is a wider film format, primarily used for capturing images of larger documents such as engineering drawings, newspapers, and maps. Its larger size allows for higher resolution images, which is essential for preserving the fine details of these documents. Planetary cameras are commonly used with 35mm microfilm, as they can accommodate the larger document sizes and ensure that the images are captured accurately. The images are typically arranged in a single row along the film, and the film can be stored on reels or in aperture cards. Aperture cards are specialized cards with a cut-out that holds a single frame of 35mm microfilm, making it easy to retrieve and view individual images. The high image quality and detail preservation capabilities of 35mm microfilm make it the preferred choice for archival projects where image clarity is paramount. The larger format also allows for easier viewing and reproduction of the images, which is essential for research and reference purposes.',
                  },
                  {
                    title: 'Microfiche',
                    icon: <Grid size={16} />,
                    content: 'Microfiche is a flat sheet of film containing multiple micro images arranged in a grid pattern. This format is commonly used for storing reports, catalogues, and other multi-page documents. The grid layout allows for efficient storage and retrieval of individual pages, as each frame can be easily located and viewed. Microfiche is typically produced using step-and-repeat cameras, which capture images of individual pages and then advance the film to the next frame. The sheets are then processed and stored in envelopes or jackets for easy access. Microfiche offers a compact and cost-effective way to store large volumes of documents, and it is particularly useful for applications where quick access to individual pages is required. The format is also relatively durable and long-lasting, making it suitable for archival purposes.',
                  },
                  {
                    title: 'Aperture Cards',
                    icon: <CreditCard size={16} />,
                    content: 'Aperture cards are specialized cards with a cut-out that holds a single frame of 35mm microfilm. These cards are commonly used for storing engineering drawings, architectural plans, and other large-format documents. The cards provide a convenient way to store and retrieve individual images, as each card can be easily labelled and filed. Aperture cards are often used in conjunction with automated retrieval systems, which allow for quick and efficient access to specific images. The format is also durable and long-lasting, making it suitable for archival storage. The ability to store individual frames of 35mm microfilm in a card format makes aperture cards a unique and valuable microform option.',
                  },
                  {
                    title: 'Ultrafiche',
                    icon: <ZoomIn size={16} />,
                    content: 'Ultrafiche is a type of microfiche that uses very high reduction ratios, allowing for the storage of a large number of images on a single sheet of film. This format is commonly used for storing catalogues, parts lists, and other documents that require a high level of information density. Ultrafiche requires specialized readers and printers to view and reproduce the images, as the high reduction ratios make them difficult to view with standard microfiche equipment. Despite the specialized equipment requirements, ultrafiche offers a highly efficient way to store and retrieve large volumes of information.',
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

            {/* SECTION 7: Characteristics of Microforms */}
            <div
              ref={(el) => {
                sectionRefs.current['microforms-characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of Microforms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Longevity',
                    icon: <ClockIcon size={16} />,
                    content: 'One of the primary characteristics of microforms is their longevity. When stored under proper conditions, microforms can last for hundreds of years, making them an ideal medium for archival storage. The film base, typically polyester (PET), is highly resistant to degradation, and the silver halide emulsion is stable and durable. Proper storage conditions include maintaining a stable temperature and humidity, as well as protecting the film from light and pollutants. By adhering to these storage guidelines, organizations can ensure that their records remain accessible for future generations.',
                  },
                  {
                    title: 'High Resolution',
                    icon: <Eye size={16} />,
                    content: 'Microforms are capable of capturing and storing images with high resolution, which is essential for preserving the fine details of documents. The high resolution ensures that even small text and intricate graphics are legible and reproducible. This is particularly important for archival projects where image clarity is paramount. The ability to capture high-resolution images makes microforms a reliable medium for preserving valuable records.',
                  },
                  {
                    title: 'Space Efficiency',
                    icon: <Box size={16} />,
                    content: 'Microforms offer significant space-saving benefits compared to paper documents. The miniaturization of images allows for the storage of large volumes of information in a relatively small space. This is particularly advantageous for organizations with extensive archives, as it reduces the need for costly storage facilities. The space efficiency of microforms also makes them a practical solution for long-term storage, as it minimizes the physical footprint of the archives.',
                  },
                  {
                    title: 'Durability',
                    icon: <Shield size={16} />,
                    content: 'Microforms are highly durable and resistant to damage from handling and environmental factors. The film base is strong and flexible, and the emulsion is protected by a protective overcoat. This durability ensures that the images remain intact and legible, even after many years of storage. The durability of microforms makes them a reliable medium for preserving valuable records.',
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

            {/* SECTION 8: Factors to Consider When Facilitating Microfilm Projects */}
            <div
              ref={(el) => {
                sectionRefs.current['project-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Facilitating Microfilm Projects
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When facilitating microfilm projects, a multitude of factors must be carefully considered to ensure the project's success and the preservation of valuable information. Here is a breakdown of the key factors:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Project Scope and Objectives',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Clearly Define Goals:</strong> Before embarking on a microfilm project, it is crucial to clearly define the project\'s scope and objectives. What specific documents need to be microfilmed? What are the intended uses of the microfilm? What are the desired outcomes of the project? This clarity will guide all subsequent decisions and ensure that the project stays on track. Understanding the purpose of the project, allows you to properly allocate resources.</li>
                        <li><strong>Prioritize Documents:</strong> Not all documents may require microfilming. Prioritize documents based on their importance, historical value, and frequency of use. This will help to manage resources effectively and ensure that the most critical documents are preserved. This is especially important in projects with a large number of documents.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Document Preparation and Handling',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Document Assessment:</strong> Thoroughly assess the condition of the documents to be microfilmed. This includes checking for damage, such as tears, folds, or stains, that could affect image quality. Documents that are in poor condition, may need to be repaired before microfilming.</li>
                        <li><strong>Document Cleaning:</strong> Clean documents to remove dust, dirt, and other debris that could interfere with the microfilming process. This is especially important for archival documents, which may have accumulated significant amounts of dust over time.</li>
                        <li><strong>Document Arrangement:</strong> Arrange documents in a logical and consistent order to facilitate easy retrieval of information from the microfilm. This might involve numbering pages, creating indexes, or using other organizational methods. Proper organization is very important for the long-term use of the microfilm.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Microfilming Equipment and Materials',
                    icon: <Camera size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Camera Selection:</strong> Choose the appropriate camera for the type of documents being microfilmed. Rotary cameras are suitable for high-volume filming of loose documents, while planetary cameras are ideal for bound volumes and large-format materials. The quality of the camera will impact the quality of the microfilm.</li>
                        <li><strong>Film Selection:</strong> Select high-quality microfilm that meets archival standards. Polyester (PET) film is recommended for its durability and longevity. Ensure that the film is compatible with the camera and processing equipment.</li>
                        <li><strong>Lighting and Resolution:</strong> Ensure that lighting conditions are optimal for capturing clear and legible images. The resolution of the microfilm should be sufficient to preserve the fine details of the documents. Poor lighting will result in poor images.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Film Processing and Quality Control',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Proper Processing:</strong> Process the microfilm according to industry standards to ensure its longevity and stability. This includes proper development, fixing, and washing. Improper processing can lead to the film deteriorating over time.</li>
                        <li><strong>Quality Control Checks:</strong> Conduct thorough quality control checks to ensure that the microfilm meets archival standards. This includes checking for image clarity, density, and resolution. Use densitometers and microscopes to verify image quality.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Storage and Environmental Conditions',
                    icon: <Archive size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Storage Environment:</strong> Store the microfilm in a controlled environment with stable temperature and humidity. This will help to prevent degradation and ensure its longevity. Ideal storage conditions will greatly increase the life of the film.</li>
                        <li><strong>Storage Containers:</strong> Use archival-quality storage containers, such as acid-free boxes and sleeves, to protect the microfilm from damage. Poor storage containers can cause chemical damage to the film.</li>
                        <li><strong>Handling Procedures:</strong> Establish proper handling procedures to minimize damage to the microfilm. This includes wearing gloves and avoiding excessive handling.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '6. Indexing and Retrieval',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Indexing System:</strong> Develop an indexing system that allows for easy retrieval of information from the microfilm. This might involve creating a database or using other indexing tools. The index should be easy to use, and accurate.</li>
                        <li><strong>Retrieval Equipment:</strong> Provide access to microfilm readers and printers to allow users to view and reproduce the images. Ensure that the retrieval equipment is well-maintained and easy to use.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '7. Budget and Timeframe',
                    icon: <DollarSign size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Budget Planning:</strong> Develop a realistic budget for the microfilm project, considering the cost of equipment, materials, labour, and storage. Unexpected costs should be factored into the budget.</li>
                        <li><strong>Timeframe Management:</strong> Establish a realistic timeframe for the project and monitor progress to ensure that deadlines are met. Delays can increase costs and decrease efficiency.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '8. Compliance and Legal Considerations',
                    icon: <Shield size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Copyright and Privacy:</strong> Ensure that the microfilm project complies with all relevant copyright and privacy laws. Obtain necessary permissions before microfilming copyrighted or sensitive documents.</li>
                        <li><strong>Archival Standards:</strong> Adhere to archival standards and best practices to ensure the long-term preservation of the documents. These standards will help to ensure that the project is done correctly.</li>
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

            {/* SECTION 9: Microfilm Duplication (Film Generations) */}
            <div
              ref={(el) => {
                sectionRefs.current['duplication'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Microfilm Duplication (Film Generations)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Microfilm duplication is the process of creating copies of original microfilm. This is essential for preservation, distribution, and access purposes. The process involves creating multiple generations of film, each with its own characteristics and uses.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Original (Camera Original/First Generation)',
                    icon: <AwardIcon size={16} />,
                    content: 'The camera original, also known as the first generation, is the film directly exposed in the microfilming camera. This film holds the highest image quality and resolution because it captures the original document\'s information. It is the most valuable version of the film and is considered the archival master. Due to its importance, the camera original is rarely used for regular viewing or distribution. Instead, it is stored under highly controlled environmental conditions to ensure its longevity and prevent damage. This meticulous preservation ensures that the original information remains intact for future generations. The camera original is primarily used as a source for creating subsequent generations of film, which are then used for viewing and distribution. This practice safeguards the original information from wear and tear, ensuring that it remains accessible for archival purposes. The camera original is the gold standard for image quality and archival preservation in microfilming.',
                  },
                  {
                    title: 'Duplicate Negative (Second Generation)',
                    icon: <Copy size={16} />,
                    content: 'The duplicate negative, or second generation, is created from the camera original. It is a negative copy of the original film and is used as a working copy for creating positive prints. This generation is often used to create working copies of the film. By using a second generation negative, the original camera original is protected from damage from everyday use. The duplicate negative maintains a high level of image quality, though it is slightly lower than the camera original. It is important to note that any imperfections or damage on the camera original will be transferred to the duplicate negative. Therefore, it is important to ensure that the camera original is free from defects before creating a duplicate negative. The duplicate negative is a valuable tool for creating multiple positive prints, which can be used for viewing and distribution. It is also used to create further generations of film, if needed.',
                  },
                  {
                    title: 'Duplicate Positive (Third Generation)',
                    icon: <FileText size={16} />,
                    content: 'The duplicate positive, or third generation, is created from the duplicate negative. It is a positive copy of the original film, meaning that the images appear as they would on the original document. This generation is commonly used for viewing and distribution, as it provides a clear and legible image. Duplicate positives are often used in libraries, archives, and other institutions where access to microfilm is required. The image quality of the duplicate positive is slightly lower than the duplicate negative, but it is still sufficient for most viewing and reproduction purposes. It is important to note that each generation of film will result in a slight loss of image quality. Therefore, it is important to minimize the number of generations used. The duplicate positive is a valuable tool for providing access to microfilm information, while protecting the camera original and duplicate negative from damage.',
                  },
                  {
                    title: 'Working Copies (Multiple Generations)',
                    icon: <LayersIcon size={16} />,
                    content: 'Working copies are additional generations of film created from the duplicate positive or other working copies. These copies are used for regular viewing and distribution, and they are often produced in large quantities. The image quality of working copies is lower than the previous generations, but it is still sufficient for most viewing and reproduction purposes. It is important to note that each generation of film will result in a slight loss of image quality. Therefore, it is important to minimize the number of generations used. Working copies are often used in applications where multiple copies of the film are required, such as in libraries, archives, and other institutions. They are also used to create microfilm copies for sale or distribution. The use of working copies allows for the protection of the higher quality generations of film, while still providing access to the information.',
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

            {/* SECTION 10: Factors to Consider When Making Film Duplicates */}
            <div
              ref={(el) => {
                sectionRefs.current['duplicate-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Making Film Duplicates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Original Film Quality',
                    icon: <AwardIcon size={16} />,
                    content: (
                      <>
                        <p>The starting point for any successful film duplication project lies in the quality and condition of the original film. This is not merely a cursory glance; it requires a meticulous inspection to identify any imperfections that could be transferred to the duplicates. Scratches, dust particles, and other forms of damage can significantly degrade the image quality of the duplicates, rendering them unusable for archival or viewing purposes. Therefore, a thorough cleaning process is essential, and any damaged sections of the film may necessitate repair or even restoration before duplication.</p>
                        <p>Furthermore, the archival stability of the original film is a critical consideration. Older films, particularly those made from cellulose nitrate, are prone to degradation and pose a fire hazard. Understanding the film\'s composition and age is crucial for determining the appropriate duplication process. In cases where the original film is deemed too unstable, digitization may be a more suitable option for preservation. The density and contrast of the original film also directly influence the quality of the duplicates, so careful adjustments to the duplication equipment are often necessary.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Duplication Equipment and Materials',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>The selection and maintenance of duplication equipment and materials are paramount for achieving accurate and consistent results. High-quality duplication equipment, calibrated to precise specifications, is essential for minimizing image degradation and ensuring faithful reproduction of the original film. The type of duplicator used must be compatible with the film type being duplicated, as different films require specific processing techniques. Similarly, the choice of duplicating film is critical. It must be compatible with the original film and the duplication equipment, and archival-quality film should be used for long-term preservation.</p>
                        <p>The chemical processing of the duplicating film is another crucial factor. Maintaining proper chemical concentrations, temperatures, and processing times is essential for achieving optimal image quality and stability. Incorrect chemical processing can lead to a range of issues, including colour shifts, density variations, and even physical damage to the film. Therefore, rigorous quality control measures are necessary to ensure that the chemical processing is performed correctly.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Image Quality and Resolution',
                    icon: <Eye size={16} />,
                    content: 'The primary goal of film duplication is to preserve the image quality and resolution of the original film. This requires careful attention to detail and precise control over the duplication process. The duplicates should maintain the density and contrast of the original film, ensuring that the images are clear and legible. This requires careful control of the exposure during duplication. The resolution and sharpness of the duplicates are also critical, particularly for documents with fine details. High-quality lenses and light sources are essential for preserving the original film\'s resolution. In cases where colour film is being duplicated, maintaining accurate colour reproduction is crucial. This requires specialized equipment and careful calibration to ensure that the colours in the duplicates are faithful to the original.',
                  },
                  {
                    title: 'Environmental Conditions: Protecting the Film from Degradation',
                    icon: <Sun size={16} />,
                    content: 'The environmental conditions during duplication and storage play a significant role in the longevity of the duplicates. Maintaining a clean environment is essential to prevent dust and other contaminants from affecting the film. Dust and dirt can create visible defects on the duplicates, degrading their image quality. Controlling temperature and humidity levels is also crucial for preventing film degradation. Extreme temperature and humidity can cause the film to warp, crack, or become brittle. Minimizing light exposure during duplication and storage is essential to prevent fading and other damage. Film is sensitive to light, and prolonged exposure can cause the images to fade over time. Therefore, the duplication process should be carried out in a darkroom or under controlled lighting conditions.',
                  },
                  {
                    title: 'Quality Control and Inspection: Ensuring Accuracy and Consistency',
                    icon: <CheckCircle size={16} />,
                    content: 'Rigorous quality control and inspection procedures are essential for ensuring that the duplicates meet the required standards. Each duplicate should be visually inspected for any defects, such as scratches, dust, or processing errors. Densitometry measurements should be taken to ensure that the density and contrast of the duplicates are within acceptable limits. Resolution targets should be used to verify that the duplicates maintain the resolution of the original film. These quality control measures help to ensure that the duplicates are of high quality and suitable for long-term preservation.',
                  },
                  {
                    title: 'Storage and Handling of Duplicates: Extending the Film\'s Lifespan',
                    icon: <Archive size={16} />,
                    content: 'The storage and handling of duplicates are critical for extending their lifespan and ensuring their long-term preservation. The duplicates should be stored in archival-quality containers, such as acid-free boxes and sleeves. These containers protect the film from dust, light, and other environmental factors. Proper handling procedures should also be followed to minimize damage to the duplicates. This includes wearing gloves to prevent the transfer of oils and other contaminants from the skin and avoiding excessive handling. By adhering to these storage and handling guidelines, organizations can ensure that their film duplicates remain in good condition for many years to come.',
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

            {/* SECTION 11: Microfilm Indexing and Retrieval */}
            <div
              ref={(el) => {
                sectionRefs.current['indexing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Microfilm Indexing and Retrieval
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Microfilm Indexing: Creating the Roadmap to Information',
                    icon: <SearchIcon size={16} />,
                    content: 'Microfilm indexing is the foundational process that transforms a collection of miniaturized images from a mere storage medium into a readily accessible archive. It is akin to creating a detailed table of contents for a vast library, allowing users to pinpoint specific documents or frames with precision. The primary purpose of indexing is to overcome the inherent challenge of navigating through lengthy reels or sheets of microfilm. Without a systematic indexing approach, retrieving desired information would be a time-consuming and often frustrating endeavour. Indexing methods vary, ranging from traditional manual systems to sophisticated computer-assisted techniques. Manual indexing, while simple, relies on meticulously crafted paper-based catalogues or indexes that list the contents of each microfilm unit. This method is suitable for smaller collections where the volume of data is manageable. However, for larger archives, computer-assisted indexing becomes indispensable. This approach leverages databases and specialized software to create electronic indexes, enabling keyword searching, sorting, and other advanced retrieval functionalities. Additionally, image marking, or "blips," involves adding small black marks to the film during filming, which retrieval equipment can read to quickly locate specific frames. Computer-Aided Retrieval (CAR) systems further enhance retrieval efficiency by integrating microfilm storage with a computer database. The database stores index information, and the computer controls the microfilm reader to automatically locate the desired frames. Regardless of the chosen method, the index should contain essential information such as document titles, dates, authors, keywords, and frame numbers. The level of detail in the index should align with the nature of the documents and the intended use of the microfilm. A well-constructed index transforms microfilm from a passive storage medium into an active and accessible information resource.',
                  },
                  {
                    title: 'Microfilm Retrieval: Accessing and Utilizing the Archived Information',
                    icon: <Eye size={16} />,
                    content: 'Microfilm retrieval is the process of physically accessing and viewing the information stored on microfilm. It is the culmination of the indexing effort, enabling users to extract the desired data from the miniaturized images. The retrieval process relies on specialized equipment, such as microfilm readers and reader-printers. Microfilm readers project magnified images from the film onto a screen, allowing users to view the documents in detail. Reader-printers extend this functionality by enabling users to create paper copies of the displayed images. Automated retrieval systems further streamline the retrieval process by using computer-controlled mechanisms to automatically locate and display specific frames. The retrieval process can be broadly categorized into manual and automated approaches. Manual retrieval involves users consulting the index to identify the frame number or location of the desired information. Users then manually advance the microfilm to the correct frame on the reader. While simple, this method can be time-consuming, particularly for large collections. Automated retrieval, on the other hand, allows users to enter search terms or frame numbers into a computer, and the system automatically locates and displays the images. This approach significantly enhances retrieval speed and efficiency. Several factors must be considered to ensure effective retrieval. The retrieval equipment should be user-friendly and accessible to all users, regardless of their technical expertise. The reader should produce clear and legible images, minimizing eye strain and facilitating accurate information extraction. Regular maintenance of the retrieval equipment is essential to ensure its proper functioning and prevent downtime. By providing appropriate retrieval equipment and implementing efficient retrieval procedures, organizations can maximize the value of their microfilmed information.',
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

            {/* SECTION 12: Disposal Requirements for Source Documents and Microfilm Records */}
            <div
              ref={(el) => {
                sectionRefs.current['disposal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Disposal Requirements for Source Documents and Microfilm Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Legal and Regulatory Compliance: Adhering to the Rules',
                    icon: <Shield size={16} />,
                    content: 'When dealing with the disposal of source documents and microfilm records, legal and regulatory compliance is paramount. Organizations must adhere to a complex web of laws, regulations, and industry standards that govern the retention and disposal of various types of records. These requirements can vary significantly depending on the nature of the documents, the industry sector, and the jurisdiction. For instance, financial records may be subject to specific retention periods mandated by accounting standards and tax laws. Similarly, medical records are often governed by strict privacy regulations and healthcare industry standards. Failure to comply with these legal and regulatory requirements can result in severe penalties, including fines, legal action, and reputational damage. Therefore, organizations must conduct thorough research and consult with legal counsel to ensure that their disposal practices align with all applicable laws and regulations. This includes establishing clear policies and procedures for record retention and disposal, documenting all disposal activities, and maintaining accurate records of disposed documents. By prioritizing legal and regulatory compliance, organizations can mitigate risks and ensure that their disposal practices are legally sound.',
                  },
                  {
                    title: '2. Data Security and Confidentiality: Protecting Sensitive Information',
                    icon: <Lock size={16} />,
                    content: 'Data security and confidentiality are critical considerations when disposing of source documents and microfilm records, especially those containing sensitive information. This includes personal data, financial records, trade secrets, and other confidential materials. Improper disposal of such records can lead to data breaches, identity theft, and other security risks. Organizations must implement robust security measures to protect sensitive information during the disposal process. This may involve shredding paper documents, degaussing or physically destroying electronic storage media, and securely erasing digital files. For microfilm records, specialized destruction methods may be required to ensure that the images are completely unreadable. It is also important to consider the chain of custody for records during the disposal process. This involves documenting all steps taken to secure and dispose of the records and ensuring that access to the records is restricted to authorized personnel. Organizations should also consider partnering with reputable disposal service providers that adhere to strict security standards and provide certificates of destruction. By prioritizing data security and confidentiality, organizations can protect sensitive information and maintain the trust of their stakeholders.',
                  },
                  {
                    title: '3. Archival Value and Historical Significance: Preserving the Past',
                    icon: <Archive size={16} />,
                    content: 'While some source documents and microfilm records may be disposable, others may hold significant archival value or historical significance. Organizations must carefully evaluate the historical importance of their records before disposing of them. This involves considering the records\' content, context, and potential research value. Records that document significant events, decisions, or cultural heritage may warrant preservation for future generations. In some cases, organizations may be required by law or regulation to preserve certain historical records. For instance, government agencies and public institutions may have legal obligations to preserve records of historical significance. Organizations should consult with archivists and historians to assess the archival value of their records and develop appropriate preservation strategies. This may involve creating digital copies of the records, storing them in climate-controlled environments, or donating them to historical societies or archives. By recognizing and preserving the archival value of their records, organizations can contribute to the preservation of history and culture.',
                  },
                  {
                    title: '4. Cost-Effectiveness and Resource Management: Balancing Preservation and Efficiency',
                    icon: <DollarSign size={16} />,
                    content: 'Disposing of source documents and microfilm records can be a costly and resource-intensive process. Organizations must carefully balance the need for preservation with the need for cost-effectiveness and resource management. This involves evaluating the costs associated with storing, maintaining, and disposing of records, and implementing strategies to minimize these costs. Organizations may consider digitizing records to reduce storage costs and improve accessibility. They may also explore outsourcing disposal services to specialized vendors. It is important to establish clear criteria for determining which records should be preserved and which can be disposed of. This may involve assessing the records\' frequency of use, legal requirements, and historical significance. By considering cost-effectiveness and resource management, organizations can ensure that their disposal practices are sustainable and efficient.',
                  },
                  {
                    title: '5. Environmental Impact: Responsible Disposal Practices',
                    icon: <Recycle size={16} />,
                    content: 'The disposal of source documents and microfilm records can have a significant environmental impact. Organizations must adopt responsible disposal practices to minimize their environmental footprint. This includes recycling paper documents, electronic storage media, and microfilm whenever possible. Organizations should also consider using environmentally friendly disposal methods, such as composting or incineration with energy recovery. It is important to partner with disposal service providers that adhere to environmental regulations and promote sustainable practices. Organizations should also educate their employees about responsible disposal practices and encourage them to adopt environmentally friendly habits. By prioritizing environmental impact, organizations can contribute to a more sustainable future.',
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
                  💡 Microfilm Insight
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
                  <span>Camera Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Microform Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Film Generations</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Filming equipment includes cameras, lenses, lighting, sound, tripods, editing tools, and storage. Camera components: lens, sensor, aperture, shutter, image processor, viewfinder. Microfilming uses rotary, planetary, step-and-repeat, and specialized cameras. Film types: black & white, colour negative, colour reversal, microfilm. Film bases: cellulose triacetate, polyester, cellulose nitrate. Microforms: 16mm, 35mm, microfiche, aperture cards, ultrafiche. Characteristics: longevity, high resolution, space efficiency, durability. Project factors: scope, document preparation, equipment, processing, storage, indexing, budget, compliance. Duplication generations: original, duplicate negative, duplicate positive, working copies. Disposal requires legal, security, archival, cost, and environmental considerations.
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
                <strong className="text-white">Filming Equipment &amp; Camera Components</strong> – Essential tools: cameras, lenses, lighting, sound, tripods, editing, storage. Camera parts: lens, sensor, aperture, shutter, image processor, viewfinder.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Microfilming Cameras &amp; Film</strong> – Rotary, planetary, step-and-repeat, specialized cameras. Film types: B&W, colour negative, colour reversal, microfilm. Bases: cellulose triacetate, polyester (PET), cellulose nitrate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Microforms</strong> – 16mm, 35mm, microfiche, aperture cards, ultrafiche. Characteristics: longevity, high resolution, space efficiency, durability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Project Factors &amp; Duplication</strong> – Scope, document prep, equipment, processing, storage, indexing, budget, compliance. Film generations: original, duplicate negative, duplicate positive, working copies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Disposal &amp; Indexing</strong> – Disposal requires legal compliance, data security, archival evaluation, cost management, and environmental responsibility. Indexing and retrieval are essential for access.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 1 (Filming &amp; Microforms)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;