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
  { id: 'concepts', label: 'Key Concepts' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'methods', label: 'Methods' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'criteria', label: 'Selection Criteria' },
  { id: 'practical', label: 'Practical Aspects' },
  { id: 'storage', label: 'Storage Media' },
  { id: 'environmental', label: 'Environmental Conditions' },
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
        text: 'The first digital image was created in 1957 by Russell Kirsch – it was a 176×176 pixel scan of his infant son.',
      },
      {
        title: 'Pro Tip',
        text: 'When reformatting documents, always preserve the original metadata – it provides essential context for future users.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key reasons for reformatting with "A-E-C-I-A": Accessibility, Efficiency, Compliance, Image/Branding, Archival.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook accessibility when reformatting, creating digital content that excludes users with disabilities.',
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
        text: 'When reformatting documents, always preserve the original metadata – it provides essential context for future users.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key reasons for reformatting with "A-E-C-I-A": Accessibility, Efficiency, Compliance, Image/Branding, Archival.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook accessibility when reformatting, creating digital content that excludes users with disabilities.',
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
            Reformatting Concepts, Methods &{' '}
            <span className="text-sky-300 font-bold italic">
              Storage Selection
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to reformatting key concepts, reasons, methods, challenges, selection criteria, practical aspects, and storage media.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Reformatting
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDriveIcon size={14} className="inline mr-1" /> Storage
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scan size={14} className="inline mr-1" /> Digitization
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
                placeholder="Search for a concept, method, criteria..."
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
            {/* SECTION 1: Key Concepts in Reformatting */}
            <div
              ref={(el) => {
                sectionRefs.current['concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Key Concepts in Reformatting
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Consistency and Standardization: Maintaining a Unified Appearance',
                    icon: <Layout size={16} />,
                    content: 'Consistency and standardization are the cornerstones of effective reformatting. When documents within an organization adhere to a uniform style, it fosters a sense of professionalism and cohesion. This uniformity extends beyond mere aesthetics, encompassing elements such as font styles, sizes, margins, headers, footers, and branding elements. Consistent formatting ensures that all documents, regardless of their content or purpose, project a unified image of the organization. This not only enhances the organization\'s credibility but also facilitates easier comprehension and navigation for the reader. Imagine a scenario where a client receives documents from the same company, each with a different font, layout, and branding. This inconsistency can create confusion and undermine the client\'s confidence in the organization\'s professionalism. Therefore, establishing clear formatting guidelines and templates is essential. These guidelines should be readily accessible to all employees, and training should be provided to ensure consistent application. By prioritizing consistency and standardization, organizations can create a polished and professional image that reinforces their brand identity and enhances communication effectiveness.',
                  },
                  {
                    title: 'Accessibility and Usability: Ensuring Documents Are for Everyone',
                    icon: <Users size={16} />,
                    content: 'Accessibility and usability are critical considerations in modern reformatting practices. Documents should be designed to be accessible to all users, including those with disabilities. This involves adhering to accessibility guidelines, such as the Web Content Accessibility Guidelines (WCAG), which provide recommendations for making digital content more accessible. This includes using proper heading structures, providing alternative text for images, ensuring sufficient colour contrast, and using clear and concise language. Usability, on the other hand, focuses on making documents easy to navigate and understand for all users. This involves using logical layouts, clear headings and subheadings, and consistent formatting. Well-structured documents with clear navigation aid comprehension and reduce cognitive load. Reformatting documents with accessibility and usability in mind not only promotes inclusivity but also enhances the overall effectiveness of communication. By prioritizing these concepts, organizations can ensure that their documents are accessible and usable to a wider audience, fostering inclusivity and enhancing communication effectiveness.',
                  },
                  {
                    title: 'Content Integrity and Accuracy: Preserving the Essence of Information',
                    icon: <CheckCircle size={16} />,
                    content: 'Reformatting should never compromise the integrity and accuracy of the document\'s content. The primary purpose of reformatting is to enhance the presentation and accessibility of information, not to alter its meaning or introduce errors. Therefore, it is essential to carefully review the content during the reformatting process to ensure that it remains accurate and up to date. This includes verifying facts, figures, and dates, and ensuring that all information is presented in a clear and logical manner. Reformatting can sometimes involve updating outdated information or correcting errors. In such cases, it is crucial to document all changes made to the content and ensure that the original meaning is preserved. By prioritizing content integrity and accuracy, organizations can ensure that their documents remain reliable and trustworthy sources of information.',
                  },
                  {
                    title: 'Branding and Visual Identity: Reinforcing the Organization\'s Image',
                    icon: <AwardIcon size={16} />,
                    content: 'Reformatting provides an opportunity to reinforce the organization\'s branding and visual identity. This involves incorporating branding elements, such as logos, colour palettes, and typography, into the document\'s design. Consistent use of branding elements across all documents helps to create a strong and recognizable brand image. This not only enhances the organization\'s visibility but also reinforces its values and messaging. Reformatting should also consider the visual appeal of the document. This involves using appropriate layouts, images, and graphics to create a visually engaging and professional presentation. By prioritizing branding and visual identity, organizations can create documents that not only convey information effectively but also reinforce their brand image and values.',
                  },
                  {
                    title: 'Efficiency and Automation: Streamlining the Reformatting Process',
                    icon: <Zap size={16} />,
                    content: 'Reformatting can be a time-consuming and resource-intensive process, especially for large volumes of documents. To streamline the process and improve efficiency, organizations can leverage automation tools and techniques. This includes using templates, style sheets, and macros to automate repetitive formatting tasks. Automation can also help to ensure consistency and accuracy by reducing the risk of human error. Furthermore, organizations can explore document management systems and content management systems to automate the reformatting and distribution of documents. By prioritizing efficiency and automation, organizations can reduce the time and resources required for reformatting, allowing employees to focus on more strategic tasks.',
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

            {/* SECTION 2: Reasons for Reformatting Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['reasons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reasons for Reformatting Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    There are several compelling reasons why organizations might choose to reformat materials, ranging from improving accessibility and efficiency to ensuring compliance and enhancing brand image. Here is a breakdown of those reasons:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Improving Accessibility',
                    icon: <Users size={16} />,
                    content: 'As technology advances and societal awareness of accessibility increases, reformatting materials becomes essential for inclusivity. Many older documents or formats may not be compatible with assistive technologies used by individuals with disabilities. Reformatting can involve converting documents to accessible formats, such as tagged PDFs or HTML, ensuring that screen readers and other assistive tools can accurately interpret the content. This allows a wider audience to access and engage with the information, promoting equity and compliance with accessibility regulations.',
                  },
                  {
                    title: 'Enhancing Usability and Readability',
                    icon: <Eye size={16} />,
                    content: 'Outdated formatting can make documents difficult to read and navigate. Reformatting allows for improvements in layout, font choices, and overall design, making the materials more user-friendly. This can involve using clear headings, subheadings, and bullet points to break up text, improving readability and comprehension. Well-structured and visually appealing documents not only enhance the user experience but also increase the likelihood that the information will be absorbed and retained.',
                  },
                  {
                    title: 'Ensuring Compliance and Legal Requirements',
                    icon: <Shield size={16} />,
                    content: 'Certain industries and jurisdictions have specific regulations regarding document formatting and retention. Reformatting may be necessary to ensure compliance with these legal requirements. This can involve adhering to specific file formats, metadata standards, or security protocols. For example, legal documents may need to be formatted in a way that preserves their authenticity and admissibility in court.',
                  },
                  {
                    title: 'Modernizing Brand Image and Consistency',
                    icon: <AwardIcon size={16} />,
                    content: 'As an organization\'s brand evolves, its visual identity may change. Reformatting materials allows for the incorporation of updated branding elements, such as logos, colour palettes, and typography. This ensures that all documents reflect the current brand image, creating a consistent and professional appearance. Modernizing the visual presentation of materials can also help to convey a sense of innovation and relevance, enhancing the organization\'s reputation.',
                  },
                  {
                    title: 'Improving Efficiency and Workflow',
                    icon: <Zap size={16} />,
                    content: 'Outdated document formats can hinder efficiency and slow down workflows. Reformatting materials into standardized digital formats can streamline processes, improve collaboration, and reduce storage costs. This can involve converting paper documents to searchable PDFs, creating templates for frequently used documents, or implementing document management systems. Digitizing and standardizing documents can also facilitate easier sharing and retrieval of information, saving time and resources.',
                  },
                  {
                    title: 'Preserving and Archiving Information',
                    icon: <Archive size={16} />,
                    content: 'Some older materials may be at risk of degradation or obsolescence. Reformatting can involve converting these materials to more durable and accessible formats for long-term preservation. This is particularly important for archival documents, historical records, and other valuable information. Digitization can also help to prevent the loss of information due to physical damage or technological obsolescence.',
                  },
                  {
                    title: 'Adapting to Technological Changes',
                    icon: <Cloud size={16} />,
                    content: 'As technology evolves, new file formats and software applications emerge. Reformatting materials ensures compatibility with current technologies and prevents information from becoming inaccessible. This can involve converting older file formats to more widely supported formats or optimizing documents for mobile devices. Adapting to technological changes ensures that information remains accessible and usable in the long term.',
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

            {/* SECTION 3: Methods Used in Reformatting */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods Used in Reformatting
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Digital Conversion (Digitization): Transforming Physical to Digital',
                    icon: <Scan size={16} />,
                    content: 'Digital conversion, or digitization, is a fundamental reformatting method that transforms physical materials into digital formats. This process is crucial for preserving older documents and making them accessible in the modern digital age. Scanning is a primary technique within digitization, where a scanner captures images of physical documents like paper records, photographs, or even microfilm. This method allows for the creation of digital images, such as JPEG or TIFF files, or searchable PDFs. Optical Character Recognition (OCR) software is often used in conjunction with scanning to extract text from scanned images, making them searchable and editable. This is extremely useful for large archives of text documents. File format conversion is another important aspect of digitization, where existing digital files are transformed from older, less compatible formats to newer, more widely supported ones. This ensures that digital information remains accessible as technology evolves. Audio and video digitization involves converting analogue recordings, such as tapes or records, into digital formats like MP3 or MP4. This process preserves older media and makes it compatible with modern playback and editing tools. Digital conversion not only preserves valuable information but also makes it easier to share, access, and manage.',
                  },
                  {
                    title: 'Document Markup and Styling: Structuring and Presenting Digital Information',
                    icon: <Layout size={16} />,
                    content: 'Document markup and styling methods focus on structuring and presenting digital information in a consistent and accessible way. Style sheets, such as CSS (Cascading Style Sheets) for HTML or XSLT (Extensible Stylesheet Language Transformations) for XML, are used to define the visual presentation of digital documents. These tools ensure that documents have a uniform appearance, making them easier to read and navigate. Templates are another essential tool, especially for frequently used documents like reports or presentations. Standardized templates enforce brand guidelines and streamline document creation, saving time and ensuring consistency. Markup languages, such as HTML (Hypertext Markup Language) and XML (Extensible Markup Language), are used to structure and format digital documents. These languages provide semantic meaning to the content, making it easier for computers to understand and process. This is particularly important for web pages and other digital documents that need to be accessible to a wide range of users and devices. Effective document markup and styling are crucial for creating well-organized, visually appealing, and accessible digital documents.',
                  },
                  {
                    title: 'Physical Reformatting: Preserving and Restoring Physical Materials',
                    icon: <Archive size={16} />,
                    content: 'Physical reformatting methods are used to preserve and restore physical materials that are at risk of deterioration. Microfilming and microfiching involve capturing images of documents onto microfilm or microfiche for long-term archival storage. This method is particularly useful for preserving large volumes of documents in a compact and durable format. Conservation and restoration techniques involve repairing and restoring damaged physical documents, such as paper records, books, or photographs. These techniques aim to preserve the original materials and prevent further deterioration. Rebinding is the process of replacing the binding of a book, which is often done to repair damaged books or extend their lifespan. Physical reformatting methods are essential for preserving valuable historical documents and artifacts, ensuring that they remain accessible for future generations.',
                  },
                  {
                    title: 'Data Migration: Moving and Transforming Data',
                    icon: <Database size={16} />,
                    content: 'Data migration involves transferring data from one database system to another. This process is often necessary when organizations upgrade their systems or consolidate data from multiple sources. Database conversion ensures that data remains compatible and accessible in the new system. Data transformation is a related process that involves cleaning, standardizing, and restructuring data during migration. This ensures that the data is accurate, consistent, and usable in the new system. Data migration and transformation are crucial for ensuring that organizations can effectively manage and utilize their data in modern information systems.',
                  },
                  {
                    title: 'Accessibility Reformatting: Making Digital Content Accessible',
                    icon: <Users size={16} />,
                    content: 'Accessibility reformatting methods are used to make digital content accessible to users with disabilities. Tagging PDFs involves adding tags to PDF documents to provide structural information that screen readers and other assistive technologies can interpret. This ensures that PDF documents comply with accessibility standards, such as WCAG (Web Content Accessibility Guidelines). Adding alternative text (alt text) to images and other non-text content provides text descriptions that can be read by screen readers, making visual content accessible to users with visual impairments. Captioning and subtitling audio and video content provides text transcripts that can be read by users with hearing impairments. Accessibility reformatting is essential for creating inclusive digital content that can be used by everyone.',
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

            {/* SECTION 4: Challenges in Reformatting Records */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Reformatting Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Data Integrity and Accuracy: Keeping the Information True',
                    icon: <CheckCircle size={16} />,
                    content: 'One of the biggest hurdles in reformatting records is ensuring that the information stays true to the original. This is especially important for records like legal documents, historical archives, or scientific data, where even small errors can have big consequences. When you move information from one format to another, there is always a risk of losing or changing some of it. Imagine trying to copy an old handwritten letter into a computer file – some of the details might get lost or misinterpreted. To avoid this, you need careful checks and balances throughout the reformatting process. Any mistakes made during the conversion could lead to serious problems down the line, affecting the reliability and trustworthiness of the records.',
                  },
                  {
                    title: 'Data Loss or Corruption: Preventing Information from Vanishing',
                    icon: <AlertCircle size={16} />,
                    content: 'Moving data between different systems or file types can be risky. If not done correctly, it can lead to data loss or corruption. This means that some of the information might disappear or become unreadable. Think of it like trying to translate a book into a new language – if the translation is not done properly, some of the original meaning might be lost. This challenge becomes even greater when dealing with large amounts of data or complex file formats. To prevent this, you need to use reliable software and follow strict procedures. Also, it is very important to make backups of the original data before you start reformatting, so you have a safety net.',
                  },
                  {
                    title: 'Compatibility and Technological Obsolescence: Keeping Up with Changing Tech',
                    icon: <Cloud size={16} />,
                    content: 'Many organizations have records stored in old systems or file formats that are no longer supported. This can make it very difficult to access and reformat the information. It is like trying to play an old record on a modern CD player – it just will not work. On top of that, technology is constantly changing, so what works today might be outdated tomorrow. This means that organizations need to choose reformatting methods that will still be usable in the future. Finding the right tools and expertise to handle older formats and keeping up with new technology is a constant challenge.',
                  },
                  {
                    title: 'Resource Constraints: Dealing with Limited Funds and Time',
                    icon: <DollarSign size={16} />,
                    content: 'Reformatting records can be expensive and time-consuming. This is especially true for large organizations with vast amounts of data. The cost of equipment, software, and skilled personnel can quickly add up. Also, the reformatting process itself can take a long time, especially if the records are in poor condition or require careful handling. Many organizations struggle to find the necessary funds and time to complete reformatting projects, which can lead to delays or incomplete work.',
                  },
                  {
                    title: 'Legal and Regulatory Compliance: Following the Rules',
                    icon: <Shield size={16} />,
                    content: 'Organizations must follow various laws and regulations regarding how long they need to keep certain records and how they can dispose of them. Reformatting records needs to comply with all of these rules. For example, some records might need to be kept for a certain number of years, even after they have been reformatted. Also, records that contain private information need to be handled with care to protect people\'s privacy. Failing to follow these rules can result in fines or other legal problems.',
                  },
                  {
                    title: 'Physical Condition of Records: Handling Fragile Materials',
                    icon: <FileText size={16} />,
                    content: 'Many older records are in poor physical condition. Paper documents can be faded, torn, or brittle, while microfilm can be scratched or damaged. This makes them difficult to reformat without causing further damage. Handling and reformatting fragile materials requires specialized skills and equipment. Also, the environment where the records are stored plays a big role in their condition. Things like temperature and humidity can make them deteriorate faster.',
                  },
                  {
                    title: 'Metadata Management: Keeping Track of Important Details',
                    icon: <Database size={16} />,
                    content: 'Metadata is like the information about the information. It includes details like when a document was created, who created it, and what it is about. This information is crucial for understanding the context and history of the records. Reformatting records needs to preserve or create accurate metadata so that the records remain useful. Also, using standard metadata formats helps make sure that the information can be used with different systems.',
                  },
                  {
                    title: 'Accessibility: Making Records Usable for Everyone',
                    icon: <Users size={16} />,
                    content: 'When reformatting records for digital use, it is important to make them accessible to everyone, including people with disabilities. This means following accessibility standards, like providing text descriptions for images and making sure documents can be read by screen readers. Also, reformatted documents must be compatible with a wide range of devices and software, so that everyone can access the information.',
                  },
                  {
                    title: 'Ensuring Security: Protecting Sensitive Information',
                    icon: <Lock size={16} />,
                    content: 'Many records contain sensitive information, such as personal data or financial details. Reformatting these records requires careful consideration of security risks. Unauthorized access or disclosure of this information can have serious consequences. Organizations must implement strong security measures, such as encryption and access controls, to protect the data during and after reformatting.',
                  },
                  {
                    title: 'Version Control: Tracking Changes and Updates',
                    icon: <RefreshCw size={16} />,
                    content: 'When records are reformatted or updated, it is important to keep track of the different versions. This is especially true for documents that are frequently revised or updated. Version control helps ensure that everyone is working with the most current version and that changes can be tracked and reviewed. This can be complex, especially when many people are working on the same documents.',
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

            {/* SECTION 5: Criteria Used to Select Materials for Reformatting */}
            <div
              ref={(el) => {
                sectionRefs.current['criteria'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Criteria Used to Select Materials for Reformatting
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Frequency of Use and Demand: Prioritizing Active Resources',
                    icon: <ClockIcon size={16} />,
                    content: 'One of the primary criteria for selecting materials for reformatting is their frequency of use and demand. If a particular document, record, or media is frequently accessed by users, it makes sense to prioritize its reformatting. Reformatting these materials ensures that they remain readily available and easily usable, improving efficiency and productivity. For example, if a library\'s historical newspaper collection is regularly requested by researchers, digitizing it would significantly enhance accessibility. Similarly, internal company documents that are frequently referenced by employees should be prioritized for digital conversion. This criterion helps organizations focus their reformatting efforts on materials that will provide the greatest benefit to their users, maximizing the return on investment.',
                  },
                  {
                    title: 'Physical Condition and Preservation Needs: Saving Fragile Items',
                    icon: <FileText size={16} />,
                    content: 'The physical condition of materials is another crucial factor in the selection process. Documents that are damaged, deteriorating, or at risk of becoming unusable should be prioritized for reformatting. This includes materials that are faded, torn, brittle, or affected by environmental factors like mold or pests. Reformatting these materials not only preserves their content but also prevents further damage, ensuring their long-term accessibility. For instance, fragile historical documents or valuable artwork should be digitized or microfilmed to protect them from physical degradation. This criterion emphasizes the importance of safeguarding valuable information and cultural heritage.',
                  },
                  {
                    title: 'Legal and Regulatory Requirements: Ensuring Compliance',
                    icon: <Shield size={16} />,
                    content: 'Organizations must consider legal and regulatory requirements when selecting materials for reformatting. Certain types of records, such as legal documents, financial records, or medical records, may be subject to specific retention and preservation mandates. Reformatting these materials ensures compliance with these requirements and avoids potential legal penalties. For example, government agencies may be required to digitize certain records for public access or long-term preservation. Similarly, businesses may need to reformat financial records to comply with accounting standards. This criterion highlights the importance of adhering to legal obligations and maintaining regulatory compliance.',
                  },
                  {
                    title: 'Archival Value and Historical Significance: Protecting Important History',
                    icon: <Archive size={16} />,
                    content: 'Materials with significant archival value or historical significance should be prioritized for reformatting. These materials document important events, decisions, or cultural heritage, and their preservation is crucial for future generations. For instance, historical photographs, personal letters of notable figures, or records of significant social movements should be digitized or microfilmed to ensure their long-term accessibility. Reformatting these materials not only preserves their content but also makes them available for research and education. This criterion underscores the importance of safeguarding our collective history and cultural heritage.',
                  },
                  {
                    title: 'Cost-Effectiveness and Resource Efficiency: Making Smart Choices',
                    icon: <DollarSign size={16} />,
                    content: 'Organizations must consider the cost-effectiveness and resource efficiency of reformatting projects. This involves evaluating the costs associated with reformatting, such as equipment, personnel, and storage, and comparing them to the benefits of preserving and accessing the materials. For example, digitizing a large collection of documents may be more cost-effective than storing and maintaining physical copies. Organizations should also consider the availability of resources and prioritize projects that can be completed within their budget and timeframe. This criterion emphasizes the importance of making informed decisions and maximizing the return on investment.',
                  },
                  {
                    title: 'Accessibility and Usability: Making Information Available to All',
                    icon: <Users size={16} />,
                    content: 'Reformatting materials to improve accessibility and usability is a key criterion. This includes making documents accessible to individuals with disabilities by using accessible formats and technologies. For example, digitizing documents and using OCR software can make them searchable and readable by screen readers. Additionally, reformatting materials to improve usability can involve creating clear and consistent layouts, using appropriate fonts, and formatting, and providing metadata and indexing. This criterion highlights the importance of ensuring that information is accessible to everyone, regardless of their abilities.',
                  },
                  {
                    title: 'Technological Obsolescence: Keeping Up with Changing Tech',
                    icon: <Cloud size={16} />,
                    content: 'Materials stored in obsolete formats or on outdated media should be prioritized for reformatting. This ensures that the information remains accessible as technology evolves. For example, converting data from old floppy disks or tapes to modern digital formats prevents data loss and ensures compatibility with current systems. Organizations should also consider the long-term viability of reformatting methods and choose formats that are likely to remain accessible in the future. This criterion emphasizes the importance of staying ahead of technological changes and ensuring the long-term accessibility of information.',
                  },
                  {
                    title: 'Organizational Goals and Strategic Priorities: Aligning with the Mission',
                    icon: <Target size={16} />,
                    content: 'Finally, organizations should select materials for reformatting based on their goals and strategic priorities. Reformatting projects should align with the organization\'s mission, values, and long-term objectives. For example, a research institution may prioritize reformatting scientific data, while a museum may focus on digitizing its art collection. This criterion highlights the importance of aligning reformatting efforts with the organization\'s overall strategy and ensuring that they contribute to its success.',
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

            {/* SECTION 6: Practical Aspects of Different Approaches to Reformatting */}
            <div
              ref={(el) => {
                sectionRefs.current['practical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Practical Aspects of Different Approaches to Reformatting
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Digital Conversion (Digitization)',
                    icon: <Scan size={16} />,
                    content: 'When it comes to digital conversion, the practical side involves a lot of hands-on work with technology. For paper documents, this means carefully feeding sheets through scanners, making sure they are straight and clean to avoid blurry or skewed images. You have to choose the right scanner settings for resolution and colour, which can be tricky if you are dealing with different types of documents. Then, there is the software side, where you might use Optical Character Recognition (OCR) to turn scanned images into searchable text. This is not always perfect, so you will often spend time proofreading and correcting errors. When dealing with older audio or video tapes, you need specialized equipment that can transfer the analogue signals to digital files. This process is delicate, as old tapes can be fragile and prone to damage. You will also need to consider file formats and compression settings to ensure the digital files are of good quality and manageable size. In practice, digitization often requires a blend of technical skills, attention to detail, and patience, especially when dealing with large volumes of diverse materials.',
                  },
                  {
                    title: 'Document Markup and Styling',
                    icon: <Layout size={16} />,
                    content: 'The practical aspect of document markup and styling involves working directly with digital code and design tools. For web documents, this means writing HTML to structure the content and CSS to define its appearance. You will spend time experimenting with different layouts, fonts, and colours to create a visually appealing and user-friendly design. It is a bit like being an architect and interior designer rolled into one, but for digital documents. When creating templates for reports or presentations, the focus is on creating a consistent and efficient workflow. This involves setting up style guides and using software features that allow you to automate formatting tasks. You might use macros or scripts to apply consistent headings, footers, and page numbers across multiple documents. In practice, this approach requires a good understanding of design principles and technical skills in markup languages and styling software. It is about finding the right balance between creating a visually pleasing document and ensuring that it is easy to read and navigate.',
                  },
                  {
                    title: 'Physical Reformatting',
                    icon: <Archive size={16} />,
                    content: 'Physical reformatting is very hands-on and requires a different set of skills. When microfilming documents, you are working with specialized cameras and film processing equipment. This involves carefully positioning documents to ensure clear images and maintaining the equipment to prevent errors. Conservation and restoration of damaged documents requires even more specialized skills. You might use delicate tools and chemicals to repair tears, remove stains, or strengthen fragile paper. This is a very precise and time-consuming process, often requiring a deep understanding of the materials and their properties. Rebinding books involves disassembling the old binding, repairing any damaged pages, and creating a new binding. This requires craftsmanship and attention to detail. In practice, physical reformatting is about preserving the original materials while making them more durable and accessible. It often involves a combination of technical skills, artistic ability, and a deep respect for the materials.',
                  },
                  {
                    title: 'Data Migration',
                    icon: <Database size={16} />,
                    content: 'In the practical realm, Data Migration involves a blend of technical expertise and careful planning. You would use specialized software tools to extract data from old systems, transform it to fit the new system\'s requirements, and then load it into the new database. This process will require a great deal of testing to make sure all data is moved correctly. You may need to write scripts or queries to clean and standardize the data, which can be complex and time-consuming. You will also need to deal with issues such as data mapping and data validation. In practice, data migration is about ensuring that the data remains accurate and consistent throughout the process. It often involves close collaboration between IT professionals and data analysts.',
                  },
                  {
                    title: 'Accessibility Reformatting',
                    icon: <Users size={16} />,
                    content: 'Practically, accessibility reformatting involves adding features to digital documents that make them usable for people with disabilities. For PDFs, this means adding tags that provide structural information for screen readers. You will use specialized software to add these tags and ensure that the document is properly structured. Adding alternative text to images involves writing clear and concise descriptions of the images, which can be time-consuming but crucial for users with visual impairments. Captioning and subtitling audio and video content requires transcribing the spoken words and adding time codes to synchronize the text with the audio or video. In practice, accessibility reformatting is about going beyond basic formatting to create documents that are truly inclusive. It often involves a combination of technical skills, attention to detail, and a deep understanding of accessibility guidelines.',
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

            {/* SECTION 7: Selecting Appropriate Storage Media */}
            <div
              ref={(el) => {
                sectionRefs.current['storage'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Selecting Appropriate Storage Media
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Selecting appropriate storage media is a critical decision that impacts the long-term accessibility, integrity, and security of reformatted records. The choice of storage medium depends on various factors, including the type of data, the intended use, the required longevity, and budgetary constraints. Here is a breakdown of the practical aspects involved in selecting appropriate storage media:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Understanding Data Characteristics',
                    icon: <Database size={16} />,
                    content: 'The first step in selecting storage media is to thoroughly understand the characteristics of the data being stored. This includes the data\'s size, format, and sensitivity. For example, high-resolution images or videos require significantly more storage space than text documents. Sensitive data, such as personal or financial information, necessitates storage media with robust security features. The format of the data also influences the choice of storage medium. Some formats, like archival TIFF images, are better suited for long-term preservation, while others, like MP4 videos, are designed for efficient playback and streaming. In practical terms, this step involves conducting a detailed data inventory and analysis to identify the specific storage requirements.',
                  },
                  {
                    title: 'Evaluating Longevity and Durability',
                    icon: <ClockIcon size={16} />,
                    content: 'Longevity and durability are paramount for archival storage. The chosen storage medium should be capable of withstanding the test of time and environmental factors. For example, archival-grade optical discs or microfilm can offer extended lifespans compared to consumer-grade hard drives or flash drives. However, these archival media require specific storage conditions, such as controlled temperature and humidity, to maximize their longevity. In practical terms, this step involves researching the longevity and durability ratings of different storage media and selecting those that meet the organization\'s long-term preservation goals. This also requires planning for environmental storage conditions, and how those conditions will be monitored.',
                  },
                  {
                    title: 'Assessing Accessibility and Retrieval',
                    icon: <SearchIcon size={16} />,
                    content: 'The accessibility and retrieval of stored data are crucial for its usability. The chosen storage medium should allow for efficient and reliable data retrieval. For example, digital storage media, such as hard drives or cloud storage, offer fast and convenient access to data. However, they may require specialized hardware or software to read the data. In contrast, microfilm requires microfilm readers, which may not be readily available in all locations. In practical terms, this step involves considering the frequency of data access, the required retrieval speed, and the availability of retrieval equipment. It also requires planning for data migration to new storage formats, as older storage mediums inevitably become obsolete.',
                  },
                  {
                    title: 'Considering Security and Data Protection',
                    icon: <Lock size={16} />,
                    content: 'Security and data protection are vital considerations, particularly for sensitive information. The chosen storage medium should offer robust security features to prevent unauthorized access, data breaches, and data loss. For example, encrypted hard drives or cloud storage with access controls can provide enhanced security. In contrast, optical discs or microfilm may be more vulnerable to physical damage or theft. In practical terms, this step involves implementing security measures, such as encryption, access controls, and data backups, to protect the stored data. It also requires developing a data security policy and training employees on best practices for data handling.',
                  },
                  {
                    title: 'Evaluating Cost and Scalability',
                    icon: <DollarSign size={16} />,
                    content: 'Cost and scalability are essential factors in selecting storage media. The chosen storage medium should be cost-effective and scalable to accommodate future growth. For example, cloud storage offers scalability and pay-as-you-go pricing, making it a flexible option for organizations with fluctuating storage needs. However, long-term storage costs can accumulate over time. In contrast, physical storage media, such as hard drives or optical discs, may have higher upfront costs but lower long-term storage costs. In practical terms, this step involves conducting a cost-benefit analysis and selecting storage media that align with the organization\'s budget and storage capacity requirements.',
                  },
                  {
                    title: 'Planning for Data Migration and Obsolescence',
                    icon: <RefreshCw size={16} />,
                    content: 'Technological obsolescence is a significant challenge in long-term data storage. Storage media and file formats become outdated over time, making it difficult to access stored data. Therefore, organizations must plan for data migration to new storage media and file formats. In practical terms, this step involves developing a data migration strategy, identifying migration tools and resources, and budgeting for migration costs. It also requires staying informed about emerging storage technologies and standards.',
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

            {/* SECTION 8: Environmental Conditions and Materials Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['environmental'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Environmental Conditions and Materials Handling
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These factors are paramount in ensuring the longevity and integrity of stored information, whether it is on microfilm, digital media, or restored physical documents.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Controlling Environmental Factors',
                    icon: <Sun size={16} />,
                    content: 'Environmental conditions play a pivotal role in the preservation of records. Fluctuations in temperature and humidity can cause significant damage to various storage media. For instance, high humidity can lead to mold growth on paper documents and microfilm, while excessive dryness can make them brittle. Digital media, such as hard drives and optical discs, are also susceptible to damage from extreme temperatures and humidity. Ideally, storage facilities should maintain a stable temperature between 18-22°C (64-72°F) and a relative humidity of 30-50%. Air quality is another critical consideration, as pollutants and dust particles can accelerate the degradation of records. Air filtration systems should be implemented to remove harmful contaminants. Furthermore, exposure to light, especially ultraviolet (UV) radiation, can cause fading and deterioration. Storage areas should be kept dark or illuminated with low levels of UV-free lighting. In practical terms, this involves investing in environmental control systems, regularly monitoring conditions with sensors, and implementing preventive measures to mitigate risks.',
                  },
                  {
                    title: 'Implementing Proper Materials Handling Procedures',
                    icon: <Handshake size={16} />,
                    content: 'Materials handling procedures are essential for minimizing physical damage to records during storage and retrieval. Improper handling can result in tears, scratches, and other forms of damage that compromise the integrity of the information. For paper documents and microfilm, this involves wearing clean cotton gloves to prevent the transfer of oils and contaminants from the skin. Records should be handled carefully and supported to avoid bending or folding. Digital media should be handled by the edges to avoid touching the sensitive surfaces. When retrieving records from storage, it is crucial to use appropriate equipment and techniques. For example, microfilm readers should be used to view microfilm, and hard drives should be handled with care to avoid shocks or vibrations. In practical terms, this involves developing and implementing standardized handling procedures, training staff on proper techniques, and providing appropriate tools and equipment.',
                  },
                  {
                    title: 'Using Archival-Quality Storage Materials',
                    icon: <Box size={16} />,
                    content: 'The choice of storage materials can significantly impact the longevity of records. Archival-quality materials are designed to be chemically stable and inert, preventing them from reacting with the records and causing damage. For paper documents and microfilm, this involves using acid-free boxes, folders, and sleeves. These materials prevent the transfer of harmful chemicals and protect the records from dust and light. For digital media, this involves using archival-grade optical discs or hard drives that are designed for long-term storage. These media are typically made from high-quality materials and undergo rigorous testing to ensure their durability. In practical terms, this involves researching and selecting archival-quality storage materials that meet the specific requirements of the records.',
                  },
                  {
                    title: 'Establishing Disaster Preparedness and Recovery Plans',
                    icon: <Shield size={16} />,
                    content: 'Despite the best efforts to control environmental conditions and implement proper handling procedures, disasters can still occur. Organizations must establish disaster preparedness and recovery plans to minimize the impact of events such as floods, fires, and earthquakes. These plans should include procedures for salvaging damaged records, restoring environmental conditions, and backing up digital data. In practical terms, this involves conducting risk assessments, developing emergency response procedures, and regularly testing the plans to ensure their effectiveness.',
                  },
                  {
                    title: 'Regular Monitoring and Maintenance',
                    icon: <RefreshCw size={16} />,
                    content: 'Regular monitoring and maintenance are essential for ensuring the long-term preservation of records. This involves periodically inspecting storage areas for signs of damage or deterioration, monitoring environmental conditions, and cleaning storage materials. Digital media should be regularly checked for data integrity and backed up to prevent data loss. In practical terms, this involves establishing a schedule for monitoring and maintenance, training staff on inspection procedures, and using appropriate tools and software for data integrity checks.',
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
                  <span>Key Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Reformatting Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Selection Criteria</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Reformatting preserves and enhances information through consistency, accessibility, integrity, branding, and efficiency. Reasons include accessibility, usability, compliance, branding, efficiency, archival, and adaptation. Methods: digitization, markup, physical reformatting, data migration, accessibility reformatting. Challenges: data integrity, loss, compatibility, resources, compliance, physical condition, metadata, accessibility, security, version control. Selection criteria: frequency, condition, legal, archival, cost, accessibility, obsolescence, goals. Storage selection considers data characteristics, longevity, accessibility, security, cost, and migration planning.
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
                <strong className="text-white">Key Concepts</strong> – Consistency, accessibility, content integrity, branding, and efficiency are the five pillars of effective reformatting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reasons &amp; Methods</strong> – Reasons: accessibility, usability, compliance, branding, efficiency, archival, adaptation. Methods: digitization, markup, physical reformatting, data migration, accessibility reformatting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges</strong> – Data integrity, loss, compatibility, resources, compliance, physical condition, metadata, accessibility, security, version control all pose significant hurdles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Selection Criteria &amp; Storage</strong> – Select materials based on frequency, condition, legal, archival, cost, accessibility, obsolescence, and goals. Storage selection considers data characteristics, longevity, accessibility, security, cost, and migration planning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Environmental Conditions</strong> – Control temperature, humidity, light, and pollutants. Use proper handling procedures, archival-quality materials, disaster plans, and regular monitoring for long-term preservation.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 2 (Reformatting Concepts &amp; Storage)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;