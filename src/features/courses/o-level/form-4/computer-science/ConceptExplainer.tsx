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
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-blue-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-700',
    chip: 'border-slate-200 bg-white text-slate-800',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
  },
  amber: {
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-amber-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-800',
    chip: 'border-slate-200 bg-white text-slate-900',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
  },
  rose: {
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-rose-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-700',
    chip: 'border-slate-200 bg-white text-slate-900',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
  },
  emerald: {
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-emerald-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-700',
    chip: 'border-slate-200 bg-white text-slate-900',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
  },
  cyan: {
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-cyan-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-700',
    chip: 'border-slate-200 bg-white text-slate-900',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
  },
  violet: {
    section: 'border-slate-200 bg-slate-50/40',
    title: 'text-slate-900',
    number: 'bg-violet-700 text-white',
    card: 'border-slate-200 bg-white',
    heading: 'text-slate-900',
    examples: 'bg-slate-50',
    exampleLabel: 'text-slate-700',
    chip: 'border-slate-200 bg-white text-slate-900',
    tip: 'border-slate-200 bg-slate-50 text-slate-900',
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
      <p className="mt-2 max-w-4xl text-base leading-6 text-slate-700">{introduction}</p>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {concepts.map((concept, index) => (
          <article key={concept.name} className={`rounded-2xl border p-5 shadow-sm ${theme.card}`}>
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-black ${theme.number}`}>
                {index + 1}
              </span>
              <div>
                <h4 className={`text-lg font-black ${theme.heading}`}>{concept.name}</h4>
                <p className="mt-1 text-base font-semibold leading-6 text-slate-800">{concept.definition}</p>
              </div>
            </div>

            <p className="mt-3 text-base leading-6 text-slate-700">{concept.explanation}</p>

            <div className={`mt-4 rounded-xl p-3 ${theme.examples}`}>
              <p className={`text-sm font-black uppercase tracking-wider ${theme.exampleLabel}`}>
                Three examples
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {concept.examples.map((example) => (
                  <span key={example} className={`rounded-full border px-3 py-1 text-sm font-bold ${theme.chip}`}>
                    {example}
                  </span>
                ))}
              </div>
            </div>

            {concept.examTip && (
              <p className={`mt-4 rounded-xl border p-3 text-sm leading-5 ${theme.tip}`}>
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
