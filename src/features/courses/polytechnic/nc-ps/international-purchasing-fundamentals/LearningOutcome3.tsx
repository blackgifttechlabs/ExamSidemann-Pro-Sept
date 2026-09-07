import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon,
  MessageCircle, Globe, Currency, Truck as TruckIcon2, CheckSquare, Gavel, Lock, Leaf, Heart
} from 'lucide-react';

export const LearningOutcome3: React.FC = () => {
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Challenges in <span className="text-purple-300 font-bold italic">International Purchasing</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to the challenges of international purchasing, including cultural barriers, currency risks, logistics, quality control, legal issues, IP protection, ethics, and strategies to overcome them.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">procurement_challenges.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IDENTIFY</span><span className="text-white">Challenges;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Risks;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">STRATEGIZE</span><span className="text-white">Solutions;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><AlertTriangle className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Handshake className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: INTRODUCTION ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>International Purchasing Challenges</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>International purchasing, while offering numerous advantages, presents a complex landscape of challenges that businesses must navigate to succeed. These challenges stem from the inherent complexities of cross-border transactions, including cultural differences, logistical hurdles, and regulatory complexities. Successfully mitigating these challenges requires meticulous planning, robust risk management strategies, and a deep understanding of the global marketplace.</p>
          </div>
        </section>

        {/* ========== SECTION 2: CULTURAL AND COMMUNICATION BARRIERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Cultural and Communication Barriers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>One of the most significant challenges in international purchasing is navigating cultural and communication barriers. Differences in language, business etiquette, and cultural norms can lead to misunderstandings, misinterpretations, and delays. For example, direct communication styles that are common in some cultures may be perceived as aggressive in others. Furthermore, time zone differences can complicate communication and coordination. Establishing clear communication protocols, using interpreters or translators when necessary, and investing in cultural sensitivity training for employees can help to overcome these barriers. Building strong relationships with overseas suppliers through regular communication and face-to-face meetings can also foster trust and understanding. Also, differing holidays, and work schedules can cause delays.</p>
          </div>
        </section>

        {/* ========== SECTION 3: CURRENCY FLUCTUATIONS AND FINANCIAL RISKS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Currency Fluctuations and Financial Risks</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>International purchasing involves dealing with multiple currencies, which exposes businesses to the risk of currency fluctuations. Exchange rate volatility can significantly impact the cost of goods, making it difficult to predict and manage expenses. For instance, a sudden depreciation of the domestic currency can increase the cost of imports, reducing profit margins. Additionally, international transactions may involve payment risks, such as non-payment or delayed payment. Utilizing hedging strategies, such as forward contracts or options, and securing payment guarantees can help to mitigate these financial risks. Also, making sure to use a safe and reliable method of payment is very important.</p>
          </div>
        </section>

        {/* ========== SECTION 4: LOGISTICAL COMPLEXITIES AND SUPPLY CHAIN DISRUPTIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Logistical Complexities and Supply Chain Disruptions</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Managing the logistics of international shipments can be highly complex, involving multiple modes of transport, customs clearance procedures, and varying regulations. Delays, damage, or loss of goods can occur during transit, leading to increased costs and disruptions to the supply chain. Furthermore, political instability, natural disasters, or pandemics can cause significant disruptions to global supply chains. Implementing robust logistics management systems, diversifying suppliers, and developing contingency plans can help to minimize these risks. Maintaining good relationships with freight forwarders is also very important.</p>
          </div>
        </section>

        {/* ========== SECTION 5: QUALITY CONTROL AND COMPLIANCE ISSUES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Quality Control and Compliance Issues</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Ensuring the quality and compliance of goods sourced from overseas can be challenging. Differences in manufacturing standards, quality control practices, and regulatory requirements can lead to inconsistencies and non-conformities. Conducting thorough supplier audits, implementing rigorous inspection procedures, and requiring certifications can help to mitigate these risks. Staying up-to-date with relevant regulations and standards is also essential for ensuring compliance. Also, some countries have different views on what is considered ethical production.</p>
          </div>
        </section>

        {/* ========== SECTION 6: LEGAL AND REGULATORY DIFFERENCES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Legal and Regulatory Differences</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Navigating the legal and regulatory differences between countries can be complex and time-consuming. International trade is subject to various laws and regulations, including customs regulations, import/export restrictions, and intellectual property laws. Differences in legal systems and enforcement can create challenges for businesses. Seeking legal advice from experts specializing in international trade law can help to ensure compliance and minimize legal risks. Making sure that all contracts are very well written is very important.</p>
          </div>
        </section>

        {/* ========== SECTION 7: INTELLECTUAL PROPERTY PROTECTION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Intellectual Property Protection</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Protecting intellectual property (IP) rights in international markets can be challenging. Counterfeiting and infringement of IP rights are common issues, particularly in certain regions. Implementing robust IP protection strategies, such as registering trademarks and patents in relevant countries, and conducting due diligence on suppliers can help to mitigate these risks. Working with legal professionals who specialize in IP law is also essential.</p>
          </div>
        </section>

        {/* ========== SECTION 8: ETHICAL AND SUSTAINABILITY CONCERNS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Ethical and Sustainability Concerns</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Increasingly, businesses are facing scrutiny regarding the ethical and sustainability practices of their suppliers. Issues such as labour exploitation, environmental degradation, and human rights violations can damage a company's reputation and lead to legal repercussions. Conducting thorough supplier audits, implementing ethical sourcing policies, and promoting transparency in the supply chain can help to address these concerns. Ensuring that suppliers adhere to international labour and environmental standards is also essential.</p>
          </div>
        </section>

        {/* ========== SECTION 9: OVERCOMING THE CHALLENGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Overcoming the Challenges</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Overcoming the multifaceted challenges inherent in international purchasing requires a strategic and proactive approach. Businesses must adopt a combination of meticulous planning, robust risk management, and continuous improvement to navigate the complexities of global sourcing successfully. Here's a breakdown of effective strategies:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Building Strong Supplier Relationships and Enhancing Communication</h3>
            <p>Establishing and nurturing strong relationships with overseas suppliers is paramount. This involves fostering open and transparent communication, understanding their cultural norms and business practices, and building trust. Regular communication, including virtual meetings and in-person visits, helps to bridge cultural and communication gaps. Implementing clear communication protocols, using interpreters or translators when necessary, and investing in cultural sensitivity training for employees are crucial steps. By fostering a collaborative environment, businesses can enhance mutual understanding, resolve issues more efficiently, and build long-term partnerships.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Implementing Robust Risk Management Strategies</h3>
            <p>Mitigating financial risks, such as currency fluctuations and payment uncertainties, requires a proactive risk management approach. Businesses should explore hedging strategies, such as forward contracts and options, to protect against currency volatility. Diversifying payment methods and securing payment guarantees can minimize the risk of non-payment or delayed payment. Developing contingency plans for logistical disruptions, such as natural disasters or political instability, is also essential. This might involve diversifying suppliers, establishing alternative transportation routes, and maintaining buffer stocks. Thoroughly evaluating potential risks before committing to a supplier is a must.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Strengthening Supply Chain Resilience and Logistical Efficiency</h3>
            <p>To overcome logistical complexities and supply chain disruptions, businesses must invest in robust logistics management systems. This involves optimizing transportation routes, streamlining customs clearance procedures, and enhancing inventory management. Collaborating with experienced freight forwarders and logistics providers can help to navigate the complexities of international shipping. Implementing real-time tracking systems and enhancing communication with logistics partners can improve visibility and control over the supply chain. Diversifying transportation modes and establishing alternative logistics hubs can also enhance resilience.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClipboardCheck size={20} /> Ensuring Quality Control and Compliance through Rigorous Processes</h3>
            <p>Maintaining quality and compliance standards requires a comprehensive approach. Conducting thorough supplier audits, implementing rigorous inspection procedures, and requiring certifications are essential steps. Establishing clear quality control criteria and providing suppliers with detailed specifications can help to prevent non-conformities. Staying up-to-date with relevant regulations and standards, and conducting regular compliance checks, can ensure adherence to legal requirements. Implementing a system of checks and balances at every stage is a good way to ensure quality.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> Navigating Legal and Regulatory Differences with Expert Guidance</h3>
            <p>To navigate the complexities of international legal and regulatory environments, businesses should seek expert guidance. Engaging legal professionals specializing in international trade law can help to ensure compliance with customs regulations, import/export restrictions, and intellectual property laws. Thoroughly reviewing contracts and agreements, and ensuring they are legally sound in all relevant jurisdictions, is crucial. Staying informed about changes in trade regulations and adapting business practices accordingly is also essential.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Protecting Intellectual Property through Strategic Measures</h3>
            <p>Safeguarding intellectual property (IP) rights requires a proactive and strategic approach. Registering trademarks and patents in relevant countries, implementing robust IP protection clauses in contracts, and conducting due diligence on suppliers can help to mitigate the risk of infringement. Monitoring markets for counterfeit products and taking swift legal action against infringers are also essential. Working with legal professionals who specialize in IP law can provide valuable guidance and support.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Promoting Ethical and Sustainable Sourcing Practices</h3>
            <p>Addressing ethical and sustainability concerns requires a commitment to responsible sourcing practices. Conducting thorough supplier audits to assess labour practices, environmental impact, and human rights compliance is essential. Implementing ethical sourcing policies, such as codes of conduct and supplier guidelines, can help to promote responsible behaviour. Promoting transparency in the supply chain, engaging with stakeholders, and supporting initiatives that promote sustainable development can also enhance ethical sourcing practices.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Challenges in International Purchasing</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cultural Barriers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Currency Risks</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logistics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quality & Compliance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">IP Protection</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ethics</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master International Procurement Challenges. ⚠️🌍</p>
        </footer>

      </div>
    </div>
  );
};
