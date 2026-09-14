import type { Plugin } from 'vite';
export function accountAutomationPlugin(env: Record<string, string>): Plugin {
  return { name: 'account-automation-api', configureServer(server) {
    for (const key of ['FIREBASE_SERVICE_ACCOUNT_JSON', 'FIREBASE_SECONDARY_SERVICE_ACCOUNT_JSON', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM_NAME', 'SITE_URL', 'CRON_SECRET']) {
      if (env[key] && !process.env[key]) process.env[key] = env[key];
    }
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.split('?')[0].replace(/\/$/, '') !== '/api/account-automation') return next();
      try {
        if (req.method === 'POST') {
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (Buffer.byteLength(body) > 20_000) { res.statusCode = 413; res.end(JSON.stringify({ error: 'Request too large.' })); return; }
          }
          (req as any).body = body;
        }
        const { default: handler } = await import('../api/account-automation');
        await handler(req, res);
      } catch { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'Account automation unavailable.' })); }
    });
  } };
}
