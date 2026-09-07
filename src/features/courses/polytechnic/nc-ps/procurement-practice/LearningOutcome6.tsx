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
  FileLock as FileLockIcon12
} from 'lucide-react';

export const LearningOutcome6: React.FC = () => {
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO6
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Contract <span className="text-cyan-300 font-bold italic">Terms</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to contract terms, conditions, Battle of the Forms, seller and buyer obligations, contract formation, and dispute resolution.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">contract_terms.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">NEGOTIATE</span><span className="text-white">Terms;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">CONDITIONS</span><span className="text-white">Precedent;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">OBLIGATIONS</span><span className="text-white">Define;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Gavel className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Handshake className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: CONTRACT TERMS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Contract Terms</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Negotiating the terms of a contract is a pivotal stage in the procurement process, as it solidifies the agreement between the buyer and the supplier, outlining the rights and obligations of each party. These terms and conditions serve as the legal framework for the transaction, ensuring clarity, mitigating risks, and fostering a mutually beneficial relationship. Here's a detailed explanation of the key aspects of negotiating terms of contract:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TargetIcon size={20} /> Understanding the Importance of Contract Terms</h3>
            <p>Contract terms are the foundation of a legally binding agreement. They define the scope of work, payment schedules, delivery timelines, quality standards, and other critical aspects of the transaction. Carefully negotiating these terms is essential for protecting the organization's interests, preventing disputes, and ensuring that the supplier delivers on its commitments.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> Key Elements of Contract Terms</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Scope of Work/Deliverables:</strong> This section clearly defines the goods or services to be provided by the supplier, including detailed specifications, quantities, and performance requirements. It's crucial to be precise and unambiguous to avoid misunderstandings and ensure that the supplier delivers exactly what is needed.</li>
              <li><strong>Pricing and Payment Terms:</strong> This section outlines the agreed-upon prices, payment schedules, and any applicable discounts or penalties. It should also specify the currency, payment methods, and any conditions for price adjustments. Negotiating favorable payment terms, such as extended payment periods or milestone-based payments, can improve cash flow.</li>
              <li><strong>Delivery and Performance:</strong> This section specifies the delivery timelines, performance standards, and any penalties for late or non-performance. It should also address issues such as shipping, packaging, and inspection. Clearly defined delivery and performance terms are essential for ensuring timely and satisfactory completion of the contract.</li>
              <li><strong>Quality and Acceptance:</strong> This section outlines the quality standards that the supplier must meet, as well as the procedures for inspection and acceptance. It should also address issues such as warranties, guarantees, and defect resolution. Establishing clear quality standards and acceptance criteria is essential for ensuring that the goods or services meet the organization's requirements.</li>
              <li><strong>Warranties and Liabilities:</strong> This section specifies the warranties and guarantees provided by the supplier, as well as the liabilities of each party in case of breaches or damages. It's crucial to negotiate strong warranties and clear liability clauses to protect the organization from potential losses.</li>
              <li><strong>Termination Clauses:</strong> This section outlines the conditions under which the contract can be terminated, as well as the procedures for termination. It should address issues such as termination for convenience, termination for cause, and notice periods. Clear termination clauses are essential for providing flexibility and protecting the organization's interests.</li>
              <li><strong>Intellectual Property:</strong> If applicable, this section addresses the ownership and use of intellectual property rights, such as patents, copyrights, and trademarks. It's crucial to clearly define the rights and obligations of each party to protect sensitive information and prevent disputes.</li>
              <li><strong>Confidentiality:</strong> This section outlines the obligations of each party to maintain the confidentiality of sensitive information. It's essential to include strong confidentiality clauses to protect trade secrets and other proprietary information.</li>
              <li><strong>Dispute Resolution:</strong> This section specifies the procedures for resolving disputes, such as mediation, arbitration, or litigation. It's crucial to include clear dispute resolution clauses to minimize the risk of costly and time-consuming legal battles.</li>
              <li><strong>Governing Law:</strong> This section states which jurisdiction's laws will govern the contract.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> Negotiation Strategies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Preparation:</strong> Thoroughly research the supplier and the market to understand the supplier's capabilities and pricing. Develop a clear understanding of the organization's needs and priorities. Identify potential areas of negotiation and develop alternative solutions.</li>
              <li><strong>Communication:</strong> Maintain open and honest communication with the supplier throughout the negotiation process. Clearly articulate the organization's needs and expectations. Actively listen to the supplier's concerns and suggestions.</li>
              <li><strong>Flexibility:</strong> Be prepared to compromise and find mutually agreeable solutions. Focus on building a long-term relationship with the supplier.</li>
              <li><strong>Documentation:</strong> Document all agreements and changes to the contract in writing. Ensure that all parties have a clear understanding of the final terms.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: CONDITIONS WITHIN A CONTRACT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Conditions within a contract form</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Conditions within a contract form the bedrock of the agreement, delineating the rights and obligations of each party and establishing the framework for a successful transaction. These conditions, meticulously negotiated and clearly articulated, serve to mitigate risks, ensure clarity, and foster a mutually beneficial relationship. Within the intricate web of contractual agreements, specific conditions play pivotal roles, each addressing distinct aspects of the transaction.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><TargetIcon size={20} /> Conditions Precedent</h3>
            <p>Conditions precedent are stipulations that must be fulfilled before a party's contractual obligations become binding. Essentially, they act as triggers, ensuring that certain events or actions occur before the contract takes full effect. These conditions safeguard parties from being bound by obligations prematurely or under unfavorable circumstances. For instance, a contract for the purchase of land might include a condition precedent that the buyer obtains necessary zoning approvals. Similarly, a contract for the delivery of goods might stipulate that the buyer must secure a letter of credit before the supplier is obligated to ship the goods. Conditions precedent provide a structured approach to managing contingencies and ensuring that all parties are prepared to fulfill their responsibilities. They are vital for mitigating risk, by preventing a party from being forced to perform when a key event has not occurred.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCwIcon size={20} /> Conditions Subsequent</h3>
            <p>Conditions subsequent are stipulations that, if triggered, terminate or modify a party's existing contractual obligations. Unlike conditions precedent, which must be fulfilled before obligations arise, conditions subsequent bring obligations to an end. These conditions often relate to events outside the control of the parties, such as changes in legislation, market fluctuations, or force majeure events. For example, a long-term supply contract might include a condition subsequent that allows either party to terminate the agreement if there is a significant change in raw material prices. Likewise, a contract for the provision of services might include a condition subsequent that terminates the agreement if the client's funding is discontinued. Conditions subsequent provide flexibility and adaptability, allowing parties to respond to unforeseen circumstances and avoid being bound by obligations that are no longer feasible or desirable.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> Express Conditions</h3>
            <p>Express conditions are terms that are explicitly stated in the contract, leaving no room for ambiguity or interpretation. They are clearly defined and articulated, ensuring that all parties have a shared understanding of their rights and obligations. Express conditions can relate to a wide range of aspects, such as payment schedules, delivery timelines, quality standards, and performance requirements. For example, a contract might expressly state that payment is due within 30 days of invoice receipt or that goods must meet specific technical specifications. Express conditions provide certainty and clarity, minimizing the risk of disputes and ensuring that the contract is enforceable. They remove any guessing, and allow for a clear understanding of the agreement.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Implied Conditions: Unspoken Understandings and Legal Expectations</h3>
            <p>Implied conditions, in contrast to express conditions, are not explicitly stated in the contract but are inferred from the nature of the agreement, industry customs, or legal principles. They represent unspoken understandings and reasonable expectations that parties are presumed to have when entering into a contract. For example, in a contract for the sale of goods, there is an implied condition that the goods will be of merchantable quality and fit for their intended purpose. Likewise, in a contract for the provision of professional services, there is an implied condition that the service provider will exercise reasonable care and skill. Implied conditions provide a safety net, ensuring that contracts are interpreted in a fair and reasonable manner. However, they can also be a source of ambiguity and dispute, highlighting the importance of clearly articulating all essential terms in the contract.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangleIcon size={20} /> Material Breach of Contract</h3>
            <p>A material breach of contract occurs when one party fails to perform a fundamental obligation under the contract, significantly impacting the other party's rights and remedies. Material breaches are serious violations that justify termination of the contract and entitle the non-breaching party to seek damages. Determining whether a breach is material depends on the specific circumstances of the contract and the nature of the obligation that was violated. For example, a failure to deliver goods on time might be considered a material breach if timely delivery was essential to the contract's purpose. Likewise, a failure to meet quality standards might be considered a material breach if it renders the goods unusable. Material breaches provide a clear basis for terminating contracts and seeking redress, ensuring that parties are protected from significant violations of their rights.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> Force Majeure Conditions</h3>
            <p>Force majeure conditions are provisions that excuse a party from performing its contractual obligations due to unforeseen events beyond its control. These events, such as natural disasters, wars, or government regulations, are typically outside the reasonable control of the parties and render performance impossible or impracticable. Force majeure conditions provide a mechanism for managing risks associated with unforeseen events, ensuring that parties are not held liable for failures that are beyond their control. For example, a contract might include a force majeure clause that excuses a supplier from delivering goods if a hurricane disrupts transportation. Force majeure conditions provide flexibility and fairness, allowing parties to respond to unforeseen circumstances without incurring penalties.</p>
          </div>
        </section>

        {/* ========== SECTION 3: BATTLE OF THE FORMS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>"Battle of the Forms"</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The "Battle of the Forms" is a classic legal scenario arising in contract law, particularly within commercial transactions, where parties exchange standardized forms with conflicting terms and conditions. This scenario frequently occurs in procurement when a buyer sends a purchase order with its terms, and the seller responds with an acknowledgment or invoice containing its own set of terms. The crux of the issue lies in determining which party's terms govern the contract, or if a contract even exists at all.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileTextIcon size={20} /> The Clash of Standardized Agreements</h3>
            <p>In the modern business landscape, standardized forms are ubiquitous, streamlining transactions and reducing administrative burdens. However, this convenience can lead to a clash when parties exchange forms with conflicting terms. The "Battle of the Forms" arises from this conflict, where each party attempts to impose its own terms and conditions on the other. This scenario often unfolds when a buyer issues a purchase order with its standard terms, and the seller responds with an acknowledgment or invoice containing its own set of terms, which may differ significantly from the buyer's. This exchange creates a legal puzzle, as it becomes unclear which party's terms, if any, govern the contract.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ScaleIcon size={20} /> The "Mirror Image" Rule and its Limitations</h3>
            <p>Traditionally, contract law adhered to the "mirror image" rule, which required that acceptance of an offer must exactly mirror the terms of the offer for a contract to be formed. Any variation in the acceptance constituted a counteroffer, which the original offeror could either accept or reject. Under this rule, the "last shot" principle often prevailed, meaning that the party who sent the last form before performance began would have its terms govern the contract. However, the "mirror image" rule proved to be impractical in modern commercial transactions, where parties often exchange standardized forms without carefully reviewing each other's terms. This led to uncertainty and disputes, prompting legal reforms to address the "Battle of the Forms."</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BookOpenIcon size={20} /> The Uniform Commercial Code (UCC) and its Modern Approach</h3>
            <p>In the United States, the Uniform Commercial Code (UCC), specifically Section 2-207, provides a more pragmatic approach to the "Battle of the Forms." The UCC rejects the strict "mirror image" rule and focuses on the parties' intent to form a contract. Under the UCC, a definite and seasonable expression of acceptance or a written confirmation operates as an acceptance even though it states terms additional to or different from those offered or agreed upon, unless acceptance is expressly made conditional on assent to the additional or different terms. This provision introduces a "knockout rule," where conflicting terms are knocked out, and gap-filling provisions of the UCC are used to supplement the contract. This approach reflects the reality of modern commercial transactions, where parties often proceed with performance without resolving all discrepancies in their forms.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileCheckIcon size={20} /> Additional or Different Terms</h3>
            <p>Under the UCC, additional terms are treated differently from different terms. Additional terms are treated as proposals for addition to the contract, and they become part of the contract unless: the offer expressly limits acceptance to the terms of the offer; they materially alter it; or notification of objection to them has already been given or is given within a reasonable time after notice of them is received. Different terms, on the other hand, are treated under the "knockout rule," where they are knocked out, and gap-filling provisions of the UCC are used to supplement the contract. This distinction highlights the importance of carefully reviewing the other party's forms to identify any additional or different terms that might impact the contract.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ShieldIcon size={20} /> Expressly Conditional Acceptance: Avoiding the "Knockout Rule"</h3>
            <p>Parties can avoid the "knockout rule" by expressly making their acceptance conditional on assent to their additional or different terms. This requires clear and unambiguous language, such as stating that "acceptance is expressly made conditional on assent to the terms and conditions stated in this form." By using this language, parties can ensure that their terms govern the contract, unless the other party expressly agrees to them. However, this approach can also lead to a stalemate if neither party is willing to accept the other's terms.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecksIcon size={20} /> Practical Implications and Best Practices: Navigating the Minefield</h3>
            <p>The "Battle of the Forms" presents practical challenges for businesses, requiring careful attention to detail and proactive measures to mitigate risks. Here are some best practices for navigating this legal minefield:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Review and Compare Forms:</strong> Carefully review and compare the terms and conditions of all forms exchanged with the other party.</li>
              <li><strong>Identify Conflicting Terms:</strong> Identify any conflicting terms and assess their potential impact on the contract.</li>
              <li><strong>Negotiate and Resolve Discrepancies:</strong> Attempt to negotiate and resolve any discrepancies in the terms before proceeding with performance.</li>
              <li><strong>Use Clear and Unambiguous Language:</strong> Use clear and unambiguous language in all forms to avoid misinterpretations.</li>
              <li><strong>Document All Communications:</strong> Document all communications and agreements related to the contract.</li>
              <li><strong>Seek Legal Counsel:</strong> Seek legal counsel to review and advise on contract terms, particularly for complex or high-value transactions.</li>
              <li><strong>Establish Master Service Agreements (MSA):</strong> For long term supplier relationships, establish a MSA that clearly outlines the terms and conditions that will govern all future transactions. This prevents the battle of the forms from occurring with each individual purchase.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: RESPONSIBILITIES OF SELLER AND BUYER ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Responsibilities Of Both The Seller (Supplier) And The Buyer (Purchaser)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Establishing the rights and obligations of parties in a procurement contract is fundamental to ensuring a clear, predictable, and mutually beneficial transaction. These obligations define the responsibilities of both the seller (supplier) and the buyer (purchaser), creating a framework for successful performance and dispute resolution.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Truck size={20} /> Obligations of a Seller (Supplier): Fulfilling Commitments and Delivering Value</h3>
            <p>The seller's obligations in a procurement contract are centered around delivering the agreed-upon goods or services in accordance with the specified terms. These obligations are crucial for ensuring that the buyer receives what they bargained for and that the transaction proceeds smoothly.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Delivery of Goods or Services:</strong> The seller is obligated to deliver the goods or perform the services as described in the contract, adhering to agreed-upon specifications, quantities, and timelines. This includes ensuring that the goods are of the required quality and free from defects. For services, it involves performing the work with reasonable skill and care, meeting agreed-upon performance standards.</li>
              <li><strong>Compliance with Specifications and Standards:</strong> The seller must ensure that the goods or services comply with all applicable specifications, standards, and regulations. This may involve providing certifications or test results to demonstrate compliance. This is especially important in regulated industries or for products with specific safety or performance requirements.</li>
              <li><strong>Provision of Warranties and Guarantees:</strong> The seller is often obligated to provide warranties or guarantees that the goods or services will be free from defects and perform as expected. These warranties may cover specific periods or aspects of the goods or services. They provide the buyer with recourse in case of defects or non-performance.</li>
              <li><strong>Adherence to Delivery Schedules:</strong> The seller must adhere to the agreed-upon delivery schedules, ensuring that the goods or services are delivered on time. This is particularly important for time-sensitive projects or when delays can disrupt the buyer's operations. Late delivery can result in penalties or termination of the contract.</li>
              <li><strong>Provision of Documentation and Information:</strong> The seller is obligated to provide all necessary documentation and information related to the goods or services, such as manuals, instructions, and technical specifications. This ensures that the buyer can properly use and maintain the goods or services.</li>
              <li><strong>Maintenance of Confidentiality:</strong> If applicable, the seller is obligated to maintain the confidentiality of any sensitive information shared by the buyer.</li>
              <li><strong>Compliance with Laws and Regulations:</strong> The seller must comply with all applicable laws and regulations related to the manufacture, sale, and delivery of the goods or services.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSignIcon size={20} /> Obligations of a Buyer (Purchaser)</h3>
            <p>The buyer's obligations in a procurement contract are primarily focused on fulfilling their financial commitments and facilitating the seller's performance. These obligations are essential for maintaining a fair and equitable relationship and ensuring that the transaction is completed successfully.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Payment for Goods or Services:</strong> The buyer is obligated to pay the agreed-upon price for the goods or services, according to the specified payment schedule. This includes ensuring timely payments and adhering to the agreed-upon payment methods. Late payments can result in penalties or interest charges.</li>
              <li><strong>Acceptance of Goods or Services:</strong> The buyer is obligated to accept the goods or services if they conform to the contract requirements. This may involve conducting inspections or tests to verify compliance. The buyer should provide timely notification of acceptance or rejection.</li>
              <li><strong>Provision of Necessary Information and Access:</strong> The buyer is obligated to provide the seller with all necessary information and access to facilities or personnel required for the performance of the contract. This may include providing specifications, drawings, or access to the buyer's premises.</li>
              <li><strong>Maintenance of Confidentiality:</strong> If applicable, the buyer is obligated to maintain the confidentiality of any sensitive information shared by the seller.</li>
              <li><strong>Adherence to Contractual Terms:</strong> The buyer must adhere to all other contractual terms, such as delivery schedules, inspection procedures, and dispute resolution mechanisms.</li>
              <li><strong>Acting in Good Faith:</strong> The buyer is expected to act in good faith and cooperate with the seller to ensure the successful completion of the contract.</li>
              <li><strong>Notification of Issues:</strong> The buyer should give prompt notification of any issues that may prevent the seller from completing their obligations.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: CONTRACT FORMATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Contract Formation</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Specifying contract duration according to agreed parameters is a critical component of any procurement contract. It establishes the timeline for the agreement, ensuring that both parties understand the period during which their obligations and rights are in effect. The duration must align with the nature of the goods or services, the project timeline, and the organization's strategic needs. Here's a breakdown of how contract duration is determined and the related considerations:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileSignatureIcon size={20} /> Contract Formation</h3>
            <p>The formation of a contract is the initial step where the parties agree on the essential terms, including the duration. This process involves offer, acceptance, and consideration. The duration is typically negotiated and agreed upon during this stage, reflecting the parties' mutual understanding of the project's timeline and the nature of the relationship.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Negotiation:</strong> During negotiations, parties discuss and agree on the start and end dates of the contract, as well as any potential extensions or renewals. Factors influencing duration include the project scope, complexity, and expected lifespan of the goods or services.</li>
              <li><strong>Documentation:</strong> The agreed-upon duration is clearly documented in the contract, including specific dates or a defined period. This documentation is crucial for avoiding disputes and ensuring clarity.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BriefcaseIcon size={20} /> Procurement Contracts</h3>
            <p>Procurement contracts, which involve the acquisition of goods or services, require careful consideration of duration. The duration should align with the specific needs of the procurement, ensuring that the goods or services are available for the required period.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Short-Term Contracts:</strong> These contracts are used for one-time purchases or short-term projects. They are suitable for acquiring readily available goods or services with predictable demand.</li>
              <li><strong>Long-Term Contracts:</strong> These contracts are used for ongoing needs, such as recurring supplies or long-term services. They provide stability and predictability, allowing for long-term planning and cost control. These often include renewal clauses.</li>
              <li><strong>Project-Based Contracts:</strong> These contracts are tied to the duration of a specific project, with the contract ending upon project completion. They are suitable for construction, development, or other project-based activities.</li>
              <li><strong>Renewable Contracts:</strong> These contracts include clauses that allow for the contract to be extended after the initial term. This allows for flexibility, and the ability to continue a good working relationship.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><GavelIcon size={20} /> Litigation</h3>
            <p>Disputes regarding contract duration can arise due to ambiguities, breaches, or unforeseen circumstances. Litigation may be necessary to resolve these disputes and enforce the agreed-upon duration.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Breach of Contract:</strong> If one party fails to adhere to the agreed-upon duration, the other party may seek legal remedies for breach of contract. This may involve seeking damages for losses incurred due to the breach.</li>
              <li><strong>Interpretation of Contract Terms:</strong> Disputes may arise regarding the interpretation of contract terms related to duration. Courts may be required to interpret the contract and determine the parties' intentions.</li>
              <li><strong>Enforcement of Contractual Obligations:</strong> Litigation may be necessary to enforce contractual obligations related to duration, such as requiring a party to continue providing services for the agreed-upon period.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HandshakeIcon size={20} /> Arbitration</h3>
            <p>Arbitration is an alternative dispute resolution method that can be used to resolve disputes regarding contract duration. It involves submitting the dispute to a neutral third party (arbitrator) for a binding decision.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Advantages of Arbitration:</strong> Arbitration can be faster and less expensive than litigation. It can provide a more private and confidential dispute resolution process. Arbitrators may have specialized expertise in the relevant industry or subject matter.</li>
              <li><strong>Arbitration Clauses:</strong> Contracts often include arbitration clauses that specify the procedures for arbitration. These clauses may specify the location of arbitration, the rules to be applied, and the selection of arbitrators.</li>
              <li><strong>Enforcement of Arbitral Awards:</strong> Arbitral awards are typically enforceable in courts, providing a binding resolution to the dispute.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 6 — Contract Terms</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contract Terms</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Conditions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Battle of Forms</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Obligations</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Formation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dispute Resolution</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Contract Terms. ⚖️📄</p>
        </footer>

      </div>
    </div>
  );
};
