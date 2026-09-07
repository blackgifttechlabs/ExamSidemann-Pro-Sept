import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  Paperclip,
  Layout,
  Edit,
  Target,
  Shield,
  ListChecks,
  Type,
  BookOpen,
  FileText,
  Scissors,
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
  HardDrive,
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
  Clock,
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
  Inbox,
  SendToBack,
  Package,
  Stamp,
  Truck,
  Bookmark,
  FileCheck,
  FileSearch,
  FileWarning,
  FileX,
  UserCheck,
  UserPlus,
  UserMinus,
  UserX,
  Handshake,
  Heart,
  Star,
  Gem,
  Crown,
  Building,
  DoorOpen,
  Sofa,
  Paintbrush,
  Sparkles as SparklesIcon,
  Sparkle,
  Utensils,
  CupSoda,
  Cookie,
  Apple,
  Wine,
  PhoneForwarded,
  PhoneOff,
  Voicemail,
  Headset,
  BadgeCheck,
  Trophy,
  Medal,
  Search as SearchIcon,
  Clock as ClockIcon,
  HardDrive as HardDriveIcon,
  Globe as GlobeIcon,
  Settings as SettingsIcon,
  Layers as LayersIcon,
  Circle as CircleIcon,
  Scissors as ScissorsIcon,
  Award as AwardIcon,
  Globe as Twitter,
  Camera as Instagram,
  Briefcase as Linkedin,
  Share2 as Facebook,
  Video as Youtube,
  Scissors as Comb,
  User as Shirt,
  MapPin as Shoe,
  BookOpen as BookOpenIcon,
  Search,
  X as XIcon,
  RefreshCw as RefreshIcon,
  ChevronUp,
  AlertCircle as AlertCircleIcon,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'image', label: 'Professional Image' },
  { id: 'attitude', label: 'Positive Attitude' },
  { id: 'etiquette', label: 'Business Etiquette' },
  { id: 'grooming', label: 'Grooming Guidelines' },
  { id: 'literature', label: 'Corporate Literature' },
  { id: 'refreshments', label: 'Refreshments' },
  { id: 'cold-callers', label: 'Cold Callers' },
  { id: 'switchboard', label: 'Switchboard Redirection' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'A positive attitude in the reception area can increase visitor satisfaction by up to 70% and leave a lasting impression on clients.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain eye contact and smile when greeting visitors – it conveys confidence and warmth, setting a professional tone.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 aspects of business etiquette with "C-P-P-R-D-M-N-D-A-A": Communication, Punctuality, Professional Appearance, Respectful Behaviour, Dining, Meetings, Networking, Digital, Confidentiality, Adaptability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many receptionists forget to keep corporate literature updated and readily accessible, missing opportunities to inform and impress visitors.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A positive attitude in the reception area can increase visitor satisfaction by up to 70% and leave a lasting impression on clients.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain eye contact and smile when greeting visitors – it conveys confidence and warmth, setting a professional tone.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 10 aspects of business etiquette with "C-P-P-R-D-M-N-D-A-A": Communication, Punctuality, Professional Appearance, Respectful Behaviour, Dining, Meetings, Networking, Digital, Confidentiality, Adaptability.',
      },
      {
        title: 'Common Mistake',
        text: 'Many receptionists forget to keep corporate literature updated and readily accessible, missing opportunities to inform and impress visitors.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Professional Image, Etiquette &{' '}
            <span className="text-purple-300 font-bold italic">
              Customer Relations
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to professional image, business etiquette, grooming, corporate literature, refreshments, cold callers, and switchboard management.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BadgeCheck size={14} className="inline mr-1" /> Image
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Etiquette
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Phone size={14} className="inline mr-1" /> Switchboard
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
                placeholder="Search for a concept, etiquette tip, grooming guideline..."
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
            {/* SECTION 1: Projecting a Professional Image */}
            <div
              ref={(el) => {
                sectionRefs.current['image'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Projecting a Professional Image
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The reception area is often the first point of contact for visitors, clients, and potential partners. As such, it plays a crucial role in shaping their initial impression of your organization. A clean and presentable reception area is not merely about aesthetics; it is a powerful statement about your company's values, attention to detail, and commitment to professionalism. Imagine walking into a cluttered, disorganized reception area. It immediately creates a sense of unease and raises questions about the organization's efficiency and reliability.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Conversely, a well-maintained reception area, with its clean surfaces, organized furniture, and welcoming atmosphere, conveys a sense of professionalism, competence, and attention to detail. This positive first impression can significantly influence how visitors perceive your organization and can set the stage for successful interactions.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Projecting a professional image extends beyond the physical appearance of the reception area. It also encompasses the behaviour and demeanour of the staff. Receptionists and other front-line employees should be well-groomed, dressed appropriately, and exhibit professional conduct at all times. They should be courteous, attentive, and knowledgeable, able to answer questions and provide assistance promptly. The reception area should be equipped with up-to-date information, such as brochures, company directories, and contact lists, to ensure that visitors have access to the resources they need.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Regular maintenance and upkeep are essential for preserving a professional image. This includes cleaning surfaces, organizing materials, and ensuring that all equipment is in good working order. By consistently maintaining a clean, organized, and professional reception area, you send a clear message that your organization values excellence and takes pride in its image.
                  </p>
</div>
            </div>

            {/* SECTION 2: Maintaining a Positive Attitude */}
            <div
              ref={(el) => {
                sectionRefs.current['attitude'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining a Positive Attitude
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Maintaining a positive attitude in the reception area is vital for creating a welcoming and engaging environment. The reception area is often the first point of contact, and the energy and demeanour of the staff can significantly impact the visitor's experience. A positive attitude is contagious and can create a sense of warmth and approachability. When visitors are greeted with a smile and a friendly demeanour, they are more likely to feel comfortable and at ease. Conversely, a negative or indifferent attitude can create a sense of unease and make visitors feel unwelcome.</p>
                  <p>A positive attitude also plays a crucial role in managing stressful situations. The reception area can be a high-pressure environment, with constant interruptions, demanding visitors, and unexpected challenges. Maintaining composure and a positive outlook can help to de-escalate tensions and resolve issues effectively. Employees should be trained to handle difficult situations with grace and professionalism, focusing on finding solutions and maintaining a calm and positive demeanour. A positive attitude can also enhance teamwork and collaboration. When employees are positive and supportive, they are more likely to work together effectively and create a harmonious work environment.</p>
                  <p>Furthermore, maintaining a positive attitude is essential for fostering strong customer relationships. Visitors and clients are more likely to trust and engage with organizations that project a positive and welcoming image. A positive attitude can help to build rapport, establish trust, and create a lasting impression. Employees should be encouraged to cultivate a positive mindset, focusing on the positive aspects of their work, and celebrating successes. This can involve practicing gratitude, focusing on solutions, and maintaining a sense of humour. By consistently maintaining a positive attitude, you can create a reception area that is not only clean and presentable but also welcoming and engaging, leaving a lasting positive impression on visitors.</p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Business Etiquette */}
            <div
              ref={(el) => {
                sectionRefs.current['etiquette'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Business Etiquette
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Business etiquette refers to the set of professional behaviours, manners, and customs that are expected in a business environment. It is about demonstrating respect, professionalism, and consideration for others, which helps to build positive relationships, maintain a professional image, and foster a productive work environment. Here is a comprehensive breakdown of key aspects:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Professional Communication',
                    icon: <MessageSquare size={16} />,
                    content: 'Effective communication is the cornerstone of business etiquette. This encompasses both verbal and written communication. In verbal communication, it is essential to speak clearly, respectfully, and professionally. Avoid using slang, jargon, or offensive language. Maintain a polite and courteous tone and listen attentively to others. In written communication, ensure that emails, memos, and reports are well-written, grammatically correct, and free of errors. Use a professional tone and format and avoid overly casual language. Promptly respond to emails and phone calls, and always proofread your work before sending.',
                  },
                  {
                    title: '2. Punctuality and Time Management',
                    icon: <Clock size={16} />,
                    content: 'Being punctual for meetings, appointments, and deadlines is a fundamental aspect of business etiquette. It demonstrates respect for other people\'s time and shows that you are organized and reliable. If you anticipate being late, inform the other party as soon as possible and apologize for any inconvenience. Effective time management is also crucial. Prioritize tasks, meet deadlines, and avoid wasting time. This includes arriving to meetings on time and starting them on time.',
                  },
                  {
                    title: '3. Professional Appearance and Grooming',
                    icon: <User size={16} />,
                    content: 'Your appearance plays a significant role in forming a professional impression. Dress appropriately for the workplace and the occasion. This typically means wearing professional attire that is clean, well-maintained, and appropriate for the industry and company culture. Pay attention to personal grooming, such as clean hair, nails, and teeth. Avoid wearing overly casual or revealing clothing. Your appearance should reflect professionalism and respect for the workplace.',
                  },
                  {
                    title: '4. Respectful Behaviour and Courtesy',
                    icon: <Handshake size={16} />,
                    content: 'Treating others with respect and courtesy is essential in any business setting. This includes being polite, considerate, and empathetic. Avoid interrupting others, speaking over them, or engaging in disrespectful behaviour. Use polite phrases such as "please," "thank you," and "excuse me." Be mindful of cultural differences and avoid making assumptions or stereotypes. Show appreciation for others\' contributions and acknowledge their efforts.',
                  },
                  {
                    title: '5. Dining Etiquette',
                    icon: <Utensils size={16} />,
                    content: 'Business meals are often an integral part of networking and building relationships. Knowing proper dining etiquette is essential. This includes arriving on time, waiting to be seated, and following the host\'s lead. Avoid talking with your mouth full, chewing loudly, or making a mess. Be mindful of your posture and table manners. Offer to pay or split the bill appropriately.',
                  },
                  {
                    title: '6. Meeting Etiquette',
                    icon: <Users size={16} />,
                    content: 'Meetings are a common occurrence in the business world. Adhering to proper meeting etiquette is crucial for ensuring productivity and efficiency. This includes arriving on time, being prepared, and actively participating. Avoid interrupting others, using your phone, or engaging inside conversations. Stay focused on the agenda and contribute constructively to the discussion.',
                  },
                  {
                    title: '7. Networking Etiquette',
                    icon: <Share2 size={16} />,
                    content: 'Networking is a valuable tool for building professional relationships and expanding your career opportunities. When networking, be approachable, friendly, and respectful. Introduce yourself clearly and concisely and engage in meaningful conversations. Listen attentively to others and ask thoughtful questions. Exchange business cards appropriately and follow up with contacts after the event.',
                  },
                  {
                    title: '8. Digital Etiquette (Netiquette)',
                    icon: <GlobeIcon size={16} />,
                    content: 'In the digital age, it is essential to adhere to proper digital etiquette. This includes using professional email signatures, avoiding excessive use of emojis or abbreviations, and being mindful of your online presence. Be cautious about sharing personal information on social media and avoid posting anything that could be considered unprofessional or offensive.',
                  },
                  {
                    title: '9. Confidentiality and Discretion',
                    icon: <Lock size={16} />,
                    content: 'Maintaining confidentiality and discretion is crucial in any business setting. Avoid sharing sensitive information or gossip with others. Respect the privacy of colleagues and clients and avoid discussing confidential matters in public places.',
                  },
                  {
                    title: '10. Adaptability and Cultural Sensitivity',
                    icon: <Target size={16} />,
                    content: 'Business etiquette can vary across cultures and industries. Be adaptable and sensitive to cultural differences and be willing to adjust your behaviour accordingly. Learn about the customs and traditions of different cultures and avoid making assumptions or stereotypes.',
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

            {/* SECTION 4: Grooming Guidelines */}
            <div
              ref={(el) => {
                sectionRefs.current['grooming'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Grooming Guidelines
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Personal Hygiene: The Foundation of Professionalism',
                    icon: <AwardIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Cleanliness:</strong> This is not just about smelling good; it is about conveying respect for yourself and others. In a professional setting, body odour can be a significant distraction, undermining your credibility. Daily showering or bathing ensures you present a fresh and clean appearance. This also goes beyond just a morning routine. In some situations, like after a workout or intense physical activity during a workday, it is important to take steps to refresh yourself.</li>
                        <li><strong>Oral Hygiene:</strong> Bad breath is a major turn-off in any interaction. Regular brushing and flossing not only prevent this but also contribute to a healthy, confident smile. This is especially important in close-proximity interactions like meetings or one-on-one conversations. Regular dentist visits are preventative maintenance, ensuring long-term oral health. Having breath mints on hand is a small detail that can make a big difference, showing you are considerate of others.</li>
                        <li><strong>Body Odour:</strong> Using deodorant or antiperspirant is a non-negotiable in most workplaces. It is about being mindful of how your personal scent might affect others. Strong perfumes or colognes, while personally pleasing, can be overwhelming or trigger allergies in colleagues. A subtle, clean scent is always preferable to a heavy, overpowering one.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Hair Care: Presenting a Polished Image',
                    icon: <Comb size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Clean and Neat:</strong> Clean hair signals that you care about your appearance and pay attention to detail. Dandruff or oily hair can create a negative impression, suggesting a lack of professionalism. Regular haircuts are essential for maintaining a tidy appearance, preventing hair from looking unkempt.</li>
                        <li><strong>Styling:</strong> Hair should be styled in a way that is appropriate for the workplace. This means avoiding overly trendy or distracting styles that might draw unwanted attention. Simplicity and neatness are key. Keeping hair out of your face is not only practical but also conveys attentiveness and professionalism.</li>
                        <li><strong>Facial Hair:</strong> Whether or not facial hair is acceptable depends on the company culture. If it is, meticulous grooming is essential. A neatly trimmed beard or moustache demonstrates attention to detail and professionalism. Stray hairs or an unkempt appearance can be just as distracting as untidy head hair.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Nail Care: Attention to the Small Details',
                    icon: <ScissorsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Clean and Trimmed:</strong> Clean, trimmed nails are a subtle but important aspect of professional grooming. Long nails can be unhygienic and impractical, particularly in jobs involving manual tasks or computer work.</li>
                        <li><strong>Manicures/Pedicures:</strong> If manicures or pedicures are part of your routine, choose neutral colours and simple styles. Flashy or overly elaborate nail art can be distracting and unprofessional. This shows that you are taking care of yourself, in a professional manner.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Skin Care: Maintaining a Healthy Appearance',
                    icon: <Sun size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Clean and Moisturized:</strong> Healthy skin contributes to a polished and professional look. Clean, moisturized skin shows that you take care of yourself. Sunscreen is essential for protecting your skin from damage, especially in outdoor or sunny environments.</li>
                        <li><strong>Makeup (if applicable):</strong> Makeup should enhance your natural features, not create a dramatic transformation. Natural, subtle makeup is generally preferred in professional settings. Avoid excessive use of glitter, bold colours, or heavy foundation.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Clothing and Attire: Projecting Professionalism Through Dress',
                    icon: <Shirt size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Clean and Pressed:</strong> Wrinkled or stained clothing creates a sloppy and unprofessional impression. Clean, pressed clothing shows that you are organized and pay attention to detail.</li>
                        <li><strong>Appropriate Attire:</strong> Adhering to the company's dress code is crucial. It shows that you respect the organization's culture and are willing to conform to its standards. Understanding the difference between business attire and business casual is essential.</li>
                        <li><strong>Shoes:</strong> Shoes are often overlooked, but they can significantly impact your overall appearance. Clean, polished shoes demonstrate attention to detail and professionalism. Worn-out or scuffed shoes can detract from an otherwise polished appearance.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '6. Accessories: Enhancing, Not Distracting',
                    icon: <Sparkle size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Minimal and Professional:</strong> Accessories should complement your attire, not overpower it. Simple, understated jewellery and accessories are generally preferred. Avoid anything that is too flashy, noisy, or distracting.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Professional Demeanour: The Complete Package',
                    icon: <User size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Posture and Body Language:</strong> Good posture and confident body language convey professionalism and competence. Avoid slouching, fidgeting, or other nervous habits. These can undermine your credibility and make you appear unprofessional.</li>
                        <li><strong>Overall Presentation:</strong> Professional grooming is about more than just individual elements; it is about the overall impression you create. Your appearance, behaviour, and communication should all align to project a consistent image of professionalism.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Key Considerations',
                    icon: <ListChecks size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Company Culture:</strong> Always prioritize the grooming standards and dress code of your specific company.</li>
                        <li><strong>Industry Standards:</strong> Be aware of the grooming expectations within your industry. Some industries have stricter standards than others.</li>
                        <li><strong>Cultural Differences:</strong> Be mindful of cultural differences in grooming practices. What is considered appropriate in one culture may not be in another.</li>
                        <li><strong>Personal Comfort:</strong> While adhering to professional standards, it is also important to feel comfortable and confident in your own skin.</li>
                      </ul>
                    ),
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

            {/* SECTION 5: Making Corporate Literature Readily Available */}
            <div
              ref={(el) => {
                sectionRefs.current['literature'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Making Corporate Literature Readily Available
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Making corporate literature readily available is a crucial aspect of effective communication and brand management. It ensures that stakeholders, including employees, clients, investors, and the general public, have easy access to essential information about your organization. Here is a breakdown of the key considerations:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying Target Audiences and Information Needs',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Understanding Stakeholders:</strong> Before making corporate literature available, it is essential to identify your target audiences. This includes employees, clients, potential clients, investors, partners, and the media. Each group has different information needs.</li>
                        <li><strong>Tailoring Content:</strong> Once you have identified your target audiences, tailor the content of your corporate literature to meet their specific needs. For example, investors might require financial reports, while clients might need product brochures or service guides. Knowing what information is needed, will allow you to prioritize what literature is made available.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Centralized and Accessible Storage',
                    icon: <Folder size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Physical Locations:</strong> For physical literature, designate accessible locations where it can be stored and distributed. This might include reception areas, meeting rooms, employee break rooms, or client waiting areas. Ensure that the locations are clean, organized, and well-stocked.</li>
                        <li><strong>Digital Repositories:</strong> Create a centralized digital repository for electronic versions of your corporate literature. This could be a company website, intranet, cloud-based storage, or a dedicated document management system. Ensure that the digital repository is easy to navigate, searchable, and accessible from various devices.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Digital Accessibility and Usability',
                    icon: <GlobeIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Website and Intranet:</strong> Make corporate literature readily available on your company website and intranet. Ensure that documents are easy to find, download, and view. Use clear and concise file names and descriptions.</li>
                        <li><strong>Mobile Optimization:</strong> Optimize digital literature for mobile devices. Ensure that documents are responsive and can be viewed easily on smartphones and tablets.</li>
                        <li><strong>Search Functionality:</strong> Implement a robust search functionality on your website and intranet to allow users to quickly find the information they need.</li>
                        <li><strong>Accessibility Standards:</strong> Adhere to accessibility standards, such as WCAG, to ensure that digital literature is accessible to people with disabilities.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Physical Distribution and Presentation',
                    icon: <Layout size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Professional Presentation:</strong> Ensure that physical literature is presented in a professional and visually appealing manner. Use high-quality paper, printing, and binding. Organize literature in a logical and easy-to-navigate way.</li>
                        <li><strong>Strategic Placement:</strong> Strategically place physical literature in locations where it is most likely to be accessed by target audiences. Consider using display stands or racks to enhance visibility.</li>
                        <li><strong>Inventory Management:</strong> Implement an inventory management system to ensure that physical literature is always in stock. Regularly check and replenish supplies as needed.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Promotion and Awareness',
                    icon: <Bell size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Internal Communication:</strong> Communicate the availability of corporate literature to employees through internal communication channels, such as email, newsletters, and intranet announcements. Provide training on how to access and utilize the literature.</li>
                        <li><strong>External Communication:</strong> Promote the availability of corporate literature to external stakeholders through your website, social media, and marketing materials. Include links to digital literature in email signatures and online profiles.</li>
                        <li><strong>Regular Updates:</strong> Regularly update corporate literature to ensure that it is accurate and relevant. Communicate any updates to stakeholders.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '6. Feedback and Evaluation',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Gather Feedback:</strong> Gather feedback from stakeholders on the accessibility and usability of corporate literature. Use surveys, feedback forms, or direct communication to collect feedback.</li>
                        <li><strong>Evaluate Effectiveness:</strong> Evaluate the effectiveness of your corporate literature in meeting the information needs of your target audiences. Track website analytics and usage data to assess the impact of digital literature.</li>
                        <li><strong>Make Improvements:</strong> Use feedback and evaluation data to make improvements to your corporate literature and distribution strategies.</li>
                      </ul>
                    ),
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

            {/* SECTION 6: Making Appropriate Refreshments Readily Available */}
            <div
              ref={(el) => {
                sectionRefs.current['refreshments'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Making Appropriate Refreshments Readily Available
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Making appropriate refreshments readily available is a key aspect of hospitality and creating a positive atmosphere, whether it is for internal meetings, client visits, or public events. It is about showing consideration for people's comfort and needs. Here is a breakdown of how to do it effectively:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Understanding the Context and Audience',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Occasion and Time:</strong> The type and quantity of refreshments should match the occasion and time of day. Morning meetings might call for coffee and pastries, while afternoon gatherings could benefit from light snacks and beverages. Formal events may require more elaborate options. Knowing how long the event will last, is also very important.</li>
                        <li><strong>Audience Preferences and Needs:</strong> Consider the preferences and dietary needs of your audience. Offer a variety of options to accommodate different tastes and restrictions (e.g., vegetarian, vegan, gluten-free). If possible, gather information about any allergies or specific dietary requirements beforehand.</li>
                        <li><strong>Budget and Resources:</strong> Establish a budget for refreshments and plan accordingly. Balance cost-effectiveness with quality and variety. Knowing what resources are available, such as a kitchen, or refrigeration, is important for planning.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Planning and Preparation',
                    icon: <ListChecks size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Menu Selection:</strong> Choose refreshments that are appropriate for the occasion, time of day, and audience. Consider factors such as freshness, presentation, and ease of consumption.</li>
                        <li><strong>Quantity and Timing:</strong> Estimate the appropriate quantity of refreshments based on the number of attendees and the duration of the event. Plan the timing of refreshment service to avoid interruptions or delays.</li>
                        <li><strong>Presentation and Setup:</strong> Present refreshments in a clean, organized, and visually appealing manner. Use appropriate serving dishes, utensils, and napkins. If possible, use decorations that match the event.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Beverage Options',
                    icon: <Coffee size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Variety:</strong> Offer a variety of beverages to cater to different preferences. This might include coffee, tea, water, juice, and soft drinks.</li>
                        <li><strong>Temperature Control:</strong> Ensure that beverages are served at the appropriate temperature (e.g., hot coffee, cold water). Use insulated containers or coolers to maintain temperature.</li>
                        <li><strong>Hydration:</strong> Always provide ample water to ensure that attendees stay hydrated.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Food Options',
                    icon: <Cookie size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Light Snacks:</strong> Offer light snacks that are easy to eat and not overly filling. This might include pastries, fruit, vegetables, or small sandwiches.</li>
                        <li><strong>Dietary Considerations:</strong> Provide options for attendees with dietary restrictions, such as vegetarian, vegan, or gluten-free choices. Clearly label food items to indicate ingredients and allergens.</li>
                        <li><strong>Portion Control:</strong> Serve food in appropriate portions to avoid waste and ensure that everyone has enough.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Service and Maintenance',
                    icon: <Package size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Accessibility:</strong> Place refreshments in a location that is easily accessible to all attendees. Ensure that serving areas are well-lit and clearly marked.</li>
                        <li><strong>Replenishment:</strong> Monitor refreshment levels and replenish supplies as needed. Keep serving areas clean and tidy throughout the event.</li>
                        <li><strong>Waste Management:</strong> Provide adequate waste receptacles and encourage attendees to dispose of trash properly. Clean up any spills quickly.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '6. Feedback and Improvement',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Gather Feedback:</strong> Solicit feedback from attendees on the quality and variety of refreshments. Use surveys or informal conversations to gather feedback.</li>
                        <li><strong>Adjust:</strong> Use feedback to adjust future refreshment offerings. Continuously improve the refreshment service based on attendee preferences and needs.</li>
                      </ul>
                    ),
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

            {/* SECTION 7: Dealing with Cold Callers */}
            <div
              ref={(el) => {
                sectionRefs.current['cold-callers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Dealing with Cold Callers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Tone, Pitch, and Pace',
                    icon: <Phone size={16} />,
                    content: 'When handling cold callers, your tone, pitch, and pace are your primary tools for controlling the interaction and maintaining professionalism. The tone of your voice sets the emotional landscape of the conversation. A consistently polite and professional tone, even when declining an offer, conveys respect and maintains a positive image of your organization. Avoid sounding dismissive, irritated, or overly abrupt, as this can damage your company\'s reputation and create unnecessary negativity. The pitch of your voice, or its highness or lowness, can also influence how your message is received. A calm, even pitch projects confidence and authority, while a high-pitched or wavering voice may suggest nervousness or uncertainty. Practice speaking in a controlled, steady pitch to maintain composure and command the conversation. The pace of your speech, or its speed, is equally important. Speaking too quickly can make you sound rushed or impatient, while speaking too slowly can come across as condescending or disinterested. Aim for a moderate pace that allows the cold caller to understand your message clearly but does not encourage them to prolong the call. If you need to deliver a clear and firm "no," a slightly slower pace can add emphasis and finality to your response. By consciously managing your tone, pitch, and pace, you can effectively navigate cold calls, assert your boundaries, and maintain a professional demeanour, even in the face of persistent or unwanted solicitations. Remember, even a brief interaction can leave a lasting impression, so strive for clarity and professionalism in every word.',
                  },
                  {
                    title: 'Building Rapport Techniques',
                    icon: <Handshake size={16} />,
                    content: 'Building rapport is about establishing a connection with another person, creating a sense of trust, and understanding. While it might seem counterintuitive to build rapport with a cold caller, some techniques can be used to manage the call professionally and efficiently. One effective technique is to begin with a polite acknowledgment and a brief, neutral statement. For example, "Good morning, thank you for calling." This establishes a courteous tone without encouraging unnecessary conversation. Following this, immediately and clearly state your purpose, such as, "I\'m sorry, we are not interested in your services at this time." This directness avoids ambiguity and prevents the cold caller from prolonging the call. Active listening, even in a brief interaction, can also demonstrate respect. If the cold caller provides a quick overview, acknowledge their points with brief phrases like "I understand" or "I hear you," before reiterating your disinterest. This shows that you have listened without implying any openness to their offer. Another rapport-building technique involves finding a point of common ground, even if it is just a shared acknowledgment of the time or day. For example, "I appreciate you calling, but we\'re quite busy at the moment." This acknowledges the caller\'s effort without extending the call. Finally, always end the call politely, even if you have had to be firm. A simple "Thank you for your time" or "Have a good day" can leave a positive impression and maintain your organization\'s professional image. By using these rapport-building techniques, you can manage cold calls efficiently, assert your boundaries, and maintain a respectful and professional demeanour, even in unwanted interactions.',
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

            {/* SECTION 8: Re-Directing a Reception Area Switchboard to the Appropriate Section During Non-Working Hours */}
            <div
              ref={(el) => {
                sectionRefs.current['switchboard'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Re-Directing a Reception Area Switchboard to the Appropriate Section During Non-Working Hours
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Re-directing a reception area switchboard to the appropriate section during non-working hours is a crucial aspect of ensuring seamless communication and maintaining a professional image, even when the office is closed. It involves setting up systems that automatically route incoming calls to relevant departments or individuals, ensuring that important inquiries are addressed promptly. Here is a detailed explanation of the process:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Identifying Key Contact Points and Departments',
                    icon: <Target size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Determine Essential Contacts:</strong> Begin by identifying the key contact points and departments that need to be accessible during non-working hours. This might include IT support for urgent system issues, security for after-hours emergencies, or on-call personnel for critical services. Create a list of these departments or individuals, along with their contact information and specific roles.</li>
                        <li><strong>Categorize Call Types:</strong> Categorize the types of calls that might come in during non-working hours. This could include emergency calls, technical support requests, sales inquiries, or general information requests. Understanding the different types of calls helps in determining the appropriate routing for each.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Setting Up Automated Routing Systems',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Automated Attendant (IVR):</strong> Implement an Interactive Voice Response (IVR) system that automatically answers incoming calls and provides callers with a menu of options. This allows callers to select the appropriate department or individual based on their needs. Ensure that the IVR menu is clear, concise, and easy to navigate.</li>
                        <li><strong>Time-Based Routing:</strong> Configure the switchboard to automatically route calls based on the time of day. This allows you to set specific routing rules for non-working hours. For example, calls received after 5:00 PM could be routed to an on-call IT support line, while calls received on weekends could be routed to a security hotline.</li>
                        <li><strong>Call Forwarding:</strong> Set up call forwarding to automatically forward calls to designated phone numbers or voicemail boxes during non-working hours. This ensures that calls are not missed and that messages can be retrieved promptly.</li>
                        <li><strong>Voicemail System:</strong> Ensure that the voicemail system is active and functioning properly during non-working hours. Provide clear instructions for leaving messages and specify when callers can expect a response.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Providing Clear Instructions and Information',
                    icon: <MessageSquare size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Informative Greetings:</strong> Record clear and informative greetings for the IVR system and voicemail. These greetings should provide callers with essential information, such as the office hours, alternative contact information, and instructions for leaving messages. For example, the message might state "Thank you for calling (Company name). Our office is currently closed. If you have a technical emergency, please press one. For all other inquiries, please leave a message after the tone, and we will return your call during normal business hours."</li>
                        <li><strong>Website and Online Information:</strong> Provide clear and up-to-date contact information on your company website and online platforms. This includes emergency contact numbers, email addresses, and alternative communication channels. Ensure that the website is accessible and easy to navigate.</li>
                        <li><strong>Internal Communication:</strong> Communicate the non-working hours call routing procedures to all employees. This ensures that everyone is aware of the system and can provide accurate information to callers. Provide employees with a list of emergency contact numbers and procedures.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Testing and Monitoring',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Regular Testing:</strong> Regularly test the automated routing systems to ensure that they are functioning correctly. This includes testing the IVR menu, call forwarding, and voicemail system. Perform test calls from different phone numbers to verify the routing.</li>
                        <li><strong>Monitoring Call Logs:</strong> Monitor call logs to identify any issues or patterns in call routing. This helps in identifying areas for improvement and ensuring that calls are being handled effectively. Review voicemail messages regularly to ensure that they are being retrieved and addressed promptly.</li>
                        <li><strong>Feedback and Adjustments:</strong> Gather feedback from employees and callers on the effectiveness of the non-working hours call routing system. Use feedback to make adjustments and improvements to the system.</li>
                      </ul>
                    ),
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Etiquette Insight
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
                  <span>Etiquette Aspects</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Grooming Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Cold Caller Techniques</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Professional image projects competence and builds trust. Positive attitude creates a welcoming atmosphere. Business etiquette – communication, punctuality, appearance, respect, dining, meetings, networking, digital, confidentiality, adaptability – is essential. Grooming guidelines cover hygiene, hair, nails, skin, clothing, and accessories. Keep corporate literature and refreshments accessible. Handle cold callers with professional tone, pitch, pace, and rapport. Redirect switchboard effectively during non-working hours with IVR, time-based routing, and clear instructions.
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
                <strong className="text-white">Professional Image</strong> – Clean, organised reception area and professional staff create a powerful first impression. Maintain a positive attitude to welcome visitors and manage stress effectively.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Business Etiquette</strong> – Ten key aspects: Communication, Punctuality, Professional Appearance, Respectful Behaviour, Dining, Meetings, Networking, Digital Etiquette, Confidentiality, and Adaptability. These build trust and professionalism.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Grooming &amp; Presentation</strong> – Personal hygiene, clean hair, neat nails, healthy skin, appropriate clothing, and minimal accessories project professionalism. Align with company culture and industry standards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Corporate Literature &amp; Refreshments</strong> – Make literature accessible in physical and digital formats, targeting audiences. Offer appropriate refreshments considering context, preferences, and dietary needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cold Callers &amp; Switchboard</strong> – Handle cold callers with professional tone, pitch, pace, and rapport. Redirect switchboard during non-working hours using IVR, time-based routing, and clear instructions for seamless communication.
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
            Sidemann Academic Registry • Records &amp; Information Management – Learning Outcome 3 (Professional Image &amp; Etiquette)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;