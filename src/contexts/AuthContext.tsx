
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection, addDoc, serverTimestamp, increment, onSnapshot } from 'firebase/firestore';
import { syncPublicProfile } from '../services/studentDirectory';
import { warmUserDataForOffline } from '../services/offlineData';
import { CURRICULUM_REGISTRY } from '../data/constants';
import { slugifyLearningPath } from '../utils/learningOutcomeSeo';
import { recordReadingMinutesForAchievements } from '../services/achievements';

interface QuizResult {
    question: string;
    selected: string | null;
    correct: string;
    isCorrect: boolean;
}

interface QuizAttempt {
    id?: string;
    title: string;
    subject: string;
    date: any;
    score: number;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    results: QuizResult[];
}

// Fixed: Updated UserProfile interface to support teacher and parent roles and added missing optional properties used in other components
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  educationType?: 'high-school' | 'polytechnic' | 'ecd';
  profileCompleted?: boolean;
  course?: string;
  /** Only set for ECD (Yippie) learners. */
  age?: number;
  enrolledSubjects: string[];
  role: 'student' | 'teacher' | 'parent';
  teacherVerified?: boolean;
  phone?: string;
  province?: string;
  streak: number;
  totalPoints: number;
  visitCount?: number;
  lastLoginDate: any;
  createdAt?: any;
  completedTopics: Record<string, boolean>;
  topicScores: Record<string, number>;
  joinedCommunities?: string[];
  friends?: string[];
  subscriberCount?: number;
  linkedStudents?: string[];
  photoURL?: string;
  bannerURL?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  markTopicCompleted: (topicId: string, status?: boolean) => Promise<void>;
  updateQuizScore: (topicId: string, score: number) => Promise<void>;
  saveQuizAttempt: (attempt: QuizAttempt) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfileData: async () => {},
  markTopicCompleted: async () => {},
  updateQuizScore: async () => {},
  saveQuizAttempt: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const TRACKABLE_SUBJECTS = Array.from(
  new Set(CURRICULUM_REGISTRY.flatMap((level) => level.subjects.map((subject) => subject.name))),
).map((name) => ({ name, slug: slugifyLearningPath(name) }));

const inferActiveSubject = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  const path = window.location.pathname.toLowerCase();
  const title = document.title.toLowerCase();
  const found = TRACKABLE_SUBJECTS.find(({ name, slug }) => (
    path.includes(`/${slug}/`) ||
    path.endsWith(`/${slug}`) ||
    title.includes(name.toLowerCase())
  ));
  return found?.name ?? null;
};

