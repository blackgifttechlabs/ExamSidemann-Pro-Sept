import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // Core icons for header, nav, sidebar
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
  // Additional icons used in content
  FolderTree,
  Layout,
  Edit,
  ListChecks,
  Database,
  User,
  Cloud,
  Server,
  HardDrive,
  Users,
  Link,
  Table,
  PlusCircle,
  MoreHorizontal,
  Layers,
  Box,
  TreePalm as Tree,
  Zap,
  TrendingUp,
  Inbox,
  DollarSign,
  MessageSquare,
  Plus,
  Minus,
  Eye,
  Lock,
  AlertCircle,
  Globe,
  Settings,
  Circle,
  File,
  Folder,
  BookMarked,
  Library,
  Tag,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'components', label: 'Components' },
  { id: 'models', label: 'Models' },
  { id: 'design', label: 'Design & Implementation' },
  { id: 'operations', label: 'Operations' },
  { id: 'novel', label: 'Novel Solutions' },
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

  // Random tip on mount (database‑related)
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The relational model was introduced by Edgar F. Codd in 1970 and became the foundation of modern database systems.',
      },
      {
        title: 'Pro Tip',
        text: 'Always design your database schema with normalization (at least 3NF) to avoid redundancy and ensure data integrity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember CRUD operations: Create, Read, Update, Delete – the four basic functions of persistent storage.',
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
        text: 'The relational model was introduced by Edgar F. Codd in 1970 and became the foundation of modern database systems.',
      },
      {
        title: 'Pro Tip',
        text: 'Always design your database schema with normalization (at least 3NF) to avoid redundancy and ensure data integrity.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember CRUD operations: Create, Read, Update, Delete – the four basic functions of persistent storage.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> DATABASES &amp; DBMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Database Systems, Models &amp;{' '}
            <span className="text-sky-300 font-bold italic">
              Operations
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to database components, models, design, implementation, CRUD operations, and modern data management solutions.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {SECTION_TABS.length} sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Components
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> Models
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Edit size={14} className="inline mr-1" /> CRUD
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
                SECTION 1: DATABASE SYSTEM COMPONENTS
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['components'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="1">Topic 3: Database System Components</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Zvikamu Zvinoita kuti Database System Ishande]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Think of a database system like cooking sadza. You need different things for it to work:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <li>The pot (hardware)</li>
                    <li>The mealie meal and water (data)</li>
                    <li>The fire and cooking stick (software)</li>
                    <li>You, the cook (people)</li>
                    <li>The recipe or how you know to cook it (procedures)</li>
                  </ul>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    A database environment is all these parts working together.
                  </p>
                  <p className="italic text-indigo-500 dark:text-indigo-300 text-sm">[Database environment inzvimbo ine zvikamu zvese izvi zvinoshanda pamwechete.]</p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Here are the main components:
                  </p>
</div>

              {renderCard(
                '1. Hardware',
                <HardDrive size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Midziyo Inobatika]</p>
                  <p>These are the physical, touchable parts of the computer system that the database uses.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Izvi ndizvo zvikamu zvekompiyuta zvinobatika zvinoshandiswa nedatabase.]</p>
                  <p><strong>Includes:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Servers:</strong> Very powerful computers that store the database software and all the data. Think of a big, strong cabinet where all important files are kept. For example, Econet or Telecel would have big servers to store all customer phone numbers and billing information. <span className="italic text-indigo-500 dark:text-indigo-300">[Makombiyuta makuru ane simba anochengeta purogiramu yedatabase nedata rese. Funga sekabhodhi kahombe, rakasimba kanochengetwa mafaira ese anokosha. Semuenzaniso, Econet ine maseva makuru anochengeta nhamba dzefoni dzevatengi vese.]</span></li>
                    <li><strong>Storage Devices:</strong> These are what actually hold the data files – like special, large hard drives or very fast USB-like drives inside the servers. <span className="italic text-indigo-500 dark:text-indigo-300">[Izvi ndizvo zvinonyatso chengeta mafaira edata – semahard drive mahombe akakosha kana maUSB anokurumidza ari mukati memaseva.]</span></li>
                    <li><strong>Network Components:</strong> Things like routers (like your Wi-Fi box at home, but bigger), switches, and cables that let the servers, users' computers, and other devices talk to each other. This is how you connect to the database, maybe from the school office computer to the main server. <span className="italic text-indigo-500 dark:text-indigo-300">[Zvinhu zvakaita semarouter (seWi-Fi box yako kumba, asi hombe), maswitch, netambo zvinobvumira maseva, makombiyuta evashandisi, nezvimwe zvishandiso kutaudzana.]</span></li>
                  </ul>
                </>
              )}

              {renderCard(
                '2. Software',
                <Cloud size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mapurogiramu ePachikombiyuta]</p>
                  <p>These are the programs or instructions that tell the hardware what to do and manage the data.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Aya mapurogiramu anoudza hardware zvekuita uye anotarisira data.]</p>
                  <p><strong>Includes:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Database Management System (DBMS):</strong> This is the main software, the "brain" or the "librarian" for the database. It creates, changes, and controls who sees the data. Examples we talked about: MySQL, Oracle, Microsoft SQL Server. <span className="italic text-indigo-500 dark:text-indigo-300">[Iyi ndiyo purogiramu huru, "huropi" kana "mubatsiri wemumaraibhurari" wedatabase. Inogadzira, inochinja, uye inodzora kuti ndiani anoona data. Mienzaniso: MySQL, Oracle.]</span></li>
                    <li><strong>Operating System (OS):</strong> The main software that runs the computer, like Windows, Android (on your phone), or Linux. The DBMS needs the OS to work. <span className="italic text-indigo-500 dark:text-indigo-300">[Purogiramu huru inomhanyisa kombiyuta, seWindows kana Android. DBMS inoda OS kuti ishande.]</span></li>
                    <li><strong>Application Software:</strong> These are other programs that users interact with to use the database. <span className="italic text-indigo-500 dark:text-indigo-300">[Aya mamwe mapurogiramu anoshandiswa nevanhu kuti vashandise database.]</span></li>
                  </ul>
                  <p className="mt-2"><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The software a bank teller uses at CBZ to check your account balance – that software talks to the bank's main database.</li>
                    <li>A school administration software used to enter student marks into the school database.</li>
                    <li>An e-commerce app like "Foodunlocked" or "Fresh In A Box" in Zimbabwe uses a database to show products and take orders.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '3. Data',
                <Database size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mashoko Ari Kuchengetwa]</p>
                  <p>This is the actual information stored in the database. This is the reason the database exists!</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Aya ndiwo mashoko chaiwo anochengetwa mudatabase. Ndiro revo yekuvepo kwedatabase!]</p>
                  <p>It can be:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Text (names, addresses like "123 Main Street, Harare")</li>
                    <li>Numbers (ages, prices like $2 for a loaf of bread, student ID numbers)</li>
                    <li>Images (student photos, product pictures)</li>
                    <li>Audio (voice notes)</li>
                    <li>Video</li>
                  </ul>
                </>
              )}

              {renderCard(
                '4. People',
                <Users size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Vanhu Vanoshandisa kana Kutarisira]</p>
                  <p>Humans are very important for a database system!</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Vanhu vakakosha zvikuru padatabase system!]</p>
                  <p><strong>Key people include:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Database Administrators (DBAs):</strong> These are the technical experts. They install the DBMS, set it up, keep it running smoothly, make sure it's secure (safe from hackers or mistakes), and fix problems. Think of them as the chief mechanic and security guard for the database. <span className="italic text-indigo-500 dark:text-indigo-300">[Ava inyanzvi dzezvemakombiyuta. Vanoisa DBMS, voimisa, voichengeta ichishanda zvakanaka, voona kuti yakachengeteka, uye vanogadzirisa matambudziko.]</span></li>
                    <li><strong>Database Designers:</strong> These people plan how the database will be structured. They decide what tables to have, what columns in each table, and how tables are linked. They are like the architects who design a house before it's built. <span className="italic text-indigo-500 dark:text-indigo-300">[Vanhu ava vanoronga kuti database richave rakamira sei. Vanosarudza matafura api achavepo, macolumns api, uye kuti matafura anobatanidzwa sei.]</span></li>
                    <li><strong>Data Analysts:</strong> These people take data from the database and study it to find useful information, trends, or patterns. They might create reports that help a company make decisions. For example, analyzing sales data from TM Pick n Pay to see which bread brand sells most. <span className="italic text-indigo-500 dark:text-indigo-300">[Vanhu ava vanotora data kubva mudatabase voriongorora kuti vawane mashoko anobatsira. Semuenzaniso, kuongorora data rekutengesa reTM Pick n Pay kuti vaone kuti chingwa chipi chinotengwa zvakanyanya.]</span></li>
                    <li><strong>End Users:</strong> Anyone who uses the database (usually through an application). <span className="italic text-indigo-500 dark:text-indigo-300">[Chero munhu anoshandisa database (kazhinji achishandisa application).]</span></li>
                  </ul>
                  <p className="mt-2"><strong>Examples:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A school secretary entering student details.</li>
                    <li>A student checking their exam results online.</li>
                    <li>A customer using an ATM to withdraw money (the ATM talks to the bank's database).</li>
                    <li>Someone in a ZESA office looking up your electricity account.</li>
                  </ul>
                </>
              )}

              {renderCard(
                '5. Procedures',
                <ListChecks size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mitemo neNzira dzeKushandisa]</p>
                  <p>These are the rules, instructions, and methods on how to use and manage the database.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Iyi imitemo nemirairo yekuti database rinoshandiswa nekutarisirwa sei.]</p>
                  <p><strong>Includes:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Security Protocols:</strong> Rules to keep the data safe. Who can see what? What passwords are needed? How to prevent Zvigure (hackers) from getting in. <span className="italic text-indigo-500 dark:text-indigo-300">[Mitemo yekuchengetedza data. Ndiani anokwanisa kuona chii? Mapassword api anodiwa?]</span></li>
                    <li><strong>Backup and Recovery Procedures:</strong> Plans for making copies (backups) of the database regularly. If the computer breaks or data is lost (e.g., due to a power surge or "magetsi adzoka nesimba"), there's a way to get it back (recover). <span className="italic text-indigo-500 dark:text-indigo-300">[Zvirongwa zvekuita makopi edatabase. Kana kombiyuta ikafa kana data rikarasika, pane nzira yekuridzosa.]</span></li>
                    <li><strong>Data Access Control Measures:</strong> Rules defining who can access what data and what they can do with it (e.g., some users can only read data, others can change it). <span className="italic text-indigo-500 dark:text-indigo-300">[Mitemo inotsanangura kuti ndiani anokwanisa kuwana data ripi uye kuti anokwanisa kuitei naro.]</span></li>
                  </ul>
                </>
              )}

              {renderCard(
                'Relationship between the components of a database environment',
                <Link size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Hukama Pakati Pezvikamu zveDatabase Environment]</p>
                  <p>All these parts (Hardware, Software, Data, People, Procedures) must work together like a team. If one part is missing or not working well, the whole system suffers.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvikamu zvese izvi zvinofanira kushanda pamwechete sechikwata. Kana chimwe chikashaikwa kana kusashanda zvakanaka, system yese inotambura.]</p>
                  <p><strong>Hardware and Software:</strong> The Hardware (like the server computer) is the body. The Software (like the DBMS) is the brain that makes the body work. The Operating System helps the brain (DBMS) talk to the body (hardware). <span className="italic text-indigo-500 dark:text-indigo-300">[Hardware muviri. Software ihuropi hunoita kuti muviri ushande. Operating System inobatsira huropi (DBMS) kutaura nemuviri (hardware).]</span></p>
                  <p><strong>Hardware and Data:</strong> The Hardware (storage devices like hard drives) is where the Data (the actual information) is physically kept, like books on a library shelf. The DBMS uses the hardware to read and write this data. <span className="italic text-indigo-500 dark:text-indigo-300">[Hardware (senge mahard drive) ndipo panochengeterwa Data (mashoko chaiwo), semabhuku pasherufu yemuraibhurari.]</span></p>
                  <p><strong>Software (DBMS) and Data:</strong> The DBMS (software) is like the chief librarian. It organizes the Data in the database, knows where everything is, and controls how it's used. It defines the structure (tables, columns) and makes sure the data follows the rules. <span className="italic text-indigo-500 dark:text-indigo-300">[DBMS (software) yakafanana nemukuru wemuraibhurari. Inoronga Data mudatabase, inoziva kuti zvese zviripi, uye inodzora mashandisirwo azvo.]</span></p>
                  <p><strong>Software (Applications) and Data:</strong> Application software (like a banking app or school admin program) uses the DBMS to get to the Data. The application is what the end-user sees and interacts with.</p>
                  <p><strong>Example:</strong> When you use your EcoCash app, the app (application software) talks to the EcoCash DBMS to show you your balance (data). <span className="italic text-indigo-500 dark:text-indigo-300">[Application software (senge banking app) inoshandisa DBMS kuti isvike kuData. Iyo application ndiyo inoonekwa nemushandisi.]</span></p>
                  <p><strong>Data and People:</strong> Data is the main thing! DBAs and Designers (people) create, manage, and protect the data. Data Analysts (people) study the data to find meaning. End Users (people) use the data to do their jobs or get information. <span className="italic text-indigo-500 dark:text-indigo-300">[Data ndicho chinhu chikuru! Vanhu (DBAs, Designers, Analysts, End Users) vanoshanda nedata.]</span></p>
                  <p><strong>Procedures and All Components:</strong> Procedures (rules and methods) are like the instruction manual or the laws for how everything works together. They guide how hardware is used, how software is operated, how data is protected, and what people should do. <span className="italic text-indigo-500 dark:text-indigo-300">[Procedures (mitemo) dzakafanana nebhuku remirairo kana mitemo yekuti zvese zvinoshanda sei pamwechete.]</span></p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 2: DATABASE MODELS AND DATABASE TECHNOLOGIES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['models'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="2">Topic 4: Database Models and Database Technologies</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Mhando dzeMadatabase neTekinoroji Dzayo]</span>
                  </p>
