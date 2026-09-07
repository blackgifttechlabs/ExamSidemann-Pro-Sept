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
  ListChecks
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'defining',
    title: 'Defining Banking Law',
    keywords: ['banking law', 'definition', 'commercial law', 'framework', 'stability', 'consumer protection', 'disputes'],
  },
  {
    id: 'purpose',
    title: 'The Purpose of Law',
    keywords: ['purpose', 'law', 'order', 'rights', 'disputes', 'rules', 'protect', 'resolve'],
  },
  {
    id: 'tenets',
    title: 'Tenets of Good Law',
    keywords: ['tenets', 'good law', 'clarity', 'certainty', 'consistency', 'impartiality', 'enforceability', 'flexibility', 'accessibility'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome1: React.FC = () => {
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
              placeholder="Search sections... (e.g., banking law, purpose, tenets)"
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
              Banking Law: Introduction
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Introduction to <span className="text-emerald-300 font-bold italic">Banking Law</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Understand the definition of banking law, the purpose of law in society, and the tenets that make good law effective and fair.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">banking_law.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Definition;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Purpose;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Tenets;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Gavel className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: DEFINING BANKING LAW ========== */}
        <SectionWrapper id="defining">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Defining Banking Law</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Banking law</strong> is a specialized area of law that governs the business of banking and the relationship between a banker and their customer. It is a subset of commercial law and is designed to create a clear framework for all banking activities. This includes rules and regulations on taking deposits, granting loans, processing cheques, managing electronic transfers, and protecting customer privacy.</p>
              <p>The purpose of banking law is to ensure the stability of the financial system, protect consumers from unfair practices, and provide a clear set of rules for resolving any disputes that may arise between banks and their customers.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Scope of Banking Law</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Regulation of Banks:</strong> Licensing, capital requirements, and ongoing supervision.</li>
                <li><strong>Customer Protection:</strong> Ensuring fair treatment, privacy, and transparency.</li>
                <li><strong>Contracts and Lending:</strong> Rules for loans, mortgages, and other credit products.</li>
                <li><strong>Payment Systems:</strong> Cheques, electronic transfers, and clearing.</li>
                <li><strong>Dispute Resolution:</strong> Mechanisms for handling complaints and legal conflicts.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: THE PURPOSE OF LAW ========== */}
        <SectionWrapper id="purpose">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The Purpose of Law</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>At its most basic level, the purpose of law is to maintain order, protect people's rights, and provide a framework for resolving disputes in society. Without laws, there would be chaos and injustice. Think of the law as the rules of a game; everyone agrees to follow them so that the game can be played fairly and safely.</p>
              <p><strong>The law serves three primary functions:</strong></p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> 1. To Establish Rules and Order</h3>
              <p>Laws provide a set of clear rules of conduct for all members of society. This predictability allows people to go about their daily lives and business activities with confidence, knowing what is expected of them and others. For example, traffic laws ensure that drivers know which side of the road to drive on and how to act at intersections, which helps to prevent accidents.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 2. To Protect Rights and Freedoms</h3>
              <p>Law protects the fundamental rights of individuals and organizations. This includes the right to own property, the right to a fair trial, and the right to enter into contracts. In a banking context, laws protect a customer's right to their money and ensure that a bank cannot simply take it away without cause.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 3. To Resolve Disputes</h3>
              <p>When disagreements happen, the law provides a formal and fair process to resolve them. Instead of people taking matters into their own hands, a legal system provides courts and legal procedures to settle arguments and enforce agreements. For a bank and its customer, this means that if there is a dispute over a loan or a fee, a legal process exists to find a solution.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: TENETS OF GOOD LAW ========== */}
        <SectionWrapper id="tenets">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Tenets of Good Law</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>For a legal system to be effective and respected, its laws should have certain characteristics, often called tenets of good law. These are the key principles that ensure the law is fair and serves its purpose.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> 1. Clarity and Certainty</h3>
              <p>A good law should be easy to understand and unambiguous. If a law is confusing, people will not know how to follow it and may accidentally break it. The language used should be clear and precise.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Equal size={20} /> 2. Consistency and Impartiality</h3>
              <p>The law must be applied equally to everyone, regardless of their status, wealth, or power. It should not be biased. This ensures fairness and builds public trust in the legal system.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> 3. Enforceability</h3>
              <p>A law that cannot be enforced is not a good law. There must be a system of police, courts, and other government bodies to ensure that laws are obeyed and that those who break them face consequences.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> 4. Flexibility</h3>
              <p>Laws must be able to adapt to changes in society, technology, and business. A law made 55 years ago may not be relevant today, so a good legal system has a way to change and update its rules over time.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 5. Accessibility</h3>
              <p>Everyone should be able to access information about the law and the legal system. This includes being able to find legal documents and get help when needed. If a law is a secret, it cannot be a good one.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Introduction to Banking Law</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banking Law</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Purpose of Law</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rules & Order</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rights</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispute Resolution</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clarity</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Consistency</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enforceability</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Flexibility</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accessibility</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Banking Law. ⚖️📚</p>
        </footer>

      </div>
    </div>
  );
};