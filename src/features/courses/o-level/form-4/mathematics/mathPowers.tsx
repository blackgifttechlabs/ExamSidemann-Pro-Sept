import React from 'react';

type PowerToken = { text: string; power: boolean; start: number; offset: number };
const SUPER: Record<string, string> = { '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁻':'−', '⁺':'+', 'ⁿ':'n' };
/** Parse plain lesson powers once, retaining source positions for pen animation. */
export function powerTokens(text: string): PowerToken[] {
  const tokens: PowerToken[] = [];
  let plain = '', start = 0;
  const flush = () => { if (plain) tokens.push({ text: plain, power: false, start, offset: 0 }); plain = ''; };
  for (let i = 0; i < text.length;) {
    if (SUPER[text[i]]) {
      flush(); const at = i; let value = '';
      while (SUPER[text[i]]) value += SUPER[text[i++]];
      tokens.push({ text: value, power: true, start: at, offset: 0 }); start = i; continue;
    }
    if (text[i] === '^') {
      let end = i + 1, offset = 1, value = '';
      if (text[end] === '(') {
        offset = 2; let depth = 1; const begin = ++end;
        while (end < text.length && depth) { if (text[end] === '(') depth++; if (text[end] === ')') depth--; if (depth) end++; }
        if (!depth) { value = text.slice(begin, end); end++; }
      } else {
        const match = text.slice(end).match(/^[−-]?[A-Za-z0-9]+/);
        if (match) { value = match[0]; end += value.length; }
      }
      if (value) { flush(); tokens.push({ text: value.replace(/-/g, '−'), power: true, start: i, offset }); i = end; start = i; continue; }
    }
    if (!plain) start = i;
    plain += text[i++];
  }
  flush(); return tokens;
}
export const PowerValue = ({ text }: { text: string }) => {
  const parts = text.split('/');
  if (parts.length !== 2) return <>{text}</>;
  return <span className="inline-flex flex-col items-stretch text-center align-middle" style={{ lineHeight: 1.05 }}>
    <span className="border-b border-current px-[0.08em] pb-[0.04em]">{parts[0]}</span>
    <span className="px-[0.08em] pt-[0.04em]">{parts[1]}</span>
  </span>;
};
type SimpleFraction = { index: number; 0: string; 1: string; 2: string };
export function simpleFractions(text: string): SimpleFraction[] {
  const powers = powerTokens(text).filter(token => token.power);
  const results: SimpleFraction[] = [];
  const atom = /[A-Za-z0-9.√∛∜⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]/;
  const closing = (start: number) => {
    const stack: string[] = [];
    for (let i = start; i < text.length; i++) {
      if (text[i] === '(' || text[i] === '[') stack.push(text[i] === '(' ? ')' : ']');
      else if (text[i] === ')' || text[i] === ']') {
        if (text[i] !== stack.pop()) return start;
        if (!stack.length) return i + 1;
      }
    }
    return start;
  };
  const opening = (end: number) => {
    const stack: string[] = [];
    for (let i = end - 1; i >= 0; i--) {
      if (text[i] === ')' || text[i] === ']') stack.push(text[i] === ')' ? '(' : '[');
      else if (text[i] === '(' || text[i] === '[') {
        if (text[i] !== stack.pop()) return end;
        if (!stack.length) return i;
      }
    }
    return end;
  };
  const left = (end: number): number => {
    const power = powers.find(token => token.start + token.offset + token.text.length + (text[token.start] === '^' && text[token.start + 1] === '(' ? 1 : 0) === end);
    if (power) return left(power.start);
    let start = end;
    if (text[end - 1] === ')' || text[end - 1] === ']') {
      start = opening(end);
      if (start === end) return end;
      while (start > 0 && atom.test(text[start - 1])) start--;
      while (start > 0 && (text[start - 1] === ')' || text[start - 1] === ']')) start = left(start);
    } else {
      while (start > 0 && atom.test(text[start - 1])) start--;
    }
    const functionPrefix = text.slice(0, start).match(/\b(ln|log)\s+$/);
    if (functionPrefix) start -= functionPrefix[0].length;
    return start;
  };
  const right = (start: number): number => {
    let end = start;
    if (text[end] === '(' || text[end] === '[') end = closing(end);
    else {
      while (end < text.length && atom.test(text[end])) {
        if (text[end] === '.' && !/\d/.test(text[end + 1] ?? '')) break;
        end++;
      }
      if (text[end] === '(' || text[end] === '[') end = closing(end);
      else if (['ln', 'log'].includes(text.slice(start, end)) && text[end] === ' ') {
        const next = end + 1; const after = right(next); if (after > next) end = after;
      }
    }
    while (end < text.length && /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]/.test(text[end])) end++;
    if (text[end] === '^') {
      if (text[end + 1] === '(') { const after = closing(end + 1); if (after > end + 1) end = after; }
      else { const exponent = text.slice(end + 1).match(/^[−-]?[A-Za-z0-9]+/); if (exponent) end += 1 + exponent[0].length; }
    }
    return end;
  };
  for (let slash = 0; slash < text.length; slash++) {
    if (text[slash] !== '/' || /\s/.test(text[slash - 1] ?? '') || /\s/.test(text[slash + 1] ?? '')) continue;
    if (powers.some(token => slash >= token.start && slash < token.start + token.offset + token.text.length)) continue;
    const start = left(slash), end = right(slash + 1);
    if (start < slash && end > slash + 1) results.push({ index: start, 0: text.slice(start, end), 1: text.slice(start, slash), 2: text.slice(slash + 1, end) });
  }
  return results.filter((fraction, i) => !results.slice(0, i).some(outer => fraction.index < outer.index + outer[0].length));
}

