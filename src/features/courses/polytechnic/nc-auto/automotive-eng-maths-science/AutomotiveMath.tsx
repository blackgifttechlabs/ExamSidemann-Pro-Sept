import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
  },
};

const superscripts: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁺': '+',
  '⁻': '-',
  'ⁿ': 'n',
  'ᵐ': 'm',
  'ᵖ': 'p',
  'ʸ': 'y',
};

const subscripts: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
  'ₐ': 'a',
  'ₑ': 'e',
  'ₕ': 'h',
  'ᵢ': 'i',
  'ⱼ': 'j',
  'ₖ': 'k',
  'ₗ': 'l',
  'ₘ': 'm',
  'ₙ': 'n',
  'ₒ': 'o',
  'ₚ': 'p',
  'ₛ': 's',
  'ₜ': 't',
  'ₓ': 'x',
};

const getTextChild = (children: React.ReactNode) => {
  if (typeof children === 'string' || typeof children === 'number') return String(children);

  const childArray = React.Children.toArray(children);
  if (childArray.every((child) => typeof child === 'string' || typeof child === 'number')) {
    return childArray.join('');
  }

  return null;
};

const replaceScriptRuns = (
  value: string,
  pattern: RegExp,
  map: Record<string, string>,
  marker: '^' | '_',
) =>
  value.replace(pattern, (match) => {
    const converted = [...match].map((char) => map[char] || char).join('');
    return `${marker}{${converted}}`;
  });

const toBoldMathExpression = (rawValue: string) => {
  let value = rawValue
    .trim()
    .replace(/\\/g, '\\backslash ')
    .replace(/\{/g, '\\lbrace ')
    .replace(/\}/g, '\\rbrace ')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\^\(([^)]+)\)/g, '^{$1}');

  value = replaceScriptRuns(value, /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵐᵖʸ]+/g, superscripts, '^');
  value = replaceScriptRuns(value, /[₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚₛₜₓ]+/g, subscripts, '_');

  value = value
    .replace(/½/g, '\\frac{1}{2}')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/−/g, '-')
    .replace(/±/g, '\\pm ')
    .replace(/≈/g, '\\approx ')
    .replace(/≠/g, '\\ne ')
    .replace(/≥/g, '\\ge ')
    .replace(/≤/g, '\\le ')
    .replace(/→/g, '\\to ')
    .replace(/↔/g, '\\leftrightarrow ')
    .replace(/·/g, '\\cdot ')
    .replace(/π/g, '\\pi ')
    .replace(/Σ/g, '\\Sigma ')
    .replace(/∫/g, '\\int ')
    .replace(/Δ/g, '\\Delta ')
    .replace(/θ/g, '\\theta ')
    .replace(/τ/g, '\\tau ')
    .replace(/σ/g, '\\sigma ')
    .replace(/ε/g, '\\varepsilon ')
    .replace(/μ/g, '\\mu ')
    .replace(/γ/g, '\\gamma ')
    .replace(/φ/g, '\\phi ')
    .replace(/ω/g, '\\omega ')
    .replace(/°C/g, '^{\\circ}C')
    .replace(/°/g, '^{\\circ}')
    .replace(/\barcsin\b/g, '\\arcsin ')
    .replace(/\bsin\b/g, '\\sin ')
    .replace(/\bcos\b/g, '\\cos ')
    .replace(/\btan\b/g, '\\tan ')
    .replace(/\bln\b/g, '\\ln ')
    .replace(/\s+/g, '\\;');

  return `\\(\\displaystyle\\mathbf{${value}}\\)`;
};

const shouldRenderLineWithMathJax = (line: string) =>
  line.trim().length > 0 &&
  line.length <= 120 &&
  !/[┌┐└┘│─]/.test(line) &&
  !/\s{3,}/.test(line) &&
  /[=+\-−×÷/^√∫ΣΔθτσεμγφπω²³⁰¹⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]/.test(line);

interface AutomotiveMathProviderProps {
  children: React.ReactNode;
}

interface MathTextProps {
  children: React.ReactNode;
  className?: string;
}

export const AutomotiveMathProvider: React.FC<AutomotiveMathProviderProps> = ({ children }) => (
  <MathJaxContext config={mathJaxConfig}>{children}</MathJaxContext>
);

export const InlineMath: React.FC<MathTextProps> = ({ children, className = '' }) => {
  const text = getTextChild(children);

  return (
    <span
      className={`inline-flex max-w-full align-baseline rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-lg font-black leading-none text-indigo-800 shadow-sm dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200 [&_mjx-container]:!m-0 [&_mjx-container]:!inline-block [&_mjx-container]:!text-[1.08rem] md:[&_mjx-container]:!text-[1.2rem] ${className}`}
    >
      {text === null ? children : <MathJax inline dynamic>{toBoldMathExpression(text)}</MathJax>}
    </span>
  );
};

export const MathBlockText: React.FC<MathTextProps> = ({ children, className = '' }) => {
  const text = getTextChild(children);

  return (
    <div
      className={`my-4 overflow-x-auto rounded-xl border border-indigo-100 bg-[#fffdf5] px-4 py-3 text-base font-black leading-relaxed text-slate-900 shadow-sm dark:border-indigo-900/60 dark:border-l-indigo-400 dark:bg-[#151526] dark:text-indigo-100 md:text-lg [&_mjx-container]:!m-0 [&_mjx-container]:!inline-block [&_mjx-container]:!text-[1.08rem] md:[&_mjx-container]:!text-[1.2rem] ${className}`}
    >
      {text === null ? (
        children
      ) : (
        <div className="min-w-max space-y-1">
          {text.split('\n').map((line, index) => {
            if (!line.trim()) return <div key={`blank-${index}`} className="h-3" />;

            return (
              <div key={`${line}-${index}`} className="whitespace-pre">
                {shouldRenderLineWithMathJax(line) ? (
                  <MathJax inline dynamic>{toBoldMathExpression(line)}</MathJax>
                ) : (
                  line
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
