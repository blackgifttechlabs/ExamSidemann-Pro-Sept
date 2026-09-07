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
  Quote,
  Filter,
  Globe,
  Settings,
  Layers,
  Circle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION – auto‑generated from the content headings
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'search-strategies', label: 'Search Strategies' },
  { id: 'research-tools', label: 'Research Tools' },
  { id: 'ir-systems', label: 'IR Systems' },
  { id: 'ir-models', label: 'IR Models & ISRS' },
  { id: 'constraints', label: 'Constraints' },
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
        text: 'The Boolean model is one of the oldest and most fundamental information retrieval models, using AND, OR, and NOT to refine searches.',
      },
      {
        title: 'Pro Tip',
        text: 'When searching, always start with a broad keyword search, then use Boolean operators and filters to narrow down results.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the seven search strategies with "K-P-B-T-S-C-F": Keyword, Phrase, Boolean, Truncation, Subject heading, Citation, Filtering.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people assume that more search results are always better, but precision (relevance) is often more important than recall (quantity).',
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
        text: 'Remember the seven search strategies with "K-P-B-T-S-C-F": Keyword, Phrase, Boolean, Truncation, Subject heading, Citation, Filtering.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people assume that more search results are always better, but precision (relevance) is often more important than recall (quantity).',
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
            <FileText size={14} className="inline mr-1" /> RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Search Strategies &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Information Retrieval Systems
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to search strategies, research tools, information retrieval systems, models, and constraints in records management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> Strategies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Systems
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Models
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
                placeholder="Search for a strategy, tool, or model..."
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
            {/* ========== SECTION 1: FORMULATING EFFECTIVE SEARCH STRATEGIES ========== */}
            <div
              ref={(el) => { sectionRefs.current['search-strategies'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Formulating Effective Search Strategies
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
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Type size={16} /> Keyword Searching
                    </h4>
                    <p>Keyword searching is the most basic and widely used search strategy. It involves identifying relevant keywords and entering them into a search engine or database. Effective keyword searching requires careful consideration of the terms used, including synonyms, related terms, and alternative spellings. Researchers should strive to use specific and precise keywords to narrow their search results and avoid irrelevant information. For example, instead of searching for "climate," a researcher might search for "climate change impacts on coastal ecosystems." Keyword searching can be improved by using Boolean operators (AND, OR, NOT) to combine or exclude keywords, refining the search to more closely reflect the desired results.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Quote size={16} /> Phrase Searching
                    </h4>
                    <p>Phrase searching involves entering a specific phrase or sequence of words into a search engine or database. This strategy is useful for finding information that contains an exact phrase or concept. Phrase searching is typically indicated by enclosing the phrase in quotation marks. For example, searching for "information literacy standards" will retrieve results that contain that exact phrase, rather than results that contain the individual words separately. This strategy is particularly useful when searching for proper nouns, titles, or specific terminology.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Hash size={16} /> Boolean Searching
                    </h4>
                    <p>Boolean searching uses Boolean operators (AND, OR, NOT) to combine or exclude keywords, refining the search results. The "AND" operator narrows the search by requiring that all specified keywords appear in the results. The "OR" operator broadens the search by retrieving results that contain any of the specified keywords. The "NOT" operator excludes results that contain a specific keyword. For example, a search for "information literacy AND digital resources" will retrieve results that contain both terms, while a search for "information literacy NOT computer literacy" will exclude results that contain the term "computer literacy." Boolean searching is a powerful tool for controlling the scope and precision of search results.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <FileText size={16} /> Truncation and Wildcard Searching
                    </h4>
                    <p>Truncation and wildcard searching are techniques used to retrieve variations of a keyword. Truncation involves using a symbol, such as an asterisk (*), to represent any characters at the end of a word. For example, searching for "librar*" will retrieve results that contain "library," "libraries," "librarian," and "librarianship." Wildcard searching involves using a symbol, such as a question mark (?), to represent a single character within a word. For example, searching for "wom?n" will retrieve results that contain "woman" and "women." These techniques are useful for retrieving related terms and variations of a keyword.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <BookOpen size={16} /> Subject Heading Searching
                    </h4>
                    <p>Subject heading searching involves using controlled vocabulary or subject headings to search databases and library catalogs. Subject headings are standardized terms used to describe the content of information resources. This strategy is useful for retrieving comprehensive and relevant results, as it ensures that all resources on a particular topic are retrieved, regardless of the keywords used. For example, a library catalog might use the subject heading "Information literacy" to categorize resources on that topic. Subject heading searching is particularly useful in specialized databases and library catalogs that use controlled vocabularies.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Link size={16} /> Citation Searching
                    </h4>
                    <p>Citation searching involves using databases like Web of Science or Scopus to see who has cited a specific article. This is useful for finding newer research that builds upon older work. It can show how an idea has spread, and what research has come from a given paper.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Filter size={16} /> Filtering and Faceting
                    </h4>
                    <p>Most modern search engines and databases allow for the filtering and faceting of results. This allows for narrowing results by publication date, author, publication type, and many other data points. This is very useful when dealing with a large amount of results.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== SECTION 2: USAGE OF RESEARCH TOOLS ========== */}
            <div
              ref={(el) => { sectionRefs.current['research-tools'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Usage of Research Tools to Conduct a Search
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

            {/* ========== SECTION 3: INFORMATION RETRIEVAL SYSTEMS ========== */}
            <div
              ref={(el) => { sectionRefs.current['ir-systems'] = el; }}
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

            {/* ========== SECTION 4: INFORMATION RETRIEVAL MODELS AND SYSTEMS ========== */}
            <div
              ref={(el) => { sectionRefs.current['ir-models'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Retrieval Models and Systems
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Settings size={16} /> Information Retrieval Models: Theoretical Frameworks for Access
                </h3>
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

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Server size={16} /> Information Storage and Retrieval Systems (ISRS): Subsystems, Characteristics, Elements, Components, and Functions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  An ISRS is a system designed to store, manage, and retrieve information. In records management, ISRSs are essential for managing the lifecycle of records, from creation to disposal.
                </p>

                <div className="mt-3 space-y-3">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Settings size={14} /> Subsystems
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      An ISRS typically comprises several subsystems, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Indexing Subsystem:</strong> Creates and maintains the index of records.</li>
                      <li><strong>Querying Subsystem:</strong> Processes user queries and retrieves relevant records.</li>
                      <li><strong>Ranking Subsystem:</strong> Orders retrieved records based on relevance.</li>
                      <li><strong>Storage Subsystem:</strong> Manages the physical or digital storage of records.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <ListChecks size={14} /> Characteristics
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Efficiency:</strong> Ability to retrieve relevant records quickly.</li>
                      <li><strong>Effectiveness:</strong> Ability to retrieve accurate and complete records.</li>
                      <li><strong>Scalability:</strong> Ability to handle increasing volumes of records.</li>
                      <li><strong>Security:</strong> Ability to protect records from unauthorized access.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Database size={14} /> Elements
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Documents or Records:</strong> The information being stored and retrieved.</li>
                      <li><strong>Index:</strong> The searchable representation of the records.</li>
                      <li><strong>Query Language:</strong> The language used to formulate search queries.</li>
                      <li><strong>Ranking Algorithm:</strong> The algorithm used to order retrieved records.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <HardDrive size={14} /> Components
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This can include hardware, software, user interface, and the data itself.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <RefreshCw size={14} /> Functions
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Storage:</strong> Storing records in a secure and organized manner.</li>
                      <li><strong>Indexing:</strong> Creating and maintaining an index of records.</li>
                      <li><strong>Retrieval:</strong> Retrieving relevant records based on user queries.</li>
                      <li><strong>Ranking:</strong> Ordering retrieved records based on relevance.</li>
                    </ul>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                      In records management, an effective ISRS ensures that records are readily available for legal, administrative, and historical purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== SECTION 5: FACTORS CONSTRAINING INFORMATION RETRIEVAL ========== */}
            <div
              ref={(el) => { sectionRefs.current['constraints'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Constraining Information Retrieval in Records Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Several factors can constrain information retrieval in records management, hindering the ability to access and utilize records effectively.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
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
                  <span>Search Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Retrieval Models</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Research Tools</span>
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
                Effective search strategies include keyword, phrase, Boolean, truncation, subject heading, citation, and filtering/faceting. Research tools range from general search engines to specialized databases and archival repositories. Information retrieval systems are built on models like Boolean, vector space, probabilistic, and language models. Key constraints in records management include data volume, metadata quality, user skills, and system design. Addressing these is essential for accessible and usable records.
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
                <strong className="text-white">Search Strategies</strong> – Seven key strategies: keyword, phrase, Boolean, truncation, subject heading, citation, and filtering/faceting. Each serves a different purpose in refining search results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Research Tools</strong> – General search engines, specialized databases, archival repositories, and citation management tools each offer unique advantages for information retrieval.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IR Systems &amp; Models</strong> – Boolean, vector space, probabilistic, language, and cognitive models underpin retrieval. Systems rely on indexing, querying, and ranking to deliver relevant results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ISRS Components</strong> – Subsystems include indexing, querying, ranking, and storage. Characteristics like efficiency, effectiveness, scalability, and security are critical.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Constraining Factors</strong> – Data volume, metadata quality, user skills, system design, and legal/regulatory requirements can hinder retrieval. Addressing these is vital for effective records management.
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
            Sidemann Academic Registry • Search Strategies &amp; IR Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;