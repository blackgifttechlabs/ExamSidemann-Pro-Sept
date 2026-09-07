/**
 * A VB.NET interpreter for the Windows Forms lab: lexer, parser and an async
 * evaluator that runs event handlers against the live controls on the form.
 *
 * The language covered is the one the syllabus examines — Dim, If/ElseIf,
 * For/Next, Do/Loop, While, Select Case, Sub and Function, arrays, Try/Catch,
 * the string and maths functions, MsgBox and InputBox — with the control
 * properties (`TextBox1.Text`, `ListBox1.Items.Add`, `Timer1.Start`) wired to
 * whatever the designer put on the form.
 *
 * The evaluator is async because MsgBox and InputBox are modal: the running
 * program has to stop while the dialog is up, and a synchronous interpreter in
 * a browser cannot do that without `window.alert`.
 */

/* --------------------------------------------------------------- diagnostics */

export interface VbDiagnostic {
  severity: 'error' | 'warning';
  message: string;
  line: number;
  column: number;
}

export class VbRuntimeError extends Error {
  constructor(message: string, public line: number) {
    super(message);
    this.name = 'VbRuntimeError';
  }
}

/* --------------------------------------------------------------------- lexer */

type TokenKind = 'number' | 'string' | 'identifier' | 'operator' | 'eol' | 'eof';

interface Token {
  kind: TokenKind;
  value: string;
  /** Lower-cased identifier text, so keyword tests stay case-insensitive. */
  lower: string;
  line: number;
  column: number;
}

const OPERATORS = [
  '<=', '>=', '<>', '+=', '-=', '*=', '/=', '&=',
  '=', '<', '>', '+', '-', '*', '/', '\\', '^', '&', '(', ')', ',', '.', '{', '}',
];

const tokenize = (source: string, diagnostics: VbDiagnostic[]): Token[] => {
  const tokens: Token[] = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((rawLine, lineIndex) => {
    const line = lineIndex + 1;
    let index = 0;
    let continued = false;

    while (index < rawLine.length) {
      const char = rawLine[index];

      if (char === ' ' || char === '\t') {
        index += 1;
        continue;
      }

      // Comments run to the end of the line.
      if (char === "'" || rawLine.slice(index, index + 4).toLowerCase() === 'rem ') {
        break;
      }

      // A trailing underscore continues the statement on the next line.
      if (char === '_' && rawLine.slice(index + 1).trim() === '') {
        continued = true;
        break;
      }

      // `:` separates statements on one line.
      if (char === ':') {
        tokens.push({ kind: 'eol', value: ':', lower: ':', line, column: index + 1 });
        index += 1;
        continue;
      }

      if (char === '"') {
        let text = '';
        let cursor = index + 1;
        let closed = false;
        while (cursor < rawLine.length) {
          if (rawLine[cursor] === '"') {
            if (rawLine[cursor + 1] === '"') {
              text += '"';
              cursor += 2;
              continue;
            }
            closed = true;
            cursor += 1;
            break;
          }
          text += rawLine[cursor];
          cursor += 1;
        }
        if (!closed) {
          diagnostics.push({
            severity: 'error',
            message: 'Closing quote missing from string constant.',
            line,
            column: index + 1,
          });
        }
        tokens.push({ kind: 'string', value: text, lower: text.toLowerCase(), line, column: index + 1 });
        index = cursor;
        continue;
      }

      if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(rawLine[index + 1] || ''))) {
        let cursor = index;
        while (cursor < rawLine.length && /[0-9.]/.test(rawLine[cursor])) cursor += 1;
        const text = rawLine.slice(index, cursor);
        tokens.push({ kind: 'number', value: text, lower: text, line, column: index + 1 });
        index = cursor;
        continue;
      }

      if (/[A-Za-z_]/.test(char)) {
        let cursor = index;
        while (cursor < rawLine.length && /[A-Za-z0-9_]/.test(rawLine[cursor])) cursor += 1;
        const text = rawLine.slice(index, cursor);
        tokens.push({
          kind: 'identifier',
          value: text,
          lower: text.toLowerCase(),
          line,
          column: index + 1,
        });
        index = cursor;
        continue;
      }

      const operator = OPERATORS.find((candidate) => rawLine.startsWith(candidate, index));
      if (operator) {
        tokens.push({ kind: 'operator', value: operator, lower: operator, line, column: index + 1 });
        index += operator.length;
        continue;
      }

      diagnostics.push({
        severity: 'error',
        message: `Character is not valid: '${char}'.`,
        line,
        column: index + 1,
      });
      index += 1;
    }

    if (!continued) {
      tokens.push({ kind: 'eol', value: '\n', lower: '\n', line, column: rawLine.length + 1 });
    }
  });

  tokens.push({ kind: 'eof', value: '', lower: '', line: lines.length + 1, column: 1 });
  return tokens;
};

/* ---------------------------------------------------------------------- AST */

export type Expr =
  | { t: 'number'; value: number }
  | { t: 'string'; value: string }
  | { t: 'boolean'; value: boolean }
  | { t: 'nothing' }
  | { t: 'identifier'; name: string; line: number }
  | { t: 'member'; target: Expr; name: string; line: number }
  | { t: 'call'; callee: Expr; args: Expr[]; line: number }
  | { t: 'unary'; op: string; operand: Expr; line: number }
  | { t: 'binary'; op: string; left: Expr; right: Expr; line: number }
  | { t: 'new'; typeName: string; args: Expr[]; line: number };

interface CaseTest {
  kind: 'value' | 'range' | 'compare';
  value?: Expr;
  from?: Expr;
  to?: Expr;
  op?: string;
}

export type Stmt =
  | { t: 'dim'; declarations: Array<{ name: string; size?: Expr; typeName?: string; init?: Expr }>; line: number }
  | { t: 'assign'; target: Expr; op: string; value: Expr; line: number }
  | { t: 'expression'; expr: Expr; line: number }
  | { t: 'if'; branches: Array<{ condition: Expr; body: Stmt[] }>; elseBody: Stmt[] | null; line: number }
  | {
      t: 'for';
      variable: string;
      from: Expr;
      to: Expr;
      step: Expr | null;
      body: Stmt[];
      line: number;
    }
  | { t: 'foreach'; variable: string; iterable: Expr; body: Stmt[]; line: number }
  | { t: 'while'; condition: Expr; body: Stmt[]; line: number }
  | {
      t: 'do';
      test: { when: 'pre' | 'post'; kind: 'while' | 'until'; condition: Expr } | null;
      body: Stmt[];
      line: number;
    }
  | {
      t: 'select';
      subject: Expr;
      cases: Array<{ tests: CaseTest[]; body: Stmt[] }>;
      elseBody: Stmt[] | null;
      line: number;
    }
  | { t: 'return'; value: Expr | null; line: number }
  | { t: 'exit'; what: string; line: number }
  | {
      t: 'try';
      body: Stmt[];
      catchVariable: string | null;
      catchBody: Stmt[];
      finallyBody: Stmt[];
      line: number;
    }
  | { t: 'end'; line: number };

export interface VbProcedure {
  name: string;
  kind: 'sub' | 'function';
  parameters: Array<{ name: string; byRef: boolean }>;
  body: Stmt[];
  /** "Button1.Click" from the Handles clause. */
  handles: string[];
  line: number;
}

export interface VbModule {
  className: string;
  procedures: VbProcedure[];
  moduleVariables: Stmt[];
  diagnostics: VbDiagnostic[];
}

/* ------------------------------------------------------------------- parser */

const BLOCK_ENDERS = new Set([
  'end', 'else', 'elseif', 'next', 'loop', 'case', 'catch', 'finally', 'wend',
]);

class Parser {
  private position = 0;

