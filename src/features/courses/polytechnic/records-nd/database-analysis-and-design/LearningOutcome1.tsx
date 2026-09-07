import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // Icons from the original design (header, nav, sidebar)
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search as SearchIcon,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  // Additional icons used in the content (from the second file)
  FolderTree,
  Paperclip,
  Layout,
  Edit,
  ListChecks,
  Type,
  Book,
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
  Info,
  Tag,
  Table,
  ThumbsDown,
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
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'concepts', label: 'Key Concepts' },
  { id: 'history', label: 'History' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'comparison', label: 'Comparison' },
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

  // Random tip on mount (database‑related)
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first database management system (DBMS) was developed in the 1960s by Charles Bachman at General Electric.',
      },
      {
        title: 'Pro Tip',
        text: 'Always normalise your database to at least 3NF (Third Normal Form) to reduce redundancy and improve data integrity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ACID properties with "A-C-I-D": Atomicity, Consistency, Isolation, Durability – the foundation of reliable transactions.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse a database with a DBMS. The database is the actual data; the DBMS is the software that manages it.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first database management system (DBMS) was developed in the 1960s by Charles Bachman at General Electric.',
      },
      {
        title: 'Pro Tip',
        text: 'Always normalise your database to at least 3NF (Third Normal Form) to reduce redundancy and improve data integrity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember ACID properties with "A-C-I-D": Atomicity, Consistency, Isolation, Durability – the foundation of reliable transactions.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse a database with a DBMS. The database is the actual data; the DBMS is the software that manages it.',
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
        <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h4>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  // ─── Helper for numbered section title ──────────────────────────────────
  const SectionTitle = ({ number, children }: { number: string; children: React.ReactNode }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
      {number}. {children}
    </h2>
  );

  // ─── Helper for subsection title ────────────────────────────────────────
  const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">{children}</h3>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> DATABASES &amp; DBMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Databases, DBMS &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              File Systems
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to databases, DBMS, key concepts, history, characteristics, file systems vs databases, and challenges.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Databases
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> DBMS
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Folder size={14} className="inline mr-1" /> File Systems
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <SearchIcon className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, term, example..."
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
          {/* ─── Left Column: All Sections ────────────────────────────────── */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ==============================================================
                SECTION 1: WHAT IS A DATABASE?
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="1">What is a Database?</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you have a big notebook where you write down all important information. For example, if you are a class monitor, you might write down:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <li>All student names</li>
                    <li>Their ages</li>
                    <li>Their contact numbers</li>
                    <li>Maybe their grades for tests</li>
                  </ul>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    This notebook, if it's very well organized, is like a simple database.
                  </p>
</div>

              {renderCard(
                'Official Definition (Simple Version)',
                <Database size={16} />,
                <>
                  <p>A database is like a super organized electronic filing cabinet or a very neat collection of information stored on a computer.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Database yakafanana nekabhodhi kemafaira rakarongeka chaizvo riri pakombiyuta. Inzvimbo yatinochengetera mashoko akawanda akanyatsorongwa.]</p>
                  <p>This information is usually structured, meaning it's arranged in a neat way, like in lists or tables.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mashoko aya anenge akarongeka, kureva kuti akamira zvakanaka semalista kana matafura.]</p>
                </>
              )}

              {renderCard(
                'The Helper: Database Management System (DBMS)',
                <User size={16} />,
                <>
                  <p>Now, to use this electronic filing cabinet (the database), we need a special helper. This helper is a software program called a Database Management System (DBMS).</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuti tishandise kabhodhi aka kemafaira kepakombiyuta, tinoda mubatsiri. Mubatsiri uyu ipurogiramu yepakombiyuta inonzi Database Management System (DBMS).]</p>
                  <p>Think of the DBMS as the librarian for your digital filing cabinet. The DBMS helps you:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create new space for information. <span className="italic text-indigo-500 dark:text-indigo-300">[Kugadzira nzvimbo yemashoko matsva.]</span></li>
                    <li>Retrieve (find) information you need. <span className="italic text-indigo-500 dark:text-indigo-300">[Kutsvaga mashoko aunoda.]</span></li>
                    <li>Update (change) information if it's old or wrong. <span className="italic text-indigo-500 dark:text-indigo-300">[Kuchinja mashoko kana akasakara kana asiriwo.]</span></li>
                    <li>Manipulate (work with) the information in different ways. <span className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa mashoko nenzira dzakasiyana.]</span></li>
                  </ul>
                  <p className="mt-2"><strong>Example:</strong> Imagine your school uses a computer system to keep track of all students.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>The database</strong> is where all student names, classes, parent contacts, and exam results are stored.</li>
                    <li><strong>The DBMS</strong> is the software (like a school admin program) that the school secretary uses to add new students, find a student's contact details, or enter exam marks.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 2: KEY DATABASE CONCEPTS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['concepts'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="2">Key Database Concepts</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Zvinhu Zvakakosha Kuziva NezveDatabase]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Let's learn some important words used with databases:
                  </p>
</div>

              {renderCard(
                '1. Data',
                <FileText size={16} />,
                <>
                  <p>This is the raw, basic stuff. Individual facts and figures before they are fully organized or understood.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Data ndizvo zvinhu zvidiki-diki zvemashoko, zvisati zvanyatso rongwa kana kunzwisiswa.]</p>
                  <p><strong>Examples for a Zimbabwean student:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A name: "Tendai"</li>
                    <li>An age: "14"</li>
                    <li>A subject: "Shona"</li>
                    <li>A mark: "75%"</li>
                    <li>A village name: "Murewa"</li>
                    <li>Price of sadza at the tuckshop: "$1"</li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Information',
                <Info size={16} />,
                <>
                  <p>When data is organized and given meaning, it becomes information. It's data that now tells us something useful.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kana data rarongeka rikapiwa zvarinoreva, rinobva raita information. Mashoko aya anenge ava kutitaurira chinhu chinobatsira.]</p>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data:</strong> "Tendai", "14", "Form 2", "75%", "Shona"</li>
                    <li><strong>Information:</strong> "Tendai is a 14-year-old student in Form 2 who scored 75% in Shona." This is now useful for the teacher or parents.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Metadata',
                <Tag size={16} />,
                <>
                  <p>This is "data about data." It describes your data.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Metadata mashoko anotsanangura mamwe mashoko (data). Anotirondedzera kuti data rakamira sei.]</p>
                  <p>Think of it like the label on a file in a filing cabinet. The label tells you what kind of information is inside the file (e.g., "Student Reports") without you having to open and read everything.</p>
                  <p><strong>Example:</strong> For the data "Tendai", metadata might say "This is a student's first name" or "Text, maximum 20 letters".</p>
                </>
              )}

              {renderCard(
                '4. Data Hierarchy',
                <Layers size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Matanho ekurongwa kweData]</p>
                  <p>Data in a database is usually organized in levels, from small pieces to bigger collections.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Data rinowanzorongwa nematanho, kubva pazvidimbu zvidiki kusvika kuzvikwata zvikuru.]</p>
                  <p><strong>Imagine your school's student records:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Columns (Fields):</strong> These are like categories, e.g., "First Name", "Surname", "Class", "Date of Birth".</li>
                    <li><strong>Rows (Records):</strong> Each row is all the information for one student. E.g., one row for Tendai, another for Rudo.</li>
                    <li><strong>Table (File):</strong> All the rows and columns together for a specific group (e.g., "Form 1 Students Table", "Teachers Table"). A table is like one of your exercise books for a specific subject.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '5. Data Dictionary',
                <BookOpen size={16} />,
                <>
                  <p>This is like a special dictionary for your database. It holds all the metadata.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Iri iduramazwi rinotsanangura data rese riri mudatabase.]</p>
                  <p>It tells you what each piece of data means, what format it should be in (e.g., date, number, text), and any rules for that data.</p>
                  <p><strong>Example:</strong> The data dictionary would say that "Date of Birth" must be a valid date, or that "Exam Mark" must be a number between 0 and 100.</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 3: HISTORY OF DATABASES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['history'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="3">The History of Databases</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Nhoroondo yeMadatabase]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Databases weren't always like they are today. They have changed a lot!
                  </p>
