import React from 'react';
import {
  // File & Document
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
  Clipboard,
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
  Building2 as BuildingIcon6,
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
  Barcode,

  // Transport & Logistics
  Truck,
  Truck as TruckIcon,
  ShoppingCart,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag,

  // Actions & Flow
  ArrowRightCircle,
  RefreshCw,
  RefreshCw as RefreshCwIcon,
  Repeat,
  Repeat as RepeatIcon,
  ArrowUpDown,
  GitBranch,
  GitBranch as GitBranchIcon,
  Link,
  Link as LinkIcon,
  Network,
  Network as NetworkIcon,

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
  Layers as LayersIcon,

  // Tech & System
  Cpu,
  Database,
  Database as DatabaseIcon,
  Settings,
  Wrench,
  Zap,
  Zap as ZapIcon,
  Filter,
  Eye,
  PenTool,
  Search as SearchIcon,

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
  Droplet as DropletIcon , 
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
  Thermometer,

  // Icons without clean lucide equivalents (kept as named)
  Skull,
  Bike,
  Footprints,
  Accessibility,
  Megaphone,
  Radio,
  Hash,
  ListChecks,
  ListChecks as ListChecksIcon,
  BookOpen,
  BookOpen as BookOpenIcon,
  Heart,
  Heart as HeartIcon,
  Maximize,
  Minimize,
  Layout as LayoutIcon,
  Grid,

  // Misc numeric/structural
  Calendar as CalendarIcon2,
  FileText as FileTextIcon2,
  FolderTree as FolderTreeIcon,
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
              Warehouse Layout & <span className="text-purple-300 font-bold italic">SHEQ Standards</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to arranging goods, dispatch procedures, SHEQ standards, housekeeping best practices, and security standards in warehouse management.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">warehouse_SHEQ.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">LAYOUT</span><span className="text-white">Arrangement;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">SHEQ</span><span className="text-white">Standards;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SECURITY</span><span className="text-white">Systems;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><LayoutIcon className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: ARRANGING GOODS ACCORDING TO WAREHOUSE LAYOUT ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Arranging Goods According to Warehouse Layout</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> The Foundation: Understanding and Crafting the Warehouse Layout as a Strategic Blueprint</h3>
            <p>The warehouse layout is not a mere arrangement of shelves and aisles; it is a carefully crafted strategic blueprint, designed to optimize the flow of goods and maximize operational efficiency. It begins with a thorough understanding of the specific characteristics of the stored goods, encompassing their size, weight, shape, and fragility. The volume of inventory, both current and projected, is also a critical consideration, as it dictates the required storage capacity and the overall size of the warehouse.</p>
            <p className="mt-2">The frequency of inventory turnover, indicating how quickly goods move through the warehouse, influences the placement of items and the design of picking and packing areas. The intended flow of materials, from receiving to storage to shipping, is meticulously mapped out, ensuring a smooth and efficient movement of goods throughout the facility. This involves identifying potential bottlenecks and designing the layout to minimize travel distances and handling time.</p>
            <p className="mt-2">The layout typically divides the warehouse into distinct zones, each serving a specific purpose, such as receiving, storage, picking, packing, and shipping. Within the storage zone, individual locations are assigned to different types of goods, creating a structured and organized environment. The configuration of aisles is also a critical element, optimized to facilitate the smooth and efficient movement of materials handling equipment, such as forklifts and pallet jacks, and personnel. The overarching goal is to create a logical and intuitive flow, minimizing travel distances, reducing the time required to locate and retrieve items, and maximizing the overall efficiency of warehouse operations. This strategic arrangement ensures that goods are stored in a manner that supports efficient operations, minimizes the risk of errors or delays, and contributes to the overall success of the business.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BoxesIcon size={20} /> The Selection: Matching Storage Systems to Goods Characteristics and Operational Needs</h3>
            <p>The selection of appropriate storage systems is not a one-size-fits-all approach; it is a meticulous process of matching storage solutions to the specific characteristics of the stored goods and the operational needs of the warehouse. Racking and shelving systems are chosen based on the size, weight, and characteristics of the stored goods, ensuring that they are safely and securely stored. Pallet racking, designed for storing palletized goods, is commonly used for heavy and bulky items. Shelving units, available in various configurations and sizes, are ideal for storing smaller items and cartons. Bins, often used for storing small parts and components, provide easy access and organization.</p>
            <p className="mt-2">The concept of storage density is paramount, as it directly impacts the overall efficiency of the warehouse. Storage systems are selected to maximize the amount of storage space utilized per unit area, allowing for the storage of a greater volume of goods within the available space. However, maximizing storage density must be balanced with the need for accessibility. Storage systems are designed to ensure easy access to stored goods, facilitating efficient picking and retrieval.</p>
            <p className="mt-2">This balance between storage density and accessibility is crucial for optimizing warehouse operations and minimizing handling time. Factors such as the height of the warehouse, the type of materials handling equipment used, and the frequency of inventory turnover are all considered when selecting storage systems. The goal is to create a storage environment that is both efficient and safe, ensuring that goods are stored in a manner that supports smooth and efficient operations.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> The Placement: Strategic Principles for Optimal Efficiency and Minimization of Handling Time</h3>
            <p>The placement of goods within the warehouse is not a random act; it is guided by a set of strategic principles, designed to optimize efficiency, and minimize handling time. Goods are categorized based on factors such as product type, size, weight, and frequency of turnover, allowing for the creation of logical storage groupings. ABC analysis, a widely used inventory management technique, is often employed to prioritize storage locations.</p>
            <p className="mt-2">High-demand items (A items), which account for a significant portion of sales, are placed in easily accessible locations, minimizing the time required for picking and retrieval. Low-demand items (C items), on the other hand, are placed in less accessible locations, as they are less frequently accessed. Products that are frequently used together are stored near each other, streamlining picking and assembly operations. Heavy and bulky items are stored at lower levels, ensuring stability, and minimizing the risk of accidents. Lighter items are stored at higher levels, maximizing space utilization.</p>
            <p className="mt-2">Perishable goods or goods with expiration dates are stored according to a first-in, first-out (FIFO) or first-expired, first-out (FEFO) system, ensuring that older stock is used before newer stock. Some items may be assigned dedicated storage locations to ensure their availability and prevent misplacement. These strategic placement strategies ensure that goods are stored in a manner that supports efficient operations, minimizes the risk of errors or delays, and contributes to the overall productivity of the warehouse.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Barcode size={20} /> The Identification: Ensuring Accuracy and Streamlining Operations Through Clear Labelling and Technology Integration</h3>
            <p>The effective implementation of a warehouse layout relies heavily on clear labelling and identification, ensuring accuracy and streamlining operations. Each storage location is clearly labelled with a unique identifier, such as a bin number or location code, allowing for easy identification and retrieval of stored goods. Each item or container is labelled with a product code, description, and other relevant information, ensuring accurate tracking and inventory management. Barcode and radio-frequency identification (RFID) technology are increasingly used to automate inventory tracking and improve accuracy.</p>
            <p className="mt-2">These technologies allow for the rapid and accurate scanning of items, minimizing the risk of errors and streamlining operations. Clear labelling and identification are essential for maintaining an organized and efficient warehouse environment, facilitating the smooth flow of goods, and minimizing the risk of errors. Location labelling should be standardized, using clear and concise identifiers that are easily understood by all warehouse personnel. Product labelling should include all relevant information, such as product codes, descriptions, and quantities.</p>
            <p className="mt-2">Barcode and RFID technology should be integrated with the warehouse management system (WMS), allowing for real-time tracking of inventory and automated data capture. This integration ensures that inventory data is accurate and up to date, supporting informed decision-making and efficient warehouse operations.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> The Maintenance: Ensuring Ongoing Efficiency and Safety Through Regular Inspections and Housekeeping</h3>
            <p>Maintaining organization and cleanliness within the warehouse is an ongoing process, requiring regular inspections and good housekeeping practices. Regular inspections are conducted to ensure that goods are stored in their designated locations and that the warehouse is clean and organized. Good housekeeping practices, such as sweeping, dusting, and removing debris, are essential for maintaining a safe and efficient warehouse environment. Periodically, the warehouse layout may be reorganized to optimize space utilization and improve efficiency. This may involve reconfiguring storage locations, rearranging aisles, or implementing new storage systems.</p>
            <p className="mt-2">These ongoing efforts to maintain organization and cleanliness ensure that the warehouse remains a safe, efficient, and productive environment. Regular inspections help to identify and address potential safety hazards, such as damaged racking or spills. Good housekeeping practices minimize the risk of accidents and create a more pleasant working environment. Periodic reorganization allows the warehouse to adapt to changing inventory levels and operational needs. These ongoing efforts to maintain organization and cleanliness are essential for ensuring the long-term efficiency and safety of the warehouse.</p>
          </div>
        </section>

        {/* ========== SECTION 2: GOODS ARRANGED IN LINE WITH DISPATCH PROCEDURES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Goods Arranged in Line with Dispatch Procedures</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>This principle emphasizes the importance of aligning storage strategies with the specific requirements of the dispatch process. Rather than simply organizing goods based on size, type, or frequency of movement, this approach prioritizes the smooth and efficient flow of products from storage to outbound transportation. It ensures that items are readily accessible and positioned in a way that minimizes handling time, reduces errors, and optimizes the overall dispatch operation. Effectively, it means that the storage layout and placement of goods are determined by the sequence and methods used to fulfil customer orders and prepare shipments. This integration streamlines operations, reduces bottlenecks, and ultimately leads to faster and more accurate order fulfilments.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> Key Aspects</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Minimizing Travel Distance and Handling:</strong> The core idea is to reduce the physical distance that goods need to travel from their storage location to the dispatch area. This is achieved by strategically placing frequently dispatched items closer to the loading docks or shipping zones. Furthermore, the storage arrangement should minimize the number of times an item needs to be handled. For instance, if a product is typically picked and packed in a specific sequence, the storage layout should reflect that sequence. This might involve storing related items in adjacent locations or organizing goods in a flow-through system where they move directly from receiving to dispatch with minimal intermediate storage. Reducing travel distance and handling not only saves time and labour but also decreases the risk of damage to goods during movement. In larger warehouses, this may involve implementing dedicated picking zones or using automated guided vehicles (AGVs) that follow pre-defined routes based on dispatch requirements.</li>
              <li><strong>Prioritizing High-Velocity Items:</strong> Items with high turnover rates, often referred to as "fast-moving" goods, should be given preferential storage locations. These items should be placed in easily accessible areas, ideally near the front of the warehouse or in designated "pick faces" that are optimized for quick retrieval. Analysing sales data and order patterns is crucial for identifying these high-velocity items. By prioritizing their placement, warehouse managers can significantly reduce the time required to fulfil orders. For example, if a certain product consistently accounts for a large percentage of daily shipments, it should be stored in a location that minimizes travel time for pickers. This might involve using forward pick locations that are replenished from reserve storage as needed, ensuring that the most popular items are always readily available.</li>
              <li><strong>Implementing FIFO or FEFO Systems as Required by Dispatch:</strong> Dispatch procedures often dictate the need for specific inventory rotation methods, such as First-In, First-Out (FIFO) or First-Expired, First-Out (FEFO). FIFO is commonly used for perishable goods or items with a limited shelf life, ensuring that older stock is shipped before newer stock. FEFO is crucial for products with expiration dates, such as food and pharmaceuticals, to prevent the dispatch of expired items. The storage layout must support these rotation methods. This might involve using racking systems that allow for easy access to older stock or implementing automated systems that track expiration dates and prioritize the dispatch of items nearing their expiration. Failing to adhere to these rotation methods can lead to product spoilage, customer dissatisfaction, and regulatory compliance issues.</li>
              <li><strong>Adapting Storage to Order Picking Methods:</strong> Different order picking methods, such as single-order picking, batch picking, or wave picking, require different storage configurations. For example, in batch picking, where multiple orders are picked simultaneously, it is beneficial to store items in a way that facilitates efficient picking across multiple orders. This might involve grouping similar items together or using zone picking systems where pickers are assigned to specific areas of the warehouse. Similarly, wave picking, where orders are processed in waves based on shipping schedules, requires a storage layout that supports the efficient consolidation of items for each wave. The storage system must be flexible enough to accommodate the specific requirements of the chosen order picking method, ensuring that pickers can quickly and accurately retrieve the necessary items.</li>
              <li><strong>Considering Packaging and Shipping Requirements:</strong> The storage arrangement should also consider the packaging and shipping requirements of the goods. For example, fragile items may need to be stored in protective packaging and placed in locations that minimize the risk of damage during handling. Similarly, oversized, or heavy items may require specialized storage solutions and handling equipment. The storage layout should also consider the dimensions and weight of shipping containers, ensuring that items can be easily loaded and secured for transport. Additionally, if products are often shipped together, it may be beneficial to store them near facilitate efficient packing and loading. This comprehensive approach ensures that the entire dispatch process, from storage to shipping, is optimized for efficiency and accuracy.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: SHEQ STANDARDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Safety, Health, Environment, and Quality (SHEQ) Standards Adhered To</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>It is crucial to emphasize the importance of Safety, Health, Environment, and Quality (SHEQ) standards within warehouse management.</p>
            <p className="mt-2">Warehouses, by their very nature, present a variety of potential hazards. From heavy machinery and moving vehicles to stacked inventory and potential chemical spills, the risks are significant. Adhering to strict SHEQ standards is not just a regulatory requirement; it is a fundamental responsibility to protect the well-being of employees, minimize environmental impact, and ensure the quality of stored goods.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HardHatIcon size={20} /> Safety</h3>
            <p>Warehouse safety involves preventing accidents and injuries. This includes implementing measures to mitigate risks associated with forklift operation, manual handling, falls, and other potential hazards. Key elements include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Proper training:</strong> Ensuring all employees are thoroughly trained on safe operating procedures for equipment, material handling, and emergency response.</li>
              <li><strong>Regular inspections:</strong> Conducting routine inspections of equipment, racking systems, and the overall warehouse environment to identify and address potential hazards.</li>
              <li><strong>Use of PPE:</strong> Enforcing the use of appropriate personal protective equipment, such as safety shoes, helmets, and high-visibility vests.</li>
              <li><strong>Clearly marked pathways and safety zones:</strong> Implementing clear signage and markings to guide traffic flow and designate safe areas.</li>
            </ul>
            <p className="mt-2">Warehouse safety is not a onetime activity. It requires constant vigilance, and a culture of safety where employees are encouraged to report potential hazards.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HeartIcon size={20} /> Health</h3>
            <p>Warehouse health focuses on protecting employees from occupational illnesses and long-term health risks. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ergonomics:</strong> Implementing ergonomic principles to minimize strain and injuries associated with repetitive tasks and heavy lifting.</li>
              <li><strong>Ventilation:</strong> Ensuring adequate ventilation to prevent exposure to dust, fumes, and other airborne contaminants.</li>
              <li><strong>Noise control:</strong> Implementing measures to reduce noise levels from machinery and equipment.</li>
              <li><strong>Hazardous material handling:</strong> Establishing safe procedures for handling and storing hazardous materials.</li>
            </ul>
            <p className="mt-2">Promoting employee health, also includes things like providing access to fresh water, and breaks.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><LeafIcon size={20} /> Environment</h3>
            <p>Environmental considerations involve minimizing the warehouse's impact on the environment. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Waste management:</strong> Implementing recycling programs and safe disposal procedures for waste materials.</li>
              <li><strong>Energy efficiency:</strong> Utilizing energy-efficient lighting, equipment, and HVAC systems.</li>
              <li><strong>Spill prevention and control:</strong> Establishing procedures for preventing and containing spills of hazardous materials.</li>
              <li><strong>Responsible sourcing:</strong> Considering the environmental impact of packaging and other materials.</li>
            </ul>
            <p className="mt-2">Modern warehousing is increasingly focused on sustainability.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Quality</h3>
            <p>Quality standards ensure that stored goods are maintained in optimal condition and that customer orders are fulfilled accurately and efficiently. This includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Temperature and humidity control:</strong> Implementing systems to maintain appropriate environmental conditions for sensitive goods.</li>
              <li><strong>Inventory management:</strong> Utilizing accurate inventory tracking systems to prevent errors and ensure product traceability.</li>
              <li><strong>Damage prevention:</strong> Implementing measures to prevent damage to goods during handling and storage.</li>
              <li><strong>Quality control checks:</strong> Conducting regular checks to ensure that goods meet quality standards.</li>
            </ul>
            <p className="mt-2">Quality control is also important for customer satisfaction.</p>
          </div>
        </section>

        {/* ========== SECTION 4: HOUSEKEEPING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Housekeeping in Accordance with Best Practices</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Effective warehouse housekeeping goes beyond simply sweeping floors. It encompasses a comprehensive approach to maintaining cleanliness, order, and safety throughout the facility. Adhering to best practices in housekeeping contributes significantly to accident prevention, operational efficiency, and a positive work environment.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> Key Elements</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Regular Cleaning Schedules:</strong> Establishing and adhering to regular cleaning schedules is fundamental. This includes routine tasks such as sweeping, mopping, dusting, and removing debris. The frequency of cleaning should be determined based on the specific needs of the warehouse, considering factors such as the type of goods stored, the level of traffic, and the potential for spills or contamination. For example, areas where hazardous materials are handled may require more frequent cleaning than general storage areas. Scheduled cleaning prevents the build-up of dust, dirt, and debris, which can create slip and trip hazards, as well as affect product quality.</li>
              <li><strong>Clear and Organized Storage:</strong> A well-organized storage system is essential for effective housekeeping. This involves maintaining clear aisles, properly stacking and labelling inventory, and ensuring that all items are stored in their designated locations. Implementing a "place for everything and everything in its place" philosophy minimizes clutter and facilitates efficient retrieval of goods. Clear aisles are also critical for safe movement of personnel and equipment. Regularly auditing storage areas to identify and address any instances of disorganization is crucial.</li>
              <li><strong>Waste Management and Disposal:</strong> Implementing a comprehensive waste management program is vital for maintaining a clean and safe warehouse. This includes providing adequate waste receptacles, segregating different types of waste, and ensuring timely disposal. Best practices also involve implementing recycling programs to minimize environmental impact. Proper disposal of hazardous waste is especially important. Leaks and spills should be addressed immediately.</li>
              <li><strong>Spill Prevention and Clean-up:</strong> Spills are a common occurrence in warehouses, and prompt clean-up is essential to prevent accidents and damage. Implementing spill prevention measures, such as using drip trays and storing liquids in appropriate containers, can help minimize the risk of spills. Having readily available spill clean-up kits and ensuring that employees are trained on proper clean-up procedures are also crucial. A culture of reporting spills immediately is very important.</li>
              <li><strong>Tool and Equipment Maintenance:</strong> Maintaining tools and equipment in good working order is essential for both safety and efficiency. This includes regularly inspecting and cleaning tools, ensuring that equipment is properly stored, and promptly repairing or replacing any damaged items. Proper tool and equipment maintenance not only contributes to a clean and organized warehouse but also extends the lifespan of the equipment and reduces the risk of accidents.</li>
              <li><strong>Employee Training and Awareness:</strong> Effective housekeeping requires the active participation of all employees. Providing thorough training on housekeeping procedures, safety protocols, and waste management practices is essential. Encouraging employees to take ownership of their work areas and to report any potential hazards or housekeeping issues promotes a culture of cleanliness and safety.</li>
              <li><strong>Regular Housekeeping Audits:</strong> Implementing a program of regular housekeeping audits, can help to ensure that best practices are being followed. These audits can be conducted by safety personnel, supervisors, or even by teams of employees. The results of these audits can be used to identify areas for improvement and to reinforce positive housekeeping habits.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: SECURITY STANDARDS ========== */}
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

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Warehouse Layout & SHEQ Standards</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Warehouse Layout</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispatch Procedures</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">SHEQ Standards</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Housekeeping</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Warehouse SHEQ & Security. 🏢🔐</p>
        </footer>

      </div>
    </div>
  );
};