  constructor(private tokens: Token[], private diagnostics: VbDiagnostic[]) {}

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.position + offset, this.tokens.length - 1)];
  }

  private next(): Token {
    const token = this.peek();
    if (this.position < this.tokens.length - 1) this.position += 1;
    return token;
  }

  private isKeyword(word: string, offset = 0) {
    const token = this.peek(offset);
    return token.kind === 'identifier' && token.lower === word;
  }

  private isOperator(symbol: string, offset = 0) {
    const token = this.peek(offset);
    return token.kind === 'operator' && token.value === symbol;
  }

  private accept(word: string) {
    if (this.isKeyword(word)) {
      this.next();
      return true;
    }
    return false;
  }

  private expectOperator(symbol: string) {
    if (this.isOperator(symbol)) {
      this.next();
      return true;
    }
    this.error(`Expected '${symbol}'.`);
    return false;
  }

  private error(message: string, token = this.peek()) {
    if (this.diagnostics.length < 60) {
      this.diagnostics.push({ severity: 'error', message, line: token.line, column: token.column });
    }
  }

  private skipBlankLines() {
    while (this.peek().kind === 'eol') this.next();
  }

  /** Steps past everything up to and including the next end-of-line. */
  private skipLine() {
    while (this.peek().kind !== 'eol' && this.peek().kind !== 'eof') this.next();
    if (this.peek().kind === 'eol') this.next();
  }

  private endOfStatement() {
    if (this.peek().kind === 'eol') {
      this.next();
      return;
    }
    if (this.peek().kind === 'eof') return;
    this.error(`End of statement expected, found '${this.peek().value}'.`);
    this.skipLine();
  }

  parseModule(): VbModule {
    const module: VbModule = {
      className: 'Form1',
      procedures: [],
      moduleVariables: [],
      diagnostics: this.diagnostics,
    };

    this.skipBlankLines();
    while (this.peek().kind !== 'eof') {
      // Imports / Option / Class wrappers are recognised and skipped.
      if (this.isKeyword('imports') || this.isKeyword('option')) {
        this.skipLine();
        this.skipBlankLines();
        continue;
      }

      const modifiers = this.parseModifiers();

      if (this.isKeyword('class') || this.isKeyword('module')) {
        this.next();
        const name = this.peek();
        if (name.kind === 'identifier') {
          module.className = name.value;
          this.next();
        }
        this.skipLine();
        this.skipBlankLines();
        continue;
      }

      if (this.isKeyword('end') && (this.isKeyword('class', 1) || this.isKeyword('module', 1))) {
        this.skipLine();
        this.skipBlankLines();
        continue;
      }

      if (this.isKeyword('sub') || this.isKeyword('function')) {
        const procedure = this.parseProcedure();
        if (procedure) module.procedures.push(procedure);
        this.skipBlankLines();
        continue;
      }

      if (this.isKeyword('dim') || this.isKeyword('const') || modifiers.length > 0) {
        const statement = this.parseStatement();
        if (statement) module.moduleVariables.push(statement);
        this.skipBlankLines();
        continue;
      }

      const statement = this.parseStatement();
      if (statement) module.moduleVariables.push(statement);
      this.skipBlankLines();
    }

    return module;
  }

  private parseModifiers(): string[] {
    const found: string[] = [];
    const modifiers = ['public', 'private', 'protected', 'friend', 'shared', 'overrides', 'partial', 'static', 'withevents', 'readonly'];
    while (this.peek().kind === 'identifier' && modifiers.includes(this.peek().lower)) {
      found.push(this.next().lower);
    }
    return found;
  }

  private parseProcedure(): VbProcedure | null {
    const start = this.peek();
    const kind = this.next().lower === 'sub' ? 'sub' : 'function';
    const nameToken = this.next();
    if (nameToken.kind !== 'identifier') {
      this.error('Expected a procedure name.', nameToken);
      this.skipLine();
      return null;
    }

    const parameters: Array<{ name: string; byRef: boolean }> = [];
    if (this.isOperator('(')) {
      this.next();
      while (!this.isOperator(')') && this.peek().kind !== 'eol' && this.peek().kind !== 'eof') {
        let byRef = false;
        if (this.isKeyword('byval')) this.next();
        else if (this.isKeyword('byref')) {
          byRef = true;
          this.next();
        }
        const parameter = this.next();
        if (parameter.kind === 'identifier') {
          parameters.push({ name: parameter.value, byRef });
        }
        // `As Type`, including generic-free array notation.
        if (this.isOperator('(')) {
          this.next();
          if (this.isOperator(')')) this.next();
        }
        if (this.accept('as')) {
          this.parseTypeName();
        }
        if (this.isOperator(',')) this.next();
      }
      this.expectOperator(')');
    }

    if (this.accept('as')) this.parseTypeName();

    const handles: string[] = [];
    if (this.accept('handles')) {
      while (this.peek().kind === 'identifier') {
        let target = this.next().value;
        while (this.isOperator('.')) {
          this.next();
          const member = this.next();
          target += `.${member.value}`;
        }
        handles.push(target);
        if (this.isOperator(',')) this.next();
        else break;
      }
    }

    this.endOfStatement();
    const body = this.parseBlock(['end']);
    // Consume "End Sub" / "End Function".
    if (this.isKeyword('end')) {
      this.next();
      if (this.peek().kind === 'identifier') this.next();
      this.endOfStatement();
    } else {
      this.error(`'${kind === 'sub' ? 'Sub' : 'Function'} ${nameToken.value}' must end with a matching 'End ${kind === 'sub' ? 'Sub' : 'Function'}'.`, start);
    }

    return { name: nameToken.value, kind, parameters, body, handles, line: start.line };
  }

  private parseTypeName(): string {
    let name = '';
    if (this.peek().kind === 'identifier') {
      name = this.next().value;
      while (this.isOperator('.')) {
        this.next();
        if (this.peek().kind === 'identifier') name += `.${this.next().value}`;
      }
    }
    // Array types: `As Integer()`
    if (this.isOperator('(')) {
      this.next();
      if (this.isOperator(')')) this.next();
    }
    return name;
  }

  /** Reads statements until one of the given keywords starts a line. */
  private parseBlock(stopWords: string[]): Stmt[] {
    const body: Stmt[] = [];
    const stop = new Set(stopWords);

    while (this.peek().kind !== 'eof') {
      this.skipBlankLines();
      if (this.peek().kind === 'eof') break;
      const token = this.peek();
      if (token.kind === 'identifier' && (stop.has(token.lower) || BLOCK_ENDERS.has(token.lower))) {
        if (stop.has(token.lower)) break;
        // A block ender we were not expecting: stop anyway so the outer parser
        // can report it rather than looping forever.
        break;
      }
      const statement = this.parseStatement();
      if (statement) body.push(statement);
    }
    return body;
  }

  private parseStatement(): Stmt | null {
    this.parseModifiers();
    const token = this.peek();
    const line = token.line;

    if (token.kind === 'eol') {
      this.next();
      return null;
    }

    if (token.kind === 'identifier') {
      switch (token.lower) {
        case 'dim':
        case 'const':
          return this.parseDim();
        case 'if':
          return this.parseIf();
        case 'for':
          return this.parseFor();
        case 'while':
          return this.parseWhile();
        case 'do':
          return this.parseDo();
        case 'select':
          return this.parseSelect();
        case 'try':
          return this.parseTry();
        case 'return': {
          this.next();
          const value = this.peek().kind === 'eol' ? null : this.parseExpression();
          this.endOfStatement();
          return { t: 'return', value, line };
        }
        case 'exit': {
          this.next();
          const what = this.peek().kind === 'identifier' ? this.next().lower : 'sub';
          this.endOfStatement();
          return { t: 'exit', what, line };
        }
        case 'continue': {
          this.skipLine();
          return null;
        }
        case 'call': {
          this.next();
          const expr = this.parseExpression();
          this.endOfStatement();
          return { t: 'expression', expr, line };
        }
        case 'end': {
          // A bare `End` stops the program; `End If` and friends belong to blocks.
          if (this.peek(1).kind === 'eol' || this.peek(1).kind === 'eof') {
            this.next();
            this.endOfStatement();
            return { t: 'end', line };
          }
          break;
        }
        case 'sub':
        case 'function': {
          this.error('Statement cannot appear inside another procedure.', token);
          this.skipLine();
          return null;
        }
        default:
          break;
      }
    }

    // Assignment or a call statement.
    const target = this.parsePostfix();
    const operatorToken = this.peek();
    if (
      operatorToken.kind === 'operator' &&
      ['=', '+=', '-=', '*=', '/=', '&='].includes(operatorToken.value)
    ) {
      this.next();
      const value = this.parseExpression();
      this.endOfStatement();
      return { t: 'assign', target, op: operatorToken.value, value, line };
    }

    // `MsgBox "Hello"` — arguments without brackets.
    if (this.peek().kind !== 'eol' && this.peek().kind !== 'eof') {
      const args: Expr[] = [this.parseExpression()];
      while (this.isOperator(',')) {
        this.next();
        args.push(this.parseExpression());
      }
      this.endOfStatement();
      return { t: 'expression', expr: { t: 'call', callee: target, args, line }, line };
    }

    this.endOfStatement();
    return { t: 'expression', expr: target, line };
  }

  private parseDim(): Stmt {
    const line = this.peek().line;
    this.next(); // Dim / Const
    const declarations: Array<{ name: string; size?: Expr; typeName?: string; init?: Expr }> = [];

    do {
      const nameToken = this.next();
      if (nameToken.kind !== 'identifier') {
        this.error('Expected a variable name.', nameToken);
        this.skipLine();
        break;
      }
      const declaration: { name: string; size?: Expr; typeName?: string; init?: Expr } = {
        name: nameToken.value,
      };

      if (this.isOperator('(')) {
        this.next();
        declaration.size = this.isOperator(')') ? { t: 'number', value: -1 } : this.parseExpression();
        this.expectOperator(')');
      }
      if (this.accept('as')) {
        declaration.typeName = this.parseTypeName();
      }
      if (this.isOperator('=')) {
        this.next();
        declaration.init = this.parseExpression();
      }
      declarations.push(declaration);
    } while (this.isOperator(',') && this.next());

    this.endOfStatement();
    return { t: 'dim', declarations, line };
  }

  private parseIf(): Stmt {
    const line = this.peek().line;
    this.next(); // If
    const condition = this.parseExpression();
    if (!this.accept('then')) this.error("Expected 'Then'.");

    // Single-line If: `If x > 5 Then y = 1 Else y = 2`
    if (this.peek().kind !== 'eol' && this.peek().kind !== 'eof') {
      const thenBody: Stmt[] = [];
      const statement = this.parseSingleLineStatement();
      if (statement) thenBody.push(statement);
      let elseBody: Stmt[] | null = null;
      if (this.isKeyword('else')) {
        this.next();
        elseBody = [];
        const otherwise = this.parseSingleLineStatement();
        if (otherwise) elseBody.push(otherwise);
      }
      if (this.peek().kind === 'eol') this.next();
      return { t: 'if', branches: [{ condition, body: thenBody }], elseBody, line };
    }

    this.endOfStatement();
    const branches: Array<{ condition: Expr; body: Stmt[] }> = [
      { condition, body: this.parseBlock(['elseif', 'else', 'end']) },
    ];
    let elseBody: Stmt[] | null = null;

    while (this.isKeyword('elseif')) {
      this.next();
      const branchCondition = this.parseExpression();
      this.accept('then');
      this.endOfStatement();
      branches.push({ condition: branchCondition, body: this.parseBlock(['elseif', 'else', 'end']) });
    }

    if (this.isKeyword('else')) {
      this.next();
      this.endOfStatement();
      elseBody = this.parseBlock(['end']);
    }

    if (this.isKeyword('end') && this.isKeyword('if', 1)) {
      this.next();
      this.next();
      this.endOfStatement();
    } else {
      this.error("'If' block must end with a matching 'End If'.");
    }

    return { t: 'if', branches, elseBody, line };
  }

  /** The body of a single-line If, which never opens a block. */
  private parseSingleLineStatement(): Stmt | null {
    const token = this.peek();
    const line = token.line;
    if (token.kind === 'identifier' && token.lower === 'exit') {
      this.next();
      const what = this.peek().kind === 'identifier' ? this.next().lower : 'sub';
      return { t: 'exit', what, line };
    }
    if (token.kind === 'identifier' && token.lower === 'return') {
      this.next();
      const value =
        this.peek().kind === 'eol' || this.isKeyword('else') ? null : this.parseExpression();
      return { t: 'return', value, line };
    }

    const target = this.parsePostfix();
    const operatorToken = this.peek();
    if (
      operatorToken.kind === 'operator' &&
      ['=', '+=', '-=', '*=', '/=', '&='].includes(operatorToken.value)
    ) {
      this.next();
      const value = this.parseExpression();
      return { t: 'assign', target, op: operatorToken.value, value, line };
    }
    if (this.peek().kind !== 'eol' && this.peek().kind !== 'eof' && !this.isKeyword('else')) {
      const args: Expr[] = [this.parseExpression()];
      while (this.isOperator(',')) {
        this.next();
        args.push(this.parseExpression());
      }
      return { t: 'expression', expr: { t: 'call', callee: target, args, line }, line };
    }
    return { t: 'expression', expr: target, line };
  }

  private parseFor(): Stmt {
    const line = this.peek().line;
    this.next(); // For

    if (this.accept('each')) {
      const variableToken = this.next();
      if (this.accept('as')) this.parseTypeName();
      if (!this.accept('in')) this.error("Expected 'In'.");
      const iterable = this.parseExpression();
      this.endOfStatement();
      const body = this.parseBlock(['next']);
      if (this.isKeyword('next')) {
        this.next();
        if (this.peek().kind === 'identifier') this.next();
        this.endOfStatement();
      } else {
        this.error("'For Each' must end with a matching 'Next'.");
      }
      return { t: 'foreach', variable: variableToken.value, iterable, body, line };
    }

    const variableToken = this.next();
    if (variableToken.kind !== 'identifier') this.error('Expected a loop variable.', variableToken);
    if (this.accept('as')) this.parseTypeName();
    this.expectOperator('=');
    const from = this.parseExpression();
    if (!this.accept('to')) this.error("Expected 'To'.");
    const to = this.parseExpression();
    const step = this.accept('step') ? this.parseExpression() : null;
    this.endOfStatement();

    const body = this.parseBlock(['next']);
    if (this.isKeyword('next')) {
      this.next();
      if (this.peek().kind === 'identifier') this.next();
      this.endOfStatement();
    } else {
      this.error("'For' must end with a matching 'Next'.");
    }

    return { t: 'for', variable: variableToken.value, from, to, step, body, line };
  }

  private parseWhile(): Stmt {
    const line = this.peek().line;
    this.next();
    const condition = this.parseExpression();
    this.endOfStatement();
    const body = this.parseBlock(['end', 'wend']);
    if (this.isKeyword('wend')) {
      this.next();
      this.endOfStatement();
    } else if (this.isKeyword('end') && this.isKeyword('while', 1)) {
      this.next();
      this.next();
      this.endOfStatement();
    } else {
      this.error("'While' must end with a matching 'End While'.");
    }
    return { t: 'while', condition, body, line };
  }

  private parseDo(): Stmt {
    const line = this.peek().line;
    this.next();

    let test: { when: 'pre' | 'post'; kind: 'while' | 'until'; condition: Expr } | null = null;
    if (this.isKeyword('while') || this.isKeyword('until')) {
      const kind = this.next().lower === 'while' ? 'while' : 'until';
      test = { when: 'pre', kind, condition: this.parseExpression() };
    }
    this.endOfStatement();

    const body = this.parseBlock(['loop']);
    if (this.isKeyword('loop')) {
      this.next();
      if (this.isKeyword('while') || this.isKeyword('until')) {
        const kind = this.next().lower === 'while' ? 'while' : 'until';
        test = { when: 'post', kind, condition: this.parseExpression() };
      }
      this.endOfStatement();
    } else {
      this.error("'Do' must end with a matching 'Loop'.");
    }

    return { t: 'do', test, body, line };
  }

  private parseSelect(): Stmt {
    const line = this.peek().line;
    this.next(); // Select
    this.accept('case');
    const subject = this.parseExpression();
    this.endOfStatement();
    this.skipBlankLines();

    const cases: Array<{ tests: CaseTest[]; body: Stmt[] }> = [];
    let elseBody: Stmt[] | null = null;

    while (this.isKeyword('case')) {
      this.next();
      if (this.accept('else')) {
        this.endOfStatement();
        elseBody = this.parseBlock(['case', 'end']);
        continue;
      }

      const tests: CaseTest[] = [];
      do {
        if (this.accept('is')) {
          const operatorToken = this.next();
          tests.push({ kind: 'compare', op: operatorToken.value, value: this.parseExpression() });
        } else {
          const value = this.parseExpression();
          if (this.accept('to')) {
            tests.push({ kind: 'range', from: value, to: this.parseExpression() });
          } else {
            tests.push({ kind: 'value', value });
          }
        }
      } while (this.isOperator(',') && this.next());

      this.endOfStatement();
      cases.push({ tests, body: this.parseBlock(['case', 'end']) });
    }

    if (this.isKeyword('end') && this.isKeyword('select', 1)) {
      this.next();
      this.next();
      this.endOfStatement();
    } else {
      this.error("'Select Case' must end with a matching 'End Select'.");
    }

    return { t: 'select', subject, cases, elseBody, line };
  }

  private parseTry(): Stmt {
    const line = this.peek().line;
    this.next();
    this.endOfStatement();
    const body = this.parseBlock(['catch', 'finally', 'end']);

    let catchVariable: string | null = null;
    let catchBody: Stmt[] = [];
    let finallyBody: Stmt[] = [];

    if (this.isKeyword('catch')) {
      this.next();
      if (this.peek().kind === 'identifier' && !this.isKeyword('as')) {
        catchVariable = this.next().value;
      }
      if (this.accept('as')) this.parseTypeName();
      this.endOfStatement();
      catchBody = this.parseBlock(['finally', 'end']);
    }

    if (this.isKeyword('finally')) {
      this.next();
      this.endOfStatement();
      finallyBody = this.parseBlock(['end']);
    }

    if (this.isKeyword('end') && this.isKeyword('try', 1)) {
      this.next();
      this.next();
      this.endOfStatement();
    } else {
      this.error("'Try' must end with a matching 'End Try'.");
    }

    return { t: 'try', body, catchVariable, catchBody, finallyBody, line };
  }

  /* ------------------------------------------------------------ expressions */

  parseExpression(): Expr {
    return this.parseOr();
  }

  private parseOr(): Expr {
    let left = this.parseAnd();
    while (this.isKeyword('or') || this.isKeyword('orelse') || this.isKeyword('xor')) {
      const token = this.next();
      const right = this.parseAnd();
      left = { t: 'binary', op: token.lower, left, right, line: token.line };
    }
    return left;
  }

  private parseAnd(): Expr {
    let left = this.parseNot();
    while (this.isKeyword('and') || this.isKeyword('andalso')) {
      const token = this.next();
      const right = this.parseNot();
      left = { t: 'binary', op: token.lower, left, right, line: token.line };
    }
    return left;
  }

  private parseNot(): Expr {
    if (this.isKeyword('not')) {
      const token = this.next();
      return { t: 'unary', op: 'not', operand: this.parseNot(), line: token.line };
    }
    return this.parseComparison();
  }

  private parseComparison(): Expr {
    let left = this.parseConcat();
    while (
      (this.peek().kind === 'operator' && ['=', '<>', '<', '>', '<=', '>='].includes(this.peek().value)) ||
      this.isKeyword('is') ||
      this.isKeyword('like')
    ) {
      const token = this.next();
      const right = this.parseConcat();
      left = { t: 'binary', op: token.kind === 'operator' ? token.value : token.lower, left, right, line: token.line };
    }
    return left;
  }

  private parseConcat(): Expr {
    let left = this.parseAdditive();
    while (this.isOperator('&')) {
      const token = this.next();
      const right = this.parseAdditive();
      left = { t: 'binary', op: '&', left, right, line: token.line };
    }
    return left;
  }

  private parseAdditive(): Expr {
    let left = this.parseMultiplicative();
    while (this.isOperator('+') || this.isOperator('-')) {
      const token = this.next();
      const right = this.parseMultiplicative();
      left = { t: 'binary', op: token.value, left, right, line: token.line };
    }
    return left;
  }

  private parseMultiplicative(): Expr {
    let left = this.parseUnary();
    while (
      this.isOperator('*') ||
      this.isOperator('/') ||
      this.isOperator('\\') ||
      this.isKeyword('mod')
    ) {
      const token = this.next();
      const right = this.parseUnary();
      left = {
        t: 'binary',
        op: token.kind === 'operator' ? token.value : 'mod',
        left,
        right,
        line: token.line,
      };
    }
    return left;
  }

  private parseUnary(): Expr {
    if (this.isOperator('-') || this.isOperator('+')) {
      const token = this.next();
      return { t: 'unary', op: token.value, operand: this.parseUnary(), line: token.line };
    }
    return this.parsePower();
  }

  private parsePower(): Expr {
    const base = this.parsePostfix();
    if (this.isOperator('^')) {
      const token = this.next();
      // `^` is right-associative.
      return { t: 'binary', op: '^', left: base, right: this.parseUnary(), line: token.line };
    }
    return base;
  }

  private parsePostfix(): Expr {
    let expr = this.parsePrimary();
    for (;;) {
      if (this.isOperator('.')) {
        const token = this.next();
        const member = this.next();
        if (member.kind !== 'identifier') {
          this.error('Expected a property or method name.', member);
          break;
        }
        expr = { t: 'member', target: expr, name: member.value, line: token.line };
        continue;
      }
      if (this.isOperator('(')) {
        const token = this.next();
        const args: Expr[] = [];
        while (!this.isOperator(')') && this.peek().kind !== 'eol' && this.peek().kind !== 'eof') {
          args.push(this.parseExpression());
          if (this.isOperator(',')) this.next();
          else break;
        }
        this.expectOperator(')');
        expr = { t: 'call', callee: expr, args, line: token.line };
        continue;
      }
      break;
    }
    return expr;
  }

  private parsePrimary(): Expr {
    const token = this.peek();

    if (token.kind === 'number') {
      this.next();
      return { t: 'number', value: Number(token.value) };
    }
    if (token.kind === 'string') {
      this.next();
      return { t: 'string', value: token.value };
    }
    if (this.isOperator('(')) {
      this.next();
      const inner = this.parseExpression();
      this.expectOperator(')');
      return inner;
    }
    if (token.kind === 'identifier') {
      if (token.lower === 'true') {
        this.next();
        return { t: 'boolean', value: true };
      }
      if (token.lower === 'false') {
        this.next();
        return { t: 'boolean', value: false };
      }
      if (token.lower === 'nothing') {
        this.next();
        return { t: 'nothing' };
      }
      if (token.lower === 'new') {
        this.next();
        const typeName = this.parseTypeName();
        const args: Expr[] = [];
        if (this.isOperator('(')) {
          this.next();
          while (!this.isOperator(')') && this.peek().kind !== 'eol' && this.peek().kind !== 'eof') {
            args.push(this.parseExpression());
            if (this.isOperator(',')) this.next();
            else break;
          }
          this.expectOperator(')');
        }
        return { t: 'new', typeName, args, line: token.line };
      }
      this.next();
      return { t: 'identifier', name: token.value, line: token.line };
    }

    this.error(`Expression expected, found '${token.value.trim() || 'end of line'}'.`, token);
    this.next();
    return { t: 'nothing' };
  }
}