</div>

              {renderCard(
                'Early Days (1960s)',
                <Clock size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Nguva dzekare kare]</p>
                  <p>When big computers (mainframes) first came out.</p>
                  <p>Databases were simple and not very flexible. Imagine very rigid filing systems.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Pakabuda makombiyuta makuru ekutanga. Madatabase ainge akareruka uye asina kunyatsoshanduka-shanduka.]</p>
                </>
              )}

              {renderCard(
                'Relational Databases (1970s)',
                <Table size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuzvarwa kwematafura]</p>
                  <p>A very clever man named Edgar F. Codd came up with a new idea: the relational model.</p>
                  <p>This meant organizing data into tables with rows and columns (like we discussed in Data Hierarchy). This made it much easier to work with data.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mumwe murume akachenjera, Edgar F. Codd, akauya nepfungwa yekuronga data mumatafura ane mitsara nemacolumns. Izvi zvakaita kuti kushanda nedata kuve nyore.]</p>
                  <p>A special language called SQL (Structured Query Language) was developed to talk to these relational databases. We still use SQL a lot today!</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mutauro unokosha unonzi SQL wakagadzirwa kutaura nemadatabase aya.]</p>
                </>
              )}

              {renderCard(
                'Rise of DBMS (1980s)',
                <Server size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kubuda kwevaManager veData]</p>
                  <p>Powerful DBMS software like Oracle, MySQL, and Microsoft SQL Server were created.</p>
                  <p>These made it easier for more people and companies to create and manage databases.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mapurogiramu eDBMS ane simba akagadzirwa, zvichiita kuti vanhu nemakambani vakwanise kugadzira nekutarisira madatabase.]</p>
                </>
              )}

              {renderCard(
                'Modern Era (1990s-Present)',
                <Cloud size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Nguva dzanhasi]</p>
                  <p>Things keep getting better!</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>NoSQL databases:</strong> For handling huge amounts of data that isn't always neatly structured (like social media posts or website data).</li>
                    <li><strong>Cloud databases:</strong> Databases stored on the internet, so you can access them from anywhere (like Google Drive, but for structured data).</li>
                    <li>More focus on keeping data secure and private.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 4: WHY ORGANIZATIONS NEED DATABASES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['benefits'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="4">Why Organizations Need Databases</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Sei Masangano Achida Madatabase?]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Think about any organization in Zimbabwe:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <li>Your school</li>
                    <li>A clinic or hospital (like Parirenyatwa)</li>
                    <li>A shop (like OK Zimbabwe or TM Pick n Pay)</li>
                    <li>A bank (like CBZ or Stanchart)</li>
                    <li>A government department (like ZIMRA for taxes)</li>
                  </ul>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    All these places need databases! Here's why:
                  </p>
</div>

              {renderCard(
                'Data Centralization',
                <Inbox size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuisa Data Panzvimbo Imwe]</p>
                  <p>A database puts all important information in ONE place.</p>
                  <p>Imagine a school: Instead of teachers keeping student records in different exercise books, and some on scraps of paper, a database puts all student information in one safe, central computer system. Everyone who needs it can find the same correct information.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Database rinoisa mashoko ese akakosha panzvimbo IMWE. Funga nezvechikoro: pane kuti vadzidzisi vachengete marekodhi evadzidzi mumabhuku akasiyana, database rinoisa zvese pakombiyuta imwe.]</p>
                </>
              )}

              {renderCard(
                'Improved Efficiency',
                <Zap size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kushanda Zviri Nane uye Nekukurumidza]</p>
                  <p>It's much faster to find information in a database.</p>
                  <p>Imagine trying to find how many students in your school come from Highfield by looking through hundreds of paper forms. With a database, the secretary can do a quick search and get the answer in seconds!</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinokurumidza zvikuru kutsvaga mashoko mudatabase. Semuenzaniso, kutsvaga kuti vangani vadzidzi vanobva kuHighfield zvinotora nguva diki pane kutsvaga mumapepa.]</p>
                </>
              )}

              {renderCard(
                'Data Integrity',
                <CheckCircle size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuve neData Rakarurama]</p>
                  <p>Databases help make sure the information is accurate and consistent (the same everywhere).</p>
                  <p>They can have rules. For example, a rule that a student's birth year cannot be in the future, or that an exam mark must be between 0 and 100. This reduces mistakes.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase anobatsira kuona kuti mashoko akarurama uye haapikisane. Panogona kuve nemitemo, sekuti gore rekuzvarwa kwemudzidzi harigone kunge riri mune ramangwana.]</p>
                </>
              )}

              {renderCard(
                'Data Security',
                <Shield size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuchengetedzwa kweData]</p>
                  <p>Databases can protect information. Not everyone can see or change everything.</p>
                  <p>For example, at a bank, only certain bank tellers can access your account details, and they need a password. This keeps your money information safe.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase anogona kuchengetedza mashoko. Havasi vese vanokwanisa kuona kana kuchinja zvese. Semubhanga, vanhu vakati chete ndivo vanokwanisa kuona nezveakaundi yako.]</p>
                </>
              )}

              {renderCard(
                'Data Analysis and Reporting',
                <BarChart size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuongorora Data neKugadzira Mishumo]</p>
                  <p>Organizations can use the data in databases to understand things better and make good decisions.</p>
                  <p>A shop like OK Zimbabwe can look at its sales data to see which products are selling the most in which branch (e.g., more Mazoe Orange Crush sold in Bulawayo than Mutare). This helps them decide what to stock.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Masangano anogona kushandisa data kuti anzwisise zvinhu zviri nani. Chitoro chinogona kuona kuti ndezvipi zvigadzirwa zviri kutengwa zvakanyanya.]</p>
                </>
              )}

              {renderCard(
                'Scalability and Growth',
                <TrendingUp size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kukwanisa Kukura neSangano]</p>
                  <p>As an organization grows and gets more data, the database can grow with it.</p>
                  <p>A small clinic might start with a few hundred patient records. As it becomes a big hospital with thousands of patients, a good database system can handle the extra information.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Sangano parinokura, database rinokwanisawo kukura richibata data rakawanda.]</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 5: CHARACTERISTICS OF A DATABASE
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['characteristics'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="5">Characteristics of a Database</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Hunhu hweDatabase Rakanaka]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Good databases have these qualities:
                  </p>
