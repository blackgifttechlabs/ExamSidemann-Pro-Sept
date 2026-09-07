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
  Clock,
  Brain,
  List,
  Book,
  User,
  Scale,
  Zap,
  MessageSquare,
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
// DATA: Study & Exam Skills Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'commands',
    title: 'Understanding Question Requirements',
    subtitle: 'The "Command" Words',
    description:
      'Before you answer any question, you must understand what the examiner is asking you to do. Each "command word" tells you exactly what kind of answer is expected. Learn them and you will never lose marks for misreading the question.',
    details: [
      'List / State: Give short answers. No need for long sentences. Just the facts.',
      'Describe: Paint a picture with words. Use adjectives and sensory language.',
      'Explain: Give reasons. Use the word "because" to show cause and effect.',
      'Compare: Show how two things are the same (similarities).',
      'Contrast: Show how two things are different (differences).',
      'Discuss: Write about different sides of an idea. Look at the topic from multiple angles.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">List / State</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Short answers, just the facts</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"List three nouns." → Boy, Dog, Harare.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Describe</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Paint with words, use adjectives</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"My school is a large, white building..."</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Explain</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Give reasons, use "because"</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"We boil water because it kills germs."</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Compare</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Show similarities</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">Finding what two things have in common.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Contrast</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Show differences</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">Highlighting what makes two things different.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Discuss</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Explore different sides</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">Looking at a topic from multiple angles.</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'If a question says "List," do you need to write long paragraphs?',
        answer: 'No. Just short points or single words.',
      },
      {
        id: 2,
        question: 'Which command word asks you to show how two things are different?',
        answer: 'Contrast.',
      },
      {
        id: 3,
        question: 'Which command word usually requires you to use the word "because"?',
        answer: 'Explain.',
      },
      {
        id: 4,
        question: 'If I ask you to "Describe" a lemon, what kind of words should you use?',
        answer: 'Adjectives (Describing words like sour, yellow, oval).',
      },
      {
        id: 5,
        question: 'True or False: "Discuss" means giving only one short answer.',
        answer: 'False. It means looking at the topic in detail from different angles.',
      },
    ],
  },
  {
    id: 'management',
    title: 'Exam Management (Time and Planning)',
    description:
      'Knowing the content is only half the battle. You must also manage your time, plan your answers, and check your work. These are the four golden rules of exam success.',
    details: [
      'Rule 1: Read Instructions Carefully – Before you write your name, read the instructions. If you answer four questions when you only needed two, you have wasted your time!',
      'Rule 2: Time Management – Look at the marks. If a question is worth 1 mark, spend 1 minute. If it is worth 20 marks, spend 45 minutes.',
      'Rule 3: Planning (The 5-Minute Rule) – Never start writing a composition immediately. Spend 5 minutes making a small plan or mind map.',
      'Rule 4: Proofreading – Save 10 minutes at the end to read your work. Find the "silly" mistakes—missing full stops, wrong spellings, or missing capital letters.',
    ],
    examples: (
      <div className="space-y-3">
        {[
          { r: "Rule 1: Read Instructions Carefully", desc: "Before you write your name, read the instructions. Example: Does it say 'Answer all questions' or 'Answer two questions'? If you answer four when you only needed two, you have wasted your time!" },
          { r: "Rule 2: Time Management", desc: "Look at the marks. If a question is worth 1 mark, spend 1 minute. If it is worth 20 marks (like a composition), spend 45 minutes." },
          { r: "Rule 3: Planning (The 5-Minute Rule)", desc: "Never start writing a composition immediately. Spend 5 minutes making a small plan or a mind map. This helps you keep your ideas organized." },
          { r: "Rule 4: Proofreading (The 'Search for Mistakes')", desc: "Save 10 minutes at the very end to read your work. This is when you find the 'silly' mistakes—missing full stops, wrong spellings, or missing capital letters." }
        ].map((rule, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
            <div>
              <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{rule.r}</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What should you do first when you get an exam paper?',
        answer: 'Read the instructions carefully.',
      },
      {
        id: 2,
        question: 'If a question is worth 1 mark and you have been writing for 10 minutes, is your time management good?',
        answer: 'No. You are spending too much time on a small question.',
      },
      {
        id: 3,
        question: 'What is the purpose of Proofreading?',
        answer: 'To find and fix mistakes in spelling, grammar, and punctuation.',
      },
      {
        id: 4,
        question: 'Why should you make a Plan before writing a story?',
        answer: 'To organize your ideas so the story makes sense.',
      },
      {
        id: 5,
        question: 'How many minutes should you save at the end of an exam to check your work?',
        answer: 'At least 5 to 10 minutes.',
      },
    ],
  },
  {
    id: 'techniques',
    title: 'Study Techniques (How to Learn)',
    description:
      'Studying effectively is a skill you can learn. These techniques will help you remember more, understand better, and feel more confident in your exams.',
    details: [
      'Note‑taking (The Keyword Method): Write down only the most important words—Keywords. Your brain cannot remember full textbooks.',
      'Using Dictionaries Effectively: A dictionary is your best friend. Look for Alphabetical Order and the Part of Speech (n., v., adj.).',
      'Reading Widely: Read things outside of school—newspapers, magazines, even the back of a juice bottle!',
      'Reviewing and Revising: If you learn something on Monday, you will forget it by Friday without revision. Review your notes for 10 minutes every night.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <AlignLeft size={16} /> A. Note‑taking
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            <span className="text-red-500">Don't:</span> "Nouns are naming words used for people..."<br />
            <span className="text-green-500">Do:</span> Nouns = Naming words (People, Places, Things).
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <Book size={16} /> B. Using Dictionaries
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Look for <strong>Alphabetical Order</strong> and the <strong>Part of Speech</strong> (n., v., adj.).
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <BookOpen size={16} /> C. Reading Widely
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Read the Herald, Sunday Mail, or even the back of a juice bottle! Every text teaches you something.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <Clock size={16} /> D. Reviewing &amp; Revising
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Look at your notes for <strong>10 minutes every night</strong> to keep information fresh.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'When taking notes, should you copy every single word from the teacher?',
        answer: 'No. Only write down the most important Keywords.',
      },
      {
        id: 2,
        question: 'What does the abbreviation (v.) mean in a dictionary?',
        answer: 'It means the word is a Verb.',
      },
      {
        id: 3,
        question: 'If you are looking for the word "Zebra" in a dictionary, will it be at the beginning or the end?',
        answer: 'At the end (Z is the last letter).',
      },
      {
        id: 4,
        question: 'How does reading newspapers help you with English?',
        answer: 'It shows you how real sentences are built and teaches you new words.',
      },
      {
        id: 5,
        question: 'What happens if you learn something but never revise it?',
        answer: 'You will likely forget it.',
      },
    ],
  },
  {
    id: 'vocab',
    title: 'Learning Vocabulary in Context',
    description:
      'Instead of memorizing lists of isolated words, learn vocabulary in "sentence families." Seeing a word in context helps you understand its meaning, usage, and collocations naturally.',
    details: [
      'Learn words in sentences, not in isolation.',
      'Use context clues to guess the meaning of new words.',
      'Keep a vocabulary notebook with example sentences.',
      'Write regularly – keep a diary to practice new words.',
      'Use new words in conversation to remember them better.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">Word: "Diligent"</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1">
            Context: "The diligent student studied every night and passed her exams."
          </p>
          <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-1">Meaning: Hardworking.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase">Writing Regularly</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Keep a private diary. Write three sentences every day about what you ate or who you saw. This makes writing feel natural.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What does "Context" mean?',
        answer: 'The words and sentences around a word that help explain its meaning.',
      },
      {
        id: 2,
        question: 'Is it better to learn one word alone or to see it in a sentence?',
        answer: 'In a sentence.',
      },
      {
        id: 3,
        question: 'Why is keeping a daily diary a good idea for English learners?',
        answer: 'It helps you practice writing every day so you get faster and more accurate.',
      },
      {
        id: 4,
        question: 'If you see the word "Gigantic" in a sentence about an elephant, what can you guess it means?',
        answer: 'Very big (because elephants are big).',
      },
      {
        id: 5,
        question: 'Write one sentence about your day today in English.',
        answer: '(Example: Today I learned how to study for my English exams.)',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment: Skills Check',
    subtitle: 'Put it all together',
    description:
      'Test your understanding of command words, exam management, study techniques, and vocabulary strategies. Apply everything you have learned in these practical scenarios.',
    details: [
      'Part 1: The Exam Room – Apply time management and proofreading skills.',
      'Part 2: Command Words – Match the command word to the correct action.',
      'Part 3: Study Habits – Understand effective learning strategies.',
    ],
    examples: (
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Teacher\'s Final Note</h5>
        <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
          "Congratulations, class! You have now completed the full guide to Form 1 English. Remember, English is not a monster to be feared. It is a tool. If you use it every day—by speaking, reading, and writing—you will become a master. Do not be afraid to make mistakes; every mistake is a lesson. Good luck in your studies and your exams!"
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'You have 2 hours for an exam. You spend 1 hour and 50 minutes on the first page. What will happen to your final mark?',
        answer: 'You will likely fail because you did not finish the other questions.',
      },
      {
        id: 2,
        question: 'The instruction says: "Write a composition of 150 words." You write 500 words. Why is this a mistake?',
        answer: 'You have wasted time and probably made more grammar mistakes by writing too much.',
      },
      {
        id: 3,
        question: 'You finish your exam 15 minutes early. What should you do with those 15 minutes?',
        answer: 'Proofread your work (check for spelling, tenses, and punctuation).',
      },
      {
        id: 4,
        question: 'Name three things you should check for during Proofreading.',
        answer: '(1) Spelling, (2) Punctuation (full stops/capitals), (3) Tenses (is/was, run/ran).',
      },
      {
        id: 5,
        question: 'Match: Compare',
        answer: 'B. Show how things are the same.',
      },
      {
        id: 6,
        question: 'Match: Explain',
        answer: 'A. Give reasons why.',
      },
      {
        id: 7,
        question: 'Match: Contrast',
        answer: 'D. Show how things are different.',
      },
      {
        id: 8,
        question: 'Match: Describe',
        answer: 'C. Give a word-picture with adjectives.',
      },
      {
        id: 9,
        question: 'Why is it better to study for 30 minutes every day than to study for 5 hours only on the night before the exam?',
        answer: 'Because your brain needs time to absorb information; "cramming" at the last minute leads to forgetting and stress.',
      },
      {
        id: 10,
        question: 'If you find a new word while reading a story, what should you do to make sure you remember it?',
        answer: 'Look it up in a dictionary, write it in your notebook, and try to use it in a sentence.',
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
export const StudySkills: React.FC = () => {
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
        text: 'The word "command" in an exam question tells you exactly what to do. If you ignore it, you will lose marks even if you know the content.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before you read the passage in comprehension tests. This tells you what to look for and saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the 5-minute rule: "Plan before you write" – P.B.Y.W. – sounds like "puppy." A puppy needs a plan (training) to be good!',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to proofread because they are tired at the end of an exam. Save 10 minutes – it is the difference between a pass and a fail.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "command" in an exam question tells you exactly what to do. If you ignore it, you will lose marks even if you know the content.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before you read the passage in comprehension tests. This tells you what to look for and saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the 5-minute rule: "Plan before you write" – P.B.Y.W. – sounds like "puppy." A puppy needs a plan (training) to be good!',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to proofread because they are tired at the end of an exam. Save 10 minutes – it is the difference between a pass and a fail.',
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
                    ? 'bg-lime-600 border-b-4 border-lime-800 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-lime-600 via-emerald-600 to-green-700 border-b-4 border-lime-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-lime-400/30 text-white border border-lime-200/40 shadow-xs">
                STUDY &amp; EXAM SKILLS
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
            Study &amp; Exam Skills{' '}
            <span className="text-lime-200 font-bold italic">
              The Secret Rules
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Master the secrets of exam success. Learn command words, time management,
            study techniques, and vocabulary strategies. Prepare yourself to pass
            with confidence.
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
                placeholder="Search for a command, rule, or technique..."
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
                  className="rounded-2xl border-2 border-b-4 border-lime-700 bg-lime-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-lime-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  💡 Study Tip
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
                  <span>Skill Areas</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Command Words</span>
                  <span className="font-bold text-green-600 dark:text-green-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Exam success is not just about what you know – it is about how you
                use it. Read instructions, manage your time, plan your answers,
                and always proofread.
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
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Command Words:</strong> List, Describe,
                Explain, Compare, Contrast, Discuss – each tells you exactly what
                to do.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Time Management:</strong> Match your
                time to the marks. 1 mark = 1 minute. Save 5–10 minutes for proofreading.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Study Techniques:</strong> Take keyword
                notes, use dictionaries, read widely, and review your notes every night.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Vocabulary:</strong> Learn words in
                context, not in isolation. Keep a vocabulary notebook with example
                sentences.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Final Advice:</strong> English is a
                tool. Use it every day – speak, read, write – and you will become a
                master.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudySkills;
