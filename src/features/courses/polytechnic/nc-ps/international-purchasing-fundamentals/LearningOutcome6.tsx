import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon,
  MessageCircle, Globe, Currency, Truck as TruckIcon2, CheckSquare, Gavel, Lock, Leaf, Heart,
  Droplet, Flame, Zap as ZapIcon, Factory as FactoryIcon, ShoppingCart, Award, FileText as FileTextIcon, CreditCard, Shield as ShieldIcon, RefreshCw, Save,
  Flame as FlameIcon, Droplet as DropletIcon, Wheat, Coffee, Beef, Banknote, FileCode,
  CreditCard as CreditCardIcon, DollarSign as DollarSignIcon, Clock, FileText as FileTextIcon2, BadgeCheck, Link, Database as DatabaseIcon, Receipt as ReceiptIcon,
  Building2, Landmark, Globe2, HandshakeIcon, Truck as TruckIcon3, ShieldAlert, Scale as ScaleIcon, BookOpenCheck, UserCheck, Rocket
} from 'lucide-react';

export const LearningOutcome6: React.FC = () => {
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO6
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Roles of Institutions in <span className="text-cyan-300 font-bold italic">Promoting International Purchase</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to the roles of commercial banks, trade promotion organizations, chambers of commerce, export credit agencies, WTO, freight forwarders, customs authorities, government, and regional economic blocs in international purchasing.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">trade_institutions.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">EXPLORE</span><span className="text-white">Institutions;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Roles;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">UNDERSTAND</span><span className="text-white">Promotion;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Landmark className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><HandshakeIcon className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: ROLES OF INSTITUTIONS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Roles Of These Institutions In Promoting International Purchase</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> Commercial Banks: Catalysts for Financial Confidence</h3>
            <p>Commercial banks are indispensable pillars in the realm of international purchasing, acting as the financial conduits that facilitate cross-border transactions. Their involvement extends far beyond simply holding accounts; they are instrumental in mitigating risks and ensuring the smooth flow of funds between buyers and sellers across diverse geographical and legal landscapes. One of their most critical functions is providing trade finance solutions, such as letters of credit (LCs). LCs act as guarantees of payment, where the bank promises to pay the seller if the buyer fulfils the agreed-upon terms. This is particularly vital in international trade, where trust between parties might be limited due to distance and unfamiliarity. Additionally, banks offer documentary collections, a less costly alternative to LCs, where they act as intermediaries for the exchange of documents and payments. They also provide foreign exchange services, enabling businesses to convert currencies and manage the ever-present risk of exchange rate fluctuations. Furthermore, commercial banks offer advisory services, sharing their expertise on international trade regulations, payment methods, and risk mitigation strategies. They may also provide loans and other credit facilities to help companies finance their international purchases, enabling them to expand their global reach. Essentially, commercial banks provide the financial confidence needed for international trade to happen.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Rocket size={20} /> Trade Promotion Organizations (TPOs): Catalysts for Export Growth and Global Market Access</h3>
            <p>Trade promotion organizations (TPOs), such as ZimTrade, are government-backed or quasi-governmental entities that serve as catalysts for export growth and facilitate access to international markets. These organizations play a pivotal role in bridging the gap between domestic businesses and the global marketplace. They conduct extensive market research and intelligence gathering, providing businesses with valuable insights into potential overseas markets, including demand trends, competitor analysis, and regulatory landscapes. They organize trade missions and exhibitions, creating platforms for businesses to network with potential international partners and buyers. These events provide opportunities for businesses to showcase their products and services, build relationships, and explore new markets. TPOs also offer a wide range of training and advisory services, covering topics such as export procedures, documentation requirements, marketing strategies, and cultural nuances of international business. They may also assist businesses in identifying potential international suppliers, helping them to source raw materials, components, or finished goods from overseas. By providing these resources and support, TPOs empower businesses to overcome the challenges of international trade and expand their global footprint.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building2 size={20} /> Chambers of Commerce: Fostering Business Networks and Advocacy</h3>
            <p>Chambers of commerce, like the Zimbabwe National Chamber of Commerce (ZNCC), are membership-based organizations that serve as advocates for the interests of their members and promote trade within their respective regions and beyond. They act as vital hubs for business networking, connecting businesses with potential partners, customers, and suppliers. They organize networking events, workshops, and seminars, providing opportunities for businesses to build relationships and exchange information. Chambers of commerce also play a crucial role in providing training and workshops on various aspects of international trade, including import and export procedures, customs regulations, and market entry strategies. They serve as valuable sources of information on trade regulations, market conditions, and business opportunities. Furthermore, chambers of commerce often provide document certification services, authenticating documents used in international trade, such as certificates of origin. By advocating for business-friendly policies and providing essential resources and support, chambers of commerce contribute to a thriving international trade environment.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldAlert size={20} /> Export Credit Agencies (ECAs): Mitigating Risks and Enabling Export Financing</h3>
            <p>Export credit agencies (ECAs) are government or semi-government institutions that play a vital role in mitigating the risks associated with international trade, particularly for exporters. They provide a range of financial products and services, including export credit insurance, which protects exporters against the risk of non-payment by foreign buyers. This insurance provides exporters with peace of mind, enabling them to confidently extend credit to overseas customers. ECAs also offer loan guarantees and direct loans to finance export transactions, providing exporters with access to capital that they may not be able to obtain from commercial banks. By providing these financial tools, ECAs encourage exporters to explore new markets and expand their global reach, contributing to economic growth and development. They are particularly valuable for small to medium sized businesses.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ScaleIcon size={20} /> International Trade Organizations (WTO): Setting the Rules of Global Commerce</h3>
            <p>International trade organizations, such as the World Trade Organization (WTO), play a fundamental role in setting the rules and regulations that govern international trade. The WTO, in particular, works to reduce trade barriers, such as tariffs and quotas, and promote free and fair trade among its member countries. It provides a forum for negotiating trade agreements, resolving trade disputes, and monitoring compliance with trade rules. By establishing a stable and predictable framework for international trade, the WTO fosters economic growth and development. The information that the WTO releases regarding trade between nations is invaluable.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TruckIcon3 size={20} /> Freight Forwarders and Logistics Providers: Orchestrating the Physical Movement of Goods</h3>
            <p>While not strictly promotional, freight forwarders and logistics providers are indispensable partners in international purchasing. These companies specialize in the physical movement of goods across borders, handling all aspects of transportation, customs clearance, and warehousing. They arrange transportation by sea, air, road, or rail, selecting the most efficient and cost-effective routes. They handle customs documentation and clearance procedures, ensuring compliance with import and export regulations. They also provide warehousing and distribution services, managing inventory and delivering goods to their final destinations. By providing expertise in international logistics and supply chain management, freight forwarders and logistics providers enable businesses to focus on their core competencies, while ensuring that their goods are delivered safely and efficiently.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Customs Authorities: Enforcing Regulations and Facilitating Trade</h3>
            <p>Customs authorities in each country are responsible for regulating the import and export of goods, enforcing trade regulations, and collecting customs duties and taxes. They play a crucial role in ensuring compliance with import and export requirements, protecting national security, and preventing illicit trade. While their primary role is regulatory, customs authorities also provide valuable information and guidance to businesses on import and export procedures. They publish guidelines and regulations, conduct training workshops, and provide online resources. By facilitating compliance and ensuring a level playing field for all traders, customs authorities contribute to a smooth and efficient international trade environment.</p>
          </div>
        </section>

        {/* ========== SECTION 2: ROLE OF INSTITUTIONS IN INTERNATIONAL TRADE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Role of Institutions in International Trade</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Institutions play a pivotal and multifaceted role in promoting international purchasing, acting as essential catalysts that enable businesses to navigate the complexities of global trade. They provide a framework of support, resources, and expertise, bridging the gap between domestic businesses and the vast opportunities of the international marketplace. Without the guidance and assistance offered by these institutions, many businesses, particularly small and medium-sized enterprises (SMEs), would find it exceedingly difficult to engage in international purchasing effectively. These institutions create a stable and predictable environment for global transactions, reducing risks and fostering trust among trading partners.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Facilitating Financial Transactions and Mitigating Risks</h3>
            <p>One of the most crucial roles of institutions in promoting international purchasing is to facilitate financial transactions and mitigate the inherent risks associated with cross-border trade. Commercial banks, for instance, are indispensable in providing trade finance solutions, such as letters of credit and documentary collections, which ensure secure and reliable payment mechanisms. They also offer foreign exchange services, enabling businesses to manage currency fluctuations and minimize financial losses. Export credit agencies, on the other hand, provide insurance and guarantees that protect exporters against the risks of non-payment or political instability in foreign markets. These financial tools provide businesses with the confidence to engage in international purchasing, knowing that their financial interests are safeguarded. By providing these services, they reduce the barrier of entry for many companies.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Providing Market Intelligence and Networking Opportunities</h3>
            <p>Institutions also play a vital role in providing businesses with crucial market intelligence and networking opportunities. Trade promotion organizations and chambers of commerce conduct extensive market research, providing businesses with valuable insights into potential overseas markets, including demand trends, competitor analysis, and regulatory landscapes. They organize trade missions and exhibitions, creating platforms for businesses to connect with potential international partners and buyers. These events facilitate networking and relationship-building, which are essential for successful international purchasing. By providing access to market information and networking opportunities, these institutions empower businesses to make informed decisions and expand their global reach.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpenCheck size={20} /> Offering Training and Advisory Services</h3>
            <p>To equip businesses with the necessary knowledge and skills for international purchasing, institutions offer a wide range of training and advisory services. Trade promotion organizations and chambers of commerce conduct workshops and seminars on topics such as export procedures, documentation requirements, customs regulations, and international marketing strategies. They also provide personalized advisory services, helping businesses to address specific challenges and navigate the complexities of international trade. By providing training and advisory services, these institutions enhance the capacity of businesses to engage in international purchasing effectively and sustainably.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ScaleIcon size={20} /> Setting Standards and Regulating Trade</h3>
            <p>International trade organizations, such as the World Trade Organization (WTO), play a fundamental role in setting the rules and regulations that govern international trade. They work to reduce trade barriers, promote fair competition, and resolve trade disputes. By establishing a stable and predictable framework for international trade, these institutions create a level playing field for businesses and foster a conducive environment for international purchasing. Customs authorities, while primarily regulatory, also play a vital role in facilitating trade by ensuring compliance with import and export regulations. They provide guidance on customs procedures and documentation requirements, helping businesses to navigate the complexities of cross-border trade.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TruckIcon3 size={20} /> Facilitating Logistics and Supply Chain Management</h3>
            <p>While not strictly regulatory or promotional, freight forwarders and logistics providers are essential institutions in the international purchasing process. They handle the physical movement of goods across borders, managing transportation, customs clearance, and warehousing. Their expertise in logistics and supply chain management ensures that goods are delivered efficiently and cost-effectively, minimizing delays and disruptions. By providing these services, they enable businesses to focus on their core competencies, while ensuring the smooth flow of goods in the global supply chain. They often have expertise in many countries, and can help navigate the rules of each.</p>
          </div>
        </section>

        {/* ========== SECTION 3: ROLE OF GOVERNMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Role Of Government In International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Governments play a pivotal role in fostering a conducive environment for international purchasing, and this is often spearheaded by ministries such as the Ministry of Industry and Trade. These governmental bodies act as strategic drivers, implementing policies and initiatives that stimulate global trade and empower domestic businesses to engage effectively in international sourcing. Their involvement is multifaceted, encompassing policy formulation, regulatory oversight, and direct support programs. By creating a stable and predictable trade environment, governments aim to enhance the competitiveness of their domestic industries and facilitate access to essential resources and markets.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon size={20} /> Policy Formulation and Trade Agreement Negotiations</h3>
            <p>Ministries of Industry and Trade are instrumental in formulating national trade policies that shape the landscape of international purchasing. They conduct in-depth analyses of global market trends, identify strategic sectors for growth, and develop policies that promote export diversification and import optimization. This includes negotiating and implementing bilateral and multilateral trade agreements, such as free trade agreements (FTAs), which reduce or eliminate tariffs and other trade barriers. These agreements provide businesses with preferential access to foreign markets and facilitate the sourcing of goods and services at competitive prices. By actively participating in international trade negotiations, governments aim to create a level playing field for their domestic businesses and promote fair trade practices. These agreements can have a large effect on the cost of imported goods.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Regulatory Oversight and Trade Facilitation</h3>
            <p>Governments are responsible for establishing and enforcing trade regulations that ensure the integrity and security of international transactions. Ministries of Industry and Trade play a crucial role in streamlining customs procedures, simplifying documentation requirements, and implementing efficient border management systems. They work to reduce bureaucratic hurdles and minimize trade transaction costs, making it easier for businesses to engage in international purchasing. They also implement quality control measures and safety standards to protect consumers from substandard or hazardous imported goods. By providing regulatory clarity and facilitating trade flows, governments create a predictable and transparent environment for international purchasing.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Direct Support Programs and Export Promotion</h3>
            <p>Ministries of Industry and Trade often implement direct support programs to assist businesses in their international purchasing endeavours. These programs may include export financing schemes, trade promotion missions, and market research grants. They provide businesses with access to information on potential suppliers, market trends, and regulatory requirements. They also organize trade fairs and exhibitions, creating platforms for businesses to network with international partners and showcase their products. Furthermore, governments may offer training and advisory services on international trade procedures, documentation requirements, and cultural nuances of international business. By providing these direct support programs, governments aim to enhance the capacity of domestic businesses to engage in international purchasing effectively and sustainably. These programs can also help smaller businesses compete on a global scale.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Investment Promotion and Infrastructure Development</h3>
            <p>Governments recognize that investment promotion and infrastructure development are critical enablers of international purchasing. Ministries of Industry and Trade work to attract foreign direct investment (FDI) in strategic sectors, which can enhance domestic production capacity and facilitate access to global supply chains. They also invest in infrastructure development, such as ports, airports, and transportation networks, to improve connectivity and reduce logistics costs. By creating a favourable investment climate and investing in infrastructure, governments aim to enhance the competitiveness of their domestic industries and facilitate the smooth flow of goods and services across borders. Efficient infrastructure is essential for efficient international purchasing.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> Addressing Trade Disputes and Protecting National Interests</h3>
            <p>Governments play a crucial role in addressing trade disputes and protecting national interests in the context of international purchasing. Ministries of Industry and Trade represent their countries in international trade forums and negotiations, advocating for fair trade practices and protecting domestic industries from unfair competition. They also implement trade remedies, such as anti-dumping duties and countervailing measures, to address unfair trade practices by foreign suppliers. By actively engaging in trade dispute resolution and implementing trade remedies, governments aim to ensure a level playing field for their domestic businesses and protect their economic interests. They also work to make sure that international trade agreements are followed.</p>
          </div>
        </section>

        {/* ========== SECTION 4: ROLES OF REGIONAL ECONOMIC BLOCS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Roles of Regional economic Blocs in International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Regional economic blocs, such as the Southern African Development Community (SADC) and the Common Market for Eastern and Southern Africa (COMESA), play a significant role in shaping the landscape of international purchasing within their member states. These blocs are designed to foster economic integration, promote trade liberalization, and enhance regional competitiveness. They achieve this through a variety of mechanisms, including the reduction of trade barriers, the harmonization of regulations, and the facilitation of cross-border cooperation. Their influence on international purchasing is profound, creating opportunities for businesses to expand their sourcing options, reduce costs, and access new markets within the region.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowRightCircle size={20} /> Reducing Trade Barriers and Promoting Intra-Regional Trade</h3>
            <p>One of the primary roles of regional blocs in international purchasing is to reduce trade barriers among member states. This is achieved through the implementation of free trade areas (FTAs), customs unions, or common markets. These agreements eliminate or reduce tariffs, quotas, and other trade restrictions, making it more cost effective for businesses to source goods and services from within the region. By promoting intra-regional trade, these blocs encourage businesses to diversify their supplier base and reduce their reliance on extra-regional sources. This can lead to increased competition, lower prices, and improved access to essential inputs. The reduction of trade barriers also simplifies customs procedures and documentation requirements, streamlining the import process and reducing transaction costs.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Harmonizing Regulations and Standards</h3>
            <p>Regional blocs also play a crucial role in harmonizing regulations and standards among member states. This involves aligning technical standards, sanitary and phytosanitary measures, and other regulatory frameworks to facilitate the movement of goods and services across borders. By harmonizing regulations, these blocs reduce technical barriers to trade and create a more predictable and transparent business environment. This makes it easier for businesses to comply with regulatory requirements and reduces the risk of encountering non-tariff barriers. The harmonization of standards also promotes product quality and safety, enhancing consumer confidence and fostering regional integration.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Network size={20} /> Facilitating Cross-Border Cooperation and Infrastructure Development</h3>
            <p>Regional blocs actively promote cross-border cooperation and infrastructure development to enhance regional connectivity and facilitate trade flows. This includes investing in transportation infrastructure, such as roads, railways, and ports, to improve the movement of goods and people. They also support the development of regional payment systems and trade facilitation mechanisms to streamline cross border transactions. Furthermore, regional blocs encourage cooperation in areas such as customs administration, border management, and trade facilitation, to reduce bottlenecks and improve the efficiency of trade corridors. By fostering cross border cooperation and investing in infrastructure, these blocs create a more integrated and efficient regional market, making it easier for businesses to engage in international purchasing within the region.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Promoting Investment and Industrial Development</h3>
            <p>Regional blocs play a significant role in attracting investment and promoting industrial development within their member states. They create a favourable investment climate by offering incentives, such as tax breaks and investment guarantees, to attract foreign direct investment (FDI). They also support the development of regional value chains and industrial clusters, encouraging businesses to collaborate and integrate their production processes. By promoting investment and industrial development, these blocs enhance the productive capacity of their member states and create opportunities for businesses to source goods and services from within the region.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Enhancing Regional Competitiveness and Market Access</h3>
            <p>Ultimately, the goal of regional blocs is to enhance the competitiveness of their member states and improve their access to global markets. By reducing trade barriers, harmonizing regulations, and facilitating cross-border cooperation, these blocs create a larger and more integrated regional market. This enables businesses to achieve economies of scale, improve their efficiency, and enhance their competitiveness. Furthermore, regional blocs often negotiate trade agreements with other countries and regions, providing their member states with preferential access to external markets. By enhancing regional competitiveness and market access, these blocs contribute to economic growth and development within their member states. They also help to give the region a larger voice on the world stage.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 6 — Roles of Institutions in Promoting International Purchase</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commercial Banks</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trade Promotion</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Chambers of Commerce</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">ECAs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">WTO</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Government</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Regional Blocs</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master International Trade Institutions. 🏛️🌍</p>
        </footer>

      </div>
    </div>
  );
};
