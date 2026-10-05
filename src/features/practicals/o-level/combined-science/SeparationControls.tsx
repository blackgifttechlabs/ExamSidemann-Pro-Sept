import {useEffect, useState, type ReactNode} from "react";
export interface GameMission { short: string; title: string; detail: string; symbol: string }
interface HudProps { title?: string; subtitle?: string; symbol?: ReactNode; accent?: unknown; mode?: string; onModeChange?: (mode: "learning" | "doing") => void; modeDisabled?: boolean; disabled?: boolean; onBack?: () => void; backLabel?: string; onRequestPaper?: () => void; onRequestHowTo?: () => void; badges?: number; demoActive?: boolean; onDemo?: () => void; contextLabel?: string }
export function CombinedScienceHud({title, onBack, onRequestPaper, onRequestHowTo, demoActive, onDemo}: HudProps) {
 const mobile = useMobileExperimentViewport();
 if (mobile) return null;
 return <header className="absolute inset-x-0 top-0 z-[70] flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 text-slate-900">
  {onBack && <button type="button" onClick={onBack} aria-label="Back">←</button>}<strong className="min-w-0 flex-1 truncate text-sm">{title}</strong>
  {onRequestHowTo && <button type="button" onClick={onRequestHowTo}>Guide</button>}{onRequestPaper && <button type="button" onClick={onRequestPaper}>Paper</button>}
  <button type="button" onClick={onDemo} aria-pressed={!!demoActive} className={`rounded-full px-4 py-2 text-xs font-bold ${demoActive ? "bg-violet-700 text-white" : "bg-slate-100"}`}>{demoActive ? "Stop See" : "See"}</button>
  <button type="button" onClick={() => { if (demoActive) onDemo?.(); }} aria-pressed={!demoActive} className={`rounded-full px-4 py-2 text-xs font-bold ${!demoActive ? "bg-sky-700 text-white" : "bg-slate-100"}`}>Learn</button>
 </header>;
}
export function MobileExperimentTopBar(props: HudProps) {
 const mobile = useMobileExperimentViewport();
 if (!mobile) return null;
 return <header className="absolute inset-x-0 top-0 z-[70] flex h-14 items-center gap-2 bg-white/95 px-2 text-xs text-slate-900">
  {props.onBack && <button type="button" onClick={props.onBack} aria-label="Back">←</button>}<span className="min-w-0 flex-1 truncate">{props.contextLabel ?? "Separation"}</span>
  {props.onRequestHowTo && <button type="button" onClick={props.onRequestHowTo}>Guide</button>}{props.onRequestPaper && <button type="button" onClick={props.onRequestPaper}>Paper</button>}
  <button type="button" onClick={props.onDemo} aria-pressed={!!props.demoActive} className="rounded-full bg-violet-100 px-3 py-2">{props.demoActive ? "Stop" : "See"}</button>
  <button type="button" onClick={() => { if (props.demoActive) props.onDemo?.(); }} aria-pressed={!props.demoActive} className="rounded-full bg-sky-100 px-3 py-2">Learn</button>
 </header>;
}
interface RailProps { accent?: unknown; title: string; tagline?: string; missions: GameMission[]; step: number; running: boolean; progress: number; complete: boolean; primaryLabel: string; primaryEmoji?: string; onPrimary: () => void; primaryDisabled?: boolean; onReset: () => void; onDemo: () => void; demoActive: boolean; observation: string; sections?: {id: string; label: string; value?: string; disabled?: boolean; content: ReactNode}[] }
export function CombinedScienceObjectiveRail(props: RailProps) {
 const [panel,setPanel]=useState<string | null>(props.sections?.[0]?.id ?? null);
 const step=Math.min(Math.max(0,props.step),props.missions.length-1);
 const mission=props.missions[step];
 useEffect(()=>{setPanel(props.complete ? props.sections?.at(-1)?.id ?? null : props.step===0 ? props.sections?.[0]?.id ?? null : null);},[props.step,props.complete]);
 return <aside aria-label="Experiment guide" className="practical-control-panel flex h-full min-h-0 w-full flex-col bg-white text-slate-900">
  <style>{`.separation-sidebar .guide-settings :is(p,span,label,h2,h3,h4,button,input,select,div,strong,td,th) { color:#334155 !important; }
 .separation-sidebar .guide-settings [class*="bg-slate-9"],.separation-sidebar .guide-settings [class*="bg-black/"],.separation-sidebar .guide-settings [class*="bg-white/"] { background:#f5f8fa !important; }
 .separation-sidebar .guide-settings [class*="border-white"] { border-color:#d9e3e8 !important; }
 .separation-sidebar .guide-settings svg text { fill:#526670 !important; }
 .separation-sidebar .guide-settings input,.separation-sidebar .guide-settings select { border-color:#d9e3e8; }
 .separation-sidebar .guide-settings button { min-height:40px; }
 .separation-sidebar .guide-settings .grid-cols-3,.separation-sidebar .guide-settings .grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)); }
 .separation-sidebar .guide-settings table { font-size:11px; }
`}</style>
  <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><strong className="text-sm">Experiment guide</strong><button type="button" onClick={props.onReset} className="text-xs text-slate-500">Start again</button></header>
  <div className="px-5 pt-5"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Step {step+1} of {props.missions.length}</span><span>{props.running ? "In progress" : props.complete ? "Complete" : "Your experiment"}</span></div><progress aria-label="Experiment progress" max={100} value={Math.min(100,Math.max(0,props.progress*100))} className="h-1.5 w-full accent-cyan-600" /></div>
  <section className="min-h-0 flex-1 overflow-y-auto px-5 py-6" aria-live="polite">
   <h2 className="mb-3 text-xl font-bold leading-tight">{mission?.title ?? props.title}</h2><p className="text-sm leading-7 text-slate-500">{props.complete ? props.observation : mission?.detail}</p>
   {props.sections?.map(section=>panel===section.id ? <div key={section.id} className="guide-settings mt-6 space-y-4">{section.content}</div> : null)}
   {!!props.sections?.length && <details className="mt-5 text-xs text-slate-500"><summary className="cursor-pointer py-2">{props.complete ? "Results and settings" : "More controls"}</summary><div className="mt-2 grid gap-2">{props.sections.map(section=><button type="button" key={section.id} disabled={section.disabled} onClick={()=>setPanel(panel===section.id?null:section.id)} aria-pressed={panel===section.id} className="rounded-lg border border-slate-200 px-3 py-2 text-left text-slate-700 disabled:opacity-40">{section.label} {section.value}</button>)}</div></details>}
  </section>
  <footer className="grid gap-2 border-t border-slate-200 px-5 py-5"><button type="button" onClick={props.complete ? props.onReset : props.onPrimary} disabled={props.primaryDisabled || props.demoActive} className="min-h-11 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-100 disabled:text-slate-500">{props.complete ? "Start again" : "Next"}</button><p className="text-center text-xs text-slate-500">{props.primaryLabel}</p></footer>
 </aside>;
}


