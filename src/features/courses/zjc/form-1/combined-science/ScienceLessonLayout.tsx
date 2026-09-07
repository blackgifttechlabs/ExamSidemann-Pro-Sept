import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Beaker, CheckCircle2, FlaskConical, Lightbulb, Microscope, NotebookTabs } from 'lucide-react';

export interface ScienceChapter {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  keyPoints: string[];
  practicals?: string[];
  examFocus?: string[];
}

export interface ScienceNavigationProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

interface ScienceLessonLayoutProps extends ScienceNavigationProps {
  sectionLabel: string;
  title: string;
  description: string;
  accent: 'emerald' | 'sky' | 'amber' | 'violet';
  chapters: ScienceChapter[];
}

const accentClasses = {
  emerald: {
    gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
    border: 'border-emerald-900',
    badge: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    activeTab: 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm',
    button: 'border-emerald-800 bg-emerald-600 hover:bg-emerald-500',
    dot: 'text-emerald-600 dark:text-emerald-400',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    gradient: 'from-sky-600 via-blue-600 to-indigo-800',
    border: 'border-sky-900',
    badge: 'bg-sky-400/30 text-white border border-sky-200/40',
    activeTab: 'bg-sky-600 border-b-4 border-sky-800 text-white shadow-sm',
    button: 'border-sky-800 bg-sky-600 hover:bg-sky-500',
    dot: 'text-sky-600 dark:text-sky-400',
    accentText: 'text-sky-600 dark:text-sky-400',
  },
  amber: {
    gradient: 'from-amber-600 via-orange-600 to-amber-800',
    border: 'border-amber-900',
    badge: 'bg-amber-400/30 text-white border border-amber-200/40',
    activeTab: 'bg-amber-600 border-b-4 border-amber-800 text-white shadow-sm',
    button: 'border-amber-800 bg-amber-600 hover:bg-amber-500',
    dot: 'text-amber-600 dark:text-amber-400',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  violet: {
    gradient: 'from-violet-600 via-purple-600 to-indigo-800',
    border: 'border-violet-900',
    badge: 'bg-violet-400/30 text-white border border-violet-200/40',
    activeTab: 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm',
    button: 'border-violet-800 bg-violet-600 hover:bg-violet-500',
    dot: 'text-violet-600 dark:text-violet-400',
    accentText: 'text-violet-600 dark:text-violet-400',
  },
};

const iconForSection = (sectionLabel: string) => {
  if (sectionLabel === 'Biology') return <Microscope className="h-6 w-6" />;
  if (sectionLabel === 'Chemistry') return <FlaskConical className="h-6 w-6" />;
  if (sectionLabel === 'Physics') return <Lightbulb className="h-6 w-6" />;
  return <Beaker className="h-6 w-6" />;
};

export const ScienceLessonLayout: React.FC<ScienceLessonLayoutProps> = ({
  sectionLabel,
  title,
  description,
  accent,
  chapters,
  nextTopicTitle,
  onNextTopic,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = chapters[activeChapterIndex];
  const isLastChapter = activeChapterIndex >= chapters.length - 1;
  const classes = accentClasses[accent];
  const chapterTabsRef = useRef<HTMLDivElement>(null);

  const goNext = () => {
    if (!isLastChapter) {
      setActiveChapterIndex((current) => current + 1);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onNextTopic?.();
  };

  useEffect(() => {
    const activeTab = chapterTabsRef.current?.querySelector<HTMLElement>(
      `[data-chapter-index="${activeChapterIndex}"]`,
    );
    activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeChapterIndex]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Duolingo Gradient Header */}
      <header className={`relative overflow-hidden bg-gradient-to-r ${classes.gradient} border-b-4 ${classes.border} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${classes.badge} shadow-xs`}>
                {sectionLabel}
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                Form 1 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                📚 {chapters.length} Chapters
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm shadow-inner">
              {iconForSection(sectionLabel)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              {title}
            </h1>
          </div>
          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            {description}
          </p>
        </div>
      </header>

      {/* Sticky Duolingo Navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div ref={chapterTabsRef} className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chapters.map((chapter, index) => (
              <button
                type="button"
                key={chapter.id}
                data-chapter-index={index}
                onClick={() => setActiveChapterIndex(index)}
                className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                  index === activeChapterIndex
                    ? classes.activeTab
                    : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 space-y-6">
        <article className="rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-5 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <NotebookTabs className={`mt-1 h-5 w-5 shrink-0 ${classes.dot}`} />
            <div>
              <p className={`text-xs font-black uppercase tracking-widest ${classes.dot}`}>{activeChapter.eyebrow}</p>
              <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{activeChapter.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">{activeChapter.summary}</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#121214] p-5 lg:col-span-2">
              <h4 className="mb-3 font-black text-slate-900 dark:text-white">Key concepts</h4>
              <div className="space-y-3">
                {activeChapter.keyPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${classes.dot}`} />
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {activeChapter.practicals && (
                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121214] p-5">
                  <h4 className="mb-3 font-black text-slate-900 dark:text-white">Practical work</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeChapter.practicals.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeChapter.examFocus && (
                <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-900/50 bg-[#fffdf5] dark:bg-amber-950/20 p-5">
                  <h4 className="mb-3 font-black text-slate-900 dark:text-amber-300">Exam focus</h4>
                  <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeChapter.examFocus.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Chapter Transition */}
        <div className="mt-10 rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {isLastChapter ? 'Section complete' : `Chapter ${activeChapterIndex + 1} of ${chapters.length}`}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
            {isLastChapter
              ? nextTopicTitle
                ? <>Ready for the next section: <span className={classes.accentText}>{nextTopicTitle}</span></>
                : 'You have completed this section.'
              : 'Ready for the next chapter?'}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {activeChapterIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveChapterIndex((c) => c - 1);
                  document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-6 py-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5"
              >
                ← Previous Chapter
              </button>
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={isLastChapter && !onNextTopic}
              className={`rounded-2xl border-2 border-b-4 ${classes.button} px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none inline-flex items-center gap-2`}
            >
              {isLastChapter ? (nextTopicTitle ? `Next Section: ${nextTopicTitle}` : 'Finished') : 'Next Chapter'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
