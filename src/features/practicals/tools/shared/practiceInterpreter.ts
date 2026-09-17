import type { CodeRunResult } from './codeRunnerApi';

export interface PracticeCallbacks {
  onOutput?: (output: string[]) => void;
  onInput?: (kind: 'line' | 'key' | 'char', reply: (value: string) => void) => void;
}

type Value = any;

interface VarEntry {
  type: string;
  value: Value;
  target?: string; // pointer target variable name
}

class Scope {
  vars = new Map<string, VarEntry>();
  constructor(public parent?: Scope) {}

  find(name: string): VarEntry | undefined {
    if (this.vars.has(name)) return this.vars.get(name)!;
    return this.parent?.find(name);
  }

  get(name: string): VarEntry {
    const entry = this.find(name);
    if (!entry) throw new Error(`Variable ${name} has not been declared.`);
    return entry;
  }

  set(name: string, val: Value) {
    const entry = this.get(name);
    entry.value = entry.type === 'int' ? Math.trunc(Number(val)) : val;
  }
}

interface FnParam {
  name: string;
  type: string;
  isRef: boolean;
}

interface FnDef {
  returnType: string;
  name: string;
  params: FnParam[];
  body: StmtNode;
}

interface ClassDef {
  name: string;
  fields: Array<{ name: string; type: string; init?: ExprNode }>;
  methods: Map<string, FnDef>;
  constructorDef?: FnDef;
}

// AST Nodes
type ExprNode =
  | { kind: 'lit'; val: Value }
  | { kind: 'var'; name: string }
  | { kind: 'unop'; op: string; expr: ExprNode }
  | { kind: 'binop'; op: string; left: ExprNode; right: ExprNode }
  | { kind: 'assign'; op: string; target: AssignTarget; val: ExprNode }
  | { kind: 'call'; name: string; args: ExprNode[] }
  | { kind: 'instantiate'; className: string; args: ExprNode[] }
  | { kind: 'index'; target: ExprNode; index: ExprNode }
  | { kind: 'member'; target: ExprNode; prop: string; op: '.' | '->' }
  | { kind: 'memberCall'; target: ExprNode; method: string; op: '.' | '->'; args: ExprNode[] }
  | { kind: 'addressOf'; name: string }
  | { kind: 'deref'; expr: ExprNode }
  | { kind: 'arrayLit'; items: ExprNode[] };

type AssignTarget =
  | { kind: 'var'; name: string }
  | { kind: 'index'; target: string; index: ExprNode }
  | { kind: 'deref'; name: string }
  | { kind: 'member'; target: string; prop: string; op: '.' | '->' };

type StmtNode =
  | { kind: 'empty' }
  | { kind: 'block'; stmts: StmtNode[] }
  | { kind: 'expr'; expr: ExprNode }
  | { kind: 'varDecl'; varType: string; decls: Array<{ name: string; init?: ExprNode; isPtr?: boolean; arraySize?: ExprNode; arrayInit?: ExprNode[] }> }
  | { kind: 'instantiateDecl'; className: string; name: string; args: ExprNode[] }
  | { kind: 'if'; cond: ExprNode; thenStmt: StmtNode; elseStmt?: StmtNode }
  | { kind: 'switch'; expr: ExprNode; cases: Array<{ val?: ExprNode; stmts: StmtNode[] }> }
  | { kind: 'while'; cond: ExprNode; body: StmtNode }
  | { kind: 'doWhile'; body: StmtNode; cond: ExprNode }
  | { kind: 'for'; init?: StmtNode; cond?: ExprNode; update?: ExprNode; body: StmtNode }
  | { kind: 'break' }
  | { kind: 'continue' }
  | { kind: 'return'; expr?: ExprNode }
  | { kind: 'cout'; parts: Array<ExprNode | 'endl'> }
  | { kind: 'cin'; targets: string[] }
  | { kind: 'getline'; target: string }
  | { kind: 'consoleWrite'; expr: ExprNode; newline: boolean };

const RETURN_SYM = Symbol('return');
const BREAK_SYM = Symbol('break');
const CONTINUE_SYM = Symbol('continue');

function tokenize(cleanSource: string): string[] {
  const tokens: string[] = [];
  const pattern = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\.\d+)?|Console\.[A-Za-z_]\w*|Math\.[A-Za-z_]\w*|int\.Parse|double\.Parse|[A-Za-z_]\w*|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|<<|>>|::|->|[{}()[\];,+\-*/%<>=!?&.:]/gy;
  let offset = 0;
  while (offset < cleanSource.length) {
    pattern.lastIndex = offset;
    const match = pattern.exec(cleanSource);
    if (!match) throw new Error(`Unsupported syntax near: ${cleanSource.slice(offset, offset + 30)}`);
    offset = pattern.lastIndex;
    if (!/^\s|^\/\//.test(match[0]) && !match[0].startsWith('/*')) {
      tokens.push(match[0]);
    }
  }
  // Strip std::
  for (let i = tokens.length - 2; i >= 0; i--) {
    if (tokens[i] === 'std' && tokens[i + 1] === '::') {
      tokens.splice(i, 2);
    }
  }
  return tokens;
}

