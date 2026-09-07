import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  Search as SearchIcon,
  Clock as ClockIcon,
  Layout,
  HardDrive as HardDriveIcon,
  Edit,
  Target,
  Globe as GlobeIcon,
  Shield,
  ListChecks,
  Settings as SettingsIcon,
  Type,
  BookOpen,
  Layers as LayersIcon,
  FileText,
  Scissors,
  Circle as CircleIcon,
  Archive,
  Database,
  User,
  Calendar,
  CheckCircle,
  Send,
  ShieldCheck,
  Bell,
  RefreshCw,
  File,
  Folder,
  Clipboard,
  Mail,
  Lock,
  Eye,
  AlertCircle,
  Trash2,
  Cloud,
  Server,
  Disc,
  Box,
  Home,
  Warehouse,
  Zap,
  MapPin,
  DollarSign,
  Sun,
  FireExtinguisher,
  Bug,
  Users,
  Phone,
  MessageSquare,
  Headphones,
  Award,
  Briefcase,
  Coffee,
  ThumbsUp,
  HelpCircle,
  AlertTriangle,
  Mic,
  Video,
  Camera,
  Share2,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  BarChart,
  PieChart,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'reception-concepts', label: 'Reception Concepts' },
  { id: 'manager-duties', label: 'Manager Duties' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'telephone-skills', label: 'Telephone Skills' },
  { id: 'difficult-customers', label: 'Difficult Customers' },
  { id: 'communication-skills', label: 'Communication Skills' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'The first impression is formed within the first 7 seconds of meeting someone. A warm welcome at reception sets the tone for the entire visit.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use the caller\'s name during telephone conversations – it personalises the interaction and shows you are listening.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key reception concepts with "F-C-I-S-C": First Impressions, Communication Hub, Information Management, Security, Customer Service.',
      },
      {
        title: 'Common Mistake',
        text: 'Many receptionists forget to smile when answering the phone – a smile can be heard in your voice and creates a warmer tone.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first impression is formed within the first 7 seconds of meeting someone. A warm welcome at reception sets the tone for the entire visit.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use the caller\'s name during telephone conversations – it personalises the interaction and shows you are listening.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the five key reception concepts with "F-C-I-S-C": First Impressions, Communication Hub, Information Management, Security, Customer Service.',
      },
      {
        title: 'Common Mistake',
        text: 'Many receptionists forget to smile when answering the phone – a smile can be heard in your voice and creates a warmer tone.',
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

  // ─── Helper to render a clean card ──────────────────────────────────────
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Reception Management, Communication &{' '}
            <span className="text-emerald-300 font-bold italic">
              Customer Service
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to reception management, telephone handling, difficult customers, communication skills, and social media.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Phone size={14} className="inline mr-1" /> Reception
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MessageSquare size={14} className="inline mr-1" /> Communication
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Customer Service
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
                placeholder="Search for a concept, skill, technique..."
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
            {/* SECTION 1: Reception Management */}
            <div
              ref={(el) => {
                sectionRefs.current['reception-concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reception Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Reception management is a crucial aspect of any organization, serving as the first point of contact and significantly impacting the company's image. Here are some key concepts:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'First Impressions',
                    icon: <Award size={16} />,
                    content: 'The reception area is often the initial point of interaction for visitors, clients, and potential partners. The impression formed here can shape their perception of the entire organization. A clean, organized, and welcoming environment, coupled with friendly and professional staff, is essential for creating a positive first impression. This concept emphasizes the importance of visual appeal, efficient service, and courteous communication in establishing a favourable image. It is about ensuring that every individual who walks through the door feels valued and respected from the moment they arrive.',
                  },
                  {
                    title: 'Communication Hub',
                    icon: <MessageSquare size={16} />,
                    content: 'The reception desk acts as a central communication hub, handling incoming calls, emails, and in-person inquiries. Receptionists are responsible for accurately conveying messages, directing calls to the appropriate departments, and providing information to visitors. Effective communication skills, including active listening, clear articulation, and the ability to handle diverse inquiries, are paramount. This hub role also includes the responsibility to know who is in the office, and where they are located, and to be able to relay that information quickly and accurately.',
                  },
                  {
                    title: 'Information Management',
                    icon: <Database size={16} />,
                    content: 'Receptionists manage and disseminate information, including company policies, procedures, and general inquiries. They must be knowledgeable about the organization\'s structure, services, and key personnel. Efficient information management involves maintaining accurate records, organizing documents, and utilizing technology to streamline processes. This concept underlines the need for receptionists to be well-informed and capable of providing accurate and timely information to both internal and external stakeholders.',
                  },
                  {
                    title: 'Security and Safety',
                    icon: <Shield size={16} />,
                    content: 'Receptionists play a vital role in maintaining the security and safety of the premises. They monitor visitor access, ensure that only authorized individuals enter restricted areas, and respond to emergencies. This includes knowing emergency procedures, handling security systems, and being vigilant about potential threats. This aspect of reception management highlights the importance of security protocols and the receptionist\'s role in safeguarding the organization\'s assets and personnel.',
                  },
                  {
                    title: 'Customer Service Excellence',
                    icon: <ThumbsUp size={16} />,
                    content: 'Reception is a primary customer service point. Providing excellent customer service is a core concept. This includes addressing client concerns, resolving issues, and ensuring a positive experience for all visitors. This requires empathy, patience, and a proactive approach to addressing needs. Customer service excellence in reception management contributes to client satisfaction and fosters long-term relationships.',
                  },
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

            {/* SECTION 2: Reception Manager's Duties and Responsibilities */}
            <div
              ref={(el) => {
                sectionRefs.current['manager-duties'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reception Manager's Duties and Responsibilities
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A reception manager plays a critical role in overseeing the smooth operation of the reception area.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Staff Supervision and Training',
                    icon: <Users size={16} />,
                    content: 'The reception manager is responsible for supervising and training reception staff, ensuring they adhere to company policies and provide excellent customer service. This involves setting performance standards, conducting regular evaluations, and providing ongoing training to enhance their skills. This responsibility extends to creating work schedules, managing leave requests, and fostering a positive and productive work environment. The manager also handles conflict resolution and ensures that the team is motivated and equipped to handle the diverse demands of the reception area.',
                  },
                  {
                    title: 'Operational Management',
                    icon: <SettingsIcon size={16} />,
                    content: 'This involves overseeing the day-to-day operations of the reception area, including managing phone systems, handling mail and deliveries, and maintaining office supplies. The reception manager ensures that all equipment is functioning correctly, and that the area is clean and organized. They are responsible for implementing and enforcing procedures to streamline operations and improve efficiency. This also includes managing budgets for supplies and equipment and ensuring that resources are used effectively.',
                  },
                  {
                    title: 'Visitor Management and Security',
                    icon: <Shield size={16} />,
                    content: 'The reception manager ensures that all visitors are greeted professionally and that security protocols are followed. This includes maintaining a visitor log, issuing visitor badges, and monitoring access to restricted areas. They are responsible for implementing and enforcing security procedures to protect the organization\'s assets and personnel. In the event of an emergency, the reception manager must be prepared to implement emergency procedures and ensure the safety of everyone in the reception area.',
                  },
                  {
                    title: 'Customer Service and Complaint Resolution',
                    icon: <Headphones size={16} />,
                    content: 'The reception manager is responsible for ensuring that all visitors and clients receive excellent customer service. They address and resolve complaints or issues promptly and professionally. This includes handling difficult customers, mediating disputes, and ensuring that all feedback is addressed. The manager also works to identify areas for improvement in customer service and implements strategies to enhance the visitor experience.',
                  },
                  {
                    title: 'Administrative Duties',
                    icon: <Clipboard size={16} />,
                    content: 'Reception managers are responsible for a variety of administrative tasks. This can include maintaining records, preparing reports, and handling correspondence. They may also be involved in scheduling meetings, coordinating events, and managing calendars. This requires strong organizational skills, attention to detail, and the ability to prioritize tasks effectively. The manager often acts as a liaison between different departments, ensuring that information is communicated effectively.',
                  },
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

            {/* SECTION 3: Booking Appointments and Arranging Interviews */}
            <div
              ref={(el) => {
                sectionRefs.current['appointments'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Booking Appointments and Arranging Interviews
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Efficient scheduling and coordination are essential for smooth operations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Appointment Scheduling',
                    icon: <Calendar size={16} />,
                    content: 'This involves managing appointment calendars, scheduling meetings, and ensuring that appointments are confirmed and communicated to all parties involved. Receptionists must be proficient in using scheduling software and managing multiple calendars simultaneously. They must also be able to handle changes and cancellations efficiently and communicate these changes to the relevant parties. This requires careful attention to detail, strong organizational skills, and the ability to prioritize appointments effectively. It is also important to consider the time constraints of all involved parties, and to schedule in a manner that is efficient for everyone.',
                  },
                  {
                    title: 'Interview Arrangement',
                    icon: <Briefcase size={16} />,
                    content: 'This involves coordinating interview schedules, booking meeting rooms, and ensuring that interview materials are prepared and distributed. Receptionists must communicate effectively with candidates, hiring managers, and other stakeholders. They are also responsible for ensuring that the interview process runs smoothly and that candidates have a positive experience. This includes providing clear instructions to candidates, answering their questions, and ensuring that they feel comfortable and welcome. This requires strong communication skills, attention to detail, and the ability to handle confidential information.',
                  },
                  {
                    title: 'Meeting Room Management',
                    icon: <Layout size={16} />,
                    content: 'This includes the scheduling of meeting rooms, ensuring that rooms are properly prepared, and that any required equipment is available. This also includes the cleaning and tidying of the meeting rooms after the meeting has concluded. This requires organization, and the ability to plan ahead.',
                  },
                  {
                    title: 'Confirmation and Follow-Up',
                    icon: <CheckCircle size={16} />,
                    content: 'It is vital to confirm all appointments and interviews, and to follow up with all relevant parties. This reduces the number of no shows and ensures that everyone is on the same page. This can include sending confirmation emails, making phone calls, and sending reminders.',
                  },
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

            {/* SECTION 4: Receptionist and Telephone Handling Skills */}
            <div
              ref={(el) => {
                sectionRefs.current['telephone-skills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Receptionist and Telephone Handling Skills
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Telephone handling is a cornerstone of a receptionist's role, as it often forms the first impression a caller receives.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Professional and Courteous Demeanour',
                    icon: <Headphones size={16} />,
                    content: 'A receptionist\'s tone of voice and demeanour over the phone reflect the company\'s image. Maintaining a professional and courteous approach, even during busy periods, is crucial. This involves answering calls promptly, speaking clearly and politely, and using appropriate greetings and farewells. A calm and friendly tone can diffuse tension and create a positive experience for the caller. It is important to avoid jargon or overly casual language, ensuring that the caller feels respected and valued. The receptionist should also be mindful of their background noise and try to keep it to a minimum.',
                  },
                  {
                    title: 'Effective Communication and Active Listening',
                    icon: <MessageSquare size={16} />,
                    content: 'Receptionists must be adept at both conveying information and actively listening to callers. This means understanding the caller\'s needs, asking clarifying questions, and providing accurate and concise information. Active listening involves paying close attention to the caller\'s words, tone, and any underlying emotions. This allows the receptionist to respond appropriately and address any concerns effectively. Clear communication ensures that messages are conveyed accurately and that callers understand the information being provided. This skill is vital for directing calls to the correct departments and resolving inquiries efficiently.',
                  },
                  {
                    title: 'Efficient Call Management',
                    icon: <Zap size={16} />,
                    content: 'Managing a high volume of calls efficiently is essential. This includes knowing how to place calls on hold, transfer calls to appropriate extensions, and take accurate messages. Receptionists should be proficient in using the telephone system and any related software. They must be able to prioritize calls and handle multiple inquiries simultaneously. Efficient call management minimizes wait times and ensures that callers receive prompt and accurate service. This also involves knowing how to deal with multiple incoming lines, and how to prioritize calls in an effective manner.',
                  },
                  {
                    title: 'Information Retrieval and Provision',
                    icon: <Database size={16} />,
                    content: 'Receptionists often serve as a source of information for callers. They must be able to quickly retrieve and provide accurate information about the organization, its services, and key personnel. This requires a thorough understanding of the company\'s structure and operations. Receptionists should also be able to access and utilize relevant databases and resources to answer inquiries effectively. They should be able to answer frequently asked questions and know who to contact if they are unable to provide an answer.',
                  },
                  {
                    title: 'Message Taking and Follow-Up',
                    icon: <Clipboard size={16} />,
                    content: 'Accurate message taking is crucial for ensuring that information is relayed correctly. Receptionists should record the caller\'s name, contact information, message details, and the time of the call. They should also ensure that messages are delivered promptly to the intended recipients. Following up on messages and ensuring that they have been addressed is also essential. This includes confirming that messages have been received and that any necessary actions have been taken.',
                  },
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

            {/* SECTION 5: Dealing with Difficult Customers */}
            <div
              ref={(el) => {
                sectionRefs.current['difficult-customers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Dealing with Difficult Customers
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Handling difficult customers requires patience, empathy, and effective problem-solving skills.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Maintaining Calm and Professionalism',
                    icon: <Smile size={16} />,
                    content: 'When faced with a difficult customer, the most important skill is to remain calm and professional. This involves controlling emotions, avoiding defensiveness, and focusing on resolving the issue. A calm demeanour can help de-escalate the situation and create a more conducive environment for problem-solving. It is important to remember that the customer\'s frustration is often not personal, and that maintaining a professional attitude is essential for upholding the company\'s image.',
                  },
                  {
                    title: 'Active Listening and Empathy',
                    icon: <MessageSquare size={16} />,
                    content: 'Allowing the customer to express their concerns without interruption is crucial. Active listening involves paying attention to the customer\'s words, tone, and body language (if in person). Empathy involves understanding and acknowledging the customer\'s feelings. By demonstrating empathy, the receptionist can build rapport and show that they care about the customer\'s concerns. This also allows for the receptionist to fully understand the problem, and to then provide the best solution.',
                  },
                  {
                    title: 'Effective Communication and Problem-Solving',
                    icon: <Target size={16} />,
                    content: 'Clear and concise communication is essential for resolving customer issues. This involves explaining solutions clearly, avoiding jargon, and ensuring that the customer understands the steps being taken. Receptionists should be able to think critically and creatively to find solutions that address the customer\'s needs. This may involve consulting with colleagues or supervisors to find the best course of action. It is also important to set realistic expectations, and to only promise what can be delivered.',
                  },
                  {
                    title: 'Conflict Resolution and De-escalation',
                    icon: <Shield size={16} />,
                    content: 'Receptionists should be skilled in conflict resolution techniques. This involves identifying the root cause of the problem, mediating disputes, and finding mutually agreeable solutions. De-escalation techniques, such as using a calm tone of voice and avoiding confrontational language, can help prevent situations from escalating. It is important to know when to involve a supervisor or manager, and to do so before the situation gets out of hand.',
                  },
                  {
                    title: 'Follow-Up and Documentation',
                    icon: <CheckCircle size={16} />,
                    content: 'Following up with the customer after resolving the issue is essential for ensuring their satisfaction. This demonstrates that the company values their feedback and is committed to providing excellent customer service. Documenting the interaction, including the customer\'s concerns, the steps taken to resolve the issue, and any follow-up actions, is also important for record-keeping and future reference. This allows for any future interactions with the customer to be handled in a more informed manner.',
                  },
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

            {/* SECTION 6: Communication and Organizational Skills */}
            <div
              ref={(el) => {
                sectionRefs.current['communication-skills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Communication and Organizational Skills
              </h2>

              {/* Effective Listening Skills */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Headphones size={16} /> Effective Listening Skills
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Effective listening is not just hearing words; it is understanding the message behind them. It is about being fully present and engaged in the conversation. In a professional context, especially when recording calls and messages, good listening ensures accuracy and avoids misunderstandings.</p>
                  <p>Here are six key aspects of effective listening:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Paying Full Attention:</strong> This means minimizing distractions, both internal and external. Put away your phone, close unnecessary tabs on your computer, and focus solely on the speaker. Maintain eye contact (when appropriate) and use non-verbal cues like nodding to show you are engaged. When recording calls, ensure you are in a quiet environment to avoid background noise that can impede your ability to concentrate. This allows you to process the information accurately and remember important details.</li>
                    <li><strong>Avoiding Premature Judgments:</strong> Try to listen without forming opinions or jumping to conclusions before the speaker has finished. Resisting the urge to interrupt or formulate a response while someone is still talking is crucial. This helps prevent biases from influencing your understanding of the message. In the context of recording calls, this prevents you from missing important details because you are already trying to form a response.</li>
                    <li><strong>Asking Clarifying Questions:</strong> If something is unclear, do not hesitate to ask for clarification. This shows you are actively listening and helps ensure you have the correct information. Asking questions like, "Could you repeat that?" or "What do you mean by...?" demonstrates your commitment to understanding. When taking messages, clarifying questions are essential to ensure that the message being recorded is accurate and complete.</li>
                    <li><strong>Reflecting and Paraphrasing:</strong> Periodically summarize what the speaker has said in your own words. This confirms your understanding and gives the speaker a chance to correct any misinterpretations. For example, you might say, "So, if I understand correctly, you're saying..." This is very important when confirming contact details or important pieces of information during a call.</li>
                    <li><strong>Showing Empathy:</strong> Try to understand the speaker's feelings and perspective. Even if you do not agree, acknowledging their emotions can build rapport and facilitate better communication. This is especially important when dealing with frustrated or upset callers. Acknowledging their feelings can help de-escalate the situation.</li>
                    <li><strong>Non-Verbal Communication:</strong> Your body language plays a significant role in communication. Maintain an open and attentive posture, use appropriate facial expressions, and avoid fidgeting. These non-verbal cues reinforce your verbal message and show that you are genuinely interested in what the speaker has to say. Even over the phone, your tone of voice can convey attentiveness and empathy.</li>
                  </ul>
                </div>
              </div>

              {/* Successful Questioning Techniques */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <HelpCircle size={16} /> Successful Questioning Techniques (Extracting the Right Information)
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Asking the right questions is essential for gathering accurate and relevant information. This is particularly important when recording calls and messages, as you need to ensure you capture all the necessary details.</p>
                  <p>Here are six techniques for successful questioning:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Open-Ended Questions:</strong> These questions encourage detailed responses and allow the speaker to provide more information. They often begin with "what," "why," "how," or "describe." For example, instead of asking, "Did you call about the order?" ask, "What can you tell me about your order?" This allows the caller to provide more context and helps you gather more detailed information.</li>
                    <li><strong>Closed-Ended Questions:</strong> These questions elicit short, specific answers, often "yes" or "no." They are useful for confirming details or obtaining specific information. For example, "Is your order number 12345?" This technique is useful for quickly confirming important details such as contact numbers and names.</li>
                    <li><strong>Probing Questions:</strong> These questions delve deeper into a topic and help uncover underlying issues or concerns. They are often used to follow up on previous answers. For example, "You mentioned a delay. Can you tell me more about that?" When a caller mentions a problem, probing questions help you gather enough information to properly record the issue.</li>
                    <li><strong>Leading Questions (Use with Caution):</strong> These questions suggest a desired answer and can bias the response. While sometimes useful for confirming assumptions, they should be used cautiously to avoid manipulating the speaker. For example, "You're happy with our service, aren't you?" It is important to ask these kinds of questions in a way that does not pressure the caller.</li>
                    <li><strong>Clarifying Questions:</strong> These questions ensure you understand the speaker's meaning. For example, "Could you please repeat that?" or "What do you mean by...?" These are very important when recording contact details, and any other data that needs to be perfectly correct.</li>
                    <li><strong>Summarizing Questions:</strong> These questions confirm your understanding of the information provided. For example, "So, to summarize, you need..." This technique is useful for ensuring that you have accurately recorded the information from the call or message.</li>
                  </ul>
                </div>
              </div>

              {/* Data Management, Record Keeping, and Filing */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Database size={16} /> Data Management, Record Keeping, and Filing
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Effective data management, record keeping, and filing are crucial for maintaining organized and accessible information. This ensures that records are accurate, secure, and easily retrievable.</p>
                  <p>Here are six key aspects of data management, record keeping, and filing:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Accurate Data Entry:</strong> Ensure that all information is entered correctly and consistently. Double-check details like names, addresses, and phone numbers to avoid errors. When recording calls, accuracy is paramount. A single mistake can lead to miscommunication and wasted time.</li>
                    <li><strong>Consistent Formatting:</strong> Use a standardized format for all records to ensure consistency and readability. This includes using consistent date formats, abbreviations, and terminology. This makes it easier to find and understand information.</li>
                    <li><strong>Secure Storage:</strong> Store records in a secure location, whether physical or digital, to protect sensitive information. Implement access controls and backup procedures to prevent data loss. If you are recording voice calls, you must ensure that all recordings are kept in a secure location, and access to them is limited to authorized personnel.</li>
                    <li><strong>Regular Backups:</strong> Perform regular backups of digital records to prevent data loss due to system failures or other disasters. This ensures that important information can be restored if necessary. Regularly backing up recorded calls and messages is extremely important.</li>
                    <li><strong>Logical Filing System:</strong> Organize records in a logical and easy-to-navigate filing system. This might involve using alphabetical order, chronological order, or a category-based system. A well-organized filing system makes it easy to retrieve records quickly.</li>
                    <li><strong>Retention Policies:</strong> Follow established retention policies for storing and disposing of records. This ensures compliance with legal and regulatory requirements. Many organizations have specific retention policies for recordings of phone calls, and it is important to follow these.</li>
                  </ul>
                </div>
              </div>

              {/* Social Media Handling */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Share2 size={16} /> Social Media Handling
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Social media handling involves managing online interactions and content across various platforms. It is about maintaining a positive online presence, engaging with audiences, and responding effectively to feedback. In a professional context, it is crucial for building brand reputation and fostering relationships.</p>
                  <p>Here is a breakdown of key aspects:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Understanding Platform-Specific Nuances:</strong> Each social media platform has its own unique culture and user base. What works on Twitter might not resonate on Instagram or LinkedIn. Adapting content and communication style to each platform is essential. For example, LinkedIn is more professional, while TikTok is more for short form entertainment.</li>
                    <li><strong>Effective Communication:</strong> Clear, concise, and professional communication is vital. This includes responding to comments and messages promptly and accurately and maintaining a consistent brand voice. Even with negative comments, a professional response is required.</li>
                    <li><strong>Content Creation and Curation:</strong> Creating engaging and relevant content is key to attracting and retaining followers. This involves understanding your target audience and providing valuable information or entertainment. Also, knowing what content should be shared, and what should not be shared is very important.</li>
                    <li><strong>Crisis Management:</strong> Social media can be a breeding ground for negative publicity. Knowing how to handle criticism and address concerns effectively is crucial. This involves staying calm, acknowledging the issue, and providing a solution or explanation.</li>
                    <li><strong>Monitoring and Analysis:</strong> Tracking social media metrics helps you understand what is working and what is not. This involves monitoring engagement, reach, and sentiment to optimize your strategy. Knowing what posts are doing well, and what posts are doing poorly, allows for better content creation in the future.</li>
                    <li><strong>Building Relationships:</strong> Social media is about building relationships with your audience. This involves engaging in conversations, responding to feedback, and fostering a sense of community. Building good relationships, can increase customer loyalty.</li>
                  </ul>
                </div>
              </div>

              {/* Interpersonal Problem Solving */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <Users size={16} /> Interpersonal Problem Solving
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Interpersonal problem-solving involves resolving conflicts and disagreements between individuals. It requires a combination of communication, empathy, and negotiation skills. This is a very important skill in any workplace environment.</p>
                  <p>Here is a closer look:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Active Listening:</strong> Understanding the other person's perspective is crucial for resolving conflicts. This involves listening attentively, asking clarifying questions, and acknowledging their feelings. This allows for a better understanding of the problem.</li>
                    <li><strong>Effective Communication:</strong> Clearly and respectfully expressing your own perspective is equally important. This involves using "I" statements, avoiding blame, and focusing on the issue at hand.</li>
                    <li><strong>Empathy and Understanding:</strong> Trying to see the situation from the other person's point of view can help bridge communication gaps and find common ground. This will help with finding solutions that work for everyone involved.</li>
                    <li><strong>Collaboration and Negotiation:</strong> Working together to find mutually agreeable solutions is essential. This involves brainstorming options, considering different perspectives, and being willing to compromise.</li>
                    <li><strong>Conflict Resolution Techniques:</strong> Understanding different conflict resolution styles can help you navigate difficult situations. This might involve mediation, negotiation, or compromise. Learning these skills can help to de-escalate situations.</li>
                    <li><strong>Maintaining Professionalism:</strong> Even in heated situations, it is very important to maintain a professional attitude. This includes, controlling emotions, and focusing on solving the problem, and not attacking the person.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Reception Insight
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
                  <span>Reception Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Manager Duties</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Telephone Skills</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Reception management creates first impressions – be welcoming and professional. Master telephone skills: answer promptly, listen actively, and take accurate messages. For difficult customers, stay calm, show empathy, and focus on solutions. Communication skills – listening, questioning, data management, social media, and interpersonal problem-solving – are essential for success.
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
                <strong className="text-white">Reception Management</strong> – Five key concepts: First Impressions, Communication Hub, Information Management, Security and Safety, Customer Service Excellence. Reception sets the tone for the entire organisation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Manager Duties</strong> – Staff supervision, operational management, visitor security, customer service, and administrative tasks. Reception managers ensure smooth front-desk operations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Telephone &amp; Customer Skills</strong> – Professional demeanour, active listening, efficient call management, accurate message taking. For difficult customers: stay calm, show empathy, communicate clearly, resolve conflicts, and follow up.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Communication Skills</strong> – Effective listening, questioning techniques, data management, social media handling, and interpersonal problem-solving. These skills are essential for professional success.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 1 (Reception &amp; Communication)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;