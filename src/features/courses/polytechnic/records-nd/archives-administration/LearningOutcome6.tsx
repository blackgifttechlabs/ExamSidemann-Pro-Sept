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
  Mic,
  Film,
  Image,
  Music,
  ThumbsDown,
  Server,
  HelpCircle,
  Zap,
  ThumbsUp,
  Cloud,
  Database,
  BarChart,
  PieChart,
  Send,
  TrendingUp,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'digital-archives', label: 'Digital Archives' },
  { id: 'digital-age', label: 'Archive Management in Digital Age' },
  { id: 'trends', label: 'Current Trends' },
  { id: 'portals', label: 'Shared Information Portals' },
  { id: 'modern-tech', label: 'Modern Technologies' },
  { id: 'adoption-factors', label: 'Adoption Factors' },
  { id: 'public-programming', label: 'Public Programming' },
  { id: 'marketing', label: 'Marketing Strategies' },
  { id: 'user-services', label: 'User Services' },
  { id: 'publicising', label: 'Publicising Archives' },
  { id: 'enhancing-awareness', label: 'Enhancing Awareness' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'Digital archives are not just about storing files; they require active management to ensure long-term accessibility, including file format migration and metadata creation.',
      },
      {
        title: 'Pro Tip',
        text: 'When planning a public programming strategy, always involve community stakeholders early to ensure programs are relevant and engaging to diverse audiences.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of digital archives: "P‑A‑S‑A" – Preservation, Access, Sustainability, and Authenticity. Each is critical for success.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives focus on digitization without considering long-term digital preservation; without proper strategies, digital files may become inaccessible within a few years.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Digital archives are not just about storing files; they require active management to ensure long-term accessibility, including file format migration and metadata creation.',
      },
      {
        title: 'Pro Tip',
        text: 'When planning a public programming strategy, always involve community stakeholders early to ensure programs are relevant and engaging to diverse audiences.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of digital archives: "P‑A‑S‑A" – Preservation, Access, Sustainability, and Authenticity. Each is critical for success.',
      },
      {
        title: 'Common Mistake',
        text: 'Many archives focus on digitization without considering long-term digital preservation; without proper strategies, digital files may become inaccessible within a few years.',
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Digital Archives, Technology —{' '}
            <span className="text-cyan-300 font-bold italic">
              &amp; Public Engagement
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to digital archives, modern technologies, trends, marketing strategies,
            user services, and public programming.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> Digital
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> Technology
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Engagement
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
                placeholder="Search for digital archives, trends, marketing, user services..."
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
            {/* SECTION 1: Digital Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-archives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A digital archive is essentially a system for the long‑term storage, management, and
                    access of digital information. It mirrors the purpose of a traditional, physical archive,
                    but with a focus on electronic materials. Here's a more detailed breakdown:
                  </p>
</div>

              {renderCard(
                'Key Characteristics',
                <ListChecks size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Digital Content:</strong> Digital archives hold information that exists in
                    electronic form. This can include: Digitized versions of physical materials (e.g., scanned
                    documents, photographs, audio recordings). Born‑digital materials (e.g., electronic
                    documents, emails, digital photographs, websites).
                  </li>
                  <li>
                    <strong>Long‑Term Preservation:</strong> A primary goal is to ensure the longevity of
                    digital information. This involves strategies to prevent data loss, corruption, and
                    obsolescence of file formats or storage media.
                  </li>
                  <li>
                    <strong>Organized Structure:</strong> Digital archives employ systems to organize and
                    describe their contents. This often involves: Metadata: Descriptive information that
                    provides context and allows for searching. Classification schemes: Logical structures for
                    grouping related materials.
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Digital archives aim to make their holdings accessible to
                    users. This can involve: Online access through websites or repositories. Searchable
                    databases. Controlled access for sensitive materials.
                  </li>
                  <li>
                    <strong>Integrity and Authenticity:</strong> Maintaining the integrity and authenticity of
                    digital information is crucial. This involves measures to: Prevent unauthorized alteration
                    or deletion. Verify the provenance of materials.
                  </li>
                </ul>
              )}

              {renderCard(
                'Purposes',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Historical Preservation:</strong> Digital archives preserve historical documents,
                    photographs, and other materials for future generations.
                  </li>
                  <li>
                    <strong>Research and Scholarship:</strong> They provide researchers with access to primary
                    source materials for historical, cultural, and scientific studies.
                  </li>
                  <li>
                    <strong>Legal and Regulatory Compliance:</strong> Organizations may use digital archives
                    to store records that must be retained for legal or regulatory purposes.
                  </li>
                  <li>
                    <strong>Cultural Heritage:</strong> Digital archives play a vital role in preserving and
                    promoting cultural heritage by making it accessible to a wider audience.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 2: Archive Management in the Digital Age */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-age'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archive Management in the Digital Age
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The digital age has fundamentally transformed archive management, requiring institutions
                    to adapt traditional practices to the unique challenges and opportunities presented by
                    electronic records. This shift involves not only the preservation of born‑digital materials
                    but also the digitization of analog collections, the implementation of digital preservation
                    strategies, and the provision of online access to archival resources.
                  </p>
                  <p className="mt-2">
                    One of the most significant changes is the sheer volume of digital information being
                    created. Unlike paper records, which have physical limitations, digital data can be
                    generated and stored at an unprecedented scale. This necessitates the development of robust
                    storage systems, metadata standards, and data management protocols to ensure the long‑term
                    preservation and accessibility of these vast collections. Archivists must now grapple with
                    issues such as file format obsolescence, data migration, and the preservation of complex
                    digital objects, such as websites and databases.
                  </p>
                  <p className="mt-2">
                    Furthermore, the digital age has blurred the lines between creation, storage, and access.
                    Archival institutions are no longer simply repositories of historical documents; they are
                    active participants in the information ecosystem. This requires them to engage with creators,
                    developers, and users of digital information, establishing policies and procedures for the
                    acquisition, management, and dissemination of electronic records. The need for digital
                    preservation strategies has also become paramount. This involves not only the physical
                    storage of digital data but also the ongoing maintenance of file formats, software, and
                    hardware to ensure that records remain accessible over time. Archivists must stay abreast of
                    technological advancements and develop strategies for data migration, emulation, and other
                    preservation techniques.
                  </p>
                  <p className="mt-2">
                    The provision of online access to archival resources has also revolutionized how researchers
                    and the public engage with historical materials. Digital archives can be made accessible
                    through websites, online databases, and digital repositories, allowing users to browse,
                    search, and download records from anywhere in the world. This has democratized access to
                    archival materials, making them available to a wider audience and fostering new forms of
                    research and scholarship. However, this increased access also brings new challenges, such as
                    ensuring data security, protecting privacy, and managing copyright and intellectual property
                    rights.
                  </p>
                  <p className="mt-2">
                    In essence, archive management in the digital age requires a proactive and adaptable
                    approach. Archivists must embrace new technologies, develop innovative strategies, and
                    collaborate with other professionals to ensure the long‑term preservation and accessibility
                    of digital information. This involves not only technical expertise but also a deep
                    understanding of archival principles, ethical considerations, and the evolving needs of
                    researchers and the public.
                  </p>
</div>
            </div>

            {/* SECTION 3: Current Trends in Archives Management */}
            <div
              ref={(el) => {
                sectionRefs.current['trends'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Current Trends in Archives Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The field of archives management is constantly evolving to keep pace with technological
                    advancements and changing societal needs. Several key trends are shaping the future of
                    archival practice, focusing on digital preservation, expanded access, and innovative
                    technologies.
                  </p>
</div>

              {renderCard(
                'Key Trends',
                <TrendingUp size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Digital Archiving:</strong> Definition: Digital archiving refers to the processes
                    and strategies employed to preserve and provide long‑term access to digital materials. This
                    includes born‑digital records, such as electronic documents, emails, and digital photographs,
                    as well as digitized versions of analog materials. Explanation: This trend is driven by the
                    increasing volume of digital information being created and the need to ensure its long‑term
                    preservation. Archivists are adopting digital preservation strategies, such as file format
                    migration, emulation, and checksum verification, to mitigate the risks of data loss and
                    obsolescence. They are also implementing digital asset management systems to organize,
                    describe, and provide access to digital collections.
                  </li>
                  <li>
                    <strong>Social Media Archiving:</strong> Definition: Social media archiving involves the
                    capture, preservation, and provision of access to social media content, such as tweets,
                    Facebook posts, and Instagram images. Explanation: Social media platforms have become
                    significant sources of historical and cultural information. Archivists are developing
                    strategies to capture and preserve social media content, recognizing its value as a record
                    of contemporary events and social interactions. This involves addressing challenges related
                    to data volume, platform changes, and ethical considerations, such as privacy and consent.
                    Tools and techniques are being developed to reliably capture this very ephemeral data.
                  </li>
                  <li>
                    <strong>Cloud‑Based Archiving:</strong> Definition: Cloud‑based archiving involves storing
                    and managing archival materials in cloud computing environments, leveraging the scalability,
                    reliability, and accessibility of cloud services. Explanation: Cloud‑based solutions offer
                    several advantages for archives, including reduced infrastructure costs, increased storage
                    capacity, and enhanced data security. Archivists are increasingly adopting cloud‑based
                    platforms for digital preservation, data backup, and online access to collections. This
                    allows for distributed storage, and redundancy, that can be very helpful for preservation.
                  </li>
                  <li>
                    <strong>Web Archives:</strong> Definition: Web archives are collections of captured websites,
                    preserved for historical and research purposes. Explanation: The web has become a primary
                    source of information, and web archives play a crucial role in preserving this dynamic and
                    ephemeral medium. Archivists are using web crawling tools and techniques to capture and
                    preserve websites, creating snapshots of the web at specific points in time. This is very
                    important, as websites change, or disappear, very quickly.
                  </li>
                  <li>
                    <strong>Artificial Intelligence (AI) and Machine Learning (ML):</strong> Definition: In the
                    context of archives, AI and ML involve the use of algorithms and computational techniques to
                    automate tasks, analyze data, and enhance access to archival materials. Explanation: AI and
                    ML are being applied to various aspects of archives management, including metadata extraction,
                    image recognition, and text analysis. These technologies can automate labor‑intensive tasks,
                    such as transcribing handwritten documents or identifying objects in photographs. AI powered
                    search tools can also greatly improve the discoverability of archival materials. Additionally
                    AI is being used in digital preservation, to help monitor, and repair, digital files.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 4: Archives and Shared Information Portals */}
            <div
              ref={(el) => {
                sectionRefs.current['portals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archives and Shared Information Portals
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archives, traditionally seen as repositories of physical documents, are increasingly
                    leveraging shared information portals to expand access to their holdings and foster
                    collaboration. These portals serve as digital gateways, connecting users with archival
                    resources and facilitating the exchange of information.
                  </p>
                  <p className="mt-2">
                    Shared information portals provide a centralized platform for archives to showcase their
                    collections, publish finding aids, and offer digital access to digitized materials. This
                    allows researchers, educators, and the public to explore archival resources remotely, saving
                    time and effort. Portals can also integrate with other digital resources, such as online
                    databases and digital libraries, creating a comprehensive research environment. Furthermore,
                    these portals enable archives to collaborate with other institutions, sharing resources and
                    expertise. This can involve joint exhibitions, collaborative research projects, and the
                    development of shared digital collections. By leveraging shared information portals, archives
                    can enhance their visibility, expand their reach, and promote the use of archival materials.
                  </p>
</div>
            </div>

            {/* SECTION 5: Application of Modern Technologies */}
            <div
              ref={(el) => {
                sectionRefs.current['modern-tech'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Application of Modern Technologies in the Management of Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Modern technologies are transforming the management of archives, enhancing efficiency,
                    accessibility, and preservation capabilities. These technologies are being applied across
                    various aspects of archival practice, from acquisition and processing to preservation and
                    access.
                  </p>
</div>

              {renderCard(
                'Technologies',
                <Monitor size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Digital Asset Management Systems (DAMS):</strong> DAMS are software applications
                    that manage digital assets, such as digitized documents, photographs, and audio‑visual
                    recordings. These systems provide tools for organizing, describing, and retrieving digital
                    materials, as well as for managing metadata and access controls. DAMS streamline workflows,
                    improve efficiency, and ensure the long‑term preservation of digital collections.
                  </li>
                  <li>
                    <strong>Optical Character Recognition (OCR):</strong> OCR technology converts scanned images
                    of text into machine‑readable text. This enables archivists to create searchable transcripts
                    of handwritten or printed documents, enhancing accessibility and facilitating research. OCR
                    is particularly valuable for processing large volumes of textual materials.
                  </li>
                  <li>
                    <strong>Geographic Information Systems (GIS):</strong> GIS technology allows archivists to
                    map and analyze spatial data, such as historical maps, land records, and census data. This
                    enables researchers to visualize historical patterns and relationships, providing new insights
                    into the past. GIS can also be used to manage and display archival collections that have
                    geographic components.
                  </li>
                  <li>
                    <strong>Blockchain Technology:</strong> While still in its early stages of application in
                    archives, blockchain technology offers potential for ensuring the authenticity and integrity
                    of digital records. Blockchain can create immutable records of transactions and data,
                    providing a secure and transparent way to track the provenance and chain of custody of
                    archival materials. This could be very useful for ensuring that digital records have not been
                    tampered with.
                  </li>
                  <li>
                    <strong>Robotics and Automation:</strong> Robotics and automation are being used to automate
                    tasks such as inventory management, document retrieval, and environmental monitoring. This
                    frees up archivists to focus on more complex and specialized tasks. Automated systems can
                    also improve efficiency and reduce the risk of human error.
                  </li>
                  <li>
                    <strong>Artificial Intelligence (AI) and Machine Learning (ML):</strong> AI and ML are being
                    applied to various aspects of archives management, including metadata extraction, image
                    recognition, and text analysis. These technologies can automate labor‑intensive tasks and
                    enhance the discoverability of archival materials. AI powered search tools can also greatly
                    improve the discoverability of archival materials.
                  </li>
                  <li>
                    <strong>Cloud Computing:</strong> Cloud computing provides scalable and cost‑effective
                    storage and processing solutions for archives. Cloud‑based platforms can be used for digital
                    preservation, data backup, and online access to collections. Cloud services offer increased
                    flexibility and accessibility, allowing archives to manage their resources more efficiently.
                  </li>
                  <li>
                    <strong>3D Scanning and Virtual Reality (VR):</strong> 3D scanning and VR technologies are
                    being used to create digital replicas of artifacts and historical sites. This allows
                    researchers and the public to explore and interact with cultural heritage materials in a
                    virtual environment. VR can also be used to create immersive exhibitions and educational
                    experiences.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 6: Factors Enabling and Hindering Adoption */}
            <div
              ref={(el) => {
                sectionRefs.current['adoption-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Enabling and Hindering the Adoption of Modern Technologies in Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The adoption of modern technologies in archives is a complex process influenced by a range
                    of enabling and hindering factors. These factors impact the pace and extent to which archives
                    can leverage technology to enhance their operations and services.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Factors Enabling Adoption',
                    icon: <ThumbsUp size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Increased Digital Literacy and Skills:</strong> As digital literacy increases
                          among archival professionals, they are better equipped to understand, implement, and
                          utilize modern technologies. Training programs, workshops, and online resources play a
                          crucial role in developing these skills.
                        </li>
                        <li>
                          <strong>Availability of Cost‑Effective Technologies:</strong> The decreasing cost of
                          digital storage, cloud computing, and other technologies makes them more accessible to
                          archives with limited budgets. Open‑source software and freeware tools also provide
                          cost‑effective solutions for various archival tasks.
                        </li>
                        <li>
                          <strong>Growing Recognition of Digital Preservation Importance:</strong> There's a
                          rising awareness of the need for digital preservation strategies to safeguard born‑digital
                          and digitized archival materials. This recognition drives the adoption of technologies
                          that support long‑term preservation, such as digital asset management systems and
                          cloud‑based storage.
                        </li>
                        <li>
                          <strong>Demand for Enhanced Access and Online Services:</strong> Researchers and the
                          public increasingly expect online access to archival materials. This demand pushes
                          archives to adopt technologies that enable digitization, online databases, and virtual
                          exhibitions.
                        </li>
                        <li>
                          <strong>Development of Archival Standards and Best Practices:</strong> The development
                          of standards and best practices for digital archiving, metadata, and other technologies
                          provides guidance and frameworks for archives to implement these technologies effectively.
                        </li>
                        <li>
                          <strong>Collaboration and Partnerships:</strong> Collaboration with technology providers,
                          academic institutions, and other archives facilitates knowledge sharing, resource
                          development, and the implementation of innovative solutions.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Factors Hindering Adoption',
                    icon: <ThumbsDown size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Limited Financial Resources:</strong> Many archives face budget constraints,
                          making it difficult to invest in new technologies, hardware, software, and staff training.
                          This is a major hurdle, especially for smaller or underfunded institutions.
                        </li>
                        <li>
                          <strong>Lack of Technical Expertise:</strong> Archival staff may lack the necessary
                          technical skills to implement and maintain modern technologies. This can lead to reliance
                          on external consultants or delays in technology adoption.
                        </li>
                        <li>
                          <strong>Legacy Systems and Infrastructure:</strong> Archives may have legacy systems and
                          infrastructure that are incompatible with new technologies. This can require costly
                          upgrades or replacements, which may not be feasible.
                        </li>
                        <li>
                          <strong>Concerns about Data Security and Privacy:</strong> The use of digital
                          technologies raises concerns about data security, privacy, and intellectual property
                          rights. Archives must implement robust security measures and ensure compliance with
                          relevant regulations.
                        </li>
                        <li>
                          <strong>Resistance to Change:</strong> Some archival professionals may resist adopting
                          new technologies due to concerns about job security, changes in workflows, or a
                          preference for traditional methods.
                        </li>
                        <li>
                          <strong>Rapid Technological Change:</strong> The rapid pace of technological change can
                          make it difficult for archives to keep up. Technologies may become obsolete quickly,
                          requiring ongoing investments in upgrades and replacements.
                        </li>
                        <li>
                          <strong>Lack of Clear Digital Preservation Policies:</strong> Without clear policies,
                          there is a risk of data loss, and corruption. Many institutions are in the early stages
                          of developing these policies.
                        </li>
                        <li>
                          <strong>Copyright and Legal issues:</strong> The digital world presents new copyright
                          and legal challenges, that many institutions are not fully prepared for.
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

            {/* SECTION 7: Public Programming Strategy */}
            <div
              ref={(el) => {
                sectionRefs.current['public-programming'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Public Programming Strategy: Engaging Communities with Archives
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A public programming strategy is a deliberate and planned approach to connect archives with
                    their communities through a variety of educational, cultural, and outreach initiatives. It
                    aims to make archival collections more accessible, engaging, and relevant to diverse
                    audiences, fostering a deeper understanding and appreciation of history and heritage.
                  </p>
                  <p className="mt-2">
                    This strategy goes beyond simply providing access to archival materials; it involves actively
                    engaging the public through events, exhibitions, workshops, lectures, and digital initiatives.
                    The goal is to create meaningful experiences that inspire learning, spark curiosity, and
                    promote dialogue. A well‑developed public programming strategy considers the needs and
                    interests of different audience segments, tailoring programs to specific age groups, cultural
                    backgrounds, and educational levels. It also leverages various formats and platforms to reach
                    a wider audience, including physical events, online resources, and social media.
                  </p>
</div>
            </div>

            {/* SECTION 8: Applying Marketing Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['marketing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Applying Marketing Strategies on Archives: Physical and Digital Platforms
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Marketing strategies are essential for promoting archives and their services, raising
                    awareness of their collections, and attracting new audiences. By applying effective marketing
                    techniques on both physical and digital platforms, archives can increase their visibility and
                    impact.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Physical Platforms',
                    icon: <Building size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Exhibitions and Displays:</strong> Create engaging and visually appealing
                          exhibitions that showcase the highlights of the archives' collections. Use storytelling
                          techniques to connect with visitors and make the content relatable. Design informative
                          and visually appealing displays for the archives' foyer or public areas. Rotate displays
                          regularly to keep them fresh and interesting.
                        </li>
                        <li>
                          <strong>Events and Programs:</strong> Host lectures, workshops, and film screenings that
                          relate to the archives' collections. Invite guest speakers and experts to enhance the
                          appeal of these events. Organize behind‑the‑scenes tours and open house events to give
                          the public a glimpse into the archives' work. Create family‑friendly programs and
                          activities to engage younger audiences.
                        </li>
                        <li>
                          <strong>Partnerships and Collaborations:</strong> Collaborate with local schools,
                          universities, and community organizations to develop joint programs and initiatives.
                          Partner with local businesses and cultural institutions to cross‑promote events and
                          services.
                        </li>
                        <li>
                          <strong>Physical Signage and Wayfinding:</strong> Ensure clear and visible signage
                          directing visitors to the archives. Provide informative signage within the archives,
                          guiding visitors to exhibitions, research areas, and other facilities.
                        </li>
                        <li>
                          <strong>Print Materials:</strong> Create high‑quality brochures, flyers, and newsletters
                          that highlight the archives' collections and programs. Distribute print materials at
                          local events and community centers.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Digital Platforms',
                    icon: <Globe size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Website Optimization:</strong> Develop a user‑friendly and visually appealing
                          website that showcases the archives' collections and services. Use search engine
                          optimization (SEO) techniques to ensure that the website is easily discoverable online.
                          Create online exhibitions and digital collections that can be accessed remotely.
                        </li>
                        <li>
                          <strong>Social Media Marketing:</strong> Use social media platforms, such as Facebook,
                          Twitter, and Instagram, to engage with audiences and promote the archives' activities.
                          Share interesting content, such as historical images, documents, and stories, to attract
                          followers. Use social media advertising to reach targeted audiences.
                        </li>
                        <li>
                          <strong>Email Marketing:</strong> Build an email list and send regular newsletters to
                          subscribers, highlighting upcoming events and new acquisitions. Use email marketing to
                          promote online exhibitions and digital collections.
                        </li>
                        <li>
                          <strong>Online Databases and Finding Aids:</strong> Make finding aids and collection
                          descriptions available online to facilitate research and access. Develop online databases
                          that allow users to search and browse archival materials.
                        </li>
                        <li>
                          <strong>Virtual Exhibitions and Online Programs:</strong> Create virtual exhibitions
                          that showcase the archives' collections to a global audience. Host online lectures,
                          workshops, and discussions to engage with remote audiences.
                        </li>
                        <li>
                          <strong>Digital Storytelling:</strong> Use digital storytelling techniques to create
                          engaging narratives based on archival materials. Share digital stories on the archives'
                          website and social media platforms.
                        </li>
                        <li>
                          <strong>Online Advertising:</strong> Utilize online advertising platforms to reach
                          targeted audiences with specific interests. Use analytics to track the effectiveness of
                          online marketing campaigns.
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

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  By implementing these marketing strategies, archives can effectively promote their collections
                  and services, attract new audiences, and enhance their visibility in the community.
                </p>
              </div>
            </div>

            {/* SECTION 9: User Services */}
            <div
              ref={(el) => {
                sectionRefs.current['user-services'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                User Services: The Heart of Archival Access
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    User services in archives encompass the range of activities and support provided to
                    researchers and the public to facilitate their engagement with archival holdings. These
                    services are crucial for bridging the gap between collections and users, ensuring that
                    archival materials are accessible, understandable, and utilized effectively.
                  </p>
                  <p className="mt-2">
                    User services go beyond simply providing physical access to records. They involve offering
                    expert guidance, interpreting archival descriptions, and helping researchers formulate
                    effective research strategies. This includes reference services, which involve answering
                    inquiries, providing research assistance, and conducting reference interviews. It also
                    encompasses educational outreach, which includes workshops, lectures, and exhibitions designed
                    to engage diverse audiences. Effective user services are essential for promoting research,
                    scholarship, and public understanding of history and heritage.
                  </p>
</div>
            </div>

            {/* SECTION 10: Publicising Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['publicising'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Publicising Archives: Expanding Reach and Impact
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Publicising archives is vital for raising awareness of their collections and services,
                    attracting new audiences, and demonstrating their value to the community. It involves
                    employing a range of marketing and communication strategies to promote the archives'
                    activities and resources.
                  </p>
                  <p className="mt-2">
                    Publicising archives goes beyond simply announcing new acquisitions or events. It involves
                    creating a compelling narrative that highlights the significance of archival materials and
                    their relevance to contemporary issues. This can be achieved through various channels,
                    including press releases, social media campaigns, website content, and community outreach.
                    Publicising archives also involves building relationships with key stakeholders, such as
                    researchers, educators, and community leaders, to foster partnerships and collaborations.
                    By effectively publicising their activities, archives can increase their visibility, expand
                    their reach, and demonstrate their impact on society.
                  </p>
</div>
            </div>

            {/* SECTION 11: Enhancing Awareness of Archival Holdings */}
            <div
              ref={(el) => {
                sectionRefs.current['enhancing-awareness'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Enhancing Awareness of Archival Holdings: Making Collections Discoverable
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Enhancing awareness of archival holdings is essential for ensuring that researchers and the
                    public can discover and utilize the vast resources contained within archives. It involves
                    employing a range of strategies to make collections more discoverable and accessible.
                  </p>
                  <p className="mt-2">
                    This includes creating comprehensive finding aids, which are descriptive tools that provide
                    information about the content, context, and arrangement of archival materials. Finding aids
                    should be made available online and in physical formats, allowing users to browse and search
                    the collections. Enhancing awareness also involves digitizing archival materials and making
                    them available through online databases and digital repositories. This allows users to access
                    records remotely and explore collections in new ways. Furthermore, archives can enhance
                    awareness by creating exhibitions, public programs, and educational resources that showcase
                    the highlights of their holdings. By making collections more discoverable, archives can
                    promote research, scholarship, and public engagement with history and heritage.
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
                  💡 Digital Archives Insight
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
                  <span>Digital Archive Characteristics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Current Trends</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Modern Technologies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Marketing Platforms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Digital archives require careful management, including preservation, metadata, and access
                strategies. Current trends include digital archiving, social media archiving, cloud solutions,
                web archives, and AI/ML. Shared information portals enhance collaboration and access. Modern
                technologies like DAMS, OCR, GIS, blockchain, robotics, AI, cloud computing, and 3D/VR are
                transforming archives. Adoption is enabled by digital literacy, cost, recognition, demand,
                standards, and collaboration, but hindered by funding, expertise, legacy systems, security
                concerns, resistance, rapid change, policy gaps, and legal issues. Public programming,
                marketing (physical and digital), user services, publicising, and enhancing awareness are
                key for engagement.
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
                <strong className="text-white">Digital Archives</strong> – Systems for long‑term storage
                and access of digital information, focusing on preservation, organization, accessibility,
                and authenticity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Digital Age Management</strong> – Requires adapting to
                volume, technological change, and the need for digital preservation strategies; archives
                become active participants in the information ecosystem.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Current Trends</strong> – Digital archiving, social media
                archiving, cloud‑based archiving, web archives, and AI/ML are shaping the future.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Shared Portals</strong> – Centralised platforms that expand
                access, enable collaboration, and integrate with other digital resources.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Modern Technologies</strong> – DAMS, OCR, GIS, blockchain,
                robotics, AI/ML, cloud computing, and 3D/VR enhance efficiency, preservation, and access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Adoption Factors</strong> – Enabling: digital literacy,
                cost‑effectiveness, recognition, demand, standards, collaboration. Hindering: funding,
                expertise, legacy systems, security, resistance, rapid change, policy gaps, legal issues.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Public Engagement</strong> – Public programming, marketing
                (physical and digital), user services, publicising, and enhancing awareness are crucial for
                connecting archives with communities and making collections discoverable.
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
            Sidemann Academic Registry • Digital Archives, Technology &amp; Public Engagement 6.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;