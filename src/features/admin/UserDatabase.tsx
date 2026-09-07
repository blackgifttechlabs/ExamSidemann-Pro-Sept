
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, CalendarDays, ChevronDown, Check, Loader2, ShieldCheck, ArrowDown, ArrowUp, ArrowUpDown, AlertTriangle, Trophy, BookOpen, Mail, Copy, X } from 'lucide-react';
import { db, examsidemannLoginDb } from '../../services/firebase';
import { collection, doc, getDocs, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { polytechnicLogoForName } from '../../data/polytechnicLogos';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { GlobalRankingManager } from './GlobalRankingManager';
import { listEveryAuthUser, type AdminAuthUser } from '../../services/adminAuthUsers';

const userEmail = (user: any): string => String(
    user.email || user.emailAddress || user.userEmail || user.contactEmail || ''
).trim();

const normaliseName = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase()
        .replace(/(^|[\s'-])\p{L}/gu, letter => letter.toLocaleUpperCase());

const userIdentityName = (user: any): string => {
    const profileName = [user.firstName, user.lastName]
        .map(value => String(value || '').trim())
        .filter(Boolean)
        .join(' ');
    const googleName = String(user.displayName || user.name || user.fullName || '').trim();
    const emailName = userEmail(user)
        .split('@')[0]
        .replace(/[._+-]+/g, ' ')
        .trim();

    return normaliseName(profileName || googleName || emailName) || 'Unnamed user';
};

const compactNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

const LEVEL_BADGE_STYLES = [
    'bg-blue-50 text-blue-700 ring-blue-600/15 dark:bg-blue-500/10 dark:text-blue-300',
    'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300',
    'bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300',
    'bg-violet-50 text-violet-700 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300',
    'bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300',
    'bg-cyan-50 text-cyan-700 ring-cyan-600/15 dark:bg-cyan-500/10 dark:text-cyan-300',
    'bg-orange-50 text-orange-700 ring-orange-600/15 dark:bg-orange-500/10 dark:text-orange-300',
    'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/15 dark:bg-fuchsia-500/10 dark:text-fuchsia-300',
] as const;

const levelBadgeStyle = (label: string) => {
    const colorIndex = [...label.toLocaleLowerCase()].reduce((total, character) => total + character.codePointAt(0)!, 0);
    return LEVEL_BADGE_STYLES[colorIndex % LEVEL_BADGE_STYLES.length];
};

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'custom';
type RoleFilter = 'all' | 'student' | 'teacher' | 'parent' | 'ecd';
type SortKey = 'name' | 'email' | 'school' | 'level' | 'joined' | 'active' | 'status' | 'visits' | 'points';
type SortDirection = 'asc' | 'desc';

const userDate = (value: any): Date | null => {
    if (value?.toDate instanceof Function) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
};

const inputDate = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const curriculumLevelFor = (savedLevel = '') => {
    const alias = savedLevel === 'Form 5' ? 'Lower 6' : savedLevel === 'Form 6' ? 'Upper 6' : savedLevel;
    return CURRICULUM_REGISTRY.find((level) => level.name === alias) ?? null;
};

const subjectsForUser = (user: any): string[] => {
    const levelLabel = String(user.grade || user.level || user.course || '').trim();
    if (!levelLabel) return [];
    const curriculum = curriculumLevelFor(levelLabel);
    return curriculum?.subjects.map((subject) => subject.name) ?? [];
};

const formatAccountCreated = (date: Date | null) => (
    date?.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }) ?? '—'
);

export const UserDatabase: React.FC = () => {
    const [showRanking, setShowRanking] = useState(false);
    const [primaryUsers, setPrimaryUsers] = useState<any[]>([]);
    const [loginUsers, setLoginUsers] = useState<any[]>([]);
    const [authUsers, setAuthUsers] = useState<AdminAuthUser[]>([]);
    const [authUsersLoading, setAuthUsersLoading] = useState(true);
    const [authUsersError, setAuthUsersError] = useState('');
    const [databaseError, setDatabaseError] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [datePreset, setDatePreset] = useState<DatePreset>('all');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState(inputDate(new Date()));
    const [openFilter, setOpenFilter] = useState<'date' | 'role' | null>(null);
    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [resettingSubjects, setResettingSubjects] = useState(false);
    const [enrollingSubjects, setEnrollingSubjects] = useState(false);
    const [resetSubjectResult, setResetSubjectResult] = useState('');
    const [showEmailListModal, setShowEmailListModal] = useState(false);
    const [emailListCopied, setEmailListCopied] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('joined');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const filterBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribePrimary = onSnapshot(collection(db, 'users'), (snap) => {
            setPrimaryUsers(snap.docs.map(d => ({
                id: d.id,
                firestoreId: d.id,
                firebaseProjectId: 'testing-3d5b2',
                ...d.data(),
            })));
            setPrimaryLoading(false);
        }, () => {
            setDatabaseError('The testing user database could not be loaded.');
            setPrimaryLoading(false);
        });

        const unsubscribeLogin = onSnapshot(collection(examsidemannLoginDb, 'users'), (snap) => {
            setLoginUsers(snap.docs.map(d => ({
                id: `examsidemann-login-4ec4f:${d.id}`,
                firestoreId: d.id,
                firebaseProjectId: 'examsidemann-login-4ec4f',
                authProjectId: 'examsidemann-login-4ec4f',
                ...d.data(),
            })));
            setLoginLoading(false);
        }, () => {
            setDatabaseError('Exam Sidemann Login users could not be read from its users database.');
            setLoginLoading(false);
        });

        return () => {
            unsubscribePrimary();
            unsubscribeLogin();
        };
    }, []);

    useEffect(() => {
        let active = true;
        void listEveryAuthUser()
            .then((accounts) => {
                if (active) setAuthUsers(accounts);
            })
            .catch((error) => {
                console.error('Firebase Authentication users could not be loaded', error);
                if (active) setAuthUsersError('The complete Authentication email directory could not be loaded. Showing profile emails only.');
            })
            .finally(() => {
                if (active) setAuthUsersLoading(false);
            });
        return () => { active = false; };
    }, []);

    const users = useMemo(() => {
        const merged = new Map<string, any>();

        authUsers.forEach((account) => {
            const key = `${account.projectId}:${account.uid}`;
            merged.set(key, {
                id: key,
                firestoreId: account.uid,
                firebaseProjectId: account.projectId,
                authProjectId: account.projectId,
                email: account.email,
                displayName: account.displayName,
                photoURL: account.photoURL,
                phone: account.phoneNumber,
                disabled: account.disabled,
                createdAt: account.creationTime,
                lastLoginDate: account.lastSignInTime,
                authOnly: true,
            });
        });

        [...primaryUsers, ...loginUsers].forEach((profile) => {
            const projectId = profile.firebaseProjectId || 'testing-3d5b2';
            const uid = profile.firestoreId || profile.id;
            const key = `${projectId}:${uid}`;
            const authAccount = merged.get(key) || {};
            merged.set(key, {
                ...authAccount,
                ...profile,
                email: userEmail(profile) || userEmail(authAccount),
                displayName: profile.displayName || authAccount.displayName,
                photoURL: profile.photoURL || authAccount.photoURL,
                phone: profile.phone || authAccount.phone,
                createdAt: profile.createdAt ?? authAccount.createdAt,
                lastLoginDate: profile.lastLoginDate ?? authAccount.lastLoginDate,
                authOnly: false,
            });
        });

        return Array.from(merged.values());
    }, [primaryUsers, loginUsers, authUsers]);
    const loading = primaryLoading || loginLoading;

    useEffect(() => {
        const closeFilters = (event: PointerEvent) => {
            if (!filterBarRef.current?.contains(event.target as Node)) setOpenFilter(null);
        };
        document.addEventListener('pointerdown', closeFilters);
        return () => document.removeEventListener('pointerdown', closeFilters);
    }, []);

    const usersInDateRange = useMemo(() => {
        if (datePreset === 'all') return users;

        const now = new Date();
        let start: Date | null = null;
        let end: Date | null = now;
        if (datePreset === 'today') {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
        } else if (datePreset === '7d' || datePreset === '30d') {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - (datePreset === '7d' ? 6 : 29));
        } else {
            start = customStart ? new Date(`${customStart}T00:00:00`) : null;
            end = customEnd ? new Date(`${customEnd}T23:59:59.999`) : null;
        }

        return users.filter(user => {
            const lastActive = userDate(user.lastLoginDate);
            if (!lastActive) return false;
            return (!start || lastActive >= start) && (!end || lastActive <= end);
        });
    }, [users, datePreset, customStart, customEnd]);

    const summary = useMemo(() => ({
        total: usersInDateRange.length,
        students: usersInDateRange.filter(user => !user.role || user.role === 'student').length,
        teachers: usersInDateRange.filter(user => user.role === 'teacher').length,
        parents: usersInDateRange.filter(user => user.role === 'parent').length,
        ecd: usersInDateRange.filter(user => user.educationType === 'ecd').length,
        usersWithSchool: usersInDateRange.filter(user => Boolean(user.school?.trim())).length,
        pointEarners: usersInDateRange.filter(user => (Number(user.totalPoints) || 0) > 0).length,
        schools: new Set(
            usersInDateRange
                .map(user => user.school?.trim().toLocaleLowerCase())
                .filter((school): school is string => Boolean(school)),
        ).size,
        points: usersInDateRange.reduce((total, user) => total + (Number(user.totalPoints) || 0), 0),
    }), [usersInDateRange]);

    const searchTerm = userSearch.trim().toLocaleLowerCase();
    const filteredUnsorted = usersInDateRange.filter(user => {
        const role = user.role || 'student';
        // ECD (Yippie) learners are students carrying educationType 'ecd', so
        // they get their own option rather than a role of their own.
        const matchesRole =
            roleFilter === 'all' ||
            (roleFilter === 'ecd' ? user.educationType === 'ecd' : role === roleFilter);
        const matchesSearch = [userIdentityName(user), userEmail(user), user.firstName, user.lastName, user.displayName, user.school, user.grade, user.level, user.course, user.phone, user.firebaseProjectId]
            .some(value => String(value || '').toLocaleLowerCase().includes(searchTerm));
        return matchesRole && matchesSearch;
    });

    const joinedDate = (user: any) => userDate(user.createdAt ?? user.joinedAt ?? user.dateJoined);
    const statusLabel = (user: any) => user.disabled ? 'Disabled' : user.authOnly ? 'Auth account' : user.role !== 'teacher' ? 'Active' : user.teacherVerified ? 'Verified' : 'Pending verification';
    const sortValue = (user: any, key: SortKey): string | number => {
        if (key === 'name') return userIdentityName(user).toLocaleLowerCase();
        if (key === 'email') return userEmail(user).toLocaleLowerCase();
        if (key === 'school') return String(user.school || 'Private').toLocaleLowerCase();
        if (key === 'level') return String(user.grade || user.level || user.course || '').toLocaleLowerCase();
        if (key === 'joined') return joinedDate(user)?.getTime() ?? -1;
        if (key === 'active') return userDate(user.lastLoginDate)?.getTime() ?? -1;
        if (key === 'status') return statusLabel(user).toLocaleLowerCase();
        if (key === 'visits') return Number(user.visitCount) || 0;
        return Number(user.totalPoints) || 0;
    };
    const filtered = [...filteredUnsorted].sort((a, b) => {
        const left = sortValue(a, sortKey);
        const right = sortValue(b, sortKey);
        const comparison = typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right));
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const emailListText = useMemo(() => {
        const seen = new Set<string>();
        const emails: string[] = [];
        users.forEach((user) => {
            const email = userEmail(user).toLowerCase();
            if (!email.includes('@') || seen.has(email)) return;
            seen.add(email);
            emails.push(email);
        });
        return emails.join(', ');
    }, [users]);

    const emailListCount = useMemo(
        () => (emailListText ? emailListText.split(', ').length : 0),
        [emailListText],
    );

    useEffect(() => {
        if (!showEmailListModal) setEmailListCopied(false);
    }, [showEmailListModal]);

    const copyEmailList = async () => {
        if (!emailListText) return;
        try {
            await navigator.clipboard.writeText(emailListText);
            setEmailListCopied(true);
            window.setTimeout(() => setEmailListCopied(false), 2000);
        } catch (error) {
            console.error('Could not copy email list', error);
            window.alert('Copy failed. Select the text manually.');
        }
    };

    const changeSort = (key: SortKey) => {
        if (sortKey === key) setSortDirection(direction => direction === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const SortHeader: React.FC<{ column: SortKey; children: React.ReactNode; className?: string }> = ({ column, children, className = '' }) => {
        const active = sortKey === column;
        const Icon = !active ? ArrowUpDown : sortDirection === 'asc' ? ArrowUp : ArrowDown;
        return (
            <th className={`px-6 py-4 ${className}`} aria-sort={active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => changeSort(column)} className={`inline-flex w-full items-center gap-1.5 whitespace-nowrap transition hover:text-purple-600 dark:hover:text-purple-300 ${className.includes('text-right') ? 'justify-end' : ''}`}>
                    {children}<Icon size={12} strokeWidth={2.4} className={active ? 'text-purple-600 dark:text-purple-300' : 'text-gray-300 dark:text-gray-600'} />
                </button>
            </th>
        );
    };

    const percentage = (value: number) => summary.total > 0 ? Math.round((value / summary.total) * 100) : 0;

    const verifyTeacher = async (user: any) => {
        setVerifyingId(user.id);
        try {
            const sourceDb = user.firebaseProjectId === 'examsidemann-login-4ec4f' ? examsidemannLoginDb : db;
            await updateDoc(doc(sourceDb, 'users', user.firestoreId || user.id), {
                teacherVerified: true,
                'teacherApplication.status': 'approved',
            });
        } catch (error) {
            console.error('Could not verify teacher', error);
            window.alert('Teacher verification failed. Make sure this account has administrator access.');
        } finally {
            setVerifyingId(null);
        }
    };

    const resetAllSubjects = async () => {
        const confirmed = window.confirm(
            `Clear enrolled subjects for all ${primaryUsers.length + loginUsers.length} user records across both databases? Their levels, courses, scores and progress will not be changed.`
        );
        if (!confirmed) return;
        setResettingSubjects(true);
        setResetSubjectResult('');
        try {
            for (let start = 0; start < primaryUsers.length; start += 450) {
                const batch = writeBatch(db);
                primaryUsers.slice(start, start + 450).forEach((account) => {
                    const id = account.firestoreId || account.id;
                    batch.update(doc(db, 'users', id), { enrolledSubjects: [] });
                });
                await batch.commit();
            }
            for (let start = 0; start < loginUsers.length; start += 450) {
                const batch = writeBatch(examsidemannLoginDb);
                loginUsers.slice(start, start + 450).forEach((account) => {
                    const id = account.firestoreId || account.id;
                    batch.update(doc(examsidemannLoginDb, 'users', id), { enrolledSubjects: [] });
                });
                await batch.commit();
            }
            // Public directory rows are optional. Update only documents that
            // exist so one absent projection cannot reject the entire reset.
            const publicProfiles = await getDocs(collection(db, 'public_profiles'));
            for (let start = 0; start < publicProfiles.docs.length; start += 450) {
                const batch = writeBatch(db);
                publicProfiles.docs.slice(start, start + 450).forEach((profile) => {
                    batch.update(profile.ref, { subjects: [] });
                });
                await batch.commit();
            }
            setResetSubjectResult(`Cleared subjects for ${primaryUsers.length + loginUsers.length} user records and ${publicProfiles.size} public profiles.`);
        } catch (error) {
            console.error('Could not reset user subjects', error);
            setResetSubjectResult('Reset failed. Confirm this account has the administrator claim.');
        } finally {
            setResettingSubjects(false);
        }
    };

    const enrollAllLevelSubjects = async () => {
        const allAccounts = [...primaryUsers, ...loginUsers];
        const eligible = allAccounts.filter((account) => subjectsForUser(account).length > 0);
        const skipped = allAccounts.length - eligible.length;
        const confirmed = window.confirm(
            `Assign every subject offered at each user's level for ${eligible.length} accounts? ${skipped} account${skipped === 1 ? '' : 's'} without a recognised level will be skipped. Existing subject choices will be replaced.`
        );
        if (!confirmed) return;
        setEnrollingSubjects(true);
        setResetSubjectResult('');
        try {
            const subjectByUserId = new Map<string, string[]>();
            eligible.forEach((account) => {
                const id = account.firestoreId || account.id;
                subjectByUserId.set(id, subjectsForUser(account));
            });

            for (let start = 0; start < primaryUsers.length; start += 450) {
                const batch = writeBatch(db);
                let writes = 0;
                primaryUsers.slice(start, start + 450).forEach((account) => {
                    const id = account.firestoreId || account.id;
                    const subjects = subjectByUserId.get(id);
                    if (!subjects?.length) return;
                    batch.update(doc(db, 'users', id), { enrolledSubjects: subjects });
                    writes += 1;
                });
                if (writes) await batch.commit();
            }
            for (let start = 0; start < loginUsers.length; start += 450) {
                const batch = writeBatch(examsidemannLoginDb);
                let writes = 0;
                loginUsers.slice(start, start + 450).forEach((account) => {
                    const id = account.firestoreId || account.id;
                    const subjects = subjectByUserId.get(id);
                    if (!subjects?.length) return;
                    batch.update(doc(examsidemannLoginDb, 'users', id), { enrolledSubjects: subjects });
                    writes += 1;
                });
                if (writes) await batch.commit();
            }

            const publicProfiles = await getDocs(collection(db, 'public_profiles'));
            let publicUpdates = 0;
            for (let start = 0; start < publicProfiles.docs.length; start += 450) {
                const batch = writeBatch(db);
                let writes = 0;
                publicProfiles.docs.slice(start, start + 450).forEach((profile) => {
                    const subjects = subjectByUserId.get(profile.id);
                    if (!subjects?.length) return;
                    batch.update(profile.ref, { subjects: subjects.slice(0, 30) });
                    writes += 1;
                });
                if (writes) {
                    await batch.commit();
                    publicUpdates += writes;
                }
            }

            setResetSubjectResult(
                `Assigned level subjects for ${eligible.length} user records${publicUpdates ? ` and ${publicUpdates} public profiles` : ''}. Skipped ${skipped} without a recognised level.`
            );
        } catch (error) {
            console.error('Could not assign level subjects', error);
            setResetSubjectResult('Level subject assignment failed. Confirm this account has the administrator claim.');
        } finally {
            setEnrollingSubjects(false);
        }
    };

    const metricCard = 'min-w-[245px] h-[164px] rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[#161616]';
    const dateOptions: Array<{ value: DatePreset; label: string }> = [
        { value: 'all', label: 'All time' },
        { value: 'today', label: 'Today' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: 'custom', label: 'Custom range' },
    ];
    const roleOptions: Array<{ value: RoleFilter; label: string; count: number }> = [
        { value: 'all', label: 'All users', count: summary.total },
        { value: 'student', label: 'Students', count: summary.students },
        { value: 'teacher', label: 'Teachers', count: summary.teachers },
        { value: 'parent', label: 'Parents', count: summary.parents },
        { value: 'ecd', label: 'ECD learners', count: summary.ecd },
    ];

    return (
        <div className="animate-dropdown-reveal text-left">
            {/* Dedicated Learners toggle */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-black text-gray-900 dark:text-white">User Database</h2>
                <div className="flex items-center gap-2">
                    {!showRanking && (
                        <>
                            <button type="button" onClick={() => setShowEmailListModal(true)} disabled={primaryLoading || loginLoading} className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                                {authUsersLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                Email list{emailListCount ? ` (${emailListCount})` : ''}
                            </button>
                            <button type="button" onClick={() => void enrollAllLevelSubjects()} disabled={enrollingSubjects || resettingSubjects || primaryLoading} className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                {enrollingSubjects ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
                                {enrollingSubjects ? 'Assigning...' : 'Assign level subjects'}
                            </button>
                            <button type="button" onClick={() => void resetAllSubjects()} disabled={resettingSubjects || enrollingSubjects || primaryLoading} className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                                {resettingSubjects ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                                {resettingSubjects ? 'Resetting...' : 'Reset all subjects'}
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowRanking((prev) => !prev)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                            showRanking
                                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                                : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'
                        }`}
                    >
                        <Trophy size={14} />
                        {showRanking ? 'Back to Users' : 'Dedicated Learners'}
                    </button>
                </div>
            </div>

            {resetSubjectResult && <p className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{resetSubjectResult}</p>}

            {/* Conditional: show ranking panel OR the regular user table */}
            {showRanking ? (
                <GlobalRankingManager />
            ) : (
            <>
            <div className="grid grid-flow-col auto-cols-[minmax(245px,1fr)] xl:grid-cols-4 xl:auto-cols-auto gap-4 mb-5 overflow-x-auto pb-2 custom-scrollbar">
                <div className={metricCard}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Total users</p>
                        <span aria-hidden="true" className="text-lg leading-none text-gray-400">⋮</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white tabular-nums">
                            {loading ? '—' : compactNumber.format(summary.total)}
                        </p>
                        <p className="pb-1 text-[10px] text-gray-400">
                            {datePreset === 'all' ? 'Registered' : 'Active in range'}
                        </p>
                    </div>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                        <span className="bg-amber-400" style={{ width: `${percentage(summary.students)}%` }} />
                        <span className="bg-cyan-500" style={{ width: `${percentage(summary.teachers)}%` }} />
                        <span className="bg-violet-500" style={{ width: `${percentage(summary.parents)}%` }} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] text-gray-500 dark:text-gray-400">
                        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />{summary.students} students</span>
                        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-500" />{summary.teachers} teachers</span>
                        <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-violet-500" />{summary.parents} parents</span>
                    </div>
                </div>

                <div className={metricCard}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Students</p>
                        <span aria-hidden="true" className="text-lg leading-none text-gray-400">⋮</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white tabular-nums">{loading ? '—' : compactNumber.format(summary.students)}</p>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">{percentage(summary.students)}% of users</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${percentage(summary.students)}%` }} />
                    </div>
                    <p className="mt-3 text-[10px] text-gray-400">Learner accounts in the selected period</p>
                </div>

                <div className={metricCard}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Schools represented</p>
                        <span aria-hidden="true" className="text-lg leading-none text-gray-400">⋮</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white tabular-nums">{loading ? '—' : compactNumber.format(summary.schools)}</p>
                        <span className="text-[10px] font-semibold text-gray-400">{summary.usersWithSchool} profiles</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${percentage(summary.usersWithSchool)}%` }} />
                    </div>
                    <p className="mt-3 text-[10px] text-gray-400">{percentage(summary.usersWithSchool)}% of users added a school</p>
                </div>

                <div className={metricCard}>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Points earned</p>
                        <span aria-hidden="true" className="text-lg leading-none text-gray-400">⋮</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white tabular-nums">{loading ? '—' : compactNumber.format(summary.points)}</p>
                        <span className="text-[10px] font-semibold text-gray-400">{summary.total ? compactNumber.format(summary.points / summary.total) : 0} avg.</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${percentage(summary.pointEarners)}%` }} />
                    </div>
                    <p className="mt-3 text-[10px] text-gray-400">{summary.pointEarners} users have earned points</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161616] rounded-none border border-gray-200 dark:border-[#222] overflow-hidden shadow-sm">
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-[#222]">
                    {databaseError && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span className="min-w-0 flex-1 font-semibold">{databaseError}</span>
                        </div>
                    )}
                    <div ref={filterBarRef} className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="relative flex shrink-0 items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                            <CalendarDays size={16} className="text-gray-400" />
                            <span className="text-gray-400">Last active:</span>
                            <button
                                type="button"
                                onClick={() => setOpenFilter(openFilter === 'date' ? null : 'date')}
                                className="inline-flex items-center gap-1.5 py-2 font-bold text-gray-900 outline-none transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                aria-haspopup="listbox"
                                aria-expanded={openFilter === 'date'}
                            >
                                {dateOptions.find(option => option.value === datePreset)?.label}
                                <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform ${openFilter === 'date' ? 'rotate-180' : ''}`} />
                            </button>
                            {openFilter === 'date' && (
                                <div role="listbox" className="absolute left-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.02] dark:border-white/10 dark:bg-[#202020]">
                                    {dateOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={datePreset === option.value}
                                            onClick={() => {
                                                setDatePreset(option.value);
                                                setOpenFilter(null);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${datePreset === option.value ? 'bg-blue-50 font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5'}`}
                                        >
                                            {option.label}
                                            {datePreset === option.value && <Check size={14} strokeWidth={2.5} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {datePreset === 'custom' && (
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    type="date"
                                    value={customStart}
                                    max={customEnd || inputDate(new Date())}
                                    onChange={event => setCustomStart(event.target.value)}
                                    aria-label="Active from date"
                                    className="rounded-full border border-gray-200 bg-transparent px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-purple-500 dark:border-white/10 dark:text-gray-200"
                                />
                                <span className="text-xs text-gray-400">to</span>
                                <input
                                    type="date"
                                    value={customEnd}
                                    min={customStart || undefined}
                                    max={inputDate(new Date())}
                                    onChange={event => setCustomEnd(event.target.value)}
                                    aria-label="Active to date"
                                    className="rounded-full border border-gray-200 bg-transparent px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-purple-500 dark:border-white/10 dark:text-gray-200"
                                />
                            </div>
                        )}
                        <div className="relative ml-auto flex shrink-0 items-center justify-end gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                            <span className="text-gray-400">Account type:</span>
                            <button
                                type="button"
                                onClick={() => setOpenFilter(openFilter === 'role' ? null : 'role')}
                                className="inline-flex items-center gap-1.5 py-2 font-bold text-gray-900 outline-none transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                aria-haspopup="listbox"
                                aria-expanded={openFilter === 'role'}
                            >
                                {roleOptions.find(option => option.value === roleFilter)?.label}
                                <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform ${openFilter === 'role' ? 'rotate-180' : ''}`} />
                            </button>
                            {openFilter === 'role' && (
                                <div role="listbox" className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.02] dark:border-white/10 dark:bg-[#202020]">
                                    {roleOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={roleFilter === option.value}
                                            onClick={() => {
                                                setRoleFilter(option.value);
                                                setOpenFilter(null);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${roleFilter === option.value ? 'bg-blue-50 font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5'}`}
                                        >
                                            <span>{option.label}</span>
                                            <span className="flex items-center gap-2">
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] tabular-nums text-gray-500 dark:bg-white/10 dark:text-gray-300">{option.count}</span>
                                                {roleFilter === option.value && <Check size={14} strokeWidth={2.5} />}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-none text-sm text-gray-900 dark:text-white outline-none focus:border-purple-500 transition-colors" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <table className="w-full text-left text-xs" aria-label="Loading user records" aria-busy="true">
                            <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 font-black uppercase text-[8px] tracking-widest border-b dark:border-[#222]">
                                <tr>
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="hidden px-6 py-4 md:table-cell">Contact Email</th>
                                    <th className="hidden px-6 py-4 lg:table-cell">School</th>
                                    <th className="hidden px-6 py-4 lg:table-cell">Level/Course</th>
                                    <th className="hidden px-6 py-4 lg:table-cell">Account created</th>
                                    <th className="hidden px-6 py-4 xl:table-cell">Last active</th>
                                    <th className="px-6 py-4">Account status</th>
                                    <th className="px-6 py-4 text-right">Visits</th>
                                    <th className="px-6 py-4 text-right">Academic Points</th>
                                </tr>
                            </thead>
                            <tbody className="animate-pulse divide-y divide-gray-100 dark:divide-[#222]">
                                {Array.from({ length: 8 }, (_, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#161616] dark:even:bg-white/[0.025]">
                                        <td className="px-6 py-4"><span className="block h-3 w-32 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="hidden px-6 py-4 md:table-cell"><span className="block h-3 w-40 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="hidden px-6 py-4 lg:table-cell"><div className="flex items-center gap-2.5"><span className="h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-white/10" /><span className="block h-3 w-28 rounded-full bg-gray-200 dark:bg-white/10" /></div></td>
                                        <td className="hidden px-6 py-4 lg:table-cell"><span className="block h-6 w-24 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="hidden px-6 py-4 lg:table-cell"><span className="block h-3 w-28 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="hidden px-6 py-4 xl:table-cell"><span className="block h-3 w-20 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="px-6 py-4"><span className="block h-7 w-24 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="px-6 py-4"><span className="ml-auto block h-3 w-7 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                        <td className="px-6 py-4"><span className="ml-auto block h-3 w-10 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 font-black uppercase text-[8px] tracking-widest border-b dark:border-[#222]">
                            <tr>
                                <SortHeader column="name">User Identity</SortHeader>
                                <SortHeader column="email" className="hidden md:table-cell">Contact Email</SortHeader>
                                <SortHeader column="school" className="hidden lg:table-cell">School</SortHeader>
                                <SortHeader column="level" className="hidden lg:table-cell">Level/Course</SortHeader>
                                <SortHeader column="joined" className="hidden lg:table-cell">Account created</SortHeader>
                                <SortHeader column="active" className="hidden xl:table-cell">Last active</SortHeader>
                                <SortHeader column="status">Account status</SortHeader>
                                <SortHeader column="visits" className="text-right">Visits</SortHeader>
                                <SortHeader column="points" className="text-right">Academic Points</SortHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                            {filtered.map(u => {
                                const polytechnicLogo = polytechnicLogoForName(u.school);
                                const levelCourse = u.grade || u.level || u.course || 'Not set';

                                return (
                                <tr key={u.id} className="odd:bg-white even:bg-slate-50/70 hover:!bg-blue-50/70 dark:odd:bg-[#161616] dark:even:bg-white/[0.025] dark:hover:!bg-blue-500/[0.06] transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-200 tracking-tight">
                                        {userIdentityName(u)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                        <span className="block">{userEmail(u) || 'No email available'}</span>
                                        {u.firebaseProjectId && <span className="mt-0.5 block text-[9px] font-semibold text-gray-400">{u.firebaseProjectId === 'testing-3d5b2' ? 'Testing database' : 'Exam Sidemann Login'}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell text-[10px] font-bold">
                                        <div className="flex items-center gap-2.5">
                                            {polytechnicLogo && (
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-white/10">
                                                    <img
                                                        src={polytechnicLogo}
                                                        alt=""
                                                        className="h-full w-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </span>
                                            )}
                                            <span>{u.school || 'Private'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${levelBadgeStyle(String(levelCourse))}`}>
                                            {levelCourse}
                                        </span>
                                    </td>
                                    <td className="hidden whitespace-nowrap px-6 py-4 text-gray-500 lg:table-cell">
                                        {formatAccountCreated(joinedDate(u))}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden xl:table-cell whitespace-nowrap">
                                        {userDate(u.lastLoginDate)?.toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        }) || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.disabled ? (
                                            <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                                                Disabled
                                            </span>
                                        ) : u.authOnly ? (
                                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                                Auth account
                                            </span>
                                        ) : u.role !== 'teacher' ? (
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                                Active
                                            </span>
                                        ) : u.teacherVerified ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                <ShieldCheck size={12} /> Verified
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={verifyingId === u.id}
                                                onClick={() => void verifyTeacher(u)}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-black text-white transition-colors hover:bg-amber-600 disabled:cursor-wait disabled:opacity-60"
                                            >
                                                {verifyingId === u.id ? <Loader2 className="animate-spin" size={12} /> : <ShieldCheck size={12} />}
                                                Verify teacher
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-700 dark:text-gray-200 tabular-nums">
                                        {u.visitCount || 0}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-purple-600 dark:text-purple-400">{u.totalPoints || 0}</td>
                                </tr>
                        );
                        })}
                    </tbody>
                </table>
                )}
            </div>
            {filtered.length === 0 && !loading && (
                <div className="p-16 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No users match these filters.</div>
            )}
        </div>
            </>
            )}

            {showEmailListModal && createPortal(
                <div
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
                    onMouseDown={() => setShowEmailListModal(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="email-list-title"
                        className="flex h-[min(82vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[#171717]"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-white/10">
                            <div>
                                <h3 id="email-list-title" className="text-lg font-black text-gray-900 dark:text-white">Email list</h3>
                                <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                    {authUsersLoading
                                        ? 'Loading registered email addresses…'
                                        : `${emailListCount} unique email${emailListCount === 1 ? '' : 's'} across all registered accounts.`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => void copyEmailList()}
                                    disabled={!emailListText}
                                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300"
                                >
                                    {emailListCopied ? <Check size={14} /> : <Copy size={14} />}
                                    {emailListCopied ? 'Copied' : 'Copy all'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEmailListModal(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                                    aria-label="Close email list"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex min-h-0 flex-1 flex-col p-6">
                            {authUsersError && (
                                <p className="mb-3 rounded-[9px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                    {authUsersError}
                                </p>
                            )}
                            <textarea
                                readOnly
                                value={emailListText}
                                aria-label="Comma-separated email list"
                                className="min-h-0 w-full flex-1 resize-none rounded-[9px] border border-gray-200 bg-gray-50 px-4 py-4 font-mono text-xs leading-6 text-gray-800 outline-none focus:border-purple-500 dark:border-white/10 dark:bg-[#111] dark:text-gray-100"
                                placeholder={authUsersLoading ? 'Loading emails…' : 'No registered emails are available.'}
                            />
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
};
