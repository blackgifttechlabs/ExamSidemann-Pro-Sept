import React, { useState, useEffect, useRef } from 'react';
import { CodeExample, FlowDiagram, TerminalOutput, ExampleBox, TopicIntro, BrowserFrame } from './WebDevExamples';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  SpellCheck,
  Globe,
  Code,
  Layout,
  Server,
  Database,
  Shield,
  BookOpen,
  Link,
  Zap,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Users,
  TrendingUp,
  Search,
  Wifi,
  HardDrive,
  Clock,
  DollarSign,
  Box,
  GitBranch,
  Terminal,
  BookOpen as BookOpenIcon,
  X as XIcon,
  Sparkles,
  Lightbulb,
  ChevronUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Eye,
  Target,
  ClipboardList,
  FileCode,
  FolderTree,
  UserCheck,
  GraduationCap,
  Calendar,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'industry-content', label: 'Industry Content' },
  { id: 'grammar-checks', label: 'Grammar Checks' },
  { id: 'builder-vs-coding', label: 'Builder vs Coding' },
  { id: 'web-tools', label: 'Web Tools' },
  { id: 'database-driven', label: 'Database-Driven' },
  { id: 'tech-docs', label: 'Tech Docs' },
  { id: 'user-docs', label: 'User Docs' },
  { id: 'api', label: 'API' },
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
export const LearningOutcome4: React.FC = () => {
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> LEARNING OUTCOME 4
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Industry Content, Tools &{' '}
            <span className="text-amber-300 font-bold italic">
              Technical Docs
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master industry‑specific content, grammar checks, website builders vs coding, web development tools, database‑driven sites, technical documentation, and APIs.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> Industry Content
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> Dev Tools
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <BookOpen size={14} className="inline mr-1" /> Tech Docs
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
                placeholder="Search for a concept, API, CMS, static vs dynamic..."
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
            {/* Section 1: Industry-Specific Content */}
            <div
              ref={(el) => {
                sectionRefs.current['industry-content'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Industry‑Specific Content
              </h2>

              <TopicIntro text={"Chicken Inn sells chicken and meals, so its website must talk about food, meal deals and branches, not about unrelated things. Writing for one type of business or reader is called industry-specific content. It shows you know the subject, and readers trust you more."} />

              <div className="pt-2">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Industry‑specific content is written for one kind of reader or business, for example farmers, doctors or students. It shows that you know the subject, gives readers what they care about, and makes them trust you.
                  </p>
</div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reasons for Producing Industry‑Specific Content</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
{[
                    'Relevance to target audience',
                    'Demonstrates expertise & authority',
                    'SEO benefits with niche keywords',
                    'Networking with professionals',
                    'Customer satisfaction & loyalty',
                  ].map((item) => (
<li key={item}><Lead text={item} /></li>
))}
</ol>
              </div>
            </div>

            {/* Section 2: Grammar and Spelling Checks */}
            <div
              ref={(el) => {
                sectionRefs.current['grammar-checks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Grammar &amp; Spelling Checks
              </h2>

              <TopicIntro text={"Imagine Chicken Inn's website saying \"Our chicken is the best quallity\". Visitors would think the company is careless. Checking your spelling and grammar makes the site look professional."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Grammatical and spelling errors detract from professionalism and credibility. Ensure your content is error‑free with these practices:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    { label: 'Proofread Carefully', desc: 'Read through content to identify mistakes.' },
                    { label: 'Use Checkers', desc: 'Built-in tools or dedicated software for errors.' },
                    { label: 'Hire an Editor', desc: 'Professional editing for important documents.' },
                    { label: 'Read Aloud', desc: 'Catch errors you might miss when reading silently.' },
                    { label: 'Seek Feedback', desc: 'Ask others to review your content.' },
                  ].map(({ label, desc }) => (
                    <li key={label}><strong>{label}:</strong> {desc}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 3: Website Builder vs Coding Yourself */}
            <div
              ref={(el) => {
                sectionRefs.current['builder-vs-coding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Builder vs Coding Yourself
              </h2>

              <TopicIntro text={"Chicken Inn can make a website in two ways: use a website builder like Wix, or write the code yourself. A builder is faster, and coding gives you more control. This section helps you choose."} />

              <div className="pt-2 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Website Builder</th>
                      <th className="border p-2 text-left font-bold">Coding Yourself</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Ease of Use', 'Simple and intuitive', 'Requires technical skills'],
                      ['Customization', 'Limited', 'Full control'],
                      ['Cost', 'Often free or subscription', 'Can be more expensive'],
                      ['Time', 'Faster development', 'Can take longer'],
                      ['Flexibility', 'Less flexible', 'Highly flexible'],
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Website Builder Pros</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Easy to use, no coding required</li>
                    <li>Cost‑effective (often free options)</li>
                    <li>Quick development time</li>
                    <li>User‑friendly visual interface</li>
                    <li>Built‑in features (forms, e‑commerce)</li>
                  </ul>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Website Builder Cons</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Limited customization</li>
                    <li>Vendor lock‑in</li>
                    <li>Performance limitations</li>
                    <li>Less control over code</li>
                    <li>Limited scalability</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Coding Yourself Pros</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Full control over design & functionality</li>
                    <li>Highly flexible and customizable</li>
                    <li>Scalable for complex projects</li>
                    <li>Cost‑effective in the long run</li>
                    <li>Valuable learning experience</li>
                  </ul>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Coding Yourself Cons</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Time‑consuming</li>
                    <li>Requires strong technical skills</li>
                    <li>Can be expensive with hired developers</li>
                    <li>Steeper learning curve</li>
                    <li>Potential for coding errors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Web Development Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['web-tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Development Tools
              </h2>

              <TopicIntro text={"A website is built with several tools. HTML makes the structure, CSS makes it look good, and JavaScript makes it interactive. This section explains the main ones and what each does."} />

              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { title: 'HTML', desc: 'Standard markup language for structuring web content.' },
                  { title: 'CSS', desc: 'Style sheet language for layout, design, and appearance.' },
                  { title: 'PHP', desc: 'Server-side scripting for dynamic web pages and databases.' },
                  { title: 'JavaScript', desc: 'Client-side language for interactive and dynamic features.' },
                  { title: 'WordPress', desc: 'Popular CMS for creating and managing websites.' },
                  { title: 'MySQL', desc: 'Open-source relational database management system.' },
                  { title: 'XAMPP', desc: 'Local development stack: Apache, MySQL, PHP, Perl.' },
                ].map(({ title, desc }) => (
                  <li key={title}><strong>{title}:</strong> {desc}</li>
))}
</ol>
              <ExampleBox>
<CodeExample
                title="Example: HTML, CSS and JavaScript Working Together"
                  language="markup"
                code={`<h1 id="msg">Hello</h1>
<style>
  h1 { color: green; }
</style>
<script>
  document.getElementById("msg")
    .innerText = "Welcome!";
</script>`}
                output={<BrowserFrame><h1 style={{ color: 'green', fontWeight: 700, fontSize: 24 }}>Welcome!</h1></BrowserFrame>}
                note="HTML creates the heading, CSS makes it green, and JavaScript changes the words from Hello to Welcome!"
              />
              <CodeExample
                title="Example: PHP and MySQL"
                  language="php"
                code={`<?php
$result = mysqli_query($db,
  "SELECT name FROM students");
while ($row = mysqli_fetch_assoc($result)) {
  echo $row["name"] . "<br>";
}
?>`}
                outputLabel="Output (in the browser)"
                output={<div>Tinashe<br />Rudo<br />Farai</div>}
                note="PHP asks MySQL for the student names, then prints each name on the page."
              />
</ExampleBox>
            </div>

            {/* Section 5: Database-Driven Websites */}
            <div
              ref={(el) => {
                sectionRefs.current['database-driven'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Database‑Driven Websites
              </h2>

              <TopicIntro text={"Chicken Inn's menu can be typed page by page, or stored in a database and shown automatically. A fixed website stays the same, and a database-driven website changes when the data changes. This section shows the difference."} />

              <div className="pt-2 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Static Websites</th>
                      <th className="border p-2 text-left font-bold">Dynamic Websites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Content Creation', 'Manually edited HTML', 'Managed through CMS'],
                      ['Content Updates', 'Manual HTML editing', 'Easy via CMS'],
                      ['Database', 'No database', 'Uses database'],
                      ['User Interaction', 'Limited', 'Interactive (forms, search)'],
                      ['Performance', 'Generally faster', 'May need more server resources'],
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Benefits</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Flexibility – easy content updates</li>
                    <li>Scalability – handle large data & traffic</li>
                    <li>Personalization – tailored content</li>
                    <li>Interactivity – user accounts, comments</li>
                    <li>Search functionality</li>
                    <li>E‑commerce capabilities</li>
                    <li>SEO benefits</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Problems</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>More complex to develop & maintain</li>
                    <li>Requires more server resources</li>
                    <li>Security vulnerabilities</li>
                    <li>Higher development & hosting costs</li>
                    <li>Technical skills required</li>
                    <li>Dependency on database availability</li>
                    <li>Potentially slower load times</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Technical Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['tech-docs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Technical Documentation
              </h2>

              <TopicIntro text={"After building a system, the developers write down how it works. This is technical documentation. When a new developer joins Chicken Inn's team, they can read it and understand the system quickly."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Technical documentation explains how a product, system, or service works. It serves as a reference for users, developers, and support staff.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">8 Reasons It Matters</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
{['User Education: Teaches users how to use the product.', 'Problem Solving: Helps users fix problems themselves.', 'Support Efficiency: Fewer questions for the support team.', 'Training Resource: Used to train new people.', 'Knowledge Transfer: Passes knowledge to others.', 'Compliance: Meets rules and standards.', 'Legal Protection: Shows what was promised.', 'Development Efficiency: Helps developers work faster.'].map((item) => (
<li key={item}><Lead text={item} /></li>
))}
</ol>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Key Components</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Introduction: Explains what the document is about.', 'Scope: Says what is and is not covered.', 'Glossary: Explains difficult words.', 'User Guides: Steps for using the product.', 'Reference Manuals: Detailed facts and technical details.', 'Installation Guides: Steps to install the product.', 'Troubleshooting Guides: Help for fixing common problems.', 'Appendices: Extra information at the end.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 7: User Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['user-docs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                User Documentation
              </h2>

              <TopicIntro text={"When you buy a new phone, you get a small guide on how to use it. A website or system needs the same thing. User documentation shows users what to do step by step, so they do not need to ask for help."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  User documentation provides instructions and guidance for end‑users of a product or system, helping them achieve their desired outcomes.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">8 Reasons It Matters</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
{['User Education: Users learn how things work.', 'Independent Problem Solving: Users solve problems alone.', 'Reduced Support Burden: Less work for support staff.', 'Increased User Satisfaction: Users are happier.', 'Compliance: Meets required standards.', 'Legal Protection: Helps in legal matters.', 'Product Adoption: More people use the product.', 'Knowledge Transfer: Knowledge is easy to share.'].map((item) => (
<li key={item}><Lead text={item} /></li>
))}
</ol>
              </div>
            </div>

            {/* Section 8: API */}
            <div
              ref={(el) => {
                sectionRefs.current['api'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                API (Application Programming Interface)
              </h2>

              <TopicIntro text={"When Chicken Inn's website shows the nearest branch using a map service, the two programs must talk to each other. An API is the set of rules that lets them do this. It is like a waiter who takes your order to the kitchen and brings the food back."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  An API is a set of rules and protocols that allow different software applications to communicate and interact. It acts as an intermediary for requesting services from another system.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">How to Interface with an API</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Authentication:</span> Provide credentials (API keys, tokens) to verify identity.</li>
                  <li><span className="font-bold">Making Requests:</span> Construct HTTP requests to the API endpoint.</li>
                  <li><span className="font-bold">Handling Responses:</span> Receive and interpret the API's response (data, errors).</li>
                  <li><span className="font-bold">Error Handling:</span> Implement mechanisms to handle errors or exceptions.</li>
                </ul>
                <div className="pt-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Example:</span> Using the Twitter API requires obtaining API keys, constructing requests to endpoints, and parsing JSON responses.
                  </p>
                </div>
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
                <strong className="text-slate-900 dark:text-white">Industry Content</strong> – builds authority, improves SEO, and engages the target audience with relevant information.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Grammar Checks</strong> – proofreading, tools, and feedback ensure professional, error‑free content.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Website Builder vs Coding</strong> – builders offer simplicity and speed; coding offers control and flexibility. Choose based on project needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Web Stack</strong> – HTML (structure), CSS (style), PHP (server), JavaScript (client), MySQL (database), XAMPP (local dev).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Documentation &amp; APIs</strong> – technical docs support developers; user docs help end‑users; APIs enable integration between applications.
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
            Sidemann Academic Registry • Industry Content &amp; Technical Docs 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;