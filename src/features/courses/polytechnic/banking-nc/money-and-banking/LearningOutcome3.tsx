import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, TrendingUp, AlertTriangle,
  Database, Activity, Clock, Droplet, Zap, Layers, Users,
  BookOpen, Briefcase, BarChart, Link, Scale,
  ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  CornerUpRight, CornerUpLeft, Play, Eye, Lightbulb, RefreshCw,
  Crown, User, Swords, Calendar, Anchor,
  Landmark, Coins, Building, Hand, Home, Globe, ShieldCheck,
  Wifi, CreditCard, Banknote, Building2, Wallet, PieChart
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'functions',
    title: 'Functions of the Reserve Bank of Zimbabwe (RBZ)',
    keywords: ['functions', 'RBZ', 'issuer', 'banker', 'lender of last resort', 'monetary policy', 'regulation', 'supervision', 'reserves', 'stability', 'payment systems'],
  },
  {
    id: 'monetary-policy',
    title: 'Monetary Policy Statements',
    keywords: ['monetary policy', 'statements', 'MPC', 'policy rate', 'inflation', 'targeting', 'announcement'],
  },
  {
    id: 'instruments',
    title: 'Instruments of Monetary Policy',
    keywords: ['instruments', 'tools', 'interest rates', 'reserve requirements', 'open market operations', 'OMO', 'discount window', 'forex intervention', 'macroprudential'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome3: React.FC = () => {
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
              placeholder="Search sections... (e.g., RBZ functions, monetary policy, instruments)"
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
              NC BANKING AND FINANCE: MODULE LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Central <span className="text-purple-300 font-bold italic">Banking</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the functions of the Reserve Bank of Zimbabwe, monetary policy statements, and the instruments used to implement monetary policy.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">central_banking.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Functions;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Monetary_Policy;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Instruments;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Landmark className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: FUNCTIONS OF THE RBZ ========== */}
        <SectionWrapper id="functions">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Functions of the Reserve Bank of Zimbabwe (RBZ)</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The Reserve Bank of Zimbabwe (RBZ), in common with central banks globally, performs a range of indispensable functions that are essential for the stability, integrity, and sustainable development of the Zimbabwean economy. These functions are typically mandated and clearly defined by national legislation, primarily the Reserve Bank of Zimbabwe Act, which outlines its powers, responsibilities, and objectives. These functions have evolved over time to meet the changing needs of modern economies, moving from basic roles like currency issuance to more complex responsibilities like macroeconomic management and financial stability.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Coins size={20} /> a) Issuer of National Currency</h3>
              <p><strong>The RBZ holds the sole and exclusive legal authority to issue legal tender currency (banknotes and coins) in Zimbabwe.</strong> This is a foundational and historically significant function of any central bank, often referred to as the "right of note issue." This monopoly on currency issuance is critical for several reasons: it allows the central bank to control the monetary base, it ensures uniformity and integrity of the currency in circulation, and it provides a source of revenue to the state (seigniorage). This function encompasses the entire lifecycle management of the national currency:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Design and Denominations:</strong> The RBZ is responsible for determining the aesthetic design, appropriate denominations, and sophisticated security features of new banknotes and coins.</li>
                <li><strong>Printing and Minting:</strong> The RBZ arranges for the secure and high-quality printing of banknotes and minting of coins, often through specialized domestic or international security printing companies.</li>
                <li><strong>Distribution and Circulation Management:</strong> The RBZ ensures the efficient, secure, and equitable distribution of new currency notes and coins throughout the country to meet public demand, typically via commercial banks.</li>
                <li><strong>Quality Management and Withdrawal of Unfit Currency:</strong> The RBZ is responsible for continuously managing the quality of currency in circulation, withdrawing worn-out, damaged, or old-series notes and coins.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> b) Banker, Advisor, and Agent to the Government</h3>
              <p><strong>The RBZ acts as the primary and principal banker for the Zimbabwean government:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Banker to the Government:</strong> It maintains the government's principal bank accounts, processes government receipts and payments, and may provide short-term advances to the government within strict legal limits.</li>
                <li><strong>Management of Public Debt (Domestic):</strong> The RBZ typically acts as the government's agent in issuing government securities (Treasury Bills, Treasury Bonds), servicing this debt, maintaining debt registers, and developing the market for government securities.</li>
                <li><strong>Financial Advisor to the Government:</strong> The RBZ provides expert advice to the government on monetary, financial, banking, and broader economic policy matters.</li>
                <li><strong>Agent for the Government in Specific Financial Matters:</strong> The RBZ may act as the government's agent in dealings with international financial institutions (IFIs) like the IMF and World Bank.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> c) Banker to Commercial Banks (Often termed the "Bankers' Bank" or "Bank of Banks")</h3>
              <p><strong>The RBZ serves as the bank for commercial banks and other eligible financial institutions:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Holding Commercial Bank Reserves and Settlement Accounts:</strong> Commercial banks maintain accounts at the RBZ for statutory reserves, clearing balances for interbank settlements, and accessing central bank credit.</li>
                <li><strong>Facilitating Interbank Clearing and Settlement Systems:</strong> The RBZ usually operates or oversees national payment, clearing, and settlement systems, including Real-Time Gross Settlement (RTGS) systems like ZETSS.</li>
                <li><strong>Providing Liquidity to the Banking System:</strong> The RBZ can provide short-term liquidity to the banking system through monetary policy operations.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hand size={20} /> d) Lender of Last Resort (LOLR)</h3>
              <p><strong>In situations of exceptional financial stress, the RBZ can act as a lender of last resort to fundamentally solvent financial institutions facing temporary liquidity shortages.</strong> This is to prevent illiquidity from causing insolvency or systemic instability.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Provision of Emergency Liquidity Assistance (ELA):</strong> Short-term emergency credit, typically to solvent institutions, against good collateral, and often at a penalty interest rate.</li>
                <li><strong>Preventing Bank Panics and Systemic Crises:</strong> Aims to maintain overall confidence in the banking system.</li>
                <li><strong>Conditions and Discretion:</strong> Access is usually at the central bank's discretion and may come with stringent conditions.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> e) Formulation and Implementation of Monetary Policy</h3>
              <p><strong>The RBZ is responsible for formulating, announcing, and implementing monetary policy for Zimbabwe to achieve specific macroeconomic objectives.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Primary Objective:</strong> Typically to achieve and maintain price stability (low, stable, and predictable inflation).</li>
                <li><strong>Other Objectives:</strong> May include supporting sustainable economic growth, high employment, moderate long-term interest rates, and financial system stability.</li>
                <li><strong>Monetary Policy Framework and Strategy:</strong> Involves setting clear objectives, choosing an operational framework, conducting economic analysis and forecasting, and having a structured decision-making process (often via a Monetary Policy Committee - MPC).</li>
                <li><strong>Instruments of Monetary Policy:</strong> The RBZ uses various instruments (detailed in section 4 of LO3) to influence money supply, credit cost, interest rates, and sometimes the exchange rate.</li>
              </ul>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldCheck size={20} /> f) Regulation and Supervision of the Financial System (Financial Sector Oversight)</h3>
              <p><strong>The RBZ regulates and supervises banks and other specified financial institutions to ensure the soundness, stability, integrity, and safety of the financial system.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Licensing and Authorization:</strong> Granting licenses for financial institutions to operate, ensuring they meet minimum prudential criteria.</li>
                <li><strong>Setting Prudential Guidelines:</strong> Establishing rules on capital adequacy, liquidity, credit risk, market risk, operational risk, corporate governance, and AML/CFT.</li>
                <li><strong>Monitoring and Surveillance:</strong> Continuously monitoring institutions through off-site analysis of submitted data and on-site inspections.</li>
                <li><strong>Enforcement and Corrective Action:</strong> Enforcing compliance and taking remedial actions in cases of non-compliance or financial distress, ranging from warnings to license revocation.</li>
              </ul>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe size={20} /> g) Management of Foreign Exchange Reserves</h3>
              <p><strong>The RBZ holds, safeguards, and prudently manages Zimbabwe's official foreign exchange reserves (foreign currencies, gold, SDRs, IMF reserve position).</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Facilitating International Trade and Payments:</strong> Used to finance essential imports and meet external payment obligations.</li>
                <li><strong>Intervention in the Foreign Exchange Market:</strong> To stabilize the exchange rate, manage its level, or supply liquidity.</li>
                <li><strong>Providing a Buffer Against External Shocks:</strong> Acts as a cushion against adverse events like drops in export earnings or capital flight.</li>
                <li><strong>Maintaining International Confidence and Creditworthiness:</strong> Adequate reserves enhance confidence and access to international credit.</li>
                <li><strong>Supporting Monetary Policy and Overall Economic Stability.</strong></li>
              </ul>
              <p>Management objectives are typically Safety, Liquidity, and Return (S-L-R), in that order of priority.</p>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Home size={20} /> h) Promotion of Financial Stability (Macroprudential Oversight)</h3>
              <p><strong>The RBZ has a systemic responsibility for the overall stability and resilience of the entire financial system, focusing on mitigating systemic risks.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identifying and Monitoring Systemic Risks:</strong> Assessing risks that could affect the financial system as a whole (e.g., failure of SIFIs, asset bubbles, excessive credit growth).</li>
                <li><strong>Developing and Implementing Macroprudential Policies and Tools:</strong> Using tools like countercyclical capital buffers, sectoral capital requirements, LTV/DTI limits, and leverage ratios.</li>
                <li><strong>Contributing to Crisis Management and Resolution Frameworks:</strong> Developing plans for managing financial crises and resolving failing institutions.</li>
              </ul>
              <p>This often requires close collaboration with other regulatory authorities and the Ministry of Finance.</p>
            </div>

            <div className={cardClasses('orange')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> i) Overseeing and Promoting Safe, Efficient, and Innovative Payment and Settlement Systems</h3>
              <p><strong>The RBZ plays a pivotal role in ensuring the country's payment, clearing, and settlement systems (Financial Market Infrastructures - FMIs) are safe, efficient, and innovative.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Operating Key Payment System Infrastructure:</strong> Often owns and operates RTGS systems (like ZETSS) and may oversee ACHs.</li>
                <li><strong>Setting Standards, Policies, and Regulations:</strong> Establishing rules for all payment systems to ensure safety, efficiency, resilience, interoperability, and consumer protection.</li>
                <li><strong>Promoting Innovation and Modernization:</strong> Encouraging development in digital payments, mobile payments, and fintech solutions.</li>
                <li><strong>Acting as a Catalyst and Coordinator:</strong> Bringing stakeholders together to develop national payments strategy.</li>
                <li><strong>Crisis Management and Business Continuity for Payment Systems:</strong> Ensuring continued functioning of essential payment systems during crises.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: MONETARY POLICY STATEMENTS ========== */}
        <SectionWrapper id="monetary-policy">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Monetary Policy Statements</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Monetary policy statements are formal, periodic communications issued by the Reserve Bank of Zimbabwe.</strong> These statements are one of the most important channels through which the central bank communicates its assessment of the economic outlook, its monetary policy decisions, and its future intentions to the public, financial markets, and the government.</p>
              <p>The significance of these statements lies in their role as a key tool for managing expectations, enhancing transparency, and ensuring accountability in the conduct of monetary policy.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Nature and Content of Monetary Policy Statements</h3>
              <p><strong>A typical monetary policy statement from the RBZ contains a wealth of information:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Assessment of the Economic Environment:</strong> A review of recent economic developments, including GDP growth, inflation trends, employment, fiscal policy developments, and external sector performance.</li>
                <li><strong>Monetary Policy Decision:</strong> The formal announcement of the policy decision, including any changes to the policy rate, reserve requirements, or other policy instruments.</li>
                <li><strong>Rationale for the Decision:</strong> A detailed explanation of why the MPC made the decision, linking it back to the RBZ's mandate and economic analysis.</li>
                <li><strong>Outlook and Forward Guidance:</strong> The RBZ's assessment of the future economic outlook and potential guidance on likely future policy moves.</li>
                <li><strong>Implementation Details:</strong> Any specific instructions or operational details regarding the implementation of the new policy measures.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Significance of Monetary Policy Statements</h3>
              <p><strong>These statements are powerful communication tools that serve multiple critical purposes:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Enhancing Transparency and Accountability:</strong> They explain policy decisions to the public, reducing uncertainty and making the central bank more accountable.</li>
                <li><strong>Managing Expectations and Shaping Market Sentiment:</strong> By signaling future intentions, they can influence market expectations and make monetary policy more effective.</li>
                <li><strong>Providing Forward Guidance:</strong> They help guide economic decisions and manage uncertainty about the future policy path.</li>
                <li><strong>Explaining Policy to a Wider Audience:</strong> They are an accessible tool for educating the public about the central bank's role and economic concepts.</li>
                <li><strong>Building Credibility and Public Trust:</strong> Consistent and well-explained policy helps build institutional credibility, which is essential for the effectiveness of monetary policy.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: INSTRUMENTS OF MONETARY POLICY ========== */}
        <SectionWrapper id="instruments">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Instruments of Monetary Policy</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>The Reserve Bank of Zimbabwe employs a variety of tools, instruments, and mechanisms to formulate, implement, and transmit its monetary policy decisions to the broader economy.</strong> These instruments can be broadly classified into conventional and unconventional tools, and their selection and calibration depend on the specific economic context and the central bank's strategic objectives.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Conventional Monetary Policy Instruments</h3>
              <p><strong>These are the traditional tools used by central banks:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Open Market Operations (OMO):</strong> The buying and selling of government securities (Treasury Bills and Treasury Bonds) in the open market to control the money supply and influence short-term interest rates.</li>
                <li><strong>Policy Rate (Interest Rate):</strong> The primary interest rate set by the RBZ, which influences all other interest rates in the economy. Changes to the policy rate affect borrowing costs, aggregate demand, and inflation.</li>
                <li><strong>Reserve Requirements (Cash Reserve Ratio):</strong> The percentage of deposits that commercial banks must hold as reserves with the central bank. Changes in reserve requirements affect the amount of money banks can lend.</li>
                <li><strong>Discount Window:</strong> A facility through which commercial banks can borrow short-term funds from the central bank, typically at a penalty rate. The discount rate signals the central bank's stance on liquidity.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PieChart size={20} /> Unconventional Monetary Policy Instruments</h3>
              <p><strong>In times of economic stress or when conventional tools become ineffective (e.g., when policy rates are near zero), central banks may employ unconventional measures:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Quantitative Easing (QE):</strong> Large-scale purchases of government bonds or other assets to inject liquidity and stimulate the economy when policy rates are already low.</li>
                <li><strong>Forward Guidance:</strong> Communicating to markets the likely future path of policy rates to influence long-term interest rates and shape expectations.</li>
                <li><strong>Negative Interest Rates:</strong> Charging commercial banks for holding reserves at the central bank to encourage lending and discourage hoarding of cash.</li>
                <li><strong>Foreign Exchange Interventions:</strong> Buying or selling foreign currency in the forex market to influence the exchange rate and manage volatility.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Transmission Mechanism</h3>
              <p><strong>The transmission mechanism describes how monetary policy decisions affect the broader economy:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Interest Rate Channel:</strong> Changes in the policy rate influence short-term and long-term interest rates, affecting borrowing costs and consumption/investment decisions.</li>
                <li><strong>Credit Channel:</strong> Policy changes affect bank lending capacity and credit availability, influencing spending by households and businesses.</li>
                <li><strong>Exchange Rate Channel:</strong> Monetary policy influences the exchange rate, which affects import prices, export competitiveness, and net exports.</li>
                <li><strong>Asset Price Channel:</strong> Policy changes influence asset prices (stocks, bonds, real estate), which affect wealth and borrowing capacity.</li>
                <li><strong>Expectations Channel:</strong> Policy signals and forward guidance shape expectations about future economic conditions and inflation.</li>
              </ul>
              <p>Understanding this transmission mechanism is crucial for the RBZ to effectively calibrate its policy instruments and achieve its objectives.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Macroprudential Instruments</h3>
              <p><strong>These instruments are specifically designed to address systemic risks and ensure financial stability:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Countercyclical Capital Buffers (CCyB):</strong> Additional capital requirements that banks must hold during periods of excessive credit growth.</li>
                <li><strong>Loan-to-Value (LTV) Limits:</strong> Restrictions on the maximum loan amount relative to the value of collateral, often used to cool overheated housing markets.</li>
                <li><strong>Debt-to-Income (DTI) Limits:</strong> Caps on the proportion of a borrower's income that can be used to service debt.</li>
                <li><strong>Liquidity Coverage Ratio (LCR):</strong> A requirement that banks hold sufficient high-quality liquid assets to cover potential outflows during a stress scenario.</li>
                <li><strong>Net Stable Funding Ratio (NSFR):</strong> A requirement that banks maintain a stable funding profile relative to their assets.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Central Banking</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">RBZ Functions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Currency Issuer</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Banker to Government</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lender of Last Resort</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monetary Policy</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Regulation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Financial Stability</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">OMO</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reserve Requirements</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Central Banking. 🏛️💰</p>
        </footer>

      </div>
    </div>
  );
};
