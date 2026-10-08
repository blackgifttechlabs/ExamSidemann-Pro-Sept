import React, { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Moon, PanelLeft, Play, Search, Sun, Code2, Pencil } from 'lucide-react';
import {
  WEB_CATEGORIES,
  WebCategory,
  WebTopic,
  starterFor,
  wrapInPage,
} from './webLessons';

interface Props {
  onBack?: () => void;
}

const WebDevIDE = React.lazy(() => import('./WebDevIDE').then((m) => ({ default: m.WebDevIDE })));

type View = { kind: 'cards'; cat: WebCategory } | { kind: 'lesson'; cat: WebCategory; topic: WebTopic };
type Mode = 'guided' | 'diy';

const TOKEN_RE = /(<!--[\s\S]*?-->)|(<!DOCTYPE[^>]*>)|(<\/?)([a-zA-Z][a-zA-Z0-9]*)|("[^"]*")|([a-zA-Z-]+(?==))|(\/?>)/gi;

// VS Code "Dark+" and "Light+" HTML colours.
const VSCODE = {
  dark: ['#6a9955', '#569cd6', '#808080', '#569cd6', '#ce9178', '#9cdcfe', '#808080'],
  light: ['#008000', '#800000', '#800000', '#800000', '#0000ff', '#e50000', '#800000'],
};

