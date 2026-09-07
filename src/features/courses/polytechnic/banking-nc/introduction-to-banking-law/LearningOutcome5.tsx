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
  Ticket, TicketCheck, TicketX, StickyNote
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'definition',
    title: 'Definition of a Cheque',
    keywords: ['cheque', 'definition', 'bill of exchange', 'drawer', 'drawee', 'payee', 'unconditional order', 'on demand'],
  },
  {
    id: 'types',
    title: 'Different Types of Cheques',
    keywords: ['types', 'bearer', 'order', 'open', 'stale', 'post-dated', 'ante-dated', 'cheque'],
  },
  {
    id: 'crossing',
    title: 'Crossing of a Cheque',
    keywords: ['crossing', 'general crossing', 'special crossing', 'account payee only', 'not negotiable', 'security'],
  },
  {
    id: 'legal-crossing',
    title: 'Legal Provisions of a Crossed Cheque',
    keywords: ['crossed cheque', 'legal provisions', 'bank account', 'drawee bank', 'not negotiable', 'protection'],
  },
  {
    id: 'endorsements',
    title: 'Endorsements',
    keywords: ['endorsement', 'blank', 'special', 'restrictive', 'payee', 'endorser', 'endorsee', 'signature'],
  },
  {
    id: 'legal-endorsement',
    title: 'Legal Provisions of Endorsement',
    keywords: ['endorsement', 'legal provisions', 'validity', 'liability', 'transfer of title', 'bills of exchange act'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome5BankingOperations: React.FC = () => {
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
              placeholder="Search sections... (e.g., cheque, crossing, endorsement, bearer)"
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
              Banking Law: LO5
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Legal Aspects of <span className="text-rose-300 font-bold italic">Banking Operations</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Understand cheques, crossings, endorsements, and the legal provisions governing negotiable instruments in banking.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">banking_operations.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Cheque;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Crossing;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Endorsement;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><CreditCard className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Pen className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: DEFINITION OF A CHEQUE ========== */}
        <SectionWrapper id="definition">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Legal Aspects of Banking Operations 🏛️</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A key part of a banker's job is handling negotiable instruments, with cheques being the most common. The laws governing cheques are critical for protecting both the bank and its customers. In Zimbabwe, these laws are largely based on the Bills of Exchange Act.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard size={20} /> Definition of a Cheque</h3>
              <p>A cheque is a specific type of bill of exchange that has a very precise legal definition. A <strong>cheque</strong> is an unconditional order in writing, addressed by one person to another (a banker), signed by the person giving it, requiring the person to whom it is addressed to pay a certain sum of money on demand to a specified person or to the bearer.</p>
              <p className="mt-2">This definition breaks down into <strong>three key parties</strong>:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>The Drawer:</strong> The customer who writes and signs the cheque.</li>
                <li><strong>The Drawee:</strong> The bank on which the cheque is drawn.</li>
                <li><strong>The Payee:</strong> The person or entity to whom the payment is to be made.</li>
              </ul>
              <p className="mt-2">A key feature of a cheque is that it must be <strong>payable on demand</strong>, meaning it can be presented for payment at any time after it is written.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: TYPES OF CHEQUES ========== */}
        <SectionWrapper id="types">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Different Types of Cheques</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Cheques can be classified based on how they are drawn and how they can be paid.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Bearer Cheque</h3>
                <p>A cheque is a bearer cheque if the words "or bearer" are not crossed out. It can be cashed by anyone who holds it, meaning the bank will pay the person who presents the cheque at the counter.</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">⚠️ This type of cheque is risky if lost or stolen.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Order Cheque</h3>
                <p>A cheque is an order cheque if the words "or bearer" have been crossed out. It is payable only to the person or entity named as the payee.</p>
                <p className="mt-2">If the payee wants to transfer it to someone else, they must <strong>endorse</strong> it (sign it on the back).</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Open Cheque</h3>
                <p>This is an uncrossed cheque. It can be paid in cash at the counter of the drawee bank.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> Stale Cheque</h3>
                <p>A cheque becomes stale if it is presented for payment after a specific period of time has passed since its date of issue. In Zimbabwe, this period is typically <strong>six months</strong>.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">The bank has the right to refuse payment on a stale cheque.</p>
              </div>
              <div className={cardClasses('orange')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> Post-Dated Cheque</h3>
                <p>A cheque with a date that is yet to come. It cannot be presented for payment until the date written on it.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileClock size={20} /> Ante-Dated Cheque</h3>
                <p>A cheque with a date that is in the past, but still within the legally valid period for payment (e.g., less than six months old).</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: CROSSING OF A CHEQUE ========== */}
        <SectionWrapper id="crossing">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Crossing of a Cheque</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The crossing of a cheque is a critical security measure. It is an instruction given by the drawer to the drawee bank <strong>not</strong> to pay the cheque in cash at the counter, but to pay it only into a bank account. This provides a safety net because it ensures that a record exists of who received the funds.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> General Crossing</h3>
              <p>A general crossing is done by drawing two parallel transverse lines across the face of the cheque, typically in the top left-hand corner. The words "& Co.", "Not Negotiable", or similar phrases may be written between the lines, but the parallel lines alone are sufficient.</p>
              <p className="mt-2"><strong>Effect:</strong> The cheque cannot be cashed over the counter and must be deposited into <strong>any</strong> bank account.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Special Crossing</h3>
              <p>A special crossing is also done with two parallel transverse lines, but it has the name of a <strong>specific bank</strong> written between them.</p>
              <p className="mt-2"><strong>Effect:</strong> The cheque must be paid into an account held at the specific bank named in the crossing. This provides an even higher level of security than a general crossing.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> "Account Payee Only"</h3>
              <p>While not a formal crossing under the Bills of Exchange Act, the words "Account Payee Only" are often added to a cheque. This is a very strong directive to the collecting bank to ensure that the proceeds of the cheque are credited <strong>only</strong> to the account of the person named as the payee.</p>
              <p className="mt-2">This instruction is taken very seriously by bankers as a matter of good practice and a duty of care, as ignoring it would expose the bank to legal liability.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: LEGAL PROVISIONS OF A CROSSED CHEQUE ========== */}
        <SectionWrapper id="legal-crossing">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Legal Provisions of a Crossed Cheque 🔐</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A crossed cheque is a powerful security tool with specific legal provisions under the Bills of Exchange Act that govern how it can be handled and paid.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Payment through a Bank Account</h3>
                <p>The most fundamental legal provision is that a crossed cheque <strong>cannot</strong> be paid in cash over the counter. The drawee bank is legally obligated to pay the cheque only to another bank. If it is a specially crossed cheque, it must be paid to the specific bank named in the crossing.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Liability of the Drawee Bank</h3>
                <p>If a drawee bank pays a crossed cheque in a manner contrary to the crossing (e.g., pays it in cash at the counter), it is <strong>liable</strong> to the true owner of the cheque for any loss they might suffer as a result.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Protection for the Drawee Bank</h3>
                <p>A bank is legally protected if it acts in <strong>good faith and without negligence</strong>. If a drawee bank pays a crossed cheque in accordance with its crossing, it is not held liable even if the payee's endorsement was forged or the person who presented the cheque was not the true owner.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Effect of "Not Negotiable"</h3>
                <p>When the words "Not Negotiable" are added to a general or special crossing, the cheque remains transferable, but its legal effect is changed. A person who takes a cheque with this crossing <strong>cannot have a better title to it</strong> than the person from whom they received it.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This means if a stolen cheque with this crossing is transferred, the new holder cannot claim to be a "holder in due course" and would not be protected from the true owner's claim.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: ENDORSEMENTS ========== */}
        <SectionWrapper id="endorsements">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Endorsements ✍️</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>An endorsement is the signature of the payee on the back of a cheque, bill of exchange, or promissory note. It is the legal action that transfers the title of the instrument to another person. The person who signs is the <strong>endorser</strong>, and the person to whom the instrument is transferred is the <strong>endorsee</strong>.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Pen size={20} /> Blank Endorsement</h3>
                <p>The most common type. The payee simply signs their name on the back of the cheque. The cheque then becomes a bearer instrument, meaning it can be paid to anyone who holds it.</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">⚠️ This is a very risky type of endorsement.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PenTool size={20} /> Special Endorsement</h3>
                <p>A more secure type. The endorser signs the cheque and specifies to whom it should be paid. For example, a cheque payable to "B. Sithole" can be endorsed "Pay to Lauryn Ncube" and signed "B. Sithole."</p>
                <p className="mt-2">The cheque can now only be paid to <strong>Lauryn Ncube</strong>.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Restrictive Endorsement</h3>
                <p>This endorsement restricts the use of the cheque. For example, writing "For Deposit Only" and signing below it instructs the bank to only credit the amount to the specified account.</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">✅ This is the safest way to endorse a cheque, as it prevents the funds from being cashed if the cheque is lost or stolen.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: LEGAL PROVISIONS OF ENDORSEMENT ========== */}
        <SectionWrapper id="legal-endorsement">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Legal Provisions of Endorsement 📜</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The Bills of Exchange Act lays down specific legal requirements and implications for endorsements.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Validity</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>An endorsement must be made on the cheque itself.</li>
                  <li>It must be a signature, and it must be a signature that is intended to transfer the title.</li>
                  <li>A signature on a separate piece of paper attached to the cheque is legally valid, provided there is no space on the cheque itself.</li>
                </ul>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Order of Endorsements</h3>
                <p>If a cheque has been endorsed multiple times, the endorsements are presumed to have been made in the order in which they appear on the cheque.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Liability of the Endorser</h3>
                <p>By endorsing a cheque, the endorser legally guarantees that the cheque will be paid. If the cheque is dishonoured (e.g., the drawer's account has insufficient funds), the holder can demand payment from the endorser.</p>
                <p className="mt-2">The endorser, in turn, can demand payment from any previous endorser or from the original drawer.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Transfer of Title</h3>
                <p>A valid endorsement transfers the full legal title of the cheque to the new holder. The new holder can then either present the cheque for payment or negotiate it further by endorsing it to another party.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of LO5 — Legal Aspects of Banking Operations</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cheque</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bearer</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stale</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Post-Dated</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Crossed</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">General Crossing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Special Crossing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Payee</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Endorsement</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blank Endorsement</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Special Endorsement</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Restrictive Endorsement</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Banking Operations & Legal Aspects. 📝🏦</p>
        </footer>

      </div>
    </div>
  );
};

export const LearningOutcome5 = LearningOutcome5BankingOperations;
