import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Cpu,
  GraduationCap,
  Layers,
  Library,
  Sparkles,
} from 'lucide-react';
import { CURRICULUM_REGISTRY } from '../../data/constants';

type Props = {
  onNavigate: (page: string, params?: any) => void;
};

const categories = [
  { id: 'ZJC', label: 'ZJC', detail: 'Forms 1 and 2', description: 'Build strong junior secondary foundations.', icon: BookOpen, accent: 'bg-violet-600' },
  { id: "O' Level", label: 'O Level', detail: 'Forms 3 and 4', description: 'Prepare for ZIMSEC Ordinary Level exams.', icon: Layers, accent: 'bg-blue-600' },
  { id: "A' Level", label: 'A Level', detail: 'Lower and Upper 6', description: 'Go deeper with advanced subject pathways.', icon: GraduationCap, accent: 'bg-indigo-600' },
  { id: 'Polytechnic', label: 'Polytechnic', detail: 'NC and ND', description: 'Explore practical HEXCO technical programmes.', icon: Cpu, accent: 'bg-emerald-600' },
];

const credentialFor = (name: string) => name.toUpperCase().startsWith('ND ') ? 'ND' : 'NC';

export const CompactCoursesOverview: React.FC<Props> = ({ onNavigate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [polyCredential, setPolyCredential] = useState<'NC' | 'ND' | ''>('');
  const levelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    setSelectedCategory(category);
    const level = searchParams.get('level') || '';
    if (category === 'Polytechnic' && level) setPolyCredential(credentialFor(level));
  }, [searchParams]);

  const visibleLevels = useMemo(() => CURRICULUM_REGISTRY.filter((course) => {
    if (course.category !== selectedCategory) return false;
    return selectedCategory !== 'Polytechnic' || !polyCredential || credentialFor(course.name) === polyCredential;
  }), [polyCredential, selectedCategory]);

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    setPolyCredential('');
    // A filter, not a destination: it rewrites the current history entry so
    // Back leaves the page instead of undoing each category you tried.
    setSearchParams({ category }, { replace: true });
    window.setTimeout(() => levelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] pb-24 text-left text-slate-900 dark:bg-[#08080a] dark:text-white">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:px-8 md:pt-16">
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-violet-300">
            <Sparkles size={13} /> Learning library
          </div>
          <h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">Choose your academic path.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 md:text-base">
            Start with a level, pick your form or qualification, then open the complete subject library.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => chooseCategory(category.id)}
                className={`group rounded-[15px] border p-4 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 md:p-5 ${
                  active
                    ? 'border-violet-300 bg-white shadow-[0_12px_30px_rgba(76,29,149,0.10)] dark:border-violet-500/50 dark:bg-white/[0.07]'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20'
                }`}
              >
                <span className={`mb-7 flex h-10 w-10 items-center justify-center rounded-[12px] text-white ${category.accent}`}>
                  <Icon size={19} />
                </span>
                <span className="block text-lg font-black md:text-xl">{category.label}</span>
                <span className="mt-0.5 block text-[11px] font-bold text-slate-400">{category.detail}</span>
                <span className="mt-3 hidden text-xs leading-5 text-slate-500 dark:text-slate-400 sm:block">{category.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={levelsRef} className="scroll-mt-24">
        {selectedCategory ? (
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">Next step</p>
                <h2 className="mt-1 text-2xl font-black">{selectedCategory === 'Polytechnic' ? 'Choose your qualification' : `Choose your ${selectedCategory} level`}</h2>
              </div>
              <span className="hidden text-xs font-bold text-slate-400 sm:block">{visibleLevels.length} available</span>
            </div>

            {selectedCategory === 'Polytechnic' && (
              <div className="mb-5 grid grid-cols-2 gap-3">
                {(['NC', 'ND'] as const).map((credential) => (
                  <button
                    key={credential}
                    onClick={() => setPolyCredential(credential)}
                    className={`flex items-center justify-between rounded-[15px] border p-4 text-left transition-colors ${
                      polyCredential === credential
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.035]'
                    }`}
                  >
                    <span>
                      <span className="block text-xl font-black">{credential}</span>
                      <span className="text-[11px] font-bold opacity-65">{credential === 'NC' ? 'National Certificate' : 'National Diploma'}</span>
                    </span>
                    <ChevronDown size={18} className={`transition-transform ${polyCredential === credential ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            )}

            {(selectedCategory !== 'Polytechnic' || polyCredential) && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleLevels.map((level) => (
                  <button
                    key={level.name}
                    onClick={() => onNavigate('courses/detail', { id: level.name })}
                    className="group flex min-h-[150px] flex-col rounded-[15px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-violet-500/50"
                  >
                    <div className="mb-auto flex items-center justify-between">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                        {level.category === 'Polytechnic' ? 'HEXCO' : 'ZIMSEC'}
                      </span>
                      <ArrowRight size={17} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-violet-500" />
                    </div>
                    <h3 className="mt-7 text-lg font-black leading-tight">{level.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><Library size={12} /> {level.subjects.length} subjects</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
            <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 px-5 py-14 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <Library className="mx-auto mb-3 text-slate-300" size={26} />
              <p className="font-black">Choose a path to continue</p>
              <p className="mt-1 text-sm text-slate-400">Your forms and qualifications will appear here.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
