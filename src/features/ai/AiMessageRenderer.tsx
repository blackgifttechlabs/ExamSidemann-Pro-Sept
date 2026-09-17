import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MathJax } from 'better-react-mathjax';
import { Check, Copy, Play } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const aiMathJaxConfig = {
  loader: { load: ['[tex]/html', '[tex]/mhchem'] },
  tex: {
    packages: { '[+]': ['html', 'mhchem'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
  },
};

interface MathEntry {
  type: 'block' | 'inline';
  tex: string;
}

interface ProcessedContent {
  markdown: string;
  mathMap: Map<string, MathEntry>;
}

/**
 * Fallback boundary for individual math formulas so a malformed formula
 * never crashes or corrupts the chat interface.
 */
class MathErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackText: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('MathJax fallback for formula:', this.props.fallbackText, error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <code className="rounded bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:text-slate-300">
          {this.props.fallbackText}
        </code>
      );
    }
    return this.props.children;
  }
}

/**
 * Auto-closes unclosed markdown and math tokens during active streaming
 * so the renderer never undergoes jarring layout tweaks / collapses.
 */
const autoCloseStreamingTokens = (text: string): string => {
  let patched = text;

  // Auto-close unclosed code block fences (odd number of ```)
  const codeBlockMatches = patched.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    patched += '\n```';
  }

  // Auto-close unclosed block math ($$)
  const blockMathMatches = patched.match(/\$\$/g);
  if (blockMathMatches && blockMathMatches.length % 2 !== 0) {
    patched += '\n$$';
  }

  // Auto-close unclosed bold (** text)
  const boldMatches = patched.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    patched += '**';
  }

  return patched;
};

/**
 * Normalizes all AI LaTeX variants and extracts math safely into placeholders
 * so ReactMarkdown never mangles subscripts (_), asterisks (*), backslashes (\\),
 * or chemistry formulas.
 */
