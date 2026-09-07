import { setTimeout as delay } from 'node:timers/promises';
import { parseDiagnostics, outputLines } from './compilerResult';
import type { CodeRunResult } from '../src/features/practicals/tools/shared/codeRunnerApi';

type Language = 'cpp' | 'csharp';
export class CompilerServiceError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Judge0 owns isolation and compiler installation; API keys stay server-side. */
export async function runHosted(language: Language, code: string, stdin: string, options: {
  env?: NodeJS.ProcessEnv; fetch?: typeof fetch; signal?: AbortSignal; pollInterval?: number;
} = {}): Promise<CodeRunResult> {
  const env = options.env ?? process.env;
  const request = options.fetch ?? fetch;
  const base = env.JUDGE0_API_URL?.replace(/\/$/, '');
  const languageId = Number(language === 'cpp' ? env.JUDGE0_CPP_LANGUAGE_ID : env.JUDGE0_CSHARP_LANGUAGE_ID);
  if (!base || !Number.isInteger(languageId) || languageId <= 0) throw new CompilerServiceError(503, 'The hosted compiler is not available yet. Please try again later.');
  const url = new URL(base);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new CompilerServiceError(503, 'The compiler service is unavailable.');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.JUDGE0_AUTH_TOKEN) headers['X-Auth-Token'] = env.JUDGE0_AUTH_TOKEN;
  if (env.JUDGE0_API_KEY) headers['X-RapidAPI-Key'] = env.JUDGE0_API_KEY;
  if (env.JUDGE0_API_HOST) headers['X-RapidAPI-Host'] = env.JUDGE0_API_HOST;
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 50_000);
  const started = Date.now();
  const send = async (suffix: string, init: RequestInit = {}) => {
    const response = await request(`${base}${suffix}`, { ...init, headers, signal: controller.signal });
    if (!response.ok) throw new CompilerServiceError(response.status === 429 ? 429 : 502, response.status === 429 ? 'The compiler is busy. Please try again shortly.' : 'The compiler service could not process this program.');
    try { return await response.json(); } catch { throw new CompilerServiceError(502, 'The compiler returned an invalid response.'); }
  };
  try {
    const submitted = await send('/submissions?base64_encoded=true&wait=false', {
      method: 'POST', body: JSON.stringify({
        language_id: languageId, source_code: Buffer.from(code).toString('base64'), stdin: Buffer.from(stdin).toString('base64'),
        cpu_time_limit: 5, wall_time_limit: 10, enable_network: false,
        ...(language === 'cpp' ? { compiler_options: '-std=c++17 -Wall -Wextra -pthread' } : {}),
      }),
    });
    if (typeof submitted.token !== 'string' || !submitted.token) throw new CompilerServiceError(502, 'The compiler did not accept the program.');
    while (true) {
      const result = await send(`/submissions/${encodeURIComponent(submitted.token)}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time,exit_code`);
      const status = Number(result.status?.id);
      if (status === 1 || status === 2) { await delay(options.pollInterval ?? 700, undefined, { signal: controller.signal }); continue; }
      if (!Number.isInteger(status) || status < 3) throw new CompilerServiceError(502, 'The compiler returned an invalid program status.');
      const decode = (value: unknown) => typeof value === 'string' ? Buffer.from(value, 'base64').toString('utf8') : '';
      const stdout = decode(result.stdout), stderr = decode(result.stderr), compiler = decode(result.compile_output);
      const diagnostics = parseDiagnostics(compiler);
      const success = status === 3 && (result.exit_code == null || Number(result.exit_code) === 0);
      return {
        success, output: outputLines(stdout), stderr, diagnostics,
        error: success ? undefined : status === 5 ? 'Execution timed out. Check for an infinite loop or missing input.'
          : compiler.trim() || stderr.trim() || result.status?.description || 'Program execution failed.',
        executionTime: Date.now() - started,
      };
    }
  } catch (error) {
    if (controller.signal.aborted) throw new CompilerServiceError(504, 'The compiler request timed out or was cancelled.');
    if (error instanceof CompilerServiceError) throw error;
    throw new CompilerServiceError(502, 'Unable to connect to the compiler service.');
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}

export function hostedCompilerHandler(language: Language) {
  return async (req: any, res: any) => {
    const send = (status: number, payload: unknown) => {
      if (res.destroyed) return;
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(payload));
    };
    const fail = (status: number, error: string) => send(status, { success: false, output: [], diagnostics: [], error, executionTime: 0 });
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return fail(405, 'Use POST to run a program.'); }
    const controller = new AbortController();
    const cancel = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', cancel);
    try {
      if (typeof req.body === 'string' && Buffer.byteLength(req.body) > 250_000) return fail(413, 'Request is too large.');
      let body: any;
      try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return fail(400, 'Invalid JSON request.'); }
      if (!body || typeof body.code !== 'string' || !body.code.trim() || (body.stdin !== undefined && typeof body.stdin !== 'string')) return fail(400, 'Provide program code and input as text.');
      if (Buffer.byteLength(body.code) > 100_000 || Buffer.byteLength(body.stdin ?? '') > 100_000) return fail(413, 'Code and input must each be smaller than 100 KB.');
      const result = await runHosted(language, body.code, body.stdin ?? '', { signal: controller.signal });
      send(result.success ? 200 : 400, result);
    } catch (error) {
      fail(error instanceof CompilerServiceError ? error.status : 500, error instanceof CompilerServiceError ? error.message : 'The compiler service failed.');
    } finally {
      res.off('close', cancel);
    }
  };
}
