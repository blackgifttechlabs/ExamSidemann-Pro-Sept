import React from 'react';
import {
  FolderTree, FileText, Calendar, Hash, Database, Target, TrendingUp, BarChart,
  GanttChart, Factory, Cpu, Shield, Users, Handshake, ClockIcon, GlobeIcon,
  CheckCircle, AlertTriangle, User, Building, Briefcase, LayersIcon,
  FileSignature, Flower as Tree, FileEdit, ArrowRightCircle, RefreshCw,Rocket,
  BookOpen, DollarSign, ListChecks, SearchIcon, Box, Gavel, BadgeCheck,
  ClipboardList, Truck, Warehouse, Star, Award, CreditCard, LineChart,
  PieChart, Table, Clipboard, FileCheck, UserCheck, Building2, MapPin,
  Clock, Zap, Filter, Eye, PenTool, Mail, Phone, CalendarDays, Settings,
  Wrench, HardHat, Package, ShoppingCart, ShieldCheck, Lock, Leaf,
  Heart, BriefcaseBusiness, Network, GitBranch, Link, ArrowUpDown,
  PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon,
  Table as TableIcon, Clipboard as ClipboardIcon, FileCheck as FileCheckIcon,
  FileText as FileTextIcon, FilePlus as FilePlusIcon, FileSignature as FileSignatureIcon,
  FileEdit as FileEditIcon, FileSearch, FileSpreadsheet, FileClock, FileX,
  FileBadge, FileKey, FileLock, FileMinus, FilePlus, FileSpreadsheet as FileSpreadsheetIcon,
  FileCheck as FileCheckIcon2, FileSignature as FileSignatureIcon2,
  FileText as FileTextIcon2, FilePlus as FilePlusIcon2, FileMinus as FileMinusIcon2,
  FileClock as FileClockIcon, FileX as FileXIcon, FileBadge as FileBadgeIcon,
  FileKey as FileKeyIcon, FileLock as FileLockIcon, FileEdit as FileEditIcon2,
  FileSpreadsheet as FileSpreadsheetIcon2, FileCheck as FileCheckIcon3,
  FileSignature as FileSignatureIcon3, FileText as FileTextIcon3,
  FilePlus as FilePlusIcon3, FileMinus as FileMinusIcon3,
  FileClock as FileClockIcon2, FileX as FileXIcon2,
  FileBadge as FileBadgeIcon2, FileKey as FileKeyIcon2,
  FileLock as FileLockIcon2, FileEdit as FileEditIcon3,
  FileSpreadsheet as FileSpreadsheetIcon3, FileCheck as FileCheckIcon4,
  FileSignature as FileSignatureIcon4, FileText as FileTextIcon4,
  FilePlus as FilePlusIcon4, FileMinus as FileMinusIcon4,
  FileClock as FileClockIcon3, FileX as FileXIcon3,
  FileBadge as FileBadgeIcon3, FileKey as FileKeyIcon3,
  FileLock as FileLockIcon3, FileEdit as FileEditIcon4,
  FileSpreadsheet as FileSpreadsheetIcon4, FileCheck as FileCheckIcon5,
  FileSignature as FileSignatureIcon5, FileText as FileTextIcon5,
  FilePlus as FilePlusIcon5, FileMinus as FileMinusIcon5,
  FileClock as FileClockIcon4, FileX as FileXIcon4,
  FileBadge as FileBadgeIcon4, FileKey as FileKeyIcon4,
  FileLock as FileLockIcon4, FileEdit as FileEditIcon5,
  FileSpreadsheet as FileSpreadsheetIcon5, FileCheck as FileCheckIcon6,
  FileSignature as FileSignatureIcon6, FileText as FileTextIcon6,
  FilePlus as FilePlusIcon6, FileMinus as FileMinusIcon6,
  FileClock as FileClockIcon5, FileX as FileXIcon5,
  FileBadge as FileBadgeIcon5, FileKey as FileKeyIcon5,
  FileLock as FileLockIcon5, FileEdit as FileEditIcon6,
  FileSpreadsheet as FileSpreadsheetIcon6, FileCheck as FileCheckIcon7,
  FileSignature as FileSignatureIcon7, FileText as FileTextIcon7,
  FilePlus as FilePlusIcon7, FileMinus as FileMinusIcon7,
  FileClock as FileClockIcon6, FileX as FileXIcon6,
  FileBadge as FileBadgeIcon6, FileKey as FileKeyIcon6,
  FileLock as FileLockIcon6, FileEdit as FileEditIcon7,
  FileSpreadsheet as FileSpreadsheetIcon7, FileCheck as FileCheckIcon8,
  FileSignature as FileSignatureIcon8, FileText as FileTextIcon8,
  FilePlus as FilePlusIcon8, FileMinus as FileMinusIcon8,
  FileClock as FileClockIcon7, FileX as FileXIcon7,
  FileBadge as FileBadgeIcon7, FileKey as FileKeyIcon7,
  FileLock as FileLockIcon7, FileEdit as FileEditIcon8,
  Scale, Gavel as GavelIcon, Handshake as HandshakeIcon,
  Shield as ShieldIcon, AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon, XCircle, Repeat,
  Globe as GlobeIcon2, BookOpen as BookOpenIcon,
  ListChecks as ListChecksIcon, Database as DatabaseIcon,
  Target as TargetIcon, TrendingUp as TrendingUpIcon,
  RefreshCw as RefreshCwIcon, Zap as ZapIcon, Leaf as LeafIcon,
  Heart as HeartIcon, PieChart as PieChartIcon2,
  Calendar as CalendarIcon, MapPin as MapPinIcon,
  Mail as MailIcon, Phone as PhoneIcon,
  MessageCircle as MessageCircleIcon,
  FileText as FileTextIcon9, FileCheck as FileCheckIcon9,
  FileSignature as FileSignatureIcon9, FilePlus as FilePlusIcon9,
  FileMinus as FileMinusIcon9, FileEdit as FileEditIcon9,
  FileSearch as FileSearchIcon2, FileSpreadsheet as FileSpreadsheetIcon8,
  FileClock as FileClockIcon8, FileX as FileXIcon8,
  FileBadge as FileBadgeIcon8, FileKey as FileKeyIcon8,
  FileLock as FileLockIcon8, FileText as FileTextIcon10,
  FileCheck as FileCheckIcon10, FileSignature as FileSignatureIcon10,
  FilePlus as FilePlusIcon10, FileMinus as FileMinusIcon10,
  FileEdit as FileEditIcon10, FileSearch as FileSearchIcon3,
  FileSpreadsheet as FileSpreadsheetIcon9, FileClock as FileClockIcon9,
  FileX as FileXIcon9, FileBadge as FileBadgeIcon9,
  FileKey as FileKeyIcon9, FileLock as FileLockIcon9,
  FileText as FileTextIcon11, FileCheck as FileCheckIcon11,
  FileSignature as FileSignatureIcon11, FilePlus as FilePlusIcon11,
  FileMinus as FileMinusIcon11, FileEdit as FileEditIcon11,
  FileSearch as FileSearchIcon4, FileSpreadsheet as FileSpreadsheetIcon10,
  FileClock as FileClockIcon10, FileX as FileXIcon10,
  FileBadge as FileBadgeIcon10, FileKey as FileKeyIcon10,
  FileLock as FileLockIcon10, FileText as FileTextIcon12,
  FileCheck as FileCheckIcon12, FileSignature as FileSignatureIcon12,
  FilePlus as FilePlusIcon12, FileMinus as FileMinusIcon12,
  FileEdit as FileEditIcon12, FileSearch as FileSearchIcon5,
  FileSpreadsheet as FileSpreadsheetIcon11, FileClock as FileClockIcon11,
  FileX as FileXIcon11, FileBadge as FileBadgeIcon11,
  FileKey as FileKeyIcon11, FileLock as FileLockIcon11,
  DollarSign as DollarSignIcon, Briefcase as BriefcaseIcon,
  Building as BuildingIcon, Users as UsersIcon,
  Key, Lock as LockIcon, Link as LinkIcon,
  Scale as ScaleIcon, Gavel as GavelIcon2,
  Handshake as HandshakeIcon2, Shield as ShieldIcon2,
  AlertTriangle as AlertTriangleIcon2, CheckCircle as CheckCircleIcon2,
  XCircle as XCircleIcon, Repeat as RepeatIcon,
  Globe as GlobeIcon3, BookOpen as BookOpenIcon2,
  ListChecks as ListChecksIcon2, Database as DatabaseIcon2,
  Target as TargetIcon2, TrendingUp as TrendingUpIcon2,
  RefreshCw as RefreshCwIcon2, Zap as ZapIcon2,
  Leaf as LeafIcon2, Heart as HeartIcon2,
  PieChart as PieChartIcon3, Calendar as CalendarIcon2,
  MapPin as MapPinIcon2, Mail as MailIcon2,
  Phone as PhoneIcon2, MessageCircle as MessageCircleIcon2,
  FileText as FileTextIcon13, FileCheck as FileCheckIcon13,
  FileSignature as FileSignatureIcon13, FilePlus as FilePlusIcon13,
  FileMinus as FileMinusIcon13, FileEdit as FileEditIcon13,
  FileSearch as FileSearchIcon6, FileSpreadsheet as FileSpreadsheetIcon12,
  FileClock as FileClockIcon12, FileX as FileXIcon12,
  FileBadge as FileBadgeIcon12, FileKey as FileKeyIcon12,
  FileLock as FileLockIcon12,
  CloudRain, Sun, Wind, Droplets,   Recycle,
  Landmark, Globe, Cloud, Flame, Droplet, Skull,
   Factory as FactoryIcon2,
  Building as BuildingIcon2, Users as UsersIcon2,
  Handshake as HandshakeIcon3, Shield as ShieldIcon3,
  AlertTriangle as AlertTriangleIcon3, CheckCircle as CheckCircleIcon3,
  XCircle as XCircleIcon2, Repeat as RepeatIcon2,
  Globe as GlobeIcon4, BookOpen as BookOpenIcon3,
  ListChecks as ListChecksIcon3, Database as DatabaseIcon3,
  Target as TargetIcon3, TrendingUp as TrendingUpIcon3,
  RefreshCw as RefreshCwIcon3, Zap as ZapIcon3,
  Leaf as LeafIcon3, Heart as HeartIcon3,
  PieChart as PieChartIcon4, Calendar as CalendarIcon3,
  MapPin as MapPinIcon3, Mail as MailIcon3,
  Phone as PhoneIcon3, MessageCircle as MessageCircleIcon3,
  FileText as FileTextIcon14, FileCheck as FileCheckIcon14,
  FileSignature as FileSignatureIcon14, FilePlus as FilePlusIcon14,
  FileMinus as FileMinusIcon14, FileEdit as FileEditIcon14,
  FileSearch as FileSearchIcon7, FileSpreadsheet as FileSpreadsheetIcon13,
  FileClock as FileClockIcon13, FileX as FileXIcon13,
  FileBadge as FileBadgeIcon13, FileKey as FileKeyIcon13,
  FileLock as FileLockIcon13,
  Building as BuildingIcon3, Users as UsersIcon3,
  Handshake as HandshakeIcon4, Globe as GlobeIcon5,
  DollarSign as DollarSignIcon2, Target as TargetIcon4,
  Shield as ShieldIcon4, AlertTriangle as AlertTriangleIcon4,
  CheckCircle as CheckCircleIcon4, User as UserIcon2,
  Truck as TruckIcon, ShoppingCart as ShoppingCartIcon,
  Home, Landmark as LandmarkIcon2, Building as BuildingIcon4,
  Briefcase as BriefcaseIcon2, CreditCard as CreditCardIcon2,
  Banknote, PiggyBank, Coins, Wallet,
  UserRound, Users as UsersIcon4, Globe as GlobeIcon6,
  Mail as MailIcon4, Phone as PhoneIcon4,
  FileText as FileTextIcon15, FileCheck as FileCheckIcon15,
  FileSignature as FileSignatureIcon15, FilePlus as FilePlusIcon15,
  FileMinus as FileMinusIcon15, FileEdit as FileEditIcon15,
  FileSearch as FileSearchIcon8, FileSpreadsheet as FileSpreadsheetIcon14,
  FileClock as FileClockIcon14, FileX as FileXIcon14,
  FileBadge as FileBadgeIcon14, FileKey as FileKeyIcon14,
  FileLock as FileLockIcon14,
  FileText as FileTextIcon16, FileCheck as FileCheckIcon16,
  FileSignature as FileSignatureIcon16, FilePlus as FilePlusIcon16,
  FileMinus as FileMinusIcon16, FileEdit as FileEditIcon16,
  FileSearch as FileSearchIcon9, FileSpreadsheet as FileSpreadsheetIcon15,
  FileClock as FileClockIcon15, FileX as FileXIcon15,
  FileBadge as FileBadgeIcon15, FileKey as FileKeyIcon15,
  FileLock as FileLockIcon15,
  Table as TableIcon2, FileSpreadsheet as FileSpreadsheetIcon16,
  FileCheck as FileCheckIcon17, FileSignature as FileSignatureIcon17,
  FileText as FileTextIcon17, FilePlus as FilePlusIcon17,
  FileMinus as FileMinusIcon17, FileEdit as FileEditIcon17,
  FileSearch as FileSearchIcon10, FileClock as FileClockIcon16,
  FileX as FileXIcon16, FileBadge as FileBadgeIcon16,
  FileKey as FileKeyIcon16, FileLock as FileLockIcon16,
  ChartLine, ChartNoAxesCombined, ChartColumn, ChartPie,
  TrendingDown, ArrowUp, ArrowDown, Equal,
  Store, ShoppingBag, Megaphone, Radio,
  Building as BuildingIcon5, Users as UsersIcon5,
  TreePine, Mountain, Droplet as DropletIcon2,
  Factory as FactoryIcon3, Briefcase as BriefcaseIcon3,
  Store as StoreIcon, Building2 as BuildingIcon6
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
              Sectors, Markets & <span className="text-sky-300 font-bold italic">Competition</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to public, private, not-for-profit, and third sectors, primary/secondary/tertiary sectors, demand and supply, competition levels, marketing principles, and stakeholder relations.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">sectors_markets.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">SECTORS</span><span className="text-white">Analyze;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">DEMAND</span><span className="text-white">Supply;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">COMPETE</span><span className="text-white">Market;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Building className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><ChartLine className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: PUBLIC, PRIVATE, NOT-FOR-PROFIT, THIRD SECTORS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Differences between The Public, Private, Not-For-Profit, And Third Sectors</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BuildingIcon size={20} /> 1. Public Sector</h3>
            <p>The public sector encompasses all government-owned entities and services, operating at local, regional, and national levels. Its primary purpose is to serve the public interest by providing essential services, enforcing laws, and regulating various aspects of society. Public sector organizations are funded through taxes and other government revenues, and they are accountable to the public through elected officials and government oversight. The focus is on delivering services that benefit the entire population, often those that the private sector may not find profitable or feasible to provide.</p>
            <p className="mt-2">Examples include public schools, hospitals, police and fire departments, national defense, and infrastructure projects like roads and bridges. Decisions made within the public sector are typically influenced by political considerations, public opinion, and regulatory frameworks. For instance, a city council might decide to invest in a public transportation system to reduce traffic congestion and improve accessibility for residents, even if it doesn't generate a direct profit. The public sector's role is to ensure societal well-being, promote equality, and maintain a stable and secure environment.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> 2. Private Sector</h3>
            <p>The private sector comprises businesses and organizations owned by individuals or shareholders, operating with the primary goal of generating profit. These entities engage in a wide range of activities, from manufacturing and retail to technology and financial services. The private sector is driven by market forces, competition, and the pursuit of efficiency and innovation. Decisions are made based on financial considerations, market analysis, and the desire to maximize shareholder value.</p>
            <p className="mt-2">Examples include multinational corporations like Apple or Amazon, small businesses like local restaurants or boutiques, and privately owned service providers such as law firms or consulting agencies.</p>
            <p className="mt-2">Private sector organizations are typically more agile and responsive to market changes than public sector entities, as they are not bound by the same bureaucratic constraints. They are also more likely to invest in research and development to create new products and services that meet consumer demands. For instance, a tech startup might develop a new software application that addresses a specific market need, driven by the potential for financial gain. The private sector plays a crucial role in driving economic growth, creating jobs, and providing goods and services that enhance people's lives.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HeartIcon size={20} /> 3. Not-for-Profit Sector</h3>
            <p>The not-for-profit sector, also known as the non-profit or charitable sector, consists of organizations that operate for a social or public benefit rather than for profit. These organizations are typically tax-exempt and rely on donations, grants, and fundraising to support their activities. Their focus is on addressing social, environmental, or cultural issues, and they are governed by boards of directors or trustees. Examples include charities like the Red Cross or Doctors Without Borders, educational institutions like private universities, cultural organizations like museums or theaters, and advocacy groups like environmental or human rights organizations. Not-for-profits often fill gaps in services that the public and private sectors may not adequately address, focusing on vulnerable populations or underserved communities.</p>
            <p className="mt-2">For instance, a local food bank might provide meals to low-income families, or a community arts center might offer free workshops to children. Not-for-profits are driven by a mission to create positive social impact, and they are accountable to their donors, beneficiaries, and the public. They play a vital role in building stronger communities, promoting social justice, and addressing pressing societal challenges.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 4. Third Sector</h3>
            <p>The third sector is often used interchangeably with the not-for-profit sector, but it can also encompass a broader range of organizations that operate outside of the traditional public and private sectors. This includes community groups, voluntary organizations, social enterprises, and other forms of civic engagement. The third sector is characterized by its focus on social impact, community development, and citizen participation.</p>
            <p className="mt-2">These organizations often rely on volunteers, grassroots initiatives, and collaborative partnerships to achieve their goals. Examples include local neighborhood associations, volunteer fire departments, social enterprises that provide employment opportunities to marginalized individuals, and advocacy groups that campaign for social change. The third sector plays a crucial role in building social capital, fostering civic engagement, and addressing local needs. For instance, a community garden might bring residents together to grow food, promote healthy eating, and build a sense of community.</p>
            <p className="mt-2">Social enterprises might operate businesses that generate revenue to support social causes, such as providing training and employment to individuals with disabilities. The third sector is diverse and dynamic, reflecting the wide range of social and community needs that exist. It serves as a vital bridge between the public and private sectors, promoting collaboration and innovation to address complex challenges.</p>
          </div>
        </section>

        {/* ========== SECTION 2: PRIMARY, SECONDARY, TERTIARY SECTORS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Primary, Secondary & Tertiary Sectors</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Tree size={20} /> 1. Primary Sector: The Foundation of Resource Extraction</h3>
            <p>The primary sector is the most fundamental sector of the economy, as it directly harnesses natural resources. It's the sector where we extract the raw materials that fuel all other economic activities. Think of it as the "source" of the supply chain. Agriculture, a major component, includes growing crops like wheat, rice, and corn, as well as raising livestock for meat and dairy.</p>
            <p className="mt-2">Forestry involves harvesting timber for construction and paper production, while fishing provides seafood for consumption. Mining and quarrying are essential for extracting minerals like iron ore, copper, and precious metals, as well as raw materials for construction like sand and gravel. The primary sector's success is heavily dependent on factors like weather patterns, soil quality, and resource availability. In developing economies, this sector often employs a large percentage of the population and contributes significantly to the national GDP.</p>
            <p className="mt-2">However, it can be vulnerable to price volatility in global commodity markets. For example, a sudden drop in oil prices can severely impact economies reliant on oil extraction. Sustainable resource management is crucial in this sector to ensure long-term viability and minimize environmental damage.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FactoryIcon2 size={20} /> 2. Secondary Sector: Transforming Raw Materials into Finished Goods</h3>
            <p>The secondary sector takes the raw materials provided by the primary sector and transforms them into usable products. This sector is where manufacturing, construction, and processing industries thrive. Manufacturing encompasses a broad range of activities, from assembling automobiles and electronics to producing textiles and furniture. Construction involves building infrastructure like roads, bridges, and buildings, as well as residential and commercial properties.</p>
            <p className="mt-2">Processing industries transform raw materials into intermediate or finished goods, such as food processing, chemical production, and oil refining. The secondary sector is a major driver of industrial growth and job creation. For example, a factory producing smartphones requires components from various sources, assembles them, and distributes the final product.</p>
            <p className="mt-2">The efficiency and productivity of this sector are often driven by technological advancements, automation, and economies of scale. However, the secondary sector also faces challenges related to environmental pollution, energy consumption, and waste management. In developed economies, there's a trend towards more advanced manufacturing, focusing on high-tech products and specialized industries.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BriefcaseIcon size={20} /> 3. Tertiary Sector: The Realm of Services and Information</h3>
            <p>The tertiary sector, or service sector, is the largest and most diverse of the three sectors. It focuses on providing services to businesses and consumers, rather than producing tangible goods. This sector encompasses a vast array of activities, including retail, wholesale, transportation, healthcare, education, finance, tourism, and information technology. Retail involves selling goods directly to consumers, while wholesale involves selling goods to businesses.</p>
            <p className="mt-2">Transportation includes moving people and goods, using various modes like trucking, shipping, and aviation. Healthcare provides medical care and related services, while education imparts knowledge and skills. Finance includes banking, insurance, and investment services. Tourism involves providing travel and hospitality services. Information technology (IT) provides software, hardware, and digital services. The tertiary sector is characterized by its reliance on human capital, knowledge, and technology.</p>
            <p className="mt-2">For example, a software company developing cloud-based applications, a hospital providing specialized medical treatments, and a consulting firm offering strategic advice all contribute to the tertiary sector. The growth of this sector is driven by factors like rising incomes, changing consumer preferences, and the increasing complexity of modern economies. In developed countries, the tertiary sector often accounts for the majority of employment and GDP. The sector is also highly dynamic, with continuous innovation and adaptation to meet evolving needs.</p>
          </div>
        </section>

        {/* ========== SECTION 3: DEMAND AND SUPPLY CURVES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Demand And Supply Curves</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The concepts of demand and supply curves are fundamental to understanding how markets function. They provide a visual representation of the relationship between the price of a good or service and the quantity that buyers are willing to purchase (demand) and the quantity that sellers are willing to offer (supply).</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ChartLine size={20} /> 1. Demand Curve</h3>
            <p><strong>Definition:</strong> The demand curve illustrates the relationship between the price of a good or service and the quantity demanded by consumers, assuming all other factors remain constant (ceteris paribus). It typically slopes downward, indicating that as the price of a good increases, the quantity demanded decreases, and vice versa. This inverse relationship is known as the law of demand.</p>
            <p className="mt-2"><strong>Factors Affecting Demand:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Consumer income:</strong> Higher incomes generally lead to increased demand for most goods.</li>
              <li><strong>Consumer preferences:</strong> Changes in tastes and preferences can shift the demand curve.</li>
              <li><strong>Prices of related goods:</strong> Substitute goods and complementary goods affect demand.</li>
              <li><strong>Expectations:</strong> Consumer expectations about future prices or availability can influence current demand.</li>
            </ul>
            <p className="mt-2"><strong>Curve Shifts:</strong> Changes in any of the factors above (excluding the good's own price) will cause the entire demand curve to shift. A rightward shift indicates an increase in demand, while a leftward shift indicates a decrease.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ChartLine size={20} /> 2. Supply Curve</h3>
            <p><strong>Definition:</strong> The supply curve illustrates the relationship between the price of a good or service and the quantity supplied by producers, assuming all other factors remain constant. It typically slopes upward, indicating that as the price of a good increases, the quantity supplied increases, and vice versa. This direct relationship is known as the law of supply.</p>
            <p className="mt-2"><strong>Factors Affecting Supply:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cost of production:</strong> Changes in the cost of inputs (labor, materials, etc.) can affect supply.</li>
              <li><strong>Technology:</strong> Technological advancements can increase efficiency and lower production costs, leading to increased supply.</li>
              <li><strong>Number of sellers:</strong> An increase in the number of sellers in the market will increase supply.</li>
              <li><strong>Expectations:</strong> Producer expectations about future prices can influence current supply.</li>
              <li><strong>Government policies:</strong> Taxes and subsidies can influence supply.</li>
            </ul>
            <p className="mt-2"><strong>Curve Shifts:</strong> Changes in any of the factors above (excluding the good's own price) will cause the entire supply curve to shift. A rightward shift indicates an increase in supply, while a leftward shift indicates a decrease.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 3. Equilibrium</h3>
            <p><strong>Definition:</strong> The equilibrium price and quantity occur where the demand and supply curves intersect. At this point, the quantity demanded equals the quantity supplied, and the market is in balance.</p>
            <p className="mt-2"><strong>Market Adjustments:</strong> If the market price is above the equilibrium price, there will be a surplus, and the price will tend to fall. If the market price is below the equilibrium price, there will be a shortage, and the price will tend to rise.</p>
          </div>
        </section>

        {/* ========== SECTION 4: CHANGES IN DEMAND ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Changes in Demand</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 1. Shifts in Societal Demographics and Lifestyle Trends</h3>
            <p>Demand is not static; it evolves alongside societal changes. Shifts in demographics, such as an aging population or increased urbanization, directly influence the kinds of goods and services consumers require. For example, a growing elderly population increases the demand for healthcare services, assisted living facilities, and specialized medical equipment. Concurrently, lifestyle trends, like the rising popularity of veganism or the emphasis on sustainable living, create new demand patterns. The surge in demand for plant-based alternatives to meat and dairy is a testament to this, reflecting a broader societal shift towards healthier and more ethical consumption. These demographic and lifestyle changes are often gradual but have profound long-term impacts on market demands, forcing businesses to adapt their offerings and marketing strategies to remain relevant.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> 2. The Impact of Technological Advancements and Digitalization</h3>
            <p>The digital age has revolutionized consumer behavior and fundamentally altered demand patterns. The rapid proliferation of smartphones, the internet, and e-commerce platforms has created new avenues for consumption and transformed traditional retail models. Online shopping, streaming services, and digital subscriptions have become ubiquitous, shifting demand away from physical stores and traditional media. Furthermore, technological advancements have led to the creation of entirely new product categories, such as wearable technology, smart home devices, and electric vehicles. These innovations not only create new demands but also influence consumer expectations, leading to a constant cycle of innovation and adaptation. The accessibility of information and online reviews has also empowered consumers, making them more discerning and demanding higher standards of quality and service.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BuildingIcon size={20} /> 3. The Role of Government Policies and Regulations</h3>
            <p>Government policies and regulations play a significant role in shaping demand patterns. Taxes, subsidies, and regulations can directly influence the affordability and availability of goods and services, thereby affecting consumer demand. For example, government subsidies for renewable energy, such as solar panels or electric vehicles, can stimulate demand for these products. Conversely, increased taxes on tobacco or sugary drinks can reduce their demand.</p>
            <p className="mt-2">Regulations related to environmental protection or product safety can also influence consumer choices, leading to increased demand for eco-friendly or certified products. Furthermore, government spending on public services, such as education or healthcare, can create demand for related goods and services. Trade policies and tariffs can also have a large impact on the demand of imported or exported goods.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> 4. The Influence of Advertising and Marketing Campaigns</h3>
            <p>Advertising and marketing campaigns are powerful tools for shaping consumer perceptions and influencing demand. Through persuasive messaging, creative visuals, and targeted promotions, businesses can create awareness, build brand loyalty, and stimulate demand for their products or services. Effective marketing campaigns can tap into consumer emotions, aspirations, and values, creating a sense of desire or need. For example, a well-executed advertising campaign for a new smartphone can generate excitement and anticipation, leading to a surge in pre-orders and sales. Social media marketing, influencer collaborations, and viral content are increasingly influential in shaping consumer preferences and driving demand. However, the effectiveness of advertising and marketing campaigns can be influenced by factors such as consumer skepticism, changing media consumption habits, and ethical considerations.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUpIcon size={20} /> 5. The Volatility of Consumer Confidence and Economic Outlook</h3>
            <p>Consumer confidence and the overall economic outlook have a significant impact on demand patterns. During periods of economic prosperity and high consumer confidence, consumers are more likely to spend on discretionary items, such as travel, entertainment, and luxury goods. Conversely, during economic downturns or periods of uncertainty, consumers tend to become more cautious, reducing their spending and focusing on essential goods and services. Factors such as unemployment rates, inflation, and interest rates can influence consumer confidence and spending behavior. For example, during a recession, consumers may delay major purchases, such as cars or homes, and instead focus on saving money. Consumer confidence is also influenced by psychological factors, such as perceptions of job security and financial stability.</p>
          </div>
        </section>

        {/* ========== SECTION 5: CHANGES IN SUPPLY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Changes in Supply</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> Fluctuations in Raw Material Costs and Availability</h3>
            <p>Supply is fundamentally tied to the availability and cost of raw materials. Significant fluctuations in commodity prices, such as oil, minerals, or agricultural products, can directly impact production costs and, consequently, supply. For example, a sudden increase in the price of crude oil can raise the cost of producing plastics, affecting the supply of products that rely on plastic components. Similarly, natural disasters, geopolitical instability, or supply chain disruptions can create shortages of raw materials, limiting production capacity and reducing supply. The reliance on global supply chains has made businesses more vulnerable to these fluctuations, requiring them to implement robust risk management strategies and diversify their sourcing options.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 1. The Impact of Labor Costs and Productivity</h3>
            <p>Labor costs are a significant component of production expenses, and fluctuations in wages or labor availability can directly influence supply. Increases in minimum wages or labor shortages can raise production costs, leading to a reduction in supply. Conversely, improvements in labor productivity, driven by technological advancements or training programs, can reduce production costs and increase supply. For example, automation in manufacturing can reduce the need for manual labor, increasing efficiency and lowering costs. Labor disputes or strikes can also disrupt production and reduce supply. The availability of skilled labor is also a critical factor, particularly in industries that require specialized expertise.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> 2. The Influence of Technological Innovation and Automation</h3>
            <p>Technological innovation and automation have transformed production processes, leading to increased efficiency, reduced costs, and improved product quality. Automation, robotics, and artificial intelligence have enabled businesses to streamline operations, reduce manual labor, and increase production capacity. For example, the use of automated assembly lines in manufacturing has significantly increased output and reduced production time. Technological advancements have also led to the development of new materials, processes, and products, expanding the range of goods and services available in the market. However, the adoption of new technologies requires significant investment and can lead to job displacement, creating social and economic challenges.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GavelIcon size={20} /> 3. The Role of Government Regulations and Environmental Policies</h3>
            <p>Government regulations and environmental policies play a crucial role in shaping supply patterns. Regulations related to environmental protection, labor standards, and product safety can influence production costs and limit the availability of certain goods and services. For example, stricter environmental regulations may require businesses to invest in pollution control equipment or adopt sustainable production practices, increasing their costs. Trade policies, such as tariffs and quotas, can also affect the supply of imported goods. Furthermore, government subsidies or tax incentives can encourage production in specific sectors, increasing supply. Environmental policies that limit the use of certain resources or restrict industrial activities can also have a significant impact on supply.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> 4. The Effects of Weather Patterns and Natural Disasters</h3>
            <p>In sectors such as agriculture, fishing, and mining, weather patterns and natural disasters can have a significant impact on supply. Droughts, floods, hurricanes, and earthquakes can disrupt production, damage infrastructure, and create shortages of raw materials. For example, a prolonged drought can severely reduce crop yields, leading to a decrease in the supply of agricultural products. Similarly, a natural disaster can disrupt transportation networks, hindering the distribution of goods and services. The increasing frequency and intensity of extreme weather events, driven by climate change, have made businesses more vulnerable to supply chain disruptions, requiring them to implement robust contingency plans and build resilience into their operations.</p>
          </div>
        </section>

        {/* ========== SECTION 6: IMPACT ON PRICING AND AVAILABILITY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>How demand and supply factors intricately impact the pricing and availability of goods and services</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUpIcon size={20} /> 1. Shifts in Demand and the Resulting Price Adjustments</h3>
            <p>When consumer preferences or economic conditions cause a surge in demand for a particular good or service, the immediate effect is often a competition among buyers. This increased demand, if supply remains constant, inevitably leads to upward pressure on prices. For instance, consider the sudden popularity of a new tech gadget. As consumers rush to purchase it, retailers may find their initial stock depleted quickly. To capitalize on this high demand, sellers are incentivized to raise prices, knowing that consumers are willing to pay more for the coveted item. This price adjustment is not arbitrary; it's a market mechanism that helps balance the imbalance between demand and supply. Conversely, a decrease in demand, perhaps due to a shift in consumer tastes or an economic downturn, will have the opposite effect. Sellers, faced with unsold inventory, will lower prices to stimulate sales and clear their stock. This dynamic interplay between demand shifts and price adjustments is a fundamental characteristic of market economies, ensuring that prices reflect the ever-changing preferences and economic realities of consumers.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangleIcon size={20} /> 2. Supply Constraints and the Consequent Price Escalation</h3>
            <p>Supply constraints, whether caused by natural disasters, production bottlenecks, or geopolitical events, can dramatically alter the availability and pricing of goods and services. When the supply of a product is restricted while demand remains steady or increases, a scarcity arises. This scarcity empowers sellers to charge higher prices, as consumers are willing to pay a premium to secure the limited available stock. For example, a severe drought affecting agricultural regions can lead to a significant reduction in crop yields, causing the supply of certain food items to dwindle. Retailers, facing limited stock, will increase prices to reflect the scarcity, potentially leading to food inflation. Similarly, disruptions in global supply chains, such as those caused by pandemics or trade disputes, can create shortages of essential components or finished goods, leading to price increases across various industries. These supply-driven price escalations highlight the vulnerability of markets to external shocks and underscore the importance of robust supply chain management.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FactoryIcon2 size={20} /> 3. The Influence of Production Costs on Supply and Pricing</h3>
            <p>The cost of production is a critical determinant of supply, and any fluctuations in these costs directly impact the pricing and availability of goods and services. When production costs increase, whether due to rising raw material prices, labor costs, or energy expenses, producers are incentivized to reduce their supply or increase their prices to maintain profitability. For example, a surge in the price of crude oil can increase the cost of producing plastics, leading to a reduction in the supply of plastic-based products and a subsequent increase in their prices. Conversely, a decrease in production costs, perhaps due to technological advancements or economies of scale, can lead to an increase in supply and a potential decrease in prices. This relationship between production costs and supply underscores the importance of efficiency and cost management in ensuring the availability and affordability of goods and services.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> 4. Technological Advancements and Their Impact on Supply and Pricing</h3>
            <p>Technological advancements have a profound impact on both the supply and pricing of goods and services. Innovations that enhance production efficiency, reduce costs, or create new products can significantly increase supply and lower prices. For instance, the development of automated manufacturing processes has enabled businesses to produce goods at a lower cost and on a larger scale, leading to increased supply and potentially lower prices for consumers. Similarly, advancements in information technology have facilitated the growth of e-commerce, expanding the availability of goods and services to a global audience. However, technological advancements can also create new demands and lead to the obsolescence of existing products, causing shifts in demand and supply patterns. This dynamic interplay between technology and markets underscores the importance of innovation and adaptation in ensuring the availability and affordability of goods and services.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GavelIcon size={20} /> 5. Government Policies and Their Role in Shaping Market Dynamics</h3>
            <p>Government policies, such as taxes, subsidies, and regulations, play a significant role in shaping market dynamics and influencing the pricing and availability of goods and services. Taxes on production or consumption can increase costs and reduce supply, while subsidies can lower costs and increase supply. Regulations related to environmental protection, labor standards, or product safety can also impact production costs and availability. For example, environmental regulations may require businesses to invest in pollution control equipment, increasing their costs and potentially reducing supply. Trade policies, such as tariffs and quotas, can also affect the availability and pricing of imported goods. Furthermore, government spending on public services or infrastructure projects can create demand for related goods and services. These policy interventions highlight the government's role in balancing market forces and ensuring the availability and affordability of essential goods and services.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> 6. Consumer Expectations and the Anticipation of Future Price Changes</h3>
            <p>Consumer expectations about future price changes can significantly influence current demand and, consequently, pricing and availability. If consumers anticipate a price increase in the near future, they may rush to purchase the good now, leading to a temporary surge in demand and potentially driving up prices. Conversely, if they expect a price decrease, they may delay their purchases, leading to a decrease in demand and potentially putting downward pressure on prices. For example, during periods of high inflation, consumers may accelerate their purchases of durable goods, such as appliances or electronics, to avoid paying higher prices in the future. Similarly, during periods of economic uncertainty, consumers may become more cautious and delay major purchases, leading to a decrease in demand and potentially lower prices. These anticipatory behaviors underscore the importance of consumer confidence and economic stability in shaping market dynamics.</p>
          </div>
        </section>

        {/* ========== SECTION 7: LEVELS OF COMPETITION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Levels Of Competition Within Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 1. Perfect Competition</h3>
            <p>Perfect competition represents an idealized market structure characterized by a large number of buyers and sellers, homogeneous products, perfect information, and free entry and exit. In such a market, no single firm has the power to influence the market price; they are price takers, meaning they must accept the prevailing market price. The products offered by different firms are identical, making them perfect substitutes. Consumers have complete information about prices and product quality, allowing them to make informed choices.</p>
            <p className="mt-2">Barriers to entry or exit are non-existent, enabling firms to freely enter or leave the market in response to profit opportunities. This competitive environment fosters efficiency, as firms are constantly striving to minimize costs and maximize output to remain competitive. In the long run, firms in perfect competition earn only normal profits, just enough to cover their costs and keep them in business. If a firm were to attempt to charge a higher price, consumers would simply switch to another seller offering the identical product at the market price. The agricultural market, where numerous farmers produce similar commodities like wheat or corn, often approximates perfect competition. However, achieving true perfect competition is rare in the real world due to factors like product differentiation and information asymmetry.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><StoreIcon size={20} /> 2. Imperfect Competition</h3>
            <p>Imperfect competition encompasses market structures that deviate from the strict conditions of perfect competition. It is a broad category that includes monopolistic competition and other market forms where firms have some degree of market power, allowing them to influence prices. Unlike perfect competition, imperfect competition features differentiated products, meaning that firms offer products or services that are perceived as unique by consumers.</p>
            <p className="mt-2">This differentiation can be based on factors like branding, quality, features, or location. Firms engage in non-price competition, such as advertising and product development, to attract customers and build brand loyalty. In monopolistic competition, there are many sellers, but each offers a slightly differentiated product. Barriers to entry are relatively low, allowing new firms to enter the market and compete. However, the presence of differentiated products gives firms some pricing power, enabling them to set prices slightly above marginal cost. Examples of markets with imperfect competition include restaurants, clothing stores, and hair salons. Firms in imperfect competition face a downward-sloping demand curve, indicating that they can sell more by lowering their prices. In the long run, firms in monopolistic competition earn only normal profits, as the entry of new firms erodes any excess profits.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BuildingIcon size={20} /> 3. Oligopoly</h3>
            <p>An oligopoly is a market structure dominated by a small number of large firms that control a significant portion of the market. These firms are interdependent, meaning that their actions and decisions are influenced by the behavior of their competitors. Barriers to entry are high, making it difficult for new firms to enter the market and compete. Products may be homogeneous or differentiated, depending on the industry.</p>
            <p className="mt-2">Firms in an oligopoly engage in strategic interactions, carefully considering the potential reactions of their rivals when making pricing or output decisions. Collusion, either explicit or tacit, is a common feature of oligopolies, as firms may attempt to coordinate their actions to maximize profits. However, collusion is often difficult to maintain due to the incentive to cheat and the risk of antitrust scrutiny. The automobile industry, the airline industry, and the telecommunications industry are examples of oligopolies. Firms in an oligopoly face a kinked demand curve, reflecting the assumption that rivals will match price cuts but not price increases. In the long run, firms in an oligopoly can earn supernormal profits due to the high barriers to entry.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 4. Duopoly</h3>
            <p>A duopoly is a special case of oligopoly where only two firms dominate the market. These two firms have significant market power and are highly interdependent. Their actions and decisions have a direct and substantial impact on each other. The duopoly market structure often leads to intense competition, as the two firms vie for market share and profitability. Like oligopolies, duopolies can engage in collusion, either explicitly or tacitly, to coordinate their actions and maximize profits. However, the small number of firms makes collusion easier to detect and more susceptible to antitrust scrutiny.</p>
            <p className="mt-2">The soft drink market, dominated by Coca-Cola and PepsiCo, is often cited as an example of a duopoly. The strategic interactions between the two firms, such as pricing decisions and advertising campaigns, can significantly influence market outcomes. The high degree of interdependence in a duopoly makes it crucial for firms to anticipate and respond to their rival's actions.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldIcon size={20} /> 5. Monopolies</h3>
            <p>A monopoly is a market structure where a single firm controls the entire market for a particular product or service. This firm has significant market power, enabling it to set prices and control output. Barriers to entry are extremely high, preventing other firms from entering the market and competing. These barriers can be legal, such as patents or copyrights, or economic, such as high start-up costs or control over essential resources. A monopolist faces a downward-sloping demand curve, indicating that it can sell more by lowering its price. However, unlike firms in perfect competition, a monopolist can set prices above marginal cost, earning supernormal profits in the long run. Examples of monopolies include public utilities, such as electricity or water companies, which are often regulated by the government. Monopolies can lead to inefficiencies and higher prices for consumers, as the absence of competition reduces the incentive to innovate and minimize costs. Therefore, governments often regulate monopolies or promote competition to protect consumer interests.</p>
          </div>
        </section>

        {/* ========== SECTION 8: IMPACT OF DEMAND ON SALES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Impact Of Demand On Sales</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The impact of demand on sales is a fundamental principle in business, directly influencing revenue, inventory management, and overall strategic decisions. Here's a breakdown of seven key ways demand affects sales:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> 1. Direct Correlation Between Demand and Revenue</h3>
            <p>A surge in demand typically translates to a direct increase in sales revenue. When consumers actively seek a product or service, businesses experience higher sales volumes, leading to greater financial gains. This correlation is most evident in markets where products are in high demand due to trends, seasonal factors, or successful marketing campaigns. For example, during the holiday season, the demand for toys and electronics skyrockets, resulting in a significant boost in sales for retailers. Conversely, a decrease in demand, perhaps due to changing consumer preferences or economic downturns, can lead to a decline in sales revenue. Businesses must constantly monitor demand fluctuations to adjust their production and marketing strategies, ensuring they capitalize on periods of high demand while mitigating the impact of low demand.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Warehouse size={20} /> 2. Influence on Inventory Management and Stock Levels</h3>
            <p>Demand directly dictates inventory management strategies. High demand necessitates maintaining adequate stock levels to avoid stockouts and lost sales. Businesses must accurately forecast demand to ensure they have sufficient inventory to meet customer needs. For instance, a sudden increase in demand for a particular product may require businesses to ramp up production or order additional inventory from suppliers. Conversely, low demand can lead to excess inventory, resulting in storage costs and potential obsolescence. Effective inventory management, driven by accurate demand forecasting, is crucial for optimizing stock levels, minimizing costs, and maximizing sales. This involves using data analytics and forecasting tools to predict demand patterns and adjust inventory levels accordingly.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> 3. Impact on Pricing Strategies and Profit Margins</h3>
            <p>Demand plays a crucial role in determining pricing strategies and profit margins. High demand allows businesses to charge premium prices, as consumers are willing to pay more for products or services that are in high demand. This is particularly evident in markets where products are scarce or have unique features. For example, the demand for limited-edition products or luxury goods allows businesses to command higher prices, resulting in increased profit margins. Conversely, low demand may require businesses to lower prices to stimulate sales, potentially reducing profit margins. Businesses must carefully analyze demand patterns and adjust their pricing strategies accordingly to maximize profitability. This involves considering factors such as price elasticity of demand, competitor pricing, and production costs.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> 4. Effect on Marketing and Advertising Campaigns</h3>
            <p>Demand influences the effectiveness and focus of marketing and advertising campaigns. When demand is high, businesses may focus on maintaining brand awareness and ensuring product availability. Conversely, low demand may require businesses to launch aggressive marketing campaigns to stimulate sales. This involves using various marketing channels, such as social media, digital advertising, and traditional media, to reach target audiences and create demand. For example, a business launching a new product may invest heavily in advertising and promotions to generate initial demand. Effective marketing campaigns can create a sense of urgency, build brand loyalty, and ultimately drive sales.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FactoryIcon2 size={20} /> 5. Influence on Production Planning and Capacity Utilization</h3>
            <p>Demand directly affects production planning and capacity utilization. High demand necessitates increased production to meet customer orders, requiring businesses to optimize their production processes and maximize capacity utilization. This may involve investing in additional equipment, hiring more staff, or extending production hours. For example, a manufacturing plant experiencing high demand may need to run multiple shifts to meet production targets. Conversely, low demand may lead to idle capacity and reduced production, resulting in higher unit costs. Businesses must carefully plan their production schedules and adjust their capacity to align with demand fluctuations. This involves using demand forecasting and production planning tools to optimize resource allocation and minimize costs.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 6. Impact on Sales Forecasting and Strategic Planning</h3>
            <p>Demand forecasting is a crucial component of sales forecasting and strategic planning. Accurate demand forecasts enable businesses to anticipate future sales trends, make informed decisions about inventory management, and develop effective marketing strategies. For example, a business anticipating a seasonal surge in demand may plan to increase inventory levels and launch targeted marketing campaigns. Conversely, a business anticipating a decline in demand may adjust its production schedules and reduce inventory levels. Sales forecasting based on demand analysis is essential for developing realistic sales targets, allocating resources effectively, and achieving business objectives.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 7. Influence on Customer Service and Customer Satisfaction</h3>
            <p>Demand can significantly impact customer service and customer satisfaction. High demand can strain customer service resources, leading to longer wait times and potential delays. Businesses must ensure they have adequate customer service capacity to handle increased inquiries and orders during periods of high demand. For example, a call center experiencing high call volumes may need to hire additional staff or implement automated systems to manage customer inquiries. Conversely, low demand may allow businesses to provide more personalized and attentive customer service. Meeting customer expectations and ensuring customer satisfaction are crucial for building brand loyalty and driving repeat sales. Effective customer service is therefore essential for managing demand fluctuations and maintaining a positive customer experience.</p>
          </div>
        </section>

        {/* ========== SECTION 9: MARKET GROWTH AND DECLINE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Market Growth & Market Decline</h2>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUpIcon size={20} /> Market Growth</h3>
            <p>Market growth signifies an expansion in the demand for a particular product or service within a defined market. This growth can be driven by various factors, leading to increased sales, revenue, and market share for participating businesses.</p>
            <p className="mt-2"><strong>Drivers of Market Growth:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Technological Innovation:</strong> New technologies often create entirely new markets or significantly expand existing ones. The rise of smartphones, cloud computing, and electric vehicles are prime examples.</li>
              <li><strong>Changing Consumer Preferences:</strong> Shifts in consumer tastes, lifestyles, or demographics can fuel demand for specific products or services. The growing emphasis on health and wellness, for instance, has driven growth in the organic food and fitness industries.</li>
              <li><strong>Economic Growth:</strong> A robust economy typically leads to increased consumer spending and business investment, expanding market opportunities.</li>
              <li><strong>Globalization and Market Expansion:</strong> Businesses can tap into new markets and customer bases by expanding their operations globally.</li>
              <li><strong>Government Policies and Regulations:</strong> Government initiatives, such as subsidies, tax incentives, or regulatory changes, can stimulate market growth in specific sectors.</li>
              <li><strong>Increased awareness:</strong> Marketing, education, and social media can increase the amount of people that are aware of a product, thus increasing demand.</li>
            </ul>
            <p className="mt-2"><strong>Characteristics of Market Growth:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Increased Sales and Revenue: Businesses experience higher sales volumes and revenue growth.</li>
              <li>Expansion of Market Share: Companies compete to capture a larger share of the expanding market.</li>
              <li>Entry of New Competitors: New businesses are attracted to the market, increasing competition.</li>
              <li>Investment and Innovation: Companies invest in research and development, capacity expansion, and marketing to capitalize on growth opportunities.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingDown size={20} /> Market Decline</h3>
            <p>Market decline signifies a contraction in the demand for a particular product or service within a defined market. This decline can be gradual or sudden, leading to decreased sales, revenue, and market share for participating businesses.</p>
            <p className="mt-2"><strong>Drivers of Market Decline:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Technological Obsolescence:</strong> New technologies can render existing products or services obsolete. The decline of the film camera industry due to the rise of digital cameras is a classic example.</li>
              <li><strong>Changing Consumer Preferences:</strong> Shifts in consumer tastes or lifestyles can lead to a decline in demand for certain products or services. The decline of traditional print media due to the rise of digital media is a notable example.</li>
              <li><strong>Economic Downturns:</strong> Recessions or economic crises can significantly reduce consumer spending and business investment, leading to market decline.</li>
              <li><strong>Increased Competition from Substitutes:</strong> The emergence of new substitute products or services can erode demand for existing ones.</li>
              <li><strong>Regulatory Changes:</strong> Government regulations or policies can negatively impact specific industries, leading to market decline.</li>
              <li><strong>Saturation:</strong> When a market has reached the point where almost everyone who wants a product already has it, growth stops, and decline can occur.</li>
            </ul>
            <p className="mt-2"><strong>Characteristics of Market Decline:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Decreased Sales and Revenue: Businesses experience declining sales volumes and revenue.</li>
              <li>Consolidation and Exit of Competitors: Companies may merge or exit the market to reduce costs and survive.</li>
              <li>Price Wars and Increased Competition: Businesses may engage in price wars to maintain market share.</li>
              <li>Reduced Investment and Innovation: Companies may cut back on research and development, marketing, and capacity expansion.</li>
              <li>Focus on Cost Reduction and Efficiency: Businesses prioritize cost reduction and efficiency to maintain profitability.</li>
              <li>Niche Markets: Some businesses may try to find niche markets to survive in.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 10: COMPETITIVE FORCES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Competitive Forces</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Competitive forces are the external factors that influence an organization's ability to compete in its industry. These forces shape the competitive landscape, impacting profitability, market share, and overall strategic decisions. Understanding these forces is crucial for developing effective strategies and maintaining a competitive advantage. Here's a breakdown of the key competitive forces that organizations face:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> 1. Threat of New Entrants</h3>
            <p>The threat of new entrants refers to the ease with which new competitors can enter the market. High barriers to entry, such as high capital requirements, strong brand loyalty, or government regulations, reduce the threat of new entrants. Conversely, low barriers to entry, such as low start-up costs or easy access to distribution channels, increase the threat. New entrants can disrupt existing market dynamics, introduce new products or services, and intensify competition, potentially eroding profitability for existing players.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HandshakeIcon size={20} /> 2. Bargaining Power of Suppliers</h3>
            <p>The bargaining power of suppliers refers to the ability of suppliers to influence the prices and terms of supply. Suppliers with high bargaining power can charge higher prices, reduce quality, or limit the availability of inputs, impacting an organization's costs and profitability. Factors that increase supplier power include a small number of suppliers, unique or differentiated inputs, and high switching costs. Conversely, a large number of suppliers, commodity inputs, and low switching costs reduce supplier power.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShoppingCartIcon size={20} /> 3. Bargaining Power of Buyers</h3>
            <p>The bargaining power of buyers refers to the ability of customers to influence the prices and terms of purchase. Buyers with high bargaining power can demand lower prices, higher quality, or better service, impacting an organization's revenue and profitability. Factors that increase buyer power include a small number of buyers, standardized products, and low switching costs. Conversely, a large number of buyers, differentiated products, and high switching costs reduce buyer power.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> 4. Threat of Substitute Products or Services</h3>
            <p>The threat of substitute products or services refers to the availability of alternative products or services that can satisfy the same customer needs. Substitute products or services can limit an organization's pricing power and erode market share. Factors that increase the threat of substitutes include low switching costs, high price-performance trade-off of substitutes, and a large number of available substitutes.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 5. Intensity of Competitive Rivalry</h3>
            <p>The intensity of competitive rivalry refers to the degree of competition among existing players in the market. High rivalry can lead to price wars, aggressive marketing campaigns, and increased innovation, impacting profitability for all players. Factors that increase rivalry include a large number of competitors, slow market growth, high fixed costs, and low product differentiation.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GavelIcon size={20} /> 6. Government Policies and Regulations</h3>
            <p>Government policies and regulations can significantly impact the competitive landscape. Regulations related to antitrust, environmental protection, labor standards, and trade policies can create barriers to entry, influence production costs, and shape market dynamics. Government intervention can also create opportunities for certain industries or businesses through subsidies, tax incentives, or public procurement.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> 7. Technological Advancements</h3>
            <p>Technological advancements can disrupt existing industries, create new markets, and transform competitive dynamics. New technologies can lead to product innovation, process improvements, and increased efficiency, giving organizations a competitive edge. However, they can also render existing products or services obsolete and create new challenges for businesses.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> 8. Global Economic Forces</h3>
            <p>Global economic forces, such as economic growth, inflation, and exchange rates, can impact an organization's access to markets, supply chains, and capital. These forces can create opportunities for international expansion or pose challenges related to currency fluctuations and trade barriers.</p>
          </div>
        </section>

        {/* ========== SECTION 11: PRINCIPLES OF MARKETING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Principles of Marketing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Marketing is more than just advertising; it's a comprehensive approach to understanding and satisfying customer needs. The core principles guide effective marketing strategies:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> Customer-Centricity</h3>
            <p>This principle emphasizes placing the customer at the heart of all marketing efforts. It involves understanding customer needs, preferences, and behaviors to create value and build lasting relationships. Marketing efforts should focus on solving customer problems and providing solutions that meet their specific needs. Essentially, it's about shifting the focus from "what we want to sell" to "what customers want to buy."</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> Value Creation</h3>
            <p>Marketing aims to create value for customers by offering products or services that provide benefits and solve problems. This involves developing products that meet customer needs, communicating their value effectively, and delivering a positive customer experience. The perceived value must exceed the perceived cost for customers to make a purchase.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star size={20} /> Differentiation</h3>
            <p>In competitive markets, differentiation is crucial for standing out from the crowd. This principle involves creating a unique selling proposition (USP) that sets a product or service apart from its competitors. Differentiation can be based on factors such as product features, quality, branding, or customer service. This allows a company to avoid being seen as a commodity.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> Segmentation, Targeting, and Positioning (STP)</h3>
            <p>This principle involves dividing the market into distinct segments, selecting target segments that align with the company's capabilities, and positioning products or services to meet the specific needs of those segments. It's about tailoring marketing efforts to reach the right customers with the right message.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LinkIcon size={20} /> Integrated Marketing Communications (IMC)</h3>
            <p>IMC emphasizes the importance of coordinating all marketing communication channels to deliver a consistent and unified message. This involves aligning advertising, public relations, sales promotion, and other communication tools to reinforce brand messaging and enhance customer engagement. This ensures that all customer facing messages are uniform.</p>
          </div>
        </section>

        {/* ========== SECTION 12: TECHNIQUES ASSOCIATED WITH MARKETING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Techniques Associated with Marketing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Marketing employs a diverse range of techniques to implement its principles and achieve its objectives:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Market Research</h3>
            <p>Gathering and analyzing data about customer needs, market trends, and competitive landscapes. This includes surveys, focus groups, and data analytics.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Digital Marketing</h3>
            <p>Utilizing online channels, such as websites, social media, and email, to reach and engage customers. This includes search engine optimization (SEO), social media marketing, and content marketing.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon size={20} /> Content Marketing</h3>
            <p>Creating and sharing valuable, relevant, and consistent content to attract and retain a clearly defined audience.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star size={20} /> Brand Management</h3>
            <p>Building and maintaining a strong brand identity and reputation. This involves brand positioning, brand messaging, and brand experience.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> Advertising</h3>
            <p>Using paid media to promote products or services. This includes television, radio, print, and online advertising.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> Sales Promotion</h3>
            <p>Offering incentives to stimulate immediate sales. This includes discounts, coupons, and loyalty programs.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircleIcon size={20} /> Public Relations (PR)</h3>
            <p>Building and maintaining positive relationships with the media and the public. This includes press releases, media events, and crisis communication.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> Customer Relationship Management (CRM)</h3>
            <p>Managing customer interactions and data to improve customer satisfaction and loyalty. This uses software to track customer interactions.</p>
          </div>
        </section>

        {/* ========== SECTION 13: SOURCES OF COMPETITIVE ADVANTAGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Sources of Competitive Advantages Sought Through Marketing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Effective marketing can create several sources of competitive advantage for an organization:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star size={20} /> Brand Equity</h3>
            <p>A strong brand reputation and customer loyalty can command premium prices and create a barrier to entry for competitors.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HeartIcon size={20} /> Customer Loyalty</h3>
            <p>Repeat customers provide a stable revenue stream and reduce customer acquisition costs.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Product Differentiation</h3>
            <p>Unique product features or benefits can create a competitive edge and justify higher prices.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Customer Insights</h3>
            <p>Deep understanding of customer needs and preferences can lead to the development of innovative products and services.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TruckIcon size={20} /> Efficient Distribution</h3>
            <p>Optimized distribution channels can reduce costs and improve product availability.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> Superior Customer Experience</h3>
            <p>Providing exceptional customer service and personalized experiences can create a competitive advantage.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DatabaseIcon size={20} /> Data Driven marketing</h3>
            <p>Using data to provide better customer experiences, and to target the correct customer.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Rocket size={20} /> First mover advantage</h3>
            <p>Being the first company to market a product can create a strong brand recognition, and customer loyalty.</p>
          </div>
        </section>

        {/* ========== SECTION 14: TECHNIQUES FOR STAKEHOLDER RELATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Techniques to develop, maintain, and improve relations with internal stakeholders to promote effective procurement and supply</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 1. Proactive Stakeholder Mapping and Engagement Planning</h3>
            <p>Begin by conducting a thorough stakeholder analysis to identify key internal stakeholders, their interests, influence, and potential impact on procurement and supply. This goes beyond just listing names; it involves understanding their specific needs, concerns, and communication preferences. Develop a tailored engagement plan that outlines how you will interact with each stakeholder group. This plan should include frequency of communication, preferred channels, and key messages. For example, the finance department might prefer detailed reports and data-driven presentations, while the production team might value regular, informal updates and face-to-face meetings. This proactive approach ensures that you are engaging with the right stakeholders at the right time and in the right way.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UsersIcon size={20} /> 2. Establishing Cross-Functional Teams and Joint Projects</h3>
            <p>Create cross-functional teams or joint projects that bring together representatives from procurement and supply with other departments, such as production, finance, and engineering. This fosters collaboration and breaks down silos. For example, a project team tasked with implementing a new supplier relationship management system could include members from IT, procurement, and supplier management. These teams provide a platform for stakeholders to share knowledge, perspectives, and expertise, leading to more informed decisions and better outcomes. Joint projects also promote a sense of shared ownership and responsibility, strengthening relationships and building trust.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DatabaseIcon size={20} /> 3. Implementing a Stakeholder Relationship Management (SRM) System</h3>
            <p>Consider implementing a dedicated SRM system or utilizing CRM software to track and manage interactions with internal stakeholders. This system can help you to document communication, track feedback, and monitor stakeholder satisfaction. For example, you can use the system to log meeting notes, record action items, and track the progress of issue resolution. An SRM system provides a centralized repository of stakeholder information, enabling you to maintain consistent communication and build stronger relationships. It also allows you to analyze stakeholder data to identify trends and patterns, enabling you to proactively address potential issues.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> 4. Utilizing Technology for Enhanced Communication and Collaboration</h3>
            <p>Leverage technology to enhance communication and collaboration with internal stakeholders. This includes using project management software, collaboration platforms, and communication tools. For example, you can use project management software to track the progress of procurement projects, share documents, and assign tasks. Collaboration platforms, such as Microsoft Teams or Slack, facilitate real-time communication and information sharing. Video conferencing tools enable virtual meetings, reducing travel time and costs. Utilizing technology can improve efficiency, transparency, and accessibility, leading to stronger stakeholder relationships.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCwIcon size={20} /> 5. Cultivating a Culture of Continuous Improvement and Feedback Loops</h3>
            <p>Establish a culture of continuous improvement, where feedback is actively sought and valued. Implement feedback loops to gather input from internal stakeholders on procurement and supply processes, policies, and performance. For example, conduct regular surveys, hold focus groups, or organize feedback sessions. Use this feedback to identify areas for improvement and implement changes. Communicate the results of feedback analysis and the actions taken to stakeholders, demonstrating a commitment to responsiveness and continuous improvement. This approach fosters a culture of collaboration and trust, where stakeholders feel valued and heard.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSignIcon size={20} /> 6. Demonstrating the Value of Procurement and Supply to the Organization</h3>
            <p>Proactively communicate the value of procurement and supply to the organization. This involves highlighting cost savings, risk mitigation, and other contributions to the bottom line. For example, prepare reports that showcase the impact of procurement initiatives on the organization's financial performance. Share success stories and case studies that demonstrate the positive impact of procurement and supply on other departments and the organization as a whole. By demonstrating the value of procurement and supply, you can build support and strengthen relationships with internal stakeholders.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldIcon size={20} /> 7. Building Trust Through Ethical Conduct and Integrity</h3>
            <p>Maintain the highest standards of ethical conduct and integrity in all procurement and supply activities. This involves adhering to policies and procedures, avoiding conflicts of interest, and ensuring transparency in all transactions. Building trust is essential for developing strong stakeholder relationships. For example, establish a code of ethics that outlines the organization's commitment to ethical procurement practices. Provide training to employees on ethical conduct and ensure that all stakeholders are aware of the organization's policies. Ethical conduct and integrity build credibility and foster a culture of trust and respect.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Sectors, Markets & Competition</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sectors</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Demand & Supply</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Competition</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Marketing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stakeholder Relations</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Sectors & Market Dynamics. 📈🏛️</p>
        </footer>

      </div>
    </div>
  );
};
