import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build } from 'esbuild';

// Set PLAYWRIGHT_MODULE when using a temporary installation of playwright-core.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const { outputFiles } = await build({ entryPoints: ['src/features/courses/polytechnic/nd-it/object-oriented-programming/browserCSharpRunner.ts'], bundle: true, write: false, format: 'esm' });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`;
const ui = await build({ stdin: { contents: `
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ProgramConsole} from './src/features/practicals/tools/shared/ProgramConsole';
import {runBrowserCSharp} from './src/features/courses/polytechnic/nd-it/object-oriented-programming/browserCSharpRunner';
function Harness() {
  const [result,setResult]=useState({success:true,output:[]});
  const [pendingInput,setPendingInput]=useState(null);
  const [running,setRunning]=useState(false);
  const run=async()=>{
    setRunning(true);
    const result=await runBrowserCSharp('Console.WriteLine("Your name?"); var name=Console.ReadLine(); Console.WriteLine(name); var key=Console.ReadKey(true); Console.WriteLine(key.Key);', '', undefined, {
      onOutput:output=>setResult({success:true,output}),
      onInput:(kind,reply)=>setPendingInput({kind,reply:value=>{setPendingInput(null);reply(value);}}),
    });
    setResult(result);setRunning(false);
  };
  return <><button onClick={run} disabled={running}>Start</button><ProgramConsole stdin="" onInputChange={()=>{}} isExecuting={running} hasExecuted={!running} result={result} onRun={run} pendingInput={pendingInput}/></>;
}
createRoot(document.getElementById('app')).render(<Harness/>);
`, loader: 'tsx', resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm' });
const server = createServer(async (req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  if (req.url === '/favicon.ico') { res.writeHead(204).end(); return; }
  if (req.url === '/ui.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(ui.outputFiles[0].text); return; }
  if (req.url === '/ui') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><div id=app></div><script type=module src=/ui.js></script>'); return; }
  if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><title>C# browser checks</title>'); return; }
  const file = path.resolve('public', `.${decodeURIComponent(req.url.split('?')[0])}`);
  if (!file.startsWith(path.resolve('public') + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.setHeader('Content-Type', file.endsWith('.wasm') ? 'application/wasm' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.json') ? 'application/json' : 'application/octet-stream');
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  let consoleErrors = 0;
  page.on('console', msg => { if (msg.type() === 'error' && consoleErrors++ < 5) console.error('Browser:', msg.text()); });
  page.on('pageerror', error => console.error('Page:', error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.evaluate(async url => { window.runCSharp = (await import(url)).runBrowserCSharp; }, moduleUrl);
  const run = (code, stdin = '', inputs = []) => page.evaluate(async ({ code, stdin, inputs }) => {
    const requests = [], output = [];
    const result = await window.runCSharp(code, stdin, undefined, {
      onOutput: lines => output.push(lines),
      onInput: (kind, reply) => { requests.push(kind); reply(inputs.shift() ?? ''); },
    });
    return { ...result, requests, streamed: output.length > 0 };
  }, { code, stdin, inputs });
  const key = JSON.stringify({ char: 'q', keyCode: 81, shift: false, alt: false, ctrl: false });
  const features = await run(`using System; using System.Linq; using System.Collections.Generic;
interface INamed { string Name { get; } }
class Person : INamed { public virtual string Name => "Student"; }
class Student : Person { public override string Name => "Tina"; public int[] Marks = {10,20,30}; public int Total() => Marks.Sum(); }
class Program { static int Twice(int n) => n*2; static void Main() { var s = new Student(); var values = new List<int>{1,2,3}; Console.WriteLine($"{s.Name}:{s.Total()}:{Twice(values.Count)}"); Console.Write("Key:"); var key=Console.ReadKey(true); Console.WriteLine(key.KeyChar); } }`, '', [key]);
  assert.equal(features.success, true, JSON.stringify(features));
  assert.deepEqual(features.output, ['Tina:60:6', 'Key:q']);
  assert.deepEqual(features.requests, ['key']);
  assert.equal(features.streamed, true);
  console.log('PASS classes, inheritance, interfaces, methods, arrays, generics, LINQ, interpolation and live ReadKey');
  const line = await run('using System; Console.Write("Name: "); string name = Console.ReadLine(); Console.WriteLine($"Hello {name}");', '', ['Tina']);
  assert.equal(line.success, true, JSON.stringify(line));
  assert.deepEqual(line.output, ['Name: Hello Tina']);
  assert.deepEqual(line.requests, ['line']);
  console.log('PASS top-level statements and live ReadLine');
  const alias = await run('using C = System.Console; class P { static void Main() { C.WriteLine("Console.ReadKey() stays text"); var key = C.ReadKey(true); C.WriteLine(key.Key); } }', '', [key]);
  assert.equal(alias.success, true, JSON.stringify(alias));
  assert.deepEqual(alias.output, ['Console.ReadKey() stays text', 'Q']);
  console.log('PASS semantic Console alias rewriting');
  const statics = await run('using static System.Console; WriteLine(ReadKey(true).KeyChar);', '', [key]);
  assert.equal(statics.success, true, JSON.stringify(statics));
  assert.deepEqual(statics.output, ['q']);
  console.log('PASS using static Console');
  const asynchronous = await run('using System; using System.Threading.Tasks; await Task.Delay(10); Console.WriteLine("async works");');
  assert.equal(asynchronous.success, true, JSON.stringify(asynchronous));
  console.log('PASS async/await');
  const error = await run('using System; class P { static void Main() { int[] x = new int[1]; Console.WriteLine(x[2]); } }');
  assert.equal(error.success, false);
  assert.match(error.error, /IndexOutOfRangeException/);
  const invalid = await run('using System; Console.WriteLine(missing);');
  assert.equal(invalid.success, false);
  assert.equal(invalid.diagnostics[0].code, 'CS0103');
  assert.equal(invalid.diagnostics[0].line, 1);
  console.log('PASS real runtime errors and compiler diagnostics');
  const cancelled = await page.evaluate(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try { await window.runCSharp('while(true) {}', '', controller.signal); return false; }
    catch (error) { return error.name === 'AbortError'; }
    finally { clearTimeout(timer); }
  });
  assert.equal(cancelled, true);
  console.log('PASS worker cancellation');
  await page.goto(`http://127.0.0.1:${server.address().port}/ui`);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Console input', exact: true });
  await input.waitFor();
  await input.fill('Tina');
  await input.press('Enter');
  const keyboard = page.getByRole('textbox', { name: 'Console keyboard input' });
  await keyboard.waitFor();
  await keyboard.press('ArrowUp');
  await page.waitForFunction(() => !document.querySelector('button').disabled);
  assert.match(await page.getByRole('log').innerText(), /Tina[\s\S]*UpArrow/);
  console.log('PASS typing ReadLine and arrow-key ReadKey through the actual console UI');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
