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
  Shirt,
  Bug,
  Zap,
  User,
  MessageSquare,
  AlertCircle,
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
// DATA: Language in Use Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'register',
    title: 'Register and Tone (English Clothes)',
    description:
      'Language is like a wardrobe of clothes. You wouldn\'t wear your oldest, torn clothes to a wedding, and you wouldn\'t wear a fancy suit to dig in the garden. Choose the right register for the right situation.',
    details: [
      'Formal: Used for teachers, elders, or exams. Uses full words (e.g., "I apologize for being late.").',
      'Informal: Used for friends and siblings. Uses slang and contractions (e.g., "Sorry I\'m late, guys!").',
      'Respect and Hunhu: In Zimbabwe, we show respect with polite phrases (e.g., "May I please borrow that book, Sir?").',
      'Slang vs. Standard English: Standard is for school/business; slang is "township talk" for friends.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              A. Formal vs. Informal
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Formal:</strong> "I apologize for being late."<br />
              <strong>Informal:</strong> "Sorry I'm late, guys!"
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              B. Respect and Hunhu
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="text-red-500">Impolite:</span> "Give me that book."<br />
              <span className="text-green-500">Polite:</span> "May I please borrow that book, Sir?"
            </p>
          </div>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
            C. Slang vs. Standard English
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center text-xs font-mono">
              Slang: "That guy is fresh."
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-center text-xs font-mono">
              Standard: "That young man is very smart."
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which register should you use when writing a letter to the Headmaster?',
        answer: 'Formal Register.',
      },
      {
        id: 2,
        question: "Rewrite this informal sentence formally: 'I'm gonna go now.'",
        answer: "'I am going to leave now.'",
      },
      {
        id: 3,
        question: "Choose the more polite sentence: (A) 'Shut the door!' (B) 'Would you mind closing the door, please?'",
        answer: '(B) is more polite.',
      },
      {
        id: 4,
        question: "What is the difference between 'Standard English' and 'Slang'?",
        answer: 'Standard English is for school and business (correct grammar); Slang is casual talk for friends.',
      },
      {
        id: 5,
        question: 'If you are talking to your best friend at the borehole, are you using Formal or Informal language?',
        answer: 'Informal language.',
      },
    ],
  },
  {
    id: 'errors',
    title: 'Common Errors (Fixing the "Bugs")',
    description:
      'Every writer makes mistakes. The key is to recognise and fix them. These are the most common errors in English writing and speaking.',
    details: [
      'Subject-Verb Agreement: One person = Verb needs "s"; Many people = No "s" on verb.',
      'Tense Consistency: If you start in the past, stay in the past.',
      'Misplaced Modifiers: Keep phrases close to what they describe to avoid confusion.',
      'Run-on Sentences: Don\'t join too many sentences with commas or no punctuation.',
      'Fragments: Every sentence needs a subject and a verb.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
            A. Subject-Verb Agreement
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-mono text-center">
              ❌ The student play soccer.
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-mono text-center">
              ✅ The student plays soccer.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              B. Tense Consistency
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              ❌ "Yesterday I go to the shop and buy bread."<br />
              ✅ "Yesterday I went to the shop and bought bread."
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              C. Misplaced Modifiers
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              ❌ "I saw a huge elephant wearing my glasses."<br />
              ✅ "Wearing my glasses, I saw a huge elephant."
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "Fix the subject-verb agreement: 'The teachers speaks to the class.'",
        answer: "'The teachers speak to the class' (Plural) OR 'The teacher speaks' (Singular).",
      },
      {
        id: 2,
        question: "Fix the tense: 'Last night I eat sadza and sleep early.'",
        answer: "'Last night I ate sadza and slept early.'",
      },
      {
        id: 3,
        question: "Is this a Run-on or a Fragment?: 'Running down the road very fast.'",
        answer: 'Fragment (It is missing a subject. Who was running?).',
      },
      {
        id: 4,
        question: "Correct this sentence: 'He don't like tea.'",
        answer: "'He doesn't like tea.' (Remember: He is one person).",
      },
      {
        id: 5,
        question: "Fix this run-on: 'I am tired I want to go to bed now.'",
        answer: "'I am tired. I want to go to bed now.'",
      },
    ],
  },
  {
    id: 'confusing',
    title: 'Confusing Words (Homophones)',
    description:
      'Homophones are words that sound the same but have different meanings and spellings. These are the most commonly confused pairs in English.',
    details: [
      'There (place) vs. Their (belonging) vs. They\'re (they are).',
      'Your (belongs to you) vs. You\'re (you are).',
      'Its (belongs to it) vs. It\'s (it is).',
      'To (direction) vs. Too (also) vs. Two (number).',
      'Then (time) vs. Than (comparison).',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm text-center">
          <h5 className="font-bold text-purple-600 dark:text-purple-400 text-xs uppercase mb-2">Place vs Belonging</h5>
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
            <strong>There:</strong> Place (Over there)<br />
            <strong>Their:</strong> Belonging (Their home)<br />
            <strong>They're:</strong> They are
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm text-center">
          <h5 className="font-bold text-purple-600 dark:text-purple-400 text-xs uppercase mb-2">You</h5>
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
            <strong>Your:</strong> Belongs to you<br />
            <strong>You're:</strong> You are
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm text-center">
          <h5 className="font-bold text-purple-600 dark:text-purple-400 text-xs uppercase mb-2">It</h5>
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
            <strong>Its:</strong> Belongs to it<br />
            <strong>It's:</strong> It is
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "'Go put the buckets over (their / there).'",
        answer: 'There (Place).',
      },
      {
        id: 2,
        question: "'(They're / Their) house is very big.'",
        answer: 'Their (Belonging).',
      },
      {
        id: 3,
        question: "'I think (you're / your) going to pass the exam.'",
        answer: "You're (You are).",
      },
      {
        id: 4,
        question: "'The cat licked (it's / its) paw.'",
        answer: 'Its (Belonging).',
      },
      {
        id: 5,
        question: "'I forgot (you're / your) name.'",
        answer: 'Your (Belonging).',
      },
    ],
  },
  {
    id: 'spelling',
    title: 'Spelling Mastery',
    description:
      'Spelling is a skill that improves with practice. These are three of the most important spelling rules in English. Master them and you will avoid many common mistakes.',
    details: [
      'Rule 1: "I" before "E" except after "C" – Believe, Relieve, but Receive.',
      'Rule 2: Doubling the letter – Accommodation, Necessary, Tomorrow.',
      'Rule 3: Silent letters – Know, Write, Comb.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-sm">
          <h5 className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400 mb-2 text-center">Rule 1</h5>
          <p className="text-sm font-bold text-center">"I" before "E"<br />except after "C"</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2">Believe, Relieve<br />but Receive</p>
        </div>
        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-sm">
          <h5 className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400 mb-2 text-center">Rule 2</h5>
          <p className="text-sm font-bold text-center">Doubling<br />the letter</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2">Accommodation<br />Necessary<br />Tomorrow</p>
        </div>
        <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl shadow-sm">
          <h5 className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400 mb-2 text-center">Rule 3</h5>
          <p className="text-sm font-bold text-center">Silent<br />letters</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2">
            <strong>K</strong>now<br /><strong>W</strong>rite<br />Com<strong>b</strong>
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "Which is correct: 'Recieve' or 'Receive'?",
        answer: 'Receive ("I" before "E" except after "C").',
      },
      {
        id: 2,
        question: "What is the correct spelling: 'Necessary' or 'Necesary'?",
        answer: 'Necessary (double "c" and single "s").',
      },
      {
        id: 3,
        question: "Which word has a silent letter: 'Comb' or 'Come'?",
        answer: 'Comb (the "b" is silent).',
      },
      {
        id: 4,
        question: "What is the correct spelling: 'Accommodation' or 'Acomodation'?",
        answer: 'Accommodation (double "c" and double "m").',
      },
      {
        id: 5,
        question: "Which is correct: 'Believe' or 'Beleive'?",
        answer: 'Believe ("I" before "E").',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment',
    subtitle: 'Put it all together',
    description:
      'Test your understanding of register, common errors, confusing words, and spelling rules. Apply everything you have learned in these practical exercises.',
    details: [
      'Part 1: Formal vs. Informal – Choose the correct register for the situation.',
      'Part 2: Fixing Sentences – Correct common errors.',
      'Part 3: Word Order and Logic – Fix misplaced modifiers and fragments.',
    ],
    examples: (
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Teacher\'s Farewell</h5>
        <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
          "You now have the full map to navigate the English language. You know how to build words,
          how to write stories, how to speak with respect, and how to avoid the mistakes that trip
          people up. Read every book you can find, write in your diary every day, and don't be
          afraid to speak up in class. You have the power to succeed!"
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: "You want to ask your teacher for help with a math problem. Which sentence is best? (1) 'Hey, help me with this.' (2) 'Sir, I am struggling with this question. Could you please explain it to me?'",
        answer: 'Sentence 2 (Formal and polite).',
      },
      {
        id: 2,
        question: "Fix: 'The group of boys is / are playing in the rain.' (Hint: 'Group' is one thing).",
        answer: 'The group of boys IS playing. (Collective noun "group" is treated as singular).',
      },
      {
        id: 3,
        question: "Fix: 'Yesterday I see a movie and it is very funny.'",
        answer: 'Yesterday I SAW a movie and it WAS very funny.',
      },
      {
        id: 4,
        question: "Fix: 'There / Their books are on the table over their / there.'",
        answer: 'THEIR books are on the table over THERE.',
      },
      {
        id: 5,
        question: "Explain why this is wrong: 'I bought a goat from a man with four legs.'",
        answer: 'It sounds like the man has four legs! It should be: "I bought a four-legged goat from a man."',
      },
      {
        id: 6,
        question: "Make this fragment a full sentence: 'Since it was a holiday.'",
        answer: '(Example: "Since it was a holiday, we went to the river.")',
      },
      {
        id: 7,
        question: "Is 'Chillen' a Standard English word or Slang?",
        answer: 'Slang. The Standard word is "relaxing".',
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
export const LanguageInUse: React.FC = () => {
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
        text: 'The word "register" in linguistics refers to the variety of language used in a particular social setting or situation.',
      },
      {
        title: 'Pro Tip',
        text: 'When in doubt, err on the side of formality. It\'s better to be too polite than not polite enough.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember "their/there/they\'re": "Their" has "heir" in it (who inherits? they do). "There" has "here" (a place). "They\'re" is short for "they are."',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse "its" and "it\'s". Remember: "it\'s" is short for "it is" or "it has". If you can\'t replace it with "it is", use "its".',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "register" in linguistics refers to the variety of language used in a particular social setting or situation.',
      },
      {
        title: 'Pro Tip',
        text: 'When in doubt, err on the side of formality. It\'s better to be too polite than not polite enough.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember "their/there/they\'re": "Their" has "heir" in it (who inherits? they do). "There" has "here" (a place). "They\'re" is short for "they are."',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse "its" and "it\'s". Remember: "it\'s" is short for "it is" or "it has". If you can\'t replace it with "it is", use "its".',
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
                    ? 'bg-teal-600 border-b-4 border-teal-800 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-700 border-b-4 border-teal-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-teal-400/30 text-white border border-teal-200/40 shadow-xs">
                LANGUAGE IN USE
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
            Language in Use{' '}
            <span className="text-teal-200 font-bold italic">
              Wardrobe of Words
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn how to choose the right register, fix common errors, avoid
            confusing words, and master spelling. Build your confidence in using
            English correctly and effectively.
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
                placeholder="Search for a topic, rule, or question..."
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
                  className="rounded-2xl border-2 border-b-4 border-teal-700 bg-teal-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-teal-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  💡 Language Tip
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
                  <span>Topics Covered</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Spelling Rules</span>
                  <span className="font-bold text-green-600 dark:text-green-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Language is a tool. Use the right tool for the right job. Formal
                for school and work, informal for friends. Always be respectful
                and clear.
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
                <strong className="text-white">Register:</strong> Choose the
                right tone – formal for authority figures, informal for friends.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Subject-Verb Agreement:</strong>{' '}
                Singular subject = verb + "s"; plural subject = verb without "s".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tense Consistency:</strong> Stay
                in the same tense throughout your writing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Confusing Words:</strong> There/Their/They're,
                Your/You're, Its/It's – know the difference!
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Spelling:</strong> "I" before "E"
                except after "C", double letters, and silent letters.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageInUse;