export function HeaderModeToggle({demoActive,onDemo}: {disabled?: boolean; mode?: string; onChange?: (mode: "learning" | "doing") => void; demoActive: boolean; onDemo: () => void}) {
 const mobile = useMobileExperimentViewport();
 if (mobile) return null;
 return <div className="absolute right-4 top-16 z-[75] flex gap-1 rounded-full bg-white/95 p-1 shadow-md">
  <button type="button" aria-pressed={demoActive} onClick={onDemo} className={`rounded-full px-4 py-2 text-xs font-bold ${demoActive ? "bg-violet-700 text-white" : "text-slate-800"}`}>{demoActive ? "Stop See" : "See"}</button>
  <button type="button" aria-pressed={!demoActive} onClick={()=>{if(demoActive) onDemo();}} className={`rounded-full px-4 py-2 text-xs font-bold ${!demoActive ? "bg-sky-700 text-white" : "text-slate-800"}`}>Learn</button>
 </div>;
}

export interface PlayerBounds { minX: number; maxX: number; minZ: number; maxZ: number }

export function useMobileExperimentViewport() {
 const [mobile,setMobile] = useState(false);
 useEffect(() => {
  const query = window.matchMedia("(max-width: 639px), (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse)");
  const update = () => setMobile(query.matches);
  update(); query.addEventListener("change",update);
  return () => query.removeEventListener("change",update);
 },[]);
 return mobile;
}

