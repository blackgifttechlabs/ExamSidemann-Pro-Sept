import {
  getPastPaperSubjectPath,
  PastPaperRecord,
  slugifyPastPaperValue,
} from './pastPaperSeo';
import {
  inferResourceCourse,
  inferResourceSubject,
  isLikelyQuestionPaper,
  manifestFilesUnder,
  readableResourceName,
  ResourceManifest,
} from '../services/resourceManifest';

const paperYearFromName = (fileName: string) => {
  const name = readableResourceName(fileName);
  const range = name.match(/\b(20\d{2})\s*(?:-|to)\s*(20\d{2})\b/i);
  if (range) return `${range[1]}–${range[2]}`;
  return name.match(/\b(?:19|20)\d{2}\b/)?.[0] || 'Past paper';
};

const paperTypeFromName = (fileName: string) => {
  const name = readableResourceName(fileName);
  const paper = name.match(/\bpaper\s*([1-6])\b/i) || name.match(/\bp\s*([1-6])\b/i);
  if (/\b(?:answers?|marking\s*(?:guide|scheme))\b/i.test(name)) {
    return paper ? `Paper ${paper[1]} answers` : 'Answers';
  }
  return paper ? `Paper ${paper[1]}` : 'Past paper';
};

export const runtimePastPaperPath = (
  source: 'manifest' | 'upload',
  id: string,
  course: string,
  subject: string,
) => `${getPastPaperSubjectPath(course, subject)}${source}-${slugifyPastPaperValue(id)}/`;

export const manifestPastPapers = (
  manifest: ResourceManifest,
  excludedFileIds: Set<string> = new Set(),
): PastPaperRecord[] => manifestFilesUnder(manifest, 'new-resources')
  .filter((file) => (
    /\.pdf$/i.test(file.name)
    && isLikelyQuestionPaper(file.name)
    && !excludedFileIds.has(file.id)
  ))
  .map((file) => {
    const course = inferResourceCourse(file.name, 'Grade 7');
    const subject = inferResourceSubject(file.name);
    return {
      id: `manifest-paper-${file.id}`,
      level: /^Grade\s+[1-7]$/i.test(course) ? 'Primary' : course,
      sublevel: course,
      subject,
      year: paperYearFromName(file.name),
      type: paperTypeFromName(file.name),
      fileId: file.id,
      course,
      url: file.link,
      name: readableResourceName(file.name),
      board: 'ZIMSEC',
      rightsVerified: false,
      detailPath: runtimePastPaperPath('manifest', file.id, course, subject),
    };
  });

export const uploadedPastPaper = (id: string, data: Record<string, any>): PastPaperRecord | undefined => {
  const name = String(data.name || data.title || data.fileName || 'Untitled document');
  const course = inferResourceCourse(String(data.course || name), String(data.course || 'Grade 7'));
  const subject = String(data.subject || inferResourceSubject(name));
  const url = String(data.url || data.link || data.downloadURL || '');
  if (!course || !subject || !url || data.approved !== true) return undefined;
  return {
    id,
    level: /^Grade\s+[1-7]$/i.test(course) ? 'Primary' : course,
    sublevel: course,
    subject,
    year: String(data.year || paperYearFromName(name)),
    type: String(data.paperType || paperTypeFromName(name)),
    fileId: String(data.appwriteFileId || data.fileId || ''),
    course,
    url,
    name,
    board: String(data.board || 'ZIMSEC'),
    rightsVerified: false,
    detailPath: runtimePastPaperPath('upload', id, course, subject),
  };
};

export const paperMatchesRoute = (
  paper: PastPaperRecord,
  courseSlug?: string,
  subjectSlug?: string,
  paperSlug?: string,
) => {
  const parts = paper.detailPath?.split('/').filter(Boolean);
  return parts?.[1] === courseSlug && parts?.[2] === subjectSlug && parts?.[3] === paperSlug;
};
