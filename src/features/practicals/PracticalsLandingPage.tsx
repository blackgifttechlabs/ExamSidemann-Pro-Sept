import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Search,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEVELS, REVEAL_STYLES, useScrollReveal } from './practicalsCatalog';
import { polytechnicPracticalPath } from '../../utils/practicalSeo';
import { canonicalPathFor } from '../../utils/siteUrl';
import {
  HeroEdgeLight,
  HeroGridPaper,
  HeroLabMotif,
} from './common/PracticalsHeroChrome';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';

/** Rows shown per subject before "Show more" — a full grid row on each layout. */
const PREVIEW_COUNT = 4;
const PREVIEW_COUNT_WIDE = 4;

/** Tracks a media query so the preview count matches the number of columns. */
const useMediaQuery = (query: string) => {
  const [matched, setMatched] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatched(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matched;
};

const BROWSING_STATE_KEY = 'practicals-landing-state';

interface BrowsingState {
  levelId: string;
  expanded: Record<string, boolean>;
  scrollY: number;
}

/**
 * The page remembers which level, search and open sections the learner left it
 * on, plus how far down they had scrolled, so coming back from an experiment
 * drops them exactly where they were rather than at the top of a reset page.
 */
const readBrowsingState = (): BrowsingState | null => {
  try {
    const raw = sessionStorage.getItem(BROWSING_STATE_KEY);
    return raw ? (JSON.parse(raw) as BrowsingState) : null;
  } catch {
    return null;
  }
};

const writeBrowsingState = (state: BrowsingState) => {
  try {
    sessionStorage.setItem(BROWSING_STATE_KEY, JSON.stringify(state));
  } catch {
    /* private mode or a full quota — losing the position is not worth an error */
  }
};

const matches = (query: string, ...fields: string[]) =>
  fields.some((field) => field.toLowerCase().includes(query));

/** How far the page has to travel before letting go commits to the next level. */
const COMMIT_RATIO = 0.25;
/** …or a flick this fast, however short. */
const FLICK_VELOCITY = 0.45; // px per ms
/** How long the track takes to settle once the finger lets go. */
const SLIDE_MS = 280;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

interface TabRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** What the catalogue actually holds, counted rather than claimed. */
const LIBRARY_STATS = (() => {
  const subjects = LEVELS.reduce((total, item) => total + item.categories.length, 0);
  const experiments = LEVELS.reduce(
    (total, item) =>
      total +
      item.categories.reduce((sum, category) => sum + category.experiments.length, 0),
    0
  );
  return [
    { label: 'Experiments', value: experiments },
    { label: 'Subjects', value: subjects },
    { label: 'Levels', value: LEVELS.length },
  ];
})();

/** New artwork filenames documented in PRACTICALS_PAGE_IMAGE_PROMPTS.md. The
 * current catalogue image is retained as an automatic fallback until each new
 * file is generated and placed in public/images/prac. */
const promptedCategoryImage = (id: string) => {
  if (id.includes('biology')) return '/images/prac/biology-game-card.webp';
  if (id.includes('physics')) return '/images/prac/physics-game-card.webp';
  if (id.includes('chemistry')) return '/images/prac/chemistry-game-card.webp';
  if (id.includes('combined-science')) return '/images/prac/combined-science-game-card.webp';
  if (id.includes('computer-science') || id === 'poly-it') return '/images/prac/computer-science-game-card.webp';
  if (id.includes('drawing') || id.includes('fabrication')) return '/images/prac/polytechnic-workshop-game-card.webp';
  return undefined;
};

const DesktopFeaturedLab: React.FC<{
  level: (typeof LEVELS)[number];
  onOpen: (route: string) => void;
}> = ({ level, onOpen }) => {
  const category = level.categories.find((item) => item.experiments.length > 0);
  const featured = category?.experiments[0];
  if (!category || !featured) return null;

  return (
    <section className="relative hidden min-h-[200px] overflow-hidden rounded-[28px] border border-violet-300/20 bg-[radial-gradient(circle_at_75%_25%,rgba(34,211,238,.34),transparent_28%),linear-gradient(115deg,#21073e_0%,#4c1380_48%,#17225f_100%)] shadow-[0_26px_70px_rgba(10,0,35,.42),inset_0_1px_0_rgba(255,255,255,.13)] lg:block">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:linear-gradient(to_right,black,transparent_78%)]" />
      <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[38px] border-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,.3)]" />
      <div className="absolute bottom-[-82px] right-[8%] h-52 w-52 rotate-12 rounded-[38px] bg-gradient-to-br from-cyan-300/25 to-fuchsia-500/20 shadow-[0_0_60px_rgba(34,211,238,.22)]" />

      {/* Optional generated artwork. The CSS laboratory remains complete when
          this file has not yet been created from the supplied prompt. */}
      <img
        src="/images/prac/practicals-feature-hero.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[54%] object-cover object-center [mask-image:linear-gradient(to_right,transparent_0%,black_32%)]"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
      />

      <div className="relative z-10 flex min-h-[200px] max-w-[680px] flex-col justify-center px-10 py-7">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-200"><Sparkles size={16} /> Featured practical</div>
        <h2 className="mt-2 text-3xl font-black leading-[1.04] tracking-tight text-white xl:text-4xl">Enter the virtual lab. <span className="text-cyan-300">Learn by doing.</span></h2>
        <p className="mt-2 max-w-xl truncate text-sm text-white/68">{featured.title}: {featured.blurb}</p>
        <button
          onClick={() => onOpen(level.id === 'polytechnic' ? polytechnicPracticalPath(category.route, featured.route, featured.title) : featured.route)}
          className="mt-4 flex w-fit items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-3 text-sm font-black uppercase tracking-wide text-[#2b1537] shadow-[0_6px_0_#b45309,0_12px_24px_rgba(245,158,11,.24)] transition hover:-translate-y-0.5 active:translate-y-[4px] active:shadow-[0_3px_0_#b45309]"
        >
          <Play size={18} fill="currentColor" /> Start practical
        </button>
      </div>
    </section>
  );
};

