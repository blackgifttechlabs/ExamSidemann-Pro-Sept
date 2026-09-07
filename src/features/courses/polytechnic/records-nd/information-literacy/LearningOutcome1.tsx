import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
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
  // Additional icons used in this specific content
  FolderTree,
  Paperclip,
  Layout,
  Edit,
  ListChecks,
  Type,
  Focus,
  Minimize,
  Scissors,
  Database,
  User,
  Send,
  ShieldCheck,
  Bell,
  File,
  Folder,
  Clipboard,
  Mail,
  Lock,
  Eye,
  AlertCircle,
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
  Brain,
  Link,
  Fingerprint,
  KeyRound,
  Siren,
  Flame,
  Waves,
  Globe,
  Settings,
  Layers,
  Circle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION – auto‑generated from the content headings
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'basic-concepts', label: 'Basic Concepts' },
  { id: 'components', label: 'Components' },
  { id: 'benefits', label: 'Benefits to IS' },
  { id: 'differences', label: 'IL vs. CL' },
  { id: 'characteristics', label: 'IL Individual' },
  { id: 'acrl', label: 'ACRL' },
  { id: 'pivotal-role', label: 'Pivotal Role' },
  { id: 'knowledge-society', label: 'Knowledge Society' },
  { id: 'benefits-society', label: 'Benefits in Society' },
  { id: 'future-implications', label: 'Future Implications' },
  { id: 'globalization', label: 'Globalization' },
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
        text: 'The ACRL Standards for Information Literacy are widely adopted in higher education to define the skills students need for research and lifelong learning.',
      },
      {
        title: 'Pro Tip',
        text: 'Information literacy is not just about finding information; it’s about critically evaluating it and using it ethically.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five ACRL standards with "D-A-E-U-E": Determine, Access, Evaluate, Use, and Understand (ethical/legal issues).',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse information literacy with computer literacy – one is about content, the other about the tool.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The ACRL Standards for Information Literacy are widely adopted in higher education to define the skills students need for research and lifelong learning.',
      },
      {
        title: 'Pro Tip',
        text: 'Information literacy is not just about finding information; it’s about critically evaluating it and using it ethically.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five ACRL standards with "D-A-E-U-E": Determine, Access, Evaluate, Use, and Understand (ethical/legal issues).',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse information literacy with computer literacy – one is about content, the other about the tool.',
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
            <FileText size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Information Literacy, Society &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Global Knowledge
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to information literacy concepts, ACRL standards, information society characteristics, globalization, and future implications.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> ACRL
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Society
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Literacy
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
                placeholder="Search for a concept, standard, or characteristic..."
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
          <div
            id="lesson-scroll-area"
            ref={listContainerRef}
            className="space-y-12 overflow-y-auto max-h-[calc(100vh-12rem)] scroll-smooth"
          >
            {/* ========== SECTION 1: BASIC CONCEPTS ========== */}
            <div
              ref={(el) => { sectionRefs.current['basic-concepts'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Concepts in Information Literacy
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Characterizing Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information, in its essence, can be characterized as data that has been given meaning through context, interpretation, and organization. It is more than just raw facts; it is data that has been processed and made useful for a specific purpose. Information can take various forms, including text, images, audio, and video, and it can be found in a multitude of sources, from books and journals to websites and social media platforms. The value of information lies in its ability to reduce uncertainty, answer questions, and support decision-making. However, not all information is created equal. It can vary in terms of accuracy, relevance, reliability, and timeliness. Therefore, developing the ability to critically evaluate information sources and assess their credibility is a fundamental aspect of information literacy. In the digital age, where information is abundant and readily accessible, this ability to discern high-quality information from misinformation or disinformation is more crucial than ever. Characterizing information effectively involves understanding its context, purpose, and potential biases, allowing individuals to make informed judgments about its value and applicability. This understanding is the base layer for information literacy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Brain size={16} /> Information/Knowledge Conundrum
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The relationship between information and knowledge is a complex and often debated topic. While information and knowledge are closely related, they are not synonymous. Information can be seen as the building blocks of knowledge. Knowledge, on the other hand, is a deeper understanding of a subject, gained through experience, study, or reflection. It involves the ability to apply information, to make connections between different pieces of information, and to synthesize new insights. The conundrum lies in the fact that having access to vast amounts of information does not automatically translate into knowledge. Individuals must be able to process, analyze, and synthesize information to transform it into meaningful knowledge. This requires critical thinking skills, problem-solving abilities, and a deep understanding of the subject matter. In the context of information literacy, this means that individuals must not only be able to find and access information but also be able to evaluate its credibility, understand its context, and apply it to their own needs. The information/knowledge conundrum highlights the importance of developing higher-order thinking skills to navigate the information landscape effectively. Information is the raw material, and knowledge is the crafted product.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <RefreshCw size={16} /> Information Lifecycle
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information lifecycle describes the stages through which information passes, from its creation to its eventual disposal or archiving. Understanding the information lifecycle is essential for effective information management and utilization. The lifecycle typically includes stages such as creation, storage, dissemination, use, and preservation or disposal. The creation stage involves the generation of new information through research, writing, or other forms of production. The storage stage involves the organization and preservation of information for future use. The dissemination stage involves the distribution of information to its intended audience. The use stage involves the application of information to solve problems, make decisions, or create new knowledge. The preservation or disposal stage involves the long-term archiving of valuable information or the deletion of obsolete or irrelevant information. Each stage of the information lifecycle requires specific skills and strategies for effective management. For example, in the creation stage, researchers must be able to cite sources accurately and avoid plagiarism. In the storage stage, organizations must implement robust systems for data backup and security. In the dissemination stage, individuals must be able to effectively communicate information to others. Understanding the information lifecycle helps individuals and organizations to manage information effectively and to ensure that it is available and accessible when needed. This perspective allows one to see information as a flow, rather than a static object.
                </p>
              </div>
            </div>

            {/* ========== SECTION 2: COMPONENTS ========== */}
            <div
              ref={(el) => { sectionRefs.current['components'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Components of Information Literacy
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Determining the Extent of Information Needed
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This initial stage involves recognizing the need for information and defining the scope and nature of that need. It's more than just knowing you need to find something; it's about understanding the specific parameters of your information requirement. This includes defining the research topic or question with precision, identifying the key concepts and keywords associated with that topic, and determining the depth and breadth of information required. For instance, a student researching the history of digital preservation will need to distinguish between a general overview and a detailed analysis of specific preservation techniques. They must determine if they require historical documents, technical specifications, or expert opinions, and then formulate a strategy to gather those specific types of information. This process requires a critical self-assessment of one's current knowledge and a clear understanding of the information gap that needs to be filled.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Accessing the Needed Information Effectively and Efficiently
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Once the information need is defined, the next step is to locate and retrieve relevant information from a variety of sources. This involves developing effective search strategies, utilizing appropriate search tools and technologies, and navigating diverse information environments. It requires familiarity with various information formats, such as books, journals, databases, websites, and multimedia resources, and the ability to evaluate their suitability for the task at hand. Effective access also entails understanding the organization and structure of information resources, knowing how to use advanced search techniques, and being able to assess the credibility and relevance of search results. For example, a librarian searching for metadata standards for digital archives must be able to navigate professional databases, utilize specialized search engines, and critically evaluate the reliability of information found on organizational websites. This ability to find and access information is essential for efficient and effective information retrieval.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Evaluating Information and Its Sources Critically
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Critical evaluation of information is a cornerstone of information literacy. This involves assessing the accuracy, reliability, and credibility of information sources and the information they contain. It requires individuals to consider the author's credentials, the source's purpose, potential biases, and the context in which the information is presented. This includes the ability to distinguish between fact and opinion, to identify misinformation and disinformation, and to assess the relevance and timeliness of information. In the digital age, where information is abundant but not always reliable, critical evaluation skills are essential for making informed decisions. For example, a researcher evaluating an online article on climate change must consider the author's expertise, the source's reputation, and any potential conflicts of interest. This ensures that the information used is accurate and trustworthy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Edit size={16} /> Using Information Effectively to Accomplish a Specific Purpose
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy extends beyond simply finding and evaluating information; it also involves the ability to synthesize, organize, and apply information effectively to accomplish a specific purpose. This includes the ability to integrate information from multiple sources, to create new knowledge, and to apply information to solve problems or make decisions. It also involves the ability to communicate information effectively to others, using appropriate formats and technologies. This component requires individuals to develop effective note-taking, summarizing, and synthesizing skills, as well as the ability to use information ethically and responsibly. For example, a student writing a research paper must be able to synthesize information from various sources into a coherent argument, citing all sources appropriately and avoiding plagiarism. This ensures that information is used ethically and effectively to achieve the desired outcome.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Understanding the Economic, Legal, and Social Issues Surrounding the Use of Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy also encompasses an understanding of the broader context in which information is created and used. This includes awareness of the economic, legal, and social issues surrounding information, such as intellectual property rights, copyright, data privacy, and freedom of information. It requires individuals to understand the ethical implications of information use and to act responsibly in their information-related behaviors. This component also includes understanding the impact of information on society and the role of information in promoting social justice and equity. For example, a citizen advocating for open access to government data must understand the legal framework governing access to information and the potential impact of data transparency on public policy. This broader understanding of information issues is essential for responsible and ethical information behavior.
                </p>
              </div>
            </div>

            {/* ========== SECTION 3: BENEFITS TO INFORMATION SCIENCE ========== */}
            <div
              ref={(el) => { sectionRefs.current['benefits'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Information Literacy to Information Science
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Enhancing User-Centered Information System Design
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy principles are fundamental to designing information systems that are intuitive and effective for users. By understanding how individuals seek, evaluate, and utilize information, information science professionals can create interfaces and functionalities that align with user needs and behaviors. This includes designing search algorithms that prioritize relevant results, developing metadata schemas that facilitate efficient information retrieval, and creating user interfaces that are accessible to diverse populations. Information literacy insights help in understanding that information seeking is not just about retrieving data, but about understanding the user's cognitive processes and information needs. For example, by conducting user studies that incorporate information literacy assessments, designers can identify common search challenges and develop solutions that improve user satisfaction and efficiency. This user-centered approach ensures that information systems are not just technologically advanced, but also practically useful.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Improving Information Retrieval and Resource Discovery
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy plays a crucial role in enhancing information retrieval and resource discovery. Information science professionals equipped with a deep understanding of information literacy can develop and implement effective search strategies, indexing techniques, and classification systems. This includes the ability to identify relevant keywords, understand the structure and organization of information resources, and evaluate the credibility of sources. By promoting information literacy among users, information science professionals can empower individuals to become more effective at navigating complex information landscapes. This directly translates to improved utilization of digital libraries, online databases, and archival collections. For instance, librarians can teach users how to utilize advanced search operators, refine search queries, and evaluate the reliability of information found online, thus improving the overall effectiveness of information access.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Promoting Ethical Information Practices and Policy Development
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy fosters ethical information practices, which are essential in the digital age. Information science professionals can leverage their knowledge of information literacy to educate users about issues such as copyright, plagiarism, data privacy, and intellectual property rights. They can also contribute to the development of policies and guidelines that promote responsible information behavior. This involves advocating for open access to information, protecting user privacy, and ensuring equitable access to information resources. For example, information science professionals can develop workshops and training programs that educate users about the ethical implications of using social media, accessing online databases, and sharing information. By promoting ethical information practices, information science professionals can help to create a more responsible and trustworthy information environment.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Microscope size={16} /> Supporting Evidence-Based Research and Practice
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy is indispensable for conducting evidence-based research and practice in information science. Researchers and practitioners need to be able to locate, evaluate, and synthesize information effectively to inform their work. Information science professionals can contribute to the advancement of the field by conducting research on information literacy, developing evidence-based practices, and disseminating research findings. This ensures that information science practices are grounded in empirical evidence and that they are continually improving. For instance, researchers can conduct studies on the effectiveness of information literacy interventions, the impact of technology on information behavior, and the development of new information retrieval techniques. This evidence-based approach enhances the credibility and impact of information science research.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> Facilitating Lifelong Learning and Knowledge Creation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literacy is a foundational skill for lifelong learning and knowledge creation. In an era marked by rapid technological advancements and information overload, individuals need to be able to adapt to changing information environments and to continuously learn and grow. Information science professionals can play a crucial role in promoting lifelong learning by providing access to information resources, developing information literacy programs, and fostering a culture of inquiry. They can also contribute to the creation of new knowledge by facilitating collaboration and information sharing among researchers and practitioners. For example, libraries can offer workshops on digital literacy skills, provide access to online learning resources, and create spaces for collaborative learning and knowledge creation. By promoting lifelong learning, information science professionals can empower individuals to become active participants in the knowledge society.
                </p>
              </div>
            </div>

            {/* ========== SECTION 4: DIFFERENCES IL vs CL ========== */}
            <div
              ref={(el) => { sectionRefs.current['differences'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Differences Between Information Literacy and Computer Literacy
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Focus on Content vs. Tool
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Computer literacy primarily centers on the technical proficiency required to operate computers and utilize software applications. It's about understanding the "how" of using technology—knowing how to navigate operating systems, utilize word processing programs, manage files, and troubleshoot basic hardware or software issues. In essence, it's about mastering the tool. Information literacy, conversely, focuses on the "what" and "why" of information use. It's concerned with the ability to identify information needs, locate, evaluate, and effectively use information regardless of the medium. While computer literacy might be a prerequisite for accessing digital information, it doesn't guarantee the ability to critically assess that information's validity. Information literacy delves into the content itself, emphasizing the cognitive skills needed to discern quality and relevance. For example, someone might be highly computer literate, able to expertly use various software programs and online platforms, but lack the information literacy skills to differentiate between credible and unreliable sources when researching a topic online. Computer literacy is about the tools, information literacy is about the material those tools access.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Brain size={16} /> Emphasis on Technical Skills vs. Critical Thinking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Computer literacy heavily emphasizes technical skills, such as the ability to use specific software, hardware, and online platforms. It's about knowing how to operate the technology efficiently. This might include skills like data entry, software installation, network navigation, and basic programming. Information literacy, on the other hand, places a greater emphasis on critical thinking and evaluative skills. It's about the ability to analyze information, understand its context, and assess its reliability. This includes skills such as evaluating source credibility, identifying bias, synthesizing information from multiple sources, and applying information to solve problems. While computer literacy might enable someone to find information online, information literacy enables them to determine whether that information is trustworthy and relevant. For instance, a person with strong computer literacy skills could easily set up and use a database, but a person with strong information literacy skills would know how to design effective search queries and determine the quality of the information retrieved from that database. Critical thinking is at the heart of information literacy, and technical skills are at the heart of computer literacy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Scope of Application
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The scope of application for computer literacy is primarily related to the use of technology. It's about being able to utilize computers and software to accomplish specific tasks. This might include using computers for communication, entertainment, or work-related tasks. Information literacy, however, has a much broader scope of application. It's about being able to effectively use information in any context, regardless of the technology involved. This might include using information for research, education, decision-making, or personal development. Information literacy skills are applicable in any situation where information is needed, whether it involves using a computer or not. For example, understanding how to read and interpret a historical document in an archive requires information literacy skills, even if no computers are involved. Computer literacy is a tool to be used, information literacy is a skill to be deployed in a wide variety of circumstances.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <RefreshCw size={16} /> Focus on Processes vs. Content
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Computer literacy is more concerned with the processes involved in using technology. It's about understanding how computers and software work and how to use them effectively. Information literacy, on the other hand, is more concerned with the content of information and its meaning. It's about understanding how information is created, organized, and disseminated, and how to use it ethically and responsibly. While computer literacy might enable someone to use a database to find information, information literacy enables them to understand the implications of using that information and to evaluate its credibility. For example, knowing how to use a citation management tool is computer literacy, while understanding the ethical implications of plagiarism and the importance of accurate citation is information literacy. Computer literacy is focused on the actions, information literacy is focused on the results of those actions.
                </p>
              </div>
            </div>

            {/* ========== SECTION 5: CHARACTERISTICS OF AN IL INDIVIDUAL ========== */}
            <div
              ref={(el) => { sectionRefs.current['characteristics'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of an Information Literate Individual
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Recognizes the Need for Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An information literate individual possesses a keen awareness of when information is required to solve problems, make decisions, or expand their knowledge. They understand that information is not just readily available but must be actively sought and critically evaluated. This recognition stems from a deep understanding of their own knowledge gaps and the ability to articulate specific information needs. They can formulate focused questions that guide their search, understanding the scope and nature of the information required. This capacity to identify information needs is fundamental, as it sets the stage for effective information seeking. They don't simply stumble upon information; they actively and purposefully seek it out, knowing that informed decisions and robust understanding are built upon a solid foundation of relevant and reliable data. This recognition is the first step in the information seeking process.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Accesses Needed Information Effectively and Efficiently
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literate individuals are proficient in navigating the complex landscape of information resources. They possess the skills to locate and retrieve relevant information from diverse sources, including libraries, databases, the internet, and specialized repositories. They understand the strengths and limitations of different information formats and can select the most appropriate tools and strategies for their specific needs. They are adept at using search engines, databases, and other information retrieval systems, employing advanced search techniques to refine their queries and retrieve precise results. They also understand the importance of evaluating the credibility and relevance of information sources, ensuring that they are using high-quality and trustworthy data. This efficiency extends beyond simply finding information; it includes the ability to organize and manage the retrieved data, ensuring that it is readily accessible and usable.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Critically Evaluates Information and Its Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A hallmark of an information literate individual is their ability to critically evaluate information and its sources. They do not accept information at face value but instead engage in a rigorous process of assessment. They consider the author's credentials, the source's purpose, potential biases, and the context in which the information is presented. They are skilled at distinguishing between fact and opinion, identifying misinformation and disinformation, and assessing the relevance and timeliness of information. They understand the importance of verifying information from multiple sources and are adept at recognizing logical fallacies and manipulative techniques. This critical evaluation is crucial in an age where information overload and misinformation are rampant, ensuring that they make informed decisions based on reliable and accurate data. They also understand that every information source has a point of view, and that this point of view must be considered when evaluating the data.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Edit size={16} /> Uses Information Effectively to Accomplish a Specific Purpose
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literate individuals are not just passive consumers of information; they are active creators and users of knowledge. They can synthesize information from diverse sources, organize it in a meaningful way, and apply it to solve problems, make decisions, or create new insights. They are skilled at communicating information effectively to others, using appropriate formats and technologies. They also understand the ethical and legal implications of information use, ensuring that they cite sources accurately and avoid plagiarism. They are able to take the raw materials of information and build something new with it. This includes the ability to create new documents, presentations, or even new research from the information that they have found.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Understands the Economic, Legal, and Social Issues Surrounding the Use of Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information literate individuals possess a broad understanding of the economic, legal, and social issues surrounding the use of information. They are aware of intellectual property rights, copyright, data privacy, and freedom of information. They understand the ethical implications of information use and act responsibly in their information-related behaviors. They are also aware of the impact of information on society and the role of information in promoting social justice and equity. This understanding allows them to navigate the complexities of the information landscape with awareness and responsibility, ensuring that they are using information ethically and contributing to a more informed and equitable society. They understand that information is not a neutral commodity, and that its use has real world consequences.
                </p>
              </div>
            </div>

            {/* ========== SECTION 6: ACRL STANDARDS ========== */}
            <div
              ref={(el) => { sectionRefs.current['acrl'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                ACRL Standards
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The Association of College and Research Libraries (ACRL) developed "Information Literacy Competency Standards for Higher Education." These standards outline the abilities of an information literate student or individual. Here are the five standards:
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Standard One
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information literate student determines the nature and extent of the information needed.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  This standard emphasizes the ability to recognize when information is needed and to define the scope of that information. It includes skills such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Defining and articulating the need for information.</li>
                  <li>Identifying and locating various types and formats of potential information sources.</li>
                  <li>Considering the costs and benefits of acquiring the needed information.</li>
                  <li>Reevaluating the nature and extent of the information need.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Standard Two
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information literate student accesses needed information effectively and efficiently.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  This standard focuses on the ability to find and retrieve information from a variety of sources. It includes skills such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Selecting the most effective and efficient means of accessing needed information.</li>
                  <li>Constructing and implementing effectively designed search strategies.</li>
                  <li>Retrieving information online or in person using a variety of methods.</li>
                  <li>Refining the search strategy as needed.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Standard Three
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information literate student evaluates information and its sources critically and incorporates selected information into his or her knowledge base and value system.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  This standard highlights the importance of critical thinking in evaluating information. It includes skills such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Examining and comparing information from various sources.</li>
                  <li>Determining the accuracy, authority, and currency of information.</li>
                  <li>Interpreting and synthesizing information.</li>
                  <li>Incorporating selected information into one's knowledge base.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Edit size={16} /> Standard Four
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information literate student, individually or as a member of a group, uses information effectively to accomplish a specific purpose.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  This standard emphasizes the ability to apply information to achieve a specific goal. It includes skills such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Applying new and prior information to the planning and creation of a particular product or performance.</li>
                  <li>Communicating the product or performance effectively to others.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Standard Five
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information literate student understands many of the economic, legal, and social issues surrounding the use of information and accesses and uses information ethically and legally.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  This standard focuses on the ethical and legal aspects of information use. It includes skills such as:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Understanding the ethical, legal, and socio-economic issues surrounding information and information technology.</li>
                  <li>Following laws, regulations, institutional policies, and etiquette related to the access and use of information resources.</li>
                  <li>Acknowledging the use of information sources in communicating the product or performance.</li>
                </ul>
              </div>
            </div>

            {/* ========== SECTION 7: PIVOTAL ROLE ========== */}
            <div
              ref={(el) => { sectionRefs.current['pivotal-role'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Pivotal Role of Information in an Information Society
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <TrendingUp size={16} /> Driving Economic Growth and Innovation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In an information society, information is no longer merely a byproduct of activity; it is a fundamental driver of economic growth and innovation. The ability to generate, process, and disseminate information efficiently has become a key competitive advantage for businesses, organizations, and nations. Information-driven industries, such as software development, data analytics, and digital media, are at the forefront of economic expansion. Information fuels innovation by providing the raw material for research, development, and the creation of new products and services. The rapid flow of information facilitates collaboration, knowledge sharing, and the efficient allocation of resources. For example, in the realm of e-commerce, real-time data analysis allows businesses to understand consumer behavior, optimize supply chains, and personalize marketing strategies. This reliance on information creates a dynamic and interconnected economy where knowledge is a valuable asset.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Empowering Individuals and Fostering Democratic Participation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information plays a crucial role in empowering individuals and fostering democratic participation in an information society. Access to accurate and reliable information enables citizens to make informed decisions about their lives, their communities, and their governments. The internet and social media platforms have democratized access to information, allowing individuals to access diverse perspectives and engage in public discourse. Information literacy skills become paramount, enabling individuals to critically evaluate information, identify misinformation, and participate meaningfully in civic life. For instance, online platforms provide citizens with access to government data, policy documents, and public forums, enabling them to hold their elected officials accountable. This increased access to information strengthens democratic institutions and promotes transparency and accountability. However, it also requires that individuals are able to correctly assess the data that they are presented with.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> Transforming Education and Knowledge Creation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information society has profoundly transformed education and knowledge creation. Information technologies have expanded access to educational resources, enabling lifelong learning and personalized education. Online learning platforms, digital libraries, and open educational resources provide learners with access to a vast array of information and educational materials. Information technologies also facilitate collaboration and knowledge sharing among students and educators. Research and development are accelerated by the rapid dissemination of scientific findings and scholarly publications. Data analytics and artificial intelligence are used to personalize learning experiences and to identify new patterns and insights in educational data. This transformation of education and knowledge creation is essential for preparing individuals for the demands of the information age and for driving innovation and progress.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Share2 size={16} /> Shaping Social Interactions and Cultural Exchange
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information technologies have fundamentally altered the way people communicate, interact, and engage with each other. Social media platforms, messaging apps, and online communities have created new spaces for social interaction and cultural exchange. Information flows across geographical boundaries, connecting people from diverse backgrounds and cultures. This interconnectedness has the potential to foster understanding, empathy, and collaboration. However, it also presents challenges, such as the spread of misinformation, the erosion of privacy, and the potential for social fragmentation. The information society necessitates a critical understanding of the social and cultural implications of information technologies and a commitment to promoting responsible and ethical information behavior.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Microscope size={16} /> Driving Scientific Advancements and Technological Innovation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information is the lifeblood of scientific advancement and technological innovation. In an information society, data-driven research and development are essential for progress in fields such as medicine, engineering, and environmental science. Big data analytics, artificial intelligence, and machine learning are used to analyze vast datasets, identify patterns, and generate new insights. Scientific collaboration and knowledge sharing are facilitated by online platforms and digital repositories. Information technologies accelerate the pace of scientific discovery and technological innovation, driving progress and improving the quality of life. This includes things such as the sharing of genomic data to improve medical treatments, and the use of large data sets to improve climate models.
                </p>
              </div>
            </div>

            {/* ========== SECTION 8: CHARACTERISTICS OF INFORMATION/KNOWLEDGE SOCIETY ========== */}
            <div
              ref={(el) => { sectionRefs.current['knowledge-society'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of an Information/Knowledge Society
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Cloud size={16} /> Ubiquitous Information and Communication Technologies (ICT)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A defining characteristic of an information/knowledge society is the pervasive presence of ICT. This includes widespread access to the internet, mobile devices, and digital platforms. These technologies serve as the primary conduits for information creation, dissemination, and consumption. The infrastructure supports a constant flow of data, enabling real-time communication and access to information resources from virtually anywhere. This ubiquity transforms social interactions, economic activities, and educational practices. For example, remote work, online learning, and e-commerce become commonplace, facilitated by reliable internet connectivity and digital tools. The seamless integration of ICT into daily life fundamentally alters how individuals interact with information and with each other. This includes the ability to access government services through online portals, and the ability to access educational resources through online classes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Emphasis on Knowledge Creation and Innovation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In a knowledge society, the focus shifts from the production of physical goods to the creation and dissemination of knowledge. Innovation becomes a key driver of economic growth and social progress. This includes investment in research and development, education, and training to foster a skilled workforce capable of generating and applying new knowledge. Knowledge is viewed as a strategic asset, and organizations prioritize knowledge management and intellectual property protection. For instance, universities and research institutions play a central role in generating new knowledge, while businesses invest in innovation to maintain a competitive edge. The emphasis on knowledge creation fosters a culture of continuous learning and adaptation, enabling societies to respond effectively to rapid technological and social changes. This emphasis on knowledge is what separates a knowledge society from an industrial one.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Information as a Strategic Resource
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information is recognized as a critical resource, akin to traditional resources like land, labor, and capital. Organizations and individuals understand the value of information and actively seek to acquire, manage, and utilize it effectively. Data analytics, information management systems, and knowledge repositories become essential tools for decision-making and strategic planning. Information literacy skills are highly valued, enabling individuals to navigate the complex information landscape and to critically evaluate information sources. For example, businesses use market research data to understand consumer behavior, while governments use statistical data to inform policy decisions. This strategic use of information drives efficiency, productivity, and innovation across all sectors of society.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Networked Society and Global Connectivity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An information/knowledge society is characterized by its interconnectedness and global reach. Networks, both physical and virtual, facilitate the rapid flow of information and ideas across geographical boundaries. Social media platforms, online communities, and collaborative tools enable individuals to connect and collaborate with others around the world. This global connectivity fosters cultural exchange, knowledge sharing, and the development of international collaborations. However, it also presents challenges, such as the spread of misinformation, the erosion of privacy, and the potential for digital divides. For example, international research collaborations are made possible through online platforms, while social movements leverage social media to mobilize support and raise awareness. This interconnectedness is a key element of the modern world.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <RefreshCw size={16} /> Emphasis on Lifelong Learning and Adaptability
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In a rapidly changing information/knowledge society, lifelong learning becomes essential for individuals to remain relevant and competitive. The pace of technological advancement and the constant influx of new information necessitate continuous learning and adaptation. Education systems are transformed to emphasize critical thinking, problem-solving, and information literacy skills. Online learning platforms, digital resources, and flexible learning pathways provide individuals with opportunities to acquire new knowledge and skills throughout their lives. For example, professionals engage in online courses and workshops to update their skills, while individuals pursue personal interests through online learning communities. This emphasis on lifelong learning promotes a culture of continuous improvement and empowers individuals to navigate the complexities of the information age.
                </p>
              </div>
            </div>

            {/* ========== SECTION 9: BENEFITS OF INFORMATION IN AN INFORMATION SOCIETY ========== */}
            <div
              ref={(el) => { sectionRefs.current['benefits-society'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Information in an Information Society
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Enhanced Decision-Making and Problem-Solving
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In an information society, access to timely and accurate information significantly enhances decision-making processes at all levels, from individual choices to complex organizational strategies. Individuals can leverage a wealth of data to make informed decisions about their health, finances, and personal lives. Businesses can utilize market research, analytics, and customer feedback to refine their products, optimize operations, and anticipate market trends. Governments can employ data-driven policies to address societal challenges, allocate resources effectively, and improve public services. The ability to access and analyze vast amounts of information empowers individuals and organizations to identify patterns, evaluate options, and make well-informed choices. This includes the ability to use information to anticipate potential problems, and to develop contingency plans. The speed at which information can be accessed allows for rapid responses to quickly developing situations.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Zap size={16} /> Increased Efficiency and Productivity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information technologies and the efficient flow of information contribute to increased efficiency and productivity across various sectors. Automation, data analytics, and digital communication tools streamline processes, reduce manual labor, and minimize errors. Businesses can optimize their supply chains, manage inventory effectively, and improve customer service through real-time data analysis and communication. Professionals can access research databases, collaborate remotely, and automate routine tasks, freeing up time for more strategic and creative endeavors. In education, online learning platforms and digital resources enhance learning outcomes and facilitate personalized instruction. In public services, digital portals and online transactions reduce paperwork and improve service delivery. This increase in efficiency and productivity allows for more to be accomplished with less resources.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Fostering Innovation and Creativity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information is a catalyst for innovation and creativity in an information society. Access to diverse sources of knowledge, data, and perspectives fuels the development of new ideas, products, and services. Online platforms, collaborative tools, and open-source resources enable individuals and organizations to share knowledge, collaborate on projects, and build upon existing innovations. Data analytics and artificial intelligence are used to identify patterns, generate insights, and develop new solutions to complex problems. For example, researchers can access vast datasets to accelerate scientific discovery, while entrepreneurs can leverage online platforms to develop and market innovative products. This dynamic environment encourages experimentation, risk-taking, and the continuous pursuit of new knowledge.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Promoting Social Inclusion and Equity
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information has the potential to promote social inclusion and equity by providing access to knowledge, resources, and opportunities for all members of society. Digital literacy programs, online education, and public access to information technologies can bridge the digital divide and empower marginalized communities. Access to information can enable individuals to participate in civic life, exercise their rights, and access essential services. For instance, online platforms can provide access to government information, legal resources, and community support networks. Information can also be used to raise awareness about social issues, advocate for change, and promote social justice. However, it's crucial to acknowledge that equitable access to information is not guaranteed and requires deliberate efforts to address disparities in digital literacy, infrastructure, and access.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Facilitating Global Connectivity and Collaboration
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The information society has fostered unprecedented global connectivity and collaboration. The internet and digital communication tools enable individuals and organizations to connect with others across geographical boundaries, collaborate on projects, and share knowledge. Online platforms facilitate international research collaborations, cultural exchange, and the dissemination of information across diverse audiences. This global interconnectedness promotes understanding, empathy, and cooperation, addressing global challenges, and building a more interconnected world. However, this global connectivity also presents challenges, such as the spread of misinformation and the need to address digital security.
                </p>
              </div>
            </div>

            {/* ========== SECTION 10: FUTURE IMPLICATIONS ========== */}
            <div
              ref={(el) => { sectionRefs.current['future-implications'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Future Implications of Information in an Information Literate Society
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <User size={16} /> The Rise of Personalized Information Ecosystems
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In a future information literate society, we can anticipate the proliferation of highly personalized information ecosystems. Artificial intelligence and machine learning will play a crucial role in curating and delivering information tailored to individual needs, preferences, and learning styles. These systems will go beyond simple search algorithms, proactively anticipating information needs and delivering relevant content in real-time. This personalization will extend to educational platforms, professional development tools, and even personal information management systems. However, this raises critical questions about filter bubbles and the potential for echo chambers, where individuals are only exposed to information that confirms their existing beliefs. Information literacy will be essential in navigating these personalized ecosystems, enabling individuals to critically evaluate the information presented and to seek out diverse perspectives. The ability to discern the algorithms driving these systems and to understand their potential biases will become a key component of information literacy.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Eye size={16} /> Augmented Reality and Immersive Information Experiences
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Augmented reality (AR) and virtual reality (VR) technologies will transform how we interact with information, creating immersive and interactive experiences. Information will no longer be confined to screens but will be integrated into our physical environment, providing context-aware and interactive data visualizations. Imagine learning about historical events by virtually walking through a reconstructed ancient city or exploring complex scientific concepts through interactive 3D simulations. These technologies will revolutionize education, training, and knowledge dissemination. However, they also raise concerns about the potential for information overload, the blurring of reality and virtuality, and the need for new forms of media literacy. Information literate individuals will need to develop the ability to critically evaluate and navigate these immersive information environments, understanding the potential for manipulation and misinformation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Link size={16} /> Decentralized Information Networks and Blockchain Technologies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Blockchain technologies and decentralized information networks will challenge traditional models of information ownership and control. These technologies enable the creation of secure, transparent, and distributed information systems, empowering individuals to control their own data and to participate in decentralized knowledge networks. This has the potential to democratize access to information, reduce censorship, and foster greater trust in information systems. However, it also raises concerns about the potential for misuse, the spread of misinformation, and the need for new forms of governance and regulation. Information literate individuals will need to understand the principles of decentralized information networks and blockchain technologies, enabling them to critically evaluate their potential benefits and risks. This includes the ability to understand the security and privacy implications of these technologies.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> The Integration of Information Literacy into Lifelong Learning and Professional Development
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In a rapidly evolving information landscape, information literacy will become an essential skill for lifelong learning and professional development. Individuals will need to continuously update their knowledge and skills to remain relevant in the workforce and to adapt to changing information environments. Educational institutions and professional organizations will play a crucial role in providing ongoing information literacy training and support. This will include the development of online learning platforms, micro-credentials, and personalized learning pathways. Information literacy will be integrated into all aspects of education and professional development, ensuring that individuals are equipped with the skills they need to navigate the information age effectively. This will include the ability to learn new software, and to understand new data formats.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Shield size={16} /> Ethical Considerations in the Age of Artificial Intelligence and Big Data
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The increasing use of artificial intelligence and big data raises significant ethical considerations that require careful attention. Issues such as algorithmic bias, data privacy, and the potential for surveillance necessitate a strong ethical framework for information use. Information literate individuals will need to be aware of these ethical considerations and to advocate for responsible and ethical information practices. This will include understanding the potential for AI to be used to manipulate information, and the ability to recognize such manipulation. They will also need to be able to critically evaluate the algorithms that are used to generate and disseminate information, and to hold developers and organizations accountable for their ethical implications. This ethical awareness will be crucial for ensuring that information is used in a manner that benefits society as a whole.
                </p>
              </div>
            </div>

            {/* ========== SECTION 11: GLOBALIZATION ========== */}
            <div
              ref={(el) => { sectionRefs.current['globalization'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Globalization of Information: Shaping the Modern World
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> The Interconnected Web of Data and Knowledge
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The globalization of information signifies the unprecedented flow of data, knowledge, and ideas across national boundaries, facilitated primarily by advancements in information and communication technologies (ICT). This phenomenon has transformed the world into a highly interconnected network, where information is no longer confined to local or national spheres. The internet, in particular, has played a pivotal role in this transformation, creating a global platform for information sharing and exchange. This interconnectedness has broken down traditional barriers to information access, allowing individuals and organizations to access a vast array of resources from anywhere in the world. This includes the ability to access scholarly articles from international journals, the ability to view news from around the world, and the ability to access government documents from foreign nations. This seamless flow of information has profound implications for various aspects of society, including economics, politics, culture, and education.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <DollarSign size={16} /> Economic Implications: A Global Marketplace of Ideas and Commerce
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The globalization of information has significantly impacted the global economy, creating a dynamic and interconnected marketplace of ideas and commerce. Businesses can now operate on a global scale, accessing markets, resources, and talent from around the world. E-commerce platforms facilitate international trade, enabling consumers to purchase goods and services from anywhere. Information technologies also support the globalization of financial markets, allowing for the rapid transfer of capital and investment. This globalization of commerce has also created a global marketplace of ideas, where knowledge and innovation can be shared and disseminated rapidly. However, the globalization of information also presents challenges, such as the digital divide, which can exacerbate existing inequalities and create new ones. Additionally, the rapid flow of information can lead to the spread of misinformation and the erosion of local cultures.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Political and Social Transformations: Democratization and Disruption
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The globalization of information has profound political and social implications. The internet and social media platforms have democratized access to information, empowering individuals to participate in public discourse and hold their governments accountable. Information technologies have also facilitated the rise of social movements and activism, enabling individuals to organize and mobilize across national boundaries. However, the globalization of information also presents challenges, such as the potential for government surveillance, the spread of propaganda, and the erosion of privacy. The rapid flow of information can also contribute to social fragmentation and the polarization of public opinion. Social media has created new ways for people to organize politically, but it has also created new ways for people to spread misinformation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Share2 size={16} /> Cultural Exchange and Homogenization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The globalization of information has accelerated cultural exchange, allowing for the rapid dissemination of cultural products, such as music, films, and literature. This has led to the emergence of a global culture, characterized by the blending of diverse cultural influences. However, the globalization of information also raises concerns about cultural homogenization, where dominant cultures may overshadow local cultures. This can lead to the erosion of cultural diversity and the loss of traditional knowledge. The challenge is to find a balance between promoting cultural exchange and preserving cultural diversity. This includes the ability of people to access media from other cultures, and the ability of people to share their own cultures with others.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> Educational Opportunities and Challenges
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The globalization of information has transformed education, creating new opportunities for learning and knowledge sharing. Online learning platforms, digital libraries, and open educational resources provide learners with access to a vast array of educational materials. International collaborations and exchange programs facilitate the sharing of knowledge and expertise across national boundaries. However, the globalization of information also presents challenges, such as the digital divide, which can limit access to educational opportunities for marginalized populations. The quality of online education and the need to ensure equitable access to digital resources are also critical considerations. This includes the ability of people to access educational resources from around the world, and the ability of people to collaborate with others on educational projects.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Information Insight
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
                  <span>ACRL Standards</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>IL Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Characteristics of IL</span>
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
                Information literacy is a set of abilities requiring individuals to recognize when information is needed and have the ability to locate, evaluate, and use effectively the needed information. It involves determining the extent of information needed, accessing it efficiently, evaluating it critically, using it effectively, and understanding the economic, legal, and social issues surrounding its use. The ACRL Standards provide a framework for these skills. In an information society, information drives economic growth, empowers individuals, transforms education, shapes social interactions, and fuels innovation. Globalization of information creates a connected world with both opportunities and challenges.
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
                <strong className="text-white">Information Literacy</strong> – The ability to recognize when information is needed and to locate, evaluate, and use it effectively. It encompasses five key components: determining need, accessing, evaluating, using, and understanding the legal/ethical context.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ACRL Standards</strong> – Five standards that define the information-literate student: determine the extent of information needed, access it effectively, evaluate critically, use it effectively, and understand the economic, legal, and social issues.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Information Society</strong> – Characterized by ubiquitous ICT, emphasis on knowledge creation, information as a strategic resource, global connectivity, and lifelong learning. Information drives economic growth, empowers citizens, transforms education, and shapes cultural exchange.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Globalization of Information</strong> – Creates an interconnected world where information flows freely across borders, fostering economic integration, political democratization, and cultural exchange, but also raising challenges like the digital divide and misinformation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Future Implications</strong> – Personalized information ecosystems, immersive AR/VR experiences, decentralized networks (blockchain), and the integration of IL into lifelong learning. Ethical considerations around AI and big data will become increasingly critical.
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
            Sidemann Academic Registry • Information Literacy &amp; Society Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;