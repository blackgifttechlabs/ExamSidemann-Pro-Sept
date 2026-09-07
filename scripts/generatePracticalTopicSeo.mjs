import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const sourcePath = path.join(root, 'src/features/practicals', 'practicalsCatalog.ts');
const outputPath = path.join(root, 'src/data', 'practicalTopicSeo.json');
const source = await readFile(sourcePath, 'utf8');
const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);

const slugify = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const literalProperty = (node, name) => {
  const property = node.properties.find((candidate) => (
    ts.isPropertyAssignment(candidate) && candidate.name.getText(sourceFile).replace(/['"]/g, '') === name
  ));
  return property && ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
    ? property.initializer.text
    : '';
};

const topics = [];
const visit = (node) => {
  if (ts.isObjectLiteralExpression(node)) {
    const legacyPath = literalProperty(node, 'route');
    const routeParts = legacyPath.split('/').filter(Boolean);
    if (
      routeParts.length === 4 &&
      routeParts[0] === 'practicals' &&
      routeParts[1] === 'polytechnic' &&
      ['drawing', 'fabrication'].includes(routeParts[2])
    ) {
      const title = literalProperty(node, 'title');
      const description = literalProperty(node, 'blurb');
      if (title && description) {
        const subjectPath = `/practicals/polytechnic/${routeParts[2]}`;
        topics.push({
          legacyPath,
          path: `${subjectPath}/${slugify(title)}`,
          subjectPath,
          subject: routeParts[2] === 'drawing' ? 'Technical Drawing' : 'Fabrication Engineering Drawing',
          title,
          description,
          level: 'Polytechnic',
        });
      }
    }
  }
  ts.forEachChild(node, visit);
};
visit(sourceFile);

const uniqueTopics = [...new Map(topics.map((topic) => [topic.path, topic])).values()];
await writeFile(outputPath, `${JSON.stringify(uniqueTopics, null, 2)}\n`);
console.log(`Generated ${uniqueTopics.length} Polytechnic practical SEO records.`);
