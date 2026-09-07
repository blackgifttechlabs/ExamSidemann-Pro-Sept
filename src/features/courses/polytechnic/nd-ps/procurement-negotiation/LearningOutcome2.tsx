import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  SettingsIcon,
  LayersIcon,
  FileText,
  Users,
  UserX,
  UserCheck,
  Handshake,
  Mic,
  Eye,
  Ear,
  Hand,
  MessageCircle,
  UserCog,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  CornerUpRight,
  CornerUpLeft,
  Monitor,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'matrix', label: 'Rapport Matrix' },
  { id: 'body', label: 'Body Language' },
  { id: 'nlp', label: 'NLP VAK' },
  { id: 'eye', label: 'Eye Accessing Cues' },
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
      {
        title: 'Did you know?',
        text: 'The VAK model suggests that people have preferred sensory modalities—visual, auditory, or kinaesthetic—for processing information. Understanding these can improve communication and rapport.',
      },
      {
        title: 'Pro Tip',
        text: 'When building rapport, aim for the "Begrudging Movement" quadrant (high respect and high incentive). Focus on demonstrating competence and mutual benefit.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three communication elements: Words (verbal), Tone (vocal), and Body Language (visual). They form the "WTV" of face-to-face interaction.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely solely on eye accessing cues as a definitive indicator—they are a model, not a science. Always consider context and cultural differences.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The VAK model suggests that people have preferred sensory modalities—visual, auditory, or kinaesthetic—for processing information. Understanding these can improve communication and rapport.',
      },
      {
        title: 'Pro Tip',
        text: 'When building rapport, aim for the "Begrudging Movement" quadrant (high respect and high incentive). Focus on demonstrating competence and mutual benefit.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three communication elements: Words (verbal), Tone (vocal), and Body Language (visual). They form the "WTV" of face-to-face interaction.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t rely solely on eye accessing cues as a definitive indicator—they are a model, not a science. Always consider context and cultural differences.',
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
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper to render a clean card (no coloured left border)
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> COMMUNICATION &amp; RAPPORT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Building Relationship Rapport &{' '}
            <span className="text-sky-300 font-bold italic">
              Communication Mastery
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to Reynolds' Rapport Matrix, observing body language, Neuro‑Linguistic Programming (NLP), and interpreting eye accessing cues.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Users size={14} className="inline mr-1" /> Rapport
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Eye size={14} className="inline mr-1" /> Body Language
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full"> NLP
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, quadrant, VAK..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-indigo-200" />
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
            {/* SECTION 1: Intro */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Building Relationship Rapport: Reynolds' Rapport Matrix (2003)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Building rapport is like making friends. It is about creating a connection with someone, so they feel comfortable and trust you. This is very important in negotiations or any situation where you need to work with someone else. Reynolds' Rapport Matrix helps us understand different levels of rapport.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    Reynolds' Rapport Matrix helps us understand the dynamics of interaction and how they impact rapport. It is important to note that this is a model, and real-life interactions are often more complex.
                  </p>
</div>
            </div>

            {/* SECTION 2: Reynolds' Rapport Matrix */}
            <div
              ref={(el) => {
                sectionRefs.current['matrix'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Reynolds' Rapport Matrix (2003)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-2">
                    <UserX size={16} /> 1. Pushover (Low Respect, Low Incentive to Participate)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The other person does not respect you and does not see any reason to work with you. This leads to very weak or non-existent rapport. Requires a significant shift in behaviour—demonstrate competence, reliability, and value.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                    <UserCheck size={16} /> 2. Respect (High Respect, Low Incentive to Participate)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The other person respects you, but they do not see a reason to work with you. Build rapport by identifying and highlighting mutual benefits—show how collaboration helps them achieve their goals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2">
                    <UserCog size={16} /> 3. No Incentive to Participate (Low Respect, High Incentive to Participate)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The other person sees a reason to work with you, but they do not respect you. Earn their respect by demonstrating integrity, reliability, and competence. Show that you are a valuable partner, not just a means to an end.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                    <Handshake size={16} /> 4. Begrudging Movement (High Respect, High Incentive to Participate)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The other person respects you and sees a reason to work with you, so they are willing to move forward, even if it is not perfect. This is the ideal quadrant for strong rapport and collaborative outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: Observing Body Language */}
            <div
              ref={(el) => {
                sectionRefs.current['body'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Observing Body Language in Negotiation
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When we talk to someone, we use words, but we also use our voice and our body. Observing body language in negotiation means paying close attention to these non verbal cues to understand what the other person is really thinking and feeling, even if they do not say it.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <MessageCircle size={16} /> 1. Words/Verbal (What is Said)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The literal content of spoken words. Can be misleading—people choose words carefully. Tone and body language often reveal true intent. Pay attention to word choice and context.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Mic size={16} /> 2. Tone of Voice/Vocal (How it is Said)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Vocal cues—tone, pitch, volume, pace. Convey emotions and attitudes. Hesitation, raised voice, or speed changes can signal uncertainty, anger, or confidence. Often contradicts verbal message.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                    <Monitor size={16} /> 3. Non-Verbal Behaviour/Visual (What is Shown)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Facial expressions, eye contact, posture, gestures, body movements. Reveal emotions and intentions—crossed arms (defensive), leaning forward (interest), eye contact (attentiveness). Interpret in clusters and consider cultural context.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Neuro-Linguistic Programming (NLP) - VAK */}
            <div
              ref={(el) => {
                sectionRefs.current['nlp'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Neuro-Linguistic Programming (NLP) – The VAK Model
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine your brain is like a computer, and your experiences are like programs running on it. NLP is like learning to understand and change those programs to make your life better. It looks at how we use our senses (seeing, hearing, feeling) and language to create our experiences.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    The VAK model suggests that people have preferred ways of processing information:
                  </p>
                  <ul className="list-disc pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 mt-2">
                    <li><strong>Visual:</strong> People who prefer to see information.</li>
                    <li><strong>Auditory:</strong> People who prefer to hear information.</li>
                    <li><strong>Kinaesthetic:</strong> People who prefer to feel or experience information.</li>
                  </ul>
</div>
            </div>

            {/* SECTION 5: Interpreting Eye Accessing Cues */}
            <div
              ref={(el) => {
                sectionRefs.current['eye'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Interpreting Eye Accessing Cues
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine your eyes are like little windows to your brain. When you are thinking about different things, your eyes tend to move in certain directions. These eye movements can give clues about how you are accessing information—whether you are picturing something, remembering a sound, or feeling something.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    <strong>Important Note:</strong> Eye accessing cues are a part of Neuro-Linguistic Programming (NLP) and are not universally accepted as scientifically proven. They are considered a model that can be helpful, but not always accurate. Also, remember that people can learn to manipulate their eye movements.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Visual Creation (Vc)', icon: <ArrowUpRight size={16} />, content: 'Looking up and to your right; imagining something you have never seen before. Constructing a visual image (e.g., purple elephant with yellow spots). Brainstorming new ideas or visualizing future scenarios.' },
                  { title: '2. Auditory Creation (Ac)', icon: <CornerUpRight size={16} />, content: 'Looking to your right at ear level; imagining a sound you have never heard before. Constructing a new sound (e.g., cat meowing underwater). Creating new melodies, hypothetical conversations.' },
                  { title: '3. Kinaesthetic (Feelings) (K)', icon: <ArrowDownRight size={16} />, content: 'Looking down and to your right; accessing feelings or physical sensations. Remembering emotions (happiness, sadness) or physical sensations (cold, warmth). Gut feelings and emotional responses.' },
                  { title: '4. Visual Remembered (Vr)', icon: <ArrowUpLeft size={16} />, content: 'Looking up and to your left; remembering something you have seen before. Recalling visual memories (faces, places, past events). Referencing previous agreements or documents.' },
                  { title: '5. Auditory Remembered (Ar)', icon: <CornerUpLeft size={16} />, content: 'Looking to your left at ear level; remembering a sound you have heard before. Recalling auditory memories (voices, songs, conversations). Remembering previous conversations or specific phrases.' },
                  { title: '6. Internal Dialogue (Ad)', icon: <ArrowDownLeft size={16} />, content: 'Looking down and to your left; talking to yourself in your head. Engaging in internal conversation, thinking through problems, planning strategies, rehearsing speeches. Considering next moves or evaluating options.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Communication Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Rapport Quadrants</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Communication Elements</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Eye Accessing Cues</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Rapport is built through mutual respect and incentive. Reynolds' Matrix helps identify where you stand. Effective communication combines words, tone, and body language. NLP VAK (Visual, Auditory, Kinaesthetic) preferences influence how people process information. Eye accessing cues offer insight into thought processes, but use them as part of a broader observation strategy, not as definitive proof.
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
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Reynolds' Rapport Matrix</strong> – four quadrants: Pushover (low respect, low incentive), Respect (high respect, low incentive), No Incentive (low respect, high incentive), Begrudging Movement (high respect, high incentive). Aim for the last quadrant.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Body Language Elements</strong> – Words (what is said), Tone (how it is said), and Non-Verbal Behaviour (what is shown). Observe all three for accurate understanding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">NLP VAK Model</strong> – Visual, Auditory, Kinaesthetic preferences influence how people learn and communicate. Tailor your communication to match the other person's preferred modality.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Eye Accessing Cues</strong> – eye movements can indicate whether someone is creating or recalling visual, auditory, or kinaesthetic information. Use as a guide, not absolute proof, and consider context and cultural differences.
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
            Sidemann Academic Registry • Communication &amp; Rapport Mastery 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;