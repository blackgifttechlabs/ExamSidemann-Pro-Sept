import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Microscope,
  NotebookTabs,
  Sigma,
  Sparkles,
} from 'lucide-react';

/**
 * Shared lesson layout for O Level / ZJC Combined Science (Biology, Chemistry,
 * Physics). It keeps the same look as the original Form 1 science pages but
 * adds richer, fully-explained teaching content: prose explanation sections,
 * a key-words/definitions box and an equations box, on top of the original
 * key points, practical work and exam focus lists.
 */

export interface ScienceDefinition {
  term: string;
  meaning: string;
}

export interface ScienceExplanation {
  heading: string;
  /** One or more short, simple-English paragraphs that teach the idea. */
  text: string | string[];
}

export interface ScienceChapter {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  /** Main teaching content, explained simply. */
  explanations?: ScienceExplanation[];
  /** Key words a learner must know. */
  definitions?: ScienceDefinition[];
  /** Word or symbol equations to remember. */
  equations?: string[];
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
  /** e.g. "Form 3 Combined Science". Shown as the small eyebrow label. */
  formLabel?: string;
}

const accentClasses = {
  emerald: {
    badge: 'bg-emerald-100 text-emerald-700',
    active: 'bg-emerald-600 text-white shadow-emerald-200',
    dot: 'text-emerald-600',
    soft: 'bg-emerald-50 border-emerald-100',
  },
  sky: {
    badge: 'bg-sky-100 text-sky-700',
    active: 'bg-sky-600 text-white shadow-sky-200',
    dot: 'text-sky-600',
    soft: 'bg-sky-50 border-sky-100',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    active: 'bg-amber-500 text-white shadow-amber-200',
    dot: 'text-amber-600',
    soft: 'bg-amber-50 border-amber-100',
  },
  violet: {
    badge: 'bg-violet-100 text-violet-700',
    active: 'bg-violet-600 text-white shadow-violet-200',
    dot: 'text-violet-600',
    soft: 'bg-violet-50 border-violet-100',
  },
};

const iconForSection = (sectionLabel: string) => {
  if (sectionLabel === 'Biology') return <Microscope className="h-6 w-6" />;
  if (sectionLabel === 'Chemistry') return <FlaskConical className="h-6 w-6" />;
  if (sectionLabel === 'Physics') return <Lightbulb className="h-6 w-6" />;
  return <Beaker className="h-6 w-6" />;
};

const toParagraphs = (text: string | string[]) => (Array.isArray(text) ? text : [text]);

export const ScienceLessonLayout: React.FC<ScienceLessonLayoutProps> = ({
  sectionLabel,
  title,
  description,
  accent,
  chapters,
  formLabel = 'Combined Science',
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

  const goPrev = () => {
    if (activeChapterIndex === 0) return;
    setActiveChapterIndex((current) => current - 1);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const activeTab = chapterTabsRef.current?.querySelector<HTMLElement>(
      `[data-chapter-index="${activeChapterIndex}"]`,
    );
    activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeChapterIndex]);

  return (
    <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 py-8 space-y-6">
      <section className="rounded-[5px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] ${classes.badge}`}>
            {iconForSection(sectionLabel)}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{formLabel}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-3 max-w-5xl text-sm sm:text-base leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-10 -mx-[10px] border-y border-slate-200 bg-white/95 px-[5px] sm:px-6 md:px-8 py-3 backdrop-blur md:-mx-[30px] md:px-[5px] sm:px-6 md:px-8">
        <div ref={chapterTabsRef} className="flex items-center gap-2 overflow-x-auto pb-1">
          {chapters.map((chapter, index) => (
            <button
              type="button"
              key={chapter.id}
              data-chapter-index={index}
              onClick={() => setActiveChapterIndex(index)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                index === activeChapterIndex
                  ? `${classes.active} border-transparent shadow-lg`
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1.5 opacity-60">{index + 1}.</span>
              {chapter.title}
            </button>
          ))}
        </div>
      </section>

      <article className="rounded-[5px] border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <NotebookTabs className={`mt-1 h-5 w-5 shrink-0 ${classes.dot}`} />
          <div>
            <p className={`text-xs font-black uppercase tracking-widest ${classes.dot}`}>{activeChapter.eyebrow}</p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">{activeChapter.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{activeChapter.summary}</p>
          </div>
        </div>

        {activeChapter.explanations && activeChapter.explanations.length > 0 && (
          <div className="mb-6 space-y-5">
            {activeChapter.explanations.map((section) => (
              <div key={section.heading} className="rounded-[5px] border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="font-black text-slate-900">{section.heading}</h4>
                </div>
                <div className="space-y-2">
                  {toParagraphs(section.text).map((paragraph, index) => (
                    <p key={index} className="text-sm sm:text-[15px] leading-relaxed text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeChapter.definitions && activeChapter.definitions.length > 0 && (
          <div className={`mb-6 rounded-[5px] border p-4 sm:p-5 ${classes.soft}`}>
            <h4 className="mb-3 font-black text-slate-900">Key words to know</h4>
            <dl className="grid gap-3 sm:grid-cols-2">
              {activeChapter.definitions.map((definition) => (
                <div key={definition.term} className="rounded-[5px] border border-white/70 bg-white/70 p-3">
                  <dt className="text-sm font-black text-slate-900">{definition.term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-600">{definition.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {activeChapter.equations && activeChapter.equations.length > 0 && (
          <div className="mb-6 rounded-[5px] border border-slate-200 bg-[#0f172a] p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sigma className="h-4 w-4 shrink-0 text-cyan-300" />
              <h4 className="font-black text-slate-100">Equations to remember</h4>
            </div>
            <div className="space-y-2">
              {activeChapter.equations.map((equation) => (
                <p key={equation} className="rounded bg-white/5 px-3 py-2 font-mono text-sm text-cyan-100">
                  {equation}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[5px] border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
            <h4 className="mb-3 font-black text-slate-900">Key points to remember</h4>
            <div className="space-y-3">
              {activeChapter.keyPoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${classes.dot}`} />
                  <p className="text-sm leading-relaxed text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {activeChapter.practicals && (
              <div className="rounded-[5px] border border-slate-200 bg-white p-4">
                <h4 className="mb-3 font-black text-slate-900">Practical work</h4>
                <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
                  {activeChapter.practicals.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeChapter.examFocus && (
              <div className="rounded-[5px] border border-slate-200 bg-[#fffdf5] p-4">
                <h4 className="mb-3 font-black text-slate-900">Exam focus</h4>
                <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
                  {activeChapter.examFocus.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {isLastChapter ? 'Section complete' : `Chapter ${activeChapterIndex + 1} of ${chapters.length}`}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {isLastChapter
                ? nextTopicTitle
                  ? `Next Section: ${nextTopicTitle}`
                  : 'You have completed this section.'
                : 'Ready for the next chapter?'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeChapterIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isLastChapter && !onNextTopic}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
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
