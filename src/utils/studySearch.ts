import { GLOBAL_SEARCH_DB } from '../data/constants';
import { subjectAliasesFor, levelAliasesFor, programmeAliasesFor } from '../data/seoKeywords';

export const normalizeStudySearch = (value: string) => value.toLowerCase()
  .replace(/\b([a-z])\.([a-z])\.(?:([a-z])\.)?/g, (_, a, b, c) => a + b + (c || ''))
  .replace(/&/g, ' and ').replace(/polytechinc/g, 'polytechnic')
  .replace(/algorithims|algorithim|algoritms/g, 'algorithms')
  .replace(/[^a-z0-9]+/g, ' ').trim();

export const subjectShortcutsFor = (title: string) => {
  const name = normalizeStudySearch(title.replace(/\([^)]*\)/g, ''));
  const initials = name.split(' ').filter(word => !['and', 'of', 'the', 'in', 'to', 'for'].includes(word)).map(word => word[0]).join('');
  return [...subjectAliasesFor(title), ...(initials.length > 1 ? [initials] : []),
    ...(title === 'Computer Science' ? ['CS', 'Comp Sci'] : [])];
};

export const searchStudyCatalog = (query: string) => {
  const words = normalizeStudySearch(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  return GLOBAL_SEARCH_DB.filter(item => {
    const text = normalizeStudySearch([
      item.title, item.description, item.type, item.levelName, item.levelCategory,
      ...subjectShortcutsFor(item.title), ...levelAliasesFor(item.levelName, item.levelCategory),
      ...programmeAliasesFor(item.levelName),
    ].join(' '));
    return words.every(word => word.length <= 3 ? text.split(' ').includes(word) : text.includes(word));
  }).sort((a, b) => {
    const shortcut = normalizeStudySearch(query);
    const preferred = (item: typeof a) => item.title === 'Computer Science' && shortcut === 'cs' ? 2
      : Number(subjectShortcutsFor(item.title).some(alias => normalizeStudySearch(alias) === shortcut));
    return preferred(b) - preferred(a) || Number(b.type === 'Subject') - Number(a.type === 'Subject');
  });
};
