import React, { useState } from 'react';
import { Check, Loader2, LockKeyhole, Settings2 } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { FEATURE_FLAGS_DOCUMENT, useFeatureFlags } from '../../services/featureFlags';

export const ConfigurationManager: React.FC = () => {
  const { flags, loading, error: loadError } = useFeatureFlags();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const setEcdLoginWall = async (enabled: boolean) => {
    if (saving || enabled === flags.ecdLoginWallEnabled) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      await setDoc(doc(db, 'config', FEATURE_FLAGS_DOCUMENT), {
        ecdLoginWallEnabled: enabled,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      console.error('Could not update feature configuration', error);
      setSaveError('The setting could not be saved. Confirm this account has the admin claim.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-purple-600 dark:text-purple-300">
          Platform controls
        </p>
        <h2 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">Feature configuration</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
          Turn selected site features on or off. Changes are published immediately and do not require a new deployment.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
            <Settings2 size={19} />
          </span>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Access controls</h3>
            <p className="text-xs text-gray-400">Choose which areas require an account.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <LockKeyhole size={20} />
            </span>
            <div>
              <h4 className="font-black text-gray-900 dark:text-white">ECD login wall</h4>
              <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                When on, visitors must sign in or create an ECD account before opening the journey, reading, or maths pages. When off, ECD opens directly for everyone.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
            {saving && <Loader2 size={17} className="animate-spin text-purple-600" aria-label="Saving" />}
            {saved && <Check size={17} className="text-emerald-600" aria-label="Saved" />}
            <button
              type="button"
              role="switch"
              aria-checked={flags.ecdLoginWallEnabled}
              aria-label="Require login for ECD"
              disabled={loading || saving}
              onClick={() => setEcdLoginWall(!flags.ecdLoginWallEnabled)}
              className={`relative h-8 w-14 rounded-full transition-colors disabled:cursor-wait disabled:opacity-60 ${
                flags.ecdLoginWallEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                flags.ecdLoginWallEnabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
            <span className={`w-7 text-xs font-black uppercase ${
              flags.ecdLoginWallEnabled ? 'text-purple-700 dark:text-purple-300' : 'text-gray-400'
            }`}>
              {flags.ecdLoginWallEnabled ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {(loadError || saveError) && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {saveError || loadError}
        </p>
      )}
    </section>
  );
};
