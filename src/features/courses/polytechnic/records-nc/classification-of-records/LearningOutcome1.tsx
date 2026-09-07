import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Scroll,
  Book,
  Globe2,
  Landmark,
  Building2,
  Shield,
  ClipboardList,
  Database,
  Archive,
  FileText,
  Library,
  Network,
  TrendingUp,
  ShieldAlert,
  FolderTree,
  Target,
  Layers,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  File,
  CheckCircle,
  RefreshCw,
  Users,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'ancient', label: 'Ancient Cultures' },
  { id: 'printing', label: 'Printing Invention' },
  { id: 'earlymodern', label: 'Early Modern & Industrial' },
  { id: 'concepts', label: 'RM, IM, AM Concepts' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'formats', label: 'Records Formats' },
  { id: 'significance', label: 'Significance' },
  { id: 'functions', label: 'RM Functions' },
  { id: 'lifecycle', label: 'Life Cycle' },
  { id: 'continuum', label: 'Continuum Concept' },
  { id: 'respect', label: 'Respect des Fonds' },
  { id: 'infocycle', label: 'Information Cycle' },
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
        text: 'The earliest known records date back to ancient Mesopotamia around 3400 BCE, using cuneiform script on clay tablets for administrative and commercial purposes.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding the history of records helps us appreciate the evolution of information management and anticipate future trends in digital preservation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four ancient cultures with the acronym "E-G-R-C": Egypt, Greece, Rome, China.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse records management with archives management. Records management covers the entire lifecycle, while archives management focuses on long-term preservation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The earliest known records date back to ancient Mesopotamia around 3400 BCE, using cuneiform script on clay tablets for administrative and commercial purposes.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding the history of records helps us appreciate the evolution of information management and anticipate future trends in digital preservation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four ancient cultures with the acronym "E-G-R-C": Egypt, Greece, Rome, China.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse records management with archives management. Records management covers the entire lifecycle, while archives management focuses on long-term preservation.',
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
            <Scroll size={14} className="inline mr-1" /> RECORDS &amp; INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            History of Records &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Information Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to the history of records in ancient cultures, the invention of printing, records management concepts, characteristics of records, formats, and the information life cycle.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Landmark size={14} className="inline mr-1" /> Ancient Cultures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Book size={14} className="inline mr-1" /> Printing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Records Management
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
                placeholder="Search for a concept, culture, term..."
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
            {/* SECTION 1: History of Records in Ancient Cultures */}
            <div
              ref={(el) => {
                sectionRefs.current['ancient'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                History of Records in Ancient Cultures: Egypt, Greece, Rome, China
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Tracing the history of records in ancient cultures reveals fascinating insights into how societies managed information, maintained order, and preserved their legacies.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ancient Egypt',
                    icon: <Landmark size={16} />,
                    content: (
                      <>
                        <p>Ancient Egyptians developed a sophisticated system of record-keeping, primarily using hieroglyphs, a pictorial writing system. Initially, these hieroglyphs were carved onto stone monuments and temple walls, used for monumental inscriptions, religious texts, and royal decrees. However, the invention of papyrus, a paper-like material made from the papyrus plant, revolutionised record-keeping. Papyrus was lightweight, portable, and relatively inexpensive, making it ideal for everyday records. Scribes, highly trained professionals, used reed pens and ink to write on papyrus scrolls. They meticulously recorded everything from administrative documents, such as tax records and land surveys, to literary works, scientific treatises, and personal letters. The Nile River's annual floods necessitated precise land surveys, making accurate records crucial for agriculture and taxation. Temple records documented religious rituals, offerings, and the lives of the pharaohs. The preservation of these records in the dry Egyptian climate has provided invaluable insights into their civilisation. Egyptian record keeping was very centralised, often controlled by the state, or the temples. This centralisation helped to maintain a stable society.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Ancient Greece',
                    icon: <Building2 size={16} />,
                    content: (
                      <>
                        <p>Ancient Greeks initially relied on oral tradition to preserve their history and literature. However, as their society became more complex, they developed various methods of record-keeping. One early form was ostracism, where citizens would write the names of individuals they wished to exile on broken pottery shards (ostraca). This practice served as a form of public record and political expression. The Greeks also used wooden tables covered in wax for everyday writing and record-keeping. As their city-states grew, they established public archives to store important documents, such as laws, treaties, and financial records. The development of the Greek alphabet, derived from the Phoenician alphabet, made writing more accessible and efficient. Libraries, such as the famous Library of Alexandria, housed vast collections of scrolls, preserving Greek literature and knowledge. The Greeks were also very good at record keeping related to their democratic systems. Public records of laws, and public votes were very important.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Ancient Rome',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Ancient Romans were meticulous record-keepers, recognising the importance of documentation for governance and administration. They used various writing materials, including wax tablets, papyrus scrolls, and later, parchment. Wax tablets were commonly used for everyday records, such as accounts, letters, and legal documents. Papyrus scrolls were used for more formal documents, such as literary works and legal texts. The Romans established extensive public archives, known as tabularium, to store official records, including laws, treaties, census data, and land surveys. The Roman Empire's vast bureaucracy required efficient record-keeping systems to manage its territories and populations. The development of Roman law, which emphasised written contracts and legal documents, further underscored the importance of record-keeping. The Romans also kept very detailed military records, and records of the distributions of food to the populace. The sheer size of the roman empire required a very organised records system.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Ancient China',
                    icon: <Globe2 size={16} />,
                    content: (
                      <>
                        <p>Ancient Chinese civilisation developed a unique system of record-keeping, using various materials and techniques. One of the earliest forms was oracle bone script, where inscriptions were carved onto animal bones or tortoise shells for divination purposes. As writing evolved, bamboo slips and silk scrolls became the primary writing materials. Bamboo slips, tied together with string, were used for official documents, philosophical texts, and historical records. Silk scrolls, although more expensive, were used for important literary and artistic works. The invention of paper during the Han dynasty revolutionised record-keeping in China, making writing more accessible and affordable. The Chinese developed sophisticated systems for archiving and managing official records, including imperial libraries and historical bureaus. The Chinese also had a very advanced civil service system, which required detailed records of the officials, and their performance. The Chinese also kept detailed astronomical records.</p>
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

            {/* SECTION 2: Events Leading to Invention of Printing */}
            <div
              ref={(el) => {
                sectionRefs.current['printing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Events That Led to The Invention of Printing, Printed Books and Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Early Forms of Writing and Record-Keeping',
                    icon: <FileText size={16} />,
                    content: 'Before printing, the preservation and transmission of knowledge relied heavily on handwritten manuscripts. Ancient civilisations, such as the Egyptians with papyrus and hieroglyphs, and the Romans with wax tablets and scrolls, developed sophisticated systems for record-keeping. However, these methods were laborious, time-consuming, and prone to errors. Scribes, highly skilled individuals, meticulously copied texts by hand, a process that was slow and expensive. The demand for written materials, particularly in religious and scholarly circles, exceeded the capacity of these manual methods. The need for a more efficient way to reproduce written information became increasingly apparent. Early forms of writing, from cuneiform to hieroglyphs, laid the foundations for the later development of more standardised alphabets, which in turn made writing more accessible and efficient.',
                  },
                  {
                    title: '2. The Development of Paper in China',
                    icon: <File size={16} />,
                    content: 'A crucial precursor to printing was the invention of paper in China during the Han dynasty (206 BCE – 220 CE). Traditionally attributed to Cai Lun, paper was made from readily available materials such as rags, bark, and fishing nets. This innovation made writing significantly cheaper and more accessible than previous methods, such as using silk or bamboo slips. The spread of paper technology along the Silk Road to the Middle East and eventually to Europe created the necessary material foundation for the development of printing. The availability of paper allowed for the creation of more and longer books, and also allowed for the creation of more copies of documents. This helped to increase literacy, and the spread of knowledge.',
                  },
                  {
                    title: '3. Block Printing in East Asia',
                    icon: <Book size={16} />,
                    content: 'The first form of printing was block printing, also originating in China. This technique involved carving text onto wooden blocks, inking the blocks, and pressing them onto paper. The earliest known printed text is the Diamond Sutra, a Buddhist scripture printed in China during the Tang dynasty (618–907 CE). Block printing spread to other East Asian countries, including Korea and Japan, where it was used to produce Buddhist scriptures, calendars, and playing cards. While block printing was more efficient than hand copying, it was still a labour-intensive process, as each page required a separate carved block. However, it marked a significant step towards the mass production of written materials.',
                  },
                  {
                    title: '4. The Development of the Printing Press in Europe',
                    icon: <BookOpen size={16} />,
                    content: 'The pivotal moment in the history of printing came with the invention of the printing press by Johannes Gutenberg in Germany during the mid-15th century. Gutenberg\'s innovation combined several key elements: movable type, a press, and oil-based ink. Movable type, individual metal characters that could be rearranged to form different words and sentences, allowed for the efficient production of multiple copies of a text. Gutenberg\'s printing press, inspired by wine presses, applied pressure to transfer ink from the type to paper. The use of oil-based ink produced clearer and more durable prints. Gutenberg\'s most famous work, the Gutenberg Bible, demonstrated the transformative potential of this new technology.',
                  },
                  {
                    title: '5. The Spread of Printing and the Rise of Printed Books',
                    icon: <BookOpenIcon size={16} />,
                    content: 'Following Gutenberg\'s invention, printing spread rapidly throughout Europe. Printing presses were established in major cities, and the production of printed books increased exponentially. The availability of printed books fuelled the Renaissance, the Reformation, and the Scientific Revolution, as knowledge became more widely accessible. The printing press also played a crucial role in the standardisation of languages and the dissemination of new ideas. The rise of printed books had a profound impact on literacy rates, education, and the development of modern society. Printed materials also helped to spur the creation of more records, as governments, and businesses began to keep more detailed, and standardised records.',
                  },
                  {
                    title: '6. The Impact on Records and Information Management',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p>The invention of printing revolutionised records and information management. Printed books and documents became more readily available, standardised, and reliable. This facilitated the creation and dissemination of official records, legal documents, and scientific findings. The printing press also contributed to the development of libraries and archives, as institutions sought to collect and preserve the growing volume of printed materials. The ability to produce multiple copies of records helped to ensure their preservation and accessibility. Printing also helped to standardise record keeping practices, as printed forms, and templates, became more common.</p>
                        <p className="mt-2 font-medium">The invention of printing was a watershed moment in human history, marking the transition from a world of handwritten manuscripts to a world of mass-produced books and records. This innovation transformed the way information was created, disseminated, and preserved, laying the foundation for the modern information age.</p>
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

            {/* SECTION 3: Development of Early Modern Records and The Industrial Revolution */}
            <div
              ref={(el) => {
                sectionRefs.current['earlymodern'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Development of Early Modern Records and The Industrial Revolution
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Early Modern Records',
                    icon: <Building2 size={16} />,
                    content: 'The early modern period (roughly 16th-18th centuries) witnessed a significant shift towards centralised states and expanding bureaucracies. Monarchs and governments sought to consolidate power, manage larger territories, and implement more efficient administrative systems. This required the creation and maintenance of vast amounts of records, including tax registers, land surveys, legal documents, and military records. The growth of trade and commerce also led to an increase in commercial records, such as ledgers, contracts, and shipping manifests. The rise of universities and scientific societies further contributed to the production of scholarly and scientific records. Record-keeping practices became more standardised, with the development of formal archives and record offices.',
                  },
                  {
                    title: '2. The Impact of the Enlightenment',
                    icon: <BookOpen size={16} />,
                    content: 'The Enlightenment, a period of intellectual and philosophical ferment, emphasised reason, rationality, and the importance of knowledge. This had a profound impact on record-keeping, as governments and institutions began to recognise the value of accurate and reliable information. The Enlightenment also promoted the idea of public access to information, leading to the establishment of public libraries and archives. The emphasis on empirical observation and scientific inquiry led to the development of more systematic methods of data collection and analysis. This included the use of statistical methods and the creation of standardised forms for recording data. The Enlightenment also fostered a culture of record-keeping, as individuals and organisations began to recognise the importance of preserving and documenting their activities.',
                  },
                  {
                    title: '3. The Industrial Revolution',
                    icon: <TrendingUp size={16} />,
                    content: 'The Industrial Revolution (roughly 18th-19th centuries) brought about a radical transformation in the production and management of records. The mechanisation of printing, with the development of steam-powered presses, allowed for the mass production of printed materials, including forms, ledgers, and official documents. This dramatically increased the volume of records and made them more widely available. The standardisation of production processes led to the development of standardised forms and record-keeping systems. This ensured consistency and efficiency in data collection and analysis. The growth of factories and industrial enterprises led to the creation of new types of records, such as production records, employee records, and inventory records.',
                  },
                  {
                    title: '4. Mass Production of Forms',
                    icon: <ClipboardList size={16} />,
                    content: 'The mass production of forms became a hallmark of the Industrial Revolution, enabling organisations to collect and process large amounts of data efficiently. Standardised forms were used for everything from census data and tax returns to factory production records and employee applications. This standardisation allowed for the easy comparison and analysis of data, facilitating decision-making and control. The use of forms also helped to ensure consistency and accuracy in record-keeping, reducing the risk of errors and fraud. Forms also allowed for less skilled workers to record information, and for that information to be more easily processed by other workers.',
                  },
                  {
                    title: '5. The Rise of Bureaucracy and Administrative Systems',
                    icon: <Network size={16} />,
                    content: 'The Industrial Revolution accelerated the growth of bureaucracies and administrative systems, both in government and in private enterprises. The need to manage large-scale operations and complex organisations required the development of sophisticated record-keeping systems. The rise of the modern corporation, with its complex organisational structure, further emphasised the importance of efficient record-keeping. The development of accounting systems and financial records became essential for managing the finances of large corporations. The growth of the welfare state and the expansion of social programs led to the creation of vast amounts of government records.',
                  },
                  {
                    title: '6. The Development of Filing Systems and Archives',
                    icon: <Archive size={16} />,
                    content: 'The increasing volume of records necessitated the development of more efficient filing systems and archives. The development of card catalogues and filing cabinets allowed for the organised storage and retrieval of records. The establishment of national archives and record offices ensured the preservation of important historical documents. The development of indexing and classification systems further facilitated the management of large collections of records. The development of filing systems also helped to ensure that records were accessible and usable.',
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

            {/* SECTION 4: Records Management, Information Management, Archives Management */}
            <div
              ref={(el) => {
                sectionRefs.current['concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Management, Information Management, Archives Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Records Management',
                    icon: <ClipboardList size={16} />,
                    content: 'Records Management is the systematic control of records throughout their lifecycle, from creation or receipt to their final disposition. This encompasses developing and implementing policies, procedures, and systems to ensure that records are created, maintained, used, and disposed of in an efficient, economical, and legally compliant manner. It is about ensuring that the right information is available to the right people at the right time. Records management is not just about storing documents; it is about actively managing them to support an organisation\'s operations, legal obligations, and accountability. This includes setting up retention schedules, establishing security protocols, and designing retrieval systems.',
                  },
                  {
                    title: '2. Information Management',
                    icon: <Database size={16} />,
                    content: 'Information Management is a broader discipline that encompasses the planning, organising, controlling, and exploiting of information resources. It goes beyond just records to include all forms of information, regardless of format or medium. This includes data, knowledge, and intelligence, whether it is stored in databases, emails, websites, or even employee expertise. Information management focuses on how information is created, stored, retrieved, used, and shared to support an organisation\'s strategic goals. It involves developing information policies, designing information systems, and managing information technology. It also includes the processes for ensuring data quality, security, and accessibility.',
                  },
                  {
                    title: '3. Archives Management',
                    icon: <Archive size={16} />,
                    content: 'Archives Management focuses specifically on the long-term preservation and accessibility of records that have enduring historical or evidential value. These records, known as archives, are selected for permanent preservation because of their significance to an organisation or society. Archives management involves appraising records to determine their archival value, arranging and describing them for easy retrieval, and providing access to them for research and other purposes. It also includes ensuring the physical preservation of records, which may involve specialised storage conditions and conservation techniques. Archives management is about preserving the collective memory of an organisation or society and making it available for future generations.',
                  },
                  {
                    title: '4. Records',
                    icon: <FileText size={16} />,
                    content: 'Records are documented information created, received, and maintained as evidence by an organisation or person, in pursuance of legal obligations or in the transaction of business. They can be in any format, including paper documents, electronic files, emails, databases, and audio-visual materials. The key characteristic of a record is that it provides evidence of an activity or transaction. Records are distinct from other forms of information because they have a specific purpose and are retained for a defined period. They are created to document what has happened and are often used as evidence in legal proceedings. They are also used to support business decisions, and to ensure accountability.',
                  },
                  {
                    title: '5. Archives',
                    icon: <Library size={16} />,
                    content: 'Archives are records that have been selected for permanent preservation because of their enduring historical, administrative, legal, or fiscal value. They represent the collective memory of an organisation or society and provide evidence of past activities and decisions. Archives are typically managed by archives professionals who ensure their preservation and accessibility. They are often used for research, historical studies, and legal purposes. Archives are distinct from records that are kept for day-to-day business. They are records that have been determined to have long term value.',
                  },
                  {
                    title: '6. Information',
                    icon: <Network size={16} />,
                    content: 'Information is data that has been processed, organised, and presented in a meaningful context. It can be in any form, including text, numbers, images, and audio. Information is used to support decision-making, communication, and knowledge creation. It is the raw material that organisations use to operate. Information is distinct from data, which is raw, unprocessed facts. Information becomes valuable when it is organised and presented in a way that is useful to people.',
                  },
                  {
                    title: '7. Documents',
                    icon: <File size={16} />,
                    content: 'Documents are a specific type of record that contains information. They are typically written or printed materials, such as letters, reports, contracts, and forms. However, documents can also include electronic files, such as PDFs and word processing documents. Documents are used to communicate information, record transactions, and provide evidence. They are a tangible representation of information. Documents are a subset of records. Not all records are documents, but all documents are records.',
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

            {/* SECTION 5: Characteristics of Records */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Characteristics of Records
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Understanding the characteristics of records is fundamental to effective records management. These characteristics define what qualifies as a record and guide how they should be handled.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Content',
                    icon: <FileText size={16} />,
                    content: 'The content of a record refers to the information it contains. This is the core of the record, the actual data, facts, and statements that document an activity or transaction. The content must be meaningful and relevant to the business or administrative function it supports. It should provide sufficient detail to understand the context and purpose of the record. Content can vary widely, from simple transactional data to complex reports and analyses. The content should also be accurate and reliable. The content is what gives the record its value. Without meaningful content, a record is just an empty shell.',
                  },
                  {
                    title: '2. Context',
                    icon: <Layers size={16} />,
                    content: 'Context refers to the circumstances surrounding the creation, receipt, and use of a record. This includes information about who created the record, when it was created, and why. Understanding the context is crucial for interpreting the meaning and significance of a record. It provides the background information necessary to understand the record\'s relationship to other records and to the organisation\'s activities. Context helps establish the authenticity and reliability of a record. For instance, a financial transaction record is more meaningful when you know the date, time, and parties involved. Without context, the record can be ambiguous and difficult to interpret.',
                  },
                  {
                    title: '3. Structure',
                    icon: <ClipboardList size={16} />,
                    content: 'Structure refers to the physical or logical form of a record. This includes its format, organisation, and arrangement. Records can be structured in various ways, from simple text documents to complex databases and spreadsheets. The structure of a record affects its accessibility, usability, and preservation. A well-structured record is easier to retrieve, understand, and manage. For example, a database with clearly defined fields and relationships is more efficient than an disorganised collection of files. The structure also impacts how the record can be processed by computers, and how it can be searched.',
                  },
                  {
                    title: '4. Integrity',
                    icon: <Shield size={16} />,
                    content: 'Integrity refers to the completeness and accuracy of a record. A record with integrity is authentic and reliable, meaning it has not been altered or tampered with. Maintaining the integrity of records is essential for legal, financial, and operational purposes. It ensures that the information contained in the record can be trusted and relied upon. Integrity can be maintained through various measures, such as access controls, audit trails, and data validation techniques. For physical records, this might involve using tamper-evident seals or controlled storage environments. For digital records, it might involve digital signatures and checksums.',
                  },
                  {
                    title: '5. Authenticity',
                    icon: <ShieldAlert size={16} />,
                    content: 'Authenticity refers to the genuineness of a record. An authentic record is what it purports to be, meaning it was created by the person or entity it claims to be from. Establishing authenticity is crucial for legal and evidentiary purposes. It involves verifying the identity of the creator and ensuring that the record has not been forged or falsified. Authenticity can be established through various means, such as signatures, timestamps, and digital certificates. For digital records, this might include metadata that verifies the records source.',
                  },
                  {
                    title: '6. Reliability',
                    icon: <CheckCircle size={16} />,
                    content: 'Reliability refers to the trustworthiness of a record. A reliable record is one that can be depended upon to accurately reflect the activity or transaction it documents. It is created at or near the time of the event and by someone with direct knowledge of the event. Ensuring reliability involves establishing clear procedures for creating and maintaining records. Reliable records are essential for making informed decisions and ensuring accountability. This also includes ensuring that the hardware or software that created the records is reliable.',
                  },
                  {
                    title: '7. Usability',
                    icon: <Target size={16} />,
                    content: 'Usability refers to the ease with which a record can be accessed, retrieved, and used. A usable record is organised and structured in a way that facilitates efficient retrieval and analysis. Usability is essential for ensuring that records are readily available to those who need them. This might involve using indexing systems, metadata tagging, and search functionalities. Usability also includes ensuring that records are stored in formats that can be accessed by the required software or hardware.',
                  },
                  {
                    title: '8. Retention',
                    icon: <Clock size={16} />,
                    content: 'Retention refers to the length of time a record is kept. Records should be retained for the appropriate period, as determined by legal, regulatory, and business requirements. This involves establishing retention schedules that specify how long different types of records must be kept. Proper retention ensures that records are available when needed and that they are disposed of when they are no longer required. It also helps to minimise storage costs and reduce the risk of unauthorised access to sensitive information.',
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

            {/* SECTION 6: Different Records and Records Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['formats'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Different Records and Records Formats Used in Organisations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Paper-Based Records',
                    icon: <FileText size={16} />,
                    content: 'These are traditional records stored in physical form, such as documents, files, and printed materials. Despite the rise of digital technology, paper-based records remain prevalent in many organisations. They include contracts, legal documents, financial statements, employee files, and customer records. Paper records require physical storage space, which can become costly and inefficient as the volume of records grows. They are also susceptible to damage from fire, water, and other environmental factors. Retrieval of paper records can be time-consuming, requiring manual searches through filing cabinets and storage boxes.',
                  },
                  {
                    title: '2. Electronic Records',
                    icon: <Database size={16} />,
                    content: 'Electronic records are digital information stored on computers, servers, and other electronic devices. They encompass a wide range of formats, including documents, spreadsheets, databases, emails, images, audio files, and video files. Electronic records offer numerous advantages over paper-based records, such as ease of storage, retrieval, and sharing. They can be accessed from multiple locations, searched quickly, and backed up to prevent data loss. However, electronic records also present unique challenges, such as data security, compatibility issues, and the need for regular backups and data migration.',
                  },
                  {
                    title: '3. Database Records',
                    icon: <Database size={16} />,
                    content: 'Database records are structured data stored in a database management system (DBMS). They are used to manage large volumes of data, such as customer information, inventory data, and financial transactions. Databases allow for efficient data entry, retrieval, and analysis. They can be queried to generate reports and extract specific information. Database records are essential for organisations that rely on data-driven decision-making. Proper database design, data integrity checks, and access controls are crucial for managing database records effectively.',
                  },
                  {
                    title: '4. Email Records',
                    icon: <File size={16} />,
                    content: 'Email records are electronic messages sent and received through email systems. They contain valuable information related to business communications, transactions, and decisions. Email records can be used as evidence in legal proceedings and audits. Organisations must establish policies and procedures for managing email records, including retention schedules, archiving, and retrieval. Email records can be difficult to manage, due to the large volume of emails that are often generated.',
                  },
                  {
                    title: '5. Multimedia Records',
                    icon: <Library size={16} />,
                    content: 'Multimedia records include images, audio files, and video files. They are used to capture and store visual and auditory information. Multimedia records are becoming increasingly common in organisations, especially in marketing, training, and documentation. They can be used to create presentations, training videos, and marketing materials. Multimedia records can be large and require significant storage space. It is important to have procedures in place to manage multimedia records, including file naming conventions, metadata tagging, and storage policies.',
                  },
                  {
                    title: '6. Social Media Records',
                    icon: <Network size={16} />,
                    content: 'Social media records are content generated on social media platforms, such as Facebook, Twitter, and LinkedIn. They include posts, comments, messages, and other interactions. Social media records can provide valuable insights into customer opinions, market trends, and brand reputation. Organisations must establish policies and procedures for managing social media records, including retention schedules, monitoring, and analysis. Social media records can be difficult to manage, due to the large volume of content that is generated.',
                  },
                  {
                    title: '7. Microforms',
                    icon: <Archive size={16} />,
                    content: 'Microforms, such as microfilm and microfiche, are miniaturised images of documents stored on film. They were widely used in the past for storing large volumes of records in a compact format. Microforms offer long-term preservation and security, as they are not susceptible to digital obsolescence. However, they require specialised equipment for viewing and retrieval. Microforms are still used in some organisations for storing archival records.',
                  },
                  {
                    title: '8. Geographic Information System (GIS) Records',
                    icon: <Globe2 size={16} />,
                    content: 'GIS records store and manage geographic data, such as maps, satellite imagery, and spatial information. They are used for various applications, including urban planning, environmental management, and transportation logistics. GIS records require specialised software and expertise for analysis and interpretation. They are important to many governmental organisations.',
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

            {/* SECTION 7: Significance of Managing Records in Different Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['significance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Significance of Managing Records in Different Formats
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Legal and Regulatory Compliance',
                    icon: <Shield size={16} />,
                    content: 'Different record formats often fall under distinct legal and regulatory requirements. For instance, electronic records may be subject to e-discovery rules, while paper records might need to adhere to specific retention periods mandated by industry regulations or government bodies. Proper management ensures that an organisation can readily produce accurate and legally admissible records during audits, litigation, or regulatory inquiries. This involves understanding the nuances of how each format is treated under the law, including authentication, preservation, and retrieval protocols.',
                  },
                  {
                    title: '2. Operational Efficiency and Productivity',
                    icon: <TrendingUp size={16} />,
                    content: 'Managing records across diverse formats optimises workflow and enhances productivity. When records are properly organised and easily accessible, regardless of format, employees can quickly retrieve the information they need. This reduces time spent searching for documents, minimising delays, and improving overall efficiency. For example, a well-organised digital archive allows for rapid keyword searches, while a structured paper filing system ensures quick physical retrieval. This efficiency translates to cost savings, improved decision-making, and enhanced customer service.',
                  },
                  {
                    title: '3. Data Security and Protection',
                    icon: <ShieldAlert size={16} />,
                    content: 'Different record formats require tailored security measures to protect sensitive information. Electronic records, for example, necessitate robust cybersecurity protocols, including encryption, access controls, and intrusion detection systems, to prevent unauthorised access and data breaches. Physical records, on the other hand, require secure storage facilities, fire suppression systems, and access logs to safeguard against theft and environmental damage. Managing each format with appropriate security controls ensures the confidentiality, integrity, and availability of sensitive data.',
                  },
                  {
                    title: '4. Long-Term Preservation and Accessibility',
                    icon: <Archive size={16} />,
                    content: 'Certain records, especially those with historical or archival value, require long-term preservation. Different formats have varying lifespans and preservation needs. Paper records can degrade over time due to environmental factors, while electronic records can become obsolete due to technological advancements. Proper management involves implementing preservation strategies, such as digitisation, migration, and archival storage, to ensure that records remain accessible and readable for future generations.',
                  },
                  {
                    title: '5. Disaster Recovery and Business Continuity',
                    icon: <Shield size={16} />,
                    content: 'In the event of a disaster, such as a fire, flood, or cyberattack, having well-managed records in different formats can be crucial for business continuity. Proper backups, off-site storage, and disaster recovery plans ensure that critical records can be recovered quickly, minimising downtime and disruption. For electronic records, this might involve cloud backups and redundant servers. For physical records, it might involve off-site storage in secure, climate-controlled facilities.',
                  },
                  {
                    title: '6. Information Governance and Accountability',
                    icon: <ClipboardList size={16} />,
                    content: 'Managing records in different formats supports effective information governance and accountability. It ensures that records are created, maintained, and used in a transparent and auditable manner. This promotes accountability, reduces the risk of fraud, and enhances the organisation\'s reputation. Clear policies and procedures for each format ensure that employees understand their responsibilities and adhere to best practices. This also ensures that proper audit trails are created and kept.',
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

            {/* SECTION 8: Functions of Records Management */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Functions of Records Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Records Creation and Receipt Control',
                    icon: <FileText size={16} />,
                    content: 'This function involves establishing procedures for the creation and receipt of records, ensuring that they are created in a consistent, accurate, and authorised manner. It includes developing standards for document formats, metadata tagging, and file naming conventions. For physical records, it might involve controlling the distribution of forms and establishing procedures for receiving and registering incoming documents. For electronic records, it might involve implementing electronic document management systems (EDMS) with automated workflows and version control.',
                  },
                  {
                    title: '2. Records Classification and Indexing',
                    icon: <ClipboardList size={16} />,
                    content: 'This function involves organising records into logical categories based on their content, function, and purpose. It includes developing classification schemes, indexing systems, and metadata standards. Effective classification and indexing facilitate efficient retrieval and management of records. For physical records, this might involve creating filing systems with clear labels and indexes. For electronic records, it might involve using metadata tagging and search functionalities.',
                  },
                  {
                    title: '3. Records Storage and Retrieval',
                    icon: <Database size={16} />,
                    content: 'This function involves managing the physical and electronic storage of records, ensuring their security, accessibility, and preservation. It includes developing storage policies, establishing access controls, and implementing retrieval systems. For physical records, this might involve using secure storage facilities, filing cabinets, and off-site storage. For electronic records, this might involve using servers, cloud storage, and document management systems.',
                  },
                  {
                    title: '4. Records Retention and Disposition',
                    icon: <Clock size={16} />,
                    content: 'This function involves establishing retention schedules that specify how long different types of records must be kept, based on legal, regulatory, and business requirements. It includes developing disposition policies and procedures for the secure destruction or transfer of records that are no longer needed. For physical records, this might involve shredding, burning, or recycling. For electronic records, this might involve secure deletion, data wiping, or archival storage.',
                  },
                  {
                    title: '5. Records Security and Access Control',
                    icon: <Shield size={16} />,
                    content: 'This function involves implementing measures to protect records from unauthorised access, alteration, or destruction. It includes developing security policies, establishing access controls, and implementing security technologies. For physical records, this might involve using locked cabinets, access logs, and surveillance systems. For electronic records, this might involve using passwords, encryption, and firewalls.',
                  },
                  {
                    title: '6. Records Preservation and Archiving',
                    icon: <Archive size={16} />,
                    content: 'This function involves ensuring the long-term preservation and accessibility of records that have enduring historical, legal, or administrative value. It includes developing preservation strategies, implementing archival storage solutions, and managing digital preservation. For physical records, this might involve using acid-free paper, climate-controlled storage, and conservation techniques. For electronic records, this might involve data migration, format conversion, and metadata preservation.',
                  },
                  {
                    title: '7. Records Audit and Compliance',
                    icon: <ShieldAlert size={16} />,
                    content: 'This function involves conducting regular audits to ensure that records management practices comply with legal, regulatory, and organisational requirements. It includes developing audit plans, conducting audits, and reporting on findings. This function also addresses the issue of regulatory changes and compliance updates, ensuring that records management practices are aligned with current requirements. Implementing robust audit trails and documentation practices is essential for demonstrating compliance and accountability.',
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

            {/* SECTION 9: The Life Cycle Concept */}
            <div
              ref={(el) => {
                sectionRefs.current['lifecycle'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Life Cycle Concept
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Creation/Receipt',
                    icon: <FileText size={16} />,
                    content: 'This is the initial stage where records are either created within the organisation or received from external sources. Creation involves generating documents, emails, reports, and other forms of information that document business activities. Receipt involves acquiring records from external parties, such as invoices, contracts, or correspondence. This stage is crucial because it sets the foundation for how the record will be managed throughout its life. Proper creation and receipt control ensures that records are accurate, complete, and authentic.',
                  },
                  {
                    title: '2. Distribution/Use',
                    icon: <Network size={16} />,
                    content: 'Once created or received, records are distributed to relevant stakeholders and used to support business operations. This stage involves the active use of records for decision-making, communication, and operational processes. Access controls and security measures are essential during this stage to ensure that records are only accessed by authorised personnel. This also involves tracking the movement and usage of records, especially for sensitive or confidential information.',
                  },
                  {
                    title: '3. Maintenance/Storage',
                    icon: <Archive size={16} />,
                    content: 'This stage involves the ongoing management of records to ensure their preservation and accessibility. Records are stored in appropriate formats and locations, whether physical or electronic. This includes implementing filing systems, storage facilities, and backup procedures. For physical records, this might involve using archival-quality boxes and climate-controlled storage. For electronic records, this might involve data migration, format conversion, and regular backups.',
                  },
                  {
                    title: '4. Retrieval',
                    icon: <Search size={16} />,
                    content: 'Retrieval involves accessing and retrieving records when needed. This stage emphasises the importance of efficient search and retrieval systems. For physical records, this might involve using indexes, filing systems, and retrieval tools. For electronic records, this might involve using search engines, metadata tagging, and document management systems. This stage ensures that records can be located quickly and easily, supporting business operations and legal requirements.',
                  },
                  {
                    title: '5. Retention/Disposition',
                    icon: <Clock size={16} />,
                    content: 'This is the final stage of the records life cycle, where decisions are made about the long-term retention or destruction of records. Retention involves keeping records for a specified period, based on legal, regulatory, and business requirements. Disposition involves the secure destruction or transfer of records that are no longer needed. This stage requires careful consideration of legal obligations, regulatory requirements, and business needs. Retention schedules are developed to specify how long different types of records must be kept.',
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

            {/* SECTION 10: The Continuum Concept */}
            <div
              ref={(el) => {
                sectionRefs.current['continuum'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Continuum Concept
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Integrated Management',
                    icon: <Network size={16} />,
                    content: 'The continuum concept emphasises the seamless integration of records and archives management throughout the entire lifespan of information. It rejects the idea of a clear separation between "active" records and "inactive" archives. Instead, it proposes that management principles and practices should be applied consistently from the moment of creation to final disposition or long-term preservation. This means that considerations for archival value, accessibility, and preservation should be factored in from the very beginning, rather than being an afterthought.',
                  },
                  {
                    title: '2. Shared Responsibility',
                    icon: <Users size={16} />,
                    content: 'The continuum concept advocates for shared responsibility for records and archives management across the organisation. It moves away from the traditional model where records management is the sole responsibility of a specialised department. Instead, it encourages all employees to be involved in the proper creation, maintenance, and preservation of information. This includes educating employees about their roles and responsibilities in records management, providing training on best practices, and fostering a culture of information stewardship.',
                  },
                  {
                    title: '3. Proactive Appraisal and Preservation',
                    icon: <Target size={16} />,
                    content: 'The continuum concept emphasises proactive appraisal and preservation of records from the point of creation. Appraisal, the process of determining the long-term value of records, is not deferred until the end of their active life. Instead, it is integrated into the ongoing management of information. This allows for the early identification of records with archival value and the implementation of appropriate preservation strategies. For electronic records, this might involve implementing metadata standards, data migration plans, and digital preservation strategies.',
                  },
                  {
                    title: '4. Continuous Improvement and Adaptation',
                    icon: <RefreshCw size={16} />,
                    content: 'The continuum concept recognises that information management is an ongoing process that requires continuous improvement and adaptation. It encourages organisations to regularly review and update their policies, procedures, and systems to reflect changing business needs, technological advancements, and legal requirements. This includes staying abreast of emerging technologies, such as artificial intelligence and blockchain, and their potential impact on information management.',
                  },
                  {
                    title: '5. Information as a Strategic Asset',
                    icon: <TrendingUp size={16} />,
                    content: 'The continuum concept views information as a strategic asset that should be managed to support the organisation\'s goals and objectives. It emphasises the importance of aligning information management practices with business strategies and ensuring that information is used to drive innovation and decision-making. This includes developing information governance frameworks, establishing information policies, and implementing information management systems.',
                  },
                  {
                    title: '6. Holistic View of Information',
                    icon: <Layers size={16} />,
                    content: 'The continuum concept promotes a holistic view of information, recognising that records and archives are interconnected and interdependent. It encourages organisations to manage information as a unified whole, rather than as separate silos. This includes integrating records management, archives management, and information technology systems. It also involves developing comprehensive metadata strategies and information architectures. This holistic view ensures that information is managed consistently and efficiently across the organisation.',
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

            {/* SECTION 11: The Principle of Respect des Fonds */}
            <div
              ref={(el) => {
                sectionRefs.current['respect'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Principle of Respect des Fonds
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preservation of Original Order',
                    icon: <ClipboardList size={16} />,
                    content: 'Respect des fonds stresses the importance of maintaining the original arrangement of records as they were created and used by the originating entity. This means that archivists should not rearrange or reorganise records based on subject matter or other external criteria. The original order reflects the organisation\'s internal processes, administrative structures, and decision-making patterns. By preserving this order, archivists retain valuable contextual information that would be lost if records were rearranged. For example, a series of letters might be organised chronologically or by correspondent, reflecting the organisation\'s communication patterns.',
                  },
                  {
                    title: '2. Maintenance of Provenance',
                    icon: <Shield size={16} />,
                    content: 'Provenance refers to the originating entity that created or accumulated the records. Respect des fonds dictates that records from different originating entities should be kept separate and not mixed. This principle ensures that the records\' context is preserved and that researchers can trace the records back to their source. Knowing the provenance of a record is essential for understanding its authenticity, reliability, and significance. For instance, records from a government agency should be kept separate from those of a private company, even if they relate to the same subject.',
                  },
                  {
                    title: '3. Understanding the Context of Creation',
                    icon: <Layers size={16} />,
                    content: 'The principle also emphasises the importance of understanding the context in which records were created. This includes the administrative, legal, and social context that influenced the creation and use of the records. By understanding this context, archivists can better appraise the records\' significance and provide researchers with valuable insights. For example, records created during a period of political upheaval might reflect the tensions and conflicts of that time. Understanding this context is crucial for interpreting the records accurately.',
                  },
                  {
                    title: '4. Facilitating Historical Research',
                    icon: <BookOpen size={16} />,
                    content: 'Respect des fonds is essential for facilitating historical research by ensuring that records are preserved in a way that reflects their original context and meaning. Researchers can use the original order and provenance of records to understand the organisation\'s activities, decision-making processes, and relationships with other entities. This principle allows researchers to reconstruct the past more accurately and gain a deeper understanding of historical events. By preserving the original context, archivists provide researchers with a completer and more accurate picture of the past.',
                  },
                  {
                    title: '5. Ensuring Authenticity and Reliability',
                    icon: <ShieldAlert size={16} />,
                    content: 'By maintaining the original order and provenance of records, respect des fonds helps to ensure their authenticity and reliability. Researchers can trust that the records have not been tampered with or manipulated, and that they accurately reflect the activities of the originating entity. This is particularly important for legal and evidentiary purposes, where the authenticity of records is crucial. Ensuring authenticity also helps to prevent the introduction of bias into historical research.',
                  },
                  {
                    title: '6. Application in Digital Archives',
                    icon: <Database size={16} />,
                    content: 'While respect des fonds originated in the context of paper-based archives, it is equally applicable to digital archives. In digital environments, this principle translates to preserving the original file structures, metadata, and relationships between digital objects. Archivists must ensure that digital records are not altered or manipulated, and that their provenance is clearly documented. This requires careful attention to metadata standards, file format preservation, and digital preservation strategies. The ability to maintain the original context of digital objects is important for ensuring their long-term accessibility and usability.',
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

            {/* SECTION 12: The Information Cycle */}
            <div
              ref={(el) => {
                sectionRefs.current['infocycle'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Information Cycle
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Creation/Capture',
                    icon: <FileText size={16} />,
                    content: 'This is the genesis of information. It is where raw data or ideas are transformed into a usable format. This stage encompasses a wide range of activities. For example, a scientist might capture data from an experiment, a journalist might write an article, or a company might record a sales transaction. In the digital age, this also involves capturing information from digital sources like sensors, web forms, and social media. The crucial aspect here is the initial act of recording or generating information. The accuracy and completeness of the information at this stage are paramount, as they directly influence the quality of subsequent stages.',
                  },
                  {
                    title: '2. Organisation/Storage',
                    icon: <Database size={16} />,
                    content: 'Once information is created, it needs to be organised and stored in a way that allows for easy retrieval and use. This stage involves structuring the information, classifying it, and storing it in appropriate formats and locations. For physical records, this might involve filing documents in cabinets or organising books on shelves. For digital records, this could mean storing data in databases, cloud storage, or file systems. Metadata plays a vital role here, acting as descriptive information that helps users find and understand the stored data. Efficient organisation and storage are essential for ensuring that information is accessible when needed.',
                  },
                  {
                    title: '3. Dissemination/Distribution',
                    icon: <Network size={16} />,
                    content: 'This stage focuses on sharing the organised information with relevant stakeholders. It involves making the information available to those who need it, whether within an organisation or to the public. Dissemination can take various forms, including reports, presentations, emails, publications, and online platforms. The goal is to ensure that the right information reaches the right people at the right time. The methods used for dissemination are often determined by the nature of the information and the target audience.',
                  },
                  {
                    title: '4. Use/Application',
                    icon: <Target size={16} />,
                    content: 'This is where the information becomes valuable. It is the stage where information is applied to specific tasks, decisions, or processes. This might involve analysing data to identify trends, using information to solve problems, or applying knowledge to create new products or services. The effectiveness of this stage depends on the quality of the information and the ability of users to interpret and apply it correctly. Information that is not used is essentially wasted. Therefore, organisations strive to make their information relevant, accurate, and accessible to maximise its usefulness.',
                  },
                  {
                    title: '5. Maintenance/Update',
                    icon: <RefreshCw size={16} />,
                    content: 'Information is often dynamic and needs to be updated to remain accurate and relevant. This stage involves maintaining the integrity of the information by adding new data, correcting errors, and removing obsolete information. Regular updates are crucial for ensuring that information remains reliable and useful over time. This stage is particularly important for databases, websites, and other information systems that require ongoing maintenance. For example, a customer database needs to be updated with new contact information, and a website needs to be updated with new content.',
                  },
                  {
                    title: '6. Disposal/Archiving',
                    icon: <Archive size={16} />,
                    content: 'This is the final stage of the information cycle, where decisions are made about the long-term retention or destruction of information. Disposal involves permanently deleting or destroying information that is no longer needed. Archiving involves preserving information that has historical or archival value. Proper disposal is essential for managing storage space, reducing legal risks, and ensuring data security. Archiving is important for preserving valuable information for future generations. This stage requires careful consideration of legal, regulatory, and organisational requirements. For example, financial records might need to be retained for a certain number of years, while personal data might need to be deleted after a shorter period.',
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
                  💡 History Insight
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
                  <span>Ancient Cultures</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Records Characteristics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>RM Functions</span>
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
                Records management history spans ancient Egypt, Greece, Rome, and China. The invention of printing revolutionised information dissemination. Modern concepts include Records Management, Information Management, and Archives Management. Records have key characteristics: Content, Context, Structure, Integrity, Authenticity, Reliability, Usability, and Retention. Formats include paper, electronic, databases, email, multimedia, social media, microforms, and GIS. Functions include creation control, classification, storage, retention, security, preservation, and audit. The Life Cycle has five stages: Creation, Distribution, Maintenance, Retrieval, Retention. The Continuum Concept promotes integrated, holistic management. Respect des Fonds preserves original order and provenance. The Information Cycle includes Creation, Organisation, Dissemination, Use, Maintenance, and Disposal.
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
                <strong className="text-white">Ancient Records</strong> – Egypt (hieroglyphs, papyrus), Greece (ostraca, public archives), Rome (tabularium, wax tablets), China (oracle bones, bamboo slips, paper). Each developed sophisticated record-keeping systems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Printing Invention</strong> – Early writing, paper in China, block printing, Gutenberg\'s press (movable type), spread of printing, and impact on records management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Management Concepts</strong> – RM (lifecycle control), IM (broader information resources), AM (long-term preservation). Records are evidence; archives are permanent records; information is processed data; documents are written records.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Characteristics &amp; Formats</strong> – Content, Context, Structure, Integrity, Authenticity, Reliability, Usability, Retention. Formats: paper, electronic, database, email, multimedia, social media, microforms, GIS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Life Cycle &amp; Continuum</strong> – Life Cycle: Creation, Distribution, Maintenance, Retrieval, Retention. Continuum: Integrated management, shared responsibility, proactive appraisal, continuous improvement, information as strategic asset, holistic view.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Respect des Fonds &amp; Information Cycle</strong> – Preserve original order and provenance. Information Cycle: Creation, Organisation, Dissemination, Use, Maintenance, Disposal/Archiving.
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
            Sidemann Academic Registry • Records &amp; Information History Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;