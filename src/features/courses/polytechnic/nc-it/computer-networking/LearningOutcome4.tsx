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
  Headset,
  MessageSquare,
  Users,
  Smartphone,
  Mail,
  Ear,
  HelpCircle,
  AlertTriangle,
  Phone,
  User,
  Eye,
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
  { id: 'helpdesk', label: 'Help Desk Setup' },
  { id: 'characteristics', label: 'Characteristics' },
  { id: 'queries-log', label: 'Collect Queries' },
  { id: 'communication', label: 'Communication' },
  { id: 'barriers', label: 'Barriers' },
  { id: 'verbal-nonverbal', label: 'Verbal & Non-Verbal' },
  { id: 'listening', label: 'Listening' },
  { id: 'summaries', label: 'Summaries' },
  { id: 'notemaking', label: 'Note Making' },
  { id: 'user-queries', label: 'User Queries' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'routine', label: 'Routine Maintenance' },
  { id: 'adhoc', label: 'Ad Hoc Maintenance' },
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
      { title: 'Help Desk Fact', text: 'The first help desk was created by IBM in the 1960s to provide technical support for their mainframe computers.' },
      { title: 'Pro Tip', text: 'Always document every customer interaction – it helps track recurring issues and improves future support.' },
      { title: 'Communication', text: 'Active listening can reduce resolution time by up to 30% by understanding the problem correctly from the start.' },
      { title: 'Maintenance', text: 'Ad hoc maintenance is reactive – it’s cheaper upfront but can lead to costly downtime. Balance with routine checks.' },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      { title: 'Help Desk Fact', text: 'The first help desk was created by IBM in the 1960s to provide technical support for their mainframe computers.' },
      { title: 'Pro Tip', text: 'Always document every customer interaction – it helps track recurring issues and improves future support.' },
      { title: 'Communication', text: 'Active listening can reduce resolution time by up to 30% by understanding the problem correctly from the start.' },
      { title: 'Maintenance', text: 'Ad hoc maintenance is reactive – it’s cheaper upfront but can lead to costly downtime. Balance with routine checks.' },
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Headset size={14} className="inline mr-1" /> COMPUTER NETWORKING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Help Desk &amp; Maintenance
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master help desk setup, communication skills, problem‑solving, and
            both routine and ad‑hoc maintenance. Learn how to support users
            effectively and keep systems running smoothly.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ Practical support
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Communication focus
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
                placeholder="Search for a help desk topic..."
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
                  An effective help desk is the backbone of good customer
                  support. This outcome covers everything from setting up a help
                  desk system, to mastering communication, to handling routine
                  and ad‑hoc maintenance tasks.
                </p>
              </div>
            </div>

            {/* 1. Setting up Help Desk System */}
            <div
              ref={(el) => {
                sectionRefs.current['helpdesk'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Setting Up a Help Desk System
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                An effective help desk is vital for excellent customer service
                and quick issue resolution. Follow these best practices to build
                a robust support system:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Define clear goals', d: 'Improve satisfaction, reduce resolution times, track KPIs.' },
                  { t: 'Choose the right software', d: 'Ticketing, knowledge base, self‑service, reporting.' },
                  { t: 'Establish workflows', d: 'Escalation procedures, timeframes, communication protocols.' },
                  { t: 'Empower your team', d: 'Provide training, tools, and resources.' },
                  { t: 'Implement self‑service', d: 'FAQs, knowledge base, chatbots for common issues.' },
                  { t: 'Monitor performance', d: 'Track volume, resolution times, CSAT, agent productivity.' },
                  { t: 'Seek feedback', d: 'Gather insights from customers and agents to improve.' },
                  { t: 'Integrate with other systems', d: 'CRM, ERP, e‑commerce for seamless experience.' },
                  { t: 'Invest in training', d: 'Ongoing skill development for evolving technologies.' },
                  { t: 'Embrace automation', d: 'Automate routing, reminders, and common responses.' },
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

            {/* 2. Characteristics of a Successful Helpdesk */}
            <div
              ref={(el) => {
                sectionRefs.current['characteristics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Characteristics of a Successful Helpdesk
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A high‑performing help desk consistently delivers exceptional
                service. Look for these key traits:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Customer‑focused', d: 'Empathy, active listening, genuine desire to help.' },
                  { t: 'Prompt response times', d: 'Minimise waiting, build trust.' },
                  { t: 'Effective problem‑solving', d: 'Thorough investigation, analytical thinking.' },
                  { t: 'Clear communication', d: 'Avoid jargon, use plain language.' },
                  { t: 'Self‑service options', d: 'Knowledge base, FAQs, chatbots.' },
                  { t: 'Continuous improvement', d: 'Use feedback and metrics to refine processes.' },
                  { t: 'Technology utilisation', d: 'Help desk software, automation, knowledge management.' },
                  { t: 'Adaptability', d: 'Adjust to new technologies and customer needs.' },
                  { t: 'Strong teamwork', d: 'Collaborate, share knowledge, support each other.' },
                  { t: 'Data‑driven decisions', d: 'Analyse metrics to optimise performance.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
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

            {/* 3. Collect and Log User Queries */}
            <div
              ref={(el) => {
                sectionRefs.current['queries-log'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Collect and Log User Queries
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Capturing user queries systematically helps track interactions,
                identify patterns, and improve products. Follow this workflow:
              </p>

              <div className="space-y-3 mt-4">
                {[
                  'Establish a centralized platform (help desk software).',
                  'Provide multiple channels (email, phone, live chat, portal).',
                  'Acknowledge inquiries promptly (even auto‑reply).',
                  'Gather relevant info (account, product, problem description).',
                  'Log each interaction with date, channel, user, details, attachments.',
                  'Assign to the most qualified agent based on expertise.',
                  'Track progress and resolution, keep users updated.',
                  'Categorise and tag queries for easy retrieval.',
                  'Collect feedback after resolution.',
                  'Analyse query data to identify trends and improvement areas.',
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Communication Elements */}
            <div
              ref={(el) => {
                sectionRefs.current['communication'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Elements of Communication
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Communication involves a sender, receiver, message, and channel.
                Understanding these elements is key to effective support.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { t: 'Sender', d: 'Originator of the message, encodes it.', icon: User },
                  { t: 'Receiver', d: 'Recipient who decodes the message.', icon: Users },
                  { t: 'Message', d: 'Content – verbal or nonverbal.', icon: MessageSquare },
                  { t: 'Channel', d: 'Medium (face‑to‑face, phone, email, etc.).', icon: Globe },
                  { t: 'Feedback', d: 'Receiver’s response; completes the loop.', icon: RefreshCw },
                  { t: 'Context', d: 'Background, environment, relationship.', icon: Info },
                  { t: 'Interference', d: 'Noise, distractions, barriers.', icon: AlertTriangle },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="text-blue-500" size={18} />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {item.t}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Barriers to Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['barriers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Barriers to Communication
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Obstacles that hinder effective message transmission. Recognising
                them helps avoid misunderstandings.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { t: 'Linguistic', d: 'Language, dialect, or accent differences.' },
                  { t: 'Psychological', d: 'Emotions, beliefs, attitudes, anxiety.' },
                  { t: 'Physiological', d: 'Hearing, speech, or visual impairments.' },
                  { t: 'Cultural', d: 'Different norms, values, customs.' },
                  { t: 'Physical', d: 'Noise, poor lighting, distance.' },
                  { t: 'Organisational', d: 'Hierarchy, complex channels, unclear policies.' },
                  { t: 'Technological', d: 'Poor connectivity, software issues, lack of expertise.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Verbal and Non‑Verbal Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['verbal-nonverbal'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Verbal &amp; Non‑Verbal Communication
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Verbal
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Uses spoken or written words. Requires clear articulation,
                    proper grammar, and audience‑appropriate language.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Non‑Verbal
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    “Body language” – facial expressions, posture, gestures, tone
                    of voice, eye contact. Reinforces or contradicts verbal
                    messages.
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 list-disc pl-5 mt-2 space-y-1 font-medium">
                    <li>Facial expressions (smiles, frowns)</li>
                    <li>Body language (posture, gestures)</li>
                    <li>Tone of voice (pitch, volume, intonation)</li>
                    <li>Eye contact (attentiveness, engagement)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Listening Skills */}
            <div
              ref={(el) => {
                sectionRefs.current['listening'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Listening Skills
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Active listening is essential for understanding and resolving
                user issues effectively.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { t: 'Pay attention', d: 'Give full focus, avoid distractions, maintain eye contact.', icon: Eye },
                  { t: 'Clarify & summarise', d: 'Ask questions, repeat key points to confirm understanding.', icon: ListChecks },
                  { t: 'Empathise', d: 'Put yourself in the speaker’s shoes.', icon: Brain },
                  { t: 'Avoid interrupting', d: 'Let the speaker finish before responding.', icon: AlertTriangle },
                  { t: 'Respond thoughtfully', d: 'Show engagement and respect.', icon: MessageSquare },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-start gap-3"
                  >
                    <item.icon className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {item.t}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Summaries */}
            <div
              ref={(el) => {
                sectionRefs.current['summaries'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Summaries
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Summaries condense information for different audiences and
                purposes. Here are common types:
              </p>

              <div className="overflow-x-auto mt-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                        Type
                      </th>
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                        Description
                      </th>
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                        Purpose
                      </th>
                      <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                        Audience
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { t: 'Abstract', d: 'Concise summary of a research paper', p: 'Overview of research', a: 'Researchers, academics' },
                      { t: 'Executive summary', d: 'Brief overview of a business plan/report', p: 'Highlight key points', a: 'Executives, investors' },
                      { t: 'Synopsis', d: 'Summary of a book, article, or play', p: 'Overview of plot, characters, themes', a: 'General readers' },
                      { t: 'Précis', d: 'Summary in the same style as the original', p: 'Detailed overview', a: 'Students, researchers' },
                      { t: 'Outline', d: 'Hierarchical list of main points', p: 'Organise text or prepare presentation', a: 'Students, writers' },
                      { t: 'Bullet points', d: 'Short statements summarising key points', p: 'Quick overview', a: 'General readers' },
                      { t: 'Table', d: 'Data organised in rows and columns', p: 'Summarise data', a: 'Researchers, academics' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{row.t}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.d}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.p}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 9. Note Making Process */}
            <div
              ref={(el) => {
                sectionRefs.current['notemaking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Process of Note Making
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Effective note‑taking helps retain and organise information.
                Follow these steps:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  { t: 'Preparation', d: 'Gather materials (notebook, pen, laptop).' },
                  { t: 'Listen actively', d: 'Focus on main points, concepts, arguments.' },
                  { t: 'Use your own words', d: 'Paraphrase to improve understanding.' },
                  { t: 'Be selective', d: 'Capture most important information.' },
                  { t: 'Use abbreviations/symbols', d: 'Speed up note‑taking, but ensure clarity.' },
                  { t: 'Organise your notes', d: 'Use headings, subheadings, bullet points.' },
                  { t: 'Review your notes', d: 'Reinforce learning, fill gaps, clarify.' },
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

            {/* 10. User Queries Categorisation */}
            <div
              ref={(el) => {
                sectionRefs.current['user-queries'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Categorising User Queries
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Group queries by skill level and problem type to streamline
                support.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Skill Level
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                    <li><strong>Basic:</strong> Password resets, software updates, device connections.</li>
                    <li><strong>Intermediate:</strong> Hardware diagnostics, software configuration, performance tuning.</li>
                    <li><strong>Advanced:</strong> Complex technical issues, escalated support, product specialists.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Problem Type
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Hardware', 'Software', 'Networking', 'Security', 'Performance', 'Customisation', 'Troubleshooting', 'Account Management'].map((type) => (
                      <span key={type} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 11. Problem Solving Process */}
            <div
              ref={(el) => {
                sectionRefs.current['problem-solving'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Problem Solving Process
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A systematic approach to resolving user issues effectively.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    t: 'Define the problem',
                    d: ['Gather info from user', 'Identify symptoms', 'Determine timeframe', 'Clarify ambiguity'],
                  },
                  {
                    t: 'Analyse the problem',
                    d: ['Collect data (logs, errors)', 'Identify patterns', 'Consider causes (hardware, software, user)', 'Consult documentation'],
                  },
                  {
                    t: 'Generate solutions',
                    d: ['Brainstorm approaches', 'Evaluate feasibility', 'Prioritise based on impact and ease'],
                  },
                  {
                    t: 'Implement the solution',
                    d: ['Explain to user', 'Obtain consent', 'Monitor results'],
                  },
                  {
                    t: 'Evaluate & follow‑up',
                    d: ['Verify resolution', 'If persists, investigate further', 'Document process', 'Follow up with user'],
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {item.t}
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium space-y-1 mt-2 list-disc pl-5">
                      {item.d.map((point, j) => (
                        <li key={j}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 12. Routine Maintenance */}
            <div
              ref={(el) => {
                sectionRefs.current['routine'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Routine Maintenance
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Proactive maintenance ensures optimal performance, longevity,
                and security.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">
                    Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                    <li><strong>Enhanced performance</strong> – catch issues early.</li>
                    <li><strong>Reduced downtime</strong> – fewer unexpected failures.</li>
                    <li><strong>Extended lifespan</strong> – address wear and tear.</li>
                    <li><strong>Cost savings</strong> – cheaper than reactive repairs.</li>
                    <li><strong>Improved security</strong> – patches and updates.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight">
                    Workflow
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                    <li><strong>Planning & scheduling</strong> – define tasks, frequencies.</li>
                    <li><strong>Documentation & tracking</strong> – record all activities.</li>
                    <li><strong>Inspections & checks</strong> – identify signs of wear.</li>
                    <li><strong>Cleaning & maintenance</strong> – remove dust and debris.</li>
                    <li><strong>Updates & patches</strong> – install promptly.</li>
                    <li><strong>Monitoring & analysis</strong> – detect anomalies.</li>
                    <li><strong>Troubleshooting & repairs</strong> – fix issues.</li>
                    <li><strong>Training & awareness</strong> – educate staff.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 13. Ad Hoc Maintenance */}
            <div
              ref={(el) => {
                sectionRefs.current['adhoc'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Ad Hoc Maintenance
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Reactive maintenance triggered by unexpected breakdowns.
                Weigh the pros and cons.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 uppercase tracking-tight">
                    Advantages
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                    <li><strong>Cost‑effectiveness</strong> – pay only when issues occur.</li>
                    <li><strong>Flexibility</strong> – adapt to specific needs.</li>
                    <li><strong>Immediate resolution</strong> – restore critical systems quickly.</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
                    Disadvantages
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-medium mt-2 list-disc pl-5">
                    <li><strong>Unpredictable costs</strong> – repairs can be expensive.</li>
                    <li><strong>Downtime</strong> – disruptions to operations.</li>
                    <li><strong>Increased risk</strong> – major failures may occur.</li>
                    <li><strong>Lack of prevention</strong> – issues may repeat.</li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">When to use</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2">
                    <li>Breakdowns are infrequent and unpredictable.</li>
                    <li>Systems are new with low failure rate.</li>
                    <li>Routine maintenance cost outweighs risk.</li>
                    <li>Limited maintenance resources.</li>
                  </ul>
                </div>
                <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">When to avoid</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 font-medium list-disc pl-5 mt-2">
                    <li>Systems are critical and downtime is costly.</li>
                    <li>Systems have a history of frequent failures.</li>
                    <li>Compliance or safety standards require preventive maintenance.</li>
                    <li>Resources exist for routine maintenance.</li>
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
                  💡 Support Tip
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
                  <span>Maintenance types</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Communication elements</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A great help desk combines clear communication, systematic
                problem‑solving, and the right maintenance strategy. Listen
                actively, document thoroughly, and always follow up.
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
                <strong className="text-white">Help Desk Setup:</strong> Define
                goals, choose software, establish workflows, and empower your
                team.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Communication:</strong> Understand
                sender, receiver, message, channel, feedback, context, and
                interference.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Listening &amp; Summaries:</strong>{' '}
                Active listening builds trust; use the right summary type for
                your audience.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Problem Solving:</strong> Define,
                analyse, generate, implement, evaluate – a systematic approach
                works best.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Maintenance:</strong> Routine
                maintenance prevents issues; ad‑hoc is reactive – balance both
                based on criticality and resources.
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
            Sidemann Academic Registry • NC IT Networking Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;