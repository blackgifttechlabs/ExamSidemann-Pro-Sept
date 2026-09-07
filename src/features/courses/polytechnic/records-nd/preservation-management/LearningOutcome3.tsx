import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // ─── Icons used in the LO1 template ────────────────────────────────────
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

  // ─── Icons specific to this LO3 content ────────────────────────────────
  FolderTree,
  Home,
  Leaf,
  Globe,
  Users,
  Database,
  Heart,
  HeartPulse,
  Apple,
  Scale,
  FileText as FileTextIcon,
  Archive as ArchiveIcon,
  Shield as ShieldIcon,
  BookOpen as BookOpenIcon2,
  AlertCircle,
  MessageSquare,
  Building,
  Sun,
  Eye,
  Brain,
  Link,
  AlertTriangle,
  Handshake,
  TrendingUp,
  Clock as ClockIcon,
  Mic,
  Pill,
  Share2,
  Lightbulb,
  Award as AwardIcon,
  Lock,
  Copy,
  Quote,
  ListChecks,
  Edit,
  Clipboard,
  Briefcase,
  Layers as LayersIcon,
  User,
  UserCheck,
  Scale as ScaleIcon,
  Bug,
  FlaskRound,
  HardDrive as HardDriveIcon,
  Scan,
  Wrench,
  Sparkle,
  ThumbsUp,
  Camera,
  Video,
  Microscope,
  Box,
  HardDrive,
  Cloud,
  Server,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'preservation', label: 'Digital Preservation' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'mitigation', label: 'Mitigation Factors' },
  { id: 'strategies', label: 'Strategies' },
  { id: 'advantages-limitations', label: 'Advantages & Limitations' },
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
        text: 'The first digital preservation strategies emerged in the 1990s as institutions began to recognise the fragility of digital media and the risks of technological obsolescence.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep at least three copies of important digital data, stored on two different media, with one copy kept off‑site for disaster recovery.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four key strategies for digital preservation: Migration, Emulation, Normalisation, and Technology Preservation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations digitise records but neglect ongoing preservation—migration, integrity checks, and metadata management are essential for long‑term access.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first digital preservation strategies emerged in the 1990s as institutions began to recognise the fragility of digital media and the risks of technological obsolescence.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep at least three copies of important digital data, stored on two different media, with one copy kept off‑site for disaster recovery.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four key strategies for digital preservation: Migration, Emulation, Normalisation, and Technology Preservation.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organisations digitise records but neglect ongoing preservation—migration, integrity checks, and metadata management are essential for long‑term access.',
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
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Digital Preservation &amp; Long-Term Access —{' '}
            <span className="text-purple-300 font-bold italic">
              Strategies, Equipment &amp; Challenges
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to digital preservation equipment, challenges, mitigation factors, strategies, advantages, and limitations.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> Digital
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <RefreshCw size={14} className="inline mr-1" /> Migration
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <LayersIcon size={14} className="inline mr-1" /> Emulation
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
                placeholder="Search for a concept, value, process step..."
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
            {/* SECTION 1: Digital Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['preservation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Preservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital preservation refers to the series of managed activities necessary to ensure continued access to digital materials for as long as necessary. It involves strategies, policies, and actions to combat the challenges of technological obsolescence, media degradation, and data corruption, ensuring that digital information remains authentic, reliable, and usable over time. Unlike physical preservation, digital preservation must account for the dynamic nature of digital objects and the rapidly changing technological landscape.
                  </p>
</div>
            </div>

            {/* SECTION 2: Equipment Used in Digital Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Equipment Used in Digital Preservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital preservation relies on a range of equipment to manage, store, and access digital materials.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Servers and Storage Systems:</strong> High-capacity servers and storage systems are essential for storing large volumes of digital data. These systems should be redundant and scalable to accommodate growing collections. Network Attached Storage (NAS) and Storage Area Networks (SAN) are commonly used.</li>
                  <li><strong>Backup Systems:</strong> Robust backup systems are crucial for creating and maintaining multiple copies of digital data. This includes tape drives, disk arrays, and cloud-based backup services. Redundancy is key to preventing data loss.</li>
                  <li><strong>Data Migration Tools:</strong> Software and hardware tools are used to migrate digital data from obsolete formats and media to current ones. This ensures that data remains accessible as technology evolves.</li>
                  <li><strong>Emulation Software:</strong> Emulation software allows users to run older software on modern computers, enabling access to digital materials created in obsolete formats.</li>
                  <li><strong>Virtualization Tools:</strong> Virtualization allows for the creation of virtual environments that mimic older operating systems and hardware. This allows for the preservation of software and data that rely on specific environments.</li>
                  <li><strong>Checksum Verification Tools:</strong> These tools generate and verify checksums (digital fingerprints) to detect data corruption and ensure data integrity.</li>
                  <li><strong>Metadata Extraction Tools:</strong> These tools extract metadata (information about data) from digital files, providing context and aiding in preservation management.</li>
                  <li><strong>Digital Forensics Tools:</strong> These tools can be used to recover and analyze digital data from damaged or obsolete media.</li>
                  <li><strong>Network Infrastructure:</strong> A robust network infrastructure is essential for transferring, storing, and accessing digital data. This includes high-speed internet connections, routers, and switches.</li>
                  <li><strong>Digital Preservation Systems:</strong> Specialized software systems designed to manage and automate digital preservation workflows. These systems often include features for metadata management, data integrity checking, and format migration.</li>
                  <li><strong>Robotic Tape Libraries:</strong> These systems automate the storage and retrieval of tape backups, providing efficient and reliable long-term storage.</li>
                  <li><strong>Cloud Storage:</strong> Cloud storage provides scalable and redundant storage for digital data, offering off-site backups and disaster recovery capabilities.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Challenges in Digital Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Digital Preservation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital preservation faces numerous challenges that require ongoing attention and strategic planning.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Technological Obsolescence:</strong> Rapid advancements in technology lead to the obsolescence of hardware, software, and file formats, making digital materials inaccessible.</li>
                  <li><strong>Media Degradation:</strong> Digital storage media, such as hard drives, CDs, and tapes, have limited lifespans and are susceptible to degradation, leading to data loss.</li>
                  <li><strong>Data Corruption:</strong> Digital data can be corrupted due to hardware failures, software errors, or malicious attacks, compromising its integrity.</li>
                  <li><strong>Scalability:</strong> The exponential growth of digital data poses challenges in terms of storage capacity, processing power, and network bandwidth.</li>
                  <li><strong>Metadata Management:</strong> Accurate and comprehensive metadata is essential for preserving the context and authenticity of digital materials. However, creating and maintaining metadata can be complex and time-consuming.</li>
                  <li><strong>Legal and Ethical Issues:</strong> Copyright restrictions, privacy concerns, and intellectual property rights can complicate digital preservation efforts.</li>
                  <li><strong>Organizational Commitment and Resources:</strong> Digital preservation requires sustained organizational commitment, adequate funding, and skilled personnel, which can be difficult to secure.</li>
                  <li><strong>Authenticity and Integrity:</strong> Ensuring the authenticity and integrity of digital materials over time is challenging due to the ease with which digital data can be altered.</li>
                  <li><strong>Lack of Standards and Best Practices:</strong> While standards and best practices are evolving, there is still a need for greater consensus and standardization in digital preservation.</li>
                  <li><strong>Disaster Recovery:</strong> Digital data can be lost due to natural disasters, power outages, and cyberattacks. Developing robust disaster recovery plans is essential.</li>
                  <li><strong>Long-Term Access:</strong> Ensuring long-term access to digital materials requires ongoing maintenance, migration, and emulation strategies.</li>
                  <li><strong>Format Diversity:</strong> The large amount of different digital formats makes it hard to create a one-size-fits-all solution for preservation.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Mitigation Factors */}
            <div
              ref={(el) => {
                sectionRefs.current['mitigation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Mitigation Factors for Challenges in Preserving Digital Media
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Addressing the challenges of digital preservation requires a multi-faceted approach, employing various mitigation factors.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Format Migration and Normalization:</strong> Regularly migrate digital files to widely supported, open-source formats. This minimizes reliance on proprietary software and reduces the risk of obsolescence. Normalization involves converting files to a consistent, standardized format, simplifying preservation workflows.</li>
                  <li><strong>Emulation and Virtualization:</strong> Utilize emulation software to run older software and operating systems on modern hardware. Virtualization creates virtual environments that replicate older computing systems, enabling access to legacy software and data.</li>
                  <li><strong>Metadata Creation and Management:</strong> Implement robust metadata schemas and workflows to capture essential information about digital objects. This includes technical metadata, descriptive metadata, and preservation metadata. Comprehensive metadata facilitates discovery, access, and long-term management.</li>
                  <li><strong>Checksum Verification and Data Integrity Checks:</strong> Employ checksum algorithms to generate digital fingerprints of files. Regularly verify checksums to detect data corruption and ensure data integrity. Implement error-correcting codes and redundant storage systems.</li>
                  <li><strong>Redundant Storage and Backup Strategies:</strong> Create multiple copies of digital data and store them in geographically diverse locations. Utilize redundant storage systems, such as RAID arrays, and implement regular backup schedules. Cloud-based storage solutions can provide off-site backups and disaster recovery capabilities.</li>
                  <li><strong>Disaster Recovery Planning:</strong> Develop and implement comprehensive disaster recovery plans to protect digital data from natural disasters, power outages, and cyberattacks. Regularly test and update these plans to ensure their effectiveness.</li>
                  <li><strong>Technology Watch and Ongoing Research:</strong> Stay informed about emerging technologies and preservation best practices. Participate in professional organizations and research initiatives to keep abreast of developments in digital preservation.</li>
                  <li><strong>Organizational Policies and Procedures:</strong> Establish clear policies and procedures for digital preservation, including data retention schedules, access controls, and preservation workflows. Secure organizational commitment and allocate adequate resources to support digital preservation activities.</li>
                  <li><strong>Community Collaboration and Standards Development:</strong> Collaborate with other institutions and organizations to share knowledge, develop best practices, and contribute to the development of digital preservation standards.</li>
                  <li><strong>Auditing and Monitoring:</strong> Perform regular audits of the digital preservation systems. Monitor the digital storage for degradation or unauthorized access.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Digital Preservation Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Preservation Strategies
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital preservation strategies are the approaches and methods used to ensure the long-term accessibility, authenticity, and integrity of digital materials. These strategies address the challenges of technological obsolescence, media degradation, and data corruption.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Migration',
                    icon: <RefreshCw size={16} />,
                    content:
                      'This strategy involves periodically transferring digital files from one format or storage medium to another. The goal is to keep the files compatible with current technology. For example, migrating a document from an older word processing format to a newer, more widely supported format.',
                  },
                  {
                    title: 'Emulation',
                    icon: <LayersIcon size={16} />,
                    content:
                      'This strategy focuses on recreating the original hardware and software environment in which a digital object was created. It allows users to access digital materials using emulators that simulate older systems.',
                  },
                  {
                    title: 'Normalization',
                    icon: <FileText size={16} />,
                    content:
                      'This strategy involves converting digital files to standardized, open-source formats. This simplifies preservation workflows and reduces reliance on proprietary software.',
                  },
                  {
                    title: 'Technology Preservation',
                    icon: <HardDrive size={16} />,
                    content:
                      'This strategy involves maintaining the original hardware and software required to access digital objects. This approach is often challenging due to the difficulty of preserving aging technology.',
                  },
                  {
                    title: 'Archival Storage',
                    icon: <Archive size={16} />,
                    content:
                      'This strategy focuses on the secure, long-term storage of digital data, often in specialized archival storage systems. It emphasizes data integrity, redundancy, and disaster recovery.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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

            {/* SECTION 6: Advantages and Limitations of Each Strategy */}
            <div
              ref={(el) => {
                sectionRefs.current['advantages-limitations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Advantages and Limitations of Each Strategy
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Migration',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Keeps files compatible with current technology.</li>
                          <li>Relatively straightforward to implement.</li>
                          <li>Can improve file accessibility.</li>
                          <li>Can convert to more stable file formats.</li>
                          <li>Can be automated.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Potential for data loss or alteration during migration.</li>
                          <li>Requires ongoing migration efforts.</li>
                          <li>May not preserve the original look and feel of the object.</li>
                          <li>Can be expensive to migrate large amounts of data.</li>
                          <li>Needs to be done before the old format becomes completely obsolete.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Emulation',
                    icon: <LayersIcon size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Preserves the original look and feel of digital objects.</li>
                          <li>Allows access to legacy software and data.</li>
                          <li>Can be used to access complex or interactive digital objects.</li>
                          <li>Can be used when migration is not possible.</li>
                          <li>Useful for software preservation.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Complex and resource-intensive to implement.</li>
                          <li>Requires ongoing maintenance of emulators.</li>
                          <li>May not be compatible with all digital objects.</li>
                          <li>Can be difficult to maintain working emulators for very old systems.</li>
                          <li>Legal issues surrounding the use of copyrighted software.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Normalization',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Simplifies preservation workflows.</li>
                          <li>Reduces reliance on proprietary software.</li>
                          <li>Improves file interoperability.</li>
                          <li>Makes long-term preservation more predictable.</li>
                          <li>Can improve data integrity.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Potential for data loss or alteration during conversion.</li>
                          <li>Requires ongoing monitoring of standardized formats.</li>
                          <li>May not preserve the original look and feel of the object.</li>
                          <li>Choosing the correct standards can be difficult.</li>
                          <li>Requires a large amount of processing power for large datasets.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Technology Preservation',
                    icon: <HardDrive size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Preserves the original hardware and software environment.</li>
                          <li>Ensures authentic access to digital objects.</li>
                          <li>Allows for the preservation of complex hardware and software interactions.</li>
                          <li>Useful for preserving specific hardware/software based artworks.</li>
                          <li>Maintains the original user experience.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Extremely difficult and expensive to maintain aging technology.</li>
                          <li>Requires specialized expertise and resources.</li>
                          <li>Subject to hardware failures and obsolescence.</li>
                          <li>Finding replacement parts can be impossible.</li>
                          <li>Environmental considerations for long-term storage of equipment.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Archival Storage',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Advantages:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Ensures long-term data integrity and security.</li>
                          <li>Provides redundant storage and disaster recovery capabilities.</li>
                          <li>Offers scalable storage solutions.</li>
                          <li>Can be used to store large volumes of digital data.</li>
                          <li>Can be combined with other preservation strategies.</li>
                        </ul>
                        <p className="font-semibold mt-2">Limitations:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>High initial and ongoing costs.</li>
                          <li>Requires specialized expertise and infrastructure.</li>
                          <li>Subject to technological obsolescence of storage systems.</li>
                          <li>Relies on robust data management and metadata practices.</li>
                          <li>Needs to be combined with other preservation strategies to prevent format obsolescence.</li>
                        </ul>
                      </>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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
                  💡 Digital Preservation Insight
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
                  <span>Strategies</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Equipment Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
                <li className="flex justify-between">
                  <span>Challenges</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Digital preservation ensures continued access to digital materials. Equipment includes servers, backup systems, migration tools, emulation software, and checksum verification. Key challenges: technological obsolescence, media degradation, data corruption, scalability, metadata management, and legal issues. Mitigation factors: format migration, emulation, metadata management, checksums, redundant storage, and disaster planning. Strategies: migration, emulation, normalisation, technology preservation, and archival storage—each with distinct advantages and limitations.
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
                <strong className="text-white">Digital Preservation</strong> – A set of managed activities to ensure continued access to digital materials, addressing technological obsolescence and data corruption.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Equipment</strong> – Servers, backup systems, migration tools, emulation software, checksum verification, and cloud storage are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges</strong> – Obsolescence, media degradation, data corruption, scalability, metadata complexity, legal issues, and organizational commitment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mitigation Factors</strong> – Format migration, emulation, metadata management, checksums, redundant storage, disaster recovery, and continuous technology watch.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Strategies</strong> – Migration, emulation, normalisation, technology preservation, and archival storage each have advantages and limitations; a combination is often needed.
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
            Sidemann Academic Registry • Digital Preservation &amp; Long-Term Access 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;