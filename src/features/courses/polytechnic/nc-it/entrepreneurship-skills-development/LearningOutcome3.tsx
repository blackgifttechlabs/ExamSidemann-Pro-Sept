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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'what-is-marketing', label: 'Marketing' },
  { id: 'marketing-mix', label: '8Ps' },
  { id: 'product-lifecycle', label: 'PLC' },
  { id: 'marketing-plan', label: 'Plan' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'Marketing is not just advertising – it includes product design, pricing, distribution, and customer service. Everything that touches the customer is marketing.',
      },
      {
        title: 'Pro Tip',
        text: 'The 4Ps (Product, Price, Place, Promotion) are the foundation, but modern marketing adds People, Process, Physical Evidence, and Partnerships for services.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Product Life Cycle stages with "DIG-M-D": Development, Introduction, Growth, Maturity, Decline.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "needs" (basic requirements) with "wants" (how we satisfy needs). Marketing creates wants, but it does not create needs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Marketing is not just advertising – it includes product design, pricing, distribution, and customer service. Everything that touches the customer is marketing.',
      },
      {
        title: 'Pro Tip',
        text: 'The 4Ps (Product, Price, Place, Promotion) are the foundation, but modern marketing adds People, Process, Physical Evidence, and Partnerships for services.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Product Life Cycle stages with "DIG-M-D": Development, Introduction, Growth, Maturity, Decline.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "needs" (basic requirements) with "wants" (how we satisfy needs). Marketing creates wants, but it does not create needs.',
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <TrendingUp size={14} className="inline mr-1" /> MARKETING STRATEGY & PLANS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Marketing, Target Selection & Plan Formulation
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master the core concepts of marketing: the 8Ps, the Product Life Cycle,
            needs/wants/demand, and how to build a comprehensive marketing plan
            that drives business growth.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ShoppingBag size={14} className="inline mr-1" /> 8Ps
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart size={14} className="inline mr-1" /> PLC
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, P, or term..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-blue-200" />
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
            {/* Introduction / Before We Start */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Before We Start – Read This First
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Here is the most important thing you need to know before you open this notebook:
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-semibold mt-2">
                    <span className="bg-yellow-200 dark:bg-yellow-900/50 px-2 py-0.5 rounded">You do not need to memorise this word for word.</span>{' '}
                    Your exam is not testing your memory. It is testing whether you <span className="italic underline">understood</span> what you studied. So when you get a question in an exam, the examiner does not expect you to write back exactly what the textbook said. They want to see that you get the concept — that you can explain it in your own words, even simple ones.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    Think of it this way: if your friend who has never studied Marketing asks you "hey, what is Marketing?" — can you explain it to them in a normal conversation? That ability to explain it simply is exactly what you need in an exam. A student who writes 3 clear sentences showing they understood the concept will often score better than someone who wrote a paragraph of copied words they do not actually understand.
                  </p>
                  <p className="text-sm md:text-base bg-white dark:bg-[#121212] p-3 rounded-lg mt-3">
                    So as you read this notebook, do not just read. Ask yourself: <span className="font-bold italic">"Can I explain this to someone else right now?"</span> If yes — you have learned it. If no — read it again.
                  </p>
</div>
            </div>

            {/* Section 1: What is Marketing */}
            <div
              ref={(el) => {
                sectionRefs.current['what-is-marketing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What is Marketing?
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                The Official Definition (and what it actually means)
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 italic">
                  "A management process that focuses on identifying, anticipating, and profitably satisfying customer requirements."
                </p>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">
                Now let us break that down into normal language, because that sentence sounds complicated but it is actually very simple.
              </p>

              <div className="space-y-3 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">"Identifying"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">finding out what people need or want. Before you can sell anything to anyone, you have to first understand what they are looking for. A phone company cannot just build any phone — they need to find out: do people want bigger screens? Longer battery life? Lower prices? That research is marketing.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">"Anticipating"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">predicting what people will want in the future, before they even know they want it. Think about how Apple released the iPhone before most people were asking for a touchscreen smartphone. Good marketing looks ahead — it does not just react to what customers want today, it tries to figure out what they will want tomorrow.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">"Profitably satisfying"</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">giving people what they want in a way that also makes money for the business. The word "profitably" is important here. A business is not a charity. You can give people free food every day and they will be very satisfied — but you will be bankrupt in a week. Marketing has to find the balance: make the customer happy AND keep the business financially healthy.</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 mt-4">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">🟢 Simple Explanation</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Marketing is basically the whole process of figuring out what people want, creating something that gives them that, telling them about it, making it easy for them to get it, and charging a fair price. It starts with the customer and ends with the customer. Everything in between is marketing.</p>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                Needs, Wants, and Demand – Three Very Different Things
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                These three words sound similar but they mean different things in Marketing, and examiners love to test whether you know the difference.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">NEEDS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">are the basic things human beings require to survive and function. Food. Water. Shelter. Clothing. Safety. These are not optional — if you do not have your basic needs met, you are in trouble. Everyone has the same fundamental needs, regardless of where they live or how much money they have.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">WANTS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">are the specific ways people choose to satisfy their needs. The <span className="italic">need</span> is food — but the <span className="italic">want</span> might be a Chicken Inn meal, or sadza ne nyama, or a pizza. The <span className="italic">need</span> is transport — but the <span className="italic">want</span> might be a Toyota Fortuner, or a Honda Fit, or a kombi. Wants are shaped by culture, personality, advertising, social media, and a person's individual preferences.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">DEMAND</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">is the most specific of the three. Demand means: a want that is backed by the ability to pay. You might <span className="italic">want</span> a brand new Mercedes Benz — but if you cannot afford it, that is just a wish, not demand. Demand is when someone has both the desire for something AND the money to actually buy it. Businesses care about demand because demand is what actually generates sales.</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">When a question asks you to distinguish between needs, wants, and demand — use examples. Examiners love examples because they prove you actually understand the concept rather than just copying a definition. One good example per concept is enough.</p>
              </div>
            </div>

            {/* Section 2: Marketing Mix – 8Ps */}
            <div
              ref={(el) => {
                sectionRefs.current['marketing-mix'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Marketing Mix – The 8Ps
              </h2>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mb-6">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">What Is the Marketing Mix?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">The marketing mix is the set of tools and decisions a business uses to sell its product successfully. Think of it as a recipe. A chef has different ingredients they can adjust — more salt, less sugar, longer cooking time — until the dish is perfect. A marketer has their "ingredients" too, and they adjust them until the right customers are buying the product at the right price in the right places.</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">The original marketing mix had <span className="font-bold">4Ps</span>: Product, Price, Place, and Promotion. Modern marketing added more Ps — People, Process, Physical Evidence, and Partnerships — because especially in service businesses, those extra elements matter a lot.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">P1: PRODUCT</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Product is what you are actually selling — the thing or service you are offering to the market to satisfy customer needs.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Includes quality, design, features, brand name, packaging, warranty, after-sales service. For services, includes compliance, expertise, and service experience.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Product is everything about what you are selling — not just the thing itself, but its quality, design, packaging, brand, and extras.</p>
                  </div>
                </div>

                {/* Price */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">P2: PRICE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The amount of money customers must pay to get your product or service. Must be set to attract customers AND make the business profitable.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Consider costs, competitors' prices, customer expectations, and business objectives. Also includes terms of sale (credit, discounts, payment plans).</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Price is what you charge, and it has to be right — not too high, not too low. Good pricing considers costs, competition, and customer value perception.</p>
                  </div>
                </div>

                {/* Place */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">P3: PLACE (Distribution)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Getting your product to the customer — making it available where and when they need it.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Includes distribution channels (direct, retail, online), logistics, storage, and supply chain. E-commerce has expanded distribution options enormously.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Place is about making sure your product is easy to find and buy — both physically and online. If customers have to struggle, they will buy from someone else.</p>
                  </div>
                </div>

                {/* Promotion */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">P4: PROMOTION</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">All communication activities used to tell people about your product, persuade them to buy it, and remind them it exists.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Includes advertising, public relations, sales promotions, direct marketing, social media. Must communicate the USP (Unique Selling Proposition) clearly.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Promotion is how you let people know your product exists and convince them to buy. Right message, right people, right channel.</p>
                  </div>
                </div>

                {/* People */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">P5: PEOPLE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Everyone in the business who interacts with customers, and how their behaviour, attitude, and skills directly affect customer satisfaction.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Especially important in service businesses. Employees represent the brand – their training, professionalism, and helpfulness shape customer experience.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> People are the human beings in the business who deal with customers. In many cases, the difference between businesses is the people — how helpful, friendly, and knowledgeable they are.</p>
                  </div>
                </div>

                {/* Process */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">P6: PROCESS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Systems and procedures used to deliver the product or service to customers consistently and efficiently.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Includes order taking, payment processing, complaint handling, feedback collection. Good processes ensure consistency across every customer interaction.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Process is the system behind the scenes that makes sure every customer gets the same good experience. It is the recipe and instructions that staff follow.</p>
                  </div>
                </div>

                {/* Physical Evidence */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">P7: PHYSICAL EVIDENCE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tangible, visible elements that customers can see and experience, helping them judge the quality of the service.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Includes cleanliness of premises, staff appearance, equipment quality, certificates on the wall, website design, packaging.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Physical evidence is what customers can actually see and touch that gives them confidence. Since you cannot try a service before you buy, you judge it by what you can observe.</p>
                  </div>
                </div>

                {/* Partnerships */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">P8: PARTNERSHIPS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Strategic agreements with other organisations to work together for mutual benefit, achieving things they could not achieve alone.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Can be with suppliers, distributors, technology providers, other brands, or even competitors. Creates synergy – 1+1=3.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Partnerships are when businesses team up to help each other. You might have product quality, they have distribution – together you are stronger.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Product Life Cycle */}
            <div
              ref={(el) => {
                sectionRefs.current['product-lifecycle'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Product Life Cycle (PLC)
              </h2>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 mb-6">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">What Is the Product Life Cycle?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">The PLC is a model that describes the stages every product goes through — from idea to decline. Just like living things are born, grow, get old, and eventually die, products follow a similar journey.</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">The five stages: <span className="font-bold">Development, Introduction, Growth, Maturity, Decline.</span></p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Stage 1: DEVELOPMENT</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Product is being researched, designed, and tested – not yet on the market. High costs, zero sales revenue. Many products never make it past this stage.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Development is when the product is still just an idea or prototype. No money coming in – only going out.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Stage 2: INTRODUCTION</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Product launches. Sales are slow, awareness is low, promotion costs are high. Profits are low or negative. Often uses skimming pricing (high initial price to capture early adopters).</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Introduction is the product's first week at school — nobody knows it yet, it is trying to make friends, and spending a lot just to get noticed.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Stage 3: GROWTH</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sales rise rapidly, profits increase, competitors enter the market. Focus shifts to building brand loyalty and defending market position against new competitors.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Growth is when the product is taking off. Sales rising fast, money coming in, but competitors are arriving. Brand loyalty is your best weapon.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Stage 4: MATURITY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sales growth slows and flatlines. Market is saturated, competition is fierce. Companies fight for market share through branding, promotions, differentiation. Price wars common.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Maturity is when the product is established but growth has stopped. It is like a crowded taxi rank – drivers compete aggressively for passengers. The goal is defence.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Stage 5: DECLINE</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sales and profits fall as the product becomes outdated or replaced. Companies reduce investment and eventually discontinue the product. Smart companies start developing the next product before decline.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Decline is when the product is getting old and irrelevant. Smart companies already have the next product in development.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">✏️ Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The Product Life Cycle is one of the most commonly examined topics. If you draw a simple diagram (an S-shaped curve showing sales over time, with each stage labelled), you immediately show the examiner you understand the model.</p>
              </div>
            </div>

            {/* Section 4: Marketing Plan */}
            <div
              ref={(el) => {
                sectionRefs.current['marketing-plan'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Marketing Plan
              </h2>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mb-6">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">What Is a Marketing Plan and Why Does It Matter?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">A marketing plan is a written document that outlines exactly what a business plans to do with its marketing over a specific period — what they will sell, to whom, how they will promote it, how much they will charge, how they will distribute it, and how they will know whether they succeeded.</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">Think of a marketing plan as the GPS for your marketing journey. Without it, you are just driving randomly. With it, you know your route, your estimated time of arrival, and get warned when something goes wrong so you can recalculate.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-4">
                The Four Main Components
              </h3>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">SITUATION ANALYSIS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assess where the business currently stands — analysing external environment and internal capabilities. Uses tools like PESTEL (Political, Economic, Social, Technological, Ecological, Legal), SWOT (Strengths, Weaknesses, Opportunities, Threats), and market research data.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Situation Analysis is the business looking in the mirror honestly before making plans. Where are we now? What is happening around us? What are our strengths and weaknesses?</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">MARKETING STRATEGY</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Outlines what the business intends to do – objectives (SMART: Specific, Measurable, Achievable, Relevant, Time-bound), target market definition, product positioning, and the marketing mix to be used.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Marketing Strategy is where you decide: who are we selling to, what are we promising them, and how are we going to deliver on that promise.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">NUMERICAL FORECASTS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Translates strategy into numbers – sales forecasts, expense budgets, breakeven analysis, market share projections. Provides the financial case for the plan.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Numerical Forecasts is where plans become real by being put into money. How much will we sell? How much will the marketing cost? When will we start making profit?</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">CONTROLS</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mechanisms to monitor progress, measure effectiveness, and make adjustments. Includes performance measures, marketing organisation (who is responsible), implementation milestones, and contingency planning.</p>
                  <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs"><span className="font-bold text-green-600">🟢 Simple:</span> Controls are how you check if your plan is actually working and fix it if it is not. Think of them as quality control for your marketing effort.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">The Executive Summary</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">A short, punchy overview of the entire marketing plan written for senior management. Includes background, proposed actions, key objectives, wider implications, and investment required. Written <span className="font-bold">last</span> after the rest of the plan is complete.</p>
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
                Final Exam Tips for Marketing
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">1. Always use examples.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Real examples — even everyday Zimbabwean ones like Econet, Delta, OK Supermarkets, or Chicken Inn — show the examiner you understand how theory connects to the real world. An answer with one good example is always stronger than an answer without any.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">2. Structure your answers.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In a long-form question, cover the definition first, then the explanation, then the example. That structure shows organised thinking, which examiners reward.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">3. The 4Ps (or 8Ps) are connected.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In an exam, if you can show how the Ps relate to each other — for example, "the promotion strategy must align with the price position; a premium-priced product should have premium advertising rather than discount promotions" — you demonstrate deeper understanding that goes beyond just listing the Ps.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">4. Do not overcomplicate it.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Marketing is fundamentally about understanding customers and giving them what they want in a way that is profitable. Every concept, every tool, every model comes back to that basic idea. If you ever feel lost in an answer, ground yourself in that fundamental purpose and write from there.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">5. Use your own language.</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">If you cannot spell "differentiation" in an exam, write "making your product stand out from competitors." The examiner understands what you mean. Correct understanding expressed imperfectly beats perfect vocabulary with no understanding every time.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Good luck. You understand this. Now go show that examiner what you know. 🎓</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Marketing Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Marketing Ps</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>PLC Stages</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Marketing is not just advertising – it is the whole process of
                understanding customers, creating value, and delivering it
                profitably. The 8Ps and PLC are tools to help you do that
                effectively. Understand the why, and the what will follow.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Marketing</strong> is a management process that identifies, anticipates, and profitably satisfies customer requirements. It starts and ends with the customer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Needs, Wants, Demand</strong> – Needs are basic survival, wants are how we satisfy needs, demand is wants backed by buying power.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">8Ps Marketing Mix</strong> – Product, Price, Place, Promotion, People, Process, Physical Evidence, Partnerships. All must work together.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Product Life Cycle</strong> – Development → Introduction → Growth → Maturity → Decline. Marketing strategy changes at each stage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Marketing Plan</strong> – Situation Analysis, Strategy, Numerical Forecasts, Controls. It is the GPS for your marketing journey.
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
            Sidemann Academic Registry • Entrepreneurship Skills Development – Marketing Strategy & Plans 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
