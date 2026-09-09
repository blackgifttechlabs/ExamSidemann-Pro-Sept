import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import ts from 'typescript';

const SITE_URL = 'https://www.examsidemann.com';
const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, follow, noarchive';
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const execFileAsync = promisify(execFile);
const sourceLastModified = await (async () => {
  if (process.env.SOURCE_DATE_EPOCH) {
    const date = new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000);
    if (!Number.isNaN(date.valueOf())) return date.toISOString().slice(0, 10);
  }
  try {
    const { stdout } = await execFileAsync('git', [
      'log', '-1', '--format=%cI', '--',
      'src', 'index.html', 'scripts/generateSeo.mjs',
    ], { cwd: ROOT });
    const date = new Date(stdout.trim());
    return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10);
  } catch {
    // A source archive may not include Git history. Omitting lastmod is more
    // accurate than publishing the deployment time as a content update.
    return undefined;
  }
})();
const sourcePapers = JSON.parse(await readFile(path.join(ROOT, 'src/data', 'pastPapers.json'), 'utf8'));
const importedResources = JSON.parse(await readFile(path.join(ROOT, 'src/data', 'importedResources.json'), 'utf8'));
sourcePapers.push(...importedResources.filter((item) => item.type === 'past-papers').map((item) => ({
  level: item.category,
  sublevel: item.course,
  course: item.course,
  subject: item.subject,
  year: item.year,
  type: item.paperType,
  fileId: item.fileId,
  board: item.board,
  url: item.url,
})));
const staticPages = JSON.parse(await readFile(path.join(ROOT, 'src/data', 'seoPages.json'), 'utf8'));
const rawBaseHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
const baseHtml = rawBaseHtml
  .replace(/\s*<!-- generated-route-seo -->[\s\S]*?(?=<\/head>)/, '')
  // Prerendered route copy must be visible without JavaScript. The source
  // shell visually clips this temporary node during normal SPA startup; static
  // routes remove that rule instead of asking crawlers to trust hidden copy.
  .replace(/\s*#root > \.seo-static-content\s*\{[^}]*\}/, '')
  .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');

const readGeneratedRegistry = async (fileName) => {
  const source = await readFile(path.join(ROOT, 'src/data', 'schoolRegistry', fileName), 'utf8');
  const start = source.indexOf('= [');
  const end = source.lastIndexOf(' as unknown as readonly LocalSchoolRecord[];');
  if (start < 0 || end < 0) {
    throw new Error(`${fileName} is not a generated school registry module.`);
  }
  return JSON.parse(source.slice(start + 2, end));
};

const rawSchoolRecords = (await Promise.all([
  'primarySchools.ts',
  'highSchools.ts',
  'colleges.ts',
  'universities.ts',
  'impairedSchools.ts',
].map(readGeneratedRegistry))).flat();

const schoolRecordKey = (school) => [
  school.name,
  school.type,
  school.province,
  school.district,
  school.address || school.location,
].map((value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ')).join('|');
const schoolRecordScore = (school) => [
  school.description,
  school.phone,
  school.email,
  school.website,
  school.image,
  school.coordinates,
  school.curriculums?.length,
  school.fees,
].filter(Boolean).length + (school.verified ? 100 : 0);
const schoolRecordByKey = new Map();
rawSchoolRecords.forEach((school) => {
  const key = schoolRecordKey(school);
  const current = schoolRecordByKey.get(key);
  if (!current || schoolRecordScore(school) > schoolRecordScore(current)) schoolRecordByKey.set(key, school);
});
const schoolRecords = [...schoolRecordByKey.values()];

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

const [
  { CURRICULUM_REGISTRY },
  {
    hasCourseSubjectContent,
    isCourseOutcomeIndexable,
    isCourseSubjectIndexable,
  },
  { EXPERIMENTS },
  seoHelpers,
  { institutionLogoForName },
] =
  await Promise.all([
    loadTypeScriptDataModule(path.join(ROOT, 'src/data/constants.ts'), { stripImports: true }),
    loadTypeScriptDataModule(path.join(ROOT, 'src/features/courses/courseContentAvailability.ts')),
    loadTypeScriptDataModule(path.join(ROOT, 'src/data', 'experimentRegistry.ts')),
    loadTypeScriptDataModule(path.join(ROOT, 'src/data', 'seoKeywords.ts')),
    loadTypeScriptDataModule(path.join(ROOT, 'src/data', 'polytechnicLogos.ts')),
  ]);

const {
  boardForCategory,
  courseSeoFor,
  experimentSeoFor,
  outcomeSeoFor,
  paperArchiveSeoFor,
  paperCourseSeoFor,
  paperHubGuidanceFor,
  paperSeoFor,
  paperSubjectSeoFor,
  subjectAliasesFor,
  subjectSeoFor,
} = seoHelpers;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const slugify = (value) => value
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/\./g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const publishedText = (value) => (
  typeof value === 'string' &&
  value.trim() &&
  !/^(n\/a|none|not (available|found|published)|unknown)$/i.test(value.trim())
    ? value.trim()
    : ''
);

const schoolTypeLabel = (type) => ({
  primary: 'Primary Schools',
  high: 'High Schools',
  poly: 'Colleges and Polytechnics',
  college: 'Colleges and Polytechnics',
  university: 'Universities',
  blind: 'Blind and Visually Impaired Institutions',
  deaf: 'Deaf and Hearing Impaired Institutions',
  autism: 'Intellectual Disability and Autism Institutions',
  physical: 'Physical Disability Institutions',
  impaired: 'Specialist Education Institutions',
}[type] || 'Education Institutions');

const schoolSchemaType = (type) => {
  if (type === 'primary' || type === 'high') return 'School';
  if (type === 'poly' || type === 'college' || type === 'university') return 'CollegeOrUniversity';
  return 'EducationalOrganization';
};

const experimentSubjectPath = (experiment) =>
  `/practicals/olevel/${slugify(experiment.subject)}/`;

const sourceOutcomeTitles = new Map(Object.entries(JSON.parse(
  await readFile(path.join(ROOT, 'src/data', 'learningOutcomeTitles.json'), 'utf8'),
)));

const SOURCE_SUBJECT_ALIASES = {
  'nc-it|computer-systems-maintenance': 'nc-it|csm',
  'nc-auto|safety-health-env-and-fitting-machining': 'nc-auto|safety-health-env',
  'nc-auto|electrical-and-electronics-fundamentals': 'nc-auto|electrical-electronics-fundamentals',
  'nc-auto|automotive-comm-and-computer-apps': 'nc-auto|automotive-comm-computer-apps',
  'nc-auto|wiring-lighting-and-auxiliary-systems': 'nc-auto|wiring-lighting-auxiliary-systems',
  'nc-auto|automotive-eng-maths-and-science': 'nc-auto|automotive-eng-maths-science',
  'nc-auto|ignition-starting-and-charging-syst': 'nc-auto|ignition-starting-charging-syst',
  'records-nc|digital-and-conv-mail-management': 'records-nc|digital-conv-mail-management',
};

const SHARED_SUBJECT_SOURCES = {
  'nc-auto|national-studies': 'nc-it|national-studies',
  'nc-auto|entrepreneurship-skills-development': 'nc-it|entrepreneurship-skills-development',
  'banking-nc|national-studies': 'nc-it|national-studies',
};

const getSourceOutcomeTitle = (course, subject, outcomeNumber) => {
  const routeKey = `${course.id}|${slugify(subject.name)}`;
  const sourceKey =
    SOURCE_SUBJECT_ALIASES[routeKey] ||
    SHARED_SUBJECT_SOURCES[routeKey] ||
    routeKey;
  return sourceOutcomeTitles.get(`${sourceKey}|${outcomeNumber}`);
};

const getOutcomeLabel = (course, subject, outcomeNumber) => {
  if (subject.outcomes?.[outcomeNumber - 1]) {
    return subject.outcomes[outcomeNumber - 1];
  }

  if (subject.name === 'English Language') {
    return [
      'Grammar & Structure',
      'Vocabulary Mastery',
      'Reading & Literature',
      'Basic Composition',
      'Advanced Composition',
      'Comprehension & Summary',
      'Oral Communication',
      'Functional Writing',
      'Exam & Study Skills',
      'Language in Use',
    ][outcomeNumber - 1] || `Learning Outcome ${outcomeNumber}`;
  }

  if (subject.name === 'Shona') {
    return [
      'Rondedzero neTsamba',
      'Tsumo',
      'Madimikira',
      'Zvirevo',
      'Kufananidza neKushasa',
      'Zvidavado',
      'Madimikira eRuremekedzo',
      'Madimikira eKuwedzeredza',
      'Mipanda yeMazita',
      'Zvisazitasingwi',
    ][outcomeNumber - 1] || `Learning Outcome ${outcomeNumber}`;
  }

  if (subject.name === 'Database Administration' && outcomeNumber === 6) {
    return 'Practice SQL';
  }
  if (subject.name === 'Object Oriented Programming' && outcomeNumber === 8) {
    return 'Practical C#';
  }
  if (subject.name === 'Workplace Communication' && outcomeNumber === 3) {
    return 'English Grammar';
  }

  return (
    getSourceOutcomeTitle(course, subject, outcomeNumber) ||
    `Learning Outcome ${outcomeNumber}`
  );
};

const isGenericOutcomeLabel = (label, outcomeNumber) =>
  label === `Learning Outcome ${outcomeNumber}`;

const formatOutcomeName = (outcome) =>
  isGenericOutcomeLabel(outcome.label, outcome.number)
    ? outcome.label
    : `Learning Outcome ${outcome.number}: ${outcome.label}`;

const learningCourses = CURRICULUM_REGISTRY
  .map((course) => {
    const subjects = course.subjects
      .filter((subject) => hasCourseSubjectContent(course.name, subject.name, course.category))
      .map((subject) => {
        const subjectPath = `/courses/${course.id}/${slugify(subject.name)}/`;
        return {
          ...subject,
          path: subjectPath,
          indexable: isCourseSubjectIndexable(
            course.name,
            subject.name,
            course.category,
          ),
          outcomes: Array.from({ length: subject.outcomeCount }, (_, index) => {
            const outcomeNumber = index + 1;
            return {
              number: outcomeNumber,
              label: getOutcomeLabel(course, subject, outcomeNumber),
              path: `${subjectPath}outcomes/${outcomeNumber}-${slugify(getOutcomeLabel(course, subject, outcomeNumber).replace(/^Learning Outcome \d+$/, `${subject.name} Study Notes`))}/`,
              indexable: isCourseOutcomeIndexable(
                course.name,
                subject.name,
                outcomeNumber,
                course.category,
              ),
            };
          }),
        };
      });

    return {
      ...course,
      path: `/courses/${course.id}/`,
      subjects,
      indexable: subjects.some((subject) => subject.indexable),
    };
  })
  .filter((course) => course.subjects.length > 0);

const learningSubjects = learningCourses.flatMap((course) =>
  course.subjects.map((subject) => ({ course, subject })),
);
const learningOutcomes = learningSubjects.flatMap(({ course, subject }) =>
  subject.outcomes.map((outcome) => ({ course, subject, outcome })),
);

const normalizeCourse = (record) => {
  if (record.course) return record.course;
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

const papers = sourcePapers
  .filter((record) =>
    isValidDriveFileId(record.fileId) &&
    isPublishedExamSeries(record)
  )
  .map((record) => {
    const course = normalizeCourse(record);
    const coursePath = `/past-papers/${slugify(course)}/`;
    const subjectPath = `${coursePath}${slugify(record.subject)}/`;
    return {
      ...record,
      course,
      board: record.board || (record.level === 'Polytechnic' ? 'HEXCO' : 'ZIMSEC'),
      url: record.url || `https://drive.google.com/file/d/${record.fileId}/view`,
      coursePath,
      subjectPath,
      path: `${subjectPath}${slugify(`${record.year}-${record.type}`)}/`,
    };
  });

const uniqueBy = (items, keyFor) => {
  const entries = new Map();
  items.forEach((item) => entries.set(keyFor(item), item));
  return [...entries.values()];
};

const polytechnicDrawingTopics = JSON.parse(
  await readFile(path.join(ROOT, 'src/data', 'practicalTopicSeo.json'), 'utf8'),
);

const courses = uniqueBy(papers, (paper) => paper.course);
const subjects = uniqueBy(papers, (paper) => `${paper.course}|${paper.subject}`);
const generatedPaths = new Set();
const sitemapPaths = new Set();
const REDIRECT_PATHS = new Set([
  '/payment/',
  '/courses/polytechnic/nd-it/practicals/',
  '/courses/polytechnic/nc-it/practicals/',
  '/tutorials/webdev/',
]);

// Do not let routes removed from a registry survive an incremental SEO run.
// These are exact generated-only directories; current records recreate only
// the routes that remain eligible below.
await Promise.all([
  rm(path.join(DIST, 'past-papers'), { recursive: true, force: true }),
  rm(path.join(DIST, 'schools', 'profile'), { recursive: true, force: true }),
  rm(path.join(DIST, 'tutorials'), { recursive: true, force: true }),
]);

/** Only genuine navigational links belong in the prerendered related section. */
const vocabularyHtml = ({ related = [] }) => (related.length
  ? `
      <section aria-labelledby="related-pages">
        <h2 id="related-pages">Related study pages</h2>
        <ul>${related
          .map(({ label, path: href }) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
          .join('')}</ul>
      </section>`
  : '');

const paperGuidanceHtml = (guidance) => `
  <section id="past-paper-study-method" aria-labelledby="past-paper-study-method-heading">
    <h2 id="past-paper-study-method-heading">${escapeHtml(guidance.heading)}</h2>
    <p>${escapeHtml(guidance.intro)}</p>
    <ol>${guidance.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
  </section>`;

const sanitizeStructuredData = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeStructuredData).filter((entry) => entry !== undefined);
  }
  if (!value || typeof value !== 'object') return value;
  if (value['@type'] === 'FAQPage') return undefined;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'keywords')
      .map(([key, entry]) => [key, sanitizeStructuredData(entry)]),
  );
};

