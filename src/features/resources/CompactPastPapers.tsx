import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { AcademicLibrarySidebar, AcademicNavCourse } from './AcademicLibrarySidebar';
import { SlideLoader } from '../../components/ui/SlideLoader';
import { QUESTION_PAPERS } from '../../data/questionPapers';
import { SHELF_GRID, ShelfSkeleton } from '../../components/ui/ShelfSkeleton';
import { DownloadCountdown, DownloadJob } from './DownloadCountdown';
import {
  RESOURCE_CATEGORIES,
  ResourceCategoryBar,
  ResourceLevelChips,
  categoryOf,
  coursesInCategory,
} from './ResourceLevelNav';
import { SeoHead } from '../../seo/SeoHead';
import {
  getPastPaperBoard,
  getPastPaperCoursePath,
  getPastPaperPath,
  getPastPaperSubjectPath,
  SITE_URL,
  STATIC_PAST_PAPERS,
} from '../../utils/pastPaperSeo';
import {
  buildKeywordPhrases,
  keywordsAttribute,
  paperArchiveSeoFor,
  paperCourseSeoFor,
  paperHubGuidanceFor,
  paperSubjectSeoFor,
} from '../../data/seoKeywords';
import {
  PDF_IMAGE_PLACEHOLDER,
  loadResourceManifest,
  manifestFileFor,
  resourceImageUrlFromManifest,
  resourceUrlFromManifest,
} from '../../services/resourceManifest';
import {
  manifestPastPapers,
  uploadedPastPaper,
} from '../../utils/runtimePastPapers';

type Paper = {
  id: string;
  name: string;
  url: string;
  fileId?: string;
  course?: string;
  subject?: string;
  seoPath?: string;
  thumbnailUrl?: string;
  /** Which examination board set it; ZIMSEC unless the card says otherwise. */
  board?: string;
  approved?: boolean;
  rightsVerified?: boolean;
  sourceUrl?: string;
  rightsHolder?: string;
  rightsBasis?: string;
};

/**
 * ZIMSEC and Cambridge catalogue entries. Their academic metadata lives in the
 * generated catalogue; qpandbooks.json supplies the current Drive file and
 * cover URLs when the archive loads.
 */
const bundledPapers: Paper[] = QUESTION_PAPERS.map((paper) => ({
  id: paper.id,
  name: paper.name,
  url: paper.url,
  course: paper.course,
  subject: paper.subject,
  board: paper.board,
  // Every paper gets its own page — title, the facts, a download — rather than
  // the card throwing the PDF straight at the reader.
  seoPath: getPastPaperPath({
    course: paper.course,
    subject: paper.subject,
    year: paper.year,
    type: paper.type,
  } as Parameters<typeof getPastPaperPath>[0]),
  thumbnailUrl: `/qp-covers/${paper.id}.png`,
}));

const hardcodedPapers: Paper[] = STATIC_PAST_PAPERS.map((paper) => ({
  id: paper.id,
  name: paper.name,
  url: paper.url,
  fileId: paper.fileId,
  course: paper.course,
  subject: paper.subject,
  seoPath: getPastPaperPath(paper),
  // Version the URL so clients that cached the old SPA fallback as an image do
  // not keep showing a coloured placeholder after the real preview is deployed.
  thumbnailUrl: `/images/past-paper-thumbnails/${paper.fileId}.png?v=20260803-1`,
  rightsVerified: paper.rightsVerified,
  sourceUrl: paper.sourceUrl,
  rightsHolder: paper.rightsHolder,
  rightsBasis: paper.rightsBasis,
}));

const normalizePaperCourse = (course?: string) => {
  const value = course?.trim().replace(/\s+/g, ' ') || '';
  const compact = value.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Past papers are final examination documents, so Form 4 uploads belong in
  // the same O-Level archive as files already labelled O'Level.
  if (['olevel', 'ordinarylevel', 'form4'].includes(compact)) return "O' Level";
  if (['alevel', 'advancedlevel', 'lower6', 'upper6'].includes(compact)) return "A' Level";

  // Junior forms and Form 3 do not belong in the examination-paper catalogue.
  if (['form1', 'form2', 'form3', 'zjc'].includes(compact)) return '';
  return value;
};

const categoryForPaperCourse = (course: string) => {
  if (/^Grade\s+[1-7]$/i.test(course)) return 'Primary';
  if (course === 'ZJC' || course === 'Form 1' || course === 'Form 2') return 'ZJC';
  if (course === "O' Level") return "O' Level";
  if (course === "A' Level") return "A' Level";
  return 'Polytechnic';
};

