import React, { useState, useEffect, useRef } from 'react';
import { TopicIntro } from './WebDevExamples';
import { useLessonState } from '../../../lessonProgress';
import {
  Shield,
  Bug,
  Settings,
  AlertTriangle,
  Database,
  FileText,
  BarChart3,
  Lock,
  Key,
  Server,
  Cloud,
  Wifi,
  HardDrive,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  ChevronUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Target,
  FolderTree,
  UserCheck,
  GraduationCap,
  Calendar,
  DollarSign,
  Briefcase,
  Menu,
  MousePointer as MousePointerIcon,
  Touchpad,
  Grid3X3,
  Palette,
  Settings as SettingsIcon,
  Link,
  Mail,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'maintenance-vs-bugfixing', label: 'Maintenance vs Bug Fixing' },
  { id: 'maintenance-categories', label: 'Maintenance Categories' },
  { id: 'content-management', label: 'Content Management' },
  { id: 'security', label: 'Security' },
  { id: 'web-analysis', label: 'Web Analysis' },
];

// Bolds the lead word of "Point: explanation" list items
const Lead: React.FC<{ text: string }> = ({ text }) => {
  const m = text.match(/^(.+?)(: | – )(.*)$/);
  if (!m) return <>{text}</>;
  return m[2] === ': ' ? (
    <><strong>{m[1]}:</strong> {m[3]}</>
  ) : (
    <><strong>{m[1]}</strong> – {m[3]}</>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
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

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Shield size={14} className="inline mr-1" /> LEARNING OUTCOME 7
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Maintenance, Security &{' '}
            <span className="text-indigo-300 font-bold italic">
              Web Analysis
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master maintenance vs bug fixing, content management, security threats and measures, web analysis reports, and CMS evaluation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Settings size={14} className="inline mr-1" /> Maintenance
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Security
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BarChart3 size={14} className="inline mr-1" /> Web Analysis
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
                placeholder="Search for a concept, security, maintenance..."
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
                  <XIcon size={18} className="text-slate-400" />
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
        <div>
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Section 1: Maintenance vs Bug Fixing */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-vs-bugfixing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintenance vs Bug Fixing
              </h2>

              <TopicIntro text={"Imagine Chicken Inn's Order button stops working. Fixing it is bug fixing. Keeping the whole site updated and healthy is maintenance. They are different jobs, and a good team plans for both."} />

              <div className="pt-2">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintenance and bug fixing are often confused, but they are distinct activities. Maintenance is broader and includes updates, enhancements, and proactive measures, while bug fixing is reactive and specific to defects.
                  </p>
</div>

              <div className="pt-2 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Maintenance</th>
                      <th className="border p-2 text-left font-bold">Bug Fixing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Purpose', 'Ensure functionality, security, and up‑to‑date', 'Identify and correct errors'],
                      ['Scope', 'Updates, enhancements, optimizations', 'Focused on specific issues'],
                      ['Frequency', 'Regular and ongoing', 'Triggered by reported bugs'],
                      ['Proactive/Reactive', 'Can be proactive', 'Reactive'],
                      ['Impact', 'May affect overall performance', 'Localized impact'],
                      ['Timeline', 'Often planned and scheduled', 'Can be urgent'],
                      ['Resources', 'May require additional resources', 'Often fewer resources'],
                      ['Risk', 'Can introduce new bugs', 'Helps prevent future problems'],
                      ['Benefits', 'Improves performance, security, UX', 'Ensures correct function'],
                    ].map((item, idx) => (
                      <tr key={item[0]} className={rowBg(idx)}>
                        <td className="border p-2 font-bold">{item[0]}</td>
                        <td className="border p-2">{item[1]}</td>
                        <td className="border p-2">{item[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Maintenance Categories */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance-categories'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Categories of Web Application Maintenance
              </h2>

              <TopicIntro text={"Websites need different kinds of care. Some work fixes errors, some adapts the site to changes, and some makes it faster. These are the categories of maintenance. Knowing them helps you plan the right work."} />

              <div className="pt-2">
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
{[
                    'Corrective – Fixing bugs and errors',
                    'Adaptive – Modifying for environmental changes',
                    'Perfective – Enhancing performance and UX',
                    'Preventive – Proactive measures to prevent issues',
                    'Emergency – Addressing critical issues urgently',
                    'Evolutionary – Meeting changing user/business needs',
                    'Disaster Recovery – Planning for availability disasters',
                    'Technical Debt – Addressing accumulated technical issues',
                  ].map((item) => (
<li key={item}><Lead text={item} /></li>
))}
</ol>
                <div className="pt-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Memory Trick:</span> "CAPE" – Corrective, Adaptive, Perfective, Emergency. Plus Preventive, Evolutionary, Disaster Recovery, Technical Debt.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Content Management */}
            <div
              ref={(el) => {
                sectionRefs.current['content-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Content Management
              </h2>

              <TopicIntro text={"When Chicken Inn launches a new meal deal, someone must add the photo and price to the site. Doing this, and keeping old content correct, is web content management. A CMS helps by making it simple."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Web content management is the process of creating, editing, and updating content on a website. A CMS streamlines this process.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">8 Popular CMS Platforms</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['WordPress: The most popular CMS, good for blogs and business sites.', 'Joomla: A flexible CMS for larger sites.', 'Drupal: A powerful CMS for complex sites.', 'Squarespace: A simple builder with nice templates.', 'Wix: A drag-and-drop website builder.', 'Weebly: An easy builder for small sites.', 'Kentico: A CMS used by big companies.', 'Sitecore: An enterprise CMS for large organisations.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Evaluation Factors</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Ease of Use: Simple enough for beginners.', 'Features: Has what your site needs.', 'Customisation: You can change the look and function.', 'Scalability: Can grow with your site.', 'Community Support: Others can help when you are stuck.', 'Cost: Fits your budget.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 4: Security */}
            <div
              ref={(el) => {
                sectionRefs.current['security'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Security Threats &amp; Measures
              </h2>

              <TopicIntro text={"Hackers can attack Chicken Inn's website to steal customer details or break the site. This section lists the main dangers and how to protect against them. A hacked site loses money and trust."} />

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">8 Threats</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Injection Attacks:</span> SQL injection, XSS.</li>
                  <li><span className="font-bold">Cross-Site Request Forgery (CSRF):</span> Unwanted actions on trusted sites.</li>
                  <li><span className="font-bold">Session Hijacking:</span> Stealing session IDs.</li>
                  <li><span className="font-bold">Phishing:</span> Tricking users into revealing sensitive info.</li>
                  <li><span className="font-bold">Denial of Service (DoS):</span> Overwhelming a website with traffic.</li>
                  <li><span className="font-bold">Malware:</span> Malicious software infecting the site.</li>
                  <li><span className="font-bold">Weak Passwords:</span> Easily guessable credentials.</li>
                  <li><span className="font-bold">Unpatched Vulnerabilities:</span> Outdated software/plugins.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">8 Security Measures</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Strong Passwords:</span> Enforce complexity and 2FA.</li>
                  <li><span className="font-bold">TLS/SSL:</span> Encrypt data in transit.</li>
                  <li><span className="font-bold">Regular Updates:</span> Keep software and plugins current.</li>
                  <li><span className="font-bold">Input Validation:</span> Prevent injection attacks.</li>
                  <li><span className="font-bold">Security Headers:</span> HSTS, CSP, etc.</li>
                  <li><span className="font-bold">Firewall:</span> Protect from unauthorized access.</li>
                  <li><span className="font-bold">Web Application Firewall (WAF):</span> Detect and block attacks.</li>
                  <li><span className="font-bold">Security Audits:</span> Regular vulnerability assessments.</li>
                </ul>
              </div>
            </div>

            {/* Section 5: Web Analysis Report */}
            <div
              ref={(el) => {
                sectionRefs.current['web-analysis'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Analysis Report
              </h2>

              <TopicIntro text={"After some months, Chicken Inn's manager will ask how the website is doing. A web analysis report answers this with facts, like how many people visited and what to improve."} />

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Outline</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Executive Summary:</span> Key findings and recommendations.</li>
                  <li><span className="font-bold">Project Objectives:</span> Goals of the analysis.</li>
                  <li><span className="font-bold">Methodology:</span> Tools and methods used.</li>
                  <li><span className="font-bold">Data Collection:</span> Traffic, behavior, conversions.</li>
                  <li><span className="font-bold">Key Performance Indicators (KPIs):</span> Metrics measured.</li>
                  <li><span className="font-bold">Data Analysis:</span> Trends, patterns, insights.</li>
                  <li><span className="font-bold">Findings:</span> Summary of key findings.</li>
                  <li><span className="font-bold">Recommendations:</span> Improvements based on analysis.</li>
                  <li><span className="font-bold">Appendix:</span> Supporting materials.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Procedure for Producing a Report</h3>
                <ul className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Define Objectives:</span> Clearly state goals and questions.</li>
                  <li><span className="font-bold">Collect Data:</span> Gather from analytics, surveys, search console.</li>
                  <li><span className="font-bold">Analyze Data:</span> Identify trends and patterns.</li>
                  <li><span className="font-bold">Interpret Findings:</span> Draw meaningful conclusions.</li>
                  <li><span className="font-bold">Develop Recommendations:</span> Actionable improvements.</li>
                  <li><span className="font-bold">Prepare Report:</span> Structured and clear.</li>
                  <li><span className="font-bold">Present Report:</span> Communicate to stakeholders.</li>
                </ul>
              </div>
            </div>
          </div>
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
        <div className="mt-8 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Key Takeaways</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Maintenance vs Bug Fixing</strong> – Maintenance is proactive and broad; bug fixing is reactive and specific to defects.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Maintenance Categories</strong> – Corrective, Adaptive, Perfective, Preventive, Emergency, Evolutionary, Disaster Recovery, Technical Debt.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">CMS Evaluation</strong> – Consider ease of use, features, customisation, scalability, community support, and cost.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Security</strong> – 8 threats (injection, CSRF, phishing, etc.) and 8 measures (strong passwords, TLS/SSL, updates, WAF, audits, etc.).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Web Analysis Report</strong> – Includes executive summary, methodology, data analysis, findings, and recommendations. Follow a structured procedure to produce it.
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
            Sidemann Academic Registry • Maintenance, Security &amp; Web Analysis 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;