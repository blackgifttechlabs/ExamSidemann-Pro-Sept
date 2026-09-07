import { spawnSync } from 'node:child_process';
import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dotnet = process.env.CSHARP_DOTNET || 'dotnet';
const output = path.resolve('browser-csharp/bin/browser-publish');
// Discard Webcil conversions cached by earlier compiler versions.
await rm('browser-csharp/bin', { recursive: true, force: true });
await rm('browser-csharp/obj', { recursive: true, force: true });
const built = spawnSync(dotnet, ['publish', 'browser-csharp/BrowserCSharp.csproj', '-c', 'Release', '-o', output], { stdio: 'inherit' });
if (built.status !== 0) process.exit(built.status || 1);
const sdks = spawnSync(dotnet, ['--list-sdks'], { encoding: 'utf8' }).stdout;
const sdk = [...sdks.matchAll(/^10\.\S+ \[(.+)\]/gm)].at(-1);
if (!sdk) throw new Error('Building the browser runner requires the .NET 10 SDK and wasm-tools workload.');
const packRoot = path.resolve(sdk[1], '../packs/Microsoft.NETCore.App.Ref');
const versions = (await readdir(packRoot)).filter(version => version.startsWith('10.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const references = path.join(packRoot, versions.at(-1), 'ref/net10.0');
const target = path.resolve('public/csharp');
await mkdir(target, { recursive: true });
await rm(path.join(target, '_framework'), { recursive: true, force: true });
await cp(path.join(output, 'wwwroot/_framework'), path.join(target, '_framework'), {
  recursive: true,
  filter: source => !/\.(br|gz|map|pdb)$/.test(source) && !/\.pdb\./.test(source),
});
await mkdir(path.join(target, 'refs'), { recursive: true });
const names = (await readdir(references)).filter(name => name.endsWith('.dll'));
for (const name of names) await cp(path.join(references, name), path.join(target, 'refs', name));
await cp('browser-csharp/bin/Release/net10.0/BrowserCSharp.dll', path.join(target, 'refs/BrowserCSharp.dll'));
await writeFile(path.join(target, 'references.json'), JSON.stringify([...names, 'BrowserCSharp.dll']));
await cp('browser-csharp/worker.js', path.join(target, 'worker.js'));
await cp(path.resolve(sdk[1], '../LICENSE.txt'), path.join(target, 'LICENSE.txt'));
await cp(path.resolve(sdk[1], '../ThirdPartyNotices.txt'), path.join(target, 'ThirdPartyNotices.txt'));
console.log(`Published browser C# runtime and ${names.length + 1} compiler references.`);
