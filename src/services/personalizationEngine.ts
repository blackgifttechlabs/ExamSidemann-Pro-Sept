import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { CURRICULUM_REGISTRY } from '../data/constants';
import { BOOK_LIBRARY } from '../data/bookLibrary';
import pastPaperData from '../data/pastPapers.json';
import feedNoteData from '../data/feedNotes.json';

/**
 * Personalization & Recommendation Engine for Exam Sidemann
 * 
 * Implements an intelligent behavioral learning feed algorithm:
 * Score = Exam Urgency (x1.5) + Weakness Weight (x2.0) + Dormancy Penalty (x1.2)
 *         + Interest Match (x1.4) + Freshness - Skip Penalty
 */

export interface ChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export type FeedNoteBlock = {
  kind: 'definition' | 'explanation' | 'list' | 'formula' | 'theorem' | 'did_you_know' | 'example';
  title?: string;
  body?: string;
  items?: string[];
};

export type FeedCardType =
  | 'challenge'
  | 'revision'
  | 'momentum'
  | 'exam_urgency'
  | 'career_discovery'
  | 'ai_tool'
  | 'past_paper_drill'
  | 'knowledge_spark'
  | 'book'
  | 'past_paper'
  | 'iq';

export interface FeedCardItem {
  id: string;
  type: FeedCardType;
  subject: string;
  topic: string;
  title: string;
  subtitle?: string;
  tag: string;
  badgeColor?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes?: number;
  scoreWeight?: number;

  // Challenge specifics
  question?: string;
  latex?: string;
  options?: ChallengeOption[];
  correctAnswer?: string;
  stepByStepSolution?: string[];
  similarQuestionPrompt?: string;

  // Revision specifics
  summaryPoints?: string[];
  noteBlocks?: FeedNoteBlock[];
  keyFormula?: string;
  lessonRoute?: string;
  lessonParams?: Record<string, any>;

  // Exam urgency specifics
  examDaysRemaining?: number;
  urgentTopics?: string[];

  // Career curiosity specifics
  careerTitle?: string;
  relatedSubjects?: string[];
  careerDescription?: string;
  exploreRoute?: string;

  // Past paper specifics
  paperYear?: string;
  paperName?: string;
  paperNumber?: number;

  // AI Tool specifics
  aiPromptPlaceholder?: string;
  aiSuggestedPrompt?: string;

  // Existing learning-resource specifics
  imageUrl?: string;
  resourceRoute?: string;
  resourceParams?: Record<string, any>;
  callToAction?: string;

  // Train Your Mind carousel specifics
  iqQuestions?: Array<{
    id: string;
    question: string;
    options: ChallengeOption[];
    correctAnswer: string;
    solution: string[];
  }>;
}

export interface StudentLearningSignals {
  grade: string;
  educationType?: 'high-school' | 'polytechnic' | 'ecd';
  enrolledSubjects: string[];
  targetExamDate?: string; // YYYY-MM-DD
  streakDays: number;
  totalPoints: number;
  solvedChallengeIds: string[];
  masteredTopicIds: string[];
  weakTopics: Array<{ subject: string; topic: string; errorCount: number; lastStruggled: string }>;
  strongTopics: Array<{ subject: string; topic: string; score: number }>;
  careerInterests: string[]; // e.g. "Software Engineering", "Mechanical Engineering", "Medicine", "CAD"
  skippedCardIds: string[];
  savedCardIds: string[];
  subjectLastActivity: Record<string, string>; // subject -> ISO date
  subjectAffinity: Record<string, number>;
  topicAffinity: Record<string, number>;
  cardMetrics: Record<string, PersonalizationCardMetric>;
  feedSessionCount: number;
  recentCardIds: string[];
}

export interface PersonalizationCardMetric {
  impressions: number;
  totalViewMs: number;
  completions: number;
  saves: number;
  skips: number;
  correctAnswers: number;
  incorrectAnswers: number;
  lastViewedAt?: string;
}

export type PersonalizationEventType =
  | 'impression'
  | 'view'
  | 'answer'
  | 'save'
  | 'skip'
  | 'mastered'
  | 'subject_activity'
  | 'career_interest'
  | 'exam_date'
  | 'academic_profile_reset';

const STORAGE_KEY = 'exam_sidemann_student_signals_v3';
const LEGACY_STORAGE_KEY = 'exam_sidemann_student_signals_v2';

const blankCardMetric = (): PersonalizationCardMetric => ({
  impressions: 0,
  totalViewMs: 0,
  completions: 0,
  saves: 0,
  skips: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
});

export const getStoredStudentSignals = (): StudentLearningSignals => {
  if (typeof window === 'undefined') {
    return getDefaultSignals();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      return { ...getDefaultSignals(), ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse student signals from localStorage', e);
  }
  return getDefaultSignals();
};

export const saveStudentSignals = (signals: Partial<StudentLearningSignals>): StudentLearningSignals => {
  const current = getStoredStudentSignals();
  const updated = { ...current, ...signals };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save student signals to localStorage', e);
    }
  }
  return updated;
};

