import {createContext,useCallback,useContext,useEffect,useId,useMemo,useState,isValidElement,Children,type ReactNode,type ComponentProps} from "react";
import {createPortal} from "react-dom";
import {Html} from "@react-three/drei";
/** Labels owned by Potometer; descriptive text stays outside the apparatus view. */
interface Entry {id:string;text:string}
const LabelContext=createContext<{entries:Entry[];markers:boolean;register:(id:string,text:string)=>void;remove:(id:string)=>void}|null>(null);
function labelText(node:ReactNode):string {return Children.toArray(node).map(child=>typeof child === "string" || typeof child === "number" ? String(child) : isValidElement<{children?:ReactNode}>(child) ? labelText(child.props.children) : "").filter(Boolean).join(" ");}
export function LabLabel({children,...props}:ComponentProps<typeof Html>) {
 const registry=useContext(LabelContext),id=useId(),text=labelText(children).replace(/\s+/g," ").trim();
 const register=registry?.register,remove=registry?.remove;
 useEffect(()=>{if(text)register?.(id,text);},[id,text,register]);
 useEffect(()=>()=>remove?.(id),[id,remove]);
 if(!registry?.markers || !text)return null;
 const index=registry.entries.findIndex(entry=>entry.id===id)+1;
 return <Html {...props} center style={{pointerEvents:"none"}}><span style={{display:"grid",placeItems:"center",width:18,height:18,borderRadius:9,background:"#f8fafc",border:"1px solid #0891b2",color:"#0e5266",fontSize:10,fontWeight:700,boxShadow:"0 1px 3px #0004"}}>{index}</span></Html>;
}
function LabelList({entries,onMarkers}:{entries:Entry[];onMarkers:(show:boolean)=>void}) {
 const [host,setHost]=useState<HTMLElement|null>(null);
 useEffect(()=>{
  let container:HTMLDivElement|null=null;
  const locate=()=>{const sidebar=[...document.querySelectorAll<HTMLElement>('aside[aria-label*="guide" i],section[aria-label*="guide" i],[role="complementary"][aria-label*="guide" i],.separation-controls')].find(element=>{const r=element.getBoundingClientRect();return r.width>=250&&r.height>200&&r.left>window.innerWidth*.5;});
   if(!sidebar)return;
   if(container&&sidebar.contains(container))return;
   container?.remove();container=document.createElement("div");container.setAttribute("data-apparatus-labels","Potometer");
   const body=sidebar.querySelector<HTMLElement>('section[aria-live], [class*="guide__step"],.separation-controls__body,.food-guide__step') ?? sidebar;
   if(body===sidebar){const header=sidebar.querySelector("header");header?.after(container);if(!container.isConnected)sidebar.append(container);}else body.append(container);
   setHost(container);
  };locate();const observer=new MutationObserver(locate);observer.observe(document.body,{childList:true,subtree:true});return()=>{observer.disconnect();container?.remove();};
 },[]);
 if(!entries.length)return null;
 const list=<details onToggle={event=>onMarkers(event.currentTarget.open)} style={{margin:"16px 0",padding:12,border:"1px solid #dce5eb",borderRadius:10,background:"#f7fafc",color:"#334155",fontSize:12}}><summary style={{cursor:"pointer",fontWeight:600}}>Apparatus labels ({entries.length})</summary><p style={{margin:"10px 0",color:"#64748b"}}>Numbers appear in the scene while this list is open.</p><ol style={{maxHeight:180,overflowY:"auto",listStyle:"none",padding:0,margin:0}}>{entries.map((entry,index)=><li key={entry.id} style={{display:"flex",gap:8,padding:"5px 0",lineHeight:1.6}}><strong style={{color:"#0e7490",minWidth:18}}>{index+1}</strong><span>{entry.text}</span></li>)}</ol></details>;
 if(host)return createPortal(list,host);
 return <div style={{position:"absolute",top:60,left:10,zIndex:95,maxWidth:280}}>{list}</div>;
}
export function ExperimentLabelProvider({children}:{children:ReactNode}) {
 const [entries,setEntries]=useState<Entry[]>([]),[markers,setMarkers]=useState(false);
 const register=useCallback((id:string,text:string)=>setEntries(current=>{const old=current.find(entry=>entry.id===id);return old?.text===text?current:old?current.map(entry=>entry.id===id?{id,text}:entry):[...current,{id,text}];}),[]);
 const remove=useCallback((id:string)=>setEntries(current=>current.some(entry=>entry.id===id)?current.filter(entry=>entry.id!==id):current),[]);
 const value=useMemo(()=>({entries,markers,register,remove}),[entries,markers,register,remove]);
 return <LabelContext.Provider value={value}>{children}<LabelList entries={entries} onMarkers={setMarkers}/></LabelContext.Provider>;
}
