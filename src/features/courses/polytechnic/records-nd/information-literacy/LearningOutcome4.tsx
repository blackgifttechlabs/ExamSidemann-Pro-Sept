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

  // ─── Icons specific to this LO4 content ────────────────────────────────
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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'evaluation', label: 'Information Evaluation' },
  { id: 'importance', label: 'Importance' },
  { id: 'criteria', label: 'Evaluation Criteria' },
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
        text: 'The CRAAP test (Currency, Relevance, Authority, Accuracy, Purpose) is a widely used framework for evaluating information sources.',
      },
      {
        title: 'Pro Tip',
        text: 'Always cross-check information from multiple sources, especially when the topic is controversial or rapidly changing.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five criteria for evaluating internet sources: Authority, Accuracy, Objectivity, Currency, and Coverage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse a source\'s popularity with credibility; a widely shared article may still be inaccurate or biased.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CRAAP test (Currency, Relevance, Authority, Accuracy, Purpose) is a widely used framework for evaluating information sources.',
      },
      {
        title: 'Pro Tip',
        text: 'Always cross-check information from multiple sources, especially when the topic is controversial or rapidly changing.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five criteria for evaluating internet sources: Authority, Accuracy, Objectivity, Currency, and Coverage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse a source\'s popularity with credibility; a widely shared article may still be inaccurate or biased.',
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
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Information Evaluation &amp; Source Credibility —{' '}
            <span className="text-amber-300 font-bold italic">
              Critical Assessment &amp; Reliability
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to information evaluation, core concepts, importance, criteria for internet sources, and critical analysis.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Target size={14} className="inline mr-1" /> Evaluation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Credibility
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Critical Analysis
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
            {/* SECTION 1: Information Evaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Evaluation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Information evaluation is the process of critically assessing the quality, reliability, and relevance of information sources. It's a key component of information literacy, enabling individuals to make informed decisions and judgments about the information they encounter. Here's a more detailed breakdown:
                  </p>
</div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Core Concepts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Critical Analysis',
                    icon: <Brain size={16} />,
                    content:
                      'Information evaluation goes beyond simply accepting information at face value. It involves analyzing the information from a critical perspective, questioning its origins, purpose, and potential biases.',
                  },
                  {
                    title: 'Source Credibility',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'A significant aspect of information evaluation is assessing the credibility of the source. This includes considering the author\'s expertise, the organization\'s reputation, and the presence of any potential conflicts of interest.',
                  },
                  {
                    title: 'Relevance and Purpose',
                    icon: <Target size={16} />,
                    content:
                      'Information evaluation also involves determining the relevance of the information to a specific need or purpose. This includes considering whether the information is appropriate for the intended audience and whether it addresses the research question or problem at hand.',
                  },
                  {
                    title: 'Accuracy and Reliability',
                    icon: <CheckCircle size={16} />,
                    content:
                      'Assessing the accuracy and reliability of information is crucial. This involves verifying information from multiple sources, checking for factual errors, and evaluating the evidence presented.',
                  },
                  {
                    title: 'Bias and Perspective',
                    icon: <ScaleIcon size={16} />,
                    content:
                      'Recognizing potential biases and perspectives is essential for a balanced evaluation of information. This includes considering the author\'s point of view, the source\'s potential biases, and the presence of any alternative perspectives.',
                  },
                  {
                    title: 'Timeliness',
                    icon: <ClockIcon size={16} />,
                    content:
                      'Depending on the information needed, the timeliness of the information could be very important. Therefore, the age of the information, and if it is still relevant, is a part of information evaluation.',
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

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-4">Why Information Evaluation Matters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Combating Misinformation',
                    icon: <AlertCircle size={16} />,
                    content:
                      'In the digital age, misinformation and disinformation are prevalent. Information evaluation skills are essential for distinguishing between credible and unreliable sources.',
                  },
                  {
                    title: 'Making Informed Decisions',
                    icon: <Target size={16} />,
                    content:
                      'Whether it\'s making personal decisions or professional judgments, information evaluation enables individuals to make informed choices based on reliable information.',
                  },
                  {
                    title: 'Academic Integrity',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'In academic settings, information evaluation is crucial for ensuring the accuracy and credibility of research.',
                  },
                  {
                    title: 'Media Literacy',
                    icon: <Eye size={16} />,
                    content:
                      'Information evaluation is a core component of media literacy, enabling individuals to critically analyze and interpret media messages.',
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

            {/* SECTION 2: Justifying the Importance */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Justifying the Importance of Evaluating Information Sources: Navigating the Complexities of the Information Age
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In the contemporary information landscape, the proliferation of misinformation and disinformation poses a significant threat to individual and societal well-being. The ease with which false or misleading information can be created and disseminated necessitates a critical approach to information consumption.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Combating Misinformation and Disinformation',
                    icon: <AlertCircle size={16} />,
                    content:
                      'In the contemporary information landscape, the proliferation of misinformation and disinformation poses a significant threat to individual and societal well-being. The ease with which false or misleading information can be created and disseminated necessitates a critical approach to information consumption. Evaluating information sources is paramount in distinguishing between credible and unreliable content, ensuring that individuals base their decisions and beliefs on accurate and trustworthy information. This is particularly crucial in areas such as health, politics, and science, where misinformation can have severe consequences. By developing and applying critical evaluation skills, individuals can protect themselves from manipulation and contribute to a more informed and truthful society.',
                  },
                  {
                    title: '2. Ensuring Academic Integrity and Scholarly Rigor',
                    icon: <BookOpen size={16} />,
                    content:
                      'Within academic and scholarly contexts, the evaluation of information sources is indispensable for maintaining academic integrity and upholding the rigor of research. Scholars and researchers rely on credible and authoritative sources to support their arguments and contribute to the body of knowledge. A failure to evaluate sources critically can result in the propagation of errors, the weakening of arguments, and the erosion of scholarly standards. By rigorously evaluating the quality and reliability of sources, academics ensure that their work is built on a solid foundation of evidence and contributes meaningfully to the advancement of knowledge. This practice also fosters a culture of intellectual honesty and accountability, reinforcing the principles of academic inquiry.',
                  },
                  {
                    title: '3. Making Informed Decisions in Personal and Professional Life',
                    icon: <User size={16} />,
                    content:
                      'In both personal and professional spheres, the evaluation of information sources is crucial for making informed decisions and enhancing effectiveness. In personal life, individuals are constantly confronted with choices related to health, finance, and lifestyle, all of which are influenced by information from various sources. Evaluating this information helps individuals avoid scams, make sound financial decisions, and adopt healthy practices. In the professional world, the ability to evaluate information quickly and accurately is essential for problem-solving, strategic planning, and innovation. Professionals who can discern reliable information from misinformation are better equipped to lead their organizations and make contributions to their fields.',
                  },
                  {
                    title: '4. Developing Media Literacy and Critical Thinking',
                    icon: <Brain size={16} />,
                    content:
                      'Evaluating information sources is a fundamental aspect of media literacy and critical thinking. In an age of digital media and information overload, individuals must be able to critically analyze and interpret media messages. This involves not only identifying credible sources but also understanding the techniques and strategies used to convey information and influence audiences. By developing media literacy skills, individuals become more discerning consumers of media, less susceptible to manipulation, and more capable of engaging in informed civic discourse. This is essential for a functioning democracy, where citizens rely on accurate information to participate in public life.',
                  },
                  {
                    title: '5. Protecting Personal Well-being and Safety',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'The evaluation of information sources is also essential for protecting personal well-being and safety. In areas such as health, nutrition, and personal finance, misinformation can have serious consequences. For example, false health claims can lead to dangerous self-treatment or the rejection of effective medical advice. Similarly, financial scams can result in significant economic losses. By critically evaluating health and financial information, individuals can protect themselves from harm and make decisions that promote their well-being. This is particularly important in the digital age, where misinformation is often presented in a convincing and professional manner.',
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

            {/* SECTION 3: Criteria Used in Evaluating Internet Sources */}
            <div
              ref={(el) => {
                sectionRefs.current['criteria'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Criteria Used in Evaluating Internet Sources: Navigating the Digital Information Landscape
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In the vast and often unregulated realm of the internet, establishing the authority and credibility of a source is paramount. The following criteria are essential for evaluating internet sources:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Authority and Credibility',
                    icon: <UserCheck size={16} />,
                    content:
                      'In the vast and often unregulated realm of the internet, establishing the authority and credibility of a source is paramount. This involves assessing the expertise and qualifications of the author or organization responsible for the content. Key questions to ask include: Who is the author? What are their credentials and affiliations? Does the organization have a reputation for reliability? Is there contact information provided? Evaluating authority helps to ensure that the information comes from a knowledgeable and trustworthy source, which is essential for the validity of the information presented.',
                  },
                  {
                    title: '2. Accuracy and Verifiability',
                    icon: <CheckCircle size={16} />,
                    content:
                      'Accuracy is a fundamental criterion for evaluating internet sources. This involves assessing the factual correctness of the information presented, checking for errors, and verifying claims with multiple sources. Key questions to ask include: Are the facts supported by evidence? Are sources cited? Can the information be verified through other reliable sources? Accurate information is reliable and free from errors, which is critical for building trust and credibility. Inaccurate information can lead to misinformation and have serious consequences.',
                  },
                  {
                    title: '3. Objectivity and Bias',
                    icon: <ScaleIcon size={16} />,
                    content:
                      'Objectivity and bias are critical considerations when evaluating internet sources. Every source has a perspective or agenda, and it\'s essential to recognize potential biases that may influence the information presented. Key questions to ask include: What is the purpose of the source? Is it to inform, persuade, or sell? Does the source present a balanced view? Does it acknowledge alternative perspectives? Objective sources strive to present information fairly and without bias. Recognizing bias helps to avoid being misled by one-sided or manipulative content.',
                  },
                  {
                    title: '4. Currency and Timeliness',
                    icon: <ClockIcon size={16} />,
                    content:
                      'Currency and timeliness are crucial factors when evaluating internet sources, particularly in fields where information changes rapidly. This involves assessing the publication date and whether the information has been updated. Key questions to ask include: When was the information published? Is it current and relevant? Has it been updated recently? Using current information ensures that you are relying on the most up-to-date knowledge, which is particularly important in areas like technology, health, and current events.',
                  },
                  {
                    title: '5. Coverage and Scope',
                    icon: <Eye size={16} />,
                    content:
                      'Coverage and scope refer to the breadth and depth of information presented by an internet source. This involves assessing whether the information is comprehensive and addresses the topic adequately. Key questions to ask include: Does the source cover the topic in sufficient detail? Does it address all relevant aspects? Does it provide references to more in-depth information? A source with good coverage provides a thorough and balanced overview of the topic, allowing users to make well-informed decisions.',
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
                  💡 Evaluation Insight
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
                  <span>Core Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Importance Justifications</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Evaluation Criteria</span>
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
                Information evaluation is critical for combating misinformation and ensuring accuracy. Key concepts include critical analysis, source credibility, relevance, accuracy, bias, and timeliness. Justifications for evaluation include combating misinformation, ensuring academic integrity, informed decision-making, media literacy, and protecting well-being. When evaluating internet sources, use criteria: Authority, Accuracy, Objectivity, Currency, and Coverage (the CRAAP test). Always cross-check information and consider multiple perspectives.
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
                <strong className="text-white">Information Evaluation</strong> – A critical process for assessing quality, reliability, and relevance of information, encompassing critical analysis, source credibility, and bias recognition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Importance</strong> – Essential for combating misinformation, ensuring academic integrity, making informed decisions, developing media literacy, and protecting personal well-being.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evaluation Criteria</strong> – Use the CRAAP test: Currency, Relevance, Authority, Accuracy, and Purpose (or Coverage). Always verify information from multiple credible sources.
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
            Sidemann Academic Registry • Information Evaluation &amp; Source Credibility 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;