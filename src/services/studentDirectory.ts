/**
 * The public face of a student — the only thing the leaderboard and the
 * "students like you" list are allowed to read.
 *
 * `/users` holds email addresses, quiz history and relationships, so listing it
 * is refused by the rules for everyone but an administrator. Rankings and
 * suggestions instead read `/public_profiles`, a row per student carrying only
 * what a classmate would see on a noticeboard: a name, a school, a level, the
 * subjects taken and a score.
 *
 * The row is written by its owner and mirrors whatever is already on their
 * profile, so nothing new is collected to make these features work.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as limitTo,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, examsidemannLoginDb } from './firebase';

export type PublicProfile = {
  id: string;
  displayName: string;
  photoURL?: string;
  school: string;
  grade: string;
  level: string;
  subjects: string[];
  totalPoints: number;
  streak: number;
  visitCount?: number;
};

export type PublicProfileInput = {
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  school?: string;
  grade?: string;
  enrolledSubjects?: string[];
  totalPoints?: number;
  streak?: number;
  visitCount?: number;
  role?: string;
};

const normaliseName = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());

const parseUserToPublicProfile = (id: string, data: Record<string, unknown>): PublicProfile => {
  const profileName = [data.firstName, data.lastName]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .join(' ');
  const googleName = String(data.displayName || data.name || data.fullName || '').trim();
  const emailName = String(data.email || '')
    .split('@')[0]
    .replace(/[._+-]+/g, ' ')
    .trim();

  const displayName = normaliseName(profileName || googleName || emailName) || 'Student';
  const school = typeof data.school === 'string' ? data.school.trim() : '';
  const grade = typeof data.grade === 'string' ? data.grade.trim() : '';
  const level =
    grade ||
    (typeof data.level === 'string'
      ? data.level.trim()
      : typeof data.course === 'string'
        ? data.course.trim()
        : '');

  return {
    id,
    displayName,
    photoURL: typeof data.photoURL === 'string' && data.photoURL ? data.photoURL : undefined,
    school,
    grade,
    level,
    subjects: Array.isArray(data.enrolledSubjects)
      ? (data.enrolledSubjects.filter((s) => typeof s === 'string') as string[])
      : Array.isArray(data.subjects)
        ? (data.subjects.filter((s) => typeof s === 'string') as string[])
        : [],
    totalPoints: wholeNumber(data.totalPoints),
    streak: wholeNumber(data.streak),
    visitCount: wholeNumber(data.visitCount ?? data.visits ?? (data.activityDays ? Object.keys(data.activityDays).length : 0)),
  };
};

const text = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const wholeNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

/**
 * Mirrors a profile into its public row. Called after any change that the
 * leaderboard or the suggestions can see; failures are swallowed because a
 * missing ranking must never break saving a profile.
 */
