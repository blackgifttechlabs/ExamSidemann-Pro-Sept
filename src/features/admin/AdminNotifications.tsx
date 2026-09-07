import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  PencilLine,
  Save,
  User,
  X,
  XCircle,
} from 'lucide-react';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { getIdTokenResult } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { EditSuggestion } from '../schools/types';

const FIELD_LABELS: Record<string, string> = {
  name: 'Institution name',
  motto: 'Motto',
  phone: 'Phone',
  email: 'Email',
  website: 'Website',
  address: 'Street address',
  location: 'Suburb / locality',
  district: 'District',
  province: 'Province',
  curriculums: 'Curriculum',
  fees: 'Fees',
  isBoarding: 'Boarding',
  isDay: 'Day',
  hasResidence: 'Residence',
  description: 'About',
};

const renderValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'object') {
    const fees = value as { amount?: number; currency?: string; period?: string };
    if ('amount' in fees) return `${fees.currency || 'USD'} ${fees.amount ?? 0} / ${fees.period || 'Term'}`;
    return JSON.stringify(value);
  }
  return String(value);
};

const timeAgo = (createdAt: any): string => {
  const date = createdAt?.toDate?.();
  if (!date) return 'Just now';
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export const AdminNotifications: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<EditSuggestion[]>([]);
  const [tab, setTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;
    // Single-field ordering only — a status filter here would force a
    // composite index, so the split by status happens client-side.
    const suggestionsQuery = query(
      collection(db, 'schoolEditSuggestions'),
      orderBy('createdAt', 'desc'),
      limit(150)
    );
    void (async () => {
      if (!user) return;
      const token = await getIdTokenResult(user);
      if (!active || token.claims.admin !== true) return;
      unsubscribe = onSnapshot(
        suggestionsQuery,
        (snapshot) => {
          setSuggestions(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as EditSuggestion)));
        },
        () => setSuggestions([]),
      );
    })().catch(() => setSuggestions([]));
    return () => {
      active = false;
      unsubscribe();
    };
  }, [user]);

  const pending = useMemo(() => suggestions.filter((item) => item.status === 'pending'), [suggestions]);
  const reviewed = useMemo(() => suggestions.filter((item) => item.status !== 'pending'), [suggestions]);
  const listed = tab === 'pending' ? pending : reviewed;
  const selected = suggestions.find((item) => item.id === selectedId) || null;

  const openSuggestion = (suggestion: EditSuggestion) => {
    setSelectedId(suggestion.id);
    // Start from what the submitter proposed; the admin can then adjust any
    // value before approving.
    const seeded: Record<string, unknown> = {};
    Object.entries(suggestion.changes || {}).forEach(([field, change]) => {
      seeded[field] = change.to;
    });
    setOverrides(seeded);
    setEditingField(null);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setOverrides({});
    setEditingField(null);
  };

  const handleApprove = async () => {
    if (!selected) return;
    setWorking(true);
    try {
      const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
      Object.entries(overrides).forEach(([field, value]) => {
        if (value !== undefined) updates[field] = value;
      });

      await updateDoc(doc(db, 'schools', selected.schoolId), updates);
      await updateDoc(doc(db, 'schoolEditSuggestions', selected.id), {
        status: 'approved',
        applied: updates,
        reviewedAt: serverTimestamp(),
        reviewedBy: userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : user?.email || 'Admin',
      });
      setBanner(`${selected.schoolName} updated.`);
      closeDetail();
    } catch (approveError: any) {
      setBanner(approveError?.message || 'Could not apply this suggestion.');
    } finally {
      setWorking(false);
      window.setTimeout(() => setBanner(null), 4000);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setWorking(true);
    try {
      await updateDoc(doc(db, 'schoolEditSuggestions', selected.id), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : user?.email || 'Admin',
      });
      setBanner('Suggestion dismissed.');
      closeDetail();
    } catch (rejectError: any) {
      setBanner(rejectError?.message || 'Could not dismiss this suggestion.');
    } finally {
      setWorking(false);
      window.setTimeout(() => setBanner(null), 4000);
    }
  };

  const renderEditor = (field: string, value: unknown) => {
    if (typeof value === 'boolean') {
      return (
        <button
          onClick={() => setOverrides((current) => ({ ...current, [field]: !value }))}
          className={`rounded-[10px] px-4 py-2 text-[10px] font-black uppercase tracking-wider ${
            value ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-white/10'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </button>
      );
    }

    if (Array.isArray(value)) {
      return (
        <input
          autoFocus
          className="w-full rounded-[10px] border-2 border-purple-500 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-[#111] dark:text-white"
          value={value.join(', ')}
          onChange={(event) =>
            setOverrides((current) => ({
              ...current,
              [field]: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
            }))
          }
        />
      );
    }

    if (field === 'fees' && value && typeof value === 'object') {
      const fees = value as { amount?: number; currency?: string; period?: string };
      return (
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            autoFocus
            className="rounded-[10px] border-2 border-purple-500 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-[#111] dark:text-white"
            value={fees.amount ?? 0}
            onChange={(event) =>
              setOverrides((current) => ({ ...current, fees: { ...fees, amount: Number(event.target.value) } }))
            }
          />
          <input
            className="rounded-[10px] border-2 border-purple-500 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-[#111] dark:text-white"
            value={fees.currency ?? 'USD'}
            onChange={(event) => setOverrides((current) => ({ ...current, fees: { ...fees, currency: event.target.value } }))}
          />
          <input
            className="rounded-[10px] border-2 border-purple-500 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-[#111] dark:text-white"
            value={fees.period ?? 'Term'}
            onChange={(event) => setOverrides((current) => ({ ...current, fees: { ...fees, period: event.target.value } }))}
          />
        </div>
      );
    }

    const isLong = field === 'description';
    const Tag = isLong ? 'textarea' : 'input';
    return React.createElement(Tag, {
      autoFocus: true,
      className: `w-full rounded-[10px] border-2 border-purple-500 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none dark:bg-[#111] dark:text-white ${
        isLong ? 'h-28 resize-none leading-6' : ''
      }`,
      value: (value as string) ?? '',
      onChange: (event: any) => setOverrides((current) => ({ ...current, [field]: event.target.value })),
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-gray-200 text-gray-500 transition hover:border-purple-500 hover:text-purple-600 dark:border-white/10 dark:text-gray-300"
        aria-label={`Notifications${pending.length ? `, ${pending.length} pending` : ''}`}
      >
        <Bell size={18} />
        {pending.length > 0 && (
          <motion.span
            key={pending.length}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff003c] px-1 text-[10px] font-black text-white shadow-lg"
          >
            {pending.length > 99 ? '99+' : pending.length}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="fixed inset-0 z-[140] bg-slate-950/50 backdrop-blur-sm"
            />

            {/* Slides in from the left, as requested. */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-[150] flex w-full max-w-[460px] flex-col border-r border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0b0b0f]"
            >
              <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-gray-200 px-5 dark:border-white/10">
                {selected ? (
                  <button onClick={closeDetail} className="rounded-[10px] p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/5">
                    <ArrowLeft size={19} />
                  </button>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-purple-600 text-white">
                    <Bell size={17} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-600">
                    {selected ? 'Edit suggestion' : 'Notifications'}
                  </p>
                  <h3 className="truncate text-base font-black text-gray-900 dark:text-white">
                    {selected ? selected.schoolName : `${pending.length} pending review`}
                  </h3>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-[10px] p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/5">
                  <X size={19} />
                </button>
              </header>

              {banner && (
                <div className="flex shrink-0 items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 size={15} /> {banner}
                </div>
              )}

              {selected ? (
                <>
                  <div className="flex-1 space-y-5 overflow-y-auto p-5">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                      <p className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-white">
                        <User size={13} className="text-purple-600" /> {selected.submittedBy?.name || 'Anonymous'}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {selected.submittedBy?.email || 'no email'} · {timeAgo(selected.createdAt)}
                      </p>
                      {selected.note && (
                        <p className="mt-3 border-t border-gray-200 pt-3 text-xs italic leading-5 text-gray-500 dark:border-white/10">
                          “{selected.note}”
                        </p>
                      )}
                    </div>

                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Proposed changes ({Object.keys(selected.changes || {}).length})
                    </p>

                    {Object.entries(selected.changes || {}).map(([field, change]) => {
                      const current = overrides[field];
                      const isEditing = editingField === field;
                      return (
                        <div key={field} className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
                          <div className="mb-2.5 flex items-center gap-2">
                            <span className="flex-1 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                              {FIELD_LABELS[field] || field}
                            </span>
                            <button
                              onClick={() => setEditingField(isEditing ? null : field)}
                              className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-[9px] font-black uppercase tracking-wider text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-500/10"
                            >
                              {isEditing ? <><Save size={11} /> Done</> : <><PencilLine size={11} /> Edit</>}
                            </button>
                          </div>

                          <p className="mb-2 text-[11px] leading-5 text-gray-400 line-through">{renderValue(change.from)}</p>

                          {isEditing ? (
                            renderEditor(field, current)
                          ) : (
                            <p className="rounded-[10px] bg-emerald-50 px-3 py-2.5 text-sm font-bold leading-5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                              {renderValue(current)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selected.status === 'pending' ? (
                    <footer className="flex shrink-0 gap-2.5 border-t border-gray-200 p-5 dark:border-white/10">
                      <button
                        onClick={handleReject}
                        disabled={working}
                        className="flex items-center gap-2 rounded-[12px] border-2 border-gray-200 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-gray-500 transition hover:border-rose-400 hover:text-rose-500 disabled:opacity-40 dark:border-white/10"
                      >
                        <XCircle size={15} /> Dismiss
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={working}
                        className="flex flex-1 items-center justify-center gap-2 rounded-[12px] bg-emerald-600 px-6 py-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-emerald-500 disabled:opacity-40"
                      >
                        {working ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                        Approve & publish
                      </button>
                    </footer>
                  ) : (
                    <footer className="shrink-0 border-t border-gray-200 p-5 text-center text-[11px] font-black uppercase tracking-wider text-gray-400 dark:border-white/10">
                      Already {selected.status} · {selected.reviewedBy || 'admin'}
                    </footer>
                  )}
                </>
              ) : (
                <>
                  <div className="flex shrink-0 gap-1 border-b border-gray-200 px-5 dark:border-white/10">
                    {([
                      ['pending', `Pending (${pending.length})`],
                      ['reviewed', `Reviewed (${reviewed.length})`],
                    ] as const).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`border-b-2 px-3 py-3.5 text-[10px] font-black uppercase tracking-wider transition ${
                          tab === id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    {listed.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                        <Inbox size={30} className="text-gray-300" />
                        <p className="text-sm font-black text-gray-500">Nothing here yet</p>
                        <p className="max-w-[15rem] text-xs text-gray-400">
                          School edit suggestions from visitors will land in this panel.
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {listed.map((suggestion) => (
                          <li key={suggestion.id}>
                            <button
                              onClick={() => openSuggestion(suggestion)}
                              className="flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                              <span
                                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                                  suggestion.status === 'pending'
                                    ? 'bg-[#ff003c]'
                                    : suggestion.status === 'approved'
                                      ? 'bg-emerald-500'
                                      : 'bg-gray-300'
                                }`}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-black text-gray-900 dark:text-white">
                                  {suggestion.schoolName}
                                </span>
                                <span className="mt-0.5 block text-[11px] text-gray-400">
                                  {Object.keys(suggestion.changes || {}).length} change
                                  {Object.keys(suggestion.changes || {}).length === 1 ? '' : 's'} suggested by{' '}
                                  {suggestion.submittedBy?.name || 'a visitor'}
                                </span>
                                <span className="mt-1 block text-[10px] font-black uppercase tracking-wider text-gray-300">
                                  {suggestion.province || suggestion.schoolType} · {timeAgo(suggestion.createdAt)}
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
