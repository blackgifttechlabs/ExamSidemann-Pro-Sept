import type { FileSystemTree } from '@webcontainer/api';

export type CachedCodeAgentProject = {
  id: string;
  name: string;
  fileCount: number;
  updatedAt: number;
  files: Record<string, string>;
  openTabs: string[];
  selectedFile: string | null;
  messages: Array<{ id: string; role: 'assistant' | 'user'; text: string }>;
  activities: Array<{
    id: string;
    tool: 'list_directory' | 'read_file' | 'write_file' | 'search_folder' | 'run_command';
    label: string;
    detail: string;
    status: 'running' | 'done' | 'error';
    type?: 'tool' | 'command' | 'file_edit';
    linesAdded?: number;
    linesRemoved?: number;
    oldContent?: string;
    newContent?: string;
    input?: string;
    output?: string;
  }>;
};

const DB_NAME = 'black-tonet-workspaces';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

const openDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Could not open the project cache.'));
});

export const listCachedCodeAgentProjects = async (): Promise<CachedCodeAgentProject[]> => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as CachedCodeAgentProject[]).sort((a, b) => b.updatedAt - a.updatedAt));
    request.onerror = () => reject(request.error);
  });
};

export const saveCachedCodeAgentProject = async (project: CachedCodeAgentProject): Promise<void> => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(project);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteCachedCodeAgentProject = async (projectId: string): Promise<void> => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(projectId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const fileMapToWebContainerTree = (files: Record<string, string>): FileSystemTree => {
  const tree: FileSystemTree = {};
  for (const [path, contents] of Object.entries(files)) {
    const parts = path.split('/').filter(Boolean);
    let cursor = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = { file: { contents } };
        return;
      }
      const existing = cursor[part];
      if (!existing || !('directory' in existing)) cursor[part] = { directory: {} };
      cursor = (cursor[part] as { directory: FileSystemTree }).directory;
    });
  }
  return tree;
};

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index++) {
    let value = index;
    for (let bit = 0; bit < 8; bit++) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    table[index] = value >>> 0;
  }
  return table;
})();

const crc32 = (bytes: Uint8Array) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const zipDateTime = (date: Date) => ({
  time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  date: ((Math.max(date.getFullYear(), 1980) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
});

/** Creates a standards-compatible, uncompressed ZIP entirely in the browser. */
export const downloadCodeAgentProjectZip = (projectName: string, files: Record<string, string>) => {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let localOffset = 0;
  const now = zipDateTime(new Date());

  for (const [rawPath, contents] of Object.entries(files)) {
    const path = rawPath.replace(/^\/+/, '');
    if (!path) continue;
    const name = encoder.encode(path);
    const data = encoder.encode(contents);
    const checksum = crc32(data);

    const local = new Uint8Array(30 + name.length + data.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, now.time, true);
    localView.setUint16(12, now.date, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(data, 30 + name.length);
    localParts.push(local);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, now.time, true);
    centralView.setUint16(14, now.date, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, localOffset, true);
    central.set(name, 46);
    centralParts.push(central);
    localOffset += local.length;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, centralParts.length, true);
  endView.setUint16(10, centralParts.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, localOffset, true);

  const blob = new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${projectName.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '') || 'black-tonet-project'}.zip`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
};
