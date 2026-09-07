import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Layout,
  Shield,
  FileText,
  Users,
  RefreshCw,
  HeartHandshake,
  Truck,
  CheckCircle,
  Cloud,
  Clock,
  Rocket,
  Brain,
  Wifi,
  Eye,
  BotIcon,
  BarChart,
  CpuIcon,
  Headset,
  Link,
  Box,
  Sprout,
  RecycleIcon,
  Server,
  Puzzle,
  Watch,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Layers,
  Link2,
  Zap,
  Globe,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon,
  Factory,
  Target,
  TrendingUp,
  Activity,
  Database,
  Package,
  Warehouse,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'tech-effects', label: 'Technology Effects' },
  { id: 'new-storing', label: 'New Storing Developments' },
  { id: 'computers-eval', label: 'Computers Evaluation' },
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
        text: 'RFID technology was first used during World War II to identify friendly aircraft. Today, it\'s a cornerstone of modern inventory management.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating new technologies, always consider the total cost of ownership, including implementation, training, and maintenance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 9 effects of new technologies: Visibility, Automation, AI, Cloud, Drones, AR/VR, Blockchain, 3D Printing, and Wearables.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t adopt technology just for the sake of it. Evaluate the actual business needs and ensure the technology aligns with your operational goals.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'RFID technology was first used during World War II to identify friendly aircraft. Today, it\'s a cornerstone of modern inventory management.',
      },
      {
        title: 'Pro Tip',
        text: 'When evaluating new technologies, always consider the total cost of ownership, including implementation, training, and maintenance.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 9 effects of new technologies: Visibility, Automation, AI, Cloud, Drones, AR/VR, Blockchain, 3D Printing, and Wearables.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t adopt technology just for the sake of it. Evaluate the actual business needs and ensure the technology aligns with your operational goals.',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            New Technologies in{' '}
            <span className="text-cyan-300 font-bold italic">
              Stores Management
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the effect of new technologies, new developments in storing, and evaluating the use of computers in stores management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> New Technologies
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CpuIcon size={14} className="inline mr-1" /> Developments
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> Computers Evaluation
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, RFID, automation..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
            {/* SECTION 1: The Effect of New Technologies */}
            <div
              ref={(el) => {
                sectionRefs.current['tech-effects'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Effect of New Technologies in Stores Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The landscape of stores management is undergoing a rapid transformation driven by the advent of new technologies. These advancements are not merely incremental improvements; they are fundamentally reshaping how organizations manage inventory, optimize operations, and enhance customer satisfaction. The integration of these technologies is enabling stores managers to achieve unprecedented levels of efficiency, accuracy, and agility, transforming traditional warehouses into data-driven, automated hubs.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Eye size={16} /> Enhanced Inventory Visibility and Real-Time Tracking
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Technologies like RFID (Radio-Frequency Identification), IoT (Internet of Things) sensors, and advanced barcode systems are providing unprecedented visibility into inventory levels, locations, and movements. RFID tags, for instance, enable real-time tracking of individual items throughout the supply chain, eliminating the need for manual scanning and reducing the risk of errors. IoT sensors can monitor environmental conditions, such as temperature and humidity, ensuring that sensitive materials are stored under optimal conditions. This real-time visibility empowers stores managers to make informed decisions about inventory replenishment, order fulfilment, and resource allocation, minimizing stockouts and overstocking. This also allows for better tracking of expiry dates, and product recalls.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <BotIcon size={16} /> Automation and Robotics for Increased Efficiency
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Automation and robotics are revolutionizing materials handling and storage processes. Automated Storage and Retrieval Systems (AS/RS), Automated Guided Vehicles (AGVs), and robotic picking systems are automating repetitive tasks, such as picking, packing, and sorting, significantly increasing efficiency and reducing labour costs. These technologies can operate 24/7, enabling continuous operations and reducing lead times. Robots can also handle heavy or hazardous materials, improving workplace safety. Automation also minimizes human error, resulting in increased accuracy and consistency in warehouse operations. This also frees up staff, to perform more value-added tasks.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Brain size={16} /> Data Analytics and Artificial Intelligence (AI) for Predictive Insights
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Data analytics and AI are enabling stores managers to gain valuable insights from vast amounts of data generated by warehouse operations. AI-powered demand forecasting algorithms can predict future demand with greater accuracy, allowing for optimized inventory planning and reduced stockouts. Machine learning algorithms can analyse historical data to identify patterns and trends, helping to optimize warehouse layout, improve picking routes, and enhance overall efficiency. AI-driven chatbots can provide real-time support to warehouse staff, answering questions and resolving issues quickly. This data driven approach, allows for better decision making, and proactive problem solving.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Cloud size={16} /> Cloud-Based Warehouse Management Systems (WMS) for Improved Collaboration and Flexibility
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Cloud-based WMS solutions are providing stores managers with greater flexibility and accessibility. These systems enable real-time collaboration between different departments and stakeholders, improving communication and coordination. Cloud-based WMS solutions can be accessed from any device with an internet connection, allowing for remote monitoring and management of warehouse operations. They also offer scalability and flexibility, allowing organizations to easily adapt to changing business needs. This also simplifies the integration, of other software systems.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Rocket size={16} /> Drones and Autonomous Vehicles for Enhanced Logistics
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Drones and autonomous vehicles are transforming logistics and delivery operations. Drones can be used for inventory checks, warehouse inspections, and even delivery of small packages. Autonomous vehicles can automate transportation of goods between warehouses and distribution centres, reducing transportation costs and improving delivery times. These technologies are particularly beneficial in remote or difficult-to-access locations. This also reduces the risk of accidents, during transportation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Headset size={16} /> Augmented Reality (AR) and Virtual Reality (VR) for Training and Operations
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    AR and VR technologies are being used to enhance training and operational efficiency in stores management. AR glasses can provide warehouse staff with real-time information and guidance during picking and packing operations. VR simulations can be used to train employees on safe materials handling practices and emergency procedures. These technologies enhance learning and reduce training time, improving overall efficiency and safety. This also allows for the safe simulation of dangerous scenarios.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Link size={16} /> Blockchain Technology for Supply Chain Transparency and Security
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Blockchain technology is being used to enhance supply chain transparency and security. Blockchain can create a secure and immutable record of all transactions throughout the supply chain, improving traceability and reducing the risk of fraud. This technology is particularly useful for tracking high-value or sensitive goods, such as pharmaceuticals and electronics. This also increases consumer confidence, in the authenticity of products.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Box size={16} /> 3D Printing for On-Demand Manufacturing and Spare Parts
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    3D printing is enabling on-demand manufacturing of spare parts and components, reducing inventory holding costs and improving maintenance efficiency. This technology allows organizations to produce parts locally, eliminating the need for long lead times and reducing transportation costs. 3D printing can also be used to create custom packaging and prototypes, enhancing flexibility and innovation. This also reduces the amount of waste, from unused spare parts.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Watch size={16} /> Wearable Technology for Improved Worker Safety and Productivity
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Wearable technology, such as smartwatches and exoskeletons, is being used to improve worker safety and productivity. Smartwatches can provide real-time alerts and notifications, while exoskeletons can assist with heavy lifting and reduce physical strain. These technologies enhance worker comfort and reduce the risk of injuries. This also allows for the tracking of worker movements, and performance.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: New Developments in Storing */}
            <div
              ref={(el) => {
                sectionRefs.current['new-storing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                New Developments in Storing
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The realm of storing, whether it is in warehouses, data centres, or even home organization, is constantly evolving, driven by technological advancements, sustainability concerns, and the ever-increasing demand for efficiency. These new developments are not just about adding more space; they are about smarter, more adaptable solutions that optimize resources and minimize waste.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Layout size={16} /> Automated Storage and Retrieval Systems (AS/RS) Advancements
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    AS/RS technology is becoming increasingly sophisticated, moving beyond simple automated cranes to include highly adaptable robotic systems. These systems are now capable of handling diverse product shapes and sizes, integrating AI for optimized picking and packing, and utilizing machine learning to predict and adapt to fluctuating demand. Modern AS/RS also focus on energy efficiency, incorporating regenerative braking and smart power management. The ability to dynamically reconfigure storage layouts based on real-time data is a significant leap, allowing for maximum space utilization and reduced handling times. This technology is crucial in high volume warehouses, and distribution centres.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Wifi size={16} /> Smart Warehousing and IoT Integration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The integration of IoT sensors into storage facilities is creating "smart warehouses" that monitor and control environmental conditions, track inventory movement, and optimize energy consumption. Sensors can provide real-time data on temperature, humidity, and light levels, ensuring optimal storage conditions for sensitive materials. Predictive maintenance algorithms can analyse sensor data to identify potential equipment failures before they occur, minimizing downtime. Smart lighting and HVAC systems can adjust automatically based on occupancy and environmental conditions, reducing energy waste. This data driven approach, allows for better management, and proactive maintenance.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Sprout size={16} /> Vertical Farming and Urban Storage Solutions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    In urban environments where space is at a premium, vertical farming and innovative urban storage solutions are gaining traction. Vertical farming utilizes multi-tiered growing systems to maximize crop production in limited spaces, while urban storage solutions incorporate modular and adaptable designs to optimize space utilization in residential and commercial buildings. These solutions often incorporate smart technologies for environmental control and resource management. These solutions, help to reduce the amount of transportation needed, for goods.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <RecycleIcon size={16} /> Sustainable and Eco-Friendly Storage Practices
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Sustainability is becoming a key driver in storage development. This includes the use of recycled and biodegradable materials for storage containers and packaging, as well as the implementation of energy-efficient storage systems. Solar-powered warehouses, rainwater harvesting systems, and waste reduction initiatives are becoming increasingly common. The focus is on minimizing the environmental impact of storage operations while reducing operating costs. This also includes, the optimization of delivery routes, to reduce emissions.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Server size={16} /> Data Centre Storage Innovations
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Data centres are facing exponential growth in data storage demands. New technologies like solid-state drives (SSDs) and advanced data compression techniques are increasing storage density and reducing energy consumption. Cloud storage and edge computing are also changing the way data is stored and accessed, enabling more flexible and scalable storage solutions. Liquid cooling and other advanced cooling systems are being implemented to manage the heat generated by high-density storage devices. This also includes the development of more efficient data storage algorithms.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Puzzle size={16} /> Modular and Adaptable Storage Systems
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Flexibility and adaptability are key requirements in today's dynamic business environment. Modular storage systems that can be easily reconfigured to meet changing needs are becoming increasingly popular. These systems allow organizations to quickly adapt to fluctuations in demand, changes in product lines, and evolving storage requirements. This also includes the ability to quickly expand, or contract, storage space.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Link size={16} /> Blockchain for Supply Chain and Storage Transparency
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Blockchain technology is being used to enhance transparency and security in supply chain and storage operations. By creating an immutable record of all transactions and movements, blockchain can improve traceability and reduce the risk of fraud. This is particularly valuable for high-value or sensitive goods, such as pharmaceuticals and electronics. This technology also increases consumer confidence, in the authenticity of products.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <Brain size={16} /> AI-Powered Inventory Optimization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Artificial intelligence (AI) and machine learning are being used to optimize inventory management and storage. AI-powered algorithms can analyse vast amounts of data to predict demand, optimize stock levels, and automate replenishment processes. This helps to reduce stockouts, minimize holding costs, and improve overall inventory efficiency. This also improves the ability to react to sudden changes in demand.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <BotIcon size={16} /> Robotic Picking and Packing
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Robotic picking and packing systems are becoming more and more advanced. Modern robots can handle a large range of products and are able to work at a much higher rate of speed than humans. This technology is changing the face of fulfilment centres.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Evaluating the Use of Computers */}
            <div
              ref={(el) => {
                sectionRefs.current['computers-eval'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Evaluating the Use of Computers in Stores Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The integration of computers into stores management has revolutionized the way organizations handle inventory, logistics, and overall operations. It is not simply about replacing manual record-keeping; it is about leveraging technology to enhance accuracy, efficiency, and decision-making. Computers have become indispensable tools for managing the complexities of modern storage facilities, enabling organizations to optimize resources, minimize errors, and improve customer satisfaction.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <CheckCircle size={16} /> Enhanced Inventory Accuracy and Real-Time Tracking
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computers enable the implementation of sophisticated inventory management systems (IMS) that provide real-time visibility into stock levels, locations, and movements. Barcode scanning, RFID technology, and automated data capture systems ensure accurate data entry and minimize human errors. This real-time data allows stores managers to track inventory with precision, identify discrepancies promptly, and prevent stockouts or overstocking. This also allows for the easy tracking of expiry dates, and batch numbers. This accuracy, reduces the amount of time, spent on physical stock counts.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Truck size={16} /> Streamlined Order Processing and Fulfilment
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computerized systems streamline order processing and fulfilment, automating tasks such as order entry, picking, packing, and shipping. Electronic data interchange (EDI) facilitates seamless communication with suppliers and customers, reducing order processing time and improving accuracy. Automated picking systems and conveyor belts further enhance efficiency by minimizing manual handling and reducing lead times. This leads to faster order fulfilment, improved customer satisfaction, and reduced operational costs. This also allows for the easy tracking of orders, and shipments.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Layout size={16} /> Improved Warehouse Layout and Space Optimization
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computer-aided design (CAD) software and warehouse management systems (WMS) enable stores managers to optimize warehouse layout and space utilization. These tools allow for the simulation of different storage configurations, helping to identify the most efficient arrangement of shelving, racking, and materials handling equipment. This leads to increased storage capacity, reduced travel distances, and improved material flow. This also allows for the easy reconfiguration of warehouse layouts, to adapt to changing needs.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <BarChart size={16} /> Data Analysis and Reporting for Informed Decision-Making
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computers enable the collection, storage, and analysis of vast amounts of data generated by warehouse operations. Data analytics tools can be used to identify trends, patterns, and insights that can inform decision-making regarding inventory control, procurement, and resource allocation. Real-time dashboards and reports provide stores managers with key performance indicators (KPIs), such as inventory turnover, stockout rates, and order fulfilment rates, allowing them to monitor performance and identify areas for improvement. This data driven approach, allows for proactive problem solving, and better forecasting.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Clock size={16} /> Automation of Repetitive Tasks and Reduced Labour Costs
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computers enable the automation of repetitive tasks, such as data entry, inventory tracking, and order processing. This reduces the need for manual labour, leading to significant cost savings. Automated systems, such as AS/RS and AGVs, further enhance efficiency by automating materials handling and storage processes. This allows for the reallocation of staff, to more value-added tasks.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Users size={16} /> Enhanced Communication and Collaboration
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computerized systems facilitate seamless communication and collaboration between different departments and stakeholders. Email, instant messaging, and collaboration platforms enable real-time communication and information sharing. Cloud-based WMS solutions provide remote access to inventory data and warehouse operations, enabling collaboration between geographically dispersed teams. This also allows for better communication with suppliers, and customers.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Shield size={16} /> Improved Security and Access Control
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computerized systems enhance security and access control in storage facilities. Access control systems, such as key card access and biometric scanners, restrict entry to authorized personnel only. Surveillance cameras and alarm systems provide real-time monitoring and detection of security breaches. Inventory management systems can track the movement of materials, preventing theft and unauthorized access. This also allows for the easy tracking of who has accessed, certain areas of the warehouse.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
                    <FileText size={16} /> Reduced Paperwork and Improved Documentation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computerized systems eliminate the need for paper-based records, reducing paperwork and improving documentation. Electronic records are easier to access, search, and retrieve. Digital signatures and electronic documents ensure the authenticity and integrity of records. This also reduces the risk of lost, or damaged documents.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <HeartHandshake size={16} /> Improved Customer Service
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    By ensuring accurate order fulfilment and timely delivery, computerized systems contribute to improved customer service. Real-time inventory data allows for accurate order confirmation and delivery estimates. Automated shipping systems and tracking tools provide customers with real-time updates on their orders. This also allows for better communication, with customers.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <RefreshCw size={16} /> Scalability and Flexibility
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Computerized systems offer scalability and flexibility, allowing organizations to easily adapt to changing business needs. Cloud-based solutions can be scaled up or down to meet fluctuating demand. Modular software and hardware systems can be configured to adapt to different warehouse layouts and operational requirements. This allows for the easy integration, of new technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Tech Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Tech Effects</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Storing Developments</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Computer Evaluation Points</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                New technologies are transforming stores management. From RFID and IoT for visibility, to AI and robotics for automation, and cloud-based systems for flexibility. New developments in storing include AS/RS advancements, smart warehousing, vertical farming, and sustainable practices. Computers enable accurate tracking, streamlined order processing, data analysis, and improved security. Embrace technology to stay competitive.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Effect of New Technologies</strong> – enhanced visibility (RFID, IoT), automation/robotics, AI/data analytics, cloud WMS, drones/autonomous vehicles, AR/VR, blockchain, 3D printing, and wearables improve efficiency, accuracy, and safety.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">New Developments in Storing</strong> – AS/RS advancements, smart warehousing with IoT, vertical farming, sustainable practices, data centre innovations, modular systems, blockchain, AI inventory optimisation, and robotic picking.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evaluating Computers</strong> – enhance inventory accuracy, streamline order processing, optimise layout, enable data analysis, automate repetitive tasks, improve communication/security, reduce paperwork, improve customer service, and offer scalability.
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
            Sidemann Academic Registry • ND Purchasing &amp; Supply – New Technologies in Stores 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;
