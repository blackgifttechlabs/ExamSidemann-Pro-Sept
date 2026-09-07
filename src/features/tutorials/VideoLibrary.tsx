import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Menu,
  MoreVertical,
  Play,
  Search,
  Video,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, increment, where } from 'firebase/firestore';
import { slugifyLearningPath } from '../../utils/learningOutcomeSeo';
import { db } from '../../services/firebase';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { AcademicLibrarySidebar, AcademicNavCourse } from '../resources/AcademicLibrarySidebar';
import { ResourceAdRail } from '../resources/ResourceAdRail';
import { SlideLoader } from '../../components/ui/SlideLoader';

type VideoData = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  subject: string;
  grade: string;
  teacherName: string;
  views: number;
  description?: string;
  duration?: number | string;
  createdAt?: any;
  approved?: boolean;
};

const initialCourses: AcademicNavCourse[] = CURRICULUM_REGISTRY.map((course) => ({
  name: course.name,
  category: course.category,
}));

const youtubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || parsed.pathname.split('/embed/')[1] || null;
  } catch {
    return null;
  }
};

const thumbnailFor = (video: VideoData) => {
  if (video.thumbnail) return video.thumbnail;
  const id = youtubeId(video.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=900';
};

const DEFAULT_VIDEO_COURSE = initialCourses.find((course) => course.name === 'Form 4')?.name
  || initialCourses[0]?.name
  || 'Form 4';

let hasVideoLibraryBooted = false;

// Videos curated from YouTube ship with the app rather than living in
// Firestore. They are identified by this prefix so playback never tries to
// increment a view counter on a document that does not exist.
const CURATED_PREFIX = 'yt:';
const isCurated = (id: string) => id.startsWith(CURATED_PREFIX);

type CompactVideo = { i: string; t: string; s: string; g: string; c: string; d: number; v: number };

const expandCurated = (rows: CompactVideo[]): VideoData[] => rows.map((row) => ({
  // The same lesson can be listed under more than one form, so the grade has to
  // be part of the id or React would see duplicate keys.
  id: `${CURATED_PREFIX}${row.i}:${row.g}`,
  title: row.t,
  url: `https://www.youtube.com/watch?v=${row.i}`,
  thumbnail: `https://img.youtube.com/vi/${row.i}/hqdefault.jpg`,
  subject: row.s,
  grade: row.g,
  teacherName: row.c,
  duration: row.d,
  views: row.v,
  description: `${row.s} lesson for ${row.g}. Published on YouTube by ${row.c}.`,
}));

const formatDuration = (duration?: number | string) => {
  if (typeof duration === 'string') return duration;
  if (!Number.isFinite(duration) || !duration) return '';
  const totalSeconds = Math.max(0, Math.round(duration));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(views >= 10_000_000 ? 0 : 1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(views >= 10_000 ? 0 : 1)}K`;
  return views.toLocaleString();
};

export const VideoLibrary: React.FC = () => {
  const { courseSlug, subjectSlug } = useParams<{ courseSlug?: string; subjectSlug?: string }>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<AcademicNavCourse[]>(initialCourses);
  const [remoteVideos, setRemoteVideos] = useState<VideoData[]>([]);
  const [curatedVideos, setCuratedVideos] = useState<VideoData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(() => courseSlug ? '' : DEFAULT_VIDEO_COURSE);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [search, setSearch] = useState('');
  const [playingVideo, setPlayingVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [booting, setBooting] = useState(!hasVideoLibraryBooted);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const subjectRailRef = useRef<HTMLElement | null>(null);
  const [canRevealMoreSubjects, setCanRevealMoreSubjects] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasVideoLibraryBooted = true;
      setBooting(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const stopCourses = onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snapshot) => {
      const remote = snapshot.exists() ? snapshot.data().list || [] : [];
      const merged = [...initialCourses];
      remote.forEach((course: AcademicNavCourse) => {
        if (course.name && !merged.some((item) => item.name === course.name)) merged.push(course);
      });
      setCourses(merged);
    });
    const stopVideos = onSnapshot(query(
      collection(db, 'tutorials'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
    ), (snapshot) => {
      setRemoteVideos(snapshot.docs
        .map((item) => ({ id: item.id, ...item.data(), views: item.data().views || 0 } as VideoData))
        .filter((video) => video.approved === true));
      setLoading(false);
    }, () => {
      setRemoteVideos([]);
      setLoading(false);
    });
    return () => {
      stopCourses();
      stopVideos();
    };
  }, []);

  // Loaded on demand so the 200KB catalogue is its own chunk instead of riding
  // along in the main bundle for every visitor.
  useEffect(() => {
    let cancelled = false;
    import('../../data/zimsecTutorialsCompact.json')
      .then((module) => {
        if (cancelled) return;
        setCuratedVideos(expandCurated((module.default || module) as CompactVideo[]));
      })
      .catch(() => { /* curated list is a bonus; Firestore videos still work */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Teacher uploads first, then the curated YouTube library.
  const videos = useMemo(
    () => [...remoteVideos, ...curatedVideos],
    [remoteVideos, curatedVideos],
  );

  useEffect(() => {
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId || !videos.length) return;
    const video = videos.find((item) => item.id === videoId);
    if (video) {
      setSelectedCourse(video.grade);
      setSelectedSubject('All subjects');
      setPlayingVideo(video);
    }
  }, [videos]);

  // Adopt the form and subject from the URL, so /tutorials/form-4/mathematics
  // opens that shelf directly and the prerendered SEO pages land somewhere real.
  useEffect(() => {
    if (!courseSlug) {
      setSelectedCourse(DEFAULT_VIDEO_COURSE);
      setSelectedSubject('All subjects');
      navigate(`/tutorials/${slugifyLearningPath(DEFAULT_VIDEO_COURSE)}`, { replace: true });
      return;
    }
    const course = courses.find((item) => slugifyLearningPath(item.name) === courseSlug);
    if (!course) {
      setSelectedCourse(DEFAULT_VIDEO_COURSE);
      setSelectedSubject('All subjects');
      navigate(`/tutorials/${slugifyLearningPath(DEFAULT_VIDEO_COURSE)}`, { replace: true });
      return;
    }
    setSelectedCourse(course.name);
    if (!subjectSlug) {
      setSelectedSubject('All subjects');
      return;
    }
    const subject = videos.find(
      (video) => video.grade === course.name && slugifyLearningPath(video.subject) === subjectSlug,
    )?.subject;
    setSelectedSubject(subject || 'All subjects');
  }, [courseSlug, subjectSlug, courses, videos, navigate]);

  const subjects = useMemo(() => Array.from(new Set(
    videos.filter((video) => video.grade === selectedCourse).map((video) => video.subject)
  )), [selectedCourse, videos]);

  const subjectVideoCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All subjects': 0 };
    videos.forEach((video) => {
      if (video.grade !== selectedCourse) return;
      counts['All subjects'] += 1;
      counts[video.subject] = (counts[video.subject] || 0) + 1;
    });
    return counts;
  }, [selectedCourse, videos]);

  useEffect(() => {
    const rail = subjectRailRef.current;
    if (!rail) return;
    const update = () => {
      setCanRevealMoreSubjects(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
    };
    update();
    const frame = window.requestAnimationFrame(update);
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [subjects]);

  const visibleVideos = useMemo(() => videos.filter((video) => (
    video.grade === selectedCourse
    && (selectedSubject === 'All subjects' || video.subject === selectedSubject)
    && `${video.title} ${video.teacherName} ${video.subject}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [search, selectedCourse, selectedSubject, videos]);

  const chooseCourse = (name: string) => {
    setSelectedCourse(name);
    setSelectedSubject('All subjects');
    setSearch('');
    navigate(`/tutorials/${slugifyLearningPath(name)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep the address bar in step with the shelf being viewed so it can be
  // shared and matches the indexed URL for that form and subject.
  const chooseSubject = (subject: string) => {
    setSelectedSubject(subject);
    if (!selectedCourse) return;
    const base = `/tutorials/${slugifyLearningPath(selectedCourse)}`;
    navigate(subject === 'All subjects' ? base : `${base}/${slugifyLearningPath(subject)}`);
  };

  const openVideo = async (video: VideoData) => {
    setPlayingVideo(video);
    // Curated YouTube entries have no Firestore document to count views on.
    if (isCurated(video.id)) return;
    try {
      await updateDoc(doc(db, 'tutorials', video.id), { views: increment(1) });
    } catch {}
  };

  // What to queue up next to the player, closest match first: same subject and
  // form, then the same subject at another form, then anything else at this
  // form. Keeps a Form 3 Chemistry lesson from suggesting Form 1 Shona.
  const recommended = useMemo(() => {
    if (!playingVideo) return [];
    const others = videos.filter((v) => v.id !== playingVideo.id);
    const rank = (v: VideoData) => {
      if (v.subject === playingVideo.subject && v.grade === playingVideo.grade) return 0;
      if (v.subject === playingVideo.subject) return 1;
      if (v.grade === playingVideo.grade) return 2;
      return 3;
    };
    const seenVideo = new Set<string>();
    return others
      .map((v) => ({ v, r: rank(v) }))
      .sort((a, b) => a.r - b.r || b.v.views - a.v.views)
      .filter(({ v }) => {
        // The same lesson can be listed under two forms - show it once.
        const key = youtubeId(v.url) || v.id;
        if (seenVideo.has(key)) return false;
        seenVideo.add(key);
        return true;
      })
      .slice(0, 40)
      .map(({ v }) => v);
  }, [playingVideo, videos]);

  if (booting) {
    return (
      <div className="h-[100dvh] bg-[#081929] lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <SlideLoader label="Opening video lessons" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh_-_var(--app-header-h))] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b]">
      <AcademicLibrarySidebar
        title="Video Library"
        subtitle="Courses & subjects"
        courses={courses}
        selectedCourse={selectedCourse}
        onSelectCourse={chooseCourse}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300 lg:hidden"><Menu size={18} /></button>
            <button onClick={() => navigate('/')} className="hidden h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300 sm:flex" aria-label="Back to home"><ArrowLeft size={17} /></button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">{selectedCourse}</p>
              <h1 className="truncate text-lg font-black text-slate-900 dark:text-white">{selectedSubject}</h1>
            </div>
            <div className="relative hidden w-72 sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search videos" className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white" />
            </div>
          </div>
          <div className="relative mt-3 sm:hidden">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search videos" className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
          </div>
          <div className="relative mt-3">
            <nav ref={subjectRailRef} className="flex gap-2 overflow-x-auto pb-0.5 pr-12 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Video subjects">
              {['All subjects', ...subjects].map((subject) => (
                <button
                  key={subject}
                  onClick={() => chooseSubject(subject)}
                  className={`flex shrink-0 items-center gap-2 rounded-[9px] px-3 py-2 text-[11px] font-bold transition-colors ${selectedSubject === subject ? 'bg-violet-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-violet-400/50 dark:hover:text-white'}`}
                >
                  <span>{subject}</span>
                  <span className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-black ${selectedSubject === subject ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300'}`}>{subjectVideoCounts[subject] || 0}</span>
                </button>
              ))}
            </nav>
            {canRevealMoreSubjects && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-gradient-to-l from-white via-white/95 to-transparent dark:from-[#0c0c10] dark:via-[#0c0c10]/95">
                <button
                  type="button"
                  onClick={() => subjectRailRef.current?.scrollBy({ left: Math.max(260, subjectRailRef.current.clientWidth * 0.65), behavior: 'smooth' })}
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-transform hover:scale-105 dark:border-white/15 dark:bg-[#19191f] dark:text-white"
                  aria-label="Show more subjects"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="font-black text-slate-900 dark:text-white">Video lessons</h2><p className="text-xs text-slate-400">{visibleVideos.length} lessons available</p></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="animate-pulse"><div className="rounded-[8px] bg-slate-200 dark:bg-white/10" style={{ aspectRatio: '16 / 9' }} /><div className="mt-2 h-3 rounded bg-slate-200 dark:bg-white/10" /><div className="mt-2 h-2 w-2/3 rounded bg-slate-200 dark:bg-white/10" /></div>)}</div>
          ) : visibleVideos.length ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {visibleVideos.map((video) => (
                <button key={video.id} onClick={() => openVideo(video)} className="group min-w-0 rounded-[10px] bg-white p-1.5 text-left shadow-[0_7px_22px_rgba(15,23,42,0.09),0_1px_4px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.15),0_2px_6px_rgba(15,23,42,0.1)] dark:bg-white/[0.045] dark:ring-white/10 dark:shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                  <div className="relative overflow-hidden rounded-[8px] bg-slate-200 dark:bg-white/10" style={{ aspectRatio: '16 / 9' }}>
                    <img src={thumbnailFor(video)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
                    <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(2,6,23,0.28)] ring-1 ring-inset ring-black/10" aria-hidden="true" />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all group-hover:bg-slate-950/20 group-hover:opacity-100"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg"><Play size={13} fill="currentColor" /></span></span>
                    {formatDuration(video.duration) && <span className="absolute bottom-1 right-1 rounded-[4px] bg-black/85 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">{formatDuration(video.duration)}</span>}
                  </div>
                  <div className="mt-2 flex min-w-0 items-start gap-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-[13px] font-bold leading-[1.35] text-slate-900 dark:text-white">{video.title}</h3>
                      <p className="mt-1 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{video.teacherName}</p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{formatViews(video.views)} views · {video.subject}</p>
                    </div>
                    <span className="mt-0.5 flex h-7 w-5 shrink-0 items-start justify-center text-slate-700 dark:text-slate-300" aria-hidden="true"><MoreVertical size={17} /></span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]"><Video className="mx-auto mb-3 text-slate-300" size={28} /><p className="font-black text-slate-700 dark:text-slate-200">No videos found</p><p className="mt-1 text-sm text-slate-400">Try another subject or level.</p></div>
          )}
        </section>
      </main>
      <ResourceAdRail />

      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#08080b]">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-[#101014] md:px-5">
            <button onClick={() => setPlayingVideo(null)} className="flex h-10 shrink-0 items-center gap-2 rounded-[11px] bg-slate-100 px-3 text-xs font-black text-slate-600 dark:bg-white/5 dark:text-slate-200">
              <ArrowLeft size={17} /> <span className="hidden sm:inline">Back to videos</span>
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-900 dark:text-white">{playingVideo.title}</p>
              <p className="truncate text-[10px] font-bold text-slate-400">{playingVideo.subject} · {playingVideo.grade}</p>
            </div>
          </header>
          {/* YouTube-style watch layout: player column on the left, a rail of
              related lessons on the right. The rail drops below the video on
              narrow screens so the player always gets the full width there. */}
          <main className="min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#08080b]">
            <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 p-3 md:p-5 xl:flex-row">
              <div className="min-w-0 flex-1">
                {/* Capped by viewport height so the 16:9 frame can never run
                    past the bottom of the screen on a wide monitor. */}
                <div className="mx-auto w-full max-w-[min(100%,calc((100vh-12rem)*16/9))] overflow-hidden rounded-xl bg-black">
                  {/* aspectRatio is set inline on purpose. This app loads Tailwind
                      from the CDN with the legacy aspect-ratio plugin, which does
                      NOT emit the core `aspect-video` utility - it computes to
                      `aspect-ratio: auto`, collapsing the player to zero height. */}
                  <div className="w-full" style={{ aspectRatio: '16 / 9' }}>
                    {youtubeId(playingVideo.url)
                      ? <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${youtubeId(playingVideo.url)}?autoplay=1&rel=0`} title={playingVideo.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                      : <video className="h-full w-full" src={playingVideo.url} controls autoPlay />}
                  </div>
                </div>

                <div className="mt-4">
                  <h1 className="text-lg font-black leading-snug text-slate-900 dark:text-white md:text-xl">{playingVideo.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-black text-white">{playingVideo.subject}</span>
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-500 dark:border-white/10 dark:text-slate-400">{playingVideo.grade}</span>
                    <span>{playingVideo.teacherName}</span>
                    <span className="flex items-center gap-1"><Eye size={13} /> {playingVideo.views.toLocaleString()} views</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> Lesson</span>
                  </div>
                  {playingVideo.description && (
                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">{playingVideo.description}</p>
                  )}
                </div>
              </div>

              <aside className="w-full shrink-0 xl:w-[402px]">
                <h2 className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">Up next</h2>
                <div className="flex flex-col gap-2">
                  {recommended.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => openVideo(video)}
                      className="group flex gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <div className="relative w-[168px] shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-white/10" style={{ aspectRatio: '16 / 9' }}>
                        <img src={thumbnailFor(video)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <p className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900 dark:text-white">{video.title}</p>
                        <p className="mt-1 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{video.teacherName}</p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">{video.subject} · {video.grade}</p>
                      </div>
                    </button>
                  ))}
                  {!recommended.length && (
                    <p className="text-xs font-semibold text-slate-400">No other lessons yet.</p>
                  )}
                </div>
              </aside>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
