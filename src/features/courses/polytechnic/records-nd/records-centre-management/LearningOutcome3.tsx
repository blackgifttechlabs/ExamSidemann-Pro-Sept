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
              Records Centre Procedures & <span className="text-purple-300 font-bold italic">Accessioning</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to consultations, transfer procedures, receiving records, accessioning steps, and issuing/returning procedures.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">centre_procedures.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CONSULT</span><span className="text-white">Stakeholders;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">TRANSFER</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">ACCESSION</span><span className="text-white">Materials;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Users className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Inbox className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: CONDUCTING CONSULTATIONS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Conducting Consultations on the Procedures to be Developed</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>When developing or standardizing records centre procedures, it's vital to involve key stakeholders to ensure the procedures are practical, effective, and accepted. Consultations provide a platform for gathering diverse perspectives and building consensus.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar size={20} /> Plan and Conduct Meetings/Workshops to Develop and Standardise Records Centre Procedures</h3>
            
            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><Target size={18} /> Planning Phase</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Define Objectives:</strong> Clearly articulate the goals of the meeting or workshop. What specific procedures are being developed or standardized? What outcomes are expected?</li>
              <li><strong>Identify Participants:</strong> Determine who needs to be involved. This includes records centre staff, representatives from various departments, IT personnel, legal counsel, and any other relevant stakeholders.</li>
              <li><strong>Develop an Agenda:</strong> Create a detailed agenda that outlines the topics to be discussed, the time allotted for each topic, and the expected outcomes.</li>
              <li><strong>Prepare Materials:</strong> Gather all necessary materials, such as existing procedures, relevant regulations, and background information. Create presentations, handouts, and worksheets.</li>
              <li><strong>Choose a Venue and Time:</strong> Select a suitable venue that can accommodate the participants and provide a comfortable environment. Choose a time that is convenient for most participants.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><MessageSquare size={18} /> Conducting Phase</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Facilitate Discussion:</strong> Encourage open and honest discussion among participants. Ensure that everyone has an opportunity to contribute.</li>
              <li><strong>Document Input:</strong> Appoint a note-taker to document all input, suggestions, and decisions made during the meeting or workshop.</li>
              <li><strong>Use Interactive Techniques:</strong> Incorporate interactive techniques, such as brainstorming, group discussions, and role-playing, to keep participants engaged.</li>
              <li><strong>Address Concerns:</strong> Address any concerns or questions raised by participants. Provide clear and concise explanations.</li>
              <li><strong>Reach Consensus:</strong> Work towards reaching consensus on the procedures to be developed or standardized. Document all agreed-upon procedures and any outstanding issues.</li>
              <li><strong>Follow Up:</strong> Distribute meeting minutes and action items to participants. Schedule follow-up meetings or workshops as needed.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Handshake size={20} /> Consult/Liaise with Key Records Stakeholders on How to Manage Records Prior to Transfer and on How to Carry Out the Transfer of Records to Records Centre</h3>
            
            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><Package size={18} /> Prior to Transfer</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identify Stakeholders:</strong> Determine which departments or individuals are responsible for creating and managing records that will be transferred to the records centre.</li>
              <li><strong>Establish Communication Channels:</strong> Establish clear communication channels with these stakeholders. This may involve regular meetings, email updates, or a dedicated communication platform.</li>
              <li><strong>Explain Retention Schedules:</strong> Clearly explain the organization's retention schedules and how they apply to the records being transferred. Provide guidance on how to identify and segregate records that have reached their retention period.</li>
              <li><strong>Provide Guidance on Preparation:</strong> Provide detailed instructions on how to prepare records for transfer, including proper labeling, boxing, and indexing.</li>
              <li><strong>Address Concerns and Questions:</strong> Address any concerns or questions stakeholders may have about the transfer process.</li>
              <li><strong>Develop Transfer Forms:</strong> Create standardized transfer forms to document the transfer of records.</li>
            </ul>

            <h4 className="text-lg font-semibold mt-3 flex items-center gap-2"><Send size={18} /> Transfer of Records</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Coordinate Transfer Logistics:</strong> Coordinate the logistics of the transfer, including scheduling, transportation, and receiving procedures.</li>
              <li><strong>Provide Training:</strong> Provide training to stakeholders on how to complete transfer forms and prepare records for shipment.</li>
              <li><strong>Conduct Pre-Transfer Inspections:</strong> Conduct pre-transfer inspections to ensure that records are properly prepared and labeled.</li>
              <li><strong>Document the Transfer:</strong> Document the transfer of records, including the date, time, and method of transfer.</li>
              <li><strong>Provide Confirmation:</strong> Provide confirmation to stakeholders that their records have been received and processed by the records centre.</li>
              <li><strong>Establish a Feedback Loop:</strong> Establish a feedback loop to gather input from stakeholders on the transfer process and identify areas for improvement.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: PROCEDURES FOLLOWED WHEN LIAISING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Procedures Followed When Liaising with Records Officers and Receiving Records at the Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Effective liaison with records officers and a well-defined records reception process are critical for the smooth operation of a records centre. These procedures ensure that records are transferred and accessioned accurately and efficiently.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><MessageSquare size={20} /> Liaising with Records Officers</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Initial Contact and Communication:</strong> The records centre staff initiates contact with records officers from various departments to schedule transfers and provide guidance. This involves establishing clear communication channels, such as regular meetings, email updates, or a designated communication platform. The goal is to build a collaborative relationship and ensure that records officers understand the transfer process.</li>
              <li><strong>Provision of Transfer Guidelines and Forms:</strong> The records centre provides comprehensive guidelines and standardized transfer forms to the records officers. These materials outline the required procedures for preparing records for transfer, including proper labeling, boxing, and indexing. The guidelines also detail the organization's retention schedules and disposal policies, ensuring that records officers understand which records are eligible for transfer.</li>
              <li><strong>Pre-Transfer Consultation and Training:</strong> Records centre staff conducts pre-transfer consultations and training sessions to address any questions or concerns records officers may have. This involves providing detailed explanations of the transfer process, demonstrating proper record preparation techniques, and clarifying any ambiguities. The aim is to ensure that records officers are well-prepared and confident in their ability to transfer records correctly.</li>
              <li><strong>Scheduling and Coordination of Transfers:</strong> The records centre coordinates the scheduling of record transfers with the records officers, taking into account departmental needs and the records centre's capacity. This involves establishing a transfer schedule, arranging for transportation, and ensuring that adequate resources are available to receive the records.</li>
              <li><strong>Verification of Transfer Documentation:</strong> Before the physical transfer, records centre staff verifies that all transfer documentation is complete and accurate. This includes ensuring that transfer forms are properly filled out and that the records listed on the forms match the records being transferred.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Inbox size={20} /> Receiving Records at the Records Centre</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Initial Inspection and Verification:</strong> Upon arrival, records centre staff conducts an initial inspection of the transferred records to ensure that they are properly packaged and labeled. They verify that the records match the accompanying transfer documentation and note any discrepancies.</li>
              <li><strong>Unpacking and Sorting:</strong> Records are carefully unpacked and sorted according to their format, department of origin, and retention schedule. This stage allows for a preliminary assessment of the records' condition and helps to identify any immediate preservation needs.</li>
              <li><strong>Condition Assessment:</strong> A condition assessment is performed to evaluate the physical state of the records. This involves checking for damage, such as tears, mold, or water damage, and documenting any findings. This assessment helps to determine if any conservation treatments are required.</li>
              <li><strong>Inventory and Indexing:</strong> Records are inventoried and indexed using the records centre's inventory management system. This involves assigning unique identifiers to each record, entering metadata into the system, and creating a detailed index that facilitates efficient retrieval.</li>
              <li><strong>Storage and Placement:</strong> Records are stored in designated locations within the records centre, according to their format and retention schedule. They are placed on shelves or in storage containers that provide adequate protection and facilitate retrieval.</li>
              <li><strong>Data Entry and System Update:</strong> Information about the received records is entered into the records centre's database or electronic records management system. This includes metadata, location information, and retention details. The system is updated to reflect the new records, ensuring that the inventory is accurate and up-to-date.</li>
              <li><strong>Confirmation and Communication:</strong> The records centre provides confirmation to the transferring department or records officer that the records have been received and accessioned. This involves sending a confirmation email or letter and updating the department's records management system.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: STEPS TAKEN TO ACCESSION RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps Taken to Accession Records</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Verification of Transfer Documentation:</strong> Records centre staff verifies the accuracy and completeness of transfer forms, ensuring that all necessary information is provided.</li>
              <li><strong>Physical Inspection:</strong> A physical inspection of the records is conducted to assess their condition and verify that they match the transfer documentation.</li>
              <li><strong>Assignment of Accession Numbers:</strong> Unique accession numbers are assigned to each batch of records for tracking and identification purposes.</li>
              <li><strong>Data Entry into Inventory System:</strong> Metadata about the records, including department of origin, record type, and retention details, is entered into the records centre's inventory system.</li>
              <li><strong>Creation of Indexing Information:</strong> Indexing information is created to facilitate efficient retrieval of records, including subject headings, keywords, and file numbers.</li>
              <li><strong>Placement in Designated Storage Area:</strong> Records are placed in designated storage areas according to their format and retention schedule.</li>
              <li><strong>Update of Records Management System:</strong> The records management system is updated to reflect the accessioned records, ensuring that the inventory is accurate and up-to-date.</li>
              <li><strong>Confirmation of Receipt:</strong> Confirmation is provided to the transferring department or records officer that the records have been received and accessioned.</li>
            </ol>
          </div>
        </section>

        {/* ========== SECTION 4: ISSUING OUT AND RETURNING RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps Followed When Issuing Out and Returning Records in the Records Centre</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The process of issuing and returning records in a records centre must be carefully managed to ensure accountability, security, and efficient tracking. These procedures are essential for maintaining the integrity of the records and providing timely access to authorized users.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Send size={20} /> Issuing Out Records</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Request Submission:</strong> The process begins with an authorized user submitting a request for a specific record. This request can be made through various channels, such as a physical request form, an email, or an electronic records management system. The request should clearly identify the record needed, including its title, file number, or accession number, and specify the purpose of the request and the intended duration of the loan.</li>
              <li><strong>Verification and Authorization:</strong> Records centre staff verifies the user's authorization to access the requested record. This may involve checking their identification, verifying their department or role, and ensuring that they have the necessary permissions. The staff also confirms the availability of the record and checks its current status in the inventory system.</li>
              <li><strong>Record Retrieval:</strong> Once the request is authorized, records centre staff retrieves the record from its designated storage location. This involves locating the record using the inventory system or physical index and carefully removing it from its storage container. The staff ensures that the record is handled with care to prevent damage.</li>
              <li><strong>Issuance Documentation:</strong> The issuance of the record is meticulously documented. This includes recording the user's name, department, contact information, the date and time of issuance, and the expected return date. The record's status in the inventory system is updated to reflect that it is currently on loan. A loan slip or tracking form may be used to document this information, and the user may be required to sign a receipt acknowledging their responsibility for the record.</li>
              <li><strong>Record Preparation:</strong> Before issuing the record, records centre staff may perform a brief condition check to ensure that it is in good condition. Any existing damage or issues are noted, and the user is informed. The record may be placed in a protective folder or container to prevent further damage during transport and use.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><RefreshCw size={20} /> Returning Records</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Record Receipt and Verification:</strong> Upon return, records centre staff receives the record and verifies that it is the same record that was issued. They check the record's condition and compare it to the notes made during the issuance. Any new damage or discrepancies are documented.</li>
              <li><strong>Return Documentation:</strong> The return of the record is documented in the inventory system. The loan slip or tracking form is updated to reflect the return date and time. The user's signature is obtained to confirm the return, if needed. The record's status in the inventory system is updated to indicate that it is now available for storage.</li>
              <li><strong>Condition Check and Maintenance:</strong> Records centre staff performs a more thorough condition check of the returned record. If any damage is found, appropriate conservation or repair measures are taken. The record may be cleaned or treated to ensure its long-term preservation.</li>
              <li><strong>Record Placement and Storage:</strong> The record is returned to its designated storage location. This involves placing it in its proper storage container and ensuring that it is correctly positioned on the shelf or in the storage unit. The location of the record is verified in the inventory system to ensure accuracy.</li>
              <li><strong>System Update and Confirmation:</strong> The inventory system is updated to reflect the record's return and its current location. Any notes or comments regarding the record's condition or use are entered into the system. The user may receive a confirmation that the record has been returned and processed.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Records Centre Procedures & Accessioning</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Consultations</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Liaising</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accessioning</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Issuing</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Returning</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Consult. Transfer. Accession. Issue. Return. 📂🔄</p>
        </footer>

      </div>
    </div>
  );
};