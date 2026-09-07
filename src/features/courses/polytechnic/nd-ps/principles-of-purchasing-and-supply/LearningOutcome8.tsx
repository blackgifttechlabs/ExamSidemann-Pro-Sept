import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  ClipboardCheck,
  Activity,
  AlertCircle,
  HeartHandshake,
  Scale,
  Gavel,
  Leaf,
  Briefcase,
  Handshake,
  Building2,
  UserCheck,
  Sparkles,
  Search,
  X as XIcon,
  RefreshCw as RefreshIcon,
  ChevronUp,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'importance', label: 'Importance' },
  { id: 'factors', label: 'Influencing Factors' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'implications', label: 'Professional Behaviour' },
  { id: 'cips', label: 'CIPS Ethical Code' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
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
        text: 'The CIPS Ethical Code was first established in the 1980s and has been updated regularly to reflect the evolving challenges in global procurement and supply chain management.',
      },
      {
        title: 'Pro Tip',
        text: 'When faced with an ethical dilemma, consider the "sunlight test" — would you be comfortable if your decision was published on the front page of a newspaper?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIPS ethical principles with "IOPART": Integrity, Objectivity, Professionalism, Accountability, Respect for laws, Transparency.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that legal compliance equals ethical conduct. Laws set minimum standards; ethical behaviour often goes beyond what is legally required.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The CIPS Ethical Code was first established in the 1980s and has been updated regularly to reflect the evolving challenges in global procurement and supply chain management.',
      },
      {
        title: 'Pro Tip',
        text: 'When faced with an ethical dilemma, consider the "sunlight test" — would you be comfortable if your decision was published on the front page of a newspaper?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIPS ethical principles with "IOPART": Integrity, Objectivity, Professionalism, Accountability, Respect for laws, Transparency.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume that legal compliance equals ethical conduct. Laws set minimum standards; ethical behaviour often goes beyond what is legally required.',
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

  // Helper to render a clean card (no coloured left border)
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
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; ETHICS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Ethics in{' '}
            <span className="text-orange-300 font-bold italic">
              Purchasing
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to the importance of ethics, influencing factors, relationships, professional behaviour implications, and the CIPS ethical code.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HeartHandshake size={14} className="inline mr-1" /> Ethics
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Integrity
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> CIPS Code
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
                placeholder="Search for a concept, principle, factor..."
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
            {/* SECTION 1: Importance of Ethics in Purchasing */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Importance of Ethics in Purchasing
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about doing the right thing when buying things for a company. It means being fair, honest, and responsible in all your dealings with suppliers and others.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Maintaining Trust and Credibility', icon: <HeartHandshake size={16} />, content: 'Being seen as honest and reliable, so people want to work with you. Ethical practices build trust with suppliers, internal stakeholders, and the community, leading to better pricing, improved quality, and enhanced collaboration.' },
                  { title: '2. Ensuring Fair Competition', icon: <Scale size={16} />, content: 'Giving everyone a fair chance to get business, not just your friends or favourites. Promotes innovation, efficiency, and better value through transparent competitive bidding processes and prevention of collusion.' },
                  { title: '3. Preventing Conflicts of Interest', icon: <AlertCircle size={16} />, content: 'Avoiding situations where your personal interests could affect your decisions at work. Clear guidelines and disclosure requirements help maintain impartiality and ensure decisions are based on the best interests of the organization.' },
                  { title: '4. Upholding Legal and Regulatory Compliance', icon: <Gavel size={16} />, content: 'Following all the laws and rules when buying things. Essential for avoiding fines, legal action, and reputational damage, including laws on bribery, corruption, antitrust, and environmental protection.' },
                  { title: '5. Promoting Sustainable and Socially Responsible Practices', icon: <Leaf size={16} />, content: 'Buying things in a way that is good for the environment and treats people fairly. Includes sourcing materials responsibly, reducing waste, and ensuring ethical labour practices.' },
                  { title: '6. Enhancing Employee Morale and Reputation', icon: <Users size={16} />, content: 'Making employees feel good about their work and making the company look good to others. Contributes to a positive work environment, increased productivity, and a strong reputation as a responsible business.' },
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

            {/* SECTION 2: Factors Influencing Ethical Conduct */}
            <div
              ref={(el) => {
                sectionRefs.current['factors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors Influencing Ethical Conduct
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    These are the things that affect whether people make good or bad choices when it comes to doing the right thing. It is like understanding what makes someone act honestly or dishonestly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Organizational Culture', icon: <Building2 size={16} />, content: 'The overall vibe and rules of the company, which tell people what is okay and what is not. A culture prioritizing integrity, transparency, and fairness encourages ethical behaviour through clear codes, training, and leadership examples.' },
                  { title: '2. Leadership Influence', icon: <UserCheck size={16} />, content: 'How the bosses act, which sets an example for everyone else. Leaders who demonstrate ethical behaviour and hold others accountable set a positive example, creating an environment where ethical concerns are valued.' },
                  { title: '3. Personal Values and Beliefs', icon: null, content: 'What someone believes is right or wrong, based on their own upbringing and experiences. Individuals who value honesty and integrity are more likely to act ethically, reinforced by organizational culture.' },
                  { title: '4. Peer Influence', icon: <Users size={16} />, content: 'What your friends and co-workers do, which can pressure you to do the same. Individuals are influenced by colleagues; positive peer pressure can promote ethical behaviour, while negative influence can encourage unethical practices.' },
                  { title: '5. Code of Ethics and Policies', icon: <ListChecks size={16} />, content: 'The written rules that tell people what is expected of them. Clear and comprehensive codes provide guidance for ethical decision-making, addressing issues like conflicts of interest, bribery, and discrimination.' },
                  { title: '6. Legal and Regulatory Environment', icon: <Gavel size={16} />, content: 'The laws and rules that the government makes, which everyone must follow. Establishes minimum standards for ethical behaviour and provides penalties for non-compliance, though legal compliance alone is not enough.' },
                  { title: '7. Individual Awareness and Training', icon: <BookOpen size={16} />, content: 'Knowing what is right and wrong, and learning how to make good choices. Training programs help employees develop skills to identify ethical dilemmas and evaluate potential solutions, empowering informed choices.' },
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

            {/* SECTION 3: Relationships Between Purchasing, Suppliers, and Users */}
            <div
              ref={(el) => {
                sectionRefs.current['relationships'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Relationships Between Purchasing, Suppliers, and Users
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about how the "buying department" connects with the people who sell things (suppliers) and the people who use those things inside the company (users). It is like a three-way connection that needs to work smoothly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Handshake size={16} /> 1. Purchasing and Suppliers: Collaborative Partnerships
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The "buying department" and the people who sell things should work together like partners. This involves open communication, mutual trust, and a shared understanding of goals. Collaborative partnerships lead to improved quality, reduced costs, and enhanced innovation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Users size={16} /> 2. Purchasing and Users: Internal Customer Service
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The "buying department" should treat the people who use the things they buy as their customers inside the company. This involves clear communication, responsiveness, and a focus on meeting user expectations to ensure they have the resources they need.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Briefcase size={16} /> 3. Suppliers and Users: Direct Interaction (Sometimes)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sometimes, the people who sell things and the people who use them talk to each other directly. This might involve technical discussions, product demonstrations, or troubleshooting. These interactions can improve communication and problem-solving but should be coordinated with purchasing.
                </p>
              </div>
            </div>

            {/* SECTION 4: Implications of Professional Behaviour */}
            <div
              ref={(el) => {
                sectionRefs.current['implications'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implications of Professional Behaviour
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    It is about how acting professionally affects a company's business, its legal standing, and how it works as a whole. It is like understanding how being polite and responsible can impact your job and your company's success.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <TrendingUp size={16} /> Commercial: Enhanced Reputation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Professional behaviour cultivates a positive reputation among customers, suppliers, and partners, fostering trust and leading to increased customer loyalty and repeat business.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Gavel size={16} /> Legal: Reduced Risk
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Compliance with laws, ethical conduct, and accurate record keeping help avoid litigation, penalties, and legal disputes. Professional behaviour minimizes legal risks and protects reputation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Users size={16} /> Organizational: Improved Collaboration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Professional behaviour fosters a positive work environment with respectful communication, active listening, and constructive feedback, leading to improved collaboration and productivity.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Activity size={16} /> Organizational: Enhanced Morale
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Professional behaviour contributes to a positive work environment, enhancing employee morale, motivation, and productivity, while reducing absenteeism and turnover.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Award size={16} /> Commercial: Attracting Top Talent
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Professional behaviour is a key factor in attracting and retaining top talent. A reputation for integrity and a positive work environment makes a company more attractive to highly skilled employees.
                </p>
              </div>
            </div>

            {/* SECTION 5: CIPS Ethical Code */}
            <div
              ref={(el) => {
                sectionRefs.current['cips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Chartered Institute of Purchasing and Supply (CIPS) Ethical Code
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Now known as the Chartered Institute of Procurement &amp; Supply, CIPS has a robust ethical code designed to guide procurement and supply professionals in their conduct. This code is crucial for maintaining integrity and trust within the profession.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Integrity', icon: <Shield size={16} />, content: 'Honesty, fairness, and transparency in all professional dealings. Avoiding actions that compromise integrity or create conflicts of interest. Being truthful, avoiding bribery, and disclosing potential conflicts.' },
                  { title: '2. Objectivity', icon: <Target size={16} />, content: 'Making decisions based on objective criteria, not personal biases or preferences. Evaluating suppliers and proposals fairly based on quality, price, and delivery, rather than personal relationships.' },
                  { title: '3. Professionalism', icon: <Briefcase size={16} />, content: 'Maintaining high standards of professional conduct. Acting with competence, diligence, and respect for others. Maintaining confidentiality, respecting intellectual property, and continuous professional development.' },
                  { title: '4. Accountability', icon: <ClipboardCheck size={16} />, content: 'Taking responsibility for actions and decisions. Being transparent about decision-making processes and accepting consequences. Justifying purchasing decisions and providing evidence to support choices.' },
                  { title: '5. Transparency', icon: <Search size={16} />, content: 'Open and clear communication. Providing accurate and timely information to all stakeholders. Disclosing potential conflicts of interest and providing clear explanations for decisions.' },
                  { title: '6. Respect for Laws and Regulations', icon: <Gavel size={16} />, content: 'Complying with all applicable laws and regulations. Including laws related to bribery, corruption, antitrust, and environmental protection. Essential for maintaining ethical conduct and avoiding legal risks.' },
                  { title: '7. Sustainability', icon: <Leaf size={16} />, content: 'Considering the environmental and social impact of procurement decisions. Promoting sustainable sourcing practices and ensuring suppliers adhere to ethical labour standards. Creating a positive impact on the environment and society.' },
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
                  💡 Ethical Insight
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
                  <span>Importance of Ethics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Influencing Factors</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>CIPS Principles</span>
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
                Ethics in purchasing is about doing the right thing — maintaining trust, ensuring fair competition, preventing conflicts of interest, and upholding legal compliance. Ethical conduct is influenced by organizational culture, leadership, personal values, peer influence, codes of ethics, and training. Professional behaviour has commercial, legal, and organizational implications. The CIPS Ethical Code provides a comprehensive framework for ethical conduct in procurement and supply.
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
                <strong className="text-white">Importance of Ethics</strong> – maintaining trust, ensuring fair competition, preventing conflicts of interest, upholding legal compliance, promoting sustainability, and enhancing employee morale and reputation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Influencing Factors</strong> – organizational culture, leadership influence, personal values, peer influence, codes of ethics, legal environment, and individual awareness and training.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Relationships</strong> – purchasing-supplier collaborative partnerships, purchasing-user internal customer service, and occasional direct supplier-user interactions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Professional Behaviour Implications</strong> – enhanced reputation, reduced legal risk, improved collaboration, enhanced morale, and attracting top talent.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">CIPS Ethical Code</strong> – Integrity, Objectivity, Professionalism, Accountability, Transparency, Respect for Laws, and Sustainability provide a comprehensive ethical framework.
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
            Sidemann Academic Registry • Procurement Ethics &amp; Professional Conduct 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;
