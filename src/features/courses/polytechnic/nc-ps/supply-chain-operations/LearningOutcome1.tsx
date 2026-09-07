import React from 'react';
import {
  FolderTree,
  FileText,
  Database,
  Eye,
  Users,
  Tag,Megaphone,
  Target,
  RefreshCw,
  DollarSign,
  Heart,
  Recycle,
  Trash2,
  Truck,
  Gavel,
  Shield,
  TrendingUp,
  CheckCircle,
  FilePlus,
  FileCheck,
  UserCheck,
  PenTool,
  Link,
  GlobeIcon,
  Building,
  Briefcase,
  ListChecks,
  ClipboardList,
  AlertTriangle,
  Calendar,
  Clock,
  Package,
  Box,
  Warehouse,
  Factory,
  ArrowRightCircle,
  Handshake,
  Star,
  Search,
  Hash,
  MapPin,
  Wrench,
  CalendarDays,
  PackageOpen,
  Boxes,
  HardHat,
  Leaf,
  FileText as FileTextIcon,
  Printer,
  QrCode,
  BarChart4,
  UsersRound,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  Timer,
  TruckIcon,
  PackageCheck,
  PackageX,
  Clipboard,
  FileSignature,
  User,
  Building as BuildingIcon,
  Briefcase as BriefcaseIcon,
  Layers,
  Zap,
  Clock as ClockIcon,
  AlertOctagon,
  Bell,
  Flame,
  Droplet,
    Biohazard,
  ShieldCheck,
  Gauge,
  Network,
  GitBranch,
  Cpu,
  ChartNoAxesCombined,
  ChartColumn,
  PieChart,
  LineChart,
  Activity,
  Rocket,
  Anchor,
  Scale,
  Coins,
  Landmark,
  Banknote,
  PiggyBank,
  BriefcaseBusiness,
  Globe,
  Ship,
  Plane,
  Train,
  Car,
  Bus,
  Bike,
  Footprints,
  BarChart3,
  ChartLine,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Equal,
  Sigma,
  Percent,
  CircleDollarSign,
  HandCoins,
  Receipt,
  FileSpreadsheet,
  FileMinus,
  FilePlus as FilePlusIcon2,
  FileEdit as FileEditIcon2,
  FileSearch as FileSearchIcon2,
  FileClock as FileClockIcon2,
  FileX as FileXIcon2,
  FileBadge as FileBadgeIcon2,
  FileKey as FileKeyIcon2,
  FileLock as FileLockIcon2
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
              Supply Chain Trends & <span className="text-emerald-300 font-bold italic">Value Chain</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to supply chain trends, microeconomic and macroeconomic factors, and the value chain concept with primary and secondary components.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">supply_chain_trends.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">TRENDS</span><span className="text-white">Supply_Chain;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">FACTORS</span><span className="text-white">Micro_Macro;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">VALUE</span><span className="text-white">Chain;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Network className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Factory className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: SUPPLY CHAIN TRENDS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supply Chain Trends</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Supply Chain Agility</h3>
            <p>Supply chain agility refers to the ability of a supply chain to respond quickly and effectively to changes in demand, supply, or market conditions. This involves being flexible and adaptable, allowing businesses to adjust their operations in real-time. A truly agile supply chain can handle unexpected disruptions, such as sudden increases in customer orders, shortages of raw materials, or shifts in consumer preferences.</p>
            <p className="mt-2">To achieve agility, companies invest in technologies and processes that enable them to react rapidly. This might include using real-time data analytics to monitor demand and adjust production schedules, implementing flexible manufacturing systems that can quickly switch between product lines, or establishing strong relationships with suppliers who can provide materials on short notice. Essentially, it is about being prepared for the unexpected and having the capacity to pivot when necessary.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Supply Chain Visibility</h3>
            <p>Supply chain visibility is the ability to track and monitor the movement of goods, information, and finances throughout the entire supply chain, from the initial sourcing of raw materials to the final delivery of products to customers. This involves having access to real-time data and insights into every stage of the supply chain, allowing businesses to identify potential bottlenecks, delays, or disruptions.</p>
            <p className="mt-2">Enhanced visibility is achieved through technologies like IoT (Internet of Things) sensors, RFID (radio-frequency identification) tags, and cloud-based platforms. These tools provide a comprehensive view of the supply chain, enabling businesses to make informed decisions and proactively address issues. For instance, if a shipment is delayed, visibility tools can alert managers, allowing them to take corrective action and minimize the impact on customers.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Supply Chain Resilience</h3>
            <p>Supply chain resilience is the capacity of a supply chain to withstand and recover quickly from disruptions, such as natural disasters, pandemics, or geopolitical events. A resilient supply chain is designed to be robust and adaptable, allowing businesses to maintain operations and minimize downtime even in the face of significant challenges.</p>
            <p className="mt-2">Building resilience involves diversifying suppliers, creating contingency plans, and investing in risk management strategies. Companies might establish backup production facilities in different locations, maintain safety stock of critical materials, or develop alternative transportation routes. The focus is on anticipating potential risks and developing strategies to mitigate their impact, ensuring business continuity.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Digital Supply Chain</h3>
            <p>A digital supply chain leverages digital technologies to automate processes, improve communication, and enhance decision-making throughout the supply chain. This involves integrating various digital tools and platforms, such as cloud computing, artificial intelligence, and blockchain, to create a more efficient and connected supply chain.</p>
            <p className="mt-2">Digitalization enables businesses to gain real-time insights into their operations, automate manual tasks, and improve collaboration with suppliers and customers. For example, AI-powered demand forecasting can help companies anticipate future demand and optimize inventory levels, while blockchain technology can enhance transparency and traceability. The goal is to create a seamless and data-driven supply chain that can respond quickly to changing market conditions.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Supply Chain Planning</h3>
            <p>Supply chain planning is the process of forecasting demand, managing inventory, and coordinating production and distribution activities to ensure that products are available when and where customers need them. This involves developing strategies and plans to optimize the flow of materials and products throughout the supply chain.</p>
            <p className="mt-2">Effective supply chain planning requires accurate demand forecasting, which relies on historical data, market trends, and other relevant factors. Companies use planning tools and software to develop production schedules, manage inventory levels, and optimize transportation routes. The focus is on balancing supply and demand, minimizing costs, and ensuring that customer needs are met. This includes strategic planning for long term goals, and tactical planning for short term operational needs.</p>
          </div>
        </section>

        {/* ========== SECTION 2: MICROECONOMIC FACTORS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Microeconomic Factors Affecting the Supply Chain</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={20} /> Instability in Demand</h3>
            <p>Instability in demand refers to unpredictable and often rapid changes in consumer purchasing habits. These fluctuations can be caused by various factors, including seasonal trends, changes in consumer preferences, or sudden shifts in market sentiment. When demand is unstable, businesses struggle to accurately forecast their needs, leading to either overstocking or stockouts. This creates inefficiencies in the supply chain, as companies may have excess inventory that ties up capital or face shortages that result in lost sales and customer dissatisfaction.</p>
            <p className="mt-2">Current fluctuations are heavily influenced by the speed of information and social media trends. A viral product can suddenly create a massive, unexpected surge in demand, while negative publicity can just as quickly cause a drastic drop. This volatility forces companies to adopt more flexible and responsive supply chain strategies. Businesses must invest in real-time data analytics and agile production systems to quickly adjust to these demand swings.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Change in Labour Costs</h3>
            <p>Changes in labour costs significantly impact the supply chain, as labour is a key component of production and transportation. Increases in wages, driven by factors such as minimum wage laws, union negotiations, or labour shortages, can raise the overall cost of goods and services. When labour costs rise, businesses may choose to pass these costs on to consumers in the form of higher prices, or they may seek to reduce costs by automating processes or relocating production to areas with lower labour costs.</p>
            <p className="mt-2">Currently, labour shortages in many sectors are driving up wages, which in turn increases the cost of manufacturing and logistics. Additionally, rising energy prices and inflation are putting pressure on workers to demand higher wages to maintain their living standards. This creates a challenging environment for businesses, as they must balance the need to control costs with the need to attract and retain skilled workers.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Inflation Pressures</h3>
            <p>Inflation pressures refer to the sustained increase in the general price level of goods and services. Inflation can have a significant impact on the supply chain, as it increases the cost of raw materials, transportation, and labor.</p>
            <p className="mt-2">When inflation is high, businesses face higher input costs, which can lead to reduced profit margins or higher prices for consumers. Inflation can also create uncertainty and volatility in the market, making it difficult for businesses to plan and forecast demand.</p>
            <p className="mt-2">Current inflationary pressures are exacerbated by global supply chain disruptions, rising energy prices, and increased demand following pandemic related lockdowns. These factors have created a perfect storm, driving up the cost of everything from raw materials to finished goods. Companies are responding by diversifying their supplier base, increasing inventory levels, and investing in technologies that improve efficiency and reduce costs. They are also working to improve their demand forecasting to better anticipate future price increases.</p>
          </div>
        </section>

        {/* ========== SECTION 3: MACROECONOMIC FACTORS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Macroeconomic Factors Affecting the Supply Chain</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Inflation</h3>
            <p>Inflation is a sustained increase in the general price level of goods and services in an economy over a period of time. It reduces the purchasing power of money. In a supply chain context, inflation increases the cost of raw materials, transportation, energy, and labor. This can lead to higher production costs, which businesses may pass on to consumers through increased prices. High inflation can also create uncertainty, making it difficult for businesses to plan long-term investments and supply chain strategies. When inflation fluctuates rapidly, it becomes hard for businesses to predict the real cost of production and distribution, which can lead to miscalculations in pricing and inventory management.</p>
            <p className="mt-2">Furthermore, inflationary pressures can alter consumer demand. As prices rise, consumers may reduce their spending on non-essential goods, shifting demand patterns and creating additional challenges for supply chain managers. This shift in demand can cause ripple effects throughout the supply chain, leading to imbalances between supply and demand, and ultimately impacting profitability.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> Fiscal Policy</h3>
            <p>Fiscal policy refers to the government's use of spending and taxation to influence the economy. Government spending can stimulate demand, while taxation can dampen it. For example, increased government spending on infrastructure projects can boost demand for raw materials and construction equipment, impacting the supply chain of those industries. Conversely, higher taxes can reduce consumer spending, leading to lower demand for goods and services. Fiscal policy decisions, such as changes in tax rates or government spending, can create both opportunities and challenges for supply chain managers.</p>
            <p className="mt-2">When governments implement expansionary fiscal policies, such as increased spending or tax cuts, it can lead to higher demand and potential supply chain bottlenecks. Conversely, contractionary fiscal policies, such as reduced spending or increased taxes, can dampen demand and lead to excess inventory. Predictability in fiscal policy is very important for supply chain planning. Unexpected changes can disrupt planning and cause unneeded expenditure.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Employment Levels</h3>
            <p>Employment levels reflect the number of people employed in an economy. High employment levels generally indicate a strong economy with robust consumer spending. However, labour shortages can also occur during periods of high employment, leading to increased labour costs and potential disruptions in production and transportation. In a supply chain context, changes in employment levels can affect both the demand for goods and services and the availability of labour resources.</p>
            <p className="mt-2">When unemployment is low, consumer spending tends to be higher, leading to increased demand for goods and services. This puts pressure on supply chains to meet the increased demand. On the other hand, if unemployment is high, consumer spending may decrease, leading to lower demand and potential excess inventory. Additionally, the availability and cost of labour are directly affected by employment levels. Labour shortages can lead to delays in production and transportation, while an oversupply of labour may lead to lower wages but also potentially less skilled workers.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart4 size={20} /> National Income</h3>
            <p>National income, often measured by Gross Domestic Product (GDP), represents the total value of goods and services produced in an economy. Changes in national income reflect the overall health of the economy and can significantly impact consumer spending and business investment. A growing national income typically leads to increased demand for goods and services, while a declining national income can lead to reduced demand.</p>
            <p className="mt-2">Strong national income growth creates opportunities for businesses to expand their operations and increase their supply chain capacity. Conversely, a declining national income can lead to reduced demand, excess inventory, and financial challenges for businesses. Supply chain managers must closely monitor national income trends to anticipate changes in demand and adjust their operations accordingly. When a nation's GDP rises, it often signals an increase in consumer confidence and spending, which in turn drives demand for products.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe size={20} /> International Trade</h3>
            <p>International trade involves the exchange of goods and services between countries. It plays a crucial role in the global supply chain, as businesses often source raw materials, components, and finished goods from around the world. Changes in international trade policies, such as tariffs, trade agreements, or sanctions, can significantly impact the flow of goods and services across borders.</p>
            <p className="mt-2">Tariffs and trade barriers can increase the cost of imported goods, leading to higher prices for consumers and potential disruptions in supply chains. Trade agreements, on the other hand, can reduce trade barriers and facilitate the flow of goods and services, creating opportunities for businesses to expand their global reach. Geopolitical events, such as trade wars or political instability, can also disrupt international trade and create uncertainty for supply chain managers. Therefore, businesses must closely monitor international trade policies and geopolitical events to mitigate potential risks and capitalize on opportunities.</p>
          </div>
        </section>

        {/* ========== SECTION 4: VALUE CHAIN CONCEPT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Value Chain Concept</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The value chain is a business management concept that describes the full range of activities a firm performs to create value. These activities encompass everything from the initial sourcing of raw materials to the final delivery of products or services to customers. The goal of analysing a company's value chain is to identify areas where the company can create more value for customers and gain a competitive advantage. By understanding the interconnectedness of these activities, businesses can optimize their operations, reduce costs, and enhance customer satisfaction.</p>
            <p className="mt-2">The value chain is typically divided into primary activities, which are directly involved in the creation and delivery of the product or service, and support activities, which enable the primary activities to function effectively. By examining each stage of the value chain, businesses can identify opportunities for improvement and innovation.</p>
          </div>
        </section>

        {/* ========== SECTION 5: PRIMARY COMPONENTS OF VALUE CHAIN ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Primary Components of the Value Chain</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Inbound Logistics</h3>
            <p>Inbound logistics encompasses all the activities related to receiving, storing, and distributing raw materials or components needed for production. This stage focuses on the efficient management of the flow of resources from suppliers to the production facility. It involves activities like procurement, transportation, warehousing, and inventory management. The goal is to minimize costs and ensure that the necessary materials are available when needed.</p>
            <p className="mt-2">Effective inbound logistics can provide a competitive advantage by reducing lead times, minimizing inventory holding costs, and improving the quality of inputs. For example, a company might implement a just-in-time inventory system to reduce storage costs or establish strong relationships with reliable suppliers to ensure a consistent flow of high-quality materials. By optimizing these processes, businesses can improve their overall efficiency and reduce their operating expenses.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Outbound Logistics</h3>
            <p>Outbound logistics involves the activities associated with distributing finished products to customers. This stage focuses on the efficient movement of goods from the production facility to the end user. It includes activities such as order processing, warehousing, transportation, and delivery. The objective is to ensure that products are delivered to customers on time and in good condition.</p>
            <p className="mt-2">A well-managed outbound logistics system can enhance customer satisfaction and loyalty. For instance, a company might offer fast and reliable delivery services, provide real-time tracking of shipments, or establish a network of distribution centres to reduce delivery times. By streamlining these processes, businesses can improve their customer service and build a strong reputation for reliability.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> Marketing and Sales</h3>
            <p>Marketing and sales activities focus on promoting and selling products or services to customers. This stage involves identifying customer needs, developing marketing strategies, and executing sales campaigns. Activities include market research, advertising, public relations, pricing, and sales force management. The aim is to create demand for products and services and generate revenue.</p>
            <p className="mt-2">Effective marketing and sales efforts can drive customer acquisition and retention. For example, a company might use targeted advertising to reach specific customer segments, offer promotional discounts to incentivize purchases, or build a strong brand reputation through public relations activities. By understanding customer preferences and developing compelling marketing messages, businesses can increase their sales and market share.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> Service</h3>
            <p>Service activities involve providing support to customers after the sale. This stage focuses on enhancing customer satisfaction and building long-term relationships. Activities include customer support, technical assistance, warranty services, and product training. The goal is to address customer inquiries and resolve any issues that may arise.</p>
            <p className="mt-2">Providing excellent customer service can differentiate a company from its competitors and foster customer loyalty. For instance, a company might offer 24/7 customer support, provide online resources to help customers troubleshoot problems, or proactively address customer feedback. By delivering exceptional service, businesses can create a positive customer experience and build a strong reputation for customer satisfaction.</p>
          </div>
        </section>

        {/* ========== SECTION 6: SECONDARY COMPONENTS OF VALUE CHAIN ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Secondary Components of the Value Chain</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Procurement</h3>
            <p>Procurement involves the process of acquiring the necessary inputs for a company's operations, including raw materials, components, supplies, and services. It focuses on sourcing these inputs at the best possible price, quality, and delivery terms. Effective procurement can significantly impact a company's profitability and competitive advantage. This includes activities like supplier selection, negotiation, contract management, and vendor relationship management.</p>
            <p className="mt-2">Modern procurement practices often emphasize strategic sourcing, which involves building long-term relationships with key suppliers and collaborating on cost reduction and quality improvement initiatives. Companies also leverage technology, such as e-procurement platforms, to streamline the procurement process and improve efficiency. Strong procurement also mitigates supply chain risks. By having a varied and strong group of suppliers, they can avoid single points of failure.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Human Resources Management</h3>
            <p>Human resources management (HRM) encompasses all the activities related to recruiting, hiring, training, developing, and retaining employees. It focuses on ensuring that the company has the right people with the right skills in the right places at the right time. Effective HRM can enhance employee productivity, motivation, and job satisfaction, which can positively impact the overall performance of the value chain.</p>
            <p className="mt-2">HRM plays a critical role in fostering a positive work environment, promoting employee engagement, and developing the skills and competencies needed to support the company's strategic objectives. This includes activities like performance management, compensation and benefits, employee relations, and training and development programs. In today's world, HR also must deal with remote work, and the challenges that brings to company culture.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Technological Development</h3>
            <p>Technological development involves the activities related to developing new technologies, products, and processes that can enhance the company's value chain. This includes research and development (R&D), product design, process innovation, and information technology (IT) infrastructure. Effective technological development can lead to improved efficiency, reduced costs, and enhanced product quality.</p>
            <p className="mt-2">Companies invest in technological development to gain a competitive edge by introducing innovative products, improving production processes, and enhancing customer service. This includes adopting new technologies like automation, artificial intelligence, and data analytics to optimize operations and drive innovation. Technological development can also bring about new methods of communication, and logistics that can give a company a serious competitive advantage.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Company Structure/Infrastructure</h3>
            <p>Company infrastructure refers to the support systems and functions that enable the company to operate effectively. This includes activities such as finance, accounting, legal, quality management, and general management. A strong infrastructure is essential for the smooth functioning of the value chain.</p>
            <p className="mt-2">Effective infrastructure provides the foundation for all other value chain activities. This includes ensuring that the company has the necessary financial resources, legal compliance, and quality control systems in place. It also involves establishing effective communication and coordination mechanisms to facilitate collaboration across different departments and functions. This also includes the physical buildings, and systems that a company utilizes to function.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Supply Chain Trends & Value Chain</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supply Chain Trends</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Micro & Macro Factors</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Value Chain</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Supply Chain Trends & Value Chain. 🔗📊</p>
        </footer>

      </div>
    </div>
  );
};
