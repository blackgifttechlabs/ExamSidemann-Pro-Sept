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
  { id: 'sources', label: 'Sources' },
  { id: 'formats', label: 'Formats' },
  { id: 'organization', label: 'Organization' },
  { id: 'reasons', label: 'Reasons to Organize' },
  { id: 'dissemination-1', label: 'Dissemination Tools' },
  { id: 'search-strategies', label: 'Search Strategies' },
  { id: 'research-tools', label: 'Research Tools' },
  { id: 'retrieval-systems', label: 'Retrieval Systems' },
  { id: 'retrieval-models', label: 'Retrieval Models' },
  { id: 'storage-retrieval', label: 'Storage & Retrieval' },
  { id: 'constraining', label: 'Constraining Factors' },
  { id: 'dissemination-2', label: 'Dissemination Tools 2' },
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
        text: 'The Boolean model is one of the oldest and most fundamental information retrieval models, using AND, OR, and NOT to refine searches.',
      },
      {
        title: 'Pro Tip',
        text: 'When searching, always start with a broad keyword search, then use Boolean operators and filters to narrow down results.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three source types as "PST": Primary, Secondary, Tertiary. Primary is firsthand, Secondary interprets, Tertiary summarizes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse information organization with information storage – organization is about structure, storage is about preservation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Boolean model is one of the oldest and most fundamental information retrieval models, using AND, OR, and NOT to refine searches.',
      },
      {
        title: 'Pro Tip',
        text: 'When searching, always start with a broad keyword search, then use Boolean operators and filters to narrow down results.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three source types as "PST": Primary, Secondary, Tertiary. Primary is firsthand, Secondary interprets, Tertiary summarizes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse information organization with information storage – organization is about structure, storage is about preservation.',
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
            <FileText size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Information Sources, Organization &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Retrieval Systems
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to primary, secondary, tertiary sources, information organization, dissemination tools, search strategies, and retrieval systems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Sources
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> Retrieval
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> Organization
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
                placeholder="Search for a concept, source type, or retrieval model..."
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
            {/* ========== SECTION 1: DEFINING SOURCES OF INFORMATION ========== */}
            <div
              ref={(el) => { sectionRefs.current['sources'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Defining Sources of Information
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <BookOpen size={16} /> Primary Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Primary sources are original, firsthand accounts or evidence of an event, period, or idea. They are created by individuals who directly participated in or witnessed the events being described. These sources offer direct, unfiltered insights and are considered the most authoritative and reliable form of evidence. In academic research, primary sources are crucial for establishing historical accuracy and developing original interpretations. Examples of primary sources vary depending on the field of study. In history, they include diaries, letters, photographs, official documents, and artifacts. In the sciences, they consist of original research articles, lab notebooks, and raw data. In literature, they are the original works of an author, such as novels, poems, and plays. Primary sources provide researchers with the raw material necessary for analysis and interpretation, allowing them to draw their own conclusions based on direct evidence. They are essential for any research that aims to uncover new information or provide a fresh perspective on existing knowledge.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Secondary Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Secondary sources are interpretations, analyses, or evaluations of primary sources. They are created by individuals who did not directly participate in or witness the events being described but who have studied and analyzed primary sources to develop their own interpretations. Secondary sources offer a valuable perspective by providing context, synthesis, and analysis of primary source materials. They are crucial for understanding the broader historical, social, or intellectual context of a topic. Examples of secondary sources include textbooks, scholarly articles that analyze primary sources, biographies, and documentaries that interpret historical events. Secondary sources are often used to provide background information, to summarize existing knowledge, and to identify different perspectives on a topic. They allow researchers to build upon the work of others and to develop their own arguments based on a comprehensive understanding of the available evidence. While secondary sources are valuable, it is important to remember that they are interpretations and may reflect the biases or perspectives of the authors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Layers size={16} /> Tertiary Sources
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tertiary sources are compilations or summaries of primary and secondary sources. They provide a broad overview of a topic and are often used to provide quick access to information or to identify relevant primary and secondary sources. Tertiary sources are typically intended for general audiences and may not provide in-depth analysis or original research. Examples of tertiary sources include encyclopedias, dictionaries, bibliographies, and indexes. These sources are useful for gaining a basic understanding of a topic, for identifying key concepts and terms, and for locating relevant primary and secondary sources. However, because they are summaries, they often lack the detail and nuance of primary and secondary sources. Tertiary sources are best used as a starting point for research, providing a foundation for further investigation into primary and secondary materials. They can also be very helpful in understanding the general shape of a field of study.
                </p>
              </div>
            </div>

            {/* ========== SECTION 2: DELINEATING FORMATS ========== */}
            <div
              ref={(el) => { sectionRefs.current['formats'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Delineating Formats of Information and Information Access Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <FileText size={16} /> Formats of Information: Diverse Carriers of Knowledge
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information formats refer to the physical or digital forms in which information is stored and presented. These formats have evolved significantly over time, reflecting technological advancements and societal needs. Understanding the diverse formats of information is crucial for effective information retrieval and utilization. Traditional formats include print materials such as books, journals, newspapers, and manuscripts. These formats are characterized by their tangible nature and their reliance on physical storage. Digital formats, on the other hand, encompass a wide range of electronic media, including text documents, audio files, video recordings, images, and databases. Digital formats offer numerous advantages, such as ease of access, searchability, and portability. They also facilitate the creation and dissemination of multimedia content. The internet has further expanded the range of information formats, including websites, blogs, social media posts, and online videos. Each format has its own characteristics, strengths, and limitations, influencing how information is created, stored, and accessed. For example, a scientific research paper is typically formatted as a journal article, adhering to specific citation styles and peer-review processes. A news article, on the other hand, is formatted for broader consumption, often incorporating visuals and concise language. Understanding the format of information helps in assessing its reliability and relevance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Information Access Tools: Gateways to Knowledge
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information access tools are the mechanisms and technologies that enable individuals to locate, retrieve, and utilize information. These tools have become increasingly sophisticated, reflecting the growing volume and complexity of information. Traditional access tools include library catalogs, indexes, and bibliographies, which provide structured access to print materials. Digital access tools, such as search engines, online databases, and digital libraries, have revolutionized information retrieval, offering powerful search functionalities and access to vast digital collections. Search engines, like Google and Bing, utilize algorithms to index and rank web pages, providing users with relevant search results. Online databases, such as JSTOR and PubMed, offer access to scholarly articles and research data. Digital libraries, such as the Internet Archive and Project Gutenberg, provide access to digitized books and archival materials. Information access tools also include specialized software applications, such as citation management tools and data visualization tools, which help researchers and professionals organize and analyze information. The proliferation of mobile devices and apps has further expanded access to information, enabling individuals to access information on the go. Effective use of information access tools requires information literacy skills, such as the ability to formulate effective search queries, evaluate search results, and navigate different information platforms. These tools are constantly evolving, and thus, require constant learning to be used effectively.
                </p>
              </div>
            </div>

            {/* ========== SECTION 3: INFORMATION ORGANIZATION ========== */}
            <div
              ref={(el) => { sectionRefs.current['organization'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Organization
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information organization is a fundamental concept within information science, concerned with the systematic arrangement of information to facilitate its retrieval and use. It encompasses a range of activities and processes aimed at creating order and structure within collections of data, information, and knowledge.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Purpose
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The primary goal of information organization is to make information accessible and usable. This involves arranging information in a way that allows users to easily find what they are looking for, whether they are searching for a specific item or browsing for related information.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Activities
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Classification: Grouping information based on shared characteristics.</li>
                  <li>Indexing: Assigning keywords or descriptors to information items to facilitate searching.</li>
                  <li>Cataloging: Creating descriptive records for information resources.</li>
                  <li>Metadata Creation: Developing structured data that describes information resources.</li>
                  <li>Taxonomy and Ontology Development: Creating hierarchical structures and relationships between concepts.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Award size={16} /> Importance
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Libraries and Archives: Organizing collections of books, documents, and other materials.</li>
                  <li>Databases: Structuring data for efficient retrieval.</li>
                  <li>Websites and Online Information Systems: Designing information architectures that facilitate navigation and search.</li>
                  <li>Knowledge Management: Organizing and sharing knowledge within organizations.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Link size={16} /> Key Concepts
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Knowledge Organization: Which sometimes is used synonymously, but can also be seen as a more abstract concept dealing with the organization of knowledge itself.</li>
                  <li>Information Architecture: The structural design of information spaces.</li>
                  <li>Metadata: Data about data.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  In essence, information organization is about creating systems that allow us to make sense of the vast amounts of information that surround us.
                </p>
              </div>
            </div>

            {/* ========== SECTION 4: REASONS FOR ORGANIZING ========== */}
            <div
              ref={(el) => { sectionRefs.current['reasons'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reasons for Organizing Information: Enhancing Access, Usability, and Knowledge Discovery
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Facilitating Efficient Retrieval and Access
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A primary reason for organizing information is to enable efficient retrieval and access. Without structure, information becomes a chaotic jumble, making it nearly impossible to locate specific items or relevant resources. Organization transforms this chaos into a navigable landscape, allowing users to quickly find the information they need. Whether it's a library catalog, a digital database, or a corporate knowledge base, organization provides a roadmap for users to explore and navigate the information space. This efficiency is particularly crucial in today's information-rich environment, where time is a precious commodity. Well-organized information systems reduce the time spent searching, allowing users to focus on utilizing the information itself. For example, a library organized by subject and author allows patrons to easily find books on a specific topic or by a particular author. Similarly, a well-structured online database enables researchers to quickly retrieve relevant articles and data. This streamlined access not only saves time but also enhances productivity and overall user satisfaction.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Eye size={16} /> Enhancing Usability and Comprehension
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organized information is inherently more usable and comprehensible. Structure and categorization provide context and meaning, making it easier for users to understand the relationships between different pieces of information. Well-organized information systems present information in a logical and intuitive manner, reducing cognitive load and improving user experience. This is especially important when dealing with complex or large volumes of information. For instance, a website with a clear information architecture and navigation system allows users to easily find the information they need, without getting lost or overwhelmed. Similarly, a well-structured report with clear headings and subheadings makes it easier for readers to understand the key findings and conclusions. This enhanced usability translates into better comprehension, allowing users to extract meaningful insights from the information. A well organized collection of data is much easier to understand than a disorganized one.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Supporting Knowledge Discovery and Innovation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organized information is not just about finding existing information; it's also about facilitating the discovery of new knowledge and fostering innovation. When information is organized in a meaningful way, it reveals patterns, connections, and relationships that might not be apparent otherwise. This allows researchers, analysts, and other knowledge workers to identify new insights, generate hypotheses, and develop innovative solutions. For example, a well-organized database of scientific research can reveal trends and patterns that lead to new discoveries. Similarly, a well-organized collection of archival documents can provide historians with new perspectives on past events. This ability to discover new knowledge is crucial for driving progress and innovation in various fields.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <CheckCircle size={16} /> Ensuring Data Integrity and Consistency
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information organization plays a vital role in ensuring data integrity and consistency. By establishing clear standards and procedures for data entry, storage, and retrieval, organizations can minimize errors and maintain the accuracy and reliability of their information. This includes implementing metadata schemas, controlled vocabularies, and classification systems to ensure that data is consistently described and categorized. For instance, a well-maintained database with consistent data entry practices ensures that all records are accurate and up-to-date. Similarly, a well-organized file system prevents duplication and ensures that all users are accessing the same version of a document. This data integrity is crucial for making informed decisions and maintaining the trust of stakeholders.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Facilitating Collaboration and Knowledge Sharing
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organized information promotes collaboration and knowledge sharing among individuals and teams. When information is easily accessible and well-structured, it becomes easier for people to share their knowledge and collaborate on projects. This is particularly important in organizations where knowledge is distributed across different departments and teams. Well-organized knowledge management systems, document repositories, and collaborative platforms enable employees to share their expertise, access relevant information, and work together effectively. For example, a shared document repository with clear folder structures and naming conventions allows team members to easily find and collaborate on documents. Similarly, a well-organized intranet with a comprehensive knowledge base enables employees to access company policies, procedures, and best practices. This collaboration and knowledge sharing drives innovation and improves overall organizational performance.
                </p>
              </div>
            </div>

            {/* ========== SECTION 5: INFORMATION DISSEMINATION TOOLS (First) ========== */}
            <div
              ref={(el) => { sectionRefs.current['dissemination-1'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Dissemination Tools: Reaching Audiences in the Digital Age
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Share2 size={16} /> Social Media Platforms: Amplifying Reach and Engagement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Social media platforms have emerged as powerful tools for information dissemination, offering unparalleled reach and engagement opportunities. Platforms like Twitter, Facebook, Instagram, and LinkedIn enable individuals and organizations to share information with vast audiences in real-time. These platforms facilitate the rapid spread of news, updates, and multimedia content, allowing for immediate feedback and interaction. Social media's ability to target specific demographics and interests makes it a valuable tool for tailoring information to particular audiences. For example, a library might use Facebook to announce upcoming events, share book recommendations, and engage with patrons through interactive posts. A research institution could use Twitter to disseminate key findings from studies, participate in scholarly discussions, and connect with other researchers. However, the rapid and often unfiltered nature of social media also presents challenges, such as the spread of misinformation and the need for careful content moderation. Therefore, utilizing social media effectively requires a strategic approach, including consistent posting, audience engagement, and the use of analytics to track performance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Mail size={16} /> Email Marketing and Newsletters: Direct and Targeted Communication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Email marketing and newsletters remain effective tools for direct and targeted information dissemination. Email allows for personalized communication with specific individuals or groups, delivering tailored content directly to their inboxes. Newsletters, whether in print or digital format, provide a structured way to share regular updates, announcements, and curated content with subscribers. Email marketing is particularly useful for organizations that need to maintain consistent communication with their members, customers, or stakeholders. For instance, a professional association might use email newsletters to share industry news, announce upcoming conferences, and provide access to exclusive resources. Email's ability to track open rates and click-through rates allows for performance measurement and optimization. However, it is essential to adhere to email marketing best practices, such as obtaining consent from recipients and providing clear opt-out options, to avoid spam complaints and maintain a positive reputation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Websites and Blogs: Centralized Information Hubs
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Websites and blogs serve as centralized information hubs, providing a platform for organizations and individuals to share comprehensive information with a global audience. Websites offer a structured and organized way to present information, including text, images, videos, and downloadable resources. Blogs provide a dynamic and interactive platform for sharing articles, opinions, and updates. Websites are especially valuable for organizations that need to establish a strong online presence and provide detailed information about their products, services, or mission. Blogs are useful for sharing expertise, engaging in thought leadership, and building a community around a particular topic. For example, a university library might maintain a website with information about its services, resources, and events. A researcher might maintain a blog to share their research findings, discuss current trends, and engage with other researchers. However, maintaining a website or blog requires ongoing effort, including content creation, website maintenance, and search engine optimization (SEO) to ensure visibility.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Video size={16} /> Video Platforms and Podcasts: Engaging Multimedia Content
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Video platforms, such as YouTube and Vimeo, and podcast platforms, such as Spotify and Apple Podcasts, have become increasingly popular tools for information dissemination. These platforms enable individuals and organizations to share engaging multimedia content with a wide audience. Video and audio formats can be particularly effective for conveying complex information, demonstrating procedures, or sharing personal stories. Video platforms are useful for sharing tutorials, presentations, and interviews. Podcast platforms are useful for sharing audio content, such as lectures, discussions, and interviews. For example, a museum might use YouTube to share virtual tours of its exhibits. A researcher might use a podcast to discuss their research findings with a broader audience. However, creating high-quality video and audio content requires technical skills and resources. It is also essential to optimize content for search engines and to promote it through other channels to maximize reach.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Online Databases and Digital Repositories: Access to Scholarly and Research Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Online databases and digital repositories are essential tools for disseminating scholarly and research information. Databases, such as JSTOR and PubMed, provide access to peer-reviewed articles, research data, and other scholarly resources. Digital repositories, such as institutional repositories and subject repositories, provide access to open-access research outputs, such as preprints, postprints, and datasets. These platforms are crucial for researchers, academics, and students who need access to high-quality information. For example, a university library might subscribe to a range of online databases to provide access to its students and faculty. A research institution might maintain an institutional repository to share its research outputs with the world. However, accessing and utilizing these resources often requires specialized knowledge and skills. It is also important to consider issues related to copyright and intellectual property rights when sharing and accessing scholarly information.
                </p>
              </div>
            </div>

            {/* ========== SECTION 6: FORMULATING SEARCH STRATEGIES ========== */}
            <div
              ref={(el) => { sectionRefs.current['search-strategies'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Formulating Effective Search Strategies: Navigating the Information Landscape
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Target size={16} /> Defining Search and Search Strategies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A search, in the context of information retrieval, is the process of locating and retrieving information relevant to a specific query or need. This process can involve using various tools and resources, such as search engines, databases, library catalogs, and online archives. A search strategy, on the other hand, is a systematic and planned approach to conducting a search. It involves a set of techniques and tactics designed to maximize the effectiveness and efficiency of the search process. A well-formulated search strategy is essential for navigating the vast and complex information landscape, ensuring that relevant and reliable information is retrieved. It's not simply about typing keywords into a search bar; it's about understanding the nuances of information retrieval and applying a structured approach to find the best possible results. A good search strategy saves time, reduces frustration, and improves the quality of the information retrieved. This is especially true when dealing with complex research topics or when searching within specialized databases.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Describing Various Search Strategies
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Keyword Searching:</strong> Keyword searching is the most basic and widely used search strategy. It involves identifying relevant keywords and entering them into a search engine or database. Effective keyword searching requires careful consideration of the terms used, including synonyms, related terms, and alternative spellings. Researchers should strive to use specific and precise keywords to narrow their search results and avoid irrelevant information. For example, instead of searching for "climate," a researcher might search for "climate change impacts on coastal ecosystems." Keyword searching can be improved by using Boolean operators (AND, OR, NOT) to combine or exclude keywords, refining the search to more closely reflect the desired results.
                  </li>
                  <li>
                    <strong>Phrase Searching:</strong> Phrase searching involves entering a specific phrase or sequence of words into a search engine or database. This strategy is useful for finding information that contains an exact phrase or concept. Phrase searching is typically indicated by enclosing the phrase in quotation marks. For example, searching for "information literacy standards" will retrieve results that contain that exact phrase, rather than results that contain the individual words separately. This strategy is particularly useful when searching for proper nouns, titles, or specific terminology.
                  </li>
                  <li>
                    <strong>Boolean Searching:</strong> Boolean searching uses Boolean operators (AND, OR, NOT) to combine or exclude keywords, refining the search results. The "AND" operator narrows the search by requiring that all specified keywords appear in the results. The "OR" operator broadens the search by retrieving results that contain any of the specified keywords. The "NOT" operator excludes results that contain a specific keyword. For example, a search for "information literacy AND digital resources" will retrieve results that contain both terms, while a search for "information literacy NOT computer literacy" will exclude results that contain the term "computer literacy." Boolean searching is a powerful tool for controlling the scope and precision of search results.
                  </li>
                  <li>
                    <strong>Truncation and Wildcard Searching:</strong> Truncation and wildcard searching are techniques used to retrieve variations of a keyword. Truncation involves using a symbol, such as an asterisk (*), to represent any characters at the end of a word. For example, searching for "librar*" will retrieve results that contain "library," "libraries," "librarian," and "librarianship." Wildcard searching involves using a symbol, such as a question mark (?), to represent a single character within a word. For example, searching for "wom?n" will retrieve results that contain "woman" and "women." These techniques are useful for retrieving related terms and variations of a keyword.
                  </li>
                  <li>
                    <strong>Subject Heading Searching:</strong> Subject heading searching involves using controlled vocabulary or subject headings to search databases and library catalogs. Subject headings are standardized terms used to describe the content of information resources. This strategy is useful for retrieving comprehensive and relevant results, as it ensures that all resources on a particular topic are retrieved, regardless of the keywords used. For example, a library catalog might use the subject heading "Information literacy" to categorize resources on that topic. Subject heading searching is particularly useful in specialized databases and library catalogs that use controlled vocabularies.
                  </li>
                  <li>
                    <strong>Citation Searching:</strong> Citation searching involves using databases like Web of Science or Scopus to see who has cited a specific article. This is useful for finding newer research that builds upon older work. It can show how an idea has spread, and what research has come from a given paper.
                  </li>
                  <li>
                    <strong>Filtering and Faceting:</strong> Most modern search engines and databases allow for the filtering and faceting of results. This allows for narrowing results by publication date, author, publication type, and many other data points. This is very useful when dealing with a large amount of results.
                  </li>
                </ul>
              </div>
            </div>

            {/* ========== SECTION 7: USAGE OF RESEARCH TOOLS ========== */}
            <div
              ref={(el) => { sectionRefs.current['research-tools'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Usage of Research Tools to Conduct a Search: Navigating the Information Landscape
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Understanding the Diverse Landscape of Research Tools
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Conducting effective research necessitates the use of a variety of tools, each designed to address specific information needs. These tools range from general-purpose search engines to specialized databases and archival repositories. The choice of tool depends on the nature of the research question, the type of information sought, and the level of scholarly rigor required. General search engines, such as Google Scholar or Bing, provide broad access to a vast array of online resources, including websites, articles, and documents. However, they may not always provide access to peer-reviewed scholarly content or specialized databases. Specialized databases, such as JSTOR, PubMed, or Scopus, offer access to curated collections of scholarly articles, research data, and other academic resources. These databases often include advanced search functionalities, such as Boolean operators, subject headings, and citation indexing, enabling researchers to conduct precise and comprehensive searches. Archival repositories, such as digital archives and historical societies, provide access to primary source materials, such as manuscripts, photographs, and historical documents. Understanding the strengths and limitations of each type of research tool is crucial for conducting effective and efficient searches.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Search size={16} /> Leveraging Search Engines for Broad Information Retrieval
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  General search engines are invaluable tools for conducting broad information retrieval and exploring a wide range of topics. Google Scholar, in particular, is a powerful tool for finding scholarly literature, including articles, theses, and books. When using search engines, it is essential to employ effective search strategies, such as keyword searching, phrase searching, and Boolean operators, to refine search results and retrieve relevant information. Researchers should also be aware of the potential for bias and misinformation in search engine results and critically evaluate the credibility and reliability of sources. Advanced search features, such as filtering by publication date, author, or publication type, can further refine search results and improve the efficiency of information retrieval. Search engines are very useful for getting a general idea of a topic, or for finding information that is not behind a paywall.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Utilizing Specialized Databases for Scholarly Research
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Specialized databases are essential tools for conducting in-depth scholarly research. These databases provide access to curated collections of peer-reviewed articles, research data, and other academic resources. Researchers can use advanced search functionalities, such as Boolean operators, subject headings, and citation indexing, to conduct precise and comprehensive searches. Citation searching, which allows researchers to see who has cited a particular article, is especially useful for identifying related research and tracing the development of ideas. Subject heading searching, which uses controlled vocabulary terms, ensures that all relevant articles on a topic are retrieved, regardless of the keywords used. Filtering options, such as publication date, author, or journal title, can further refine search results and improve the efficiency of information retrieval. Many of these databases also have tools to help the researcher organize the data that they find.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Archive size={16} /> Exploring Archival Repositories for Primary Source Materials
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Archival repositories are invaluable resources for researchers who need access to primary source materials. These repositories provide access to historical documents, manuscripts, photographs, and other original sources that offer firsthand accounts of past events. Researchers can use online catalogs and digital collections to search for relevant materials and access digitized versions of archival documents. When working with primary sources, it is essential to consider the context in which they were created and to critically evaluate their authenticity and reliability. Archival research often requires specialized skills and knowledge, such as the ability to decipher handwriting, interpret historical documents, and understand the historical context of the materials.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Bookmark size={16} /> Employing Citation Management Tools for Research Organization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Citation management tools, such as Zotero, Mendeley, and EndNote, are essential for organizing and managing research materials. These tools allow researchers to collect, organize, and annotate articles, books, and other sources. They also automate the process of creating citations and bibliographies, ensuring that sources are cited accurately and consistently. Citation management tools can be integrated with web browsers, word processors, and databases, streamlining the research process and improving the efficiency of information management. These tools are invaluable for researchers who need to manage large volumes of information and ensure the accuracy and consistency of their citations. They also allow for the easy sharing of research materials with collaborators.
                </p>
              </div>
            </div>

            {/* ========== SECTION 8: INFORMATION RETRIEVAL SYSTEMS ========== */}
            <div
              ref={(el) => { sectionRefs.current['retrieval-systems'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Retrieval Systems: Concepts, Types, and Models
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Information Retrieval Systems: Bridging the Gap Between Information and Users
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information retrieval (IR) systems are designed to bridge the gap between users and the vast amounts of information stored in digital repositories. These systems are crucial for enabling users to locate, access, and utilize relevant information to meet their specific needs. IR systems are not simply about retrieving documents; they are about understanding the user's information needs and providing them with the most relevant and useful information. This involves a complex interplay of indexing, searching, and ranking algorithms, as well as user interface design and interaction. Modern IR systems are found in a wide range of applications, from web search engines and digital libraries to enterprise search platforms and specialized databases. The effectiveness of an IR system is measured by its ability to retrieve relevant documents while minimizing irrelevant ones, a balance that is often referred to as precision and recall. The goal is to provide users with a seamless and efficient information retrieval experience.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Concepts in Information Storage and Retrieval: Indexing, Querying, and Ranking
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The core concepts in information storage and retrieval revolve around indexing, querying, and ranking. Indexing is the process of creating a searchable representation of the information stored in the system. This involves analyzing the content of documents, identifying key terms and concepts, and creating an index that maps these terms to the documents in which they appear. Indexing techniques range from simple keyword indexing to more sophisticated methods that incorporate natural language processing and semantic analysis. Querying is the process of formulating a search request to retrieve relevant information. Users can enter keywords, phrases, or even natural language questions to express their information needs. The IR system then processes the query, comparing it to the index to identify matching documents. Ranking is the process of ordering the retrieved documents based on their relevance to the query. This involves using ranking algorithms that assign scores to documents based on factors such as keyword frequency, document length, and link analysis. The ranked results are then presented to the user, with the most relevant documents appearing at the top of the list. These three concepts are the heart of how information retrieval systems operate.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Layers size={16} /> Types of Information Retrieval: From Boolean to Vector Space
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Boolean Retrieval:</strong> This is the oldest and simplest type of IR, using Boolean operators (AND, OR, NOT) to combine keywords and retrieve documents that match the query. Boolean retrieval is precise but can be rigid, often resulting in either too many or too few results.
                  </li>
                  <li>
                    <strong>Vector Space Model:</strong> This model represents documents and queries as vectors in a high-dimensional space, where each dimension corresponds to a term. Documents and queries are ranked based on their similarity, which is typically measured using cosine similarity. The vector space model is more flexible than Boolean retrieval and can handle complex queries.
                  </li>
                  <li>
                    <strong>Probabilistic Retrieval:</strong> This model uses probabilistic methods to estimate the relevance of documents to a query. It assigns probabilities to documents based on the likelihood that they will satisfy the user's information needs. Probabilistic retrieval is particularly useful for handling uncertainty and ambiguity in queries.
                  </li>
                  <li>
                    <strong>Semantic Retrieval:</strong> This type of retrieval focuses on understanding the meaning of queries and documents, rather than just matching keywords. It uses natural language processing and semantic analysis to identify the concepts and relationships expressed in the text. Semantic retrieval aims to improve the accuracy and relevance of search results by considering the context and meaning of the information.
                  </li>
                  <li>
                    <strong>Fuzzy Retrieval:</strong> This type of retrieval allows for results that are close to the search parameters, even if they are not exact matches. This is very useful for dealing with misspellings, or with data that is not perfectly consistent.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Settings size={16} /> Information Retrieval Models: Formalizing Retrieval Processes
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Boolean Model:</strong> This model is based on set theory and Boolean algebra. Documents and queries are represented as sets of terms, and retrieval is performed using Boolean operators.
                  </li>
                  <li>
                    <strong>Vector Space Model:</strong> This model represents documents and queries as vectors in a high-dimensional space. Documents and queries are ranked based on their similarity, which is typically measured using cosine similarity.
                  </li>
                  <li>
                    <strong>Probabilistic Models:</strong> These models use probabilistic methods to estimate the relevance of documents to a query. They include models such as the Binary Independence Model and the BM25 model.
                  </li>
                  <li>
                    <strong>Language Models:</strong> These models use statistical language modeling techniques to estimate the probability of a document generating a query. They are particularly effective for handling natural language queries.
                  </li>
                  <li>
                    <strong>Cognitive Models:</strong> These models focus on how users interact with information retrieval systems, and how they think about the data that they are searching. They focus on the human element of information retrieval.
                  </li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  These models provide a theoretical foundation for the development and evaluation of IR systems, guiding the design of indexing schemes, ranking algorithms, and user interfaces.
                </p>
              </div>
            </div>

            {/* ========== SECTION 9: INFORMATION RETRIEVAL MODELS AND SYSTEMS ========== */}
            <div
              ref={(el) => { sectionRefs.current['retrieval-models'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Retrieval Models and Systems: Theoretical Frameworks for Access
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Information retrieval (IR) models serve as the theoretical underpinnings for how information retrieval systems operate. They provide a formal representation of the retrieval process, defining the relationships between documents, queries, and relevance. These models are essential for designing and evaluating IR systems, as they offer a structured approach to understanding how information is accessed and retrieved. In records management, these models are critical for ensuring that records are accessible, discoverable, and usable over time.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <li>
                    <strong>Boolean Model:</strong> This model, based on set theory and Boolean logic, is fundamental. It uses operators like AND, OR, and NOT to refine search queries. While simple, it can be limiting in its ability to handle nuanced queries.
                  </li>
                  <li>
                    <strong>Vector Space Model:</strong> This model represents documents and queries as vectors in a multi-dimensional space, allowing for the calculation of similarity scores. This approach is more flexible than the Boolean model and can handle complex queries.
                  </li>
                  <li>
                    <strong>Probabilistic Models:</strong> These models use statistical techniques to estimate the probability of a document being relevant to a query. They are particularly useful for handling uncertainty and ambiguity in information retrieval.
                  </li>
                  <li>
                    <strong>Language Models:</strong> These models leverage statistical language processing to determine the likelihood that a document generated a given query.
                  </li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  In records management, these models guide the development of search functionalities within electronic document and records management systems (EDRMS), ensuring that records can be retrieved efficiently and accurately.
                </p>
              </div>
            </div>

            {/* ========== SECTION 10: INFORMATION STORAGE AND RETRIEVAL SYSTEMS ========== */}
            <div
              ref={(el) => { sectionRefs.current['storage-retrieval'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Storage and Retrieval Systems (ISRS): Subsystems, Characteristics, Elements, Components, and Functions
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An ISRS is a system designed to store, manage, and retrieve information. In records management, ISRSs are essential for managing the lifecycle of records, from creation to disposal.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Settings size={16} /> Subsystems
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An ISRS typically comprises several subsystems, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Indexing Subsystem: Creates and maintains the index of records.</li>
                  <li>Querying Subsystem: Processes user queries and retrieves relevant records.</li>
                  <li>Ranking Subsystem: Orders retrieved records based on relevance.</li>
                  <li>Storage Subsystem: Manages the physical or digital storage of records.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Characteristics
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Efficiency: Ability to retrieve relevant records quickly.</li>
                  <li>Effectiveness: Ability to retrieve accurate and complete records.</li>
                  <li>Scalability: Ability to handle increasing volumes of records.</li>
                  <li>Security: Ability to protect records from unauthorized access.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Elements
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Documents or Records: The information being stored and retrieved.</li>
                  <li>Index: The searchable representation of the records.</li>
                  <li>Query Language: The language used to formulate search queries.</li>
                  <li>Ranking Algorithm: The algorithm used to order retrieved records.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Server size={16} /> Components
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This can include hardware, software, user interface, and the data itself.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <RefreshCw size={16} /> Functions
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Storage: Storing records in a secure and organized manner.</li>
                  <li>Indexing: Creating and maintaining an index of records.</li>
                  <li>Retrieval: Retrieving relevant records based on user queries.</li>
                  <li>Ranking: Ordering retrieved records based on relevance.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  In records management, an effective ISRS ensures that records are readily available for legal, administrative, and historical purposes.
                </p>
              </div>
            </div>

            {/* ========== SECTION 11: FACTORS CONSTRAINING ========== */}
            <div
              ref={(el) => { sectionRefs.current['constraining'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Constraining Information Retrieval in Records Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Several factors can constrain information retrieval in records management, hindering the ability to access and utilize records effectively.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Data Volume and Complexity:</strong> The sheer volume of digital records, coupled with their diverse formats and structures, can make retrieval challenging.
                  </li>
                  <li>
                    <strong>Metadata Quality:</strong> Inaccurate or incomplete metadata can significantly impact retrieval accuracy.
                  </li>
                  <li>
                    <strong>Language and Terminology:</strong> Variations in language and terminology can lead to retrieval errors.
                  </li>
                  <li>
                    <strong>System Design:</strong> Poorly designed ISRSs can hinder retrieval efficiency and effectiveness.
                  </li>
                  <li>
                    <strong>User Skills:</strong> Lack of user training and information literacy skills can limit the ability to formulate effective search queries.
                  </li>
                  <li>
                    <strong>Security and Access Controls:</strong> Overly restrictive access controls can prevent authorized users from retrieving necessary records.
                  </li>
                  <li>
                    <strong>Preservation and Migration:</strong> The long-term preservation and migration of digital records can impact their accessibility and usability.
                  </li>
                  <li>
                    <strong>Legal and Regulatory Compliance:</strong> Records management must comply with legal and regulatory requirements, which can impose constraints on retrieval practices.
                  </li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  In records management, addressing these constraints is crucial for ensuring that records remain accessible and usable over time. This involves implementing robust metadata management practices, investing in user training, and designing ISRSs that are tailored to the specific needs of the organization.
                </p>
              </div>
            </div>

            {/* ========== SECTION 12: INFORMATION DISSEMINATION TOOLS (Second) ========== */}
            <div
              ref={(el) => { sectionRefs.current['dissemination-2'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Dissemination Tools: Reaching Audiences in the Digital Age (Revisited)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Share2 size={16} /> Social Media Platforms: Amplifying Reach and Engagement
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Social media platforms have emerged as powerful tools for information dissemination, offering unparalleled reach and engagement opportunities. Platforms like Twitter, Facebook, Instagram, and LinkedIn enable individuals and organizations to share information with vast audiences in real-time. These platforms facilitate the rapid spread of news, updates, and multimedia content, allowing for immediate feedback and interaction. Social media's ability to target specific demographics and interests makes it a valuable tool for tailoring information to particular audiences. For example, a library might use Facebook to announce upcoming events, share book recommendations, and engage with patrons through interactive posts. A research institution could use Twitter to disseminate key findings from studies, participate in scholarly discussions, and connect with other researchers. However, the rapid and often unfiltered nature of social media also presents challenges, such as the spread of misinformation and the need for careful content moderation. Therefore, utilizing social media effectively requires a strategic approach, including consistent posting, audience engagement, and the use of analytics to track performance.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Mail size={16} /> Email Marketing and Newsletters: Direct and Targeted Communication
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Email marketing and newsletters remain effective tools for direct and targeted information dissemination. Email allows for personalized communication with specific individuals or groups, delivering tailored content directly to their inboxes. Newsletters, whether in print or digital format, provide a structured way to share regular updates, announcements, and curated content with subscribers. Email marketing is particularly useful for organizations that need to maintain consistent communication with their members, customers, or stakeholders. For instance, a professional association might use email newsletters to share industry news, announce upcoming conferences, and provide access to exclusive resources. Email's ability to track open rates and click-through rates allows for performance measurement and optimization. However, it is essential to adhere to email marketing best practices, such as obtaining consent from recipients and providing clear opt-out options, to avoid spam complaints and maintain a positive reputation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Globe size={16} /> Websites and Blogs: Centralized Information Hubs
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Websites and blogs serve as centralized information hubs, providing a platform for organizations and individuals to share comprehensive information with a global audience. Websites offer a structured and organized way to present information, including text, images, videos, and downloadable resources. Blogs provide a dynamic and interactive platform for sharing articles, opinions, and updates. Websites are especially valuable for organizations that need to establish a strong online presence and provide detailed information about their products, services, or mission. Blogs are useful for sharing expertise, engaging in thought leadership, and building a community around a particular topic. For example, a university library might maintain a website with information about its services, resources, and events. A researcher might maintain a blog to share their research findings, discuss current trends, and engage with other researchers. However, maintaining a website or blog requires ongoing effort, including content creation, website maintenance, and search engine optimization (SEO) to ensure visibility.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Video size={16} /> Video Platforms and Podcasts: Engaging Multimedia Content
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Video platforms, such as YouTube and Vimeo, and podcast platforms, such as Spotify and Apple Podcasts, have become increasingly popular tools for information dissemination. These platforms enable individuals and organizations to share engaging multimedia content with a wide audience. Video and audio formats can be particularly effective for conveying complex information, demonstrating procedures, or sharing personal stories. Video platforms are useful for sharing tutorials, presentations, and interviews. Podcast platforms are useful for sharing audio content, such as lectures, discussions, and interviews. For example, a museum might use YouTube to share virtual tours of its exhibits. A researcher might use a podcast to discuss their research findings with a broader audience. However, creating high-quality video and audio content requires technical skills and resources. It is also essential to optimize content for search engines and to promote it through other channels to maximize reach.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Online Databases and Digital Repositories: Access to Scholarly and Research Information
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Online databases and digital repositories are essential tools for disseminating scholarly and research information. Databases, such as JSTOR and PubMed, provide access to peer-reviewed articles, research data, and other scholarly resources. Digital repositories, such as institutional repositories and subject repositories, provide access to open-access research outputs, such as preprints, postprints, and datasets. These platforms are crucial for researchers, academics, and students who need access to high-quality information. For example, a university library might subscribe to a range of online databases to provide access to its students and faculty. A research institution might maintain an institutional repository to share its research outputs with the world. However, accessing and utilizing these resources often requires specialized knowledge and skills. It is also important to consider issues related to copyright and intellectual property rights when sharing and accessing scholarly information.
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
                  <span>Source Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Search Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Retrieval Models</span>
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
                Information sources are categorized as primary (firsthand), secondary (interpretations), and tertiary (summaries). Information organization is essential for retrieval, usability, and knowledge discovery. Effective search strategies include keyword, phrase, Boolean, truncation, subject heading, citation, and filtering. Research tools range from general search engines to specialized databases and archival repositories. Information retrieval systems use models like Boolean, vector space, probabilistic, and language models to bridge the gap between users and information. Factors such as data volume, metadata quality, and user skills can constrain retrieval.
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
                <strong className="text-white">Sources of Information</strong> – Primary sources are firsthand evidence, secondary sources are interpretations, and tertiary sources are summaries or compilations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Information Organization</strong> – Essential for efficient retrieval, usability, knowledge discovery, data integrity, and collaboration. Activities include classification, indexing, and metadata creation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Search Strategies</strong> – Keyword, phrase, Boolean, truncation, subject heading, citation, and filtering/faceting are key techniques to refine and improve search results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Retrieval Systems &amp; Models</strong> – Boolean, vector space, probabilistic, language, and cognitive models underpin IR systems. Effective retrieval depends on indexing, querying, and ranking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Constraining Factors</strong> – Data volume, metadata quality, user skills, and system design can hinder retrieval. Addressing these is critical for records management.
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
            Sidemann Academic Registry • Information Sources, Organization &amp; Retrieval Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;