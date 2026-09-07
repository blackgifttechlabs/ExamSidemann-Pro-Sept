/**
 * Search-phrase vocabulary for Exam Sidemann.
 *
 * Zimbabwean learners look for the same page in dozens of ways: "hexco it
 * notes", "nc it csm notes pdf", "zimsec o level shona past papers", "form 4
 * computer science notes free download", "records management archiving notes".
 * This module is the single source of truth for those aliases so that the
 * static SEO generator, the runtime <SeoHead>, and the study hubs all describe
 * a page with the same vocabulary.
 *
 * Keep this file import-free. scripts/generateSeo.mjs transpiles it on its own
 * and cannot resolve relative imports.
 */

export type ResourceKind =
  | 'notes'
  | 'pastPapers'
  | 'syllabus'
  | 'practicals'
  | 'tutorials'
  | 'questions';

export interface BoardInfo {
  /** Short name learners type, e.g. "ZIMSEC". */
  name: string;
  /** Registered name, used once per page for entity clarity. */
  fullName: string;
  aliases: string[];
}

export interface KeywordContext {
  courseName?: string;
  category?: string;
  subjectName?: string;
  outcomeLabel?: string;
  outcomeNumber?: number;
  kinds?: ResourceKind[];
  extras?: string[];
}

export const slugifyKeyword = (value: string): string => value
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/\./g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const ZIMSEC: BoardInfo = {
  name: 'ZIMSEC',
  fullName: 'Zimbabwe School Examinations Council',
  aliases: ['ZIMSEC', 'Zimsec', 'Zimbabwe School Examinations Council'],
};

const HEXCO: BoardInfo = {
  name: 'HEXCO',
  fullName: 'Higher Education Examinations Council',
  aliases: ['HEXCO', 'Hexco', 'Higher Education Examinations Council'],
};

export const BOARDS = { ZIMSEC, HEXCO } as const;

export const boardForCategory = (category?: string): BoardInfo =>
  (category === 'Polytechnic' ? HEXCO : ZIMSEC);

/**
 * Every way a learner names the level a course sits at. The first entry is the
 * canonical label, so callers that only want one alias get the best one.
 */
const LEVEL_ALIASES: Record<string, string[]> = {
  'Form 1': ['Form 1', 'Form One', 'ZJC', 'Junior Certificate', 'Grade 8'],
  'Form 2': ['Form 2', 'Form Two', 'ZJC', 'Junior Certificate', 'Grade 9'],
  'Form 3': ['Form 3', 'Form Three', 'O Level', "O' Level", 'OLevel', 'Ordinary Level', 'Grade 10'],
  'Form 4': ['Form 4', 'Form Four', 'O Level', "O' Level", 'OLevel', 'Ordinary Level', 'Grade 11'],
  'Lower 6': ['Lower 6', 'Lower Six', 'A Level', "A' Level", 'ALevel', 'Advanced Level', 'Form 5'],
  'Upper 6': ['Upper 6', 'Upper Six', 'A Level', "A' Level", 'ALevel', 'Advanced Level', 'Form 6'],
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  ZJC: ['ZJC', 'Junior Certificate', 'Form 1 and Form 2'],
  "O' Level": ['O Level', "O' Level", 'OLevel', 'Ordinary Level'],
  "A' Level": ['A Level', "A' Level", 'ALevel', 'Advanced Level'],
  Polytechnic: ['Polytechnic', 'College', 'Tertiary', 'TVET'],
};

const QUALIFICATION_ALIASES: Record<string, string[]> = {
  NC: ['NC', 'National Certificate', 'Certificate'],
  ND: ['ND', 'National Diploma', 'Diploma'],
};

/**
 * Programme-specific aliases for the HEXCO courses, where the shorthand a
 * learner types ("nc it", "records management", "ND RIM") rarely matches the
 * registered programme name.
 */
