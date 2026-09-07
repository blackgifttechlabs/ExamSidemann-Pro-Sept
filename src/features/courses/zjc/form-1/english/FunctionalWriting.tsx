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
  Mail,
  MessageSquare,
  Megaphone,
  Zap,
  Layout,
  Briefcase,
  User,
  MapPin,
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
// DATA: Functional Writing Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'formal',
    title: 'Formal Letters (The Business Style)',
    description:
      'A formal letter is used to communicate with people you do not know personally, like a boss, a shop manager, or a government official. It must be polite, serious, and short.',
    details: [
      'Your Address: Top right corner.',
      'The Date: Below your address.',
      'Recipient Address: Left side, slightly lower.',
      'Salutation: "Dear Sir/Madam" or "Dear Mr. Moyo."',
      'Subject Line: RE: COMPLAINT ABOUT...',
      'Body: Message in paragraphs.',
      'Subscription: "Yours faithfully" or "Yours sincerely."',
      'Signature & Name: Block letters below.',
    ],
    examples: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">
            A. Letter of Complaint
          </h5>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-xl shadow-sm font-mono text-[10px] md:text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="flex justify-end text-right mb-4">
              <div>
                123 Mukwa Road,<br />
                Mabvuku,<br />
                Harare.<br />
                15 May 2024
              </div>
            </div>
            <div className="mb-4">
              The Manager,<br />
              OK Supermarket,<br />
              First Street,<br />
              Harare.
            </div>
            <div className="mb-2">Dear Sir/Madam,</div>
            <div className="font-bold uppercase underline mb-3 text-[9px]">
              RE: COMPLAINT ABOUT EXPIRED MILK
            </div>
            <p className="mb-3 text-left">
              I am writing to express my strong dissatisfaction with a product I purchased from your store yesterday, 14 May 2024. I bought two liters of "Fresh Choice" milk, but when I got home, I discovered the milk was sour.
            </p>
            <p className="mb-3 text-left">
              When I checked the bottle, the expiry date was 10 May 2024. This means the milk had been sitting on your shelves for four days after it should have been removed. This is dangerous for the health of your customers.
            </p>
            <p className="mb-4 text-left">
              I have attached the receipt to this letter. I would like a full refund of my money or a fresh bottle of milk. I hope you will check your products more carefully in the future to avoid this problem.
            </p>
            <div>
              Yours faithfully,<br />
              (Signature)<br />
              <span className="font-bold">TENDAI CHIPO</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">
            B. Letter of Application
          </h5>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-xl shadow-sm font-mono text-[10px] md:text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <div className="flex justify-end text-right mb-4">
              <div>
                P.O. Box 44,<br />
                Gweru.<br />
                20 May 2024
              </div>
            </div>
            <div className="mb-4">
              The Personnel Manager,<br />
              Bata Shoe Company,<br />
              Gweru.
            </div>
            <div className="mb-2">Dear Sir,</div>
            <div className="font-bold uppercase underline mb-3 text-[9px]">
              RE: APPLICATION FOR A HOLIDAY JOB AS A CLEANER
            </div>
            <p className="mb-3 text-left">
              I am a Form 1 student at Gweru Secondary School, and I am writing to apply for the position of cleaner during the August school holidays. I am a hardworking and honest person who is eager to earn money for my school fees.
            </p>
            <p className="mb-3 text-left">
              I have experience cleaning at my local church and helping in my family's garden. I am very punctual and I promise to follow all the rules of your company if I am hired. I am available to start work as soon as the schools close on the 8th of August.
            </p>
            <p className="mb-4 text-left">
              I have attached a letter of recommendation from my school headmaster. I look forward to hearing from you soon.
            </p>
            <div>
              Yours faithfully,<br />
              (Signature)<br />
              <span className="font-bold">SIMBA DHLIWAYO</span>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Where do you put your address in a formal letter?',
        answer: 'In the top right corner.',
      },
      {
        id: 2,
        question: 'Why do we include a Subject Line (RE: ...)?',
        answer: 'To tell the reader immediately what the letter is about.',
      },
      {
        id: 3,
        question: "If you start a letter with 'Dear Sir,' how should you end it?",
        answer: "With 'Yours faithfully.'",
      },
      {
        id: 4,
        question: 'What is the difference between a Letter of Complaint and a Letter of Application?',
        answer: 'A Complaint is about a problem; an Application is asking for a job or opportunity.',
      },
      {
        id: 5,
        question: "True or False: You can use 'slang' or 'street talk' in a formal letter.",
        answer: 'False. You must use polite and serious language.',
      },
    ],
  },
  {
    id: 'informal',
    title: 'Informal Letters (The Friendly Style)',
    description:
      'These are personal letters to friends, family, or people you know very well. The tone is relaxed and warm. You only use one address (yours) on the top right.',
    details: [
      'Your Address: Top right corner.',
      'Date: Below your address.',
      'Salutation: "Dear [Name]," (e.g., Dear Uncle John).',
      'Body: Friendly, personal, warm tone.',
      'Closing: "Your friend," "With love," or "Yours."',
      'Signature: Your first name (or nickname).',
      'No subject line needed.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest text-center">
            A. Thank You Letter
          </h5>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm font-mono text-[10px] md:text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic">
            <div className="text-right mb-3 not-italic">
              House Number 782,<br /> Sakubva, Mutare.<br /> 22 May 2024
            </div>
            <div className="mb-2 font-bold not-italic text-slate-900 dark:text-white">
              Dear Uncle John,
            </div>
            <p className="mb-3">
              How are you doing in Bulawayo? I hope the family is well. I am writing this letter to thank you so much for the beautiful bicycle you sent me for my birthday. I was so surprised when the bus driver delivered it to our house!
            </p>
            <p className="mb-4">
              The bicycle is bright blue, which is my favorite color. I have been riding it to school every day, and it makes my journey much faster. All my friends think it is very cool. Thank you for being so kind and thinking of me.
            </p>
            <div className="not-italic font-bold text-slate-900 dark:text-white">
              Your nephew,<br />Tendai
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest text-center">
            B. Invitation Letter
          </h5>
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm font-mono text-[10px] md:text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic">
            <div className="text-right mb-3 not-italic">
              Village 4, Chivi,<br /> Masvingo.<br /> 10 June 2024
            </div>
            <div className="mb-2 font-bold not-italic text-slate-900 dark:text-white">
              Dear Farai,
            </div>
            <p className="mb-3">
              I hope this letter finds you in good health. I am writing to invite you to my sister’s wedding which will take place on the 24th of June at our homestead. It is going to be a big celebration with lots of food, music, and dancing.
            </p>
            <p className="mb-4">
              It has been a long time since we saw each other, and it would make me very happy if you could attend. My mother said you can stay with us for the whole weekend so we can catch up on all our news. Please let me know if you can come by next Monday.
            </p>
            <div className="not-italic font-bold text-slate-900 dark:text-white">
              Your friend,<br />Musa
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'How many addresses do you write in an informal letter?',
        answer: 'One (your own address).',
      },
      {
        id: 2,
        question: "Give one example of an informal closing (subscription).",
        answer: "'Your friend,' 'With love,' or 'Yours.'",
      },
      {
        id: 3,
        question: 'Do you need a "Subject Line" in a letter to your friend?',
        answer: 'No.',
      },
      {
        id: 4,
        question: 'How is the tone of an informal letter different from a formal one?',
        answer: 'It is friendly, relaxed, and warm, while a formal letter is serious and polite.',
      },
      {
        id: 5,
        question: "Write an informal greeting for a letter to your mother.",
        answer: "'Dear Mom,' or 'Dearest Mother.'",
      },
    ],
  },
  {
    id: 'other',
    title: 'Other Functional Texts',
    description:
      'Notices, advertisements, and memos are short, practical texts used to inform, persuade, or communicate within an organization. Each has a specific structure and purpose.',
    details: [
      'Notices: Short messages to inform a group. Must be in a box. Include Who, What, When, Where.',
      'Advertisements: Persuade people to buy something. Use exciting words, include price and contact details.',
      'Memos: Short notes within an organization. Include To, From, Date, Subject, and a brief message.',
    ],
    examples: (
      <div className="space-y-8">
        <div className="space-y-3">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <Megaphone size={18} /> A. Notices and Announcements
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A notice is a short message to tell a group of people about an event. It is usually placed on a wall or a board. <strong>It must be in a Box.</strong>
          </p>
          <div className="p-6 md:p-8 border-4 border-slate-800 dark:border-slate-400 text-center uppercase tracking-widest font-bold space-y-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <h5 className="text-lg md:text-2xl underline underline-offset-8">NOTICE: SCHOOL CLEANING DAY</h5>
            <div className="text-xs md:text-sm space-y-2 font-medium">
              <p>Date: Friday, 31 May 2024</p>
              <p>Time: 08:00 AM to 12:00 PM</p>
              <p>Who: All Form 1 and Form 2 Students</p>
              <p>What to bring: Brooms, buckets, and old rags.</p>
              <p>Meeting Point: The School Assembly Square.</p>
            </div>
            <p className="pt-4 text-[10px] opacity-60 italic">By order of the School Prefects.</p>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={18} /> B. Advertisements
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400">The goal is to sell something. Use big, exciting words!</p>
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-dashed border-yellow-500 rounded-xl shadow-lg text-center">
            <h5 className="text-xl md:text-3xl font-black text-yellow-800 dark:text-yellow-400 mb-4 uppercase">
              FOR SALE: MOUNTAIN BICYCLE!
            </h5>
            <p className="text-sm font-bold mb-4 italic">Are you tired of walking to school? Buy this lightning-fast red mountain bike today!</p>
            <ul className="text-xs md:text-sm font-bold space-y-2 uppercase mb-6">
              <li className="flex items-center justify-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> Very good condition
              </li>
              <li className="flex items-center justify-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> New tires
              </li>
              <li className="text-2xl text-orange-600 dark:text-orange-400">Only $50!</li>
            </ul>
            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              Contact: Mr. Moyo at House 45, Highfield, or call 0771 234 567.
            </p>
            <p className="mt-4 text-xs font-black text-orange-600 dark:text-orange-400 animate-pulse">
              HURRY! THIS BIKE WILL GO FAST!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={18} /> C. Messages and Memos
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A Memo is a short note sent from one person to another inside the same office or school.
          </p>
          <div className="p-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-left">
            <h5 className="text-2xl font-bold border-b pb-3 mb-4 uppercase tracking-tighter">MEMO</h5>
            <div className="space-y-1 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
              <p>To: All Teachers</p>
              <p>From: The Headmaster</p>
              <p>Date: 25 May 2024</p>
              <p>Subject: Staff Meeting</p>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
              Please be informed that there is a short staff meeting in the staffroom today at 1:00 PM. Please bring your registers. Thank you.
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Why do we put a notice in a Box?',
        answer: 'To make it stand out and look official/organized.',
      },
      {
        id: 2,
        question: "What are the four 'W's you must include in a notice?",
        answer: 'Who, What, When, Where.',
      },
      {
        id: 3,
        question: 'What is the main goal of an advertisement?',
        answer: 'To persuade people to buy something or use a service.',
      },
      {
        id: 4,
        question: 'Who is a Memo written for?',
        answer: 'For people within the same organization (like school or a company).',
      },
      {
        id: 5,
        question: 'Where should you place a notice so people can see it?',
        answer: 'On a notice board or a visible wall.',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment',
    subtitle: 'Put it all together',
    description:
      'Test your understanding of functional writing by checking the layout, writing short texts, and answering critical thinking questions.',
    details: [
      'Part 1: The Layout – Know where addresses, date, and subject line go in a formal letter.',
      'Part 2: Short Writing – Write an advertisement, a memo, and an informal letter.',
      'Part 3: Critical Thinking – Explain why we follow specific rules in functional writing.',
    ],
    examples: (
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">Preparation</h5>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Review the layout rules and the sample texts above before attempting the questions below.
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Mental Exercise: Draw the layout for a Formal Letter. Show where the two addresses, the date, and the subject line go.',
        answer: '(Visual check: Sender Address top right, Date below it, Recipient Address left side lower, Subject below salutation).',
      },
      {
        id: 2,
        question: 'Advertisement Task: You lost your school bag. Write a short advertisement with a reward.',
        answer: 'LOST BAG! I lost a black "Nike" bag yesterday near the soccer field. It has my English books inside. Reward: $2. Contact Tendai in Form 1B.',
      },
      {
        id: 3,
        question: 'Memo Task: Write a memo from the class monitor about English notebooks.',
        answer: 'MEMO. To: Form 1. From: Class Monitor. Subject: Notebooks. Please remember to bring your English notebooks tomorrow for the teacher to check.',
      },
      {
        id: 4,
        question: 'Informal Letter Task: Write 2 paragraphs to a cousin about a new teacher.',
        answer: "(Student's own personal letter, check for: 1 address top right and friendly tone).",
      },
      {
        id: 5,
        question: 'Why is it important to include the date on all functional writing?',
        answer: 'So the person knows when the request or event happened.',
      },
      {
        id: 6,
        question: "In a Formal Letter, why do we use 'Yours faithfully' instead of 'Your friend'?",
        answer: 'Because it is a professional relationship, not a personal friendship.',
      },
      {
        id: 7,
        question: 'If you are filling out an Application Form for a National ID, why must you use BLOCK LETTERS?',
        answer: 'So that the information is clear and the computer/person can read it without mistakes.',
      },
      {
        id: 8,
        question: 'What is the purpose of an "Announcement" over the school loudspeaker?',
        answer: 'To give urgent information to everyone at the same time.',
      },
      {
        id: 9,
        question: 'Why should an advertisement include a price?',
        answer: 'To help the buyer decide if they can afford it.',
      },
      {
        id: 10,
        question: 'If you write a letter to the Editor of a newspaper, should it be formal or informal?',
        answer: 'Formal. (You do not know the Editor personally).',
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
export const FunctionalWriting: React.FC = () => {
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
        text: 'The word "functional" means "useful." Functional writing is writing you do to get a job done in the real world.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep a copy of your formal letters. You may need to refer to them later or follow up.',
      },
      {
        title: 'Memory Trick',
        text: 'For formal letters, remember: Addresses, Date, Salutation, Subject, Body, Closing, Signature.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to include the date or the sender’s address. These are essential for a formal letter.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "functional" means "useful." Functional writing is writing you do to get a job done in the real world.',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep a copy of your formal letters. You may need to refer to them later or follow up.',
      },
      {
        title: 'Memory Trick',
        text: 'For formal letters, remember: Addresses, Date, Salutation, Subject, Body, Closing, Signature.',
      },
      {
        title: 'Common Mistake',
        text: 'Many students forget to include the date or the sender’s address. These are essential for a formal letter.',
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
                    ? 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 border-b-4 border-amber-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-amber-400/30 text-white border border-amber-200/40 shadow-xs">
                FUNCTIONAL WRITING
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
            Functional Writing{' '}
            <span className="text-amber-200 font-bold italic">
              The Real World
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn how to write formal and informal letters, notices, advertisements,
            and memos. Master the rules of practical, real‑world writing.
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
                placeholder="Search for a writing type or question..."
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
                  className="rounded-2xl border-2 border-b-4 border-amber-700 bg-amber-500 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-amber-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  <span>Writing Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Sample Texts</span>
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
                Functional writing is practical. Always consider your audience,
                use the correct layout, and keep your language clear and polite.
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
                <strong className="text-white">Formal Letters:</strong> Used for
                official communication – include addresses, date, subject, and a
                polite closing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Informal Letters:</strong> Personal
                and friendly – only one address, warm tone, casual closing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Notices &amp; Adverts:</strong>{' '}
                Short, eye‑catching, and informative – boxed for notices, exciting
                language for adverts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memos:</strong> Internal notes with
                To/From/Date/Subject – clear and concise.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                Use the search bar to quickly find any writing type or question.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FunctionalWriting;
