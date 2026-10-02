import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const PHOTO_WORKTOP_Y = 1.48;
export const PHOTO_ROOM_BOUNDS = { minX: -10.9, maxX: 10.9, minZ: -6.9, maxZ: 11.9 };
export const PHOTO_TABLE_BOUNDS = { minX: -4.6, maxX: 4.6, minZ: -1.75, maxZ: 1.75 };

export function PhotosynthesisRoom() {
  const { gl, scene } = useThree();
  const wood = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 512;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#bc8954'; context.fillRect(0, 0, 1024, 512);
    // Fine, deterministic grain keeps the oak finish subtle beneath the apparatus.
    for (let row = 0; row < 512; row++) {
      context.strokeStyle = row % 7 === 0 ? 'rgba(91, 53, 25, .16)' : 'rgba(245, 213, 162, .12)';
      context.lineWidth = row % 7 === 0 ? 1.2 : .7;
      context.beginPath();
      for (let x = 0; x <= 1024; x += 8) {
        const y = row + Math.sin(x * .012 + row * .11) * 2 + Math.sin(x * .027 + row * .07);
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }
    [128, 256, 384].forEach(y => {
      context.fillStyle = 'rgba(86, 51, 28, .18)'; context.fillRect(0, y, 1024, 1);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return texture;
  }, [gl]);
  const tiles = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#696b63';
    context.fillRect(0, 0, 512, 512);
    context.fillStyle = '#a29c8a';
    context.fillRect(3, 3, 506, 506);
    // Mineral flecks and restrained veins give the ceramic a stone finish.
    for (let i = 0; i < 9000; i++) {
      const x = (i * 137.31) % 506 + 3, y = (i * 73.79) % 506 + 3;
      context.fillStyle = i % 2 ? 'rgba(52,49,40,.045)' : 'rgba(224,216,190,.06)';
      context.fillRect(x, y, 1.5, 1.5);
    }
    for (let i = 0; i < 12; i++) {
      context.strokeStyle = 'rgba(78,74,61,.035)';
      context.beginPath();
      for (let x = 3; x < 509; x += 6) {
        const y = 30 + i * 38 + Math.sin(x * .015 + i) * 14;
        if (x === 3) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(24, 22);
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return texture;
  }, [gl]);
  useEffect(() => () => tiles.dispose(), [tiles]);
  useEffect(() => () => wood.dispose(), [wood]);
  useEffect(() => {
    const previous = scene.environment, intensity = scene.environmentIntensity;
    const generator = new THREE.PMREMGenerator(gl);
    const studio = new RoomEnvironment();
    const environment = generator.fromScene(studio, .04);
    studio.dispose(); generator.dispose();
    scene.environment = environment.texture; scene.environmentIntensity = .45;
    return () => { scene.environment = previous; scene.environmentIntensity = intensity; environment.dispose(); };
  }, [gl, scene]);
  return <group name="Dedicated clean photosynthesis room">
    <mesh position={[0,-.1,2.5]} receiveShadow><boxGeometry args={[24,.2,22]} /><meshStandardMaterial color="#78796f" roughness={.82} /></mesh>
    <mesh position={[0,.002,2.5]} rotation={[-Math.PI / 2,0,0]} receiveShadow name="Stone ceramic tile floor"><planeGeometry args={[24,22]} /><meshStandardMaterial map={tiles} roughness={.72} /></mesh>
    <mesh position={[0,4.9,-7.7]} receiveShadow name="Plain warm gray wall"><boxGeometry args={[24,9.8,.2]} /><meshStandardMaterial color="#93988b" roughness={.92} /></mesh>
    {[-11.7,11.7].map(x=><mesh key={x} position={[x,4.9,2.5]} receiveShadow><boxGeometry args={[.2,9.8,20.4]} /><meshStandardMaterial color="#96958a" roughness={.92} /></mesh>)}
    <mesh position={[0,4.9,12.7]} receiveShadow><boxGeometry args={[24,9.8,.2]} /><meshStandardMaterial color="#96958a" roughness={.92} /></mesh>
    <mesh position={[0,9.9,2.5]}><boxGeometry args={[24,.2,22]} /><meshStandardMaterial color="#7d8179" roughness={.9} /></mesh>
    <mesh position={[0,.14,-7.56]}><boxGeometry args={[23.5,.28,.045]} /><meshStandardMaterial color="#3b666d" roughness={.75} /></mesh>
    <group name="Suspended ceiling grid and recessed lights">
      {Array.from({length: 13}, (_, i) => -12 + i * 2).map(x =>
        <mesh key={`ceiling-x-${x}`} position={[x,9.775,2.5]}><boxGeometry args={[.035,.045,22]} /><meshStandardMaterial color="#555c57" metalness={.5} roughness={.45} /></mesh>)}
      {Array.from({length: 12}, (_, i) => -8.5 + i * 2).map(z =>
        <mesh key={`ceiling-z-${z}`} position={[0,9.775,z]}><boxGeometry args={[24,.045,.035]} /><meshStandardMaterial color="#555c57" metalness={.5} roughness={.45} /></mesh>)}
      {[-5,5].flatMap(x => [-3.5,4.5,10.5].map(z => <group key={`${x}:${z}`} position={[x,9.72,z]}>
        <mesh castShadow><boxGeometry args={[1.8,.12,.85]} /><meshStandardMaterial color="#444d4a" metalness={.65} roughness={.32} /></mesh>
        <mesh position={[0,-.065,0]}><boxGeometry args={[1.66,.018,.71]} /><meshStandardMaterial color="#e1dcc5" emissive="#fff0cf" emissiveIntensity={1.1} roughness={.45} /></mesh>
        <pointLight position={[0,-.18,0]} color="#fff0d6" intensity={18} distance={15} decay={2} />
      </group>))}
    </group>
    <group name="Plain wall finish and windows">
      <mesh position={[0, 1.55, -7.54]} receiveShadow><boxGeometry args={[23.4, 2.65, .06]} /><meshStandardMaterial color="#727d76" roughness={.85} /></mesh>
      <mesh position={[0, 2.92, -7.48]}><boxGeometry args={[23.4, .07, .08]} /><meshStandardMaterial color="#59615c" roughness={.65} /></mesh>
      {[-8.4, 8.4].map(x => <group key={x} position={[x, 5.4, -7.42]}>
        <mesh><boxGeometry args={[3.5, 3.7, .12]} /><meshStandardMaterial color="#bf925e" roughness={.65} /></mesh>
        <mesh position={[0, 0, .075]}><boxGeometry args={[3.25, 3.45, .04]} /><meshStandardMaterial color="#d2eaf2" emissive="#d2eaf2" emissiveIntensity={.18} roughness={.4} /></mesh>
        <mesh position={[0, 0, .11]}><boxGeometry args={[.07, 3.45, .04]} /><meshStandardMaterial color="#68726b" /></mesh>
        <mesh position={[0, 0, .11]}><boxGeometry args={[3.25, .07, .04]} /><meshStandardMaterial color="#68726b" /></mesh>
      </group>)}
    </group>
    <group name="Natural oak experiment table">
      <mesh position={[0,PHOTO_WORKTOP_Y-.09,0]} castShadow receiveShadow><boxGeometry args={[9.2,.18,3.5]} /><meshStandardMaterial map={wood} color="#ffffff" roughness={.62} metalness={0} /></mesh>
      <mesh position={[0,PHOTO_WORKTOP_Y-.24,0]} castShadow><boxGeometry args={[8.9,.18,3.2]} /><meshStandardMaterial color="#334f5b" metalness={.55} roughness={.35} /></mesh>
      {[-4.1,4.1].flatMap(x=>[-1.25,1.25].map(z=><group key={`${x}:${z}`} position={[x,0,z]}>
        <mesh position={[0,(PHOTO_WORKTOP_Y-.31)/2,0]} castShadow><boxGeometry args={[.12,PHOTO_WORKTOP_Y-.31,.12]} /><meshStandardMaterial color="#334f5b" metalness={.6} roughness={.3} /></mesh>
        <mesh position={[0,.025,0]}><boxGeometry args={[.19,.05,.19]} /><meshStandardMaterial color="#323d39" roughness={.9} /></mesh>
      </group>))}
    </group>
  </group>;
}

export function PhotosynthesisBurner({ active, paused = false }: { active: boolean; paused?: boolean }) {
  const flame = useRef<THREE.Group>(null), age = useRef(0);
  const hose = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(.14,.15,0),new THREE.Vector3(.4,.1,-.3),new THREE.Vector3(.56,.035,-.7),new THREE.Vector3(.72,.035,-1.15),
  ]),[]);
  const legs = useMemo(()=>[0,1,2].map(i=>{
    const angle=i*Math.PI*2/3;
    const bottom=new THREE.Vector3(Math.cos(angle)*.59,.06,Math.sin(angle)*.59);
    const top=new THREE.Vector3(Math.cos(angle)*.44,1.26,Math.sin(angle)*.44);
    return { centre:bottom.clone().add(top).multiplyScalar(.5), length:bottom.distanceTo(top),
      rotation:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),top.clone().sub(bottom).normalize()) };
  }),[]);
  useFrame((_,delta)=>{
    if(paused)return;
    age.current+=delta;
    if(flame.current){const flicker=1+Math.sin(age.current*23)*.06+Math.sin(age.current*37)*.035;
      flame.current.scale.set(1,flicker,1);flame.current.rotation.z=Math.sin(age.current*11)*.025;}
  });
  return <group name="Brass Bunsen burner and steel tripod">
    <mesh position={[0,.065,0]} castShadow><cylinderGeometry args={[.27,.3,.13,64]} /><meshStandardMaterial color="#33423d" metalness={.6} roughness={.32} /></mesh>
    <mesh position={[0,.46,0]} castShadow><cylinderGeometry args={[.075,.075,.7,48]} /><meshStandardMaterial color="#b29455" metalness={.82} roughness={.24} /></mesh>
    <mesh position={[0,.24,0]}><cylinderGeometry args={[.09,.09,.17,48]} /><meshStandardMaterial color="#a6b2ab" metalness={.9} roughness={.2} /></mesh>
    {[0,1,2,3].map(i=><mesh key={i} position={[Math.sin(i*Math.PI/2)*.091,.24,Math.cos(i*Math.PI/2)*.091]} rotation={[0,i*Math.PI/2,0]}><boxGeometry args={[.035,.07,.006]} /><meshStandardMaterial color="#18231e" roughness={.9} /></mesh>)}
    <mesh position={[0,.818,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.075,.01,12,48]} /><meshStandardMaterial color="#7c8d85" metalness={.9} roughness={.22} /></mesh>
    <mesh position={[0,.811,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.065,40]} /><meshStandardMaterial color="#16221d" /></mesh>
    <mesh><tubeGeometry args={[hose,48,.024,12,false]} /><meshStandardMaterial color="#3f5148" roughness={.9} /></mesh>
    <group ref={flame} position={[0,.825,0]} visible={active}>
      <mesh position={[0,.15,0]}><coneGeometry args={[.083,.3,40,12,true]} /><meshBasicMaterial color="#168aff" transparent opacity={.34} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      <mesh position={[0,.08,0]}><coneGeometry args={[.042,.16,32,8,true]} /><meshBasicMaterial color="#80d9ff" transparent opacity={.7} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
      <pointLight position={[0,.12,0]} color="#55b6ff" intensity={.6} distance={1.4} />
    </group>
    {legs.map((leg,i)=><mesh key={i} position={leg.centre} quaternion={leg.rotation} castShadow><cylinderGeometry args={[.027,.033,leg.length,20]} /><meshStandardMaterial color="#6c7c74" metalness={.85} roughness={.3} /></mesh>)}
    <mesh position={[0,1.255,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.48,.035,12,64]} /><meshStandardMaterial color="#75877e" metalness={.85} roughness={.3} /></mesh>
    <mesh position={[0,1.32,0]} receiveShadow><boxGeometry args={[1.06,.022,1.06]} /><meshStandardMaterial color="#a1aaa5" metalness={.55} roughness={.65} /></mesh>
    {Array.from({length:17},(_,i)=>i*.06-.48).map(n=><group key={n}>
      <mesh position={[n,1.335,0]}><boxGeometry args={[.005,.006,1.04]} /><meshStandardMaterial color="#586860" metalness={.7} roughness={.5} /></mesh>
      <mesh position={[0,1.337,n]}><boxGeometry args={[1.04,.006,.005]} /><meshStandardMaterial color="#586860" metalness={.7} roughness={.5} /></mesh>
    </group>)}
    <mesh position={[0,1.343,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.26,48]} /><meshStandardMaterial color="#d4d8d3" roughness={.86} /></mesh>
  </group>;
}