const seoHtml = ({
  title,
  description,
  canonicalPath,
  structuredData,
  content,
  robots = INDEX_ROBOTS,
}) => {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const socialImage = `${SITE_URL}/exam-sidemann-social-preview.png`;
  const safeStructuredData = robots.startsWith('noindex')
    ? undefined
    : sanitizeStructuredData(structuredData);
  const allStructuredData = (Array.isArray(safeStructuredData)
    ? safeStructuredData
    : [safeStructuredData]).filter(Boolean);
  const metadata = `
    <!-- generated-route-seo -->
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en-ZW" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Exam Sidemann" />
    <meta property="og:locale" content="en_ZW" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:secure_url" content="${socialImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Exam Sidemann digital learning platform" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="Exam Sidemann digital learning platform" />
    ${allStructuredData.length
      ? `<script type="application/ld+json">${JSON.stringify(
          allStructuredData.length === 1 ? allStructuredData[0] : allStructuredData,
        ).replace(/</g, '\\u003c')}</script>`
      : ''}`;

  return baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta name="keywords"[^>]*>/, '')
    .replace(/\s*<meta name="robots"[^>]*>/, '')
    .replace(/\s*<meta name="googlebot"[^>]*>/, '')
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace(/\s*<link rel="alternate"[^>]*>/g, '')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/g, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace(/\s*<script id="website-structured-data" type="application\/ld\+json">.*?<\/script>/s, '')
    .replace('</head>', `${metadata}\n</head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root"><div class="seo-static-content">${content}</div></div>`,
    );
};