const PROGRAMME_ALIASES: Record<string, string[]> = {
  'NC Information Technology': [
    'NC IT',
    'HEXCO IT',
    'National Certificate in Information Technology',
    'NC Information Technology',
    'IT National Certificate',
    'certificate in IT',
  ],
  'ND Information Technology': [
    'ND IT',
    'HEXCO ND IT',
    'National Diploma in Information Technology',
    'ND Information Technology',
    'IT National Diploma',
    'diploma in IT',
  ],
  'NC Auto Electrics': [
    'NC Auto Electrics',
    'auto electrics',
    'motor vehicle electrics',
    'auto electrician course',
    'National Certificate in Auto Electrics',
  ],
  'NC Records Management': [
    'NC Records Management',
    'records management',
    'HEXCO records management',
    'National Certificate in Records Management',
    'records and information management',
    'NC Records',
  ],
  'ND Records & Information Management': [
    'ND Records and Information Management',
    'ND RIM',
    'records and information management',
    'HEXCO records diploma',
    'National Diploma in Records and Information Management',
    'information management diploma',
  ],
  'NC Purchasing & Supply': [
    'NC Purchasing and Supply',
    'purchasing and supply',
    'procurement course',
    'National Certificate in Purchasing and Supply',
    'supply chain certificate',
    'NC Purchasing',
  ],
  'ND Purchasing & Supply': [
    'ND Purchasing and Supply',
    'purchasing and supply diploma',
    'procurement diploma',
    'National Diploma in Purchasing and Supply',
    'supply chain management diploma',
  ],
  'NC Banking and Finance': [
    'NC Banking and Finance',
    'banking and finance',
    'HEXCO banking',
    'National Certificate in Banking and Finance',
    'banking course',
  ],
};

/**
 * Subject shorthand, abbreviations and vernacular names. Only subjects whose
 * common search term differs from the registered name need an entry.
 */
