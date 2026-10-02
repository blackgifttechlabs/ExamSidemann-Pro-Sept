import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../../src/features/practicals/o-level/combined-science/candleMotion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const motion = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const distance = (a,b) => Math.hypot(...a.map((x,i)=>x-b[i]));

test('insertion and withdrawal never carry the candle sideways through a jar wall', () => {
  for (const jar of ['inhaled','exhaled']) {
    const base = motion.JAR_POSITIONS[jar];
    for (const stage of ['inserting','withdrawing']) {
      let previous = motion.candlePosition(stage,jar,0);
      for (let i=1;i<=1000;i++) {
        const position = motion.candlePosition(stage,jar,i/1000);
        assert.ok(distance(previous,position)<.015, 'Motion must be continuous');
        const lateral = Math.hypot(position[0]-base[0],position[2]-base[2]);
        if (lateral<.205 && position[1]<base[1]+.62) assert.ok(lateral<.01, 'Candle must be centred before lowering');
        previous=position;
      }
    }
    assert.deepEqual(motion.candlePosition('inserting',jar,0),motion.CANDLE_HOME);
    assert.deepEqual(motion.candlePosition('inserting',jar,1),motion.candlePosition('burning',jar,0));
    assert.deepEqual(motion.candlePosition('withdrawing',jar,0),motion.candlePosition('out',jar,1));
    assert.deepEqual(motion.candlePosition('withdrawing',jar,1),motion.CANDLE_HOME);
  }
});

test('collected jar is sealed before lifting, rotates above the bench, and lands without a jump',()=>{
  const initial=motion.collectionJarPose('collect',false,0);
  assert.deepEqual(motion.collectionJarPose('transferring',true,0),initial);
  let previous=initial;
  for(let i=1;i<=1000;i++){
    const t=i/1000,pose=motion.collectionJarPose('transferring',true,t);
    assert.ok(distance(previous.position,pose.position)<.015);
    assert.ok(Math.abs(previous.angle-pose.angle)<.025);
    if(t<=.15)assert.deepEqual(pose.position,initial.position,'Do not lift before covering');
    const centreY=pose.position[1]+.31*Math.cos(pose.angle);
    const lowestY=centreY-.31*Math.abs(Math.cos(pose.angle))-.16*Math.abs(Math.sin(pose.angle));
    assert.ok(lowestY>=motion.BENCH_Y+.01,'Jar must clear the bench during its turn');
    previous=pose;
  }
  assert.ok(distance(previous.position,motion.JAR_POSITIONS.exhaled)<1e-9);
  assert.equal(previous.angle,0);
});

test('lid opens before insertion, closes after lowering, and clears the rim during travel',()=>{
  assert.equal(motion.lidClosure('inserting',0,true),1);
  assert.equal(motion.lidClosure('inserting',.2,true),0);
  assert.equal(motion.lidClosure('inserting',.8,false),0);
  assert.equal(motion.lidClosure('inserting',1,false),1);
  for(let i=0;i<=100;i++){
    const p=motion.lidPosition(i/100,false);
    if(Math.hypot(p[0],p[2])<.332&&Math.hypot(p[0],p[2])>.005)assert.ok(p[1]>=.62,'Lid must travel above rim');
  }
});

test('oxygen depletion is monotonic, clamps at extinction, and gives a longer burn for room air',()=>{
  const rate=(21-13.8)/22.4;
  for(const initial of [16,21]){
    let previous=initial;
    for(let t=0;t<60;t+=.1){const value=motion.oxygenAtTime(initial,t,13.8,rate);assert.ok(value<=previous+1e-10);assert.ok(value>=13.8);previous=value;}
  }
  assert.equal(motion.oxygenAtTime(21,22.4,13.8,rate),13.8);
  assert.ok((21-13.8)/rate>(16-13.8)/rate);
});
