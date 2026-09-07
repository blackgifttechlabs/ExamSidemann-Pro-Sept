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
  PiggyBank, Truck, Heart, Sparkles, LucideIcon,
  Target
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'concept',
    title: 'The Concept of Financial Intermediation',
    keywords: ['concept', 'financial intermediation', 'surplus units', 'deficit units', 'savers', 'borrowers', 'information asymmetry', 'maturity transformation', 'risk diversification'],
  },
  {
    id: 'bfi-list',
    title: 'List of Banking Financial Institutions',
    keywords: ['BFI', 'commercial bank', 'merchant bank', 'building society', 'savings bank', 'development bank', 'CBZ', 'Stanbic', 'POSB', 'IDBZ', 'CABS'],
  },
  {
    id: 'bfi-roles',
    title: 'Roles of Banking Financial Institutions',
    keywords: ['roles', 'BFI', 'mobilisation of savings', 'credit creation', 'payments system', 'maturity transformation', 'risk management', 'foreign exchange', 'financial inclusion'],
  },
  {
    id: 'nbfi-list',
    title: 'Outline of Non-Banking Financial Institutions',
    keywords: ['NBFI', 'insurance', 'pension fund', 'microfinance', 'asset management', 'finance house', 'leasing', 'stockbroking', 'venture capital', 'private equity', 'SACCO', 'credit union'],
  },
  {
    id: 'nbfi-roles',
    title: 'Roles of Non-Banking Financial Institutions',
    keywords: ['roles', 'NBFI', 'long-term savings', 'capital markets', 'financial inclusion', 'risk management', 'innovation', 'infrastructure finance'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome4: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
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

  // Helper to render section with highlight effect
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
              placeholder="Search sections... (e.g., commercial banks, NBFI, insurance, intermediation)"
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
              NC BANKING AND FINANCE: MODULE LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Financial <span className="text-amber-300 font-bold italic">Intermediation</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the concept of financial intermediation, banking and non-banking financial institutions, and their vital roles in the economy.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">financial_intermediation.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Concept;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">BFIs;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">NBFIs;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><PiggyBank className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Building2 className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: CONCEPT OF FINANCIAL INTERMEDIATION ========== */}
        <SectionWrapper id="concept">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The Concept of Financial Intermediation</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Financial intermediation is the core economic process performed by specialized financial institutions (both banks and non-banks) that act as intermediaries to facilitate the efficient and effective flow of funds between:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Surplus Units (Net Savers or Lenders):</strong> Economic entities with more income than current expenditure, resulting in surplus funds or savings.</li>
                <li><strong>Deficit Units (Net Borrowers or Spenders/Investors):</strong> Economic entities with expenditure needs exceeding current income, looking to borrow funds.</li>
              </ul>
              <p>In essence, financial intermediation is about bridging the gap between those with excess money (savings) and those with a shortage relative to their spending or investment plans.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Why is Financial Intermediation Necessary?</h3>
              <p><strong>While direct lending can occur, it faces significant challenges:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Information Asymmetry and High Search Costs:</strong> Savers lack detailed information to assess borrower creditworthiness. Search costs for suitable counterparties are high.</li>
                <li><strong>Mismatch of Scale (Amount):</strong> Individual savers have small funds, while borrowers often require large sums.</li>
                <li><strong>Mismatch of Maturity Preferences:</strong> Savers prefer liquid short-term access, while borrowers need longer-term funds.</li>
                <li><strong>Risk Aversion and Lack of Diversification:</strong> Individual savers are risk-averse and cannot diversify lending portfolios effectively.</li>
                <li><strong>High Transaction Costs for Direct Finance:</strong> Costs of searching, due diligence, contract negotiation, monitoring, and enforcement are prohibitively high.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"> How Financial Intermediaries Add Value</h3>
              <p><strong>Financial institutions overcome these challenges by performing crucial functions:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Aggregating Funds (Pooling Savings):</strong> Collect small savings to make large loans.</li>
                <li><strong>Maturity Transformation:</strong> Accept short-term deposits and provide long-term loans.</li>
                <li><strong>Risk Diversification and Transformation:</strong> Spread credit risk across diverse borrowers.</li>
                <li><strong>Reducing Transaction Costs:</strong> Achieve economies of scale in processing and monitoring.</li>
                <li><strong>Providing Liquidity and Payment Services:</strong> Enhance the utility of savings.</li>
                <li><strong>Facilitating Efficient Capital Allocation:</strong> Direct funds to productive uses.</li>
                <li><strong>Providing Financial Advice and Services:</strong> Offer expertise to clients.</li>
              </ul>
              <p>A well-developed financial intermediation sector is a hallmark of a modern, prosperous economy.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: LIST OF BANKING FINANCIAL INSTITUTIONS ========== */}
        <SectionWrapper id="bfi-list">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>List of Banking Financial Institutions</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Banking Financial Institutions (BFIs)</strong> are financial institutions legally authorized to accept deposits from the public and use these funds to make loans and investments. They form the core of the traditional financial system and are subject to stringent regulation.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> a) Commercial Banks</h3>
              <p><strong>Definition:</strong> The most common and diversified type, offering a wide range of services to individuals, SMEs, large corporations, and government entities.</p>
              <p><strong>Key Services:</strong> Deposit mobilization (current, savings, fixed deposit accounts), diverse lending (personal, mortgages, business loans, overdrafts), payment systems (cheques, cards, ATMs, EFTs, online/mobile banking), foreign exchange services, ancillary services.</p>
              <p><strong>Examples in Zimbabwe:</strong> CBZ Bank, Stanbic Bank, Standard Chartered Bank, Ecobank, FBC Bank, Nedbank, ZB Bank, BancABC, CABS (commercial banking license).</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> b) Merchant Banks (Investment/Corporate Banks)</h3>
              <p><strong>Definition:</strong> Focus on sophisticated financial services and advice to corporate clients, governments, and other financial institutions.</p>
              <p><strong>Key Services:</strong> Corporate finance advisory (capital raising, restructuring), underwriting securities (IPOs, bonds), mergers and acquisitions (M&A) advisory, project finance, trade finance, investment management.</p>
              <p><strong>Evolution in Zimbabwe:</strong> Distinction blurred; many commercial banks have merchant/investment banking divisions (e.g., FBC Merchant Bank integrated into FBC Holdings).</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Home size={20} /> c) Building Societies</h3>
              <p><strong>Definition:</strong> Originated to help members save money and finance home purchase or construction, promoting thrift and home ownership.</p>
              <p><strong>Key Services:</strong> Retail savings deposits, long-term mortgage finance, current accounts, personal loans, insurance, SME lending.</p>
              <p><strong>Examples in Zimbabwe:</strong> CABS (prominent, also commercial banking license), ZB Building Society, FBC Building Society (parts of larger groups).</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wallet size={20} /> d) Savings Banks</h3>
              <p><strong>Definition:</strong> Focused on encouraging thrift and mobilizing savings, especially from small savers, lower-income individuals, and rural populations.</p>
              <p><strong>Key Services:</strong> Basic savings accounts, limited lending (small personal loans, microloans), basic payment services, financial inclusion.</p>
              <p><strong>Example in Zimbabwe:</strong> The People's Own Savings Bank (POSB), with a statutory mandate to mobilize savings and provide banking services.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> e) Development Banks (DFIs)</h3>
              <p><strong>Definition:</strong> Specialized institutions (often government-owned or supported) providing medium and long-term finance for projects crucial for economic and social development.</p>
              <p><strong>Key Services:</strong> Long-term loans, equity investments, guarantees, technical assistance, advisory services for priority sectors (agriculture, industry, infrastructure, housing, export promotion).</p>
              <p><strong>Examples in Zimbabwe:</strong> Infrastructure Development Bank of Zimbabwe (IDBZ), Agricultural Finance Corporation (AFC) Commercial Bank, other specialized DFIs or funds.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: ROLES OF BANKING FINANCIAL INSTITUTIONS ========== */}
        <SectionWrapper id="bfi-roles">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Roles of Banking Financial Institutions</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Banking financial institutions (BFIs) are pivotal to the modern economy, performing numerous crucial roles that facilitate economic activity, growth, and stability.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PiggyBank size={20} /> a) Mobilisation of Savings</h3>
              <p>A primary role: providing safe, convenient, and interest-bearing avenues for entities to deposit surplus funds. This pools widespread savings into loanable funds for capital formation and encourages a savings culture.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard size={20} /> b) Provision of Credit and Finance</h3>
              <p>Channeling mobilised funds into productive investments and consumption. Through lending under a fractional reserve system, commercial banks engage in credit creation (money creation), expanding the money supply.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> c) Facilitation of the Payments System</h3>
              <p>Central to the payments system, enabling transactions via cheques, cards, ATMs, EFTs, online/mobile banking, and interbank systems (RTGS, ACHs). Essential for all economic transactions.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> d) Maturity Transformation</h3>
              <p>Bridging mismatched time preferences: accepting short-term, liquid deposits from savers and transforming them into longer-term loans for borrowers. This involves managing liquidity risk and interest rate risk.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> e) Risk Management, Assessment, and Diversification</h3>
              <p>Specializing in identifying, assessing, managing, and transforming financial risks, particularly credit risk. Includes risk assessment (screening, due diligence), risk diversification (lending to a diverse portfolio), and risk transformation.</p>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> f) Agent and Advisory Services</h3>
              <p>Acting as agents for customers (collecting/making payments, trustees, custodians) and providing financial advice (personal financial planning, business cash flow, corporate finance strategies).</p>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe size={20} /> g) Foreign Exchange Services</h3>
              <p>Vital for international trade and finance: buying/selling foreign currencies, foreign currency accounts, international money transfers, letters of credit, and helping manage exchange rate risk (hedging).</p>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> h) Supporting Government Operations</h3>
              <p>Assisting government finances (tax collection, payment disbursements), participating in government securities markets (helping finance deficits), and acting as crucial conduits for monetary policy transmission.</p>
            </div>

            <div className={cardClasses('orange')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> i) Promoting Financial Inclusion</h3>
              <p>Extending formal financial services to unbanked/underbanked populations via mobile/digital banking, agency banking, simplified accounts, and financial literacy. Contributes to poverty reduction and inclusive economic development.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: OUTLINE OF NON-BANKING FINANCIAL INSTITUTIONS ========== */}
        <SectionWrapper id="nbfi-list">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Outline of Non-Banking Financial Institutions</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Non-Banking Financial Institutions (NBFIs)</strong> provide financial services but generally do not hold full banking licenses and cannot accept demand deposits. They complement banks, cater to niche markets, and contribute to financial innovation and competition.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> a) Insurance Companies</h3>
              <p><strong>Core Function:</strong> Risk management and transfer; providing financial protection against specified contingent losses by pooling risks and collecting premiums.</p>
              <p><strong>Types:</strong> Life insurance (assurance, annuities, funeral policies) and General/Non-Life insurance (property, motor, liability, health, agricultural).</p>
              <p><strong>Investment Role:</strong> Accumulate large reserves invested in diversified assets, making them significant institutional investors.</p>
              <p><strong>Examples in Zimbabwe:</strong> Old Mutual, Nyaradzo, Zimnat Lion, First Mutual Life, NicozDiamond.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wallet size={20} /> b) Pension Funds</h3>
              <p><strong>Core Function:</strong> Help individuals save and invest systematically for retirement by collecting contributions from employers/employees and managing them in a diversified portfolio.</p>
              <p><strong>Key Characteristics:</strong> Long-term investment horizon, major institutional investors, critical for mobilizing long-term savings.</p>
              <p><strong>Examples in Zimbabwe:</strong> Occupational pension funds, National Social Security Authority (NSSA), individual pension plans.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> c) Microfinance Institutions (MFIs)</h3>
              <p><strong>Core Function:</strong> Provide financial services (microcredit, savings, microinsurance, money transfers) to low-income individuals, micro-entrepreneurs, and informal sector businesses.</p>
              <p><strong>Key Characteristics:</strong> Focus on financial inclusion, innovative lending methodologies (group lending, collateral substitutes), higher operating costs.</p>
              <p><strong>Examples in Zimbabwe:</strong> EmpowerBank, various other licensed MFBs and credit-only MFIs.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> d) Asset Management Companies</h3>
              <p><strong>Core Function:</strong> Professionally manage investment portfolios on behalf of clients to achieve specific investment objectives.</p>
              <p><strong>Services:</strong> Collective Investment Schemes (mutual funds/unit trusts), segregated mandates, ETFs, investment advisory.</p>
              <p><strong>Examples in Zimbabwe:</strong> Old Mutual Investment Group, Imara Asset Management, Datvest, Stanbic Investment Management Services.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> e) Finance Houses / Leasing Companies</h3>
              <p><strong>Core Function:</strong> Provide finance for the acquisition of specific assets (vehicles, equipment, consumer durables).</p>
              <p><strong>Finance Houses:</strong> Focus on consumer credit via hire purchase or personal loans.</p>
              <p><strong>Leasing Companies:</strong> Finance for businesses to acquire use of capital equipment via leases (Finance/Capital Lease or Operating Lease).</p>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> f) Stockbroking Firms</h3>
              <p><strong>Core Function:</strong> Intermediaries in financial markets, facilitating buying/selling of securities (shares, bonds) on exchanges or OTC markets.</p>
              <p><strong>Services:</strong> Executing orders, investment advisory, research, underwriting support, custody services.</p>
              <p><strong>Examples in Zimbabwe:</strong> EFE Securities, Imara Edwards Securities, Lynton-Edwards, Morgan & Co., Old Mutual Securities.</p>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> g) Venture Capital (VC) and Private Equity (PE) Firms</h3>
              <p><strong>Core Function:</strong> Provide risk capital to private companies not listed on public exchanges.</p>
              <p><strong>Venture Capital:</strong> Invest in startups and early-stage, high-growth potential businesses.</p>
              <p><strong>Private Equity:</strong> Invest in broader range of private companies for growth, restructuring, or buyouts.</p>
              <p><strong>Key Characteristics:</strong> High-risk/return, illiquid, long-term horizon, active involvement, specific exit strategies.</p>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> h) Credit Unions / SACCOs</h3>
              <p><strong>Core Function:</strong> Member-owned, democratically controlled financial cooperatives formed by groups with a common bond.</p>
              <p><strong>Key Characteristics:</strong> Cooperative principles (voluntary membership, democratic control), primary purpose of thrift and credit, surplus returned to members.</p>
              <p><strong>Range of Services:</strong> Savings, loans, basic insurance, payment services, financial counselling.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: ROLES OF NON-BANKING FINANCIAL INSTITUTIONS ========== */}
        <SectionWrapper id="nbfi-roles">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Roles of Non-Banking Financial Institutions</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>NBFIs complement banks and play crucial, diverse roles in the financial system, contributing to its depth, efficiency, innovation, and resilience.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> a) Mobilisation of Long-Term and Contractual Savings</h3>
              <p>Pension funds and life insurance companies mobilize long-term contractual savings, accumulating vast pools of funds invested in long-term assets. This "patient capital" is crucial for financing long-term economic development.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"> b) Provision of Specialised Financial Services</h3>
              <p>NBFIs offer specialized services catering to niche markets often not adequately addressed by banks: insurance (risk management), MFIs (financial access for low-income), leasing (asset finance), VC/PE (risk capital for innovation/growth).</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> c) Development and Deepening of Capital Markets</h3>
              <p>NBFIs like pension funds, insurance companies, and asset managers are significant participants in capital markets, contributing to increased liquidity, depth, improved price discovery, and market efficiency.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> d) Enhancing Financial Inclusion</h3>
              <p>Many NBFIs (MFIs, SACCOs, some insurance companies, mobile money operators) extend financial services to underserved populations, promoting financial inclusion, empowering individuals, and contributing to poverty reduction.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> e) Specialized Risk Management Solutions</h3>
              <p>Insurance companies specialize in managing a wide array of pure risks, allowing individuals and businesses to operate with greater financial security and promoting economic resilience.</p>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> f) Promoting Competition, Innovation, and Efficiency</h3>
              <p>NBFIs increase competition, leading to improved services, lower costs, and greater innovation (e.g., fintech solutions) in the financial sector, benefiting consumers and businesses.</p>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> g) Channelling Funds to Niche Markets</h3>
              <p>NBFIs direct funds to niche markets or sectors often overlooked by banks: VC firms (startups), PE firms (private company growth/restructuring), specialized finance companies (factoring, equipment finance).</p>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> h) Facilitating Infrastructure Development</h3>
              <p>Long-term funds mobilized by NBFIs are well-suited for financing large-scale, long-gestation infrastructure projects through infrastructure bonds, funds, or PPPs, critical for sustainable economic growth.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Financial Intermediation</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Intermediation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commercial Banks</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Merchant Banks</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Building Societies</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Development Banks</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Insurance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pension Funds</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">MFIs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Management</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">SACCOs</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Financial Intermediation. 🏦📊</p>
        </footer>

      </div>
    </div>
  );
};
