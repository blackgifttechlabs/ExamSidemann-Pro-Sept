import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Backpack,
  BookOpen,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { AcademicNavCourse } from './AcademicLibrarySidebar';

type Accent = 'purple' | 'rose' | 'blue';

type Props = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  accent: Accent;
  courses: AcademicNavCourse[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  polyCredential: 'NC' | 'ND' | '';
  onSelectPolyCredential: (credential: 'NC' | 'ND') => void;
  onSelectCourse: (courseName: string) => void;
  getCourseHref?: (courseName: string) => string;
};

const categoryFor = (course: AcademicNavCourse) => course.category || (
  ['Form 1', 'Form 2'].includes(course.name) ? 'ZJC'
    : ['Form 3', 'Form 4'].includes(course.name) ? "O' Level"
      : course.name.includes('6') ? "A' Level" : 'Polytechnic'
);

const categories = [
  { id: 'Primary', label: 'Primary School', detail: 'Grades 1 to 3', icon: Backpack },
  { id: 'ZJC', label: 'Junior Certificate', detail: 'Forms 1 & 2', icon: BookOpen },
  { id: "O' Level", label: 'Ordinary Level', detail: 'ZIMSEC examination level', icon: Layers },
  { id: "A' Level", label: 'Advanced Level', detail: 'Lower & Upper 6', icon: GraduationCap },
  { id: 'Polytechnic', label: 'Technical Courses', detail: 'NC & ND Levels', icon: FileText },
];

const accents = {
  purple: {
    text: 'text-purple-400',
    dot: 'bg-purple-500',
    ring: 'border-purple-300 ring-purple-400/30',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-50 dark:bg-purple-500/10',
    selected: 'border-purple-400 bg-purple-50 dark:bg-purple-500/10',
    hover: 'hover:border-purple-300',
  },
  rose: {
    text: 'text-rose-400',
    dot: 'bg-rose-500',
    ring: 'border-rose-300 ring-rose-400/30',
    icon: 'text-rose-600',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    selected: 'border-rose-400 bg-rose-50 dark:bg-rose-500/10',
    hover: 'hover:border-rose-300',
  },
  blue: {
    text: 'text-blue-400',
    dot: 'bg-blue-500',
    ring: 'border-blue-300 ring-blue-400/30',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    selected: 'border-blue-400 bg-blue-50 dark:bg-blue-500/10',
    hover: 'hover:border-blue-300',
  },
};

