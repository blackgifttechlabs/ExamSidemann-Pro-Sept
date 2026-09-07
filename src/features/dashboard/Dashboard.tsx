import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home, Grid, MessageSquare, Users, Settings,
  BookOpen, Sparkles, Trophy, ChevronRight, ChevronDown,
  Layers, Plus, Zap, LogOut, Search, Bell, MoreHorizontal,
  BrainCircuit, FileText, Flame, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Clock, History, Bookmark, Check, Loader2, X, Sun, Moon, User, Star, ArrowLeft,
  Pin, ArrowRight, Compass, FlaskConical, Atom, Crown, CheckCircle2, Award, Lock, Eye,
} from 'lucide-react';
import { subscribeToAiNotes, type AiSavedNote } from '../../services/aiChatHistory';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { QuizOverlay } from '../../components/ui/QuizOverlay';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { StudentProfileHub } from './StudentProfileHub';
import { DashboardSkeleton } from './DashboardSkeleton';
import { LogoutModal } from '../auth/LogoutModal';
import { logout } from '../../services/firebase';
import { schoolForName } from '../../data/schoolRegistry';
import { polytechnicLogoForName } from '../../data/polytechnicLogos';
import { fetchGlobalRanking, type PublicProfile } from '../../services/studentDirectory';
import { subscribeToPendingFriendRequests } from '../../services/notifications';
import { ThreeStarAiIcon } from '../../components/icons/ThreeStarAiIcon';
import { RankAchievementModal } from './RankAchievementModal';
import { GoogleProfileCompletion } from './GoogleProfileCompletion';
import { SubjectRemovalDialog } from './SubjectRemovalDialog';
import { ForYouFeed } from './ForYouFeed';
import { ExploreHub } from './ExploreHub';
import { DailyBiteTab } from './DailyBiteTab';
import {
  getStoredStudentSignals,
  getPersonalizedFeed,
  loadStudentSignals,
  resetStudentPersonalization,
  saveStudentSignals,
  recordStudentAction,
  type StudentLearningSignals,
  type FeedCardItem,
} from '../../services/personalizationEngine';
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getStoredMetrics,
  subscribeToAchievements,
  calculateAchievementPoints,
  type UserMetrics,
} from '../../services/achievements';

interface SavedResource {
  id: string;
  type: 'quiz' | 'exam' | 'summary';
  title: string;
  date: string;
  subject: string;
  content: string;
  score?: number;
}

interface ActivityDay {
  id: string;
  date: string;
  timeMs: number;
}

interface SubjectStudyDay {
  id: string;
  date: string;
  subject: string;
  timeMs: number;
}

interface SubjectStudyStat {
  subject: string;
  timeMs: number;
  daysRead: number;
  progress: number;
}

type ThemeMode = 'light' | 'dark';

const readThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
};

const applyThemeMode = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  window.localStorage.setItem('theme', theme);
};

const formatPlatformTime = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const getWeekStart = () => {
  const date = new Date();
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  date.setHours(0, 0, 0, 0);
  return date;
};

const dashboardDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Africa/Harare',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const toDayKey = (date: Date) => dashboardDayFormatter.format(date);

const buildWeeklyPlatformData = (activityDays: ActivityDay[] = []) => {
  const timeByDate = new Map(activityDays.map((day) => [day.date, day.timeMs]));
  const weekStart = getWeekStart();
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const timeMs = timeByDate.get(toDayKey(date)) || 0;
    return {
      name,
      timeMs,
      hours: Number((timeMs / 3_600_000).toFixed(2)),
      label: formatPlatformTime(timeMs),
    };
  });
};

const SchoolIdentityMark = ({ name, logo, className = '' }: { name: string; logo?: string | null; className?: string }) => {
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0)).join('').toUpperCase() || 'SC';
  return (
    <span className={clsx('flex shrink-0 items-center justify-center overflow-hidden bg-[#ef2b3f]/15 font-black text-[#ff6b7a] ring-1 ring-[#ef2b3f]/25', className)}>
      {logo && failedLogo !== logo ? <img src={logo} alt={`${name} logo`} className="h-full w-full object-contain" onError={() => setFailedLogo(logo)} /> : initials}
    </span>
  );
};

/* ---------------------------------------------------------------------- */
/*  Far-left icon rail                                                    */
/* ---------------------------------------------------------------------- */

