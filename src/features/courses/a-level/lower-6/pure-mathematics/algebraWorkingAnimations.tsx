import React, { useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { MathStrokeExpression, type StrokeExpression } from '../../../o-level/form-4/mathematics/MathStrokeExpression';
import { MathPowers, powerTokens, simpleFractions } from '../../../o-level/form-4/mathematics/mathPowers';
import './algebraWorkingAnimations.css';

export type WorkingScene = ComponentType<{ progress: number }>;
type Slots = (index: number, text: string) => ReactNode;
type Transfer = { from: number; text: string; after?: string };
type SceneSpec = { source: (slot: Slots) => ReactNode; operation: (slot: Slots) => ReactNode; transfers: Transfer[]; result: StrokeExpression; explanation: string };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);
const power = (node: ReactNode) => <sup className="transfer-power">{node}</sup>;
const ratio = (top: ReactNode, bottom: ReactNode, small = false) => <span className={small ? 'transfer-ratio transfer-ratio-small' : 'transfer-ratio'}><span>{top}</span><span>{bottom}</span></span>;
const root = (degree: ReactNode, base: ReactNode) => <span className="transfer-root"><sup>{degree}</sup><span>√</span><span className="transfer-radicand">{base}</span></span>;

/** Tokens start at measured positions in the source expression, travel into the
 * calculation, hold, then give way to the original SVG pen-stroke result. */
function TransferCalculation({ progress, spec }: { progress: number; spec: SceneSpec }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const sourceNodes = useRef<(HTMLSpanElement | null)[]>([]);
  const targetNodes = useRef<(HTMLSpanElement | null)[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number; tx: number; ty: number; size: number; targetSize: number }[]>([]);
  useLayoutEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const bounds = element.getBoundingClientRect();
      const next = spec.transfers.map((token, i) => {
        const from = sourceNodes.current[token.from]; const to = targetNodes.current[i];
        if (!from || !to) return null;
        const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
        return { x: a.left + a.width / 2 - bounds.left, y: a.top + a.height / 2 - bounds.top,
          tx: b.left + b.width / 2 - bounds.left, ty: b.top + b.height / 2 - bounds.top,
          size: parseFloat(getComputedStyle(from).fontSize), targetSize: parseFloat(getComputedStyle(to).fontSize) };
      });
      if (next.every(Boolean)) setPositions(next as typeof positions);
    };
    measure(); const resize = new ResizeObserver(measure); resize.observe(element);
    document.fonts?.ready.then(measure);
    return () => { cancelled = true; resize.disconnect(); };
  }, [spec]);
  const p = clamp(progress);
  const travel = ease(clamp((p - .16) / .40));
  const fade = clamp((p - .72) / .10);
  const write = clamp((p - .82) / .18);
  const sourceSlot: Slots = (index, text) => <span ref={el => { sourceNodes.current[index] = el; }} data-motion-source={index}
    className="transfer-source-token" style={{ color: p < .16 ? '#dc2626' : undefined, opacity: p >= .16 && p < .82 ? .3 : 1 }}><MathPowers text={text} /></span>;
  const targetSlot: Slots = (index, text) => <span ref={el => { targetNodes.current[index] = el; }} data-motion-target={index} className="transfer-target-token"><MathPowers text={text} /></span>;
  return <figure className="algebra-operation" data-working-motion="source-transfer" data-motion-progress={p.toFixed(3)}>
    <div ref={wrapper} className="transfer-canvas gc-ink">
      <div className="transfer-source" aria-label="The expression we are working from">{spec.source(sourceSlot)}</div>
      <div className="transfer-stage">
        <div className="transfer-operation" aria-hidden="true" style={{ opacity: clamp((p - .28) / .12) * (1 - fade) }}>{spec.operation(targetSlot)}</div>
        <div className="transfer-result"><MathStrokeExpression value={spec.result} progress={write} /></div>
      </div>
      {positions.map((position, i) => {
        const token = spec.transfers[i];
        return <span key={i} className="transfer-flying-token" aria-hidden="true" data-motion-flying={i}
          style={{ left: position.x + (position.tx - position.x) * travel, top: position.y + (position.ty - position.y) * travel,
            fontSize: position.size + (position.targetSize - position.size) * travel,
            opacity: (p < .16 ? clamp(p / .025) : 1) * (1 - fade) }}>
          <MathPowers text={p >= .65 && token.after ? token.after : token.text} />
        </span>;
      })}
    </div>
    <figcaption>{spec.explanation}</figcaption>
  </figure>;
}
const scene = (spec: SceneSpec): WorkingScene => function Calculation({ progress }) { return <TransferCalculation progress={progress} spec={spec} />; };

