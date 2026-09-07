import React, { useEffect, useMemo, useState } from 'react';
import {
  Backpack,
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  Layers,
  Library,
  Video,
} from 'lucide-react';
import { CollapsibleResourceSidebar } from './CollapsibleResourceSidebar';

export type AcademicNavCourse = {
  name: string;
  category?: string;
  displayName?: string;
};

type AcademicLibrarySidebarProps = {
  title: string;
  subtitle: string;
  courses: AcademicNavCourse[];
  selectedCourse: string;
  onSelectCourse: (courseName: string) => void;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const categoryFor = (course: AcademicNavCourse) => {
  if (course.category) return course.category;
  const name = course.name.toLowerCase();
  if (name === 'form 1' || name === 'form 2') return 'ZJC';
  if (name === 'form 3' || name === 'form 4') return "O' Level";
  if (name.includes('lower 6') || name.includes('upper 6')) return "A' Level";
  return 'Polytechnic';
};

const groupMeta = [
  { id: 'Primary', label: 'Primary', detail: 'Grades 1–3', icon: Backpack },
  { id: 'ZJC', label: 'ZJC', detail: 'Forms 1–2', icon: BookOpen },
  { id: "O' Level", label: 'O Level', detail: 'Ordinary Level', icon: Layers },
  { id: "A' Level", label: 'A Level', detail: 'Lower & Upper 6', icon: GraduationCap },
  { id: 'Polytechnic', label: 'Polytechnic', detail: 'NC & ND', icon: Library },
];

export const AcademicLibrarySidebar: React.FC<AcademicLibrarySidebarProps> = ({
  title,
  subtitle,
  courses,
  selectedCourse,
  onSelectCourse,
  open,
  onClose,
  children,
}) => {
  const selectedCategory = courses.find((course) => course.name === selectedCourse);
  const [expanded, setExpanded] = useState<string>(selectedCategory ? categoryFor(selectedCategory) : 'ZJC');
  const [expandedPolyLevel, setExpandedPolyLevel] = useState<'NC' | 'ND'>(
    selectedCourse.toUpperCase().startsWith('ND ') ? 'ND' : 'NC'
  );

  useEffect(() => {
    const selected = courses.find((course) => course.name === selectedCourse);
    if (!selected) return;
    const category = categoryFor(selected);
    setExpanded(category);
    if (category === 'Polytechnic') {
      setExpandedPolyLevel(selected.name.toUpperCase().startsWith('ND ') ? 'ND' : 'NC');
    }
  }, [courses, selectedCourse]);

  const grouped = useMemo(() => groupMeta.map((group) => ({
    ...group,
    courses: courses.filter((course) => categoryFor(course) === group.id),
  })).filter((group) => group.courses.length > 0), [courses]);

  const PageIcon = title === 'Syllabi'
    ? BookOpen
    : title === 'Past Papers'
      ? FileText
      : title === 'Video Library'
        ? Video
        : Library;

  const courseButton = (course: AcademicNavCourse) => (
    <button
      key={course.name}
      onClick={() => {
        onSelectCourse(course.name);
        onClose();
      }}
      className={`flex min-h-9 w-full items-center rounded-[7px] px-3 py-2 text-left text-[12px] transition-colors ${
        selectedCourse === course.name
          ? 'bg-slate-100 font-bold text-slate-950 dark:bg-white/10 dark:text-white'
          : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
      }`}
    >
      <span className="truncate">{course.displayName || course.name}</span>
    </button>
  );

  return (
    <CollapsibleResourceSidebar
      title={title}
      subtitle={subtitle}
      icon={PageIcon}
      showPageHeader={false}
      open={open}
      onClose={onClose}
      collapsedActions={grouped.map((group) => ({
        label: group.label,
        icon: group.icon,
        onClick: () => setExpanded(group.id),
      }))}
    >
          <nav className="space-y-1" aria-label={`${title} academic levels`}>
            {grouped.map((group) => {
              const isOpen = expanded === group.id;
              const GroupIcon = group.icon;
              return (
                <div key={group.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? '' : group.id)}
                    className={`flex min-h-11 w-full items-center gap-4 rounded-[8px] px-3 py-2 text-left transition-colors ${isOpen ? 'bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white' : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'}`}
                  >
                    <GroupIcon size={21} strokeWidth={1.9} className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{group.label}</span>
                    <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="ml-[45px] space-y-0.5 py-1">
                        {group.id !== 'Polytechnic' && group.courses.map(courseButton)}
                        {group.id === 'Polytechnic' && (['NC', 'ND'] as const).map((level) => {
                          const levelCourses = group.courses.filter((course) => course.name.toUpperCase().startsWith(`${level} `));
                          if (!levelCourses.length) return null;
                          const levelOpen = expandedPolyLevel === level;
                          return (
                            <div key={level}>
                              <button
                                onClick={() => setExpandedPolyLevel(level)}
                                className="flex w-full items-center justify-between rounded-[7px] px-3 py-2 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"
                              >
                                <span>{level === 'NC' ? 'NC courses' : 'ND courses'}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${levelOpen ? 'rotate-180' : ''}`} />
                              </button>
                              <div className={`grid transition-[grid-template-rows] duration-200 ${levelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                  <div className="space-y-0.5 py-1 pl-2">{levelCourses.map(courseButton)}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
      {children && <div className="mt-3 pt-3">{children}</div>}
    </CollapsibleResourceSidebar>
  );
};