const SUBJECT_ALIASES: Record<string, string[]> = {
  Mathematics: ['Maths', 'Math', 'Mathematics'],
  'Pure Mathematics': ['Pure Maths', 'Pure Mathematics', 'Maths'],
  'English Language': ['English', 'English Language', 'Eng Language'],
  Shona: ['Shona', 'ChiShona', 'Chishona'],
  Ndebele: ['Ndebele', 'IsiNdebele', 'Isindebele'],
  'Combined Science': ['Combined Science', 'Comb Science', 'Integrated Science'],
  'Computer Science': ['Computer Science', 'Comp Science', 'Computers', 'Computer Studies'],
  'Computer Studies': ['Computer Studies', 'Computers', 'Computer Science', 'ICT'],
  'Family and Religious Studies': ['FRS', 'Family and Religious Studies', 'Religious Studies'],
  'Heritage Studies': ['Heritage Studies', 'Heritage'],
  'Physical Education (PE)': ['PE', 'Physical Education', 'Sport Science'],
  'Food and Nutrition': ['Food and Nutrition', 'Foods', 'Nutrition'],
  'Fashion and Fabrics': ['Fashion and Fabrics', 'Fashion', 'Textiles'],
  'Technical Graphics': ['Technical Graphics', 'TG', 'Tech Graphics'],
  'Art and Design': ['Art and Design', 'Art'],
  'Bible Knowledge': ['Bible Knowledge', 'BK', 'Divinity'],

  // HEXCO NC / ND Information Technology
  'Computer Systems Maintenance': ['CSM', 'Computer Systems Maintenance', 'computer hardware maintenance', 'PC maintenance'],
  'Programming Concepts': ['Programming Concepts', 'programming', 'introduction to programming', 'algorithms and logic'],
  'Database Concepts': ['Database Concepts', 'databases', 'SQL', 'DBMS'],
  'Computer Networking': ['Computer Networking', 'networking', 'networks', 'LAN and WAN'],
  'Computer Security': ['Computer Security', 'cyber security', 'information security'],
  'Safety, Health, Environment & Quality': ['SHEQ', 'Safety Health Environment and Quality', 'occupational safety'],
  'National & Strategic Studies': ['National and Strategic Studies', 'NASS', 'national studies'],
  'National Studies': ['National Studies', 'NASS', 'national and strategic studies'],
  'Workplace Communication': ['Workplace Communication', 'communication skills', 'business communication'],
  'Entrepreneurship Skills Development': ['ESD', 'Entrepreneurship Skills Development', 'entrepreneurship'],
  'Entrepreneurial Skills Development': ['ESD', 'Entrepreneurial Skills Development', 'entrepreneurship'],
  ESD: ['ESD', 'Enterprise Skills Development', 'entrepreneurship'],
  'Hardware Administration': ['Hardware Administration', 'hardware admin', 'server hardware'],
  'Network Administration': ['Network Administration', 'network admin', 'subnetting and routing'],
  'Software Engineering': ['Software Engineering', 'SDLC', 'software design'],
  'Database Administration': ['Database Administration', 'DBA', 'SQL administration'],
  'Object Oriented Programming': ['OOP', 'Object Oriented Programming', 'C# programming', 'classes and objects'],
  'Web Development': ['Web Development', 'web design', 'HTML CSS JavaScript', 'full stack'],
  'Information Security': ['Information Security', 'cyber security', 'InfoSec'],
  'Operating Systems Administration': ['Operating Systems Administration', 'OS administration', 'Linux administration'],
  'Design & Analysis of Algorithms': ['DAA', 'Design and Analysis of Algorithms', 'algorithms', 'Big O notation'],
  'Research & Project Management': ['Research and Project Management', 'research methods', 'project management'],

  // HEXCO Records Management
  Archiving: ['Archiving', 'archives', 'record archiving'],
  'Classification of Records': ['Classification of Records', 'records classification', 'filing classification'],
  'Digital & Conv. Mail Management': ['Digital and Conventional Mail Management', 'mail management', 'mail handling'],
  'Digital Filing': ['Digital Filing', 'electronic filing', 'EDMS'],
  'Reception Management': ['Reception Management', 'front office', 'reception skills'],
  'Records Preservation': ['Records Preservation', 'document preservation', 'record conservation'],
  Reprography: ['Reprography', 'reprographics', 'document reproduction'],
  Reprographics: ['Reprographics', 'reprography', 'document reproduction'],
  'Records & Information Management': ['Records and Information Management', 'RIM', 'records management'],
  'Preservation Management': ['Preservation Management', 'preservation', 'conservation management'],
  'Database Analysis & Design': ['Database Analysis and Design', 'database design', 'data modelling'],
  'Information Literacy': ['Information Literacy', 'research skills'],
  'Records Centre Management': ['Records Centre Management', 'records centre', 'record storage'],
  'Archives Administration': ['Archives Administration', 'archives management'],
  'Indigenous Knowledge Systems Mgmt.': ['Indigenous Knowledge Systems Management', 'IKS', 'indigenous knowledge'],
  'Records & Info Services Automation': ['Records and Information Services Automation', 'records automation'],
  'Research Methods in Info Science': ['Research Methods in Information Science', 'research methods'],

  // HEXCO Purchasing & Supply
  'Computing & Digital Literacy': ['Computing and Digital Literacy', 'digital literacy', 'computer literacy'],
  'Computing and Digital Literacy': ['Computing and Digital Literacy', 'digital literacy', 'computer literacy'],
  'International Purchasing Fundamentals': ['International Purchasing Fundamentals', 'international purchasing', 'global sourcing'],
  'Logistics Management': ['Logistics Management', 'logistics'],
  'Procurement Practice': ['Procurement Practice', 'procurement', 'tendering'],
  'Stakeholder Management': ['Stakeholder Management', 'stakeholder relations'],
  'Stores & Warehouse Management': ['Stores and Warehouse Management', 'warehouse management', 'stores management'],
  'Supply Chain Operations': ['Supply Chain Operations', 'supply chain'],
  'Industrial & Services Procurement': ['Industrial and Services Procurement', 'industrial procurement'],
  Communication: ['Communication', 'communication skills', 'business communication'],
  'Principles of Purchasing & Supply': ['Principles of Purchasing and Supply', 'purchasing principles'],
  'Inventory Management': ['Inventory Management', 'stock control', 'inventory control'],
  'Management of Org. Assets': ['Management of Organisational Assets', 'asset management'],
  'Legal Aspects of Procurement': ['Legal Aspects of Procurement', 'procurement law', 'contract law'],
  'Logistics & Distribution Mgmt.': ['Logistics and Distribution Management', 'distribution management'],
  'Public Procurement': ['Public Procurement', 'PRAZ procurement', 'government tendering'],
  'Strategic Procurement': ['Strategic Procurement', 'sourcing strategy'],
  'Procurement Negotiation': ['Procurement Negotiation', 'negotiation skills'],

  // HEXCO Banking and Finance
  'Money and Banking': ['Money and Banking', 'banking', 'monetary economics'],
  'Introduction to Banking Law': ['Introduction to Banking Law', 'banking law'],
  'Customer Accounts Management': ['Customer Accounts Management', 'bank accounts management'],
  'Investments Administration': ['Investments Administration', 'investment administration'],
  'Financial Mathematics 1': ['Financial Mathematics', 'financial maths', 'interest and annuities'],

  // NC Auto Electrics
  'Safety, Health, Env & Fitting/Machining': ['Safety Health Environment and Fitting', 'workshop safety', 'fitting and machining'],
  'Electrical & Electronics Fundamentals': ['Electrical and Electronics Fundamentals', 'electrical fundamentals', 'basic electronics'],
  'Automotive Comm & Computer Apps': ['Automotive Communication and Computer Applications', 'automotive computer applications'],
  'Motor Vehicle Systems Minor Service': ['Motor Vehicle Systems Minor Service', 'minor service', 'vehicle servicing'],
  'Wiring Lighting & Auxiliary Systems': ['Wiring Lighting and Auxiliary Systems', 'vehicle wiring', 'auto lighting'],
  'Automotive Eng Maths & Science': ['Automotive Engineering Maths and Science', 'engineering maths'],
  'Electronic Fuel Injection Maint.': ['Electronic Fuel Injection Maintenance', 'EFI', 'fuel injection'],
  'Ignition, Starting & Charging Syst.': ['Ignition Starting and Charging Systems', 'starter and alternator', 'ignition systems'],
};

