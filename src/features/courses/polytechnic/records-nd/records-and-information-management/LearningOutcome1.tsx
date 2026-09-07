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
  Fingerprint, KeyRound, Siren, Flame, Waves,Brain,

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
              ICTs, Information Governance & <span className="text-emerald-300 font-bold italic">Digital Transformation</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to ICT impact on RIM, profession changes, governance components, data governance principles, legal frameworks, and information lifecycle.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">ict_governance.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">TRANSFORM</span><span className="text-white">RIM;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">GOVERN</span><span className="text-white">Data;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">PROTECT</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Cloud className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: TRANSFORMATIVE IMPACT OF ICTS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Transformative Impact of ICTs on Records and Information Management</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> From Paper-Based Systems to Digital Foundations</h3>
            <p>Historically, records management relied heavily on physical documents, leading to challenges in storage, retrieval, and efficiency. Early technological advancements, such as typewriters, offered incremental improvements.</p>
            <p>The introduction of computers marked a paradigm shift, enabling the digitization of records and the creation of electronic databases. This transition significantly enhanced storage capacity and search capabilities.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GlobeIcon size={20} /> The Networked Era: Connectivity and Information Sharing</h3>
            <p>The development of local and wide area networks facilitated seamless information sharing within and between organizations. This fostered collaborative record-keeping and streamlined workflows.</p>
            <p>The rise of the internet and the World Wide Web revolutionized information access and dissemination. Electronic mail became a primary means of communication, generating new forms of digital records.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> Modernization and Advanced Technologies</h3>
            <p>Cloud computing has transformed records management by providing scalable and cost-effective storage solutions. This enables organizations to access records remotely, enhancing flexibility and disaster recovery.</p>
            <p>Artificial intelligence (AI) is increasingly used to automate tasks such as record classification, indexing, and retrieval. AI-powered analytics can extract valuable insights from large datasets, supporting informed decision-making.</p>
            <p>Data analytics, mobile technology, and blockchain technology are also impacting the way records are managed. Data analytics allows for the extraction of business intelligence. Mobile technology forces records management to be able to be utilized anywhere. Blockchain technology increases security and record integrity.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ListChecks size={20} /> Key Impacts of ICT Integration</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Increased operational efficiency and productivity.</li>
              <li>Enhanced accessibility and retrieval of information.</li>
              <li>Improved data security and integrity.</li>
              <li>Reduced storage and operational costs.</li>
              <li>Strengthened compliance with regulatory requirements.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: IMPACT ON THE RIM PROFESSION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Impact of ICTs on the Records and Information Management Profession</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>ICTs have completely changed how Records and Information Management (RIM) works. It's not just about paper anymore; it's about computers and digital information.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> The Switch from Paper to Computers</h3>
            <p>Before, RIM was mostly about filing paper documents. Now, with computers, everything is digital. This means RIM professionals need to know how to use computer programs to organize and store information. They also have to worry about keeping digital information safe from hackers, which wasn't a big problem with paper. Imagine going from organizing papers in a filing cabinet to organizing files on a computer, and making sure no one can steal those files.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Making Work Faster and Easier</h3>
            <p>Computers can do many of the boring tasks that people used to do, like putting files in order. This frees up RIM professionals to do more important things. Also, finding information on a computer is much faster than searching through paper files. This helps everyone in the organization find the information they need quickly. Think of it like having a robot that does all the filing for you, and a super-fast search engine to find any document instantly.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Keeping Information Safe and Following Rules</h3>
            <p>Organizations have rules about how to keep information safe and how long to keep it. Computers make it easier to follow these rules. RIM professionals can use computer programs to make sure that information is stored correctly and that it's deleted when it's supposed to be. This helps the organization avoid legal problems. It is like having a computer program that automatically makes sure you follow all the rules for managing your information.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Understanding and Using Information</h3>
            <p>RIM professionals now need to understand how to analyze data. They need to be able to look at the information and find important things that can help the organization make better decisions. This means they need to understand data analytics. Imagine being able to use a computer to find patterns in your information that can help your company make more money.</p>
          </div>
        </section>

        {/* ========== SECTION 3: NEW ROLES FOR RIM PRACTITIONERS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>New Roles for RIM Practitioners with the Advent of ICTs</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Because of computers, RIM professionals are doing new jobs that didn't exist before.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Information Rule Keepers</h3>
            <p>These people make sure that the organization follows all the rules about how to manage information. They make sure that information is used correctly and that people's privacy is protected. They are like the police officers of information.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Digital History Keepers</h3>
            <p>These people make sure that important digital information is saved for a long time. They know how to keep digital information safe from getting lost or damaged. They are like librarians for digital information.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> Information Analyzers</h3>
            <p>These people look at the information and find important things that can help the organization make better decisions. They use computer programs to find patterns and trends in the information. They are like detectives who find clues in the data.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Folder size={20} /> Computer File Managers</h3>
            <p>These people know how to use computer programs to manage electronic records. They make sure that the records are stored correctly and that people can find them when they need them. They are like the organizers of the computer filing system.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Information Security Guards</h3>
            <p>These people make sure that the organization's information is safe from hackers. They also make sure that the organization follows all the rules about keeping information private. They are like the security guards who protect the organization's information.</p>
          </div>
        </section>

        {/* ========== SECTION 4: CURRENT/EVOLVING TRENDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Current/Evolving Trends in Records and Information Management</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The field of Records and Information Management (RIM) is constantly evolving, driven by technological advancements and changing organizational needs. Here are some key trends shaping the profession:</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Increased Emphasis on Information Governance</h3>
            <p>Organizations are recognizing the importance of establishing clear policies and procedures for managing information throughout its lifecycle. This includes ensuring compliance with regulations, protecting data privacy, and mitigating risks. Essentially, companies are trying to get better at organizing and controlling their information, just like people try to keep their homes organized.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Growing Importance of Data Analytics and Business Intelligence</h3>
            <p>RIM professionals are increasingly expected to leverage data analytics tools to extract valuable insights from organizational records. This data can be used to support decision-making, identify trends, and improve operational efficiency. Imagine using a computer to find patterns in a company's records that can help them make more money or avoid problems.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cloud size={20} /> Cloud-Based Records Management</h3>
            <p>Cloud computing is transforming how organizations store and manage records. Cloud-based solutions offer scalability, flexibility, and cost-effectiveness, enabling organizations to access records from anywhere, at any time. This is like storing your files on the internet instead of on your computer, so you can get to them from any device.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Brain size={20} /> AI and Automation in RIM</h3>
            <p>Artificial intelligence (AI) and automation are being used to streamline RIM processes, such as record classification, indexing, and retrieval. AI-powered tools can also help identify and manage sensitive information, enhancing data security and compliance. This means computers are learning to do some of the work that humans used to do, like sorting and finding files.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Focus on Digital Preservation</h3>
            <p>With the increasing volume of digital records, organizations are placing greater emphasis on digital preservation strategies. This involves ensuring the long-term accessibility and integrity of electronic records. It is like making sure that digital photos and videos can still be viewed many years from now.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Phone size={20} /> Mobile Records Management</h3>
            <p>The rise of mobile workforces has increased the need for records management solutions that support mobile access and capture. This is ensuring records can be accessed and created from phones and tablets.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Cybersecurity and Data Privacy</h3>
            <p>The increasing threat of cyberattacks is forcing organizations to increase security around their records. This combined with increasing data privacy laws, makes this a very important trend.</p>
          </div>
        </section>

        {/* ========== SECTION 5: JUSTIFICATION OF ICTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Justification of ICTs as an Agent of Change in Records and Information Management</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>ICTs have been a fundamental driver of change in RIM, transforming it from a manual, paper-based process to a dynamic, technology-driven field.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Enhanced Efficiency and Productivity</h3>
            <p>ICTs have automated many routine RIM tasks, such as filing, retrieval, and indexing, significantly improving efficiency and productivity. Computers can do these tasks much faster and more accurately than humans.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Improved Information Accessibility and Retrieval</h3>
            <p>Digital records are more easily accessible and searchable than paper records, enabling faster information retrieval and improved collaboration. This means people can find the information they need quickly and easily.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Strengthened Information Governance and Compliance</h3>
            <p>ICTs have enabled organizations to implement robust information governance frameworks, ensuring that records are managed in compliance with legal and regulatory requirements. Computer programs can help track and manage records to ensure they meet legal requirements.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Increased Data Security and Integrity</h3>
            <p>ICTs have provided tools and technologies to enhance data security and integrity, protecting records from unauthorized access, alteration, and loss. This is like having better locks and security systems to protect valuable information.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><TrendingUp size={20} /> Enabled Data Analysis and Business Intelligence</h3>
            <p>ICTs have enabled the ability to analyze large sets of data, and find trends and information that can help a business make better decisions.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Facilitated Digital Preservation</h3>
            <p>ICTs have made it possible to preserve digital records for long periods of time.</p>
          </div>
        </section>

        {/* ========== SECTION 6: COMPONENTS OF A SUCCESSFUL IG PROGRAM ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Components of a Successful Information Governance Program</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Strategic Alignment</h3>
            <p>The IG program must be aligned with the organization's overall business goals and objectives. This ensures that information management supports the organization's strategic direction. Essentially, IG must help the company reach its goals.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Policies and Procedures</h3>
            <p>Clear and comprehensive policies and procedures are essential for guiding information management practices. These policies should cover areas such as data creation, storage, access, retention, and disposal. These are the rules that everyone must follow.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Roles and Responsibilities</h3>
            <p>Defined roles and responsibilities are crucial for ensuring accountability and effective implementation of the IG program. Everyone must know what they are responsible for.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Server size={20} /> Technology Infrastructure</h3>
            <p>Appropriate technology infrastructure, including systems for data management, security, and compliance, is necessary to support the IG program. This includes the computers and programs used to manage information.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Monitoring and Auditing</h3>
            <p>Regular monitoring and auditing are essential for ensuring that the IG program is effective and that policies and procedures are being followed. This is like checking to make sure everyone is following the rules.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Training and Education</h3>
            <p>Ongoing training and education are necessary to ensure that employees understand their roles and responsibilities in the IG program. Everyone needs to learn how to manage information properly.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> Risk Management</h3>
            <p>Identifying and mitigating information-related risks is a key component of a successful IG program. This means planning for problems, and preventing them.</p>
          </div>
        </section>

        {/* ========== SECTION 7: IMPORTANCE OF IMBEDDING AN IG CULTURE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Importance of Imbedding an Information Governance Culture</h2>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Promotes Accountability</h3>
            <p>A strong IG culture fosters a sense of ownership and accountability for information management practices. Everyone feels responsible for keeping information safe and accurate.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Enhances Collaboration</h3>
            <p>An IG culture encourages collaboration and information sharing across the organization. People are more likely to work together to manage information effectively.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Reduces Risks</h3>
            <p>A culture of compliance and security helps to mitigate information-related risks, such as data breaches and regulatory violations. Everyone is more aware of the dangers.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Improves Efficiency</h3>
            <p>A well-established IG culture streamlines information management processes, leading to improved efficiency and productivity. When information is organized, everyone can find what they need.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Supports Informed Decision-Making</h3>
            <p>A culture of data quality and integrity ensures that decision-makers have access to accurate and reliable information. This helps the company make smart choices.</p>
          </div>
        </section>

        {/* ========== SECTION 8: PRINCIPLES OF DATA GOVERNANCE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Principles of Data Governance</h2>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Integrity</h3>
            <p>Data must be accurate, consistent, and reliable. This means the data must be correct.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Transparency</h3>
            <p>Data governance processes and policies should be transparent and accessible to all stakeholders. Everyone should know how data is managed.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Auditability</h3>
            <p>Data governance activities should be auditable, allowing for tracking and verification of data management practices. This means there is a record of who did what with the data.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Compliance</h3>
            <p>Data governance must ensure compliance with relevant laws, regulations, and industry standards. This means following the rules.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Stewardship</h3>
            <p>Data stewards are responsible for the quality, security, and use of specific data assets. This means there are people in charge of specific data.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Security</h3>
            <p>Data must be protected from unauthorized access, use, or disclosure. This means keeping the data safe.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AwardIcon size={20} /> Quality</h3>
            <p>The data must be of high quality, and fit for the purpose that it is intended.</p>
          </div>
        </section>

        {/* ========== SECTION 9: ROLES WHICH SUPPORT INFORMATION GOVERNANCE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Roles Which Support Information Governance</h2>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Chief Information Officer (CIO)</h3>
            <p>The CIO is responsible for the overall information technology strategy and infrastructure, which supports IG initiatives. They ensure that technology aligns with the organization's information governance goals. They are like the head of the IT department, making sure the technology works for information management.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Chief Data Officer (CDO)</h3>
            <p>The CDO is responsible for data governance, including data quality, integrity, and security. They develop and implement data policies and standards. They are in charge of making sure data is accurate and safe.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Information Governance Manager/Director</h3>
            <p>This role is specifically dedicated to overseeing the IG program. They develop and implement IG policies, procedures, and standards. They are the people who make and enforce the rules about information.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck size={20} /> Data Stewards</h3>
            <p>Data stewards are responsible for the quality and management of specific data assets. They ensure that data is accurate, complete, and reliable. They are like the caretakers of specific pieces of data.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Records Managers</h3>
            <p>Records managers are responsible for managing the organization's records throughout their lifecycle, from creation to disposal. They ensure that records are retained and disposed of in accordance with legal and regulatory requirements. They are in charge of keeping track of and managing all the official records.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Compliance Officers</h3>
            <p>Compliance officers ensure that the organization's IG program complies with relevant laws, regulations, and industry standards. They are like the people who make sure the company is following all the rules.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} /> Information Security Officers</h3>
            <p>They are responsible for the security of information, and protecting it from unauthorized access. They are the people who protect the data from hackers.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Legal Counsel</h3>
            <p>Legal counsel provides guidance on legal and regulatory requirements related to information governance. They are the lawyers who advise on data laws.</p>
          </div>
        </section>

        {/* ========== SECTION 10: LEGAL FRAMEWORK GOVERNING USE OF DATA ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Legal Framework Governing Use of Data</h2>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> Data Privacy Laws</h3>
            <p>These laws, such as the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), regulate the collection, use, and disclosure of personal data. They give people rights over their own data.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClockIcon size={20} /> Records Retention Laws</h3>
            <p>These laws specify how long organizations must retain certain types of records. This ensures that important records are kept for legal or regulatory purposes.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Freedom of Information Laws</h3>
            <p>These laws grant individuals the right to access government records. This promotes transparency and accountability.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Intellectual Property Laws</h3>
            <p>These laws protect intellectual property, such as copyrights and patents, which may include data. This ensures that data is not used without permission.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Briefcase size={20} /> Industry-Specific Regulations</h3>
            <p>Certain industries, such as healthcare and finance, have specific regulations governing the use of data. These regulations are designed to protect sensitive data.</p>
          </div>
        </section>

        {/* ========== SECTION 11: CAPTURING, DISTRIBUTING, ACCESSING, STORING, AND DISPOSAL ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Capturing, Distributing, Accessing, Storing, and Disposal of Information</h2>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Inbox size={20} /> Capturing</h3>
            <p>This involves the creation or collection of information from various sources. This is how information enters the system.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Send size={20} /> Distributing</h3>
            <p>This involves sharing information with authorized users. This is how information is shared.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><SearchIcon size={20} /> Accessing</h3>
            <p>This involves providing authorized users with the ability to retrieve and view information. This is how people get to the information they need.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Storing</h3>
            <p>This involves maintaining information in a secure and accessible manner. This is how information is kept safe.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Trash2 size={20} /> Disposal</h3>
            <p>This involves the destruction or deletion of information that is no longer needed. This is how information is removed when it is no longer useful or required.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — ICTs, Information Governance & Digital Transformation</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">ICT Impact</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">RIM Profession</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Information Governance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data Governance</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legal Framework</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Transform. Govern. Protect. Succeed. 💻🛡️</p>
        </footer>

      </div>
    </div>
  );
};