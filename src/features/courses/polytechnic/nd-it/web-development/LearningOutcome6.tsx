import React, { useState, useEffect, useRef } from 'react';
import { TopicIntro } from './WebDevExamples';
import { useLessonState } from '../../../lessonProgress';
import {
  Globe,
  CheckCircle,
  Server,
  Cloud,
  Upload,
  Search,
  BarChart3,
  Link,
  Smartphone,
  Zap,
  Users,
  ClipboardList,
  Rocket,
  Mail,
  Lock,
  TrendingUp,
  Eye,
  MousePointer,
  FileText,
  Share2,
  Activity,
  Clock,
  BookOpen,
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
  Settings,
  Link as LinkIcon,
  Mail as MailIcon,
  Lock as LockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'domain-hosting', label: 'Domain & Hosting' },
  { id: 'upload', label: 'Website Upload' },
  { id: 'search-engines', label: 'Search Engines' },
  { id: 'seo-basics', label: 'SEO Basics' },
  { id: 'on-off-page-seo', label: 'On vs Off Page' },
  { id: 'web-optimization', label: 'Web Optimization' },
  { id: 'post-launch-checklist', label: 'Post-Launch Checklist' },
  { id: 'post-launch-techniques', label: 'Post-Launch Techniques' },
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
export const LearningOutcome6: React.FC = () => {
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Globe size={14} className="inline mr-1" /> LEARNING OUTCOME 6
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Domain, Hosting, SEO &{' '}
            <span className="text-cyan-300 font-bold italic">
              Post‑Launch
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master domain registration, web hosting, website upload, search engine interaction, SEO best practices, optimization tools, and post‑launch checklists.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Globe size={14} className="inline mr-1" /> Domain &amp; Hosting
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> SEO
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Rocket size={14} className="inline mr-1" /> Post‑Launch
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
                placeholder="Search for a concept, SEO, hosting..."
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
            {/* Section 1: Domain & Hosting */}
            <div
              ref={(el) => {
                sectionRefs.current['domain-hosting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Domain Registration &amp; Web Hosting
              </h2>

              <TopicIntro text={"For people to visit Chicken Inn's website, it needs an address like chickeninn.com, which is the domain. It also needs a place on the internet to store its files, which is the hosting. Without both, no one can see the site."} />

              <div className="pt-2">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A domain name is your website's unique address on the internet. Web hosting is the service that makes your website accessible online.
                  </p>
</div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Domain Registration Steps</h3>
                <ul className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Choose a Domain Name:</span> Memorable, relevant, available.</li>
                  <li><span className="font-bold">Check Availability:</span> Use a domain registrar's search tool.</li>
                  <li><span className="font-bold">Select a Registrar:</span> Reputable, offers desired extension (.com, .org).</li>
                  <li><span className="font-bold">Complete Registration:</span> Provide info, choose payment, agree to terms.</li>
                  <li><span className="font-bold">Manage Your Domain:</span> Renew, update contact info, configure DNS.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Types of Web Hosting</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    { label: 'Shared Hosting', desc: 'Most affordable, shares server resources.' },
                    { label: 'VPS', desc: 'Virtual Private Server – more resources and control.' },
                    { label: 'Dedicated Hosting', desc: 'Exclusive server resources, highest performance.' },
                    { label: 'Cloud Hosting', desc: 'Scalable, uses multiple servers for load balancing.' },
                  ].map(({ label, desc }) => (
                    <li key={label}><strong>{label}:</strong> {desc}</li>
                  ))}
                </ol>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Factors for Selecting a Web Host</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Reliability: The site stays online.', 'Speed: Pages load fast.', 'Scalability: Can handle more visitors later.', 'Customer Support: Help is available when needed.', 'Features: Has the tools you need.', 'Cost: Fits your budget.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 2: Website Upload */}
            <div
              ref={(el) => {
                sectionRefs.current['upload'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Uploading a Website
              </h2>

              <TopicIntro text={"After building Chicken Inn's website on your own computer, nobody else can see it yet. Uploading puts the files on the hosting server, so everyone can visit the site. This step makes the website live."} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Factors to Consider</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Website Size:</span> Large sites take longer to upload.</li>
                    <li><span className="font-bold">File Format:</span> Ensure compatible formats (HTML, CSS, JS, images).</li>
                    <li><span className="font-bold">FTP Access:</span> Need credentials from hosting provider.</li>
                    <li><span className="font-bold">File Permissions:</span> Set correctly for proper function.</li>
                    <li><span className="font-bold">Backup:</span> Create backup before uploading.</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Methods</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">FTP:</span> Using FileZilla or Cyberduck.</li>
                    <li><span className="font-bold">Control Panel:</span> Web‑based interface from host.</li>
                    <li><span className="font-bold">Version Control:</span> Git deployment.</li>
                    <li><span className="font-bold">Deployment Tools:</span> Capistrano, DeployHQ.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Search Engines */}
            <div
              ref={(el) => {
                sectionRefs.current['search-engines'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Search Engines
              </h2>

              <TopicIntro text={"When someone is hungry, they type \"chicken near me\" into Google. A search engine is a website like Google that finds pages for them. Most visitors reach a website this way."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  People use search engines to find information, products, or services. Search engines crawl, index, and rank billions of pages.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Examples of Search Engines</h4>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'Google', logo: 'google.png', note: 'The most used search engine in the world.' },
                    { name: 'Bing', logo: 'bing.svg', note: 'Made by Microsoft. Built into Windows and Edge.' },
                    { name: 'DuckDuckGo', logo: 'duckduckgo.png', note: 'Focuses on privacy. Does not track you.' },
                    { name: 'Yahoo', logo: 'yahoo.png', note: 'One of the oldest. Results are powered by Bing.' },
                    { name: 'Baidu', logo: 'baidu.png', note: 'The main search engine in China.' },
                    { name: 'Yandex', logo: 'yandex.png', note: 'The main search engine in Russia.' },
                  ].map(se => (
                    <div key={se.name} className="flex flex-col items-center text-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1a1a]">
                      <img
                        src={`/images/courses/nd-it/web-development/search-engines/${se.logo}`}
                        alt={`${se.name} logo`}
                        className="w-14 h-14 object-contain"
                        loading="lazy"
                      />
                      <span className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{se.name}</span>
                      <span className="mt-1 text-xs text-slate-600 dark:text-slate-400">{se.note}</span>
                    </div>
                  ))}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">How Search Engines Work</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Crawl:</span> Discover web pages via links.</li>
                  <li><span className="font-bold">Index:</span> Store and organise page content.</li>
                  <li><span className="font-bold">Rank:</span> Order results by relevance using algorithms.</li>
                </ul>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">Ranking Factors</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Keyword Relevance: Use words people search for.', 'Backlinks: Other sites link to yours.', 'Content Quality: Useful, original content.', 'Page Structure: Clear headings and clean code.', 'User Experience: Easy and pleasant to use.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 4: SEO Basics */}
            <div
              ref={(el) => {
                sectionRefs.current['seo-basics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                SEO &amp; Web Design Best Practices
              </h2>

              <TopicIntro text={"If Chicken Inn's website is on page 10 of Google, nobody will find it. SEO (Search Engine Optimization) is how you move it higher. These practices help your website rank higher and be easier to use."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  SEO (Search Engine Optimization) improves a website's visibility in search engine results.
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    { icon: <Search size={14} />, label: 'Keyword Research', desc: 'Identify what your audience searches for.' },
                    { icon: <FileText size={14} />, label: 'On-Page Optimization', desc: 'Optimise content, structure, and HTML.' },
                    { icon: <LinkIcon size={14} />, label: 'Backlink Building', desc: 'Acquire high-quality links from reputable sites.' },
                    { icon: <Smartphone size={14} />, label: 'Mobile Optimization', desc: 'Ensure mobile-friendly experience.' },
                    { icon: <Zap size={14} />, label: 'Page Speed', desc: 'Optimise loading speed.' },
                    { icon: <Users size={14} />, label: 'User Experience', desc: 'Easy navigation and positive experience.' },
                    { icon: <FileText size={14} />, label: 'Content Quality', desc: 'Informative, engaging, and relevant content.' },
                    { icon: <Share2 size={14} />, label: 'Social Media', desc: 'Promote to increase visibility and traffic.' },
                  ].map(({ label, desc }) => (
                    <li key={label}><strong>{label}:</strong> {desc}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 5: On-Page vs Off-Page SEO */}
            <div
              ref={(el) => {
                sectionRefs.current['on-off-page-seo'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                On‑Page vs Off‑Page SEO
              </h2>

              <TopicIntro text={"To rank higher on Google, Chicken Inn can improve its own pages and also get other websites to link to it. The first is on-page SEO, and the second is off-page SEO. You need both to get good results."} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">On‑Page SEO</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Optimising elements you control directly.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Keyword Optimisation</li>
                    <li>Content Quality</li>
                    <li>Page Structure</li>
                    <li>Image Optimisation</li>
                    <li>Internal Linking</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Off‑Page SEO</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Improving ranking through external factors.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Backlink Building</li>
                    <li>Social Media Marketing</li>
                    <li>Local SEO</li>
                    <li>Citation Building</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Web Optimization */}
            <div
              ref={(el) => {
                sectionRefs.current['web-optimization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Web Optimization &amp; SEO
              </h2>

              <TopicIntro text={"A slow or hard-to-find website loses visitors. Web optimisation means making the site fast, easy to use and easy to find on Google. This helps Chicken Inn keep its visitors."} />

              <div className="pt-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold">Web optimisation</span> improves performance, UX, and search visibility. <span className="font-bold">SEO</span> is a subset focused on search rankings.
                </p>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">8 Reasons Web Optimisation Matters</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Better UX: Visitors enjoy using the site.', 'Higher Rankings: Appear higher in search results.', 'Increased Visibility: More people find the site.', 'Better Conversions: More visitors become customers.', 'Enhanced Brand: People trust and remember you.', 'Cost-Effective: Cheaper than many ads.', 'Competitive Edge: Beat other sites in your field.', 'Long-Term Benefits: Results last for a long time.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">7 Web Optimization Tools</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Google Search Console: Shows how Google sees your site.', 'Google Analytics: Shows who visits your site.', 'SEMrush: Finds keywords and checks competitors.', 'Moz: Tools for ranking and links.', 'Ahrefs: Checks backlinks and keywords.', 'Yoast SEO: A WordPress plugin for SEO.', 'GTmetrix: Tests how fast your pages load.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">8 Optimization Strategies</h4>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {['Keyword Research: Find what people search for.', 'On-Page: Improve each page\'s content and tags.', 'Backlink Building: Get links from other sites.', 'Mobile Optimization: Make the site work well on phones.', 'Page Speed: Make pages load quickly.', 'UX: Make the site easy to use.', 'Content Marketing: Share useful content to attract visitors.', 'Social Media: Promote the site on social networks.'].map(item => (
                    <li key={item}><Lead text={item} /></li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 7: Post-Launch Checklist */}
            <div
              ref={(el) => {
                sectionRefs.current['post-launch-checklist'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Post‑Launch Checklist
              </h2>

              <TopicIntro text={"The day Chicken Inn's website goes live is not the end of the work. You must check that everything still works and that real visitors are happy. This post-launch checklist lists what to check after launch."} />

              <div className="pt-2">
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    { icon: <FileText size={14} />, label: 'Content Review', desc: 'Verify accuracy and completeness.' },
                    { icon: <CheckCircle size={14} />, label: 'Functionality Testing', desc: 'Ensure all features work.' },
                    { icon: <Users size={14} />, label: 'Usability Testing', desc: 'Evaluate ease of navigation.' },
                    { icon: <Zap size={14} />, label: 'Performance Testing', desc: 'Measure speed and responsiveness.' },
                    { icon: <Lock size={14} />, label: 'Security Testing', desc: 'Identify vulnerabilities.' },
                    { icon: <BarChart3 size={14} />, label: 'Analytics Setup', desc: 'Implement tracking tools.' },
                    { icon: <Mail size={14} />, label: 'Feedback Collection', desc: 'Gather user and stakeholder feedback.' },
                  ].map(({ label, desc }) => (
                    <li key={label}><strong>{label}:</strong> {desc}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Section 8: Post-Launch Techniques */}
            <div
              ref={(el) => {
                sectionRefs.current['post-launch-techniques'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Website Post‑Launch Techniques
              </h2>

              <TopicIntro text={"After Chicken Inn's website is live, you can learn from real visitors. For example, you can test two button colours to see which gets more orders. These post-launch techniques help you keep improving the site."} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'A/B Testing', desc: 'Experiment with layouts, content, and CTAs to find the most effective versions.' },
                  { title: 'Heatmap Analysis', desc: 'Visualise user behaviour to identify popular and underused areas.' },
                  { title: 'User Surveys', desc: 'Gather feedback directly from website visitors.' },
                  { title: 'User Interviews', desc: 'Deep insights into user experiences and pain points.' },
                  { title: 'Usability Testing', desc: 'Observe users interacting with the site to find issues.' },
                  { title: 'Conversion Rate Optimisation', desc: 'Optimise to increase sign-ups, purchases, or submissions.' },
                  { title: 'Continuous Monitoring', desc: 'Track performance and user behaviour over time.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="pt-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                  </div>
                ))}
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
                <strong className="text-slate-900 dark:text-white">Domain &amp; Hosting</strong> – choose a memorable domain and reliable hosting (shared, VPS, dedicated, or cloud) based on your needs and budget.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Website Upload</strong> – use FTP, control panel, version control, or deployment tools; always backup files before uploading.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">SEO</strong> – on-page (content, structure, keywords) and off-page (backlinks, social media) both matter for search rankings.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Web Optimisation</strong> – use tools like Google Search Console, Analytics, SEMrush, and GTmetrix to improve performance and visibility.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>
                <strong className="text-slate-900 dark:text-white">Post‑Launch</strong> – conduct checklist items (testing, analytics, feedback) and use techniques (A/B testing, heatmaps, CRO) for continuous improvement.
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
            Sidemann Academic Registry • Domain, Hosting &amp; SEO 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;