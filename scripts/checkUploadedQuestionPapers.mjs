import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
const cache = new Map();
async function moduleUrl(file) {
  if(cache.has(file)) return cache.get(file);
  let source = await readFile(file, 'utf8');
  if(file.endsWith('.json')) source = `export default ${source};`;
  else source = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  for(const match of [...source.matchAll(/from\s*['"]([^'"]+)['"]/g)]) {
    assert(match[1].startsWith('.'), `Unexpected external import: ${match[1]}`);
    let target = path.resolve(path.dirname(file),match[1]);
    if(!path.extname(target)) target += '.ts';
    source = source.replace(match[0],`from '${await moduleUrl(target)}'`);
  }
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  cache.set(file,url);return url;
}
const {findPastPaper,getPastPaperPath,ALL_PAST_PAPERS}=await import(await moduleUrl(path.resolve('src/utils/pastPaperSeo.ts')));
const imported=JSON.parse(await readFile('src/data/importedResources.json','utf8')).filter(x=>x.type==='past-papers');
const catalogue=JSON.parse(await readFile('compressed-pdfs/upload-catalogue.json','utf8'));
for(const entry of catalogue.filter(x=>x.type==='past-papers'&&!x.duplicateOf)) {
  for(const course of entry.courses) assert(imported.some(x=>x.fileId===entry.driveFileId&&x.course===course),`Missing ${entry.file} for ${course}`);
}
for(const entry of imported) {
  const record=ALL_PAST_PAPERS.find(x=>x.id===entry.id);assert(record,entry.id);
  const parts=getPastPaperPath(record).split('/').filter(Boolean);
  assert.equal(findPastPaper(parts[1],parts[2],parts[3])?.url,entry.url,`Wrong PDF at ${parts.join('/')}`);
  assert.match(entry.url,/^https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view$/);
}
console.log(`Verified all ${imported.length} uploaded-paper course entries resolve to their intended Drive PDF.`);
