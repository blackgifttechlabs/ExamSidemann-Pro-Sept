import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const SITE_URL = 'https://www.examsidemann.com';
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const slugify = (value) => value
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/\./g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const EXAM_MONTHS = new Map([
  ['january', 0], ['february', 1], ['march', 2], ['april', 3],
  ['may', 4], ['june', 5], ['july', 6], ['august', 7],
  ['september', 8], ['october', 9], ['november', 10], ['december', 11],
]);

const isPublishedExamSeries = (record, now = new Date()) => {
  const label = String(record.year || '').trim().toLowerCase();
  const yearMatch = label.match(/\b(20\d{2})\b/);
  if (!yearMatch) return true;
  const seriesYear = Number(yearMatch[1]);
  if (seriesYear !== now.getUTCFullYear()) return seriesYear < now.getUTCFullYear();
  const month = [...EXAM_MONTHS].find(([name]) => label.includes(name))?.[1];
  return month === undefined || month <= now.getUTCMonth();
};

const isValidDriveFileId = (fileId) => (
  fileId !== 'PASTE_GOOGLE_DRIVE_FILE_ID_HERE' &&
  /^[A-Za-z0-9_-]{10,}$/.test(String(fileId || ''))
);

const normalizePastPaperCourse = (record) => {
  if (record.level !== 'Polytechnic') {
    if (record.sublevel === "O'Level") return "O' Level";
    if (record.sublevel === "A'Level") return "A' Level";
    return record.sublevel;
  }

  const value = record.sublevel.toLowerCase();
  const qualification = value.includes('nd') ? 'ND' : 'NC';
  if (value.includes('information technology')) return `${qualification} Information Technology`;
  if (value.includes('purchasing')) return `${qualification} Purchasing & Supply`;
  if (value.includes('records')) return qualification === 'ND' ? 'ND Records & Information Management' : 'NC Records Management';
  if (value.includes('auto')) return 'NC Auto Electrics';
  if (value.includes('banking')) return 'NC Banking and Finance';
  return record.sublevel;
};

const readGeneratedRegistry = async (fileName) => {
  const source = await readFile(path.join(ROOT, 'src/data', 'schoolRegistry', fileName), 'utf8');
  const start = source.indexOf('= [');
  const end = source.lastIndexOf(' as unknown as readonly LocalSchoolRecord[];');
  if (start < 0 || end < 0) throw new Error(`${fileName} is not a generated registry module.`);
  return JSON.parse(source.slice(start + 2, end));
};

const loadTypeScriptDataModule = async (filePath, { stripImports = false } = {}) => {
  let source = await readFile(filePath, 'utf8');
  if (stripImports) {
    source = source.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"]lucide-react['"];\s*/, '');
  }
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filePath,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
};

const collectHtmlFiles = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(entryPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(entryPath);
  }
  return files;
};

