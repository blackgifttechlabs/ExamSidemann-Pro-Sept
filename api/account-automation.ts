import { timingSafeEqual } from 'node:crypto';
import { ADMIN_UIDS, AutomationError, PRIMARY_PROJECT, adminServices, connectionStatus, mailTransport } from '../server/email/config';
import { approveTeacher, automationStatus, deliverEmail, drainEmails, getSettings, queueTest, runSession, saveSettings, submitTeacherApplication, sweepTeachers, validateSettings } from '../server/email/automation';
import { renderEmail } from '../server/email/templates';

export const config = { maxDuration: 60 };

const json = (res: any, status: number, data: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
};

export function cronAuthorized(header: unknown, secret = process.env.CRON_SECRET) {
  if (!secret || secret.length < 32 || typeof header !== 'string') return false;
  const expected = Buffer.from(`Bearer ${secret}`), actual = Buffer.from(header);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const administrator = (token: { uid: string; admin?: unknown }) => token.admin === true || ADMIN_UIDS.has(token.uid);

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      if (!cronAuthorized(req.headers?.authorization)) throw new AutomationError(401, 'A valid worker credential is required.');
      const primary = adminServices().db;
      const settings = await getSettings();
      const work = await Promise.all(connectionStatus().projects.map(async projectId => {
        if (!settings.autoVerifyTeachers) return { projectId, deliveries: await drainEmails(projectId) };
        const cursorRef = primary.collection('automation_workers').doc(projectId);
        const cursor = (await cursorRef.get()).data()?.cursor;
        const result = await sweepTeachers(projectId, typeof cursor === 'string' ? cursor : undefined);
        await cursorRef.set({ cursor: result.cursor, lastRunAtMs: Date.now() });
        return { projectId, ...result };
      }));
      return json(res, 200, { work });
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST, GET'); throw new AutomationError(405, 'Use POST for account automation.'); }
    const authorization = /^Bearer\s+(.+)$/i.exec(String(req.headers?.authorization || ''));
    if (!authorization) throw new AutomationError(401, 'Sign in to continue.');
    const { auth } = adminServices();
    let token;
    try { token = await auth.verifyIdToken(authorization[1], true); }
    catch { throw new AutomationError(401, 'Your sign-in session is invalid or expired.'); }
    let body;
    try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
    catch { throw new AutomationError(400, 'Invalid JSON request.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 20_000) throw new AutomationError(400, 'Invalid automation request.');

    if (body.action === 'session') return json(res, 200, await runSession(token));
    if (body.action === 'teacher-application') return json(res, 200, await submitTeacherApplication(token.uid, body.application || {}));
    if (!administrator(token)) throw new AutomationError(403, 'Administrator access is required.');

    switch (body.action) {
      case 'status': return json(res, 200, await automationStatus());
      case 'settings': {
        const settings = validateSettings(body.settings);
        await saveSettings(settings, token.uid);
        return json(res, 200, { settings });
      }
      case 'check-connection': {
        try { await mailTransport().verify(); }
        catch (error) {
          if (error instanceof AutomationError) throw error;
          throw new AutomationError(502, 'The mail server could not authenticate. Check SMTP_USER, the Gmail app password, and the SMTP host/port.');
        }
        return json(res, 200, { connected: true });
      }
      case 'test-email': return json(res, 200, await queueTest(await auth.getUser(token.uid)));
      case 'preview': {
        if (!['teacher-approved', 'sign-in'].includes(body.kind)) throw new AutomationError(400, 'Choose a supported email template.');
        return json(res, 200, renderEmail(body.kind, 'Sample User', Date.now()));
      }
      case 'verify-teacher': {
        if (typeof body.uid !== 'string' || !body.uid || body.uid.length > 128 || body.uid.includes('/')) throw new AutomationError(400, 'Choose a valid teacher.');
        const projectId = typeof body.projectId === 'string' ? body.projectId : PRIMARY_PROJECT;
        const result = await approveTeacher(body.uid, projectId, token.uid, false);
        const delivery = result.emailId ? await deliverEmail(result.emailId, adminServices(projectId).db) : null;
        return json(res, 200, { ...result, delivery });
      }
      case 'sweep-teachers': {
        if (body.cursor != null && (typeof body.cursor !== 'string' || body.cursor.length > 128 || body.cursor.includes('/'))) throw new AutomationError(400, 'Invalid page cursor.');
        return json(res, 200, await sweepTeachers(body.projectId || PRIMARY_PROJECT, body.cursor || undefined));
      }
      case 'retry-emails': {
        const work = await Promise.all(connectionStatus().projects.map(async projectId => ({ projectId, deliveries: await drainEmails(projectId) })));
        return json(res, 200, { work });
      }
      case 'retry-email': {
        if (typeof body.id !== 'string' || !/^[a-f0-9]{64}$/.test(body.id)) throw new AutomationError(400, 'Invalid email record.');
        const db = adminServices(body.projectId || PRIMARY_PROJECT).db;
        const ref = db.collection('email_outbox').doc(body.id);
        await db.runTransaction(async tx => {
          const current = (await tx.get(ref)).data();
          if (!current || !['failed', 'retry'].includes(current.status)) throw new AutomationError(409, 'This message is not waiting for a retry.');
          tx.update(ref, { status: 'retry', attempts: 0, nextAttemptAtMs: 0, leaseUntilMs: 0 });
        });
        return json(res, 200, await deliverEmail(body.id, db));
      }
      default: throw new AutomationError(400, 'Unknown automation action.');
    }
  } catch (error) {
    if (error instanceof AutomationError) return json(res, error.status, { error: error.message });
    // Never return SMTP errors, access tokens, or private keys to the browser.
    console.error('Account automation failed', { code: (error as any)?.code || 'INTERNAL' });
    return json(res, 500, { error: 'Account automation could not complete. Check the server configuration and delivery log.' });
  }
}
