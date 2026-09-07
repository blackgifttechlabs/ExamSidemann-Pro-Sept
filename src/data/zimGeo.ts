// Shared Zimbabwe administrative geography used by the school directory,
// the admin registry and the seeder so every surface filters on the same keys.

export const ZIM_PROVINCES = [
  'Bulawayo',
  'Harare',
  'Manicaland',
  'Mashonaland Central',
  'Mashonaland East',
  'Mashonaland West',
  'Masvingo',
  'Matabeleland North',
  'Matabeleland South',
  'Midlands',
] as const;

export type ZimProvince = (typeof ZIM_PROVINCES)[number];

export const slugifyZimbabwePlace = (value: string): string => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const provinceForSlug = (slug?: string): ZimProvince | undefined =>
  ZIM_PROVINCES.find((province) => slugifyZimbabwePlace(province) === slug);

// District names follow the Ministry of Primary & Secondary Education's own
// registry (the 72 education districts), not the civil administrative list —
// Harare and Bulawayo in particular are split into education districts that
// do not match their council wards.
export const ZIM_DISTRICTS: Record<string, string[]> = {
  Bulawayo: ['Bulawayo Central', 'Imbizo', 'Khami', 'Mzilikazi', 'Reigate'],
  Harare: [
    'Chitungwiza',
    'Glenview Mufakose',
    'High Glen',
    'Mabelreign Warren Park',
    'Mabvuku Tafara',
    'Mbare Hatfield',
    'Northern Central',
  ],
  Manicaland: ['Buhera', 'Chimanimani', 'Chipinge', 'Makoni', 'Mutare', 'Mutasa', 'Nyanga'],
  'Mashonaland Central': ['Bindura', 'Guruve', 'Mazowe', 'Mbire', 'Mount Darwin', 'Muzarabani', 'Rushinga', 'Shamva'],
  'Mashonaland East': ['Chikomba', 'Goromonzi', 'Hwedza', 'Marondera', 'Mudzi', 'Murehwa', 'Mutoko', 'Seke', 'Uzumba-Maramba-Pfungwe'],
  'Mashonaland West': ['Chegutu', 'Hurungwe', 'Kariba', 'Makonde', 'Mhondoro-Ngezi', 'Sanyati', 'Zvimba'],
  Masvingo: ['Bikita', 'Chiredzi', 'Chivi', 'Gutu', 'Masvingo', 'Mwenezi', 'Zaka'],
  'Matabeleland North': ['Binga', 'Bubi', 'Hwange', 'Lupane', 'Nkayi', 'Tsholotsho', 'Umguza'],
  'Matabeleland South': ['Beitbridge', 'Bulilima', 'Gwanda', 'Insiza', 'Mangwe', 'Matobo', 'Umzingwane'],
  Midlands: ['Chirumhanzu', 'Gokwe North', 'Gokwe South', 'Gweru', 'Kwekwe', 'Mberengwa', 'Shurugwi', 'Zvishavane'],
};

// Province centroids — used to frame the map before a school's own
// coordinates are known, and as a fallback for records without a fix.
export const PROVINCE_CENTRES: Record<string, { lat: number; lng: number }> = {
  Bulawayo: { lat: -20.1594, lng: 28.5886 },
  Harare: { lat: -17.8252, lng: 31.0335 },
  Manicaland: { lat: -18.9707, lng: 32.6709 },
  'Mashonaland Central': { lat: -17.3019, lng: 31.3314 },
  'Mashonaland East': { lat: -18.1853, lng: 31.5514 },
  'Mashonaland West': { lat: -17.3667, lng: 30.2 },
  Masvingo: { lat: -20.0637, lng: 30.8277 },
  'Matabeleland North': { lat: -18.3646, lng: 26.5 },
  'Matabeleland South': { lat: -20.9394, lng: 29.0 },
  Midlands: { lat: -19.45, lng: 29.8167 },
};

