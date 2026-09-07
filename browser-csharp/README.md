# Browser C# runtime

The C# editor uses Roslyn 4.14 (C# 13) and .NET 10 WebAssembly entirely on the
learner's device. No program is sent to Judge0 or a server unless an explicit
`VITE_CSHARP_RUN_API_URL` override is configured.

The generated `public/csharp` assets are included with the static website. They
are loaded only when C# is run; the first download is larger than the former
practice interpreter. Each run owns a fresh Web Worker. Stop terminates that
worker, releasing program state. A run has a 30-second execution limit, a
1 MB output limit, and a two-minute input wait.

Roslyn compiles methods, arrays, classes, inheritance, interfaces, collections,
LINQ, exceptions, generics, interpolation, and async code with normal C# semantics.
Output streams into the black console. ReadLine, Read, and ReadKey use a shared
input mailbox so synchronous C# can wait while the browser UI remains responsive.
Console input calls are rewritten by resolved Roslyn symbols, preserving aliases,
using-static imports, source strings, comments, and user-defined Console classes.

This is a browser console environment, not a desktop OS. Native Windows UI,
process creation, native DLLs, external NuGet packages, and OS terminal controls
are not provided. Platform-dependent .NET APIs can throw PlatformNotSupportedException.
File APIs, where supported by .NET WASM, use a virtual filesystem, not the user's disk.
KeyAvailable reports available pre-supplied input; use ReadKey for live key events.

## Rebuilding

Install a .NET 10 SDK and `dotnet workload install wasm-tools`, then run:

```sh
npm run csharp:build
npm run build
```

Set `CSHARP_DOTNET` to a specific dotnet executable if it is not on PATH. Ordinary
Vite builds copy the checked-in runtime assets and do not need .NET installed.
The build clears this project's generated bin/obj caches to avoid stale Webcil
assemblies after dependency changes. Roslyn is pinned because the compiler bundled
with SDK 10.0.400 fails on Mono WASM's Volatile.ReadBarrier intrinsic.

The site must serve over HTTPS (localhost also works), with
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: credentialless`. These headers are configured for
Vite, Vercel, and Netlify. They enable SharedArrayBuffer for synchronous input.

Browser tests require Chrome and playwright-core:

```sh
node tests/runner/browserCSharp.test.mjs
```

`PLAYWRIGHT_MODULE` can point to an external installation of playwright-core,
and `CHROME_PATH` can select a Chrome executable.

Reference: [Microsoft's .NET WebAssembly integration documentation](https://learn.microsoft.com/en-us/aspnet/core/client-side/dotnet-interop/wasm-browser-app?view=aspnetcore-10.0).
.NET and Roslyn are distributed under their respective MIT licenses.