const RESOURCE_ALIASES: Record<ResourceKind, string[]> = {
  notes: ['notes', 'study notes', 'revision notes', 'summary notes', 'module notes', 'notes pdf'],
  pastPapers: [
    'past papers',
    'past exam papers',
    'previous exam papers',
    'question papers',
    'past papers pdf',
    'exam papers',
  ],
  syllabus: ['syllabus', 'syllabi', 'curriculum', 'scheme of work', 'syllabus pdf'],
  practicals: ['practicals', 'practical experiments', 'lab experiments', 'virtual lab', 'simulations'],
  tutorials: ['video tutorials', 'video lessons', 'online lessons', 'tutorials'],
  questions: ['questions and answers', 'exam questions', 'revision questions', 'practice questions', 'quiz'],
};

export const RESOURCE_LABELS: Record<ResourceKind, string> = {
  notes: 'Notes',
  pastPapers: 'Past Papers',
  syllabus: 'Syllabus',
  practicals: 'Practicals',
  tutorials: 'Video Tutorials',
  questions: 'Questions and Answers',
};

/** Qualifiers learners bolt onto almost any query. */
const INTENT_MODIFIERS = ['free', 'pdf', 'download', 'online'];

const dedupe = (values: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    const phrase = value.replace(/\s+/g, ' ').trim();
    if (!phrase) return;
    const key = phrase.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(phrase);
  });
  return result;
};

const qualificationFor = (courseName?: string): string[] => {
  if (!courseName) return [];
  if (/^NC\b/.test(courseName)) return QUALIFICATION_ALIASES.NC;
  if (/^ND\b/.test(courseName)) return QUALIFICATION_ALIASES.ND;
  return [];
};

/** Every level/programme name that should reach the page's vocabulary. */
export const levelAliasesFor = (courseName?: string, category?: string): string[] => dedupe([
  ...(courseName ? [courseName] : []),
  ...(courseName ? LEVEL_ALIASES[courseName] ?? [] : []),
  ...(courseName ? PROGRAMME_ALIASES[courseName] ?? [] : []),
  ...qualificationFor(courseName),
  ...(category ? CATEGORY_ALIASES[category] ?? [] : []),
]);

export const programmeAliasesFor = (courseName?: string): string[] =>
  dedupe(courseName ? PROGRAMME_ALIASES[courseName] ?? [courseName] : []);

export const subjectAliasesFor = (subjectName?: string): string[] =>
  dedupe(subjectName ? SUBJECT_ALIASES[subjectName] ?? [subjectName] : []);

export const resourceAliasesFor = (kind: ResourceKind): string[] => RESOURCE_ALIASES[kind];

/**
 * Board-qualified phrases such as "ZIMSEC O Level" or "HEXCO National
 * Certificate", which is how most learners open a query.
 */
