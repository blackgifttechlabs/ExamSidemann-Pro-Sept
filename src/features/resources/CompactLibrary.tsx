import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  Search,
  X,
} from 'lucide-react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { AcademicLibrarySidebar, AcademicNavCourse } from './AcademicLibrarySidebar';
import { BOOK_LIBRARY, BOOK_LIBRARY_COURSES } from '../../data/bookLibrary';
import { useNavigate } from 'react-router-dom';
import { SlideLoader } from '../../components/ui/SlideLoader';
import { SHELF_GRID, ShelfSkeleton } from '../../components/ui/ShelfSkeleton';
import { DownloadCountdown, DownloadJob } from './DownloadCountdown';
import {
  RESOURCE_CATEGORIES,
  ResourceCategoryBar,
  ResourceLevelChips,
  categoryOf,
  coursesInCategory,
} from './ResourceLevelNav';
import { ResourceAdRail } from './ResourceAdRail';
import {
  PDF_IMAGE_PLACEHOLDER,
  formattedResourceSize,
  inferResourceCourse,
  inferResourceSubject,
  isLikelyQuestionPaper,
  loadResourceManifest,
  manifestFilesUnder,
  manifestFileFor,
  readableResourceName,
  resourceImageUrlFromManifest,
  resourceUrlFromManifest,
} from '../../services/resourceManifest';
import { DocumentReader } from './DocumentReader';

type BookResource = {
  id: string;
  title: string;
  url: string;
  course: string;
  subject?: string;
  size?: string;
  author?: string;
  approved?: boolean;
  rightsVerified?: boolean;
  sourceUrl?: string;
  rightsHolder?: string;
  rightsBasis?: string;
  /** Front-cover image. The card falls back to the file icon without one. */
  coverUrl?: string;
  /** Drive ID from qpandbooks.json, used to retry alternate image endpoints. */
  coverFileId?: string;
};

const initialCourses: AcademicNavCourse[] = [
  ...CURRICULUM_REGISTRY.map((course) => ({
    name: course.name,
    category: course.category,
  })),
  // Levels that only the bundled books use — the primary grades.
  ...BOOK_LIBRARY_COURSES,
];

