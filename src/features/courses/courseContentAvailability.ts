const normalizeContentKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const ZJC_AVAILABLE_SUBJECTS: Record<string, string[]> = {
  'form-1': ['mathematics', 'combined-science', 'history', 'shona', 'english-language', 'computer-science', 'family-and-religious-studies', 'frs', 'agriculture'],
  'form-2': ['shona', 'english-language', 'computer-science', 'family-and-religious-studies', 'frs', 'agriculture'],
  'form-3': ['shona', 'english-language', 'computer-science', 'combined-science', 'family-and-religious-studies', 'frs', 'geography', 'agriculture', 'physics'],
  'form-4': ['mathematics', 'shona', 'english-language', 'computer-science', 'combined-science', 'family-and-religious-studies', 'frs', 'geography', 'agriculture', 'principles-of-accounting', 'accounting', 'physics'],
};

const POLYTECHNIC_AVAILABLE_SUBJECTS: Record<string, string[]> = {
  'nc-information-technology': [
    'computer-systems-maintenance',
    'programming-concepts',
    'database-concepts',
    'computer-networking',
    'computer-security',
    'national-and-strategic-studies',
    'workplace-communication',
    'entrepreneurship-skills-development',
  ],
  'nc-it': [
    'computer-systems-maintenance',
    'programming-concepts',
    'database-concepts',
    'computer-networking',
    'computer-security',
    'national-and-strategic-studies',
    'workplace-communication',
    'entrepreneurship-skills-development',
  ],
  'nc-auto-electrics': [
    'national-studies',
    'safety-health-env-and-fitting-machining',
    'electrical-and-electronics-fundamentals',
    'automotive-comm-and-computer-apps',
    'motor-vehicle-systems-minor-service',
    'entrepreneurship-skills-development',
    'wiring-lighting-and-auxiliary-systems',
    'automotive-eng-maths-and-science',
    'electronic-fuel-injection-maint',
    'ignition-starting-and-charging-syst',
  ],
  'nc-auto': [
    'national-studies',
    'safety-health-env-and-fitting-machining',
    'electrical-and-electronics-fundamentals',
    'automotive-comm-and-computer-apps',
    'motor-vehicle-systems-minor-service',
    'entrepreneurship-skills-development',
    'wiring-lighting-and-auxiliary-systems',
    'automotive-eng-maths-and-science',
    'electronic-fuel-injection-maint',
    'ignition-starting-and-charging-syst',
  ],
  'nd-information-technology': [
    'hardware-administration',
    'network-administration',
    'database-administration',
    'software-engineering',
    'object-oriented-programming',
    'web-development',
    'information-security',
    'operating-systems-administration',
    'design-and-analysis-of-algorithms',
    'research-and-project-management',
  ],
  'nd-it': [
    'hardware-administration',
    'network-administration',
    'database-administration',
    'software-engineering',
    'object-oriented-programming',
    'web-development',
    'information-security',
    'operating-systems-administration',
    'design-and-analysis-of-algorithms',
    'research-and-project-management',
  ],
  'nc-records-management': [
    'archiving',
    'classification-of-records',
    'digital-and-conv-mail-management',
    'digital-filing',
    'reception-management',
    'records-preservation',
    'reprography',
  ],
  'records-nc': [
    'archiving',
    'classification-of-records',
    'digital-and-conv-mail-management',
    'digital-filing',
    'reception-management',
    'records-preservation',
    'reprography',
  ],
  'nd-records-and-information-management': [
    'records-and-information-management',
    'preservation-management',
    'database-analysis-and-design',
    'information-literacy',
    'records-centre-management',
    'reprographics',
    'archives-administration',
    'indigenous-knowledge-systems-mgmt',
    'records-and-info-services-automation',
    'research-methods-in-info-science',
  ],
  'records-nd': [
    'records-and-information-management',
    'preservation-management',
    'database-analysis-and-design',
    'information-literacy',
    'records-centre-management',
    'reprographics',
    'archives-administration',
    'indigenous-knowledge-systems-mgmt',
    'records-and-info-services-automation',
    'research-methods-in-info-science',
  ],
  'nc-purchasing-and-supply': [
    'computing-and-digital-literacy',
    'international-purchasing-fundamentals',
    'logistics-management',
    'procurement-practice',
    'stakeholder-management',
    'stores-and-warehouse-management',
    'supply-chain-operations',
    'workplace-communication',
    'national-studies',
    'entrepreneurial-skills-development',
  ],
  'nc-ps': [
    'computing-and-digital-literacy',
    'international-purchasing-fundamentals',
    'logistics-management',
    'procurement-practice',
    'stakeholder-management',
    'stores-and-warehouse-management',
    'supply-chain-operations',
    'workplace-communication',
    'national-studies',
    'entrepreneurial-skills-development',
  ],
  'nd-purchasing-and-supply': [
    'industrial-and-services-procurement',
    'communication',
    'principles-of-purchasing-and-supply',
    'inventory-management',
    'management-of-org-assets',
    'legal-aspects-of-procurement',
    'logistics-and-distribution-mgmt',
    'public-procurement',
    'strategic-procurement',
    'procurement-negotiation',
  ],
  'nd-ps': [
    'industrial-and-services-procurement',
    'communication',
    'principles-of-purchasing-and-supply',
    'inventory-management',
    'management-of-org-assets',
    'legal-aspects-of-procurement',
    'logistics-and-distribution-mgmt',
    'public-procurement',
    'strategic-procurement',
    'procurement-negotiation',
  ],
  'nc-banking-and-finance': [
    'money-and-banking',
    'introduction-to-banking-law',
    'customer-accounts-management',
    'investments-administration',
    'financial-mathematics-1',
    'esd',
    'national-studies',
    'computing-and-digital-literacy',
  ],
  'banking-nc': [
    'money-and-banking',
    'introduction-to-banking-law',
    'customer-accounts-management',
    'investments-administration',
    'financial-mathematics-1',
    'esd',
    'national-studies',
    'computing-and-digital-literacy',
  ],
};