function parseProgram(language: 'cpp' | 'csharp', source: string) {
  if (source.length > 200_000) throw new Error('Keep practice programs below 200 KB.');
  const cleanSource = source.replace(/^\s*#include\s*[<"][^>"\n]+[>"]\s*$/gm, '');
  const tokens = tokenize(cleanSource);

  let p = 0;
  const peek = (ahead = 0) => tokens[p + ahead];
  const take = () => tokens[p++] ?? fail('Unexpected end of program.');
  const expect = (s: string) => {
    const t = take();
    if (t !== s) fail(`Expected ${s}, got ${t}.`);
  };
  const fail = (msg: string): never => { throw new Error(msg); };
  const identifier = () => {
    const name = take();
    if (!/^[A-Za-z_]\w*$/.test(name)) fail(`Expected identifier, got ${name}.`);
    return name;
  };

  const TYPE_KEYWORDS = new Set([
    'int', 'double', 'float', 'string', 'bool', 'char', 'var', 'void', 'long', 'short', 'auto'
  ]);
  const userClasses = new Set<string>();

  const isType = (token: string) => {
    if (!token) return false;
    return TYPE_KEYWORDS.has(token) || userClasses.has(token);
  };

  const precedence: Record<string, number> = {
    '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '>': 4, '<=': 4, '>=': 4,
    '+': 5, '-': 5, '*': 6, '/': 6, '%': 6
  };

  const parseExpr = (minimum = 0): ExprNode => {
    let token = take();
    let left: ExprNode;

    if (token === '(') {
      left = parseExpr();
      expect(')');
    } else if (['!', '-', '+'].includes(token)) {
      left = { kind: 'unop', op: token, expr: parseExpr(7) };
    } else if (token === '&') {
      left = { kind: 'addressOf', name: identifier() };
    } else if (token === '*') {
      left = { kind: 'deref', expr: parseExpr(7) };
    } else if (/^\d/.test(token)) {
      left = { kind: 'lit', val: Number(token) };
    } else if (token.startsWith('"')) {
      let strVal = '';
      try { strVal = JSON.parse(token); } catch { strVal = token.slice(1, -1); }
      left = { kind: 'lit', val: strVal };
    } else if (token.startsWith("'")) {
      left = { kind: 'lit', val: token.slice(1, -1) };
    } else if (token === 'true' || token === 'false') {
      left = { kind: 'lit', val: token === 'true' };
    } else if (userClasses.has(token) && peek() === '(') {
      const className = token;
      take();
      const args: ExprNode[] = [];
      if (peek() !== ')') {
        while (true) {
          args.push(parseExpr());
          if (peek() !== ',') break;
          take();
        }
      }
      expect(')');
      left = { kind: 'instantiate', className, args };
    } else if (peek() === '(') {
      const fnName = token;
      take();
      const args: ExprNode[] = [];
      if (peek() !== ')') {
        while (true) {
          args.push(parseExpr());
          if (peek() !== ',') break;
          take();
        }
      }
      expect(')');
      left = { kind: 'call', name: fnName, args };
    } else {
      left = { kind: 'var', name: token };
    }

    // Postfix indexing or member access or postfix inc/dec
    while (peek() === '[' || peek() === '.' || peek() === '->' || peek() === '++' || peek() === '--') {
      const op = take();
      if (op === '++' || op === '--') {
        if (left.kind === 'var') {
          left = { kind: 'assign', op, target: { kind: 'var', name: left.name }, val: { kind: 'lit', val: 1 } };
        } else if (left.kind === 'deref' && left.expr.kind === 'var') {
          left = { kind: 'assign', op, target: { kind: 'deref', name: left.expr.name }, val: { kind: 'lit', val: 1 } };
        } else {
          fail(`Unsupported operand for ${op}.`);
        }
      } else if (op === '[') {
        const idx = parseExpr();
        expect(']');
        left = { kind: 'index', target: left, index: idx };
      } else if (op === '.' || op === '->') {
        const member = identifier();
        if (peek() === '(') {
          take();
          const mArgs: ExprNode[] = [];
          if (peek() !== ')') {
            while (true) {
              mArgs.push(parseExpr());
              if (peek() !== ',') break;
              take();
            }
          }
          expect(')');
          left = { kind: 'memberCall', target: left, method: member, op, args: mArgs };
        } else {
          left = { kind: 'member', target: left, prop: member, op };
        }
      }
    }

    // Assignments in expression context: var = expr, var += expr, etc.
    if (minimum <= 2 && ['=', '+=', '-=', '*=', '/='].includes(peek())) {
      const assignOp = take();
      const rightVal = parseExpr();
      if (left.kind === 'var') {
        left = { kind: 'assign', op: assignOp, target: { kind: 'var', name: left.name }, val: rightVal };
      } else if (left.kind === 'index' && left.target.kind === 'var') {
        left = { kind: 'assign', op: assignOp, target: { kind: 'index', target: left.target.name, index: left.index }, val: rightVal };
      } else if (left.kind === 'deref' && left.expr.kind === 'var') {
        left = { kind: 'assign', op: assignOp, target: { kind: 'deref', name: left.expr.name }, val: rightVal };
      } else if (left.kind === 'member' && left.target.kind === 'var') {
        left = { kind: 'assign', op: assignOp, target: { kind: 'member', target: left.target.name, prop: left.prop, op: left.op }, val: rightVal };
      }
    }

    // Binary operators
    while (precedence[peek()] !== undefined && precedence[peek()] >= minimum) {
      const op = take();
      const right = parseExpr(precedence[op] + 1);
      left = { kind: 'binop', op, left, right };
    }

    return left;
  };

  const parseStmt = (): StmtNode => {
    const token = take();

    if (token === ';') return { kind: 'empty' };

    if (token === '{') {
      const stmts: StmtNode[] = [];
      while (peek() && peek() !== '}') {
        stmts.push(parseStmt());
      }
      expect('}');
      return { kind: 'block', stmts };
    }

    if (token === 'if') {
      expect('(');
      const cond = parseExpr();
      expect(')');
      const thenStmt = parseStmt();
      const elseStmt = peek() === 'else' ? (take(), parseStmt()) : undefined;
      return { kind: 'if', cond, thenStmt, elseStmt };
    }

    if (token === 'switch') {
      expect('(');
      const sExpr = parseExpr();
      expect(')');
      expect('{');
      const cases: Array<{ val?: ExprNode; stmts: StmtNode[] }> = [];
      let curCase: { val?: ExprNode; stmts: StmtNode[] } | null = null;
      while (peek() && peek() !== '}') {
        if (peek() === 'case') {
          take();
          const cVal = parseExpr();
          expect(':');
          curCase = { val: cVal, stmts: [] };
          cases.push(curCase);
        } else if (peek() === 'default') {
          take();
          expect(':');
          curCase = { stmts: [] };
          cases.push(curCase);
        } else {
          if (!curCase) {
            curCase = { stmts: [] };
            cases.push(curCase);
          }
          curCase.stmts.push(parseStmt());
        }
      }
      expect('}');
      return { kind: 'switch', expr: sExpr, cases };
    }

    if (token === 'while') {
      expect('(');
      const cond = parseExpr();
      expect(')');
      const body = parseStmt();
      return { kind: 'while', cond, body };
    }

    if (token === 'do') {
      const body = parseStmt();
      expect('while');
      expect('(');
      const cond = parseExpr();
      expect(')');
      expect(';');
      return { kind: 'doWhile', body, cond };
    }

    if (token === 'for') {
      expect('(');
      let init: StmtNode | undefined;
      if (peek() !== ';') init = parseStmt();
      else take();
      let cond: ExprNode | undefined;
      if (peek() !== ';') cond = parseExpr();
      expect(';');
      let update: ExprNode | undefined;
      if (peek() !== ')') update = parseExpr();
      expect(')');
      const body = parseStmt();
      return { kind: 'for', init, cond, update, body };
    }

    if (token === 'break') {
      expect(';');
      return { kind: 'break' };
    }

    if (token === 'continue') {
      expect(';');
      return { kind: 'continue' };
    }

    if (token === 'return') {
      const retExpr = peek() === ';' ? undefined : parseExpr();
      expect(';');
      return { kind: 'return', expr: retExpr };
    }

    if (token === 'cout') {
      const parts: Array<ExprNode | 'endl'> = [];
      do {
        expect('<<');
        if (peek() === 'endl') {
          take();
          parts.push('endl');
        } else if (peek() === 'fixed' || peek() === 'setprecision') {
          const m = take();
          if (m === 'setprecision') {
            expect('(');
            parseExpr();
            expect(')');
          }
        } else {
          parts.push(parseExpr());
        }
      } while (peek() === '<<');
      expect(';');
      return { kind: 'cout', parts };
    }

    if (token === 'cin') {
      const targets: string[] = [];
      do {
        expect('>>');
        targets.push(identifier());
      } while (peek() === '>>');
      expect(';');
      return { kind: 'cin', targets };
    }

    if (token === 'getline') {
      expect('(');
      expect('cin');
      expect(',');
      const target = identifier();
      expect(')');
      expect(';');
      return { kind: 'getline', target };
    }

    if (token === 'Console.WriteLine' || token === 'Console.Write') {
      expect('(');
      const cExpr = peek() === ')' ? { kind: 'lit', val: '' } as ExprNode : parseExpr();
      expect(')');
      expect(';');
      return { kind: 'consoleWrite', expr: cExpr, newline: token === 'Console.WriteLine' };
    }

    // Class instantiation: Student stu("Alice", 20);
    if (userClasses.has(token) && /^[A-Za-z_]\w*$/.test(peek()) && peek(1) === '(') {
      const className = token;
      const objName = identifier();
      take(); // '('
      const args: ExprNode[] = [];
      if (peek() !== ')') {
        while (true) {
          args.push(parseExpr());
          if (peek() !== ',') break;
          take();
        }
      }
      expect(')');
      expect(';');
      return { kind: 'instantiateDecl', className, name: objName, args };
    }

    // Variable or array or pointer declaration
    if (isType(token)) {
      const varType = token;
      const decls: Array<{ name: string; init?: ExprNode; isPtr?: boolean; arraySize?: ExprNode; arrayInit?: ExprNode[] }> = [];

      while (true) {
        let isPtr = false;
        if (peek() === '*') {
          take();
          isPtr = true;
        }
        const name = identifier();

        if (peek() === '[') {
          take();
          let arraySize: ExprNode | undefined;
          if (peek() !== ']') arraySize = parseExpr();
          expect(']');
          let arrayInit: ExprNode[] | undefined;
          if (peek() === '=') {
            take();
            expect('{');
            arrayInit = [];
            if (peek() !== '}') {
              while (true) {
                arrayInit.push(parseExpr());
                if (peek() !== ',') break;
                take();
              }
            }
            expect('}');
          }
          decls.push({ name, isPtr: false, arraySize, arrayInit });
        } else {
          let init: ExprNode | undefined;
          if (peek() === '=') {
            take();
            init = parseExpr();
          }
          decls.push({ name, init, isPtr });
        }

        if (peek() !== ',') break;
        take();
      }
      expect(';');
      return { kind: 'varDecl', varType, decls };
    }

    // Otherwise an expression statement
    p--;
    const expr = parseExpr();
    expect(';');
    return { kind: 'expr', expr };
  };

  // Strip top-level using directives
  while (peek() === 'using') {
    take();
    if (language === 'cpp') {
      if (peek() === 'namespace') {
        take();
        expect('std');
      }
    } else {
      const ns = take();
      if (!/^System(?:\.\w+)*$/.test(ns)) fail('Practice mode only supports using System.');
    }
    expect(';');
  }

  const functions = new Map<string, FnDef>();
  const classes = new Map<string, ClassDef>();
  let mainBody: StmtNode | null = null;
  const topStmts: StmtNode[] = [];

  while (p < tokens.length) {
    if (peek() === 'namespace') {
      take();
      identifier();
      expect('{');
      continue;
    }
    if (peek() === '}') {
      take();
      continue;
    }
    if (['public', 'private', 'static', 'internal'].includes(peek())) {
      take();
      continue;
    }

    // Class or Struct declaration
    if (peek() === 'class' || peek() === 'struct') {
      take();
      const className = identifier();
      userClasses.add(className);
      expect('{');
      const fields: Array<{ name: string; type: string; init?: ExprNode }> = [];
      const methods = new Map<string, FnDef>();
      let constructorDef: FnDef | undefined;

      while (peek() && peek() !== '}') {
        if (['public', 'private', 'protected'].includes(peek())) {
          take();
          expect(':');
          continue;
        }
        // Constructor
        if (peek() === className && peek(1) === '(') {
          take();
          take(); // '('
          const params: FnParam[] = [];
          if (peek() !== ')') {
            while (true) {
              let pType = take();
              if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
              let isRef = false;
              if (peek() === '&' || peek() === '*') { take(); isRef = true; }
              const pName = identifier();
              if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
              params.push({ name: pName, type: pType, isRef });
              if (peek() !== ',') break;
              take();
            }
          }
          expect(')');
          const cBody = parseStmt();
          constructorDef = { returnType: 'void', name: className, params, body: cBody };
          continue;
        }

        // Method or field
        if (isType(peek())) {
          let mType = take();
          if (peek() === '[' && peek(1) === ']') { take(); take(); mType += '[]'; }
          const mName = identifier();
          if (peek() === '(') {
            take();
            const params: FnParam[] = [];
            if (peek() !== ')') {
              while (true) {
                let pType = take();
                if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
                let isRef = false;
                if (peek() === '&' || peek() === '*') { take(); isRef = true; }
                const pName = identifier();
                if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
                params.push({ name: pName, type: pType, isRef });
                if (peek() !== ',') break;
                take();
              }
            }
            expect(')');
            const mBody = parseStmt();
            if (mName === 'main' || mName === 'Main') {
              mainBody = mBody;
            } else {
              methods.set(mName, { returnType: mType, name: mName, params, body: mBody });
            }
          } else {
            let init: ExprNode | undefined;
            if (peek() === '=') {
              take();
              init = parseExpr();
            }
            expect(';');
            fields.push({ name: mName, type: mType, init });
          }
        } else {
          take();
        }
      }
      expect('}');
      if (peek() === ';') take();
      classes.set(className, { name: className, fields, methods, constructorDef });
      continue;
    }

    // Function definition
    if (isType(peek()) && peek(1) && /^[A-Za-z_]\w*$/.test(peek(1)) && peek(2) === '(') {
      let retType = take();
      if (peek() === '[' && peek(1) === ']') { take(); take(); retType += '[]'; }
      const fnName = identifier();
      take(); // '('
      const params: FnParam[] = [];
      if (peek() !== ')') {
        while (true) {
          let pType = take();
          if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
          let isRef = false;
          if (peek() === '&' || peek() === '*') { take(); isRef = true; }
          const pName = identifier();
          if (peek() === '[' && peek(1) === ']') { take(); take(); pType += '[]'; }
          params.push({ name: pName, type: pType, isRef });
          if (peek() !== ',') break;
          take();
        }
      }
      expect(')');

      if (peek() === ';') {
        take(); // Forward declaration
        continue;
      }

      const fBody = parseStmt();
      if (fnName === 'main' || fnName === 'Main') {
        mainBody = fBody;
      } else {
        functions.set(fnName, { returnType: retType, name: fnName, params, body: fBody });
      }
      continue;
    }

    // Standalone top-level statement
    topStmts.push(parseStmt());
  }

  return { functions, classes, mainBody, topStmts };
}

function evaluateBinary(op: string, a: Value, b: Value): Value {
  switch (op) {
    case '+': return typeof a === 'string' || typeof b === 'string' ? String(a) + String(b) : Number(a) + Number(b);
    case '-': return Number(a) - Number(b);
    case '*': return Number(a) * Number(b);
    case '/': if (Number(b) === 0) throw new Error('Cannot divide by zero.'); return Number(a) / Number(b);
    case '%': if (Number(b) === 0) throw new Error('Cannot divide by zero.'); return Number(a) % Number(b);
    case '==': return a === b;
    case '!=': return a !== b;
    case '<': return a < b;
    case '>': return a > b;
    case '<=': return a <= b;
    case '>=': return a >= b;
    default: throw new Error(`Unsupported operator ${op}.`);
  }
}

const BUILTIN_MATH: Record<string, (...args: any[]) => any> = {
  'Math.Abs': (val) => Math.abs(Number(val)),
  'Math.Sqrt': (val) => Math.sqrt(Number(val)),
  'Math.Pow': (a, b) => Math.pow(Number(a), Number(b)),
  'abs': (val) => Math.abs(Number(val)),
  'sqrt': (val) => Math.sqrt(Number(val)),
  'pow': (a, b) => Math.pow(Number(a), Number(b)),
  'round': (val) => Math.round(Number(val)),
  'floor': (val) => Math.floor(Number(val)),
  'ceil': (val) => Math.ceil(Number(val)),
  'min': (a, b) => Math.min(Number(a), Number(b)),
  'max': (a, b) => Math.max(Number(a), Number(b)),
  'sin': (val) => Math.sin(Number(val)),
  'cos': (val) => Math.cos(Number(val)),
  'tan': (val) => Math.tan(Number(val)),
  'to_string': (val) => String(val),
  'stoi': (val) => parseInt(String(val), 10),
  'stod': (val) => parseFloat(String(val)),
  'int.Parse': (val) => { const text = String(val).trim(); if (!/^[+-]?\d+$/.test(text)) throw new Error('Input must be a whole number.'); return Number(text); },
  'double.Parse': (val) => { if (!String(val).trim() || !Number.isFinite(Number(val))) throw new Error('Input must be a number.'); return Number(val); },
};

/** Synchronous interpreter */
export function interpretPractice(language: 'cpp' | 'csharp', source: string, stdin = ''): CodeRunResult {
  const started = performance.now();
  let output = '';
  let steps = 0;

  const tick = () => {
    if (++steps > 100_000) throw new Error('Practice limit reached. Check for an infinite loop.');
  };
  const write = (val: Value) => {
    output += String(val);
    if (output.length > 1_000_000) throw new Error('Practice output limit reached.');
  };

  let inputBuffer = stdin;
  const readLine = (): string => {
    if (inputBuffer.length === 0) throw new Error('Input is missing. Enter all values in Program input before running.');
    const nlIdx = inputBuffer.indexOf('\n');
    let line = '';
    if (nlIdx === -1) {
      line = inputBuffer.replace(/\r$/, '');
      inputBuffer = '';
    } else {
      line = inputBuffer.slice(0, nlIdx).replace(/\r$/, '');
      inputBuffer = inputBuffer.slice(nlIdx + 1);
    }
    return line;
  };
  const readWord = (): string => {
    inputBuffer = inputBuffer.replace(/^\s+/, '');
    if (inputBuffer.length === 0) throw new Error('Input is missing. Enter all values in Program input before running.');
    const match = /^\S+/.exec(inputBuffer);
    if (!match) throw new Error('Input is missing. Enter all values in Program input before running.');
    const word = match[0];
    inputBuffer = inputBuffer.slice(word.length);
    return word;
  };

  try {
    const { functions, classes, mainBody, topStmts } = parseProgram(language, source);
    let currentScope = new Scope();

    const evalExpr = (node: ExprNode): Value => {
      switch (node.kind) {
        case 'lit': return node.val;
        case 'var': return currentScope.get(node.name).value;
        case 'addressOf': return { __isPtr: true, target: node.name };
        case 'deref': {
          const ptr = evalExpr(node.expr);
          if (ptr && ptr.__isPtr) return currentScope.get(ptr.target).value;
          throw new Error('Cannot dereference non-pointer.');
        }
        case 'unop': {
          const v = evalExpr(node.expr);
          return node.op === '!' ? !v : node.op === '-' ? -Number(v) : Number(v);
        }
        case 'binop': {
          if (node.op === '&&') return evalExpr(node.left) ? Boolean(evalExpr(node.right)) : false;
          if (node.op === '||') return evalExpr(node.left) ? true : Boolean(evalExpr(node.right));
          return evaluateBinary(node.op, evalExpr(node.left), evalExpr(node.right));
        }
        case 'assign': {
          const rVal = evalExpr(node.val);
          let targetVal: Value;
          let setter: (val: Value) => void;

          const targetNode = node.target;
          if (targetNode.kind === 'var') {
            const entry = currentScope.get(targetNode.name);
            targetVal = entry.value;
            setter = (v) => currentScope.set(targetNode.name, v);
          } else if (targetNode.kind === 'index') {
            const arr = currentScope.get(targetNode.target).value;
            const idx = Number(evalExpr(targetNode.index));
            targetVal = arr[idx];
            setter = (v) => { arr[idx] = v; };
          } else if (targetNode.kind === 'deref') {
            const ptr = currentScope.get(targetNode.name).value;
            if (!ptr || !ptr.__isPtr) throw new Error('Cannot dereference non-pointer.');
            targetVal = currentScope.get(ptr.target).value;
            setter = (v) => currentScope.set(ptr.target, v);
          } else if (targetNode.kind === 'member') {
            const obj = currentScope.get(targetNode.target).value;
            targetVal = obj[targetNode.prop];
            setter = (v) => { obj[targetNode.prop] = v; };
          } else {
            throw new Error('Unsupported assignment target.');
          }

          const nextVal = node.op === '=' ? rVal : evaluateBinary(node.op === '--' ? '-' : node.op[0], targetVal, rVal);
          setter(nextVal);
          return nextVal;
        }
        case 'call': {
          if (node.name === 'Console.ReadLine') return readLine();
          if (BUILTIN_MATH[node.name]) return BUILTIN_MATH[node.name](...node.args.map(evalExpr));
          const fn = functions.get(node.name);
          if (!fn) throw new Error(`Function ${node.name}() has not been defined.`);
          const prevScope = currentScope;
          currentScope = new Scope(prevScope);
          try {
            for (let i = 0; i < fn.params.length; i++) {
              const p = fn.params[i];
              const aVal = node.args[i] ? evalExpr(node.args[i]) : 0;
              currentScope.vars.set(p.name, { type: p.type, value: aVal });
            }
            execStmt(fn.body);
            return undefined;
          } catch (e: any) {
            if (e && e[RETURN_SYM] !== undefined) return e[RETURN_SYM];
            throw e;
          } finally {
            currentScope = prevScope;
          }
        }
        case 'instantiate': {
          const cls = classes.get(node.className);
          if (!cls) throw new Error(`Class ${node.className} is not defined.`);
          const inst: any = { __class: node.className, __methods: cls.methods };
          for (const f of cls.fields) {
            inst[f.name] = f.init ? evalExpr(f.init) : (f.type === 'string' ? '' : f.type === 'bool' ? false : 0);
          }
          if (cls.constructorDef) {
            const prevScope = currentScope;
            currentScope = new Scope(prevScope);
            try {
              for (const k of Object.keys(inst)) {
                if (k !== '__class' && k !== '__methods') {
                  currentScope.vars.set(k, { type: 'var', value: inst[k] });
                }
              }
              for (let i = 0; i < cls.constructorDef.params.length; i++) {
                const param = cls.constructorDef.params[i];
                const aVal = node.args[i] ? evalExpr(node.args[i]) : 0;
                currentScope.vars.set(param.name, { type: param.type, value: aVal });
              }
              execStmt(cls.constructorDef.body);
              for (const [k, v] of currentScope.vars.entries()) {
                if (k in inst) inst[k] = v.value;
              }
            } finally {
              currentScope = prevScope;
            }
          }
          return inst;
        }
        case 'index': {
          const target = evalExpr(node.target);
          const idx = Number(evalExpr(node.index));
          return target[idx];
        }
        case 'member': {
          const target = evalExpr(node.target);
          if (target == null) throw new Error(`Cannot access property ${node.prop} of null.`);
          if (node.prop === 'length' || node.prop === 'size') return target.length;
          return target[node.prop];
        }
        case 'memberCall': {
          const target = evalExpr(node.target);
          if (target == null) throw new Error(`Cannot access method ${node.method} of null.`);
          if (typeof target === 'string') {
            if (node.method === 'length' || node.method === 'size') return target.length;
            if (node.method === 'substr') {
              const a = node.args.map(evalExpr);
              return target.substring(a[0], a[1] !== undefined ? a[0] + a[1] : undefined);
            }
          }
          if (Array.isArray(target)) {
            if (node.method === 'size' || node.method === 'length') return target.length;
            if (node.method === 'push_back') return target.push(evalExpr(node.args[0]));
            if (node.method === 'pop_back') return target.pop();
          }
          if (typeof target === 'object' && target.__methods?.has(node.method)) {
            const mDef: FnDef = target.__methods.get(node.method);
            const prevScope = currentScope;
            currentScope = new Scope(prevScope);
            try {
              for (const k of Object.keys(target)) {
                if (k !== '__class' && k !== '__methods') {
                  currentScope.vars.set(k, { type: 'var', value: target[k] });
                }
              }
              for (let i = 0; i < mDef.params.length; i++) {
                const param = mDef.params[i];
                const aVal = node.args[i] ? evalExpr(node.args[i]) : 0;
                currentScope.vars.set(param.name, { type: param.type, value: aVal });
              }
              execStmt(mDef.body);
              for (const [k, v] of currentScope.vars.entries()) {
                if (k in target) target[k] = v.value;
              }
              return undefined;
            } catch (e: any) {
              if (e && e[RETURN_SYM] !== undefined) return e[RETURN_SYM];
              throw e;
            } finally {
              currentScope = prevScope;
            }
          }
          throw new Error(`Method ${node.method} not found.`);
        }
        default: return undefined;
      }
    };

    const execStmt = (node: StmtNode) => {
      tick();
      switch (node.kind) {
        case 'empty': break;
        case 'expr': evalExpr(node.expr); break;
        case 'block': {
          const prevScope = currentScope;
          currentScope = new Scope(prevScope);
          try {
            for (const s of node.stmts) execStmt(s);
          } finally {
            currentScope = prevScope;
          }
          break;
        }
        case 'varDecl': {
          for (const d of node.decls) {
            if (d.arrayInit || d.arraySize) {
              const arr = d.arrayInit ? d.arrayInit.map(evalExpr) : [];
              currentScope.vars.set(d.name, { type: 'array', value: arr });
            } else if (d.isPtr) {
              const ptrVal = d.init ? evalExpr(d.init) : null;
              currentScope.vars.set(d.name, { type: 'pointer', value: ptrVal });
            } else {
              const initVal = d.init ? evalExpr(d.init) : (node.varType === 'string' ? '' : node.varType === 'bool' ? false : 0);
              currentScope.vars.set(d.name, { type: node.varType, value: initVal });
            }
          }
          break;
        }
        case 'instantiateDecl': {
          const obj = evalExpr({ kind: 'instantiate', className: node.className, args: node.args });
          currentScope.vars.set(node.name, { type: node.className, value: obj });
          break;
        }
        case 'if': {
          if (evalExpr(node.cond)) execStmt(node.thenStmt);
          else if (node.elseStmt) execStmt(node.elseStmt);
          break;
        }
        case 'switch': {
          const target = evalExpr(node.expr);
          let matched = false;
          try {
            for (const c of node.cases) {
              if (!matched) {
                if (c.val) {
                  if (evalExpr(c.val) == target) matched = true;
                } else matched = true;
              }
              if (matched) {
                for (const s of c.stmts) execStmt(s);
              }
            }
          } catch (e) {
            if (e === BREAK_SYM) return;
            throw e;
          }
          break;
        }
        case 'while': {
          while (evalExpr(node.cond)) {
            try { execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) continue;
              throw e;
            }
          }
          break;
        }
        case 'doWhile': {
          do {
            try { execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) continue;
              throw e;
            }
          } while (evalExpr(node.cond));
          break;
        }
        case 'for': {
          if (node.init) execStmt(node.init);
          while (node.cond ? evalExpr(node.cond) : true) {
            try { execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) {
                if (node.update) evalExpr(node.update);
                continue;
              }
              throw e;
            }
            if (node.update) evalExpr(node.update);
          }
          break;
        }
        case 'break': throw BREAK_SYM;
        case 'continue': throw CONTINUE_SYM;
        case 'return': throw { [RETURN_SYM]: node.expr ? evalExpr(node.expr) : undefined };
        case 'cout': {
          for (const p of node.parts) {
            if (p === 'endl') write('\n');
            else write(evalExpr(p));
          }
          break;
        }
        case 'cin': {
          for (const name of node.targets) {
            const raw = readWord();
            const entry = currentScope.get(name);
            if (['int', 'double', 'float'].includes(entry.type)) {
              const num = Number(raw);
              if (!Number.isFinite(num) || (entry.type === 'int' && !/^[+-]?\d+$/.test(raw))) {
                throw new Error(`Expected a number for ${name}.`);
              }
              currentScope.set(name, num);
            } else {
              currentScope.set(name, raw);
            }
          }
          break;
        }
        case 'getline': {
          const line = readLine();
          currentScope.set(node.target, line);
          break;
        }
        case 'consoleWrite': {
          write(evalExpr(node.expr));
          if (node.newline) write('\n');
          break;
        }
      }
    };

    if (mainBody) {
      try { execStmt(mainBody); }
      catch (e: any) {
        if (e && e[RETURN_SYM] !== undefined) { /* normal exit */ }
        else throw e;
      }
    } else {
      for (const s of topStmts) execStmt(s);
    }

    const lines = output ? output.split('\n') : [];
    if (lines.at(-1) === '') lines.pop();
    return { success: true, output: lines, diagnostics: [], executionTime: Math.round(performance.now() - started), mode: 'practice' };
  } catch (error: any) {
    const lines = output ? output.split('\n') : [];
    if (lines.at(-1) === '') lines.pop();
    return { success: false, output: lines, error: error instanceof Error ? error.message : 'Unsupported control flow.', diagnostics: [], executionTime: Math.round(performance.now() - started), mode: 'practice' };
  }
}

