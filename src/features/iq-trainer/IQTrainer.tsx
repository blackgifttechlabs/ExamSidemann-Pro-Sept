import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Flame,
  Heart,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Settings,
  Share2,
  SkipForward,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import {
  IQ_DIFFICULTY_POINTS,
  IQ_DIFFICULTY_XP,
  IQ_PUZZLES,
  type IQDifficulty,
  type IQPuzzle,
} from './puzzles';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';

type DifficultyPreference = 'adaptive' | IQDifficulty;
type GameScreen = 'splash' | 'game' | 'summary';
type SessionMode = 'standard' | 'daily';

type TrainerStats = {
  totalXp: number;
  dailyStreak: number;
  bestSessionStreak: number;
  lastPlayedDate: string;
  completedPuzzleIds: number[];
  hearts: number;
  heartUpdatedAt: number;
  soundEnabled: boolean;
  heartsEnabled: boolean;
  difficultyPreference: DifficultyPreference;
  dailyChallengeDate: string;
};

type TrainerSession = {
  mode: SessionMode;
  puzzleIds: number[];
  index: number;
  currentAnswered: boolean;
  sessionXp: number;
  correct: number;
  guesses: number;
  sessionStreak: number;
  bestStreak: number;
};

type AnswerFeedback =
  | {
      type: 'correct' | 'revealed' | 'skipped' | 'explained';
      message: string;
      xp: number;
    }
  | null;

type SessionSummary = {
  xp: number;
  accuracy: number;
  bestStreak: number;
  iqScore: number;
  dailyStreak: number;
  completed: number;
};

const feedbackStyles: Record<
  NonNullable<AnswerFeedback>['type'],
  { panel: string; icon: string; button: string }
> = {
  correct: {
    panel:
      'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
    icon: 'bg-emerald-500',
    button: 'bg-emerald-500',
  },
  revealed: {
    panel:
      'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100',
    icon: 'bg-amber-500',
    button: 'bg-amber-500',
  },
  explained: {
    panel:
      'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-100',
    icon: 'bg-sky-500',
    button: 'bg-sky-500',
  },
  skipped: {
    panel:
      'border-slate-300 bg-slate-50 text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white',
    icon: 'bg-slate-500',
    button: 'bg-slate-600',
  },
};

const STATS_KEY = 'exam-sidemann-iq-trainer-stats-v1';
const SESSION_KEY = 'exam-sidemann-iq-trainer-session-v1';
const MAX_HEARTS = 5;
const HEART_REGEN_MS = 30 * 60 * 1000;

const DEFAULT_STATS: TrainerStats = {
  totalXp: 0,
  dailyStreak: 0,
  bestSessionStreak: 0,
  lastPlayedDate: '',
  completedPuzzleIds: [],
  hearts: MAX_HEARTS,
  heartUpdatedAt: Date.now(),
  soundEnabled: true,
  heartsEnabled: true,
  difficultyPreference: 'adaptive',
  dailyChallengeDate: '',
};

const difficultyMeta: Record<
  IQDifficulty,
  { label: string; color: string; badge: string }
> = {
  easy: {
    label: 'Easy',
    color: 'from-emerald-400 to-green-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  medium: {
    label: 'Medium',
    color: 'from-sky-400 to-blue-500',
    badge: 'bg-sky-100 text-sky-700',
  },
  hard: {
    label: 'Hard',
    color: 'from-orange-400 to-rose-500',
    badge: 'bg-orange-100 text-orange-700',
  },
  genius: {
    label: 'Genius',
    color: 'from-violet-500 to-fuchsia-500',
    badge: 'bg-violet-100 text-violet-700',
  },
};

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const restoreHearts = (stats: TrainerStats): TrainerStats => {
  if (stats.hearts >= MAX_HEARTS) {
    return { ...stats, hearts: MAX_HEARTS, heartUpdatedAt: Date.now() };
  }
  const elapsed = Date.now() - stats.heartUpdatedAt;
  const regenerated = Math.floor(elapsed / HEART_REGEN_MS);
  if (regenerated <= 0) return stats;
  const hearts = Math.min(MAX_HEARTS, stats.hearts + regenerated);
  return {
    ...stats,
    hearts,
    heartUpdatedAt:
      hearts === MAX_HEARTS
        ? Date.now()
        : stats.heartUpdatedAt + regenerated * HEART_REGEN_MS,
  };
};

const loadStats = (): TrainerStats => {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return restoreHearts({ ...DEFAULT_STATS, ...JSON.parse(raw) });
  } catch {
    return DEFAULT_STATS;
  }
};

