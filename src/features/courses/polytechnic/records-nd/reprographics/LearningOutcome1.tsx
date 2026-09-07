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
  Fingerprint, KeyRound, Siren, Flame, Waves,Printer, Megaphone,

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
              Reprography & <span className="text-emerald-300 font-bold italic">Document Reproduction</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to reprography, photographic and non-photographic techniques, program development, policy maintenance, and legal compliance.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">reprography.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">REPRODUCE</span><span className="text-white">Documents;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">PRESERVE</span><span className="text-white">Originals;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">COMPLY</span><span className="text-white">Legally;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><FileText className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Printer size={20} className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: REPROGRAPHY DEFINED ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Reprography Defined</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Reprography is the process of reproducing documents and images using various technologies. It encompasses a range of methods, from traditional techniques like photocopying and offset printing to modern digital processes like scanning and digital printing. Essentially, it's the art and science of creating duplicates of original materials, whether they are text documents, photographs, artwork, or other forms of visual information.</p>
          </div>
        </section>

        {/* ========== SECTION 2: REASONS FOR RESORTING TO REPROGRAPHY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Reasons for Resorting to Reprography</h2>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Archive size={20} /> Document Preservation and Archiving</h3>
            <p>One of the most critical reasons for using reprography is to preserve and archive valuable documents. Original documents, especially those made from fragile materials like old paper, can deteriorate over time. Reprographic methods, such as scanning and microfilming, allow these documents to be converted into durable digital or film formats. This ensures that the information contained within them is preserved for future generations, even if the original documents are lost or damaged. Digital archiving also enables easy access and retrieval of information, which is particularly important for libraries, archives, and historical societies.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Send size={20} /> Efficient Information Distribution</h3>
            <p>Reprography facilitates the rapid and efficient distribution of information. Whether it's distributing meeting minutes, training materials, or marketing brochures, reprographic methods allow for the creation of multiple copies quickly and easily. Photocopying, digital printing, and offset printing are all widely used for this purpose. In today's fast-paced environment, the ability to quickly disseminate information is crucial for effective communication and collaboration. Digital reprography especially allows for instant worldwide distribution of documents.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> Cost-Effective Document Duplication</h3>
            <p>In many cases, reprography offers a cost-effective way to duplicate documents. Instead of manually rewriting or redrawing information, reprographic methods allow for the creation of multiple copies at a fraction of the time and cost. For example, photocopying is a relatively inexpensive way to make multiple copies of a document, especially for small to medium print runs. Digital printing can also be cost-effective for short-run and on-demand printing, as it eliminates the need for expensive setup costs. This is beneficial to small businesses and individuals who need to reproduce documents without incurring significant expenses.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Enhancing Document Accessibility</h3>
            <p>Reprography plays a vital role in enhancing document accessibility for individuals with disabilities. For example, scanning documents and converting them into digital formats allows for the use of screen readers and other assistive technologies. Large-format printing can also be used to create enlarged copies of documents for individuals with visual impairments. Furthermore, digital reprography can be used to create accessible versions of documents with features like text-to-speech and adjustable font sizes. This ensures that everyone has equal access to information, regardless of their abilities.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Megaphone size={20} /> Creating Marketing and Promotional Materials</h3>
            <p>Reprography is essential for creating marketing and promotional materials, such as brochures, flyers, posters, and banners. Digital printing and large-format printing allow for the production of high-quality, visually appealing materials that can be used to attract customers and promote products or services. These methods offer a wide range of customization options, including variable data printing, which allows for personalized marketing materials. Reprography allows businesses to create professional-looking marketing collateral that effectively communicates their brand message and reaches their target audience.</p>
          </div>
        </section>

        {/* ========== SECTION 3: PHOTOGRAPHIC AND NON-PHOTOGRAPHIC TECHNIQUES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Photographic and Non-Photographic Reprographic Techniques</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Reprographic techniques can be broadly categorized into photographic and non-photographic methods. Photographic techniques rely on light-sensitive materials and optical processes to create copies, while non-photographic techniques use mechanical or chemical processes.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Camera size={20} /> Photographic Techniques</h3>
            <p>These techniques involve the use of light to transfer an image onto a light-sensitive material, such as photographic film or paper. The process typically involves capturing an image with a camera or exposing a light-sensitive material to an original document. Photographic techniques are often used for high-quality reproduction of images and documents, especially when fine detail and tonal range are important.</p>
            <p className="mt-2"><strong>Advantages:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>High Image Quality: Photographic techniques can produce high-resolution copies with excellent detail and tonal range, especially when using high-quality film and processing.</li>
              <li>Accurate Color Reproduction: Photographic processes can accurately reproduce colors, making them suitable for reproducing photographs and artwork.</li>
              <li>Scalability: Photographic processes can be used to create copies of various sizes, from small prints to large-format enlargements.</li>
              <li>Archival Quality: When processed and stored correctly, photographic prints can have excellent archival qualities, lasting for many years.</li>
              <li>Fine detail: Photographic techniques can capture very fine details within an image, and reproduce them accurately.</li>
              <li>Established technology: Photographic techniques have been around for a long period, and the technology and practices are very well established.</li>
            </ul>
            <p className="mt-2"><strong>Limitations:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chemical Processing: Photographic processes often involve chemical processing, which can be time-consuming and require specialized equipment.</li>
              <li>Environmental Impact: Chemical processing can generate waste products that can be harmful to the environment.</li>
              <li>Cost: Photographic materials and processing can be relatively expensive, especially for large-scale reproduction.</li>
              <li>Time Consumption: Developing and printing photographs takes time, especially when compared to digital methods.</li>
              <li>Light Sensitivity: photographic materials are light sensitive, requiring darkroom conditions, or specialized equipment.</li>
              <li>Limited real time changes: Once a photograph is taken, changes are very difficult, or impossible to make.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Printer size={20} /> Non-Photographic Techniques</h3>
            <p>These techniques rely on mechanical or chemical processes that do not involve the use of light-sensitive materials. Examples include photocopying, offset printing, and mimeographing. These techniques are often used for high-volume reproduction of documents and images, especially when speed and cost-effectiveness are important.</p>
            <p className="mt-2"><strong>Advantages:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Speed and Efficiency: Non-photographic techniques, such as photocopying and digital printing, can produce copies quickly and efficiently, especially for high-volume jobs.</li>
              <li>Cost-Effectiveness: Non-photographic techniques are often more cost-effective than photographic techniques, especially for large print runs.</li>
              <li>Ease of Use: Many non-photographic techniques are relatively easy to use, requiring minimal training or specialized equipment.</li>
              <li>Variable Data Printing: Digital printing allows for variable data printing, which enables personalized or customized copies.</li>
              <li>On-Demand Printing: Digital printing allows for on-demand printing, reducing the need for large print runs and minimizing waste.</li>
              <li>Simplified workflows: Modern digital workflows allow for easy editing, and instant output of documents.</li>
            </ul>
            <p className="mt-2"><strong>Limitations:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lower Image Quality: Non-photographic techniques may not produce the same level of image quality as photographic techniques, especially for fine detail and tonal range.</li>
              <li>Limited Color Accuracy: Some non-photographic techniques may have limitations in color accuracy, especially when reproducing photographs or artwork.</li>
              <li>Media Limitations: Some non-photographic techniques may have limitations in the types of media that can be used, such as paper weight or texture.</li>
              <li>Mechanical Wear: Mechanical processes can lead to wear and tear on equipment, requiring maintenance and replacement.</li>
              <li>Potential for inconsistencies: Mechanical processes can have inconsistencies, leading to variations in copy quality.</li>
              <li>Dependence on power: Most non-photographic methods rely on electrical power, and will not function during power outages.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: DEVELOPING A REPROGRAPHY PROGRAM ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Developing a Reprography Program</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Developing a comprehensive reprography program involves a series of strategic steps to ensure efficient and effective document reproduction.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Target size={20} /> Needs Assessment and Planning</h3>
            <p>The initial phase is Needs Assessment and Planning. This stage requires a thorough evaluation of the organization's document reproduction needs. It involves identifying the types of documents that need to be reproduced, the volume of reproduction, the required quality, and the frequency of reproduction. This assessment also includes evaluating existing equipment, software, and personnel. Based on the needs assessment, a detailed plan should be developed, outlining the program's objectives, scope, and resources. This includes determining the appropriate reprographic methods, equipment, and software, as well as establishing a budget and timeline for implementation.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><HardDriveIcon size={20} /> Equipment and Software Selection</h3>
            <p>The next crucial step is Equipment and Software Selection. Based on the needs assessment, the appropriate reprographic equipment and software should be selected. This may include photocopiers, scanners, digital printers, large-format printers, and document management software. Factors to consider when selecting equipment and software include cost, performance, reliability, ease of use, and compatibility with existing systems. It's essential to research different vendors and compare their products and services to ensure the best value for the organization. This step also includes setting up the physical workspace, ensuring that it is organized and efficient, with adequate space for equipment and supplies.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clipboard size={20} /> Policy and Procedure Development</h3>
            <p>Following equipment selection is Policy and Procedure Development. A clear and comprehensive reprographic policy should be developed to guide the program's operations. This policy should outline the organization's standards for document reproduction, including quality, security, and confidentiality. It should also define the roles and responsibilities of personnel involved in the program and establish procedures for requesting and processing reprographic services. This policy should be documented and communicated to all relevant personnel. Security protocols, including access control and data protection, should be included within the policy.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> Implementation and Training</h3>
            <p>Implementation and Training is the stage where the program is put into action. This involves installing and configuring the selected equipment and software, as well as training personnel on their use. Training should cover all aspects of the reprographic process, including equipment operation, software usage, quality control, and troubleshooting. It's important to provide ongoing training and support to ensure that personnel are proficient in using the equipment and software. This stage also includes a pilot program, if necessary, to test the new procedures and systems.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> Monitoring and Evaluation</h3>
            <p>Finally, Monitoring and Evaluation is the ongoing process of evaluating the program's effectiveness and making necessary adjustments. This involves tracking key performance indicators, such as turnaround time, cost per copy, and customer satisfaction. Regular audits should be conducted to ensure that the program is operating efficiently and effectively. Feedback from users should be collected and used to identify areas for improvement. The program should be periodically reviewed and updated to reflect changes in technology, organizational needs, and best practices.</p>
          </div>
        </section>

        {/* ========== SECTION 5: MAINTAINING AND ADHERING TO A REPROGRAPHIC POLICY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Maintaining and Adhering to a Reprographic Policy</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Maintaining and adhering to a reprographic policy is essential for ensuring the program's long-term success. This involves several key strategies.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Regular Policy Review and Updates:</strong> The reprographic policy should be reviewed and updated periodically to reflect changes in technology, organizational needs, and best practices. This ensures that the policy remains relevant and effective. Changes in technology, like more secure digital methods, require policy updates.</li>
              <li><strong>Effective Communication and Training:</strong> The reprographic policy should be clearly communicated to all relevant personnel, and they should be trained on its requirements. This ensures that everyone understands their roles and responsibilities and that the policy is consistently applied. Regular training sessions and workshops can help reinforce the policy's key principles and address any questions or concerns.</li>
              <li><strong>Enforcement and Compliance Monitoring:</strong> Enforcement and Compliance Monitoring are necessary to ensure that the policy is being followed. This involves establishing clear procedures for monitoring compliance and addressing any violations. Regular audits and inspections can help identify areas of non-compliance and provide opportunities for corrective action. Disciplinary measures should be taken when necessary to ensure that the policy is enforced consistently.</li>
              <li><strong>Feedback and Continuous Improvement:</strong> Feedback and Continuous Improvement are essential for maintaining and improving the reprographic policy. Feedback from users and personnel should be collected and used to identify areas for improvement. This feedback can be used to refine the policy, improve training programs, and enhance the overall effectiveness of the reprographic program. Regular reviews of feedback and metrics will keep the program working well.</li>
              <li><strong>Documentation and Record Keeping:</strong> Documentation and Record Keeping are also important. Proper documentation of all reprographic activities, including requests, approvals, and outputs, is essential for ensuring accountability and transparency. This documentation can also be used to track key performance indicators and identify areas for improvement. A system of record keeping will help ensure that the policy is followed, and provide proof of compliance.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: INFORMATION CENTRES AND LEGAL COMPLIANCE ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Information Centres and Legal Compliance: Navigating Legal Instruments</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Information centres must diligently adhere to various legal instruments to ensure lawful and ethical operations. These instruments, encompassing statutes, regulations, and judicial precedents, shape the legal landscape within which these centres function.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BookOpen size={20} /> Key Legal Instruments and Their Application</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Copyright Statutes:</strong> These statutes, like the Berne Convention and national copyright acts, define the rights of authors and creators. Information centres must implement policies that respect these rights, including obtaining licenses for copyrighted materials, adhering to fair use provisions, and implementing digital rights management (DRM) systems. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> These statutes prioritize the protection of intellectual property, balancing the interests of creators with public access to information. Information centres must analyze these statutes to understand the scope of copyright protection and the limitations on reproduction and distribution.</li>
              <li><strong>Data Protection and Privacy Regulations:</strong> Regulations such as GDPR, CCPA, and national data protection acts govern the collection, storage, and use of personal data. Information centres must develop privacy policies, obtain consent for data processing, and implement security measures to protect user data. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> These regulations emphasize individual rights to privacy and control over personal information. Information centres must analyze these instruments to understand their obligations regarding data handling and to implement robust data protection practices.</li>
              <li><strong>Freedom of Information (FOI) Acts:</strong> FOI acts, such as the US Freedom of Information Act and similar legislation in other countries, grant individuals the right to access government information. Information centres in the public sector must establish procedures for responding to FOI requests, maintain accurate records, and ensure transparency. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> These acts promote transparency and accountability in government, enabling citizens to access public information. Information centres must analyze these instruments to understand the scope of accessible information and the procedures for handling FOI requests.</li>
              <li><strong>Contract Law:</strong> Contract law governs agreements between parties, including licensing agreements, vendor contracts, and service agreements. Information centres must ensure that they enter into legally sound contracts that protect their interests. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> Contract law provides a framework for enforceable agreements, enabling information centres to establish clear terms and conditions for their operations. Analyzing contracts before signing them will limit future legal issues.</li>
              <li><strong>Cybersecurity Laws and Regulations:</strong> These laws and regulations address legal issues related to the internet and digital technologies, including data breaches, cybercrime, and online privacy. Information centres must implement cybersecurity measures to protect their systems and data from unauthorized access. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> Cybersecurity laws and regulations reflect the growing importance of protecting digital assets and information. Information centres must analyze these instruments to understand their obligations regarding cybersecurity and to implement appropriate security measures.</li>
              <li><strong>Records Management Laws:</strong> These laws and regulations dictate how records are kept, and for how long. They often vary by the type of information, and the type of organization that is keeping the records. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> Records management laws provide guidelines for the legal and compliant retention and destruction of records. Following these laws prevents legal issues relating to record keeping.</li>
              <li><strong>Accessibility Legislation:</strong> Laws such as the Americans with Disabilities Act (ADA) and similar legislation in other countries mandate accessibility for individuals with disabilities. Information centres must ensure that their facilities and services are accessible to all users. <br/><span className="italic text-indigo-500 dark:text-indigo-300">Analysis:</span> Accessibility legislation promotes equal access to information and services for individuals with disabilities. Information centres must analyze these instruments to understand their obligations regarding accessibility and to implement appropriate accommodations.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: LEGISLATION AND DOCUMENT REPRODUCTION ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Legislation and Document Reproduction</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Legislation plays a crucial role in shaping how documents are reproduced, establishing boundaries and obligations for individuals and organizations. These laws are designed to balance the rights of creators and copyright holders with the public's need for access to information, while also addressing issues like data privacy and national security.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <p>One of the most significant impacts of legislation on document reproduction stems from copyright laws. These laws grant creators exclusive rights to reproduce, distribute, and display their original works. This means that individuals and organizations must obtain permission from copyright holders before reproducing copyrighted materials, whether through photocopying, scanning, or digital copying. Copyright laws often include provisions for "fair use" or "fair dealing," which allow limited reproduction for purposes such as education, research, or criticism. However, the interpretation and application of these provisions can be complex and vary depending on jurisdiction, requiring careful consideration. For example, excessive photocopying of copyrighted materials for commercial purposes would likely violate copyright law, whereas making a single copy for personal research might fall under fair use.</p>
            <p className="mt-3">Furthermore, data protection and privacy legislation significantly influences the reproduction of documents containing personal information. Laws like the General Data Protection Regulation (GDPR) and similar national laws impose strict requirements on how personal data is collected, stored, and processed. This includes limitations on reproducing documents containing sensitive information, such as medical records, financial data, or identification documents. Organizations must implement appropriate security measures to protect personal data and ensure compliance with these regulations. Reproducing such documents without proper authorization or security safeguards can result in severe penalties.</p>
            <p className="mt-3">Freedom of information (FOI) laws also play a role in document reproduction, particularly in the public sector. These laws grant individuals the right to access government information, which may involve reproducing documents held by public institutions. However, FOI laws often include exemptions for certain types of information, such as classified documents or information related to national security. Public institutions must establish clear procedures for responding to FOI requests and ensure that information is released in accordance with the law. This can involve reproducing documents while redacting sensitive or exempt information.</p>
            <p className="mt-3">In addition to these specific areas, general legal principles such as contract law and intellectual property law also affect document reproduction. Licensing agreements, for example, may grant specific rights to reproduce certain documents, while trade secret laws may restrict the reproduction of confidential business information. Organizations must carefully review and comply with all applicable legal requirements to avoid legal liability. The legal landscape surrounding document reproduction is constantly evolving with technological advancements; therefore, staying informed regarding changes to laws is essential.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Reprography & Document Reproduction</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reprography</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Photographic Techniques</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Program Development</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Policy</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legal Compliance</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Reproduce. Preserve. Distribute. Comply. 📄🖨️</p>
        </footer>

      </div>
    </div>
  );
};