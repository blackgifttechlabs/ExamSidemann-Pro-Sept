import React from 'react';
import { Globe2, Landmark } from 'lucide-react';
import { COUNTRY_DETAILS } from '../data/countryDetails';
import { MONUMENTS_MAP } from '../data/geographyData';

export const CountryDetailsCard: React.FC<{ country: { name: string; alpha2: string; id: string } }> = ({ country }) => {
  const details = COUNTRY_DETAILS[country.id];
  const landmark = MONUMENTS_MAP[country.id];
  const rows = [
    ['Name', details?.name || country.name],
    ['Calling Code', details?.callingCodes.join(', ') || 'Not available'],
    ['Capital', details?.capital || 'Not available'],
    ['Main Language', details?.mainLanguage || 'Not available'],
  ];

  return (
    <div className="space-y-5 pt-1">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="Country details">
        <div className="bg-slate-50 px-5 pb-5 pt-5 dark:bg-slate-800/60">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
            <Globe2 size={14} /> Country Profile
          </div>
          <h2 className="pr-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{details?.name || country.name}</h2>
          {country.alpha2 && (
            <img src={`https://flagcdn.com/w320/${country.alpha2}.png`} alt={`${country.name} flag`} className="mt-5 block max-h-40 w-auto max-w-full rounded-md object-contain shadow-sm" />
          )}
        </div>
        <dl className="divide-y divide-slate-100 px-5 dark:divide-slate-800">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 text-sm">
              <dt className="font-semibold text-slate-500 dark:text-slate-400">{label}:</dt>
              <dd className="min-w-0 break-words font-bold text-slate-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {landmark && (
        <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 dark:border-teal-800 dark:from-teal-950/50 dark:to-slate-900" aria-label="Famous landmark">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"><Landmark size={20} /></span>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Famous Landmark</h3>
          </div>
          {landmark.image && (
            <img
              src={landmark.image}
              alt={landmark.name}
              className="mb-3 h-40 w-full rounded-xl object-cover shadow-sm"
            />
          )}
          <p className="text-lg font-bold leading-snug text-slate-900 dark:text-white">{landmark.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{landmark.hint}</p>
        </section>
      )}
    </div>
  );
};
