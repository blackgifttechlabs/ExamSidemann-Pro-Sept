import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Terminal,
  GraduationCap,
  Rocket,
  Brain,
  ChevronRight,
  Cpu,
  Database,
  Layout,
  CheckCircle,
  Clock,
  BookOpen,
  Shield,
  Users,
  FolderTree,
  Network,
  Package,
  Server,
  Settings,
  HardDrive,
  Cloud,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertTriangle,
  User,
  Key,
  Lock,
  Globe,
  Monitor,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'setup', label: 'Setup' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'filesystem', label: 'File System' },
  { id: 'user-mgmt', label: 'User Mgmt' },
  { id: 'additional', label: 'Concepts' },
  { id: 'virtualization', label: 'Virtualization' },
  { id: 'group-policy', label: 'Group Policy' },
  { id: 'deploy-vm', label: 'Deploy VM' },
  { id: 'manage-users', label: 'Manage Users' },
  { id: 'install-upgrade', label: 'Install/Upgrade' },
  { id: 'service-packs', label: 'Service Packs' },
  { id: 'config-params', label: 'Config Params' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Linux file permissions are represented by a 10-character string like -rw-r--r--. The first character indicates file type, and the next three sets of three characters represent read, write, execute for owner, group, and others.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use sudo sparingly. It’s better to log in as a non‑root user and only escalate privileges when necessary to avoid accidental system damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Linux directory structure: /bin (essential binaries), /etc (configuration), /home (user homes), /var (variable data like logs), /tmp (temporary files).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget to use chmod with the correct numeric or symbolic syntax. For example, chmod 755 file gives owner read/write/execute and group/others read/execute.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Linux file permissions are represented by a 10-character string like -rw-r--r--. The first character indicates file type, and the next three sets of three characters represent read, write, execute for owner, group, and others.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use sudo sparingly. It’s better to log in as a non‑root user and only escalate privileges when necessary to avoid accidental system damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Linux directory structure: /bin (essential binaries), /etc (configuration), /home (user homes), /var (variable data like logs), /tmp (temporary files).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget to use chmod with the correct numeric or symbolic syntax. For example, chmod 755 file gives owner read/write/execute and group/others read/execute.',
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Terminal size={14} className="inline mr-1" /> LINUX ENVIRONMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Simply Easy Linux
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Setting up a Linux environment — file permissions, processes, user management, networking, software, and virtualization.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FolderTree size={14} className="inline mr-1" /> File System
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> User Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Server size={14} className="inline mr-1" /> Virtualization
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
                placeholder="Search for a concept, chmod, useradd..."
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
            {/* Setting Up a Linux Environment */}
            <div
              ref={(el) => {
                sectionRefs.current['setup'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Setting Up a Linux Environment
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Setting up a Linux environment involves installing a Linux distribution (like Ubuntu, Fedora, or Debian) on your computer. This can be done by creating a bootable USB drive or DVD and booting from it. The installation process usually involves partitioning your hard drive, selecting a file system, and creating user accounts.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Quick Tip</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Choose a distribution that suits your needs: Ubuntu for beginners, Fedora for latest packages, or Debian for stability.
                </p>
              </div>
            </div>

            {/* Linux File Permissions, Processes, User Account Management, Linux Networking or Software Management */}
            <div
              ref={(el) => {
                sectionRefs.current['permissions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Linux File Permissions, Processes, User Account Management, Networking &amp; Software
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Lock size={14} /> File Permissions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Linux uses read, write, and execute permissions for owner, group, and others. Commands: <code>chmod</code>, <code>chown</code>.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Cpu size={14} /> Processes
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    An instance of a program; manage with <code>ps</code>, <code>top</code>, <code>kill</code>.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Users size={14} /> User Account Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Create users with <code>useradd</code>, set passwords with <code>passwd</code>.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Globe size={14} /> Networking
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Configure interfaces with <code>ifconfig</code>, <code>ip</code>, <code>netstat</code>.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Package size={14} /> Software Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Package managers: <code>apt</code> (Debian/Ubuntu), <code>dnf</code> (Fedora), <code>yum</code> (older).
                  </p>
                </div>
              </div>
            </div>

            {/* Linux Terminal */}
            <div
              ref={(el) => {
                sectionRefs.current['terminal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Linux Terminal
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Terminals, Consoles, Shells, and Commands</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Terminal:</strong> Text‑based interface.</li>
                  <li><strong>Console:</strong> Physical or virtual terminal.</li>
                  <li><strong>Shell:</strong> Command interpreter (e.g., Bash).</li>
                  <li><strong>Commands:</strong> Instructions to the shell.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Command Structure</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Format: <code>command options arguments</code>.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Tab Key and Keyboard Shortcuts</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code>Tab</code> – autocomplete commands and filenames.</li>
                  <li><code>Ctrl+C</code> – interrupt a command.</li>
                  <li><code>Ctrl+Z</code> – suspend a process.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Root vs. Non‑Privileged Users</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Root</strong> has full access. Use non‑privileged accounts for daily tasks and <code>sudo</code> when needed.
                </p>
              </div>
            </div>

            {/* Linux File System */}
            <div
              ref={(el) => {
                sectionRefs.current['filesystem'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Linux File System
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Linux uses a hierarchical file system with the root directory (<code>/</code>) at the top. Common directories include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code>/bin</code> – essential binaries.</li>
                  <li><code>/etc</code> – configuration files.</li>
                  <li><code>/home</code> – user home directories.</li>
                  <li><code>/var</code> – variable data (logs, spools).</li>
                  <li><code>/tmp</code> – temporary files.</li>
                  <li><code>/usr</code> – user programs and libraries.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Navigate with <code>cd</code>, list with <code>ls</code>, create directories with <code>mkdir</code>, remove with <code>rm</code>.
                </p>
              </div>
            </div>

            {/* User Account Management (detailed) */}
            <div
              ref={(el) => {
                sectionRefs.current['user-mgmt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                User Account Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Manage users with:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code>useradd</code> – create a new user.</li>
                  <li><code>userdel</code> – delete a user.</li>
                  <li><code>passwd</code> – set or change password.</li>
                  <li><code>usermod</code> – modify user attributes.</li>
                  <li><code>groupadd</code> – create groups.</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  User information is stored in <code>/etc/passwd</code>; passwords in <code>/etc/shadow</code>.
                </p>
              </div>
            </div>

            {/* Additional Linux Concepts */}
            <div
              ref={(el) => {
                sectionRefs.current['additional'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Additional Linux Concepts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Cron Jobs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Scheduled tasks that run automatically at specific times.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Bash Scripting</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automate tasks using scripts.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Regular Expressions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pattern matching for text manipulation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">System Logging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Monitor system events and troubleshoot.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Security</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Configure firewalls, permissions, SELinux/AppArmor.</p>
                </div>
              </div>
            </div>

            {/* Virtualization and Hyper-V */}
            <div
              ref={(el) => {
                sectionRefs.current['virtualization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Virtualization and Hyper‑V
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Virtualization allows multiple OSes to run on one physical machine via virtual machines (VMs). <strong>Hyper‑V</strong> is Microsoft's hypervisor for Windows Server and Windows 10/11 Pro/Enterprise.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Each VM has virtual CPU, memory, storage, and network.</li>
                  <li>Hyper‑V supports live migration, snapshots, and dynamic memory.</li>
                  <li>It is used for server consolidation, testing, and development.</li>
                </ul>
              </div>
            </div>

            {/* Administering Group Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['group-policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Administering Group Policy
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Group Policy is used in Windows domains to manage user and computer settings. Key tools:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>GPMC (Group Policy Management Console):</strong> create and edit GPOs.</li>
                  <li><strong>GPOs (Group Policy Objects):</strong> containers for policy settings.</li>
                  <li>Apply security policies, software deployment, folder redirection, etc.</li>
                </ul>
              </div>
            </div>

            {/* Deploying a Virtual Machine-Based Infrastructure */}
            <div
              ref={(el) => {
                sectionRefs.current['deploy-vm'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deploying a Virtual Machine‑Based Infrastructure
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Hardware Requirements:</strong> Sufficient CPU, memory, storage; support for virtualization (Intel VT-x/AMD-V).</li>
                  <li><strong>Hyper‑V Installation:</strong> Enable in Windows Features or Server Manager.</li>
                  <li><strong>Virtual Machine Creation:</strong> Define VM specifications (OS, memory, storage).</li>
                  <li><strong>Network Configuration:</strong> Set up virtual switches for connectivity.</li>
                  <li><strong>Operating System Installation:</strong> Install OS on each VM.</li>
                  <li><strong>Configuration:</strong> Apply network, security, and software settings.</li>
                </ul>
              </div>
            </div>

            {/* Managing User Accounts */}
            <div
              ref={(el) => {
                sectionRefs.current['manage-users'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Managing User Accounts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Monitor size={14} /> Windows
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Control Panel → User Accounts.</li>
                    <li>Create new account (Standard/Administrator).</li>
                    <li>Set password and assign permissions.</li>
                    <li>Use Local Users and Groups (lusrmgr.msc) for advanced.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Terminal size={14} /> Kali Linux
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><code>useradd newuser</code> – create user.</li>
                    <li><code>passwd newuser</code> – set password.</li>
                    <li><code>chown</code> and <code>chmod</code> for permissions.</li>
                    <li><code>usermod -aG sudo newuser</code> for sudo access.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Installing, Upgrading, Repairing, and Backing Up the OS and Components */}
            <div
              ref={(el) => {
                sectionRefs.current['install-upgrade'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing, Upgrading, Repairing, and Backing Up the OS and Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Monitor size={14} /> Windows
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Install:</strong> Boot from installation media.</li>
                    <li><strong>Upgrade:</strong> Windows Update.</li>
                    <li><strong>Repair:</strong> <code>sfc /scannow</code>, DISM.</li>
                    <li><strong>Backup:</strong> System image, file history.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Terminal size={14} /> Linux
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Install:</strong> Boot from live USB/DVD.</li>
                    <li><strong>Upgrade:</strong> <code>apt upgrade</code> (or dnf).</li>
                    <li><strong>Repair:</strong> <code>fsck</code> for file system.</li>
                    <li><strong>Backup:</strong> <code>rsync</code>, <code>tar</code>.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Installing Service Packs */}
            <div
              ref={(el) => {
                sectionRefs.current['service-packs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing Service Packs
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Service packs are cumulative updates for Windows. They include security fixes, bug fixes, and new features. Install via Windows Update or download standalone installer from Microsoft.
                </p>
              </div>
            </div>

            {/* Configuring Critical Operating System Parameters */}
            <div
              ref={(el) => {
                sectionRefs.current['config-params'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Configuring Critical Operating System Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Monitor size={14} /> Windows
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Password Policy:</strong> Group Policy (secpol.msc).</li>
                    <li><strong>Access Control:</strong> UAC, NTFS permissions.</li>
                    <li><strong>Audit Policy:</strong> Configure via Group Policy.</li>
                    <li><strong>Kernel Drivers:</strong> Device Manager.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Terminal size={14} /> Linux
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Password Policy:</strong> <code>/etc/login.defs</code>, <code>passwd</code>.</li>
                    <li><strong>Access Control:</strong> <code>chmod</code>, <code>chown</code>, ACLs.</li>
                    <li><strong>Audit Policy:</strong> <code>auditd</code>.</li>
                    <li><strong>Kernel Modules:</strong> <code>modprobe</code>.</li>
                  </ul>
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
                  💡 Linux Insight
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
                  <span>Key Topics</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">10+</span>
                </li>
                <li className="flex justify-between">
                  <span>Commands Covered</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">15+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Linux is a powerful, open‑source OS. Master file permissions, user management, process handling, and the terminal. Also understand virtualization and group policy for Windows environments. These skills are vital for system administration and development.
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
                <strong className="text-white">Linux Environment</strong> – install a distribution, manage partitions, and set up user accounts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Permissions</strong> – use <code>chmod</code>, <code>chown</code> to control read/write/execute for owner, group, others.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Process &amp; User Management</strong> – monitor with <code>ps</code>/<code>top</code>, manage users with <code>useradd</code>/<code>passwd</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Virtualization &amp; Group Policy</strong> – use Hyper‑V for VMs and Group Policy for Windows domain management.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">OS Maintenance</strong> – install, upgrade, repair, and backup both Windows and Linux systems.
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
            Sidemann Academic Registry • Linux & System Administration 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;