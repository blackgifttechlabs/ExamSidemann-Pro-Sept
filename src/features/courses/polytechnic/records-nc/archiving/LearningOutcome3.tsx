import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Archive,
  Building,
  Users,
  Folder,
  FileText,
  Shield,
  ListChecks,
  Layers,
  BookOpen,
  GraduationCap,
  Scale,
  TrendingUp,
  User,
  Landmark,
  Home,
  Church,
  Briefcase,
  Microscope,
  Database,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Target,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'terms', label: 'Archival Terms' },
  { id: 'use', label: 'Use of Archives' },
  { id: 'categories', label: 'Categories' },
  { id: 'citing', label: 'Citing Archives' },
  { id: 'public-private', label: 'Public vs Private' },
  { id: 'history', label: 'History' },
  { id: 'functions', label: 'Archival Functions' },
  { id: 'structure', label: 'Institution Structure' },
  { id: 'responsibilities', label: 'Staff Responsibilities' },
  { id: 'programming', label: 'Public Programming' },
  { id: 'resources', label: 'Outreach Resources' },
  { id: 'strategies', label: 'Outreach Strategies' },
  { id: 'publicising', label: 'Publicising' },
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
        text: 'The principle of provenance dictates that records from different creators should not be intermingled, preserving their original context and meaning.',
      },
      {
        title: 'Pro Tip',
        text: 'When citing archival materials, always include the fonds name, series, and item identifier to help future researchers locate the same source.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the core archival functions with the acronym "A-A-P-R-O-D": Appraisal, Acquisition, Preservation, Reference, Outreach, Description.',
      },
      {
        title: 'Common Mistake',
        text: 'Many researchers overlook the importance of citing the repository name and location, making it difficult for others to verify their sources.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The principle of provenance dictates that records from different creators should not be intermingled, preserving their original context and meaning.',
      },
      {
        title: 'Pro Tip',
        text: 'When citing archival materials, always include the fonds name, series, and item identifier to help future researchers locate the same source.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the core archival functions with the acronym "A-A-P-R-O-D": Appraisal, Acquisition, Preservation, Reference, Outreach, Description.',
      },
      {
        title: 'Common Mistake',
        text: 'Many researchers overlook the importance of citing the repository name and location, making it difficult for others to verify their sources.',
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
            <Archive size={14} className="inline mr-1" /> ARCHIVES &amp; RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Archival Terms, History &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Public Programming
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to archival terminology, use of archives, categories, history, basic functions, institutional structure, outreach strategies, and public programming.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Folder size={14} className="inline mr-1" /> Archival Terms
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Building size={14} className="inline mr-1" /> Categories
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Public Programming
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
                placeholder="Search for a term, function, strategy..."
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
            {/* SECTION 1: Archival Terms */}
            <div
              ref={(el) => {
                sectionRefs.current['terms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archival Terms
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Understanding archival terminology is crucial for anyone working with or researching historical records. These terms describe fundamental concepts that guide the organization, preservation, and interpretation of archival materials.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Fonds',
                    icon: <Folder size={16} />,
                    content: (
                      <>
                        <p>A "fonds" (pronounced "fonz") is the entire body of records created and accumulated by a single creator, whether that creator is an individual, family, organization, or government agency, in the course of their activities. It represents the totality of the records generated by a specific entity and is considered the primary unit of archival description. The concept of the fonds emphasizes the organic and contextual nature of records, recognizing that they derive their meaning from their relationship to the creator and their activities. It is important that the records are kept together as a whole, because separating them destroys the context they were created in. The fonds is an essential principle in archival management, as it guides the arrangement and description of records, ensuring that they are preserved in their original context.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Archives',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>"Archives" refers to both the records themselves and the institution responsible for their preservation. As a noun, "archives" can refer to the body of records of enduring historical value created or received by a person, family, or organization, in connection with their affairs. As a place, "archives" refers to the building or part of a building where archival materials are preserved. Archives institutions are dedicated to the acquisition, preservation, arrangement, description, and accessibility of archival records. They play a crucial role in safeguarding cultural heritage and facilitating historical research. Archives institutions employ professional archivists who apply specialized knowledge and skills to manage and make these records available to researchers and the public.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Records',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>"Records" are documented information, regardless of form or medium, created, received, and maintained as evidence by an organization or person in pursuance of legal obligations or in the transaction of business. They serve as evidence of activities, transactions, and decisions. Records can take various forms, including paper documents, photographs, audio and video recordings, electronic files, and digital databases. They are distinguished from other types of information by their evidentiary nature and their role in documenting the activities of the creator. Records are essential for accountability, transparency, and historical research, as they provide insights into the past and support informed decision-making.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Provenance',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>"Provenance" refers to the origin of records, specifically the creator or originating source of the records. It is a fundamental principle in archival management, emphasizing that records should be kept in their original context and that their history of custody should be documented. Understanding the provenance of records is essential for establishing their authenticity, reliability, and evidential value. Provenance helps researchers trace the history of records and understand the context in which they were created. It also ensures that records are not separated from their creator or mixed with records from other sources, which could distort their meaning.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Original Order',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <p>"Original order" refers to the arrangement of records as established by the creator during their active use. It is a principle that archivists strive to maintain, as it reflects the creator's organizational structure, and the way records were used in their daily activities. Preserving the original order helps researchers understand the context in which records were created and used, providing insights into the creator's functions and processes. Altering the original order can distort the meaning of records and obscure their historical significance. Maintaining original order is a key component of preserving the integrity of a fonds.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Series',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>A "series" is a group of records created or maintained by the same creator, relating to a particular function or activity, and kept together because of some common characteristic. Series are often organized by subject, function, or file type, and they represent a logical grouping of records within a fonds. They provide a framework for organizing and describing records, making them more accessible to researchers. Series help researchers navigate large and complex fonds by identifying related records and understanding their context within the creator's activities. They also facilitate efficient retrieval and management of records.</p>
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

            {/* SECTION 2: Use of Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['use'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Use of Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archives, often perceived as dusty repositories of old documents, are in fact vital resources that serve numerous critical functions in society.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preserving Cultural Heritage and Memory',
                    icon: <BookOpen size={16} />,
                    content: 'Archives are the custodians of our cultural heritage and collective memory. They safeguard documents, photographs, recordings, and other materials that chronicle the history of individuals, communities, and nations. Without archives, significant aspects of our past would be lost, leaving gaps in our understanding of who we are and where we came from. They preserve the stories of ordinary people and extraordinary events, ensuring that future generations can learn from the past and appreciate their cultural roots.',
                  },
                  {
                    title: '2. Supporting Historical Research and Scholarship',
                    icon: <GraduationCap size={16} />,
                    content: 'Archives are indispensable resources for historical research and scholarship. They provide primary source materials that allow researchers to delve into the past, analyse events, and develop new interpretations. Historians, genealogists, and other researchers rely on archives to access original documents and uncover hidden narratives. Archives offer a unique and unfiltered perspective on the past, enabling researchers to challenge existing assumptions and contribute to a more nuanced understanding of history.',
                  },
                  {
                    title: '3. Ensuring Accountability and Transparency',
                    icon: <Shield size={16} />,
                    content: 'Archives play a crucial role in ensuring accountability and transparency in government and other institutions. They preserve records that document decisions, policies, and actions, providing evidence that can be used to hold individuals and organizations accountable. This is particularly important in democratic societies, where citizens have the right to access information and hold their leaders accountable. Archives can help prevent corruption, expose wrongdoing, and promote transparency in public affairs.',
                  },
                  {
                    title: '4. Facilitating Legal and Administrative Functions',
                    icon: <Scale size={16} />,
                    content: 'Archives are essential for supporting legal and administrative functions. They preserve records that document legal rights, property ownership, and other administrative matters. These records can be used to resolve disputes, establish legal precedents, and protect individual rights. Archives also support government operations by preserving records that document policies, procedures, and decisions, ensuring that essential information is available when needed.',
                  },
                  {
                    title: '5. Promoting Education and Public Engagement',
                    icon: <Users size={16} />,
                    content: 'Archives are valuable educational resources that can be used to engage the public with history and culture. They offer opportunities for students, teachers, and community members to explore primary source materials and learn about the past. Archives can host exhibitions, workshops, and other educational programs that bring history to life, contributing to a more informed and culturally aware society.',
                  },
                  {
                    title: '6. Supporting Cultural and Economic Development',
                    icon: <TrendingUp size={16} />,
                    content: 'Archives can contribute to cultural and economic development by preserving records that document local history, industry, and innovation. They can provide valuable resources for tourism, heritage preservation, and economic development initiatives. Archives can also support creative industries by providing inspiration and source material for artists, writers, and filmmakers.',
                  },
                  {
                    title: '7. Protecting Individual Rights and Memories',
                    icon: <User size={16} />,
                    content: 'Archives protect the rights and memories of individuals by preserving records that document their lives, experiences, and contributions. This is especially important for marginalized communities and individuals whose stories may be overlooked or forgotten. Archives can help preserve family histories, document social movements, and safeguard personal memories, ensuring that individual voices are heard and that diverse perspectives are represented.',
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

            {/* SECTION 3: Categories of Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['categories'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Categories of Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Governmental Archives',
                    icon: <Landmark size={16} />,
                    content: 'Governmental archives hold records created by local, regional, and national government bodies. These archives document the activities, policies, and decisions of government agencies, providing insights into the workings of public administration. They contain records such as legislative documents, court records, administrative files, and public records. These archives are crucial for ensuring transparency, accountability, and historical understanding of government actions.',
                  },
                  {
                    title: '2. Institutional Archives',
                    icon: <Building size={16} />,
                    content: 'Institutional archives preserve records created by organizations, such as corporations, universities, hospitals, and non-profit organizations. These archives document the history, operations, and achievements of these institutions. They may contain records such as meeting minutes, financial records, correspondence, and publications. Institutional archives are essential for preserving institutional memory and documenting the contributions of these organizations to society.',
                  },
                  {
                    title: '3. Personal and Family Archives',
                    icon: <Home size={16} />,
                    content: 'Personal and family archives hold records created by individuals and families. These archives document the lives, experiences, and activities of individuals and families, providing insights into personal histories and social contexts. They may contain records such as diaries, letters, photographs, and personal papers. Personal and family archives are valuable resources for genealogists, historians, and social scientists studying individual and family histories.',
                  },
                  {
                    title: '4. Religious Archives',
                    icon: <Church size={16} />,
                    content: 'Religious archives hold records created by religious institutions, such as churches, synagogues, mosques, and temples. These archives document the history, activities, and beliefs of religious communities. They may contain records such as parish registers, sermons, religious texts, and administrative records. Religious archives are essential for preserving the history of religious traditions and documenting the role of religion in society.',
                  },
                  {
                    title: '5. Business Archives',
                    icon: <Briefcase size={16} />,
                    content: 'Business archives hold records created by commercial enterprises, such as corporations, partnerships, and sole proprietorships. These archives document the history, operations, and products of businesses. They may contain records such as financial records, marketing materials, product designs, and employee records. Business archives are essential for preserving the history of commerce and industry.',
                  },
                  {
                    title: '6. Specialized Archives',
                    icon: <Microscope size={16} />,
                    content: 'Specialized archives focus on specific subject areas or formats. These archives may hold records related to a particular field, such as science, technology, or the arts. They may also hold records in specific formats, such as photographs, film, or sound recordings. Specialized archives are essential for preserving unique and valuable records that may not fit within other archival categories.',
                  },
                  {
                    title: '7. Digital Archives',
                    icon: <Database size={16} />,
                    content: 'Digital archives hold records created and stored in digital formats. This category is increasingly important as more records are created electronically. Digital archives require specialized technologies and expertise to ensure the long-term preservation and accessibility of digital records. They may contain records such as emails, digital photographs, electronic documents, and databases. Digital archives are essential for preserving the digital heritage of our society.',
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

            {/* SECTION 4: Factors to Consider When Citing Archival Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['citing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Citing Archival Materials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying the Fonds and Series',
                    icon: <Folder size={16} />,
                    content: 'The "fonds" is the fundamental unit of archival description, representing the entire body of records created by a single creator. It is essential to identify and accurately cite the fonds from which the material originated. Within the fonds, records are often organized into "series," which are groups of records related to a specific function or activity. Citing both the fonds and the series provides crucial context for the records and helps researchers understand their provenance and organization.',
                  },
                  {
                    title: '2. Providing Specific Item or Folder Information',
                    icon: <FileText size={16} />,
                    content: 'Archival citations must be specific enough to allow researchers to locate the exact item or folder used. This may include file names, folder titles, document numbers, or other identifying information. The level of detail required depends on the organization of the archives and the nature of the records. Providing precise item or folder information ensures that researchers can easily access the source material and verify the citation\'s accuracy.',
                  },
                  {
                    title: '3. Including Repository and Location Information',
                    icon: <Building size={16} />,
                    content: 'Archival citations must include the name of the repository (the archives or library where the records are housed) and the location of the records within the repository. This may involve citing the collection name, box number, or shelf location. Providing repository and location information ensures that researchers can find the records, even if they are not familiar with the archives.',
                  },
                  {
                    title: '4. Noting the Date of Creation or Access',
                    icon: <Clock size={16} />,
                    content: 'The date of creation or access is a crucial element of archival citations. The date of creation provides context for the records and helps researchers understand their historical significance. The date of access is also important, as it indicates when the researcher consulted the records. This is particularly important for digital archives, where records may be updated or modified over time.',
                  },
                  {
                    title: '5. Describing the Format and Medium',
                    icon: <Layers size={16} />,
                    content: 'Archival records can take various forms, including paper documents, photographs, audio and video recordings, and digital files. The format and medium of the records should be clearly described in the citation. This helps researchers understand the nature of the source material and its potential limitations. For example, a photograph may require different handling or interpretation than a written document.',
                  },
                  {
                    title: '6. Following Archival Citation Standards',
                    icon: <BookOpen size={16} />,
                    content: 'Archival citation standards vary depending on the discipline and the specific archives being used. It is essential to follow the citation style guidelines recommended by the archives or the relevant academic field. Some archives provide specific citation templates or examples, while others may require adherence to established style guides, such as Chicago or MLA.',
                  },
                  {
                    title: '7. Documenting Access Restrictions and Copyright Information',
                    icon: <Shield size={16} />,
                    content: 'Archival records may be subject to access restrictions or copyright limitations. These restrictions may be due to privacy concerns, legal requirements, or preservation needs. It is essential to document any access restrictions or copyright information in the citation. This ensures that researchers are aware of any limitations on the use of the records and helps to protect the rights of the archives and the creators.',
                  },
                  {
                    title: '8. Providing Contextual Information',
                    icon: <ListChecks size={16} />,
                    content: 'Archival records often require contextual information to be fully understood. This may involve providing background information about the creator, the records\' purpose, or the historical context in which they were created. Including contextual information in the citation helps researchers understand the significance of the records and their relevance to the research question.',
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

            {/* SECTION 5: Difference Between Public and Private Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['public-private'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Public and Private Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ownership and Funding',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p><strong>Public Archives:</strong> Owned and funded by government entities at the local, regional, or national level. Supported by taxpayer funds, accountable to the public. Examples include national archives, state archives, and municipal archives.</p>
                        <p><strong>Private Archives:</strong> Owned and funded by non-governmental entities, such as corporations, universities, historical societies, religious institutions, or individuals. Funding sources include endowments, membership fees, donations, and private grants. Operate with greater autonomy.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Access and Accessibility',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Public Archives:</strong> Generally open to the public, with access often guaranteed by law. Mandated to make holdings accessible to researchers, scholars, and the general public, subject to certain restrictions related to privacy, national security, or legal obligations.</p>
                        <p><strong>Private Archives:</strong> May have more restricted access policies. Access determined by the owning institution or individual. Some may be open to the public, while others may be restricted to members, researchers with specific credentials, or those who obtain permission.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Purpose and Scope',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Public Archives:</strong> Primarily focus on preserving records that document the activities and decisions of government bodies. Serve to ensure accountability, transparency, and historical understanding of government actions. Scope is typically broad, encompassing records related to legislation, policy, administration, and public services.</p>
                        <p><strong>Private Archives:</strong> Serve a variety of purposes, depending on the nature of the owning institution. May focus on preserving the history of a corporation, documenting the activities of a historical society, or safeguarding the personal papers of an individual or family. Scope can be more specialized.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Types of Records Held',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Public Archives:</strong> Hold records such as legislative documents, court records, administrative files, and public records. These records document the workings of government and provide insights into public policy and administration.</p>
                        <p><strong>Private Archives:</strong> Hold a diverse range of records, including corporate records, personal papers, family histories, organizational records, and specialized collections. The types of records held reflect the nature and activities of the owning entity.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Regulatory Oversight',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Public Archives:</strong> Subject to government oversight and regulations, including laws related to records management, privacy, and public access. Must adhere to established standards and procedures for records preservation and access.</p>
                        <p><strong>Private Archives:</strong> Operate with greater autonomy and are not subject to the same level of government oversight. However, they may still be subject to certain legal obligations, such as copyright laws and privacy regulations.</p>
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

            {/* SECTION 6: History of Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['history'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                History of Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ancient Origins',
                    icon: <Archive size={16} />,
                    content: 'The earliest forms of archives emerged in ancient civilizations, where records were essential for administrative, religious, and commercial purposes. In Mesopotamia, clay tablets inscribed with cuneiform script documented trade transactions, legal codes, and royal decrees. Ancient Egypt saw the development of papyrus scrolls, used for everything from religious texts to administrative records. These early archives were often housed in temples or royal palaces, reflecting the close connection between power, religion, and record keeping.',
                  },
                  {
                    title: '2. Classical Antiquity',
                    icon: <Building size={16} />,
                    content: 'In ancient Greece and Rome, libraries and record offices became more formalized institutions. The Library of Alexandria, founded in the 3rd century BCE, housed a vast collection of scrolls and manuscripts, representing a pinnacle of ancient scholarship. Roman archives, such as the Tabularium, stored official records of the Roman Republic and Empire. These institutions saw a growing recognition of the importance of preserving knowledge and official records for future generations.',
                  },
                  {
                    title: '3. Medieval Period',
                    icon: <Church size={16} />,
                    content: 'During the medieval period, monasteries and ecclesiastical institutions became the primary custodians of records. Monks meticulously copied and preserved manuscripts, safeguarding classical texts and religious documents. Cathedral archives and papal archives documented the activities of the Church, playing a crucial role in preserving religious and intellectual traditions. The church was one of the few institutions that had the resources and need to keep records during the medieval period.',
                  },
                  {
                    title: '4. Renaissance and Early Modern Era',
                    icon: <Landmark size={16} />,
                    content: 'The Renaissance and early modern era saw the rise of state archives, as centralized governments sought to consolidate their power and manage their affairs. Royal archives, such as the Archives Nationales in France and the Public Record Office in England, documented the activities of monarchs and their administrations. These archives reflected the growing importance of bureaucratic record keeping and the need to preserve official documents for legal and administrative purposes.',
                  },
                  {
                    title: '5. Industrial Revolution and Modern Archives',
                    icon: <TrendingUp size={16} />,
                    content: 'The Industrial Revolution and the rise of modern nation-states led to a dramatic expansion of record keeping and the development of modern archival practices. National archives and state archives became more formalized institutions, employing professional archivists and developing standardized methods for organizing and preserving records. The 19th and 20th centuries saw the emergence of archival associations and the development of archival theory and practice.',
                  },
                  {
                    title: '6. 20th Century and Beyond',
                    icon: <Database size={16} />,
                    content: 'The 20th century saw the emergence of new archival formats, such as photographs, audio and video recordings, and electronic records. The rise of digital technologies has transformed archival practices, requiring archivists to develop new methods for preserving and accessing digital information. Digital archives have become increasingly important, as more records are created and stored electronically. The challenges of preserving digital information, such as format obsolescence and data migration, have become central to archival work.',
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

            {/* SECTION 7: Basic Archival Functions */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Archival Functions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Appraisal and Acquisition',
                    icon: <Target size={16} />,
                    content: 'Appraisal is the process of evaluating records to determine their archival value and selecting those that warrant permanent preservation. This involves assessing the records\' historical, legal, administrative, and evidential significance. Acquisition is the process of transferring records to the archives, either through donation, transfer, or purchase. This function ensures that archives acquire records that are relevant to their mission and that document significant aspects of history and culture.',
                  },
                  {
                    title: '2. Arrangement and Description',
                    icon: <ListChecks size={16} />,
                    content: 'Arrangement involves organizing records according to archival principles, such as provenance (origin) and original order (the order in which the records were created or used). This ensures that records are maintained in their original context and that their relationships to each other are preserved. Description involves creating finding aids, such as inventories, catalogues, and indexes, that describe the records and facilitate access.',
                  },
                  {
                    title: '3. Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: 'Preservation involves taking measures to ensure the long-term survival of archival materials. This includes controlling environmental conditions (temperature, humidity, light), preventing physical damage, and implementing disaster preparedness plans. Conservation involves treating damaged or deteriorated records to restore them to a stable condition. This may include cleaning, repairing, and rehousing records in archival-quality materials.',
                  },
                  {
                    title: '4. Reference and Access',
                    icon: <Users size={16} />,
                    content: 'Reference involves providing access to archival materials for researchers, scholars, and the public. This includes responding to inquiries, providing research assistance, and facilitating access to records in reading rooms or online. Access involves establishing policies and procedures for accessing records, including any restrictions related to privacy, security, or legal requirements. Archivists balance the need to provide access with the need to protect records.',
                  },
                  {
                    title: '5. Outreach and Education',
                    icon: <BookOpen size={16} />,
                    content: 'Outreach involves promoting the use of archives and educating the public about their value. This may include exhibitions, lectures, workshops, and online resources. Education involves using archives to support teaching and learning, both within formal educational settings and in informal public programs. Archivists play a vital role in connecting the public with archival materials and fostering an appreciation for history and culture.',
                  },
                  {
                    title: '6. Digital Preservation and Access',
                    icon: <Database size={16} />,
                    content: 'With the increasing prevalence of digital records, archives must address the challenges of digital preservation and access. This involves developing strategies for preserving digital records in a variety of formats, ensuring their long-term accessibility, and managing the risks of format obsolescence and data loss. Archivists must also develop methods for providing access to digital records, including online access and digital exhibits.',
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

            {/* SECTION 8: General Structure of an Archives Institution */}
            <div
              ref={(el) => {
                sectionRefs.current['structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                General Structure of an Archives Institution
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Administration and Management',
                    icon: <Building size={16} />,
                    content: 'At the top of the organizational structure is the administration and management team, responsible for the overall direction and operation of the archives. This team, led by a director or archivist-in-charge, oversees strategic planning, policy development, budget management, and staff supervision. They ensure that the archives operate in accordance with its mandate, legal requirements, and professional standards.',
                  },
                  {
                    title: '2. Acquisition and Appraisal',
                    icon: <Target size={16} />,
                    content: 'This department focuses on the acquisition and appraisal of archival materials. Staff in this area work to identify, evaluate, and acquire records that align with the archives\' collecting policy. They conduct research, negotiate donations or transfers, and appraise records to determine their archival value. They also manage the legal and administrative aspects of acquisitions.',
                  },
                  {
                    title: '3. Arrangement and Description',
                    icon: <ListChecks size={16} />,
                    content: 'The arrangement and description department are responsible for organizing and describing archival materials to make them accessible to researchers. Staff in this area arrange records according to archival principles, such as provenance and original order, and create finding aids, such as inventories, catalogues, and indexes. They also ensure that records are properly labelled and stored.',
                  },
                  {
                    title: '4. Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: 'This department focuses on the long-term preservation and conservation of archival materials. Staff in this area monitor environmental conditions, implement preservation measures, and treat damaged or deteriorated records. They also develop and implement disaster preparedness plans. This department ensures that records are protected from physical and environmental damage.',
                  },
                  {
                    title: '5. Reference and Access',
                    icon: <Users size={16} />,
                    content: 'The reference and access department provides access to archival materials for researchers, scholars, and the public. Staff in this area respond to inquiries, provide research assistance, and manage the reading room or online access platforms. They also enforce access restrictions and ensure that records are used responsibly.',
                  },
                  {
                    title: '6. Digital Archives and Technology',
                    icon: <Database size={16} />,
                    content: 'Increasingly, archives institutions include a department dedicated to digital archives and technology. This area focuses on the preservation and management of digital records, as well as the implementation of technology to enhance access and discovery. Staff in this area manage digital preservation systems, develop online finding aids, and provide technical support for digital resources.',
                  },
                  {
                    title: '7. Outreach and Education',
                    icon: <BookOpen size={16} />,
                    content: 'The outreach and education department promotes the use of archives and educates the public about their value. Staff in this area develop and implement exhibitions, lectures, workshops, and educational programs. They also create online resources and engage with the community through social media and other platforms.',
                  },
                  {
                    title: '8. Support Services',
                    icon: <Layers size={16} />,
                    content: 'In addition to the core archival functions, archives institutions often include support services such as finance, human resources, and facilities management. These departments provide essential administrative and logistical support to ensure the smooth operation of the archives. They handle tasks such as budgeting, payroll, recruitment, and building maintenance.',
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

            {/* SECTION 9: Responsibilities of Archival Staff */}
            <div
              ref={(el) => {
                sectionRefs.current['responsibilities'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Responsibilities of Archival Staff
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Appraisal and Acquisition of Records',
                    icon: <Target size={16} />,
                    content: 'Archival staff are responsible for evaluating records to determine their archival value and selecting those that warrant permanent preservation. This involves conducting research, analysing records, and applying established appraisal criteria. They also negotiate and manage the acquisition of records through donations, transfers, or purchases, ensuring that the archives acquire materials that align with their collecting policy.',
                  },
                  {
                    title: '2. Arrangement and Description of Archival Materials',
                    icon: <ListChecks size={16} />,
                    content: 'Archivists arrange records according to archival principles, such as provenance and original order, to maintain their context and relationships. They create detailed finding aids, including inventories, catalogues, and indexes, to describe the records and facilitate access. This process requires meticulous attention to detail and a thorough understanding of archival description standards.',
                  },
                  {
                    title: '3. Preservation and Conservation of Records',
                    icon: <Shield size={16} />,
                    content: 'Archival staff are responsible for ensuring the long-term preservation of archival materials. This involves monitoring environmental conditions, implementing preservation measures, and treating damaged or deteriorated records. They develop and implement disaster preparedness plans to protect records from potential hazards. This responsibility requires knowledge of conservation techniques and best practices for archival storage.',
                  },
                  {
                    title: '4. Reference and Research Assistance',
                    icon: <Users size={16} />,
                    content: 'Archival staff provide reference services to researchers, scholars, and the public, assisting them in locating and accessing relevant materials. They respond to inquiries, conduct research, and provide guidance on using archival resources. This requires excellent communication and research skills, as well as a thorough knowledge of the archives\' holdings.',
                  },
                  {
                    title: '5. Digital Archives Management',
                    icon: <Database size={16} />,
                    content: 'With the increasing prevalence of digital records, archival staff are responsible for managing and preserving digital materials. This involves developing strategies for digital preservation, ensuring long-term accessibility, and managing the risks of format obsolescence and data loss. They also implement technologies for digital asset management and online access.',
                  },
                  {
                    title: '6. Outreach and Education',
                    icon: <BookOpen size={16} />,
                    content: 'Archival staff engage in outreach and education activities to promote the use of archives and educate the public about their value. This may involve developing exhibitions, conducting workshops, giving presentations, and creating online resources. They also collaborate with educators to integrate archival materials into educational programs.',
                  },
                  {
                    title: '7. Records Management Consultation',
                    icon: <FileText size={16} />,
                    content: 'Archival staff often provide records management consultation to organizations and individuals, advising them on best practices for creating, managing, and preserving records. This may involve developing records retention schedules, implementing records management systems, and providing training on records management principles.',
                  },
                  {
                    title: '8. Administrative and Management Duties',
                    icon: <Building size={16} />,
                    content: 'Depending on their position, archival staff may also be responsible for administrative and management duties, such as budgeting, planning, and staff supervision. This ensures the smooth operation of the archives and the effective use of resources. This responsibility requires strong organizational and management skills.',
                  },
                  {
                    title: '9. Community Engagement',
                    icon: <Users size={16} />,
                    content: 'Archival staff also engage with local communities to increase awareness of the archives, and to collect materials that are relevant to the community. This involvement can take many forms, including collaborating with local historical societies, hosting events, and giving presentations. This helps to build positive relationships with the community, and also helps to build the archives collections.',
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

            {/* SECTION 10: Public Programming */}
            <div
              ref={(el) => {
                sectionRefs.current['programming'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Public Programming
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Public programming refers to a range of planned activities and events designed to engage and inform the general public. These programs are typically offered by institutions such as: Libraries, Archives, Museums, Cultural centres, and Educational institutions.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Goal of Public Programming',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Increase public awareness and understanding of the institution's resources and mission.</li>
                          <li>Provide educational and cultural experiences.</li>
                          <li>Foster community engagement and participation.</li>
                          <li>Promote access to information and knowledge.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Common Examples',
                    icon: <ListChecks size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Lectures and seminars</li>
                          <li>Workshops and demonstrations</li>
                          <li>Exhibitions and displays</li>
                          <li>Guided tours</li>
                          <li>Film screenings</li>
                          <li>Community outreach programs</li>
                          <li>Online resources and digital initiatives</li>
                        </ul>
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

            {/* SECTION 11: Resources Required for Sustainable Outreach */}
            <div
              ref={(el) => {
                sectionRefs.current['resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Resources Required for a Sustainable Outreach Programme
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Human Resources: Skilled Staff/Volunteers',
                    icon: <Users size={16} />,
                    content: 'A sustainable outreach program relies heavily on the dedication and expertise of its human resources. This includes paid staff who possess the necessary skills in program development, community engagement, communication, and administration. Volunteers can also play a crucial role, providing valuable support and extending the program\'s reach. Regular training and professional development are essential to ensure staff and volunteers are equipped with the latest knowledge and techniques.',
                  },
                  {
                    title: '2. Financial Resources: Stable and Diversified Funding',
                    icon: <Scale size={16} />,
                    content: 'Financial stability is crucial for the longevity of any outreach program. This involves securing a diverse range of funding sources, including grants, donations, sponsorships, and earned income. Relying on a single funding source can create vulnerability, so a diversified approach is essential. Developing a robust fundraising strategy, including grant writing, donor cultivation, and event planning, is vital.',
                  },
                  {
                    title: '3. Physical Resources: Accessible Space and Equipment',
                    icon: <Building size={16} />,
                    content: 'The physical resources required for an outreach program can vary depending on its nature and scope. This may include a dedicated space for program activities, such as a classroom, workshop, or community centre. Accessible locations are crucial for reaching target audiences. Equipment, such as computers, projectors, sound systems, and materials for workshops or demonstrations, is also essential.',
                  },
                  {
                    title: '4. Technological Resources: Digital Tools and Platforms',
                    icon: <Database size={16} />,
                    content: 'In today\'s digital age, technological resources are indispensable for outreach programs. This includes access to computers, internet connectivity, and software for communication, data management, and program delivery. Social media platforms, websites, and email marketing tools can be used to reach a wider audience and promote program activities.',
                  },
                  {
                    title: '5. Community Partnerships: Collaborative Networks',
                    icon: <Users size={16} />,
                    content: 'Building strong community partnerships is essential for a sustainable outreach program. Collaborating with other organizations, such as schools, libraries, community centres, and local businesses, can expand the program\'s reach and impact. Developing and maintaining positive relationships with community leaders, stakeholders, and participants is crucial for building trust and support.',
                  },
                  {
                    title: '6. Marketing and Communication Resources',
                    icon: <BookOpen size={16} />,
                    content: 'Effective marketing and communication are vital for promoting the outreach program and reaching target audiences. This involves developing clear and compelling messaging that highlights the program\'s benefits and impact. Utilizing a variety of communication channels, such as social media, websites, newsletters, and local media, is essential for reaching a diverse audience.',
                  },
                  {
                    title: '7. Evaluation and Data Collection Resources',
                    icon: <ListChecks size={16} />,
                    content: 'To ensure sustainability, outreach programs must demonstrate their impact and effectiveness. This requires establishing clear goals and objectives, developing evaluation metrics, and collecting data on program outcomes. Utilizing surveys, feedback forms, and other data collection tools can help measure participant satisfaction and program impact.',
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

            {/* SECTION 12: Strategies to Take Archives to The People */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies to Take Archives to The People
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Digital Exhibitions and Online Resources',
                    icon: <Database size={16} />,
                    content: 'Creating digital exhibitions and online resources can make archival materials accessible to a wider audience, regardless of geographical location. This involves digitizing documents, photographs, and other archival items and presenting them in an engaging online format. Interactive exhibits, virtual tours, and searchable databases can bring history to life and make it easily accessible.',
                  },
                  {
                    title: '2. Pop-Up Archives and Mobile Exhibitions',
                    icon: <Building size={16} />,
                    content: 'Taking archives out of their traditional settings and into community spaces can create unexpected encounters with history. Pop-up archives in libraries, community centres, or public spaces can showcase local history and engage people in conversations about their past. Mobile exhibitions, such as traveling displays or interactive kiosks, can bring archival materials to schools, festivals, and other events.',
                  },
                  {
                    title: '3. Community-Based Archiving Projects',
                    icon: <Users size={16} />,
                    content: 'Involving community members in archiving projects can empower them to preserve their own history and contribute to the archives\' collections. This can include oral history projects, digitization initiatives, and collaborative exhibitions. Community members can share their knowledge, stories, and personal collections, enriching the archives\' holdings and fostering a sense of ownership.',
                  },
                  {
                    title: '4. Educational Workshops and Programs',
                    icon: <GraduationCap size={16} />,
                    content: 'Offering educational workshops and programs can make archives relevant and engaging for diverse audiences. This can include workshops on genealogy, local history research, or digital storytelling. Programs for students and teachers can integrate archival materials into curriculum and provide hands-on learning experiences.',
                  },
                  {
                    title: '5. Social Media and Online Engagement',
                    icon: <Users size={16} />,
                    content: 'Utilizing social media platforms and online engagement tools can help archives connect with a wider audience and promote their collections. Sharing interesting stories, photographs, and documents on social media can spark curiosity and encourage people to explore the archives further. Online forums and discussion groups can create spaces for people to share their memories and connect with their history.',
                  },
                  {
                    title: '6. Collaborative Projects with Artists and Creators',
                    icon: <BookOpen size={16} />,
                    content: 'Collaborating with artists, writers, filmmakers, and other creators can bring archival materials to life in new and imaginative ways. Artists can use archival materials as inspiration for their work, creating exhibitions, performances, and multimedia projects. This strategy can help to reinterpret archival records for a modern audience and create new ways to engage with the archives.',
                  },
                  {
                    title: '7. Public Events and Celebrations',
                    icon: <Users size={16} />,
                    content: 'Hosting public events and celebrations can make archives a focal point for community gatherings. This can include historical re-enactments, film screenings, lectures, and festivals. These events can attract diverse audiences and create opportunities for people to learn about their history and connect with their community.',
                  },
                  {
                    title: '8. Gamification and Interactive Experiences',
                    icon: <Layers size={16} />,
                    content: 'Developing gamified experiences and interactive activities can make archives more engaging and accessible for younger audiences. This can include online games, scavenger hunts, and interactive exhibits that encourage exploration and discovery. This strategy can make archives fun and educational and help to break down stereotypes about archives.',
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

            {/* SECTION 13: Skills and Strategies in Publicising Archival Products */}
            <div
              ref={(el) => {
                sectionRefs.current['publicising'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Skills and Strategies in Publicising Archival Products and Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Targeted Digital Marketing and Social Media',
                    icon: <Database size={16} />,
                    content: 'Leverage digital marketing tools and social media platforms to reach specific audiences. This involves creating engaging content tailored to different demographics, such as students, researchers, genealogists, or local history enthusiasts. Use platforms like Facebook, Twitter, Instagram, and YouTube to share digitized archival materials, behind-the-scenes glimpses, and interactive content. Employ targeted advertising campaigns to reach specific interest groups.',
                  },
                  {
                    title: '2. Development of High-Quality Digital Exhibits',
                    icon: <Layers size={16} />,
                    content: 'Create visually appealing and user-friendly digital exhibits and online resources. This includes digitizing key archival materials and presenting them in an interactive and informative format. Utilize storytelling techniques to connect with audiences on an emotional level. Develop searchable databases and online finding aids to make archival materials easily discoverable. Offer virtual tours and online lectures to extend the reach of physical exhibits.',
                  },
                  {
                    title: '3. Collaboration with Local Media and Press Releases',
                    icon: <Users size={16} />,
                    content: 'Cultivate relationships with local media outlets, including newspapers, radio stations, and television channels. Issue press releases about new acquisitions, exhibits, and events. Offer media tours and interviews to showcase the archives\' collections and services. Provide high-resolution images and video footage to support media coverage.',
                  },
                  {
                    title: '4. Educational Programs and Workshops',
                    icon: <GraduationCap size={16} />,
                    content: 'Develop educational programs and workshops that cater to diverse audiences, including students, teachers, and community groups. Offer hands-on activities, research workshops, and lectures on historical topics. Collaborate with schools and universities to integrate archival materials into curriculum. Provide training on archival research methods and digital literacy.',
                  },
                  {
                    title: '5. Community Outreach and Partnerships',
                    icon: <Users size={16} />,
                    content: 'Engage with local community groups, historical societies, and cultural organizations. Participate in community events and festivals to showcase the archives\' collections. Develop collaborative projects that involve community members in archiving and storytelling. For example, an oral history project could involve community members in recording and preserving their own stories.',
                  },
                  {
                    title: '6. Gamification and Interactive Experiences',
                    icon: <Layers size={16} />,
                    content: 'Develop gamified experiences and interactive activities to make archives more engaging for younger audiences. This can include online games, scavenger hunts, and interactive exhibits that encourage exploration and discovery. Utilize augmented reality (AR) and virtual reality (VR) technologies to create immersive experiences.',
                  },
                  {
                    title: '7. Targeted Publications and Newsletters',
                    icon: <FileText size={16} />,
                    content: 'Produce high-quality publications and newsletters that highlight the archives\' collections and services. This can include printed brochures, online newsletters, and scholarly journals. Tailor publications to specific audiences, such as researchers, genealogists, or local history enthusiasts. Share stories, research findings, and archival highlights.',
                  },
                  {
                    title: '8. User-Friendly Website and Online Catalogue',
                    icon: <Building size={16} />,
                    content: 'Ensure the archives\' website is user-friendly, informative, and visually appealing. Develop a comprehensive online catalogue that allows users to search and browse archival materials. Provide clear and concise information about access policies, research services, and upcoming events. Utilize responsive design to ensure the website is accessible on all devices.',
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
                  💡 Archival Insight
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
                  <span>Archival Terms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Archive Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Archival Functions</span>
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
                Archival terms: Fonds, Archives, Records, Provenance, Original Order, Series. Archives preserve cultural heritage, support research, ensure accountability, facilitate legal functions, promote education, and protect rights. Categories include governmental, institutional, personal, religious, business, specialised, and digital. Core functions: Appraisal, Acquisition, Preservation, Reference, Outreach, Description. Public programming and outreach strategies make archives accessible and engaging for all.
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
                <strong className="text-white">Archival Terms</strong> – Fonds, Archives, Records, Provenance, Original Order, and Series are fundamental concepts that guide the organisation, preservation, and interpretation of archival materials.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Use of Archives</strong> – Archives preserve cultural heritage, support research, ensure accountability, facilitate legal functions, promote education, support development, and protect individual rights and memories.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Categories &amp; Functions</strong> – Archives include governmental, institutional, personal, religious, business, specialised, and digital categories. Core functions: Appraisal, Acquisition, Preservation, Reference, Outreach, Description, and Digital Preservation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Public Programming &amp; Outreach</strong> – Strategies include digital exhibitions, pop-up archives, community projects, educational programs, social media engagement, collaborations with artists, public events, gamification, and targeted marketing to make archives accessible to all.
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
            Sidemann Academic Registry • Archives &amp; Public Programming Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;