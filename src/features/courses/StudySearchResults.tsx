import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaBookOpen, FaCode, FaFlask, FaCalculator, FaLeaf, FaDatabase } from 'react-icons/fa';
import { searchStudyCatalog } from '../../utils/studySearch';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { slugifyLearningPath } from '../../utils/learningOutcomeSeo';

export const StudyHero: React.FC<{ title: string; subtitle: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="relative min-h-[320px] overflow-hidden bg-violet-100 text-white">
    <img src="https://i.ibb.co/rfvwxmGn/es-heroo.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="relative px-5 py-8 sm:px-10 lg:px-[100px]">
      {children}
      <h1 className="mt-14 text-4xl font-bold tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] md:text-5xl">{title}</h1>
      <p className="mt-3 text-base text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{subtitle}</p>
    </div>
  </div>
);

const icons = [FaBookOpen, FaCode, FaFlask, FaCalculator, FaLeaf, FaDatabase];
const colors = ['from-fuchsia-500 to-purple-600', 'from-violet-600 to-indigo-700', 'from-emerald-500 to-cyan-700', 'from-orange-400 to-rose-600', 'from-blue-500 to-indigo-700'];
export const StudyCard: React.FC<{ title: string; label: string; footer: string; to: string; index: number; action?: string }> = ({ title, label, footer, to, index, action = 'View list' }) => {
  const Icon = /algorithm|program|computer|software/i.test(title) ? FaCode : /database|records/i.test(title) ? FaDatabase : icons[index % icons.length];
  return <Link to={to} className={`group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl bg-gradient-to-br ${colors[index % colors.length]} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-violet-400`}>
    <span className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
    <span className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-black/10" />
    <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15"><Icon size={54} aria-hidden="true" /></div>
    <p className="relative text-xs font-semibold uppercase tracking-wider text-white/80">{label}</p>
    <h3 className="relative mb-6 mt-2 flex-1 text-xl font-bold leading-snug">{title}</h3>
    <div className="relative flex items-center justify-between gap-3 border-t border-white/30 pt-4 text-xs font-bold uppercase tracking-wider"><span>{footer}</span><span className="flex items-center gap-2">{action} <FaArrowRight aria-hidden="true" /></span></div>
  </Link>;
};

export const StudySearchResults: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const results = searchStudyCatalog(query);
  return <section className="min-h-screen bg-slate-50 pb-20 text-slate-950 dark:bg-[#070914] dark:text-white">
    <StudyHero title="Search Results" subtitle="Choose Topic You Want To Study">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Link to="/chat/" className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-bold text-violet-700"><FaBookOpen /> Sidemann AI</Link>
        <form onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setParams({ q: String(data.get('q') || '') }); }} className="flex w-full items-center gap-3 rounded-xl bg-white px-4 text-slate-900 sm:w-96">
          <FaSearch className="text-slate-400" /><input key={query} name="q" defaultValue={query} aria-label="Search subjects and levels" placeholder="Search levels, forms or subjects…" className="min-w-0 flex-1 bg-transparent py-3 outline-none" /><button aria-label="Search" type="submit"><FaArrowRight /></button>
        </form>
      </div>
    </StudyHero>
    <div className="px-5 py-10 sm:px-10 lg:px-[100px]">
      <h2 className="text-2xl font-bold">Choose Topic You Want To Study</h2>
      <p className="mb-7 mt-2 text-sm text-slate-500 dark:text-slate-400">{results.length} results for “{query}”</p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{results.map((item, index) => {
        const course = CURRICULUM_REGISTRY.find(level => level.name === item.levelName)!;
        const subject = course.subjects.find(subject => subject.name === item.title);
        return <StudyCard key={item.id} title={item.title} label={`${item.levelCategory} · ${item.levelName}`} footer={subject ? `${subject.outcomeCount} topics` : `${course.subjects.length} subjects`} to={`/courses/${course.id}/${subject ? `${slugifyLearningPath(subject.name)}/` : ''}`} index={index} />;
      })}</div>
      {!results.length && <p className="py-12 text-slate-500">No subjects found. Try another subject, course or level.</p>}
    </div>
  </section>;
};
