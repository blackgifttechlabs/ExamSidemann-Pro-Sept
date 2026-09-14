import { createHash, randomUUID } from 'node:crypto';
import { FieldPath, FieldValue, type Firestore } from 'firebase-admin/firestore';
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { adminServices, AutomationError, PRIMARY_PROJECT, connectionStatus, mailTransport, smtpConfig } from './config';
import { renderEmail, type EmailKind } from './templates';

export const DEFAULT_SETTINGS = { autoVerifyTeachers: false, emailsEnabled: false, signInEmails: true, teacherApprovalEmails: true };
export type AutomationSettings = typeof DEFAULT_SETTINGS;
const SETTINGS_PATH = 'admin_settings/accountAutomation';
const MAX_ATTEMPTS = 5;
const eventId = (...parts: (string | number)[]) => createHash('sha256').update(parts.join(':')).digest('hex');
const displayName = (user: UserRecord, profile: Record<string, any> = {}) =>
  [profile.firstName, profile.lastName].filter(Boolean).join(' ') || user.displayName || 'there';

export function validateSettings(input: unknown): AutomationSettings {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AutomationError(400, 'Provide the automation settings.');
  const data = input as Record<string, unknown>;
  if (Object.keys(data).some(key => !(key in DEFAULT_SETTINGS)) || Object.keys(DEFAULT_SETTINGS).some(key => typeof data[key] !== 'boolean')) {
    throw new AutomationError(400, 'Each automation setting must be on or off.');
  }
  return data as AutomationSettings;
}

export const settingsFrom = (data?: Record<string, unknown>): AutomationSettings => Object.fromEntries(
  Object.entries(DEFAULT_SETTINGS).map(([key, fallback]) => [key, typeof data?.[key] === 'boolean' ? data[key] : fallback]),
) as AutomationSettings;

export async function getSettings(db = adminServices().db) {
  return settingsFrom((await db.doc(SETTINGS_PATH).get()).data());
}

