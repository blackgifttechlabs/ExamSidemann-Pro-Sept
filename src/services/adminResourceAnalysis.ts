import mammoth from 'mammoth';
import { auth } from './firebase';

export interface ResourceAnalysisSuggestion {
  title: string;
  type: 'syllabi' | 'library' | 'past-papers';
  course: string;
  subject: string;
  year: string;
  session: 'June' | 'November' | '';
}

const readablePdfStrings = async (file: File) => {
  const bytes = new Uint8Array(await file.slice(0, 2 * 1024 * 1024).arrayBuffer());
  const raw = new TextDecoder('latin1').decode(bytes);
  return Array.from(raw.matchAll(/\(([^()]{4,180})\)/g))
    .map(match => match[1].replace(/\\[nrt]/g, ' ').replace(/\\([()\\])/g, '$1'))
    .filter(value => /[A-Za-z]{3}/.test(value))
    .join(' ');
};

const extractText = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLocaleLowerCase();
  try {
    if (extension === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return result.value.slice(0, 12_000);
    }
    if (extension === 'txt') return (await file.text()).slice(0, 12_000);
    if (extension === 'pdf') return (await readablePdfStrings(file)).slice(0, 12_000);
  } catch (error) {
    console.warn('Could not extract resource text for AI prefill.', error);
  }
  return '';
};

export const titleFromFileName = (fileName: string) => fileName
  .replace(/\.[^.]+$/, '')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const analyzeAdminResource = async (
  file: File,
  currentType: ResourceAnalysisSuggestion['type'],
  levels: string[],
): Promise<ResourceAnalysisSuggestion> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in again before using AI resource analysis.');
  const [token, textExcerpt] = await Promise.all([user.getIdToken(), extractText(file)]);
  const response = await fetch('/api/admin-resources/analyze/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName: file.name, textExcerpt, currentType, levels }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof result?.error === 'string' ? result.error : 'AI could not analyze this resource.');
  }
  return result as ResourceAnalysisSuggestion;
};
