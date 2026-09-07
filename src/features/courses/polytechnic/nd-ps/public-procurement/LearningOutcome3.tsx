import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Type,
  Edit,
  Hash,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
  Scale,
  Users,
  Eye,
  Lock,
  Handshake,
  Award,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Link,
  BadgeCheck,
  ClockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'nondiscrimination', label: 'Non-Discrimination' },
  { id: 'transparency', label: 'Transparency' },
  { id: 'fairness', label: 'Fairness & Integrity' },
  { id: 'code', label: 'Code of Conduct' },
  { id: 'bidder', label: 'Bidder Conduct' },
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
        text: 'The principles of non-discrimination and equality of treatment are enshrined in international human rights law, including the Universal Declaration of Human Rights and the UN Convention on the Elimination of All Forms of Discrimination.',
      },
      {
        title: 'Pro Tip',
        text: 'In public procurement, transparency is not just about publishing information; it\'s about making it understandable and accessible to all stakeholders, including the general public.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of ethical procurement: Fairness, Integrity, Transparency, and Accountability (FITA).',
      },
      {
        title: 'Common Mistake',
        text: 'Many procurement professionals overlook the importance of a clear code of conduct for bidders. A well-defined code helps prevent misunderstandings and sets clear expectations for behaviour throughout the contract lifecycle.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The principles of non-discrimination and equality of treatment are enshrined in international human rights law, including the Universal Declaration of Human Rights and the UN Convention on the Elimination of All Forms of Discrimination.',
      },
      {
        title: 'Pro Tip',
        text: 'In public procurement, transparency is not just about publishing information; it\'s about making it understandable and accessible to all stakeholders, including the general public.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of ethical procurement: Fairness, Integrity, Transparency, and Accountability (FITA).',
      },
      {
        title: 'Common Mistake',
        text: 'Many procurement professionals overlook the importance of a clear code of conduct for bidders. A well-defined code helps prevent misunderstandings and sets clear expectations for behaviour throughout the contract lifecycle.',
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
            <FolderTree size={14} className="inline mr-1" /> PUBLIC PROCUREMENT ETHICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Non-Discrimination, Transparency &amp;{' '}
            <span className="text-purple-300 font-bold italic">
              Codes of Conduct
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to non-discrimination, equality, transparency, fairness, integrity, codes of conduct, and bidder/contractor conduct in public procurement.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Non-Discrimination
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Transparency
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BadgeCheck size={14} className="inline mr-1" /> Code of Conduct
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
                placeholder="Search for a principle, conduct rule, term..."
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
            {/* SECTION 1: Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Ethical Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This learning outcome covers the essential ethical principles that underpin public procurement: non-discrimination, equality of treatment, transparency, fairness, and integrity. It also explores codes of conduct for procurement professionals and the expected conduct of bidders and contractors.
                  </p>
</div>
            </div>

            {/* SECTION 2: Non-Discrimination and Equality of Treatment */}
            <div
              ref={(el) => {
                sectionRefs.current['nondiscrimination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Non-Discrimination and Equality of Treatment
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine everyone lining up for a race. Non-discrimination means no one gets pushed to the back or tripped because of who they are. Equality of treatment means everyone gets the same starting line and the same rules.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Non-Discrimination: Avoiding Unfair Bias',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p>Non-discrimination means avoiding any form of unfair bias or prejudice against individuals or groups based on certain characteristics. These characteristics can include race, ethnicity, gender, religion, age, disability, sexual orientation, or any other protected category.</p>
                        <p>It's about ensuring that everyone has the same opportunities and rights, regardless of their background or identity. For example, in employment, it means that hiring, promotion, and other workplace decisions should be based on merit and qualifications, not on discriminatory factors. In public services, it means that everyone should have equal access to healthcare, education, and other essential services, without being denied or treated unfairly because of who they are. Essentially, it is about removing the barriers that prevent certain groups from fully participating in society.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Equality of Treatment: Applying the Same Rules to Everyone',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>Equality of treatment means applying the same rules, standards, and procedures to everyone in similar situations. It's about ensuring that everyone is treated fairly and consistently, without any arbitrary or unjustified differences.</p>
                        <p>This principle is particularly important in areas such as law, justice, and public administration. For example, in a court of law, it means that everyone should be treated equally before the law, regardless of their status or background. In public procurement, it means that all suppliers should have an equal opportunity to bid for contracts, and that evaluation criteria should be applied consistently to all bids. Equality of treatment ensures that everyone is treated in a uniform manner, preventing any one person or group from having an unfair advantage or disadvantage.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Interconnectedness',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>Non-discrimination and equality of treatment are closely interconnected and mutually reinforcing. Non-discrimination sets the broader principle of avoiding unfair bias, while equality of treatment provides the practical application of that principle.</p>
                        <p>For example, non-discrimination ensures that people with disabilities are not excluded from employment opportunities, while equality of treatment ensures that they have the same access to workplace accommodations and support as other employees. Both principles are essential for creating a society where everyone has the opportunity to thrive.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Legal and Ethical Obligations',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>Both non-discrimination and equality of treatment are often enshrined in laws and ethical codes. These legal and ethical obligations aim to protect individuals and groups from unfair treatment and promote a just and equitable society.</p>
                        <p>Many countries have laws that prohibit discrimination in employment, housing, and public services. International human rights treaties also emphasize the importance of non-discrimination and equality of treatment. Organizations, both public and private, often have policies and procedures that promote these principles.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Promoting Social Inclusion',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <>
                        <p>Upholding non-discrimination and equality of treatment is crucial for promoting social inclusion and cohesion. When everyone feels valued and respected, and when everyone has the same opportunities to participate in society, it strengthens social bonds and fosters a sense of belonging.</p>
                        <p>Social inclusion benefits everyone, not just those who are traditionally marginalized. It creates a more diverse and vibrant society, where everyone can contribute their unique talents and perspectives.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Challenges and Ongoing Efforts',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>Despite progress, challenges remain in achieving full non-discrimination and equality of treatment. Prejudice and discrimination can still persist, and subtle forms of bias can be difficult to detect.</p>
                        <p>Ongoing efforts are needed to raise awareness, educate people about these principles, and implement policies and practices that promote fairness and inclusion. This requires a commitment from individuals, organizations, and governments to create a society where everyone is treated with dignity and respect.</p>
                      </>
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

            {/* SECTION 3: Transparency */}
            <div
              ref={(el) => {
                sectionRefs.current['transparency'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transparency
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Transparency, in its simplest form, means openness and clarity. It's about making information accessible and visible so that others can understand what's happening. In a broader context, it's a fundamental principle that promotes accountability and trust.
                  </p>
</div>

              {renderCard(
                'Core Meaning',
                <Eye size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Transparency involves the disclosure of information in a clear, timely, and accessible manner.</li>
                    <li>It's about removing secrecy and making processes and decisions visible to those who are affected by them.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Aspects of Transparency',
                <LayersIcon size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Openness:</strong> This means actively sharing information rather than withholding it. It involves making data, documents, and processes available for public scrutiny.</li>
                    <li><strong>Clarity:</strong> Information must be presented in a way that is easy to understand, avoiding jargon or complex language. It's about ensuring that the information is meaningful and useful to the intended audience.</li>
                    <li><strong>Accessibility:</strong> Information should be readily available to those who need it, regardless of their location or background. This involves using various channels of communication and ensuring that information is available in multiple formats.</li>
                    <li><strong>Accountability:</strong> Transparency enables accountability by allowing others to scrutinize decisions and actions. It creates a system where individuals and organizations are held responsible for their conduct.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Importance of Transparency',
                <Award size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Building Trust:</strong> Transparency fosters trust between individuals, organizations, and governments. When people have access to information, they are more likely to believe that decisions are being made fairly and honestly.</li>
                    <li><strong>Preventing Corruption:</strong> Transparency acts as a deterrent to corruption by making it more difficult to engage in unethical or illegal activities. When actions are visible, it's harder to hide wrongdoing.</li>
                    <li><strong>Promoting Good Governance:</strong> Transparency is essential for good governance, as it allows citizens to hold their leaders accountable. It empowers people to participate in decision-making and ensures that public resources are used effectively.</li>
                    <li><strong>Enhancing Efficiency:</strong> Transparency can improve efficiency by streamlining processes and reducing bureaucratic delays. When information is readily available, it's easier to make informed decisions and avoid unnecessary duplication of effort.</li>
                    <li><strong>Facilitating Public Participation:</strong> Transparency allows for the public to be involved in decisions that impact them. This is especially important in government.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 4: Fairness, Integrity, and Transparency */}
            <div
              ref={(el) => {
                sectionRefs.current['fairness'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Fairness, Integrity, and Transparency
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Fairness: Playing by the rules, treating everyone the same. Integrity: Being honest and doing the right thing, even when no one is watching. Transparency: Being open and clear about what you're doing, so everyone can see.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Fairness: Treating Everyone Equitably',
                    icon: <Scale size={16} />,
                    content: (
                      <>
                        <p>Fairness is about applying rules and principles consistently and impartially. It means giving everyone an equal opportunity and avoiding favoritism or bias. It's about ensuring that decisions are made based on objective criteria, rather than personal preferences or prejudices.</p>
                        <p>Imagine a sports tournament. Fairness would mean that all teams play by the same rules, have equal access to resources, and are judged based on their performance, not on who they are or who they know. In a business context, fairness means that all employees are treated equitably, regardless of their background or position. In public procurement, it means that all suppliers have an equal chance to bid for contracts, and that evaluation criteria are applied consistently. Fairness builds trust and promotes a sense of justice, ensuring that everyone feels valued and respected.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Integrity: Upholding Ethical Principles',
                    icon: <BadgeCheck size={16} />,
                    content: (
                      <>
                        <p>Integrity is about adhering to strong moral and ethical principles, even in the face of adversity. It means being honest, trustworthy, and accountable for one's actions. It's about doing the right thing, even when no one is watching, and maintaining a consistent set of values.</p>
                        <p>A person with integrity would not compromise their values for personal gain or succumb to pressure to act unethically. They would be truthful in their dealings, keep their promises, and take responsibility for their mistakes. In a professional setting, integrity means avoiding conflicts of interest, protecting confidential information, and acting in accordance with ethical codes of conduct. Integrity is the foundation of trust and credibility, both in personal and professional relationships.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Transparency: Ensuring Openness and Clarity',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p>Transparency is about making information and processes visible and accessible to those who are affected by them. It means being open and clear about decisions, actions, and outcomes. It's about removing secrecy and promoting accountability.</p>
                        <p>In government, transparency means that public records are available for scrutiny, and that decision-making processes are open to public participation. In a business context, transparency means that financial information is disclosed accurately and completely, and that stakeholders are informed about important developments. Transparency builds trust and confidence, enabling others to assess the legitimacy and fairness of decisions. It also allows for greater accountability, as actions are subject to public scrutiny. Essentially, it is about allowing people to see how decisions are made, and what information was used to make those decisions.</p>
                      </>
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

            {/* SECTION 5: A Code of Conduct */}
            <div
              ref={(el) => {
                sectionRefs.current['code'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                A Code of Conduct
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A code of conduct for public sector procurement professionals is a set of ethical guidelines that define the expected behavior and standards for individuals involved in public procurement. It aims to ensure integrity, fairness, transparency, and accountability in the use of public funds.
                  </p>
</div>

              {renderCard(
                'Elements of a Code of Conduct',
                <ListChecks size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>1. Integrity and Honesty:</strong> Procurement professionals must act with honesty and integrity at all times, avoiding any actions that could compromise the public interest. This includes being truthful in all communications and dealings, and refusing to engage in any form of corruption or fraud.</li>
                    <li><strong>2. Impartiality and Fairness:</strong> All suppliers and potential suppliers must be treated fairly and impartially, without any favoritism or bias. Decisions must be based on objective criteria and merit, ensuring a level playing field for all participants.</li>
                    <li><strong>3. Transparency and Disclosure:</strong> Procurement processes must be conducted in a transparent manner, with clear and accessible information about tenders, evaluations, and contract awards. Any potential conflicts of interest must be disclosed promptly and openly.</li>
                    <li><strong>4. Confidentiality:</strong> Sensitive information, such as supplier bids and proprietary data, must be treated with strict confidentiality. Information should only be disclosed to authorized personnel and in accordance with legal requirements.</li>
                    <li><strong>5. Accountability and Responsibility:</strong> Procurement professionals are accountable for their actions and decisions, and must act responsibly in the use of public funds. They should maintain accurate records and be prepared to justify their decisions when necessary.</li>
                    <li><strong>6. Compliance with Laws and Regulations:</strong> All procurement activities must comply with applicable laws, regulations, and policies. Procurement professionals should stay informed about relevant legal requirements and ensure that their actions are in accordance with them.</li>
                    <li><strong>7. Conflict of Interest Avoidance:</strong> Procurement professionals must avoid situations where their personal interests could conflict with their professional duties. This includes avoiding financial or personal relationships with suppliers that could compromise their impartiality.</li>
                    <li><strong>8. Professionalism and Competence:</strong> Procurement professionals should maintain a high level of professionalism and strive to enhance their knowledge and skills. They should act with due diligence and exercise sound judgment in their work.</li>
                    <li><strong>9. Ethical Conduct:</strong> Procurement professionals must avoid any actions that would bring discredit to their organization or the public sector. This includes avoiding the acceptance of gifts, favors, or hospitality that could influence their decisions.</li>
                    <li><strong>10. Reporting Irregularities:</strong> Procurement professionals have a duty to report any suspected irregularities or unethical conduct to the appropriate authorities. They should do so without fear of reprisal.</li>
                  </ul>
                </>
              )}

              {renderCard(
                'Purpose of the Code',
                <Target size={16} />,
                <>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To foster a culture of ethical awareness and responsibility within public sector procurement, promoting the highest standards of professional conduct.</li>
                    <li>To proactively deter corrupt practices by establishing clear expectations and guidelines for acceptable behavior.</li>
                    <li>To cultivate and reinforce public confidence in the integrity and impartiality of the public procurement system, ensuring that taxpayer funds are managed with the utmost probity.</li>
                    <li>To provide a structured framework for navigating ethical dilemmas and making sound judgments in complex procurement scenarios.</li>
                    <li>To establish a consistent benchmark for evaluating the performance and conduct of procurement professionals, facilitating effective oversight and accountability.</li>
                    <li>To empower procurement professionals to act as guardians of public resources, ensuring that procurement processes are conducted in a manner that serves the best interests of the public.</li>
                    <li>To serve as a cornerstone for building and maintaining a sustainable and reputable public procurement system, which contributes to overall good governance and economic development.</li>
                    <li>To provide a means of educating those new to the profession, and to continually remind experienced professionals of their ethical obligations.</li>
                  </ul>
                </>
              )}
            </div>

            {/* SECTION 6: Conduct of Bidders and Contractors */}
            <div
              ref={(el) => {
                sectionRefs.current['bidder'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Conduct of Bidders and Contractors
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Think of bidders and contractors as people trying to win a job from the government. The government has rules to make sure they're fair and honest. These rules tell them how to behave during the bidding and contract process.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Honesty and Truthfulness',
                    icon: <FileCheck size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must provide accurate and truthful information in their bids and throughout the contract execution.</p>
                        <p><strong>Explanation:</strong> This means that all submitted documents, statements, and representations must be genuine and free from misrepresentation. For example, a bidder should not falsify their financial statements or exaggerate their experience. This is crucial as it ensures that the procuring entity makes decisions based on reliable information, preventing fraud and ensuring that the selected contractor is capable of fulfilling the contract. Dishonesty undermines the integrity of the procurement process and can lead to legal consequences.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Compliance with Laws and Regulations',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must adhere to all applicable laws, regulations, and procurement rules.</p>
                        <p><strong>Explanation:</strong> This includes complying with labor laws, tax laws, environmental regulations, and any specific procurement rules outlined by the procuring entity. For example, a contractor must ensure that their workers are paid fair wages and that they have obtained all necessary permits. Compliance ensures that public funds are used legally and responsibly, and that the project is executed in accordance with established standards. This protects both the procuring entity and the public interest.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Avoidance of Collusion and Anti-Competitive Practices',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must not engage in any form of collusion, bid rigging, or other anti-competitive practices.</p>
                        <p><strong>Explanation:</strong> This means that bidders should not communicate with each other to fix prices, allocate markets, or manipulate the bidding process. For example, bidders should not agree to submit artificially high or low bids to ensure that a specific bidder wins. Preventing collusion ensures that the procuring entity obtains the best possible value for money through fair competition. Collusion distorts the market and leads to higher costs for the public.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Maintaining Confidentiality',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must maintain the confidentiality of sensitive information obtained during the bidding process and contract execution.</p>
                        <p><strong>Explanation:</strong> This includes protecting proprietary information, trade secrets, and any other confidential data provided by the procuring entity or other bidders. For example, a bidder should not disclose confidential information about their bid to a competitor. Maintaining confidentiality ensures that the integrity of the bidding process is preserved and that sensitive information is protected from unauthorized disclosure. This builds trust between the procuring entity and the bidders.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Disclosure of Conflicts of Interest',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must disclose any potential conflicts of interest that may arise during the bidding process or contract execution.</p>
                        <p><strong>Explanation:</strong> This includes disclosing any financial or personal relationships that could influence their decisions or actions. For example, a bidder should disclose if they have a family member who works for the procuring entity. Disclosing conflicts of interest ensures transparency and allows the procuring entity to take appropriate measures to mitigate any potential risks. This prevents biased decisions and ensures that the public interest is protected.</p>
                      </>
                    ),
                  },
                  {
                    title: '6. Ethical Conduct and Professionalism',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must conduct themselves in an ethical and professional manner at all times.</p>
                        <p><strong>Explanation:</strong> This includes treating all parties with respect, avoiding any form of harassment or discrimination, and acting in accordance with ethical standards. For example, a contractor should not engage in any form of bribery or corruption. Maintaining ethical conduct and professionalism builds trust and ensures that the procurement process is conducted with integrity. This enhances the reputation of both the bidders and the procuring entity.</p>
                      </>
                    ),
                  },
                  {
                    title: '7. Timely Performance and Delivery',
                    icon: <ClockIcon size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Contractors must perform their contractual obligations in a timely manner and deliver goods or services as agreed.</p>
                        <p><strong>Explanation:</strong> This includes adhering to project schedules, meeting deadlines, and ensuring that the quality of work meets the required standards. For example, a contractor should complete construction projects within the agreed timeframe. Timely performance ensures that public projects are completed efficiently and that public needs are met promptly. Delays can lead to increased costs and inconvenience for the public.</p>
                      </>
                    ),
                  },
                  {
                    title: '8. Quality Assurance and Compliance with Specifications',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Contractors must ensure that the goods or services they provide meet the required quality standards and comply with the specifications outlined in the contract.</p>
                        <p><strong>Explanation:</strong> This includes conducting quality control checks, using appropriate materials, and adhering to technical specifications. For example, a contractor should ensure that the materials used in construction projects meet the required standards. Quality assurance ensures that public projects are durable and safe for public use. Failure to comply with specifications can lead to safety hazards and costly repairs.</p>
                      </>
                    ),
                  },
                  {
                    title: '9. Cooperation and Communication',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Bidders and contractors must cooperate with the procuring entity and maintain open communication throughout the procurement process and contract execution.</p>
                        <p><strong>Explanation:</strong> This includes responding to inquiries promptly, providing regular updates, and working collaboratively to resolve any issues that may arise. For example, a contractor should provide regular progress reports to the procuring entity. Effective communication and cooperation facilitate smooth project execution and minimize misunderstandings.</p>
                      </>
                    ),
                  },
                  {
                    title: '10. Adherence to Safety Standards',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Meaning:</strong> Contractors must adhere to all applicable safety standards and regulations during contract execution.</p>
                        <p><strong>Explanation:</strong> This includes providing a safe working environment for their employees, using appropriate safety equipment, and taking necessary precautions to prevent accidents. For example, a construction contractor should ensure that their workers wear safety helmets and that scaffolding is erected safely. Adherence to safety standards protects the lives and well-being of workers and the public. Failure to comply can lead to serious injuries and legal liabilities.</p>
                      </>
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Ethics Insight
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
                  <span>Non-Discrimination Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Code of Conduct Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Bidder Conduct Rules</span>
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
                Uphold non-discrimination and equality of treatment to ensure fairness for all. Practice transparency to build trust and accountability. Embrace fairness, integrity, and transparency as core principles. Follow a comprehensive code of conduct that includes integrity, impartiality, transparency, confidentiality, accountability, legal compliance, conflict of interest avoidance, professionalism, ethical conduct, and reporting of irregularities. Ensure bidders and contractors adhere to honesty, legal compliance, anti-collusion, confidentiality, conflict disclosure, ethical conduct, timely performance, quality assurance, cooperation, and safety standards.
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
                <strong className="text-white">Non-Discrimination &amp; Equality</strong> – Avoid unfair bias and apply the same rules to everyone in similar situations. These principles are interconnected and essential for social inclusion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transparency</strong> – Openness, clarity, and accessibility of information. It builds trust, prevents corruption, promotes good governance, enhances efficiency, and facilitates public participation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Fairness, Integrity &amp; Transparency</strong> – Fairness means consistent application of rules; integrity means ethical principles; transparency means openness. Together they form the bedrock of ethical procurement.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Code of Conduct</strong> – Ten key elements: Integrity, Impartiality, Transparency, Confidentiality, Accountability, Legal Compliance, Conflict Avoidance, Professionalism, Ethical Conduct, and Reporting Irregularities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Bidder/Contractor Conduct</strong> – Ten rules: Honesty, Legal Compliance, Anti-Collusion, Confidentiality, Conflict Disclosure, Ethical Conduct, Timely Performance, Quality Assurance, Cooperation, and Safety Adherence.
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
            Sidemann Academic Registry • Ethics in Procurement Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;