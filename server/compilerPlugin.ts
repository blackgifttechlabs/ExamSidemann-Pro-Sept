import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { compileAndRun } from './localCompiler';

const send = (res: ServerResponse, status: number, body: unknown) => {
  if (res.destroyed) return;
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

export function compilerPlugin(): Plugin {
  let active = 0;
  const install = (server: { middlewares: { use: (handler: any) => void } }) => {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const route = req.url?.split('?')[0].replace(/\/$/, '');
      if (route !== '/api/cpp/run' && route !== '/api/csharp/run') return next();
      const fail = (status: number, error: string) => send(res, status, { success: false, output: [], diagnostics: [], error, executionTime: 0 });
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return fail(405, 'Use POST to run a program.'); }
      if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')) return fail(403, 'Native compilation is only available on this computer. Use a sandboxed compiler service for hosted access.');
      if (active >= 2) return fail(429, 'The compiler is busy. Try again shortly.');
      const controller = new AbortController();
      const cancel = () => { if (!res.writableEnded) controller.abort(); };
      res.on('close', cancel);
      active++;
      try {
        let body = '', bytes = 0;
        for await (const chunk of req) {
          bytes += Buffer.byteLength(chunk);
          if (bytes > 250_000) return fail(413, 'Request is too large.');
          body += chunk.toString();
        }
        let payload: any;
        try { payload = JSON.parse(body); } catch { return fail(400, 'Invalid JSON request.'); }
        if (!payload || typeof payload.code !== 'string' || (payload.stdin !== undefined && typeof payload.stdin !== 'string')) return fail(400, 'Provide code and input as text.');
        const result = await compileAndRun(route.includes('/cpp/') ? 'cpp' : 'csharp', payload.code, payload.stdin ?? '', { signal: controller.signal });
        send(res, result.success ? 200 : 400, result);
      } catch (error) {
        fail(500, error instanceof Error ? error.message : 'The compiler failed.');
      } finally {
        active--;
        res.off('close', cancel);
      }
    });
  };
  return { name: 'local-compilers', configureServer: install, configurePreviewServer: install };
}