/** Tiny HTML colouriser using the VS Code palette, enough for the short snippets in these lessons. */
const Highlight: React.FC<{ code: string; dark: boolean }> = ({ code, dark }) => {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  const colours = dark ? VSCODE.dark : VSCODE.light;
  for (const m of code.matchAll(TOKEN_RE)) {
    const at = m.index ?? 0;
    if (at > last) nodes.push(code.slice(last, at));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    nodes.push(
      <span key={i++} style={{ color: colours[group], fontStyle: group === 0 ? 'italic' : undefined }}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return <>{nodes}</>;
};

/** "Paragraphs: p" becomes a name with the tag shown beneath it in colour. */
const TitleParts: React.FC<{ title: string; dark: boolean; tagClass?: string }> = ({ title, dark, tagClass = 'text-sm' }) => {
  const [name, ...rest] = title.split(': ');
  const tag = rest.join(': ');
  return (
    <>
      <span>{name}</span>
      {tag && (
        <span className={`block font-mono font-bold ${tagClass} ${dark ? 'text-sky-400' : 'text-blue-700'}`}>{tag}</span>
      )}
    </>
  );
};

/** Result frame that grows to fit its page so short examples never scroll. */
const AutoFrame: React.FC<{ title: string; html: string; min?: number }> = ({ title, html, min = 140 }) => {
  const [height, setHeight] = useState(min);
  return (
    <iframe
      title={title}
      // allow-same-origin without allow-scripts: the page cannot run code, but we can measure it.
      sandbox="allow-same-origin"
      srcDoc={html}
      onLoad={(e) => {
        const doc = e.currentTarget.contentDocument;
        if (doc) setHeight(Math.max(min, doc.documentElement.scrollHeight + 8));
      }}
      style={{ height }}
      className="block w-full bg-white"
    />
  );
};

const pageFor = (html: string) =>
  /<html[\s>]/i.test(html)
    ? html
    : `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;padding:12px;margin:0;color:#111}</style></head><body>${html}</body></html>`;

export const WebDevLearnLab: React.FC<Props> = ({ onBack }) => {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 1024));
  const [openCat, setOpenCat] = useState<string>(WEB_CATEGORIES[0].id);
  const [view, setView] = useState<View>({ kind: 'cards', cat: WEB_CATEGORIES[0] });
  const [mode, setMode] = useState<Mode>('guided');
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [search, setSearch] = useState('');
  const [showIde, setShowIde] = useState(false);

  const t = dark
    ? {
        page: 'bg-[#0a0a0f] text-slate-100',
        side: 'bg-[#0d0d14] border-white/10',
        panel: 'bg-[#1c1c24] border-white/10',
        soft: 'text-slate-400',
        hover: 'hover:bg-white/5',
        active: 'bg-blue-500/15 text-blue-400',
        input: 'bg-[#13131a] border-white/15 text-slate-100',
        code: 'bg-[#1e1e1e] border-white/10',
        chip: 'bg-white/5 border-white/15 text-slate-100',
      }
    : {
        page: 'bg-slate-50 text-slate-900',
        side: 'bg-white border-slate-200',
        panel: 'bg-white border-slate-200',
        soft: 'text-slate-500',
        hover: 'hover:bg-slate-100',
        active: 'bg-blue-50 text-blue-700',
        input: 'bg-white border-slate-300 text-slate-900',
        code: 'bg-white border-slate-200',
        chip: 'bg-white border-slate-300 text-slate-900',
      };

  const flatTopics = useMemo(
    () => WEB_CATEGORIES.filter((c) => c.enabled).flatMap((c) => c.topics.map((topic) => ({ cat: c, topic }))),
    [],
  );

  const query = search.trim().toLowerCase();
  const searchHits = query
    ? flatTopics.filter(({ topic }) => `${topic.title} ${topic.glyph} ${topic.definition}`.toLowerCase().includes(query))
    : [];

  if (showIde) {
    return (
      <React.Suspense fallback={<div className="grid h-[100dvh] place-items-center">Loading…</div>}>
        <WebDevIDE onBack={() => setShowIde(false)} />
      </React.Suspense>
    );
  }

  const openCards = (cat: WebCategory) => {
    if (!cat.enabled) return;
    setOpenCat(cat.id);
    setView({ kind: 'cards', cat });
    setEditing(false);
    setSearch('');
  };

  const openLesson = (cat: WebCategory, topic: WebTopic) => {
    setOpenCat(cat.id);
    setView({ kind: 'lesson', cat, topic });
    setMode('guided');
    setEditing(false);
    setSearch('');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const startEditor = (topic: WebTopic, source?: string) => {
    const html = source ?? starterFor(topic);
    setCode(html);
    setPreviewSrc(pageFor(html));
    setEditing(true);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    if (next === 'diy' && view.kind === 'lesson') startEditor(view.topic);
    if (next === 'guided') setEditing(false);
  };

  const currentIndex =
    view.kind === 'lesson' ? flatTopics.findIndex((f) => f.topic.id === view.topic.id) : -1;
  const goto = (delta: number) => {
    const target = flatTopics[currentIndex + delta];
    if (target) openLesson(target.cat, target.topic);
  };
  const prev = flatTopics[currentIndex - 1];
  const next = flatTopics[currentIndex + 1];

  const TopicCard: React.FC<{ cat: WebCategory; topic: WebTopic }> = ({ cat, topic }) => (
    <button
      onClick={() => openLesson(cat, topic)}
      className={`flex min-h-[110px] flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition-all hover:-translate-y-0.5 hover:border-blue-400/60 ${t.panel}`}
    >
      <span className="text-base font-bold leading-snug"><TitleParts title={topic.title} dark={dark} /></span>
    </button>
  );

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden ${t.page}`}>
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] shrink-0 flex-col border-r lg:static ${t.side}`}>
            <div className="flex items-center justify-between p-3">
              <button
                onClick={onBack}
                aria-label="Back"
                className={`grid h-9 w-9 place-items-center rounded-full border ${t.chip}`}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Hide sidebar"
                className={`grid h-9 w-9 place-items-center rounded-full border ${t.chip}`}
              >
                <PanelLeft size={16} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
              {WEB_CATEGORIES.map((cat) => {
                const isOpen = openCat === cat.id && cat.enabled;
                return (
                  <div key={cat.id}>
                    <button
                      disabled={!cat.enabled}
                      onClick={() => openCards(cat)}
                      title={cat.enabled ? undefined : 'Coming soon'}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold transition ${
                        cat.enabled ? (isOpen ? t.active : t.hover) : 'cursor-not-allowed opacity-40 grayscale'
                      }`}
                    >
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="flex-1">{cat.title}</span>
                      {!cat.enabled && <span className="text-[9px] font-bold uppercase tracking-wide">Soon</span>}
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="ml-5 min-h-0 space-y-0.5 overflow-hidden pt-1 border-l border-white/10 pl-3">
                        {cat.topics.map((topic) => {
                          const active = view.kind === 'lesson' && view.topic.id === topic.id;
                          return (
                            <button
                              key={topic.id}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={() => openLesson(cat, topic)}
                              className={`flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[13px] ${active ? t.active : `${t.hover} ${dark ? 'text-white' : 'text-slate-900'}`}`}
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                              <span className="truncate">{topic.title.split(": ")[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className={`border-t p-3 text-[13px] ${t.side}`}>
              <button onClick={() => setShowIde(true)} className={`flex w-full items-center gap-2 rounded-md px-2 py-2 ${t.hover}`}>
                <Code2 size={14} /> Open full Web Dev IDE
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex shrink-0 items-center gap-3 border-b px-3 py-2.5 ${t.side}`}>
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} aria-label="Show sidebar" className={`grid h-9 w-9 place-items-center rounded-full border ${t.chip}`}>
              <PanelLeft size={16} />
            </button>
          )}
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-lg font-black">HTML</span>
            <span className={`hidden truncate text-xs sm:block ${t.soft}`}>Basic elements practice</span>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.soft}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search elements, e.g. button"
              className={`w-full rounded-full border py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 ${t.input}`}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {view.kind === 'lesson' && (
              <div className="flex gap-1.5">
                {(['guided', 'diy'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold sm:px-4 ${
                      mode === m ? 'border-blue-500 ring-2 ring-blue-500/40' : ''
                    } ${t.chip}`}
                  >
                    {m === 'guided' ? 'Guided coding' : 'Do it yourself'}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className={`grid h-9 w-9 place-items-center rounded-full border ${t.chip}`}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          {query ? (
            <div className="p-4 sm:p-6">
              <h1 className="mb-4 text-2xl font-bold">Results for “{search}”</h1>
              {searchHits.length === 0 ? (
                <p className={t.soft}>No elements match that search.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {searchHits.map(({ cat, topic }) => (
                    <TopicCard key={topic.id} cat={cat} topic={topic} />
                  ))}
                </div>
              )}
            </div>
          ) : view.kind === 'cards' ? (
            <div className="p-4 sm:p-6">
              <p className={`mb-3 text-xs ${t.soft}`}>HTML / {view.cat.title}</p>
              <h1 className="mb-4 text-2xl font-bold">{view.cat.title}</h1>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {view.cat.topics.map((topic) => (
                  <TopicCard key={topic.id} cat={view.cat} topic={topic} />
                ))}
              </div>
            </div>
          ) : editing ? (
            <div className="flex h-full flex-col gap-3 p-3 lg:flex-row">
              <div className="flex min-h-[320px] min-w-0 flex-1 flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setMode('guided');
                    }}
                    aria-label="Back to lesson"
                    className={`grid h-8 w-8 place-items-center rounded-full border ${t.chip}`}
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">
                    {mode === 'diy' ? `Your turn: ${view.topic.task}` : 'Change the code and run it'}
                  </span>
                  <button
                    onClick={() => setPreviewSrc(pageFor(code))}
                    className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
                  >
                    <Play size={12} /> Run code
                  </button>
                </div>
                <div className={`min-h-0 flex-1 overflow-hidden rounded-xl border ${t.code}`}>
                  <Editor
                    height="100%"
                    language="html"
                    theme={dark ? 'vs-dark' : 'vs'}
                    value={code}
                    onChange={(v) => setCode(v ?? '')}
                    options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', automaticLayout: true, scrollBeyondLastLine: false }}
                  />
                </div>
              </div>
              <div className="flex min-h-[300px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-sky-400 to-blue-600 p-1">
                <div className="px-3 py-2 text-xs font-bold text-white">Live preview</div>
                <iframe title="Preview" sandbox="allow-scripts allow-forms" srcDoc={previewSrc} className="min-h-0 w-full flex-1 rounded-lg bg-white" />
              </div>
            </div>
          ) : (
            <div className="w-full p-4 pb-28 sm:p-6 sm:pb-28">
              <p className={`mb-4 text-xs ${t.soft}`}>HTML / {view.cat.title}</p>
              {view.topic.examples.map((ex, idx) => {
                const full = /<html[\s>]/i.test(ex.code) ? ex.code : wrapInPage(ex.code);
                const lines = full.split('\n');
                const whole = full === ex.code;
                const start = 8;
                const end = start + ex.code.split('\n').length;
                return (
                  <section
                    key={ex.title}
                    className={`grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8 ${
                      idx === 0 ? '' : `border-t ${dark ? 'border-white/10' : 'border-slate-200'}`
                    }`}
                  >
                    <div className="min-w-0">
                      {idx === 0 ? (
                        <>
                          <h1 className="text-3xl font-black uppercase tracking-tight">
                            <TitleParts title={view.topic.title} dark={dark} tagClass="mt-1 text-lg normal-case" />
                          </h1>
                          <p className="mt-3 text-base leading-relaxed">{view.topic.definition}</p>
                          {view.topic.image && (
                            <img
                              src={view.topic.image}
                              alt={`Exam question: ${view.topic.title}`}
                              loading="lazy"
                              className="mt-4 w-full max-w-xl rounded-xl border border-slate-300 bg-white"
                            />
                          )}
                        </>
                      ) : (
                        <h2 className="text-lg font-black uppercase">{ex.title}</h2>
                      )}
                      <div className={`mt-5 overflow-hidden rounded-2xl border shadow-xl ${dark ? 'border-white/10 shadow-black/40' : 'border-slate-200 shadow-slate-300/50'} ${t.code}`}>
                        <div className={`flex items-center gap-1.5 border-b px-4 py-2.5 ${dark ? 'border-white/10 bg-[#252526]' : 'border-slate-200 bg-slate-100'}`}>
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          <span className={`ml-3 font-mono text-xs ${t.soft}`}>index.html</span>
                        </div>
                        <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-6" style={{ color: dark ? '#d4d4d4' : '#000' }}>
                          <code className="block min-w-max">
                            {lines.map((line, n) => {
                              const active = whole || (n >= start && n < end);
                              return (
                                <div
                                  key={n}
                                  className={`whitespace-pre border-l-2 px-4 transition-opacity ${
                                    active ? (whole ? 'border-transparent' : 'border-blue-500 bg-blue-500/10') : 'border-transparent opacity-30'
                                  }`}
                                >
                                  {line ? <Highlight code={line} dark={dark} /> : ' '}
                                </div>
                              );
                            })}
                          </code>
                        </pre>
                      </div>
                    </div>
                    <div className="relative hidden w-16 justify-center lg:flex" aria-hidden="true">
                      <div className={`w-px ${dark ? 'bg-white/15' : 'bg-slate-300'}`} />
                      <span className={`absolute top-1/2 flex h-16 w-16 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full border-2 text-[10px] font-black uppercase tracking-wide ${dark ? 'border-white/20 bg-[#0a0a0f] text-sky-400' : 'border-slate-300 bg-white text-blue-700'}`}>
                        Output
                        <ArrowRight size={14} strokeWidth={3} />
                      </span>
                    </div>
                    <div className="min-w-0 lg:pt-2">
                      <div className={`overflow-hidden rounded-xl border shadow-xl ${dark ? 'border-white/15 shadow-black/40' : 'border-slate-300 shadow-slate-300/50'}`}>
                        <div className={`flex items-center gap-2 px-3 py-2 ${dark ? 'bg-[#2b2b33]' : 'bg-slate-200'}`}>
                          <span className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                          </span>
                          <span className={`ml-2 hidden rounded-t-md px-3 py-1 text-[11px] font-semibold sm:block ${dark ? 'bg-[#3a3a45] text-slate-100' : 'bg-white text-slate-700'}`}>My page</span>
                        </div>
                        <div className={`flex items-center gap-2 border-b px-3 py-1.5 ${dark ? 'border-white/10 bg-[#3a3a45]' : 'border-slate-300 bg-white'}`}>
                          <span className={`text-sm ${t.soft}`}>‹ › ⟳</span>
                          <span className={`flex-1 truncate rounded-full px-3 py-1 font-mono text-[11px] ${dark ? 'bg-[#1e1e24] text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            🔒 localhost/index.html
                          </span>
                        </div>
                        <AutoFrame title={`Result: ${ex.title}`} html={pageFor(ex.code)} />
                      </div>
                    </div>
                  </section>
                );
              })}

              <div className={`flex flex-wrap gap-3 border-t pt-6 ${dark ? "border-white/10" : "border-slate-200"}`}>
                <button
                  onClick={() => {
                    setMode('guided');
                    startEditor(view.topic, wrapInPage(view.topic.examples[0].code));
                  }}
                  className="rounded-full bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                >
                  Try the code
                </button>
                <button
                  onClick={() => switchMode('diy')}
                  className="flex items-center gap-1.5 rounded-full bg-fuchsia-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-fuchsia-600/30 hover:bg-fuchsia-500"
                >
                  <Pencil size={12} /> Do it yourself
                </button>
              </div>
            </div>
          )}
        </main>

        {view.kind === 'lesson' && !editing && !query && (
          <footer className={`flex shrink-0 items-center justify-between border-t px-4 py-3 ${t.side}`}>
            <button
              disabled={!prev}
              onClick={() => goto(-1)}
              className={`rounded-xl border px-4 py-2 text-left text-sm font-bold disabled:opacity-40 ${t.chip}`}
            >
              ‹ Previous
              <span className={`block text-[10px] font-normal ${t.soft}`}>{prev ? prev.topic.title : 'Nothing further'}</span>
            </button>
            <button
              disabled={!next}
              onClick={() => goto(1)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-40"
            >
              Next topic ›
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default WebDevLearnLab;
