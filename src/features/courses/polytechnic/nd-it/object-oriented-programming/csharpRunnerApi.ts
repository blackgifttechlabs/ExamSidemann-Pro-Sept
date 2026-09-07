import { runBrowserCSharp, type BrowserCSharpCallbacks } from './browserCSharpRunner';
import { runCode } from '@/features/practicals/tools/shared/codeRunnerApi';
export type { CodeDiagnostic as CSharpDiagnostic, CodeRunResult as CSharpRunResult } from '@/features/practicals/tools/shared/codeRunnerApi';

export const runCSharpCode = async (code: string, stdin = '', signal?: AbortSignal, callbacks?: BrowserCSharpCallbacks) => {
  if (signal?.aborted) throw new DOMException('Run cancelled.', 'AbortError');
  const endpoint = (import.meta as any).env?.VITE_CSHARP_RUN_API_URL;
  return endpoint ? runCode(endpoint, 'csharp', code, stdin, signal) : runBrowserCSharp(code, stdin, signal, callbacks);
};
