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

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

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
              Records & Information Management: Module LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Digital Records & <span className="text-amber-300 font-bold italic">Digital Records Centres</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to digital records, digital records centres, benefits, resources, challenges, solutions, and current management methods.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">digital_records.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">DIGITIZE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MANAGE</span><span className="text-white">Digitally;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SECURE</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Cloud className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><HardDriveIcon className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: DIGITAL RECORD ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Digital Record</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A digital record is information created or received and stored in an electronic format. It can encompass a wide range of data, including documents, spreadsheets, emails, images, audio files, and video files, all existing as binary code and requiring software and hardware to be accessed and interpreted. Unlike physical records, digital records are inherently dynamic, easily modified, and require specific preservation strategies to ensure their long-term accessibility and integrity.</p>
          </div>
        </section>

        {/* ========== SECTION 2: DIGITAL RECORDS CENTRE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Digital Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A digital records centre is a specialized facility or system designed for the secure storage, management, and retrieval of digital records. It utilizes electronic systems and infrastructure to manage the lifecycle of digital information, from creation to disposal. It incorporates technologies such as cloud storage, electronic document management systems (EDMS), and digital preservation tools, focusing on ensuring data integrity, security, and long-term accessibility.</p>
          </div>
        </section>

        {/* ========== SECTION 3: BENEFITS OF A DIGITAL RECORDS CENTRE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Benefits of a Digital Records Centre</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Enhanced Accessibility:</strong> Digital records can be accessed remotely by authorized users, regardless of their physical location. This facilitates collaboration, improves efficiency, and reduces the need for physical storage space.</li>
              <li><strong>Improved Search and Retrieval:</strong> Digital records centres utilize advanced search and indexing capabilities, enabling users to quickly locate specific information within vast repositories. This significantly reduces search time compared to traditional paper-based systems.</li>
              <li><strong>Increased Security:</strong> Digital records centres implement robust security measures, such as encryption, access controls, and intrusion detection systems, to protect sensitive data from unauthorized access and cyber threats.</li>
              <li><strong>Cost Savings:</strong> Digital storage reduces the need for physical storage space, filing cabinets, and other traditional storage equipment. It also reduces the costs associated with printing, photocopying, and physical transportation of records.</li>
              <li><strong>Data Integrity and Preservation:</strong> Digital records centres employ data integrity checks, version control, and digital preservation techniques to ensure that records remain accurate, complete, and accessible over time.</li>
              <li><strong>Automation and Efficiency:</strong> Digital records centres automate many records management tasks, such as indexing, retention scheduling, and disposal, freeing up staff time for more strategic activities.</li>
              <li><strong>Environmental Sustainability:</strong> By reducing the reliance on paper, digital records centres contribute to environmental sustainability. This reduces paper consumption, waste, and the carbon footprint associated with physical records management.</li>
              <li><strong>Disaster Recovery:</strong> Digital records centres facilitate efficient data backup and recovery, ensuring that records can be restored quickly in the event of a disaster or system failure.</li>
              <li><strong>Compliance and Audit Trails:</strong> Digital records centres can generate detailed audit trails, providing evidence of record access, modifications, and disposal. This supports compliance with legal and regulatory requirements.</li>
              <li><strong>Collaboration and Sharing:</strong> Digital records centres enable seamless collaboration and sharing of information among authorized users, improving communication and productivity.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: RESOURCES/MATERIALS REQUIRED ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Resources/Materials Required to Establish a Records Centre</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Building size={20} /> Physical Infrastructure</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Building/Space:</strong> A secure and climate-controlled facility with sufficient space for storage, processing, and staff offices.</li>
              <li><strong>Shelving and Racking Systems:</strong> High-density shelving and racking systems to maximize storage capacity and organization.</li>
              <li><strong>Storage Boxes and Containers:</strong> Archival-quality boxes, folders, and containers to protect records from damage and deterioration.</li>
              <li><strong>Climate Control Systems (HVAC):</strong> Systems to maintain stable temperature and humidity levels.</li>
              <li><strong>Fire Suppression Systems:</strong> Sprinklers, fire extinguishers, and smoke detectors to protect records from fire damage.</li>
              <li><strong>Security Systems:</strong> CCTV cameras, access control systems, and alarm systems to prevent unauthorized access.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HardDriveIcon size={20} /> Equipment and Technology</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Inventory Management System:</strong> Software and hardware for tracking and managing records inventory.</li>
              <li><strong>Barcode Scanners and RFID Technology:</strong> Tools for efficient inventory management and tracking.</li>
              <li><strong>Retrieval Equipment:</strong> Carts, ladders, and other equipment to facilitate record retrieval.</li>
              <li><strong>Document Shredders:</strong> Secure shredders for the disposal of confidential records.</li>
              <li><strong>Computer Systems and Network Infrastructure:</strong> Computers, servers, and network equipment for managing digital records and data.</li>
              <li><strong>Environmental Monitoring Equipment:</strong> Thermometers, hygrometers, and data loggers to monitor environmental conditions.</li>
              <li><strong>Digitization Equipment:</strong> Scanners and digitization software for converting paper records to digital formats.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Users size={20} /> Personnel and Training</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Records Centre Manager:</strong> A qualified manager to oversee the operations of the records centre.</li>
              <li><strong>Records Officers and Clerks:</strong> Staff to manage inventory, retrieval, and disposal of records.</li>
              <li><strong>Conservation/Preservation Staff:</strong> Professionals to perform conservation treatments and preservation tasks.</li>
              <li><strong>IT/Systems Staff:</strong> Personnel to manage electronic records systems and provide technical support.</li>
              <li><strong>Training Materials and Programs:</strong> Resources for training staff on records management best practices, security procedures, and equipment operation.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Clipboard size={20} /> Documentation and Policies</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Retention Schedules:</strong> Policies outlining the retention and disposal of records.</li>
              <li><strong>Access Control Policies:</strong> Guidelines for authorized access to records.</li>
              <li><strong>Disaster Recovery Plan:</strong> A plan for responding to emergencies and recovering damaged records.</li>
              <li><strong>Security Policies and Procedures:</strong> Guidelines for protecting records from unauthorized access, theft, and damage.</li>
              <li><strong>Operating Procedures Manual:</strong> A manual outlining the day-to-day operations of the records centre.</li>
              <li><strong>Forms and Templates:</strong> Standardized forms for record transfers, requests, and other transactions.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Package size={20} /> Supplies and Consumables</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Archival-Quality Storage Materials:</strong> Boxes, folders, sleeves, and other storage materials.</li>
              <li><strong>Cleaning Supplies:</strong> Materials for cleaning and maintaining records and storage areas.</li>
              <li><strong>Labeling Supplies:</strong> Labels, markers, and other supplies for labeling records and storage containers.</li>
              <li><strong>Office Supplies:</strong> General office supplies for staff use.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: CHALLENGES OR PROBLEMS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Challenges or Problems Faced When Managing Digital Records in a Records Centre</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Technological Obsolescence:</strong> One of the most pressing challenges is the rapid obsolescence of hardware and software. Digital records created with older technologies may become inaccessible as those technologies become outdated. This can lead to data loss or the need for costly and complex migration processes.</li>
              <li><strong>Data Integrity and Corruption:</strong> Digital data is susceptible to corruption due to hardware failures, software errors, or malicious attacks. Ensuring the integrity of digital records over time requires robust data integrity checks and backup systems. The phenomenon of "bit rot," where data degrades over time, further complicates this issue.</li>
              <li><strong>Security and Privacy:</strong> Protecting digital records from unauthorized access, modification, or destruction is a significant concern. Cyber threats, such as hacking, malware, and ransomware, pose a constant risk. Additionally, compliance with data privacy regulations requires stringent security measures.</li>
              <li><strong>Storage and Scalability:</strong> The volume of digital data is constantly growing, requiring scalable storage solutions. Records centres must be able to accommodate this growth while maintaining efficient access and retrieval. Cloud storage offers potential solutions, but it also introduces new security and data sovereignty concerns.</li>
              <li><strong>Metadata Management:</strong> Metadata, or data about data, is essential for describing, organizing, and retrieving digital records. However, creating and maintaining accurate and comprehensive metadata can be challenging. Inconsistent metadata practices can hinder the long-term accessibility and usability of digital records.</li>
              <li><strong>Digital Preservation:</strong> Ensuring the long-term preservation of digital records requires specialized knowledge and tools. Digital preservation strategies, such as migration, emulation, and normalization, must be implemented to maintain access to records over time.</li>
              <li><strong>Legal and Regulatory Compliance:</strong> Digital records are subject to various legal and regulatory requirements, including data retention policies, e-discovery rules, and privacy laws. Staying compliant with these regulations can be complex, especially in a rapidly changing legal landscape.</li>
              <li><strong>Authentication and Provenance:</strong> Verifying the authenticity and provenance of digital records can be difficult. Digital records can be easily altered or manipulated, raising concerns about their reliability and trustworthiness.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: POSSIBLE SOLUTIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Possible Solutions</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Implement Digital Preservation Strategies:</strong> Develop and implement comprehensive digital preservation strategies, including data migration, emulation, and normalization. Regularly evaluate and update these strategies to keep pace with technological advancements.</li>
              <li><strong>Robust Backup and Recovery Systems:</strong> Establish robust backup and recovery systems to protect digital records from data loss. Implement regular data integrity checks and monitor for signs of data corruption.</li>
              <li><strong>Strengthen Security Measures:</strong> Implement strong security measures, such as encryption, access controls, and intrusion detection systems, to protect digital records from unauthorized access and cyber threats.</li>
              <li><strong>Adopt Scalable Storage Solutions:</strong> Utilize scalable storage solutions, such as cloud storage or network-attached storage (NAS), to accommodate the growing volume of digital data.</li>
              <li><strong>Establish Metadata Standards:</strong> Develop and implement metadata standards to ensure consistent and accurate metadata creation and management. Utilize automated metadata extraction tools to streamline the process.</li>
              <li><strong>Develop Disaster Recovery Plans:</strong> Create detailed disaster recovery plans that address potential threats to digital records. Regularly test and update these plans to ensure their effectiveness.</li>
              <li><strong>Provide Staff Training:</strong> Provide ongoing training to records centre staff on digital records management best practices, security procedures, and digital preservation techniques.</li>
              <li><strong>Stay Informed About Legal and Regulatory Changes:</strong> Stay informed about changes in legal and regulatory requirements related to digital records management. Regularly review and update policies and procedures to ensure compliance.</li>
              <li><strong>Utilize Audit Trails:</strong> Implement audit trails to track all actions taken on digital records. This will help with provenance, and authentication.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: CURRENT/LATEST METHODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Current/Latest Methods of Managing Digital Records in Records Centres</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cloud-Based Records Management Systems (RMS):</strong> Cloud-based RMS offer scalable and flexible solutions for managing digital records. These systems provide remote access, automated workflows, and robust security features. They also facilitate collaboration and data sharing among authorized users.</li>
              <li><strong>Artificial Intelligence (AI) and Machine Learning (ML):</strong> AI and ML are being used to automate various records management tasks, such as metadata extraction, classification, and retention scheduling. These technologies can analyze large volumes of data to identify patterns and anomalies, improving efficiency and accuracy.</li>
              <li><strong>Blockchain Technology:</strong> Blockchain technology is being explored for its potential to ensure the integrity and authenticity of digital records. Blockchain's immutable ledger provides a secure and transparent way to track record provenance and prevent unauthorized modifications.</li>
              <li><strong>Digital Preservation Systems:</strong> Specialized digital preservation systems are being implemented to ensure the long-term accessibility of digital records. These systems employ strategies such as format migration, emulation, and normalization to combat technological obsolescence.</li>
              <li><strong>Metadata Standards and Schema:</strong> Adherence to standardized metadata schemas is crucial for ensuring interoperability and long-term accessibility of digital records. Records centres are adopting metadata standards such as Dublin Core and PREMIS to facilitate metadata creation and management.</li>
              <li><strong>Automated Workflows and Automation Tools:</strong> Automation of workflows streamlines many records management processes. Automation tools are used for tasks like automated classification, and automated disposal.</li>
              <li><strong>Data Analytics:</strong> Data analytics tools are used to analyze digital records, and to gain insights into the records. This allows for better decision making, and improved information governance.</li>
              <li><strong>Zero Trust Security:</strong> The Zero Trust security model is being applied to digital records management to enhance security. This approach assumes that no user or device should be trusted by default, requiring continuous authentication and authorization.</li>
              <li><strong>API Integrations:</strong> The use of API integrations allows for records management systems to integrate with other business systems. This allows for seamless data flow, and improved efficiency.</li>
              <li><strong>Containerization and Microservices:</strong> These technologies allow for records management applications to be deployed, and scaled more effectively.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Digital Records & Digital Records Centres</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Digital Records</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Benefits</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Resources</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Challenges</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Methods</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Digitize. Manage. Secure. Preserve. 💾☁️</p>
        </footer>

      </div>
    </div>
  );
};