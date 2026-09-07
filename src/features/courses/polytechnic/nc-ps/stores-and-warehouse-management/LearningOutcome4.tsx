import React from 'react';
import {
  // Folder & File - Core
  FolderTree,
  FileText,
  FileText as FileTextIcon,
  FileCheck,
  FileCheck as FileCheckIcon,
  FileSignature,
  FileSignature as FileSignatureIcon,
  FilePlus,
  FilePlus as FilePlusIcon,
  FileMinus,
  FileMinus as FileMinusIcon,
  FileEdit,
  FileEdit as FileEditIcon,
  FileSearch,
  FileSearch as FileSearchIcon,
  FileSpreadsheet,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileClock,
  FileClock as FileClockIcon,
  FileX,FileX2 as Reorder,
  FileX as FileXIcon,
  FileBadge,
  FileBadge as FileBadgeIcon,
  FileKey,
  FileKey as FileKeyIcon,
  FileLock,
  FileLock as FileLockIcon,

  // Clipboard
  Clipboard,
  Clipboard as ClipboardIcon,
  ClipboardList,
  ClipboardList as ClipboardListIcon,
  ClipboardCheck,

  // Charts & Data Viz
  BarChart,
  BarChart3,
  BarChart4,
  LineChart,
  LineChart as LineChartIcon,
  PieChart,
  PieChart as PieChartIcon,
  GanttChart,
  Table,
  Table as TableIcon,
  ChartLine,
  ChartNoAxesCombined,
  ChartColumn,
  ChartPie,
  TrendingUp,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowRightCircle,
  Equal,

  // People & Users
  User,
  User as UserIcon,
  UserRound,
  UserPlus,
  UserMinus,
  UserCheck,
  UserCheck as UserCheckIcon,
  UserX,
  UserCog,
  Users,
  Users as UsersIcon,
  UsersRound,
  UsersRound as UsersRoundIcon,

  // Buildings & Places
  Building,
  Building as BuildingIcon,
  Building2,
  Building2 as BuildingIcon2,
  Factory,
  Factory as FactoryIcon,
  Warehouse,
  Warehouse as WarehouseIcon,
  Store,
  Store as StoreIcon,
  Home,
  Landmark,
  Landmark as LandmarkIcon,

  // Money & Finance
  DollarSign,
  DollarSign as DollarSignIcon,
  CreditCard,
  CreditCard as CreditCardIcon,
  Banknote,
  PiggyBank,
  Coins,
  Wallet,
  HandCoins,

  // Communication
  Mail,
  Mail as MailIcon,
  Phone,
  Phone as PhoneIcon,
  MessageCircle,
  MessageCircle as MessageCircleIcon,
  MessageSquare,
  MessageSquare as MessageSquareIcon,
  Mic,
  Megaphone,
  Radio,

  // Navigation & Location
  MapPin,
  MapPin as MapPinIcon,
  Globe,
  Globe as GlobeIcon,

  // Status & Alerts
  CheckCircle,
  CheckCircle as CheckCircleIcon,
  XCircle,
  XCircle as XCircleIcon,
  AlertTriangle,
  AlertTriangle as AlertTriangleIcon,
  AlertOctagon,
  AlertCircle,
  Bell,
  ShieldAlert,

  // Security & Access
  Shield,
  Shield as ShieldIcon,
  ShieldCheck,
  Lock,
  Lock as LockIcon,
  Unlock,
  Key,
  Key as KeyIcon,
  DoorOpen,
  DoorOpen as DoorOpenIcon,
  DoorClosed,
  DoorClosed as DoorClosedIcon,
  Fence,
  Fence as FenceIcon,  
  Camera,
  Camera as CameraIcon,
  Video,
  Video as VideoIcon,
  AlarmClock,
  AlarmClock as AlarmClockIcon,

  // Packages & Inventory
  Box,
  Boxes,
  Boxes as BoxesIcon,
  Package,
  Package as PackageIcon,
  PackageOpen,
  PackageOpen as PackageOpenIcon,
  PackageCheck as PackageCheckIcon,
  PackageX as PackageXIcon,
  PackageSearch as PackageSearchIcon,
 
  Forklift,

  // Transport & Logistics
  Truck,
  Truck as TruckIcon,
  ShoppingCart,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag,

  // Actions & Flow
  RefreshCw,
  RefreshCw as RefreshCwIcon,
  Repeat,
  Repeat as RepeatIcon,
  GitBranch,
  GitBranch as GitBranchIcon,
  Link,
  Link as LinkIcon,
  Network,
  Network as NetworkIcon,
  Filter,
  Filter as FilterIcon,

  // Time & Calendar
  Calendar,
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  Clock as ClockIcon,

  // Legal & Compliance
  Scale,
  Scale as ScaleIcon,
  Gavel,
  Gavel as GavelIcon,
  Handshake,
  Handshake as HandshakeIcon,
  BadgeCheck,
  BadgeCheck as BadgeCheckIcon,

  // Business & Work
  Briefcase,
  Briefcase as BriefcaseIcon,
  BriefcaseBusiness,
  Target,
  Target as TargetIcon,
  Award,
  Award as AwardIcon,
  Star,
  Star as StarIcon,
  LayersIcon,
  Tag,

  // Tech & System
  Cpu,
  Database,
  Database as DatabaseIcon,
  Hash,
  Settings,
  Wrench,
  Zap,
  Zap as ZapIcon,
  Eye,
  PenTool,

  // Layout & UI
  Grid,
  Layout as LayoutIcon,
  Maximize,
  Minimize,
  Hand as HandIcon,

  // Environment & Nature
  Leaf,
  Leaf as LeafIcon,
  Sun,
  Sun as SunIcon,
  Cloud,
  CloudRain,
  Wind,
  Wind as WindIcon,
  Droplets,
  Droplet,
  Droplet as DropletIcon, 
  TreePine,
  Mountain,
  Mountain as MountainIcon,
  Recycle,
  Recycle as RecycleIcon,
  Trash,
  Flame, 

  // Hazard & Safety
  HardHat,
  HardHat as HardHatIcon,
  TrafficCone,
  Siren,
  Siren as SirenIcon,
  FireExtinguisher, 
  Glasses, 
  Radiation, 
  Biohazard, 
  Thermometer,
  Skull,

  // Accessibility & Transport 
  Bike,
  Footprints,
  Accessibility,

  // Misc
  BookOpen,
  BookOpen as BookOpenIcon,
  ListChecks,
  ListChecks as ListChecksIcon,
  Heart,
  Heart as HeartIcon,
  Search as SearchIcon, 
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
              Stock Control & <span className="text-amber-300 font-bold italic">Security Standards</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to re-order levels, security standards, physical stock counts, reconciling records, and maintaining stores records in line with standards.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">stock_control.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">RE-ORDER</span><span className="text-white">Levels;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">SECURE</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">COUNT</span><span className="text-white">Stock;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Reorder className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: RE-ORDER LEVELS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Re-order Levels According to Organizational Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Implementing effective stock control is crucial for maintaining optimal inventory levels, minimizing costs, and ensuring smooth operational flow. A key element of this is establishing re-order levels, which are the predetermined inventory thresholds that trigger replenishment orders. These levels are not arbitrary; they are meticulously calculated and tailored to the specific needs and demands of the organization. Essentially, re-order levels act as a safety net, preventing stockouts while minimizing excess inventory and associated holding costs. The process involves a thorough analysis of historical sales data, lead times, demand forecasts, and organizational policies. By aligning re-order levels with these factors, businesses can optimize their inventory management and ensure that they always have the right amount of stock on hand.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DatabaseIcon size={20} /> Analysis of Historical Sales Data and Demand Forecasting</h3>
            <p>Organizations must analyse historical sales data to identify trends, seasonal variations, and fluctuations in demand. This analysis provides valuable insights into past consumption patterns, which are crucial for forecasting future demand. Advanced forecasting techniques, such as moving averages, exponential smoothing, or time series analysis, may be employed to predict future demand with greater accuracy. By understanding historical demand patterns and forecasting future needs, businesses can establish re-order levels that align with anticipated sales volumes. This analysis also helps to pinpoint items that have volatile demand, and those that have steady demand. The volatility of the demand dictates how high the safety stock needs to be.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClockIcon size={20} /> Consideration of Lead Times</h3>
            <p>Lead time refers to the time it takes for a supplier to deliver an order after it has been placed. This factor is critical in determining re-order levels. Organizations must accurately estimate lead times for each item, considering factors such as supplier performance, transportation logistics, and potential delays. Longer lead times necessitate higher re-order levels to ensure that sufficient stock remains on hand until the replenishment order arrives. The lead time needs to be considered, along with the average daily usage of the product, to ensure that the reorder level is set high enough to cover the time it takes to receive the new stock.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> Determination of Safety Stock Levels</h3>
            <p>Safety stock is the extra inventory held to buffer against unexpected fluctuations in demand or lead times. Organizations must determine appropriate safety stock levels for each item based on factors such as demand variability, lead time variability, and the cost of stockouts. Higher safety stock levels reduce the risk of stockouts but increase holding costs. The organization must strike a balance between these competing factors. Safety stock calculations may involve statistical methods, such as calculating standard deviations of demand and lead times, to determine appropriate buffer levels. The level of safety stock is also dictated by the importance of the product. If a product is vital to production, or customer satisfaction, then a larger safety stock will be required.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> Alignment with Organizational Policies and Goals</h3>
            <p>Re-order levels must align with the overall inventory management policies and goals of the organization. This includes considering factors such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Customer service levels:</strong> Organizations with high customer service level expectations may need to maintain higher re-order levels to minimize the risk of stockouts.</li>
              <li><strong>Inventory holding costs:</strong> Organizations seeking to minimize inventory holding costs may opt for lower re-order levels and safety stock levels.</li>
              <li><strong>Cash flow constraints:</strong> Organizations with limited cash flow may need to carefully manage re-order levels to avoid tying up excessive capital in inventory.</li>
              <li><strong>Supplier relationships:</strong> The reliability and flexibility of suppliers can influence re-order level decisions.</li>
              <li>The company's overall financial goals, and risk tolerance, also play a large role in the determination of reorder levels.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> Regular Review and Adjustment</h3>
            <p>Re-order levels are not static and should be regularly reviewed and adjusted based on changing market conditions, demand patterns, and supplier performance. Implementing a system for periodic review and adjustment ensures that re-order levels remain aligned with the organization's current needs. This can include using inventory management software that provides real-time data and automated re-order level adjustments.</p>
          </div>
        </section>

        {/* ========== SECTION 2: SECURITY STANDARDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Security Standards</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>In the modern warehousing landscape, security is not a mere afterthought; it is a cornerstone of operational integrity. Adhering to robust security standards is paramount for safeguarding valuable assets, protecting sensitive information, and ensuring the safety of personnel. A secure warehouse minimizes risks associated with theft, vandalism, unauthorized access, and cyber threats, thereby fostering a stable and trustworthy environment for both employees and stakeholders.</p>
            <p className="mt-2">Implementing a comprehensive security strategy involves a multi-faceted approach, encompassing physical security measures, data protection protocols, and employee training. It is about creating a proactive security posture that anticipates potential threats and mitigates vulnerabilities before they can be exploited.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><LockIcon size={20} /> Key Security Standards and Implementation</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Physical Access Control:</strong> This aspect focuses on restricting entry to the warehouse and specific areas within it to authorized personnel only. Implementing a layered access control system is essential. This begins with perimeter security, which may include fences, gates, and strategically placed lighting. Electronic access control systems, such as key card readers, biometric scanners, or PIN pads, should be deployed at entry points to regulate and track personnel movement. CCTV surveillance systems provide continuous monitoring of critical areas, deterring potential intruders and providing valuable evidence in case of incidents. Visitor management systems are also crucial for recording and monitoring the presence of non-employees. These systems ensure that all individuals entering the warehouse are accounted for and that their movements are tracked. Furthermore, compartmentalizing high-value or sensitive areas with additional layers of access control, such as locked cages or secure rooms, further enhances security. Properly maintained fire exits, that still trigger alarms when used, is also a necessity.</li>
              <li><strong>Inventory Security and Loss Prevention:</strong> Protecting inventory from theft, damage, and unauthorized access is a primary security objective. This involves implementing robust inventory management systems that provide real-time visibility into stock levels and movements. Regular inventory audits are essential for identifying discrepancies and potential losses. Secure storage practices, such as the use of locked cages, sealed containers, and controlled access storage areas, are crucial for safeguarding high-value items. Implementing seal and check procedures during receiving and dispatch ensures that goods are properly accounted for and that any tampering is detected. Additionally, utilizing tracking technologies, such as RFID or barcode scanning, can enhance inventory visibility and reduce the risk of loss. Implementing a culture of reporting any discrepancies, or suspicious activity, is also vital.</li>
              <li><strong>Cybersecurity Measures:</strong> In an increasingly digital environment, cybersecurity is a critical component of warehouse security. This involves protecting sensitive data, such as inventory records, customer information, and financial data, from unauthorized access and cyberattacks. Implementing strong password policies, firewalls, intrusion detection systems, and data encryption protocols is essential. Regular software updates and security patches are crucial for mitigating vulnerabilities. Employee training on cybersecurity best practices, such as recognizing phishing scams and avoiding suspicious links, is also vital. Conducting regular cybersecurity assessments and penetration testing helps identify and address potential weaknesses in the network infrastructure. Backing up critical data and implementing disaster recovery plans ensures business continuity in the event of a cyberattack.</li>
              <li><strong>Employee Security and Background Checks:</strong> Ensuring the trustworthiness and reliability of employees is a critical aspect of warehouse security. Conducting thorough background checks on new hires helps mitigate the risk of hiring individuals with criminal records or a history of dishonesty. Providing comprehensive security awareness training to all employees is essential for educating them on security protocols, reporting procedures, and the importance of maintaining a secure environment. Establishing clear policies and procedures for reporting suspicious activity and security incidents fosters a culture of vigilance. Implementing employee access levels, that only give access to the information, and areas, required by the job role is also very important.</li>
              <li><strong>Surveillance and Monitoring Systems:</strong> Utilizing advanced surveillance and monitoring technologies enhances security and provides valuable evidence in the event of incidents. CCTV systems provide continuous video surveillance of critical areas, deterring potential intruders and capturing footage of suspicious activity. Alarm systems, including motion detectors and door/window sensors, trigger alerts in response to unauthorized entry or other security breaches. Remote monitoring capabilities enable off-site surveillance of the warehouse, allowing for timely response to security incidents. Integrating surveillance systems with access control systems provides a comprehensive security solution. Regular maintenance and testing of surveillance and monitoring systems are essential for ensuring their effectiveness.</li>
              <li><strong>Security Audits and Compliance:</strong> Regular security audits and assessments are essential for identifying vulnerabilities and ensuring that security measures are effective. These audits should be conducted by qualified security professionals and should cover all aspects of warehouse security, including physical security, cybersecurity, and employee security. Compliance with relevant security regulations, such as data privacy laws and industry-specific standards, is crucial. Maintaining accurate records of security incidents, audits, and compliance activities demonstrates a commitment to security best practices. Implementing a program of continuous improvement ensures that security measures are regularly reviewed and updated to address emerging threats and vulnerabilities.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: PHYSICAL STOCK COUNT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Physical Stock Count According to Set Guidelines</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Accurate inventory management is fundamental to efficient warehouse operations. A crucial component of this is the physical stock count, a process where actual inventory levels are verified against recorded data. To ensure accuracy and consistency, physical stock counts must be conducted according to established guidelines. These guidelines provide a structured framework for the counting process, minimizing errors, ensuring thoroughness, and maintaining the integrity of inventory records. By adhering to set guidelines, organizations can reconcile discrepancies, identify potential losses, and improve the overall reliability of their inventory data.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CalendarIcon size={20} /> Key Aspects of Conducting Physical Stock Counts According to Set Guidelines</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Establishing a Clear Counting Schedule and Frequency:</strong> Guidelines must outline a clear schedule for physical stock counts, specifying the frequency and timing of counts. This schedule should be based on factors such as inventory turnover, the value of goods, and the level of risk associated with stock discrepancies. High-value or fast-moving items may require more frequent counts than low-value or slow-moving items. The guidelines should also specify whether counts will be conducted on a full inventory basis (cycle counting) or on a specific subset of items. A set schedule allows for planning and minimizing disruption to normal warehouse operations. The guidelines also need to specify if the count will be a blind count, or if counters will have access to the recorded inventory data.</li>
              <li><strong>Defining Counting Procedures and Methodologies:</strong> The guidelines must clearly define the procedures and methodologies to be used during the physical stock count. This includes specifying the counting units (e.g., units, cases, pallets), the counting tools to be used (e.g., handheld scanners, counting scales), and the counting techniques to be employed. Clear and concise instructions should be provided to counting personnel to ensure consistency and accuracy. The guidelines should also address how to handle specific situations, such as damaged goods, partially filled containers, and items stored in multiple locations. The counting method needs to be clearly defined, so that all counters perform the count in the same way.</li>
              <li><strong>Assigning Roles and Responsibilities:</strong> The guidelines should clearly assign roles and responsibilities for the physical stock count. This includes identifying the individuals responsible for planning, conducting, and verifying the count. Clear roles and responsibilities ensure accountability and minimize confusion during the counting process. The guidelines should also specify the reporting lines and communication protocols to be followed. It is important to define who is responsible for resolving any discrepancies that are found during the count.</li>
              <li><strong>Implementing Data Recording and Reconciliation Procedures:</strong> The guidelines must establish clear procedures for recording and reconciling inventory data. This includes specifying the data fields to be recorded (e.g., item code, quantity, location), the data entry methods to be used (e.g., manual entry, barcode scanning), and the data validation procedures to be followed. The guidelines should also address how to handle discrepancies between the physical count and the recorded inventory data. This may involve investigating the cause of the discrepancy, adjusting inventory records, and implementing corrective actions. The method of recording the data must be easy to use, and accurate.</li>
              <li><strong>Ensuring Security and Control:</strong> The guidelines should incorporate security and control measures to prevent unauthorized access to inventory and ensure the integrity of the counting process. This may involve restricting access to counting areas, implementing security checks on counting personnel, and securing counting data. The guidelines should also address how to handle sensitive or high-value items during the count. Security during the count is important, to prevent theft, or manipulation of the count.</li>
              <li><strong>Documentation and Reporting:</strong> Thorough documentation and reporting are essential for maintaining accurate inventory records and tracking the results of physical stock counts. The guidelines should specify the documentation requirements, including count sheets, discrepancy reports, and reconciliation reports. The guidelines should also specify the reporting requirements, including the frequency and format of reports. Good documentation is vital for auditing purposes.</li>
              <li><strong>Training and Communication:</strong> Effective training and communication are crucial for ensuring that counting personnel understand and adhere to the guidelines. This involves providing comprehensive training on counting procedures, data recording methods, and security protocols. The guidelines should also establish communication channels for addressing questions and resolving issues during the count.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: RECORDS RECONCILED WITH PHYSICAL STOCK ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records - Reconciled with Physical Stock</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The process of reconciling records with physical stock is the critical step that bridges the gap between theoretical inventory data and the actual state of goods on hand. It is not merely a comparison; it is a meticulous investigation and corrective action process aimed at ensuring data accuracy and operational integrity. Discrepancies between recorded inventory and physical stock can arise from various sources, including errors in receiving, picking, or data entry, as well as theft or damage. Reconciling these differences is essential for maintaining accurate inventory records, preventing stockouts or overstocking, and ensuring that financial reports accurately reflect the value of the company's assets.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Key Aspects of Reconciling Records with Physical Stock</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Identifying and Documenting Discrepancies:</strong> The first step involves comparing the physical stock count results with the recorded inventory data. Any differences between the two are identified and documented, including the item code, the quantity discrepancy, and the location of the discrepancy. Accurate documentation is crucial for investigating the cause of the discrepancy and implementing corrective actions. Documentation should be clear, and easy to read. This documentation will be used in future audits.</li>
              <li><strong>Investigating the Causes of Discrepancies:</strong> Once discrepancies are identified, it is essential to investigate their root causes. This may involve reviewing receiving records, picking records, shipping records, and other relevant documentation. Potential causes include: Data entry errors: Mistakes in recording inventory transactions. Picking errors: Incorrect items or quantities picked for orders. Receiving errors: Incorrect items or quantities received from suppliers. Theft or damage: Loss of inventory due to theft or damage. Misplaced items: Items stored in incorrect locations. System errors: Glitches in inventory management systems. A thorough investigation helps to pinpoint the source of the problem and prevent future occurrences.</li>
              <li><strong>Adjusting Inventory Records:</strong> Based on the investigation findings, inventory records are adjusted to reflect the actual physical stock levels. This may involve increasing or decreasing the recorded quantity of items, depending on the nature of the discrepancy. All adjustments should be documented and approved by authorized personnel. This step ensures that the inventory data is accurate and up to date.</li>
              <li><strong>Implementing Corrective Actions:</strong> Reconciling records with physical stock is not just about adjusting data; it is also about implementing corrective actions to prevent future discrepancies. This may involve: Improving training for warehouse personnel. Implementing stricter controls on inventory transactions. Improving the accuracy of data entry. Enhancing security measures to prevent theft. Reviewing and improving warehouse layout and storage practices. Corrective actions should be targeted at the root causes of the discrepancies and should be monitored for effectiveness.</li>
              <li><strong>Auditing and Verification:</strong> After adjustments are made, and corrective actions are implemented, it is essential to conduct audits and verification checks to ensure that the discrepancies have been resolved and that inventory records are accurate. This may involve conducting follow-up physical stock counts or reviewing inventory transaction reports. Audits should be performed by people not directly involved in the stock count.</li>
              <li><strong>Maintaining Accurate Records of Reconciliations:</strong> All reconciliation activities, including discrepancy reports, investigation findings, and adjustment records, should be meticulously documented and maintained. This documentation provides a valuable audit trail and helps to identify trends or recurring issues. These records are vital for future audits, and for improving warehouse processes.</li>
              <li><strong>System Improvements:</strong> If systemic issues are found, then the inventory management system, or the warehouse management system, should be reviewed, and improved. This can involve software updates, or the addition of hardware.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: STORES RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stores Records - Maintained in Line with Standards</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Maintaining accurate and compliant stores records is fundamental to the efficient and effective management of any warehouse or storage facility. These records provide a comprehensive overview of inventory levels, movements, and transactions, enabling organizations to track stock, optimize inventory management, and ensure regulatory compliance. Adherence to established standards ensures consistency, accuracy, and reliability of these records, facilitating informed decision-making and minimizing the risk of errors or discrepancies. Effective records management requires a systematic approach, encompassing data entry, storage, retrieval, and auditing procedures.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DatabaseIcon size={20} /> How Stores Records are Maintained in Line with Standards</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Standardized Data Entry and Format:</strong> Establishing standardized data entry procedures and formats is crucial for ensuring consistency and accuracy in stores records. This involves defining clear guidelines for data fields, units of measurement, and data entry methods. Using standardized item codes, descriptions, and location identifiers minimizes the risk of errors and facilitates data retrieval. Implementing data validation rules and automated checks helps to prevent incorrect or incomplete data entry. Utilizing inventory management software with predefined data fields and formats can further enhance data accuracy and consistency.</li>
              <li><strong>Accurate and Timely Recording of Transactions:</strong> All inventory transactions, including receiving, issuing, transfers, and adjustments, must be recorded accurately and promptly. Delays or inaccuracies in recording transactions can lead to discrepancies and errors in inventory records. Implementing real-time data entry systems and using barcode scanners or RFID technology can improve the speed and accuracy of transaction recording. Regular audits and checks should be conducted to ensure that all transactions are properly recorded.</li>
              <li><strong>Secure Storage and Retrieval of Records:</strong> Stores records must be securely stored and easily retrievable. This involves implementing appropriate storage methods, whether physical or digital, to protect records from damage, loss, or unauthorized access. Digital records should be backed up regularly and stored in secure servers or cloud-based systems. Physical records should be stored in designated areas with controlled access. Implementing a robust record retrieval system, such as an electronic document management system (EDMS) or a well-organized filing system, facilitates efficient access to records when needed. Access levels should be set, so that only authorized personnel can access sensitive information.</li>
              <li><strong>Compliance with Regulatory Requirements:</strong> Stores records must comply with all applicable regulatory requirements, including industry-specific standards and legal obligations. This may involve maintaining records for specific periods, adhering to data privacy regulations, and complying with audit requirements. Organizations must stay informed of changes in regulations and update their record-keeping practices accordingly.</li>
              <li><strong>Regular Audits and Reviews:</strong> Regular audits and reviews of stores records are essential for identifying and correcting errors, discrepancies, and inconsistencies. This involves comparing recorded inventory data with physical stock counts, reviewing transaction records, and verifying data accuracy. Audits should be conducted by independent personnel to ensure objectivity. The findings of audits should be documented and used to improve record-keeping practices.</li>
              <li><strong>Documentation of Procedures and Policies:</strong> Clear and comprehensive documentation of stores record-keeping procedures and policies is essential for ensuring consistency and compliance. This includes documenting data entry procedures, record storage and retrieval methods, audit procedures, and compliance requirements. Documentation should be readily accessible to all relevant personnel and should be regularly reviewed and updated.</li>
              <li><strong>Training and Communication:</strong> Effective training and communication are crucial for ensuring that all personnel involved in stores record-keeping understand and adhere to established standards. This involves providing comprehensive training on data entry procedures, record-keeping policies, and compliance requirements. Regular communication and feedback sessions can help to address questions and resolve issues.</li>
              <li><strong>Utilizing Inventory Management Systems:</strong> Modern inventory management systems provide tools that automate many record keeping processes. These systems can provide real time data, audit trails, and reporting that greatly increase the accuracy and efficiency of record keeping practices.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Stock Control & Security Standards</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Re-order Levels</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Standards</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock Counts</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Record Reconciliation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stores Records</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Stock Control & Security. 📊🔒</p>
        </footer>

      </div>
    </div>
  );
};