const createDefaultProfile = (currentUser: User): UserProfile => {
  const [firstName = '', ...rest] = (currentUser.displayName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName,
    lastName: rest.join(' '),
    email: currentUser.email || '',
    school: '',
    grade: '',
    profileCompleted: false,
    enrolledSubjects: [],
    role: 'student',
    streak: 0,
    totalPoints: 0,
    visitCount: 0,
    lastLoginDate: Timestamp.now(),
    createdAt: Timestamp.now(),
    completedTopics: {},
    topicScores: {},
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, recordVisit = false) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        if (!data.topicScores) data.topicScores = {};
        if (!data.completedTopics) data.completedTopics = {};
        setUserProfile(data);
        if (recordVisit) void recordVisitAndCheckStreak(uid, data);
        // Keep the noticeboard row (name, school, subjects, score) in step with
        // the private profile, so the leaderboard never reads /users.
        void syncPublicProfile(uid, data);
      } else if (auth.currentUser?.uid === uid) {
        const data = createDefaultProfile(auth.currentUser);
        await setDoc(docRef, data, { merge: true });
        setUserProfile(data);
        if (recordVisit) void recordVisitAndCheckStreak(uid, data);
        void syncPublicProfile(uid, data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const dayFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Harare',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const dayKey = (date = new Date()) => dayFormatter.format(date);

  const recordVisitAndCheckStreak = async (uid: string, profile: UserProfile) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = dayKey(today);
    const lastLogin = profile.lastLoginDate ? profile.lastLoginDate.toDate() : new Date(0);
    lastLogin.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let newStreak = profile.streak || 0;
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1; 

    try {
      const updates: Record<string, unknown> = {
        lastLoginDate: Timestamp.now(),
      };
      if (diffDays >= 1 || !profile.visitCount) updates.visitCount = increment(1);
      if (diffDays >= 1 || !profile.streak) updates.streak = newStreak;

      await updateDoc(doc(db, 'users', uid), updates);
      await setDoc(doc(db, 'users', uid, 'activityDays', todayKey), {
        date: todayKey,
        visited: true,
        timeMs: increment(0),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      const updatedVisitCount = updates.visitCount != null ? (profile.visitCount || 0) + 1 : (profile.visitCount || 0);
      setUserProfile(prev => prev ? ({
        ...prev,
        ...(updates.streak != null ? { streak: newStreak } : {}),
        ...(updates.visitCount != null ? { visitCount: updatedVisitCount } : {}),
        lastLoginDate: Timestamp.now(),
      }) : null);
      void syncPublicProfile(uid, {
        ...profile,
        streak: newStreak,
        visitCount: updatedVisitCount,
      });
    } catch (error) {
      console.error('Could not record account visit:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const recordMinute = async () => {
      if (document.visibilityState !== 'visible') return;
      const todayKey = dayKey();
      const elapsedMs = 60_000;
      const activeSubject = inferActiveSubject();
      // Track 1 reading minute for Dedicated Learners achievements
      recordReadingMinutesForAchievements(1, user.uid);
      try {
        await setDoc(doc(db, 'users', user.uid, 'activityDays', todayKey), {
          date: todayKey,
          visited: true,
          timeMs: increment(elapsedMs),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        if (activeSubject) {
          const subjectKey = slugifyLearningPath(activeSubject);
          const subjectDayRef = doc(db, 'users', user.uid, 'subjectStudyDays', `${todayKey}__${subjectKey}`);
          const subjectDaySnap = await getDoc(subjectDayRef);
          const isFirstSubjectMinuteToday = !subjectDaySnap.exists();
          await setDoc(doc(db, 'users', user.uid, 'subjectStudyTotals', subjectKey), {
            subject: activeSubject,
            timeMs: increment(elapsedMs),
            daysRead: increment(isFirstSubjectMinuteToday ? 1 : 0),
            updatedAt: serverTimestamp(),
          }, { merge: true });
          await setDoc(subjectDayRef, {
            date: todayKey,
            subject: activeSubject,
            subjectKey,
            timeMs: increment(elapsedMs),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
      } catch (error) {
        console.error('Could not record platform time:', error);
      }
    };

    const timer = window.setInterval(recordMinute, 60_000);
    return () => window.clearInterval(timer);
  }, [user]);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, true);
        unsubscribeProfile = onSnapshot(doc(db, 'users', currentUser.uid), (snapshot) => {
          if (!snapshot.exists()) return;
          const data = snapshot.data() as UserProfile;
          if (!data.topicScores) data.topicScores = {};
          if (!data.completedTopics) data.completedTopics = {};
          setUserProfile(data);
          void syncPublicProfile(currentUser.uid, data);
        });
        void warmUserDataForOffline(currentUser.uid);
      }
      else setUserProfile(null);
      setLoading(false);
    });
    return () => {
      unsubscribeProfile?.();
      unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), { ...data, email: user.email }, { merge: true });
    await refreshProfile();
  };

  const markTopicCompleted = async (topicId: string, status: boolean = true) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, 'users', user.uid), { [`completedTopics.${topicId}`]: status });
        await refreshProfile();
    } catch (e) { console.error(e); }
  };

  const updateQuizScore = async (topicId: string, newScore: number) => {
    if (!user || !userProfile) return;
    const currentScores = userProfile.topicScores || {};
    const previousScore = currentScores[topicId] || 0;

    if (newScore > previousScore) {
        const pointsDiff = newScore - previousScore;
        const newTotalPoints = (userProfile.totalPoints || 0) + pointsDiff;
        await updateDoc(doc(db, 'users', user.uid), {
            [`topicScores.${topicId}`]: newScore,
            totalPoints: newTotalPoints
        });
        await refreshProfile();
    }
  };

  const saveQuizAttempt = async (attempt: QuizAttempt) => {
      if (!user) return;
      try {
          await addDoc(collection(db, 'users', user.uid, 'quizHistory'), {
              ...attempt,
              date: serverTimestamp()
          });
          // Also update total points based on this attempt
          await updateDoc(doc(db, 'users', user.uid), {
              totalPoints: (userProfile?.totalPoints || 0) + attempt.score
          });
          await refreshProfile();
      } catch (e) {
          console.error("Error saving quiz attempt", e);
      }
  };

  return (
    <AuthContext.Provider value={{ 
        user, userProfile, loading, refreshProfile, updateProfileData, 
        markTopicCompleted, updateQuizScore, saveQuizAttempt 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
