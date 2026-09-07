
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  updateProfile
} from "firebase/auth";
import {
  CACHE_SIZE_UNLIMITED,
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8Tg1JSxd_DWX5b99pSPIZHECPwBBxnrE",
  authDomain: "testing-3d5b2.firebaseapp.com",
  projectId: "testing-3d5b2",
  storageBucket: "testing-3d5b2.firebasestorage.app",
  messagingSenderId: "291797509956",
  appId: "1:291797509956:web:05f115bb2cd98e9e565911"
};

const examsidemannLoginConfig = {
  apiKey: "AIzaSyAafqJS5e15s8H6DE_HSu2-pEljIdI3jok",
  authDomain: "examsidemann-login-4ec4f.firebaseapp.com",
  projectId: "examsidemann-login-4ec4f",
  storageBucket: "examsidemann-login-4ec4f.firebasestorage.app",
  messagingSenderId: "1018299593624",
  appId: "1:1018299593624:web:a960de0806ee36f6d471ed"
};

const app = initializeApp(firebaseConfig);
const examsidemannLoginApp = initializeApp(examsidemannLoginConfig, 'examsidemann-login');
export const auth = getAuth(app);

// Keep the session across tab closes and restarts rather than only for the
// lifetime of the tab, so nobody — least of all an ECD learner's parent — has
// to sign in again every visit. Failing here is not fatal: the SDK simply
// keeps whatever persistence it defaulted to.
void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn("Could not enable persistent sign-in", error);
});

// IndexedDB keeps every Firestore document the device has downloaded available
// across tabs, browser closes and phone restarts. Unlimited here disables the
// SDK's 40 MB garbage collector; the browser/device quota remains the hard cap.
// Multi-tab management prevents two open Exam Sidemann tabs fighting over it.
const primaryFirestore = () => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (error) {
    // Vite can re-run this module without reloading the page. Reuse the live
    // instance instead of crashing because initializeFirestore already ran.
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError.code === 'failed-precondition' ||
        firebaseError.message?.includes('initializeFirestore() has already been called')) {
      return getFirestore(app);
    }
    throw error;
  }
};

export const db = primaryFirestore();
export const examsidemannLoginDb = getFirestore(examsidemannLoginApp);

const ANALYTICS_DATABASE_KEY = 'exam-sidemann:analytics:database';
const PRIMARY_ANALYTICS_PROBE =
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}` +
  `/databases/(default)/documents/analytics_daily/__quota_probe__?key=${firebaseConfig.apiKey}`;
let analyticsDatabaseProbe: Promise<void> | null = null;

const quotaWasExhausted = (error: unknown) => {
  const firebaseError = error as { code?: string; message?: string };
  const code = (firebaseError?.code || '').toLowerCase();
  const message = (firebaseError?.message || '').toLowerCase();
  return code === 'resource-exhausted' || code.endsWith('/resource-exhausted') ||
    message.includes('quota exceeded') || message.includes('quota has been exceeded');
};

const analyticsDatabasePreference = (): 'primary' | 'secondary' => {
  try {
    return window.sessionStorage.getItem(ANALYTICS_DATABASE_KEY) === 'secondary'
      ? 'secondary'
      : 'primary';
  } catch {
    return 'primary';
  }
};

const rememberSecondaryAnalyticsDatabase = () => {
  try {
    window.sessionStorage.setItem(ANALYTICS_DATABASE_KEY, 'secondary');
  } catch {
    // Storage is optional. This write still retries against the secondary DB.
  }
};

const probePrimaryAnalyticsQuota = async () => {
  if (analyticsDatabasePreference() === 'secondary') return;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), 4_000) : null;
  try {
    const response = await fetch(PRIMARY_ANALYTICS_PROBE, {
      method: 'GET',
      cache: 'no-store',
      signal: controller?.signal,
    });
    if (response.status === 429) {
      rememberSecondaryAnalyticsDatabase();
      return;
    }
    if (!response.ok && response.status !== 404) {
      const body = await response.text();
      if (body.toLowerCase().includes('resource_exhausted') ||
          body.toLowerCase().includes('quota exceeded')) {
        rememberSecondaryAnalyticsDatabase();
      }
    }
  } catch {
    // A network failure is not evidence of exhausted quota. Keep Firestore's
    // offline queue working by retaining the primary choice.
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

const ensureAnalyticsDatabaseSelected = async () => {
  if (analyticsDatabasePreference() === 'secondary') return;
  analyticsDatabaseProbe ??= probePrimaryAnalyticsQuota();
  await analyticsDatabaseProbe;
};

/** Used by Admin to avoid waiting on a known quota-blocked primary project. */
export const primaryAnalyticsDatabaseIsAvailable = async () => {
  await ensureAnalyticsDatabaseSelected();
  return analyticsDatabasePreference() === 'primary';
};

/**
 * Runs an analytics write against the primary project. If Firebase reports
 * that project's quota as exhausted, retry once against the ExamSidemann
 * login project and keep using it for the rest of this browser session.
 */
export const writeAnalyticsWithFailover = async <T>(
  write: (database: Firestore) => Promise<T>,
): Promise<T> => {
  await ensureAnalyticsDatabaseSelected();
  if (analyticsDatabasePreference() === 'secondary') {
    return write(examsidemannLoginDb);
  }

  try {
    return await write(db);
  } catch (error) {
    if (!quotaWasExhausted(error)) throw error;
    rememberSecondaryAnalyticsDatabase();
    console.warn('Analytics quota reached; switching collection to the secondary Firestore.');
    return write(examsidemannLoginDb);
  }
};

/** Both stores are read by admin analytics because counters may span them. */
export const analyticsDatabases: readonly Firestore[] = [db, examsidemannLoginDb];

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithGoogleIdToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    console.error("Error registering with email", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in with email", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    window.google?.accounts?.id?.disableAutoSelect();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
