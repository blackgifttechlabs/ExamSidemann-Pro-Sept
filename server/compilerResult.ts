import type { CodeDiagnostic } from '../src/features/practicals/tools/shared/codeRunnerApi';

export function parseDiagnostics(text: string): CodeDiagnostic[] {
  const found: CodeDiagnostic[] = [];
  for (const line of text.split(/\r?\n/)) {
    const cpp = /(?:main|source)\.cpp:(\d+)(?::(\d+))?:\s*(fatal error|error|warning|note):\s*(.*)/i.exec(line);
    const cs = /(?:Program|Main|source)\.cs\((\d+),(\d+)\):\s*(error|warning)\s+([A-Z]+\d+):\s*(.*?)(?:\s+\[[^\]]+\])?$/i.exec(line);
    const unlocated = /(?:^|:\s*)(error|warning)\s+([A-Z]+\d+):\s*(.*?)(?:\s+\[[^\]]+\])?$/i.exec(line);
    if (cpp) found.push({ line: +cpp[1], column: cpp[2] ? +cpp[2] : undefined, severity: cpp[3] === 'note' ? 'info' : cpp[3].includes('error') ? 'error' : 'warning', message: cpp[4] });
    else if (cs) found.push({ line: +cs[1], column: +cs[2], severity: cs[3], code: cs[4], message: cs[5] });
    else if (unlocated) found.push({ severity: unlocated[1], code: unlocated[2], message: unlocated[3] });
  }
  return [...new Map(found.map((item) => [JSON.stringify(item), item])).values()];
}

export function outputLines(text: string) {
  if (!text) return [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

