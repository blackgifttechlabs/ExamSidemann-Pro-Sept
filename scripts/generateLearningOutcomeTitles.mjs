import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(
  ROOT,
  'src/features/courses',
  'polytechnic',
);
const outputPath = path.join(ROOT, 'src/data', 'learningOutcomeTitles.json');
const feedNotesOutputPath = path.join(ROOT, 'src/data', 'feedNotes.json');
const titles = {};
const feedNotes = {};

const cleanJsxHeading = (value) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/\{[^}]*\}/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/^learning outcome\s+\d+\s*[-–—:]?\s*/i, '')
  .trim();

const cleanNoteText = (value) => cleanJsxHeading(value)
  .replace(/&rho;/g, 'ρ')
  .replace(/&lambda;/g, 'λ')
  .replace(/&times;/g, '×')
  .replace(/&divide;/g, '÷')
  .replace(/&asymp;/g, '≈')
  .replace(/&rarr;|&#8594;/g, '→')
  .replace(/&sup2;/g, '²')
  .replace(/&sup3;/g, '³')
  .replace(/\s+([,.;:!?])/g, '$1')
  .trim();

const NOTE_NOISE = /(?:place this file|image ready to add|click (?:here|the)|mark as mastered|open class notes|learning outcome navigation|previous outcome|next outcome|toggle navigation|select a topic|loading\.\.\.|export\s+(?:default|const)|\bconst\s+\w+\s*=|\breturn\s*\(|\buseState\b|window\.|scrollTo|className=|=>)/i;
const meaningfulText = (text, minimum = 28, maximum = 620) => {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return text.length >= minimum && text.length <= maximum && wordCount >= 6 && !NOTE_NOISE.test(text);
};

const uniqueTexts = (items, minimum = 28, maximum = 620) => items.filter((text, index, all) => (
  meaningfulText(text, minimum, maximum) && all.findIndex((candidate) => candidate.toLowerCase() === text.toLowerCase()) === index
));

const noteKindFor = (title, text) => {
  const value = `${title} ${text}`.toLowerCase();
  if (/did you know|interesting fact|fun fact/.test(value)) return 'did_you_know';
  if (/\btheorem\b|key rule|law of /.test(value)) return 'theorem';
  if (/\bformula\b|\bequation\b/.test(title.toLowerCase()) || (text.length <= 180 && /[a-z0-9)²³]\s*(?:=|→|≈)\s*[a-z0-9(]/i.test(text))) return 'formula';
  if (/\bdefinition\b|\bmeans\b|\bis (?:the|a|an)\b/.test(value)) return 'definition';
  if (/\bexample\b|worked example/.test(value)) return 'example';
  return 'explanation';
};

const humanizeIdentifier = (value) => value
  .replace(/\.[^.]+$/, '')
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[-_]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const cleanCardTitle = (value) => cleanNoteText(value)
  .replace(/[📌📝✏️💡✅🔍]/gu, '')
  .replace(/^P\d+:\s*/i, '')
  .replace(/^\d+[.)]?\s+/, '')
  .replace(/^[a-z][.)]\s+/i, '')
  .replace(/\s+/g, ' ')
  .trim();

const usableLessonTitle = (value) => (
  value.length >= 4 && value.length <= 110 && !NOTE_NOISE.test(value) &&
  !/^(?:simply easy\b.*|key terms|key vocabulary|worked examples?|exam tips?|quick quiz|remember)$/i.test(value)
);

