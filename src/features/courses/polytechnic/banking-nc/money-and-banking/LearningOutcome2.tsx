import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, TrendingUp, AlertTriangle, 
  Database, Activity, Clock, Droplet, Zap, Layers, Users, 
  BookOpen, Briefcase, BarChart, Link, Scale, 
  ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  CornerUpRight, CornerUpLeft, Play, Eye, Lightbulb, RefreshCw,
  Crown, User, Swords, Calendar, Anchor, 
  Wheat, Fish, Gem, Coins, Landmark, CreditCard, Cpu, Wifi
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'barter',
    title: 'Barter Trade and Its Limitations',
    keywords: ['barter', 'limitations', 'double coincidence', 'measure of value', 'indivisibility', 'store of value', 'deferred payment', 'transportation'],
  },
  {
    id: 'historical',
    title: 'Historical Development of Money',
    keywords: ['historical', 'development', 'commodity money', 'metallic money', 'paper money', 'representative money', 'fiat money', 'electronic money', 'evolution'],
  },
  {
    id: 'types',
    title: 'Different Types of Money',
    keywords: ['types', 'commodity', 'representative', 'fiat', 'fiduciary', 'electronic', 'commercial bank', 'credit money', 'bank money'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s => 
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome2: React.FC = () => {
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
    // Find matching keywords
    const matches = searchIndex.filter(item => item.keyword.includes(query));
    // Deduplicate by section id
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
              placeholder="Search sections... (e.g., barter, fiat, commodity, evolution)"
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
              NC BANKING AND FINANCE: MODULE LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Development of <span className="text-sky-300 font-bold italic">Money</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Trace the fascinating evolution of money from barter systems to sophisticated digital currencies, exploring each stage's innovations and limitations.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">development_of_money.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Barter;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Evolution;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Types;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Coins className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Landmark className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: BARTER TRADE AND ITS LIMITATIONS ========== */}
        <SectionWrapper id="barter">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Barter Trade and Its Limitations</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>Long before the invention and widespread adoption of any form of money, early human societies relied on barter trade.</strong> Barter is the direct exchange of goods or services for other goods or services without the use of any intermediary medium like money. For instance, a farmer with a surplus of maize might attempt to exchange it directly with a shoemaker for a pair of shoes, or a fisher might trade a catch of fish for pottery made by an artisan. While conceptually simple, and still used in limited situations today (e.g., informal exchanges between neighbors, some international counter-trade deals), the barter system suffers from several significant limitations that render it highly inefficient and impractical for any economy beyond the most basic, small-scale, and undeveloped. As societies grew and desired more complex trade, these limitations became increasingly burdensome.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> a) Problem of Double Coincidence of Wants</h3>
              <p><strong>This is universally cited as the most significant and crippling drawback of a pure barter system.</strong> For a trade to successfully occur under barter, each party involved must simultaneously have what the other party wants, and want what the other party has, at the same time, in the desired quantities, and often at the same location. For example, the maize farmer who desires shoes must not only find a shoemaker but specifically a shoemaker who has shoes to spare and who also specifically wants maize at that particular time and in an amount that the shoemaker considers equivalent in value to the shoes. If the shoemaker desires pottery instead of maize, or needs maize but not at that moment, or has shoes but not in the farmer's size, the farmer cannot make a direct exchange. The farmer would then have to embark on a potentially lengthy, uncertain, and complex series of intermediate trades (e.g., try to trade maize for pottery with someone else, and then trade that pottery for shoes with the shoemaker), assuming such intermediate trades are even possible and do not incur further transaction costs. This arduous search for a trading partner with precisely reciprocal needs greatly restricts the scope, volume, and efficiency of trade. It consumes considerable time and effort, which economists refer to as high "search costs." This effectively limits specialization because individuals cannot be sure they can trade their specialized output for all the other goods and services they need.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> b) Lack of a Common Measure of Value (Unit of Account)</h3>
              <p><strong>In a pure barter system, there is no standard, universally accepted unit to express and compare the value of different goods and services.</strong> The value of each good or service must be expressed in terms of every other good or service it could potentially be exchanged for. For example, one cow might be worth ten bags of maize, or twenty chickens, or two spears, or fifty clay pots. This makes it extremely difficult to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Compare the values of different items objectively.</li>
                <li>Maintain any form of systematic accounts or records.</li>
                <li>Engage in rational economic calculation (e.g., determining profit or loss from a series of transactions).</li>
              </ul>
              <p>Calculating relative prices becomes exceedingly complex as the number of goods in the economy increases. If there are 'n' distinct goods and services, the number of unique exchange ratios (prices) to remember and negotiate would be n(n-1)/2. For instance, with just 10 different goods, there would be 10*(9)/2 = 45 different exchange rates. With 100 goods, this number explodes to 4,950. This lack of a common denominator for value severely hinders efficient decision-making, the development of complex markets, and long-term economic planning.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Droplet size={20} /> c) Indivisibility of Certain Goods</h3>
              <p><strong>Many goods, particularly larger or more valuable ones, are not easily or practically divisible into smaller units without a significant loss of their value, utility, or physical integrity.</strong> For instance, if a farmer possesses a live cow (a valuable but largely indivisible asset for small transactions) and wishes to exchange it for smaller items like a bag of salt, a few tools, or some clothing, it is impractical to divide the cow into appropriately valued live parts without destroying its primary value as a live animal. Even if a good is physically divisible (like a large roll of cloth), the other party might not need the whole unit, or might not have enough of their own goods to offer for the entire item. This indivisibility restricts the range of possible transactions, makes it difficult to match values precisely (e.g., how many loaves of bread is half a cow worth, and how do you get half a live cow?), and can prevent many potentially beneficial trades from occurring, especially for items of low value.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> d) Difficulty in Storing Wealth (Store of Value)</h3>
              <p><strong>In a barter economy, wealth (accumulated surplus) must be stored in the form of physical goods</strong> – for example, livestock (cattle, goats), agricultural produce (grains, fruits), tools, ornaments, or other tangible items. Many of these goods suffer from significant drawbacks as stores of wealth:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Perishability:</strong> Many agricultural products are perishable (grains can spoil due to pests or moisture, fruits and vegetables rot quickly). Livestock can die from disease, accidents, or old age.</li>
                <li><strong>Cost of Storage and Maintenance:</strong> Storing goods can be costly and cumbersome, requiring shelter, protection from theft or pests, and in the case of livestock, ongoing provision of food, water, and care.</li>
                <li><strong>Value Fluctuation:</strong> The value of these stored commodity-assets can fluctuate unpredictably due to changes in their own supply (e.g., a good harvest depressing grain prices), demand, or deterioration in condition.</li>
              </ul>
              <p>These factors make it very difficult to accumulate, preserve, and transfer wealth effectively and securely over extended periods, which in turn discourages saving and long-term investment.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> e) Problems with Deferred Payments (Standard of Deferred Payment)</h3>
              <p><strong>Barter systems make it exceedingly difficult, if not impossible, to engage in transactions that involve future payments or obligations</strong>, i.e., credit transactions like borrowing and lending. If a loan is made in terms of a specific good (e.g., "I will lend you 10 bags of high-quality maize today, and you will repay me 12 bags of similar quality maize in one year"), numerous uncertainties and complexities arise:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Quality Specification:</strong> Defining and ensuring the "similar quality" of the repaid good can be contentious. The quality of the maize repaid might be different from that which was lent.</li>
                <li><strong>Value Fluctuation:</strong> The value of maize relative to other goods might change significantly over the year due to variations in harvests, weather conditions, or shifting demands. This makes the real burden of the debt uncertain for both the lender and the borrower.</li>
                <li><strong>Availability:</strong> The specific good required for repayment might not be available when the debt is due.</li>
              </ul>
              <p>Specifying repayment in terms of a complex basket of diverse goods to mitigate these risks would be even more cumbersome and impractical. The high risk and complexity associated with future obligations in a barter system severely hinder the development of credit markets, which are crucial for financing investment, smoothing consumption, and fostering economic growth.</p>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={20} /> f) Transportation Difficulties</h3>
              <p><strong>Exchanging bulky, heavy, perishable, or delicate goods under a barter system can involve significant transportation costs, logistical challenges, and risks of damage or spoilage</strong>, especially if trades are to occur over substantial distances. This tends to limit the geographical scope of markets, reduces the potential for regional specialization based on comparative advantage (where different regions focus on producing what they are best at), and confines most trade largely to local communities or to high-value, low-bulk items for long-distance trade.</p>
              <p>These inherent and severe limitations made barter increasingly cumbersome and inefficient as societies grew, populations increased, the division of labor deepened, and the potential for more extensive and complex trade expanded. This naturally led to a gradual, evolutionary process of identifying and adopting specific, more convenient items to serve as a common medium of exchange – the crucial first step towards the development of what we now recognize as money.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: HISTORICAL DEVELOPMENT OF MONEY ========== */}
        <SectionWrapper id="historical">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Historical Development of Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The evolution of money is a compelling narrative of humanity's continuous search for ever more efficient, convenient, reliable, and sophisticated means to conduct transactions, measure value, store wealth, and settle debts. This development was not a planned invention by a single entity but rather a spontaneous, emergent process driven by the practical need to overcome the inadequacies of earlier systems, moving from simple barter to today's complex digital and globalized financial landscape.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wheat size={20} /> a) Commodity Money</h3>
              <p><strong>The first significant step away from pure barter was the emergence of commodity money.</strong> This involved societies identifying and agreeing to use certain widely desired and commonly available (but not too common) goods that possessed some (though rarely all) of the useful characteristics of good money – such as relative durability, some degree of divisibility, portability, uniformity, and inherent utility – to serve as an accepted medium of exchange. The specific commodity chosen varied greatly depending on the culture, geography, climate, primary economic activities, and values of the society.</p>
              <p><strong>Examples of Commodity Money:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Cattle and other livestock</strong> (goats, sheep, camels): Used extensively in many pastoral and agricultural societies.</li>
                <li><strong>Salt:</strong> Highly valued in many ancient cultures.</li>
                <li><strong>Shells:</strong> Various types of shells, notably cowrie shells, were used as money in extensive regions.</li>
                <li><strong>Grains</strong> (e.g., barley, wheat, rice, maize): In agricultural societies, staple grains often served as money.</li>
                <li><strong>Other Commodities:</strong> Tobacco leaves, beads, furs, tools, tea bricks, etc.</li>
              </ul>
              <p><strong>Limitations of Commodity Money:</strong> While a significant improvement over barter, commodity money still suffered from issues related to perishability, lack of uniformity, difficulty in transport, inconsistent value, and imperfect divisibility.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gem size={20} /> b) Metallic Money (Precious and Base Metals)</h3>
              <p><strong>Gradually, metals – particularly precious metals like gold and silver, and base metals like copper for smaller denominations – gained prominence</strong> due to their superior combination of desirable characteristics: durability, portability (high value-to-weight ratio), divisibility, uniformity, limited supply, and recognisability.</p>
              <p><strong>Evolution of Metallic Money:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Uncoined Metal:</strong> Initially exchanged by weight, requiring scales and assaying.</li>
                <li><strong>Coinage:</strong> The crucial innovation where metals were minted into coins of standardized weight, purity, and design, often stamped by an issuing authority. This eliminated the need for constant weighing and assaying. The Lydians are credited with producing the first standardized coins around the 7th century BCE.</li>
              </ul>
              <p>Problems included "clipping," "sweating," and debasement by rulers.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Coins size={20} /> c) Paper Money (Initially Representative Money)</h3>
              <p><strong>The inconvenience of carrying large quantities of metallic money led to the emergence of paper money, initially as representative money.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Origins:</strong> Roots in China (Tang and Song Dynasties).</li>
                <li><strong>European Development (Goldsmiths' Receipts):</strong> Goldsmiths issued receipts for stored gold/silver, which began circulating as a medium of exchange.</li>
                <li><strong>Nature of Representative Money:</strong> Paper certificates fully backed by, and convertible into, a fixed quantity of a commodity (usually gold or silver) held in reserve.</li>
                <li><strong>Fractional Reserve System:</strong> Goldsmiths/banks issued more notes than metal held in reserve, leading to credit expansion but also risk of bank runs.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> d) Fiat Money</h3>
              <p><strong>Fiat money is not backed by or convertible into any physical commodity.</strong> Its value derives from government "fiat" (decree) and collective trust and acceptance.</p>
              <p><strong>Key Characteristics of Fiat Money:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>No intrinsic value (or very low relative to face value).</li>
                <li>Central bank control over supply through monetary policy.</li>
                <li>Dominant modern form (e.g., US Dollar, Euro, Zimbabwean Dollar).</li>
              </ul>
              <p><strong>Risks of Fiat Money:</strong> The primary risk is mismanagement leading to high inflation or hyperinflation if excessive amounts are issued.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> e) Electronic Money (Digital Money)</h3>
              <p><strong>The most recent evolution, where money is stored and exchanged in electronic form.</strong></p>
              <p><strong>Forms of Electronic Money:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Bank Deposits (Digitized Fiat Money):</strong> Digital entries in bank accounts.</li>
                <li><strong>Mobile Money:</strong> Services like M-Pesa, EcoCash.</li>
                <li><strong>Stored Value Cards / E-wallets:</strong> Prepaid cards, PayPal, Apple Pay.</li>
                <li><strong>Cryptocurrencies:</strong> (e.g., Bitcoin, Ethereum). Typically decentralized, secured by cryptography. Their status as general-purpose money is still debated.</li>
                <li><strong>Central Bank Digital Currencies (CBDCs):</strong> Digital form of fiat currency issued by the central bank (currently being researched/piloted).</li>
              </ul>
              <p>Electronic money offers benefits like convenience and speed but also presents challenges related to cybersecurity, privacy, and regulation.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: DIFFERENT TYPES OF MONEY ========== */}
        <SectionWrapper id="types">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Different Types of Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Understanding the historical development of money also helps us to categorize the different types of money that have existed or currently exist in economies. Each type has distinct characteristics, sources of value, methods of creation, and implications for the financial system and its users.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wheat size={20} /> a) Commodity Money</h3>
              <p><strong>Money whose value comes directly from the inherent value of the commodity of which it is made.</strong> It possesses intrinsic value.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Examples:</strong> Gold coins (valued by gold content), salt, cattle, tobacco.</li>
                <li><strong>Characteristics:</strong> Value tied to commodity market value, often satisfies some criteria of good money but may be deficient in others, supply limited by natural availability.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Coins size={20} /> b) Representative Money (or Commodity-Backed Money)</h3>
              <p><strong>Money with little intrinsic value that represents a claim on a valuable commodity (e.g., gold or silver) held in reserve.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Examples:</strong> Gold certificates, silver certificates, early banknotes convertible into metal.</li>
                <li><strong>Characteristics:</strong> More portable than actual commodity, value tied to commodity and issuer's credibility, bridges commodity and fiat money.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> c) Fiat Money</h3>
              <p><strong>Money declared legal tender by a government, not backed by or convertible into a commodity.</strong> Value based on government decree and public trust.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Examples:</strong> Most modern national paper currencies and coins (where metal value is less than face value).</li>
                <li><strong>Characteristics:</strong> No intrinsic value, supply managed by central banks, dominant modern form, risk of inflation if mismanaged.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> d) Fiduciary Money (or Credit Money)</h3>
              <p><strong>Money whose value is based on confidence or trust ("fiducia") that it will be accepted.</strong> Often represents a promise to pay fiat money on demand.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Examples:</strong> Bank deposits (demand deposits), cheques (as instructions to transfer bank deposits).</li>
                <li><strong>Characteristics:</strong> Relies on trust in financial institutions, largest component of modern money supply, created via bank credit.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> e) Electronic Money (E-money)</h3>
              <p><strong>Monetary value stored and transferred electronically.</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Examples:</strong> Mobile money accounts, prepaid card balances, online payment platform balances, CBDCs (if issued).</li>
                <li><strong>Characteristics:</strong> Offers speed and convenience, can be digital fiat money or claims on fiat money, security and regulation are key concerns.</li>
              </ul>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> f) Commercial Bank Money (or Bank Money / Credit Money)</h3>
              <p><strong>Debt generated by commercial banks that circulates as money, predominantly demand deposits created through bank lending (credit creation).</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Characteristics:</strong> Forms the largest part of money supply (M1/M2), a form of fiduciary money, creation influenced by bank lending decisions and central bank policy.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Development of Money</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Barter Trade</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commodity Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metallic Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Representative Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fiat Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Electronic Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fiduciary Money</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commercial Bank Money</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Development of Money. 🪙📈</p>
        </footer>

      </div>
    </div>
  );
};
