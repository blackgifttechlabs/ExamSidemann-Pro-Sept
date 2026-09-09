import { readFile, writeFile } from 'node:fs/promises';

// Read-only Drive inventory: rclone lsjson GDrive:examsidemann-recources --files-only -R
const inventoryPath = process.argv[2];
if (!inventoryPath) throw new Error('Usage: node scripts/connectUploadedQuestionPapers.mjs <rclone-inventory.json>');
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const cataloguePath = 'compressed-pdfs/upload-catalogue.json';
const catalogue = JSON.parse(await readFile(cataloguePath, 'utf8'));
const resourcesPath = 'src/data/importedResources.json';
const resources = JSON.parse(await readFile(resourcesPath, 'utf8'));
const manifestPath = 'public/qpandbooks.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const folder = '2026-09-08-compressed-pdfs';
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let added = 0;
for (const item of catalogue.filter((entry) => entry.type === 'past-papers')) {
  const matches = inventory.filter((file) => file.Path === `${folder}/${item.file}`);
  if (matches.length !== 1) throw new Error(`Expected exactly one Drive file for ${item.file}`);
  const file = matches[0];
  if (file.Size !== item.sizeBytes) throw new Error(`Upload size mismatch: ${item.file}`);
  item.driveFileId = file.ID;
  item.url = `https://drive.google.com/file/d/${file.ID}/view`;
  item.status = item.duplicateOf ? 'uploaded_duplicate' : 'connected_to_app';
  manifest[folder] ||= {};
  manifest[folder][item.file] = { type: 'file', name: item.file, size: file.Size, id: file.ID, link: item.url };
  if (item.duplicateOf) continue;
  for (const course of item.courses) {
    const id = `drive-${file.ID}-${slug(course)}`;
    const paperNumber = item.paperCode?.match(/Paper\s*(\d+)/i)?.[1] || (/^\d{4}\/([12])$/.exec(item.paperCode || '')?.[1]);
    const marking = /marking/i.test(item.file);
    const paperType = marking ? `Paper ${paperNumber || '2'} Marking Scheme`
      : /set\s*18/i.test(item.file) ? 'Paper 3 Set 18'
      : paperNumber ? `Paper ${paperNumber}`
      : /questions and answers/i.test(item.file) ? 'Questions and Answers'
      : /multiple sittings/i.test(item.sitting || '') ? 'Question Paper Collection'
      : 'Question Paper';
    const resource = {
      id, title: item.title, type: 'past-papers', course,
      category: course.startsWith('NC') ? 'Polytechnic' : /^Grade/.test(course) ? 'Primary' : course,
      subject: item.subject, board: item.board || 'ZIMSEC', year: item.sitting || 'Practice', paperType,
      url: item.url, fileId: file.ID,
      coverUrl: `https://drive.google.com/thumbnail?id=${file.ID}&sz=w800`,
      size: `${(file.Size / 1048576).toFixed(1)} MB`, author: '',
    };
    const index = resources.findIndex((existing) => existing.id === id);
    if (index < 0) { resources.push(resource); added++; } else resources[index] = resource;
  }
}
await writeFile(resourcesPath, `${JSON.stringify(resources, null, 2)}\n`);
await writeFile(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
console.log(`Connected ${added} course-specific question-paper entries. Duplicate scans are excluded.`);

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const columns = ['file', 'title', 'type', 'courses', 'subject', 'sitting', 'url', 'status', 'notes'];
await writeFile('compressed-pdfs/titles-and-links.csv', `${columns.join(',')}\n${catalogue.map((item) => columns.map((key) => csvCell(key === 'courses' ? item.courses.join('; ') : item[key])).join(',')).join('\n')}\n`);
