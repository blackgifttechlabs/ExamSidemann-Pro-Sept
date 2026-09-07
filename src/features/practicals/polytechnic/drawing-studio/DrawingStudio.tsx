'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Crosshair,
  Eraser,
  Eye,
  EyeOff,
  Hand,
  Lightbulb,
  ListChecks,
  Moon,
  Pause,
  Pencil,
  Play,
  RotateCw,
  Ruler,
  Search,
  SkipBack,
  SkipForward,
  Sun,
  Triangle,
  X,
} from 'lucide-react';
import { DrawingBoardScene, emptyBoardState, type BoardState } from '../technical-drawing/DrawingBoardScene';
import { SheetPreview } from '../technical-drawing/SheetPreview';
import { finalMarks, type DrawTopic, type ToolId } from '../technical-drawing/drawingTopics';
import { useDrawingLesson } from '../technical-drawing/useDrawingLesson';
import { useThemeMode, type ThemeMode } from '../technical-drawing/useThemeMode';
import type { StudioCourse } from './studioTypes';
import { PracticalsDesktopSidebar } from '../../common/PracticalsDesktopSidebar';
import { practicalTopicPath, slugifyPracticalTopic } from '../../../../utils/practicalSeo';
import {
  NarrationPointerHand,
  type SceneAnchorPoints,
} from '../../common/ExperimentNarrationCaptions';

/**
 * The drawing studio, shared by every polytechnic drawing course.
 *
 * What differs between Technical Drawing and Fabrication Engineering is the
 * lessons, the copy at the top and whether the lessons are grouped into
 * categories — all of which arrive as one `StudioCourse`. The board, the
 * player, the briefing and the lesson stage are the same code for both, so a
 * fix to the pencil timing fixes it everywhere.
 *
 * Three screens on one route: pick a topic, look at the finished drawing you
 * are about to make, then stand at the board while it is drawn in front of you.
 * Nothing about the drawing is pre-rendered — the board draws the same geometry
 * the preview shows, live, with the instrument that would be in your hand.
 *
 * The board never shares space with the captions. The scene gets its own row of
 * the layout and the subtitles sit underneath it, because a caption floating
 * over the sheet covers the line the caption is describing.
 */

/** Page gutter. The content starts near the edges rather than in a column. */
const GUTTER = 'px-5';

/*
 * Orange is this subject's accent — but the Tailwind config in index.html
 * aliases `orange-500/600` to the brand violet, so those two steps are written
 * as hex (#ea580c / #f97316) throughout this file rather than quietly coming
 * back purple. Every other step (300/400/700…) is untouched by that alias and
 * is used as normal.
 */

const TOOL_META: Record<ToolId, { label: string; Icon: typeof Ruler; colour: string }> = {
  tsquare: { label: 'T-square', Icon: Ruler, colour: 'text-amber-600 dark:text-amber-300' },
  set45: { label: '45° set square', Icon: Triangle, colour: 'text-[#ea580c] dark:text-orange-300' },
  set30: { label: '30/60 set square', Icon: Triangle, colour: 'text-emerald-600 dark:text-emerald-300' },
  compass: { label: 'Compass', Icon: Compass, colour: 'text-sky-600 dark:text-sky-300' },
  pencil: { label: 'Pencil', Icon: Pencil, colour: 'text-yellow-600 dark:text-yellow-200' },
  eraser: { label: 'Eraser', Icon: Eraser, colour: 'text-rose-600 dark:text-rose-200' },
  hand: { label: 'Watch and listen', Icon: Hand, colour: 'text-slate-600 dark:text-slate-300' },
};

const LEVEL_TINT: Record<DrawTopic['level'], string> = {
  'Start here':
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200',
  Basic: 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-200',
  Core: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/40 dark:bg-rose-400/10 dark:text-rose-200',
  Exam: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200',
};

const PAGE = 'min-h-screen w-full bg-[radial-gradient(circle_at_80%_8%,#ede9fe_0%,#f8fafc_38%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_80%_8%,#2b0b50_0%,#130522_38%,#09020f_74%)] dark:text-white';

/* ------------------------------------------------------------ theme button */