export const parseVb = (source: string): VbModule => {
  const diagnostics: VbDiagnostic[] = [];
  const tokens = tokenize(source, diagnostics);
  const parser = new Parser(tokens, diagnostics);
  const module = parser.parseModule();
  module.diagnostics = diagnostics;
  return module;
};

/* ------------------------------------------------------------------ runtime */

export interface VbObject {
  __vb: true;
  typeName: string;
  get(name: string): unknown;
  set(name: string, value: unknown): void;
  invoke(name: string, args: unknown[]): unknown | Promise<unknown>;
  /** Indexing with brackets: `Items(0)`. */
  index?(args: unknown[]): unknown;
}

export const isVbObject = (value: unknown): value is VbObject =>
  typeof value === 'object' && value !== null && (value as VbObject).__vb === true;

export class VbArray {
  constructor(public values: unknown[]) {}
}

export interface VbHost {
  getControl(name: string): VbObject | undefined;
  showMessage(prompt: string, title: string, buttons: string): Promise<string>;
  showInput(prompt: string, title: string, defaultValue: string): Promise<string | null>;
  print(text: string): void;
  /** Me.Close(), Form2.Show() and friends. */
  formObject(name: string): VbObject | undefined;
}

class Signal {
  constructor(public kind: string, public value?: unknown) {}
}

