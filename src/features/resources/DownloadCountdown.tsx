import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Download } from 'lucide-react';

export type DownloadJob = {
  token: number;
  title: string;
  url: string;
};

const driveFileId = (url: string) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      || parsed.searchParams.get('id')
      || '';
  } catch {
    return '';
  }
};

/** Convert Drive preview/view links to an attachment response. */
export const directDownloadUrl = (url: string) => {
  const fileId = driveFileId(url);
  return fileId
    ? `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`
    : url;
};

const beginBrowserDownload = (job: DownloadJob) => {
  const anchor = document.createElement('a');
  anchor.href = directDownloadUrl(job.url);
  anchor.download = `${job.title.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'download'}.pdf`;
  anchor.rel = 'noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

export const DownloadCountdown: React.FC<{
  job: DownloadJob | null;
  onClose: () => void;
}> = ({ job, onClose }) => {
  const [count, setCount] = useState(3);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!job) return undefined;
    setCount(3);
    setComplete(false);
    let remaining = 3;
    let closeTimer: number | undefined;
    const countdownTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        setCount(remaining);
        return;
      }
      window.clearInterval(countdownTimer);
      beginBrowserDownload(job);
      setComplete(true);
      closeTimer = window.setTimeout(onClose, 2500);
    }, 500);

    return () => {
      window.clearInterval(countdownTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [job?.token]);

  if (!job || typeof document === 'undefined') return null;

  return createPortal(
    <aside role="status" aria-live="polite" className="fixed bottom-5 right-5 z-[300] flex w-[min(340px,calc(100vw-2.5rem))] items-center gap-3 overflow-hidden rounded-[10px] border border-slate-200 bg-white p-3.5 text-left shadow-[0_18px_50px_rgba(15,23,42,.24)] dark:border-white/10 dark:bg-[#17171d]">
      <style>{`
        @keyframes downloadTickPop {
          0% { transform: scale(.35) rotate(-18deg); opacity: 0; }
          70% { transform: scale(1.12) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .download-tick-pop { animation: downloadTickPop .48s cubic-bezier(.2,.9,.25,1.25) both; }
      `}</style>
      {complete ? (
        <span className="download-tick-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_7px_18px_rgba(16,185,129,.35)]">
          <Check size={24} strokeWidth={3} />
        </span>
      ) : (
        <span key={count} className="download-tick-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xl font-black text-white shadow-[0_7px_18px_rgba(124,58,237,.3)]">
          {count}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`flex items-center gap-1.5 text-xs font-black ${complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {!complete && <Download size={14} />}
          {complete ? 'Download started' : 'Preparing download'}
        </span>
        <span className="mt-1 block truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400" title={job.title}>
          {complete ? `Download started for ${job.title}` : job.title}
        </span>
      </span>
    </aside>,
    document.body,
  );
};
