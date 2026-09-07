import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  Search,
  PlayCircle,
  X,
  ThumbsUp,
  Share2,
  Check,
  Bell,
  ArrowLeft,
  Video,
  BookOpen,
  ChevronRight,
  Loader2,
  LayoutGrid,
  Star,
  Zap,
  Play,
  Eye,
  Clock,
  TrendingUp,
  Flame,
  Globe,
  Sparkles,
  ChevronDown,
  BarChart2,
  Award,
  Users,
  Volume2,
  Maximize2,
  SkipForward,
  Heart
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

/* ===================== TYPES ===================== */

interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  subject: string;
  grade: string;
  teacherName: string;
  teacherId: string;
  description?: string;
  topic?: string;
  views: number;
  likes?: number;
  isRecommended?: boolean;
  approved?: boolean;
  createdAt: any;
}

interface AcademicLevel {
  name: string;
  category: string;
}

interface SubjectStat {
  name: string;
  videoCount: number;
}

/* ===================== HELPERS ===================== */

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
    if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
    if (parsed.pathname.includes('/embed/')) return parsed.pathname.split('/embed/')[1];
    return null;
  } catch {
    return null;
  }
};

const getThumbnail = (url: string) => {
  const id = getYouTubeVideoId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop';
};

/* ===================== CURSOR GLOW ===================== */
const CursorGlow: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 9999,
        width: 384,
        height: 384,
        borderRadius: '50%' }}
    />
  );
};

/* ===================== NOISE TEXTURE ===================== */
const NoiseOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px' }}
  />
);

/* ===================== LOADER ===================== */
const ShapeLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: '#02000A' }}
    >
      {/* Orbital rings */}
      {[140, 200, 260].map((size, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: [0, 0.3, 0.3, 0], rotate: 360 }}
          transition={{ duration: 3, delay: i * 0.15, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: `1px solid rgba(139,92,246,${0.4 - i * 0.1})`,
            borderTopColor: 'transparent' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.3, 1], rotate: [-180, 20, 0] }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        onAnimationComplete={onComplete}
        className="relative"
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(124,58,237,0.8), 0 0 120px rgba(124,58,237,0.3)' }}
        >
          <Play size={36} className="text-white fill-current translate-x-0.5" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: '0.5em',
          color: 'rgba(139,92,246,0.6)',
          textTransform: 'uppercase',
          fontFamily: 'monospace' }}
      >
        Loading Experience...
      </motion.p>
    </motion.div>
  );
};

