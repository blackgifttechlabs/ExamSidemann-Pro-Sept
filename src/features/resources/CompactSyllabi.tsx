import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, Layers, Search } from 'lucide-react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { AcademicLibrarySidebar, AcademicNavCourse } from './AcademicLibrarySidebar';
import { ResourceAdRail } from './ResourceAdRail';
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
import { PDF_IMAGE_PLACEHOLDER } from '../../services/resourceManifest';
import { SeoHead } from '../../seo/SeoHead';
import { DocumentReader } from './DocumentReader';

type SyllabusResource = {
  id: string;
  title: string;
  url: string;
  course: string;
  subject?: string;
  approved?: boolean;
};

const primaryCourses: AcademicNavCourse[] = Array.from({ length: 7 }, (_, index) => ({
  name: `Grade ${index + 1}`,
  category: 'Primary',
}));

const initialCourses: AcademicNavCourse[] = [
  ...primaryCourses,
  ...CURRICULUM_REGISTRY.map((course) => ({ name: course.name, category: course.category })),
];

const DEFAULT_CATEGORY = "O' Level";
const DEFAULT_COURSE = 'Form 3';
let hasBooted = false;

const driveFileId = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || parsed.searchParams.get('id') || '';
  } catch {
    return '';
  }
};

const SyllabusCover: React.FC<{ item: SyllabusResource }> = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const fileId = driveFileId(item.url);
  const thumbnail = fileId
    ? `https://lh3.googleusercontent.com/d/${encodeURIComponent(fileId)}=w800`
    : '';
  return (
    <span className="relative block h-full w-full overflow-hidden bg-white dark:bg-slate-900">
      <img src={PDF_IMAGE_PLACEHOLDER} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      {thumbnail && !failed ? (
        <img
          src={thumbnail}
          alt={`First page of ${item.title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full bg-slate-100 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] dark:bg-slate-900"
        />
      ) : null}
    </span>
  );
};

export const CompactSyllabi: React.FC<{ initialSearch?: string }> = ({ initialSearch = '' }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<AcademicNavCourse[]>(initialCourses);
  const [syllabi, setSyllabi] = useState<SyllabusResource[]>([]);
  const [activeCourse, setActiveCourse] = useState(DEFAULT_COURSE);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [remoteSubjects, setRemoteSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [search, setSearch] = useState(initialSearch);
  const [selectedSyllabus, setSelectedSyllabus] = useState<SyllabusResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [booting, setBooting] = useState(!hasBooted);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [downloadJob, setDownloadJob] = useState<DownloadJob | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasBooted = true;
      setBooting(false);
    }, 1200);
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
    const stopSyllabi = onSnapshot(query(
      collection(db, 'global_resources'),
      where('type', '==', 'syllabi'),
      where('approved', '==', true),
    ), (snapshot) => {
      const available = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() } as SyllabusResource))
        .filter((item) => item.approved === true && item.url && item.course);
      setSyllabi(available);
      setCourses((current) => {
        const merged = [...current];
        available.forEach((item) => {
          if (!merged.some((course) => course.name === item.course)) merged.push({ name: item.course });
        });
        return merged;
      });
      setLoading(false);
    }, () => setLoading(false));
    return () => {
      stopCourses();
      stopSyllabi();
    };
  }, []);

  useEffect(() => onSnapshot(doc(db, 'course_subjects', activeCourse), (snapshot) => {
    const remote = snapshot.exists() ? snapshot.data().subjects || [] : [];
    setRemoteSubjects(remote.map((subject: any) => subject.name).filter(Boolean));
  }, () => setRemoteSubjects([])), [activeCourse]);

  useEffect(() => {
    setSwitching(true);
    const timer = window.setTimeout(() => setSwitching(false), 320);
    return () => window.clearTimeout(timer);
  }, [activeCourse]);

  const subjects = useMemo(() => Array.from(new Set([
    ...remoteSubjects,
    ...syllabi.filter((item) => item.course === activeCourse).map((item) => item.subject).filter(Boolean),
  ] as string[])).sort((left, right) => left.localeCompare(right)), [activeCourse, remoteSubjects, syllabi]);

  const filteredSyllabi = useMemo(() => syllabi.filter((item) => (
    item.course === activeCourse
    && (selectedSubject === 'All subjects' || item.subject === selectedSubject)
    && `${item.title} ${item.subject || ''}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [activeCourse, search, selectedSubject, syllabi]);

  const chooseCourse = (courseName: string) => {
    setActiveCourse(courseName);
    setSelectedSubject('All subjects');
    setSearch('');
    const course = courses.find((item) => item.name === courseName);
    if (course) setSelectedCategory(categoryOf(course));
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    const first = coursesInCategory(courses, category)[0];
    if (first) chooseCourse(first.name);
  };

  if (booting) {
    return <div className="h-[100dvh] bg-[#13141d] lg:h-[calc(100dvh_-_var(--app-header-h))]"><SlideLoader label="Opening the syllabi" /></div>;
  }

  return (
    <>
      <SeoHead title="ZIMSEC & HEXCO Syllabi | Exam Sidemann" description="Browse ZIMSEC and HEXCO syllabus documents by school level and subject." canonical="https://www.examsidemann.com/syllabi/" />
      <div className="flex h-[100dvh] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b] lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <AcademicLibrarySidebar title="Syllabi" subtitle="Curriculum library" courses={courses} selectedCourse={activeCourse} onSelectCourse={chooseCourse} open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Subjects</p>
          <div className="space-y-1">{['All subjects', ...subjects].map((subject) => <button key={subject} onClick={() => setSelectedSubject(subject)} className={`w-full rounded-[10px] px-3 py-2 text-left text-xs font-bold ${selectedSubject === subject ? 'bg-[#13141d] text-[#fb923c] dark:bg-[#f5f5f5] dark:text-[#ea580c]' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}>{subject}</button>)}</div>
        </AcademicLibrarySidebar>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="Go back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300"><ArrowLeft size={18} /></button>
              <div className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search syllabi" className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">{activeCourse}</p><h1 className="truncate text-lg font-black text-slate-900 dark:text-white">{selectedSubject}</h1></div>
              <div className="relative w-72"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search syllabi" className="w-full rounded-[10px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>
            </div>
            <div className="mt-3 lg:hidden"><ResourceLevelChips courses={coursesInCategory(courses, selectedCategory)} active={activeCourse} onSelect={chooseCourse} /></div>
          </header>

          <section className="flex-1 overflow-y-auto scroll-smooth p-4 pb-24 md:p-6 lg:pb-6">
            <div className="mb-4"><h2 className="font-black text-slate-900 dark:text-white">Syllabus collection</h2><p className="text-xs text-slate-400">{filteredSyllabi.length} {filteredSyllabi.length === 1 ? 'document' : 'documents'} available</p></div>
            {switching || loading ? <ShelfSkeleton /> : filteredSyllabi.length ? (
              <div className={SHELF_GRID}>
                {filteredSyllabi.map((item) => (
                  <article key={item.id} className="group relative">
                    <button onClick={() => setSelectedSyllabus(item)} aria-label={`Read ${item.title}`} className="relative block aspect-[1/1.45] w-full overflow-hidden rounded-[10px] shadow-sm transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"><SyllabusCover item={item} /></button>
                    <button onClick={() => setDownloadJob({ token: Date.now(), title: item.title, url: item.url })} aria-label={`Download ${item.title}`} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-[10px] bg-slate-950/55 text-white backdrop-blur-sm transition-opacity lg:opacity-0 lg:group-hover:opacity-100"><Download size={13} /></button>
                    <h3 title={item.title} className="mt-2 truncate text-[11px] font-black leading-4 text-slate-800 dark:text-white">{item.title}</h3>
                    <p className="truncate text-[10px] font-bold text-slate-400">{item.subject || 'Curriculum syllabus'}</p>
                  </article>
                ))}
              </div>
            ) : <div className="rounded-[10px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]"><Layers className="mx-auto mb-3 text-slate-300" size={28} /><p className="font-black text-slate-700 dark:text-slate-200">No syllabi found</p><p className="mt-1 text-sm text-slate-400">Try another subject or level.</p></div>}
          </section>
        </main>
        <ResourceAdRail />
        <ResourceCategoryBar categories={RESOURCE_CATEGORIES.filter((category) => coursesInCategory(courses, category.id).length > 0)} active={selectedCategory} onSelect={chooseCategory} />
        <DownloadCountdown key={downloadJob?.token ?? 'download-idle'} job={downloadJob} onClose={() => setDownloadJob(null)} />

        {selectedSyllabus && (
          <DocumentReader
            title={selectedSyllabus.title}
            course={selectedSyllabus.course}
            subject={selectedSyllabus.subject}
            url={selectedSyllabus.url}
            kind="Syllabus"
            courses={courses}
            onBack={() => setSelectedSyllabus(null)}
            onDownload={() => setDownloadJob({ token: Date.now(), title: selectedSyllabus.title, url: selectedSyllabus.url })}
            onSelectCourse={chooseCourse}
          />
        )}
      </div>
    </>
  );
};
