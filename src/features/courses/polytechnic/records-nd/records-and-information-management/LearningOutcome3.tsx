import {
  // 1. Standard Valid Icons (Added Focus, Minimize, Book)
  FolderTree, Hash, Paperclip, Layout, Edit, Target, Shield, ListChecks, Type, 
  BookOpen, Book, Focus, Minimize, FileText, Scissors, Archive, Database, User, 
  Calendar, CheckCircle, Send, ShieldCheck, Bell, RefreshCw, File, Folder, 
  Clipboard, Mail, Lock, Eye, AlertCircle, Trash2, Cloud, Server, HardDrive, 
  Disc, Box, Home, Warehouse, Zap, MapPin, DollarSign, Sun, FireExtinguisher, 
  Bug, Users, Phone, MessageSquare, Headphones, Award, Briefcase, Clock, 
  Coffee, ThumbsUp, HelpCircle, AlertTriangle, Mic, Video, Camera, Share2, 
  Smile, Frown, Meh, TrendingUp, BarChart, PieChart, Inbox, SendToBack, 
  Package, Stamp, Truck, Bookmark, FileCheck, FileSearch, FileWarning, 
  FileX, UserCheck, UserPlus, UserMinus, UserX, Handshake, Heart, Star, 
  Gem, Crown, Building, DoorOpen, Sofa, Paintbrush, Sparkles, Sparkle, 
  Utensils, CupSoda, Cookie, Apple, Wine, PhoneForwarded, PhoneOff, 
  Voicemail, Headset, BadgeCheck, Trophy, Medal, Microscope, FlaskRound, ThumbsDown,
  Beaker, TestTube, Thermometer, Droplet, Lightbulb, Fan, Wrench, Hammer, 
  Drill, Recycle, Leaf, Flower, BookMarked, Library, PanelTop, Scan, 
  Fingerprint, KeyRound, Siren, Flame, Waves,

  // 2. Fixes for names used in your JSX (Suffix Aliases)
  Search as SearchIcon,
  Clock as ClockIcon,
  HardDrive as HardDriveIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Circle as CircleIcon,
  Scissors as ScissorsIcon,
  Award as AwardIcon,

  // 3. Replacements for Brand Icons (Removed from Lucide)
  Globe as Twitter,
  Camera as Instagram,
  Briefcase as Linkedin,
  Share2 as Facebook,
  Video as Youtube,

  // 4. Replacements for Missing Object Icons
  Scissors as Comb,
  User as Shirt,
  MapPin as Shoe,
  Wrench as Saw,
  Leaf as Tree
} from 'lucide-react';

