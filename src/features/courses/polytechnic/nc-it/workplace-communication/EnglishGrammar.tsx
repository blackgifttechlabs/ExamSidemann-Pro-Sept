import React, { useState, useEffect, useRef } from 'react';
import {
  Flag,
  BookOpen,
  PenTool,
  Type,
  Hash,
  Clock,
  MapPin,
  Link2,
  CheckCircle,
  X,
  ArrowRight,
  CornerDownRight,
  Award,
  Briefcase,
  MessageCircle,
  FileSpreadsheet,
  Pen,
  Book,
  Target,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  Lightbulb,
  UserCheck,
  Building,
  Globe,
  Download,
  Upload,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusCircle,
  PlusCircle,
  ExternalLink,
  Eye as EyeIcon,
  EyeOff,
  MessageSquare,
  List,
  Layout,
  Grid,
  Layers,
  Cpu,
  Coffee,
  Zap,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  Droplet,
  Smile,
  Frown,
  Meh,
  Quote,
  Braces,
  Brackets,
  Parentheses,
  Slash,
  Asterisk,
  AtSign,
  DollarSign,
  Percent,
  Plus,
  Minus,
  Divide,
  Equal,
  Link,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Home,
  Search,
  Menu,
  Settings as SettingsIcon,
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  ChevronUp,
  Sparkles,
  BookMarked,
  RefreshCw,
  X as XIcon,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'nouns', label: 'Nouns' },
  { id: 'tenses', label: 'Tenses' },
  { id: 'prepositions', label: 'Prepositions' },
  { id: 'adjectives', label: 'Adjectives' },
  { id: 'verbs', label: 'Verbs' },
  { id: 'summary', label: 'Summary' },
  { id: 'tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const EnglishGrammar: React.FC = () => {
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
        text: 'There are eight parts of speech in English: nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.',
      },
      {
        title: 'Pro Tip',
        text: 'The order of adjectives in English is: opinion, size, age, shape, color, origin, material, purpose. Example: "a beautiful old wooden table."',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 12 tenses as: 4 Present, 4 Past, 4 Future. Each has Simple, Continuous, Perfect, and Perfect Continuous forms.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "it\'s" (it is) with "its" (possessive). "It\'s raining" vs. "The cat chased its tail."',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'There are eight parts of speech in English: nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.',
      },
      {
        title: 'Pro Tip',
        text: 'The order of adjectives in English is: opinion, size, age, shape, color, origin, material, purpose. Example: "a beautiful old wooden table."',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 12 tenses as: 4 Present, 4 Past, 4 Future. Each has Simple, Continuous, Perfect, and Perfect Continuous forms.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "it\'s" (it is) with "its" (possessive). "It\'s raining" vs. "The cat chased its tail."',
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
            <BookOpen size={14} className="inline mr-1" /> ENGLISH GRAMMAR
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Grammar Guide{' '}
            <span className="text-emerald-300 font-bold italic">
              Parts of Speech &amp; Tenses
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master English grammar with comprehensive coverage of nouns, tenses,
            prepositions, adjectives, verbs, and more. Build confidence in your
            writing and speaking.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Type size={14} className="inline mr-1" /> Parts of Speech
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clock size={14} className="inline mr-1" /> Tenses
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
                placeholder="Search for a concept, part of speech, or rule..."
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
                Welcome to English Grammar
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Welcome to your comprehensive guide to English grammar!
                    Think of grammar as the rulebook that helps us arrange words
                    to create clear, meaningful communication. Just as a builder
                    needs to understand how bricks, beams, and mortar work together
                    to construct a building, you need to understand how different
                    types of words work together to construct sentences.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    In this guide, we'll explore every aspect of English grammar
                    in detail, with clear explanations, plenty of examples, and
                    practical tips to help you master each concept.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Grammar is like the instruction manual for language. Just as you need to know how to put together furniture correctly, you need grammar to put words together correctly so others understand you.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">The Eight Parts of Speech</h3>
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><span className="font-bold">Nouns</span> – Naming words</li>
                  <li><span className="font-bold">Pronouns</span> – Words that replace nouns</li>
                  <li><span className="font-bold">Verbs</span> – Action or state words</li>
                  <li><span className="font-bold">Adjectives</span> – Words that describe nouns</li>
                  <li><span className="font-bold">Adverbs</span> – Words that describe verbs, adjectives, or other adverbs</li>
                  <li><span className="font-bold">Prepositions</span> – Words that show relationships</li>
                  <li><span className="font-bold">Conjunctions</span> – Words that connect</li>
                  <li><span className="font-bold">Interjections</span> – Words that express emotion</li>
                </ol>
              </div>
            </div>

            {/* Nouns */}
            <div
              ref={(el) => {
                sectionRefs.current['nouns'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Nouns
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Noun?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Simple Definition:</span> A noun is a word that names a person, place, thing, or idea. Think of it as a label for anything you can think of or talk about.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">More Detailed:</span> A noun is a word that acts as the name of something—whether it's a person, animal, place, thing, quality, idea, or action—and typically functions in a sentence as the subject or object of a verb, or as the object of a preposition.
              </p>

              <div className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Why are Nouns Important?</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Nouns are the building blocks of language. They provide the subjects and objects that make sentences meaningful. Without nouns, we'd struggle to communicate specific information.</p>
                <div className="mt-2 p-2 bg-white dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">Imagine trying to say: "The ___ barked at the ___."</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Types of Nouns
              </h3>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Proper Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name specific people, places, or things. Always capitalized.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>People:</strong> John, Mary, Dr. Smith</li>
                    <li><strong>Places:</strong> Paris, Mount Everest, Africa</li>
                    <li><strong>Brands:</strong> Samsung, Coca-Cola, Toyota</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Common Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name general categories of people, places, or things. Not capitalized.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>People:</strong> teacher, doctor, student</li>
                    <li><strong>Places:</strong> city, country, park</li>
                    <li><strong>Things:</strong> book, car, phone</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Collective Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name a group of people, things, or animals as a single unit.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Animals:</strong> herd, flock, pack</li>
                    <li><strong>People:</strong> crowd, team, audience</li>
                    <li><strong>Things:</strong> pile, stack, bundle</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Material Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Refer to materials or substances from which things are made.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Examples:</strong> gold, wood, steel, water, cotton</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Abstract Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name ideas, qualities, emotions, or concepts that cannot be perceived by the five senses.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Emotions:</strong> love, happiness, fear</li>
                    <li><strong>Qualities:</strong> courage, honesty, wisdom</li>
                    <li><strong>Concepts:</strong> freedom, justice, peace</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Countable &amp; Uncountable</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-bold">Countable:</span> can be counted (one cat, two cats). <span className="font-bold">Uncountable:</span> cannot be counted (water, information).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Possessive Nouns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show ownership. Use <code className="bg-slate-100 dark:bg-slate-800 px-1">'s</code> for singular, <code className="bg-slate-100 dark:bg-slate-800 px-1">s'</code> for plural.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Singular:</strong> the <strong>dog's</strong> bone</li>
                    <li><strong>Plural:</strong> the <strong>dogs'</strong> bowls</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Remember</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Proper nouns are always capitalized. Common nouns are not (unless they start a sentence).</p>
              </div>
            </div>

            {/* Tenses */}
            <div
              ref={(el) => {
                sectionRefs.current['tenses'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Tenses
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is Tense?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">Core Definition:</span> Tense is a form of a verb that primarily expresses the time of an action or state. Think of tense as the verb's way of telling us "when" something happened.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Oxford Dictionary Definition:</span> "Any of the forms of a verb that may be used to show the time of the action or situation expressed by the verb."
              </p>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <Lightbulb className="text-green-600 dark:text-green-400 inline mr-2" size={18} />
                <span className="text-sm text-slate-700 dark:text-slate-300">Imagine a timeline stretching from the distant past, through the present, and into the future. Tenses are like markers on that timeline that tell us exactly where an action belongs.</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 The 12 Tenses
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Tense</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Formula</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Simple Present</td><td className="p-3">Subject + Verb (base/s/es)</td><td className="p-3">"Romila <strong>plays</strong> football."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Present Continuous</td><td className="p-3">Subject + am/is/are + Verb-ing</td><td className="p-3">"Parents <strong>are leaving</strong> for the office."</td></tr>
                    <tr><td className="p-3 font-bold">Present Perfect</td><td className="p-3">Subject + have/has + Past Participle</td><td className="p-3">"He <strong>has worshiped</strong> his mother always."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Present Perfect Continuous</td><td className="p-3">Subject + have/has + been + Verb-ing</td><td className="p-3">"I <strong>have been eating</strong> this dish since childhood."</td></tr>
                    <tr><td className="p-3 font-bold">Simple Past</td><td className="p-3">Subject + Verb-ed/Past Verb</td><td className="p-3">"Simran <strong>slept</strong> for the day."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Past Continuous</td><td className="p-3">Subject + was/were + Verb-ing</td><td className="p-3">"It <strong>was raining</strong> today."</td></tr>
                    <tr><td className="p-3 font-bold">Past Perfect</td><td className="p-3">Subject + had + Past Participle</td><td className="p-3">"She <strong>had kept</strong> it a secret."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Past Perfect Continuous</td><td className="p-3">Subject + had + been + Verb-ing</td><td className="p-3">"Simran <strong>had been sleeping</strong> for 8 hours."</td></tr>
                    <tr><td className="p-3 font-bold">Simple Future</td><td className="p-3">Subject + will/shall + Verb (base)</td><td className="p-3">"I <strong>will pray</strong> for your well-being."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Future Continuous</td><td className="p-3">Subject + will/shall + be + Verb-ing</td><td className="p-3">"I <strong>will be mopping</strong> tomorrow."</td></tr>
                    <tr><td className="p-3 font-bold">Future Perfect</td><td className="p-3">Subject + will/shall + have + Past Participle</td><td className="p-3">"She <strong>will have cooked</strong> dinner by then."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Future Perfect Continuous</td><td className="p-3">Subject + will/shall + have + been + Verb-ing</td><td className="p-3">"By April, I <strong>will have been writing</strong> letters for 10 years."</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Tense Usage Tips</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Don't Switch Tenses Unnecessarily</span> – keep consistent unless you have a reason to change.</li>
                  <li><span className="font-bold">Use Time Markers</span> – words like "yesterday," "now," "tomorrow" signal which tense to use.</li>
                  <li><span className="font-bold">Remember Irregular Verbs</span> – many common verbs have irregular past forms (go → went → gone).</li>
                </ul>
              </div>
            </div>

            {/* Prepositions */}
            <div
              ref={(el) => {
                sectionRefs.current['prepositions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Prepositions
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Preposition?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A preposition is a word that establishes a relationship between a noun or pronoun and other elements in a sentence. It provides crucial details such as location, time, direction, or manner, helping us understand how things are connected.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Simple Definition:</span> Prepositions are words that tell us where something is (location), when something happens (time), or how things relate to each other.
              </p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <Lightbulb className="text-amber-600 dark:text-amber-400 inline mr-2" size={18} />
                <span className="text-sm text-slate-700 dark:text-slate-300">A preposition is like a bridge that connects a noun or pronoun to the rest of the sentence, showing the relationship between them.</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Common Prepositions
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Preposition</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Use</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">About</td><td className="p-3">Topic, time, or cause</td><td className="p-3">"We talked <strong>about</strong> the movie."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Above</td><td className="p-3">Higher than something</td><td className="p-3">"The picture is <strong>above</strong> the sofa."</td></tr>
                    <tr><td className="p-3 font-bold">Across</td><td className="p-3">From one side to another</td><td className="p-3">"She walked <strong>across</strong> the street."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">After</td><td className="p-3">Following in time or order</td><td className="p-3">"We'll eat <strong>after</strong> the movie."</td></tr>
                    <tr><td className="p-3 font-bold">At</td><td className="p-3">Specific point or time</td><td className="p-3">"Meet me <strong>at</strong> the corner <strong>at</strong> 3 PM."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Between</td><td className="p-3">In the middle of two</td><td className="p-3">"The bank is <strong>between</strong> the post office and the library."</td></tr>
                    <tr><td className="p-3 font-bold">By</td><td className="p-3">Near, or indicating the doer</td><td className="p-3">"The house <strong>by</strong> the lake. Written <strong>by</strong> Shakespeare."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">During</td><td className="p-3">Throughout a period</td><td className="p-3">"He slept <strong>during</strong> the movie."</td></tr>
                    <tr><td className="p-3 font-bold">For</td><td className="p-3">Purpose, duration, recipient</td><td className="p-3">"This gift is <strong>for</strong> you. I waited <strong>for</strong> an hour."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">From</td><td className="p-3">Origin or starting point</td><td className="p-3">"I'm <strong>from</strong> Canada. Open <strong>from</strong> 9 to 5."</td></tr>
                    <tr><td className="p-3 font-bold">In</td><td className="p-3">Inside, within</td><td className="p-3">"She's <strong>in</strong> the kitchen. I'll be there <strong>in</strong> ten minutes."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">On</td><td className="p-3">Surface, day, state</td><td className="p-3">"The book is <strong>on</strong> the table. See you <strong>on</strong> Monday."</td></tr>
                    <tr><td className="p-3 font-bold">To</td><td className="p-3">Direction, recipient</td><td className="p-3">"Go <strong>to</strong> the store. Give it <strong>to</strong> me."</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Under</td><td className="p-3">Below, beneath</td><td className="p-3">"The cat is <strong>under</strong> the table."</td></tr>
                    <tr><td className="p-3 font-bold">With</td><td className="p-3">Accompanied by, using</td><td className="p-3">"Come <strong>with</strong> me. Write <strong>with</strong> a pen."</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Prepositions of Time</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>at</strong> – at 3 PM, at noon</li>
                    <li><strong>on</strong> – on Monday, on July 4th</li>
                    <li><strong>in</strong> – in the morning, in 2020</li>
                    <li><strong>for</strong> – for three hours</li>
                    <li><strong>since</strong> – since Monday</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Prepositions of Place</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>at</strong> – at the bus stop</li>
                    <li><strong>in</strong> – in the room</li>
                    <li><strong>on</strong> – on the table</li>
                    <li><strong>under</strong> – under the bed</li>
                    <li><strong>between</strong> – between two chairs</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Practice Exercises</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>1.</strong> "You will not be able to do the work ____ yourself. You need some help ____ it."</p>
                  <p className="text-green-600 dark:text-green-400">Answer: by, with</p>
                  <p><strong>2.</strong> "He wants to go home ____ an urgent matter."</p>
                  <p className="text-green-600 dark:text-green-400">Answer: for</p>
                  <p><strong>3.</strong> "Until the light falls ____ the road, we cannot see it ________ the darkness."</p>
                  <p className="text-green-600 dark:text-green-400">Answer: on, through</p>
                </div>
              </div>
            </div>

            {/* Adjectives */}
            <div
              ref={(el) => {
                sectionRefs.current['adjectives'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Adjectives
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is an Adjective?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An adjective is a word that modifies or describes a noun or pronoun, providing more details about the object, person, or idea it refers to. Adjectives tell us more about nouns—they answer questions like "What kind?" "Which one?" "How many?" and "How much?"
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Simple Definition:</span> Adjectives are describing words. They add color, detail, and precision to our language.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 The Order of Adjectives
              </h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ol className="list-decimal pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Determiner</strong> – a, an, the, my, your</li>
                  <li><strong>Quantity</strong> – one, two, few, many</li>
                  <li><strong>Opinion</strong> – beautiful, ugly, nice, horrible</li>
                  <li><strong>Size</strong> – big, small, tall, short</li>
                  <li><strong>Age</strong> – old, new, young, ancient</li>
                  <li><strong>Shape</strong> – round, square, flat</li>
                  <li><strong>Color</strong> – red, blue, green, yellow</li>
                  <li><strong>Origin</strong> – American, Chinese, wooden</li>
                  <li><strong>Material</strong> – wooden, cotton, gold, plastic</li>
                  <li><strong>Purpose</strong> – sleeping (bag), running (shoes)</li>
                </ol>
                <div className="mt-3 p-2 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Example:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">"I bought <strong>a beautiful old wooden table</strong>."</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Determiner + Opinion + Age + Material + Noun</p>
                </div>
              </div>
            </div>

            {/* Verbs */}
            <div
              ref={(el) => {
                sectionRefs.current['verbs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Verbs
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What is a Verb?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A verb is a word that expresses an action, occurrence, or state of being. Verbs are the heart of every sentence—they tell us what's happening or what someone or something is.
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                <span className="font-bold">Simple Definition:</span> Verbs are "doing" words or "being" words. They show action or state.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Action Verbs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Describe actions – things that people or things do.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Physical:</strong> run, jump, eat, sleep</li>
                    <li><strong>Mental:</strong> think, believe, understand, love</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Linking Verbs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connect subject to a subject complement.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Forms of "be":</strong> am, is, are, was, were</li>
                    <li><strong>Sensory:</strong> look, sound, smell, taste, feel</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Auxiliary (Helping) Verbs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">"Help" the main verb form different tenses.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Primary:</strong> be, have, do</li>
                    <li><strong>Modal:</strong> can, could, may, might, must, shall, should, will, would</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Phrasal Verbs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Verb + particle with a special meaning.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Examples:</strong> turn off, look up, pick up, give up</li>
                  </ul>
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
                Parts of Speech Quick Reference
              </h2>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Part of Speech</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Function</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Noun</td><td className="p-3">Names a person, place, thing, or idea</td><td className="p-3">dog, London, love, table</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Pronoun</td><td className="p-3">Replaces a noun</td><td className="p-3">he, she, it, they, we</td></tr>
                    <tr><td className="p-3 font-bold">Verb</td><td className="p-3">Shows action or state</td><td className="p-3">run, is, think, become</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Adjective</td><td className="p-3">Describes a noun</td><td className="p-3">beautiful, tall, red, old</td></tr>
                    <tr><td className="p-3 font-bold">Adverb</td><td className="p-3">Describes a verb, adjective, or adverb</td><td className="p-3">quickly, very, well, here</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Preposition</td><td className="p-3">Shows relationship</td><td className="p-3">in, on, at, under, with</td></tr>
                    <tr><td className="p-3 font-bold">Conjunction</td><td className="p-3">Connects words or groups</td><td className="p-3">and, but, or, because</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Interjection</td><td className="p-3">Expresses emotion</td><td className="p-3">wow, oh, ouch, hey</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Tips for Grammar Success
              </h2>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" /> Tips for Success
                </h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                  <li><span className="font-bold">Practice regularly</span> – Grammar is like a muscle; it gets stronger with use.</li>
                  <li><span className="font-bold">Read widely</span> – Reading exposes you to correct grammar in context.</li>
                  <li><span className="font-bold">Write often</span> – Apply what you learn by writing sentences and paragraphs.</li>
                  <li><span className="font-bold">Learn the rules, but also the exceptions</span> – English has many exceptions!</li>
                  <li><span className="font-bold">Don't be afraid to make mistakes</span> – Mistakes are how we learn.</li>
                </ul>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-yellow-300" />
                <p className="text-lg font-bold mb-2">Remember:</p>
                <p className="text-sm text-blue-100">
                  Grammar is not about following arbitrary rules—it's about communicating clearly and effectively. When you understand grammar, you gain control over your language and can express exactly what you mean with precision and confidence.
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
                  💡 Grammar Tip
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
                  <span>Parts of Speech</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Tenses</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">12</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Grammar is the foundation of effective communication. Master it,
                and you'll express yourself with clarity, precision, and confidence.
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
                <strong className="text-white">Parts of Speech</strong> – The eight categories (nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, interjections) define how words function in sentences.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Nouns</strong> – Name people, places, things, or ideas. Types include proper, common, collective, material, abstract, countable, uncountable, and possessive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tenses</strong> – Express time (past, present, future). There are 12 tenses: Simple, Continuous, Perfect, Perfect Continuous for each time frame.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prepositions</strong> – Show relationships of time, place, or manner (e.g., in, on, at, under, with).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Adjectives &amp; Verbs</strong> – Adjectives describe nouns; verbs express action or state. Master their use to build strong sentences.
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
            Sidemann Academic Registry • English Grammar Guide 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default EnglishGrammar;