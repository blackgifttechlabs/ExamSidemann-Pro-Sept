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

  // ─── Icons specific to this LO5 content ────────────────────────────────
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
  TreePalm as Tree,
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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'justification', label: 'Justification' },
  { id: 'ipr-problems', label: 'IPR Problems' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'ethical-issues', label: 'Ethical Issues' },
  { id: 'bio-piracy', label: 'Bio‑piracy' },
  { id: 'legal-initiatives', label: 'Legal Initiatives' },
  { id: 'trends', label: 'Current Trends' },
  { id: 'preservation', label: 'Preservation' },
  { id: 'ict-tools', label: 'ICT Tools' },
  { id: 'ownership', label: 'Ownership' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'The Convention on Biological Diversity (1992) is one of the first international treaties to recognise the rights of indigenous communities over their traditional knowledge and biological resources.',
      },
      {
        title: 'Pro Tip',
        text: 'When working with Indigenous Knowledge, always prioritise Free, Prior, and Informed Consent (FPIC) to ensure ethical and respectful engagement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of IK protection: Legal recognition, Benefit-sharing, and Community control.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that documenting IK automatically protects it; in reality, legal frameworks and community protocols are equally important to prevent misappropriation.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Convention on Biological Diversity (1992) is one of the first international treaties to recognise the rights of indigenous communities over their traditional knowledge and biological resources.',
      },
      {
        title: 'Pro Tip',
        text: 'When working with Indigenous Knowledge, always prioritise Free, Prior, and Informed Consent (FPIC) to ensure ethical and respectful engagement.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of IK protection: Legal recognition, Benefit-sharing, and Community control.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume that documenting IK automatically protects it; in reality, legal frameworks and community protocols are equally important to prevent misappropriation.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> INDIGENOUS KNOWLEDGE SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Protecting Indigenous Knowledge &amp; Intellectual Property —{' '}
            <span className="text-rose-300 font-bold italic">
              Rights, Bio‑piracy &amp; Legal Frameworks
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to justification for protection, IPR problems, bio‑piracy, ethical issues, legal initiatives, ICT tools, and ownership.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Protection
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> IPR
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertCircle size={14} className="inline mr-1" /> Bio‑piracy
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
            {/* SECTION 1: Justification for the Protection */}
            <div
              ref={(el) => {
                sectionRefs.current['justification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Justification for the Protection of Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous knowledge is a valuable resource that contributes to culture, heritage, and sustainable development. However, it faces risks such as exploitation, misrepresentation, and loss due to modernization. Protecting indigenous knowledge ensures that communities retain control over their traditions and benefit from their wisdom. Below are key reasons why indigenous knowledge needs protection.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preservation of Cultural Identity',
                    icon: <Heart size={16} />,
                    content:
                      'Indigenous knowledge is deeply connected to the cultural identity of communities. It includes traditions, languages, rituals, and customs that define a people\'s way of life. Without protection, this knowledge may disappear due to globalization, urbanization, and modernization. Safeguarding it helps future generations maintain their cultural roots and understand their history.',
                  },
                  {
                    title: '2. Prevention of Exploitation and Misuse',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'Many corporations and researchers have taken indigenous knowledge, such as traditional medicine and farming techniques, for profit without compensating the original communities. This is known as biopiracy. Protecting indigenous knowledge through legal frameworks ensures that communities have control over their intellectual property and receive fair benefits when their knowledge is used commercially.',
                  },
                  {
                    title: '3. Environmental and Sustainable Development Benefits',
                    icon: <Leaf size={16} />,
                    content:
                      'Indigenous knowledge contains valuable information about environmental conservation, sustainable agriculture, and natural resource management. Many traditional farming and fishing methods promote biodiversity and reduce environmental degradation. By protecting and promoting this knowledge, societies can develop sustainable practices that benefit both people and the planet.',
                  },
                  {
                    title: '4. Promotion of Indigenous Rights and Autonomy',
                    icon: <Users size={16} />,
                    content:
                      'Indigenous communities have the right to control and manage their knowledge according to their customs and traditions. Protecting indigenous knowledge supports their autonomy and prevents external forces from imposing changes that may harm their way of life. Legal protection ensures that indigenous people have the power to decide how their knowledge is shared and used.',
                  },
                  {
                    title: '5. Encouraging Innovation and Economic Growth',
                    icon: <TrendingUp size={16} />,
                    content:
                      'Indigenous knowledge contributes to innovation in fields like medicine, food production, and natural resource management. Many modern medicines and agricultural techniques have roots in traditional practices. When indigenous communities have rights over their knowledge, they can develop businesses, create jobs, and contribute to economic growth while maintaining their cultural values.',
                  },
                  {
                    title: '6. Protection from Extinction Due to Modernization',
                    icon: <AlertTriangle size={16} />,
                    content:
                      'With the rapid spread of modern technology and lifestyles, many indigenous practices and languages are at risk of disappearing. If not protected, valuable knowledge about traditional medicine, crafts, and governance may be lost forever. Recording and legally safeguarding this knowledge ensures that it remains accessible for future generations.',
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

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Indigenous knowledge is a crucial part of human heritage that must be protected to preserve cultural identity, prevent exploitation, support sustainable development, and promote indigenous rights. Governments, international organizations, and local communities should work together to establish legal protections and ensure that indigenous knowledge remains a valuable resource for present and future generations.
                </p>
              </div>
            </div>

            {/* SECTION 2: IK and Intellectual Property Rights */}
            <div
              ref={(el) => {
                sectionRefs.current['ipr-problems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Indigenous Knowledge and Intellectual Property Rights: Problems Related to IK and IPR
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge (IK) and Intellectual Property Rights (IPR) face several challenges that make it difficult to protect and manage traditional knowledge effectively. Many indigenous communities struggle to safeguard their knowledge from exploitation, misappropriation, and loss due to legal and economic barriers. Below are five key problems related to IK and IPR.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Lack of Legal Protection:</strong> Indigenous knowledge is often passed down orally through generations, making it difficult to fit into modern intellectual property laws, which require written documentation or formal patents. Many legal systems do not recognize traditional knowledge as intellectual property, leaving it vulnerable to theft and misuse by outsiders. Without strong legal frameworks, corporations and researchers can exploit indigenous knowledge without giving credit or compensation to the original communities.</li>
                  <li><strong>Biopiracy and Commercial Exploitation:</strong> Many companies and researchers use indigenous knowledge, particularly in traditional medicine and agriculture, for commercial gain without consulting or compensating the indigenous communities. This is known as biopiracy. For example, pharmaceutical companies have patented traditional herbal remedies without recognizing or rewarding the indigenous groups that have used them for centuries. This exploitation denies indigenous communities the benefits of their own knowledge.</li>
                  <li><strong>Difficulty in Defining Ownership:</strong> Unlike modern intellectual property, which often belongs to an individual or company, indigenous knowledge is collectively owned by entire communities. This makes it challenging to establish who has the right to grant permission for its use or benefit from its commercialization. Different community members may have different perspectives on how knowledge should be shared, leading to internal disputes and difficulties in legal recognition.</li>
                  <li><strong>Loss of Indigenous Knowledge Due to Globalization:</strong> As modernization and globalization spread, many indigenous practices, languages, and traditions are disappearing. Younger generations may prefer modern education and technology over traditional knowledge, leading to its decline. Without proper protection and transmission, valuable indigenous knowledge related to medicine, environmental management, and craftsmanship may be lost forever.</li>
                  <li><strong>Misrepresentation and Cultural Appropriation:</strong> When indigenous knowledge is used by outsiders without understanding its cultural significance, it is often misrepresented or culturally appropriated. For example, traditional symbols, music, and clothing designs have been copied and used for profit in fashion and entertainment industries without respecting their original meaning. This not only disrespects indigenous cultures but also reduces the value and authenticity of their traditions.</li>
                </ol>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The relationship between Indigenous Knowledge and Intellectual Property Rights is complex due to legal, ethical, and economic challenges. To address these problems, governments and international organizations must work with indigenous communities to create legal protections that recognize collective ownership, prevent exploitation, and ensure that indigenous people benefit from their knowledge. Respecting and protecting indigenous knowledge is essential for preserving cultural heritage and promoting fair development.
                </p>
              </div>
            </div>

            {/* SECTION 3: Possible Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['solutions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Possible Solutions to the Problems Related to Indigenous Knowledge (IK) and Intellectual Property Rights (IPRs)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous knowledge faces many challenges related to protection, ownership, and fair use. To address these issues, governments, organizations, and communities must work together to create solutions that respect indigenous rights while allowing knowledge to contribute to development. Below are some possible solutions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Development of Strong Legal Frameworks:</strong> Governments should create and enforce laws that recognize and protect indigenous knowledge. These laws should ensure that indigenous communities have legal rights over their knowledge and prevent outsiders from using it without permission. International organizations, such as the World Intellectual Property Organization (WIPO), can also help develop global policies to safeguard traditional knowledge.</li>
                  <li><strong>Granting Collective Ownership Rights:</strong> Since indigenous knowledge is often owned by entire communities rather than individuals, legal systems should allow for collective ownership. Special intellectual property laws should be created to recognize and protect knowledge passed down through generations. This will ensure that no single person or company can claim exclusive rights over indigenous knowledge.</li>
                  <li><strong>Benefit-Sharing Agreements:</strong> When companies or researchers use indigenous knowledge, there should be agreements ensuring that indigenous communities receive fair compensation. This can be done through Access and Benefit-Sharing (ABS) agreements, which require companies to share profits with the original knowledge holders. This ensures that indigenous people benefit financially and socially from their contributions.</li>
                  <li><strong>Documentation and Digital Preservation:</strong> To prevent the loss of indigenous knowledge due to modernization, communities should document their traditions, practices, and skills in written, audio, and video formats. Digital archives and databases can help store this knowledge while keeping it under community control. Governments and cultural organizations should support these efforts by funding and providing technological resources.</li>
                  <li><strong>Community Awareness and Education:</strong> Indigenous communities must be educated about their intellectual property rights so that they can protect their knowledge effectively. Workshops, training programs, and legal support can help them understand how to safeguard their traditions from exploitation. Schools should also integrate indigenous knowledge into education systems to keep it alive for future generations.</li>
                </ol>
              </div>
            </div>

            {/* SECTION 4: Problematic Ethical Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['ethical-issues'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Problematic Ethical Issues Related to Indigenous Knowledge (IKs)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The use and protection of indigenous knowledge raise several ethical concerns. These issues must be carefully addressed to ensure that indigenous communities are treated with respect and fairness. Below are some of the key ethical challenges.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Exploitation and Lack of Consent:</strong> Many companies and researchers use indigenous knowledge without asking for permission from the communities that own it. This is unethical because it takes away the rights of indigenous people and benefits outsiders without giving anything in return. Ethical practices require obtaining free, prior, and informed consent (FPIC) before using any indigenous knowledge.</li>
                  <li><strong>Misrepresentation and Cultural Distortion:</strong> Sometimes, indigenous knowledge is taken out of context and used in ways that misrepresent its true meaning. For example, traditional symbols, music, or healing practices may be commercialized in ways that disrespect their cultural significance. Ethical research and documentation should ensure that indigenous knowledge is accurately represented and not misused.</li>
                  <li><strong>Unequal Power Relations:</strong> In many cases, indigenous communities have limited power in negotiations with large companies or research institutions. This creates an imbalance where outsiders benefit from indigenous knowledge while the local people remain disadvantaged. Ethical policies should promote fairness, ensuring that indigenous communities have full control over their knowledge and receive proper benefits.</li>
                  <li><strong>Loss of Sacred and Secret Knowledge:</strong> Some indigenous knowledge, especially spiritual or ritual practices, is meant to remain within the community and should not be shared with outsiders. However, researchers and businesses sometimes document and publicize this knowledge without respecting its sacred nature. Ethical guidelines should protect secret and sacred knowledge from being exposed without community approval.</li>
                  <li><strong>Displacement and Destruction of Indigenous Ways of Life:</strong> Modern development projects, such as large-scale agriculture and urban expansion, sometimes destroy indigenous lands and disrupt traditional ways of life. This leads to the loss of valuable indigenous knowledge, as communities are forced to abandon their traditional practices. Ethical policies should protect indigenous lands and support sustainable development that respects local traditions.</li>
                </ol>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Protecting indigenous knowledge requires strong legal frameworks, fair benefit-sharing, proper documentation, and community awareness. At the same time, ethical concerns such as exploitation, misrepresentation, and power imbalances must be addressed to ensure that indigenous people retain control over their knowledge. By combining legal protections with ethical considerations, societies can preserve and respect indigenous knowledge while allowing it to contribute to national and global development.
                </p>
              </div>
            </div>

            {/* SECTION 5: Bio-Piracy */}
            <div
              ref={(el) => {
                sectionRefs.current['bio-piracy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Bio-Piracy: Policy and Law
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Bio-piracy refers to the unethical or illegal appropriation of indigenous knowledge and biological resources by corporations, researchers, or governments without proper permission or compensation to the original knowledge holders. This often occurs when pharmaceutical, agricultural, and biotechnology companies use traditional knowledge about medicinal plants, seeds, or other natural resources to develop commercial products without sharing the benefits with indigenous communities.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. The Convention on Biological Diversity (CBD) – 1992',
                    icon: <Globe size={16} />,
                    content:
                      'The CBD is an international treaty aimed at conserving biodiversity, ensuring sustainable use of biological resources, and promoting fair benefit-sharing. It recognizes the rights of indigenous communities over their traditional knowledge and genetic resources. The treaty encourages countries to establish national laws that require consent and benefit-sharing when companies or researchers use indigenous knowledge or resources.',
                  },
                  {
                    title: '2. The Nagoya Protocol – 2010',
                    icon: <FileTextIcon size={16} />,
                    content:
                      'The Nagoya Protocol is an agreement under the CBD that specifically focuses on Access and Benefit-Sharing (ABS). It requires that any company or researcher who wants to use genetic resources or indigenous knowledge must first obtain permission from the relevant community and agree to share the benefits. This ensures that indigenous people receive fair compensation when their knowledge is used commercially.',
                  },
                  {
                    title: '3. National Intellectual Property Laws',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'Many countries have developed intellectual property (IP) laws to protect indigenous knowledge. Some governments have introduced patents, trademarks, and geographical indications to ensure that traditional knowledge remains under local control. However, these laws often need further development to fully protect indigenous communities from bio-piracy.',
                  },
                  {
                    title: '4. Traditional Knowledge Digital Libraries (TKDLs)',
                    icon: <Database size={16} />,
                    content:
                      'Some countries, like India, have created Traditional Knowledge Digital Libraries (TKDLs) to document and protect indigenous knowledge. These databases prevent companies from claiming patents on traditional remedies by proving that such knowledge already exists. TKDLs help ensure that traditional knowledge remains in the public domain and cannot be exploited unfairly.',
                  },
                  {
                    title: '5. Local and Community-Based Protection Measures',
                    icon: <Users size={16} />,
                    content:
                      'Many indigenous communities have developed their own policies and agreements to protect their knowledge. These may include community protocols, customary laws, and local knowledge registers that help record and safeguard traditional practices. Governments and international organizations should support these community-led initiatives to strengthen protection against bio-piracy.',
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

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Bio-piracy remains a serious threat to indigenous communities and biodiversity. However, international agreements like the CBD and Nagoya Protocol, along with national IP laws and community-led protection measures, provide important frameworks for preventing exploitation. Strengthening these policies and ensuring fair benefit-sharing will help protect indigenous knowledge and promote ethical use of natural resources.
                </p>
              </div>
            </div>

            {/* SECTION 6: Initiatives Towards Legal Protection */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-initiatives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Initiatives Towards Legal Protection of Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous knowledge (IK) is crucial for cultural identity, environmental sustainability, and innovation in medicine, agriculture, and technology. However, it faces threats from bio-piracy, cultural appropriation, and loss due to globalization. To address these challenges, various initiatives have been developed at the international level to legally protect indigenous knowledge and ensure ethical practices.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. The Convention on Biological Diversity (CBD) – 1992',
                    icon: <Globe size={16} />,
                    content:
                      'The CBD is a major international treaty that recognizes the rights of indigenous communities over their traditional knowledge and biological resources. It promotes fair benefit-sharing, requiring companies and researchers to seek permission and provide compensation when using indigenous resources and knowledge.',
                  },
                  {
                    title: '2. The Nagoya Protocol – 2010',
                    icon: <FileTextIcon size={16} />,
                    content:
                      'This agreement strengthens the CBD by focusing on Access and Benefit-Sharing (ABS). It ensures that indigenous communities are fairly compensated when their knowledge is used in commercial products, such as medicines or cosmetics. The protocol promotes legal agreements between companies and indigenous groups to prevent exploitation.',
                  },
                  {
                    title: '3. The World Intellectual Property Organization (WIPO) – Traditional Knowledge Division',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'WIPO works to develop international policies that protect traditional knowledge under intellectual property (IP) laws. It aims to create a legal framework for patents, trademarks, and copyrights that recognize indigenous ownership of knowledge. However, many countries are still in the process of adopting these protections.',
                  },
                  {
                    title: '4. United Nations Declaration on the Rights of Indigenous Peoples (UNDRIP) – 2007',
                    icon: <Users size={16} />,
                    content:
                      'This declaration establishes the rights of indigenous peoples to control, protect, and develop their cultural heritage, traditional knowledge, and intellectual property. It emphasizes free, prior, and informed consent (FPIC) before outsiders use indigenous knowledge or resources.',
                  },
                  {
                    title: '5. Traditional Knowledge Digital Libraries (TKDLs)',
                    icon: <Database size={16} />,
                    content:
                      'Countries like India, Brazil, and Peru have created digital databases to document indigenous knowledge and prevent unauthorized patents. These libraries serve as proof that traditional remedies and practices exist, blocking companies from claiming ownership through patents.',
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Ethical Issues in Protecting Indigenous Knowledge</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Lack of Free, Prior, and Informed Consent (FPIC):</strong> Many indigenous communities are unaware of their intellectual property rights. In some cases, researchers and corporations use indigenous knowledge without consulting or compensating the knowledge holders. Ethical standards require obtaining FPIC before using or commercializing indigenous knowledge.</li>
                  <li><strong>Misrepresentation and Cultural Appropriation:</strong> Indigenous symbols, designs, and practices are often misused by companies and individuals for profit without respecting their cultural significance. For example, traditional medicines, music, and art have been commercialized without acknowledging their true origins.</li>
                  <li><strong>Challenges in Ownership and Benefit-Sharing:</strong> Indigenous knowledge is usually collectively owned by communities, unlike Western intellectual property systems that focus on individual ownership. This makes it difficult to apply standard patent and copyright laws. Benefit-sharing agreements must ensure that entire communities—not just individuals—receive fair compensation.</li>
                  <li><strong>Difficulty in Defining Traditional Knowledge:</strong> Since indigenous knowledge is passed down orally and evolves over time, it is difficult to define and document in a way that meets legal standards. Many legal systems require written documentation, making it hard for oral traditions to be protected under intellectual property laws.</li>
                  <li><strong>Loss of Indigenous Knowledge Due to Modernization:</strong> As younger generations move away from traditional practices and adopt modern lifestyles, indigenous knowledge is at risk of disappearing. Efforts to protect it should focus on education, digital preservation, and community-led initiatives to keep traditional practices alive.</li>
                </ol>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  International initiatives such as the CBD, Nagoya Protocol, WIPO, and UNDRIP play a crucial role in protecting indigenous knowledge from exploitation. However, ethical challenges, including lack of consent, cultural appropriation, and difficulties in legal recognition, must be addressed. Strengthening legal frameworks, community participation, and ethical research practices is essential to ensuring the fair and respectful protection of indigenous knowledge.
                </p>
              </div>
            </div>

            {/* SECTION 7: Current Trends */}
            <div
              ref={(el) => {
                sectionRefs.current['trends'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Current Trends in Indigenous Knowledge Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge (IK) refers to the skills, traditions, and wisdom developed by indigenous communities over generations. It includes knowledge about farming, medicine, storytelling, arts, and environmental conservation. Today, managing IK is becoming more important as globalization, modernization, and climate change threaten its existence. Many organizations, governments, and communities are working to protect and preserve IK using new strategies. Below are some key trends in Indigenous Knowledge Management.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Digital Documentation and Databases:</strong> One of the biggest trends in IK management is the use of digital technology to record and store indigenous knowledge. Many governments and research institutions are creating digital libraries and databases to collect information on traditional medicine, farming techniques, and cultural practices. For example, the Traditional Knowledge Digital Library (TKDL) in India stores information about traditional healing methods to prevent foreign companies from patenting indigenous remedies. Digital documentation helps protect IK from being lost and makes it easier to share within indigenous communities.</li>
                  <li><strong>Legal Protection and Intellectual Property Rights:</strong> Many indigenous communities struggle to protect their knowledge from exploitation, especially by businesses that use their ideas without permission. To solve this, organizations like the World Intellectual Property Organization (WIPO) and the Convention on Biological Diversity (CBD) have introduced legal frameworks to protect IK. Countries are also developing patents, trademarks, and copyrights to ensure indigenous communities control and benefit from their knowledge. These legal protections help prevent biopiracy, where companies take traditional knowledge for profit without compensating indigenous people.</li>
                  <li><strong>Education and Inclusion in School Curriculums:</strong> Many schools and universities are now including indigenous knowledge in their lessons. Subjects such as traditional farming, indigenous medicine, and local history are being added to school curriculums. This helps young people learn about and appreciate their cultural heritage. Some universities even offer courses in Indigenous Knowledge Systems (IKS) to encourage research and innovation in traditional knowledge. By teaching IK in schools, it ensures that younger generations continue practicing and valuing their traditions.</li>
                  <li><strong>Community-Based Knowledge Management:</strong> Indigenous communities are playing a bigger role in managing their knowledge. Instead of relying on outside researchers, communities are developing knowledge-sharing programs where elders pass down wisdom to younger generations through storytelling, apprenticeships, and cultural events. This ensures that IK stays within the community and is preserved in a way that respects traditions. Some communities are also creating local knowledge centers where they record and store their own traditional practices.</li>
                  <li><strong>Use of Indigenous Knowledge in Climate Change Adaptation:</strong> Many scientists and governments are recognizing that indigenous knowledge can help solve environmental problems. Traditional farming techniques, water conservation methods, and forest management practices are being used to fight climate change and promote sustainability. For example, some indigenous groups in Africa and South America use agroforestry, which combines trees and crops to improve soil fertility and prevent droughts. Governments and environmental organizations are now working with indigenous communities to apply these sustainable practices on a larger scale.</li>
                </ol>
              </div>
            </div>

            {/* SECTION 8: Protection and Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['preservation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Protection and Preservation of Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Protecting and preserving indigenous knowledge is important because it represents the identity, history, and survival strategies of many communities. However, it is at risk due to globalization, cultural erosion, and the decline of traditional ways of life. Below are some key methods for protecting and preserving IK.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Recording and Documentation:</strong> One of the most effective ways to preserve IK is through recording and documentation. Governments, universities, and NGOs are working with indigenous communities to record traditional knowledge in books, videos, and audio recordings. Digital databases, like the UNESCO Indigenous Knowledge Program, collect and store information on traditional practices. These efforts ensure that knowledge is not lost when older generations pass away.</li>
                  <li><strong>Legal Recognition and Community Rights:</strong> Many countries are now creating laws to recognize and protect indigenous knowledge. Some legal frameworks include: Intellectual Property Laws – To ensure that indigenous people own their knowledge and benefit from it. Free, Prior, and Informed Consent (FPIC) – Requires companies and researchers to ask for permission before using IK. Access and Benefit-Sharing (ABS) Agreements – Ensure that if businesses use IK, they must share profits with the community. These legal protections help prevent biopiracy and ensure fair treatment of indigenous people.</li>
                  <li><strong>Intergenerational Knowledge Transfer:</strong> Preserving IK requires passing it down from elders to younger generations. This is done through storytelling, mentorship programs, and traditional ceremonies where older members of the community teach younger ones. Some indigenous groups have created cultural schools where children learn traditional medicine, music, and crafts directly from elders. This keeps knowledge alive and ensures it remains within the community.</li>
                  <li><strong>Cultural Revitalization Programs:</strong> Some organizations are working to revive lost traditions and languages through cultural festivals, indigenous language programs, and heritage projects. These initiatives encourage younger generations to reconnect with their roots and continue practicing traditional customs. Governments are also recognizing indigenous languages and supporting their use in media and education.</li>
                  <li><strong>Ethical Research and Collaboration:</strong> To protect IK from exploitation, researchers and businesses must follow ethical guidelines when studying indigenous knowledge. This includes respecting indigenous rights, obtaining consent, and ensuring that communities benefit from research findings. Many universities now require researchers to work directly with indigenous communities instead of taking knowledge without permission. Ethical collaboration ensures that IK is used in a way that benefits both indigenous groups and the broader society.</li>
                </ol>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Indigenous Knowledge Management is evolving with modern technology, legal frameworks, and community-led initiatives. Digital documentation, legal protection, education, and environmental applications are key trends shaping the future of IK. At the same time, efforts to preserve and protect IK focus on recording traditions, strengthening legal rights, and encouraging cultural revival. By combining traditional wisdom with modern strategies, societies can ensure that indigenous knowledge remains valuable for future generations.
                </p>
              </div>
            </div>

            {/* SECTION 9: ICT Tools for IK */}
            <div
              ref={(el) => {
                sectionRefs.current['ict-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                ICT Tools for Indigenous Knowledge (IK)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Information and Communication Technology (ICT) tools can be very helpful for keeping, sharing, and using Indigenous Knowledge (IK). These tools can help communities protect their knowledge and make it available to others, while still respecting their traditions.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Digital Databases and Archives:</strong> These are like online libraries for IK. They can store information like stories, songs, pictures, and videos. This makes it easy to keep the knowledge safe and organized. Communities can control who can see the information, so sacred knowledge can be protected. These databases can be made searchable, making it easy to find specific information.</li>
                  <li><strong>Audio and Video Recording Equipment:</strong> Because much IK is oral, meaning it is spoken, recording devices are very important. They can be used to capture stories, songs, and traditional ceremonies. This helps to preserve the knowledge for future generations. Good quality recordings are very important for archival purposes.</li>
                  <li><strong>Digital Cameras and Scanners:</strong> These tools can be used to capture images of traditional artifacts, plants, animals, and landscapes. Scanners can also be used to digitize old documents or drawings. This helps to create a visual record of IK. These tools can also be used to document the physical state of at risk IKS related items.</li>
                  <li><strong>Geographic Information Systems (GIS):</strong> GIS tools can be used to map traditional territories, sacred sites, and resource management areas. This helps to visualize the relationship between IK and the land. GIS can also be used to document changes in the environment, and how those changes are impacting IKS.</li>
                  <li><strong>Mobile Phones and Apps:</strong> Mobile phones can be used to record audio and video, take pictures, and access online information. Apps can be developed to share IK in local languages and to connect communities with each other. Mobile phones can be used to help document IKS in the field.</li>
                  <li><strong>Online Platforms and Websites:</strong> Websites and online platforms can be used to share IK with a wider audience. They can be used to create online exhibitions, educational resources, and community forums. These platforms can be used to help connect IKS holders with researchers.</li>
                  <li><strong>Social Media:</strong> Social media can be used to share IKS, and raise awareness of IKS related issues. However, care must be taken to ensure that sensitive IKS is not shared inappropriately.</li>
                  <li><strong>Translation Software:</strong> Translation software can be used to help translate IKS from indigenous languages, to other languages. This can help to make IKS more accessible.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  It's important to remember that ICT tools are just tools. They should be used in a way that respects the rights and traditions of indigenous communities. Communities should have control over how their knowledge is used and shared.
                </p>
              </div>
            </div>

            {/* SECTION 10: Ownership and Control */}
            <div
              ref={(el) => {
                sectionRefs.current['ownership'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Ownership and Control of Traditional Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional Knowledge (TK) is like a special inheritance passed down through generations within indigenous and local communities. It's not just information; it's a part of their culture, identity, and way of life. Therefore, the question of who owns and controls this knowledge is very important.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Community Ownership:</strong> TK is usually considered to be owned collectively by the community, not by individuals. This means that the community as a whole has the right to decide how their knowledge is used and shared. This is different from how we usually think about ownership in modern society, where individuals own things like books or inventions. This collective ownership reflects the fact that TK is often developed and maintained through shared experiences and practices over long periods of time.</li>
                  <li><strong>Right to Self-Determination:</strong> Indigenous and local communities have the right to decide their own future. This includes the right to control their own knowledge and how it is used. This is called "self-determination." This right is recognized in international laws and agreements, such as the United Nations Declaration on the Rights of Indigenous Peoples.</li>
                  <li><strong>Prior Informed Consent (PIC):</strong> Before anyone can use TK, they must get permission from the community that owns it. This permission must be given freely, without any pressure, and the community must understand how their knowledge will be used. This is called "prior informed consent." PIC ensures that communities have control over their knowledge and can decide if and how it is shared with others.</li>
                  <li><strong>Benefit Sharing:</strong> If TK is used for commercial purposes, like making medicines or selling products, the community that owns the knowledge should share in the benefits. This means they should get a fair share of the money or other advantages. Benefit sharing ensures that communities are not exploited and that they can benefit from their own knowledge.</li>
                  <li><strong>Protection from Misappropriation:</strong> TK must be protected from being taken or used without permission. This is called "misappropriation." This can happen when people from outside the community try to patent or sell TK as their own. Legal frameworks and community protocols are needed to protect TK from misappropriation.</li>
                  <li><strong>Cultural Protocols:</strong> Each community has its own rules and customs about how knowledge is shared. These are called "cultural protocols." It's important to respect these protocols and to follow them when working with TK. Cultural protocols ensure that knowledge is used in a way that is respectful and appropriate.</li>
                  <li><strong>Control Over Documentation:</strong> If TK is documented, like in a book or on a website, the community should have control over how that documentation is used and shared. Communities should decide who can access the documentation and what they can do with it.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  It's important to remember that TK is not just information; it's a part of a community's identity and culture. Respecting their ownership and control is essential for building trust and ensuring that TK is used in a way that benefits the community.
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
                  <span>Justification Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>IPR Problems</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Legal Initiatives</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Protecting IK preserves cultural identity, prevents exploitation, and supports sustainable development. IPR challenges include lack of legal protection, biopiracy, ownership complexities, and cultural appropriation. Solutions involve strong legal frameworks, collective rights, benefit-sharing, and documentation. Ethical issues demand FPIC, respect for sacred knowledge, and fair power relations. Bio‑piracy is addressed by CBD, Nagoya Protocol, and national laws. Current trends include digital documentation, legal protections, education, and community-led management. ICT tools and proper ownership protocols are essential for effective preservation.
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
                <strong className="text-white">Justification</strong> – Protecting IK preserves cultural identity, prevents exploitation, supports sustainable development, and empowers communities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IPR Problems</strong> – Lack of legal protection, biopiracy, collective ownership challenges, cultural appropriation, and loss due to globalization.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Solutions & Ethics</strong> – Strong legal frameworks, benefit-sharing, documentation, FPIC, and respect for sacred knowledge are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Legal Initiatives</strong> – CBD, Nagoya Protocol, WIPO, UNDRIP, and TKDLs provide international and national frameworks for protection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Management & Tools</strong> – Digital documentation, education, community-led efforts, and ICT tools (databases, GIS, mobile apps) are key; ownership remains with the community through cultural protocols and consent.
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
            Sidemann Academic Registry • Protecting Indigenous Knowledge &amp; Intellectual Property 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;