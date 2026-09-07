import React from 'react';
import {
  FolderTree,
  FileText,
  Database,
  Eye,
  Users,
  Tag,
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
  FileLock as FileLockIcon2,
  ShoppingCart,
  CreditCard,
  Headphones,
  MessageSquare,
  Ticket,
  Award,
  BadgeCheck as BadgeCheckIcon,
  Settings,
  Cloud,
  Wifi,
  Bluetooth,
  Tablet,
  Smartphone,
  Monitor,
  Laptop,
  Server,
  Database as DatabaseIcon,
  HardDrive,
  MemoryStick,
  Microchip,
  Cpu as CpuIcon,
  GitMerge,
  GitPullRequest,
  GitCommit,
  GitBranch as GitBranchIcon,
  Code,
  Terminal,
  Command,
  Braces,
  Infinity,
  RotateCw,
  Repeat,
  Share2, Lock,
  Sparkles,
  Zap as ZapIcon,
  Rocket as RocketIcon,
  BadgeCheck,
  Check,
  X,
  Minus,
  Plus,
  Divide, 
  Equal as EqualIcon,
  Percent as PercentIcon,
  CircleDot,
  Circle,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Diamond,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon
} from 'lucide-react';

export const LearningOutcome2: React.FC = () => {
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Supply Chain Drivers & <span className="text-sky-300 font-bold italic">Management</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to supply chain drivers, ICT, ERP, CRM, inventory management, customer service, integration, risks, and mitigation strategies.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">supply_chain_drivers.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">DRIVERS</span><span className="text-white">Supply_Chain;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ICT</span><span className="text-white">Integration;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">INVENTORY</span><span className="text-white">Service;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Gauge className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Package className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: SUPPLY CHAIN DRIVERS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supply Chain Drivers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Supply chain drivers are the key strategic levers that companies can manipulate to improve the performance of their supply chains. They are the fundamental components that influence the efficiency and responsiveness of a supply chain, and they determine how well a company can meet customer demand while minimizing costs. Effectively managing these drivers allows a business to optimize their supply chain to meet their strategic goals.</p>
            <p className="mt-2">These drivers are interconnected, and decisions made regarding one driver often impact the others. Companies must carefully balance these drivers to achieve their desired supply chain performance.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Factory size={20} /> Production</h3>
            <p>Production refers to the capacity of a supply chain to create and store goods. This driver involves decisions related to what products to produce, how much to produce, and when to produce them. Production decisions directly impact the responsiveness and efficiency of a supply chain. Factors such as plant capacity, manufacturing technology, and production scheduling play a crucial role.</p>
            <p className="mt-2">Efficient production aims to balance responsiveness and efficiency. High responsiveness might involve flexible production systems that can quickly adapt to changing demand, while high efficiency often focuses on minimizing production costs through economies of scale. Companies must decide on the best production strategy based on their product type, market demand, and competitive landscape. For example, a company producing highly customized products might prioritize flexibility over efficiency.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Inventory</h3>
            <p>Inventory encompasses all the raw materials, work-in-progress, and finished goods held within a supply chain. It acts as a buffer between supply and demand, allowing companies to meet customer needs even when production or transportation is disrupted. Inventory decisions involve determining how much inventory to hold, where to hold it, and what inventory management strategies to employ.</p>
            <p className="mt-2">Inventory management aims to balance the costs of holding inventory with the costs of stockouts. Holding too much inventory can lead to high storage costs and obsolescence, while holding too little inventory can result in lost sales and customer dissatisfaction. Companies use various inventory management techniques, such as just-in-time (JIT) or safety stock, to optimize inventory levels and improve supply chain performance. The amount of inventory a company chooses to hold is often based on the lead time of their suppliers, and the demand of their products.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MapPin size={20} /> Location</h3>
            <p>Location refers to the placement of facilities within a supply chain, including manufacturing plants, warehouses, and retail stores. Location decisions involve determining where to locate these facilities to minimize costs and maximize responsiveness. Factors such as proximity to suppliers, customers, and transportation infrastructure play a key role.</p>
            <p className="mt-2">Strategic location decisions can significantly impact a supply chain's efficiency and responsiveness. Locating facilities close to suppliers can reduce transportation costs and lead times, while locating them close to customers can improve delivery times and customer service. Companies must consider various factors, such as labour costs, taxes, and regulatory requirements, when making location decisions. The location of a company also effects how quickly they can react to regional disruptions.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Transportation</h3>
            <p>Transportation involves the movement of materials and products between different locations within a supply chain. It includes decisions related to transportation modes, routes, and schedules. Transportation choices directly affect the speed, cost, and reliability of product delivery.</p>
            <p className="mt-2">Efficient transportation is crucial for timely and cost-effective product delivery. Companies must choose the appropriate transportation modes, such as truck, rail, air, or sea, based on factors such as product type, distance, and urgency. They also need to optimize transportation routes and schedules to minimize costs and delays. The use of technology, such as GPS tracking and transportation management systems, can improve transportation efficiency and visibility.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Information</h3>
            <p>Information refers to the data and knowledge shared across a supply chain. It includes data on demand, inventory, production, and transportation. Information sharing enables better coordination and decision-making throughout the supply chain.</p>
            <p className="mt-2">Effective information flow is essential for aligning supply and demand, improving coordination, and enhancing responsiveness. Companies use various information technologies, such as enterprise resource planning (ERP) systems and supply chain management (SCM) software, to collect, analyse, and share information. Real-time data and analytics can help companies anticipate demand, identify potential disruptions, and make informed decisions. The more available information a company has, the quicker they can adapt to changes.</p>
          </div>
        </section>

        {/* ========== SECTION 2: ICT IN SUPPLY CHAINS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>ICT in Supply Chains</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Role of ICT in Supply Chains</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Enhanced Visibility and Tracking:</strong> ICT tools, such as IoT sensors, RFID tags, and GPS tracking, provide real-time visibility into the movement of goods, materials, and information throughout the supply chain. This enables businesses to track shipments, monitor inventory levels, and identify potential bottlenecks or delays. This increased visibility allows for quicker reaction to issues, and better planning.</li>
              <li><strong>Improved Communication and Collaboration:</strong> ICT platforms facilitate seamless communication and collaboration among supply chain partners, including suppliers, manufacturers, distributors, and retailers. This includes email, instant messaging, and collaborative portals, allowing for faster information sharing and improved coordination. This reduces miscommunication and improves reaction times.</li>
              <li><strong>Automated Processes and Efficiency:</strong> ICT solutions automate various supply chain processes, such as order processing, inventory management, and transportation scheduling. This automation reduces manual errors, improves efficiency, and lowers operational costs. Automated systems allow for 24/7 function and reduces the need for large amounts of human labour in many tasks.</li>
              <li><strong>Data-Driven Decision Making:</strong> ICT enables businesses to collect, analyse, and interpret vast amounts of supply chain data. This data-driven approach supports informed decision-making, allowing companies to optimize inventory levels, forecast demand, and improve overall supply chain performance. Data analysis can also show trends that humans might not easily see.</li>
              <li><strong>Increased Responsiveness and Agility:</strong> ICT empowers businesses to respond quickly to changes in demand, supply, or market conditions. Real-time data and analytics enable companies to adjust production schedules, reroute shipments, and adapt to unexpected disruptions. This agility is crucial for maintaining a competitive edge in today's dynamic business environment.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Supply Chain Integration</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Real-Time Data Sharing:</strong> Integration allows for the seamless exchange of real-time data across the supply chain, enabling all partners to access up-to-date information on inventory, demand, and production. This eliminates information silos and improves coordination. This data sharing allows for faster decision making.</li>
              <li><strong>Collaborative Planning and Forecasting:</strong> Integrated systems facilitate collaborative planning and forecasting, enabling partners to work together to anticipate demand, optimize inventory levels, and improve production scheduling. This collaborative approach reduces uncertainty and improves accuracy. This helps to reduce the bullwhip effect.</li>
              <li><strong>Automated Order Management:</strong> Integration automates order management processes, from order placement to fulfilment. This includes electronic data interchange (EDI) and other automated systems that streamline order processing and reduce errors. This automation allows for faster processing of orders.</li>
              <li><strong>End-to-End Visibility:</strong> Integration provides end-to-end visibility into the entire supply chain, allowing businesses to track the movement of goods and materials from raw materials to final delivery. This visibility enables proactive problem-solving and improves overall supply chain control. This visibility allows for quick identification of issues.</li>
              <li><strong>Supplier and Customer Collaboration:</strong> Integration fosters closer collaboration with suppliers and customers, enabling businesses to share information, coordinate activities, and improve responsiveness. This collaborative approach leads to stronger relationships and improved supply chain performance. This collaboration can lead to more efficient innovation.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Server size={20} /> Enterprise Resource Planning (ERP)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Centralized Data Repository:</strong> ERP systems provide a centralized database that stores all business data, including supply chain information, financial data, and human resources data. This eliminates data redundancy and ensures data consistency across the organization. This central repository improves information accuracy.</li>
              <li><strong>Integrated Business Processes:</strong> ERP systems integrate various business processes, such as order management, inventory control, production planning, and financial management. This integration streamlines operations, improves efficiency, and reduces costs. This integration reduces the need for redundant data entry.</li>
              <li><strong>Improved Forecasting and Planning:</strong> ERP systems provide advanced forecasting and planning capabilities, enabling businesses to accurately predict demand, optimize inventory levels, and improve production scheduling. This leads to better resource allocation and reduced waste. This helps to reduce stockouts.</li>
              <li><strong>Enhanced Reporting and Analytics:</strong> ERP systems offer comprehensive reporting and analytics tools that provide insights into supply chain performance, financial performance, and other key business metrics. This enables businesses to make informed decisions and identify areas for improvement. This allows for better performance tracking.</li>
              <li><strong>Standardized Processes and Compliance:</strong> ERP systems enforce standardized business processes and ensure compliance with regulatory requirements. This reduces errors, improves consistency, and mitigates risks. This standardization allows for easier auditing.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Customer Relationship Management (CRM) System</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Enhanced Customer Data Management:</strong> CRM systems centralize and organize customer data, including contact information, purchase history, and interaction records. This provides a comprehensive view of each customer, enabling businesses to personalize interactions and improve customer service. This allows for more targeted marketing.</li>
              <li><strong>Improved Customer Interaction Tracking:</strong> CRM systems track all customer interactions, including phone calls, emails, social media interactions, and website visits. This allows businesses to understand customer preferences and behaviour, enabling them to provide more relevant and timely support. This tracking also helps with customer service.</li>
              <li><strong>Automated Sales and Marketing Processes:</strong> CRM systems automate various sales and marketing processes, such as lead management, campaign management, and email marketing. This automation improves efficiency, reduces manual errors, and allows sales and marketing teams to focus on more strategic activities. This automation also helps with lead scoring.</li>
              <li><strong>Improved Customer Service and Support:</strong> CRM systems provide customer service agents with access to customer information and interaction history, enabling them to provide faster and more personalized support. This leads to increased customer satisfaction and loyalty. CRM systems are also used to create customer service tickets.</li>
              <li><strong>Data-Driven Customer Insights:</strong> CRM systems provide reporting and analytics tools that enable businesses to gain insights into customer behaviour, identify trends, and measure the effectiveness of sales and marketing campaigns. This data-driven approach supports informed decision-making and helps businesses optimize their customer relationship management strategies. This data also helps with targeted promotions.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Emerging Technologies and Their Impact on Supply Chains</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Artificial Intelligence (AI) and Machine Learning (ML):</strong> AI and ML are revolutionizing supply chain management by enabling predictive analytics, demand forecasting, and inventory optimization. AI-powered algorithms can analyse vast amounts of data to identify patterns, predict disruptions, and optimize supply chain operations. AI can also automate many repetitive tasks.</li>
              <li><strong>Internet of Things (IoT):</strong> IoT sensors and devices provide real-time data on the location, condition, and movement of goods and materials throughout the supply chain. This enables businesses to track shipments, monitor inventory levels, and optimize logistics operations. IoT also allows for predictive maintenance.</li>
              <li><strong>Blockchain Technology:</strong> Blockchain enhances transparency and traceability in supply chains by providing a secure and immutable record of transactions. This technology can be used to verify product authenticity, track product provenance, and reduce fraud. Blockchain also helps with contract management.</li>
              <li><strong>Robotics and Automation:</strong> Robotics and automation are streamlining warehouse operations, improving efficiency, and reducing labour costs. Automated guided vehicles (AGVs) and robotic arms can be used to pick, pack, and ship products, while drones can be used for last-mile delivery. This allows for 24/7 warehouse operation.</li>
              <li><strong>Cloud Computing and Big Data Analytics:</strong> Cloud computing provides scalable and flexible infrastructure for storing and processing vast amounts of supply chain data. Big data analytics tools enable businesses to extract valuable insights from this data, supporting informed decision-making and optimizing supply chain performance. Cloud computing allows for shared data, and remote access.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: FUNCTIONS OF INVENTORY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Functions of Inventory in Supply Chains</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Scale size={20} /> Balancing Supply and Demand</h3>
            <p>Inventory acts as a buffer between supply and demand, allowing companies to meet customer needs even when production or supply is disrupted. This function is particularly important for seasonal products or products with fluctuating demand. By holding inventory, companies can ensure that products are available when customers want them, preventing stockouts and lost sales. In essence, it smooths out the peaks and valleys between production and consumption.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Buffering Against Uncertainty</h3>
            <p>Supply chains are subject to various uncertainties, such as demand fluctuations, supply disruptions, and transportation delays. Inventory provides a safety net, allowing companies to cope with these uncertainties. Safety stock, for example, is held specifically to mitigate the risk of stockouts due to unexpected variations in demand or supply. This helps to maintain customer service levels and prevent disruptions to operations.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Factory size={20} /> Enabling Economies of Scale</h3>
            <p>Producing or purchasing in large quantities can often reduce per-unit costs. However, this may result in excess inventory. Holding inventory allows companies to take advantage of economies of scale in production or purchasing, while still meeting customer demand. This function is especially important for products with high setup costs or long lead times. Essentially, it allows for more efficient production runs, or bulk discounts.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Heart size={20} /> Providing Customer Service</h3>
            <p>Inventory plays a crucial role in providing timely and reliable customer service. By holding inventory close to customers, companies can reduce delivery times and improve customer satisfaction. This is particularly important for products with short lead times or high customer expectations. Having the product on hand, allows for instant fulfilment, and reduces the time a customer must wait.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TrendingUp size={20} /> Hedging Against Price Increases</h3>
            <p>In markets where prices are volatile, holding inventory can act as a hedge against future price increases. By purchasing raw materials or finished goods when prices are low, companies can protect themselves from future price hikes. This function is particularly important for commodities or products with fluctuating prices. This also allows a company to maintain profit margins, even when market prices increase.</p>
          </div>
        </section>

        {/* ========== SECTION 4: INVENTORY COST STRUCTURE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Inventory Cost Structure</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSign size={20} /> Holding Costs (Carrying Costs)</h3>
            <p>These are the costs associated with storing and maintaining inventory. They include costs such as warehousing costs (rent, utilities), insurance, obsolescence (the cost of inventory becoming outdated or unusable), spoilage, and the opportunity cost of capital tied up in inventory. Essentially, it is the price you pay for keeping inventory on hand. High holding costs encourage businesses to minimize inventory levels.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Receipt size={20} /> Ordering Costs (Setup Costs)</h3>
            <p>These are the costs associated with placing and receiving an order. They include costs such as the cost of processing purchase orders, transportation costs, receiving and inspection costs, and administrative costs. For manufacturing, setup costs may include the costs of preparing equipment for a production run. Ordering costs are generally fixed, regardless of the quantity ordered, which means more frequent orders, increase these costs.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangle size={20} /> Shortage Costs (Stockout Costs)</h3>
            <p>These are the costs associated with running out of inventory. They include costs such as lost sales, customer dissatisfaction, backorder costs, and potential damage to reputation. If a customer wants a product, and it is not available, the company loses a sale. In some cases, the customer may switch to a competitor.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShoppingCart size={20} /> Purchase Costs</h3>
            <p>This is the actual cost of the inventory itself, including the price paid to suppliers and any associated discounts or rebates. These costs are directly related to the quantity of inventory purchased. The larger the order, the larger the purchase cost.</p>
          </div>
        </section>

        {/* ========== SECTION 5: MODELS OF INVENTORY MANAGEMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Models of Inventory Management</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Economic Order Quantity (EOQ) Model</h3>
            <p>The EOQ model is a classic inventory management model that determines the optimal order quantity to minimize total inventory costs. It balances holding costs and ordering costs by calculating the order quantity that minimizes the sum of these two costs. This model assumes constant demand and lead times. It is a good model for products with stable demand.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Clock size={20} /> Just-in-Time (JIT) Inventory System</h3>
            <p>JIT is an inventory management philosophy that aims to minimize inventory levels by receiving materials and producing goods only when they are needed. It focuses on eliminating waste and improving efficiency throughout the supply chain. JIT requires close coordination with suppliers and reliable transportation systems. This works best when demand is very predictable, and supply chains are reliable.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Materials Requirements Planning (MRP)</h3>
            <p>MRP is a computer-based inventory management system that calculates the materials and components needed to produce finished goods. It uses a master production schedule, bill of materials, and inventory records to determine the timing and quantity of materials needed. MRP is particularly useful for complex products with multiple components. It is very helpful for manufacturing companies.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Vendor-Managed Inventory (VMI)</h3>
            <p>VMI is an inventory management approach where the supplier takes responsibility for managing the customer's inventory. The supplier monitors inventory levels and replenishes stock as needed. This approach can improve inventory turnover and reduce stockouts. This is often used in retail environments.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Safety Stock Model</h3>
            <p>This model focuses on maintaining a buffer of extra inventory to mitigate the risk of stockouts due to demand fluctuations or supply disruptions. Safety stock is calculated based on factors such as demand variability, lead time variability, and desired service levels. This model is very helpful for products with variable demand.</p>
          </div>
        </section>

        {/* ========== SECTION 6: ELEMENTS OF CUSTOMER SERVICE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Elements of Customer Service</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircle size={20} /> Reliability</h3>
            <p>This refers to the ability to provide consistent and accurate service. Customers expect businesses to deliver on their promises, whether it is fulfilling orders on time, providing accurate information, or resolving issues promptly. Reliability builds trust and fosters long-term customer relationships.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Zap size={20} /> Responsiveness</h3>
            <p>This involves the willingness to help customers and provide prompt service. Customers appreciate quick responses to their inquiries and timely resolution of their problems. Responsiveness demonstrates that a business values its customers' time and concerns.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Heart size={20} /> Empathy</h3>
            <p>This is the ability to understand and share the feelings of another. It involves showing genuine concern for customers' needs and demonstrating a willingness to help. Empathetic customer service creates a positive emotional connection with customers and builds loyalty.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Assurance</h3>
            <p>This refers to the competence and courtesy of customer service representatives, as well as their ability to inspire trust and confidence. Customers want to feel that they are dealing with knowledgeable and capable professionals who can effectively address their needs.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Building size={20} /> Tangibles</h3>
            <p>This includes the physical aspects of customer service, such as the appearance of facilities, equipment, and personnel. Clean, well-maintained facilities and professional-looking employees contribute to a positive customer experience. In the digital world, this also extends to the look and feel of websites and applications.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Accessibility</h3>
            <p>Customers should be able to easily reach customer service when they need it. This includes having multiple channels of communication, such as phone, email, chat, and social media. It also means having reasonable hours of operation and minimal wait times.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Repeat size={20} /> Consistency</h3>
            <p>Customers expect to receive the same level of service every time they interact with a company. Consistent service builds trust and reinforces positive perceptions of the brand.</p>
          </div>
        </section>

        {/* ========== SECTION 7: IMPORTANCE OF CUSTOMER SERVICE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of Customer Service</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Heart size={20} /> Customer Loyalty and Retention</h3>
            <p>Excellent customer service fosters customer loyalty and increases customer retention. Satisfied customers are more likely to make repeat purchases and remain loyal to a brand. Loyal customers are also more likely to refer new customers.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Star size={20} /> Enhanced Brand Reputation</h3>
            <p>Positive customer experiences contribute to a strong brand reputation. Word-of-mouth referrals and online reviews can significantly impact a company's image. Good customer service leads to positive reviews, and a better reputation.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSign size={20} /> Increased Sales and Revenue</h3>
            <p>Satisfied customers are more likely to spend more money and make repeat purchases. Good customer service can also lead to upselling and cross-selling opportunities, further increasing revenue.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Competitive Advantage</h3>
            <p>In today's competitive marketplace, customer service can be a key differentiator. Companies that provide exceptional customer service can gain a competitive edge over their rivals.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangle size={20} /> Reduced Customer Churn</h3>
            <p>Poor customer service can lead to customer churn, which is the loss of customers. By providing excellent service, companies can minimize churn and retain valuable customers.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageSquare size={20} /> Valuable Customer Feedback</h3>
            <p>Customer service interactions provide valuable feedback that can be used to improve products, services, and processes. This feedback can help companies identify areas for improvement and address customer concerns.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Employee Morale</h3>
            <p>When customer service is handled well, it makes a better work environment. Employees that can provide good service, feel more satisfied in their work.</p>
          </div>
        </section>

        {/* ========== SECTION 8: CUSTOMER RETENTION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Customer Retention</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Definition and Importance</h3>
            <p>Customer retention is the ability of a company to keep its customers over a specified period. It is about turning one-time buyers into loyal, repeat customers. High customer retention rates indicate that customers are satisfied with a company's products or services and the overall customer experience. Retaining existing customers is often more cost-effective than acquiring new ones, as it requires less marketing and sales effort. Loyal customers also tend to spend more and provide valuable referrals.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecks size={20} /> Strategies for Customer Retention</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Providing Excellent Customer Service:</strong> Consistently meeting or exceeding customer expectations builds trust and loyalty.</li>
              <li><strong>Building Strong Customer Relationships:</strong> Personalizing interactions, showing appreciation, and actively listening to customer feedback foster a sense of connection.</li>
              <li><strong>Implementing Loyalty Programs:</strong> Rewarding repeat customers with discounts, exclusive offers, or other perks incentivizes continued patronage.</li>
              <li><strong>Gathering and Acting on Customer Feedback:</strong> Regularly seeking customer feedback and using it to improve products, services, and processes demonstrates that a company values its customers' opinions.</li>
              <li><strong>Proactive Customer Communication:</strong> Keeping customers informed about new products, promotions, and updates through email, newsletters, or social media maintains engagement.</li>
              <li><strong>Creating a Seamless Customer Experience:</strong> Ensuring that every interaction, from browsing the website to resolving an issue, is smooth and hassle-free enhances customer satisfaction.</li>
              <li><strong>Offering Value-Added Services:</strong> Providing additional services or resources that enhance the customer's experience, such as tutorials, webinars, or personalized recommendations, strengthens customer loyalty.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: PHASES OF CUSTOMER SERVICE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Phases of Customer Service</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Clock size={20} /> Pre-Transaction Phase</h3>
            <p>This phase occurs before a customer makes a purchase. It involves activities that attract and inform potential customers. This includes marketing, advertising, and providing easily accessible information about products or services. The goal is to create a positive impression and build interest. This also involves making the product or service easy to find.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShoppingCart size={20} /> Transaction Phase</h3>
            <p>This phase encompasses the actual purchase process. It involves activities such as order placement, payment processing, and delivery. The focus is on providing a smooth and efficient transaction experience. This includes providing clear instructions, accurate information, and timely delivery. This is where the customer is interacting with the company to acquire the product or service.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Heart size={20} /> Post-Transaction Phase</h3>
            <p>This phase occurs after the customer has made a purchase. It involves activities such as customer support, warranty services, and follow-up communication. The goal is to ensure customer satisfaction and build long-term relationships. This phase is critical for customer retention. This includes things like follow up emails, customer surveys, and help lines.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Ongoing Relationship Phase</h3>
            <p>This encompasses the continuous engagement and interaction with customers over time. It involves activities such as loyalty programs, personalized offers, and proactive communication. The focus is on maintaining customer satisfaction and fostering long-term loyalty. This phase is about building a lasting relationship with the customer. This also includes things like community forums, and exclusive events.</p>
          </div>
        </section>

        {/* ========== SECTION 10: ELEMENTS OF SUPPLY CHAIN INTEGRATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Elements of Supply Chain Integration</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Database size={20} /> Information Sharing</h3>
            <p>This involves the timely and accurate exchange of data between all partners in the supply chain. This includes demand forecasts, inventory levels, production schedules, and shipping information. Effective information sharing reduces uncertainty and improves coordination. Modern systems allow for real time data sharing, which is a major improvement over older systems. This allows all parties to have the same information at the same time.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Process Synchronization</h3>
            <p>This focuses on aligning the processes of different supply chain partners to ensure a smooth and efficient flow of goods and information. This includes coordinating production schedules, transportation routes, and inventory management practices. This synchronization reduces bottlenecks and delays and improves overall supply chain performance. This requires strong communication, and collaborative planning.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Collaborative Planning</h3>
            <p>This involves joint planning and decision-making among supply chain partners. This includes collaborative demand forecasting, joint product development, and shared risk management. Collaborative planning fosters trust and builds stronger relationships among partners. It also allows for more accurate forecasts and better resource allocation.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Truck size={20} /> Workflow Coordination</h3>
            <p>This focuses on coordinating the flow of materials and information across the supply chain. This includes managing the movement of goods, tracking shipments, and resolving any issues that may arise. Effective workflow coordination ensures that products are delivered on time and in good condition. This requires good communication and tracking systems.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Link size={20} /> Technology Integration</h3>
            <p>This involves integrating the IT systems of different supply chain partners to enable seamless data exchange and process coordination. This includes using ERP systems, supply chain management software, and other technologies. Technology integration is essential for automating processes and improving efficiency. This also improves data accuracy and reduces the need for manual data entry.</p>
          </div>
        </section>

        {/* ========== SECTION 11: STAGES OF SUPPLY CHAIN INTEGRATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stages of Supply Chain Integration</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Building size={20} /> Internal Integration</h3>
            <p>This stage focuses on integrating the internal functions of a company, such as production, marketing, and logistics. This involves breaking down silos and establishing cross-functional teams to improve communication and coordination. Internal integration is the foundation for external integration. It ensures that all departments within a company are working together effectively.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Supplier Integration</h3>
            <p>This stage involves integrating with key suppliers to improve the flow of materials and information. This includes sharing demand forecasts, coordinating production schedules, and collaborating on product development. Supplier integration can lead to reduced lead times, lower costs, and improved quality. This is where the company starts to build external relationships.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Customer Integration</h3>
            <p>This stage involves integrating with key customers to improve the flow of information and products. This includes sharing sales data, collaborating on demand forecasting, and providing customized services. Customer integration can lead to increased customer satisfaction and loyalty. This also allows for better understanding of customer needs.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><GitBranch size={20} /> Horizontal Integration</h3>
            <p>This stage involves integrating with other companies at the same level of the supply chain, such as competitors or complementary businesses. This can involve joint ventures, strategic alliances, or industry partnerships. Horizontal integration can lead to economies of scale and increased market power. This is where companies start to build industry wide relationships.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ArrowRightCircle size={20} /> Vertical Integration</h3>
            <p>This stage involves integrating with companies at different levels of the supply chain, such as suppliers and customers. This can involve acquiring or merging with other companies or establishing long-term contracts. Vertical integration can lead to greater control over the supply chain and reduced risk. This also allows for greater control of the whole production process.</p>
          </div>
        </section>

        {/* ========== SECTION 12: TYPES OF SUPPLY CHAIN INTEGRATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Supply Chain Integration</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ArrowRightCircle size={20} /> Vertical Integration</h3>
            <p>This involves integrating different stages of the supply chain under a single ownership or control. This can be either backward integration (acquiring suppliers) or forward integration (acquiring distributors or retailers). Vertical integration aims to gain greater control over the supply chain, reduce costs, and improve coordination. It can also help to mitigate risks associated with supply disruptions or price fluctuations.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><GitBranch size={20} /> Horizontal Integration</h3>
            <p>This involves integrating with companies at the same level of the supply chain, such as competitors or complementary businesses. This can take the form of mergers, acquisitions, or strategic alliances. Horizontal integration aims to achieve economies of scale, increase market share, and expand product offerings. It can also help to improve bargaining power with suppliers and customers.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Database size={20} /> Information Integration</h3>
            <p>This focuses on integrating the information systems and data flows across the supply chain. This involves sharing real-time data on demand, inventory, production, and transportation. Information integration aims to improve visibility, coordination, and decision-making. It enables businesses to respond quickly to changes in demand or supply.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Process Integration</h3>
            <p>This involves aligning the business processes of different supply chain partners to ensure a smooth and efficient flow of goods and information. Process integration aims to eliminate redundancies, reduce lead times, and improve overall supply chain performance. It requires close collaboration and communication among partners.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Collaborative Integration</h3>
            <p>This type focuses on building strong relationships and fostering collaboration among supply chain partners. This includes joint planning, shared risk management, and collaborative product development. Collaborative integration aims to create a culture of trust and cooperation, leading to improved communication, coordination, and innovation.</p>
          </div>
        </section>

        {/* ========== SECTION 13: BARRIERS OF SUPPLY CHAIN INTEGRATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Barriers of Supply Chain Integration</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Lack of Trust</h3>
            <p>Supply chain integration requires a high level of trust among partners. Lack of trust can lead to reluctance to share information or collaborate on joint initiatives. This is especially true when sharing sensitive company data.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Link size={20} /> Information Technology (IT) Incompatibility</h3>
            <p>Different supply chain partners may use incompatible IT systems, making it difficult to share data and integrate processes. This is a large hurdle, as older systems often do not communicate with newer ones.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Organizational Culture Differences</h3>
            <p>Different companies may have different organizational cultures, which can create challenges in collaboration and communication. This can lead to misunderstandings, and miscommunication.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangle size={20} /> Resistance to Change</h3>
            <p>Supply chain integration often requires significant changes to existing processes and systems. Resistance to change from employees or management can hinder integration efforts. People tend to prefer the familiar and fear the unknown.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Lack of Clear Objectives and Metrics</h3>
            <p>Without clear objectives and metrics, it can be difficult to measure the success of supply chain integration efforts. This can lead to a lack of accountability and motivation.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Lock size={20} /> Security Concerns</h3>
            <p>With increased information sharing, comes increased security concerns. Companies may be worried about data breaches, or the theft of company secrets. This is a very valid concern and requires careful planning.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSign size={20} /> Cost and Complexity</h3>
            <p>Implementing supply chain integration can be costly and complex, requiring significant investments in technology, training, and process redesign. The larger the company, the more complex the integration becomes.</p>
          </div>
        </section>

        {/* ========== SECTION 14: MAJOR SUPPLY CHAIN RISKS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Major Supply Chain Risks</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangle size={20} /> Supply Disruptions</h3>
            <p>These risks involve interruptions in the flow of materials or products due to factors such as natural disasters, supplier failures, or geopolitical events. These disruptions can lead to production delays, stockouts, and lost sales.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Activity size={20} /> Demand Volatility</h3>
            <p>This refers to unpredictable fluctuations in customer demand, which can lead to either excess inventory or stockouts. Accurate demand forecasting is crucial to mitigate this risk.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Truck size={20} /> Transportation Risks</h3>
            <p>These risks involve delays, damage, or loss of goods during transportation due to factors such as weather conditions, traffic congestion, or transportation accidents. Global supply chains are especially vulnerable to these risks.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Supplier Risks</h3>
            <p>These risks involve the potential for supplier failures, quality issues, or ethical violations. Dependence on a single supplier or suppliers in high-risk regions increases this risk.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Information Technology (IT) Risks</h3>
            <p>These risks involve disruptions to IT systems, data breaches, or cyberattacks. Modern supply chains rely heavily on IT, making them vulnerable to these risks.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Globe size={20} /> Geopolitical Risks</h3>
            <p>These risks involve changes in political landscapes, trade policies, or international relations that can disrupt supply chain operations. Tariffs, sanctions, and political instability are examples of these risks.</p>
          </div>
        </section>

        {/* ========== SECTION 15: DRIVERS OF SUPPLY CHAIN RISKS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Drivers of Supply Chain Risks</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Globe size={20} /> Globalization</h3>
            <p>Increased reliance on global sourcing and distribution networks exposes supply chains to a wider range of risks. Longer lead times and greater complexity increase the potential for disruptions.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Factory size={20} /> Lean Manufacturing</h3>
            <p>While lean manufacturing reduces waste and improves efficiency, it also reduces inventory buffers, making supply chains more vulnerable to disruptions. Just-in-time (JIT) systems can be particularly risky.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><User size={20} /> Single Sourcing</h3>
            <p>Relying on a single supplier for critical materials or components increases the risk of supply disruptions. Supplier failures can have a significant impact on production.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Layers size={20} /> Increased Complexity</h3>
            <p>Modern supply chains are becoming increasingly complex, with multiple tiers of suppliers and intricate logistics networks. This complexity makes it more difficult to identify and manage risks.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Rapid Technological Change</h3>
            <p>The speed of technological change can lead to obsolescence, and the need for constant upgrades, which in turn can lead to supply chain disruptions. Cybersecurity threats also increase with technological advancement.</p>
          </div>
        </section>

        {/* ========== SECTION 16: RISK MITIGATION STRATEGIES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Risk Mitigation Strategies</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Diversification of Suppliers</h3>
            <p>Developing relationships with multiple suppliers in different regions reduces the risk of supply disruptions. This provides alternative sources of materials or components.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Package size={20} /> Inventory Management</h3>
            <p>Maintaining safety stock and implementing effective inventory management systems can buffer against demand volatility and supply disruptions. This also includes utilizing advanced forecasting tools.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Truck size={20} /> Transportation Planning</h3>
            <p>Developing contingency plans for transportation disruptions, such as alternative routes or modes of transport, can minimize delays. Real-time tracking and monitoring can improve visibility.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Technology Investments</h3>
            <p>Investing in robust IT systems, cybersecurity measures, and data analytics tools can mitigate IT risks and improve supply chain visibility. Blockchain technology can also improve transparency.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Risk Assessment and Monitoring</h3>
            <p>Conducting regular risk assessments and monitoring key indicators can help identify potential disruptions and enable proactive responses. This includes scenario planning and stress testing.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Building Resilient Relationships</h3>
            <p>Establishing strong relationships with key suppliers and customers can improve communication, collaboration, and responsiveness during disruptions. This includes shared information, and collaborative planning.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Globe size={20} /> Geopolitical Analysis</h3>
            <p>Monitoring geopolitical events and analysing their potential impact on supply chain operations can help businesses anticipate and mitigate risks. This includes staying up to date on trade regulations.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Supply Chain Drivers & Management</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supply Chain Drivers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">ICT & Integration</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inventory Management</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Service</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Risk Management</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Supply Chain Drivers & Management. 🚛📊</p>
        </footer>

      </div>
    </div>
  );
};