export const hasCourseSubjectContent = (level: string, subject: string, category?: string) => {
  const levelKey = normalizeContentKey(level);
  const subjectKey = normalizeContentKey(subject);

  if (category === 'ZJC' || category === "O' Level" || levelKey.startsWith('form-')) {
    return ZJC_AVAILABLE_SUBJECTS[levelKey]?.includes(subjectKey) || false;
  }

  if (category === 'Polytechnic' || POLYTECHNIC_AVAILABLE_SUBJECTS[levelKey]) {
    return POLYTECHNIC_AVAILABLE_SUBJECTS[levelKey]?.includes(subjectKey) || false;
  }

  return false;
};

/**
 * Routes can remain useful to a learner without being suitable search landing
 * pages. Keep that distinction explicit: `hasCourseSubjectContent` controls
 * access in the application, while this list only controls indexing.
 *
 * The duplicate entries below render the same lesson components as the named
 * primary copy. The placeholder and safety-sensitive entries are also kept
 * accessible in-app, but are deliberately excluded from search and sitemaps.
 */
const NON_INDEXABLE_COURSE_SUBJECTS = new Set([
  // Form 1 English/Shona are the primary shared-language copies.
  'form-2|english-language',
  'form-2|shona',
  'form-3|english-language',
  'form-3|shona',
  'form-4|english-language',
  'form-4|shona',

  // Form 4 is the primary copy of the shared Computer Science lessons.
  'form-1|computer-science',
  'form-2|computer-science',
  'form-3|computer-science',

  // Form 3 is the primary copy of the shared Geography lessons.
  'form-4|geography',

  // Form 3 is the primary copy of the shared Physics lessons.
  'form-4|physics',

  // These routes reuse NC IT National Studies, communication or enterprise
  // lesson components. Index the original NC IT routes only.
  'nc-auto-electrics|national-studies',
  'nc-auto-electrics|entrepreneurship-skills-development',
  'nc-purchasing-and-supply|workplace-communication',
  'nc-purchasing-and-supply|national-studies',
  'nc-purchasing-and-supply|entrepreneurial-skills-development',
  'nc-banking-and-finance|esd',
  'nc-banking-and-finance|national-studies',
  'nc-banking-and-finance|investments-administration',
  'nc-banking-and-finance|computing-and-digital-literacy',

  // The NC Purchasing page currently contains only a short placeholder.
  'nc-purchasing-and-supply|computing-and-digital-literacy',

  // Every currently routed outcome for these two modules is a "content will be
  // added" placeholder.
  'nc-auto-electrics|safety-health-env-and-fitting-machining',
  'nc-auto-electrics|automotive-comm-and-computer-apps',

  // Safety-sensitive lessons remain navigable, but are not search landings.
  'nc-information-technology|computer-security',
  'nd-information-technology|information-security',
]);

const NON_INDEXABLE_COURSE_OUTCOMES = new Set([
  // These outcome routes currently contain the same lesson as outcome 3.
  'nd-purchasing-and-supply|logistics-and-distribution-mgmt|4',
  'nc-banking-and-finance|customer-accounts-management|4',

  // These outcomes substantially duplicate the named primary lesson.
  // Procurement Practice LO4 is the primary Procurement Documents lesson.
  'nc-purchasing-and-supply|logistics-management|4',
  // Information Literacy LO2 already contains the material repeated by LO3.
  'nd-records-and-information-management|information-literacy|3',

  // These outcome routes currently contain only an unfinished placeholder.
  'nc-records-management|records-preservation|5',
  'nc-records-management|records-preservation|6',
  'nc-records-management|reprography|5',
  'nc-records-management|reprography|6',
]);

export const isCourseSubjectIndexable = (
  level: string,
  subject: string,
  category?: string,
) => {
  if (!hasCourseSubjectContent(level, subject, category)) return false;

  return !NON_INDEXABLE_COURSE_SUBJECTS.has(
    `${normalizeContentKey(level)}|${normalizeContentKey(subject)}`,
  );
};

/**
 * Outcome routes currently inherit the decision for their parent subject.
 * Keeping this as a separate API allows a genuinely thin individual outcome
 * to be excluded later without incorrectly marking its whole subject absent.
 */
export const isCourseOutcomeIndexable = (
  level: string,
  subject: string,
  outcomeNumber: number,
  category?: string,
) => (
  isCourseSubjectIndexable(level, subject, category) &&
  !NON_INDEXABLE_COURSE_OUTCOMES.has(
    `${normalizeContentKey(level)}|${normalizeContentKey(subject)}|${outcomeNumber}`,
  )
);
