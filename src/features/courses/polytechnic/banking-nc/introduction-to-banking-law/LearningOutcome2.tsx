import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, TrendingUp, AlertTriangle,
  Database, Activity, Clock, Droplet, Zap, Layers, Users,
  BookOpen, Briefcase, BarChart, Link, Scale,
  ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  CornerUpRight, CornerUpLeft, Play, Eye, Lightbulb, RefreshCw,
  Crown, User, Swords, Calendar, Anchor,
  Landmark, Coins, Building, Hand, Home, Globe, ShieldCheck,
  Wifi, CreditCard, Banknote, Building2, Wallet, PieChart,
  PiggyBank, Truck, Heart, Sparkles, Gavel, Book, FileText,
  CheckSquare, Equal, Scale as ScaleIcon, Users as UsersIcon,
  ListChecks, Info, ThumbsUp, ThumbsDown, Award, CheckCircle, XCircle
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'sources',
    title: 'Sources of Banking Law',
    keywords: ['sources', 'banking law', 'legislation', 'statutes', 'judicial precedence', 'case law', 'customary law', 'common law', 'stare decisis'],
  },
  {
    id: 'advantages-disadvantages',
    title: 'Advantages and Disadvantages of Each Source',
    keywords: ['advantages', 'disadvantages', 'legislation', 'judicial precedence', 'case law', 'customary law', 'common law', 'pros', 'cons'],
  },
  {
    id: 'registration',
    title: 'Registration of a New Bank',
    keywords: ['registration', 'new bank', 'license', 'preliminary application', 'formal application', 'commencement', 'RBZ', 'central bank'],
  },
  {
    id: 'regulation',
    title: 'Importance of Regulating Banks',
    keywords: ['regulation', 'importance', 'depositors', 'financial stability', 'competition', 'financial crime', 'AML', 'KYC', 'public trust'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ keyword: string; sectionId: string; sectionTitle: string }[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark mode effect
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    const matches = searchIndex.filter(item => item.keyword.includes(query));
    const unique = matches.reduce((acc, current) => {
      if (!acc.some(item => item.sectionId === current.sectionId)) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof matches);
    setSuggestions(unique.slice(0, 6));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const first = suggestions[0];
      scrollToSection(first.sectionId);
    }
  };

  const handleSuggestionClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setSearchQuery('');
    setSuggestions([]);
  };

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedSection(sectionId);
      setTimeout(() => {
        setHighlightedSection(null);
      }, 3000);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  // Styling helpers
  const containerClasses = isDarkMode
    ? 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-12';

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: '',
      green: '',
      purple: '',
      amber: '',
      red: '',
      indigo: '',
      pink: '',
      teal: '',
      orange: '',
    };
    const borderColor = colorMap[color] || colorMap.blue;
    const base = `py-4 mb-4 ${borderColor}`;
    const dark = isDarkMode ? 'bg-[#252526]' : 'bg-white';
    return `${dark} ${base} hover:-translate-y-1 hover:scale-[1.01]`;
  };

  // Corrected SectionWrapper with proper ref callback
  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const isHighlighted = highlightedSection === id;
    return (
      <div
        ref={(el) => {
          if (sectionRefs.current) {
            if (el) {
              sectionRefs.current[id] = el;
            } else {
              delete sectionRefs.current[id];
            }
          }
        }}
        className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-70 shadow-2xl rounded-lg' : ''}`}
        style={{ scrollMarginTop: '80px' }}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      
      {/* SEARCH BAR */}
      <div className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md p-4 rounded-b-2xl shadow-lg dark:bg-gray-800/80 bg-white/80 transition-all duration-300">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections... (e.g., legislation, precedent, registration, regulation)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-10 py-3 rounded-full border-2 border-indigo-300 dark:border-indigo-600 bg-white/90 dark:bg-gray-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {suggestions.map((sug) => (
                <div
                  key={sug.sectionId}
                  onClick={() => handleSuggestionClick(sug.sectionId)}
                  className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <FolderTree className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-sm">{sug.sectionTitle}</span>
                  <span className="text-xs text-gray-400 ml-auto">({sug.keyword})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className={`relative w-full mb-12 rounded-[5px] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'} mt-4`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Banking Law: LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Sources of <span className="text-sky-300 font-bold italic">Banking Law</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the key sources of banking law, their advantages and disadvantages, the bank registration process, and the importance of bank regulation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">sources_banking_law.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Sources;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Pros_Cons;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Registration;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><BookOpen className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Gavel className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: SOURCES OF BANKING LAW ========== */}
        <SectionWrapper id="sources">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Sources of Banking Law</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Banking law, like most areas of law, does not come from a single source. It is built from several key origins that work together to form the legal framework for the banking industry. For an Assistant Banker, understanding these sources is vital for managing banker-customer relationships correctly.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Book size={20} /> a) Legislation (Statutes)</h3>
              <p><strong>Legislation, also known as statute law, refers to laws that are formally created and passed by a country's parliament or legislature.</strong> It is one of the most important sources of banking law because it provides a clear and written set of rules that banks and their customers must follow. These laws are often very detailed and regulate specific areas of banking to ensure stability and fairness.</p>
              <p>For example, in many countries, there are specific acts that govern the banking sector. These laws define what a bank is, what activities it can carry out, and what rules it must follow. They cover things like:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The licensing and regulation of banks.</li>
                <li>The management of customer accounts.</li>
                <li>Rules on anti-money laundering and combating the financing of terrorism.</li>
                <li>Regulations for electronic payments and mobile banking.</li>
                <li>Laws that protect consumers from unfair practices.</li>
              </ul>
              <p>These acts are a primary reference for any legal matter in banking. If there is a dispute, a court will first look to see what the relevant legislation says on the matter.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> b) Judicial Precedence (Case Law)</h3>
              <p><strong>Judicial precedence is a source of law that is created by judges in courts.</strong> When a judge makes a decision in a specific case, that decision becomes a precedent, or a rule, that must be followed by other judges in future cases with similar facts. This is a core part of the common law legal system. The principle is known as <em>stare decisis</em>, which is Latin for "to stand by things decided."</p>
              <p>In banking, judicial precedence is very important because not every situation can be covered by legislation. When a new issue arises, or when a law is not clear, a court's ruling helps to clarify and develop the law. For example, a legal case might define what constitutes a "reasonable time" for a bank to clear a cheque, and that ruling then becomes a precedent that other banks and courts must follow.</p>
              <p><strong>How it works in practice:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A legal case is brought before a court, for example, a dispute over a bank's duty of care to its customers.</li>
                <li>The judge hears the arguments and makes a ruling.</li>
                <li>The judge's reasoning and final decision form the precedent for all similar future cases.</li>
              </ul>
              <p>Therefore, an Assistant Banker must not only understand legislation but also be aware of important court decisions that have shaped banking practice. These rulings help to fill in the gaps left by written law and provide a comprehensive legal framework.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hand size={20} /> c) Customary Law</h3>
              <p><strong>Customary law is a source of law based on the long-standing practices and customs of a community that have been accepted as legally binding.</strong> These traditions are not written down in legislation but are followed because of historical usage and a general belief that they represent the correct and proper way to do things.</p>
              <p>While modern banking is primarily governed by legislation, custom and practice still play a role in banking law. Certain practices have become so ingrained in the banking industry that they are considered legally binding. For example, the custom of bankers to observe secrecy about their customers' accounts is a key part of the banker-customer relationship, even though it is now also protected by modern law. In some African countries, local business practices and customs, particularly in informal financial sectors, can also be considered a source of legal precedent.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> d) Common Law</h3>
              <p><strong>Common law is a legal system that is based on judicial precedence (or case law), as opposed to statutes written by a legislature.</strong> It is a body of law created by judges through court decisions. When a judge makes a ruling, it becomes a precedent that judges in similar future cases must follow. This system allows the law to evolve and adapt to new situations over time.</p>
              <p>In the context of banking law, common law is a foundational source. Many of the principles that define the banker-customer relationship, such as the duty of a bank to act with reasonable care, were not originally written in legislation but were developed and refined over centuries through a series of court cases. These principles have become so fundamental that they are now often codified (written into law) in modern banking legislation.</p>
              <p>It is important to understand the relationship between common law and legislation. While legislation can override common law principles, the common law remains relevant for interpreting statutes, filling in gaps, and addressing issues not specifically covered by written law. For an Assistant Banker, being aware of common law principles is crucial for understanding the basic duties and responsibilities owed to customers.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: ADVANTAGES AND DISADVANTAGES ========== */}
        <SectionWrapper id="advantages-disadvantages">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Advantages and Disadvantages of Each Source</h2>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Book size={20} /> 1. Legislation (Statutes)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><ThumbsUp size={18} /> Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Clarity and Certainty: Laws are written down, making them easy to understand.</li>
                    <li>Uniformity: Applies to all banks and customers consistently.</li>
                    <li>Responsiveness: Quick way to introduce new laws for major changes.</li>
                    <li>Comprehensive: Can cover a wide range of issues in one document.</li>
                    <li>Democratically Enacted: Passed by elected officials, providing legitimacy.</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><ThumbsDown size={18} /> Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Inflexibility: Slow to adapt to specific or unusual cases.</li>
                    <li>Vague Language: Broad nature can lead to uncertainty.</li>
                    <li>Slow to Amend: Changing a law is a long, complex process.</li>
                    <li>Can be Politically Motivated: May not always serve the industry's best interests.</li>
                    <li>Risk of Gaps: May not foresee every possible scenario.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> 2. Judicial Precedence (Case Law)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><ThumbsUp size={18} /> Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Flexibility: Judges can create new law for unique cases.</li>
                    <li>Practical: Developed from real-world disputes.</li>
                    <li>Detailed Principles: Court judgments offer deep understanding.</li>
                    <li>Consistency: <em>Stare decisis</em> ensures similar cases are treated similarly.</li>
                    <li>Fills Gaps: Complements legislation.</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><ThumbsDown size={18} /> Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Slow Development: Only created when a case is brought to court.</li>
                    <li>Complexity: Requires specialized legal knowledge to interpret.</li>
                    <li>Inconsistency: Different courts might make conflicting rulings.</li>
                    <li>Reactive: A problem must occur before a principle is established.</li>
                    <li>Rigidity: A precedent can be difficult to change.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hand size={20} /> 3. Customary Law</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><ThumbsUp size={18} /> Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Practicality: Based on long-standing, accepted practices.</li>
                    <li>Community-Driven: Created by community beliefs and practices.</li>
                    <li>Efficiency: Can solve problems without formal proceedings.</li>
                    <li>Evolutionary: Adapts slowly as business practices change.</li>
                    <li>Informal: Provides a quick way to settle disputes.</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><ThumbsDown size={18} /> Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Unwritten: Difficult to prove in court.</li>
                    <li>Uncertainty: Lacks the clarity of legislation.</li>
                    <li>Limited Scope: Limited role in highly regulated banking.</li>
                    <li>Slow to Change: Traditions are often resistant to change.</li>
                    <li>Can be Discriminatory: Some customs may be unfair.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 4. Common Law</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><ThumbsUp size={18} /> Advantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Adaptability: Evolves to meet changing societal needs.</li>
                    <li>Fairness: Based on consistent application of justice.</li>
                    <li>Fills Legal Gaps: Provides a safety net for issues not covered by legislation.</li>
                    <li>Comprehensive: Rich body of legal principles.</li>
                    <li>Practical: Developed from real-life disputes.</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><ThumbsDown size={18} /> Disadvantages</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Lack of Certainty: Hard to predict rulings in new situations.</li>
                    <li>Slow: Court cases to set precedent can be slow and expensive.</li>
                    <li>Rigidity: <em>Stare decisis</em> can make the law too rigid.</li>
                    <li>Reliance on Legal Expertise: Less accessible to the public.</li>
                    <li>Bias: A judge's personal bias can influence rulings.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: REGISTRATION OF A NEW BANK ========== */}
        <SectionWrapper id="registration">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Registration of a New Bank</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>To get a license for a new bank, a company must go through a formal and detailed process with the country's central bank, like the Reserve Bank of Zimbabwe (RBZ). The purpose of this is to ensure that only serious, well-capitalised, and professionally-run institutions are allowed to operate as banks.</p>
              <p><strong>The registration process can be broken down into three main stages:</strong></p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Info size={20} /> Stage 1: The Preliminary Application</h3>
              <p>This is the initial step where the promoters or founders of the new bank submit a formal proposal to the central bank. The goal here is to get a provisional green light before going to the expense of a full application. This stage involves providing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>A Detailed Business Plan:</strong> This document must explain the bank's vision, mission, and how it plans to operate. It should outline the type of banking services it will offer (e.g., commercial, merchant, or microfinance), its target market, and its long-term financial projections.</li>
                <li><strong>Information on Promoters and Directors:</strong> The central bank will scrutinize the backgrounds of the people behind the new bank. They must be considered "fit and proper," meaning they have a good reputation, relevant experience in finance, and no criminal history.</li>
                <li><strong>Proof of Capital:</strong> The promoters must show they have access to the minimum required capital, which is a significant amount set by the central bank. This ensures the bank is financially stable from the start.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Stage 2: The Formal Application</h3>
              <p>If the preliminary application is approved, the company can move to the full application. This stage is much more detailed and requires a lot of documentation. The central bank will conduct a thorough investigation into all aspects of the proposed bank. This includes submitting:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Comprehensive Financial Statements:</strong> Detailed financial forecasts, including projected balance sheets, income statements, and cash flow statements for the first three to five years.</li>
                <li><strong>Corporate Governance Structure:</strong> Documentation showing the proposed organizational structure, including the board of directors, management committees, and risk management policies.</li>
                <li><strong>IT Systems and Security:</strong> A full plan of the bank's proposed IT infrastructure, including security protocols, data protection measures, and disaster recovery plans.</li>
                <li><strong>Detailed Policies and Procedures:</strong> Manuals outlining how the bank will handle everything from loan applications to customer complaints, anti-money laundering (AML) and know-your-customer (KYC) procedures.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Award size={20} /> Stage 3: The Licensing and Commencement of Operations</h3>
              <p>After a successful review of the formal application, the central bank will grant the new bank a provisional license. This is a critical period where the bank must get ready for business. It involves:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Inspection of Premises:</strong> The central bank will inspect the bank's physical premises to ensure they are secure and ready for operation.</li>
                <li><strong>Final Verification:</strong> The bank will need to show that all its proposed systems, policies, and procedures are fully in place and operational.</li>
                <li><strong>Granting of the Final License:</strong> Once all conditions are met, the central bank will issue the final banking license, allowing the bank to officially open its doors to the public.</li>
              </ul>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">This entire process is designed to protect the public from poorly managed banks and to maintain the integrity of the country's financial system.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: IMPORTANCE OF REGULATING BANKS ========== */}
        <SectionWrapper id="regulation">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Importance of Regulating Banks</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Bank regulation is crucial for maintaining the stability and integrity of a country's financial system.</strong> It involves a set of rules and guidelines that banks must follow, typically enforced by the country's central bank. Without regulation, the banking sector could be a source of economic instability, fraud, and a loss of public trust.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 1. Protecting Depositors and Customers</h3>
              <p>The most important reason for regulating banks is to protect the money that people and businesses entrust to them. Regulations ensure that banks operate in a safe and sound manner, and they have enough capital to absorb potential losses. This prevents a scenario where a bank collapses and depositors lose their life savings. Deposit protection schemes are often part of this, where a certain amount of a customer's money is guaranteed by the government even if a bank fails.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> 2. Maintaining Financial Stability</h3>
              <p>Banks are interconnected, and the failure of one bank can have a domino effect, leading to a collapse of the entire financial system (known as a systemic crisis). Regulation helps to prevent this by ensuring banks do not take excessive risks. Regulations on capital adequacy and liquidity ensure that banks have enough cash on hand to meet their obligations, even during difficult times. This reduces the risk of a widespread banking crisis.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> 3. Promoting Competition and Efficiency</h3>
              <p>Regulation can also be used to promote fair competition within the banking sector. By setting clear rules, regulators can prevent monopolistic behaviour and ensure that no single bank has too much power. This encourages banks to be more efficient and to offer better services and lower prices to their customers.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 4. Combating Financial Crime</h3>
              <p>Banks are a key battleground for fighting financial crime, such as money laundering and terrorism financing. Regulations require banks to implement strict Anti-Money Laundering (AML) and Know Your Customer (KYC) procedures. These rules force banks to verify the identity of their customers and report any suspicious transactions, making it much harder for criminals to use the financial system for illegal activities.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> 5. Ensuring Public Trust</h3>
              <p>Public trust is the foundation of the banking system. If people do not trust that their money is safe in a bank, they will stop using banks, which would be disastrous for the economy. By enforcing high standards of conduct, transparency, and accountability, regulation helps to build and maintain public confidence in the banking sector.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of LO2 — Sources of Banking Law</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legislation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Judicial Precedence</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customary Law</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Common Law</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bank Registration</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Regulation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">AML/KYC</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Sources of Banking Law. ⚖️📖</p>
        </footer>

      </div>
    </div>
  );
};
