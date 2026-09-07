import { dotnet } from './_framework/dotnet.js';

// Each run owns one worker and one shared input mailbox. Only the worker blocks.
self.onmessage = async ({ data }) => {
  const { code, stdin, mailbox } = data;
  const state = new Int32Array(mailbox, 0, 2);
  const inputBytes = new Uint8Array(mailbox, 8);
  let inputPosition = 0;
  let written = 0;
  let buffered = '';
  const flush = () => { if (buffered) { self.postMessage({ type: 'output', text: buffered }); buffered = ''; } };
  const write = text => {
    written += text.length;
    if (written > 1_000_000) throw new Error('Program output exceeded the 1 MB limit.');
    buffered += text;
    if (buffered.includes('\n') || buffered.length >= 256) flush();
  };
  const keyFromChar = char => JSON.stringify({ char, keyCode: char === '\n' ? 13 : char.toUpperCase().charCodeAt(0), shift: /[A-Z]/.test(char), alt: false, ctrl: false });
  const read = kind => {
    flush();
    if (kind === 'available') return String(inputPosition < stdin.length);
    if (inputPosition < stdin.length) {
      if (kind !== 'line') { const char = stdin[inputPosition++]; return kind === 'key' ? keyFromChar(char) : char; }
      const end = stdin.indexOf('\n', inputPosition);
      const line = stdin.slice(inputPosition, end === -1 ? undefined : end).replace(/\r$/, '');
      inputPosition = end === -1 ? stdin.length : end + 1;
      return line;
    }
    Atomics.store(state, 0, 0);
    self.postMessage({ type: 'input', kind });
    const status = Atomics.wait(state, 0, 0, 120_000);
    if (status === 'timed-out') throw new Error('Input timed out. Run the program again when ready.');
    self.postMessage({ type: 'running' });
    return new TextDecoder().decode(new Uint8Array(inputBytes.subarray(0, Atomics.load(state, 1))));
  };
  try {
    self.postMessage({ type: 'loading' });
    const runtime = await dotnet.withDiagnosticTracing(false).create();
    runtime.setModuleImports('consoleBridge', { write, read, clear: () => { buffered = ''; self.postMessage({ type: 'clear' }); } });
    const exports = await runtime.getAssemblyExports(runtime.getConfig().mainAssemblyName);
    const manifest = await fetch(new URL('./references.json', import.meta.url)).then(response => {
      if (!response.ok) throw new Error('C# compiler references are unavailable.');
      return response.json();
    });
    // Limit parallel downloads and retain only Roslyn's metadata copies.
    for (let index = 0; index < manifest.length; index += 12) {
      const batch = await Promise.all(manifest.slice(index, index + 12).map(async name => {
        const response = await fetch(new URL(`./refs/${name}`, import.meta.url));
        if (!response.ok) throw new Error(`Missing C# reference: ${name}`);
        return new Uint8Array(await response.arrayBuffer());
      }));
      for (const bytes of batch) exports.BrowserHost.AddReference(bytes);
    }
    self.postMessage({ type: 'running' });
    const result = JSON.parse(await exports.BrowserHost.Run(code));
    flush();
    self.postMessage({ type: 'result', result });
  } catch (error) {
    flush();
    self.postMessage({ type: 'result', result: { success: false, diagnostics: [], error: error.message || String(error) } });
  }
};