export async function saveSettings(settings: AutomationSettings, adminUid: string) {
  if (settings.emailsEnabled) smtpConfig();
  await adminServices().db.doc(SETTINGS_PATH).set({ ...settings, updatedBy: adminUid, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

function message(kind: EmailKind, user: UserRecord, name: string, occurredAtMs: number) {
  return { kind, uid: user.uid, recipient: user.email!, name, occurredAtMs, createdAtMs: Date.now(), status: 'pending', attempts: 0, nextAttemptAtMs: 0 };
}

/** A verified auth_time identifies a real sign-in; token refreshes retain it. */
export async function queueSignIn(token: DecodedIdToken, user: UserRecord, profile: Record<string, any>, db = adminServices().db) {
  const signedInAt = Number(token.auth_time) * 1000;
  const age = Date.now() - signedInAt;
  if (!user.email || !Number.isFinite(age) || age < -60_000 || age > 10 * 60_000) return null;
  const id = eventId('sign-in', token.uid, token.auth_time);
  const email = db.collection('email_outbox').doc(id);
  const rate = db.collection('email_limits').doc(token.uid);
  return db.runTransaction(async tx => {
    const [settingsDoc, previous, rateDoc] = await Promise.all([tx.get(db.doc(SETTINGS_PATH)), tx.get(email), tx.get(rate)]);
    const settings = settingsFrom(settingsDoc.data());
    if (!settings.emailsEnabled || !settings.signInEmails) return null;
    if (previous.exists) return id;
    if (Date.now() - Number(rateDoc.data()?.lastSignInMailAtMs || 0) < 60_000) return null;
    tx.create(email, message('sign-in', user, displayName(user, profile), signedInAt));
    tx.set(rate, { lastSignInMailAtMs: Date.now() }, { merge: true });
    return id;
  });
}

/** Verification and its email event commit together; delivery may retry separately. */
export async function approveTeacher(uid: string, projectId: string, actor: string, automatic: boolean) {
  const { db, auth } = adminServices(projectId);
  const settings = await getSettings();
  if (automatic && !settings.autoVerifyTeachers) return { verified: false, emailId: null };
  const user = await auth.getUser(uid);
  if (user.disabled) throw new AutomationError(400, 'This account is disabled.');
  const ref = db.collection('users').doc(uid);
  const outcome = await db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    const profile = snapshot.data();
    if (!profile || profile.role !== 'teacher') {
      if (automatic) return { verified: false, emailId: null };
      throw new AutomationError(400, 'This account has no teacher application.');
    }
    if (profile.teacherVerified) return { verified: true, emailId: profile.teacherApprovalEmailId || null };
    if (automatic && profile.teacherApplication?.status === 'rejected') return { verified: false, emailId: null };
    // Read the primary settings in the same transaction for primary accounts.
    // Secondary profiles use the primary settings fetched immediately above.
    const currentSettings = projectId === PRIMARY_PROJECT ? settingsFrom((await tx.get(db.doc(SETTINGS_PATH))).data()) : settings;
    if (automatic && !currentSettings.autoVerifyTeachers) return { verified: false, emailId: null };
    const version = Number(profile.teacherApprovalVersion || 0) + 1;
    const id = currentSettings.emailsEnabled && currentSettings.teacherApprovalEmails && user.email
      ? eventId('teacher-approved', projectId, uid, version) : null;
    tx.update(ref, {
      teacherVerified: true, 'teacherApplication.status': 'approved',
      teacherVerifiedAt: FieldValue.serverTimestamp(), teacherVerifiedBy: actor,
      teacherApprovalVersion: version, teacherApprovalEmailId: id,
    });
    if (id) tx.create(db.collection('email_outbox').doc(id), message('teacher-approved', user, displayName(user, profile), Date.now()));
    return { verified: true, emailId: id };
  });
  if (outcome.verified) {
    const listings = await db.collection('classes').where('teacherId', '==', uid).get();
    for (let start = 0; start < listings.docs.length; start += 400) {
      const batch = db.batch();
      listings.docs.slice(start, start + 400).forEach(listing => batch.update(listing.ref, { approved: true }));
      await batch.commit();
    }
  }
  return outcome;
}

type Transport = { sendMail: (options: any) => Promise<any> };
export async function deliverEmail(id: string, db = adminServices().db, transport?: Transport, settingsDb = adminServices().db) {
  const settings = await getSettings(settingsDb);
  const ref = db.collection('email_outbox').doc(id);
  const lease = randomUUID();
  const claimed = await db.runTransaction(async tx => {
    const doc = await tx.get(ref);
    const item = doc.data();
    if (!item || item.status === 'sent' || item.status === 'failed') return null;
    if (item.attempts >= MAX_ATTEMPTS && Number(item.leaseUntilMs || 0) <= Date.now()) {
      tx.update(ref, { status: 'failed', lastError: 'ATTEMPTS_EXHAUSTED', nextAttemptAtMs: FieldValue.delete(), leaseUntilMs: 0 });
      return null;
    }
    if (item.kind !== 'test' && (!settings.emailsEnabled || (item.kind === 'sign-in' ? !settings.signInEmails : !settings.teacherApprovalEmails))) return null;
    if (Number(item.nextAttemptAtMs || 0) > Date.now() || (item.status === 'sending' && item.leaseUntilMs > Date.now())) return null;
    tx.update(ref, { status: 'sending', lease, leaseUntilMs: Date.now() + 120_000, attempts: Number(item.attempts || 0) + 1 });
    return item;
  });
  if (!claimed) return { id, status: 'unchanged' };
  try {
    const config = smtpConfig();
    const contents = renderEmail(claimed.kind, claimed.name, claimed.occurredAtMs);
    const result = await (transport || mailTransport()).sendMail({
      from: { name: process.env.SMTP_FROM_NAME || 'Exam Sidemann', address: config.auth.user },
      to: { address: claimed.recipient, name: claimed.name },
      messageId: `<${id}@${config.auth.user.split('@')[1]}>`,
      ...contents,
    });
    if (!result.accepted?.length || result.rejected?.length) throw new Error('Recipient not accepted');
    await ref.update({ status: 'sent', nextAttemptAtMs: FieldValue.delete(), sentAtMs: Date.now(), leaseUntilMs: 0, lastError: FieldValue.delete() });
    return { id, status: 'sent' };
  } catch (error) {
    const failed = Number(claimed.attempts || 0) + 1 >= MAX_ATTEMPTS;
    // SMTP errors can contain connection details. Store only a bounded code.
    const code = typeof (error as any)?.code === 'string' ? String((error as any).code).replace(/[^A-Z0-9_-]/gi, '').slice(0, 40) : 'DELIVERY_FAILED';
    await ref.update({ status: failed ? 'failed' : 'retry', lastError: code, leaseUntilMs: 0, nextAttemptAtMs: failed ? FieldValue.delete() : Date.now() + Math.min(3_600_000, 60_000 * 2 ** Number(claimed.attempts || 0)) });
    return { id, status: failed ? 'failed' : 'retry' };
  }
}

export async function runSession(token: DecodedIdToken) {
  const { db, auth } = adminServices();
  const user = await auth.getUser(token.uid);
  if (user.disabled) throw new AutomationError(403, 'This account is disabled.');
  const profile = (await db.collection('users').doc(token.uid).get()).data() || {};
  const approval = profile.role === 'teacher' ? await approveTeacher(token.uid, PRIMARY_PROJECT, 'automatic', true) : null;
  const signIn = await queueSignIn(token, user, profile);
  const ids = [approval?.emailId, signIn].filter(Boolean) as string[];
  const delivery = await Promise.all(ids.map(id => deliverEmail(id)));
  return { verified: approval?.verified ?? false, delivery };
}

export async function submitTeacherApplication(uid: string, input: Record<string, unknown>) {
  const required = ['firstName', 'lastName', 'phone', 'school', 'province', 'subject', 'qualification'];
  const fields: Record<string, string> = {};
  for (const key of required) {
    const maximum = key === 'qualification' ? 240 : ['firstName', 'lastName'].includes(key) ? 80 : key === 'phone' ? 50 : 160;
    if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > maximum) throw new AutomationError(400, `Provide a valid ${key}.`);
    fields[key] = input[key].trim();
  }
  if (!['high-school', 'polytechnic'].includes(String(input.educationType))) throw new AutomationError(400, 'Choose your teaching level.');
  const subjects = Array.isArray(input.subjects) ? [...new Set(input.subjects.filter((s): s is string => typeof s === 'string' && s.trim().length > 0 && s.length <= 160))].slice(0, 30) : [fields.subject];
  const teachingMode = ['In-Person', 'Online', 'Both'].includes(String(input.teachingMode)) ? String(input.teachingMode) : 'In-Person';
  const teachingLocation = typeof input.teachingLocation === 'string' ? input.teachingLocation.trim().slice(0, 160) : '';
  const { db, auth } = adminServices();
  const user = await auth.getUser(uid);
  if (!user.email || user.disabled) throw new AutomationError(400, 'A valid email account is required.');
  const ref = db.collection('users').doc(uid);
  await db.runTransaction(async tx => {
    const current = await tx.get(ref);
    if (current.data()?.role === 'admin') throw new AutomationError(400, 'Administrator accounts cannot be converted into teacher accounts.');
    if (current.data()?.role === 'teacher') return; // Never overwrite a reviewed application on retry.
    tx.set(ref, {
      firstName: fields.firstName, lastName: fields.lastName, email: user.email,
      phone: fields.phone, school: fields.school, province: fields.province,
      educationType: input.educationType, grade: input.educationType === 'polytechnic' ? fields.subject : 'High School',
      enrolledSubjects: subjects, role: 'teacher', teacherVerified: false, profileCompleted: true,
      ...(!current.exists ? { streak: 1, visitCount: 1, totalPoints: 0, createdAt: FieldValue.serverTimestamp(), lastLoginDate: FieldValue.serverTimestamp(), completedTopics: {}, topicScores: {} } : {}),
      teacherApplication: { subjects, teachingMode, teachingLocation, educationType: input.educationType, teachingArea: fields.subject, primarySubject: fields.subject, qualification: fields.qualification, status: 'pending', submittedAt: FieldValue.serverTimestamp() },
    }, { merge: true });
  });
  const approval = await approveTeacher(uid, PRIMARY_PROJECT, 'automatic', true);
  const delivery = approval.emailId ? await deliverEmail(approval.emailId) : null;
  return { verified: approval.verified, delivery };
}

