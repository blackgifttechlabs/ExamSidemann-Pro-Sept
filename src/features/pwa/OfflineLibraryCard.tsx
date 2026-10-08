import React from 'react';
import { CheckCircle2, Download, Loader2, TriangleAlert } from 'lucide-react';
import { startOfflineLibraryDownload, useOfflineLibrary } from '../../services/offlineLibrary';

const megabytes = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`;

/** Explicit opt-in for the large offline lesson download. */
export const OfflineLibraryCard: React.FC = () => {
  const library = useOfflineLibrary();
  const supported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const busy = library.status === 'downloading';
  const percent = library.total ? Math.round((library.completed / library.total) * 100) : 0;

  return (
    <section className="rounded-3xl border border-[#333] bg-[#1a1a1a] p-6 shadow-lg md:col-span-2">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-emerald-600 p-2.5 text-white"><Download size={20} /></span>
        <h2 className="text-lg font-bold text-white">Offline lessons</h2>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-400">
        Download the lesson images and audio to this device so you can study without data. This is a large download
        (several hundred MB), so it only starts when you press the button — use Wi-Fi if you can. Lessons you open are
        also saved automatically as you go.
      </p>

      {busy && (
        <div className="mt-4" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-[#333]">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {library.total ? `${library.completed} of ${library.total} files (${percent}%)` : 'Preparing download…'}
          </p>
        </div>
      )}
      {library.status === 'ready' && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-400" role="status">
          <CheckCircle2 size={16} /> Downloaded{library.bytes ? ` (${megabytes(library.bytes)})` : ''}. Lessons work offline.
        </p>
      )}
      {library.status === 'no-storage' && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-400" role="alert">
          <TriangleAlert size={16} /> Not enough free storage{library.requiredBytes ? ` (needs about ${megabytes(library.requiredBytes)})` : ''}.
        </p>
      )}
      {library.status === 'failed' && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-400" role="alert">
          <TriangleAlert size={16} /> The download did not finish. Press the button to continue where it stopped.
        </p>
      )}

      <button
        type="button"
        disabled={!supported || busy || library.status === 'ready'}
        onClick={() => void startOfflineLibraryDownload()}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
        {library.status === 'ready' ? 'Already downloaded' : busy ? 'Downloading…' : supported ? 'Download for offline' : 'Not supported on this browser'}
      </button>
    </section>
  );
};
