import React from 'react';

const IMAGE_BASE = '/images/courses/nd-it/hardware-administration/learning-outcome-1';

const TOOLS: { icon: string; title: string; text: React.ReactNode }[] = [
  { icon: 'strap', title: 'Anti-Static Wrist Strap', text: <>Protects computer parts from <strong>static electricity</strong> that can damage them.</> },
  { icon: 'screwdriver', title: 'Precision Screwdriver Set', text: <>Used to <strong>open computers and remove or tighten screws</strong>.</> },
  { icon: 'flashlight', title: 'Flashlight', text: <>Helps the technician <strong>see inside dark areas</strong> of the computer.</> },
  { icon: 'multimeter', title: 'Digital Multimeter', text: <>Used to <strong>check voltage and electrical connections</strong>.</> },
  { icon: 'duster', title: 'Compressed Air Duster', text: <>Used to <strong>remove dust</strong> from fans, vents, and other computer parts.</> },
  { icon: 'tester', title: 'Cable Tester', text: <>Used to <strong>check if network and other cables are working properly</strong>.</> },
  { icon: 'usb', title: 'USB Flash Drive', text: <>Used to <strong>install an operating system or run repair tools</strong>.</> },
  { icon: 'bag', title: 'Laptop Caddy / Tool Bag', text: <>Used to <strong>keep tools organized and easy to carry</strong>.</> },
  { icon: 'ties', title: 'Zip Ties and Velcro', text: <>Used to <strong>keep computer cables neat and organized</strong>.</> },
  { icon: 'notebook', title: 'Notebook and Pen', text: <>Used to <strong>record problems, tests, and repairs</strong>.</> },
];

export const ToolkitCards: React.FC = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {TOOLS.map((tool, i) => (
      <div key={tool.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#121212]">
        <img
          src={`${IMAGE_BASE}/tool-${tool.icon}.webp`}
          alt={tool.title}
          width={384}
          height={384}
          loading="lazy"
          decoding="async"
          className="mx-auto aspect-square w-full max-w-48 rounded-lg bg-white object-contain"
        />
        <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{i + 1}. {tool.title}</h3>
        <p className="mt-1 text-base leading-relaxed text-slate-700 dark:text-slate-300">{tool.text}</p>
      </div>
    ))}
  </div>
);
