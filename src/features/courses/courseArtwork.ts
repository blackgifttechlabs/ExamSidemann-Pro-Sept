import type { AcademicLevel } from '../../data/constants';

const illustration = (name: string) => `/images/courses/illustrations/${name}.webp`;

export const COURSE_ARTWORK = {
  junior: illustration('junior'),
  ordinary: illustration('ordinary'),
  advanced: illustration('advanced'),
  it: illustration('it'),
  autoElectrics: illustration('auto-electrics'),
  records: illustration('records'),
  purchasing: illustration('purchasing'),
  banking: illustration('banking'),
};

/** School pupils progress in age; vocational students wear industry clothing. */
export const courseArtwork = (level: Pick<AcademicLevel, 'name' | 'category'>) => {
  if (level.category === 'ZJC') return COURSE_ARTWORK.junior;
  if (level.category === "O' Level") return COURSE_ARTWORK.ordinary;
  if (level.category === "A' Level") return COURSE_ARTWORK.advanced;
  if (level.name.includes('Auto Electrics')) return COURSE_ARTWORK.autoElectrics;
  if (level.name.includes('Records')) return COURSE_ARTWORK.records;
  if (level.name.includes('Purchasing')) return COURSE_ARTWORK.purchasing;
  if (level.name.includes('Banking')) return COURSE_ARTWORK.banking;
  return COURSE_ARTWORK.it;
};
