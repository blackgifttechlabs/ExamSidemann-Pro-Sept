import React from 'react';

export interface ExplainedConcept {
  name: string;
  definition: string;
  explanation: string;
  examples: readonly string[];
  examTip?: string;
}

type Accent = 'blue' | 'amber' | 'rose' | 'emerald' | 'cyan' | 'violet';

interface ConceptExplainerProps {
  title: string;
  introduction: string;
  concepts: readonly ExplainedConcept[];
  accent?: Accent;
}

const themes: Record<Accent, {
  section: string;
  title: string;
  number: string;
  card: string;
  heading: string;
  examples: string;
  exampleLabel: string;
  chip: string;
  tip: string;
}> = {
  blue: {
    section: 'border-blue-200 bg-blue-50/40',
    title: 'text-blue-950',
    number: 'bg-blue-700 text-white',
    card: 'border-blue-100 bg-white',
    heading: 'text-blue-900',
    examples: 'bg-blue-50',
    exampleLabel: 'text-blue-700',
    chip: 'border-blue-200 bg-white text-blue-800',
    tip: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  amber: {
    section: 'border-amber-200 bg-amber-50/40',
    title: 'text-amber-950',
    number: 'bg-amber-700 text-white',
    card: 'border-amber-100 bg-white',
    heading: 'text-amber-900',
    examples: 'bg-amber-50',
    exampleLabel: 'text-amber-800',
    chip: 'border-amber-200 bg-white text-amber-900',
    tip: 'border-blue-200 bg-blue-50 text-blue-950',
  },
  rose: {
    section: 'border-rose-200 bg-rose-50/40',
    title: 'text-rose-950',
    number: 'bg-rose-700 text-white',
    card: 'border-rose-100 bg-white',
    heading: 'text-rose-900',
    examples: 'bg-rose-50',
    exampleLabel: 'text-rose-700',
    chip: 'border-rose-200 bg-white text-rose-900',
    tip: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  emerald: {
    section: 'border-emerald-200 bg-emerald-50/40',
    title: 'text-emerald-950',
    number: 'bg-emerald-700 text-white',
    card: 'border-emerald-100 bg-white',
    heading: 'text-emerald-900',
    examples: 'bg-emerald-50',
    exampleLabel: 'text-emerald-700',
    chip: 'border-emerald-200 bg-white text-emerald-900',
    tip: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  cyan: {
    section: 'border-cyan-200 bg-cyan-50/40',
    title: 'text-cyan-950',
    number: 'bg-cyan-700 text-white',
    card: 'border-cyan-100 bg-white',
    heading: 'text-cyan-900',
    examples: 'bg-cyan-50',
    exampleLabel: 'text-cyan-700',
    chip: 'border-cyan-200 bg-white text-cyan-900',
    tip: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  violet: {
    section: 'border-violet-200 bg-violet-50/40',
    title: 'text-violet-950',
    number: 'bg-violet-700 text-white',
    card: 'border-violet-100 bg-white',
    heading: 'text-violet-900',
    examples: 'bg-violet-50',
    exampleLabel: 'text-violet-700',
    chip: 'border-violet-200 bg-white text-violet-900',
    tip: 'border-amber-200 bg-amber-50 text-amber-950',
  },
};

const ConceptExplainer: React.FC<ConceptExplainerProps> = ({
  title,
  introduction,
  concepts,
  accent = 'blue',
}) => {
  const theme = themes[accent];

  return (
    <section className={`not-prose rounded-2xl border p-5 shadow-sm ${theme.section}`}>
      <h3 className={`text-xl font-black ${theme.title}`}>{title}</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">{introduction}</p>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {concepts.map((concept, index) => (
          <article key={concept.name} className={`rounded-2xl border p-5 shadow-sm ${theme.card}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${theme.number}`}>
                {index + 1}
              </span>
              <div>
                <h4 className={`text-lg font-black ${theme.heading}`}>{concept.name}</h4>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{concept.definition}</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-700">{concept.explanation}</p>

            <div className={`mt-4 rounded-xl p-3 ${theme.examples}`}>
              <p className={`text-xs font-black uppercase tracking-wider ${theme.exampleLabel}`}>
                Three examples
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {concept.examples.map((example) => (
                  <span key={example} className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}>
                    {example}
                  </span>
                ))}
              </div>
            </div>

            {concept.examTip && (
              <p className={`mt-4 rounded-xl border p-3 text-xs leading-5 ${theme.tip}`}>
                <strong>Exam clue:</strong> {concept.examTip}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ConceptExplainer;
