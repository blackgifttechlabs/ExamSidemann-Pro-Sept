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
 TreePalm as  Tree,
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
  Book,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'defining', label: 'Defining Referencing' },
  { id: 'roles', label: '5 Roles of Referencing' },
  { id: 'types', label: 'Types of Referencing' },
  { id: 'intext-footnotes', label: 'In-Text vs Footnotes' },
  { id: 'plagiarism-def', label: 'Defining Plagiarism' },
  { id: 'plagiarism-types', label: 'Types of Plagiarism' },
  { id: 'strategies', label: 'Avoiding Plagiarism' },
  { id: 'ethical-legal', label: 'Ethical & Legal Issues' },
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
        text: 'The APA (American Psychological Association) style was first developed in 1929 and is now in its 7th edition, widely used in social sciences.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a citation management tool like Zotero or Mendeley to keep track of your sources and generate accurate citations automatically.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Cs of academic integrity: Cite your sources, Credit the authors, and Check your work carefully.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students think paraphrasing means just changing a few words; actually, it requires fully restating the idea in your own words and sentence structure.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The APA (American Psychological Association) style was first developed in 1929 and is now in its 7th edition, widely used in social sciences.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a citation management tool like Zotero or Mendeley to keep track of your sources and generate accurate citations automatically.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Cs of academic integrity: Cite your sources, Credit the authors, and Check your work carefully.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students think paraphrasing means just changing a few words; actually, it requires fully restating the idea in your own words and sentence structure.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Referencing, Citations &amp; Information Ethics —{' '}
            <span className="text-rose-300 font-bold italic">
              Academic Integrity &amp; Responsible Use
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to referencing, citation styles, plagiarism, academic integrity, and ethical/legal issues in information use.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Referencing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Integrity
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Ethics
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
            {/* SECTION 1: Defining Referencing, Citations, and References */}
            <div
              ref={(el) => {
                sectionRefs.current['defining'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Defining Referencing, Citations, and References: Cornerstones of Academic Integrity
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Referencing, citations, and references are the foundational elements of academic integrity, ensuring that all sources of information are properly acknowledged and credited.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: '1. Referencing',
                    icon: <BookOpen size={16} />,
                    content:
                      'Referencing is the overarching process of acknowledging the sources of information used in academic or scholarly work. It encompasses the entire system of documenting and attributing ideas, data, and quotations to their original creators. Referencing is not merely a technical requirement; it is a fundamental ethical practice that demonstrates intellectual honesty and respect for the work of others. A robust referencing system ensures that readers can trace the origins of information, verify claims, and explore the research process. This process involves incorporating citations within the body of the work, and compiling a comprehensive list of references at the end. Effective referencing requires a consistent approach, adhering to established citation styles such as APA, MLA, Chicago, or others, which provide guidelines for formatting citations and references. Referencing is the mechanism that allows for the building of knowledge, by showing how a given piece of work is related to the existing scholarship on a topic. It is also the mechanism that allows for the avoidance of plagiarism.',
                  },
                  {
                    title: '2. Citations',
                    icon: <FileText size={16} />,
                    content:
                      'Citations are in-text acknowledgments that indicate where specific information or ideas have been taken from a source. They are concise notations that appear within the body of the work, typically including the author\'s name, publication year, and sometimes page numbers. Citations serve as signposts, directing readers to the full bibliographic information provided in the references list. They provide immediate context for the information presented, allowing readers to understand the source and its relevance. Citations are crucial for avoiding plagiarism and for demonstrating the credibility of the research. They also enable readers to easily locate the original sources and delve deeper into the topic. The specific format of citations varies depending on the citation style being used. For example, APA style uses parenthetical citations, while MLA style uses parenthetical citations or superscript numbers that correspond to footnotes or endnotes. The use of citations allows for the smooth flow of a document, while still acknowledging the sources that were used.',
                  },
                  {
                    title: '3. References',
                    icon: <ListChecks size={16} />,
                    content:
                      'The references list, also known as a bibliography or works cited, is a comprehensive list of all the sources cited within the body of the work. It appears at the end of the document and provides full bibliographic information for each source, including author names, publication titles, publication dates, and other relevant details. The references list serves as a complete record of the sources used in the research, allowing readers to easily locate and access those sources. It also demonstrates the breadth and depth of the research and contributes to the overall credibility of the work. The format of references varies depending on the citation style being used. Each citation style dictates the specific elements to include in a reference and the order in which they should appear. The references list is an essential component of academic and scholarly work, ensuring transparency and accountability in the use of information. It also provides a valuable resource for readers who wish to explore the topic further. The references page is what allows the reader to find and verify the data that was used in the document.',
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

            {/* SECTION 2: 5 Significant Roles of Referencing */}
            <div
              ref={(el) => {
                sectionRefs.current['roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                5 Significant Roles of Referencing in Academic and Professional Work
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Upholding Academic Integrity and Preventing Plagiarism',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'Referencing is the cornerstone of academic integrity, serving as the primary mechanism for preventing plagiarism. Plagiarism, the act of presenting someone else\'s work or ideas as your own, is a serious ethical violation in academic and professional settings. Proper referencing ensures that all sources of information are clearly acknowledged, giving credit to the original authors and avoiding any misrepresentation of authorship. By consistently citing sources, researchers demonstrate their commitment to intellectual honesty and respect for the work of others. This transparency builds trust within the academic community and reinforces the principles of ethical scholarship. Furthermore, referencing allows for the clear distinction between the author\'s original contributions and the ideas or information borrowed from other sources, which is vital for maintaining the authenticity and credibility of academic work. In professional settings, accurate referencing protects organizations from legal issues related to copyright infringement and demonstrates a commitment to ethical business practices.',
                  },
                  {
                    title: '2. Establishing Credibility and Authority',
                    icon: <AwardIcon size={16} />,
                    content:
                      'Referencing plays a crucial role in establishing the credibility and authority of a piece of work. By citing reputable and relevant sources, researchers demonstrate that their work is grounded in established knowledge and supported by evidence. A well-referenced document signals that the author has conducted thorough research and is familiar with the relevant literature in their field. The selection of sources can also reflect the author\'s expertise and understanding of the topic. Citing influential scholars, seminal works, and peer-reviewed publications enhances the perceived authority of the research. Moreover, referencing allows readers to trace the origins of information and verify the claims made by the author. This transparency builds trust and confidence in the research, making it more persuasive and impactful. In professional reports and presentations, referencing strengthens arguments and demonstrates that recommendations are based on sound evidence and expert opinion.',
                  },
                  {
                    title: '3. Facilitating Research and Knowledge Building',
                    icon: <BookOpen size={16} />,
                    content:
                      'Referencing is an essential tool for facilitating research and building upon existing knowledge. By providing clear and accurate citations, researchers enable others to easily access and explore the sources used in their work. This fosters collaboration and knowledge sharing within the academic community. References serve as a valuable resource for further research, allowing readers to delve deeper into the topic and explore related areas of inquiry. They also provide a historical context for the research, showing how it relates to previous work and contributes to the ongoing development of knowledge. Moreover, referencing helps researchers to identify gaps in the literature and to develop new research questions. By examining the sources cited in previous studies, researchers can identify areas where further investigation is needed. In professional contexts, referencing facilitates knowledge management and ensures that best practices and lessons learned are documented and shared.',
                  },
                  {
                    title: '4. Providing Context and Supporting Arguments',
                    icon: <Target size={16} />,
                    content:
                      'Referencing provides essential context for the information presented in a piece of work. By citing relevant sources, researchers can demonstrate how their work relates to existing theories, concepts, and findings. References help to support arguments and provide evidence for claims, making the research more persuasive and convincing. They also allow researchers to acknowledge the contributions of others and to build upon their work. Furthermore, referencing helps to clarify the scope and limitations of the research, showing what has been previously established and what remains to be explored. In professional reports and presentations, referencing provides context for recommendations and demonstrates that they are based on sound evidence and expert opinion. This includes using data from reliable sources, and showing the reader where that data came from.',
                  },
                  {
                    title: '5. Demonstrating Research Skills and Scholarly Practice',
                    icon: <User size={16} />,
                    content:
                      'Effective referencing demonstrates the researcher\'s proficiency in research skills and adherence to scholarly practice. The ability to locate, evaluate, and cite relevant sources is a fundamental skill for any researcher. Proper referencing requires attention to detail, accuracy, and consistency, reflecting the researcher\'s commitment to rigorous scholarship. By adhering to established citation styles and guidelines, researchers demonstrate their familiarity with academic conventions and their ability to communicate effectively with the scholarly community. Moreover, referencing allows researchers to showcase the breadth and depth of their research, highlighting their understanding of the relevant literature and their ability to synthesize information from diverse sources. In professional settings, referencing demonstrates attention to detail and a commitment to accuracy, which are highly valued by employers and clients.',
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

            {/* SECTION 3: Types of Referencing */}
            <div
              ref={(el) => {
                sectionRefs.current['types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Articulating Types of Referencing: Navigating the Landscape of Citation Styles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. In-Text Citation Systems',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p className="mb-2">In-text citation systems involve the placement of brief source acknowledgments directly within the body of a written work. These systems serve as signposts, guiding readers to the full bibliographic information provided in the references list at the end of the document. In-text citations are typically concise, including the author's last name, publication year, and sometimes page numbers. These systems provide immediate context for the information presented, allowing readers to understand the source and its relevance without interrupting the flow of the text. There are variations within in-text citation systems.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Parenthetical Referencing:</strong> This involves placing citations within parentheses at the end of a sentence or clause. For example, (Smith, 2023, p. 45). This is common in styles like APA and MLA.</li>
                          <li><strong>Narrative Referencing:</strong> This involves integrating the author's name into the sentence itself, with the publication year in parentheses. For example, Smith (2023) argues that... This style is also common in APA and MLA.</li>
                          <li><strong>Numbered Referencing:</strong> This involves assigning numbers to sources and placing those numbers within the text, often as superscript. These numbers correspond to full bibliographic entries in footnotes, endnotes, or a numbered references list. This is common in styles like Chicago (notes and bibliography) and Vancouver.</li>
                        </ul>
                        <p className="mt-2">In-text citation systems are valuable for their efficiency and clarity, allowing readers to quickly identify the sources of information without disrupting the reading experience.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Footnote and Endnote Systems',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p className="mb-2">Footnote and endnote systems involve placing citations at the bottom of the page (footnotes) or at the end of the document (endnotes). These systems are often used in conjunction with numbered in-text citations, where a superscript number in the text corresponds to a full bibliographic entry in the footnotes or endnotes. Footnotes and endnotes can also be used to provide supplementary information, such as explanations, elaborations, or cross-references, in addition to source citations. These systems are particularly common in disciplines that require detailed source documentation and in publications that prioritize detailed commentary. The Chicago (notes and bibliography) style is a prominent example of a style that utilizes footnotes or endnotes. Footnotes and endnotes offer a flexible approach to referencing, allowing authors to provide detailed source information and supplementary commentary without cluttering the main body of the text.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Author-Date Systems',
                    icon: <Calendar size={16} />,
                    content:
                      'Author-date systems, such as APA and MLA, emphasize the publication date of sources. These systems use parenthetical or narrative in-text citations that include the author\'s last name and publication year. This approach is particularly useful in disciplines where the timeliness of information is crucial, such as the sciences and social sciences. The author-date system allows readers to quickly assess the currency of the sources used in a work. It also facilitates the identification of trends and developments in a particular field by highlighting the chronology of publications. The references list in author-date systems is typically organized alphabetically by author\'s last name, providing a comprehensive overview of the sources cited.',
                  },
                  {
                    title: '4. Numeric Systems',
                    icon: <Hash size={16} />,
                    content:
                      'Numeric systems, such as Vancouver and IEEE, use sequential numbers to cite sources. These numbers are placed within the text, typically as superscript or within square brackets, and correspond to numbered entries in a references list at the end of the document. Numeric systems are commonly used in scientific and technical fields, where conciseness and clarity are essential. This approach minimizes the intrusion of citations into the text, allowing for a smooth reading experience. The references list in numeric systems is organized numerically, in the order in which the sources are cited in the text. Numeric systems are efficient for managing large numbers of citations and are particularly well-suited for disciplines that rely heavily on scientific and technical literature.',
                  },
                  {
                    title: '5. Alphabetical Systems',
                    icon: <ListChecks size={16} />,
                    content:
                      'Alphabetical systems, like the "References" page of APA, or "Works Cited" page of MLA, compile all used sources into an alphabetical list by the authors last name. This makes it easy for a reader to find the full citation of a source. This is used in conjunction with the in text citations.',
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

            {/* SECTION 4: In-Text Citations vs Footnotes/Endnotes */}
            <div
              ref={(el) => {
                sectionRefs.current['intext-footnotes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                In-Text Citations vs. Footnotes/Endnotes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'In-Text Citations',
                    icon: <FileText size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>These citations are embedded directly within the body of the text, typically using parentheses. Common in styles like APA and MLA.</li>
                        <li>They provide brief source information (author, year, page number) for immediate context.</li>
                        <li>They are designed for a smooth reading experience, minimizing interruptions.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Footnotes/Endnotes',
                    icon: <BookOpen size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>These citations are placed at the bottom of the page (footnotes) or at the end of the document (endnotes). Common in the Chicago (notes and bibliography) style.</li>
                        <li>They can provide full bibliographic information and supplementary commentary.</li>
                        <li>They allow for more detailed source documentation and explanatory notes.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Author-Date vs. Numeric Systems',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Author-Date Systems (e.g., APA, MLA):</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Emphasize the publication date of sources, using parenthetical or narrative in-text citations (author, year).</li>
                          <li>Common in the sciences and social sciences, where timeliness is crucial.</li>
                          <li>References are listed alphabetically by author's last name.</li>
                        </ul>
                        <p className="font-semibold mt-2">Numeric Systems (e.g., Vancouver, IEEE):</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Use sequential numbers to cite sources, placed within the text as superscript or in brackets.</li>
                          <li>Common in scientific and technical fields, prioritizing conciseness.</li>
                          <li>References are listed numerically, in the order they appear in the text.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Chicago Style\'s Dual Approach',
                    icon: <Book size={16} />,
                    content: (
                      <>
                        <p className="font-semibold">Chicago Style:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Notes and Bibliography:</strong> Uses footnotes or endnotes for citations, along with a comprehensive bibliography. Common in the humanities.</li>
                          <li><strong>Author-Date:</strong> Uses parenthetical in-text citations and a references list, similar to APA. Common in the social sciences.</li>
                        </ul>
                        <p className="mt-2">This duality allows for flexibility depending on the discipline and publication.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Key Differences Summarized',
                    icon: <ListChecks size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Placement:</strong> In-text citations are within the text; footnotes/endnotes are at the bottom of pages or the end of documents.</li>
                        <li><strong>Information Detail:</strong> Footnotes/endnotes can provide more detailed information than in-text citations.</li>
                        <li><strong>Emphasis:</strong> Author-date systems emphasize publication timing; numeric systems emphasize conciseness.</li>
                        <li><strong>Discipline Specificity:</strong> Certain styles are favored in particular academic fields.</li>
                      </ul>
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

            {/* SECTION 5: Defining Plagiarism */}
            <div
              ref={(el) => {
                sectionRefs.current['plagiarism-def'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Defining Plagiarism as Used in Academic Writing: A Breach of Intellectual Integrity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Theft of Intellectual Property',
                    icon: <AlertCircle size={16} />,
                    content:
                      'Plagiarism, within the context of academic writing, constitutes the act of presenting someone else\'s work, ideas, or words as your own, without proper attribution or acknowledgment. This includes, but is not limited to, copying text verbatim, paraphrasing without citation, and submitting work that has been generated by another individual or source. It is fundamentally a form of theft, as it involves the misappropriation of intellectual property. Academic writing is built on the principle of original thought and the honest presentation of research. When a student or scholar plagiarizes, they are essentially claiming ownership of ideas that are not their own, thereby undermining the integrity of the academic process. Plagiarism can take many forms, from blatant copying to more subtle forms of unattributed paraphrasing. Even unintentional plagiarism, such as failing to properly cite a source due to carelessness, is considered a serious offense. The core issue is the misrepresentation of authorship, which violates the ethical standards that govern academic discourse.',
                  },
                  {
                    title: '2. Undermining Academic Honesty and Trust',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'Plagiarism is not merely a technical error; it is a serious ethical violation that undermines academic honesty and trust. The academic community relies on the principle of intellectual integrity, where researchers and students are expected to acknowledge the contributions of others and to present their own work honestly. When plagiarism occurs, it erodes this trust and compromises the credibility of the academic institution. Plagiarism also creates an unfair advantage for those who engage in it, as they are essentially gaining credit for work that they did not produce. This undermines the principle of meritocracy, where academic achievement is based on individual effort and ability. Furthermore, plagiarism can have serious consequences for both the individual and the institution. Students who plagiarize may face disciplinary action, such as failing grades, suspension, or expulsion. Institutions whose reputation is tarnished by plagiarism scandals may lose credibility and funding. Therefore, upholding academic honesty and preventing plagiarism are essential for maintaining the integrity and credibility of the academic community.',
                  },
                  {
                    title: '3. Impeding Learning and Intellectual Growth',
                    icon: <Brain size={16} />,
                    content:
                      'Plagiarism impedes learning and intellectual growth by preventing students from engaging in the critical thinking and analysis required for academic success. When students rely on plagiarism, they are not developing their own understanding of the subject matter. They are simply regurgitating information without processing it or integrating it into their own knowledge base. This hinders their ability to think critically, to analyze information, and to develop their own ideas. Learning is an active process that requires students to engage with information, to question it, and to synthesize it into their own understanding. Plagiarism bypasses this process, preventing students from developing the essential skills that they need to succeed in their academic and professional lives. Moreover, plagiarism can lead to a lack of confidence in one\'s own abilities, as students may come to rely on others\' work rather than developing their own. The act of creating original work, even if it is challenging, is an essential part of the learning process. It fosters creativity, problem-solving skills, and the ability to communicate ideas effectively.',
                  },
                  {
                    title: '4. Legal and Ethical Implications Beyond Academia',
                    icon: <Briefcase size={16} />,
                    content:
                      'While plagiarism is most commonly associated with academic settings, its implications extend far beyond the classroom. In professional settings, plagiarism can have serious legal and ethical consequences. Copyright infringement, which is a form of plagiarism, can lead to lawsuits and financial penalties. Plagiarism can also damage an individual\'s or organization\'s reputation, leading to loss of credibility and trust. In fields such as journalism, law, and medicine, plagiarism can have particularly severe consequences, as it can lead to the dissemination of false or misleading information. Furthermore, plagiarism in professional settings can undermine the integrity of research and development, hindering innovation and progress. Therefore, it is essential to uphold ethical standards of authorship and to avoid plagiarism in all aspects of professional life. The principles of academic integrity, such as proper citation and attribution, are applicable to all forms of writing and communication.',
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

            {/* SECTION 6: Types of Plagiarism */}
            <div
              ref={(el) => {
                sectionRefs.current['plagiarism-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Examining the Different Types of Plagiarism: A Spectrum of Intellectual Dishonesty
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Verbatim Plagiarism (Direct Copying)',
                    icon: <Copy size={16} />,
                    content:
                      'Verbatim plagiarism, also known as direct copying, is the most blatant and easily recognizable form of plagiarism. It involves copying text word-for-word from a source without using quotation marks and providing proper citation. This type of plagiarism demonstrates a complete disregard for intellectual property and academic integrity. Whether it\'s a single sentence, a paragraph, or an entire page, presenting someone else\'s exact words as your own is a clear violation of ethical standards. The ease of copying and pasting in the digital age has made verbatim plagiarism more prevalent, but it also makes it easier to detect. Even if the source is cited at the end of the paper, the lack of quotation marks implies that the copied text is the author\'s own writing. This type of plagiarism is often considered the most severe, as it leaves no room for ambiguity or unintentional error.',
                  },
                  {
                    title: '2. Paraphrasing Plagiarism (Inadequate Restatement)',
                    icon: <FileText size={16} />,
                    content:
                      'Paraphrasing plagiarism occurs when someone restates another person\'s ideas or information in their own words but fails to provide proper citation. While paraphrasing itself is a legitimate academic practice, it becomes plagiarism when the source is not acknowledged. This form of plagiarism can be more subtle than verbatim copying, as it involves a degree of rewriting. However, if the paraphrased text closely resembles the original source in structure or language, it is still considered plagiarism. Even changing a few words or rearranging sentences is not sufficient to avoid plagiarism if the underlying ideas and information are not attributed. Proper paraphrasing requires a genuine effort to understand and synthesize the source material, and then to express it in your own unique voice. It also requires the use of citations to show where the original idea was found.',
                  },
                  {
                    title: '3. Mosaic Plagiarism (Patchwork Copying)',
                    icon: <LayersIcon size={16} />,
                    content:
                      'Mosaic plagiarism, also known as patchwork copying, involves weaving together phrases, sentences, or paragraphs from multiple sources without proper citation. It\'s like creating a patchwork quilt from stolen pieces of fabric. This type of plagiarism often involves changing a few words or phrases to disguise the copying, but the overall structure and content remain largely unchanged. Mosaic plagiarism can be particularly difficult to detect, as it involves piecing together fragments from various sources. However, it is still a clear violation of academic integrity, as it misrepresents the author\'s original contributions. This type of plagiarism shows a lack of effort to understand the sources, and a greater effort to hide the theft of the work.',
                  },
                  {
                    title: '4. Self-Plagiarism (Recycling Your Own Work)',
                    icon: <RefreshCw size={16} />,
                    content:
                      'Self-plagiarism occurs when someone submits their own previously submitted work, or parts of it, without proper citation or permission from the instructor. While it may seem counterintuitive, reusing your own work without acknowledgment is considered plagiarism because it misrepresents the originality of the current submission. This is especially relevant in academic settings where students are expected to produce original work for each assignment. Self-plagiarism can also occur in professional settings, such as when researchers republish their own findings without proper citation. This type of plagiarism can be particularly problematic when it involves submitting the same work to multiple publications or institutions.',
                  },
                  {
                    title: '5. Source-Based Plagiarism (False or Misleading Citations)',
                    icon: <AlertCircle size={16} />,
                    content:
                      'Source-based plagiarism involves providing inaccurate or misleading information about the sources used in a work. This can include fabricating sources, citing sources that do not exist, or misrepresenting the content of a source. While this type of plagiarism may not involve direct copying, it still undermines academic integrity by misrepresenting the research process. It also makes it impossible for readers to verify the claims made by the author. Source-based plagiarism can also involve using secondary sources without acknowledging the primary source, or selectively citing sources to support a particular argument while ignoring contradictory evidence. This type of plagiarism is a form of academic fraud, as it intentionally misleads readers about the origins and validity of the information presented.',
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

            {/* SECTION 7: Strategies for Avoiding Plagiarism */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies for Avoiding Plagiarism in Academic Writing: Fostering Intellectual Honesty
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Mastering Proper Citation Techniques',
                    icon: <BookOpen size={16} />,
                    content:
                      'The most fundamental strategy for avoiding plagiarism is to master proper citation techniques. This involves understanding and consistently applying the specific citation style required by your institution or publication, such as APA, MLA, Chicago, or others. Each style has its own rules for formatting in-text citations, footnotes, endnotes, and reference lists. Familiarize yourself with these guidelines and practice applying them correctly. Pay close attention to the details, such as punctuation, capitalization, and the order of information. Utilize citation management tools like Zotero, Mendeley, or EndNote to help you organize your sources and generate accurate citations. These tools can automate the process of creating bibliographies and in-text citations, reducing the risk of errors. However, it\'s essential to double-check the generated citations to ensure they adhere to the required style. Beyond the technical aspects, understanding the purpose of citation is crucial. It\'s not just about avoiding plagiarism; it\'s about giving credit to the original authors and allowing readers to trace the origins of your information. This understanding fosters a culture of intellectual honesty and respect for the work of others.',
                  },
                  {
                    title: '2. Developing Effective Paraphrasing and Summarizing Skills',
                    icon: <Edit size={16} />,
                    content:
                      'Paraphrasing and summarizing are essential skills for avoiding plagiarism. Paraphrasing involves restating someone else\'s ideas or information in your own words, while summarizing involves condensing a larger text into a shorter version. Both techniques require a deep understanding of the source material and the ability to express it in your own unique voice. When paraphrasing, avoid simply changing a few words or rearranging sentences. Instead, strive to rephrase the ideas using your own vocabulary and sentence structure. Ensure that your paraphrase accurately reflects the meaning of the original source and that you provide proper citation. Summarizing requires you to identify the main points of a text and condense them into a concise overview. Focus on capturing the essence of the source material without including unnecessary details. Remember that even when paraphrasing or summarizing, you must provide proper citation to acknowledge the original source of the ideas. Effective paraphrasing and summarizing demonstrate your ability to understand and synthesize information, which is a key component of academic writing.',
                  },
                  {
                    title: '3. Planning and Organizing Your Research',
                    icon: <Clipboard size={16} />,
                    content:
                      'Effective planning and organization are crucial for avoiding plagiarism. Begin your research early and develop a systematic approach to collecting and managing your sources. Create a detailed outline of your paper and identify the specific information you need to support your arguments. As you gather information, keep meticulous records of your sources, including author names, publication titles, dates, and page numbers. Use note-taking techniques that clearly distinguish between your own ideas and those taken from other sources. Consider using different colors or symbols to indicate direct quotes, paraphrases, and summaries. This will help you avoid accidental plagiarism when you begin writing your paper. Regularly review your notes and ensure that you have properly attributed all sources. Planning and organization not only prevent plagiarism but also improve the overall quality of your research by ensuring that you have a clear understanding of your sources and how they relate to your arguments.',
                  },
                  {
                    title: '4. Understanding and Applying Quotation Marks',
                    icon: <Quote size={16} />,
                    content:
                      'Using quotation marks correctly is essential for avoiding plagiarism when incorporating direct quotes into your writing. Quotation marks indicate that you are using the exact words of another author. Place quotation marks around any text that is copied verbatim from a source, regardless of its length. Ensure that you transcribe the quoted text accurately, including punctuation and capitalization. Provide proper citation for all direct quotes, including the author\'s name, publication year, and page number. If you omit any words from a direct quote, use ellipses (...) to indicate the omission. If you add any words to a direct quote, enclose them in square brackets [ ]. Using quotation marks correctly demonstrates your honesty and transparency as a writer, and ensures that you are not misrepresenting the source material.',
                  },
                  {
                    title: '5. Seeking Guidance and Feedback',
                    icon: <Users size={16} />,
                    content:
                      'Don\'t hesitate to seek guidance and feedback from your instructors, librarians, or writing center tutors. They can provide valuable advice on citation techniques, paraphrasing, and other aspects of academic writing. Utilize the resources available to you, such as online tutorials, style guides, and plagiarism detection software. Many institutions offer workshops and training sessions on academic integrity and plagiarism prevention. Take advantage of these opportunities to enhance your understanding of ethical writing practices. When in doubt, ask for clarification or assistance. It\'s better to seek help than to risk committing plagiarism. Receiving feedback on your writing can help you identify potential issues and improve your skills. Remember that plagiarism is not just a technical error; it\'s a violation of academic integrity. By seeking guidance and feedback, you demonstrate your commitment to ethical scholarship and your willingness to learn and improve.',
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

            {/* SECTION 8: Ethical, Legal, and Socioeconomic Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['ethical-legal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Assessing Ethical, Legal, and Socioeconomic Issues Surrounding the Use of Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Ethical and Legal Issues Affecting Information Use',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'The digital age has brought about unprecedented access to information, but it has also created a complex web of ethical and legal challenges. Ethical considerations involve moral principles that guide our behavior, while legal issues pertain to laws and regulations that govern information use. Both are crucial in ensuring responsible information practices. Ethical dilemmas arise when information is used in ways that may cause harm, violate privacy, or perpetuate inequalities. Legal issues involve compliance with copyright laws, data protection regulations, and other legal frameworks. For instance, the collection and use of personal data raise ethical concerns about informed consent and data privacy, while legal issues involve compliance with regulations like GDPR or CCPA. The spread of misinformation and disinformation poses ethical challenges to the integrity of public discourse, while legal issues involve questions of defamation and freedom of speech. The increasingly sophisticated uses of artificial intelligence bring up ethical questions about algorithmic bias, and legal questions about who is responsible for AI generated content. Information professionals must stay informed about evolving ethical and legal standards, and they must be prepared to make informed decisions that balance the benefits of information access with the need to protect individual rights and societal well-being. This requires a nuanced understanding of the interplay between ethical principles and legal requirements.',
                  },
                  {
                    title: '2. Intellectual Property',
                    icon: <AwardIcon size={16} />,
                    content:
                      'Intellectual property (IP) refers to creations of the mind, such as inventions, literary and artistic works, designs, and symbols, used in commerce. IP rights, such as copyrights, patents, and trademarks, provide legal protection for these creations, granting creators exclusive rights to control their use and distribution. In the information age, IP is a critical asset, driving innovation and economic growth. Copyright protects original works of authorship, such as books, music, and software, while patents protect inventions and technological innovations. Trademarks protect brands and logos, ensuring that consumers can identify the source of goods and services. The balance between protecting IP rights and promoting access to information is a key challenge. Overly restrictive IP laws can stifle innovation and limit access to knowledge, while inadequate protection can discourage creativity and investment. Information professionals play a crucial role in educating users about IP rights and promoting responsible use of copyrighted materials. They must also navigate complex IP issues related to digital content, such as fair use, open access, and creative commons licenses.',
                  },
                  {
                    title: '3. Information Ethics',
                    icon: <Heart size={16} />,
                    content: (
                      <>
                        <p className="mb-2">Information ethics encompasses the moral principles that govern the creation, dissemination, and use of information. It addresses issues such as privacy, confidentiality, accuracy, and access. Information ethics provides a framework for making ethical decisions in the information age, ensuring that information is used in a responsible and just manner. Key ethical principles include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Respect for privacy:</strong> Protecting individuals' personal information and respecting their right to control their own data.</li>
                          <li><strong>Accuracy and integrity:</strong> Ensuring that information is accurate, reliable, and free from bias.</li>
                          <li><strong>Access and equity:</strong> Promoting equitable access to information for all members of society.</li>
                          <li><strong>Intellectual property:</strong> Respecting the rights of creators and ensuring proper attribution.</li>
                        </ul>
                        <p className="mt-2">Information ethics is particularly relevant in the digital age, where information is easily copied, shared, and manipulated. Information professionals have a responsibility to uphold ethical standards and to promote responsible information practices. This includes educating users about ethical issues, advocating for ethical policies, and developing ethical guidelines for information systems.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Code of Conduct for Information Practitioners',
                    icon: <Clipboard size={16} />,
                    content: (
                      <>
                        <p className="mb-2">A code of conduct for information practitioners outlines the ethical and professional standards that guide their work. These codes provide a framework for responsible behavior, ensuring that information professionals act with integrity and professionalism. These codes often include principles related to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Confidentiality:</strong> Protecting the privacy and confidentiality of user information.</li>
                          <li><strong>Accuracy:</strong> Ensuring the accuracy and reliability of information.</li>
                          <li><strong>Impartiality:</strong> Providing unbiased and objective information services.</li>
                          <li><strong>Professionalism:</strong> Maintaining high standards of competence and ethical conduct.</li>
                          <li><strong>Respect for intellectual property:</strong> Adhering to copyright laws and respecting the rights of creators.</li>
                        </ul>
                        <p className="mt-2">Codes of conduct are essential for maintaining public trust in information professionals and ensuring that they act in the best interests of their users and the community. Organizations like the American Library Association (ALA) and the Association for Information Science and Technology (ASIS&T) have developed codes of ethics that provide guidance for information professionals.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Information Security and Privacy',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p className="mb-2">Information security and privacy are critical concerns in the digital age. Information security involves protecting information from unauthorized access, use, disclosure, disruption, modification, or destruction. Privacy involves protecting individuals' personal information and respecting their right to control their own data. Information security measures include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Access controls:</strong> Restricting access to sensitive information.</li>
                          <li><strong>Encryption:</strong> Protecting data through encryption techniques.</li>
                          <li><strong>Firewalls and intrusion detection systems:</strong> Preventing unauthorized access to networks.</li>
                          <li><strong>Data backup and recovery:</strong> Ensuring that data can be restored in the event of a disaster.</li>
                        </ul>
                        <p className="mt-2 font-semibold">Privacy measures include:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Informed consent:</strong> Obtaining individuals' consent before collecting their personal data.</li>
                          <li><strong>Data minimization:</strong> Collecting only the data that is necessary for a specific purpose.</li>
                          <li><strong>Data anonymization:</strong> Removing identifying information from data.</li>
                          <li><strong>Data breach notification:</strong> Notifying individuals in the event of a data breach.</li>
                        </ul>
                        <p className="mt-2">Information professionals play a crucial role in implementing and maintaining information security and privacy measures. They must also educate users about security and privacy risks and promote responsible data handling practices.</p>
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
                  💡 Academic Integrity Insight
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
                  <span>Citation Systems</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Plagiarism Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Roles of Referencing</span>
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
                Referencing is the cornerstone of academic integrity. Citations acknowledge sources within the text; references provide full bibliographic details. Referencing prevents plagiarism, builds credibility, and supports research. Citation styles include parenthetical, narrative, footnote/endnote, author-date, and numeric systems. Plagiarism includes verbatim copying, inadequate paraphrasing, mosaic copying, self-plagiarism, and source-based fraud. Avoid plagiarism by mastering citations, paraphrasing, planning research, using quotation marks, and seeking guidance. Ethical and legal issues include intellectual property, privacy, information ethics, professional codes of conduct, and information security.
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
                <strong className="text-white">Referencing Fundamentals</strong> – Referencing is the overarching system of acknowledging sources; citations are in-text markers; references provide full bibliographic details.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Roles of Referencing</strong> – Referencing upholds academic integrity, establishes credibility, facilitates research, provides context, and demonstrates scholarly skills.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Types of Referencing</strong> – Includes in-text (parenthetical, narrative, numbered), footnote/endnote, author-date, numeric, and alphabetical systems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Plagiarism</strong> – Defined as presenting others' work as your own; types include verbatim, paraphrasing, mosaic, self-plagiarism, and source-based plagiarism.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Avoiding Plagiarism</strong> – Master citation techniques, develop paraphrasing skills, plan research, use quotation marks, and seek guidance from instructors and writing centers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ethical & Legal Issues</strong> – Intellectual property, information ethics, professional codes of conduct, and information security/privacy are critical considerations for responsible information use.
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
            Sidemann Academic Registry • Referencing, Citations &amp; Information Ethics 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;