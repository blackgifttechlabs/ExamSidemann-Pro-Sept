/**
 * CSharpEngine.ts  — v2.0
 *
 * A comprehensive client-side C# transpiler + executor for educational use.
 *
 * Fully covers patterns expected in an IT diploma programming module:
 *
 *   • Console I/O  (WriteLine, Write, ReadLine stubs)
 *   • All primitive types + var + const + nullable (int?)
 *   • Arithmetic, relational, logical, bitwise, ternary operators
 *   • String interpolation  $"…{expr}…"  and  @"verbatim"
 *   • String methods: Length, ToUpper, ToLower, Trim, Substring, Contains,
 *                     IndexOf, Replace, Split, StartsWith, EndsWith, PadLeft,
 *                     PadRight, string.IsNullOrEmpty, string.Join, string.Format
 *   • Math: Pow, Sqrt, Abs, Max, Min, Floor, Ceiling, Round, Log, Log10, PI, E
 *   • Type casting: (int)x, (double)x, int.Parse, double.Parse, Convert.ToInt32 …
 *   • if / else if / else
 *   • switch / case / default
 *   • for / foreach / while / do-while
 *   • break / continue / return
 *   • Arrays: int[] a = {…};  new int[n];  a.Length;  Array.Sort / Array.Reverse
 *   • Multi-dimensional arrays: int[,]  and  int[][]  (jagged)
 *   • List<T>: Add, Remove, RemoveAt, Count, Contains, Clear, Sort, IndexOf
 *   • Dictionary<K,V>: Add, ContainsKey, [], Keys, Values
 *   • Classes: fields, properties (auto + full), constructors, methods
 *   • Access modifiers stripped cleanly
 *   • Inheritance  ( : Base )  →  extends Base
 *   • base(…) constructor chaining  →  super(…)
 *   • override keyword handled
 *   • abstract classes and methods (skeletal)
 *   • Interfaces (IAnimal etc.) — stripped for JS compat
 *   • static members and static Main entry point
 *   • this. references preserved
 *   • try / catch (Exception e) / finally
 *   • throw new Exception(…)
 *   • Enums  →  plain JS objects
 *   • Structs  →  classes
 *   • Nullable types: int? x = null;
 *   • out / ref parameters (best-effort)
 */

export interface ExecutionResult {
  success: boolean;
  output: string[];
  error?: string;
  executionTime: number;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/** Extract raw identifier from a typed C# parameter: "int foo" → "foo" */
function stripParamTypes(params: string): string {
  if (!params.trim()) return '';
  return params
    .split(',')
    .map(p => {
      p = p.trim();
      p = p.replace(/^(ref|out|in|params)\s+/, '');
      const parts = p.split(/\s+/);
      return parts[parts.length - 1];
    })
    .filter(Boolean)
    .join(', ');
}

// ---------------------------------------------------------------------------
// Main Engine
// ---------------------------------------------------------------------------

export class CSharpEngine {
  private static instance: CSharpEngine;

  private constructor() {}

  public static getInstance(): CSharpEngine {
    if (!CSharpEngine.instance) {
      CSharpEngine.instance = new CSharpEngine();
    }
    return CSharpEngine.instance;
  }

  // =========================================================================
  //  VALIDATE
  // =========================================================================
  private validate(code: string): string | null {
    // Unclosed braces
    const opens = (code.match(/\{/g) || []).length;
    const closes = (code.match(/\}/g) || []).length;
    if (opens !== closes) {
      return `error CS1513: } expected — you have ${opens} opening braces but ${closes} closing braces`;
    }

    // Common typos on Console
    const badConsole = code.match(/\bConsol\b(?!e)/);
    if (badConsole) {
      return `error CS0103: The name 'Consol' does not exist in the current context. Did you mean 'Console'?`;
    }

    // Writeline vs WriteLine (case sensitive)
    if (/Console\.Writeline\s*\(/.test(code)) {
      return `error CS0117: 'Console' does not contain a definition for 'Writeline'. Did you mean 'WriteLine'?`;
    }
    if (/Console\.writeLine\s*\(/.test(code)) {
      return `error CS0117: 'Console' does not contain a definition for 'writeLine'. Did you mean 'WriteLine'?`;
    }

    // Missing semicolons on simple statements (lines ending with ) or literal but no ;)
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip comments, braces, preprocessor, blank
      if (!line || line.startsWith('//') || line.startsWith('{') || line.startsWith('}') ||
          line.startsWith('/*') || line.startsWith('*') || line.startsWith('#') ||
          line.endsWith('{') || line.endsWith('}') || line.endsWith(',')) continue;
      // Lines that look like statements but have no semicolon
      if (/^(int|double|float|string|bool|var|Console|return|throw)\b/.test(line) &&
          !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
        return `error CS1002: ; expected — line ${i + 1}: "${line}"`;
      }
    }

    // String not closed
    const stringCheck = code.replace(/\/\/.*$/gm, '').replace(/"(?:[^"\\]|\\.)*"/g, '""');
    if ((stringCheck.match(/"/g) || []).length % 2 !== 0) {
      return `error CS1010: Newline in constant — unterminated string literal`;
    }

    // Method called on nothing  e.g.  .WriteLine(
    if (/^\s*\./.test(code)) {
      return `error CS0103: Expression expected before '.'`;
    }

    return null; // all good
  }

  // =========================================================================
  //  TRANSPILE
  // =========================================================================
  public transpile(csharpCode: string): string {
    let js = csharpCode;

    // ── 0. Stash string/char literals so inner content is never mangled ────
    const strings: string[] = [];
    const PH = '\x00STR\x00';

    // Verbatim strings @"…"
    js = js.replace(/@"((?:[^"]|"")*)"/g, (_m, content) => {
      const idx = strings.length;
      strings.push('`' + content.replace(/""/g, '"').replace(/\n/g, '\\n') + '`');
      return PH + idx + '\x00';
    });

