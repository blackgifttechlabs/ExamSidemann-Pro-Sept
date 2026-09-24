import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LabRoom, LabLighting } from '../../src/features/practicals/common/LabEnvironment';
import { BlenderLabEnvironment, BlenderLabBench } from '../../src/features/practicals/common/BlenderLabEnvironment';
import { BlenderLabProp, BlenderBurner, BlenderSteam } from '../../src/features/practicals/common/BlenderLabApparatus';
const apparatus=new URLSearchParams(location.search).has('apparatus');
const legacy=new URLSearchParams(location.search).has('legacy');
function Probe(){const {scene,gl}=useThree();React.useEffect(()=>{(window as any).labProbe=()=>{
 const room=scene.getObjectByName('Blender science laboratory');const bench=scene.getObjectByName('Blender experiment workbench');scene.updateMatrixWorld(true);
 const bounds=bench ? new THREE.Box3().setFromObject(bench) : null;
 return {room:!!room,bench:!!bench,benchMin:bounds?.min.toArray(),benchMax:bounds?.max.toArray(),calls:gl.info.render.calls,triangles:gl.info.render.triangles};
};},[scene,gl]);return null;}
createRoot(document.getElementById('root')!).render(<Canvas frameloop={apparatus?"always":"demand"} shadows dpr={1} camera={{position:apparatus?[2.7,2.7,4]:legacy?[7,3,10]:[7,4.5,8],fov:58}}>
 <LabLighting />
 {legacy?<><BlenderLabEnvironment width={22} depth={18} height={12} floorY={-4} centerZ={4.35} worktopY={-1.94}/><BlenderLabBench position={[0,-4,0]} size={[8.8,3.45]} height={2.06}/></>:<LabRoom posterA={{title:'O LEVEL SCIENCE',lines:['Observe','Measure','Record']}} posterB={{title:'EXPERIMENTS',lines:['Biology','Chemistry','Physics']}}/>}
 {apparatus && <group position={[0,1.36,0]}><BlenderLabProp asset="beaker-250ml" scale={7} /><BlenderLabProp asset="water-volume" scale={[.25,.36,.25]} /><BlenderLabProp asset="water-surface" position={[0,.36,0]} scale={[.25,1,.25]} /><group position={[1,0,0]}><BlenderBurner lit heat={.6}/></group><BlenderSteam active heat={.7} position={[0,.7,0]}/></group>}
 <OrbitControls target={[0,legacy?-1:1.36,0]} /><Probe />
</Canvas>);
