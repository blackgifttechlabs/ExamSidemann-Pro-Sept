export type ManifestFile = {
  type: 'file';
  name: string;
  size: number;
  id: string;
  link: string;
};

export type ResourceManifest = Record<string, unknown>;

export type ManifestFileEntry = ManifestFile & { path: string };

/** Small local artwork shown immediately while remote cover images arrive. */
export const PDF_IMAGE_PLACEHOLDER = '/images/other-icons/pdf%20image.jpg';

let manifestPromise: Promise<ResourceManifest> | undefined;

/** Load the Drive-backed book and question-paper index shipped in public/. */
export const loadResourceManifest = () => {
  if (!manifestPromise) {
    // The service worker keeps a durable copy and refreshes it when online.
    manifestPromise = fetch('/qpandbooks.json').then(async (response) => {
      if (!response.ok) throw new Error(`Could not load resource manifest (${response.status})`);
      return response.json() as Promise<ResourceManifest>;
    });
  }
  return manifestPromise;
};

/** Return every file below a manifest folder, including files added after build time. */
export const manifestFilesUnder = (
  manifest: ResourceManifest,
  folderName: string,
): ManifestFileEntry[] => {
  const root = manifest[folderName];
  if (!root || typeof root !== 'object') return [];

  const files: ManifestFileEntry[] = [];
  const visit = (value: unknown, path: string[]) => {
    if (!value || typeof value !== 'object') return;
    const candidate = value as Partial<ManifestFile>;
    if (candidate.type === 'file' && typeof candidate.id === 'string' && typeof candidate.link === 'string') {
      files.push({ ...(candidate as ManifestFile), path: [folderName, ...path].join('/') });
      return;
    }
    Object.entries(value as Record<string, unknown>).forEach(([name, child]) => visit(child, [...path, name]));
  };

  visit(root, []);
  return files;
};

export const readableResourceName = (fileName: string) => fileName
  .replace(/\.[^.]+$/, '')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const formattedResourceSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** unit);
  return `${value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
};

export const isLikelyQuestionPaper = (fileName: string) => (
  /\b(?:past\s*exam|papers?|p\s*[1-6]|answers?|marking\s*(?:guide|scheme)|specimen)\b/i.test(readableResourceName(fileName))
);

export const inferResourceSubject = (fileName: string) => {
  const name = readableResourceName(fileName).toLowerCase();
  if (name.includes('agriculture')) return 'Agriculture, Science and Technology';
  if (name.includes('social science')) return 'Social Science';
  if (name.includes('general paper')) return 'General Paper';
  if (name.includes('combined science')) return 'Combined Science';
  if (name.includes('computer science')) return 'Computer Science';
  if (/\b(?:maths|mathematics)\b/.test(name)) return 'Mathematics';
  if (name.includes('biology')) return 'Biology';
  if (name.includes('chemistry')) return 'Chemistry';
  if (name.includes('physics')) return 'Physics';
  if (name.includes('english')) return 'English';
  return 'General';
};

export const inferResourceCourse = (fileName: string, fallback = "O' Level") => {
  const name = readableResourceName(fileName);
  const grade = name.match(/\bgrade\s*([1-7])\b/i);
  if (grade) return `Grade ${grade[1]}`;
  const form = name.match(/\bform\s*([1-4])\b/i);
  if (form) return `Form ${form[1]}`;
  if (/\b(?:a[ -]?level|advanced level|lower 6|upper 6)\b/i.test(name)) return "A' Level";
  if (/\b(?:o[ -]?level|ordinary level)\b/i.test(name)) return "O' Level";
  return fallback;
};

const manifestPath = (publicUrl: string) => {
  try {
    const pathname = new URL(publicUrl, window.location.origin).pathname;
    return decodeURIComponent(pathname).split('/').filter(Boolean);
  } catch {
    return decodeURIComponent(publicUrl.split(/[?#]/, 1)[0]).split('/').filter(Boolean);
  }
};

export const manifestFileFor = (
  manifest: ResourceManifest,
  publicUrl: string,
): ManifestFile | undefined => {
  let current: unknown = manifest;
  for (const segment of manifestPath(publicUrl)) {
    if (!current || typeof current !== 'object' || !(segment in current)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  if (!current || typeof current !== 'object') return undefined;
  const candidate = current as Partial<ManifestFile>;
  return candidate.type === 'file' && typeof candidate.link === 'string' && typeof candidate.id === 'string'
    ? candidate as ManifestFile
    : undefined;
};

/** Replace an old public asset path with the matching Drive URL. */
export const resourceUrlFromManifest = (
  manifest: ResourceManifest,
  publicUrl: string,
) => manifestFileFor(manifest, publicUrl)?.link || publicUrl;

/** Google Drive's image endpoint works in an img element; the normal /view URL does not. */
export const resourceImageUrlFromManifest = (
  manifest: ResourceManifest,
  publicUrl: string,
) => {
  const file = manifestFileFor(manifest, publicUrl);
  return file ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(file.id)}&sz=w800` : publicUrl;
};
