import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Database,
  Cloud,
  Fingerprint,
  Scan,
  CpuIcon,
  Network,
  Server,
  Code,
  Users,
  Banknote,
  ClipboardList,
  Globe,
  Search,
  Shield,
  Share2,
  Presentation,
  Monitor,
  Box,
  Settings,
  ShieldAlert,
  FolderTree,
  Target,
  Layers,
  BookOpen,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  FileText,
  RefreshCw,
  AlertTriangle,
  Building,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'technologies', label: 'Technologies' },
  { id: 'resources', label: 'Resources' },
  { id: 'archivist', label: 'Archivist Role' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'newtech', label: 'New Technologies' },
  { id: 'code', label: 'Archivist Code' },
  { id: 'legislation', label: 'Legislation' },
  { id: 'functions', label: 'Functions' },
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
        text: 'Digital archives are transforming how we preserve history. Technologies like AI and blockchain are making archival materials more accessible and secure than ever before.',
      },
      {
        title: 'Pro Tip',
        text: 'When digitising archives, always use high-resolution scanning and create preservation-quality master files before generating access copies.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key challenges in digital archives with the acronym "F-D-S-M-A-A-T-L-S": Format obsolescence, Data migration, Storage, Metadata, Authenticity, Access, Technology, Legal, Staffing.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions underestimate the ongoing costs of digital preservation. Plan for long-term storage, migration, and staff training from the start.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Digital archives are transforming how we preserve history. Technologies like AI and blockchain are making archival materials more accessible and secure than ever before.',
      },
      {
        title: 'Pro Tip',
        text: 'When digitising archives, always use high-resolution scanning and create preservation-quality master files before generating access copies.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the key challenges in digital archives with the acronym "F-D-S-M-A-A-T-L-S": Format obsolescence, Data migration, Storage, Metadata, Authenticity, Access, Technology, Legal, Staffing.',
      },
      {
        title: 'Common Mistake',
        text: 'Many institutions underestimate the ongoing costs of digital preservation. Plan for long-term storage, migration, and staff training from the start.',
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
            <Database size={14} className="inline mr-1" /> DIGITAL ARCHIVES
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Digital Archives —{' '}
            <span className="text-amber-300 font-bold italic">
              Technology, Challenges &amp; Solutions
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to digital archives, new technologies (DAMS, AI, Blockchain, Cloud), resources needed, archivist roles, challenges, benefits, solutions, and archival legislation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> Digital Preservation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CpuIcon size={14} className="inline mr-1" /> Technologies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Legislation
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
                placeholder="Search for a technology, challenge, concept..."
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
            {/* SECTION 1: Digital Archives Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Archives Overview
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital archives are collections of electronic records, documents, and other materials that are preserved and made accessible for long-term use. Unlike traditional archives that primarily handle physical items, digital archives focus on managing information created and stored in digital formats. This includes everything from digitized versions of paper documents to born-digital materials like emails, websites, digital photographs, audio and video recordings, and databases. The aim is to ensure these digital assets remain accessible, usable, and authentic over time, despite rapid technological changes. Digital archives require specialized software, hardware, and expertise to manage issues like format obsolescence, data migration, and long-term storage, ensuring that digital information remains a valuable resource for future generations.
                  </p>
</div>
            </div>

            {/* SECTION 2: New Technologies Used in Archives Management */}
            <div
              ref={(el) => {
                sectionRefs.current['technologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                New Technologies Used in Archives Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Digital Asset Management Systems (DAMS)',
                    icon: <Database size={16} />,
                    content: 'DAMS are sophisticated software platforms designed to manage, store, and retrieve digital assets. They provide tools for metadata management, version control, access control, and digital preservation. DAMS help archives organize and describe digital collections, ensuring that they are easily searchable and accessible. They also facilitate the long-term preservation of digital objects by managing file formats, migration, and storage. Modern DAMS often integrate with other archival systems and offer features like automated workflows and cloud storage.',
                  },
                  {
                    title: 'Optical Character Recognition (OCR) and Text Mining',
                    icon: <Scan size={16} />,
                    content: 'OCR technology converts scanned images of text into machine-readable text. This allows archives to make digitized documents searchable and accessible. Text mining tools can then be used to analyse large volumes of textual data, extracting key information, and identifying patterns. This technology enhances the discoverability of archival materials and enables researchers to conduct sophisticated text analysis. OCR and text mining are especially valuable for archives with large collections of textual documents, such as newspapers, letters, and reports.',
                  },
                  {
                    title: 'Artificial Intelligence (AI) and Machine Learning (ML)',
                    icon: <CpuIcon size={16} />,
                    content: 'AI and ML are being used to automate tasks such as metadata extraction, image recognition, and audio transcription. AI-powered tools can analyse archival materials and automatically generate metadata, making them more easily searchable. ML algorithms can identify patterns and relationships within archival collections, providing new insights and research opportunities. AI-driven systems can also improve the accessibility of archival materials for people with disabilities.',
                  },
                  {
                    title: 'Blockchain Technology',
                    icon: <Fingerprint size={16} />,
                    content: 'Blockchain technology is being explored for its potential in ensuring the authenticity and integrity of digital archives. Blockchain\'s distributed ledger system can create an immutable record of archival transactions, providing proof of provenance and preventing tampering. This technology can be used to manage digital rights, track the history of digital objects, and ensure the long-term preservation of digital records.',
                  },
                  {
                    title: 'Cloud Computing and Storage',
                    icon: <Cloud size={16} />,
                    content: 'Cloud computing provides scalable and cost-effective solutions for storing and managing digital archives. Cloud storage services offer secure and reliable storage for large volumes of digital data, with features like redundancy and disaster recovery. Cloud-based tools can facilitate collaboration and remote access to archival materials. Cloud computing also enables archives to implement advanced digital preservation strategies.',
                  },
                  {
                    title: 'Linked Data and Semantic Web Technologies',
                    icon: <Network size={16} />,
                    content: 'Linked data and semantic web technologies enable archives to connect their data with other online resources. This allows for richer descriptions and contextualization of archival materials. Semantic web tools can create machine-readable metadata that facilitates data integration and interoperability. Linked data can make archival materials more discoverable and accessible through the web.',
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

            {/* SECTION 3: Resources Needed for Setting Up a Digital Archives Repository */}
            <div
              ref={(el) => {
                sectionRefs.current['resources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Resources Needed When Setting Up a Digital Archives Repository
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Hardware Infrastructure',
                    icon: <Server size={16} />,
                    content: 'This includes robust servers, storage systems, and networking equipment. Servers must be capable of handling large volumes of data and supporting digital preservation workflows. Storage systems should be scalable and reliable, with features like redundancy and backup. Networking equipment must provide high-speed connectivity and secure data transfer. Regular hardware maintenance and upgrades are essential. Hardware Infrastructure is the physical base upon which the digital archive is built.',
                  },
                  {
                    title: '2. Software and Digital Preservation Tools',
                    icon: <Code size={16} />,
                    content: 'This includes a DAMS, digital preservation software, and tools for metadata management, format migration, and data validation. Open-source software solutions can be cost-effective, but they may require significant customization and technical expertise. Commercial software may offer more features and support, but it can be expensive. Regular software updates and maintenance are crucial.',
                  },
                  {
                    title: '3. Skilled Personnel',
                    icon: <Users size={16} />,
                    content: 'Digital archives require staff with expertise in digital preservation, metadata management, and information technology. Archivists must be trained in digital curation, data migration, and digital forensics. IT professionals are needed to manage hardware, software, and networking infrastructure. Ongoing training and professional development are essential.',
                  },
                  {
                    title: '4. Financial Resources',
                    icon: <Banknote size={16} />,
                    content: 'Setting up and maintaining a digital archives repository requires significant financial investment. This includes costs for hardware, software, personnel, and ongoing maintenance. Funding sources may include grants, endowments, and institutional support. A sustainable funding model is essential for long-term viability.',
                  },
                  {
                    title: '5. Policies and Procedures',
                    icon: <ClipboardList size={16} />,
                    content: 'Clear policies and procedures are essential for managing digital archives. This includes policies for acquisition, appraisal, preservation, and access. Procedures should be documented and regularly reviewed to ensure they are up to date. Legal and ethical considerations, such as copyright and privacy, must be addressed.',
                  },
                  {
                    title: '6. Community and Collaboration',
                    icon: <Network size={16} />,
                    content: 'Building a community of practice and collaborating with other institutions can provide valuable support and resources. This includes sharing best practices, developing standards, and collaborating on digital preservation projects. Community and collaboration can help to reduce costs and increase efficiency.',
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

            {/* SECTION 4: The Role of an Archivist in Digital Archiving */}
            <div
              ref={(el) => {
                sectionRefs.current['archivist'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role of an Archivist in Digital Archiving
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Digital Appraisal and Selection',
                    icon: <Target size={16} />,
                    content: 'Archivists play a crucial role in evaluating and selecting digital records for long-term preservation. This involves assessing the records\' authenticity, reliability, and significance, considering factors like file formats, metadata, and context. They must determine which digital materials have enduring value and should be preserved, distinguishing them from ephemeral or redundant data.',
                  },
                  {
                    title: '2. Digital Preservation Planning and Implementation',
                    icon: <Shield size={16} />,
                    content: 'Archivists develop and implement strategies for the long-term preservation of digital records, ensuring their accessibility and usability over time. This involves creating digital preservation plans that address issues like format obsolescence, data migration, and storage management. They must stay abreast of evolving technologies and standards.',
                  },
                  {
                    title: '3. Metadata Creation and Management',
                    icon: <Database size={16} />,
                    content: 'Metadata is essential for describing and managing digital records, enabling their discovery and retrieval. Archivists create and manage metadata schemas, ensuring that digital objects are accurately described and contextualized. They apply metadata standards and best practices, ensuring interoperability and long-term accessibility.',
                  },
                  {
                    title: '4. Digital Curation and Access',
                    icon: <Layers size={16} />,
                    content: 'Archivists curate digital collections, ensuring that they are organized, documented, and accessible to users. They develop access policies and procedures, balancing the need to provide access with the need to protect sensitive information. They also implement access tools and technologies, such as online catalogues and digital repositories.',
                  },
                  {
                    title: '5. Digital Forensics and Authenticity',
                    icon: <Fingerprint size={16} />,
                    content: 'Archivists may be involved in digital forensics, ensuring the authenticity and integrity of digital records. This involves examining digital objects to determine their provenance and detect any signs of tampering or alteration. They may use forensic tools and techniques to recover and analyse digital evidence.',
                  },
                  {
                    title: '6. Technology Management and Collaboration',
                    icon: <CpuIcon size={16} />,
                    content: 'Archivists work with IT professionals to manage the technical infrastructure for digital archives. This involves selecting and implementing hardware, software, and storage systems. They also collaborate with vendors and developers to develop and customize digital preservation tools.',
                  },
                  {
                    title: '7. Policy Development and Advocacy',
                    icon: <FileText size={16} />,
                    content: 'Archivists contribute to the development of policies and standards for digital archiving. This involves working with professional organizations and government agencies to establish best practices and guidelines. They also advocate for the importance of digital preservation, raising awareness of the challenges and opportunities in this field.',
                  },
                  {
                    title: '8. Training and Education',
                    icon: <BookOpen size={16} />,
                    content: 'Archivists play a role in training and educating others about digital archiving. This involves developing training materials, conducting workshops, and providing guidance to creators and custodians of digital records. They also contribute to the education of future archivists, ensuring that they are equipped with the skills and knowledge needed to manage digital collections.',
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

            {/* SECTION 5: Challenges in Managing Digital Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Managing Digital Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Format Obsolescence',
                    icon: <AlertTriangle size={16} />,
                    content: 'Digital file formats can quickly become obsolete as software and hardware evolve. Older files may become unreadable or incompatible with current systems, leading to data loss. This requires archivists to constantly monitor and migrate digital objects to newer, more stable formats, a time-consuming and resource-intensive process.',
                  },
                  {
                    title: '2. Data Migration and Integrity',
                    icon: <Database size={16} />,
                    content: 'Moving digital data from one storage medium or format to another can introduce errors or data loss. Ensuring the integrity of migrated data requires rigorous verification and validation processes. Maintaining the authenticity and reliability of digital records during migration is a critical challenge.',
                  },
                  {
                    title: '3. Storage and Scalability',
                    icon: <Server size={16} />,
                    content: 'Digital archives require vast amounts of storage space, which can become increasingly expensive as collections grow. Scalability is crucial to accommodate future growth and ensure efficient access to data. Managing large volumes of digital data requires robust storage infrastructure and efficient data management strategies.',
                  },
                  {
                    title: '4. Metadata Management',
                    icon: <ClipboardList size={16} />,
                    content: 'Metadata, or data about data, is essential for describing and organizing digital archives. Creating and maintaining accurate and consistent metadata is crucial for discoverability and long-term access. However, metadata creation can be time-consuming and labour-intensive.',
                  },
                  {
                    title: '5. Authenticity and Provenance',
                    icon: <Fingerprint size={16} />,
                    content: 'Establishing the authenticity and provenance of digital records can be challenging, especially when dealing with born-digital materials. Digital objects can be easily altered or manipulated, making it difficult to verify their original state. Developing methods for digital forensics and ensuring the integrity of digital records is crucial.',
                  },
                  {
                    title: '6. Digital Preservation Planning',
                    icon: <Clock size={16} />,
                    content: 'Developing and implementing comprehensive digital preservation plans requires a long-term perspective and a deep understanding of evolving technologies. These plans must address issues like format obsolescence, data migration, and storage management. Ensuring the sustainability of digital preservation efforts requires ongoing monitoring and adaptation.',
                  },
                  {
                    title: '7. Access and Security',
                    icon: <Shield size={16} />,
                    content: 'Balancing the need to provide access to digital archives with the need to protect sensitive information and intellectual property rights is a significant challenge. Implementing robust security measures, such as access controls and encryption, is crucial for protecting digital assets.',
                  },
                  {
                    title: '8. Legal and Ethical Issues',
                    icon: <BookOpen size={16} />,
                    content: 'Digital archives raise complex legal and ethical issues related to copyright, privacy, and data ownership. Ensuring compliance with relevant laws and regulations is crucial for protecting the rights of creators and users. Developing clear policies for data access and use is essential.',
                  },
                  {
                    title: '9. Technological Dependence',
                    icon: <CpuIcon size={16} />,
                    content: 'Digital archives are heavily dependent on technology, which can create vulnerabilities. Hardware and software failures, cyberattacks, and power outages can lead to data loss or inaccessibility. Developing robust backup and disaster recovery plans is essential.',
                  },
                  {
                    title: '10. Staffing and Training',
                    icon: <Users size={16} />,
                    content: 'Managing digital archives requires specialized skills and expertise. Archivists must be trained in digital preservation, metadata management, and information technology. Recruiting and retaining qualified staff can be challenging, especially in a rapidly evolving technological landscape.',
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

            {/* SECTION 6: Benefits of Digitising Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['benefits'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Benefits of Digitising Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Increased Accessibility and Wider Reach',
                    icon: <Globe size={16} />,
                    content: 'Digitization makes archival materials accessible to a global audience via the internet. Researchers, students, and the general public can access digitized documents, photographs, and audio-visual materials from anywhere in the world, eliminating the need for physical visits to the archives. This greatly expands the reach of archival collections, making them available to a much broader audience than ever before.',
                  },
                  {
                    title: 'Enhanced Searchability and Discoverability',
                    icon: <Search size={16} />,
                    content: 'Digital archives allow for sophisticated search and retrieval capabilities. Full-text search, metadata tagging, and keyword searches enable users to quickly locate specific items within large collections. This greatly enhances the discoverability of archival materials, making it easier for researchers to find relevant information.',
                  },
                  {
                    title: 'Improved Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: 'Digitization creates digital surrogates of fragile or valuable original materials, reducing the need for physical handling. This minimizes the risk of damage or deterioration, extending the lifespan of these irreplaceable records. Digital copies can also be used for research and exhibition purposes, further protecting the originals.',
                  },
                  {
                    title: 'Facilitated Sharing and Collaboration',
                    icon: <Share2 size={16} />,
                    content: 'Digitized archival materials can be easily shared and distributed electronically, fostering collaboration among researchers and institutions. This eliminates the need for physical copies or interlibrary loans, streamlining the research process. Digital copies can also be incorporated into online exhibits and educational resources.',
                  },
                  {
                    title: 'Creation of Digital Exhibits and Online Resources',
                    icon: <Presentation size={16} />,
                    content: 'Digitization enables the creation of engaging and interactive digital exhibits and online resources. These resources can incorporate multimedia elements, such as audio, video, and interactive maps, to enhance the user experience. Online exhibits can bring history to life, making it more accessible and engaging for diverse audiences.',
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

            {/* SECTION 7: Solutions to Challenges of Managing Digital Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['solutions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Solutions to Challenges of Managing Digital Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Proactive Format Migration',
                    icon: <Database size={16} />,
                    content: 'To combat format obsolescence, archivists should implement proactive format migration strategies. This involves regularly migrating digital objects to newer, more stable, and widely supported formats. Normalization, or converting files to standard formats, can also ensure long-term compatibility. Using open-source and well-documented formats can reduce the risk of obsolescence.',
                  },
                  {
                    title: '2. Robust Data Integrity Verification',
                    icon: <Shield size={16} />,
                    content: 'To address data migration challenges, archivists must implement robust data integrity and verification processes. This includes using checksums and other verification tools to ensure that data is transferred accurately and completely. Regular audits and validation checks can identify and correct errors or inconsistencies.',
                  },
                  {
                    title: '3. Scalable Storage Solutions',
                    icon: <Server size={16} />,
                    content: 'To manage storage and scalability challenges, archives should adopt scalable and redundant storage solutions. This may involve using cloud storage services that offer flexibility and cost-effectiveness or implementing on-site storage solutions with robust backup and disaster recovery plans.',
                  },
                  {
                    title: '4. Comprehensive Metadata Standards',
                    icon: <ClipboardList size={16} />,
                    content: 'To address metadata management challenges, archives should adopt comprehensive metadata standards and practices. This includes using standardized metadata schemas, such as Dublin Core or METS, and developing clear guidelines for metadata creation and maintenance. Automated metadata extraction tools can help to streamline the process.',
                  },
                  {
                    title: '5. Chain of Custody Documentation',
                    icon: <Fingerprint size={16} />,
                    content: 'To address authenticity and provenance challenges, archives should implement chain of custody documentation and digital forensics practices. This involves meticulously tracking the history of digital objects, documenting all actions taken to preserve and manage them. Digital forensics tools and techniques can be used to examine digital objects and verify their authenticity.',
                  },
                  {
                    title: '6. Long-Term Preservation Planning',
                    icon: <Clock size={16} />,
                    content: 'To address digital preservation planning challenges, archives should develop and implement comprehensive digital preservation plans. These plans should address issues like format obsolescence, data migration, and storage management, and should be regularly reviewed and updated. Collaboration with other institutions and participation in digital preservation initiatives can help to ensure the sustainability of these efforts.',
                  },
                  {
                    title: '7. Robust Access Controls',
                    icon: <Shield size={16} />,
                    content: 'To address access and security challenges, archives should implement robust access controls and security protocols. This includes using encryption, access controls, and authentication mechanisms to protect sensitive information. Developing clear access policies and procedures is essential for balancing the need to provide access with the need to protect data.',
                  },
                  {
                    title: '8. Compliance with Legal Standards',
                    icon: <BookOpen size={16} />,
                    content: 'To address legal and ethical issues, archives should develop clear policies and procedures for data access and use, ensuring compliance with relevant laws and regulations. This includes addressing issues related to copyright, privacy, and data ownership. Regular reviews of legal and ethical standards are essential for keeping policies up to date.',
                  },
                  {
                    title: '9. Redundant Infrastructure',
                    icon: <Server size={16} />,
                    content: 'To address technological dependence challenges, archives should implement redundant infrastructure and disaster recovery plans. This includes using redundant hardware and software systems and storing backup copies of data in multiple locations. Regular testing of disaster recovery plans is essential for ensuring their effectiveness.',
                  },
                  {
                    title: '10. Ongoing Staff Training',
                    icon: <Users size={16} />,
                    content: 'To address staffing and training challenges, archives should invest in ongoing staff training and professional development. This includes providing training on digital preservation, metadata management, and information technology. Collaboration with other institutions and participation in professional organizations can help to ensure that staff are up to date on the latest technologies and best practices.',
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

            {/* SECTION 8: Incorporating New Technologies in Archival Management */}
            <div
              ref={(el) => {
                sectionRefs.current['newtech'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Incorporating New Technologies in Archival Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Digital Asset Management Systems (DAMS)',
                    icon: <Database size={16} />,
                    content: 'DAMS are becoming indispensable for managing the increasing volume of digital records. These systems provide centralized repositories for storing, organizing, and retrieving digital assets, including digitized documents, images, audio, and video files. DAMS offer advanced features like metadata management, version control, and access controls, ensuring that digital records are properly described, preserved, and accessible.',
                  },
                  {
                    title: 'OCR and Text Mining',
                    icon: <Scan size={16} />,
                    content: 'OCR technology allows archivists to convert scanned images of text into machine-readable text. This makes digitized documents searchable, enabling researchers to quickly find specific information within large collections. Text mining tools can then analyse these text-rich documents, extracting key themes, patterns, and relationships.',
                  },
                  {
                    title: 'Artificial Intelligence (AI) and Machine Learning',
                    icon: <CpuIcon size={16} />,
                    content: 'AI and ML are automating various archival tasks, improving efficiency and accuracy. AI-powered tools can automatically generate metadata, classify documents, and recognize images, reducing the need for manual processing. ML algorithms can also analyse large datasets, identifying patterns and relationships that might be missed by human researchers.',
                  },
                  {
                    title: 'Blockchain Technology',
                    icon: <Fingerprint size={16} />,
                    content: 'Blockchain technology, known for its security and immutability, is being explored for its potential in ensuring the authenticity and provenance of digital archives. Blockchain can create an unalterable record of transactions, documenting the history of digital objects and preventing tampering. This is particularly valuable for preserving digital records of legal or historical significance.',
                  },
                  {
                    title: 'Cloud Computing and Storage',
                    icon: <Cloud size={16} />,
                    content: 'Cloud computing offers scalable and cost-effective solutions for storing and managing digital archives. Cloud storage services provide secure and reliable storage for large volumes of data, with features like redundancy and disaster recovery. Cloud-based tools facilitate collaboration and remote access, enabling researchers and archivists to work together from anywhere in the world.',
                  },
                  {
                    title: 'Linked Data and Semantic Web',
                    icon: <Network size={16} />,
                    content: 'Linked data and semantic web technologies enable archives to connect their data with other online resources, creating a richer and more interconnected web of information. This allows for more sophisticated searches and data analysis and makes archival materials more discoverable through the web. Semantic web tools can create machine-readable metadata that facilitates data integration and interoperability.',
                  },
                  {
                    title: 'Augmented Reality (AR) and Virtual Reality (VR)',
                    icon: <Monitor size={16} />,
                    content: 'AR and VR technologies are transforming how users interact with archival materials. AR overlays digital information onto the real world, while VR creates immersive digital environments. These technologies can bring historical events and figures to life, making archives more engaging and accessible for diverse audiences.',
                  },
                  {
                    title: '3D Scanning and Printing',
                    icon: <Box size={16} />,
                    content: '3D scanning and printing technologies are being used to create digital replicas of physical artifacts and documents. This allows for the preservation and study of fragile or rare items without risking damage to the originals. 3D-printed replicas can also be used for educational purposes and exhibitions.',
                  },
                  {
                    title: 'Robotic Process Automation (RPA)',
                    icon: <Settings size={16} />,
                    content: 'RPA involves the use of software robots to automate repetitive and time-consuming archival tasks. This can include tasks such as data entry, file migration, and metadata extraction. RPA frees up archivists to focus on more complex and strategic work, improving efficiency and productivity.',
                  },
                  {
                    title: 'Advanced Cybersecurity Tools',
                    icon: <ShieldAlert size={16} />,
                    content: 'With the increasing reliance on digital archives, cybersecurity is becoming a critical concern. Advanced cybersecurity tools are being used to protect digital assets from cyberattacks and data breaches. This includes tools for intrusion detection, malware prevention, and data encryption.',
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

            {/* SECTION 9: Archivist Code in Managing Archives */}
            <div
              ref={(el) => {
                sectionRefs.current['code'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Archivist Code in Managing Archives
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Respect for Provenance and Original Order',
                    icon: <FolderTree size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists meticulously maintain the provenance (origin) of records and preserve their original order. This means keeping records from the same creator together and in the arrangement they were used. They document the history of custody and avoid mixing records from different sources.</p>
                        <p><strong>Example:</strong> When processing a collection of personal papers, an archivist ensures that letters, diaries, and photographs are kept in the order they were found, reflecting the creator's filing system.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists prioritize the long-term preservation of archival materials. They implement preservation strategies, such as environmental controls, archival-quality storage, and disaster preparedness plans. They also perform conservation treatments to repair damaged records.</p>
                        <p><strong>Example:</strong> An archivist monitors temperature and humidity in storage areas to prevent deterioration of paper documents. They might also rehouse fragile photographs in acid-free enclosures.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Impartiality and Objectivity',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists strive for impartiality and objectivity in their work. They avoid personal biases and ensure that records are described and made accessible without favouritism or prejudice.</p>
                        <p><strong>Example:</strong> When creating finding aids, an archivist provides neutral descriptions of records, even those that may contain controversial or sensitive information.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Access and Use',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists balance the need to provide access to records with the need to protect privacy, confidentiality, and security. They develop access policies and procedures that are fair and equitable. They also educate users about the proper use of archival materials.</p>
                        <p><strong>Example:</strong> An archivist might implement access restrictions on records containing personal information, in compliance with privacy laws.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Professional Integrity',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists adhere to professional standards and best practices. They maintain their knowledge and skills through continuing education and professional development. They also uphold the reputation of the archival profession.</p>
                        <p><strong>Example:</strong> An archivist participates in workshops and conferences to stay up to date on new technologies and archival techniques.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Cooperation and Collaboration',
                    icon: <Network size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists collaborate with colleagues, researchers, and other stakeholders to advance the goals of the archival profession. They share knowledge and expertise, and they work together to address common challenges.</p>
                        <p><strong>Example:</strong> An archivist might collaborate with a local historical society to develop a joint exhibition.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Respect for Intellectual Property Rights',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists respect copyright and other intellectual property rights. They ensure that users are aware of copyright restrictions and that they comply with relevant laws. They also seek permission from copyright holders when appropriate.</p>
                        <p><strong>Example:</strong> An archivist would inform researchers about copyright restrictions on digitized photographs.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Advocacy for Archives',
                    icon: <Presentation size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists advocate for the importance of archives and the need for adequate resources to support their work. They raise awareness of the value of archival materials and the role of archives in preserving cultural heritage.</p>
                        <p><strong>Example:</strong> An archivist might give presentations to community groups about the importance of local archives.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Responsible Digital Archiving',
                    icon: <Cloud size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists apply ethical principles to the management of digital archives. They ensure the authenticity, integrity, and long-term preservation of digital records. They also address issues related to privacy, security, and access in the digital environment.</p>
                        <p><strong>Example:</strong> An archivist would implement digital preservation strategies to ensure that digital records remain accessible over time.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Transparency and Accountability',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Application:</strong> Archivists maintain transparency in their operations and are accountable for their actions. They document their decisions and procedures, and they provide clear and accurate information to users.</p>
                        <p><strong>Example:</strong> An archivist would document the appraisal and selection process for archival materials.</p>
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

            {/* SECTION 10: Basic Elements of Archival Legislation */}
            <div
              ref={(el) => {
                sectionRefs.current['legislation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Elements of Archival Legislation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Definition of Archives and Public Records',
                    icon: <FileText size={16} />,
                    content: 'Archival legislation begins by defining key terms, such as "archives," "public records," and "records of enduring value." These definitions clarify the scope of the legislation and identify the types of records that fall under its purview. Public records are generally defined as records created or received by government agencies and other public institutions in the course of their official duties.',
                  },
                  {
                    title: '2. Establishment of a National Archives Institution',
                    icon: <Building size={16} />,
                    content: 'Most archival legislation establishes a national archives institution, which is responsible for the overall management and preservation of public records. This institution is typically granted legal authority to acquire, preserve, and make accessible records of enduring value. The legislation may also define the institution\'s mandate, powers, and responsibilities.',
                  },
                  {
                    title: '3. Records Management Responsibilities',
                    icon: <ClipboardList size={16} />,
                    content: 'Archival legislation outlines the records management responsibilities of public agencies. This includes requirements for creating, maintaining, and disposing of records in accordance with established standards and procedures. It may also mandate the development of records retention schedules and the transfer of records to the national archives institution.',
                  },
                  {
                    title: '4. Appraisal and Selection',
                    icon: <Target size={16} />,
                    content: 'Archival legislation typically establishes criteria and procedures for appraising and selecting records of enduring value. This involves evaluating records to determine their historical, legal, administrative, and evidential significance. The legislation may also outline the role of the national archives institution in appraising and selecting records for permanent preservation.',
                  },
                  {
                    title: '5. Access to Archival Records',
                    icon: <Users size={16} />,
                    content: 'Archival legislation addresses the issue of public access to archival records. It may outline the rights of citizens to access public records and establish procedures for requesting and obtaining access. It may also define access restrictions, such as those related to privacy, national security, or legal requirements.',
                  },
                  {
                    title: '6. Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: 'Archival legislation mandates the preservation and conservation of archival records. This includes requirements for proper storage, environmental controls, and conservation treatments. It may also outline the role of the national archives institution in preserving and conserving records.',
                  },
                  {
                    title: '7. Legal Status of Archival Records',
                    icon: <BookOpen size={16} />,
                    content: 'Archival legislation defines the legal status of archival records. This may include provisions related to the admissibility of archival records as evidence in legal proceedings. It may also address issues related to copyright and intellectual property rights.',
                  },
                  {
                    title: '8. Penalties for Non-Compliance',
                    icon: <AlertTriangle size={16} />,
                    content: 'Archival legislation may include penalties for non-compliance with its provisions. This may include fines, imprisonment, or other sanctions for individuals or organizations that fail to comply with records management requirements or access restrictions.',
                  },
                  {
                    title: '9. Funding and Resources',
                    icon: <Banknote size={16} />,
                    content: 'Archival legislation may address the issue of funding and resources for the national archives institution. This may include provisions for government funding, grants, or other sources of revenue. This section ensures that the archives have the resources it needs to carry out its mandate.',
                  },
                  {
                    title: '10. Review and Amendment',
                    icon: <RefreshCw size={16} />,
                    content: 'Archival legislation should include provisions for its periodic review and amendment. This ensures that the legislation remains relevant and up to date in light of changing technologies and societal needs. This section ensures that the legislation can be adapted to meet the evolving needs of the archives and the public.',
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

            {/* SECTION 11: Functions of Archival Legislation */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Functions of Archival Legislation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Establishing a Legal Mandate',
                    icon: <Building size={16} />,
                    content: 'Archival legislation creates the legal basis for the existence and operation of archival institutions, typically a national archives or similar body. It defines the institution\'s mandate, powers, and responsibilities, ensuring that it has the authority to acquire, preserve, and provide access to archival records.',
                  },
                  {
                    title: '2. Defining Public Records',
                    icon: <FileText size={16} />,
                    content: 'The legislation clarifies what constitutes "public records" and "archival materials," setting clear boundaries for the records that fall under its purview. This ensures that all relevant records, including those created by government agencies and other public institutions, are subject to proper management and preservation.',
                  },
                  {
                    title: '3. Ensuring Proper Records Management',
                    icon: <ClipboardList size={16} />,
                    content: 'Archival legislation mandates that public agencies create, maintain, and dispose of records in accordance with established standards and procedures. This includes requirements for developing records retention schedules, transferring records to the archives when appropriate, and ensuring the integrity and security of records.',
                  },
                  {
                    title: '4. Regulating Appraisal and Selection',
                    icon: <Target size={16} />,
                    content: 'The legislation establishes criteria and procedures for appraising and selecting records of enduring value for permanent preservation. This ensures that only records with historical, legal, administrative, or evidential significance are retained, preventing the accumulation of unnecessary records.',
                  },
                  {
                    title: '5. Guaranteeing Public Access',
                    icon: <Users size={16} />,
                    content: 'Archival legislation outlines the rights of citizens to access public records, subject to certain restrictions. It establishes procedures for requesting and obtaining access, ensuring transparency and accountability in government. It also defines access restrictions related to privacy, national security, or legal requirements.',
                  },
                  {
                    title: '6. Mandating Preservation and Conservation',
                    icon: <Shield size={16} />,
                    content: 'The legislation requires archival institutions to implement measures for the preservation and conservation of archival records. This includes proper storage, environmental controls, and conservation treatments. This function ensures that records are protected from damage and deterioration.',
                  },
                  {
                    title: '7. Establishing Legal Status',
                    icon: <BookOpen size={16} />,
                    content: 'Archival legislation defines the legal status of archival records, including their admissibility as evidence in legal proceedings. This ensures that archival records are recognized as authentic and reliable sources of information, supporting legal and administrative functions.',
                  },
                  {
                    title: '8. Providing for Funding and Resources',
                    icon: <Banknote size={16} />,
                    content: 'The legislation may address the issue of funding and resources for archival institutions, ensuring that they have the necessary support to carry out their mandate. This includes provisions for government funding, grants, or other sources of revenue.',
                  },
                  {
                    title: '9. Ensuring Transparency and Accountability',
                    icon: <Shield size={16} />,
                    content: 'Archival legislation promotes transparency and accountability in the management of public records. It establishes clear guidelines and procedures for records management, access, and preservation, ensuring that archival institutions are accountable to the public.',
                  },
                  {
                    title: '10. Facilitating Review and Amendment',
                    icon: <RefreshCw size={16} />,
                    content: 'Archival legislation should include provisions for its periodic review and amendment to ensure its continued relevance and effectiveness. This allows the legislation to adapt to changing technologies, societal needs, and best practices in archival management.',
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
                  💡 Digital Insight
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
                  <span>Technologies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Challenges</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Legislation Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Digital archives require specialised technologies (DAMS, OCR, AI, Blockchain, Cloud, Linked Data). Resources needed: hardware, software, skilled personnel, funding, policies, and community collaboration. Archivists play key roles in appraisal, preservation, metadata management, curation, forensics, and policy development. Challenges include format obsolescence, data migration, storage, metadata, authenticity, access, legal issues, technological dependence, and staffing. Solutions include proactive migration, data integrity verification, scalable storage, metadata standards, and ongoing training. Archival legislation establishes mandates, defines records, ensures proper management, guarantees access, and mandates preservation.
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
                <strong className="text-white">Digital Archives Overview</strong> – Collections of electronic records preserved for long-term use, requiring specialised software, hardware, and expertise to manage format obsolescence, data migration, and long-term storage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Technologies &amp; Resources</strong> – DAMS, OCR, AI/ML, Blockchain, Cloud, and Linked Data are transforming archival management. Resources needed: hardware, software, skilled personnel, funding, policies, and community collaboration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges &amp; Solutions</strong> – Format obsolescence, data migration, storage, metadata, authenticity, access, legal issues, technological dependence, and staffing. Solutions: proactive migration, data integrity verification, scalable storage, metadata standards, and ongoing training.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Archivist Role &amp; Legislation</strong> – Archivists handle appraisal, preservation, metadata, curation, forensics, and policy. Archival legislation establishes mandates, defines public records, ensures proper management, guarantees access, mandates preservation, and provides for funding.
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
            Sidemann Academic Registry • Digital Archives Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;