export const EXPERIMENT_ACCENTS = {

  rose: {
    base: "#f43f5e",
    text: "#fecdd3",
    soft: "rgba(244,63,94,0.16)",
    ring: "rgba(251,113,133,0.4)",
    glow: "rgba(244,63,94,0.35)",
    bannerFrom: "#9f1239",
    bannerTo: "#4c0519",
  },
  fuchsia: {
    base: "#d946ef",
    text: "#f5d0fe",
    soft: "rgba(217,70,239,0.16)",
    ring: "rgba(232,121,249,0.4)",
    glow: "rgba(217,70,239,0.35)",
    bannerFrom: "#86198f",
    bannerTo: "#3b0764",
  },
  amber: {
    base: "#f59e0b",
    text: "#fde68a",
    soft: "rgba(245,158,11,0.16)",
    ring: "rgba(251,191,36,0.4)",
    glow: "rgba(245,158,11,0.35)",
    bannerFrom: "#92400e",
    bannerTo: "#451a03",
  },
  sky: {
    base: "#0ea5e9",
    text: "#bae6fd",
    soft: "rgba(14,165,233,0.16)",
    ring: "rgba(56,189,248,0.4)",
    glow: "rgba(14,165,233,0.35)",
    bannerFrom: "#075985",
    bannerTo: "#082f49",
  },
  emerald: {
    base: "#10b981",
    text: "#a7f3d0",
    soft: "rgba(16,185,129,0.16)",
    ring: "rgba(52,211,153,0.4)",
    glow: "rgba(16,185,129,0.35)",
    bannerFrom: "#065f46",
    bannerTo: "#022c22",
  },
  violet: {
    base: "#8b5cf6",
    text: "#ddd6fe",
    soft: "rgba(139,92,246,0.16)",
    ring: "rgba(167,139,250,0.4)",
    glow: "rgba(139,92,246,0.35)",
    bannerFrom: "#5b21b6",
    bannerTo: "#2e1065",
  },
  cyan: {
    base: "#06b6d4",
    text: "#a5f3fc",
    soft: "rgba(6,182,212,0.16)",
    ring: "rgba(34,211,238,0.4)",
    glow: "rgba(6,182,212,0.35)",
    bannerFrom: "#155e75",
    bannerTo: "#083344",
  },
  orange: {
    base: "#f97316",
    text: "#fed7aa",
    soft: "rgba(249,115,22,0.16)",
    ring: "rgba(251,146,60,0.4)",
    glow: "rgba(249,115,22,0.35)",
    bannerFrom: "#9a3412",
    bannerTo: "#431407",
  },
  indigo: {
    base: "#6366f1",
    text: "#c7d2fe",
    soft: "rgba(99,102,241,0.16)",
    ring: "rgba(129,140,248,0.4)",
    glow: "rgba(99,102,241,0.35)",
    bannerFrom: "#3730a3",
    bannerTo: "#1e1b4b",
  },
  lime: {
    base: "#84cc16",
    text: "#d9f99d",
    soft: "rgba(132,204,22,0.16)",
    ring: "rgba(163,230,53,0.4)",
    glow: "rgba(132,204,22,0.35)",
    bannerFrom: "#3f6212",
    bannerTo: "#1a2e05",
  },
  teal: {
    base: "#14b8a6",
    text: "#99f6e4",
    soft: "rgba(20,184,166,0.16)",
    ring: "rgba(45,212,191,0.4)",
    glow: "rgba(20,184,166,0.35)",
    bannerFrom: "#115e59",
    bannerTo: "#042f2e",
  },
  red: {
    base: "#ef4444",
    text: "#fecaca",
    soft: "rgba(239,68,68,0.16)",
    ring: "rgba(248,113,113,0.4)",
    glow: "rgba(239,68,68,0.35)",
    bannerFrom: "#991b1b",
    bannerTo: "#450a0a",
  },
};