const writeRoute = async (routePath, html, { includeInSitemap = true } = {}) => {
  const canonicalRoutePath = routePath === '/'
    ? '/'
    : `/${routePath.split('/').filter(Boolean).join('/')}/`;
  if (routePath !== canonicalRoutePath) {
    throw new Error(`Generated route is not in canonical trailing-slash form: ${routePath}`);
  }
  if (includeInSitemap && REDIRECT_PATHS.has(routePath)) {
    throw new Error(`Redirect route cannot be included in the sitemap: ${routePath}`);
  }
  if (includeInSitemap && /<meta name="robots" content="noindex,/i.test(html)) {
    throw new Error(`Noindex route cannot be included in the sitemap: ${routePath}`);
  }
  const directory = path.join(DIST, routePath.replace(/^\//, ''));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
  generatedPaths.add(routePath);
  if (includeInSitemap) sitemapPaths.add(routePath);
};

const shell = (body) => `
  <main style="max-width:1120px;margin:0 auto;padding:48px 20px;font-family:Arial,sans-serif;color:#172033">
    ${body}
  </main>`;

const importantLinks = [
  ['/courses/', 'Courses'],
  ['/past-papers/', 'Past Papers'],
  ['/syllabi/', 'Syllabi'],
  ['/library/', 'Digital Library'],
  ['/tutorials/', 'Video Tutorials'],
  ['/practicals/', 'Practical Labs'],
  ['/iq-trainer/', 'IQ Trainer'],
  ['/about/', 'About Us'],
  ['/contact/', 'Contact Us'],
];

const importantLinksHtml = () => importantLinks
  .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
  .join('');

/** Courses grouped under the board that examines them. */
const coursesByBoard = (courseList) => {
  const groups = new Map();
  courseList.forEach((course) => {
    const board = boardForCategory(course.category);
    if (!groups.has(board.name)) groups.set(board.name, { board, courses: [] });
    groups.get(board.name).courses.push(course);
  });
  return [...groups.values()];
};

const staticStructuredData = (page, canonicalPath) => {
  const canonical = `${SITE_URL}${canonicalPath}`;
  if (canonicalPath === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: 'Exam Sidemann',
          alternateName: ['ExamSidemann', 'examsidemann.com'],
          description: page.description,
          inLanguage: 'en-ZW',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'EducationalOrganization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Exam Sidemann',
          url: `${SITE_URL}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/app-icon-512.png`,
            width: 512,
            height: 512,
          },
          image: `${SITE_URL}/exam-sidemann-social-preview.png`,
          areaServed: { '@type': 'Country', name: 'Zimbabwe' },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Masvingo',
            addressCountry: 'ZW',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+263-78-245-6936',
            contactType: 'customer support',
            areaServed: 'ZW',
            availableLanguage: 'English',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: page.heading,
          description: page.description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#organization` },
          inLanguage: 'en-ZW',
        },
      ],
    };
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': page.schemaType,
      name: page.heading,
      description: page.description,
      url: canonical,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      inLanguage: 'en-ZW',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.heading, item: canonical },
      ],
    },
  ];
};

for (const page of staticPages) {
  if (page.path === '/past-papers' || page.path === '/premium') continue;
  const canonicalPath = page.path === '/' ? '/' : `${page.path}/`;
  const courseDirectory = page.path === '/courses' || page.path === '/'
    ? `
      <section aria-labelledby="learning-programmes">
        <h2 id="learning-programmes">Learning programmes by examination board</h2>
        ${coursesByBoard(learningCourses).map(({ board, courses: boardCourses }) => `
          <h3>${escapeHtml(board.name)} — ${escapeHtml(board.fullName)}</h3>
          <ul>
            ${boardCourses.map((course) =>
              `<li><a href="${course.path}">${escapeHtml(board.name)} ${escapeHtml(course.name)}</a> — ${course.subjects.length} subjects</li>`
            ).join('')}
          </ul>
        `).join('')}
      </section>
    `
    : '';
  const schoolCategoryDirectory = page.path === '/schools'
    ? `
      <section aria-labelledby="school-types">
        <h2 id="school-types">Browse schools and institutions</h2>
        <ul>
          ${[...new Set(schoolRecords.map((school) => school.type))].sort().map((type) =>
            `<li><a href="/schools/search/${encodeURIComponent(type)}/">${escapeHtml(schoolTypeLabel(type))}</a></li>`
          ).join('')}
        </ul>
      </section>
    `
    : '';
  const pageExperiments = (() => {
    if (page.path === '/practicals') return [...EXPERIMENTS, ...polytechnicDrawingTopics];
    if (page.path === '/practicals/olevel') return EXPERIMENTS;
    if (page.path === '/practicals/polytechnic') return polytechnicDrawingTopics;
    if (page.path.startsWith('/practicals/polytechnic/')) {
      return polytechnicDrawingTopics.filter((topic) => topic.subjectPath === page.path);
    }
    return EXPERIMENTS.filter(
      (experiment) => experimentSubjectPath(experiment).replace(/\/$/, '') === page.path
    );
  })();
  const experimentDirectory = pageExperiments.length
    ? `
      <section aria-labelledby="interactive-experiments">
        <h2 id="interactive-experiments">Interactive experiments</h2>
        <ul>
          ${pageExperiments.map((experiment) =>
            `<li><a href="${experiment.path}/">${escapeHtml(experiment.title)}</a> — ${escapeHtml(experiment.subject)}</li>`
          ).join('')}
        </ul>
      </section>
    `
    : '';
  const content = shell(`
    ${page.path === '/' ? '' : '<nav><a href="/">Exam Sidemann</a></nav>'}
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.description)}</p>
    ${courseDirectory}
    ${schoolCategoryDirectory}
    ${experimentDirectory}
    <nav aria-label="Important pages"><ul>${importantLinksHtml()}</ul></nav>
  `);
  const html = seoHtml({
    title: page.title,
    description: page.description,
    canonicalPath,
    structuredData: staticStructuredData(page, canonicalPath),
    content,
  });

  if (page.path === '/') {
    await writeFile(path.join(DIST, 'index.html'), html);
    generatedPaths.add('/');
    sitemapPaths.add('/');
  } else {
    await writeRoute(canonicalPath, html);
  }
}

const schoolTypes = [...new Set(schoolRecords.map((school) => school.type))].sort();

const schoolDirectoryItemHtml = (school, suffix = '') => {
  const name = escapeHtml(school.name);
  const logo = institutionLogoForName(school.name);
  const content = `<a href="/${slugify(school.name)}/">${logo ? `<img src="${escapeHtml(logo)}" alt="${escapeHtml(`${school.name} logo`)}" width="40" height="40" loading="lazy" />` : ''}${name}</a>`;
  return `<li>${content}${suffix}</li>`;
};