const IconRail = ({ activeTab, setActiveTab, onNavigate, schoolMark, schoolName }: any) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const ITEMS = [
    { id: 'for-you', icon: Sparkles, label: 'For You Feed' },
    { id: 'explore', icon: Compass, label: 'Explore Hub' },
    { id: 'daily-bite', icon: Zap, label: 'Daily Bite' },
    { id: 'ranking', icon: Trophy, label: 'Dedicated Learners' },
    { id: 'chat', icon: MessageSquare, label: 'Chat AI' },
    { id: 'communities', icon: Users, label: 'Communities' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];
  const handleClick = (id: string) => {
    if (['chat', 'communities', 'settings'].includes(id)) { onNavigate(id); return; }
    setActiveTab(id);
  };
  return (
    <>
      <aside className="hidden lg:flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 dark:border-white/[0.06] dark:bg-[#0d0f13]">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="mb-5 flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef2b3f] dark:hover:bg-white/[0.06]"
        >
          {schoolMark}
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-gray-500">Dashboard</span>
            <span className="block truncate text-sm font-bold text-slate-800 dark:text-gray-100">{schoolName}</span>
          </span>
        </button>
        <nav aria-label="Dashboard navigation" className="flex flex-1 flex-col gap-1.5">
          {ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => handleClick(item.id)}
                className={clsx(
                  'flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef2b3f]',
                  isActive ? 'bg-[#ef2b3f] text-white shadow-[0_0_16px_rgba(239,43,63,0.35)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-white/[0.06] dark:hover:text-gray-200',
                )}
              >
                <item.icon size={19} strokeWidth={2} className="shrink-0" />
                <span className="truncate text-sm font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex h-11 w-full items-center gap-3 rounded-[9px] px-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef2b3f] dark:text-gray-500 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
        >
          <ArrowLeft size={19} strokeWidth={2} className="shrink-0" />
          <span className="text-sm font-bold">Back to Website</span>
        </button>
        <button
          type="button"
          title="Log out"
          aria-label="Log out"
          onClick={() => setShowLogoutModal(true)}
          className="mt-2 flex h-11 w-full items-center gap-3 rounded-[9px] px-3 text-left text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-gray-500 dark:hover:text-rose-400"
        >
          <LogOut size={19} strokeWidth={2} className="shrink-0" />
          <span className="text-sm font-bold">Log out</span>
        </button>
      </aside>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => { await logout(); setShowLogoutModal(false); window.location.assign('/login?from=logout'); }}
      />
    </>
  );
};

const curriculumLevelFromProfile = (savedLevel = '') => {
  const alias = savedLevel === 'Form 5' ? 'Lower 6' : savedLevel === 'Form 6' ? 'Upper 6' : savedLevel;
  return CURRICULUM_REGISTRY.find((level) => level.name === alias) ?? null;
};

const ALL_SUBJECT_OPTIONS = Array.from(
  new Map(
    CURRICULUM_REGISTRY.flatMap((level) => level.subjects)
      .map((subject) => [subject.name, { name: subject.name, description: subject.description }] as const)
  ).values()
).sort((a, b) => a.name.localeCompare(b.name));

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BookOpen,
  Compass,
  FlaskConical,
  Atom,
  Sparkles,
  Zap,
  Flame,
  Crown,
  Award,
};

