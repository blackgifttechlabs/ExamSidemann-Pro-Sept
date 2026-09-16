
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, CalendarDays, ChevronDown, Check, Loader2, ShieldCheck, ArrowDown, ArrowUp, ArrowUpDown, AlertTriangle, Trophy, BookOpen, Mail, Copy, X } from 'lucide-react';
import { db, examsidemannLoginDb } from '../../services/firebase';
import { collection, doc, getDocs, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { polytechnicLogoForName } from '../../data/polytechnicLogos';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { GlobalRankingManager } from './GlobalRankingManager';
import { listEveryAuthUser, type AdminAuthUser } from '../../services/adminAuthUsers';
import { AccountAutomationPanel } from './AccountAutomationPanel';
import { verifyTeacherAccount } from '../../services/accountAutomation';

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
            <th className={`px-4 py-2.5 ${className}`} aria-sort={active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => changeSort(column)} className={`inline-flex w-full items-center gap-1 whitespace-nowrap transition hover:text-gray-900 dark:hover:text-white ${className.includes('text-right') ? 'justify-end' : ''}`}>
                    {children}<Icon size={11} strokeWidth={2.2} className={active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-neutral-500'} />
                </button>
            </th>
        );
    };

    const percentage = (value: number) => summary.total > 0 ? Math.round((value / summary.total) * 100) : 0;

    const verifyTeacher = async (user: any) => {
        setVerifyingId(user.id);
        try {
            await verifyTeacherAccount(user.firestoreId || user.id, user.firebaseProjectId || 'testing-3d5b2');
        } catch (error) {
            console.error('Could not verify teacher', error);
            window.alert(error instanceof Error ? error.message : 'Teacher verification failed.');
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

    const metricCard = 'min-w-[220px] rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0f0f0f] p-3.5 shadow-sm';
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">User Database</h2>
                <div className="flex items-center gap-2">
                    {!showRanking && (
                        <>
                            <button type="button" onClick={() => setShowEmailListModal(true)} disabled={primaryLoading || loginLoading} className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 shadow-sm">
                                {authUsersLoading ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                                Email list{emailListCount ? ` (${emailListCount})` : ''}
                            </button>
                            <button type="button" onClick={() => void enrollAllLevelSubjects()} disabled={enrollingSubjects || resettingSubjects || primaryLoading} className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 shadow-sm">
                                {enrollingSubjects ? <Loader2 size={13} className="animate-spin" /> : <BookOpen size={13} />}
                                {enrollingSubjects ? 'Assigning...' : 'Assign level subjects'}
                            </button>
                            <button type="button" onClick={() => void resetAllSubjects()} disabled={resettingSubjects || enrollingSubjects || primaryLoading} className="flex items-center gap-1.5 rounded-md border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 transition hover:bg-rose-100 disabled:opacity-50 shadow-sm">
                                {resettingSubjects ? <Loader2 size={13} className="animate-spin" /> : <AlertTriangle size={13} />}
                                {resettingSubjects ? 'Resetting...' : 'Reset all subjects'}
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowRanking((prev) => !prev)}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors shadow-sm ${
                            showRanking
                                ? 'bg-amber-400 text-gray-900 hover:bg-amber-500'
                                : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                        }`}
                    >
                        <Trophy size={13} />
                        {showRanking ? 'Back to Users' : 'Dedicated Learners'}
                    </button>
                </div>
            </div>

            {resetSubjectResult && <p className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{resetSubjectResult}</p>}
            {!showRanking && <AccountAutomationPanel />}

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

            <div className="bg-white dark:bg-[#0f0f0f] rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                <div className="p-3 md:p-4 border-b border-gray-200 dark:border-neutral-800">
                    {databaseError && (
                        <div className="mb-3 flex items-start gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                            <span className="min-w-0 flex-1 font-medium">{databaseError}</span>
                        </div>
                    )}
                    <div ref={filterBarRef} className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="relative flex shrink-0 items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                            <CalendarDays size={15} className="text-gray-400" />
                            <span className="text-gray-500 dark:text-neutral-400">Last active:</span>
                            <button
                                type="button"
                                onClick={() => setOpenFilter(openFilter === 'date' ? null : 'date')}
                                className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white outline-none transition-colors hover:text-black dark:hover:text-gray-200"
                                aria-haspopup="listbox"
                                aria-expanded={openFilter === 'date'}
                            >
                                {dateOptions.find(option => option.value === datePreset)?.label}
                                <ChevronDown size={13} className={`transition-transform ${openFilter === 'date' ? 'rotate-180' : ''}`} />
                            </button>
                            {openFilter === 'date' && (
                                <div role="listbox" className="absolute left-0 top-full z-30 mt-1.5 w-48 overflow-hidden rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-lg">
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
                                            className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors ${datePreset === option.value ? 'bg-gray-100 font-semibold text-gray-900 dark:bg-neutral-800 dark:text-white' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800/50'}`}
                                        >
                                            {option.label}
                                            {datePreset === option.value && <Check size={13} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {datePreset === 'custom' && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <input
                                    type="date"
                                    value={customStart}
                                    max={customEnd || inputDate(new Date())}
                                    onChange={event => setCustomStart(event.target.value)}
                                    aria-label="Active from date"
                                    className="rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 outline-none"
                                />
                                <span className="text-xs text-gray-400">to</span>
                                <input
                                    type="date"
                                    value={customEnd}
                                    min={customStart || undefined}
                                    max={inputDate(new Date())}
                                    onChange={event => setCustomEnd(event.target.value)}
                                    aria-label="Active to date"
                                    className="rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 outline-none"
                                />
                            </div>
                        )}
                        <div className="relative ml-auto flex shrink-0 items-center justify-end gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                            <span className="text-gray-500 dark:text-neutral-400">Account type:</span>
                            <button
                                type="button"
                                onClick={() => setOpenFilter(openFilter === 'role' ? null : 'role')}
                                className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-white outline-none transition-colors"
                                aria-haspopup="listbox"
                                aria-expanded={openFilter === 'role'}
                            >
                                {roleOptions.find(option => option.value === roleFilter)?.label}
                                <ChevronDown size={13} className={`transition-transform ${openFilter === 'role' ? 'rotate-180' : ''}`} />
                            </button>
                            {openFilter === 'role' && (
                                <div role="listbox" className="absolute right-0 top-full z-30 mt-1.5 w-52 overflow-hidden rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-lg">
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
                                            className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors ${roleFilter === option.value ? 'bg-gray-100 font-semibold text-gray-900 dark:bg-neutral-800 dark:text-white' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800/50'}`}
                                        >
                                            <span>{option.label}</span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] tabular-nums text-gray-500 dark:bg-neutral-800 dark:text-gray-400">{option.count}</span>
                                                {roleFilter === option.value && <Check size={13} />}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                        <input className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md text-xs text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-gray-400 transition-colors" placeholder="Search users by name, email, school..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <table className="w-full text-left text-xs" aria-label="Loading user records" aria-busy="true">
                            <thead className="bg-gray-50/60 dark:bg-neutral-900/50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-4 py-2.5">User Identity</th>
                                    <th className="hidden px-4 py-2.5 md:table-cell">Contact Email</th>
                                    <th className="hidden px-4 py-2.5 lg:table-cell">School</th>
                                    <th className="hidden px-4 py-2.5 lg:table-cell">Level/Course</th>
                                    <th className="hidden px-4 py-2.5 lg:table-cell">Account created</th>
                                    <th className="hidden px-4 py-2.5 xl:table-cell">Last active</th>
                                    <th className="px-4 py-2.5">Account status</th>
                                    <th className="px-4 py-2.5 text-right">Visits</th>
                                    <th className="px-4 py-2.5 text-right">Academic Points</th>
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
                        <thead className="bg-gray-50/60 dark:bg-neutral-900/50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-neutral-800">
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
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/70">
                            {filtered.map(u => {
                                const polytechnicLogo = polytechnicLogoForName(u.school);
                                const levelCourse = u.grade || u.level || u.course || 'Not set';

                                return (
                                <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-neutral-900/40 transition-colors">
                                    <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-gray-100">
                                        {userIdentityName(u)}
                                    </td>
                                    <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell">
                                        <span className="block">{userEmail(u) || 'No email available'}</span>
                                        {u.firebaseProjectId && <span className="mt-0.5 block text-[9px] font-medium text-gray-400">{u.firebaseProjectId === 'testing-3d5b2' ? 'Testing database' : 'Exam Sidemann Login'}</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-gray-500 hidden lg:table-cell text-xs font-medium">
                                        <div className="flex items-center gap-2">
                                            {polytechnicLogo && (
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white p-0.5 dark:border-neutral-800">
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
                                    <td className="px-4 py-2.5 hidden lg:table-cell">
                                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${levelBadgeStyle(String(levelCourse))}`}>
                                            {levelCourse}
                                        </span>
                                    </td>
                                    <td className="hidden whitespace-nowrap px-4 py-2.5 text-gray-500 lg:table-cell text-xs">
                                        {formatAccountCreated(joinedDate(u))}
                                    </td>
                                    <td className="px-4 py-2.5 text-gray-500 hidden xl:table-cell whitespace-nowrap text-xs">
                                        {userDate(u.lastLoginDate)?.toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                        }) || 'Unknown'}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        {u.disabled ? (
                                            <span className="inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                                                Disabled
                                            </span>
                                        ) : u.authOnly ? (
                                            <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                                Auth account
                                            </span>
                                        ) : u.role !== 'teacher' ? (
                                            <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
                                                Active
                                            </span>
                                        ) : u.teacherVerified ? (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                <ShieldCheck size={11} /> Verified
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={verifyingId === u.id}
                                                onClick={() => void verifyTeacher(u)}
                                                className="inline-flex items-center gap-1 rounded-md bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 text-[10px] font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 disabled:cursor-wait disabled:opacity-60 shadow-sm"
                                            >
                                                {verifyingId === u.id ? <Loader2 className="animate-spin" size={11} /> : <ShieldCheck size={11} />}
                                                Verify teacher
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                                        {u.visitCount || 0}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900 dark:text-white">{u.totalPoints || 0}</td>
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
