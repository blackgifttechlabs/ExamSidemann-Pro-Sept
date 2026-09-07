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
  { id: 'critical-assets', label: 'Critical Assets' },
  { id: 'cia-triad', label: 'CIA Triad' },
  { id: 'least-privilege', label: 'Least Privilege' },
  { id: 'defense-in-depth', label: 'Defense in Depth' },
  { id: 'applications', label: 'Applications' },
  { id: 'data-sources', label: 'Data Sources' },
  { id: 'analysis-tools', label: 'Analysis Tools' },
  { id: 'asset-inventory', label: 'Asset Inventory' },
  { id: 'risks', label: 'Risks' },
  { id: 'risk-management', label: 'Risk Management' },
  { id: 'risk-register', label: 'Risk Register' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
      { title: 'Security Fact', text: 'The first computer virus, called Creeper, was created in 1971 and displayed the message "I\'m the creeper, catch me if you can!"' },
      { title: 'CIA Triad', text: 'The CIA triad (Confidentiality, Integrity, Availability) is the foundation of information security. Balance is key.' },
      { title: 'Principle of Least Privilege', text: 'Users should only have the minimum permissions needed to do their job. This reduces attack surface.' },
      { title: 'Defense in Depth', text: 'Multiple layers of security controls (firewalls, encryption, access control) provide stronger protection than a single measure.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Security Fact', text: 'The first computer virus, called Creeper, was created in 1971 and displayed the message "I\'m the creeper, catch me if you can!"' },
      { title: 'CIA Triad', text: 'The CIA triad (Confidentiality, Integrity, Availability) is the foundation of information security. Balance is key.' },
      { title: 'Principle of Least Privilege', text: 'Users should only have the minimum permissions needed to do their job. This reduces attack surface.' },
      { title: 'Defense in Depth', text: 'Multiple layers of security controls (firewalls, encryption, access control) provide stronger protection than a single measure.' },
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> COMPUTER SECURITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Security Concepts &amp; Threats
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master the fundamentals of computer security: CIA triad, principle of
            least privilege, defense in depth, risk management, and more. Learn
            to identify critical assets, analyse threats, and implement security
            controls.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ Security principles
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Practical
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
                  Computer security is the protection of computer systems and
                  information from harm, theft, and unauthorised use. This
                  outcome covers the core principles, threats, and strategies to
                  safeguard critical data.
                </p>
              </div>
            </div>

            {/* 1. Identify Critical Data Assets */}
            <div
              ref={(el) => {
                sectionRefs.current['critical-assets'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identify Critical Data Assets
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Critical data assets are essential to an organisation’s operation
                and could cause significant damage if compromised.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Customer data', d: 'Names, addresses, contact info, credit card numbers.' },
                  { t: 'Financial data', d: 'Bank accounts, investment info, payroll data.' },
                  { t: 'Intellectual property', d: 'Trade secrets, patents, copyrights.' },
                  { t: 'Employee data', d: 'Social Security numbers, medical records, performance reviews.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Factors to Consider
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Value</strong> – How valuable is the data?</li>
                  <li><strong>Impact</strong> – What would be the impact if compromised or lost?</li>
                  <li><strong>Compliance</strong> – Are there regulatory requirements for protection?</li>
                </ul>
              </div>

              <div className="mt-6 p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Protection Measures
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Encryption</strong> – at rest and in transit.</li>
                  <li><strong>Access control</strong> – restrict to authorised individuals.</li>
                  <li><strong>Data Loss Prevention (DLP)</strong> – prevent unauthorised transfers.</li>
                  <li><strong>Backups</strong> – ensure recoverability.</li>
                </ul>
              </div>
            </div>

            {/* 2. CIA Triad */}
            <div
              ref={(el) => {
                sectionRefs.current['cia-triad'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The CIA Triad
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The CIA triad (Confidentiality, Integrity, Availability) is the
                foundation of information security.
              </p>

              <div className="mt-4">
                <InteractiveImage
                  src="https://i.ibb.co/q8CPWX9/66a372b4a3d814c4fc284045-63fdd43c9e3d3474aeaf43cb-CIA-20-Triad-20example.jpg"
                  alt="CIA Triad Diagram"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Confidentiality */}
                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Confidentiality
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">
                    Ensuring data is only accessible to authorised individuals.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1 font-medium">
                    <li>Encryption</li>
                    <li>Access control lists (ACLs)</li>
                    <li>Data Loss Prevention</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3">
                    Example: Bank encrypting customer account info.
                  </p>
                </div>

                {/* Integrity */}
                <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-r-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Integrity
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">
                    Ensuring data is accurate and complete, not modified without
                    authorisation.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1 font-medium">
                    <li>Data validation</li>
                    <li>Checksums and hashes</li>
                    <li>Digital signatures</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3">
                    Example: Retail company validating customer orders.
                  </p>
                </div>

                {/* Availability */}
                <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-r-xl shadow-sm">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">
                    Availability
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">
                    Ensuring data is accessible when needed.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-2 space-y-1 font-medium">
                    <li>Redundancy</li>
                    <li>Load balancing</li>
                    <li>Disaster recovery plans</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3">
                    Example: Website hosting with redundant servers.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Principle of Least Privilege */}
            <div
              ref={(el) => {
                sectionRefs.current['least-privilege'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Principle of Least Privilege (POLP)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Users should only have the permissions necessary to perform their
                authorised tasks – nothing more. This reduces attack surface and
                limits damage if credentials are compromised.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Implementation Steps
                  </h3>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 font-medium list-decimal pl-5 mt-2 space-y-1">
                    <li>Identify all resources.</li>
                    <li>Classify resources by sensitivity.</li>
                    <li>Identify roles and responsibilities.</li>
                    <li>Assign permissions minimally.</li>
                    <li>Monitor and review regularly.</li>
                  </ol>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Benefits
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Reduced attack surface</li>
                    <li>Reduced risk of data breaches</li>
                    <li>Improved compliance</li>
                    <li>Less administrative overhead</li>
                    <li>Better security posture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Defense in Depth */}
            <div
              ref={(el) => {
                sectionRefs.current['defense-in-depth'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Defense in Depth Model
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A security strategy that uses multiple layers of controls. No
                single control is perfect; a combination provides stronger
                protection.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                  { t: 'Diversity', d: 'Use different types of controls (technical, administrative, physical).' },
                  { t: 'Redundancy', d: 'Have multiple controls protecting the same asset.' },
                  { t: 'Segmentation', d: 'Divide systems and information into separate zones.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Applications of Computer Networks */}
            <div
              ref={(el) => {
                sectionRefs.current['applications'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Applications of Computer Networks
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {['Communication', 'Collaboration', 'Entertainment', 'Education', 'Business'].map((app, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                      {app}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Identify Data Sources */}
            <div
              ref={(el) => {
                sectionRefs.current['data-sources'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identify Data Sources
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Vulnerability scanning is the process of identifying, analysing,
                and reporting security flaws. Scans should be run regularly
                (quarterly or annually).
              </p>
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Tips for Discussing Scan Output
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                  <li>Explain what vulnerability scanning is and why it’s important.</li>
                  <li>Provide a summary of results.</li>
                  <li>Prioritise vulnerabilities by severity and exploitability.</li>
                  <li>Offer remediation recommendations.</li>
                </ul>
              </div>
            </div>

            {/* 7. Security Analysis Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['analysis-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Security Analysis Tools
              </h2>

              {/* SIEM */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  SIEM Dashboards
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  SIEM (Security Information and Event Management) dashboards
                  provide real‑time visibility into security data, collecting
                  from network devices, appliances, and applications.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Features</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1 space-y-1">
                      <li>Real‑time data visualisations</li>
                      <li>Alerts and notifications</li>
                      <li>Incident investigation tools</li>
                      <li>Compliance reporting</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Benefits</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1 space-y-1">
                      <li>Improved security posture</li>
                      <li>Reduced risk of data breaches</li>
                      <li>Improved compliance</li>
                      <li>Increased operational efficiency</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Log Files */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                  Log Files
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Log files record events and activities on systems, applications,
                  and devices. They are used for troubleshooting, performance
                  monitoring, and tracking user activity.
                </p>
              </div>

              {/* Other Tools */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Bandwidth Monitors</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Track and report on network bandwidth usage. Identify bandwidth
                    hogs, troubleshoot performance, plan for future needs.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Network Monitors</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Monitor performance and availability of network devices,
                    applications, and services. Identify outages, troubleshoot
                    issues, ensure availability.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-xs font-bold text-[#ff7400] dark:text-orange-400 uppercase tracking-widest">Protocol Analyzers</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Capture and analyse network packets. Used for troubleshooting,
                    traffic analysis, and investigating security incidents.
                  </p>
                </div>
              </div>
            </div>

            {/* 8. Asset Inventory */}
            <div
              ref={(el) => {
                sectionRefs.current['asset-inventory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Asset Inventory &amp; Nmap
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                An asset inventory lists all hardware and software assets owned
                by an organisation. It is critical for security, compliance, and
                operational efficiency.
              </p>

              <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm mt-4">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                  Using Nmap for Inventory
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                  Nmap (Network Mapper) is a free, open‑source tool for network
                  discovery and security auditing. It can identify all devices
                  on a network, along with their operating systems, services, and
                  open ports.
                </p>
                <div className="mt-3 p-3 bg-slate-900 text-green-400 font-mono text-sm rounded shadow-inner">
                  nmap -sS &lt;IP address range&gt;
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  This command performs a SYN stealth scan. Save output for
                  integration into asset management.
                </p>
              </div>
            </div>

            {/* 9. Identify Risks */}
            <div
              ref={(el) => {
                sectionRefs.current['risks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identify Risks
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {[
                  'Malware',
                  'Phishing',
                  'DDoS',
                  'Ransomware',
                  'Insider Threats',
                  'Brute Force',
                  'Spam',
                  'Supply Chain Attacks',
                  'Web/Email Attacks',
                  'Unauthorised Privilege Use',
                  'Loss/Theft of Devices',
                  'ATM Cash Out',
                  'Corporate Account Takeover',
                  'Advanced Persistent Threats',
                  'Traffic Interception',
                ].map((risk, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center"
                  >
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. Risk Management Strategies */}
            <div
              ref={(el) => {
                sectionRefs.current['risk-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risk Management Strategies
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Four main strategies: Acceptance, Avoidance, Transference,
                Mitigation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Acceptance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Decide to live with the risk; take no action. Suitable when
                    risk is low or mitigation cost is too high.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Avoidance</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Eliminate the risk by not taking the action that creates it,
                    or choosing a safer alternative.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight">Transference</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Shift the risk to another party (e.g., insurance, outsourcing).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">Mitigation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Reduce the likelihood or impact of the risk through controls,
                    training, or contingency plans.
                  </p>
                </div>
              </div>
            </div>

            {/* 11. Risk Register */}
            <div
              ref={(el) => {
                sectionRefs.current['risk-register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Risk Register
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A document listing all identified risks, their likelihood,
                impact, mitigation strategies, and risk owners.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Contents</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Risk ID</li>
                    <li>Risk description</li>
                    <li>Risk category</li>
                    <li>Likelihood</li>
                    <li>Impact</li>
                    <li>Mitigation strategy</li>
                    <li>Risk owner</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Tips</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Identify all risks</li>
                    <li>Assess likelihood and impact</li>
                    <li>Develop mitigation for high priority</li>
                    <li>Monitor and update regularly</li>
                    <li>Communicate to stakeholders</li>
                  </ul>
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
                  🔒 Security Tip
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
                  <span>Risk types</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">15+</span>
                </li>
                <li className="flex justify-between">
                  <span>Security principles</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">4+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Security is a continuous process. Regularly identify assets,
                assess risks, implement controls, and monitor for new threats.
                The CIA triad and least privilege are your guiding principles.
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
                <strong className="text-white">CIA Triad:</strong> Confidentiality,
                Integrity, Availability – the three pillars of information
                security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Least Privilege:</strong> Give
                users only the permissions they need – nothing more.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Defense in Depth:</strong> Use
                multiple layers of security controls for stronger protection.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Risk Management:</strong> Identify
                risks, assess impact, and choose a strategy: Accept, Avoid,
                Transfer, or Mitigate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Asset Inventory:</strong> Know what
                you have – use tools like Nmap to discover devices and services.
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

export default LearningOutcome1;