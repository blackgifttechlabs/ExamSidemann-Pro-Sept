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
              Records Survey & <span className="text-rose-300 font-bold italic">Assessment Techniques</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to records surveys, importance, methodologies, SMART objectives, retirement guidelines, and documentation.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">records_survey.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">SURVEY</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Findings;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">RECOMMEND</span><span className="text-white">Actions;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Clipboard className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><SearchIcon className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: RECORDS SURVEY ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Records Survey</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>A records survey is a systematic assessment of an organization's records, both physical and digital, to gather information about their volume, format, location, condition, and usage. It provides a comprehensive overview of the records landscape, enabling organizations to make informed decisions about records management practices. The survey typically involves documenting the types of records, their retention periods, storage conditions, and access requirements. This information is then used to develop or improve records management policies, procedures, and systems.</p>
          </div>
        </section>

        {/* ========== SECTION 2: IMPORTANCE OF A RECORDS SURVEY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of a Records Survey in Records Management</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identification of Records Inventory:</strong> A records survey provides a detailed inventory of all records, which is essential for effective records management. This inventory helps organizations understand the scope and volume of their records holdings.</li>
              <li><strong>Assessment of Records Conditions:</strong> The survey allows for the evaluation of the physical and digital condition of records, identifying any preservation needs or risks. This helps prioritize conservation efforts and prevent data loss.</li>
              <li><strong>Development of Retention Schedules:</strong> By gathering information about record types and their usage, the survey supports the development or refinement of retention schedules. This ensures that records are retained for the appropriate period and disposed of when no longer needed.</li>
              <li><strong>Improvement of Records Management Practices:</strong> The survey findings can be used to identify weaknesses in existing records management practices and develop strategies for improvement. This may involve implementing new systems, procedures, or training programs.</li>
              <li><strong>Compliance with Legal and Regulatory Requirements:</strong> A records survey helps organizations ensure compliance with legal and regulatory requirements related to records management, such as data privacy laws and retention mandates.</li>
              <li><strong>Cost Reduction:</strong> By identifying inactive or redundant records, the survey can help organizations reduce storage costs and improve efficiency.</li>
              <li><strong>Risk Management:</strong> The survey helps identify potential risks to records, such as environmental hazards or security vulnerabilities, enabling organizations to implement preventive measures.</li>
              <li><strong>Planning for Digitization and Migration:</strong> A records survey can identify records suitable for digitization or migration, supporting the transition to digital records management.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: INDIVIDUALS TO CARRY OUT A RECORDS SURVEY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Individuals to Carry Out a Records Survey</h2>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Records Managers:</strong> Records managers have expertise in records management principles and practices. They are responsible for planning, coordinating, and overseeing the survey.</li>
              <li><strong>Archivists:</strong> Archivists have specialized knowledge of archival appraisal, preservation, and description. They can assess the historical and cultural value of records.</li>
              <li><strong>Information Technology (IT) Professionals:</strong> IT professionals provide expertise in digital records management, data storage, and information systems. They are crucial for assessing digital records and infrastructure.</li>
              <li><strong>Departmental Representatives:</strong> Representatives from various departments provide insight into the specific records created and used within their areas. They can help identify record types, usage patterns, and retention needs.</li>
              <li><strong>Consultants (if needed):</strong> External consultants with specialized expertise in records management or specific industries may be brought in to provide additional support.</li>
              <li><strong>Records Centre Staff:</strong> Staff who work daily with the records have direct knowledge of the records, and their locations.</li>
              <li><strong>Legal Counsel:</strong> Legal counsel can assist in identifying legal and regulatory requirements related to records management.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: SMART OBJECTIVES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>SMART Objectives for a Records Survey Team</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Specific:</strong> Objective: To identify and document all record series within the organization, including their format, location, volume, and retention requirements.</li>
              <li><strong>Measurable:</strong> Objective: To complete the survey of 100% of all designated departments and storage locations and achieve a 95% accuracy rate in data entry within 3 months.</li>
              <li><strong>Achievable:</strong> Objective: To collaborate with departmental representatives and IT personnel to ensure access to all necessary records and systems, and to provide training for the survey team on data collection techniques.</li>
              <li><strong>Relevant:</strong> Objective: To provide data that will be used to develop a comprehensive records retention schedule and improve records management practices, ensuring compliance with legal and regulatory requirements.</li>
              <li><strong>Time-bound:</strong> Objective: To complete the initial data collection phase of the records survey within 3 months and deliver a preliminary report with key findings within 4 weeks of data collection completion.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: GUIDELINES AND RULES FOR RETIRING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Guidelines and Rules for Retiring Non-Current Records from the Records Centre</h2>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Adherence to Retention Schedules:</strong> The primary guideline for retiring non-current records is strict adherence to established retention schedules. These schedules, based on legal, regulatory, and organizational requirements, specify the duration for which records must be retained.</li>
              <li><strong>Verification of Legal and Regulatory Requirements:</strong> Before any records are retired, it is imperative to verify that all legal and regulatory requirements have been met.</li>
              <li><strong>Authorization for Disposal:</strong> A formal authorization process must be in place to approve the disposal of non-current records.</li>
              <li><strong>Secure Disposal Methods:</strong> Non-current records must be disposed of using secure methods to protect sensitive information.</li>
              <li><strong>Documentation of Disposal:</strong> Detailed documentation of the disposal process is essential.</li>
              <li><strong>Notification and Communication:</strong> Relevant departments and stakeholders should be notified before the disposal of their records.</li>
              <li><strong>Review and Update of Retention Schedules:</strong> Retention schedules should be regularly reviewed and updated to reflect changes in legal, regulatory, and organizational requirements.</li>
              <li><strong>Environmental Considerations:</strong> When disposing of records, consider environmental impacts.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: DIFFERENT SURVEY METHODS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Different Survey Methods</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Questionnaires:</strong> Questionnaires involve a set of predefined questions, either on paper or online, that respondents answer.</li>
              <li><strong>Interviews:</strong> Interviews involve direct interaction between the researcher and the respondent.</li>
              <li><strong>Observations:</strong> Observations involve systematically observing and recording behaviors, activities, or phenomena.</li>
              <li><strong>Focus Groups:</strong> Focus groups involve a small group of participants discussing a specific topic under the guidance of a facilitator.</li>
              <li><strong>Document Analysis:</strong> Document analysis involves reviewing and analyzing existing documents, such as reports, records, and publications.</li>
              <li><strong>Electronic Surveys (Online Surveys):</strong> These surveys are distributed and collected via the internet.</li>
              <li><strong>Telephone Surveys:</strong> These surveys are conducted over the telephone.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: IDEAL METHODOLOGIES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Ideal Methodologies for a Particular Environment (Records Centre Survey Example)</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Questionnaires (for General Data Collection):</strong> Distribute questionnaires to departmental representatives and records centre staff to gather general information about record types, volumes, locations, and usage patterns.</li>
              <li><strong>Interviews (for In-Depth Insights):</strong> Conduct interviews with key records managers, archivists, and departmental representatives to gain in-depth insights into specific records management practices, challenges, and needs.</li>
              <li><strong>Observations (for Physical Records Assessment):</strong> Conduct physical observations of records storage areas to assess environmental conditions, storage practices, and the physical condition of records.</li>
              <li><strong>Document Analysis (for Policy and Procedure Review):</strong> Analyze existing records management policies, retention schedules, and procedures to evaluate their effectiveness and identify areas for improvement.</li>
              <li><strong>Electronic Surveys (for Digital Records):</strong> For gathering data about digital records, electronic surveys are ideal.</li>
              <li><strong>Focus Groups (For user feedback):</strong> Focus groups can be used to gather feedback from those who use the records centre.</li>
            </ul>
            <p className="mt-2"><strong>Justification:</strong> The combination of questionnaires, interviews, and observations provides both quantitative and qualitative data, ensuring a comprehensive understanding of the records centre's operations. Document analysis ensures that the survey aligns with existing policies and procedures. Electronic surveys are best for digital records. Focus groups provide direct user feedback. This approach allows for the identification of both general trends and specific issues, enabling the development of targeted recommendations.</p>
          </div>
        </section>

        {/* ========== SECTION 8: CARRYING OUT THE RECORDS CENTRE SURVEY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Carrying Out the Records Centre Survey</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Conducting a records centre survey requires a structured approach to ensure accurate data collection and meaningful results. Here's a step-by-step explanation of how to carry out the survey:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Preparation and Planning:</strong> Begin by finalizing the survey's scope, objectives, and methodology. This includes determining the types of records to be surveyed, the departments to be included, and the data collection methods to be used (questionnaires, interviews, observations, etc.). Develop a detailed survey plan that outlines the timeline, responsibilities, and resources required. Create or adapt survey instruments, such as questionnaires and interview guides, ensuring they are clear, concise, and aligned with the survey objectives. Secure necessary approvals and communicate the survey's purpose and process to all stakeholders.</li>
              <li><strong>Data Collection:</strong> Distribute questionnaires to designated personnel, providing clear instructions and deadlines for completion. Conduct interviews with key personnel, such as records managers, departmental representatives, and IT staff, following the interview guide and documenting responses accurately. Perform physical observations of records storage areas, noting environmental conditions, storage practices, and the condition of records. Conduct document analysis of relevant policies, procedures, and retention schedules. For digital records, distribute electronic surveys to those who work with them daily. Ensure that all data is collected consistently and accurately, following established protocols.</li>
              <li><strong>Data Analysis:</strong> Once data collection is complete, compile and analyze the collected data. This may involve organizing and summarizing questionnaire responses, transcribing and coding interview data, and analyzing observation notes. Use appropriate software or tools to analyze quantitative and qualitative data. Identify patterns, trends, and key findings related to the records centre's operations, records management practices, and compliance with policies and regulations.</li>
              <li><strong>Validation and Verification:</strong> Validate and verify the survey findings to ensure accuracy and reliability. This may involve cross-referencing data from different sources, conducting follow-up interviews, or reviewing relevant documentation. Address any discrepancies or inconsistencies in the data. This step is crucial for ensuring that the survey results are credible and can be used to inform decision-making.</li>
            </ol>
          </div>
        </section>

        {/* ========== SECTION 9: DOCUMENTING FINDINGS AND MAKING RECOMMENDATIONS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Documenting Findings and Making Recommendations</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Documenting the survey findings and making actionable recommendations is essential for translating the survey results into tangible improvements. Here's how to proceed:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Prepare a Comprehensive Report:</strong> Prepare a comprehensive report that documents the survey's purpose, methodology, findings, and recommendations. The report should include an executive summary, a detailed description of the survey process, a presentation of the key findings, and a list of recommendations. Use clear and concise language, and present data in a visually appealing format, such as charts and graphs.</li>
              <li><strong>Present Key Findings:</strong> Present the key findings of the survey in a clear and concise manner. Highlight areas of strength and areas for improvement. Provide specific examples and data to support the findings. Organize the findings into logical categories, such as records inventory, storage conditions, retrieval efficiency, and compliance.</li>
              <li><strong>Develop Actionable Recommendations:</strong> Develop actionable recommendations based on the survey findings. Recommendations should be specific, measurable, achievable, relevant, and time-bound (SMART). Prioritize recommendations based on their impact and feasibility. Consider the resources required to implement each recommendation and develop a realistic implementation plan.</li>
              <li><strong>Provide Evidence-Based Justification:</strong> Provide evidence-based justification for each recommendation, citing specific survey findings and relevant best practices. Explain how each recommendation will address identified issues and improve records management practices.</li>
              <li><strong>Seek Stakeholder Feedback:</strong> Share the report and recommendations with key stakeholders, including records centre staff, departmental representatives, and management. Gather feedback and incorporate relevant suggestions into the final report. This ensures that the recommendations are practical and aligned with organizational needs.</li>
              <li><strong>Develop an Implementation Plan:</strong> Develop a detailed implementation plan that outlines the steps required to implement the recommendations. This includes assigning responsibilities, setting timelines, and allocating resources. Monitor progress and make adjustments as needed.</li>
              <li><strong>Follow-Up and Evaluation:</strong> Conduct follow-up evaluations to assess the effectiveness of the implemented recommendations. This ensures that the survey has led to tangible improvements in records management practices.</li>
            </ol>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 5 — Records Survey & Assessment Techniques</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Survey Importance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Personnel & SMART</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Retirement Guidelines</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Methodologies</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Documentation</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Survey. Analyze. Recommend. Improve. 📋🔍</p>
        </footer>

      </div>
    </div>
  );
};