export const MathPowers = ({ text, upTo = text.length }: { text: string; upTo?: number }) => {
  const fractions = simpleFractions(text);
  if (fractions.length) {
    let cursor = 0;
    const content: React.ReactNode[] = [];
    fractions.forEach((match, i) => {
      const start = match.index!;
      content.push(<MathPowers key={`before${i}`} text={text.slice(cursor, start)} upTo={Math.max(0, upTo - cursor)} />);
      if (upTo > start) {
        const denominatorStart = start + match[1].length + 1;
        content.push(<span key={`fraction${i}`} className="mx-[0.12em] inline-flex flex-col items-stretch align-middle text-center leading-[1.5]" role="math" aria-label={`${match[1]} divided by ${match[2]}`}>
          <span className="border-b border-current px-[0.2em] pb-[0.1em]"><MathPowers text={match[1]} upTo={upTo - start} /></span>
          <span className="min-h-[1.5em] px-[0.2em] pt-[0.1em]"><MathPowers text={match[2]} upTo={Math.max(0, upTo - denominatorStart)} /></span>
        </span>);
      }
      cursor = start + match[0].length;
    });
    content.push(<MathPowers key="after" text={text.slice(cursor)} upTo={Math.max(0, upTo - cursor)} />);
    return <>{content}</>;
  }
  return <>{powerTokens(text).map((token, i) => {
    const shown = token.text.slice(0, Math.max(0, upTo - token.start - token.offset));
    return token.power
      ? <sup key={i} className="text-[0.72em] leading-none" style={{ position: 'static', verticalAlign: 'super', fontSize: token.text.includes('/') ? '0.52em' : undefined, lineHeight: token.text.includes('/') ? 1.05 : 0, display: token.text.includes('/') ? 'inline-block' : undefined, transform: token.text.includes('/') ? 'translateY(-0.8em)' : undefined }}><PowerValue text={shown} /></sup>
      : <React.Fragment key={i}>{shown}</React.Fragment>;
  })}</>;
};

export type FractionProblem = { numerator: string; denominator: string; prefix?: string; suffix?: string };
export const MathFraction = ({ numerator, denominator, writeProgress = 1 }: FractionProblem & { writeProgress?: number }) => {
  const count = Math.ceil(Math.max(0, Math.min(1, writeProgress)) * (numerator.length + denominator.length));
  return <span className="mx-1 my-1 inline-flex shrink-0 flex-col items-stretch align-middle whitespace-nowrap text-center leading-[1.7]" role="math" aria-label={`(${numerator}) divided by (${denominator})`}>
    <span className="border-b-2 border-current px-2 pb-2 pt-1"><MathPowers text={numerator} upTo={Math.min(numerator.length, count)} /></span>
    <span className="min-h-[1.7em] px-2 pb-1 pt-2"><MathPowers text={denominator} upTo={Math.max(0, count - numerator.length)} /></span>
  </span>;
};