export function PhotosynthesisBeakerGlass() {
  const geometry = useMemo(()=>{
    const profile=[new THREE.Vector2(0,0),new THREE.Vector2(.42,0),new THREE.Vector2(.456,.035),
      new THREE.Vector2(.47,1.08),new THREE.Vector2(.484,1.1),new THREE.Vector2(.484,1.12),
      new THREE.Vector2(.449,1.12),new THREE.Vector2(.44,.065),new THREE.Vector2(0,.065)];
    const result=new THREE.LatheGeometry(profile,96);
    const vertices=result.attributes.position;
    for(let i=0;i<vertices.count;i++){
      const y=vertices.getY(i),angle=Math.atan2(vertices.getX(i),vertices.getZ(i));
      const spout=Math.exp(-Math.pow((angle+Math.PI/2)/.2,2))*Math.max(0,(y-1.02)/.1);
      vertices.setX(i,vertices.getX(i)-spout*.08);vertices.setY(i,y-spout*.012);
    }
    result.computeVertexNormals();return result;
  },[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group name="Clear graduated glass beaker">
    <mesh geometry={geometry} renderOrder={28}><meshPhysicalMaterial color="#edf7f3" transparent opacity={.28} transmission={.86} thickness={.025} ior={1.47} roughness={.045} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    {[.22,.42,.62,.82,1.02].map((y,i)=><group key={y} position={[.12,y,.449]} rotation={[0,.25,0]}>
      <mesh><boxGeometry args={[i%2 ? .075 : .11,.008,.003]} /><meshStandardMaterial color="#203c50" roughness={.6} /></mesh>
    </group>)}
  </group>;
}
