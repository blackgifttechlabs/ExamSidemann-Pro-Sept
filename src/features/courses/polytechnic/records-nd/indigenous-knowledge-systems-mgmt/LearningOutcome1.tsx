import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // Standard icons used in LO1 template
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

  // Icons used in the IKS content (from the original second file)
  FolderTree,
  Home,
  Leaf,
  Globe,
  Brain,
  Eye,
  FileText as FileTextIcon,
  AlertCircle,
  MessageSquare,
  Building,
  Sun,
  Users,
  TreePalm as Tree,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'iks-concepts', label: 'IKS Concepts' },
  { id: 'knowledge-types', label: 'Knowledge Types' },
  { id: 'compare-ik-wsk', label: 'IK vs WSK' },
  { id: 'ik-management', label: 'IK Management' },
  { id: 'challenges-solutions', label: 'Challenges & Solutions' },
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
        text: 'Indigenous knowledge is often embedded in cultural practices, rituals, and storytelling, making it a living, dynamic system that evolves with the community.',
      },
      {
        title: 'Pro Tip',
        text: 'When documenting Indigenous knowledge, always use culturally sensitive methods and obtain prior informed consent from the community.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four knowledge types: Indigenous (community-based), Tacit (personal know-how), Implicit (unconscious), and Explicit (codified).',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume Indigenous knowledge is static; in reality, it is adaptive and continuously refined through observation and experimentation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Indigenous knowledge is often embedded in cultural practices, rituals, and storytelling, making it a living, dynamic system that evolves with the community.',
      },
      {
        title: 'Pro Tip',
        text: 'When documenting Indigenous knowledge, always use culturally sensitive methods and obtain prior informed consent from the community.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four knowledge types: Indigenous (community-based), Tacit (personal know-how), Implicit (unconscious), and Explicit (codified).',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume Indigenous knowledge is static; in reality, it is adaptive and continuously refined through observation and experimentation.',
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
            <FolderTree size={14} className="inline mr-1" /> INDIGENOUS KNOWLEDGE SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Indigenous Knowledge Systems —{' '}
            <span className="text-emerald-300 font-bold italic">
              Traditional Wisdom &amp; Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to Indigenous Knowledge Systems, traditional knowledge, TEK, ethno-ecology, knowledge management, and challenges.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> IKS
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Leaf size={14} className="inline mr-1" /> TEK
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Ethno-ecology
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
            {/* SECTION 1: Indigenous Knowledge Systems Concepts */}
            <div
              ref={(el) => {
                sectionRefs.current['iks-concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Indigenous Knowledge Systems Concepts
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems refers to the accumulated body of knowledge, practices, and beliefs developed by indigenous or traditional communities over generations through their interactions with their environment and social systems.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Local Knowledge',
                    icon: <Home size={16} />,
                    content:
                      'Local knowledge refers to the understanding, skills, and philosophies developed by people in a specific community or region. It is rooted in their direct experiences and interactions with their local environment. Local knowledge is dynamic, evolving over time through observation, experimentation, and transmission across generations. It encompasses a wide range of domains, including agriculture, natural resource management, health, and social organization. Local knowledge is context-specific, reflecting the unique ecological and cultural characteristics of a particular area. It is vital for sustainable development, as it provides valuable insights into local ecosystems and resource management practices.',
                  },
                  {
                    title: '2. Traditional Knowledge',
                    icon: <BookOpen size={16} />,
                    content:
                      'Traditional knowledge is a broader term that encompasses the accumulated knowledge, practices, and beliefs of indigenous or traditional communities. It is often transmitted orally across generations and is deeply intertwined with cultural values and spiritual beliefs. Traditional knowledge systems are holistic, integrating ecological, social, and spiritual dimensions. They include knowledge about plants, animals, natural phenomena, and social customs. Traditional knowledge is recognized as a valuable resource for addressing contemporary challenges, such as climate change, biodiversity conservation, and sustainable development.',
                  },
                  {
                    title: '3. Traditional Ecological Knowledge (TEK)',
                    icon: <Leaf size={16} />,
                    content:
                      'Traditional Ecological Knowledge (TEK) is a specialized subset of traditional knowledge that focuses specifically on the relationship between indigenous or traditional communities and their environment. It encompasses knowledge about ecological processes, resource management practices, and the interconnectedness of living organisms. TEK is characterized by its emphasis on observation, experimentation, and long-term ecological monitoring. It is often embedded in cultural practices, such as rituals, ceremonies, and storytelling. TEK is increasingly recognized as a valuable source of information for conservation and sustainable resource management, as it provides insights into traditional practices that have proven effective over centuries.',
                  },
                  {
                    title: '4. Ethno-ecology',
                    icon: <Globe size={16} />,
                    content:
                      'Ethno-ecology is an interdisciplinary field that studies the relationship between people and their environment from an indigenous or traditional perspective. It combines ecological science with anthropological and ethnological methods to understand how indigenous and traditional communities perceive, manage, and interact with their ecosystems. Ethno-ecology investigates the cultural and cognitive dimensions of ecological knowledge, exploring how cultural values, beliefs, and practices shape ecological understanding. It also examines the impact of social and economic factors on ecological knowledge and resource management. Ethno-ecology provides a framework for understanding the complex interactions between people and their environment, and for promoting the integration of indigenous and traditional knowledge into conservation and development initiatives.',
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

            {/* SECTION 2: Differentiating Knowledge Types */}
            <div
              ref={(el) => {
                sectionRefs.current['knowledge-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Differentiating Between Indigenous Knowledge, Tacit Knowledge, Implicit Knowledge, and Explicit Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    While these terms all deal with how knowledge is held and expressed, they each have distinct characteristics and applications.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Indigenous Knowledge',
                    icon: <Tree size={16} />,
                    content:
                      'Indigenous knowledge (IK) is a holistic and dynamic body of knowledge, practices, and beliefs developed by indigenous or traditional communities over generations. It is deeply rooted in their cultural and ecological contexts, often transmitted orally, and encompasses a wide range of domains, including agriculture, medicine, and natural resource management. IK is characterized by its interconnectedness with cultural values, spiritual beliefs, and social customs. It is context-specific, reflecting the unique experiences and perspectives of particular communities. IK is often a collective knowledge, held by the community as a whole.',
                  },
                  {
                    title: '2. Tacit Knowledge',
                    icon: <Brain size={16} />,
                    content:
                      'Tacit knowledge is knowledge that is difficult to articulate or codify. It is often described as "knowing how" rather than "knowing that." It is acquired through experience, practice, and intuition, and it is often embedded in skills, habits, and routines. Examples include riding a bicycle, playing a musical instrument, or recognizing subtle patterns. Tacit knowledge is personal and context-dependent, and it is often difficult to transfer to others.',
                  },
                  {
                    title: '3. Implicit Knowledge',
                    icon: <Eye size={16} />,
                    content:
                      'Implicit knowledge is knowledge that is unconsciously held or applied. It is knowledge that people may not be aware they possess, but that influences their behavior and decision-making. Implicit knowledge is often acquired through observation, imitation, and unconscious learning. It is similar to tacit knowledge in that it is difficult to articulate, but it differs in that it is often unconscious.',
                  },
                  {
                    title: '4. Explicit Knowledge',
                    icon: <FileTextIcon size={16} />,
                    content:
                      'Explicit knowledge is knowledge that is easily articulated, codified, and communicated. It is knowledge that can be expressed in words, symbols, or other forms of representation. Examples include facts, figures, formulas, and procedures. Explicit knowledge can be stored in documents, databases, and other information systems. It is easily transferred to others through written or verbal communication.',
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

            {/* SECTION 3: Comparing IK and WSK */}
            <div
              ref={(el) => {
                sectionRefs.current['compare-ik-wsk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Comparing and Contrasting Indigenous Knowledge and Western Scientific Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge (IK) and Western scientific knowledge (WSK) represent distinct approaches to understanding the world, each with its own strengths and limitations. While they differ significantly in their methodologies and worldviews, they are not mutually exclusive and can often complement each other.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full border-collapse border border-slate-200 dark:border-slate-700 text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">
                        Aspect
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">
                        Indigenous Knowledge (IK)
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-bold text-slate-700 dark:text-slate-300">
                        Western Scientific Knowledge (WSK)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        Methodology
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Primarily relies on observation, experience, and oral transmission across generations. It is often holistic, integrating spiritual, social, and ecological dimensions.
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Emphasizes empirical observation, experimentation, and hypothesis testing. It is often reductionist, focusing on isolating and analyzing individual variables.
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        Worldview
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Often views the world as interconnected and interdependent, emphasizing the relationship between humans and nature.
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Tends to view the world as mechanistic and objective, separating humans from nature.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        Transmission
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Primarily transmitted orally through stories, songs, rituals, and practical demonstrations.
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Primarily transmitted through written documents, formal education, and scientific publications.
                      </td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        Validation
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Validated through community consensus, long-term observation, and practical application.
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Validated through peer review, replication of experiments, and statistical analysis.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200">
                        Focus
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Often focused on practical applications for sustainable living within a specific environment.
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-400">
                        Often focused on generating universal laws and theories that can be applied across different contexts.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: Indigenous Knowledge Management */}
            <div
              ref={(el) => {
                sectionRefs.current['ik-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Concept of Indigenous Knowledge Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Management (IKM) is a multidisciplinary field that focuses on the preservation, documentation, dissemination, and application of Indigenous Knowledge Systems (IKS). It recognizes the value of IKS as a vital resource for sustainable development, cultural preservation, and social justice.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                  <p>
                    IKM goes beyond simply documenting IKS; it involves actively engaging with indigenous communities to ensure that their knowledge is respected, protected, and used in a culturally appropriate manner. This includes developing culturally sensitive methods for documenting and storing IKS, establishing protocols for access and use, and promoting the integration of IKS into mainstream development initiatives. IKM also addresses issues related to intellectual property rights, ensuring that indigenous communities retain control over their knowledge and benefit from its use.
                  </p>
                  <p>
                    A key aspect of IKM is the empowerment of indigenous communities to manage their own knowledge. This involves building capacity within communities to document, preserve, and utilize their IKS, as well as advocating for their rights to self-determination. IKM also promotes collaboration between indigenous communities, researchers, and policymakers, fostering a respectful and equitable exchange of knowledge. By effectively managing IKS, communities can help to ensure that their knowledge is used to improve their lives, protect their cultural heritage, and contribute to a more sustainable future.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Challenges and Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges-solutions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges Associated with Indigenous Knowledge Systems (IKS) and Suggested Solutions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems (IKS) face numerous challenges that threaten their preservation and effective utilization. These challenges stem from a variety of factors, including historical marginalization, rapid modernization, and the complexities of knowledge transfer.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Loss of Knowledge Holders',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p>
                          One of the most pressing challenges is the loss of elders and traditional practitioners who hold valuable IKS. This is exacerbated by factors such as migration, limited transmission to younger generations, and the impact of modernization.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Implement programs to document and record IKS from elders, create intergenerational knowledge transfer initiatives, and integrate IKS into educational curricula.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '2. Lack of Documentation and Codification',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Much of IKS is transmitted orally, making it vulnerable to loss and misinterpretation. The absence of comprehensive documentation and codification hinders its accessibility and application.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Develop culturally sensitive methods for documenting IKS, utilizing audio-visual recordings, written texts, and digital databases. Establish community-based archives and knowledge centers.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '3. Intellectual Property Rights and Benefit Sharing',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          The exploitation of IKS by external actors without proper recognition or benefit sharing poses a significant challenge. This can lead to the misappropriation of knowledge and the erosion of indigenous control.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Establish clear legal frameworks for the protection of IKS, including provisions for prior informed consent, benefit sharing, and the recognition of customary law. Support indigenous communities in developing their own knowledge management systems.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '4. Impact of Modernization and Globalization',
                    icon: <Globe size={16} />,
                    content: (
                      <>
                        <p>
                          Rapid modernization and globalization can lead to the erosion of traditional practices and the displacement of IKS. This is particularly evident in areas such as agriculture, medicine, and natural resource management.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Promote the integration of IKS with modern technologies and practices, fostering a hybrid approach that respects traditional values while embracing innovation. Support community-based initiatives that promote sustainable development and cultural preservation.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '5. Language Barriers',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <>
                        <p>
                          Many IKS are embedded in indigenous languages, which are often endangered. Language barriers can hinder the transmission and accessibility of IKS, particularly to researchers and policymakers.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Support language revitalization programs and develop multilingual documentation and educational materials. Promote the use of indigenous languages in research and policy development.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '6. Lack of Recognition and Integration into Mainstream Systems',
                    icon: <Building size={16} />,
                    content: (
                      <>
                        <p>
                          IKS is often marginalized or dismissed by mainstream scientific and policy institutions. This lack of recognition hinders its integration into development initiatives and its contribution to addressing societal challenges.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Promote dialogue and collaboration between indigenous communities, researchers, and policymakers. Develop policies and programs that recognize the value of IKS and support its integration into mainstream systems.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '7. Environmental Change',
                    icon: <Sun size={16} />,
                    content: (
                      <>
                        <p>
                          Environmental change is altering the ecosystems that IKS is based on. This changes the validity of some of the knowledge.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Document how IKS is changing, and also document how the environment is changing. Work to combine western science, and IKS to help mitigate the effects of environmental change.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: '8. Intergenerational Transmission',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          With the increase of youths moving to urban areas, the intergenerational transmission of knowledge is being interrupted.
                        </p>
                        <p className="mt-2">
                          <strong>Solutions:</strong> Create programs that allow youths to learn from elders, and also create programs that allow elders to travel to urban areas to teach youths. Utilize modern electronic methods to help transmit knowledge.
                        </p>
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
                  <span>IKS Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Knowledge Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Challenges</span>
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
                Indigenous Knowledge Systems are holistic, dynamic, and deeply rooted in cultural and ecological contexts. They include local knowledge, traditional knowledge, TEK, and ethno-ecology. Distinguishing between indigenous, tacit, implicit, and explicit knowledge helps in understanding how knowledge is held and transferred. IKS face challenges such as loss of knowledge holders, lack of documentation, IPR issues, modernization, language barriers, and environmental change. Solutions include documentation, legal frameworks, community empowerment, and integration with modern systems.
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
                <strong className="text-white">IKS Concepts</strong> – Local knowledge, traditional knowledge, TEK, and ethno-ecology represent different facets of Indigenous Knowledge Systems, each with its own focus and scope.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Knowledge Types</strong> – Indigenous knowledge is collective and contextual; tacit knowledge is personal know-how; implicit knowledge is unconscious; explicit knowledge is codified and easily transferable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IK vs WSK</strong> – Indigenous knowledge is holistic, oral, and validated by community consensus; Western science is reductionist, written, and validated by peer review. Both have strengths and can complement each other.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IK Management</strong> – Involves preservation, documentation, and application of IKS, with a focus on community empowerment, cultural sensitivity, and benefit sharing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenges & Solutions</strong> – Loss of knowledge holders, lack of documentation, IPR issues, modernization, language barriers, environmental change, and interrupted transmission require collaborative, culturally appropriate solutions.
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
            Sidemann Academic Registry • Indigenous Knowledge Systems &amp; Traditional Wisdom 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;