import React, { useState, useEffect, useRef } from 'react';
import {
  Flag,
  MessageCircle,
  Users,
  Target,
  Zap,
  CheckCircle,
  Lightbulb,
  AlertCircle,
  Mic,
  Eye,
  PenTool,
  Monitor,
  Globe,
  Building,
  Cpu,
  UserCheck,
  UserX,
  Languages,
  VolumeX,
  Heart,
  Scale,
  Shield,
  Briefcase,
  Award,
  ThumbsUp,
  X,
  ArrowRight,
  Phone,
  Video,
  FileSpreadsheet,
  Presentation,
  MessageSquare,
  Volume2,
  Info,
  Sun,
  Leaf,
  BookOpen,
  Mail,
  MessageCircle as MessageCircle2,
  Brain,
  Wifi,
  Layers,
  Users2,
  Calendar,
  Clock,
  Hash,
  FileText,
  Link,
  Download,
  Upload,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusCircle,
  PlusCircle,
  CornerDownRight,
  ExternalLink,
  Eye as EyeIcon,
  EyeOff,
  ThumbsDown,
  ChevronUp,
  Sparkles,
  BookMarked,
  RefreshCw,
  Search,
  X as XIcon,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'what-is-communication', label: 'What Is Communication?' },
  { id: 'seven-cs', label: 'The Seven Cs' },
  { id: 'barriers', label: 'Barriers' },
  { id: 'methods', label: 'Methods' },
  { id: 'channels', label: 'Channels' },
  { id: 'pros-cons', label: 'Pros & Cons' },
  { id: 'accuracy', label: 'Accuracy' },
  { id: 'audience', label: 'Audience' },
  { id: 'meeting-terms', label: 'Meeting Terms' },
  { id: 'meeting-types', label: 'Meeting Types' },
  { id: 'summary', label: 'Summary' },
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
      {
        title: 'Did you know?',
        text: 'The Seven Cs of Communication (Clarity, Conciseness, Correctness, Completeness, Courtesy, Consideration, Concreteness) were developed to guide effective business writing.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a communication channel, consider: urgency, complexity, importance, and the relationship with the receiver.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Seven Cs with "CCCCCCC" – each C represents a key principle for effective written communication.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "conciseness" with "brevity". Conciseness means using the fewest words without sacrificing clarity – not just making things short.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Seven Cs of Communication (Clarity, Conciseness, Correctness, Completeness, Courtesy, Consideration, Concreteness) were developed to guide effective business writing.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a communication channel, consider: urgency, complexity, importance, and the relationship with the receiver.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the Seven Cs with "CCCCCCC" – each C represents a key principle for effective written communication.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "conciseness" with "brevity". Conciseness means using the fewest words without sacrificing clarity – not just making things short.',
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
            <MessageCircle size={14} className="inline mr-1" /> WORKPLACE COMMUNICATION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Oral &amp; Written Communication
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master the fundamentals of workplace communication: the Seven Cs,
            communication barriers, methods, channels, meeting terminology, and
            audience consideration.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MessageCircle size={14} className="inline mr-1" /> 7 Cs
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Audience
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
                placeholder="Search for a concept, barrier, or term..."
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
                  <XIcon size={18} className="text-blue-200" />
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
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Workplace Communication
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Communication is the process of conveying information, ideas,
                    thoughts, feelings, or messages from one person or group to
                    another. Think of it as a bridge that connects people's minds.
                    This learning outcome covers the essential skills for effective
                    oral and written communication in the workplace.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of communication like a game of catch. The sender throws
                  the ball (message) through the air (channel) to the receiver,
                  who catches it and throws it back (feedback). If either person
                  drops the ball or throws poorly, the game breaks down.
                </p>
              </div>
            </div>

            {/* What is Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['what-is-communication'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What is Communication?
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Communication is the process of conveying information, ideas,
                thoughts, feelings, or messages from one person or group to another.
                At its heart, communication involves a <span className="font-bold">sender</span>,
                a <span className="font-bold">message</span>, a <span className="font-bold">channel</span>,
                and a <span className="font-bold">receiver</span>, all working together
                with the goal of creating shared understanding.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                The Key Components of Communication
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <UserCheck size={14} /> Sender
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The person or entity that starts the communication process – the source of the message.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <MessageCircle size={14} /> Message
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The information, idea, or feeling being conveyed – the actual content of communication.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Monitor size={14} /> Channel
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The medium through which the message is transmitted – spoken words, written text, visual aids, or electronic signals.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Users size={14} /> Receiver
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The person or entity that receives and interprets the message – the target audience.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <MessageCircle2 size={14} /> Feedback
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The receiver's response that tells the sender whether the message was understood correctly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Globe size={14} /> Context
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The environment or situation in which communication takes place – physical setting, cultural background, emotional atmosphere.</p>
                </div>
              </div>
            </div>

            {/* The Seven Cs */}
            <div
              ref={(el) => {
                sectionRefs.current['seven-cs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Seven Cs of Written Communication
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                The Seven Cs are a set of principles that guide effective written
                communication, ensuring your message is clear, concise, and professional.
              </p>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C1. Clarity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Expressing your thoughts in a way that is easily understood. Use simple sentences and precise vocabulary. Avoid ambiguity.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "The implementation of the aforementioned strategic initiatives will be effectuated in due course."</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "We will begin these strategies soon."</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C2. Conciseness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Convey your message using the fewest possible words without sacrificing clarity. Be direct and to the point.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "At this point in time, we are in the process of conducting an analysis of the market."</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "We are analyzing the market."</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C3. Correctness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ensure your writing is free from grammatical errors, spelling mistakes, and factual inaccuracies.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "Your going to love this report"</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "You're going to love this report"</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C4. Completeness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provide all necessary information so the reader has a full understanding. Anticipate what questions they might have.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "Meeting at 3 PM."</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "Meeting at 3 PM in Conference Room B. Please bring your project updates."</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C5. Courtesy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be respectful, considerate, and polite. Use a positive tone, even when delivering difficult messages.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "You failed to submit the report on time."</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "We noticed the report wasn't submitted by the deadline. Can we help with anything?"</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C6. Consideration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand and empathize with your reader's perspective. Tailor your message to their specific situation and needs.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ Use technical jargon with a general audience.</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ Explain concepts in simpler language and avoid unnecessary jargon.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">C7. Concreteness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be specific, definite, and vivid. Use facts, figures, and examples to support your message.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">❌ "Sales increased significantly last quarter."</p>
                    <p className="text-xs text-green-600 dark:text-green-400">✅ "Sales increased by 15% in the last quarter, from $500,000 to $575,000."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barriers */}
            <div
              ref={(el) => {
                sectionRefs.current['barriers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Common Barriers to Communication
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <VolumeX size={14} /> 1. Physical Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tangible obstacles like noise, distance, poor technology, or physical limitations.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Find quiet spaces, use reliable technology, arrange seating for better communication.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Brain size={14} /> 2. Psychological Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Internal factors like stress, anxiety, prejudices, biases, and emotional states.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Practice self-awareness, develop empathy, use active listening.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Languages size={14} /> 3. Semantic Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Misunderstandings related to the meaning of words, jargon, ambiguous language, or cultural differences.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Use clear, simple language, avoid jargon, define important terms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Globe size={14} /> 4. Cultural Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Differences in cultural norms, values, beliefs, and communication styles.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Learn about other cultures, be aware your style isn't universal, ask questions respectfully.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Building size={14} /> 5. Organizational Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Obstacles from structure and processes – poor channels, hierarchies, lack of transparency.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Establish clear communication channels, promote transparency, encourage cross-departmental collaboration.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Cpu size={14} /> 6. Technological Barriers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Obstacles from technology – glitches, software limitations, lack of digital literacy, information overload.</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><span className="font-bold">Solution:</span> Ensure reliable technology, provide training, choose the right tool for the message.</p>
                </div>
              </div>
            </div>

            {/* Methods of Communication */}
            <div
              ref={(el) => {
                sectionRefs.current['methods'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Methods of Communication
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Mic size={14} /> 1. Verbal Communication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Spoken words – face-to-face conversations, phone calls, video conferencing, presentations. Immediate feedback, rich with tone and emotion.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Strengths</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Immediate feedback, tone, rapport building</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Weaknesses</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">No permanent record, can be forgotten</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Eye size={14} /> 2. Nonverbal Communication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Body language, facial expressions, gestures, tone of voice. Often more honest than verbal communication.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Strengths</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Adds meaning beyond words, universal</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Weaknesses</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Can be ambiguous, hard to control</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PenTool size={14} /> 3. Written Communication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Emails, letters, reports, memos, text messages. Creates a permanent record, allows careful crafting.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Strengths</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Permanent record, wide reach, time for reflection</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Weaknesses</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">No immediate feedback, tone can be misinterpreted</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Monitor size={14} /> 4. Visual Communication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Graphs, charts, images, diagrams, videos. Makes complex information easier to understand and remember.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Strengths</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">People remember visuals longer, transcends language</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Weaknesses</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Can oversimplify, requires design skill</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Wifi size={14} /> 5. Digital Communication
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email, instant messaging, social media, video conferencing, collaboration tools. Fast, global reach.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">Strengths</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Fast, global, combines multiple media</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Weaknesses</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Misunderstandings common, information overload</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Channels */}
            <div
              ref={(el) => {
                sectionRefs.current['channels'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Major Communication Channels
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Users size={14} /> Face-to-Face
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Direct, in-person interaction. Richest channel – allows verbal and nonverbal cues, immediate feedback.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PenTool size={14} /> Written
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Letters, memos, reports, emails. Formal, creates documentation, allows careful crafting.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Phone size={14} /> Telephone/Voice
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Spoken words over telecommunication. Quick, convenient, preserves tone but loses visual cues.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Monitor size={14} /> Electronic/Digital
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email, instant messaging, social media, video conferencing. Combines aspects of written, verbal, and visual.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Eye size={14} /> Visual
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Presentations, infographics, charts, videos. Enhances messages with visual elements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileSpreadsheet size={14} /> Formal Reports
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detailed written communication providing comprehensive information. Most formal and structured.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Presentation size={14} /> Public Speaking
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Delivering verbal and visual messages to a group. Powerful for inspiring, persuading, informing.</p>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div
              ref={(el) => {
                sectionRefs.current['pros-cons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pros and Cons of Written Communication
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ThumbsUp size={14} /> Advantages
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Permanent record for future reference</li>
                    <li>Clarity and precision – time to perfect message</li>
                    <li>Wider reach – one document can reach many</li>
                    <li>Time for reflection before responding</li>
                    <li>Professionalism and credibility</li>
                    <li>Documentation for training and reference</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <ThumbsDown size={14} /> Disadvantages
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Lack of immediate feedback</li>
                    <li>Misinterpretation of tone</li>
                    <li>Time-consuming to create</li>
                    <li>Impersonal – lacks warmth and human connection</li>
                    <li>No nonverbal cues</li>
                    <li>Potential for misuse – can be taken out of context</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div
              ref={(el) => {
                sectionRefs.current['accuracy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Importance of Transmitting Accurate Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Informed decision-making – accurate information is the foundation of good decisions.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Trust and credibility – accuracy builds trust; misinformation destroys it.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Safety and well-being – in many contexts, accurate information is a matter of life and death.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Efficiency and productivity – accurate information saves time and resources.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Problem-solving – solving problems requires understanding their true causes.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Legal and ethical obligations – many professions have legal requirements for accuracy.</p>
                </div>
              </div>
            </div>

            {/* Audience */}
            <div
              ref={(el) => {
                sectionRefs.current['audience'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Why Consider Your Audience's Needs?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Ensures Understanding and Clarity</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Tailor language to audience knowledge level</li>
                    <li>Provide relevant context</li>
                    <li>Avoid misinterpretation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Builds Connection and Rapport</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Shows empathy and respect</li>
                    <li>Increases engagement</li>
                    <li>Builds trust and credibility</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Achieves Desired Outcomes</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Address what motivates your audience</li>
                    <li>Provide information that matters to them</li>
                    <li>Anticipate and address objections</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Prevents Wasted Effort and Time</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Focus on what matters to them</li>
                    <li>Choose the most effective channel</li>
                    <li>Reduce need for clarification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Meeting Terms */}
            <div
              ref={(el) => {
                sectionRefs.current['meeting-terms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Meeting Terms Explained
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Motion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A formal proposal presented at a meeting for discussion and decision.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"I move that we allocate $500 to marketing."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Amendments</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A proposal to change a motion by adding, deleting, or substituting words.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"I propose an amendment to increase from $500 to $750."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Addendum</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">An addition to make a document or motion more complete or clear.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"I propose an addendum to include a timeline."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Resolution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A formal decision passed by a meeting after a motion is adopted by majority vote.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The members resolved that the fee be raised to $300."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Proxy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A person authorized to vote or speak on behalf of an absent member.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"I authorize John to act as my proxy."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Ex-Officio</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Membership by virtue of office, not by election.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The CEO is an ex-officio member of all committees."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Nem-Con</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">No one contradicting – motion passed without any opposition.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The motion was passed nem-con."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Unanimous</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">All members present cast a vote in favor – complete agreement.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The resolution was passed unanimously."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">In Camera</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A private meeting not open to the public, for sensitive topics.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The board went into in camera session."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quorum</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The minimum number of members required for a meeting to be valid.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The quorum is 50% of the membership."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Co-Option</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Inviting a non-member to serve due to specialized knowledge.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The committee co-opted an environmental scientist."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Adjournment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The act of ending a meeting formally.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The meeting was adjourned at 5:00 PM."</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Postponement</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deferring a meeting to a future date.</p>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">"The meeting was postponed due to lack of quorum."</p>
                </div>
              </div>
            </div>

            {/* Meeting Types */}
            <div
              ref={(el) => {
                sectionRefs.current['meeting-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Meetings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-blue-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">All-Hands Meeting</h4>
                  <p className="text-sm">Company-wide meeting for major announcements, updates, and community building.</p>
                </div>
                <div className="p-4 bg-indigo-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">Board Meeting</h4>
                  <p className="text-sm">High-level strategy, major decisions, financial oversight, organizational direction.</p>
                </div>
                <div className="p-4 bg-purple-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">Brainstorming Session</h4>
                  <p className="text-sm">Generate creative ideas – quantity over quality, build on each other's ideas.</p>
                </div>
                <div className="p-4 bg-teal-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">Project Meeting</h4>
                  <p className="text-sm">Discuss project progress, share updates, identify issues, coordinate next steps.</p>
                </div>
                <div className="p-4 bg-green-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">One-on-One Meeting</h4>
                  <p className="text-sm">Regular check-ins between manager and employee on work, development, and goals.</p>
                </div>
                <div className="p-4 bg-amber-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">Stand-Up Meeting</h4>
                  <p className="text-sm">Brief daily updates – what was done, what's next, blockers. Usually 15 minutes or less.</p>
                </div>
                <div className="p-4 bg-rose-600 text-white rounded-xl">
                  <h4 className="text-xs font-bold uppercase">Retrospective Meeting</h4>
                  <p className="text-sm">Review past performance – what went well, what didn't, what can be improved.</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              ref={(el) => {
                sectionRefs.current['summary'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Summary
              </h2>

              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
                <p className="text-sm text-blue-100 leading-relaxed">
                  Communication is the lifeblood of human interaction. Understanding
                  its components, principles, barriers, methods, and channels helps
                  you become a more effective communicator.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>Communication involves sender, message, channel, receiver, feedback, context</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>The Seven Cs guide effective written communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>Barriers can block communication – physical, psychological, semantic, cultural, organizational, technological</span>
                    </li>
                  </ul>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>Different methods and channels suit different situations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>Accurate information is essential for good decisions and trust</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="text-green-300 shrink-0 mt-0.5" size={14} />
                      <span>Understanding your audience is crucial for effective communication</span>
                    </li>
                  </ul>
                </div>
                <p className="text-center text-lg font-bold mt-6 uppercase tracking-tight">
                  Communicate Clearly. Connect Deeply. Succeed Together. 🗣️
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Communication Tip
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
                  <span>The Seven Cs</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Barrier Types</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective communication is a skill that can be learned and
                improved. Master the Seven Cs, understand your audience, choose
                the right channel, and you'll communicate with clarity and
                confidence.
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
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Communication</strong> is a process involving sender, message, channel, receiver, feedback, and context.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">The Seven Cs</strong> – Clarity, Conciseness, Correctness, Completeness, Courtesy, Consideration, Concreteness – guide effective written communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Barriers</strong> (physical, psychological, semantic, cultural, organizational, technological) can block effective communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Methods</strong> include verbal, nonverbal, written, visual, and digital – each with strengths and weaknesses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Meeting terms</strong> – motion, amendment, resolution, proxy, quorum, nem-con, unanimous, in camera, etc. – help you participate effectively.
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
            Sidemann Academic Registry • Workplace Communication 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;