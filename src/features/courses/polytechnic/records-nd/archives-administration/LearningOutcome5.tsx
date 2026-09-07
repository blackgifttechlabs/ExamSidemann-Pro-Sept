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
  Table,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'difference', label: 'Oral History vs Tradition' },
  { id: 'importance', label: 'Importance' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'quality-factors', label: 'Quality Factors' },
  { id: 'digitization', label: 'Digitization' },
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
        text: 'Oral history and oral tradition are distinct; oral history is the recording of personal memories within living memory, while oral tradition refers to cultural knowledge passed down over generations.',
      },
      {
        title: 'Pro Tip',
        text: 'Always obtain informed consent before recording an oral history interview, and ensure the narrator understands how their story will be used and stored.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of oral history methodology: "P‑I‑A" – Planning, Interviewing, and Archiving. Each is essential for a successful programme.',
      },
      {
        title: 'Common Mistake',
        text: 'Many digitization projects overlook metadata creation; without proper metadata, digital oral histories become difficult to search and use.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Oral history and oral tradition are distinct; oral history is the recording of personal memories within living memory, while oral tradition refers to cultural knowledge passed down over generations.',
      },
      {
        title: 'Pro Tip',
        text: 'Always obtain informed consent before recording an oral history interview, and ensure the narrator understands how their story will be used and stored.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of oral history methodology: "P‑I‑A" – Planning, Interviewing, and Archiving. Each is essential for a successful programme.',
      },
      {
        title: 'Common Mistake',
        text: 'Many digitization projects overlook metadata creation; without proper metadata, digital oral histories become difficult to search and use.',
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
            <FolderTree size={14} className="inline mr-1" /> ARCHIVES ADMINISTRATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Oral History, Traditions —{' '}
            <span className="text-rose-300 font-bold italic">
              &amp; Digital Preservation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to oral history vs tradition, methodology, guidelines, quality factors,
            and digitization strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Mic size={14} className="inline mr-1" /> Oral History
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Traditions
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> Digitization
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
                placeholder="Search for oral history, tradition, methodology, digitization..."
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
            {/* SECTION 1: Difference Between Oral History and Oral Tradition */}
            <div
              ref={(el) => {
                sectionRefs.current['difference'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Difference Between Oral History and Oral Tradition
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Oral history and oral tradition are both valuable sources of historical and cultural
                    knowledge, but they differ significantly in their scope, purpose, and methods of transmission.
                    Understanding these differences is crucial for effective collection and preservation.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Feature</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Oral History</th>
                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Oral Tradition</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Source</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Individual eyewitness accounts or personal narratives</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Collective community memory passed down generations</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Focus</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Specific events, experiences, or individuals</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Cultural values, beliefs, myths, and social structures</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Timeframe</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Recent past, within living memory</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Distant past, often mythical or legendary</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Transmission</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Interview-based, documented and recorded</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Repetitive telling, often ritualized or formalized</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Accuracy</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Subject to individual memory and interpretation</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Subject to collective memory and cultural adaptation</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Purpose</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Documenting personal experiences, filling historical gaps</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Maintaining cultural identity, transmitting knowledge</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Change</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Less prone to significant alterations over time</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">More susceptible to changes and adaptations over time</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">Verification</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Verifiable through other sources, if available</td>
                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Verification often relies on internal consistency within the tradition</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: Importance of Oral History and Traditions */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Importance of Oral History and Traditions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Oral history and oral traditions are crucial components of cultural heritage and historical
                    understanding, each offering unique perspectives and insights that complement written records.
                    Their importance can be justified through several key points:
                  </p>
</div>

              {renderCard(
                'Key Reasons',
                <Target size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Preservation of Unwritten Histories:</strong> Oral history and traditions provide
                    access to historical narratives that may not be documented in written form. This is particularly
                    important for communities with limited literacy or those whose histories have been marginalized
                    or excluded from mainstream historical accounts. They allow for the preservation of diverse
                    perspectives and experiences.
                  </li>
                  <li>
                    <strong>Humanizing the Past:</strong> Oral history and traditions bring the past to life by
                    capturing personal stories, emotions, and perspectives. They provide a human dimension to
                    historical events, making them more relatable and meaningful. This humanization can foster
                    empathy and understanding across generations.
                  </li>
                  <li>
                    <strong>Filling Gaps in Historical Records:</strong> Oral sources can fill gaps in written
                    records, providing valuable information about social, cultural, and personal experiences that
                    may not have been documented. They can offer insights into the daily lives of ordinary people,
                    shedding light on their struggles, triumphs, and contributions.
                  </li>
                  <li>
                    <strong>Maintaining Cultural Identity:</strong> Oral traditions play a vital role in
                    maintaining cultural identity and transmitting cultural values, beliefs, and practices across
                    generations. They serve as a repository of cultural knowledge, ensuring that traditions are not
                    lost or forgotten.
                  </li>
                  <li>
                    <strong>Empowering Marginalized Communities:</strong> Oral history can empower marginalized
                    communities by giving them a voice and allowing them to tell their own stories. This can
                    challenge dominant narratives and promote a more inclusive and representative understanding of
                    history.
                  </li>
                  <li>
                    <strong>Providing Context and Interpretation:</strong> Oral sources can provide context and
                    interpretation for historical events, offering insights into the motivations, perspectives, and
                    experiences of those who lived through them. They can shed light on the social, cultural, and
                    political factors that shaped the past.
                  </li>
                  <li>
                    <strong>Strengthening Community Bonds:</strong> The process of collecting and sharing oral
                    history and traditions can strengthen community bonds and foster a sense of shared identity.
                    It can bring people together to reflect on their past and celebrate their cultural heritage.
                  </li>
                  <li>
                    <strong>Educational Value:</strong> Oral history and traditions have significant educational
                    value, providing students with opportunities to learn about history from firsthand accounts and
                    to develop critical thinking skills. They can also enhance cultural awareness and promote
                    intergenerational dialogue.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 3: Oral History Methodology */}
            <div
              ref={(el) => {
                sectionRefs.current['methodology'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Oral History Methodology: Capturing and Preserving Lived Experiences
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Oral history methodology provides a structured approach to collecting, preserving, and
                    interpreting firsthand accounts of past events and experiences. It goes beyond casual
                    conversation, employing systematic techniques to ensure the reliability and ethical integrity
                    of the collected narratives. This methodology is vital for documenting perspectives that may
                    be absent from traditional written records, offering a more nuanced and inclusive understanding
                    of history.
                  </p>
</div>

              {renderCard(
                'Key Steps',
                <ClipboardList size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Project Planning and Design:</strong> The first step involves defining the project's
                    scope, objectives, and target population. This includes identifying the historical themes or
                    events to be explored, determining the types of narratives to be collected, and establishing
                    ethical guidelines for the project. A well‑defined project plan ensures that the oral history
                    collection is focused and manageable. This stage also includes research into the historical
                    context of the project.
                  </li>
                  <li>
                    <strong>Ethical Considerations and Informed Consent:</strong> Ethical considerations are
                    paramount in oral history. Researchers must obtain informed consent from all participants,
                    ensuring that they understand the purpose of the project, how their narratives will be used,
                    and their rights to privacy and confidentiality. This involves providing clear and accessible
                    information about the project and obtaining written or verbal consent before any interviews are
                    conducted. Respect for the narrator, and their stories, is very important.
                  </li>
                  <li>
                    <strong>Interviewer Training and Preparation:</strong> Effective oral history interviews
                    require skilled interviewers who are trained in active listening, question formulation, and
                    interview techniques. Interviewers should be knowledgeable about the historical context of the
                    project and able to establish rapport with participants. They must also be aware of their own
                    biases and strive to maintain objectivity. This training ensures that the interviews are
                    conducted in a respectful and productive manner.
                  </li>
                  <li>
                    <strong>Interview Process and Techniques:</strong> The interview process involves creating a
                    comfortable and conducive environment for participants to share their stories. Interviewers use
                    open‑ended questions to encourage detailed narratives and avoid leading questions that could
                    influence the participant's responses. They also use active listening techniques, such as
                    paraphrasing and summarizing, to demonstrate their engagement and understanding. The interview
                    should be recorded, with the permission of the narrator.
                  </li>
                  <li>
                    <strong>Recording and Documentation:</strong> High‑quality audio or video recordings are
                    essential for preserving the narratives. Detailed documentation, including interview transcripts,
                    field notes, and contextual information, is also crucial for ensuring the accessibility and
                    usability of the collected materials. Proper documentation also includes the creation of
                    metadata, such as the date, location, and participants of the interview.
                  </li>
                  <li>
                    <strong>Transcription and Indexing:</strong> Transcription involves converting the audio or
                    video recordings into written text. Indexing involves creating a detailed index of the interview
                    content, including key names, places, and events. These processes enhance the accessibility and
                    searchability of the narratives, making them easier to use for research and analysis.
                  </li>
                  <li>
                    <strong>Analysis and Interpretation:</strong> Analyzing and interpreting oral history narratives
                    requires careful consideration of the context, perspectives, and potential biases of the
                    participants. Researchers must use critical thinking skills to evaluate the reliability and
                    validity of the narratives and to draw meaningful conclusions. This stage involves comparing the
                    oral narratives with other historical sources and considering the social, cultural, and political
                    factors that shaped the participants' experiences.
                  </li>
                  <li>
                    <strong>Preservation and Access:</strong> Preserving and providing access to oral history
                    materials is essential for ensuring their long‑term value. This involves creating archival‑
                    quality copies of the recordings, storing them in appropriate conditions, and making them
                    available to researchers and the public. Access may be provided through online databases,
                    digital archives, or physical repositories.
                  </li>
                  <li>
                    <strong>Community Feedback and Ownership:</strong> Where possible, returning the collected oral
                    histories to the community that they came from is very important. This helps to ensure that the
                    community has ownership of its own history, and that the oral histories are used in a culturally
                    appropriate way.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 4: Developing and Evaluating Guidelines */}
            <div
              ref={(el) => {
                sectionRefs.current['guidelines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Developing and Evaluating Guidelines for Oral History Methodology
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Developing robust guidelines for oral history methodology is essential for ensuring the ethical
                    integrity, reliability, and long‑term value of collected narratives. These guidelines provide a
                    framework for researchers, institutions, and communities to conduct oral history projects in a
                    responsible and consistent manner.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Developing Guidelines',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Ethical Principles and Informed Consent:</strong> Guidelines should prioritize
                          ethical considerations, emphasizing the importance of informed consent, confidentiality,
                          and respect for narrators. They should outline procedures for obtaining informed consent,
                          ensuring that participants fully understand the purpose of the project, how their
                          narratives will be used, and their rights to withdraw or restrict access to their stories.
                          Clear guidelines should be established for handling sensitive information, protecting the
                          privacy of narrators and their families, and addressing potential conflicts of interest.
                        </li>
                        <li>
                          <strong>Interviewer Training and Best Practices:</strong> Guidelines should emphasize the
                          importance of interviewer training, covering topics such as active listening, question
                          formulation, and interview techniques. They should provide guidance on creating a
                          comfortable and conducive interview environment, establishing rapport with participants,
                          and avoiding leading questions. Best practices for recording, documenting, and transcribing
                          interviews should be outlined, ensuring that high‑quality audio or video recordings are
                          obtained and that detailed documentation is created.
                        </li>
                        <li>
                          <strong>Documentation and Metadata Standards:</strong> Guidelines should establish
                          standards for documenting oral history projects, including interview transcripts, field
                          notes, contextual information, and metadata. Metadata standards should be developed to
                          ensure the accessibility and interoperability of oral history collections. This
                          documentation is very important to make sure that the oral histories can be understood,
                          and used, by future researchers.
                        </li>
                        <li>
                          <strong>Preservation and Access Policies:</strong> Guidelines should address the long‑term
                          preservation of oral history materials, including archival storage, digitization, and
                          access policies. They should outline procedures for creating archival‑quality copies of
                          recordings, storing them in appropriate conditions, and making them available to researchers
                          and the public. Clear guidelines should be established for access restrictions, copyright,
                          and intellectual property rights.
                        </li>
                        <li>
                          <strong>Community Engagement and Ownership:</strong> Guidelines should promote community
                          engagement and ownership of oral history projects, particularly when working with
                          marginalized or indigenous communities. They should outline procedures for consulting with
                          community members, incorporating their perspectives into the project, and ensuring that the
                          collected narratives are used in a culturally appropriate manner. Returning copies of the
                          oral histories to the communities they originated from should be a high priority.
                        </li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Evaluating Guidelines',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Clarity and Accessibility:</strong> Guidelines should be written in clear and
                          concise language, avoiding jargon and technical terms that may be unfamiliar to users.
                          They should be accessible to a wide range of individuals, including researchers, community
                          members, and students.
                        </li>
                        <li>
                          <strong>Comprehensiveness and Relevance:</strong> Guidelines should be comprehensive,
                          covering all aspects of oral history methodology, from project planning to preservation and
                          access. They should be relevant to the specific needs and contexts of different communities
                          and institutions.
                        </li>
                        <li>
                          <strong>Ethical Soundness:</strong> Guidelines should reflect the highest ethical
                          standards, prioritizing the rights and well‑being of narrators and ensuring that their
                          narratives are used responsibly. They should address potential ethical dilemmas and provide
                          guidance on how to resolve them.
                        </li>
                        <li>
                          <strong>Practicality and Feasibility:</strong> Guidelines should be practical and feasible,
                          providing realistic recommendations that can be implemented by researchers and institutions
                          with limited resources. They should consider the challenges and constraints of different
                          settings and contexts.
                        </li>
                        <li>
                          <strong>Flexibility and Adaptability:</strong> Guidelines should be flexible and adaptable,
                          allowing for adjustments to accommodate changing needs and circumstances. They should be
                          regularly reviewed and updated to reflect new technologies, best practices, and ethical
                          considerations.
                        </li>
                        <li>
                          <strong>Feedback and Evaluation:</strong> Guidelines should be evaluated regularly based
                          on feedback from researchers, community members, and other stakeholders. This ensures that
                          the guidelines remain relevant, effective, and responsive to the needs of the oral history
                          community.
                        </li>
                        <li>
                          <strong>Legal Compliance:</strong> All guidelines must be compliant with local, and
                          national, laws. This is especially true concerning privacy, and copyright.
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

            {/* SECTION 5: Evaluating Factors That Determine Quality */}
            <div
              ref={(el) => {
                sectionRefs.current['quality-factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating the Factors That Determine the Quality of an Oral History Programme
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The quality of an oral history programme hinges on several critical factors that contribute
                    to the integrity, reliability, and impact of the collected narratives. These factors ensure
                    that the programme not only captures valuable historical information but also does so in an
                    ethical and sustainable manner.
                  </p>
</div>

              {renderCard(
                'Key Quality Factors',
                <ListChecks size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Ethical Considerations and Informed Consent:</strong> A high‑quality oral history
                    programme prioritizes ethical considerations above all else. This includes rigorous adherence
                    to informed consent procedures, ensuring that narrators fully understand the purpose of the
                    project, how their narratives will be used, and their rights to privacy and confidentiality.
                    The programme should demonstrate a commitment to protecting narrators from potential harm or
                    exploitation, and it should establish clear guidelines for handling sensitive information. The
                    programme should also be transparent about its funding sources and affiliations, avoiding any
                    conflicts of interest that could compromise the integrity of the collected narratives.
                  </li>
                  <li>
                    <strong>Interviewer Training and Skill:</strong> The quality of an oral history programme is
                    significantly influenced by the training and skill of its interviewers. Skilled interviewers
                    are able to establish rapport with narrators, ask open‑ended questions that elicit detailed
                    narratives, and actively listen and respond to the stories being shared. They possess a deep
                    understanding of the historical context of the project and are able to guide the interview
                    without leading or influencing the narrator's responses. Regular training and professional
                    development opportunities for interviewers are essential for maintaining high standards and
                    ensuring consistency across the programme.
                  </li>
                  <li>
                    <strong>Sound Project Design and Planning:</strong> A well‑designed oral history programme
                    begins with a clear and focused project plan. This includes defining the project's scope,
                    objectives, and target population, as well as establishing a timeline and budget. The project
                    plan should also outline the research questions that will guide the interviews and the methods
                    that will be used to analyze and interpret the collected narratives. A thorough research phase,
                    before interviews start, is also vital. This ensures that the interviewer has the appropriate
                    context for the interview.
                  </li>
                  <li>
                    <strong>High‑Quality Recording and Documentation:</strong> High‑quality audio or video
                    recordings are essential for preserving the narratives and ensuring their accessibility for
                    future researchers. The programme should use professional‑grade equipment and follow best
                    practices for recording and storing digital files. Detailed documentation, including interview
                    transcripts, field notes, and metadata, is also crucial for ensuring the usability and
                    interpretability of the collected materials. Metadata standards should be followed to ensure the
                    interoperability of the collection with other archival resources.
                  </li>
                  <li>
                    <strong>Rigorous Analysis and Interpretation:</strong> The quality of an oral history programme
                    is also determined by the rigor of its analysis and interpretation. Researchers should use
                    critical thinking skills to evaluate the reliability and validity of the narratives, considering
                    the context, perspectives, and potential biases of the narrators. They should also compare the
                    oral narratives with other historical sources to provide a more comprehensive understanding of
                    the past. The analysis should be transparent and well‑documented, allowing other researchers to
                    evaluate the findings and draw their own conclusions.
                  </li>
                  <li>
                    <strong>Community Engagement and Ownership:</strong> A high‑quality oral history programme
                    actively engages with the communities it seeks to represent, fostering a sense of ownership and
                    collaboration. This includes consulting with community members throughout the project,
                    incorporating their perspectives into the research, and ensuring that the collected narratives
                    are used in a culturally appropriate manner. Returning the collected narratives to the community
                    and providing opportunities for community members to participate in the analysis and
                    interpretation of the stories is also essential.
                  </li>
                  <li>
                    <strong>Preservation and Access:</strong> The long‑term preservation and accessibility of oral
                    history materials are critical for ensuring their enduring value. The programme should establish
                    clear policies for archival storage, digitization, and access, ensuring that the narratives are
                    protected from damage and made available to researchers and the public. Access policies should
                    balance the need to protect sensitive information with the goal of promoting research and
                    scholarship.
                  </li>
                  <li>
                    <strong>Evaluation and Improvement:</strong> A high‑quality oral history programme is committed
                    to continuous evaluation and improvement. Regular reviews of the project's methods, outcomes,
                    and impact are essential for identifying areas for improvement and ensuring that the programme
                    remains relevant and effective. Feedback from narrators, researchers, and community members
                    should be actively sought and incorporated into the evaluation process.
                  </li>
                </ul>
              )}
            </div>

            {/* SECTION 6: Digitizing Oral History */}
            <div
              ref={(el) => {
                sectionRefs.current['digitization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digitizing Oral History: Strategies for Preservation and Access
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digitizing oral history collections is crucial for ensuring their long‑term preservation and
                    enhancing their accessibility to researchers, educators, and the public. It involves converting
                    analog recordings and associated materials into digital formats, employing a range of strategies
                    to optimize quality and usability.
                  </p>
</div>

              {renderCard(
                'Strategies',
                <Server size={16} />,
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>High‑Quality Audio and Video Digitization:</strong> The primary focus of digitization is
                    to create high‑fidelity digital copies of the original audio or video recordings. This involves
                    using professional‑grade digitization equipment and software to capture the recordings at the
                    highest possible resolution and bit depth. For audio recordings, this may involve using archival‑
                    quality audio interfaces and software to transfer the recordings from analog formats such as
                    cassette tapes or reel‑to‑reel tapes to digital formats such as WAV or FLAC. For video recordings,
                    this may involve using professional video capture cards and software to transfer the recordings
                    from analog formats such as VHS or Betamax tapes to digital formats such as MP4 or MOV. It is
                    important to use appropriate settings and codecs to minimize loss of quality during the
                    digitization process.
                  </li>
                  <li>
                    <strong>Transcription and Metadata Creation:</strong> Digitization should not be limited to the
                    audio or video recordings themselves. Transcripts of the interviews are essential for making the
                    content searchable and accessible to researchers. Metadata, which is data about data, should also
                    be created to provide contextual information about the recordings, such as the date, location,
                    participants, and subject matter of the interviews. Metadata standards, such as Dublin Core or
                    METS, should be followed to ensure the interoperability of the digital collection with other
                    archival resources. This metadata can be embedded within the digital files or stored in a
                    separate database.
                  </li>
                  <li>
                    <strong>Digital Preservation Strategies:</strong> Once the recordings and associated materials
                    have been digitized, it is essential to implement digital preservation strategies to ensure their
                    long‑term survival. This involves creating multiple copies of the digital files and storing them
                    in geographically dispersed locations. Archival storage formats, such as TIFF for images and WAV
                    or FLAC for audio, should be used to minimize the risk of data loss or corruption. Regular
                    backups and data integrity checks should be performed to ensure the ongoing preservation of the
                    digital collection.
                  </li>
                  <li>
                    <strong>Online Platforms and Access:</strong> Online platforms, such as digital archives and
                    online repositories, can be used to provide access to digitized oral history collections. This
                    allows researchers and the public to access the narratives from anywhere in the world. Online
                    platforms should be designed to be user‑friendly and accessible, with search and browse
                    functionalities that enable users to easily find relevant materials. Access controls should be
                    implemented to protect sensitive information and comply with copyright and privacy regulations.
                    Streaming services can be used for online listening, and downloading options can be given to
                    researchers.
                  </li>
                  <li>
                    <strong>Community Collaboration and Engagement:</strong> Digitization projects should prioritize
                    community collaboration and engagement, particularly when working with marginalized or indigenous
                    communities. This involves consulting with community members about the digitization process,
                    incorporating their perspectives into the metadata and access policies, and ensuring that the
                    digital collection is used in a culturally appropriate manner. Returning digital copies of the
                    oral histories to the community and providing opportunities for community members to participate
                    in the dissemination and interpretation of the narratives is also essential.
                  </li>
                  <li>
                    <strong>Copyright and Intellectual Property Considerations:</strong> Before digitizing any oral
                    history recordings, it is essential to clarify copyright and intellectual property rights. This
                    involves obtaining permission from the narrators and any other copyright holders to digitize and
                    make the recordings available online. Clear policies should be established for the use and
                    reproduction of copyrighted materials, ensuring that researchers and the public comply with legal
                    requirements.
                  </li>
                  <li>
                    <strong>Accessibility Considerations:</strong> Digital oral histories should be made accessible
                    to all users, including those with disabilities. This involves providing transcripts, closed
                    captions, and other accessibility features. Online platforms should be designed to comply with
                    accessibility guidelines, such as WCAG, to ensure that they are usable by individuals with
                    visual, auditory, or cognitive impairments.
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Oral History Insight
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
                  <span>Comparison Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Methodology Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Quality Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Digitization Strategies</span>
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
                Oral history captures personal experiences within living memory; oral tradition transmits
                cultural knowledge across generations. Both are crucial for preserving unwritten histories,
                humanising the past, and strengthening cultural identity. Oral history methodology includes
                planning, ethical consent, interviewer training, recording, transcription, analysis, and
                preservation. Guidelines should be clear, comprehensive, ethical, practical, and adaptable.
                Quality depends on ethics, interviewer skill, project design, recording quality, rigorous
                analysis, community engagement, and preservation. Digitisation strategies include high‑quality
                capture, transcription, metadata, preservation, online access, community collaboration, and
                accessibility.
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
                <strong className="text-white">Oral History vs Oral Tradition</strong> – Oral history is
                individual eyewitness accounts within living memory; oral tradition is collective cultural
                knowledge passed down over generations. They differ in source, focus, timeframe, transmission,
                accuracy, purpose, change, and verification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Importance</strong> – Preserves unwritten histories, humanises
                the past, fills gaps in records, maintains cultural identity, empowers communities, provides
                context, strengthens bonds, and has educational value.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Oral History Methodology</strong> – Involves project planning,
                ethical consent, interviewer training, interview techniques, recording, transcription, analysis,
                preservation, and community ownership.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Guidelines Development &amp; Evaluation</strong> – Develop with
                ethical principles, training, documentation standards, preservation policies, and community
                engagement. Evaluate for clarity, comprehensiveness, ethical soundness, practicality, flexibility,
                feedback, and legal compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Quality Factors</strong> – Ethics, interviewer training, project
                design, recording/documentation quality, rigorous analysis, community engagement, preservation,
                and continuous evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Digitization Strategies</strong> – High‑quality capture,
                transcription and metadata creation, digital preservation (backups, archival formats),
                online platforms for access, community collaboration, copyright considerations, and
                accessibility features.
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
            Sidemann Academic Registry • Oral History, Traditions &amp; Digital Preservation 5.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;
