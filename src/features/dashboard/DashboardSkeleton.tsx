import React from 'react';

/**
 * High-fidelity Skeleton loader for Dashboard.
 * Accurately mirrors the 3-column desktop & responsive mobile layout,
 * hero card, characteristics, mastery bars, subject tables, IQ results, charts, and ranking.
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div
      className="h-[calc(100vh_-_var(--app-header-h))] bg-[#f4f6f8] text-slate-950 flex overflow-hidden relative dark:bg-[#06070a] dark:text-white"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* ── Far-left Icon Rail Skeleton (Desktop) ── */}
      <aside className="hidden lg:flex h-full w-16 shrink-0 flex-col items-center border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0d0f13] py-4">
        {/* School Mark */}
        <div className="mb-6 h-10 w-10 rounded-[9px] bg-slate-200/80 dark:bg-white/10 animate-pulse" />
        
        {/* Nav Icons */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`h-11 w-11 rounded-[9px] animate-pulse ${
                i === 0
                  ? 'bg-[#ef2b3f]/30 dark:bg-[#ef2b3f]/25'
                  : 'bg-slate-200/70 dark:bg-white/[0.05]'
              }`}
            />
          ))}
        </nav>
        
        {/* Logout */}
        <div className="mt-2 h-11 w-11 rounded-[9px] bg-slate-200/60 dark:bg-white/[0.04] animate-pulse" />
      </aside>

      {/* ── Left Column Skeleton (Desktop) ── */}
      <div className="hidden lg:flex w-[272px] shrink-0 flex-col gap-3 border-r border-slate-200 dark:border-white/[0.06] p-4 h-full overflow-y-auto custom-scrollbar">
        {/* Search Box */}
        <div className="flex h-12 shrink-0 items-center gap-2.5 rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] px-4 animate-pulse">
          <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-3.5 w-3/5 rounded bg-slate-200/70 dark:bg-white/10" />
        </div>

        {/* Dedicated Learners Card */}
        <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-yellow-400/30" />
              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-4 w-16 rounded-full bg-slate-200/80 dark:bg-white/10" />
          </div>
          <div className="mt-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 rounded-[9px] px-2 py-1.5">
                <div className="h-3 w-4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-slate-200/60 dark:bg-white/5" />
                </div>
                <div className="h-3 w-6 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* My Subjects Card */}
        <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-[#ff6b7a]/30" />
              <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-5 w-12 rounded-[7px] bg-slate-200/80 dark:bg-white/10" />
          </div>
          <div className="mt-3 space-y-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-[8px] bg-slate-50 dark:bg-[#252932] p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="h-6 w-6 shrink-0 rounded-md bg-slate-200 dark:bg-white/10" />
                    <div className="h-3 w-24 rounded bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="h-3 w-7 rounded bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#ff6b7a]/40"
                    style={{ width: `${(i + 1) * 28}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="h-2 w-14 rounded bg-slate-200/60 dark:bg-white/5" />
                  <div className="h-2 w-10 rounded bg-slate-200/60 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Column Skeleton ── */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-3 sm:p-5 lg:p-6 pb-28 lg:pb-6 space-y-4">
        {/* Top Tabs Bar */}
        <div className="flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto">
            {['Dashboard', 'Profile', 'Curriculum', 'Quizzes', 'Resources', 'Chat AI'].map((_, i) => (
              <div
                key={i}
                className={`h-4 rounded ${
                  i === 0
                    ? 'w-16 bg-[#ef2b3f]/40 dark:bg-[#ef2b3f]/30'
                    : 'w-14 bg-slate-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="h-9 w-9 rounded-[9px] bg-slate-200 dark:bg-white/10" />
            <div className="h-9 w-9 rounded-[9px] bg-slate-200 dark:bg-white/10" />
            <div className="flex h-9 items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] py-1.5 pl-1.5 pr-3">
              <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="hidden sm:block h-3 w-14 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>

        {/* Mobile-only Search & Quick Actions */}
        <div className="lg:hidden space-y-3 animate-pulse">
          <div className="flex h-11 items-center gap-2.5 rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] px-4">
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="h-3 w-40 rounded bg-slate-200/70 dark:bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-3">
              <div className="h-8 w-8 rounded-lg bg-[#ef2b3f]/20" />
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="flex items-center gap-2.5 rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/20" />
              <div className="h-3 w-14 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>

        {/* Hero Card Skeleton */}
        <section className="relative overflow-hidden rounded-[9px] border border-slate-200 dark:border-white/[0.06] animate-pulse">
          {/* Top Banner Gradient */}
          <div className="relative bg-gradient-to-br from-[#3a0d13] via-[#210a0d] to-[#06070a] px-5 pt-6 pb-8 sm:px-8 sm:pt-8">
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-2.5 w-28 rounded bg-white/20" />
                <div className="h-7 sm:h-8 w-44 sm:w-56 rounded bg-white/30" />
                <div className="h-3.5 w-24 rounded bg-white/15" />
              </div>
              <div className="h-7 w-20 rounded-full bg-emerald-500/20" />
            </div>
          </div>

          {/* Inset Subcards */}
          <div className="relative z-10 -mt-4 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-2.5 px-3 pb-3 sm:px-4 sm:pb-4">
            {/* Characteristic Box */}
            <div className="rounded-[9px] bg-slate-50 dark:bg-[#20232a]/95 backdrop-blur p-4">
              <div className="mb-3 h-2.5 w-24 rounded bg-slate-200 dark:bg-white/10" />
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-[9px] bg-slate-100 dark:bg-white/[0.04] p-2.5 space-y-2">
                  <div className="h-3.5 w-3.5 rounded bg-emerald-400/30" />
                  <div className="h-2 w-12 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-full rounded-md bg-emerald-500/15" />
                </div>
                <div className="rounded-[9px] bg-slate-100 dark:bg-white/[0.04] p-2.5 space-y-2">
                  <div className="h-3.5 w-3.5 rounded bg-amber-400/30" />
                  <div className="h-2 w-14 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-full rounded-md bg-amber-500/15" />
                </div>
                <div className="rounded-[9px] bg-slate-100 dark:bg-white/[0.04] p-2.5 space-y-2">
                  <div className="h-3.5 w-3.5 rounded bg-[#ef2b3f]/30" />
                  <div className="h-2 w-10 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-full rounded-md bg-[#ef2b3f]/15" />
                </div>
              </div>
            </div>

            {/* Mastery % Bars Box */}
            <div className="rounded-[9px] bg-slate-50 dark:bg-[#20232a]/95 backdrop-blur p-4">
              <div className="mb-3 h-2.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-16 h-2.5 rounded bg-slate-200 dark:bg-white/10 shrink-0" />
                    <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500/35"
                        style={{ width: `${(4 - i) * 22}%` }}
                      />
                    </div>
                    <div className="w-7 h-2.5 rounded bg-slate-200 dark:bg-white/10 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Subject Study Table Skeleton */}
        <section className="overflow-hidden rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] animate-pulse">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[520px]">
              {/* Header */}
              <div className="bg-slate-50 dark:bg-[#20232a] px-5 py-3 flex items-center justify-between gap-4">
                <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-2.5 w-28 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
              </div>
              {/* Rows */}
              <div className="divide-y divide-slate-200 dark:divide-white/[0.05]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 w-48 shrink-0">
                      <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10" />
                      <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/10" />
                    </div>
                    <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="h-3 w-14 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="flex items-center gap-2 w-36">
                      <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-white/10" />
                      <div className="h-2.5 w-7 rounded bg-slate-200 dark:bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile-only Visit Summary + Streak */}
        <div className="lg:hidden grid grid-cols-2 gap-2.5 animate-pulse">
          <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-2">
            <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-6 w-20 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-2.5 w-28 rounded bg-slate-200/60 dark:bg-white/5" />
          </div>
          <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-2">
            <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-6 w-16 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        </div>

        {/* IQ Trainer Results List Skeleton */}
        <section className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 sm:p-5 animate-pulse">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-[#ff6b7a]/30" />
              <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/[0.05]" />
          </div>
          <div className="divide-y divide-slate-200 dark:divide-white/[0.05]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-3 min-w-0 flex-1 rounded bg-slate-200 dark:bg-white/10" />
                <div className="hidden sm:block h-2.5 w-20 rounded bg-slate-200/60 dark:bg-white/5" />
                <div className="hidden md:block h-2.5 w-12 rounded bg-slate-200/60 dark:bg-white/5" />
                <div className="h-6 w-14 rounded-lg bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </section>

        {/* Mobile-only Chart & Quiz History */}
        <div className="lg:hidden space-y-4 animate-pulse">
          <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-16 rounded-full bg-slate-200/80 dark:bg-white/10" />
            </div>
            <div className="h-24 w-full rounded bg-slate-100 dark:bg-white/[0.04]" />
          </div>
          <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4">
            <div className="mb-3 h-2.5 w-24 rounded bg-slate-200 dark:bg-white/10" />
            <div className="grid grid-cols-2 gap-2.5">
              <div className="h-24 rounded-[9px] bg-slate-100 dark:bg-[#252932]" />
              <div className="h-24 rounded-[9px] bg-slate-100 dark:bg-[#252932]" />
            </div>
          </div>
        </div>
      </main>

      {/* ── Right Column Skeleton (Desktop) ── */}
      <div className="hidden xl:flex w-[300px] shrink-0 flex-col gap-3 border-l border-slate-200 dark:border-white/[0.06] p-4 h-full overflow-y-auto custom-scrollbar animate-pulse">
        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <div className="h-11 flex-1 rounded-full bg-[#ef2b3f]/35" />
          <div className="h-11 flex-1 rounded-full border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26]" />
        </div>

        {/* Visit Summary Card */}
        <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
              <div className="mt-1 h-7 w-24 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/[0.05]" />
          </div>
          <div className="h-2.5 w-40 rounded bg-slate-200/60 dark:bg-white/5" />
        </div>

        {/* Time Spent Chart Card */}
        <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-[#ff6b7a]/30" />
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
            </div>
            <div className="h-4 w-16 rounded-full bg-slate-200/80 dark:bg-white/10" />
          </div>
          
          {/* Chart Bars Skeleton */}
          <div className="flex items-end justify-between gap-2 h-[120px] px-2 pt-4 pb-2 border-b border-slate-100 dark:border-white/5">
            {[45, 75, 30, 90, 60, 20, 50].map((height, idx) => (
              <div
                key={idx}
                className="w-5 rounded-t-[5px] bg-[#ef2b3f]/30 dark:bg-[#ef2b3f]/25"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center space-y-1">
                <div className="mx-auto h-2 w-4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="mx-auto h-2 w-3 rounded bg-slate-200/50 dark:bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz History Pair */}
        <div className="rounded-[9px] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#1c1f26] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-white/[0.05]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[9px] bg-slate-100 dark:bg-[#252932] p-3 flex flex-col items-center space-y-2"
              >
                <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="h-2.5 w-16 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-4 w-10 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-5 w-14 rounded-md bg-slate-200/70 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
