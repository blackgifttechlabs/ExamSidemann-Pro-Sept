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
  Share2, 
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
  Pentagon,
  ChartPie,
  ChartBar,
  ChartLine as ChartLineIcon,
  ChartArea,
  ChartScatter,
  ChartCandlestick,
  ChartNoAxesCombined as ChartNoAxesCombinedIcon,
  ChartColumn as ChartColumnIcon,
  ChartBarBig,
  ChartSpline,
  ChartArea as ChartAreaIcon,
  ChartScatter as ChartScatterIcon
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
              Supply Chain <span className="text-amber-300 font-bold italic">Performance</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to performance indicators, KPIs, balanced scorecard, supply chain costs, procurement costs, transportation costs, inventory costs, and quality costs.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">supply_chain_performance.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">KPIs</span><span className="text-white">Measure;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">COSTS</span><span className="text-white">Analyze;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SCORECARD</span><span className="text-white">Balance;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><BarChart4 className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><DollarSign className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: SUPPLY CHAIN PERFORMANCE ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supply Chain Performance</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Performance indicators are measurable values used to evaluate the success of a supply chain in achieving its objectives. They provide quantitative data that allows organizations to track progress, identify areas for improvement, and make informed decisions. These indicators help to assess the efficiency, effectiveness, and responsiveness of the supply chain.</p>
            <p className="mt-2">Effective performance indicators are aligned with the organization's strategic goals and provide insights into key aspects of supply chain operations, such as cost, quality, delivery, and customer satisfaction. They serve as a vital tool for monitoring progress, identifying trends, and driving continuous improvement. Without these indicators, it becomes very difficult to determine how well a supply chain is preforming.</p>
          </div>
        </section>

        {/* ========== SECTION 2: TYPES OF KEY PERFORMANCE INDICATORS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Key Performance Indicators (KPIs)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Financial KPIs</h3>
            <p>These KPIs measure the financial performance of the supply chain, such as total supply chain cost, inventory carrying cost, and return on assets. They provide insights into the financial impact of supply chain decisions and help to optimize profitability.</p>
            <p className="mt-2"><strong>Examples include:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cost of goods sold (COGS)</li>
              <li>Inventory turnover</li>
              <li>Cash-to-cash cycle time.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Operational KPIs</h3>
            <p>These KPIs measure the efficiency and effectiveness of supply chain operations, such as on-time delivery, order fulfilment rate, and inventory accuracy. They provide insights into the operational performance of the supply chain and help to identify bottlenecks and inefficiencies.</p>
            <p className="mt-2"><strong>Examples include:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Order fulfilment cycle time</li>
              <li>Perfect order fulfilment</li>
              <li>Production cycle time</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Customer-Focused KPIs</h3>
            <p>These KPIs measure the supply chain's ability to meet customer needs and expectations, such as customer satisfaction, order accuracy, and responsiveness to customer inquiries. They provide insights into the customer experience and help to improve customer loyalty.</p>
            <p className="mt-2"><strong>Examples include:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customer satisfaction score (CSAT)</li>
              <li>Order accuracy rate</li>
              <li>Customer retention rate</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Sustainability KPIs</h3>
            <p>These KPIs measure the environmental and social impact of the supply chain, such as carbon footprint, waste reduction, and ethical sourcing practices. They provide insights into the sustainability performance of the supply chain and help to ensure responsible and ethical operations.</p>
            <p className="mt-2"><strong>Examples include:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Carbon emissions per unit</li>
              <li>Waste reduction rate</li>
              <li>Percentage of suppliers with ethical certifications</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Supplier Performance KPIs</h3>
            <p>These KPIs measure how well suppliers are meeting the needs of the company. This includes on time delivery, quality of materials, and responsiveness.</p>
            <p className="mt-2"><strong>Examples include:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supplier defect rate</li>
              <li>Supplier on-time delivery rate</li>
              <li>Supplier lead time.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: BALANCED SCORECARD ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Balanced Scorecard</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The balanced scorecard is a strategic performance management tool that provides a comprehensive view of an organization's performance across four key perspectives: financial, customer, internal processes, and learning and growth. It translates the organization's strategic objectives into measurable KPIs and provides a framework for monitoring and improving performance.</p>
            <p className="mt-2">In a supply chain context, the balanced scorecard helps to align supply chain activities with the organization's overall strategic goals. It provides a holistic view of supply chain performance, considering not only financial metrics but also operational, customer, and learning and growth metrics. This approach ensures that the supply chain is contributing to the organization's long-term success.</p>
            <p className="mt-2">The balanced score card helps to show how improvements in one area, effect other areas. It also helps to ensure that all areas of a supply chain are being monitored.</p>
          </div>
        </section>

        {/* ========== SECTION 4: SUPPLY CHAIN COSTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supply Chain Costs</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Supply chain costs encompass all expenses incurred in the process of planning, sourcing, producing, and delivering goods or services to customers. These costs include everything from raw material acquisition to final delivery, and they significantly impact a company's profitability and competitiveness. Effective management of supply chain costs is crucial for optimizing operations and maximizing value.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">Procurement Costs</h3>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Purchase Price Variance</h4>
            <p>This cost reflects the difference between the actual price paid for materials or services and the standard or planned price. It measures the effectiveness of procurement negotiations and market analysis. A positive variance indicates cost savings, while a negative variance indicates overspending.</p>
            <p className="mt-2">Analysing purchase price variances helps procurement teams identify opportunities for cost reduction and improve negotiation strategies. It also provides insights into market volatility and supplier pricing trends, allowing for proactive adjustments to procurement plans. This includes the ability to track the reasons behind price changes.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Search size={20} /> Supplier Selection and Evaluation Costs</h4>
            <p>These costs include expenses associated with identifying, evaluating, and selecting suppliers. This involves activities such as conducting supplier audits, performing due diligence, and managing the request for proposal (RFP) process.</p>
            <p className="mt-2">Investing in thorough supplier selection and evaluation processes helps to mitigate risks and ensure that the organization partners with reliable and capable suppliers. These costs are essential for building long-term, mutually beneficial supplier relationships. This includes the cost of travel, and the cost of any third-party audits.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Receipt size={20} /> Order Processing Costs</h4>
            <p>These costs are incurred in the process of creating, transmitting, and managing purchase orders. They include expenses related to data entry, order tracking, and communication with suppliers.</p>
            <p className="mt-2">Streamlining order processing procedures and automating tasks can reduce order processing costs and improve efficiency. Implementing electronic data interchange (EDI) and e-procurement systems can significantly reduce these costs. This includes the cost of any errors that occur during the order process.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Warehouse size={20} /> Inventory Holding Costs Related to Procurement</h4>
            <p>These costs are directly impacted by procurement decisions. When a company purchases large quantities of materials to gain discounts, they also increase their holding costs. These costs include things like warehousing, insurance, and obsolescence.</p>
            <p className="mt-2">Procurement must balance the cost savings of bulk purchasing, with the increase in holding costs. Proper forecasting, and good communication with other departments is key to managing these costs.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon size={20} /> Contract Management Costs</h4>
            <p>These costs include the expenses associated with drafting, negotiating, and managing supplier contracts. This includes legal fees, contract administration, and performance monitoring.</p>
            <p className="mt-2">Effective contract management ensures that agreements are clear, enforceable, and aligned with the organization's objectives. This helps to mitigate risks and protect the organization's interests. This also helps to ensure that all parties are meeting their contractual obligations.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">Transportation Costs</h3>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Freight Costs</h4>
            <p>These are the direct costs associated with moving goods from one location to another, including expenses for transportation carriers, fuel, tolls, and handling. Freight costs vary depending on factors such as distance, mode of transport, and shipment size.</p>
            <p className="mt-2">Optimizing freight routes, consolidating shipments, and negotiating favourable rates with carriers can help to reduce freight costs. This also includes the cost of any delays, or damages that occur during transport.</p>
          </div>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Flame size={20} /> Fuel Costs</h4>
            <p>Fuel costs are a significant component of transportation expenses, particularly for road and air transport. Fluctuations in fuel prices can significantly impact transportation costs.</p>
            <p className="mt-2">Implementing fuel-efficient transportation practices, such as optimizing routes and using fuel-efficient vehicles, can help to mitigate the impact of fuel price volatility. This also includes the use of alternative fuels.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Warehouse size={20} /> Warehousing and Distribution Costs</h4>
            <p>These costs include expenses related to storing and distributing goods, such as warehouse rent, labour, utilities, and handling equipment. They also include the costs of operating distribution centres and managing inventory.</p>
            <p className="mt-2">Optimizing warehouse layouts, implementing efficient inventory management systems, and streamlining distribution processes can help to reduce warehousing and distribution costs. This also includes the cost of any damage that occurs to goods while in storage.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Packaging Costs</h4>
            <p>These costs include the expenses associated with packaging materials, and labour. Packaging is necessary to protect goods during transport.</p>
            <p className="mt-2">Finding the right balance between protection, and cost is key to managing these costs. This includes the cost of any damage caused by insufficient packaging.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><TruckIcon size={20} /> Delivery Costs</h4>
            <p>These costs include the expenses associated with the final delivery of goods to customers. This includes last-mile delivery, and customer service related to delivery.</p>
            <p className="mt-2">Optimizing delivery routes and utilizing delivery tracking software can help to reduce delivery costs. This also includes the cost of any returns.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">Inventory Costs</h3>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Warehouse size={20} /> Holding Costs (Carrying Costs)</h4>
            <p>These costs are associated with storing and maintaining inventory over a period. They include expenses such as warehousing costs (rent, utilities, labour), insurance, obsolescence (the cost of inventory becoming outdated or unusable), deterioration, and the opportunity cost of capital tied up in inventory.</p>
            <p className="mt-2">Effective inventory management aims to minimize holding costs by optimizing inventory levels, improving forecasting accuracy, and reducing lead times. This includes the ability to use "just in time" inventory management.</p>
          </div>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Receipt size={20} /> Ordering Costs (Setup Costs)</h4>
            <p>These costs are incurred each time an order is placed with a supplier, or a production run is initiated. They include expenses related to processing purchase orders, transportation, receiving, inspection, and administrative tasks. For manufacturing, setup costs include the costs of preparing equipment for production.</p>
            <p className="mt-2">Reducing ordering costs can be achieved by consolidating orders, automating purchasing processes, and negotiating long-term contracts with suppliers. This also includes the costs of any errors that occur during the ordering process.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Shortage Costs (Stockout Costs)</h4>
            <p>These costs arise when inventory is insufficient to meet customer demand. They include expenses such as lost sales, customer dissatisfaction, backorder costs, and potential damage to the company's reputation.</p>
            <p className="mt-2">Accurate demand forecasting, safety stock management, and responsive supply chain planning can help to minimize shortage costs. This also includes the cost of emergency shipments.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Trash2 size={20} /> Inventory Obsolescence Costs</h4>
            <p>These costs are incurred when inventory becomes outdated, damaged, or unusable. This is especially true for products with short life cycles, or products that are subject to rapid technological change.</p>
            <p className="mt-2">Effective product lifecycle management, and accurate demand forecasting can help minimize these costs. This also includes the costs associated with disposing of obsolete inventory.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Inventory Shrinkage Costs</h4>
            <p>These costs are incurred when inventory is lost due to theft, damage, or administrative errors.</p>
            <p className="mt-2">Implementing strong inventory control measures, such as regular audits, security systems, and accurate record-keeping, can help to minimize shrinkage costs. This also includes the costs of any insurance claims.</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-indigo-600 dark:text-indigo-400">Quality Costs</h3>

          <div className={cardClasses('blue')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Prevention Costs</h4>
            <p>These costs are incurred to prevent defects and quality problems from occurring in the first place. They include expenses related to quality planning, training, process improvement, and supplier evaluation.</p>
            <p className="mt-2">Investing in prevention costs can lead to significant cost savings in the long run by reducing the need for rework, scrap, and warranty claims. This includes the costs of implementing quality management systems.</p>
          </div>

          <div className={cardClasses('green')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Appraisal Costs</h4>
            <p>These costs are incurred to assess and evaluate the quality of products or services. They include expenses related to inspections, testing, audits, and quality control activities.</p>
            <p className="mt-2">Thorough appraisal processes help to identify defects and ensure that products or services meet quality standards before they reach customers. This includes the costs of any testing equipment.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Wrench size={20} /> Internal Failure Costs</h4>
            <p>These costs are incurred when defects are detected before products or services reach customers. They include expenses related to rework, scrap, retesting, and downtime.</p>
            <p className="mt-2">Minimizing internal failure costs requires effective quality control processes and timely corrective actions. This includes the costs of any production delays.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> External Failure Costs</h4>
            <p>These costs are incurred when defects are detected after products or services reach customers. They include expenses related to warranty claims, product returns, customer complaints, and legal liabilities.</p>
            <p className="mt-2">External failure costs can significantly impact customer satisfaction and brand reputation. Proactive quality management is essential to minimize these costs. This includes the costs of any recalls.</p>
          </div>

          <div className={cardClasses('red')}>
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Quality Training Costs</h4>
            <p>These costs are incurred when a company trains employees on quality control procedures, and quality management systems.</p>
            <p className="mt-2">Properly trained employees are more likely to produce higher quality products and have less errors. This cost is a preventative cost, that saves money in the long term.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Supply Chain Performance</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Performance Indicators</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">KPIs</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balanced Scorecard</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supply Chain Costs</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Supply Chain Performance. 📊📈</p>
        </footer>

      </div>
    </div>
  );
};
