import { useSyncExternalStore } from 'react';
import { trackPwaEvent } from './analytics';
import { requestPersistentStorage } from './offlineStorage';

export type OfflineLibraryState = {
  status: 'unknown' | 'idle' | 'downloading' | 'ready' | 'failed' | 'no-storage';
  completed: number;
  total: number;
  bytes: number;
  requiredBytes?: number;
};

const LIBRARY_CACHE = 'exam-sidemann-library-v1';
const MANIFEST_URL = '/__exam-sidemann-library-manifest__';

let state: OfflineLibraryState = { status: 'unknown', completed: 0, total: 0, bytes: 0 };
const listeners = new Set<() => void>();

const setState = (next: Partial<OfflineLibraryState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const handleWorkerMessage = (event: MessageEvent) => {
  const data = event.data as Record<string, any> | undefined;
  switch (data?.type) {
    case 'OFFLINE_LIBRARY_PROGRESS':
      setState({ status: 'downloading', completed: data.completed, total: data.total, bytes: data.bytes });
      break;
    case 'OFFLINE_LIBRARY_READY':
      setState({ status: 'ready', completed: data.assetCount, total: data.assetCount, bytes: data.bytes });
      void trackPwaEvent('library_ready');
      break;
    case 'OFFLINE_LIBRARY_INCOMPLETE':
      setState({ status: 'failed', completed: data.completed, total: data.total });
      void trackPwaEvent('library_failed');
      break;
    case 'OFFLINE_LIBRARY_UNAVAILABLE':
      if (data.reason === 'insufficient-storage') {
        setState({ status: 'no-storage', requiredBytes: data.requiredBytes });
        void trackPwaEvent('library_no_storage');
      } else {
        setState({ status: 'failed' });
        void trackPwaEvent('library_failed');
      }
      break;
  }
};

const detectExistingLibrary = async () => {
  try {
    const cache = await caches.open(LIBRARY_CACHE);
    const manifest = await cache.match(MANIFEST_URL);
    const info = await manifest?.json().catch(() => undefined);
    setState(info?.ready
      ? { status: 'ready', completed: info.assetCount, total: info.assetCount, bytes: info.bytes }
      : { status: 'idle' });
  } catch {
    setState({ status: 'idle' });
  }
};

let started = false;
/** Listens for service-worker progress messages. Safe to call more than once. */
export const initOfflineLibrary = () => {
  if (started || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  started = true;
  navigator.serviceWorker.addEventListener('message', handleWorkerMessage);
  void detectExistingLibrary();
};

/** Starts the full-library download. Only ever called from an explicit user action. */
export const startOfflineLibraryDownload = async () => {
  if (!('serviceWorker' in navigator)) return;
  initOfflineLibrary();
  setState({ status: 'downloading', completed: 0, total: 0 });
  void trackPwaEvent('library_started');
  void requestPersistentStorage();
  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({ type: 'DOWNLOAD_OFFLINE_LIBRARY' });
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const useOfflineLibrary = () => {
  initOfflineLibrary();
  return useSyncExternalStore(subscribe, () => state, () => state);
};