const conceptFromPoints = (points = []) => {
  const opening = String(points[0] || '')
    .replace(/^(?:Definition|Explanation|More to know):\s*/i, '')
    .replace(/^•\s*/, '')
    .trim();
  const concept = opening.match(/^(.{2,72}?)\s+(?:is|are|means|refers to|describes|involves|occurs|happens|operates?)\b/i)?.[1];
  if (!concept || concept.split(/\s+/).length > 9) return '';
  return cleanCardTitle(concept)
    .replace(/^['"]|['"]$/g, '')
    .replace(/:\s*(?:this|that|it)\s*$/i, '')
    .trim();
};

const contextualCardTitle = (rawTitle, lessonTitle, points = []) => {
  const title = cleanCardTitle(rawTitle);
  const context = cleanCardTitle(lessonTitle);
  const inferredConcept = conceptFromPoints(points);
  if (!title) return context;
  if (!context || title.toLowerCase() === context.toLowerCase()) return title;

  if (/^(?:key terms?|key vocabulary|vocabulary)$/i.test(title)) return `${context}: Essential Terms`;
  if (/^(?:key takeaways?|final exam tips?|exam tips?(?:\s*&\s*cheat sheet)?|remember|summary)$/i.test(title)) return `${context}: What to Remember`;
  if (/^(?:what(?:'s| is) the big idea\??|introduction|overview)$/i.test(title)) return `Understanding ${context}`;
  if (/^definition$/i.test(title)) return `${context}: Definition`;
  if (/^explanation$/i.test(title)) return `How ${context} Works`;
  if (/^how it works$/i.test(title)) return `How ${context} Works`;
  if (/^classification$/i.test(title)) return `${context}: Classification Methods`;
  if (/^functions?\s*(?:&|and)\s*sphere$/i.test(title)) return inferredConcept || `Functions and Scope of ${context}`;
  if (/^(physical|human|economic|social|political|environmental) factors$/i.test(title)) return `${title} Affecting ${context}`;
  if (/snapshot$/i.test(title)) return title.replace(/snapshot$/i, 'Overview');

  const words = title.split(/\s+/).length;
  const vague = words <= 2 || /^(?:types?|examples?|causes?|effects?|importance|advantages?|disadvantages?|functions?|features?|characteristics?|components?|methods?|steps?|operation|process|classification|branching|syntax|read|combination)$/i.test(title);
  if (vague) {
    if (
      inferredConcept &&
      inferredConcept.toLowerCase() !== title.toLowerCase() &&
      inferredConcept.toLowerCase().startsWith(title.toLowerCase())
    ) return inferredConcept;
    const opening = String(points[0] || '').replace(/^(?:Definition|Explanation|More to know):\s*/i, '').trim();
    const firstSentence = opening.split(/[.!?](?:\s|$)/)[0];
    if (/^(?:range|mean|median|mode|variance|probability)$/i.test(title) && firstSentence && firstSentence.length <= 90) {
      return `${title}: ${firstSentence}`;
    }
    return `${title} in ${context}`;
  }
  if (title.toLowerCase().includes(context.toLowerCase()) || context.toLowerCase().includes(title.toLowerCase())) return title;
  return title;
};

const extractDirectImage = (section, source) => {
  const matches = [
    ...section.matchAll(/src\s*=\s*["'](\/images\/[^"']+)["']/gi),
    ...section.matchAll(/src\s*=\s*\{\s*["'`](\/images\/[^"'`]+)["'`]\s*\}/gi),
    ...section.matchAll(/["'`](\/images\/[^"'`${}]+\.(?:png|jpe?g|webp|avif|svg))["'`]/gi),
  ];
  const direct = matches.map((match) => match[1]).find((url) => !/[${}]/.test(url));
  if (direct) return direct;

  const fileName = section.match(/fileName\s*=\s*["']([^"']+\.(?:png|jpe?g|webp|avif|svg))["']/i)?.[1];
  const basePath = source.match(/["'`](\/images\/[^"'`${}]*\/)["'`]/i)?.[1];
  return fileName && basePath ? `${basePath}${fileName}` : undefined;
};

const extractJsxLessonCards = (source) => {
  const headingMatches = Array.from(source.matchAll(/<h([234])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi));
  return headingMatches.map((match, index) => {
    const title = cleanNoteText(match[2]);
    const start = (match.index || 0) + match[0].length;
    const end = headingMatches[index + 1]?.index || source.length;
    const section = source.slice(start, end);
    const paragraphs = uniqueTexts(Array.from(section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((item) => cleanNoteText(item[1])))
      .slice(0, 3);
    const listItems = uniqueTexts(Array.from(section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
      .map((item) => cleanNoteText(item[1])), 18, 380)
      .slice(0, 6);
    const formulae = uniqueTexts(Array.from(section.matchAll(/<(?:Formula|MathBlock)[^>]*>([\s\S]*?)<\/(?:Formula|MathBlock)>/gi))
      .map((item) => cleanNoteText(item[1])), 5, 300)
      .slice(0, 2);
    const blocks = [];
    paragraphs.forEach((body) => blocks.push({ kind: noteKindFor(title, body), body }));
    formulae.forEach((body) => blocks.push({ kind: 'formula', body }));
    if (listItems.length >= 2) blocks.push({ kind: 'list', title: `Key points about ${title}`, items: listItems });
    const imageUrl = extractDirectImage(section, source);
    const points = [
      ...paragraphs.map((text) => `${noteKindFor(title, text) === 'definition' ? 'Definition' : 'Explanation'}: ${text.replace(/^(?:Definition|Explanation):\s*/i, '')}`),
      ...formulae.map((text) => `Formula: ${text}`),
      ...listItems,
    ].slice(0, 8);
    return { title, subtitle: blocks[0]?.kind === 'did_you_know' ? 'A useful fact to remember' : 'Understand the idea, then remember the details', points, blocks, imageUrl };
  }).filter((card) => (
    card.title.length >= 4 &&
    !NOTE_NOISE.test(card.title) &&
    card.blocks.length > 0 &&
    card.points.length >= 1
  ));
};

const readPropertyName = (property) => {
  if (!property?.name) return '';
  if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) return property.name.text;
  return '';
};

const readText = (node) => {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return cleanNoteText(node.text);
  return '';
};

const readStringArray = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(readText).filter((text) => text.length >= 12 && text.length <= 600);
};

const objectProperties = (node) => Object.fromEntries(node.properties
  .filter(ts.isPropertyAssignment)
  .map((property) => [readPropertyName(property), property.initializer]));

/**
 * Many high-school lessons keep their real teaching copy in data objects rather
 * than literal JSX. Read those objects without executing the lesson component.
 */
const extractObjectLessonCards = (source, filename) => {
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const namedObjects = new Map();
  const sectionObjects = [];

  const visitNode = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      if (ts.isObjectLiteralExpression(node.initializer)) namedObjects.set(node.name.text, node.initializer);
      if (ts.isArrayLiteralExpression(node.initializer) && /sections?|chapters?|lessons?/i.test(node.name.text)) {
        node.initializer.elements.filter(ts.isObjectLiteralExpression).forEach((item) => sectionObjects.push(item));
      }
    }
    ts.forEachChild(node, visitNode);
  };
  visitNode(sourceFile);

  const cards = [];
  sectionObjects.forEach((section) => {
    const fields = objectProperties(section);
    const title = readText(fields.heading) || readText(fields.title);
    const intro = readText(fields.intro) || readText(fields.description);
    const intro2 = readText(fields.intro2);
    const definition = readText(fields.definition);
    const theorems = readStringArray(fields.theorems);
    if (title && (intro || intro2 || definition || theorems.length)) {
      cards.push({
        title,
        points: [
          intro && `Explanation: ${intro}`,
          intro2 && `More to know: ${intro2}`,
          definition && `Definition: ${definition}`,
          ...theorems.map((text) => `Key rule: ${text}`),
        ].filter(Boolean).slice(0, 7),
      });
    }

    if (!fields.examples || !ts.isArrayLiteralExpression(fields.examples)) return;
    fields.examples.elements.forEach((exampleNode) => {
      const example = ts.isIdentifier(exampleNode)
        ? namedObjects.get(exampleNode.text)
        : (ts.isObjectLiteralExpression(exampleNode) ? exampleNode : undefined);
      if (!example) return;
      const exampleFields = objectProperties(example);
      const tag = readText(exampleFields.tag) || 'Worked Example';
      const question = readText(exampleFields.question);
      const steps = readStringArray(exampleFields.steps);
      const answer = readText(exampleFields.answer);
      if (!question || (!steps.length && !answer)) return;
      cards.push({
        title: title ? `${title} — ${tag}` : tag,
        points: [
          `Example: ${question}`,
          ...steps.map((text, index) => `Step ${index + 1}: ${text}`),
          answer && `Answer: ${answer}`,
        ].filter(Boolean).slice(0, 7),
      });
    });
  });

  return cards.filter((card, index, all) => all.findIndex((candidate) => (
    candidate.title === card.title && candidate.points[0] === card.points[0]
  )) === index);
};

const visit = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(entryPath);
      return;
    }

    const match = entry.name.match(/^LearningOutcome(\d+)\.tsx$/);
    if (!match) return;

    const relativePath = path.relative(SOURCE_ROOT, entryPath);
    const [courseId, subjectDirectory] = relativePath.split(path.sep);
    if (!courseId || !subjectDirectory) return;

    let source = await readFile(entryPath, 'utf8');
    const reExport = source.match(/export\s+\*\s+from\s+["']([^"']+)["']/);
    if (reExport) {
      const exportedPath = path.resolve(path.dirname(entryPath), `${reExport[1]}.tsx`);
      try {
        source = await readFile(exportedPath, 'utf8');
      } catch {
        // Keep processing the original file if the re-export is external or
        // does not point to a local TSX lesson.
      }
    }
    const headingMatch = source.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i);
    if (!headingMatch) return;

    const heading = cleanJsxHeading(headingMatch[1]);
    if (!heading || /^learning outcome\s*\d*$/i.test(heading)) return;
    titles[`${courseId}|${subjectDirectory}|${match[1]}`] = heading;
  }));
};

await visit(SOURCE_ROOT);

// Shared banking pages keep their lesson titles in module data.
const bankingSource = await readFile(path.join(SOURCE_ROOT, 'banking-nc/_BankingOutcomePage.tsx'), 'utf8');
const bankingAst = ts.createSourceFile('banking.tsx', bankingSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const visitBanking = (node) => {
  if (ts.isVariableDeclaration(node) && node.name.getText(bankingAst) === 'modules' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
    for (const property of node.initializer.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isObjectLiteralExpression(property.initializer)) continue;
      const fields = objectProperties(property.initializer);
      readStringArray(fields.outcomes).forEach((title, index) => {
        titles[`banking-nc|${readPropertyName(property)}|${index + 1}`] = title.replace(/\.$/, '');
      });
    }
  }
  ts.forEachChild(node, visitBanking);
};
visitBanking(bankingAst);
for (const [level, category] of [['form-1', 'zjc'], ['form-2', 'zjc'], ['form-3', 'o-level'], ['form-4', 'o-level']]) {
  for (const number of [1, 2]) {
    const source = await readFile(path.join(ROOT, 'src/features/courses', category, level, 'frs', `topic${number}.tsx`), 'utf8');
    const heading = source.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i);
    if (heading) titles[`${level}|family-and-religious-studies|${number}`] = cleanJsxHeading(heading[1]);
  }
}


const visitFeedNotes = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visitFeedNotes(entryPath);
      return;
    }
    if (!/\.tsx$/i.test(entry.name)) return;
    const relativeCoursePath = path.relative(path.join(ROOT, 'src/features/courses'), entryPath).split(path.sep).join('/');
    const isHighSchoolLesson = relativeCoursePath.startsWith('o-level/') || relativeCoursePath.startsWith('zjc/');
    if (!/^LearningOutcome\d+\.tsx$/i.test(entry.name) && !isHighSchoolLesson) return;
    let source = await readFile(entryPath, 'utf8');
    const reExport = source.match(/export\s+\*\s+from\s+["']([^"']+)["']/);
    if (reExport) {
      const exportedPath = path.resolve(path.dirname(entryPath), `${reExport[1]}.tsx`);
      try {
        source = await readFile(exportedPath, 'utf8');
      } catch {
        // Keep processing the original file if the re-export is external or
        // does not point to a local TSX lesson.
      }
    }
    const headingMatch = source.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)
      || source.match(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/i);
    const jsxCards = extractJsxLessonCards(source);
    const objectCards = extractObjectLessonCards(source, entryPath);
    const objectTitles = new Set(objectCards.map((card) => card.title.toLowerCase()));
    const remainingJsxCards = jsxCards
      .filter((card) => !objectTitles.has(card.title.toLowerCase()))
      .sort((left, right) => {
        const score = (card) => (card.imageUrl ? 20 : 0)
          + (card.blocks?.some((block) => block.kind === 'definition') ? 8 : 0)
          + (card.blocks?.some((block) => block.kind === 'formula' || block.kind === 'theorem') ? 8 : 0)
          + Math.min(card.points.length, 6);
        return score(right) - score(left);
      });
    const selectedCards = [
      ...objectCards.slice(0, 12),
      ...remainingJsxCards.slice(0, Math.max(0, 16 - objectCards.length)),
    ]
      .filter((card, index, all) => all.findIndex((candidate) => (
        candidate.title === card.title && candidate.points[0] === card.points[0]
      )) === index)
      .filter((card) => !/^(?:q\d+[.:]|quick quiz|practice zone|review questions?|exercises?)/i.test(cleanCardTitle(card.title)))
      .filter((card) => card.points.some((point) => meaningfulText(point, 18, 650)))
      .slice(0, 16);
    const headingTitle = headingMatch ? cleanCardTitle(headingMatch[1]) : '';
    const fileTitle = humanizeIdentifier(entry.name);
    const subjectDirectoryTitle = humanizeIdentifier(path.basename(path.dirname(entryPath)));
    const preferredFileTitle = isHighSchoolLesson && !/^Learning Outcome\s*\d+$/i.test(fileTitle) && !/^Topic\s*\d+$/i.test(fileTitle)
      ? fileTitle
      : '';
    const title = preferredFileTitle
      || (usableLessonTitle(headingTitle) ? headingTitle : '')
      || subjectDirectoryTitle
      || cleanCardTitle(selectedCards[0]?.title || '');
    const cards = selectedCards.map((card) => ({
      ...card,
      title: contextualCardTitle(card.title, title, card.points),
    }));
    const snippets = Array.from(source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((match) => cleanNoteText(match[1]))
      .filter((text) => meaningfulText(text) && !/^(tip|note|example)\s*:?$/i.test(text))
      .filter((text, index, all) => all.indexOf(text) === index)
      .slice(0, 4);
    if (!title || (snippets.length === 0 && cards.length === 0)) return;
    const key = relativeCoursePath.replace(/\.tsx$/i, '');
    feedNotes[key] = { title, snippets: snippets.length ? snippets : cards[0].points, cards };
  }));
};

await visitFeedNotes(path.join(ROOT, 'src/features/courses'));
const sortedTitles = Object.fromEntries(
  Object.entries(titles).sort(([left], [right]) => left.localeCompare(right)),
);
await writeFile(outputPath, `${JSON.stringify(sortedTitles, null, 2)}\n`);
await writeFile(feedNotesOutputPath, `${JSON.stringify(Object.fromEntries(
  Object.entries(feedNotes).sort(([left], [right]) => left.localeCompare(right)),
), null, 2)}\n`);
console.log(`Generated ${Object.keys(sortedTitles).length} learning outcome titles.`);
console.log(`Generated ${Object.keys(feedNotes).length} personalization lesson sources.`);
