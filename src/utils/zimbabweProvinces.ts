export const PROVINCE_NAMES = [
  'Matabeleland North', 'Bulawayo', 'Matabeleland South', 'Midlands', 'Mashonaland West',
  'Mashonaland Central', 'Harare', 'Mashonaland East', 'Manicaland', 'Masvingo',
] as const;

const key = (value: string) => value.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
const LOOKUP = new Map<string, string>(PROVINCE_NAMES.map((name) => [key(name), name]));

/**
 * Reverse geocoding returns names like "Harare Province" or "Bulawayo
 * Metropolitan Province". Map them onto the canonical province names so that
 * counts recorded under any spelling land in the same bucket.
 */
export const canonicalProvince = (raw: string): string => {
  const cleaned = key(raw).replace(/\b(metropolitan )?province$/, '').replace(/\bmetropolitan$/, '').trim();
  return LOOKUP.get(cleaned) ?? raw;
};
