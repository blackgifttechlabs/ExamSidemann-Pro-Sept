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

  // ─── Icons specific to this LO2 content ────────────────────────────────
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
  TreePalm as  Tree,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'role', label: 'Role of Professionals' },
  { id: 'importance', label: 'Importance' },
  { id: 'sources', label: 'Sources' },
  { id: 'nature-features', label: 'Nature & Features' },
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
        text: 'Information professionals play a crucial role in ensuring that Indigenous Knowledge is respectfully documented, preserved, and made accessible to both communities and researchers.',
      },
      {
        title: 'Pro Tip',
        text: 'When working with IKS, always prioritise community consent, cultural protocols, and benefit‑sharing agreements to avoid misappropriation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five roles of information professionals in IKS: Document, Preserve, Access, Train, and Advocate.',
      },
      {
        title: 'Common Mistake',
        text: 'Assuming IKS is static – in reality, it is adaptive and constantly evolving in response to environmental and social changes.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Information professionals play a crucial role in ensuring that Indigenous Knowledge is respectfully documented, preserved, and made accessible to both communities and researchers.',
      },
      {
        title: 'Pro Tip',
        text: 'When working with IKS, always prioritise community consent, cultural protocols, and benefit‑sharing agreements to avoid misappropriation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five roles of information professionals in IKS: Document, Preserve, Access, Train, and Advocate.',
      },
      {
        title: 'Common Mistake',
        text: 'Assuming IKS is static – in reality, it is adaptive and constantly evolving in response to environmental and social changes.',
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
            <FolderTree size={14} className="inline mr-1" /> INDIGENOUS KNOWLEDGE SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Information Professionals &amp; Indigenous Knowledge —{' '}
            <span className="text-sky-300 font-bold italic">
              Roles, Importance &amp; Nature
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to the role of information professionals, importance, sources, nature, and features of Indigenous Knowledge Systems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Professionals
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Heart size={14} className="inline mr-1" /> Importance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Sources
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
            {/* SECTION 1: Role of Information Professionals */}
            <div
              ref={(el) => {
                sectionRefs.current['role'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role of Information Professionals in Indigenous Knowledge Systems (IKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Information professionals play a vital role in the management, preservation, and dissemination of Indigenous Knowledge Systems (IKS). Their expertise in information organization, access, and preservation is crucial for ensuring that IKS is protected, utilized, and passed on to future generations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Documentation and Organization',
                    icon: <FileTextIcon size={16} />,
                    content:
                      'Information professionals are skilled in documenting and organizing information, which is essential for preserving IKS. They can develop culturally sensitive methods for recording, transcribing, and cataloging oral traditions, traditional practices, and other forms of IKS. This includes creating metadata standards that reflect indigenous perspectives and ensuring that information is organized in a way that is accessible and understandable to indigenous communities.',
                  },
                  {
                    title: '2. Preservation and Archiving',
                    icon: <ArchiveIcon size={16} />,
                    content:
                      'Information professionals are responsible for the long-term preservation of information. They can develop and implement strategies for archiving IKS, including the use of digital technologies and traditional storage methods. This ensures that IKS is protected from loss or deterioration and remains available for future generations. They are also vital in the digital preservation of audio and video recordings of IKS.',
                  },
                  {
                    title: '3. Access and Dissemination',
                    icon: <Database size={16} />,
                    content:
                      'Information professionals play a key role in making IKS accessible to indigenous communities, researchers, and the public. They can develop online databases, digital repositories, and other information systems that facilitate the retrieval and dissemination of IKS. They also help to develop educational materials and programs that promote awareness and understanding of IKS.',
                  },
                  {
                    title: '4. Information Literacy and Training',
                    icon: <Users size={16} />,
                    content:
                      'Information professionals can provide training and support to indigenous communities on information literacy skills, empowering them to manage their own knowledge. This includes teaching communities how to use information technologies, conduct research, and access relevant resources. They can also facilitate knowledge exchange between indigenous communities and researchers.',
                  },
                  {
                    title: '5. Ethical Considerations and Advocacy',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'Information professionals are committed to ethical principles, such as respect for intellectual property rights, cultural sensitivity, and informed consent. They can advocate for the protection of IKS and ensure that it is used in a responsible and culturally appropriate manner. They also help to prevent the misappropriation of IKS by external actors.',
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

            {/* SECTION 2: Importance of IKS */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Importance of Indigenous Knowledge Systems (IKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems (IKS) are invaluable resources that offer unique perspectives and solutions to a range of challenges. Their importance can be justified through several key points:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Sustainable Resource Management',
                    icon: <Leaf size={16} />,
                    content:
                      'IKS often contains detailed knowledge of local ecosystems and sustainable resource management practices. This knowledge is crucial for addressing environmental challenges such as climate change, deforestation, and biodiversity loss. IKS provides insights into traditional practices that have proven effective over centuries.',
                  },
                  {
                    title: '2. Cultural Preservation and Identity',
                    icon: <Heart size={16} />,
                    content:
                      'IKS is deeply intertwined with cultural identity and heritage. It plays a vital role in maintaining cultural traditions, languages, and social structures. Preserving IKS helps to safeguard cultural diversity and promote a sense of belonging.',
                  },
                  {
                    title: '3. Health and Well-being',
                    icon: <HeartPulse size={16} />,
                    content:
                      'IKS often includes traditional medical knowledge and practices that have been used for generations to treat illnesses and promote well-being. This knowledge can complement modern medicine and provide alternative approaches to health care.',
                  },
                  {
                    title: '4. Food Security and Agriculture',
                    icon: <Apple size={16} />,
                    content:
                      'IKS provides valuable knowledge about traditional agricultural practices, seed preservation, and food processing techniques. This knowledge is crucial for ensuring food security, particularly in the face of climate change and other environmental challenges.',
                  },
                  {
                    title: '5. Social Justice and Empowerment',
                    icon: <Scale size={16} />,
                    content:
                      'Recognizing and valuing IKS empowers indigenous communities and promotes social justice. It challenges dominant narratives and acknowledges the contributions of indigenous peoples to society. IKS also helps to ensure that indigenous communities have a voice in decisions that affect their lives.',
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

            {/* SECTION 3: Sources of IKS */}
            <div
              ref={(el) => {
                sectionRefs.current['sources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Various Sources of Indigenous Knowledge Systems (IKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems (IKS) are rich and diverse, drawing from a multitude of sources that reflect the intimate relationship between indigenous communities and their environments. Understanding these sources is crucial for appreciating the depth and complexity of IKS.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Oral Traditions:</strong> Oral traditions are a primary source of IKS, encompassing stories, songs, myths, legends, and proverbs passed down through generations. These narratives often contain valuable information about history, cultural values, ecological knowledge, and traditional practices. Oral transmission ensures that knowledge is embedded in cultural context and adapted to evolving circumstances.
                  </li>
                  <li>
                    <strong>Traditional Practices and Skills:</strong> IKS is embedded in the daily practices and skills of indigenous communities. This includes traditional farming techniques, hunting and gathering methods, medicinal practices, craftwork, and building techniques. These practices are often based on centuries of observation and experimentation, reflecting a deep understanding of local ecosystems and resources.
                  </li>
                  <li>
                    <strong>Observation and Experience:</strong> Indigenous communities have a long history of observing and interacting with their environments. This direct experience has led to a deep understanding of natural phenomena, plant and animal behavior, and ecological processes.
                  </li>
                  <li>
                    <strong>Spiritual Beliefs and Rituals:</strong> Spiritual beliefs and rituals play a significant role in shaping IKS. Many indigenous communities view the natural world as sacred and interconnected, and their spiritual practices reflect this worldview.
                  </li>
                  <li>
                    <strong>Customary Laws and Social Norms:</strong> Customary laws and social norms provide a framework for regulating behavior and managing resources within indigenous communities. These laws and norms often reflect a deep understanding of ecological balance and sustainable resource use.
                  </li>
                  <li>
                    <strong>Material Culture:</strong> Material culture, such as tools, artifacts, and traditional technologies, can also be a source of IKS. The design and use of these objects often reflect a deep understanding of local materials and ecological processes.
                  </li>
                  <li>
                    <strong>Dreaming and Intuition:</strong> In some Indigenous cultures, dreaming and intuition are recognised as valid sources of knowledge. This knowledge is seen as coming from spiritual realms, or from ancestors.
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Nature and Features of IKS */}
            <div
              ref={(el) => {
                sectionRefs.current['nature-features'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Nature and Features of Indigenous Knowledge Systems (IKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems (IKS) are complex and dynamic bodies of knowledge, deeply rooted in the cultural and ecological contexts of specific communities. Their nature and features set them apart from other knowledge systems, particularly Western scientific knowledge.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Holistic and Integrated:</strong> IKS are fundamentally holistic, viewing the world as an interconnected web of relationships. They integrate spiritual, social, and ecological dimensions, recognizing the interdependence of all living things.
                  </li>
                  <li>
                    <strong>Context-Specific and Localized:</strong> IKS are deeply rooted in the specific ecological and cultural contexts of indigenous communities. They are developed through generations of observation and interaction with the local environment, reflecting the unique characteristics of a particular place.
                  </li>
                  <li>
                    <strong>Oral and Experiential:</strong> A significant feature of IKS is its reliance on oral transmission and experiential learning. Knowledge is passed down through generations through stories, songs, rituals, and practical demonstrations.
                  </li>
                  <li>
                    <strong>Dynamic and Adaptive:</strong> IKS are not static; they are dynamic and adaptive, evolving over time in response to changing environmental and social conditions.
                  </li>
                  <li>
                    <strong>Spiritual and Ethical Dimensions:</strong> Spiritual beliefs and ethical values play a significant role in shaping IKS. Many indigenous communities view the natural world as sacred and interconnected, and their practices reflect this worldview.
                  </li>
                  <li>
                    <strong>Community-Based and Collective:</strong> IKS are typically held and managed collectively by indigenous communities. Knowledge is shared and transmitted through social networks and community institutions.
                  </li>
                  <li>
                    <strong>Practical and Applied:</strong> IKS are primarily focused on practical applications for sustainable living. They provide solutions to real-world problems related to agriculture, medicine, resource management, and social organization.
                  </li>
                  <li>
                    <strong>Long-Term Observational:</strong> Due to the long periods of time that indigenous communities have lived in their environments, they have very long term data sets, that western science has only recently started to gather.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 IKS Insight
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
                  <span>Professional Roles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Importance Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Sources of IKS</span>
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
                Information professionals are essential for documenting, preserving, accessing, and advocating for IKS. IKS is vital for sustainable resource management, cultural identity, health, food security, and social justice. Sources include oral traditions, practices, observation, spirituality, customary laws, material culture, and intuition. IKS is holistic, context‑specific, oral, adaptive, spiritual, community‑based, practical, and built on long‑term observation.
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
                <strong className="text-white">Role of Professionals</strong> – Information professionals document, preserve, provide access, train communities, and advocate for ethical handling of IKS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Importance of IKS</strong> – IKS supports sustainable resource management, cultural preservation, health, food security, and social justice.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sources of IKS</strong> – Oral traditions, traditional practices, observation, spiritual beliefs, customary laws, material culture, and intuition all contribute to IKS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Nature & Features</strong> – IKS is holistic, context‑specific, oral, adaptive, spiritual, community‑based, practical, and grounded in long‑term observation.
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
            Sidemann Academic Registry • Information Professionals &amp; Indigenous Knowledge 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;