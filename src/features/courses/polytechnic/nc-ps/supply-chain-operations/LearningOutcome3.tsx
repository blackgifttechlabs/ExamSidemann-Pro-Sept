import React from 'react';
import {
  FolderTree,
  Target,
  TrendingUp,
  Shield,
  Users,
  Handshake,
  FileText,
  DollarSign,
  Package,
  Truck,
  Warehouse,
  Search,
  Star,
  Award,
  Clipboard,
  FileCheck,
  Receipt,
  ShoppingCart,
  CreditCard,
  Clock,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  ListChecks,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ArrowRightCircle,
  Gavel,
  GitBranch,
  Layers,
  Zap,
  Eye,
  BookOpen,
  CircleCheck,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileSpreadsheet,
  FileClock,
  FileX,
  FileBadge,
  FileKey,
  FileLock,
  Box,
  Factory,
  Globe,
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  User,
  UserCheck,
  PenTool,
  Link,
  Scale,
  Coins,
  Landmark,
  PiggyBank,
  BriefcaseBusiness,
  Ship,
  Plane,
  Train,
  Car,
  Bus,
  Bike,
  Footprints,
  BarChart4,
  ChartLine,
  Activity,
  Rocket,
  Anchor,
  GlobeIcon,
  HardHat,
  Leaf,
  Recycle,
  Trash2,
  Heart,
  Timer,
  TruckIcon,
  PackageOpen,
  Boxes,
  Printer,
  QrCode,
  BadgeCheck,
  Check,
  X,
  Minus,
  Plus,
  Divide,Send,
  Equal,
  Percent,
  CircleDollarSign,
  HandCoins,
  FileSignature,
  ClipboardList,
  CalendarDays,
  Wrench,
  HardDrive,
  Server,
  Database,
  Network,
  Cpu,
  Cloud
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
              Sourcing & <span className="text-purple-300 font-bold italic">Procurement</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to sourcing, make-or-buy decisions, supplier selection, procurement cycle, documents, records, quality management, and negotiation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">sourcing.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">SOURCE</span><span className="text-white">Suppliers;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">CYCLE</span><span className="text-white">Procurement;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MANAGE</span><span className="text-white">Quality;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Handshake className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Package className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: ROLE OF SOURCING IN SUPPLY CHAINS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Sourcing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Role of Sourcing in Supply Chains</h3>
            <p>Sourcing is the strategic process of acquiring goods and services from external suppliers, playing a pivotal role in the efficiency and effectiveness of modern supply chains. It involves more than just purchasing; it is about building and maintaining relationships with suppliers who can consistently deliver high-quality materials and services at competitive prices. A well-executed sourcing strategy ensures a steady flow of resources, reduces costs, and enhances a company's ability to meet customer demands. This includes the ability to develop a diverse supplier base, and the ability to find alternative sources of materials when needed.</p>
            <p className="mt-2">In today's globalized economy, sourcing has become increasingly complex, requiring businesses to navigate international markets, manage cultural differences, and comply with diverse regulations. Effective sourcing strategies focus on long-term partnerships, collaboration, and continuous improvement. This includes evaluating supplier performance, negotiating favourable contracts, and fostering innovation. The sourcing function is also increasingly responsible for ensuring ethical and sustainable practices throughout the supply chain, addressing concerns such as labour rights, environmental impact, and social responsibility. This means that a company must have the ability to audit suppliers, and to ensure that they are meeting all required regulations.</p>
          </div>
        </section>

        {/* ========== SECTION 2: MAKE-OR-BUY DECISION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Make-or-Buy Decision</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The make-or-buy decision is a strategic assessment that determines whether a company should produce a product or component internally or acquire it from an external supplier. This decision is critical because it impacts a company's cost structure, quality control, and strategic flexibility. The analysis involves evaluating various factors, including cost, quality, capacity, strategic importance, and risk. A thorough cost analysis compares the total cost of internal production with the total cost of external procurement, considering both direct and indirect costs.</p>
            <p className="mt-2">Beyond cost, companies must consider the strategic implications of the make-or-buy decision. Internal production may offer greater control over quality, intellectual property, and production schedules, but it also requires significant investments in manufacturing capabilities and expertise. Conversely, external sourcing may provide access to specialized expertise, economies of scale, and greater flexibility. The decision should also consider the company's core competencies and long-term strategic goals. Companies must also consider the risks associated with each decision. This includes the risk of supply disruptions, and the risk of quality control issues.</p>
          </div>
        </section>

        {/* ========== SECTION 3: SUPPLIER SELECTION CRITERIA ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supplier Selection Criteria</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Quality</h3>
            <p>This refers to the supplier's ability to consistently provide goods or services that meet or exceed the required specifications and standards. Quality is paramount, as it directly impacts the quality of the company's own products or services. Consistent quality reduces defects, minimizes rework, and enhances customer satisfaction. This includes the supplier's quality control processes, and their ability to provide documentation of their quality. This also includes the supplier's adherence to industry standards, and certifications.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost</h3>
            <p>This involves evaluating the total cost of ownership, including the purchase price, transportation costs, inventory holding costs, and any other associated expenses. Competitive pricing is essential, but it should be balanced with other factors such as quality and reliability. Low initial costs can lead to higher long-term costs. This analysis should include the ability of the supplier to offer volume discounts, and other cost saving measures.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> Reliability</h3>
            <p>This refers to the supplier's ability to consistently deliver goods or services on time and in the agreed-upon quantities. Reliability is crucial for maintaining production schedules and meeting customer demands. This includes the supplier's ability to handle unexpected changes in demand, and their ability to provide timely communication.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Factory size={20} /> Capacity</h3>
            <p>This involves assessing the supplier's ability to meet the company's current and future demand requirements. The supplier should have sufficient capacity to handle fluctuations in demand and scale up production as needed. This assessment should include the supplier's ability to expand their production capabilities, and their ability to invest in new equipment.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> Financial Stability</h3>
            <p>This involves evaluating the supplier's financial health and stability to ensure they can meet their obligations and remain a reliable partner. This includes reviewing the suppliers' financial statements, and their credit rating.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu size={20} /> Technology and Innovation</h3>
            <p>This refers to the supplier's ability to leverage technology and innovation to improve processes, products, and services. Suppliers who invest in R&D and embrace new technologies can provide a competitive advantage. This includes the supplier's ability to implement new technologies, and their ability to collaborate on innovation.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageSquare size={20} /> Communication</h3>
            <p>Effective communication is vital for a strong supplier relationship. The supplier should be responsive, transparent, and proactive in their communication. This includes the supplier's ability to provide regular updates, and their ability to resolve issues quickly.</p>
          </div>
        </section>

        {/* ========== SECTION 4: SUPPLIER SELECTION MODELS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supplier Selection Models</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> Weighted-Point Model</h3>
            <p>This model involves assigning weights to different selection criteria based on their importance to the company. Each supplier is then evaluated and scored against each criterion, and the scores are multiplied by the weights. The supplier with the highest total score is selected. This model provides a structured and objective approach to supplier selection, allowing companies to prioritize criteria and make informed decisions. The weighting system requires a company to determine what is most important to their business.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GitBranch size={20} /> Analytical Hierarchy Process (AHP)</h3>
            <p>AHP is a multi-criteria decision-making method that involves breaking down complex decisions into a hierarchy of criteria and sub-criteria. Pairwise comparisons are used to determine the relative importance of each criterion and supplier. AHP is useful for complex decisions with multiple criteria and stakeholders. It allows for consistent evaluation and ensures that all stakeholders are involved in the selection process. This model allows for complex comparisons.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost-Based Model</h3>
            <p>This model focuses primarily on cost as the main selection criterion. Suppliers are evaluated based on their pricing, and the supplier with the lowest total cost of ownership is selected. This model is suitable for companies that prioritize cost reduction and have a clear understanding of their cost drivers. However, it can overlook other important factors such as quality and reliability.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Star size={20} /> Vendor Rating System</h3>
            <p>This system involves establishing a formal process for evaluating and rating supplier performance based on predefined criteria. Suppliers are regularly monitored and assessed, and their ratings are used to make future selection decisions. This system provides ongoing feedback and encourages continuous improvement among suppliers. It also allows for the easy tracking of supplier performance over time.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Multi-Attribute Utility Theory (MAUT)</h3>
            <p>MAUT is a decision-making approach that assigns utility values to different attributes of each supplier, reflecting their relative importance and preference. The supplier with the highest overall utility score is selected. This model is useful for complex decisions involving multiple attributes and preferences. It allows for the integration of both quantitative and qualitative factors. This model requires a high degree of data gathering.</p>
          </div>
        </section>

        {/* ========== SECTION 5: PROCUREMENT CYCLE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Procurement Cycle</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The procurement cycle is the complete process of acquiring goods or services from external sources, from the initial identification of a need to the final payment and contract closure. It encompasses all the steps involved in sourcing, purchasing, and managing the acquisition of materials, supplies, and services necessary for an organization's operations. A well-defined procurement cycle ensures efficiency, cost-effectiveness, and compliance with organizational policies and regulations.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Stages in the Procurement Cycle</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>1. Identification of Need:</strong> This is the initial stage where a department or individual within the organization recognizes the need for specific goods or services. This need may arise from various factors, such as production requirements, inventory replenishment, or operational demands. This stage involves clearly defining the specifications, quantities, and timelines for the required goods or services. A detailed requisition is often created to document the need.</li>
              <li><strong>2. Sourcing:</strong> This stage involves identifying potential suppliers who can provide the required goods or services. It includes activities such as market research, supplier evaluation, and request for information (RFI). The goal is to identify reliable and qualified suppliers who can meet the organization's quality, cost, and delivery requirements. This stage can also involve the creation of a list of approved vendors.</li>
              <li><strong>3. Request for Quotation (RFQ) or Request for Proposal (RFP):</strong> In this stage, the organization sends out RFQs or RFPs to shortlisted suppliers, requesting detailed quotations or proposals. RFQs are typically used for standardized goods or services, while RFPs are used for more complex or customized requirements. This allows for the comparison of suppliers.</li>
              <li><strong>4. Supplier Evaluation and Selection:</strong> This stage involves evaluating the received quotations or proposals based on predefined criteria, such as price, quality, delivery, and supplier capabilities. The organization selects the supplier that best meets its requirements and negotiates the terms and conditions of the purchase. This stage can involve the use of supplier selection models.</li>
              <li><strong>5. Purchase Order (PO) Issuance:</strong> Once a supplier is selected, a PO is issued, which serves as a formal agreement between the organization and the supplier. The PO specifies the details of the purchase, including the goods or services, quantities, prices, delivery dates, and payment terms.</li>
              <li><strong>6. Order Tracking and Expediting:</strong> This stage involves monitoring the progress of the order and ensuring that it is delivered on time. It includes tracking shipments, communicating with the supplier, and expediting orders if necessary to avoid delays.</li>
              <li><strong>7. Goods Receipt and Inspection:</strong> Upon delivery, the goods are received and inspected to ensure they meet the specified quality and quantity requirements. Any discrepancies or damages are documented and reported to the supplier. This stage is important for quality control.</li>
              <li><strong>8. Invoice Processing and Payment:</strong> This stage involves processing the supplier's invoice and making payment according to the agreed-upon terms. It includes verifying the invoice against the PO and goods receipt and ensuring accurate and timely payment.</li>
              <li><strong>9. Contract Management and Supplier Relationship Management:</strong> This stage involves managing the ongoing relationship with the supplier and ensuring compliance with the contract terms. It includes activities such as performance evaluation, contract renewals, and resolving any issues that may arise. This stage also includes maintaining good communication with the suppliers.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: DOCUMENTS USED IN THE PURCHASING CYCLE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Documents Used in the Purchasing Cycle</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Purchase Requisition</h3>
            <p>This is an internal document that initiates the purchasing process. It is used by a department or individual to request the procurement of specific goods or services. It typically includes details such as the item description, quantity, required delivery date, and budget information. This document acts as a formal request, providing authorization for the procurement department to proceed with the purchase.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileSearch size={20} /> Request for Quotation (RFQ)</h3>
            <p>This document is sent to potential suppliers to solicit price quotations for specific goods or services. It outlines the requirements and specifications, allowing suppliers to provide competitive bids. RFQs are commonly used for standardized items or services where price is a primary consideration.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Request for Proposal (RFP)</h3>
            <p>Like an RFQ, an RFP is used to solicit proposals from suppliers. However, RFPs are typically used for more complex or customized requirements where factors beyond price, such as technical capabilities or service offerings, are important. RFPs allow suppliers to showcase their expertise and propose solutions tailored to the organization's needs.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileCheck size={20} /> Purchase Order (PO)</h3>
            <p>This is a formal document issued to a selected supplier, authorizing the purchase of specific goods or services. It includes details such as the item description, quantity, price, delivery date, and payment terms. The PO serves as a legally binding contract between the organization and the supplier.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardList size={20} /> Goods Receipt Note (GRN)</h3>
            <p>This document is used to record the receipt of goods from a supplier. It verifies that the delivered goods match the quantity and specifications outlined in the PO. The GRN is essential for inventory control and for reconciling invoices with received goods.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Receipt size={20} /> Invoice</h3>
            <p>This is a document issued by the supplier, requesting payment for the goods or services provided. It includes details such as the invoice number, date, item description, quantity, price, and payment terms. Invoices are used to process payments and maintain accurate financial records.</p>
          </div>
        </section>

        {/* ========== SECTION 7: RECORDS USED IN THE PURCHASING CYCLE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Used in the Purchasing Cycle</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Database size={20} /> Supplier Master File</h3>
            <p>This is a database that contains information on approved suppliers, including contact details, performance history, and contract terms. The supplier master file facilitates supplier management and ensures that purchases are made from authorized vendors.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardList size={20} /> Purchase Order Log</h3>
            <p>This is a record of all purchase orders issued by the organization, including details such as the PO number, supplier name, date, and status. The PO log provides a comprehensive overview of purchasing activities and facilitates order tracking.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Package size={20} /> Inventory Records</h3>
            <p>These records track the quantity and value of inventory items, including raw materials, work-in-progress, and finished goods. Inventory records are essential for inventory management and for ensuring that sufficient stock is available to meet demand.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSign size={20} /> Payment Records</h3>
            <p>These records document all payments made to suppliers, including invoice details, payment dates, and payment methods. Payment records are used for financial reporting and for reconciling accounts payable.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileSignature size={20} /> Contract Records</h3>
            <p>These records contain all information about agreements made with the suppliers. This includes the legal contract, and any amendments made to it. These records are very important for legal compliance.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Star size={20} /> Performance Evaluation Records</h3>
            <p>These records contain the data collected during the evaluation of supplier performance. This includes things such as on time delivery rates, and quality ratings. These records are used to determine which suppliers to continue doing business with.</p>
          </div>
        </section>

        {/* ========== SECTION 8: ROLE OF PROCUREMENT IN ORGANIZATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Role of Procurement in Organizations</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><DollarSign size={20} /> Cost Reduction and Savings</h3>
            <p>Procurement plays a critical role in minimizing costs by negotiating favourable prices with suppliers, identifying cost-saving opportunities, and optimizing purchasing processes. Effective procurement professionals leverage market knowledge and negotiation skills to secure the best possible deals, directly impacting the organization's bottom line. This includes finding alternative suppliers, or materials, that can be used to reduce costs.</p>
            <p className="mt-2">Furthermore, procurement can drive cost savings by consolidating purchases, implementing strategic sourcing initiatives, and reducing waste. By streamlining purchasing processes and eliminating inefficiencies, procurement contributes to overall operational efficiency and profitability.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Supplier Relationship Management</h3>
            <p>Procurement is responsible for building and maintaining strong relationships with suppliers. This involves fostering open communication, collaboration, and trust to ensure reliable supply and mutual benefit. Strong supplier relationships enable organizations to access innovative solutions, negotiate favourable terms, and mitigate supply chain risks.</p>
            <p className="mt-2">Furthermore, procurement manages supplier performance, monitors compliance, and resolves any issues that may arise. This includes conducting supplier evaluations, providing feedback, and working collaboratively to improve supplier capabilities and performance.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Quality Assurance</h3>
            <p>Procurement ensures that purchased goods and services meet the organization's quality standards. This involves evaluating supplier quality control processes, conducting inspections, and verifying compliance with specifications. By maintaining quality standards, procurement safeguards the organization's reputation and minimizes the risk of product defects or service failures.</p>
            <p className="mt-2">Procurement professionals also work closely with suppliers to address quality issues and implement corrective actions. This includes conducting audits, providing technical assistance, and facilitating continuous improvement initiatives.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Risk Management</h3>
            <p>Procurement plays a crucial role in mitigating supply chain risks, such as supply disruptions, price volatility, and supplier failures. By diversifying suppliers, implementing contingency plans, and monitoring market trends, procurement helps to ensure business continuity and minimize potential losses.</p>
            <p className="mt-2">Procurement also assesses and manages risks related to supplier compliance, ethical sourcing, and regulatory requirements. This includes conducting due diligence, implementing risk mitigation strategies, and ensuring adherence to legal and ethical standards.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Rocket size={20} /> Innovation and Competitive Advantage</h3>
            <p>Procurement can drive innovation by identifying and sourcing new technologies, materials, and solutions from suppliers. By collaborating with suppliers on product development and process improvements, procurement helps organizations stay ahead of the competition.</p>
            <p className="mt-2">Procurement professionals also monitor market trends and identify emerging technologies that can provide a competitive advantage. This includes exploring new sourcing strategies, evaluating innovative products, and fostering collaboration with cutting-edge suppliers.</p>
          </div>
        </section>

        {/* ========== SECTION 9: SUPPLIER SELECTION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Supplier Selection</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Needs Assessment and Criteria Development</h3>
            <p>The supplier selection process begins with a thorough assessment of the organization's needs and requirements. This involves defining the specific goods or services required, as well as the criteria for evaluating potential suppliers. Key criteria may include quality, cost, reliability, capacity, and financial stability. Developing clear and comprehensive selection criteria ensures that the evaluation process is objective and aligned with the organization's strategic goals. This includes prioritizing criteria based on their importance and establishing measurable metrics for evaluation.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Search size={20} /> Supplier Identification and Research</h3>
            <p>Once the selection criteria are defined, potential suppliers are identified through market research, industry databases, and referrals. This involves gathering information on supplier capabilities, experience, and reputation. Conducting thorough research and due diligence ensures that the organization selects suppliers who are qualified and capable of meeting its needs. This includes reviewing supplier websites, requesting information, and conducting site visits.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Request for Information (RFI) or Request for Proposal (RFP)</h3>
            <p>Depending on the complexity of the requirements, organizations may issue an RFI or RFP to shortlisted suppliers. An RFI is used to gather general information on supplier capabilities, while an RFP is used to solicit detailed proposals and quotations. Issuing RFIs or RFPs allows organizations to compare suppliers based on their responses and select the most suitable candidates for further evaluation.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Star size={20} /> Supplier Evaluation and Scoring</h3>
            <p>The received proposals or quotations are evaluated based on the predefined selection criteria. This involves assigning scores or ratings to each supplier based on their performance against each criterion. Using a structured evaluation process ensures that the selection is objective and transparent. This may involve using weighted-point models or other decision-making tools.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Negotiation and Contract Award</h3>
            <p>Once a supplier is selected, negotiations are conducted to finalize the terms and conditions of the contract. This includes negotiating pricing, delivery schedules, and quality standards. Awarding the contract to the selected supplier formalizes the agreement and establishes a long-term partnership. This includes clearly defined terms, and conditions.</p>
          </div>
        </section>

        {/* ========== SECTION 10: PLACING OF ORDERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Placing of Orders</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileCheck size={20} /> Purchase Order Creation</h3>
            <p>The placing of orders begins with the creation of a purchase order (PO). The PO is a formal document that authorizes the purchase of specific goods or services from a selected supplier. It includes details such as the item description, quantity, price, delivery date, and payment terms. Creating accurate and complete POs ensures that suppliers have all the necessary information to fulfil the order. This reduces the risk of errors and delays.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Send size={20} /> PO Transmission and Acknowledgement</h3>
            <p>The PO is transmitted to the supplier via electronic data interchange (EDI), email, or other communication channels. The supplier acknowledges receipt of the PO and confirms their ability to fulfil the order. Ensuring timely transmission and acknowledgement of POs facilitates efficient order processing and minimizes delays. This also provides proof that the supplier has received the order.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Order Tracking and Monitoring</h3>
            <p>The progress of the order is tracked and monitored to ensure timely delivery. This involves communicating with the supplier, tracking shipments, and resolving any issues that may arise. Proactive order tracking and monitoring enables organizations to anticipate and address potential delays or disruptions. This also allows for the easy identification of bottlenecks.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ClipboardList size={20} /> Goods Receipt and Inspection</h3>
            <p>Upon delivery, the goods are received and inspected to ensure they meet the specified quality and quantity requirements. Any discrepancies or damages are documented and reported to the supplier. Conducting thorough inspections ensures that the organization receives the correct goods in good condition. This also facilitates accurate inventory management.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Receipt size={20} /> Invoice Processing and Payment</h3>
            <p>The supplier's invoice is processed, and payment is made according to the agreed-upon terms. This involves verifying the invoice against the PO and goods receipt and ensuring accurate and timely payment. Efficient invoice processing and payment maintains good relationships with suppliers and ensures timely payment. This also helps to avoid late payment fees.</p>
          </div>
        </section>

        {/* ========== SECTION 11: FOLLOW-UP AND EXPEDITING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Follow-up and Expediting</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Proactive Order Tracking</h3>
            <p>This involves continuously monitoring the status of placed orders to ensure they are on schedule. Using tracking systems or direct communication with suppliers, procurement teams can stay informed about the progress of shipments. This proactive approach allows for early detection of potential delays. Real-time tracking systems and regular check-ins with suppliers provide up-to-date information, allowing for timely interventions. This constant monitoring helps to keep the supply chain moving smoothly.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageSquare size={20} /> Communication with Suppliers</h3>
            <p>Maintaining regular communication with suppliers is essential for effective follow-up. This involves confirming delivery dates, resolving any issues, and addressing potential delays. Open communication helps to build strong supplier relationships and ensures that both parties are aligned. Clear and consistent communication channels help to avoid misunderstandings and facilitate quick problem-solving. This includes providing regular updates and responding quickly to supplier inquiries.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Zap size={20} /> Expediting Critical Orders</h3>
            <p>When delays occur or urgent needs arise, expediting becomes necessary. This involves taking steps to accelerate the delivery of critical orders, such as arranging for faster transportation or prioritizing production. Expediting requires careful coordination and negotiation with suppliers and logistics providers. This also requires careful planning, and good communication.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Documentation of Follow-up Activities</h3>
            <p>It is important to document all follow-up and expediting activities, including communication records, tracking updates, and any actions taken to resolve delays. This documentation provides a clear audit trail and helps to identify patterns or recurring issues. Detailed records facilitate performance analysis and help to improve future procurement processes. This also helps to ensure accountability.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AlertTriangle size={20} /> Anticipating Potential Delays</h3>
            <p>Experienced procurement teams anticipate potential delays by analysing historical data, monitoring market trends, and assessing supplier performance. This proactive approach allows for early intervention and mitigation of risks. By identifying potential bottlenecks and disruptions, procurement can take preventive measures to ensure timely delivery. This includes having contingency plans in place.</p>
          </div>
        </section>

        {/* ========== SECTION 12: QUALITY MANAGEMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Quality Management</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Search size={20} /> Supplier Quality Audits</h3>
            <p>Conducting regular audits of supplier facilities and processes helps to ensure that they meet the organization's quality standards. These audits assess the supplier's quality management systems, manufacturing processes, and quality control procedures. Audits provide valuable insights into supplier capabilities and help to identify areas for improvement. This also allows for the early detection of quality issues.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Incoming Goods Inspection</h3>
            <p>Inspecting incoming goods upon delivery verifies that they meet the specified quality requirements. This involves checking for defects, damages, and compliance with specifications. Thorough inspections help to prevent defective materials from entering the production process. This also helps to maintain quality control.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Quality Control Documentation</h3>
            <p>Maintaining detailed quality control documentation, such as inspection reports, test results, and corrective action records, is essential for tracking and monitoring quality performance. Accurate documentation provides an audit trail and facilitates continuous improvement. This also allows for easy tracking of quality metrics.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Star size={20} /> Supplier Performance Evaluation</h3>
            <p>Regularly evaluating supplier quality performance helps to identify areas for improvement and ensure ongoing compliance with quality standards. This involves tracking key performance indicators (KPIs) such as defect rates and customer complaints. Performance evaluations provide valuable feedback to suppliers and help to build strong quality partnerships. This also allows for the identification of high performing suppliers.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Continuous Improvement Initiatives</h3>
            <p>Implementing continuous improvement initiatives, such as Six Sigma or Lean methodologies, helps to enhance quality throughout the supply chain. This involves collaborating with suppliers to identify and eliminate waste and improve processes. Continuous improvement fosters a culture of quality and drives ongoing enhancements. This also helps to reduce cost and improve efficiency.</p>
          </div>
        </section>

        {/* ========== SECTION 13: NEGOTIATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Negotiation</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Search size={20} /> Preparation and Research</h3>
            <p>Effective negotiation begins with thorough preparation. This involves researching the supplier, understanding market conditions, and defining clear objectives and negotiation strategies. It also includes gathering data on historical pricing, competitor offerings, and potential alternatives. This research provides leverage and ensures that negotiations are based on facts and data, leading to more favourable outcomes. Proper preparation allows for anticipation of counterarguments.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Establishing Clear Objectives</h3>
            <p>Before entering negotiations, it is essential to define clear and specific objectives. This includes setting targets for pricing, delivery terms, quality standards, and contract terms. Having well-defined objectives provides a framework for the negotiation process and ensures that the desired outcomes are achieved. Clear objectives also help to prioritize key issues and avoid getting side-tracked during negotiations. This allows for a focus on the most important aspects of the agreement.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Handshake size={20} /> Building Rapport and Communication</h3>
            <p>Building rapport and establishing open communication with the supplier is crucial for successful negotiations. This involves creating a positive and collaborative environment, actively listening to the supplier's concerns, and clearly articulating the organization's needs. Effective communication fosters trust and facilitates mutual understanding, leading to more productive negotiations. This includes the ability to clearly state one's position, and to understand the other party's position.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Scale size={20} /> Strategic Bargaining and Compromise</h3>
            <p>Negotiation involves strategic bargaining and compromise to reach mutually beneficial agreements. This includes identifying areas of flexibility, developing creative solutions, and being willing to make concessions when necessary. Strategic bargaining requires a balance between assertiveness and flexibility, ensuring that the organization's interests are protected while also building a strong supplier relationship. This includes the ability to find win-win situations.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileSignature size={20} /> Contract Finalization and Documentation</h3>
            <p>Once an agreement is reached, it is essential to finalize the contract and document all terms and conditions. This includes reviewing the contract carefully, ensuring that all agreed-upon terms are included, and obtaining necessary approvals. Proper contract documentation provides a clear record of the agreement and minimizes the risk of misunderstandings or disputes. This also helps with future auditing.</p>
          </div>
        </section>

        {/* ========== SECTION 14: MANAGE THE PROCUREMENT PROCESS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Manage the Procurement Process</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Process Standardization and Optimization</h3>
            <p>Managing the procurement process involves standardizing and optimizing procedures to improve efficiency and effectiveness. This includes developing clear guidelines, implementing best practices, and leveraging technology to automate tasks. Standardization ensures consistency and reduces errors, while optimization eliminates waste and improves overall performance. This also helps with regulatory compliance.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BarChart4 size={20} /> Performance Monitoring and Measurement</h3>
            <p>Regularly monitoring and measuring procurement performance is essential for identifying areas for improvement. This involves tracking key performance indicators (KPIs) such as cost savings, delivery times, and supplier performance. Performance monitoring provides valuable insights into the effectiveness of procurement processes and helps to ensure that objectives are being met. This also helps to identify trends.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> Risk Management and Compliance</h3>
            <p>Managing the procurement process includes identifying and mitigating risks, such as supply disruptions, price volatility, and supplier failures. It also involves ensuring compliance with legal and ethical standards. Proactive risk management and compliance help to protect the organization from potential losses and maintain its reputation. This also involves implementing contingency plans.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cpu size={20} /> Technology Integration and Automation</h3>
            <p>Leveraging technology is crucial for managing the procurement process efficiently. This includes implementing e-procurement systems, automating tasks, and integrating data across different platforms. Technology integration streamlines operations, improves data accuracy, and enhances collaboration with suppliers. This also reduces the need for manual data entry.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Continuous Improvement and Innovation</h3>
            <p>Managing the procurement process involves fostering a culture of continuous improvement and innovation. This includes seeking feedback from stakeholders, implementing best practices, and exploring new sourcing strategies. Continuous improvement drives ongoing enhancements and ensures that the procurement process remains aligned with the organization's evolving needs. This also helps to maintain a competitive edge.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Sourcing & Procurement</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sourcing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Make-or-Buy</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supplier Selection</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Procurement Cycle</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quality Management</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Negotiation</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Sourcing & Procurement. 🔗📋</p>
        </footer>

      </div>
    </div>
  );
};