// Show the full question in each simplification step. Powers of 1 are made explicit
// only where they are needed: x = x¹ and y = y¹.
const fullQuestion = (kind: 'numbers' | 'x' | 'y', slot: Slots) => {
  const token = (family: typeof kind, index: number, text: string) => kind === family ? slot(index, text) : <MathPowers text={text} />;
  const top = <>( {token('numbers', 0, '3')}x{power(token('x', 0, '2'))}y{power(token('y', 0, '3'))} )( {token('numbers', 1, '2')}x{power(token('x', 1, '4'))}y{kind === 'y' && power(slot(1, '1'))} )</>;
  const bottom = <>{token('numbers', 2, '6')}x{kind === 'x' && power(slot(2, '1'))}y{power(token('y', 2, '2'))}</>;
  return ratio(top, bottom);
};
export const SIMPLIFY_NUMBERS = scene({
  source: slot => fullQuestion('numbers', slot), operation: slot => ratio(<>{slot(0,'3')} × {slot(1,'2')}</>, slot(2,'6')),
  transfers: [{from:0,text:'3'}, {from:1,text:'2'}, {from:2,text:'6'}], result: '1',
  explanation: 'Take the number parts from the full question: multiply 3 by 2 above the line, then divide by 6. This gives 1.' });
export const COMBINE_X_POWERS = scene({
  source: slot => fullQuestion('x', slot), operation: slot => <>{slot(0,'2')} + {slot(1,'4')} − {slot(2,'1')}</>,
  transfers: [{from:0,text:'2'}, {from:1,text:'4'}, {from:2,text:'1'}], result:'x⁵',
  explanation:'Now take only the powers of x: add 2 and 4 from above the line, then subtract 1 from below. x means x¹.' });
export const COMBINE_Y_POWERS = scene({
  source: slot => fullQuestion('y', slot), operation: slot => <>{slot(0,'3')} + {slot(1,'1')} − {slot(2,'2')}</>,
  transfers: [{from:0,text:'3'}, {from:1,text:'1'}, {from:2,text:'2'}], result:'y²',
  explanation:'Now take only the powers of y: add 3 and 1 from above the line, then subtract 2 from below. y means y¹.' });
export const ADD_TWO_AND_THREE = scene({
  source: slot => <>2{power(slot(0,'2'))} × 2{power(slot(1,'3'))}</>, operation: slot => <>{slot(0,'2')} + {slot(1,'3')}</>,
  transfers:[{from:0,text:'2'}, {from:1,text:'3'}], result:'2⁵', explanation:'The two red powers come from the same base. Add them: 2 + 3 = 5. Keep base 2.' });
export const ROOT_FROM_FRACTION = scene({
  source: slot => <>{slot(0,'27')}{power(ratio(slot(1,'2'),slot(2,'3'),true))}</>,
  operation: slot => <>({root(slot(2,'3'),slot(0,'27'))}){power(slot(1,'2'))}</>,
  transfers:[{from:0,text:'27'},{from:1,text:'2'},{from:2,text:'3'}],result:'(∛27)²',
  explanation:'The bottom 3 becomes the cube-root number. The top 2 becomes the outside power. The 27 goes inside the root.' });
export const EVALUATE_CUBE_ROOT = scene({
  source: slot => <>({slot(0,'∛27')})²</>, operation: slot => <>{slot(0,'∛27')}²</>,
  transfers:[{from:0,text:'∛27',after:'3'}],result:'3²',explanation:'3 × 3 × 3 = 27, so ∛27 becomes 3. Keep the outside power 2.' });
export const SQUARE_THREE = scene({
  source: slot => <>{slot(0,'3')}²</>, operation: slot => <>{slot(0,'3')} × {slot(1,'3')}</>,
  transfers:[{from:0,text:'3'},{from:0,text:'3'}],result:'9',explanation:'Power 2 means two copies of the same 3. Multiply 3 by 3 to get 9.' });
export const NEGATIVE_FRACTION_POWER = scene({
  source: slot => <>{slot(0,'16^(−3/4)')}</>, operation: slot => ratio('1',slot(0,'16^(3/4)')),
  transfers:[{from:0,text:'16^(−3/4)',after:'16^(3/4)'}], result:{numerator:'1',denominator:'16^(3/4)'},
  explanation:'The minus sign in the power tells us to put 1 on top. Move 16 with the positive power below the fraction line. The value stays the same.' });
export const FOURTH_ROOT_BELOW = scene({
  source: slot => ratio('1',<>{slot(0,'16')}{power(ratio(slot(1,'3'),slot(2,'4'),true))}</>),
  operation: slot => ratio('1',<>({root(slot(2,'4'),slot(0,'16'))}){power(slot(1,'3'))}</>),
  transfers:[{from:0,text:'16'},{from:1,text:'3'},{from:2,text:'4'}], result:{numerator:'1',denominator:'(⁴√16)³'},
  explanation:'Below the line, 4 becomes the root number and 3 becomes the outside power. Move 16 inside the root. Keep 1 on top.' });
export const EVALUATE_FOURTH_ROOT = scene({
  source: slot => ratio('1',<>({slot(0,'⁴√16')})³</>), operation: slot => ratio('1',<>{slot(0,'⁴√16')}³</>),
  transfers:[{from:0,text:'⁴√16',after:'2'}], result:{numerator:'1',denominator:'2³'},
  explanation:'2 × 2 × 2 × 2 = 16, so the fourth root of 16 becomes 2. Keep power 3 below the line.' });
