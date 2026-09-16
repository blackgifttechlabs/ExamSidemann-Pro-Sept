import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Ban, Undo2, Loader2, RefreshCw, AlertTriangle, Star, Search, X,
} from 'lucide-react';
import { db, examsidemannLoginDb } from '../../services/firebase';
import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';

/* ─── types ─────────────────────────────────────────────────────────────── */
interface RankedUser {
  id: string;
  displayName: string;
  photoURL?: string;
  school: string;
  grade: string;
  visitCount: number;
  totalPoints: number;
  blacklisted: boolean;
}

/* ─── helpers ────────────────────────────────────────────────────────────── */
const normaliseName = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());

const resolveDisplayName = (data: Record<string, unknown>): string => {
  const profileName = [data.firstName, data.lastName]
    .map((v) => String(v || '').trim())
    .filter(Boolean)
    .join(' ');
  const googleName = String(data.displayName || data.name || data.fullName || '').trim();
  const emailName = String(data.email || '').split('@')[0].replace(/[._+-]+/g, ' ').trim();
  return normaliseName(profileName || googleName || emailName) || 'Unnamed user';
};

const wholeNumber = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;

const BLACKLIST_DOC = 'ranking_blacklist';

/* ─── component ─────────────────────────────────────────────────────────── */
export const GlobalRankingManager: React.FC = () => {
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([]);
  const [blacklist, setBlacklist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadBlacklist = useCallback(async (): Promise<Set<string>> => {
    try {
      const snap = await getDoc(doc(db, 'config', BLACKLIST_DOC));
      if (snap.exists()) {
        const ids: string[] = snap.data().uids ?? [];
        return new Set(ids);
      }
    } catch (err) {
      console.warn('Could not load ranking blacklist', err);
    }
    return new Set();
  }, []);

  const saveBlacklist = useCallback(async (next: Set<string>) => {
    await setDoc(doc(db, 'config', BLACKLIST_DOC), {
      uids: Array.from(next),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const bl = await loadBlacklist();
      setBlacklist(bl);

      const userMap = new Map<string, RankedUser>();

      try {
        const snap = await getDocs(collection(db, 'users'));
        snap.docs.forEach((d) => {
          const data = d.data() as Record<string, unknown>;
          if (data.disabled) return;
          userMap.set(d.id, {
            id: d.id,
            displayName: resolveDisplayName(data),
            photoURL: typeof data.photoURL === 'string' ? data.photoURL : undefined,
            school: typeof data.school === 'string' ? data.school.trim() : '',
            grade: typeof data.grade === 'string' ? data.grade.trim() : '',
            visitCount: wholeNumber(data.visitCount),
            totalPoints: wholeNumber(data.totalPoints),
            blacklisted: bl.has(d.id),
          });
        });
      } catch (err) {
        console.warn('Primary users fetch error', err);
      }

      try {
        if (examsidemannLoginDb) {
          const snap = await getDocs(collection(examsidemannLoginDb, 'users'));
          snap.docs.forEach((d) => {
            const data = d.data() as Record<string, unknown>;
            if (data.disabled) return;
            const key = `login:${d.id}`;
            if (!userMap.has(key)) {
              userMap.set(key, {
                id: key,
                displayName: resolveDisplayName(data),
                photoURL: typeof data.photoURL === 'string' ? data.photoURL : undefined,
                school: typeof data.school === 'string' ? data.school.trim() : '',
                grade: typeof data.grade === 'string' ? data.grade.trim() : '',
                visitCount: wholeNumber(data.visitCount),
                totalPoints: wholeNumber(data.totalPoints),
                blacklisted: bl.has(key),
              });
            }
          });
        }
      } catch (err) {
        console.warn('Login DB users fetch error', err);
      }

      const sorted = Array.from(userMap.values()).sort(
        (a, b) => b.visitCount - a.visitCount || b.totalPoints - a.totalPoints,
      );
      setRankedUsers(sorted);
    } catch (err) {
      setError('Failed to load users. Check admin permissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loadBlacklist]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const toggleBlacklist = async (userId: string, currentlyBlacklisted: boolean) => {
    setSavingId(userId);
    try {
      const next = new Set(blacklist);
      if (currentlyBlacklisted) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      await saveBlacklist(next);
      setBlacklist(next);
      setRankedUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blacklisted: !currentlyBlacklisted } : u)),
      );
    } catch (err) {
      console.error('Could not update blacklist', err);
      window.alert('Failed to update. Please try again.');
    } finally {
      setSavingId(null);
    }
  };

  const term = search.trim().toLocaleLowerCase();
  const visibleUsers = rankedUsers.filter(
    (u) =>
      !term ||
      u.displayName.toLocaleLowerCase().includes(term) ||
      u.school.toLocaleLowerCase().includes(term),
  );

  const activeRanked = visibleUsers.filter((u) => !u.blacklisted);
  const blacklistedUsers = visibleUsers.filter((u) => u.blacklisted);

  const UserRow = ({ user, rank }: { user: RankedUser; rank?: number }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
        user.blacklisted
          ? 'bg-rose-50/60 dark:bg-rose-500/5 opacity-60'
          : 'hover:bg-gray-50 dark:hover:bg-white/5'
      }`}
    >
      <span
        className={`w-7 shrink-0 text-center font-black text-sm tabular-nums ${
          rank === 1
            ? 'text-yellow-500'
            : rank != null && rank <= 3
              ? 'text-gray-500'
              : 'text-gray-300 dark:text-gray-600'
        }`}
      >
        {rank != null ? rank : <Ban size={14} className="mx-auto text-rose-400" />}
      </span>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ef2b3f]/15 text-[11px] font-black text-[#ff6b7a]">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          user.displayName.charAt(0).toUpperCase()
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {user.displayName}
        </p>
        <p className="text-[11px] text-gray-400 truncate">{user.school || 'School not set'}</p>
      </div>

      <div className="text-right shrink-0 mr-2">
        <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums flex items-center justify-end gap-1">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          {user.visitCount}
        </p>
        <p className="text-[10px] text-gray-400">{user.visitCount === 1 ? 'star' : 'stars'}</p>
      </div>

      <button
        type="button"
        disabled={savingId === user.id}
        onClick={() => void toggleBlacklist(user.id, user.blacklisted)}
        title={user.blacklisted ? 'Remove from blacklist' : 'Add to blacklist'}
        className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-60 disabled:cursor-wait ${
          user.blacklisted
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300'
            : 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-300'
        }`}
      >
        {savingId === user.id ? (
          <Loader2 size={12} className="animate-spin" />
        ) : user.blacklisted ? (
          <><Undo2 size={12} /> Unblock</>
        ) : (
          <><Ban size={12} /> Blacklist</>
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-dropdown-reveal">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Trophy size={20} className="text-yellow-400" />
            Dedicated Learners Management
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Blacklisted users are hidden from the student-facing leaderboard. Changes are immediate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or school…"
          className="w-full rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-1.5 pl-9 pr-8 text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-gray-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-purple-600" />
          <p className="text-sm text-gray-500">Loading all users…</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Active Ranking
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                {activeRanked.length} users
              </span>
            </div>
            <div className="p-3 space-y-0.5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {activeRanked.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">No active users.</p>
              ) : (
                activeRanked.map((user, idx) => (
                  <UserRow key={user.id} user={user} rank={idx + 1} />
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#0f0f0f] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100/60 dark:border-rose-500/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-rose-400">
                Blacklisted — Hidden from students
              </h3>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                {blacklistedUsers.length} hidden
              </span>
            </div>
            <div className="p-3 space-y-0.5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {blacklistedUsers.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  No blacklisted users.
                </p>
              ) : (
                blacklistedUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400 text-center">
        ⭐ Stars = number of platform visits. Changes are saved immediately and reflected on the
        student leaderboard in real time.
      </p>
    </div>
  );
};