export const boardLevelPhrases = (courseName?: string, category?: string): string[] => {
  const board = boardForCategory(category);
  const levels = levelAliasesFor(courseName, category);
  return dedupe([
    board.name,
    board.fullName,
    ...levels,
    ...levels.slice(0, 4).map((level) => `${board.name} ${level}`),
  ]);
};

/**
 * The long-tail phrase list for a page, most valuable first so that callers can
 * safely truncate. A single subject page reaches a few hundred phrasings; the
 * whole site reaches six figures.
 */
export const buildKeywordPhrases = (context: KeywordContext): string[] => {
  const { courseName, category, subjectName, outcomeLabel, kinds, extras } = context;
  const board = boardForCategory(category);
  const levels = levelAliasesFor(courseName, category);
  const subjects = subjectAliasesFor(subjectName);
  const resourceKinds = kinds?.length ? kinds : (['notes'] as ResourceKind[]);
  const resources = dedupe(resourceKinds.flatMap(resourceAliasesFor));
  const phrases: string[] = [];

  const push = (...parts: (string | undefined)[]) => {
    phrases.push(parts.filter(Boolean).join(' '));
  };

  // Subject + resource is the highest-intent shape: "csm notes".
  subjects.forEach((subject) => {
    resources.forEach((resource) => push(subject, resource));
  });

  // Level-qualified: "nc it csm notes", "form 4 shona notes".
  levels.forEach((level) => {
    subjects.forEach((subject) => {
      push(level, subject);
      resources.forEach((resource) => push(level, subject, resource));
    });
  });

  // Board-qualified: "hexco nc it csm notes", "zimsec form 4 shona notes".
  levels.slice(0, 5).forEach((level) => {
    subjects.slice(0, 3).forEach((subject) => {
      resources.slice(0, 4).forEach((resource) => {
        push(board.name, level, subject, resource);
      });
    });
  });

  // Intent modifiers: "free csm notes pdf", "download form 4 shona notes".
  INTENT_MODIFIERS.forEach((modifier) => {
    subjects.slice(0, 2).forEach((subject) => {
      resources.slice(0, 3).forEach((resource) => {
        push(modifier, subject, resource);
        push(subject, resource, modifier);
      });
    });
  });

  if (outcomeLabel) {
    subjects.slice(0, 2).forEach((subject) => {
      push(subject, outcomeLabel);
      push(subject, outcomeLabel, 'notes');
      push(outcomeLabel, 'notes');
    });
    push(outcomeLabel);
  }

  // Board and level on their own, for the broad head terms.
  boardLevelPhrases(courseName, category).forEach((phrase) => {
    resources.slice(0, 3).forEach((resource) => push(phrase, resource));
  });

  push('Zimbabwe', ...(subjects[0] ? [subjects[0]] : []), resources[0]);
  push('Exam Sidemann', subjects[0] ?? courseName, resources[0]);

  return dedupe([...phrases, ...(extras ?? [])]);
};

/** Comma-separated value for <meta name="keywords">, capped to stay sane. */
export const keywordsAttribute = (phrases: string[], limit = 32): string =>
  phrases.slice(0, limit).join(', ');

/**
 * A shorter, human-readable set of phrasings for the visible "people also
 * search for" block. Skips the modifier spam and keeps phrases that read like
 * something a person would actually type.
 */
export const relatedSearches = (context: KeywordContext, limit = 18): string[] => {
  const { courseName, category, subjectName, kinds } = context;
  const board = boardForCategory(category);
  const levels = levelAliasesFor(courseName, category).slice(0, 4);
  const subjects = subjectAliasesFor(subjectName).slice(0, 3);
  const resourceKinds = kinds?.length ? kinds : (['notes'] as ResourceKind[]);
  const phrases: string[] = [];

  resourceKinds.forEach((kind) => {
    const resources = resourceAliasesFor(kind).slice(0, 3);
    resources.forEach((resource) => {
      subjects.forEach((subject) => {
        levels.slice(0, 2).forEach((level) => phrases.push(`${level} ${subject} ${resource}`));
        phrases.push(`${board.name} ${subject} ${resource}`);
      });
      if (!subjects.length) {
        levels.forEach((level) => phrases.push(`${board.name} ${level} ${resource}`));
      }
    });
  });

  return dedupe(phrases).slice(0, limit);
};

