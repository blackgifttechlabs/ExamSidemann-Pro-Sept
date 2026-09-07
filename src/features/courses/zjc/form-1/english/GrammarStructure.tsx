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
  Repeat,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ──────────────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  answer: React.ReactNode;
}

interface GrammarSection {
  id: string; // e.g., "nouns"
  title: string;
  description: string;
  details: string[];
  examples?: string[];
  questions: Question[];
  extra?: React.ReactNode; // for extra content like comparison table
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: Parts of Speech Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: GrammarSection[] = [
  {
    id: 'nouns',
    title: 'Nouns (Naming Words)',
    description:
      'A noun is a name of a person, a place, a thing, an animal, or even an idea. If you can see it, touch it, or talk about it as a "thing," it is a noun.',
    details: [
      'Common Nouns: general names (boy, school, dog)',
      'Proper Nouns: specific names, must start with a capital letter (Tendai, Zimbabwe)',
      'Collective Nouns: groups (a herd of cattle, a team of players)',
      'Concrete Nouns: you can touch/see (stone, water, bread)',
      'Abstract Nouns: ideas/feelings (love, hunger, bravery)',
    ],
    examples: ['Harare', 'Sadza', 'Teacher'],
    questions: [
      {
        id: 1,
        question: 'Identify the Proper Noun in this sentence: The girl went to Bulawayo.',
        answer: 'Bulawayo.',
      },
      {
        id: 2,
        question: 'Change the word in brackets into a Collective Noun: A (group) of lions lay under the tree.',
        answer: 'Pride (A pride of lions).',
      },
      {
        id: 3,
        question: 'Which of these is an Abstract Noun? (Table, Freedom, Shoe).',
        answer: 'Freedom.',
      },
      {
        id: 4,
        question: 'Write the following sentence with correct capital letters: my friend chitalu lives in mutare.',
        answer: 'My friend Chitalu lives in Mutare.',
      },
      {
        id: 5,
        question: 'List two Concrete Nouns you can see in your classroom right now.',
        answer: '(Example: Desk, Pen).',
      },
    ],
  },
  {
    id: 'pronouns',
    title: 'Pronouns (Word Swappers)',
    description:
      'A pronoun is a word used in place of a noun. We use them so we don’t have to repeat the same name over and over. Instead of saying "Tendai is tired because Tendai walked to school," we say "Tendai is tired because he walked to school."',
    details: [
      'Personal: I, you, he, she, it, we, they, me, him, her, us, them.',
      'Possessive: mine, yours, his, hers, ours, theirs.',
      'Reflexive: myself, yourself, himself, herself, ourselves, themselves.',
      'Demonstrative: this, that (singular); these, those (plural).',
      'Interrogative: who, whom, whose, which, what.',
      'Relative: who, which, that (connect clauses).',
    ],
    questions: [
      {
        id: 1,
        question: 'Replace the noun with a Personal Pronoun: Chipo is a good singer.',
        answer: 'She (She is a good singer).',
      },
      {
        id: 2,
        question: 'Fill in the blank with a Possessive Pronoun: That pen belongs to me; it is ________.',
        answer: 'Mine.',
      },
      {
        id: 3,
        question: 'Fill in the blank with a Reflexive Pronoun: I washed the car by ________.',
        answer: 'Myself.',
      },
      {
        id: 4,
        question: 'Choose the correct Demonstrative Pronoun: (This/These) oranges are very sweet.',
        answer: 'These.',
      },
      {
        id: 5,
        question: 'Which Interrogative Pronoun fits here? ________ is your best friend?',
        answer: 'Who.',
      },
    ],
  },
  {
    id: 'verbs',
    title: 'Verbs (Action and Being Words)',
    description:
      'A verb tells us what the subject is doing or what the subject is. Every sentence must have a verb. Without a verb, a sentence is "dead."',
    details: [
      'Action Verbs: physical or mental action (run, eat, think, write).',
      'Linking/Auxiliary Verbs: link or help (is, am, are, was, were, have, has, do, can, will).',
      'Transitive Verbs: need an object (I bought bread).',
      'Intransitive Verbs: no object needed (The sun shines).',
    ],
    questions: [
      {
        id: 1,
        question: 'Find the verb: The students play soccer every afternoon.',
        answer: 'Play.',
      },
      {
        id: 2,
        question: 'Is "is" a verb? (Yes/No).',
        answer: 'Yes (Linking/Auxiliary verb).',
      },
      {
        id: 3,
        question: 'Identify the Action Verb: He believes in hard work.',
        answer: 'Believes.',
      },
      {
        id: 4,
        question: 'Add a Helping Verb to this sentence: They ________ going to the market.',
        answer: 'Are.',
      },
      {
        id: 5,
        question: 'Which verb is Intransitive (needs no object)? (Kick, Sleep, Carry).',
        answer: 'Sleep.',
      },
    ],
  },
  {
    id: 'adjectives',
    title: 'Adjectives (Describing Words)',
    description:
      'Adjectives give us more information about nouns. They tell us "What kind," "Which one," or "How many."',
    details: [
      'Positive: just describing one thing (small).',
      'Comparative: comparing two things (smaller).',
      'Superlative: comparing three or more (smallest).',
    ],
    examples: ['The tall boy', 'The red car'],
    questions: [
      {
        id: 1,
        question: 'Identify the adjective: The hungry lion chased the zebra.',
        answer: 'Hungry.',
      },
      {
        id: 2,
        question: 'What is the Comparative form of the word "Good"?',
        answer: 'Better.',
      },
      {
        id: 3,
        question: 'What is the Superlative form of the word "Big"?',
        answer: 'Biggest.',
      },
      {
        id: 4,
        question: 'Use an adjective to describe "Sadza".',
        answer: '(Example: Hot, Delicious, White).',
      },
      {
        id: 5,
        question: 'Find the adjective: Five birds flew over the mountain.',
        answer: 'Five (Adjective of number).',
      },
    ],
  },
  {
    id: 'adverbs',
    title: 'Adverbs (Adding to the Verb)',
    description:
      'Adverbs tell us more about a verb, an adjective, or another adverb. They usually tell us How, When, Where, or To what extent. Many (but not all) end in "-ly."',
    details: [
      'Manner (How): quickly, slowly.',
      'Time (When): now, then, tomorrow.',
      'Place (Where): here, there, inside.',
      'Frequency (How often): always, never, sometimes.',
    ],
    questions: [
      {
        id: 1,
        question: 'Identify the adverb: The girl sang beautifully.',
        answer: 'Beautifully.',
      },
      {
        id: 2,
        question: 'Which word is an adverb of Time? (Softly, Tomorrow, Outside).',
        answer: 'Tomorrow.',
      },
      {
        id: 3,
        question: 'Where is the adverb in this sentence? She arrived late.',
        answer: 'Late.',
      },
      {
        id: 4,
        question: 'Identify the adverb of Place: Please come inside.',
        answer: 'Inside.',
      },
      {
        id: 5,
        question: 'Turn this adjective into an adverb: Slow.',
        answer: 'Slowly.',
      },
    ],
  },
  {
    id: 'misc',
    title: 'Prepositions, Conjunctions, & Interjections',
    description:
      'These small but powerful words connect, position, or express emotion.',
    details: [
      'Prepositions: show relationship (on, in, under, between, across, at, by).',
      'Conjunctions: join words/sentences (FANBOYS: For, And, Nor, But, Or, Yet, So; subordinators: because, although, since, if).',
      'Interjections: express strong emotion (Wow!, Ouch!, Hey!, Alas!).',
    ],
    questions: [
      {
        id: 1,
        question: 'Choose the correct preposition: The cat jumped (over/in) the fence.',
        answer: 'Over.',
      },
      {
        id: 2,
        question: 'Join these sentences using "and": I like tea. I like coffee.',
        answer: 'I like tea and coffee.',
      },
      {
        id: 3,
        question: 'Find the conjunction: I stayed home because it was raining.',
        answer: 'Because.',
      },
      {
        id: 4,
        question: 'Which word is an interjection? Ouch! That needle hurt.',
        answer: 'Ouch!',
      },
      {
        id: 5,
        question: 'Fill in the preposition: We live ________ Zimbabwe.',
        answer: 'In.',
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION RANGES FOR NAVIGATION (just the titles for tabs)
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = SECTIONS_DATA.map((s) => ({
  id: s.id,
  label: s.title.split(' ')[0], // e.g., "Nouns", "Pronouns", etc.
}));

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE QUESTION COMPONENT (reusable)
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
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              {answer}
            </p>
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
const GrammarSectionCard = memo(
  ({
    section,
    isHighlighted,
  }: {
    section: GrammarSection;
    isHighlighted: boolean;
  }) => {
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
          className={`text-xl md:text-2xl font-bold mb-3 ${
            isHighlighted
              ? 'text-indigo-900 dark:text-indigo-100'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {section.title}
        </h3>

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

        {/* Examples if present */}
        {section.examples && section.examples.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {section.examples.map((ex, idx) => (
              <span
                key={idx}
                className="inline-block text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-700"
              >
                {ex}
              </span>
            ))}
          </div>
        )}

        {/* Extra content (like comparison table) if needed */}
        {section.extra && <div className="mb-4">{section.extra}</div>}

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
export const GrammarStructure: React.FC = () => {
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

  // Determine which section index to display (if search results exist, use first match)
  const visibleSections = useMemo(() => {
    if (filteredSections.length === 0) return [];
    // If search is active, show all filtered sections (no tabs)
    if (inputValue.trim()) return filteredSections;
    // Otherwise show active section
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
        // Scroll to it
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
        text: 'English has eight parts of speech, but some linguists classify articles (a, an, the) as a separate part.',
      },
      {
        title: 'Pro Tip',
        text: 'To identify the part of speech, ask: what does this word do in the sentence? Is it naming? Describing? Showing action?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "Nouns" are names – like "people, places, things." Adjectives describe nouns – "big, red, happy."',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse "its" (possessive) with "it\'s" (it is). The apostrophe always means a contraction in this case.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'English has eight parts of speech, but some linguists classify articles (a, an, the) as a separate part.',
      },
      {
        title: 'Pro Tip',
        text: 'To identify the part of speech, ask: what does this word do in the sentence? Is it naming? Describing? Showing action?',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "Nouns" are names – like "people, places, things." Adjectives describe nouns – "big, red, happy."',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse "its" (possessive) with "it\'s" (it is). The apostrophe always means a contraction in this case.',
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
                    ? 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 border-b-4 border-emerald-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40 shadow-xs">
                GRAMMAR – PARTS OF SPEECH
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
            Parts of Speech
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn the building blocks of English. Understand nouns, verbs,
            adjectives, and more. Master grammar with examples and interactive
            practice.
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
                placeholder="Search for a part of speech or question..."
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
          {/* List of sections (cards) */}
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
                <GrammarSectionCard
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
                  className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  💡 Grammar Tip
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
                  <span>Parts covered</span>
                  <span className="font-bold text-green-600 dark:text-green-400">✓ 8</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Knowing the parts of speech helps you build correct sentences,
                improves your writing, and makes you a better speaker.
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
                <strong className="text-white">Nouns:</strong> Names of people,
                places, things, and ideas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pronouns:</strong> Replace nouns
                to avoid repetition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Verbs:</strong> Show action or
                state of being.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Adjectives &amp; Adverbs:</strong>{' '}
                Describe nouns (adjectives) and verbs (adverbs).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prepositions, Conjunctions,
                Interjections:</strong> Connect, position, and express emotion.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrammarStructure;
