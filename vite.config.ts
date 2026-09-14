import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { accountAutomationPlugin } from './server/accountAutomationPlugin';
import { compilerPlugin } from './server/compilerPlugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const requestedDevPort = Number(env.VITE_DEV_PORT);
    const devPort =
      Number.isInteger(requestedDevPort) &&
      requestedDevPort > 0 &&
      requestedDevPort <= 65_535
        ? requestedDevPort
        : 5173;

    return {
      server: {
        // Keep the printed URL stable. Without strictPort, Vite silently moves to
        // 3001, 3002, etc. when another service or a stale dev server owns the
        // configured port, leaving bookmarks and forwarded links pointing at the
        // wrong process.
        host: env.VITE_DEV_HOST || '0.0.0.0',
        port: devPort,
        strictPort: true,
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'credentialless',
        },
      },
      preview: {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'credentialless',
        },
      },
      plugins: [accountAutomationPlugin(env), compilerPlugin(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve('src'),
        }
      }
    };
});
