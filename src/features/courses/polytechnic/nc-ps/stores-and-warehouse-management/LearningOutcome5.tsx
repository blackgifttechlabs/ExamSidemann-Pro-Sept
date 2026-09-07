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
  Shield,Search,Presentation,
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
  Star
} from 'lucide-react';

export const LearningOutcome5: React.FC = () => {
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              NC PURCHASING &amp; SUPPLY: MODULE LO5
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Obsolete Stock & <span className="text-rose-300 font-bold italic">Disposal</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to compiling obsolete stock lists, disposal methods, obsolete stock reports, seeking authority, and signed authorization documents.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">obsolete_stock.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IDENTIFY</span><span className="text-white">Obsolete;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">DISPOSE</span><span className="text-white">Methods;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">AUTHORIZE</span><span className="text-white">Action;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Trash2 className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><FileCheck className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: COMPILING A LIST OF OBSOLETE STOCKS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Compiling a List of Obsolete Stocks</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Compiling a list of obsolete stocks is a crucial first step in the process of managing and disposing of unwanted inventory. Obsolete stock, also known as dead stock, refers to inventory items that are no longer in demand or have become unusable due to factors such as technological advancements, changes in customer preferences, or expiry dates. Effectively identifying and documenting these items is essential for minimizing storage costs, freeing up valuable warehouse space, and recovering any potential value from the obsolete stock. This process requires a systematic approach, involving data analysis, physical inspections, and collaboration across departments.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Data Analysis and Reporting</h3>
            <p>The process begins with a thorough analysis of inventory data. This involves generating reports that identify slow-moving or non-moving items, based on historical sales data, demand forecasts, and inventory turnover rates. Inventory management systems can provide valuable insights into stock aging and identify items that have not been sold or used within a specified period. Reports should also include information on the age of the stock, the cost of the items, and any relevant product details. This data analysis provides a foundation for identifying potential obsolete items.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Physical Inspections and Verification</h3>
            <p>Data analysis alone is not sufficient. Physical inspections of the inventory are necessary to verify the condition and usability of the items. This involves visually inspecting the stock, checking for damage, expiry dates, or signs of deterioration. Physical inspections are also essential for identifying items that may have been incorrectly categorized or that are no longer in their original packaging. When performing the physical inspection, it is important to verify the data from the reporting stage, to ensure that the data is accurate.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Collaboration with Relevant Departments</h3>
            <p>Compiling a comprehensive list of obsolete stocks requires collaboration with various departments, including sales, marketing, purchasing, and production. Sales and marketing teams can provide insights into changes in customer demand and product trends. Purchasing and production teams can provide information on product lifecycle and any planned changes in product lines. Collaboration with these departments helps to ensure that all relevant factors are considered and that the list of obsolete stocks is accurate and complete.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Tag size={20} /> Categorization and Documentation</h3>
            <p>Once obsolete stocks have been identified and verified, they should be categorized and documented. This involves assigning categories to the items based on their condition, value, and potential disposal options. Documentation should include detailed information on each item, such as item code, description, quantity, cost, and reason for obsolescence. This categorization and documentation facilitate the subsequent disposal process and provide a clear audit trail.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Establishing Criteria for Obsolescence</h3>
            <p>It is vital to establish clear criteria for determining when an item is considered obsolete. This ensures consistency in the identification process. Criteria may include factors such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Age of the stock.</li>
              <li>Lack of sales or usage.</li>
              <li>Expiry dates.</li>
              <li>Changes in product specifications or technology.</li>
              <li>Damage or deterioration.</li>
            </ul>
            <p className="mt-2">Having set criteria, will reduce the number of subjective decisions made.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regular Reviews and Updates</h3>
            <p>The list of obsolete stocks should be regularly reviewed and updated. Market conditions, product trends, and business needs can change over time, leading to the obsolescence of new items. Regular reviews help to ensure that the list remains current and that disposal actions are taken in a timely manner.</p>
          </div>
        </section>

        {/* ========== SECTION 2: METHOD OF DISPOSAL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Method of Disposal</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Once a list of obsolete or unwanted stock has been compiled, the next crucial step is to determine the most appropriate method of disposal. This decision is not simply about removing the items from the warehouse; it involves a careful evaluation of various factors, including the type of goods, their condition, potential value, and the organization's environmental and financial considerations. The chosen disposal method should aim to maximize the recovery of value, minimize costs, and comply with all applicable regulations. Determining the best disposal method requires a strategic approach, involving analysis of the stock, market research, and consideration of the organization's overall goals.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Sale or Liquidation</h3>
            <p>For items that still have some market value, selling or liquidating them can be a viable option. This may involve selling the items to discount retailers, liquidators, or online marketplaces. Thorough market research is crucial to determine the potential resale value of the items and identify suitable buyers. Factors such as the condition of the goods, their demand, and the availability of buyers should be considered. Liquidating obsolete stock can help to recover some of the initial investment and minimize losses. This method is particularly suitable for items that are still functional but are no longer in demand in their original market. However, it is essential to consider the potential impact on the brand image and pricing of current products when selling obsolete stock at discounted prices. Contracts, and agreements, should be drawn up, to protect the company.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Heart size={20} /> Donation or Charitable Giving</h3>
            <p>Donating obsolete stock to charities or non-profit organizations can be a socially responsible and cost-effective disposal method. This option is particularly suitable for items that are still usable but are no longer needed by the organization. Donations can provide valuable support to those in need and enhance the organization's reputation. It is important to ensure that the chosen charity is reputable, and that the donation complies with all applicable tax regulations. Documenting the donation and obtaining a receipt is essential for tax purposes. This method also helps avoid disposal fees and can be good for public relations.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Recycle size={20} /> Recycling or Repurposing</h3>
            <p>Recycling or repurposing obsolete stock is an environmentally friendly disposal method that can help to minimize waste and recover valuable materials. This option is particularly suitable for items that are made from recyclable materials, such as metals, plastics, or electronics. Partnering with recycling companies or organizations that specialize in repurposing materials can help to ensure that the items are disposed of responsibly. This method can also help the company meet its sustainability goals and reduce its environmental impact.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Trash2 size={20} /> Destruction or Disposal</h3>
            <p>In some cases, the only viable disposal method is destruction or disposal. This option is typically used for items that are damaged, expired, or hazardous. It is crucial to ensure that the destruction or disposal process complies with all applicable environmental regulations and safety standards. Partnering with certified disposal companies can help to ensure that the items are disposed of responsibly and safely. Proper documentation of the destruction or disposal process is essential for compliance and audit purposes. This is the most expensive method and should be used as a last resort.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Return to Supplier</h3>
            <p>If the obsolete stock was purchased from a supplier, it may be possible to return the items for credit or replacement. This option is particularly suitable for items that are defective or that were incorrectly shipped. Communicating with the supplier and negotiating a return agreement is essential. This option can help to recover some of the initial investment and minimize losses. This method is often written into the initial purchase agreement.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Internal Reuse</h3>
            <p>Sometimes, obsolete stock from one department can be reused in another department. This involves identifying potential internal uses for the items and transferring them to the appropriate department. This option can help to minimize waste and reduce the need for new purchases. This method requires good communication between departments.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> Consideration of Costs and Regulations</h3>
            <p>When determining the disposal method, it is essential to consider the associated costs, including transportation, disposal fees, and labour costs. It is also crucial to ensure that the chosen method complies with all applicable environmental regulations, safety standards, and legal requirements. Failing to comply with regulations can result in fines, penalties, and damage to the organization's reputation.</p>
          </div>
        </section>

        {/* ========== SECTION 3: OBSOLETE STOCK REPORT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Obsolete Stock Report</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The availability of a comprehensive obsolete stock report is a critical component of effective inventory management and disposal. This report serves as a central document that consolidates information on all identified obsolete items, providing a clear and detailed overview of the nature, quantity, and value of these stocks. It is not merely a list; it is a strategic tool that facilitates informed decision-making regarding disposal methods, financial implications, and future inventory management practices. By providing accurate and timely information, the obsolete stock report enables organizations to minimize losses, optimize warehouse space, and improve overall inventory efficiency. This report becomes a vital piece of the audit trail and helps to determine the effectiveness of the inventory management system.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Comprehensive Inventory Overview</h3>
            <p>The obsolete stock report provides a complete and detailed overview of all identified obsolete items. This includes information such as item codes, descriptions, quantities, unit costs, total costs, and the reasons for obsolescence. Having all this information compiled in one place allows management to quickly understand the scope of the obsolete stock problem and assess its financial impact. The report should also specify the age of the stock, and the location of the stock within the warehouse. This detailed overview enables organizations to make informed decisions about disposal methods and prioritize actions. The report should be easy to read, and understand, for all stakeholders.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Financial Impact Assessment</h3>
            <p>A key function of the obsolete stock report is to assess the financial impact of obsolete inventory. This involves calculating the total value of the obsolete stock, which represents a potential loss for the organization. By quantifying the financial impact, the report highlights the need for prompt action to minimize further losses. This information is also essential for financial reporting and accounting purposes. The report can also provide information that allows for the creation of financial projections, regarding the costs of disposal. The finance department will find this report very useful.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Facilitation of Disposal Planning</h3>
            <p>The obsolete stock report provides the information needed to plan and execute the disposal of obsolete items. This includes determining the most appropriate disposal methods, such as sale, donation, recycling, or destruction, based on the nature and condition of the items. The report can also be used to estimate the costs and benefits of different disposal options. The report allows for the creation of a timeline, and action plan, for the disposal process. This planning is vital for the efficient removal of the obsolete stock.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Search size={20} /> Identification of Root Causes</h3>
            <p>Analysing the information in the obsolete stock report can help to identify the root causes of obsolescence. This may include factors such as inaccurate demand forecasting, poor inventory management practices, or changes in market conditions. By understanding the root causes, organizations can implement corrective actions to prevent future obsolescence. This preventative action can save the company a lot of money in the long run. The report can be used to improve the inventory management system.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Audit Trail and Compliance</h3>
            <p>The obsolete stock report serves as an important audit trail, documenting the identification, evaluation, and disposal of obsolete inventory. This documentation is essential for compliance with accounting standards, tax regulations, and internal control procedures. The report should include information on all disposal actions taken, including dates, methods, and costs. This audit trail is very important for external audits.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Improved Inventory Management Practices</h3>
            <p>The insights gained from the obsolete stock report can be used to improve overall inventory management practices. This may involve implementing better demand forecasting techniques, optimizing inventory levels, and enhancing inventory control procedures. By learning from past mistakes, organizations can minimize the risk of future obsolescence and improve inventory efficiency. The report can be used as a training tool, to show employees the effects of poor inventory management.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Enhanced Decision-Making</h3>
            <p>The obsolete stock report provides critical data that enables informed decision-making regarding inventory management and disposal strategies. This data helps to prioritize which items to dispose of first, and what method of disposal to use. Having access to this data, allows management to make data driven decisions.</p>
          </div>
        </section>

        {/* ========== SECTION 4: SEEKING AUTHORITY TO DISPOSE STOCK ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Seeking Authority to Dispose Stock</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The decision to dispose of stock, particularly obsolete or damaged items, is not one to be taken lightly. It requires a formal process of seeking and obtaining authority, ensuring that the action is aligned with the organization's policies and financial controls. This process safeguards against unauthorized disposal, potential financial losses, and compliance issues. Seeking authority to dispose of stock involves presenting a clear and compelling case, supported by relevant documentation and justifications, to the appropriate decision-makers within the organization. This formal authorization process is a vital step in maintaining accountability and transparency in inventory management.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FilePlus size={20} /> Preparation of a Comprehensive Disposal Request</h3>
            <p>The process begins with the preparation of a detailed disposal request. This document should include a comprehensive list of the items to be disposed of, along with their descriptions, quantities, unit costs, and total costs. It should also include a clear explanation of the reasons for disposal, such as obsolescence, damage, or expiry. Supporting documentation, such as obsolete stock reports, inspection reports, and photographs, should be attached to the request. The request should also detail the proposed method of disposal, and the projected costs or benefits associated with it. A well-prepared disposal request will help the decision makers, to make an informed decision.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Justification of the Disposal Decision</h3>
            <p>The disposal request must provide a strong justification for the proposed disposal action. This involves demonstrating that the disposal is necessary and that it aligns with the organization's best interests. This justification should include a financial analysis, showing the potential costs of retaining the stock versus the benefits of disposal. It should also address any potential risks or liabilities associated with the disposal. The justification must also show that the disposal will comply with all relevant regulations, and internal policies.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Identification of the Appropriate Authority</h3>
            <p>Organizations have established hierarchies and approval processes. It is crucial to identify the appropriate authority or decision-maker who has the power to approve the disposal request. This may vary depending on the value of the stock, the nature of the items, and the organization's policies. In larger organizations, it might require multiple levels of approval. Knowing the correct person or team to approach, will speed up the process.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Presentation size={20} /> Presentation of the Disposal Request</h3>
            <p>The disposal request should be presented to the appropriate authority in a clear and concise manner. This may involve a formal presentation, a written submission, or a combination of both. The presentation should highlight the key points of the request, including the reasons for disposal, the proposed method, and the financial implications. Be prepared to answer questions and defend the request.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Documentation of Approval</h3>
            <p>Once the disposal request has been approved, it is essential to document the approval in writing. This may involve obtaining a signed approval form, an email confirmation, or an entry in an electronic approval system. The documentation should clearly state the items approved for disposal, the approved method of disposal, and any conditions or restrictions. This documentation serves as an audit trail and provides evidence of authorized disposal. This documentation also protects the person that requested the disposal.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Implementation of Disposal and Record Keeping</h3>
            <p>After approval, the disposal process should be implemented according to the approved method. All disposal activities should be documented, including dates, methods, and costs. Records of the disposal should be maintained for audit and compliance purposes. These records should be stored in compliance with the organizations record retention policy.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regular Review of Disposal Policies</h3>
            <p>Organizations should periodically review their disposal policies and procedures to ensure they remain relevant and effective. This review should consider changes in regulations, market conditions, and the organization's needs. This will help to streamline the disposal process in the future.</p>
          </div>
        </section>

        {/* ========== SECTION 5: SIGNED AUTHORIZATION DOCUMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Signed Authorization Document</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The production of a signed authorization document is the formal culmination of the process to dispose of stock, ensuring that the approved disposal is carried out legitimately and in accordance with established policies. This document serves as concrete evidence that the disposal action has been reviewed and approved by the appropriate authority, mitigating the risk of unauthorized or inappropriate disposal. It also provides an essential audit trail, demonstrating accountability and transparency in inventory management. The signed authorization document is not just a piece of paper; it is a legally sound record that protects the organization and its employees from potential liability.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Clear Identification of Authorizing Parties</h3>
            <p>The authorization document must clearly identify the individuals or roles authorized to approve the disposal. This includes the name, title, and contact information of the authorizing party. This clarity ensures that there is no ambiguity about who has granted the approval. The document should also clearly identify the individual or department that requested and will be carrying out the disposal. This part of the document ensures that all parties involved are clearly identified.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Detailed Description of Stock to be Disposed</h3>
            <p>The document must provide a comprehensive description of the stock to be disposed of. This includes item codes, descriptions, quantities, unit costs, and total costs. The document may also include information on the condition of the stock, the reasons for disposal, and the proposed method of disposal. Attaching the original disposal request, and obsolete stock report, will aid in verification. This detailed description ensures that there is no confusion about the items being authorized for disposal.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Explicit Statement of Authorization</h3>
            <p>The document must contain a clear and unambiguous statement of authorization. This statement should explicitly state that the authorizing party approves the disposal of the specified stock, according to the stated method. This eliminates any ambiguity about the intent of the document. The statement should also include any conditions or restrictions associated with the approval.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Reference to Supporting Documentation</h3>
            <p>The authorization document should reference all supporting documentation, such as the disposal request, inspection reports, and financial analyses. This ensures that the approval is based on a thorough review of relevant information. Attaching copies of the supporting documents to the authorization document is good practice. This ensures that all information is easily accessible.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><PenTool size={20} /> Signature and Date</h3>
            <p>The document must be signed and dated by the authorizing party. This signature serves as formal confirmation of the approval. The date of the signature is also important, as it establishes the timeline for the disposal action. Digital signatures can be used if they are legally binding.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Document Control and Retention</h3>
            <p>The signed authorization document must be properly controlled and retained in accordance with the organization's record retention policies. This includes assigning a unique document number, storing the document in a secure location, and establishing access controls. The document should be retained for the required retention period, which may vary depending on regulatory requirements. This ensures that the document is available for audit and compliance purposes.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Distribution and Communication</h3>
            <p>Copies of the signed authorization document should be distributed to all relevant parties, including the warehouse manager, the finance department, and the audit department. This ensures that all stakeholders are aware of the approved disposal action. Clear communication about the approval and the disposal process is essential for ensuring that the action is carried out smoothly and efficiently.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Gavel size={20} /> Compliance with Internal Policies and Regulations</h3>
            <p>The authorization document must comply with all applicable internal policies and external regulations. This includes policies related to inventory management, financial controls, and environmental protection. This ensures that the disposal action is conducted in a legal and ethical manner.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 5 — Obsolete Stock & Disposal</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Obsolete Stock</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disposal Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stock Report</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authority</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authorization</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Obsolete Stock Management. 📦🗑️</p>
        </footer>

      </div>
    </div>
  );
};