const DedicatedLearnersCard = ({
  onNavigate,
  ranking,
  loading = false,
  onOpenModal,
}: {
  onNavigate: any;
  ranking: PublicProfile[];
  loading?: boolean;
  onOpenModal?: () => void;
}) => (
  <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-2 text-xs font-black text-slate-950 dark:text-white">
        <Trophy size={15} className="text-yellow-400" /> Dedicated Learners
      </p>
      <span className="rounded-full bg-[#ef2b3f]/15 px-2 py-[2px] text-[9px] font-black uppercase tracking-wide text-[#ff6b7a]">
        Top Stars
      </span>
    </div>
    {onOpenModal && (
      <button
        onClick={onOpenModal}
        className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-[10px] font-black text-amber-700 dark:text-amber-300 transition-colors"
      >
        <Sparkles size={11} className="text-yellow-500" /> View Standing & Badges
      </button>
    )}
    <div className="mt-3 space-y-1.5">
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex w-full items-center gap-2 rounded-[9px] px-2 py-2 animate-pulse"
          >
            <span className="w-6 text-center text-[11px] font-black tabular-nums text-slate-400 dark:text-gray-600">
              {index + 1}
            </span>
            <span className="h-7 w-7 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
            <span className="min-w-0 flex-1 space-y-1">
              <span className="block h-3 w-4/5 rounded bg-slate-200 dark:bg-white/10" />
              <span className="block h-2 w-1/2 rounded bg-slate-200/60 dark:bg-white/5" />
            </span>
          </div>
        ))
      ) : ranking.length > 0 ? (
        ranking.slice(0, 5).map((student, index) => {
          const visits = student.visitCount ?? student.totalPoints ?? 0;
          return (
            <button
              key={student.id}
              onClick={() => onNavigate('public-profile', { id: student.id })}
              className="flex w-full items-center gap-2 rounded-[9px] px-2 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
            >
              <span
                className={clsx(
                  'w-5 text-center text-[11px] font-black tabular-nums',
                  index === 0 ? 'text-yellow-400' : 'text-slate-500 dark:text-gray-500',
                )}
              >
                {index + 1}
              </span>
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#ef2b3f]/15 text-[10px] font-black text-[#ff6b7a]">
                {student.photoURL ? (
                  <img src={student.photoURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  student.displayName.charAt(0).toUpperCase()
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-bold text-slate-700 dark:text-gray-200">
                  {student.displayName}
                </span>
                <span className="block truncate text-[9px] font-medium text-slate-500 dark:text-gray-500">
                  {student.school || student.level || 'Student'}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="flex items-center gap-1 text-[10px] font-black text-slate-600 dark:text-gray-300">
                  <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
                  {visits}
                </span>
              </span>
            </button>
          );
        })
      ) : (
        <p className="py-4 text-center text-[10px] font-semibold text-slate-500 dark:text-gray-500">
          No dedicated learners yet.
        </p>
      )}
    </div>
  </div>
);

const DedicatedLearnersTableView = ({
  ranking,
  currentUserId,
  currentUserName,
  currentUserSchool,
  currentUserVisits,
  onNavigate,
  loading,
  metrics,
  onOpenModal,
}: any) => {
  const myIndex = ranking.findIndex((r: any) => r.id === currentUserId);
  const myProfile = myIndex !== -1 ? ranking[myIndex] : null;
  const myRank = myIndex !== -1 ? myIndex + 1 : (ranking.length > 0 ? ranking.length + 1 : 1);
  const myStars = myProfile ? (myProfile.visitCount ?? myProfile.totalPoints ?? currentUserVisits) : currentUserVisits;
  const achievementBonus = calculateAchievementPoints(metrics.unlockedAchievementIds);
  const totalMyPoints = myStars + achievementBonus;
  const top10 = ranking.slice(0, 10);
  const unlockedCount = metrics.unlockedAchievementIds.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-dropdown-reveal">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/25 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
              <Trophy size={13} className="text-yellow-500" /> Dedicated Learners Leaderboard
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Dedicated Learners & Achievements
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-gray-300">
              Earn points and climb the rankings by solving feed challenges, reading lessons, and exploring practical labs.
            </p>
          </div>

          <button
            onClick={onOpenModal}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles size={15} /> Celebrate Standing
          </button>
        </div>
      </div>

      {/* Current User Standing Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-white dark:bg-[#151820] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-base shadow-md shadow-amber-500/25">
              #{myRank}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Your Dedicated Ranking
                </span>
                <span className="rounded-full bg-[#ef2b3f]/10 px-2 py-0.5 text-[9px] font-bold text-[#ef2b3f]">You</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentUserName || 'Student'}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                {currentUserSchool || 'Exam Sidemann Student'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-white/10 pt-3 sm:pt-0 sm:pl-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Platform Stars</p>
              <span className="flex items-center gap-1 text-sm sm:text-base font-black text-slate-900 dark:text-white">
                <Star size={14} className="text-yellow-400 fill-yellow-400 shrink-0" />
                {myStars}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Points</p>
              <span className="text-sm sm:text-base font-black text-amber-500">
                {totalMyPoints} pts
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Achievements</p>
              <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                {unlockedCount} / {ACHIEVEMENTS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Dedicated Learners Leaderboard */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#12141c] overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" /> Dedicated Learners Leaderboard (Top 10)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Rankings based on active learning discovery and stars
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" /> Most Stars
          </span>
        </div>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin text-[#ef2b3f]" />
            <p className="text-xs text-slate-400">Loading dedicated learners...</p>
          </div>
        ) : top10.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
            {top10.map((student: any, index: number) => {
              const rank = index + 1;
              const visits = student.visitCount ?? student.totalPoints ?? 0;
              const isCurrentUser = student.id === currentUserId;

              return (
                <div
                  key={student.id}
                  onClick={() => onNavigate('public-profile', { id: student.id })}
                  className={clsx(
                    'p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer',
                    isCurrentUser
                      ? 'bg-amber-50/70 dark:bg-amber-500/10'
                      : 'hover:bg-slate-50/70 dark:hover:bg-white/[0.02]',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={clsx(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black tabular-nums',
                        rank === 1
                          ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/30'
                          : rank === 2
                          ? 'bg-slate-300 dark:bg-slate-600 text-black dark:text-white'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400',
                      )}
                    >
                      {rank}
                    </span>

                    <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-[#ef2b3f]/20 flex items-center justify-center text-xs font-black text-[#ff6b7a]">
                      {student.photoURL ? (
                        <img src={student.photoURL} alt={student.displayName} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        student.displayName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <span>{student.displayName}</span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 truncate">
                        {student.school || student.level || 'Student'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="flex items-center justify-end gap-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      <Star size={13} className="text-yellow-400 fill-yellow-400 shrink-0" />
                      {visits}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-8 text-center text-xs text-slate-400">No dedicated learners available yet.</p>
        )}
      </div>
    </div>
  );
};

const MySubjectsCard = ({
  subjects,
  enrolledSubjects,
  availableSubjects,
  levelName,
  onNavigate,
  onSaveSubjects,
}: {
  subjects: SubjectStudyStat[];
  enrolledSubjects: string[];
  availableSubjects: { name: string; description: string }[];
  levelName: string;
  onNavigate: any;
  onSaveSubjects: (subjects: string[]) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(enrolledSubjects);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(enrolledSubjects);
  }, [editing, enrolledSubjects]);

  const filteredOptions = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return ALL_SUBJECT_OPTIONS.filter((subject) => (
      !needle || subject.name.toLowerCase().includes(needle)
    )).slice(0, 50);
  }, [search]);

  const toggleSubject = (subject: string) => {
    setDraft((current) => (
      current.includes(subject)
        ? current.filter((name) => name !== subject)
        : [...current, subject]
    ));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSaveSubjects(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex-1 min-h-0 flex flex-col dark:border-white/[0.06] dark:bg-[#1c1f26] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-slate-950 dark:text-white">My Subjects</p>
          <button
            onClick={() => setEditing(true)}
            aria-label="Add subjects"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 dark:bg-white/[0.06] dark:text-gray-400 dark:hover:text-white"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto custom-scrollbar">
          {subjects.length > 0 ? subjects.map((s) => (
            <button
              key={s.subject}
              onClick={() => onNavigate('courses/detail', { id: levelName, subject: s.subject })}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#ff6b7a] dark:bg-[#252932]"><BookOpen size={13} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-bold text-slate-700 dark:text-gray-200">{s.subject}</span>
                <span className="block text-[9px] font-medium text-slate-500 dark:text-gray-500">{formatPlatformTime(s.timeMs)}</span>
              </span>
              <Bookmark size={13} className="shrink-0 text-slate-400 dark:text-gray-600" />
            </button>
          )) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center dark:border-white/10">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-gray-500">No subjects saved yet.</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#ef2b3f] px-2.5 py-1 text-[10px] font-black text-white"
              >
                <Plus size={11} /> Add
              </button>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1c1f26]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-base font-black text-slate-950 dark:text-white">Select Your Subjects</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-gray-400">{draft.length} selected</p>
              </div>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-[#252932]">
                <Search size={15} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subjects..."
                  className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-gray-100 outline-none"
                />
              </div>

              <div className="grid max-h-[48vh] grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar">
                {filteredOptions.map((sub) => {
                  const checked = draft.includes(sub.name);
                  return (
                    <button
                      key={sub.name}
                      onClick={() => toggleSubject(sub.name)}
                      className={clsx(
                        'flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition-all',
                        checked
                          ? 'border-[#ef2b3f] bg-[#ef2b3f]/10 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#252932] text-slate-700 dark:text-gray-300'
                      )}
                    >
                      <span className={clsx('flex h-4 w-4 shrink-0 items-center justify-center rounded border', checked ? 'border-[#ef2b3f] bg-[#ef2b3f] text-white' : 'border-slate-300 dark:border-white/20')}>
                        {checked && <Check size={11} />}
                      </span>
                      <span className="truncate">{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => void save()}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#ef2b3f] text-white text-xs font-black flex items-center gap-1.5"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TopTabsBar = ({
  onNavigate,
  displayName,
  profilePhoto,
  theme,
  onToggleTheme,
  activeTab,
  setActiveTab,
  unreadNotifsCount = 0,
  streak = 0,
}: any) => {
  const TABS = [
    { id: 'for-you', label: 'For You', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'daily-bite', label: 'Daily Bite', icon: Zap },
    { id: 'ranking', label: 'Dedicated Learners', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#0c0e14] p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
      {/* Back to site button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1d26] text-slate-700 dark:text-gray-200 hover:text-[#ef2b3f] dark:hover:text-[#ef2b3f] text-xs font-black transition-all active:scale-95 shrink-0"
          title="Back to site"
        >
          <ArrowLeft size={14} className="shrink-0" />
          <span className="hidden sm:inline">Back to Site</span>
        </button>

        {streak > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[11px] font-black text-orange-600 dark:text-orange-400">
            <Flame size={12} className="text-orange-500" />
            <span>{streak}d</span>
          </span>
        )}
      </div>

      {/* Center Nav Pills */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          const TabIcon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={clsx(
                'shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-black transition-all',
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm scale-105'
                  : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
              )}
            >
              <span className="inline-flex items-center gap-1.5"><TabIcon size={13} />{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 dark:border-white/[0.06] dark:bg-[#1a1d26] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={() => onNavigate('notifications')}
          title="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 dark:bg-[#1a1d26] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Bell size={15} />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ef2b3f] px-1 text-[9px] font-black text-white shadow-sm ring-2 ring-white dark:ring-[#1c1f26]">
              {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'profile' ? 'for-you' : 'profile')}
          className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-[#1a1d26] border border-slate-200 dark:border-white/[0.06] py-1 pl-1 pr-2.5 transition-colors hover:border-[#ef2b3f]/40"
        >
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#ef2b3f]/20 text-[11px] font-black text-[#ff6b7a] shrink-0">
            {profilePhoto ? (
              <img src={profilePhoto} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </span>
          <span className="hidden md:block text-[11px] font-bold text-slate-800 dark:text-gray-200 truncate max-w-[90px]">{displayName}</span>
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/*  Main Dashboard                                                        */
/* ---------------------------------------------------------------------- */

interface DashboardProps {
  onLoginRequest: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLoginRequest, onNavigate }) => {
  const { user, userProfile, updateProfileData, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'for-you' | 'explore' | 'daily-bite' | 'ranking' | 'profile'>('for-you');
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [subjectStudyDays, setSubjectStudyDays] = useState<SubjectStudyDay[]>([]);
  const [aiNotes, setAiNotes] = useState<AiSavedNote[]>([]);
  const [ranking, setRanking] = useState<PublicProfile[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState<SavedResource | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(readThemeMode);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [achievementMetrics, setAchievementMetrics] = useState<UserMetrics>(getStoredMetrics);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [studentSignals, setStudentSignals] = useState<StudentLearningSignals>(getStoredStudentSignals);

  const schoolName = userProfile?.school?.trim() || 'My School';
  const schoolLogo = schoolForName(schoolName)?.image || polytechnicLogoForName(schoolName);
  const displayName = userProfile?.firstName || 'Student';
  const profilePhoto = userProfile?.photoURL || user?.photoURL;
  const signedInWithGoogle = Boolean(user?.providerData.some((provider) => provider.providerId === 'google.com'));
  const needsGoogleProfile = Boolean(
    signedInWithGoogle &&
    userProfile?.role === 'student' &&
    (
      userProfile.profileCompleted !== true ||
      !userProfile.educationType ||
      !userProfile.grade?.trim()
    )
  );

  const dashboardSignals = useMemo<StudentLearningSignals>(() => ({
    ...studentSignals,
    grade: userProfile?.course || userProfile?.grade || studentSignals.grade,
    educationType: userProfile?.educationType || studentSignals.educationType,
    enrolledSubjects: userProfile?.enrolledSubjects?.length
      ? userProfile.enrolledSubjects
      : studentSignals.enrolledSubjects,
    streakDays: Math.max(studentSignals.streakDays, userProfile?.streak || 0),
  }), [studentSignals, userProfile?.course, userProfile?.grade, userProfile?.educationType, userProfile?.enrolledSubjects, userProfile?.streak]);

  const refreshFeedData = () => {
    setStudentSignals(getStoredStudentSignals());
  };

  const feedItems: FeedCardItem[] = useMemo(() => {
    return getPersonalizedFeed(dashboardSignals);
  }, [dashboardSignals]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    loadStudentSignals(user.uid).then((stored) => {
      if (cancelled) return;
      const currentAcademicLevel = userProfile?.course || userProfile?.grade || stored.grade;
      const currentSubjects = userProfile?.enrolledSubjects?.length ? userProfile.enrolledSubjects : stored.enrolledSubjects;
      const academicChanged = currentAcademicLevel.trim().toLowerCase() !== stored.grade.trim().toLowerCase() ||
        (userProfile?.educationType && userProfile.educationType !== stored.educationType);
      const merged = academicChanged
        ? resetStudentPersonalization(user.uid, {
            grade: currentAcademicLevel,
            educationType: userProfile?.educationType || stored.educationType,
            enrolledSubjects: currentSubjects,
          })
        : saveStudentSignals({
            ...stored,
            enrolledSubjects: currentSubjects,
            streakDays: Math.max(stored.streakDays, userProfile?.streak || 0),
          });
      setStudentSignals(merged);
    });
    return () => { cancelled = true; };
  }, [user?.uid, userProfile?.grade, userProfile?.course, userProfile?.educationType]);

  useEffect(() => {
    if (!user) {
      setUnreadNotifsCount(0);
      return;
    }
    const unsub = subscribeToPendingFriendRequests(user.uid, ({ count }) => {
      setUnreadNotifsCount(count);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const unsub = subscribeToAchievements((metrics) => {
      setAchievementMetrics(metrics);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    applyThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    let loadedCount = 0;
    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= 1) setLoadingData(false);
    };
    const safetyTimer = setTimeout(() => setLoadingData(false), 1200);

    const unsubRes = onSnapshot(
      query(collection(db, 'users', user.uid, 'resources'), orderBy('createdAt', 'desc'), limit(6)),
      (snap) => {
        setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedResource)));
        markLoaded();
      },
      () => markLoaded()
    );
    const unsubActivity = onSnapshot(
      query(collection(db, 'users', user.uid, 'activityDays'), orderBy('date', 'desc'), limit(4000)),
      (snap) => {
        setActivityDays(snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            date: typeof data.date === 'string' ? data.date : d.id,
            timeMs: typeof data.timeMs === 'number' && Number.isFinite(data.timeMs) ? data.timeMs : 0,
          };
        }));
        markLoaded();
      },
      () => markLoaded()
    );
    const unsubSubjectDays = onSnapshot(
      query(collection(db, 'users', user.uid, 'subjectStudyDays'), orderBy('date', 'desc'), limit(4000)),
      (snap) => {
        setSubjectStudyDays(snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            date: typeof data.date === 'string' ? data.date : '',
            subject: typeof data.subject === 'string' ? data.subject : 'Subject',
            timeMs: typeof data.timeMs === 'number' && Number.isFinite(data.timeMs) ? data.timeMs : 0,
          };
        }));
        markLoaded();
      },
      () => markLoaded()
    );

    const unsubAiNotes = subscribeToAiNotes(user.uid, (notes) => {
      setAiNotes(notes);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubRes();
      unsubActivity();
      unsubSubjectDays();
      unsubAiNotes();
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    setLoadingRanking(true);
    fetchGlobalRanking(8)
      .then((rows) => {
        if (!cancelled) setRanking(rows);
      })
      .catch((error) => {
        console.error('Could not load global ranking', error);
      })
      .finally(() => {
        if (!cancelled) setLoadingRanking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const assignedCurriculumLevel = useMemo(
    () => curriculumLevelFromProfile(userProfile?.grade),
    [userProfile?.grade]
  );
  const assignedSubjectOptions = useMemo(
    () => assignedCurriculumLevel?.subjects.map((subject) => ({ name: subject.name, description: subject.description })) ?? [],
    [assignedCurriculumLevel]
  );

  const subjectStats = useMemo(() => {
    const completed = userProfile?.completedTopics || {};
    const allowed = new Set([
      ...assignedSubjectOptions.map((subject) => subject.name),
      ...(userProfile?.enrolledSubjects ?? []),
    ]);
    const enrolled = (userProfile?.enrolledSubjects ?? []).filter((subject) => allowed.has(subject));
    const timeBySubject = new Map<string, { timeMs: number; days: Set<string> }>();
    subjectStudyDays.forEach((day) => {
      const bucket = timeBySubject.get(day.subject) ?? { timeMs: 0, days: new Set<string>() };
      bucket.timeMs += day.timeMs;
      if (day.date) bucket.days.add(day.date);
      timeBySubject.set(day.subject, bucket);
    });
    const subjectsToShow = Array.from(new Set([...enrolled, ...timeBySubject.keys()])).filter((subject) => allowed.has(subject));
    return subjectsToShow.map((sub) => {
      const normalized = sub.toLowerCase().replace(/[^a-z0-9]/g, '');
      const completedCount = Object.keys(completed).filter((key) => key.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalized)).length;
      const tracked = timeBySubject.get(sub);
      const timeProgress = Math.min(((tracked?.timeMs || 0) / 3_600_000) * 20, 100);
      const progress = Math.max(Math.min((completedCount / 15) * 100, 100), timeProgress);
      return {
        subject: sub,
        timeMs: tracked?.timeMs || 0,
        daysRead: tracked?.days.size || 0,
        progress: progress || 0,
      };
    }).sort((a, b) => (
      Number(userProfile?.enrolledSubjects?.includes(b.subject) ?? false) - Number(userProfile?.enrolledSubjects?.includes(a.subject) ?? false) ||
      b.timeMs - a.timeMs ||
      a.subject.localeCompare(b.subject)
    ));
  }, [userProfile, subjectStudyDays, assignedSubjectOptions]);

  const streak = userProfile?.streak || studentSignals.streakDays || 0;
  const visitDays = Math.max(userProfile?.visitCount || 0, activityDays.length || 0);
  const totalTimeMs = useMemo(() => activityDays.reduce((sum, day) => sum + day.timeMs, 0), [activityDays]);
  const weeklyPlatformData = useMemo(() => buildWeeklyPlatformData(activityDays), [activityDays]);

  const saveDashboardSubjects = async (next: string[]) => {
    const allowed = new Set(ALL_SUBJECT_OPTIONS.map((subject) => subject.name));
    const filtered = next.filter((subject) => allowed.has(subject));
    await updateProfileData({ enrolledSubjects: filtered });
    saveStudentSignals({ enrolledSubjects: filtered });
    refreshFeedData();
  };

  const handleToggleEnrollSubject = async (subject: string) => {
    const current = userProfile?.enrolledSubjects ?? studentSignals.enrolledSubjects ?? [];
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    await saveDashboardSubjects(updated);
  };

  const toggleDashboardTheme = () => {
    setTheme((current) => current === 'dark' ? 'light' : 'dark');
  };

  // My rank in Dedicated Learners
  const myRankIndex = user ? ranking.findIndex((r) => r.id === user.uid) : -1;
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : (ranking.length > 0 ? ranking.length + 1 : 1);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Dashboard" />;

  if (needsGoogleProfile && userProfile) {
    return (
      <GoogleProfileCompletion
        firstName={userProfile.firstName || user.displayName?.trim().split(/\s+/)[0] || ''}
        lastName={userProfile.lastName || user.displayName?.trim().split(/\s+/).slice(1).join(' ') || ''}
        email={user.email || userProfile.email || ''}
        photoURL={user.photoURL || userProfile.photoURL}
        onComplete={async ({ firstName, lastName, educationType, grade, school }) => {
          await updateProfileData({
            firstName,
            lastName,
            educationType,
            grade,
            school,
            course: educationType === 'polytechnic' ? grade : '',
            profileCompleted: true,
          });
        }}
      />
    );
  }

  if (loadingData) return <DashboardSkeleton />;

  const schoolMark = <SchoolIdentityMark name={schoolName} logo={schoolLogo} className="h-10 w-10 rounded-xl text-xs" />;

  return (
    <div className="h-[calc(100vh_-_var(--app-header-h))] bg-[#f7f9fa] text-slate-950 flex overflow-hidden relative dark:bg-[#06070a] dark:text-white">
      {/* Quiz overlay */}
      {activeQuiz && (
        <QuizOverlay
          title={activeQuiz.title}
          content={activeQuiz.content}
          subject={activeQuiz.subject}
          onClose={() => setActiveQuiz(null)}
          onComplete={() => setActiveQuiz(null)}
        />
      )}

      {/* Rank & Achievement Celebration Modal */}
      <RankAchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        onViewLeaderboard={() => setActiveTab('ranking')}
        rank={myRank}
        userName={
          [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') ||
          user?.displayName ||
          displayName
        }
        userStars={visitDays}
        metrics={achievementMetrics}
      />

      <IconRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        schoolMark={schoolMark}
        schoolName={schoolName}
      />

      {/* Left desktop rail column */}
      {activeTab === 'profile' && <div className="hidden lg:flex w-[260px] shrink-0 flex-col gap-3 border-r border-slate-200 dark:border-white/[0.06] p-4 h-full overflow-y-auto custom-scrollbar">
        <DedicatedLearnersCard
          onNavigate={onNavigate}
          ranking={ranking}
          loading={loadingRanking}
          onOpenModal={() => setShowAchievementModal(true)}
        />
        <MySubjectsCard
          subjects={subjectStats}
          enrolledSubjects={(userProfile?.enrolledSubjects ?? studentSignals.enrolledSubjects).filter((subject) => ALL_SUBJECT_OPTIONS.some((available) => available.name === subject))}
          availableSubjects={assignedSubjectOptions}
          levelName={assignedCurriculumLevel?.name ?? userProfile?.grade ?? ''}
          onNavigate={onNavigate}
          onSaveSubjects={saveDashboardSubjects}
        />
      </div>}

      {/* Main feed / content column */}
      <main className={clsx(
        'flex-1 h-full min-w-0',
        activeTab === 'for-you'
          ? 'overflow-hidden bg-black'
          : 'overflow-y-auto custom-scrollbar p-3 sm:p-5 lg:p-6 pb-24 lg:pb-6 space-y-4',
      )}>
        {activeTab !== 'for-you' && activeTab !== 'profile' && <TopTabsBar
          onNavigate={onNavigate}
          displayName={displayName}
          profilePhoto={profilePhoto}
          theme={theme}
          onToggleTheme={toggleDashboardTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadNotifsCount={unreadNotifsCount}
          streak={streak}
        />}

        {activeTab === 'for-you' && (
          <ForYouFeed
            signals={dashboardSignals}
            feedItems={feedItems}
            onRefreshFeed={refreshFeedData}
            onNavigate={onNavigate}
            currentUserId={user?.uid}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreHub
            enrolledSubjects={userProfile?.enrolledSubjects ?? studentSignals.enrolledSubjects}
            onToggleEnroll={handleToggleEnrollSubject}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'daily-bite' && (
          <DailyBiteTab
            onNavigate={onNavigate}
            onPointsEarned={() => refreshFeedData()}
          />
        )}

        {activeTab === 'ranking' && (
          <DedicatedLearnersTableView
            ranking={ranking}
            currentUserId={user?.uid}
            currentUserName={displayName}
            currentUserPhoto={profilePhoto}
            currentUserSchool={schoolName}
            currentUserVisits={visitDays}
            onNavigate={onNavigate}
            loading={loadingRanking}
            metrics={achievementMetrics}
            onOpenModal={() => setShowAchievementModal(true)}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfileHub onNavigate={onNavigate} />
        )}
      </main>

      {/* Right desktop stats column */}
      {activeTab === 'profile' && <div className="hidden xl:flex w-[280px] shrink-0 flex-col gap-3 border-l border-slate-200 dark:border-white/[0.06] p-4 h-full overflow-y-auto custom-scrollbar">
        {/* Quick Hub Trigger */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">Quick AI Help</span>
            <Sparkles size={13} className="text-[#ef2b3f]" />
          </div>
          <button
            onClick={() => onNavigate('chat')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#252932] dark:hover:bg-[#2e333e] border border-slate-200 dark:border-white/5 text-xs font-black text-slate-800 dark:text-gray-200 transition-colors flex items-center justify-between"
          >
            <span>Ask AI Tutor</span>
            <ChevronRight size={13} />
          </button>
          <button
            onClick={() => onNavigate('past-papers')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#252932] dark:hover:bg-[#2e333e] border border-slate-200 dark:border-white/5 text-xs font-black text-slate-800 dark:text-gray-200 transition-colors flex items-center justify-between"
          >
            <span>Past Papers</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Time Spent Chart */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-gray-400"><Clock size={12} className="text-[#ff6b7a]" /> Weekly Learning</span>
            <span className="rounded-full bg-[#ef2b3f]/15 px-2 py-0.5 text-[9px] font-bold text-[#ff6b7a]">Active</span>
          </div>
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
              <BarChart data={weeklyPlatformData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 600, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 600, fill: '#4b5563' }} width={26} />
                <Tooltip
                  formatter={(_, __, item) => [item.payload.label, 'Time spent']}
                  contentStyle={{ backgroundColor: '#252932', border: '1px solid #2a2c33', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#ff6b7a' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="hours" fill="#ef2b3f" radius={[4, 4, 1, 1]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[10px] font-bold text-slate-500 dark:text-gray-400 text-center">
            {formatPlatformTime(totalTimeMs)} total study time
          </p>
        </div>

        {/* Saved AI Notes Preview */}
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 shadow-sm flex-1 min-h-[140px]">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Pin size={12} className="text-amber-500 fill-amber-500/20" />
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Saved AI Notes
              </p>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="text-[10px] font-bold text-[#ef2b3f] hover:underline"
            >
              Open AI
            </button>
          </div>

          {aiNotes.length === 0 ? (
            <div className="rounded-lg bg-slate-50 dark:bg-[#252932]/50 p-3 flex flex-col items-center justify-center text-center min-h-[80px] border border-dashed border-slate-200 dark:border-white/5">
              <p className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">
                No saved study notes yet. Bookmark challenges or notes from your feed!
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 overflow-y-auto max-h-[220px] custom-scrollbar">
              {aiNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  onClick={() => onNavigate('chat', { session: note.chatId })}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#252932] dark:hover:bg-[#2b303a] cursor-pointer transition-colors"
                >
                  <p className="text-[11px] font-bold text-slate-800 dark:text-gray-200 truncate">
                    {note.title || 'Study Note'}
                  </p>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {note.content.replace(/[#*`]/g, '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#0c0e14]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 flex items-center justify-around"
      >
        {[
          {
            id: 'for-you',
            label: 'For You',
            icon: Sparkles,
            active: activeTab === 'for-you',
            onClick: () => setActiveTab('for-you'),
          },
          {
            id: 'explore',
            label: 'Explore',
            icon: Compass,
            active: activeTab === 'explore',
            onClick: () => setActiveTab('explore'),
          },
          {
            id: 'daily-bite',
            label: 'Daily Bite',
            icon: Zap,
            active: activeTab === 'daily-bite',
            onClick: () => setActiveTab('daily-bite'),
          },
          {
            id: 'ranking',
            label: 'Ranking',
            icon: Trophy,
            active: activeTab === 'ranking',
            onClick: () => setActiveTab('ranking'),
          },
          {
            id: 'chat',
            label: 'Ask AI',
            icon: ThreeStarAiIcon,
            active: false,
            onClick: () => onNavigate('chat'),
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: User,
            active: activeTab === 'profile',
            onClick: () => setActiveTab('profile'),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
              className={clsx(
                'relative flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-90',
                item.active
                  ? 'bg-[#ef2b3f] text-white shadow-lg shadow-[#ef2b3f]/30 scale-105'
                  : 'text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              )}
            >
              <Icon size={19} strokeWidth={item.active ? 2.5 : 2} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};
