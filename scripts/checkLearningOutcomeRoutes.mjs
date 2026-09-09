import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import assert from 'node:assert/strict';
const dataUrl = (source) => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64')}`;
const constants = dataUrl((await readFile('src/data/constants.ts', 'utf8')).replace(/import\s*\{[\s\S]*?\}\s*from\s*'lucide-react';/, ''));
const availability = dataUrl(await readFile('src/features/courses/courseContentAvailability.ts', 'utf8'));
let source = await readFile('src/utils/learningOutcomeSeo.ts', 'utf8');
source = source.replace("'../data/constants'", JSON.stringify(constants)).replace("'../features/courses/courseContentAvailability'", JSON.stringify(availability)).replace("import learningOutcomeTitles from '../data/learningOutcomeTitles.json';", `const learningOutcomeTitles = ${await readFile('src/data/learningOutcomeTitles.json', 'utf8')};`);
const routes = await import(dataUrl(source));
const { CURRICULUM_REGISTRY } = await import(constants);
let count = 0;
const generic = [];
for (const course of CURRICULUM_REGISTRY) for (const subject of routes.getAvailableSubjects(course)) {
  const paths = new Set();
  for (let n = 1; n <= subject.outcomeCount; n++) {
    const path = routes.getLearningOutcomePath(course, subject, n);
    const segment = path.split('/').at(-1);
    const slug = routes.slugifyLearningPath(subject.name);
    assert.equal(routes.findLearningOutcomeRoute(course.id, slug, segment)?.outcomeNumber, n);
    assert.equal(routes.findLearningOutcomeRoute(course.id, slug, String(n))?.outcomePath, path);
    assert(!paths.has(path)); paths.add(path);
    if (/learning-outcome-\d+$/.test(path)) generic.push(path);
    count++;
  }
  assert.equal(routes.findLearningOutcomeRoute(course.id, routes.slugifyLearningPath(subject.name), '0'), null);
}
console.log(`Verified ${count} descriptive routes, legacy resolution, and uniqueness.`);
assert.equal(generic.length, 0, `Missing lesson titles: ${generic.join(', ')}`);
