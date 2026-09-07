import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  Shield,
  Network,
  ShieldCheck,
  ArrowRight,
  Zap,
  Radio,
  Binary,
  Globe,
  Laptop,
  Users,
  Building2,
  Layers,
  Cpu,
  Server,
  Monitor,
  Info,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Wifi,
  Database,
  RefreshCw,
  Smartphone as Mobile,
  HardDrive,
  Search,
  ClipboardList,
  Settings,
  Activity,
  Box,
  Lock,
  BookOpen,
  Cable,
  ListChecks,
  ArrowLeft,
  Router,
  Repeat,
  Phone,
  Terminal,
  ChevronUp,
  Trophy,
  Target,
  GraduationCap,
  X,
  Sparkles,
  Briefcase,
  Award,
  BookMarked,
  Compass,
  DollarSign,
  Factory,
  FileText,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Landmark,
  Map,
  MessageCircle,
  Package,
  Rocket,
  Scale,
  Star,
  Store,
  TreePine,
  TrendingUp,
  UserX,
  BookOpen as BookIcon,
  CloudRain,
  Swords,
  ShoppingBag,
  Tag,
  Truck,
  Megaphone,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Clipboard,
  BarChart,
  PieChart,
  Calculator,
  Percent,
  TrendingUp as TrendingUpIcon,
  Smile,
  ThumbsUp,
  Award as AwardIcon,
  Target as TargetIcon,
  GitBranch,
  Layers as LayersIcon,
  ArrowUpRight,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'customer-care', label: 'Customer Care' },
  { id: 'costing-pricing', label: 'Costing & Pricing' },
  { id: 'growth', label: 'Growth' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Customer care is not just about being nice – it directly affects profitability. Loyal customers spend more and are cheaper to serve than new customers.',
      },
      {
        title: 'Pro Tip',
        text: 'When calculating costs, always include both direct and indirect costs. Many small businesses fail because they underprice – forgetting to include overheads.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Ansoff Matrix with "P-M": (Existing/New) Products × (Existing/New) Markets. The four strategies are Penetration, Market Development, Product Development, and Diversification.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse mark-up with margin. Mark-up is profit divided by COST; margin is profit divided by SELLING PRICE. The same profit gives different percentages.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Customer care is not just about being nice – it directly affects profitability. Loyal customers spend more and are cheaper to serve than new customers.',
      },
      {
        title: 'Pro Tip',
        text: 'When calculating costs, always include both direct and indirect costs. Many small businesses fail because they underprice – forgetting to include overheads.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Ansoff Matrix with "P-M": (Existing/New) Products × (Existing/New) Markets. The four strategies are Penetration, Market Development, Product Development, and Diversification.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse mark-up with margin. Mark-up is profit divided by COST; margin is profit divided by SELLING PRICE. The same profit gives different percentages.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <TrendingUp size={14} className="inline mr-1" /> CUSTOMER CARE, COSTING & GROWTH
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Customer Care, Costing &amp; Pricing, Business Growth
            </span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Master the essentials of customer care, costing and pricing, and
            business growth strategies. Build a business that retains customers,
            prices profitably, and grows strategically.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-emerald-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Smile size={14} className="inline mr-1" /> Customer Care
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Calculator size={14} className="inline mr-1" /> Costing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Growth
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-emerald-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, term, or strategy..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-emerald-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-emerald-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Read This First
              </h2>

              <div className="p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Same rule as always. You are not here to memorise. You are here to <span className="font-bold underline">understand</span>. When you walk into that exam room, the words you write should come from YOUR head — your own understanding of what you studied. Even if your English is not perfect, even if you write "the business must make sure it does not lose customers by treating them badly" instead of some fancy textbook sentence — that is perfectly fine. That shows understanding. That gets marks.
                  </p>
                  <p className="text-sm md:text-base bg-white dark:bg-[#121212] p-3 rounded-lg mt-3">
                    As you read, keep asking yourself: <span className="font-bold italic">"Can I explain this to my friend right now without looking at the notes?"</span> That is your test of whether you have learned something.
                  </p>
</div>
            </div>

            {/* Customer Care */}
            <div
              ref={(el) => {
                sectionRefs.current['customer-care'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Customer Care
              </h2>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-2">
                What Is Customer Care?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Customer care is basically <span className="font-bold">how a business treats the people who buy from it.</span> Simple as that. But there is a lot more depth to it when you think about it properly.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                Customer care is a <span className="italic">culture</span> — a way of thinking that the whole business has to adopt where the customer is always the priority. It is not just the receptionist smiling. It is every single person in the business, from the owner to the cleaner, understanding that without customers there is no business, so those customers deserve to be treated with respect, efficiency, and genuine care.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                The famous phrase <span className="font-bold">"the customer is always right"</span> is not literally true — sometimes customers are completely wrong. What it means is that in business, you treat customers as if they are right, you listen to them as if they are right, and you work hard to fix their problems even when they might be the ones who caused them. Why? Because arguing with a customer and winning the argument but losing the customer is a terrible business decision.
              </p>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">🟢 Simple Explanation</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Customer care = treating people who buy from you the right way. It means being helpful, honest, fast, friendly, and professional. It means keeping your promises and fixing problems quickly. A business with poor customer care will lose customers no matter how good the product is.</p>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                The Ten Tips for Customer Care
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">RELIABILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customers can count on you to do what you said you would do, every time. Be consistent and impartial – treat everyone fairly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">RESPONSIVENESS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deal with customer needs quickly and willingly. Never make them feel like a burden.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">COMPETENCE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Staff have the skills and knowledge to help properly. Training is essential.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">ACCESSIBILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customers can easily reach you – phones answered, present and available, multiple contact channels.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">COURTESY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Polite, respectful, friendly – even when customers are difficult.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">COMMUNICATION</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Keep customers informed, listen properly, make sure they understand – clear, honest, proactive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">CREDIBILITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customers trust you. Be honest, keep promises, never lie or overpromise.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">SECURITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Customers feel safe – physically, financially, and emotionally. No fear of fraud or danger.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">KNOWLEDGE OF THE CUSTOMER</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand who your customers are – their needs, preferences, buying habits. Provide individualised attention.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">TANGIBLES</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Physical appearance – clean premises, neat staff, professional equipment. First impressions matter.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Benefits of Customer Care
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Attracts new customers through positive word-of-mouth</li>
                  <li>Retains existing customers – they come back and spend more</li>
                  <li>Improves profit margins – loyal customers are less price-sensitive</li>
                  <li>Opens communication channels – customers give valuable feedback</li>
                  <li>Builds reputation – your most valuable asset</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Poor Customer Care – What It Looks Like
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Poor delivery and accessibility – late orders, hard to reach</li>
                  <li>Poor quality merchandise – damaged, expired, substandard</li>
                  <li>Long customer queues – inefficient systems, understaffed</li>
                  <li>Dirty business environment – disrespectful to customers</li>
                  <li>Failing to meet expectations – promises broken</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight mt-6">
                Dealing With Difficult Customers
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Keep smiling – disarms aggression</li>
                  <li>Accept mistakes and apologise – even if not sure, it calms</li>
                  <li>Avoid arguing – you lose even if you are right</li>
                  <li>Maintain composure – never match anger with anger</li>
                  <li>Continue to show a good image – other customers are watching</li>
                </ul>
              </div>
            </div>

            {/* Costing and Pricing */}
            <div
              ref={(el) => {
                sectionRefs.current['costing-pricing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Costing and Pricing
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                What Is Costing?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Costing is the process of <span className="font-bold">calculating how much it costs to produce or deliver a product or service.</span> You need to know your true costs to set prices that cover everything and leave a profit.
              </p>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-4">Direct vs Indirect Costs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-green-600 dark:text-green-400">Direct Costs</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Costs directly linked to making a specific product. If you stop making the product, they disappear.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <li>Direct Material – raw materials in the product</li>
                    <li>Direct Labour – wages of workers making it</li>
                    <li>Direct Expenses – other costs for one product</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400">Indirect Costs (Overheads)</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">General business running costs that cannot be traced to a specific product. Rent, electricity, admin salaries, insurance.</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">🟢 Simple Explanation</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">You are baking cakes. Flour, sugar, eggs = direct materials. Baker's wages = direct labour. Electricity, rent, accountant = indirect costs. They are real costs but apply to the whole business, not just one cake.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                How to Calculate Total Cost Per Item
              </h3>
              <div className="space-y-3 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Step 1: Total Direct Costs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Direct Materials + Direct Labour + Direct Expenses = Total Direct Cost per item.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Step 2: Allocate Indirect Costs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Indirect Costs ÷ Total Labour Hours = Allocation Rate per hour. Then Rate × Hours per item = Indirect Cost per item.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Step 3: Total Cost</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Direct Cost + Allocated Indirect Cost = Total Cost per item.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Pricing – Mark-up and Margin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Mark-up</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profit expressed as a percentage of <span className="font-bold underline">COST</span>.</p>
                  <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-1 rounded">Mark-up = (Profit ÷ Cost) × 100%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Margin</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Profit expressed as a percentage of <span className="font-bold underline">SELLING PRICE</span>.</p>
                  <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-1 rounded">Margin = (Profit ÷ Selling Price) × 100%</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Worked Example</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Chair costs $49 to make. Sold for $60. Profit = $11.</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Mark-up = ($11 ÷ $49) × 100% = <span className="font-bold">22.4%</span></p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Margin = ($11 ÷ $60) × 100% = <span className="font-bold">18.3%</span></p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Same profit, different percentages – because one is against cost, the other against selling price.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Factors Influencing Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Customers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">What are they willing to pay? Understand their sense of value and financial capacity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Competitors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">What are similar businesses charging? Price competitively or justify a premium.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Costs and Profit</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Price must cover all costs (direct AND indirect) and leave a profit. Minimum = total cost per unit.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Pricing Strategies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Cost-Plus Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cost per unit + standard mark-up. Simple, covers costs, but ignores competition and customer value.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Break-Even Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Price that covers all costs at a certain volume – no profit, no loss.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Value-Based Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Price based on what the customer perceives the product to be worth.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Going-Rate Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Price at roughly the same level as competitors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Skimming Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">High initial price for new products, then lower over time.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Penetration Pricing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Low initial price to build market share, then raise later.</p>
                </div>
              </div>
            </div>

            {/* Business Growth */}
            <div
              ref={(el) => {
                sectionRefs.current['growth'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Business Growth
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                What Is Business Growth?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Business growth means the business is getting bigger – more sales, more customers, more staff, more locations. Growth is a sign of health. Without growth, a business stagnates and declines.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                Two types of growth:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                <li><span className="font-bold">Organic (Internal) Growth</span> – growing from within using own resources, profits, and effort. Slower but more controlled.</li>
                <li><span className="font-bold">External Growth</span> – growing by combining with another business through a <span className="font-bold">merger</span> (two businesses combine as equals) or an <span className="font-bold">acquisition</span> (one buys the other).</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                The Ansoff Matrix
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A strategic tool that helps a business think about growth by considering two dimensions: <span className="font-bold">Products</span> (existing or new) and <span className="font-bold">Markets</span> (existing or new). Four strategies, each with different risk.
              </p>

              <div className="grid grid-cols-2 gap-2 max-w-2xl mx-auto mt-4">
                <div className="col-start-2 text-center font-bold text-slate-600 dark:text-slate-400 text-xs">Existing Products</div>
                <div className="col-start-3 text-center font-bold text-slate-600 dark:text-slate-400 text-xs">New Products</div>
                <div className="row-start-2 font-bold text-slate-600 dark:text-slate-400 text-xs flex items-center">Existing Markets</div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg border-2 border-green-300 dark:border-green-700">
                  <p className="font-bold text-green-800 dark:text-green-300 text-xs">1. MARKET PENETRATION</p>
                  <p className="text-xs text-green-700 dark:text-green-400">Lowest Risk</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                  <p className="font-bold text-yellow-800 dark:text-yellow-300 text-xs">3. PRODUCT DEVELOPMENT</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">Medium Risk</p>
                </div>
                <div className="row-start-3 font-bold text-slate-600 dark:text-slate-400 text-xs flex items-center">New Markets</div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                  <p className="font-bold text-blue-800 dark:text-blue-300 text-xs">2. MARKET DEVELOPMENT</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Medium Risk</p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg border-2 border-red-300 dark:border-red-700">
                  <p className="font-bold text-red-800 dark:text-red-300 text-xs">4. DIVERSIFICATION</p>
                  <p className="text-xs text-red-700 dark:text-red-400">Highest Risk</p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Market Penetration – Existing Product, Existing Market</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sell more of what you already sell to the people you already sell to. Lowest risk. Use lower prices, more advertising, promotions, or increased sales force.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Market Development – Existing Product, New Market</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Take your existing product to new geographical areas, new customer segments, or new distribution channels. Medium risk – you know the product but not the new market.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Product Development – New Product, Existing Market</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create new or improved products for your existing customers. Medium risk – you know the customers, but need to create something they want.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Diversification – New Product, New Market</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enter completely unknown territory. Highest risk – new product AND new market. Requires thorough research and preparation.</p>
                </div>
              </div>
            </div>

            {/* Final Exam Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['exam-tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Exam Tips
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">📌 On Customer Care questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Always try to give a real-world example for each point. "Reliability, for example, means if a business promises delivery in 3 days, it must deliver in 3 days consistently." That shows understanding.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">📌 On Costing questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show ALL your working. Even if the final answer is wrong, method marks can be earned. Never just write a final number with no working.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">📌 On Pricing questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the mark-up and margin formulas cold. Mark-up is on cost, margin is on selling price.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">📌 On Growth questions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The Ansoff Matrix is your best friend. Know all four strategies, which is highest and lowest risk, and have an example ready for each.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">You have got this. Understand it, make it yours, go get those marks. 🎓</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  💡 Business Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-emerald-500 dark:text-emerald-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Customer Care Tips</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Growth Strategies</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Customer care builds loyalty, costing ensures you price right,
                and growth strategies guide your expansion. Master all three to
                build a sustainable, profitable business that stands the test of time.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-emerald-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Customer care</strong> is the culture of treating customers with respect, reliability, and professionalism. It builds loyalty and drives profitability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Costing</strong> distinguishes direct costs (materials, labour) from indirect costs (overheads). Total cost per item = direct + allocated indirect costs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pricing</strong> must cover costs and reflect customer value, competition, and strategy. Mark-up is profit/cost; margin is profit/selling price.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-300 font-bold">•</span>
              <span>
                <strong className="text-white">Growth strategies</strong> (Ansoff) range from low-risk Market Penetration to high-risk Diversification. Choose based on market conditions and business capabilities.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Entrepreneurship Skills Development – Customer Care, Costing &amp; Growth 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
