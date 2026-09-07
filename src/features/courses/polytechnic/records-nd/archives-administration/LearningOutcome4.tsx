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
  FolderTree,
  Handshake,
  DollarSign,
  Package,
  Copy,
  User,
  Layers,
  Building,
  Globe,
  AlertCircle,
  ListChecks,
  Layout,
  Lock,
  Tag,
  Share2,
  Users,
  Settings,
  Award,
  MessageSquare,
  Brain,
  Heart,
  Landmark,
  Film,
  Image,
  Music,
  ThumbsDown,
  Server,
  HelpCircle,
  Zap,
  ThumbsUp,
  ClipboardIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'naz-role', label: 'NAZ Role & Functions' },
  { id: 'naz-services', label: 'NAZ Services' },
  { id: 'naz-sections', label: 'NAZ Sections' },
  { id: 'naz-relationships', label: 'NAZ & Other Institutions' },
  { id: 'ica', label: 'ICA Role & Functions' },
  { id: 'ica-esarbica-iasa-unesco', label: 'ICA, ESARBICA, IASA, UNESCO' },
  { id: 'naz-act', label: 'NAZ Act 1986' },
  { id: 'naz-act-provisions', label: 'NAZ Act Provisions' },
  { id: 'naz-act-strengths-weaknesses', label: 'Strengths & Weaknesses' },
  { id: 'archivist-code-ethics', label: 'Archivist Code of Ethics' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'The National Archives of Zimbabwe was established in 1935, long before the country gained independence, and has been the custodian of the nation\'s documentary heritage ever since.',
      },
      {
        title: 'Pro Tip',
        text: 'When applying the Archivist\'s Code of Ethics, always document your decision‑making process, especially when dealing with sensitive or controversial materials.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of the ICA\'s mission: "A‑S‑C" – Advocacy, Standards, and Collaboration. Each is essential for advancing the archival profession globally.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archivists overlook the importance of regularly reviewing and updating national archival legislation; outdated laws can hinder modern records management and digital preservation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The National Archives of Zimbabwe was established in 1935, long before the country gained independence, and has been the custodian of the nation\'s documentary heritage ever since.',
      },
      {
        title: 'Pro Tip',
        text: 'When applying the Archivist\'s Code of Ethics, always document your decision‑making process, especially when dealing with sensitive or controversial materials.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of the ICA\'s mission: "A‑S‑C" – Advocacy, Standards, and Collaboration. Each is essential for advancing the archival profession globally.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archivists overlook the importance of regularly reviewing and updating national archival legislation; outdated laws can hinder modern records management and digital preservation.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            National Archives, International Bodies —{' '}
            <span className="text-amber-300 font-bold italic">
              &amp; Professional Ethics
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to the National Archives of Zimbabwe, ICA, ESARBICA, IASA, UNESCO,
            the NAZ Act, and the Archivist's Code of Ethics.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Landmark size={14} className="inline mr-1" /> NAZ
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> ICA
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Ethics
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
                placeholder="Search for NAZ, ICA, ESARBICA, ethics, act..."
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
            {/* SECTION 1: Role and Functions of NAZ */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-role'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role and Functions of the National Archives of Zimbabwe (NAZ)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe (NAZ) serves as the nation's primary custodian of its
                    documentary heritage, playing a critical role in preserving and making accessible the
                    records that chronicle the country's history, culture, and administrative functions. Its
                    role extends beyond mere storage, encompassing a wide range of functions that contribute
                    to national identity, historical research, and government accountability.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          A core function of the NAZ is the preservation and conservation of archival materials.
                          This involves implementing measures to protect records from physical deterioration,
                          environmental damage, and other threats. They ensure that documents, photographs, maps,
                          audio‑visual recordings, and digital files are stored in controlled environments that
                          maintain stable temperature and humidity levels. They also employ conservation techniques
                          to repair and restore damaged materials, ensuring their long‑term survival. This
                          proactive approach to preservation safeguards Zimbabwe's documentary heritage for
                          future generations.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Acquisition and Collection Development',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>
                          The NAZ actively acquires and collects records of enduring value from various sources,
                          including government agencies, private organizations, and individuals. They develop and
                          implement acquisition policies that guide the selection of materials, ensuring that the
                          collections reflect the diverse aspects of Zimbabwe's history and culture. This process
                          of collection development is crucial for building a comprehensive and representative
                          archive. Legal deposit laws ensure that published works are also deposited into the
                          archives.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Organization and Description',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p>
                          Once acquired, archival materials must be organized and described to facilitate access
                          and retrieval. The NAZ employs archival principles, such as provenance and original
                          order, to arrange records in a logical and meaningful way. They create finding aids,
                          indexes, and other descriptive tools that provide researchers with information about
                          the contents and context of the collections. This organization and description process
                          transforms raw materials into accessible resources for research and scholarship.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Provision of Reference Services',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          The NAZ provides reference services to researchers, scholars, students, and the general
                          public. This involves assisting users in identifying relevant materials, interpreting
                          archival descriptions, and providing guidance on research strategies. Reference
                          archivists possess expertise in the archive's holdings and are skilled in helping users
                          navigate complex collections. They also answer reference inquiries received through
                          various channels, including in‑person visits, telephone calls, and electronic
                          communication.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Records Management',
                    icon: <ClipboardIcon size={16} />,
                    content: (
                      <>
                        <p>
                          The NAZ plays a crucial role in promoting effective records management practices within
                          government agencies. This involves providing guidance on the creation, maintenance, and
                          disposal of records, ensuring that essential information is preserved and that
                          unnecessary records are destroyed. They also assist government agencies in implementing
                          records management systems and procedures. This function is vital for ensuring government
                          accountability and transparency.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Cultural and Educational Outreach',
                    icon: <Share2 size={16} />,
                    content: (
                      <>
                        <p>
                          The NAZ engages in cultural and educational outreach activities to promote awareness of
                          Zimbabwe's history and heritage. This includes organizing exhibitions, public programs,
                          and educational workshops. They also collaborate with schools and universities to provide
                          educational resources and support research projects. This outreach helps to foster a
                          sense of national identity and promote historical literacy.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Legal and Administrative Functions',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          As a national archive, the NAZ must also adhere to all relevant laws and regulations.
                          It also plays a role in ensuring government accountability and transparency by preserving
                          official records. They also provide records management services to government agencies,
                          ensuring that records are properly created, maintained, and disposed of.
                        </p>
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

            {/* SECTION 2: Services Provided by NAZ */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-services'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Services Provided by the National Archives of Zimbabwe (NAZ)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe offers a diverse range of services designed to facilitate
                    access to its collections, promote historical research, and contribute to national heritage
                    preservation. These services cater to a broad audience, including researchers, scholars,
                    students, government agencies, and the general public.
                  </p>
</div>

              {renderCard(
                'Key Services',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Reference Services:</strong> The NAZ provides comprehensive reference services to
                    assist researchers in locating and utilizing archival materials. This includes conducting
                    reference interviews to clarify research inquiries, providing guidance on finding aids and
                    research strategies, and answering questions related to the archive's holdings. Reference
                    archivists possess expertise in the collections and are available to provide personalized
                    assistance to researchers. This service is the main point of contact for members of the
                    public.
                  </li>
                  <li>
                    <strong>Research Facilities:</strong> The NAZ offers research facilities, such as reading
                    rooms, where researchers can examine original archival materials. These facilities are
                    equipped with necessary equipment and resources, including microfilm readers, computers, and
                    access to online databases. The NAZ also provides a controlled environment that is suitable
                    for researchers.
                  </li>
                  <li>
                    <strong>Reproduction Services:</strong> To facilitate research and preservation, the NAZ
                    offers reproduction services, including photocopying, scanning, and digital imaging. This
                    allows researchers to obtain copies of relevant materials for their research while minimizing
                    handling of fragile originals. This service also allows for the preservation of at‑risk
                    documents, via digitization.
                  </li>
                  <li>
                    <strong>Exhibitions and Public Programs:</strong> The NAZ organizes exhibitions and public
                    programs to showcase its collections and promote awareness of Zimbabwe's history and cultural
                    heritage. These events may include lectures, workshops, and educational tours. These services
                    help to connect the public with the archives.
                  </li>
                  <li>
                    <strong>Records Management Services:</strong> The NAZ provides records management services to
                    government agencies, assisting them in the creation, maintenance, and disposal of records.
                    This includes providing guidance on records management policies and procedures, as well as
                    offering training and support. This service is very important for the efficient running of
                    government organizations.
                  </li>
                  <li>
                    <strong>Educational Outreach:</strong> The NAZ engages in educational outreach activities,
                    collaborating with schools, universities, and other educational institutions to provide
                    resources and support research projects. This includes providing access to archival materials
                    for educational purposes and conducting workshops for students and teachers.
                  </li>
                  <li>
                    <strong>Conservation and Preservation Services:</strong> The NAZ has conservation labs, and
                    trained staff, that work to preserve at‑risk documents. This can include, but is not limited
                    to, cleaning, and repairing documents.
                  </li>
                  <li>
                    <strong>Digital Services:</strong> The NAZ is working to provide increased digital access to
                    its holdings. This includes the digitization of at‑risk documents, and the creation of digital
                    finding aids.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 3: Different Sections at NAZ */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-sections'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Different Sections at the National Archives of Zimbabwe (NAZ)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe is structured into various sections, each playing a vital
                    role in fulfilling the institution's mandate of preserving and providing access to the
                    nation's documentary heritage. These sections work collaboratively to ensure the effective
                    management of archival materials and the delivery of diverse services.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Public Archives and Research Section',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          This section acts as the primary interface between the archives and the public. It is
                          responsible for providing reference services, assisting researchers in locating and
                          accessing relevant archival materials. Staff within this section conduct reference
                          interviews, guide researchers through finding aids, and offer expert advice on research
                          strategies. The reading room, where researchers can examine original documents, is
                          managed by this section. This section is essential for promoting research and
                          scholarship by facilitating access to the archives' vast holdings.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Records Services Section',
                    icon: <ClipboardIcon size={16} />,
                    content: (
                      <>
                        <p>
                          This section focuses on the management of current and semi‑current records generated by
                          government ministries and departments. It provides guidance and support to these entities
                          on records creation, maintenance, and disposal, ensuring that essential government records
                          are properly managed. This section plays a crucial role in promoting accountability and
                          transparency within the government by ensuring that records are created and maintained in
                          accordance with established standards. Effective records management practices implemented
                          by this section are vital for the efficient functioning of government operations.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Film and Sound Archives Section',
                    icon: <Film size={16} />,
                    content: (
                      <>
                        <p>
                          This section is dedicated to the preservation and accessibility of audio‑visual materials,
                          including films, sound recordings, and oral histories. It encompasses several specialized
                          units, such as the Audiovisual Unit, Oral History Unit, Reprography, and Conservation.
                          The Audiovisual Unit manages the collection of films and sound recordings, while the Oral
                          History Unit focuses on capturing and preserving oral testimonies that document Zimbabwe's
                          history and culture. Reprography handles the reproduction of archival materials, and
                          Conservation focuses on preserving the physical integrity of film and sound recordings.
                          This section ensures that Zimbabwe's audio‑visual heritage is preserved for future
                          generations.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Library Section',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          The library section complements the archival collections by providing access to published
                          materials, such as books, periodicals, and government publications. It serves as a
                          valuable resource for researchers, offering contextual information and supplementary
                          materials that enhance their understanding of archival records. The library's holdings
                          are carefully selected to support the research needs of users and to provide a
                          comprehensive overview of Zimbabwean history and culture.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Human Resources Management and Finance and Administration Sections',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          These sections handle the internal administrative functions of the NAZ, ensuring the
                          smooth operation of the institution. The Human Resources Management section deals with
                          staffing, recruitment, and employee relations, while the Finance and Administration
                          section manages the institution's budget, procurement, and other administrative tasks.
                          These sections are essential for supporting the operational efficiency and sustainability
                          of the NAZ.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Information Communication Technology (ICT) Section',
                    icon: <Server size={16} />,
                    content: (
                      <>
                        <p>
                          This section is responsible for the NAZ's digital infrastructure, including the
                          management of digital records, the development of online databases, and the
                          implementation of digital preservation strategies. It plays a vital role in enhancing
                          access to archival materials through digitization and online platforms. This section is
                          increasingly important for the NAZ to stay current with modern archival practices.
                        </p>
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

            {/* SECTION 4: Relationship of NAZ with other institutions */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-relationships'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Relationship of the National Archives of Zimbabwe (NAZ) with Museums, Libraries, Galleries, Registries, and Records Centres
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe (NAZ) maintains distinct yet interconnected relationships
                    with museums, libraries, galleries, registries, and records centres, each playing a
                    complementary role in preserving and providing access to cultural and informational resources.
                    While each institution has its unique mandate, they often collaborate and share resources to
                    enhance their collective impact.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'NAZ and Museums',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>
                          NAZ and museums both contribute to the preservation of cultural heritage, but they focus
                          on different types of materials. Museums primarily collect and exhibit physical objects,
                          artifacts, and artworks, while NAZ focuses on documentary materials such as written
                          records, photographs, and audio‑visual recordings. However, there is often overlap and
                          collaboration. For instance, museums may hold archival documents related to their
                          collections, and NAZ may hold photographs or films of museum artifacts. They may also
                          collaborate on exhibitions, research projects, and educational programs.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'NAZ and Libraries',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          NAZ and libraries both play a crucial role in providing access to information, but they
                          differ in the types of materials they collect and the services they provide. Libraries
                          primarily focus on published materials, such as books, periodicals, and electronic
                          resources, while NAZ focuses on unpublished archival records. NAZ's library section,
                          however, does have published works, that provide context to the archival holdings. Both
                          institutions serve researchers and the public, and they may collaborate on research
                          projects, information literacy programs, and resource sharing.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'NAZ and Galleries',
                    icon: <Image size={16} />,
                    content: (
                      <>
                        <p>
                          Galleries primarily focus on the exhibition and preservation of visual art. NAZ, on the
                          other hand, preserves documentary evidence, which can include photographic and filmic art.
                          Collaboration may occur when galleries require historical documentation related to
                          artworks or artists, or when NAZ holds archival materials related to the history of art in
                          Zimbabwe.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'NAZ and Registries',
                    icon: <ClipboardIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Registries, such as those that handle land titles, vital records, or business
                          registrations, are primarily concerned with maintaining official records for legal and
                          administrative purposes. NAZ, on the other hand, preserves records of enduring historical
                          value. There is a clear distinction in their functions, but there is also a necessary
                          link. Registries may transfer records to NAZ after they are no longer actively used for
                          administrative purposes, ensuring their long‑term preservation. NAZ, in turn, may provide
                          access to historical registry records for research purposes.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'NAZ and Records Centres',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>
                          Records centres serve as intermediate repositories for semi‑current records that are no
                          longer actively used by government agencies but are not yet ready for permanent
                          preservation. NAZ, on the other hand, is responsible for the permanent preservation of
                          archival records. Records centres act as a bridge between active records and archival
                          records. They ensure that records are properly managed during their semi‑current phase
                          and that only records of enduring value are transferred to NAZ. This relationship is
                          crucial for ensuring the efficient management of government records and the preservation
                          of essential information.
                        </p>
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

            {/* SECTION 5: ICA Role and Functions */}
            <div
              ref={(el) => {
                sectionRefs.current['ica'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assessing the Role and Functions of the International Council on Archives (ICA)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The International Council on Archives (ICA) is a global organization dedicated to the
                    preservation and accessibility of archival materials worldwide. Its role is multifaceted,
                    encompassing advocacy, standard‑setting, professional development, and international
                    collaboration. The ICA serves as a vital platform for archivists and archival institutions
                    to exchange knowledge, develop best practices, and promote the importance of archives in
                    society.
                  </p>
</div>

              {renderCard(
                'Key Roles of the ICA',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Advocacy and Promotion of Archives:</strong> The ICA plays a crucial role in
                    advocating for the importance of archives at the international level. It raises awareness
                    of the value of archival records for research, accountability, cultural heritage, and memory.
                    The ICA works with international organizations, governments, and other stakeholders to promote
                    policies and initiatives that support the preservation and accessibility of archives. It also
                    highlights the role of archives in promoting transparency, democracy, and human rights. By
                    advocating for archives, the ICA helps to ensure that these vital resources are recognized and
                    supported globally.
                  </li>
                  <li>
                    <strong>Development of Professional Standards and Best Practices:</strong> The ICA develops
                    and disseminates professional standards, guidelines, and best practices for archival management.
                    These standards cover various aspects of archival work, including acquisition, arrangement,
                    description, preservation, and access. By promoting the adoption of these standards, the ICA
                    helps to ensure consistency and quality in archival practice worldwide. These standards are
                    important, because they help to ensure that archives are managed correctly, regardless of
                    location.
                  </li>
                  <li>
                    <strong>Facilitation of International Collaboration and Knowledge Sharing:</strong> The ICA
                    provides a platform for archivists and archival institutions to collaborate and exchange
                    knowledge. It organizes conferences, workshops, and other events that bring together
                    professionals from around the world. The ICA also supports international projects and
                    initiatives that promote archival development. This collaboration helps to build capacity,
                    share expertise, and address common challenges faced by archives.
                  </li>
                  <li>
                    <strong>Support for Archival Development and Capacity Building:</strong> The ICA provides
                    support for archival development and capacity building, particularly in developing countries.
                    This includes providing training, technical assistance, and resources to archival institutions.
                    The ICA also works to promote the development of archival education programs and to support the
                    professional development of archivists. By supporting archival development, the ICA helps to
                    ensure that all countries have the capacity to preserve and manage their documentary heritage.
                  </li>
                  <li>
                    <strong>Promotion of Ethical Principles and Professional Conduct:</strong> The ICA promotes
                    ethical principles and professional conduct among archivists. It has developed a Code of
                    Ethics that outlines the responsibilities of archivists in relation to their work, their
                    colleagues, and the public. By promoting ethical conduct, the ICA helps to ensure that
                    archives are managed in a responsible and trustworthy manner.
                  </li>
                  <li>
                    <strong>Representation of the Archival Profession at the International Level:</strong> The ICA
                    represents the archival profession at the international level, working with organizations such
                    as UNESCO, the United Nations, and other international bodies. It provides input on policies
                    and initiatives that affect archives and cultural heritage. By representing the profession,
                    the ICA helps to ensure that the voice of archivists is heard in international forums.
                  </li>
                  <li>
                    <strong>Digital Preservation Advocacy:</strong> In the modern digital age, the ICA has taken
                    on a strong role in advocating for the preservation of digital records. This includes setting
                    standards, providing best practices and training, and working with technology experts. This is
                    very important, as records become increasingly digital.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 6: Relationships between ICA, ESARBICA, IASA, UNESCO */}
            <div
              ref={(el) => {
                sectionRefs.current['ica-esarbica-iasa-unesco'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Relationships Between the ICA, ESARBICA, IASA, and UNESCO
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The International Council on Archives (ICA) operates within a network of related organizations,
                    fostering collaboration and coordination to advance archival practices globally. Its
                    relationships with ESARBICA, IASA, and UNESCO are particularly significant, each contributing
                    to specific aspects of archival work and cultural heritage preservation.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'ICA and ESARBICA',
                    icon: <Globe size={16} />,
                    content: (
                      <>
                        <p>
                          ESARBICA is a regional branch of the ICA, serving archival institutions and professionals
                          in Eastern and Southern Africa. This relationship is crucial for tailoring ICA's global
                          initiatives to the specific needs and challenges of the region.
                        </p>
                        <p className="mt-2">
                          ESARBICA acts as a conduit for disseminating ICA's standards and best practices, providing
                          training and support to its members. It also facilitates regional collaboration, enabling
                          archives in the region to share resources and expertise. This regional focus allows for
                          more targeted assistance, and for the addressing of specific regional archival issues.
                          The ICA and ESARBICA work together to strengthen archival capacity and promote access to
                          documentary heritage in the region.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'ICA and IASA',
                    icon: <Music size={16} />,
                    content: (
                      <>
                        <p>
                          The ICA and IASA have a strong collaborative relationship, particularly in the area of
                          audio‑visual archiving. IASA specializes in the preservation and access of sound and
                          audio‑visual materials, while the ICA provides a broader framework for archival management.
                        </p>
                        <p className="mt-2">
                          They cooperate on developing standards, guidelines, and best practices for the preservation
                          of audio‑visual archives. This collaboration is essential for addressing the unique
                          challenges of preserving these fragile and technologically complex materials. The ICA
                          benefits from IASA's specialized knowledge, while IASA gains from the ICA's broader
                          network and resources. This relationship is very important, as audio visual records are
                          very important historical records.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'ICA and UNESCO',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>
                          The ICA and UNESCO have a close and long‑standing relationship, working together to
                          promote the preservation and accessibility of documentary heritage worldwide. UNESCO
                          recognizes the importance of archives for cultural heritage, education, and research.
                        </p>
                        <p className="mt-2">
                          UNESCO provides support for ICA's initiatives, particularly in developing countries. They
                          collaborate on projects related to archival development, capacity building, and the
                          protection of endangered archives. UNESCO's programs, such as the Memory of the World
                          Programme, align with the ICA's mission to preserve and make accessible documentary
                          heritage. The ICA provides expertise to UNESCO on archival matters, while UNESCO provides
                          political and financial support for archival initiatives. This relationship is very
                          important for the preservation of cultural heritage around the world.
                        </p>
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

            {/* SECTION 7: NAZ Act of 1986 */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-act'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Analyzing the National Archives of Zimbabwe Act of 1986
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe Act of 1986 is the foundational legislation that governs
                    the operations and functions of the National Archives of Zimbabwe (NAZ). Analyzing this Act
                    reveals its crucial role in establishing the legal framework for preserving and providing
                    access to the nation's documentary heritage.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Establishment and Mandate',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>
                          The Act formally establishes the National Archives of Zimbabwe as the principal
                          institution responsible for the preservation and management of public and private records
                          of national significance. It clearly defines the NAZ's mandate, outlining its duties and
                          powers in relation to the acquisition, preservation, and accessibility of archival
                          materials. This legal mandate provides the NAZ with the authority to carry out its
                          functions and to ensure the protection of Zimbabwe's documentary heritage.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Legal Deposit and Acquisition',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          The Act includes provisions for legal deposit, requiring publishers to deposit copies of
                          their publications with the NAZ. This ensures that a comprehensive record of Zimbabwe's
                          published works is preserved. The Act also empowers the NAZ to acquire archival materials
                          from various sources, including government agencies, private organizations, and
                          individuals. This acquisition power is essential for building a diverse and representative
                          archive that reflects the nation's history and culture.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Management of Public Records',
                    icon: <ClipboardIcon size={16} />,
                    content: (
                      <>
                        <p>
                          A significant aspect of the Act is its provisions for the management of public records.
                          It outlines the procedures for the creation, maintenance, and disposal of government
                          records, ensuring that essential information is preserved and that unnecessary records
                          are destroyed. The Act also empowers the NAZ to provide guidance and support to government
                          agencies on records management practices. This function is crucial for promoting
                          accountability and transparency within the government.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Access and Use of Archival Materials',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          The Act addresses the issue of access to archival materials, outlining the rights and
                          responsibilities of researchers and the public. It establishes procedures for accessing
                          records, including provisions for access restrictions on sensitive or confidential
                          information. The Act also addresses issues related to copyright and intellectual property
                          rights. This section is very important to ensure that the public can access records.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Governance and Administration',
                    icon: <Settings size={16} />,
                    content: (
                      <>
                        <p>
                          The Act establishes the governance and administrative structure of the NAZ, outlining the
                          roles and responsibilities of the Director and other staff members. It also addresses
                          issues related to funding, staffing, and other administrative matters. This legal
                          framework ensures the efficient and effective operation of the institution.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Penalties and Enforcement',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p>
                          The act contains sections that deal with penalties, and enforcement of the act. This
                          ensures that the act is followed.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Areas for Potential Improvement',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>
                          While the 1986 Act has served as a valuable foundation, some aspects may require updating
                          to reflect contemporary archival practices and technological advancements. For example,
                          the Act could be strengthened to address the challenges of digital preservation and access.
                          It may also benefit from clearer provisions for the protection of cultural heritage and
                          indigenous knowledge. Furthermore, it might be beneficial to review the Act in light of
                          evolving international best practices in archival management and access.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Overall Impact',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p>
                          The National Archives of Zimbabwe Act of 1986 has played a vital role in establishing the
                          legal framework for the preservation and accessibility of Zimbabwe's documentary heritage.
                          It has provided the NAZ with the necessary authority and resources to carry out its
                          functions and to contribute to the nation's cultural and historical development. While
                          some aspects may require updating, the Act remains a cornerstone of archival practice in
                          Zimbabwe.
                        </p>
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

            {/* SECTION 8: Evaluating the Major Provisions */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-act-provisions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating the Major Provisions of the National Archives of Zimbabwe Act of 1986
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe Act of 1986 provides the legal bedrock for the nation's
                    archival management. Evaluating its major provisions reveals both its strengths and areas
                    that may require modernization.
                  </p>
</div>

              {renderCard(
                'Major Provisions',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Establishment and Core Mandate:</strong> A fundamental strength of the Act lies in
                    its clear establishment of the National Archives of Zimbabwe (NAZ) and the articulation of
                    its core mandate. By legally defining the NAZ's responsibilities for acquiring, preserving,
                    and making accessible the nation's documentary heritage, the Act provides a solid foundation
                    for its operations. This legal clarity is essential for the NAZ to assert its authority and
                    ensure the protection of valuable records.
                  </li>
                  <li>
                    <strong>Legal Deposit and Acquisition Powers:</strong> The inclusion of legal deposit
                    provisions is a significant asset. This ensures that a comprehensive record of Zimbabwe's
                    published intellectual output is systematically collected and preserved. The broad acquisition
                    powers granted to the NAZ are also crucial. This allows the institution to acquire diverse
                    materials from various sources, building a rich and representative historical record. However,
                    the act could potentially be updated to include more modern forms of publication, such as
                    online only publications.
                  </li>
                  <li>
                    <strong>Management of Public Records:</strong> The Act's provisions for the management of
                    public records are essential for government accountability and transparency. By outlining
                    procedures for record creation, maintenance, and disposal, the Act promotes efficient
                    record‑keeping practices within government agencies. The NAZ's role in providing guidance on
                    records management is particularly valuable. However, the act could be updated to include more
                    specific guidance on the management of digital records within government.
                  </li>
                  <li>
                    <strong>Access and Use of Archival Materials:</strong> The Act's provisions for access to
                    archival materials are vital for promoting research and scholarship. By establishing procedures
                    for accessing records, including provisions for access restrictions, the Act seeks to balance
                    public access with the protection of sensitive information. However, this section could be
                    strengthened by providing clearer guidelines on access to digital records and by addressing
                    emerging issues related to data privacy and protection.
                  </li>
                  <li>
                    <strong>Governance and Administration:</strong> The Act's establishment of the NAZ's governance
                    and administrative structure is crucial for ensuring the institution's efficient operation. By
                    defining the roles and responsibilities of the Director and staff, the Act provides a clear
                    framework for decision‑making and accountability. However, it might be beneficial to review
                    the governance structure to ensure it remains aligned with contemporary best practices in
                    public sector management.
                  </li>
                </ul>
              )}

              {renderCard(
                'Areas for Modernization',
                <Zap size={16} />,
                <div>
                  <p>
                    Given the rapid evolution of technology and archival practices, some aspects of the Act
                    require modernization. Notably, the Act's provisions for digital preservation and access are
                    limited. Updating the Act to address the challenges of managing and preserving digital records
                    is crucial for ensuring the long‑term accessibility of Zimbabwe's documentary heritage.
                  </p>
                  <p className="mt-2">
                    Also strengthening sections dealing with cultural protections, and indigenous knowledge would
                    be beneficial.
                  </p>
                </div>
              )}

              {renderCard(
                'Overall Assessment',
                <Award size={16} />,
                <p>
                  The National Archives of Zimbabwe Act of 1986 has provided a valuable legal foundation for the
                  NAZ. Its major provisions have contributed significantly to the preservation and accessibility
                  of Zimbabwe's documentary heritage. However, to ensure its continued relevance and effectiveness,
                  the Act should be reviewed and updated to reflect contemporary archival practices and
                  technological advancements.
                </p>
              )}
            </div>

            {/* SECTION 9: Strengths and Weaknesses */}
            <div
              ref={(el) => {
                sectionRefs.current['naz-act-strengths-weaknesses'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assessing the Strengths and Weaknesses of the National Archives of Zimbabwe Act of 1986 and Rectification Suggestions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The National Archives of Zimbabwe Act of 1986, while foundational, presents both strengths
                    and weaknesses that impact the institution's effectiveness in the modern archival landscape.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Strengths',
                    icon: <ThumbsUp size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Clear Mandate and Establishment:</strong> The Act effectively establishes the
                          NAZ and defines its core mandate, providing a legal framework for its operations. This
                          clarity ensures the institution's authority and legitimizes its role in preserving
                          national heritage.
                        </li>
                        <li>
                          <strong>Legal Deposit and Acquisition Authority:</strong> The inclusion of legal deposit
                          provisions and broad acquisition powers enables the NAZ to build a comprehensive
                          collection. This is vital for preserving a diverse representation of Zimbabwe's history.
                        </li>
                        <li>
                          <strong>Public Records Management Provisions:</strong> The Act's focus on public records
                          management promotes government accountability and transparency. It provides a framework
                          for the proper handling of government records.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Weaknesses',
                    icon: <ThumbsDown size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Limited Digital Records Management:</strong> The Act lacks comprehensive
                          provisions for digital records management and preservation. This is a significant
                          weakness in the digital age, as a growing portion of records are created and stored
                          electronically.
                        </li>
                        <li>
                          <strong>Insufficient Cultural Protections:</strong> The Act could be strengthened to
                          provide clearer guidelines for the protection of cultural heritage and indigenous
                          knowledge. This is particularly important in a country with diverse cultural traditions.
                        </li>
                        <li>
                          <strong>Outdated Access Provisions:</strong> While the Act addresses access, it could be
                          updated to reflect modern access practices, including online access and data privacy
                          considerations.
                        </li>
                        <li>
                          <strong>Limited Clarity on Funding:</strong> Although the act sets up the NAZ, details
                          concerning consistent and sufficient funding could be more robust.
                        </li>
                        <li>
                          <strong>Lack of detailed handling of electronic records:</strong> The act was written
                          before the explosion of electronic records, and as such, it is lacking in this area.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Rectification Suggestions',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Amend the Act to Include Digital Records Management:</strong> Amendments should
                          include provisions for the acquisition, preservation, and access of digital records. This
                          should address issues such as metadata standards, digital preservation strategies, and
                          online access platforms.
                        </li>
                        <li>
                          <strong>Strengthen Cultural Heritage Provisions:</strong> The Act should be revised to
                          include stronger provisions for the protection of cultural heritage and indigenous
                          knowledge. This could involve establishing guidelines for consultation with cultural
                          communities and developing protocols for the handling of culturally sensitive materials.
                        </li>
                        <li>
                          <strong>Modernize Access Provisions:</strong> Update the Act to reflect modern access
                          practices, including online access, data privacy regulations, and freedom of information
                          principles. This should involve developing clear guidelines for access to digital records
                          and establishing procedures for handling sensitive information.
                        </li>
                        <li>
                          <strong>Enhance Funding Provisions:</strong> Amend the act to include stronger language
                          concerning the funding of the NAZ. This can include language concerning yearly budgets,
                          and also the ability for the NAZ to seek and obtain outside funding.
                        </li>
                        <li>
                          <strong>Develop Supplementary Regulations and Guidelines:</strong> Develop supplementary
                          regulations and guidelines to address specific areas, such as digital preservation,
                          cultural protections, and access to sensitive information. This provides flexibility and
                          allows the NAZ to adapt to changing circumstances.
                        </li>
                        <li>
                          <strong>Increase Staff Training and Capacity Building:</strong> Invest in staff training
                          and capacity building, particularly in areas related to digital preservation and cultural
                          heritage management. This ensures that the NAZ has the expertise to implement modern
                          archival practices.
                        </li>
                        <li>
                          <strong>Promote Collaboration and Partnerships:</strong> Foster collaboration and
                          partnerships with other archival institutions, universities, and cultural organizations.
                          This facilitates knowledge sharing, resource development, and the implementation of best
                          practices.
                        </li>
                        <li>
                          <strong>Regular Review and Updates:</strong> Establish a mechanism for regular review and
                          updates of the Act to ensure its continued relevance and effectiveness. This allows the
                          NAZ to adapt to evolving technologies and archival practices.
                        </li>
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

            {/* SECTION 10: Archivist's Code of Ethics */}
            <div
              ref={(el) => {
                sectionRefs.current['archivist-code-ethics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Archivist's Code of Ethics: Guiding Principles for Professional Conduct
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The Archivist's Code of Ethics serves as a cornerstone for responsible archival practice,
                    outlining the professional obligations and ethical considerations that guide archivists in
                    their work. It provides a framework for decision‑making, ensuring that archival materials are
                    managed with integrity, impartiality, and respect for their historical and cultural significance.
                    This code is essential for maintaining public trust and ensuring the long‑term preservation and
                    accessibility of documentary heritage.
                  </p>
                  <p className="mt-2">
                    The code typically addresses fundamental principles such as impartiality, objectivity, respect
                    for provenance, confidentiality, and accessibility. It emphasizes the archivist's responsibility
                    to preserve the integrity of records, to provide unbiased access to information, and to protect
                    the rights and interests of creators, users, and the public. By adhering to these ethical
                    principles, archivists uphold the highest standards of professional conduct and contribute to
                    the responsible stewardship of archival materials.
                  </p>
</div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Applying the Archivist\'s Code in Managing Archives',
                    icon: <Shield size={16} />,
                    content: (
                      <div>
                        <p className="mb-2">
                          Applying the Archivist's Code of Ethics in the day‑to‑day management of archives requires
                          a consistent and thoughtful approach. Here's how these ethical principles can be
                          integrated into various aspects of archival practice:
                        </p>
                        <h4 className="text-sm font-semibold mt-3 text-indigo-600 dark:text-indigo-400">Acquisition and Appraisal</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Impartiality and Objectivity:</strong> When acquiring materials, archivists
                            must avoid conflicts of interest and ensure that their personal biases do not influence
                            their decisions. They should appraise records based on their historical, evidential, and
                            informational value, rather than personal preferences.
                          </li>
                          <li>
                            <strong>Respect for Provenance:</strong> Archivists must adhere to the principle of
                            provenance, ensuring that records are maintained in their original context and that the
                            integrity of fonds is preserved. They should avoid acquiring materials that have been
                            illegally obtained or that lack clear provenance.
                          </li>
                        </ul>
                        <h4 className="text-sm font-semibold mt-3 text-indigo-600 dark:text-indigo-400">Arrangement and Description</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Accuracy and Objectivity:</strong> Archivists must provide accurate and
                            objective descriptions of archival materials, avoiding subjective interpretations or
                            biases. They should ensure that finding aids and other descriptive tools are clear,
                            comprehensive, and accessible to researchers.
                          </li>
                          <li>
                            <strong>Respect for Original Order:</strong> Archivists should strive to maintain the
                            original order of records, preserving the contextual relationships and internal logic
                            of the collection. They should avoid rearranging records arbitrarily or imposing
                            artificial organizational structures.
                          </li>
                        </ul>
                        <h4 className="text-sm font-semibold mt-3 text-indigo-600 dark:text-indigo-400">Preservation and Conservation</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Responsibility for Preservation:</strong> Archivists have a duty to ensure the
                            long‑term preservation of archival materials. They should implement appropriate
                            preservation measures, such as environmental controls, archival‑quality storage, and
                            conservation treatments, to protect records from damage and deterioration.
                          </li>
                          <li>
                            <strong>Ethical Considerations in Conservation:</strong> Archivists must consider the
                            ethical implications of conservation treatments, ensuring that interventions are
                            reversible and do not alter the historical integrity of the records. They should
                            prioritize preservation measures that minimize intervention and maintain the authenticity
                            of the materials.
                          </li>
                        </ul>
                        <h4 className="text-sm font-semibold mt-3 text-indigo-600 dark:text-indigo-400">Access and Use</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Equal Access:</strong> Archivists should provide equal access to archival
                            materials, regardless of the researcher's background, affiliation, or research interests.
                            They should avoid discriminatory practices and ensure that all users have fair and
                            equitable access to information.
                          </li>
                          <li>
                            <strong>Confidentiality and Privacy:</strong> Archivists must protect the confidentiality
                            and privacy of individuals and organizations whose information is contained in archival
                            records. They should implement access restrictions on sensitive materials and ensure that
                            researchers comply with privacy regulations.
                          </li>
                          <li>
                            <strong>Copyright and Intellectual Property:</strong> Archivists must respect copyright
                            and intellectual property rights, ensuring that researchers obtain necessary permissions
                            before reproducing or publishing copyrighted materials. They should also provide guidance
                            to researchers on copyright issues and promote responsible use of intellectual property.
                          </li>
                        </ul>
                        <h4 className="text-sm font-semibold mt-3 text-indigo-600 dark:text-indigo-400">Professional Conduct</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Integrity and Honesty:</strong> Archivists must maintain the highest standards
                            of integrity and honesty in their professional conduct. They should avoid conflicts of
                            interest, disclose any potential biases, and act in a transparent and accountable manner.
                          </li>
                          <li>
                            <strong>Collaboration and Cooperation:</strong> Archivists should collaborate and
                            cooperate with colleagues, researchers, and other stakeholders to advance the goals of
                            the archival profession. They should share knowledge, expertise, and resources to promote
                            best practices and improve access to archival materials.
                          </li>
                          <li>
                            <strong>Continuing Education and Professional Development:</strong> Archivists have a
                            responsibility to stay informed about current trends and best practices in the archival
                            field. They should engage in continuing education and professional development activities
                            to enhance their knowledge and skills.
                          </li>
                        </ul>
                      </div>
                    ),
                  },
                  {
                    title: 'Addressing Ethical Dilemmas',
                    icon: <HelpCircle size={16} />,
                    content: (
                      <p>
                        Archivists will, from time to time, face ethical dilemmas. When this happens, they should
                        consult the codes of ethics, and also their professional colleagues. They should document
                        the process they undertook, and the reasons for the decisions that they made.
                      </p>
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
                  💡 Institutional Insight
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
                  <span>NAZ Functions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>International Bodies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Act Provisions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Ethical Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Multiple</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The National Archives of Zimbabwe (NAZ) preserves and provides access to the nation's
                documentary heritage. It works alongside museums, libraries, galleries, registries, and
                records centres. The ICA sets global standards, with regional branches like ESARBICA
                and partners like IASA and UNESCO. The NAZ Act of 1986 provides the legal foundation
                but needs updates for digital records and cultural protections. The Archivist's Code of
                Ethics guides impartiality, confidentiality, and responsible stewardship. Understanding
                these institutions and their relationships is key to effective archives management.
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
                <strong className="text-white">National Archives of Zimbabwe (NAZ)</strong> – Preserves and
                provides access to the nation's documentary heritage through functions like preservation,
                acquisition, organization, reference services, records management, and outreach.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">NAZ Services</strong> – Reference, research facilities,
                reproduction, exhibitions, records management, education, conservation, and digital services.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">NAZ Sections</strong> – Public Archives, Records Services,
                Film and Sound, Library, HR/Finance, and ICT – each with specific responsibilities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Relationships</strong> – NAZ works with museums, libraries,
                galleries, registries, and records centres; each has complementary roles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">International Bodies</strong> – ICA sets global standards,
                ESARBICA serves the region, IASA specialises in audiovisual archives, UNESCO supports
                preservation initiatives.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">NAZ Act 1986</strong> – Legal foundation for operations;
                strengths include clear mandate and legal deposit; weaknesses include lack of digital
                provisions and cultural protections; rectification suggestions include amendments and
                modernisation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Archivist's Code of Ethics</strong> – Guides impartiality,
                confidentiality, and responsible stewardship; applied in acquisition, arrangement,
                preservation, access, and professional conduct.
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
            Sidemann Academic Registry • National Archives, International Bodies &amp; Professional Ethics 4.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;