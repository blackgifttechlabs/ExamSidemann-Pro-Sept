import { auth } from './firebase';

// Base64 expands each chunk by roughly one third. Two binary megabytes keep
// the complete JSON request below Vercel Functions' 4.5 MB payload ceiling.
const CHUNK_SIZE = 2 * 1024 * 1024;
export const MAX_RESOURCE_FILE_SIZE = 100 * 1024 * 1024;
export const RESOURCE_FILE_ACCEPT = '.pdf,.doc,.docx,.epub,.ppt,.pptx,.xls,.xlsx,.txt,.zip';

export interface StoredResourceFile {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
}

const callAdminResourceApi = async <T>(path: string, body: unknown): Promise<T> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in again before uploading administrator resources.');
  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const responseText = await response.text();
  let result: any = {};
  try {
    result = responseText ? JSON.parse(responseText) : {};
  } catch {
    result = {};
  }
  if (!response.ok) {
    const plainTextError = responseText
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 240);
    throw new Error(typeof result?.error === 'string'
      ? result.error
      : plainTextError || `Upload service failed (HTTP ${response.status}).`);
  }
  return result as T;
};

const blobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(reader.error || new Error('Could not read the selected file.'));
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : '';
    const comma = result.indexOf(',');
    if (comma === -1) reject(new Error('Could not encode the selected file.'));
    else resolve(result.slice(comma + 1));
  };
  reader.readAsDataURL(blob);
});

const createFileId = () => {
  const random = new Uint32Array(2);
  crypto.getRandomValues(random);
  return `resource_${Date.now().toString(36)}_${Array.from(random, n => n.toString(16).padStart(8, '0')).join('')}`;
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const uploadAdminResourceFile = async (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<StoredResourceFile> => {
  if (!file.size) throw new Error('The selected file is empty.');
  if (file.size > MAX_RESOURCE_FILE_SIZE) {
    throw new Error(`The selected file is larger than ${formatFileSize(MAX_RESOURCE_FILE_SIZE)}.`);
  }

  const fileId = createFileId();
  let result: StoredResourceFile | null = null;
  onProgress?.(0);

  try {
    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
      const endExclusive = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBase64 = await blobToBase64(file.slice(start, endExclusive));
      result = await callAdminResourceApi<StoredResourceFile & { complete: boolean }>('/api/admin-resources/upload/', {
        fileId,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        chunkBase64,
        start,
        end: endExclusive - 1,
        total: file.size,
      });
      onProgress?.(Math.round((endExclusive / file.size) * 100));
    }
  } catch (error) {
    // A failed resumable upload may have left a partial Appwrite file.
    await callAdminResourceApi('/api/admin-resources/delete/', { fileId }).catch(() => undefined);
    throw error;
  }

  if (!result) throw new Error('Appwrite did not return an uploaded file.');
  return result;
};

export const deleteAdminResourceFile = async (fileId: string) => {
  if (!fileId) return;
  await callAdminResourceApi('/api/admin-resources/delete/', { fileId });
};
