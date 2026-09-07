import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  SearchIcon,
  ClockIcon,
  Layout,
  HardDriveIcon,
  Edit,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  Type,
  BookOpen,
  LayersIcon,
  FileText,
  Scissors,
  CircleIcon,
  Archive,
  Database,
  FileText as FileTextIcon2,
  BookOpen as BookOpenIcon,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  Clock,
  CheckCircle,
  RefreshCw as RefreshCwIcon2,
  AlertCircle,
  ClipboardList,
  Trash2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'direct-indirect', label: 'Direct vs Indirect' },
  { id: 'principles', label: 'Classification Principles' },
  { id: 'systems', label: 'Classification Systems' },
  { id: 'fastening', label: 'Document Fastening' },
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
        text: 'The Dewey Decimal System, created in 1876, is one of the most widely used library classification systems in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'When fastening documents, always consider how often they will be accessed. Temporary documents suit paper clips; permanent records need staples or binding.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight classification principles with "U-E-M-C-L-P-F-P": Unique, Exhaustive, Mutual Exclusivity, Consistency, Logical, Predictable, Flexible, Purposeful.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of mutual exclusivity in classification, leading to overlapping categories and confusing retrieval.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Dewey Decimal System, created in 1876, is one of the most widely used library classification systems in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'When fastening documents, always consider how often they will be accessed. Temporary documents suit paper clips; permanent records need staples or binding.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the eight classification principles with "U-E-M-C-L-P-F-P": Unique, Exhaustive, Mutual Exclusivity, Consistency, Logical, Predictable, Flexible, Purposeful.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations overlook the importance of mutual exclusivity in classification, leading to overlapping categories and confusing retrieval.',
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
            Classification Systems &{' '}
            <span className="text-sky-300 font-bold italic">
              Document Fastening
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to direct vs indirect access, classification principles, classification systems, and methods for fastening documents together.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Hash size={14} className="inline mr-1" /> Classification
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Paperclip size={14} className="inline mr-1" /> Fastening
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <SearchIcon size={14} className="inline mr-1" /> Access
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
                placeholder="Search for a concept, system, principle..."
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
            {/* SECTION 1: Differences Between Direct and Indirect Access File Classification Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['direct-indirect'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Differences Between Direct and Indirect Access File Classification Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Direct and indirect access file classification systems represent two fundamentally different approaches to organizing and retrieving data. Understanding their distinctions is crucial for designing efficient information management systems.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Retrieval Mechanism',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access systems allow you to retrieve a specific record or file directly by its address or location. This is akin to knowing the exact street address of a house and going straight there. Hashing algorithms or indexing techniques are often used to calculate the physical location of a record based on its key. This method provides very fast retrieval times, especially when you know the precise identifier of the data you need.</p>
                        <p><strong>Indirect Access:</strong> Indirect access systems, on the other hand, require you to traverse through a sequence of pointers or indexes to locate a record. This is like using a map to find a location, where you follow a series of roads or landmarks. Sequential access, where you read through data in order until you find the record, is a type of indirect access. This method is generally slower than direct access for random retrieval but can be efficient for sequential processing of data.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Speed of Retrieval',
                    icon: <Clock size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access offers significantly faster retrieval speeds for individual records. Because the system can calculate the exact location of a record, it can access it directly without searching through other data. This is particularly beneficial for applications that require rapid access to specific records, such as online transaction processing or database lookups.</p>
                        <p><strong>Indirect Access:</strong> Indirect access tends to be slower for random retrieval, as it requires traversing through multiple levels of indexes or pointers. Sequential access is only fast if you want all the data in order. If you want a specific record in the middle of a large file, it will take a long time to get there. However, it can be efficient for processing large volumes of data sequentially, such as generating reports or performing batch processing.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Data Organization',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access systems often organize data based on hashing algorithms or indexing techniques that map record keys to physical storage locations. This organization allows for rapid calculation of record addresses and direct access to data.</p>
                        <p><strong>Indirect Access:</strong> Indirect access systems may organize data sequentially or use hierarchical structures, such as indexes or linked lists, to facilitate data retrieval. Sequential files store records in a specific order, while indexed files use indexes to point to record locations.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Storage Efficiency',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access methods may sometimes be less storage-efficient due to the need to allocate space for potential record collisions or to maintain index structures. Hashing, for example, might result in empty slots in the storage space to avoid collisions, thus wasting space.</p>
                        <p><strong>Indirect Access:</strong> Indirect access methods, particularly sequential files, can be more storage-efficient, as they store records contiguously without gaps. However, indexed files also utilise extra storage space for the index itself.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Data Modification',
                    icon: <Edit size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access systems can handle data modification (inserting, deleting, updating) efficiently, as records can be accessed and modified directly. However, handling record collisions and maintaining index integrity can be complex.</p>
                        <p><strong>Indirect Access:</strong> Indirect access systems, especially sequential files, can be less efficient for data modification. Inserting or deleting records in a sequential file may require rewriting the entire file. Indexed files are more efficient for modifications, but the indexes themselves must be updated, which can be time-consuming.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Application Suitability',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Direct Access:</strong> Direct access systems are well-suited for applications that require rapid access to individual records, such as online transaction processing, database lookups, and real-time data retrieval.</p>
                        <p><strong>Indirect Access:</strong> Indirect access systems, particularly sequential files, are well-suited for applications that process large volumes of data sequentially, such as batch processing, report generation, and data archiving. Indexed files can be used for a wider range of applications, including those that require both sequential and random access.</p>
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

            {/* SECTION 2: Principles of Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of Classification
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The principles of classification are fundamental guidelines that ensure information is organised logically, consistently, and effectively. These principles are applicable across various domains, from library science and biology to data management and records keeping.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Unique Classification',
                    icon: <Hash size={16} />,
                    content: 'This principle states that each item or piece of information should belong to only one class or category within the classification system. This prevents ambiguity and ensures that items are not duplicated or misfiled. If an item could logically fit into multiple categories, clear rules must be established to determine its single, correct placement. This ensures that retrieval of information is consistent and predictable.',
                  },
                  {
                    title: '2. Exhaustiveness',
                    icon: <GlobeIcon size={16} />,
                    content: 'The classification system should be exhaustive, meaning that it must provide a category for every item or piece of information to be classified. There should be no items left unclassified or "orphaned." This principle ensures that the system is comprehensive, and that all information is accounted for. If new items are added, the classification system may need to be expanded to accommodate them.',
                  },
                  {
                    title: '3. Mutual Exclusivity',
                    icon: <Shield size={16} />,
                    content: 'The categories within the classification system should be mutually exclusive, meaning that they should not overlap. This ensures that there is no ambiguity in which category an item belongs to. Clear and distinct boundaries between categories are essential. This principle avoids confusion and ensures that items are consistently classified.',
                  },
                  {
                    title: '4. Consistency',
                    icon: <ListChecks size={16} />,
                    content: 'The classification system should be applied consistently across all items and by all users. This means that the same criteria and rules should be used for classifying all items, regardless of who is doing the classification. This consistency ensures that the system is reliable and that items are classified in a predictable manner. Documentation of the classification system and training for users are essential for maintaining consistency.',
                  },
                  {
                    title: '5. Logical Arrangement',
                    icon: <Layout size={16} />,
                    content: 'The categories within the classification system should be arranged in a logical and meaningful order. This arrangement should reflect the relationships between the categories and make it easy to navigate and understand the system. Logical arrangements can be based on various criteria, such as subject, chronology, or hierarchy. A well-organised system facilitates efficient retrieval and use of information.',
                  },
                  {
                    title: '6. Predictability',
                    icon: <Target size={16} />,
                    content: 'The classification system should be predictable, meaning that users should be able to anticipate where an item will be classified based on its characteristics. This predictability is achieved through clear definitions of categories and consistent application of the classification rules. If a user understands the logic of the system, they should be able to find the information they need quickly and easily.',
                  },
                  {
                    title: '7. Flexibility',
                    icon: <SettingsIcon size={16} />,
                    content: 'While consistency is important, the classification system should also be flexible enough to accommodate changes and additions. As new information is added or the organisation\'s needs evolve, the system may need to be modified. This flexibility ensures that the system remains relevant and useful over time. However, modifications should be made carefully to maintain consistency and avoid disrupting the existing structure.',
                  },
                  {
                    title: '8. Purposefulness',
                    icon: <Target size={16} />,
                    content: 'The classification system should be designed with a specific purpose in mind. The purpose of the system should guide the selection of categories and the arrangement of information. A system designed for one purpose may not be suitable for another. Clearly defining the purpose of the classification system ensures that it meets the organisation\'s needs.',
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

            {/* SECTION 3: Classification Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['systems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classification Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Classification systems are fundamental tools for organising and retrieving information across various domains. They provide structured frameworks for categorising data, documents, and other items based on shared characteristics.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Hierarchical Classification Systems',
                    icon: <FolderTree size={16} />,
                    content: 'Hierarchical systems organise information in a tree-like structure, with broader categories at the top and increasingly specific subcategories branching down. This approach is prevalent in library science (like the Dewey Decimal System) and biological taxonomy (like the Linnaean system). Each level in the hierarchy represents a more detailed subdivision of the preceding level, allowing for precise categorisation. This system is efficient for navigating large volumes of information, as users can progressively narrow down their search by moving through the hierarchy. However, rigid hierarchies can sometimes struggle to accommodate interdisciplinary or overlapping information.',
                  },
                  {
                    title: '2. Alphabetical Classification Systems',
                    icon: <Type size={16} />,
                    content: 'Alphabetical systems arrange information based on the alphabetical order of names, titles, or keywords. This system is straightforward and widely used in dictionaries, encyclopaedias, and indexes. It offers a simple and intuitive way to locate specific items, especially when the exact name or title is known. However, alphabetical systems can be less effective for categorising information based on subject or concept, as related items may be scattered throughout the alphabet.',
                  },
                  {
                    title: '3. Chronological Classification Systems',
                    icon: <ClockIcon size={16} />,
                    content: 'Chronological systems organise information based on time, such as dates, periods, or events. This approach is commonly used in historical archives, timelines, and event logs. It provides a clear and linear representation of information over time, facilitating the study of trends and patterns. However, chronological systems may not be suitable for categorising information that is not time-dependent or that spans multiple time periods.',
                  },
                  {
                    title: '4. Subject-Based Classification Systems',
                    icon: <BookOpen size={16} />,
                    content: 'Subject-based systems organise information based on topics or themes. This approach is prevalent in academic libraries, research databases, and online content management systems. It allows users to browse and retrieve information based on their specific areas of interest. Subject-based systems often use controlled vocabularies and thesauri to ensure consistency and accuracy. However, they can be complex to develop and maintain, as subject categories may overlap or evolve over time.',
                  },
                  {
                    title: '5. Numerical Classification Systems',
                    icon: <Hash size={16} />,
                    content: 'Numerical systems assign numerical codes to categories and items. This approach is commonly used in library classification (like the Universal Decimal Classification) and industrial coding systems. Numerical systems can be highly efficient for organising and retrieving large volumes of information, especially when used in conjunction with automated systems. They offer a structured and standardised way to categorise data, allowing for precise identification and retrieval.',
                  },
                  {
                    title: '6. Faceted Classification Systems',
                    icon: <LayersIcon size={16} />,
                    content: 'Faceted systems organise information based on multiple independent categories, or facets, that can be combined to create more specific classifications. This approach is flexible and adaptable, allowing users to create custom classifications based on their specific needs. Faceted systems are commonly used in e-commerce websites and online databases, where users can filter and refine their search results by selecting multiple facets. This system allows for very detailed and flexible searching.',
                  },
                  {
                    title: '7. Alphanumeric Classification Systems',
                    icon: <FileText size={16} />,
                    content: 'Alphanumeric systems combine letters and numbers to create classification codes. This approach is versatile and can accommodate a wide range of information. Alphanumeric systems are commonly used in inventory management, product catalogues, and document management systems. They offer a structured and efficient way to categorise and identify items, especially when dealing with complex or diverse datasets.',
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

            {/* SECTION 4: Fastening Documents Together */}
            <div
              ref={(el) => {
                sectionRefs.current['fastening'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Fastening Documents Together
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Fastening documents together to maintain sequence is a fundamental practice in records management, ensuring that information remains organised and intact. This is especially crucial for legal, financial, and historical documents where preserving the original order is essential.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Stapling',
                    icon: <Scissors size={16} />,
                    content: 'Stapling is a common and straightforward method for fastening documents together. It is suitable for relatively small stacks of paper and provides a secure hold. However, it is essential to use high-quality staples and ensure they are properly inserted to avoid damaging the documents. Stapling is best for documents that are not expected to be frequently accessed or separated, as removing staples can sometimes tear the paper.',
                  },
                  {
                    title: '2. Paper Clips',
                    icon: <Paperclip size={16} />,
                    content: 'Paper clips offer a temporary and non-destructive way to fasten documents. They are easy to apply and remove, making them ideal for documents that need to be frequently accessed or reorganised. However, paper clips are less secure than staples and may slip or detach, especially with larger stacks of paper. They are best used for temporary organisation or when documents need to be easily separated.',
                  },
                  {
                    title: '3. Binding',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>Binding involves using various methods to create a more permanent and professional fastening for documents. This can include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Comb binding:</strong> Uses plastic combs to hold punched holes together.</li>
                          <li><strong>Spiral binding:</strong> Uses a plastic or metal coil to hold punched holes together.</li>
                          <li><strong>Thermal binding:</strong> Uses heat to bind documents together with a cover.</li>
                          <li><strong>Bookbinding:</strong> Sewing and gluing methods for a very durable and professional finish.</li>
                        </ul>
                        <p>Binding is ideal for reports, presentations, and legal documents that require a polished and secure presentation. It is more durable than stapling or paper clipping and provides a professional look.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Hole Punching and Fasteners',
                    icon: <CircleIcon size={16} />,
                    content: 'Hole punching and using fasteners, such as brass fasteners or ring binders, is another method for securing documents. This allows for easy insertion and removal of pages, making it suitable for documents that need to be frequently updated or reorganised. Ring binders are especially useful for large volumes of documents and allow for easy flipping of pages. Brass fasteners are more secure and are often used for legal or archival documents.',
                  },
                  {
                    title: '5. Archival Fasteners',
                    icon: <Archive size={16} />,
                    content: 'For archival documents or those requiring long-term preservation, archival-quality fasteners are essential. These fasteners are made from materials that are acid-free and will not degrade or damage the paper over time. Archival fasteners ensure that documents remain in their original condition and sequence for future reference.',
                  },
                  {
                    title: '6. Numbering and Indexing',
                    icon: <ListChecks size={16} />,
                    content: 'In conjunction with physical fastening, numbering and indexing documents is crucial for maintaining sequence. This involves assigning sequential numbers to each page or document and creating an index that lists the contents and their corresponding numbers. Numbering and indexing make it easy to locate specific pages or documents and ensure that the sequence is maintained even if the documents are separated.',
                  },
                  {
                    title: '7. Digital Fastening and Sequencing',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p>In digital environments, "fastening" documents involves using file management systems and software that maintain the integrity and sequence of digital files. This can include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>PDF merging:</strong> Combining multiple documents into a single PDF file, ensuring the pages are in the correct order.</li>
                          <li><strong>Version control:</strong> Using software to track changes and maintain different versions of a document.</li>
                          <li><strong>Metadata tagging:</strong> Assigning metadata to files to indicate their sequence and relationships.</li>
                        </ul>
                        <p>Digital methods ensure that documents are organised and accessible, and that their sequence is preserved.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Considerations',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Document type:</strong> The type of document will influence the best fastening method. Legal documents may require binding or archival fasteners, while temporary documents may be suitable for paper clips.</li>
                        <li><strong>Frequency of access:</strong> Documents that need to be frequently accessed or updated may be best suited for ring binders or paper clips.</li>
                        <li><strong>Long-term preservation:</strong> Archival documents require archival-quality fasteners and storage methods.</li>
                        <li><strong>Volume of documents:</strong> Large volumes of documents may require binding or ring binders for efficient management.</li>
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Classification Insight
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
                  <span>Access Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Classification Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Classification Systems</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Fastening Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Direct access provides fast, location-based retrieval; indirect access uses indexes or sequential reading. Eight classification principles ensure effective organisation: Unique, Exhaustive, Mutual Exclusivity, Consistency, Logical, Predictable, Flexible, Purposeful. Seven classification systems offer different approaches. Eight fastening methods – from staples to digital merging – maintain document sequence.
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
                <strong className="text-white">Direct vs Indirect Access</strong> – Direct access retrieves files by location (fast, random), indirect uses indexes or sequential reading (slower, efficient for batch). Choose based on retrieval needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Classification Principles</strong> – Eight principles: Unique, Exhaustive, Mutual Exclusivity, Consistency, Logical Arrangement, Predictability, Flexibility, Purposefulness. These ensure reliable and effective information organisation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Classification Systems</strong> – Seven types: Hierarchical, Alphabetical, Chronological, Subject‑Based, Numerical, Faceted, Alphanumeric. Each serves different organisational needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Document Fastening</strong> – Methods include Stapling, Paper Clips, Binding, Hole Punching, Archival Fasteners, Numbering, Digital Merging, and Version Control. Choose based on access frequency, document type, and preservation needs.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 2 (Classification &amp; Fastening)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;