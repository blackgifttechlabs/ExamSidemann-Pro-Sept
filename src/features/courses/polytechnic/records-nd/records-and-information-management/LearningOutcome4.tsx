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
  Drill, Recycle, Leaf, Flower, BookMarked, Library, PanelTop, Scan, Copy,
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
              Vital Records, Disaster Planning & <span className="text-amber-300 font-bold italic">Business Continuity</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to vital records identification, protection, VRM programs, threats, disaster preparedness, response, recovery, and evaluation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">vital_records.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IDENTIFY</span><span className="text-white">Vital;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">PROTECT</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">RECOVER</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Shield className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Siren className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: VITAL RECORDS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Vital Records</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Vital records are those records that are essential for an organization's continued operation during and after an emergency or disaster. They are indispensable for resuming or reconstituting business operations, protecting the organization's legal and financial rights, and fulfilling its obligations to employees, customers, and stakeholders. In essence, they are the "lifeblood" of an organization, without which it cannot survive.</p>
          </div>
        </section>

        {/* ========== SECTION 2: STEPS IN THE IDENTIFICATION OF VITAL RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps in the Identification of Vital Records in an Organization</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Identifying vital records is a critical component of disaster recovery and business continuity planning. Here are the steps involved:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Establish a Vital Records Team</h3>
            <p>Form a team comprising representatives from key departments, including records management, information technology, legal, finance, and operations. This team will be responsible for identifying and prioritizing vital records.</p>
            <p>Having a team with knowledge from different parts of the company helps identify all important records.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Define Criteria for Vital Records</h3>
            <p>Develop clear and specific criteria for identifying vital records. These criteria should include factors such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Legal and regulatory requirements.</li>
              <li>Financial and operational importance.</li>
              <li>Historical significance.</li>
              <li>Irreplaceability.</li>
              <li>The time it takes to replace.</li>
            </ul>
            <p>Having clear rules for what makes a record "vital" ensures consistency.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Conduct a Records Inventory</h3>
            <p>Perform a comprehensive records inventory to identify all records held by the organization. This inventory should include information about the location, format, content, and retention period of each record series.</p>
            <p>Knowing what records the company has is the first step.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Analyze Records and Assess Impact</h3>
            <p>Analyze each record series and assess the impact of its loss or damage on the organization's operations, legal standing, and financial stability.</p>
            <p>Determine the criticality of each record series.</p>
            <p>Figure out how bad it would be if each record was lost.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Categorize Records</h3>
            <p>Categorize records based on their criticality. This may involve creating categories such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Essential records (critical for immediate operations).</li>
              <li>Important records (necessary for long-term operations).</li>
              <li>Useful records (helpful but not critical).</li>
            </ul>
            <p>This helps to prioritize which records are the most important.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Document Vital Records</h3>
            <p>Create a detailed list of vital records, including information about their location, format, retention period, and backup procedures.</p>
            <p>This list should be readily accessible to authorized personnel.</p>
            <p>Write down all the information about the vital records.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Develop Protection and Recovery Strategies</h3>
            <p>Develop strategies for protecting and recovering vital records in the event of an emergency or disaster. This may include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Off-site storage.</li>
              <li>Digital backups.</li>
              <li>Redundancy.</li>
              <li>Disaster recovery plans.</li>
            </ul>
            <p>Plan how to keep the vital records safe, and how to recover them if they are lost.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regularly Review and Update</h3>
            <p>Regularly review and update the vital records list and protection strategies to ensure they remain accurate and effective.</p>
            <p>Organizational changes and evolving threats may necessitate adjustments.</p>
            <p>Keep the vital records plan up to date.</p>
          </div>
        </section>

        {/* ========== SECTION 3: PROTECTING VITAL RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Protecting Vital Records</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Copy size={20} /> Duplication and Off-Site Storage</h3>
            <p>Creating duplicate copies of vital records and storing them in a secure off-site location is a fundamental protection measure. This ensures that even if the primary records are destroyed, copies are available for recovery.</p>
            <p>This is like having a backup copy in a safe place.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> Digital Backups and Cloud Storage</h3>
            <p>Regularly backing up digital vital records to secure servers or cloud storage provides redundancy and accessibility. Cloud storage offers scalability, security, and geographic diversity, enhancing protection against localized disasters.</p>
            <p>This is like saving your files on the internet.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Encryption</h3>
            <p>Encrypting sensitive vital records, both in transit and at rest, protects them from unauthorized access. This ensures that even if records are intercepted or stolen, they remain unreadable without the decryption key.</p>
            <p>This is like scrambling the documents so only authorized people can read them.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Access Controls</h3>
            <p>Implementing strict access controls, such as user authentication and authorization, limits access to vital records to authorized personnel only. This minimizes the risk of internal or external data breaches.</p>
            <p>This is like having a password protected safe.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Building size={20} /> Secure Physical Storage</h3>
            <p>For physical vital records, secure storage facilities with fire suppression systems, climate control, and security monitoring are essential. This protects records from environmental damage, theft, and unauthorized access.</p>
            <p>This is like having a secure room for paper documents.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Disaster Recovery Planning</h3>
            <p>Developing and regularly testing a comprehensive disaster recovery plan is crucial. This plan should outline procedures for recovering vital records, restoring systems, and resuming operations in the event of a disaster.</p>
            <p>This is like having a plan in case of an emergency.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Redundancy</h3>
            <p>Creating redundancy in critical systems and infrastructure ensures that vital records remain accessible even if one component fails. This may involve using redundant servers, network connections, or power supplies.</p>
            <p>This is like having a backup system in place.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Regular Audits and Security Assessments</h3>
            <p>Conducting regular audits and security assessments helps to identify vulnerabilities in the protection measures and ensure their effectiveness. This allows for proactive adjustments and improvements.</p>
            <p>This is like checking the security system regularly.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Vital Records Inventory and Categorization</h3>
            <p>Maintaining an updated inventory of vital records, categorized by criticality, allows for prioritization during recovery efforts.</p>
            <p>This is like having a list of the most important documents.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sun size={20} /> Environmental Controls</h3>
            <p>For physical records, maintaining proper temperature and humidity levels is critical to prevent degradation.</p>
            <p>This is like keeping the documents in a climate controlled room.</p>
          </div>
        </section>

        {/* ========== SECTION 4: A VITAL RECORDS MANAGEMENT (VRM) PROGRAM ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>A Vital Records Management (VRM) Program</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A VRM program is essential for any institution, regardless of size or sector.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Business Continuity and Operational Resilience</h3>
            <p>A VRM program ensures that an institution can continue its core operations during and after a disruptive event, such as a natural disaster, cyberattack, or pandemic. Without access to vital records, essential functions like payroll, customer service, and regulatory compliance can be severely impacted, leading to operational paralysis. VRM provides a roadmap for quickly restoring critical services.</p>
            <p>This means, that even if something bad happens, the company can still function.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Legal and Regulatory Compliance</h3>
            <p>Many institutions are subject to legal and regulatory requirements that mandate the retention and accessibility of specific records. A VRM program ensures that these vital records are protected and readily available, minimizing the risk of legal penalties and reputational damage. This is particularly crucial in sectors like finance, healthcare, and government.</p>
            <p>This helps the company follow the rules.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Financial Protection</h3>
            <p>Vital records often contain information related to financial transactions, contracts, and assets. A VRM program safeguards these records, protecting the institution's financial interests and preventing fraud or financial loss. This is crucial for maintaining financial stability and ensuring accountability.</p>
            <p>This helps keep the companies money safe.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Protection of Intellectual Property and Sensitive Information</h3>
            <p>Institutions often hold valuable intellectual property, trade secrets, and sensitive customer or employee data. A VRM program implements security measures to protect these vital records from unauthorized access, loss, or damage, safeguarding the institution's competitive advantage and protecting privacy.</p>
            <p>This helps keep private information safe.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> Disaster Recovery and Reconstitution</h3>
            <p>In the event of a disaster, a VRM program provides a framework for recovering and reconstituting essential records. This enables the institution to resume operations quickly and efficiently, minimizing downtime and mitigating the impact of the disaster.</p>
            <p>This helps the company recover after a disaster.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Historical and Cultural Preservation</h3>
            <p>For institutions with historical or cultural significance, vital records may include documents, artifacts, or data that preserve their heritage. A VRM program ensures that these records are preserved for future generations, contributing to the institution's legacy.</p>
            <p>This helps preserve important historical information.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Risk Mitigation</h3>
            <p>A VRM program is a key component of an organizations larger risk mitigation strategy. By protecting vital records, the institution reduces the risk of operational disruption, financial loss, and legal liabilities.</p>
            <p>This helps to reduce the risk of bad things happening to the company.</p>
          </div>
        </section>

        {/* ========== SECTION 5: VARIOUS THREATS TO VITAL RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Various Threats to Vital Records</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Threats to vital records can be especially devastating, as these records are essential for an organization's survival. Here's a breakdown of the specific threats that target vital records:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Waves size={20} /> Natural Disasters</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fire can completely destroy vital records, especially paper-based ones.</li>
              <li>Flood or water damage can ruin paper records and damage electronic storage devices.</li>
              <li>Earthquakes can cause structural damage, leading to the loss of both physical and digital vital records.</li>
              <li>Severe weather events like hurricanes and tornadoes can cause widespread destruction, including the loss of vital records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Human-Caused Threats</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cyberattacks, including ransomware, data breaches, and malware, can encrypt, expose, or corrupt vital digital records.</li>
              <li>Intentional sabotage or insider threats can result in the destruction, alteration, or theft of vital records.</li>
              <li>Accidental loss or deletion due to human error can eliminate vital records.</li>
              <li>Theft of physical storage media containing vital records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HardDriveIcon size={20} /> Technological Threats</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hardware failures, such as hard drive crashes and server malfunctions, can result in the loss of vital digital records.</li>
              <li>Software errors or bugs can corrupt or delete vital data.</li>
              <li>Power outages can interrupt access to vital digital records and potentially damage storage devices.</li>
              <li>Data corruption during storage or transfer can corrupt vital records.</li>
              <li>Obsolescence of outdated technology or software can render vital digital records inaccessible.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sun size={20} /> Environmental Threats</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Temperature and humidity extremes can damage both physical and digital vital records.</li>
              <li>Mold or mildew can destroy paper-based vital records.</li>
              <li>Pest infestations can damage physical vital records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertCircle size={20} /> Organizational Threats</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lack of redundancy, such as insufficient backups or off-site storage, can lead to the permanent loss of vital records.</li>
              <li>Inadequate security measures, such as weak access controls, can make vital records vulnerable to unauthorized access.</li>
              <li>Poor disaster recovery planning can hinder the recovery of vital records after a disruptive event.</li>
              <li>Insufficient employee training can lead to a lack of understanding regarding the importance of vital records or how to protect them.</li>
              <li>Lack of a Vital Records Inventory, prevents the company from knowing what records are vital, and where they are located.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: DESIGNING A DISASTER PREPAREDNESS PLAN ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Designing a Disaster Preparedness Plan for an Institution</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A comprehensive disaster preparedness plan is essential for any institution to minimize the impact of disruptive events. Here's how to design one:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Establish a Planning Team</h3>
            <p>Form a diverse team with representatives from all key departments, including administration, IT, security, facilities, and communications. This ensures a holistic approach.</p>
            <p>A diverse team will bring different perspectives and knowledge to the planning process.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Conduct a Risk Assessment</h3>
            <p>Identify potential hazards that could affect the institution, such as natural disasters, cyberattacks, or human-caused incidents.</p>
            <p>Assess the likelihood and potential impact of each hazard.</p>
            <p>This step allows you to prioritize the most likely and impactful risks.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Develop a Business Impact Analysis (BIA)</h3>
            <p>Determine the critical functions and processes of the institution.</p>
            <p>Analyze the impact of disruptions on these functions, including financial, operational, and reputational consequences.</p>
            <p>Identify the maximum tolerable downtime for each critical function.</p>
            <p>This analysis helps to prioritize recovery efforts.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Identify Vital Records and Assets</h3>
            <p>Determine which records, equipment, and resources are essential for the institution's continued operation.</p>
            <p>Establish procedures for protecting and recovering these vital assets.</p>
            <p>This ensures that the most critical resources are prioritized for protection and recovery.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Develop Recovery Strategies</h3>
            <p>Create detailed recovery strategies for each critical function and asset.</p>
            <p>This may include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data backups and off-site storage.</li>
              <li>Alternative work locations.</li>
              <li>Equipment replacement procedures.</li>
              <li>Communication protocols.</li>
            </ul>
            <p>These strategies should be specific, actionable, and regularly updated.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageSquare size={20} /> Establish Communication Protocols</h3>
            <p>Develop a clear communication plan for internal and external stakeholders.</p>
            <p>Identify communication channels and designated spokespersons.</p>
            <p>Establish procedures for disseminating information during and after a disaster.</p>
            <p>Clear communication is vital for managing the crisis and keeping everyone informed.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Develop an Emergency Response Plan</h3>
            <p>Outline procedures for responding to specific emergencies, such as evacuations, lockdowns, and medical emergencies.</p>
            <p>Assign roles and responsibilities to emergency response personnel.</p>
            <p>Conduct regular drills and exercises to test the plan's effectiveness.</p>
            <p>This plan ensures a coordinated and effective response to emergencies.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Implement Security Measures</h3>
            <p>Enhance security measures to protect vital records and assets from unauthorized access or damage.</p>
            <p>This may include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access controls.</li>
              <li>Surveillance systems.</li>
              <li>Cybersecurity measures.</li>
            </ul>
            <p>Proactive security measures can prevent or mitigate the impact of certain threats.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Document and Distribute the Plan</h3>
            <p>Document the disaster preparedness plan in a clear and concise manner.</p>
            <p>Distribute copies of the plan to all relevant personnel.</p>
            <p>Make the plan readily accessible in both physical and digital formats.</p>
            <p>This ensures that everyone is aware of their roles and responsibilities.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regularly Review and Update the Plan</h3>
            <p>Review and update the plan at least annually, or more frequently as needed.</p>
            <p>Incorporate lessons learned from drills, exercises, and actual incidents.</p>
            <p>Adapt the plan to reflect changes in technology, regulations, and organizational structure.</p>
            <p>Regular updates ensure that the plan remains relevant and effective.</p>
          </div>
        </section>

        {/* ========== SECTION 7: STEPS IN DISASTER RESPONSE AND RECOVERY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps in Disaster Response and Recovery</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Disaster response and recovery involves a series of coordinated steps to minimize damage and restore operations.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> 1. Assessment</h3>
            <p>Immediately assess the extent of the damage to facilities, equipment, and records.</p>
            <p>Determine the safety of personnel and the surrounding environment.</p>
            <p>This initial assessment provides a foundation for subsequent actions.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> 2. Contacting the Insurer</h3>
            <p>Notify the insurance company of the disaster and initiate the claims process.</p>
            <p>Document all damages and losses thoroughly for insurance purposes.</p>
            <p>Prompt communication with the insurer helps to expedite the recovery process.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 3. Setting Up a Post and Activating Plans for Supplies and Staff</h3>
            <p>Establish a central command post for coordinating response and recovery efforts.</p>
            <p>Activate pre-established plans for procuring emergency supplies and mobilizing staff.</p>
            <p>This ensures a coordinated and efficient response.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 4. Eliminating Hazards</h3>
            <p>Address immediate hazards, such as gas leaks, electrical dangers, or structural instability.</p>
            <p>Prioritize safety to prevent further injuries or damage.</p>
            <p>Hazard elimination is critical for creating a safe recovery environment.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sun size={20} /> 5. Controlling the Environment</h3>
            <p>Implement measures to control the environment, such as temporary climate control or water removal, to prevent further damage to records and equipment.</p>
            <p>This is especially important for preserving sensitive materials.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> 6. Initiating Recovery Plans</h3>
            <p>Begin implementing the recovery plans developed during the preparedness phase.</p>
            <p>Prioritize recovery efforts based on the business impact analysis.</p>
            <p>This step transitions from immediate response to long-term recovery.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Edit size={20} /> 7. Documenting the Activities</h3>
            <p>Meticulously document all response and recovery activities, including damage assessments, actions taken, and resources used.</p>
            <p>This documentation is crucial for insurance claims, audits, and future planning.</p>
            <p>Detailed records provide a clear account of the recovery process.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> 8. Concluding the Initial Response Phase</h3>
            <p>When immediate hazards are mitigated, and recovery plans are initiated, conclude the initial response phase.</p>
            <p>Transition to a more structured recovery phase, focusing on long-term restoration.</p>
            <p>This signals a shift from emergency response to sustained recovery.</p>
          </div>
        </section>

        {/* ========== SECTION 8: IMPLEMENTING THE DISASTER PREPAREDNESS PLAN ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Implementing the Disaster Preparedness Plan</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Implementing a disaster preparedness plan involves several key actions:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Communication:</strong> Ensure that all personnel are aware of the plan and their roles.</li>
              <li><strong>Training:</strong> Conduct regular training and drills to familiarize personnel with emergency procedures.</li>
              <li><strong>Testing:</strong> Regularly test the plan to identify and address any weaknesses or gaps.</li>
              <li><strong>Maintenance:</strong> Keep the plan updated to reflect changes in technology, personnel, and potential threats.</li>
              <li><strong>Activation:</strong> When a disaster occurs, activate the plan immediately and follow the established procedures.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: RECORDS SALVAGING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Salvaging</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Records salvaging refers to the process of recovering and restoring damaged records after a disaster. This involves:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Prioritization:</strong> Determine which records are most critical for recovery.</li>
              <li><strong>Stabilization:</strong> Stabilize damaged records to prevent further deterioration.</li>
              <li><strong>Cleaning:</strong> Clean records to remove contaminants, such as water, mold, or debris.</li>
              <li><strong>Drying:</strong> Dry wet records using appropriate techniques, such as air drying, freeze-drying, or vacuum drying.</li>
              <li><strong>Restoration:</strong> Restore damaged records through techniques like mending, deacidification, or digitization.</li>
              <li><strong>Documentation:</strong> Document all salvaging activities, including the condition of records and the methods used.</li>
            </ul>
            <p className="mt-2">Records salvaging requires specialized skills and equipment and should be performed by trained professionals whenever possible.</p>
          </div>
        </section>

        {/* ========== SECTION 10: EVALUATING A VITAL RECORDS MANAGEMENT (VRM) PROGRAM ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Evaluating a Vital Records Management (VRM) Program</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Review Program Documentation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Policies and Procedures:</strong> Assess the clarity, completeness, and currency of VRM policies and procedures. Ensure they are aligned with legal, regulatory, and organizational requirements.</li>
              <li><strong>Vital Records Inventory:</strong> Examine the accuracy and completeness of the vital records inventory. Verify that all essential records are identified and categorized appropriately.</li>
              <li><strong>Retention Schedules:</strong> Review the retention schedules for vital records to ensure they are appropriate and compliant.</li>
              <li><strong>Disaster Recovery Plan:</strong> Evaluate the comprehensiveness and effectiveness of the disaster recovery plan, including procedures for recovering vital records.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Assess Protection Measures</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Duplication and Off-Site Storage:</strong> Verify that vital records are adequately duplicated and stored in secure off-site locations.</li>
              <li><strong>Digital Backups and Cloud Storage:</strong> Evaluate the effectiveness of digital backup and cloud storage procedures, including frequency, security, and accessibility.</li>
              <li><strong>Encryption and Access Controls:</strong> Assess the strength of encryption and access controls used to protect vital records from unauthorized access.</li>
              <li><strong>Physical Security:</strong> Evaluate the physical security measures in place to protect vital records, such as fire suppression systems, climate control, and security monitoring.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Evaluate Recovery Procedures</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Recovery Time Objectives (RTOs):</strong> Assess whether the VRM program meets the established RTOs for recovering vital records.</li>
              <li><strong>Recovery Testing:</strong> Evaluate the frequency and effectiveness of recovery testing and drills.</li>
              <li><strong>Recovery Documentation:</strong> Review the documentation of past recovery efforts to identify lessons learned and areas for improvement.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Conduct Audits and Assessments</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Internal Audits:</strong> Conduct regular internal audits to assess the effectiveness of the VRM program and identify any compliance issues.</li>
              <li><strong>External Audits:</strong> Consider conducting external audits by independent experts to provide an objective assessment of the VRM program.</li>
              <li><strong>Risk Assessments:</strong> Regularly conduct risk assessments to identify emerging threats and vulnerabilities.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Gather Feedback from Stakeholders</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Employee Surveys:</strong> Conduct employee surveys to gather feedback on the VRM program and identify any concerns or suggestions.</li>
              <li><strong>Interviews:</strong> Conduct interviews with key stakeholders, such as department heads and IT staff, to gather their perspectives on the VRM program.</li>
              <li><strong>Incident Reports:</strong> Analyze incident reports to identify any recurring issues or trends.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Analyze Program Metrics</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Recovery Time:</strong> Track the time it takes to recover vital records after a disruptive event.</li>
              <li><strong>Data Loss:</strong> Monitor the amount of data lost during recovery efforts.</li>
              <li><strong>Compliance Violations:</strong> Track any compliance violations related to vital records management.</li>
              <li><strong>Cost Analysis:</strong> Evaluate the cost-effectiveness of the VRM program.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Identify Areas for Improvement</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Based on the evaluation findings, identify specific areas for improvement in the VRM program.</li>
              <li>Develop action plans to address these areas and implement necessary changes.</li>
              <li>Prioritize improvements based on their impact and feasibility.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Regular Review and Updates</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The VRM program should be reviewed and updated regularly to ensure its continued effectiveness.</li>
              <li>Changes in technology, regulations, and organizational needs should be reflected in the program.</li>
              <li>Continuous improvement is essential for maintaining a robust VRM program.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Vital Records, Disaster Planning & Business Continuity</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vital Records</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Identification</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protection</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disaster Planning</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recovery</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Identify. Protect. Recover. Survive. 🛡️📂</p>
        </footer>

      </div>
    </div>
  );
};