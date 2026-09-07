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
  Cloud,
  Database,
  BarChart,
  PieChart,
  Send,
  Calculator,
  FunctionSquare,
  Grid3x3,
  ArrowRight,
  Info,
  Lightbulb,
  Wrench,
  Thermometer,
  Scale,
  Flame,
  Activity,
  Cpu,
  Map,
  Box,
  TrendingUp,
  Battery,
  CircuitBoard,
  Waves,
  Sliders,
  Eye,
  Ear,
  Radio,
  Cctv,
  ToggleLeft,
  Fuel,
  ZapOff,
  ShieldAlert,
  Microscope,
  Scan,
  Gauge,
  TestTube,
  AlertTriangle,
  ClipboardIcon,
} from 'lucide-react';

// ─── SECTION TABS ────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'security-assessment', label: 'Security Assessment' },
  { id: 'steps-assessment', label: 'Steps in Assessment' },
  { id: 'breach-response', label: 'Breach Response' },
  { id: 'info-security', label: 'Information Security' },
  { id: 'countermeasures', label: 'Security Countermeasures' },
  { id: 'emergency-manual', label: 'Emergency Manual' },
  { id: 'developing-manual', label: 'Developing Manual' },
  { id: 'evaluating-manual', label: 'Evaluating Manual' },
  { id: 'digital-security', label: 'Digital Data Security' },
  { id: 'trends', label: 'Security Trends' },
  { id: 'strategies', label: 'Security Strategies' },
  { id: 'legislation', label: 'Legislation & Charters' },
  { id: 'ethics', label: 'Ethical Issues' },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
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
        text: 'The "Zero Trust" security model, first introduced by John Kindervag in 2010, operates on the principle of "never trust, always verify" — no user or device is trusted by default.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a security assessment, always start with a thorough risk assessment to identify the most critical assets and the most likely threats before developing countermeasures.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of information security: "C‑I‑A" – Confidentiality, Integrity, and Availability. Every security measure supports one or more of these principles.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus heavily on digital security while neglecting physical security and procedural controls — a comprehensive security strategy requires all three layers.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The "Zero Trust" security model, first introduced by John Kindervag in 2010, operates on the principle of "never trust, always verify" — no user or device is trusted by default.',
      },
      {
        title: 'Pro Tip',
        text: 'When conducting a security assessment, always start with a thorough risk assessment to identify the most critical assets and the most likely threats before developing countermeasures.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of information security: "C‑I‑A" – Confidentiality, Integrity, and Availability. Every security measure supports one or more of these principles.',
      },
      {
        title: 'Common Mistake',
        text: 'Many organizations focus heavily on digital security while neglecting physical security and procedural controls — a comprehensive security strategy requires all three layers.',
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
            <Shield size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Security Assessment —{' '}
            <span className="text-rose-300 font-bold italic">
              &amp; Data Protection
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to security assessments, breach response, information security,
            emergency manuals, data security, and ethical issues.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Assessment
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Protection
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AlertTriangle size={14} className="inline mr-1" /> Breach Response
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
                placeholder="Search for security, breach, encryption, compliance..."
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
            {/* SECTION 1: Conducting a Security Assessment */}
            <div
              ref={(el) => {
                sectionRefs.current['security-assessment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conducting a Security Assessment: A Cornerstone of Effective Records and Information Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In today's interconnected and data-driven environment, conducting a thorough security
                    assessment is not merely a best practice, but an absolute necessity for any organization
                    managing valuable records and information. This process provides a structured, systematic
                    approach to identifying vulnerabilities, mitigating risks, and ultimately, ensuring the
                    robust protection of critical assets. It is a proactive measure that goes beyond reactive
                    responses to security incidents, fostering a culture of security consciousness within the
                    organization.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Identification of Vulnerabilities: Proactive Defense Through Discovery',
                    icon: <Search size={16} />,
                    content: (
                      <p>
                        A security assessment serves as a meticulous examination of an organization's security
                        posture, systematically identifying weaknesses across physical, digital, and procedural
                        domains. This comprehensive approach allows organizations to proactively address
                        potential threats before they can be exploited by malicious actors or lead to accidental
                        data loss. For example, a physical security assessment might reveal inadequate access
                        controls to sensitive storage areas, while a digital assessment could uncover
                        vulnerabilities in network configurations or software applications. By identifying these
                        weaknesses, organizations can strengthen their defenses and prevent potential breaches.
                        This is the first step in creating a security plan that is based on the reality of the
                        security risks that the organization faces.
                      </p>
                    ),
                  },
                  {
                    title: 'Risk Mitigation: Reducing the Likelihood and Impact of Security Threats',
                    icon: <Target size={16} />,
                    content: (
                      <p>
                        Once vulnerabilities are identified, organizations can implement appropriate security
                        measures to mitigate the associated risks. This proactive approach significantly reduces
                        the likelihood of security breaches, data loss, and unauthorized access. For instance,
                        if a security assessment reveals a lack of strong passwords, organizations can implement
                        password policies and user training to enhance security. By addressing vulnerabilities
                        in a timely manner, organizations can minimize the potential impact of security
                        incidents, protecting their valuable assets and maintaining operational continuity.
                        This includes implementing things like firewalls, encryption, and access control lists.
                      </p>
                    ),
                  },
                  {
                    title: 'Protection of Valuable Assets: Safeguarding Information, Reputation, and Finances',
                    icon: <Award size={16} />,
                    content: (
                      <p>
                        Security assessments play a crucial role in safeguarding valuable records, including
                        sensitive data, historical documents, and intellectual property. These assets are
                        essential for an organization's operations, reputation, and financial stability. A
                        security breach can lead to significant financial losses, reputational damage, and
                        legal liabilities. By proactively identifying and mitigating security risks,
                        organizations can protect their assets and prevent potential harm. For example, the
                        loss of sensitive customer data can lead to legal action and a loss of public trust.
                        Protecting these assets is a key element of good governance.
                      </p>
                    ),
                  },
                  {
                    title: 'Compliance with Regulations: Adhering to Legal and Industry Standards',
                    icon: <ClipboardIcon size={16} />,
                    content: (
                      <p>
                        Many industries are subject to regulations that require organizations to implement
                        specific security measures. Security assessments help ensure compliance with these
                        regulations, avoiding legal penalties and maintaining regulatory compliance. For
                        instance, organizations handling financial data must comply with regulations such as
                        PCI DSS, while healthcare organizations must comply with HIPAA. By conducting regular
                        security assessments, organizations can demonstrate their commitment to regulatory
                        compliance and avoid costly fines or legal action.
                      </p>
                    ),
                  },
                  {
                    title: 'Enhanced Security Awareness: Fostering a Culture of Security Consciousness',
                    icon: <Users size={16} />,
                    content: (
                      <p>
                        Conducting a security assessment raises awareness among staff about security risks and
                        best practices. This promotes a culture of security consciousness throughout the
                        organization, where employees are actively engaged in protecting information assets.
                        Training sessions, workshops, and awareness campaigns can reinforce security policies
                        and procedures, ensuring that all staff members understand their roles and
                        responsibilities in maintaining security. This is a vital part of a security plan, as
                        even the best technical security can be undone by human error.
                      </p>
                    ),
                  },
                  {
                    title: 'Improved Security Planning: Developing Comprehensive Security Strategies',
                    icon: <Settings size={16} />,
                    content: (
                      <p>
                        The findings of a security assessment provide valuable insights for developing and
                        improving security policies and procedures. This allows for the creation of a
                        comprehensive security plan that addresses specific vulnerabilities and risks. By
                        basing security strategies on data-driven insights, organizations can ensure that
                        their security measures are effective and aligned with their business objectives.
                        This includes things like incident response plans, and disaster recovery plans.
                      </p>
                    ),
                  },
                  {
                    title: 'Prevention of Security Breaches: Minimizing the Risk of Data Leaks and Cyberattacks',
                    icon: <Shield size={16} />,
                    content: (
                      <p>
                        By identifying and addressing vulnerabilities, security assessments help prevent
                        security breaches, such as data leaks, unauthorized access, and cyberattacks. This
                        proactive approach minimizes the risk of costly and disruptive security incidents.
                        This includes things like regular software updates, and penetration testing.
                      </p>
                    ),
                  },
                  {
                    title: 'Business Continuity: Ensuring Operational Resilience',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <p>
                        A comprehensive security assessment that includes disaster recovery and business
                        continuity planning helps to ensure that organizations can continue to operate in the
                        event of a security breach or natural disaster. This involves developing backup
                        systems, creating disaster recovery plans, and establishing communication protocols.
                        By prioritizing business continuity, organizations can minimize downtime and maintain
                        essential services.
                      </p>
                    ),
                  },
                  {
                    title: 'Cost Efficiency: Investing in Proactive Security Measures',
                    icon: <DollarSign size={16} />,
                    content: (
                      <p>
                        Proactive security measures, identified through assessments, can be more cost-effective
                        than dealing with the consequences of a security breach. The costs associated with data
                        breaches, such as legal fees, fines, and reputational damage, can be substantial. By
                        investing in proactive security measures, organizations can minimize these costs and
                        protect their bottom line.
                      </p>
                    ),
                  },
                  {
                    title: 'Maintaining Public Trust: Building Confidence in Information Security',
                    icon: <Handshake size={16} />,
                    content: (
                      <p>
                        For organizations that handle sensitive information, conducting and acting on the
                        findings of a security assessment helps to maintain public trust. This is especially
                        important for organizations that handle personal data, financial information, or
                        healthcare records. By demonstrating a commitment to security, organizations can build
                        confidence among their customers, partners, and stakeholders.
                      </p>
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

            {/* SECTION 2: Steps in Conducting a Security Assessment */}
            <div
              ref={(el) => {
                sectionRefs.current['steps-assessment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Steps in Conducting a Security Assessment: A Systematic Approach to Safeguarding Information Assets
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Conducting a security assessment is a meticulous, multi-stage process that requires a
                    structured approach to identify vulnerabilities, evaluate risks, and implement effective
                    security measures. This systematic process ensures that organizations can proactively
                    protect their valuable records and information assets from a wide range of threats.
                  </p>
</div>

              {renderCard(
                'Steps',
                <ListChecks size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Define the Scope and Objectives: Setting Clear Boundaries and Goals:</strong> The
                    initial step involves clearly defining the scope of the assessment, delineating the specific
                    areas, systems, and assets that will be evaluated. This establishes the boundaries of the
                    assessment and ensures that all critical components are included. Concurrently, specific
                    objectives must be established, such as identifying vulnerabilities, assessing compliance
                    with regulatory requirements, or evaluating the overall risk posture. Defining the scope
                    and objectives provides a clear roadmap for the assessment, ensuring that it remains focused
                    and aligned with the organization's security goals. This step is crucial for resource
                    allocation, and ensuring that the assessment is as efficient as possible.
                  </li>
                  <li>
                    <strong>Gather Information: Building a Comprehensive Understanding:</strong> The next
                    phase involves collecting relevant information about the organization's security policies,
                    procedures, systems, and infrastructure. This comprehensive data gathering process may
                    involve reviewing existing documentation, conducting interviews with key personnel, and
                    observing daily operational activities. The objective is to gain a thorough understanding
                    of the organization's current security practices and identify any potential weaknesses or
                    gaps. This includes things like network diagrams, and employee handbooks.
                  </li>
                  <li>
                    <strong>Conduct a Risk Assessment: Identifying and Prioritizing Threats:</strong> A
                    critical component of the security assessment is the risk assessment, which involves
                    identifying potential threats and vulnerabilities that could compromise the security of
                    assets. This step goes beyond simply identifying weaknesses; it involves evaluating the
                    likelihood and potential impact of these risks. This helps prioritize security measures,
                    focusing on the most critical threats and vulnerabilities. By quantifying the potential
                    impact of a breach, the organization can make informed decisions about resource allocation.
                  </li>
                  <li>
                    <strong>Perform Physical Security Assessment: Securing the Physical Environment:</strong>
                    The physical security assessment evaluates the security of the organization's facilities,
                    including access controls, surveillance systems, and environmental security. This involves
                    inspecting locks, alarms, and other physical security measures to ensure they are
                    functioning effectively. This step is often overlooked, but is vital to a complete security
                    assessment.
                  </li>
                  <li>
                    <strong>Conduct Digital Security Assessment: Protecting Digital Assets:</strong> The
                    digital security assessment focuses on the security of the organization's digital systems
                    and networks. This may involve vulnerability scanning, penetration testing, and evaluating
                    access controls. Examining software, hardware, and network configurations is essential to
                    identify potential weaknesses that could be exploited by cyberattacks. This includes
                    looking for things such as out of date software, and open network ports.
                  </li>
                  <li>
                    <strong>Evaluate Information Handling Procedures: Ensuring Data Integrity and
                    Confidentiality:</strong> This step assesses the organization's policies and procedures for
                    handling sensitive information. This includes evaluating data storage, transmission, and
                    disposal practices to ensure they are secure and compliant with relevant regulations. This
                    includes things like data encryption, and secure file transfer protocols.
                  </li>
                  <li>
                    <strong>Review Security Policies and Procedures: Ensuring Up-to-Date Documentation:</strong>
                    A thorough review of existing security policies and procedures is essential to ensure they
                    are comprehensive, up-to-date, and aligned with industry best practices. This step involves
                    identifying any gaps or inconsistencies in the documentation and recommending necessary
                    revisions.
                  </li>
                  <li>
                    <strong>Analyze Findings and Develop Recommendations: Translating Data into Actionable
                    Insights:</strong> The data collected during the assessment is analyzed to identify key
                    findings and develop actionable recommendations for addressing identified vulnerabilities
                    and improving security. This step involves translating technical findings into clear and
                    concise recommendations that can be implemented by the organization.
                  </li>
                  <li>
                    <strong>Prepare a Security Assessment Report: Documenting Findings and Recommendations:</strong>
                    A comprehensive security assessment report is prepared to document the findings and
                    recommendations. This report should include an executive summary, detailed findings, and
                    prioritized recommendations, providing a clear and concise overview of the organization's
                    security posture.
                  </li>
                  <li>
                    <strong>Present Findings and Recommendations: Communicating with Stakeholders:</strong>
                    The findings and recommendations are presented to management and relevant stakeholders,
                    fostering open communication and collaboration. This step involves discussing the
                    implications of the findings and the proposed solutions, ensuring that all stakeholders
                    are informed and engaged in the security improvement process.
                  </li>
                  <li>
                    <strong>Implement Security Measures: Taking Action to Enhance Security:</strong> Based on
                    the recommendations from the report, an action plan is developed and implemented to address
                    the identified vulnerabilities and improve security. This may involve updating policies,
                    implementing new technologies, or providing training to staff.
                  </li>
                  <li>
                    <strong>Monitor and Review: Ensuring Ongoing Security and Adaptation:</strong> Security is
                    an ongoing process, not a one-time event. The effectiveness of implemented security
                    measures is continuously monitored, and periodic reviews are conducted to ensure ongoing
                    security. The security assessment is regularly updated to reflect changes in the
                    organization and the evolving threat landscape. This includes things like regular
                    penetration testing, and vulnerability scanning.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 3: Actions to Take in the Event of a Breach */}
            <div
              ref={(el) => {
                sectionRefs.current['breach-response'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Actions to Take in the Event of a Breach of Security: A Coordinated Response to Mitigate Damage
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A security breach, whether a cyberattack, data leak, or physical intrusion, can inflict
                    significant damage on an organization, impacting its operations, reputation, and financial
                    stability. Therefore, having a well-defined and meticulously practiced incident response
                    plan is paramount. This plan should outline the specific actions to be taken in the event
                    of a breach, ensuring a swift and coordinated response to minimize the impact and
                    facilitate recovery.
                  </p>
</div>

              {renderCard(
                'Actions',
                <AlertTriangle size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Immediate Containment: Halting the Spread of Damage:</strong> The immediate
                    priority upon discovering a security breach is to contain the incident and prevent further
                    damage. This involves taking swift and decisive actions to isolate affected systems,
                    disconnect compromised network segments, or shut down compromised applications. The goal
                    is to limit the scope of the breach and prevent it from spreading to other parts of the
                    organization's infrastructure. This immediate action is often the most critical step in
                    minimizing the overall impact of the breach.
                  </li>
                  <li>
                    <strong>Incident Assessment and Analysis: Understanding the Scope and Nature of the
                    Threat:</strong> Once the breach is contained, a thorough incident assessment and analysis
                    is crucial. This involves gathering as much information as possible about the breach,
                    including the scope of the incident, the nature of the attack, and the extent of the
                    damage. Analyzing logs, system data, and other relevant information helps to understand
                    the root cause of the breach and identify any remaining vulnerabilities. This step
                    requires a detailed investigation to ensure that all aspects of the breach are understood.
                  </li>
                  <li>
                    <strong>Notification of Relevant Parties: Communicating with Stakeholders:</strong> Prompt
                    notification of relevant stakeholders is essential. This includes informing management,
                    legal counsel, and law enforcement, as required by law or policy. Affected individuals or
                    customers should also be informed about the breach and provided with guidance on steps
                    they can take to protect themselves. Transparency and timely communication are crucial for
                    maintaining trust and minimizing reputational damage.
                  </li>
                  <li>
                    <strong>Evidence Preservation: Safeguarding Digital Forensics:</strong> Preserving all
                    evidence related to the breach is critical for legal investigations or forensic analysis.
                    This includes logs, system images, and network traffic data. Proper evidence preservation
                    ensures that the organization can accurately reconstruct the events leading up to the
                    breach and identify the perpetrators. This data is also vital for understanding how the
                    breach occurred.
                  </li>
                  <li>
                    <strong>Eradication and Recovery: Restoring Systems to Normal Operation:</strong>
                    Eradication and recovery involve removing the threat and restoring affected systems to
                    normal operation. This may include patching vulnerabilities, reinstalling software, or
                    restoring data from backups. Ensuring that all traces of the breach are eliminated is
                    crucial to prevent recurrence. This includes verifying that all backdoors and malware are
                    removed from all affected systems.
                  </li>
                  <li>
                    <strong>Forensic Analysis: Uncovering the Root Cause:</strong> A thorough forensic analysis
                    is conducted to determine the root cause of the breach and identify any remaining
                    vulnerabilities. This may involve hiring external forensic experts to conduct a detailed
                    investigation. The forensic analysis helps to understand how the attackers gained access
                    and what steps can be taken to prevent future breaches.
                  </li>
                  <li>
                    <strong>Post-Incident Review: Learning from Experience:</strong> A post-incident review is
                    conducted to evaluate the effectiveness of the response and identify areas for improvement.
                    This involves analyzing the incident response process and updating security policies,
                    procedures, and training programs based on the lessons learned. This step is vital for
                    improving future responses.
                  </li>
                  <li>
                    <strong>Communication and Public Relations: Managing Public Perception:</strong> Developing
                    a communication plan to address public concerns and maintain transparency is essential.
                    Providing accurate and timely information to the media and other stakeholders helps to
                    manage public perception and minimize reputational damage. This includes crafting clear
                    and concise messages that address the concerns of different audiences.
                  </li>
                  <li>
                    <strong>Legal and Regulatory Compliance: Adhering to Legal Obligations:</strong> Ensuring
                    compliance with all applicable legal and regulatory requirements, including data breach
                    notification laws and privacy regulations, is crucial. This involves understanding the
                    legal obligations and taking the necessary steps to comply with them.
                  </li>
                  <li>
                    <strong>Monitoring and Ongoing Security: Continuous Vigilance:</strong> Increasing
                    monitoring of affected systems and enhancing security measures are essential for
                    preventing future breaches. Regular security assessments and continuous monitoring help
                    to ensure ongoing security and adapt to evolving threats.
                  </li>
                  <li>
                    <strong>Documentation: Creating a Record of Actions:</strong> Documenting every action
                    taken during the incident response is invaluable for the post-incident review and any
                    legal action. This comprehensive documentation provides a detailed record of the incident
                    and the response, which can be used to improve future incident response plans.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 4: Information Security in Records Preservation */}
            <div
              ref={(el) => {
                sectionRefs.current['info-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Information Security in Records Preservation: Ensuring Authenticity and Accessibility Throughout the Lifecycle
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Information security, within the context of records preservation, is a multifaceted
                    endeavor that focuses on safeguarding the confidentiality, integrity, and availability of
                    records throughout their entire lifecycle. This comprehensive approach ensures that
                    records, whether physical or digital, remain authentic and accessible for as long as they
                    are needed. It involves the implementation of robust safeguards to prevent unauthorized
                    access, alteration, or destruction, thereby preserving the evidentiary value and historical
                    significance of these records. In records management, information security extends beyond
                    mere protection against cyberattacks; it encompasses a holistic strategy that integrates
                    physical security, procedural controls, and disaster recovery planning. This integrated
                    approach recognizes that threats can originate from various sources, and a layered defense
                    is necessary to effectively mitigate risks.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Security Threats and Vulnerabilities to Information: A Spectrum of Potential Dangers
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  The landscape of security threats and vulnerabilities is diverse, encompassing physical,
                  digital, and procedural domains. Understanding these threats is crucial for developing
                  effective security measures.
                </p>

                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-2">
                  <Building size={16} /> Physical Threats: Tangible Dangers to Records
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Theft:</strong> The unauthorized removal of records from storage areas poses a significant risk, leading to the loss of valuable information and potential legal or reputational damage.</li>
                  <li><strong>Environmental Hazards:</strong> Damage from fire, flood, or extreme temperatures and humidity can severely degrade or destroy physical records.</li>
                  <li><strong>Vandalism:</strong> Intentional damage or destruction of records represents a deliberate act of harm, requiring robust physical security measures.</li>
                  <li><strong>Unauthorized Access:</strong> Gaining physical access to restricted areas where records are stored allows for the potential of theft, vandalism, or other damage.</li>
                </ul>

                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-2">
                  <Cloud size={16} /> Digital Threats: Intrusions into the Digital Realm
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Malware:</strong> Viruses, ransomware, and other malicious software can corrupt or destroy digital records, rendering them unusable.</li>
                  <li><strong>Hacking:</strong> Unauthorized access to digital systems and networks can lead to data breaches or the alteration of records, compromising their integrity.</li>
                  <li><strong>Data Corruption:</strong> Errors or failures in hardware or software can corrupt or destroy digital data, highlighting the importance of data redundancy and backup systems.</li>
                  <li><strong>Technological Obsolescence:</strong> The inability to access digital records due to outdated hardware or software poses a long-term preservation challenge.</li>
                  <li><strong>Insider Threats:</strong> Unauthorized access or alteration of digital records by employees or contractors can be difficult to detect and prevent.</li>
                </ul>

                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-2">
                  <ClipboardIcon size={16} /> Procedural Threats: Weaknesses in Operational Practices
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Lack of Access Controls:</strong> Inadequate controls over who can access and modify records, both physical and digital, create vulnerabilities.</li>
                  <li><strong>Improper Handling:</strong> Mishandling of records, such as incorrect storage or disposal, can lead to damage or loss.</li>
                  <li><strong>Lack of Backup and Recovery:</strong> Inadequate backup and recovery procedures can result in catastrophic data loss in the event of a disaster or system failure.</li>
                  <li><strong>Insufficient Training:</strong> Lack of staff training on security policies and procedures increases the risk of human error.</li>
                </ul>

                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-2">
                  <AlertCircle size={16} /> Vulnerabilities: Weak Points in Security Defenses
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Weak Passwords:</strong> Easily guessed passwords can be compromised by attackers, providing unauthorized access to sensitive information.</li>
                  <li><strong>Unpatched Software:</strong> Software vulnerabilities can be exploited by malware or hackers, leading to system compromise.</li>
                  <li><strong>Inadequate Physical Security:</strong> Weaknesses in physical security measures, such as unlocked doors or inadequate surveillance, create opportunities for unauthorized access.</li>
                  <li><strong>Lack of Encryption:</strong> Failure to encrypt sensitive data makes it vulnerable to unauthorized access, even if intercepted.</li>
                  <li><strong>Insufficient Disaster Recovery Planning:</strong> Inadequate planning for recovering records in the event of a disaster can lead to irreversible data loss.</li>
                  <li><strong>Social Engineering:</strong> Manipulating people into giving out sensitive information bypasses technical security measures.</li>
                </ul>

                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-2">
                  <Layers size={16} /> Media Specific Threats: Dangers Related to Storage Mediums
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Paper:</strong> Acid decay, water damage, and light fading can degrade paper records over time.</li>
                  <li><strong>Film/Photographs:</strong> Chemical decay, light damage, and scratches can compromise the integrity of film and photographs.</li>
                  <li><strong>Digital:</strong> Bit rot, hardware failure, and file format obsolescence pose significant challenges to the long-term preservation of digital records.</li>
                  <li><strong>Audio/Visual:</strong> Magnetic decay, physical damage, and codec obsolescence can degrade audio and visual recordings.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Security Countermeasures */}
            <div
              ref={(el) => {
                sectionRefs.current['countermeasures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Security Countermeasures for Records Preservation: Detailed Explanation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When safeguarding records, a layered security approach is essential. This means
                    implementing multiple countermeasures that work together to protect against various threats.
                  </p>
</div>

              {renderCard(
                'Countermeasures',
                <Shield size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Access Control (Physical and Digital):</strong> Access control is the fundamental
                    principle of limiting access to records and information systems to authorized personnel
                    only. This is implemented through both physical and digital means.
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Physical Access Control:</strong> In a physical records storage environment, this includes measures like keycard access, biometric scanners, and security guards. These measures prevent unauthorized individuals from entering storage areas where sensitive records are kept. Maintaining visitor logs adds another layer of security, allowing for tracking and accountability.</li>
                      <li><strong>Digital Access Control:</strong> In digital systems, access control involves using strong passwords, multi-factor authentication (MFA), and role-based access control (RBAC). MFA adds an extra layer of security by requiring multiple forms of verification, such as a password and a code from a mobile device. RBAC ensures that users only have access to the data and systems they need to perform their job functions. Regular reviews of access permissions are essential to remove access for individuals who no longer require it.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Data Encryption (At Rest and In Transit):</strong> Encryption is the process of
                    converting data into an unreadable format, making it inaccessible to unauthorized
                    individuals. This is crucial for protecting sensitive information, both when it is stored
                    (at rest) and when it is being transmitted (in transit).
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Encryption at Rest:</strong> This involves encrypting data stored on hard drives, servers, and other storage devices. If a storage device is stolen or compromised, the data remains protected.</li>
                      <li><strong>Encryption in Transit:</strong> This involves encrypting data as it is transmitted over networks, such as the internet or local area networks. This prevents eavesdropping and interception of sensitive information. Secure protocols like HTTPS and VPNs are used for this purpose. Utilizing strong encryption algorithms and secure key management practices are vital.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Incident Response Planning:</strong> An incident response plan is a documented set
                    of procedures for handling security incidents, such as data breaches or cyberattacks. It
                    outlines the steps to be taken to contain the incident, minimize damage, and restore normal
                    operations. A well-defined plan should include:
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Roles and responsibilities</li>
                      <li>Communication protocols</li>
                      <li>Procedures for evidence preservation, eradication, and recovery</li>
                      <li>Regular testing and updates of the plan are essential to ensure its effectiveness. Post incident reviews are also very important, to learn from the event, and to update the plan.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Staff Training and Awareness:</strong> Human error is a significant factor in
                    security breaches. Therefore, it is essential to provide regular training to staff on
                    security policies, procedures, and best practices. Training should cover:
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Password security</li>
                      <li>Phishing awareness</li>
                      <li>Safe data handling practices</li>
                      <li>Raising awareness about social engineering tactics is also crucial, as attackers often manipulate people into revealing sensitive information. A culture of security consciousness should be fostered throughout the organization.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Backup and Recovery Procedures:</strong> Implementing regular data backups and
                    testing recovery procedures is essential for ensuring data can be restored in the event of
                    a breach, disaster, or system failure. Backups should be stored in secure, off-site
                    locations to protect them from physical damage or unauthorized access. Regular testing of
                    recovery procedures ensures that data can be restored quickly and efficiently. Backups
                    should also be checked for integrity.
                  </li>
                  <li>
                    <strong>Vulnerability Assessments and Patch Management:</strong> Regularly conducting
                    vulnerability assessments and penetration testing helps identify security weaknesses in
                    systems and applications. Patch management involves keeping all software and operating
                    systems up to date with the latest security patches. Vulnerability assessments scan systems
                    for known vulnerabilities, while penetration testing simulates real-world attacks to
                    identify weaknesses. Patch management is crucial for closing security gaps and preventing
                    attackers from exploiting known vulnerabilities.
                  </li>
                  <li>
                    <strong>Environmental Controls:</strong> Controlling the environment in which records are
                    stored is very important. This is especially true for physical media. This includes
                    maintaining stable temperature and humidity levels to prevent deterioration of physical
                    records. Fire suppression and water leak detection systems are also essential for
                    protecting records from environmental hazards.
                  </li>
                  <li>
                    <strong>Media Specific Countermeasures:</strong> Different media types have unique
                    preservation requirements.
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Paper:</strong> Deacidification, archival storage, and climate control.</li>
                      <li><strong>Film/Photographs:</strong> Cold storage, archival enclosures, controlled light.</li>
                      <li><strong>Digital:</strong> Data migration, checksum verification, redundant storage, and regular backups.</li>
                      <li><strong>Audio/Visual:</strong> Reformatting, climate control, and storage away from magnetic fields.</li>
                    </ul>
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 6: Emergency Information Manual */}
            <div
              ref={(el) => {
                sectionRefs.current['emergency-manual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Essence of an Emergency Information Manual
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An emergency information manual is a critical resource that provides clear, concise, and
                    actionable guidance for responding to emergencies that may impact an organization's
                    records and information. Its essence lies in its ability to facilitate swift and effective
                    responses, minimizing damage and ensuring business continuity.
                  </p>
</div>

              {renderCard(
                'Key Components',
                <BookOpen size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Immediate Response Guidance:</strong> The manual provides step-by-step instructions
                    for immediate actions to be taken during an emergency. This ensures that personnel can
                    react quickly and appropriately, minimizing confusion and panic.
                  </li>
                  <li>
                    <strong>Contact and Communication Protocols:</strong> It includes up-to-date contact
                    information for key personnel, emergency responders, and external agencies. Clear
                    communication protocols ensure that information flows efficiently during a crisis.
                  </li>
                  <li>
                    <strong>Record and Information Salvage Procedures:</strong> The manual outlines procedures
                    for salvaging and recovering damaged records and information, including prioritization of
                    materials and appropriate recovery techniques.
                  </li>
                  <li>
                    <strong>Business Continuity and Recovery Strategies:</strong> It details strategies for
                    maintaining essential business operations and recovering from disruptions. This includes
                    procedures for data backup, alternative work locations, and restoration of critical systems.
                  </li>
                  <li>
                    <strong>Risk Mitigation and Prevention Measures:</strong> The manual includes information
                    on preventive measures to minimize the impact of future emergencies. This can involve risk
                    assessments, security protocols, and disaster preparedness training.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 7: Steps in Developing an Emergency Information Manual */}
            <div
              ref={(el) => {
                sectionRefs.current['developing-manual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Steps Involved in Developing an Emergency Information Manual
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Developing an effective emergency information manual requires a systematic and thorough
                    approach.
                  </p>
</div>

              {renderCard(
                'Steps',
                <ListChecks size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Risk Assessment and Hazard Identification:</strong> Identify potential emergencies
                    that could impact the organization's records and information, such as fires, floods,
                    cyberattacks, and natural disasters.
                  </li>
                  <li>
                    <strong>Development of Emergency Response Procedures:</strong> Create clear and concise
                    procedures for responding to each identified emergency. Include step-by-step instructions,
                    checklists, and flowcharts.
                  </li>
                  <li>
                    <strong>Compilation of Contact Information:</strong> Gather and organize contact
                    information for key personnel, emergency responders, and external agencies. Ensure that
                    contact information is up-to-date and easily accessible.
                  </li>
                  <li>
                    <strong>Development of Salvage and Recovery Procedures:</strong> Outline procedures for
                    salvaging and recovering damaged records and information, including prioritization of
                    materials and appropriate recovery techniques.
                  </li>
                  <li>
                    <strong>Creation of Business Continuity and Recovery Strategies:</strong> Develop
                    strategies for maintaining essential business operations and recovering from disruptions.
                    Include procedures for data backup, alternative work locations, and restoration of
                    critical systems.
                  </li>
                  <li>
                    <strong>Documentation and Review:</strong> Document all procedures and strategies in a
                    clear and organized manual. Conduct regular reviews and updates to ensure accuracy and
                    relevance.
                  </li>
                  <li>
                    <strong>Training and Drills:</strong> Provide training to personnel on emergency response
                    procedures and conduct regular drills to test the effectiveness of the manual.
                  </li>
                  <li>
                    <strong>Distribution and Accessibility:</strong> Ensure that the manual is readily
                    available to all personnel in both print and digital formats. Store copies in secure and
                    accessible locations.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 8: Evaluating an Emergency Information Manual */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluating-manual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating an Emergency Information Manual
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Evaluating an emergency information manual is crucial for ensuring its effectiveness and
                    relevance.
                  </p>
</div>

              {renderCard(
                'Evaluation Criteria',
                <Target size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Clarity and Conciseness:</strong> Assess whether the manual is written in clear
                    and concise language that is easy to understand during a crisis. Avoid jargon and
                    technical terms that may not be familiar to all personnel. Use simple language and short
                    sentences to ensure that instructions are easily followed, even under stress.
                  </li>
                  <li>
                    <strong>Accuracy and Completeness:</strong> Verify that all information in the manual is
                    accurate and up-to-date. Ensure that all essential procedures and contact information are
                    included. Regularly review and update the manual to reflect changes in personnel,
                    procedures, and potential hazards. Include all relevant information, such as emergency
                    contact lists, evacuation routes, and equipment locations.
                  </li>
                  <li>
                    <strong>Usability and Accessibility:</strong> Evaluate whether the manual is easy to
                    navigate and access during an emergency. Ensure that both print and digital formats are
                    readily available. Consider using a table of contents, index, and color-coding to
                    facilitate quick access to critical information. Store copies of the manual in secure and
                    accessible locations, both on-site and off-site.
                  </li>
                  <li>
                    <strong>Effectiveness of Procedures:</strong> Assess the effectiveness of the emergency
                    response procedures through drills and simulations. Identify any gaps or weaknesses.
                    Conduct regular drills and exercises to test the procedures and ensure that personnel are
                    familiar with their roles and responsibilities. Use feedback from drills to identify areas
                    for improvement and update the manual accordingly.
                  </li>
                  <li>
                    <strong>Regular Updates and Reviews:</strong> Check whether the manual is regularly
                    updated and reviewed to reflect changes in technology, personnel, and potential hazards.
                    Establish a schedule for regular reviews and updates, at least annually or more frequently
                    as needed. Assign responsibility for maintaining the manual and ensure that all changes
                    are documented and communicated to personnel.
                  </li>
                  <li>
                    <strong>Comprehensiveness:</strong> Does the manual cover a wide enough range of possible
                    emergencies? Consider all potential hazards that could impact the organization, including
                    natural disasters, technological accidents, and security incidents. Include procedures for
                    each type of emergency, as well as general guidance for handling unforeseen situations.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Is all contact information up to date, and easy to
                    locate? Ensure that the manual includes contact information for key personnel, emergency
                    responders, and external agencies. Verify that all contact information is accurate and
                    up-to-date, including phone numbers, email addresses, and physical locations. Consider
                    creating a separate contact list that can be easily updated and distributed as needed.
                  </li>
                  <li>
                    <strong>Recovery procedures:</strong> Are the recovery procedures clearly defined, and
                    easy to follow? Outline specific steps for recovering records and information following an
                    emergency. Include procedures for salvaging damaged materials, restoring data from backups,
                    and rebuilding critical systems. Prioritize recovery efforts based on the importance of
                    the records and the time sensitivity of the information. Consider using flowcharts or
                    checklists to simplify complex procedures.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 9: Digital Data Security */}
            <div
              ref={(el) => {
                sectionRefs.current['digital-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Digital Data Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Digital data security refers to the protective measures taken to safeguard digital
                    information from unauthorized access, use, disclosure, disruption, modification, or
                    destruction. It encompasses a range of technologies, policies, and practices designed to
                    ensure the confidentiality, integrity, and availability of digital data.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '7 Importance of Digital Data Security',
                    icon: <ListChecks size={16} />,
                    content: (
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Protection of Sensitive Information:</strong> Digital data security safeguards sensitive information, such as personal data, financial records, and intellectual property, from unauthorized access and misuse.</li>
                        <li><strong>Prevention of Data Breaches:</strong> Effective security measures help prevent data breaches, which can lead to financial losses, reputational damage, and legal penalties.</li>
                        <li><strong>Maintenance of Business Continuity:</strong> Digital data security ensures that critical systems and data remain available during and after disruptions, supporting business continuity.</li>
                        <li><strong>Compliance with Regulations:</strong> Many industries are subject to regulations that mandate data security measures. Digital data security helps organizations comply with these regulations.</li>
                        <li><strong>Preservation of Trust and Reputation:</strong> Strong data security practices build trust with customers and stakeholders, enhancing the organization's reputation.</li>
                        <li><strong>Protection of Intellectual Property:</strong> Digital data security safeguards intellectual property, such as trade secrets and patents, from unauthorized access and theft.</li>
                        <li><strong>Prevention of Financial Losses:</strong> Data breaches can result in significant financial losses due to fines, legal fees, and the cost of remediation. Strong data security reduces the risk of these losses.</li>
                      </ol>
                    ),
                  },
                  {
                    title: '7 Challenges in Digital Data Security',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Evolving Cyber Threats:</strong> Cyber threats are constantly evolving, with new malware, hacking techniques, and social engineering tactics emerging regularly.</li>
                        <li><strong>Increasing Complexity of Systems:</strong> Organizations rely on increasingly complex systems and networks, which can create vulnerabilities and make it difficult to maintain security.</li>
                        <li><strong>Data Proliferation and Mobility:</strong> The proliferation of data across multiple devices and cloud platforms, as well as the increasing mobility of data, makes it challenging to secure.</li>
                        <li><strong>Insider Threats:</strong> Employees or contractors with authorized access can pose a significant security risk, whether intentionally or unintentionally.</li>
                        <li><strong>Technological Obsolescence:</strong> Rapid technological advancements can render security measures obsolete, requiring constant updates and upgrades.</li>
                        <li><strong>Resource Constraints:</strong> Organizations may face resource constraints, including limited budgets and skilled personnel, which can hinder their ability to implement effective security measures.</li>
                        <li><strong>Human Error:</strong> Human error, such as weak passwords, phishing susceptibility, and improper data handling, remains a significant vulnerability.</li>
                      </ol>
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

            {/* SECTION 10: Current/International Trends */}
            <div
              ref={(el) => {
                sectionRefs.current['trends'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Current/International Trends and Developments in Data Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The landscape of data security is constantly evolving, driven by technological
                    advancements and emerging threats. Here are some key trends:
                  </p>
</div>

              {renderCard(
                'Key Trends',
                <TrendingUp size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Zero Trust Security:</strong> This model operates on the principle of "never trust, always verify." It assumes that no user or device should be trusted by default, regardless of their location or network. This approach emphasizes continuous authentication and authorization.</li>
                  <li><strong>AI and Machine Learning in Security:</strong> AI and machine learning are being increasingly used to detect and respond to security threats. These technologies can analyze large volumes of data to identify anomalies and patterns that may indicate malicious activity.</li>
                  <li><strong>Cloud Security:</strong> As more organizations move to cloud-based services, cloud security has become a critical concern. Cloud security involves implementing security measures to protect data and applications stored in the cloud.</li>
                  <li><strong>Cybersecurity Mesh Architecture (CSMA):</strong> CSMA focuses on distributed security architecture. Rather than a single perimeter, security is distributed around each individual access point. This allows for greater flexibility and scalability.</li>
                  <li><strong>Data Privacy Regulations:</strong> Regulations like GDPR, CCPA, and others are driving organizations to implement stronger data privacy measures. These regulations emphasize the importance of data protection and individual rights.</li>
                  <li><strong>Ransomware Defense:</strong> Ransomware attacks are on the rise, prompting organizations to invest in robust ransomware defense strategies. These strategies include regular backups, security awareness training, and incident response planning.</li>
                  <li><strong>Quantum Computing and Cryptography:</strong> The development of quantum computing poses a threat to traditional encryption methods. Organizations are exploring quantum-resistant cryptography to prepare for this future threat.</li>
                  <li><strong>IoT Security:</strong> The proliferation of Internet of Things (IoT) devices has created new security challenges. Organizations are implementing security measures to protect these devices and the data they generate.</li>
                  <li><strong>DevSecOps:</strong> DevSecOps integrates security into the software development lifecycle. This approach ensures that security is considered at every stage of development, from design to deployment.</li>
                  <li><strong>Biometric Authentication:</strong> The use of biometric authentication, such as fingerprint and facial recognition, is becoming more common. This provides a more secure way to verify user identity.</li>
                </ol>
              )}
            </div>

            {/* SECTION 11: Strategies in Data Security */}
            <div
              ref={(el) => {
                sectionRefs.current['strategies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Strategies in Data Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Effective data security strategies involve a combination of technical, procedural, and
                    human factors. Here are some key strategies:
                  </p>
</div>

              {renderCard(
                'Strategies',
                <Target size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Risk Assessment and Management:</strong> Conduct regular risk assessments to identify potential threats and vulnerabilities. Develop and implement risk mitigation strategies.</li>
                  <li><strong>Security Policies and Procedures:</strong> Establish clear and comprehensive security policies and procedures that address all aspects of data security.</li>
                  <li><strong>Access Control and Authentication:</strong> Implement strong access controls, such as multi-factor authentication and role-based access, to limit access to sensitive data.</li>
                  <li><strong>Data Encryption:</strong> Encrypt sensitive data at rest and in transit to protect it from unauthorized access.</li>
                  <li><strong>Malware Protection:</strong> Install and regularly update antivirus and anti-malware software on all systems.</li>
                  <li><strong>Security Awareness Training:</strong> Provide regular training to staff on security policies, procedures, and best practices.</li>
                  <li><strong>Incident Response Planning:</strong> Develop and implement an incident response plan to guide actions in the event of a security breach.</li>
                  <li><strong>Data Backup and Recovery:</strong> Implement regular data backups and test recovery procedures to ensure data can be restored in the event of a breach or disaster.</li>
                  <li><strong>Security Monitoring and Logging:</strong> Implement security monitoring and logging systems to detect and respond to security incidents.</li>
                  <li><strong>Patch Management:</strong> Keep all software and operating systems up to date with the latest security patches.</li>
                  <li><strong>Vendor Security:</strong> If working with third party vendors, ensure that they are also following good security practices.</li>
                  <li><strong>Data Loss Prevention (DLP):</strong> Implement DLP solutions to prevent sensitive data from leaving the organization's control.</li>
                </ol>
              )}
            </div>

            {/* SECTION 12: Evaluating Legislation and Charters */}
            <div
              ref={(el) => {
                sectionRefs.current['legislation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating Legislation and Charters in Data Integrity and Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Legislation and charters play a crucial role in establishing legal frameworks and
                    ethical standards for data integrity and security. They aim to protect individuals'
                    privacy, ensure data accuracy, and prevent unauthorized access or misuse of information.
                  </p>
</div>

              {renderCard(
                'Evaluation Criteria',
                <ClipboardIcon size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Scope and Applicability:</strong> Evaluate the scope of the legislation or charter
                    to determine which types of data and organizations it applies to. Assess whether it covers
                    both public and private sector entities, as well as different types of data (e.g.,
                    personal, financial, health).
                  </li>
                  <li>
                    <strong>Data Protection Principles:</strong> Examine the data protection principles
                    outlined in the legislation or charter, such as data minimization, purpose limitation,
                    storage limitation, and accuracy. Assess whether these principles align with international
                    best practices and provide adequate protection for individuals' rights.
                  </li>
                  <li>
                    <strong>Security Requirements:</strong> Evaluate the security requirements specified in
                    the legislation or charter, including technical and organizational measures for protecting
                    data. Assess whether these requirements are sufficiently robust to address current and
                    emerging security threats.
                  </li>
                  <li>
                    <strong>Enforcement Mechanisms:</strong> Assess the enforcement mechanisms provided by the
                    legislation or charter, including penalties for non-compliance and the powers of
                    regulatory authorities. Evaluate whether these mechanisms are effective in deterring
                    violations and ensuring compliance.
                  </li>
                  <li>
                    <strong>International Alignment:</strong> Evaluate the extent to which the legislation or
                    charter aligns with international data protection standards, such as GDPR and ISO 27001.
                    Assess whether it facilitates cross-border data flows and promotes international
                    cooperation in data security.
                  </li>
                  <li>
                    <strong>Rights of Individuals:</strong> Examine the rights granted to individuals under
                    the legislation or charter, such as the right to access, rectify, and erase their personal
                    data. Assess whether these rights are effectively protected and enforced.
                  </li>
                  <li>
                    <strong>Technological Neutrality:</strong> Evaluate whether the legislation or charter is
                    technologically neutral, meaning it can adapt to future technological advancements without
                    becoming obsolete.
                  </li>
                  <li>
                    <strong>Regular Updates:</strong> Evaluate the systems in place to update the charter or
                    legislation. Data security is an ever-evolving field, and the laws must be able to change
                    with it.
                  </li>
                </ol>
              )}
            </div>

            {/* SECTION 13: Maintaining Ethical Issues */}
            <div
              ref={(el) => {
                sectionRefs.current['ethics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining and Adhering to Ethical Issues in Information Security
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintaining ethical standards in information security is essential for building trust
                    and ensuring responsible data handling. Here's how to do it:
                  </p>
</div>

              {renderCard(
                'Ethical Practices',
                <Shield size={16} />,
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Implement a Code of Ethics:</strong> Develop and implement a code of ethics that
                    outlines the organization's commitment to ethical data handling. Ensure that all
                    employees are aware of and adhere to the code.
                  </li>
                  <li>
                    <strong>Provide Regular Training:</strong> Conduct regular training sessions on ethical
                    issues in information security, including data privacy, confidentiality, and responsible
                    data use.
                  </li>
                  <li>
                    <strong>Establish Clear Policies and Procedures:</strong> Develop and enforce clear
                    policies and procedures for data handling, access control, and incident response. Ensure
                    that these policies are consistent with ethical principles and legal requirements.
                  </li>
                  <li>
                    <strong>Promote Transparency and Accountability:</strong> Foster a culture of
                    transparency by communicating openly about data handling practices and security measures.
                    Establish mechanisms for reporting and investigating ethical violations.
                  </li>
                  <li>
                    <strong>Respect Privacy Rights:</strong> Prioritize the protection of individuals'
                    privacy rights. Obtain informed consent before collecting or using personal data, and
                    ensure that data is used only for legitimate purposes.
                  </li>
                  <li>
                    <strong>Ensure Data Accuracy and Integrity:</strong> Implement measures to ensure the
                    accuracy and integrity of data. Regularly verify and update data to prevent errors and
                    ensure reliability.
                  </li>
                  <li>
                    <strong>Prevent Unauthorized Access and Use:</strong> Implement robust security measures
                    to prevent unauthorized access, use, or disclosure of data. Use strong passwords,
                    encryption, and access controls to protect sensitive information.
                  </li>
                  <li>
                    <strong>Address Bias and Discrimination:</strong> Be aware of and address potential
                    biases and discriminatory practices in data collection, analysis, and use. Ensure that
                    data is used fairly and equitably.
                  </li>
                  <li>
                    <strong>Stay Informed and Adapt:</strong> Keep abreast of emerging ethical issues and
                    best practices in information security. Regularly review and update policies and
                    procedures to reflect changes in technology and societal expectations.
                  </li>
                  <li>
                    <strong>Lead by Example:</strong> Management should lead by example. They should always
                    follow all ethical guidelines and security protocols. This will help to create a culture
                    of security awareness.
                  </li>
                </ol>
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Security Insight
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
                  <span>Assessment Benefits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Assessment Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12</span>
                </li>
                <li className="flex justify-between">
                  <span>Breach Response Actions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">11</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Trends</span>
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
                Security assessments identify vulnerabilities and mitigate risks, protecting assets and
                ensuring compliance. The assessment process includes defining scope, gathering information,
                risk assessment, physical and digital security evaluation, and reporting. In the event of a
                breach, contain, assess, notify, preserve evidence, eradicate, recover, and conduct a
                post-incident review. Information security covers physical, digital, and procedural threats.
                Countermeasures include access control, encryption, incident response, training, backups,
                and vulnerability assessments. Emergency manuals provide guidance for response, salvage,
                and business continuity. Digital data security faces challenges from evolving threats,
                complexity, and human error. Trends include Zero Trust, AI, cloud security, and privacy
                regulations. Strategies involve risk management, policies, encryption, and training.
                Legislation and ethics protect privacy and ensure responsible data handling.
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
                <strong className="text-white">Security Assessment</strong> – A systematic process to
                identify vulnerabilities, mitigate risks, protect assets, ensure compliance, and foster
                security awareness. Benefits include improved planning, breach prevention, business
                continuity, cost efficiency, and public trust.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Assessment Steps</strong> – Define scope, gather information,
                conduct risk assessment, perform physical and digital security checks, evaluate procedures,
                review policies, analyze findings, prepare report, present recommendations, implement
                measures, and monitor/review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Breach Response</strong> – Contain, assess, notify, preserve
                evidence, eradicate, recover, conduct forensic analysis, review, communicate, ensure legal
                compliance, monitor, and document all actions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Information Security</strong> – Protect confidentiality,
                integrity, and availability (C‑I‑A). Threats include physical (theft, hazards), digital
                (malware, hacking), procedural (lack of controls), and media‑specific risks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Countermeasures</strong> – Access control (physical/
                digital), encryption, incident response, staff training, backups, vulnerability assessments,
                environmental controls, and media‑specific preservation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Emergency Manual &amp; Digital Security</strong> – Provides
                immediate response guidance, contacts, salvage procedures, and business continuity strategies.
                Digital security faces challenges from evolving threats, system complexity, data mobility,
                insider threats, and human error.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Trends, Strategies &amp; Ethics</strong> – Zero Trust, AI/ML,
                cloud security, CSMA, privacy regulations, ransomware defense, and quantum cryptography.
                Strategies include risk management, policies, encryption, training, and DLP. Ethics require
                codes, transparency, privacy respect, and accountability.
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
            Sidemann Academic Registry • Security Assessment &amp; Data Protection — LO5
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;