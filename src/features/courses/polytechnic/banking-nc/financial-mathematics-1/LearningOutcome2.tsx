import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, AlertTriangle,
  
  BookOpen, BarChart,  
  Info, 
  LineChart, 
  Table, 
  BarChart3, PieChart as PieChartIcon,
  Sigma, 
  
  Activity as ActivityIcon,
  
  
  Zap
} from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'introduction',
    title: 'An Introduction to Statistics',
    keywords: ['statistics', 'data', 'population', 'sample', 'purpose', 'uses', 'limitations'],
  },
  {
    id: 'collection',
    title: 'Collection of Data: Finding the Raw Materials',
    keywords: ['data collection', 'primary data', 'secondary data', 'qualitative', 'quantitative', 'sampling', 'random', 'stratified', 'convenience'],
  },
  {
    id: 'classification',
    title: 'Classification and Tabulation of Data',
    keywords: ['classification', 'tabulation', 'frequency', 'frequency distribution table', 'class interval'],
  },
  {
    id: 'presentation',
    title: 'Presentation of Data: A Picture is Worth a Thousand Numbers',
    keywords: ['presentation', 'bar chart', 'pie chart', 'histogram', 'line graph', 'visualization'],
  },
  {
    id: 'central-tendency',
    title: 'Measures of Central Tendency',
    keywords: ['central tendency', 'mean', 'median', 'mode', 'average', 'outlier'],
  },
  {
    id: 'dispersion',
    title: 'Measures of Dispersion',
    keywords: ['dispersion', 'range', 'variance', 'standard deviation', 'spread', 'consistency', 'risk'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome2: React.FC = () => {
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
              placeholder="Search sections... (e.g., statistics, data collection, mean, median, dispersion)"
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
              Financial Statistics
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Fundamentals of <span className="text-sky-300 font-bold italic">Financial Statistics</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Master the essentials of statistics, data collection, classification, presentation, central tendency, and dispersion for informed decision-making.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">financial_statistics.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Statistics;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Data;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Measures;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><BarChart3 className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Sigma className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: INTRODUCTION TO STATISTICS ========== */}
        <SectionWrapper id="introduction">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>An Introduction to Statistics: Making Sense of the Numbers</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you are the manager of a new Chicken Inn branch in Bulawayo. How do you decide how many chickens to cook each day? If you cook too many, you waste money. If you cook too few, you lose sales and customers get angry. You can't just guess. You need information, or what we call <strong>data</strong>. You might track your sales every day for a month, notice that you sell more on Fridays, and use that information to plan better. What you are doing is using <strong>statistics</strong>.</p>
              <p>At its core, statistics is the science of collecting, organising, analysing, and interpreting numerical data to make better decisions. It is a powerful tool that helps us move from raw, confusing information to clear, useful knowledge. We are surrounded by statistics every day. When ZIMSTAT (the Zimbabwe National Statistics Agency) announces the monthly inflation rate, that's statistics. When an agronomist in Mashonaland Central calculates the average maize yield per hectare for a district, that's statistics.</p>
              <p>This chapter is your introduction to this essential subject. We will learn what statistics is, why it is so important for business and government, and also understand its limitations. Mastering these basic ideas will give you the ability to understand the numbers that shape our world and to use them to your advantage.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Statistics:</strong> The science of collecting, analysing, and interpreting data to make decisions. It can also refer to the data itself (e.g., "sales statistics").</li>
                <li><strong>Data:</strong> A collection of facts, such as numbers, words, measurements, or observations.</li>
                <li><strong>Population:</strong> The complete set of all possible people or items that you are interested in studying.</li>
                <li><strong>Sample:</strong> A smaller, manageable group selected from the population, which is used to represent the whole population.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Info size={20} /> The Core Concepts Explained</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">The Meaning of the Term Statistics</h4>
                  <p>The word 'statistics' can be used in two different ways:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>As a plural noun:</strong> It refers to numerical facts or data. For example, "The latest statistics show that tourist arrivals have increased."</li>
                    <li><strong>As a singular noun:</strong> It refers to the subject itself—the science and methods used to work with data. For example, "Statistics is a required module for this course."</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">The Purpose of Statistics</h4>
                  <p>The main purpose of statistics is to help us make effective decisions in the face of uncertainty. It does this by:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Presenting Facts Clearly:</strong> It organises complex data into a simple, definite form.</li>
                    <li><strong>Simplifying Complexity:</strong> It provides a summary of a large amount of information.</li>
                    <li><strong>Allowing for Comparison:</strong> It gives us a basis to compare different groups or different time periods.</li>
                    <li><strong>Helping in Forecasting:</strong> By analysing past data, we can make educated predictions about the future.</li>
                    <li><strong>Informing Policy:</strong> The government uses census data to decide where to build new schools and clinics.</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400">The Uses of Statistics</h4>
                  <p>Statistics is used in almost every field:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>In Business:</strong> Market research, quality control, and understanding customer needs.</li>
                    <li><strong>In Economics:</strong> GDP, inflation rates, and employment figures to manage the nation's economy.</li>
                    <li><strong>In Government Administration:</strong> Allocating resources efficiently, from distributing drought relief to planning infrastructure.</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-red-600 dark:text-red-400">The Limitations of Statistics</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>It deals with groups, not individuals.</strong> Statistics can tell you the average income in a town, but not what a specific person earns.</li>
                    <li><strong>It can be misused.</strong> Data can be manipulated to support a certain argument.</li>
                    <li><strong>It only studies numerical features.</strong> It cannot easily measure qualitative things like honesty or patriotism.</li>
                    <li><strong>Its conclusions are only true "on average."</strong> Statistical predictions are about probability, not certainty.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example: "Putting it to Work in Zimbabwe"</h3>
              <p><strong>Scenario:</strong> The manager of a Bakers Inn in Masvingo wants to find out if customers would buy a new product: a "boerewors sausage roll."</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Purpose of Statistics:</strong> To make a smart, profitable business decision and avoid wasting resources.</li>
                <li><strong>Use of Statistics:</strong> The manager conducts market research with a survey of 100 customers over a weekend.</li>
                <li><strong>Population vs. Sample:</strong> Population is all potential customers. The sample is 100 customers surveyed.</li>
                <li><strong>A Limitation of Statistics:</strong> Even if 70% of the sample say they are interested, this is not a guarantee of success—the result is only true "on average."</li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Common Mistakes to Avoid</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Believing Statistics are 100% Fact:</strong> Remember, statistics are often based on samples and come with limitations.</li>
                <li><strong>Ignoring the Source:</strong> Not asking where the data came from. A survey conducted by a company selling a product might be biased.</li>
                <li><strong>Confusing the plural and singular meaning of statistics.</strong></li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: COLLECTION OF DATA ========== */}
        <SectionWrapper id="collection">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Collection of Data: Finding the Raw Materials</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Think of a chef who wants to cook a delicious meal. The quality of the final dish depends entirely on the quality of the ingredients they start with. If they use rotten tomatoes, the soup will be terrible, no matter how skilled they are. It's the same with statistics. The process of gathering information is called <strong>data collection</strong>, and it is the most important step. If we collect bad, inaccurate, or biased data, our final analysis will be useless. There is a famous saying in statistics: <strong>"Garbage in, garbage out."</strong></p>
              <p>So, how do we get good "ingredients"? A market researcher for a company like Schweppes might stand in a supermarket and ask people what they think of a new drink flavour. An agricultural extension officer might visit a farm in Mvurwi and measure the height of maize plants. ZIMSTAT sends people to every corner of the country to count the population during a census. These are all methods of data collection. Understanding these methods is the first step in learning how to produce trustworthy and useful statistics.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Primary Data:</strong> First-hand data that you collect yourself for your specific purpose.</li>
                <li><strong>Secondary Data:</strong> Data that was already collected and published by someone else.</li>
                <li><strong>Qualitative Data:</strong> Descriptive, non-numerical data (e.g., a person's favourite colour).</li>
                <li><strong>Quantitative Data:</strong> Numerical data that can be counted or measured (e.g., a person's age).</li>
                <li><strong>Sampling:</strong> The process of selecting a representative group (a sample) from a larger population to study.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Info size={20} /> The Core Concepts Explained</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Types of Data</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Qualitative Data:</strong> Descriptive data. Examples: interview responses, favourite kombi routes, brands of soap.</li>
                    <li><strong>Quantitative Data:</strong> Numerical data.
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Discrete Data:</strong> Can only be a whole number. Counted. Examples: Number of cattle on a farm.</li>
                        <li><strong>Continuous Data:</strong> Can take any value within a range. Measured. Examples: Height, weight, temperature.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">Methods of Data Collection</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Primary Data Methods:</strong>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Surveys and Questionnaires:</strong> Asking people a set of questions.</li>
                        <li><strong>Observation:</strong> Watching and recording behaviour without asking questions.</li>
                        <li><strong>Experiments:</strong> A controlled study to test a hypothesis.</li>
                      </ul>
                    </li>
                    <li><strong>Secondary Data Sources:</strong> Data that already exists. Examples: ZIMSTAT reports, RBZ reports, academic journals, company annual reports.</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400">Sampling Methods</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Random Sampling:</strong> Every person in the population has an equal chance of being selected. This is the best way to get an unbiased sample.</li>
                    <li><strong>Systematic Sampling:</strong> Selecting every "nth" person from a list.</li>
                    <li><strong>Stratified Sampling:</strong> Dividing the population into subgroups, then taking a random sample from each group.</li>
                    <li><strong>Convenience Sampling:</strong> Choosing people who are easy to find. This method is fast but often biased.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example: "Putting it to Work in Zimbabwe"</h3>
              <p><strong>Scenario:</strong> The Ministry of Higher and Tertiary Education wants to research how students at polytechnics across Zimbabwe are using mobile data for their studies.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Population:</strong> All students enrolled at every polytechnic in Zimbabwe.</li>
                <li><strong>Data Collection Method:</strong> A survey using a questionnaire.</li>
                <li><strong>Sampling Method:</strong> Stratified Sampling. Divide the population into strata (each polytechnic), then select a random sample of 50 students from each.</li>
                <li><strong>Types of Data Collected:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"How much did you spend on data last month?" - <strong>Quantitative (Continuous) data.</strong></li>
                    <li>"What is the main network you use?" - <strong>Qualitative data.</strong></li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className={cardClasses('red')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Common Mistakes to Avoid</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Using a Biased Sample:</strong> Only surveying students in the library about study habits.</li>
                <li><strong>Confusing Discrete and Continuous Data:</strong> Forgetting that things that are counted are discrete, and things that are measured are continuous.</li>
                <li><strong>Asking Bad Questions:</strong> Using leading or confusing questions in a questionnaire.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: CLASSIFICATION AND TABULATION ========== */}
        <SectionWrapper id="classification">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Classification and Tabulation of Data</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you have just finished harvesting and you have one massive bag filled with a mixture of maize, sorghum, and rapoko. Before you can use it, you have to sort it into separate piles. This sorting process is exactly what we do in statistics. <strong>Classification</strong> is sorting raw data into logical groups, and <strong>Tabulation</strong> is putting this sorted information into a neat table. This step is essential because it brings order to the chaos of raw data, making it easier to understand and analyze.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Classification:</strong> The process of arranging raw data into groups or classes according to their common features.</li>
                <li><strong>Frequency:</strong> The number of times a particular value or observation appears in a data set.</li>
                <li><strong>Frequency Distribution Table:</strong> A table that shows the different data classes and the frequency for each class.</li>
                <li><strong>Class Interval:</strong> The range of a specific group in a frequency distribution table (e.g., "$10 up to $20").</li>
                <li><strong>Tabulation:</strong> The systematic arrangement of classified data into rows and columns.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Table size={20} /> The Core Concepts Explained</h3>
              <p>The Frequency Distribution Table is the most important tool for classifying data. It shows us how "frequently" a value occurs.</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-x-auto">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-center">Example: Number of Children in 10 Families</h4>
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="px-4 py-2 text-left">Number of Children</th>
                      <th className="px-4 py-2 text-left">Tally</th>
                      <th className="px-4 py-2 text-left">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="px-4 py-2">0</td><td className="px-4 py-2">|</td><td className="px-4 py-2">1</td></tr>
                    <tr><td className="px-4 py-2">1</td><td className="px-4 py-2">||</td><td className="px-4 py-2">2</td></tr>
                    <tr><td className="px-4 py-2">2</td><td className="px-4 py-2">||||</td><td className="px-4 py-2">4</td></tr>
                    <tr><td className="px-4 py-2">3</td><td className="px-4 py-2">||</td><td className="px-4 py-2">2</td></tr>
                    <tr><td className="px-4 py-2">4</td><td className="px-4 py-2">|</td><td className="px-4 py-2">1</td></tr>
                    <tr className="border-t border-gray-300 dark:border-gray-600 font-bold">
                      <td className="px-4 py-2" colSpan={2}>Total</td>
                      <td className="px-4 py-2">10</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This table is much clearer than the original list. We can now easily see that the most common number of children is 2.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: PRESENTATION OF DATA ========== */}
        <SectionWrapper id="presentation">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Presentation of Data: A Picture is Worth a Thousand Numbers</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Data presentation is the art of turning the numbers in our tables into visual formats like charts and graphs. A well-designed graph can tell a story at a glance, making it easy to spot trends, make comparisons, and see relationships in our data.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Bar Chart:</strong> Uses bars of different heights to compare the values of different categories.</li>
                <li><strong>Pie Chart:</strong> A circular chart divided into slices, used to show the proportion of each part of a whole.</li>
                <li><strong>Histogram:</strong> A special type of bar chart for continuous data, where the bars touch each other.</li>
                <li><strong>Line Graph:</strong> Uses points connected by lines to show how a value changes over time.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart3 size={20} /> Bar Charts</h3>
                <p>Perfect for comparing different, separate categories (e.g., sales figures for different branches). The bars have gaps between them.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PieChartIcon size={20} /> Pie Charts</h3>
                <p>Best for showing how a total amount is divided (e.g., budget allocation). Each slice's angle is calculated as (Value / Total) × 360°.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Histograms</h3>
                <p>Used for continuous data from a frequency table. The bars touch to show the data is continuous.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LineChart size={20} /> Line Graphs</h3>
                <p>The number one choice for showing a trend over time. The horizontal axis is always time.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: MEASURES OF CENTRAL TENDENCY ========== */}
        <SectionWrapper id="central-tendency">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Measures of Central Tendency: Finding the 'Typical' Value</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>A measure of central tendency summarizes a set of different numbers with a single, "typical" or "central" value. It helps us find a simple answer to questions like: What is the average salary? What is the most common age of our customers? These single numbers help us understand a dataset at a glance.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Central Tendency:</strong> A measure that represents the center point or typical value of a dataset.</li>
                <li><strong>Mean:</strong> The arithmetic average, found by adding up all the values and dividing by the number of values.</li>
                <li><strong>Median:</strong> The middle value in an ordered dataset.</li>
                <li><strong>Mode:</strong> The value that appears most frequently.</li>
                <li><strong>Outlier:</strong> An extremely high or low value that is very different from the rest of the data.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Table size={20} /> The 3 Ms: Mean, Median, and Mode</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="px-4 py-2 text-left">Measure</th>
                      <th className="px-4 py-2 text-left">What it is</th>
                      <th className="px-4 py-2 text-left">Advantages</th>
                      <th className="px-4 py-2 text-left">Disadvantages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 font-bold">Mean</td>
                      <td className="px-4 py-2">The arithmetic average.</td>
                      <td className="px-4 py-2">Very common, easy to understand, uses all data.</td>
                      <td className="px-4 py-2">Heavily affected by extreme values (outliers).</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 font-bold">Median</td>
                      <td className="px-4 py-2">The middle number in an ordered list.</td>
                      <td className="px-4 py-2">Not affected by outliers, good for skewed data like income.</td>
                      <td className="px-4 py-2">Does not use all the data values in its calculation.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold">Mode</td>
                      <td className="px-4 py-2">The most frequent number.</td>
                      <td className="px-4 py-2">Simple to find, can be used for non-numerical data.</td>
                      <td className="px-4 py-2">Not always unique, may not exist, may not represent the center.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={cardClasses('amber')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Worked Example</h3>
              <p>A vendor's daily sales are: <strong>$20, $15, $18, $20, $22, $16, $50</strong></p>
              <div className="space-y-2 mt-2">
                <p><strong>Mean:</strong> (20+15+18+20+22+16+50) / 7 = 161 / 7 = <strong>$23</strong></p>
                <p><strong>Median:</strong> First, order the data: 15, 16, 18, 20, 20, 22, 50. The middle value is <strong>$20</strong>.</p>
                <p><strong>Mode:</strong> The value that appears most often is <strong>$20</strong>.</p>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">The high value of $50 is an outlier that pulls the mean up. Here, the median is a better measure of a "typical" day's sales.</p>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: MEASURES OF DISPERSION ========== */}
        <SectionWrapper id="dispersion">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Measures of Dispersion: How Spread Out is the Data?</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Dispersion is a measure of how spread out or scattered the data is from the center (the mean). A small dispersion means the data points are clustered tightly together (consistent). A large dispersion means the data points are widely scattered (inconsistent). In business, understanding dispersion is just as important as knowing the average, as it helps measure risk and consistency.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Dispersion:</strong> The extent to which data points differ from each other or from the average.</li>
                <li><strong>Range:</strong> The difference between the highest and lowest values.</li>
                <li><strong>Variance:</strong> A measure of how far each number in the set is from the mean.</li>
                <li><strong>Standard Deviation:</strong> The square root of the variance, and the most widely used measure of dispersion.</li>
              </ul>
            </div>

            <div className={cardClasses('green')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ActivityIcon size={20} /> Worked Example: Comparing Business Consistency</h3>
              <p>Let's compare the sales of two vendors who both have a <strong>mean daily sale of $60</strong>:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Vendor A</h4>
                  <p>Sales (USD): 50, 55, 60, 65, 70</p>
                  <p className="mt-1"><strong>Range A:</strong> 70 - 50 = <strong>$20</strong></p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">Vendor B</h4>
                  <p>Sales (USD): 10, 20, 60, 100, 110</p>
                  <p className="mt-1"><strong>Range B:</strong> 110 - 10 = <strong>$100</strong></p>
                </div>
              </div>
              <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-bold text-amber-600 dark:text-amber-400">Analysis</h4>
                <p>Although their averages are identical, <strong>Vendor A</strong> has a much more stable business (small range), while <strong>Vendor B's</strong> business is highly inconsistent and risky (large range). The measure of dispersion revealed this important difference.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Fundamentals of Financial Statistics</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Statistics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data Collection</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Qualitative</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quantitative</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sampling</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frequency Table</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bar Chart</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mean</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Median</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mode</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispersion</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Financial Statistics. 📊📈</p>
        </footer>

      </div>
    </div>
  );
};