import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  Layers,
  HardDrive,
  CheckCircle,
  Info,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Database,
  BookOpen,
  FileText,
  Monitor,
  Disc,
  Tablet,
  ChevronRight,
  Terminal,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  GraduationCap,
  Network,
  Server,
  Wifi,
  Router,
  Globe,
  ListChecks,
  Activity,
  ClipboardList,
  PenTool,
  Settings,
  Map,
  Flag,
  Shield,
  Binary,
  Layout,
  Lock,
  Eye,
  AlertTriangle,
  User,
  Brain,
  Plus,
  UserCheck,
  Key,
  Fingerprint,
  Radio,
  Cloud,
  FileCheck,
} from 'lucide-react';
// import { AdSense } from '../../../../analytics/AdSense';

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE IMAGE COMPONENT (unchanged)
// ──────────────────────────────────────────────────────────────────────────────
interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ src, alt, className = "" }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  };

  return (
    <div className={`my-4 ${className}`}>
      <div
        className="relative group cursor-pointer inline-block overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-lg w-full rounded-xl"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 max-h-[300px] mx-auto"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-xl">
            <ChevronUp size={20} className="text-[#003153] dark:text-white rotate-45" />
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-8 right-8 p-3 text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>
          <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-pop-bounce" />
          <div className="mt-8 text-center">
            <h4 className="text-white font-black uppercase tracking-[0.2em] mb-4">{alt}</h4>
            <button
              onClick={handleDownload}
              className="px-10 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform rounded"
            >
              Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// NAVIGATION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Overview' },
  { id: 'policy', label: 'Security Policy' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'aaa-virtual', label: 'AAA & Virtual' },
  { id: 'cryptography', label: 'Cryptography' },
  { id: 'technologies', label: 'Security Tech' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'vuln-mgmt', label: 'Vulnerability' },
  { id: 'documentation', label: 'Documentation' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
      { title: 'Security Policy Fact', text: 'The first formal information security policy was created by the US Department of Defense in the 1970s.' },
      { title: 'CIA Triad', text: 'Confidentiality, Integrity, Availability – the core principles that every security policy should address.' },
      { title: 'Cryptography Tip', text: 'Symmetric encryption is faster but requires secure key exchange; asymmetric is slower but more secure for key distribution.' },
      { title: 'Audit Reminder', text: 'Regular vulnerability scanning and penetration testing are essential to identify and fix loopholes before attackers find them.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Security Policy Fact', text: 'The first formal information security policy was created by the US Department of Defense in the 1970s.' },
      { title: 'CIA Triad', text: 'Confidentiality, Integrity, Availability – the core principles that every security policy should address.' },
      { title: 'Cryptography Tip', text: 'Symmetric encryption is faster but requires secure key exchange; asymmetric is slower but more secure for key distribution.' },
      { title: 'Audit Reminder', text: 'Regular vulnerability scanning and penetration testing are essential to identify and fix loopholes before attackers find them.' },
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> COMPUTER SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Security Policies &amp; Audits
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master security policy interpretation, AAA, cryptography, security
            technologies, vulnerability management, and documentation. Learn to
            protect assets, comply with regulations, and respond to incidents.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ Policies &amp; controls
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Cryptography
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a security concept..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-blue-200" />
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
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Security policies define an organisation's approach to security.
                  This outcome covers interpreting policies, implementing
                  controls, using cryptography, and conducting vulnerability
                  assessments to protect critical assets.
                </p>
              </div>
            </div>

            {/* 1. Interpret Security Policy */}
            <div
              ref={(el) => {
                sectionRefs.current['policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interpret Security Policy
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A security policy outlines an organisation's security goals,
                objectives, and procedures. It protects assets, ensures
                compliance, and reduces risk.
              </p>

              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl mt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Why Important</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li>Protects assets (data, systems, facilities).</li>
                  <li>Ensures compliance with regulations.</li>
                  <li>Reduces risk of security incidents.</li>
                  <li>Improves overall security posture.</li>
                </ul>
              </div>

              <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm mt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Key Elements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {[
                    'Introduction (purpose, scope)',
                    'Security goals & objectives',
                    'Security procedures',
                    'Roles & responsibilities',
                    'Incident response plan',
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Interpreting a Policy – Factors</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li>Organisation size and industry.</li>
                  <li>Assets to be protected.</li>
                  <li>Regulatory environment.</li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3">
                  Example: "All employees must use strong passwords and change
                  them regularly" – protects against unauthorised access.
                </p>
              </div>
            </div>

            {/* 2. Case Study: Masvingo Polytechnic */}
            <div
              ref={(el) => {
                sectionRefs.current['case-study'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Case Study: Masvingo Polytechnic
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Purpose & Scope</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Purpose: Protect assets (data, systems, facilities) from
                    unauthorised access, use, disclosure, disruption,
                    modification, or destruction.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Scope: Applies to all employees, students, contractors, and
                    visitors.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Security Goals</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                    <li>Protect CIA of data and systems.</li>
                    <li>Comply with laws and regulations.</li>
                    <li>Prevent and respond to incidents.</li>
                    <li>Raise security awareness.</li>
                  </ul>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Procedures</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                    <li>Use strong passwords, change regularly.</li>
                    <li>Keep passwords confidential.</li>
                    <li>Report suspicious activity to IT.</li>
                    <li>Do not share accounts or resources.</li>
                    <li>Keep physical security devices secure.</li>
                    <li>Be aware of surroundings.</li>
                  </ul>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Roles & Responsibilities</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    <div><strong>IT Dept:</strong> Develop/implement policy, monitor, respond.</div>
                    <div><strong>Managers:</strong> Ensure compliance, report incidents.</div>
                    <div><strong>Employees:</strong> Follow policy, report incidents.</div>
                    <div><strong>Students:</strong> Follow policy, report to Student Services.</div>
                    <div><strong>Contractors:</strong> Follow policy, report to project manager.</div>
                    <div><strong>Visitors:</strong> Follow policy, report to Security Office.</div>
                  </div>
                </div>

                <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Incident Response Plan</h4>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 font-medium list-decimal pl-5 mt-1 space-y-1">
                    <li><strong>Identify</strong> the incident and determine scope/impact.</li>
                    <li><strong>Contain</strong> the incident to prevent spread.</li>
                    <li><strong>Eradicate</strong> the incident and root cause.</li>
                    <li><strong>Recover</strong> systems and data.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 3. AAA & Virtual Environments */}
            <div
              ref={(el) => {
                sectionRefs.current['aaa-virtual'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                AAA &amp; Virtual Environments
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Authorisation, Authentication, and Accounting are essential for
                protecting assets in virtual environments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck size={16} /> Authorisation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Determining if a user is allowed to access a resource.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                    <li>ACLs – specify which users have access.</li>
                    <li>RBAC – grant permissions to roles.</li>
                    <li>ABAC – based on user attributes.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <Key size={16} /> Authentication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Verifying the identity of a user.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                    <li>Passwords – most common, most vulnerable.</li>
                    <li>MFA – two or more factors.</li>
                    <li>Certificate‑based – most secure, complex.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                    <FileCheck size={16} /> Accounting
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Tracking and reporting user activity.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                    <li>System logs – record all activity.</li>
                    <li>Audit trails – track specific events.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Cryptography */}
            <div
              ref={(el) => {
                sectionRefs.current['cryptography'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Cryptography
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Cryptography protects information from unauthorised access
                through encryption, hashing, and digital signatures.
              </p>

              {/* Encryption */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Encryption</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Symmetric</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Same key for encryption and decryption.
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                      <li><strong>Use cases:</strong> Large data (files, DBs).</li>
                      <li><strong>Analogy:</strong> Secret codebook.</li>
                      <li><strong>Adv:</strong> Fast.</li>
                      <li><strong>Disadv:</strong> Key sharing risk.</li>
                    </ul>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Asymmetric</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Public key (encrypt) and private key (decrypt).
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                      <li><strong>Use cases:</strong> Small data (passwords, signatures).</li>
                      <li><strong>Analogy:</strong> Mailbox with public lock.</li>
                      <li><strong>Adv:</strong> Secure.</li>
                      <li><strong>Disadv:</strong> Slow.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Hashing */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Hashing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Transforms data of any size into a fixed‑size alphanumeric
                  string (hash). Used for integrity verification.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {['MD5 (128‑bit)', 'SHA‑1 (160‑bit)', 'SHA‑2 (256/512)', 'BLAKE3'].map((algo) => (
                    <div key={algo} className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                      {algo}
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signatures */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">Digital Signatures</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Mathematical technique to verify authenticity and integrity.
                  Created with private key, verified with public key.
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li>Secure communication (email, transactions).</li>
                  <li>Digital documents (contracts).</li>
                  <li>Software distribution (verify publisher).</li>
                  <li>Blockchain transactions.</li>
                </ul>
              </div>

              {/* Cipher Methods */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight">Cipher Methods</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Block Cipher</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Encrypts data in fixed‑size blocks (e.g., 64 bits).
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                      <li><strong>Examples:</strong> AES, DES, 3DES.</li>
                      <li><strong>Pros:</strong> Fast, well‑studied.</li>
                      <li><strong>Cons:</strong> Vulnerable to certain attacks.</li>
                    </ul>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Stream Cipher</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Encrypts data one byte at a time.
                    </p>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1">
                      <li><strong>Examples:</strong> RC4, Salsa20, ChaCha20.</li>
                      <li><strong>Pros:</strong> Very fast, good for streaming.</li>
                      <li><strong>Cons:</strong> Vulnerable to keystream reuse.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Security Technologies */}
            <div
              ref={(el) => {
                sectionRefs.current['technologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Security Technologies
              </h2>

              {/* Cloud Controls */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Cloud Security Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Preventive</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">IAM, Data Encryption, Network Security.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Detective</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">SIEM, IDS.</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Corrective</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Incident response, Backup/Recovery.</p>
                  </div>
                </div>
              </div>

              {/* Network Security Technologies */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Network Security Technologies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {[
                    { t: 'Firewall', d: 'Monitors and controls traffic based on rules.' },
                    { t: 'Router', d: 'Forwards packets; can do NAT and packet filtering.' },
                    { t: 'NAT Gateway', d: 'Translates private IPs to public IP.' },
                    { t: 'ACLs', d: 'Rules specifying allowed/denied traffic.' },
                    { t: 'IPSec', d: 'Secure IP communications (encrypts/authenticates).' },
                    { t: 'VPNs', d: 'Encrypted tunnel over public network.' },
                    { t: 'IPS', d: 'Intrusion Prevention System – blocks malicious traffic.' },
                    { t: 'IDS', d: 'Intrusion Detection System – monitors and alerts.' },
                    { t: 'WPA', d: 'Wi‑Fi Protected Access – encryption/authentication for Wi‑Fi.' },
                  ].map((tech, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{tech.t}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">{tech.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Monitoring Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['monitoring'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Security &amp; Network Monitoring Tools
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Security Monitoring</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Log management</li>
                    <li>SIEM</li>
                    <li>IDS/IPS</li>
                    <li>Vulnerability scanners</li>
                    <li>SOAR</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Reconnaissance Tools</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Port scanners</li>
                    <li>Ping tools</li>
                    <li>DNS/Whois</li>
                    <li>Social engineering tools</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Network Monitoring</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>SNMP</li>
                    <li>Packet sniffers</li>
                    <li>Port scanners</li>
                    <li>Vulnerability scanners</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-xl mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Identify &amp; Report Emerging Loopholes</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li>Monitor security news and advisories.</li>
                  <li>Use security tools and services.</li>
                  <li>Conduct penetration tests.</li>
                  <li>Report to vendors and organizations like CVE.</li>
                </ul>
              </div>
            </div>

            {/* 7. Vulnerability Management */}
            <div
              ref={(el) => {
                sectionRefs.current['vuln-mgmt'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Vulnerability Management
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Penetration Testing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Simulates an attack to identify vulnerabilities.
                  </p>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mt-2">Phases</h5>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 font-medium list-decimal pl-5 mt-1 space-y-1">
                    <li>Planning – gather info.</li>
                    <li>Scanning – identify open ports.</li>
                    <li>Enumeration – gather user/process info.</li>
                    <li>Exploitation – attempt to exploit.</li>
                    <li>Reporting – document findings.</li>
                  </ol>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Vulnerability Scanning</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Automated process to identify known vulnerabilities.
                  </p>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mt-2">Types</h5>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                    <li>Network scanners – port scanning, banner grabbing.</li>
                    <li>Host scanners – file, registry, process scanning.</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">Benefits: reduced risk, improved posture, compliance.</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Threats, Vulnerabilities, Attacks</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <h5 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Threats</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Potential dangers (malicious actors, malware, phishing).</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Vulnerabilities</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Weaknesses (software bugs, hardware flaws, misconfigs).</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Attacks</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Attempts to exploit vulnerabilities (DoS, data breaches, ransomware).</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Protection Strategy</h5>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                    <li>Technical controls: firewalls, IDS, encryption.</li>
                    <li>Administrative controls: policies, procedures.</li>
                    <li>Physical security: cameras, access control.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 8. Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['documentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Justifications for Security Documentation
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Security documentation records policies, procedures, and controls.
                It is vital for improving posture, compliance, communication, and
                incident response.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Types</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Security policies – requirements.</li>
                    <li>Security procedures – how to implement.</li>
                    <li>Security controls – measures in place.</li>
                    <li>Risk assessments – identified risks.</li>
                    <li>Incident response plans – roles and steps.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">Best Practices</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Keep it up‑to‑date – reflect changes.</li>
                    <li>Make it accessible to all stakeholders.</li>
                    <li>Make it easy to understand – clear, concise.</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-xl mt-4">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-widest">Security Procedures – Preventive &amp; Detective</h4>
                <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm text-slate-300">
                  <div>
                    <h5 className="font-bold text-white uppercase">Preventive</h5>
                    <ul className="list-disc pl-5 space-y-1 font-medium mt-1">
                      <li>Access control</li>
                      <li>Password management</li>
                      <li>Data encryption</li>
                      <li>Security awareness training</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-white uppercase">Detective</h5>
                    <ul className="list-disc pl-5 space-y-1 font-medium mt-1">
                      <li>SIEM</li>
                      <li>IDS</li>
                      <li>Incident response plan</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
                  <strong className="text-blue-300 uppercase block mb-1">Implementation Tips:</strong>
                  Get management buy‑in, communicate to employees, provide training, monitor compliance, update regularly.
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  🔐 Security Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Security technologies</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">9+</span>
                </li>
                <li className="flex justify-between">
                  <span>Cryptography topics</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Security is a continuous cycle of policy, implementation,
                monitoring, and improvement. Use the CIA triad, least privilege,
                and defense in depth as your guiding principles. Regularly audit
                and update your security posture.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Security Policy:</strong> Defines
                goals, procedures, roles, and incident response. Must be
                tailored to the organisation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">AAA:</strong> Authorisation,
                Authentication, Accounting – essential for virtual environments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cryptography:</strong> Encryption
                (symmetric/asymmetric), hashing, and digital signatures protect
                data confidentiality, integrity, and authenticity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Vulnerability Management:</strong>{' '}
                Penetration testing and vulnerability scanning identify
                weaknesses. Combine with monitoring (SIEM, IDS, etc.) for
                comprehensive security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation:</strong> Keep
                policies, procedures, and controls up‑to‑date and accessible.
                Use both preventive and detective measures.
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
            Sidemann Academic Registry • NC IT Computer Security 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;