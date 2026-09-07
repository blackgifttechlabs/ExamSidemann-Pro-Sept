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
  Mic,
  Ear,
  Music,
  Megaphone,
  User,
  MessageSquare,
  Volume2,
  FastForward,
  Brain,
  ListChecks,
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
// DATA: Oral Communication Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'speaking',
    title: 'Speaking Skills (Using Your Voice)',
    description:
      'Speaking skills are the tools you use to share your ideas out loud. It isn\'t just about the words; it is about how you say them. Master pronunciation, volume, pace, body language, and organisation.',
    details: [
      'Pronunciation: saying the word correctly.',
      'Articulation: moving tongue and lips clearly so sounds don\'t "smudge" together.',
      'Volume: loud enough for the back of the room, but not screaming.',
      'Pace: speed of speech – too fast = confusion, too slow = boredom.',
      'Eye Contact: look at your audience, not at the floor or ceiling.',
      'Posture: stand straight, don\'t lean or hide hands.',
      'Organising Thoughts: have a mini‑plan: Point, Reason, Example.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              A. Pronunciation &amp; Articulation
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Practice drills:<br />
              <strong>Shoe</strong> (quiet sound) vs. <strong>Chew</strong> (sneezing sound).<br />
              <strong>Three</strong> (tongue between teeth) vs. <strong>Tree</strong> (tongue behind teeth).
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              B. Volume &amp; Pace
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Volume:</strong> Speak loudly enough for the back of the room, but don't scream!<br />
              <strong>Pace:</strong> This is your speed. Too fast = confusion. Too slow = boredom.
            </p>
            <p className="text-[10px] font-bold italic text-indigo-500 mt-2">
              <Info size={12} className="inline" /> Tip: When nervous, you speak too fast. Remember to breathe.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              C. Eye Contact &amp; Body Language
            </h5>
            <ul className="text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <strong>Eye Contact:</strong> Look at your audience. Don't stare at the floor or ceiling.</li>
              <li>• <strong>Posture:</strong> Stand straight. Don't lean or hide hands in pockets.</li>
            </ul>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
              D. Organising Thoughts
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Before you open your mouth, have a "mini‑plan":</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-indigo-600 text-white text-[10px] font-bold p-2 text-center uppercase rounded">Point</div>
              <div className="bg-indigo-600 text-white text-[10px] font-bold p-2 text-center uppercase rounded">Reason</div>
              <div className="bg-indigo-600 text-white text-[10px] font-bold p-2 text-center uppercase rounded">Example</div>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the difference between pronunciation and articulation?',
        answer: 'Pronunciation is saying the word correctly; articulation is making the sounds clearly with your mouth.',
      },
      {
        id: 2,
        question: "If someone says, 'I can't hear you,' what do you need to change: your volume or your pace?",
        answer: 'Your volume.',
      },
      {
        id: 3,
        question: 'Why is it important to look at the person you are talking to?',
        answer: 'It shows you are confident and that you respect the person listening.',
      },
      {
        id: 4,
        question: 'If you are feeling very nervous and talking too fast, what should you do?',
        answer: 'You should stop and take a deep breath to slow down your pace.',
      },
      {
        id: 5,
        question: 'What are the three steps to organise your thoughts before speaking?',
        answer: 'State your Point, give a Reason, and provide an Example.',
      },
    ],
  },
  {
    id: 'listening',
    title: 'Listening Skills (Using Your Ears)',
    description:
      'Listening is not the same as hearing. Hearing is just a sound entering your ear. Listening is your brain working to understand that sound. Develop active listening, follow instructions, and take effective notes.',
    details: [
      'Active Listening: Show the speaker you are paying attention – nod, say "Mmm" or "I see."',
      'Following Instructions: Listen to the whole instruction before starting. Missing one step = failing the task.',
      'Note‑Taking: Write down Keywords (most important words). Don\'t try to remember every word.',
      'Understanding Purpose and Tone: Why are they talking? (Teach, Warn, Laugh?) How are they feeling? (Angry, Sad, Happy?)',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              A. Active Listening
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Show the speaker you are paying attention. Nod your head, say "Mmm" or "I see."
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              B. Following Instructions
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Listen to the <strong>whole</strong> instruction before starting. Missing one step means failing the task.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              C. Note‑Taking
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Write down <strong>Keywords</strong>. Don't try to remember every single word.
            </p>
            <div className="mt-2 bg-slate-900 p-3 rounded text-[10px] font-mono text-emerald-400">
              Source: "The capital of Zimbabwe is Harare, founded in 1890."<br />
              Notes: Harare – Capital – 1890.
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              D. Purpose &amp; Tone
            </h5>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <strong>Purpose:</strong> Why are they talking? (Teach, Warn, Laugh?)<br />
              <strong>Tone:</strong> How are they feeling? (Angry, Sad, Happy?)
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'How is Active Listening different from just sitting quietly?',
        answer: 'Active listening involves showing the speaker you understand through body language and attention.',
      },
      {
        id: 2,
        question: 'Why should you wait for a teacher to finish the whole instruction before starting your work?',
        answer: 'To make sure you don\'t miss any important steps of the task.',
      },
      {
        id: 3,
        question: 'What is a Keyword in note‑taking?',
        answer: 'A keyword is the most important word that carries the main meaning.',
      },
      {
        id: 4,
        question: 'If a speaker is shouting and using short words, what is their Tone?',
        answer: 'Their tone is likely angry or urgent.',
      },
      {
        id: 5,
        question: 'How can you show a speaker you are listening without using words?',
        answer: 'By making eye contact and nodding your head.',
      },
    ],
  },
  {
    id: 'literature',
    title: 'Oral Literature (The Art of Performance)',
    description:
      'Oral literature is "spoken books." It is using your voice to perform stories, poems, and arguments. Master reciting poems, role play, debates, and speeches.',
    details: [
      'Reciting Poems: Use rhythm and voice to show feeling. Pause for punctuation, not at the end of every line.',
      'Role Play and Drama: Change your voice and walk to "become" the character.',
      'Debates: Formal arguments. Be polite – say "I respectfully disagree because..."',
      'Speeches: Start with a "Hook" to grab attention, present the body, and end with a "Call to Action."',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm flex items-start gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-full shrink-0"><Music size={18} /></div>
          <div>
            <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">A. Reciting Poems</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Use rhythm and voice to show feeling. Only pause for punctuation, not at the end of every line.</p>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm flex items-start gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-full shrink-0"><User size={18} /></div>
          <div>
            <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">B. Role Play &amp; Drama</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Change your voice and walk to "become" the character.</p>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm flex items-start gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-full shrink-0"><Brain size={18} /></div>
          <div>
            <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">C. Debates</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Formal arguments. Be polite! Say "I respectfully disagree because..." instead of "You are wrong!"</p>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm flex items-start gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-full shrink-0"><Megaphone size={18} /></div>
          <div>
            <h5 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">D. Speeches</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Start with a "Hook" to grab attention, present the body, and end with a "Call to Action".</p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the "beat" in a poem called?',
        answer: 'Rhythm.',
      },
      {
        id: 2,
        question: 'In Role Play, what two things can you change to act like a character?',
        answer: 'Your voice and your body language/walk.',
      },
      {
        id: 3,
        question: 'In a Debate, what is a polite way to say you don\'t agree?',
        answer: '"I respectfully disagree because..."',
      },
      {
        id: 4,
        question: 'What are the three parts of a Speech?',
        answer: 'The Hook, the Body, and the Call to Action.',
      },
      {
        id: 5,
        question: 'What is the purpose of a "Hook" at the beginning of a speech?',
        answer: 'To catch the attention of the audience so they want to listen.',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment',
    subtitle: 'Put it all together',
    description:
      'Test your oral communication skills with scenario analysis, listening practice, and vocabulary/tone questions. Apply everything you have learned.',
    details: [
      'Part 1: Scenario Analysis – Apply speaking skills to a real‑world situation.',
      'Part 2: Listening Practice – Follow multi‑step instructions accurately.',
      'Part 3: Vocabulary and Tone – Understand purpose and emotion in speech.',
    ],
    examples: (
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Scenario</h5>
        <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
          Imagine you are giving a speech at the school assembly about "Keeping the School Clean."
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'How will you stand so that everyone knows you are confident?',
        answer: 'Stand straight, don\'t lean, and keep your hands out of your pockets.',
      },
      {
        id: 2,
        question: 'Write a "Hook" (an interesting first sentence) for this speech.',
        answer: '(Example: "Did you know that our school produces ten bags of litter every single day?")',
      },
      {
        id: 3,
        question: 'If students at the back start talking, what should you change about your Volume?',
        answer: 'You should increase your volume.',
      },
      {
        id: 4,
        question: 'If you want to tell a story about a student who picked up litter, which skill are you using? (Debate or Storytelling?)',
        answer: 'Storytelling.',
      },
      {
        id: 5,
        question: 'Imagine your teacher says: "Students, please take out your blue pens, write your name at the top of the paper, and then wait for me to give you the exam questions." List the three steps you must follow in the correct order.',
        answer: '(1) Take out a blue pen. (2) Write name at the top. (3) Wait for questions.',
      },
      {
        id: 6,
        question: 'If you used a red pen, did you follow the instructions correctly?',
        answer: 'No. The instruction was for a blue pen.',
      },
      {
        id: 7,
        question: 'If a teacher says "I am very disappointed in your behavior" in a very low, quiet voice, is the teacher happy?',
        answer: 'No.',
      },
      {
        id: 8,
        question: 'What is the Tone in the question above?',
        answer: 'Serious, stern, or disappointed.',
      },
      {
        id: 9,
        question: 'Why do we use Note‑taking during a long speech?',
        answer: 'To remember the main points without having to remember every word.',
      },
      {
        id: 10,
        question: 'What is the most important rule of Debating?',
        answer: 'To be polite and respectful even when you disagree.',
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
export const OralCommunication: React.FC = () => {
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
        text: 'The word "communication" comes from Latin "communicare" meaning "to share." Good communication is about sharing ideas clearly and respectfully.',
      },
      {
        title: 'Pro Tip',
        text: 'When speaking in public, imagine you are talking to a friend in the back row. This helps you project your voice naturally.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the three parts of a speech: "Hook" (fish), "Body" (fish meat), "Call to Action" (let the fish go).',
      },
      {
        title: 'Common Mistake',
        text: 'Many speakers look at the floor or their notes too much. Practice making eye contact with different parts of the room.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "communication" comes from Latin "communicare" meaning "to share." Good communication is about sharing ideas clearly and respectfully.',
      },
      {
        title: 'Pro Tip',
        text: 'When speaking in public, imagine you are talking to a friend in the back row. This helps you project your voice naturally.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the three parts of a speech: "Hook" (fish), "Body" (fish meat), "Call to Action" (let the fish go).',
      },
      {
        title: 'Common Mistake',
        text: 'Many speakers look at the floor or their notes too much. Practice making eye contact with different parts of the room.',
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
                    ? 'bg-rose-600 border-b-4 border-rose-800 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 border-b-4 border-rose-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-rose-400/30 text-white border border-rose-200/40 shadow-xs">
                ORAL COMMUNICATION
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
            Oral Communication{' '}
            <span className="text-rose-200 font-bold italic">
              Voice &amp; Ears
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Master the art of speaking and listening. Learn pronunciation, volume,
            pace, body language, active listening, note‑taking, and performance skills
            like reciting poems, debating, and delivering speeches.
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
                placeholder="Search for a skill, tip, or question..."
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
                  className="rounded-2xl border-2 border-b-4 border-rose-700 bg-rose-500 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-rose-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  💡 Communication Tip
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Performance Types</span>
                  <span className="font-bold text-green-600 dark:text-green-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Communication is a two‑way street. Speak clearly, listen actively,
                and always be respectful. Practice makes perfect!
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
                <strong className="text-white">Speaking:</strong> Use clear
                pronunciation, appropriate volume, steady pace, eye contact, and
                an organised structure (Point, Reason, Example).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Listening:</strong> Active listening
                shows respect; always get the full instruction before starting; take
                keyword notes; identify purpose and tone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Oral Literature:</strong> Poems
                need rhythm; role play uses voice and movement; debates require
                politeness; speeches start with a hook and end with a call to action.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Confidence:</strong> Stand tall,
                breathe deeply, and practice – your voice is powerful.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OralCommunication;