</div>

              {renderCard(
                'Database Models',
                <Layout size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mhando dzeKurongeka kweData muDatabase]</p>
                  <p>A database model is like the blueprint or plan that shows how data is organized and connected inside a database. It's the logical structure.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Database model yakafanana nepurani inoratidza kuti data rakarongeka sei uye rakabatanidzwa sei mukati medatabase.]</p>
                  <p>Different models are good for different types of data and situations.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Table size={16} /> 1. Relational Model</h4>
                  <p>This is the most common one! Data is stored in tables (like spreadsheets or your school class register).</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Uyu ndiwo unonyanya kushandiswa! Data rinochengetwa mumatafura.]</p>
                  <p>Tables have rows (each row is one item, like one student) and columns (each column is a piece of information about the item, like "Name", "Age", "Class").</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Matafura ane mitsara (row yega yega chinhu chimwe, semudzidzi mumwe) nemacolumns (column yega yega chidimbu cheruzivo, se "Zita", "Zera", "Kirasi").]</p>
                  <p>Tables can be linked together. For example, a "Students" table can be linked to an "Exams" table.</p>
                  <p>We use a language called SQL (Structured Query Language) to talk to these databases.</p>
                  <p><strong>Example:</strong> Your school's student records database, where student info is in one table, subject info in another, and exam results linking them.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Tree size={16} /> 2. Hierarchical Model</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Model yeMatanho seMuti]</p>
                  <p>Data is organized like a family tree or the branches of a tree.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Data rakarongeka semuti wemhuri kana matavi emuti.]</p>
                  <p>There's a "parent" record, and it can have many "child" records. But a "child" can only have ONE "parent."</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kune "mubereki" rekodhi, uye inogona kuva nevana vakawanda. Asi "mwana" anogona kungova nemubereki MUMWE CHETE.]</p>
                  <p>This is an older model and not as flexible.</p>
                  <p><strong>Example:</strong> Imagine a company structure: Managing Director (parent) -{'>'} Department Managers (children). Each Department Manager reports to only one MD.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Layers size={16} /> 3. Network Model</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Model yeKubatana Kwakawanda]</p>
                  <p>Also like a tree, but more flexible. A "child" record CAN have MORE THAN ONE "parent."</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvakafananawo nemuti, asi "mwana" rekodhi ANOGONA kuva nevabereki VANOPFUURA MUMWE.]</p>
                  <p>This is also an older model and less common now.</p>
                  <p><strong>Example:</strong> A student (child) can be enrolled in multiple courses (parents), and a course (child) can have multiple students (parents).</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Box size={16} /> 4. Object-Oriented Model</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Model yeZviro Zvine Hunhu neMabasa]</p>
                  <p>Data is stored as "objects." An object contains both the data itself (attributes, like a student's name and age) AND the actions (methods or functions) that can be done with that data (like "calculate student's average mark").</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Data rinochengetwa se "zvinhu". Chinhu chinenge chine data racho (hunhu) nemabasa anogona kuitwa nedata iroro.]</p>
                  <p>More complex, but can be good for complex data.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Cloud size={16} /> 5. NoSQL Model</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kwete SQL Chete - Kune Mhando Dzisingashandisi Matafura Chete]</p>
                  <p>This isn't one single model, but a family of newer models. They are good for very large amounts of data, or data that isn't neatly structured like tables (e.g., social media posts, sensor data).</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Haisi model imwe chete, asi mhuri yemamodels matsva. Akanakira data rakawandisa, kana data risina kunyatsorongwa sematafura (senge mapost epaSoshomidhiya).]</p>
                  <p><strong>Examples of NoSQL types:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Document Stores:</strong> Data is stored in "documents" (like a JSON file, which is a way to write structured text). Example: MongoDB. Imagine each student's record is a complete document with all their details, even if some students have extra details others don't. <span className="italic text-indigo-500 dark:text-indigo-300">[Data rinochengetwa mu "magwaro". Funga kuti rekodhi remudzidzi wega wega igwaro rakazara nezvese zvaari.]</span></li>
                    <li><strong>Key-Value Stores:</strong> Simplest type. Data is stored as a "key" (like a name or ID) and a "value" (the information). Example: Redis. Like a dictionary: Key = "Student1_Name", Value = "Tendai". <span className="italic text-indigo-500 dark:text-indigo-300">[Data rinochengetwa se "kiyi" ne "vhariyu". Senge duramazwi.]</span></li>
                    <li><strong>Graph Databases:</strong> Great for showing relationships between things. Example: Neo4j. Excellent for social networks ("Tafadzwa is friends with Rudo," "Rudo likes this page"). <span className="italic text-indigo-500 dark:text-indigo-300">[Dzakanakira kuratidza hukama pakati pezvinhu. Senge pasocial network.]</span></li>
                  </ul>
                </>
              )}

              {renderCard(
                'Database Technologies',
                <Server size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mapurogiramu Anoshandisa Mamodels Aya]</p>
                  <p>These are the actual software tools that use the models above to manage databases.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Table size={16} /> Relational Database Management Systems (RDBMS)</h4>
                  <p>Software for relational (table-based) databases.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mapurogiramu emadatabase anoshandisa matafura.]</p>
                  <p><strong>Popular ones:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>MySQL:</strong> Very popular, free (open-source), often used for websites.</li>
                    <li><strong>Oracle Database:</strong> Very powerful, used by big companies, often costs money.</li>
                    <li><strong>Microsoft SQL Server:</strong> Popular with Windows, used by many businesses.</li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Cloud size={16} /> NoSQL Databases</h4>
                  <p>Software for NoSQL models.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Mapurogiramu emadatabase asiri erelational.]</p>
                  <p><strong>Popular ones:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>MongoDB:</strong> (Document store) Flexible, good for growing data.</li>
                    <li><strong>Cassandra:</strong> (Wide-column store, another NoSQL type) Good for huge data spread across many computers, very reliable.</li>
                    <li><strong>Redis:</strong> (Key-value store) Very fast, often used for caching (keeping frequently used data ready for quick access).</li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Cloud size={16} /> Cloud-Based Databases</h4>
                  <p>Databases that are hosted on the internet by big companies like Amazon (AWS), Microsoft (Azure), or Google (Google Cloud).</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase anochengetwa paindaneti nemakambani makuru seAmazon, Microsoft, kana Google.]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You don't have to buy your own servers; you rent space and power from them.</li>
                    <li>They can grow easily if you need more storage ("scalable"). You pay for what you use.</li>
                    <li><strong>Examples:</strong> Amazon DynamoDB, Google Cloud Bigtable, Azure Cosmos DB.</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 3: DESIGNING AND IMPLEMENTING A RELATIONAL DATABASE
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['design'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="3">Topic 5: Designing and Implementing a Relational Database System</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Kugadzira Nekuisa Relational Database System]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Let's say your school wants to create a new database for student information using the relational model (tables). Here's how they might do it, step-by-step:
                  </p>
