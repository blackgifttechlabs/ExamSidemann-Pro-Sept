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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'importance', label: 'Importance' },
  { id: 'destruction', label: 'Destruction Causes' },
  { id: 'problems', label: 'Problems' },
  { id: 'repackaging', label: 'Repackaging' },
  { id: 'national-dev', label: 'National Development' },
  { id: 'traditional-media', label: 'Traditional Media' },
  { id: 'strategies-tools', label: 'Strategies & Tools' },
  { id: 'procedures', label: 'Procedures' },
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
        text: 'Traditional Knowledge often holds centuries of observations about local ecosystems, offering insights that modern science is only beginning to appreciate.',
      },
      {
        title: 'Pro Tip',
        text: 'When capturing Indigenous Knowledge, always involve community elders and obtain prior informed consent – respect is the foundation of ethical documentation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Cs of capturing IK: Community involvement, Consent, and Cultural sensitivity.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume documenting IK is purely technical; in reality, it requires deep cultural understanding and long‑term relationship building.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Traditional Knowledge often holds centuries of observations about local ecosystems, offering insights that modern science is only beginning to appreciate.',
      },
      {
        title: 'Pro Tip',
        text: 'When capturing Indigenous Knowledge, always involve community elders and obtain prior informed consent – respect is the foundation of ethical documentation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three Cs of capturing IK: Community involvement, Consent, and Cultural sensitivity.',
      },
      {
        title: 'Common Mistake',
        text: 'Many assume documenting IK is purely technical; in reality, it requires deep cultural understanding and long‑term relationship building.',
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
            <FolderTree size={14} className="inline mr-1" /> INDIGENOUS KNOWLEDGE SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Capturing, Documenting &amp; Preserving Indigenous Knowledge —{' '}
            <span className="text-amber-300 font-bold italic">
              Strategies, Tools &amp; Procedures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to capturing traditional knowledge, causes of destruction, repackaging challenges, strategies, tools, and documentation procedures.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Mic size={14} className="inline mr-1" /> Capture
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Document
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Preserve
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
            {/* SECTION 1: Importance of Capturing Traditional Knowledge */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Importance of Capturing Traditional Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional Knowledge (TK) is like a treasure chest filled with valuable information. It's the knowledge that people have learned and passed down for many, many years, often through stories and practice. Capturing this knowledge is very important for many reasons.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preserving Cultural Heritage',
                    icon: <Heart size={16} />,
                    content:
                      'TK is a big part of a community\'s culture. It includes stories, songs, dances, and ways of doing things that have been around for a long time. If we don\'t capture this knowledge, it could be lost forever. By recording it, we help keep these traditions alive for future generations. This helps people know who they are, and where they came from.',
                  },
                  {
                    title: '2. Protecting Valuable Knowledge',
                    icon: <ShieldIcon size={16} />,
                    content:
                      'TK often holds important information about things like medicine, farming, and how to take care of the land. For example, people might know which plants can be used to treat sickness, or how to grow food in a way that doesn\'t hurt the environment. This knowledge can be very helpful for solving problems today. If we don\'t write it down, or record it, it can be lost.',
                  },
                  {
                    title: '3. Sharing Knowledge with Others',
                    icon: <Share2 size={16} />,
                    content:
                      'By capturing TK, we can share it with other people. This includes scientists, researchers, and other communities. This sharing can help us find new ways to solve problems and make the world a better place. It also helps other people learn about different cultures and ways of life.',
                  },
                  {
                    title: '4. Empowering Communities',
                    icon: <Users size={16} />,
                    content:
                      'When we capture TK, we give communities a chance to share their own stories and knowledge. This helps them feel proud of their culture and gives them a voice. It also helps them have more control over their own knowledge, so it isn\'t used in ways they don\'t agree with.',
                  },
                  {
                    title: '5. Helping with Environmental Issues',
                    icon: <Leaf size={16} />,
                    content:
                      'TK often has a lot of information about how to take care of the environment. People who have lived in a place for a long time know a lot about the plants, animals, and weather. This knowledge can help us find ways to protect the environment and deal with problems like climate change.',
                  },
                  {
                    title: '6. Aiding in Medical Discoveries',
                    icon: <Pill size={16} />,
                    content:
                      'Many modern medicines have been created using plants that traditional healers have used for centuries. By documenting the use of these plants, modern medicine can create new and effective medicines.',
                  },
                  {
                    title: '7. Passing on Knowledge to Young People',
                    icon: <BookOpenIcon2 size={16} />,
                    content:
                      'By recording IKS, it can be used in educational programs, and other methods of teaching youths about their cultures. This helps to make sure that the knowledge is not lost.',
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

            {/* SECTION 2: Causes of Destruction */}
            <div
              ref={(el) => {
                sectionRefs.current['destruction'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Causes of Destruction of the Indigenous Knowledge Base
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge (IK) is like a library built over many generations, holding valuable information about how to live in harmony with the world. Sadly, this library is being lost, and there are many reasons why.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Colonialism and Historical Disruption:</strong> In the past, many countries were taken over by others. This process, called colonialism, often involved the invaders saying that the local people's ways were wrong. They forced people to change their languages, beliefs, and practices. This broke down the ways IK was passed down, causing a big loss of knowledge.</li>
                  <li><strong>Modernization and Globalization:</strong> The world is changing fast. New technologies, cities, and ways of living are spreading everywhere. This can make traditional ways seem less useful to young people. They might move to cities, or learn new skills that don't use IK. This leads to less use, and therefore loss, of IK.</li>
                  <li><strong>Loss of Elders and Knowledge Holders:</strong> The people who hold the most IK are often older. When they pass away, their knowledge goes with them if it hasn't been shared. Because of changes in lifestyle, and the movement of youths to cities, there are less young people learning from these elders.</li>
                  <li><strong>Lack of Documentation:</strong> Much IK is passed down through stories and practice, not written down. This makes it very fragile. If the stories aren't told, or the practices aren't done, the knowledge disappears.</li>
                  <li><strong>Environmental Changes:</strong> The world's environment is changing. Climate change, pollution, and loss of natural areas are affecting the places where indigenous people live. This can make their traditional knowledge about plants, animals, and weather less useful.</li>
                  <li><strong>Lack of Recognition and Respect:</strong> Sometimes, people don't understand or respect IK. They might think it's just old stories, not real knowledge. This lack of respect can make it hard for indigenous people to share their knowledge and keep it alive.</li>
                  <li><strong>Economic Pressures:</strong> Many indigenous communities face poverty and lack of opportunities. This can force people to abandon traditional practices in favor of jobs or other ways to make money. This means they cannot use, and therefore lose, their IKS.</li>
                  <li><strong>Language Loss:</strong> Indigenous languages are often the carriers of IK. As these languages become less spoken, the knowledge they hold is also lost. If the language is lost, the IKS is also lost.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Problems Associated with IKS */}
            <div
              ref={(el) => {
                sectionRefs.current['problems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Problems Associated with Indigenous Knowledge Systems (IKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems (IKS) are valuable, but they also face several problems that can make them hard to use and protect. These problems often come from changes in the world and how people think about knowledge.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Loss of Knowledge Holders:</strong> The people who know the most about IKS are often elders. When these elders pass away, their knowledge can be lost if it hasn't been shared. This is a big problem because much IKS is passed down through stories and practice, not written down.</li>
                  <li><strong>Lack of Documentation:</strong> Many parts of IKS are not written down. They are oral, meaning they are spoken. This makes them easy to lose or change over time. If there are no recordings or written records, the knowledge can disappear.</li>
                  <li><strong>Intellectual Property Issues:</strong> Sometimes, people from outside indigenous communities try to use IKS for their own profit, like making medicines or selling products. This can be unfair to the communities who own the knowledge. There are often no clear laws to protect IKS, so it can be easily taken.</li>
                  <li><strong>Impact of Modernization:</strong> As the world changes, young people might not learn or use IKS as much. They might move to cities or learn new skills that don't use traditional knowledge. This can lead to the knowledge being forgotten.</li>
                  <li><strong>Lack of Recognition:</strong> Some people don't understand or respect IKS. They might think it's just old stories, not real knowledge. This makes it hard for IKS to be used in important areas like health care or environmental management.</li>
                  <li><strong>Language Barriers:</strong> A lot of IKS is tied to indigenous languages. If these languages are lost, the knowledge is also lost. This is a problem because many indigenous languages are not spoken as much as they used to be.</li>
                  <li><strong>Environmental Changes:</strong> Climate change and other environmental problems can change the places where indigenous people live. This can make some of their traditional knowledge less useful. For example, knowledge about weather patterns might not be accurate anymore.</li>
                  <li><strong>Access and Control:</strong> Even when IKS is documented, who gets to see it, and how they use it, is a very important question. Some knowledge is sacred, and only certain people are allowed to know it. How to share IKS, while also protecting it, is a difficult problem.</li>
                  <li><strong>Funding:</strong> Compared to western science, IKS research and preservation receives very little funding. This lack of funding makes it difficult to properly document, and preserve IKS.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 4: Challenges and Opportunities in Repackaging */}
            <div
              ref={(el) => {
                sectionRefs.current['repackaging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges and Opportunities in Repackaging Traditional Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional Knowledge (TK) is like a collection of old stories and skills passed down through families and communities. Repackaging it means taking this old knowledge and putting it into new forms, like books, websites, or videos, so more people can learn from it. This is important, but it comes with challenges and chances to do good.
                  </p>
</div>

              {/* Challenges Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Challenges in Repackaging Traditional Knowledge
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Keeping it Real (Authenticity):</strong> TK is often tied to a specific culture and place. If you take it out of that place, it might lose its true meaning. Like taking a plant out of its soil, it might not grow the same. It is hard to translate IKS into modern formats, without losing some of the meaning.</li>
                  <li><strong>Being Respectful (Ethical Concerns):</strong> Some TK is sacred, meaning it's special and only certain people should know it. Sharing it without permission can be disrespectful. There is always a risk of exploitation, or misappropriation. People from outside the community may try to take and sell IKS for profit.</li>
                  <li><strong>Making it Understandable (Knowledge Gaps):</strong> TK often uses different words and ideas than modern science. It's like speaking a different language. Making it understandable for everyone can be tricky. It is hard to translate IKS into formats that are easily understood by modern audiences.</li>
                  <li><strong>Using the Right Tools (Technological Limitations):</strong> Using computers and the internet can help share TK, but not everyone has access to these things. Some communities might not have internet or know how to use computers. Digital preservation also presents its own challenges. Digital files can be corrupted, or become unreadable.</li>
                  <li><strong>Finding the Right Balance (Tradition and Innovation):</strong> We need to find a way to share TK in new ways without changing it too much. It's like making a new version of an old song, you want to keep the feeling of the original. How to present IKS in a way that is relevant to modern audiences, without changing it too much.</li>
                </ul>
              </div>

              {/* Opportunities Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Opportunities in Repackaging Traditional Knowledge
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Sharing with More People (Increased Accessibility):</strong> Putting TK into books, videos, or websites can let more people learn about it. This is especially good for young people who might not learn it from their elders. Modern methods of presentation can make IKS more easily available.</li>
                  <li><strong>Keeping Culture Alive (Cultural Preservation):</strong> Repackaging TK can help save it from being lost. This is important when elders pass away or when traditions are changing. It can also help to revitalize cultural practices.</li>
                  <li><strong>Teaching Others (Educational Value):</strong> TK can be used in schools to teach about different cultures, how to take care of the earth, and useful skills. It can be used to teach people about different cultures, and ways of life.</li>
                  <li><strong>Helping Communities (Economic Development):</strong> TK can be used to make crafts, food, or other products that can be sold. This can help communities make money and keep their traditions alive. This can also help to fund IKS preservation efforts.</li>
                  <li><strong>Learning New Things (Scientific Advancement):</strong> Scientists can learn from TK about medicines, farming, and how to protect the environment. This can lead to new discoveries. It can help to combine IKS with western science, to create new knowledge.</li>
                  <li><strong>Giving Communities Power (Community Empowerment):</strong> When done right, repackaging TK lets communities tell their own stories and control how their knowledge is used.</li>
                  <li><strong>Solving Big Problems (Addressing Global Challenges):</strong> TK can help us find ways to deal with problems like climate change, loss of animals and plants, and hunger.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  To make repackaging TK work, we need to work together with the communities who own the knowledge. We need to listen to them, respect their rules, and make sure they get the benefits.
                </p>
              </div>
            </div>

            {/* SECTION 5: National Development */}
            <div
              ref={(el) => {
                sectionRefs.current['national-dev'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges and Opportunities of Using Indigenous Knowledge in National Development
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous knowledge refers to the wisdom, skills, and practices that local communities have developed over many generations to solve problems and live sustainably in their environments. This knowledge includes farming methods, medicine, environmental conservation, and traditional governance systems. Using indigenous knowledge in national development can bring many benefits, but there are also challenges that need to be addressed.
                  </p>
</div>

              {/* Challenges Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Challenges of Using Indigenous Knowledge in National Development
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Lack of Documentation:</strong> Indigenous knowledge is mostly passed down through storytelling, experience, and observation rather than being written in books or official records. This makes it difficult to preserve and share widely. If the knowledge is not recorded, it may be lost when elders pass away.</li>
                  <li><strong>Limited Recognition by Governments:</strong> Many governments and policymakers prefer modern scientific knowledge over indigenous knowledge. They may see traditional practices as outdated or less effective. Because of this, indigenous knowledge is often ignored in national development plans, even when it can provide useful solutions.</li>
                  <li><strong>Influence of Western Education and Culture:</strong> Modern education focuses on science, technology, and Western ways of thinking. Many young people grow up learning modern methods and may see traditional knowledge as unimportant. This can lead to a loss of valuable knowledge that has been useful for generations.</li>
                  <li><strong>Intellectual Property and Ownership Issues:</strong> Indigenous knowledge belongs to communities, but sometimes companies or researchers take it without permission and use it for profit. For example, some traditional medicinal plants have been used by pharmaceutical companies without giving credit or benefits to the original communities. There is a need for laws to protect indigenous knowledge.</li>
                  <li><strong>Difficulty in Adapting to Modern Needs:</strong> Some indigenous knowledge is highly useful but may need to be adapted to work well with modern development needs. For example, traditional farming methods may need improvements to increase food production while still protecting the environment. The challenge is finding a balance between tradition and modern progress.</li>
                </ul>
              </div>

              {/* Opportunities Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Lightbulb size={16} /> Opportunities of Using Indigenous Knowledge in National Development
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Sustainable Development:</strong> Indigenous knowledge promotes ways of living that protect the environment and use resources wisely. Traditional farming, water management, and conservation methods can help reduce pollution and climate change effects while ensuring that future generations have enough resources.</li>
                  <li><strong>Affordable and Locally Available Solutions:</strong> Many indigenous methods use materials and techniques that are already available in local communities. This makes them more affordable compared to imported solutions. For example, traditional herbal medicine can be a cheaper and effective alternative to expensive modern drugs.</li>
                  <li><strong>Cultural Identity and National Pride:</strong> Using indigenous knowledge helps preserve a country's cultural heritage. It allows people to feel proud of their history and traditions. When a nation values its traditions, it strengthens unity and identity among its people.</li>
                  <li><strong>Improved Health and Medicine:</strong> Many indigenous communities have knowledge of natural medicine that has been used for centuries to treat diseases. If combined with modern medical research, traditional medicine can provide new treatments and improve healthcare, especially in rural areas where hospitals and doctors are limited.</li>
                  <li><strong>Economic Opportunities:</strong> Indigenous knowledge can create job opportunities and boost the economy. Traditional crafts, agriculture, and herbal medicine can be turned into businesses that provide income for local communities. Governments can support these industries through training, investment, and promotion.</li>
                  <li><strong>Strengthening Education Systems:</strong> Including indigenous knowledge in school curriculums can make learning more relevant for students, especially in rural areas. It can help young people understand their environment and learn practical skills that can improve their lives.</li>
                </ul>
              </div>

              {/* Conclusion Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AwardIcon size={16} /> Conclusion
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Indigenous knowledge is a valuable resource that can contribute greatly to national development. While there are challenges such as lack of recognition, documentation, and adaptation to modern needs, there are also many opportunities. Sustainable development, economic benefits, better healthcare, and cultural preservation are just some of the advantages of using indigenous knowledge. To make the most of this knowledge, governments, researchers, and communities must work together to document, protect, and integrate it into national policies.
                </p>
              </div>
            </div>

            {/* SECTION 6: Socio-Cultural Advantages of Traditional Media */}
            <div
              ref={(el) => {
                sectionRefs.current['traditional-media'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Socio-Cultural Advantages of Traditional Media
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Traditional media includes communication methods that have been used for many years, such as newspapers, radio, television, storytelling, folk music, theatre, and community meetings. These forms of media play an important role in preserving culture, educating society, and strengthening social connections. Below are some of the socio-cultural advantages of traditional media.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Preservation of Culture and Heritage:</strong> Traditional media helps to keep cultural practices, languages, and traditions alive. Storytelling, folk songs, and traditional theatre pass knowledge from one generation to another. This ensures that people do not forget their history, values, and customs.</li>
                  <li><strong>Strengthening Community Bonds:</strong> Unlike modern digital media, traditional media often involves face-to-face interaction. Community meetings, storytelling, and theatre bring people together, creating strong social connections. This helps in building trust, unity, and cooperation among community members.</li>
                  <li><strong>Promoting Local Languages:</strong> Many traditional media forms, such as oral storytelling, radio broadcasts, and folk songs, are delivered in local languages. This encourages people to speak and value their mother tongues, preventing language loss and promoting cultural identity.</li>
                  <li><strong>Accessible to All:</strong> Traditional media is often more accessible than modern digital media, especially in rural areas where people may not have internet or smartphones. Radio, newspapers, and public performances reach people who may not be able to read or use technology, ensuring that information spreads widely.</li>
                  <li><strong>Encouraging Morality and Social Values:</strong> Through folktales, proverbs, and traditional plays, societies pass down moral lessons, ethical values, and good behavior. This helps to shape a responsible and disciplined society where people respect elders, practice honesty, and live in harmony.</li>
                  <li><strong>Promotion of Local Art and Talent:</strong> Traditional media supports local artists, musicians, and performers by giving them a platform to showcase their skills. This not only preserves cultural arts but also creates employment and inspires younger generations to engage in cultural activities.</li>
                  <li><strong>Reliable Source of Information:</strong> In many communities, elders, traditional leaders, and radio stations provide trusted information. Unlike social media, which can spread false news, traditional media often relies on verified sources, ensuring that people receive accurate and useful information.</li>
                  <li><strong>Encouraging Participation in Community Development:</strong> Traditional media methods, such as public meetings and community discussions, allow people to participate in decision-making. This ensures that everyone's voice is heard and that development plans reflect the needs of the local population.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 7: Strategies and Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies for Capturing and Disseminating Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous knowledge is valuable for preserving cultural heritage, supporting sustainable development, and improving local solutions to various challenges. To ensure that this knowledge is not lost, it must be properly captured, recorded, and shared with future generations. Below are some key strategies for capturing and disseminating indigenous knowledge.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Community Involvement and Participation:</strong> The best way to capture indigenous knowledge is by working closely with the community members who hold this knowledge. Elders, traditional leaders, and experts in indigenous practices should be actively involved in the process. Respect for their traditions and ways of sharing knowledge is important to ensure their willingness to contribute.</li>
                  <li><strong>Use of Technology:</strong> Modern technology can be used to capture and store indigenous knowledge effectively. Audio and video recordings, digital databases, and online platforms can help preserve oral traditions, traditional medicine, farming techniques, and other practices. This makes the knowledge more accessible to future generations.</li>
                  <li><strong>Documentation and Archiving:</strong> Indigenous knowledge should be documented in books, research papers, and archives. Schools, universities, and cultural institutions can store this information for academic purposes and community use. Well-organized records help in preserving and sharing the knowledge over time.</li>
                  <li><strong>Education and Awareness Programs:</strong> Teaching indigenous knowledge in schools and colleges ensures that younger generations learn and appreciate their cultural heritage. Governments and organizations can introduce courses on indigenous farming, traditional medicine, and environmental conservation in education systems.</li>
                  <li><strong>Integration with Modern Science:</strong> Combining indigenous knowledge with scientific research can improve the credibility and effectiveness of traditional practices. For example, traditional medicine can be studied scientifically to develop new treatments. This approach helps in promoting indigenous knowledge in development programs.</li>
                </ol>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Tools for Capturing/Recording Indigenous Knowledge</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Audio Recorders</strong> – Used to capture oral traditions, interviews with elders, and spoken knowledge.</li>
                  <li><strong>Video Cameras</strong> – Help in recording traditional practices, ceremonies, and skills for future reference.</li>
                  <li><strong>Notebooks and Journals</strong> – Useful for writing down stories, traditional recipes, or step-by-step guides for indigenous practices.</li>
                  <li><strong>Smartphones and Tablets</strong> – Can be used to take pictures, videos, and notes about indigenous knowledge.</li>
                  <li><strong>Databases and Digital Archives</strong> – Help store large amounts of indigenous knowledge in a structured format for easy access.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6">Methods Used in Recording Indigenous Knowledge</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Oral History Interviews:</strong> This method involves talking to elders and knowledge holders to document their experiences and expertise. Interviews can be recorded using audio or video devices for future reference.</li>
                  <li><strong>Storytelling and Narratives:</strong> Indigenous communities have strong storytelling traditions. Recording these stories helps preserve knowledge about history, culture, and values.</li>
                  <li><strong>Photography and Videography:</strong> Capturing pictures and videos of traditional practices, rituals, and skills helps preserve knowledge in a visual format, making it easier to learn and understand.</li>
                  <li><strong>Written Documentation:</strong> Books, articles, reports, and manuscripts can be used to write down indigenous knowledge in a formal and organized way. This is useful for education and research purposes.</li>
                  <li><strong>Digital and Online Platforms:</strong> Websites, social media, and online databases can be used to share indigenous knowledge with a wider audience. This ensures that more people can access and benefit from the information.</li>
                  <li><strong>Community Workshops and Conferences:</strong> Organizing events where knowledge holders share their skills with younger generations helps in keeping indigenous knowledge alive. These gatherings encourage discussions and practical demonstrations.</li>
                </ol>
              </div>
            </div>

            {/* SECTION 8: Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Procedures for Collecting, Recording, and Documenting Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Proper procedures must be followed when collecting, recording, and documenting indigenous knowledge to ensure accuracy, respect, and effectiveness. This involves careful preparation, community engagement, and correctly matching traditional concepts with modern documentation methods. Below are the key steps in the process.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Preparations',
                    icon: <Target size={16} />,
                    content:
                      'Before collecting indigenous knowledge, thorough planning is necessary. Researchers or knowledge collectors must first identify the specific knowledge they wish to document, whether it is traditional medicine, farming techniques, folklore, or governance systems. They should study the background of the community and its cultural practices to approach the process with respect and understanding. Necessary materials such as audio recorders, notebooks, cameras, and consent forms should be prepared in advance. It is also important to seek permission from relevant authorities, such as community leaders, to ensure that the process follows cultural protocols.',
                  },
                  {
                    title: '2. Entering the Community',
                    icon: <Users size={16} />,
                    content:
                      'Building trust with the community is crucial before starting the documentation process. Researchers should introduce themselves properly, explain their purpose, and assure the community that their knowledge will be respected and used responsibly. Engaging with elders, traditional leaders, and other knowledge holders in a respectful manner helps create a good relationship. It is important to follow cultural customs, such as greeting rituals or seeking formal approval from local leaders. Community members should be given an opportunity to ask questions and provide input on how their knowledge will be documented.',
                  },
                  {
                    title: '3. Matching Terms and Concepts',
                    icon: <Link size={16} />,
                    content:
                      'Indigenous knowledge often uses unique terms and concepts that may not have direct translations in modern languages. It is important to work closely with local speakers and experts to ensure that traditional ideas are accurately translated without losing meaning. Words related to spiritual beliefs, medicinal plants, or cultural practices may require special explanations. Using visual aids, demonstrations, and storytelling techniques can help capture the full meaning of indigenous knowledge. It is also important to document the knowledge in local languages to preserve authenticity while providing translations for wider understanding.',
                  },
                  {
                    title: '4. Conclusion',
                    icon: <AwardIcon size={16} />,
                    content:
                      'Collecting, recording, and documenting indigenous knowledge requires proper preparation, respectful engagement with communities, and careful handling of traditional concepts. By following these procedures, indigenous knowledge can be preserved and shared in ways that benefit both the community and future generations.',
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
                  <span>Importance Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Destruction Causes</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Tools & Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">11</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Capturing IK is vital for preserving culture, protecting valuable knowledge, and empowering communities. Destruction arises from colonialism, modernization, loss of elders, lack of documentation, and language loss. Repackaging faces challenges like authenticity and ethics but offers opportunities for wider sharing and economic development. Effective strategies include community involvement, technology, documentation, and integration with science. Always follow proper procedures: prepare, engage respectfully, and accurately translate concepts.
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
                <strong className="text-white">Capturing TK</strong> – Preserves cultural heritage, protects valuable knowledge, empowers communities, aids environmental and medical solutions, and supports intergenerational transmission.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Destruction & Problems</strong> – Colonialism, modernization, loss of elders, lack of documentation, language loss, and insufficient recognition all threaten IKS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Repackaging</strong> – Offers opportunities for wider access, cultural preservation, education, and economic benefits, but requires ethical handling and cultural sensitivity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">National Development</strong> – IKS contributes to sustainability, affordable solutions, cultural identity, healthcare, and education; integration requires overcoming recognition and legal hurdles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Strategies & Procedures</strong> – Community engagement, technology, documentation, and science integration are key; proper preparation and respect for local protocols are essential.
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
            Sidemann Academic Registry • Capturing, Documenting &amp; Preserving Indigenous Knowledge 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;