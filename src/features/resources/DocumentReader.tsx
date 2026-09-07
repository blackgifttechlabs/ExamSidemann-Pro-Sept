import React from 'react';
import { ArrowLeft, BookOpen, Download, FileText, GraduationCap } from 'lucide-react';
import { AcademicLibrarySidebar, AcademicNavCourse } from './AcademicLibrarySidebar';
import { RESOURCE_CATEGORIES, ResourceCategoryBar, categoryOf, coursesInCategory } from './ResourceLevelNav';

type Props = {
  title: string;
  course: string;
  subject?: string;
  url: string;
  kind: 'Book' | 'Syllabus';
  courses: AcademicNavCourse[];
  onBack: () => void;
  onDownload: () => void;
  onSelectCourse: (course: string) => void;
};

const documentPreviewUrl = (url: string) => url.includes('drive.google')
  ? url.replace('/view', '/preview')
  : url;

/** The shared reading page used by books and syllabi, matching Past Papers. */
export const DocumentReader: React.FC<Props> = ({
  title,
  course,
  subject,
  url,
  kind,
  courses,
  onBack,
  onDownload,
  onSelectCourse,
}) => (
  <div className="fixed inset-0 z-[100] flex h-[100dvh] overflow-hidden bg-[#f5f6f8] text-left text-slate-900 dark:bg-[#08080b] dark:text-white">
    <AcademicLibrarySidebar
      title={kind === 'Book' ? 'Book Library' : 'Syllabi'}
      subtitle={kind === 'Book' ? 'Digital library' : 'Curriculum library'}
      courses={courses}
      selectedCourse={course}
      onSelectCourse={(courseName) => {
        onBack();
        onSelectCourse(courseName);
      }}
      open={false}
      onClose={() => undefined}
    />
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0d0d12]">
        <div className="flex min-w-0 items-center gap-2 px-3 py-2.5 sm:px-5 md:px-6">
          <button type="button" onClick={onBack} aria-label={`Back to ${kind.toLowerCase()}s`} className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-300"><ArrowLeft size={18} /></button>
          <h1 className="min-w-0 flex-1 truncate text-base font-black tracking-[-0.03em] sm:text-lg">{title}</h1>
        </div>
      </div>

      <section className="flex-1 overflow-y-auto scroll-smooth pb-20 lg:pb-0">
        <div className="grid min-w-0 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
          <article className="min-w-0 overflow-hidden border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#101014] lg:border-r">
            <header className="flex min-w-0 items-center justify-between gap-4 overflow-hidden border-b border-slate-200 px-4 py-2 dark:border-white/10">
              <div className="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span className="hidden items-center gap-1.5 sm:flex"><GraduationCap size={14} className="text-violet-500" /> {course}</span>
                <span className="flex items-center gap-1.5"><FileText size={14} className="text-violet-500" /> {subject || kind}</span>
              </div>
              <button type="button" onClick={onDownload} className="flex shrink-0 items-center justify-center gap-2 rounded-[5px] bg-violet-600 px-6 py-2 text-[11px] font-black uppercase tracking-wider text-white sm:px-10"><Download size={15} /> Download</button>
            </header>
            <div className="h-[calc(100dvh-108px)] min-h-[520px] bg-slate-100 dark:bg-black">
              <iframe src={documentPreviewUrl(url)} title={`${title} preview`} className="h-full w-full border-0" />
            </div>
          </article>

          <aside className="bg-[#f5f6f8] p-4 dark:bg-[#08080b] sm:p-6 lg:min-h-full lg:border-b lg:border-slate-200 lg:p-7 dark:lg:border-white/10">
            <div className="rounded-[15px] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101014]">
              <BookOpen className="text-violet-500" size={24} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">{kind}</p>
              <h2 className="mt-1 text-base font-black leading-snug">{title}</h2>
              <p className="mt-3 text-xs font-bold text-slate-400">{course}{subject ? ` · ${subject}` : ''}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
    <ResourceCategoryBar
      categories={RESOURCE_CATEGORIES.filter((category) => coursesInCategory(courses, category.id).length > 0)}
      active={categoryOf(courses.find((item) => item.name === course) || { name: course })}
      onSelect={(category) => {
        const first = coursesInCategory(courses, category)[0];
        if (first) {
          onBack();
          onSelectCourse(first.name);
        }
      }}
    />
  </div>
);
