import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, TrendingUp, AlertTriangle,
  
  BookOpen, 
  PiggyBank, 

  // Time Value of Money specific icons
  Calculator, 
 
  Zap
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'simple-interest',
    title: 'Simple Interest: The Foundation of Earning on Your Money',
    keywords: ['simple interest', 'principal', 'interest', 'rate', 'time', 'amount', 'formula', 'I=PRT'],
  },
  {
    id: 'compound-interest',
    title: 'Compound Interest: The Power of Growth on Growth',
    keywords: ['compound interest', 'future value', 'present value', 'compounding period', 'FV', 'PV', 'FV = PV(1+r)^n'],
  },
  {
    id: 'present-value-annuity',
    title: 'Present Value of Annuities: What Is a Stream of Future Payments Worth Today?',
    keywords: ['present value annuity', 'PVA', 'annuity', 'payment', 'PMT', 'lump sum', 'PVA = PMT[(1-(1+r)^-n)/r]'],
  },
  {
    id: 'future-value-annuity',
    title: 'Future Value of Annuities: Building Wealth Through Regular Savings',
    keywords: ['future value annuity', 'FVA', 'annuity', 'sinking fund', 'regular deposits', 'FVA = PMT[((1+r)^n-1)/r]'],
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
              placeholder="Search sections... (e.g., simple interest, compound interest, annuity, FV, PV)"
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
              Time Value of Money
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              The <span className="text-purple-300 font-bold italic">Time Value of Money</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Master simple interest, compound interest, present value of annuities, and future value of annuities for smart financial decisions.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">time_value_of_money.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Simple_Interest;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Compound;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Annuities;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Calculator className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><PiggyBank className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: SIMPLE INTEREST ========== */}
        <SectionWrapper id="simple-interest">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Simple Interest: The Foundation of Earning on Your Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine your Gogo gives you $100 USD. If you just hide that money, in one year, you'll still have just $100. But what if you could make that money grow? The extra money you earn is called <strong>interest</strong>. <strong>Simple Interest</strong> is the most straightforward way to calculate this earning. It means the interest is calculated only on the initial amount of money you started with.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Principal (P):</strong> The initial, original amount of money.</li>
                <li><strong>Interest (I):</strong> The extra money paid for borrowing or earned from investing.</li>
                <li><strong>Rate (R):</strong> The percentage at which interest is charged, usually per year.</li>
                <li><strong>Time (T):</strong> The duration for which the money is borrowed or invested.</li>
                <li><strong>Simple Interest:</strong> Interest that is calculated only on the original principal amount.</li>
                <li><strong>Amount (A):</strong> The total sum at the end, which is the principal plus the interest (A = P + I).</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calculator size={20} /> The Simple Interest Formula: I = P × R × T</h3>
              <p>To calculate simple interest, we use this formula. It is crucial to get the Rate and Time in the correct format.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Rate (R):</strong> You must convert the percentage to a decimal by dividing by 100 (e.g., 8% becomes 0.08).</li>
                <li><strong>Time (T):</strong> The time period must match the rate period. If the rate is per year, time must be in years. To convert months to years, divide by 12 (e.g., 6 months = 6/12 = 0.5 years).</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example: "Putting it to Work in Zimbabwe"</h3>
              <p><strong>Scenario:</strong> Tendai borrows $500 USD for his poultry business. The loan has a simple interest rate of 15% per annum, and he will repay it after 9 months.</p>
              <div className="space-y-2 mt-2">
                <p><strong>Step 1:</strong> Identify and convert values.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Principal (P) = $500</li>
                  <li>Rate (R) = 15% ÷ 100 = 0.15</li>
                  <li>Time (T) = 9 months / 12 = 0.75 years</li>
                </ul>
                <p><strong>Step 2:</strong> Calculate the Simple Interest (I).</p>
                <p>I = P × R × T</p>
                <p>I = 500 × 0.15 × 0.75 = <strong>$56.25</strong></p>
                <p><strong>Step 3:</strong> Calculate the Total Amount (A).</p>
                <p>A = P + I</p>
                <p>A = $500 + $56.25 = <strong>$556.25</strong></p>
              </div>
              <p className="mt-2"><strong>Answer:</strong> Tendai will pay $56.25 in interest, and the total amount he must repay is <strong>$556.25</strong>.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Common Mistakes to Avoid</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Forgetting to convert the Time to years.</strong></li>
                <li><strong>Forgetting to convert the Rate from a percentage to a decimal.</strong></li>
                <li><strong>Giving only the interest (I) as the answer when the question asks for the total amount (A).</strong></li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: COMPOUND INTEREST ========== */}
        <SectionWrapper id="compound-interest">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Compound Interest: The Power of Growth on Growth</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p><strong>Compound interest</strong> is the interest you earn not just on your original principal, but also on the accumulated interest from previous periods. In other words, your interest starts earning its own interest. This snowball effect can turn a small amount of savings into a very large amount over time. It is the single most important concept for long-term saving and investing.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Compound Interest:</strong> Interest calculated on the initial principal and also on the accumulated interest.</li>
                <li><strong>Future Value (FV):</strong> The value of a current asset at a specified date in the future.</li>
                <li><strong>Present Value (PV):</strong> The current value of a future sum of money.</li>
                <li><strong>Compounding Period:</strong> The frequency with which interest is calculated (e.g., annually, semi-annually).</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Future and Present Value of a Lump Sum</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Future Value Formula: FV = PV (1 + r)ⁿ</h4>
                  <p className="text-sm">Answers: "If I invest a lump sum today, what will it be worth in the future?"</p>
                  <ul className="list-disc pl-5 text-sm">
                    <li><strong>r</strong> is the interest rate per compounding period.</li>
                    <li><strong>n</strong> is the total number of compounding periods.</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">Present Value Formula: PV = FV / (1 + r)ⁿ</h4>
                  <p className="text-sm">Answers: "To have a certain amount in the future, how much do I need to invest today?"</p>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example</h3>
              <p><strong>Scenario:</strong> Rumbidzai invests a lump sum of $2,000 in an account earning 8% per annum, compounded annually, for 3 years.</p>
              <div className="space-y-2 mt-2">
                <p><strong>Future Value Calculation:</strong></p>
                <p>FV = 2000 (1 + 0.08)³</p>
                <p>FV = 2000 (1.259712) = <strong>$2,519.42</strong></p>
                <p><strong>Present Value Calculation (to have $2,000 in 3 years):</strong></p>
                <p>PV = 2000 / (1 + 0.08)³</p>
                <p>PV = 2000 / 1.259712 = <strong>$1,587.66</strong></p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: PRESENT VALUE OF ANNUITIES ========== */}
        <SectionWrapper id="present-value-annuity">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Present Value of Annuities: What Is a Stream of Future Payments Worth Today?</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>An <strong>annuity</strong> is a series of equal, regular payments. The <strong>Present Value of an Annuity (PVA)</strong> calculates the single lump-sum value, right now, of all those future payments combined. It's essential for comparing a lump-sum offer (like a pension payout) with a stream of payments, allowing you to make a fair financial decision.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Annuity:</strong> A series of equal payments made at fixed, regular intervals.</li>
                <li><strong>Payment (PMT):</strong> The amount of the regular, fixed payment in an annuity.</li>
                <li><strong>Present Value of an Annuity (PVA):</strong> The total value today of a series of future payments.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calculator size={20} /> The Present Value of an Annuity Formula</h3>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded text-center">PVA = PMT [ (1 - (1 + r)⁻ⁿ) / r ]</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>PMT</strong> is the amount of each regular payment.</li>
                <li><strong>r</strong> is the interest rate per period.</li>
                <li><strong>n</strong> is the total number of payment periods.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: FUTURE VALUE OF ANNUITIES ========== */}
        <SectionWrapper id="future-value-annuity">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Future Value of Annuities: Building Wealth Through Regular Savings</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>The <strong>Future Value of an Annuity (FVA)</strong> calculates the final total amount you will have if you make a series of regular deposits into an interest-earning account. It shows the power of disciplined saving and how small, consistent contributions can grow into a substantial sum over time.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Future Value of an Annuity (FVA):</strong> The total value of a series of regular payments at a future date, including all payments plus all accumulated interest.</li>
                <li><strong>Sinking Fund:</strong> A savings fund built by making regular annuity payments to meet a specific future financial goal.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> The Future Value of an Annuity Formula</h3>
              <p className="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded text-center">FVA = PMT [ ((1 + r)ⁿ - 1) / r ]</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>PMT</strong> is the amount of your regular payment.</li>
                <li><strong>r</strong> is the interest rate per period.</li>
                <li><strong>n</strong> is the total number of payment periods.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example</h3>
              <p><strong>Scenario:</strong> Tariro wants to save for her business. She deposits $70 every month for 4 years into an account that earns 12% per year, compounded monthly.</p>
              <div className="space-y-2 mt-2">
                <p><strong>Convert r and n:</strong></p>
                <p>r = 12% / 12 = 1% per month (0.01)</p>
                <p>n = 4 years × 12 = 48 months</p>
                <p><strong>Apply FVA Formula:</strong></p>
                <p>FVA = 70 [ ((1 + 0.01)⁴⁸ - 1) / 0.01 ]</p>
                <p>FVA = 70 [ (1.612226 - 1) / 0.01 ]</p>
                <p>FVA = 70 [ 61.2226 ] = <strong>$4,285.58</strong></p>
              </div>
              <p className="mt-2"><strong>Answer:</strong> After 4 years, Tariro will have <strong>$4,285.58</strong>. Her total contribution was $70 x 48 = $3,360, so she earned <strong>$925.58</strong> in interest.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of The Time Value of Money</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Simple Interest</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compound Interest</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Future Value</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Present Value</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Annuities</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">PVA</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">FVA</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compounding</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Time Value of Money. 💰⏰</p>
        </footer>

      </div>
    </div>
  );
};