class Scope {
  private values = new Map<string, unknown>();

  constructor(public parent: Scope | null = null) {}

  has(name: string): boolean {
    return this.values.has(name.toLowerCase()) || (this.parent?.has(name) ?? false);
  }

  get(name: string): unknown {
    const key = name.toLowerCase();
    if (this.values.has(key)) return this.values.get(key);
    return this.parent?.get(name);
  }

  declare(name: string, value: unknown) {
    this.values.set(name.toLowerCase(), value);
  }

  /** Assignment walks up to whichever scope already owns the name. */
  assign(name: string, value: unknown): boolean {
    const key = name.toLowerCase();
    if (this.values.has(key)) {
      this.values.set(key, value);
      return true;
    }
    if (this.parent?.assign(name, value)) return true;
    return false;
  }
}

const DEFAULT_FOR_TYPE = (typeName?: string): unknown => {
  const type = (typeName || '').toLowerCase();
  if (['integer', 'long', 'short', 'double', 'single', 'decimal', 'byte'].includes(type)) return 0;
  if (type === 'boolean') return false;
  if (type === 'string') return '';
  return null;
};

export const toVbString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value);
    return String(Number(value.toFixed(10)));
  }
  if (value instanceof VbArray) return value.values.map(toVbString).join(', ');
  if (value instanceof Date) return value.toLocaleString('en-GB');
  if (isVbObject(value)) return toVbString(value.get('Text'));
  return String(value);
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? -1 : 0;
  if (value === null || value === undefined || value === '') return 0;
  const numeric = Number(String(value).trim());
  return Number.isNaN(numeric) ? Number.NaN : numeric;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    return value !== '';
  }
  return Boolean(value);
};

