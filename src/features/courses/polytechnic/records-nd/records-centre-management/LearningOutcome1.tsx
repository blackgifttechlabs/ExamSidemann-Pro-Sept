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
  Fingerprint, KeyRound, Siren, Flame, Waves,Landmark,

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

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

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
              Records & Information Management: Module LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Records Centres & <span className="text-emerald-300 font-bold italic">Record Lifecycle Management</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to records centres, functions, characteristics, equipment, record lifecycle, and types of records centres.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">records_centres.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">STORE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">RETRIEVE</span><span className="text-white">Information;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">MANAGE</span><span className="text-white">Lifecycle;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Archive className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Database className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: RECORDS CENTRE ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A Records Centre is a specialized facility designed for the storage, retrieval, and disposal of inactive or semi-active records. It serves as an intermediary between active office files and permanent archives, providing a cost-effective solution for managing records that are no longer frequently used but still need to be retained for legal, administrative, or historical purposes.</p>
          </div>
        </section>

        {/* ========== SECTION 2: FUNCTIONS OF RECORDS CENTRES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Functions of Records Centres</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Storage:</strong> Records centres provide secure and organized storage for inactive records, ensuring their protection from damage and unauthorized access.</li>
              <li><strong>Retrieval:</strong> They facilitate the efficient retrieval of records when needed, using indexing and tracking systems to locate and access information quickly.</li>
              <li><strong>Retention and Disposal:</strong> Records centres manage the lifecycle of records by implementing retention schedules and disposing of records that have reached their retention period.</li>
              <li><strong>Inventory Management:</strong> They maintain accurate inventories of all records stored in the facility, enabling effective tracking and management.</li>
              <li><strong>Reference Services:</strong> Records centres offer reference services to assist users in locating and accessing records, providing copies, or answering inquiries.</li>
              <li><strong>Security:</strong> They provide security for stored records, including protection from theft, damage, and unauthorized access.</li>
              <li><strong>Compliance:</strong> Records centres ensure compliance with legal, regulatory, and organizational requirements for records management.</li>
              <li><strong>Cost Reduction:</strong> By centralizing inactive records, they reduce the need for expensive office space and equipment, leading to cost savings.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: CHARACTERISTICS OF RECORDS CENTRES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Characteristics of Records Centres</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Controlled Environment:</strong> Records centres maintain controlled environmental conditions to protect records from deterioration, including temperature and humidity control.</li>
              <li><strong>Secure Facility:</strong> They provide secure storage with access controls, surveillance systems, and fire suppression systems.</li>
              <li><strong>Organized Storage:</strong> Records are organized using standardized systems, such as shelving and boxes, to facilitate efficient retrieval.</li>
              <li><strong>Inventory System:</strong> They utilize inventory systems to track and manage records throughout their lifecycle.</li>
              <li><strong>Retention Schedules:</strong> Records centres operate based on established retention schedules to determine the appropriate disposal of records.</li>
              <li><strong>Accessibility:</strong> They provide accessible retrieval services to authorized users.</li>
              <li><strong>Efficiency:</strong> Records centres are designed for efficient storage, retrieval, and disposal of records.</li>
              <li><strong>Compliance:</strong> They adhere to legal, regulatory, and organizational requirements for records management.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: EQUIPMENT FOUND IN RECORDS CENTRES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Equipment Found in Records Centres</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Shelving and Racking Systems:</strong> Used for storing boxes and files, maximizing storage space and organization.</li>
              <li><strong>Storage Boxes and Containers:</strong> Archival-quality boxes and containers to protect records from damage and deterioration.</li>
              <li><strong>Barcode Scanners and Inventory Systems:</strong> Used for tracking and managing records inventory.</li>
              <li><strong>Climate Control Systems:</strong> HVAC systems to maintain stable temperature and humidity levels.</li>
              <li><strong>Fire Suppression Systems:</strong> Sprinklers and fire extinguishers to protect records from fire damage.</li>
              <li><strong>Security Surveillance Systems:</strong> CCTV cameras and motion sensors to monitor the facility and prevent unauthorized access.</li>
              <li><strong>Retrieval Equipment:</strong> Carts, ladders, and other equipment to facilitate the retrieval of records.</li>
              <li><strong>Document Shredders:</strong> Used for the secure disposal of confidential records.</li>
              <li><strong>Computer Systems:</strong> Computers and software for managing inventory, tracking records, and providing reference services.</li>
              <li><strong>Environmental Monitoring Equipment:</strong> Thermometers and hygrometers to monitor environmental conditions.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: STAGES IN THE LIFE CYCLE OF A RECORD ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Stages in the Life Cycle of a Record</h2>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Creation/Receipt:</strong> This is the initial stage where a record is created or received by an organization. It involves the generation or acquisition of information that needs to be recorded.</li>
              <li><strong>Active Use/Maintenance:</strong> During this stage, the record is actively used for its intended purpose. It involves the ongoing maintenance, retrieval, and updating of the record.</li>
              <li><strong>Inactive/Disposition:</strong> In this final stage, the record is no longer actively used but may still need to be retained for legal, administrative, or historical purposes. It involves the transfer of the record to a records center, archival storage, or secure disposal.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: SEMI-CURRENT OR SEMI-ACTIVE RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Semi-Current or Semi-Active Records</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <p>Semi-current or semi-active records are those that are no longer actively used on a daily basis but are still needed for occasional reference or administrative purposes. They reside between active files, which are frequently accessed, and inactive records, which are rarely or never accessed.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>These records might be referenced periodically for audits, legal proceedings, or ongoing projects that are not yet complete.</li>
              <li>They are typically transferred from active office files to a records center for more cost-effective storage.</li>
              <li>The length of time a record is considered semi-active is determined by the organization's retention schedule, which outlines how long records must be kept for legal, regulatory, or operational reasons.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: DIFFERENT RECORDS FORMATS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Different Records Formats Managed in Records Centres</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Paper Records:</strong> This includes documents, files, reports, and bound volumes. Paper records are stored in boxes and on shelving, requiring controlled environments to prevent deterioration.</li>
              <li><strong>Electronic Records:</strong> This encompasses digital documents, databases, emails, and other digital files. Electronic records are stored on servers, hard drives, tapes, and other digital media.</li>
              <li><strong>Microforms:</strong> This includes microfilm and microfiche, which are used to store miniaturized images of documents. These formats require specialized storage and retrieval equipment.</li>
              <li><strong>Audio-Visual Records:</strong> This includes audio tapes, video tapes, CDs, and DVDs. These formats require specific storage conditions to prevent degradation.</li>
              <li><strong>Photographic Records:</strong> This includes prints, negatives, and slides. These formats are sensitive to environmental factors and require specialized storage.</li>
              <li><strong>Maps and Plans:</strong> These large format records require specialized storage to prevent damage.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 8: JUSTIFICATION FOR TRANSFERRING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Justification for Transferring Semi-Current Records to a Records Centre</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cost Efficiency:</strong> Storing semi-current records in a records centre frees up valuable office space, reducing the need for expensive filing cabinets and storage areas.</li>
              <li><strong>Improved Organization:</strong> Records centres provide organized storage systems, making it easier to locate and retrieve records when needed. This enhances efficiency and reduces search time.</li>
              <li><strong>Enhanced Security:</strong> Records centres offer secure storage environments with controlled access, protecting records from unauthorized access, theft, and damage.</li>
              <li><strong>Compliance with Retention Schedules:</strong> Records centres manage records according to established retention schedules, ensuring that records are retained for the required period and disposed of appropriately.</li>
              <li><strong>Professional Records Management:</strong> Records centres employ trained professionals who specialize in records management, ensuring that records are handled and managed according to best practices.</li>
              <li><strong>Reduced Risk of Loss or Damage:</strong> Controlled environmental conditions and secure storage in records centres minimize the risk of records being lost or damaged.</li>
              <li><strong>Efficient Retrieval:</strong> Records centers are set up to quickly retrieve semi current records when they are required.</li>
              <li><strong>Standardized Procedures:</strong> Records centers utilize standardized procedures, that improve the overall efficiency of records management.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: TYPES OF RECORDS CENTRES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Records Centres</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Home size={20} /> In-House Records Centres</h3>
            <p>These are records centres operated by an organization for its own records. They are typically located within the organization's premises or in a dedicated facility owned by the organization.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Commercial Records Centres</h3>
            <p>These are privately owned and operated facilities that provide records storage and management services to multiple clients. They offer a range of services on a contract basis.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> National Records Centres</h3>
            <p>These are government-operated facilities that manage the records of government agencies and departments. They are responsible for preserving and providing access to government records of historical or administrative value.</p>
          </div>
        </section>

        {/* ========== SECTION 10: SERVICES OFFERED ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Services Offered by These Records Centres</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Home size={20} /> In-House Records Centres</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Storage and Retrieval:</strong> Secure storage of inactive records and efficient retrieval upon request.</li>
              <li><strong>Retention Management:</strong> Implementation of retention schedules and disposal of records according to policy.</li>
              <li><strong>Inventory Control:</strong> Maintenance of accurate records inventories.</li>
              <li><strong>Reference Services:</strong> Providing access to records for internal users.</li>
              <li><strong>Internal Compliance:</strong> Ensuring compliance with organizational policies and procedures.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Commercial Records Centres</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Storage and Retrieval:</strong> Secure storage of records for multiple clients, with customizable retrieval options.</li>
              <li><strong>Retention Management:</strong> Implementation of client-specific retention schedules and disposal services.</li>
              <li><strong>Inventory Management:</strong> Detailed tracking and reporting of client records.</li>
              <li><strong>Off-Site Backup and Disaster Recovery:</strong> Secure off-site storage of backup records and disaster recovery services.</li>
              <li><strong>Document Imaging and Digitization:</strong> Conversion of paper records to digital formats.</li>
              <li><strong>Secure Shredding and Disposal:</strong> Secure destruction of confidential records.</li>
              <li><strong>Consulting Services:</strong> Providing expertise on records management best practices.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Landmark size={20} /> National Records Centres</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Archival Storage:</strong> Long-term preservation of government records of historical value.</li>
              <li><strong>Public Access:</strong> Providing access to government records for researchers and the public.</li>
              <li><strong>Government-Wide Retention Scheduling:</strong> Developing and implementing retention schedules for government records.</li>
              <li><strong>Records Management Training:</strong> Providing training and guidance to government agencies on records management.</li>
              <li><strong>Digital Preservation:</strong> Ensuring the long-term preservation of digital government records.</li>
              <li><strong>Advisory Services:</strong> Providing advice and guidance to government agencies on records management best practices.</li>
              <li><strong>National standards:</strong> Setting and enforcing national standards for government records management.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Records Centres & Record Lifecycle Management</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Records Centre</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Functions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lifecycle</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Types</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Services</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Store. Manage. Retrieve. Preserve. 📦📂</p>
        </footer>

      </div>
    </div>
  );
};