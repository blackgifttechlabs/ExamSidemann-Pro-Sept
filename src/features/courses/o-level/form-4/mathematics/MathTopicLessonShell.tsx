import React from 'react';
import { BookOpen, CheckCircle2, Lightbulb, PencilLine } from 'lucide-react';

type Formula = { label: string; expression: string; note?: string };
type WorkedExample = { question: string; working: string[]; answer: string };

type MathTopicLessonShellProps = {
  chapter: string;
  title: string;
  description: string;
  outcomes: string[];
  formulas: Formula[];
  examples: WorkedExample[];
  reminders: string[];
};

export const MathTopicLessonShell: React.FC<MathTopicLessonShellProps> = ({
  chapter,
  title,
  description,
  outcomes,
  formulas,
  examples,
  reminders,
}) => (
  <article className="mx-auto w-full max-w-6xl space-y-6 p-4 pb-20 sm:p-8">
    <header className="rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Form 4 Mathematics · {chapter}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-emerald-50">{description}</p>
    </header>

    <section className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><BookOpen size={20} className="text-emerald-600" />What you will learn</h2>
        <ul className="mt-4 space-y-3">
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-slate-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />{outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-cyan-950"><Lightbulb size={20} className="text-amber-500" />Key facts and formulae</h2>
        <div className="mt-4 grid gap-3">
          {formulas.map((formula) => (
            <div key={formula.label} className="rounded-xl border border-cyan-100 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">{formula.label}</p>
              <p className="mt-1 break-words text-lg font-black text-slate-900">{formula.expression}</p>
              {formula.note && <p className="mt-1 text-sm text-slate-500">{formula.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900"><PencilLine size={21} className="text-emerald-600" />Worked examples</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {examples.map((example, index) => (
          <div key={example.question} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-bold text-slate-900">{index + 1}. {example.question}</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              {example.working.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-900">Answer: {example.answer}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-lg sm:p-6">
      <h2 className="text-lg font-bold">Exam reminders</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {reminders.map((reminder) => <li key={reminder} className="rounded-lg bg-slate-800 p-3 text-sm leading-relaxed text-slate-200">• {reminder}</li>)}
      </ul>
    </section>
  </article>
);

export default MathTopicLessonShell;
