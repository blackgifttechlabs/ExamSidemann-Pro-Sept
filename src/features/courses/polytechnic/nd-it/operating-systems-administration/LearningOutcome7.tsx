import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Shield,
  Lock,
  AlertTriangle,
  Terminal,
  CheckCircle,
  Key,
  Server,
  Users,
  Eye,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  BookOpen,
  AlertCircle,
  Monitor,
  Smartphone,
  Cpu,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'protection-vs-security', label: 'Protection vs Security' },
  { id: 'hardening', label: 'System Hardening' },
  { id: 'threats', label: 'Common Threats' },
  { id: 'auditing', label: 'Auditing & Logging' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'System hardening is a continuous process. The Center for Internet Security (CIS) provides benchmarks for secure configuration of operating systems and applications.',
      },
      {
        title: 'Pro Tip',
        text: 'Always apply the principle of least privilege: give users and processes only the permissions they absolutely need. This limits the damage from compromised accounts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIA triad: Confidentiality (keep data secret), Integrity (keep data accurate), Availability (keep data accessible). Security controls aim to protect these three pillars.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to audit and review logs regularly. Many security breaches go unnoticed for months because logs are not monitored.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'System hardening is a continuous process. The Center for Internet Security (CIS) provides benchmarks for secure configuration of operating systems and applications.',
      },
      {
        title: 'Pro Tip',
        text: 'Always apply the principle of least privilege: give users and processes only the permissions they absolutely need. This limits the damage from compromised accounts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the CIA triad: Confidentiality (keep data secret), Integrity (keep data accurate), Availability (keep data accessible). Security controls aim to protect these three pillars.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to audit and review logs regularly. Many security breaches go unnoticed for months because logs are not monitored.',
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> SYSTEM SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              Protection &amp; Security
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Implementing OS security policies, authorization, auditing, and system hardening strategies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Access Control
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Auditing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Hardening
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
                placeholder="Search for a concept, hardening, auditing..."
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
            {/* Protection vs Security */}
            <div
              ref={(el) => {
                sectionRefs.current['protection-vs-security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Protection vs Security
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Protection and security are distinct but interrelated concepts. Protection focuses on internal mechanisms that control access within the system, while security addresses external threats and the overall defence posture.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Lock size={14} /> Protection
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Internal mechanisms that control access of programs, processes, or users to system resources. Ensures components behave well and do not interfere.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Memory protection (preventing cross-process reads)</li>
                    <li>File permissions (read/write/execute)</li>
                    <li>Hardware protection rings</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield size={14} /> Security
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Encompasses external environment and includes measures to defend against external threats, attacks, and unauthorized access.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>User authentication &amp; password policies</li>
                    <li>Network firewalls &amp; intrusion detection</li>
                    <li>Encryption (data at rest and in transit)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* System Hardening */}
            <div
              ref={(el) => {
                sectionRefs.current['hardening'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Hardening
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  System hardening is the process of securing a system by reducing its surface of vulnerability. It involves removing unnecessary software, securing configurations, and implementing security best practices.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Key Hardening Steps</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Disable Unnecessary Services:</strong> Turn off features, ports, daemons.</li>
                      <li><strong>Update and Patch:</strong> Keep OS and applications up to date.</li>
                      <li><strong>Principle of Least Privilege:</strong> Grant minimal permissions.</li>
                      <li><strong>Strong Authentication:</strong> Use SSH keys or multi‑factor authentication.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-xs font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                      <Terminal size={14} /> Common Linux Hardening
                    </h4>
                    <code className="text-sm text-green-900 dark:text-green-200 block whitespace-pre-wrap mt-1">
                      # Disable root SSH login{'\n'}
                      sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config{'\n\n'}
                      # Enable UFW Firewall{'\n'}
                      ufw default deny incoming{'\n'}
                      ufw default allow outgoing{'\n'}
                      ufw enable
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Common OS Security Threats */}
            <div
              ref={(el) => {
                sectionRefs.current['threats'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Common OS Security Threats
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle size={14} /> Malware
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Software designed to disrupt, damage, or gain unauthorized access. Includes viruses, worms, trojans, and ransomware.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users size={14} /> Privilege Escalation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Exploits a bug or design flaw to gain elevated access to resources normally protected.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Server size={14} /> Denial of Service (DoS)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Overwhelms system with requests, making it unavailable to legitimate users.
                  </p>
                </div>
              </div>
            </div>

            {/* Auditing and Logging */}
            <div
              ref={(el) => {
                sectionRefs.current['auditing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Auditing &amp; Logging
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Auditing involves recording and analyzing security events and logs. It provides a history of activity that can be traced to identify who performed an action, when, and on what resource.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Windows Auditing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Managed via Event Viewer and Group Policy.</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li>Audit Logon Events</li>
                      <li>Audit Object Access (Files/Folders)</li>
                      <li>Audit Privilege Use</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Linux Auditing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Uses kernel audit framework and syslog daemon.</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><code>/var/log/auth.log</code> (Authentication)</li>
                      <li><code>auditd</code> subsystem for complex rules</li>
                      <li><code>journalctl</code> for viewing systemd logs</li>
                    </ul>
                  </div>
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
                  💡 Security Insight
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
                  <span>Key Concepts</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Common Threats</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Security is a layered approach: protection, hardening, auditing, and continuous monitoring. Always follow the principle of least privilege and keep systems updated. Regular log reviews can catch threats early.
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
                <strong className="text-white">Protection vs Security</strong> – protection controls internal access; security defends against external threats.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">System Hardening</strong> – reduce attack surface by disabling unnecessary services, applying updates, and enforcing least privilege.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common Threats</strong> – malware, privilege escalation, denial‑of‑service attacks are primary OS security risks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Auditing &amp; Logging</strong> – track user actions and system events using Event Viewer (Windows) or auditd (Linux).
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
            Sidemann Academic Registry • System Security &amp; Protection 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;