import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Simple "Code → Output" example. Code on the left, result on the right (stacked on phones).
export const CodeExample: React.FC<{
  title: string;
  code: string;
  language?: string;
  output: React.ReactNode;
  outputLabel?: string;
  note?: string;
}> = ({ title, code, language = 'markup', output, outputLabel = 'Output', note }) => (
  <div className="pt-2">
    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Code</p>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
          <SyntaxHighlighter
            language={language}
            style={
              typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
                ? oneDark
                : oneLight
            }
            customStyle={{ margin: 0, padding: 12, fontSize: 12, lineHeight: 1.6 }}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{outputLabel}</p>
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
          {output}
        </div>
      </div>
    </div>
    {note && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{note}</p>}
  </div>
);

// Simple boxes-and-arrows diagram. Goes left to right on desktop, top to bottom on phones.
const STEP_COLORS = [
  'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700',
  'bg-purple-50 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700',
  'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700',
  'bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700',
];

export const FlowDiagram: React.FC<{
  title: string;
  steps: { label: string; detail?: string }[];
}> = ({ title, steps }) => (
  <div className="pt-2">
    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h4>
    <div className="mt-2 flex flex-col md:flex-row md:items-stretch gap-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className={`flex-1 p-3 rounded-lg border ${STEP_COLORS[i % STEP_COLORS.length]} text-center`}>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
            {s.detail && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{s.detail}</p>}
          </div>
          {i < steps.length - 1 && (
            <div className="self-center text-slate-500 dark:text-slate-400 font-bold md:rotate-0 rotate-90" aria-hidden>
              →
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

// Plain terminal-style output block (for Git commands)
export const TerminalOutput: React.FC<{ lines: string }> = ({ lines }) => (
  <pre className="text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">{lines}</pre>
);

// Border around a group of examples
export const ExampleBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 p-4 rounded-xl border border-slate-300 dark:border-slate-700 space-y-4">{children}</div>
);

// Opening lines for every topic: what it is and why the reader needs it
export const TopicIntro: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
);

// Small browser window with an address bar, used to show example output
export const BrowserFrame: React.FC<{ url?: string; children: React.ReactNode }> = ({
  url = 'chickeninn.com',
  children,
}) => (
  <div className="rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
    <div className="px-2 py-1.5 bg-slate-100 dark:bg-white/[0.06] border-b border-slate-300 dark:border-slate-700">
      <span className="block px-3 py-0.5 rounded-full bg-white dark:bg-[#121212] text-xs text-slate-600 dark:text-slate-300">
        {url}
      </span>
    </div>
    <div className="p-3">{children}</div>
  </div>
);