/**
 * Compact programme names, so a title can say "HEXCO NC IT" instead of spending
 * 30 characters on "NC Information Technology".
 */
const PROGRAMME_SHORT: Record<string, string> = {
  'NC Information Technology': 'NC IT',
  'ND Information Technology': 'ND IT',
  'NC Auto Electrics': 'NC Auto Electrics',
  'NC Records Management': 'NC Records',
  'ND Records & Information Management': 'ND Records',
  'NC Purchasing & Supply': 'NC Purchasing',
  'ND Purchasing & Supply': 'ND Purchasing',
  'NC Banking and Finance': 'NC Banking',
};

/** Short board + level prefix for titles, e.g. "ZIMSEC O Level Form 4". */
export const compactLevelLabel = (courseName?: string, category?: string): string => {
  const board = boardForCategory(category);
  if (!courseName) return board.name;
  if (category === 'Polytechnic') {
    return `${board.name} ${PROGRAMME_SHORT[courseName] ?? courseName}`;
  }
  const categoryAlias = category ? CATEGORY_ALIASES[category]?.[0] : undefined;
  return [board.name, categoryAlias, courseName].filter(Boolean).join(' ');
};

/**
 * The abbreviation learners type instead of the registered subject name (CSM,
 * OOP, FRS, Maths). Only returns one when it is genuinely shorter, so titles do
 * not gain a redundant bracket.
 */
export const abbreviationFor = (subjectName?: string): string | undefined => {
  if (!subjectName) return undefined;
  const aliases = subjectAliasesFor(subjectName);
  return aliases.find((alias) => (
    alias.toLowerCase() !== subjectName.toLowerCase() &&
    alias.length <= 5 &&
    alias.length < subjectName.length &&
    /^[A-Za-z]+$/.test(alias)
  ));
};

/** "Computer Systems Maintenance (CSM)" when an abbreviation exists. */
export const subjectDisplayName = (subjectName: string): string => {
  const abbreviation = abbreviationFor(subjectName);
  return abbreviation ? `${subjectName} (${abbreviation})` : subjectName;
};

export interface PageSeo {
  title: string;
  description: string;
  heading: string;
}

export interface PaperHubGuidance {
  heading: string;
  intro: string;
  steps: string[];
}

const withProgrammeAliasSentence = (aliases: string[]) => {
  const extra = aliases.slice(1, 4);
  return extra.length ? ` Learners may also know this programme as ${extra.join(', ')}.` : '';
};

const withSubjectAliasSentence = (subjectName: string, aliases: string[]) => {
  const extra = aliases
    .filter((alias) => alias.toLowerCase() !== subjectName.toLowerCase())
    .slice(0, 3);
  return extra.length ? ` Common names for this subject include ${extra.join(', ')}.` : '';
};

export const courseSeoFor = (input: {
  courseName: string;
  category: string;
  subjectCount: number;
}): PageSeo => {
  const board = boardForCategory(input.category);
  const aliases = levelAliasesFor(input.courseName, input.category);
  return {
    title: `${board.name} ${input.courseName} Notes & Learning Outcomes | Exam Sidemann`,
    description: `Free ${board.name} ${input.courseName} notes, revision material and learning outcomes across ${input.subjectCount} subjects for students in Zimbabwe.${withProgrammeAliasSentence(aliases)}`,
    heading: `${board.name} ${input.courseName} Subjects, Notes and Learning Outcomes`,
  };
};

export const subjectSeoFor = (input: {
  courseName: string;
  category: string;
  subjectName: string;
  subjectDescription: string;
  outcomeCount: number;
}): PageSeo => {
  const board = boardForCategory(input.category);
  const level = compactLevelLabel(input.courseName, input.category);
  const aliases = subjectAliasesFor(input.subjectName);
  return {
    title: `${subjectDisplayName(input.subjectName)} Notes | ${level} – Exam Sidemann`,
    description: `Free ${board.name} ${input.courseName} ${input.subjectName} notes and revision questions covering all ${input.outcomeCount} learning outcomes. ${input.subjectDescription}${withSubjectAliasSentence(input.subjectName, aliases)}`,
    heading: `${input.courseName} ${input.subjectName} Notes and Learning Outcomes`,
  };
};

