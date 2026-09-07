import React from 'react';
import {
  FolderTree, Hash, Paperclip, SearchIcon, ClockIcon, Layout, HardDriveIcon, Edit, Target, GlobeIcon, Shield, ListChecks, SettingsIcon, Type, BookOpen, LayersIcon, FileText, Scissors, CircleIcon, Archive, Database,
  Cpu, Bot, Zap, CheckCircle, XCircle, User, Workflow, ShieldCheck, Server, Cloud, DollarSign, TrendingUp, AlertTriangle, Scale, BarChart,
  Lightbulb, Puzzle, PieChart, FileSearch, Users, Eye, PenTool, BookMarked, GitBranch, Pointer, ClipboardList, ClipboardCheck, UsersRound, Microscope, Network, ArrowRightCircle, Repeat,
  Truck, Factory, Warehouse, Ship, Plane, Briefcase, Handshake, Building,Leaf, Flag, Coins, Box, FileCheck, Clipboard, Receipt, Package, TruckIcon, PlaneIcon
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
              Specifying Requirements in <span className="text-sky-300 font-bold italic">International Purchasing</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to specifying requirements, quality standards, certifications, transport modes, clearing and forwarding, and essential documentation in international purchasing.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">procurement_specs.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">SPECIFY</span><span className="text-white">Requirements;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">VERIFY</span><span className="text-white">Quality_Standards;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CLEAR</span><span className="text-white">Customs;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><ClipboardList className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Ship className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">

        {/* ========== SECTION 1: INTRODUCTION ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Methods of Specifying Requirements in International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Specifying requirements in international purchasing is crucial for ensuring that the goods and services received meet the buyer's exact needs. Clear and comprehensive specifications minimize misunderstandings, reduce the risk of receiving non-conforming products, and facilitate effective communication with overseas suppliers. These specifications act as the foundation of the purchase agreement, outlining what is expected and providing a basis for quality control and dispute resolution.</p>
          </div>
        </section>

        {/* ========== SECTION 2: DETAILED PRODUCT SPECIFICATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Detailed Product Specifications</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>This involves providing precise descriptions of the product's physical characteristics, technical specifications, performance requirements, and any other relevant details. For example, if purchasing electronic components, the specifications might include dimensions, voltage ratings, material composition, and performance tolerances. If buying textiles, specifications could include thread count, fabric composition, and color matching details. These detailed specifications are vital to avoid ambiguity and ensure the supplier understands the exact product required. Using diagrams, technical drawings, or even physical samples can greatly aid in clearly communicating these details. The more precise the specifications, the less room there is for error or misinterpretation.</p>
          </div>
        </section>

        {/* ========== SECTION 3: QUALITY STANDARDS AND CERTIFICATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Quality Standards and Certifications</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Specifying internationally recognized quality standards and certifications is essential for ensuring product quality and safety. Standards such as ISO 9001 (quality management) or ISO 14001 (environmental management) provide a framework for quality assurance. Requiring suppliers to provide certificates of compliance with these standards demonstrates their commitment to quality. For example, a buyer might require that all food products meet specific food safety standards, such as HACCP or FDA regulations. Specifying these standards ensures that the products meet regulatory requirements and consumer expectations. Also, requesting samples from the supplier to test if they meet required standards is a good way to ensure quality.</p>
          </div>
        </section>

        {/* ========== SECTION 4: PERFORMANCE REQUIREMENTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Performance Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Instead of just describing the product, specify how it should perform in its intended application. This allows suppliers to propose solutions that meet the required performance criteria, even if they differ from the buyer's initial design. For instance, instead of specifying the exact material for a machine part, the buyer might specify the required strength, durability, and temperature resistance. This approach gives suppliers flexibility in their manufacturing process while still ensuring that the final product meets the necessary performance standards. Performance requirements focus on the outcome rather than the precise method of achieving it.</p>
          </div>
        </section>

        {/* ========== SECTION 5: PACKAGING AND LABELLING REQUIREMENTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Packaging and Labelling Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Clearly specifying packaging and labelling requirements is crucial for protecting goods during transit and ensuring compliance with import regulations. This includes specifying the type of packaging materials, dimensions, weight limits, and labelling information. For example, if purchasing fragile items, the buyer might require specific protective packaging to prevent damage during shipping. Labelling requirements might include country of origin, product information, and any required safety warnings. Properly specified packaging and labelling prevents damage and ensures smooth customs clearance.</p>
          </div>
        </section>

        {/* ========== SECTION 6: INSPECTION AND TESTING PROCEDURES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Inspection and Testing Procedures</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Defining inspection and testing procedures ensures that the products are inspected and tested according to agreed-upon standards. This might involve specifying the type of inspections, the frequency of inspections, and the testing methods to be used. For example, a buyer might require pre-shipment inspections by a third-party inspection agency. Specifying these procedures ensures that any defects or non conformities are identified before the goods are shipped, minimizing the risk of receiving substandard products. Also, defining who will pay for the inspections is very important.</p>
          </div>
        </section>

        {/* ========== SECTION 7: DELIVERY AND LOGISTICS REQUIREMENTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Delivery and Logistics Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Specifying delivery and logistics requirements ensures that the goods are delivered on time and in good condition. This includes specifying the delivery location, delivery dates, shipping terms (Incoterms), and any special handling requirements. For example, a buyer might specify that the goods must be delivered to a specific warehouse within a certain timeframe. Specifying these requirements helps to avoid delays and ensures that the goods are received in a timely manner. Also, specifying how the goods are to be stored during transport, and at the receiving warehouse are extremely important.</p>
          </div>
        </section>

        {/* ========== SECTION 8: COMMUNICATION AND DOCUMENTATION REQUIREMENTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Communication and Documentation Requirements</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Clear communication and documentation are essential for successful international purchasing. This involves specifying the language of communication, the required documentation (e.g., invoices, packing lists, certificates of origin), and the methods of communication (e.g., email, online portals). For example, a buyer might require that all communication be in English and that all documents be provided in electronic format. Specifying these requirements ensures that there is a clear record of all transactions and that communication is efficient and effective. Also, making sure that all documents are using the correct version of incoterms is important.</p>
          </div>
        </section>

        {/* ========== SECTION 9: THE ROLE OF STANDARDS IN INTERNATIONAL TRADE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Role of Standards in International Trade</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Standards serve as benchmarks that define the characteristics of products, services, and processes. They promote quality, safety, and efficiency, reducing technical barriers to trade. In the context of international purchasing, standards ensure that buyers and sellers have a shared understanding of product requirements, regardless of their location. This standardization is extremely important in avoiding disputes. Without these standards, it would be extremely difficult to ensure that a product made in one country would work in another.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Flag size={20} /> National Standards</h3>
            <p>National standards are developed and adopted by individual countries to address specific domestic needs and regulations. These standards may vary significantly from country to country, reflecting differences in local conditions, cultural preferences, and regulatory requirements. For example, the American National Standards Institute (ANSI) develops and publishes standards for the United States, while the British Standards Institution (BSI) does the same for the United Kingdom. National standards often reflect the specific needs and industries of a particular nation.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> International Standards (ISO)</h3>
            <p>The International Organization for Standardization (ISO) is an independent, non-governmental, international organization that develops and publishes international standards. ISO standards provide a globally recognized framework for ensuring quality, safety, and efficiency across a wide range of industries. They facilitate international trade by reducing technical barriers and promoting consistency. ISO standards are developed through a consensus-based process involving experts from around the world, ensuring that they reflect best practices and global needs. ISO standards allow a company to more easily export their goods, as they are following a standard that is followed by many different countries.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> ISO 9001: Quality Management Systems</h3>
            <p>ISO 9001 is one of the most widely recognized ISO standards, specifying requirements for a quality management system (QMS). It provides a framework for organizations to consistently provide products and services that meet customer and regulatory requirements. In international purchasing, requiring suppliers to be ISO 9001 certified demonstrates their commitment to quality and helps to ensure that products meet specified requirements. This certification gives a company a strong selling point, and shows that they are dedicated to quality.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> ISO 14001: Environmental Management Systems</h3>
            <p>ISO 14001 specifies requirements for an environmental management system (EMS). It helps organizations to minimize their environmental impact and comply with environmental regulations. In international purchasing, requiring suppliers to be ISO 14001 certified demonstrates their commitment to environmental sustainability. This standard is becoming increasingly important as consumers and businesses become more aware of environmental issues.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> ISO 27001: Information Security Management Systems</h3>
            <p>ISO 27001 specifies requirements for an information security management system (ISMS). It helps organizations to protect their information assets and manage information security risks. In international purchasing, this standard is important for protecting sensitive information shared with suppliers, such as product designs and customer data. With the increase of cyber crime, this standard is more important than ever.</p>
          </div>
        </section>

        {/* ========== SECTION 10: BENEFITS OF USING ISO STANDARDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Benefits of Using ISO Standards in International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Using ISO standards in international purchasing provides numerous benefits, including improved product quality, reduced risk of non conformance, enhanced supplier credibility, and increased efficiency. ISO standards facilitate communication and understanding between buyers and sellers, reducing the potential for misunderstandings and disputes. They also help to ensure that products meet regulatory requirements and customer expectations, enhancing customer satisfaction and building trust. Also, when a company follows ISO standards, it can increase their efficiency, and lower the amount of waste that their company produces.</p>
          </div>
        </section>

        {/* ========== SECTION 11: METHODS OF CERTIFYING THE QUALITY OF GOODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Methods Of Certifying The Quality Of Goods For International Markets</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Third-Party Inspection Agencies</h3>
            <p>Engaging independent third-party inspection agencies is a common method of certifying product quality. These agencies conduct inspections and tests at various stages of production, from raw materials to finished goods, to ensure compliance with specified standards. They provide impartial reports that document the inspection results, giving buyers confidence in the quality of the goods. For example, agencies like SGS or Bureau Veritas offer a wide range of inspection services, including pre-shipment inspections, during production inspections, and final inspections. These agencies provide an unbiased evaluation of the product, and are used by many different companies.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Certificates of Analysis (COA)</h3>
            <p>A Certificate of Analysis (COA) is a document issued by a manufacturer or an independent laboratory that certifies the chemical composition, physical properties, and other relevant characteristics of a product. COAs are commonly used in industries such as pharmaceuticals, chemicals, and food processing. They provide detailed information about the product's quality, enabling buyers to verify that it meets their specifications. These certificates are crucial for ensuring that the product meets the required quality and purity standards.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> ISO Certifications</h3>
            <p>As mentioned earlier, ISO certifications, such as ISO 9001 (quality management) and ISO 14001 (environmental management), are widely recognized and respected in international markets. These certifications demonstrate that a manufacturer has implemented a robust quality management system or environmental management system, providing assurance to buyers that their products meet high standards. ISO certifications are a very strong indicator of a company's commitment to quality.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Product-Specific Certifications</h3>
            <p>Many industries have specific certifications that demonstrate compliance with industry standards and regulations. For example, CE marking is required for products sold in the European Economic Area (EEA), indicating that they meet EU safety, health, and environmental requirements. UL certification is common for electrical products sold in North America, demonstrating that they meet safety standards. These product-specific certifications are vital for ensuring that products meet the regulatory requirements of specific markets.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Supplier Audits</h3>
            <p>Conducting supplier audits involves visiting the supplier's facilities to assess their production processes, quality control systems, and compliance with ethical and environmental standards. Supplier audits provide first-hand insight into the supplier's capabilities and commitment to quality. These audits allow buyers to evaluate the supplier's operations and identify any potential risks or areas for improvement.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Microscope size={20} /> Testing Laboratories</h3>
            <p>Utilizing accredited testing laboratories to verify product quality is another important method. These laboratories conduct tests according to recognized standards, providing objective data on product performance and compliance. For example, testing laboratories can assess the strength, durability, and safety of materials and products. These laboratories provide accurate and reliable data.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Governmental Certifications</h3>
            <p>Many governments have their own certification programs that products must meet before they can be sold within their borders. These programs are often designed to ensure the safety and quality of products that are sold to their citizens. For example, the FDA in the United states, has many different certification programs. These government certifications are mandatory for many products.</p>
          </div>
        </section>

        {/* ========== SECTION 12: SELECTING THE APPROPRIATE INTERNATIONAL MODE OF TRANSPORT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Selecting the appropriate international mode of transport</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Selecting the appropriate international mode of transport is a critical decision in international purchasing, as it directly impacts cost, delivery time, and product integrity. Several factors must be carefully considered to ensure the most efficient and effective transportation solution.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost</h3>
            <p>Cost is a primary consideration in selecting a mode of transport. This includes not only the freight rate but also associated costs such as insurance, customs duties, and handling charges. Sea freight is generally the most cost-effective option for large volumes of goods over long distances, while air freight is typically the most expensive. However, the cost of delays, damage, or lost sales due to slower transit times must also be factored in. For example, if a product is time sensitive, it may make sense to pay the higher cost of air freight. The total cost of transport must be calculated, not just the base freight rate.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClockIcon size={20} /> Delivery Time</h3>
            <p>The urgency of delivery is a crucial factor. Air freight offers the fastest transit times, making it suitable for time-sensitive goods or emergency shipments. Sea freight is the slowest option, while road and rail transport offer intermediate transit times. The required delivery date must be balanced against the cost and other factors. For example, if a company is dealing with perishable goods, air freight may be the only viable option.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Type of Goods</h3>
            <p>The nature of the goods being transported significantly influences the choice of transport mode. Heavy, bulky, or hazardous goods may require specialized transport, such as sea freight or rail transport. Fragile or high-value goods may necessitate air freight or specialized handling. Perishable goods require temperature-controlled transport, which can be provided by refrigerated containers or air freight. The size and shape of the goods also plays a large role.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> Distance and Destination</h3>
            <p>The distance and destination of the shipment are fundamental considerations. Sea freight is ideal for long-distance shipments across oceans, while road and rail transport are more suitable for shorter distances within continents. Air freight can be used for any distance, but it is most cost-effective for long-distance shipments of high-value or time-sensitive goods. The infrastructure of the destination country also plays a large role.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Reliability and Security</h3>
            <p>The reliability and security of the transport mode are essential for ensuring that goods arrive on time and in good condition. Air freight generally offers high reliability and security, while sea freight may be more susceptible to delays and damage. Road and rail transport can vary in reliability depending on the infrastructure and conditions of the route. Insurance is often used to mitigate the risk of loss or damage during transit.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Leaf size={20} /> Environmental Impact</h3>
            <p>Increasingly, businesses are considering the environmental impact of their transport choices. Sea freight generally has a lower carbon footprint per unit of cargo than air freight, while road transport can contribute to traffic congestion and air pollution. Rail transport can be a more environmentally friendly option than road transport, especially for long distances. Companies are attempting to use more environmentally friendly shipping methods.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Regulatory Compliance</h3>
            <p>International transport is subject to various regulations, including customs regulations, safety regulations, and environmental regulations. The chosen mode of transport must comply with all applicable regulations in both the exporting and importing countries. For example, hazardous materials require specialized handling and documentation. The company shipping the goods is responsible for knowing and following all applicable regulations.</p>
          </div>
        </section>

        {/* ========== SECTION 13: CLEARING AND FORWARDING GOODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Clearing and Forwarding Goods from Overseas Suppliers</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Clearing and forwarding goods from overseas suppliers involves a complex set of procedures designed to move goods through customs and into the buyer's possession. This process requires a thorough understanding of customs regulations, documentation requirements, and logistics management. Effective clearing and forwarding ensures that goods are received in a timely and cost-effective manner, minimizing delays and avoiding penalties.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Customs Clearance Procedures</h3>
            <p>Customs clearance is the process of obtaining permission from customs authorities to import goods into a country. This involves submitting required documentation, such as commercial invoices, packing lists, and certificates of origin, and paying any applicable duties and taxes. Customs authorities verify the accuracy of the documentation and inspect the goods to ensure compliance with import regulations. Delays in customs clearance can result in storage fees and other costs, so it is essential to have a clear understanding of the requirements and to work with experienced customs brokers. Customs brokers are experts in customs regulations and can help to streamline the clearance process. They can also assist with obtaining necessary permits and licenses.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Documentation Requirements</h3>
            <p>Accurate and complete documentation is crucial for smooth customs clearance. This includes commercial invoices, packing lists, bills of lading or air waybills, certificates of origin, and any other required permits or licenses. The documentation must be consistent and accurate to avoid delays and penalties. Any discrepancies in the documentation can lead to delays and additional inspections. Electronic documentation is becoming increasingly common, which can help to speed up the clearance process. It is very important to make sure that all documents are filled out correctly.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Truck size={20} /> Freight Forwarding Services</h3>
            <p>Freight forwarders are logistics professionals who arrange the transportation of goods from the supplier's warehouse to the buyer's destination. They coordinate all aspects of the shipment, including booking transportation, arranging customs clearance, and managing warehousing and distribution. Freight forwarders have expertise in international logistics and can help to optimize transportation routes and minimize costs. They can also provide valuable advice on customs regulations and documentation requirements. Using a freight forwarder can greatly simplify the clearing and forwarding process.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Incoterms and Responsibilities</h3>
            <p>Incoterms (International Commercial Terms) define the responsibilities and liabilities of the buyer and seller in international trade transactions. They specify who is responsible for transportation costs, insurance, and customs clearance. Selecting the appropriate Incoterms is essential for avoiding misunderstandings and disputes. For example, under CIF (Cost, Insurance, and Freight), the seller is responsible for arranging transportation and insurance to the port of destination, while under DAP (Delivered at Place), the seller is responsible for delivering the goods to the buyer's specified location. It is extremely important that both parties understand the Incoterms that are used.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Warehouse size={20} /> Warehousing and Distribution</h3>
            <p>Depending on the Incoterms and the buyer's requirements, warehousing and distribution may be necessary. This involves storing the goods in a secure warehouse until they are ready for delivery to the final destination. Freight forwarders can arrange warehousing and distribution services, including inventory management and order fulfilment. Efficient warehousing and distribution are essential for ensuring that goods are delivered to customers on time and in good condition.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Insurance and Risk Management</h3>
            <p>International shipments are subject to various risks, including damage, loss, and theft. Obtaining appropriate insurance coverage is essential for protecting against these risks. Freight forwarders can help to arrange insurance coverage and provide advice on risk management strategies. It is also important to consider the risks associated with currency fluctuations and political instability.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClipboardCheck size={20} /> Compliance and Regulatory Requirements</h3>
            <p>International trade is subject to various compliance and regulatory requirements, including customs regulations, safety regulations, and environmental regulations. It is essential to ensure that all shipments comply with these requirements to avoid penalties and delays. Freight forwarders can help to ensure compliance with all applicable regulations. It is the responsibility of the company importing goods to know, and follow, all applicable rules and regulations.</p>
          </div>
        </section>

        {/* ========== SECTION 14: ARRIVAL NOTIFICATION AND COMPREHENSIVE DOCUMENTATION VERIFICATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Arrival Notification and Comprehensive Documentation Verification</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Upon the physical arrival of a shipment at the designated port of entry, be it a seaport or an airport, a crucial sequence of events is triggered. The freight forwarder or customs broker, acting as the intermediary, receives an official arrival notification. This notification signals the commencement of the clearing process. Immediately following, a meticulous and exhaustive verification of all shipping documents is initiated. This process isn't merely a cursory glance; it's a deep dive into the intricacies of each document. The commercial invoice, serving as the financial record of the transaction, is scrutinized for accuracy in product descriptions, quantities, and declared values. The packing list, detailing the contents of each package, is cross-referenced with the invoice to ensure consistency. The bill of lading (for sea freight) or air waybill (for air freight), acting as the contract of carriage and proof of ownership, is thoroughly checked for correct consignee details and shipment particulars. Additionally, any required certificates of origin, demonstrating the product's country of manufacture, are examined for authenticity. This comprehensive review is not just a formality; it's a critical safeguard against discrepancies that could lead to significant delays, financial penalties, or even confiscation of goods by customs authorities.</p>
          </div>
        </section>

        {/* ========== SECTION 15: DETAILED CUSTOMS ENTRY PREPARATION AND PRECISE DUTY PAYMENT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Detailed Customs Entry Preparation and Precise Duty Payment</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Following the rigorous documentation review, the customs broker undertakes the preparation and submission of the customs entry documents to the relevant customs authorities. This phase involves the intricate process of classifying the goods according to the Harmonized System (HS) code. This internationally standardized numerical classification system is vital, as it precisely determines the applicable import duties and taxes. Accuracy is paramount, as an incorrect HS code can result in substantial financial implications and legal complications. Once the correct HS code is established, the broker meticulously calculates the duties and taxes owed based on the declared value of the goods. Subsequently, the broker arranges for the prompt and accurate payment of these duties and taxes, typically through electronic funds transfer or other approved methods. This step is time-sensitive, as delays in payment can incur penalties and hinder the release of the goods. The precise calculation and timely payment of duties are not merely administrative tasks; they are fundamental to ensuring compliance with customs regulations and facilitating the smooth flow of goods across international borders.</p>
          </div>
        </section>

        {/* ========== SECTION 16: THOROUGH CUSTOMS INSPECTION AND AUTHORITATIVE RELEASE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Thorough Customs Inspection and Authoritative Release</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>While documentation and duty payments are essential, customs authorities often conduct physical inspections of the goods to verify their contents and ensure compliance with import regulations. These inspections are not arbitrary; they are conducted to safeguard national security, protect public health, and prevent illicit trade. Customs officers may examine the goods for prohibited items, verify the declared quantities against the actual contents, and assess the accuracy of the declared value. The level of inspection can vary depending on the type of goods, the country of origin, and the perceived risk. Once the inspection is completed and all requirements are met, customs authorities will issue an official release order, granting permission for the goods to enter the country. This release is a critical milestone, signifying that the goods have passed through the customs barrier and are now eligible for further transport and distribution. The customs inspection is a very important part of a countries border security.</p>
          </div>
        </section>

        {/* ========== SECTION 17: SECURE HANDLING AND STRATEGIC STORAGE OPERATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Secure Handling and Strategic Storage Operations</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Post-customs clearance, the freight forwarder assumes responsibility for the secure handling and strategic storage of the goods. This phase involves the physical movement of the goods from the port of entry to a designated warehouse or directly to the buyer's specified location. The handling process may entail unloading the goods from shipping containers or aircraft, carefully transferring them to appropriate storage areas, and preparing them for subsequent transport. The storage operations are equally critical, as they ensure the goods are protected from damage, theft, or deterioration. The freight forwarder selects appropriate storage facilities, taking into account factors such as the nature of the goods, the required storage conditions, and the duration of storage. Proper handling and storage are not just logistical necessities; they are essential for preserving the quality and integrity of the goods throughout the supply chain.</p>
          </div>
        </section>

        {/* ========== SECTION 18: EFFICIENT INLAND TRANSPORTATION AND ROUTE OPTIMIZATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Efficient Inland Transportation and Route Optimization</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>The freight forwarder orchestrates the inland transportation of the goods from the port of entry to the final destination, employing a combination of transportation modes such as trucks, trains, or barges. The selection of the most efficient and cost-effective transportation route is paramount, taking into account factors such as distance, terrain, traffic conditions, and delivery deadlines. Freight forwarders leverage their expertise and network of carriers to optimize transportation routes and minimize transit times. They also ensure that the goods are properly secured and protected during transit, mitigating the risk of damage or loss. This phase is not just about moving goods; it's about ensuring they reach their destination in a timely, safe, and cost-effective manner.</p>
          </div>
        </section>

        {/* ========== SECTION 19: FINAL DELIVERY AND METICULOUS DOCUMENTATION HANDOVER ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Final Delivery and Meticulous Documentation Handover</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Upon arrival at the final destination, the freight forwarder or delivery service coordinates the delivery of the goods to the buyer's premises. A signed delivery receipt is obtained, serving as proof of delivery and acknowledging the buyer's receipt of the goods. Subsequently, the freight forwarder meticulously compiles and hands over all relevant documentation to the buyer. This includes the customs release documents, the delivery receipt, and any other required paperwork, such as certificates of origin or inspection reports. This documentation is not just a formality; it's essential for accounting, record-keeping, and compliance purposes. It also provides the buyer with a complete audit trail of the shipment, ensuring transparency and accountability.</p>
          </div>
        </section>

        {/* ========== SECTION 20: PROACTIVE TRACKING AND TRANSPARENT COMMUNICATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Proactive Tracking and Transparent Communication</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Throughout the entire clearing and forwarding process, proactive tracking and transparent communication are paramount. Freight forwarders provide real-time updates on the status of the shipment, enabling buyers to monitor its progress and anticipate any potential delays. They also maintain open communication channels, promptly addressing any questions or concerns that may arise. Modern tracking systems, utilizing GPS technology and electronic data interchange (EDI), provide highly accurate and reliable tracking information. This level of transparency and communication is not just a courtesy; it's essential for building trust and ensuring a smooth and efficient clearing and forwarding process.</p>
          </div>
        </section>

        {/* ========== SECTION 21: DOCUMENTS USED IN INTERNATIONAL PURCHASING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Documents Used In International Purchasing</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Receipt size={20} /> Comprehensive Commercial Invoice</h3>
            <p>The commercial invoice stands as the linchpin of any international trade transaction, serving as a legally binding document that outlines the specifics of the sale between the exporter and the importer. Beyond its role as a simple bill of sale, it provides a meticulous breakdown of the goods being traded, encompassing their exact quantities, precise descriptions, unit prices, and the total value of the shipment. This document is indispensable for customs authorities, who rely on it to accurately assess import duties and taxes, ensuring that the declared value of the goods aligns with their market value. Furthermore, the commercial invoice serves as a critical record for both the buyer and the seller, detailing the agreed-upon terms of sale, including payment methods, delivery schedules, and any applicable discounts or special conditions. It acts as a primary source of information for financial record-keeping, dispute resolution, and insurance claims. The accuracy and completeness of the commercial invoice are paramount, as any discrepancies can lead to significant delays in customs clearance, financial penalties, or even legal disputes. Therefore, meticulous attention to detail is essential when preparing this document.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Detailed Packing List</h3>
            <p>The packing list is a vital document that complements the commercial invoice, providing a comprehensive inventory of the goods contained within each shipment. Unlike the invoice, which focuses on the financial aspects of the transaction, the packing list focuses on the physical contents of the shipment. It meticulously details the number of packages, the specific items contained within each package, and the weight and dimensions of each package. This document serves multiple purposes. For customs authorities, it provides a means to verify the accuracy of the shipment's contents and to ensure that they match the information provided in the commercial invoice. For freight forwarders and logistics providers, it facilitates the efficient handling and transportation of the goods, enabling them to optimize storage and loading procedures. Moreover, the packing list is invaluable for the buyer, who can use it to verify that they have received the correct quantities and types of goods as ordered. A well-prepared packing list can significantly reduce the risk of discrepancies, delays, and disputes, streamlining the entire import process.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Ship size={20} /> Bill of Lading/Air Waybill</h3>
            <p>The bill of lading (for sea freight) and the air waybill (for air freight) are fundamental contracts of carriage, serving as legal agreements between the shipper and the carrier. These documents not only act as receipts for the goods but also serve as documents of title, signifying ownership of the goods during transit. The bill of lading, in particular, is a negotiable instrument, meaning that it can be transferred from one party to another, allowing for the transfer of ownership of the goods while they are in transit. These documents are essential for obtaining payment from the buyer, as they serve as proof that the goods have been shipped. They are also crucial for claiming the goods upon arrival at the destination, as they serve as evidence of ownership. Furthermore, these documents provide critical information about the shipment, including the origin and destination, the terms of carriage, and any special handling instructions. They act as a vital link in the chain of custody, ensuring that the goods are transported safely and efficiently.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Flag size={20} /> Certificate of Origin</h3>
            <p>The certificate of origin is a crucial document that certifies the country in which the goods were manufactured, produced, or obtained. This document is essential for customs authorities, who use it to determine the applicable tariffs and to enforce trade agreements. Many countries have preferential trade agreements that offer reduced or eliminated tariffs for goods originating from specific countries. The certificate of origin is used to verify that the goods qualify for these preferential rates. Additionally, it is used by buyers to ensure that they are purchasing goods from the desired country of origin and to comply with any import restrictions or regulations. The accuracy of the certificate of origin is paramount, as any misrepresentation can result in penalties and legal repercussions.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Insurance Certificate</h3>
            <p>The insurance certificate is a vital document that provides proof of insurance coverage for the goods during transit. International shipments are exposed to a wide range of risks, including damage, loss, theft, and natural disasters. The insurance certificate specifies the terms and conditions of the insurance policy, including the coverage amount, the risks covered, and any exclusions or limitations. It provides assurance to both the buyer and the seller that the goods are protected against potential losses during shipment. In the event of damage or loss, the insurance certificate serves as the basis for filing an insurance claim and recovering the value of the goods. Given the inherent risks associated with international trade, insurance is an indispensable safeguard.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Import/Export License</h3>
            <p>Import and export licenses are government-issued documents that authorize the import or export of specific goods. These licenses are required for goods that are subject to import or export restrictions, such as controlled substances, hazardous materials, or certain agricultural products. They are also required for goods that are subject to quotas or other trade restrictions. Import and export licenses are issued by government agencies and are subject to specific conditions and requirements. They serve to ensure compliance with trade regulations and to protect national security and public health. Failure to obtain the necessary licenses can result in penalties, confiscation of goods, and legal action.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileCheck size={20} /> Inspection Certificate</h3>
            <p>Inspection certificates are documents issued by independent inspection agencies that confirm that goods have been inspected and meet specified quality, safety, or performance standards. These certificates are often required for goods that are subject to specific regulations or that are being purchased under contracts that require third-party inspection. They provide assurance to buyers that the goods meet their requirements and comply with applicable standards. Inspection certificates can cover a wide range of inspections, including pre shipment inspections, during-production inspections, and final inspections. They are particularly important for goods that are sensitive to quality or safety issues, such as food products, pharmaceuticals, and industrial equipment.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Specifying Requirements in International Purchasing</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Specifications</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quality Standards</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transport Modes</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clearing & Forwarding</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Documents</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master International Procurement. 📋🌍</p>
        </footer>

      </div>
    </div>
  );
};
