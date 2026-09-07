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
  Shield,
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
  Star,
  Search,
  Hash,
  MapPin,
  Wrench,
  CalendarDays
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
              Managing <span className="text-cyan-300 font-bold italic">Assets</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to master asset registers, obsolete items, serial numbers, institutional numbers, bi-annual asset returns, and comprehensive asset management.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">asset_management.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">RECORD</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">IDENTIFY</span><span className="text-white">Obsolete;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">RETURN</span><span className="text-white">Reports;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Database className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Hash className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: MANAGING ASSETS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Managing Assets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Effective asset management is crucial for any organization, ensuring the proper tracking, maintenance, and disposal of valuable resources. This involves two key components: meticulous record-keeping through a master asset register and the proactive identification and documentation of obsolete items. These practices enable organizations to optimize asset utilization, minimize losses, and maintain accurate financial records.</p>
          </div>
        </section>

        {/* ========== SECTION 2: MASTER ASSET REGISTER ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>All Assets are Recorded in Master Asset Register 6.2</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>A master asset register is the cornerstone of asset management. It is a comprehensive database that meticulously records all assets owned by the organization, providing a single source of truth for asset information. This register goes beyond simply listing assets; it captures crucial details such as acquisition date, purchase cost, depreciation, location, condition, and maintenance history. By maintaining a complete and accurate asset register, organizations can effectively track asset lifecycle, schedule maintenance, and ensure compliance with accounting standards.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Comprehensive Asset Identification and Description</h3>
            <p>The master asset register should include detailed information about each asset, such as its unique identification number, serial number, model number, and a clear description. This thorough identification ensures that each asset can be easily tracked and distinguished from others. Including photographs or digital images, can also be very helpful. The asset description should be detailed enough to be used in insurance claims.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> Recording of Acquisition Details</h3>
            <p>The register should accurately record the acquisition date, purchase cost, supplier information, and warranty details for each asset. This information is essential for calculating depreciation, tracking asset value, and managing warranty claims. Accurate acquisition details are also required for financial audits.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MapPin size={20} /> Tracking Asset Location and Custodian</h3>
            <p>The register should track the current location of each asset and the individual or department responsible for its custody. This information is crucial for asset accountability and for locating assets when needed. Regular updates to asset location information are essential, especially in organizations with frequent asset movement.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wrench size={20} /> Monitoring Asset Condition and Maintenance History</h3>
            <p>The register should include a record of each asset's condition, including any damage or defects. It should also track the maintenance history of each asset, including scheduled maintenance, repairs, and replacements. This information is essential for preventive maintenance and for assessing the overall health of the asset portfolio. Regular maintenance records are vital for extending the lifespan of the assets.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Calculation and Tracking of Depreciation</h3>
            <p>The register should automatically calculate and track the depreciation of each asset, based on the chosen depreciation method. This information is essential for financial reporting and for determining the net book value of assets. The register should be able to handle different depreciation methods, such as straight-line depreciation or declining balance depreciation.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Integration with Other Systems</h3>
            <p>Ideally, the master asset register should be integrated with other relevant systems, such as accounting software, maintenance management systems, and procurement systems. This integration streamlines data flow and eliminates the need for manual data entry, reducing the risk of errors.</p>
          </div>
        </section>

        {/* ========== SECTION 3: LIST OF OBSOLETE ITEMS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>List of Obsolete Items</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Identifying and documenting obsolete assets is a critical aspect of effective asset management. Obsolete items, whether due to technological advancements, changes in business needs, or physical deterioration, represent a drain on resources and can clutter valuable space. Producing a list of obsolete items enables organizations to make informed decisions about disposal, minimize losses, and optimize asset utilization.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Regular Asset Audits and Inspections</h3>
            <p>Conducting regular asset audits and inspections is essential for identifying obsolete items. This involves physically inspecting assets, reviewing usage records, and assessing their condition. Audits should be scheduled regularly and performed by trained personnel.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Analysis of Usage and Performance Data</h3>
            <p>Analysing asset usage and performance data can help to identify items that are no longer being used or that are performing poorly. This may involve reviewing maintenance records, usage reports, and performance metrics. This data analysis can be performed by the asset management software.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Collaboration with Relevant Departments</h3>
            <p>Collaboration with relevant departments, such as IT, operations, and finance, is essential for identifying obsolete items. These departments can provide insights into changes in technology, business needs, and asset utilization. This collaboration ensures that all relevant factors are considered.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Documentation of Obsolete Items</h3>
            <p>Once obsolete items are identified, they should be documented in a comprehensive list. This list should include detailed information about each item, such as its description, identification number, acquisition date, and reason for obsolescence. Photographs should also be included.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Evaluation of Disposal Options</h3>
            <p>The list of obsolete items should be used to evaluate disposal options, such as sale, donation, recycling, or disposal. This evaluation should consider the potential value of the items, the costs of disposal, and any environmental or regulatory requirements.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regular Updates and Reviews</h3>
            <p>The list of obsolete items should be regularly updated and reviewed to ensure that it remains current. This involves adding new items as they become obsolete and removing items that have been disposed of.</p>
          </div>
        </section>

        {/* ========== SECTION 4: ASSET SERIAL NUMBERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Asset Serial Numbers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The inclusion of asset serial numbers within the master asset register is a fundamental practice for robust asset management. Serial numbers provide a unique identifier for each individual asset, enabling precise tracking, verification, and accountability. This level of detail is critical for preventing misidentification, facilitating accurate audits, and ensuring the integrity of asset records. Without serial numbers, distinguishing between similar assets becomes challenging, leading to potential errors and inefficiencies.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hash size={20} /> Unique Asset Identification</h3>
            <p>Serial numbers serve as a unique fingerprint for each asset. They allow for the unambiguous identification of individual items, even when multiple assets of the same model or type exist. This is particularly crucial for assets that are prone to theft or misplacement. The serial number provides proof of ownership, and aids in police reports if an item is stolen.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MapPin size={20} /> Accurate Asset Tracking</h3>
            <p>By linking serial numbers to specific asset records, organizations can accurately track the movement and location of individual assets. This is essential for inventory control, maintenance scheduling, and asset audits. If an asset is moved between locations, the serial number can be used to update the asset register.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Search size={20} /> Facilitation of Asset Audits</h3>
            <p>During asset audits, serial numbers are invaluable for verifying the physical presence and condition of assets. Auditors can use serial numbers to cross-reference physical assets with the records in the asset register, ensuring accuracy and completeness. This verification process is vital for maintaining the integrity of financial records and demonstrating compliance with regulatory requirements.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wrench size={20} /> Maintenance and Repair Tracking</h3>
            <p>Serial numbers enable the tracking of maintenance and repair history for individual assets. This information is crucial for preventive maintenance, troubleshooting, and assessing the overall health of the asset portfolio. By tracking maintenance by serial number, it is possible to identify assets that require excessive maintenance and determine if they should be replaced.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Warranty and Insurance Claims</h3>
            <p>Serial numbers are often required for warranty and insurance claims. They provide proof of purchase and enable manufacturers and insurers to identify specific assets. This is particularly important for high-value assets or those with extended warranties.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Data Integrity and Accuracy</h3>
            <p>Including serial numbers in the asset register enhances data integrity and accuracy. It reduces the risk of errors associated with manual data entry and ensures that asset records are reliable and consistent. The asset management software should have a field dedicated to the serial number.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Standardization and Consistency</h3>
            <p>Using serial numbers promotes standardization and consistency in asset management practices. This ensures that all assets are tracked and managed in a uniform manner, regardless of their type or location.</p>
          </div>
        </section>

        {/* ========== SECTION 5: ASSETS WITHOUT SERIAL NUMBERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Assets Without Serial Numbers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>In asset management, comprehensive tracking is paramount. While manufacturer-assigned serial numbers provide a definitive identifier for most assets, there are instances where such numbers are absent. This could be due to the nature of the asset (e.g., custom-built equipment), its age (pre-dating widespread serial number usage), or internal manufacturing processes. In these scenarios, assigning institutional numbers becomes a crucial practice to ensure that every asset, irrespective of its origin, is meticulously recorded and tracked within the master asset register. This practice is not simply a matter of record-keeping; it is a fundamental step in maintaining accountability, facilitating accurate audits, and ensuring the overall integrity of the asset management system.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Ensuring Complete Asset Tracking and Accountability</h3>
            <p>The primary purpose of assigning institutional numbers is to guarantee that every asset, regardless of its lack of a manufacturer serial number, is incorporated into the asset register. This eliminates any gaps in asset tracking, ensuring that all organizational resources are accounted for. Without institutional numbers, assets that lack serial numbers would effectively exist outside the formal tracking system, leading to potential losses, misplacement, and difficulties in conducting audits. This complete tracking ensures that responsible individuals or departments are identified for each asset and helps facilitate asset allocation.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hash size={20} /> Maintaining Uniqueness and Clarity for Accurate Identification</h3>
            <p>Institutional numbers must be unique to each individual asset to prevent confusion and ensure accurate identification. Organizations must establish a clear and consistent numbering system to maintain uniformity and prevent duplication. This system should be documented and communicated to all relevant personnel to ensure consistent application. The numbering system should be designed to be easy to understand and use, minimizing the risk of errors during data entry and retrieval. A well-designed system will also allow for the easy identification of asset types.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Search size={20} /> Facilitating Internal Audits and Verification Processes</h3>
            <p>Like manufacturer serial numbers, institutional numbers play a vital role in facilitating internal audits and verification processes. Auditors can use these numbers to cross-reference physical assets with the records in the asset register, ensuring the accuracy and completeness of asset data. This verification process is crucial for maintaining the integrity of financial records and demonstrating compliance with regulatory requirements. During audits, the physical asset can be matched to the register entry, using the institutional number.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wrench size={20} /> Supporting Maintenance and Repair Records for Effective Asset Management</h3>
            <p>Institutional numbers enable the tracking of maintenance and repair history for assets that lack manufacturer serial numbers. This information is invaluable for preventive maintenance, troubleshooting, and assessing the overall condition of these assets. By maintaining detailed maintenance records linked to institutional numbers, organizations can make informed decisions about asset repair, replacement, and lifecycle management. This data also helps to identify trends in asset performance.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Establishing a Standardized System for Consistent Asset Management</h3>
            <p>Implementing a standardized system for assigning institutional numbers ensures consistency and efficiency in asset management practices. This system should be documented and communicated to all relevant personnel, ensuring that all assets are tracked and managed in a uniform manner, regardless of their type or location. A standardized system simplifies data entry, retrieval, and reporting, reducing the risk of errors and improving overall asset management efficiency. This standardization also helps make training new employees easier.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Tag size={20} /> Physical Labelling of Assets for Easy Identification and Verification</h3>
            <p>After assigning institutional numbers, it is essential to physically label the assets with these numbers. This ensures that the numbers are readily visible and accessible during audits, inspections, and maintenance activities. Durable labels should be used to withstand environmental conditions and prevent damage or fading. The placement of the label should be consistent, and easily visible. This physical labelling is a vital step in ensuring that the institutional numbers are effectively utilized for asset tracking and management.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Link size={20} /> Integration with Asset Management Systems for Seamless Data Management</h3>
            <p>Asset management systems should be configured to accommodate institutional numbers, ensuring that these numbers are properly recorded and tracked alongside manufacturer serial numbers. The software should allow for easy searching, filtering, and reporting of assets based on institutional numbers. This integration streamlines data management, eliminates manual data entry, and reduces the risk of errors. The system should also allow for the generation of reports, that show all assets that have institutional numbers.</p>
          </div>
        </section>

        {/* ========== SECTION 6: ASSET RETURN - BI-ANNUAL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Asset Return - Compiling Bi-Annually</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The compilation of an asset return report on a bi-annual basis is a vital practice for organizations to maintain control and accountability over their valuable resources. This report, generated twice a year, provides a comprehensive overview of asset movements, usage, and condition, enabling management to identify discrepancies, track asset lifecycles, and make informed decisions about asset allocation and maintenance. It is not merely a routine data aggregation; it is a strategic tool that facilitates proactive asset management, minimizes losses, and ensures compliance with internal policies and regulatory requirements.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Comprehensive Asset Movement and Usage Tracking</h3>
            <p>The bi-annual asset return report should meticulously document all asset movements and usage patterns during the reporting period. This includes details of asset transfers between departments or locations, loaning of assets to employees, and any changes in asset status (e.g., in use, under repair, out of service). By tracking these movements, organizations gain valuable insights into asset utilization, identify potential bottlenecks, and ensure that assets are being used efficiently. This tracking aids in identifying assets that are underutilized, or assets that are being used in ways that are against company policy. This comprehensive overview helps to prevent asset misplacement and unauthorized use.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Verification of Asset Condition and Location</h3>
            <p>The report should include a verification of the physical condition and location of each asset. This may involve physical inspections or audits to ensure that the assets are in good working order and are located as recorded in the asset register. This verification process helps to identify damaged or missing assets, allowing organizations to take timely action to address any issues. Regular condition checks can also help to identify assets that require maintenance or repair, preventing costly breakdowns and extending asset lifecycles. The verification of the location also prevents the loss of assets.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Identification of Discrepancies and Anomalies</h3>
            <p>A key function of the bi-annual asset return report is to identify any discrepancies or anomalies between the recorded asset data and the actual physical assets. This may include differences in asset quantities, locations, or conditions. Identifying these discrepancies allows organizations to investigate the root causes and implement corrective actions to prevent future occurrences. This process also helps to identify potential instances of theft or fraud. The report should highlight any discrepancies that were found.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Assessment of Asset Lifecycles and Depreciation</h3>
            <p>The report should provide an assessment of asset lifecycles and depreciation. This includes reviewing the age of assets, their maintenance history, and their current market value. This assessment helps organizations to make informed decisions about asset replacement and disposal. It also provides valuable data for financial reporting and budgeting purposes. The report can also be used to predict future asset replacement costs.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Compliance with Internal Policies and Regulatory Requirements</h3>
            <p>The bi-annual asset return report serves as a crucial tool for ensuring compliance with internal asset management policies and regulatory requirements. This includes documenting asset movements, usage, and condition in accordance with established standards. The report also provides an audit trail that can be used to demonstrate compliance during internal or external audits. Compliance with regulations, is vital to avoid fines.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Informed Decision-Making for Asset Management</h3>
            <p>The information contained in the bi-annual asset return report provides valuable data for informed decision-making regarding asset management. This includes decisions about asset procurement, maintenance, repair, and disposal. By analysing the report data, organizations can optimize asset utilization, minimize costs, and improve overall asset management efficiency. The report can be used to justify the purchase of new assets.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Documentation and Record Keeping</h3>
            <p>The bi-annual asset return report should be thoroughly documented and retained in accordance with the organization's record retention policies. This documentation provides a valuable audit trail and ensures that asset data is readily available for future reference. The report should be stored in a secure location, and access to it should be controlled.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 6 — Managing Assets</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Register</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Serial Numbers</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Obsolete Items</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Return</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Institutional Numbers</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Asset Management. 📋💼</p>
        </footer>

      </div>
    </div>
  );
};
