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
  Utensils,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  FileText,
  Edit3,
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
  id: string; // e.g., "process", "paragraphs", "assessment"
  title: string;
  subtitle?: string;
  description: string;
  details: string[];
  examples?: React.ReactNode; // for rich content like hamburger model
  questions: Question[];
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: Composition Writing Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'process',
    title: 'The Writing Process',
    subtitle: 'How to Start and Finish',
    description:
      'Writing is like building a house. You need a plan, build the walls correctly, and then paint it to make it look good. These are the five steps you should follow.',
    details: [
      'Step 1: Brainstorming & Planning – gather ideas (mind maps).',
      'Step 2: Organizing – make an outline (Introduction, Body, Conclusion).',
      'Step 3: Drafting – write the first version; don\'t worry about mistakes.',
      'Step 4: Revising – make it better; add/remove/change content.',
      'Step 5: Editing & Proofreading – fix spelling, grammar, punctuation.',
    ],
    examples: (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-slate-700">
        <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">Mind Map Example</h5>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Main Idea</span>
          <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Supporting 1</span>
          <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Supporting 2</span>
          <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">Supporting 3</span>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which step comes first: Drafting or Brainstorming?',
        answer: 'Brainstorming.',
      },
      {
        id: 2,
        question: 'What is a Mind Map used for?',
        answer: 'It is used for organizing ideas and seeing how they connect.',
      },
      {
        id: 3,
        question: 'If you are checking your story for spelling mistakes, which step are you doing?',
        answer: 'Editing/Proofreading.',
      },
      {
        id: 4,
        question: 'Why is it okay to make mistakes during the Drafting stage?',
        answer: 'Because the goal of drafting is just to get ideas down; you can fix mistakes later.',
      },
      {
        id: 5,
        question: 'What do we call the list we make to show the order of our ideas?',
        answer: 'An Outline.',
      },
    ],
  },
  {
    id: 'paragraphs',
    title: 'Paragraph Writing',
    subtitle: 'The Building Blocks',
    description:
      'A paragraph is like a hamburger: it has a top bun (topic sentence), meat and salad (supporting sentences), and a bottom bun (concluding sentence). Every sentence must stick to the same topic (Unity) and follow a logical order (Coherence).',
    details: [
      'Topic Sentence: The first sentence; tells the reader exactly what the paragraph is about.',
      'Supporting Sentences: Provide details, examples, and explanation.',
      'Concluding Sentence: The last sentence; summarizes and wraps up the paragraph.',
      'Unity: Every sentence must be about the same topic.',
      'Coherence: Sentences must stick together in a logical order.',
      'Transitions: Words like first, next, also, however, therefore connect ideas.',
    ],
    examples: (
      <div className="mt-4 space-y-4">
        {/* Hamburger Model */}
        <div className="p-6 bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Utensils className="text-orange-600" size={28} />
            <h4 className="text-lg font-black uppercase text-orange-800 dark:text-orange-400">The Hamburger Model</h4>
          </div>
          <div className="space-y-3 text-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded-t-2xl">
              <span className="font-bold text-yellow-800 dark:text-yellow-400">Top Bun: Topic Sentence</span>
              <p className="text-xs text-yellow-700 dark:text-yellow-500">The first sentence. It tells the reader exactly what the paragraph is about.</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 border-2 border-green-400">
              <span className="font-bold text-green-800 dark:text-green-400">Meat &amp; Salad: Supporting Sentences</span>
              <p className="text-xs text-green-700 dark:text-green-500">Give more information, details, and examples. Explain the Topic Sentence.</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded-b-2xl">
              <span className="font-bold text-yellow-800 dark:text-yellow-400">Bottom Bun: Concluding Sentence</span>
              <p className="text-xs text-yellow-700 dark:text-yellow-500">The last sentence. Summarizes everything and finishes the thought.</p>
            </div>
          </div>
        </div>

        {/* Example Paragraph */}
        <div className="p-4 bg-slate-900 text-white rounded-xl">
          <p className="text-sm leading-relaxed italic">
            <span className="text-blue-400 font-black">(Topic Sentence)</span> Playing soccer is the most popular sport at our school.{' '}
            <span className="opacity-70">(Supporting)</span> Every afternoon, dozens of students gather on the dusty field to practice their skills. Even students who do not play like to sit on the grass and cheer for their friends. Furthermore, our school team often travels to other villages to compete in tournaments.{' '}
            <span className="text-blue-400 font-black">(Concluding)</span> It is clear that soccer brings our whole school community together.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the name of the sentence that tells us the main idea of the paragraph?',
        answer: 'The Topic Sentence.',
      },
      {
        id: 2,
        question: 'If I am writing a paragraph about "Dogs," and I include a sentence about "Cats," which rule am I breaking? (Unity or Coherence?)',
        answer: 'Unity (Because you brought in a different topic).',
      },
      {
        id: 3,
        question: 'What is a Concluding Sentence?',
        answer: 'The last sentence that wraps up the paragraph and reminds us of the main point.',
      },
      {
        id: 4,
        question: 'Give an example of a Transition Word that shows the order of events.',
        answer: '(Example: First, Next, or Then).',
      },
      {
        id: 5,
        question: 'What do Supporting Sentences do?',
        answer: 'They give details, examples, and evidence to explain the topic sentence.',
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Final Assessment',
    subtitle: 'Putting It All Together',
    description:
      'Test your understanding of the writing process and paragraph structure with these practical questions. Read the sample paragraph and answer the questions below.',
    details: [
      'The Writing Process: order the steps correctly.',
      'Paragraph Structure: identify topic, supporting, and concluding sentences.',
      'Unity and Coherence: find the sentence that doesn’t belong.',
      'Transitions: identify connecting words.',
    ],
    examples: (
      <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Sample Paragraph</h5>
        <p className="text-sm italic leading-relaxed text-slate-700 dark:text-slate-300">
          "(1) Zimbabwe is a very beautiful country with many tourist attractions. (2) I like eating mangoes in the summer. (3) The Victoria Falls is one of the most famous sights in the world, where water thunders down into the gorge. (4) Also, the Eastern Highlands have cool air and green mountains. (5) Therefore, many people travel from far away to see the natural beauty of Zimbabwe."
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which sentence is the Topic Sentence?',
        answer: 'Sentence 1 (Zimbabwe is a beautiful country...).',
      },
      {
        id: 2,
        question: 'Which sentence does NOT belong in this paragraph? (It breaks the rule of Unity).',
        answer: 'Sentence 2 (I like eating mangoes...). It has nothing to do with tourist attractions.',
      },
      {
        id: 3,
        question: 'Which sentence is the Concluding Sentence?',
        answer: 'Sentence 5 (Therefore, many people travel...).',
      },
      {
        id: 4,
        question: 'Find a Transition Word used in this paragraph.',
        answer: 'Also or Therefore.',
      },
      {
        id: 5,
        question: 'Rewrite the paragraph correctly (mental check).',
        answer: (
          <span>
            Corrected Paragraph: "Zimbabwe is a very beautiful country with many tourist attractions. The Victoria Falls is one of the most famous sights in the world, where water thunders down into the gorge. Also, the Eastern Highlands have cool air and green mountains. Therefore, many people travel from far away to see the natural beauty of Zimbabwe."
          </span>
        ),
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = SECTIONS_DATA.map((s) => ({ id: s.id, label: s.title.split(' ')[0] }));

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE QUESTION COMPONENT (reused)
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
export const CompositionWriting: React.FC = () => {
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

  // Determine which section to show (if search active, show all filtered; else show active tab)
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
        text: 'The word "composition" comes from Latin "componere" meaning "to put together." You are putting words and ideas together to create meaning.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a strong topic sentence. It acts like a roadmap for your reader and keeps your writing focused.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the "5 Ws" – Who, What, When, Where, Why – to make sure your paragraph has all the important details.',
      },
      {
        title: 'Common Mistake',
        text: 'Many writers forget to proofread. Always read your work aloud to catch errors and awkward sentences.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "composition" comes from Latin "componere" meaning "to put together." You are putting words and ideas together to create meaning.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with a strong topic sentence. It acts like a roadmap for your reader and keeps your writing focused.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the "5 Ws" – Who, What, When, Where, Why – to make sure your paragraph has all the important details.',
      },
      {
        title: 'Common Mistake',
        text: 'Many writers forget to proofread. Always read your work aloud to catch errors and awkward sentences.',
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
                    ? 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40 shadow-xs">
                COMPOSITION WRITING
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
            Composition Writing
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn the step‑by‑step process of writing, master the hamburger
            paragraph model, and practice with interactive questions. Build
            your writing skills with confidence.
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
                placeholder="Search for a topic, step, or question..."
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
                  <X size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
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
                  className="rounded-2xl border-2 border-b-4 border-violet-800 bg-violet-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-violet-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  💡 Writing Tip
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
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Writing Steps</span>
                  <span className="font-bold text-green-600 dark:text-green-400">✓ 5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Good writing takes practice. Start with a plan, write freely,
                then revise and polish. Every great writer started as a beginner.
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
                <strong className="text-white">The Writing Process:</strong>{' '}
                Brainstorm → Organize → Draft → Revise → Edit/Proofread.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Paragraph Structure:</strong>{' '}
                Topic Sentence → Supporting Sentences → Concluding Sentence.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Unity &amp; Coherence:</strong>{' '}
                Stay on topic and order sentences logically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transitions:</strong> Use bridge
                words to connect ideas smoothly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                Use the search bar to quickly find any part of the lesson.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompositionWriting;
