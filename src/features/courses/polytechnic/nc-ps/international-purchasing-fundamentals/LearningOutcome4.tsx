import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon,
  MessageCircle, Globe, Currency, Truck as TruckIcon2, CheckSquare, Gavel, Lock, Leaf, Heart,
  Droplet, Flame, Zap as ZapIcon, Factory as FactoryIcon, ShoppingCart, Award, FileText as FileTextIcon, CreditCard, Shield as ShieldIcon, RefreshCw, Save,
  Flame as FlameIcon, Droplet as DropletIcon, Wheat, Coffee, Beef, Banknote, FileCode
} from 'lucide-react';

export const LearningOutcome4: React.FC = () => {
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              The Foundation of <span className="text-amber-300 font-bold italic">Global Commerce</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to commodity markets, energy, metals, agriculture, financing arrangements, ethical issues, and transport mode selection in international purchasing.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">global_commerce.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">EXPLORE</span><span className="text-white">Commodity_Markets;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">FINANCE</span><span className="text-white">Purchases;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">ETHICALLY</span><span className="text-white">Source;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><GlobeIcon className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Banknote className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: THE FOUNDATION OF GLOBAL COMMERCE ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Foundation of Global Commerce</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Commodity markets serve as the bedrock of global commerce, functioning as dynamic platforms where raw materials, the essential building blocks of our economies, are bought and sold. These markets are not mere abstract concepts; they are tangible arenas, often digitized in modern times, where the fundamental forces of supply and demand collide, determining the prices of resources that underpin countless industries. From the fuel that powers our vehicles and factories to the metals that form the infrastructure of our cities and the agricultural products that nourish our populations, commodities are the lifeblood of economic activity. The intricate dance of buyers and sellers within these markets reflects the complex interplay of factors ranging from geopolitical tensions and weather patterns to technological advancements and shifts in consumer preferences. Understanding the nuances of commodity markets is crucial for businesses, investors, and policymakers alike, as they provide valuable insights into the health of the global economy and offer opportunities for both risk management and profit generation.</p>
          </div>
        </section>

        {/* ========== SECTION 2: ENERGY MARKETS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Energy Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The energy sector within commodity markets is undeniably one of the most critical, encompassing a range of resources that power our industrial world and fuel our daily lives. At the heart of this sector lies crude oil, a resource whose price fluctuations send ripples across global economies. Benchmarks like West Texas Intermediate (WTI) and Brent crude serve as indicators of global oil supply and demand, influenced by factors such as geopolitical stability in oil-producing regions, advancements in extraction technologies, and the ever-evolving landscape of renewable energy sources. Natural gas, another vital energy commodity, plays a crucial role in electricity generation and heating, with its price often tied to seasonal demand and regional supply dynamics. Heating oil and gasoline, refined products derived from crude oil, are essential for transportation and heating, their prices reflecting both the cost of crude and the efficiency of refining processes. The energy market is characterized by its volatility, driven by a complex web of factors that make it both a source of opportunity and a source of risk for market participants. The importance of this market is only growing as global energy needs increase.</p>
          </div>
        </section>

        {/* ========== SECTION 3: METALS MARKETS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Metals Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The metals sector of commodity markets is a diverse and essential component of the global economy, providing the materials that form the backbone of industry and infrastructure. This sector is broadly divided into precious metals and industrial metals, each playing a distinct role in commerce. Precious metals, such as gold, silver, platinum, and palladium, are often viewed as safe-haven assets, their prices rising during times of economic uncertainty. They also find extensive use in jewellery, electronics, and catalytic converters. Industrial metals, including copper, aluminium, zinc, and lead, are indispensable for manufacturing, construction, and infrastructure development. Copper, for example, is a critical component of electrical wiring and plumbing, while aluminium is widely used in transportation and packaging. The demand for industrial metals is closely tied to economic growth, with rising demand often signalling increased industrial activity. The London Metal Exchange (LME) is a key hub for trading industrial metals, providing a global benchmark for prices and a platform for hedging price risk.</p>
          </div>
        </section>

        {/* ========== SECTION 4: AGRICULTURAL MARKETS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Agricultural Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The agricultural sector of commodity markets is a fundamental pillar of global food security, encompassing a wide range of products that feed the world's population and drive significant economic activity. This sector is broadly categorized into grains, softs, and livestock. Grains, such as wheat, corn, soybeans, and rice, are staple foods for billions of people, their prices influenced by factors such as weather patterns, planting and harvesting cycles, and global demand. Softs, including coffee, cocoa, sugar, and cotton, are agricultural products that are processed into consumer goods. Coffee and cocoa, for example, are essential ingredients in beverages and confectionery, while sugar and cotton are used in food and textile industries. Livestock, including cattle, hogs, and pork bellies, are traded on markets that reflect the demand for meat products. The Chicago Mercantile Exchange (CME) is a major hub for trading agricultural commodities, providing a platform for price discovery and hedging. The agriculture market is heavily influenced by weather, and disease, which can cause large swings in supply.</p>
          </div>
        </section>

        {/* ========== SECTION 5: LIVESTOCK AND MEAT MARKETS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Livestock and Meat Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The livestock and meat market is a specialized sector within agricultural commodities, focusing on the trade of animals and animal products used for food. This market is critical for ensuring a stable protein supply for global populations, with cattle, hogs, and poultry being the primary commodities traded. The prices of these commodities are influenced by factors such as feed costs, weather conditions, and consumer demand. The livestock and meat market is characterized by its complexity, involving a network of producers, processors, and distributors. The demand for meat products is closely tied to economic growth and changing dietary preferences, with rising incomes often leading to increased consumption of meat. The market is also subject to regulatory oversight, with food safety and animal welfare being key considerations.</p>
          </div>
        </section>

        {/* ========== SECTION 6: FINANCING ARRANGEMENT USED IN INTERNATIONAL PURCHASING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Financing Arrangement Used In International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Letters of Credit (LCs)</h3>
            <p>A letter of credit (LC) stands as a cornerstone of secure international trade, acting as a financial safeguard for both buyers and sellers. In essence, an LC is a document issued by a bank, acting on behalf of the buyer, that guarantees payment to the seller, provided that the seller adheres meticulously to the terms and conditions outlined in the LC. This instrument is particularly vital in cross-border transactions where the buyer and seller may lack established trust or have limited knowledge of each other's creditworthiness. The LC effectively substitutes the buyer's creditworthiness with that of the issuing bank, significantly reducing the seller's risk of non-payment. There are various types of LCs, each tailored to specific needs. An irrevocable LC, for example, cannot be altered or cancelled without the explicit consent of all parties involved, offering maximum security. A standby LC, on the other hand, acts as a guarantee of performance, ensuring that the seller will be compensated if the buyer fails to fulfil their contractual obligations. While LCs offer a high degree of security, they can be complex and costly, requiring meticulous documentation and adherence to strict procedures. The cost of an LC is based on the risk that the issuing bank is taking.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Documentary Collections</h3>
            <p>Documentary collections offer a more streamlined and cost-effective alternative to LCs, facilitating the exchange of documents and payment between buyers and sellers through banking intermediaries. In this arrangement, the seller sends the shipping documents to their bank, which then forwards them to the buyer's bank. The buyer's bank releases the documents to the buyer only upon payment or acceptance of a draft, ensuring that the seller retains control of the goods until payment is secured. This method is less secure than LCs, as the seller ultimately relies on the buyer's willingness to pay. However, it is generally simpler and less expensive, making it a viable option for transactions where the buyer and seller have a degree of trust. There are two primary types of documentary collections: documents against payment (D/P), where the buyer must pay before receiving the documents, and documents against acceptance (D/A), where the buyer accepts a draft, promising to pay at a later date. D/A collections offer greater flexibility for the buyer but expose the seller to increased risk.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Open Account</h3>
            <p>An open account arrangement represents a high level of trust between buyer and seller, allowing the buyer to pay for goods at a later date, typically after they have been shipped and received. This method is commonly used when the buyer and seller have a long-standing relationship and a proven track record of timely payments. It offers significant flexibility and convenience for the buyer, who can manage their cash flow more effectively. However, it exposes the seller to the risk of non-payment, particularly in volatile economic or political environments. To mitigate this risk, sellers may opt for credit insurance, which provides coverage against losses due to non-payment. Open accounts are generally reserved for buyers with strong credit ratings and a history of reliable payments.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Advance Payment</h3>
            <p>Advance payment, also known as prepayment, represents the most secure financing method for the seller, as the buyer pays for the goods before they are shipped. This method is typically used when the seller has a strong bargaining position, such as when dealing with custom-made goods, high-demand products, or in situations where the buyer's creditworthiness is uncertain. While advance payment offers maximum security for the seller, it exposes the buyer to the risk of non-delivery or substandard goods. Therefore, it is generally not favoured by buyers and is typically used only when necessary.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Banknote size={20} /> Forfaiting</h3>
            <p>Forfaiting is a specialized financing technique that allows exporters to convert their trade receivables, such as promissory notes or bills of exchange, into immediate cash flow. This method involves the purchase of these receivables by a forfeiter at a discounted price, with the forfeiter assuming the risk of non-payment by the buyer. Forfaiting is often used for medium- to long-term transactions, particularly in the export of high-value capital goods. It provides exporters with a non-recourse financing solution, meaning that they are not liable if the buyer defaults. This method helps exporters improve their cash flow and mitigate the risk of non-payment, enabling them to expand their international sales.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Export Credit Agencies (ECAs)</h3>
            <p>Export credit agencies (ECAs) play a crucial role in promoting international trade by providing financing and insurance to support exports. These government or quasi government organizations offer a range of products, including export credit insurance, loan guarantees, and direct loans, to help exporters mitigate risks and access financing. ECAs aim to level the playing field for exporters, particularly small and medium-sized enterprises (SMEs), by providing them with access to financing that they may not be able to obtain from commercial banks. They also help to mitigate political and commercial risks associated with international trade, encouraging exporters to explore new markets and expand their global reach.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Supply Chain Finance</h3>
            <p>Supply chain finance encompasses a range of techniques that optimize working capital and improve cash flow for both buyers and sellers within a supply chain. These methods include reverse factoring, where the buyer arranges financing for its suppliers, and dynamic discounting, where the buyer offers early payment discounts to suppliers. Supply chain finance solutions can help to strengthen supplier relationships by providing them with access to financing and improving their cash flow. They can also help buyers optimize their working capital and reduce their financing costs. By fostering collaboration and efficiency within the supply chain, these techniques contribute to a more resilient and sustainable global trade ecosystem.</p>
          </div>
        </section>

        {/* ========== SECTION 7: ADHERING TO ETHICAL ISSUES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Adhering To Ethical Issues In International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Adhering to ethical issues in international purchasing is not just a matter of compliance; it's a fundamental responsibility that businesses must uphold to ensure sustainable and responsible global operations. Ethical considerations in international purchasing extend beyond legal requirements, encompassing a broad spectrum of issues related to human rights, labour practices, environmental sustainability, and fair trade. Businesses engaging in international purchasing must be vigilant in identifying and mitigating ethical risks throughout their supply chains, fostering a culture of integrity and accountability.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Labour Practices and Human Rights: Ensuring Fair Treatment and Safe Working Conditions</h3>
            <p>One of the most critical ethical considerations in international purchasing is ensuring fair labour practices and respecting human rights throughout the supply chain. This involves ensuring that suppliers adhere to international labour standards, such as those set by the International Labour Organization (ILO), which prohibit forced labour, child labour, and discrimination. Businesses must conduct thorough due diligence to ensure that their suppliers provide safe working conditions, pay fair wages, and respect workers' rights to freedom of association and collective bargaining. Regular audits, on-site inspections, and worker interviews can help to identify and address any labour violations. Businesses should also establish clear codes of conduct for suppliers and provide training on ethical labour practices. Promoting transparency and traceability in the supply chain can help to ensure that workers are treated fairly and with dignity.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Environmental Sustainability: Minimizing the Environmental Impact of Global Sourcing</h3>
            <p>Environmental sustainability is another critical ethical consideration in international purchasing. Businesses must strive to minimize the environmental impact of their sourcing activities, ensuring that suppliers adhere to environmental regulations and promote sustainable practices. This involves reducing greenhouse gas emissions, conserving natural resources, and minimizing waste and pollution. Businesses should prioritize suppliers that have implemented environmental management systems, such as ISO 14001, and that are committed to reducing their environmental footprint. Promoting the use of sustainable materials, reducing packaging waste, and supporting initiatives that promote environmental conservation are also essential. Businesses also need to be aware of how the transportation of goods effects the environment.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Fair Trade Practices: Promoting Equitable and Sustainable Trade Relationships</h3>
            <p>Fair trade practices are essential for promoting equitable and sustainable trade relationships with suppliers, particularly in developing countries. This involves ensuring that suppliers receive fair prices for their goods, that they have access to fair credit and financing, and that they are treated with respect and dignity. Businesses should prioritize suppliers that are committed to fair trade principles, such as those promoted by Fairtrade International, and that invest in the social and economic development of their communities. Supporting initiatives that promote fair trade and sustainable development can help to create a more equitable and just global trade system. Fair trade is very important to ensure that smaller companies are able to compete.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Anti-Corruption and Transparency: Upholding Integrity in Business Transactions</h3>
            <p>Anti-corruption and transparency are essential for upholding integrity in international purchasing transactions. Businesses must have robust anti-corruption policies and procedures in place to prevent bribery, fraud, and other forms of corruption. This involves conducting thorough due diligence on suppliers, implementing clear financial controls, and providing training on anti-corruption laws and regulations. Businesses should also promote transparency in their supply chains, disclosing information about their sourcing practices and supplier relationships. Implementing whistleblowing mechanisms and encouraging employees to report any suspected corruption can help to prevent and detect unethical behaviour.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Conflict Minerals and Responsible Sourcing: Avoiding Funding of Armed Conflicts</h3>
            <p>The sourcing of conflict minerals, such as tin, tantalum, tungsten, and gold, from conflict-affected areas is a significant ethical concern. Businesses must take steps to ensure that their supply chains are free from conflict minerals, avoiding the funding of armed conflicts and human rights abuses. This involves conducting due diligence on suppliers, implementing traceability systems, and supporting initiatives that promote responsible sourcing of minerals. Businesses should also adhere to relevant regulations, such as the Dodd-Frank Act in the United States, which requires companies to disclose their use of conflict minerals.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersRound size={20} /> Stakeholder Engagement and Collaboration: Building Trust and Fostering Dialogue</h3>
            <p>Engaging with stakeholders, including suppliers, workers, communities, and non governmental organizations (NGOs), is essential for building trust and fostering dialogue on ethical issues. Businesses should establish mechanisms for stakeholder engagement, such as supplier forums, community meetings, and multi-stakeholder initiatives. Collaborating with NGOs and industry associations can help to develop and implement best practices for ethical sourcing. Promoting transparency and accountability in stakeholder engagement can help to build trust and ensure that ethical concerns are addressed effectively.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Continuous Improvement and Accountability: Embedding Ethical Practices into Business Operations</h3>
            <p>Embedding ethical practices into business operations requires a commitment to continuous improvement and accountability. Businesses should establish clear ethical standards, develop training programs for employees, and implement performance metrics to track progress. Regular reviews and audits of ethical performance can help to identify areas for improvement. Businesses should also establish mechanisms for reporting and addressing ethical violations, ensuring that there is accountability for unethical behaviour. Promoting a culture of ethics and integrity throughout the organization is essential for ensuring that ethical considerations are integrated into all aspects of international purchasing.</p>
          </div>
        </section>

        {/* ========== SECTION 8: FACTORS INFLUENCING MODE OF TRANSPORT SELECTION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Factors Influencing Mode of Transport Selection</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Selecting a suitable international mode of transport is a critical decision in international purchasing, directly impacting cost, delivery time, product integrity, and overall supply chain efficiency. This decision requires a thorough evaluation of various factors to ensure the chosen mode aligns with the specific needs of the shipment and the business.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost Considerations: Balancing Expenses with Efficiency</h3>
            <p>Cost is a fundamental factor in selecting an international mode of transport. This extends beyond the base freight rate to encompass a range of associated expenses, including insurance premiums, customs duties, handling charges, and potential storage fees. Sea freight, for instance, is generally the most cost-effective option for large volumes of goods transported over long distances. However, the potential for longer transit times and associated inventory holding costs must be weighed against the lower freight rates. Conversely, air freight, while significantly more expensive, offers rapid transit times, reducing inventory holding costs and minimizing the risk of product obsolescence. Businesses must conduct a comprehensive cost-benefit analysis, considering all relevant expenses, to determine the most economically viable transport mode. The total cost of ownership must be calculated.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClockIcon size={20} /> Delivery Time and Urgency: Meeting Customer Expectations</h3>
            <p>The urgency of delivery is a critical determinant in selecting the appropriate transport mode. Air freight is the clear choice for time sensitive shipments, such as perishable goods, high-value electronics, or emergency supplies. Sea freight, with its longer transit times, is more suitable for non-urgent shipments or bulk commodities. Road and rail transport offer intermediate transit times, making them viable options for regional or continental shipments. Businesses must carefully assess customer expectations and delivery deadlines to ensure the chosen mode of transport meets their requirements. The speed of the selected shipping method must match the products shelf life, if applicable.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Type and Nature of Goods: Tailoring Transport to Product Characteristics</h3>
            <p>The physical characteristics of the goods being transported play a significant role in determining the appropriate transport mode. Heavy, bulky, or hazardous goods may necessitate specialized transport, such as sea freight or rail transport, which can accommodate large volumes and handle hazardous materials safely. Fragile or high-value goods, on the other hand, may require the speed and security of air freight. Perishable goods, such as food or pharmaceuticals, require temperature-controlled transport, which can be provided by refrigerated containers on ships or specialized air freight services. The nature of the goods also influences packaging requirements, which can further impact transport costs.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Distance and Destination: Considering Geographical Factors</h3>
            <p>The distance and geographical location of the destination are essential considerations. Sea freight is ideal for long-distance shipments across oceans, while road and rail transport are more suitable for shorter distances within continents. Air freight can be used for any distance, but it is most cost-effective for long-distance shipments of high-value or time-sensitive goods. The infrastructure of the destination country, including port facilities, road networks, and rail systems, also plays a crucial role in determining the feasibility and efficiency of different transport modes. Some areas of the world have very poor infrastructure, that limits shipping options.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Reliability and Security: Minimizing Risks and Ensuring Product Integrity</h3>
            <p>The reliability and security of the transport mode are paramount for ensuring that goods arrive on time and in good condition. Air freight generally offers high reliability and security, with lower rates of damage or loss compared to other modes. Sea freight, while generally reliable, may be more susceptible to delays due to weather conditions or port congestion. Road and rail transport can vary in reliability depending on the infrastructure and conditions of the route. Insurance coverage is essential for mitigating the risk of loss or damage during transit. Also, certain areas of the world have higher risk of piracy, which must be considered.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Environmental Impact: Considering Sustainability</h3>
            <p>Increasingly, businesses are considering the environmental impact of their transport choices. Sea freight generally has a lower carbon footprint per unit of cargo compared to air freight, making it a more environmentally friendly option for large-volume shipments. Rail transport can also be a more sustainable option than road transport, particularly for long distances. Businesses are seeking to reduce their carbon footprint, and customers are increasingly demanding environmentally friendly shipping options.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Regulatory Compliance: Adhering to International Standards</h3>
            <p>International transport is subject to a complex web of regulations, including customs regulations, safety standards, and environmental regulations. Businesses must ensure that the chosen mode of transport complies with all applicable regulations in both the exporting and importing countries. This includes adhering to hazardous materials regulations, obtaining necessary permits and licenses, and complying with customs clearance procedures. Failure to comply with regulations can result in delays, penalties, or even confiscation of goods.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — The Foundation of Global Commerce</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Commodity Markets</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Energy & Metals</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agriculture</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Financing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ethics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transport Modes</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Global Commerce. 🌍📊</p>
        </footer>

      </div>
    </div>
  );
};
