import React from 'react';

export const LessonFigure: React.FC<{ title: string; caption?: string; children: React.ReactNode }> = ({ title, caption, children }) => (
  <figure className="mb-6 w-full min-w-0 max-w-2xl rounded-xl border border-slate-200 bg-white p-4">
    <h4 className="mb-4 text-xs font-bold uppercase text-emerald-700">{title}</h4>
    <div className="flex min-w-0 items-start justify-start">{children}</div>
    {caption && <figcaption className="mt-3 text-sm leading-relaxed text-slate-500">{caption}</figcaption>}
  </figure>
);

/** Keep explanations in normal document flow, separate from diagram geometry. */
export const LessonDiagram: React.FC<React.SVGProps<SVGSVGElement> & { notes?: string[] }> = ({ notes = [], className = '', children, ...props }) => (
  <div className={`w-full min-w-0 ${className}`}>
    <svg {...props} role="img" aria-label={props['aria-label'] || notes.join(' ')} className="block h-auto w-full" style={{ fontFamily: 'Arial, sans-serif', ...props.style }}>{children}</svg>
    {notes.length > 0 && <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{notes.map(note => <p key={note}>{note}</p>)}</div>}
  </div>
);

export const LessonImage: React.FC<{ name: string; alt: string; labels?: string[] }> = ({ name, alt, labels = [] }) => (
  <div className="w-full min-w-0 max-w-[480px]">
    <img src={`/images/physics/lesson-examples/${name}.webp`} alt={alt} loading="lazy" decoding="async" width={1536} height={1024} className="block h-auto w-full rounded-lg bg-white object-contain" />
    {labels.length > 0 && <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold leading-relaxed text-slate-700">{labels.map(label => <li key={label}>{label}</li>)}</ul>}
  </div>
);