export const prepareMarkdownAndMath = (raw: string, isStreaming = false): ProcessedContent => {
  if (!raw) return { markdown: '', mathMap: new Map() };

  let text = raw
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ');

  if (isStreaming) {
    text = autoCloseStreamingTokens(text);
  }

  // 1. Protect existing code blocks so their contents aren't mistaken for math
  const codeBlocks: string[] = [];
  text = text.replace(/(```[\s\S]*?```|`[^`\n]+?`)/g, (match) => {
    const placeholder = `%%CODE_SNIPPET_${codeBlocks.length}%%`;
    codeBlocks.push(match);
    return placeholder;
  });

  // 1b. Protect currency values (e.g. $9354, $1,000, $50.00, $ 9354) so dollar signs aren't mistaken for math delimiters
  const currencyBlocks: string[] = [];
  text = text.replace(/\$\s?(\d[\d,.]*(?:\s?(?:USD|ZWL|ZiG|dollars?|cents?))?)/gi, (match) => {
    const placeholder = `%%CURRENCY_SNIPPET_${currencyBlocks.length}%%`;
    currencyBlocks.push(match);
    return placeholder;
  });

  // 2. Normalize LaTeX block notation: \[ ... \] -> $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, p1) => `\n\n$$\n${p1.trim()}\n$$\n\n`);

  // 3. Normalize LaTeX inline notation: \( ... \) -> $ ... $
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, p1) => ` $${p1.trim()}$ `);

  // 4. Normalize standalone LaTeX environments into $$ ... $$
  text = text.replace(
    /\\begin\{(equation|align\*?|aligned|gather\*?|cases|matrix|pmatrix|bmatrix|vmatrix)\}([\s\S]*?)\\end\{\1\}/g,
    (match) => `\n\n$$\n${match.trim()}\n$$\n\n`,
  );

  // 5. Normalize bare bracketed formulas: [ \text{...} ] or [ F = ma ] or [ 6CO_2 ... ]
  // Avoid markdown links like [text](url) and checkboxes like [ ] or [x]
  text = text.replace(
    /(?:^|\n|\s)\[\s*([\s\S]*?)\s*\](?!\()/g,
    (match, inner) => {
      const clean = inner.trim();
      if (!clean || clean === 'x' || clean === 'X') return match;

      const hasMathIndicators =
        /\\[a-zA-Z]+/.test(clean) ||
        /[=^_{}]/.test(clean) ||
        /[+*/<>≥≤±→↔]/.test(clean) ||
        /(?:^|\s)-|\b[a-zA-Z]\s*-\s*[a-zA-Z0-9]/.test(clean);

      if (hasMathIndicators) {
        return `\n\n$$\n${clean}\n$$\n\n`;
      }
      return match;
    },
  );

  const mathMap = new Map<string, MathEntry>();

  // 6. Extract Block Math ($$ ... $$) into placeholders
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    const trimmed = formula.trim();
    if (!trimmed) return '';
    const key = `%%MATH_BLOCK_${mathMap.size}%%`;
    mathMap.set(key, { type: 'block', tex: trimmed });
    return `\n\n${key}\n\n`;
  });

  // 7. Extract Inline Math ($ ... $) into placeholders
  // Must avoid currency like $50 or $10.50:
  // Math must not be followed immediately by a digit, and must have non-space boundaries
  text = text.replace(
    /(^|[^\\$])\$([^\$\s\d](?:[^$\n]*?[^\$\s])?)\$(?!\d)/g,
    (match, prefix, formula) => {
      const trimmed = formula.trim();
      if (!trimmed) return match;
      const key = `%%MATH_INLINE_${mathMap.size}%%`;
      mathMap.set(key, { type: 'inline', tex: trimmed });
      return `${prefix}${key}`;
    },
  );

  // 8. Restore protected currency values and code blocks
  text = text.replace(/%%CURRENCY_SNIPPET_(\d+)%%/g, (match, idx) => {
    return currencyBlocks[Number(idx)] ?? match;
  });

  text = text.replace(/%%CODE_SNIPPET_(\d+)%%/g, (match, idx) => {
    return codeBlocks[Number(idx)] ?? match;
  });

  return { markdown: text, mathMap };
};

/**
 * Replaces math placeholder tokens in React child nodes with safe MathJax elements
 */
const renderWithMath = (
  content: React.ReactNode,
  mathMap: Map<string, MathEntry>,
): React.ReactNode => {
  if (typeof content === 'string') {
    if (!content.includes('%%MATH_')) return content;
    const parts = content.split(/(%%MATH_(?:BLOCK|INLINE)_\d+%%)/g);
    return parts.map((part, idx) => {
      const mathItem = mathMap.get(part);
      if (!mathItem) {
        if (part.startsWith('%%MATH_')) return null;
        return part;
      }

      if (mathItem.type === 'block') {
        return (
          <span
            key={`math-block-${idx}`}
            className="my-3 block max-w-full overflow-x-auto py-1 text-center font-normal leading-relaxed [&_mjx-container]:!my-0"
          >
            <MathErrorBoundary fallbackText={mathItem.tex}>
              <MathJax>{`$$${mathItem.tex}$$`}</MathJax>
            </MathErrorBoundary>
          </span>
        );
      }

      return (
        <span
          key={`math-inline-${idx}`}
          className="inline-block whitespace-nowrap align-baseline px-0.5 font-normal [&_mjx-container]:!inline-block [&_mjx-container]:!my-0"
        >
          <MathErrorBoundary fallbackText={mathItem.tex}>
            <MathJax inline>{`$${mathItem.tex}$`}</MathJax>
          </MathErrorBoundary>
        </span>
      );
    });
  }

  if (Array.isArray(content)) {
    return content.map((child, idx) => (
      <React.Fragment key={idx}>{renderWithMath(child, mathMap)}</React.Fragment>
    ));
  }

  if (React.isValidElement(content) && content.props && (content.props as any).children) {
    return React.cloneElement(content as React.ReactElement<any>, {
      ...(content.props as any),
      children: renderWithMath((content.props as any).children, mathMap),
    });
  }

  return content;
};

export interface AiMessageRendererProps {
  content: string;
  isStreaming?: boolean;
  onRunCode?: (code: string, language?: string) => void;
  CodeCanvasComponent?: React.ComponentType<{
    code: string;
    language?: string;
    onRun?: (code: string, language?: string) => void;
  }>;
}

/**
 * Standard Code Block Fallback if custom CodeCanvas is not provided
 */
const DefaultCodeBlock: React.FC<{
  code: string;
  language?: string;
  onRun?: (code: string, language?: string) => void;
}> = ({ code, language, onRun }) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <div className="not-prose my-3.5 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-[#0d1117] shadow-xs">
      <div className="flex h-9 items-center justify-between px-4 pt-1 border-b border-white/10 bg-white/[0.03]">
        <span className="font-mono text-xs font-semibold text-slate-400">
          {(language || 'code').toLowerCase()}
        </span>
        <div className="flex items-center gap-2">
          {onRun && (
            <button
              type="button"
              onClick={() => onRun(code, language)}
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-950/40 transition"
              title="Run code"
            >
              <Play size={10} className="fill-current" />
              <span>Run</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-slate-200 transition"
          >
            {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className="max-h-[500px] overflow-x-auto text-[13px] font-mono leading-6">
        <SyntaxHighlighter
          language={(language || 'text').toLowerCase()}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const AiMessageRenderer: React.FC<AiMessageRendererProps> = ({
  content,
  isStreaming = false,
  onRunCode,
  CodeCanvasComponent,
}) => {
  const { markdown, mathMap } = useMemo(
    () => prepareMarkdownAndMath(content, isStreaming),
    [content, isStreaming],
  );

  const CodeRenderer = CodeCanvasComponent || DefaultCodeBlock;

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-[14.5px] leading-7 font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ node, children, ...props }) => (
            <strong className="font-bold text-slate-900 dark:text-white" {...props}>
              {renderWithMath(children, mathMap)}
            </strong>
          ),
          h1: ({ node, children, ...props }) => (
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props}>
              {renderWithMath(children, mathMap)}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5" {...props}>
              {renderWithMath(children, mathMap)}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 mb-1" {...props}>
              {renderWithMath(children, mathMap)}
            </h3>
          ),
          ul: ({ node, children, ...props }) => (
            <ul
              className="list-disc list-outside pl-5 my-2.5 space-y-1 text-slate-800 dark:text-slate-200"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol
              className="list-decimal list-outside pl-5 my-2.5 space-y-1 text-slate-800 dark:text-slate-200"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="leading-relaxed text-slate-800 dark:text-slate-200" {...props}>
              {renderWithMath(children, mathMap)}
            </li>
          ),
          p: ({ node, children, ...props }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-800 dark:text-slate-200" {...props}>
              {renderWithMath(children, mathMap)}
            </p>
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
              <table
                className="min-w-full divide-y divide-slate-200 dark:divide-white/10 text-left text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50 dark:bg-white/[0.04]" {...props} />
          ),
          th: ({ node, children, ...props }) => (
            <th
              className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-slate-200 dark:border-white/10"
              {...props}
            >
              {renderWithMath(children, mathMap)}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td
              className="px-3.5 py-2 text-xs border-t border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 align-top"
              {...props}
            >
              {renderWithMath(children, mathMap)}
            </td>
          ),
          code: ({ node, className, children, ...props }: any) => {
            const language = /language-(\w+)/.exec(className || '')?.[1];
            const codeText = String(children).replace(/\n$/, '');
            if (language || codeText.includes('\n')) {
              return (
                <CodeRenderer
                  code={codeText}
                  language={language}
                  onRun={onRunCode}
                />
              );
            }
            return (
              <code
                className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-800 dark:bg-white/10 dark:text-slate-200"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }: any) => <>{children}</>,
          blockquote: ({ node, children, ...props }) => (
            <blockquote
              className="my-2 pl-3.5 border-l-2 border-slate-300 dark:border-white/20 italic text-slate-600 dark:text-slate-400"
              {...props}
            >
              {renderWithMath(children, mathMap)}
            </blockquote>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