const writeSchoolLocationRoute = async ({ type, label, province, district, schools }) => {
  const provincePath = `/schools/search/${encodeURIComponent(type)}/${slugify(province)}/`;
  const routePath = district ? `${provincePath}${slugify(district)}/` : provincePath;
  const place = district || province;
  const districtLinks = district ? [] : [...new Set(
    schools.map((school) => publishedText(school.district)).filter(Boolean),
  )].filter((candidate) => (
    schools.filter((school) => publishedText(school.district) === candidate).length >= 2
  )).sort();
  const description = `Find and compare ${schools.length.toLocaleString()} ${label.toLowerCase()} in ${place}, Zimbabwe. Check locations, contact details, curricula, boarding or day options, fees where published, and individual school profiles.`;
  await writeRoute(routePath, seoHtml({
    title: `${label} in ${place} | Find and Compare Schools`,
    description,
    canonicalPath: routePath,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${label} in ${place}`,
        description,
        url: `${SITE_URL}${routePath}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: schools.length,
          itemListElement: schools.map((school, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: school.name,
            url: `${SITE_URL}/${slugify(school.name)}/`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}/schools/search/${encodeURIComponent(type)}/` },
          { '@type': 'ListItem', position: 3, name: province, item: `${SITE_URL}${provincePath}` },
          ...(district ? [{ '@type': 'ListItem', position: 4, name: district, item: `${SITE_URL}${routePath}` }] : []),
        ],
      },
    ],
    content: shell(`
      <nav><a href="/">Exam Sidemann</a> / <a href="/schools/search/${encodeURIComponent(type)}/">${escapeHtml(label)}</a>${district ? ` / <a href="${provincePath}">${escapeHtml(province)}</a>` : ''}</nav>
      <h1>${escapeHtml(label)} in ${escapeHtml(place)}</h1>
      <p>${escapeHtml(description)}</p>
      ${districtLinks.length ? `<nav aria-label="Browse by district"><h2>Browse ${escapeHtml(province)} by district</h2><ul>${districtLinks.map((candidate) => `<li><a href="${routePath}${slugify(candidate)}/">${escapeHtml(label)} in ${escapeHtml(candidate)}</a></li>`).join('')}</ul></nav>` : ''}
      <section aria-labelledby="school-results">
        <h2 id="school-results">${schools.length.toLocaleString()} institutions listed</h2>
        <p>Use these factual directory profiles to compare where each institution is located and which published contact or study information is available. Confirm admissions and fees directly with the school.</p>
        <ul>${schools.map((school) => schoolDirectoryItemHtml(
          school,
          !district && publishedText(school.district) ? ` — ${escapeHtml(school.district)}` : '',
        )).join('')}</ul>
      </section>
    `),
  }));
};

for (const type of schoolTypes) {
  const typeSchools = schoolRecords
    .filter((school) => school.type === type)
    .sort((first, second) => {
      const logoDifference = Number(!!institutionLogoForName(second.name)) - Number(!!institutionLogoForName(first.name));
      return logoDifference || String(first.name).localeCompare(String(second.name));
    });
  const label = schoolTypeLabel(type);
  const categoryPath = `/schools/search/${encodeURIComponent(type)}/`;
  const description = `Find and compare ${typeSchools.length.toLocaleString()} ${label.toLowerCase()} in Zimbabwe by province and district. Browse school information, locations, contacts, programmes and available logos.`;

  // Provinces are how learners narrow a directory this long ("high schools in
  // Masvingo"), so the listing is grouped rather than one flat 1,000-item list.
  const provinces = [...new Set(
    typeSchools.map((school) => publishedText(school.province)).filter(Boolean),
  )].sort();
  await writeRoute(categoryPath, seoHtml({
    title: `Find ${label} in Zimbabwe Near You | School Directory`,
    description,
    canonicalPath: categoryPath,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${label} in Zimbabwe`,
        description,
        url: `${SITE_URL}${categoryPath}`,
        numberOfItems: typeSchools.length,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: typeSchools.length,
          itemListElement: typeSchools.slice(0, 100).map((school, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: school.name,
            url: `${SITE_URL}/${slugify(school.name)}/`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}${categoryPath}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/">Exam Sidemann</a></nav>
      <h1>Find ${escapeHtml(label)} in Zimbabwe</h1>
      <p>${escapeHtml(description)}</p>
      <section aria-labelledby="choose-a-school">
        <h2 id="choose-a-school">Compare schools and find the best fit near you</h2>
        <p>Looking for the best schools in Zimbabwe? Compare locations, contact details, curricula, boarding or day options, fees where published, and school profiles. The directory does not sell rankings; it helps families choose an institution that fits their needs.</p>
      </section>
      <p><strong>${typeSchools.length.toLocaleString()} registered institutions</strong></p>
      ${provinces.map((province) => {
        const provinceSchools = typeSchools.filter(
          (school) => publishedText(school.province) === province,
        );
        return `
        <section aria-labelledby="province-${slugify(province)}">
          <h2 id="province-${slugify(province)}"><a href="${categoryPath}${slugify(province)}/">${escapeHtml(label)} in ${escapeHtml(province)}</a> (${provinceSchools.length})</h2>
          <ul>
            ${provinceSchools.map((school) => schoolDirectoryItemHtml(
              school,
              publishedText(school.district) ? ` — ${escapeHtml(school.district)}` : '',
            )).join('')}
          </ul>
        </section>`;
      }).join('')}
      ${(() => {
        const unplaced = typeSchools.filter((school) => !publishedText(school.province));
        return unplaced.length ? `
        <section aria-labelledby="province-unlisted">
          <h2 id="province-unlisted">Other ${escapeHtml(label.toLowerCase())} (${unplaced.length})</h2>
          <ul>
            ${unplaced.map((school) => schoolDirectoryItemHtml(school)).join('')}
          </ul>
        </section>` : '';
      })()}
    `),
  }));

  for (const province of provinces) {
    const provinceSchools = typeSchools.filter(
      (school) => publishedText(school.province) === province,
    );
    if (provinceSchools.length < 2) continue;
    await writeSchoolLocationRoute({ type, label, province, schools: provinceSchools });

    const districts = [...new Set(
      provinceSchools.map((school) => publishedText(school.district)).filter(Boolean),
    )].sort();
    for (const district of districts) {
      const districtSchools = provinceSchools.filter(
        (school) => publishedText(school.district) === district,
      );
      if (districtSchools.length < 2) continue;
      await writeSchoolLocationRoute({ type, label, province, district, schools: districtSchools });
    }
  }
}

/**
 * The registry holds records that share a name within the same province, either
 * because the name is truncated or because the row is duplicated. Two pages must
 * not share a title, so records in a colliding group get the published locality
 * appended. Nothing here invents a name or an address.
 */
const schoolTitleKey = (school) => [
  school.name,
  publishedText(school.district),
  publishedText(school.province),
].join('|').toLowerCase();

const collidingSchoolKeys = new Set(
  Object.entries(schoolRecords.reduce((groups, school) => {
    const key = schoolTitleKey(school);
    groups[key] = (groups[key] || 0) + 1;
    return groups;
  }, {}))
    .filter(([, count]) => count > 1)
    .map(([key]) => key),
);

const schoolProfileImages = new Map();

// Every directory record has a substantial description and can render in the
// browser. Publish each profile while clearly labelling unreviewed details.
for (const school of schoolRecords) {
  const profilePath = `/${slugify(school.name)}/`;
  const label = schoolTypeLabel(school.type);
  const place = [publishedText(school.district), publishedText(school.province)]
    .filter(Boolean)
    .join(', ');
  const description = publishedText(school.description) ||
    `${school.name} is a ${label.toLowerCase()} listed in ${place || 'Zimbabwe'}. View its location, contact details and institution profile.`;
  const addressText = publishedText(school.address) || publishedText(school.location);
  const hasCoordinates =
    school.coordinates &&
    typeof school.coordinates === 'object' &&
    Number.isFinite(school.coordinates.lat) &&
    Number.isFinite(school.coordinates.lng);
  const website = publishedText(school.website);
  const logo = institutionLogoForName(school.name);
  const schoolImage = logo || publishedText(school.image);
  const absoluteSchoolImage = schoolImage
    ? (schoolImage.startsWith('http') ? schoolImage : `${SITE_URL}${schoolImage.startsWith('/') ? '' : '/'}${schoolImage}`)
    : '';
  if (logo && absoluteSchoolImage) schoolProfileImages.set(profilePath, absoluteSchoolImage);
  const categoryPath = `/schools/search/${encodeURIComponent(school.type)}/`;
  const structuredSchool = {
    '@context': 'https://schema.org',
    '@type': schoolSchemaType(school.type),
    '@id': `${SITE_URL}${profilePath}#school`,
    name: school.name,
    description,
    url: `${SITE_URL}${profilePath}`,
    address: {
      '@type': 'PostalAddress',
      ...(addressText ? { streetAddress: addressText } : {}),
      ...(publishedText(school.district) ? { addressLocality: school.district } : {}),
      ...(publishedText(school.province) ? { addressRegion: school.province } : {}),
      addressCountry: 'ZW',
    },
    ...(hasCoordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: school.coordinates.lat,
            longitude: school.coordinates.lng,
          },
        }
      : {}),
    ...(publishedText(school.phone) ? { telephone: school.phone } : {}),
    ...(publishedText(school.email) ? { email: school.email } : {}),
    ...(website
      ? { sameAs: [website.startsWith('http') ? website : `https://${website}`] }
      : {}),
    ...(absoluteSchoolImage ? { image: absoluteSchoolImage } : {}),
    ...(logo && absoluteSchoolImage ? { logo: absoluteSchoolImage } : {}),
    areaServed: { '@type': 'Country', name: 'Zimbabwe' },
  };

  const titleQualifier = collidingSchoolKeys.has(schoolTitleKey(school)) && addressText
    ? ` (${addressText})`
    : '';

  await writeRoute(profilePath, seoHtml({
    title: `${school.name}${logo ? ' Logo &' : ' –'} School Information${place ? `, ${place}` : ''}${titleQualifier} | Exam Sidemann`,
    description,
    canonicalPath: profilePath,
    structuredData: [
      structuredSchool,
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}${categoryPath}` },
          { '@type': 'ListItem', position: 3, name: school.name, item: `${SITE_URL}${profilePath}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/">Exam Sidemann</a> / <a href="${categoryPath}">${escapeHtml(label)}</a></nav>
      <p style="font-weight:700;color:#0891b2">${escapeHtml(label)}${place ? ` · ${escapeHtml(place)}` : ''}</p>
      <h1>${escapeHtml(school.name)}</h1>
      ${logo ? `<figure><img src="${escapeHtml(absoluteSchoolImage)}" alt="${escapeHtml(`${school.name} official school logo`)}" width="240" height="240" loading="eager" /><figcaption>${escapeHtml(school.name)} logo</figcaption></figure>` : ''}
      <p>${escapeHtml(description)}</p>
      ${school.verified === true ? '' : '<p><strong>Directory notice:</strong> Confirm important contact, fee and admissions information directly with the institution.</p>'}
      <h2>Institution details</h2>
      <dl>
        ${addressText ? `<dt>Location</dt><dd>${escapeHtml(addressText)}</dd>` : ''}
        ${publishedText(school.phone) ? `<dt>Phone</dt><dd>${escapeHtml(school.phone)}</dd>` : ''}
        ${publishedText(school.email) ? `<dt>Email</dt><dd>${escapeHtml(school.email)}</dd>` : ''}
        ${website ? `<dt>Website</dt><dd><a href="${escapeHtml(website.startsWith('http') ? website : `https://${website}`)}">${escapeHtml(website)}</a></dd>` : ''}
      </dl>
      <p><a href="${categoryPath}">Browse more ${escapeHtml(label.toLowerCase())}</a></p>
    `),
  }));
}

for (const experiment of EXPERIMENTS) {
  const experimentPath = `${experiment.path}/`;
  const subjectPath = experimentSubjectPath(experiment);
  const relatedExperiments = EXPERIMENTS.filter(
    (candidate) => candidate.subject === experiment.subject
  );
  const resourceType = experiment.resourceType || 'Interactive experiment';
  const { title, description, heading } = experimentSeoFor({
    title: experiment.title,
    subjectName: experiment.subject,
    level: experiment.level,
    description: experiment.description,
    resourceType,
  });
  await writeRoute(experimentPath, seoHtml({
    title,
    description,
    canonicalPath: experimentPath,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: experiment.title,
        description: experiment.description,
        url: `${SITE_URL}${experimentPath}`,
        learningResourceType: resourceType,
        educationalLevel: experiment.level,
        teaches: experiment.title,
        isPartOf: {
          '@type': 'Course',
          name: `${experiment.level} ${experiment.subject}`,
          url: `${SITE_URL}${subjectPath}`,
        },
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Exam Sidemann',
          url: SITE_URL,
        },
        inLanguage: 'en-ZW',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Practical Labs', item: `${SITE_URL}/practicals/` },
          { '@type': 'ListItem', position: 2, name: experiment.level, item: `${SITE_URL}/practicals/olevel/` },
          { '@type': 'ListItem', position: 3, name: experiment.subject, item: `${SITE_URL}${subjectPath}` },
          { '@type': 'ListItem', position: 4, name: experiment.title, item: `${SITE_URL}${experimentPath}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/practicals/">Practical Labs</a> / <a href="/practicals/olevel/">O Level</a> / <a href="${subjectPath}">${escapeHtml(experiment.subject)}</a></nav>
      <p style="font-weight:700;color:#7c3aed">ZIMSEC ${escapeHtml(experiment.level)} ${escapeHtml(experiment.subject)} · ${escapeHtml(resourceType)}</p>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <p><a href="${experimentPath}">Open the interactive experiment</a></p>
      <h2>More ${escapeHtml(experiment.subject)} experiments</h2>
      <ul>
        ${relatedExperiments.map((related) =>
          `<li><a href="${related.path}/">${escapeHtml(related.title)}</a></li>`
        ).join('')}
      </ul>
    `),
  }));
}

for (const topic of polytechnicDrawingTopics) {
  const topicPath = `${topic.path}/`;
  const subjectPath = `${topic.subjectPath}/`;
  const relatedTopics = polytechnicDrawingTopics.filter(
    (candidate) => candidate.subjectPath === topic.subjectPath,
  );
  const description = `${topic.description} Learn ${topic.title.toLowerCase()} step by step in an interactive Polytechnic ${topic.subject.toLowerCase()} lesson.`;
  await writeRoute(topicPath, seoHtml({
    title: `${topic.title} – Polytechnic ${topic.subject} Practical | Exam Sidemann`,
    description,
    canonicalPath: topicPath,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: topic.title,
        description,
        url: `${SITE_URL}${topicPath}`,
        learningResourceType: 'Interactive practical',
        educationalLevel: 'Polytechnic',
        teaches: topic.title,
        isPartOf: {
          '@type': 'Course',
          name: `Polytechnic ${topic.subject}`,
          url: `${SITE_URL}${subjectPath}`,
        },
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Exam Sidemann',
          url: SITE_URL,
        },
        inLanguage: 'en-ZW',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Practical Labs', item: `${SITE_URL}/practicals/` },
          { '@type': 'ListItem', position: 2, name: 'Polytechnic', item: `${SITE_URL}/practicals/polytechnic/` },
          { '@type': 'ListItem', position: 3, name: topic.subject, item: `${SITE_URL}${subjectPath}` },
          { '@type': 'ListItem', position: 4, name: topic.title, item: `${SITE_URL}${topicPath}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/practicals/">Practical Labs</a> / <a href="/practicals/polytechnic/">Polytechnic</a> / <a href="${subjectPath}">${escapeHtml(topic.subject)}</a></nav>
      <p style="font-weight:700;color:#7c3aed">Polytechnic · ${escapeHtml(topic.subject)} · Interactive drawing lesson</p>
      <h1>${escapeHtml(topic.title)}</h1>
      <p>${escapeHtml(description)}</p>
      <h2>What you will learn</h2>
      <p>This guided practical demonstrates the construction on a drawing board and explains the method in a clear sequence.</p>
      <p><a href="${topicPath}">Open the interactive drawing lesson</a></p>
      <h2>More ${escapeHtml(topic.subject)} lessons</h2>
      <ul>
        ${relatedTopics.map((related) =>
          `<li><a href="${related.path}/">${escapeHtml(related.title)}</a> — ${escapeHtml(related.description)}</li>`
        ).join('')}
      </ul>
    `),
  }));
}

for (const course of learningCourses) {
  const board = boardForCategory(course.category);
  const courseIndexableSubjects = course.subjects.filter((subject) => subject.indexable);
  const { title, description, heading } = courseSeoFor({
    courseName: course.name,
    category: course.category,
    subjectCount: courseIndexableSubjects.length || course.subjects.length,
  });
  await writeRoute(course.path, seoHtml({
    title,
    description,
    canonicalPath: course.path,
    robots: course.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${board.name} ${course.name} Learning Programme`,
        description,
        educationalLevel: course.name,
        url: `${SITE_URL}${course.path}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: courseIndexableSubjects.length,
          itemListElement: courseIndexableSubjects.map((subject, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: subject.name,
            url: `${SITE_URL}${subject.path}`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Courses', item: `${SITE_URL}/courses/` },
          { '@type': 'ListItem', position: 2, name: course.name, item: `${SITE_URL}${course.path}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/courses/">Courses</a></nav>
      <p style="font-weight:700;color:#7c3aed">${escapeHtml(board.name)} · ${escapeHtml(course.category)} learning programme</p>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <h2>Subjects</h2>
      <ul>
        ${course.subjects.map((subject) =>
          `<li><a href="${subject.path}">${escapeHtml(subject.name)}</a> — ${subject.outcomeCount} learning outcomes</li>`
        ).join('')}
      </ul>
    `),
  }), { includeInSitemap: course.indexable });
}

/**
 * Past papers are filed under the examination course ("O' Level", "NC
 * Information Technology"), which is the curriculum course name for Polytechnic
 * programmes but the category for school forms.
 */
const papersForCourseSubject = (course, subjectName) => {
  const courseNames = new Set([course.name, course.category]);
  const aliases = subjectAliasesFor(subjectName).map((alias) => alias.toLowerCase());
  return papers.filter((paper) =>
    courseNames.has(paper.course) && aliases.includes(paper.subject.toLowerCase()),
  );
};

for (const { course, subject } of learningSubjects) {
  const board = boardForCategory(course.category);
  const subjectPapers = papersForCourseSubject(course, subject.name);
  const subjectIndexableOutcomes = subject.outcomes.filter((outcome) => outcome.indexable);
  const { title, description, heading } = subjectSeoFor({
    courseName: course.name,
    category: course.category,
    subjectName: subject.name,
    subjectDescription: subject.description,
    outcomeCount: subject.outcomeCount,
  });
  await writeRoute(subject.path, seoHtml({
    title,
    description,
    canonicalPath: subject.path,
    robots: subject.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${board.name} ${course.name} ${subject.name} Notes and Learning Outcomes`,
        educationalLevel: course.name,
        teaches: subjectIndexableOutcomes
          .filter((outcome) => !isGenericOutcomeLabel(outcome.label, outcome.number))
          .map((outcome) => outcome.label),
        description,
        url: `${SITE_URL}${subject.path}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: subjectIndexableOutcomes.length,
          itemListElement: subjectIndexableOutcomes.map((outcome) => ({
            '@type': 'ListItem',
            position: outcome.number,
            name: outcome.label,
            url: `${SITE_URL}${outcome.path}`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Courses', item: `${SITE_URL}/courses/` },
          { '@type': 'ListItem', position: 2, name: course.name, item: `${SITE_URL}${course.path}` },
          { '@type': 'ListItem', position: 3, name: subject.name, item: `${SITE_URL}${subject.path}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/courses/">Courses</a> / <a href="${course.path}">${escapeHtml(course.name)}</a></nav>
      <p style="font-weight:700;color:#7c3aed">${escapeHtml(board.name)} · ${escapeHtml(course.category)} · ${escapeHtml(course.name)}</p>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <h2>All ${subject.outcomeCount} learning outcomes</h2>
      <ol>
        ${subject.outcomes.map((outcome) =>
          `<li><a href="${outcome.path}">${escapeHtml(formatOutcomeName(outcome))}</a></li>`
        ).join('')}
      </ol>
      ${subjectPapers.length ? `
        <section aria-labelledby="subject-past-papers">
          <h2 id="subject-past-papers">${escapeHtml(board.name)} ${escapeHtml(subject.name)} past papers</h2>
          <ul>
            ${subjectPapers.map((paper) =>
              `<li><a href="${paper.path}">${escapeHtml(`${paper.subject} ${paper.year} ${paper.type}`)}</a></li>`
            ).join('')}
          </ul>
        </section>` : ''}
      ${vocabularyHtml({
        related: [
          { label: `All ${course.name} subjects`, path: course.path },
          ...(subjectPapers.length
            ? [{
                label: `${board.name} ${subject.name} past papers`,
                path: subjectPapers[0].subjectPath,
              }]
            : []),
        ],
      })}
    `),
  }), { includeInSitemap: subject.indexable });
}

for (const { course, subject, outcome } of learningOutcomes) {
  const board = boardForCategory(course.category);
  const { title, description, heading } = outcomeSeoFor({
    courseName: course.name,
    category: course.category,
    subjectName: subject.name,
    subjectDescription: subject.description,
    outcomeCount: subject.outcomeCount,
    outcomeNumber: outcome.number,
    outcomeLabel: outcome.label,
    siblingLabels: subject.outcomes.map((sibling) => sibling.label),
  });
  const previousOutcome = subject.outcomes[outcome.number - 2];
  const nextOutcome = subject.outcomes[outcome.number];
  const legacyPath = `${subject.path}outcomes/${outcome.number}/`;
  await writeRoute(legacyPath, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${SITE_URL}${outcome.path}"><meta http-equiv="refresh" content="0;url=${outcome.path}"><title>${escapeHtml(title)}</title></head><body><a href="${outcome.path}">Open ${escapeHtml(outcome.label)}</a></body></html>`, { includeInSitemap: false });
  await writeRoute(outcome.path, seoHtml({
    title,
    description,
    canonicalPath: outcome.path,
    robots: outcome.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: `${subject.name}: ${outcome.label}`,
        description,
        url: `${SITE_URL}${outcome.path}`,
        learningResourceType: 'Learning outcome',
        educationalLevel: course.name,
        teaches: outcome.label,
        isPartOf: {
          '@type': 'Course',
          name: `${course.name} ${subject.name}`,
          url: `${SITE_URL}${subject.path}`,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Exam Sidemann',
            url: SITE_URL,
          },
        },
        inLanguage: 'en-ZW',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Exam Sidemann',
          url: SITE_URL,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Courses', item: `${SITE_URL}/courses/` },
          { '@type': 'ListItem', position: 2, name: course.name, item: `${SITE_URL}${course.path}` },
          { '@type': 'ListItem', position: 3, name: subject.name, item: `${SITE_URL}${subject.path}` },
          { '@type': 'ListItem', position: 4, name: outcome.label, item: `${SITE_URL}${outcome.path}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/courses/">Courses</a> / <a href="${course.path}">${escapeHtml(course.name)}</a> / <a href="${subject.path}">${escapeHtml(subject.name)}</a></nav>
      <p style="font-weight:700;color:#7c3aed">${escapeHtml(board.name)} · ${escapeHtml(course.category)} · ${escapeHtml(course.name)}</p>
      <h1>${escapeHtml(heading)}</h1>
      <p><strong>Learning Outcome ${outcome.number} of ${subject.outcomeCount}</strong></p>
      <p>${escapeHtml(description)}</p>
      <nav aria-label="Learning outcome navigation">
        ${previousOutcome ? `<a href="${previousOutcome.path}">Previous: ${escapeHtml(previousOutcome.label)}</a>` : ''}
        ${previousOutcome && nextOutcome ? ' · ' : ''}
        ${nextOutcome ? `<a href="${nextOutcome.path}">Next: ${escapeHtml(nextOutcome.label)}</a>` : ''}
      </nav>
      <h2>All ${escapeHtml(subject.name)} learning outcomes</h2>
      <ol>
        ${subject.outcomes.map((subjectOutcome) =>
          `<li><a href="${subjectOutcome.path}">${escapeHtml(formatOutcomeName(subjectOutcome))}</a></li>`
        ).join('')}
      </ol>
      ${vocabularyHtml({
        related: [
          { label: `${course.name} ${subject.name} notes`, path: subject.path },
          { label: `All ${course.name} subjects`, path: course.path },
        ],
      })}
    `),
  }), { includeInSitemap: outcome.indexable });
}

// These routed lesson components exist beyond the registry's current outcome
// counts, but contain only placeholder material. Emit server-visible noindex
// metadata without treating them as discoverable study resources.
const explicitThinOutcomeRoutes = [
  ['/courses/records-nc/records-preservation/outcomes/5/', 'Records Preservation Learning Outcome 5'],
  ['/courses/records-nc/records-preservation/outcomes/6/', 'Records Preservation Learning Outcome 6'],
  ['/courses/records-nc/reprography/outcomes/5/', 'Reprography Learning Outcome 5'],
  ['/courses/records-nc/reprography/outcomes/6/', 'Reprography Learning Outcome 6'],
];
for (const [routePath, heading] of explicitThinOutcomeRoutes) {
  if (generatedPaths.has(routePath)) continue;
  const description = `${heading} is incomplete and is excluded from search until substantive original study material is available.`;
  await writeRoute(routePath, seoHtml({
    title: `${heading} | Exam Sidemann`,
    description,
    canonicalPath: routePath,
    robots: NOINDEX_ROBOTS,
    content: shell(`
      <nav><a href="/courses/records-nc/">NC Records Management</a></nav>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
    `),
  }), { includeInSitemap: false });
}

const hasPublishedPapers = papers.length > 0;
const rootSeo = hasPublishedPapers
  ? paperArchiveSeoFor()
  : {
      title: 'Past Papers Currently Unavailable | Exam Sidemann',
      description: 'No past examination papers are currently available in the Exam Sidemann archive.',
      heading: 'Past papers currently unavailable',
    };
const papersByBoard = ['ZIMSEC', 'HEXCO'].map((boardName) => ({
  boardName,
  courses: courses.filter((paper) => paper.board === boardName),
})).filter((group) => group.courses.length > 0);
await writeRoute('/past-papers/', seoHtml({
  title: rootSeo.title,
  description: rootSeo.description,
  canonicalPath: '/past-papers/',
  robots: hasPublishedPapers ? INDEX_ROBOTS : NOINDEX_ROBOTS,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: rootSeo.heading,
    description: rootSeo.description,
    url: `${SITE_URL}/past-papers/`,
  },
  content: shell(`
    <p style="font-weight:700;color:#e11d48">${hasPublishedPapers ? 'Exam document archive' : 'Past papers notice'}</p>
    <h1>${escapeHtml(rootSeo.heading)}</h1>
    <p>${escapeHtml(rootSeo.description)}</p>
    ${papersByBoard.map(({ boardName, courses: boardCourses }) => `
      <section aria-labelledby="board-${slugify(boardName)}">
        <h2 id="board-${slugify(boardName)}">${escapeHtml(boardName)} past papers</h2>
        <ul>${boardCourses.map((paper) =>
          `<li><a href="${paper.coursePath}">${escapeHtml(boardName)} ${escapeHtml(paper.course)} past papers</a></li>`
        ).join('')}</ul>
      </section>`).join('')}
    ${hasPublishedPapers ? paperGuidanceHtml(paperHubGuidanceFor({})) : ''}
  `),
}), { includeInSitemap: hasPublishedPapers });

for (const coursePaper of courses) {
  const coursePapers = papers.filter((paper) => paper.course === coursePaper.course);
  const courseSubjects = uniqueBy(coursePapers, (paper) => paper.subject);
  const { title, description, heading } = paperCourseSeoFor({
    courseName: coursePaper.course,
    board: coursePaper.board,
  });
  await writeRoute(coursePaper.coursePath, seoHtml({
    title,
    description,
    canonicalPath: coursePaper.coursePath,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${coursePaper.board} ${coursePaper.course} Past Papers`,
      description,
      educationalLevel: coursePaper.course,
      url: `${SITE_URL}${coursePaper.coursePath}`,
    },
    content: shell(`
      <a href="/past-papers/">Past Papers</a>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <ul>${courseSubjects.map((paper) =>
        `<li><a href="${paper.subjectPath}">${escapeHtml(paper.subject)} past papers</a></li>`
      ).join('')}</ul>
      ${paperGuidanceHtml(paperHubGuidanceFor({ courseName: coursePaper.course }))}
    `),
  }));
}

for (const subjectPaper of subjects) {
  const subjectPapers = papers.filter((paper) => paper.course === subjectPaper.course && paper.subject === subjectPaper.subject);
  const { title, description, heading } = paperSubjectSeoFor({
    courseName: subjectPaper.course,
    subjectName: subjectPaper.subject,
    board: subjectPaper.board,
    paperCount: subjectPapers.length,
  });
  const subjectIsIndexable = subjectPapers.length > 1;
  await writeRoute(subjectPaper.subjectPath, seoHtml({
    title,
    description,
    canonicalPath: subjectPaper.subjectPath,
    robots: subjectIsIndexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${subjectPaper.board} ${subjectPaper.course} ${subjectPaper.subject} Past Papers`,
      numberOfItems: subjectPapers.length,
      itemListElement: subjectPapers.map((paper, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${paper.subject} ${paper.year} ${paper.type}`,
        url: `${SITE_URL}${paper.path}`,
      })),
    },
    content: shell(`
      <a href="${subjectPaper.coursePath}">${escapeHtml(subjectPaper.course)} Past Papers</a>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <ul>${subjectPapers.map((paper) => `<li><a href="${paper.path}">${escapeHtml(`${paper.subject} ${paper.year} ${paper.type}`)}</a></li>`).join('')}</ul>
      ${paperGuidanceHtml(paperHubGuidanceFor({
        courseName: subjectPaper.course,
        subjectName: subjectPaper.subject,
      }))}
    `),
  }), { includeInSitemap: subjectIsIndexable });
}

for (const paper of papers) {
  const { title, description, heading } = paperSeoFor({
    courseName: paper.course,
    subjectName: paper.subject,
    board: paper.board,
    year: paper.year,
    type: paper.type,
  });
  await writeRoute(paper.path, seoHtml({
    title,
    description,
    canonicalPath: paper.path,
    robots: NOINDEX_ROBOTS,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: `${paper.subject} ${paper.year} ${paper.type}`,
        description,
        url: `${SITE_URL}${paper.path}`,
        learningResourceType: 'Past examination paper',
        educationalLevel: paper.course,
        inLanguage: 'en',
        provider: { '@type': 'EducationalOrganization', name: 'Exam Sidemann', url: SITE_URL },
        encoding: {
          '@type': 'DigitalDocument',
          encodingFormat: 'application/pdf',
          contentUrl: paper.url,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Past Papers', item: `${SITE_URL}/past-papers/` },
          { '@type': 'ListItem', position: 2, name: paper.course, item: `${SITE_URL}${paper.coursePath}` },
          { '@type': 'ListItem', position: 3, name: paper.subject, item: `${SITE_URL}${paper.subjectPath}` },
          { '@type': 'ListItem', position: 4, name: `${paper.year} ${paper.type}`, item: `${SITE_URL}${paper.path}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/past-papers/">Past Papers</a> / <a href="${paper.coursePath}">${escapeHtml(paper.course)}</a> / <a href="${paper.subjectPath}">${escapeHtml(paper.subject)}</a></nav>
      <p style="font-weight:700;color:#e11d48">${escapeHtml(paper.board)} · ${escapeHtml(paper.course)}</p>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <dl>
        <dt>Examination board</dt><dd>${escapeHtml(paper.board)}</dd>
        <dt>Subject</dt><dd>${escapeHtml(paper.subject)}</dd>
        <dt>Level</dt><dd>${escapeHtml(paper.course)}</dd>
        <dt>Session</dt><dd>${escapeHtml(paper.year)}</dd>
        <dt>Paper</dt><dd>${escapeHtml(paper.type)}</dd>
      </dl>
      <p><a href="${paper.url}" rel="noopener">Open examination paper</a></p>
      ${vocabularyHtml({
        related: [
          { label: `All ${paper.course} ${paper.subject} past papers`, path: paper.subjectPath },
          { label: `All ${paper.course} past papers`, path: paper.coursePath },
        ],
      })}
    `),
  }), { includeInSitemap: false });
}

// ---------------------------------------------------------------------------
// Video library
//
// The curated ZIMSEC video catalogue ships with the app, so every form and
// subject shelf can be prerendered with the real lesson titles rather than
// hiding ~950 videos behind a single /tutorials page. The routes here mirror
// /tutorials/:courseSlug/:subjectSlug in src/app/App.tsx.
// ---------------------------------------------------------------------------
const tutorialCatalogue = JSON.parse(
  await readFile(path.join(ROOT, 'src/data', 'zimsecTutorialsCompact.json'), 'utf8'),
);

/** Seconds -> ISO 8601 duration, the form schema.org expects. */
const isoDuration = (seconds) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
};

const tutorialsByGrade = new Map();
for (const row of tutorialCatalogue) {
  if (!tutorialsByGrade.has(row.g)) tutorialsByGrade.set(row.g, new Map());
  const subjects = tutorialsByGrade.get(row.g);
  if (!subjects.has(row.s)) subjects.set(row.s, []);
  subjects.get(row.s).push(row);
}

const tutorialCourseFor = (gradeName) =>
  CURRICULUM_REGISTRY.find((course) => course.name === gradeName);

const youtubeWatchUrl = (videoId) =>
  `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

const videoListHtml = (rows) => `
  <ul>
    ${rows.map((row) => `<li>
      <a href="${youtubeWatchUrl(row.i)}" rel="noopener noreferrer">${escapeHtml(row.t)}</a>
      <span> — ${escapeHtml(row.c)}</span>
    </li>`).join('')}
  </ul>`;

// Note: VideoObject omits uploadDate because the catalogue does not record
// publication dates. The markup stays valid; it simply is not eligible for
// Google's video rich results until those dates are captured.
const videoObjects = (rows) => rows.slice(0, 60).map((row) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: row.t,
  description: `${row.s} video lesson for ${row.g} on the ZIMSEC syllabus, taught by ${row.c}.`,
  thumbnailUrl: `https://img.youtube.com/vi/${row.i}/hqdefault.jpg`,
  embedUrl: `https://www.youtube.com/embed/${row.i}`,
  duration: isoDuration(row.d),
  educationalLevel: row.g,
  learningResourceType: 'Video lesson',
  url: youtubeWatchUrl(row.i),
}));

for (const [gradeName, subjectMap] of [...tutorialsByGrade.entries()].sort()) {
  const course = tutorialCourseFor(gradeName);
  if (!course) continue;
  const board = boardForCategory(course.category);
  const gradeSlug = slugify(gradeName);
  const gradePath = `/tutorials/${gradeSlug}/`;
  const gradeRows = [...subjectMap.values()].flat();
  const subjectNames = [...subjectMap.keys()].sort();

  const gradeTitle = `${gradeName} Video Lessons | ${board.name} ${course.category} Tutorials`;
  const gradeDescription = `Watch ${gradeRows.length} free ${board.name} ${gradeName} video lessons across ${subjectNames.length} subjects, including ${subjectNames.slice(0, 4).join(', ')}. Revise the Zimbabwean syllabus with recorded lessons and past paper walkthroughs.`;

  await writeRoute(gradePath, seoHtml({
    title: gradeTitle,
    description: gradeDescription,
    canonicalPath: gradePath,
    robots: NOINDEX_ROBOTS,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: gradeTitle,
        description: gradeDescription,
        educationalLevel: gradeName,
        url: `${SITE_URL}${gradePath}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: subjectNames.length,
          itemListElement: subjectNames.map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${gradeName} ${name} video lessons`,
            url: `${SITE_URL}/tutorials/${gradeSlug}/${slugify(name)}/`,
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Video Tutorials', item: `${SITE_URL}/tutorials/` },
          { '@type': 'ListItem', position: 2, name: gradeName, item: `${SITE_URL}${gradePath}` },
        ],
      },
    ],
    content: shell(`
      <nav><a href="/tutorials/">Video Tutorials</a></nav>
      <p style="font-weight:700;color:#7c3aed">${escapeHtml(board.name)} · ${escapeHtml(course.category)} · ${escapeHtml(gradeName)}</p>
      <h1>${escapeHtml(gradeName)} video lessons</h1>
      <p>${escapeHtml(gradeDescription)}</p>
      <h2>Subjects with video lessons</h2>
      <ul>
        ${subjectNames.map((name) =>
          `<li><a href="/tutorials/${gradeSlug}/${slugify(name)}/">${escapeHtml(`${gradeName} ${name}`)}</a> — ${subjectMap.get(name).length} lessons</li>`
        ).join('')}
      </ul>
    `),
  }), { includeInSitemap: false });

  for (const subjectName of subjectNames) {
    const rows = subjectMap.get(subjectName);
    const subjectPath = `/tutorials/${gradeSlug}/${slugify(subjectName)}/`;
    const teachers = [...new Set(rows.map((row) => row.c))];
    const title = `${gradeName} ${subjectName} Video Lessons | ${board.name} Tutorials`;
    const description = `Watch ${rows.length} free ${board.name} ${gradeName} ${subjectName} video lessons and past paper walkthroughs from ${teachers.slice(0, 3).join(', ')}. Revise the Zimbabwean ${subjectName} syllabus online.`;

    await writeRoute(subjectPath, seoHtml({
      title,
      description,
      canonicalPath: subjectPath,
      robots: NOINDEX_ROBOTS,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          educationalLevel: gradeName,
          about: subjectName,
          url: `${SITE_URL}${subjectPath}`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: rows.length,
            itemListElement: rows.slice(0, 60).map((row, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: row.t,
              url: youtubeWatchUrl(row.i),
            })),
          },
        },
        ...videoObjects(rows),
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Video Tutorials', item: `${SITE_URL}/tutorials/` },
            { '@type': 'ListItem', position: 2, name: gradeName, item: `${SITE_URL}${gradePath}` },
            { '@type': 'ListItem', position: 3, name: subjectName, item: `${SITE_URL}${subjectPath}` },
          ],
        },
      ],
      content: shell(`
        <nav><a href="/tutorials/">Video Tutorials</a> / <a href="${gradePath}">${escapeHtml(gradeName)}</a></nav>
        <p style="font-weight:700;color:#7c3aed">${escapeHtml(board.name)} · ${escapeHtml(gradeName)} · ${escapeHtml(subjectName)}</p>
        <h1>${escapeHtml(`${gradeName} ${subjectName} video lessons`)}</h1>
        <p>${escapeHtml(description)}</p>
        <h2>All ${rows.length} ${escapeHtml(subjectName)} lessons</h2>
        ${videoListHtml(rows)}
        <h2>Other ${escapeHtml(gradeName)} subjects</h2>
        <ul>
          ${subjectNames.filter((name) => name !== subjectName).map((name) =>
            `<li><a href="/tutorials/${gradeSlug}/${slugify(name)}/">${escapeHtml(`${gradeName} ${name} video lessons`)}</a></li>`
          ).join('')}
        </ul>
      `),
    }), { includeInSitemap: false });
  }
}

