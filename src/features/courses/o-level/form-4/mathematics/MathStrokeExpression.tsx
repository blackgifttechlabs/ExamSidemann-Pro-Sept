import './mathStrokeExpression.css';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { MathFraction, MathPowers, powerTokens, type FractionProblem } from './mathPowers';

type Glyph = { char: string; x: number; y: number; size: number; family: string; weight: string; sourceIndex: number };
type Rule = { x: number; y: number; width: number };
type Layout = { width: number; height: number; glyphs: Glyph[]; rules: Rule[] };
export type StrokeExpression = string | FractionProblem;

/** Measure the complete typeset expression, then pen-write its SVG glyphs in those positions.
 * The hidden full expression reserves space from the start, including roots and fractions.
 */
export function MathStrokeExpression({ value, upTo, progress, live = false }: {
  value: StrokeExpression; upTo?: number; progress?: number; live?: boolean;
}) {
  const text = typeof value === 'string' ? value : `${value.numerator}/${value.denominator}`;
  const count = upTo ?? Math.ceil(Math.max(0, Math.min(1, progress ?? 1)) * text.length);
  const templateRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  useLayoutEffect(() => {
    const element = templateRef.current;
    if (!element) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const origin = element.getBoundingClientRect();
      const sequence = powerTokens(text).flatMap(token => [...token.text].map((char, index) => ({ char, sourceIndex: token.start + token.offset + index })));
      const glyphs: Glyph[] = [], rules: Rule[] = [];
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      let cursor = 0;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement) continue;
        const style = getComputedStyle(node.parentElement);
        const size = parseFloat(style.fontSize);
        if (context) context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        for (let i = 0; i < (node.textContent?.length ?? 0); i++) {
          const char = node.textContent![i];
          const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1);
          const box = range.getBoundingClientRect();
          while (cursor < sequence.length && sequence[cursor].char !== char) cursor++;
          const sourceIndex = sequence[cursor]?.sourceIndex ?? text.length - 1;
          cursor++;
          const metrics = context?.measureText(char);
          const ascent = metrics?.fontBoundingBoxAscent ?? size * .85;
          const descent = metrics?.fontBoundingBoxDescent ?? size * .2;
          glyphs.push({ char, x: box.left - origin.left, y: box.top - origin.top + (box.height - ascent - descent) / 2 + ascent, size, family: style.fontFamily, weight: style.fontWeight, sourceIndex });
        }
      }
      element.querySelectorAll('span').forEach(span => {
        const style = getComputedStyle(span);
        if (parseFloat(style.borderBottomWidth) > 0 && style.borderBottomStyle !== 'none') {
          const box = span.getBoundingClientRect();
          rules.push({ x: box.left - origin.left, y: box.bottom - origin.top - parseFloat(style.borderBottomWidth) / 2, width: box.width });
        }
      });
      setLayout({ width: Math.max(1, origin.width), height: Math.max(1, origin.height), glyphs, rules });
    };
    measure();
    const resize = new ResizeObserver(measure); resize.observe(element);
    document.fonts?.ready.then(measure);
    return () => { cancelled = true; resize.disconnect(); };
  }, [text, typeof value === 'string']);
  return <span className="math-stroke-expression" role="img" aria-label={text}>
    <span ref={templateRef} className="math-stroke-template" aria-hidden="true">
      {typeof value === 'string' ? <MathPowers text={value} /> : <MathFraction {...value} />}
    </span>
    {layout && <svg className="math-stroke-layer" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
      {layout.rules.map((rule, i) => <line key={`r${i}`} x1={rule.x} x2={rule.x + rule.width} y1={rule.y} y2={rule.y}
        stroke="currentColor" strokeWidth="1.5" strokeDasharray={rule.width} strokeDashoffset={rule.width * (1 - (progress === undefined ? Math.min(1, count / Math.max(1, text.length / 3)) : Math.min(1, progress * 3)))} />)}
      {layout.glyphs.map((glyph, i) => {
        if (glyph.sourceIndex >= count) return null;
        const writing = live && glyph.sourceIndex === count - 1;
        const reveal = progress === undefined ? 1 : Math.max(0, Math.min(1, progress * text.length - glyph.sourceIndex));
        return <text key={i} x={glyph.x} y={glyph.y} fontSize={glyph.size} fontFamily={glyph.family} fontWeight={glyph.weight}
          fill="currentColor" stroke="currentColor" strokeWidth=".4" strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray={240} strokeDashoffset={240 * (1 - reveal)} fillOpacity={progress === undefined ? 1 : Math.max(0, (reveal - .65) / .35)}
          style={writing ? { animation: 'dvWrite .9s ease-in-out forwards' } : undefined}>{glyph.char}</text>;
      })}
    </svg>}
  </span>;
}
