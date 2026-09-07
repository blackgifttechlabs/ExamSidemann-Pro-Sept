import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  Globe,
  Server,
  Monitor,
  Layers,
  Box,
  Terminal,
  GitBranch,
  Database,
  AlertTriangle,
  FolderTree,
  FileCode,
  Settings,
  Wifi,
  Printer,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  Table,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'linux', label: 'Linux OS' },
  { id: 'windows', label: 'Windows OS' },
  { id: 'install-linux', label: 'Install Linux' },
  { id: 'install-windows', label: 'Install Windows' },
  { id: 'evolution', label: 'Evolution' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'Linux is open-source and has many distributions (Ubuntu, Fedora, Debian) while Windows is proprietary. Both have their strengths and use cases.',
      },
      {
        title: 'Pro Tip',
        text: 'When installing Linux, you can dual-boot with Windows to have both systems on one machine. This is common for developers and students.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Linux file system starts with root "/" while Windows uses drive letters like "C:". Linux is case-sensitive, Windows is not.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to check system requirements before installing an OS. Windows 11 requires TPM 2.0 and Secure Boot, which older hardware may not have.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Linux is open-source and has many distributions (Ubuntu, Fedora, Debian) while Windows is proprietary. Both have their strengths and use cases.',
      },
      {
        title: 'Pro Tip',
        text: 'When installing Linux, you can dual-boot with Windows to have both systems on one machine. This is common for developers and students.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Linux file system starts with root "/" while Windows uses drive letters like "C:". Linux is case-sensitive, Windows is not.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to check system requirements before installing an OS. Windows 11 requires TPM 2.0 and Secure Boot, which older hardware may not have.',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> LEARNING OUTCOME 4
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Linux & Windows{' '}
            <span className="text-amber-300 font-bold italic">
              Operating Systems
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master Linux and Windows organization, file systems, installation, configuration, and version compatibility.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> Linux
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Monitor size={14} className="inline mr-1" /> Windows
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Installation &amp; Config
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
                placeholder="Search for a concept, installation, file system..."
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
            {/* Linux OS */}
            <div
              ref={(el) => {
                sectionRefs.current['linux'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Linux Operating System
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Linux is a kernel-based operating system. The kernel is the core component that manages system resources and provides essential services.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Organization and Components</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Kernel:</strong> Core component managing resources.</li>
                  <li><strong>Shell:</strong> Command-line interface.</li>
                  <li><strong>System Utilities:</strong> Tools for administration, file management, network config.</li>
                  <li><strong>Application Programs:</strong> Software like browsers, editors.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">File System Structure</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Linux uses a hierarchical file system, organized as a tree-like structure. The root directory (<code>/</code>) is the top-level directory.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Linux File System Features</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Case-sensitive:</strong> File and directory names are case-sensitive.</li>
                  <li><strong>Permissions:</strong> Read, write, execute for users/groups.</li>
                  <li><strong>Symbolic Links:</strong> Shortcuts to files/directories.</li>
                  <li><strong>Device Files:</strong> Represent hardware devices.</li>
                  <li><strong>Special Files:</strong> For communication and control.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Types of Linux File Systems</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Ext2, Ext3, Ext4:</strong> Widely used, good performance.</li>
                  <li><strong>XFS:</strong> High-performance, used on servers.</li>
                  <li><strong>NTFS:</strong> Microsoft's file system (with drivers).</li>
                  <li><strong>Btrfs:</strong> Modern with copy-on-write and checksums.</li>
                </ul>
              </div>
            </div>

            {/* Windows OS */}
            <div
              ref={(el) => {
                sectionRefs.current['windows'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Windows Operating System
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Organization and Components</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Windows is a monolithic operating system with tightly integrated components. Key components include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Kernel:</strong> Core resource manager.</li>
                  <li><strong>User Interface:</strong> GUI for interaction.</li>
                  <li><strong>System Applications:</strong> File Explorer, Control Panel, etc.</li>
                  <li><strong>Third-Party Apps:</strong> Installed software.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Windows File System</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Windows uses a hierarchical file system with drive letters (e.g., <code>C:\</code>) representing roots.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Types of Windows File Systems</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>NTFS:</strong> Primary file system, supports security, compression, encryption.</li>
                  <li><strong>FAT32:</strong> Older, limited file size and partition.</li>
                  <li><strong>exFAT:</strong> Designed for flash drives, supports larger files.</li>
                </ul>
              </div>
            </div>

            {/* Installing Linux */}
            <div
              ref={(el) => {
                sectionRefs.current['install-linux'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing a Linux Operating System
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Installation Steps</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Boot Media Creation:</strong> Create bootable USB/DVD with Linux distro.</li>
                  <li><strong>System Boot:</strong> Boot from media to start installer.</li>
                  <li><strong>Partitioning:</strong> Divide hard drive for OS, data, swap.</li>
                  <li><strong>Installation:</strong> Select language, keyboard, settings.</li>
                  <li><strong>User Account Creation:</strong> Create root and standard accounts.</li>
                  <li><strong>Installation Completion:</strong> Format partitions, install OS, configure basics.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Configuring a Linux Operating System</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>User Account Setup:</strong> Create additional users and set passwords.</li>
                  <li><strong>Software Installation:</strong> Use package managers (apt, dnf).</li>
                  <li><strong>Network Configuration:</strong> IP, subnet, gateway, DNS.</li>
                  <li><strong>Hardware Configuration:</strong> Printers, scanners, sound.</li>
                  <li><strong>Security Configuration:</strong> Firewalls, permissions.</li>
                  <li><strong>Customization:</strong> Desktop themes, settings.</li>
                </ul>
              </div>
            </div>

            {/* Installing Windows */}
            <div
              ref={(el) => {
                sectionRefs.current['install-windows'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing a Windows Operating System
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Windows Installation</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Boot Media Creation:</strong> Create bootable USB/DVD with Windows.</li>
                  <li><strong>System Boot:</strong> Boot from media.</li>
                  <li><strong>Language and Keyboard:</strong> Choose preferences.</li>
                  <li><strong>Installation Type:</strong> Clean install or upgrade.</li>
                  <li><strong>Product Key:</strong> Enter valid key.</li>
                  <li><strong>License Terms:</strong> Accept terms.</li>
                  <li><strong>Custom Installation:</strong> Choose partition.</li>
                  <li><strong>Installation Progress:</strong> Format and install.</li>
                  <li><strong>Regional Settings:</strong> Region, time zone, currency.</li>
                  <li><strong>User Account Creation:</strong> Create account with password.</li>
                  <li><strong>Finalization:</strong> Complete and restart.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Windows Server Installation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Similar to Windows, but includes additional configuration for server roles and features.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Configuring a Windows Operating System</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Driver Installation:</strong> Install necessary drivers.</li>
                  <li><strong>Windows Update:</strong> Apply security patches and features.</li>
                  <li><strong>Software Installation:</strong> Install required apps.</li>
                  <li><strong>Network Configuration:</strong> IP, subnet, gateway, DNS.</li>
                  <li><strong>User Accounts:</strong> Create additional users with permissions.</li>
                  <li><strong>Security Settings:</strong> Firewall, password policies.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Windows Server Configuration</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Server Roles and Features:</strong> Install roles (AD, File Server) and features (IIS, SQL).</li>
                  <li><strong>Network Configuration:</strong> Static IP, DNS, DHCP.</li>
                  <li><strong>Active Directory:</strong> Set up domain management.</li>
                  <li><strong>Security Policies:</strong> Password policies, group policies.</li>
                  <li><strong>Backup and Recovery:</strong> Configure backup strategies.</li>
                </ul>
              </div>
            </div>

            {/* Evolution of Windows */}
            <div
              ref={(el) => {
                sectionRefs.current['evolution'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evolution of Windows Operating Systems
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Windows has evolved significantly over the years. Major versions include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Windows 95:</strong> Introduced Start menu and taskbar.</li>
                  <li><strong>Windows XP:</strong> Popular, stable, user-friendly.</li>
                  <li><strong>Windows Vista:</strong> Aero Glass visuals, improved security.</li>
                  <li><strong>Windows 7:</strong> Refined, performance improvements.</li>
                  <li><strong>Windows 8:</strong> Touch-friendly interface, Start screen.</li>
                  <li><strong>Windows 10:</strong> Combined desktop and modern apps.</li>
                  <li><strong>Windows 11:</strong> Latest, performance, security, redesigned UI.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Operating System Version Compatibility</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Consider compatibility when upgrading or installing different versions. Older software may not work on newer Windows, and hardware drivers may need updates.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 OS Insight
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
                  <span>OS Covered</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Install Steps</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Understanding the differences between Linux and Windows is crucial for system administration and software development. Know their file systems, installation procedures, and configuration options. Version compatibility is key when upgrading or deploying systems.
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
                <strong className="text-white">Linux</strong> – open-source, kernel-based, hierarchical file system with root <code>/</code>, case-sensitive, supports Ext4, XFS, etc.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Windows</strong> – monolithic, GUI-centric, uses drive letters, NTFS is primary file system, not case-sensitive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Installation</strong> – both require boot media, partitioning, user setup, and configuration. Linux uses package managers; Windows uses Windows Update.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Compatibility</strong> – check system requirements and software/hardware compatibility before upgrading or installing a new OS.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evolution</strong> – Windows has evolved from 95 to 11, each version adding features, security, and performance improvements.
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
            Sidemann Academic Registry • Operating Systems – Linux & Windows 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
