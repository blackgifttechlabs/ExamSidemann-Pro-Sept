import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Send, X } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ZIM_PROVINCES, districtsFor } from '../../data/zimGeo';
import { CURRICULUM_OPTIONS, EDITABLE_FIELDS, SchoolFees, SchoolRecord } from './types';

type Props = {
  school: SchoolRecord;
  onClose: () => void;
};

type Draft = Omit<Partial<SchoolRecord>, 'fees'> & { fees: SchoolFees };

const buildDraft = (school: SchoolRecord): Draft => {
  const structuredFees = typeof school.fees === 'object' ? school.fees : undefined;
  return {
    name: school.name || '',
    motto: school.motto || '',
    phone: school.phone || '',
    email: school.email || '',
    website: school.website || '',
    address: school.address || '',
    location: school.location || '',
    district: school.district || '',
    province: school.province || '',
    curriculums: school.curriculums ? [...school.curriculums] : [],
    isBoarding: !!school.isBoarding,
    isDay: !!school.isDay,
    hasResidence: !!school.hasResidence,
    description: school.description || '',
    fees: {
      amount: structuredFees?.amount ?? 0,
      currency: structuredFees?.currency ?? 'USD',
      period: structuredFees?.period ?? 'Term',
    },
  };
};

const isSame = (left: unknown, right: unknown) => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

const fieldLabel = 'mb-1.5 block text-[9px] font-black uppercase tracking-[0.18em] text-slate-400';
const fieldInput =
  'w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-white/5 dark:text-white';

