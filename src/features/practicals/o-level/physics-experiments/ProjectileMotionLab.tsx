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
  {props.onBack && <button type="button" onClick={props.onBack} aria-label="Back">←</button>}<span className="min-w-0 flex-1 truncate">{props.contextLabel ?? "Projectile Motion"}</span>
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
  <style>{`.projectilemotion-sidebar .guide-settings :is(p,span,label,h2,h3,h4,button,input,select,div,strong,td,th) { color:#334155 !important; }
 .projectilemotion-sidebar .guide-settings [class*="bg-slate-9"],.projectilemotion-sidebar .guide-settings [class*="bg-black/"],.projectilemotion-sidebar .guide-settings [class*="bg-white/"] { background:#f5f8fa !important; }
 .projectilemotion-sidebar .guide-settings [class*="border-white"] { border-color:#d9e3e8 !important; }
 .projectilemotion-sidebar .guide-settings svg text { fill:#526670 !important; }
 .projectilemotion-sidebar .guide-settings input,.projectilemotion-sidebar .guide-settings select { border-color:#d9e3e8; }
 .projectilemotion-sidebar .guide-settings button { min-height:40px; }
 .projectilemotion-sidebar .guide-settings .grid-cols-3,.projectilemotion-sidebar .guide-settings .grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)); }
 .projectilemotion-sidebar .guide-settings table { font-size:11px; }
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


export function HeaderModeToggle({demoActive,onDemo}: {mode?: string; onChange?: (mode: "learning" | "doing") => void; demoActive: boolean; onDemo: () => void}) {
 const mobile = useMobileExperimentViewport();
 if (mobile) return null;
 return <div className="absolute right-4 top-3 z-[75] flex gap-1 rounded-full bg-white/95 p-1 shadow-md">
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

interface GuideStep { title: string; instruction: string; content: ReactNode; nextDisabled?: boolean; nextLabel?: string; onNext?: () => void }
export function ExperimentSidebar({steps,onReset,demoActive=false,step,top=0}: {steps: GuideStep[]; onReset: () => void; demoActive?: boolean; step?: number; top?: number}) {
 const mobile=useMobileExperimentViewport();
 const [index,setIndex]=useState(0);
 const active=Math.min(step ?? index,steps.length-1),current=steps[active];
 if(mobile) return null;
 return <aside aria-label="Experiment guide" className="projectilemotion-sidebar absolute bottom-0 right-0 z-40 flex w-[320px] flex-col border-l border-slate-200 bg-white text-slate-900" style={{top}}>
  <style>{`.projectilemotion-sidebar .guide-settings :is(p,span,label,h2,h3,h4,button,input,select,div,strong,td,th) { color:#334155 !important; }
 .projectilemotion-sidebar .guide-settings [class*="bg-slate-9"],.projectilemotion-sidebar .guide-settings [class*="bg-black/"],.projectilemotion-sidebar .guide-settings [class*="bg-white/"] { background:#f5f8fa !important; }
 .projectilemotion-sidebar .guide-settings [class*="border-white"] { border-color:#d9e3e8 !important; }
 .projectilemotion-sidebar .guide-settings svg text { fill:#526670 !important; }
 .projectilemotion-sidebar .guide-settings input,.projectilemotion-sidebar .guide-settings select { border-color:#d9e3e8; }
 .projectilemotion-sidebar .guide-settings button { min-height:40px; }
 .projectilemotion-sidebar .guide-settings .grid-cols-3,.projectilemotion-sidebar .guide-settings .grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)); }
 .projectilemotion-sidebar .guide-settings table { font-size:11px; }
`}</style>
  <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><strong className="text-sm">Experiment guide</strong><button type="button" className="text-xs text-slate-500" onClick={()=>{onReset();setIndex(0);}}>Start again</button></header>
  <div className="px-5 pt-5"><p className="mb-2 text-xs text-slate-500">Step {active+1} of {steps.length}</p><progress aria-label="Experiment progress" max={steps.length} value={active+1} className="h-1.5 w-full accent-cyan-600" /></div>
  <section className="min-h-0 flex-1 overflow-y-auto px-5 py-6" aria-live="polite"><h2 className="mb-3 text-xl font-bold leading-tight">{current.title}</h2><p className="mb-6 text-sm leading-7 text-slate-500">{current.instruction}</p><fieldset disabled={demoActive} className="guide-settings min-w-0 space-y-4">{current.content}</fieldset></section>
  <footer className="grid gap-2 border-t border-slate-200 px-5 py-5">
   <button type="button" disabled={current.nextDisabled || demoActive} onClick={()=>{if(current.onNext)current.onNext();else if(active<steps.length-1)setIndex(active+1);else{onReset();setIndex(0);}}} className="min-h-11 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-100 disabled:text-slate-500">{current.nextLabel ?? (active===steps.length-1 ? "Start again" : "Next")}</button>
   {active>0 && step===undefined && <button type="button" disabled={demoActive} onClick={()=>setIndex(active-1)} className="min-h-9 text-xs text-slate-500">Previous step</button>}
  </footer>
 </aside>;
}
