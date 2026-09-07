import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

type RemovalStage = 'confirm' | 'deleting' | 'success';

export const SubjectRemovalDialog: React.FC<{
  count: number;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  onFinished: () => void;
}> = ({ count, onCancel, onConfirm, onFinished }) => {
  const [stage, setStage] = useState<RemovalStage>('confirm');
  const [error, setError] = useState('');

  const remove = async () => {
    setStage('deleting');
    setError('');
    try {
      await Promise.all([
        onConfirm(),
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ]);
      setStage('success');
      window.setTimeout(onFinished, 1300);
    } catch (reason) {
      console.error('Could not remove subjects', reason);
      setError('Could not remove the subject. Please try again.');
      setStage('confirm');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-[9px] border border-slate-200 bg-white p-5 text-center shadow-2xl dark:border-white/10 dark:bg-[#1c1f26]">
        {stage === 'confirm' ? (
          <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-[9px] bg-rose-50 text-rose-600 dark:bg-rose-500/10">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="mt-4 text-base font-black text-slate-950 dark:text-white">Are you sure?</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-gray-400">
              Remove {count === 1 ? 'this subject' : `${count} subjects`} from My Subjects?
            </p>
            {error && <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>}
            <div className="mt-5 flex justify-center gap-2">
              <button type="button" onClick={onCancel} className="rounded-[9px] border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 dark:border-white/10 dark:text-gray-300">Cancel</button>
              <button type="button" onClick={() => void remove()} className="rounded-[9px] bg-rose-600 px-5 py-2 text-xs font-black text-white hover:bg-rose-700">Yes, delete</button>
            </div>
          </>
        ) : stage === 'deleting' ? (
          <div className="py-4">
            <div className="subject-bin mx-auto" aria-label="Removing subject">
              <span className="subject-bin-file" />
              <span className="subject-bin-lid" />
              <span className="subject-bin-body"><span /><span /><span /></span>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-black text-slate-600 dark:text-gray-300"><Loader2 size={14} className="animate-spin" /> Removing subject</p>
          </div>
        ) : (
          <div className="py-4">
            <span className="mx-auto grid h-16 w-16 animate-[subjectTick_.45s_ease-out_both] place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Check size={34} strokeWidth={3.5} />
            </span>
            <p className="mt-4 text-sm font-black text-emerald-600">Subject Removed Successfully</p>
          </div>
        )}
      </div>

      <style>{`
        .subject-bin { position:relative; width:72px; height:86px; padding-top:22px; }
        .subject-bin-lid { position:absolute; z-index:3; left:9px; top:17px; width:54px; height:7px; border-radius:4px; background:#e11d48; transform-origin:8px 5px; animation:subjectBinLid 1.1s ease-in-out infinite; }
        .subject-bin-lid::before { content:''; position:absolute; width:22px; height:6px; left:16px; top:-6px; border-radius:4px 4px 0 0; background:#e11d48; }
        .subject-bin-body { position:absolute; z-index:2; left:13px; top:28px; width:46px; height:50px; display:flex; justify-content:center; gap:7px; padding-top:10px; border-radius:5px 5px 10px 10px; background:#fb7185; }
        .subject-bin-body span { width:3px; height:28px; border-radius:3px; background:rgba(255,255,255,.65); }
        .subject-bin-file { position:absolute; z-index:1; left:26px; top:0; width:22px; height:28px; border:2px solid #64748b; border-radius:3px; background:white; animation:subjectFileDrop 1.1s ease-in infinite; }
        @keyframes subjectBinLid { 0%,15%,80%,100%{transform:translate(0,0) rotate(0)} 30%,65%{transform:translate(-7px,-8px) rotate(-20deg)} }
        @keyframes subjectFileDrop { 0%{transform:translateY(-18px);opacity:0} 20%{opacity:1} 70%,100%{transform:translateY(42px) scale(.72);opacity:0} }
        @keyframes subjectTick { from{transform:scale(.45);opacity:0} 70%{transform:scale(1.12)} to{transform:scale(1);opacity:1} }
        @media (prefers-reduced-motion: reduce) { .subject-bin-lid,.subject-bin-file{animation:none!important} }
      `}</style>
    </div>
  );
};