const routeForHtmlFile = (filePath) => {
  const relative = path.relative(DIST, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
};

const [
  schools,
  { EXPERIMENTS },
  { CURRICULUM_REGISTRY },
  {
    hasCourseSubjectContent,
    isCourseOutcomeIndexable,
    isCourseSubjectIndexable,
  },
  sitemap,
  appSource,
  robots,
  sourcePapers,
  redirectRules,
  vercelConfig,
] = await Promise.all([
  Promise.all([
    'primarySchools.ts',
    'highSchools.ts',
    'colleges.ts',
    'universities.ts',
    'impairedSchools.ts',
  ].map(readGeneratedRegistry)).then((groups) => groups.flat()),
  loadTypeScriptDataModule(path.join(ROOT, 'src/data', 'experimentRegistry.ts')),
  loadTypeScriptDataModule(path.join(ROOT, 'src/data/constants.ts'), { stripImports: true }),
  loadTypeScriptDataModule(path.join(ROOT, 'src/features/courses/courseContentAvailability.ts')),
  readFile(path.join(DIST, 'sitemap.xml'), 'utf8'),
  readFile(path.join(ROOT, 'src/app/App.tsx'), 'utf8'),
  readFile(path.join(DIST, 'robots.txt'), 'utf8'),
  readFile(path.join(ROOT, 'src/data', 'pastPapers.json'), 'utf8').then(JSON.parse),
  readFile(path.join(ROOT, 'public', '_redirects'), 'utf8'),
  readFile(path.join(ROOT, 'vercel.json'), 'utf8').then(JSON.parse),
]);

if (!redirectRules.includes('https://examsidemann.com/* https://www.examsidemann.com/:splat 301!')) {
  throw new Error('Netlify redirects must consolidate the apex domain into the canonical www host.');
}
if (vercelConfig.trailingSlash !== true) {
  throw new Error('Vercel must consolidate slashless HTML routes with trailingSlash: true.');
}
const vercelApexRedirect = vercelConfig.redirects?.some((redirect) =>
  redirect.destination === 'https://www.examsidemann.com/:path*' &&
  redirect.permanent === true &&
  redirect.has?.some((condition) =>
    condition.type === 'host' && condition.value === 'examsidemann.com'
  )
);
if (!vercelApexRedirect) {
  throw new Error('Vercel redirects must consolidate the apex domain into the canonical www host.');
}

const publishedPapers = sourcePapers.filter((record) =>
  isValidDriveFileId(record.fileId) && isPublishedExamSeries(record)
);
const pastPaperCoursePaths = new Set();
const pastPaperSubjectCounts = new Map();
for (const paper of publishedPapers) {
  const coursePath = `/past-papers/${slugify(normalizePastPaperCourse(paper))}/`;
  const subjectPath = `${coursePath}${slugify(paper.subject)}/`;
  pastPaperCoursePaths.add(coursePath);
  pastPaperSubjectCounts.set(subjectPath, (pastPaperSubjectCounts.get(subjectPath) || 0) + 1);
}
const singletonPastPaperSubjectPaths = new Set(
  [...pastPaperSubjectCounts].filter(([, count]) => count === 1).map(([routePath]) => routePath),
);

const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
const sitemapLastmods = sitemapEntries
  .map((entry) => entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1])
  .filter(Boolean);
if (sitemapLastmods.length > 0 && sitemapLastmods.length !== sitemapEntries.length) {
  throw new Error('Sitemap lastmod values must be present consistently or omitted consistently.');
}
for (const lastmod of sitemapLastmods) {
  const parsed = new Date(lastmod);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`Invalid sitemap lastmod value: ${lastmod}`);
  if (parsed.valueOf() > Date.now() + 24 * 60 * 60 * 1000) {
    throw new Error(`Sitemap lastmod value is in the future: ${lastmod}`);
  }
}
const redirectPaths = new Set([
  '/payment/',
  '/courses/polytechnic/nd-it/practicals/',
  '/courses/polytechnic/nc-it/practicals/',
  '/tutorials/webdev/',
]);
if (sitemapUrlSet.size !== sitemapUrls.length) throw new Error('The sitemap contains duplicate URLs.');
for (const url of sitemapUrls) {
  if (!url.startsWith(`${SITE_URL}/`)) throw new Error(`Unexpected sitemap origin: ${url}`);
  const routePath = url.slice(SITE_URL.length);
  if (routePath !== '/' && !routePath.endsWith('/')) {
    throw new Error(`Sitemap URL is not in canonical trailing-slash form: ${url}`);
  }
  const parts = routePath.split('/').filter(Boolean);
  if (
    (parts[0] === 'news' && parts[1] === 'article') ||
    (parts[0] === 'past-papers' && parts.length >= 4) ||
    singletonPastPaperSubjectPaths.has(routePath) ||
    (parts[0] === 'tutorials' && parts.length > 1) ||
    routePath === '/premium/' ||
    routePath === '/payment/' ||
    redirectPaths.has(routePath)
  ) {
    throw new Error(`${url} is an excluded route and must not be in the sitemap.`);
  }
}

const htmlFiles = await collectHtmlFiles(DIST);
const htmlByRoute = new Map(await Promise.all(htmlFiles.map(async (filePath) => [
  routeForHtmlFile(filePath),
  await readFile(filePath, 'utf8'),
])));
const generatedRoutePaths = new Set(
  [...htmlByRoute.keys()].filter((routePath) => routePath !== '/404'),
);
for (const routePath of generatedRoutePaths) {
  const isFileRoute = /\/[^/]+\.[a-z0-9]+$/i.test(routePath);
  if (routePath !== '/' && !routePath.endsWith('/') && !isFileRoute) {
    throw new Error(`Generated directory route is not in trailing-slash form: ${routePath}`);
  }
}
for (const redirectPath of redirectPaths) {
  if (generatedRoutePaths.has(redirectPath)) {
    throw new Error(`Redirect route also has generated page content: ${redirectPath}`);
  }
}

