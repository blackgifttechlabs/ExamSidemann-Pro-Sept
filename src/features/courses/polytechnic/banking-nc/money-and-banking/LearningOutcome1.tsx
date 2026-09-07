import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, TrendingUp, AlertTriangle, 
  Database, Activity, Clock, Droplet, Zap, Layers, Users, 
  BookOpen, Briefcase, BarChart, Link, 
  ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  CornerUpRight, CornerUpLeft, Play, Eye, Lightbulb, RefreshCw,
  Crown, User, Swords, Calendar, Anchor,
  GitBranch
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'definition',
    title: 'Definition of Money',
    keywords: ['definition', 'money', 'barter', 'acceptability', 'social convention'],
  },
  {
    id: 'characteristics',
    title: 'Characteristics of Good Money',
    keywords: ['characteristics', 'durability', 'portability', 'divisibility', 'uniformity', 'scarcity', 'acceptability', 'recognisability', 'stability'],
  },
  {
    id: 'functions',
    title: 'Functions of Money',
    keywords: ['functions', 'medium of exchange', 'unit of account', 'store of value', 'standard of deferred payment'],
  },
  {
    id: 'evaluation',
    title: 'Evaluation of the Characteristics of Good Money',
    keywords: ['evaluation', 'comparative', 'durability', 'portability', 'divisibility', 'uniformity', 'scarcity', 'acceptability', 'recognisability', 'stability'],
  },
  {
    id: 'relationship',
    title: 'Exploration of the Relationship Between Money and Prices',
    keywords: ['relationship', 'money supply', 'price level', 'inflation', 'deflation', 'quantity theory', 'mv=py', 'velocity', 'central bank'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s => 
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome1: React.FC = () => {
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
    // Deduplicate by section id to avoid multiple suggestions for same section
    const unique = matches.reduce((acc, current) => {
      if (!acc.some(item => item.sectionId === current.sectionId)) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof matches);
    // Limit to 6 suggestions
    setSuggestions(unique.slice(0, 6));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      // Navigate to first suggestion
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
      // Highlight the section
      setHighlightedSection(sectionId);
      // Remove highlight after 3 "blinks" (approx 3 seconds)
      setTimeout(() => {
        setHighlightedSection(null);
      }, 3000);
    }
  };

  // Clear search
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
                if (el) {
                sectionRefs.current[id] = el;
                } else {
                delete sectionRefs.current[id]; // Cleans up the ref when the component unmounts
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
              placeholder="Search sections... (e.g., inflation, functions, durability)"
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
          {/* Suggestions dropdown */}
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
              NC BANKING AND FINANCE: MODULE LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              The Nature of <span className="text-emerald-300 font-bold italic">Money</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to the definition, characteristics, functions, and the relationship between money and prices.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">nature_of_money.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Definition;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Characteristics;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Functions;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><DollarSign className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: DEFINITION ========== */}
        <SectionWrapper id="definition">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Definition of Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p><strong>In its most encompassing sense, money is any universally recognized item or verifiable record that is generally accepted as payment for goods and services and for the repayment of debts, including obligations such as taxes, within a specific country or socio-economic context.</strong> It is profoundly important to understand that money is not limited to the physical coins and banknotes (currency) we carry. Instead, the essence of money is defined by what it does (its functions) rather than what it is physically made of.</p>
              <p>The material form of money has evolved significantly over time, from shells, beads, and cattle in ancient times to sophisticated digital entries on computer servers today, but its core functions remain remarkably consistent. A "verifiable record" in modern economies increasingly refers to digital entries in bank accounts, balances in mobile money platforms, or records in electronic ledgers (like those used for cryptocurrencies, though their status as money is still debated).</p>
              <p>These records, despite lacking a tangible physical form, perfectly fulfill the role of money because they are trusted, verifiable, and widely accepted for transactions. The "socio-economic context" is also vital; what serves as money is ultimately a matter of social agreement, custom, and law, and can vary significantly across cultures and historical periods. This underscores the conventional and trust-based nature of money. For instance, the large, immobile Rai stones on the island of Yap in Micronesia historically served as money due to a shared social understanding and meticulous oral record-keeping of ownership, even when the stones themselves were not physically exchanged.</p>
            </div>
            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> General Acceptability is Key</h3>
              <p>The single most critical and indispensable characteristic that qualifies something as money is its widespread, almost universal, acceptance by people – individuals, businesses, and governmental entities – in exchange for all types of goods or services and for the settlement of all forms of debts. If the populace of an economy is unwilling to consistently accept an item as payment, then that item simply cannot function effectively as money, irrespective of any other desirable properties it might possess, such as durability, scarcity, intrinsic value, or government decree.</p>
              <p>This acceptability is not an inherent physical quality of an object but is a profound social phenomenon built on a foundation of trust, convention, and established practice. For instance, in various ancient societies, items like cowrie shells in parts of Africa and Asia, blocks of salt (from which the word 'salary' derives, as Roman soldiers were sometimes paid a 'salarium' or salt allowance), or even cattle, served effectively as money precisely because they were generally accepted by the members of those communities for all transaction purposes. Conversely, if confidence in a nation's currency collapses, as can happen during periods of hyperinflation (e.g., Zimbabwe in 2008, Germany in the 1920s) or severe political instability, even government-issued legal tender notes and coins can lose their general acceptability. In such situations, people may cease to use the official currency, forcing a reversion to inefficient barter systems or the spontaneous adoption of alternative, more stable currencies (often foreign currencies like the US dollar, a phenomenon known as "dollarization" or currency substitution) or other commodities.</p>
            </div>
            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Beyond Physical Form</h3>
              <p>In contemporary, sophisticated economies, money exists in a multitude of forms, extending far beyond the tangible currency we can physically touch. While currency (coins, typically made of metal alloys, and paper notes, often manufactured from special reinforced paper or polymer for durability) is the most visible and easily recognizable form of money, a significantly larger portion of a nation's money supply typically exists as bank deposits and other digital representations of value. These include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Funds held in current accounts (also known as chequeing accounts or demand deposits), which are designed for frequent transactions and offer easy access to funds.</li>
                <li>Funds in savings accounts, designed for accumulating savings, usually earning some interest, and still relatively liquid.</li>
                <li>Other types of deposit accounts, such as fixed-term deposits, which are less liquid but still represent monetary value.</li>
              </ul>
              <p>These digital or ledger-based representations of value are readily accessible and transferable through various instruments and mechanisms. These include cheques (though their use is declining in many economies due to the rise of electronic payments), debit cards (which directly access funds in bank accounts), credit cards (which provide short-term loans that are then settled with money), and a wide array of electronic fund transfers (EFTs). EFTs encompass online banking transfers, mobile money payments (such as EcoCash in Zimbabwe or M-Pesa in Kenya, which have revolutionized financial access in many developing countries), direct debits for recurring payments, and wire transfers for large-value transactions. All these forms are considered money because they are readily and widely accepted for concluding transactions and settling debts within the economy, effectively performing the functions of money.</p>
            </div>
            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> A Social Convention</h3>
              <p>Ultimately, money is a powerful social convention, deeply rooted in trust, collective belief, and established custom. We accept money in payment not necessarily because of its intrinsic value (especially in the case of modern fiat money, which has no commodity backing like gold and typically costs very little to produce compared to its face value), but because we trust and have a shared understanding and expectation that others will also accept it from us in subsequent transactions at a relatively stable value. This collective agreement, psychological buy-in, and shared confidence give money its power, utility, and value. If this foundational trust erodes – as can occur during periods of severe economic instability, hyperinflation (where prices rise astronomically and money rapidly loses its purchasing power), governmental collapse, widespread counterfeiting, or even a loss of faith in the institutions managing the currency – the existing form of money can rapidly lose its value. This can lead to its disuse, a potential reversion to inefficient barter systems, or the spontaneous adoption of alternative, more stable forms of money. The stability and reliability of a currency are thus heavily dependent on the credibility of the issuing authority (usually the central bank and the government) and the overall health of the economy.</p>
            </div>
            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowUpRight size={20} /> Distinction from Barter</h3>
              <p>The historical evolution of money was primarily driven by the pressing need to overcome the profound inefficiencies, complexities, and limitations inherent in a barter system. In a barter system, goods and services are exchanged directly for other goods and services without the use of any intermediary medium of exchange. This system critically requires what economists call a "double coincidence of wants". This means that for a trade to occur successfully, each party involved must possess precisely what the other party desires, and desire precisely what the other party possesses, all at the same time, in the agreed-upon quantities, of the agreed-upon quality, and often at the same location. Finding such a perfect match involves significant search costs (the time and effort spent looking for a suitable trading partner), transaction costs (the costs of negotiating the terms of exchange and finalizing the deal), and often, waiting costs (the delay in obtaining desired goods or services). These inherent difficulties severely limit the scope, volume, specialization, and complexity of trade possible under a barter system, thereby hindering economic development. Money elegantly eliminates the problem of the double coincidence of wants by acting as an intermediary – a universally desired and accepted item that everyone is willing to take in exchange for their goods or services, knowing they can use it later to acquire whatever they themselves need or desire from others. Money thus splits a single, complex barter transaction into two simpler, more manageable monetary transactions: selling one's goods/services for money, and then using that money to buy desired goods/services.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: CHARACTERISTICS ========== */}
        <SectionWrapper id="characteristics">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Evaluation of the Characteristics of Good Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>For any item to function effectively and efficiently as money within an economy, and to gain the widespread confidence of its users, it ideally needs to possess several key characteristics. While it's rare for any single form of money to perfectly embody all these traits to the maximum extent, the more of these characteristics an item possesses, and the better it embodies them, the more effectively it will serve its monetary purpose. The historical evolution of money can be seen as a continuous search for forms of money that better satisfy these characteristics.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> a) Durability</h3>
              <p><strong>Good money must be physically robust and resilient enough to withstand repeated use, handling, and circulation over extended periods without significant deterioration, decay, or loss of its physical integrity.</strong> If money easily wears out, breaks, crumbles, tears, or spoils, it would quickly lose its usefulness as a medium of exchange and, consequently, its value, necessitating frequent and costly replacement. For instance, using perishable items like fresh fruits, vegetables, or fish as money would be highly impractical for most transactions as they would rot quickly and become worthless. Historically, metals such as gold and silver were highly favored partly due to their exceptional durability; they do not rust, corrode, or decay easily over time. Modern banknotes are often manufactured from special, reinforced cotton-based paper or, increasingly, from polymer (plastic) to enhance their lifespan and resistance to tearing, moisture, and dirt. Coins are minted from durable metal alloys specifically chosen for their resistance to wear and tear. In the digital realm, electronic money (data on servers or chips) is inherently durable as long as the underlying technological systems supporting it are properly maintained, secured against data loss or corruption, and remain functional.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> b) Portability</h3>
              <p><strong>Money should be easy for individuals to carry and transport, allowing them to conduct transactions conveniently across different locations without undue effort or cost.</strong> If money were extremely heavy, bulky, or unwieldy relative to its value (for example, large stones like the Rai stones of Yap, which were used for significant transactions but were certainly not portable for everyday use, or commodities like iron bars in some ancient societies), it would be highly impractical for daily commerce and would limit the geographic scope of trade. Paper currency and coins are specifically designed to be lightweight and compact for ease of handling and carrying in wallets or purses. Digital money, accessed through slim plastic cards (debit/credit cards) or mobile devices like smartphones, represents an even higher degree of portability, enabling the transfer of substantial values with minimal physical effort or encumbrance, even across vast distances instantaneously. The higher the value-to-weight (or value-to-bulk) ratio, the more portable the money.</p>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Layers size={20} /> c) Divisibility</h3>
              <p><strong>Good money must be easily divisible into smaller units of value without losing its fundamental worth or properties, to facilitate transactions of varying sizes and values.</strong> This characteristic allows for precise pricing of goods and services and enables the purchase of low-value items, as well as making change. For example, if the smallest unit of money was a large gold bar worth thousands of dollars, it would be virtually impossible to use it to buy a loaf of bread or a single piece of fruit. Modern currency systems address this by having various denominations of notes and coins (e.g., cents and dollars; pennies and pounds; 1, 5, 10, 20, 50, 100 unit notes). The key is that when a unit of money is divided, the sum of the values of its parts should equal the original value; for instance, if you cut a valuable painting in half, each half is generally not worth half the original value, but if you divide a dollar, you can get two 50-cent coins which retain the original total value. Digital money is almost perfectly divisible, often down to very small fractions of its main unit, which is advantageous for micro-transactions.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GitBranch size={20} /> d) Uniformity (Homogeneity)</h3>
              <p><strong>All units of the same denomination of money must be essentially identical (or virtually indistinguishable) in terms of their physical characteristics, quality, and, most importantly, their value in exchange.</strong> This means that one one-dollar coin or note should be perfectly interchangeable with, and accepted as equal to, any other one-dollar coin or note of the same issue. If units of money of the same denomination varied in quality, metal content (for coins), or perceived value, it would create confusion, distrust, and inefficiency in transactions. People would naturally attempt to hoard the "better" or more valuable units and spend the "inferior" ones, a phenomenon described by Gresham's Law ("bad money drives out good" from circulation, as people will hold onto the more valuable units and use the less valuable ones for payments). Standardization of production, strict quality control by a central issuing authority (like a central bank or mint), and clear design specifications are crucial for ensuring this uniformity and maintaining public confidence in the currency.</p>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> e) Limited Supply (Scarcity)</h3>
              <p><strong>To retain its value and purchasing power, money must be relatively scarce in relation to the demand for it, and its overall supply should ideally be controllable by a recognized monetary authority.</strong> If money can be too easily obtained, found in abundance, or produced without limit by anyone (like picking up common leaves from the ground or pebbles from a beach), it will not be valued by society, and its purchasing power will diminish rapidly due to an oversupply, leading to severe inflation or even hyperinflation. The natural scarcity of precious metals like gold and silver (requiring significant effort to mine and refine) contributed significantly to their historical use and value as money. In modern economies, governments and central banks actively manage the supply of fiat currency and credit through monetary policy to maintain its value and prevent excessive inflation. The ability to effectively control the money supply is fundamental to the stability of any fiat money system.</p>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> f) Acceptability</h3>
              <p><strong>This is arguably the most crucial and indispensable characteristic, often considered the defining feature of money.</strong> Regardless of how well an item meets the other criteria (durability, portability, scarcity, etc.), if people within an economy are not willing to universally and consistently accept it in exchange for goods and services, and for the settlement of debts, it simply cannot function as money. Acceptability is often driven by a complex interplay of factors:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Trust in the issuer (e.g., the stability and credibility of the government or central bank).</li>
                <li>Legal Tender Laws, which are government declarations that a particular form of money is officially recognized for settling all debts, public and private, and that creditors are legally obliged to accept it as payment.</li>
                <li>Most importantly, widespread social and economic convention and habit. People accept money because they are confident that others will, in turn, accept it from them.</li>
              </ul>
              <p>Legal tender status alone isn't sufficient if public confidence is lost; widespread, voluntary acceptance is paramount for money to circulate effectively.</p>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> g) Recognisability</h3>
              <p><strong>Good money should be easily recognizable as genuine by the general public and, simultaneously, difficult and costly for unauthorized individuals or groups to counterfeit or fake.</strong> This allows people to quickly and confidently verify its authenticity during transactions, fostering trust and reducing the risk of fraud. If money is easily and widely faked, its value will be severely undermined as people become hesitant to accept it for fear of receiving worthless imitations, leading to a breakdown in its function as a medium of exchange. Modern currencies incorporate a variety of complex and sophisticated security features – such as intricate multi-colored designs, watermarks visible when held to light, embedded security threads, micro-printing (text too small to read without magnification), holograms or holographic strips, special optically variable inks (that change color when tilted), and unique serial numbers – to make counterfeiting extremely difficult and to aid in the quick identification of genuine notes and coins by both humans and machines.</p>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Anchor size={20} /> h) Stability of Value</h3>
              <p><strong>Ideally, money should maintain its purchasing power relatively consistently over time.</strong> This means that the amount of goods and services that a unit of money can buy should not change drastically or unpredictably over short or medium periods. If the value of money fluctuates wildly and erratically, it becomes unreliable as a store of value (people will not want to hold it if its value is rapidly eroding) and as a standard of deferred payment (it becomes difficult to make long-term contracts if the future value of money is highly uncertain). Significant and sustained inflation (a rapid decrease in the value of money, meaning prices rise quickly) or deflation (a rapid increase in the value of money, meaning prices fall broadly) can disrupt economic activity, discourage saving and investment, distort investment decisions, create social uncertainty, and lead to arbitrary redistributions of wealth. While perfect stability of value is practically unattainable in a dynamic economy with changing supply and demand conditions, relative stability is a highly desirable characteristic that encourages long-term planning, saving, investment, and confidence in the economic system. Central banks often target low and stable inflation to promote this stability of value.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: FUNCTIONS ========== */}
        <SectionWrapper id="functions">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Functions of Money</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Money performs several vital and interconnected functions within an economy. These functions collectively explain why money is indispensable for the smooth and efficient operation of modern economic systems, allowing economies to move far beyond the severe limitations of barter. These functions are not just abstract concepts; they are the practical roles money plays in our daily economic lives.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowUpRight size={20} /> a) Medium of Exchange</h3>
              <p><strong>This is often considered the primary and most fundamental function of money.</strong> Money acts as an intermediary in transactions, greatly facilitating the buying and selling of all types of goods and services. In an economy with money, individuals do not need to find someone who both has what they want and wants what they have (the "double coincidence of wants" required in barter). Instead, they can sell what they produce (goods or labor) for money, and then use that money to buy what they desire from others. Money, being universally accepted, effectively breaks down a single complex barter transaction into two simpler, independent monetary transactions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Selling a good or service for money.</li>
                <li>Using that money to buy another desired good or service.</li>
              </ul>
              <p>For example, a farmer can sell their maize crop to a miller for money. The farmer can then use that money to buy clothing from a tailor, tools from a hardware store, or pay for schooling for their children. The miller, tailor, hardware store owner, and school will, in turn, accept that money because they know they can use it to purchase their own needs and wants. This dramatically reduces transaction costs (time, effort, and resources spent on making exchanges) and promotes specialization and a wider division of labor, leading to greater overall economic efficiency and output. Without a medium of exchange, the scale and complexity of an economy would be severely constrained.</p>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Layers size={20} /> b) Unit of Account (or Measure of Value / Standard of Value)</h3>
              <p><strong>Money provides a common, standardized, and universally understood yardstick for measuring and comparing the economic value of a diverse array of goods, services, assets, and debts.</strong> Just as we use units like metres to measure length, kilograms to measure weight, or litres to measure volume, we use monetary units (such as dollars, pounds, euros, or rand) to express prices and record all sorts of economic values. This function greatly simplifies economic calculations and decision-making:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Comparison of Values:</strong> It allows for a straightforward comparison of the relative values of different items. For example, we can easily see if a new car is more valuable than a university education by comparing their prices in monetary units. We can compare the cost of different brands of the same product.</li>
                <li><strong>Economic Calculation:</strong> It facilitates essential economic activities such as budgeting (for households, businesses, and governments), accounting (for recording transactions, assets, liabilities, income, and expenses), financial reporting (for providing standardized information to stakeholders), and profit/loss calculation.</li>
                <li><strong>Simplification:</strong> Without a common unit of account, it would be exceedingly complex and confusing to determine the relative worth of different items. In a barter economy, the value of each good would have to be expressed in terms of every other good (e.g., how many chickens is one cow worth? How many loaves of bread for one chicken? How many consulting hours for a cow?). If an economy has 'n' goods, there would be n(n-1)/2 distinct exchange ratios. Money reduces this to just 'n-1' prices relative to the monetary unit, providing a single, universally understood scale of value and dramatically reducing information costs.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> c) Store of Value (or Store of Wealth / Store of Purchasing Power)</h3>
              <p><strong>Money serves as a means of holding wealth or retaining purchasing power over time.</strong> When individuals or businesses receive money, they do not necessarily have to spend it immediately. They can choose to save it (hold it) to make purchases, investments, or meet obligations in the future. For money to be an effective store of value, its own value (i.e., its purchasing power – what it can buy) must remain relatively stable over the period it is held. If prices rise rapidly due to high inflation, the purchasing power of stored money erodes quickly, meaning the same amount of money will buy fewer goods and services in the future. In such cases, money becomes a poor store of value.</p>
              <p>While other assets such as real estate, stocks, bonds, precious metals (like gold), or even art can also serve as stores of value (and may sometimes offer better protection against inflation or provide higher financial returns), money is generally the most liquid store of value. Liquidity refers to the ease, speed, and certainty with which an asset can be converted into a medium of exchange (i.e., spent to buy goods and services) with minimal loss of its nominal value. You can spend cash or funds in a current account immediately at their face value; selling a house, stocks, or gold to access their value takes time, incurs transaction costs (e.g., brokerage fees, legal fees), and their selling price may be uncertain. While holding money involves an opportunity cost (the potential return foregone by not investing it in interest-bearing or appreciating assets), its liquidity makes it a convenient asset for meeting unforeseen expenses or for bridging the gap between receiving income and making expenditures.</p>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> d) Standard of Deferred Payment (or Standard for Future Payments)</h3>
              <p><strong>Money facilitates borrowing, lending, and other transactions that involve obligations to make payments at a future date, by providing a standard unit in which these future payments (debts) can be denominated and ultimately settled.</strong> When a loan is made, the amount to be repaid at a future date, including any interest, is specified in monetary terms (e.g., "repay $110 in one year for a $100 loan today"). This function allows for the creation and enforcement of a vast array of contracts that span over time, such as:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Salaries and wages (paid for work done over a past period, or contracted for future work).</li>
                <li>Rents (paid for the future use of property).</li>
                <li>Mortgages and other loans (repaid in installments over many months or years).</li>
                <li>Bonds (loans to governments or corporations that promise future repayment of principal and interest).</li>
                <li>Installment purchase plans.</li>
              </ul>
              <p>The stability of money's value is also critically important for this function. If there is high and unpredictable inflation, lenders may become reluctant to lend because the real value (purchasing power) of the repayments they receive will be significantly lower than anticipated. This uncertainty can lead to higher interest rates (to compensate for expected inflation and risk) or a reluctance to engage in long-term contracts altogether. Conversely, unexpected deflation can make it very difficult for borrowers to repay their debts, as the real burden of the debt increases while their incomes might be falling. Thus, a relatively stable value of money is essential for a well-functioning credit market and for long-term economic planning.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: EVALUATION (Reiteration) ========== */}
        <SectionWrapper id="evaluation">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Evaluation of the Characteristics of Good Money (Reiteration and Deeper Evaluation)</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>(As this point is repeated in your learning outcome, this section offers a more evaluative perspective, underscoring their practical importance and how different forms of money, both historical and contemporary, measure up against these ideals. No form of money is perfect in all respects, and the "best" form of money can be context-dependent.)</p>
              <p>To be truly effective and gain the widespread trust and confidence of its users, an item intended to serve as money should ideally possess a suite of desirable qualities. Evaluating these characteristics helps us understand not only why certain items historically succeeded as money (e.g., gold and silver) and why others failed, but also how modern currencies are designed, the trade-offs involved in their management, and the challenges they face.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> Durability (Evaluated)</h3>
              <p>The physical robustness of money is essential for it to endure repeated handling and circulation.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Commodity monies varied greatly. Cattle were living assets and thus perishable if not cared for; grains spoiled. Metals like gold and silver excelled here, being highly resistant to decay.</li>
                <li><strong>Modern Perspective:</strong> Early paper money was often fragile. Modern polymer banknotes and specially treated paper notes, along with robust metal alloy coins, are engineered for significantly enhanced durability, reducing replacement costs. Digital money's durability depends on the resilience of the technological infrastructure (servers, networks, security protocols) against physical damage, cyber-attacks, or obsolescence.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Portability (Evaluated)</h3>
              <p>Money must be convenient to carry for transactions of various scales.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Bulky commodities (salt, iron bars) were impractical for large-value or long-distance trade. Precious metals offered a better value-to-weight ratio, but large sums of gold or silver could still be heavy and risky to transport.</li>
                <li><strong>Modern Perspective:</strong> Paper money was a major leap in portability over metallic money for large values. Digital money, accessible via lightweight cards or mobile devices, offers the ultimate in portability, allowing even vast sums to be transferred globally with ease, though access depends on technology and infrastructure.</li>
              </ul>
            </div>

            <div className={cardClasses('purple')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Layers size={20} /> Divisibility (Evaluated)</h3>
              <p>The capacity to be divided into smaller units without loss of fundamental worth is crucial.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Some commodities (like live animals) were inherently difficult to divide without destroying value. Metals could be divided by weight, and coinage standardized this.</li>
                <li><strong>Modern Perspective:</strong> Modern currencies achieve excellent divisibility through a system of various denominations of notes and coins. Digital money offers near-perfect divisibility, often to many decimal places, facilitating micro-payments and precise accounting.</li>
              </ul>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GitBranch size={20} /> Uniformity (Homogeneity) (Evaluated)</h3>
              <p>Each unit of a given denomination must be identical in quality and value.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Natural commodities often lacked uniformity (e.g., quality of grain, size of cattle). Even early, privately minted coins could vary. State-controlled minting aimed to improve uniformity.</li>
                <li><strong>Modern Perspective:</strong> Centralized minting and printing with extremely strict quality controls ensure high uniformity for modern fiat currencies, preventing Gresham's Law from taking hold due to variations in physical quality of the money itself. For digital money, one unit of a specific digital currency (e.g., one digital dollar in an account) is perfectly identical to another.</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Limited Supply (Scarcity) (Evaluated)</h3>
              <p>The supply of money must be restricted relative to demand to maintain its value.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> The natural scarcity of gold and silver (difficult to mine) was a key reason for their adoption as money. However, new discoveries (e.g., gold rushes) could still cause inflationary pressures. Items too easily found (like common shells in some coastal areas) eventually failed as money when supply became uncontrolled.</li>
                <li><strong>Modern Perspective:</strong> For fiat money, scarcity is not natural but is managed (or should be managed) by the central bank. The power to create money at will provides flexibility but also carries the immense risk of over-issuance and hyperinflation if not managed prudently and independently. The supply of many cryptocurrencies is algorithmically limited (e.g., Bitcoin's 21 million cap), which is a key part of their value proposition for some users, though this also means their supply cannot be flexibly adjusted to meet changing economic needs.</li>
              </ul>
            </div>

            <div className={cardClasses('indigo')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Acceptability (Evaluated)</h3>
              <p>This remains paramount.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Acceptability of commodity money was often based on its intrinsic utility or established custom. For metallic money, trust in the assayer or the stamp of the ruler was key.</li>
                <li><strong>Modern Perspective:</strong> Fiat money's acceptability relies heavily on legal tender status, government stability, sound economic policies (especially those ensuring low inflation), and deep-rooted public confidence and habit. Loss of this trust can render fiat money worthless, regardless of legal status. For new forms of money like cryptocurrencies, achieving widespread, universal acceptability as a general medium of exchange remains a major hurdle.</li>
              </ul>
            </div>

            <div className={cardClasses('pink')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Recognisability (Evaluated)</h3>
              <p>Money must be easy to identify as genuine and difficult to counterfeit.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> Simple commodities were often easy to recognize but also sometimes easy to fake or adulterate (e.g., mixing base metals with gold). Distinctive coinage helped.</li>
                <li><strong>Modern Perspective:</strong> Modern currencies employ highly sophisticated and layered security features to combat counterfeiting, which is a constant technological arms race. The recognisability and security of digital money depend on cryptographic methods, secure authentication protocols, and user awareness to prevent phishing and fraud.</li>
              </ul>
            </div>

            <div className={cardClasses('teal')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Anchor size={20} /> Stability of Value (Evaluated)</h3>
              <p>Good money should maintain a relatively consistent purchasing power.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Historical Perspective:</strong> While often more stable than many alternatives, the value of commodity money (like gold) could still fluctuate based on new discoveries or changes in non-monetary demand for the commodity.</li>
                <li><strong>Modern Perspective:</strong> This is the central challenge for fiat money. Its value is not anchored to any commodity and depends entirely on the prudent management of its supply by the central bank and the overall economic health and policies of the issuing country. Periods of high inflation demonstrate a failure to maintain this characteristic. For many cryptocurrencies, extreme price volatility has so far limited their effectiveness as a stable store of value or reliable unit of account for everyday transactions.</li>
              </ul>
            </div>

            <div className={cardClasses('orange')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Comparative Evaluation Summary:</h3>
              <p>No single item is perfect across all characteristics. Historically, precious metals like gold and silver offered a good balance for their time, excelling in durability, scarcity, and eventual acceptability, though they had limitations in portability for very large sums (before paper) and their supply was not easily adaptable by authorities.</p>
              <p>Modern fiat money (like the US dollar, Euro, or the Zimbabwean Dollar in its various forms) is engineered to be highly portable, divisible, uniform, and recognizable. Its supply can be flexibly managed by a central bank, which is an advantage for macroeconomic management but also its greatest vulnerability if mismanaged. Its acceptability and stability of value depend entirely on government decree ("fiat"), the credibility and independence of the central bank, sound fiscal and monetary policies, and sustained public trust. The Zimbabwean experience with hyperinflation starkly illustrates the consequences when these foundations of fiat money are undermined.</p>
              <p>Digital currencies (including cryptocurrencies) offer excellent portability and divisibility, and potentially lower transaction costs. However, their characteristics regarding stability of value, widespread acceptability, regulatory oversight, security against certain types of fraud/theft, and energy consumption (for some) are still subjects of intense debate and development.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: RELATIONSHIP BETWEEN MONEY AND PRICES ========== */}
        <SectionWrapper id="relationship">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Exploration of the Relationship Between Money and Prices</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>The relationship between the amount of money circulating in an economy (the money supply) and the general level of prices for goods and services is a fundamental and extensively studied concept in economics. It is most commonly explained by the Quantity Theory of Money, a theory with a long history, refined by economists like Irving Fisher and Milton Friedman. Understanding this relationship is crucial for comprehending inflation, deflation, and the role of monetary policy.</p>

              <h4>The Quantity Theory of Money (Simplified Core Idea)</h4>
              <p>In its most straightforward and classical form, this theory posits that there is a direct and, in the long run, proportional relationship between the quantity of money in an economy and the general level of prices of goods and services, assuming other key factors remain constant or change predictably. The core idea is that if the amount of money in circulation (the money supply) increases significantly while the amount of goods and services available for purchase (real output or the real volume of transactions) remains relatively constant or grows much slower, then there will be "too much money chasing too few goods." This imbalance, where aggregate demand fueled by more money outstrips aggregate supply, leads to a sustained rise in the general price level – a phenomenon known as inflation. Conversely, a significant decrease in the money supply, with real output held constant, could potentially lead to a fall in the general price level, known as deflation. The theory emphasizes money's role primarily as a determinant of the price level in the long run.</p>

              <h4>The Equation of Exchange (MV = PY or MV = PT)</h4>
              <p>This relationship is often formalized and represented by the equation of exchange, an identity which states that the total amount spent on goods and services in an economy must equal the total value of those goods and services sold. It is most commonly expressed as:</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center my-4 font-mono text-lg">
                <strong>MV = PY</strong>
              </div>
              <p>Where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>M</strong> = Money Supply: The total stock of money in circulation in the economy.</li>
                <li><strong>V</strong> = Velocity of Money (or Velocity of Circulation): The average number of times a unit of money is spent on final goods and services within a given period.</li>
                <li><strong>P</strong> = Price Level: The average price of all final goods and services produced.</li>
                <li><strong>Y</strong> = Real Output (or Real GDP): The total quantity of final goods and services produced, adjusted for price changes.</li>
              </ul>
              <p>The equation MV = PY is an identity, meaning it is true by definition. To transform it into a theory, assumptions of stable V and fixed Y in the long run are made, implying that changes in M lead to proportional changes in P.</p>

              <h4>Inflation</h4>
              <p><strong>Inflation is defined as a sustained and general increase in the average level of prices of goods and services in an economy over a significant period of time.</strong> When the general price level rises, each unit of currency buys fewer goods and services than it did previously.</p>
              <p>High, persistent inflation can be extremely detrimental: it erodes savings, creates uncertainty, distorts price signals, and can lead to hyperinflation (e.g., Zimbabwe 2008).</p>

              <h4>Deflation</h4>
              <p><strong>Deflation is a sustained and general decrease in the average level of prices.</strong> While falling prices might seem good, persistent deflation can lead to reduced spending, increased real debt burden, lower profits, and a dangerous deflationary spiral.</p>

              <h4>Role of the Central Bank in Managing Money and Prices</h4>
              <p>Central banks, such as the Reserve Bank of Zimbabwe (RBZ), manage the money supply through monetary policy, aiming for price stability (low and stable inflation). Tools include adjusting interest rates, reserve requirements, and open market operations.</p>

              <h4>Expectations, Velocity, and Other Factors</h4>
              <p>The relationship is not always simple; velocity changes, real output changes, inflationary expectations, supply shocks, fiscal policy, and global conditions can complicate the link between money and prices.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — The Nature of Money</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Definition</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Characteristics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Functions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Evaluation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Money &amp; Prices</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quantity Theory</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inflation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deflation</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Nature of Money. 💰📊</p>
        </footer>

      </div>
    </div>
  );
};
