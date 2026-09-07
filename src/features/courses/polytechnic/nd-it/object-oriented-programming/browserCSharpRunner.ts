import type { CodeRunResult } from '@/features/practicals/tools/shared/codeRunnerApi';

export type ConsoleInputKind = 'line' | 'key' | 'char';
export interface BrowserCSharpCallbacks {
  onOutput?: (output: string[]) => void;
  onInput?: (kind: ConsoleInputKind, reply: (value: string) => void) => void;
  onStatus?: (status: 'loading' | 'running') => void;
}

export function runBrowserCSharp(code: string, stdin = '', signal?: AbortSignal, callbacks: BrowserCSharpCallbacks = {}): Promise<CodeRunResult> {
  const started = performance.now();
  const failure = (error: string): CodeRunResult => ({ success: false, output: [], error, diagnostics: [], executionTime: Math.round(performance.now() - started), mode: 'compiler' });
  if (signal?.aborted) return Promise.reject(new DOMException('Run cancelled.', 'AbortError'));
  if (!code.trim()) return Promise.resolve(failure('Enter a C# program before running.'));
  if (code.length > 100_000 || stdin.length > 100_000) return Promise.resolve(failure('Code and input must each be smaller than 100 KB.'));
  if (!globalThis.crossOriginIsolated || typeof SharedArrayBuffer === 'undefined') return Promise.resolve(failure('The browser C# runtime requires a secure, isolated page. Reload the page or use a current browser.'));
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try { worker = new Worker('/csharp/worker.js', { type: 'module' }); }
    catch { resolve(failure('Unable to start the browser C# runtime.')); return; }
    const mailbox = new SharedArrayBuffer(256 * 1024);
    const state = new Int32Array(mailbox, 0, 2);
    const inputBytes = new Uint8Array(mailbox, 8);
    let output = '';
    let finished = false;
    let timer: ReturnType<typeof setTimeout>;
    const lines = () => { const values = output.replace(/\r\n/g, '\n').split('\n'); if (values.at(-1) === '') values.pop(); return values; };
    const finish = (result: CodeRunResult) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      worker.terminate();
      resolve({ ...result, output: lines(), executionTime: Math.round(performance.now() - started), mode: 'compiler' });
    };
    const arm = (milliseconds: number, message: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => finish(failure(message)), milliseconds);
    };
    const abort = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('Run cancelled.', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
    worker.onerror = () => finish(failure('Unable to load the browser C# runtime. Check your connection and reload.'));
    worker.onmessage = ({ data }) => {
      if (finished) return;
      if (data.type === 'output') {
        output += data.text;
        if (output.length > 1_000_000) { finish(failure('Program output exceeded the 1 MB limit.')); return; }
        callbacks.onOutput?.(lines());
      } else if (data.type === 'clear') {
        output = '';
        callbacks.onOutput?.([]);
      } else if (data.type === 'loading') {
        callbacks.onStatus?.('loading');
      } else if (data.type === 'running') {
        callbacks.onStatus?.('running');
        arm(30_000, 'Execution timed out. Check for an infinite loop.');
      } else if (data.type === 'input') {
        arm(125_000, 'Input timed out. Run the program again when ready.');
        if (!callbacks.onInput) { finish(failure('Input is missing. Enter the values your program reads before running.')); return; }
        let replied = false;
        callbacks.onInput(data.kind, value => {
          if (finished || replied) return;
          const bytes = new TextEncoder().encode(value);
          if (bytes.length > inputBytes.length) { finish(failure('Input is too large.')); return; }
          replied = true;
          output += (data.kind === 'line' ? value + '\n' : value);
          callbacks.onOutput?.(lines());
          inputBytes.set(bytes);
          Atomics.store(state, 1, bytes.length);
          Atomics.store(state, 0, 1);
          Atomics.notify(state, 0);
        });
      } else if (data.type === 'result') finish(data.result);
    };
    arm(120_000, 'The C# runtime took too long to load. Check your connection and try again.');
    worker.postMessage({ code, stdin, mailbox });
  });
}
