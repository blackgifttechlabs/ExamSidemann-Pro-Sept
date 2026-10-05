import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';

const root = 'src/features/practicals/o-level';
let checks = 0;
const near = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
  checks++;
};
// Exercise the functions used by the scenes, rather than copies of their equations.
function model(folder, name, names) {
  const file = `${root}/${folder}/${name}.tsx`;
  const source = fs.readFileSync(fs.existsSync(file) ? file : file.replace(/\.tsx$/, '.ts'), 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const selected = ast.statements.filter(node =>
    ts.isFunctionDeclaration(node) && names.includes(node.name?.text) ||
    ts.isVariableStatement(node) && node.declarationList.declarations.some(d => names.includes(d.name.getText(ast))));
  const code = selected.map(n => n.getText(ast)).join('\n') + `\nglobalThis.subject = {${names.join(',')}};`;
  const context = vm.createContext({ THREE, Math, exports: {} });
  vm.runInContext(ts.transpileModule(code, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText, context);
  return context.subject;
}
const physics = (name, names) => model('physics-experiments', name, names);
const biology = (name, names) => model('biology-experiments', name, names);
const chemistry = (name, names) => model('chemistry-experiments', name, names);

const pendulum = physics('Pendulum', ['theoreticalPeriod','finiteAmplitudePeriod']);
near(pendulum.theoreticalPeriod(1, 9.81), 2*Math.PI/Math.sqrt(9.81));
near(pendulum.finiteAmplitudePeriod(1, 9.81, 0), pendulum.theoreticalPeriod(1,9.81));
assert.ok(pendulum.finiteAmplitudePeriod(1,9.81,Math.PI/3) > pendulum.theoreticalPeriod(1,9.81)*1.07); checks++;
const spring = physics('HookesLaw', ['equilibriumExtension','linearRegression']);
near(spring.equilibriumExtension(.2,20,9.81),.0981);
near(spring.linearRegression([{x:.1,y:2},{x:.2,y:4},{x:.3,y:6}]).slope,20);

const momentum = physics('momentumSimulation', ['collisionResult']);
for (const kind of ['springy','sticky']) for (const m1 of [.1,.4,1]) for (const m2 of [.2,.7,1.5]) {
 const {v1,v2} = momentum.collisionResult(kind,m1,m2,1.2,-.3);
 near(m1*v1+m2*v2,m1*1.2-m2*.3);
 if(kind==='springy') near(m1*v1*v1+m2*v2*v2,m1*1.2**2+m2*.3**2);
 else assert.ok(m1*v1*v1+m2*v2*v2 <= m1*1.2**2+m2*.3**2);
}
const fall = physics('TerminalVelocity',['FLUIDS','SPHERES','TUBE_RADIUS_M','clamp','dragCoefficient','sphereForces','terminalVelocity']);
for(const fluid of fall.FLUIDS) for(const sphere of fall.SPHERES) for(const radius of [2,4,7]) {
 const speed=fall.terminalVelocity(fluid,sphere,radius,9.81);
 assert.ok(speed>0 && Number.isFinite(speed));
 near(fall.sphereForces(fluid,sphere,radius,9.81,speed).acceleration,0,1e-8);
 assert.ok(fall.sphereForces(fluid,sphere,radius,9.81,0).acceleration>0);
}
const flight = physics('ProjectileMotion',['degToRad','WORLD_SCALE','CANNON_PIVOT','CANNON_BARREL_LENGTH','CANNON_MUZZLE_OFFSET','MIN_GRAVITY','launchOrigin','totalFlightTime','positionAt','speedAt','horizontalRange']);
for(const gravity of [1.62,3.71,9.81,24.79]) for(const angleDeg of [15,45,80]) {
 const params={gravity,angleDeg,velocity:30}; const t=flight.totalFlightTime(params),origin=flight.launchOrigin(params);
 near(flight.positionAt(t,params).y,0,1e-8);
 near(flight.horizontalRange(params),30*Math.cos(angleDeg*Math.PI/180)*t,1e-8);
 for(const fraction of [.1,.5,.9]) near(flight.speedAt(t*fraction,params)**2+2*gravity*flight.positionAt(t*fraction,params).y,30**2+2*gravity*origin.y,1e-7);
}
const divider=physics('RheostatControl',['SUPPLY_VOLTAGE','LAMP_RESISTANCE','RHEOSTAT_MAX','circuitValues']);
near(divider.circuitValues('divider',0).voltage,0);
near(divider.circuitValues('divider',1).voltage,6);
near(divider.circuitValues('series',1).current,6/25);
const resistors=physics('ResistorCombinations',['RESISTORS','ARRANGEMENTS','combinedResistance']);
for(const spec of resistors.ARRANGEMENTS) {
 const value=resistors.combinedResistance(spec);
 if(spec.parallel) assert.ok(value<Math.min(...spec.used.map(i=>resistors.RESISTORS[i])));
 else near(value,spec.used.reduce((total,i)=>total+resistors.RESISTORS[i],0));
}
const heating=physics('HeatingCoolingCurve',['ROOM_TEMP','HEATING_POWER','SUBSTANCES','simulateCurve']);
for(const substance of heating.SUBSTANCES) {
 const samples=heating.simulateCurve(substance,'heating');
 const enthalpy=sample=>sample.temp<substance.meltingPoint ? substance.massKg*substance.cSolid*(sample.temp-substance.meltingPoint) : substance.massKg*substance.latentHeat+substance.massKg*substance.cLiquid*(sample.temp-substance.meltingPoint);
 assert.ok(samples.some(s=>s.phase==='changing')); checks++;
 for(const sample of samples.filter(s=>s.phase!=='changing')) near(enthalpy(sample),enthalpy(samples[0])+heating.HEATING_POWER*sample.time,1e-7);
 const cooled=heating.simulateCurve(substance,'cooling');
 assert.ok(cooled.every((s,i)=>!i||s.temp<=cooled[i-1].temp+1e-9)); checks++;
}
const enzyme=biology('CatalaseActivity',['SYRINGE_CAPACITY','BASE_K','volumeAt']);
for(const activity of [0,.1,.5,1]) for(const amount of [10,30,60]) {
 let previous=0;
 for(const time of [0,1,10,30,60,120,1000]) {
  const v=enzyme.volumeAt(time,activity,amount);
  assert.ok(v>=previous-1e-10 && v<=amount+1e-10 && v<=60);previous=v;checks++;
 }
}
near(enzyme.volumeAt(120,0,60),0);
const diffusion=biology('Diffusion',['permanganateSpread']);
near(diffusion.permanganateSpread(400,20),2*diffusion.permanganateSpread(100,20));
assert.ok(diffusion.permanganateSpread(100,60)>diffusion.permanganateSpread(100,20));checks++;
const plant=biology('PondweedRate',['MAX_RATE','HALF_SATURATION','lightIntensity','bubblesPerMinute']);
near(plant.lightIntensity(20),plant.lightIntensity(10)/4);
assert.ok(plant.bubblesPerMinute(10)>plant.bubblesPerMinute(50)); checks++;
const titration=chemistry('AcidAlkaliTitration',['TRUE_ALKALI_CONCENTRATION','PIPETTE_VOLUME','solutionPH','equivalenceVolume','indicatorEndVolume']);
for(const acid of [{concentration:.1,basicity:1},{concentration:.05,basicity:2}]) {
 near(titration.solutionPH(acid,titration.equivalenceVolume(acid)),7,1e-7);
 near(titration.solutionPH(acid,titration.indicatorEndVolume(acid,'phenolphthalein')),7.4,1e-7);
 near(titration.solutionPH(acid,titration.indicatorEndVolume(acid,'methyl-orange')),3.75,1e-7);
}

// Read each room's actual wall positions and each scene's OrbitControls limits.
let rooms=0, positions=0, experiments=0;
const customTargets={Pendulum:[[0,.15,-.15],[0,.3,-.15]],HookesLaw:[[0,.42,-.05],[.05,.15,0]],Density:[[0,.9,-.35],[0,1.05,-.35]],TerminalVelocity:[[0,1,0],[0,1.12,0]]};
for(const folder of ['physics-experiments','biology-experiments','chemistry-experiments']) {
 for(const labName of fs.readdirSync(`${root}/${folder}`).filter(n=>n.endsWith('Lab.tsx'))) {
  const name=labName.slice(0,-7),file=`${root}/${folder}/${name}.tsx`,source=fs.readFileSync(file,'utf8'),lab=fs.readFileSync(`${root}/${folder}/${labName}`,'utf8'); experiments++;
  assert.ok(!/common\/(?:LabEnvironment|BlenderLabEnvironment|ElectricalApparatus|MagnetApparatus|BlenderLabApparatus|CombinedScienceGame|MobileExperimentTopBar)/.test(source),`${name} still uses shared lab code`);
  assert.ok(!/<(?:LabPlayer|PlayerController|CombinedScienceGoalCard|VirtualJoystick|MobileGtaNavigation)\b/.test(source),`${name} still renders a walking/goal overlay`);
  assert.ok(lab.includes('>See<') || lab.includes('"See"'),`${name} missing See`);
  if(name==='ProjectileMotion') continue;
  const wallMatch=lab.match(/(\[\[[-\d.,\s]+\](?:,\[[-\d.,\s]+\]){3}\])\.map/);
  assert.ok(wallMatch,`${name} missing four room walls`);
  const walls=vm.runInNewContext(wallMatch[1]);
  const floor=Number(lab.match(/dedicated laboratory" position=\{\[0,([-\d.]+),0\]/)?.[1] ?? 0);
  const xWalls=walls.filter(w=>w[3]<.3), zWalls=walls.filter(w=>w[5]<.3);
  const xmin=Math.min(...xWalls.map(w=>w[0]))+.09, xmax=Math.max(...xWalls.map(w=>w[0]))-.09;
  const zmin=Math.min(...zWalls.map(w=>w[2]))+.09, zmax=Math.max(...zWalls.map(w=>w[2]))-.09;
  const ceiling=floor+walls[0][4]-.09;
  const bench=Number(lab.match(/BENCH_TOP_Y = ([-\d.]+)/)[1]);
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let orbit;
  const find=n=>{if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(ast)==='OrbitControls')orbit=n;ts.forEachChild(n,find);}; find(ast); assert.ok(orbit);
  const attrs=Object.fromEntries(orbit.attributes.properties.filter(ts.isJsxAttribute).map(a=>[a.name.getText(ast),a.initializer?.expression?.getText(ast)]));
  const evaluate=text=>vm.runInNewContext(text,{Math,BENCH_TOP_Y:bench,demonstration:'gases',isMobile:true,isPortraitMobile:true,isMobileFrame:true});
  const distance=evaluate(attrs.maxDistance), polarMin=attrs.minPolarAngle?evaluate(attrs.minPolarAngle):0, polarMax=attrs.maxPolarAngle?evaluate(attrs.maxPolarAngle):Math.PI;
  const targets=customTargets[name] ?? [evaluate(attrs.target)];
  for(const target of targets) for(let p=0;p<=80;p++) for(let a=0;a<=120;a++) {
   const polar=polarMin+(polarMax-polarMin)*p/80,azimuth=2*Math.PI*a/120;
   const x=target[0]+distance*Math.sin(polar)*Math.sin(azimuth),y=target[1]+distance*Math.cos(polar),z=target[2]+distance*Math.sin(polar)*Math.cos(azimuth);
   assert.ok(x>xmin&&x<xmax&&y>floor+.05&&y<ceiling&&z>zmin&&z<zmax,`${name}: orbit leaves room at ${x},${y},${z}`);positions++;
  }
  rooms++;
 }
}
assert.equal(experiments,34);
console.log(`Passed ${checks} numerical checks; ${experiments} independent experiments; ${positions} camera positions within ${rooms} rooms.`);