</div>

              {renderCard(
                'The Process',
                <Target size={16} />,
                <>
                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><FileText size={16} /> Define Requirements and Scope</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Tsanangura Zvinodiwa neZvichaitwa]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Understand the Purpose:</strong> Why do we need this database? To store student names, addresses, parent contacts, grades, attendance, fees paid. Who will use it? Teachers, secretary, headmaster, maybe parents online. What problems will it solve? Make it easier to find student info, track fees, generate reports. <span className="italic text-indigo-500 dark:text-indigo-300">[Nzwisisa chinangwa: Tiri kuda database iri kuti iite sei? Ichachengeta mashoko api? Ndiani achaishandisa?]</span></li>
                    <li><strong>Data Gathering and Analysis:</strong> What specific information do we need? Entities (main things): Students, Teachers, Subjects, Exams. Attributes (details for each entity): Student: StudentID, FirstName, LastName, DateOfBirth, Address, Parent_Contact. Subject: SubjectID, SubjectName. Relationships: How are these linked? A Student takes many Subjects. A Teacher teaches many Subjects. <span className="italic text-indigo-500 dark:text-indigo-300">[Unganidza mashoko: Ndeapi "zvinhu" zvikuru (maEntities) seVadzidzi, Vadzidzisi? Ndeapi "mashoko" ezvinhu izvi (maAttributes) seZita, Kero?]</span></li>
                    <li><strong>Defining User Needs:</strong> What will users do? Secretary needs to add new students. Teachers need to enter marks. Headmaster needs to see reports on pass rates. <span className="italic text-indigo-500 dark:text-indigo-300">[Zvinodiwa nevashandisi: Vachada kuitei nedatabase? Semuenzaniso, mabharani anoda kupinza vadzidzi vatsva.]</span></li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Link size={16} /> Entity-Relationship Modeling (ERM)</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kugadzira Mufananidzo weHukama]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Visualize Relationships:</strong> Create an Entity-Relationship Diagram (ERD). This is a drawing that shows the entities (like boxes) and how they are connected (lines). It helps you see the structure clearly. <span className="italic text-indigo-500 dark:text-indigo-300">[Gadzira mufananidzo (ERD) unoratidza maEntities nehukama huri pakati pawo. Zvakafanana nekudhirowa purani.]</span></li>
                    <li><strong>Cardinalities:</strong> Define how many items relate. One-to-One: One student has one student ID. One-to-Many: One teacher teaches many students. One student can have many exam results (for different subjects). Many-to-Many: Many students can enroll in many subjects. (This usually needs an extra table in between, like an "Enrollment" table). <span className="italic text-indigo-500 dark:text-indigo-300">[Tsanangura hukama: Mumwe-kune-mumwe (mudzidzi mumwe ane ID imwe). Mumwe-kune-vakawanda (mudzidzisi mumwe anodzidzisa vadzidzi vakawanda).]</span></li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Layout size={16} /> Database Design</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kunyatsogadzira Chimiro cheDatabase]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Normalization (Kuchenesa neKururamisa Chimiro):</strong> This is a set of rules to make your tables efficient, reduce repeated data (redundancy), and make sure data is consistent. Think of it as organizing your kitchen cupboards very neatly. <span className="italic text-indigo-500 dark:text-indigo-300">[Iyi imitemo yekuita kuti matafura ako ashande zvakanaka, aderedze kudzokorora data, uye aone kuti data rakarurama. Zvakafanana nekurongedza makabati ekubikira zvakanyatsonaka.]</span></li>
                    <li><strong>Table Design:</strong> Based on your ERD and normalization, decide: Table names (e.g., Students, Subjects, ExamResults). Columns for each table (e.g., for Students: StudentID, FirstName, LastName, DOB). Data types for each column (e.g., StudentID is a Number, FirstName is Text, DOB is a Date).</li>
                    <li><strong>Primary Key (Chitupa Chikuru):</strong> One column (or a few) in each table that uniquely identifies each row. Like a student's ID number – no two students have the same ID. <span className="italic text-indigo-500 dark:text-indigo-300">[Primary Key: Column inoita kuti mutsara wega wega uve wakasiyana nevamwe, seID yemudzidzi.]</span></li>
                    <li><strong>Foreign Keys (Zvitupa zveKubatanidza):</strong> These link tables together. A foreign key in one table is the primary key from another table. <span className="italic text-indigo-500 dark:text-indigo-300">[Foreign Keys: Izvi zvinobatanidza matafura. IPrimary Key yetafura imwe inoiswa mune imwe tafura kuti dzibatanidzwe.]</span></li>
                  </ul>
                  <p><strong>Example:</strong> In the ExamResults table, you'd have StudentID (which is the primary key from the Students table) and SubjectID (primary key from Subjects table). This links an exam result to a specific student and a specific subject.</p>
                  <p>This ensures "referential integrity" – meaning you can't have an exam result for a student who doesn't exist in the Students table.</p>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><Server size={16} /> Implementation</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuvaka Database Racho]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Choose a DBMS:</strong> Select a software like MySQL, PostgreSQL (another good free one), or Microsoft SQL Server. <span className="italic text-indigo-500 dark:text-indigo-300">[Sarudza purogiramu yeDBMS seMySQL kana PostgreSQL.]</span></li>
                    <li><strong>Create the Database:</strong> Use the DBMS to actually create the tables, columns, set data types, define primary keys, and foreign keys, all according to your design. <span className="italic text-indigo-500 dark:text-indigo-300">[Shandisa DBMS kugadzira matafura, macolumns, nezvimwe zvawakaronga.]</span></li>
                    <li><strong>Data Seeding (Kupinza Data Rekutanga - kana zvichidiwa):</strong> Put some sample data in for testing. <span className="italic text-indigo-500 dark:text-indigo-300">[Isa data shoma rekuyedza naro.]</span></li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><CheckCircle size={16} /> Testing and Deployment</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuyedza neKuisa Kuti Rishande]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Testing and Validation:</strong> Test everything! Can you add a new student? Can you find a student? Can you update marks? Are there errors? <span className="italic text-indigo-500 dark:text-indigo-300">[Yedza zvese! Unokwanisa here kupinza mudzidzi mutsva? Unokwanisa here kutsvaga mudzidzi? Hapana zvikanganiso here?]</span></li>
                    <li><strong>Deployment:</strong> Make the database live so users can start using it. <span className="italic text-indigo-500 dark:text-indigo-300">[Isa database kuti ritange kushandiswa nevanhu.]</span></li>
                    <li><strong>Security Measures:</strong> Set up passwords, user permissions (who can see/do what). <span className="italic text-indigo-500 dark:text-indigo-300">[Isa mapassword nemvumo dzevashandisi.]</span></li>
                  </ul>

                  <h4 className="text-sm font-semibold mt-3 flex items-center gap-2"><RefreshCw size={16} /> Maintenance and Monitoring</h4>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuchengetedza neKutarisa Mashandiro]</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Regular Backups:</strong> Make copies of the data often! (e.g., every night). If magetsi anokachidzwa (power fluctuations) and the server crashes, you need a backup. <span className="italic text-indigo-500 dark:text-indigo-300">[Ita makopi edata nguva nenguva! Kana magetsi akakonzera dambudziko, unoda backup.]</span></li>
                    <li><strong>Performance Monitoring:</strong> Check if it's running fast enough. If searches are slow, maybe you need to optimize. <span className="italic text-indigo-500 dark:text-indigo-300">[Tarisa kana riri kushanda nekukurumidza.]</span></li>
                    <li><strong>Updates and Maintenance:</strong> As needs change, you might need to add new tables or columns, or change things. <span className="italic text-indigo-500 dark:text-indigo-300">[Kana zvinodiwa zvikachinja, ungada kuwedzera kana kuchinja zvimwe zvinhu.]</span></li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 4: OPERATIONS PERFORMED ON A DATABASE
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['operations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="4">Topic 6: Operations Performed on a Database</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Mabasa Anoitiwa paDatabase]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    There are four main things you do with data in a database. We use the acronym CRUD:
                  </p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kune mabasa mana makuru aunoita nedata mudatabase. Tinoshandisa chidimikira chinonzi CRUD.]</p>
