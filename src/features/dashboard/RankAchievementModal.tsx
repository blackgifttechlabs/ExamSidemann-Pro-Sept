import React, { useEffect, useRef } from 'react';
import {
  Star,
  CheckCircle2,
  Lock,
  X,
  BookOpen,
  Compass,
  FlaskConical,
  Atom,
  Sparkles,
  Zap,
  Flame,
  Crown,
  Award,
  ChevronRight,
} from 'lucide-react';
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  type UserMetrics,
  calculateAchievementPoints,
} from '../../services/achievements';

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

export const RankAchievementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onViewLeaderboard?: () => void;
  rank: number;
  userName: string;
  userStars: number;
  metrics: UserMetrics;
}> = ({
  isOpen,
  onClose,
  onViewLeaderboard,
  rank,
  userName,
  userStars,
  metrics,
}) => {
  const audioPlayedRef = useRef(false);

  // Play congrats sound at the exact moment the congrats modal shows
  useEffect(() => {
    if (isOpen) {
      try {
        const audio = new Audio('/sounds/app/congrats.mp3');
        audio.volume = 0.65;
        audio.play().catch(() => {
          // Auto-play might be restricted until user interacts
        });
      } catch (err) {
        console.warn('Could not play congrats audio:', err);
      }
    } else {
      audioPlayedRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const achievementPoints = calculateAchievementPoints(metrics.unlockedAchievementIds);
  const totalEarnedPoints = userStars + achievementPoints;
  const unlockedCount = metrics.unlockedAchievementIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-lg overflow-y-auto animate-fade-in">
      {/* 3D Gamified Modal Shell with Full Light/Dark Mode Support */}
      <div className="relative w-full max-w-5xl my-auto rounded-[9px] bg-gradient-to-b from-[#fefbf6] via-[#f7f4ed] to-[#ede7dc] dark:from-[#1c2230] dark:via-[#141824] dark:to-[#0c0f17] border-2 border-amber-500/40 dark:border-amber-400/40 shadow-[0_25px_65px_-10px_rgba(0,0,0,0.35),0_0_40px_rgba(251,191,36,0.2),inset_0_2px_0_rgba(255,255,255,0.8)] dark:shadow-[0_25px_65px_-10px_rgba(0,0,0,0.9),0_0_50px_rgba(251,191,36,0.25),inset_0_2px_0_rgba(255,255,255,0.15)] overflow-hidden animate-scale-up flex flex-col transition-colors duration-300">
        
        {/* Top Header Bar: Clean uncontained title without icon + right Close Button */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-50/60 dark:via-slate-900/80 to-amber-500/10">
          {/* Dedicated Learners Leaderboard (no container, no icon beside it) */}
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 drop-shadow-[0_1px_2px_rgba(245,158,11,0.2)] dark:drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]">
            Dedicated Learners Leaderboard
          </span>

          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 px-3 py-1 rounded-[9px] text-xs font-black text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white/80 dark:bg-slate-800/90 hover:bg-rose-500/15 dark:hover:bg-rose-600/30 border border-slate-300 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500/50 shadow-[0_2px_0_rgba(0,0,0,0.08)] dark:shadow-[0_2px_0_rgba(0,0,0,0.6)] active:translate-y-0.5 transition-all"
            aria-label="Close"
          >
            <span>Close</span>
            <X size={15} className="group-hover:rotate-90 transition-transform duration-200 text-rose-500 dark:text-rose-400" />
          </button>
        </div>

        {/* 2-Column Gamified Level-Up Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          {/* Left Column: Trophy (no container), Full Big User Name, Level Up Gamified Banner */}
          <div className="lg:col-span-5 relative p-6 sm:p-8 bg-gradient-to-b from-amber-500/15 via-amber-50/30 dark:via-transparent to-amber-100/40 dark:to-black/50 border-b lg:border-b-0 lg:border-r border-amber-500/20 flex flex-col justify-between items-center text-center overflow-hidden">
            {/* Ambient Sunburst & Glow Rays */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-88 h-44 bg-amber-400/20 dark:bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Trophy standing freely with no surrounding box container */}
              <div className="relative my-2 flex flex-col items-center">
                <img
                  src="/images/icons/trophy.png"
                  alt="Dedicated Learners Trophy"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_12px_24px_rgba(245,158,11,0.4)] dark:drop-shadow-[0_12px_24px_rgba(245,158,11,0.6)] animate-bounce"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* 3D Game Ribbon Badge for Rank */}
                <div className="-mt-3 px-5 py-1.5 rounded-[9px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-[0_4px_0_#b45309,0_8px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_0_#b45309,0_8px_16px_rgba(0,0,0,0.5)] border border-yellow-200 animate-pulse">
                  Rank #{rank}
                </div>
              </div>

              {/* User Full Name — Big & Prominent */}
              <div className="mt-4 w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Congratulations
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] break-words">
                  {userName || 'Dedicated Learner'}
                </h2>
              </div>
            </div>

            {/* 3D Gamified Standing Indicator Banner */}
            <div className="relative z-10 mt-6 w-full p-3.5 rounded-[9px] bg-white/90 dark:bg-gradient-to-r dark:from-[#202738] dark:via-[#2a1d30] dark:to-[#202738] border border-amber-400/30 shadow-[0_4px_0_#d1c7b7,inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_0_#0a0d14,inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-950 font-black shadow-md">
                  <Crown size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Leaderboard Status</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">Top Dedicated Learner</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-[9px] bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-black shadow-sm">
                Active Tier 🌟
              </span>
            </div>
          </div>

          {/* Right Column: 3D Game Style Rewards / Stats + Circular Achievements Grid & List */}
          <div className="lg:col-span-7 flex flex-col bg-white/50 dark:bg-slate-950/50">
            {/* Gamified 3D Tokens Row (Inspired by Coins / Diamonds Game HUD) */}
            <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-amber-50/40 dark:bg-slate-900/60">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 text-center">
                {/* Total Points / Gold Coin */}
                <div className="p-3 rounded-[9px] bg-white dark:bg-gradient-to-b dark:from-[#2a3042] dark:to-[#181d28] border border-amber-400/50 dark:border-amber-500/40 shadow-[0_4px_0_#d8ccb8,0_8px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_0_#0f121a,0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    Total Points
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5 mt-1 drop-shadow-[0_1px_2px_rgba(245,158,11,0.3)] dark:drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]">
                    <Star size={17} className="fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400 animate-spin" />
                    {totalEarnedPoints}
                  </p>
                </div>

                {/* Platform Stars / Blue Diamond HUD */}
                <div className="p-3 rounded-[9px] bg-white dark:bg-gradient-to-b dark:from-[#2a3042] dark:to-[#181d28] border border-cyan-400/50 dark:border-cyan-500/40 shadow-[0_4px_0_#d8ccb8,0_8px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_0_#0f121a,0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                    Stars Earned
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1 drop-shadow-[0_1px_2px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_2px_4px_rgba(6,182,212,0.5)]">
                    {userStars}
                  </p>
                </div>

                {/* Badges / Green Ruby Token */}
                <div className="p-3 rounded-[9px] bg-white dark:bg-gradient-to-b dark:from-[#2a3042] dark:to-[#181d28] border border-emerald-400/50 dark:border-emerald-500/40 shadow-[0_4px_0_#d8ccb8,0_8px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_4px_0_#0f121a,0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    Badges
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 drop-shadow-[0_1px_2px_rgba(16,185,129,0.3)] dark:drop-shadow-[0_2px_4px_rgba(16,185,129,0.5)]">
                    {unlockedCount}/{totalCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 drop-shadow-sm">
                  <Award size={15} className="text-yellow-600 dark:text-yellow-400 animate-pulse" /> Unlocked Milestones
                </h3>
                <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2.5 py-0.5 rounded-[9px] border border-slate-200 dark:border-slate-700 shadow-sm">
                  {unlockedCount} of {totalCount} Completed
                </span>
              </div>

              {/* 3D Scrollable Achievement Cards with Game Badge Styling */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-1.5">
                {ACHIEVEMENTS.map((ach) => {
                  const progress = getAchievementProgress(ach, metrics);
                  const Icon = ICON_MAP[ach.iconName] || Award;

                  return (
                    <div
                      key={ach.id}
                      className={`group relative flex items-start gap-3 p-3 rounded-[9px] border transition-all ${
                        progress.unlocked
                          ? 'bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-emerald-950/20 border-emerald-400/60 dark:border-emerald-500/50 shadow-[0_3px_0_#a7f3d0,0_4px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_0_#064e3b,0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-0.5'
                          : 'bg-white/70 dark:bg-gradient-to-r dark:from-slate-900/60 dark:to-slate-900/30 border-slate-200/80 dark:border-slate-800 shadow-[0_2px_0_#e2e8f0] dark:shadow-[0_3px_0_#090d14,0_4px_8px_rgba(0,0,0,0.3)] opacity-75'
                      }`}
                    >
                      {/* 3D Round Badge Icon Box (Inspired by Badge Tokens in Game UI) */}
                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] font-black transition-transform group-hover:scale-110 duration-200 ${
                          progress.unlocked
                            ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 text-slate-950 shadow-[0_3px_0_#b45309,0_0_10px_rgba(245,158,11,0.3)] dark:shadow-[0_4px_0_#78350f,0_0_12px_rgba(245,158,11,0.5)]'
                            : 'bg-slate-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#0f172a]'
                        }`}
                      >
                        <Icon size={19} />
                        {progress.unlocked ? (
                          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-[#0f121a]">
                            <CheckCircle2 size={13} className="stroke-[3]" />
                          </span>
                        ) : (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 dark:bg-slate-700 text-white dark:text-slate-300 shadow-md ring-2 ring-white dark:ring-[#0f121a]">
                            <Lock size={9} />
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p
                              className={`text-xs sm:text-sm font-black truncate ${
                                progress.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {ach.title}
                            </p>
                            {ach.isGrand && (
                              <span className="px-1.5 py-0.5 rounded-[9px] text-[8px] font-black uppercase tracking-wider bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 dark:border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)] dark:shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse">
                                Grand Tier 🔥
                              </span>
                            )}
                          </div>
                          <span className="shrink-0 font-black text-xs text-amber-600 dark:text-amber-400 drop-shadow-sm">
                            +{ach.points} pts
                          </span>
                        </div>

                        {/* 3D Progress Bar */}
                        <div className="mt-2 flex items-center gap-2.5">
                          <div className="flex-1 h-2 rounded-[9px] bg-slate-200 dark:bg-slate-950/80 border border-slate-300/60 dark:border-white/5 shadow-inner overflow-hidden">
                            <div
                              className={`h-full rounded-[9px] transition-all duration-700 ${
                                progress.unlocked
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.4)] dark:shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              }`}
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                          <span
                            className={`text-[10px] font-black tabular-nums shrink-0 ${
                              progress.unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {progress.unlocked ? (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={11} /> Done
                              </span>
                            ) : (
                              `${progress.current}/${progress.target} ${ach.unit}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Action Footer */}
        <div className="p-4 bg-gradient-to-r from-[#f5ede0] via-[#ebe0cf] to-[#f5ede0] dark:from-[#11141e] dark:via-[#161a25] dark:to-[#11141e] border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-300">
          <button
            onClick={() => {
              onClose();
              if (onViewLeaderboard) onViewLeaderboard();
            }}
            className="w-full sm:w-auto text-xs font-black text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 flex items-center justify-center gap-1 transition-colors"
          >
            View Dedicated Learners Table <ChevronRight size={14} />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 rounded-[9px] bg-gradient-to-b from-[#22c55e] via-[#16a34a] to-[#15803d] text-white text-xs font-black shadow-[0_4px_0_#14532d,0_6px_16px_rgba(34,197,94,0.4)] active:translate-y-1 active:shadow-[0_1px_0_#14532d] transition-all hover:brightness-110 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} /> Collect & Continue
          </button>
        </div>
      </div>
    </div>
  );
};