export const syncPublicProfile = async (userId: string, profile: PublicProfileInput) => {
  const displayName = `${text(profile.firstName, 40)} ${text(profile.lastName, 40)}`.trim();
  if (!displayName) return;

  try {
    await setDoc(
      doc(db, 'public_profiles', userId),
      {
        displayName: displayName.slice(0, 80),
        school: text(profile.school, 160),
        grade: text(profile.grade, 80),
        level: text(profile.grade, 80),
        subjects: Array.isArray(profile.enrolledSubjects)
          ? profile.enrolledSubjects.filter((s) => typeof s === 'string').slice(0, 30)
          : [],
        totalPoints: wholeNumber(profile.totalPoints),
        streak: wholeNumber(profile.streak),
        visitCount: wholeNumber(profile.visitCount),
        role: profile.role === 'teacher' || profile.role === 'parent' ? profile.role : 'student',
        ...(profile.photoURL ? { photoURL: profile.photoURL } : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.debug('public profile sync skipped', error);
  }
};

const toPublicProfile = (id: string, data: Record<string, unknown>): PublicProfile => ({
  id,
  displayName: typeof data.displayName === 'string' ? data.displayName : 'Student',
  photoURL: typeof data.photoURL === 'string' ? data.photoURL : undefined,
  school: typeof data.school === 'string' ? data.school : '',
  grade: typeof data.grade === 'string' ? data.grade : '',
  level: typeof data.level === 'string' ? data.level : '',
  subjects: Array.isArray(data.subjects)
    ? (data.subjects.filter((s) => typeof s === 'string') as string[])
    : [],
  totalPoints: wholeNumber(data.totalPoints),
  streak: wholeNumber(data.streak),
  visitCount: wholeNumber(data.visitCount ?? data.visits),
});

/**
 * Loads the admin-managed blacklist from Firestore.
 * Returns an empty Set if the document is missing or unreadable.
 */
const fetchRankingBlacklist = async (): Promise<Set<string>> => {
  try {
    const snap = await getDoc(doc(db, 'config', 'ranking_blacklist'));
    if (snap.exists()) {
      const uids: unknown = snap.data().uids;
      if (Array.isArray(uids)) return new Set(uids.filter((u) => typeof u === 'string'));
    }
  } catch {
    // Blacklist is best-effort; a read failure must not break the leaderboard.
  }
  return new Set<string>();
};

/**
 * The global leaderboard ranking all users by number of visits.
 * Blacklisted users (managed via the admin Global Ranking panel) are
 * silently excluded so they never appear on the student-facing ranking.
 */
export const fetchGlobalRanking = async (max = 25): Promise<PublicProfile[]> => {
  // Load the blacklist first so we can filter while building the map.
  const blacklist = await fetchRankingBlacklist();

  const userMap = new Map<string, PublicProfile>();

  // 1. Fetch from primary users collection
  try {
    const primarySnap = await getDocs(collection(db, 'users'));
    primarySnap.docs.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      if (data.disabled) return;
      if (blacklist.has(docSnap.id)) return; // blacklisted — skip
      const profile = parseUserToPublicProfile(docSnap.id, data);
      userMap.set(docSnap.id, profile);
    });
  } catch (err) {
    console.debug('Primary /users read fallback:', err);
  }

  // 2. Fetch from examsidemannLoginDb users collection
  try {
    if (examsidemannLoginDb) {
      const loginSnap = await getDocs(collection(examsidemannLoginDb, 'users'));
      loginSnap.docs.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        if (data.disabled) return;
        const loginKey = `login:${docSnap.id}`;
        if (blacklist.has(loginKey)) return; // blacklisted — skip
        const profile = parseUserToPublicProfile(loginKey, data);
        const existingKey = Array.from(userMap.keys()).find((k) => {
          const existing = userMap.get(k);
          return (
            existing &&
            existing.displayName === profile.displayName &&
            existing.school === profile.school
          );
        });
        if (existingKey) {
          const existing = userMap.get(existingKey)!;
          if ((profile.visitCount || 0) > (existing.visitCount || 0)) {
            userMap.set(existingKey, { ...existing, visitCount: profile.visitCount });
          }
        } else {
          userMap.set(loginKey, profile);
        }
      });
    }
  } catch (_err) {
    // Ignore secondary DB fetch errors
  }

  // 3. Fallback to public_profiles if users collection is empty or unavailable
  if (userMap.size === 0) {
    try {
      const snap = await getDocs(
        query(
          collection(db, 'public_profiles'),
          limitTo(Math.min(Math.max(max * 2, 50), 100)),
        ),
      );
      snap.docs.forEach((docSnap) => {
        if (blacklist.has(docSnap.id)) return; // blacklisted — skip
        userMap.set(docSnap.id, parseUserToPublicProfile(docSnap.id, docSnap.data()));
      });
    } catch (err) {
      console.error('Could not load rankings from public_profiles:', err);
    }
  }

  const profiles = Array.from(userMap.values());
  return profiles
    .filter((p) => p.displayName && p.displayName !== 'Unnamed user')
    .sort(
      (a, b) =>
        (b.visitCount ?? 0) - (a.visitCount ?? 0) ||
        (b.totalPoints ?? 0) - (a.totalPoints ?? 0),
    )
    .slice(0, max);
};

/**
 * Where this student sits globally by number of visits.
 */
export const fetchMyRank = async (myVisits: number): Promise<{ rank: number; capped: boolean }> => {
  try {
    const list = await fetchGlobalRanking(200);
    const myIndex = list.findIndex((p) => (p.visitCount ?? 0) <= myVisits);
    if (myIndex !== -1) {
      return { rank: myIndex + 1, capped: false };
    }
    return { rank: list.length + 1, capped: false };
  } catch {
    return { rank: 1, capped: false };
  }
};

/**
 * Students taking the same level, ranked by how many subjects they share with
 * you. The level filter happens in Firestore; the overlap scoring happens here,
 * because "how much do we have in common" is not something an index can answer.
 */
export const fetchSuggestedClassmates = async (
  currentUserId: string,
  level: string,
  subjects: string[],
  max = 6,
): Promise<(PublicProfile & { sharedSubjects: string[] })[]> => {
  if (!level) return [];

  const snapshot = await getDocs(
    query(
      collection(db, 'public_profiles'),
      where('level', '==', level),
      orderBy('totalPoints', 'desc'),
      limitTo(60),
    ),
  );

  const mine = new Set(subjects);
  return snapshot.docs
    .filter((snap) => snap.id !== currentUserId)
    .map((snap) => {
      const profile = toPublicProfile(snap.id, snap.data());
      return {
        ...profile,
        sharedSubjects: profile.subjects.filter((subject) => mine.has(subject)),
      };
    })
    .filter((profile) => profile.sharedSubjects.length > 0)
    .sort(
      (a, b) =>
        b.sharedSubjects.length - a.sharedSubjects.length || b.totalPoints - a.totalPoints,
    )
    .slice(0, max);
};

/** Reads one public row — used to show your own card before a sync lands. */
export const fetchPublicProfile = async (userId: string): Promise<PublicProfile | null> => {
  const snap = await getDoc(doc(db, 'public_profiles', userId));
  return snap.exists() ? toPublicProfile(snap.id, snap.data()) : null;
};