/** A small Format() that covers the patterns the syllabus uses. */
const formatValue = (value: unknown, pattern: string): string => {
  const number = toNumber(value);
  const style = pattern.trim();
  const lower = style.toLowerCase();

  if (lower === 'c' || lower === 'currency') return `$${number.toFixed(2)}`;
  if (lower === 'p' || lower === 'percent') return `${(number * 100).toFixed(2)}%`;
  if (/^n\d?$/.test(lower)) {
    const places = lower.length > 1 ? Number(lower[1]) : 2;
    return number.toFixed(places).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  if (/^f\d?$/.test(lower)) return number.toFixed(lower.length > 1 ? Number(lower[1]) : 2);
  if (lower === 'fixed') return number.toFixed(2);
  if (lower === 'standard') return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const decimalMatch = /^([#,0]*)(?:\.(0+))?$/.exec(style);
  if (decimalMatch) {
    const places = decimalMatch[2] ? decimalMatch[2].length : 0;
    const text = number.toFixed(places);
    return decimalMatch[1].includes(',')
      ? text.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : text;
  }

  if (value instanceof Date || /d|m|y|h|s/i.test(style)) {
    const date = value instanceof Date ? value : new Date();
    const pad = (input: number) => String(input).padStart(2, '0');
    return style
      .replace(/yyyy/gi, String(date.getFullYear()))
      .replace(/MM/g, pad(date.getMonth() + 1))
      .replace(/dd/gi, pad(date.getDate()))
      .replace(/HH/g, pad(date.getHours()))
      .replace(/mm/g, pad(date.getMinutes()))
      .replace(/ss/gi, pad(date.getSeconds()));
  }
  return toVbString(value);
};

/** Runs one program: the module's procedures against the host's controls. */
export class VbRuntime {
  private globals = new Scope();
  private procedures = new Map<string, VbProcedure>();
  private steps = 0;
  private depth = 0;
  private stopped = false;
  private randomSeed = Math.random();

  constructor(private module: VbModule, private host: VbHost) {
    module.procedures.forEach((procedure) => {
      this.procedures.set(procedure.name.toLowerCase(), procedure);
    });
  }

  /** Module-level Dims run once, before the form is shown. */
  async start() {
    this.stopped = false;
    this.steps = 0;
    for (const statement of this.module.moduleVariables) {
      await this.execute(statement, this.globals);
    }
  }

  stop() {
    this.stopped = true;
  }

  handlersFor(target: string): VbProcedure[] {
    return this.module.procedures.filter((procedure) =>
      procedure.handles.some((handle) => handle.toLowerCase() === target.toLowerCase())
    );
  }

  async raiseEvent(controlName: string, eventName: string) {
    const target = `${controlName}.${eventName}`;
    const handlers = this.handlersFor(target);
    for (const handler of handlers) {
      await this.invokeProcedure(handler, []);
    }
    return handlers.length > 0;
  }

  async invokeProcedure(procedure: VbProcedure, args: unknown[]): Promise<unknown> {
    const scope = new Scope(this.globals);
    procedure.parameters.forEach((parameter, index) => {
      scope.declare(parameter.name, args[index] ?? null);
    });
    // A Function's return value can be assigned to its own name, VB-style.
    scope.declare(procedure.name, DEFAULT_FOR_TYPE());

    // Only the outermost call resets the step budget, or a loop that calls a
    // Sub each time round would top it up and never trip the runaway guard.
    if (this.depth === 0) this.steps = 0;
    this.depth += 1;
    try {
      await this.executeBlock(procedure.body, scope);
    } catch (error) {
      if (error instanceof Signal) {
        if (error.kind === 'return') return error.value;
        if (error.kind === 'end') throw error;
      } else {
        throw error;
      }
    } finally {
      this.depth -= 1;
    }
    return scope.get(procedure.name);
  }

  private tick(line: number) {
    if (this.stopped) throw new Signal('end');
    this.steps += 1;
    if (this.steps > 400000) {
      throw new VbRuntimeError(
        'The program has been stopped because it ran too long — check for a loop that never ends.',
        line
      );
    }
  }

  private async executeBlock(statements: Stmt[], scope: Scope) {
    for (const statement of statements) {
      await this.execute(statement, scope);
    }
  }

  private async execute(statement: Stmt, scope: Scope): Promise<void> {
    this.tick(statement.line);

    switch (statement.t) {
      case 'dim': {
        for (const declaration of statement.declarations) {
          if (declaration.size) {
            const upperBound = toNumber(await this.evaluate(declaration.size, scope));
            const length = Number.isFinite(upperBound) && upperBound >= 0 ? upperBound + 1 : 0;
            scope.declare(
              declaration.name,
              new VbArray(new Array(length).fill(DEFAULT_FOR_TYPE(declaration.typeName)))
            );
            continue;
          }
          scope.declare(
            declaration.name,
            declaration.init
              ? await this.evaluate(declaration.init, scope)
              : DEFAULT_FOR_TYPE(declaration.typeName)
          );
        }
        return;
      }

      case 'assign': {
        const value = await this.evaluate(statement.value, scope);
        await this.assign(statement.target, statement.op, value, scope);
        return;
      }

      case 'expression': {
        await this.evaluate(statement.expr, scope);
        return;
      }

      case 'if': {
        for (const branch of statement.branches) {
          if (toBoolean(await this.evaluate(branch.condition, scope))) {
            await this.executeBlock(branch.body, scope);
            return;
          }
        }
        if (statement.elseBody) await this.executeBlock(statement.elseBody, scope);
        return;
      }

      case 'for': {
        const from = toNumber(await this.evaluate(statement.from, scope));
        const to = toNumber(await this.evaluate(statement.to, scope));
        const step = statement.step ? toNumber(await this.evaluate(statement.step, scope)) : 1;
        if (step === 0) {
          throw new VbRuntimeError('The Step of a For loop cannot be zero.', statement.line);
        }
        if (!scope.has(statement.variable)) scope.declare(statement.variable, from);

        for (
          let index = from;
          step > 0 ? index <= to : index >= to;
          index += step
        ) {
          this.tick(statement.line);
          scope.assign(statement.variable, index) || scope.declare(statement.variable, index);
          try {
            await this.executeBlock(statement.body, scope);
          } catch (error) {
            if (error instanceof Signal && error.kind === 'exit-for') return;
            throw error;
          }
        }
        return;
      }

      case 'foreach': {
        const iterable = await this.evaluate(statement.iterable, scope);
        const values =
          iterable instanceof VbArray
            ? iterable.values
            : typeof iterable === 'string'
              ? iterable.split('')
              : isVbObject(iterable) && Array.isArray(iterable.get('__values'))
                ? (iterable.get('__values') as unknown[])
                : [];
        scope.declare(statement.variable, null);
        for (const value of values) {
          this.tick(statement.line);
          scope.assign(statement.variable, value);
          try {
            await this.executeBlock(statement.body, scope);
          } catch (error) {
            if (error instanceof Signal && error.kind === 'exit-for') return;
            throw error;
          }
        }
        return;
      }

      case 'while': {
        while (toBoolean(await this.evaluate(statement.condition, scope))) {
          this.tick(statement.line);
          try {
            await this.executeBlock(statement.body, scope);
          } catch (error) {
            if (error instanceof Signal && (error.kind === 'exit-while' || error.kind === 'exit-do')) return;
            throw error;
          }
        }
        return;
      }

      case 'do': {
        const test = statement.test;
        const shouldContinue = async () => {
          if (!test) return true;
          const value = toBoolean(await this.evaluate(test.condition, scope));
          return test.kind === 'while' ? value : !value;
        };

        if (test?.when === 'post') {
          do {
            this.tick(statement.line);
            try {
              await this.executeBlock(statement.body, scope);
            } catch (error) {
              if (error instanceof Signal && error.kind === 'exit-do') return;
              throw error;
            }
          } while (await shouldContinue());
          return;
        }

        while (await shouldContinue()) {
          this.tick(statement.line);
          try {
            await this.executeBlock(statement.body, scope);
          } catch (error) {
            if (error instanceof Signal && error.kind === 'exit-do') return;
            throw error;
          }
        }
        return;
      }

      case 'select': {
        const subject = await this.evaluate(statement.subject, scope);
        for (const branch of statement.cases) {
          for (const test of branch.tests) {
            let matched = false;
            if (test.kind === 'value' && test.value) {
              matched = compareValues(subject, await this.evaluate(test.value, scope)) === 0;
            } else if (test.kind === 'range' && test.from && test.to) {
              const low = await this.evaluate(test.from, scope);
              const high = await this.evaluate(test.to, scope);
              matched = compareValues(subject, low) >= 0 && compareValues(subject, high) <= 0;
            } else if (test.kind === 'compare' && test.value && test.op) {
              matched = applyComparison(test.op, subject, await this.evaluate(test.value, scope));
            }
            if (matched) {
              await this.executeBlock(branch.body, scope);
              return;
            }
          }
        }
        if (statement.elseBody) await this.executeBlock(statement.elseBody, scope);
        return;
      }

      case 'return':
        throw new Signal('return', statement.value ? await this.evaluate(statement.value, scope) : null);

      case 'exit': {
        const map: Record<string, string> = {
          for: 'exit-for',
          do: 'exit-do',
          while: 'exit-while',
          sub: 'return',
          function: 'return',
        };
        throw new Signal(map[statement.what] || 'return');
      }

      case 'try': {
        try {
          await this.executeBlock(statement.body, scope);
        } catch (error) {
          if (error instanceof Signal) throw error;
          const message = error instanceof Error ? error.message : String(error);
          if (statement.catchVariable) {
            scope.declare(statement.catchVariable, makeExceptionObject(message));
          }
          await this.executeBlock(statement.catchBody, scope);
        } finally {
          if (statement.finallyBody.length > 0) await this.executeBlock(statement.finallyBody, scope);
        }
        return;
      }

      case 'end':
        throw new Signal('end');

      default:
        return;
    }
  }

  private async assign(target: Expr, op: string, rawValue: unknown, scope: Scope) {
    let value = rawValue;
    if (op !== '=') {
      const current = await this.evaluate(target, scope);
      const operator = op[0];
      value =
        operator === '&'
          ? toVbString(current) + toVbString(rawValue)
          : applyArithmetic(operator, current, rawValue, 0);
    }

    if (target.t === 'identifier') {
      const control = this.host.getControl(target.name);
      if (control) {
        control.set('Text', value);
        return;
      }
      if (!scope.assign(target.name, value)) scope.declare(target.name, value);
      return;
    }

    if (target.t === 'member') {
      const owner = await this.evaluate(target.target, scope);
      if (isVbObject(owner)) {
        owner.set(target.name, value);
        return;
      }
      throw new VbRuntimeError(
        `'${target.name}' cannot be set on this value.`,
        target.line
      );
    }

    if (target.t === 'call') {
      // Array element assignment: nums(2) = 7
      const container = await this.evaluate(target.callee, scope);
      const indexes = await Promise.all(target.args.map((argument) => this.evaluate(argument, scope)));
      if (container instanceof VbArray) {
        const position = toNumber(indexes[0]);
        if (position < 0 || position >= container.values.length) {
          throw new VbRuntimeError(
            `Index ${position} is outside the bounds of the array.`,
            target.line
          );
        }
        container.values[position] = value;
        return;
      }
      throw new VbRuntimeError('Only arrays can be assigned with an index.', target.line);
    }

    throw new VbRuntimeError('This expression cannot be assigned to.', 0);
  }

  private async evaluate(expr: Expr, scope: Scope): Promise<unknown> {
    switch (expr.t) {
      case 'number':
        return expr.value;
      case 'string':
        return expr.value;
      case 'boolean':
        return expr.value;
      case 'nothing':
        return null;

      case 'identifier': {
        if (scope.has(expr.name)) return scope.get(expr.name);
        const control = this.host.getControl(expr.name);
        if (control) return control;
        const form = this.host.formObject(expr.name);
        if (form) return form;
        const namespace = this.namespaceObject(expr.name);
        if (namespace) return namespace;
        const constant = this.constant(expr.name);
        if (constant !== undefined) return constant;
        const procedure = this.procedures.get(expr.name.toLowerCase());
        if (procedure) return this.invokeProcedure(procedure, []);
        const builtin = this.builtin(expr.name);
        if (builtin) return builtin([], expr.line);
        throw new VbRuntimeError(`'${expr.name}' is not declared.`, expr.line);
      }

      case 'member': {
        const owner = await this.evaluate(expr.target, scope);
        if (isVbObject(owner)) return owner.get(expr.name);
        if (owner instanceof VbArray) {
          if (expr.name.toLowerCase() === 'length') return owner.values.length;
        }
        if (typeof owner === 'string') {
          const property = expr.name.toLowerCase();
          if (property === 'length') return owner.length;
        }
        throw new VbRuntimeError(
          `'${expr.name}' is not a member of this value.`,
          expr.line
        );
      }

      case 'unary': {
        const operand = await this.evaluate(expr.operand, scope);
        if (expr.op === 'not') return !toBoolean(operand);
        if (expr.op === '-') return -toNumber(operand);
        return toNumber(operand);
      }

      case 'binary': {
        // AndAlso / OrElse short-circuit, which matters when the right-hand
        // side would divide by zero or index past the end of an array.
        if (expr.op === 'andalso') {
          return toBoolean(await this.evaluate(expr.left, scope))
            ? toBoolean(await this.evaluate(expr.right, scope))
            : false;
        }
        if (expr.op === 'orelse') {
          return toBoolean(await this.evaluate(expr.left, scope))
            ? true
            : toBoolean(await this.evaluate(expr.right, scope));
        }

        const left = await this.evaluate(expr.left, scope);
        const right = await this.evaluate(expr.right, scope);

        switch (expr.op) {
          case 'and':
            return toBoolean(left) && toBoolean(right);
          case 'or':
            return toBoolean(left) || toBoolean(right);
          case 'xor':
            return toBoolean(left) !== toBoolean(right);
          case '&':
            return toVbString(left) + toVbString(right);
          case '=':
          case '<>':
          case '<':
          case '>':
          case '<=':
          case '>=':
            return applyComparison(expr.op, left, right);
          case 'is':
            return left === right;
          case 'like':
            return likeMatch(toVbString(left), toVbString(right));
          default:
            return applyArithmetic(expr.op, left, right, expr.line);
        }
      }

      case 'new': {
        const type = expr.typeName.toLowerCase();
        if (type === 'random') return makeRandomObject();
        if (type.includes('list')) return new VbArray([]);
        return null;
      }

      case 'call':
        return this.evaluateCall(expr, scope);

      default:
        return null;
    }
  }

  private async evaluateCall(expr: Expr & { t: 'call' }, scope: Scope): Promise<unknown> {
    const { callee, args, line } = expr;

    // A method on an object: ListBox1.Items.Add("x"), Timer1.Start()
    if (callee.t === 'member') {
      const owner =
        callee.target.t === 'identifier' && !scope.has(callee.target.name)
          ? this.host.getControl(callee.target.name) ??
            this.host.formObject(callee.target.name) ??
            this.namespaceObject(callee.target.name) ??
            (await this.evaluate(callee.target, scope))
          : await this.evaluate(callee.target, scope);
      const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
      if (isVbObject(owner)) {
        const property = owner.get(callee.name);
        // Indexing into a collection property: Items(0)
        if (values.length > 0 && isVbObject(property) && property.index) {
          return property.index(values);
        }
        return owner.invoke(callee.name, values);
      }
      if (typeof owner === 'string') {
        return stringMethod(owner, callee.name, values, line);
      }
      if (owner instanceof VbArray) {
        return arrayMethod(owner, callee.name, values, line);
      }
      throw new VbRuntimeError(`'${callee.name}' is not a method of this value.`, line);
    }

    if (callee.t === 'identifier') {
      const name = callee.name;
      const lower = name.toLowerCase();

      // A user-defined Sub or Function wins over anything built in.
      const procedure = this.procedures.get(lower);
      if (procedure) {
        const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
        return this.invokeProcedure(procedure, values);
      }

      // An array or collection being indexed.
      if (scope.has(name)) {
        const container = scope.get(name);
        const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
        if (container instanceof VbArray) {
          const position = toNumber(values[0]);
          if (position < 0 || position >= container.values.length) {
            throw new VbRuntimeError(`Index ${position} is outside the bounds of the array.`, line);
          }
          return container.values[position];
        }
        if (typeof container === 'string') return container.charAt(toNumber(values[0]));
        if (isVbObject(container) && container.index) return container.index(values);
      }

      const builtin = this.builtin(name);
      if (builtin) {
        const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
        return builtin(values, line);
      }

      const control = this.host.getControl(name);
      if (control && control.index) {
        const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
        return control.index(values);
      }

      throw new VbRuntimeError(`'${name}' is not declared.`, line);
    }

    // Something like `arr(1)(2)` — evaluate then index.
    const container = await this.evaluate(callee, scope);
    const values = await Promise.all(args.map((argument) => this.evaluate(argument, scope)));
    if (container instanceof VbArray) return container.values[toNumber(values[0])];
    if (isVbObject(container) && container.index) return container.index(values);
    throw new VbRuntimeError('This expression cannot be called.', line);
  }

  private constant(name: string): unknown {
    switch (name.toLowerCase()) {
      case 'vbcrlf':
      case 'vbnewline':
      case 'vblf':
        return '\n';
      case 'vbtab':
        return '\t';
      case 'vbnullstring':
        return '';
      case 'vbyes':
        return 'Yes';
      case 'vbno':
        return 'No';
      case 'vbok':
        return 'OK';
      case 'vbcancel':
        return 'Cancel';
      case 'vbyesno':
        return 'YesNo';
      case 'vbokcancel':
        return 'OKCancel';
      case 'vbinformation':
      case 'vbexclamation':
      case 'vbcritical':
      case 'vbquestion':
        return 'OK';
      case 'nothing':
        return null;
      default:
        return undefined;
    }
  }

  /** Built-in functions and the namespace objects that hang off them. */
  private builtin(name: string): ((args: unknown[], line: number) => unknown | Promise<unknown>) | null {
    const lower = name.toLowerCase();

    const table: Record<string, (args: unknown[], line: number) => unknown | Promise<unknown>> = {
      msgbox: async (args) => {
        const prompt = toVbString(args[0]);
        const buttons = args[1] !== undefined ? toVbString(args[1]) : 'OK';
        const title = args[2] !== undefined ? toVbString(args[2]) : this.module.className;
        return this.host.showMessage(prompt, title, buttons);
      },
      inputbox: async (args) => {
        const prompt = toVbString(args[0]);
        const title = args[1] !== undefined ? toVbString(args[1]) : this.module.className;
        const defaultValue = args[2] !== undefined ? toVbString(args[2]) : '';
        const answer = await this.host.showInput(prompt, title, defaultValue);
        return answer === null ? '' : answer;
      },
      val: (args) => {
        const text = toVbString(args[0]).trim();
        const match = /^[-+]?[0-9]*\.?[0-9]+/.exec(text);
        return match ? Number(match[0]) : 0;
      },
      cint: (args, line) => {
        const value = toNumber(args[0]);
        if (Number.isNaN(value)) throw new VbRuntimeError(`Conversion from string "${toVbString(args[0])}" to type 'Integer' is not valid.`, line);
        return Math.round(value);
      },
      clng: (args, line) => table.cint(args, line),
      cdbl: (args, line) => {
        const value = toNumber(args[0]);
        if (Number.isNaN(value)) throw new VbRuntimeError(`Conversion from string "${toVbString(args[0])}" to type 'Double' is not valid.`, line);
        return value;
      },
      csng: (args, line) => table.cdbl(args, line),
      cstr: (args) => toVbString(args[0]),
      cbool: (args) => toBoolean(args[0]),
      int: (args) => Math.floor(toNumber(args[0])),
      fix: (args) => Math.trunc(toNumber(args[0])),
      abs: (args) => Math.abs(toNumber(args[0])),
      sqr: (args) => Math.sqrt(toNumber(args[0])),
      rnd: () => {
        // A repeatable generator, so Randomize actually changes something.
        this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
        return this.randomSeed / 233280;
      },
      randomize: () => {
        this.randomSeed = Math.random() * 233280;
        return null;
      },
      isnumeric: (args) => {
        const text = toVbString(args[0]).trim();
        return text !== '' && !Number.isNaN(Number(text));
      },
      len: (args) => {
        const value = args[0];
        if (value instanceof VbArray) return value.values.length;
        return toVbString(value).length;
      },
      mid: (args) => {
        const text = toVbString(args[0]);
        const start = Math.max(1, toNumber(args[1]));
        const length = args[2] === undefined ? undefined : toNumber(args[2]);
        return length === undefined ? text.slice(start - 1) : text.substr(start - 1, length);
      },
      left: (args) => toVbString(args[0]).slice(0, Math.max(0, toNumber(args[1]))),
      right: (args) => {
        const text = toVbString(args[0]);
        const count = Math.max(0, toNumber(args[1]));
        return count === 0 ? '' : text.slice(-count);
      },
      ucase: (args) => toVbString(args[0]).toUpperCase(),
      lcase: (args) => toVbString(args[0]).toLowerCase(),
      trim: (args) => toVbString(args[0]).trim(),
      ltrim: (args) => toVbString(args[0]).replace(/^\s+/, ''),
      rtrim: (args) => toVbString(args[0]).replace(/\s+$/, ''),
      instr: (args) => {
        // InStr([start,] haystack, needle)
        if (args.length >= 3) {
          const start = Math.max(1, toNumber(args[0]));
          return toVbString(args[1]).indexOf(toVbString(args[2]), start - 1) + 1;
        }
        return toVbString(args[0]).indexOf(toVbString(args[1])) + 1;
      },
      replace: (args) =>
        toVbString(args[0]).split(toVbString(args[1])).join(toVbString(args[2])),
      split: (args) =>
        new VbArray(toVbString(args[0]).split(args[1] === undefined ? ' ' : toVbString(args[1]))),
      join: (args) => {
        const array = args[0];
        const separator = args[1] === undefined ? ' ' : toVbString(args[1]);
        return array instanceof VbArray ? array.values.map(toVbString).join(separator) : '';
      },
      strreverse: (args) => toVbString(args[0]).split('').reverse().join(''),
      space: (args) => ' '.repeat(Math.max(0, toNumber(args[0]))),
      str: (args) => {
        const value = toNumber(args[0]);
        return value >= 0 ? ` ${toVbString(value)}` : toVbString(value);
      },
      asc: (args) => toVbString(args[0]).charCodeAt(0) || 0,
      chr: (args) => String.fromCharCode(toNumber(args[0])),
      format: (args) => formatValue(args[0], toVbString(args[1])),
      formatnumber: (args) => toNumber(args[0]).toFixed(args[1] === undefined ? 2 : toNumber(args[1])),
      formatcurrency: (args) => `$${toNumber(args[0]).toFixed(args[1] === undefined ? 2 : toNumber(args[1]))}`,
      ubound: (args) => (args[0] instanceof VbArray ? args[0].values.length - 1 : 0),
      lbound: () => 0,
      now: () => new Date(),
      today: () => new Date(),
      timevalue: () => new Date(),
      year: (args) => (args[0] instanceof Date ? args[0].getFullYear() : new Date().getFullYear()),
      month: (args) => (args[0] instanceof Date ? args[0].getMonth() + 1 : new Date().getMonth() + 1),
      day: (args) => (args[0] instanceof Date ? args[0].getDate() : new Date().getDate()),
      beep: () => null,
    };

    if (table[lower]) return table[lower];
    return null;
  }

  /** Namespace-style values: Math.PI, Color.Red, MessageBox.Show, Me. */
  namespaceObject(name: string): VbObject | undefined {
    const lower = name.toLowerCase();

    if (lower === 'math') {
      return makeStaticObject('Math', {
        pi: Math.PI,
        e: Math.E,
      }, {
        sqrt: (args) => Math.sqrt(toNumber(args[0])),
        abs: (args) => Math.abs(toNumber(args[0])),
        round: (args) => {
          const places = args[1] === undefined ? 0 : toNumber(args[1]);
          const factor = 10 ** places;
          return Math.round(toNumber(args[0]) * factor) / factor;
        },
        pow: (args) => toNumber(args[0]) ** toNumber(args[1]),
        max: (args) => Math.max(toNumber(args[0]), toNumber(args[1])),
        min: (args) => Math.min(toNumber(args[0]), toNumber(args[1])),
        floor: (args) => Math.floor(toNumber(args[0])),
        ceiling: (args) => Math.ceil(toNumber(args[0])),
        truncate: (args) => Math.trunc(toNumber(args[0])),
        sin: (args) => Math.sin(toNumber(args[0])),
        cos: (args) => Math.cos(toNumber(args[0])),
        tan: (args) => Math.tan(toNumber(args[0])),
      });
    }

    if (lower === 'messagebox') {
      return makeStaticObject('MessageBox', {}, {
        show: async (args) =>
          this.host.showMessage(
            toVbString(args[0]),
            args[1] === undefined ? this.module.className : toVbString(args[1]),
            args[2] === undefined ? 'OK' : toVbString(args[2])
          ),
      });
    }

    if (lower === 'messageboxbuttons' || lower === 'msgboxstyle') {
      return makeStaticObject('MessageBoxButtons', {
        ok: 'OK',
        okcancel: 'OKCancel',
        yesno: 'YesNo',
        yesnocancel: 'YesNoCancel',
        information: 'OK',
        exclamation: 'OK',
        critical: 'OK',
        question: 'OK',
      }, {});
    }

    if (lower === 'dialogresult' || lower === 'msgboxresult') {
      return makeStaticObject('DialogResult', {
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancel',
      }, {});
    }

    if (lower === 'color') {
      return makeStaticObject('Color', {
        red: '#ff0000',
        green: '#008000',
        blue: '#0000ff',
        white: '#ffffff',
        black: '#000000',
        yellow: '#ffff00',
        orange: '#ffa500',
        gray: '#808080',
        grey: '#808080',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightblue: '#add8e6',
        pink: '#ffc0cb',
        purple: '#800080',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        silver: '#c0c0c0',
        gold: '#ffd700',
        transparent: 'transparent',
        control: '#f0f0f0',
      }, {});
    }

    if (lower === 'console' || lower === 'debug') {
      return makeStaticObject('Console', {}, {
        writeline: (args) => {
          this.host.print(args.map(toVbString).join(' '));
          return null;
        },
        write: (args) => {
          this.host.print(args.map(toVbString).join(' '));
          return null;
        },
        print: (args) => {
          this.host.print(args.map(toVbString).join(' '));
          return null;
        },
      });
    }

    if (lower === 'convert') {
      return makeStaticObject('Convert', {}, {
        toint32: (args) => Math.round(toNumber(args[0])),
        todouble: (args) => toNumber(args[0]),
        tostring: (args) => toVbString(args[0]),
        toboolean: (args) => toBoolean(args[0]),
      });
    }

    if (lower === 'integer' || lower === 'double' || lower === 'decimal') {
      return makeStaticObject(name, {}, {
        parse: (args) => toNumber(args[0]),
        tryparse: (args) => !Number.isNaN(toNumber(args[0])),
      });
    }

    if (lower === 'datetime') {
      return makeStaticObject('DateTime', { now: new Date(), today: new Date() }, {});
    }

    return undefined;
  }
}

const makeExceptionObject = (message: string): VbObject => ({
  __vb: true,
  typeName: 'Exception',
  get: (name) => (name.toLowerCase() === 'message' ? message : null),
  set: () => undefined,
  invoke: (name) => (name.toLowerCase() === 'tostring' ? message : null),
});

const makeRandomObject = (): VbObject => ({
  __vb: true,
  typeName: 'Random',
  get: () => null,
  set: () => undefined,
  invoke: (name, args) => {
    if (name.toLowerCase() !== 'next') return null;
    if (args.length === 0) return Math.floor(Math.random() * 2147483647);
    if (args.length === 1) return Math.floor(Math.random() * toNumber(args[0]));
    const low = toNumber(args[0]);
    const high = toNumber(args[1]);
    return low + Math.floor(Math.random() * (high - low));
  },
});

export const makeStaticObject = (
  typeName: string,
  properties: Record<string, unknown>,
  methods: Record<string, (args: unknown[]) => unknown | Promise<unknown>>
): VbObject => ({
  __vb: true,
  typeName,
  get(name) {
    const key = name.toLowerCase();
    if (key in properties) return properties[key];
    if (key in methods) return makeStaticObject(`${typeName}.${name}`, {}, methods);
    return null;
  },
  set() {
    // Static namespaces are read-only.
  },
  invoke(name, args) {
    const method = methods[name.toLowerCase()];
    if (!method) throw new VbRuntimeError(`'${name}' is not a member of '${typeName}'.`, 0);
    return method(args);
  },
});

/* ------------------------------------------------------------------ helpers */

const compareValues = (left: unknown, right: unknown): number => {
  if (typeof left === 'string' || typeof right === 'string') {
    const leftNumber = toNumber(left);
    const rightNumber = toNumber(right);
    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber) && typeof left !== 'boolean') {
      // Numeric strings compare as numbers, which is what Option Strict Off does.
      if (String(left).trim() !== '' && String(right).trim() !== '') {
        return leftNumber === rightNumber ? 0 : leftNumber < rightNumber ? -1 : 1;
      }
    }
    const leftText = toVbString(left);
    const rightText = toVbString(right);
    return leftText === rightText ? 0 : leftText < rightText ? -1 : 1;
  }
  const leftNumber = toNumber(left);
  const rightNumber = toNumber(right);
  return leftNumber === rightNumber ? 0 : leftNumber < rightNumber ? -1 : 1;
};

const applyComparison = (op: string, left: unknown, right: unknown): boolean => {
  const order = compareValues(left, right);
  switch (op) {
    case '=':
      return order === 0;
    case '<>':
      return order !== 0;
    case '<':
      return order < 0;
    case '>':
      return order > 0;
    case '<=':
      return order <= 0;
    case '>=':
      return order >= 0;
    default:
      return false;
  }
};

const applyArithmetic = (op: string, left: unknown, right: unknown, line: number): unknown => {
  if (op === '+') {
    if (typeof left === 'string' && typeof right === 'string') {
      const leftNumber = Number(left);
      const rightNumber = Number(right);
      if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) return left + right;
      return leftNumber + rightNumber;
    }
  }

  const a = toNumber(left);
  const b = toNumber(right);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new VbRuntimeError(
      `Conversion from string "${toVbString(Number.isNaN(a) ? left : right)}" to type 'Double' is not valid.`,
      line
    );
  }

  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new VbRuntimeError('Arithmetic operation resulted in a divide by zero.', line);
      return a / b;
    case '\\':
      if (b === 0) throw new VbRuntimeError('Arithmetic operation resulted in a divide by zero.', line);
      return Math.trunc(a / b);
    case 'mod':
      if (b === 0) throw new VbRuntimeError('Arithmetic operation resulted in a divide by zero.', line);
      return a % b;
    case '^':
      return a ** b;
    default:
      throw new VbRuntimeError(`Operator '${op}' is not supported.`, line);
  }
};

