import type { User } from 'firebase/auth';
import { auth } from './firebase';

export interface AutomationSettings {
  autoVerifyTeachers: boolean;
  emailsEnabled: boolean;
  signInEmails: boolean;
  teacherApprovalEmails: boolean;
}

export interface AutomationStatus {
  settings: AutomationSettings;
  connection: { smtpReady: boolean; sender: string; host: string; projects: string[] };
  deliveries: { id: string; projectId?: string; kind: string; recipient: string; status: string; attempts: number; createdAtMs: number; lastError: string }[];
}

export async function accountAutomation<T>(action: string, data: Record<string, unknown> = {}, user: User | null = auth.currentUser): Promise<T> {
  if (!user) throw new Error('Sign in to continue.');
  const token = await user.getIdToken();
  const response = await fetch('/api/account-automation/', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
    signal: AbortSignal.timeout(60_000),
  });
  let result;
  try { result = await response.json(); }
  catch { throw new Error('The email service is not available. Deploy the account automation API and configure its server environment.'); }
  if (!response.ok) throw new Error(result.error || 'Account automation failed.');
  return result as T;
}

const activeSessions = new Map<string, Promise<void>>();
export async function notifyAccountSignIn(user: User) {
  const result = await user.getIdTokenResult();
  const stamp = Number(result.claims.auth_time);
  if (!stamp || Date.now() - stamp * 1000 > 10 * 60_000) return;
  const key = `account-email:${user.uid}:${stamp}`;
  try { if (sessionStorage.getItem(key)) return; } catch { /* Server also deduplicates. */ }
  if (activeSessions.has(key)) return activeSessions.get(key);
  const pending = accountAutomation('session', {}, user).then(() => {
    try { sessionStorage.setItem(key, 'done'); } catch { /* Storage is optional. */ }
  }).catch(error => {
    // A mail outage must never prevent signing in or opening the dashboard.
    console.warn('Account email notification unavailable:', error instanceof Error ? error.message : 'Service unavailable');
  }).finally(() => activeSessions.delete(key));
  activeSessions.set(key, pending);
  return pending;
}

export const verifyTeacherAccount = (uid: string, projectId = 'testing-3d5b2') =>
  accountAutomation<{ verified: boolean; delivery: { status: string } | null }>('verify-teacher', { uid, projectId });
