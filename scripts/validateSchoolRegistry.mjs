import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = resolve(SCRIPT_DIR, '../src/data/schoolRegistry');

const categories = {
  primary: {
    fileName: 'primarySchools.ts',
    allowedTypes: new Set(['primary']),
  },
  high: {
    fileName: 'highSchools.ts',
    allowedTypes: new Set(['high']),
  },
  college: {
    fileName: 'colleges.ts',
    allowedTypes: new Set(['poly', 'college']),
  },
  university: {
    fileName: 'universities.ts',
    allowedTypes: new Set(['university']),
  },
  impaired: {
    fileName: 'impairedSchools.ts',
    allowedTypes: new Set(['blind', 'deaf', 'autism', 'physical', 'impaired']),
  },
};

const readGeneratedArray = async (fileName) => {
  const source = await readFile(resolve(REGISTRY_DIR, fileName), 'utf8');
  const start = source.indexOf('= [');
  const end = source.lastIndexOf(' as unknown as readonly LocalSchoolRecord[];');
  if (start < 0 || end < 0) throw new Error(`${fileName} is not a generated registry module.`);
  return JSON.parse(source.slice(start + 2, end));
};

const seenIds = new Map();
const counts = {};

for (const [categoryName, category] of Object.entries(categories)) {
  const records = await readGeneratedArray(category.fileName);
  counts[categoryName] = records.length;

  for (const record of records) {
    if (!record.id || !record.name) {
      throw new Error(`${category.fileName} contains a record without an id or name.`);
    }
    if (!category.allowedTypes.has(record.type)) {
      throw new Error(
        `${record.name} (${record.id}) has type "${record.type}" inside ${category.fileName}.`
      );
    }
    if (seenIds.has(record.id)) {
      throw new Error(
        `Duplicate id ${record.id} appears in ${seenIds.get(record.id)} and ${category.fileName}.`
      );
    }
    seenIds.set(record.id, category.fileName);
  }
}

counts.total = seenIds.size;
console.log('School registry validation passed:', counts);
