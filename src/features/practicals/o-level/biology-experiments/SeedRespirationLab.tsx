import { Object3D } from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useState, type ReactNode } from "react";

/** Room, fixtures and controls owned exclusively by SeedRespiration. */
export const BENCH_TOP_Y = 1.36;
export const ACCENT = {
    base: "#f97316",
    text: "#fed7aa",
    soft: "rgba(249,115,22,0.16)",
    ring: "rgba(251,146,60,0.4)",
    glow: "rgba(249,115,22,0.35)",
    bannerFrom: "#9a3412",
    bannerTo: "#431407",
  } as const;
export interface GameMission { short: string; title: string; detail: string; symbol: string }
export function LabLighting() {
 const benchTarget=useMemo(()=>{const target=new Object3D();target.position.set(0,BENCH_TOP_Y,0);return target;},[]);
 return <><primitive object={benchTarget}/><ambientLight intensity={0.3}/><hemisphereLight args={["#c1cfdd","#26303a",0.5]}/>
  <spotLight position={[0,BENCH_TOP_Y+5,0.8]} target={benchTarget} angle={0.72} penumbra={0.85} intensity={125} distance={13} decay={2} color="#fff5e6" castShadow shadow-mapSize={[2048,2048]} shadow-normalBias={0.018}/>
  <directionalLight position={[-4,6,-3]} intensity={0.7} color="#c5dfff"/></>;
}
export function LabRoom({ children }: { children: ReactNode }) {
 return <group name="SeedRespiration dedicated laboratory">
  <LabReflections />
  <color attach="background" args={["#514e49"]} />
  <mesh position={[0, -0.08, 0]} receiveShadow><boxGeometry args={[30, 0.16, 32]} /><meshStandardMaterial color="#303941" roughness={0.88} /></mesh>
  {Array.from({length: 16}, (_, i) => <mesh key={`tile-x-${i}`} position={[-15.0+i*2, 0.002, 0]}><boxGeometry args={[0.012,0.003,32]} /><meshStandardMaterial color="#46525c" roughness={1} /></mesh>)}
  {Array.from({length: 17}, (_, i) => <mesh key={`tile-z-${i}`} position={[0, 0.003, -16.0+i*2]}><boxGeometry args={[30,0.003,0.012]} /><meshStandardMaterial color="#46525c" roughness={1} /></mesh>)}
  {[[0,9.0,-16.0,30,18,0.18],[0,9.0,16.0,30,18,0.18],[-15.0,9.0,0,0.18,18,32],[15.0,9.0,0,0.18,18,32]].map((a,i) => <mesh key={i} position={[a[0],a[1],a[2]]} receiveShadow><boxGeometry args={[a[3],a[4],a[5]]} /><meshStandardMaterial color="#514e49" roughness={0.92} /></mesh>)}
  <mesh position={[0,18,0]}><boxGeometry args={[30,0.16,32]} /><meshStandardMaterial color="#303b45" roughness={1} /></mesh>
  <group position={[-14.88,3.6,-2]} rotation={[0,Math.PI/2,0]}>
   <mesh><boxGeometry args={[5.2,2.8,0.08]} /><meshStandardMaterial color="#dde2dc" metalness={0.35} roughness={0.45} /></mesh>
   <mesh position={[0,0,0.05]}><planeGeometry args={[4.98,2.56]} /><meshStandardMaterial color="#aec9d3" emissive="#9fbac5" emissiveIntensity={0.25} roughness={0.18} /></mesh>
   {[-1.65,0,1.65].map(x => <mesh key={x} position={[x,0,0.07]}><boxGeometry args={[0.045,2.6,0.04]} /><meshStandardMaterial color="#e5e8e0" metalness={0.3} /></mesh>)}
  </group>
  <mesh position={[0,BENCH_TOP_Y-0.055,0]} castShadow receiveShadow><boxGeometry args={[7.4,0.11,3.8]} /><meshStandardMaterial color="#45535a" roughness={0.4} metalness={0.08} /></mesh>
  <mesh position={[0,BENCH_TOP_Y-0.15,0]}><boxGeometry args={[7.25,0.1,3.65]} /><meshStandardMaterial color="#364746" roughness={0.62} /></mesh>
  {[-1,1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}:${z}`} position={[x*3.3000000000000003,0.6,z*1.5999999999999999]} castShadow><boxGeometry args={[0.1,1.2,0.1]} /><meshStandardMaterial color="#526260" metalness={0.7} roughness={0.38} /></mesh>))}
  <group position={[13.8,1.1,-15.0]}><mesh castShadow><boxGeometry args={[1.5,2.2,1.1]} /><meshStandardMaterial color="#6d8179" roughness={0.72} /></mesh>{[-0.38,0.38].map(x=><mesh key={x} position={[x,0,0.56]}><boxGeometry args={[0.7,2.02,0.025]} /><meshStandardMaterial color="#87998e" roughness={0.65} /></mesh>)}</group>
  <mesh position={[0,BENCH_TOP_Y+4.95,0.4]}><boxGeometry args={[2.6,0.08,0.8]}/><meshStandardMaterial color="#f4eee0" emissive="#fff0ce" emissiveIntensity={1.4}/></mesh>
  {[-7.5,0,7.5].map(x=><mesh key={`wall-panel-${x}`} position={[x,9.0,-15.86]}><boxGeometry args={[0.07,16.9,0.025]}/><meshStandardMaterial color="#62727e" roughness={0.78}/></mesh>)}
  <mesh position={[0,1.05,-15.85]}><boxGeometry args={[30.0,0.065,0.03]}/><meshStandardMaterial color="#82949e" metalness={0.35} roughness={0.5}/></mesh>
  {[-1,1].map(x=><mesh key={`lamp-suspension-${x}`} position={[x,(18.0+(BENCH_TOP_Y+4.95))/2,0.4]}><cylinderGeometry args={[0.008,0.008,18.0-(BENCH_TOP_Y+4.95),8]}/><meshStandardMaterial color="#76858e" metalness={0.7} roughness={0.4}/></mesh>)}
  {children}
 </group>;
}
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
  {props.onBack && <button type="button" onClick={props.onBack} aria-label="Back">←</button>}<span className="min-w-0 flex-1 truncate">{props.contextLabel ?? "Seed Respiration"}</span>
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
  <style>{`.seedrespiration-sidebar .guide-settings :is(p,span,label,h2,h3,h4,button,input,select,div,strong,td,th) { color:#334155 !important; }
 .seedrespiration-sidebar .guide-settings [class*="bg-slate-9"],.seedrespiration-sidebar .guide-settings [class*="bg-black/"],.seedrespiration-sidebar .guide-settings [class*="bg-white/"] { background:#f5f8fa !important; }
 .seedrespiration-sidebar .guide-settings [class*="border-white"] { border-color:#d9e3e8 !important; }
 .seedrespiration-sidebar .guide-settings svg text { fill:#526670 !important; }
 .seedrespiration-sidebar .guide-settings input,.seedrespiration-sidebar .guide-settings select { border-color:#d9e3e8; }
 .seedrespiration-sidebar .guide-settings button { min-height:40px; }
 .seedrespiration-sidebar .guide-settings .grid-cols-3,.seedrespiration-sidebar .guide-settings .grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)); }
 .seedrespiration-sidebar .guide-settings table { font-size:11px; }
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

/** Broad ceiling panels and a window provide soft reflections on glass and metal. */
function LabReflections() {
 return <Environment frames={1} resolution={128}>
  <Lightformer form="rect" intensity={2.5} color="#fffaf1" position={[0,7,0]} rotation={[Math.PI/2,0,0]} scale={[12,9,1]} />
  <Lightformer form="rect" intensity={1.5} color="#edf7ff" position={[-8,3,0]} rotation={[0,Math.PI/2,0]} scale={[5,3,1]} />
  <Lightformer form="rect" intensity={0.3} color="#f0f2ec" position={[0,3,-8]} scale={[12,4,1]} />
 </Environment>;
}