const likeMatch = (text: string, pattern: string): boolean => {
  const regex = new RegExp(
    `^${pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/#/g, '[0-9]')}$`,
    'i'
  );
  return regex.test(text);
};

const stringMethod = (text: string, name: string, args: unknown[], line: number): unknown => {
  switch (name.toLowerCase()) {
    case 'toupper':
      return text.toUpperCase();
    case 'tolower':
      return text.toLowerCase();
    case 'trim':
      return text.trim();
    case 'substring':
      return args.length > 1
        ? text.substr(toNumber(args[0]), toNumber(args[1]))
        : text.slice(toNumber(args[0]));
    case 'contains':
      return text.includes(toVbString(args[0]));
    case 'startswith':
      return text.startsWith(toVbString(args[0]));
    case 'endswith':
      return text.endsWith(toVbString(args[0]));
    case 'indexof':
      return text.indexOf(toVbString(args[0]));
    case 'replace':
      return text.split(toVbString(args[0])).join(toVbString(args[1]));
    case 'split':
      return new VbArray(text.split(args.length > 0 ? toVbString(args[0]) : ' '));
    case 'tostring':
      return text;
    case 'padleft':
      return text.padStart(toNumber(args[0]), args[1] === undefined ? ' ' : toVbString(args[1]));
    case 'padright':
      return text.padEnd(toNumber(args[0]), args[1] === undefined ? ' ' : toVbString(args[1]));
    default:
      throw new VbRuntimeError(`'${name}' is not a member of 'String'.`, line);
  }
};

const arrayMethod = (array: VbArray, name: string, args: unknown[], line: number): unknown => {
  switch (name.toLowerCase()) {
    case 'add':
      array.values.push(args[0]);
      return null;
    case 'clear':
      array.values.length = 0;
      return null;
    case 'remove':
      array.values = array.values.filter((value) => value !== args[0]);
      return null;
    case 'removeat':
      array.values.splice(toNumber(args[0]), 1);
      return null;
    case 'contains':
      return array.values.includes(args[0]);
    case 'count':
      return array.values.length;
    case 'tostring':
      return array.values.map(toVbString).join(', ');
    default:
      throw new VbRuntimeError(`'${name}' is not a member of this array.`, line);
  }
};

export const vbToNumber = toNumber;
export const vbToBoolean = toBoolean;
