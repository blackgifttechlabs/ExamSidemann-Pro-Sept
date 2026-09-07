import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execFile } from 'child_process';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import os from 'os';

const runProcess = (
  command: string,
  args: string[],
  options: {
    cwd?: string;
    input?: string;
    timeout?: number;
    env?: NodeJS.ProcessEnv;
  } = {}
) =>
  new Promise<{
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    timedOut: boolean;
  }>((resolve) => {
    let settled = false;
    let killTimer: NodeJS.Timeout | null = null;

    const child = execFile(
      command,
      args,
      {
        cwd: options.cwd,
        maxBuffer: 1024 * 1024 * 20,
        env: {
          ...process.env,
          ...options.env,
        },
        // Run the compiler/runtime (and anything it spawns) in its own process
        // group so we can kill the whole tree, not just the top-level process.
        // (cast to any: `detached` is valid at runtime but missing from ExecFileOptions' TS types)
        detached: process.platform !== 'win32',
      } as any,
      (error: any, stdout: string, stderr: string) => {
        if (settled) return;
        settled = true;
        if (killTimer) clearTimeout(killTimer);
        const timedOut = Boolean((error as any)?.killed);
        const code =
          typeof (error as any)?.code === 'number' ? (error as any).code : error ? 1 : 0;
        const signal = (error as any)?.signal ?? null;
        resolve({ stdout, stderr, code, signal, timedOut });
      }
    );

    killTimer = setTimeout(() => {
      if (settled) return;
      try {
        if (process.platform !== 'win32' && child.pid) {
          process.kill(-child.pid, 'SIGKILL'); // negative pid = whole process group
        } else {
          child.kill('SIGKILL');
        }
      } catch {
        child.kill('SIGKILL');
      }
    }, options.timeout ?? 20000);

    if (options.input) {
      child.stdin?.write(options.input);
    }
    child.stdin?.end();
  });

const runDotnet = (
  args: string[],
  options: { cwd?: string; input?: string; timeout?: number } = {}
) =>
  runProcess('dotnet', args, {
    ...options,
    env: {
      DOTNET_CLI_TELEMETRY_OPTOUT: '1',
      DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1',
    },
  });

const sendJson = (res: any, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const readJsonBody = (req: any) =>
  new Promise<any>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (body.length > 200_000) {
        reject(new Error('Request body too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });
    req.on('error', reject);
  });

const parseCSharpDiagnostics = (text: string, fallbackText = '') => {
  const diagnostics: Array<{
    line?: number;
    column?: number;
    code?: string;
    severity: string;
    message: string;
  }> = [];
  const locatedPattern =
    /(?:^|\s)(?:[^\s:]+\/)?Program\.cs\((\d+),(\d+)\):\s+(error|warning)\s+([A-Z]+[0-9]+):\s+(.+?)(?:\s+\[[^\]]+\])?$/i;
  // Catches diagnostics with no file/line reference, e.g.
  // "error CS5001: Program does not contain a static 'Main' method..."
  const unlocatedPattern = /^(error|warning)\s+([A-Z]+[0-9]+):\s+(.+?)(?:\s+\[[^\]]+\])?$/i;

  for (const line of text.split(/\r?\n/)) {
    const located = locatedPattern.exec(line);
    locatedPattern.lastIndex = 0;
    if (located) {
      diagnostics.push({
        line: Number(located[1]),
        column: Number(located[2]),
        severity: located[3],
        code: located[4],
        message: located[5].trim(),
      });
      continue;
    }
    const unlocated = unlocatedPattern.exec(line.trim());
    if (unlocated) {
      diagnostics.push({
        severity: unlocated[1],
        code: unlocated[2],
        message: unlocated[3].trim(),
      });
    }
  }

  const fallback = fallbackText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => !line.startsWith('The build failed.'));

  if (diagnostics.length === 0 && fallback) {
    const runtimeLineMatch = fallbackText.match(/Program\.Main\(\)\s+in\s+.*Program\.cs:line\s+(\d+)/);
    diagnostics.push({
      severity: 'error',
      line: runtimeLineMatch ? Number(runtimeLineMatch[1]) : undefined,
      message: fallback,
    });
  }

  return diagnostics;
};