/* ===================== MAGNETIC BUTTON ===================== */
const MagneticButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ===================== VIDEO CARD ===================== */
const VideoCard: React.FC<{ video: VideoData; index: number; onClick: () => void }> = ({ video, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-lg mb-2 md:mb-4" style={{ aspectRatio: '16/9' }}>
        <motion.img
          src={getThumbnail(video.url)}
          alt={video.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
        />

        {/* Play button */}
        <motion.div
          animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl"
          >
            <Play size={18} className="text-black fill-current translate-x-0.5 md:scale-125" />
          </div>
        </motion.div>

        {/* Duration */}
        <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 bg-black/90 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:py-0.5 rounded backdrop-blur-sm">
          12:45
        </div>

        {/* Recommended badge */}
        {video.isRecommended && (
          <div
            className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex items-center gap-1 text-[7px] md:text-[9px] font-black uppercase tracking-wider px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full"
            style={{ background: 'linear-gradient(90deg, #F59E0B, #EF4444)', color: 'white' }}
          >
            <Flame size={8} fill="currentColor" className="md:size-[9px]" /> Hot
          </div>
        )}

        {/* Subject pill */}
        <div
          className="absolute top-1.5 right-1.5 md:top-2 md:right-2 text-[7px] md:text-[9px] font-bold uppercase tracking-wider px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full backdrop-blur-md"
          style={{ background: 'rgba(139,92,246,0.9)', color: 'white' }}
        >
          {video.subject}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-2 md:gap-3">
        <div
          className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-black shadow-lg"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
        >
          {video.teacherName?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-[11px] md:text-sm line-clamp-2 leading-tight md:leading-snug mb-0.5 md:mb-1.5 transition-colors duration-200"
            style={{ color: hovered ? '#A78BFA' : 'var(--text-primary)' }}
          >
            {video.title}
          </h3>
          <p className="text-[10px] md:text-xs" style={{ color: 'var(--text-muted)' }}>{video.teacherName}</p>
          <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
            <span className="text-[10px] md:text-xs" style={{ color: 'var(--text-muted)' }}>
              <Eye size={9} className="inline mr-1 opacity-60 md:size-[10px]" />
              {video.views.toLocaleString()}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 8 }}>•</span>
            <span className="text-[10px] md:text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(video.createdAt?.toDate?.() || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export const Tutorials: React.FC = () => {
  const { user } = useAuth();

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [courses, setCourses] = useState<AcademicLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideo, setPlayingVideo] = useState<VideoData | null>(null);

  const [teacherSubscriberCount, setTeacherSubscriberCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);

  const [heroKey, setHeroKey] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Only fade hero on scroll - NOT on re-mount (heroOpacity stays 1 unless scrolled)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  /* ===================== DATA FETCHING ===================== */
  useEffect(() => {
    const unsubHierarchy = onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snap) => {
      if (snap.exists()) setCourses(snap.data().list || []);
    });
    const q = query(
      collection(db, 'tutorials'),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
    );
    const unsubTutorials = onSnapshot(q, snap => {
      const list: VideoData[] = [];
      snap.forEach(d => {
        if (d.data().approved !== true) return;
        list.push({
        id: d.id,
        ...d.data(),
        likes: d.data().likes || 0,
        views: d.data().views || 0,
        isRecommended: d.data().isRecommended || false
        } as VideoData);
      });
      setVideos(list);
      setLoading(false);
    }, () => {
      setVideos([]);
      setLoading(false);
    });
    return () => { unsubHierarchy(); unsubTutorials(); };
  }, []);

  // Auto-play video from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('v');
    if (videoId && videos.length > 0 && !playingVideo) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        handleVideoClick(video);
      }
    }
  }, [videos, playingVideo]);

  useEffect(() => {
    const fetchTeacherStats = async () => {
      if (!playingVideo) return;
      try {
        const teacherDoc = await getDoc(doc(db, 'users', playingVideo.teacherId));
        if (teacherDoc.exists()) setTeacherSubscriberCount(teacherDoc.data().subscriberCount || 0);
      } catch (e) { console.error(e); }
    };
    fetchTeacherStats();
  }, [playingVideo]);

  /* ===================== AGGREGATIONS ===================== */
  const getSubjectsForCourse = useMemo(() => {
    if (!selectedCourse) return [];
    const stats: Record<string, number> = {};
    videos.filter(v => v.grade === selectedCourse).forEach(v => {
      stats[v.subject] = (stats[v.subject] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, videoCount: count }));
  }, [videos, selectedCourse]);

  const courseStats = useMemo(() => {
    const stats: Record<string, { videoCount: number; subjectCount: number }> = {};
    videos.forEach(v => {
      if (!stats[v.grade]) stats[v.grade] = { videoCount: 0, subjectCount: 0 };
      stats[v.grade].videoCount += 1;
    });
    Object.keys(stats).forEach(gradeName => {
      const subjectsInGrade = new Set(videos.filter(v => v.grade === gradeName).map(v => v.subject));
      stats[gradeName].subjectCount = subjectsInGrade.size;
    });
    return stats;
  }, [videos]);

  const filteredVideos = videos.filter(v => {
    const matchesCourse = selectedCourse === v.grade;
    const matchesSubject = !selectedSubject || selectedSubject === 'All' || v.subject === selectedSubject;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSubject && matchesSearch;
  });

  /* ===================== ACTIONS ===================== */
  const handleCourseClick = (courseName: string) => {
    setSelectedCourse(courseName);
    setSelectedSubject('All');
    setShowSubjectModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setShowSubjectModal(false);
  };

  const handleVideoClick = async (video: VideoData) => {
    setPlayingVideo(video);
    setIsLiked(false);
    setIsSubscribed(false);
    try {
      await updateDoc(doc(db, 'tutorials', video.id), { views: increment(1) });
      await updateDoc(doc(db, 'users', video.teacherId), { totalViews: increment(1) });
    } catch (e) { console.error(e); }
  };

  const handleRecommend = async () => {
    if (!user || !playingVideo) return alert("Please login to recommend videos");
    setIsRecommending(true);
    try {
      await updateDoc(doc(db, 'tutorials', playingVideo.id), { isRecommended: true });
      alert("Video recommended to others!");
    } catch (e) { console.error(e); }
    setIsRecommending(false);
  };

  const handleLike = async () => {
    if (!user || !playingVideo) return alert("Please login to like videos");
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    try {
      await updateDoc(doc(db, 'tutorials', playingVideo.id), { likes: increment(newLikedState ? 1 : -1) });
      await updateDoc(doc(db, 'users', playingVideo.teacherId), { totalLikes: increment(newLikedState ? 1 : -1) });
    } catch (e) { console.error(e); }
  };

  const handleSubscribe = async () => {
    if (!user || !playingVideo) return alert("Please login to subscribe");
    setIsSubscribed(prev => !prev);
    setTeacherSubscriberCount(prev => isSubscribed ? prev - 1 : prev + 1);
    try {
      await updateDoc(doc(db, 'users', playingVideo.teacherId), { subscriberCount: increment(isSubscribed ? -1 : 1) });
    } catch (e) { console.error(e); }
  };

  /* ===================== CSS VARIABLES ===================== */
  const cssVars = `
    :root {
      --bg-deep: #02000A;
      --bg-surface: #06040F;
      --bg-card: #0A0716;
      --bg-card-hover: #0F0B1F;
      --border: rgba(139,92,246,0.12);
      --border-hover: rgba(139,92,246,0.35);
      --accent: #7C3AED;
      --accent-light: #A78BFA;
      --accent-glow: rgba(124,58,237,0.4);
      --text-primary: #F1EDFF;
      --text-secondary: #9B92B8;
      --text-muted: #5C5478;
      --font-display: 'Bebas Neue', 'Impact', sans-serif;
      --font-body: 'DM Sans', 'Helvetica Neue', sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    html.light .tutorials-root {
      --bg-deep: #F8F7FF;
      --bg-surface: #FFFFFF;
      --bg-card: #FFFFFF;
      --bg-card-hover: #F3F0FF;
      --border: rgba(124,58,237,0.1);
      --border-hover: rgba(124,58,237,0.3);
      --text-primary: #1A1625;
      --text-secondary: #4A4458;
      --text-muted: #7D748F;
    }
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

    .tutorials-root * { box-sizing: border-box; }
    .tutorials-root { font-family: var(--font-body); }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }
    .text-primary { color: var(--text-primary); }
    .text-secondary { color: var(--text-secondary); }
    .text-muted-t { color: var(--text-muted); }
    .bg-card { background: var(--bg-card); }

    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    .glow-line {
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, #A78BFA 0%, #F1EDFF 40%, #A78BFA 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @keyframes grid-move {
      0% { transform: translateY(0); }
      100% { transform: translateY(40px); }
    }

    .perspective-card {
      transition: transform 0.4s ease, box-shadow 0.4s ease;
      transform-style: preserve-3d;
    }
    .perspective-card:hover {
      transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) translateY(-8px);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.2);
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
  `;

  /* ===================== RENDER WATCH PAGE ===================== */
  if (playingVideo) {
    const videoId = getYouTubeVideoId(playingVideo.url);
    return (
      <div
        className="tutorials-root fixed inset-0 z-[100] overflow-y-auto hide-scroll"
        style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}
      >
        <style>{cssVars}</style>
        <NoiseOverlay />
        <CursorGlow />

        {/* Header */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(2,0,10,0.85)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setPlayingVideo(null)}
              className="group flex items-center justify-center w-10 h-10 rounded-lg transition-all"
              style={{ border: '1px solid var(--border)', background: 'rgba(139,92,246,0.05)' }}
            >
              <ArrowLeft size={18} style={{ color: 'var(--text-secondary)' }} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
              >
                <Play size={14} className="text-white fill-current" />
              </div>
              <h2
                className="font-semibold truncate text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {playingVideo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRecommend}
              disabled={isRecommending || playingVideo.isRecommended}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all"
              style={{
                background: playingVideo.isRecommended
                  ? 'rgba(16,185,129,0.2)'
                  : 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                color: playingVideo.isRecommended ? '#34D399' : 'white',
                border: playingVideo.isRecommended ? '1px solid rgba(52,211,153,0.3)' : 'none',
                boxShadow: playingVideo.isRecommended ? 'none' : '0 4px 24px rgba(124,58,237,0.4)' }}
            >
              {playingVideo.isRecommended ? <Check size={12} /> : <Zap size={12} fill="currentColor" />}
              <span className="hidden sm:inline">{playingVideo.isRecommended ? 'Recommended' : 'Recommend'}</span>
            </button>
            <button
              onClick={() => setPlayingVideo(null)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-w-[1700px] mx-auto p-4 md:p-8 grid lg:grid-cols-12 gap-8">
          {/* Player Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Player */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 8,
                aspectRatio: '16/9',
                background: '#000',
                boxShadow: '0 0 0 1px var(--border), 0 40px 80px rgba(0,0,0,0.8), 0 0 120px rgba(124,58,237,0.15)' }}
            >
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid var(--border)' }}
                  >
                    <PlayCircle size={40} style={{ color: 'var(--accent-light)' }} />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
                    Embed Restricted
                  </p>
                  <a
                    href={playingVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all"
                    style={{ background: 'linear-gradient(90deg, #7C3AED, #4F46E5)', color: 'white' }}
                  >
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-6">
              <h1
                className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                {playingVideo.title}
              </h1>

              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                {/* Teacher info */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                      boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
                  >
                    {playingVideo.teacherName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{playingVideo.teacherName}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {teacherSubscriberCount.toLocaleString()} subscribers
                    </p>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="ml-2 px-5 py-2 rounded-full text-xs font-bold transition-all"
                    style={isSubscribed
                      ? { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                      : { background: 'var(--text-primary)', color: 'var(--bg-deep)' }
                    }
                  >
                    {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: isLiked ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                      color: isLiked ? 'var(--accent-light)' : 'var(--text-secondary)',
                      border: `1px solid ${isLiked ? 'rgba(124,58,237,0.4)' : 'var(--border)'}` }}
                  >
                    <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
                    <span>{playingVideo.likes || 0}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    <Star size={14} /> Save
                  </button>
                </div>
              </div>

              {/* Description */}
              <div
                className="p-5 rounded-lg"
                style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {playingVideo.views.toLocaleString()} views
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>•</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date(playingVideo.createdAt?.toDate?.() || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {playingVideo.description || 'In this lesson, we cover key concepts and exam strategies to help you excel in your studies.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="flex gap-2 overflow-x-auto hide-scroll pb-1"
            >
              {['All', 'Related', 'New', 'Popular'].map(tag => (
                <button
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: tag === 'All' ? 'var(--text-primary)' : 'rgba(255,255,255,0.04)',
                    color: tag === 'All' ? 'var(--bg-deep)' : 'var(--text-secondary)',
                    border: '1px solid var(--border)' }}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {videos.filter(v => v.id !== playingVideo.id).slice(0, 15).map(v => (
                <div
                  key={v.id}
                  onClick={() => handleVideoClick(v)}
                  className="group flex gap-3 cursor-pointer rounded-xl p-2 -m-2 transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="relative w-40 shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img src={getThumbnail(v.url)} className="w-full h-full object-cover" alt={v.title} />
                    <div
                      className="absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(0,0,0,0.85)', color: 'white' }}
                    >
                      12:45
                    </div>
                  </div>
                  <div className="min-w-0 flex flex-col py-0.5">
                    <h4
                      className="font-semibold text-[13px] line-clamp-2 leading-tight mb-1 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {v.title}
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.teacherName}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {v.views.toLocaleString()} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== SUBJECT SELECTION PAGE ===================== */
  const SubjectSelectionPage = () => (
    <div
      className="tutorials-root fixed inset-0 z-[110] flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}
    >
      <style>{cssVars}</style>
      <NoiseOverlay />
      <CursorGlow />

      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-20" style={{ background: 'radial-gradient(circle, #4F46E5, transparent)' }} />

      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8 py-6 relative z-10"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => { setSelectedCourse(null); setShowSubjectModal(false); setHeroKey(k => k + 1); }}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-mono text-xs uppercase tracking-widest"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              background: 'rgba(139,92,246,0.04)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em] mb-1"
              style={{ color: 'var(--accent-light)' }}
            >
              Choose Subject
            </p>
            <h2
              className="font-display text-5xl md:text-7xl uppercase leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              {selectedCourse}
            </h2>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto hide-scroll p-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* View All */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            onClick={() => handleSubjectSelect('All')}
            className="perspective-card relative flex flex-col p-8 rounded-3xl text-left overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              minHeight: 220,
              border: '1px solid rgba(139,92,246,0.5)' }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }}
            />
            <div className="mb-auto">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <LayoutGrid size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-display text-4xl uppercase text-white mb-1">View All</h4>
              <p className="text-xs font-mono text-white/60 uppercase tracking-widest">
                {videos.filter(v => v.grade === selectedCourse).length} Videos
              </p>
            </div>
          </motion.button>

          {getSubjectsForCourse.map((sub, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => handleSubjectSelect(sub.name)}
              className="perspective-card relative flex flex-col p-8 rounded-lg text-left overflow-hidden group"
              style={{
                background: 'var(--bg-card)',
                minHeight: 220,
                border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(139,92,246,0.15), transparent)' }}
              />
              <div className="mb-auto">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  <BookOpen size={22} style={{ color: 'var(--accent-light)' }} />
                </div>
              </div>
              <div>
                <h4
                  className="font-display text-3xl md:text-4xl uppercase mb-1 transition-colors"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {sub.name}
                </h4>
                <p
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {sub.videoCount} Videos
                </p>
              </div>
              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ===================== VIDEO LISTING PAGE ===================== */
  if (selectedCourse && !showSubjectModal) {
    return (
      <div
        className="tutorials-root min-h-screen"
        style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}
      >
        <style>{cssVars}</style>
        <NoiseOverlay />
        <CursorGlow />

        {/* Top Bar */}
        <div
          className="sticky top-0 z-40 flex flex-col md:flex-row md:items-center gap-4 px-6 py-4"
          style={{
            background: 'rgba(2,0,10,0.9)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedCourse(null); setHeroKey(k => k + 1); }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1
                className="font-display text-2xl md:text-3xl uppercase"
                style={{ letterSpacing: '-0.01em' }}
              >
                {selectedSubject === 'All' ? `${selectedCourse}` : selectedSubject}
              </h1>
              <p
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                {selectedCourse} · {selectedSubject} · {filteredVideos.length} lessons
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowSubjectModal(true)}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              background: 'rgba(139,92,246,0.04)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            Change Subject
          </button>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid var(--border)' }}
              >
                <Loader2 className="animate-spin" size={28} style={{ color: 'var(--accent-light)' }} />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Loading lessons...
              </p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-6 md:gap-y-10">
              {filteredVideos.map((v, idx) => (
                <VideoCard key={v.id} video={v} index={idx} onClick={() => handleVideoClick(v)} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid var(--border)' }}
              >
                <Video size={36} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="font-display text-3xl uppercase mb-2">No lessons found</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Try a different search or subject.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ===================== COURSE SELECTION (HOME) ===================== */

  const totalVideos = videos.length;
  const totalSubjects = new Set(videos.map(v => v.subject)).size;
  const totalTeachers = new Set(videos.map(v => v.teacherId)).size;

  return (
    <div
      className="tutorials-root min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg-deep)', color: 'var(--text-primary)' }}
    >
      <style>{cssVars}</style>
      <NoiseOverlay />
      <CursorGlow />

      {/* Initial Loader */}
      <AnimatePresence>
        {showInitialLoader && <ShapeLoader onComplete={() => setShowInitialLoader(false)} />}
      </AnimatePresence>

      {/* Subject Selection Modal */}
      {showSubjectModal && <SubjectSelectionPage />}

      {/* ---- HERO ---- */}
      <div
        key={heroKey}
        ref={heroRef}
        className="relative w-full overflow-hidden flex items-center justify-center py-32 md:py-48"
      >
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co/rfvwxmGn/es-heroo.jpg" 
            alt="Academic Background" 
            className="w-full h-full object-cover grayscale-[20%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[var(--bg-deep)]"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10 z-[1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px' }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20"
          >
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Academic Video Library</span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase text-white">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Anything.</span>
          </h1>

          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Access thousands of curriculum-based video lessons curated from top educators worldwide. Simple, professional, and effective learning.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: totalVideos, label: 'Lessons' },
              { value: totalSubjects, label: 'Subjects' },
              { value: totalTeachers, label: 'Educators' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---- COURSES GRID ---- */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 pb-40">

        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em] mb-2"
              style={{ color: 'var(--accent-light)' }}
            >
              01 — Programs
            </p>
            <h2
              className="font-display text-4xl md:text-6xl uppercase"
              style={{ letterSpacing: '-0.02em' }}
            >
              Choose Your Path
            </h2>
          </div>
          <p
            className="hidden md:block text-sm font-mono pb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {courses.length} programs available
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, idx) => {
            const stats = courseStats[course.name] || { videoCount: 0, subjectCount: 0 };
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleCourseClick(course.name)}
                className="perspective-card group relative flex flex-col text-left overflow-hidden rounded-lg p-8 md:p-10"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  minHeight: 280,
                  transition: 'all 0.4s ease' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                }}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top right, rgba(124,58,237,0.12), transparent 70%)' }}
                />

                {/* Top */}
                <div className="flex justify-between items-start mb-auto">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: 'rgba(139,92,246,0.08)',
                      border: '1px solid rgba(139,92,246,0.15)' }}
                  >
                    <Video size={26} style={{ color: 'var(--accent-light)' }} />
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                    style={{
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)' }}
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* Title */}
                <div className="mt-12">
                  <h3
                    className="font-display text-3xl md:text-5xl uppercase mb-1 group-hover:text-transparent transition-all duration-300"
                    style={{
                      letterSpacing: '-0.02em',
                      backgroundImage: 'linear-gradient(90deg, var(--accent-light), #818CF8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'inherit' }}
                    // We just set regular color and let hover apply gradient via class trick below
                  >
                    {course.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-px"
                      style={{ background: 'var(--accent)' }}
                    />
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {course.category}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="mt-8 pt-6 flex gap-8"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div>
                    <span
                      className="font-display"
                      style={{ fontSize: 36, letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {stats.videoCount}
                    </span>
                    <p
                      className="font-mono text-[9px] uppercase tracking-widest mt-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Lessons
                    </p>
                  </div>
                  <div>
                    <span
                      className="font-display"
                      style={{ fontSize: 36, letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {stats.subjectCount}
                    </span>
                    <p
                      className="font-mono text-[9px] uppercase tracking-widest mt-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Subjects
                    </p>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                  style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
                />
              </motion.button>
            );
          })}
        </div>

        {!loading && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center rounded-3xl"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
          >
            <LayoutGrid size={52} className="mx-auto mb-6" style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-display text-3xl uppercase" style={{ color: 'var(--text-secondary)' }}>
              No Courses Yet
            </h3>
          </motion.div>
        )}
      </div>

      {/* ---- FOOTER ---- */}
      <div
        className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.5em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Exam Sidemann · Lessons Platform
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}
          />
          <p
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Live
          </p>
        </div>
      </div>
    </div>
  );
};