// Approximate centre of each education district. The school register carries
// no per-school survey coordinates, so these are what the map falls back to —
// always presented as district-level, never as the school's exact position.
export const DISTRICT_CENTRES: Record<string, { lat: number; lng: number }> = {
  'Bulawayo Central': { lat: -20.15, lng: 28.5833 },
  Imbizo: { lat: -20.2, lng: 28.55 },
  Khami: { lat: -20.14, lng: 28.5 },
  Mzilikazi: { lat: -20.14, lng: 28.57 },
  Reigate: { lat: -20.17, lng: 28.56 },

  Chitungwiza: { lat: -18.0128, lng: 31.0756 },
  'Glenview Mufakose': { lat: -17.88, lng: 30.98 },
  'High Glen': { lat: -17.89, lng: 31.01 },
  'Mabelreign Warren Park': { lat: -17.81, lng: 30.98 },
  'Mabvuku Tafara': { lat: -17.83, lng: 31.17 },
  'Mbare Hatfield': { lat: -17.86, lng: 31.04 },
  'Northern Central': { lat: -17.78, lng: 31.07 },

  Buhera: { lat: -19.3, lng: 31.45 },
  Chimanimani: { lat: -19.8, lng: 32.8667 },
  Chipinge: { lat: -20.19, lng: 32.62 },
  Makoni: { lat: -18.53, lng: 32.12 },
  Mutare: { lat: -18.9707, lng: 32.6709 },
  Mutasa: { lat: -18.7, lng: 32.75 },
  Nyanga: { lat: -18.2167, lng: 32.75 },

  Bindura: { lat: -17.3019, lng: 31.3314 },
  Guruve: { lat: -16.65, lng: 30.7 },
  Mazowe: { lat: -17.51, lng: 30.97 },
  Mbire: { lat: -16.05, lng: 30.8 },
  'Mount Darwin': { lat: -16.77, lng: 31.58 },
  Muzarabani: { lat: -16.38, lng: 31.03 },
  Rushinga: { lat: -16.75, lng: 32.15 },
  Shamva: { lat: -17.32, lng: 31.57 },

  Chikomba: { lat: -18.95, lng: 31.15 },
  Goromonzi: { lat: -17.87, lng: 31.35 },
  Hwedza: { lat: -18.63, lng: 31.58 },
  Marondera: { lat: -18.1853, lng: 31.5514 },
  Mudzi: { lat: -17.0, lng: 32.6 },
  Murehwa: { lat: -17.65, lng: 31.78 },
  Mutoko: { lat: -17.4, lng: 32.22 },
  Seke: { lat: -18.1, lng: 31.05 },
  'Uzumba-Maramba-Pfungwe': { lat: -17.1, lng: 32.0 },

  Chegutu: { lat: -18.13, lng: 30.15 },
  Hurungwe: { lat: -16.8167, lng: 29.6833 },
  Kariba: { lat: -16.52, lng: 28.8 },
  Makonde: { lat: -17.3667, lng: 30.2 },
  'Mhondoro-Ngezi': { lat: -18.4, lng: 30.2 },
  Sanyati: { lat: -18.33, lng: 29.92 },
  Zvimba: { lat: -17.6, lng: 30.5 },

  Bikita: { lat: -20.08, lng: 31.4 },
  Chiredzi: { lat: -21.05, lng: 31.6667 },
  Chivi: { lat: -20.32, lng: 30.58 },
  Gutu: { lat: -19.65, lng: 31.15 },
  Masvingo: { lat: -20.0637, lng: 30.8277 },
  Mwenezi: { lat: -21.3, lng: 30.7 },
  Zaka: { lat: -20.34, lng: 31.44 },

  Binga: { lat: -17.62, lng: 27.34 },
  Bubi: { lat: -19.6, lng: 28.6 },
  Hwange: { lat: -18.3646, lng: 26.4979 },
  Lupane: { lat: -18.9315, lng: 27.807 },
  Nkayi: { lat: -19.0, lng: 28.9 },
  Tsholotsho: { lat: -19.76, lng: 27.76 },
  Umguza: { lat: -19.9, lng: 28.4 },

  Beitbridge: { lat: -22.2167, lng: 30.0 },
  Bulilima: { lat: -20.4, lng: 27.7 },
  Gwanda: { lat: -20.9394, lng: 29.0 },
  Insiza: { lat: -20.2, lng: 29.2 },
  Mangwe: { lat: -20.5, lng: 27.8 },
  Matobo: { lat: -20.6, lng: 28.5 },
  Umzingwane: { lat: -20.33, lng: 28.93 },

  Chirumhanzu: { lat: -19.65, lng: 30.5 },
  'Gokwe North': { lat: -17.9, lng: 28.8 },
  'Gokwe South': { lat: -18.21, lng: 28.93 },
  Gweru: { lat: -19.4614, lng: 29.8022 },
  Kwekwe: { lat: -18.9281, lng: 29.8149 },
  Mberengwa: { lat: -20.47, lng: 29.9 },
  Shurugwi: { lat: -19.6704, lng: 30.0072 },
  Zvishavane: { lat: -20.3292, lng: 30.0703 },
};

/** Best known position for a place: its district centre, else the province. */
export const centreFor = (province?: string | null, district?: string | null) =>
  (district && DISTRICT_CENTRES[district]) ||
  (province && PROVINCE_CENTRES[province]) ||
  PROVINCE_CENTRES.Harare;

export const INSTITUTION_TYPES = [
  { id: 'primary', label: 'Primary Schools', short: 'Primary' },
  { id: 'high', label: 'High Schools', short: 'High School' },
  { id: 'poly', label: 'Colleges & Polytechnics', short: 'College' },
  { id: 'university', label: 'Universities', short: 'University' },
  { id: 'blind', label: 'Blind & Visually Impaired', short: 'Specialised' },
  { id: 'deaf', label: 'Deaf & Hearing Impaired', short: 'Specialised' },
  { id: 'autism', label: 'Intellectual & Autism', short: 'Specialised' },
  { id: 'physical', label: 'Physical Disabilities', short: 'Specialised' },
] as const;

export type InstitutionTypeId = (typeof INSTITUTION_TYPES)[number]['id'];

export const districtsFor = (province?: string | null): string[] =>
  (province && ZIM_DISTRICTS[province]) || [];

export const provinceForDistrict = (district: string): string | undefined =>
  ZIM_PROVINCES.find((province) => ZIM_DISTRICTS[province]?.includes(district));

export const districtForSlug = (province: string | undefined, slug?: string): string | undefined =>
  province
    ? districtsFor(province).find((district) => slugifyZimbabwePlace(district) === slug)
    : undefined;

export const labelForType = (typeId?: string): string =>
  INSTITUTION_TYPES.find((item) => item.id === typeId)?.label || 'Institutions';

export const shortLabelForType = (typeId?: string): string =>
  INSTITUTION_TYPES.find((item) => item.id === typeId)?.short || 'Institution';