export const outcomeSeoFor = (input: {
  courseName: string;
  category: string;
  subjectName: string;
  subjectDescription: string;
  outcomeCount: number;
  outcomeNumber: number;
  outcomeLabel: string;
  /**
   * Every outcome label in the subject. A handful of subjects reuse a label
   * across two outcomes, and two pages must never share a title, so the outcome
   * number is added to the title only where the label is genuinely ambiguous.
   */
  siblingLabels?: string[];
}): PageSeo => {
  const board = boardForCategory(input.category);
  const level = compactLevelLabel(input.courseName, input.category);
  const generic = input.outcomeLabel === `Learning Outcome ${input.outcomeNumber}`;
  const ambiguous = !generic && (input.siblingLabels ?? [])
    .filter((label) => label === input.outcomeLabel).length > 1;
  const topic = generic
    ? `${input.subjectName} Learning Outcome ${input.outcomeNumber}`
    : input.outcomeLabel;
  const titleTopic = ambiguous
    ? `${input.outcomeLabel} (Outcome ${input.outcomeNumber})`
    : input.outcomeLabel;
  return {
    title: generic
      ? `${input.subjectName} Learning Outcome ${input.outcomeNumber} Notes | ${level} – Exam Sidemann`
      : `${titleTopic} – ${input.subjectName} Notes | ${level} – Exam Sidemann`,
    description: `Free ${board.name} ${input.courseName} notes on ${topic}, learning outcome ${input.outcomeNumber} of ${input.outcomeCount} in ${input.subjectName}. ${input.subjectDescription}`,
    heading: ambiguous
      ? `${input.subjectName}: ${input.outcomeLabel} (Outcome ${input.outcomeNumber})`
      : `${input.subjectName}: ${input.outcomeLabel}`,
  };
};

export const paperArchiveSeoFor = (): PageSeo => ({
  title: 'ZIMSEC & HEXCO Past Papers PDF – Free Download | Exam Sidemann',
  description: 'Download free ZIMSEC and HEXCO past exam papers in PDF for O Level, A Level, National Certificate and National Diploma courses in Zimbabwe.',
  heading: 'Zimbabwe ZIMSEC and HEXCO Past Papers',
});

export const paperCourseSeoFor = (input: { courseName: string; board: string }): PageSeo => ({
  title: `${input.board} ${input.courseName} Past Papers PDF | Exam Sidemann`,
  description: `Download free ${input.board} ${input.courseName} past exam papers and question papers in PDF for revision in Zimbabwe.`,
  heading: `${input.board} ${input.courseName} Past Papers`,
});

export const paperSubjectSeoFor = (input: {
  courseName: string;
  subjectName: string;
  board: string;
  paperCount: number;
}): PageSeo => ({
  title: `${input.courseName} ${input.subjectName} Past Papers PDF | ${input.board} – Exam Sidemann`,
  description: `Download ${input.paperCount} free ${input.board} ${input.courseName} ${input.subjectName} past exam ${input.paperCount === 1 ? 'paper' : 'papers'} in PDF. Use the question ${input.paperCount === 1 ? 'paper' : 'papers'} for revision and exam preparation in Zimbabwe.`,
  heading: `${input.board} ${input.courseName} ${input.subjectName} Past Papers`,
});

/**
 * Short, practical advice shown on paper collection pages. It is deliberately
 * about using the documents rather than repeating search phrases.
 */
export const paperHubGuidanceFor = (input: {
  courseName?: string;
  subjectName?: string;
}): PaperHubGuidance => {
  if (input.subjectName) {
    return {
      heading: `How to revise ${input.subjectName} with past papers`,
      intro: `Use these ${input.subjectName} papers to test recall, timing and how clearly you show each step of your answer.`,
      steps: [
        'Read the instructions and mark allocations before you start.',
        'Complete one paper under timed conditions without using your notes.',
        'Check difficult answers against your syllabus, class notes or a marking guide when one is available, then retry them.',
      ],
    };
  }

  if (input.courseName) {
    return {
      heading: `How to use ${input.courseName} past papers`,
      intro: 'Choose one subject at a time so your result shows exactly which topics need more revision.',
      steps: [
        'Start with a complete paper and follow the time printed on the document.',
        'Record the questions you could not answer or did not finish.',
        'Review those topics in your syllabus or notes, then attempt the missed questions again.',
      ],
    };
  }

  return {
    heading: 'A simple past-paper revision method',
    intro: 'Choose the correct level and subject, then use each paper as a timed check of what you can recall and apply.',
    steps: [
      'Attempt the paper without notes and follow the time shown on the document.',
      'Check each answer against your class notes, syllabus or a marking guide when one is available.',
      'List weak topics, review them, then attempt the missed questions again.',
    ],
  };
};

