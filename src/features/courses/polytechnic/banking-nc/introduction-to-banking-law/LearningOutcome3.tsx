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
  Church, School, Home as HomeIcon, Building as BuildingIcon, 
  Banknote as BanknoteIcon, Briefcase as BriefcaseIcon,
  Handshake, MessageCircle, FileCheck, FileX
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'courts',
    title: 'Hierarchy of Courts in Zimbabwe',
    keywords: ['hierarchy', 'courts', 'zimbabwe', 'village courts', 'magistrate courts', 'high court', 'supreme court', 'constitutional court', 'specialist courts', 'labour court', 'administrative court', 'small claims court'],
  },
  {
    id: 'litigation',
    title: 'Litigation',
    keywords: ['litigation', 'process', 'pre-trial', 'trial', 'judgment', 'enforcement', 'advantages', 'disadvantages', 'lawsuit', 'court case'],
  },
  {
    id: 'arbitration',
    title: 'Arbitration',
    keywords: ['arbitration', 'process', 'notice of arbitration', 'hearing', 'award', 'advantages', 'disadvantages', 'arbitrator', 'tribunal'],
  },
  {
    id: 'comparison',
    title: 'Differentiating Between Litigation and Arbitration',
    keywords: ['difference', 'comparison', 'litigation vs arbitration', 'process', 'forum', 'decision-maker', 'privacy', 'cost', 'speed', 'finality', 'appeal'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome3: React.FC = () => {
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
              placeholder="Search sections... (e.g., high court, litigation, arbitration, magistrate)"
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
              Banking Law: LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Hierarchy of Courts & <span className="text-purple-300 font-bold italic">Dispute Resolution</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the structure of Zimbabwe's court system, the litigation process, arbitration, and the key differences between these dispute resolution methods.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">courts_arbitration.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Courts;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Litigation;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Arbitration;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Landmark className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Handshake className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: HIERARCHY OF COURTS ========== */}
        <SectionWrapper id="courts">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Hierarchy of Courts in Zimbabwe ⚖️</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The court system in Zimbabwe is structured as a hierarchy, meaning that courts are ranked according to their authority. This system allows for the efficient administration of justice, with less serious cases handled by lower courts and more complex cases and appeals heard by higher courts. At the top of the hierarchy are the superior courts, whose decisions are binding on all lower courts.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HomeIcon size={20} /> 5. Village Courts</h3>
              <p>At the very bottom of the judicial hierarchy are Village Courts, also known as Traditional Courts. These courts are not part of the formal court system but are recognized by law to handle certain local disputes. They are presided over by a village head or a headman.</p>
              <p><strong>Jurisdiction:</strong> They primarily deal with civil disputes based on customary law, such as marriage disputes, inheritance issues, and minor land disputes within their community. They cannot hear criminal cases or matters involving large sums of money.</p>
              <p><strong>Appeals:</strong> A person who is not satisfied with a decision from a village court can appeal to a Magistrate Court.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BuildingIcon size={20} /> 4. Magistrate Courts</h3>
              <p>The Magistrate Court is the main lower court in Zimbabwe and handles the majority of the country's civil and criminal cases. They are present in almost all towns and cities and are the first point of call for many legal matters.</p>
              <p><strong>Jurisdiction:</strong> They have both civil and criminal jurisdiction.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Criminal:</strong> They hear all criminal cases, except for the most serious crimes like murder, treason, or armed robbery, which are reserved for the High Court.</li>
                <li><strong>Civil:</strong> They hear civil cases with a limited monetary value. The monetary limit for claims is set by law and can change over time.</li>
              </ul>
              <p><strong>Hierarchy:</strong> There are different levels of magistrates, from ordinary magistrates to senior, provincial, and chief magistrates, with their seniority determining the severity of cases they can hear.</p>
              <p><strong>Appeals:</strong> They hear appeals from Village Courts. Decisions made in a Magistrate Court can be appealed to the High Court.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> 3. High Court</h3>
              <p>The High Court is a superior court of record with nationwide jurisdiction. It has unlimited original jurisdiction, which means it can hear any type of civil or criminal case that has not already been assigned to another court by law.</p>
              <p><strong>Jurisdiction:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Criminal:</strong> The High Court hears all serious criminal cases, particularly those where a person has been charged with an offense that could lead to a long prison sentence or the death penalty.</li>
                <li><strong>Civil:</strong> It can hear any civil matter, including those involving large sums of money.</li>
                <li><strong>Appellate:</strong> The High Court acts as a court of appeal for decisions from all Magistrate Courts and other lower tribunals.</li>
                <li><strong>Supervisory Role:</strong> The High Court also has a supervisory role over all lower courts to ensure they operate correctly.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Crown size={20} /> 2. Supreme Court</h3>
              <p>The Supreme Court is the highest court of appeal in Zimbabwe for all matters except constitutional issues. It is the final level for most civil and criminal cases.</p>
              <p><strong>Jurisdiction:</strong> It hears appeals from the High Court and other specialized superior courts. Its primary function is to correct errors made by lower courts on points of law.</p>
              <p><strong>Final Authority:</strong> Its decisions are final and binding on all lower courts in the country. There is no further right of appeal once the Supreme Court has made a ruling on a non-constitutional matter.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 1. Constitutional and Specialist Courts</h3>
              <p><strong>Constitutional Court:</strong> The Constitutional Court is the highest court in the land for all constitutional matters. It stands at the top of the judicial hierarchy and has the final say on issues relating to the Constitution of Zimbabwe. It hears appeals from the Supreme Court on constitutional matters and has exclusive original jurisdiction to hear cases concerning violations of the Constitution.</p>
              <p><strong>Specialist Courts:</strong> Zimbabwe also has other courts that specialize in specific areas of law to handle cases more efficiently.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Labour Court:</strong> This court deals with disputes between employers and employees.</li>
                <li><strong>Administrative Court:</strong> This court handles matters of administrative law, such as disputes between a citizen and a government department.</li>
                <li><strong>Small Claims Court:</strong> This court handles minor civil claims for a specific amount of money, providing a faster and cheaper way to settle small disputes.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: LITIGATION ========== */}
        <SectionWrapper id="litigation">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Litigation vs. Arbitration ⚖️</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">Defining Litigation</h3>
              <p>Litigation is the process of resolving a legal dispute between two or more parties by taking it to a formal court of law. It is a structured and public process governed by specific legal rules and procedures. In the context of banking law, litigation might be used to settle disagreements over loans, mortgages, or contracts between a bank and a customer. The outcome is decided by a neutral third party (a judge or magistrate) who has the authority to make a legally binding decision.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> The Process of Litigation</h3>
              <p>The process of litigation can be long and complex, but it generally follows a clear series of steps:</p>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><Info size={18} /> 1. The Pre-Trial Stage</h4>
                  <p>This is the phase before the case goes to court. It begins when the party with the complaint (the plaintiff) files a formal document called a summons or statement of claim with the court. This document outlines the details of the dispute and the relief they are seeking. The other party (the defendant) is then served with the summons and must respond, either by admitting the claim or by filing a statement of defence to dispute it.</p>
                  <p className="mt-2">This stage also includes a process called <strong>discovery</strong>, where each side requests and shares relevant evidence, such as documents, contracts, and witness lists. The goal is for both parties to understand the other side's case fully before the trial begins. Many cases are settled at this stage without ever going to trial.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2"><Gavel size={18} /> 2. The Trial</h4>
                  <p>If the dispute is not settled, it proceeds to trial. This is the formal hearing where both parties present their case before a judge or magistrate. The process typically involves:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Opening Statements:</strong> Both the plaintiff and defendant's lawyers give a brief overview of their arguments.</li>
                    <li><strong>Presentation of Evidence:</strong> Each side calls witnesses to testify and presents documents and other evidence to support their claims. The opposing lawyer has the opportunity to cross-examine the witnesses.</li>
                    <li><strong>Closing Arguments:</strong> After all the evidence is presented, each side's lawyer summarizes their case and argues for a favourable outcome.</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><Award size={18} /> 3. Judgment and Enforcement</h4>
                  <p>Once the trial concludes, the judge or magistrate will review all the evidence and make a final decision, known as the <strong>judgment</strong>. This judgment is a legally binding order. If the losing party fails to comply with the judgment, the winning party can apply to the court to have the judgment enforced. This could involve court-ordered seizures of property, freezing of bank accounts, or other legal means to ensure the judgment is obeyed.</p>
                </div>
              </div>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Advantages of Litigation</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Enforceability:</strong> The outcome is a legally binding court order or judgment. If the losing party does not comply, the court has the power to enforce its decision.</li>
                <li><strong>Formal Process:</strong> Litigation follows strict rules and procedures, ensuring the process is fair and structured. Both sides have a chance to present their case, and the judge is an impartial third party.</li>
                <li><strong>Public Record:</strong> The proceedings are public, which can be an advantage if a party wants to prove a point or expose wrongdoing.</li>
                <li><strong>Creates Precedent:</strong> A court's decision can set a legal precedent that can be used to resolve future disputes.</li>
                <li><strong>Finality:</strong> Once a case has gone through all levels of appeal, the court's decision is final.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsDown size={20} /> Disadvantages of Litigation</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>High Cost:</strong> Litigation can be very expensive, including legal fees, court fees, and expenses of preparing evidence.</li>
                <li><strong>Time-Consuming:</strong> The process can be very slow, often taking months or even years to reach a conclusion.</li>
                <li><strong>Adversarial Nature:</strong> Litigation is confrontational, which can destroy business relationships and create stress.</li>
                <li><strong>Lack of Control:</strong> Once a dispute goes to court, the parties lose control over the outcome. The judge makes the final decision.</li>
                <li><strong>Publicity:</strong> The public nature of court proceedings means sensitive or confidential business information can be exposed.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: ARBITRATION ========== */}
        <SectionWrapper id="arbitration">
          <section className="space-y-6 pt-12">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">Defining Arbitration 🤝</h3>
              <p>Arbitration is a method of dispute resolution where parties agree to have their disagreement decided by an independent, impartial third party, known as an arbitrator or a tribunal. Unlike litigation, which takes place in a public court, arbitration is a private process. The parties choose the arbitrator and agree on the rules and procedures. The arbitrator then hears the evidence and makes a decision, called an award, which is legally binding on both parties.</p>
              <p>Arbitration is a common method of resolving disputes in the banking sector, particularly for commercial disagreements between banks and their clients, because it is often faster and more confidential than litigation.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> The Process of Arbitration</h3>
              <p>The process of arbitration is designed to be more flexible and less formal than litigation, but it still follows a structured path.</p>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><MessageCircle size={18} /> 1. The Pre-Arbitration Stage</h4>
                  <p>The process begins when a dispute arises. The parties must have an existing agreement to arbitrate, usually through a clause in their original contract (such as a loan agreement or service contract). One party initiates the process by sending a <strong>Notice of Arbitration</strong> to the other party, outlining the nature of the dispute. The parties then agree on the number of arbitrators and select them. They might choose a single arbitrator or a panel of three.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2"><Users size={18} /> 2. The Hearing</h4>
                  <p>Once the arbitrator(s) have been appointed, a hearing is scheduled. This is where both parties present their arguments and evidence. The hearing is private and can be conducted in a location agreed upon by the parties.</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Submission of Evidence:</strong> The parties submit written statements, documents, and other evidence to the arbitrator(s).</li>
                    <li><strong>Witness Testimony:</strong> Witnesses may be called to testify, and they can be cross-examined by the opposing party's legal counsel.</li>
                    <li><strong>Argument:</strong> Legal counsel for both parties present their arguments and respond to the evidence.</li>
                  </ul>
                  <p className="mt-2">The arbitrator controls the process, and it can be much less formal than a court trial. They may allow for more flexible rules of evidence and can set their own timelines.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><Award size={18} /> 3. The Award</h4>
                  <p>After the hearing concludes, the arbitrator or tribunal deliberates and makes a final decision. This decision is called an <strong>arbitral award</strong>. The award is a written document that explains the reasons for the decision and specifies the remedy, such as the payment of money or the fulfillment of a contract term. The award is final and binding on both parties. It can be enforced by a court of law, similar to a court judgment, which gives it legal power.</p>
                </div>
              </div>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Advantages of Arbitration</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Flexibility and Speed:</strong> Arbitration is often much faster than litigation. The parties can agree on a convenient schedule for hearings.</li>
                <li><strong>Confidentiality:</strong> The process is private and not open to the public. This is a major advantage for banks and businesses.</li>
                <li><strong>Expertise:</strong> Parties can choose an arbitrator who is an expert in the specific field of the dispute, such as banking or finance.</li>
                <li><strong>Cost-Effective:</strong> Arbitration can often be more cost-effective than litigation, as the process is shorter and less formal.</li>
                <li><strong>Finality:</strong> The arbitrator's decision is generally final and legally binding.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsDown size={20} /> Disadvantages of Arbitration</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Limited Appeal:</strong> The right to appeal an arbitral award is very limited. If the arbitrator makes a mistake, it can be very difficult to have the decision reviewed.</li>
                <li><strong>Lack of Precedent:</strong> Because arbitration is a private process, the decisions are not published and cannot be used as a legal precedent.</li>
                <li><strong>Cost:</strong> While it can be cheaper than litigation, arbitration is still an expensive process. The parties must pay the arbitrator's fees.</li>
                <li><strong>No Jury:</strong> Arbitration does not involve a jury, which some parties may prefer.</li>
                <li><strong>Difficulty of Enforcing an Award:</strong> Enforcing an award in a foreign country can be difficult and complicated.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: DIFFERENTIATING LITIGATION AND ARBITRATION ========== */}
        <SectionWrapper id="comparison">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Differentiating Between Litigation and Arbitration ⚖️🤝</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The key differences between litigation and arbitration lie in their process, formality, cost, and the nature of their outcome. While both are methods of dispute resolution, they operate in fundamentally different ways.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> 1. Process and Forum</h3>
              <p><strong>Litigation</strong> takes place in a public court of law. It is a formal, government-run process. The dispute is heard by a judge or magistrate who is part of the state's legal system. The rules of evidence and procedure are strict and determined by law.</p>
              <p><strong>Arbitration</strong> is a private, out-of-court process. It is a form of dispute resolution where the parties agree to resolve their dispute outside of court. The proceedings are held in a private setting, often in a lawyer's office, and are not open to the public.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 2. Choice of Decision-Maker</h3>
              <p><strong>In litigation</strong>, the parties do not get to choose their decision-maker. The judge or magistrate is assigned to the case by the court.</p>
              <p><strong>In arbitration</strong>, the parties have the power to select their arbitrator or arbitrators. They can choose someone who has specialized knowledge or expertise in the specific area of their dispute, such as banking law or finance. This is a significant advantage in complex commercial cases.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 3. Privacy and Confidentiality</h3>
              <p><strong>Litigation</strong> is a matter of public record. All court proceedings, including evidence and judgments, are public information. This can be a disadvantage for businesses that want to keep sensitive financial or commercial information private.</p>
              <p><strong>Arbitration</strong> is confidential. The entire process, from the initial hearing to the final award, is private. This makes it a popular choice for businesses that want to protect their reputation and trade secrets.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> 4. Cost and Speed</h3>
              <p><strong>Litigation</strong> is generally more expensive and time-consuming. The process can take months or years to resolve due to crowded court dockets, and the legal fees can be very high.</p>
              <p><strong>Arbitration</strong> is often faster and can be more cost-effective. The parties can set their own timeline, and the process is less formal. While the parties must pay the arbitrator's fees, the overall cost can be lower due to the reduced time and complexity.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 5. Finality and Appeal</h3>
              <p><strong>In litigation</strong>, there are multiple levels of appeal. If a party is unhappy with a decision from a lower court, they can appeal to a higher court to have the decision reviewed.</p>
              <p><strong>In arbitration</strong>, the right to appeal is very limited. The arbitrator's decision (the award) is generally considered final and binding. This provides certainty but makes it very difficult to overturn a decision, even if there was a mistake.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of LO3 — Hierarchy of Courts & Dispute Resolution</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Village Courts</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Magistrate Courts</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">High Court</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supreme Court</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Constitutional Court</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Litigation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Arbitration</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispute Resolution</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Courts & Dispute Resolution. ⚖️🏛️</p>
        </footer>

      </div>
    </div>
  );
};
