import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { DOWNLOAD_LIMIT, useAuth } from '../../contexts/AuthContext';
import { DownloadCountdown, DownloadJob } from './DownloadCountdown';

type Gate = 'signin' | 'limit' | null;

const GateModal: React.FC<{ gate: Exclude<Gate, null>; onClose: () => void }> = ({ gate, onClose }) => {
  const signIn = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('examsidemann:request-login', {
      detail: { returnTo: `${window.location.pathname}${window.location.search}` },
    }));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[310] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section role="dialog" aria-modal="true" className="w-full max-w-[340px] rounded-[12px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,.3)] dark:bg-[#17171d]">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
          <Download size={20} />
        </span>
        {gate === 'signin' ? (
          <>
            <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">Please sign in to download</h2>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">It's free. You get {DOWNLOAD_LIMIT} downloads.</p>
            <button type="button" onClick={signIn} className="mt-5 h-11 w-full rounded-[9px] bg-slate-950 text-sm font-black text-white transition hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-200">
              Continue
            </button>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-lg font-black text-slate-900 dark:text-white">Download limit reached</h2>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">You've used all {DOWNLOAD_LIMIT} of your downloads. You can still open papers online.</p>
            <Link to="/dashboard" onClick={onClose} className="mt-5 flex h-11 w-full items-center justify-center rounded-[9px] bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
              Go to dashboard
            </Link>
          </>
        )}
        <button type="button" onClick={onClose} className="mt-3 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white">Not now</button>
      </section>
    </div>,
    document.body,
  );
};

/**
 * Past-paper downloads need an account and are capped per user. Returns the
 * request function plus the elements (countdown toast, sign-in/limit modal)
 * the caller must render.
 */
export const useGatedDownload = () => {
  const { user, userProfile, loading, consumeDownload } = useAuth();
  const [job, setJob] = useState<DownloadJob | null>(null);
  const [gate, setGate] = useState<Gate>(null);

  const requestDownload = useCallback(async (title: string, url: string) => {
    if (loading) return;
    if (!user) { setGate('signin'); return; }
    if ((userProfile?.downloadCount || 0) >= DOWNLOAD_LIMIT || !(await consumeDownload())) {
      setGate('limit');
      return;
    }
    setJob({ token: Date.now(), title, url });
  }, [loading, user, userProfile?.downloadCount, consumeDownload]);

  const downloadUi = (
    <>
      <DownloadCountdown key={job?.token ?? 'download-idle'} job={job} onClose={() => setJob(null)} />
      {gate && <GateModal gate={gate} onClose={() => setGate(null)} />}
    </>
  );

  return { requestDownload, downloadUi };
};
