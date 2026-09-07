import React from 'react';

const KEYWORDS = new Set([
  'break',
  'case',
  'class',
  'const',
  'continue',
  'default',
  'delete',
  'do',
  'else',
  'for',
  'if',
  'namespace',
  'new',
  'private',
  'protected',
  'public',
  'return',
  'sizeof',
  'struct',
  'switch',
  'this',
  'using',
  'while',
]);

const TYPES = new Set([
  'bool',
  'char',
  'double',
  'float',
  'int',
  'long',
  'short',
  'string',
  'void',
]);

const BUILT_INS = new Set([
  'cin',
  'cout',
  'endl',
  'false',
  'ifstream',
  'iostream',
  'ofstream',
  'std',
  'true',
]);

const TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|==|!=|<=|>=|&&|\|\||<<|>>|\+\+|--|[{}[\]();,.*&=+\-/%<>:])/g;

const tokenClassName = (token: string, nextText: string) => {
  if (/^["']/.test(token)) return 'text-amber-300';
  if (/^\d/.test(token)) return 'text-lime-300';
  if (KEYWORDS.has(token)) return 'text-fuchsia-300';
  if (TYPES.has(token)) return 'text-cyan-300';
  if (BUILT_INS.has(token)) return 'text-sky-300';
  if (/^[{}[\]();,.*&=+\-/%<>:|!]+$/.test(token)) return 'text-slate-300';
  if (/^\s*\(/.test(nextText)) return 'text-yellow-200';
  return 'text-slate-100';
};

const highlightCodePart = (code: string, keyPrefix: string) => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }

    const token = match[0];
    const nextText = code.slice(TOKEN_PATTERN.lastIndex);
    nodes.push(
      <span key={`${keyPrefix}-${match.index}`} className={tokenClassName(token, nextText)}>
        {token}
      </span>
    );
    lastIndex = TOKEN_PATTERN.lastIndex;
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }

  return nodes;
};

const highlightLine = (line: string, lineIndex: number) => {
  const trimmed = line.trimStart();
  if (trimmed.startsWith('#')) {
    const leadingSpace = line.slice(0, line.length - trimmed.length);
    return (
      <>
        {leadingSpace}
        <span className="text-rose-300">{trimmed}</span>
      </>
    );
  }

  const commentIndex = line.indexOf('//');
  if (commentIndex >= 0) {
    return (
      <>
        {highlightCodePart(line.slice(0, commentIndex), `${lineIndex}-code`)}
        <span className="text-emerald-400">{line.slice(commentIndex)}</span>
      </>
    );
  }

  return highlightCodePart(line, `${lineIndex}-code`);
};

export const HighlightedCode: React.FC<{ code: string }> = ({ code }) => (
  <>
    {code.split('\n').map((line, lineIndex, lines) => (
      <React.Fragment key={lineIndex}>
        {highlightLine(line, lineIndex)}
        {lineIndex < lines.length - 1 ? '\n' : null}
      </React.Fragment>
    ))}
  </>
);
