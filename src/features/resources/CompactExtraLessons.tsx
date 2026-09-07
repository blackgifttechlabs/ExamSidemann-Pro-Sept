import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  GraduationCap,
  Layers3,
  Lock,
  MapPin,
  Menu,
  Search,
  Send,
  Sparkles,
  Star,
  Wrench,
  Users,
  X,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { CollapsibleResourceSidebar } from './CollapsibleResourceSidebar';

type ClassData = {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherImage?: string;
  level?: string;
  timetable: string;
  price: number;
  period: 'week' | 'month' | 'term';
  currency: 'USD' | 'ZIG';
  students: string[];
  description?: string;
  province?: string;
  city?: string;
  rating?: number;
  ratingsCount?: number;
  approved?: boolean;
};

type TeacherListing = {
  id: string;
  name: string;
  image?: string;
  classes: ClassData[];
  location: string;
  rating?: number;
  ratingsCount: number;
};

type Props = {
  onNavigate: (page: string, params?: any) => void;
  onLoginRequest: () => void;
};

const LEVEL_SUBJECTS = {
  ZJC: [
    'Mathematics', 'English Language', 'Shona', 'Ndebele', 'Combined Science',
    'Geography', 'History', 'Agriculture', 'Heritage Studies', 'Computer Science',
  ],
  'O Level': [
    'Mathematics', 'English Language', 'Combined Science', 'Biology', 'Chemistry',
    'Physics', 'Computer Science', 'Geography', 'History', 'Business Studies',
    'Accounting', 'Economics',
  ],
  'A Level': [
    'Pure Mathematics', 'Statistics', 'Biology', 'Chemistry', 'Physics',
    'Computer Science', 'Geography', 'History', 'Business Studies', 'Accounting', 'Economics',
  ],
  Polytechnic: [
    'VB.NET', 'C++', 'C#', 'SQL DATABASE', 'CSM', 'OPERATING SYSTEM ADMIN',
    'TECHNICAL DRAWING', 'AUTOCAD', 'WEB DEVELOPMENT',
  ],
} as const;

type EducationLevel = keyof typeof LEVEL_SUBJECTS;

const LEVEL_OPTIONS: Array<{ name: EducationLevel; description: string; icon: typeof BookOpen }> = [
  { name: 'ZJC', description: 'Forms 1 and 2', icon: BookOpen },
  { name: 'O Level', description: 'Forms 3 and 4', icon: Layers3 },
  { name: 'A Level', description: 'Lower and Upper 6', icon: GraduationCap },
  { name: 'Polytechnic', description: 'Technical and practical', icon: Wrench },
];