const loadSession = (): TrainerSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as TrainerSession;
    const validIds = session.puzzleIds.filter(id =>
      IQ_PUZZLES.some(puzzle => puzzle.id === id),
    );
    if (!validIds.length || session.index >= validIds.length) return null;
    const shouldAdvance =
      Boolean(session.currentAnswered) && session.index < validIds.length - 1;
    if (session.currentAnswered && !shouldAdvance) return null;
    return {
      ...session,
      puzzleIds: validIds,
      index: shouldAdvance ? session.index + 1 : session.index,
      currentAnswered: false,
    };
  } catch {
    return null;
  }
};

const normalizeAnswer = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b2\b/g, 'two')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/^(a|an)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();

const levenshteinDistance = (first: string, second: string) => {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const matrix = Array.from({ length: rows }, () =>
    Array<number>(columns).fill(0),
  );

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let column = 0; column < columns; column += 1) matrix[0][column] = column;

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[first.length][second.length];
};

const isAnswerAccepted = (guess: string, puzzle: IQPuzzle) => {
  const normalizedGuess = normalizeAnswer(guess);
  if (!normalizedGuess) return false;

  return [puzzle.answer, ...puzzle.acceptableAnswers].some(candidate => {
    const normalizedCandidate = normalizeAnswer(candidate);
    if (normalizedGuess === normalizedCandidate) return true;
    const longest = Math.max(normalizedGuess.length, normalizedCandidate.length);
    const allowedDistance = longest <= 6 ? 1 : Math.max(1, Math.floor(longest * 0.14));
    return levenshteinDistance(normalizedGuess, normalizedCandidate) <= allowedDistance;
  });
};

const shuffled = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const unlockedDifficulties = (xp: number) =>
  (Object.keys(IQ_DIFFICULTY_XP) as IQDifficulty[]).filter(
    difficulty => xp >= IQ_DIFFICULTY_XP[difficulty],
  );

const leagueForXp = (xp: number) => {
  if (xp >= 600) return { name: 'Genius League', icon: '👑', next: null };
  if (xp >= 300) return { name: 'Mastermind League', icon: '🧠', next: 600 };
  if (xp >= 140) return { name: 'Logic Lion League', icon: '🦁', next: 300 };
  if (xp >= 50) return { name: 'Pattern Scout League', icon: '🧩', next: 140 };
  return { name: 'Bright Starter League', icon: '🌱', next: 50 };
};

const playFeedbackTone = (success: boolean, enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(success ? 520 : 190, context.currentTime);
    if (success) {
      oscillator.frequency.exponentialRampToValueAtTime(
        820,
        context.currentTime + 0.16,
      );
    }
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
    oscillator.addEventListener('ended', () => context.close());
  } catch {
    // Sound is a progressive enhancement; gameplay should never depend on it.
  }
};