export const paperSeoFor = (input: {
  courseName: string;
  subjectName: string;
  board: string;
  year: string;
  type: string;
}): PageSeo => ({
  title: `${input.board} ${input.subjectName} ${input.year} ${input.type} Past Paper PDF | Exam Sidemann`,
  description: `View and download the free ${input.board} ${input.courseName} ${input.subjectName} ${input.year} ${input.type} past exam paper in PDF for revision in Zimbabwe.`,
  heading: `${input.subjectName} ${input.year} ${input.type}`,
});

export const experimentSeoFor = (input: {
  title: string;
  subjectName: string;
  level: string;
  description: string;
  resourceType: string;
}): PageSeo => ({
  title: `${input.title} – ${input.level} ${input.subjectName} Practical | Exam Sidemann`,
  description: `${input.description} Free ZIMSEC ${input.level} ${input.subjectName} virtual practical you can run in your browser.`,
  heading: `${input.title} – ${input.level} ${input.subjectName} ${input.resourceType}`,
});

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Question phrasings that mirror how learners ask, answered truthfully from
 * what the page actually offers. `available` gates every claim so a page never
 * promises past papers or practicals it does not have.
 */
export const faqFor = (context: KeywordContext & {
  canonical: string;
  outcomeCount?: number;
  available?: Partial<Record<ResourceKind, boolean>>;
}): FaqEntry[] => {
  const { courseName, category, subjectName, canonical, outcomeCount, available } = context;
  const board = boardForCategory(category);
  const subject = subjectAliasesFor(subjectName)[0] ?? subjectName;
  const level = levelAliasesFor(courseName, category)[0] ?? courseName;
  const levelPhrase = [board.name, level].filter(Boolean).join(' ');
  const topic = [subject, level].filter(Boolean).join(' at ');
  const entries: FaqEntry[] = [];

  if (subject && level) {
    entries.push({
      question: `Where can I find free ${levelPhrase} ${subject} notes?`,
      answer: `Exam Sidemann publishes free ${level} ${subject} study notes at ${canonical}. ${
        outcomeCount
          ? `The material is organised into ${outcomeCount} learning outcomes you can work through in order.`
          : 'The material follows the order of the syllabus.'
      }`,
    });
    entries.push({
      question: `Is ${subject} on Exam Sidemann aligned to the ${board.fullName} syllabus?`,
      answer: `Yes. ${subject} for ${level} follows the ${board.name} (${board.fullName}) syllabus outcomes, so the topics and their order match what is examined.`,
    });
  } else if (level) {
    entries.push({
      question: `What ${levelPhrase} resources does Exam Sidemann have?`,
      answer: `Exam Sidemann covers ${level} with curriculum-aligned notes, learning outcomes, past papers and interactive practicals at ${canonical}.`,
    });
  }

  if (available?.pastPapers) {
    entries.push({
      question: `Can I download ${levelPhrase} ${subject ?? ''} past papers?`.replace(/\s+\?/, '?').replace(/\s{2,}/g, ' '),
      answer: `Yes. ${board.name} ${[level, subject].filter(Boolean).join(' ')} past papers are listed on Exam Sidemann and each paper opens as a PDF you can read or download for free.`,
    });
  }

  if (available?.practicals) {
    entries.push({
      question: `Are there practical experiments for ${topic || level}?`,
      answer: `Yes. Exam Sidemann runs interactive experiments in the browser, so you can carry out the practical and record results without a physical laboratory.`,
    });
  }

  entries.push({
    question: 'Does Exam Sidemann cost anything?',
    answer: 'The notes, learning outcomes, past papers and practicals are free to use. Premium plans add extra study tools but are not required to study the material.',
  });

  return entries;
};
