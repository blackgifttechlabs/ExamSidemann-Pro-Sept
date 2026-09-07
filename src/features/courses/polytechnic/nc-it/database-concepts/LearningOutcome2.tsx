import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  Layers,
  HardDrive,
  CheckCircle,
  Info,
  Zap,
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
  Users,
  BarChart3,
  Code,
  Clock,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// NAVIGATION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Overview' },
  { id: 'user-types', label: 'User Types' },
  { id: 'user-needs', label: 'User Needs' },
  { id: 'identifying-needs', label: 'Identifying Needs' },
  { id: 'hardware-specs', label: 'Hardware Specs' },
  { id: 'computer-hardware', label: 'Computer Hardware' },
  { id: 'storage-types', label: 'Storage Types' },
  { id: 'evaluating-hw', label: 'Evaluating HW' },
  { id: 'spec-doc', label: 'Spec Document' },
  { id: 'requirements-compare', label: 'Requirements Compare' },
  { id: 'system-requirements', label: 'System Requirements' },
  { id: 'rsd-structure', label: 'RSD Structure' },
  { id: 'ip-protections', label: 'IP Protections' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
      { title: 'Database Fact', text: 'The first database management system, Integrated Data Store (IDS), was developed in the 1960s by Charles Bachman.' },
      { title: 'User Needs', text: 'Always involve end‑users in the requirements gathering process – they are the ones who will use the system daily.' },
      { title: 'Hardware Tip', text: 'When planning hardware for a database, consider both current needs and future growth – scalability is key.' },
      { title: 'Security', text: 'Encryption at rest and in transit is a must for protecting sensitive data in any database system.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Database Fact', text: 'The first database management system, Integrated Data Store (IDS), was developed in the 1960s by Charles Bachman.' },
      { title: 'User Needs', text: 'Always involve end‑users in the requirements gathering process – they are the ones who will use the system daily.' },
      { title: 'Hardware Tip', text: 'When planning hardware for a database, consider both current needs and future growth – scalability is key.' },
      { title: 'Security', text: 'Encryption at rest and in transit is a must for protecting sensitive data in any database system.' },
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Database size={14} className="inline mr-1" /> DATABASE CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              User &amp; Hardware Planning
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master database user analysis, hardware specifications, requirements
            documentation, and intellectual property protections. Learn how to
            design systems that meet real‑world needs.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ User &amp; hardware focus
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Practical
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
                placeholder="Search for a database concept..."
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
                  <X size={18} className="text-orange-200" />
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
              <div className="flex items-center gap-3 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  This outcome covers the essential steps of database planning:
                  understanding user needs, defining hardware specifications,
                  creating requirements documents, and protecting intellectual
                  property. All content is presented in clear, structured notes.
                </p>
              </div>
            </div>

            {/* 1. Types of Database Users */}
            <div
              ref={(el) => {
                sectionRefs.current['user-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Database Users
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                There are two main types of database users:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Internal users</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Employees of the organization who use the database to perform their jobs.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">External users</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Customers, suppliers, and other stakeholders who use the database to interact with the organization.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Needs of Different Database Users */}
            <div
              ref={(el) => {
                sectionRefs.current['user-needs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Needs of Different Database Users
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The needs of database users vary depending on their role and
                responsibilities. Some common needs include:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Access to data', d: 'Ability to read, write, and update data.' },
                  { t: 'Data integrity', d: 'Trust that data is accurate and complete.' },
                  { t: 'Data security', d: 'Confidence that data is protected from unauthorised access.' },
                  { t: 'Performance', d: 'Quick and efficient access to data.' },
                  { t: 'Ease of use', d: 'Easy to use even for non‑technical users.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {item.t}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Internal Users</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Access data for operational tasks.</li>
                    <li>Data for reporting and analysis.</li>
                    <li>Data for decision‑making.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">External Users</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Access to product/service information.</li>
                    <li>Ability to place orders and manage accounts.</li>
                    <li>Access to customer support.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Identifying Database User Needs */}
            <div
              ref={(el) => {
                sectionRefs.current['identifying-needs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying Database User Needs
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The first step in designing a database is to identify the needs
                of the users. This can be done through interviews, surveys, and
                focus groups.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Talk to the users', d: 'Ask them what data they need, what reports they generate, and what decisions they make.' },
                  { t: 'Observe the users', d: 'Watch how they currently use data and identify pain points.' },
                  { t: 'Analyse workflows', d: 'Map out the data and functionality needed at each stage of their work.' },
                  { t: 'Use surveys', d: 'Collect quantitative data on user needs and priorities.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{item.t}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Hardware Specifications */}
            <div
              ref={(el) => {
                sectionRefs.current['hardware-specs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Hardware Specifications
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Hardware specifications define the technical requirements for
                the computer hardware needed to run a database system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {[
                  { t: 'CPU', d: 'Central processing unit – speed and cores matter.', icon: Cpu },
                  { t: 'Memory', d: 'RAM size depends on database size and complexity.', icon: Layers },
                  { t: 'Storage', d: 'HDD, SSD, or NAS – capacity and speed.', icon: HardDrive },
                  { t: 'Networking', d: 'Routers, switches, firewalls for multi‑user access.', icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
                    <item.icon className="mx-auto text-orange-500 mb-2" size={24} />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{item.t}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Computer Hardware */}
            <div
              ref={(el) => {
                sectionRefs.current['computer-hardware'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Computer Hardware
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Computer hardware can be divided into two main categories:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">Input devices</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Used to provide input to the computer – keyboards, mice, scanners.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">Output devices</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Used to display or print output – monitors, printers, speakers.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Different Types of Storage */}
            <div
              ref={(el) => {
                sectionRefs.current['storage-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Different Types of Storage
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight">Primary storage</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Volatile – loses contents when powered off. Includes RAM and CPU cache.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Secondary storage</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    Non‑volatile – retains contents. Includes HDDs, SSDs, NAS devices.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Evaluating Hardware Requirements */}
            <div
              ref={(el) => {
                sectionRefs.current['evaluating-hw'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating Hardware Requirements
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When evaluating hardware for a database system, consider:
              </p>
              <div className="space-y-3 mt-4">
                {[
                  { t: 'Size of the database', d: 'Larger databases require more powerful hardware.' },
                  { t: 'Number of users', d: 'More concurrent users need more resources.' },
                  { t: 'Type of transactions', d: 'OLTP systems need more power than data warehousing.' },
                  { t: 'Availability requirements', d: '24/7 systems need redundancy and high‑end hardware.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{item.t}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Example of a Specifications Document */}
            <div
              ref={(el) => {
                sectionRefs.current['spec-doc'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Example of a Specifications Document
              </h2>
              <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="font-bold text-slate-900 dark:text-white uppercase">Product Name: Database System</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Version: 1.0</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Date: 2023-11-02</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Objective</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    The database system should store and manage large amounts of data efficiently and reliably, supporting insert, update, query, and delete operations.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Scope</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Covers functional requirements, non‑functional requirements, system architecture, security, and testing.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Functional Requirements</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                      <li>Data storage and management</li>
                      <li>CRUD operations</li>
                      <li>ACID transactions</li>
                      <li>Concurrency control</li>
                      <li>Backup and recovery</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Non‑Functional Requirements</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-1 space-y-1">
                      <li>Performance (high volume)</li>
                      <li>Scalability (growing data/users)</li>
                      <li>Availability (high uptime)</li>
                      <li>Security (protection)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">System Architecture</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Three‑tier: Presentation, Application, Database layers.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Security Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Authentication, authorisation, encryption, audit logging.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Testing Requirements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Unit, integration, system, and acceptance testing.</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Conclusion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">System must meet all requirements and pass testing before deployment.</p>
                </div>
              </div>
            </div>

            {/* 9. User Requirements vs System Requirements (table) */}
            <div
              ref={(el) => {
                sectionRefs.current['requirements-compare'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                User vs. System Requirements
              </h2>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">Characteristic</th>
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">User Requirements</th>
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">System Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { c: 'Definition', u: 'Statements about what the user needs the system to do.', s: 'Specifications for how the system should be built.' },
                      { c: 'Focus', u: 'On the user\'s needs and wants.', s: 'On the technical aspects of the system.' },
                      { c: 'Audience', u: 'Business users, stakeholders.', s: 'Software developers, technical professionals.' },
                      { c: 'Language', u: 'Natural language.', s: 'Technical language.' },
                      { c: 'Level of detail', u: 'Abstract and high‑level.', s: 'Detailed and specific.' },
                      { c: 'Outcome vs. implementation', u: 'Desired outcome or functionality.', s: 'How the system will achieve that outcome.' },
                      { c: 'Subjectivity vs. objectivity', u: 'Subjective – reflects needs/wants.', s: 'Objective – can be verified/falsified.' },
                      { c: 'Changeability', u: 'Can change frequently.', s: 'More stable; should not change often.' },
                      { c: 'Verifiability', u: 'Verified by observing interaction.', s: 'Verified by testing the system.' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{row.c}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.u}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10. System Requirements (Security, Performance, etc.) */}
            <div
              ref={(el) => {
                sectionRefs.current['system-requirements'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Requirements
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck size={20} /> Security
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Authentication – verify identity.</li>
                    <li>Authorisation – permitted operations only.</li>
                    <li>Data encryption – protect sensitive data.</li>
                    <li>Audit logging – track activity.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight flex items-center gap-2">
                    <BarChart3 size={20} /> Performance
                  </h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2 space-y-1">
                    <li>Response time – within a defined limit.</li>
                    <li>Throughput – requests per second.</li>
                    <li>Availability – uptime percentage.</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Throughput</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Rate of processing data, measured in TPS. Critical for OLTP systems.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Storage Space</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Amount needed for software, data, backup, and recovery.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Access Speed</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Time to retrieve data, measured in ms. Important for real‑time systems.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-xl mt-6">
                <h4 className="text-xs font-bold text-orange-300 uppercase tracking-widest">Example Requirements</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300 font-medium list-disc pl-5 mt-2">
                  <li>Encrypt all sensitive data with AES‑256.</li>
                  <li>Handle 100 concurrent users, respond within 1 second.</li>
                  <li>Process 10,000 transactions per second.</li>
                  <li>At least 1 TB of storage space.</li>
                  <li>Retrieve data within 10 milliseconds.</li>
                </ul>
              </div>
            </div>

            {/* 11. Structure of a Requirements Specification Document */}
            <div
              ref={(el) => {
                sectionRefs.current['rsd-structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Structure of a Requirements Specification Document (RSD)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                An RSD describes the requirements of a system and communicates
                them to stakeholders.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { t: 'Introduction', d: 'Overview, purpose, scope, and audience.' },
                  { t: 'System Overview', d: 'Purpose, features, and architecture.' },
                  { t: 'Requirements', d: 'Functional and non‑functional requirements.' },
                  { t: 'Use Cases', d: 'Scenarios describing user interactions.' },
                  { t: 'Verification & Validation', d: 'How requirements will be tested.' },
                  { t: 'Appendices', d: 'Data models, user stories, test cases.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{item.t}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">{item.d}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl mt-6">
                <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Professional Documentation Tips</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2">
                  <li>Be specific and measurable.</li>
                  <li>Avoid ambiguity.</li>
                  <li>Prioritise requirements.</li>
                  <li>Document the rationale for each requirement.</li>
                  <li>Use a standard template.</li>
                  <li>Get feedback from all stakeholders.</li>
                </ul>
              </div>
            </div>

            {/* 12. Intellectual Property Protections */}
            <div
              ref={(el) => {
                sectionRefs.current['ip-protections'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Intellectual Property Protections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {[
                  { t: 'Trademark', d: 'Protects brand names, logos, and slogans. Prevents brand confusion.' },
                  { t: 'Copyright', d: 'Protects original works – literary, dramatic, musical, artistic. Lasts life + 70 years.' },
                  { t: 'Patent', d: 'Grants exclusive rights to an invention for 20 years. Must be new, useful, non‑obvious.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight">{item.t}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Database Tip
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
                  <span>User types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>IP protections</span>
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
                Successful database projects start with clear user needs,
                appropriate hardware planning, and thorough documentation. Always
                consider security, performance, and scalability from the beginning.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Database Users:</strong> Internal
                (employees) and external (customers, suppliers) – each have
                distinct needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hardware Specs:</strong> CPU,
                memory, storage, and networking must match database size, user
                load, and transaction type.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Requirements:</strong> User
                requirements focus on what – system requirements focus on how.
                Both are essential.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Documentation:</strong> An RSD
                includes introduction, system overview, requirements, use cases,
                V&amp;V, and appendices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">IP Protections:</strong> Trademarks,
                copyrights, and patents safeguard intellectual property.
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
            Sidemann Academic Registry • NC IT Database Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;