</div>

              {renderCard(
                'ACID Properties',
                <Shield size={16} />,
                <>
                  <p>This is a fancy term, but it's super important. It means transactions (like saving data or changing data) are reliable.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Izwi rehunyanzvi, asi rinoreva kuti mashandiro edata (sekuchengeta kana kuchinja) akavimbika.]</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><CheckCircle size={16} /> Atomicity (Zvese kana Pasina)</h4>
                  <p>A transaction is "all or nothing."</p>
                  <p><strong>Example:</strong> When you send money using EcoCash, either the money leaves your account AND reaches the other person, OR the transaction fails and nothing changes. The money won't just disappear.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Basa rinoitwa rese kana kuti haritombotanga. Semuenzaniso, paunotumira mari neEcoCash, kana mari ichibva kwauri ichienda kumunhu, zvese zvinoitika, kana kuti hapana chinoitika. Mari haingonyangarika.]</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><ListChecks size={16} /> Consistency (Kutevedzera Mitemo)</h4>
                  <p>The database always follows its rules. Data stays valid.</p>
                  <p><strong>Example:</strong> If a rule says a student's age must be a number, you can't enter "fifteen" as words. The database will be consistent.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Database rinogara richitevera mitemo yaro. Data rinoramba riri chokwadi. Semuenzaniso, kana mutemo uchiti zera remudzidzi rinofanira kuva nhamba, haugone kunyora kuti "gumi neshanu" nemazwi.]</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><User size={16} /> Isolation (Kushanda Pasina Kukanganiswa)</h4>
                  <p>If many people are using the database at the same time, their actions don't interfere with each other.</p>
                  <p><strong>Example:</strong> If you and your friend are trying to book the very last seat on a ZUPCO bus online at the exact same moment, the database makes sure only one of you gets it, and things don't get mixed up.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kana vanhu vakawanda vari kushandisa database panguva imwe chete, mabasa avo haakanganisane. Semuenzaniso, kana vaviri vari kuyedza kubhuka chigaro chekupedzisira muZUPCO online panguva imwe chete, database rinoona kuti mumwe chete ndiye anowana chigaro.]</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><HardDrive size={16} /> Durability (Kusimba Kwekuchengeta)</h4>
                  <p>Once data is saved, it stays saved, even if there's a power cut (magetsi akaenda) or the computer crashes.</p>
                  <p><strong>Example:</strong> If the school secretary enters your exam marks and saves them, those marks should still be there tomorrow, even if the computer was switched off.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kana data rachengetwa, rinoramba rakachengetwa, kunyangwe magetsi akaenda kana kombiyuta ikafa. Semuenzaniso, kana mabharani wechikoro akaisa mamakisi ako akaachengeta, anofanira kuramba aripo mangwana.]</p>
                </>
              )}

              {renderCard(
                'Structured Data',
                <Layout size={16} />,
                <>
                  <p>Data is organized neatly, usually in tables with rows and columns. This makes it easy to find and use.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Data rakarongeka zvakanaka, kazhinji mumatafura ane mitsara nemacolumns.]</p>
                </>
              )}

              {renderCard(
                'Query Languages',
                <MessageSquare size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mitauro Yekubvunza]</p>
                  <p>Databases use special languages like SQL to "ask questions" or get specific information.</p>
                  <p><strong>Example:</strong> A teacher could use SQL to ask the database: "Show me all students in Form 1 who got above 80% in Maths."</p>
                </>
              )}

              {renderCard(
                'Concurrency Control',
                <Users size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kugona Kushandiswa Nevakawanda Panguva Imwe]</p>
                  <p>Many users can access and use the database at the same time without messing things up. The DBMS manages this.</p>
                </>
              )}

              {renderCard(
                'Backup and Recovery',
                <Cloud size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuchengeta Kopi neKudzoreredza]</p>
                  <p>Good databases have ways to make copies (backups) of the data. If something goes wrong (like a computer breaks), the data can be recovered from the backup.</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 6: CHALLENGES IN INFORMATION CENTRE DATABASE DEVELOPMENT
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['challenges'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="6">Challenges in Information Centre Database Development and Management</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Matambudziko Mukugadzira Nekutarisira Madatabase eZvikoro Zveruzivo]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Think of an Information Centre (IC) like your school library, a community library, or even a place that keeps historical records. They have special challenges with databases:
                  </p>
</div>

              {renderCard(
                'Data Variety',
                <Layers size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mhando dzakasiyana dzeData]</p>
                  <p>ICs deal with many types of information: books, old newspapers, magazines (like Moto or Parade), photos, videos, student research papers. These are all in different formats. It's hard to put them all neatly into one type of database structure.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Nzvimbo dzeruzivo dzinobata nemhando dzakawanda dzemashoko: mabhuku, mapepanhau ekare, mapikicha, mavhidhiyo. Izvi zviri mumafomati akasiyana, zvichiita kuti zviome kuzviisa mudatabase rimwe chete.]</p>
                </>
              )}

              {renderCard(
                'Data Integration',
                <Database size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kubatanidza Data Kubva Kwakasiyana]</p>
                  <p>Getting all this different data from different sources into one database so people can search it easily is a big job. You need to make formats the same and ensure quality.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuisa data rese iri kubva kwakasiyana mudatabase rimwe chete kuti vanhu vakwanise kutsvaga zviri nyore ibasa guru.]</p>
                </>
              )}

              {renderCard(
                'Metadata Management',
                <Tag size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kutarisira Mashoko Anotsanangura Data]</p>
                  <p>For every book, photo, or article, you need good metadata (like author, date, subject, keywords) so people can find it. Creating and updating this metadata for thousands of items takes a lot of time.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kune bhuku rega rega kana pikicha, unoda metadata yakanaka (semunyori, zuva, musoro wenyaya) kuti vanhu vazviwane. Izvi zvinotora nguva yakareba.]</p>
                </>
              )}

              {renderCard(
                'Scalability and Growth',
                <TrendingUp size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kukura KweData]</p>
                  <p>ICs get new information all the time. The database needs to be able to handle more and more data without slowing down. Old information still needs to be findable.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Nzvimbo dzeruzivo dzinogara dzichiwana mashoko matsva. Database rinofanira kukwanisa kubata data rakawanda risinganonoke.]</p>
                </>
              )}

              {renderCard(
                'User Needs and Skills',
                <Users size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinodiwa neVashandisi neUnyanzvi Hwavo]</p>
                  <p>Some people using the IC database might be good with computers, others might not. The database needs to be easy for everyone to use. Staff also need training.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Vamwe vanhu vanoshandisa database vanogona kunge vachigona makombiyuta, vamwe vasingagone. Database rinofanira kuva nyore kushandisa kune wese wese.]</p>
                </>
              )}

              {renderCard(
                'Security and Access Control',
                <Shield size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuchengetedzeka neKodzero dzeKushandisa]</p>
                  <p>Some information might be sensitive or private (e.g., old personal letters in an archive). The IC needs to protect this but still allow authorized people to see what they need.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mamwe mashoko anogona kunge ari chakavanzika. IC inofanira kuchengetedza izvi asi ichibvumira vanhu vane mvumo kuona zvavanoda.]</p>
                </>
              )}

              {renderCard(
                'Budgetary Constraints',
                <DollarSign size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kushaikwa Kwemari Yakakwana]</p>
                  <p>Building and maintaining a good database system costs money (for computers, software, and skilled people). ICs, especially in schools or communities, often don't have a big budget (mari shoma).</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuvaka nekuchengetedza database kunoda mari. Nzvimbo dzeruzivo dzinowanzove dzisina mari yakawanda.]</p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 7: STRATEGIES TO MITIGATE CHALLENGES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['strategies'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="7">Strategies to Mitigate Challenges</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Nzira dzeKuderedza Matambudziko]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    How can ICs deal with these challenges?
                  </p>
</div>

              {renderCard(
                'Mitigation Strategies',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Standardization (Kuisa Mitemo Yakaenzana):</strong> Use common ways to describe and format data. This makes it easier to combine data and for people to search. For example, always writing dates as DD/MM/YYYY. <span className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa nzira dzakafanana dzekutsanangura nekugadzira data. Semuenzaniso, kunyora mazuva ese se DD/MM/YYYY.]</span></li>
                  <li><strong>Metadata Management Tools (Zvishandiso zveKutarisira Metadata):</strong> Use software that can help create and manage metadata, sometimes even automatically. <span className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa mapurogiramu anobatsira kugadzira nekutarisira metadata.]</span></li>
                  <li><strong>Scalable Database Solutions (Madatabase Anokwanisa Kukura):</strong> Choose database systems that can easily grow. Cloud-based databases can be good for this as you can pay for more storage as you need it. <span className="italic text-indigo-500 dark:text-indigo-300">[Kusarudza madatabase anokwanisa kukura zviri nyore. Madatabase epaIndaneti anogona kubatsira.]</span></li>
                  <li><strong>User-Friendly Interfaces (Nzira dzeKushandisa Dziri Nyore):</strong> Make the database search screen look simple and easy to understand, even for beginners. Provide training. <span className="italic text-indigo-500 dark:text-indigo-300">[Kuita kuti nzvimbo yekutsvaga mudatabase ive nyore kunzwisisa, kunyangwe kune vachangotanga. Kupawo dzidziso.]</span></li>
                  <li><strong>Role-based Access Control (Kodzero dzeKushandisa Zvinoenderana neBasa):</strong> Give people access only to the information they need for their job. A student might search, but only a librarian can add or delete books. <span className="italic text-indigo-500 dark:text-indigo-300">[Kupa vanhu mvumo yekuona mashoko avanoda chete pabasa ravo.]</span></li>
                  <li><strong>Open Source Solutions (Mapurogiramu Asingabhadharwe):</strong> Use free, open-source DBMS software if the budget is very tight. These can be very good, but might need more technical skill to set up. <span className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa mapurogiramu eDBMS asingabhadharwe kana mari iri shoma. Anogona kunge akanaka asi achida hunyanzvi hwekuamisa.]</span></li>
                </ul>
              )}
            </div>

            {/* ==============================================================
                SECTION 8: TRADITIONAL FILE SYSTEMS VS DATABASE SYSTEMS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="8">Topic 2: Traditional File Systems vs. Database Systems</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Kuenzanisa Mafaira Akareruka neMadatabase Systems]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Before we had fancy databases, and even now for simple things, we use Traditional File Systems.
                  </p>
</div>

              {renderCard(
                'Traditional File Systems',
                <Folder size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Nzira dzeKare dzeKuchengeta Mafaira]</p>
                  <p>Think of the folders on your computer (like "My Documents", "Pictures", "Music") or on your phone. Inside these folders, you save individual files (a Word document, a photo, an MP3 song). This is a traditional file system.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Funga nezvemafodha ari pakombiyuta yako kana pafoni yako. Mukati memafodha aya, unochengeta mafaira ega ega. Iyi ndiyo traditional file system.]</p>
                  <p>It's like a digital version of putting papers into different physical folders in a filing cabinet.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakafanana nekuisa mapepa mumafolda akasiyana mukabhodhi.]</p>
                </>
              )}

              {renderCard(
                'Advantages of Traditional File Systems',
                <ThumbsUp size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakanakira Mafaira Akareruka]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Simplicity (Kureruka):</strong> Easy to understand and use for basic things. You don't need to be a computer expert to save a file in a folder.</li>
                    <li><strong>Speed and Efficiency (for some tasks):</strong> Reading or writing one single file can be quick.</li>
                    <li><strong>Customization (Kugadzira Nenzira Yako):</strong> You can create folders and name them however you like to organize your own stuff.</li>
                    <li><strong>Offline Access (Kukwanisa Kushandisa Usina Indaneti):</strong> You can access your files even if you are not connected to the internet.</li>
                    <li><strong>Lower Cost (Mutengo Wakaderera):</strong> Usually doesn't cost extra; it's part of your computer's operating system (like Windows or Android).</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Disadvantages of Traditional File Systems',
                <ThumbsDown size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakaipira Mafaira Akareruka]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Redundancy (Data Rakawanda Risina Basa):</strong> You can easily have the same information saved in many different folders. <span className="italic text-indigo-500 dark:text-indigo-300">[Unogona kuva neruzivo rumwe chete rwakachengetwa mumafolda akawanda akasiyana.]</span></li>
                    <li><strong>Data Integrity Issues (Matambudziko eKururama kweData):</strong> If you have the same info in different places, and you change it in one place but forget to change it in others, then your data becomes inconsistent and confusing. Which one is correct? <span className="italic text-indigo-500 dark:text-indigo-300">[Kana uine mashoko akafanana munzvimbo dzakasiyana, ukachinja pane imwe ukakanganwa pane dzimwe, data rako rinobva rasanganisa.]</span></li>
                    <li><strong>Limited Sharing and Collaboration (Zvinetso paKugovana neKushanda Pamwe):</strong> It's hard for many people to work on the same files easily. You might have to email files back and forth, which can be messy. <span className="italic text-indigo-500 dark:text-indigo-300">[Zvakaoma kuti vanhu vakawanda vashande pamwe chete pamafaira amwe. Mungatofanira kutumirana nemaemail.]</span></li>
                    <li><strong>Scalability Limitations (Zvinetso paKukura kweData):</strong> When you have thousands and thousands of files, it becomes very hard to manage and find things. <span className="italic text-indigo-500 dark:text-indigo-300">[Kana uine zviuru zvemafaira, zvinova zvakaoma kwazvo kutarisira nekutsvaga zvinhu.]</span></li>
                    <li><strong>Security Challenges (Zvinetso zveKuchengetedza):</strong> It can be harder to control who sees which files properly. <span className="italic text-indigo-500 dark:text-indigo-300">[Zvinogona kuoma kudzora kuti ndiani anoona mafaira api.]</span></li>
                  </ul>
                </>
              )}

              {renderCard(
                'Database Systems (Recap)',
                <Database size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase Systems - Kuyeuchidza]</p>
                  <p>We already learned about these! A database is an organized collection of structured data, managed by a DBMS.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Takatodzidza nezveizvi! Database muunganidzwa wakarongeka wedata, unotarisirwa neDBMS.]</p>
                </>
              )}

              {renderCard(
                'Advantages of Database Systems',
                <ThumbsUp size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakanakira Madatabase Systems]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Organization and Structure (Kurongeka kweData):</strong> Data is in tables – neat and tidy. <span className="italic text-indigo-500 dark:text-indigo-300">[Data riri mumatafura – zvakarongeka.]</span></li>
                    <li><strong>Data Integrity and Consistency (Kururama kweData):</strong> Rules help keep data accurate. <span className="italic text-indigo-500 dark:text-indigo-300">[Mitemo inobatsira kuti data rive chokwadi.]</span></li>
                    <li><strong>Reduced Data Redundancy (Kuderedza Data Risina Basa):</strong> Information is stored once centrally, so less duplication. <span className="italic text-indigo-500 dark:text-indigo-300">[Mashoko anochengetwa kamwe chete panzvimbo imwe, saka hapana kudzokorora kwakawanda.]</span></li>
                    <li><strong>Enhanced Data Sharing and Collaboration (Kugovana Nekushanda Pamwe Zviri Nane):</strong> Many people can use the data at the same time.</li>
                    <li><strong>Data Security and Access Control (Kuchengetedzwa kweData neKodzero dzeKushandisa):</strong> Good control over who can see or change what.</li>
                    <li><strong>Powerful Query Capabilities (Kugona Kubvunza Zvakawanda):</strong> You can ask complex questions to find exactly what you need using languages like SQL.</li>
                    <li><strong>Scalability and Growth (Kukwanisa Kukura):</strong> Can handle large amounts of data and more users as needed.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Disadvantages of Database Systems',
                <ThumbsDown size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakaipira Madatabase Systems]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Complexity (Kuoma Kunzwisisa):</strong> Designing and managing a database can be complicated. It needs special skills.</li>
                    <li><strong>Cost (Mutengo):</strong> Database software, powerful computers (hardware), and skilled staff can be expensive.</li>
                    <li><strong>Steeper Learning Curve (Zvinoda Kudzidza Zvakawanda):</strong> Users might need to learn query languages (like SQL) and understand how data is structured.</li>
                    <li><strong>Performance Overhead (for very small tasks):</strong> For very, very simple tasks with little data, a database might seem slower than just opening a single file because there's more software involved. But for most real-world needs, databases are much more efficient.</li>
                  </ul>
                </>
              )}

              {/* Comparison Table */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> File Systems vs. Databases: Which one to use?
                </h4>
                <p className="text-sm italic text-indigo-500 dark:text-indigo-300 mb-2">[Mafaira Akareruka neMadatabase: Ndechipi chekushandisa?]</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Let's compare them side-by-side:</p>

                <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-bold">Feature</th>
                      <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-bold">Traditional File System</th>
                      <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-bold">Database System</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Structure <span className="italic text-indigo-500 dark:text-indigo-300">(Kurongeka)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Folders and files. Data can be in any format (text, pic)</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Tables with rows and columns. Structured data.</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Data Management <span className="italic text-indigo-500 dark:text-indigo-300">(Kutarisira Data)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Limited. You manage it yourself. Risk of errors.</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Strong! DBMS helps. Rules for integrity, less redundancy.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Sharing <span className="italic text-indigo-500 dark:text-indigo-300">(Kugovana)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Can be clumsy (emailing files). Hard for many to edit.</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Designed for sharing. Many users can access/edit safely.</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Scalability <span className="italic text-indigo-500 dark:text-indigo-300">(Kukura)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Gets hard to manage with lots of data.</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Can handle very large amounts of data and users.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Security <span className="italic text-indigo-500 dark:text-indigo-300">(Kuchengetedzeka)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Basic. Can be hard to set detailed permissions.</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Strong! User permissions, encryption.</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold">Cost &amp; Complexity <span className="italic text-indigo-500 dark:text-indigo-300">(Mutengo neKuoma)</span></td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Simple, usually no extra cost.</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">Can be complex and expensive (software, hardware, staff).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {renderCard(
                'When to use which',
                <Target size={16} />,
                <>
                  <p><strong>Use a Traditional File System for:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your personal documents, photos, music on your own computer.</li>
                    <li>Small projects where you are the only one working on the files.</li>
                    <li>Simple storage where you don't need complex relationships between data.</li>
                  </ul>
                  <p className="mt-3"><strong>Use a Database System for:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A school's student records (names, grades, addresses, fees).</li>
                    <li>A shop's inventory (list of all products, prices, stock levels).</li>
                    <li>A hospital's patient records.</li>
                    <li>A bank's customer accounts.</li>
                    <li>Any situation where data needs to be accurate, shared by many, secure, and easily searched or analyzed.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💡 Database Insight</h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{randomTip.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{randomTip.text}</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{SECTION_TABS.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>ACID Properties</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Comparison Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 text-sm">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A database is an organized collection of structured data, managed by a DBMS. Key concepts include data, information, metadata, and data hierarchy. ACID properties (Atomicity, Consistency, Isolation, Durability) ensure reliable transactions. Traditional file systems are simpler but lack data integrity, sharing, and scalability. Databases are essential for organizations needing accurate, secure, and searchable data.
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
                <strong className="text-white">Database &amp; DBMS</strong> – A database is an organized collection of data; a DBMS is the software that manages it, providing tools for creation, retrieval, update, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key Concepts</strong> – Data (raw facts), Information (meaningful data), Metadata (data about data), and Data Hierarchy (columns, rows, tables) form the foundation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">ACID Properties</strong> – Atomicity (all or nothing), Consistency (rules followed), Isolation (concurrent actions don't interfere), Durability (data persists after failures).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Systems vs Databases</strong> – File systems are simple but lead to redundancy, inconsistency, and poor sharing. Databases offer integrity, security, scalability, and powerful querying.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges &amp; Strategies</strong> – Information Centres face data variety, integration, metadata management, and budget constraints. Solutions include standardization, metadata tools, scalable systems, user-friendly interfaces, role‑based access, and open‑source software.
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
            Sidemann Academic Registry • Databases, DBMS &amp; File Systems Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;