export const AcademicResourceLanding: React.FC<Props> = ({
  eyebrow,
  title,
  highlightedTitle,
  description,
  accent,
  courses,
  selectedCategory,
  onSelectCategory,
  onSelectCourse,
  getCourseHref,
}) => {
  const color = accents[accent];
  const levelsRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const polyDepartments = useMemo(() => {
    const names = courses.filter((course) => categoryFor(course) === 'Polytechnic').map((course) => course.name);
    const departments = [
      { id: 'Information Technology', label: 'Information Technology' },
      { id: 'Auto Electrics', label: 'Auto Electrics' },
      { id: 'Records', label: 'Records Management' },
      { id: 'Purchasing', label: 'Purchasing & Supply' },
      { id: 'Banking', label: 'Banking & Finance' },
    ];
    return departments.filter((department) => names.some((name) => name.includes(department.id)));
  }, [courses]);

  const availableCategories = useMemo(() => categories.filter((category) => (
    courses.some((course) => categoryFor(course) === category.id)
  )), [courses]);

  const visibleCourses = courses.filter((course) => {
    if (categoryFor(course) !== selectedCategory) return false;
    if (selectedCategory !== 'Polytechnic') return true;
    return selectedDepartment ? course.name.includes(selectedDepartment) : false;
  });

  useEffect(() => {
    setSelectedDepartment('');
    if (selectedCategory) {
      window.setTimeout(() => levelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [selectedCategory]);

  const chooseDepartment = (department: string) => {
    setSelectedDepartment(department);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const getLevelImage = (name: string) => {
    if (name.includes('Form 1') || name.includes('Form 2')) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900';
    if (name.includes('Form 3') || name.includes('Form 4') || name.includes("O' Level") || name.includes('O Level')) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=900';
    if (name.includes('Lower 6') || name.includes('Upper 6') || name.includes("A' Level") || name.includes('A Level')) return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900';
    return 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=900';
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-left dark:bg-[#060608]">
      <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden border-b border-white/10 px-4 py-14 md:px-8">
        <img src="https://i.postimg.cc/SNYm6QYX/Picsart-26-06-16-22-00-14-128.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale-[20%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#f7f8fa] dark:to-[#060608] lg:bg-gradient-to-r lg:from-black/95 lg:via-black/75 lg:to-black/40" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full ${color.dot}`} />
              {eyebrow}
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
              {title}
              <span className={`mt-2 block ${color.text}`}>{highlightedTitle}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-7 text-white/75 lg:mx-0 md:text-lg">{description}</p>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-x-7 gap-y-8 sm:gap-x-12">
            {availableCategories.map((category) => {
              const Icon = category.icon;
              const active = selectedCategory === category.id;
              return (
                <button key={category.id} onClick={() => onSelectCategory(category.id)} className="group flex flex-col items-center text-center">
                  <span className={`flex h-24 w-24 items-center justify-center rounded-full border-[3px] bg-black/30 shadow-xl backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-1 sm:h-28 sm:w-28 ${active ? `${color.ring} ring-4` : 'border-white/35'}`}>
                    <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-inner sm:h-16 sm:w-16 ${color.icon}`}>
                      <Icon size={27} />
                    </span>
                  </span>
                  <span className="mt-3 text-xs font-black uppercase tracking-wider text-white sm:text-sm">{category.label}</span>
                  <span className="mt-1 text-[10px] font-bold text-white/55">{category.detail}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={levelsRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 md:px-8">
        {selectedCategory ? (
          <>
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-2 w-2 ${color.dot}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.22em] ${color.icon}`}>Choose your level</span>
              </div>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">{selectedCategory === 'Polytechnic' ? 'Select a department' : `${selectedCategory} levels`}</h2>
            </div>

            {selectedCategory === 'Polytechnic' && (
              <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                {polyDepartments.map((department) => (
                  <button key={department.id} onClick={() => chooseDepartment(department.id)} className={`rounded-[15px] border p-4 text-left transition-[transform,border-color] hover:-translate-y-0.5 ${selectedDepartment === department.id ? color.selected : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.035]'}`}>
                    <span className={`mb-5 flex h-10 w-10 items-center justify-center rounded-[12px] ${color.iconBg} ${color.icon}`}><FileText size={18} /></span>
                    <span className="block text-sm font-black text-slate-900 dark:text-white">{department.label}</span>
                    <span className="mt-1 text-[10px] font-bold text-slate-400">View NC & ND</span>
                  </button>
                ))}
              </div>
            )}

            {(selectedCategory !== 'Polytechnic' || selectedDepartment) && (
              <div ref={resultsRef} className="scroll-mt-28">
                {selectedCategory === 'Polytechnic' && (
                  <div className="mb-5 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                    <div><p className={`text-[10px] font-black uppercase tracking-[0.2em] ${color.icon}`}>Available qualifications</p><h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{selectedDepartment}</h3></div>
                    <span className="text-xs font-bold text-slate-400">NC & ND</span>
                  </div>
                )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleCourses.map((course) => {
                  const courseCard = (
                    <>
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img src={getLevelImage(course.name)} alt="" className="h-full w-full object-cover opacity-75 transition-[transform,opacity] duration-300 group-hover:scale-[1.03] group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                      <span className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-700 backdrop-blur-sm">{course.name.toUpperCase().startsWith('ND ') ? 'ND' : course.name.toUpperCase().startsWith('NC ') ? 'NC' : categoryFor(course)}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div><h3 className="text-lg font-black leading-tight text-slate-900 dark:text-white">{course.name}</h3><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic path</p></div>
                        <ChevronRight size={18} className={`shrink-0 transition-transform group-hover:translate-x-1 ${color.icon}`} />
                      </div>
                    </div>
                    </>
                  );
                  const className = `group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-md transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111] ${color.hover}`;

                  return getCourseHref ? (
                    <a
                      key={course.name}
                      href={getCourseHref(course.name)}
                      onClick={(event) => {
                        event.preventDefault();
                        onSelectCourse(course.name);
                      }}
                      className={className}
                    >
                      {courseCard}
                    </a>
                  ) : (
                    <button key={course.name} onClick={() => onSelectCourse(course.name)} className={className}>
                      {courseCard}
                    </button>
                  );
                })}
              </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 py-16 text-center dark:border-white/10 dark:bg-white/[0.025]">
            <BookOpen className="mx-auto mb-3 text-slate-300" size={28} />
            <p className="font-black text-slate-700 dark:text-slate-200">Choose an academic path</p>
            <p className="mt-1 text-sm text-slate-400">Your forms and qualifications will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
};
