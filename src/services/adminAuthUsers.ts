export type AdminAuthUser = {
  projectId: 'testing-3d5b2' | 'examsidemann-login-4ec4f';
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  disabled: boolean;
  providers: string[];
  creationTime: string | null;
  lastSignInTime: string | null;
};

/**
 * Authentication-account enumeration requires privileged Admin credentials.
 * The old callable Firebase Function is intentionally no longer contacted:
 * server functions for this app live on Vercel, and the Users screen already
 * merges both projects' Firestore profile directories. A Vercel Auth-directory
 * endpoint can be added once its service-account secret is configured.
 */
export const listEveryAuthUser = async (): Promise<AdminAuthUser[]> => {
  return [];
};