const coursesFromPapers = (availablePapers: Paper[]): AcademicNavCourse[] => {
  const names = Array.from(new Set(
    availablePapers
      .map((paper) => normalizePaperCourse(paper.course))
      .filter(Boolean),
  ));

  return names
    .sort((left, right) => {
      const priority = (name: string) => name === 'ZJC' ? 0 : name === "O' Level" ? 1 : name === "A' Level" ? 2 : name.startsWith('NC ') ? 3 : 4;
      return priority(left) - priority(right) || left.localeCompare(right);
    })
    .map((name) => ({ name, category: categoryForPaperCourse(name) }));
};

const initialCourses = coursesFromPapers([...bundledPapers, ...hardcodedPapers]);

const googleDriveFileId = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    return pathMatch?.[1] || parsed.searchParams.get('id') || '';
  } catch {
    return '';
  }
};

const firstPageThumbnails = (paper: Paper) => {
  const fileId = paper.fileId || googleDriveFileId(paper.url);
  return Array.from(new Set([
    paper.thumbnailUrl,
    fileId ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w800` : '',
  ].filter(Boolean) as string[]));
};

const PaperPreview: React.FC<{ paper: Paper }> = ({ paper }) => {
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const thumbnails = firstPageThumbnails(paper);
  const thumbnail = thumbnails[thumbnailIndex];
  const preview = (
    <span className="relative block h-full w-full overflow-hidden bg-white dark:bg-slate-900">
      <img
        src={PDF_IMAGE_PLACEHOLDER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {thumbnail ? (
      <img
        src={thumbnail}
        alt={`First page of ${paper.name}`}
        loading="lazy"
        decoding="async"
        onError={() => setThumbnailIndex((index) => index + 1)}
        className="absolute inset-0 h-full w-full bg-slate-100 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] dark:bg-slate-900"
      />
      ) : null}
    </span>
  );

  const className = "relative block aspect-[1/1.45] w-full overflow-hidden rounded-[10px] shadow-sm transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-lg";
  return paper.seoPath ? (
    <Link to={paper.seoPath} aria-label={`View ${paper.name}`} className={className}>
      {preview}
    </Link>
  ) : (
    <a href={paper.url} target="_blank" rel="noreferrer" aria-label={`Open ${paper.name}`} className={className}>
      {preview}
    </a>
  );
};

type Props = {
  initialSearch?: string;
  initialCourse?: string;
  initialSubject?: string;
};

/**
 * Where the archive opens when the URL does not name a level.
 *
 * Past papers are filed by examination, not by school year — Form 3 is not an
 * archive level at all — so the O-Level shelf is the landing spot.
 */
const DEFAULT_COURSE = "O' Level";

/**
 * Changing level remounts this page from the route, so the opening loader is
 * held to the first visit — after that a level change shows the skeleton.
 */
let hasBooted = false;

export const CompactPastPapers: React.FC<Props> = ({
  initialSearch = '',
  initialCourse = '',
  initialSubject = 'All subjects',
}) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<AcademicNavCourse[]>(initialCourses);
  // /past-papers with no level in the URL opens on O Level rather than asking.
  const [selectedCourse, setSelectedCourse] = useState(initialCourse || DEFAULT_COURSE);
  const [selectedCategory, setSelectedCategory] = useState("O' Level");
  const [booting, setBooting] = useState(!hasBooted);
  const [switching, setSwitching] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([...bundledPapers, ...hardcodedPapers]);
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  const [search, setSearch] = useState(initialSearch);
  const [searchOpen, setSearchOpen] = useState(Boolean(initialSearch));
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const subjectRailRef = useRef<HTMLElement>(null);
  const [subjectRailEdges, setSubjectRailEdges] = useState({ left: false, right: false });
  const [downloadJob, setDownloadJob] = useState<DownloadJob | null>(null);

  const queueDownload = (title: string, url: string) => {
    setDownloadJob({ token: Date.now(), title, url });
  };

  useEffect(() => {
    setSelectedCourse(initialCourse || DEFAULT_COURSE);
    setActiveSubject(initialSubject || 'All subjects');
  }, [initialCourse, initialSubject]);

  // The shelf hands over through its skeleton on a level change — see the
  // book library, which does the same.
  useEffect(() => {
    setSwitching(true);
    const timer = setTimeout(() => setSwitching(false), 320);
    return () => clearTimeout(timer);
  }, [selectedCourse]);

  // The level the bottom bar should show as current follows the open level.
  useEffect(() => {
    const course = courses.find((item) => item.name === selectedCourse);
    if (course) setSelectedCategory(categoryOf(course));
  }, [courses, selectedCourse]);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasBooted = true;
      setBooting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [searchOpen]);

  const subjects = useMemo(() => Array.from(new Set(
    papers
      .filter((paper) => normalizePaperCourse(paper.course) === selectedCourse)
      .map((paper) => paper.subject)
      .filter(Boolean) as string[],
  )).sort((left, right) => left.localeCompare(right)), [papers, selectedCourse]);

  useEffect(() => {
    const rail = subjectRailRef.current;
    if (!rail) return;

    const updateEdges = () => setSubjectRailEdges({
      left: rail.scrollLeft > 4,
      right: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4,
    });
    const frame = window.requestAnimationFrame(updateEdges);
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(rail);
    rail.addEventListener('scroll', updateEdges, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      rail.removeEventListener('scroll', updateEdges);
    };
  }, [searchOpen, subjects]);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    setLoading(true);

    loadResourceManifest().catch(() => ({})).then((manifest) => {
      if (cancelled) return;
      const manifestPapers = bundledPapers.map((paper) => ({
        ...paper,
        url: resourceUrlFromManifest(manifest, paper.url),
        thumbnailUrl: resourceImageUrlFromManifest(manifest, `/qp-covers/${paper.id}.png`),
      }));
      const knownFileIds = new Set([
        ...bundledPapers.map((paper) => manifestFileFor(manifest, paper.url)?.id),
        ...hardcodedPapers.map((paper) => paper.fileId),
      ].filter(Boolean));
      const addedManifestPapers: Paper[] = manifestPastPapers(manifest, knownFileIds).map((paper) => ({
        id: paper.id,
        name: paper.name,
        url: paper.url,
        fileId: paper.fileId,
        course: paper.course,
        subject: paper.subject,
        board: paper.board,
        seoPath: getPastPaperPath(paper),
      }));
      const papersQuery = query(
        collection(db, 'global_resources'),
        where('type', '==', 'past-papers'),
        where('approved', '==', true),
      );
      unsubscribe = onSnapshot(papersQuery, (snapshot) => {
        const remote = snapshot.docs.map((item) => {
          const data = item.data();
          const record = uploadedPastPaper(item.id, data);
          if (!record) return undefined;
          return {
            id: record.id,
            name: record.name,
            url: record.url,
            fileId: record.fileId,
            course: normalizePaperCourse(record.course),
            subject: record.subject,
            thumbnailUrl: data.thumbnailUrl || data.thumbnail || data.previewImage || '',
            approved: true,
            board: record.board,
            seoPath: getPastPaperPath(record),
          };
        }).filter(Boolean) as Paper[];
        const availablePapers = [...manifestPapers, ...addedManifestPapers, ...hardcodedPapers.filter((paper) => paper.url), ...remote];
        setPapers(availablePapers);
        setCourses(coursesFromPapers(availablePapers));
        setLoading(false);
      }, () => {
        const availablePapers = [...manifestPapers, ...addedManifestPapers, ...hardcodedPapers];
        setPapers(availablePapers);
        setCourses(coursesFromPapers(availablePapers));
        setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const visiblePapers = useMemo(() => papers.filter((paper) => (
    normalizePaperCourse(paper.course) === selectedCourse
    && (activeSubject === 'All subjects' || paper.subject === activeSubject)
    && paper.name.toLowerCase().includes(search.trim().toLowerCase())
  )), [activeSubject, papers, search, selectedCourse]);

  const chooseCourse = (courseName: string) => {
    setSelectedCourse(courseName);
    setActiveSubject('All subjects');
    setSearch('');
    // Runtime-only manifest additions do not have a build-time SEO route.
    // Keep those shelves in place instead of navigating to a route that would
    // reject the newly discovered course and send the learner back to O Level.
    if (initialCourses.some((course) => course.name === courseName)) {
      navigate(getPastPaperCoursePath(courseName), { replace: true });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseSubject = (subject: string) => {
    setActiveSubject(subject);
    const isBuildTimeSubject = [...bundledPapers, ...hardcodedPapers].some((paper) => (
      normalizePaperCourse(paper.course) === selectedCourse
      && (subject === 'All subjects' || paper.subject === subject)
    ));
    if (isBuildTimeSubject) {
      navigate(subject === 'All subjects'
        ? getPastPaperCoursePath(selectedCourse)
        : getPastPaperSubjectPath(selectedCourse, subject), { replace: true });
    }
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    const first = coursesInCategory(courses, category)[0];
    if (first) chooseCourse(first.name);
  };

  const staticVisiblePapers = STATIC_PAST_PAPERS.filter((paper) => (
    paper.course === selectedCourse
    && (activeSubject === 'All subjects' || paper.subject === activeSubject)
  ));
  // Kept in step with scripts/generateSeo.mjs, which pre-renders these same
  // routes; a mismatch would make the crawled title differ from the rendered one.
  const seoBoard = staticVisiblePapers[0] ? getPastPaperBoard(staticVisiblePapers[0]) : 'ZIMSEC';
  const seoCategory = seoBoard === 'HEXCO' ? 'Polytechnic' : undefined;
  const paperListSeo = selectedCourse
    ? activeSubject === 'All subjects'
      ? paperCourseSeoFor({ courseName: selectedCourse, board: seoBoard })
      : paperSubjectSeoFor({
          courseName: selectedCourse,
          subjectName: activeSubject,
          board: seoBoard,
          paperCount: staticVisiblePapers.length,
        })
    : paperArchiveSeoFor();
  const seoTitle = paperListSeo.title;
  const seoDescription = paperListSeo.description;
  const seoKeywords = keywordsAttribute(buildKeywordPhrases({
    courseName: selectedCourse || undefined,
    category: seoCategory,
    subjectName: activeSubject === 'All subjects' ? undefined : activeSubject,
    kinds: ['pastPapers', 'questions'],
  }));
  const seoPath = selectedCourse
    ? activeSubject === 'All subjects'
      ? getPastPaperCoursePath(selectedCourse)
      : getPastPaperSubjectPath(selectedCourse, activeSubject)
    : '/past-papers/';
  const itemListSchema = staticVisiblePapers.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: seoTitle,
    itemListElement: staticVisiblePapers.map((paper, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: paper.name,
      url: `${SITE_URL}${getPastPaperPath(paper)}`,
    })),
  } : undefined;


  if (booting) {
    return (
      <div className="h-[100dvh] bg-[#13141d] lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <SlideLoader label="Opening the archive" />
      </div>
    );
  }

  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} keywords={seoKeywords} canonical={`${SITE_URL}${seoPath}`} structuredData={itemListSchema} />
      <div className="flex h-[100dvh] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b] lg:h-[calc(100dvh_-_var(--app-header-h))]">
      <AcademicLibrarySidebar
        title="Past Papers"
        subtitle="Exam library"
        courses={courses}
        selectedCourse={selectedCourse}
        onSelectCourse={chooseCourse}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
          {/* phone: a back arrow and a search bar, nothing else */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              // Straight into the page from a link or a share leaves nothing to
              // go back to, so the arrow falls through to the home page.
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search papers"
                className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          {coursesInCategory(courses, selectedCategory).length > 1 && (
            <div className="mt-3 lg:hidden">
              <ResourceLevelChips
                courses={coursesInCategory(courses, selectedCategory)}
                active={selectedCourse}
                onSelect={chooseCourse}
              />
            </div>
          )}

          <div className="mt-3 hidden min-w-0 items-center gap-2 lg:flex lg:gap-3">
            <button onClick={() => navigate('/past-papers/')} aria-label="Back to past-paper levels" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 text-slate-500 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:text-slate-300">
              <ArrowLeft size={17} />
            </button>
            <div className="relative min-w-0 flex-1 self-stretch">
              <nav ref={subjectRailRef} aria-label="Filter papers by subject" className="flex h-full min-w-0 gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {['All subjects', ...subjects].map((subject) => (
                  <button type="button" key={subject} onClick={() => chooseSubject(subject)} className={`flex shrink-0 items-center rounded-[10px] px-3 py-2 text-[11px] font-black transition-colors ${activeSubject === subject ? 'bg-violet-600 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'}`}>
                    {subject}
                  </button>
                ))}
              </nav>
              {subjectRailEdges.left && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center bg-gradient-to-r from-white via-white/95 to-transparent pl-0.5 dark:from-[#0c0c10] dark:via-[#0c0c10]/95">
                  <button type="button" onClick={() => subjectRailRef.current?.scrollBy({ left: -220, behavior: 'smooth' })} aria-label="Show previous subjects" className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-[#18181f] dark:text-slate-300">
                    <ChevronLeft size={15} />
                  </button>
                </div>
              )}
              {subjectRailEdges.right && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-center justify-end bg-gradient-to-l from-white via-white/95 to-transparent pr-0.5 dark:from-[#0c0c10] dark:via-[#0c0c10]/95">
                  <button type="button" onClick={() => subjectRailRef.current?.scrollBy({ left: 220, behavior: 'smooth' })} aria-label="Show more subjects" className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 shadow-md transition-colors hover:bg-violet-50 dark:border-violet-500/30 dark:bg-[#18181f] dark:text-violet-300">
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
            <div className={`relative h-10 shrink-0 transition-[width] duration-300 ease-out ${searchOpen ? 'w-40 sm:w-56 lg:w-72' : 'w-10'}`}>
              <div className={`absolute inset-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50/90 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/10 dark:bg-[#15151b] dark:focus-within:border-violet-500/60 dark:focus-within:bg-[#18181f] ${searchOpen ? 'shadow-[0_8px_24px_rgba(15,23,42,0.08)]' : 'hover:border-violet-300 hover:bg-white'}`}>
                {searchOpen ? (
                  <>
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-500" size={16} />
                    <input
                      ref={searchInputRef}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setSearch('');
                          setSearchOpen(false);
                        }
                      }}
                      placeholder="Search papers"
                      aria-label="Search past papers"
                      className="h-full w-full bg-transparent pl-10 pr-9 text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setSearchOpen(false);
                      }}
                      aria-label="Close search"
                      className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-white/10"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Open paper search"
                    className="flex h-full w-full items-center justify-center text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                  >
                    <Search size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto scroll-smooth p-4 pb-24 md:p-6 lg:pb-6">
          <div className="mb-4">
            {/* The archive lists more than one board now, so the heading only
                claims ZIMSEC when everything on screen really is ZIMSEC. */}
            <h2 className="font-black text-slate-900 dark:text-white">
              {new Set(visiblePapers.map((paper) => paper.board || 'ZIMSEC')).size > 1
                ? paperListSeo.heading.replace(/^ZIMSEC\s+/, '')
                : paperListSeo.heading}
            </h2>
            <p className="text-xs text-slate-400">{visiblePapers.length} {visiblePapers.length === 1 ? 'file' : 'files'} available</p>
          </div>

          {switching || loading ? (
            <ShelfSkeleton />
          ) : visiblePapers.length ? (
            <div className={SHELF_GRID}>
              {visiblePapers.map((paper) => (
                /* Same shelf as the book library: the first page is the cover,
                   the name sits under it. */
                <article key={paper.id} className="group relative">
                  <PaperPreview paper={paper} />

                  <button
                    type="button"
                    onClick={() => queueDownload(paper.name, paper.url)}
                    aria-label={`Download ${paper.name}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-[10px] bg-slate-950/55 text-white backdrop-blur-sm transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <Download size={13} />
                  </button>

                  {/* One line each, always — see the book library: a wrapped
                      name would knock the whole row out of alignment. */}
                  <h3 title={paper.name} className="mt-2 truncate text-[11px] font-black leading-4 text-slate-800 dark:text-white">
                    {paper.seoPath ? <Link to={paper.seoPath}>{paper.name}</Link> : paper.name}
                  </h3>
                  <p className="truncate text-[10px] font-bold text-slate-400">
                    {paper.board && paper.board !== 'ZIMSEC' ? `${paper.board} · ` : ''}{paper.subject || selectedCourse}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]">
              <FileText className="mx-auto mb-3 text-slate-300" size={28} />
              <p className="font-black text-slate-700 dark:text-slate-200">No papers found</p>
              <p className="mt-1 text-sm text-slate-400">Choose another level or subject.</p>
            </div>
          )}
        </section>
      </main>

      <ResourceCategoryBar
        categories={RESOURCE_CATEGORIES.filter((category) => coursesInCategory(courses, category.id).length > 0)}
        active={selectedCategory}
        onSelect={chooseCategory}
      />
      <DownloadCountdown key={downloadJob?.token ?? 'download-idle'} job={downloadJob} onClose={() => setDownloadJob(null)} />
      </div>
    </>
  );
};
