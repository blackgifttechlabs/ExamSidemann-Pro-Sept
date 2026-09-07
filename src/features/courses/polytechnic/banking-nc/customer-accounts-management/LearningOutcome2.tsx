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
  Pen, PenTool, Signature, File, FileStack,
  FileSpreadsheet, FileDigit, FileClock, FileCheck as FileCheckIcon,
  Ticket, TicketCheck, TicketX, StickyNote,
  MessageCircle, Mic, Ear, Users as UsersIcon2, Target, Focus,
  HelpCircle, MessageSquare, Mail, Send, Phone, Video,
  Smile, Frown, Meh, UserPlus as UserPlusIcon,
  UserMinus as UserMinusIcon, UserCheck as UserCheckIcon,
  Shield as ShieldIcon, Lock as LockIcon, Key, Fingerprint,
  BadgeCheck, Award as AwardIcon, Star, Crown as CrownIcon,
  Building as BuildingIcon, Home as HomeIcon, School, Church,
  Briefcase as BriefcaseIcon2, Truck as TruckIcon,
  PiggyBank as PiggyBankIcon, Coins as CoinsIcon,
  UserCircle, UserCog as UserCogIcon, Users as UsersIcon3,
  Leaf
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'types-accounts',
    title: 'Types of Accounts Offered by Banks',
    keywords: ['account types', 'current account', 'savings account', 'loan account', 'investment account', 'corporate account', 'transactional', 'fixed deposit'],
  },
  {
    id: 'characteristics',
    title: 'Characteristics, Advantages, and Disadvantages',
    keywords: ['characteristics', 'advantages', 'disadvantages', 'current', 'savings', 'investment', 'loan', 'corporate'],
  },
  {
    id: 'customer-types',
    title: 'Types of Bank Customers and Their Needs',
    keywords: ['customer types', 'individuals', 'retail', 'SME', 'corporation', 'institution', 'NGO', 'needs'],
  },
  {
    id: 'loans',
    title: 'Types of Loans Offered by Banks',
    keywords: ['loans', 'personal loan', 'mortgage', 'vehicle finance', 'business loan', 'agricultural loan', 'overdraft', 'secured', 'unsecured'],
  },
  {
    id: 'termination',
    title: 'Circumstances Which May Lead to the Termination of Bank Accounts',
    keywords: ['termination', 'account closure', 'voluntary', 'involuntary', 'fraud', 'dormant', 'abusive', 'false information'],
  },
  {
    id: 'documents',
    title: 'Documents Required When Opening a Bank Account',
    keywords: ['documents', 'KYC', 'know your customer', 'proof of identity', 'proof of residence', 'proof of income', 'corporate', 'certificate of incorporation'],
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
              placeholder="Search sections... (e.g., current account, loans, KYC, termination)"
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
              Customer Account Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Managing the <span className="text-sky-300 font-bold italic">Customer Account Lifecycle</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the full spectrum of bank accounts, customer needs, loan products, account termination, and KYC documentation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">account_lifecycle.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Account_Types;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Customers;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Loans;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><PiggyBank className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><FileText className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: TYPES OF ACCOUNTS ========== */}
        <SectionWrapper id="types-accounts">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Types of Accounts Offered by Banks</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A bank doesn't offer just one "bank account"; it offers a variety of accounts, each designed to meet a specific financial need. As a banking professional, you need to understand all the different products the bank offers so you can help each customer choose the one that is perfect for their needs.</p>
              <h3 className="text-xl font-bold mt-4">Five Main Types of Bank Accounts</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard size={20} /> Current Accounts</h3>
                <p><strong>For:</strong> Individuals and small businesses to manage day-to-day income and frequent payments.</p>
                <p className="mt-1"><strong>Features:</strong> High liquidity, debit card, often an overdraft facility, but typically earn little to no interest.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PiggyBankIcon size={20} /> Savings Accounts</h3>
                <p><strong>For:</strong> Individuals who want to put money aside for the future.</p>
                <p className="mt-1"><strong>Purpose:</strong> Encourage saving and help money grow by earning interest. Usually have limits on withdrawals.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Loan Accounts</h3>
                <p><strong>For:</strong> Individuals or businesses that have borrowed money.</p>
                <p className="mt-1"><strong>Purpose:</strong> Manage the repayment of the loan, tracking the balance and interest charged.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Investment Accounts</h3>
                <p><strong>For:</strong> People with a lump sum of money they won't need for a fixed period.</p>
                <p className="mt-1"><strong>Features:</strong> Higher interest rate, but the money is locked away for the agreed-upon term.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Corporate Accounts</h3>
                <p><strong>For:</strong> Registered businesses and organisations.</p>
                <p className="mt-1"><strong>Features:</strong> Separate business finances from personal ones, handle high-volume complex transactions like payroll and international trade.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: CHARACTERISTICS, ADVANTAGES, DISADVANTAGES ========== */}
        <SectionWrapper id="characteristics">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Characteristics, Advantages, and Disadvantages</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Each type of bank account has a unique set of characteristics designed for a specific job. To give your customers the best advice, you need to be an expert on the specific features—the good and the bad—of each account.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard size={20} /> 1. Current Account</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Advantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Maximum convenience for daily payments</li>
                      <li>Easy access to money</li>
                      <li>Option for an overdraft facility for emergencies</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Disadvantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Earns little to no interest</li>
                      <li>Often has higher monthly service and transaction fees</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PiggyBankIcon size={20} /> 2. Savings Account</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Advantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Your money earns interest and grows over time</li>
                      <li>Withdrawal limits encourage saving discipline</li>
                      <li>Very safe place to keep funds</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Disadvantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Lower liquidity than a current account</li>
                      <li>Interest rate typically lower than investment accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> 3. Investment Account / Fixed Deposit</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Advantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Highest interest rates</li>
                      <li>Rate usually guaranteed for the fixed term</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Disadvantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Zero liquidity (money locked away)</li>
                      <li>Significant penalty for early withdrawal</li>
                      <li>Usually requires a larger lump sum to open</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> 4. Loan Account</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Advantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Enables large purchases like a car or house</li>
                      <li>Provides a structured, predictable repayment schedule</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Disadvantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Cost of interest means you always pay back more</li>
                      <li>Default can damage credit history and lead to repossession</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> 5. Corporate Account</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1"><ThumbsUp size={16} /> Advantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Legal separation between business and personal finances</li>
                      <li>Enhances the company's professional image</li>
                      <li>Access to essential business services (POS, business loans)</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1"><ThumbsDown size={16} /> Disadvantages</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Higher fees than personal accounts</li>
                      <li>More complex application process with extensive documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: TYPES OF BANK CUSTOMERS ========== */}
        <SectionWrapper id="customer-types">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Types of Bank Customers and Their Needs</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>To provide excellent service, you must first learn to identify the different types of customers and understand the world from their perspective. This helps you anticipate their needs and provide relevant financial solutions.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Individuals (Personal / Retail Banking)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Youths/Students:</strong> Needing low-cost, digital accounts.</li>
                  <li><strong>Salaried Employees:</strong> Needing transactional accounts and loans.</li>
                  <li><strong>Self-Employed Individuals:</strong> Needing flexible accounts.</li>
                  <li><strong>High-Net-Worth Individuals:</strong> Needing private banking and investment advice.</li>
                  <li><strong>Pensioners:</strong> Needing secure accounts for retirement funds.</li>
                </ul>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Small and Medium-sized Enterprises (SMEs)</h3>
                <p>Small businesses that need formal business accounts, access to credit for growth, and ways to accept customer payments (POS machines).</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Large Corporations</h3>
                <p>Big companies with complex, often international needs, requiring sophisticated tools for cash flow management, international trade, and large-scale financing.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Institutions and Non-Profit Organisations (NGOs)</h3>
                <p>Schools, churches, and NGOs that need accounts with multiple signatories for security and accountability to manage grants and donations.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: TYPES OF LOANS ========== */}
        <SectionWrapper id="loans">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Types of Loans Offered by Banks</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A loan is a sum of money that is borrowed and is expected to be paid back with interest. By lending money, banks help individuals achieve major life goals and help businesses grow.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Personal Loans (Unsecured)</h3>
                <p>Flexible, multi-purpose loans for individuals, granted based on salary and credit history. They typically have higher interest rates due to not being backed by collateral.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Home size={20} /> Mortgages / Home Loans (Secured)</h3>
                <p>Long-term loans for buying property, where the property itself acts as collateral.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Vehicle Finance / Car Loans (Secured)</h3>
                <p>Medium-term loans to purchase a vehicle, with the vehicle serving as collateral.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Business Loans (Secured or Unsecured)</h3>
                <p>Loans for business needs, such as buying machinery (asset finance) or managing daily costs (working capital loans).</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Agricultural Loans</h3>
                <p>Specialised loans for farmers, with flexible repayment terms often timed to coincide with the harvest season.</p>
              </div>
              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Overdrafts</h3>
                <p>A facility on a current account allowing you to withdraw more than your balance up to a limit. It's for short-term cash flow gaps and usually has a very high interest rate.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: TERMINATION ========== */}
        <SectionWrapper id="termination">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Circumstances Which May Lead to the Termination of Bank Accounts</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>An account's termination can be initiated by either the customer (voluntary) or the bank (involuntary).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserPlus size={20} /> A. Termination Initiated by the Customer (Voluntary)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dissatisfaction with service</li>
                  <li>Relocating to another area</li>
                  <li>Change in banking needs</li>
                  <li>Account's purpose is complete</li>
                </ul>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> B. Termination Initiated by the Bank (Involuntary)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Suspicion of Fraudulent or Illegal Activity:</strong> The most serious reason, such as money laundering.</li>
                  <li><strong>Providing False Information:</strong> If a customer used fake documents to open the account.</li>
                  <li><strong>Dormant Account Status:</strong> If an account is inactive for a very long period and the customer is unreachable.</li>
                  <li><strong>Abusive or Threatening Behaviour:</strong> The bank has a duty to protect its staff.</li>
                </ul>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: DOCUMENTS REQUIRED ========== */}
        <SectionWrapper id="documents">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Documents Required When Opening a Bank Account</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The process of gathering and verifying a customer's documents is known as <strong>KYC (Know Your Customer)</strong>. Its purpose is to prevent financial crime and protect the customer's account.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Documents for an Individual</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Proof of Identity:</strong> A valid, government-issued document with a photo, such as a National ID card, passport, or driver's licence.</li>
                  <li><strong>Proof of Residence:</strong> A recent document (less than 3 months old) confirming the customer's address, such as a ZESA or City Council utility bill.</li>
                  <li><strong>Proof of Income:</strong> A recent payslip or a letter from an employer, often required for current accounts or loan applications.</li>
                  <li><strong>Passport-Sized Photographs:</strong> For the customer's physical file and digital system for visual verification.</li>
                </ul>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Documentation for a Corporate/Business Account</h3>
                <p>Opening a business account is more complex and requires verifying the legal entity. Key documents include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Certificate of Incorporation</strong></li>
                  <li><strong>Memorandum and Articles of Association</strong></li>
                  <li><strong>CR5</strong> (List of Directors) and <strong>CR6</strong> (Registered Address)</li>
                  <li><strong>A Board Resolution</strong> authorising the account opening and specifying signatories</li>
                  <li><strong>Full personal KYC documents</strong> for all directors and signatories</li>
                </ul>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Managing the Customer Account Lifecycle</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Account</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Savings Account</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fixed Deposit</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Corporate Account</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Personal Loan</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mortgage</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Overdraft</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">KYC</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Termination</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Account Lifecycle. 📂🏦</p>
        </footer>

      </div>
    </div>
  );
};