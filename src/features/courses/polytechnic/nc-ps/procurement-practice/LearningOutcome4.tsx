import React from 'react';
import {
  FolderTree, FileText, Calendar, Hash, Database, Target, TrendingUp, BarChart,
  GanttChart, Factory, Cpu, Shield, Users, Handshake, ClockIcon, GlobeIcon,
  CheckCircle, AlertTriangle, User, Building, Briefcase, LayersIcon,
  FileSignature, FilePlusIcon, FileEdit, ArrowRightCircle, RefreshCw,
  BookOpen, DollarSign, ListChecks, SearchIcon, Box, Gavel, BadgeCheck,
  ClipboardList, Truck, Warehouse, Star, Award, CreditCard, LineChart,
  PieChart, Table, Clipboard, FileCheck, UserCheck, Building2, MapPin,
  Clock, Zap, Filter, Eye, PenTool, Mail, Phone, CalendarDays, Settings,
  Wrench, HardHat, Package, ShoppingCart, ShieldCheck, Lock, Leaf,
  Heart, BriefcaseBusiness, Network, GitBranch, Link, ArrowUpDown,Receipt,MessageCircle,
  PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon,
  Table as TableIcon, Clipboard as ClipboardIcon, FileCheck as FileCheckIcon,
  FileText as FileTextIcon, FileSignature as FileSignatureIcon,
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
  FileLock as FileLockIcon7, FileEdit as FileEditIcon8
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
              Procurement <span className="text-amber-300 font-bold italic">Documents</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to procurement documents, requisitions, solicitation, contracts, delivery receipts, invoices, supplier evaluation, compliance, ITT, e-procurement, and RFQs.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">procurement_docs.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CREATE</span><span className="text-white">Requisitions;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ISSUE</span><span className="text-white">Solicitations;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MANAGE</span><span className="text-white">Contracts;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><FileText className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><ClipboardList className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: PROCUREMENT DOCUMENTS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Procurement documents</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Procurement documents are the lifeblood of the purchasing process, serving as the official record of every transaction and interaction. They ensure clarity, accountability, and legal protection throughout the acquisition cycle. Understanding the various types of procurement documents is essential for maintaining organized and compliant purchasing activities. Here's a breakdown of key procurement document types:</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FilePlusIcon size={20} /> 1. Requisition Documents</h3>
            <p>Requisition documents are the internal requests for goods or services, originating from user departments. They formally initiate the procurement process and provide essential information for purchasing. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purchase Requisitions:</strong> These forms detail the requested items or services, quantities, delivery dates, budget codes, and requesting department.</li>
              <li><strong>Approval Forms:</strong> Documents evidencing authorization for the requisition, confirming budgetary approval and necessity.</li>
              <li><strong>Statements of Work (SOW):</strong> Detailed descriptions of the services to be performed, often used for complex service contracts.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileSearch size={20} /> 2. Solicitation Documents</h3>
            <p>Solicitation documents are used to invite potential suppliers to submit bids or proposals. These documents communicate the organization's requirements and provide instructions for submitting offers. Common types include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Requests for Quotation (RFQs):</strong> Used for standard, low-value purchases, seeking price quotations from multiple suppliers.</li>
              <li><strong>Requests for Proposals (RFPs):</strong> Used for complex purchases, seeking detailed proposals that include technical specifications, pricing, and supplier qualifications.</li>
              <li><strong>Invitations to Bid (ITBs):</strong> Used for formal, competitive bidding processes, often for large-scale projects or public sector procurement.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileSignatureIcon size={20} /> 3. Contract Documents</h3>
            <p>Contract documents establish the legal agreement between the organization and the supplier, outlining the terms and conditions of the purchase. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Purchase Orders (POs):</strong> Legally binding documents that specify the goods or services to be purchased, quantities, prices, and delivery terms.</li>
              <li><strong>Contracts:</strong> Detailed agreements that outline the rights and obligations of both parties, including warranties, liabilities, and dispute resolution procedures.</li>
              <li><strong>Contract Amendments:</strong> Documents that modify the terms of an existing contract.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> 4. Delivery and Receipt Documents</h3>
            <p>Delivery and receipt documents track the movement of goods and confirm their arrival. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Delivery Receipts:</strong> Documents that confirm the delivery of goods, signed by the recipient.</li>
              <li><strong>Packing Slips:</strong> Documents that list the items included in a shipment.</li>
              <li><strong>Inspection Reports:</strong> Documents that record the inspection of delivered goods, verifying quality and compliance with specifications.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Receipt size={20} /> 5. Invoice and Payment Documents</h3>
            <p>Invoice and payment documents manage the financial aspects of the purchase, ensuring accurate and timely payments. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Invoices:</strong> Documents from suppliers, detailing the goods or services provided and the amount due.</li>
              <li><strong>Payment Vouchers:</strong> Documents that authorize payments to suppliers.</li>
              <li><strong>Payment Records:</strong> Documents that record the payments made, including dates, amounts, and payment methods.</li>
              <li><strong>Credit Notes:</strong> Documents that record refunds or credits from suppliers.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 6. Supplier Evaluation Documents</h3>
            <p>Supplier evaluation documents capture information about supplier performance, facilitating ongoing assessment and improvement. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supplier Evaluation Forms:</strong> Standardized forms used to assess supplier performance against predetermined criteria.</li>
              <li><strong>Performance Reports:</strong> Summaries of supplier performance data, highlighting key metrics and trends.</li>
              <li><strong>Audit Reports:</strong> Documents that record the findings of supplier audits, assessing compliance with quality and safety standards.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 7. Compliance and Legal Documents</h3>
            <p>Compliance and legal documents demonstrate adherence to legal and regulatory requirements, minimizing risks and ensuring ethical conduct. These include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Certifications:</strong> Documents that verify compliance with industry standards or regulations.</li>
              <li><strong>Licenses:</strong> Documents that authorize suppliers to operate in specific industries or jurisdictions.</li>
              <li><strong>Conflict of Interest Declarations:</strong> Documents that disclose any potential conflicts of interest.</li>
            </ul>
            <p className="mt-2">Maintaining these documents meticulously ensures a transparent and compliant procurement process.</p>
          </div>
        </section>

        {/* ========== SECTION 2: COMPREHENSIVE CONTENT FOR CLARITY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Comprehensive Content for Clarity and Legal Soundness</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Purchasing documents are designed to be comprehensive and unambiguous, minimizing the potential for misunderstandings and disputes. The level of detail included in each document is crucial for ensuring that all parties involved have a clear understanding of their rights and obligations.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FilePlusIcon size={20} /> 1. Requisition Documents</h3>
            <p>Requisition documents must be meticulously detailed to ensure that the purchasing department accurately understands the user department's needs. The item/service description should go beyond a simple name, providing specific details such as model numbers, technical specifications, and required functionalities. The justification/purpose section is equally important, especially for high-value or unusual purchases. A well-articulated justification helps to demonstrate the necessity of the purchase and ensures that it aligns with the organization's strategic goals. Approval forms must clearly identify the authorizing personnel and include their signatures or electronic approvals, ensuring that the purchase has been properly vetted and authorized. This process is the first step in creating a verifiable audit trail.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileSearch size={20} /> 2. Solicitation Documents</h3>
            <p>Solicitation documents are designed to attract qualified suppliers and ensure a fair and transparent bidding process. The specifications/scope of work must be detailed and unambiguous, leaving no room for misinterpretation. Evaluation criteria should be clearly defined and weighted, allowing suppliers to understand how their offers will be assessed. The submission deadline must be strictly enforced, ensuring that all suppliers have an equal opportunity to submit their offers. Terms and conditions should include all relevant legal and contractual provisions, such as confidentiality agreements, intellectual property rights, and dispute resolution mechanisms. These documents prevent ambiguity, and ensure that all vendors are treated fairly.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileSignatureIcon size={20} /> 3. Contract Documents</h3>
            <p>Contract documents are the cornerstone of the purchasing process, establishing the legal framework for the transaction. The scope of work/deliverables must be clearly defined, specifying the exact goods or services to be provided and the expected outcomes. Pricing/payment terms should be clearly stated, including any discounts, payment schedules, and currency exchange rates. Warranties/guarantees should outline the supplier's obligations regarding product or service quality and performance. Liabilities/indemnification clauses should specify the responsibilities of each party in case of breaches or damages. Termination clauses should provide clear guidelines for ending the contract, including reasons for termination and notice periods. Governing law specifies which jurisdiction's laws will apply in case of disputes. These elements are vital for protecting the organization's interests and ensuring a legally sound transaction.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> 4. Delivery and Receipt Documents</h3>
            <p>Delivery and receipt documents are essential for verifying that goods or services have been delivered as ordered. The item description/quantity should be carefully checked against the purchase order to ensure accuracy. Condition of goods notes should document any damage or discrepancies, providing evidence for potential claims. Recipient signature confirms that the goods have been received and accepted. These documents are crucial for inventory management and dispute resolution.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Receipt size={20} /> 5. Invoice and Payment Documents</h3>
            <p>Invoice and payment documents are critical for maintaining financial transparency and accuracy. Item description/quantity/price details should match the purchase order and delivery receipt. Total amount due should be clearly stated, including any applicable taxes or fees. Payment terms should specify the payment schedule and method, ensuring timely and accurate payments. Payment authorization ensures that payments are made only after proper verification and approval. These documents are vital for financial reporting and auditing.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 6. Supplier Evaluation Documents</h3>
            <p>Supplier evaluation documents are used to assess supplier performance and identify areas for improvement. Evaluation criteria should be aligned with the organization's strategic goals and operational requirements. Ratings/scores provide a quantifiable measure of supplier performance. Comments/observations offer qualitative feedback, providing context and insights into supplier capabilities. Recommendations suggest specific actions for improvement, fostering a culture of continuous improvement. These documents are crucial for building strong supplier relationships and optimizing the supply chain.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 7. Compliance and Legal Documents: Minimizing Risks and Ensuring Ethical Conduct</h3>
            <p>Compliance and legal documents are essential for minimizing risks and ensuring ethical conduct. Certifications/licenses demonstrate adherence to industry standards and regulations. Conflict of interest declarations ensure transparency and prevent unethical practices. Compliance statements affirm adherence to relevant laws and regulations. These documents are vital for protecting the organization's reputation and ensuring compliance with legal and ethical standards.</p>
          </div>
        </section>

        {/* ========== SECTION 3: PUBLISHING PROCUREMENT REQUIREMENTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Publishing Procurement Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Publishing procurement requirements in appropriate media is a critical step in ensuring transparency, fairness, and competition within the procurement process. The chosen media must effectively reach potential suppliers, providing them with clear and comprehensive information about the organization's needs. Among the various methods used, the Invitation to Tender (ITT) stands as a formal and structured approach, playing a pivotal role in disseminating procurement requirements for complex or high-value projects.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon4 size={20} /> Invitation to Tender (ITT)</h3>
            <p>The Invitation to Tender (ITT) is a formal document issued by an organization to solicit bids from potential suppliers for a specific project or contract. It serves as a comprehensive communication tool, outlining the organization's requirements, specifications, and evaluation criteria. Unlike less formal requests for quotations, ITTs are typically used for complex or high-value projects where detailed proposals are required. The ITT process ensures a fair and transparent bidding process, allowing all qualified suppliers to compete on an equal footing. Its structured format and detailed content are essential for ensuring that suppliers have a clear understanding of the organization's needs and can submit accurate and competitive bids.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon4 size={20} /> Disseminating Comprehensive Project Information Through the ITT</h3>
            <p>The ITT serves as a primary vehicle for disseminating comprehensive project information to potential suppliers. It typically includes detailed specifications of the goods or services required, project timelines, contractual terms, and evaluation criteria. By providing this level of detail, organizations ensure that suppliers have all the necessary information to prepare accurate and competitive bids. The ITT also outlines the submission requirements, including the format, content, and deadline for bid submissions. This ensures that all bids are presented in a consistent manner, facilitating efficient evaluation. Furthermore, the ITT may include site visit schedules, pre-bid conferences, and contact information for inquiries, providing suppliers with opportunities to clarify any questions or concerns. The level of detail included within the ITT is crucial for reducing ambiguity and ensuring that all potential suppliers have the same information.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Ensuring Fairness and Transparency in the Bidding Process</h3>
            <p>The ITT process is designed to ensure fairness and transparency in the bidding process. By publishing the ITT in appropriate media, organizations can reach a wide range of potential suppliers, ensuring that all qualified bidders have an opportunity to participate. The ITT also outlines the evaluation criteria and scoring system, ensuring that bids are evaluated objectively and consistently. This transparency builds trust and confidence in the procurement process, encouraging suppliers to submit their best offers. Additionally, the ITT may include provisions for bid clarifications and negotiations, ensuring that all suppliers are treated fairly and that the final contract reflects the best value for the organization. The formal nature of the ITT process helps to prevent favoritism and ensures that the selection process is based on merit.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Reaching a Wide Range of Potential Suppliers Through Appropriate Media</h3>
            <p>Publishing the ITT in appropriate media is crucial for reaching a wide range of potential suppliers. The chosen media should be relevant to the industry and accessible to the target audience. This may include industry publications, online procurement portals, government websites, and direct mailings. By using a combination of media, organizations can ensure that the ITT reaches a diverse pool of suppliers, maximizing competition and ensuring that the best possible offers are received. Furthermore, the timing of the publication should be carefully considered to allow suppliers sufficient time to prepare their bids. The media selection and timing are critical for ensuring that the ITT reaches the intended audience. The media that is chosen, should reflect the industry that the tender is being issued for.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircle size={20} /> Facilitating Effective Communication and Collaboration</h3>
            <p>The ITT process facilitates effective communication and collaboration between the organization and potential suppliers. The pre-bid conferences and site visits provide opportunities for suppliers to ask questions and clarify requirements. The contact information provided in the ITT allows suppliers to seek further information or clarification throughout the bidding process. By fostering open communication, organizations can ensure that suppliers have a clear understanding of their needs and can submit accurate and competitive bids. This communication also helps to build relationships with potential suppliers, which can be valuable for future procurement activities. The ITT process therefore is not only a method of formal communication, but also a method of creating a dialogue.</p>
          </div>
        </section>

        {/* ========== SECTION 4: ELECTRONIC PROCUREMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electronic Procurement (E-Procurement)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Electronic procurement, or e-procurement, has significantly transformed the way Requests for Quotations (RFQs) are managed, streamlining the process and enhancing efficiency.</p>
            <p className="mt-2">In the context of RFQs, e-procurement leverages digital platforms and technologies to automate and optimize the solicitation of price quotations from suppliers. This transition from traditional paper-based methods to electronic systems has brought numerous advantages, including increased transparency, reduced costs, and faster turnaround times.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Automating the RFQ Process for Enhanced Efficiency</h3>
            <p>Electronic procurement platforms enable organizations to automate the entire RFQ process, from creating and distributing RFQs to receiving and evaluating quotations. This automation eliminates the need for manual data entry, paper-based document management, and time-consuming communication via phone or fax. E-procurement systems allow organizations to create standardized RFQ templates, ensuring consistency and accuracy in the information provided to suppliers. These templates can be customized to include specific requirements, specifications, and evaluation criteria, making it easier for suppliers to understand the organization's needs. Furthermore, electronic platforms facilitate the distribution of RFQs to a wide range of potential suppliers with just a few clicks, significantly reducing the time and effort required to reach out to vendors. Automated notifications and reminders ensure that suppliers are aware of deadlines and submission requirements, minimizing the risk of missed opportunities.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Increasing Transparency and Accessibility for Suppliers</h3>
            <p>E-procurement enhances transparency and accessibility for suppliers by providing them with real-time access to RFQ information. Suppliers can view RFQs, download documents, and submit quotations electronically, eliminating the need for physical submissions. This increased accessibility allows suppliers to respond to RFQs more quickly and efficiently, expanding the pool of potential bidders and fostering greater competition. Electronic platforms also provide suppliers with a clear audit trail of all interactions, ensuring that the bidding process is fair and transparent. Suppliers can track the status of their submissions, receive notifications of any changes or updates, and view the results of the evaluation process. This transparency builds trust and confidence in the procurement process, encouraging suppliers to participate and submit their best offers.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Reducing Costs and Shortening Cycle Times</h3>
            <p>Electronic procurement significantly reduces the costs associated with traditional RFQ processes. By eliminating the need for paper, printing, postage, and manual data entry, organizations can save time and money. E-procurement platforms also streamline the evaluation process, automating the comparison of quotations and generating reports that highlight the best value options. This automation reduces the time and effort required for evaluation, shortening the overall cycle time and enabling organizations to make quicker purchasing decisions. Furthermore, e-procurement facilitates the use of electronic signatures and digital document management, eliminating the need for physical signatures and storage of paper documents. This reduces administrative overhead and further streamlines the procurement process.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Enhancing Data Analysis and Reporting Capabilities</h3>
            <p>E-procurement platforms provide powerful data analysis and reporting capabilities, enabling organizations to gain valuable insights into their RFQ processes. These systems can track key performance indicators (KPIs), such as the number of RFQs issued, the number of quotations received, and the average response time. This data can be used to identify trends, patterns, and areas for improvement. Furthermore, e-procurement platforms can generate reports that summarize quotation data, highlighting the best value options and providing a basis for informed decision-making. These reporting capabilities enable organizations to optimize their RFQ processes, identify cost-saving opportunities, and improve their overall procurement performance. The collected data can also be used to improve future RFQ processes.</p>
          </div>
        </section>

        {/* ========== SECTION 5: INDUSTRY CUSTOMS AND LEGISLATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Industry Customs and Legislation Influence Requests for Quotations (RFQs) in Electronic Procurement</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>When considering Requests for Quotations (RFQs) within electronic procurement, it's essential to understand how industry customs and policies and legislation influence the process. These factors shape the way RFQs are created, distributed, and evaluated, ensuring that they align with accepted practices and legal requirements.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Industry Customs</h3>
            <p>Industry customs refer to the established practices and norms that are commonly followed within a particular sector. These customs can significantly influence the way RFQs are conducted, particularly in terms of communication, negotiation, and evaluation. For example, in some industries, it's customary to have pre-bid meetings or site visits to allow suppliers to clarify requirements and assess project conditions. In others, it's standard practice to negotiate pricing and terms after receiving initial quotations. Electronic procurement platforms can be configured to accommodate these industry-specific customs, ensuring that the RFQ process aligns with accepted practices. For instance, e-procurement systems can facilitate online pre-bid conferences, allow for electronic submission of questions and clarifications, and provide tools for online negotiation. Understanding industry customs is vital for organizations to build trust and credibility with suppliers, ensuring that the RFQ process is perceived as fair and transparent. Moreover, industry customs can dictate the level of detail expected in an RFQ. Some industries may require highly technical specifications, while others may focus on functional performance. E-procurement systems can be tailored to accommodate these variations, ensuring that RFQs are tailored to the specific needs of the industry. The timeframes offered for responses also vary based on industry. For example, a construction related RFQ may require longer response times than an RFQ for office supplies.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> Policies and Legislation</h3>
            <p>Policies and legislation play a crucial role in regulating the RFQ process, ensuring compliance with legal requirements and ethical standards. Organizations must adhere to relevant laws and regulations, such as anti-corruption laws, competition laws, and data privacy regulations. E-procurement platforms can help organizations comply with these requirements by providing features such as audit trails, access controls, and data encryption. For instance, audit trails can track all RFQ activities, providing evidence of compliance with procurement policies and regulations. Access controls can restrict access to sensitive information, ensuring that only authorized personnel can view and modify RFQs. Data encryption can protect confidential information from unauthorized access, safeguarding sensitive data. Internal procurement policies also play a significant role in shaping the RFQ process. These policies may outline requirements for supplier diversity, sustainability, and ethical sourcing. E-procurement systems can be configured to support these policies, allowing organizations to track and report on their compliance. For example, e-procurement platforms can track supplier diversity metrics, generate reports on sustainable sourcing practices, and enforce ethical guidelines. Legislation also dictates the requirements for public sector RFQs, which often have more stringent requirements than private sector RFQs. Public sector organizations must comply with public procurement laws, which typically emphasize transparency, fairness, and competition. E-procurement systems can help public sector organizations meet these requirements by providing features such as electronic bid submission, online bid opening, and public access to RFQ information.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Procurement Documents</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Requisitions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Solicitations</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contracts</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Delivery & Receipt</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Invoices</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">E-Procurement</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Procurement Documents. 📋📄</p>
        </footer>

      </div>
    </div>
  );
};
