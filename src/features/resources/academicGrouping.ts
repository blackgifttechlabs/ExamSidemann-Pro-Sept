import {
  BookOpen,
  Briefcase,
  Cpu,
  GraduationCap,
  Layers,
  LucideIcon,
} from 'lucide-react';

export type AcademicGroup = {
  id: string;
  label: string;
  subLabel: string;
  icon: LucideIcon;
  courseNames: string[];
};

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

export const buildAcademicGroups = (courseNames: string[]): AcademicGroup[] => {
  const names = unique(courseNames);
  const includes = (predicate: (name: string) => boolean) => names.filter(predicate);

  const zjc = includes((name) => name === 'Form 1' || name === 'Form 2');
  const oLevel = includes((name) => name === 'Form 3' || name === 'Form 4');
  const aLevel = includes((name) => name.includes('Lower 6') || name.includes('Upper 6'));
  const polyNc = includes((name) => name.startsWith('NC ') || name.includes(' NC') || name.includes('-nc'));
  const polyNd = includes((name) => name.startsWith('ND ') || name.includes(' ND') || name.includes('-nd'));
  const other = names.filter(
    (name) => ![...zjc, ...oLevel, ...aLevel, ...polyNc, ...polyNd].includes(name)
  );

  return [
    { id: 'zjc', label: 'ZJC', subLabel: 'Form 1 and Form 2', icon: BookOpen, courseNames: zjc },
    { id: 'olevel', label: 'O Level', subLabel: 'Form 3 and Form 4', icon: Layers, courseNames: oLevel },
    { id: 'alevel', label: 'A Level', subLabel: 'Lower 6 and Upper 6', icon: GraduationCap, courseNames: aLevel },
    { id: 'poly-nc', label: 'Polytechnic NC', subLabel: 'National Certificate', icon: Cpu, courseNames: polyNc },
    { id: 'poly-nd', label: 'Polytechnic ND', subLabel: 'National Diploma', icon: Briefcase, courseNames: polyNd },
    { id: 'other', label: 'Other', subLabel: 'Additional courses', icon: GraduationCap, courseNames: other },
  ].filter((group) => group.courseNames.length > 0);
};

