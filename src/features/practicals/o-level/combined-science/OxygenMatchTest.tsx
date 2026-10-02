import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OXYGEN_BENCH_Y as BENCH_Y } from './OxygenLabRoom';
import { matchPose, MATCH_PREPARATION_SECONDS, MATCH_INSERTION_SECONDS } from './oxygenMatchMotion';

function matchboxLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 768; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#f5dc59'; ctx.fillRect(0, 0, 768, 512);
  ctx.strokeStyle = '#655323'; ctx.lineWidth = 4; ctx.strokeRect(20, 20, 728, 472);
  ctx.lineWidth = 2; ctx.strokeRect(31, 31, 706, 450);
  ctx.textAlign = 'center'; ctx.fillStyle = '#252017'; ctx.font = 'bold 90px Georgia';
  ctx.fillText('LION', 384, 139);
  // Red reclining lion, with a golden face, mane and curled tail like the reference.
  ctx.save(); ctx.translate(130, 160); ctx.scale(1.35, 1.12);
  ctx.fillStyle = '#eb3125';
  ctx.fill(new Path2D('M95 188 Q117 162 137 151 L143 101 Q119 104 129 79 Q107 66 129 55 Q122 35 148 38 Q157 17 177 35 Q199 20 207 47 Q229 50 217 72 Q232 93 213 109 L202 147 Q231 125 278 133 Q324 131 338 162 Q350 186 322 188 L242 188 Q223 205 195 199 L160 200 L147 211 L100 211 Q76 206 95 188 Z'));
  ctx.strokeStyle = '#eb3125'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.stroke(new Path2D('M316 177 Q372 176 358 126 Q349 106 330 119'));
  ctx.fillStyle = '#ffcf38'; ctx.fill(new Path2D('M159 51 Q192 40 201 61 L210 79 L199 89 L196 113 L171 124 L157 104 L158 86 L147 73 Z'));
  ctx.fillStyle = '#64251b'; ctx.beginPath(); ctx.arc(185, 70, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffcf38'; ctx.lineWidth = 5;
  ctx.stroke(new Path2D('M174 126 L175 176 L139 191 M211 157 Q248 182 289 169 M207 189 L247 193'));
  ctx.restore();
  ctx.fillStyle = '#30291b';
  ctx.fill(new Path2D('M70 394 L698 369 L683 453 L78 472 L94 433 Z'));
  ctx.save(); ctx.translate(384, 432); ctx.rotate(-0.035); ctx.fillStyle = '#fff2a4';
  ctx.font = 'bold 45px Georgia'; ctx.fillText('SAFETY MATCHES', 0, 0); ctx.restore();
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const fireVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fireFragment = `
  varying vec2 vUv; uniform float time; uniform float strength;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
  void main(){
    float y=vUv.y; float sway=sin(y*9.-time*7.)*.055*y;
    float x=(vUv.x-.5+sway)*2.;
    float turbulence=noise(vec2(x*5.,y*8.-time*4.))*.65+noise(vec2(x*13.,y*16.-time*7.))*.35;
    float width=(1.-y)*(.44+.12*turbulence);
    float shape=1.-smoothstep(width*.35,width,abs(x));
    float height=1.-smoothstep(.55+.22*turbulence,.96,y);
    float alpha=shape*height*smoothstep(0.,.07,y)*strength;
    vec3 color=mix(vec3(1.,.12,.015),vec3(1.,.67,.08),shape);
    color=mix(color,vec3(1.,.96,.69),pow(shape,5.)*(1.-y));
    color=mix(color,vec3(.2,.35,1.),(1.-smoothstep(.02,.14,y))*.55);
    gl_FragColor=vec4(color*1.6,alpha);
  }`;

export function OxygenMatchTest({ state, result, onPrepared }: {
  state: 'idle' | 'glowing' | 'tested'; result: 'relit' | 'stayedGlowing' | null; onPrepared: () => void;
}) {
  const match = useRef<THREE.Group>(null), drawer = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null), smoke = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null), light = useRef<THREE.PointLight>(null);
  const age = useRef(0), prepared = useRef(false);
  const label = useMemo(matchboxLabel, []);
  const fire = useMemo(() => new THREE.ShaderMaterial({ vertexShader: fireVertex, fragmentShader: fireFragment,
    uniforms: { time: { value: 0 }, strength: { value: 0 } }, transparent: true,
    depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false }), []);
  useEffect(() => () => { label?.dispose(); fire.dispose(); }, [label, fire]);
  useEffect(() => { age.current = 0; prepared.current = false; }, [state, result]);
  useFrame(({ camera, clock }, delta) => {
    age.current += Math.min(delta, 0.1);
    const t = age.current;
    const pose = matchPose(state, t);
    if (match.current) { match.current.position.set(pose.x, BENCH_Y + pose.y, pose.z); match.current.rotation.z = pose.angle; match.current.updateMatrixWorld(); }
    if (drawer.current) drawer.current.position.x = state === 'idle' ? 0 : t < 1.35 && state === 'glowing'
      ? Math.min(.18, t / .65 * .18) : THREE.MathUtils.damp(drawer.current.position.x, 0, 5, delta);
    const igniting = state === 'glowing' && t >= 2.05 && t < 4.1;
    const relit = state === 'tested' && result === 'relit' && t >= MATCH_INSERTION_SECONDS;
    const power = igniting ? Math.min(1, (t - 2.05) * 12, (4.1 - t) * 8) : relit ? Math.min(1.25, (t - MATCH_INSERTION_SECONDS) * 5) : 0;
    if (flame.current && match.current) {
      flame.current.visible = power > 0;
      const tip = new THREE.Vector3(0, .12, 0).applyMatrix4(match.current.matrixWorld);
      // Flame rises vertically even when the wooden match is tilted.
      flame.current.position.copy(tip).add(new THREE.Vector3(0, .065, 0));
      flame.current.quaternion.copy(camera.quaternion);
      flame.current.scale.set(.07, .15 * (1 + Math.sin(clock.elapsedTime * 19) * .09), 1);
      fire.uniforms.time.value = clock.elapsedTime; fire.uniforms.strength.value = power;
      if (light.current) { light.current.position.copy(tip); light.current.intensity = power * (.8 + Math.sin(clock.elapsedTime * 27) * .15); }
      if (smoke.current) {
        smoke.current.position.copy(tip);
        smoke.current.visible = state !== 'idle' && !relit && t > 3.9;
        smoke.current.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh;
          const phase = ((clock.elapsedTime * .45 + i / 7) % 1);
          mesh.position.set(Math.sin(phase * 5 + i) * .015 * phase, .02 + phase * .16, 0);
          mesh.scale.setScalar(.007 + phase * .018);
          (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * .085;
        });
      }
    }
    const material = head.current?.material as THREE.MeshStandardMaterial | undefined;
    if (material) { material.color.set(state === 'idle' || (state === 'glowing' && t < 2.05) ? '#9d342b' : '#2b2019');
      material.emissiveIntensity = state === 'idle' || t < 2.05 && state === 'glowing' ? 0 : relit ? 3 : .8 + Math.sin(t * 9) * .15; }
    if (state === 'glowing' && t >= MATCH_PREPARATION_SECONDS && !prepared.current) { prepared.current = true; onPrepared(); }
  });
  return <>
    <group position={[.62, BENCH_Y + .05, .28]} name="Yellow LION safety matchbox">
      <mesh castShadow><boxGeometry args={[.44,.1,.30]} /><meshStandardMaterial color="#e9cf58" roughness={.92} /></mesh>
      <mesh position={[0,.051,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.43,.29]} /><meshStandardMaterial map={label} color={label ? '#ffffff' : '#f5dc59'} roughness={.9} /></mesh>
      <mesh position={[0,0,.151]}><boxGeometry args={[.39,.065,.002]} /><meshStandardMaterial color="#63332d" roughness={1} /></mesh>
      {Array.from({length:24},(_,i)=><mesh key={i} position={[-.18+i*.015,0,.153]}><boxGeometry args={[.003,.058,.001]} /><meshStandardMaterial color="#93664d" roughness={1} /></mesh>)}
      <group ref={drawer}>
        <mesh position={[.01,-.012,0]} castShadow><boxGeometry args={[.425,.058,.273]} /><meshStandardMaterial color="#cbb797" roughness={1} /></mesh>
        <mesh position={[.224,0,0]}><boxGeometry args={[.009,.085,.277]} /><meshStandardMaterial color="#245e81" roughness={1} /></mesh>
        {Array.from({length:10},(_,i)=><group key={i} position={[.02,.009,-.105+i*.022]} rotation={[0,0,Math.PI/2]}>
          <mesh><boxGeometry args={[.009,.23,.008]} /><meshStandardMaterial color="#dac09a" roughness={.95} /></mesh>
          <mesh position={[0,.12,0]}><sphereGeometry args={[.009,12,8]} /><meshStandardMaterial color="#9d342b" roughness={.85} /></mesh>
        </group>)}
      </group>
    </group>
    <group ref={match} position={[.7,BENCH_Y+.058,.28]} rotation={[0,0,Math.PI/2]} name="Animated wooden match">
      <mesh castShadow><boxGeometry args={[.009,.23,.009]} /><meshStandardMaterial color="#d9b98b" roughness={.95} /></mesh>
      <mesh position={[.0046,0,0]}><boxGeometry args={[.0003,.22,.003]} /><meshStandardMaterial color="#ad875b" roughness={1} /></mesh>
      <mesh ref={head} position={[0,.12,0]} scale={[1,1.35,1]}><sphereGeometry args={[.009,20,12]} /><meshStandardMaterial color="#9d342b" emissive="#ff4d12" emissiveIntensity={0} roughness={.9} /></mesh>
    </group>
    <mesh ref={flame} visible={false} material={fire} renderOrder={40}><planeGeometry args={[1,1]} /></mesh>
    <pointLight ref={light} intensity={0} distance={.8} color="#ffb45b" decay={2} />
    <group ref={smoke} visible={false}>{Array.from({length:7},(_,i)=><mesh key={i}><sphereGeometry args={[1,10,8]} /><meshBasicMaterial color="#a7adb2" transparent opacity={0} depthWrite={false} /></mesh>)}</group>
  </>;
}