/** Process existing pending applications in small, resumable pages. */
export async function sweepTeachers(projectId: string, cursor?: string) {
  if (!(await getSettings()).autoVerifyTeachers) return { approved: 0, cursor: null };
  const { db } = adminServices(projectId);
  let query = db.collection('users').where('role', '==', 'teacher').orderBy(FieldPath.documentId()).limit(20);
  if (cursor) query = query.startAfter(cursor);
  const page = await query.get();
  let approved = 0;
  for (const doc of page.docs) {
    if (doc.data().teacherVerified || doc.data().teacherApplication?.status === 'rejected') continue;
    const outcome = await approveTeacher(doc.id, projectId, 'automatic', true);
    if (outcome.verified) approved++;
  }
  // A bounded worker sends a few immediately; remaining messages stay durable.
  await drainEmails(projectId);
  return { approved, cursor: page.size === 20 ? page.docs.at(-1)!.id : null };
}

export async function drainEmails(projectId = PRIMARY_PROJECT) {
  const db = adminServices(projectId).db;
  const settings = await getSettings();
  if (!settings.emailsEnabled) return [];
  const queued = await db.collection('email_outbox').where('nextAttemptAtMs', '<=', Date.now()).orderBy('nextAttemptAtMs').limit(100).get();
  const due = queued.docs.filter(doc => ['pending', 'retry', 'sending'].includes(doc.data().status) && Number(doc.data().leaseUntilMs || 0) <= Date.now() && (doc.data().kind === 'sign-in' ? settings.signInEmails : settings.teacherApprovalEmails)).slice(0, 6);
  const deliveries = [];
  for (let start = 0; start < due.length; start += 3) {
    deliveries.push(...await Promise.all(due.slice(start, start + 3).map(doc => deliverEmail(doc.id, db))));
  }
  return deliveries;
}

export async function queueTest(user: UserRecord) {
  if (!user.email) throw new AutomationError(400, 'Your administrator account needs an email address.');
  smtpConfig();
  const id = eventId('test', user.uid, Math.floor(Date.now() / 60_000));
  const db = adminServices().db;
  const ref = db.collection('email_outbox').doc(id);
  await db.runTransaction(async tx => {
    if (!(await tx.get(ref)).exists) tx.create(ref, message('test', user, displayName(user), Date.now()));
  });
  return deliverEmail(id);
}

export async function automationStatus() {
  const connection = connectionStatus();
  const groups = await Promise.all(connection.projects.map(async projectId => {
    const recent = await adminServices(projectId).db.collection('email_outbox').orderBy('createdAtMs', 'desc').limit(12).get();
    return recent.docs.map(doc => ({ id: doc.id, projectId, kind: doc.data().kind, recipient: doc.data().recipient, status: doc.data().status, attempts: doc.data().attempts, createdAtMs: doc.data().createdAtMs, lastError: doc.data().lastError || '' }));
  }));
  return { settings: await getSettings(), connection, deliveries: groups.flat().sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 12) };
}
