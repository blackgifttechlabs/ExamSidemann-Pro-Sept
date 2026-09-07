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
  Drill, Recycle, Leaf, Flower, BookMarked, Library, PanelTop, Scan, ThumbsDown,Copy,
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

export const LearningOutcome5: React.FC = () => {
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Records & Information Management: Module LO5
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Integrated Risk Management & <span className="text-rose-300 font-bold italic">Records Programs</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to IRM benefits, drawbacks, IRMP goals, components, development stages, sustaining, reviewing, and evaluation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">integrated_risk_management.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">INTEGRATE</span><span className="text-white">Risk;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MANAGE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SUSTAIN</span><span className="text-white">Programs;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Shield className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Database className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: INTEGRATED RISK MANAGEMENT (IRM) ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Integrated Risk Management (IRM)</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Integrated Risk Management (IRM) is a holistic approach to managing an organization's diverse risks. Instead of handling risks in isolated silos, IRM aims to create a unified framework that allows organizations to understand, assess, and respond to risks across all areas of the business. This approach emphasizes a comprehensive view of risk, enabling better decision-making and improved organizational resilience.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsUp size={20} /> Benefits of IRM</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Comprehensive Risk View:</strong> IRM provides a complete picture of an organization's risk landscape, allowing for the identification of interconnected risks that might be missed in a fragmented approach. This helps in understanding how risks in one area can affect others.</li>
              <li><strong>Improved Decision-Making:</strong> By having a unified risk view, organizations can make more informed decisions. IRM helps in prioritizing risks and allocating resources effectively to mitigate the most critical threats.</li>
              <li><strong>Enhanced Efficiency:</strong> IRM streamlines risk management processes, reducing redundancy and improving efficiency. This can lead to cost savings and better resource utilization.</li>
              <li><strong>Increased Compliance:</strong> IRM helps organizations stay compliant with relevant regulations and standards by providing a structured approach to risk management.</li>
              <li><strong>Greater Organizational Resilience:</strong> By proactively identifying and mitigating risks, IRM enhances an organization's ability to withstand disruptions and recover quickly from adverse events.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ThumbsDown size={20} /> Drawbacks of IRM</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Implementation Complexity:</strong> Implementing IRM can be complex and challenging, requiring significant changes to organizational processes and culture. Integrating diverse risk management systems and data can be difficult.</li>
              <li><strong>Resource Intensive:</strong> IRM implementation and maintenance can be resource-intensive, requiring investments in technology, personnel, and training.</li>
              <li><strong>Resistance to Change:</strong> Organizations may face resistance to change from employees and departments accustomed to working in silos. Overcoming this resistance requires strong leadership and effective communication.</li>
              <li><strong>Potential for Over-Reliance:</strong> There is a danger of over reliance on the IRM system. If the system is not maintained correctly, or if new risks emerge that were not accounted for, then the system could give a false sense of security.</li>
              <li><strong>Difficulty in Quantifying Intangible Risks:</strong> Some risks, such as reputational damage or loss of customer trust, can be difficult to quantify and incorporate into an IRM framework.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: GOALS AND OBJECTIVES OF AN IRMP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Goals and Objectives of an Integrated Risk Management Program (IRMP)</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The primary goals and objectives of an IRMP revolve around establishing a comprehensive and unified approach to risk management within an organization. This involves moving away from siloed risk management practices and towards a holistic view that enables better decision-making and resilience. An IRMP aims to align risk management activities with the organization's strategic objectives, ensuring that risks are identified, assessed, and mitigated in a way that supports overall business goals.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Strategic Alignment:</strong> A key objective is to ensure that risk management activities are aligned with the organization's strategic goals. This means identifying and prioritizing risks that could impede the achievement of those goals. By linking risk management to strategy, organizations can make more informed decisions about resource allocation and risk tolerance.</li>
              <li><strong>Comprehensive Risk Identification and Assessment:</strong> An IRMP aims to provide a complete and accurate picture of the organization's risk landscape. This involves identifying all potential risks, both internal and external, and assessing their likelihood and potential impact. This comprehensive approach helps organizations to understand the interconnectedness of risks and to prioritize those that pose the greatest threat.</li>
              <li><strong>Enhanced Risk Response and Mitigation:</strong> A core goal is to develop and implement effective strategies for responding to and mitigating identified risks. This includes establishing clear roles and responsibilities, developing contingency plans, and implementing controls to reduce the likelihood and impact of risks.</li>
              <li><strong>Improved Risk Monitoring and Reporting:</strong> An IRMP emphasizes the importance of ongoing risk monitoring and reporting. This involves tracking key risk indicators, regularly assessing the effectiveness of risk mitigation strategies, and providing timely and accurate reports to stakeholders. This allows organizations to stay informed about their risk exposure and to make necessary adjustments to their risk management activities.</li>
              <li><strong>Fostering a Risk-Aware Culture:</strong> A significant objective is to cultivate a risk-aware culture throughout the organization. This involves promoting open communication about risks, encouraging employees to identify and report potential risks, and ensuring that risk management is integrated into all aspects of the business.</li>
              <li><strong>Optimization of Resource Allocation:</strong> By having a clear view of the risk landscape, organizations can better allocate resources to properly mitigate the most dangerous risks. This allows for money and time to be used in the most efficient ways possible.</li>
              <li><strong>Increase in Regulatory Compliance:</strong> Many industries are heavily regulated, and an IRMP can ensure that a company is meeting all of its required obligations.</li>
              <li><strong>Improvement of Decision Making:</strong> When all risks are identified, and quantified, it becomes much easier for leadership to make informed decisions for the future of the company.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: KEY COMPONENTS OF AN IRMP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Key Components of an Integrated Records Management Program (IRMP)</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>An Integrated Records Management Program (IRMP) is designed to ensure that records are created, maintained, and disposed of in a systematic and efficient manner. Its key components work together to provide a comprehensive framework for managing records throughout their lifecycle, aligning with organizational goals and regulatory requirements.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Policies and Procedures:</strong> This component establishes the foundational rules and guidelines for records management. It includes defining roles and responsibilities, setting standards for record creation and maintenance, and outlining procedures for retention and disposal. Clear policies and procedures ensure consistency and accountability in records management practices.</li>
              <li><strong>Records Inventory and Classification:</strong> A comprehensive inventory of all records held by the organization is essential. This includes identifying the types of records, their formats, and their locations. Classification involves categorizing records based on their content and value, enabling efficient retrieval and management.</li>
              <li><strong>Retention and Disposition Schedule:</strong> This component establishes the length of time records must be retained to meet legal, regulatory, and business requirements. It also outlines procedures for the secure disposal of records that are no longer needed. A well-defined retention schedule helps prevent the accumulation of unnecessary records and reduces storage costs.</li>
              <li><strong>Records Storage and Retrieval:</strong> This component focuses on the physical or electronic storage of records, ensuring their security and accessibility. It includes implementing systems for organizing and retrieving records efficiently, as well as establishing procedures for managing access and security.</li>
              <li><strong>Records Management Systems and Technology:</strong> This component involves the use of technology to support records management activities. It includes implementing electronic document and records management systems (EDRMS), as well as utilizing other tools for capturing, storing, and retrieving records.</li>
              <li><strong>Training and Awareness:</strong> Effective records management requires that all employees understand their roles and responsibilities. This component includes providing training on records management policies and procedures, as well as raising awareness about the importance of proper records handling.</li>
              <li><strong>Compliance and Auditing:</strong> This component ensures that the IRMP complies with relevant laws, regulations, and standards. It includes conducting regular audits to assess the effectiveness of records management practices and identify areas for improvement.</li>
              <li><strong>Disaster Recovery and Business Continuity:</strong> This component addresses the need to protect records from loss or damage due to disasters or other disruptions. It includes developing contingency plans for record recovery and ensuring that critical records are backed up and stored securely.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: KEY STAGES IN DEVELOPING AN IRMP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Key Stages in Developing an Integrated Records Management Program (IRMP)</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Developing an effective IRMP involves a systematic approach, progressing through distinct stages to ensure comprehensive coverage and successful implementation. These stages build upon each other, creating a robust framework for managing records throughout their lifecycle.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Needs Assessment and Planning:</strong> This initial stage involves understanding the organization's current records management practices, identifying gaps, and defining the scope and objectives of the IRMP. This includes analyzing legal and regulatory requirements, assessing business needs, and determining the resources required for implementation.</li>
              <li><strong>Policy and Procedure Development:</strong> Based on the needs assessment, this stage focuses on developing clear and comprehensive policies and procedures that govern records management activities. This includes defining roles and responsibilities, establishing standards for record creation and maintenance, and outlining procedures for retention and disposal.</li>
              <li><strong>Records Inventory and Classification:</strong> This stage involves conducting a thorough inventory of all records held by the organization, identifying their types, formats, and locations. Records are then classified based on their content, value, and sensitivity, enabling efficient retrieval and management.</li>
              <li><strong>Retention and Disposition Schedule Creation:</strong> Based on legal, regulatory, and business requirements, this stage involves developing a retention schedule that specifies how long records must be retained and outlines procedures for their secure disposal.</li>
              <li><strong>System and Technology Implementation:</strong> This stage focuses on selecting and implementing the appropriate records management systems and technologies to support the IRMP. This may include electronic document and records management systems (EDRMS), as well as other tools for capturing, storing, and retrieving records.</li>
              <li><strong>Training and Awareness Programs:</strong> This stage involves developing and delivering training programs to educate employees on records management policies and procedures. It also includes raising awareness about the importance of proper records handling and fostering a risk-aware culture.</li>
              <li><strong>Implementation and Rollout:</strong> This stage involves implementing the IRMP across the organization, including deploying systems, training employees, and establishing processes for ongoing monitoring and maintenance.</li>
              <li><strong>Monitoring, Auditing, and Evaluation:</strong> This final stage involves establishing mechanisms for monitoring the effectiveness of the IRMP, conducting regular audits to ensure compliance, and evaluating the program's overall performance. This includes identifying areas for improvement and making necessary adjustments.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: STEPS INVOLVED IN SUPPORTING AND SUSTAINING AN IRMP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Steps Involved in Supporting and Sustaining an IRMP</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Supporting and sustaining an Integrated Records Management Program (IRMP) requires ongoing effort and commitment. It's not a one-time implementation, but a continuous process to ensure the program remains effective and aligned with the organization's evolving needs.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Regular Audits and Assessments:</strong> Conduct periodic audits to assess the effectiveness of the IRMP and identify areas for improvement. This includes reviewing policies, procedures, and systems to ensure they remain compliant and aligned with best practices. Regular assessments help to detect and correct potential weaknesses before they lead to significant problems.</li>
              <li><strong>Continuous Training and Awareness:</strong> Provide ongoing training to employees on records management policies, procedures, and systems. This ensures that everyone understands their roles and responsibilities and stays up-to-date on any changes. Reinforce the importance of records management through regular communication and awareness campaigns.</li>
              <li><strong>Technology Updates and Maintenance:</strong> Keep records management systems and technologies up-to-date with the latest versions and security patches. Regularly maintain these systems to ensure they function properly and efficiently. This includes addressing any technical issues promptly to minimize disruptions.</li>
              <li><strong>Policy and Procedure Reviews:</strong> Periodically review and update records management policies and procedures to reflect changes in legal, regulatory, and business requirements. This ensures that the IRMP remains relevant and effective.</li>
              <li><strong>Stakeholder Engagement:</strong> Maintain open communication with stakeholders, including employees, management, and external partners. Gather feedback and address concerns to ensure that the IRMP meets their needs. Regular engagement helps to build support and ensure that the program remains aligned with organizational goals.</li>
              <li><strong>Performance Monitoring and Reporting:</strong> Establish key performance indicators (KPIs) to monitor the effectiveness of the IRMP. Regularly track and report on these KPIs to identify trends and areas for improvement. This data-driven approach helps to ensure that the program is achieving its objectives.</li>
              <li><strong>Disaster Recovery and Business Continuity Planning:</strong> Regularly test and update disaster recovery and business continuity plans to ensure that records can be recovered in the event of a disaster or disruption. This includes backing up critical records and storing them securely off-site.</li>
              <li><strong>Promoting a Culture of Compliance:</strong> Foster a culture of compliance throughout the organization, where records management is seen as an essential part of everyone's job. This involves reinforcing the importance of proper records handling and promoting ethical behavior.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: MAINTAINING AND PERIODICALLY REVIEWING THE IRMP ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Maintaining and Periodically Reviewing the IRMP</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Maintaining and periodically reviewing an Integrated Records Management Program (IRMP) is essential to ensure its continued effectiveness and relevance. It's not a static document; it needs to adapt to changes in technology, regulations, and organizational needs.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Regular Monitoring of Key Performance Indicators (KPIs):</strong> Establish specific KPIs to track the IRMP's performance. This might include metrics like record retrieval times, compliance rates, or the efficiency of disposal processes. Regularly monitor these KPIs to identify trends and potential issues. This allows for proactive adjustments to the program.</li>
              <li><strong>Periodic Policy and Procedure Reviews:</strong> Schedule regular reviews of all IRMP policies and procedures. This ensures they remain aligned with current legal, regulatory, and organizational requirements. Changes in legislation, industry standards, or business operations can necessitate updates to these documents.</li>
              <li><strong>Technology Assessment and Updates:</strong> Evaluate the effectiveness of the technology supporting the IRMP. This includes assessing the performance of electronic document and records management systems (EDRMS) and other relevant tools. Ensure that these systems are kept up-to-date with the latest security patches and software versions.</li>
              <li><strong>Stakeholder Feedback and Engagement:</strong> Actively seek feedback from employees, management, and other stakeholders regarding the IRMP's effectiveness. This can be done through surveys, interviews, or focus groups. Incorporate this feedback into program improvements.</li>
              <li><strong>Compliance Audits:</strong> Conduct regular audits to assess the IRMP's compliance with relevant laws, regulations, and internal policies. These audits should identify any gaps or weaknesses in the program and provide recommendations for corrective action.</li>
              <li><strong>Risk Assessments:</strong> Periodically perform risk assessments to identify new or emerging risks that could impact the IRMP. This helps to ensure that the program remains proactive in addressing potential threats.</li>
              <li><strong>Documentation of Changes:</strong> Maintain thorough documentation of all changes made to the IRMP, including the reasons for the changes and the individuals responsible. This ensures transparency and accountability and provides a clear audit trail.</li>
              <li><strong>Training and Communication Updates:</strong> As changes are made to the IRMP, ensure that training materials and communication strategies are also updated. This ensures that all employees are aware of the most current procedures and policies.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: IMPORTANCE OF EVALUATING AND REVIEWING EXISTING STRUCTURES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of Evaluating and Reviewing Existing Structures in an IRMP</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Evaluating and reviewing existing structures within an Integrated Records Management Program (IRMP) is crucial for ensuring its ongoing effectiveness and relevance. It's about maintaining a dynamic and responsive system that adapts to changing circumstances.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ensuring Continued Compliance:</strong> Laws and regulations related to records management are constantly evolving. Regular reviews ensure that the IRMP remains compliant with these changes. This helps to avoid legal penalties and maintain organizational integrity.</li>
              <li><strong>Identifying Inefficiencies and Weaknesses:</strong> Over time, inefficiencies and weaknesses can develop in any system. Evaluation helps to identify these issues, such as outdated procedures or inadequate technology, allowing for corrective action.</li>
              <li><strong>Adapting to Technological Advancements:</strong> Technology plays a significant role in modern records management. Regular reviews allow organizations to assess the effectiveness of their current systems and identify opportunities to leverage new technologies for improved efficiency and security.</li>
              <li><strong>Meeting Evolving Business Needs:</strong> An organization's business needs can change significantly over time. Reviews ensure that the IRMP remains aligned with these changes, supporting the organization's strategic goals and operational requirements.</li>
              <li><strong>Improving Risk Mitigation:</strong> Risk landscapes are dynamic. Evaluations help to identify new or emerging risks that could impact records management. By addressing these risks proactively, organizations can strengthen their risk mitigation strategies.</li>
              <li><strong>Enhancing User Experience:</strong> Reviews provide an opportunity to gather feedback from users of the IRMP, such as employees and stakeholders. This feedback can be used to improve the usability and accessibility of records management systems and processes.</li>
              <li><strong>Optimizing Resource Allocation:</strong> Regular evaluations help to identify areas where resources are being underutilized or overextended. This allows for more efficient allocation of resources, ensuring that they are directed towards the most critical areas of the IRMP.</li>
              <li><strong>Maintaining Organizational Accountability:</strong> A well reviewed IRMP ensures that all actions related to record keeping can be tracked and accounted for. This helps to reinforce transparency, and accountability within the organisation.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 5 — Integrated Risk Management & Records Programs</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">IRM Benefits</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">IRMP Goals</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Components</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Development Stages</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sustaining & Review</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Integrate. Manage. Sustain. Review. 🔄🛡️</p>
        </footer>

      </div>
    </div>
  );
};