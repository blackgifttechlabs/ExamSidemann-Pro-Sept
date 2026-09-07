import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Car,
  ChevronRight,
  Download,
  FileText,
  Files,
  GraduationCap,
  Landmark,
  Menu,
  MonitorCog,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import hardcodedPastPapers from '../../data/pastPapers.json';

type Paper = {
  id: string;
  name: string;
  url: string;
  course?: string;
  subject?: string;
};

type HardcodedPaperRecord = {
  level: string;
  sublevel: string;
  subject: string;
  year: string;
  type: string;
  fileId: string;
};

type CourseOption = {
  name: string;
  displayName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const hardcodedRecords = hardcodedPastPapers as HardcodedPaperRecord[];

const normalizeSublevelToCourse = (record: HardcodedPaperRecord) => {
  if (record.level === 'Polytechnic') {
    const sublevel = record.sublevel.toLowerCase();
    if (sublevel.includes('information technology') && sublevel.includes('nc')) return 'NC Information Technology';
    if (sublevel.includes('information technology') && sublevel.includes('nd')) return 'ND Information Technology';
    if (sublevel.includes('purchasing') && sublevel.includes('nc')) return 'NC Purchasing & Supply';
    if (sublevel.includes('purchasing') && sublevel.includes('nd')) return 'ND Purchasing & Supply';
    if (sublevel.includes('records') && sublevel.includes('nc')) return 'NC Records Management';
    if (sublevel.includes('records') && sublevel.includes('nd')) return 'ND Records & Information Management';
    if (sublevel.includes('auto')) return 'NC Auto Electrics';
    if (sublevel.includes('banking')) return 'NC Banking and Finance';
  }
  return record.sublevel;
};

const buildDriveUrl = (fileId: string) =>
  fileId && fileId !== 'PASTE_GOOGLE_DRIVE_FILE_ID_HERE'
    ? `https://drive.google.com/file/d/${fileId}/view`
    : '';

const HARD_CODED_PAPERS: Paper[] = hardcodedRecords.map((record, index) => {
  const course = normalizeSublevelToCourse(record);
  const nameParts = [record.subject, record.year, record.type].filter(Boolean);
  return {
    id: `hardcoded-${index}-${record.fileId}`,
    name: nameParts.join(' · '),
    url: buildDriveUrl(record.fileId),
    course,
    subject: record.subject,
  };
});

const courseIconFor = (name: string): CourseOption['icon'] => {
  const normalized = name.toLowerCase();
  if (normalized.includes('information technology')) return MonitorCog;
  if (normalized.includes('purchasing')) return ShoppingCart;
  if (normalized.includes('records')) return Files;
  if (normalized.includes('auto')) return Car;
  if (normalized.includes('banking')) return Landmark;
  if (normalized.includes("o'") || normalized.includes('zjc') || normalized.includes("a'")) return GraduationCap;
  if (normalized.includes('form')) return Calculator;
  return BriefcaseBusiness;
};

const displayNameForCourse = (name: string) => {
  switch (name) {
    case 'ND Information Technology':
      return 'ND I.T';
    case 'NC Information Technology':
      return 'NC I.T';
    case 'ND Purchasing & Supply':
      return 'ND Purchasing';
    case 'NC Purchasing & Supply':
      return 'NC Purchasing';
    case 'ND Records & Information Management':
      return 'ND Records';
    case 'NC Records Management':
      return 'NC Records';
    case 'NC Auto Electrics':
      return 'NC Auto';
    case 'NC Banking and Finance':
      return 'NC Banking';
    default:
      return name;
  }
};

const defaultCourseOptions = (): CourseOption[] => {
  const hardcodedCourseNames = Array.from(new Set(HARD_CODED_PAPERS.map((paper) => paper.course).filter(Boolean))) as string[];
  const registryCourseNames = CURRICULUM_REGISTRY.map((level) => level.name);
  const orderedNames = Array.from(new Set([...hardcodedCourseNames, ...registryCourseNames]));
  return orderedNames.map((name) => ({
    name,
    displayName: displayNameForCourse(name),
    icon: courseIconFor(name),
  }));
};

const DEFAULT_COURSE_OPTIONS = defaultCourseOptions();

const cardStyles = [
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-cyan-400 via-blue-500 to-indigo-600',
  'from-pink-400 via-rose-500 to-orange-400',
  'from-indigo-500 via-violet-500 to-purple-700',
  'from-emerald-400 via-teal-500 to-cyan-600',
];

const styleFor = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = value.charCodeAt(i) + ((hash << 5) - hash);
  return cardStyles[Math.abs(hash) % cardStyles.length];
};