</div>

              {renderCard(
                'C - Create',
                <PlusCircle size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kugadzira/Kupinza Zvitsva]</p>
                  <p>This means adding new data into the database.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinoreva kupinza data idzva mudatabase.]</p>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Adding a new student to the school register.</li>
                    <li>A shop like Spar adding a new type of bread to their product list.</li>
                    <li>You signing up for a new Facebook account (your details are created in their database).</li>
                  </ul>
                </>
              )}

              {renderCard(
                'R - Read',
                <SearchIcon size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuverenga/Kutsvaga Zviripo]</p>
                  <p>This means getting or looking at existing data from the database. You are not changing it, just viewing it.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinoreva kutora kana kutarisa data ratovepo mudatabase. Hausi kuchinja, uri kungoona.]</p>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A teacher looking up a student's contact number.</li>
                    <li>You checking your bank balance on an ATM or banking app.</li>
                    <li>Searching for sadza places near you on a food delivery app.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'U - Update',
                <Edit size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kugadzirisa/Kuchinja Zviripo]</p>
                  <p>This means changing or modifying existing data in the database.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinoreva kuchinja data ratovepo mudatabase.]</p>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Changing a student's home address because they moved.</li>
                    <li>A shop changing the price of sugar.</li>
                    <li>You changing your profile picture on WhatsApp.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'D - Delete',
                <Trash2 size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kudzima/Kubvisa]</p>
                  <p>This means removing data from the database.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinoreva kubvisa data kubva mudatabase.]</p>
                  <p><strong>Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Removing a student who has left the school from the register.</li>
                    <li>A shop removing a product they no longer sell.</li>
                    <li>You deleting an old email.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Beyond CRUD',
                <MoreHorizontal size={16} />,
                <>
                  <p>These CRUD operations are the basic building blocks. Most DBMS also let you do more, like:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Data Sorting and Filtering:</strong> Sorting: Arranging data in order (e.g., list students alphabetically by surname, or by highest exam mark). <span className="italic text-indigo-500 dark:text-indigo-300">[Kuronga data zvakatevedzana (semuenzaniso, vadzidzisi nemazita avo, kana nemamakisi avo).]</span> Filtering: Showing only data that meets certain conditions (e.g., show only students in Form 1, or only products under $5). <span className="italic text-indigo-500 dark:text-indigo-300">[Kuratidza data chete rinoenderana nemamiriro ezvinhu (semuenzaniso, vadzidzi veForm 1 chete).]</span></li>
                    <li><strong>Data Aggregation:</strong> Doing calculations on groups of data (e.g., find the average exam mark for a class, count how many students live in Mbare, find the total sales for bread today). <span className="italic text-indigo-500 dark:text-indigo-300">[Kuita masvomhu pamapoka edata (semuenzaniso, kuwana avhareji yemakisi ekirasi).]</span></li>
                    <li><strong>Data Joins:</strong> Combining data from two or more related tables to get a complete picture. <span className="italic text-indigo-500 dark:text-indigo-300">[Kubatanidza data kubva kumatafura maviri kana anopfuura kuti uwane mufananidzo wakakwana.]</span> <strong>Example:</strong> To get a report showing "Student Name, Subject Name, Mark," you need to join the Students table (for name), Subjects table (for subject name), and ExamResults table (for mark).</li>
                  </ul>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 5: NOVEL SOLUTIONS TO PRACTICAL DATA MANAGEMENT CHALLENGES
                ============================================================== */}
            <div
              ref={(el) => { sectionRefs.current['novel'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <SectionTitle number="5">Topic 7: Novel Solutions to Practical Data Management Challenges</SectionTitle>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="italic text-indigo-500 dark:text-indigo-300">[Mhinduro Itsva kuMatambudziko eKutarisira Data neZvishandiso Zvemazuva Ano]</span>
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    Organizations today face big challenges with data because there's so much of it, and it comes in many types! Here are some modern ways to solve these problems:
                  </p>
</div>

              {renderCard(
                'Challenge 1: Managing Diverse Data Sources',
                <Layers size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kutarisira Data Rinobva Kwakasiyana-siyana]</p>
                  <p><strong>Problem:</strong> A company might have customer info in a relational database (tables), product reviews as text documents, and website click data from a NoSQL database. How do you use all this together?</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Dambudziko: Kambani ingave nemashoko evatengi mudatabase rematafura, maonero ezvigadzirwa mumagwaro, uye data rewebsite mune imwe NoSQL database. Zvinoshandiswa sei zvese pamwechete?]</p>
                  <p><strong>Solution: Polyglot Persistence</strong> <span className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa Mhando Dzakatasiyana dzeDatabase Pamwechete]</span></p>
                  <p>This means using different types of databases for different types of data, but having a way for them to work together.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Zvinoreva kushandisa mhando dzakasiyana dzemadatabase kune mhando dzakasiyana dzedata, asi kuva nenzira yekuti dzishande pamwechete.]</p>
                  <p>You might have a special software layer that can talk to all these different databases, so your application thinks it's talking to one system.</p>
                  <p><strong>Example:</strong> A large online shop in Zimbabwe might use a relational database for orders and payments, a document database for product descriptions and images, and a graph database for customer recommendations ("people who bought this also bought...").</p>
                </>
              )}

              {renderCard(
                'Challenge 2: Real-Time Data Analytics',
                <Zap size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuongorora Data Pakarepo]</p>
                  <p><strong>Problem:</strong> Businesses want to see what's happening right now. For example, a delivery company like "Cassava On Demand" wants to see where all its drivers are in real-time, or an online news site like "Bulawayo24" wants to see which articles are most popular this very minute.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Dambudziko: Makambani anoda kuona zviri kuitika PAKAREPO. Semuenzaniso, kambani yekuendesa zvinhu inoda kuona kuti vatyairi vayo varipi panguva iyoyo chaiyo.]</p>
                  <p><strong>Solution: In-Memory Databases</strong> <span className="italic text-indigo-500 dark:text-indigo-300">[Madatabase Anoshanda muMemory yeKombiyuta]</span></p>
                  <p>These databases keep data in the computer's fast memory (RAM) instead of slower hard drives. This makes getting data super-fast.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase aya anochengeta data mumemory inokurumidza yekombiyuta (RAM) panzvimbo pemahard drive anononoka. Izvi zvinoita kuti kutora data kukurumidze zvikuru.]</p>
                  <p><strong>Example:</strong> Redis or Memcached are often used. An application showing live scores for a Dynamos vs. Highlanders football match would use this to update scores instantly for everyone.</p>
                </>
              )}

              {renderCard(
                'Challenge 3: Scalability and Performance Bottlenecks',
                <TrendingUp size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kukura kweData neKunonoka kweSystem]</p>
                  <p><strong>Problem:</strong> As a business grows (e.g., a small online shop gets thousands of new customers), its database might get slow or run out of space.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Dambudziko: Bhizinesi parinokura, database raro rinogona kunonoka kana kupera nzvimbo.]</p>
                  <p><strong>Solution: Cloud-Based Databases</strong> <span className="italic text-indigo-500 dark:text-indigo-300">[Madatabase epaIndaneti]</span></p>
                  <p>Using databases offered by cloud providers (AWS, Azure, Google Cloud). These can automatically grow bigger (scale up) when you need more power or storage, and shrink when you don't.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kushandisa madatabase anopiwa nemakambani emakore (AWS, Azure, Google Cloud). Anogona kukura otomatiki paunoda simba rakawanda kana nzvimbo.]</p>
                  <p><strong>Example:</strong> A Zimbabwean startup creating a popular new app can start with a small cloud database and easily make it bigger as more people sign up, without buying new servers themselves.</p>
                </>
              )}

              {renderCard(
                'Challenge 4: Data Security and Governance',
                <Shield size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kuchengetedzwa kweData neKutonga Kwaro]</p>
                  <p><strong>Problem:</strong> How to make sure data is safe, not tampered with, and that only the right people see it. This is very important for things like bank records or medical information.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Dambudziko: Kuona sei kuti data rakachengeteka, harina kuchinjwa zvisiri pamutemo, uye kuti vanhu vakarurama chete ndivo vanoriona.]</p>
                  <p><strong>Solution: Blockchain Technology</strong> <span className="italic text-indigo-500 dark:text-indigo-300">[Tekinoroji yeBlockchain]</span></p>
                  <p>Blockchain (the technology behind Bitcoin, but can be used for other things) can create a very secure and unchangeable record of who did what to the data and when.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Blockchain inogona kugadzira rekodhi rakachengeteka zvikuru risingachinjike rekuti ndiani akaita chii kudata uye rini.]</p>
                  <p><strong>Example:</strong> For tracking where food comes from (e.g., ensuring beef sold in a supermarket really came from a specific farm in Zimbabwe and passed all health checks), or for very secure voting systems.</p>
                </>
              )}

              {renderCard(
                'Challenge 5: Simplifying Data Modeling for Complex Relationships',
                <Link size={16} />,
                <>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Kurerutsa Kugadzira Model yeData rine Hukama Hwakaoma]</p>
                  <p><strong>Problem:</strong> Some data has very complex connections. For example, on Facebook: you are friends with many people, who are friends with other people, you like pages, you are in groups, etc. A traditional relational database can struggle to show these many-to-many links easily and quickly.</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Dambudziko: Mamwe data ane hukama hwakaoma kunzwisisa. Semuenzaniso, paFacebook: une shamwari dzakawanda, dzinova shamwari dzevamwe vanhu, unofarira mapeji, uri mumapoka, nezvimwewo.]</p>
                  <p><strong>Solution: Graph Databases</strong> <span className="italic text-indigo-500 dark:text-indigo-300">[Madatabase eGraph]</span></p>
                  <p>These databases are specially designed to store data as "nodes" (things, like people or pages) and "edges" (the relationships between them, like "friends with" or "likes").</p>
                  <p className="italic text-indigo-500 dark:text-indigo-300">[Madatabase aya akagadzirirwa kuchengeta data se "manodhi" (zvinhu) ne "miedges" (hukama pakati pazvo).]</p>
                  <p>They are very good at quickly finding paths and connections in complex networks.</p>
                  <p><strong>Example:</strong> Besides social networks, they are used for recommendation engines ("people who liked this song also liked these other songs") or fraud detection (finding suspicious links between accounts).</p>
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
                  <span>Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Database Models</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>CRUD Operations</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 text-sm">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A database system comprises hardware, software, data, people, and procedures working together. Database models (relational, hierarchical, network, object-oriented, NoSQL) define data structure. Designing a relational database involves requirements gathering, ER modeling, normalization, table design, and implementation. CRUD (Create, Read, Update, Delete) are the core operations. Modern solutions like polyglot persistence, in-memory databases, cloud databases, blockchain, and graph databases address complex data challenges.
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
                <strong className="text-white">Database System Components</strong> – Hardware, software (DBMS, OS, applications), data, people (DBAs, designers, analysts, users), and procedures (security, backup, access control) work together as a unified system.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database Models</strong> – Relational (tables), hierarchical (tree), network (many-to-many), object-oriented (objects with methods), and NoSQL (document, key-value, graph) each suit different data and use cases.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Design &amp; Implementation</strong> – Steps: define requirements, create ER model, normalize, design tables with primary/foreign keys, choose a DBMS, implement, test, deploy, and maintain with regular backups and monitoring.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">CRUD Operations</strong> – Create (insert), Read (query), Update (modify), Delete (remove) are the four essential data operations; databases also support sorting, filtering, aggregation, and joins.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Novel Solutions</strong> – Polyglot persistence (multiple DB types), in-memory databases (speed), cloud databases (scalability), blockchain (security), and graph databases (complex relationships) address modern data management challenges.
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
            Sidemann Academic Registry • Database Systems, Models &amp; Operations Mastery 2.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;