export const SuggestEditsModal: React.FC<Props> = ({ school, onClose }) => {
  const { user, userProfile } = useAuth();
  const [draft, setDraft] = useState<Draft>(() => buildDraft(school));
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changes = useMemo(() => {
    const original = buildDraft(school);
    const diff: Record<string, { from: unknown; to: unknown }> = {};
    EDITABLE_FIELDS.forEach((field) => {
      const before = (original as any)[field];
      const after = (draft as any)[field];
      if (!isSame(before, after)) diff[field] = { from: before ?? null, to: after ?? null };
    });
    return diff;
  }, [draft, school]);

  const changeCount = Object.keys(changes).length;

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleCurriculum = (item: string) =>
    setDraft((current) => {
      const list = current.curriculums || [];
      return {
        ...current,
        curriculums: list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item],
      };
    });

  const handleSubmit = async () => {
    if (!changeCount) {
      setError('Change at least one detail before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'schoolEditSuggestions'), {
        schoolId: school.id,
        schoolName: school.name,
        schoolType: school.type,
        province: draft.province || school.province || '',
        proposed: draft,
        changes,
        note: note.trim(),
        submittedBy: {
          uid: user?.uid || 'anonymous',
          name: userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : 'Anonymous visitor',
          email: userProfile?.email || user?.email || '',
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (submitError: any) {
      setError(submitError?.message || 'Could not submit your suggestion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const districts = districtsFor(draft.province);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        aria-label="Close suggest edits"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-2xl dark:border-white/10 dark:bg-[#101014]"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 220, damping: 14 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/12"
            >
              <motion.span
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 12 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.45)]"
              >
                <motion.svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                  <motion.path
                    d="M4.5 12.5l5 5 10-11"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
                  />
                </motion.svg>
              </motion.span>
            </motion.div>

            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Success</h3>
            <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-slate-500 dark:text-slate-400">
              The information is being assessed for approval.
            </p>
            <button
              onClick={onClose}
              className="mt-7 w-full rounded-[12px] bg-slate-900 py-3.5 text-[11px] font-black uppercase tracking-wider text-white dark:bg-white dark:text-slate-900"
            >
              Done
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d0d12]"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10 md:px-7">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-600">Suggest edits</p>
                <h3 className="truncate text-lg font-black text-slate-900 dark:text-white">{school.name}</h3>
              </div>
              {changeCount > 0 && (
                <span className="shrink-0 rounded-full bg-cyan-500/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-600">
                  {changeCount} change{changeCount > 1 ? 's' : ''}
                </span>
              )}
              <button onClick={onClose} className="shrink-0 rounded-[10px] p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/5">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-7">
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                Correct anything that looks wrong below. Your submission is reviewed by an administrator before it
                goes live.
              </p>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Institution name</label>
                  <input className={fieldInput} value={draft.name || ''} onChange={(event) => update('name', event.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Motto</label>
                  <input className={fieldInput} value={draft.motto || ''} onChange={(event) => update('motto', event.target.value)} />
                </div>
                <div>
                  <label className={fieldLabel}>Phone</label>
                  <input className={fieldInput} value={draft.phone || ''} onChange={(event) => update('phone', event.target.value)} placeholder="+263 ..." />
                </div>
                <div>
                  <label className={fieldLabel}>Email</label>
                  <input className={fieldInput} value={draft.email || ''} onChange={(event) => update('email', event.target.value)} placeholder="admin@school.ac.zw" />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Website</label>
                  <input className={fieldInput} value={draft.website || ''} onChange={(event) => update('website', event.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Street address</label>
                  <input className={fieldInput} value={draft.address || ''} onChange={(event) => update('address', event.target.value)} />
                </div>
                <div>
                  <label className={fieldLabel}>Province</label>
                  <select
                    className={fieldInput}
                    value={draft.province || ''}
                    onChange={(event) => setDraft((current) => ({ ...current, province: event.target.value, district: '' }))}
                  >
                    <option value="">Select province</option>
                    {ZIM_PROVINCES.map((province) => <option key={province} value={province}>{province}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>District</label>
                  <select className={fieldInput} value={draft.district || ''} onChange={(event) => update('district', event.target.value)}>
                    <option value="">Select district</option>
                    {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Suburb / locality</label>
                  <input className={fieldInput} value={draft.location || ''} onChange={(event) => update('location', event.target.value)} />
                </div>
              </section>

              <section>
                <label className={fieldLabel}>Curriculum</label>
                <div className="flex flex-wrap gap-2">
                  {CURRICULUM_OPTIONS.map((item) => {
                    const active = (draft.curriculums || []).includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleCurriculum(item)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[10px] font-black uppercase tracking-wider transition ${
                          active
                            ? 'border-cyan-500 bg-cyan-500 text-white'
                            : 'border-slate-200 text-slate-500 hover:border-cyan-400 dark:border-white/10 dark:text-slate-400'
                        }`}
                      >
                        {active && <Check size={12} />} {item}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={fieldLabel}>Fees amount</label>
                  <input
                    type="number"
                    className={fieldInput}
                    value={draft.fees.amount}
                    onChange={(event) => update('fees', { ...draft.fees, amount: Number(event.target.value) })}
                  />
                </div>
                <div>
                  <label className={fieldLabel}>Currency</label>
                  <select className={fieldInput} value={draft.fees.currency} onChange={(event) => update('fees', { ...draft.fees, currency: event.target.value })}>
                    {['USD', 'ZWG', 'ZAR', 'GBP'].map((code) => <option key={code} value={code}>{code}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Period</label>
                  <select className={fieldInput} value={draft.fees.period} onChange={(event) => update('fees', { ...draft.fees, period: event.target.value })}>
                    {['Term', 'Semester', 'Year', 'Module'].map((period) => <option key={period} value={period}>{period}</option>)}
                  </select>
                </div>
              </section>

              <section className="flex flex-wrap gap-2">
                {([
                  ['isBoarding', 'Boarding'],
                  ['isDay', 'Day'],
                  ['hasResidence', 'Residence'],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => update(key, !draft[key] as any)}
                    className={`rounded-[12px] border px-5 py-2.5 text-[10px] font-black uppercase tracking-wider transition ${
                      draft[key]
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-200 text-slate-400 hover:border-emerald-400 dark:border-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </section>

              <section>
                <label className={fieldLabel}>About the institution</label>
                <textarea
                  className={`${fieldInput} h-32 resize-none leading-6`}
                  value={draft.description || ''}
                  onChange={(event) => update('description', event.target.value)}
                />
              </section>

              <section>
                <label className={fieldLabel}>Note for the reviewer (optional)</label>
                <textarea
                  className={`${fieldInput} h-20 resize-none leading-6`}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Where did this information come from?"
                />
              </section>

              {error && (
                <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10">
                  {error}
                </p>
              )}
            </div>

            <footer className="flex shrink-0 items-center gap-3 border-t border-slate-200 px-5 py-4 dark:border-white/10 md:px-7">
              <button onClick={onClose} className="rounded-[12px] px-5 py-3 text-[11px] font-black uppercase tracking-wider text-slate-400 transition hover:text-slate-700 dark:hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !changeCount}
                className="ml-auto flex items-center gap-2 rounded-[12px] bg-cyan-600 px-7 py-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-cyan-500 disabled:opacity-40"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Submit for approval
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
