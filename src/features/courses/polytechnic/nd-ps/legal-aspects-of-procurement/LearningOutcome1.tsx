import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Layout,
  GlobeIcon,
  Shield,
  SettingsIcon,
  BookOpen,
  LayersIcon,
  FileText,
  Users,
  ClipboardCheck,
  AlertCircle,
  Scale,
  Gavel,
  Handshake,
  Building2,
  CheckCircle,
  PenTool,
  Trash2,
  Book,
  LightbulbIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Cpu,
  Link2,
  Zap,
  Globe,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon2,
  Factory,
  Target,
  TrendingUp,
  Activity,
  Database,
  Package,
  Warehouse,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'legal-system', label: 'Legal System' },
  { id: 'sources-of-law', label: 'Sources of Law' },
  { id: 'legislative-process', label: 'Legislative Process' },
  { id: 'court-hierarchy', label: 'Court Hierarchy' },
  { id: 'classes-of-law', label: 'Classes of Law' },
  { id: 'repeal-abrogation', label: 'Repeal & Abrogation' },
  { id: 'civil-criminal', label: 'Civil vs Criminal' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

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
        text: 'The Zimbabwean legal system is a hybrid system based on Roman-Dutch law, English common law, and customary law, reflecting the country\'s colonial history and indigenous traditions.',
      },
      {
        title: 'Pro Tip',
        text: 'When studying legal systems, always start with the Constitution as the supreme law. All other laws derive their authority from it.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 sources of law with "C3L3I": Constitution, Common, Customary, Cases (Judicial Precedent), Legislation (Acts), Literature (Authoritative Texts), International Law.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse repeal with abrogation. Repeal is an express act by Parliament; abrogation is an implied termination through long-standing disuse and contrary custom.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Zimbabwean legal system is a hybrid system based on Roman-Dutch law, English common law, and customary law, reflecting the country\'s colonial history and indigenous traditions.',
      },
      {
        title: 'Pro Tip',
        text: 'When studying legal systems, always start with the Constitution as the supreme law. All other laws derive their authority from it.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 7 sources of law with "C3L3I": Constitution, Common, Customary, Cases (Judicial Precedent), Legislation (Acts), Literature (Authoritative Texts), International Law.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse repeal with abrogation. Repeal is an express act by Parliament; abrogation is an implied termination through long-standing disuse and contrary custom.',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> LEGAL STUDIES
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Zimbabwean{' '}
            <span className="text-emerald-300 font-bold italic">
              Legal System
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the Zimbabwean legal system, sources of law, legislative process, court hierarchy, classes of law, and the differences between civil and criminal law.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Legal System
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Gavel size={14} className="inline mr-1" /> Sources of Law
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Legislature
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, Constitution, repeal..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
            {/* SECTION 1: Zimbabwean Legal System */}
            <div
              ref={(el) => {
                sectionRefs.current['legal-system'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Zimbabwean Legal System
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine Zimbabwe's legal system as a set of rules and organizations designed to keep things fair and orderly. It is like a referee and a rulebook for society. If people disagree or break the rules (laws), this system helps resolve the problem in a just way. It is based on a mix of different influences (like historical legal traditions and Zimbabwean culture), but the Constitution is the ultimate source of the law.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">The system includes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>The Constitution:</strong> The top law of the land. All other laws must agree with it. It protects people's rights.</li>
                  <li><strong>The Courts:</strong> Different levels of courts hear different types of cases. From small local disputes to big constitutional issues, there is a court for it.</li>
                  <li><strong>Judges and Magistrates:</strong> People who preside over the courts and make decisions based on the law.</li>
                  <li><strong>Lawyers:</strong> People who help others understand the law and represent them in court.</li>
                  <li><strong>The Police:</strong> Enforce the law, investigate crimes, and bring offenders to court.</li>
                  <li><strong>Legislation (Acts of Parliament):</strong> Laws that are created by the Parliament of Zimbabwe.</li>
                  <li><strong>Common Law:</strong> Laws that come from customs, judicial precedents (previous court rulings), and legal principles that have evolved over time, primarily based on Roman-Dutch law.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <BookOpen size={16} /> 1. The Constitution: The Supreme Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The Constitution of Zimbabwe is the bedrock upon which the entire legal system rests. It is the supreme law, meaning no other law can contradict its provisions. It establishes the structure of the government, defines the powers of its different branches (the executive, the legislature, and the judiciary), and, most importantly, guarantees fundamental rights and freedoms to all citizens. These rights, enshrined in the Bill of Rights, include freedom of speech, freedom of assembly, freedom of religion, the right to a fair trial, and protection from discrimination. The Constitution also sets out the procedures for amending itself, which are intentionally stringent to ensure that changes are made with broad consensus and consideration, safeguarding the foundational principles of the nation. Any law or government action that violates the Constitution can be challenged in the courts and declared unconstitutional. This principle of constitutional supremacy ensures that the government operates within the boundaries defined by the Constitution and protects the rights of the people. It is important to note that recently Zimbabwe has amended the constitution several times to adapt with modern times.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Building2 size={16} /> 2. The Court System: A Hierarchy of Justice
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Zimbabwe's court system is organized in a hierarchical structure, like a pyramid, with different levels of courts handling different types of cases. At the base are the Magistrates Courts, which are the first point of contact for most legal matters. These courts deal with a wide range of civil and criminal cases, including minor offenses, traffic violations, and small claims. Above the Magistrates Courts are the High Court, which has unlimited original jurisdiction, meaning it can hear any case that is not specifically assigned to another court. The High Court also hears appeals from the Magistrates Courts. The Labour Court is a specialized court that deals with labour disputes. The Administrative Court deals with administrative issues by the government. At the apex of the judicial system is the Supreme Court, which is the final court of appeal for all cases in Zimbabwe, except for constitutional matters. Finally, the Constitutional Court handles all cases regarding the constitution of Zimbabwe. The Supreme Court's decisions set precedents that must be followed by all lower courts. This hierarchical structure ensures that cases can be reviewed by higher courts if necessary, providing a mechanism for correcting errors and ensuring consistency in the application of the law.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <FileText size={16} /> 3. Legislation (Acts of Parliament)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Parliament, comprising the Senate and the National Assembly, is responsible for creating laws (called Acts of Parliament) that govern various aspects of life in Zimbabwe. This legislative process begins with a bill, which is a proposed law. The bill is debated and amended in Parliament, and if it is passed by both houses, it is sent to the President for assent. Once the President signs the bill into law, it becomes an Act of Parliament and has the force of law throughout the country. These Acts of Parliament cover a wide range of subjects, including criminal law, civil law, commercial law, and environmental law. They provide the specific rules and regulations that govern conduct and transactions within Zimbabwean society. Parliament also has the power to amend or repeal existing laws, ensuring that the legal framework can adapt to changing social and economic conditions. The principle of parliamentary sovereignty means that Parliament has the ultimate authority to make laws, subject only to the Constitution.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Book size={16} /> 4. Common Law: Tradition and Precedent
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Zimbabwe's legal system is based on a mixed system, meaning it combines elements of both codified law (legislation) and common law. Common law is a body of unwritten laws that are derived from custom, tradition, and judicial precedents. It is primarily based on Roman-Dutch law, which was introduced to Zimbabwe during the colonial period. Common law principles are developed over time through the decisions of courts in specific cases. When a court makes a ruling on a particular issue, that ruling becomes a precedent that must be followed by other courts in similar cases. This system of precedent ensures consistency and predictability in the application of the law. Common law principles can supplement and clarify statutory law (legislation), providing guidance in situations where the law is unclear or incomplete. However, statutory law always takes precedence over common law, meaning that if there is a conflict between the two, the statutory law prevails.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Users size={16} /> 5. Judges, Magistrates, and Legal Professionals
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The integrity and effectiveness of the legal system depend on the competence and impartiality of judges, magistrates, and other legal professionals. Judges preside over the High Court, Supreme Court, and Constitutional Court, while Magistrates preside over the Magistrates Courts. Judges and magistrates are responsible for hearing cases, interpreting the law, and making decisions based on the evidence presented. They must be independent and impartial, free from political influence or personal bias. Lawyers play a crucial role in the legal system by representing clients in court, providing legal advice, and advocating for their clients' rights. They are trained to understand the law and to present arguments effectively on behalf of their clients. Prosecutors are lawyers who represent the state in criminal cases, responsible for presenting evidence to prove the guilt of the accused. The legal profession is regulated by the Law Society of Zimbabwe, which sets standards of conduct and provides training and support to lawyers. Ensuring the independence and integrity of the judiciary and the legal profession is essential for maintaining the rule of law and ensuring access to justice for all citizens.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Shield size={16} /> 6. The Police and Law Enforcement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The Zimbabwe Republic Police (ZRP) is the primary law enforcement agency responsible for maintaining law and order throughout the country. The police are responsible for investigating crimes, arresting offenders, and bringing them before the courts. They also play a role in preventing crime, maintaining public safety, and enforcing traffic laws. The police operate under the authority of the Minister of Home Affairs and are accountable to the public. The police have a duty to act impartially and to respect the rights of all citizens. They must follow proper procedures when conducting investigations and making arrests, and they must not use excessive force or abuse their power. There are often complaints of police brutality and corruption in Zimbabwe so in recent years the government has introduced strict rules to reduce those statistics.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: Sources of Law in Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['sources-of-law'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Sources of Law in Zimbabwe
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The "sources of law" are the origins from which legal rules are derived. They are the authorities that give a legal rule its binding force and validity. In other words, they tell us why a particular rule is considered "law" and where it comes from. Identifying sources of law is essential for legal professionals, scholars, and anyone seeking to understand the legal basis for rights and obligations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <BookOpen size={16} /> 1. The Constitution
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> As we have already established, the Constitution is the supreme source of law in Zimbabwe. It is the foundational document that defines the structure of the government, protects fundamental rights and freedoms, and sets the limits on governmental power. All other laws must conform to the Constitution.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> If any law conflicts with the Constitution, it is considered invalid and unenforceable. This principle of constitutional supremacy ensures that the government operates within the boundaries defined by the Constitution and protects the rights of the people. The Constitution is, therefore, the ultimate source of legitimacy for all other laws in Zimbabwe. Any challenges to a law's validity will ultimately be judged against the Constitution.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <FileText size={16} /> 2. Legislation (Acts of Parliament)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> Laws passed by the Parliament of Zimbabwe (the Senate and the National Assembly) are a primary source of law. These laws are called Acts of Parliament (or statutes). Parliament has the power to create, amend, and repeal laws, subject to the Constitution.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Acts of Parliament cover a wide range of subjects, including criminal law, civil law, commercial law, and environmental law. These laws provide the specific rules and regulations that govern conduct and transactions within Zimbabwean society. When a new Act is passed, it becomes part of the body of laws that citizens and the government must abide by. The power of Parliament to legislate is a fundamental aspect of the separation of powers within the Zimbabwean government.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Book size={16} /> 3. Common Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> As mentioned before, Zimbabwe's legal system incorporates common law, primarily based on Roman-Dutch law. Common law is a body of unwritten laws that are derived from custom, tradition, and judicial precedents (previous court decisions).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> The doctrine of stare decisis ("to stand by things decided") is central to common law. This means that courts are bound to follow precedents set by higher courts in similar cases. This system of precedent ensures consistency and predictability in the application of the law. Common law principles can fill gaps in statutory law, providing guidance in situations where the law is unclear or incomplete. However, statutory law generally takes precedence over common law when there is a conflict.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Users size={16} /> 4. Customary Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> Customary law refers to the traditional rules and practices of indigenous communities in Zimbabwe. It is generally unwritten and passed down orally through generations.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> The Constitution recognizes customary law as a source of law, particularly in matters related to personal and family law, such as marriage, divorce, inheritance, and child custody, provided it is consistent with the Constitution and any other laws. The application of customary law is often subject to certain limitations and safeguards to ensure that it does not violate fundamental rights or discriminate against any individual. The Customary Law and Primary Courts Act [Chapter 7:05] provides for the application of customary law in certain civil cases.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> 5. Judicial Precedent (Case Law)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> Decisions made by the superior courts in Zimbabwe (High Court, Supreme Court, and Constitutional Court) serve as binding precedents for lower courts.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is the application of stare decisis that we talked about with common law. These precedents become part of the body of law and guide future decisions in similar cases. The more superior the court that makes the ruling, the greater the authority of that precedent. This system contributes to the consistency and predictability of the law. Judges and lawyers must carefully research previous court decisions to understand how the law has been interpreted and applied in the past.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <BookOpen size={16} /> 6. Authoritative Texts and Legal Scholarship
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> While not formally binding, legal textbooks, scholarly articles, and the writings of prominent legal experts can be persuasive sources of law.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Courts may refer to these materials to gain a better understanding of legal principles and to support their reasoning in a particular case. These texts can provide valuable insights into the historical development of the law, different interpretations of legal rules, and potential solutions to legal problems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> 7. International Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> International treaties and conventions that Zimbabwe has ratified become part of Zimbabwean law.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> These treaties create obligations for Zimbabwe under international law, and Zimbabwean courts may consider them when interpreting domestic law. Certain international legal principles, such as customary international law, may also be recognized as part of Zimbabwean law.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: The Legislative Process in Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['legislative-process'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Legislative Process in Zimbabwe
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The legislative process is the step-by-step procedure by which a bill becomes an Act of Parliament (a law). It is the journey a proposed law takes from an idea to an enforceable rule.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <LightbulbIcon size={16} /> 1. Initiation of a Bill
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The process typically begins with a need for a new law or an amendment to an existing one. This need can come from various sources: the government (the executive branch), individual Members of Parliament (MPs), or even public suggestions. The relevant government ministry usually drafts the initial bill.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is where the idea for a law is born. The government identifies a problem that needs a legal solution, or an MP proposes a change to improve existing legislation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Hash size={16} /> 2. First Reading
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The bill is formally introduced in the National Assembly (one of the two houses of Parliament). The title of the bill is read out loud, and copies are distributed to the members of parliament (MPs). There is no debate at this stage.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is essentially a formality to notify the National Assembly that a new bill has been proposed.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={16} /> 3. Second Reading
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    This is a crucial stage where the general principles of the bill are debated by the MPs. The responsible minister (or the MP who introduced the bill) explains the bill's purpose, objectives, and intended impact. MPs then can express their views, raise concerns, and propose amendments.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is when the core ideas of the bill are scrutinized and debated. MPs assess whether the bill is necessary, well-drafted, and likely to achieve its intended goals. If the National Assembly approves the bill in principle, it moves to the next stage.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <ClipboardCheck size={16} /> 4. Committee Stage
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The bill is referred to a relevant Parliamentary committee for a more detailed examination. The committee members, who have expertise in the subject matter of the bill, review each clause (section) of the bill carefully. They can propose amendments to improve the bill's clarity, effectiveness, or constitutionality.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is where the bill is refined and improved. The committee stage allows for a more focused and technical review of the bill's provisions, addressing any potential problems or unintended consequences.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <CheckCircle size={16} /> 5. Third Reading
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The bill, as amended by the committee (if any), is presented to the National Assembly for a final debate. The MPs vote on whether to pass the bill in its amended form.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This is the final opportunity for the National Assembly to consider the bill. If the bill passes the third reading in the National Assembly, it proceeds to the Senate.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Building2 size={16} /> 6. Senate Process
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The bill goes through a similar process in the Senate: First Reading, Second Reading (debate on principles), Committee Stage (detailed examination), and Third Reading (final vote). The Senate can approve the bill as is, amend it, or reject it.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> The Senate provides a second chamber for reviewing legislation, ensuring that it is carefully considered and reflects the interests of different regions and groups within Zimbabwe.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Handshake size={16} /> 7. Resolution of Differences (If Any)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    If the Senate amends the bill, it must be returned to the National Assembly for approval of the amendments. If the National Assembly does not agree with the Senate's amendments, a process of negotiation and compromise is initiated to resolve the differences. This may involve a joint committee of members from both houses.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This step ensures that both houses of Parliament agree on the final version of the bill before it becomes law.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <PenTool size={16} /> 8. Presidential Assent
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once the bill has been passed by both the National Assembly and the Senate in the same form, it is sent to the President of Zimbabwe for assent (approval). The President has the power to sign the bill into law, which officially makes it an Act of Parliament.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> The President's assent is the final step in the legislative process. Once the President signs the bill, it becomes legally binding and enforceable throughout Zimbabwe.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <FileText size={16} /> 9. Gazetting and Commencement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The Act of Parliament is then published in the Government Gazette (an official publication), which makes it accessible to the public. The Act typically specifies when it will come into effect (commence).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> This ensures that the public is aware of the new law and its provisions. The law comes into force on the date specified in the Act or, if no date is specified, on the date of publication in the Gazette.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Hierarchy of Courts in Zimbabwe */}
            <div
              ref={(el) => {
                sectionRefs.current['court-hierarchy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Hierarchy of Courts in Zimbabwe
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Here is a simple representation of the court hierarchy, from highest to lowest:
                  </p>
</div>

              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-gray-100'} my-4 text-center font-mono text-sm border border-slate-200 dark:border-slate-700`}>
                <div className="py-2 border-b-2 border-orange-500 font-bold text-orange-600 dark:text-orange-400">Constitutional Court</div>
                <div className="py-1 text-slate-500 dark:text-slate-400">↑</div>
                <div className="py-2 border-b-2 border-orange-500 font-bold text-orange-600 dark:text-orange-400">Supreme Court</div>
                <div className="py-1 text-slate-500 dark:text-slate-400">↑</div>
                <div className="py-2 border-b-2 border-orange-500 font-bold text-orange-600 dark:text-orange-400">High Court</div>
                <div className="py-1 text-slate-500 dark:text-slate-400">↑</div>
                <div className="py-2 border-b-2 border-orange-500 font-bold text-orange-600 dark:text-orange-400">Administrative Court ───── Labour Court</div>
                <div className="py-1 text-slate-500 dark:text-slate-400">↑</div>
                <div className="py-2 font-bold text-orange-600 dark:text-orange-400">Magistrates Courts</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Building2 size={16} /> Explanation of the Court Hierarchy
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Constitutional Court:</strong> The highest court in Zimbabwe for constitutional matters. It has exclusive jurisdiction to hear and determine any question relating to the interpretation, protection, and enforcement of the Constitution. Its decisions are final and binding on all other courts.</li>
                  <li><strong>Supreme Court:</strong> The final court of appeal for all cases in Zimbabwe, except for constitutional matters (which go to the Constitutional Court). The Supreme Court's decisions set precedents that must be followed by all lower courts.</li>
                  <li><strong>High Court:</strong> Has unlimited original jurisdiction, meaning it can hear any case that is not specifically assigned to another court. It also hears appeals from the Magistrates Courts, Labour Court, and Administrative Court.</li>
                  <li><strong>Labour Court:</strong> A specialized court that deals with labour disputes, such as unfair dismissal, wage disputes, and collective bargaining issues.</li>
                  <li><strong>Administrative Court:</strong> A specialized court that deals with administrative issues involving decisions by government officials or bodies.</li>
                  <li><strong>Magistrates Courts:</strong> The first point of contact for most legal matters. These courts deal with a wide range of civil and criminal cases, including minor offenses, traffic violations, and small claims.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Classes of Law */}
            <div
              ref={(el) => {
                sectionRefs.current['classes-of-law'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Classes of Law
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of the law as a big toolbox. Inside, you will find different types of tools (laws) for different jobs (situations). Some tools are used to deal with crimes, others with agreements between people, and still others with how the government operates. These different types of law are called "classes" of law.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <LayersIcon size={16} /> 1. Public Law vs. Private Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> This is one of the broadest classifications. Public law concerns the relationship between the government and its citizens. It deals with matters that affect society. Private law, on the other hand, concerns the relationships between private individuals and organizations. It focuses on matters that primarily affect individuals or specific groups.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Public law includes areas like constitutional law (how the government is structured and operates), criminal law (prohibiting and punishing offenses against society), and administrative law (governing the actions of government agencies). Private law includes areas like contract law (agreements between parties), property law (ownership and rights to property), and tort law (civil wrongs that cause harm to others).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Gavel size={16} /> 2. Criminal Law vs. Civil Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> This is a very important distinction. Criminal law deals with offenses against the state or society. The government prosecutes individuals accused of committing crimes. The aim is to punish offenders and deter others from committing similar acts. Civil law deals with disputes between private individuals or organizations. The purpose is to resolve disputes and compensate the injured party for any losses or damages suffered.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> In criminal cases, the burden of proof is "beyond a reasonable doubt," meaning the prosecution must prove the defendant's guilt to a very high degree of certainty. If found guilty, the defendant may face imprisonment, fines, or other penalties. In civil cases, the burden of proof is typically "on the balance of probabilities" (or "preponderance of the evidence"), meaning the plaintiff (the person bringing the lawsuit) must prove that their version of events is more likely than not. If the plaintiff wins, they may be awarded damages (money) to compensate for their losses.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Book size={16} /> 3. Common Law vs. Statute Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> We've discussed this before, but it is important to reiterate in this context. Statute law (also known as legislation or Acts of Parliament) consists of laws that are enacted by a legislative body (like the Parliament of Zimbabwe). Common law is based on customs, traditions, and judicial precedents (previous court decisions).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Statute law is generally written and codified, providing specific rules and regulations. Common law is more flexible and evolves over time through court decisions. As we have discussed, statutory law generally takes precedence over common law when there is a conflict.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <SettingsIcon size={16} /> 4. Substantive Law vs. Procedural Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> Substantive law defines rights and obligations. It sets out the rules that govern what people can and cannot do. Procedural law establishes the procedures and rules that must be followed in enforcing those rights and obligations. It governs how legal cases are initiated, conducted, and resolved.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> For example, criminal law defines what constitutes theft (substantive law), while the rules of evidence and the process for conducting a criminal trial are governed by procedural law. Civil procedure governs how lawsuits are filed, how evidence is presented, and how judgments are enforced.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <GlobeIcon size={16} /> 5. International Law vs. Domestic Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> International law governs the relationships between states (countries) and international organizations. It consists of treaties, customs, and general principles of law recognized by the international community. Domestic law is the law of a particular country (in this case, Zimbabwe).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> International law can influence domestic law, particularly when Zimbabwe has ratified international treaties. In some cases, international legal principles may be directly incorporated into Zimbabwean law. However, domestic law generally takes precedence over international law within Zimbabwe's borders.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Users size={16} /> 6. Customary Law vs. General Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Explanation:</strong> Customary Law is specific to indigenous cultures or communities and is derived from traditional practice. General Law applies to everyone in a country or region.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> The importance of this difference is that for a particular type of case, customary law will apply to people in that specific culture, e.g., a divorce based on customary law would be different to a civil court divorce.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Repeal and Abrogation of Laws */}
            <div
              ref={(el) => {
                sectionRefs.current['repeal-abrogation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Repeal and Abrogation of Laws
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These terms refer to how laws cease to be in effect. Imagine a law is like a rule in a game. "Repealing" a law is like saying, "Okay, that rule is gone, we're not using it anymore." "Abrogating" a law is like saying, "That rule has been ignored for so long, it's basically as if it doesn't exist anymore."
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Trash2 size={16} /> Repeal
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> A repeal is the express act of revoking or annulling a law by the legislative body (Parliament). This means Parliament specifically passes a new law that states that the old law is no longer in force.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>How it Happens:</strong> Parliament passes a new Act that explicitly states that a previous Act (or specific sections of it) is repealed.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Example:</strong> Suppose Parliament passes a new Act called the "Traffic Amendment Act." This Act might include a section that says, "Section 25 of the Road Traffic Act [Chapter 13:17] is hereby repealed." This means that Section 25 of the Road Traffic Act is no longer law.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Repeal is a clear and definitive way to remove a law from the statute books. It provides certainty and avoids ambiguity about whether the law is still in effect.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} /> Abrogation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> Abrogation is the implied termination of a law due to long-standing disuse or contrary custom. This means that a law, although still technically on the books, has been consistently ignored or violated for a long period of time, to the point where it is no longer considered to be in force.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>How it Happens:</strong> Abrogation is not a formal process. It occurs gradually over time as a law is consistently disregarded by the public, law enforcement, and the courts.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Requirements:</strong> For abrogation to occur, several conditions must generally be met:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Long-standing Disuse:</strong> The law must have been consistently ignored for a significant period.</li>
                    <li><strong>Contrary Custom:</strong> A new custom or practice must have developed that is inconsistent with the law.</li>
                    <li><strong>General Acquiescence:</strong> The public, law enforcement, and the courts must generally accept the new custom or practice.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Example:</strong> It is difficult to give a precise Zimbabwean example because abrogation is often a matter of legal debate. However, imagine a very old law requiring all farmers to use a specific type of plough that is no longer manufactured or practical. If no one has used that type of plough for decades, and everyone uses modern equipment, a court might eventually rule that the law has been abrogated by disuse and contrary custom.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Implication:</strong> Abrogation is a less certain and more controversial way for a law to cease to be in effect. It requires strong evidence of long-standing disuse and contrary custom, and it is ultimately up to the courts to decide whether a law has been abrogated.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Layout size={16} /> Key Differences between Repeal and Abrogation
                </h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Repeal</th>
                        <th className="border p-2 text-left font-bold">Abrogation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Method', 'Express act by Parliament', 'Implied termination due to disuse and custom'],
                        ['Certainty', 'Clear and definitive', 'Less certain and subject to judicial interpretation'],
                        ['Process', 'Formal legislative process', 'Informal, gradual process'],
                        ['Evidence', 'New Act of Parliament', 'Evidence of long-standing disuse and contrary custom'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION 7: Civil Law and Criminal Law */}
            <div
              ref={(el) => {
                sectionRefs.current['civil-criminal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Civil Law and Criminal Law
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    We have touched on this before, but let us reinforce it with more details.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Criminal Law:</strong> Deals with things people do wrong that are considered harmful to everyone. The government tries to punish those people.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <strong>Civil Law:</strong> Deals with disagreements between people or organizations. The goal is to settle the disagreement fairly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Gavel size={16} /> Criminal Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> Criminal law defines offenses against the state or society. It prohibits certain conduct and prescribes penalties for those who violate these prohibitions.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Parties Involved:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>The State (Prosecution):</strong> Represents the government and brings the case against the accused.</li>
                    <li><strong>The Accused (Defendant):</strong> The person charged with committing the crime.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Purpose:</strong> To punish offenders, deter others from committing similar crimes, protect society, and rehabilitate offenders.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Examples of Crimes:</strong> Theft, assault, murder, fraud, drug trafficking.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Burden of Proof:</strong> "Beyond a reasonable doubt." The prosecution must prove the accused's guilt to a very high degree of certainty. If there is any reasonable doubt in the minds of the jurors (or the judge in a trial without a jury), the accused must be acquitted.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Penalties:</strong> Imprisonment, fines, community service, probation, the death penalty (in some cases).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Scale size={16} /> Civil Law
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Definition:</strong> Civil law deals with disputes between private individuals or organizations. It concerns the rights and obligations of individuals in their relationships with each other.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Parties Involved:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>The Plaintiff:</strong> The person or organization who brings the lawsuit.</li>
                    <li><strong>The Defendant:</strong> The person or organization against whom the lawsuit is brought.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Purpose:</strong> To resolve disputes, compensate the injured party for losses or damages, and restore the injured party to their original position (as far as possible).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Examples of Civil Cases:</strong> Breach of contract, negligence (causing injury due to carelessness), defamation (damaging someone's reputation), property disputes.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Burden of Proof:</strong> "On the balance of probabilities" (or "preponderance of the evidence"). The plaintiff must prove that their version of events is more likely than not.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Remedies (What the Plaintiff Can Get if They Win):</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Damages:</strong> Monetary compensation to cover the plaintiff's losses (e.g., medical expenses, lost wages, property damage).</li>
                    <li><strong>Specific Performance:</strong> A court order requiring the defendant to perform their obligations under a contract.</li>
                    <li><strong>Injunction:</strong> A court order prohibiting the defendant from doing something (e.g., stopping a construction project that violates property rights).</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <Layout size={16} /> Key Differences between Civil Law and Criminal Law
                </h3>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Criminal Law</th>
                        <th className="border p-2 text-left font-bold">Civil Law</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Nature of the Case', 'Offense against society', 'Dispute between private parties'],
                        ['Parties Involved', 'State vs. Accused', 'Plaintiff vs. Defendant'],
                        ['Purpose', 'Punishment, deterrence, protection', 'Compensation, resolution of disputes'],
                        ['Burden of Proof', 'Beyond a reasonable doubt', 'On the balance of probabilities'],
                        ['Penalties/Remedies', 'Imprisonment, fines, etc.', 'Damages, specific performance, injunctions'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Legal Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Sources of Law</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Legislative Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Classes of Law</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The Zimbabwean legal system is a rich blend of constitutional, statutory, common, and customary law. Understanding the sources of law, the legislative process, the court hierarchy, and the distinctions between classes of law is fundamental. The difference between civil and criminal law is crucial—criminal law deals with offenses against society, while civil law resolves private disputes. Master these concepts to build a solid foundation in legal studies.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Zimbabwean Legal System</strong> – built on the Constitution, courts, judges, lawyers, police, legislation, and common law. The Constitution is supreme.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sources of Law</strong> – Constitution, Legislation, Common Law, Customary Law, Judicial Precedent, Authoritative Texts, and International Law.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Legislative Process</strong> – 9 steps: Initiation → First Reading → Second Reading → Committee Stage → Third Reading → Senate Process → Resolution of Differences → Presidential Assent → Gazetting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Court Hierarchy</strong> – Constitutional Court → Supreme Court → High Court → Administrative/Labour Courts → Magistrates Courts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Civil vs Criminal</strong> – Criminal: state vs accused, beyond reasonable doubt, punishment. Civil: plaintiff vs defendant, balance of probabilities, compensation.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Legal Studies – Zimbabwean Legal System 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;