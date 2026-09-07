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

  const colors = ['blue', 'green', 'purple', 'amber', 'red', 'indigo'];

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
              Records & Information Management: Module LO6
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Records Procedure Manuals & <span className="text-cyan-300 font-bold italic">Policy Documentation</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to records procedure manuals, purposes, development steps, key elements, types, and evaluation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">procedure_manuals.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">STANDARDIZE</span><span className="text-white">Procedures;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">DOCUMENT</span><span className="text-white">Manuals;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">TRAIN</span><span className="text-white">Staff;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><FileText className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><BookOpen className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: RECORDS PROCEDURE MANUALS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Procedure Manuals</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A records procedure manual is a comprehensive document that outlines the standardized processes and guidelines for managing records within an organization. It serves as a reference guide for employees, detailing how records should be created, stored, retrieved, maintained, and disposed of, ensuring consistency and compliance.</p>
          </div>
        </section>

        {/* ========== SECTION 2: PURPOSES/FUNCTIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Purposes/Functions of a Records Management Manual</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Standardize Procedures</h3>
            <p>The manual establishes uniform processes for handling records across the organization. This ensures that all employees follow the same procedures, regardless of their department or location. Standardization promotes consistency, reduces errors, and improves efficiency in records management practices.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Establishes Responsibility</h3>
            <p>The manual clearly defines roles and responsibilities related to records management. It specifies who is accountable for different tasks, such as record creation, classification, retention, and disposal. This clarity helps to ensure that all records management activities are carried out effectively and that there is accountability for compliance.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Assists in Employee Training</h3>
            <p>The manual serves as a valuable resource for training new employees and providing ongoing training to existing staff. It provides clear and concise instructions on records management procedures, helping employees to understand their roles and responsibilities. This contributes to a more knowledgeable and competent workforce.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Provides Updates for Procedures</h3>
            <p>The manual acts as a central repository for all records management procedures, making it easy to update and distribute changes. When regulations or organizational policies change, the manual can be updated to reflect these changes, ensuring that all employees are working with the most current information. This helps to maintain compliance and prevent errors due to outdated procedures.</p>
          </div>
        </section>

        {/* ========== SECTION 3: STEPS INVOLVED IN DEVELOPING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps Involved in Developing Records Management Manuals</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Needs Assessment and Planning</h3>
            <p>Begin by assessing the organization's specific records management needs. This includes identifying the types of records, the regulatory requirements, and the existing records management practices. Define the scope and objectives of the manual, outlining what it should cover and who it will serve.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Research and Information Gathering</h3>
            <p>Gather relevant information from various sources, including legal and regulatory documents, industry best practices, and internal policies. Consult with subject matter experts and stakeholders to ensure the manual reflects accurate and up-to-date information.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Layout size={20} /> Structure and Content Development</h3>
            <p>Develop a clear and logical structure for the manual. This includes creating sections and subsections that cover all aspects of records management, such as record creation, classification, storage, retrieval, retention, and disposal. Write clear and concise content that is easy for employees to understand and follow.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Procedure Documentation</h3>
            <p>Document all records management procedures in detail. Use step-by-step instructions, flowcharts, and diagrams to illustrate complex processes. Ensure that the procedures are consistent with organizational policies and regulatory requirements.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Review and Approval</h3>
            <p>Have the manual reviewed by relevant stakeholders, including legal counsel, compliance officers, and department heads. Incorporate their feedback and make any necessary revisions. Obtain formal approval from senior management before finalizing the manual.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Edit size={20} /> Formatting and Design</h3>
            <p>Format the manual in a user-friendly manner, using clear headings, subheadings, and bullet points. Ensure that the manual is visually appealing and easy to navigate. Consider creating both print and electronic versions for easy access.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Training and Communication</h3>
            <p>Develop and deliver training programs to educate employees on the contents of the manual. Communicate the importance of following the procedures and provide ongoing support to ensure compliance.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Maintenance and Updates</h3>
            <p>Establish a process for regularly reviewing and updating the manual. This ensures that it remains current and accurate. Assign responsibility for maintaining the manual and communicating any changes to employees.</p>
          </div>
        </section>

        {/* ========== SECTION 4: KEY ELEMENTS TO INCLUDE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Key Elements to Include in a Records Procedure Manual</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Introduction and Purpose:</strong> Begin with an introduction that explains the purpose of the manual and its importance to the organization. Outline the scope of the manual and its intended audience.</li>
              <li><strong>Definitions and Terminology:</strong> Provide a glossary of key terms and definitions related to records management. This ensures that everyone understands the terminology used in the manual and avoids confusion.</li>
              <li><strong>Roles and Responsibilities:</strong> Clearly define the roles and responsibilities of individuals and departments involved in records management. This includes specifying who is responsible for creating, storing, retrieving, and disposing of records.</li>
              <li><strong>Record Creation and Capture:</strong> Outline procedures for creating and capturing records, including electronic and physical records. This should cover standards for document formatting, naming conventions, and metadata requirements.</li>
              <li><strong>Record Classification and Indexing:</strong> Describe the organization's record classification system and provide instructions on how to classify and index records. This helps to ensure that records are organized and easily retrievable.</li>
              <li><strong>Record Storage and Retrieval:</strong> Detail the procedures for storing and retrieving records, including both physical and electronic storage. This should cover access control, security measures, and procedures for requesting and retrieving records.</li>
              <li><strong>Record Retention and Disposition:</strong> Provide the organization's record retention schedule and outline procedures for disposing of records. This should cover legal and regulatory requirements, as well as procedures for secure destruction.</li>
              <li><strong>Electronic Records Management:</strong> Include specific procedures for managing electronic records, such as email, electronic documents, and databases. This should cover electronic document and records management systems (EDRMS) and other relevant technologies.</li>
              <li><strong>Compliance and Legal Requirements:</strong> Outline the legal and regulatory requirements related to records management, including data privacy and security regulations. This ensures that employees understand their obligations and the importance of compliance.</li>
              <li><strong>Disaster Recovery and Business Continuity:</strong> Describe the procedures for recovering records in the event of a disaster or disruption. This should cover backup procedures, off-site storage, and disaster recovery plans.</li>
              <li><strong>Training and Support:</strong> Provide information on training programs and support resources available to employees. This ensures that everyone has the knowledge and skills necessary to manage records effectively.</li>
              <li><strong>Manual Maintenance and Updates:</strong> Explain the process by which the manual will be maintained and updated. Include who is responsible for updates and how often reviews will take place.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: TYPES OF MANUALS USED BY ORGANIZATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Manuals Used by Organizations</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Policy Manuals</h3>
            <p>Policy manuals outline the organization's rules, principles, and guidelines. They define the standards of behavior and expectations for employees, covering areas such as ethics, conduct, and compliance. For example, a policy manual might detail the organization's policy on data privacy, harassment, or conflict of interest.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SettingsIcon size={20} /> Operational Manuals</h3>
            <p>Operational manuals provide detailed instructions on how to perform specific tasks or processes. They guide employees through the steps involved in carrying out their job duties, ensuring consistency and efficiency. For example, an operational manual might detail the procedures for processing customer orders, operating machinery, or conducting inventory checks.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><LayersIcon size={20} /> Organizational Manuals</h3>
            <p>Organizational manuals describe the structure, roles, and responsibilities within an organization. They outline the chain of command, reporting relationships, and communication channels. These manuals help employees understand how the organization is structured and how their roles fit within the overall framework. An organizational chart is often included in these manuals.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Administrative Manuals</h3>
            <p>Administrative manuals provide guidelines for administrative tasks and procedures, such as record keeping, budgeting, and procurement. They ensure that administrative functions are carried out efficiently and consistently. For example, an administrative manual might detail the procedures for submitting expense reports, managing travel arrangements, or handling correspondence.</p>
          </div>
        </section>

        {/* ========== SECTION 6: REASONS FOR EVALUATING RECORDS MANAGEMENT MANUALS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Reasons for Evaluating Records Management Manuals</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ensuring Compliance:</strong> Regulations and legal requirements related to records management can change frequently. Evaluations ensure that the manual remains compliant with current laws and standards, reducing the risk of legal penalties and ensuring proper data governance.</li>
              <li><strong>Improving Efficiency:</strong> Evaluating manuals helps identify outdated or inefficient procedures. By streamlining processes and updating instructions, organizations can improve the efficiency of records management activities.</li>
              <li><strong>Maintaining Accuracy:</strong> Over time, information in manuals can become outdated or inaccurate. Evaluations ensure that the content remains accurate and reflects current organizational practices.</li>
              <li><strong>Enhancing User Experience:</strong> Evaluations provide an opportunity to gather feedback from employees who use the manuals. This feedback can be used to improve the clarity, usability, and accessibility of the manuals.</li>
              <li><strong>Adapting to Technological Changes:</strong> Technology plays a crucial role in records management. Evaluations allow organizations to assess whether the manual adequately addresses the use of new technologies and ensures that procedures are aligned with current systems.</li>
              <li><strong>Mitigating Risks:</strong> Records management is critical for mitigating risks related to data loss, security breaches, and legal challenges. Evaluations help identify potential vulnerabilities in the manual and ensure that appropriate safeguards are in place.</li>
              <li><strong>Supporting Training and Onboarding:</strong> Records management manuals are essential tools for training new employees. Evaluations ensure that the manuals are clear, comprehensive, and effective in conveying the necessary information.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: EVALUATING MANUALS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Evaluating Manuals</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Content Accuracy and Completeness:</strong> Ensure that the manual contains accurate and up-to-date information. Verify that all essential procedures and guidelines are included.</li>
              <li><strong>Clarity and Readability:</strong> Assess the clarity and readability of the manual. Use plain language, avoid jargon, and ensure that instructions are easy to understand.</li>
              <li><strong>Usability and Accessibility:</strong> Evaluate the usability of the manual. Ensure that it is easy to navigate, search, and access relevant information.</li>
              <li><strong>Compliance with Regulations:</strong> Verify that the manual complies with all applicable laws, regulations, and industry standards.</li>
              <li><strong>Consistency and Standardization:</strong> Ensure that procedures are consistent across all sections of the manual and that standardized processes are followed.</li>
              <li><strong>Effectiveness of Training Materials:</strong> Assess whether the manual effectively supports training and onboarding processes.</li>
              <li><strong>Currency and Relevance:</strong> Determine if the manual is up-to-date and reflects current organizational practices and technological advancements.</li>
              <li><strong>Feedback Integration:</strong> Check that previous feedback has been integrated into the current version of the manual.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 6 — Records Procedure Manuals & Policy Documentation</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Purpose & Functions</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Development Steps</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Key Elements</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Types of Manuals</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Evaluation</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Document. Standardize. Train. Evaluate. 📘📋</p>
        </footer>

      </div>
    </div>
  );
};