// Thin search-vocabulary sections, templated FAQs, hidden prerender copy and
// keyword metadata must not quietly return in any generated HTML file.
for (const [routePath, html] of htmlByRoute) {
  if (/<meta\s+name=["']keywords["']/i.test(html)) {
    throw new Error(`${routePath} emits a meta keywords tag.`);
  }
  if (/People also search for|id=["']related-searches["']|id=["']also-known-as["']/i.test(html)) {
    throw new Error(`${routePath} emits a generated keyword-vocabulary block.`);
  }
  if (/"@type"\s*:\s*"FAQPage"|aria-labelledby=["']faq["']/i.test(html)) {
    throw new Error(`${routePath} emits templated FAQ content or schema.`);
  }
  if (/"keywords"\s*:/i.test(html)) {
    throw new Error(`${routePath} emits a structured-data keywords property.`);
  }
  if (/#root\s*>\s*\.seo-static-content\s*\{[^}]*(?:clip\s*:|width\s*:\s*1px|height\s*:\s*1px|display\s*:\s*none|visibility\s*:\s*hidden)/is.test(html)) {
    throw new Error(`${routePath} visually hides its prerendered SEO copy.`);
  }
  if (/href=["'](?:https:\/\/examsidemann\.com)?\/tutorials\/[^"']*\?v=/i.test(html)) {
    throw new Error(`${routePath} emits a duplicate internal tutorial ?v= URL.`);
  }
  if (/href=["']https:\/\/(?:www\.)?examsidemann\.netlify\.app\//i.test(html)) {
    throw new Error(`${routePath} links to the retired Netlify host.`);
  }
}

const readRoute = (routePath) => {
  const html = htmlByRoute.get(routePath);
  if (!html) throw new Error(`${routePath} has no generated HTML file.`);
  return html;
};

const canonicalFor = (routePath) => `${SITE_URL}${routePath}`;

const assertIndexable = (routePath) => {
  const canonical = canonicalFor(routePath);
  if (!sitemapUrlSet.has(canonical)) throw new Error(`${canonical} is missing from the sitemap.`);
  const html = readRoute(routePath);
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
    throw new Error(`${routePath} has no matching canonical link.`);
  }
  if (!html.includes('<meta name="robots" content="index, follow')) {
    throw new Error(`${routePath} is not marked index, follow.`);
  }
  if (!html.includes('<script type="application/ld+json">')) {
    throw new Error(`${routePath} has no structured data.`);
  }
};

const assertNoindex = (routePath, { mustExist = true } = {}) => {
  const canonical = canonicalFor(routePath);
  if (sitemapUrlSet.has(canonical)) throw new Error(`${canonical} must not be in the sitemap.`);
  const html = htmlByRoute.get(routePath);
  if (!html) {
    if (mustExist) throw new Error(`${routePath} has no generated noindex HTML file.`);
    return;
  }
  if (!/<meta name="robots" content="noindex,\s*(?:follow|nofollow)/.test(html)) {
    throw new Error(`${routePath} is not marked noindex.`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
    throw new Error(`${routePath} has no matching canonical link.`);
  }
};

const assertUsefulPastPaperHub = (routePath) => {
  const html = readRoute(routePath);
  const description = html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1];
  if (!description || !html.includes(`<p>${description}</p>`)) {
    throw new Error(`${routePath} does not visibly render its calculated SEO description.`);
  }
  if (!/<h1>[^<]+<\/h1>/.test(html)) {
    throw new Error(`${routePath} does not visibly render its calculated SEO heading.`);
  }
  if (!html.includes('id="past-paper-study-method"')) {
    throw new Error(`${routePath} has no visible past-paper study method.`);
  }
};

const routedExperimentPaths = new Set(
  [...appSource.matchAll(/path="(\/practicals\/olevel\/(?:physics|chemistry|biology|combined-science)\/[^"]+)"/g)]
    .map((match) => match[1])
);
const manifestExperimentPaths = new Set(EXPERIMENTS.map((experiment) => experiment.path));
const missingFromManifest = [...routedExperimentPaths].filter(
  (routePath) => !manifestExperimentPaths.has(routePath)
);
const missingFromApp = [...manifestExperimentPaths].filter(
  (routePath) => !routedExperimentPaths.has(routePath)
);
if (missingFromManifest.length || missingFromApp.length) {
  throw new Error(
    `Experiment route mismatch. Missing from manifest: ${missingFromManifest.join(', ') || 'none'}. Missing from App: ${missingFromApp.join(', ') || 'none'}.`
  );
}

for (const routePath of ['/', '/courses/', '/tutorials/']) {
  assertIndexable(routePath);
}
for (const experiment of EXPERIMENTS) assertIndexable(`${experiment.path}/`);

if (publishedPapers.length > 0) {
  assertIndexable('/past-papers/');
  assertUsefulPastPaperHub('/past-papers/');
} else {
  assertNoindex('/past-papers/');
}
for (const routePath of pastPaperCoursePaths) {
  assertIndexable(routePath);
  assertUsefulPastPaperHub(routePath);
}
for (const [routePath, paperCount] of pastPaperSubjectCounts) {
  if (paperCount > 1) assertIndexable(routePath);
  else assertNoindex(routePath);
  assertUsefulPastPaperHub(routePath);
}

const canonicalSchoolRecords = new Map();
const schoolKey = (school) => [school.name, school.type, school.province, school.district, school.address || school.location]
  .map((value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')).join('|');
const schoolScore = (school) => [school.description, school.phone, school.email, school.website, school.image, school.coordinates, school.curriculums?.length, school.fees]
  .filter(Boolean).length + (school.verified ? 100 : 0);
schools.forEach((school) => {
  const key = schoolKey(school);
  const current = canonicalSchoolRecords.get(key);
  if (!current || schoolScore(school) > schoolScore(current)) canonicalSchoolRecords.set(key, school);
});

for (const school of canonicalSchoolRecords.values()) {
  const profilePath = `/${slugify(school.name)}/`;
  assertIndexable(profilePath);
}

const expectedCourseRoutes = [];
const excludedCourseRoutes = [];
for (const course of CURRICULUM_REGISTRY) {
  const availableSubjects = course.subjects.filter((subject) =>
    hasCourseSubjectContent(course.name, subject.name, course.category)
  );
  if (!availableSubjects.length) continue;

  const coursePath = `/courses/${course.id}/`;
  const courseIsIndexable = availableSubjects.some((subject) =>
    isCourseSubjectIndexable(course.name, subject.name, course.category)
  );
  (courseIsIndexable ? expectedCourseRoutes : excludedCourseRoutes).push(coursePath);

  for (const subject of availableSubjects) {
    const subjectPath = `${coursePath}${slugify(subject.name)}/`;
    const subjectIsIndexable = isCourseSubjectIndexable(
      course.name,
      subject.name,
      course.category,
    );
    (subjectIsIndexable ? expectedCourseRoutes : excludedCourseRoutes).push(subjectPath);

    for (let outcomeNumber = 1; outcomeNumber <= subject.outcomeCount; outcomeNumber += 1) {
      const legacyPath = `${subjectPath}outcomes/${outcomeNumber}/`;
      const legacyHtml = await readFile(path.join(DIST, legacyPath, 'index.html'), 'utf8');
      const outcomePath = legacyHtml.match(/rel="canonical" href="https:\/\/www\.examsidemann\.com([^"]+)"/)?.[1];
      if (!outcomePath || !outcomePath.startsWith(`${subjectPath}outcomes/${outcomeNumber}-`)) throw new Error(`Missing descriptive URL for ${legacyPath}`);
      const outcomeIsIndexable = isCourseOutcomeIndexable(
        course.name,
        subject.name,
        outcomeNumber,
        course.category,
      );
      (outcomeIsIndexable ? expectedCourseRoutes : excludedCourseRoutes).push(outcomePath);
    }
  }
}
expectedCourseRoutes.forEach(assertIndexable);
excludedCourseRoutes.forEach((routePath) => assertNoindex(routePath));

const explicitThinOutcomeRoutes = [
  '/courses/records-nc/records-preservation/outcomes/5/',
  '/courses/records-nc/records-preservation/outcomes/6/',
  '/courses/records-nc/reprography/outcomes/5/',
  '/courses/records-nc/reprography/outcomes/6/',
];
explicitThinOutcomeRoutes.forEach((routePath) => assertNoindex(routePath));

const placeholderPaths = [
  '/premium/',
  '/payment/',
  '/practicals/polytechnic/under-construction/',
  '/practicals/olevel/computer-science/',
  '/practicals/olevel/food-technology/',
  '/practicals/alevel/computer-science/',
];
placeholderPaths.forEach((routePath) => assertNoindex(routePath, { mustExist: false }));

// Valid, already-published records may populate the archive. Individual
// document routes remain noindex because a file-view page alone is not
// substantial original content. Singleton subject collections are available
// to users but remain noindex until a second paper makes the collection useful
// as a search result.
for (const [routePath] of htmlByRoute) {
  const parts = routePath.split('/').filter(Boolean);
  if (parts[0] === 'past-papers') {
    if (publishedPapers.length === 0 && parts.length > 1) {
      throw new Error(`${routePath} was generated without any published past-paper record.`);
    }
    if (parts.length >= 4 || singletonPastPaperSubjectPaths.has(routePath)) {
      assertNoindex(routePath);
    }
  }
  if (parts[0] === 'tutorials' && parts.length > 1) assertNoindex(routePath);
}

if (
  publishedPapers.length === 0 &&
  [...sitemapUrlSet].some((url) => url.startsWith(`${SITE_URL}/past-papers/`))
) {
  throw new Error('The sitemap publishes past-paper URLs without any published records.');
}

const generatedHtml = [...htmlByRoute.values()].join('\n');
for (const paper of publishedPapers) {
  if (!generatedHtml.includes(String(paper.fileId))) {
    throw new Error(`Published past-paper document ${paper.fileId} is missing from generated HTML.`);
  }
}

for (const paper of sourcePapers.filter((record) => !isPublishedExamSeries(record))) {
  for (const [routePath, html] of htmlByRoute) {
    if (html.includes(String(paper.year))) {
      throw new Error(`${routePath} publishes future exam series ${paper.year}.`);
    }
  }
}

assertNoindex('/404');
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
  throw new Error('robots.txt does not advertise the sitemap.');
}

// Every sitemap URL needs a unique, non-empty title and an indexable generated
// document. This also catches a URL accidentally added without prerendering.
const titles = new Map();
for (const url of sitemapUrlSet) {
  const routePath = url.slice(SITE_URL.length);
  const html = readRoute(routePath);
  const canonicalLinks = [...html.matchAll(/<link rel="canonical" href="([^"]+)" \/>/g)]
    .map((match) => match[1]);
  if (canonicalLinks.length !== 1 || canonicalLinks[0] !== url) {
    throw new Error(`${routePath} must emit exactly one self-referencing canonical link.`);
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  if (!title) throw new Error(`${routePath} has no title.`);
  if (titles.has(title)) {
    throw new Error(`Duplicate title "${title}" on ${routePath} and ${titles.get(title)}.`);
  }
  titles.set(title, routePath);
  if (!html.includes('<meta name="robots" content="index, follow')) {
    throw new Error(`${routePath} is in the sitemap but is not indexable.`);
  }
  const heading = html.match(/<h1>(.*?)<\/h1>/s)?.[1] ?? '';
  if (/coming soon|under construction|will be added (?:here|soon)|not yet available|indexing in progress/i.test(`${title} ${heading}`)) {
    throw new Error(`${routePath} is in the sitemap but contains placeholder copy.`);
  }

  for (const [, href] of html.matchAll(/href=["']([^"'#]+)["']/g)) {
    if (!href.startsWith('/')) continue;
    const internalPath = href.split(/[?#]/, 1)[0];
    if (internalPath !== '/' && !internalPath.endsWith('/') && !/\.[a-z0-9]+$/i.test(internalPath)) {
      throw new Error(`${routePath} links to slashless internal HTML route ${href}.`);
    }
  }
}

console.log('SEO validation passed:', {
  generatedHtmlFiles: htmlFiles.length,
  sitemapUrls: sitemapUrls.length,
  generatedSchoolProfiles: canonicalSchoolRecords.size,
  noindexCourseRoutes: excludedCourseRoutes.length,
  noindexSingletonPaperHubs: singletonPastPaperSubjectPaths.size,
  experiments: EXPERIMENTS.length,
  uniqueTitles: titles.size,
});