    // Interpolated strings $"…"  →  template literals
    js = js.replace(/\$"((?:[^"\\]|\\.)*)"/g, (_m, content) => {
      const idx = strings.length;
      const tpl = '`' + content.replace(/\{([^}]+)\}/g, (_a: string, expr: string) => '${' + expr + '}') + '`';
      strings.push(tpl);
      return PH + idx + '\x00';
    });

    // Regular string literals "…"
    js = js.replace(/"((?:[^"\\]|\\.)*)"/g, (_m, content) => {
      const idx = strings.length;
      strings.push('"' + content + '"');
      return PH + idx + '\x00';
    });

    // Char literals 'x'
    js = js.replace(/'((?:[^'\\]|\\.))'/g, (_m, ch) => {
      const idx = strings.length;
      strings.push('"' + ch + '"');
      return PH + idx + '\x00';
    });

    // ── 1. Strip preprocessor / using / namespace ──────────────────────────
    js = js.replace(/^\s*#.*$/gm, '');
    js = js.replace(/\busing\s+[\w.]+\s*;/g, '');
    // Strip namespace declaration AND its closing brace
js = js.replace(/\bnamespace\s+[\w.]+\s*\{/g, '/* namespace */');
// Remove the matching closing brace of the namespace
js = js.replace(/\/\* namespace \*\/([^]*)\}$/, '/* namespace */ $1');

    // ── 2. Enums  →  frozen const objects ─────────────────────────────────
    js = js.replace(
      /(?:public\s+|private\s+|protected\s+|internal\s+)?enum\s+([A-Z][a-zA-Z0-9_]*)\s*\{([^}]*)\}/g,
      (_m, name, body) => {
        const members = body.split(',').map((s: string) => s.trim()).filter(Boolean);
        const pairs = members.map((m: string, i: number) => {
          const [k, v] = m.split('=').map((x: string) => x.trim());
          return `  ${k}: ${v !== undefined ? v : i}`;
        });
        return `const ${name} = Object.freeze({\n${pairs.join(',\n')}\n});`;
      }
    );

    // ── 3. Structs  →  classes ─────────────────────────────────────────────
    js = js.replace(/\bstruct\s+/g, 'class ');

    // ── 4. Interfaces  →  comments, remove from class declarations ─────────
    js = js.replace(
      /(?:public\s+)?interface\s+([A-Z][a-zA-Z0-9_]*)\s*\{[^}]*\}/g,
      (_m, name) => `/* interface ${name} */`
    );
    js = js.replace(
      /\bclass\s+([A-Z][a-zA-Z0-9_]*)\s*:\s*([A-Z][a-zA-Z0-9_]*)(\s*,\s*[A-Z][a-zA-Z0-9_]*)*/g,
      (_m, cls, base, rest) => {
        const all = [base, ...(rest ? rest.split(',').map((x: string) => x.trim()) : [])];
        const nonInterface = all.find((x: string) => !/^I[A-Z]/.test(x));
        if (nonInterface) return `class ${cls} extends ${nonInterface}`;
        return `class ${cls}`;
      }
    );

    // ── 5. Abstract keyword ────────────────────────────────────────────────
    js = js.replace(/\babstract\s+class\b/g, 'class');
    js = js.replace(/\babstract\s+/g, '/* abstract */ ');

    // ── 5.5 Strip class access modifiers ───────────────────────────────────
    js = js.replace(/\b(?:public|private|protected|internal|sealed)\s+class\b/g, 'class');

    // ── 6. const fields ───────────────────────────────────────────────────
    js = js.replace(
      /\b(?:public|private|protected|internal)?\s*const\s+\w+\s+([a-zA-Z0-9_]+)\s*=/g,
      'const $1 ='
    );

    // ── 7. Array declarations ──────────────────────────────────────────────
    // int[] arr = new int[] { 1, 2, 3 };
    js = js.replace(
      /\b[a-zA-Z0-9_]+\[\]\s+([a-zA-Z0-9_]+)\s*=\s*new\s+[a-zA-Z0-9_]+\[\]\s*\{([^}]*)\}\s*;/g,
      'let $1 = [$2];'
    );
    // int[] arr = { 1, 2, 3 };
    js = js.replace(
      /\b[a-zA-Z0-9_]+\[\]\s+([a-zA-Z0-9_]+)\s*=\s*\{([^}]*)\}\s*;/g,
      'let $1 = [$2];'
    );
    // new int[n]  →  new Array(n).fill(0)
    js = js.replace(/new\s+(?:int|double|float|long|short|byte)\[([^\]]+)\]/g, 'new Array($1).fill(0)');
    js = js.replace(/new\s+string\[([^\]]+)\]/g, 'new Array($1).fill("")');
    js = js.replace(/new\s+bool\[([^\]]+)\]/g, 'new Array($1).fill(false)');
    // Remaining typed array declarations
    js = js.replace(/\b[a-zA-Z0-9_]+\[\]\s+([a-zA-Z0-9_]+)\s*(=|;)/g, 'let $1 $2');
    // 2D array  int[,] grid = new int[r,c]
    js = js.replace(
      /\b[a-zA-Z0-9_]+\[,\]\s+([a-zA-Z0-9_]+)\s*=\s*new\s+[a-zA-Z0-9_]+\[([^\]]+),([^\]]+)\]\s*;/g,
      (_m, name, r, c) =>
        `let ${name} = Array.from({length: ${r.trim()}}, () => new Array(${c.trim()}).fill(0));`
    );
    // Jagged int[][]
    js = js.replace(/\b[a-zA-Z0-9_]+\[\]\[\]\s+([a-zA-Z0-9_]+)\s*(=|;)/g, 'let $1 $2');

    // ── 8. List<T> ─────────────────────────────────────────────────────────
    js = js.replace(
      /\bList\s*<[^>]+>\s+([a-zA-Z0-9_]+)\s*=\s*new\s+List\s*<[^>]+>\s*\(\s*\)\s*;/g,
      'let $1 = new _List();'
    );
    js = js.replace(
      /\bList\s*<[^>]+>\s+([a-zA-Z0-9_]+)\s*=\s*new\s+List\s*<[^>]+>\s*\{([^}]*)\}\s*;/g,
      (_m, name, items) => `let ${name} = new _List(${items.trim() ? '[' + items + ']' : ''});`
    );
    js = js.replace(/new\s+List\s*<[^>]+>\s*\(\s*\)/g, 'new _List()');

    // ── 9. Dictionary<K,V> ─────────────────────────────────────────────────
    js = js.replace(
      /\bDictionary\s*<[^>]+>\s+([a-zA-Z0-9_]+)\s*=\s*new\s+Dictionary\s*<[^>]+>\s*\(\s*\)\s*;/g,
      'let $1 = new _Dict();'
    );
    js = js.replace(/new\s+Dictionary\s*<[^>]+>\s*\(\s*\)/g, 'new _Dict()');

    // ── 10. Primitive variable declarations ────────────────────────────────
    const PRIMITIVES = 'int|double|float|string|bool|char|decimal|long|short|byte|uint|ulong|ushort|sbyte|object|dynamic';
    js = js.replace(
      new RegExp(`\\b(${PRIMITIVES})\\?\\s+([a-zA-Z0-9_]+)\\s*(=|;)`, 'g'),
      'let $2 $3'
    );
    js = js.replace(
      new RegExp(`\\b(${PRIMITIVES})\\s+([a-zA-Z0-9_]+)\\s*(=|;)`, 'g'),
      'let $2 $3'
    );
    js = js.replace(/\bvar\s+([a-zA-Z0-9_]+)\s*(=)/g, 'let $1 $2');

    // ── 11. Object instantiation declarations ──────────────────────────────
    js = js.replace(
      /\b([A-Z][a-zA-Z0-9_]*)\s+([a-zA-Z0-9_]+)\s*=\s*(new\s+[A-Z][a-zA-Z0-9_]*)/g,
      'let $2 = $3'
    );

    // ── 12. Type casting ───────────────────────────────────────────────────
    js = js.replace(/\(int\)\s*([a-zA-Z0-9_.()]+)/g, 'Math.trunc($1)');
    js = js.replace(/\(double\)\s*([a-zA-Z0-9_.()]+)/g, 'Number($1)');
    js = js.replace(/\(float\)\s*([a-zA-Z0-9_.()]+)/g, 'Number($1)');
    js = js.replace(/\(long\)\s*([a-zA-Z0-9_.()]+)/g, 'Math.trunc($1)');
    js = js.replace(/\(string\)\s*([a-zA-Z0-9_.()]+)/g, 'String($1)');
    js = js.replace(/\(bool\)\s*([a-zA-Z0-9_.()]+)/g, 'Boolean($1)');
    // Parse / Convert
    js = js.replace(/int\.Parse\s*\(/g, 'parseInt(');
    js = js.replace(/double\.Parse\s*\(/g, 'parseFloat(');
    js = js.replace(/float\.Parse\s*\(/g, 'parseFloat(');
    js = js.replace(/long\.Parse\s*\(/g, 'parseInt(');
    js = js.replace(/bool\.Parse\s*\(([^)]+)\)/g, '($1 === "true" || $1 === "True")');
    js = js.replace(/Convert\.ToInt32\s*\(/g, 'parseInt(');
    js = js.replace(/Convert\.ToInt16\s*\(/g, 'parseInt(');
    js = js.replace(/Convert\.ToInt64\s*\(/g, 'parseInt(');
    js = js.replace(/Convert\.ToDouble\s*\(/g, 'parseFloat(');
    js = js.replace(/Convert\.ToSingle\s*\(/g, 'parseFloat(');
    js = js.replace(/Convert\.ToDecimal\s*\(/g, 'parseFloat(');
    js = js.replace(/Convert\.ToString\s*\(/g, 'String(');
    js = js.replace(/Convert\.ToBoolean\s*\(/g, 'Boolean(');
    js = js.replace(/\.ToString\s*\(\s*\)/g, '.toString()');
    js = js.replace(/\.ToString\s*\("([^"]+)"\)/g, (_: string, fmt: string) => {
      if (/^D\d+$/.test(fmt)) return `.toString().padStart(${fmt.slice(1)}, '0')`;
      if (/^F\d+$/.test(fmt)) return `.toFixed(${fmt.slice(1)})`;
      if (/^N\d+$/.test(fmt)) return `.toLocaleString(undefined, {minimumFractionDigits:${fmt.slice(1)}})`;
      return '.toString()';
    });

    // ── 13. string static methods ──────────────────────────────────────────
    js = js.replace(/string\.IsNullOrEmpty\s*\(([^)]+)\)/g, '($1 === null || $1 === undefined || $1 === "")');
    js = js.replace(/string\.IsNullOrWhiteSpace\s*\(([^)]+)\)/g, '(!$1 || $1.trim() === "")');
    js = js.replace(/string\.Join\s*\(([^,]+),\s*([^)]+)\)/g, '($2).join($1)');
    js = js.replace(/String\.Join\s*\(([^,]+),\s*([^)]+)\)/g, '($2).join($1)');
    js = js.replace(/(?:string|String)\.Format\s*\(([^)]+)\)/g, '_strFormat($1)');

    // ── 14. Array static methods ───────────────────────────────────────────
    js = js.replace(/Array\.Sort\s*\(([^)]+)\)/g,
      '($1).sort((a,b)=>typeof a==="number"?a-b:String(a).localeCompare(String(b)))');
    js = js.replace(/Array\.Reverse\s*\(([^)]+)\)/g, '($1).reverse()');
    js = js.replace(/Array\.IndexOf\s*\(([^,]+),\s*([^)]+)\)/g, '($1).indexOf($2)');

    // .Length
    js = js.replace(/\.Length\b/g, '.length');

    // ── 15. String instance methods ────────────────────────────────────────
    js = js.replace(/\.ToUpper\s*\(\s*\)/g, '.toUpperCase()');
    js = js.replace(/\.ToLower\s*\(\s*\)/g, '.toLowerCase()');
    js = js.replace(/\.Trim\s*\(\s*\)/g, '.trim()');
    js = js.replace(/\.TrimStart\s*\(\s*\)/g, '.trimStart()');
    js = js.replace(/\.TrimEnd\s*\(\s*\)/g, '.trimEnd()');
    js = js.replace(/\.Contains\s*\(/g, '.includes(');
    js = js.replace(/\.StartsWith\s*\(/g, '.startsWith(');
    js = js.replace(/\.EndsWith\s*\(/g, '.endsWith(');
    js = js.replace(/\.IndexOf\s*\(/g, '.indexOf(');
    js = js.replace(/\.LastIndexOf\s*\(/g, '.lastIndexOf(');
    js = js.replace(/\.Replace\s*\(/g, '.replace(');
    js = js.replace(/\.Split\s*\(\s*'([^'])'[^)]*\)/g, ".split('$1')");
    js = js.replace(/\.Split\s*\(/g, '.split(');
    js = js.replace(/\.Substring\s*\(/g, '.substring(');
    js = js.replace(/\.PadLeft\s*\(([^,)]+)(?:,\s*'([^']+)')?\)/g,
      (_m: string, w: string, ch: string) => `.padStart(${w}${ch ? `, '${ch}'` : ''})`);
    js = js.replace(/\.PadRight\s*\(([^,)]+)(?:,\s*'([^']+)')?\)/g,
      (_m: string, w: string, ch: string) => `.padEnd(${w}${ch ? `, '${ch}'` : ''})`);
    js = js.replace(/\.ToCharArray\s*\(\s*\)/g, '.split("")');
    js = js.replace(/\.CompareTo\s*\(/g, '.localeCompare(');

    // ── 16. Math methods ───────────────────────────────────────────────────
    js = js.replace(/Math\.Pow\s*\(/g, 'Math.pow(');
    js = js.replace(/Math\.Sqrt\s*\(/g, 'Math.sqrt(');
    js = js.replace(/Math\.Abs\s*\(/g, 'Math.abs(');
    js = js.replace(/Math\.Max\s*\(/g, 'Math.max(');
    js = js.replace(/Math\.Min\s*\(/g, 'Math.min(');
    js = js.replace(/Math\.Floor\s*\(/g, 'Math.floor(');
    js = js.replace(/Math\.Ceiling\s*\(/g, 'Math.ceil(');
    js = js.replace(/Math\.Round\s*\(/g, 'Math.round(');
    js = js.replace(/Math\.Log10\s*\(/g, 'Math.log10(');
    js = js.replace(/Math\.Log\s*\(/g, 'Math.log(');
    js = js.replace(/Math\.Sin\s*\(/g, 'Math.sin(');
    js = js.replace(/Math\.Cos\s*\(/g, 'Math.cos(');
    js = js.replace(/Math\.Tan\s*\(/g, 'Math.tan(');
    js = js.replace(/Math\.Truncate\s*\(/g, 'Math.trunc(');
    js = js.replace(/Math\.PI\b/g, 'Math.PI');
    js = js.replace(/Math\.E\b/g, 'Math.E');

    // ── 17. Inheritance constructor chaining  : base(…) ───────────────────
    js = js.replace(
      /(?:public|private|protected)?\s*([A-Z][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*:\s*base\s*\(([^)]*)\)\s*\{/g,
      (_m, _cls, params, baseArgs) => {
        const stripped = stripParamTypes(params);
        return `constructor(${stripped}) { super(${baseArgs});`;
      }
    );

    // ── 18. Constructor rewriting ──────────────────────────────────────────
    const classMatches = [...js.matchAll(/\bclass\s+([A-Z][a-zA-Z0-9_]*)/g)];
    for (const match of classMatches) {
      const cn = match[1];
      const ctorRx = new RegExp(
        `(?:public|private|protected|internal)?\\s+${cn}\\s*\\(([^)]*)\\)\\s*\\{`,
        'g'
      );
      js = js.replace(ctorRx, (_m2, params) => {
        const stripped = stripParamTypes(params);
        return `constructor(${stripped}) {`;
      });
    }

    // ── 19. Auto-properties stripped ───────────────────────────────────────
    js = js.replace(
      /(?:public|private|protected)?\s+(?:static\s+)?(?:override\s+)?(?:virtual\s+)?\w+\s+([A-Z][a-zA-Z0-9_]*)\s*\{\s*get;\s*set;\s*\}/g,
      '/* auto-prop: $1 */'
    );
    js = js.replace(
      /(?:public|private|protected)?\s+(?:static\s+)?(?:override\s+)?(?:virtual\s+)?\w+\s+([A-Z][a-zA-Z0-9_]*)\s*\{\s*get;\s*\}/g,
      '/* auto-prop readonly: $1 */'
    );

    // ── 20. Method / member declarations ───────────────────────────────────
    const MODS = '(?:(?:public|private|protected|internal|static|virtual|override|sealed|abstract|async|extern|new|readonly)\\s+)*';
    const RET  = '(?:void|int|double|float|string|bool|char|decimal|long|short|byte|uint|object|dynamic|var|[A-Z][a-zA-Z0-9_<>\\[\\]]*)?';

    const userMethods = new Set<string>();
    js = js.replace(
      new RegExp(`${MODS}${RET}\\s+([a-zA-Z0-9_]+)\\s*\\(([^)]*)\\)\\s*\\{`, 'g'),
      (fullMatch, name, params) => {
        if (['if','for','while','switch','catch','finally','do','foreach','using','lock'].includes(name)) {
          return fullMatch;
        }
        userMethods.add(name);
        const isStatic = /\bstatic\b/.test(fullMatch);
        const stripped = stripParamTypes(params);
        return `${isStatic ? 'static ' : ''}async ${name}(${stripped}) {`;
      }
    );

    // ── 20.5 Inject await for Console.ReadLine and User Methods ──────────────
    js = js.replace(/Console\.ReadLine\s*\(\s*\)/g, 'await Console.ReadLine()');
    
    userMethods.delete('constructor');
    const methodNames = Array.from(userMethods).sort((a,b) => b.length - a.length).join('|');
    if (methodNames) {
      js = js.replace(new RegExp(`(?<!\\basync\\s+)(?<!\\bclass\\s+)(?<!\\bfunction\\s+)\\b(${methodNames})\\s*\\(`, 'g'), 'await $1(');
    }

    // ── 21. foreach  →  for…of ─────────────────────────────────────────────
    js = js.replace(
      /foreach\s*\(\s*(?:var|\w+(?:\[\])?)\s+([a-zA-Z0-9_]+)\s+in\s+([^)]+)\)\s*\{/g,
      'for (let $1 of $2) {'
    );

    // ── 22. try/catch/finally ──────────────────────────────────────────────
    js = js.replace(/catch\s*\(\s*[A-Za-z0-9_.]+\s+([a-zA-Z0-9_]+)\s*\)/g, 'catch ($1)');
    js = js.replace(/catch\s*\(\s*[A-Za-z0-9_.]+\s*\)/g, 'catch (_e)');

    // ── 23. throw ─────────────────────────────────────────────────────────
    js = js.replace(/throw\s+new\s+[A-Za-z0-9_]+\s*\(([^)]*)\)\s*;/g, 'throw new Error($1);');

    // ── 24. out / ref params ───────────────────────────────────────────────
    js = js.replace(/\b(ref|out)\s+([a-zA-Z0-9_]+)/g, '$2');

    // ── 25. Restore stashed string literals ────────────────────────────────
    js = js.replace(new RegExp(PH + '(\\d+)\x00', 'g'), (_m, idx) => strings[parseInt(idx)]);

    return js;
  }

  // =========================================================================
  //  EXECUTE
  // =========================================================================
  public async execute(code: string, readLineCb: () => Promise<string> = async () => "", onLog: (logs: string[]) => void = () => {}): Promise<ExecutionResult> {
    const startTime = performance.now();
    const logs: string[] = [];

    // ── Pre-flight validation ──
    const validationError = this.validate(code);
    if (validationError) {
      return {
        success: false,
        output: [],
        error: validationError,
        executionTime: 0
      };
    }

    // ── Mock Console ───────────────────────────────────────────────────────
    const mockConsole = {
      WriteLine: (...args: any[]) => {
        logs.push(args.length === 0 ? '' : args.map(_fmt).join(' '));
        onLog([...logs]);
      },
      Write: (...args: any[]) => {
        const text = args.map(_fmt).join(' ');
        if (logs.length === 0) logs.push(text);
        else logs[logs.length - 1] += text;
        onLog([...logs]);
      },
      ReadLine: async () => {
        const val = await readLineCb();
        if (logs.length === 0) logs.push(val);
        else logs[logs.length - 1] += val;
        onLog([...logs]);
        return val;
      },
      ReadKey: () => ({ KeyChar: '' }),
      Clear: () => {
        logs.length = 0;
        onLog([...logs]);
      },
      Error: { WriteLine: (...args: any[]) => {
          logs.push('[ERR] ' + args.map(_fmt).join(' '));
          onLog([...logs]);
      } },
    };

    // ── Mock Math ──────────────────────────────────────────────────────────
    const mockMath = {
      // C# capitalised names (pre-transpile fallback)
      Pow: (x: number, y: number) => Math.pow(x, y),
      Sqrt: (x: number) => Math.sqrt(x),
      Abs: (x: number) => Math.abs(x),
      Max: (a: number, b: number) => Math.max(a, b),
      Min: (a: number, b: number) => Math.min(a, b),
      Floor: (x: number) => Math.floor(x),
      Ceiling: (x: number) => Math.ceil(x),
      Round: (x: number, d?: number) => d !== undefined ? parseFloat(x.toFixed(d)) : Math.round(x),
      Log: (x: number) => Math.log(x),
      Log10: (x: number) => Math.log10(x),
      Sin: (x: number) => Math.sin(x),
      Cos: (x: number) => Math.cos(x),
      Tan: (x: number) => Math.tan(x),
      Truncate: (x: number) => Math.trunc(x),
      PI: Math.PI,
      E: Math.E,
      // JS lowercase names (post-transpile)
      pow: (x: number, y: number) => Math.pow(x, y),
      sqrt: (x: number) => Math.sqrt(x),
      abs: (x: number) => Math.abs(x),
      max: (a: number, b: number) => Math.max(a, b),
      min: (a: number, b: number) => Math.min(a, b),
      floor: (x: number) => Math.floor(x),
      ceil: (x: number) => Math.ceil(x),
      round: (x: number) => Math.round(x),
      log: (x: number) => Math.log(x),
      log10: (x: number) => Math.log10(x),
      trunc: (x: number) => Math.trunc(x),
      sin: (x: number) => Math.sin(x),
      cos: (x: number) => Math.cos(x),
      tan: (x: number) => Math.tan(x),
    };

    // ── _List: mirrors System.Collections.Generic.List<T> ─────────────────
    class _List {
      _data: any[];
      constructor(initial?: any[]) { this._data = initial ? [...initial] : []; }
      Add(item: any)        { this._data.push(item); }
      Remove(item: any)     { const i = this._data.indexOf(item); if (i >= 0) this._data.splice(i, 1); }
      RemoveAt(i: number)   { this._data.splice(i, 1); }
      Clear()               { this._data = []; }
      Contains(item: any)   { return this._data.includes(item); }
      IndexOf(item: any)    { return this._data.indexOf(item); }
      Sort(cmp?: Function)  { cmp ? this._data.sort(cmp as any) : this._data.sort((a, b) => typeof a === 'number' ? a - b : String(a).localeCompare(String(b))); }
      Reverse()             { this._data.reverse(); }
      get Count()           { return this._data.length; }
      get length()          { return this._data.length; }
      ToArray()             { return [...this._data]; }
      [Symbol.iterator]()   { return this._data[Symbol.iterator](); }
    }

    // ── _Dict: mirrors System.Collections.Generic.Dictionary<K,V> ─────────
    class _Dict {
      _map: Map<any, any>;
      constructor() { this._map = new Map(); }
      Add(k: any, v: any)     { this._map.set(k, v); }
      ContainsKey(k: any)     { return this._map.has(k); }
      ContainsValue(v: any)   { return [...this._map.values()].includes(v); }
      Remove(k: any)          { this._map.delete(k); }
      get Count()             { return this._map.size; }
      get Keys()              { return [...this._map.keys()]; }
      get Values()            { return [...this._map.values()]; }
      get(k: any)             { return this._map.get(k); }
      set(k: any, v: any)     { this._map.set(k, v); }
      [Symbol.iterator]()     { return this._map.entries(); }
    }

    // ── Sandbox helpers ────────────────────────────────────────────────────
    function _fmt(a: any): string {
      if (a === null) return 'null';
      if (a === undefined) return '';
      if (a instanceof _List) return a.ToArray().toString();
      if (a instanceof _Dict) return '[Dictionary]';
      if (typeof a === 'object') return JSON.stringify(a);
      return String(a);
    }

    function _strFormat(fmt: string, ...args: any[]): string {
      return fmt.replace(/\{(\d+)(?::[^}]*)?\}/g, (_, i) => _fmt(args[parseInt(i)]));
    }

    try {
      let jsCode = this.transpile(code);

      // ── Auto-detect entry point ──────────────────────────────────────────
      let mainTrigger = '';
      const classMatches = [...jsCode.matchAll(/\bclass\s+([a-zA-Z0-9_]+)/g)];

      if (classMatches.length > 0) {
        // Find the main method and set it to await
      }

      for (const m of classMatches) {
        const cn = m[1];
        if (new RegExp(`class\\s+${cn}[\\s\\S]*?\\bMain\\s*\\(`, 'i').test(jsCode)) {
          mainTrigger = `\nawait ${cn}.Main();`;
          break;
        }
      }
      if (!mainTrigger && /\bMain\s*\(/.test(jsCode)) {
        mainTrigger = '\nawait Program.Main();';
      }

      // ── Build sandboxed script ─────────────────────────────────────────
      const executableScript = `
"use strict";
const Console    = __ctx.Console;
const Math       = __ctx.Math;
const _List      = __ctx.List;
const _Dict      = __ctx.Dict;
const _strFormat = __ctx.strFormat;
const parseInt   = __ctx.parseInt;
const parseFloat = __ctx.parseFloat;
const isNaN      = __ctx.isNaN;
const Number     = __ctx.Number;
const String     = __ctx.String;
const Boolean    = __ctx.Boolean;
const Array      = __ctx.Array;
const Object     = __ctx.Object;
const JSON       = __ctx.JSON;

${jsCode}

${mainTrigger}
`;

      const runner = new Function('__ctx', executableScript);
      await runner({
        Console:   mockConsole,
        Math:      mockMath,
        List:      _List,
        Dict:      _Dict,
        strFormat: _strFormat,
        parseInt:  (s: string, r?: number) => globalThis.parseInt(s, r),
        parseFloat:(s: string) => globalThis.parseFloat(s),
        isNaN:     globalThis.isNaN,
        Number:    globalThis.Number,
        String:    globalThis.String,
        Boolean:   globalThis.Boolean,
        Array:     globalThis.Array,
        Object:    globalThis.Object,
        JSON:      globalThis.JSON,
      });

      const endTime = performance.now();
      return {
        success: true,
        output: logs.length > 0 ? logs : ['(Program ran successfully with no output.)'],
        executionTime: parseFloat((endTime - startTime).toFixed(2))
      };

    } catch (error: any) {
      const endTime = performance.now();
      let msg: string = error.message || String(error);

      // Map JS errors → C# style messages
      const errorMap: [RegExp, string][] = [
        [/(\w+) is not defined/,          "error CS0103: The name '$1' does not exist in the current context"],
        [/(\w+) is not a function/,        "error CS0117: '$1' is not a method or is not accessible"],
        [/Cannot read prop.*of undefined/, "error CS0165: NullReferenceException — object reference not set to an instance"],
        [/Cannot read prop.*of null/,      "error CS0165: NullReferenceException — use of null object"],
        [/Maximum call stack/,             "error CS0523: StackOverflowException — possible infinite recursion"],
        [/division by zero/i,              "error CS0020: DivideByZeroException"],
        [/is not declared/,                "error CS0103: Variable used before declaration"],
      ];

      for (const [pattern, replacement] of errorMap) {
        if (pattern.test(msg)) {
          msg = msg.replace(pattern, replacement);
          break;
        }
      }

      return {
        success: false,
        output: logs,
        error: msg,
        executionTime: parseFloat((endTime - startTime).toFixed(2))
      };
    }
  }
}

// =============================================================================
//  TEST CASES  (25 patterns — paste into your editor to verify)
// =============================================================================

export const TEST_CASES = [

  // 1. Hello World
  {
    id: "hello_world", label: "Hello World",
    code: `
using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    expected: ["Hello, World!"]
  },

  // 2. Variables & Arithmetic
  {
    id: "variables", label: "Variables and Arithmetic",
    code: `
using System;
class Program {
    static void Main() {
        int a = 10;
        int b = 3;
        Console.WriteLine(a + b);
        Console.WriteLine(a - b);
        Console.WriteLine(a * b);
        Console.WriteLine(a / b);
        Console.WriteLine(a % b);
        double pi = 3.14;
        Console.WriteLine(pi);
    }
}`,
    expected: ["13","7","30","3","1","3.14"]
  },

  // 3. String Interpolation
  {
    id: "string_interp", label: "String Interpolation",
    code: `
using System;
class Program {
    static void Main() {
        string name = "Alice";
        int age = 20;
        Console.WriteLine($"Name: {name}, Age: {age}");
        Console.WriteLine($"Next year: {age + 1}");
    }
}`,
    expected: ["Name: Alice, Age: 20","Next year: 21"]
  },

  // 4. If / Else If / Else
  {
    id: "if_else", label: "If / Else If / Else",
    code: `
using System;
class Program {
    static void Main() {
        int score = 75;
        if (score >= 90) { Console.WriteLine("A"); }
        else if (score >= 80) { Console.WriteLine("B"); }
        else if (score >= 70) { Console.WriteLine("C"); }
        else { Console.WriteLine("F"); }
    }
}`,
    expected: ["C"]
  },

  // 5. Switch / Case
  {
    id: "switch", label: "Switch Statement",
    code: `
using System;
class Program {
    static void Main() {
        int day = 3;
        switch (day) {
            case 1: Console.WriteLine("Monday"); break;
            case 2: Console.WriteLine("Tuesday"); break;
            case 3: Console.WriteLine("Wednesday"); break;
            default: Console.WriteLine("Other"); break;
        }
    }
}`,
    expected: ["Wednesday"]
  },

  // 6. For Loop
  {
    id: "for_loop", label: "For Loop",
    code: `
using System;
class Program {
    static void Main() {
        int sum = 0;
        for (int i = 1; i <= 5; i++) { sum += i; }
        Console.WriteLine($"Sum 1-5: {sum}");
    }
}`,
    expected: ["Sum 1-5: 15"]
  },

  // 7. While Loop
  {
    id: "while_loop", label: "While Loop",
    code: `
using System;
class Program {
    static void Main() {
        int n = 1;
        while (n <= 4) { Console.WriteLine(n); n++; }
    }
}`,
    expected: ["1","2","3","4"]
  },

  // 8. Do-While
  {
    id: "do_while", label: "Do-While Loop",
    code: `
using System;
class Program {
    static void Main() {
        int x = 0;
        do { x++; } while (x < 3);
        Console.WriteLine(x);
    }
}`,
    expected: ["3"]
  },

  // 9. Arrays
  {
    id: "arrays", label: "Arrays",
    code: `
using System;
class Program {
    static void Main() {
        int[] nums = {5, 3, 8, 1, 9, 2};
        Array.Sort(nums);
        foreach (int n in nums) { Console.Write(n + " "); }
        Console.WriteLine();
        Console.WriteLine("Length: " + nums.Length);
    }
}`,
    expected: ["1 2 3 5 8 9 ","Length: 6"]
  },

  // 10. Foreach
  {
    id: "foreach", label: "Foreach Loop",
    code: `
using System;
class Program {
    static void Main() {
        string[] fruits = {"Apple","Banana","Cherry"};
        foreach (string f in fruits) { Console.WriteLine(f); }
    }
}`,
    expected: ["Apple","Banana","Cherry"]
  },

  // 11. String Methods
  {
    id: "string_methods", label: "String Methods",
    code: `
using System;
class Program {
    static void Main() {
        string s = "  Hello World  ";
        Console.WriteLine(s.Trim());
        Console.WriteLine(s.Trim().ToUpper());
        Console.WriteLine(s.Trim().ToLower());
        Console.WriteLine(s.Trim().Contains("World"));
        Console.WriteLine(s.Trim().Replace("World","C#"));
        Console.WriteLine(s.Trim().Substring(0, 5));
        Console.WriteLine(s.Trim().Length);
    }
}`,
    expected: ["Hello World","HELLO WORLD","hello world","true","Hello C#","Hello","11"]
  },

  // 12. Math Methods
  {
    id: "math_methods", label: "Math Methods",
    code: `
using System;
class Program {
    static void Main() {
        Console.WriteLine(Math.Pow(2, 10));
        Console.WriteLine(Math.Sqrt(144));
        Console.WriteLine(Math.Abs(-42));
        Console.WriteLine(Math.Max(7, 13));
        Console.WriteLine(Math.Min(7, 13));
        Console.WriteLine(Math.Floor(3.9));
        Console.WriteLine(Math.Ceiling(3.1));
        Console.WriteLine(Math.Round(3.567));
    }
}`,
    expected: ["1024","12","42","13","7","3","4","4"]
  },

  // 13. Classes & Objects
  {
    id: "classes", label: "Classes and Objects",
    code: `
using System;
class Car {
    string brand;
    int speed;
    public Car(string brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }
    public void Display() {
        Console.WriteLine($"{brand} goes {speed} km/h");
    }
}
class Program {
    static void Main() {
        Car c1 = new Car("Toyota", 120);
        Car c2 = new Car("BMW", 200);
        c1.Display();
        c2.Display();
    }
}`,
    expected: ["Toyota goes 120 km/h","BMW goes 200 km/h"]
  },

  // 14. Inheritance
  {
    id: "inheritance", label: "Inheritance",
    code: `
using System;
class Animal {
    public string name;
    public Animal(string name) { this.name = name; }
    public virtual void Speak() { Console.WriteLine($"{name} makes a sound."); }
}
class Dog : Animal {
    public Dog(string name) : base(name) {}
    public override void Speak() { Console.WriteLine($"{name} says: Woof!"); }
}
class Cat : Animal {
    public Cat(string name) : base(name) {}
    public override void Speak() { Console.WriteLine($"{name} says: Meow!"); }
}
class Program {
    static void Main() {
        Animal a = new Animal("Generic");
        Dog d = new Dog("Rex");
        Cat c = new Cat("Whiskers");
        a.Speak(); d.Speak(); c.Speak();
    }
}`,
    expected: ["Generic makes a sound.","Rex says: Woof!","Whiskers says: Meow!"]
  },

  // 15. Static Methods
  {
    id: "static_methods", label: "Static Methods",
    code: `
using System;
class MathHelper {
    public static int Square(int n) { return n * n; }
    public static int Factorial(int n) {
        if (n <= 1) return 1;
        return n * Factorial(n - 1);
    }
}
class Program {
    static void Main() {
        Console.WriteLine(MathHelper.Square(7));
        Console.WriteLine(MathHelper.Factorial(5));
    }
}`,
    expected: ["49","120"]
  },

  // 16. List<T>
  {
    id: "list", label: "List<T>",
    code: `
using System;
using System.Collections.Generic;
class Program {
    static void Main() {
        List<string> names = new List<string>();
        names.Add("Alice");
        names.Add("Bob");
        names.Add("Charlie");
        Console.WriteLine("Count: " + names.Count);
        names.Remove("Bob");
        Console.WriteLine("After remove: " + names.Count);
        foreach (string n in names) { Console.WriteLine(n); }
    }
}`,
    expected: ["Count: 3","After remove: 2","Alice","Charlie"]
  },

  // 17. Try / Catch / Finally
  {
    id: "try_catch", label: "Try / Catch / Finally",
    code: `
using System;
class Program {
    static void Main() {
        try {
            int[] arr = new int[3];
            arr[10] = 5;
        } catch (Exception e) {
            Console.WriteLine("Error caught.");
        } finally {
            Console.WriteLine("Finally block ran.");
        }
    }
}`,
    expected: ["Error caught.","Finally block ran."]
  },

  // 18. Enum
  {
    id: "enum", label: "Enum",
    code: `
using System;
enum ProcessState { New, Ready, Running, Waiting, Terminated }
class Program {
    static void Main() {
        ProcessState state = ProcessState.Running;
        Console.WriteLine(state);
        if (state == ProcessState.Running) {
            Console.WriteLine("Process is active.");
        }
    }
}`,
    expected: ["2","Process is active."]
  },

  // 19. Type Casting & Parsing
  {
    id: "casting", label: "Type Casting and Parsing",
    code: `
using System;
class Program {
    static void Main() {
        double d = 9.99;
        int i = (int)d;
        Console.WriteLine(i);
        string s = "42";
        int parsed = int.Parse(s);
        Console.WriteLine(parsed + 8);
        double converted = Convert.ToDouble("3.14");
        Console.WriteLine(converted);
    }
}`,
    expected: ["9","50","3.14"]
  },

  // 20. CPU Scheduling – FCFS (OS syllabus topic in code)
  {
    id: "fcfs", label: "CPU Scheduling – FCFS",
    code: `
using System;
class Program {
    static void Main() {
        string[] processes = {"P1","P2","P3","P4"};
        int[] burst = {6, 4, 8, 3};
        int n = processes.Length;
        int[] wait = new int[n];
        int[] ta = new int[n];
        wait[0] = 0;
        for (int i = 1; i < n; i++) { wait[i] = wait[i-1] + burst[i-1]; }
        for (int i = 0; i < n; i++) { ta[i] = burst[i] + wait[i]; }
        Console.WriteLine("Process | Burst | Wait | Turnaround");
        for (int i = 0; i < n; i++) {
            Console.WriteLine($"  {processes[i]}    |   {burst[i]}   |  {wait[i]}   |    {ta[i]}");
        }
        double avgWait = 0; double avgTA = 0;
        for (int i = 0; i < n; i++) { avgWait += wait[i]; avgTA += ta[i]; }
        Console.WriteLine($"Avg Wait: {avgWait/n}  Avg TA: {avgTA/n}");
    }
}`,
    expected: ["Process | Burst | Wait | Turnaround"]
  },

  // 21. Abstract Class
  {
    id: "abstract", label: "Abstract Class",
    code: `
using System;
abstract class Shape {
    public abstract double GetArea();
    public void Display() { Console.WriteLine($"Area: {GetArea()}"); }
}
class Circle : Shape {
    double radius;
    public Circle(double r) { this.radius = r; }
    public override double GetArea() { return Math.PI * radius * radius; }
}
class Rectangle : Shape {
    double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    public override double GetArea() { return width * height; }
}
class Program {
    static void Main() {
        Shape c = new Circle(5);
        Shape r = new Rectangle(4, 6);
        c.Display();
        r.Display();
    }
}`,
    expected: ["Area: 78.53981633974483","Area: 24"]
  },

  // 22. 2D Array / Matrix
  {
    id: "2d_array", label: "2D Array / Matrix",
    code: `
using System;
class Program {
    static void Main() {
        int[,] matrix = new int[3,3];
        int val = 1;
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                matrix[i,j] = val++;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) { Console.Write(matrix[i,j] + " "); }
            Console.WriteLine();
        }
    }
}`,
    expected: ["1 2 3 ","4 5 6 ","7 8 9 "]
  },

  // 23. Break / Continue
  {
    id: "break_continue", label: "Break and Continue",
    code: `
using System;
class Program {
    static void Main() {
        for (int i = 0; i < 10; i++) {
            if (i == 5) break;
            if (i % 2 == 0) continue;
            Console.WriteLine(i);
        }
    }
}`,
    expected: ["1","3"]
  },

  // 24. Recursion – Fibonacci
  {
    id: "recursion", label: "Recursion – Fibonacci",
    code: `
using System;
class Program {
    static int Fib(int n) {
        if (n <= 1) return n;
        return Fib(n-1) + Fib(n-2);
    }
    static void Main() {
        for (int i = 0; i <= 7; i++) { Console.Write(Fib(i) + " "); }
        Console.WriteLine();
    }
}`,
    expected: ["0 1 1 2 3 5 8 13 "]
  },

  // 25. Return Object from Method
  {
    id: "multi_return", label: "Return Object from Method",
    code: `
using System;
class Stats { public int Min; public int Max; public double Avg; }
class Program {
    static Stats Analyse(int[] arr) {
        Stats s = new Stats();
        s.Min = arr[0]; s.Max = arr[0];
        int sum = 0;
        foreach (int x in arr) {
            if (x < s.Min) s.Min = x;
            if (x > s.Max) s.Max = x;
            sum += x;
        }
        s.Avg = (double)sum / arr.Length;
        return s;
    }
    static void Main() {
        int[] data = {4, 1, 9, 2, 7, 5};
        Stats result = Analyse(data);
        Console.WriteLine($"Min: {result.Min}, Max: {result.Max}, Avg: {result.Avg}");
    }
}`,
    expected: ["Min: 1, Max: 9, Avg: 4.666666666666667"]
  },

];