import React from 'react';

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

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

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
              Records & Information Management: Module LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Records Inventory & <span className="text-purple-300 font-bold italic">Information Assets</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to records inventory purpose, advantages, disadvantages, methods, worksheet elements, and applications.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">records_inventory.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">INVENTORY</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">CLASSIFY</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MANAGE</span><span className="text-white">Information;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Database className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Clipboard className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: RECORDS INVENTORY ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Inventory</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A records inventory: is a comprehensive list or catalog of an organization's records, regardless of format (paper or digital). It provides detailed information about each record series, including its location, content, format, retention period, and responsible department. Essentially, it's like a detailed map of all the information an organization holds.</p>
          </div>
        </section>

        {/* ========== SECTION 2: JUSTIFICATION OF THE PURPOSE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Justification of the Purpose of a Records Inventory</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The purpose of a records inventory: is multifaceted, serving as the foundation for effective records management and information governance.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Identification and Control</h3>
            <p>A records inventory enables organizations to identify and control all of their records, ensuring that they are managed consistently and efficiently. Without a comprehensive inventory, records can become scattered, lost, or mismanaged, leading to inefficiencies and risks. It is the first step in organizing and controlling all of a companies documents.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Compliance and Risk Management</h3>
            <p>By identifying and documenting retention periods, a records inventory helps organizations comply with legal and regulatory requirements. It also facilitates risk management by ensuring that vital records are protected and that obsolete records are disposed of properly. This helps avoid legal problems, and data leaks.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Information Governance</h3>
            <p>A records inventory is a crucial component of information governance, providing a foundation for developing and implementing records management policies and procedures. It enables organizations to understand their information assets and make informed decisions about their management. This provides a framework for the companies informational assets.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Operational Efficiency</h3>
            <p>A well-maintained records inventory improves operational efficiency by facilitating quick and easy access to information. This can save time and resources, reducing the need to search for lost or misplaced records. It is a time saver.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> Disaster Recovery</h3>
            <p>In the event of a disaster, a records inventory can be invaluable in recovering and restoring critical records. It provides a roadmap for identifying and prioritizing records for recovery. This is a life saver in case of a disaster.</p>
          </div>
        </section>

        {/* ========== SECTION 3: ADVANTAGES AND DISADVANTAGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Advantages and Disadvantages of a Records Inventory</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Advantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Improved Records Management:</strong> A records inventory provides a comprehensive overview of an organization's records, enabling effective management and control. This leads to better organization, and less lost documents.</li>
              <li><strong>Enhanced Compliance:</strong> By identifying and documenting retention periods, a records inventory helps organizations comply with legal and regulatory requirements. This helps prevent legal problems.</li>
              <li><strong>Increased Efficiency:</strong> A records inventory facilitates quick and easy access to information, improving operational efficiency. This makes it easier to find documents.</li>
              <li><strong>Reduced Storage Costs:</strong> By identifying and disposing of obsolete records, a records inventory can help reduce storage costs. This saves the company money.</li>
              <li><strong>Better Risk Management:</strong> It helps to protect vital records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsDown size={20} /> Disadvantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Time and Resource Intensive:</strong> Creating and maintaining a records inventory can be time-consuming and resource-intensive, requiring significant effort from staff. This takes a lot of time.</li>
              <li><strong>Potential for Inaccuracy:</strong> If not conducted carefully, a records inventory can be inaccurate, leading to errors in records management. If it is not done correctly, it is useless.</li>
              <li><strong>Maintenance Challenges:</strong> Maintaining an up-to-date records inventory can be challenging, particularly in organizations with high volumes of records or frequent changes in record-keeping practices. Keeping it up to date is hard.</li>
              <li><strong>Resistance to Change:</strong> Employees may resist participating in a records inventory, particularly if they are unfamiliar with records management principles. People don't like change.</li>
              <li><strong>Initial Cost:</strong> There is a cost to starting the inventory.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: METHODS OF CONDUCTING RECORDS INVENTORY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Methods of Conducting Records Inventory</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Developing effective inventory procedures: requires choosing the right method to gather information about an organization's records. Here are some common methods:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Folder size={20} /> Physical Inventory (Manual Tally)</h3>
            <p>This involves physically examining each record and recording its details on an inventory worksheet. This method is suitable for smaller organizations or departments with limited records.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Interviews and Questionnaires</h3>
            <p>This method involves interviewing staff members or distributing questionnaires to gather information about their records. This is useful for understanding record-keeping practices and identifying records that may not be readily apparent.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Review of Existing Documentation</h3>
            <p>This involves reviewing existing documentation, such as file plans, retention schedules, and policy manuals, to gather information about records. This method is useful for identifying records that are already documented.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Electronic Inventory (Automated Scanning/Crawling)</h3>
            <p>This method involves using software tools to automatically scan or crawl electronic systems, such as file servers and databases, to identify and document records. This is efficient for large volumes of electronic records.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Combination Approach</h3>
            <p>Often, a combination of these methods is used to create a comprehensive records inventory. For example, a physical inventory may be combined with interviews and a review of existing documentation.</p>
          </div>
        </section>

        {/* ========== SECTION 5: ELEMENTS OF AN INVENTORY WORKSHEET ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Elements of an Inventory Worksheet</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>An inventory worksheet: is a crucial tool for documenting the details of each record series. Here are the key elements:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Record Series Title:</strong> A clear and concise title that accurately describes the content of the record series. This helps to identify the records quickly.</li>
              <li><strong>Record Series Description:</strong> A detailed description of the content, purpose, and function of the record series. This provides context and helps to understand the significance of the records.</li>
              <li><strong>Record Format:</strong> The physical or electronic format of the records, such as paper, electronic files, microfilm, or audio recordings. This helps to determine storage and preservation requirements.</li>
              <li><strong>Record Location:</strong> The physical or electronic location of the records, such as a file cabinet, server, or database. This helps to locate the records quickly.</li>
              <li><strong>Record Dates:</strong> The date range of the records, such as the earliest and latest dates of the records in the series. This helps to determine the age and relevance of the records.</li>
              <li><strong>Retention Period:</strong> The length of time that the records must be retained, as specified by legal, regulatory, or organizational requirements. This helps to ensure compliance and proper disposal.</li>
              <li><strong>Responsible Department/Individual:</strong> The department or individual responsible for the creation, maintenance, and use of the records. This helps to assign accountability and ensure proper management.</li>
              <li><strong>Access Restrictions:</strong> Any restrictions on access to the records, such as confidentiality or security requirements. This helps to protect sensitive information.</li>
              <li><strong>Volume/Quantity:</strong> The amount of records, such as number of boxes, files, or gigabytes. This helps to determine storage space and resources.</li>
              <li><strong>Disposal Instructions:</strong> How the records are to be disposed of, once the retention period has ended.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: DEVELOPING A LIST OF RECORDS AND EQUIPMENT INVENTORY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Developing a List of Records and Equipment Inventory</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Creating a comprehensive list of records and equipment: involves a systematic approach to identify, document, and organize these assets. Here's a breakdown of how to develop such a list:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> 1. Planning and Preparation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Define the Scope:</strong> Clearly define the scope of the inventory. Determine which departments, locations, and types of records and equipment will be included. This prevents the list from becoming overwhelming.</li>
              <li><strong>Establish a Team:</strong> Form a team responsible for conducting the inventory. Assign roles and responsibilities to ensure accountability.</li>
              <li><strong>Develop Inventory Forms/Templates:</strong> Create standardized forms or templates to capture consistent information about each record and piece of equipment. This ensures uniformity and facilitates data analysis.</li>
              <li><strong>Determine Data Fields:</strong> Decide what information will be recorded for each item. For records, this may include title, date range, format, location, retention period, and responsible department. For equipment, it may include make, model, serial number, location, condition, and purchase date.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> 2. Conducting the Inventory</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Records Inventory:</strong></li>
              <li><strong>Physical Inventory:</strong> Conduct a physical walkthrough of all locations where records are stored. Examine file cabinets, storage boxes, and electronic storage devices.</li>
              <li><strong>Interviews:</strong> Interview staff members to gather information about records they create, use, and maintain.</li>
              <li><strong>Review Existing Documentation:</strong> Review existing file plans, retention schedules, and policy manuals to identify records.</li>
              <li><strong>Electronic Inventory:</strong> Use software to scan servers and computers for digital records.</li>
              <li><strong>Record the Data:</strong> Accurately record the data for each record on the inventory forms or templates.</li>
              <li><strong>Equipment Inventory:</strong></li>
              <li><strong>Physical Inspection:</strong> Conduct a physical inspection of all equipment in each location.</li>
              <li><strong>Record Equipment Details:</strong> Record the make, model, serial number, location, condition, and any other relevant details for each piece of equipment.</li>
              <li><strong>Photograph Equipment (Optional):</strong> Take photographs of equipment to provide visual documentation. This can be helpful for identification and condition assessment.</li>
              <li><strong>Verify Information:</strong> If possible, verify equipment details against purchase orders or other records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> 3. Organizing and Managing the Inventory</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Centralized Database:</strong> Enter the data from the inventory forms into a centralized database or spreadsheet. This facilitates data analysis and reporting.</li>
              <li><strong>Categorization and Classification:</strong> Categorize and classify records and equipment based on their type, function, or other relevant criteria. This facilitates organization and retrieval.</li>
              <li><strong>Regular Updates:</strong> Establish a process for regularly updating the inventory to reflect changes in records and equipment.</li>
              <li><strong>Secure Storage:</strong> Store the inventory data securely, with appropriate access controls.</li>
              <li><strong>Use Inventory Software:</strong> Consider using inventory software to streamline the process.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: APPLICATIONS OF RECORDS INVENTORY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applications of records inventory</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Records Retention and Disposal:</strong> A records inventory enables organizations to implement accurate retention schedules. By documenting the retention period for each record series, organizations can ensure that records are retained for the required duration and disposed of properly when they are no longer needed. This helps to minimize storage costs and reduce legal risks associated with retaining obsolete records. This allows a company to follow the rules about how long to keep records, and when to get rid of them.</li>
              <li><strong>Compliance with Legal and Regulatory Requirements:</strong> Many industries and jurisdictions have specific legal and regulatory requirements for records management. A records inventory helps organizations identify and track records that are subject to these requirements, ensuring compliance and minimizing the risk of penalties or legal action. This helps a company follow the law.</li>
              <li><strong>Information Governance:</strong> A records inventory is a foundational component of effective information governance. It provides a comprehensive overview of an organization's information assets, enabling informed decision-making about records management policies and procedures. It helps to ensure that information is managed consistently and efficiently across the organization. This provides a framework for how a company manages all of its information.</li>
              <li><strong>Risk Management:</strong> By identifying and documenting vital records, a records inventory helps organizations mitigate risks associated with data loss or damage. In the event of a disaster, the inventory can be used to prioritize the recovery of critical records, minimizing business disruption. This helps to protect important information from being lost.</li>
              <li><strong>Operational Efficiency:</strong> A well-maintained records inventory facilitates quick and easy access to information, improving operational efficiency. Employees can locate the records they need quickly, saving time and resources. This makes it faster to find documents.</li>
              <li><strong>Space Management and Cost Reduction:</strong> By identifying and disposing of obsolete records, a records inventory can help organizations reduce storage costs and free up valuable space. This is particularly important for organizations with large volumes of paper records. This saves money on storage.</li>
              <li><strong>Audit and Litigation Support:</strong> A records inventory provides a reliable source of information for internal and external audits. It can also be used to locate and retrieve records required for legal proceedings or investigations. This helps when a company has to prove something, or is being investigated.</li>
              <li><strong>Information Security:</strong> By documenting the location and access restrictions for sensitive records, a records inventory helps organizations implement appropriate security measures to protect confidential information. This helps to keep private information safe.</li>
              <li><strong>Disaster Recovery Planning:</strong> A well created records inventory will greatly aid in the creation of a disaster recovery plan, by identifying the most important documents to recover.</li>
              <li><strong>Mergers and Acquisitions:</strong> When companies merge or acquire other companies, a record inventory is very useful in combining the records of both companies.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Records Inventory & Information Assets</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inventory Purpose</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Advantages & Disadvantages</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Worksheet Elements</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Applications</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Inventory. Organize. Control. Manage. 📋🗂️</p>
        </footer>

      </div>
    </div>
  );
};