const csharpRunApiPlugin = () => ({
  name: 'csharp-run-api',
  configureServer(server: any) {
    server.middlewares.use('/api/csharp/run', async (req: any, res: any) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { success: false, error: 'Method not allowed.' });
        return;
      }

      const startedAt = Date.now();
      let tempDir = '';

      try {
        const body = await readJsonBody(req);
        const code = String(body.code || '');
        const stdin = String(body.stdin || '');

        if (!code.trim()) {
          sendJson(res, 400, {
            success: false,
            error: 'No C# code was provided.',
            diagnostics: [{ severity: 'error', message: 'No C# code was provided.' }],
            output: [],
            executionTime: 0,
          });
          return;
        }

        tempDir = await mkdtemp(path.join(os.tmpdir(), 'examsidemann-csharp-'));
        await writeFile(
          path.join(tempDir, 'Runner.csproj'),
          `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>disable</Nullable>
  </PropertyGroup>
</Project>
`,
          'utf8'
        );

        const runnableCode = code.replace(/Console\.ReadKey\s*\([^)]*\)\s*;/g, '');
        await writeFile(path.join(tempDir, 'Program.cs'), runnableCode, 'utf8');

        // Step 1: build only. This can never hang on user-code infinite loops (those
        // only run once the compiled program actually executes), so it gets its own
        // short timeout and no special process-group handling is needed.
        const buildResult = await runDotnet(
          ['build', 'Runner.csproj', '-c', 'Release', '-o', 'out', '--nologo'],
          { cwd: tempDir, timeout: 30000 }
        );

        if (buildResult.code !== 0 || buildResult.timedOut) {
          const buildDiagnostics = buildResult.timedOut
            ? [{ severity: 'error', message: 'Build timed out after 30 seconds.' }]
            : parseCSharpDiagnostics(`${buildResult.stdout}\n${buildResult.stderr}`, buildResult.stderr);

          sendJson(res, 400, {
            success: false,
            output: [],
            stderr: buildResult.stderr,
            diagnostics: buildDiagnostics,
            error: buildDiagnostics.map((item) => item.message).join('\n'),
            executionTime: Date.now() - startedAt,
          });
          return;
        }

        // Step 2: run the compiled DLL directly, NOT via `dotnet run`.
        // `dotnet run` spawns the real user program as a child in its own process
        // group (for its own signal forwarding), so killing the wrapper on timeout
        // doesn't reliably kill the real program. Running the DLL directly means the
        // process we spawn IS the user's program, so our timeout kill actually works.
        const runResult = await runDotnet(['exec', path.join('out', 'Runner.dll')], {
          cwd: tempDir,
          input: stdin,
          timeout: 20000,
        });

        const diagnostics = runResult.timedOut
          ? [{
              severity: 'error',
              message:
                'Execution timed out after 20 seconds. Check for an infinite loop or a Console.ReadLine() waiting for input that never arrives.',
            }]
          : parseCSharpDiagnostics(`${runResult.stdout}\n${runResult.stderr}`, runResult.stderr);
        const success =
          !runResult.timedOut &&
          runResult.code === 0 &&
          diagnostics.every((item) => item.severity !== 'error');
        const output = runResult.stdout
          ? runResult.stdout
              .replace(/\r\n/g, '\n')
              .split('\n')
              .filter((line) => success || !/Program\.cs\(\d+,\d+\):\s+(error|warning)\s+/i.test(line))
              .filter((line) => line && !line.startsWith('The build failed.'))
          : [];

        sendJson(res, success ? 200 : 400, {
          success,
          output,
          stderr: runResult.stderr,
          diagnostics: success ? [] : diagnostics,
          error: success ? undefined : diagnostics.map((item) => item.message).join('\n'),
          executionTime: Date.now() - startedAt,
        });
      } catch (error: any) {
        sendJson(res, 500, {
          success: false,
          output: [],
          error: error.message || String(error),
          diagnostics: [{ severity: 'error', message: error.message || String(error) }],
          executionTime: Date.now() - startedAt,
        });
      } finally {
        if (tempDir) {
          await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
        }
      }
    });
  },
});

/**
 * g++/clang++ write diagnostics as `main.cpp:12:5: error: message`. Linker
 * failures (undefined reference to ...) carry no line at all, so those are kept
 * as unlocated entries rather than dropped.
 */
const parseCppDiagnostics = (text: string, fallbackText = '') => {
  const diagnostics: Array<{
    line?: number;
    column?: number;
    code?: string;
    severity: string;
    message: string;
  }> = [];
  const locatedPattern =
    /(?:^|\s)(?:[^\s:]*\/)?main\.cpp:(\d+)(?::(\d+))?:\s+(error|warning|fatal error):\s+(.+)$/i;
  const linkerPattern = /(undefined reference to .+|ld returned \d+ exit status|collect2:.*)$/i;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const located = locatedPattern.exec(line);
    if (located) {
      diagnostics.push({
        line: Number(located[1]),
        column: located[2] ? Number(located[2]) : undefined,
        severity: located[3].toLowerCase().includes('error') ? 'error' : 'warning',
        message: located[4].trim(),
      });
      continue;
    }
    const linker = linkerPattern.exec(line);
    if (linker) {
      diagnostics.push({ severity: 'error', message: linker[1].trim() });
    }
  }

  const fallback = fallbackText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => !/^\s*(In file included from|\s*\^|\s*\||~+)/.test(line));

  if (diagnostics.length === 0 && fallback) {
    diagnostics.push({ severity: 'error', message: fallback });
  }

  return diagnostics;
};

let resolvedCppCompiler: string | null | undefined;