const RebusFallback: React.FC<{ puzzle: IQPuzzle }> = ({ puzzle }) => {
  const { lines, layout, accent = '#6c4cff' } = puzzle.fallback;
  const common =
    'font-black tracking-[0.12em] text-[clamp(1.4rem,6vw,3.5rem)] leading-none';

  if (layout === 'over' || layout === 'under') {
    const ordered = layout === 'under' ? lines : lines;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-9">
        {ordered.map((line, index) => (
          <React.Fragment key={`${line}-${index}`}>
            {index === 1 && (
              <span className="h-1 w-44 rounded-full bg-slate-300 dark:bg-white/20" />
            )}
            <span className={common} style={{ color: index === 0 ? accent : undefined }}>
              {line}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (layout === 'split') {
    return (
      <div className="flex h-full w-full items-center justify-center gap-12 sm:gap-20">
        {lines.map((line, index) => (
          <span
            key={`${line}-${index}`}
            className={`${common} ${index ? 'translate-y-4' : '-translate-y-4'}`}
            style={{ color: accent }}
          >
            {line}
          </span>
        ))}
      </div>
    );
  }

  if (layout === 'scattered') {
    return (
      <div className="relative h-full w-full">
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${common}`}
          style={{ color: accent }}
        >
          {lines[0]}
        </span>
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 ${common}`}
          style={{ color: accent }}
        >
          {lines[1]}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center gap-5 ${
        layout === 'stack' ? 'flex-col' : 'flex-row flex-wrap'
      }`}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={common}
          style={{ color: index % 2 === 0 ? accent : undefined }}
        >
          {line}
        </span>
      ))}
    </div>
  );
};

const PuzzleVisual: React.FC<{ puzzle: IQPuzzle }> = ({ puzzle }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [puzzle.id]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-white via-slate-50 to-violet-50 shadow-[0_22px_60px_rgba(79,70,229,0.18)] dark:border-white/10 dark:from-[#20202a] dark:via-[#17171f] dark:to-[#241a35]">
      <div className="absolute left-5 top-5 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur dark:bg-black/40 dark:text-white/60">
        {puzzle.category}
      </div>
      {!imageFailed ? (
        <img
          key={puzzle.image}
          src={puzzle.image}
          alt="Visual rebus puzzle"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-contain p-8 sm:p-12"
        />
      ) : (
        <RebusFallback puzzle={puzzle} />
      )}
    </div>
  );
};

const ConfettiBurst: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" aria-hidden="true">
    {Array.from({ length: 34 }, (_, index) => (
      <span
        key={index}
        className="absolute top-[35%] h-3 w-2 rounded-sm"
        style={{
          left: `${15 + ((index * 23) % 70)}%`,
          backgroundColor: ['#6c4cff', '#22c55e', '#facc15', '#f43f5e', '#06b6d4'][
            index % 5
          ],
          animation: `iq-confetti ${0.8 + (index % 6) * 0.08}s ease-out ${
            (index % 5) * 0.03
          }s forwards`,
        }}
      />
    ))}
  </div>
);

export const IQTrainer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<TrainerStats>(loadStats);
  const [savedSession, setSavedSession] = useState<TrainerSession | null>(loadSession);
  const [session, setSession] = useState<TrainerSession | null>(null);
  const [screen, setScreen] = useState<GameScreen>('splash');
  const [answer, setAnswer] = useState('');
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const [wrongMessage, setWrongMessage] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [shared, setShared] = useState(false);

  const today = getTodayKey();
  const league = leagueForXp(stats.totalXp);
  const unlocked = unlockedDifficulties(stats.totalXp);
  const puzzleMap = useMemo(
    () => new Map(IQ_PUZZLES.map(puzzle => [puzzle.id, puzzle])),
    [],
  );
  const currentPuzzle = session
    ? puzzleMap.get(session.puzzleIds[session.index])
    : undefined;

  useEffect(() => {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setSavedSession(session);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
      setSavedSession(null);
    }
  }, [session]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStats(previous => restoreHearts(previous));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen === 'game' && !feedback) {
      window.setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [screen, currentPuzzle?.id, feedback]);

  const resetPuzzleState = () => {
    setAnswer('');
    setWrongGuesses(0);
    setHintsUsed(0);
    setFeedback(null);
    setWrongMessage('');
    setShowConfetti(false);
    setShowExplanation(false);
  };

  const chooseStandardPuzzles = () => {
    const preferred = stats.difficultyPreference;
    const allowed =
      preferred === 'adaptive' || !unlocked.includes(preferred)
        ? unlocked
        : [preferred];
    const pool = IQ_PUZZLES.filter(puzzle => allowed.includes(puzzle.difficulty));
    const unseen = pool.filter(
      puzzle => !stats.completedPuzzleIds.includes(puzzle.id),
    );
    const ordered = [...shuffled(unseen), ...shuffled(pool.filter(puzzle => !unseen.includes(puzzle)))];
    return ordered.slice(0, Math.min(8, ordered.length)).map(puzzle => puzzle.id);
  };

  const dailyPuzzleId = useMemo(() => {
    const dayNumber = Math.floor(
      new Date(`${today}T12:00:00`).getTime() / (24 * 60 * 60 * 1000),
    );
    return IQ_PUZZLES[dayNumber % IQ_PUZZLES.length].id;
  }, [today]);

  const beginSession = (mode: SessionMode) => {
    if (stats.heartsEnabled && stats.hearts <= 0) {
      setShowSettings(true);
      return;
    }
    const puzzleIds = mode === 'daily' ? [dailyPuzzleId] : chooseStandardPuzzles();
    const nextSession: TrainerSession = {
      mode,
      puzzleIds,
      index: 0,
      currentAnswered: false,
      sessionXp: 0,
      correct: 0,
      guesses: 0,
      sessionStreak: 0,
      bestStreak: 0,
    };
    setSession(nextSession);
    resetPuzzleState();
    setSummary(null);
    setScreen('game');
  };

  const resumeSession = () => {
    if (!savedSession) return;
    setSession(savedSession);
    resetPuzzleState();
    setSummary(null);
    setScreen('game');
  };

  const awardXp = (xp: number, puzzle: IQPuzzle, correct: boolean) => {
    setStats(previous => ({
      ...previous,
      totalXp: previous.totalXp + xp,
      completedPuzzleIds:
        correct && !previous.completedPuzzleIds.includes(puzzle.id)
          ? [...previous.completedPuzzleIds, puzzle.id]
          : previous.completedPuzzleIds,
    }));
  };

  const revealAnswer = (fromHint: boolean) => {
    if (!currentPuzzle || !session || feedback) return;
    const consolationXp = session.mode === 'daily' ? 5 : 2;
    const nextGuesses = session.guesses + 1;
    setHintsUsed(3);
    setSession(previous =>
      previous
        ? {
            ...previous,
            sessionXp: previous.sessionXp + consolationXp,
            guesses: nextGuesses,
            sessionStreak: 0,
            currentAnswered: true,
          }
        : previous,
    );
    if (stats.heartsEnabled) {
      setStats(previous => ({
        ...previous,
        hearts: Math.max(0, previous.hearts - 1),
        heartUpdatedAt:
          previous.hearts === MAX_HEARTS ? Date.now() : previous.heartUpdatedAt,
        totalXp: previous.totalXp + consolationXp,
      }));
    } else {
      awardXp(consolationXp, currentPuzzle, false);
    }
    setFeedback({
      type: 'revealed',
      message: fromHint ? 'Answer revealed — streak paused' : 'Good try — lock it in for next time',
      xp: consolationXp,
    });
    playFeedbackTone(false, stats.soundEnabled);
  };

  const submitAnswer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPuzzle || !session || !answer.trim() || feedback) return;

    if (isAnswerAccepted(answer, currentPuzzle)) {
      const basePoints = IQ_DIFFICULTY_POINTS[currentPuzzle.difficulty];
      const dailyBonus = session.mode === 'daily' ? 30 : 0;
      const earnedXp = Math.max(
        3,
        basePoints - hintsUsed * 3 - wrongGuesses * 2 + dailyBonus,
      );
      const nextStreak = session.sessionStreak + 1;
      setSession(previous =>
        previous
          ? {
              ...previous,
              sessionXp: previous.sessionXp + earnedXp,
              correct: previous.correct + 1,
              guesses: previous.guesses + 1,
              sessionStreak: nextStreak,
              bestStreak: Math.max(previous.bestStreak, nextStreak),
              currentAnswered: true,
            }
          : previous,
      );
      awardXp(earnedXp, currentPuzzle, true);
      setFeedback({
        type: 'correct',
        message:
          wrongGuesses === 0 && hintsUsed === 0
            ? 'Brilliant first try! 🔥'
            : 'Nice one! You cracked it.',
        xp: earnedXp,
      });
      setShowConfetti(true);
      playFeedbackTone(true, stats.soundEnabled);
      return;
    }

    const nextWrongGuesses = wrongGuesses + 1;
    setWrongGuesses(nextWrongGuesses);
    setSession(previous =>
      previous
        ? {
            ...previous,
            guesses: previous.guesses + 1,
            sessionStreak: 0,
          }
        : previous,
    );
    setAnswer('');
    setShakeKey(previous => previous + 1);
    playFeedbackTone(false, stats.soundEnabled);

    if (nextWrongGuesses >= 3) {
      revealAnswer(false);
      return;
    }

    const remaining = 3 - nextWrongGuesses;
    setWrongMessage(
      remaining === 1
        ? 'Almost! One try left — a hint could help.'
        : `Not quite yet. You have ${remaining} tries left.`,
    );
    window.setTimeout(() => setWrongMessage(''), 2400);
  };

  const useHint = () => {
    if (!currentPuzzle || feedback) return;
    const nextHint = Math.min(3, hintsUsed + 1);
    setHintsUsed(nextHint);
    if (nextHint === 3) revealAnswer(true);
  };

  const completeWithoutAnswer = (type: 'skipped' | 'explained') => {
    if (!currentPuzzle || !session || feedback) return;
    setSession(previous =>
      previous
        ? {
            ...previous,
            guesses: previous.guesses + 1,
            sessionStreak: 0,
            currentAnswered: true,
          }
        : previous,
    );
    setAnswer('');
    setWrongMessage('');
    setShowExplanation(type === 'explained');
    setFeedback({
      type,
      message:
        type === 'explained'
          ? 'Here’s the idea behind this puzzle'
          : 'Puzzle skipped — your hearts are safe',
      xp: 0,
    });
  };

  const finishSession = (completedSession: TrainerSession) => {
    const accuracy =
      completedSession.guesses > 0
        ? Math.round((completedSession.correct / completedSession.guesses) * 100)
        : 0;
    const nextDailyStreak =
      stats.lastPlayedDate === today
        ? stats.dailyStreak
        : stats.lastPlayedDate === getYesterdayKey()
          ? stats.dailyStreak + 1
          : 1;
    const iqScore = Math.min(
      160,
      Math.max(
        70,
        Math.round(
          75 +
            accuracy * 0.45 +
            completedSession.sessionXp * 0.45 +
            completedSession.bestStreak * 2,
        ),
      ),
    );

    setStats(previous => ({
      ...previous,
      dailyStreak: nextDailyStreak,
      lastPlayedDate: today,
      bestSessionStreak: Math.max(
        previous.bestSessionStreak,
        completedSession.bestStreak,
      ),
      dailyChallengeDate:
        completedSession.mode === 'daily' ? today : previous.dailyChallengeDate,
    }));
    const nextSummary = {
      xp: completedSession.sessionXp,
      accuracy,
      bestStreak: completedSession.bestStreak,
      iqScore,
      dailyStreak: nextDailyStreak,
      completed: completedSession.index + 1,
    };
    setSummary(nextSummary);
    if (user) {
      void addDoc(collection(db, 'users', user.uid, 'iqTrainerSessions'), {
        ...nextSummary,
        mode: completedSession.mode,
        totalPuzzles: completedSession.puzzleIds.length,
        guesses: completedSession.guesses,
        correct: completedSession.correct,
        completedAt: serverTimestamp(),
      }).catch((error) => {
        console.error('Could not save IQ Trainer result', error);
      });
    }
    setSession(null);
    setScreen('summary');
    setShowConfetti(true);
    playFeedbackTone(true, stats.soundEnabled);
  };

  const goToNextPuzzle = () => {
    if (!session) return;
    const isLast = session.index >= session.puzzleIds.length - 1;
    const outOfHearts = stats.heartsEnabled && stats.hearts <= 0;
    if (isLast || outOfHearts) {
      finishSession(session);
      return;
    }
    setSession(previous =>
      previous
        ? { ...previous, index: previous.index + 1, currentAnswered: false }
        : previous,
    );
    resetPuzzleState();
  };

  const resetProgress = () => {
    if (!window.confirm('Reset all IQ Trainer XP, streaks, hearts and progress?')) {
      return;
    }
    const fresh = { ...DEFAULT_STATS, heartUpdatedAt: Date.now() };
    setStats(fresh);
    setSession(null);
    setSummary(null);
    setScreen('splash');
    setShowSettings(false);
    window.localStorage.removeItem(STATS_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  };

  const shareSummary = async () => {
    if (!summary) return;
    const text = `I scored ${summary.iqScore} IQ with ${summary.accuracy}% accuracy and earned ${summary.xp} XP on Exam Sidemann IQ Trainer! 🧠🔥`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My IQ Trainer score', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      // Closing the native share sheet is not an error the user needs to see.
    }
  };

  const heartRefillMinutes =
    stats.hearts >= MAX_HEARTS
      ? 0
      : Math.max(
          1,
          Math.ceil((HEART_REGEN_MS - (Date.now() - stats.heartUpdatedAt)) / 60_000),
        );
  const sessionProgress = session
    ? ((session.index + (feedback ? 1 : 0)) / session.puzzleIds.length) * 100
    : 0;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7f7ff] text-slate-900 dark:bg-[#101018] dark:text-white">
      <style>{`
        @keyframes iq-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes iq-pop {
          0% { transform: scale(.65); opacity: 0; }
          65% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes iq-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(9px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(4px); }
        }
        @keyframes iq-slide {
          from { transform: translateX(34px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes iq-confetti {
          0% { transform: translate3d(0, 0, 0) rotate(0); opacity: 1; }
          100% { transform: translate3d(calc((var(--dir, 1)) * 110px), 55vh, 0) rotate(720deg); opacity: 0; }
        }
        .iq-button {
          box-shadow: 0 6px 0 rgba(48, 36, 120, .2);
          transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
        }
        .iq-button:hover { filter: brightness(1.04); transform: translateY(-1px); }
        .iq-button:active { transform: translateY(4px); box-shadow: 0 2px 0 rgba(48, 36, 120, .2); }
      `}</style>

      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-700/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-700/15" />

      {showConfetti && <ConfettiBurst />}

      {screen === 'splash' && (
        <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-8">
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-x-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-11 items-center gap-2 rounded-2xl border border-orange-100 bg-white px-3 text-sm font-black text-orange-500 shadow-sm dark:border-orange-400/20 dark:bg-white/5">
                <Flame size={19} className="fill-orange-400" />
                {stats.dailyStreak}
              </span>
              <span className="flex h-11 items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 text-sm font-black text-violet-600 shadow-sm dark:border-violet-400/20 dark:bg-white/5 dark:text-violet-300">
                <Zap size={18} className="fill-violet-500" />
                {stats.totalXp} XP
              </span>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                aria-label="IQ Trainer settings"
              >
                <Settings size={19} />
              </button>
            </div>
          </header>

          <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                <Sparkles size={15} />
                Daily brain workout
              </div>
              <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                Welcome to
                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  IQ Trainer
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base font-semibold leading-relaxed text-slate-500 dark:text-slate-400 lg:mx-0 sm:text-lg">
                Spot hidden meanings, crack playful rebus puzzles and grow your
                logic streak one brilliant answer at a time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => beginSession('standard')}
                  className="iq-button flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-black text-white"
                >
                  <Play size={20} className="fill-white" />
                  Start training
                </button>
                {savedSession && (
                  <button
                    type="button"
                    onClick={resumeSession}
                    className="iq-button flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-white px-7 font-black text-violet-700 dark:border-violet-400/30 dark:bg-white/5 dark:text-violet-300"
                  >
                    Resume lesson
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>

              <button
                type="button"
                disabled={stats.dailyChallengeDate === today}
                onClick={() => beginSession('daily')}
                className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-left text-sm font-black text-amber-800 transition hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-55 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"
              >
                <Star size={21} className="fill-amber-400 text-amber-500" />
                <span>
                  {stats.dailyChallengeDate === today
                    ? 'Daily challenge completed'
                    : 'Play today’s challenge'}
                  <span className="ml-2 rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] uppercase">
                    +30 bonus XP
                  </span>
                </span>
              </button>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-violet-400/25 to-cyan-300/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-6 shadow-[0_30px_80px_rgba(70,50,150,0.18)] dark:border-white/10 dark:bg-[#1a1a24] sm:p-8">
                <div
                  className="mx-auto flex h-44 w-44 items-center justify-center rounded-[3rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 text-8xl shadow-xl"
                  style={{ animation: 'iq-float 3.2s ease-in-out infinite' }}
                  aria-hidden="true"
                >
                  🧠
                </div>
                <div className="mt-8 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Current league
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {league.icon} {league.name}
                  </h2>
                  {league.next ? (
                    <>
                      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                          style={{
                            width: `${Math.min(100, (stats.totalXp / league.next) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-400">
                        {league.next - stats.totalXp} XP to your next league
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm font-bold text-violet-500">
                      You reached the top league!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-4">
            {(Object.keys(difficultyMeta) as IQDifficulty[]).map(difficulty => {
              const unlockedTier = unlocked.includes(difficulty);
              return (
                <div
                  key={difficulty}
                  className={`rounded-2xl border p-4 ${
                    unlockedTier
                      ? 'border-white bg-white shadow-sm dark:border-white/10 dark:bg-white/5'
                      : 'border-slate-200 bg-slate-100/70 opacity-65 dark:border-white/5 dark:bg-white/[0.025]'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${difficultyMeta[difficulty].color} text-white shadow-sm`}
                  >
                    {unlockedTier ? <Check size={17} /> : <Lock size={15} />}
                  </div>
                  <p className="mt-3 text-sm font-black">
                    {difficultyMeta[difficulty].label}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {unlockedTier
                      ? 'Unlocked'
                      : `${IQ_DIFFICULTY_XP[difficulty]} XP`}
                  </p>
                </div>
              );
            })}
          </section>
        </main>
      )}

      {screen === 'game' && session && currentPuzzle && (
        <main className="relative z-10 flex min-h-dvh w-full flex-col px-4 py-4 sm:px-7 sm:py-6 lg:px-[60px]">
          <header className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                setScreen('splash');
                resetPuzzleState();
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
              aria-label="Exit lesson"
            >
              <X size={22} />
            </button>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 transition-all duration-500"
                style={{ width: `${sessionProgress}%` }}
              />
            </div>
            <span className="flex items-center gap-1.5 text-sm font-black text-orange-500">
              <Flame size={20} className="fill-orange-400" />
              <span
                key={session.sessionStreak}
                style={{ animation: 'iq-pop .35s ease-out' }}
              >
                {session.sessionStreak}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-black text-rose-500">
              <Heart size={20} className="fill-rose-500" />
              {stats.heartsEnabled ? stats.hearts : '∞'}
            </span>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white dark:hover:bg-white/5"
              aria-label="Settings"
            >
              <Settings size={19} />
            </button>
          </header>

          <div className="mt-3 flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            <span>
              Puzzle {session.index + 1} of {session.puzzleIds.length}
            </span>
            <span className={`rounded-full px-2.5 py-1 ${difficultyMeta[currentPuzzle.difficulty].badge}`}>
              {currentPuzzle.difficulty}
            </span>
          </div>

          <section
            key={currentPuzzle.id}
            className="flex w-full flex-1 flex-col justify-center py-5 sm:py-8 lg:grid lg:grid-cols-[minmax(520px,1.22fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-[60px]"
            style={{ animation: 'iq-slide .4s cubic-bezier(.2,.8,.2,1)' }}
          >
            <div
              key={shakeKey}
              className="w-full lg:order-1 lg:justify-self-start"
              style={wrongMessage ? { animation: 'iq-shake .4s ease' } : undefined}
            >
              <PuzzleVisual puzzle={currentPuzzle} />
            </div>

            <div className="mx-auto mt-5 w-full max-w-2xl sm:mt-7 lg:order-2 lg:mx-0 lg:mt-0 lg:max-w-none lg:justify-self-end">
              {hintsUsed > 0 && (
                <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-700 dark:bg-amber-300/20 dark:text-amber-200">
                    <Lightbulb size={17} className="fill-current" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60">
                      Hint {hintsUsed} of 3
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {currentPuzzle.hints[hintsUsed - 1]}
                    </p>
                  </div>
                </div>
              )}

              {!feedback ? (
                <form onSubmit={submitAnswer}>
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      ref={inputRef}
                      value={answer}
                      onChange={event => setAnswer(event.target.value)}
                      placeholder="Type your answer..."
                      autoComplete="off"
                      className="min-h-14 min-w-0 flex-1 rounded-2xl border-2 border-slate-200 bg-white px-5 text-base font-bold outline-none transition placeholder:text-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/20"
                    />
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="iq-button min-h-14 rounded-2xl bg-violet-600 px-5 font-black text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
                    >
                      Check
                    </button>
                  </div>
                  <div className="mt-3 flex min-h-10 items-center justify-between gap-3">
                    <p className="text-sm font-bold text-rose-500">{wrongMessage}</p>
                    <div className="ml-auto flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => completeWithoutAnswer('explained')}
                        className="flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-black text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-400/10"
                      >
                        <CircleHelp size={17} />
                        Explain
                      </button>
                      <button
                        type="button"
                        onClick={() => completeWithoutAnswer('skipped')}
                        className="flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-black text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                      >
                        <SkipForward size={17} />
                        Skip
                      </button>
                      <button
                        type="button"
                        onClick={useHint}
                        className="flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-black text-amber-600 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-400/10"
                      >
                        <Lightbulb size={17} />
                        {hintsUsed ? 'Next hint' : 'Hint'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div
                  className={`rounded-[1.75rem] border-2 p-5 shadow-lg sm:p-6 ${feedbackStyles[feedback.type].panel}`}
                  style={{ animation: 'iq-pop .42s ease-out' }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${feedbackStyles[feedback.type].icon}`}
                    >
                      {feedback.type === 'correct' ? (
                        <Check size={30} strokeWidth={3} />
                      ) : feedback.type === 'explained' ? (
                        <CircleHelp size={29} />
                      ) : feedback.type === 'skipped' ? (
                        <SkipForward size={29} />
                      ) : (
                        <Brain size={29} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black">{feedback.message}</p>
                      <p className="mt-1 text-sm font-semibold opacity-70">
                        Answer: <strong>{currentPuzzle.answer}</strong>
                      </p>
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-black shadow-sm dark:bg-black/20">
                      {feedback.xp ? `+${feedback.xp} XP` : 'No XP'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExplanation(previous => !previous)}
                    aria-expanded={showExplanation}
                    className="mt-5 flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-current/15 bg-white/60 px-4 text-left text-sm font-black transition hover:bg-white dark:bg-black/10 dark:hover:bg-black/20"
                  >
                    <span className="flex items-center gap-2">
                      <CircleHelp size={19} />
                      Explanation
                    </span>
                    <ChevronRight
                      size={18}
                      className={`transition-transform ${showExplanation ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {showExplanation && (
                    <div
                      className="mt-3 rounded-2xl bg-white/65 p-4 text-sm font-semibold leading-relaxed shadow-sm dark:bg-black/15"
                      style={{ animation: 'iq-pop .25s ease-out' }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-55">
                        What it means
                      </p>
                      <p className="mt-1.5">{currentPuzzle.explanation}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={goToNextPuzzle}
                    className={`iq-button mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-6 font-black text-white ${feedbackStyles[feedback.type].button}`}
                  >
                    {session.index >= session.puzzleIds.length - 1
                      ? 'See my results'
                      : 'Continue'}
                    <ChevronRight size={19} />
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {screen === 'summary' && summary && (
        <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
          <div
            className="w-full rounded-[2.5rem] border border-white bg-white p-6 shadow-[0_30px_90px_rgba(70,50,150,0.2)] dark:border-white/10 dark:bg-[#1a1a24] sm:p-10"
            style={{ animation: 'iq-pop .55s ease-out' }}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-white shadow-xl">
              <Trophy size={42} className="fill-white/25" />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-violet-500">
              Lesson complete
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Brain power boosted!
            </h1>

            <div className="mx-auto mt-7 max-w-sm rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 p-[3px] shadow-lg">
              <div className="rounded-[1.85rem] bg-white px-6 py-7 dark:bg-[#17171f]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Your IQ Score
                </p>
                <p className="mt-1 text-7xl font-black tracking-[-0.06em] text-violet-600 dark:text-violet-300">
                  {summary.iqScore}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  Exam Sidemann Brain Badge
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Zap, value: `+${summary.xp}`, label: 'XP earned', color: 'text-violet-500' },
                { icon: Trophy, value: `${summary.accuracy}%`, label: 'Accuracy', color: 'text-amber-500' },
                { icon: Flame, value: summary.bestStreak, label: 'Best streak', color: 'text-orange-500' },
                { icon: Check, value: summary.completed, label: 'Completed', color: 'text-emerald-500' },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
                >
                  <item.icon className={`mx-auto ${item.color}`} size={21} />
                  <p className="mt-2 text-xl font-black">{item.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-orange-500">
              <Flame size={21} className="fill-orange-400" />
              {summary.dailyStreak} day learning streak
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => beginSession('standard')}
                className="iq-button flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 font-black text-white"
              >
                <Play size={19} className="fill-white" />
                Train again
              </button>
              <button
                type="button"
                onClick={shareSummary}
                className="iq-button flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-white px-6 font-black text-violet-700 dark:border-violet-400/30 dark:bg-white/5 dark:text-violet-300"
              >
                {shared ? <Check size={19} /> : <Share2 size={19} />}
                {shared ? 'Score copied!' : 'Share my score'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowConfetti(false);
                setScreen('splash');
              }}
              className="mt-5 text-sm font-black text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              Back to IQ Trainer home
            </button>
          </div>
        </main>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            className="absolute inset-0"
            aria-label="Close settings"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="iq-settings-title"
            className="relative z-10 w-full max-w-lg rounded-t-[2rem] bg-white p-6 shadow-2xl dark:bg-[#1d1d27] sm:rounded-[2rem] sm:p-7"
            style={{ animation: 'iq-pop .3s ease-out' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-500">
                  Make it yours
                </p>
                <h2 id="iq-settings-title" className="mt-1 text-2xl font-black">
                  Trainer settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() =>
                  setStats(previous => ({
                    ...previous,
                    soundEnabled: !previous.soundEnabled,
                  }))
                }
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left dark:border-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  {stats.soundEnabled ? <Volume2 size={21} /> : <VolumeX size={21} />}
                </span>
                <span className="flex-1">
                  <span className="block font-black">Sound effects</span>
                  <span className="text-xs font-semibold text-slate-400">
                    Correct and incorrect answer tones
                  </span>
                </span>
                <span
                  className={`relative h-7 w-12 rounded-full transition ${
                    stats.soundEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-white/15'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      stats.soundEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setStats(previous => ({
                    ...previous,
                    heartsEnabled: !previous.heartsEnabled,
                  }))
                }
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left dark:border-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/15">
                  <Heart size={21} className="fill-current" />
                </span>
                <span className="flex-1">
                  <span className="block font-black">Hearts mode</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {stats.hearts < MAX_HEARTS && stats.heartsEnabled
                      ? `Next heart in about ${heartRefillMinutes} min`
                      : 'Lose a heart after an answer is revealed'}
                  </span>
                </span>
                <span
                  className={`relative h-7 w-12 rounded-full transition ${
                    stats.heartsEnabled ? 'bg-rose-500' : 'bg-slate-300 dark:bg-white/15'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      stats.heartsEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </span>
              </button>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                <label
                  htmlFor="iq-difficulty"
                  className="text-sm font-black"
                >
                  Difficulty preference
                </label>
                <p className="mt-0.5 text-xs font-semibold text-slate-400">
                  Adaptive mixes every level you have unlocked.
                </p>
                <select
                  id="iq-difficulty"
                  value={stats.difficultyPreference}
                  onChange={event =>
                    setStats(previous => ({
                      ...previous,
                      difficultyPreference: event.target
                        .value as DifficultyPreference,
                    }))
                  }
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black outline-none focus:border-violet-500 dark:border-white/10 dark:bg-white/5"
                >
                  <option value="adaptive">Adaptive mix</option>
                  {(Object.keys(difficultyMeta) as IQDifficulty[]).map(difficulty => (
                    <option
                      key={difficulty}
                      value={difficulty}
                      disabled={!unlocked.includes(difficulty)}
                    >
                      {difficultyMeta[difficulty].label}
                      {!unlocked.includes(difficulty)
                        ? ` — unlock at ${IQ_DIFFICULTY_XP[difficulty]} XP`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={resetProgress}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 font-black text-rose-600 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300"
            >
              <RotateCcw size={18} />
              Reset all progress
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
