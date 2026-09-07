import { parseDiagnostics, outputLines } from './compilerResult';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import type { CodeDiagnostic, CodeRunResult } from '../src/features/practicals/tools/shared/codeRunnerApi';

export type Language = 'cpp' | 'csharp';
const MAX_OUTPUT = 1_000_000;

/** Native compilers are for trusted local development, never a public sandbox. */
export function runProcess(command: string, args: string[], options: { cwd?: string; input?: string; timeout?: number; signal?: AbortSignal; env?: NodeJS.ProcessEnv } = {}) {
  return new Promise<{ stdout: string; stderr: string; code: number; signal: NodeJS.Signals | null; timedOut: boolean; outputLimit: boolean }>((resolve) => {
    let stdout = '', stderr = '', bytes = 0, timedOut = false, outputLimit = false, settled = false;
    const env: NodeJS.ProcessEnv = {};
    // Programs should not inherit the application's API keys or credentials.
    for (const key of ['PATH', 'SystemRoot', 'WINDIR', 'TEMP', 'TMP', 'LANG', 'LC_ALL']) {
      if (process.env[key]) env[key] = process.env[key];
    }
    const child = spawn(command, args, { cwd: options.cwd, env: { ...env, ...options.env }, detached: process.platform !== 'win32', stdio: ['pipe', 'pipe', 'pipe'] });
    const kill = () => {
      try {
        if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, 'SIGKILL');
        else child.kill('SIGKILL');
      } catch { /* Process already exited. */ }
    };
    const timer = setTimeout(() => { timedOut = true; kill(); }, options.timeout ?? 20_000);
    const finish = (code: number, signal: NodeJS.Signals | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', kill);
      // Remove any descendants a program left behind after its parent exited.
      kill();
      resolve({ stdout, stderr, code, signal, timedOut, outputLimit });
    };
    const collect = (chunk: string, target: 'stdout' | 'stderr') => {
      const size = Buffer.byteLength(chunk);
      const remaining = Math.max(0, MAX_OUTPUT - bytes);
      const kept = Buffer.from(chunk).subarray(0, remaining).toString('utf8');
      if (target === 'stdout') stdout += kept; else stderr += kept;
      bytes += size;
      if (bytes > MAX_OUTPUT) { outputLimit = true; kill(); }
    };
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => collect(chunk, 'stdout'));
    child.stderr.on('data', (chunk: string) => collect(chunk, 'stderr'));
    child.on('error', (error: NodeJS.ErrnoException) => {
      stderr = error.code === 'ENOENT' ? `The ${command} compiler/runtime is not installed.` : error.message;
      finish(1, null);
    });
    child.on('close', (code, signal) => finish(code ?? 1, signal));
    child.stdin.on('error', () => { /* Programs may exit without consuming all input. */ });
    options.signal?.addEventListener('abort', kill, { once: true });
    if (options.signal?.aborted) kill();
    child.stdin.end(options.input ?? '');
  });
}

export async function compileAndRun(language: Language, code: string, stdin: string, options: { signal?: AbortSignal; runTimeout?: number } = {}): Promise<CodeRunResult> {
  const started = Date.now();
  const fail = (error: string, diagnostics: CodeDiagnostic[] = []): CodeRunResult => ({ success: false, output: [], error, diagnostics, executionTime: Date.now() - started });
  if (!code.trim()) return fail('Enter a program before running.');
  if (Buffer.byteLength(code) > 100_000 || Buffer.byteLength(stdin) > 100_000) return fail('Code and input must each be smaller than 100 KB.');
  const directory = await mkdtemp(path.join(os.tmpdir(), `examsidemann-${language}-`));
  try {
    let command: string, args: string[], build: Awaited<ReturnType<typeof runProcess>>;
    const shared = { cwd: directory, signal: options.signal, timeout: 30_000 };
    const dotnetEnv = { DOTNET_CLI_HOME: directory, HOME: directory, DOTNET_NOLOGO: '1', DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1' };
    if (language === 'cpp') {
      const candidates = process.env.CPP_COMPILER ? [process.env.CPP_COMPILER] : ['g++', 'clang++'];
      let compiler: string | undefined;
      for (const candidate of candidates) {
        const probe = await runProcess(candidate, ['--version'], { ...shared, timeout: 5_000 });
        if (probe.code === 0) { compiler = candidate; break; }
      }
      if (!compiler) return fail('Install g++ or clang++ to run C++ locally, then restart the development server.');
      await writeFile(path.join(directory, 'main.cpp'), code);
      command = path.join(directory, process.platform === 'win32' ? 'main.exe' : 'main');
      args = [];
      build = await runProcess(compiler, ['-std=c++17', '-O0', '-Wall', '-Wextra', '-pthread', 'main.cpp', '-o', command], shared);
    } else {
      const sdk = await runProcess('dotnet', ['--list-sdks'], { ...shared, env: dotnetEnv, timeout: 5_000 });
      const majors = [...sdk.stdout.matchAll(/^(\d+)\.\d+\.\d+/gm)].map((match) => Number(match[1])).filter((major) => major >= 8);
      if (sdk.code !== 0 || !majors.length) return fail('Install the .NET SDK 8 or newer to run C# locally, then restart the development server.');
      const target = `net${Math.max(...majors)}.0`;
      await writeFile(path.join(directory, 'Runner.csproj'), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>${target}</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>disable</Nullable><UseAppHost>false</UseAppHost></PropertyGroup></Project>`);
      await writeFile(path.join(directory, 'NuGet.Config'), '<configuration><packageSources><clear /></packageSources></configuration>');
      // Compile the actual source: regex rewrites can corrupt strings and ReadKey expressions.
      await writeFile(path.join(directory, 'Program.cs'), code);
      build = await runProcess('dotnet', ['build', 'Runner.csproj', '-c', 'Release', '-o', 'out', '--nologo', '-v:q', '-p:UseSharedCompilation=false'], { ...shared, env: dotnetEnv });
      command = 'dotnet';
      args = ['exec', path.join(directory, 'out', 'Runner.dll')];
    }
    const diagnostics = parseDiagnostics(`${build.stdout}\n${build.stderr}`);
    if (build.timedOut) return fail('Compilation timed out after 30 seconds.', diagnostics);
    if (build.outputLimit) return fail('Compiler output exceeded the 1 MB limit.', diagnostics);
    if (build.code !== 0) return fail(diagnostics.filter((item) => item.severity === 'error').map((item) => item.message).join('\n') || build.stderr.trim() || build.stdout.trim() || 'Compilation failed.', diagnostics);
    if (options.signal?.aborted) return fail('Execution cancelled.');
    const run = await runProcess(command, args, { ...shared, input: stdin, env: language === 'csharp' ? dotnetEnv : undefined, timeout: options.runTimeout ?? 20_000 });
    const error = run.timedOut ? 'Execution timed out. Check for an infinite loop or missing input.'
      : run.outputLimit ? 'Program output exceeded the 1 MB limit.'
      : run.signal ? `Program terminated (${run.signal}).${run.signal === 'SIGSEGV' ? ' Check array bounds and pointers.' : ''}`
      : run.code !== 0 ? run.stderr.trim() || `Program exited with status ${run.code}.` : undefined;
    return { success: !error, output: outputLines(run.stdout), stderr: run.stderr, diagnostics, error, executionTime: Date.now() - started };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
