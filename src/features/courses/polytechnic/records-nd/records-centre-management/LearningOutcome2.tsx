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
  Voicemail, Headset, BadgeCheck, Trophy, Medal, Microscope, FlaskRound, 
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

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

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
              Records & Information Management: Module LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Records Centre Administration & <span className="text-sky-300 font-bold italic">Organisational Structure</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to administrative structure, siting factors, organisational models, key personnel, challenges, and solutions.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">records_administration.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">STRUCTURE</span><span className="text-white">Centre;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MANAGE</span><span className="text-white">Personnel;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SOLVE</span><span className="text-white">Challenges;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Layout className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Users className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: FACTORS CONSIDERED WHEN ESTABLISHING AN ADMINISTRATIVE STRUCTURE ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Factors Considered When Establishing an Administrative Structure for a Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Establishing an effective administrative structure for a records centre requires careful consideration of several factors to ensure efficient operations and management.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Organizational Hierarchy:</strong> The administrative structure should align with the overall organizational hierarchy. This ensures clear lines of authority and reporting, facilitating effective communication and decision-making.</li>
              <li><strong>Staffing Levels and Expertise:</strong> The structure should reflect the required staffing levels and expertise needed to manage the records centre's operations. This includes roles for records managers, technicians, and support staff, each with defined responsibilities and qualifications.</li>
              <li><strong>Functional Responsibilities:</strong> The structure should clearly define the functional responsibilities of each unit or department within the records centre. This includes areas such as storage, retrieval, retention, and disposal.</li>
              <li><strong>Communication Channels:</strong> Establish clear communication channels between different units and departments within the records centre, as well as with external stakeholders. This ensures efficient information flow and coordination.</li>
              <li><strong>Technology Integration:</strong> The structure should support the integration of technology into records management processes. This includes roles for managing electronic records, databases, and other technology-related functions.</li>
              <li><strong>Budgetary Control:</strong> The structure should include mechanisms for budgetary control and financial management. This ensures that resources are allocated effectively and that costs are managed efficiently.</li>
              <li><strong>Compliance and Legal Requirements:</strong> The structure should ensure compliance with relevant legal and regulatory requirements. This includes roles for overseeing retention schedules, privacy laws, and other applicable regulations.</li>
              <li><strong>Performance Measurement:</strong> The structure should include mechanisms for measuring and evaluating the performance of the records centre. This allows for continuous improvement and ensures that objectives are being met.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: KEY FACTORS AFFECTING SITING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Key Factors Affecting Siting of a Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The siting of a records centre is a critical decision that can significantly impact its efficiency and effectiveness. Several key factors must be considered.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Accessibility:</strong> The location should be easily accessible to authorized personnel and delivery services. This ensures efficient retrieval and delivery of records.</li>
              <li><strong>Security:</strong> The site should provide adequate security to protect records from unauthorized access, theft, and vandalism. This includes physical security measures and surveillance systems.</li>
              <li><strong>Environmental Conditions:</strong> The location should offer stable environmental conditions, including temperature and humidity control, to prevent deterioration of records.</li>
              <li><strong>Space Availability:</strong> The site should have sufficient space to accommodate current and future storage needs. This includes space for shelving, equipment, and staff.</li>
              <li><strong>Cost:</strong> The cost of the site, including rent, utilities, and maintenance, should be within the organization's budget.</li>
              <li><strong>Disaster Risk:</strong> The site should be located in an area with minimal risk of natural disasters, such as floods, earthquakes, or wildfires.</li>
              <li><strong>Infrastructure:</strong> The site should have adequate infrastructure, including reliable power supply, internet connectivity, and transportation access.</li>
              <li><strong>Proximity to Users:</strong> While records centres store inactive records, reasonable proximity to the organization's main offices can be beneficial for occasional access.</li>
              <li><strong>Expansion Potential:</strong> The location should offer potential for future expansion to accommodate growing records storage needs.</li>
              <li><strong>Zoning and Regulations:</strong> The site should comply with local zoning regulations and building codes.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: ORGANISATIONAL STRUCTURE MODEL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Organisational Structure Model for a Records Centre</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Key Personnel and Their Responsibilities</h3>
            
            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><AwardIcon size={18} /> Records Centre Director</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Overall management and strategic planning for the records centre.</li>
              <li>Develops and implements policies and procedures.</li>
              <li>Manages budgets and resources.</li>
              <li>Ensures compliance with legal and regulatory requirements.</li>
              <li>Acts as a liaison with senior management and external stakeholders.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><UserCheck size={18} /> Records Management Supervisor</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supervises the day-to-day operations of the records management unit.</li>
              <li>Oversees records inventory, retrieval, and disposal.</li>
              <li>Trains and supervises records officers and clerks.</li>
              <li>Ensures adherence to retention schedules.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Records Officer</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manages records inventory and tracking systems.</li>
              <li>Processes records requests and retrievals.</li>
              <li>Assists with records disposal and transfer.</li>
              <li>Provides reference services to users.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Office Assistant</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provides general office support, including answering phones, filing, and data entry.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Records Clerk</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Files and retrieves records according to established procedures.</li>
              <li>Maintains accurate records of file movements.</li>
              <li>Assists with records preparation for storage or disposal.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> File Clerk</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Assists records clerk with filing, and retrieval tasks.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><AwardIcon size={18} /> Conservation/Preservation Supervisor</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supervises the conservation and preservation unit.</li>
              <li>Develops and implements preservation strategies.</li>
              <li>Oversees conservation treatments and repairs.</li>
              <li>Manages environmental monitoring and control.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Conservator</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Performs conservation treatments on damaged records.</li>
              <li>Conducts condition assessments and develops treatment plans.</li>
              <li>Maintains records of conservation activities.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Conservation Assistant</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Assists the conservator with conservation tasks.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Preservation Technician</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Performs routine preservation tasks, such as cleaning, rehousing, and digitization.</li>
              <li>Monitors environmental conditions and reports any issues.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Preservation Assistant</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aids the Preservation Technician with day to day tasks.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><AwardIcon size={18} /> IT/Systems Supervisor</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supervises the IT and systems unit.</li>
              <li>Manages electronic records systems and databases.</li>
              <li>Ensures data security and integrity.</li>
              <li>Provides technical support to staff.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> IT Specialist</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Manages and maintains electronic records systems.</li>
              <li>Develops and implements data backup and recovery procedures.</li>
              <li>Provides technical support for hardware and software.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Data Entry Clerk</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Performs data entry tasks related to the electronic records systems.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Systems Administrator</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintains the server, and network infrastructure.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><User size={18} /> Tech Support</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provides technical support to staff, and troubleshoots technical problems.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: CHALLENGES IN MANAGING RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Challenges in Managing Records in Records Centres</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Managing records within a records centre presents various challenges that require proactive solutions to ensure efficient operations and compliance.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Space Constraints:</strong> Challenge: Growing volumes of records can lead to space limitations, making it difficult to store and retrieve materials efficiently.</li>
              <li><strong>Environmental Control:</strong> Challenge: Maintaining stable environmental conditions (temperature, humidity, light) to prevent deterioration of records, especially for diverse media formats.</li>
              <li><strong>Inventory Management:</strong> Challenge: Keeping accurate and up-to-date inventories of records, particularly with large volumes and frequent access requests.</li>
              <li><strong>Retrieval Efficiency:</strong> Challenge: Ensuring timely and efficient retrieval of records when needed, especially with complex indexing and tracking systems.</li>
              <li><strong>Retention and Disposal:</strong> Challenge: Adhering to retention schedules and ensuring secure disposal of records, while complying with legal and regulatory requirements.</li>
              <li><strong>Security and Access Control:</strong> Challenge: Protecting records from unauthorized access, theft, and damage, while providing authorized personnel with necessary access.</li>
              <li><strong>Digital Records Management:</strong> Challenge: Managing the increasing volume of digital records, including data migration, format obsolescence, and cybersecurity risks.</li>
              <li><strong>Staffing and Training:</strong> Challenge: Ensuring that records centre staff have the necessary skills and training to manage records effectively.</li>
              <li><strong>Budgetary Constraints:</strong> Challenge: Operating within limited budgets, while maintaining effective records management practices.</li>
              <li><strong>Disaster Preparedness:</strong> Challenge: Planning for and responding to disasters that could damage or destroy records.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: POSSIBLE SOLUTIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Possible Solutions to Identified Problems/Challenges</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Space Constraints:</strong> <span className="font-semibold">Solution:</span> Implement high-density storage systems, utilize vertical space, and conduct regular records purges according to retention schedules. Explore off-site storage options.</li>
              <li><strong>Environmental Control:</strong> <span className="font-semibold">Solution:</span> Install and maintain climate control systems, use archival-quality storage materials, and regularly monitor environmental conditions.</li>
              <li><strong>Inventory Management:</strong> <span className="font-semibold">Solution:</span> Implement robust inventory management systems with barcode scanners and RFID technology. Conduct regular audits to ensure accuracy.</li>
              <li><strong>Retrieval Efficiency:</strong> <span className="font-semibold">Solution:</span> Optimize indexing and tracking systems, implement electronic request systems, and provide training to staff on retrieval procedures.</li>
              <li><strong>Retention and Disposal:</strong> <span className="font-semibold">Solution:</span> Develop and implement clear retention schedules, use secure shredding or destruction methods, and maintain accurate disposal records.</li>
              <li><strong>Security and Access Control:</strong> <span className="font-semibold">Solution:</span> Implement access control systems, install CCTV surveillance, conduct background checks on staff, and establish clear security protocols.</li>
              <li><strong>Digital Records Management:</strong> <span className="font-semibold">Solution:</span> Implement electronic records management systems (ERMS), develop data migration strategies, and invest in cybersecurity measures.</li>
              <li><strong>Staffing and Training:</strong> <span className="font-semibold">Solution:</span> Provide ongoing training to staff on records management best practices, hire qualified personnel, and establish clear performance expectations.</li>
              <li><strong>Budgetary Constraints:</strong> <span className="font-semibold">Solution:</span> Prioritize preservation activities, seek cost-effective storage solutions, and explore partnerships with other organizations.</li>
              <li><strong>Disaster Preparedness:</strong> <span className="font-semibold">Solution:</span> Develop and implement disaster recovery plans, conduct regular drills, and establish backup systems.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Records Centre Administration & Organisational Structure</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Administrative Structure</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Siting Factors</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Organisational Model</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Challenges</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Solutions</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Structure. Site. Manage. Solve. 🏢📋</p>
        </footer>

      </div>
    </div>
  );
};