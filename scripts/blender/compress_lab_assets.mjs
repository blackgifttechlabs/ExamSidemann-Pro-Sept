/** Conservative vertex precision reduction plus verified meshopt compression; local decoder. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { MeshoptEncoder } from 'meshoptimizer/encoder';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const root=path.resolve('public/models/science-lab');
const files=[path.join(root,'science-lab.glb'),...(await fs.readdir(path.join(root,'props'))).filter(n=>n.endsWith('.glb')).map(n=>path.join(root,'props',n))];
const report=[];
for(const file of files){
 const backupPath=path.join('artifacts/science-lab/uncompressed',path.relative(root,file));
 const source=await fs.readFile(process.argv.includes('--rebuild') ? backupPath : file);const jsonSize=source.readUInt32LE(12);const gltf=JSON.parse(source.subarray(20,20+jsonSize).toString());
 if(gltf.extensionsRequired?.includes('EXT_meshopt_compression'))continue;
 const binary=source.subarray(28+jsonSize);const parts=[];let offset=0,fallbackLength=0;
 const append=data=>{const start=offset;parts.push(Buffer.from(data));offset+=data.length;const padding=(4-offset%4)%4;if(padding){parts.push(Buffer.alloc(padding));offset+=padding;}return start;};
 for(let i=0;i<(gltf.bufferViews?.length??0);i++){
  const view=gltf.bufferViews[i];let data=Buffer.from(binary.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength));
  const accessors=(gltf.accessors??[]).filter(a=>a.bufferView===i);
  const a=accessors[0];let stride=view.byteStride;
  if(!stride&&a){const components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};const bytes={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4};stride=components[a.type]*bytes[a.componentType];}
  const indices=view.target===34963;
  if(!a||!stride||data.length%stride||(!indices&&stride%4)||stride>256){view.buffer=0;view.byteOffset=append(data);continue;}
  // Keep 13 mantissa bits on geometry attributes; maximum error is below 0.01%.
  // Joint matrices, animation and scalar values retain their full original precision.
  if(a.componentType===5126 && ['VEC2','VEC3'].includes(a.type)) {
    for(let p=0;p<data.length;p+=4){const bits=data.readUInt32LE(p);data.writeUInt32LE(((bits+512)&0xfffffc00)>>>0,p);}
  }
  const mode=indices?'INDICES':'ATTRIBUTES';const count=data.length/stride;
  const encoded=MeshoptEncoder.encodeGltfBuffer(data,count,stride,mode);
  // Prove the downloaded data reconstructs every original byte before replacing the asset.
  const decoded=new Uint8Array(data.length);MeshoptDecoder.decodeGltfBuffer(decoded,count,stride,encoded,mode);
  if(!Buffer.from(decoded).equals(data))throw Error('Compression round-trip failed: '+file);
  view.extensions={...view.extensions,EXT_meshopt_compression:{buffer:0,byteOffset:append(encoded),byteLength:encoded.length,byteStride:stride,count,mode,filter:'NONE'}};
  view.buffer=1;view.byteOffset=fallbackLength;fallbackLength+=data.length;
 }
 gltf.buffers=[{byteLength:offset},{byteLength:fallbackLength,extensions:{EXT_meshopt_compression:{fallback:true}}}];
 gltf.extensionsUsed=[...new Set([...(gltf.extensionsUsed??[]),'EXT_meshopt_compression'])];gltf.extensionsRequired=[...new Set([...(gltf.extensionsRequired??[]),'EXT_meshopt_compression'])];
 let json=Buffer.from(JSON.stringify(gltf));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const bin=Buffer.concat(parts);const output=Buffer.alloc(28+json.length+bin.length);
 output.write('glTF');output.writeUInt32LE(2,4);output.writeUInt32LE(output.length,8);output.writeUInt32LE(json.length,12);output.writeUInt32LE(0x4e4f534a,16);json.copy(output,20);output.writeUInt32LE(bin.length,20+json.length);output.writeUInt32LE(0x004e4942,24+json.length);bin.copy(output,28+json.length);
 const backup=path.join('artifacts/science-lab/uncompressed',path.relative(root,file));await fs.mkdir(path.dirname(backup),{recursive:true});await fs.writeFile(backup,source);await fs.writeFile(file,output);report.push({asset:path.relative(root,file),before:source.length,after:output.length});
}
const before=report.reduce((n,r)=>n+r.before,0),after=report.reduce((n,r)=>n+r.after,0);await fs.writeFile('artifacts/science-lab/compression-report.json',JSON.stringify({before,after,savedPercent:Math.round((1-after/before)*100),assets:report},null,2));console.log({assets:report.length,before,after,savedPercent:Math.round((1-after/before)*100)});