function ThemeButton({ theme, onToggle }: { theme: ThemeMode; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/* ------------------------------------------------------------------- entry */

/**
 * Every screen change here slides, and it slides the way you are travelling:
 * going deeper, the old screen lifts away upwards and the new one rises from
 * below; coming back out, the whole move runs in reverse. A back button that
 * animates like a forward step makes the app feel like it lost your place.
 *
 * `mode="wait"` holds the new screen back until the old one is clear, so the
 * two never overlap — which matters when one of them is a full-bleed canvas.
 */
const CENTER_GROW = {
  initial: { scale: 0.78, opacity: 0, filter: 'blur(8px)' },
  animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
  exit: { scale: 0.9, opacity: 0, filter: 'blur(5px)' },
};
const CENTER_GROW_TIMING = { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

export function DrawingStudio({ course }: { course: StudioCourse }) {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = useMemo(
    () => course.topics.find((item) => item.id === topicId || slugifyPracticalTopic(item.title) === topicId),
    [course, topicId]
  );
  const [theme, toggleTheme] = useThemeMode();

  useEffect(() => {
    if (!topic || topicId !== topic.id) return;
    navigate(practicalTopicPath(course.basePath, topic.title), { replace: true });
  }, [course.basePath, navigate, topic, topicId]);

  const screen = !topic ? 'picker' : `stage-${topic.id}`;
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 dark:bg-[#09020f]">
      {!topic && <PracticalsDesktopSidebar activeLevelId="polytechnic" />}
      <AnimatePresence mode="wait" initial>
        <motion.div
          key={screen}
          variants={CENTER_GROW}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={CENTER_GROW_TIMING}
          className={`origin-center ${topic ? 'w-full' : 'lg:ml-[260px] lg:w-[calc(100%-260px)]'}`}
          style={{ willChange: 'transform, opacity, filter', transformOrigin: '50% 50%' }}
        >
          {!topic ? (
            <TopicPicker
              course={course}
              theme={theme}
              onToggleTheme={toggleTheme}
              onPick={(id) => {
                const selectedTopic = course.topics.find((item) => item.id === id);
                navigate(selectedTopic ? practicalTopicPath(course.basePath, selectedTopic.title) : course.basePath);
              }}
              onAccessMore={() => navigate('/pricing/')}
              onBack={() => navigate(course.backPath)}
            />
          ) : (
            <LessonStage
              topic={topic}
              theme={theme}
              onToggleTheme={toggleTheme}
              onExit={() => navigate(course.basePath)}
              onPickAnother={() => navigate(course.basePath)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==================================================================== picker */

function TopicPicker({
  course,
  onPick,
  onBack,
  onAccessMore,
  theme,
  onToggleTheme,
}: {
  course: StudioCourse;
  onPick: (id: string) => void;
  onBack: () => void;
  onAccessMore: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  /**
   * Which category is open, on a course that has them. It is local state rather
   * than a route because this is a menu, not a place — coming back out of a
   * lesson should land you on the categories, the same as the first time.
   */
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const byId = useMemo(
    () => new Map(course.topics.map((topic) => [topic.id, topic])),
    [course]
  );
  const openGroup = course.groups?.find((group) => group.id === openGroupId) ?? null;

  /** The lessons showing right now: one category's, or the whole course. */
  const shown = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const available = query
      ? course.topics
      : !course.groups
        ? course.topics
        : openGroup
          ? openGroup.topicIds.map((id) => byId.get(id)).filter((topic): topic is DrawTopic => Boolean(topic))
          : [];
    if (!query) return available;
    return available.filter((topic) => (
      `${topic.title} ${topic.subtitle} ${topic.goal} ${topic.tools.join(' ')}`.toLowerCase().includes(query)
    ));
  }, [course, openGroup, byId, searchQuery]);

  return (
    <div className={PAGE}>
      {/* Gradient hero: one big title, one short line, and the numbers that
          tell you what you are getting into. */}
      <header className="relative mx-4 mt-4 overflow-hidden rounded-[5px] bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg dark:from-orange-700 dark:to-orange-950 sm:mx-5 lg:hidden">
        {/* One hue, light to dark, with a single soft highlight — the old hero
            ran yellow to rose to purple and fought the drawings underneath. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 85% 4%, rgba(255,255,255,.20), transparent 46%)',
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-3 px-4 pb-7 pt-5 sm:px-5 sm:pb-8 sm:pt-6">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to practical labs"
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 transition hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">
              {course.eyebrow}
            </p>
            <h1 className="mt-1.5 text-[34px] font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/75 sm:text-base">
              {course.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {course.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white/90 backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white/85 transition hover:bg-white/20 hover:text-white"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main className={`py-8 ${GUTTER} lg:px-8`}>
        <section className="relative mb-6 hidden min-h-[230px] overflow-hidden rounded-[5px] border border-violet-300/20 bg-[radial-gradient(circle_at_82%_18%,rgba(251,191,36,.28),transparent_25%),linear-gradient(120deg,#35105d,#551584_48%,#17245c)] px-9 py-8 text-white shadow-[0_24px_60px_rgba(8,0,28,.38)] lg:flex lg:items-center">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:34px_34px]" />
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Polytechnic practicals"
            className="absolute left-6 top-5 z-20 inline-flex items-center gap-2 rounded-[5px] border border-white/20 bg-black/20 px-3 py-2 text-xs font-black text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="relative z-10 mt-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-amber-200">{course.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight xl:text-5xl">{course.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">{course.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {course.chips.slice(0, 3).map((chip) => <span key={chip} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">{chip}</span>)}
            </div>
          </div>
          <Compass className="absolute right-[8%] h-32 w-32 text-amber-200/25" />
        </section>
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500" size={17} />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Search ${course.title} drawings`}
            aria-label={`Search ${course.title} drawings`}
            className="h-12 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-11 text-sm font-semibold text-slate-900 outline-none shadow-sm transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.055] dark:text-white dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[5px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
              <X size={15} />
            </button>
          )}
        </div>
        {/* ------------------------------------------------ category cards */}
        {course.groups && !openGroup && !searchQuery.trim() && (
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Choose a category
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-5 lg:grid-cols-3">
              {course.groups.map((group) => {
                const topics = group.topicIds
                  .map((id) => byId.get(id))
                  .filter((topic): topic is DrawTopic => Boolean(topic));
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      onClick={() => setOpenGroupId(group.id)}
                      className="group flex aspect-square h-full w-full flex-col overflow-hidden rounded-[5px] border border-violet-200 bg-white text-left shadow-[0_14px_36px_rgba(76,29,149,.1)] transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-[0_20px_42px_rgba(76,29,149,.16)] dark:border-violet-300/15 dark:bg-white/[0.055] dark:shadow-[0_14px_36px_rgba(0,0,0,.24)] dark:hover:border-amber-300/40 dark:hover:shadow-[0_20px_42px_rgba(0,0,0,.34)] lg:aspect-auto"
                    >
                      {/* Three of the category's own drawings, so the card shows
                          what is inside it rather than an icon standing in. */}
                      <span className={`flex h-[54%] gap-1 p-1.5 sm:p-2 ${group.tile}`}>
                        {topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic.id}
                            className="min-w-0 flex-1 overflow-hidden rounded-md bg-slate-100 p-0.5 dark:bg-slate-200/95"
                          >
                            <SheetPreview marks={finalMarks(topic)} maxWidth={420} label="" />
                          </span>
                        ))}
                      </span>

                      <span className="flex flex-1 flex-col p-3 sm:p-4">
                        <span className="flex items-start gap-2.5">
                          <span className="line-clamp-2 min-w-0 flex-1 text-base font-black leading-snug sm:text-xl xl:text-2xl">
                            {group.title}
                          </span>
                        </span>
                        <span className="mt-3 flex items-center gap-2">
                          <span className="rounded-full border border-orange-300 bg-orange-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700 dark:border-orange-400/40 dark:bg-orange-400/10 dark:text-orange-200">
                            {topics.length} {topics.length === 1 ? 'drawing' : 'drawings'}
                          </span>
                          <ChevronRight size={16} className="ml-auto text-slate-300 dark:text-slate-600" />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ------------------------------------------------------- lessons */}
        {(!course.groups || openGroup || searchQuery.trim()) && (
          <section>
            {searchQuery.trim() ? (
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Search results</h2>
                <span className="text-xs font-bold text-slate-400">{shown.length} found</span>
              </div>
            ) : openGroup ? (
              <div className="flex flex-wrap items-baseline gap-3">
                <button
                  type="button"
                  onClick={() => setOpenGroupId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft size={14} /> All categories
                </button>
                <h2 className="text-[15px] font-black">{openGroup.title}</h2>
                <p className="w-full text-xs text-slate-500">{openGroup.blurb}</p>
              </div>
            ) : (
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Choose what to learn
              </h2>
            )}
            {/* A phone gets one quiet card per lesson: drawing, title, one line
                about it. The level, the minutes and the step count are detail for
                a bigger screen — on a phone they only crowd the list. From `sm` up
                the same markup reflows into the card grid. */}
            {shown.length === 0 && searchQuery.trim() ? (
              <div className="mt-3 rounded-[5px] border border-dashed border-slate-300 bg-white/60 py-14 text-center dark:border-white/10 dark:bg-white/[0.025]">
                <Search className="mx-auto text-slate-300" size={26} />
                <p className="mt-3 text-sm font-black">No drawings match “{searchQuery.trim()}”</p>
              </div>
            ) : (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((topic) => (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => onPick(topic.id)}
                    className="group flex aspect-square h-full w-full flex-col items-stretch gap-0 overflow-hidden rounded-[5px] border border-violet-200 bg-white p-0 text-left shadow-[0_12px_30px_rgba(76,29,149,.1)] transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-[0_18px_38px_rgba(76,29,149,.16)] dark:border-violet-300/15 dark:bg-white/[0.055] dark:shadow-[0_12px_30px_rgba(0,0,0,.22)] dark:hover:border-amber-300/40 dark:hover:shadow-[0_18px_38px_rgba(0,0,0,.34)] lg:aspect-auto"
                  >
                    <span className="relative block h-[62%] w-full shrink-0 overflow-hidden bg-slate-100 p-1 dark:bg-slate-200/95 sm:p-2">
                      <SheetPreview
                        marks={finalMarks(topic)}
                        maxWidth={760}
                        label={`Finished drawing: ${topic.title}`}
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                      <span className="flex items-center gap-2 sm:items-start sm:gap-2.5">
                        {/* Two lines: several titles start the same way and a
                            single truncated line made them indistinguishable. */}
                        <span className="line-clamp-2 min-w-0 flex-1 text-base font-black leading-snug sm:text-xl">
                          {topic.title}
                        </span>
                      </span>
                      <span className="mt-2.5 hidden flex-wrap items-center gap-2 sm:flex">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${LEVEL_TINT[topic.level]}`}>
                          {topic.level}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <Clock size={11} /> {topic.minutes} min
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <ListChecks size={11} /> {topic.steps.length} steps
                        </span>
                      </span>
                    </span>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-slate-300 dark:text-slate-600 sm:hidden"
                    />
                  </button>
                </li>
              ))}

              {/* Last tile in the same grid: the lessons above are what the free
                  plan covers, this is the way past them. */}
              {!searchQuery.trim() && <li>
                <button
                  type="button"
                  onClick={onAccessMore}
                  aria-label={`Access all ${course.topics.length} drawings`}
                  className="group relative flex aspect-square h-full w-full flex-col overflow-hidden rounded-[5px] border border-fuchsia-200 bg-fuchsia-50 p-4 text-left shadow-[0_14px_36px_rgba(162,28,175,.12)] transition hover:-translate-y-0.5 hover:border-fuchsia-400 hover:shadow-[0_20px_42px_rgba(162,28,175,.18)] dark:border-fuchsia-300/20 dark:bg-[radial-gradient(circle_at_76%_12%,rgba(232,121,249,.22),transparent_30%),linear-gradient(145deg,#341044,#181020)] dark:shadow-[0_14px_36px_rgba(0,0,0,.28)] dark:hover:border-fuchsia-300/45 dark:hover:shadow-[0_20px_42px_rgba(0,0,0,.38)] sm:p-6 lg:aspect-auto"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-gradient-to-br from-fuchsia-500 to-violet-700 text-lg text-white shadow-[0_4px_0_#5b168c] sm:h-12 sm:w-12 sm:text-xl">✦</span>
                  <span className="mt-3 block text-base font-black leading-tight text-slate-900 dark:text-white sm:mt-6 sm:text-xl">More drawing lessons</span>
                  <span className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-white/50 sm:block">Unlock the complete guided drawing library.</span>
                  <span className="mt-auto pt-2 text-xs font-black text-amber-300 sm:pt-6 sm:text-sm">From $4.80/month</span>
                  <span className="mt-2 flex w-full items-center justify-center rounded-[5px] bg-gradient-to-r from-orange-500 to-red-500 py-2 text-xs font-black text-white shadow-[0_4px_0_#9a3412] transition group-hover:brightness-110 sm:mt-3 sm:py-3 sm:text-sm">View plans</span>
                </button>
              </li>}
            </ul>
            )}
          </section>
        )}

        {/* Down here rather than up top: which trades sit the subject is useful
            context, but it is not what anybody opened the page to find. */}
        {course.footer && (
          <section className="mt-12 border-t border-slate-200 pt-7 dark:border-white/10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              {course.footer.heading}
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs text-slate-500">{course.footer.blurb}</p>
            {/* One rail, scrolled sideways. Twelve courses wrapped over four lines
                took up a whole screen on a phone. */}
            <ul className="course-rail -mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 pb-1">
              {course.footer.items.map((item) => (
                <li
                  key={item.short}
                  title={item.note}
                  className="shrink-0 snap-start whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  {item.name}
                  {item.short !== item.name && (
                    <span className="ml-1.5 text-[#c2410c] dark:text-orange-300/70">{item.short}</span>
                  )}
                </li>
              ))}
            </ul>
            <style>{`
              .course-rail { scrollbar-width: none; -ms-overflow-style: none; }
              .course-rail::-webkit-scrollbar { display: none; }
            `}</style>
          </section>
        )}
      </main>
    </div>
  );
}


/* ================================================================= briefing */

function TopicBriefing({
  topic,
  onStart,
  onBack,
  theme,
  onToggleTheme,
}: {
  topic: DrawTopic;
  onStart: () => void;
  onBack: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const sheet = useMemo(() => finalMarks(topic), [topic]);

  return (
    <div className={PAGE}>
      <div className={`py-6 sm:py-8 ${GUTTER}`}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={15} /> All drawing topics
          </button>
          <ThemeButton theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="mt-5 grid gap-7 lg:grid-cols-[1.3fr_1fr]">
          {/* What you are aiming at. Seeing the finished sheet first is how a
              lecturer actually starts the lesson. */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-200/95 p-3 shadow-lg dark:border-white/10">
              <SheetPreview marks={sheet} label={`Finished drawing: ${topic.title}`} />
            </div>
            <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              This is what you are going to draw
            </p>
          </div>

          <div className="flex flex-col">
            <span className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${LEVEL_TINT[topic.level]}`}>
              {topic.level}
            </span>
            <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{topic.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{topic.goal}</p>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <dt className="text-[10px] font-black uppercase tracking-wider text-slate-500">Steps</dt>
                <dd className="mt-1 text-xl font-black">{topic.steps.length}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <dt className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bench time</dt>
                <dd className="mt-1 text-xl font-black">{topic.minutes} min</dd>
              </div>
            </dl>

            <h2 className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Get these ready</h2>
            <ul className="mt-2 space-y-1.5">
              {topic.tools.map((tool) => (
                <li key={tool} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                  {tool}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">The steps</h2>
            <ol className="mt-2 space-y-1">
              {topic.steps.map((step, index) => (
                <li key={step.id} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-5 shrink-0 text-right text-xs font-black tabular-nums text-slate-400 dark:text-slate-600">
                    {index + 1}
                  </span>
                  {step.title}
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={onStart}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#ea580c] px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-[#f97316]"
            >
              <Play size={17} /> Start at the board
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Every step is spoken and captioned. You can pause or repeat any step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== stage */

function LessonStage({
  topic,
  onExit,
  onPickAnother,
  theme,
  onToggleTheme,
}: {
  topic: DrawTopic;
  onExit: () => void;
  /** Leaves this lesson entirely and goes back to the list of topics. */
  onPickAnother: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const lesson = useDrawingLesson(topic);
  const stateRef = useRef<BoardState>(emptyBoardState());
  const anchorsRef = useRef<SceneAnchorPoints>({});
  const [ghost, setGhost] = useState(false);
  const [autoFrame, setAutoFrame] = useState(true);
  const [railOpen, setRailOpen] = useState(false);
  /** Desktop only: the rail can be folded away to give the board the width. */
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [tipOpen, setTipOpen] = useState(true);
  const sheet = useMemo(() => finalMarks(topic), [topic]);

  // The scene reads this ref inside its frame loop, so the canvas subtree never
  // re-renders even though this component does, 60 times a second.
  stateRef.current = {
    marks: lesson.marks,
    drawing: lesson.drawing,
    fresh: lesson.stepMarks,
    ghost: ghost ? sheet : null,
    tool: lesson.step.tool,
    teeY: lesson.step.teeY,
    // The opening, the camera and any warning come from the line being spoken,
    // falling back to the step's own settings between lines.
    compassRadius: lesson.cue.compassRadius,
    focus: lesson.cue.focus,
    alert: lesson.cue.alert ?? null,
    focusPoint: lesson.focusPoint,
    revision: lesson.stepIndex + (ghost ? 10000 : 0),
  };

  // Pressing Start means start — the board begins as soon as the stage mounts.
  const playRef = useRef(lesson.play);
  playRef.current = lesson.play;
  useEffect(() => playRef.current(), []);

  // Every step returns to the shared teaching view and resumes following its
  // active mark, even if the learner rotated the board during the previous
  // step. They can still drag away from it again whenever they want.
  useEffect(() => {
    setAutoFrame(true);
  }, [lesson.stepIndex]);

  const tool = TOOL_META[lesson.step.tool];

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-100 text-slate-900 dark:bg-[#070b16] dark:text-white">
      {/* ------------------------------------------------------------ header */}
      <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 dark:border-orange-300/12 dark:bg-[linear-gradient(90deg,rgba(22,15,10,.98),rgba(30,20,13,.96),rgba(19,13,9,.98))] sm:gap-3 sm:px-5">
        <button
          type="button"
          onClick={onExit}
          aria-label="Back to all drawing topics"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xs font-black leading-tight sm:text-sm">{topic.title}</h1>
          <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#c2410c] dark:text-orange-300/80">
            Step {lesson.stepIndex + 1} of {lesson.stepCount} · {lesson.step.title}
          </p>
        </div>

        <span
          className={`hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide dark:border-white/12 dark:bg-white/[0.05] sm:inline-flex ${tool.colour}`}
        >
          <tool.Icon size={13} /> {tool.label}
        </span>

        <button
          type="button"
          onClick={() => setGhost((on) => !on)}
          aria-pressed={ghost}
          title="Show the finished drawing faintly underneath"
          className={`grid h-9 w-9 place-items-center rounded-full border transition ${
            ghost
              ? 'border-cyan-400 bg-cyan-50 text-cyan-600 dark:border-cyan-300/50 dark:bg-cyan-400/15 dark:text-cyan-200'
              : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {ghost ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        <button
          type="button"
          onClick={() => setAutoFrame(true)}
          disabled={autoFrame}
          title="Recentre the board"
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 disabled:opacity-35 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white"
        >
          <Crosshair size={16} />
        </button>

        <ThemeButton theme={theme} onToggle={onToggleTheme} />

        <button
          type="button"
          onClick={() => setRailOpen((open) => !open)}
          aria-label="Show all steps"
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white lg:hidden"
        >
          <ListChecks size={16} />
        </button>

        {/* Fold the steps rail away when the drawing needs the whole width. */}
        <button
          type="button"
          onClick={() => setRailCollapsed((collapsed) => !collapsed)}
          aria-pressed={railCollapsed}
          title={railCollapsed ? 'Show the steps rail' : 'Hide the steps rail'}
          className="hidden h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900 dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-white lg:grid"
        >
          <ChevronRight
            size={16}
            className={`transition-transform ${railCollapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </header>

      {/* --------------------------------------- steps + board + transcript */}
      <div className="relative flex min-h-0 flex-1">
        <StepRail
          lesson={lesson}
          open={railOpen}
          collapsed={railCollapsed}
          onClose={() => setRailOpen(false)}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          {/* The board owns this row alone — nothing is ever drawn over it. */}
          <div className="relative min-h-0 flex-1" onPointerDown={() => setAutoFrame(false)}>
            <div className="absolute inset-0">
              <DrawingBoardScene
                stateRef={stateRef}
                anchorsRef={anchorsRef}
                autoFrame={autoFrame}
                theme={theme}
              />
            </div>

            {/* Mobile captions positioned on the grey area under the top header bar */}
            <MobileDrawingCaptions lesson={lesson} />

            {/* The tip folds away to a button: it is worth reading once, and
                after that it is just a card sitting on the drawing. */}
            {lesson.step.tip && (
              <div className="absolute right-3 top-3 hidden md:block">
                {tipOpen ? (
                  <aside className="w-72 rounded-2xl border border-amber-300 bg-white/95 p-3.5 shadow-lg backdrop-blur-xl dark:border-amber-300/25 dark:bg-slate-950/85">
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300/90">
                        <Lightbulb size={12} /> Remember this
                      </p>
                      <button
                        type="button"
                        onClick={() => setTipOpen(false)}
                        aria-label="Hide the tip"
                        className="-mr-1 -mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                    <p className="mt-1.5 text-[13px] font-semibold leading-snug text-amber-900 dark:text-amber-50">
                      {lesson.step.tip}
                    </p>
                  </aside>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTipOpen(true)}
                    aria-label="Show the tip for this step"
                    className="grid h-9 w-9 place-items-center rounded-full border border-amber-300 bg-white/95 text-amber-600 shadow-lg backdrop-blur transition hover:bg-amber-50 dark:border-amber-300/25 dark:bg-slate-950/85 dark:text-amber-300"
                  >
                    <Lightbulb size={16} />
                  </button>
                )}
              </div>
            )}

            {lesson.finished && (
              <FinishedCard topic={topic} onReplay={lesson.restart} onPickAnother={onPickAnother} />
            )}
          </div>

          {/* The scrubber and transport controls now occupy the old caption
              row, exactly where the learner's hand naturally reaches. */}
          <Controls lesson={lesson} />
        </div>

        <TranscriptRail lesson={lesson} />
      </div>

      <NarrationPointerHand playback={lesson.playback} sceneAnchorsRef={anchorsRef} />
    </div>
  );
}

/* ----------------------------------------------------------------- step rail */

function StepRail({
  lesson,
  open,
  collapsed,
  onClose,
}: {
  lesson: ReturnType<typeof useDrawingLesson>;
  open: boolean;
  /** Folded away on desktop; the drawer state is separate. */
  collapsed: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`absolute inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white/95 p-2.5 backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-slate-950/85 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'lg:hidden' : ''}`}
    >
      <p className="px-1.5 pb-2 pt-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">The steps</p>
      <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {lesson.topic.steps.map((step, index) => {
          const done = index < lesson.stepIndex || lesson.finished;
          const current = index === lesson.stepIndex;
          const meta = TOOL_META[step.tool];
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => {
                  lesson.goTo(index);
                  onClose();
                }}
                className={`flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition ${
                  current
                    ? 'bg-orange-100 ring-1 ring-orange-400 dark:bg-orange-400/20 dark:ring-orange-400/40'
                    : 'hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black ${
                    done
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300'
                      : current
                        ? 'bg-orange-200 text-orange-700 dark:bg-orange-400/25 dark:text-orange-200'
                        : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                  }`}
                >
                  {done ? '✓' : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[12px] font-bold leading-snug ${
                      current ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className={`mt-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide ${meta.colour}`}>
                    <meta.Icon size={10} /> {meta.label}
                  </span>
                </span>
              </button>
              {current && (
                <div className="mx-2 mt-1 h-0.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#f97316] transition-[width] duration-100"
                    style={{ width: `${Math.round(lesson.progress * 100)}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/* ---------------------------------------------------------- transcript rail */

/**
 * The lesson script runs upward like restrained film credits. Silent lessons
 * use the lesson clock for a continuous slow roll; recorded lessons lock the
 * active sentence to the vertical reading position, so seeking or pausing the
 * audio keeps the words and drawing together.
 */
function TranscriptRail({ lesson }: { lesson: ReturnType<typeof useDrawingLesson> }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef(new Map<string, HTMLLIElement>());
  const lines = useMemo(
    () => lesson.topic.steps.flatMap((step, stepIndex) =>
      step.lines.map((line, lineIndex) => ({
        id: `${step.id}-${lineIndex}`,
        text: line.text,
        stepIndex,
        lineIndex,
      }))
    ),
    [lesson.topic]
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (!lesson.hasAudio) {
      const maximum = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
      viewport.scrollTop = maximum * lesson.overallProgress;
      return;
    }

    const active = lineRefs.current.get(`${lesson.step.id}-${Math.max(0, lesson.lineIndex)}`);
    if (!active) return;
    const readingLine = viewport.clientHeight * 0.38;
    viewport.scrollTo({
      top: Math.max(0, active.offsetTop - readingLine),
      behavior: lesson.playing ? 'smooth' : 'auto',
    });
  }, [lesson.hasAudio, lesson.lineIndex, lesson.overallProgress, lesson.playing, lesson.step.id]);

  const activeId = `${lesson.step.id}-${lesson.lineIndex}`;

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/90 md:flex xl:w-80">
      <div className="border-b border-slate-200 px-5 py-3 dark:border-white/10">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c2410c] dark:text-orange-300">
          Lesson transcript
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          {lesson.hasAudio ? 'Following the narration' : 'Scrolling with the drawing'}
        </p>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white to-transparent dark:from-slate-950" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-white to-transparent dark:from-slate-950" />
        <div
          ref={viewportRef}
          className="h-full overflow-y-hidden px-5"
          aria-live="polite"
          aria-label="Lesson transcript"
        >
          <ol className="space-y-5 py-[38%]">
            {lines.map((line) => {
              const active = line.id === activeId;
              const passed = line.stepIndex < lesson.stepIndex || (
                line.stepIndex === lesson.stepIndex && line.lineIndex < lesson.lineIndex
              );
              return (
                <li
                  key={line.id}
                  ref={(node) => {
                    if (node) lineRefs.current.set(line.id, node);
                    else lineRefs.current.delete(line.id);
                  }}
                  className={`border-l-2 pl-3 text-[13px] leading-6 transition-colors duration-300 ${
                    active
                      ? 'border-[#ea580c] font-bold text-slate-950 dark:text-white'
                      : passed
                        ? 'border-transparent text-slate-300 dark:text-slate-700'
                        : 'border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {line.text}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </aside>
  );
}

/* --------------------------------------------------------- mobile captions */

function MobileDrawingCaptions({ lesson }: { lesson: ReturnType<typeof useDrawingLesson> }) {
  const line = lesson.playback.line;
  const fallbackLine = lesson.step.lines[Math.max(0, lesson.lineIndex)] ?? lesson.step.lines[0];
  const activeLine = line ?? (fallbackLine ? { text: fallbackLine.text, words: [] } : null);

  if (!activeLine || !activeLine.text) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2.5 z-20 flex justify-center px-3 md:hidden">
      <div className="w-full max-w-md rounded-xl border border-black/10 bg-white/90 px-3.5 py-2 text-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/15 dark:bg-slate-950/85">
        <p className="text-balance text-xs font-bold leading-snug tracking-tight text-slate-800 dark:text-slate-100">
          {line && line.words.length > 0 ? (
            line.words.map((word, index) => (
              <span
                key={`${word.t}-${index}`}
                className={
                  index === lesson.playback.wordIndex
                    ? 'rounded bg-[#ea580c]/20 px-0.5 text-[#c2410c] dark:bg-orange-400/25 dark:text-orange-200'
                    : index < lesson.playback.wordIndex
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                }
              >
                {word.w}
                {index < line.words.length - 1 ? ' ' : ''}
              </span>
            ))
          ) : (
            <span>{activeLine.text}</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ controls */

function Controls({
  lesson,
  className = '',
}: {
  lesson: ReturnType<typeof useDrawingLesson>;
  className?: string;
}) {
  const progress = Math.round((lesson.finished ? 1 : lesson.overallProgress) * 1000);
  const progressPercent = progress / 10;

  const cycleSpeed = () => {
    const SPEEDS = [1, 1.25, 1.5, 2];
    const currentIndex = SPEEDS.findIndex((s) => Math.abs(s - lesson.speed) < 0.05);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % SPEEDS.length;
    lesson.setSpeed(SPEEDS[nextIndex]);
  };

  return (
    <div
      className={`shrink-0 border-t border-black/10 bg-[#ededed] text-black ${className}`}
    >
      <div className="relative mx-5 h-5 pt-3 sm:mx-8">
        <span
          className="pointer-events-none absolute inset-x-0 top-3 h-1 rounded-full"
          style={{
            background: `linear-gradient(to right, #ff1744 0%, #ff1744 ${progressPercent}%, #202020 ${progressPercent}%, #202020 100%)`,
          }}
        />
        <input
          type="range"
          min={0}
          max={1000}
          value={progress}
          onChange={(event) => lesson.seekOverall(Number(event.currentTarget.value) / 1000)}
          aria-label="Move through the drawing"
          className="absolute inset-x-0 top-1.5 h-4 w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="mx-auto flex w-full max-w-lg items-center justify-between px-5 pb-3 pt-1 sm:px-8 sm:pb-4">
        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed: ${lesson.speed}x. Click to change`}
          title={`Playback speed (${lesson.speed}x)`}
          className="grid h-11 w-11 place-items-center rounded-full text-black transition hover:bg-black/5 active:scale-90"
        >
          <span className="text-[13px] font-black tracking-tight">{lesson.speed}×</span>
        </button>

        <button
          type="button"
          onClick={lesson.previous}
          disabled={lesson.stepIndex === 0}
          aria-label="Previous step"
          className="grid h-11 w-11 place-items-center rounded-full text-black transition hover:bg-black/5 active:scale-90 disabled:opacity-25"
        >
          <SkipBack size={27} strokeWidth={2.8} />
        </button>

        <button
          type="button"
          onClick={lesson.toggle}
          aria-label={lesson.playing ? 'Pause' : 'Play'}
          className="grid h-16 w-16 place-items-center rounded-full bg-black text-white shadow-sm transition hover:scale-[1.03] active:scale-95"
        >
          {lesson.playing ? <Pause size={27} fill="currentColor" /> : <Play size={27} fill="currentColor" className="translate-x-[2px]" />}
        </button>

        <button
          type="button"
          onClick={lesson.next}
          disabled={lesson.finished}
          aria-label="Next step"
          className="grid h-11 w-11 place-items-center rounded-full text-black transition hover:bg-black/5 active:scale-90 disabled:opacity-25"
        >
          <SkipForward size={27} strokeWidth={2.8} />
        </button>

        <button
          type="button"
          onClick={() => lesson.skipBy(5000)}
          aria-label="Skip forward 5 seconds"
          title="Skip forward 5 seconds"
          className="relative grid h-11 w-11 place-items-center rounded-full text-black transition hover:bg-black/5 active:scale-90"
        >
          <RotateCw size={24} strokeWidth={2.4} />
          <span className="absolute text-[9px] font-black tracking-tighter">5</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ finished */

function FinishedCard({
  topic,
  onReplay,
  onPickAnother,
}: {
  topic: DrawTopic;
  onReplay: () => void;
  /** Straight out to the topic list — the button says another topic, so it
   *  must offer the topics, not drop back onto this one's briefing. */
  onPickAnother: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-emerald-300 bg-white/95 p-5 text-center shadow-2xl backdrop-blur-xl dark:border-emerald-300/30 dark:bg-slate-950/92">
        <CheckCircle2 size={34} className="mx-auto text-emerald-500" />
        <h2 className="mt-2.5 text-lg font-black">Drawing finished</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          That is {topic.title.toLowerCase()} complete. Now do it on real paper — the board teaches your hands,
          not just your head.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onReplay}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-slate-700 transition hover:bg-slate-100 dark:border-white/12 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
          >
            Watch again
          </button>
          <button
            type="button"
            onClick={onPickAnother}
            className="flex-1 rounded-xl bg-[#ea580c] px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#f97316]"
          >
            Another topic
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawingStudio;