export const PastPapers: React.FC<{ initialSearch?: string }> = ({ initialSearch }) => {
  const [courses, setCourses] = useState<CourseOption[]>(DEFAULT_COURSE_OPTIONS);
  const [selectedCourse, setSelectedCourse] = useState(DEFAULT_COURSE_OPTIONS[0]?.name || '');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState('All Subjects');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [search, setSearch] = useState(initialSearch || '');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snapshot) => {
      const list = snapshot.exists() ? snapshot.data().list || [] : [];
      const names = list.map((item: any) => item.name).filter(Boolean);
      const mergedNames = Array.from(new Set([...DEFAULT_COURSE_OPTIONS.map((course) => course.name), ...names]));
      const options = mergedNames.map((name) => ({
        name,
        displayName: displayNameForCourse(name),
        icon: courseIconFor(name),
      }));
      setCourses(options);
      setSelectedCourse((current) => current && mergedNames.includes(current) ? current : options[0]?.name || '');
    });
  }, []);

  useEffect(() => {
    if (!selectedCourse) return undefined;
    return onSnapshot(doc(db, 'course_subjects', selectedCourse), (snapshot) => {
      const list = snapshot.exists() ? snapshot.data().subjects || [] : [];
      const firestoreNames = list.map((item: any) => item.name).filter(Boolean);
      const hardcodedNames = HARD_CODED_PAPERS
        .filter((paper) => paper.course === selectedCourse && paper.subject)
        .map((paper) => paper.subject as string);
      const names = Array.from(new Set([...firestoreNames, ...hardcodedNames]));
      setSubjects(names);
      setActiveSubject('All Subjects');
    });
  }, [selectedCourse]);

  useEffect(() => {
    setLoading(true);
    const papersQuery = query(collection(db, 'global_resources'), where('type', '==', 'past-papers'));
    return onSnapshot(papersQuery, (snapshot) => {
      const firestorePapers = snapshot.docs.map((item) => {
        const data = item.data() as any;
        return {
          id: item.id,
          // Only name and URL are exposed to the document cards.
          name: data.name || data.title || data.fileName || 'Untitled document',
          url: data.url || data.link || data.downloadURL || '',
          course: data.course,
          subject: data.subject,
        };
      }).filter((paper) => paper.url);
      const merged = [...HARD_CODED_PAPERS.filter((paper) => paper.url), ...firestorePapers];
      setPapers(merged);
      setLoading(false);
    });
  }, []);

  const visiblePapers = useMemo(() => papers.filter((paper) => {
    const courseMatch = !selectedCourse || paper.course === selectedCourse;
    const subjectMatch = activeSubject === 'All Subjects' || paper.subject === activeSubject;
    const text = `${paper.name}`.toLowerCase();
    return courseMatch && subjectMatch && text.includes(search.toLowerCase());
  }), [papers, selectedCourse, activeSubject, search]);

  return (
    <div className="flex h-[calc(100vh_-_var(--app-header-h))] overflow-hidden bg-[#f8f7ff] dark:bg-[#090812] text-left font-sans">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-violet-100 bg-white dark:border-white/10 dark:bg-[#11101c] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between border-b border-violet-100 px-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25"><Archive size={19} /></div>
            <div><p className="text-sm font-black text-slate-900 dark:text-white">Exam Library</p><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-500">Past Papers</p></div>
          </div>
          <button className="rounded-lg p-2 text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Courses</p>
          <div className="space-y-1">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <button key={course.name} onClick={() => { setSelectedCourse(course.name); setSidebarOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition-all ${selectedCourse === course.name ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20' : 'text-slate-600 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-white/5'}`}>
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selectedCourse === course.name ? 'bg-white/15 text-white' : 'bg-violet-50 text-violet-600 dark:bg-white/5 dark:text-violet-300'}`}>
                      <Icon size={16} />
                    </span>
                    <span className="truncate">{course.displayName}</span>
                  </span>
                  {selectedCourse === course.name && <ChevronRight size={16} className="shrink-0" />}
                </button>
              );
            })}
          </div>
          {!courses.length && <p className="px-2 text-sm text-slate-400">No courses available.</p>}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-violet-100 bg-white/80 px-5 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d0c18]/80 md:px-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div><p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-violet-500">Your academic library</p><h1 className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl">Past Papers</h1><p className="mt-1 text-sm text-slate-400">{selectedCourse || 'Select a course'}{activeSubject !== 'All Subjects' ? ` · ${activeSubject}` : ''}</p></div>
            <div className="relative w-full md:w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents..." className="w-full rounded-xl border border-violet-100 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {['All Subjects', ...subjects].map((subject) => <button key={subject} onClick={() => setActiveSubject(subject)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition-all ${activeSubject === subject ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25' : 'border border-violet-100 bg-white text-slate-500 hover:border-violet-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'}`}>{subject}</button>)}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-5 py-7 md:px-10">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-900 dark:text-white">Available documents</h2><p className="text-xs text-slate-400">{visiblePapers.length} document{visiblePapers.length === 1 ? '' : 's'}</p></div><div className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex"><BookOpen size={15} /> Library collection</div></div>
          {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-60 animate-pulse rounded-2xl bg-white dark:bg-white/5" />)}</div> : visiblePapers.length === 0 ? <div className="rounded-2xl border border-dashed border-violet-200 bg-white/70 py-24 text-center dark:border-white/10 dark:bg-white/5"><FileText className="mx-auto mb-3 text-violet-400" size={30} /><p className="font-bold text-slate-600 dark:text-slate-300">No documents found</p><p className="mt-1 text-sm text-slate-400">Try another course, subject, or search.</p></div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visiblePapers.map((paper) => <article key={paper.id} className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"><div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${styleFor(paper.name)}`}><div className="absolute -right-5 -top-8 h-28 w-28 rounded-full border-[12px] border-white/15" /><div className="absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-white/10" /><FileText className="relative text-white drop-shadow-lg" size={42} /></div><div className="flex min-h-40 flex-col p-4"><h3 className="line-clamp-3 flex-1 text-sm font-black leading-5 text-slate-800 dark:text-white">{paper.name}</h3><div className="mt-4 flex gap-2"><a href={paper.url} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-black text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-slate-900"><BookOpen size={14} /> Open</a><a href={paper.url} target="_blank" rel="noreferrer" download className="flex w-10 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700"><Download size={15} /></a></div></div></article>)}</div>}
        </section>
      </main>
      <button onClick={() => setSidebarOpen(true)} className="fixed bottom-6 left-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-xs font-black text-white shadow-xl lg:hidden"><Menu size={16} /> Courses</button>
    </div>
  );
};
