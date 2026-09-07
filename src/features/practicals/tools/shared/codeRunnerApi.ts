export interface CodeDiagnostic {
  line?: number;
  column?: number;
  code?: string;
  message: string;
  severity?: string;
}
export interface CodeRunResult {
  mode?: 'practice' | 'compiler';
  success: boolean;
  output: string[];
  stderr?: string;
  error?: string;
  diagnostics?: CodeDiagnostic[];
  executionTime: number;
}

const lines = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value) return [];
  const result = value.replace(/\r\n/g, '\n').split('\n');
  if (result.at(-1) === '') result.pop();
  return result;
};

/** One response contract for both real compilers; warnings do not fail a run. */
export async function runCode(endpoint: string, language: 'cpp' | 'csharp', code: string, stdin = '', signal?: AbortSignal): Promise<CodeRunResult> {
  const started = performance.now();
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 65_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, stdin }), signal: controller.signal,
    });
    // Read the body once: response.json() consumes HTML error responses too.
    const raw = await response.text();
    let payload: any;
    try { payload = JSON.parse(raw); } catch {
      throw new Error('The compiler service is unavailable. Please try again later.');
    }
    if (!payload || typeof payload !== 'object') throw new Error('The compiler returned an invalid response.');
    const diagnostics: CodeDiagnostic[] = (Array.isArray(payload.diagnostics ?? payload.errors) ? payload.diagnostics ?? payload.errors : [])
      .filter((item: any) => item && typeof item === 'object' && (item.message || item.text || item.error))
      .map((item: any) => ({
        line: typeof item.line === 'number' ? item.line : undefined,
        column: typeof item.column === 'number' ? item.column : undefined,
        code: item.code ? String(item.code) : undefined,
        message: String(item.message ?? item.text ?? item.error),
        severity: String(item.severity ?? 'error').toLowerCase(),
      }));
    const errors = diagnostics.filter((item) => item.severity !== 'warning' && item.severity !== 'info');
    const success = response.ok && Boolean(payload.success ?? payload.status === 'success') && errors.length === 0;
    const elapsed = Number(payload.executionTime ?? payload.timeMs);
    return {
      success, output: lines(payload.output ?? payload.stdout),
      stderr: lines(payload.stderr).join('\n'), diagnostics,
      error: success ? undefined : String(payload.error || payload.message || errors.map((item) => item.message).join('\n') || `Program failed (${response.status}).`),
      executionTime: Number.isFinite(elapsed) ? elapsed : Math.round(performance.now() - started),
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    return {
      success: false, output: [], diagnostics: [], executionTime: Math.round(performance.now() - started),
      error: controller.signal.aborted ? 'The compiler did not respond in time. Try again or check for an infinite loop.'
        : error instanceof TypeError ? 'Unable to reach the compiler. Check your connection and try again.'
        : error instanceof Error ? error.message : 'Unable to run this program.',
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}
