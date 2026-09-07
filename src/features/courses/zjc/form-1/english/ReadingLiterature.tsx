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
  User,
  MapPin,
  Clock,
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
// DATA: Reading & Literature Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'skills',
    title: 'Reading Skills (How to Study a Text)',
    description:
      'When you look at a page of English, don\'t be afraid of the "wall of words." We use specific tools to break that wall down: skimming, scanning, vocabulary in context, making inferences, and distinguishing fact from opinion.',
    details: [
      'Skimming: Reading very fast – looking at the title, first sentence, and pictures to find the main idea.',
      'Scanning: Looking for one specific thing – a date, a name, or a place.',
      'Vocabulary in Context: Use surrounding words to guess the meaning of an unknown word.',
      'Inferences: A guess based on evidence – reading between the lines.',
      'Fact vs. Opinion: Facts are proven true; opinions are personal feelings.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">Skimming (Bird’s Eye View)</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Reading fast to get the main idea. Like a bird flying over a forest.</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">Scanning (Treasure Hunt)</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">Looking for a specific piece of information – like a date or name.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase mb-2">Vocabulary in Context</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "The man was so <strong>famished</strong> that he ate three plates of sadza." (Famished = very hungry).
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2">Making Inferences</h5>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "Thandiwe threw her schoolbag on the floor and locked herself in her bedroom crying." (Infer: She had a bad day).
            </p>
          </div>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Fact vs. Opinion</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 bg-white dark:bg-slate-800 rounded text-center text-xs">
              <span className="font-bold text-green-600">Fact</span><br />
              "Zimbabwe gained independence in 1980."
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded text-center text-xs">
              <span className="font-bold text-orange-600">Opinion</span><br />
              "Math is the hardest subject."
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'If I want to find the phone number of a shop in a newspaper, should I skim or scan?',
        answer: 'Scan (You are looking for a specific number).',
      },
      {
        id: 2,
        question: 'Read this: "The sky turned black, the wind began to howl, and birds flew to their nests." What can you infer is about to happen?',
        answer: 'It is about to rain or a storm is coming.',
      },
      {
        id: 3,
        question: 'Is this a fact or an opinion? "Our school soccer team is the best in the country."',
        answer: 'Opinion (Other schools might think their team is better).',
      },
      {
        id: 4,
        question: 'Context Clue: "The path was so treacherous that many people slipped on the sharp rocks and fell into the mud." What does "treacherous" mean?',
        answer: 'Dangerous or difficult to walk on.',
      },
      {
        id: 5,
        question: 'Write a fact about the town or village where you live.',
        answer: '(Example: My village is in the Masvingo province).',
      },
    ],
  },
  {
    id: 'texttypes',
    title: 'Text Types (Writing Styles)',
    description:
      'Different texts have different purposes. Knowing the type of text helps you understand what the author is trying to achieve. The five main types are narrative, descriptive, expository, persuasive, and instructional.',
    details: [
      'Narrative: To entertain. Has a beginning, middle, end, characters, and a problem.',
      'Descriptive: To paint a picture with words. Uses many adjectives and sensory language.',
      'Expository: To teach or explain. Gives facts and information.',
      'Persuasive: To convince or change your mind. Uses arguments and emotional appeal.',
      'Instructional: To give steps to follow. Uses sequence words (first, next, finally).',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Narrative</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Tells a story</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"A story about a boy who fights a lion."</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Descriptive</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Paint with words</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"The shimmering Zambezi River and the grey mist of the falls."</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Expository</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Teach/explain</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"A textbook page about how plants grow."</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Persuasive</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Convince</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"Buy this soap to make your skin soft!"</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center">
          <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Instructional</h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Give steps</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 italic mt-2">"A recipe for cooking roadrunner chicken."</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which text type tells a story with a hero and a villain?',
        answer: 'Narrative.',
      },
      {
        id: 2,
        question: 'If you read a manual on "How to fix a bicycle," what type of text is it?',
        answer: 'Instructional.',
      },
      {
        id: 3,
        question: 'A poster says "Stop Smoking! It Kills!" What is the goal of this text? (Narrative, Descriptive, or Persuasive?)',
        answer: 'Persuasive (It is trying to change your behavior).',
      },
      {
        id: 4,
        question: 'Which type of text uses many words like "beautiful," "huge," "shining," and "bright"?',
        answer: 'Descriptive.',
      },
      {
        id: 5,
        question: 'Give an example of an Expository text you use in school every day.',
        answer: 'Your History, Science, or Geography textbooks.',
      },
    ],
  },
  {
    id: 'devices',
    title: 'Literary Devices (Secret Ingredients)',
    description:
      'Authors use literary devices to make their writing more powerful. These are like adding salt and spices to sadza – they make it much better! Master simile, metaphor, personification, alliteration, assonance, and imagery.',
    details: [
      'Simile: Comparing two things using "like" or "as" (e.g., "as strong as an ox").',
      'Metaphor: Saying one thing IS the other (NO "like" or "as") (e.g., "The teacher is a lion.").',
      'Personification: Giving human actions to non‑human things (e.g., "The sun smiled down.").',
      'Alliteration: Same consonant sound at the start of words (e.g., "Six silly snakes").',
      'Assonance: Same vowel sound inside words (e.g., "The fat cat sat").',
      'Imagery: Sensory language that makes you feel, smell, taste, hear, or see (e.g., "The crackling fire gave off a sweet smell of burning cedar wood.").',
    ],
    examples: (
      <div className="space-y-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/3">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Simile</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Comparing with 'like' or 'as'</p>
          </div>
          <div className="md:flex-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm italic text-slate-700 dark:text-slate-300">
            "He is as strong as an ox." / "The water was cold like ice."
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/3">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Metaphor</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Saying one thing IS another</p>
          </div>
          <div className="md:flex-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm italic text-slate-700 dark:text-slate-300">
            "The teacher is a lion." / "Life is a journey."
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/3">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Personification</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Human actions to non‑humans</p>
          </div>
          <div className="md:flex-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm italic text-slate-700 dark:text-slate-300">
            "The sun smiled down on us." / "The old door groaned."
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/3">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Alliteration &amp; Assonance</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Consonant or vowel repetition</p>
          </div>
          <div className="md:flex-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm italic text-slate-700 dark:text-slate-300">
            "Six silly snakes" (S) / "The fat cat sat" (A)
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="md:w-1/3">
            <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase">Imagery</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Sensory language</p>
          </div>
          <div className="md:flex-1 p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm italic text-slate-700 dark:text-slate-300">
            "The crackling fire gave off a sweet smell of burning cedar wood."
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Identify the Simile: "She sang like a bird" or "She is a bird."',
        answer: '"She sang like a bird" (It uses the word "like").',
      },
      {
        id: 2,
        question: 'Personification: What is the human action in this sentence: "The wind whistled through the trees"?',
        answer: 'Whistled (Wind doesn\'t have lips to whistle).',
      },
      {
        id: 3,
        question: 'Metaphor: What does this mean? "My brother is a giant."',
        answer: 'It means he is very tall or very big.',
      },
      {
        id: 4,
        question: 'Find the Alliteration in this sentence: "Big black bears bite berries."',
        answer: 'The "B" sound.',
      },
      {
        id: 5,
        question: 'Write a sentence using Imagery to describe the taste of a lemon.',
        answer: '(Example: The lemon was so sour it made my tongue tingle and my mouth pucker).',
      },
    ],
  },
  {
    id: 'literature',
    title: 'Literature (How to Analyze a Book)',
    description:
      'When you read a story, you need to analyze its characters, plot, setting, atmosphere, and theme. This helps you understand the deeper meaning of the text.',
    details: [
      'Character Analysis: Look at actions, speech, and thoughts to understand a character.',
      'Plot Development: Exposition → Rising Action → Climax → Falling Action → Resolution.',
      'Setting: The where (place) and when (time) of the story.',
      'Atmosphere: The feeling created by the setting and events (scary, peaceful, etc.).',
      'Theme: The main message or lesson of the story (e.g., love, war, friendship, honesty).',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <User size={16} /> Character Analysis
          </h5>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
            <li><strong>Actions:</strong> What do they do? (Share or steal?)</li>
            <li><strong>Speech:</strong> How do they talk? (Polite or rude?)</li>
            <li><strong>Thoughts:</strong> What are they thinking?</li>
          </ul>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <List size={16} /> Plot Development
          </h5>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
            <li>• <strong>Exposition:</strong> Meeting the characters.</li>
            <li>• <strong>Rising Action:</strong> Problems grow.</li>
            <li>• <strong>Climax:</strong> The most exciting part!</li>
            <li>• <strong>Falling Action:</strong> Problem is solved.</li>
            <li>• <strong>Resolution:</strong> The end.</li>
          </ul>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <MapPin size={16} /> Setting &amp; Atmosphere
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            <strong>Setting:</strong> The where and when. (e.g. A farm in Gweru in 2024).<br />
            <strong>Atmosphere:</strong> The feeling. (Is it scary? peaceful?)
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <Layers size={16} /> Theme
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            The main message or the lesson of the story. A big idea like Love, War, Friendship, or Honesty.
          </p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'If a story is about two friends who stop talking because of a lie, what is a likely Theme?',
        answer: 'Honesty or The importance of truth (or Friendship).',
      },
      {
        id: 2,
        question: 'What do we call the "most exciting part" of a movie or story?',
        answer: 'The Climax.',
      },
      {
        id: 3,
        question: 'What is the Setting of your life right now? (Where and when are you?)',
        answer: '(Example: In my classroom in Zimbabwe, during the year 2024).',
      },
      {
        id: 4,
        question: 'If a character helps an old lady cross the road, what does this tell us about their character?',
        answer: 'They are kind, helpful, or respectful.',
      },
      {
        id: 5,
        question: 'What happens during the Exposition of a story?',
        answer: 'We meet the characters and learn about their world.',
      },
    ],
  },
  {
    id: 'final',
    title: 'Final Assessment',
    subtitle: 'Put it all together',
    description:
      'Read the story below and answer the questions. Apply all the skills you have learned: skimming, scanning, vocabulary, inference, literary devices, character analysis, plot, setting, and theme.',
    details: [
      'Read the passage carefully.',
      'Identify literary devices and vocabulary.',
      'Analyze characters, plot, and theme.',
      'Distinguish between fact and opinion.',
    ],
    examples: (
      <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl italic font-serif">
        <h5 className="not-italic font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
          The Brave Herdboy
        </h5>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          "The sun was a golden plate in the sky as young Chipo led his cattle to the river. He was as proud as a king because his father had finally trusted him to go alone. Suddenly, the bushes began to shake. A huge, hungry leopard stepped out. Its eyes were burning coals. Chipo's heart was a drum beating in his chest. He remembered his father's words: 'Fear is a choice, but bravery is a duty.' Chipo did not run. He raised his staff and shouted loudly. The leopard, surprised by the boy's courage, turned and disappeared into the tall grass."
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Literary Device: Find one Simile in the text.',
        answer: '"As proud as a king."',
      },
      {
        id: 2,
        question: 'Literary Device: Find one Metaphor describing the sun.',
        answer: '"The sun was a golden plate."',
      },
      {
        id: 3,
        question: 'Inference: Why did Chipo feel "proud as a king"?',
        answer: 'Because his father finally trusted him to look after the cattle alone.',
      },
      {
        id: 4,
        question: 'Vocabulary: What does the word "staff" mean in this story? (A group of workers / A long wooden stick).',
        answer: 'A long wooden stick.',
      },
      {
        id: 5,
        question: 'Plot: What is the Climax (most exciting part) of this story?',
        answer: 'When the leopard steps out and Chipo has to decide whether to run or stay.',
      },
      {
        id: 6,
        question: 'Character: Describe Chipo using one adjective.',
        answer: 'Brave (or Courageous).',
      },
      {
        id: 7,
        question: 'Fact or Opinion: "Chipo\'s heart was beating fast."',
        answer: 'Fact.',
      },
      {
        id: 8,
        question: 'Theme: What is the lesson of this story?',
        answer: 'Courage/Bravery (Facing your fears).',
      },
      {
        id: 9,
        question: 'Personification: Find the sentence where the eyes are given a human-like quality or a quality of something else.',
        answer: '"Its eyes were burning coals" (This is a metaphor, but it gives the eyes a scary, fire-like quality).',
      },
      {
        id: 10,
        question: 'Setting: Where does this story take place?',
        answer: 'In the bush/fields near a river.',
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
export const ReadingLiterature: React.FC = () => {
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
        text: 'The word "inference" comes from Latin "inferre" meaning "to bring in." You bring in your own logic to understand what the author implies.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before you read the passage. This tells you what to look for and saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember literary devices: "Simile" uses "like" or "as" – both start with "s" for "similar."',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "metaphor" with "simile." A metaphor says something IS something else, while a simile says it is LIKE something else.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "inference" comes from Latin "inferre" meaning "to bring in." You bring in your own logic to understand what the author implies.',
      },
      {
        title: 'Pro Tip',
        text: 'Always read the questions before you read the passage. This tells you what to look for and saves time.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember literary devices: "Simile" uses "like" or "as" – both start with "s" for "similar."',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse "metaphor" with "simile." A metaphor says something IS something else, while a simile says it is LIKE something else.',
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
                    ? 'bg-indigo-600 border-b-4 border-indigo-900 text-white shadow-sm'
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
      <header className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-700 border-b-4 border-indigo-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-indigo-400/30 text-white border border-indigo-200/40 shadow-xs">
                READING &amp; LITERATURE
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
            Reading &amp; Literature{' '}
            <span className="text-indigo-200 font-bold italic">
              Comprehension &amp; Analysis
            </span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Learn how to be a "Reading Detective." Master reading skills,
            identify text types, understand literary devices, and analyze
            literature like a pro.
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
                placeholder="Search for a skill, device, or question..."
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
                  className="rounded-2xl border-2 border-b-4 border-indigo-800 bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-indigo-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
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
                  <span>Skills &amp; Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Literary Devices</span>
                  <span className="font-bold text-green-600 dark:text-green-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Good readers are active readers. Use skimming and scanning,
                look for context clues, make inferences, and always ask
                yourself: "What is the author trying to say?"
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
                <strong className="text-white">Reading Skills:</strong> Skimming
                (main idea), Scanning (specific info), Context Clues, Inferences,
                Fact vs. Opinion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Text Types:</strong> Narrative,
                Descriptive, Expository, Persuasive, Instructional – each has a
                different purpose.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Literary Devices:</strong> Simile,
                Metaphor, Personification, Alliteration, Assonance, Imagery – they
                make writing powerful.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Literature Analysis:</strong>{' '}
                Characters, Plot, Setting, Atmosphere, Theme – understand the
                deeper meaning.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReadingLiterature;
