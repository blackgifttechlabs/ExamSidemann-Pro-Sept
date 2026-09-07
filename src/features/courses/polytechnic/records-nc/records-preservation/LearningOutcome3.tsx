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
  { id: 'techniques', label: 'Reformatting Techniques' },
  { id: 'advantages', label: 'Advantages & Disadvantages' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'legal-ethical', label: 'Legal & Ethical' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'The first digital image was created in 1957 by Russell Kirsch – it was a 176×176 pixel scan of his infant son.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use lossless formats like TIFF for master digital copies – JPEG compression can introduce artifacts and reduce image quality.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven reformatting techniques with "D-M-P-T-O-A-B": Digitization, Microfilming, Photocopying, Transcription, OCR, Audio/Video Reformatting, Born-Digital Reformatting.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions forget to create comprehensive metadata during digitization, making it difficult to search and manage digital collections later.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first digital image was created in 1957 by Russell Kirsch – it was a 176×176 pixel scan of his infant son.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use lossless formats like TIFF for master digital copies – JPEG compression can introduce artifacts and reduce image quality.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven reformatting techniques with "D-M-P-T-O-A-B": Digitization, Microfilming, Photocopying, Transcription, OCR, Audio/Video Reformatting, Born-Digital Reformatting.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions forget to create comprehensive metadata during digitization, making it difficult to search and manage digital collections later.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Reformatting Techniques &{' '}
            <span className="text-purple-300 font-bold italic">
              Digital Preservation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to digitization, microfilming, OCR, transcription, audio/video reformatting, advantages, disadvantages, challenges, and legal/ethical implications.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scan size={14} className="inline mr-1" /> Digitization
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Film size={14} className="inline mr-1" /> Microfilming
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDriveIcon size={14} className="inline mr-1" /> Digital
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
                placeholder="Search for a technique, advantage, challenge..."
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
            {/* SECTION 1: Reformatting Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['techniques'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reformatting Techniques
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reformatting techniques are crucial for preserving and providing access to archival materials by transferring information from one format to another. This process helps mitigate deterioration and makes content more accessible. Here is a breakdown of common reformatting techniques:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Digitization: Transforming Analog to Digital',
                    icon: <Scan size={16} />,
                    content: 'Digitization involves converting analogue materials, such as paper documents, photographs, and audio-visual recordings, into digital formats. This process uses scanners, digital cameras, and audio/video capture devices to create digital copies of the original materials. Digitization offers several advantages, including improved accessibility, reduced handling of fragile originals, and the ability to create multiple copies for backup and distribution. Digital images can be stored in various formats, such as TIFF for high-resolution images or JPEG for web display. Digital audio and video files can be stored in formats like WAV or MP4. Digitization requires careful planning to ensure high-quality digital copies that accurately represent the original materials. This includes selecting appropriate scanning resolutions, colour settings, and file formats. Metadata is also crucial for describing the digital copies and ensuring their long-term accessibility.',
                  },
                  {
                    title: '2. Microfilming: Capturing Images on Film',
                    icon: <Film size={16} />,
                    content: 'Microfilming involves photographing documents and other materials onto microfilm, a photographic film on which documents are recorded in greatly reduced size. This technique has been used for decades as a preservation method, particularly for paper-based materials. Microfilm is durable and can last for centuries under proper storage conditions. It also offers space savings, as large volumes of documents can be stored on a relatively small amount of film. Microfilming requires specialized equipment and expertise, including cameras, film processors, and readers. While digitization has become more prevalent, microfilming remains a viable option for long-term preservation, especially for institutions with limited resources for digital storage.',
                  },
                  {
                    title: '3. Photocopying: Creating Paper Copies',
                    icon: <Copy size={16} />,
                    content: 'Photocopying involves creating paper copies of documents using a photocopier. This technique is simple and cost-effective for creating duplicates of paper-based materials. Photocopying can be useful for providing access copies of frequently used documents, reducing the need to handle the originals. However, photocopying can also damage fragile materials, especially if they are old or acidic. Acid-free paper should be used for photocopying archival materials to prevent the transfer of acidity. Photocopying should be used judiciously and only when necessary, as it does not offer the same level of preservation as digitization or microfilming.',
                  },
                  {
                    title: '4. Transcription: Converting Audio to Text',
                    icon: <FileText size={16} />,
                    content: 'Transcription involves converting audio recordings into text. This technique is essential for making audio content accessible to those who are deaf or hard of hearing, as well as for researchers who prefer to work with text. Transcription can be done manually or using speech recognition software. Manual transcription is time-consuming but offers high accuracy. Speech recognition software can be faster but may require editing to correct errors. Transcription requires careful attention to detail and a thorough understanding of the audio content. The resulting text files can be stored in various formats, such as plain text or PDF. Metadata is also important for describing the audio recordings and the transcription process.',
                  },
                  {
                    title: '5. Optical Character Recognition (OCR): Extracting Text from Images',
                    icon: <Eye size={16} />,
                    content: 'Optical character recognition (OCR) involves extracting text from images, such as scanned documents or photographs. This technique is used to create searchable text files from images, making it easier to find and retrieve information. OCR software analyses the images and converts the text into digital characters. The accuracy of OCR depends on the quality of the images and the complexity of the text. OCR can be used to create searchable PDF files, which combine the visual appearance of the original documents with the searchability of digital text. OCR is a valuable tool for making archival materials more accessible and searchable.',
                  },
                  {
                    title: '6. Audio and Video Reformatting: Transferring Analog to Digital Audio/Visual',
                    icon: <Video size={16} />,
                    content: 'This involves transferring analogue audio and video recordings to digital formats. For audio, this could involve digitizing recordings from reel-to-reel tapes, cassettes, or vinyl records into formats like WAV or MP3. For video, this involves converting formats like VHS, Betamax, or film reels into digital files like MP4 or AVI. This process requires specialized equipment and expertise to ensure high-quality digital transfers. Proper calibration and maintenance of the equipment are crucial for preserving the audio and visual fidelity of the original recordings. Digital audio and video files can be stored on hard drives, optical discs, or cloud storage. Metadata is essential for describing the original recordings and the digitization process.',
                  },
                  {
                    title: '7. Born-Digital Reformatting: Migrating and Emulating Digital Data',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Born-digital materials, such as electronic documents, databases, and websites, require different reformatting techniques. Data migration involves transferring digital content from one file format or storage medium to another, newer one, to ensure its continued accessibility. Emulation involves recreating the original hardware and software environment in which the digital content was created. Normalization involves converting digital content to standardized, widely supported file formats. These techniques are essential for combating technological obsolescence and ensuring the long-term accessibility of born-digital materials. They require ongoing maintenance and updates to keep pace with evolving technologies.',
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

            {/* SECTION 2: Advantages and Disadvantages */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages and Disadvantages of Each Reformatting Method
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When considering reformatting methods for archival materials, it is essential to weigh the advantages and disadvantages of each technique. Here is a breakdown:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Digitization',
                    icon: <Scan size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Enhanced accessibility: Digital copies can be easily shared and accessed remotely. Reduced handling of originals: Minimizes wear and tear on fragile materials. Improved searchability: Digital text can be made searchable using OCR. Creation of multiple copies: Ensures backup and redundancy. Facilitates online access and sharing.</p>
                        <p><strong>Disadvantages:</strong> Technological obsolescence: Digital formats and storage media can become outdated. High initial costs: Requires specialized equipment and expertise. Data integrity concerns: Digital files can be corrupted or altered. Copyright and privacy issues: Requires careful consideration of legal and ethical implications. Requires careful metadata creation. Can create very large file sizes.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Microfilming',
                    icon: <Film size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Long-term preservation: Microfilm is durable and can last for centuries under proper storage. Space savings: Reduces the physical storage space required for documents. Relatively low cost: Compared to digitization, microfilming can be more affordable. Standardized format. "Eye-readable" format.</p>
                        <p><strong>Disadvantages:</strong> Limited accessibility: Requires specialized equipment for viewing. Difficult to search: Microfilm is not easily searchable. Image quality: Can degrade over time. Slower retrieval times than digital.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Photocopying',
                    icon: <Copy size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Simple and cost-effective: Easy to create duplicates of paper documents. Quick and convenient: Can be done on-site with readily available equipment. Easy to create paper copies.</p>
                        <p><strong>Disadvantages:</strong> Potential damage to originals: Can damage fragile materials. Limited preservation value: Photocopies are not as durable as other reformatting methods. Quality degradation: Copies may lose detail and clarity. Acid from the copy process, and the paper used, can degrade the copy over time.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Transcription',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Improved accessibility: Makes audio content accessible to those who are deaf or hard of hearing. Enhanced searchability: Text files can be easily searched. Facilitates research: Text transcripts are easier to analyse and work with.</p>
                        <p><strong>Disadvantages:</strong> Time-consuming: Manual transcription is a labour-intensive process. Accuracy concerns: Speech recognition software may produce errors. Contextual loss: Transcripts may not capture nuances of the original audio.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Optical Character Recognition (OCR)',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Increased searchability: Makes scanned documents and images searchable. Improved accessibility: Text can be easily copied and pasted. Enhanced efficiency: Saves time and effort in retrieving information.</p>
                        <p><strong>Disadvantages:</strong> Accuracy limitations: OCR accuracy depends on image quality and text complexity. Formatting issues: OCR may not accurately preserve the original formatting. Requires clean, high quality original scans.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Audio and Video Reformatting',
                    icon: <Video size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Preservation of deteriorating media: Transfers content to more stable digital formats. Improved accessibility: Digital files can be easily accessed and shared. Enhanced quality: Digital remastering can improve audio and video quality.</p>
                        <p><strong>Disadvantages:</strong> High costs: Requires specialized equipment and expertise. Potential for data loss: Improper digitization can result in loss of audio or video quality. Technological obsolescence of digital formats.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Born-Digital Reformatting',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Advantages:</strong> Ensures long-term accessibility: Addresses technological obsolescence. Maintains data integrity: Migration and emulation preserve the original content. Enhances interoperability: Normalization to standard formats facilitates data exchange.</p>
                        <p><strong>Disadvantages:</strong> Complexity: Requires specialized expertise and ongoing maintenance. Potential for data loss: Migration and emulation can introduce errors. Resource-intensive: Requires significant storage and processing power. Emulation can be very hardware intensive.</p>
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

            {/* SECTION 3: Challenges Faced by Archivists or Records Managers When Reformatting Collections */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges Faced by Archivists or Records Managers When Reformatting Collections
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reformatting collections presents archivists and records managers with a complex array of challenges, demanding careful planning, resource allocation, and technical expertise. Here is a look at the key hurdles they face:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Resource Constraints',
                    icon: <DollarSign size={16} />,
                    content: 'One of the most significant challenges is the constraint of resources. Reformatting projects, especially digitization, are often expensive, requiring specialized equipment, software, and skilled personnel. Many archival institutions operate with limited budgets, making it difficult to allocate sufficient funds for reformatting. Staffing is another crucial factor. Reformatting demands expertise in areas like digital imaging, audio/video preservation, and metadata creation, which may not be readily available within the institution. This can lead to delays and compromises in project quality. Prioritizing collections for reformatting become a critical task, balancing the preservation needs of fragile materials with the accessibility demands of users. Often, archivists must seek grant funding or external support to undertake large-scale reformatting projects, adding another layer of complexity to the process.',
                  },
                  {
                    title: '2. Technological Obsolescence',
                    icon: <Zap size={16} />,
                    content: 'Digital technologies evolve rapidly, posing a constant challenge to reformatting projects. File formats, storage media, and hardware become obsolete quickly, requiring ongoing migration and maintenance. Archivists must stay abreast of the latest technological developments and anticipate future changes. This can be particularly challenging for born-digital materials, which require specialized strategies like emulation and normalization. Ensuring long-term accessibility of digital collections demands continuous monitoring and updating of file formats and storage systems. This requires a proactive approach to technology management and a commitment to ongoing training and education for staff.',
                  },
                  {
                    title: '3. Maintaining Fidelity and Integrity: Ensuring Accurate Representation',
                    icon: <CheckCircle size={16} />,
                    content: 'Reformatting processes must accurately capture the information and characteristics of the original materials. This requires careful attention to detail and adherence to best practices. Digitization, for example, demands high-resolution scanning, accurate colour reproduction, and proper image processing to ensure that digital copies are faithful representations of the originals. Audio and video reformatting requires specialized equipment and expertise to maintain sound and image quality. Maintaining metadata integrity is also crucial, as metadata provides essential context and information about the reformatting process. Archivists must develop and implement quality control measures to ensure that reformatted materials meet preservation standards and user needs. This includes regular inspections, testing, and validation of digital files.',
                  },
                  {
                    title: '4. Copyright and Intellectual Property',
                    icon: <Shield size={16} />,
                    content: 'Copyright and intellectual property laws pose significant challenges for reformatting projects. Many archival materials are protected by copyright, which can restrict their reproduction and distribution. Archivists must carefully research and obtain necessary permissions before reformatting copyrighted materials. This can be a time-consuming and complex process, especially for older materials where copyright ownership may be unclear. Digital reformatting also raises new copyright issues, such as the creation of derivative works and the distribution of digital copies online. Archivists must develop clear policies and procedures for managing copyright and intellectual property rights, ensuring compliance with legal requirements and ethical standards.',
                  },
                  {
                    title: '5. Selection and Prioritization',
                    icon: <Target size={16} />,
                    content: 'Given limited resources, archivists must carefully select and prioritize collections for reformatting. This involves assessing the preservation needs of materials, the research value of collections, and the accessibility demands of users. Fragile or deteriorating materials may take precedence, while high-demand collections may be prioritized for digitization to improve access. Developing clear selection criteria and conducting thorough assessments are crucial for making informed decisions. Archivists must also consider the long-term preservation goals of the institution and align reformatting projects with these goals. This requires a strategic approach to collection management and a commitment to preserving the most valuable and at-risk materials.',
                  },
                  {
                    title: '6. Metadata Management',
                    icon: <Clipboard size={16} />,
                    content: 'Metadata, which provides information about archival materials, is essential for their discoverability and accessibility. Reformatting projects must include comprehensive metadata creation and management. This involves describing the physical characteristics, content, and provenance of the materials. Metadata standards, such as Dublin Core and PREMIS, are used to ensure consistency and interoperability. Archivists must develop and implement metadata workflows that are integrated with reformatting processes. This includes training staff in metadata creation and ensuring that metadata is accurate, complete, and consistent. Metadata management is a crucial aspect of digital preservation, ensuring that reformatted materials remain accessible and understandable over time.',
                  },
                  {
                    title: '7. Storage and Long-Term Preservation',
                    icon: <Cloud size={16} />,
                    content: 'Digital reformatting creates new storage and preservation challenges. Digital files require robust storage infrastructure, including redundant systems and regular backups, to prevent data loss. Archivists must develop and implement digital preservation strategies that address the long-term sustainability of digital collections. This includes monitoring file integrity, migrating data to newer formats, and emulating obsolete software and hardware. Digital preservation requires ongoing investment in storage infrastructure, software, and expertise. Archivists must also consider the environmental impact of digital storage and seek sustainable solutions.',
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

            {/* SECTION 4: Legal and Ethical Implications */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-ethical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Legal and Ethical Implications of Reformatting Techniques
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reformatting archival materials, while often necessary for preservation and accessibility, raises complex legal and ethical implications that archivists and records managers must carefully consider. Here is a breakdown of the key issues:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Copyright and Intellectual Property: Balancing Access with Rights',
                    icon: <BookOpen size={16} />,
                    content: 'Copyright law protects the rights of creators and owners of intellectual property, including literary, artistic, and musical works. Reformatting archival materials, especially those created within the last 70 years, often involves reproducing copyrighted works. Archivists must carefully research and obtain necessary permissions before reformatting copyrighted materials. This can be challenging, particularly for older materials where copyright ownership may be unclear or difficult to trace. Digital reformatting introduces new copyright issues, such as the creation of derivative works and the distribution of digital copies online. Fair use or fair dealing provisions may allow for limited reproduction for purposes such as research or education, but these provisions vary by jurisdiction and are subject to interpretation. Archivists must develop clear policies and procedures for managing copyright and intellectual property rights, ensuring compliance with legal requirements and ethical standards. They must balance the public\'s right to access information with the rights of copyright holders.',
                  },
                  {
                    title: '2. Privacy and Confidentiality: Protecting Sensitive Information',
                    icon: <Lock size={16} />,
                    content: 'Archival materials often contain sensitive personal information, such as medical records, financial data, or personal correspondence. Reformatting these materials raises privacy concerns, particularly when digital copies are made available online. Archivists have an ethical and legal obligation to protect the privacy of individuals whose information is contained in archival records. This may involve redacting sensitive information, restricting access to certain materials, or implementing security measures to prevent unauthorized access. Data protection laws, such as GDPR, impose strict requirements for handling personal data, including the need to obtain consent and implement appropriate security measures. Archivists must carefully consider the privacy implications of reformatting projects and develop policies and procedures that comply with relevant laws and ethical guidelines.',
                  },
                  {
                    title: '3. Authenticity and Integrity: Ensuring Trustworthiness of Reformatted Materials',
                    icon: <Fingerprint size={16} />,
                    content: 'Reformatting processes must accurately capture the information and characteristics of the original materials. Ensuring the authenticity and integrity of reformatted materials is crucial for their trustworthiness and reliability. Digital reformatting introduces new challenges, as digital files can be easily altered or manipulated. Archivists must implement quality control measures to ensure that reformatted materials are faithful representations of the originals. This includes using high-resolution scanning, accurate colour reproduction, and proper image processing. Digital signatures and checksums can help verify the authenticity and integrity of digital files. Archivists must also document the reformatting process, including the methods used, equipment employed, and any modifications made to the original materials. This documentation provides essential context and helps establish the provenance of the reformatted materials.',
                  },
                  {
                    title: '4. Cultural Sensitivity and Ethical Considerations: Respecting Diverse Perspectives',
                    icon: <GlobeIcon size={16} />,
                    content: 'Archival materials often reflect diverse cultural perspectives and historical experiences. Reformatting projects must be conducted with sensitivity and respect for these perspectives. Archivists must be aware of potential biases and stereotypes in archival materials and take steps to mitigate their impact. This may involve providing contextual information, including diverse viewpoints, or consulting with relevant communities. Ethical considerations also arise when reformatting materials that are sacred or culturally significant to specific groups. Archivists must respect the cultural protocols and sensitivities of these groups and seek their input on reformatting decisions. This requires building trust and fostering collaboration with diverse communities.',
                  },
                  {
                    title: '5. Accessibility and Equity: Ensuring Equal Access for All',
                    icon: <Users size={16} />,
                    content: 'Reformatting projects aim to improve access to archival materials. However, accessibility must be considered in a broader context, ensuring that all users have equal access to reformatted materials. This includes addressing barriers faced by individuals with disabilities, such as visual or hearing impairments. Archivists must ensure that digital copies of archival materials are accessible to all users, including those who use assistive technologies. This may involve providing alternative text descriptions for images, creating transcripts of audio and video recordings, and using accessible file formats. Archivists must also consider the economic and social barriers that may prevent certain users from accessing digital collections. This may involve providing free or low-cost access to digital materials, offering training and support for users, and collaborating with community organizations to reach underserved populations.',
                  },
                  {
                    title: '6. Preservation Ethics and Resource Allocation: Balancing Needs and Responsibilities',
                    icon: <Recycle size={16} />,
                    content: 'Archivists have an ethical responsibility to preserve archival materials for future generations. Reformatting projects must balance the need to improve access with the need to ensure long-term preservation. This involves making informed decisions about which materials to reformat, using appropriate reformatting techniques, and allocating resources effectively. Archivists must consider the environmental impact of reformatting processes, including the energy consumption and waste generation associated with digital storage. They should seek sustainable solutions and minimize the environmental footprint of reformatting projects. Archivists must also consider the long-term costs of maintaining digital collections and develop strategies for ensuring their sustainability. This includes planning for data migration, storage management, and ongoing preservation activities. Reformatting decisions should align with the ethical principles of preservation, access, and sustainability.',
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
                  💡 Reformatting Insight
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
                  <span>Reformatting Techniques</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Challenges</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Legal & Ethical Issues</span>
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
                Reformatting techniques – digitization, microfilming, photocopying, transcription, OCR, audio/video reformatting, and born-digital migration – each have advantages and disadvantages. Choose based on preservation needs, access goals, and resources. Challenges include resource constraints, technological obsolescence, fidelity, copyright, selection, metadata, and storage. Legal and ethical implications cover copyright, privacy, authenticity, cultural sensitivity, accessibility, and preservation ethics.
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
                <strong className="text-white">Reformatting Techniques</strong> – Seven methods: Digitization (analog to digital), Microfilming (film preservation), Photocopying (paper copies), Transcription (audio to text), OCR (image to text), Audio/Video Reformatting (analog to digital), Born-Digital Migration (updating formats). Each serves distinct preservation and access goals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Advantages &amp; Disadvantages</strong> – Digitization: accessible but costly and obsolete; Microfilming: durable but hard to search; Photocopying: cheap but damaging; Transcription: accessible but time-consuming; OCR: searchable but error-prone; AV Reformatting: preserves quality but expensive; Born-Digital: future-proof but complex.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges</strong> – Resource constraints, technological obsolescence, fidelity and integrity, copyright, selection and prioritization, metadata management, and storage/preservation. Archivists must plan strategically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Legal &amp; Ethical Implications</strong> – Copyright and intellectual property, privacy and confidentiality, authenticity and integrity, cultural sensitivity, accessibility and equity, and preservation ethics. All must be balanced in reformatting projects.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 3 (Reformatting &amp; Digital Preservation)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;