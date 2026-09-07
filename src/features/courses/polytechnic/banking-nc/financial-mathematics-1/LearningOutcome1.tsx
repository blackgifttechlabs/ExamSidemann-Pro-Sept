import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, AlertTriangle,
  Users,
  BookOpen, Link, Scale,
  Globe,
  Target, 
  // Business math specific icons
  Calculator, 
  
  ShoppingBag,
  Zap
  
  
  
  
  
  
  } from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'linear-equations',
    title: 'Solving Business Problems with Linear Equations',
    keywords: ['linear equations', 'break-even', 'variables', 'constants', 'equation', 'profit', 'loss'],
  },
  {
    id: 'ratios',
    title: 'Using Ratios, Rates, and Proportions for Business Comparison',
    keywords: ['ratios', 'rates', 'proportions', 'comparison', 'percentage', 'direct proportion', 'inverse proportion'],
  },
  {
    id: 'discounts',
    title: 'Discounts and Commissions: The Language of Sales',
    keywords: ['discounts', 'commissions', 'sales', 'marked price', 'sale price', 'basic salary'],
  },
  {
    id: 'hire-purchase',
    title: 'Hire Purchase and Currency Conversion',
    keywords: ['hire purchase', 'deposit', 'instalment', 'currency conversion', 'exchange rate', 'HP price'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcomeBusinessMath: React.FC = () => {
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
              placeholder="Search sections... (e.g., linear equations, ratios, discounts, hire purchase)"
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
              Business Mathematics
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Solving Business Problems with <span className="text-emerald-300 font-bold italic">Linear Equations</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Master linear equations, ratios, proportions, discounts, commissions, hire purchase, and currency conversion for everyday business decisions.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">business_math.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Equations;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Ratios;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Sales;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Calculator className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><DollarSign className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: LINEAR EQUATIONS ========== */}
        <SectionWrapper id="linear-equations">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Solving Business Problems with Linear Equations</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you decide to start a small business selling freezits in your neighbourhood. You have to buy the plastic sleeves, the ingredients for the juice, and you need to pay for the electricity to run the freezer. You also need to decide on a selling price for each freezit. The big question is: how many freezits do you need to sell just to cover all your costs? If you sell fewer, you make a loss. If you sell more, you start making a profit.</p>
              <p>This is a classic business problem that can be solved easily with a simple but powerful mathematical tool: a <strong>linear equation</strong>. At its heart, a linear equation helps us find an unknown value when we know the relationship between other values. It's like a balanced scale, where both sides must always be equal. In business, we use it to find the "break-even point," calculate profit, predict costs, and make smart pricing decisions.</p>
              <p>This section is your first step into the world of business mathematics. We will learn how to read a business problem, translate it into the language of algebra, and solve it step-by-step. Mastering this skill will give you a clear and simple way to make confident financial decisions, whether you are running a tuckshop, a poultry project, or planning your own future business.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Variable:</strong> A symbol, usually a letter like x, that represents an unknown number we are trying to find.</li>
                <li><strong>Constant:</strong> A fixed number in an equation that does not change.</li>
                <li><strong>Equation:</strong> A mathematical statement showing that two expressions are equal, connected by an equals sign (=).</li>
                <li><strong>Linear Equation:</strong> An equation that describes a straight-line relationship between variables, where the variable is not raised to a power higher than one.</li>
                <li><strong>Break-even Point:</strong> The exact point where a business's total income equals its total costs, resulting in zero profit and zero loss.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> Simple Linear Equation</h3>
              <p>A linear equation is a straightforward way to express a relationship. The most basic form looks like this: <strong>ax + b = c</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>x</strong> is our variable – the unknown value we want to find.</li>
                <li><strong>a</strong> is the coefficient – the number multiplying our variable.</li>
                <li><strong>b</strong> and <strong>c</strong> are constants – the fixed numbers in the problem.</li>
              </ul>
              <p className="mt-2">Our goal is always to figure out the value of <strong>x</strong>.</p>
              <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-bold text-amber-600 dark:text-amber-400">The Golden Rule: Keep it Balanced!</h4>
                <p>Think of an equation as a perfectly balanced scale. If you add a weight to one side, you must add the exact same weight to the other side to keep it balanced. The same is true in algebra. Whatever you do to one side of the equals sign (=), you must do the exact same thing to the other side. This is the most important rule for solving equations.</p>
              </div>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Step-by-Step: How to Solve for the Unknown</h3>
              <p>Our mission is to get the variable (x) all by itself on one side of the equation. We do this in two simple steps:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li><strong>Isolate the Variable Term:</strong> Move any constants that are on the same side as the variable to the other side. You do this by performing the opposite operation.</li>
                <li><strong>Solve for the Variable:</strong> Once the variable term is alone, you can solve for the variable itself. If the variable is multiplied by a number (its coefficient), you divide both sides by that number.</li>
              </ol>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400">Let's see it in action: 2x + 4 = 10</h4>
                <p><strong>Step 1:</strong> Isolate the term '2x'. The constant on the same side is + 4. The opposite is - 4. So, we subtract 4 from both sides.</p>
                <p>2x + 4 - 4 = 10 - 4 → 2x = 6</p>
                <p><strong>Step 2:</strong> Solve for 'x'. x is being multiplied by 2. The opposite is to divide by 2. So, we divide both sides by 2.</p>
                <p>2x / 2 = 6 / 2 → <strong>x = 3</strong></p>
                <p className="mt-2 text-green-600 dark:text-green-400">✓ We have successfully found our unknown value!</p>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example: "Putting it to Work in Zimbabwe"</h3>
              <p><strong>Scenario:</strong> Rudo runs a small poultry business in Mutare, where she raises and sells broiler chickens. She wants to calculate her break-even point for the month.</p>
              <div className="space-y-2 mt-2">
                <p><strong>Fixed Costs:</strong> Rent and electricity = $60 USD per month (don't change).</p>
                <p><strong>Variable Costs:</strong> Chicks, feed, and vaccines = $2 USD per chicken.</p>
                <p><strong>Selling Price:</strong> $5 USD per chicken.</p>
              </div>
              <p className="mt-2"><strong>The Question:</strong> How many chickens (x) does Rudo need to sell in a month to cover all her costs?</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p><strong>Step 1:</strong> Set up the equation. Break-even is where Total Revenue = Total Costs.</p>
                <p>5x = 2x + 60</p>
                <p><strong>Step 2:</strong> Isolate the variable term. Subtract 2x from both sides.</p>
                <p>5x - 2x = 2x - 2x + 60 → 3x = 60</p>
                <p><strong>Step 3:</strong> Solve for x. Divide both sides by 3.</p>
                <p>3x / 3 = 60 / 3 → <strong>x = 20</strong></p>
              </div>
              <p className="mt-2"><strong>Answer:</strong> Rudo must raise and sell <strong>20 chickens</strong> in a month to break even. If she sells more than 20, she will make a profit. If she sells fewer than 20, she will make a loss.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Common Mistakes to Avoid</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Forgetting to balance:</strong> Only performing an operation on one side of the equation. This is the most common error.</li>
                <li><strong>Sign Errors:</strong> When you move a positive term across the equals sign, it becomes negative. Forgetting this can lead to the wrong answer.</li>
                <li><strong>Confusing Costs:</strong> Mixing up fixed and variable costs when setting up the equation from a word problem.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: RATIOS, RATES, AND PROPORTIONS ========== */}
        <SectionWrapper id="ratios">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Using Ratios, Rates, and Proportions for Business Comparison</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Have you ever heard a farmer in Mashonaland West proudly say they harvested 8 tonnes of maize per hectare? Or seen a sign at a bureau de change in Harare showing the exchange rate between the USD and the new ZiG? Maybe you've followed a recipe for maputi that says to use one cup of salt for every 20 cups of maize. These are all real-life examples of ratios, rates, and proportions. They are the mathematical tools we use to compare things.</p>
              <p>In business, comparison is everything. We need to know if we are doing well compared to last month, if our prices are fair, or if our resources are being used efficiently. Ratios and rates help us do just that. A ratio compares quantities of the same kind (e.g., profit to investment), while a rate compares different kinds of quantities (e.g., cost in dollars per kilogram).</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Ratio:</strong> A comparison of two or more quantities that are measured in the same unit.</li>
                <li><strong>Rate:</strong> A special ratio that compares two quantities with different units (e.g., kilometres per hour).</li>
                <li><strong>Percentage:</strong> A special kind of ratio where a quantity is compared to 100.</li>
                <li><strong>Proportion:</strong> A statement that two ratios or rates are equal to each other.</li>
                <li><strong>Direct Proportion:</strong> A relationship where two quantities increase or decrease together at the same rate.</li>
                <li><strong>Inverse Proportion:</strong> A relationship where one quantity increases while the other quantity decreases.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Ratios: The Art of Comparison</h3>
              <p>A ratio compares two quantities. If a bag of grain contains 10kg of maize and 5kg of sorghum, the ratio of maize to sorghum is 10 to 5. We can write this as 10:5 or 10/5. Just like fractions, we should always simplify ratios. The simplest form of the ratio is <strong>2:1</strong>.</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-bold text-green-600 dark:text-green-400">Fractions, Decimals, and Percentages</h4>
                <p>These are different ways to express parts of a whole.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Fraction to Percentage:</strong> (Numerator ÷ Denominator) × 100. So, (1 ÷ 2) × 100 = 50%.</li>
                  <li><strong>Percentage to Decimal:</strong> Divide by 100. So, 50% ÷ 100 = 0.5.</li>
                </ul>
              </div>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-bold text-purple-600 dark:text-purple-400">Direct vs. Inverse Proportion</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Direct Proportion:</strong> More of one means more of the other. (e.g., the more money you pay for fuel, the more litres you get).</li>
                  <li><strong>Inverse Proportion:</strong> More of one means less of the other. (e.g., the more builders working on a wall, the less time it will take).</li>
                </ul>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Worked Example: Profit Sharing</h3>
              <p><strong>Scenario:</strong> Two friends, Tatenda and Farai, start a car washing business. Tatenda invests 100 USD. Farai contributes 50 USD. They agree to share any profit according to the ratio of their investment. They make a profit of $90 USD.</p>
              <p className="mt-2"><strong>The Question:</strong> How should they divide the $90 profit fairly?</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p><strong>Step 1:</strong> Write down the investment ratio. 100 : 50</p>
                <p><strong>Step 2:</strong> Simplify the ratio. 100 ÷ 50 = 2; 50 ÷ 50 = 1. The simplified ratio is <strong>2:1</strong>.</p>
                <p><strong>Step 3:</strong> Find the total number of parts. Total Parts = 2 + 1 = 3 parts.</p>
                <p><strong>Step 4:</strong> Calculate the value of one part. Value of one part = $90 ÷ 3 = <strong>$30 USD</strong>.</p>
                <p><strong>Step 5:</strong> Distribute the profit.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Tatenda's Share:</strong> 2 parts × $30 = <strong>$60 USD</strong>.</li>
                  <li><strong>Farai's Share:</strong> 1 part × $30 = <strong>$30 USD</strong>.</li>
                </ul>
              </div>
              <p className="mt-2"><strong>Answer:</strong> Tatenda should receive $60 USD and Farai should receive $30 USD.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: DISCOUNTS AND COMMISSIONS ========== */}
        <SectionWrapper id="discounts">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Discounts and Commissions: The Language of Sales</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Have you ever walked into an Edgars store and seen a sign that says, "Massive Clearance! 30% OFF!"? That reduction in price is called a discount. Now, think about the person who sells you a data plan for Econet. They often earn a commission, which is a bonus they get based on the value of the sales they make. Discounts and commissions are two of the most common applications of percentages in the business world.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Discount:</strong> A reduction, usually a percentage, taken off the original price.</li>
                <li><strong>Commission:</strong> A payment given to a salesperson, calculated as a percentage of the sales they have generated.</li>
                <li><strong>Marked Price:</strong> The initial price before any discount.</li>
                <li><strong>Sale Price:</strong> The final price a customer pays after the discount.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calculator size={20} /> Calculating Discounts and Commissions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">To find the Discount Amount:</h4>
                  <p>Discount Amount = Marked Price × Discount Rate (%)</p>
                  <p>Sale Price = Marked Price - Discount Amount</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-green-600 dark:text-green-400">To find the Commission Amount:</h4>
                  <p>Commission Amount = Total Sales × Commission Rate (%)</p>
                  <p>Total Earnings = Basic Salary + Commission Amount</p>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example: "Putting it to Work in Zimbabwe"</h3>
              <p><strong>Scenario:</strong> Fungai works at a real estate agency. He earns a basic monthly salary of $300 USD. He also earns a 2% commission on the value of any properties he sells. This month, he sold a house for $45,000 USD.</p>
              <p className="mt-2"><strong>The Question:</strong> What were Fungai's total earnings for the month?</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p><strong>Step 1:</strong> Calculate the commission amount.</p>
                <p>Commission Amount = $45,000 × 2% = $45,000 × 0.02 = <strong>$900 USD</strong>.</p>
                <p><strong>Step 2:</strong> Calculate his total earnings.</p>
                <p>Total Earnings = Basic Salary + Commission Amount = $300 + $900 = <strong>$1,200 USD</strong>.</p>
              </div>
              <p className="mt-2"><strong>Answer:</strong> Fungai's total earnings for the month were <strong>$1,200 USD</strong>.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: HIRE PURCHASE AND CURRENCY CONVERSION ========== */}
        <SectionWrapper id="hire-purchase">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Hire Purchase and Currency Conversion</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you need a new generator for your home, but the cash price is $500 USD. The shop offers a deal: pay a small amount today, take the generator home, and pay the rest in monthly amounts. This is <strong>Hire Purchase</strong>. Now, what if your uncle from South Africa sends you R2,000? You can't use Rand, so you need to convert it to US Dollars. This is <strong>currency conversion</strong>.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Hire Purchase (HP):</strong> A method of buying goods through an initial deposit, followed by regular payments (instalments).</li>
                <li><strong>Deposit:</strong> The upfront payment made to begin a hire purchase agreement.</li>
                <li><strong>Instalment:</strong> One of a series of regular payments.</li>
                <li><strong>Exchange Rate:</strong> The value of one currency for the purpose of conversion to another.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShoppingBag size={20} /> Procedure of Solving Problems Involving Hire Purchase</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Calculate the Deposit. (Percentage of the cash price).</li>
                <li>Calculate the Total Amount Paid in Instalments. (Monthly instalment × number of payments).</li>
                <li>Calculate the Total Hire Purchase Price. (Deposit + Total of the instalments).</li>
                <li>Find the Extra Cost. (Total HP price - Cash price).</li>
              </ol>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe size={20} /> Currency Conversion Methods</h3>
              <p>There are only two operations to remember: <strong>multiply</strong> or <strong>divide</strong>.</p>
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Method 1: FOREIGN currency</h4>
                  <p>To find out how much <strong>FOREIGN</strong> currency you will get, you <strong>MULTIPLY</strong>.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Example:</strong> You have $100 USD and want ZAR (Rate: 1 USD = 18 ZAR). You get 100 × 18 = <strong>1,800 ZAR</strong>.</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-green-600 dark:text-green-400">Method 2: LOCAL currency (USD)</h4>
                  <p>To find out how much <strong>LOCAL</strong> currency (USD) you will get, you <strong>DIVIDE</strong>.</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Example:</strong> You have 1,800 ZAR and want USD. You get 1,800 ÷ 18 = <strong>100 USD</strong>.</p>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Connecting the Dots</h3>
              <p>You have now mastered the essential calculations for everyday commerce. We are now ready to move from the mathematics of buying and selling to the mathematics of borrowing and investing, which leads to the next topic: <strong>Simple Interest</strong>.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Solving Business Problems with Linear Equations</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Linear Equations</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Break-Even</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ratios</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Proportions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Discounts</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commissions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hire Purchase</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Currency Conversion</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Business Mathematics. 📊🔢</p>
        </footer>

      </div>
    </div>
  );
};

export const LearningOutcome1 = LearningOutcomeBusinessMath;
