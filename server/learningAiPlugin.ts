import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export function learningAiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'learning-ai-api',
    configureServer(server) {
      // Vite's loadEnv gives inherited shell variables priority over .env.local.
      // For local development, use the key configured for this project.
      let localKey = '';
      try {
        const contents = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
        const match = contents.match(/^\s*GROQ_API_KEY\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|([^\r\n#]*))/m);
        localKey = (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim();
      } catch {
        // Fall back to the inherited environment when no local file exists.
      }
      if (localKey || env.GROQ_API_KEY) process.env.GROQ_API_KEY = localKey || env.GROQ_API_KEY;
      server.middlewares.use(async (req, res, next) => {
        const route = req.url?.split('?')[0].replace(/\/$/, '');
        if (route !== '/api/ai/check-code' && route !== '/api/ai/chat') return next();
        try {
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (Buffer.byteLength(body) > 50_000) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'Request too large.' }));
              return;
            }
          }
          (req as any).body = body;
          (req as any).query = { action: route.split('/').pop() };
          const { default: handler } = await import('./learningAi');
          await handler(req, res);
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'The AI checker is unavailable.' }));
        }
      });
    },
  };
}
