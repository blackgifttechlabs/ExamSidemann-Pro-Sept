import React from 'react';
import {
  FolderTree, FileText, Calendar, Hash, Database, Target, TrendingUp, BarChart,
  GanttChart, Factory, Cpu, Shield, Users, Handshake, ClockIcon, GlobeIcon,
  CheckCircle, AlertTriangle, User, Building, Briefcase, LayersIcon,
  FileSignature,  FileEdit, ArrowRightCircle, RefreshCw,
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
  CloudRain, Sun, Wind, Droplets,  Recycle,
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
  FileKey as FileKeyIcon16, FileLock as FileLockIcon16
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

  const TableWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className={`min-w-full text-sm border-collapse ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {children}
      </table>
    </div>
  );

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
              Stakeholders in <span className="text-emerald-300 font-bold italic">Procurement & Supply</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to stakeholders, profiling, suppliers, customers, consumers, communities, government, financial services, and internal/external stakeholders.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">stakeholders.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IDENTIFY</span><span className="text-white">Stakeholders;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">PROFILE</span><span className="text-white">Interest;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MANAGE</span><span className="text-white">Relationships;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Users className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Handshake className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: STAKEHOLDERS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stakeholders</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Who are they?</h3>
            <p>Stakeholders are individuals, groups, or organizations that have an interest in or can affect (or be affected by) your project or organization. This interest can be financial, emotional, or related to their values.</p>
            <p className="mt-2">They can be internal (employees, managers, shareholders) or external (customers, suppliers, community members, government agencies).</p>

            <h4 className="text-lg font-bold mt-4 mb-2">Why define them?</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>To understand who can influence your project's success.</li>
              <li>To identify potential sources of support or opposition.</li>
              <li>To tailor communication and engagement strategies.</li>
              <li>To allow for better risk management.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: PROFILING STAKEHOLDERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Profiling Stakeholders</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Once you have identified your stakeholders, you need to profile them. This involves gathering detailed information about them to understand their perspectives, needs, and potential impact.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> What to profile</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Interest:</strong> What is their level of interest in your project? What are their specific concerns or expectations?</li>
              <li><strong>Influence/Power:</strong> How much influence do they have over your project's outcome? Can they support or hinder your efforts?</li>
              <li><strong>Impact:</strong> How will your project affect them? What are the potential benefits or drawbacks for them?</li>
              <li><strong>Expectations:</strong> What do they expect from you? What are their priorities?</li>
              <li><strong>Communication Preferences:</strong> How do they prefer to receive information? What are the best channels for communication?</li>
              <li><strong>Relationship:</strong> What is their current relationship with your organization? Is it positive, negative, or neutral?</li>
              <li><strong>Values/Beliefs:</strong> What are their core values and beliefs, and how might they align or conflict with your project?</li>
              <li><strong>Potential Strategies:</strong> Based on the information gathered, what are the best ways to engage and manage this stakeholder?</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> How to profile</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Stakeholder Analysis Matrix:</strong> A visual tool to categorize stakeholders based on their power and interest.</li>
              <li><strong>Interviews and Surveys:</strong> Direct communication to gather information.</li>
              <li><strong>Research:</strong> Reviewing public information, reports, and social media.</li>
              <li><strong>Workshops:</strong> Collaborative sessions to gather input and perspectives.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> Why profile?</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>To develop targeted engagement strategies.</li>
              <li>To anticipate and address potential conflicts.</li>
              <li>To build strong relationships and trust.</li>
              <li>To maximize support, and minimize resistance.</li>
              <li>To create a better understanding of the environment that the project is operating within.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: SUPPLIERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Suppliers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Suppliers are entities that provide the necessary goods, materials, or services required for an organization's operations. Their role is fundamental to the supply chain, as they directly impact the quality, cost, and availability of resources. A strong, reliable supplier base is crucial for a business to maintain consistent production, meet customer demands, and remain competitive. Effective stakeholder management with suppliers involves building mutually beneficial relationships based on trust, transparency, and collaboration.</p>
            <p className="mt-2">This includes clear communication regarding expectations, timely payments, and fair contract terms. Regularly evaluating supplier performance, addressing any issues promptly, and seeking opportunities for continuous improvement are essential practices. Moreover, fostering innovation and collaboration with suppliers can lead to cost savings, improved product quality, and enhanced supply chain resilience.</p>
            <p className="mt-2">Suppliers are not merely vendors; they are strategic partners whose success is intertwined with the organization's own. Therefore, nurturing these relationships through open dialogue, shared goals, and mutual respect is paramount for long-term success.</p>
          </div>
        </section>

        {/* ========== SECTION 4: CUSTOMERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Customers</h2>
          </div>

          <div className={cardClasses('green')}>
            <p>Customers are the lifeblood of any business, as they are the individuals or organizations that purchase goods or services. Their satisfaction and loyalty are critical drivers of revenue and long-term profitability. Understanding and meeting customer needs and expectations is fundamental to building a successful business. Effective stakeholder management with customers involves providing high-quality products or services, delivering excellent customer service, and building strong relationships.</p>
            <p className="mt-2">This includes actively soliciting customer feedback, addressing any concerns promptly, and continuously improving products and services to meet evolving needs. Building a positive brand reputation and fostering customer loyalty through personalized experiences, community engagement, and transparent communication are essential practices. Moreover, anticipating customer needs and exceeding expectations can create a competitive advantage and drive sustainable growth.</p>
            <p className="mt-2">Customers are not just buyers; they are partners in the business's success. Therefore, cultivating these relationships through empathy, responsiveness, and a customer-centric approach is vital for long-term success.</p>
          </div>
        </section>

        {/* ========== SECTION 5: CONSUMERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Consumers</h2>
          </div>

          <div className={cardClasses('purple')}>
            <p>Consumers, in contrast to customers, may not directly purchase goods or services but are the end-users. Their perception and experience with a product or service significantly influence brand reputation and market demand. In many cases, the consumer and the customer are the same person. However, they can be different, such as when a parent purchases a toy for their child. Effective stakeholder management with consumers involves understanding their needs, preferences, and values, and ensuring that products and services are safe, reliable, and ethically produced. This includes transparent labeling, accurate advertising, and responsible marketing practices.</p>
            <p className="mt-2">Addressing consumer concerns regarding product safety, environmental impact, and social responsibility is crucial for building trust and maintaining a positive brand image. Moreover, engaging with consumers through social media, community events, and feedback mechanisms can foster a sense of connection and loyalty.</p>
            <p className="mt-2">Consumers are not just end-users; they are influential stakeholders whose opinions and perceptions shape market trends and brand reputation. Therefore, prioritizing consumer satisfaction and building a positive brand experience is essential for long-term success.</p>
          </div>
        </section>

        {/* ========== SECTION 6: COMMUNITIES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Communities</h2>
          </div>

          <div className={cardClasses('amber')}>
            <p>Communities are the geographic or social groups in which an organization operates. Their well-being and support are essential for the organization's long-term sustainability and social license to operate. Effective stakeholder management with communities involves understanding their needs, concerns, and values, and engaging in responsible and ethical business practices. This includes minimizing environmental impact, supporting local initiatives, and creating employment opportunities. Building strong relationships with community leaders, residents, and organizations through open dialogue, transparency, and active participation is crucial. Addressing community concerns regarding environmental protection, social equity, and economic development is essential for building trust and fostering a positive reputation. Moreover, engaging in corporate social responsibility (CSR) initiatives that align with community needs and values can create shared value and contribute to sustainable development. Communities are not just neighbors; they are influential stakeholders whose support and goodwill are vital for the organization's long-term success. Therefore, prioritizing community engagement and building mutually beneficial relationships is essential.</p>
          </div>
        </section>

        {/* ========== SECTION 7: GOVERNMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Government</h2>
          </div>

          <div className={cardClasses('red')}>
            <p>Government entities at the local, regional, and national levels play a significant role in regulating and influencing business operations. They establish laws, policies, and regulations that impact various aspects of business, including taxation, environmental protection, labor practices, and consumer safety. Effective stakeholder management with government involves understanding and complying with relevant laws and regulations, engaging in constructive dialogue, and advocating for policies that support business growth and societal well-being. This includes building relationships with government officials, participating in industry associations, and providing input on proposed legislation.</p>
            <p className="mt-2">Maintaining transparency and accountability in all dealings with government is crucial for building trust and avoiding legal or regulatory issues. Moreover, engaging in public-private partnerships and supporting government initiatives that align with business goals can create shared value and contribute to economic development.</p>
            <p className="mt-2">Government entities are not just regulators; they are influential stakeholders whose policies and actions shape the business environment. Therefore, prioritizing government relations and building mutually beneficial partnerships is essential.</p>
          </div>
        </section>

        {/* ========== SECTION 8: FINANCIAL SERVICES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Financial Services</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <p>Financial services stakeholders encompass banks, investors, insurance companies, and other entities that provide capital, manage risk, and facilitate financial transactions. Their support and confidence are crucial for an organization's financial stability and growth. Effective stakeholder management with financial services involves maintaining transparency and accountability in financial reporting, building strong relationships with investors and lenders, and managing financial risks effectively. This includes providing accurate and timely financial information, communicating financial performance and strategies, and adhering to regulatory requirements. Building trust and confidence among financial stakeholders through ethical conduct, sound financial management, and responsible risk-taking is essential. Moreover, engaging in dialogue with investors and analysts to address their concerns and provide insights into the organization's financial performance and outlook is crucial.</p>
            <p className="mt-2">Financial services stakeholders are not just providers of capital; they are influential partners whose support and confidence are vital for the organization's financial success. Therefore, prioritizing financial stakeholder relations and building mutually beneficial partnerships is essential.</p>
          </div>
        </section>

        {/* ========== SECTION 9: DIFFERENCE BETWEEN CUSTOMERS AND CONSUMERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Difference between customers and consumers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <TableWrapper>
              <thead>
                <tr className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                  <th className="border p-2 text-left font-bold">Feature</th>
                  <th className="border p-2 text-left font-bold">Customer</th>
                  <th className="border p-2 text-left font-bold">Consumer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">1. Definition</td>
                  <td className="border p-2">A customer is the individual or organization that purchases goods or services from a seller. They are the buyer in a transaction.</td>
                  <td className="border p-2">A consumer is the individual or end user who ultimately uses or consumes the goods or services. They are the user.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">2. Purchase Decision</td>
                  <td className="border p-2">The customer makes the buying decision and initiates the transaction. They are responsible for the financial exchange.</td>
                  <td className="border p-2">The consumer may or may not be involved in the purchase decision. Often, they are the recipient or user of the purchased item.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">3. Relationship with Seller</td>
                  <td className="border p-2">The customer has a direct transactional relationship with the seller. This relationship is defined by the exchange of goods or services for payment.</td>
                  <td className="border p-2">The consumer may have an indirect relationship with the seller, based on their experience with the product or service. They may not have direct contact with the seller.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">4. Focus</td>
                  <td className="border p-2">The customer's focus is on the purchase process, including price, availability, terms of sale, and the seller's reputation.</td>
                  <td className="border p-2">The consumer's focus is on the product or service's performance, quality, usability, and their overall experience.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">5. Influence</td>
                  <td className="border p-2">The customer influences the seller's revenue directly through purchases. They have the power to choose alternative sellers.</td>
                  <td className="border p-2">The consumer influences market demand and brand reputation through their usage and feedback. Their opinions impact future sales.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">6. Legal Status</td>
                  <td className="border p-2">The customer typically enters into a formal or informal contractual agreement with the seller.</td>
                  <td className="border p-2">The consumer may not have a direct contractual relationship with the seller, especially if the product was purchased by someone else.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">7. Example Scenario</td>
                  <td className="border p-2">A customer is a company's purchasing manager who buys office supplies in bulk for the company. They are concerned with cost, delivery schedules, and supplier reliability.</td>
                  <td className="border p-2">A consumer is an employee who uses those office supplies to perform their daily tasks. They are concerned with the quality and usability of the supplies. Or, a parent buys a toy, the child that plays with the toy is the consumer.</td>
                </tr>
              </tbody>
            </TableWrapper>
          </div>
        </section>

        {/* ========== SECTION 10: ROLE OF PROCUREMENT AND SUPPLY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Role Of Procurement And Supply</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The procurement and supply function plays a pivotal role in the smooth and efficient operation of any business, acting as a crucial bridge between various internal departments. Let's examine its role in dealing with other business functions, focusing on production as a prime example:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> 1. Procurement and Supply's Role in Production</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Ensuring Material Availability:</strong> Production relies heavily on a consistent and timely supply of raw materials, components, and other necessary inputs. Procurement and supply are responsible for sourcing these materials from reliable suppliers, negotiating favorable terms, and ensuring that they are delivered to the production floor when needed. Any delays or shortages can disrupt production schedules, leading to costly downtime and missed deadlines. For example, in an automotive manufacturing plant, procurement must ensure that steel, plastic, electronic components, and other materials are available in the right quantities and at the right time to keep the assembly lines running.</li>
              <li><strong>Maintaining Quality Standards:</strong> The quality of finished products is directly influenced by the quality of the materials used in their production. Procurement and supply are responsible for selecting suppliers who meet stringent quality standards and ensuring that incoming materials are inspected and verified. This involves working closely with quality control teams to establish specifications and conduct regular audits. For instance, in a food processing plant, procurement must ensure that all ingredients are sourced from reputable suppliers and meet strict food safety regulations.</li>
              <li><strong>Optimizing Production Costs:</strong> Material costs often represent a significant portion of the overall production costs. Procurement and supply play a crucial role in managing these costs through effective negotiation, strategic sourcing, and inventory management. By identifying cost-saving opportunities and streamlining the supply chain, they can help to improve production efficiency and profitability. Example: negotiating bulk purchase discounts, or finding alternate sources for materials that are less expensive.</li>
              <li><strong>Supporting Production Planning:</strong> Effective production planning requires accurate information on material availability, lead times, and supplier capabilities. Procurement and supply provide this information to production planning teams, enabling them to develop realistic production schedules and avoid disruptions. They also collaborate with production teams to forecast future material requirements and ensure that adequate inventory levels are maintained. Example: Communicating supplier lead times, and market changes that may effect the availability of materials.</li>
              <li><strong>Driving Innovation:</strong> Procurement and supply can play a vital role in driving innovation by identifying and introducing new materials, technologies, and suppliers to the production process. They collaborate with research and development teams to explore new possibilities and improve product performance. Example: Finding a new material that is lighter, stronger, or more sustainable, that can be used in the product.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 11: INTERNAL STAKEHOLDERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Internal Stakeholders</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FactoryIcon2 size={20} /> 1. Production/Operations</h3>
            <p>Production/Operations is the lifeblood of manufacturing and service delivery, heavily reliant on the seamless flow of materials and resources. This department's direct interaction with the procured goods means they are acutely aware of quality, consistency, and timeliness. They provide invaluable feedback on material performance, identifying any deviations from specifications or operational challenges caused by supplier shortcomings. For example, if raw materials consistently arrive late or are of substandard quality, production schedules are disrupted, leading to increased costs, idle labor, and potential customer dissatisfaction. Conversely, when procurement ensures a steady flow of high-quality materials, production efficiency is optimized, and output quality is enhanced.</p>
            <p className="mt-2">Production also plays a vital role in forecasting future material needs, based on anticipated production schedules and demand fluctuations. This information is crucial for procurement to plan sourcing strategies, negotiate favorable contracts, and maintain appropriate inventory levels. The collaborative relationship between production and procurement is therefore essential for achieving operational excellence and meeting customer demands.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> 2. Finance/Accounting</h3>
            <p>The Finance/Accounting department acts as the financial gatekeeper, overseeing the budget and ensuring that procurement activities align with the organization's financial goals. They meticulously monitor procurement spending, scrutinize purchase orders, and analyze cost data to identify opportunities for savings and efficiency improvements. Accurate financial reporting is paramount, and Finance relies on procurement to provide transparent and verifiable data on all transactions. For example, they will track the actual cost of goods purchased against the budgeted cost, and will investigate any variances. They also ensure that all procurement activities comply with financial policies and regulations, mitigating the risk of fraud or financial irregularities.</p>
            <p className="mt-2">The approval of purchase orders, particularly for high-value items or critical supplies, often requires the authorization of Finance, ensuring that spending is aligned with budgetary constraints. Furthermore, Finance plays a crucial role in evaluating the financial stability of potential suppliers, assessing their creditworthiness and mitigating the risk of financial losses. Therefore, procurement's collaboration with Finance is essential for maintaining financial discipline, optimizing spending, and ensuring the organization's financial health.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> 3. Quality Control/Assurance</h3>
            <p>Quality Control/Assurance is the guardian of product integrity, ensuring that procured materials meet the required standards and specifications. They work closely with procurement to establish quality criteria, conduct supplier audits, and inspect incoming goods. Any deviations from quality standards, such as defective materials or non-compliance with specifications, are promptly reported to procurement, triggering corrective actions and supplier performance evaluations.</p>
            <p className="mt-2">For example, if a batch of raw materials fails to meet quality standards, Quality Control will initiate a rejection process, preventing the use of substandard materials in production. This not only safeguards product quality but also minimizes the risk of costly rework or product recalls. Quality Control also plays a vital role in evaluating the effectiveness of supplier quality management systems, identifying areas for improvement, and fostering a culture of continuous improvement. The collaboration between Quality Control and procurement is therefore essential for ensuring product quality, mitigating risks, and building strong supplier relationships.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Wrench size={20} /> 4. Engineering/Research and Development (R&D)</h3>
            <p>Engineering/R&D is the engine of innovation, driving the development of new products and technologies. They often require specialized materials, components, and equipment that push the boundaries of existing technologies. Procurement plays a crucial role in sourcing these innovative solutions, collaborating with Engineering/R&D to identify potential suppliers and evaluate new materials. For example, when developing a new product, Engineering/R&D may require materials with specific properties or performance characteristics.</p>
            <p className="mt-2">Procurement will then conduct market research, identify potential suppliers, and negotiate contracts for the supply of these materials. They also assist in the evaluation of new suppliers, ensuring that they meet the technical requirements and quality standards of the organization. Furthermore, Engineering/R&D relies on procurement to provide information on market trends, new technologies, and supplier capabilities, enabling them to make informed decisions about product design and development. The collaboration between Engineering/R&D and procurement is therefore essential for driving innovation, maintaining a competitive edge, and ensuring the successful development of new products and technologies.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><UsersIcon size={20} /> 5. Senior Management/Executive Team</h3>
            <p>Senior Management/Executive Team provides the strategic direction and overall oversight for the procurement and supply function. They set the organization's goals and objectives, allocate resources, and monitor procurement performance. They are responsible for ensuring that procurement activities align with the organization's strategic priorities and contribute to its overall success.</p>
            <p className="mt-2">For example, they may set targets for cost savings, supplier diversity, or sustainable sourcing. They also approve major contracts and investments, ensuring that they are aligned with the organization's financial and strategic objectives. Senior Management also plays a crucial role in fostering a culture of ethical conduct and compliance, ensuring that procurement activities are conducted in a transparent and responsible manner.</p>
            <p className="mt-2">Furthermore, they are responsible for communicating the importance of procurement to the organization, and for ensuring that the procurement department has the resources and support it needs to be successful. The communication between Senior Management and procurement is essential for ensuring that procurement is aligned with the organization's strategic goals, and that it is contributing to the organization's overall success.</p>
          </div>
        </section>

        {/* ========== SECTION 12: EXTERNAL STAKEHOLDERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>External Stakeholders</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> 1. Suppliers</h3>
            <p>Suppliers are the cornerstone of the procurement and supply chain, providing the essential materials, components, and services required for an organization's operations. Their performance directly impacts the availability, quality, and cost of goods and services. A reliable and responsive supplier base is crucial for maintaining production schedules, meeting customer demands, and ensuring business continuity. For example, a supplier's ability to deliver materials on time and in accordance with quality specifications directly affects the organization's ability to meet its production targets and customer delivery commitments. Suppliers also play a vital role in innovation, introducing new materials, technologies, and solutions that can improve product performance and reduce costs. Effective supplier relationship management is therefore essential, involving clear communication, fair contract terms, and collaborative problem-solving. Building strong partnerships with key suppliers can lead to mutual benefits, such as cost savings, improved quality, and enhanced supply chain resilience.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShoppingCartIcon size={20} /> 2. Customers</h3>
            <p>Customers are the ultimate recipients of an organization's products and services, and their expectations and demands directly influence procurement decisions. Their feedback on product quality, delivery times, and customer service provides valuable insights into the effectiveness of the supply chain. For example, if customers consistently complain about product defects or late deliveries, procurement must investigate the root causes and take corrective actions, such as switching suppliers or implementing stricter quality control measures.</p>
            <p className="mt-2">Customers also play a vital role in driving innovation, demanding new products and features that require the sourcing of specialized materials and components. Effective customer relationship management is therefore essential, involving active listening, prompt response to inquiries, and a commitment to meeting customer needs. By understanding customer expectations and preferences, procurement can ensure that the supply chain is aligned with customer demands, leading to increased customer satisfaction and loyalty.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BuildingIcon size={20} /> 3. Regulatory Bodies/Government Agencies</h3>
            <p>Regulatory bodies and government agencies play a crucial role in setting standards and regulations that impact procurement practices. They establish rules related to environmental protection, labor practices, product safety, and import/export controls. Compliance with these regulations is essential for avoiding legal penalties, maintaining a positive reputation, and ensuring ethical sourcing. For example, environmental regulations may require organizations to source materials from sustainable sources or implement waste reduction programs. Government agencies also play a vital role in enforcing trade agreements and tariffs, which can significantly impact the cost and availability of imported goods. Effective government relations are therefore essential, involving proactive engagement with regulatory bodies, participation in industry consultations, and a commitment to complying with all applicable laws and regulations.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><UsersIcon size={20} /> 4. Industry Associations</h3>
            <p>Industry associations serve as a valuable resource for procurement professionals, providing guidance on best practices, market trends, and regulatory changes. They offer training programs, networking opportunities, and access to industry experts, enabling organizations to stay informed and competitive. For example, industry associations may publish reports on emerging technologies, sustainable sourcing practices, or supply chain risk management.</p>
            <p className="mt-2">They also play a vital role in advocating for industry interests, representing the collective voice of their members in discussions with government agencies and other stakeholders. Effective participation in industry associations is therefore essential, involving active engagement in committees, attending conferences, and contributing to industry initiatives.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> 5. Financial Institutions/Investors</h3>
            <p>Financial institutions and investors play a critical role in providing the capital and resources required for procurement activities. They monitor the organization's financial performance, assess its creditworthiness, and evaluate the effectiveness of its risk management practices. For example, investors may scrutinize the organization's financial statements to assess its profitability, liquidity, and debt levels. They also evaluate the organization's supply chain risks, such as disruptions due to natural disasters or geopolitical events. Effective financial communication is therefore essential, involving transparent reporting, accurate financial data, and a clear articulation of the organization's procurement strategies and risk mitigation plans. Building strong relationships with financial institutions and investors can lead to access to capital, favorable credit terms, and increased investor confidence.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Stakeholders in Procurement & Supply</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stakeholders</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Profiling</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suppliers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Consumers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Internal/External</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Stakeholder Management. 🤝📊</p>
        </footer>

      </div>
    </div>
  );
};
