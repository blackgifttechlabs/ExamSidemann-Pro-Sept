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
  Fingerprint, KeyRound, Siren, Flame, Waves,Printer, ThumbsDown, Laptop, Ruler,Palette,

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
              The Photocopying Process & <span className="text-sky-300 font-bold italic">Xerographic Technology</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to photocopying, xerography, machine types, advantages, disadvantages, and legal instruments.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">photocopying_process.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">CHARGE</span><span className="text-white">Drum;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">EXPOSE</span><span className="text-white">Document;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">FUSE</span><span className="text-white">Toner;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Printer size={20} className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Shield className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: THE PHOTOCOPYING PROCESS ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>The Photocopying Process</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>The photocopying process, while seemingly simple, involves a series of intricate steps that utilize electrostatic principles and light sensitivity to reproduce documents. Here's a breakdown of the process:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> Charging the Drum</h3>
            <p>The process begins with a cylindrical drum, typically made of a photoconductive material like selenium, being electrically charged. A corona wire, or a charging roller, applies a uniform positive or negative charge to the surface of the drum. This charge creates an electrostatic field that will attract toner particles later in the process.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Lightbulb size={20} /> Exposure</h3>
            <p>The original document is placed face-down on a glass platen. A bright light source then illuminates the document. The light reflects off the white areas of the document and onto the charged drum. However, the dark areas of the document absorb the light. The reflected light, passing through a lens, creates an image of the original document on the surface of the charged drum. Where the light hits the drum, the photoconductive material loses its charge. Therefore, the areas of the drum corresponding to the dark areas of the original document retain their charge, while the areas corresponding to the white areas lose their charge. An electrostatic latent image is formed on the drum.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Package size={20} /> Toner Application</h3>
            <p>Toner, a fine powder composed of plastic particles and pigment, is then applied to the drum. The toner particles are oppositely charged to the remaining charge on the drum. This ensures that the toner is attracted to the charged areas of the drum, which correspond to the dark areas of the original document. The toner adheres to the charged areas, creating a visible image on the drum.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Send size={20} /> Transfer</h3>
            <p>A sheet of paper is fed into the photocopier and brought into contact with the drum. Before the paper touches the drum, it is given a stronger charge than the drum. This stronger charge attracts the toner particles from the drum to the paper, transferring the image.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sun size={20} /> Fusing</h3>
            <p>The toner particles are now loosely adhered to the paper. To permanently fix the image, the paper passes through a fuser, which consists of heated rollers. The heat and pressure from the rollers melt the toner particles, causing them to fuse with the paper fibers. This creates a permanent, durable copy of the original document.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sparkle size={20} /> Cleaning</h3>
            <p>After the toner has been transferred to the paper, any residual toner remaining on the drum is removed by a cleaning blade or brush. This ensures that the drum is clean and ready for the next copy. A discharge lamp removes any remaining electrical charge from the drum, preparing it for the next copying cycle.</p>
          </div>
        </section>

        {/* ========== SECTION 2: ADVANTAGES AND DISADVANTAGES ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Advantages and Disadvantages of Photocopying</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Photocopying remains a widely used method for document reproduction, offering a blend of convenience and efficiency. However, it also presents certain limitations. Here's a detailed examination of its advantages and disadvantages:</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsUp size={20} /> Advantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Speed and Efficiency:</strong> Photocopying is renowned for its speed, particularly when producing multiple copies of a document. Modern photocopiers can rapidly churn out numerous copies, significantly reducing the time required for large-scale document reproduction. This efficiency makes it ideal for situations where quick turnaround is essential, such as in busy offices or during urgent meetings. The ability to quickly duplicate documents streamlines workflows and enhances productivity.</li>
              <li><strong>Ease of Use:</strong> Photocopiers are generally user-friendly, requiring minimal training to operate. Most machines feature intuitive interfaces and straightforward controls, allowing individuals to quickly and easily make copies. This ease of use makes photocopying accessible to a wide range of users, regardless of their technical expertise. The simple process of placing a document on the platen and pressing a button makes it a very accessible method.</li>
              <li><strong>Cost-Effectiveness for Moderate Volumes:</strong> For moderate volumes of document reproduction, photocopying can be a cost-effective solution. The cost per copy is typically relatively low, especially when compared to other reproduction methods like professional printing. This makes photocopying suitable for everyday document duplication needs, such as making copies of reports, memos, or presentations. The lower initial cost of many machines also makes it accessible to small business.</li>
              <li><strong>On-Demand Duplication:</strong> Photocopying allows for on-demand duplication, meaning copies can be made as needed. This eliminates the need for large print runs and reduces the risk of producing excess copies that may become obsolete. This on-demand capability is particularly useful for documents that are frequently updated or revised.</li>
              <li><strong>Versatility with Paper Types:</strong> Many modern photocopiers can handle a variety of paper types and sizes, offering flexibility in document reproduction. This allows users to make copies on different types of paper, such as cardstock, transparencies, or colored paper, to suit their specific needs. This versatility enhances the range of applications for photocopying.</li>
              <li><strong>No external computer needed:</strong> Unlike digital printing, a photocopier can make a copy of a physical document without the use of a computer. This makes it very useful when a digital copy of a document is not available.</li>
            </ul>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><ThumbsDown size={20} /> Disadvantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Image Quality Limitations:</strong> Photocopying may not always produce the highest quality images, especially when reproducing photographs or detailed graphics. The resolution and tonal range of photocopies can be limited, resulting in images that are less sharp or detailed than the original. This limitation can be a concern when reproducing documents that require high-quality visuals.</li>
              <li><strong>Potential for Image Degradation:</strong> With each successive generation of photocopies, there is a potential for image degradation. Copies of copies can become increasingly blurry or distorted, resulting in a loss of clarity and detail. This issue is particularly noticeable when making multiple generations of copies from a single original.</li>
              <li><strong>Environmental Impact:</strong> Photocopying involves the use of toner, which can contain chemicals that are harmful to the environment. Additionally, the paper used in photocopying contributes to deforestation. The energy consumption of photocopiers also contributes to environmental concerns.</li>
              <li><strong>Limited Color Reproduction:</strong> While color photocopiers are available, they may not always accurately reproduce colors, especially when compared to professional printing methods. Color photocopies can sometimes appear washed out or have inconsistent color tones.</li>
              <li><strong>Maintenance Requirements:</strong> Photocopiers require regular maintenance, including toner replacement, cleaning, and repairs. This maintenance can be time-consuming and costly, particularly for high-volume machines.</li>
              <li><strong>Security Risks:</strong> Photocopiers can create security risks, as sensitive documents may be left on the platen or in the output tray. Also, some modern photocopiers store digital images of the documents that have been scanned, creating a data security problem.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: METHODS USED IN PHOTOCOPYING ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Methods Used in Photocopying</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Photocopying, at its core, relies on the principle of xerography, an electrostatic dry copying process. However, within this broad category, several methods and technologies contribute to the final reproduction of a document.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Zap size={20} /> Xerography (Electrostatic Photocopying)</h3>
            <p>This is the fundamental method employed in the vast majority of modern photocopiers. It's a process that utilizes electrostatic charges and toner to create an image on paper. The core components involved are a photoconductive drum, a light source, and toner. The drum, initially charged, is exposed to the image of the original document. Light reflected from the white areas of the document discharges the corresponding areas on the drum, while the dark areas retain their charge. Toner, a fine powder, is then attracted to the charged areas, creating a visible image. This image is transferred to a sheet of paper, and heat and pressure are applied to fuse the toner to the paper, making the image permanent. This dry process avoids the need for liquid chemicals, making it a clean and efficient method.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Scan size={20} /> Digital Photocopying</h3>
            <p>Modern photocopiers have evolved significantly, incorporating digital technology. In digital photocopying, the original document is first scanned, converting it into a digital image. This digital image can then be manipulated, edited, or stored before being printed. This allows for a range of advanced features, such as automatic document feeding, sorting, collating, and duplex printing (printing on both sides of the paper). Digital photocopying also enables integration with computer networks, allowing photocopiers to function as printers and scanners. This digital approach enhances flexibility and efficiency, providing greater control over the reproduction process.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Laser Exposure</h3>
            <p>Within the xerographic process, laser exposure is a specific technique used to create the image on the photoconductive drum. In traditional photocopiers, a bright light source is used to project an image onto the drum. However, in laser exposure, a laser beam is used to scan the original document and create the image. This method offers higher resolution and more precise image reproduction, resulting in sharper and clearer copies. Laser exposure is commonly used in laser printers and high-end photocopiers, where image quality is a critical factor. The precision of the laser allows for very small details to be accurately copied.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Package size={20} /> Toner and Development Methods</h3>
            <p>The application of toner to the photoconductive drum is a crucial step in photocopying. Various methods are used to achieve this, including magnetic brush development and different toner compositions. Magnetic brush development involves using a magnetic brush to apply toner to the drum, ensuring even and consistent coverage. Additionally, toner can be either dry or liquid. Dry toner, the most common type, is a fine powder that adheres to the charged areas of the drum. Liquid toner, less common, consists of toner particles suspended in a liquid carrier, offering very high-quality image reproduction. Furthermore, toners can be monocomponent, or two component. Two component toner uses a carrier, and the toner. Monocomponent toner uses just the toner.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Zap size={20} /> Charging and Transfer Techniques</h3>
            <p>The way the drum is charged, and the toner is transferred to the paper, also vary. Older machines used corona wires, whereas many newer machines use charging rollers. The charging roller is more efficient, and creates less ozone. The transfer of the toner to the paper can also vary, but electrostatic transfer is the most common. A charge is placed on the paper that is stronger than the charge on the drum, and the toner is drawn to the paper.</p>
          </div>
        </section>

        {/* ========== SECTION 4: TYPES OF MACHINES USED FOR XEROGRAPHY ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Machines Used for Xerography</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Xerography, the core process behind photocopying, is implemented in a variety of machines, each designed for specific purposes and volumes. These machines range from simple desktop models to complex, high-volume production systems.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Laptop size={20} /> Desktop Photocopiers</h3>
            <p>These are the most common type of xerographic machines, designed for small offices or personal use. Desktop photocopiers are typically compact and affordable, offering basic photocopying functions. They are ideal for low-volume copying needs, such as making copies of documents, reports, or presentations. While they may lack advanced features like automatic document feeding or duplex printing, they are simple to operate and maintain. Desktop photocopiers are well-suited for individuals or small businesses that require occasional document reproduction.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Printer size={20} /> Multifunction Printers (MFPs)</h3>
            <p>MFPs are versatile machines that combine the functions of a photocopier, printer, scanner, and fax machine. They are widely used in offices of all sizes, offering a comprehensive solution for document management. MFPs utilize xerography for photocopying and laser printing, providing high-quality output. They also feature scanning capabilities, allowing users to digitize documents and save them as digital files. MFPs often include network connectivity, enabling multiple users to access the machine from their computers. They streamline office workflows by integrating various document-related tasks into a single device.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Server size={20} /> Production Photocopiers/Digital Presses</h3>
            <p>These are high-volume, high-speed xerographic machines designed for commercial printing and large-scale document reproduction. Production photocopiers, or digital presses, can handle large print runs with exceptional speed and efficiency. They are equipped with advanced features such as automatic document feeders, high-capacity paper trays, and finishing options like stapling, folding, and binding. These machines are used in print shops, copy centers, and large organizations that require high-volume document production. They are capable of producing high-quality prints with consistent color and image reproduction.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Ruler size={20} /> Large-Format Photocopiers/Plotters</h3>
            <p>These machines are specialized xerographic devices designed for reproducing large-format documents, such as architectural drawings, engineering plans, and posters. Large-format photocopiers, also known as plotters, can handle wide rolls of paper or other media, producing high-resolution prints with precise detail. They are used in architectural firms, engineering companies, and design studios.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Palette size={20} /> Color Photocopiers/Digital Presses</h3>
            <p>These machines utilize xerography to produce full-color copies. They range from desktop color photocopiers for small offices to high-end digital presses for commercial printing. Color xerography involves using four toner colors (cyan, magenta, yellow, and black) to create a wide range of colors. Modern color photocopiers and digital presses offer advanced color management tools, ensuring accurate color reproduction and consistent print quality. They are used for producing marketing materials, brochures, and other documents that require vibrant color.</p>
          </div>
        </section>

        {/* ========== SECTION 5: LEGAL INSTRUMENTS AND THEIR IMPACT ========== */}
        <section className="space-y-6 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Legal Instruments and Their Impact on Photocopying</h2>
          </div>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <p>Photocopying, while a ubiquitous practice, is subject to a variety of legal instruments that regulate its use. These instruments aim to balance the rights of copyright holders with the public's need for access to information, while also addressing issues of data privacy and security.</p>
          </div>

          <div className={cardClasses(colors[0 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><BookOpen size={20} /> Copyright Law</h3>
            <p>Copyright law is the most significant legal instrument affecting photocopying. It grants creators exclusive rights to reproduce, distribute, and display their original works. This means that photocopying copyrighted materials without permission can infringe on these rights. Copyright laws typically include provisions for "fair use" or "fair dealing," which allow limited reproduction for purposes such as education, research, criticism, or news reporting. However, the interpretation of these provisions can be complex and vary by jurisdiction. For example, photocopying an entire textbook for commercial purposes would likely violate copyright law, while making a single copy of a journal article for personal research might be considered fair use. Information centers and libraries often establish clear photocopying policies to guide users on copyright compliance. They are often required to display copyright notices near the machines.</p>
          </div>

          <div className={cardClasses(colors[1 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Lock size={20} /> Data Protection and Privacy Legislation</h3>
            <p>Photocopying documents containing personal information is subject to data protection and privacy laws, such as the General Data Protection Regulation (GDPR) and similar national laws. These laws impose strict requirements on how personal data is collected, stored, and processed. Photocopying sensitive documents, such as medical records or financial statements, must be done in compliance with these regulations. Organizations must implement appropriate security measures to protect personal data from unauthorized access or disclosure. This can include limiting access to photocopying machines, shredding confidential documents, and implementing digital security measures for scanned copies.</p>
          </div>

          <div className={cardClasses(colors[2 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Eye size={20} /> Freedom of Information (FOI) Laws</h3>
            <p>FOI laws grant individuals the right to access government information, which may involve photocopying documents held by public institutions. However, FOI laws often include exemptions for certain types of information, such as classified documents or information related to national security. Public institutions must establish clear procedures for responding to FOI requests and ensure that information is released in accordance with the law. This can involve photocopying documents while redacting sensitive or exempt information. The balance between the public's right to know and the need to protect sensitive information is a key aspect of FOI laws.</p>
          </div>

          <div className={cardClasses(colors[3 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><FileText size={20} /> Contract Law</h3>
            <p>Contract law can also affect photocopying, particularly in the context of licensing agreements. For example, a library may have a licensing agreement with a publisher that grants specific rights to photocopy certain materials. These agreements may specify the number of copies that can be made, the purposes for which copies can be used, and any restrictions on distribution. Organizations must ensure that they comply with the terms of these agreements to avoid legal liability.</p>
          </div>

          <div className={cardClasses(colors[4 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><AwardIcon size={20} /> Intellectual Property Law (Beyond Copyright)</h3>
            <p>While copyright is the most relevant, other forms of intellectual property can be relevant. Trade secrets, for instance, could be compromised through illegal photocopying. If a company has a document that contains information that is considered a trade secret, that information must be protected. Also, if a document contains a trademarked logo or image, the reproduction of that image could be regulated by Trademark law.</p>
          </div>

          <div className={cardClasses(colors[5 % colors.length])}>
            <h3 className="text-xl font-bold mb-2 flex-items-center gap-2"><Shield size={20} /> National Security Laws</h3>
            <p>In some cases, national security laws can restrict the photocopying of certain documents. Governments may classify documents as confidential or secret to protect national security interests. Photocopying these documents without authorization can result in severe penalties. This is especially true for documents related to military operations, intelligence activities, or critical infrastructure.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — The Photocopying Process & Xerographic Technology</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Xerography</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Advantages & Disadvantages</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Machine Types</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Legal Instruments</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Charge. Expose. Transfer. Fuse. 🖨️⚡</p>
        </footer>

      </div>
    </div>
  );
};