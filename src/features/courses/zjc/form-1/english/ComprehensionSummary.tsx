import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  BookOpen,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Sparkles,
  GraduationCap,
  Trophy,
  Layers,
  Target,
  AlignLeft,
  FileText,
  Edit3,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Info,
  ClipboardList,
  Eye,
  Brain,
  MessageSquare,
  List,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ──────────────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  answer: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  details: string[];
  examples: React.ReactNode;
  questions: Question[];
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: Comprehension & Summary Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'comprehension',
    title: 'Comprehension Questions',
    subtitle: 'The Four Levels of Understanding',
    description:
      'Comprehension is about understanding, not just reading. In an exam, the teacher wants to see if you can find information, think for yourself, and explain things in your own words. There are four levels of comprehension questions.',
    details: [
      'Literal Questions ("Right There"): Easiest questions. The answer is written right there. Starts with Who, What, Where, When.',
      'Inferential Questions ("Detective"): Answers are not direct. Use clues to figure it out. Starts with Why or How.',
      'Evaluative Questions ("Your Opinion"): Ask for your judgment. No "wrong" answer if you explain why based on the story.',
      'Vocabulary (Contextual): Meaning in context. Do not give a dictionary definition. Give the meaning based on the story.',
    ],
    examples: (
      <div className="space-y-6">
        {/* Four types grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase mb-2 text-center">
              A. Literal Questions
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Who, What, Where, When.</strong> The answer is written
              right there. Just copy the correct info, but make sure your grammar
              is correct.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
              B. Inferential Questions
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Why or How.</strong> Answers are not direct. Use clues to
              figure it out. Example: "Shivering" + "teeth chattering" = Cold.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
              C. Evaluative Questions
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask for your judgment. No "wrong" answer if you explain why based
              on the story. Example: "Do you think Farai was brave?"
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase mb-2 text-center">
              D. Vocabulary (Contextual)
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Meaning in context. Do not give a dictionary definition. Example:
              "The river was running fast." (Running = Flowing).
            </p>
          </div>
        </div>

        {/* Practice Passage */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl italic font-serif">
          <h5 className="not-italic font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Practice Passage
          </h5>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            "Tendai sprinted to the bus stop, but the big blue bus had already
            pulled away, leaving a cloud of stinking smoke behind."
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Literal: What color was the bus?',
        answer: 'The bus was blue.',
      },
      {
        id: 2,
        question: 'Literal: Where was Tendai going?',
        answer: 'He was going to the bus stop.',
      },
      {
        id: 3,
        question: 'Inferential: Did Tendai catch the bus? How do you know?',
        answer: 'No, he did not catch it. We know this because it says the bus "had already pulled away".',
      },
      {
        id: 4,
        question: 'Vocabulary: What does the word "sprinted" tell us about how Tendai moved?',
        answer: 'It means he ran very fast.',
      },
      {
        id: 5,
        question: 'Evaluative: How would you feel if you were Tendai in this situation?',
        answer: '(Example: I would feel frustrated and sad because I would be late for my journey.)',
      },
    ],
  },
  {
    id: 'summary',
    title: 'Summary Writing',
    subtitle: 'The Art of the Shortcut',
    description:
      'Summarizing is taking a long piece of writing and making it very short while keeping only the main points. You must use your own words and avoid repeating the same thing. Follow these five steps to write a perfect summary.',
    details: [
      'Step 1: Identifying Main Points – Read the instructions carefully! Only look for the specific information asked for.',
      'Step 2: Eliminating Unnecessary Details – Throw away "extra" words. Remove adjectives, examples, and long descriptions.',
      'Step 3: Paraphrasing – Use your own words. Show the examiner you understand the meaning.',
      'Step 4: Maintaining Meaning – Don\'t change facts! If the story says "sad", don\'t say "angry".',
      'Step 5: Word Limits – Count your words! If the limit is 60 and you write 61, the teacher will stop reading at 60.',
    ],
    examples: (
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl space-y-4">
        <h5 className="font-bold uppercase text-xs text-blue-400 tracking-widest flex items-center gap-2">
          <AlignLeft size={14} /> Example: Cooking Rice
        </h5>
        <p className="text-sm leading-relaxed italic opacity-80">
          "Cooking the perfect pot of rice requires several steps. First, you
          must measure the rice and wash it under cold water until the water is
          clear... Next, add two cups of water... add salt... bring to a boil...
          turn heat low... lid on... wait 20 mins... sit before eating."
        </p>
        <div className="bg-white/10 p-4 border border-white/20 rounded-lg">
          <span className="text-[10px] font-bold uppercase text-blue-300 block mb-2">
            30-Word Summary:
          </span>
          <p className="text-sm font-bold leading-relaxed">
            First, wash the rice and place it in a pot with water and salt. Bring
            to a boil, then cover and simmer on low heat for twenty minutes
            before serving. (30 words)
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the main goal of a summary?',
        answer: 'To give only the main ideas of a text in a short way.',
      },
      {
        id: 2,
        question: 'If a summary has a 40-word limit, what happens if you write 50 words?',
        answer: 'The examiner will stop marking after the 40th word.',
      },
      {
        id: 3,
        question: 'What should you do with adjectives and examples when writing a summary?',
        answer: 'You should remove them (eliminate them).',
      },
      {
        id: 4,
        question: 'What does "Paraphrasing" mean?',
        answer: 'Writing the same meaning using your own words.',
      },
      {
        id: 5,
        question: 'Why is it important to read the summary "instruction" first?',
        answer: 'So you know exactly which specific information you are looking for.',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment',
    subtitle: 'Putting it all together',
    description:
      'Test your comprehension and summary skills with these practice passages. Read each passage carefully, then answer the questions. Remember the four levels of comprehension and the five steps of summary writing.',
    details: [
      'Section A: Comprehension – Read the passage and answer the questions.',
      'Section B: Summary – Read the passage and write a summary.',
    ],
    examples: (
      <div className="space-y-6">
        {/* Section A Passage */}
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl italic font-serif">
          <h5 className="not-italic font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Section A: Comprehension Passage
          </h5>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            "Gogo lived in a small hut at the edge of the forest. Every morning,
            she walked three kilometers to the borehole to fetch water. Her
            plastic bucket was heavy, and her knees often ached, but she never
            complained. One morning, she saw a strange, shimmering object buried
            in the sand. She leaned down, her heart racing like a trapped bird.
            It was a silver coin from a time long ago."
          </p>
        </div>

        {/* Section B Passage */}
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl italic font-serif">
          <h5 className="not-italic font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
            Section B: Summary Passage
          </h5>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            "To stay healthy, a person must do several things. They must eat a
            variety of fruits and vegetables every day. It is also important to
            drink at least two liters of clean water. Exercise, such as walking
            or playing soccer, helps keep the heart strong. Finally, getting
            eight hours of sleep every night allows the body to rest and repair
            itself."
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Literal: Where was Gogo\'s hut located?',
        answer: 'At the edge of the forest.',
      },
      {
        id: 2,
        question: 'Literal: How far did she walk to the borehole?',
        answer: 'Three kilometers.',
      },
      {
        id: 3,
        question: 'Inferential: How do we know Gogo was a hard worker?',
        answer: 'Because she walked a long way with a heavy bucket and never complained even though she was in pain.',
      },
      {
        id: 4,
        question: 'Vocabulary: What does the word "ached" tell us about her knees?',
        answer: 'It means they were sore or painful.',
      },
      {
        id: 5,
        question: 'Evaluative: Why do you think her heart was "racing like a trapped bird"?',
        answer: 'She was feeling excited or nervous because she found something unusual.',
      },
      {
        id: 6,
        question: 'Summary Task: In exactly 20 words or less, summarize the main ways to stay healthy.',
        answer: 'To stay healthy, eat well, drink plenty of water, exercise regularly, and get enough sleep every night. (17 words).',
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = SECTIONS_DATA.map((s) => ({ id: s.id, label: s.title.split(' ')[0] }));

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE QUESTION COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const InteractiveQuestion = memo(
  ({
    question,
    answer,
    index,
  }: {
    question: string;
    answer: React.ReactNode;
    index: number;
  }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Question {index}
          </span>
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isRevealed
                ? 'text-green-600 dark:text-green-400'
                : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
            }`}
          >
            {isRevealed ? (
              <>
                <CheckCircle size={14} /> Answer
              </>
            ) : (
              <>
                <HelpCircle size={14} /> Reveal
              </>
            )}
          </button>
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {question}
        </p>
        {isRevealed && (
          <div className="mt-3 animate-dropdown-reveal rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
              {answer}
            </div>
          </div>
        )}
      </div>
    );
  },
  (prev, next) => prev.index === next.index && prev.question === next.question
);

// ──────────────────────────────────────────────────────────────────────────────
// SECTION CARD COMPONENT (memoized)
// ──────────────────────────────────────────────────────────────────────────────
const SectionCard = memo(
  ({ section, isHighlighted }: { section: Section; isHighlighted: boolean }) => {
    return (
      <div
        id={`section-${section.id}`}
        className={`rounded-xl border p-4 md:p-6 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isHighlighted
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/50 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
      >
        <h3
          className={`text-xl md:text-2xl font-bold mb-1 ${
            isHighlighted
              ? 'text-indigo-900 dark:text-indigo-100'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {section.title}
        </h3>
        {section.subtitle && (
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            {section.subtitle}
          </p>
        )}
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {section.description}
        </p>

        {/* Details as bullet list */}
        <div className="mb-4 rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5">
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {section.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples (rich content) */}
        {section.examples && <div className="mb-4">{section.examples}</div>}

        {/* Questions */}
        <div className="space-y-3 mt-2">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2"> Test Your Knowledge
          </h4>
          {section.questions.map((q, idx) => (
            <InteractiveQuestion
              key={q.id}
              question={q.question}
              answer={q.answer}
              index={idx + 1}
            />
          ))}
        </div>
      </div>
    );
  },
  (prev, next) => prev.isHighlighted === next.isHighlighted
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const ComprehensionSummary: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!inputValue.trim()) return SECTIONS_DATA;
    const query = inputValue.toLowerCase();
    return SECTIONS_DATA.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.details.some((d) => d.toLowerCase().includes(query)) ||
        s.questions.some((q) => q.question.toLowerCase().includes(query))
    );
  }, [inputValue]);

  // Determine which section to show
  const visibleSections = useMemo(() => {
    if (filteredSections.length === 0) return [];
    if (inputValue.trim()) return filteredSections;
    const active = SECTIONS_DATA[activeSectionIndex];
    return active ? [active] : [];
  }, [filteredSections, activeSectionIndex, inputValue]);

  // Debounced search highlight
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }
    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = SECTIONS_DATA.find(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.details.some((d) => d.toLowerCase().includes(query)) ||
          s.questions.some((q) => q.question.toLowerCase().includes(query))
      );
      if (match) {
        setHighlightedId(match.id);
        window.setTimeout(() => {
          const el = document.getElementById(`section-${match.id}`);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 0);
      } else {
        setHighlightedId(null);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    setHighlightedId(null);
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "comprehension" comes from Latin "comprehendere" meaning "to grasp." You are grasping the meaning of the text.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before reading the passage. This helps you know exactly what to look for as you read.',
      },
      {
        title: 'Memory Trick',
        text: 'For summary writing, remember the "5 Ws" – Who, What, When, Where, Why – to make sure you capture the main points.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students copy directly from the passage in summaries. Always paraphrase to show your understanding.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "comprehension" comes from Latin "comprehendere" meaning "to grasp." You are grasping the meaning of the text.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before reading the passage. This helps you know exactly what to look for as you read.',
      },
      {
        title: 'Memory Trick',
        text: 'For summary writing, remember the "5 Ws" – Who, What, When, Where, Why – to make sure you capture the main points.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students copy directly from the passage in summaries. Always paraphrase to show your understanding.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="mx-auto px-[5px] sm:px-6 md:px-8">
        <div className="flex w-full items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_TABS.map((tab, idx) => {
            const isActive = activeSectionIndex === idx && !inputValue.trim();
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(idx)}
                className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                  isActive
                    ? 'bg-sky-600 border-b-4 border-sky-800 text-white shadow-sm'
                    : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Duolingo Gradient Header ───────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-700 border-b-4 border-blue-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-sky-400/30 text-white border border-sky-200/40 shadow-xs">
                COMPREHENSION &amp; SUMMARY SKILLS
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • English
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                📚 {SECTIONS_DATA.length} sections
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                ✨ {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)} questions
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            Comprehension &amp; Summary
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn the four levels of comprehension questions and the five steps
            to write a perfect summary. Practice with passages and interactive
            questions, then test your skills in the final assessment.
          </p>

          {/* Duolingo Search Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-black/20 backdrop-blur-md rounded-2xl border-2 border-white/25 focus-within:border-white focus-within:bg-black/30 transition-all shadow-inner">
              <Search className="ml-4 text-white/70" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a topic, level, or question..."
                className="w-full bg-transparent border-none outline-none py-2.5 px-3 text-sm text-white placeholder-white/60 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    setHighlightedId(null);
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={16} className="text-white/80" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Duolingo Sticky Navigation ──────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {inputValue.trim()
                  ? `Search results (${filteredSections.length})`
                  : `${SECTION_TABS[activeSectionIndex]?.label || ''}`}
              </span>
              <span>{visibleSections.length} shown</span>
            </div>

            {visibleSections.length > 0 ? (
              visibleSections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isHighlighted={section.id === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No sections match your search.
              </div>
            )}

            {/* Duolingo-Styled Next / Previous Navigation Footer */}
            {!inputValue.trim() && (
              <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 dark:border-slate-800 pt-6">
                <button
                  onClick={() => scrollToSection(Math.max(0, activeSectionIndex - 1))}
                  disabled={activeSectionIndex === 0}
                  className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-5 py-2.5 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-[#27272a] active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
                >
                  ← Previous
                </button>
                <span className="text-xs font-black tracking-wider text-slate-400">
                  {activeSectionIndex + 1} / {SECTION_TABS.length}
                </span>
                <button
                  onClick={() => scrollToSection(Math.min(SECTION_TABS.length - 1, activeSectionIndex + 1))}
                  disabled={activeSectionIndex === SECTION_TABS.length - 1}
                  className="rounded-2xl border-2 border-b-4 border-sky-800 bg-sky-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-sky-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Reading Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span>Question Levels</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Summary Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                For comprehension, read the questions first. For summary, always
                paraphrase and count your words. Practice makes perfect!
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Literal:</strong> Answers are
                directly in the text (Who, What, Where, When).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inferential:</strong> Use clues
                to figure out the answer (Why, How).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Evaluative:</strong> Your opinion
                backed by evidence from the text.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Vocabulary:</strong> Understand
                words in context, not just dictionary definitions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Summary:</strong> Identify main
                points, eliminate details, paraphrase, respect word limits.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComprehensionSummary;
