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
  FileKey as FileKeyIcon16, FileLock as FileLockIcon16,
  ChartLine, ChartNoAxesCombined, ChartColumn, ChartPie,
  TrendingDown, ArrowUp, ArrowDown, Equal,
  Store, ShoppingBag, Megaphone, Radio,
  Building as BuildingIcon5, Users as UsersIcon5,
  TreePine, Mountain, Droplet as DropletIcon2,
  Factory as FactoryIcon3, Briefcase as BriefcaseIcon3,
  Store as StoreIcon, Building2 as BuildingIcon6,
  MessageSquare, MessageCircle as MessageCircleIcon4,
  Mic, Phone as PhoneIcon5, Mail as MailIcon5,
  Users as UsersIcon6, UserPlus, UserMinus,
  UserCheck as UserCheckIcon2, UserX, UserCog,
  UsersRound, Handshake as HandshakeIcon5,
  Target as TargetIcon5, Award as AwardIcon,
  Star as StarIcon, BadgeCheck as BadgeCheckIcon2,
  CheckCircle as CheckCircleIcon5, XCircle as XCircleIcon3,
  AlertTriangle as AlertTriangleIcon5, Shield as ShieldIcon5,
  Lock as LockIcon2, Key as KeyIcon2,
  Link as LinkIcon2, GitBranch as GitBranchIcon,
  Network as NetworkIcon, Globe as GlobeIcon7,
  Building as BuildingIcon7, Briefcase as BriefcaseIcon4,
  Calendar as CalendarIcon4, Clock as ClockIcon2,
  FileText as FileTextIcon18, FileCheck as FileCheckIcon18,
  FileSignature as FileSignatureIcon18, FilePlus as FilePlusIcon18,
  FileMinus as FileMinusIcon18, FileEdit as FileEditIcon18,
  FileSearch as FileSearchIcon11, FileSpreadsheet as FileSpreadsheetIcon17,
  FileClock as FileClockIcon17, FileX as FileXIcon17,
  FileBadge as FileBadgeIcon17, FileKey as FileKeyIcon17,
  FileLock as FileLockIcon17, FileText as FileTextIcon19,
  FileCheck as FileCheckIcon19, FileSignature as FileSignatureIcon19,
  FilePlus as FilePlusIcon19, FileMinus as FileMinusIcon19,
  FileEdit as FileEditIcon19, FileSearch as FileSearchIcon12,
  FileSpreadsheet as FileSpreadsheetIcon18, FileClock as FileClockIcon18,
  FileX as FileXIcon18, FileBadge as FileBadgeIcon18,
  FileKey as FileKeyIcon18, FileLock as FileLockIcon18,
  FileText as FileTextIcon20, FileCheck as FileCheckIcon20,
  FileSignature as FileSignatureIcon20, FilePlus as FilePlusIcon20,
  FileMinus as FileMinusIcon20, FileEdit as FileEditIcon20,
  FileSearch as FileSearchIcon13, FileSpreadsheet as FileSpreadsheetIcon19,
  FileClock as FileClockIcon19, FileX as FileXIcon19,
  FileBadge as FileBadgeIcon19, FileKey as FileKeyIcon19,
  FileLock as FileLockIcon19, FileText as FileTextIcon21,
  FileCheck as FileCheckIcon21, FileSignature as FileSignatureIcon21,
  FilePlus as FilePlusIcon21, FileMinus as FileMinusIcon21,
  FileEdit as FileEditIcon21, FileSearch as FileSearchIcon14,
  FileSpreadsheet as FileSpreadsheetIcon20, FileClock as FileClockIcon20,
  FileX as FileXIcon20, FileBadge as FileBadgeIcon20,
  FileKey as FileKeyIcon20, FileLock as FileLockIcon20
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
              Negotiation & <span className="text-purple-300 font-bold italic">Team Development</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to contract negotiation techniques, communication importance, group cohesiveness, effective workgroups, and team development stages.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">negotiation_team.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">NEGOTIATE</span><span className="text-white">Terms;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">COMMUNICATE</span><span className="text-white">Effectively;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">BUILD</span><span className="text-white">Teams;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Handshake className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Users className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: NEGOTIATING CONTRACT TERMS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Negotiating Contract Terms</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Negotiating effective contract terms and fostering strong relationships with suppliers and customers is essential for achieving the overarching interests of an organization. Here are several key negotiating techniques, with detailed explanations, to help navigate these crucial interactions:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 1. Principled Negotiation (Interest-Based Bargaining)</h3>
            <p>Principled negotiation focuses on finding mutually beneficial solutions by focusing on the underlying interests of all parties involved, rather than rigidly adhering to pre-determined positions. This technique emphasizes separating the people from the problem, focusing on interests not positions, inventing options for mutual gain, and insisting on objective criteria. Begin by understanding the core needs and motivations of your suppliers or customers. For example, a supplier might prioritize long-term stability and consistent order volumes, while a customer may emphasize quality and on-time delivery. Identify common ground and explore creative solutions that address the needs of both sides. By prioritizing collaboration over confrontation, principled negotiation fosters trust and promotes win-win outcomes that strengthen long-term relationships. This method helps to avoid deadlocks, and preserves relationships.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircleIcon size={20} /> 2. Building Rapport and Trust Through Active Listening</h3>
            <p>Before diving into the specifics of a contract, establish a strong foundation of rapport and trust. Active listening is crucial in this process. Demonstrate genuine interest in the other party's perspective by attentively listening to their concerns, asking clarifying questions, and summarizing their points. This shows respect and encourages open communication. Building rapport also involves finding common ground and establishing a friendly and professional atmosphere. For instance, sharing relevant industry insights or discussing shared experiences can help build connection. By creating a comfortable and trusting environment, you can foster a more collaborative and productive negotiation process. Understanding the other parties priorities is paramount to crafting an acceptable deal.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> 3. Utilizing the Power of Preparation and Research</h3>
            <p>Thorough preparation is paramount in any successful negotiation. Conduct comprehensive research on the supplier or customer, their industry, and their market position. Understand their strengths, weaknesses, and potential leverage points. Gather data on market trends, competitor pricing, and relevant legal and regulatory requirements. Define your own objectives and develop a range of acceptable outcomes, considering potential trade-offs and concessions. Having well-researched, factual data makes your proposals more compelling, and enables better counter arguments. Prepare counter arguments to potential points, so that time is not wasted during the negotiation. This demonstrates preparedness, and builds credibility.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowRightCircle size={20} /> 4. Employing Strategic Concessions and Trade-Offs</h3>
            <p>Successful negotiation involves making strategic concessions and trade-offs to reach mutually agreeable terms. However, concessions should never be given freely; they should be carefully considered and strategically deployed. For instance, you might offer a slight price reduction in exchange for longer payment terms or a commitment to increased order volumes. Understand the other party's priorities and focus on offering concessions that are valuable to them while minimizing their impact on your own interests. Explore opportunities for trade-offs that create mutual gain, such as sharing risks or offering reciprocal benefits. This ensures that the other party feels as though they have won, and that the deal is fair.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> 5. Applying Effective Communication and Persuasion Techniques</h3>
            <p>Clear and persuasive communication is essential for conveying your message and influencing the other party's perspective. Frame your proposals in a way that highlights the benefits to the other party and aligns with their interests. Use data and evidence to support your arguments, and be prepared to address any objections or concerns. Employ non-verbal communication cues, such as eye contact and body language, to reinforce your message and build rapport. Practice active listening and empathy to understand the other party's perspective and build trust. Effective communication builds bridges, and provides for faster deal completions.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HeartIcon size={20} /> 6. Focusing on Long-Term Relationship Building</h3>
            <p>Negotiations are not merely transactional events; they are opportunities to build long-term relationships. Shift your focus from short-term gains to creating mutually beneficial partnerships that foster collaboration and trust. Seek to understand the supplier or customer's long-term goals and objectives, and explore ways to align your interests. Demonstrate a commitment to fairness, transparency, and ethical conduct. By prioritizing relationship building, you can create a foundation for ongoing collaboration and mutual success, maximizing value and minimizing conflict over time. Remember, good business deals are a long-term goal.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GavelIcon size={20} /> 7. Utilizing Mediation or Arbitration When Needed</h3>
            <p>In situations where negotiation impasses occur, be prepared to utilize mediation or arbitration to resolve disputes. A neutral third party can help facilitate communication and find common ground. Ensure that any agreement reached through these means is clearly documented and legally binding. Knowing when to escalate a situation is also useful. It saves time, and money.</p>
          </div>
        </section>

        {/* ========== SECTION 2: IMPORTANCE OF COMMUNICATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of communication</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Appropriate and timely communication with stakeholders and suppliers is absolutely vital for the success of any organization, especially in the context of procurement and supply. It's not just about exchanging information; it's about building trust, fostering collaboration, and ensuring smooth operations. Here's a deeper exploration of its importance:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HandshakeIcon size={20} /> 1. Building and Maintaining Strong Relationships</h3>
            <p>Consistent and clear communication is the cornerstone of strong relationships. For stakeholders, it demonstrates that their input is valued and that they are kept informed about relevant developments. For suppliers, it establishes a sense of partnership, moving beyond a purely transactional relationship. Regular communication fosters trust, which is essential for long-term collaboration. For example, a supplier who receives timely updates about upcoming orders and potential changes in demand is more likely to be responsive and flexible. Conversely, a stakeholder who feels ignored or uninformed may become disengaged or even hostile. Appropriate communication helps to build bridges, resolve conflicts, and create a positive environment for collaboration.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ZapIcon size={20} /> 2. Ensuring Operational Efficiency and Reducing Disruptions</h3>
            <p>Timely communication is crucial for preventing and mitigating disruptions in the supply chain. For example, if a supplier anticipates a delay in delivery, informing the organization promptly allows for contingency plans to be put in place. This proactive approach can prevent production stoppages and minimize the impact on customers. Similarly, communicating changes in demand forecasts to suppliers allows them to adjust their production schedules and avoid overstocking or understocking. Effective communication also facilitates smooth coordination between different departments within the organization. For example, procurement needs to communicate with production about material availability, and with finance about payment schedules. These exchanges of information keep the entire operation running smoothly.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> 3. Enhancing Transparency and Accountability</h3>
            <p>Transparency in communication builds trust and accountability. When stakeholders and suppliers are kept informed about relevant processes, decisions, and performance metrics, they are more likely to have confidence in the organization's actions. For example, sharing information about supplier selection criteria and performance evaluations demonstrates a commitment to fairness and objectivity. This transparency minimizes the risk of misunderstandings and disputes, as all parties have access to the same information. Accountability is also enhanced when communication is documented and tracked. This provides a record of agreements, commitments, and actions taken, which can be useful for resolving disputes and evaluating performance.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> 4. Facilitating Effective Problem-Solving and Decision-Making</h3>
            <p>Timely communication allows for the rapid identification and resolution of problems. When issues arise, prompt and open communication enables stakeholders and suppliers to collaborate and find solutions quickly. For example, if a quality issue is identified with a batch of materials, immediate communication with the supplier allows for corrective actions to be taken. Similarly, if there are changes in market conditions that affect the availability or price of materials, timely communication allows for adjustments to be made to procurement strategies. Effective communication also facilitates informed decision-making by providing stakeholders with the necessary information to assess options and make sound choices.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUpIcon size={20} /> 5. Improving Supplier Performance and Innovation</h3>
            <p>Regular communication with suppliers is essential for monitoring their performance and identifying areas for improvement. Providing feedback on supplier performance, both positive and negative, helps them to understand expectations and make necessary adjustments. Open communication also fosters a culture of innovation, where suppliers are encouraged to share ideas and suggest improvements. For example, regular meetings with key suppliers can provide a platform for discussing new technologies, process improvements, and cost-saving opportunities. This collaborative approach can lead to significant benefits for both the organization and its suppliers.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldIcon size={20} /> 6. Reducing Costs and Mitigating Risks</h3>
            <p>Effective communication can help to reduce costs and mitigate risks in the supply chain. By providing timely information about changes in demand, market conditions, or supplier performance, organizations can make proactive decisions that minimize disruptions and avoid costly mistakes. For example, communicating changes in inventory levels to suppliers can prevent overstocking or understocking, reducing storage costs and minimizing the risk of stockouts. Similarly, communicating potential risks related to supplier financial stability or geopolitical events allows for contingency plans to be developed. This proactive approach can help to protect the organization from financial losses and operational disruptions.</p>
          </div>
        </section>

        {/* ========== SECTION 3: GROUP COHESIVENESS AND PERFORMANCE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Group Cohesiveness and Performance</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Group cohesiveness refers to the degree to which members of a group are attracted to each other and motivated to stay in the group. Performance, on the other hand, refers to the effectiveness of the group in achieving its goals. While a highly cohesive group doesn't automatically guarantee high performance, it significantly influences it.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircleIcon size={20} /> 1. Positive Impacts of Group Cohesiveness on Performance</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Increased Communication and Collaboration:</strong> Cohesive groups tend to have more open and frequent communication. Members are more likely to share information, ideas, and feedback, leading to better problem-solving and decision-making. This collaborative environment fosters a sense of teamwork and shared responsibility, enhancing overall performance.</li>
              <li><strong>Enhanced Motivation and Effort:</strong> Members of cohesive groups are more motivated to contribute to the group's goals. They are more likely to put in extra effort, support their teammates, and go the extra mile to ensure the group's success. This heightened motivation stems from a sense of belonging and a desire to maintain positive relationships within the group.</li>
              <li><strong>Improved Task Performance:</strong> Cohesive groups tend to perform better on tasks that require coordination, cooperation, and teamwork. Members are more likely to align their efforts, share resources, and provide mutual support, leading to higher levels of productivity and efficiency.</li>
              <li><strong>Reduced Conflict and Increased Harmony:</strong> Cohesive groups tend to experience less conflict and more harmony. Members are more likely to resolve disagreements constructively and maintain positive relationships. This harmonious environment creates a sense of stability and predictability, allowing the group to focus on achieving its goals.</li>
              <li><strong>Increased Member Satisfaction and Commitment:</strong> Members of cohesive groups are more likely to be satisfied with their group experience and committed to the group's goals. This increased satisfaction and commitment can lead to lower turnover rates and higher levels of engagement.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> 2. Factors That Influence the Relationship</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Performance Norms:</strong> The relationship between cohesiveness and performance is strongest when the group has high-performance norms. If the group values high performance and sets high standards, cohesiveness will amplify these norms, leading to excellent performance. However, if the group has low-performance norms, cohesiveness can actually hinder performance.</li>
              <li><strong>Task Interdependence:</strong> The relationship between cohesiveness and performance is stronger when the group's tasks are highly interdependent. In these situations, members must rely on each other to achieve their goals, and cohesiveness becomes crucial for effective coordination and collaboration.</li>
              <li><strong>External Threats:</strong> External threats can sometimes increase group cohesiveness, as members rally together to face a common challenge. However, this can also lead to "groupthink," where the group becomes overly focused on maintaining harmony and ignores dissenting opinions.</li>
              <li><strong>Group Size:</strong> Smaller groups often have higher cohesiveness than larger groups. In smaller groups it is easier to build relationships.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangleIcon size={20} /> 3. Potential Drawbacks of High Cohesiveness</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Groupthink:</strong> As mentioned earlier, highly cohesive groups can sometimes fall victim to groupthink, where members prioritize conformity over critical thinking. This can lead to poor decision-making and a lack of innovation.</li>
              <li><strong>Resistance to Change:</strong> Cohesive groups may be resistant to change, as members are comfortable with the status quo and may be reluctant to embrace new ideas or approaches.</li>
              <li><strong>Out-Group Bias:</strong> Highly cohesive groups can sometimes develop an "us versus them" mentality, leading to prejudice and discrimination against other groups.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: CHARACTERISTICS OF AN EFFECTIVE WORKGROUP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Characteristics of an effective workgroup</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>An effective workgroup is more than just a collection of individuals; it's a dynamic entity characterized by specific attributes that contribute to its success. Here's a breakdown of the key characteristics:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> 1. Clear and Shared Goals</h3>
            <p>An effective workgroup has a clear understanding of its purpose and objectives. Members are aligned on the group's goals and how their individual contributions contribute to the overall mission. This clarity provides direction, focus, and a sense of shared purpose, motivating members to work collaboratively towards achieving common objectives.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageCircleIcon size={20} /> 2. Open and Honest Communication</h3>
            <p>Effective workgroups foster an environment of open and honest communication. Members feel comfortable sharing their ideas, concerns, and feedback without fear of judgment or reprisal. Active listening, respectful dialogue, and clear articulation are essential for effective communication. This ensures that information flows freely, misunderstandings are minimized, and problems are addressed promptly.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> 3. Mutual Trust and Respect</h3>
            <p>Trust is the foundation of any effective workgroup. Members trust each other's competence, integrity, and commitment to the group's goals. They respect each other's opinions, perspectives, and contributions, even when they differ. This fosters a sense of psychological safety, allowing members to take risks, express themselves freely, and collaborate effectively.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><UsersIcon size={20} /> 4. Collaborative Problem-Solving and Decision-Making</h3>
            <p>Effective workgroups approach problem-solving and decision-making collaboratively. Members pool their knowledge, skills, and perspectives to generate creative solutions and make informed choices. They value diverse viewpoints and engage in constructive debate, ensuring that all relevant factors are considered. This collaborative approach leads to better decisions and increased buy-in from group members.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> 5. Clearly Defined Roles and Responsibilities</h3>
            <p>In an effective workgroup, roles and responsibilities are clearly defined and understood by all members. This eliminates ambiguity, avoids duplication of effort, and ensures that everyone knows what is expected of them. Members understand their individual contributions and how they fit into the overall group dynamic.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><StarIcon size={20} /> 6. Shared Leadership and Accountability</h3>
            <p>Effective workgroups often exhibit shared leadership, where members take initiative and contribute their expertise as needed. This doesn't necessarily mean that there is no formal leader, but rather that leadership is distributed and collaborative. Members hold themselves and each other accountable for their actions and contributions, ensuring that tasks are completed on time and to a high standard.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> 7. Constructive Conflict Management</h3>
            <p>Conflict is inevitable in any group, but effective workgroups manage it constructively. Members approach disagreements with a focus on finding solutions and maintaining positive relationships. They are able to communicate their concerns respectfully, listen to others' perspectives, and work together to resolve issues.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HeartIcon size={20} /> 8. High Levels of Cohesion</h3>
            <p>Members of effective workgroups feel a strong sense of belonging and are motivated to stay in the group. They enjoy working together, support each other, and celebrate their successes. This cohesion fosters a positive and productive work environment.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> 9. Continuous Learning and Improvement</h3>
            <p>Effective workgroups are committed to continuous learning and improvement. They regularly evaluate their performance, identify areas for improvement, and implement changes to enhance their effectiveness. They are open to feedback and are willing to adapt and evolve.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ZapIcon size={20} /> 10. Adaptability and Flexibility</h3>
            <p>Effective workgroups are able to adapt to changing circumstances and remain flexible in the face of challenges. They are able to adjust their plans, strategies, and processes as needed, ensuring that they remain effective in a dynamic environment.</p>
          </div>
        </section>

        {/* ========== SECTION 5: STAGES OF TEAM DEVELOPMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stages Of Team Development</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><UserPlus size={20} /> 1. Forming: The Genesis of Collaboration and Uncertainty</h3>
            <p>The forming stage marks the inception of a team, a period characterized by cautious exploration and a palpable sense of uncertainty. Individuals, often strangers or acquaintances, come together with a shared purpose, yet they grapple with ambiguity surrounding their roles, responsibilities, and the team's overall direction. This stage is akin to a social dance, where participants navigate unfamiliar territory, seeking to establish a sense of belonging and understand the unspoken rules of engagement. Politeness and formality prevail, as members strive to make a positive first impression and avoid conflict.</p>
            <p className="mt-2">The leader, if designated, assumes a directive role, providing structure and guidance to alleviate the team's anxiety. Ground rules are established, expectations are set, and the team begins to define its boundaries. However, beneath the surface of polite interactions lies a degree of apprehension, as members grapple with questions about their competence, acceptance, and the team's potential for success. Trust is nascent, and individuals are hesitant to fully commit or reveal their true selves. This stage is crucial for laying the groundwork for future collaboration, but it requires patience, empathy, and a willingness to embrace the inherent ambiguity of new beginnings.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangleIcon size={20} /> 2. Storming: Navigating Conflict and Asserting Individuality</h3>
            <p>The storming stage is a turbulent phase, marked by conflict, competition, and a struggle for power. As team members become more comfortable with each other, they begin to assert their individuality and challenge the team's direction. Disagreements arise over priorities, decision-making processes, and leadership styles. Power struggles ensue, and frustration mounts as members grapple with differing opinions and competing agendas.</p>
            <p className="mt-2">This stage can be characterized by open hostility, passive-aggressive behavior, or a combination of both. Cliques and subgroups may form, further exacerbating the tension. The leader's authority is often questioned, and members may resist established norms and procedures. Despite the inherent challenges, the storming stage is a necessary part of team development. It provides an opportunity for members to express their concerns, clarify their roles, and establish a foundation for more effective collaboration. If managed effectively, conflict can lead to greater understanding, stronger relationships, and more robust solutions. However, if left unchecked, it can derail the team's progress and lead to dysfunction.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> 3. Norming: Building Cohesion and Establishing Shared Values</h3>
            <p>The norming stage signals a shift towards greater harmony and collaboration. As team members resolve their conflicts and establish clear roles and responsibilities, they begin to develop a sense of unity and shared purpose. Trust deepens, communication becomes more open and effective, and members begin to support each other's efforts. The team establishes norms and values that guide its behavior, creating a sense of predictability and stability.</p>
            <p className="mt-2">Decision-making processes become more streamlined, and members are more likely to reach consensus. The leader transitions from a directive role to a more facilitative one, empowering the team to take ownership of its work. The norming stage is characterized by increased cohesion, mutual respect, and a growing sense of belonging. Members begin to identify with the team and are motivated to contribute to its success. This stage is crucial for building a strong foundation for high performance, but it requires ongoing effort to maintain positive relationships and address any emerging conflicts.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> 4. Performing: Achieving Peak Performance and Collaborative Excellence</h3>
            <p>The performing stage represents the pinnacle of team development, where members function at their highest level of effectiveness. The team operates as a cohesive unit, characterized by high levels of trust, collaboration, and autonomy. Members are highly motivated and focused on achieving their goals, leveraging their individual strengths and expertise to deliver exceptional results. Communication is seamless, problem-solving is creative and efficient, and decision-making is informed and timely. The leader acts as a coach and mentor, empowering the team to self-manage and take initiative. The performing stage is marked by a sense of shared accomplishment and a deep commitment to the team's mission. Members are able to adapt to changing circumstances, overcome challenges, and consistently deliver high-quality work. This stage represents the realization of the team's potential, where individual contributions are amplified through collective effort.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CalendarIcon size={20} /> 5. Adjourning: Reflecting on Achievements and Transitioning Forward</h3>
            <p>The adjourning stage marks the conclusion of the team's journey, a period of reflection and transition. As the team completes its tasks and achieves its goals, members prepare to disband and move on to new endeavors. This stage can evoke a mix of emotions, including satisfaction, sadness, and nostalgia. Members may reflect on their experiences, celebrate their achievements, and acknowledge the bonds they have formed. The leader facilitates a review of the team's performance, identifying lessons learned and best practices. Recognition and appreciation are expressed for individual and collective contributions. While the adjourning stage signifies the end of a specific team experience, it also represents a transition to new opportunities and challenges. The knowledge and skills gained from the team experience will serve members well in their future endeavors. This stage provides closure, and helps to solidify the positive outcomes that the team has achieved.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Negotiation & Team Development</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Negotiation Techniques</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Communication</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Group Cohesiveness</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Effective Workgroups</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Development</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Negotiation & Team Dynamics. 🤝👥</p>
        </footer>

      </div>
    </div>
  );
};
