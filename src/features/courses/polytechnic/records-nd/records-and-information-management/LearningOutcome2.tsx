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
              Document Control Systems & <span className="text-sky-300 font-bold italic">Records Management</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to document control setup, policies, procedures, challenges, software, roles, and digital paper trails.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">document_control.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CONTROL</span><span className="text-white">Documents;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MANAGE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">COMPLY</span><span className="text-white">Standards;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><FileText className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: STEPS IN SETTING UP A DOCUMENT CONTROL SYSTEM ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps in Setting Up a Document Control System and Framework</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> 1. Needs Assessment and Planning</h3>
            <p>Begin by assessing the organization's needs and requirements for document control. This includes identifying the types of documents that need to be controlled, the volume of documents, and the regulatory requirements that apply.</p>
            <p>Develop a plan that outlines the goals, objectives, and scope of the document control system.</p>
            <p>Determine the resources required, including personnel, technology, and budget.</p>
            <p>This is like planning a project, figuring out what you need, and how to get it done.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> 2. Define Document Control Procedures</h3>
            <p>Establish clear and concise procedures for document creation, review, approval, distribution, revision, and disposal.</p>
            <p>Define roles and responsibilities for each step in the document lifecycle.</p>
            <p>Develop standardized templates and formats for documents.</p>
            <p>This means making clear rules about how documents are handled.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> 3. Implement a Document Management System (DMS)</h3>
            <p>Select and implement a suitable DMS to automate document control processes.</p>
            <p>Configure the DMS to meet the organization's specific needs and requirements.</p>
            <p>Ensure that the DMS provides features such as version control, access control, and audit trails.</p>
            <p>This is where you use computer programs to help manage the documents.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 4. Train Personnel</h3>
            <p>Provide comprehensive training to all personnel involved in document control.</p>
            <p>Ensure that personnel understand the procedures and how to use the DMS.</p>
            <p>Regularly reinforce training to maintain compliance.</p>
            <p>This is teaching everyone how to use the new system.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Folder size={20} /> 5. Establish a Document Repository</h3>
            <p>Create a centralized repository for storing and managing controlled documents.</p>
            <p>Organize the repository in a logical and consistent manner.</p>
            <p>Implement access controls to ensure that only authorized personnel can access documents.</p>
            <p>This is like creating a safe place to store all the documents.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> 6. Implement Version Control</h3>
            <p>Establish a system for tracking and managing document versions.</p>
            <p>Ensure that only the latest approved version of a document is available for use.</p>
            <p>Maintain an audit trail of all document revisions.</p>
            <p>This means keeping track of changes to documents.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> 7. Conduct Regular Audits</h3>
            <p>Conduct regular audits to ensure that the document control system is effective and compliant.</p>
            <p>Identify and address any deficiencies or areas for improvement.</p>
            <p>Document audit findings and corrective actions.</p>
            <p>This is checking to make sure the system is working correctly.</p>
          </div>
        </section>

        {/* ========== SECTION 2: CREATING INFORMATION AND DOCUMENTATION POLICIES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Creating Information and Documentation Policies and Procedures</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Creating effective information and documentation policies and procedures is essential for establishing a strong document control framework.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Policy Development</h3>
            <p>Policies should define the overall principles and guidelines for information and documentation management.</p>
            <p>They should address areas such as document creation, approval, distribution, retention, and disposal.</p>
            <p>Policies should be aligned with legal and regulatory requirements.</p>
            <p>This is writing the rules.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Procedure Development</h3>
            <p>Procedures provide detailed, step-by-step instructions for implementing policies.</p>
            <p>They should be clear, concise, and easy to understand.</p>
            <p>Procedures should be documented and readily accessible to all personnel.</p>
            <p>This is writing the instructions on how to follow the rules.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Review and Approval</h3>
            <p>Policies and procedures should be reviewed and approved by relevant stakeholders.</p>
            <p>Regularly review and update policies and procedures to ensure they remain current and effective.</p>
            <p>This is making sure the rules are good, and up to date.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Communication and Training</h3>
            <p>Communicate policies and procedures to all personnel.</p>
            <p>Provide training on how to implement and follow policies and procedures.</p>
            <p>This is telling everyone the rules, and how to follow them.</p>
          </div>
        </section>

        {/* ========== SECTION 3: REASONS FOR POOR DOCUMENT CONTROL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Reasons for Poor Document Control</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Poor document control can lead to numerous problems, including errors, inefficiencies, and compliance violations. Here are some common reasons:</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lack of Clear Policies and Procedures:</strong> Without well-defined policies and procedures, employees may not understand how to properly create, manage, and distribute documents. This leads to inconsistency and errors. Essentially, if there are no clear rules, people will make their own, and that leads to chaos.</li>
              <li><strong>Inadequate Training:</strong> Employees may not have received adequate training on document control procedures and the use of document management systems. If people don't know how to use the system, they will make mistakes.</li>
              <li><strong>Reliance on Manual Processes:</strong> Manual document control processes are often time-consuming, error-prone, and difficult to manage. Paper systems are slow and easy to mess up.</li>
              <li><strong>Lack of Version Control:</strong> Without proper version control, it can be difficult to track changes to documents and ensure that the latest version is being used. This means that old, out of date documents might be used.</li>
              <li><strong>Poor Document Organization:</strong> Documents may be stored in disorganized or inconsistent ways, making it difficult to find and retrieve them. If you can't find the document, it is useless.</li>
              <li><strong>Insufficient Access Controls:</strong> Unauthorized personnel may have access to sensitive documents, increasing the risk of data breaches and compliance violations. This means that people who should not see the documents, can see them.</li>
              <li><strong>Lack of Regular Audits:</strong> Without regular audits, it can be difficult to identify and correct problems in the document control system. If you don't check the system, you won't know if it is broken.</li>
              <li><strong>Resistance to Change:</strong> Employees may resist adopting new document control systems or procedures, particularly if they are perceived as complex or time-consuming. People don't like change.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: RECOMMENDATIONS TO IMPROVE DOCUMENT CONTROL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Recommendations to Improve Document Control</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>To improve document control, organizations should implement the following recommendations:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Develop and Implement Clear Policies and Procedures:</strong> Create comprehensive policies and procedures that cover all aspects of document control. Ensure that policies and procedures are clearly written, easy to understand, and readily accessible to all employees. Write the rules clearly, and make sure everyone can find them.</li>
              <li><strong>Provide Comprehensive Training:</strong> Provide thorough training on document control procedures and the use of document management systems. Regularly reinforce training to maintain compliance and address any questions or concerns. Teach everyone how to use the system properly.</li>
              <li><strong>Implement a Document Management System (DMS):</strong> Automate document control processes using a suitable DMS. Select a DMS that meets the organization's specific needs and requirements. Use computer programs to manage the documents.</li>
              <li><strong>Establish a Robust Version Control System:</strong> Implement a system for tracking and managing document versions. Ensure that only the latest approved version of a document is available for use. Keep track of all changes to the documents.</li>
              <li><strong>Organize Documents Effectively:</strong> Establish a centralized document repository with a logical and consistent organizational structure. Use metadata and tagging to improve document search and retrieval. Organize the documents so they are easy to find.</li>
              <li><strong>Implement Strong Access Controls:</strong> Restrict access to sensitive documents to authorized personnel only. Regularly review and update access controls to ensure they remain effective. Limit who can see the documents.</li>
              <li><strong>Conduct Regular Audits:</strong> Conduct regular audits to assess the effectiveness of the document control system. Identify and address any deficiencies or areas for improvement. Check the system regularly.</li>
              <li><strong>Foster a Culture of Compliance:</strong> Promote a culture of compliance and accountability for document control. Communicate the importance of document control to all employees. Make everyone care about doing it right.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: DEFINING DOCUMENT CONTROL PROCESSES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Defining Document Control Processes</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Document control processes are the systematic procedures used to manage the creation, review, approval, distribution, revision, and disposal of documents within an organization. These processes ensure that documents are accurate, up-to-date, and accessible to authorized personnel. In simpler terms, it's the set of rules and steps a company takes to manage its important paperwork.</p>
          </div>
        </section>

        {/* ========== SECTION 6: DOCUMENT CONTROL FUNCTIONS AND OPERATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Document Control Functions and Operations</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Document control functions and operations involve a range of activities that ensure the integrity and accessibility of documents. These include:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Document Creation and Numbering:</strong> Establishing standardized templates and assigning unique identifiers to documents. This is like giving each document a special name and format.</li>
              <li><strong>Document Review and Approval:</strong> Ensuring that documents are reviewed and approved by authorized personnel before distribution. This is like getting a boss to sign off on a document.</li>
              <li><strong>Document Distribution:</strong> Distributing approved documents to relevant stakeholders in a timely manner. This is making sure the right people get the document.</li>
              <li><strong>Version Control:</strong> Tracking and managing different versions of documents to ensure that only the latest approved version is used. This is keeping track of changes to a document.</li>
              <li><strong>Document Storage and Retrieval:</strong> Storing documents in a secure and organized manner to facilitate easy retrieval. This is like having a good filing system.</li>
              <li><strong>Document Revision and Modification:</strong> Managing the process of revising and modifying documents, including tracking changes and obtaining approvals. This is how changes are made to the documents.</li>
              <li><strong>Document Disposal:</strong> Establishing procedures for the secure disposal of obsolete or redundant documents. This is how old documents are destroyed.</li>
              <li><strong>Audit Trails:</strong> Keeping records of who accessed, changed, or approved a document.</li>
              <li><strong>Access Control:</strong> Limiting who can see or change a document.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: SOFTWARE PACKAGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Software Packages Used by Document Controllers and Their Functions</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Document controllers use a variety of software packages to automate and streamline document control processes. Some common types include:</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Document Management Systems (DMS):</strong> Functions: Centralized document storage, version control, workflow automation, access control, and audit trails. Examples: SharePoint, Documentum, OpenText, Alfresco. These programs are the main tool for organizing and managing digital documents.</li>
              <li><strong>Content Management Systems (CMS):</strong> Functions: Managing digital content, including documents, images, and videos, with features for version control, collaboration, and publishing. Examples: WordPress, Drupal, Joomla. These are used for managing website content, but can also be used for other digital content.</li>
              <li><strong>Project Management Software:</strong> Functions: Managing project documents, tracking revisions, and facilitating collaboration among project team members. Examples: Microsoft Project, Asana, Trello, Jira. These help manage projects, and the documents associated with them.</li>
              <li><strong>Quality Management Systems (QMS):</strong> Functions: Managing quality-related documents, such as procedures, work instructions, and audit reports, with features for compliance and audit trails. Examples: ISO 9001 compliant software, EtQ Reliance. These help companies maintain quality standards.</li>
              <li><strong>Collaboration Tools:</strong> Functions: Allow multiple people to work on the same document at the same time, track changes, and communicate about the document. Examples: Google Docs, Microsoft 365. These allow team work on documents.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 8: ROLES OF A DOCUMENT CONTROLLER ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Roles of a Document Controller</h2>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Document Management:</strong> Creating, organizing, and maintaining document repositories. Ensuring that documents are stored and retrieved efficiently: This means being in charge of all the documents.</li>
              <li><strong>Version Control:</strong> Tracking and managing document revisions to ensure that only the latest approved versions are used. This is keeping track of all the changes to a document.</li>
              <li><strong>Document Distribution:</strong> Distributing documents to relevant stakeholders in a timely and accurate manner. This is making sure the right people get the right documents.</li>
              <li><strong>Document Control Procedures:</strong> Implementing and enforcing document control procedures and policies. This is making sure everyone follows the rules about documents.</li>
              <li><strong>Document Numbering and Identification:</strong> Assigning unique identifiers and numbers to documents for easy tracking and retrieval. This is giving each document a unique name.</li>
              <li><strong>Document Auditing and Compliance:</strong> Conducting regular audits to ensure compliance with document control procedures and regulatory requirements. This is checking to make sure the system is working correctly.</li>
              <li><strong>Training and Support:</strong> Providing training and support to employees on document control procedures and the use of document management systems. This is teaching people how to use the system.</li>
              <li><strong>Record Keeping:</strong> Maintaining records of document creation, revisions, distributions and disposals.</li>
              <li><strong>Access Control:</strong> Managing who has access to which documents.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: CHALLENGES IN DOCUMENT CONTROL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Challenges in Document Control</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Volume of Documents:</strong> Managing a large volume of documents can be overwhelming and time-consuming. There can be too many documents to handle easily.</li>
              <li><strong>Version Control Complexity:</strong> Tracking and managing multiple versions of documents can be complex and prone to errors. Keeping track of changes can be hard.</li>
              <li><strong>Lack of Standardization:</strong> Inconsistent document formats and procedures can lead to confusion and errors. If there are no set formats, confusion occurs.</li>
              <li><strong>Resistance to Change:</strong> Employees may resist adopting new document control systems or procedures. People don't like new systems.</li>
              <li><strong>Technology Challenges:</strong> Implementing and maintaining document management systems can be challenging. Technology can be difficult to manage.</li>
              <li><strong>Compliance Requirements:</strong> Keeping up with evolving regulatory requirements can be difficult. Rules are always changing.</li>
              <li><strong>Information Security:</strong> Ensuring that sensitive documents are protected from unauthorized access.</li>
              <li><strong>Collaboration Challenges:</strong> Facilitating document collaboration among team members in different locations.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 10: ADVANTAGES OF MAINTAINING DIGITAL PAPER TRAILS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Advantages of Maintaining Digital Paper Trails of Controlled Documents</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Enhanced Accessibility:</strong> Digital documents transcend physical limitations, allowing authorized users to access them from any location with an internet connection. This accessibility significantly enhances collaboration, particularly in today's increasingly remote work environments.</li>
              <li><strong>Improved Searchability:</strong> The ability to instantly search digital documents using keywords and metadata revolutionizes information retrieval. This dramatically saves time and effort, increasing productivity and enabling faster decision-making.</li>
              <li><strong>Version Control and Audit Trails:</strong> Digital systems provide robust version control, ensuring that only the latest approved versions of documents are used. This level of transparency and accountability is crucial for compliance and quality control.</li>
              <li><strong>Increased Security:</strong> Digital documents can be fortified with sophisticated security measures, including access controls, encryption, and authentication protocols.</li>
              <li><strong>Reduced Storage Costs:</strong> By eliminating the need for physical storage space, digital document management significantly reduces costs associated with filing cabinets, off-site storage facilities, and related expenses.</li>
              <li><strong>Improved Collaboration:</strong> Digital documents facilitate real-time collaboration, allowing multiple users to work on the same document simultaneously.</li>
              <li><strong>Environmental Sustainability:</strong> The transition to digital paper trails significantly reduces paper consumption, contributing to environmental sustainability.</li>
              <li><strong>Disaster Recovery:</strong> Digital documents can be backed up and stored in multiple secure locations, including cloud-based servers.</li>
              <li><strong>Compliance:</strong> Digital systems can automate the process of adhering to regulations, with automatic audit trails, and document integrity checks.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 11: APPLYING KEY CONCEPTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applying Key Document Control and Records Management Concepts and Techniques</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Classification and Indexing:</strong> Establish a consistent classification system to categorize documents based on their content, purpose, and other relevant criteria. This keeps all the documents organized, and easy to find.</li>
              <li><strong>Lifecycle Management:</strong> Manage documents and records throughout their entire lifecycle, from creation to disposal. This means managing the document from when it is created, until it is deleted.</li>
              <li><strong>Version Control:</strong> Implement a robust version control system to track changes and ensure that only the latest approved versions of documents are used.</li>
              <li><strong>Access Control:</strong> Implement access controls to restrict access to sensitive documents and records, ensuring that only authorized personnel can access confidential information.</li>
              <li><strong>Audit Trails:</strong> Maintain comprehensive audit trails to track all document activities, including creation, revisions, access, and disposal.</li>
              <li><strong>Retention and Disposal:</strong> Establish clear retention schedules and disposal procedures to ensure that records are retained for the required period and disposed of securely when no longer needed.</li>
              <li><strong>Digital Preservation:</strong> Implement strategies for the long-term preservation of digital records, ensuring that they remain accessible and usable over time.</li>
              <li><strong>Standardization:</strong> Create standard document formats, and naming conventions.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Document Control Systems & Records Management</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Document Control</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Policies & Procedures</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">DMS</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Version Control</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Compliance</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Control. Manage. Comply. Succeed. 📋✅</p>
        </footer>

      </div>
    </div>
  );
};