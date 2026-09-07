import React from 'react';
import { BookOpen, CheckCircle2, Sprout } from 'lucide-react';

const TOPIC_SUMMARIES: Record<string, string> = {
  'General Agriculture': 'Explore the role of agriculture, farming systems, tools, safety and sustainable production.',
  'Soil and Water': 'Study soil formation, soil properties, fertility, conservation, irrigation and responsible water use.',
  'Crop Husbandry': 'Learn how crops are selected, established, managed, protected, harvested and stored.',
  'Animal Husbandry': 'Learn the principles of livestock breeds, nutrition, housing, health, reproduction and welfare.',
  'Farm Structures and Machinery': 'Study farm buildings, tools, machinery, maintenance and safe operation.',
  'Agri-Business': 'Connect farm production with planning, records, budgeting, marketing and entrepreneurship.',
};

export const AgricultureTopicPage: React.FC<{ level: string; title: string }> = ({ level, title }) => (
  <article className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 text-left sm:px-6">
    <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-[9px] bg-white/15 ring-1 ring-white/20">
          <Sprout size={23} />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100">{level} Agriculture</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">{title}</h1>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-sm font-medium leading-6 text-emerald-50 sm:text-base">
        {TOPIC_SUMMARIES[title]}
      </p>
    </header>

    <section className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-[9px] border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-500/15 dark:bg-[#1c1f26]">
        <BookOpen size={19} className="text-emerald-600" />
        <h2 className="mt-3 text-sm font-black text-slate-900 dark:text-white">Topic overview</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">This lesson introduces the essential knowledge and practical skills for {title.toLowerCase()}.</p>
      </div>
      <div className="rounded-[9px] border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-500/15 dark:bg-emerald-500/10">
        <CheckCircle2 size={19} className="text-emerald-600" />
        <h2 className="mt-3 text-sm font-black text-slate-900 dark:text-white">Learning outcome</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">By the end, learners should explain key ideas and apply them to practical farming situations.</p>
      </div>
    </section>
  </article>
);

export default AgricultureTopicPage;
