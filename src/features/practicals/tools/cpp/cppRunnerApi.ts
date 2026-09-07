import { interpretPracticeAsync, type PracticeCallbacks } from '../shared/practiceInterpreter';
import { runCode } from '../shared/codeRunnerApi';
export type { CodeDiagnostic as CppDiagnostic, CodeRunResult as CppRunResult } from '../shared/codeRunnerApi';

export const runCppCode = async (
  code: string,
  stdin = '',
  signal?: AbortSignal,
  callbacks?: PracticeCallbacks
) => {
  if (signal?.aborted) throw new DOMException('Run cancelled.', 'AbortError');
  const explicitEndpoint = (import.meta as any).env?.VITE_CPP_RUN_API_URL;
  if (explicitEndpoint) {
    return runCode(explicitEndpoint, 'cpp', code, stdin, signal);
  }

  const practiceResult = await interpretPracticeAsync('cpp', code, stdin, signal, callbacks);
  if (practiceResult.success || signal?.aborted) {
    return practiceResult;
  }

  try {
    const apiResult = await runCode('/api/cpp/run', 'cpp', code, stdin, signal);
    if (apiResult.success || (apiResult.output && apiResult.output.length > 0)) {
      return apiResult;
    }
  } catch {
    // API endpoint unavailable, return practice interpreter result
  }

  return practiceResult;
};

