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
  FileX,
  FileX as FileXIcon,
  FileBadge,
  FileBadge as FileBadgeIcon,
  FileKey,
  FileKey as FileKeyIcon,
  FileLock,
  FileLock as FileLockIcon,

  // Clipboard
  Clipboard,ClipboardCheckIcon,
  Clipboard as ClipboardIcon,
  ClipboardList,
  ClipboardList as ClipboardListIcon,
  ClipboardCheck,

  // Charts & Data Viz
  BarChart,
  BarChart3,
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
  DoorClosed,
  Fence,
  Camera,
  Video,
  AlarmClock,

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
  Search as SearchIcon,

  // Layout & UI
  Grid,
  Layout as LayoutIcon,
  Maximize,
  Minimize,

  // Environment & Nature
  Leaf,
  Leaf as LeafIcon,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Droplet,
  Droplet as DropletIcon,
  TreePine,
  Mountain,
  Recycle,
  Flame,
  Skull, 

  // Misc
  BookOpen,
  BookOpen as BookOpenIcon,
  ListChecks,
  ListChecks as ListChecksIcon,
  Heart,
  Heart as HeartIcon,
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
              Receiving Process & <span className="text-sky-300 font-bold italic">Stock Records</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to receiving goods, verifying specifications, handling defective goods, signed invoices, GRVs, bin cards, and updating stock records.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">receiving_stock.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">RECEIVE</span><span className="text-white">Goods;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">VERIFY</span><span className="text-white">Specs;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">UPDATE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><ClipboardList className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Package className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: RECEIVING PROCESS OF GOODS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Receiving Process of Goods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>In the receiving process of goods, "quantities verified against order" refers to the crucial step of confirming that the physical quantity of goods received from a supplier matches the quantity specified in the purchase order. This verification is essential for maintaining accurate inventory records, preventing financial discrepancies, and ensuring that the organization receives the correct number of materials or products it ordered.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileCheckIcon size={20} /> Verification Against the Purchase Order</h3>
            <p>The receiving personnel begins by comparing the physical goods received with the corresponding purchase order (PO). This document outlines the agreed-upon quantities, specifications, and other details of the ordered items. The PO serves as the primary reference point for the verification process, ensuring that the received goods align with the organization's requirements.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Physical Count and Inspection</h3>
            <p>The receiving team conducts a physical count of the received goods, carefully verifying the quantity of each item. This may involve counting individual units, boxes, pallets, or other packaging units. During this process, they also perform a visual inspection of the goods to check for any visible damage, defects, or discrepancies in quality. This inspection is very important, because if damage is found, it can be reported immediately.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Documentation and Recording</h3>
            <p>The verified quantities are meticulously documented and recorded. This may involve updating inventory management systems, creating receiving reports, or signing delivery documents. Accurate documentation is crucial for maintaining accurate inventory records and resolving any discrepancies that may arise. If there are any differences between the quantity on the PO, and the quantity physically received, then that difference must be noted on all paperwork.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangleIcon size={20} /> Addressing Discrepancies</h3>
            <p>If any discrepancies are found between the ordered and received quantities, the receiving team must take immediate action. This may involve: Notifying the supplier of the discrepancy and seeking resolution. Adjusting inventory records to reflect the actual quantity received. Investigating the cause of the discrepancy to prevent future occurrences. If there is a shortage, then a back order may be created. If there is an overage, then a decision must be made whether to keep the extra stock or return it to the supplier. Promptly addressing discrepancies is essential for maintaining accurate inventory control and preventing financial losses.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Sign-Off and Confirmation</h3>
            <p>Once the quantities have been verified and any discrepancies have been addressed, the receiving personnel sign off on the delivery documents, confirming that the goods have been received and verified. This sign-off serves as proof of receipt and acceptance of the goods, establishing a clear record of the transaction.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> Importance</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Accurate Inventory Management:</strong> Verifying quantities ensures that inventory records are accurate and up to date, preventing stockouts or overstocking.</li>
              <li><strong>Financial Control:</strong> Accurate quantity verification helps to prevent financial discrepancies and ensures that the organization pays only for the goods it receives.</li>
              <li><strong>Supplier Accountability:</strong> Verifying quantities holds suppliers accountable for delivering the correct amount of goods, fostering trust, and ensuring compliance with purchase orders.</li>
              <li><strong>Quality Control:</strong> Visual inspections during quantity verification can help to identify damaged or defective goods, preventing them from entering the supply chain.</li>
              <li><strong>Order fulfillments:</strong> If the company sells the goods that they receive, then accurate receiving is very important to ensure that customer orders can be fulfilled.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: VERIFYING PRODUCT SPECIFICATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Verifying Product Specifications Against the Order</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Verifying product specifications against the order during the receiving process is a critical quality control measure that ensures the received goods align with the precise requirements outlined in the purchase order. It goes beyond simply counting the items; it involves a meticulous examination of the product's characteristics, features, and performance to confirm they meet the agreed-upon standards.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Understanding the Purchase Order Specifications</h3>
            <p>The receiving personnel must thoroughly understand the product specifications outlined in the purchase order. This includes details such as: Dimensions and weight, Materials and composition, Colour, finish, and appearance, Performance characteristics (e.g., electrical ratings, operating temperatures), Quality standards and certifications, and any specific testing or inspection requirements.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Physical Inspection and Testing</h3>
            <p>The receiving team conducts a physical inspection of the received goods, comparing them to the specifications outlined in the purchase order. This may involve: Measuring dimensions and weight. Examining materials and composition. Comparing colours and finishes. Conducting visual inspections for defects or damage. Performing functional tests to verify performance characteristics. Using specialized testing equipment to verify quality standards. The level of inspection and testing will vary depending on the nature of the product, the criticality of the specifications, and the organization's quality control procedures.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Documentation and Recording</h3>
            <p>The results of the inspection and testing are meticulously documented and recorded. This may involve: Completing inspection checklists or reports. Taking photographs or videos of the goods. Recording measurements and test results. Updating inventory management systems with quality data. Accurate documentation is essential for maintaining quality control records, resolving any discrepancies, and providing evidence of compliance with specifications.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangleIcon size={20} /> Addressing Discrepancies and Non-Conformances</h3>
            <p>If any discrepancies or non-conformances are found between the received goods and the specifications, the receiving team must take immediate action. This may involve: Notifying the supplier of the discrepancy and seeking resolution. Rejecting the non-conforming goods and arranging for return or replacement. Segregating non-conforming goods to prevent them from entering the production or sales process. Investigating the cause of the discrepancy to prevent future occurrences. Requesting a Certificate of Analysis, or other relevant document from the supplier to prove conformity. Promptly addressing discrepancies is essential for maintaining quality control and preventing defective products from reaching customers.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Sign-Off and Confirmation</h3>
            <p>Once the product specifications have been verified and any discrepancies have been addressed, the receiving personnel sign off on the delivery documents, confirming that the goods meet the required standards. This sign-off serves as proof of inspection and acceptance of the goods, establishing a clear record of the transaction.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> Importance</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Quality Assurance:</strong> Verifying product specifications ensures that the organization receives goods that meet its quality standards, preventing defective products from entering the supply chain.</li>
              <li><strong>Customer Satisfaction:</strong> Receiving goods that meet specifications helps to ensure customer satisfaction and prevent product returns or complaints.</li>
              <li><strong>Compliance:</strong> Verifying specifications helps to ensure compliance with industry standards, regulations, and customer requirements.</li>
              <li><strong>Risk Mitigation:</strong> Identifying and addressing non-conformances early in the receiving process can prevent costly rework, recalls, or warranty claims.</li>
              <li><strong>Supplier Performance Evaluation:</strong> Tracking discrepancies and non-conformances can provide valuable data for evaluating supplier performance and identifying areas for improvement.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: HANDLING DEFECTIVE GOODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Handling Defective Goods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> Immediate Segregation and Labelling</h3>
            <p>Upon the discovery of defective goods, the paramount action is immediate segregation. This is not merely a physical separation; it is a critical step in halting the potential spread of compromised products throughout the operational flow. By isolating defective items, a company effectively erects a barrier, preventing their inadvertent integration into production lines or their dispatch to unsuspecting customers. This segregation should be executed with meticulous precision, ensuring that the defective goods are moved to a designated area, clearly distinct from the standard inventory.</p>
            <p className="mt-2">The labelling process that follows is equally vital. Each defective item, or container holding such items, must be conspicuously marked with tags or labels that unequivocally indicate their non-conforming status. These labels should not only highlight the presence of defects but also provide a concise description of the nature of the flaw, the precise date and time of discovery, and the identity of the individual who detected the issue. This detailed labelling serves as an immediate, visual cue, alerting all personnel to the compromised nature of the goods and preventing any accidental mishandling.</p>
            <p className="mt-2">The segregated area itself should be secured, perhaps with restricted access or clear demarcation, to further prevent any confusion or unintentional mixing with acceptable inventory. This swift and decisive action is the cornerstone of effective defect management, setting the stage for subsequent analysis and resolution.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Detailed Documentation and Reporting</h3>
            <p>The meticulous documentation of defective goods is not simply an administrative task; it is the creation of a comprehensive audit trail that provides a clear and traceable history of the defect. This documentation must be thorough, encompassing every relevant detail that could shed light on the nature, extent, and origin of the problem. It should include the precise quantity of defective items, a detailed narrative describing the specific defect observed, and, where possible, photographic, or video evidence to visually capture the flaw.</p>
            <p className="mt-2">The date and time of discovery, the purchase order number or lot number, the supplier's identity, and the name of the person who identified the defect are all essential pieces of information that must be meticulously recorded. This detailed record serves multiple purposes: it facilitates internal tracking and analysis, it provides crucial information for communicating with the supplier, and it forms the basis for informed decisions regarding the disposition of the defective goods.</p>
            <p className="mt-2">Simultaneously, the reporting process is crucial for disseminating this information to the relevant departments within the organization. Quality control, purchasing, and management teams must be promptly informed of the defect, enabling them to initiate the necessary corrective actions and prevent future occurrences. This transparent reporting ensures that all stakeholders are aware of the issue and can contribute to its resolution.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageCircleIcon size={20} /> Supplier Notification and Communication</h3>
            <p>The immediate notification of the supplier regarding the defective goods is paramount in maintaining a transparent and collaborative relationship. This notification should be accompanied by all relevant documentation and information gathered during the initial inspection, providing the supplier with a clear understanding of the issue. Open and honest communication is essential for fostering trust and ensuring a swift resolution. The organization should engage in a dialogue with the supplier, exploring potential solutions and determining the most appropriate course of action. This may involve arranging for the return of the defective goods for replacement or credit, requesting a repair or rework of the items, or negotiating a price adjustment or discount to compensate for the defect. The goal is to establish a mutually agreeable resolution that minimizes disruption and maintains a positive working relationship. This collaborative approach not only addresses the immediate issue but also strengthens the partnership and reduces the likelihood of future defects.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><SearchIcon size={20} /> Quality Control Investigation and Root Cause Analysis</h3>
            <p>A comprehensive quality control investigation is essential for determining the root cause of the defect and preventing its recurrence. This investigation should delve deep into the manufacturing process, scrutinizing every stage from raw material selection to final product assembly. The materials used should be analysed for any deviations from specifications, and the quality control procedures should be thoroughly reviewed for any potential weaknesses.</p>
            <p className="mt-2">If necessary, tests and analyses should be performed to replicate the defect and identify its underlying cause. This meticulous analysis may involve both the receiving company and the supplying company, fostering a collaborative effort to uncover the truth. Identifying the root cause is not merely an academic exercise; it is a crucial step in implementing effective corrective actions. By understanding the origin of the defect, the organization can take steps to prevent similar issues from arising in the future, improving overall quality, and reducing costs.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Box size={20} /> Disposition of Defective Goods</h3>
            <p>The determination of the appropriate disposition for defective goods requires a careful evaluation of various factors, including the cost of repair, the value of the goods, and the organization's policies. The decision may involve returning the goods to the supplier, repairing, or reworking them in-house, scrapping or disposing of them, or selling them as "seconds" or "damaged goods" at a discounted price. Each of these options has its own set of implications and should be carefully considered. Returning the goods to the supplier may be the most straightforward solution, but it can also be time-consuming and costly. Repairing or reworking the goods may be a viable option if the defect is minor and the cost of repair is reasonable. Scrapping or disposing of the goods may be necessary if they are beyond repair or if they pose a safety hazard. Selling them as "seconds" or "damaged goods" can help to recoup some of the losses, but it can also impact the organization's brand image. The disposition decision should be based on a thorough cost-benefit analysis and should be documented to ensure transparency and accountability. Any scrapping or disposal of the goods should be done in accordance with environmental regulations and company policy, minimizing any negative impact on the environment.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> Inventory and Financial Adjustments</h3>
            <p>The discovery and disposition of defective goods necessitate corresponding adjustments to both inventory and financial records. Inventory records must be updated to reflect the removal of the defective items, ensuring accurate stock levels, and preventing discrepancies. Financial adjustments may be required to account for the loss of value or the cost of replacement. If a credit is to be issued by the supplier, the financial records must be updated to reflect this credit, ensuring accurate accounting and reconciliation. These adjustments are not merely administrative formalities; they are essential for maintaining the integrity of the organization's financial and inventory management systems. Accurate records are crucial for informed decision-making, financial reporting, and audit compliance. Any discrepancies or errors in these records can lead to significant problems, impacting the organization's bottom line and its reputation. Therefore, meticulous attention to detail is paramount in ensuring that all adjustments are made accurately and promptly.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> Preventative Measures: Building a Culture of Continuous Improvement</h3>
            <p>The identification and resolution of defective goods should not be viewed as isolated events but rather as opportunities for continuous improvement. The organization should implement preventative measures to reduce the likelihood of future defects, building a culture of quality and excellence. This may involve improving quality control procedures, strengthening supplier relationships, providing additional training to employees, and implementing more rigorous inspection processes. Continuous improvement is not a one-time effort; it is an ongoing process that requires commitment and dedication from all levels of the organization. By embracing a culture of continuous improvement, the organization can minimize losses, enhance customer satisfaction, and maintain a competitive edge. This commitment to quality is not only beneficial for the organization but also for its customers, suppliers, and employees.</p>
          </div>
        </section>

        {/* ========== SECTION 4: IMPORTANCE OF A SIGNED INVOICE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of a Signed Invoice</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>When a signed invoice or delivery note is availed, it signifies a crucial point in the transaction between a supplier and a customer, marking the formal acknowledgment of goods or services received. This signed document serves as tangible proof of delivery and acceptance, holding significant legal and financial implications.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Proof of Delivery and Acceptance</h3>
            <p>The primary function of a signed invoice or delivery note is to provide concrete evidence that the goods or services specified in the document were indeed delivered and accepted by the customer. The customer's signature acts as a formal acknowledgment that they have received the items listed and that they are in satisfactory condition, unless otherwise noted on the document. This signed document protects the supplier from claims of non-delivery or disputes regarding the quantity or condition of the goods.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><GavelIcon size={20} /> Legal Implications</h3>
            <p>A signed invoice or delivery note can serve as a legally binding document in case of disputes or legal proceedings. It establishes a clear record of the transaction, including the date of delivery, the items delivered, and the recipient's acknowledgment. In many jurisdictions, a signed delivery note can be used as evidence in court to support claims for payment or to defend against claims of non-delivery. It can be used to prove that a contract was fulfilled.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> Financial Implications</h3>
            <p>For the supplier, a signed invoice or delivery note is essential for initiating the payment process. It serves as proof that the goods or services were delivered, justifying the issuance of an invoice and the expectation of payment. For the customer, the signed document confirms their obligation to pay for the goods or services received. It also serves as a crucial document for accounting and auditing purposes, ensuring accurate financial records. Many companies will not process an invoice for payment, without an accompanying signed delivery note.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DatabaseIcon size={20} /> Inventory Management</h3>
            <p>The signed document can be used to update inventory records, confirming the receipt of goods, and ensuring accurate stock levels. This is particularly important for businesses that rely on accurate inventory tracking to manage their supply chain. It allows for the reconciliation of physical stock, and the recorded stock levels.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> Dispute Resolution</h3>
            <p>In the event of a dispute regarding the quantity, quality, or condition of the goods, the signed invoice or delivery note can serve as a valuable reference point. It provides a clear record of what was delivered and accepted, helping to resolve disagreements quickly and efficiently. Any notes written on the document, at the time of signing, are also very important during dispute resolution.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><UsersIcon size={20} /> Customer Relationship Management</h3>
            <p>The process of obtaining a signed invoice or delivery note can also serve as an opportunity to reinforce customer relationships. A professional and courteous approach to obtaining the signature can leave a positive impression on the customer. It also provides an opportunity to confirm customer satisfaction. In summary, a signed invoice or delivery note is a critical document that plays a vital role in ensuring smooth and transparent transactions between suppliers and customers. It provides legal and financial protection, supports efficient inventory management, and facilitates dispute resolution.</p>
          </div>
        </section>

        {/* ========== SECTION 5: GOODS RECEIVED VOUCHER (GRV) ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Goods Received Voucher (GRV)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>A Goods Received Voucher (GRV) is a crucial document in the receiving process of goods, serving as an internal record that confirms the receipt of items into a company's inventory. It is distinct from a signed invoice or delivery note, which primarily acts as proof of delivery and acceptance between a supplier and customer. The GRV, on the other hand, is an internal document that captures the details of the received goods for the organization's own record-keeping and inventory management.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Internal Record of Receipt</h3>
            <p>The GRV acts as a formal, internal record that goods have been received into the warehouse or receiving area. It documents the details of the received goods, including quantities, descriptions, and any relevant information. This creates a clear audit trail of incoming goods, which is essential for accurate inventory management and financial control.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DatabaseIcon size={20} /> Inventory Management</h3>
            <p>The GRV serves as a basis for updating inventory records. It triggers the process of adding the received goods to the company's inventory system. This ensures that inventory levels are accurate and up to date, preventing stockouts or overstocking. It assists in tracking the movement of goods within the warehouse, from receiving to storage and beyond.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardCheckIcon size={20} /> Verification and Reconciliation</h3>
            <p>The GRV is often used to verify the received goods against the purchase order and the supplier's delivery note. This helps to identify any discrepancies in quantities, specifications, or quality. It provides a mechanism for reconciling differences between what was ordered, what was delivered, and what was received.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> Financial Control</h3>
            <p>The GRV plays a vital role in financial control by providing documentation to support the payment of supplier invoices. It serves as evidence that the goods were received, justifying the payment of the invoice. It helps to prevent fraudulent payments or payments for goods that were not received. It contributes to accurate cost accounting by recording the value of received goods.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Quality Control</h3>
            <p>The GRV may include information about the condition of the received goods, such as any visible damage or defects. This information can be used to initiate quality control inspections and to address any issues with the supplier. It provides a record of quality-related issues, which can be used to evaluate supplier performance.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardListIcon size={20} /> Audit Trail and Compliance</h3>
            <p>The GRV creates an audit trail that can be used to track the movement of goods and to verify compliance with internal policies and procedures. This is particularly important for businesses that are subject to regulatory requirements or audits. It provides documentation to support financial transactions and inventory records.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageCircleIcon size={20} /> Internal Communication</h3>
            <p>The GRV serves as a communication tool between the receiving department and other departments, such as purchasing, accounting, and production. It provides information about the received goods, which can be used to plan production schedules, manage inventory levels, and process invoices. In essence, a Goods Received Voucher is a vital internal control document that ensures accurate inventory management, financial control, and quality assurance. It provides a comprehensive record of received goods, supporting efficient and effective warehouse operations.</p>
          </div>
        </section>

        {/* ========== SECTION 6: PROCESS OF PRODUCING UPDATED BIN CARDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Process Of Producing Updated bin Cards</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ZapIcon size={20} /> The Trigger: Identifying the Need for Updates Through Transactional Activity and Audits</h3>
            <p>The journey of a bin card, that humble yet vital record of inventory, is one of constant evolution, driven by the ebb and flow of goods within a warehouse. The most frequent catalyst for updating these cards is the sheer volume of transactional activity that occurs daily. Every time new items arrive from a supplier, or when finished goods are produced within the facility, these receipts must be meticulously recorded. This ensures that the bin card accurately reflects the increase in stock. Conversely, when items are issued for sales orders, production needs, or internal consumption, these movements must also be diligently noted, reflecting the corresponding decrease in inventory.</p>
            <p className="mt-2">Adjustments, those necessary corrections for errors or discrepancies discovered during physical counts, are equally important. These corrections ensure that the recorded stock levels align with the actual physical inventory, maintaining data integrity. Furthermore, the transfer of items between different bins or storage locations necessitates updates to the bin cards of both the originating and receiving bins, ensuring a clear and accurate record of all movements. Beyond these transactional updates, periodic physical counts, known as cycle counts or audits, play a crucial role. These counts serve as a validation mechanism, comparing the recorded stock levels with the actual physical inventory.</p>
            <p className="mt-2">Discrepancies found during these counts trigger immediate updates, ensuring that the bin cards remain a reliable reflection of the stock on hand. In essence, the trigger for updating bin cards arises from any activity that alters the quantity or location of inventory, ensuring that these records remain a dynamic and accurate reflection of the warehouse's contents.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><PenTool size={20} /> The Process: Meticulous Recording and Accurate Calculations for Data Integrity</h3>
            <p>The act of updating a bin card is not a mere scribbling of numbers; it is a meticulous process that demands accuracy and attention to detail. Each transaction, whether it is a receipt, issue, adjustment, or transfer, must be recorded with precision. The date of the transaction, the type of transaction, and the quantity involved are all essential pieces of information that must be clearly and legibly documented.</p>
            <p className="mt-2">The balance column, reflecting the current stock level in the bin, is updated after each transaction, requiring accurate calculations to ensure that the numbers are correct. This running balance provides a real-time snapshot of the inventory on hand, enabling warehouse personnel to make informed decisions. Furthermore, the reference number of the relevant document, such as a purchase order, sales order, or transfer slip, must be recorded, providing an audit trail that allows for easy tracking and verification. The initials or signature of the person who recorded the transaction are also essential, ensuring accountability and traceability.</p>
            <p className="mt-2">Entries must be neat and legible, made in permanent ink to prevent errors or tampering. If an error is made, it must be corrected by drawing a single line through the incorrect entry and writing the correct information above or beside it, strictly prohibiting erasing or overwriting. This meticulous approach to recording transactions ensures the integrity of the bin card data, providing a reliable foundation for inventory management.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> The Production of New Cards: Responding to Card Exhaustion, Relocation, and System Changes</h3>
            <p>The life of a bin card, like any physical document, is finite. When a card is filled with entries, reaching its capacity, a new card must be produced. This ensures that there is always sufficient space to record ongoing transactions. The new card is not simply a blank slate; it must be accurately populated with the current balance of inventory, ensuring continuity of data. Similarly, if inventory is relocated from one bin to another, a new bin card is created for the new location.</p>
            <p className="mt-2">This ensures that the card accurately reflects the current storage location of the items. In situations where an organization migrates to a new inventory management system, new bin cards may be produced to align with the new system's data structure and formats. This ensures compatibility between the physical records and the digital system. Moreover, if a bin card is damaged, lost, or becomes illegible due to wear and tear, a new card must be produced to replace it. This ensures that the records remain accurate and accessible.</p>
            <p className="mt-2">The production of new bin cards is not merely a matter of replacing old documents; it is about maintaining the integrity and accuracy of the inventory records, ensuring that they remain a reliable tool for warehouse management.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Verification and Reconciliation: Ensuring Accuracy Through Regular Checks and Audits</h3>
            <p>The accuracy of bin cards is not simply a matter of recording transactions; it is also about verifying and reconciling the data on a regular basis. Regular checks, comparing the physical stock levels in the bin with the balance recorded on the bin card, are essential. These checks help to identify and correct any discrepancies that may have arisen due to errors or omissions. If an inventory management system is used, the bin card data must be regularly compared with the system data to ensure consistency between the physical records and the digital system.</p>
            <p className="mt-2">This synchronization helps to prevent errors and ensures that both systems are aligned. Moreover, maintaining audit trails by retaining old bin cards is crucial. These old cards provide a historical record of inventory transactions, allowing for easy tracking and verification. They also facilitate audits, providing evidence of compliance with inventory management policies and procedures.</p>
            <p className="mt-2">The process of verification and reconciliation is not merely a matter of checking numbers; it is about ensuring the reliability and accuracy of the inventory data, providing a foundation for informed decision-making and efficient warehouse operations.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> The Importance: Enabling Accurate Control, Efficiency, and Financial Integrity</h3>
            <p>The production of updated bin cards is not just an administrative task; it is a fundamental aspect of inventory management that has far-reaching implications for the entire organization. Accurate inventory control, preventing stockouts and overstocking, is enabled by reliable bin card data. This ensures that the right items are available at the right time, minimizing disruptions to production and sales.</p>
            <p className="mt-2">Moreover, regular updates and verifications minimize the risk of errors and discrepancies, contributing to improved efficiency and reduced costs. Accurate inventory data supports efficient warehouse operations, including picking, packing, and shipping, ensuring timely fulfilments of customer orders.</p>
            <p className="mt-2">Up-to-date bin cards contribute to accurate financial reporting, preventing losses due to inventory discrepancies and ensuring compliance with financial regulations. They also facilitate audits, providing a clear and traceable record of inventory transactions. Ultimately, updated bin cards provide real-time, at-the-bin-level information about the quantity of stock, empowering warehouse personnel to make informed decisions and maintain optimal inventory levels. In essence, the production of updated bin cards is a vital process that ensures the accuracy, reliability, and integrity of inventory data, supporting efficient and effective warehouse management.</p>
          </div>
        </section>

        {/* ========== SECTION 7: UPDATING STOCK RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Updating Stock Records</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Updating stock records in line with procurement policies is a crucial practice for maintaining accurate inventory control, ensuring financial integrity, and optimizing supply chain efficiency. This process involves a systematic approach to recording and managing inventory transactions, adhering to established procurement guidelines and procedures.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BookOpenIcon size={20} /> Understanding and Implementing Procurement Policies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Policy Awareness:</strong> The first step is to ensure that all personnel involved in inventory management and procurement are thoroughly familiar with the organization's procurement policies. These policies typically outline procedures for: Purchasing and receiving goods, Inventory valuation and accounting, Stock rotation and obsolescence management, Disposal of surplus or damaged goods, Authorization levels for inventory transactions.</li>
              <li><strong>Policy Adherence:</strong> All inventory transactions must be conducted in strict adherence to these policies. This ensures consistency, transparency, and accountability throughout the procurement and inventory management process.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DatabaseIcon size={20} /> Accurate Recording of Inventory Transactions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Real-Time Updates:</strong> Stock records should be updated in real-time or as close to real-time as possible. This minimizes the risk of discrepancies and ensures that inventory data is always current.</li>
              <li><strong>Transaction Documentation:</strong> Every inventory transaction must be accompanied by accurate and complete documentation, such as: Purchase orders, Delivery notes, Goods received vouchers, Stock issue slips, Inventory adjustment forms.</li>
              <li><strong>Data Entry Accuracy:</strong> Data entry into inventory management systems must be accurate and consistent. This involves verifying quantities, item codes, and other relevant information.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><LinkIcon size={20} /> Integration of Procurement and Inventory Systems</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>System Integration:</strong> Ideally, procurement and inventory management systems should be integrated to facilitate seamless data flow and eliminate manual data entry.</li>
              <li><strong>Automated Updates:</strong> Automated updates can be configured to trigger when procurement transactions occur, such as when a purchase order is placed or when goods are received.</li>
              <li><strong>Data Synchronization:</strong> Regular synchronization of data between systems is essential to ensure consistency and accuracy.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardCheckIcon size={20} /> Regular Reconciliation and Audits</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Cycle Counts:</strong> Regular cycle counts, which involve physically counting a subset of inventory items, should be conducted to verify the accuracy of stock records.</li>
              <li><strong>Periodic Audits:</strong> Periodic audits of inventory records should be performed to identify and correct any discrepancies or errors.</li>
              <li><strong>Variance Analysis:</strong> Variances between physical inventory and recorded inventory should be investigated and documented.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> Inventory Valuation and Accounting</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Valuation Methods:</strong> Inventory valuation methods, such as FIFO (first-in, first-out) or weighted average, should be consistently applied in accordance with accounting standards and procurement policies.</li>
              <li><strong>Cost Tracking:</strong> Accurate tracking of inventory costs is essential for financial reporting and cost control.</li>
              <li><strong>Obsolescence Provisions:</strong> Provisions for inventory obsolescence should be established and regularly reviewed to reflect the potential loss of value due to aging or technological changes.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> Stock Rotation and Obsolescence Management</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Stock Rotation:</strong> Stock rotation policies, such as FIFO, should be implemented to ensure that older inventory is used before newer inventory.</li>
              <li><strong>Obsolescence Monitoring:</strong> Regular monitoring of inventory for signs of obsolescence is essential to prevent losses.</li>
              <li><strong>Disposal Procedures:</strong> Procedures for the disposal of obsolete or damaged goods should be clearly defined and followed.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> Authorization and Security</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Authorization Levels:</strong> Authorization levels for inventory transactions should be established to prevent unauthorized access and manipulation of stock records.</li>
              <li><strong>Security Controls:</strong> Security controls should be implemented to protect inventory data from unauthorized access, modification, or deletion.</li>
              <li><strong>Audit Trails:</strong> Audit trails should be maintained to track all inventory transactions and identify any potential security breaches.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Receiving Process & Stock Records</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Receiving Process</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Defective Goods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">GRV</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bin Cards</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock Records</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Receiving & Stock Records. 📋📦</p>
        </footer>

      </div>
    </div>
  );
};
