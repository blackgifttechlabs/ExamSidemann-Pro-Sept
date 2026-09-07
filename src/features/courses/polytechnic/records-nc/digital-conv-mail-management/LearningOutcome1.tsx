import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  CpuIcon,
  Shield,
  Keyboard,
  Monitor,
  HardDriveIcon,
  SettingsIcon,
  AppWindow,
  ShieldAlert,
  ShieldCheck,
  Cloud,
  Fingerprint,
  BarChart,
  Smartphone,
  Scan,Sofa as Chair,
  Database,
  Plug,
  Flame,
  Hand,
  Code,
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  BookOpen,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Sun,
  Thermometer,
  Volume2,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'hardware', label: 'Hardware Categories' },
  { id: 'buying', label: 'Buying Hardware' },
  { id: 'software', label: 'Systems & Application' },
  { id: 'select-software', label: 'Selecting Software' },
  { id: 'records-software', label: 'Records Software' },
  { id: 'data-processing', label: 'Data Processing' },
  { id: 'print', label: 'Print Management' },
  { id: 'file-org', label: 'File Organization' },
  { id: 'practicals', label: 'Practicals' },
  { id: 'threats', label: 'Threats & Prevention' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'legal', label: 'Legal Issues' },
  { id: 'licensing', label: 'Software Licensing' },
  { id: 'data-protection', label: 'Data Protection' },
  { id: 'emerging', label: 'Emerging Tech' },
  { id: 'ergonomics', label: 'Ergonomics' },
  { id: 'health', label: 'Health Effects' },
  { id: 'environment', label: 'Computer Room' },
  { id: 'safety', label: 'Safety Precautions' },
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
        text: 'The first computer mouse was made of wood and invented by Douglas Engelbart in 1964.',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your data regularly using the 3-2-1 rule: 3 copies, 2 different media, 1 off-site.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four main hardware categories with "I-O-P-S": Input, Output, Processing, Storage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse system software (like Windows) with application software (like Word). System software runs the computer; application software helps you do tasks.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer mouse was made of wood and invented by Douglas Engelbart in 1964.',
      },
      {
        title: 'Pro Tip',
        text: 'Always back up your data regularly using the 3-2-1 rule: 3 copies, 2 different media, 1 off-site.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four main hardware categories with "I-O-P-S": Input, Output, Processing, Storage.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse system software (like Windows) with application software (like Word). System software runs the computer; application software helps you do tasks.',
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
            <CpuIcon size={14} className="inline mr-1" /> ICT & RECORDS MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Computer Hardware &{' '}
            <span className="text-emerald-300 font-bold italic">
              Software Fundamentals
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to computer hardware categories, software types, records management software, data processing, file management, security, ergonomics, and emerging technologies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CpuIcon size={14} className="inline mr-1" /> Hardware
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <AppWindow size={14} className="inline mr-1" /> Software
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
                placeholder="Search for a concept, hardware, software..."
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
            {/* SECTION 1: Categories of Computer Hardware Devices */}
            <div
              ref={(el) => {
                sectionRefs.current['hardware'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Categories of Computer Hardware Devices
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Hardware is all the stuff you can touch – the physical parts of a computer system. It can be grouped into four main categories:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Input Devices: Getting Information In',
                    icon: <Keyboard size={16} />,
                    content: (
                      <>
                        <p>Think of input devices as the way you talk to the computer. They let you feed information and instructions into the computer, so it knows what to do.</p>
                        <p><strong>Examples:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Keyboard:</strong> For typing letters, numbers, and symbols. Just like a typewriter but connected to the computer.</li>
                          <li><strong>Mouse:</strong> Lets you point and click on things on the screen. It helps you navigate and select things.</li>
                          <li><strong>Microphone:</strong> Records your voice or other sounds. You can use it for talking to people online, recording music, or giving voice commands.</li>
                          <li><strong>Scanner:</strong> Copies a document or picture into the computer. It is like taking a photo, but instead of printing it, it saves it on the computer.</li>
                          <li><strong>Webcam:</strong> Records video of you. Used for video calls, taking photos, or recording videos.</li>
                          <li><strong>Touchscreen:</strong> You use your fingers to interact directly with the screen. It combines the functions of a mouse and a monitor.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '2. Output Devices: Getting Information Out',
                    icon: <Monitor size={16} />,
                    content: (
                      <>
                        <p>Output devices show you the results of what the computer is doing. They are how the computer communicates back to you.</p>
                        <p><strong>Examples:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Monitor:</strong> The screen where you see the computer's information. It displays everything that is happening.</li>
                          <li><strong>Printer:</strong> Puts information from the computer onto paper. You can print documents, pictures, or anything else you see on the screen.</li>
                          <li><strong>Speakers:</strong> Let you hear sounds from the computer. They play music, audio from videos, or system sounds.</li>
                          <li><strong>Projector:</strong> Displays the computer's screen onto a large surface like a wall. Great for presentations.</li>
                          <li><strong>Headphones:</strong> Let you listen to sounds privately.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '3. Processing Devices: The Brain of the Computer',
                    icon: <CpuIcon size={16} />,
                    content: (
                      <>
                        <p>The processing devices are where the computer actually does the work. This is where the calculations and decisions happen.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>CPU (Central Processing Unit):</strong> This is the "brain" of the computer. It carries out instructions and performs calculations. The faster the CPU, the faster the computer can do things.</li>
                          <li><strong>GPU (Graphics Processing Unit):</strong> Handles all the images and videos you see on the screen. Important for games, video editing, and anything with lots of graphics.</li>
                          <li><strong>Motherboard:</strong> The main circuit board that connects all the other components together.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: '4. Storage Devices: Remembering Information',
                    icon: <HardDriveIcon size={16} />,
                    content: (
                      <>
                        <p>Storage devices are where the computer keeps information, even when it is turned off. They are the memory for the computer.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Hard Disk Drive (HDD):</strong> Stores all your files, programs, and the operating system. It is like a filing cabinet inside the computer. HDDs have moving parts, so they can be a bit slower.</li>
                          <li><strong>Solid State Drive (SSD):</strong> Does the same job as an HDD, but it is much faster and more reliable because it has no moving parts. SSDs are becoming more common.</li>
                          <li><strong>USB Flash Drive (Pen Drive):</strong> Small, portable storage device that you can plug into a USB port. Great for carrying files around.</li>
                          <li><strong>Memory Card (SD Card):</strong> Used in cameras, phones, and other devices to store photos, videos, and other data.</li>
                          <li><strong>Optical Disk Drives (CD/DVD/Blu-ray Drives):</strong> Used for reading data from CDs, DVDs, and Blu-ray discs. Although less common, they are still used for software installation and movie playback.</li>
                        </ul>
                      </>
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

            {/* SECTION 2: Factors to Consider When Buying Computer Hardware */}
            <div
              ref={(el) => {
                sectionRefs.current['buying'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Factors to Consider When Buying Computer Hardware
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Purpose',
                    icon: <Target size={16} />,
                    content: 'Are you using it for school, work, gaming, or just browsing the internet? This will determine what kind of power and features you need. A gamer needs a strong graphics card, while someone who just writes documents does not.',
                  },
                  {
                    title: '2. Performance',
                    icon: <CpuIcon size={16} />,
                    content: 'Think about how quickly you want the computer to do things. A faster processor (CPU), more RAM, and a solid-state drive (SSD) will make the computer run faster.',
                  },
                  {
                    title: '3. Budget',
                    icon: <Hash size={16} />,
                    content: 'Computers can be expensive, so set a budget and stick to it. You can often find good deals if you shop around.',
                  },
                  {
                    title: '4. Compatibility',
                    icon: <Plug size={16} />,
                    content: 'Make sure the new hardware will work with your existing computer and other devices. Check the ports (USB, HDMI, etc.) and make sure they match.',
                  },
                  {
                    title: '5. Storage',
                    icon: <HardDriveIcon size={16} />,
                    content: 'Think about how many files, photos, videos, and programs you need to store. Choose a hard drive or SSD with enough space for your needs.',
                  },
                  {
                    title: '6. Warranty',
                    icon: <ShieldCheck size={16} />,
                    content: 'A good warranty can protect you if the hardware breaks down. Check the warranty terms before you buy.',
                  },
                  {
                    title: '7. Reviews',
                    icon: <FileText size={16} />,
                    content: 'Read reviews from other customers to see what they think of the hardware. This can help you avoid buying something that is not very good.',
                  },
                  {
                    title: '8. Futureproofing',
                    icon: <Clock size={16} />,
                    content: 'Consider whether the hardware will still be powerful enough for your needs in a few years. Buying something a little more powerful now can save you money in the long run.',
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

            {/* SECTION 3: Systems and Application Software */}
            <div
              ref={(el) => {
                sectionRefs.current['software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Systems and Application Software
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Software is the set of instructions that tells the computer what to do. There are two main types of software: system software and application software.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'System Software',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <>
                        <p>System software manages the computer's hardware and provides a platform for running application software. It is like the foundation of a house.</p>
                        <p><strong>Examples:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Operating System (OS):</strong> The most important piece of system software. It controls all the hardware and software on the computer. Examples include Windows, macOS, and Linux.</li>
                          <li><strong>Device Drivers:</strong> Software that allows the operating system to communicate with specific hardware devices, like printers and scanners.</li>
                          <li><strong>Utilities:</strong> Programs that help you manage your computer, such as disk defragmenters, antivirus software, and file compression tools.</li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Application Software',
                    icon: <AppWindow size={16} />,
                    content: (
                      <>
                        <p>Application software is designed to help you perform specific tasks. It is like the tools you use inside the house.</p>
                        <p><strong>Examples:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Word Processors:</strong> For creating and editing documents, like Microsoft Word or Google Docs.</li>
                          <li><strong>Spreadsheets:</strong> For organising and analysing data, like Microsoft Excel or Google Sheets.</li>
                          <li><strong>Web Browsers:</strong> For accessing the internet, like Chrome, Firefox, or Safari.</li>
                          <li><strong>Games:</strong> For entertainment.</li>
                          <li><strong>Accounting Software:</strong> For managing finances.</li>
                        </ul>
                      </>
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

            {/* SECTION 4: Criterion for Selecting Application Software */}
            <div
              ref={(el) => {
                sectionRefs.current['select-software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Criterion for Selecting Application Software
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Functionality',
                    icon: <Target size={16} />,
                    content: 'Make sure the software has all the features you need. Does it have the tools you need to do your job effectively?',
                  },
                  {
                    title: '2. Ease of Use',
                    icon: <Hand size={16} />,
                    content: 'The software should be easy to learn and use, even if you are not a computer expert. A simple and intuitive interface is crucial.',
                  },
                  {
                    title: '3. Compatibility',
                    icon: <Plug size={16} />,
                    content: 'Make sure the software is compatible with your operating system and other software.',
                  },
                  {
                    title: '4. Cost',
                    icon: <Hash size={16} />,
                    content: 'Consider the cost of the software, including any subscription fees. Some software is free, while others can be quite expensive.',
                  },
                  {
                    title: '5. Support',
                    icon: <ShieldCheck size={16} />,
                    content: 'Check to see if the software has good customer support. Can you get help if you have problems?',
                  },
                  {
                    title: '6. Security',
                    icon: <Shield size={16} />,
                    content: 'Make sure the software is secure and will not harm your computer or compromise your data. Does it have security updates and a good reputation?',
                  },
                  {
                    title: '7. Reviews',
                    icon: <FileText size={16} />,
                    content: 'Read online reviews from other users to get an idea of how good the software is.',
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

            {/* SECTION 5: Records Management Software */}
            <div
              ref={(el) => {
                sectionRefs.current['records-software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Records Management Software Used in Managing Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'What does Records Management Software do?',
                    icon: <Database size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Storing Records:</strong> The software stores all types of records electronically (documents, images, emails, etc.).</li>
                        <li><strong>Organising Records:</strong> It organises records by category, date, and other criteria, making it easier to find what you need.</li>
                        <li><strong>Searching Records:</strong> You can quickly search for records using keywords, dates, or other criteria.</li>
                        <li><strong>Controlling Access:</strong> It controls who can access certain records, protecting sensitive information.</li>
                        <li><strong>Retention Schedules:</strong> Records management software helps you set up retention schedules, which specify how long records should be kept and when they should be destroyed.</li>
                        <li><strong>Compliance:</strong> It helps organisations comply with laws and regulations regarding record keeping.</li>
                        <li><strong>Disaster Recovery:</strong> Records are backed up and easily restored in case of accidents or disasters.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Examples of Records Management Software:',
                    icon: <AppWindow size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>OpenKM:</strong> Open-source software for document management.</li>
                        <li><strong>LogicalDOC:</strong> Provides document management features and collaboration tools.</li>
                        <li><strong>FileHold:</strong> Offers robust record management and compliance features.</li>
                        <li><strong>Laserfiche:</strong> A comprehensive document management and business process automation system.</li>
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

            {/* SECTION 6: Data Processing, Computer Management, and File Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['data-processing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Data Processing, Computer Management, and File Handling
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Duties of Data Processing Personnel',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Data Entry Clerks:</strong> Enter data into computer systems from various sources. Skills: Typing, attention to detail.</li>
                        <li><strong>Data Analysts:</strong> Examine data to identify trends and insights. Skills: Statistical analysis, data mining, data visualisation.</li>
                        <li><strong>Database Administrators (DBAs):</strong> Manage and maintain databases. Skills: DBMS knowledge, SQL, backup/recovery procedures.</li>
                        <li><strong>Computer Operators:</strong> Operate and monitor computer systems. Skills: Operating system knowledge, troubleshooting.</li>
                        <li><strong>Data Processing Managers:</strong> Oversee the entire data processing operation. Skills: Leadership, project management.</li>
                        <li><strong>Data Scientists:</strong> Analyse large datasets using advanced techniques. Skills: Python/R, machine learning, big data tools.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Computer Management Operations',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Starting (Booting Up):</strong> Press the power button. The computer loads the operating system from the hard drive into memory.</li>
                        <li><strong>Restarting:</strong> Select "Restart" from the Start/Apple menu. The computer shuts down and starts up again.</li>
                        <li><strong>Shutting Down:</strong> Select "Shut Down" from the Start/Apple menu. The computer closes all programs and turns off.</li>
                        <li><strong>Viewing Basic System Information:</strong> Right-click "This PC" {'>'} Properties (Windows) or Apple menu {'>'}  About This Mac (Mac).</li>
                        <li><strong>Setting Up Desktop Configuration:</strong> Right-click on desktop {'>'}  Personalise (Windows) or System Preferences {'>'} Desktop & Screen Saver (Mac).</li>
                        <li><strong>Updating the Operating System:</strong> Go to Windows Update in Settings (Windows) or Software Update in System Settings (Mac).</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'File Management Operations',
                    icon: <Archive size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Creating Folders:</strong> Right-click in File Explorer/Finder and select "New Folder."</li>
                        <li><strong>Creating Icons/Shortcuts:</strong> Right-click on a program/file and select "Create Shortcut" (Windows) or drag while holding Command+Option (Mac).</li>
                        <li><strong>Moving Files and Folders:</strong> Drag the item to the new location or use Cut and Paste.</li>
                        <li><strong>Copying Files and Folders:</strong> Right-click and select "Copy," then right-click in the new location and select "Paste."</li>
                        <li><strong>Deleting Files and Folders:</strong> Right-click and select "Delete" or drag to Recycle Bin/Trash.</li>
                        <li><strong>Renaming Files and Folders:</strong> Click on the file/folder, then single-click the name once highlighted to change it.</li>
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

            {/* SECTION 7: Print Management */}
            <div
              ref={(el) => {
                sectionRefs.current['print'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Print Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Selecting a printer:</strong> In most programs, go to "File" -{'>'}  "Print" and choose the printer from the list.</li>
                  <li><strong>Configuring Print Settings:</strong> Adjust number of copies, paper size, orientation, and print quality.</li>
                  <li><strong>Print Preview:</strong> View what the document will look like before printing. Always preview to avoid wasting paper.</li>
                  <li><strong>Managing the Print Queue:</strong> Double-click the printer icon to view, pause, cancel, or reorder documents waiting to be printed.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 8: File Organization Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['file-org'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                File Organization Methods
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Hierarchical File System (Tree Structure)',
                    icon: <Archive size={16} />,
                    content: (
                      <>
                        <p>This is the most common method, like a family tree. Start with a main folder (root directory) and create subfolders inside it.</p>
                        <p><strong>Advantages:</strong> Easy to understand, flexible, good for organising large amounts of data.</p>
                        <p><strong>Disadvantages:</strong> Can become disorganised if not maintained properly.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Flat File System',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p>All files are stored in a single directory without any subfolders.</p>
                        <p><strong>Advantages:</strong> Simple to implement.</p>
                        <p><strong>Disadvantages:</strong> Very difficult to manage a large number of files.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Tag-Based System (Metadata)',
                    icon: <Hash size={16} />,
                    content: (
                      <>
                        <p>Instead of organising files into folders, you assign tags (keywords) to each file and search based on tags.</p>
                        <p><strong>Advantages:</strong> Very flexible, multiple tags per file.</p>
                        <p><strong>Disadvantages:</strong> Requires consistent tagging, time-consuming.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Date-Based System',
                    icon: <Calendar size={16} />,
                    content: (
                      <>
                        <p>Organise files by date, creating folders for each year, month, or day.</p>
                        <p><strong>Advantages:</strong> Useful for time-sensitive files.</p>
                        <p><strong>Disadvantages:</strong> Not suitable for all types of files.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Application-Based System',
                    icon: <AppWindow size={16} />,
                    content: (
                      <>
                        <p>Organise files based on the application used to create them.</p>
                        <p><strong>Advantages:</strong> Easy to find files created with specific applications.</p>
                        <p><strong>Disadvantages:</strong> Not useful if you use multiple applications for the same file type.</p>
                      </>
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

            {/* SECTION 9: Practicals */}
            <div
              ref={(el) => {
                sectionRefs.current['practicals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Practicals on Word Processing, Spreadsheet, Database and Presentations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Word Processing (e.g., Microsoft Word, Google Docs)',
                    icon: <FileText size={16} />,
                    content: (
                      <>
                        <p><strong>Tasks:</strong> Creating a new document, typing/editing text, formatting text, creating headings/subheadings, bullet points/numbered lists, inserting images/tables, checking spelling/grammar, creating a table of contents, saving and printing.</p>
                        <p><strong>Goal:</strong> Learn how to create well-formatted documents for reports, letters, essays, and other types of writing.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Spreadsheet Package (e.g., Microsoft Excel, Google Sheets)',
                    icon: <BarChart size={16} />,
                    content: (
                      <>
                        <p><strong>Tasks:</strong> Creating a new spreadsheet, entering data into cells, formatting cells, using formulas (sum, average, etc.), creating charts/graphs, sorting/filtering data, creating tables, saving and printing.</p>
                        <p><strong>Goal:</strong> Learn how to organise, analyse, and visualise data using spreadsheets.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Database (e.g., Microsoft Access, MySQL)',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p><strong>Tasks:</strong> Creating a new database, creating tables with fields and data types, entering data, creating relationships, creating queries, creating forms, creating reports.</p>
                        <p><strong>Goal:</strong> Learn how to design and manage databases to store and retrieve information efficiently.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Presentations (e.g., Microsoft PowerPoint, Google Slides)',
                    icon: <Monitor size={16} />,
                    content: (
                      <>
                        <p><strong>Tasks:</strong> Creating a new presentation, adding/formatting slides, adding text/images/objects, using slide layouts, adding animations/transitions, creating speaker notes, delivering a presentation, saving and printing.</p>
                        <p><strong>Goal:</strong> Learn how to create effective presentations to communicate information clearly and engagingly.</p>
                      </>
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

            {/* SECTION 10: Threats to Computer Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['threats'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Threats to Computer Systems and Ways of Preventing Them
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Types of Threats',
                    icon: <ShieldAlert size={16} />,
                    content: (
                      <>
                        <p><strong>Accidental Threats:</strong> Accidental deletion, hardware/software failure, power outages/surges.</p>
                        <p><strong>Malicious Threats:</strong> Viruses, malware, phishing, network intrusions.</p>
                      </>
                    ),
                  },
                  {
                    title: 'Prevention Measures',
                    icon: <ShieldCheck size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Install and regularly update antivirus software.</li>
                        <li>Be careful with emails and links – scrutinise suspicious emails and attachments.</li>
                        <li>Use strong passwords that cannot be easily guessed.</li>
                        <li>Enable two-factor authentication (2FA) for extra security.</li>
                        <li>Encrypt sensitive data, especially on portable devices.</li>
                        <li>Install firewalls to block unauthorised access.</li>
                        <li>Keep your operating system and software updated to patch vulnerabilities.</li>
                        <li>Educate users about cybersecurity best practices.</li>
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

            {/* SECTION 11: Data Security */}
            <div
              ref={(el) => {
                sectionRefs.current['data-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Data Security
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Computer Crime',
                    icon: <ShieldAlert size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Hacking:</strong> Gaining unauthorised access to computer systems.</li>
                        <li><strong>Data Theft:</strong> Stealing sensitive information like credit card numbers or passwords.</li>
                        <li><strong>Identity Theft:</strong> Using someone else's personal information to commit fraud.</li>
                        <li><strong>Cyberstalking:</strong> Harassing or threatening someone online.</li>
                        <li><strong>Online Scams:</strong> Deceiving people into giving away money or information.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Malicious Software (Malware)',
                    icon: <Trash2 size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Viruses:</strong> Programs that attach to other files and spread. Can corrupt data, slow down the computer.</li>
                        <li><strong>Worms:</strong> Similar to viruses but can spread on their own without attaching to other files.</li>
                        <li><strong>Trojans:</strong> Disguise themselves as legitimate software. Can steal data or give hackers access.</li>
                        <li><strong>Spyware:</strong> Secretly monitor your activity and collect information.</li>
                        <li><strong>Ransomware:</strong> Encrypt your files and demand a ransom payment.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Symptoms of Malicious Software Attack',
                    icon: <Shield size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Slow performance</li>
                        <li>Unusual error messages</li>
                        <li>Unexpected pop-up windows</li>
                        <li>Changes to browser settings</li>
                        <li>Missing files</li>
                        <li>Increased network activity</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Measures Against Malicious Software',
                    icon: <ShieldCheck size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Install Antivirus Software and keep it updated.</li>
                        <li>Be careful what you click – don't click on links or attachments from unknown senders.</li>
                        <li>Keep your software updated.</li>
                        <li>Use a Firewall.</li>
                        <li>Back up your data regularly.</li>
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

            {/* SECTION 12: Legal Issues Affecting ICT and Records Management */}
            <div
              ref={(el) => {
                sectionRefs.current['legal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Legal Issues Affecting Information Communication Technology and Records Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Data Protection and Privacy Laws',
                    icon: <Shield size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Lawfulness:</strong> Data must be processed fairly and lawfully.</li>
                        <li><strong>Purpose Limitation:</strong> Data must only be used for the specific purpose it was collected for.</li>
                        <li><strong>Data Minimization:</strong> Only necessary data should be collected.</li>
                        <li><strong>Accuracy:</strong> Data must be accurate and up to date.</li>
                        <li><strong>Storage Limitation:</strong> Data should not be kept longer than necessary.</li>
                        <li><strong>Security:</strong> Data must be kept secure.</li>
                        <li><strong>Accountability:</strong> Organisations are responsible for complying with these principles.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Copyright Laws',
                    icon: <BookOpen size={16} />,
                    content: 'Protect intellectual property, including software, documents, and multimedia. You need permission to copy, distribute, or modify copyrighted works.',
                  },
                  {
                    title: '3. Cybercrime Laws',
                    icon: <ShieldAlert size={16} />,
                    content: 'Address illegal activities like hacking, fraud, and spreading malware.',
                  },
                  {
                    title: '4. E-Commerce Laws',
                    icon: <Cloud size={16} />,
                    content: 'Govern online transactions, including consumer protection, contract law, and data security.',
                  },
                  {
                    title: '5. Records Management Laws',
                    icon: <ClipboardList size={16} />,
                    content: 'Specify how long certain records must be kept and how they should be destroyed. Important for legal compliance and historical preservation.',
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

            {/* SECTION 13: Software Licensing */}
            <div
              ref={(el) => {
                sectionRefs.current['licensing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Software Licensing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Types of Software Licenses',
                    icon: <SettingsIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Proprietary/Commercial License:</strong> You pay for the software and have limited rights to use it. Cannot copy, modify, or distribute without permission.</li>
                        <li><strong>Open-Source License:</strong> You have the right to use, modify, and distribute the software freely. Different types with varying terms.</li>
                        <li><strong>Freeware:</strong> The software is free to use, but the developer retains copyright. May not be able to modify or distribute.</li>
                        <li><strong>Shareware:</strong> Use for free for a limited time, after which you need to pay for a license.</li>
                        <li><strong>Public Domain:</strong> Not copyrighted and can be used by anyone for any purpose.</li>
                        <li><strong>Creative Commons:</strong> Allows creators to share their work while retaining some rights.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Key Aspects of Software Licenses',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Number of Users:</strong> How many people can use the software?</li>
                        <li><strong>Number of Devices:</strong> How many computers can the software be installed on?</li>
                        <li><strong>Term:</strong> How long does the license last? (Perpetual or specific period)</li>
                        <li><strong>Restrictions:</strong> What are you allowed to do with the software?</li>
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

            {/* SECTION 14: Implications of Data Protection Legislation */}
            <div
              ref={(el) => {
                sectionRefs.current['data-protection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Implications of Data Protection Legislation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Key Implications for Organisations',
                    icon: <ShieldCheck size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Increased Accountability:</strong> Organisations must take responsibility for how they collect, use, and protect personal data.</li>
                        <li><strong>Greater Transparency:</strong> Must be clear about how they handle personal data with privacy notices.</li>
                        <li><strong>Enhanced Individual Rights:</strong> Individuals have the right to access, correct, erase, and restrict processing of their data.</li>
                        <li><strong>Data Security:</strong> Must implement appropriate security measures to protect personal data.</li>
                        <li><strong>Data Breach Notification:</strong> Must notify authorities and affected individuals of data breaches.</li>
                        <li><strong>Data Protection Officer (DPO):</strong> Some organisations must appoint a DPO.</li>
                        <li><strong>International Data Transfers:</strong> Transferring personal data outside certain jurisdictions is subject to strict rules.</li>
                      </ul>
                    ),
                  },
                  {
                    title: 'Consequences of Non-Compliance',
                    icon: <ShieldAlert size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Fines:</strong> Data protection authorities can impose significant fines.</li>
                        <li><strong>Reputational Damage:</strong> Data breaches and non-compliance can damage reputation.</li>
                        <li><strong>Legal Action:</strong> Individuals can sue for violations.</li>
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

            {/* SECTION 15: Emerging Technologies in Records Management */}
            <div
              ref={(el) => {
                sectionRefs.current['emerging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Emerging Technologies in Records Management with Regards to ICT
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Cloud Computing',
                    icon: <Cloud size={16} />,
                    content: 'Storing records in the cloud provides scalability, accessibility, and cost savings. Important to choose a cloud provider with strong security and data protection measures.',
                  },
                  {
                    title: 'Artificial Intelligence (AI) and Machine Learning (ML)',
                    icon: <CpuIcon size={16} />,
                    content: 'AI and ML can automate tasks like data classification, indexing, and retention scheduling. Can help identify sensitive data and detect potential compliance issues.',
                  },
                  {
                    title: 'Blockchain',
                    icon: <Fingerprint size={16} />,
                    content: 'Blockchain can be used to create immutable records, ensuring their authenticity and integrity. Particularly useful for sensitive documents like contracts and legal records.',
                  },
                  {
                    title: 'Big Data Analytics',
                    icon: <BarChart size={16} />,
                    content: 'Analysing large volumes of data can provide insights into trends, risks, and opportunities. Helps organisations make better decisions.',
                  },
                  {
                    title: 'Mobile Technologies',
                    icon: <Smartphone size={16} />,
                    content: 'Mobile devices are increasingly used for creating and accessing records. Important to have policies and technologies to manage records on mobile devices.',
                  },
                  {
                    title: 'Optical Character Recognition (OCR)',
                    icon: <Scan size={16} />,
                    content: 'OCR converts scanned images of text into machine-readable text. Makes it easier to search and index scanned documents.',
                  },
                  {
                    title: 'Enterprise Content Management Systems (ECM)',
                    icon: <Database size={16} />,
                    content: 'ECM systems are comprehensive platforms for managing all types of content, including documents, images, videos, and audio files. Provide workflow automation, collaboration, and records management features.',
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

            {/* SECTION 16: Ergonomic Tips for Computer Users */}
            <div
              ref={(el) => {
                sectionRefs.current['ergonomics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Ergonomic Tips for Computer Users
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Proper Posture',
                    icon: <Hand size={16} />,
                    content: 'Sit upright with your back straight and your shoulders relaxed. Feet should be flat on the floor or supported by a footrest. Avoid slouching or leaning forward. Ensure your chair provides adequate lumbar support.',
                  },
                  {
                    title: 'Screen Positioning',
                    icon: <Monitor size={16} />,
                    content: 'Position your monitor directly in front of you, approximately an arm\'s length away. The top of the screen should be at or slightly below eye level to prevent neck strain.',
                  },
                  {
                    title: 'Keyboard and Mouse Placement',
                    icon: <Keyboard size={16} />,
                    content: 'Keep your keyboard and mouse close to your body. Wrists should be straight and in a neutral position. Use a keyboard tray or adjust desk height. Consider using a wrist rest.',
                  },
                  {
                    title: 'Regular Breaks',
                    icon: <Clock size={16} />,
                    content: 'Take frequent breaks to stretch and move around. Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.',
                  },
                  {
                    title: 'Lighting and Glare',
                    icon: <Sun size={16} />,
                    content: 'Ensure your workspace is well-lit but avoid glare on your screen. Position your monitor away from direct light sources. Use blinds or curtains to control natural light. Consider using an anti-glare screen.',
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

            {/* SECTION 17: Health Effects of Prolonged and Inappropriate Computer Use */}
            <div
              ref={(el) => {
                sectionRefs.current['health'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Health Effects of Prolonged and Inappropriate Computer Use and Measures to Reduce Effects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Repetitive Strain Injury (RSI)',
                    icon: <Hand size={16} />,
                    content: (
                      <>
                        <p><strong>Symptoms:</strong> Pain, numbness, and tingling in hands, wrists, arms, and neck.</p>
                        <p><strong>Measures:</strong> Use ergonomic keyboards and mice, take frequent breaks, perform stretching exercises.</p>
                      </>
                    ),
                  },
                  {
                    title: '2. Eye Strain (Computer Vision Syndrome)',
                    icon: <Monitor size={16} />,
                    content: (
                      <>
                        <p><strong>Symptoms:</strong> Dry eyes, blurred vision, headaches, fatigue.</p>
                        <p><strong>Measures:</strong> Follow the 20-20-20 rule, adjust screen brightness/contrast, use anti-glare screens, blink frequently.</p>
                      </>
                    ),
                  },
                  {
                    title: '3. Back and Neck Pain',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p><strong>Symptoms:</strong> Pain from poor posture and prolonged sitting.</p>
                        <p><strong>Measures:</strong> Maintain proper posture, use a supportive chair, adjust monitor height, take regular breaks.</p>
                      </>
                    ),
                  },
                  {
                    title: '4. Headaches',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p><strong>Symptoms:</strong> Tension headaches and migraines from eye strain, poor posture, and stress.</p>
                        <p><strong>Measures:</strong> Address underlying causes of eye strain and poor posture. Manage stress and ensure adequate hydration.</p>
                      </>
                    ),
                  },
                  {
                    title: '5. Carpal Tunnel Syndrome',
                    icon: <Hand size={16} />,
                    content: (
                      <>
                        <p><strong>Symptoms:</strong> Pain, numbness, and tingling in the hand and fingers caused by compression of the median nerve.</p>
                        <p><strong>Measures:</strong> Maintain a neutral wrist position, use ergonomic keyboards/mice, take frequent breaks, perform wrist exercises.</p>
                      </>
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

            {/* SECTION 18: Requirements of an Ideal Computer Room Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['environment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Requirements of an Ideal Computer Room Environment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Adequate Lighting',
                    icon: <Sun size={16} />,
                    content: 'Sufficient and even lighting is crucial. Avoid glare and harsh shadows on the screen. Use adjustable lighting to control brightness and direction.',
                  },
                  {
                    title: '2. Comfortable Temperature and Ventilation',
                    icon: <Thermometer size={16} />,
                    content: 'Maintain a comfortable temperature and ensure proper ventilation to prevent discomfort and fatigue. Use air conditioning or fans to regulate temperature.',
                  },
                  {
                    title: '3. Ergonomic Furniture',
                    icon: <Chair size={16} />,
                    content: 'Use adjustable chairs, desks, and monitor stands to promote good posture and reduce strain. Invest in chairs with lumbar support and adjustable height desks.',
                  },
                  {
                    title: '4. Noise Control',
                    icon: <Volume2 size={16} />,
                    content: 'Minimise noise distractions to enhance concentration and productivity. Use sound-absorbing materials and noise-cancelling headphones if necessary.',
                  },
                  {
                    title: '5. Cable Management',
                    icon: <Plug size={16} />,
                    content: 'Organise cables to prevent tripping hazards and maintain a clean and tidy workspace. Use cable ties, clips, and conduits to manage wires.',
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

            {/* SECTION 19: Safety Precautions When Using Computers */}
            <div
              ref={(el) => {
                sectionRefs.current['safety'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Safety Precautions When Using Computers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Electrical Safety',
                    icon: <Plug size={16} />,
                    content: 'Ensure all electrical connections are secure and properly grounded. Avoid overloading electrical outlets and use surge protectors. Regularly inspect cables and plugs for damage. Keep liquids away from electrical equipment.',
                  },
                  {
                    title: 'Fire Safety',
                    icon: <Flame size={16} />,
                    content: 'Keep flammable materials away from computers. Ensure proper ventilation to prevent overheating. Have a fire extinguisher nearby. Do not block ventilation openings. Avoid using damaged or frayed electrical cords.',
                  },
                  {
                    title: 'Data Security',
                    icon: <Shield size={16} />,
                    content: 'Protect your data from unauthorised access and loss. Use strong passwords, install antivirus software, and back up your data regularly. Be cautious when opening email attachments or clicking on links. Use a firewall and keep your software updated.',
                  },
                  {
                    title: 'Physical Safety',
                    icon: <Hand size={16} />,
                    content: 'Prevent tripping hazards by keeping cables organised and out of the way. Ensure your workspace is clean and free of clutter. Use cable management solutions and keep your floor clear.',
                  },
                  {
                    title: 'Software Safety',
                    icon: <Code size={16} />,
                    content: 'Only download software from trusted sources. Be cautious of pirated software, as it may contain malware. Keep your operating system and software updated. Use reputable antivirus and anti-malware software. Avoid clicking on pop-up ads or suspicious links.',
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
                  💡 Tech Insight
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
                  <span>Hardware Categories</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Software Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Security Threats</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Hardware is the physical stuff (Input, Output, Processing, Storage). Software is the instructions (System and Application). Security is critical – protect against malware, use strong passwords, and back up data. Ergonomics and safety prevent health issues. Emerging tech like AI, blockchain, and cloud are transforming records management.
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
                <strong className="text-white">Hardware Categories</strong> – Input (keyboard, mouse), Output (monitor, printer), Processing (CPU, GPU), Storage (HDD, SSD, USB). Choose hardware based on purpose, performance, budget, compatibility, and future needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Software Types</strong> – System software (OS, drivers, utilities) manages the computer; application software (word processors, spreadsheets, browsers) helps you perform tasks. Select application software based on functionality, ease of use, compatibility, cost, support, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Records Management Software</strong> – Stores, organises, searches, and controls access to records. Helps with retention schedules, compliance, and disaster recovery. Examples: OpenKM, LogicalDOC, FileHold, Laserfiche.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security &amp; Legal Issues</strong> – Threats include malware, hacking, and data theft. Prevention: antivirus, firewalls, strong passwords, updates, and user education. Data protection laws require accountability, transparency, and security; non‑compliance leads to fines and reputational damage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ergonomics &amp; Safety</strong> – Proper posture, screen positioning, breaks, and lighting reduce health risks like RSI, eye strain, and back pain. Computer rooms need good lighting, temperature control, noise reduction, and cable management. Safety includes electrical, fire, data, physical, and software precautions.
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
            Sidemann Academic Registry • ICT &amp; Records Management – Learning Outcome 1
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;