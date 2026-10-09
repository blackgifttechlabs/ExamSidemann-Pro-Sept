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
export const MathPowers = ({ text }: { text: string }) => <>{powerTokens(text).map((token, i) => token.power
  ? <sup key={i} className="text-[0.72em] leading-none" style={{ verticalAlign: 'super' }}>{token.text}</sup>
  : <React.Fragment key={i}>{token.text}</React.Fragment>)}</>;
