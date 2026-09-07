import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  ListChecks,
  Layout,
  Clock,
  Truck,
  RefreshCw,
  Handshake,
  Building2,
  FileText,
  Scale,
  Heart,
  Search,
  AlertCircle,
  Users,
  Eye,
  ClipboardCheck,
  DollarSign,
  Briefcase,
  Lock,
  Gavel,
  Receipt,
  BarChart3,
  Database,
  Box,
  GlobeIcon,
  Wifi,
  Satellite,
  Fingerprint,
  Camera,
  Zap,
  Smartphone,
  Cloud,
  Network,
  Link,
  Code,
  FileSearch,
  FileCheck,
  TrendingUp,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'objectives', label: 'IT Objectives' },
  { id: 'roles', label: 'IT Roles' },
  { id: 'internet', label: 'Internet Uses' },
  { id: 'security', label: 'EDL Security' },
  { id: 'lis', label: 'LIS Principles' },
  { id: 'technologies', label: 'IT Technologies' },
  { id: 'systems', label: 'How IT Works' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first barcode was scanned in 1974 on a pack of Wrigley\'s gum. Today, barcodes and RFID are essential for tracking millions of packages daily in global logistics.',
      },
      {
        title: 'Pro Tip',
        text: 'When implementing IT in logistics, prioritize integration between systems (ERP, WMS, TMS) to avoid data silos and ensure seamless information flow across the supply chain.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember LIS principles with the acronym "ARTIC": Accuracy, Real-time, Timeliness, Integration, and Consistency — the foundation of effective logistics information systems.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook cyber security in logistics IT. Ransomware attacks on logistics companies have increased 500% in recent years, causing major disruptions and financial losses.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first barcode was scanned in 1974 on a pack of Wrigley\'s gum. Today, barcodes and RFID are essential for tracking millions of packages daily in global logistics.',
      },
      {
        title: 'Pro Tip',
        text: 'When implementing IT in logistics, prioritize integration between systems (ERP, WMS, TMS) to avoid data silos and ensure seamless information flow across the supply chain.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember LIS principles with the acronym "ARTIC": Accuracy, Real-time, Timeliness, Integration, and Consistency — the foundation of effective logistics information systems.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t overlook cyber security in logistics IT. Ransomware attacks on logistics companies have increased 500% in recent years, causing major disruptions and financial losses.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper to render a clean card
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Information Technology in{' '}
            <span className="text-cyan-300 font-bold italic">
              Logistics &amp; Distribution
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to IT objectives, roles in logistics, internet uses, security measures, LIS principles, and key technologies in distribution management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> IT Systems
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Satellite size={14} className="inline mr-1" /> GPS &amp; RFID
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, technology, principle..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* SECTION 1: Objectives of IT */}
            <div
              ref={(el) => {
                sectionRefs.current['objectives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Objectives of Information Technology (IT)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The goals of IT are to improve efficiency, effectiveness, and decision-making within an organization. Its job is to make things faster, better, and easier to understand using computers and software.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Improve Operational Efficiency', icon: <Target size={16} />, content: 'Automating tasks and processes to reduce manual effort and errors. This leads to increased productivity, faster processing times, and lower operational costs. For example, automated inventory tracking systems reduce manual counts and automated routing software optimizes delivery schedules.' },
                  { title: '2. Enhance Decision-Making', icon: <Target size={16} />, content: 'Providing accurate and timely information to support informed decisions. IT provides access to real-time data and analytical tools that enable managers to make informed decisions, including generating reports, visualizing data, and simulating scenarios.' },
                  { title: '3. Improve Communication and Collaboration', icon: <Users size={16} />, content: 'Facilitating seamless communication and information sharing between departments and stakeholders. IT provides tools such as email, instant messaging, and collaboration platforms for quick and efficient information sharing.' },
                  { title: '4. Increase Customer Satisfaction', icon: <Heart size={16} />, content: 'Providing better customer service through improved responsiveness and personalized experiences. IT enables online order tracking, personalized recommendations, and efficient customer support through chatbots and automated systems.' },
                  { title: '5. Enable Innovation', icon: <Zap size={16} />, content: 'Supporting the development and implementation of new technologies and business models. IT provides tools for cloud computing, artificial intelligence, and the Internet of Things (IoT), enabling real-time monitoring and optimization.' },
                  { title: '6. Reduce Costs', icon: <DollarSign size={16} />, content: 'Optimizing resource utilization and reducing operational expenses. IT automates processes, improves efficiency, and optimizes resource utilization, including reducing paper usage and minimizing errors.' },
                  { title: '7. Enhance Security', icon: <Shield size={16} />, content: 'Protecting sensitive data and systems from unauthorized access and cyber threats. IT implements firewalls, encryption, access controls, intrusion detection systems, and data backup recovery systems.' },
                  { title: '8. Improve Data Management', icon: <Database size={16} />, content: 'Ensuring data accuracy, consistency, and accessibility. IT provides databases, data warehouses, and data analytics platforms with data governance policies for consistent and compliant data usage.' },
                  { title: '9. Support Business Growth', icon: <TrendingUp size={16} />, content: 'Providing scalable and flexible solutions that can adapt to changing business needs. Cloud computing allows businesses to scale resources up or down as needed, such as handling increasing traffic during peak sales periods.' },
                  { title: '10. Ensure Compliance', icon: <FileCheck size={16} />, content: 'Meeting regulatory requirements and industry standards. IT provides tools for data management, security, and reporting, including data privacy, financial reporting, and environmental compliance systems.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Roles of IT in Logistics */}
            <div
              ref={(el) => {
                sectionRefs.current['roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Roles of IT in Logistics and Distribution Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Inventory Management', icon: <Database size={16} />, content: 'Using software to track and manage inventory levels, reducing stockouts and overstocking. IT systems such as inventory management software and barcode scanners provide real-time visibility into inventory levels, automate reordering, and optimize inventory levels.' },
                  { title: '2. Warehouse Management', icon: <Building2 size={16} />, content: 'Optimizing warehouse operations through automated storage, retrieval, and picking processes. Warehouse management systems (WMS) automate warehouse operations, improving efficiency, reducing errors, and optimizing space utilization.' },
                  { title: '3. Transportation Management', icon: <Truck size={16} />, content: 'Planning and optimizing transportation routes, tracking shipments, and managing carrier relationships. Transportation management systems (TMS) help businesses plan and optimize routes, track shipments, and manage carrier relationships.' },
                  { title: '4. Order Management', icon: <ClipboardCheck size={16} />, content: 'Automating order processing, tracking, and fulfilment. Order management systems automate order processing, tracking, and fulfilment, ensuring orders are processed quickly and accurately, reducing errors, and improving customer satisfaction.' },
                  { title: '5. Demand Forecasting', icon: <BarChart3 size={16} />, content: 'Using data analytics to predict future demand and optimize inventory levels. IT tools such as data analytics platforms and forecasting software help businesses predict future demand and optimize inventory levels, reducing stockouts and overstocking.' },
                  { title: '6. Supply Chain Visibility', icon: <Eye size={16} />, content: 'Providing real-time visibility into the movement of goods throughout the supply chain. IT systems such as supply chain management (SCM) software and tracking technologies provide real-time visibility into the movement of goods.' },
                  { title: '7. Customer Relationship Management (CRM)', icon: <Users size={16} />, content: 'Managing customer interactions and providing personalized services. CRM systems help businesses manage customer interactions and provide personalized services, improving customer satisfaction and loyalty.' },
                  { title: '8. Electronic Data Interchange (EDI)', icon: <Link size={16} />, content: 'Automating the exchange of business documents between trading partners. EDI automates the exchange of business documents, such as purchase orders and invoices, reducing manual data entry, speeding up transaction processing, and improving accuracy.' },
                  { title: '9. E-commerce Integration', icon: <Code size={16} />, content: 'Integrating online sales platforms with logistics and distribution systems. IT enables seamless integration between e-commerce platforms and logistics and distribution systems, ensuring online orders are processed efficiently and delivered on time.' },
                  { title: '10. Data Analytics and Reporting', icon: <BarChart3 size={16} />, content: 'Generating reports and analysing data to identify trends and improve decision-making. IT tools such as data analytics platforms and business intelligence (BI) software help businesses generate reports and analyse data to identify trends and improve decision-making.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Uses of the Internet */}
            <div
              ref={(el) => {
                sectionRefs.current['internet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Uses of the Internet in Today's Changing Market
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The internet has revolutionized how businesses operate, enabling faster communication, global reach, and data-driven decision-making. The internet is like a giant network that lets businesses talk to their own people (Intranet), talk to partners and customers (Extranet), and keep track of vehicles and equipment (Telematics).
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Network size={16} /> 1. Intranet
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> A private network within an organization, accessible only to its employees.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Uses:</strong> Internal communication and collaboration, sharing documents and resources, accessing company policies, facilitating internal training.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Impact:</strong> Enables faster internal communication, provides a centralized platform for sharing information, facilitates remote work, and ensures employees are always up to date in a rapidly changing market.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Link size={16} /> 2. Extranet
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> A controlled network that allows external partners, such as suppliers, customers, and distributors, to access specific parts of an organization's Intranet.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Uses:</strong> Supply chain management and collaboration, customer portals for order tracking, sharing product information with distributors, facilitating secure transactions.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Impact:</strong> Strengthens relationships with external partners, improves supply chain efficiency, enhances customer service through self-service portals, and enables better collaboration with suppliers.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Satellite size={16} /> 3. Telematics
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Definition:</strong> The integration of telecommunications and information technology to transmit, store, and receive data related to vehicles and other assets.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Uses:</strong> Vehicle tracking and fleet management, real-time monitoring of vehicle performance and fuel consumption, route optimization, remote diagnostics and maintenance.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Impact:</strong> Improves operational efficiency, reduces transportation costs, enhances customer service with accurate delivery estimates, enables data-driven fleet management decisions, and allows preventative maintenance to reduce downtime.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Security Measures in EDL */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Security Measures and Enforcement in Electronic Distribution and Logistics (EDL)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are sending a valuable package. EDL is about how that package, and the information about it, moves through a digital world. Security measures are like locks and alarms that protect the package and its information from being stolen or damaged. Enforcement is like having security guards who make sure everyone follows the rules.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Access Control Systems', icon: <Fingerprint size={16} />, content: 'Restricting who can access certain areas, systems, or data. Includes biometric authentication (fingerprints or facial recognition), access cards, and digital access logs that create audit trails. Crucial for preventing unauthorized access, theft, data breaches, or sabotage.' },
                  { title: '2. Inventory Management Systems with Tracking', icon: <Database size={16} />, content: 'Using technology to track the movement of goods throughout the supply chain. Includes RFID tags, barcode scanning, and GPS tracking. Enables real-time monitoring, quick identification of lost or stolen items, and proactive investigation of discrepancies.' },
                  { title: '3. Cyber Security Measures', icon: <Shield size={16} />, content: 'Protecting computer systems and data from cyber threats such as hacking, malware, and phishing. Includes data encryption, firewalls and intrusion detection systems, regular security updates, and employee training on cyber security best practices.' },
                  { title: '4. Surveillance and Monitoring', icon: <Camera size={16} />, content: 'Using technology to monitor activities in warehouses, distribution centres, and transportation vehicles. Includes CCTV cameras, motion sensors, and alarm systems that deter crime, provide evidence, and alert security personnel to unauthorized activity.' },
                  { title: '5. Security Protocols and Training', icon: <ClipboardCheck size={16} />, content: 'Establishing clear security procedures and training employees on how to follow them. Includes security policies and procedures, employee training programs, and regular security audits to assess effectiveness.' },
                  { title: '6. Blockchain Technology', icon: <Link size={16} />, content: 'Creating a secure, transparent, and tamper-proof record of transactions. Provides tamper-proof records, transparency for all parties, and enhanced traceability for verifying authenticity and ensuring supply chain data integrity.' },
                  { title: '7. Enforcement of Regulations and Standards', icon: <Gavel size={16} />, content: 'Ensuring compliance with relevant security regulations and industry standards. Includes regular inspections, penalties for violations, and industry certifications like ISO 27001 that demonstrate adherence to best practices.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: Principles of LIS */}
            <div
              ref={(el) => {
                sectionRefs.current['lis'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Principles of a Logistics Information System (LIS)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Accuracy and Precision', icon: <Target size={16} />, content: 'Information must be meticulously captured and maintained with granular details regarding inventory attributes, shipment dimensions, precise coordinates, and customer order specifications. Even minor inaccuracies can cascade through the supply chain, causing financial losses, operational inefficiencies, and eroded trust.' },
                  { title: '2. Real-time Timeliness and Responsiveness', icon: <Clock size={16} />, content: 'Information must be delivered in real-time or near-real-time, empowering stakeholders to react swiftly to demand spikes, supply chain disruptions, or transportation delays. Real-time tracking enables dispatchers to reroute deliveries in response to traffic congestion.' },
                  { title: '3. Consistent Availability and Accessibility', icon: <Cloud size={16} />, content: 'Information must be consistently and seamlessly accessible to authorized users across diverse platforms and devices. Requires a robust system architecture with redundancy, scalability, and user-friendly interfaces. Mobile-enabled LIS allows field personnel to access data from remote locations.' },
                  { title: '4. Contextual Relevance and Actionability', icon: <Target size={16} />, content: 'Information must be contextually meaningful and readily actionable. The LIS should filter, aggregate, and present data aligned with specific user roles, transforming raw data into actionable insights that identify trends, patterns, and anomalies for strategic decision-making.' },
                  { title: '5. Seamless Integration and Interoperability', icon: <Link size={16} />, content: 'The LIS must interoperate with diverse enterprise systems including ERP, CRM, and SRM platforms. This interconnectedness facilitates a holistic view of the supply chain, breaking down silos, streamlining processes, and enhancing collaboration.' },
                  { title: '6. End-to-End Visibility and Transparency', icon: <Eye size={16} />, content: 'The LIS must provide end-to-end transparency across the entire supply chain, from raw material sourcing to final delivery. This holistic view empowers stakeholders to monitor the flow of goods, identify bottlenecks, and proactively mitigate risks.' },
                  { title: '7. Adaptive Flexibility and Scalability', icon: <RefreshCw size={16} />, content: 'The system must seamlessly accommodate evolving business requirements, fluctuating demand patterns, and dynamic market conditions. A modular and scalable architecture, such as cloud-based systems, can readily scale resources to meet peak demand.' },
                  { title: '8. Operational Efficiency and Optimization', icon: <Zap size={16} />, content: 'The LIS must continuously optimize logistics processes through data-driven insights and intelligent automation. Leveraging advanced analytics, machine learning, and AI to automate routine tasks, streamline workflows, and enhance decision-making, such as route optimization algorithms.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: Basic IT Technologies */}
            <div
              ref={(el) => {
                sectionRefs.current['technologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Basic Information Technologies Used in Distribution Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine you are running a delivery company. You need to know where your trucks are, where they have been, and how long it took them to get there. Information technology (IT) helps you do that. Vehicle tracking and tracing uses things like GPS and computers to keep an eye on your trucks and the packages they are carrying.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Global Positioning System (GPS)', icon: <Satellite size={16} />, content: 'A satellite-based navigation system that provides precise location information. GPS devices installed in vehicles track real-time location, providing coordinates including latitude, longitude, and altitude. Essential for route optimization, delivery scheduling, and proving where and when deliveries were made.' },
                  { title: '2. Radio Frequency Identification (RFID)', icon: <Wifi size={16} />, content: 'Uses radio waves to automatically identify and track tags attached to objects. RFID tags can be attached to packages, pallets, or vehicles. RFID readers scan these tags, providing information about location and status. Particularly useful for tracking goods within warehouses and quickly locating specific items.' },
                  { title: '3. Telematics', icon: <Satellite size={16} />, content: 'Combines telecommunications and informatics to collect and transmit data from vehicles. Provides information including vehicle location, speed, fuel consumption, engine performance, and driver behaviour. Enables fleet monitoring, identifying areas for improvement, and ensuring driver safety.' },
                  { title: '4. Mobile Communication Technologies', icon: <Smartphone size={16} />, content: 'Cellular networks transmit data from vehicles to central systems, enabling real-time communication and data transfer. Essential for ensuring managers have up-to-date information about fleet location and status. Also enables mobile apps on drivers\' phones to update delivery status in real time.' },
                  { title: '5. Software Platforms and Applications', icon: <Layout size={16} />, content: 'Used to collect, process, and display data from vehicle tracking and tracing systems. Provide user-friendly interfaces with real-time mapping, route optimization, delivery scheduling, and performance dashboards. Generate reports on KPIs such as delivery times, fuel consumption, and driver behaviour.' },
                  { title: '6. Barcode Scanning', icon: <FileSearch size={16} />, content: 'While GPS tracks the vehicle, barcodes track the packages. Barcode scanners record the unique code on each package at every step of its journey. Creates a complete digital history, allowing companies and customers to know exactly where the package is and when it was at each location.' },
                  { title: '7. Cloud Computing', icon: <Cloud size={16} />, content: 'Allows for the storage and access of large amounts of tracking data. Essential for modern distribution management where vast amounts of information are generated daily. Cloud-based platforms enable real-time access to data from any location and easy scaling of storage and processing power.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: How IT Systems Work */}
            <div
              ref={(el) => {
                sectionRefs.current['systems'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                How Information Technology (IT) Systems Work
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Barcoding', icon: <FileSearch size={16} />, content: 'Uses optical scanners to read barcodes, patterns of lines and spaces that represent data. Barcodes are used to identify and track products, packages, and locations. It is like giving every item a unique digital fingerprint. Barcodes greatly reduce human error and accelerate processing speed.' },
                  { title: '2. Optical Character Recognition (OCR)', icon: <FileText size={16} />, content: 'Allows computers to "read" text from images, such as scanned documents or photographs. Used to automatically extract data from forms, invoices, and other documents. Eliminates the need for manual data entry, saving time and reducing errors. Very useful when processing large amounts of paper documents.' },
                  { title: '3. Radio Frequency Identification (RFID)', icon: <Wifi size={16} />, content: 'Uses radio waves to automatically identify and track tags attached to objects. Unlike barcodes, RFID tags can be read without direct line of sight and store more data. Can be embedded in products, pallets, or vehicles. Allows for real-time tracking of items as they move through the supply chain.' },
                  { title: '4. Data Capture', icon: <Database size={16} />, content: 'The process of collecting data from various sources and converting it into a digital format for computer systems. Encompasses barcoding, OCR, RFID, and other automated data entry methods. Essential for creating a digital record of all activities in the supply chain, which can then be used to analyse performance and identify improvements.' },
                  { title: '5. How These Technologies Work Together', icon: <RefreshCw size={16} />, content: (
                    <>
                      <p>These technologies often work together to provide a comprehensive view of the supply chain:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>A product may be labelled with a barcode for identification.</li>
                        <li>RFID tags may be used to track the product as it moves through a warehouse.</li>
                        <li>OCR may be used to process invoices and delivery documents.</li>
                        <li>All this data is then captured and stored in a central database, providing real-time visibility into the location and status of the product.</li>
                      </ul>
                      <p className="mt-2">By using these IT systems, companies can improve efficiency, reduce costs, and enhance customer service.</p>
                    </>
                  ) },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 IT Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>IT Objectives</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>IT Roles in Logistics</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>LIS Principles</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Information Technology is the backbone of modern logistics and distribution. IT objectives focus on efficiency, decision-making, and security. Key technologies include GPS, RFID, telematics, barcoding, and cloud computing. A Logistics Information System (LIS) must be accurate, real-time, accessible, integrated, and scalable. Security measures—access control, cyber security, surveillance, and training—are essential for protecting goods and data in electronic distribution and logistics.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IT Objectives</strong> – improve operational efficiency, enhance decision-making, improve communication, increase customer satisfaction, enable innovation, reduce costs, enhance security, improve data management, support business growth, and ensure compliance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IT Roles in Logistics</strong> – inventory management, warehouse management, transportation management, order management, demand forecasting, supply chain visibility, CRM, EDI, e-commerce integration, and data analytics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internet Uses</strong> – Intranet (internal communication), Extranet (external partner collaboration), and Telematics (vehicle tracking and fleet management).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">LIS Principles</strong> – accuracy, real-time timeliness, consistent availability, contextual relevance, seamless integration, end-to-end visibility, adaptive flexibility, and operational efficiency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">IT Technologies</strong> – GPS, RFID, telematics, mobile communication, software platforms, barcode scanning, and cloud computing work together to provide end-to-end supply chain visibility and operational optimization.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Information Technology in Logistics 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