export const CUBE_TWO_BELOW = scene({
  source: slot => ratio('1',<>{slot(0,'2')}³</>), operation: slot => ratio('1',<>{slot(0,'2')} × {slot(1,'2')} × {slot(2,'2')}</>),
  transfers:[{from:0,text:'2'},{from:0,text:'2'},{from:0,text:'2'}],result:{numerator:'1',denominator:'8'},
  explanation:'Power 3 means three copies of 2 below the line. 2 × 2 × 2 = 8. Keep 1 on top.' });
export const COMMON_BASE_TWO = scene({
  source: slot => <>{slot(0,'4')}{power('x + 1')} = {slot(1,'8')}{power('x')}</>,
  operation: slot => <>4 = {slot(0,'2²')}; 8 = {slot(1,'2³')}</>,
  transfers:[{from:0,text:'4',after:'2²'},{from:1,text:'8',after:'2³'}],result:'2^(2x+2) = 2^(3x)',
  explanation:'4 becomes 2² and 8 becomes 2³. Multiply the powers: 2(x + 1) = 2x + 2, and 3 × x = 3x.' });

/** Explicit source/target selections: no inferred arithmetic or invented origins. */
export type TextMove = { from: string; to?: string; fromOccurrence?: number; toOccurrence?: number };
export function textTransferScene(source: string, operation: string, moves: TextMove[], explanation: string): WorkingScene {
  const locate = (text: string, value: string, occurrence = 0) => {
    let index = -1;
    for (let i = 0; i <= occurrence; i++) index = text.indexOf(value, index + 1);
    if (index < 0) throw new Error(`Missing animated term ${value} in ${text}`);
    return index;
  };
  const sourceMarks = moves.map((move, index) => ({ index, start: locate(source, move.from, move.fromOccurrence), length: move.from.length }));
  const targetMarks = moves.map((move, index) => ({ index, start: locate(operation, move.to ?? move.from, move.toOccurrence), length: (move.to ?? move.from).length }));
  const marked = (text: string, marks: typeof sourceMarks, slot: Slots, offset = 0): ReactNode => {
    const exact = marks.find(mark => mark.start === offset && mark.length === text.length);
    if (exact) return slot(exact.index, text);
    const fractions = simpleFractions(text);
    const splitMark = (mark: typeof sourceMarks[number]) => {
      const start = mark.start - offset;
      return <>{marked(text.slice(0, start), marks, slot, offset)}{slot(mark.index, text.slice(start, start + mark.length))}{marked(text.slice(start + mark.length), marks, slot, mark.start + mark.length)}</>;
    };
    const local = marks.filter(mark => mark.start >= offset && mark.start + mark.length <= offset + text.length);
    const acrossFraction = local.find(mark => fractions.some(fraction => {
      const start = offset + fraction.index, end = start + fraction[0].length;
      return mark.start < end && mark.start + mark.length > start && !(mark.start >= start && mark.start + mark.length <= end);
    }));
    if (acrossFraction) return splitMark(acrossFraction);
    if (fractions.length) {
      let cursor = 0; const pieces: ReactNode[] = [];
      fractions.forEach((fraction, i) => {
        pieces.push(<React.Fragment key={`a${i}`}>{marked(text.slice(cursor, fraction.index), marks, slot, offset + cursor)}</React.Fragment>);
        const whole = marks.find(mark => mark.start === offset + fraction.index && mark.length === fraction[0].length);
        pieces.push(<React.Fragment key={`f${i}`}>{whole ? slot(whole.index, fraction[0]) : ratio(marked(fraction[1], marks, slot, offset + fraction.index), marked(fraction[2], marks, slot, offset + fraction.index + fraction[1].length + 1))}</React.Fragment>);
        cursor = fraction.index + fraction[0].length;
      });
      pieces.push(<React.Fragment key="tail">{marked(text.slice(cursor), marks, slot, offset + cursor)}</React.Fragment>);
      return pieces;
    }
    const tokens = powerTokens(text);
    const acrossPower = local.find(mark => !tokens.some(token => mark.start >= offset + token.start + token.offset && mark.start + mark.length <= offset + token.start + token.offset + token.text.length));
    if (acrossPower) return splitMark(acrossPower);
    return tokens.map((token, i) => {
      const begin = offset + token.start + token.offset;
      const within = marks.filter(mark => mark.start >= begin && mark.start + mark.length <= begin + token.text.length).sort((a,b) => a.start - b.start);
      let cursor = 0; const pieces: ReactNode[] = [];
      within.forEach(mark => {
        const start = mark.start - begin;
        if (start < cursor) return;
        pieces.push(token.text.slice(cursor, start));
        pieces.push(<React.Fragment key={mark.index}>{slot(mark.index, token.text.slice(start, start + mark.length))}</React.Fragment>);
        cursor = start + mark.length;
      });
      pieces.push(token.text.slice(cursor));
      return <React.Fragment key={i}>{token.power ? power(pieces) : pieces}</React.Fragment>;
    });
  };
  return scene({ source: slot => marked(source, sourceMarks, slot), operation: slot => marked(operation, targetMarks, slot),
    transfers: moves.map((move, from) => ({ from, text: move.from, after: move.to })), result: operation, explanation });
}
