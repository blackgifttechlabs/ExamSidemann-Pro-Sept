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
  ThumbsUp as ThumbsUpIcon, ThumbsDown as ThumbsDownIcon, 
  CheckCircle as CheckCircleIcon, XCircle as XCircleIcon,
  HelpCircle, MessageSquare, Mail, Send, Phone, Video,
  Smile, Frown, Meh, UserPlus as UserPlusIcon, 
  UserMinus as UserMinusIcon, UserCheck as UserCheckIcon,
  Shield as ShieldIcon, Lock as LockIcon, Key, Fingerprint,
  BadgeCheck, Award as AwardIcon, Star, Crown as CrownIcon
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'importance',
    title: 'The Importance of Good Communication in Banking',
    keywords: ['communication', 'importance', 'trust', 'customer service', 'banking', 'inquiry', 'active listening'],
  },
  {
    id: 'reasons',
    title: 'Reasons Why Good Communication is Essential',
    keywords: ['reasons', 'essential', 'trust', 'accuracy', 'loyalty', 'problem solving', 'education', 'reputation', 'compliance'],
  },
  {
    id: 'factors',
    title: 'Ten Factors of Effective Verbal Communication',
    keywords: ['factors', 'verbal communication', 'clarity', 'active listening', 'tone', 'empathy', 'questioning', 'patience', 'honesty', 'positivity', 'confirmation', 'respect'],
  },
  {
    id: 'customer-service',
    title: 'The Importance of Good Customer Service Practices in Banking',
    keywords: ['customer service', 'service', 'loyalty', 'retention', 'reputation', 'competitive advantage'],
  },
  {
    id: 'five-cs',
    title: 'The 5 C\'s of Professional Communication',
    keywords: ['5 cs', 'clarity', 'conciseness', 'correctness', 'completeness', 'cohesiveness', 'professional communication'],
  },
  {
    id: 'ethics',
    title: 'Professional Ethics and Organisational Standards',
    keywords: ['ethics', 'standards', 'integrity', 'confidentiality', 'conflict of interest', 'fiduciary duty', 'fairness'],
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
              placeholder="Search sections... (e.g., communication, active listening, ethics, 5 Cs)"
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
              Customer Service: LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              The Art of <span className="text-emerald-300 font-bold italic">Customer Inquiries</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Master the art of communication in banking, from building trust and handling inquiries to professional ethics and the 5 C's of communication.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">customer_inquiries.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Communication;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Factors;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Ethics;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><MessageCircle className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: IMPORTANCE OF GOOD COMMUNICATION ========== */}
        <SectionWrapper id="importance">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The Importance of Good Communication in Banking</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine a customer, Mr. Banda, walks into a bank branch in Gweru. He is a small-scale farmer who has just received a payment for his crops, but he is worried because he received an SMS notification with a balance that seems wrong. The experience he has in the next five minutes will determine whether he trusts the bank with his hard-earned money or walks away forever. If the bank teller is dismissive, uses confusing jargon, or seems too busy to help, Mr. Banda will leave feeling stressed and untrusting. But if the teller greets him respectfully, listens carefully, and explains the situation in simple, clear language, he will leave feeling valued and confident that his money is in safe hands.</p>
              <p>Banking isn't just about numbers and transactions; it's fundamentally about <strong>trust</strong>. Money is a very personal and often emotional topic for people. Good communication is the bridge we use to build that trust. When a customer knows they can ask a question and get a clear, respectful, and helpful answer, they develop loyalty to the bank.</p>
              <p>Therefore, learning how to communicate effectively is not just a "soft skill"—it is the single most important tool you will use every day as a banking professional. It prevents errors, solves problems, builds the bank's reputation, and makes your job more effective and rewarding. It is the foundation upon which all other banking skills are built.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Communication:</strong> The process of sharing information, ideas, and feelings clearly between people.</li>
                <li><strong>Customer Inquiry:</strong> Any question, request, or problem a customer brings to the bank.</li>
                <li><strong>Jargon:</strong> Special words or expressions used by a particular profession that are difficult for others to understand (e.g., "nostro," "RTGS," "lien").</li>
                <li><strong>Active Listening:</strong> The skill of fully concentrating on what is being said, understanding it, and responding appropriately.</li>
                <li><strong>Trust:</strong> A firm belief in the reliability, truth, ability, or strength of someone or something.</li>
                <li><strong>Empathy:</strong> The ability to understand and share the feelings of another person.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: REASONS WHY GOOD COMMUNICATION IS ESSENTIAL ========== */}
        <SectionWrapper id="reasons">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Reasons Why Good Communication is Essential</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Good communication is the lifeblood of customer service in banking. Here are ten specific reasons why it is so important when handling customer inquiries:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 1. To Build Foundational Trust</h3>
                <p>Money is sensitive. When you communicate clearly, confidently, and honestly, you show the customer that you are a competent professional. This builds their confidence that the bank is a safe and reliable place for their money.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> 2. To Ensure Complete Accuracy</h3>
                <p>A small misunderstanding can lead to a huge financial error. Good communication, which includes skills like repeating information for confirmation, prevents these costly mistakes.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> 3. To Enhance Customer Loyalty</h3>
                <p>A key reason customers stay with one bank is positive personal experience. A customer who feels listened to and respected is a loyal customer who is less likely to switch to a competitor.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={20} /> 4. To Solve Problems Efficiently</h3>
                <p>By using active listening, you can quickly understand the real issue a customer is facing, avoiding a long, frustrating back-and-forth and saving time for both you and the customer.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 5. To Manage and De-escalate Difficult Situations</h3>
                <p>Strong communication skills, like remaining calm, speaking in a reassuring tone, and showing empathy, can calm a tense situation and turn a complaint into a resolved issue.</p>
              </div>
              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lightbulb size={20} /> 6. To Educate and Empower the Customer</h3>
                <p>Good communication allows you to explain products in simple terms, helping customers understand their options and make financial decisions that are right for them.</p>
              </div>
              <div className={cardClasses('pink')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> 7. To Identify Opportunities (Cross-Selling)</h3>
                <p>By listening carefully to a customer's needs, you might identify an opportunity to offer them another product that could help them.</p>
              </div>
              <div className={cardClasses('teal')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Award size={20} /> 8. To Protect and Improve the Bank's Reputation</h3>
                <p>Every single interaction you have with a customer shapes the bank's public image. A positive, helpful experience creates a good reputation in the community.</p>
              </div>
              <div className={cardClasses('orange')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircle size={20} /> 9. To Gather Valuable Feedback</h3>
                <p>When customers feel that you are open and listen well, they will offer honest feedback about the bank's services. This feedback is like free market research.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 10. To Ensure Legal and Regulatory Compliance</h3>
                <p>Many banking transactions require that the customer is given clear and complete information about terms, conditions, and charges. Effective communication is essential to meet this legal duty.</p>
              </div>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageSquare size={20} /> Example: Poor vs. Good Communication</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><XCircle size={18} /> POOR Communication</h4>
                  <p className="text-sm mt-2"><strong>Scenario:</strong> Mrs. Dube wants to send money to her son in Harare.</p>
                  <p className="text-sm">The teller says: "Okay, fill out this RTGS form. You'll need the recipient's nostro account details and the sort code for his branch."</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Result: Mrs. Dube is confused, intimidated, and leaves frustrated.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><CheckCircle size={18} /> GOOD Communication</h4>
                  <p className="text-sm mt-2"><strong>Scenario:</strong> Mrs. Dube wants to send money to her son in Harare.</p>
                  <p className="text-sm">The teller says: "Of course, I can help you with that. I just need his full name, bank account number, and which branch he opened his account at. I'll show you exactly where to write it."</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Result: Mrs. Dube feels respected, guided, and completes the transaction successfully.</p>
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: TEN FACTORS OF EFFECTIVE VERBAL COMMUNICATION ========== */}
        <SectionWrapper id="factors">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Ten Factors of Effective Verbal Communication</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Think about explaining how to send money using EcoCash to your Gogo for the first time. You wouldn't use the same words or speak at the same speed as you would with your best friend. You would choose your words carefully, speak slowly, and listen patiently to her questions. You are adapting your communication to your audience. The words you choose, the way your voice sounds, and how well you listen are the tools you use to build a bridge of understanding.</p>
              <p>In a bank, this bridge is everything. Effective verbal communication is not just about talking; it's about making the customer feel heard, understood, and respected. How you say something is often more important than what you say.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> 1. Clarity and Simplicity</h3>
                <p>Avoid technical jargon at all costs. Terms like "nostro," "lien," "RTGS," or "COT" are meaningless to most customers. Your job is to be a translator, converting complex banking concepts into simple, everyday language.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Ear size={20} /> 2. Active Listening</h3>
                <p>Communication is a two-way street, and listening is half the conversation. Active listening is the skill of focusing completely on the customer. A key technique is to paraphrase or summarize their issue to confirm you have understood correctly.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Mic size={20} /> 3. Tone of Voice</h3>
                <p>A warm, friendly, and confident tone is reassuring and puts customers at ease. Your voice should be calm and professional. Your tone should always convey the message: "I am here to help you."</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> 4. Empathy</h3>
                <p>Empathy is the ability to understand and acknowledge the customer's feelings. Using empathetic phrases like, "I can understand how frustrating that must be," shows that you are a caring human being.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HelpCircle size={20} /> 5. Effective Questioning</h3>
                <p>Asking the right questions is the fastest way to diagnose a problem. Use open-ended questions (starting with "What," "How") to encourage details and closed-ended questions (yes/no) to confirm facts.</p>
              </div>
              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> 6. Patience</h3>
                <p>Not all customers will be able to explain their problems clearly. It is vital to remain patient at all times. Never show any sign of impatience. Rushing a customer will only increase their anxiety and lead to mistakes.</p>
              </div>
              <div className={cardClasses('pink')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 7. Honesty and Transparency</h3>
                <p>Trust is built on honesty. If you don't know the answer, it is far better to say, "Let me find the correct information for you," than to guess. Be clear and upfront about fees, charges, and timelines.</p>
              </div>
              <div className={cardClasses('teal')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> 8. Positivity and Confidence</h3>
                <p>Use positive language and maintain a confident demeanor. Confidence in your voice and your knowledge reassures the customer that they are in capable hands.</p>
              </div>
              <div className={cardClasses('orange')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckSquare size={20} /> 9. Confirmation and Summarisation</h3>
                <p>At the end of an important conversation, summarise what has been discussed and agreed upon. This ensures there are no misunderstandings and gives the customer a clear final understanding.</p>
              </div>
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 10. Respect</h3>
                <p>This includes using polite language ("please," "thank you"), addressing the customer properly, and giving them your undivided attention. This respectful attitude is the core of professional service.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: CUSTOMER SERVICE PRACTICES ========== */}
        <SectionWrapper id="customer-service">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The Importance of Good Customer Service Practices in Banking</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Very often, the deciding factor for a customer to choose one bank over another is the quality of service they receive. Good customer service is the practice of treating customers with respect, efficiency, and empathy in every single interaction. It's a philosophy that puts the customer at the heart of everything the bank does. It is the bank's most important strategy for standing out from the competition, building a loyal base of customers, and ensuring long-term success.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> 1. Competitive Differentiator</h3>
                <p>A bank known for being friendly, fast, and helpful will attract and keep customers.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> 2. Builds Customer Loyalty</h3>
                <p>Good service makes customers feel valued, turning them into loyal clients who stay for the long term.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Award size={20} /> 3. Enhances Public Reputation</h3>
                <p>A story of exceptional service can create powerful, positive word-of-mouth advertising.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> 4. Increases Profitability</h3>
                <p>Happy customers are more likely to use a wider range of the bank's services.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> 5. Reduces Errors and Operational Risk</h3>
                <p>Attentive staff make fewer transactional errors, which protects the customer and the bank.</p>
              </div>
              <div className={cardClasses('indigo')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 6. Improves Employee Morale</h3>
                <p>Working in a positive, customer-focused environment is more rewarding for employees.</p>
              </div>
              <div className={cardClasses('pink')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircle size={20} /> 7. Provides Invaluable Feedback</h3>
                <p>When customers trust you, they give you honest feedback for improvement.</p>
              </div>
              <div className={cardClasses('teal')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 8. Creates a Safer Banking Environment</h3>
                <p>Good service includes being observant and diligent, which can help prevent fraud.</p>
              </div>
              <div className={cardClasses('orange')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon2 size={20} /> 9. Fosters Financial Inclusion</h3>
                <p>Friendly service can help individuals new to banking feel comfortable.</p>
              </div>
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 10. Key Part of Regulatory Compliance</h3>
                <p>Regulators require banks to treat customers fairly.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: THE 5 C'S ========== */}
        <SectionWrapper id="five-cs">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>The 5 C's of Professional Communication</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>To ensure that every message we send to a customer—whether spoken, written, or digital—is effective, we can use a simple framework called the 5 C's of Professional Communication. This framework acts as a checklist to ensure your communication is always clear, respectful of the customer's time, accurate, helpful, and logical.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> 1. Clarity</h3>
                <p>Your message must be simple and easy to understand. Avoid banking jargon. Use plain, everyday language that any customer can understand.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> 2. Conciseness</h3>
                <p>Be brief and direct. Respect the customer's time by getting straight to the point. Provide the necessary information without unnecessary detail or repetition.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> 3. Correctness</h3>
                <p>The information you provide must be 100% accurate. Double-check facts, figures, and spelling. Incorrect information can lead to serious financial and legal consequences.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> 4. Completeness</h3>
                <p>Give the customer all the information they need to understand and take action. Don't leave them with unanswered questions or needing to call back for missing details.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> 5. Cohesiveness</h3>
                <p>Your communication must be logical and well-organized. Present information in a clear, step-by-step manner that is easy to follow and understand.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: PROFESSIONAL ETHICS ========== */}
        <SectionWrapper id="ethics">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Professional Ethics and Organisational Standards</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Laws might tell you what you are allowed to do, but ethics tell you what you <strong>should</strong> do. Ethics are the moral principles that guide your behaviour, based on a sense of right and wrong. In banking, ethics are not just a nice-to-have; they are the absolute foundation of the entire industry. The whole banking system is built on one single, invisible thing: <strong>trust</strong>. Professional ethics is the code of conduct that ensures every bank employee acts with honesty, integrity, and absolute discretion, protecting the customer and the bank at all times.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Ethics:</strong> Moral principles that govern a person's behaviour. The study of what is right and wrong.</li>
                <li><strong>Integrity:</strong> The quality of being honest and having strong moral principles.</li>
                <li><strong>Confidentiality:</strong> A strict rule that information about a customer and their account must be kept secret and private.</li>
                <li><strong>Conflict of Interest:</strong> A situation where personal interests could compromise a professional's judgment.</li>
                <li><strong>Fiduciary Duty:</strong> The highest ethical obligation to act in the best financial interests of another party.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> How Ethics Relates to Banking: The Pillars of Trust</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Pillar 1: The Duty of Confidentiality:</strong> This is the most sacred rule. All information about a customer is 100% private.</li>
                <li><strong>Pillar 2: Honesty and Integrity:</strong> This means being truthful in all your dealings and not hiding fees or charges.</li>
                <li><strong>Pillar 3: Fairness and Objectivity:</strong> Treat all customers equally and fairly, regardless of their status or relationship to you.</li>
                <li><strong>Pillar 4: Avoiding Conflicts of Interest:</strong> You must never use your professional position for personal gain.</li>
                <li><strong>Pillar 5: Professional Competence and Care:</strong> Part of being ethical is having the skill and diligence to do your job properly without careless mistakes.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Example: Ethical vs. Unethical Handling</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><XCircle size={18} /> Unethical/Incorrect</h4>
                  <p className="text-sm mt-2"><strong>Scenario:</strong> Amai Chipo asks for her husband's account balance.</p>
                  <p className="text-sm">The teller whispers the balance to her.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Result: Serious ethical breach. The teller violated the husband's privacy and could be fired.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><CheckCircle size={18} /> Ethical/Correct</h4>
                  <p className="text-sm mt-2"><strong>Scenario:</strong> Amai Chipo asks for her husband's account balance.</p>
                  <p className="text-sm">The teller responds: "I understand your concern. However, for security and privacy, I am not allowed to share account information with anyone except the account holder. Please come in with your husband."</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Result: The teller protected the customer's privacy, followed the bank's rules, and upheld their ethical duty.</p>
                </div>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of LO1 — The Art of Customer Inquiries</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Communication</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Listening</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Service</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">The 5 C's</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Empathy</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ethics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidentiality</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trust</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Art of Customer Inquiries. 🗣️🤝</p>
        </footer>

      </div>
    </div>
  );
};