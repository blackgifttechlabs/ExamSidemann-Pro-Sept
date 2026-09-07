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
  Drill, Recycle, Leaf, Flower, BookMarked, Library, PanelTop, Scan, Brain, Link,
  Fingerprint, KeyRound, Siren, Flame, Waves,Wifi, ThumbsDown, Tag,

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
              Digitization & <span className="text-amber-300 font-bold italic">Digital Transformation</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to digitization concepts, trends, advantages, disadvantages, challenges, policies, migration, and security measures.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">digitization.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">DIGITIZE</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">MIGRATE</span><span className="text-white">Data;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">SECURE</span><span className="text-white">Assets;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Scan className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Cloud className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: THE CONCEPT OF DIGITIZATION ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Concept of Digitization</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Digitization is the process of converting analog information into a digital format. This transformation involves taking physical objects, such as documents, photographs, or audio recordings, and representing them as digital data that can be stored, processed, and transmitted by computers. Essentially, it's about translating the continuous signals of analog information into discrete digital data, represented by binary code (0s and 1s).</p>
            <p>The core of digitization lies in sampling and quantization. Sampling involves taking measurements of the analog signal at regular intervals, capturing snapshots of the information. Quantization then assigns a discrete numerical value to each sample, representing its amplitude or intensity. These numerical values are then encoded into binary data, which can be stored and manipulated by digital devices. Digitization enables the creation of digital representations of various forms of information, including text, images, audio, and video. This process fundamentally changes how information is stored, accessed, and shared, offering numerous advantages over traditional analog methods.</p>
          </div>
        </section>

        {/* ========== SECTION 2: NEW TRENDS IN DIGITIZATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>New Trends in Digitization</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Digitization is a constantly evolving field, driven by technological advancements and changing user needs. Several new trends are shaping the future of digitization, enhancing its capabilities and expanding its applications.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Brain size={20} /> Artificial Intelligence (AI) and Machine Learning (ML) Integration</h3>
            <p>AI and ML are increasingly being integrated into digitization workflows, automating tasks and enhancing data analysis. AI-powered image recognition can automatically identify and classify objects in digitized images, while natural language processing (NLP) can extract information from digitized text documents. Machine learning algorithms can also be used to improve the accuracy of optical character recognition (OCR) and other digitization processes. This integration of AI and ML streamlines digitization workflows, reduces manual effort, and enhances the value of digitized data.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Cloud size={20} /> Cloud-Based Digitization and Storage</h3>
            <p>Cloud computing is transforming how digitized data is stored and accessed. Cloud-based digitization services allow organizations to store and manage their digitized collections in the cloud, providing secure and scalable storage. Cloud platforms also offer collaboration tools and APIs that enable seamless integration with other applications. This trend makes digitized information more accessible and facilitates collaboration among distributed teams. Cloud based storage also provides redundancy, and offsite backups.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Box size={20} /> 3D Digitization and Virtual Reality (VR)</h3>
            <p>3D digitization is gaining traction, enabling the creation of digital replicas of physical objects and environments. This technology is used in various fields, including cultural heritage preservation, architecture, and manufacturing. 3D scanners and photogrammetry techniques are used to capture detailed 3D models of objects, which can then be viewed and manipulated in VR environments. This trend opens up new possibilities for immersive experiences and virtual exploration of digitized artifacts.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Link size={20} /> Blockchain for Digital Provenance and Authenticity</h3>
            <p>Blockchain technology is being explored as a means of ensuring the provenance and authenticity of digitized assets. Blockchain's immutable ledger can record the history of a digitized object, providing a verifiable record of its origin and ownership. This is particularly relevant for digitized artworks, historical documents, and other valuable assets. Blockchain can also be used to manage digital rights and prevent unauthorized copying or distribution.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Wifi size={20} /> Internet of Things (IoT) and Sensor-Based Digitization</h3>
            <p>The IoT and sensor technologies are enabling the digitization of physical environments and processes. Sensors can collect data on temperature, humidity, light levels, and other environmental factors, which can then be digitized and analyzed. This trend is transforming industries such as agriculture, manufacturing, and environmental monitoring. Sensor-based digitization allows for real-time monitoring and data-driven decision-making.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Phone size={20} /> Mobile Digitization and Citizen Science</h3>
            <p>Mobile devices are becoming powerful tools for digitization, enabling individuals to capture and share information from their surroundings. Mobile apps can be used to scan documents, capture photos, and record audio, making digitization more accessible to the general public. Citizen science projects are also leveraging mobile digitization to collect data on biodiversity, environmental conditions, and other phenomena. This trend empowers individuals to contribute to scientific research and data collection.</p>
          </div>
        </section>

        {/* ========== SECTION 3: 5 ADVANTAGES AND DISADVANTAGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>5 Advantages and Disadvantages of Digitization</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Digitization, the process of converting analog information into digital form, offers a plethora of benefits but also presents certain challenges. Understanding both sides is essential for effective implementation.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsUp size={20} /> Advantages of Digitization</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Enhanced Accessibility and Searchability:</strong> Digitized information can be accessed from anywhere with an internet connection, breaking down geographical barriers. Digital files can be easily shared, copied, and distributed, making information readily available to a wider audience. Moreover, digitized data can be indexed and searched using keywords or other criteria, enabling users to quickly locate specific information within vast collections. This greatly improves efficiency compared to manually searching through physical documents or archives.</li>
              <li><strong>Improved Preservation and Durability:</strong> Digital storage can significantly enhance the preservation of valuable documents and artifacts. Unlike physical materials that are susceptible to deterioration from environmental factors, handling, or natural disasters, digital files can be backed up and stored in multiple locations, minimizing the risk of data loss. This is especially important for historical documents, fragile artworks, and other irreplaceable items. Furthermore, digital copies do not degrade with repeated access, ensuring the long-term integrity of the information.</li>
              <li><strong>Increased Efficiency and Productivity:</strong> Digitization streamlines workflows and enhances productivity by automating tasks and eliminating the need for manual data entry. Digital files can be easily edited, manipulated, and integrated with other applications, facilitating collaboration and information sharing. This is particularly beneficial in industries such as healthcare, finance, and education, where large volumes of data need to be processed quickly and accurately.</li>
              <li><strong>Cost Savings and Space Reduction:</strong> Digitizing documents and records can lead to significant cost savings by reducing the need for physical storage space, paper, and printing supplies. Digital storage is typically more cost-effective than maintaining physical archives, especially for large volumes of data. This also frees up valuable physical space that can be used for other purposes.</li>
              <li><strong>Enhanced Data Analysis and Manipulation:</strong> Digitized data can be easily analyzed and manipulated using computer software. This enables users to extract insights, identify patterns, and generate reports that would be difficult or impossible to obtain from analog data. Digitization facilitates data mining, statistical analysis, and other advanced data processing techniques, empowering users to make informed decisions based on data-driven insights.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsDown size={20} /> Disadvantages of Digitization</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Initial Cost and Infrastructure Requirements:</strong> Digitization projects can require significant upfront investments in equipment, software, and personnel. Scanning equipment, digital storage systems, and specialized software can be expensive. Moreover, organizations may need to invest in training staff or hiring experts to manage the digitization process.</li>
              <li><strong>Data Security and Privacy Concerns:</strong> Digitized data is vulnerable to cyberattacks, data breaches, and unauthorized access. Organizations must implement robust security measures to protect sensitive information, including encryption, access controls, and regular security audits. Privacy concerns also arise when digitizing personal data, as it can be easily shared or misused.</li>
              <li><strong>Technological Obsolescence:</strong> Digital technologies are constantly evolving, and file formats or storage media can become obsolete over time. This can make it challenging to access digitized data in the future. Organizations need to develop strategies for data migration and long-term preservation to mitigate this risk.</li>
              <li><strong>Copyright and Intellectual Property Issues:</strong> Digitizing copyrighted materials can raise complex legal issues. Organizations must ensure that they have the necessary permissions or licenses before digitizing copyrighted works. Digital piracy and unauthorized distribution of copyrighted content are also concerns.</li>
              <li><strong>Dependence on Technology:</strong> Digitized information is fully dependent on working technology. Power outages, hardware failure, or software corruption can render data inaccessible.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: 8 CHALLENGES IN DIGITIZATION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>8 Challenges in Digitization</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Digitization projects face a range of challenges that can impact their success. Addressing these challenges requires careful planning, resource allocation, and technical expertise.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Data Quality and Integrity:</strong> Ensuring the accuracy and completeness of digitized data is a significant challenge. Errors can occur during scanning, OCR, or data entry, leading to inaccurate or incomplete information. Implementing quality control measures and data validation procedures is essential.</li>
              <li><strong>Metadata Management:</strong> Metadata, or data about data, is crucial for organizing and retrieving digitized information. Developing and implementing effective metadata standards and management systems is essential for ensuring that digitized data is easily searchable and accessible.</li>
              <li><strong>Scalability and Storage Capacity:</strong> Digitization projects can generate vast amounts of data, requiring scalable storage solutions and efficient data management systems. Organizations must plan for future growth and ensure that their storage infrastructure can accommodate increasing volumes of data.</li>
              <li><strong>Workflow and Process Optimization:</strong> Digitization involves complex workflows and processes, from document preparation to data validation. Optimizing these workflows and processes is essential for maximizing efficiency and minimizing costs.</li>
              <li><strong>Staff Training and Expertise:</strong> Digitization requires specialized skills and knowledge. Organizations must invest in training staff or hiring experts to manage digitization projects and ensure that they are implemented effectively.</li>
              <li><strong>Budget Constraints:</strong> Digitization projects can be expensive, and organizations may face budget constraints that limit their ability to invest in necessary equipment, software, and personnel.</li>
              <li><strong>Legal and Regulatory Compliance:</strong> Digitization projects must comply with various legal and regulatory requirements, including copyright laws, data protection regulations, and accessibility standards. Ensuring compliance can be complex and time-consuming.</li>
              <li><strong>Change Management:</strong> Digitization can significantly impact organizational workflows and processes, requiring effective change management strategies. Organizations must communicate the benefits of digitization and address any concerns or resistance from staff.</li>
            </ol>
          </div>
        </section>

        {/* ========== SECTION 5: DEVELOPING DIGITIZATION POLICIES AND PROCEDURES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Developing Digitization Policies and Procedures</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Developing robust digitization policies and procedures is essential for ensuring that digitization projects are conducted efficiently, effectively, and in compliance with relevant legal and ethical standards. These policies and procedures provide a framework for decision-making, resource allocation, and workflow management, ensuring consistency and quality throughout the digitization process.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Policy Development: Establishing Guiding Principles</h3>
            <p>Digitization policies serve as the foundation for all digitization activities. They outline the organization's goals, objectives, and priorities for digitization, as well as the principles that will guide decision-making. These policies should address key areas such as selection criteria for materials to be digitized, quality standards, metadata requirements, data security and privacy, copyright and intellectual property considerations, and long-term preservation strategies.</p>
            <p>A well-defined digitization policy should align with the organization's overall mission and strategic goals. It should also consider the needs of stakeholders, including users, staff, and funding agencies. The policy should be documented, regularly reviewed, and updated to reflect changes in technology, best practices, and legal requirements. It also needs to be easily available to all staff.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ListChecks size={20} /> Procedure Development: Implementing Practical Steps</h3>
            <p>Digitization procedures provide step-by-step instructions for carrying out specific digitization tasks. They translate the guiding principles of the policy into practical actions, ensuring consistency and efficiency in digitization workflows. Procedures should cover all aspects of the digitization process, from document preparation and scanning to metadata creation and data validation.</p>
            <p>Developing detailed procedures helps to standardize digitization practices, ensuring that all staff members follow the same protocols. This promotes consistency in data quality and reduces the risk of errors. Procedures should be documented in a clear and concise manner, using flowcharts, checklists, and other visual aids. Regular training sessions should be conducted to ensure that staff members are familiar with the procedures and can apply them effectively.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Target size={20} /> Selection Criteria and Prioritization</h3>
            <p>Digitization policies should establish clear selection criteria for materials to be digitized. These criteria should consider factors such as the value of the materials, their physical condition, their relevance to the organization's mission, and their potential for use. Prioritization should be based on these criteria, ensuring that the most valuable and at-risk materials are digitized first.</p>
            <p>Establishing selection criteria helps to ensure that digitization resources are allocated effectively and that the most important materials are preserved. It also helps to avoid digitizing materials that are of limited value or that are already available in digital format.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircle size={20} /> Quality Control and Assurance</h3>
            <p>Digitization policies and procedures should include comprehensive quality control and assurance measures. This involves implementing procedures for checking the accuracy and completeness of digitized data, as well as for verifying the quality of digital images and other files.</p>
            <p>Quality control measures should be integrated into all stages of the digitization process, from document preparation to data validation. This includes conducting regular inspections, performing data validation checks, and using quality control software. Implementing a feedback mechanism is also important, so that problems can be identified and corrected quickly.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Tag size={20} /> Metadata Standards and Management</h3>
            <p>Metadata is essential for organizing and retrieving digitized information. Digitization policies should specify the metadata standards that will be used, as well as the procedures for creating and managing metadata.</p>
            <p>Using standardized metadata schemas ensures that digitized data is interoperable and can be easily shared and accessed. Metadata management procedures should cover all aspects of metadata creation, including data entry, validation, and storage.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Lock size={20} /> Data Security and Privacy</h3>
            <p>Digitization policies must address data security and privacy concerns. This includes implementing measures to protect digitized data from unauthorized access, modification, or destruction.</p>
            <p>Data security measures should include access controls, encryption, and regular backups. Privacy policies should address the handling of personal data and ensure compliance with relevant data protection regulations.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BookOpen size={20} /> Copyright and Intellectual Property</h3>
            <p>Digitization policies should address copyright and intellectual property issues. This includes ensuring that all digitized materials are used in compliance with copyright laws and that proper permissions are obtained when necessary.</p>
            <p>Organizations should develop clear guidelines for handling copyrighted materials and provide training to staff on copyright law. They should also implement procedures for tracking copyright ownership and obtaining permissions.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Archive size={20} /> Long-Term Preservation</h3>
            <p>Digitization policies should include strategies for long-term preservation of digitized data. This involves selecting appropriate file formats, storage media, and preservation techniques.</p>
            <p>Long-term preservation strategies should consider factors such as file format obsolescence, storage media degradation, and data migration. Organizations should develop a preservation plan that outlines the steps necessary to ensure the long-term accessibility of digitized data.</p>
          </div>
        </section>

        {/* ========== SECTION 6: DIGITAL MIGRATION OF RECORDS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Digital Migration of Records</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Digital migration of records is the process of transferring digital data from one storage medium or format to another. This is done to ensure the continued accessibility, usability, and preservation of digital records over time, particularly in the face of rapidly evolving technology and the inherent risks of data obsolescence. It's not simply copying files; it's a strategic process designed to safeguard digital information against the inevitable changes in hardware, software, and storage systems.</p>
            <p>The core purpose of digital migration is to combat technological obsolescence. As technology advances, older hardware and software become outdated, making it difficult or impossible to access data stored on those systems. File formats can also become obsolete, rendering digital records unusable. Digital migration proactively addresses these issues by transferring data to newer, more widely supported platforms and formats. This ensures that digital records remain accessible and usable for future generations, regardless of technological changes. It also mitigates the risk of data loss due to media degradation or hardware failure.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Data Format Migration</h3>
            <p>This involves converting digital records from one file format to another. For example, migrating documents from an older word processing format to a more current and widely supported format like PDF. This is essential for ensuring that digital records can be opened and viewed using contemporary software applications. Data format migration also addresses the issue of proprietary file formats, which may become inaccessible if the software vendor goes out of business or discontinues support.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><HardDriveIcon size={20} /> Storage Media Migration</h3>
            <p>This involves transferring digital records from one storage medium to another, such as from hard drives to solid-state drives (SSDs) or from optical discs to cloud storage. This is necessary to address the physical degradation of storage media and to take advantage of newer, more reliable storage technologies. Storage media migration also allows organizations to consolidate their data storage and reduce their reliance on older, less efficient storage systems.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Server size={20} /> Platform Migration</h3>
            <p>This involves transferring digital records from one hardware or software platform to another. For example, migrating data from an older operating system to a newer one or from an on-premises server to a cloud-based platform. Platform migration is often necessary to address compatibility issues and to take advantage of newer features and capabilities. It also allows organizations to consolidate their IT infrastructure and reduce their reliance on older, less efficient systems.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><LayersIcon size={20} /> Normalization and Standardization</h3>
            <p>Digital migration often involves normalizing and standardizing digital records to ensure consistency and interoperability. This includes converting data to a common format, applying metadata standards, and ensuring that data is structured and organized in a consistent manner. Normalization and standardization facilitate data sharing and integration, making it easier to access and use digital records across different systems and applications.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><CheckCircle size={20} /> Verification and Validation</h3>
            <p>After digital migration, it is essential to verify and validate the migrated data to ensure that it is accurate and complete. This involves comparing the migrated data to the original data and checking for any errors or omissions. Verification and validation are crucial for ensuring the integrity of digital records and for maintaining trust in the migrated data.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Tag size={20} /> Metadata Migration</h3>
            <p>Metadata, which provides contextual information about digital records, is crucial for their long-term preservation and accessibility. Digital migration must include the migration of metadata along with the data itself. This ensures that the context and meaning of digital records are preserved and that they can be easily searched and retrieved.</p>
          </div>
        </section>

        {/* ========== SECTION 7: 8 MEASURES IN SECURING DIGITAL OBJECTS ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>8 Measures in Securing Digital Objects</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Securing digital objects is paramount in today's digital landscape, where data breaches and cyber threats are increasingly common. Implementing robust security measures protects valuable digital assets from unauthorized access, modification, or destruction.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Access Control and Authentication:</strong> Access control mechanisms restrict access to digital objects based on user roles and permissions. This involves implementing strong authentication methods, such as multi-factor authentication (MFA), to verify user identities. By requiring multiple forms of identification, like passwords, biometric scans, or security tokens, MFA significantly reduces the risk of unauthorized access. Role-based access control (RBAC) further refines access by granting users only the privileges necessary for their specific tasks. This ensures that sensitive digital objects are only accessible to authorized personnel, minimizing the potential for internal threats.</li>
              <li><strong>Encryption:</strong> Encryption is a fundamental security measure that transforms digital data into an unreadable format, making it incomprehensible to unauthorized users. Encryption algorithms scramble the data, requiring a decryption key to restore it to its original form. This protects digital objects both in transit and at rest. When data is transmitted over networks, encryption ensures that it remains confidential, even if intercepted. Similarly, encrypting stored data safeguards it from unauthorized access in case of a data breach.</li>
              <li><strong>Data Backups and Redundancy:</strong> Regular data backups are essential for mitigating the impact of data loss due to hardware failures, software corruption, or cyberattacks. Creating multiple backup copies and storing them in geographically diverse locations provides redundancy, ensuring that data can be restored in the event of a disaster. Cloud-based backup services offer a convenient and secure way to store backups off-site. Implementing automated backup schedules and regularly testing the restoration process are crucial for ensuring the effectiveness of backup and redundancy strategies.</li>
              <li><strong>Firewalls and Intrusion Detection Systems (IDS):</strong> Firewalls act as a barrier between trusted internal networks and untrusted external networks, such as the internet. They monitor network traffic and block unauthorized access, preventing malicious actors from infiltrating the system. IDS systems enhance network security by detecting suspicious activity and alerting administrators to potential threats. These systems analyze network traffic for patterns that indicate intrusions, such as unauthorized access attempts or malware activity. Combining firewalls and IDS provides a comprehensive defense against network-based attacks.</li>
              <li><strong>Regular Security Audits and Vulnerability Assessments:</strong> Regular security audits and vulnerability assessments are essential for identifying and addressing security weaknesses in digital systems. Security audits involve reviewing security policies, procedures, and controls to ensure that they are effective. Vulnerability assessments use automated tools and manual testing to identify potential security vulnerabilities in software, hardware, and network configurations. By proactively identifying and mitigating security risks, organizations can reduce the likelihood of successful cyberattacks.</li>
              <li><strong>Software Patching and Updates:</strong> Software vulnerabilities are a common target for cyberattacks. Regularly patching and updating software is crucial for addressing these vulnerabilities and ensuring that systems are protected against known exploits. Software vendors release security patches to fix known flaws, and installing these patches promptly is essential for maintaining system security. Automating software updates can help ensure that systems are always running the latest security patches.</li>
              <li><strong>Data Loss Prevention (DLP) Systems:</strong> DLP systems are designed to prevent sensitive data from leaving an organization's control. These systems monitor data in transit, at rest, and in use, and block unauthorized data transfers. DLP systems can identify and block the transmission of sensitive information, such as credit card numbers, social security numbers, or confidential documents, via email, file transfers, or other channels. This helps prevent data leaks and ensures compliance with data protection regulations.</li>
              <li><strong>Employee Training and Awareness:</strong> Human error is a significant factor in many security breaches. Employee training and awareness programs are essential for educating staff about security best practices and promoting a security-conscious culture. This includes training on topics such as password security, phishing awareness, and data handling procedures. Regular security awareness campaigns and simulations can help reinforce security best practices and keep employees informed about emerging threats.</li>
            </ol>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Digitization & Digital Transformation</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Digitization</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trends</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Advantages & Disadvantages</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Challenges</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Migration & Security</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Convert. Preserve. Secure. Transform. 📄💾</p>
        </footer>

      </div>
    </div>
  );
};