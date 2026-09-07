import React from 'react';
import {
  BookOpen,
  Brain,
  Compass,
  HeartHandshake,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const values = [
  {
    title: 'Access comes first',
    description: 'Useful learning should be available to every learner, wherever they study and whatever device they use.',
    icon: BookOpen,
    colors: 'from-violet-100 to-fuchsia-50 text-violet-600 dark:from-violet-500/15 dark:to-fuchsia-500/5',
  },
  {
    title: 'Teach with clarity',
    description: 'We turn difficult syllabus ideas into practical explanations, examples, revision materials, and guided lessons.',
    icon: Lightbulb,
    colors: 'from-amber-100 to-orange-50 text-amber-600 dark:from-amber-500/15 dark:to-orange-500/5',
  },
  {
    title: 'Empower progress',
    description: 'Every tool should help learners build confidence, practise independently, and take the next academic step.',
    icon: Target,
    colors: 'from-cyan-100 to-blue-50 text-cyan-600 dark:from-cyan-500/15 dark:to-blue-500/5',
  },
  {
    title: 'Keep learning simple',
    description: 'Courses, books, papers, videos, schools, and opportunities belong in one organised and easy-to-use place.',
    icon: Sparkles,
    colors: 'from-emerald-100 to-teal-50 text-emerald-600 dark:from-emerald-500/15 dark:to-teal-500/5',
  },
];

const learnerGoals = [
  { title: 'Prepare for exams', description: 'Use notes, syllabi, past papers, and guided practice in one study flow.', icon: ShieldCheck },
  { title: 'Understand hard topics', description: 'Move from a difficult concept to clear examples and structured outcomes.', icon: Brain },
  { title: 'Find the right school', description: 'Compare primary schools, high schools, colleges, and universities by province.', icon: Search },
  { title: 'Learn from teachers', description: 'Discover video lessons and extra classes organised around subjects and levels.', icon: Users },
  { title: 'Choose a career path', description: 'Explore academic and technical programmes from junior level through tertiary study.', icon: Compass },
  { title: 'Study with confidence', description: 'Keep trusted resources close and return whenever revision or support is needed.', icon: HeartHandshake },
];

export const HomeCommunitySections: React.FC = () => (
  <div className="bg-white text-slate-900 dark:bg-[#08080b] dark:text-white">
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="mb-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">What guides us</p>
        <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">Our values</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <article key={value.title} className="rounded-[18px] bg-slate-50 p-5 dark:bg-white/[0.035] md:p-6">
              <div className={`flex h-52 items-center justify-center rounded-[15px] bg-gradient-to-br ${value.colors}`}>
                <Icon size={72} strokeWidth={1.4} />
              </div>
              <h3 className="mt-6 text-lg font-black">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{value.description}</p>
            </article>
          );
        })}
      </div>
    </section>

    <section className="px-4 pb-20 md:px-8 md:pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[24px] bg-[#eaf2ff] px-6 py-14 text-center dark:bg-blue-500/10 md:px-20">
        <div className="absolute -left-10 bottom-[-70px] h-52 w-52 rounded-full border-[28px] border-blue-300/35" />
        <div className="absolute -right-8 top-[-70px] h-48 w-48 rounded-full border-[24px] border-violet-300/30" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">A word from all of us</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-4xl">Built with respect for every learning journey</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">We recognise the teachers, families, schools, colleges, communities, and learners across Zimbabwe who keep education moving forward. Exam Sidemann exists to support their work, widen access to knowledge, and help every learner find a path they can believe in.</p>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-20 dark:bg-white/[0.025] md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">One platform, many goals</p>
          <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">What learners come here to do</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learnerGoals.map((goal) => {
            const Icon = goal.icon;
            return (
              <article key={goal.title} className="rounded-[18px] bg-white p-6 shadow-sm dark:bg-[#111]">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300"><Icon size={22} /></span>
                <h3 className="mt-6 text-lg font-black">{goal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{goal.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);