/** Asynchronous interactive interpreter with streaming and live input */
export async function interpretPracticeAsync(
  language: 'cpp' | 'csharp',
  source: string,
  stdin = '',
  signal?: AbortSignal,
  callbacks?: PracticeCallbacks
): Promise<CodeRunResult> {
  const started = performance.now();
  let output = '';
  let steps = 0;

  const getLines = () => {
    const lines = output ? output.split('\n') : [];
    if (lines.at(-1) === '') lines.pop();
    return lines;
  };

  const tick = async () => {
    if (signal?.aborted) throw new DOMException('Run cancelled.', 'AbortError');
    if (++steps > 200_000) throw new Error('Practice limit reached. Check for an infinite loop.');
    if (steps % 300 === 0) {
      await new Promise(r => setTimeout(r, 0));
      if (signal?.aborted) throw new DOMException('Run cancelled.', 'AbortError');
    }
  };

  const write = (val: Value) => {
    output += String(val);
    if (output.length > 1_000_000) throw new Error('Practice output limit reached.');
    callbacks?.onOutput?.(getLines());
  };

  let inputBuffer = stdin;
  const readLine = async (): Promise<string> => {
    if (inputBuffer.length > 0) {
      const nlIdx = inputBuffer.indexOf('\n');
      let line = '';
      if (nlIdx === -1) {
        line = inputBuffer.replace(/\r$/, '');
        inputBuffer = '';
      } else {
        line = inputBuffer.slice(0, nlIdx).replace(/\r$/, '');
        inputBuffer = inputBuffer.slice(nlIdx + 1);
      }
      return line;
    }
    if (!callbacks?.onInput) throw new Error('Input is missing. Enter all values in Program input before running.');
    return new Promise((resolve) => {
      callbacks.onInput!('line', (val) => {
        output += val + '\n';
        callbacks?.onOutput?.(getLines());
        resolve(val);
      });
    });
  };

  const readWord = async (): Promise<string> => {
    inputBuffer = inputBuffer.replace(/^\s+/, '');
    if (inputBuffer.length > 0) {
      const match = /^\S+/.exec(inputBuffer);
      if (match) {
        const word = match[0];
        inputBuffer = inputBuffer.slice(word.length);
        return word;
      }
    }
    if (!callbacks?.onInput) throw new Error('Input is missing. Enter all values in Program input before running.');
    return new Promise((resolve) => {
      callbacks.onInput!('line', (val) => {
        output += val + '\n';
        callbacks?.onOutput?.(getLines());
        inputBuffer += (inputBuffer ? ' ' : '') + val;
        inputBuffer = inputBuffer.replace(/^\s+/, '');
        const match = /^\S+/.exec(inputBuffer);
        if (match) {
          const word = match[0];
          inputBuffer = inputBuffer.slice(word.length);
          resolve(word);
        } else {
          resolve(val);
        }
      });
    });
  };

  try {
    const { functions, classes, mainBody, topStmts } = parseProgram(language, source);
    let currentScope = new Scope();

    const evalExpr = async (node: ExprNode): Promise<Value> => {
      await tick();
      switch (node.kind) {
        case 'lit': return node.val;
        case 'var': return currentScope.get(node.name).value;
        case 'addressOf': return { __isPtr: true, target: node.name };
        case 'deref': {
          const ptr = await evalExpr(node.expr);
          if (ptr && ptr.__isPtr) return currentScope.get(ptr.target).value;
          throw new Error('Cannot dereference non-pointer.');
        }
        case 'unop': {
          const v = await evalExpr(node.expr);
          return node.op === '!' ? !v : node.op === '-' ? -Number(v) : Number(v);
        }
        case 'binop': {
          if (node.op === '&&') return (await evalExpr(node.left)) ? Boolean(await evalExpr(node.right)) : false;
          if (node.op === '||') return (await evalExpr(node.left)) ? true : Boolean(await evalExpr(node.right));
          const [l, r] = await Promise.all([evalExpr(node.left), evalExpr(node.right)]);
          return evaluateBinary(node.op, l, r);
        }
        case 'assign': {
          const rVal = await evalExpr(node.val);
          let targetVal: Value;
          let setter: (val: Value) => void;

          const targetNodeAsync = node.target;
          if (targetNodeAsync.kind === 'var') {
            const entry = currentScope.get(targetNodeAsync.name);
            targetVal = entry.value;
            setter = (v) => currentScope.set(targetNodeAsync.name, v);
          } else if (targetNodeAsync.kind === 'index') {
            const arr = currentScope.get(targetNodeAsync.target).value;
            const idx = Number(await evalExpr(targetNodeAsync.index));
            targetVal = arr[idx];
            setter = (v) => { arr[idx] = v; };
          } else if (targetNodeAsync.kind === 'deref') {
            const ptr = currentScope.get(targetNodeAsync.name).value;
            if (!ptr || !ptr.__isPtr) throw new Error('Cannot dereference non-pointer.');
            targetVal = currentScope.get(ptr.target).value;
            setter = (v) => currentScope.set(ptr.target, v);
          } else if (targetNodeAsync.kind === 'member') {
            const obj = currentScope.get(targetNodeAsync.target).value;
            targetVal = obj[targetNodeAsync.prop];
            setter = (v) => { obj[targetNodeAsync.prop] = v; };
          } else {
            throw new Error('Unsupported assignment target.');
          }

          const nextVal = node.op === '=' ? rVal : evaluateBinary(node.op === '--' ? '-' : node.op[0], targetVal, rVal);
          setter(nextVal);
          return nextVal;
        }
        case 'call': {
          if (node.name === 'Console.ReadLine') return await readLine();
          if (BUILTIN_MATH[node.name]) {
            const args: any[] = [];
            for (const a of node.args) args.push(await evalExpr(a));
            return BUILTIN_MATH[node.name](...args);
          }
          const fn = functions.get(node.name);
          if (!fn) throw new Error(`Function ${node.name}() has not been defined.`);
          const prevScope = currentScope;
          currentScope = new Scope(prevScope);
          try {
            for (let i = 0; i < fn.params.length; i++) {
              const p = fn.params[i];
              const aVal = node.args[i] ? await evalExpr(node.args[i]) : 0;
              currentScope.vars.set(p.name, { type: p.type, value: aVal });
            }
            await execStmt(fn.body);
            return undefined;
          } catch (e: any) {
            if (e && e[RETURN_SYM] !== undefined) return e[RETURN_SYM];
            throw e;
          } finally {
            currentScope = prevScope;
          }
        }
        case 'instantiate': {
          const cls = classes.get(node.className);
          if (!cls) throw new Error(`Class ${node.className} is not defined.`);
          const inst: any = { __class: node.className, __methods: cls.methods };
          for (const f of cls.fields) {
            inst[f.name] = f.init ? await evalExpr(f.init) : (f.type === 'string' ? '' : f.type === 'bool' ? false : 0);
          }
          if (cls.constructorDef) {
            const prevScope = currentScope;
            currentScope = new Scope(prevScope);
            try {
              for (const k of Object.keys(inst)) {
                if (k !== '__class' && k !== '__methods') {
                  currentScope.vars.set(k, { type: 'var', value: inst[k] });
                }
              }
              for (let i = 0; i < cls.constructorDef.params.length; i++) {
                const param = cls.constructorDef.params[i];
                const aVal = node.args[i] ? await evalExpr(node.args[i]) : 0;
                currentScope.vars.set(param.name, { type: param.type, value: aVal });
              }
              await execStmt(cls.constructorDef.body);
              for (const [k, v] of currentScope.vars.entries()) {
                if (k in inst) inst[k] = v.value;
              }
            } finally {
              currentScope = prevScope;
            }
          }
          return inst;
        }
        case 'index': {
          const target = await evalExpr(node.target);
          const idx = Number(await evalExpr(node.index));
          return target[idx];
        }
        case 'member': {
          const target = await evalExpr(node.target);
          if (target == null) throw new Error(`Cannot access property ${node.prop} of null.`);
          if (node.prop === 'length' || node.prop === 'size') return target.length;
          return target[node.prop];
        }
        case 'memberCall': {
          const target = await evalExpr(node.target);
          if (target == null) throw new Error(`Cannot access method ${node.method} of null.`);
          if (typeof target === 'string') {
            if (node.method === 'length' || node.method === 'size') return target.length;
            if (node.method === 'substr') {
              const a: any[] = [];
              for (const arg of node.args) a.push(await evalExpr(arg));
              return target.substring(a[0], a[1] !== undefined ? a[0] + a[1] : undefined);
            }
          }
          if (Array.isArray(target)) {
            if (node.method === 'size' || node.method === 'length') return target.length;
            if (node.method === 'push_back') return target.push(await evalExpr(node.args[0]));
            if (node.method === 'pop_back') return target.pop();
          }
          if (typeof target === 'object' && target.__methods?.has(node.method)) {
            const mDef: FnDef = target.__methods.get(node.method);
            const prevScope = currentScope;
            currentScope = new Scope(prevScope);
            try {
              for (const k of Object.keys(target)) {
                if (k !== '__class' && k !== '__methods') {
                  currentScope.vars.set(k, { type: 'var', value: target[k] });
                }
              }
              for (let i = 0; i < mDef.params.length; i++) {
                const param = mDef.params[i];
                const aVal = node.args[i] ? await evalExpr(node.args[i]) : 0;
                currentScope.vars.set(param.name, { type: param.type, value: aVal });
              }
              await execStmt(mDef.body);
              for (const [k, v] of currentScope.vars.entries()) {
                if (k in target) target[k] = v.value;
              }
              return undefined;
            } catch (e: any) {
              if (e && e[RETURN_SYM] !== undefined) return e[RETURN_SYM];
              throw e;
            } finally {
              currentScope = prevScope;
            }
          }
          throw new Error(`Method ${node.method} not found.`);
        }
        default: return undefined;
      }
    };

    const execStmt = async (node: StmtNode): Promise<void> => {
      await tick();
      switch (node.kind) {
        case 'empty': break;
        case 'expr': await evalExpr(node.expr); break;
        case 'block': {
          const prevScope = currentScope;
          currentScope = new Scope(prevScope);
          try {
            for (const s of node.stmts) await execStmt(s);
          } finally {
            currentScope = prevScope;
          }
          break;
        }
        case 'varDecl': {
          for (const d of node.decls) {
            if (d.arrayInit || d.arraySize) {
              const arr: Value[] = [];
              if (d.arrayInit) {
                for (const item of d.arrayInit) arr.push(await evalExpr(item));
              }
              currentScope.vars.set(d.name, { type: 'array', value: arr });
            } else if (d.isPtr) {
              const ptrVal = d.init ? await evalExpr(d.init) : null;
              currentScope.vars.set(d.name, { type: 'pointer', value: ptrVal });
            } else {
              const initVal = d.init ? await evalExpr(d.init) : (node.varType === 'string' ? '' : node.varType === 'bool' ? false : 0);
              currentScope.vars.set(d.name, { type: node.varType, value: initVal });
            }
          }
          break;
        }
        case 'instantiateDecl': {
          const obj = await evalExpr({ kind: 'instantiate', className: node.className, args: node.args });
          currentScope.vars.set(node.name, { type: node.className, value: obj });
          break;
        }
        case 'if': {
          if (await evalExpr(node.cond)) await execStmt(node.thenStmt);
          else if (node.elseStmt) await execStmt(node.elseStmt);
          break;
        }
        case 'switch': {
          const target = await evalExpr(node.expr);
          let matched = false;
          try {
            for (const c of node.cases) {
              if (!matched) {
                if (c.val) {
                  if ((await evalExpr(c.val)) == target) matched = true;
                } else matched = true;
              }
              if (matched) {
                for (const s of c.stmts) await execStmt(s);
              }
            }
          } catch (e) {
            if (e === BREAK_SYM) return;
            throw e;
          }
          break;
        }
        case 'while': {
          while (await evalExpr(node.cond)) {
            try { await execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) continue;
              throw e;
            }
          }
          break;
        }
        case 'doWhile': {
          do {
            try { await execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) continue;
              throw e;
            }
          } while (await evalExpr(node.cond));
          break;
        }
        case 'for': {
          if (node.init) await execStmt(node.init);
          while (node.cond ? await evalExpr(node.cond) : true) {
            try { await execStmt(node.body); }
            catch (e) {
              if (e === BREAK_SYM) break;
              if (e === CONTINUE_SYM) {
                if (node.update) await evalExpr(node.update);
                continue;
              }
              throw e;
            }
            if (node.update) await evalExpr(node.update);
          }
          break;
        }
        case 'break': throw BREAK_SYM;
        case 'continue': throw CONTINUE_SYM;
        case 'return': throw { [RETURN_SYM]: node.expr ? await evalExpr(node.expr) : undefined };
        case 'cout': {
          for (const p of node.parts) {
            if (p === 'endl') write('\n');
            else write(await evalExpr(p));
          }
          break;
        }
        case 'cin': {
          for (const name of node.targets) {
            const raw = await readWord();
            const entry = currentScope.get(name);
            if (['int', 'double', 'float'].includes(entry.type)) {
              const num = Number(raw);
              if (!Number.isFinite(num) || (entry.type === 'int' && !/^[+-]?\d+$/.test(raw))) {
                throw new Error(`Expected a number for ${name}.`);
              }
              currentScope.set(name, num);
            } else {
              currentScope.set(name, raw);
            }
          }
          break;
        }
        case 'getline': {
          const line = await readLine();
          currentScope.set(node.target, line);
          break;
        }
        case 'consoleWrite': {
          write(await evalExpr(node.expr));
          if (node.newline) write('\n');
          break;
        }
      }
    };

    if (mainBody) {
      try { await execStmt(mainBody); }
      catch (e: any) {
        if (e && e[RETURN_SYM] !== undefined) { /* normal exit */ }
        else throw e;
      }
    } else {
      for (const s of topStmts) await execStmt(s);
    }

    return { success: true, output: getLines(), diagnostics: [], executionTime: Math.round(performance.now() - started), mode: 'practice' };
  } catch (error: any) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    return { success: false, output: getLines(), error: error instanceof Error ? error.message : 'Unsupported control flow.', diagnostics: [], executionTime: Math.round(performance.now() - started), mode: 'practice' };
  }
}

