import { COLLEGES } from './colleges';
import { HIGH_SCHOOLS } from './highSchools';
import { IMPAIRED_SCHOOLS } from './impairedSchools';
import { PRIMARY_SCHOOLS } from './primarySchools';
import { UNIVERSITIES } from './universities';
import type { LocalSchoolRecord } from './types';
import { schoolBannerForName } from '../schoolBanners';

const IMPAIRED_TYPES = new Set(['blind', 'deaf', 'autism', 'physical', 'impaired']);

const ALL_SCHOOLS: readonly LocalSchoolRecord[] = [
  ...PRIMARY_SCHOOLS,
  ...HIGH_SCHOOLS,
  ...COLLEGES,
  ...UNIVERSITIES,
  ...IMPAIRED_SCHOOLS,
];

const SCHOOLS_BY_ID = new Map(ALL_SCHOOLS.map((school) => [school.id, school]));

const normaliseSchoolName = (name: string) =>
  name.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const schoolSlugForName = (name: string) => name
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/\./g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const canonicalSchoolKey = (school: LocalSchoolRecord) => [
  normaliseSchoolName(school.name),
  school.type,
  normaliseSchoolName(school.province || ''),
  normaliseSchoolName(school.district || ''),
  normaliseSchoolName(school.address || school.location || ''),
].join('|');

const recordDetailScore = (school: LocalSchoolRecord) => [
  school.description,
  school.phone,
  school.email,
  school.website,
  school.image,
  school.coordinates,
  school.curriculums?.length,
  school.fees,
].filter(Boolean).length + (school.verified ? 100 : 0);

const CANONICAL_SCHOOL_BY_KEY = new Map<string, LocalSchoolRecord>();
ALL_SCHOOLS.forEach((school) => {
  const key = canonicalSchoolKey(school);
  const current = CANONICAL_SCHOOL_BY_KEY.get(key);
  if (!current || recordDetailScore(school) > recordDetailScore(current)) {
    CANONICAL_SCHOOL_BY_KEY.set(key, school);
  }
});
const CANONICAL_SCHOOL_IDS = new Set(
  [...CANONICAL_SCHOOL_BY_KEY.values()].map((school) => school.id),
);
const SCHOOLS_BY_SLUG = new Map<string, LocalSchoolRecord>();
[...CANONICAL_SCHOOL_BY_KEY.values()]
  .sort((left, right) => recordDetailScore(right) - recordDetailScore(left))
  .forEach((school) => {
    const slug = schoolSlugForName(school.name);
    if (slug && !SCHOOLS_BY_SLUG.has(slug)) SCHOOLS_BY_SLUG.set(slug, school);
  });

export type SchoolSuggestion = Pick<LocalSchoolRecord, 'id' | 'name' | 'type' | 'location' | 'province'>;

export type SchoolSearchOptions = {
  educationType?: 'high-school' | 'polytechnic' | 'high' | 'poly' | 'college' | 'university' | 'primary' | 'all';
  maximum?: number;
};

// Pre-indexed pools for instant retrieval
const HIGH_SCHOOL_SUGGESTIONS: SchoolSuggestion[] = HIGH_SCHOOLS
  .filter((school) => CANONICAL_SCHOOL_IDS.has(school.id))
  .map(({ id, name, type, location, province }) => ({ id, name, type, location, province }));

const POLYTECHNIC_SUGGESTIONS: SchoolSuggestion[] = COLLEGES
  .filter((school) => CANONICAL_SCHOOL_IDS.has(school.id))
  .map(({ id, name, type, location, province }) => ({ id, name, type, location, province }));

const ALL_SUGGESTIONS: SchoolSuggestion[] = ALL_SCHOOLS
  .filter((school) => CANONICAL_SCHOOL_IDS.has(school.id))
  .map(({ id, name, type, location, province }) => ({ id, name, type, location, province }));

// Prominent / Featured schools to show on empty focus
const POPULAR_POLYTECHNICS: SchoolSuggestion[] = [
  'Harare Polytechnic',
  'Bulawayo Polytechnic',
  'Mutare Polytechnic',
  'Gweru Polytechnic',
  'Kwekwe Polytechnic',
  'Masvingo Polytechnic',
  'Joshua Mqabuko Nkomo Polytechnic',
  'Kushinga Phikelela Polytechnic',
  'Msasa Industrial Training College',
  'Westgate Industrial Training College',
]
  .map((name) => POLYTECHNIC_SUGGESTIONS.find((s) => normaliseSchoolName(s.name) === normaliseSchoolName(name)))
  .filter(Boolean) as SchoolSuggestion[];

const POPULAR_HIGH_SCHOOLS: SchoolSuggestion[] = [
  'Churchill High School',
  'Prince Edward High School',
  'Goromonzi High School',
  'St George\'s College',
  'Milton High School',
  'Gokomere High School',
  'Alheit High School',
  'Pamushana High School',
  'Kutama College',
  'Dominican Convent High School',
]
  .map((name) => HIGH_SCHOOL_SUGGESTIONS.find((s) => normaliseSchoolName(s.name) === normaliseSchoolName(name)))
  .filter(Boolean) as SchoolSuggestion[];

/**
 * Fast, indexed search used by forms and sign-up modals.
 * Supports filtering down to High Schools or Polytechnics based on what the user chose.
 */
