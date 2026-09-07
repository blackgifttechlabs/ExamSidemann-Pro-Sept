import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { experimentForPath } from '../data/experimentRegistry';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'grand_ruby' | 'grand_diamond';

export type AchievementDef = {
  id: string;
  title: string;
  category: 'reading' | 'exploration' | 'experiment';
  description: string;
  target: number;
  unit: string;
  points: number;
  tier: AchievementTier;
  iconName: string;
  gradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  isGrand?: boolean;
};

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  {
    id: 'reading_10m',
    title: 'Dedicated Reader',
    category: 'reading',
    description: 'Read lessons and educational materials for more than 10 minutes',
    target: 10,
    unit: 'mins',
    points: 50,
    tier: 'bronze',
    iconName: 'BookOpen',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'pages_20',
    title: 'Platform Explorer',
    category: 'exploration',
    description: 'Explore and visit 20 or more learning pages across Exam Sidemann',
    target: 20,
    unit: 'pages',
    points: 50,
    tier: 'silver',
    iconName: 'Compass',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    badgeBg: 'bg-blue-500/15 dark:bg-blue-500/20',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: 'exp_3',
    title: 'Junior Scientist',
    category: 'experiment',
    description: 'Launch and explore 3 interactive science practicals & experiments',
    target: 3,
    unit: 'experiments',
    points: 30,
    tier: 'bronze',
    iconName: 'FlaskConical',
    gradient: 'from-amber-500/20 to-orange-500/10',
    badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  {
    id: 'exp_5',
    title: 'Experiment Enthusiast',
    category: 'experiment',
    description: 'Conduct and observe 5 interactive science experiments',
    target: 5,
    unit: 'experiments',
    points: 50,
    tier: 'silver',
    iconName: 'Atom',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    badgeBg: 'bg-teal-500/15 dark:bg-teal-500/20',
    badgeBorder: 'border-teal-500/30',
    badgeText: 'text-teal-700 dark:text-teal-300',
  },
  {
    id: 'exp_10',
    title: 'Lab Specialist',
    category: 'experiment',
    description: 'Demonstrate scientific mastery by completing 10 experiments',
    target: 10,
    unit: 'experiments',
    points: 100,
    tier: 'gold',
    iconName: 'Sparkles',
    gradient: 'from-yellow-500/20 to-amber-500/15',
    badgeBg: 'bg-yellow-500/20 dark:bg-yellow-500/25',
    badgeBorder: 'border-yellow-500/40',
    badgeText: 'text-yellow-800 dark:text-yellow-300',
  },
  {
    id: 'exp_20',
    title: 'Senior Researcher',
    category: 'experiment',
    description: 'Explore and conduct 20 practical laboratory experiments',
    target: 20,
    unit: 'experiments',
    points: 150,
    tier: 'platinum',
    iconName: 'Zap',
    gradient: 'from-indigo-500/20 to-purple-500/15',
    badgeBg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
    badgeBorder: 'border-indigo-500/35',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'exp_30',
    title: 'Grand Experimenter',
    category: 'experiment',
    description: 'Achieve scientific excellence across 30 distinct practical experiments',
    target: 30,
    unit: 'experiments',
    points: 250,
    tier: 'grand_ruby',
    iconName: 'Flame',
    gradient: 'from-rose-500/25 via-red-500/15 to-orange-500/20',
    badgeBg: 'bg-gradient-to-r from-rose-500/25 to-red-600/25',
    badgeBorder: 'border-rose-500/50 shadow-sm shadow-rose-500/20',
    badgeText: 'text-rose-700 dark:text-rose-200 font-black tracking-wide',
    isGrand: true,
  },
  {
    id: 'exp_50',
    title: 'Grand Visionary',
    category: 'experiment',
    description: 'Pinnacle of scientific achievement: complete 50 full interactive practicals',
    target: 50,
    unit: 'experiments',
    points: 500,
    tier: 'grand_diamond',
    iconName: 'Crown',
    gradient: 'from-purple-500/30 via-pink-500/20 to-amber-500/25',
    badgeBg: 'bg-gradient-to-r from-amber-400/30 via-purple-500/30 to-pink-500/30',
    badgeBorder: 'border-amber-400/60 shadow-md shadow-purple-500/30 ring-1 ring-amber-400/30',
    badgeText: 'text-amber-900 dark:text-amber-200 font-black tracking-wider',
    isGrand: true,
  },
];

export type UserMetrics = {
  readingMinutes: number;
  visitedPages: string[];
  viewedExperiments: string[];
  unlockedAchievementIds: string[];
  lastUpdated: number;
};

const STORAGE_KEY = 'exam-sidemann:user-achievements:v1';
const LISTENERS = new Set<(metrics: UserMetrics) => void>();

const isExperiment = (path: string): boolean => {
  const norm = path === '/' ? '/' : `/${path.split('/').filter(Boolean).join('/')}`;
  if (experimentForPath(norm)) return true;
  return (
    norm.startsWith('/practicals/') &&
    norm.split('/').filter(Boolean).length >= 3
  );
};

