import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, Building2, Eye, GraduationCap, School } from 'lucide-react';
import { schoolsForType } from '../../data/schoolRegistry';
import { institutionLogoForName } from '../../data/polytechnicLogos';

type Props = { onNavigate: (page: string, params?: any) => void };

const categories = [
  { id: 'primary', label: 'Primary Schools', detail: 'Foundational learning', icon: BookOpen, tone: 'from-emerald-500 to-teal-700' },
  { id: 'high', label: 'High Schools', detail: 'O Level and A Level', icon: School, tone: 'from-blue-500 to-indigo-700' },
  { id: 'poly', label: 'Colleges & Polytechnics', detail: 'Certificates and diplomas', icon: Building2, tone: 'from-orange-500 to-rose-700' },
  { id: 'university', label: 'Universities', detail: 'Degree programmes', icon: GraduationCap, tone: 'from-violet-500 to-purple-800' },
  { id: 'blind', label: 'Visual Impairment', detail: 'Specialist institutions', icon: Eye, tone: 'from-cyan-500 to-blue-700' },
] as const;

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

export const CompactSchoolFinder: React.FC<Props> = ({ onNavigate }) => {
  const cards = useMemo(() => categories.map((category) => {
    const schools = [...schoolsForType(category.id)];
    const representatives = [...schools]
      .sort((first, second) => Number(!!institutionLogoForName(second.name)) - Number(!!institutionLogoForName(first.name)))
      .slice(0, 3);
    return { ...category, count: schools.length, representatives };
  }), []);

  return (
    <main className="min-h-[calc(100dvh-var(--app-header-h))] bg-slate-50 px-4 py-10 text-left dark:bg-[#070709] md:px-8 md:py-16">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-600">Zimbabwe school directory</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-slate-950 dark:text-white md:text-6xl">Find schools near you</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 md:text-base">Choose an institution type, then search by province or district and open each school’s available information, contacts, programmes and location.</p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((category) => {
            const Icon = category.icon;
            return (
              <button key={category.id} type="button" onClick={() => onNavigate('schools/search', { type: category.id })} className="group overflow-hidden rounded-[9px] border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111117]">
                <div className={`relative h-32 bg-gradient-to-br ${category.tone} p-5 text-white`}>
                  <Icon size={30} className="opacity-90" />
                  <div className="absolute bottom-4 right-4 flex -space-x-3">
                    {category.representatives.map((school) => {
                      const logo = institutionLogoForName(school.name);
                      return (
                        <span key={school.id} title={school.name} className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white text-[10px] font-black text-slate-700 shadow-md">
                          {logo ? <img src={logo} alt={`${school.name} logo`} className="h-full w-full object-contain p-1" /> : initialsFor(school.name)}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-600">{category.detail}</p>
                  <h2 className="mt-1.5 text-lg font-black text-slate-900 dark:text-white">{category.label}</h2>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                    <span className="text-xs font-bold text-slate-400">{category.count.toLocaleString()} institutions</span>
                    <span className="flex items-center gap-1 text-xs font-black text-cyan-600">Browse <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
