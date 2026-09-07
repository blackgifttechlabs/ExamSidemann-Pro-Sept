import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const errors = [];
let checked = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!/\.[cm]?[jt]sx?$/.test(entry.name)) continue;
    const source = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function walk(node) {
      let specifier;
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specifier = node.moduleSpecifier;
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) specifier = node.arguments[0];
      if (specifier && ts.isStringLiteralLike(specifier) && /^(\.|@\/)/.test(specifier.text)) {
        checked++;
        if (!ts.resolveModuleName(specifier.text, file, options, ts.sys).resolvedModule) errors.push(`${path.relative(root, file)}: ${specifier.text}`);
      }
      ts.forEachChild(node, walk);
    }
    walk(source);
  }
}
await visit(path.join(root, 'src'));
await visit(path.join(root, 'api'));
if (errors.length) throw new Error(`Unresolved local imports:\n${errors.join('\n')}`);
console.log(`Verified ${checked} local imports, including lazy-loaded route modules.`);
