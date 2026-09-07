import React from 'react';

interface ProsConsComparisonProps {
  title?: string;
  advantages: readonly string[];
  disadvantages: readonly string[];
  advantagesLabel?: string;
  disadvantagesLabel?: string;
}

const NumberedPoints: React.FC<{
  items: readonly string[];
  tone: 'positive' | 'negative';
}> = ({ items, tone }) => {
  const positive = tone === 'positive';

  return (
    <ol className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
              positive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {index + 1}
          </span>
          <span className="text-sm leading-6 text-slate-700">{item}</span>
        </li>
      ))}
    </ol>
  );
};

export const ProsConsComparison: React.FC<ProsConsComparisonProps> = ({
  title,
  advantages,
  disadvantages,
  advantagesLabel = 'Advantages',
  disadvantagesLabel = 'Disadvantages',
}) => (
  <section className="not-prose">
    {title && <h4 className="mb-4 text-lg font-bold text-blue-700">{title}</h4>}
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-lg font-black text-emerald-800">
            ✓ {advantagesLabel}
          </h5>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">
            {advantages.length} points
          </span>
        </div>
        <NumberedPoints items={advantages} tone="positive" />
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-lg font-black text-rose-800">
            ! {disadvantagesLabel}
          </h5>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-rose-700">
            {disadvantages.length} points
          </span>
        </div>
        <NumberedPoints items={disadvantages} tone="negative" />
      </div>
    </div>
  </section>
);

export default ProsConsComparison;
