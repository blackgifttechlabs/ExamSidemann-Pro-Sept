import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins,Box
} from 'lucide-react';

export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
    };
    const borderColor = colorMap[color] || colorMap.blue;
    return `py-4 mb-4 ${borderColor}`;
  };

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              International <span className="text-emerald-300 font-bold italic">Purchasing</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to international purchasing, advantages, rationales, supply chain role, trade factors, and global sourcing strategies.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">international_purchasing.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">SOURCE</span><span className="text-white">Global_Suppliers;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Trade_Factors;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">OPTIMIZE</span><span className="text-white">Supply_Chain;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><GlobeIcon className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Ship className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: INTRODUCTION TO INTERNATIONAL PURCHASING ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Introduction to International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>International purchasing, also known as global sourcing, refers to the process of buying goods and services from suppliers located in countries other than your own.</p>
            <p className="mt-2">It involves navigating a complex web of international trade laws, logistics, cultural differences, and currency exchange rates. Businesses engage in international purchasing for a variety of reasons, including cost savings, access to specialized products, and the ability to expand their market reach. It's a strategic decision that requires careful planning and execution to mitigate risks and maximize benefits.</p>
          </div>
        </section>

        {/* ========== SECTION 2: ADVANTAGES AND RATIONALES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Advantages and Rationales</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost Reduction Through Lower Labour and Production Costs</h3>
            <p>One of the most compelling reasons for international purchasing is the potential for significant cost savings. Many countries have lower labour costs, reduced overhead expenses, and more affordable raw materials compared to developed nations. This allows businesses to acquire products at a lower price, increasing their profit margins or enabling them to offer more competitive prices to their customers. For example, a clothing company might source its garments from factories in Southeast Asia, where labour costs are significantly lower than in Western countries. This cost advantage can be substantial, especially for businesses dealing with high-volume production. Additionally, some countries may have more lenient environmental regulations or lower tax rates, further contributing to cost savings.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Access to Specialized Products and Technologies</h3>
            <p>Certain countries specialize in producing specific goods or possess unique technological capabilities. International purchasing allows businesses to access these specialized products and technologies that may not be available domestically. For instance, a technology company might source advanced electronic components from manufacturers in Japan or South Korea, known for their expertise in electronics. A company looking for specific types of rare earth minerals may need to purchase them from a supplier in China. This access to specialized resources and expertise can provide a significant competitive advantage, enabling businesses to offer innovative products and services.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Increased Market Competition and Supplier Diversification</h3>
            <p>By expanding their supplier base internationally, businesses can foster healthy competition among suppliers. This competition can lead to lower prices, improved product quality, and better service. Diversifying suppliers also reduces the risk of supply chain disruptions. If a domestic supplier faces production problems or goes out of business, a business with international suppliers can continue to operate without significant interruption. For example, a car manufacturer might source parts from suppliers in multiple countries to avoid relying on a single region or company. This diversification enhances supply chain resilience and reduces vulnerability to economic or political instability in any one country.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Enhanced Product Quality and Innovation</h3>
            <p>In some cases, international suppliers may offer higher quality products or more innovative solutions than domestic suppliers. This can be due to their specialized expertise, advanced manufacturing processes, or access to superior raw materials. Businesses can leverage these advantages to improve the quality of their own products and stay ahead of the competition. For example, a food company might source high-quality ingredients from suppliers in countries known for their agricultural expertise. Working with international suppliers can also expose businesses to new ideas and technologies, fostering innovation and product development.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Expansion of Market Reach and Global Presence</h3>
            <p>International purchasing can facilitate the expansion of market reach by enabling businesses to source products from regions where they intend to sell them. This can reduce transportation costs and lead times, making it easier to serve customers in those markets. Establishing relationships with international suppliers can also provide valuable insights into local market conditions and consumer preferences. For example, a retail company might source products from suppliers in Europe to better understand and cater to the European market. This can pave the way for future expansion and establish a stronger global presence.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Mitigation of Domestic Supply Constraints</h3>
            <p>During periods of high demand or limited domestic production capacity, international purchasing can help businesses overcome supply constraints. Sourcing products from overseas can ensure a steady supply of goods, preventing stockouts and meeting customer demand. This is particularly important for businesses dealing with seasonal products or those experiencing rapid growth. For example, a construction company might source building materials from international suppliers during a period of high domestic demand. This flexibility helps maintain operational continuity and customer satisfaction.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Access to Raw Materials and Natural Resources</h3>
            <p>Many countries have abundant natural resources or raw materials that are not readily available domestically. International purchasing allows businesses to access these resources, ensuring a stable supply for their production processes. For example, a metal manufacturing company might source iron ore from suppliers in Australia or Brazil. A paper manufacturing company may source wood pulp from Canada.</p>
            <p className="mt-2">This access to vital resources is essential for businesses that rely on specific raw materials for their operations. Also, some countries may have better regulations regarding the extraction of those resources, making them a better ethical choice.</p>
          </div>
        </section>

        {/* ========== SECTION 3: THE ROLE OF INTERNATIONAL PURCHASING WITHIN THE SUPPLY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Role of International Purchasing Within the Supply</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Securing Raw Material Supply</h3>
            <p>International purchasing is fundamental in ensuring a consistent flow of raw materials. Many industries rely on resources that are geographically concentrated. For instance, electronics manufacturers might source rare earth minerals from specific regions, or clothing companies may obtain cotton from countries with favourable growing conditions. By tapping into global markets, businesses can mitigate the risk of domestic shortages and secure the necessary inputs for their production processes. This role is especially important for manufacturers that require specific raw materials that are not found within their own countries' borders.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Optimizing Production Costs</h3>
            <p>A core function of international purchasing is to reduce production costs. By sourcing components and finished goods from countries with lower labour and manufacturing expenses, companies can significantly improve their profit margins. This strategy allows businesses to offer competitive pricing to consumers while maintaining profitability. For example, many consumer electronics are assembled in countries with lower labour costs, enabling companies to offer affordable products.</p>
            <p className="mt-2">This role of cost optimization has a large effect on the final price of consumer goods.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Enhancing Supply Chain Resilience</h3>
            <p>Diversifying the supplier base through international purchasing strengthens the supply chain's resilience. Relying solely on domestic suppliers can expose businesses to risks such as natural disasters, political instability, or economic downturns in a single region. By sourcing from multiple countries, companies can minimize disruptions and ensure business continuity. If one supplier experiences problems, alternative sources are available. This is extremely important in our modern world, where global events can have rapid and widespread effects.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Facilitating Access to Specialized Capabilities</h3>
            <p>Certain countries possess unique expertise in specific industries or technologies. International purchasing enables businesses to access these specialized capabilities. For example, a company developing advanced medical devices might source components from manufacturers in countries with expertise in precision engineering. This access to specialized skills and technologies can drive innovation and enhance product quality.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Supporting Market Expansion</h3>
            <p>International purchasing plays a vital role in supporting market expansion. By sourcing products from regions where they intend to sell them, businesses can reduce transportation costs and lead times.</p>
            <p className="mt-2">This strategy allows companies to respond quickly to local market demands and build stronger relationships with customers in those regions. Also, by sourcing goods from a region, a company can better understand that regions customer base.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lightbulb size={20} /> Driving Technological Advancement</h3>
            <p>Global sourcing can expose businesses to new technologies and manufacturing processes. By partnering with international suppliers, companies can gain access to innovative solutions that may not be available domestically. This exchange of knowledge and technology can drive continuous improvement and enhance competitiveness. For example, a company may find that a supplier in another country has a more efficient manufacturing process, that can then be implemented into their own company.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Managing Inventory and Logistics</h3>
            <p>International purchasing necessitates effective inventory management and logistics. Companies must coordinate complex international shipments, manage customs clearance, and ensure timely delivery of goods. This requires sophisticated logistics capabilities and strong partnerships with freight forwarders and other logistics providers.</p>
            <p className="mt-2">Efficient inventory management is critical to minimizing holding costs and avoiding stockouts.</p>
          </div>
        </section>

        {/* ========== SECTION 4: FACTORS INFLUENCING INTERNATIONAL TRADE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Factors Influencing International Trade</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Flag size={20} /> Government Policies and Trade Agreements</h3>
            <p>Governments wield significant influence over international trade through policies like tariffs, quotas, and subsidies. Tariffs, which are taxes on imported goods, can make foreign products more expensive, protecting domestic industries but potentially limiting consumer choice. Quotas restrict the quantity of imported goods, also protecting domestic producers. Trade agreements, such as free trade agreements (FTAs), aim to reduce or eliminate these barriers, promoting trade between participating countries. Political relationships between countries also greatly effect trade. For example, if two countries have a poor relationship, trade between them will often suffer.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Coins size={20} /> Economic Conditions and Exchange Rates</h3>
            <p>The overall health of a country's economy, including its inflation rate and GDP growth, significantly impacts its trade activities. Exchange rates, which determine the value of one currency relative to another, also play a crucial role. A strong domestic currency can make imports cheaper and exports more expensive, potentially leading to a trade deficit. Conversely, a weak currency can boost exports and make imports pricier. Global economic conditions also play a large role. When the global economy is doing well, trade tends to increase.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Natural Resources and Factor Endowments</h3>
            <p>A country's natural resources, such as minerals, oil, and arable land, and its factor endowments, including labour, capital, and technology, determine its comparative advantage. Countries tend to specialize in producing goods and services that utilize their abundant resources and factors of production. For example, countries rich in oil tend to export petroleum products, while those with a skilled labour force may specialize in manufacturing high-tech goods. The availability of these resources heavily influences what goods are traded.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Technological Advancements</h3>
            <p>Advances in technology, particularly in transportation and communication, have revolutionized international trade. Containerization, faster ships, and air freight have reduced transportation costs and lead times, making global trade more efficient. The internet and digital communication have facilitated information exchange and business transactions across borders. Technological advancements in production also change what goods are able to be traded.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Consumer Demand and Preferences</h3>
            <p>Changes in consumer demand and preferences drive international trade. As consumer tastes evolve and new products emerge, businesses seek to source goods and services from around the world to meet those demands. Cultural differences also play a role, as consumers in different countries may have varying preferences for certain products.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Geopolitical Factors</h3>
            <p>Political stability, conflicts, and international relations can significantly disrupt international trade. Political instability in a region can lead to supply chain disruptions, while trade sanctions and embargoes can restrict trade between countries. Also, wars will heavily effect trade.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Transportation and Logistics Infrastructure</h3>
            <p>The efficiency of a country's transportation and logistics infrastructure, including ports, roads, and railways, is essential for facilitating international trade. Well-developed infrastructure reduces transportation costs and lead times, making it easier for businesses to engage in global trade. Conversely, poor infrastructure can hinder trade and limit a country's competitiveness.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — International Purchasing</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Sourcing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cost Reduction</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supply Chain</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trade Factors</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master International Purchasing. 🌍📦</p>
        </footer>

      </div>
    </div>
  );
};