export const searchSchools = (
  rawTerm: string,
  optionsOrMax: SchoolSearchOptions | number = 10
): SchoolSuggestion[] => {
  const options: SchoolSearchOptions = typeof optionsOrMax === 'number'
    ? { maximum: optionsOrMax }
    : (optionsOrMax || {});
  
  const maximum = options.maximum ?? 10;
  const educationType = options.educationType || 'all';

  let pool: SchoolSuggestion[];
  if (educationType === 'high-school' || educationType === 'high') {
    pool = HIGH_SCHOOL_SUGGESTIONS;
  } else if (educationType === 'polytechnic' || educationType === 'poly' || educationType === 'college') {
    pool = POLYTECHNIC_SUGGESTIONS;
  } else {
    pool = ALL_SUGGESTIONS;
  }

  const term = rawTerm.trim().toLocaleLowerCase();
  if (term.length < 1) {
    if (educationType === 'polytechnic' || educationType === 'poly') {
      return (POPULAR_POLYTECHNICS.length > 0 ? POPULAR_POLYTECHNICS : pool).slice(0, maximum);
    }
    if (educationType === 'high-school' || educationType === 'high') {
      return (POPULAR_HIGH_SCHOOLS.length > 0 ? POPULAR_HIGH_SCHOOLS : pool).slice(0, maximum);
    }
    return pool.slice(0, maximum);
  }

  const seen = new Set<string>();
  const scoredResults: { school: SchoolSuggestion; score: number }[] = [];

  for (const school of pool) {
    const schoolNameLower = school.name.toLocaleLowerCase();
    const locationLower = (school.location || '').toLocaleLowerCase();
    const provinceLower = (school.province || '').toLocaleLowerCase();

    let score = -1;

    if (schoolNameLower === term) {
      score = 100;
    } else if (schoolNameLower.startsWith(term)) {
      score = 80;
    } else {
      const words = schoolNameLower.split(/\s+/);
      const matchedWord = words.find((w) => w.startsWith(term));
      if (matchedWord) {
        score = 60;
      } else if (schoolNameLower.includes(term)) {
        score = 40;
      } else if (locationLower.includes(term) || provinceLower.includes(term)) {
        score = 20;
      }
    }

    if (score > 0) {
      const dedupKey = school.name.toLocaleLowerCase();
      if (!seen.has(dedupKey)) {
        seen.add(dedupKey);
        scoredResults.push({ school, score });
      }
    }
  }

  scoredResults.sort((a, b) => b.score - a.score || a.school.name.localeCompare(b.school.name));

  return scoredResults.slice(0, maximum).map((item) => item.school);
};

const recordsForType = (type: string): readonly LocalSchoolRecord[] => {
  let records: readonly LocalSchoolRecord[];
  switch (type) {
    case 'primary':
      records = PRIMARY_SCHOOLS;
      break;
    case 'high':
      records = HIGH_SCHOOLS;
      break;
    case 'poly':
    case 'college':
      records = COLLEGES;
      break;
    case 'university':
      records = UNIVERSITIES;
      break;
    case 'impaired':
      records = IMPAIRED_SCHOOLS;
      break;
    default:
      records = IMPAIRED_TYPES.has(type)
        ? IMPAIRED_SCHOOLS.filter((school) => school.type === type)
        : [];
  }
  return records.filter((school) => CANONICAL_SCHOOL_IDS.has(school.id));
};

const withLocalBanner = (school: LocalSchoolRecord): LocalSchoolRecord => {
  const image = schoolBannerForName(school.name);
  return image && school.image !== image ? { ...school, image } : school;
};

export const schoolsForType = (
  type: string,
  province?: string
): readonly LocalSchoolRecord[] => {
  const records = recordsForType(type);
  const visibleRecords = province ? records.filter((school) => school.province === province) : records;
  return visibleRecords.map(withLocalBanner);
};

export const schoolForId = (schoolId: string): LocalSchoolRecord | undefined =>
  SCHOOLS_BY_ID.has(schoolId) ? withLocalBanner(SCHOOLS_BY_ID.get(schoolId)!) : undefined;

export const schoolForSlug = (slug: string): LocalSchoolRecord | undefined => {
  const school = SCHOOLS_BY_SLUG.get(slug.trim().toLocaleLowerCase());
  return school ? withLocalBanner(school) : undefined;
};

export const canonicalSchoolIdFor = (schoolId: string): string | undefined => {
  const school = schoolForId(schoolId);
  return school ? CANONICAL_SCHOOL_BY_KEY.get(canonicalSchoolKey(school))?.id : undefined;
};

/** Resolve the free-text school name stored on a user profile to its registry row. */
export const schoolForName = (schoolName?: string | null): LocalSchoolRecord | undefined => {
  if (!schoolName) return undefined;
  const requestedName = normaliseSchoolName(schoolName);
  if (!requestedName) return undefined;

  const school = ALL_SCHOOLS.find((school) => normaliseSchoolName(school.name) === requestedName)
    ?? ALL_SCHOOLS.find((school) => {
      const registeredName = normaliseSchoolName(school.name);
      return requestedName.length >= 5
        && (registeredName.includes(requestedName) || requestedName.includes(registeredName));
    });
  return school ? withLocalBanner(school) : undefined;
};

export const SCHOOL_REGISTRY_COUNTS = Object.freeze({
  primary: PRIMARY_SCHOOLS.length,
  high: HIGH_SCHOOLS.length,
  college: COLLEGES.length,
  university: UNIVERSITIES.length,
  impaired: IMPAIRED_SCHOOLS.length,
  total: ALL_SCHOOLS.length,
});

export type { LocalSchoolFees, LocalSchoolRecord } from './types';