const BookCover: React.FC<Pick<BookResource, 'title' | 'coverUrl' | 'coverFileId'>> = ({
  title,
  coverUrl,
  coverFileId,
}) => {
  const sources = useMemo(() => {
    const candidates = Array.from(new Set([
    coverFileId ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(coverFileId)}=w800` : '',
    coverFileId ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(coverFileId)}&sz=w800` : '',
    coverFileId ? `https://drive.usercontent.google.com/download?id=${encodeURIComponent(coverFileId)}&export=view&confirm=t` : '',
    coverFileId ? `https://drive.google.com/uc?export=view&id=${encodeURIComponent(coverFileId)}` : '',
    coverUrl || '',
    ].filter(Boolean)));
    if (typeof window === 'undefined' || !coverFileId) return candidates;
    const remembered = window.sessionStorage.getItem(`book-cover-source:${coverFileId}`);
    return remembered && candidates.includes(remembered)
      ? [remembered, ...candidates.filter((source) => source !== remembered)]
      : candidates;
  }, [coverFileId, coverUrl]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryRound, setRetryRound] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
    setLoaded(false);
    setFailed(sources.length === 0);
    setRetryRound(0);
  }, [coverFileId, coverUrl, sources.length]);

  const retry = () => {
    if (!sources.length) return;
    setSourceIndex(0);
    setLoaded(false);
    setFailed(false);
    setRetryRound((round) => round + 1);
  };

  // A Drive thumbnail can briefly return an error while the file is being
  // prepared or throttled. Retry twice rather than locking the card onto the
  // placeholder for the rest of the visit.
  useEffect(() => {
    if (!failed || retryRound >= 2 || !sources.length) return undefined;
    const timer = window.setTimeout(retry, retryRound === 0 ? 2500 : 7000);
    return () => window.clearTimeout(timer);
  }, [failed, retryRound, sources.length]);

  // Navigating back to the library, reconnecting, or returning to the tab is
  // another opportunity to recover a cover that Drive rejected temporarily.
  useEffect(() => {
    const retryIfFailed = () => {
      if (failed && document.visibilityState !== 'hidden') retry();
    };
    window.addEventListener('online', retryIfFailed);
    window.addEventListener('focus', retryIfFailed);
    document.addEventListener('visibilitychange', retryIfFailed);
    return () => {
      window.removeEventListener('online', retryIfFailed);
      window.removeEventListener('focus', retryIfFailed);
      document.removeEventListener('visibilitychange', retryIfFailed);
    };
  }, [failed, sources.length]);

  const baseSource = sources[sourceIndex];
  const source = baseSource && retryRound > 0
    ? `${baseSource}${baseSource.includes('?') ? '&' : '?'}retry=${retryRound}`
    : baseSource;

  return (
    <>
      <img
        src={PDF_IMAGE_PLACEHOLDER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {!loaded && !failed && (
        <span
          aria-label={`Loading cover for ${title}`}
          className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-r from-slate-200/55 via-white/75 to-slate-200/55 bg-[length:200%_100%] animate-pulse dark:from-slate-800/60 dark:via-slate-600/55 dark:to-slate-800/60"
        />
      )}

      {source && !failed && (
        <img
          key={source}
          src={source}
          alt={`Cover of ${title}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => {
            setLoaded(true);
            setFailed(false);
            if (coverFileId && baseSource) {
              window.sessionStorage.setItem(`book-cover-source:${coverFileId}`, baseSource);
            }
          }}
          onError={() => {
            setLoaded(false);
            if (sourceIndex + 1 < sources.length) setSourceIndex((index) => index + 1);
            else setFailed(true);
          }}
          className={`absolute inset-0 z-20 h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </>
  );
};

/**
 * The opening loader is a first-impression, not a level switch: once it has
 * played, moving around the library shows the shelf skeleton instead.
 */
let hasBooted = false;

/** Where the library opens: O Level, first year. */
const DEFAULT_CATEGORY = "O' Level";
const DEFAULT_COURSE = 'Form 3';

export const CompactLibrary: React.FC<{ onNavigate: (page: string) => void }> = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<AcademicNavCourse[]>(initialCourses);
  // The library opens straight onto a shelf. O Level is where most of the
  // traffic is, so that is where it lands; everything else is one tap away in
  // the sidebar or the bar along the bottom of a phone.
  const [activeCourse, setActiveCourse] = useState(DEFAULT_COURSE);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [booting, setBooting] = useState(!hasBooted);
  const [switching, setSwitching] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All books');
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<BookResource[]>([]);
  const [bundledBooks, setBundledBooks] = useState<BookResource[]>(BOOK_LIBRARY);
  const [selectedBook, setSelectedBook] = useState<BookResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadJob, setDownloadJob] = useState<DownloadJob | null>(null);

  const queueDownload = (title: string, url: string) => {
    setDownloadJob({ token: Date.now(), title, url });
  };

  useEffect(() => {
    let cancelled = false;
    loadResourceManifest().then((manifest) => {
      if (cancelled) return;
      const catalogueBooks = BOOK_LIBRARY.map((book) => ({
        ...book,
        url: resourceUrlFromManifest(manifest, book.url),
        coverUrl: resourceImageUrlFromManifest(manifest, book.coverUrl),
        coverFileId: manifestFileFor(manifest, book.coverUrl)?.id,
      }));
      const knownFileIds = new Set(BOOK_LIBRARY.map((book) => manifestFileFor(manifest, book.url)?.id).filter(Boolean));
      const addedBooks: BookResource[] = manifestFilesUnder(manifest, 'new-resources')
        .filter((file) => /\.pdf$/i.test(file.name) && !isLikelyQuestionPaper(file.name) && !knownFileIds.has(file.id))
        .map((file) => ({
          id: `manifest-book-${file.id}`,
          title: readableResourceName(file.name),
          author: 'Digital book',
          course: inferResourceCourse(file.name, 'Grade 7'),
          subject: inferResourceSubject(file.name),
          url: file.link,
          coverFileId: file.id,
          size: formattedResourceSize(file.size),
        }));
      setBundledBooks([...catalogueBooks, ...addedBooks]);
    }).catch(() => {
      // Keep the catalogue paths as a fallback if the deployed manifest cannot load.
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snapshot) => {
    const remote = snapshot.exists() ? snapshot.data().list || [] : [];
    const merged = [...initialCourses];
    remote.forEach((course: AcademicNavCourse) => {
      if (course.name && !merged.some((item) => item.name === course.name)) merged.push(course);
    });
    setCourses(merged);
  }), []);

  useEffect(() => {
    if (!activeCourse) {
      setSubjects([]);
      return undefined;
    }
    // The subject chips are whatever the admin has configured for this level,
    // plus the subjects the bundled books actually carry — a level with no
    // Firestore configuration at all still filters properly.
    const bundled = bundledBooks.filter((book) => book.course === activeCourse).map((book) => book.subject).filter(Boolean);
    return onSnapshot(doc(db, 'course_subjects', activeCourse), (snapshot) => {
      const remote = snapshot.exists() ? snapshot.data().subjects || [] : [];
      const names = remote.map((subject: any) => subject.name).filter(Boolean);
      setSubjects(Array.from(new Set([...names, ...bundled])));
      setSelectedSubject('All books');
    });
  }, [activeCourse, bundledBooks]);

  useEffect(() => {
    if (!activeCourse) {
      setBooks([]);
      return undefined;
    }
    setLoading(true);
    const resourcesQuery = query(
      collection(db, 'global_resources'),
      where('course', '==', activeCourse),
      where('type', '==', 'library'),
      where('approved', '==', true),
    );
    return onSnapshot(resourcesQuery, (snapshot) => {
      setBooks(snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() } as BookResource))
        .filter((book) => book.approved === true));
      setLoading(false);
    }, () => {
      setBooks([]);
      setLoading(false);
    });
  }, [activeCourse]);

  /**
   * The bundled books plus the published ones, with Firestore winning on a
   * clash: a title curated in the admin area replaces its shipped entry rather
   * than appearing twice.
   */
  const allBooks = useMemo(() => {
    const published = new Set(books.map((book) => book.url));
    const bundled = bundledBooks.filter((book) => book.course === activeCourse && !published.has(book.url));
    return [...books, ...bundled];
  }, [books, bundledBooks, activeCourse]);

  const filteredBooks = useMemo(() => allBooks.filter((book) => (
    (selectedSubject === 'All books' || book.subject === selectedSubject)
    && `${book.title} ${book.author || ''} ${book.subject || ''}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [allBooks, search, selectedSubject]);

  /**
   * Changing level redraws the whole shelf, so it hands over through the
   * skeleton rather than swapping one level's books for another's mid-blink.
   * It is a fixed short beat: the books themselves are already local, and a
   * flicker too fast to read would be worse than none.
   */
  useEffect(() => {
    setSwitching(true);
    const timer = setTimeout(() => setSwitching(false), 320);
    return () => clearTimeout(timer);
  }, [activeCourse]);

  // The bar along the bottom of a phone follows whichever level is open,
  // including one picked from the sidebar on a larger screen.
  useEffect(() => {
    const course = courses.find((item) => item.name === activeCourse);
    if (course) setSelectedCategory(categoryOf(course));
  }, [courses, activeCourse]);

  // The shelf is behind a short, deliberate pause rather than a level menu.
  useEffect(() => {
    const timer = setTimeout(() => {
      hasBooted = true;
      setBooting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const chooseCourse = (courseName: string) => {
    setActiveCourse(courseName);
    setSelectedSubject('All books');
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    const first = coursesInCategory(courses, category)[0];
    if (first) chooseCourse(first.name);
  };

  if (booting) {
    return (
      <div className="h-[100dvh] bg-[#13141d] lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <SlideLoader label="Opening your library" />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b] lg:h-[calc(100dvh_-_var(--app-header-h))]">
      <AcademicLibrarySidebar
        title="Book Library"
        subtitle="Books & handbooks"
        courses={courses}
        selectedCourse={activeCourse}
        onSelectCourse={chooseCourse}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <p className="mb-2 px-3 text-[10px] font-semibold text-slate-400">Subjects</p>
        <div className="space-y-1">
          {['All books', ...subjects].map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`w-full rounded-[7px] px-3 py-2 text-left text-xs ${
                selectedSubject === subject
                  ? 'bg-slate-100 font-bold text-slate-950 dark:bg-white/10 dark:text-white'
                  : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </AcademicLibrarySidebar>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
          {/* phone: one bar — out of here, and search */}
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
                placeholder="Search books"
                className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">{activeCourse}</p>
              <h1 className="truncate text-lg font-black text-slate-900 dark:text-white">{selectedSubject}</h1>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search books" className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white" />
            </div>
          </div>
          <div className="mt-3 lg:hidden">
            <ResourceLevelChips
              courses={coursesInCategory(courses, selectedCategory)}
              active={activeCourse}
              onSelect={chooseCourse}
            />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto scroll-smooth p-4 pb-24 md:p-6 lg:pb-6">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="font-black text-slate-900 dark:text-white">Book collection</h2><p className="text-xs text-slate-400">{filteredBooks.length} resources available</p></div>
          </div>

          {switching || (loading && !allBooks.length) ? (
            <ShelfSkeleton />
          ) : filteredBooks.length ? (
            <div className={SHELF_GRID}>
              {filteredBooks.map((book) => (
                /* A shelf, not a row of panels: the cover is the whole tile and
                   the title sits under it, the way a bookshop lays books out. */
                <article key={book.id} className="group relative">
                  <button
                    onClick={() => setSelectedBook(book)}
                    aria-label={`Read ${book.title}`}
                    className="relative flex aspect-[1/1.45] w-full items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                  >
                    <BookCover
                      title={book.title}
                      coverUrl={book.coverUrl}
                      coverFileId={book.coverFileId}
                    />
                  </button>

                  <button
                    onClick={() => queueDownload(book.title, book.url)}
                    aria-label={`Download ${book.title}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-[10px] bg-slate-950/55 text-white backdrop-blur-sm transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <Download size={13} />
                  </button>

                  {/* One line each, always: a title that wrapped would push its
                      neighbours out of line and break the shelf. */}
                  <h3 title={book.title} className="mt-2 truncate text-[11px] font-black leading-4 text-slate-800 dark:text-white">{book.title}</h3>
                  <p className="truncate text-[10px] font-bold text-slate-400">{book.author || book.size || 'Digital book'}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]">
              <BookOpen className="mx-auto mb-3 text-slate-300" size={28} />
              <p className="font-black text-slate-700 dark:text-slate-200">No books found</p>
              <p className="mt-1 text-sm text-slate-400">Try another subject or level.</p>
            </div>
          )}
        </section>
      </main>
      <ResourceAdRail />

      <ResourceCategoryBar
        categories={RESOURCE_CATEGORIES.filter((category) => coursesInCategory(courses, category.id).length > 0)}
        active={selectedCategory}
        onSelect={chooseCategory}
      />

      <DownloadCountdown key={downloadJob?.token ?? 'download-idle'} job={downloadJob} onClose={() => setDownloadJob(null)} />

      {selectedBook && (
        <DocumentReader
          title={selectedBook.title}
          course={selectedBook.course}
          subject={selectedBook.subject}
          url={selectedBook.url}
          kind="Book"
          courses={courses}
          onBack={() => setSelectedBook(null)}
          onDownload={() => queueDownload(selectedBook.title, selectedBook.url)}
          onSelectCourse={chooseCourse}
        />
      )}
    </div>
  );
};