const resolveCppCompiler = async () => {
  if (resolvedCppCompiler !== undefined) return resolvedCppCompiler;
  for (const candidate of [process.env.CPP_COMPILER, 'g++', 'clang++'].filter(
    Boolean
  ) as string[]) {
    const probe = await runProcess(candidate, ['--version'], { timeout: 8000 });
    if (probe.code === 0) {
      resolvedCppCompiler = candidate;
      return resolvedCppCompiler;
    }
  }
  resolvedCppCompiler = null;
  return resolvedCppCompiler;
};

/**
 * Dev-server counterpart of the C# runner: compiles the student's single
 * translation unit with the system g++/clang++ and executes the binary with
 * their console input piped in.
 */
const cppRunApiPlugin = () => ({
  name: 'cpp-run-api',
  configureServer(server: any) {
    server.middlewares.use('/api/cpp/run', async (req: any, res: any) => {
      if (req.method !== 'POST') {
        sendJson(res, 405, { success: false, error: 'Method not allowed.' });
        return;
      }

      const startedAt = Date.now();
      let tempDir = '';

      try {
        const body = await readJsonBody(req);
        const code = String(body.code || '');
        const stdin = String(body.stdin || '');

        if (!code.trim()) {
          sendJson(res, 400, {
            success: false,
            error: 'No C++ code was provided.',
            diagnostics: [{ severity: 'error', message: 'No C++ code was provided.' }],
            output: [],
            executionTime: 0,
          });
          return;
        }

        const compiler = await resolveCppCompiler();
        if (!compiler) {
          const message =
            'No C++ compiler found on this machine. Install g++ (build-essential) or clang++, then restart the dev server.';
          sendJson(res, 500, {
            success: false,
            output: [],
            error: message,
            diagnostics: [{ severity: 'error', message }],
            executionTime: Date.now() - startedAt,
          });
          return;
        }

        tempDir = await mkdtemp(path.join(os.tmpdir(), 'examsidemann-cpp-'));
        await writeFile(path.join(tempDir, 'main.cpp'), code, 'utf8');

        const binaryName = process.platform === 'win32' ? 'main.exe' : 'main';
        const buildResult = await runProcess(
          compiler,
          ['-std=c++17', '-O0', '-pipe', 'main.cpp', '-o', binaryName],
          { cwd: tempDir, timeout: 30000 }
        );

        if (buildResult.code !== 0 || buildResult.timedOut) {
          const buildDiagnostics = buildResult.timedOut
            ? [{ severity: 'error', message: 'Compilation timed out after 30 seconds.' }]
            : parseCppDiagnostics(
                `${buildResult.stdout}\n${buildResult.stderr}`,
                buildResult.stderr
              );

          sendJson(res, 400, {
            success: false,
            output: [],
            stderr: buildResult.stderr,
            diagnostics: buildDiagnostics.filter((item) => item.severity === 'error'),
            error: buildDiagnostics.map((item) => item.message).join('\n'),
            executionTime: Date.now() - startedAt,
          });
          return;
        }

        const runResult = await runProcess(path.join(tempDir, binaryName), [], {
          cwd: tempDir,
          input: stdin,
          timeout: 20000,
        });

        let diagnostics: Array<{ severity: string; line?: number; message: string }> = [];
        if (runResult.timedOut) {
          diagnostics = [
            {
              severity: 'error',
              message:
                'Execution timed out after 20 seconds. Check for an infinite loop or a cin that is waiting for input that never arrives.',
            },
          ];
        } else if (runResult.signal) {
          diagnostics = [
            {
              severity: 'error',
              message:
                runResult.signal === 'SIGSEGV'
                  ? 'The program crashed with a segmentation fault (SIGSEGV). This usually means a bad pointer, an out-of-range index, or infinite recursion.'
                  : `The program was terminated by signal ${runResult.signal}.`,
            },
          ];
        } else if (runResult.code !== 0) {
          const stderrText = runResult.stderr.trim();
          diagnostics = [
            {
              severity: 'error',
              message: stderrText
                ? stderrText
                : `The program exited with a non-zero status code (${runResult.code}).`,
            },
          ];
        }

        const success = diagnostics.length === 0;
        const output = runResult.stdout
          ? runResult.stdout.replace(/\r\n/g, '\n').split('\n')
          : [];
        // A trailing newline on the last cout would otherwise print an empty row.
        if (output.length > 0 && output[output.length - 1] === '') output.pop();

        sendJson(res, success ? 200 : 400, {
          success,
          output,
          stderr: runResult.stderr,
          diagnostics,
          error: success ? undefined : diagnostics.map((item) => item.message).join('\n'),
          executionTime: Date.now() - startedAt,
        });
      } catch (error: any) {
        sendJson(res, 500, {
          success: false,
          output: [],
          error: error.message || String(error),
          diagnostics: [{ severity: 'error', message: error.message || String(error) }],
          executionTime: Date.now() - startedAt,
        });
      } finally {
        if (tempDir) {
          await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
        }
      }
    });
  },
});

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
      plugins: [csharpRunApiPlugin(), cppRunApiPlugin(), react()],
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
