export interface CppDiagnostic {
  line?: number;
  column?: number;
  code?: string;
  message: string;
  severity?: 'error' | 'warning' | string;
}

export interface CppRunResult {
  success: boolean;
  output: string[];
  error?: string;
  diagnostics?: CppDiagnostic[];
  executionTime: number;
}

const normaliseLines = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((line) => String(line));
  if (typeof value === 'string') return value ? value.split(/\r?\n/) : [];
  return [];
};

const normaliseDiagnostics = (value: unknown): CppDiagnostic[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item): CppDiagnostic | null => {
      if (!item || typeof item !== 'object') return null;
      const diagnostic = item as Record<string, unknown>;
      const message = diagnostic.message ?? diagnostic.text ?? diagnostic.error;
      if (!message) return null;
      return {
        line: typeof diagnostic.line === 'number' ? diagnostic.line : undefined,
        column: typeof diagnostic.column === 'number' ? diagnostic.column : undefined,
        code: diagnostic.code ? String(diagnostic.code) : undefined,
        message: String(message),
        severity: diagnostic.severity ? String(diagnostic.severity) : undefined,
      };
    })
    .filter((item): item is CppDiagnostic => Boolean(item));
};

const buildErrorText = (diagnostics: CppDiagnostic[], fallback?: string) => {
  if (diagnostics.length > 0) {
    return diagnostics
      .map((diagnostic) => {
        const location =
          diagnostic.line !== undefined
            ? `line ${diagnostic.line}${diagnostic.column !== undefined ? `, column ${diagnostic.column}` : ''}`
            : 'unknown location';
        const code = diagnostic.code ? `${diagnostic.code}: ` : '';
        return `${location}: ${code}${diagnostic.message}`;
      })
      .join('\n');
  }

  return fallback || 'C++ execution failed. The compiler service did not return details.';
};

/**
 * Posts the student's translation unit to the compile-and-run endpoint. In dev
 * that is the Vite middleware in vite.config.ts (system g++/clang++); a hosted
 * deployment points VITE_CPP_RUN_API_URL at an equivalent service.
 */
export const runCppCode = async (code: string, stdin = ''): Promise<CppRunResult> => {
  const endpoint = (import.meta as any).env?.VITE_CPP_RUN_API_URL || '/api/cpp/run';
  const startedAt = performance.now();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: 'cpp',
      code,
      stdin,
    }),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    const text = await response.text().catch(() => '');
    payload = { success: false, error: text || response.statusText };
  }

  const diagnostics = normaliseDiagnostics(payload?.diagnostics ?? payload?.errors);
  const success = Boolean(payload?.success ?? payload?.status === 'success') && diagnostics.length === 0;
  const output = normaliseLines(payload?.output ?? payload?.stdout);
  const stderr = normaliseLines(payload?.stderr);
  const executionTime = Number(
    payload?.executionTime ?? payload?.timeMs ?? Math.round(performance.now() - startedAt)
  );

  if (!response.ok) {
    return {
      success: false,
      output,
      diagnostics,
      error: buildErrorText(diagnostics, payload?.error || payload?.message || response.statusText),
      executionTime,
    };
  }

  if (!success) {
    return {
      success: false,
      output,
      diagnostics,
      error: buildErrorText(diagnostics, payload?.error || payload?.message || stderr.join('\n')),
      executionTime,
    };
  }

  return {
    success: true,
    output,
    diagnostics,
    executionTime,
  };
};
