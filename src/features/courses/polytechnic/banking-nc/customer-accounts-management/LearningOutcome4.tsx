import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, AlertTriangle,
  Clock, 
  BookOpen, BarChart, 
  
  RefreshCw,
  
  Globe, 
  Wifi, 
  FileText,
  
  
  Handshake, UserCheck, 
 
  Monitor, 
  Radar, ScanSearch
  } from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'introduction',
    title: 'An Introduction to Account Monitoring',
    keywords: ['account monitoring', 'introduction', 'surveillance', 'oversight', 'transaction profile', 'red flag', 'compliance', 'risk management'],
  },
  {
    id: 'defining',
    title: 'Defining Account Monitoring',
    keywords: ['defining', 'account monitoring', 'systematic review', 'transaction patterns', 'proactive'],
  },
  {
    id: 'justifying',
    title: 'Justifying Bank Account Monitoring',
    keywords: ['justifying', 'reasons', 'fraud prevention', 'AML', 'anti-money laundering', 'credit risk', 'operational errors', 'financial integrity'],
  },
  {
    id: 'factors',
    title: 'Factors to Consider When Monitoring Accounts',
    keywords: ['factors', 'frequency', 'size', 'suspicious transactions', 'system errors', 'organisational policies', 'structuring', 'smurfing', 'threshold'],
  },
  {
    id: 'process',
    title: 'The Process and Methods of Account Monitoring',
    keywords: ['process', 'methods', 'automated monitoring', 'manual monitoring', 'hybrid approach', 'algorithm', 'compliance officer', 'detection', 'investigation', 'reporting'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome4: React.FC = () => {
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
              placeholder="Search sections... (e.g., monitoring, AML, fraud, red flag, compliance)"
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
              Account Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Ongoing Account <span className="text-amber-300 font-bold italic">Management & Oversight</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Understand account monitoring, its justification, key factors to consider, and the process and methods used to protect customers and the financial system.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">account_monitoring.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Monitoring;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Factors;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Process;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Radar className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: INTRODUCTION ========== */}
        <SectionWrapper id="introduction">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>An Introduction to Account Monitoring</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you are a security guard responsible for monitoring the CCTV cameras for a large, busy shopping mall like Sam Levy's Village in Harare. Your job isn't just to watch the main entrance. You need to keep an eye on everything: the car park, the delivery bays, the quiet corridors, and the busy shops. You are constantly scanning for anything that looks unusual or out of place—a suspicious package left unattended, a person acting strangely, or a car that has been parked in a restricted area for too long. This continuous process of observation is called <strong>monitoring</strong>, and its purpose is to ensure the safety and security of everyone in the mall.</p>
              <p>Bank account monitoring is a very similar concept. A bank's responsibility to its customers doesn't end after the account is opened. In fact, it's just the beginning. The bank has an ongoing duty to watch over the transactions that flow through all its accounts. This is not about spying on customers; it's about protecting them and the bank from a wide range of risks. Just like the security guard, the bank's systems and staff are constantly scanning for transactions that seem unusual or out of character, which could be an early warning sign of fraud, financial crime, or that a customer is in financial distress.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Monitoring:</strong> The ongoing process of reviewing a customer's account activity to detect unusual patterns, suspicious transactions, or deviations from their expected behaviour.</li>
                <li><strong>Transaction Profile:</strong> The normal, expected pattern of activity for a specific customer's account (e.g., a salaried employee is expected to have one large deposit per month and many small withdrawals).</li>
                <li><strong>Red Flag:</strong> A warning sign or indicator of a potential problem, risk, or illegal activity.</li>
                <li><strong>Compliance:</strong> The act of adhering to a rule, such as a policy, standard, or law. Banks must comply with strict anti-money laundering regulations.</li>
                <li><strong>Risk Management:</strong> The process of identifying, assessing, and controlling threats to an organization's capital and earnings. Account monitoring is a key risk management tool.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: DEFINING ACCOUNT MONITORING ========== */}
        <SectionWrapper id="defining">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Defining Account Monitoring</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Account monitoring</strong> is the continuous and systematic review of customer account activity. This process uses a combination of automated computer systems and human oversight to analyse the flow of money in and out of accounts. The primary goal is to identify transactions or patterns of behaviour that do not fit a customer's established profile. It is a proactive, protective measure, much like a regular health check-up, designed to spot potential problems before they become serious.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ScanSearch size={20} /> Key Aspects of Account Monitoring</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Continuous:</strong> Monitoring never stops; it is an ongoing process that occurs in real-time.</li>
                <li><strong>Systematic:</strong> It follows a structured, rule-based approach using both automated systems and human analysis.</li>
                <li><strong>Protective:</strong> The ultimate goal is to protect the customer, the bank, and the financial system.</li>
                <li><strong>Proactive:</strong> It aims to identify and address potential issues before they escalate into serious problems.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: JUSTIFYING BANK ACCOUNT MONITORING ========== */}
        <SectionWrapper id="justifying">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Justifying Bank Account Monitoring</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Banks don't monitor accounts because they are nosy; they do it because it is a critical and legally mandated part of responsible banking. The justification for this constant oversight is based on three main pillars of responsibility: <strong>protecting the customer</strong>, <strong>protecting the bank</strong>, and <strong>protecting the integrity of the entire financial system</strong>.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 1. To Protect the Customer from Fraud</h3>
                <p>If a bank's system notices a highly unusual transaction—for example, a large withdrawal from a pensioner's account in a different country in the middle of the night—it raises a <strong>red flag</strong>. The monitoring system allows the bank to temporarily block the transaction and contact the customer to verify if it is legitimate. This proactive monitoring is one of the most effective ways to protect customers from having their accounts emptied by fraudsters.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 2. To Comply with Anti-Money Laundering (AML) Laws</h3>
                <p>Banks are legally required by the government and the Reserve Bank of Zimbabwe to have strong systems in place to detect and report suspicious activity related to financial crime. <strong>Money laundering</strong> is the process criminals use to make "dirty money" from illegal activities appear "clean" by passing it through the banking system. Account monitoring is the bank's main tool for identifying the complex transaction patterns associated with these crimes and reporting them to the authorities.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> 3. To Manage Credit Risk</h3>
                <p>For customers who have loans or overdrafts, the bank monitors their account activity to ensure they are managing their finances responsibly. If a business customer's account suddenly shows a sharp drop in monthly deposits, it could be an early warning sign that the business is in trouble and may struggle to repay its loan. This monitoring allows the bank to proactively engage with the customer to find a solution before they default.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> 4. To Identify and Manage Operational Errors</h3>
                <p>Monitoring is not just about catching bad actors; it's also about catching internal mistakes. A regular review of account activity can sometimes uncover system errors or mistakes made by bank staff, such as a deposit being accidentally credited to the wrong account. Identifying these operational errors quickly allows the bank to correct them before they cause major problems for the customer.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe size={20} /> 5. To Maintain the Integrity of the Financial System</h3>
                <p>Every bank has an ethical and legal responsibility to be a good corporate citizen. By actively monitoring for and preventing financial crime, each individual bank contributes to the overall safety, stability, and trustworthiness of the entire Zimbabwean financial system. This, in turn, fosters a stable economic environment for everyone.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: FACTORS TO CONSIDER ========== */}
        <SectionWrapper id="factors">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Factors to Consider When Monitoring Accounts</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>When a doctor examines a patient, they don't just check one thing. They consider multiple factors: they take your temperature, check your blood pressure, listen to your breathing, and ask you about your symptoms. Each factor provides a different piece of information, and by looking at all of them together, the doctor can form a clear picture of your overall health.</p>
              <p>Monitoring a bank account is a very similar diagnostic process. A bank doesn't just look at one single aspect of an account. Instead, its automated systems and compliance officers consider a variety of factors simultaneously. They are looking for patterns and, more importantly, for significant changes in those patterns.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Transaction Profile:</strong> The expected and normal pattern of transactions for a particular customer based on their history and the nature of their account.</li>
                <li><strong>Deviation:</strong> A departure or move away from the established normal pattern or standard.</li>
                <li><strong>Threshold:</strong> A pre-defined limit or level that, when crossed, triggers an alert.</li>
                <li><strong>Structuring (or Smurfing):</strong> A common money laundering technique where a large cash deposit is broken down into multiple smaller deposits to avoid detection.</li>
                <li><strong>Compliance:</strong> Adherence to laws, regulations, and internal policies.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> 1. Frequency of Customer Transactions</h3>
                <p>Every account establishes a normal rhythm or pattern of activity over time. A salaried individual might have 30-40 transactions a month, while a small tuckshop might have hundreds of small cash deposits. The monitoring system learns this normal frequency. A significant deviation from this pattern is a <strong>red flag</strong>.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> 2. Sizes of Customer Transactions Recorded</h3>
                <p>Just like frequency, the size or value of transactions also forms a key part of a customer's profile. A pensioner's account may typically have transactions under $200, while a construction company will have transactions worth tens of thousands of dollars. The monitoring system looks for amounts that are unusual for that specific customer.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 3. Suspicious Transactions</h3>
                <p>This is a broad but critical category that looks at the nature and pattern of transactions, not just their size or frequency. These are transactions that do not seem to make logical business or personal sense. A classic example is <strong>structuring</strong> (or smurfing).</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> 4. System Errors or Failures</h3>
                <p>Account monitoring is also a vital tool for internal quality control. Sometimes, a strange-looking transaction is not the fault of the customer but is caused by a glitch or error in the bank's own systems.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> 5. Organisational Policies Governing Customer Accounts Monitoring</h3>
                <p>All monitoring activities are strictly guided by the bank's own internal rules, known as <strong>organisational policies</strong>. These policies are written to ensure that the bank complies with national laws and regulations from the RBZ.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: PROCESS AND METHODS ========== */}
        <SectionWrapper id="process">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The Process and Methods of Account Monitoring</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine the Zimbabwe Republic Police (ZRP) setting up a security checkpoint on the highway between Harare and Beitbridge. They have a clear goal: to ensure public safety and intercept any illegal goods. To achieve this, they use a combination of methods. They have an automated number plate recognition camera that scans every car (an automated method), and they also have experienced officers who are trained to spot suspicious behaviour and conduct manual inspections (a manual method). It is this blend of technology and human expertise that makes the checkpoint effective.</p>
              <p>The process of monitoring bank accounts works in exactly the same way. Banks use a layered approach that combines the power of sophisticated computer systems with the judgment of skilled human analysts.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Algorithm:</strong> A set of rules or instructions given to a computer to help it calculate or solve a problem. Banks use algorithms to define what a "suspicious transaction" looks like.</li>
                <li><strong>Automated Monitoring:</strong> The use of specialised software and computer systems to automatically scan and flag transactions that meet certain risk criteria.</li>
                <li><strong>Manual Monitoring:</strong> The review of account activity and transaction reports by a human being, such as a compliance officer or a bank manager.</li>
                <li><strong>Compliance Officer:</strong> A bank employee who is responsible for ensuring that the bank complies with all external regulations and internal policies, particularly those related to anti-money laundering.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> The Monitoring Process Explained</h3>
              <p>The account monitoring process is a continuous, cyclical flow of information and action. It is not a one-time event but an ongoing cycle that can be broken down into four key stages.</p>
              <div className="space-y-3 mt-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Stage 1: Data Collection and Profiling</h4>
                  <p>The process begins the moment an account is opened. The bank's system starts collecting data on every transaction, gradually building a "normal" transaction profile for that customer.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">Stage 2: Detection of Anomalies</h4>
                  <p>The monitoring software continuously scans incoming transactions, comparing them against the customer's established profile and pre-defined risk rules. When a transaction violates a rule, the system automatically generates an alert or "red flag."</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400">Stage 3: Investigation and Analysis</h4>
                  <p>The alert is sent to a human analyst, usually in the bank's compliance or risk department. The officer investigates the alert to understand the context of the transaction.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                  <h4 className="font-bold text-red-600 dark:text-red-400">Stage 4: Action and Reporting</h4>
                  <p>Based on the investigation, the officer decides on a course of action. If the transaction remains suspicious, the officer may contact the customer, freeze the account, and file a <strong>Suspicious Transaction Report (STR)</strong> with the authorities.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Monitor size={20} /> Automated Transaction Monitoring</h3>
                <p>This is the primary method used by all modern banks. It involves using powerful, specialised software that operates 24/7. Its main advantage is its ability to process millions of transactions in real-time.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Manual Monitoring</h3>
                <p>This method relies on the knowledge and experience of bank employees, particularly those who have a direct relationship with the customer, like a branch manager.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Hybrid (Man-Machine) Approach</h3>
                <p>This is the most effective and commonly used method, as it combines the strengths of the other two. The automated system flags anomalies, and human officers investigate the alerts.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Ongoing Account Management & Oversight</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Monitoring</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction Profile</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Red Flag</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">AML</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fraud Prevention</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Structuring</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compliance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">STR</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hybrid Monitoring</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Account Oversight & Monitoring. 📊🔍</p>
        </footer>

      </div>
    </div>
  );
};