export const PracticalsLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const openRoute = (route: string) => navigate(canonicalPathFor(route));
  const restored = useRef(readBrowsingState()).current;
  const [levelId, setLevelId] = useState(restored?.levelId ?? LEVELS[0].id);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    restored?.expanded ?? {}
  );

  const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[0];
  const search = query.trim().toLowerCase();

  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggestions look across the whole level, not just the sections on screen.
  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    return level.categories
      .flatMap((category) =>
        category.experiments
          .filter((experiment) => matches(search, experiment.title, experiment.blurb))
          .map((experiment) => ({ experiment, category }))
      )
      .slice(0, 8);
  }, [level, search]);

  const showSuggestions = suggestionsOpen && suggestions.length > 0;

  // Clicking anywhere else closes the panel.
  useEffect(() => {
    if (!showSuggestions) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [showSuggestions]);

  const changeLevel = (id: string) => {
    setLevelId(id);
    setExpanded({});
    setQuery('');
    setSuggestionsOpen(false);
  };

  const wideLayout = useMediaQuery('(min-width: 768px)');
  const previewCount = wideLayout ? PREVIEW_COUNT_WIDE : PREVIEW_COUNT;

  const contentRef = useRef<HTMLDivElement>(null);

  // ── Swiping between levels ───────────────────────────────────────────────
  // The levels sit side by side on one track: the neighbouring level is drawn
  // just off screen, so a swipe pulls it straight into view with nothing blank
  // in between. The content follows the finger pixel for pixel and the white
  // pill in the tab bar slides the matching fraction of the way across.
  const levelIndex = LEVELS.findIndex((item) => item.id === level.id);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabNodes = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabRects, setTabRects] = useState<TabRect[]>([]);
  /** How far the content is pushed sideways, in px. */
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  /** Set while the page is animating itself across, rather than following a finger. */
  const [sliding, setSliding] = useState(false);
  /** The level being animated to, so the pill leads the way instead of lagging. */
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const slideTimers = useRef<number[]>([]);

  // The pill is drawn from the real button boxes, so it fits every label.
  useEffect(() => {
    const measure = () =>
      setTabRects(
        tabNodes.current.map((node) => ({
          left: node?.offsetLeft ?? 0,
          top: node?.offsetTop ?? 0,
          width: node?.offsetWidth ?? 0,
          height: node?.offsetHeight ?? 0,
        }))
      );
    measure();
    const observer = new ResizeObserver(measure);
    if (tabsRef.current) observer.observe(tabsRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(
    () => () => {
      slideTimers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  /** Switches level immediately; the incoming catalogue grows from its centre. */
  const slideToIndex = (nextIndex: number) => {
    if (nextIndex === levelIndex || !LEVELS[nextIndex]) return;

    slideTimers.current.forEach((id) => window.clearTimeout(id));
    slideTimers.current = [];

    setDragging(false);
    setSliding(false);
    setOffset(0);
    setPendingIndex(null);
    changeLevel(LEVELS[nextIndex].id);
  };

  // The gesture listeners are attached once per level, so they reach the slide
  // through a ref rather than being torn down on every render.
  const slideRef = useRef(slideToIndex);
  slideRef.current = slideToIndex;

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let axis: 'undecided' | 'x' | 'y' = 'undecided';
    let active = false;
    let lastDx = 0;

    const canReach = (direction: number) =>
      Boolean(LEVELS[levelIndex + direction]);

    // Past the first and last level there is nowhere to go, so the page only
    // gives a little and springs back.
    const resist = (dx: number) => (canReach(dx < 0 ? 1 : -1) ? dx : dx * 0.25);

    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      active = true;
      axis = 'undecided';
      lastDx = 0;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startTime = event.timeStamp;
    };

    const onMove = (event: TouchEvent) => {
      if (!active) return;
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;

      if (axis === 'undecided') {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        // A drag that is mostly vertical belongs to the page scroll.
        axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
        if (axis === 'y') {
          active = false;
          return;
        }
        slideTimers.current.forEach((id) => window.clearTimeout(id));
        slideTimers.current = [];
        setPendingIndex(null);
        setSliding(false);
        setDragging(true);
      }

      event.preventDefault(); // the page must not scroll under a sideways drag
      lastDx = dx;
      setOffset(resist(dx));
    };

    const onEnd = (event: TouchEvent) => {
      if (!active) return;
      active = false;
      if (axis !== 'x') return;

      const width = trackRef.current?.offsetWidth || node.offsetWidth;
      const elapsed = Math.max(event.timeStamp - startTime, 1);
      const velocity = Math.abs(lastDx) / elapsed;
      const direction = lastDx < 0 ? 1 : -1;
      const committed =
        Math.abs(lastDx) > width * COMMIT_RATIO ||
        (Math.abs(lastDx) > 40 && velocity > FLICK_VELOCITY);

      setDragging(false);

      if (committed && canReach(direction)) {
        // Carries on from wherever the finger let go rather than restarting.
        slideRef.current(levelIndex + direction);
      } else {
        setSliding(true);
        setOffset(0);
        slideTimers.current.push(
          window.setTimeout(() => setSliding(false), SLIDE_MS)
        );
      }
    };

    node.addEventListener('touchstart', onStart, { passive: true });
    node.addEventListener('touchmove', onMove, { passive: false });
    node.addEventListener('touchend', onEnd);
    node.addEventListener('touchcancel', onEnd);
    return () => {
      node.removeEventListener('touchstart', onStart);
      node.removeEventListener('touchmove', onMove);
      node.removeEventListener('touchend', onEnd);
      node.removeEventListener('touchcancel', onEnd);
    };
    // `changeLevel` is stable enough for this: it only ever sets state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  // Nothing fades in on its own mid-slide: the incoming level arrives whole,
  // every card already visible and moving with the page.
  const holdReveal = dragging || pendingIndex !== null;

  // The levels either side are only drawn while the track is moving — the rest
  // of the time there is no reason to carry three pages worth of cards.
  const neighbours = holdReveal
    ? ([
        { item: LEVELS[levelIndex - 1], side: 'left' as const },
        { item: LEVELS[levelIndex + 1], side: 'right' as const },
      ].filter((entry) => entry.item) as {
        item: (typeof LEVELS)[number];
        side: 'left' | 'right';
      }[])
    : [];

  // Where the pill sits right now: on the active tab, part of the way to its
  // neighbour while a finger is dragging, or on the tab being animated to.
  const swipeWidth = trackRef.current?.offsetWidth || 1;
  const progress = dragging ? clamp(-offset / swipeWidth, -1, 1) : 0;
  const pillBase = pendingIndex ?? levelIndex;
  const pillTravel = Math.min(Math.abs(progress), 1);
  const pillFrom = tabRects[pillBase];
  const pillTo = tabRects[pillBase + (progress > 0 ? 1 : -1)] ?? pillFrom;
  const pillLeft = pillFrom
    ? pillFrom.left + (pillTo.left - pillFrom.left) * pillTravel
    : 0;
  const pillWidth = pillFrom
    ? pillFrom.width + (pillTo.width - pillFrom.width) * pillTravel
    : 0;
  // The label turns dark once the pill is more than half way onto it.
  const litIndex =
    pillTravel > 0.5 && tabRects[pillBase + (progress > 0 ? 1 : -1)]
      ? pillBase + (progress > 0 ? 1 : -1)
      : pillBase;

  const expandedKey = Object.keys(expanded)
    .filter((id) => expanded[id])
    .join('|');
  useScrollReveal(contentRef, [levelId, expandedKey, previewCount]);

  // Keep the saved position in step with whatever the learner is looking at.
  useEffect(() => {
    const save = () =>
      writeBrowsingState({ levelId, expanded, scrollY: window.scrollY });
    save();
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      save();
      window.removeEventListener('scroll', save);
    };
  }, [levelId, expanded]);

  // Scrolling folds the header down to its level tabs, which then stay at the
  // top of the screen: switching level is the one thing you want to reach from
  // anywhere down the page. Two thresholds, so it cannot flicker on the edge.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCondensed((wasCondensed) => (wasCondensed ? y > 60 : y > 130));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Restore the scroll position once the restored list has been laid out.
  useEffect(() => {
    const scrollY = restored?.scrollY;
    if (!scrollY) return;
    const frame = requestAnimationFrame(() => window.scrollTo(0, scrollY));
    return () => cancelAnimationFrame(frame);
    // Runs once: `restored` is captured at mount and never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * One level's page: the subject cards and the list beneath them. Drawn once
   * for the level on screen and once for each neighbour parked beside it.
   */
  const renderLevelBody = (levelItem: (typeof LEVELS)[number]) => {
    const levelCategories = levelItem.categories;
    return (
      <>
        {/* Categories */}
        <section>
          <div data-reveal="out" className="flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              {levelItem.categoriesLabel ?? 'Categories'}
            </h2>
            <button
              onClick={() => openRoute(levelItem.route)}
              className="text-sm font-semibold text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
            >
              See All
            </button>
          </div>

          {/* Tracks are sized to the cards rather than sharing the full width.
              With only two subjects, equal fractions left a hole between them
              wide enough to park a third card in. */}
          <div className="mt-4 grid grid-cols-2 justify-start gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-4">
              {levelCategories.map((category, index) => (
                <button
                  key={category.id}
                  data-reveal="out"
                  style={{ transitionDelay: `${index * 70}ms` }}
                  onClick={() => openRoute(category.route)}
                  className={`group flex aspect-square min-w-0 w-full flex-col items-stretch overflow-hidden rounded-[5px] border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-[#222] dark:bg-[#161616] lg:h-[238px] lg:aspect-auto ${category.ring}`}
                >
                  {/* One aspect ratio for every tile, illustrated or not.
                      Square art beside a fixed-height icon tile left the titles
                      sitting at four different heights across a row. */}
                  <div className={`flex h-[52%] w-full shrink-0 items-center justify-center overflow-hidden lg:h-[138px] ${category.tile}`}>
                    {category.image ? (
                      <span
                        className={`flex h-full w-full items-center justify-center overflow-hidden ${
                          category.imageZoom ?? ''
                        }`}
                      >
                        <img
                          src={promptedCategoryImage(category.id) ?? category.image}
                          alt=""
                          loading="lazy"
                          data-fallback={category.image}
                          onError={(event) => {
                            const fallback = event.currentTarget.dataset.fallback;
                            if (fallback && event.currentTarget.dataset.fallbackUsed !== 'true') {
                              event.currentTarget.dataset.fallbackUsed = 'true';
                              event.currentTarget.src = fallback;
                            } else {
                              event.currentTarget.style.display = 'none';
                            }
                          }}
                          className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
                          category.imageFit === 'cover'
                            ? 'object-cover'
                            : 'object-contain p-1'
                        }`}
                        />
                      </span>
                    ) : (
                      <category.Icon
                        className={`${category.iconColor} transition-transform duration-300 group-hover:scale-110`}
                        size={52}
                      />
                    )}
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col justify-between border-t border-slate-200 p-2.5 dark:border-[#222] sm:p-3 lg:p-4">
                    <h3 className="w-full shrink-0 truncate whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white sm:text-base lg:text-lg" title={category.title}>{category.title}</h3>
                    <div className="mt-1 flex min-h-8 items-end gap-2 lg:mt-2">
                      {category.experiments.length > 0
                        ? (
                            <span className="relative isolate mx-auto flex w-full max-w-full items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[9px] border-0 bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-600 px-2 py-1 text-white lg:gap-2 lg:px-3 lg:py-1.5">
                              <span className="absolute -right-1 top-0 -z-10 h-full w-10 -skew-x-[25deg] bg-fuchsia-400/85" />
                              <span className="relative text-lg font-black leading-none tracking-tight text-white lg:text-2xl">
                                {category.experiments.length}
                              </span>
                              <span className="relative truncate text-[8px] font-black uppercase tracking-wide text-white/90 sm:text-[10px] lg:text-xs">
                                {category.itemNoun ?? levelItem.itemNoun ?? 'experiment'}
                                {category.experiments.length === 1 ? '' : 's'}
                              </span>
                            </span>
                          )
                        : <span className="relative isolate mx-auto flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-[9px] bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-600 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white lg:px-3 lg:py-1.5 lg:text-xs">
                            <span className="absolute -right-1 top-0 -z-10 h-full w-10 -skew-x-[25deg] bg-fuchsia-400/85" />
                            <span className="relative">Coming soon</span>
                          </span>}
                    </div>
                  </div>
                </button>
            ))}
          </div>
        </section>

        {/* Experiments by category */}
        <section className="mt-8">
          <div data-reveal="out" className="flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">
              {levelItem.itemNoun === 'practical' ? 'Practicals' : 'Experiments'}
            </h2>
          </div>

          <div
            className={`mt-4 space-y-6 lg:items-start lg:gap-6 lg:space-y-0 ${
              levelCategories.length === 1 ? '' : 'lg:grid lg:grid-cols-2'
            }`}
          >
            {levelCategories.map((category) => {
              // Nothing expands in place any more, but the persisted browsing
              // state may still carry an expanded flag from an older session.
              const showAll = Boolean(expanded[category.id]);
              const visible = showAll
                ? category.experiments
                : category.experiments.slice(0, previewCount);
              const hidden = category.experiments.length - visible.length;

              return (
                <div key={category.id} className={`p-4 lg:p-6 ${category.band}`}>
                  <div data-reveal="out" className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                      {category.title}
                    </h3>
                    <button
                      onClick={() => openRoute(category.route)}
                      className="text-xs font-semibold text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      See All
                    </button>
                  </div>

                  {category.experiments.length === 0 ? (
                    <p data-reveal="out" className="mt-2 rounded-[10px] border border-dashed border-slate-200 bg-white/60 p-4 text-sm text-slate-500 dark:border-[#222] dark:bg-[#141414] dark:text-gray-500">
                      {(category.itemNoun ?? levelItem.itemNoun) === 'practical'
                        ? 'Practicals'
                        : 'Experiments'}{' '}
                      for {category.title} are being built.
                    </p>
                  ) : (
                    <ul
                      className={`mt-2 divide-y divide-slate-100 overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm dark:divide-[#222] dark:border-[#222] dark:bg-[#161616] lg:divide-y-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                        levelCategories.length === 1
                          ? 'lg:grid lg:grid-cols-2 lg:gap-3'
                          : 'lg:space-y-3'
                      }`}
                    >
                      {visible.map((experiment, index) => (
                        <li
                          key={experiment.route + experiment.title}
                          data-reveal="out"
                          style={{ transitionDelay: `${Math.min(index, 6) * 55}ms` }}
                        >
                          <button
                            onClick={() => openRoute(levelItem.id === 'polytechnic' ? polytechnicPracticalPath(category.route, experiment.route, experiment.title) : experiment.route)}
                            className="group flex h-full w-full items-center gap-3 rounded-[10px] p-3 text-left transition-all hover:bg-slate-50 dark:hover:bg-[#1c1c1c] sm:p-4 lg:gap-5 lg:border lg:border-slate-200 lg:bg-white lg:p-5 lg:shadow-sm lg:hover:-translate-y-0.5 lg:hover:shadow-lg lg:dark:border-[#222] lg:dark:bg-[#161616]"
                          >
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] lg:h-20 lg:w-20 ${experiment.image ? '' : category.tile}`}
                            >
                              {experiment.image ? (
                                <img
                                  src={experiment.image}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <>
                                  <experiment.Icon
                                    className={`${category.iconColor} lg:hidden`}
                                    size={20}
                                  />
                                  <experiment.Icon
                                    className={`${category.iconColor} hidden lg:block`}
                                    size={36}
                                  />
                                </>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold lg:whitespace-normal lg:text-xl">
                                {experiment.title}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-gray-400 lg:mt-1.5 lg:whitespace-normal lg:text-sm">
                                {experiment.blurb}
                              </span>
                            </span>
                            <span className="hidden shrink-0 text-sm font-semibold text-violet-600 dark:text-violet-400 lg:block">
                              Open
                            </span>
                            <ChevronRight
                              size={18}
                              className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-gray-600 dark:group-hover:text-gray-300"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Straight through to the subject's own page. Growing the
                      block in place buried every other subject below the fold. */}
                  {hidden > 0 && (
                    <button
                      onClick={() => openRoute(category.route)}
                      className="mt-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      Show {hidden} more
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[radial-gradient(circle_at_78%_12%,#ede9fe_0%,#f8fafc_38%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_78%_12%,#2e0b54_0%,#130522_34%,#09020f_72%)] dark:text-white">
      <style>{REVEAL_STYLES}</style>

      {/* Header. One colour family, deep to bright, over squared paper: the
          bench a practical is set up on. Everything decorative sits in its own
          layer so the search and the tabs stay flat and readable on top. */}
      <div
        // The gradient is set here rather than on a child: this element is
        // promoted to its own layer once it sticks, and its own background is
        // the one thing guaranteed to travel with it.
        style={{
          backgroundImage:
            'linear-gradient(135deg,#1b0b3d 0%,#4c1d95 48%,#7c3aed 100%)',
          boxShadow: condensed
            ? '0 14px 30px -18px rgba(76,29,149,0.95)'
            : '0 18px 40px -24px rgba(76,29,149,0.9)',
        }}
        className="practicals-header-in sticky top-0 z-40 overflow-hidden rounded-b-[28px] text-white transition-shadow duration-300 lg:hidden"
      >
        <HeroGridPaper />
        {/* The glow behind the flask, and the light coming off the bench edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 130% at 88% -20%, rgba(196,181,253,.5), transparent 62%)',
          }}
        />
        <div
          className={`transition-opacity duration-300 ${condensed ? 'opacity-0' : 'opacity-100'}`}
        >
          <HeroLabMotif />
        </div>
        <HeroEdgeLight />

        <div
          className={`relative mx-auto max-w-[1600px] px-4 transition-[padding] duration-300 sm:px-6 lg:px-10 ${
            condensed ? 'pb-2 pt-2' : 'pb-4 pt-6 sm:pb-6 sm:pt-8'
          }`}
        >
          {/* Title and search fold away together on the way down the page. */}
          <div
            className={`origin-top overflow-hidden transition-all duration-300 ease-out ${
              condensed
                ? 'pointer-events-none max-h-0 -translate-y-1 opacity-0'
                : 'max-h-[240px] translate-y-0 opacity-100'
            }`}
          >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="rounded-xl p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Back to home"
            >
              <ArrowLeft size={22} />
            </button>
            {/* The line art crowds the corner on a phone, so the kicker keeps
                its distance and says its piece in fewer words. */}
            <div className="min-w-0 flex-1 pr-16 sm:pr-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                <span className="sm:hidden">Learn by doing</span>
                <span className="hidden sm:inline">
                  Do the experiment, not just the theory
                </span>
              </p>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                Practical Labs
              </h1>
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative z-50 mt-5">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSuggestionsOpen(false);
                if (event.key === 'Enter' && suggestions[0]) {
                  openRoute(level.id === 'polytechnic' ? polytechnicPracticalPath(suggestions[0].category.route, suggestions[0].experiment.route, suggestions[0].experiment.title) : suggestions[0].experiment.route);
                }
              }}
              placeholder="Search Practical Labs"
              aria-label="Search practical labs"
              aria-expanded={showSuggestions}
              role="combobox"
              aria-controls="practicals-suggestions"
              className="w-full rounded-2xl border border-white/20 bg-white/15 py-3 pl-12 pr-4 text-sm text-white placeholder-white/60 outline-none backdrop-blur transition focus:border-white/50 focus:bg-white/20"
            />

            {/* Suggestions drop out of the search bar and go straight to the experiment. */}
            <div
              id="practicals-suggestions"
              className={`absolute left-0 right-0 top-full z-50 origin-top overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-out dark:border-[#222] dark:bg-[#161616] ${
                showSuggestions
                  ? 'pointer-events-auto mt-2 max-h-[26rem] scale-y-100 opacity-100'
                  : 'pointer-events-none mt-0 max-h-0 scale-y-95 opacity-0'
              }`}
            >
              <ul className="max-h-[26rem] divide-y divide-slate-100 overflow-y-auto dark:divide-[#222]">
                {suggestions.map(({ experiment, category }) => (
                  <li key={experiment.route + experiment.title}>
                    <button
                      onClick={() => {
                        setSuggestionsOpen(false);
                        openRoute(level.id === 'polytechnic' ? polytechnicPracticalPath(category.route, experiment.route, experiment.title) : experiment.route);
                      }}
                      className="group flex w-full items-center gap-3 p-3 text-left text-slate-950 transition-colors hover:bg-slate-50 dark:text-white dark:hover:bg-[#1c1c1c]"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-none ${category.tile}`}
                      >
                        <experiment.Icon className={category.iconColor} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {experiment.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-gray-400">
                          {category.title}
                        </span>
                      </span>
                      <ChevronRight
                        size={16}
                        className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-gray-600"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          </div>

          <div
            className={`flex items-end justify-between gap-6 transition-[margin] duration-300 ${
              condensed ? 'mt-0' : 'mt-5'
            }`}
          >
          {/* Level tabs. One pill slides between them — under a finger it
              tracks the swipe, otherwise it eases across on its own. */}
          <div ref={tabsRef} className="relative flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
            {pillWidth > 0 && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-0 top-0 rounded-full bg-white shadow ${
                  dragging ? '' : 'transition-[transform,width] duration-300 ease-out'
                }`}
                style={{
                  width: pillWidth,
                  height: pillFrom?.height,
                  transform: `translate3d(${pillLeft}px, ${pillFrom?.top ?? 0}px, 0)`,
                }}
              />
            )}
            {LEVELS.map((item, index) => {
              const active = index === litIndex;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabNodes.current[index] = node;
                  }}
                  onClick={() => slideToIndex(index)}
                  aria-pressed={item.id === level.id}
                  className={`relative z-10 whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                    active ? 'text-violet-800' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            </div>

            {/* What is actually in here, counted from the catalogue itself
                rather than rounded up into a marketing line. */}
            <dl className="hidden shrink-0 items-end gap-6 pb-1 sm:flex">
              {LIBRARY_STATS.map((stat) => (
                <div key={stat.label} className="text-right leading-none">
                  <dd className="text-lg font-bold tabular-nums">{stat.value}</dd>
                  <dt className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* The whole body travels with the swipe, and with the tab click on
          desktop, so the levels read as pages sitting side by side. */}
      <div
        ref={contentRef}
        className={`relative z-0 w-full px-4 py-6 sm:px-6 lg:block lg:pl-[292px] lg:pr-8 ${
          holdReveal ? 'practicals-reveal-hold' : ''
        }`}
      >
        <PracticalsDesktopSidebar
          activeLevelId={level.id}
          onSelectLevel={(id) => {
            const target = LEVELS.findIndex((item) => item.id === id);
            if (target >= 0) slideToIndex(target);
          }}
          onOpen={openRoute}
        />

        <div className="min-w-0 flex-1 overflow-x-clip">
          <DesktopFeaturedLab level={level} onOpen={openRoute} />
          <div
            ref={trackRef}
            style={{
              transform: offset ? `translate3d(${offset}px, 0, 0)` : undefined,
              transition: sliding
                ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
                : undefined,
              willChange: dragging || sliding ? 'transform' : undefined,
            }}
            className="relative mt-0 lg:mt-8"
          >
            {/* The levels on either side are already drawn, one gutter away, so
                a swipe pulls the next one in with no blank stretch between. */}
            {neighbours.map(({ item, side }) => (
              <div
                key={item.id}
                aria-hidden="true"
                className={`absolute top-0 w-full ${
                  side === 'left' ? 'right-full mr-6' : 'left-full ml-6'
                }`}
              >
                {renderLevelBody(item)}
              </div>
            ))}
            <div key={level.id} className="practicals-page-grow">
              {renderLevelBody(level)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