const SUBJECT_ALIASES: Record<string, string[]> = {
  'VB.NET': ['VB.NET', 'Visual Basic', 'Visual Basic .NET'],
  'C++': ['C++', 'CPP'],
  'C#': ['C#', 'C Sharp'],
  'SQL DATABASE': ['SQL Database', 'Database Concepts', 'Database Administration'],
  CSM: ['CSM', 'Computer Systems Maintenance'],
  'OPERATING SYSTEM ADMIN': ['Operating System Admin', 'Operating Systems Administration'],
  'TECHNICAL DRAWING': ['Technical Drawing', 'Technical Graphics'],
  AUTOCAD: ['AutoCAD', 'CAD'],
  'WEB DEVELOPMENT': ['Web Development', 'Web Design', 'Frontend Development', 'Front End Development'],
};

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/\+\+/g, 'pp')
  .replace(/#/g, '-sharp')
  .replace(/\./g, '-')
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const titleFromSlug = (value: string) => value
  .split('-')
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

const PRACTICAL_SUBJECT_IMAGES: Record<string, string> = {
  'VB.NET': '/images/extra-lessons/vb.png',
  'C++': '/images/extra-lessons/cppp.png',
  'C#': '/images/extra-lessons/csharp.png',
  'SQL DATABASE': '/images/extra-lessons/sql.png',
  CSM: '/images/extra-lessons/csm.png',
  'OPERATING SYSTEM ADMIN': '/images/extra-lessons/operatingadmin.png',
  'TECHNICAL DRAWING': '/images/extra-lessons/technicaldrawing.png',
  AUTOCAD: '/images/extra-lessons/autocad.png',
  'WEB DEVELOPMENT': '/images/prac/webdesign.png',
};

const HIGH_SCHOOL_SUBJECT_IMAGES: Record<string, string> = {
  'Pure Mathematics': '/images/extra-lessons/pure-maths.jpeg',
  Statistics: '/images/extra-lessons/statistics.webp',
  Biology: '/images/extra-lessons/biology.jpg',
  Chemistry: '/images/extra-lessons/chemistry.jpg',
  Physics: '/images/extra-lessons/physics.jpeg',
  'Computer Science': '/images/extra-lessons/computerscience.webp',
  Geography: '/images/extra-lessons/geography.jpg',
  History: '/images/extra-lessons/history.jpeg',
  'Business Studies': '/images/extra-lessons/business%20studeies.jpeg',
  Economics: '/images/extra-lessons/economist.jpeg',
};

const imageForSubject = (subject: string) => {
  if (PRACTICAL_SUBJECT_IMAGES[subject]) return PRACTICAL_SUBJECT_IMAGES[subject];
  if (HIGH_SCHOOL_SUBJECT_IMAGES[subject]) return HIGH_SCHOOL_SUBJECT_IMAGES[subject];
  const value = subject.toLowerCase();
  if (/math|statistic/.test(value)) return '/images/extra-lessons/mathematics.jpg';
  if (/biology|chemistry|physics|science|agriculture/.test(value)) return '/images/extra-lessons/science.jpg';
  if (/computer|technology|software|ict|coding|vb|c\+\+|c#|sql|database|systems maintenance|operating system|technical drawing|autocad|csm/.test(value)) return '/images/extra-lessons/technology.jpg';
  if (/english|shona|language|literature|french/.test(value)) return '/images/extra-lessons/languages.jpg';
  if (/geography|history|heritage|religious/.test(value)) return '/images/extra-lessons/humanities.jpg';
  if (/business|economics|commerce|accounting/.test(value)) return '/images/extra-lessons/business.jpg';
  return '/images/extra-lessons/languages.jpg';
};

const usesPracticalImage = (subject: string) => Boolean(PRACTICAL_SUBJECT_IMAGES[subject]);

const containsPracticalImage = (subject: string) => (
  subject === 'CSM' || subject === 'TECHNICAL DRAWING' || subject === 'AUTOCAD'
);

const teacherKey = (item: ClassData) => item.teacherId || item.teacherName;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const subjectMatches = (actual: string, selected: string) => {
  const acceptedNames = SUBJECT_ALIASES[selected] || [selected];
  return acceptedNames.some((name) => normalize(name) === normalize(actual));
};

const classMatchesLevel = (item: ClassData, level: EducationLevel) => {
  if (!item.level) return true;
  const value = normalize(item.level);
  if (level === 'ZJC') return /(^| )(zjc|form 1|form 2)( |$)/.test(value);
  if (level === 'O Level') return /(^| )(o level|form 3|form 4)( |$)/.test(value);
  if (level === 'A Level') return /(^| )(a level|lower 6|upper 6|form 5|form 6)( |$)/.test(value);
  return /(^| )(polytechnic|nc|nd)( |$)/.test(value);
};

export const CompactExtraLessons: React.FC<Props> = ({ onNavigate, onLoginRequest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subjectSlug } = useParams<{ subjectSlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('All provinces');
  const [maxPrice, setMaxPrice] = useState('');
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const snapshot = await getDocs(query(
          collection(db, 'classes'),
          where('approved', '==', true),
        ));
        setClasses(snapshot.docs
          .map((item) => ({
            id: item.id,
            students: [],
            ...item.data(),
          } as ClassData))
          .filter((item) => item.approved === true));
      } catch (error) {
        console.error('Could not load approved extra lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadClasses();
  }, []);

  const activeLevel = useMemo<EducationLevel>(() => {
    const levelSlug = searchParams.get('level');
    return LEVEL_OPTIONS.find((item) => slugify(item.name) === levelSlug)?.name || 'O Level';
  }, [searchParams]);

  const subjects = useMemo(() => [...LEVEL_SUBJECTS[activeLevel]], [activeLevel]);

  const activeSubject = useMemo(() => {
    if (!subjectSlug) return null;
    return subjects.find((subject) => slugify(subject) === subjectSlug) || titleFromSlug(subjectSlug);
  }, [subjectSlug, subjects]);

  const provinces = useMemo(() => Array.from(new Set(
    classes.map((item) => item.province).filter(Boolean),
  )) as string[], [classes]);

  const subjectCards = useMemo(() => subjects
    .map((subject) => ({
      subject,
      teacherCount: new Set(
        classes
          .filter((item) => subjectMatches(item.subject, subject) && classMatchesLevel(item, activeLevel))
          .map(teacherKey)
          .filter(Boolean),
      ).size,
    }))
    .filter((item) => item.subject.toLowerCase().includes(search.trim().toLowerCase())), [activeLevel, classes, search, subjects]);

  const visibleClasses = useMemo(() => classes.filter((item) => (
    (!activeSubject || subjectMatches(item.subject, activeSubject))
    && classMatchesLevel(item, activeLevel)
    && (province === 'All provinces' || item.province === province)
    && (!maxPrice || item.price <= Number(maxPrice))
    && `${item.name} ${item.teacherName} ${item.subject}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [activeLevel, activeSubject, classes, maxPrice, province, search]);

  const teachers = useMemo(() => {
    const grouped = new Map<string, ClassData[]>();
    visibleClasses.forEach((item) => {
      const key = teacherKey(item);
      grouped.set(key, [...(grouped.get(key) || []), item]);
    });

    return Array.from(grouped.entries()).map(([id, teacherClasses]): TeacherListing => {
      const ratings = teacherClasses.filter((item) => typeof item.rating === 'number');
      const ratingsCount = teacherClasses.reduce((total, item) => total + (item.ratingsCount || 0), 0);
      return {
        id,
        name: teacherClasses[0]?.teacherName || 'Teacher',
        image: teacherClasses[0]?.teacherImage,
        classes: teacherClasses,
        location: [teacherClasses[0]?.city, teacherClasses[0]?.province].filter(Boolean).join(', '),
        rating: ratings.length
          ? ratings.reduce((total, item) => total + (item.rating || 0), 0) / ratings.length
          : undefined,
        ratingsCount,
      };
    }).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [visibleClasses]);

  const openSubject = (subject: string) => {
    setSearch('');
    setExpandedTeacher(null);
    setSidebarOpen(false);
    navigate(`/extra-lessons/${slugify(subject)}/?level=${slugify(activeLevel)}`);
  };

  const selectLevel = (level: EducationLevel) => {
    setSearch('');
    setSearchParams({ level: slugify(level) }, { replace: true });
  };

  const catalogPath = `/extra-lessons/?level=${slugify(activeLevel)}`;

  const openClass = (item: ClassData) => {
    if (user && (item.students?.includes(user.uid) || item.teacherId === user.uid)) {
      onNavigate('classroom', { classId: item.id });
      return;
    }
    setSelectedClass(item);
    setRequestStatus('idle');
  };

  const requestAccess = async () => {
    if (!user || !selectedClass) {
      onLoginRequest();
      return;
    }
    setRequestStatus('sending');
    try {
      await updateDoc(doc(db, 'classes', selectedClass.id), { pendingRequests: arrayUnion(user.uid) });
      const chatId = [user.uid, selectedClass.teacherId].sort().join('_');
      await addDoc(collection(db, 'direct_messages'), {
        text: `Hi ${selectedClass.teacherName}, I would like to join your class: ${selectedClass.name}.`,
        senderId: user.uid,
        receiverId: selectedClass.teacherId,
        chatId,
        timestamp: serverTimestamp(),
        read: false,
      });
      setRequestStatus('sent');
    } catch {
      setRequestStatus('idle');
    }
  };

  return (
    <div className="flex h-[calc(100dvh_-_var(--app-header-h))] overflow-hidden bg-[#f3f5f8] text-left dark:bg-[#08080b]">
      <CollapsibleResourceSidebar
        title="Extra Lessons"
        subtitle="Teacher marketplace"
        icon={Sparkles}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showPageHeader={false}
        collapsedActions={[
          { label: 'Browse subjects', icon: BookOpen, onClick: () => navigate(catalogPath) },
          { label: 'Location and price filters', icon: Filter },
        ]}
      >
        <button
          onClick={() => { navigate(catalogPath); setSidebarOpen(false); }}
          className={`mb-3 w-full rounded-[8px] px-3 py-2.5 text-left text-xs font-bold ${!activeSubject ? 'bg-[#13141d] text-[#fb923c] dark:bg-[#f5f5f5] dark:text-[#ea580c]' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}
        >
          Browse all subjects
        </button>
        <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Subjects</p>
        <div className="space-y-1">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => openSubject(subject)}
              className={`w-full rounded-[8px] px-3 py-2.5 text-left text-xs font-bold ${activeSubject === subject ? 'bg-[#13141d] text-[#fb923c] dark:bg-[#f5f5f5] dark:text-[#ea580c]' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}
            >
              {subject}
            </button>
          ))}
        </div>

        {activeSubject && (
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
            <p className="mb-3 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Location & price</p>
            <select value={province} onChange={(event) => setProvince(event.target.value)} className="mb-2 w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <option>All provinces</option>
              {provinces.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} type="number" placeholder="Maximum price" className="w-full rounded-[8px] border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" />
            </div>
          </div>
        )}
      </CollapsibleResourceSidebar>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/95 md:px-6">
          <div className="mx-auto flex max-w-[1320px] items-center gap-3">
            <button title="Open filters" onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300 lg:hidden"><Menu size={18} /></button>
            {activeSubject && (
              <button title="Back to subjects" onClick={() => navigate(catalogPath)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:text-white"><ArrowLeft size={18} /></button>
            )}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={activeSubject ? `Search ${activeSubject} teachers or classes` : 'Search subjects'}
                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <button onClick={() => onNavigate('teacher-signup')} className="hidden shrink-0 items-center gap-2 rounded-[8px] bg-[#161821] px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-amber-500 sm:flex dark:bg-amber-500 dark:hover:bg-amber-400">
              <GraduationCap size={17} /> I'm a Teacher
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto max-w-[1320px]">
            {!activeSubject ? (
              <>
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1.9fr)_minmax(260px,0.85fr)]">
                  <section className="relative min-h-[330px] overflow-hidden rounded-[8px] bg-[#20242b] sm:min-h-[390px]">
                    <img src="/images/extra-lessons/hero.jpg" alt="A tutor guiding a student during a lesson" className="absolute inset-0 h-full w-full object-cover object-[center_62%]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/48 to-transparent" />
                    <div className="relative flex min-h-[330px] max-w-xl flex-col justify-end p-6 text-white sm:min-h-[390px] sm:p-10">
                      <span className="mb-3 w-fit rounded-[4px] bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">Extra Lessons</span>
                      <h1 className="max-w-lg text-3xl font-black leading-tight sm:text-5xl">Learn with the right teacher</h1>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">Browse approved lesson listings by subject and compare teachers, schedules, and fees.</p>
                      <button onClick={() => document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 flex w-fit items-center gap-2 rounded-[8px] bg-white px-4 py-2.5 text-sm font-black text-slate-900 hover:bg-amber-400">Browse subjects <ArrowRight size={16} /></button>
                    </div>
                  </section>

                  <button onClick={() => onNavigate('teacher-signup')} className="group relative min-h-[250px] overflow-hidden rounded-[8px] bg-slate-900 text-left lg:min-h-0">
                    <img src="/images/extra-lessons/teacher.jpg" alt="Teacher holding books in a classroom" className="absolute inset-0 h-full w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <GraduationCap size={24} className="mb-3 text-amber-400" />
                      <h2 className="text-2xl font-black">Teach on ExamSidemann</h2>
                      <p className="mt-1 text-sm text-white/75">Create a teacher account and submit your profile for verification.</p>
                      <span className="mt-4 flex items-center gap-2 text-sm font-black text-amber-400">I'm a Teacher <ArrowRight size={16} /></span>
                    </div>
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-[8px] bg-[#0876c9] text-white lg:grid-cols-4">
                  {LEVEL_OPTIONS.map((option, index) => {
                    const LevelIcon = option.icon;
                    const isActive = activeLevel === option.name;
                    return (
                      <button
                        key={option.name}
                        onClick={() => selectLevel(option.name)}
                        className={`flex min-h-24 items-center gap-3 border-white/15 px-4 py-4 text-left transition-colors hover:bg-white/10 ${index % 2 === 0 ? 'border-r' : ''} ${index < 2 ? 'border-b lg:border-b-0' : ''} ${index < 3 ? 'lg:border-r' : ''} ${isActive ? 'bg-[#075da7]' : ''}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] ${isActive ? 'bg-amber-500' : 'bg-white/15'}`}><LevelIcon size={19} /></span>
                        <span className="min-w-0"><strong className="block text-sm">{option.name}</strong><small className="mt-1 block text-[11px] text-white/70 sm:text-xs">{option.description}</small></span>
                      </button>
                    );
                  })}
                </div>

                <div id="subjects" className="scroll-mt-24 pt-8">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div><h2 className="text-xl font-black text-slate-900 dark:text-white">{activeLevel} subjects</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select a subject to see its teachers and available classes.</p></div>
                    <span className="hidden text-xs font-bold text-slate-400 sm:block">{subjectCards.length} subjects</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {subjectCards.map(({ subject, teacherCount }) => (
                      <button key={subject} onClick={() => openSubject(subject)} className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white text-left shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-[#121217]">
                        <div className={`aspect-[16/10] overflow-hidden ${usesPracticalImage(subject) ? 'bg-white' : 'bg-slate-200'}`}>
                          <img src={imageForSubject(subject)} alt="" className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${containsPracticalImage(subject) ? 'object-contain p-3 sm:p-4' : 'object-cover'}`} />
                        </div>
                        <div className="flex min-h-[76px] items-center justify-between gap-2 p-3 sm:gap-3 sm:p-4">
                          <span className="min-w-0"><strong className="block break-words text-[11px] font-black leading-[15px] text-slate-900 dark:text-white sm:text-sm sm:leading-5">{subject}</strong><small className="mt-1 block text-xs font-bold text-slate-400">{teacherCount} {teacherCount === 1 ? 'teacher' : 'teachers'}</small></span>
                          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-slate-100 text-slate-600 group-hover:bg-amber-500 group-hover:text-white dark:bg-white/5 dark:text-slate-300 sm:flex"><ArrowRight size={16} /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {!subjectCards.length && <div className="rounded-[8px] border border-dashed border-slate-300 bg-white py-16 text-center dark:border-white/10 dark:bg-white/[0.025]"><Search className="mx-auto mb-3 text-slate-300" size={28} /><p className="font-black text-slate-700 dark:text-slate-200">No subjects match your search</p></div>}
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-6 min-h-[220px] overflow-hidden rounded-[8px] bg-slate-900">
                  <img src={imageForSubject(activeSubject)} alt="" className={`absolute inset-0 h-full w-full ${containsPracticalImage(activeSubject) ? 'object-contain p-8 opacity-70' : 'object-cover opacity-70'}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
                  <div className="relative flex min-h-[220px] max-w-2xl flex-col justify-end p-6 text-white sm:p-8">
                    <button onClick={() => navigate(catalogPath)} className="mb-5 flex w-fit items-center gap-2 text-xs font-black text-white/75 hover:text-white"><ArrowLeft size={15} /> {activeLevel} subjects</button>
                    <h1 className="text-3xl font-black sm:text-4xl">{activeSubject} teachers</h1>
                    <p className="mt-2 text-sm text-white/75">{activeLevel} · {teachers.length} {teachers.length === 1 ? 'teacher' : 'teachers'} with {visibleClasses.length} available {visibleClasses.length === 1 ? 'class' : 'classes'}</p>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div><h2 className="text-xl font-black text-slate-900 dark:text-white">Available teachers</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Open a teacher to compare their classes and request access.</p></div>
                  <button onClick={() => setSidebarOpen(true)} className="flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:hidden"><Filter size={15} /> Filters</button>
                </div>

                {loading ? (
                  <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-[8px] bg-white dark:bg-white/5" />)}</div>
                ) : teachers.length ? (
                  <div className="space-y-3">
                    {teachers.map((teacher) => {
                      const isExpanded = expandedTeacher === teacher.id;
                      const initials = teacher.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
                      return (
                        <article key={teacher.id} className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#121217]">
                          <button onClick={() => setExpandedTeacher(isExpanded ? null : teacher.id)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#151821] text-sm font-black text-amber-400 dark:bg-amber-500 dark:text-white">{teacher.image ? <img src={teacher.image} alt={`${teacher.name} profile`} className="h-full w-full object-cover" /> : initials || 'T'}</span>
                            <span className="min-w-0 flex-1">
                              <strong className="block truncate text-base font-black text-slate-900 dark:text-white">{teacher.name}</strong>
                              <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1"><BookOpen size={13} /> {teacher.classes.length} {teacher.classes.length === 1 ? 'class' : 'classes'}</span>
                                {teacher.location && <span className="flex items-center gap-1"><MapPin size={13} /> {teacher.location}</span>}
                                {typeof teacher.rating === 'number' && <span className="flex items-center gap-1 text-amber-500"><Star size={13} className="fill-amber-400" /> {teacher.rating.toFixed(1)} {teacher.ratingsCount ? `(${teacher.ratingsCount})` : ''}</span>}
                              </span>
                            </span>
                            <span className="hidden rounded-[8px] bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 sm:block dark:bg-white/5 dark:text-slate-300">View lessons</span>
                            {isExpanded ? <ChevronUp className="shrink-0 text-slate-400" size={18} /> : <ChevronDown className="shrink-0 text-slate-400" size={18} />}
                          </button>
                          {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.02] sm:p-5">
                              <div className="grid gap-3 lg:grid-cols-2">
                                {teacher.classes.map((item) => (
                                  <div key={item.id} className="rounded-[8px] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#17171d]">
                                    <div className="flex items-start justify-between gap-3">
                                      <div><h3 className="font-black text-slate-900 dark:text-white">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description || `${item.subject} extra lessons with ${item.teacherName}.`}</p></div>
                                      <span className="shrink-0 text-sm font-black text-slate-900 dark:text-white">{item.currency === 'USD' ? '$' : 'ZIG '}{item.price}<small className="font-bold text-slate-400">/{item.period}</small></span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/10">
                                      <div className="flex flex-wrap gap-3 text-[11px] font-bold text-slate-400"><span className="flex items-center gap-1"><Clock size={12} /> {item.timetable}</span><span className="flex items-center gap-1"><Users size={12} /> {item.students?.length || 0} students</span></div>
                                      <button onClick={() => openClass(item)} className="rounded-[8px] bg-amber-500 px-3 py-2 text-xs font-black text-white hover:bg-amber-600">View class</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[8px] border border-dashed border-slate-300 bg-white/70 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]"><Users className="mx-auto mb-3 text-slate-300" size={30} /><p className="font-black text-slate-700 dark:text-slate-200">No approved teachers listed yet</p><p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p></div>
                )}
                <p className="mt-5 text-xs leading-5 text-slate-500 dark:text-slate-400">Tutor listings are independent submissions, not endorsements. Confirm identity, qualifications, safeguarding arrangements, price, and lesson terms before sharing personal information or paying anyone.</p>
              </>
            )}
          </div>
        </section>
      </main>

      <button onClick={() => onNavigate('teacher-signup')} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-[8px] bg-[#161821] px-4 py-3 text-sm font-black text-white shadow-xl sm:hidden dark:bg-amber-500"><GraduationCap size={17} /> I'm a Teacher</button>

      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[8px] bg-white p-6 text-center shadow-2xl dark:bg-[#15151a]">
            <button title="Close" onClick={() => setSelectedClass(null)} className="absolute right-4 top-4 rounded-[8px] bg-slate-100 p-2 text-slate-400 dark:bg-white/5"><X size={17} /></button>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10"><Lock size={28} /></span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Request class access</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Send {selectedClass.teacherName} a request to join <strong>{selectedClass.name}</strong>.</p>
            <div className="my-5 rounded-[8px] bg-slate-50 p-4 text-left text-xs dark:bg-white/5">
              <div className="flex justify-between py-1.5"><span className="text-slate-400">Subject</span><strong className="text-slate-700 dark:text-white">{selectedClass.subject}</strong></div>
              <div className="flex justify-between py-1.5"><span className="text-slate-400">Schedule</span><strong className="text-slate-700 dark:text-white">{selectedClass.timetable}</strong></div>
              <div className="flex justify-between py-1.5"><span className="text-slate-400">Tuition</span><strong className="text-amber-600">{selectedClass.currency} {selectedClass.price}/{selectedClass.period}</strong></div>
            </div>
            {requestStatus === 'sent' ? (
              <div className="flex items-center justify-center gap-2 rounded-[8px] bg-emerald-50 py-3 text-sm font-black text-emerald-600 dark:bg-emerald-500/10"><CheckCircle size={18} /> Request sent</div>
            ) : (
              <button onClick={requestAccess} disabled={requestStatus === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-amber-500 py-3.5 text-sm font-black text-white disabled:opacity-60"><Send size={16} /> {requestStatus === 'sending' ? 'Sending...' : 'Request access'}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