export const getStoredMetrics = (): UserMetrics => {
  if (typeof window === 'undefined') {
    return {
      readingMinutes: 0,
      visitedPages: [],
      viewedExperiments: [],
      unlockedAchievementIds: [],
      lastUpdated: Date.now(),
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        readingMinutes: Number(parsed.readingMinutes) || 0,
        visitedPages: Array.isArray(parsed.visitedPages) ? parsed.visitedPages : [],
        viewedExperiments: Array.isArray(parsed.viewedExperiments) ? parsed.viewedExperiments : [],
        unlockedAchievementIds: Array.isArray(parsed.unlockedAchievementIds) ? parsed.unlockedAchievementIds : [],
        lastUpdated: Number(parsed.lastUpdated) || Date.now(),
      };
    }
  } catch (e) {
    console.debug('Error parsing achievement metrics', e);
  }

  return {
    readingMinutes: 0,
    visitedPages: [],
    viewedExperiments: [],
    unlockedAchievementIds: [],
    lastUpdated: Date.now(),
  };
};

const saveMetrics = (metrics: UserMetrics, uid?: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch (e) {
    console.debug('Error saving achievement metrics', e);
  }

  LISTENERS.forEach((listener) => {
    try {
      listener(metrics);
    } catch (e) {
      console.debug('Listener error', e);
    }
  });

  if (uid && typeof window !== 'undefined') {
    void syncMetricsToFirestore(uid, metrics);
  }
};

const syncMetricsToFirestore = async (uid: string, metrics: UserMetrics) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        achievementMetrics: {
          readingMinutes: metrics.readingMinutes,
          visitedPagesCount: metrics.visitedPages.length,
          viewedExperimentsCount: metrics.viewedExperiments.length,
          unlockedAchievementIds: metrics.unlockedAchievementIds,
          lastUpdated: Date.now(),
        },
      },
      { merge: true },
    );
  } catch (e) {
    console.debug('Could not sync achievements to firestore', e);
  }
};

const evaluateUnlockedAchievements = (
  readingMinutes: number,
  visitedPages: string[],
  viewedExperiments: string[],
): string[] => {
  const pagesCount = visitedPages.length;
  const expCount = viewedExperiments.length;
  const unlocked: string[] = [];

  for (const ach of ACHIEVEMENTS) {
    let current = 0;
    if (ach.category === 'reading') current = readingMinutes;
    else if (ach.category === 'exploration') current = pagesCount;
    else if (ach.category === 'experiment') current = expCount;

    if (current >= ach.target) {
      unlocked.push(ach.id);
    }
  }

  return unlocked;
};

export const recordPageViewForAchievements = (path: string, uid?: string) => {
  if (!path || path === '/') return;
  const metrics = getStoredMetrics();
  let changed = false;

  if (!metrics.visitedPages.includes(path)) {
    metrics.visitedPages.push(path);
    changed = true;
  }

  if (isExperiment(path) && !metrics.viewedExperiments.includes(path)) {
    metrics.viewedExperiments.push(path);
    changed = true;
  }

  if (changed) {
    metrics.unlockedAchievementIds = evaluateUnlockedAchievements(
      metrics.readingMinutes,
      metrics.visitedPages,
      metrics.viewedExperiments,
    );
    metrics.lastUpdated = Date.now();
    saveMetrics(metrics, uid);
  }
};

export const recordReadingMinutesForAchievements = (minutes: number, uid?: string) => {
  if (minutes <= 0) return;
  const metrics = getStoredMetrics();
  metrics.readingMinutes += minutes;
  metrics.unlockedAchievementIds = evaluateUnlockedAchievements(
    metrics.readingMinutes,
    metrics.visitedPages,
    metrics.viewedExperiments,
  );
  metrics.lastUpdated = Date.now();
  saveMetrics(metrics, uid);
};

export const calculateAchievementPoints = (unlockedIds: string[]): number => {
  return ACHIEVEMENTS.reduce((sum, ach) => {
    if (unlockedIds.includes(ach.id)) {
      return sum + ach.points;
    }
    return sum;
  }, 0);
};

export const subscribeToAchievements = (callback: (metrics: UserMetrics) => void) => {
  LISTENERS.add(callback);
  return () => {
    LISTENERS.delete(callback);
  };
};

export const getAchievementProgress = (ach: AchievementDef, metrics: UserMetrics) => {
  let current = 0;
  if (ach.category === 'reading') current = metrics.readingMinutes;
  else if (ach.category === 'exploration') current = metrics.visitedPages.length;
  else if (ach.category === 'experiment') current = metrics.viewedExperiments.length;

  const unlocked = current >= ach.target;
  const percent = Math.min(100, Math.round((current / ach.target) * 100));

  return {
    current,
    target: ach.target,
    unlocked,
    percent,
  };
};
