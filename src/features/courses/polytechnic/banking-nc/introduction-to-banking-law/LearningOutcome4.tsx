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
  ListChecks, Info, ThumbsUp, ThumbsDown, Award, CheckCircle, XCircle,
  Handshake, FileCheck, FileX, UserCheck, UserX, Lock, Unlock,
  Briefcase as BriefcaseIcon, UserCog, UserMinus, UserPlus,
  FileSignature, Receipt, Banknote as BanknoteIcon,
  Target
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'essentials',
    title: 'Essentials of a Contract',
    keywords: ['essentials', 'contract', 'offer', 'acceptance', 'intention', 'consideration', 'capacity', 'consent', 'legality', 'void', 'unenforceable'],
  },
  {
    id: 'rights-duties',
    title: 'Rights and Duties of Parties to a Contract',
    keywords: ['rights', 'duties', 'obligations', 'enforce', 'breach', 'performance', 'remedy'],
  },
  {
    id: 'termination',
    title: 'Termination of a Contract',
    keywords: ['termination', 'performance', 'agreement', 'breach', 'impossibility', 'frustration', 'operation of law'],
  },
  {
    id: 'banker-customer',
    title: 'Defining a Banker and a Customer',
    keywords: ['banker', 'customer', 'definition', 'account', 'relationship', 'Ladbroke v Todd', 'debtor', 'creditor'],
  },
  {
    id: 'relationships',
    title: 'Types of Relationships in a Banking Contract',
    keywords: ['relationships', 'debtor', 'creditor', 'principal', 'agent', 'trustee', 'beneficiary', 'banker-customer'],
  },
  {
    id: 'rights-duties-banker',
    title: 'Rights and Duties of Parties (Banker-Customer)',
    keywords: ['rights', 'duties', 'banker', 'customer', 'honour cheques', 'secrecy', 'care', 'statements', 'commission', 'set-off', 'close account'],
  },
  {
    id: 'termination-banker',
    title: 'Termination of a Banker-Customer Contract',
    keywords: ['termination', 'banker', 'customer', 'close account', 'death', 'bankruptcy', 'mental incapacity', 'liquidation'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome4BankingContract: React.FC = () => {
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
              placeholder="Search sections... (e.g., offer, consideration, termination, banker-customer)"
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
              Banking Law: LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Banking <span className="text-amber-300 font-bold italic">Contract</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Understand the essentials of a contract, rights and duties of parties, termination, and the banker-customer relationship.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">banking_contract.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Essentials;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Rights_Duties;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Relationship;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Handshake className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><FileSignature className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: CONTRACT & ESSENTIALS ========== */}
        <SectionWrapper id="essentials">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Banking Contract 🤝</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A contract is a central concept in banking. Every single transaction, from opening an account to taking out a loan, is based on a contract. Understanding what a contract is and what makes it valid is essential for an Assistant Banker to manage the relationship with customers correctly and professionally.</p>
              <h3 className="text-xl font-bold mt-4">Contract</h3>
              <p>A contract is a legally binding agreement between two or more parties. It creates rights and obligations that are enforceable by law. The essence of a contract is that it is more than just a simple promise. When parties enter into a contract, they intend for the agreement to have legal consequences. This means that if one party fails to fulfill their side of the agreement, the other party can take legal action to get a remedy (e.g., compensation or specific performance). For example, a loan agreement is a contract: the bank promises to lend money, and the customer promises to pay it back with interest.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Essentials of a Contract</h3>
              <p>For an agreement to be considered a legally valid and enforceable contract, it must contain several key elements. If even one of these elements is missing, the agreement may be considered void or unenforceable by a court.</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><Handshake size={18} /> Offer and Acceptance</h4>
                  <p className="text-sm">One party must make a clear and definite offer, and the other must give a clear and unconditional acceptance. The acceptance must mirror the offer exactly.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2"><Target size={18} /> Intention to Create Legal Relations</h4>
                  <p className="text-sm">The parties must intend for their agreement to have legal consequences. In a business context like banking, this is always assumed.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><DollarSign size={18} /> Consideration</h4>
                  <p className="text-sm">Something of value exchanged between the parties. It can be a promise to do something, or a promise not to do something.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2"><UserCheck size={18} /> Capacity to Contract</h4>
                  <p className="text-sm">All parties must have the legal capacity: legal age (18+), sound mind, and not legally disqualified.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><Shield size={18} /> Consent</h4>
                  <p className="text-sm">The agreement must be entered into with free and genuine consent, not obtained through coercion, fraud, misrepresentation, or undue influence.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Scale size={18} /> Legality of Object</h4>
                  <p className="text-sm">The purpose or objective of the contract must be legal. A contract to perform an illegal act is void from the start.</p>
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: RIGHTS AND DUTIES ========== */}
        <SectionWrapper id="rights-duties">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Rights and Duties of Parties to a Contract 🤝</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Once a valid contract has been formed, it creates a set of rights and obligations for each party involved. The core principle is that the right of one party is the duty of the other.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Rights</h3>
                <p>A right is a legal entitlement to receive a certain benefit or performance from the other party. In a banking contract:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>The Bank's Right:</strong> A bank has the right to receive repayment of a loan from the customer, along with interest, according to the agreed-upon schedule.</li>
                  <li><strong>The Customer's Right:</strong> A customer has the right to receive the agreed-upon loan amount from the bank. If it is a deposit account, the customer has the right to access their funds on demand.</li>
                </ul>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Duties</h3>
                <p>A duty is a legal obligation to perform a specific action or to refrain from a certain act. It is the flip side of a right. In a banking contract:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>The Bank's Duty:</strong> A bank has a duty to lend the agreed-upon amount to the customer. For a deposit account, the bank has a duty to keep the customer's funds safe and to repay them on demand.</li>
                  <li><strong>The Customer's Duty:</strong> A customer has a duty to repay the loan principal and interest to the bank.</li>
                </ul>
              </div>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p className="text-center text-gray-600 dark:text-gray-400 italic">In essence, a contract is a two-way street. Both parties have rights they can enforce and duties they must fulfill. Failure to perform a duty constitutes a breach of contract, which can lead to legal action.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: TERMINATION ========== */}
        <SectionWrapper id="termination">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Termination of a Contract 🔚</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A contract is not meant to last forever. It can be brought to an end in several ways. When a contract is terminated, the parties are released from their legal obligations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Award size={20} /> 1. By Performance</h3>
                <p>This is the most common and desirable way for a contract to end. A contract is terminated by performance when both parties have fully and satisfactorily fulfilled all their duties and obligations.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> A loan agreement is terminated when the customer has made all the required principal and interest payments.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> 2. By Agreement</h3>
                <p>The parties can mutually agree to end the contract, even if it has not been fully performed. This agreement to terminate must itself be a valid contract.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> A bank and its customer can agree to cancel a service agreement that is no longer needed.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 3. By Breach</h3>
                <p>A contract can be terminated when one party fails to perform a major or fundamental duty, known as a material breach. The innocent party has the right to terminate and sue for damages.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> If a bank fails to provide the agreed-upon loan funds, the customer can terminate and sue for losses.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> 4. By Impossibility (Frustration)</h3>
                <p>A contract can be terminated if a major unforeseen event makes it impossible or illegal to perform. The event must not be the fault of either party.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2"><strong>Example:</strong> If a law is passed that makes a certain banking transaction illegal.</p>
              </div>
              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 5. By Operation of Law</h3>
                <p>A contract can be terminated automatically under certain legal circumstances, such as the bankruptcy of one of the parties.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: DEFINING BANKER AND CUSTOMER ========== */}
        <SectionWrapper id="banker-customer">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Defining a Banker and a Customer</h2>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Defining a Banker</h3>
              <p>A banker is a person or company that carries on the business of banking. This definition is not just about having a name like "bank." The business of banking is legally defined by its core activities, which include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Accepting deposits of money from the public.</li>
                <li>Honouring cheques or similar orders drawn on those deposits.</li>
                <li>Providing a range of other financial services, such as granting loans and managing investments.</li>
              </ul>
              <p className="mt-2">An institution must perform all of these core functions to be legally considered a banker. This definition is crucial because it gives the institution certain legal rights and duties that are not available to other types of businesses.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Defining a Customer</h3>
              <p>A customer in banking law is a person or entity that has an account with a bank. The key legal aspect is the relationship with the bank, not just a single transaction. A person only becomes a customer when they have an account opened in their name and a habit of dealing with the bank.</p>
              <p className="mt-2">The landmark legal case of <strong className="font-bold text-indigo-600 dark:text-indigo-400">Ladbroke & Co v Todd</strong> established that the moment a person goes to a bank to open an account, they enter into a customer relationship, even if the account is not yet active.</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">The rights and duties in a banking contract only apply to someone who is legally a customer.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: TYPES OF RELATIONSHIPS ========== */}
        <SectionWrapper id="relationships">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Types of Relationships in a Banking Contract</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The relationship between a banker and a customer is complex and involves several legal roles. The most important relationship is that of debtor and creditor, but others exist as well.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Debtor and Creditor</h3>
                <p><strong>When a customer deposits money:</strong> The bank becomes the debtor and the customer is the creditor. The bank owes the customer the money deposited.</p>
                <p className="mt-2"><strong>When the customer borrows money:</strong> The customer becomes the debtor, and the bank is the creditor.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This is the primary relationship in banking.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCog size={20} /> Principal and Agent</h3>
                <p>The bank acts as an agent for the customer when it performs services on the customer's behalf.</p>
                <p className="mt-2"><strong>Example:</strong> When a bank collects a cheque for a customer or makes a payment to a third party as per the customer's instructions, it is acting as an agent.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Trustee and Beneficiary</h3>
                <p>This relationship exists when a bank holds assets or securities on behalf of a customer.</p>
                <p className="mt-2">The bank is the <strong>trustee</strong>, and the customer is the <strong>beneficiary</strong>. The bank has a legal duty to manage the assets for the benefit of the customer.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: RIGHTS AND DUTIES (BANKER-CUSTOMER) ========== */}
        <SectionWrapper id="rights-duties-banker">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Rights and Duties of Parties (Banker-Customer)</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The banker-customer relationship is built on a contract that gives both parties specific rights and duties.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Banker's Duties</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Duty to Honour Cheques:</strong> A bank must honour a customer's cheques as long as there are sufficient funds and no legal reason to refuse payment.</li>
                  <li><strong>Duty of Secrecy:</strong> A bank must not reveal a customer's financial details to anyone without the customer's permission or a legal order.</li>
                  <li><strong>Duty of Care:</strong> A bank must exercise reasonable care and skill in handling its customer's business.</li>
                  <li><strong>Duty to Provide Statements:</strong> The bank has a duty to provide a customer with a periodic statement of their account.</li>
                </ul>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Banker's Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Right to Charge Commission and Interest:</strong> A bank has the right to charge for its services and to charge interest on loans and overdrafts.</li>
                  <li><strong>Right of Set-off:</strong> A bank has the right to combine a customer's different accounts and transfer money to settle a debt.</li>
                  <li><strong>Right to Close an Account:</strong> The bank has the right to close a customer's account, but it must give reasonable notice.</li>
                </ul>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Customer's Duties</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Duty to Exercise Care:</strong> A customer must exercise reasonable care when drawing a cheque to prevent fraud and must inform the bank immediately if they suspect fraud.</li>
                  <li><strong>Duty to Inform:</strong> The customer must inform the bank of any changes to their details, such as their address or name.</li>
                </ul>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Customer's Rights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Right to Have Cheques Honoured:</strong> A customer has the right to have a cheque honoured as long as they have sufficient funds.</li>
                  <li><strong>Right to Secrecy:</strong> A customer has the right to expect that their financial details will be kept confidential.</li>
                  <li><strong>Right to a Statement of Account:</strong> A customer has the right to receive a statement of their account to verify all transactions.</li>
                </ul>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 7: TERMINATION OF BANKER-CUSTOMER CONTRACT ========== */}
        <SectionWrapper id="termination-banker">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Termination of a Banker-Customer Contract</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The contract between a banker and a customer can be terminated in several ways, releasing both parties from their obligations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserPlus size={20} /> By the Customer</h3>
                <p>The customer can terminate the contract at any time by simply closing their account.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserMinus size={20} /> By the Banker</h3>
                <p>A bank can terminate the contract and close a customer's account, but it must give the customer reasonable notice. The length of this notice depends on the circumstances but is typically specified in the account's terms and conditions.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> By Mutual Agreement</h3>
                <p>Both parties can agree to terminate the contract. This is a common method for business banking relationships that are no longer needed.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> By Operation of Law</h3>
                <p>The contract is automatically terminated by law in certain circumstances, such as:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>The death of the customer.</li>
                  <li>The bankruptcy of the customer.</li>
                  <li>The mental incapacity of the customer.</li>
                  <li>If the bank ceases to operate or is put into liquidation.</li>
                </ul>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of LO4 — Banking Contract</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contract</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Offer & Acceptance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Consideration</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Capacity</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rights & Duties</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Termination</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banker-Customer</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Debtor-Creditor</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Banking Contracts. 📝🏦</p>
        </footer>

      </div>
    </div>
  );
};

export const LearningOutcome4 = LearningOutcome4BankingContract;
