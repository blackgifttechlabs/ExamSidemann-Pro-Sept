import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ID = 'testing-3d5b2';
const API_KEY = 'AIzaSyB8Tg1JSxd_DWX5b99pSPIZHECPwBBxnrE';
const COLLECTION = 'schools';
const PAGE_SIZE = 300;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(SCRIPT_DIR, '../src/data/schoolRegistry');

const CATEGORY_FILES = {
  primary: {
    fileName: 'primarySchools.ts',
    exportName: 'PRIMARY_SCHOOLS',
    sourceTypes: new Set(['primary']),
  },
  high: {
    fileName: 'highSchools.ts',
    exportName: 'HIGH_SCHOOLS',
    sourceTypes: new Set(['high']),
  },
  college: {
    fileName: 'colleges.ts',
    exportName: 'COLLEGES',
    sourceTypes: new Set(['poly', 'college']),
  },
  university: {
    fileName: 'universities.ts',
    exportName: 'UNIVERSITIES',
    sourceTypes: new Set(['university']),
  },
  impaired: {
    fileName: 'impairedSchools.ts',
    exportName: 'IMPAIRED_SCHOOLS',
    sourceTypes: new Set(['blind', 'deaf', 'autism', 'physical', 'impaired']),
  },
};

const decodeValue = (value = {}) => {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('bytesValue' in value) return value.bytesValue;
  if ('geoPointValue' in value) return value.geoPointValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  throw new Error(`Unsupported Firestore value: ${JSON.stringify(value)}`);
};

const decodeFields = (fields) =>
  Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));

const fetchAllSchools = async () => {
  const records = [];
  let pageToken = '';

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`
    );
    url.searchParams.set('key', API_KEY);
    url.searchParams.set('pageSize', String(PAGE_SIZE));
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Firestore export failed (${response.status}): ${await response.text()}`);
    }

    const page = await response.json();
    for (const document of page.documents || []) {
      records.push({
        id: document.name.slice(document.name.lastIndexOf('/') + 1),
        ...decodeFields(document.fields || {}),
      });
    }
    pageToken = page.nextPageToken || '';
    process.stdout.write(`\rRead ${records.length.toLocaleString()} school records...`);
  } while (pageToken);

  process.stdout.write('\n');
  return records;
};

const categoryFor = (record) =>
  Object.entries(CATEGORY_FILES).find(([, category]) => category.sourceTypes.has(record.type))?.[0];

const compareRecords = (first, second) =>
  String(first.name || '').localeCompare(String(second.name || '')) ||
  String(first.province || '').localeCompare(String(second.province || '')) ||
  String(first.id).localeCompare(String(second.id));

const renderModule = (exportName, records) => `// AUTO-GENERATED from the live Firestore schools collection.
// Do not hand-edit. Run: node scripts/exportSchoolRegistry.mjs

import type { LocalSchoolRecord } from './types';

export const ${exportName} = ${JSON.stringify(records, null, 2)} as unknown as readonly LocalSchoolRecord[];
`;

const main = async () => {
  const records = await fetchAllSchools();
  const unknown = records.filter((record) => !categoryFor(record));
  if (unknown.length) {
    const types = [...new Set(unknown.map((record) => String(record.type)))].sort();
    throw new Error(
      `Refusing to omit ${unknown.length} record(s) with unsupported type(s): ${types.join(', ')}`
    );
  }

  const grouped = Object.fromEntries(
    Object.keys(CATEGORY_FILES).map((category) => [
      category,
      records.filter((record) => categoryFor(record) === category).sort(compareRecords),
    ])
  );

  const typeCounts = records.reduce((counts, record) => {
    counts[record.type] = (counts[record.type] || 0) + 1;
    return counts;
  }, {});
  console.log('Firestore type counts:', typeCounts);
  console.log(
    'Local file counts:',
    Object.fromEntries(Object.entries(grouped).map(([category, values]) => [category, values.length]))
  );

  if (process.argv.includes('--dry-run')) return;

  await mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all(
    Object.entries(CATEGORY_FILES).map(([category, config]) =>
      writeFile(
        resolve(OUTPUT_DIR, config.fileName),
        renderModule(config.exportName, grouped[category]),
        'utf8'
      )
    )
  );
  console.log(`Wrote ${records.length.toLocaleString()} records to ${OUTPUT_DIR}`);
};

await main();