const getDefaultSignals = (): StudentLearningSignals => {
  // Default target exam is ~14 days from now if not set
  const defaultExam = new Date();
  defaultExam.setDate(defaultExam.getDate() + 14);

  return {
    grade: 'Form 4',
    educationType: 'high-school',
    enrolledSubjects: ['Mathematics', 'Geography', 'Computer Science / ICT', 'Integrated Science', 'English Language'],
    targetExamDate: defaultExam.toISOString().split('T')[0],
    streakDays: 4,
    totalPoints: 120,
    solvedChallengeIds: [],
    masteredTopicIds: [],
    weakTopics: [
      { subject: 'Geography', topic: 'Weathering & Erosion', errorCount: 3, lastStruggled: new Date(Date.now() - 8 * 86400000).toISOString() },
      { subject: 'Mathematics', topic: 'Simultaneous Equations & Graphs', errorCount: 4, lastStruggled: new Date(Date.now() - 2 * 86400000).toISOString() },
      { subject: 'Integrated Science', topic: 'Electrolysis & Ionic Bonding', errorCount: 2, lastStruggled: new Date(Date.now() - 4 * 86400000).toISOString() },
    ],
    strongTopics: [
      { subject: 'Mathematics', topic: 'Linear Equations & Expansion', score: 92 },
      { subject: 'Computer Science / ICT', topic: 'Logic Gates & Binary Systems', score: 95 },
    ],
    careerInterests: ['Software Engineering', 'Robotics & AI', 'Mechanical Engineering'],
    skippedCardIds: [],
    savedCardIds: [],
    subjectAffinity: {},
    topicAffinity: {},
    cardMetrics: {},
    feedSessionCount: 0,
    recentCardIds: [],
    subjectLastActivity: {
      'Mathematics': new Date(Date.now() - 1 * 86400000).toISOString(),
      'Computer Science / ICT': new Date(Date.now() - 2 * 86400000).toISOString(),
      'Geography': new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago!
      'Integrated Science': new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  };
};

const bumpAffinity = (map: Record<string, number>, key: string, amount: number) => ({
  ...map,
  [key]: Math.max(-100, Math.min(100, (map[key] || 0) + amount)),
});

const persistPersonalization = (
  userId: string | undefined,
  signals: StudentLearningSignals,
  event: Record<string, unknown>,
) => {
  if (!userId) return;
  const profileRef = doc(db, 'users', userId, 'personalization', 'profile');
  void Promise.all([
    setDoc(profileRef, {
      ...signals,
      version: 3,
      updatedAt: serverTimestamp(),
    }, { merge: true }),
    addDoc(collection(db, 'users', userId, 'personalizationEvents'), {
      ...event,
      createdAt: serverTimestamp(),
    }),
  ]).catch((error) => {
    console.warn('Could not persist personalization metrics', error);
  });
};

export const loadStudentSignals = async (userId: string): Promise<StudentLearningSignals> => {
  const local = getStoredStudentSignals();
  try {
    const snapshot = await getDoc(doc(db, 'users', userId, 'personalization', 'profile'));
    if (!snapshot.exists()) {
      persistPersonalization(userId, local, { type: 'impression', source: 'profile_created' });
      return local;
    }
    const remote = snapshot.data() as Partial<StudentLearningSignals>;
    return saveStudentSignals({ ...local, ...remote });
  } catch (error) {
    console.warn('Could not load personalization profile; using the local copy', error);
    return local;
  }
};

export const resetStudentPersonalization = (
  userId: string,
  academic: Pick<StudentLearningSignals, 'grade' | 'educationType' | 'enrolledSubjects'>,
): StudentLearningSignals => {
  const current = getStoredStudentSignals();
  const reset: StudentLearningSignals = {
    ...getDefaultSignals(),
    ...academic,
    targetExamDate: current.targetExamDate,
    streakDays: current.streakDays,
    totalPoints: current.totalPoints,
    solvedChallengeIds: [],
    masteredTopicIds: [],
    weakTopics: [],
    strongTopics: [],
    careerInterests: [],
    skippedCardIds: [],
    savedCardIds: [],
    subjectLastActivity: {},
    subjectAffinity: {},
    topicAffinity: {},
    cardMetrics: {},
    feedSessionCount: 0,
    recentCardIds: [],
  };
  const updated = saveStudentSignals(reset);
  persistPersonalization(userId, updated, {
    type: 'academic_profile_reset',
    grade: academic.grade,
    educationType: academic.educationType || null,
    enrolledSubjects: academic.enrolledSubjects,
  });
  return updated;
};

/**
 * Calculates days remaining until target exam date
 */
export const getDaysUntilExam = (targetDateStr?: string): number => {
  if (!targetDateStr) return 14;
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
};

/**
 * Rich pool of educational content items across ZIMSEC, HEXCO & Practical topics
 */
export const CONTENT_CATALOG: FeedCardItem[] = [
  // 1. Math Quick Challenge
  {
    id: 'math-challenge-linear-1',
    type: 'challenge',
    subject: 'Mathematics',
    topic: 'Linear Equations',
    title: 'Quick Math Challenge',
    subtitle: 'Solve in under 45 seconds',
    tag: 'Quick Solve · +15 pts',
    badgeColor: 'bg-rose-500/15 text-rose-500 border-rose-500/20',
    difficulty: 'Beginner',
    durationMinutes: 1,
    question: 'Solve for x: 3x + 7 = 22',
    latex: '3x + 7 = 22',
    options: [
      { id: 'a', text: 'x = 3', isCorrect: false, explanation: '3(3) + 7 = 16 ≠ 22' },
      { id: 'b', text: 'x = 5', isCorrect: true, explanation: '3(5) + 7 = 15 + 7 = 22. Correct!' },
      { id: 'c', text: 'x = 7', isCorrect: false, explanation: '3(7) + 7 = 28 ≠ 22' },
      { id: 'd', text: 'x = 9', isCorrect: false, explanation: '3(9) + 7 = 34 ≠ 22' },
    ],
    correctAnswer: 'x = 5',
    stepByStepSolution: [
      'Step 1: Subtract 7 from both sides: 3x = 22 - 7 = 15',
      'Step 2: Divide both sides by 3: x = 15 / 3',
      'Step 3: Therefore, x = 5',
    ],
    similarQuestionPrompt: 'Solve for y: 4y - 9 = 27',
  },

  // 2. Geography Weak Spot Revisit (Identified from dormancy / mistakes)
  {
    id: 'geo-revisit-weathering',
    type: 'revision',
    subject: 'Geography',
    topic: 'Weathering & Erosion',
    title: 'Because you struggled with Geography',
    subtitle: "You haven't revised this in 8 days. Let's fix it in 2 minutes!",
    tag: '2 min Revision · High Exam Frequency',
    badgeColor: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
    difficulty: 'Intermediate',
    durationMinutes: 2,
    summaryPoints: [
      'Physical Weathering (Freeze-Thaw, Exfoliation): Rocks break down mechanically without changing chemical composition.',
      'Chemical Weathering (Carbonation, Oxidation): Rainwater containing dissolved CO₂ reacts with limestone (calcium carbonate).',
      'Biological Weathering: Tree roots expanding in rock joints and burrowing animals.',
      'Key Exam Tip: ZIMSEC Paper 2 frequently asks to distinguish between Weathering (in situ breakdown) and Erosion (breakdown + transport by wind/water/ice).',
    ],
    keyFormula: 'Weathering = Breakdown in situ | Erosion = Breakdown + Transportation',
    lessonRoute: 'courses/overview',
    lessonParams: { tab: 'Geography' },
  },

  // 3. Math Simultaneous Equations Weak Spot Challenge
  {
    id: 'math-challenge-simultaneous',
    type: 'challenge',
    subject: 'Mathematics',
    topic: 'Simultaneous Equations',
    title: 'Let’s master Simultaneous Equations',
    subtitle: 'Step up your confidence with elimination method',
    tag: 'Targeted Practice · +20 pts',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    difficulty: 'Intermediate',
    durationMinutes: 2,
    question: 'Find the values of x and y for:\n2x + y = 11\nx - y = 1',
    latex: '\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}',
    options: [
      { id: 'a', text: 'x = 4, y = 3', isCorrect: true, explanation: 'Adding both equations: 3x = 12 → x = 4. Then 4 - y = 1 → y = 3. Spot on!' },
      { id: 'b', text: 'x = 3, y = 5', isCorrect: false, explanation: '2(3) + 5 = 11, but 3 - 5 = -2 ≠ 1' },
      { id: 'c', text: 'x = 5, y = 1', isCorrect: false, explanation: '2(5) + 1 = 11, but 5 - 1 = 4 ≠ 1' },
      { id: 'd', text: 'x = 6, y = -1', isCorrect: false, explanation: '6 - (-1) = 7 ≠ 1' },
    ],
    correctAnswer: 'x = 4, y = 3',
    stepByStepSolution: [
      'Step 1: Add Equation (1) and Equation (2) to eliminate y:',
      '(2x + y) + (x - y) = 11 + 1  ==>  3x = 12',
      'Step 2: Solve for x: x = 12 / 3 = 4',
      'Step 3: Substitute x = 4 into Eq 2: 4 - y = 1  ==>  y = 3',
      'Step 4: Verify with Eq 1: 2(4) + 3 = 8 + 3 = 11 (Verified!)',
    ],
    similarQuestionPrompt: 'Solve: 3x + 2y = 16 and x - 2y = 0',
  },

  // 4. Momentum / Streak Card
  {
    id: 'momentum-streak-builder',
    type: 'momentum',
    subject: 'All Subjects',
    topic: 'Consistency',
    title: 'Keep your momentum going',
    subtitle: "You've studied 4 days in a row. Let's make it 5 today!",
    tag: 'Daily Streak Goal',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    durationMinutes: 1,
    summaryPoints: [
      'Daily active consistency beats 6-hour cram sessions before exams.',
      'Completing 1 quick challenge or 5 minutes of revision protects your streak today.',
      'Students on a 5+ day streak score on average 28% higher on ZIMSEC past papers.',
    ],
  },

  // 5. Exam Urgency & Target Revision Plan
  {
    id: 'exam-urgency-revision-plan',
    type: 'exam_urgency',
    subject: 'Curriculum Revision',
    topic: 'Targeted Review',
    title: 'Your target exam is in 14 days',
    subtitle: 'Prioritize these 4 high-yield topics before your test:',
    tag: 'Exam Countdown',
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    examDaysRemaining: 14,
    urgentTopics: [
      'Algebra & Quadratic Factorisation (Mathematics)',
      'Trigonometry & Bearings (Mathematics)',
      'Weathering, Climatic Regions & Mapwork (Geography)',
      'Logic Gates & Data Representation (Computer Science)',
    ],
  },

  // 6. Career Discovery / Curiosity Card
  {
    id: 'career-discovery-engineering',
    type: 'career_discovery',
    subject: 'Computer Science & Drawing',
    topic: 'Engineering & AI',
    title: 'How ICT and Tech Drawing connect to Engineering',
    subtitle: 'Since you’ve been studying ICT and Technical Drawing...',
    tag: 'Career Spotlight',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    careerTitle: 'Software & Mechatronics Engineering',
    relatedSubjects: ['Computer Science', 'Mathematics', 'Technical Drawing', 'Physics'],
    careerDescription: 'Combining 3D CAD modeling with code is the backbone of robotics, aerospace, and modern Zimbabwe infrastructure projects.',
    exploreRoute: 'practicals/tools/webdev',
  },

  // 7. Integrated AI Tool: Math Step-by-Step Solver
  {
    id: 'ai-tool-solver-card',
    type: 'ai_tool',
    subject: 'AI Study Assistant',
    topic: 'Step-by-Step Solver',
    title: 'Instant Step-by-Step AI Problem Solver',
    subtitle: 'Stuck on any tricky question or equation? Ask right here:',
    tag: 'AI Powered Tutor',
    badgeColor: 'bg-rose-500/15 text-[#ff6b7a] border-rose-500/20',
    aiPromptPlaceholder: 'e.g. Solve 2x² - 5x + 3 = 0 using the quadratic formula',
    aiSuggestedPrompt: 'Explain how photosynthesis differs between C3 and C4 plants in simple terms with an example.',
  },

  // 8. Science Quick Concept Challenge
  {
    id: 'science-challenge-photosynthesis',
    type: 'challenge',
    subject: 'Integrated Science',
    topic: 'Photosynthesis & Respiration',
    title: 'Quick Science Concept Check',
    subtitle: 'Test your understanding of plant biology',
    tag: 'Concept Drill · +15 pts',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    difficulty: 'Beginner',
    durationMinutes: 1,
    question: 'What is the primary gas released as a byproduct during photosynthesis?',
    options: [
      { id: 'a', text: 'Carbon Dioxide (CO₂)', isCorrect: false, explanation: 'CO₂ is consumed (absorbed) during photosynthesis, not released.' },
      { id: 'b', text: 'Oxygen (O₂)', isCorrect: true, explanation: 'During light reactions, water molecules are split, releasing O₂ into the air. Spot on!' },
      { id: 'c', text: 'Nitrogen (N₂)', isCorrect: false, explanation: 'Nitrogen is not produced in photosynthesis.' },
      { id: 'd', text: 'Methane (CH₄)', isCorrect: false, explanation: 'Methane is produced by anaerobic decomposition, not photosynthesis.' },
    ],
    correctAnswer: 'Oxygen (O₂)',
    stepByStepSolution: [
      'Chemical Equation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂',
      'Sunlight splits water (H₂O) in the chloroplasts (photolysis).',
      'Hydrogen is used to form glucose (C₆H₁₂O₆), while Oxygen (O₂) is discharged through the stomata.',
    ],
    similarQuestionPrompt: 'What happens to the rate of photosynthesis when temperature exceeds 45°C?',
  },

  // 9. Past Paper Drill
  {
    id: 'past-paper-drill-zimsec-2023',
    type: 'past_paper_drill',
    subject: 'Mathematics',
    topic: 'Probability',
    title: 'ZIMSEC Past Paper Drill (Paper 2)',
    subtitle: 'Recent exam question — try in 2 minutes',
    tag: 'ZIMSEC Specimen · +25 pts',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    paperYear: '2023',
    paperName: 'ZIMSEC Mathematics O-Level Paper 2',
    question: 'A bag contains 5 red balls and 3 blue balls. If two balls are drawn at random without replacement, what is the probability that both are red?',
    options: [
      { id: 'a', text: '5/14', isCorrect: true, explanation: 'P(1st Red) = 5/8. P(2nd Red) = 4/7. P(Both) = (5/8) × (4/7) = 20/56 = 5/14. Perfect!' },
      { id: 'b', text: '25/64', isCorrect: false, explanation: 'That would be with replacement: (5/8) × (5/8). But the question specifies WITHOUT replacement.' },
      { id: 'c', text: '1/2', isCorrect: false, explanation: '5/14 ≈ 0.357, which is less than 1/2.' },
      { id: 'd', text: '15/56', isCorrect: false, explanation: '15/56 is the probability of drawing 1 Red and 1 Blue.' },
    ],
    correctAnswer: '5/14',
    stepByStepSolution: [
      'Total balls at start = 5 + 3 = 8 balls.',
      'Probability of 1st ball being red = 5/8.',
      'After removing 1 red, 4 red remain out of 7 total balls.',
      'Probability of 2nd ball being red = 4/7.',
      'Combined Probability = (5/8) × (4/7) = 20/56 = 5/14.',
    ],
  },

  // 10. Computer Science / AI Spark
  {
    id: 'cs-curiosity-how-ai-works',
    type: 'knowledge_spark',
    subject: 'Computer Science / ICT',
    topic: 'Artificial Intelligence',
    title: 'How does AI actually predict what you type?',
    subtitle: 'A 90-second glimpse into neural networks & language models',
    tag: 'Curiosity Spark',
    badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    summaryPoints: [
      'Language models represent words as lists of numbers (called vectors or embeddings).',
      'Words with similar meanings (e.g. "student" and "learner") are placed close together in multi-dimensional space.',
      'When you ask a question, the model computes probabilities of the most likely next word using matrix multiplication.',
      'Zimbabwean programmers are currently using these exact principles to build Shona and Ndebele translation engines!',
    ],
  },
];

const normalizeAcademicText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const normalizeSubjectPath = (value: string) => normalizeAcademicText(value)
  .replace(/and/g, '')
  .replace('computersystemsmaintenance', 'csm')
  .replace('familyreligiousstudies', 'frs')
  .replace('familyandreligiousstudies', 'frs')
  .replace('englishlanguage', 'english')
  .replace('nationalstrategicstudies', 'nationalstudies')
  .replace('safetyhealthenvironmentquality', 'safetyhealthenv')
  .replace('integratedscience', 'combinedscience')
  .replace('computerstudies', 'computerscience');

const subjectsMatch = (left: string, right: string) => {
  const a = normalizeAcademicText(left).replace('integratedscience', 'combinedscience').replace('computerstudies', 'computerscience');
  const b = normalizeAcademicText(right).replace('integratedscience', 'combinedscience').replace('computerstudies', 'computerscience');
  return a === b || a.includes(b) || b.includes(a);
};

const balanceCardsAcrossSubjects = (cards: FeedCardItem[], profileSubjects: string[]) => {
  const subjectOrder: string[] = [];
  profileSubjects.forEach((profileSubject) => {
    cards.forEach((card) => {
      if (subjectsMatch(profileSubject, card.subject) && !subjectOrder.includes(card.subject)) {
        subjectOrder.push(card.subject);
      }
    });
  });
  cards.forEach((card) => {
    if (!subjectOrder.includes(card.subject)) subjectOrder.push(card.subject);
  });

  const queues = new Map(subjectOrder.map((subject) => [
    subject,
    cards.filter((card) => card.subject === subject),
  ]));
  const balanced: FeedCardItem[] = [];
  let added = true;
  while (added) {
    added = false;
    subjectOrder.forEach((subject) => {
      const next = queues.get(subject)?.shift();
      if (next) {
        balanced.push(next);
        added = true;
      }
    });
  }
  return balanced;
};

const subjectImage = (subject: string) => {
  const normalized = subject.toLowerCase();
  if (normalized.includes('math')) return '/images/extra-lessons/mathematics.jpg';
  if (normalized.includes('geograph')) return '/images/extra-lessons/geography.jpg';
  if (normalized.includes('agric')) return '/images/extra-lessons/agric.jpg';
  if (normalized.includes('chem')) return '/images/extra-lessons/chemistry.jpg';
  if (normalized.includes('bio')) return '/images/extra-lessons/biology.jpg';
  if (normalized.includes('physics')) return '/images/extra-lessons/physics.jpeg';
  if (normalized.includes('business') || normalized.includes('entrepreneur')) return '/images/extra-lessons/business.jpg';
  if (normalized.includes('drawing') || normalized.includes('graphics')) return '/images/extra-lessons/technicaldrawing.png';
  if (normalized.includes('computer') || normalized.includes('program') || normalized.includes('database')) return '/images/extra-lessons/computerscience.webp';
  return undefined;
};

const paperCourseMatches = (grade: string, sublevel: string, level: string) => {
  const normalizedGrade = normalizeAcademicText(grade);
  const normalizedSublevel = normalizeAcademicText(sublevel);
  if (normalizedGrade === 'form1' || normalizedGrade === 'form2') return normalizedSublevel.includes('zjc');
  if (normalizedGrade === 'form3' || normalizedGrade === 'form4') return normalizedSublevel.includes('olevel');
  if (normalizedGrade.includes('lower6') || normalizedGrade.includes('upper6')) return normalizedSublevel.includes('alevel');
  if (level === 'Polytechnic') return normalizedSublevel.includes(normalizedGrade) || normalizedGrade.includes(normalizedSublevel);
  return normalizedSublevel === normalizedGrade;
};

const paperRouteCourse = (grade: string) => {
  const normalized = normalizeAcademicText(grade);
  if (normalized === 'form1' || normalized === 'form2') return 'ZJC';
  if (normalized === 'form3' || normalized === 'form4') return "O' Level";
  if (normalized.includes('lower6') || normalized.includes('upper6')) return "A' Level";
  return grade;
};

const noteBlocksFromPoints = (points: string[]): FeedNoteBlock[] => {
  const blocks: FeedNoteBlock[] = [];
  const steps: string[] = [];
  points.forEach((rawPoint) => {
    const point = rawPoint.replace(/^•\s*/, '').trim();
    if (/^Step \d+:/i.test(point)) {
      steps.push(point.replace(/^Step \d+:\s*/i, ''));
      return;
    }
    const labelled = point.match(/^(Definition|Explanation|Example|Answer|Formula|Key rule):\s*(.+)$/i);
    if (labelled) {
      const label = labelled[1].toLowerCase();
      const kind: FeedNoteBlock['kind'] = label === 'key rule'
        ? 'theorem'
        : label === 'answer'
          ? 'example'
          : label as FeedNoteBlock['kind'];
      blocks.push({ kind, body: labelled[2] });
      return;
    }
    blocks.push({ kind: 'explanation', body: point });
  });
  if (steps.length) blocks.splice(Math.min(1, blocks.length), 0, { kind: 'list', title: 'Steps', items: steps });
  return blocks.filter((block) => block.body || block.items?.length).slice(0, 4);
};

/** Builds a broad but strictly level/subject-eligible pool from content already in the app. */
export const buildEligibleContentCatalog = (signals: StudentLearningSignals): FeedCardItem[] => {
  const level = CURRICULUM_REGISTRY.find((item) => normalizeAcademicText(item.name) === normalizeAcademicText(signals.grade));
  const enrolled = signals.enrolledSubjects.length
    ? signals.enrolledSubjects
    : level?.subjects.map((subject) => subject.name) || [];
  const eligibleSubjects = enrolled.map((name) => (
    level?.subjects.find((subject) => subjectsMatch(name, subject.name)) || {
      name,
      description: `${name} material for ${signals.grade}`,
      outcomeCount: 1,
    }
  ));
  const cards: FeedCardItem[] = [];
  const dailyRotation = Math.floor(Date.now() / 86400000);
  const rotationSeed = dailyRotation * 53 + signals.feedSessionCount * 17;
  const sourceNotes = Object.entries(feedNoteData as Record<string, {
    title: string;
    snippets: string[];
    cards?: Array<{
      title: string;
      subtitle?: string;
      points: string[];
      blocks?: FeedNoteBlock[];
      imageUrl?: string;
    }>;
  }>);

  const noteGroups = eligibleSubjects.map((subject, subjectIndex) => {
    const levelKey = normalizeAcademicText(level?.id || signals.grade);
    const subjectKey = normalizeSubjectPath(subject.name);
    const lessonCards = sourceNotes
      .filter(([path]) => {
        const segments = path.split('/');
        const levelIndex = segments.findIndex((segment) => normalizeAcademicText(segment) === levelKey);
        const pathSubject = levelIndex >= 0 ? normalizeSubjectPath(segments[levelIndex + 1] || '') : '';
        return levelIndex >= 0 && Boolean(pathSubject) && (
          pathSubject.includes(subjectKey) || subjectKey.includes(pathSubject)
        );
      })
      .flatMap(([, note]) => [
        ...(note.cards || []),
        { title: note.title, points: note.snippets },
      ])
      .filter((note, index, all) => note.title && note.points.length && all.findIndex((candidate) => (
        normalizeAcademicText(candidate.title) === normalizeAcademicText(note.title)
      )) === index);
    // Do not turn a curriculum heading or subject description into a pretend
    // lesson. If no note body was extracted, resource cards can still appear,
    // but teaching cards must always be backed by actual class-note content.
    const usableCards = lessonCards;
    const teachingCards: FeedCardItem[] = [];
    usableCards.forEach((note, offset) => {
      const topic = note.title;
      teachingCards.push({
        id: `notes-${level?.id || normalizeAcademicText(signals.grade)}-${normalizeAcademicText(subject.name)}-${normalizeAcademicText(topic)}-${normalizeAcademicText(note.points[0] || '').slice(0, 32)}`,
        type: offset > 0 && offset % 7 === 0 ? 'knowledge_spark' : 'revision',
        subject: subject.name,
        topic,
        title: topic,
        subtitle: note.subtitle || `${signals.grade} · ${subject.name}`,
        tag: 'From your class notes',
        durationMinutes: 1,
        summaryPoints: note.points.slice(0, 6),
        noteBlocks: (note.blocks?.length ? note.blocks : noteBlocksFromPoints(note.points)).slice(0, 4),
        imageUrl: note.imageUrl,
        lessonRoute: 'courses/detail',
        lessonParams: { id: signals.grade, subject: subject.name },
      });
    });

    // Produce a large question bank from the real headings and points. Each
    // distractor comes from a different section of the same subject notes.
    const questionSources = usableCards.filter((note) => note.points.length > 0);
    const questionCards: FeedCardItem[] = [];
    let variant = 0;
    while (teachingCards.length + questionCards.length < 400 && questionSources.length >= 2 && variant < 1600) {
      const source = questionSources[variant % questionSources.length];
      const pointIndex = Math.floor(variant / questionSources.length) % source.points.length;
      const correctPoint = source.points[pointIndex];
      const otherSections = questionSources.filter((candidate) => candidate.title !== source.title);
      const statementDistractors = otherSections
        .map((candidate, index) => candidate.points[(variant + index) % candidate.points.length])
        .filter((point, index, all) => point && point !== correctPoint && all.indexOf(point) === index);
      const titleDistractors = otherSections
        .map((candidate) => candidate.title)
        .filter((title, index, all) => title !== source.title && all.indexOf(title) === index);
      const reverseQuestion = variant % 2 === 1 && titleDistractors.length >= 3;
      const distractors = (reverseQuestion ? titleDistractors : statementDistractors).slice(0, 3);
      if (distractors.length >= 3) {
        const correctText = reverseQuestion ? source.title : correctPoint;
        const rawOptions = [correctText, ...distractors];
        const correctPosition = variant % rawOptions.length;
        const orderedOptions = [...rawOptions.slice(1, correctPosition + 1), correctText, ...rawOptions.slice(correctPosition + 1)];
        questionCards.push({
          id: `question-${level?.id || normalizeAcademicText(signals.grade)}-${normalizeAcademicText(subject.name)}-${normalizeAcademicText(source.title)}-${pointIndex}-${variant}`,
          type: 'challenge',
          subject: subject.name,
          topic: source.title,
          title: `Quick check: ${source.title}`,
          subtitle: `${signals.grade} · ${subject.name}`,
          tag: 'From your class notes',
          durationMinutes: 1,
          question: reverseQuestion
            ? `Which lesson heading matches this note?\n${correctPoint}`
            : `According to your notes, which statement appears under “${source.title}”?`,
          options: orderedOptions.map((text, index) => ({
            id: String.fromCharCode(97 + index),
            text,
            isCorrect: text === correctText,
          })),
          correctAnswer: correctText,
          stepByStepSolution: [reverseQuestion
            ? `This point is taught under “${source.title}”.`
            : `The matching note is: ${correctPoint}`],
          lessonRoute: 'courses/detail',
          lessonParams: { id: signals.grade, subject: subject.name },
        });
      }
      variant += 1;
    }
    // The For You page teaches first. Checks are deliberately spaced between
    // real note cards instead of taking over the stream.
    const group: FeedCardItem[] = [];
    const desiredSize = Math.min(400, teachingCards.length + questionCards.length);
    let teachingIndex = 0;
    let questionIndex = 0;
    while (group.length < desiredSize && (teachingIndex < teachingCards.length || questionIndex < questionCards.length)) {
      for (let count = 0; count < 5 && teachingIndex < teachingCards.length && group.length < desiredSize; count += 1) {
        group.push(teachingCards[teachingIndex++]);
      }
      if (questionIndex < questionCards.length && group.length < desiredSize) group.push(questionCards[questionIndex++]);
      if (teachingIndex >= teachingCards.length && questionIndex < questionCards.length && group.length < desiredSize) {
        // Keep the wider practice bank available, but it will be strongly
        // limited when the personalized For You session is assembled below.
        group.push(questionCards[questionIndex++]);
      }
    }
    const start = group.length ? (rotationSeed + subjectIndex * 29) % group.length : 0;
    return [...group.slice(start), ...group.slice(0, start)].slice(0, 400);
  });
  const largestSubjectBank = Math.max(0, ...noteGroups.map((group) => group.length));
  for (let offset = 0; offset < largestSubjectBank; offset += 1) {
    noteGroups.forEach((group) => {
      if (group[offset]) cards.push(group[offset]);
    });
  }

  BOOK_LIBRARY
    .filter((book) => normalizeAcademicText(book.course) === normalizeAcademicText(signals.grade))
    .filter((book) => enrolled.some((subject) => subjectsMatch(subject, book.subject)))
    .slice(0, 8)
    .forEach((book) => cards.push({
      id: `book-${book.id}`,
      type: 'book',
      subject: book.subject,
      topic: 'Book Library',
      title: book.title,
      subtitle: [book.author, book.size].filter(Boolean).join(' · '),
      tag: `Book for ${signals.grade}`,
      imageUrl: book.coverUrl,
      resourceRoute: 'library',
      resourceParams: { course: signals.grade, subject: book.subject, bookId: book.id },
      callToAction: 'Open this book',
    }));

  (pastPaperData as Array<{ level: string; sublevel: string; subject: string; year: string; type: string; fileId: string }>)
    .filter((paper) => paper.fileId && paper.fileId !== 'PASTE_GOOGLE_DRIVE_FILE_ID_HERE')
    .filter((paper) => paperCourseMatches(signals.grade, paper.sublevel, paper.level))
    .filter((paper) => enrolled.some((subject) => subjectsMatch(subject, paper.subject)))
    .slice(0, 8)
    .forEach((paper) => cards.push({
      id: `paper-${paper.fileId}`,
      type: 'past_paper',
      subject: paper.subject,
      topic: `${paper.year} ${paper.type}`,
      title: 'Check out this question paper',
      subtitle: `${paper.subject} · ${paper.year} · ${paper.type}`,
      tag: `For your ${signals.grade} course`,
      imageUrl: `/images/past-paper-thumbnails/${paper.fileId}.png`,
      resourceRoute: 'past-papers',
      resourceParams: { course: paperRouteCourse(signals.grade), subject: paper.subject },
      callToAction: 'Open question paper',
    }));

  if (!cards.some((card) => card.type === 'past_paper') && eligibleSubjects[0]) {
    cards.push({
      id: `papers-${normalizeAcademicText(signals.grade)}-${normalizeAcademicText(eligibleSubjects[0].name)}`,
      type: 'past_paper',
      subject: eligibleSubjects[0].name,
      topic: 'Question papers',
      title: 'Check out your question papers',
      subtitle: `${signals.grade} · ${eligibleSubjects[0].name}`,
      tag: `For your ${signals.grade} course`,
      imageUrl: subjectImage(eligibleSubjects[0].name),
      resourceRoute: 'past-papers',
      resourceParams: { course: paperRouteCourse(signals.grade) },
      callToAction: 'Browse question papers',
    });
  }

  cards.push({
    id: 'iq-sequence-training',
    type: 'iq',
    subject: 'Train Your Mind',
    topic: 'Pattern recognition',
    title: 'Train your mind',
    subtitle: 'A quick pattern challenge for every course and level',
    tag: 'IQ challenge',
    imageUrl: '/images/iq/Bookworm.png',
    question: 'What comes next? 2, 6, 12, 20, 30, ? ',
    options: [
      { id: 'a', text: '36', isCorrect: false },
      { id: 'b', text: '40', isCorrect: false },
      { id: 'c', text: '42', isCorrect: true },
      { id: 'd', text: '44', isCorrect: false },
    ],
    correctAnswer: '42',
    stepByStepSolution: ['The gaps are 4, 6, 8 and 10. The next gap is 12, so 30 + 12 = 42.'],
    iqQuestions: [
      {
        id: 'growing-gaps',
        question: 'What comes next? 2, 6, 12, 20, 30, ?',
        options: [
          { id: 'a', text: '36', isCorrect: false },
          { id: 'b', text: '40', isCorrect: false },
          { id: 'c', text: '42', isCorrect: true },
          { id: 'd', text: '44', isCorrect: false },
        ],
        correctAnswer: '42',
        solution: ['The gaps are 4, 6, 8 and 10. The next gap is 12, so 30 + 12 = 42.'],
      },
      {
        id: 'doubling-sequence',
        question: 'What comes next? 3, 6, 12, 24, ?',
        options: [
          { id: 'a', text: '30', isCorrect: false },
          { id: 'b', text: '36', isCorrect: false },
          { id: 'c', text: '48', isCorrect: true },
          { id: 'd', text: '54', isCorrect: false },
        ],
        correctAnswer: '48',
        solution: ['Each number is doubled: 3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24, and 24 × 2 = 48.'],
      },
      {
        id: 'odd-one-out',
        question: 'Which number does not belong? 9, 16, 25, 36, 45, 49',
        options: [
          { id: 'a', text: '16', isCorrect: false },
          { id: 'b', text: '36', isCorrect: false },
          { id: 'c', text: '45', isCorrect: true },
          { id: 'd', text: '49', isCorrect: false },
        ],
        correctAnswer: '45',
        solution: ['All the other numbers are perfect squares: 3², 4², 5², 6² and 7².'],
      },
      {
        id: 'letter-pattern',
        question: 'Which letter comes next? A, C, F, J, O, ?',
        options: [
          { id: 'a', text: 'S', isCorrect: false },
          { id: 'b', text: 'T', isCorrect: false },
          { id: 'c', text: 'U', isCorrect: true },
          { id: 'd', text: 'V', isCorrect: false },
        ],
        correctAnswer: 'U',
        solution: ['The jumps increase by one letter each time: +2, +3, +4, +5, then +6. Six letters after O is U.'],
      },
      {
        id: 'logic-order',
        question: 'Tariro is taller than Rudo. Rudo is taller than Kuda. Who is the shortest?',
        options: [
          { id: 'a', text: 'Tariro', isCorrect: false },
          { id: 'b', text: 'Rudo', isCorrect: false },
          { id: 'c', text: 'Kuda', isCorrect: true },
          { id: 'd', text: 'Cannot be known', isCorrect: false },
        ],
        correctAnswer: 'Kuda',
        solution: ['The order from tallest to shortest is Tariro, Rudo, then Kuda.'],
      },
    ],
    resourceRoute: 'iq-trainer',
    callToAction: 'Open IQ Trainer',
  });

  cards.push({
    id: `ai-tutor-${normalizeAcademicText(signals.grade)}`,
    type: 'ai_tool',
    subject: signals.grade,
    topic: 'Personal tutor',
    title: 'Ask about today’s class work',
    subtitle: 'Get one clear step at a time',
    tag: 'AI tutor',
    aiPromptPlaceholder: 'What would you like explained?',
  });

  return cards;
};

/**
 * Intelligent Personalization Scoring Engine
 * Evaluates student signals to dynamically order and filter cards
 */
export const getPersonalizedFeed = (signals: StudentLearningSignals): FeedCardItem[] => {
  const {
    enrolledSubjects,
    weakTopics,
    strongTopics,
    careerInterests,
    solvedChallengeIds,
    skippedCardIds,
    subjectLastActivity,
    targetExamDate,
    subjectAffinity,
    topicAffinity,
    cardMetrics,
    recentCardIds,
  } = signals;

  const daysRemaining = getDaysUntilExam(targetExamDate);

  const eligibleCatalog = buildEligibleContentCatalog(signals);
  const scored = eligibleCatalog.map((card) => {
    let score = 50; // Base score

    // 1. Skip penalty: Don't show skipped items unless few items left
    if (skippedCardIds.includes(card.id)) {
      score -= 200;
    }

    // 2. Solved penalty: Push solved challenges down, but keep accessible
    if (solvedChallengeIds.includes(card.id)) {
      score -= 60;
    }

    if (recentCardIds.includes(card.id)) {
      score -= 1000;
    }

    // 3. Subject match: Boost enrolled subjects
    const isEnrolled = enrolledSubjects.some((subject) => subjectsMatch(subject, card.subject));
    if (isEnrolled || card.subject === 'All Subjects' || card.type === 'momentum') {
      score += 40;
    }

    // 4. Weakness urgency boost (x2.0 weight)
    const isWeakSpot = weakTopics.some((weak) => (
      card.topic.toLowerCase().includes(weak.topic.toLowerCase()) || subjectsMatch(card.subject, weak.subject)
    ));
    if (isWeakSpot) {
      score += 85;
    }

    // 5. Subject dormancy boost (haven't touched subject in >5 days)
    const lastDate = subjectLastActivity[card.subject];
    if (lastDate) {
      const daysSince = (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince >= 5) {
        score += Math.min(60, daysSince * 10); // Higher boost for subjects neglected longer
      }
    }

    // 6. Exam countdown urgency (x1.5 weight)
    if (card.type === 'exam_urgency' || card.type === 'past_paper_drill') {
      if (daysRemaining <= 21) {
        score += 70;
      }
    }

    // 7. Career interest match (x1.4 weight)
    if (card.type === 'career_discovery') {
      const matchesCareer = careerInterests.some((c) => card.title.toLowerCase().includes(c.toLowerCase()) || (card.careerTitle && card.careerTitle.toLowerCase().includes(c.toLowerCase())));
      if (matchesCareer) {
        score += 55;
      }
    }

    // 8. Challenge & Interactive weight boost to keep learning active
    if (card.type === 'challenge' && !solvedChallengeIds.includes(card.id)) {
      score += card.id.startsWith('question-') ? -12 : 30;
    }

    // 9. Gradual behavioral learning. Positive engagement nudges similar
    // subjects/topics upward; quick skips and repeated exposure reduce them.
    score += (subjectAffinity[card.subject] || 0) * 1.5;
    score += (topicAffinity[`${card.subject}:${card.topic}`] || 0) * 2;
    const metric = cardMetrics[card.id];
    if (metric) {
      const averageViewSeconds = metric.impressions > 0
        ? metric.totalViewMs / metric.impressions / 1000
        : 0;
      score += Math.min(30, averageViewSeconds * 1.5);
      score += metric.completions * 12 + metric.saves * 18 + metric.correctAnswers * 8;
      score -= metric.skips * 28 + metric.incorrectAnswers * 2;
      score -= Math.max(0, metric.impressions - 3) * 4;
    }

    return {
      ...card,
      scoreWeight: score,
    };
  });

  // Keep the rendered session light while drawing from the much larger bank.
  // Resource cards are woven into the learning stream instead of collecting at
  // the very end after hundreds of lesson questions.
  const sorted = scored.sort((a, b) => (b.scoreWeight || 0) - (a.scoreWeight || 0));
  const available = sorted.filter((card) => (card.scoreWeight || 0) > -300);
  const resourceTypes = new Set<FeedCardType>(['book', 'past_paper', 'iq', 'ai_tool']);
  const resources = balanceCardsAcrossSubjects(
    available.filter((card) => resourceTypes.has(card.type)),
    enrolledSubjects,
  ).slice(0, 8);
  const teaching = balanceCardsAcrossSubjects(
    available.filter((card) => !resourceTypes.has(card.type) && card.type !== 'challenge'),
    enrolledSubjects,
  );
  const questions = balanceCardsAcrossSubjects(
    available.filter((card) => card.type === 'challenge'),
    enrolledSubjects,
  );
  const learning: FeedCardItem[] = [];
  let teachingIndex = 0;
  let questionIndex = 0;
  const questionLimit = Math.min(questions.length, Math.max(1, Math.ceil(teaching.length / 5)));
  while (learning.length < 72 && (teachingIndex < teaching.length || questionIndex < questionLimit)) {
    for (let count = 0; count < 5 && teachingIndex < teaching.length && learning.length < 72; count += 1) {
      learning.push(teaching[teachingIndex++]);
    }
    if (questionIndex < questionLimit && learning.length < 72) learning.push(questions[questionIndex++]);
  }
  const session: FeedCardItem[] = [];
  learning.forEach((card, index) => {
    session.push(card);
    if ((index + 1) % 9 === 0 && resources.length) session.push(resources.shift()!);
  });
  session.push(...resources);
  return session.slice(0, 80);
};

/**
 * Record a student action to adapt the feed in real-time
 */
export const recordStudentAction = {
  solveChallenge: (
    challengeId: string,
    isCorrect: boolean,
    points: number = 15,
    userId?: string,
    subject = 'General',
    topic = 'Practice',
  ) => {
    const signals = getStoredStudentSignals();
    const solvedSet = new Set(signals.solvedChallengeIds);
    solvedSet.add(challengeId);
    const metric = { ...(signals.cardMetrics[challengeId] || blankCardMetric()) };
    metric[isCorrect ? 'correctAnswers' : 'incorrectAnswers'] += 1;

    const updated = saveStudentSignals({
      solvedChallengeIds: Array.from(solvedSet),
      totalPoints: signals.totalPoints + (isCorrect ? points : 5),
      cardMetrics: { ...signals.cardMetrics, [challengeId]: metric },
      subjectAffinity: bumpAffinity(signals.subjectAffinity, subject, isCorrect ? 2 : 0.5),
      topicAffinity: bumpAffinity(signals.topicAffinity, `${subject}:${topic}`, isCorrect ? 3 : 1),
    });
    persistPersonalization(userId, updated, {
      type: 'answer', cardId: challengeId, subject, topic, correct: isCorrect, points: isCorrect ? points : 5,
    });
    return updated;
  },

  skipCard: (cardId: string, userId?: string, subject = 'General', topic = 'General') => {
    const signals = getStoredStudentSignals();
    const skippedSet = new Set(signals.skippedCardIds);
    skippedSet.add(cardId);
    const metric = { ...(signals.cardMetrics[cardId] || blankCardMetric()), skips: (signals.cardMetrics[cardId]?.skips || 0) + 1 };
    const updated = saveStudentSignals({
      skippedCardIds: Array.from(skippedSet),
      cardMetrics: { ...signals.cardMetrics, [cardId]: metric },
      subjectAffinity: bumpAffinity(signals.subjectAffinity, subject, -3),
      topicAffinity: bumpAffinity(signals.topicAffinity, `${subject}:${topic}`, -4),
    });
    persistPersonalization(userId, updated, { type: 'skip', cardId, subject, topic });
    return updated;
  },

  saveCard: (cardId: string, userId?: string, subject = 'General', topic = 'General') => {
    const signals = getStoredStudentSignals();
    const savedSet = new Set(signals.savedCardIds);
    const saved = !savedSet.has(cardId);
    if (savedSet.has(cardId)) {
      savedSet.delete(cardId);
    } else {
      savedSet.add(cardId);
    }
    const previous = signals.cardMetrics[cardId] || blankCardMetric();
    const metric = { ...previous, saves: Math.max(0, previous.saves + (saved ? 1 : -1)) };
    const updated = saveStudentSignals({
      savedCardIds: Array.from(savedSet),
      cardMetrics: { ...signals.cardMetrics, [cardId]: metric },
      subjectAffinity: bumpAffinity(signals.subjectAffinity, subject, saved ? 3 : -1),
      topicAffinity: bumpAffinity(signals.topicAffinity, `${subject}:${topic}`, saved ? 4 : -1),
    });
    persistPersonalization(userId, updated, { type: 'save', cardId, subject, topic, saved });
    return updated;
  },

  logSubjectActivity: (subject: string, userId?: string) => {
    const signals = getStoredStudentSignals();
    const subjectLastActivity = {
      ...signals.subjectLastActivity,
      [subject]: new Date().toISOString(),
    };
    const updated = saveStudentSignals({
      subjectLastActivity,
      subjectAffinity: bumpAffinity(signals.subjectAffinity, subject, 1),
    });
    persistPersonalization(userId, updated, { type: 'subject_activity', subject });
    return updated;
  },

  logCareerInterest: (careerOrField: string, userId?: string) => {
    const signals = getStoredStudentSignals();
    const set = new Set(signals.careerInterests);
    set.add(careerOrField);
    const updated = saveStudentSignals({ careerInterests: Array.from(set) });
    persistPersonalization(userId, updated, { type: 'career_interest', value: careerOrField });
    return updated;
  },

  setTargetExamDate: (dateStr: string, userId?: string) => {
    const updated = saveStudentSignals({ targetExamDate: dateStr });
    persistPersonalization(userId, updated, { type: 'exam_date', value: dateStr });
    return updated;
  },

  markTopicMastered: (topic: string, subject: string, userId?: string) => {
    const signals = getStoredStudentSignals();
    const mastered = new Set(signals.masteredTopicIds);
    mastered.add(`${subject}:${topic}`);
    // Remove from weak topics
    const weakTopics = signals.weakTopics.filter((w) => !(w.topic === topic && w.subject === subject));
    const updated = saveStudentSignals({
      masteredTopicIds: Array.from(mastered),
      weakTopics,
      totalPoints: signals.totalPoints + 25,
      subjectAffinity: bumpAffinity(signals.subjectAffinity, subject, 3),
      topicAffinity: bumpAffinity(signals.topicAffinity, `${subject}:${topic}`, 6),
    });
    persistPersonalization(userId, updated, { type: 'mastered', subject, topic, points: 25 });
    return updated;
  },

  viewCard: (card: FeedCardItem, dwellMs: number, completed: boolean, userId?: string) => {
    const signals = getStoredStudentSignals();
    const previous = signals.cardMetrics[card.id] || blankCardMetric();
    const metric: PersonalizationCardMetric = {
      ...previous,
      impressions: previous.impressions + 1,
      totalViewMs: previous.totalViewMs + Math.max(0, Math.min(dwellMs, 300000)),
      completions: previous.completions + (completed ? 1 : 0),
      lastViewedAt: new Date().toISOString(),
    };
    const engagement = completed ? 2 : dwellMs >= 5000 ? 1 : dwellMs < 1500 ? -1 : 0;
    const updated = saveStudentSignals({
      cardMetrics: { ...signals.cardMetrics, [card.id]: metric },
      subjectAffinity: bumpAffinity(signals.subjectAffinity, card.subject, engagement),
      topicAffinity: bumpAffinity(signals.topicAffinity, `${card.subject}:${card.topic}`, engagement),
      feedSessionCount: signals.feedSessionCount + 1,
      recentCardIds: [...signals.recentCardIds.filter((id) => id !== card.id), card.id].slice(-300),
    });
    persistPersonalization(userId, updated, {
      type: 'view', cardId: card.id, subject: card.subject, topic: card.topic,
      dwellMs: Math.round(dwellMs), completed,
    });
    return updated;
  },
};
