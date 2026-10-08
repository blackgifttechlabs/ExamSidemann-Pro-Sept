/**
 * A small, safe maths expression evaluator for graph specs written by the AI.
 * Never uses eval/Function: input is tokenised and parsed into closures.
 */

export type CompiledExpression = (x: number) => number;
export type CompileResult = { ok: true; fn: CompiledExpression } | { ok: false; error: string };

type Token = { type: 'num'; value: number } | { type: 'id'; value: string } | { type: 'op'; value: string };

const MAX_LENGTH = 120;
const MAX_DEPTH = 40;

const FUNCTIONS: Record<string, (v: number, degrees: boolean) => number> = {
  sin: (v, d) => Math.sin(d ? (v * Math.PI) / 180 : v),
  cos: (v, d) => Math.cos(d ? (v * Math.PI) / 180 : v),
  tan: (v, d) => Math.tan(d ? (v * Math.PI) / 180 : v),
  asin: (v, d) => (d ? (Math.asin(v) * 180) / Math.PI : Math.asin(v)),
  acos: (v, d) => (d ? (Math.acos(v) * 180) / Math.PI : Math.acos(v)),
  atan: (v, d) => (d ? (Math.atan(v) * 180) / Math.PI : Math.atan(v)),
  sinh: (v) => Math.sinh(v),
  cosh: (v) => Math.cosh(v),
  tanh: (v) => Math.tanh(v),
  sqrt: (v) => Math.sqrt(v),
  cbrt: (v) => Math.cbrt(v),
  abs: (v) => Math.abs(v),
  ln: (v) => Math.log(v),
  log: (v) => Math.log10(v),
  log10: (v) => Math.log10(v),
  log2: (v) => Math.log2(v),
  exp: (v) => Math.exp(v),
  floor: (v) => Math.floor(v),
  ceil: (v) => Math.ceil(v),
  round: (v) => Math.round(v),
  sign: (v) => Math.sign(v),
};
const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

const tokenize = (source: string): Token[] => {
  const text = source
    .replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi')
    .replace(/\*\*/g, '^').replace(/²/g, '^2').replace(/³/g, '^3');
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (/[0-9.]/.test(ch)) {
      const match = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(text.slice(i));
      if (!match) throw new Error(`Unexpected "${ch}"`);
      // "2e" followed by a letter is 2 * e, not an exponent.
      let literal = match[0];
      if (match[2] && /[a-z]/i.test(text[i + literal.length] ?? '')) literal = match[1];
      tokens.push({ type: 'num', value: Number(literal) });
      i += literal.length;
      continue;
    }
    if (/[a-z]/i.test(ch)) {
      const match = /^[a-z][a-z0-9]*/i.exec(text.slice(i))!;
      tokens.push({ type: 'id', value: match[0].toLowerCase() });
      i += match[0].length;
      continue;
    }
    if ('+-*/^(),'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i += 1; continue; }
    throw new Error(`Unexpected "${ch}"`);
  }
  return tokens;
};

type Node = (x: number) => number;

export const compileExpression = (source: string, degrees = false): CompileResult => {
  try {
    let text = String(source ?? '').trim();
    if (!text) throw new Error('Empty expression');
    if (text.length > MAX_LENGTH) throw new Error('Expression is too long');
    text = text.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/i, '');
    const tokens = tokenize(text);
    let pos = 0;
    const peek = () => tokens[pos];
    const isOp = (value: string) => { const t = tokens[pos]; return t?.type === 'op' && t.value === value; };
    const expect = (value: string) => { if (!isOp(value)) throw new Error(`Expected "${value}"`); pos += 1; };

    const startsFactor = () => {
      const t = peek();
      return !!t && (t.type === 'num' || t.type === 'id' || (t.type === 'op' && t.value === '('));
    };

    const parseExpr = (depth: number): Node => {
      if (depth > MAX_DEPTH) throw new Error('Expression is too deeply nested');
      let left = parseTerm(depth);
      while (isOp('+') || isOp('-')) {
        const op = (tokens[pos++] as { value: string }).value;
        const right = parseTerm(depth);
        const l = left;
        left = op === '+' ? (x) => l(x) + right(x) : (x) => l(x) - right(x);
      }
      return left;
    };
    const parseTerm = (depth: number): Node => {
      let left = parseUnary(depth);
      for (;;) {
        if (isOp('*') || isOp('/')) {
          const op = (tokens[pos++] as { value: string }).value;
          const right = parseUnary(depth);
          const l = left;
          left = op === '*' ? (x) => l(x) * right(x) : (x) => l(x) / right(x);
        } else if (startsFactor()) { // implicit multiplication: 2x, 3(x+1), (x+1)(x-1)
          const right = parsePower(depth);
          const l = left;
          left = (x) => l(x) * right(x);
        } else return left;
      }
    };
    const parseUnary = (depth: number): Node => {
      if (isOp('-')) { pos += 1; const inner = parseUnary(depth + 1); return (x) => -inner(x); }
      if (isOp('+')) { pos += 1; return parseUnary(depth + 1); }
      return parsePower(depth);
    };
    const parsePower = (depth: number): Node => {
      const base = parseAtom(depth);
      if (isOp('^')) {
        pos += 1;
        const exponent = parseUnary(depth + 1);
        return (x) => Math.pow(base(x), exponent(x));
      }
      return base;
    };
    const parseAtom = (depth: number): Node => {
      const t = tokens[pos];
      if (!t) throw new Error('Unexpected end of expression');
      if (t.type === 'num') { pos += 1; const v = t.value; return () => v; }
      if (t.type === 'op' && t.value === '(') {
        pos += 1;
        const inner = parseExpr(depth + 1);
        expect(')');
        return inner;
      }
      if (t.type === 'id') {
        pos += 1;
        if (t.value === 'x') return (x) => x;
        if (Object.hasOwn(CONSTANTS, t.value)) { const v = CONSTANTS[t.value]; return () => v; }
        const fn = Object.hasOwn(FUNCTIONS, t.value) ? FUNCTIONS[t.value] : undefined;
        if (!fn) throw new Error(`Unknown name "${t.value}"`);
        let arg: Node;
        if (isOp('(')) { pos += 1; arg = parseExpr(depth + 1); expect(')'); }
        else arg = parsePower(depth + 1);
        return (x) => fn(arg(x), degrees);
      }
      throw new Error(`Unexpected "${t.value}"`);
    };

    const root = parseExpr(0);
    if (pos < tokens.length) throw new Error(`Unexpected "${(tokens[pos] as { value: unknown }).value}"`);
    return { ok: true, fn: (x) => root(x) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid expression' };
  }
};