// Known placeholder routes are kept navigable, but receive server-visible
// noindex metadata even before the client application starts.
const placeholderRoutes = [
  ['/practicals/polytechnic/under-construction/', 'Polytechnic practicals'],
  ['/practicals/olevel/food-technology/', 'O Level Food Technology practicals'],
];

// Computer Science is published — three browser tools rather than an article,
// so the route stays noindex, but the server-visible copy has to describe what
// is actually there instead of claiming it is still being built.
const computerScienceRoutes = [
  ['/practicals/olevel/computer-science/', 'O Level Computer Science practicals'],
  ['/practicals/alevel/computer-science/', 'A Level Computer Science practicals'],
];
for (const [routePath, label] of computerScienceRoutes) {
  if (generatedPaths.has(routePath)) continue;
  await writeRoute(routePath, seoHtml({
    title: `${label} | Exam Sidemann`,
    description: `${label}: a Visual Basic .NET Windows Forms studio, a Microsoft Access database lab and a web design editor, all in the browser.`,
    canonicalPath: routePath,
    robots: NOINDEX_ROBOTS,
    content: shell(`
      <nav><a href="/practicals/">Practical Labs</a></nav>
      <h1>${escapeHtml(label)}</h1>
      <p>Three practical tools run in the browser, with no installation:</p>
      <ul>
        <li><a href="/practicals/tools/vbnet/">Visual Basic .NET</a> — design a Windows form and write the code behind it.</li>
        <li><a href="/practicals/tools/access/">Microsoft Access Database</a> — build tables, queries, forms and reports.</li>
        <li><a href="/practicals/tools/webdev/">Web Design</a> — write HTML, CSS and JavaScript with a live preview.</li>
      </ul>
    `),
  }), { includeInSitemap: false });
}
for (const [placeholderPath, label] of placeholderRoutes) {
  if (generatedPaths.has(placeholderPath)) continue;
  await writeRoute(placeholderPath, seoHtml({
    title: `${label} Coming Soon | Exam Sidemann`,
    description: `${label} are not yet available on Exam Sidemann.`,
    canonicalPath: placeholderPath,
    robots: NOINDEX_ROBOTS,
    content: shell(`
      <nav><a href="/practicals/">Practical Labs</a></nav>
      <h1>${escapeHtml(label)} coming soon</h1>
      <p>This practical resource has not been published yet.</p>
    `),
  }), { includeInSitemap: false });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...sitemapPaths].sort().map((routePath) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>${sourceLastModified ? `
    <lastmod>${sourceLastModified}</lastmod>` : ''}${schoolProfileImages.has(routePath) ? `
    <image:image>
      <image:loc>${schoolProfileImages.get(routePath)}</image:loc>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`;

await writeFile(path.join(DIST, 'sitemap.xml'), sitemap);

// public/robots.txt is the single source of truth for crawl rules; Vite copies
// it into dist and this step only guarantees it advertises the sitemap.
const sourceRobots = await readFile(path.join(ROOT, 'public', 'robots.txt'), 'utf8');
const sitemapDirective = `Sitemap: ${SITE_URL}/sitemap.xml`;
await writeFile(
  path.join(DIST, 'robots.txt'),
  sourceRobots.includes(sitemapDirective)
    ? sourceRobots
    : `${sourceRobots.trimEnd()}\n\n${sitemapDirective}\n`,
);
await writeFile(path.join(DIST, '404.html'), seoHtml({
  title: 'Page Not Found | Exam Sidemann',
  description: 'The requested Exam Sidemann page could not be found.',
  canonicalPath: '/404',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page Not Found',
    url: `${SITE_URL}/404`,
  },
  robots: 'noindex, nofollow, noarchive',
  content: shell(`
    <h1>Page Not Found</h1>
    <p>The requested page could not be found.</p>
    <p><a href="/">Return to Exam Sidemann</a></p>
  `),
}));

console.log(
  `Generated ${generatedPaths.size} static routes; ${sitemapPaths.size} indexable URLs were added to the sitemap. ${schoolRecords.length} deduplicated school profiles were generated.`
);
