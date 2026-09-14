import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

export const PRIMARY_PROJECT = 'testing-3d5b2';
export const SECONDARY_PROJECT = 'examsidemann-login-4ec4f';
export const ADMIN_UIDS = new Set(['lGSiV47o0lRRHiczIhUZR7VRhbb2', 'TrBcEGUjx4huoLVm0cc6iBiw2ak2']);

export class AutomationError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function adminServices(projectId = PRIMARY_PROJECT) {
  if (![PRIMARY_PROJECT, SECONDARY_PROJECT].includes(projectId)) throw new AutomationError(400, 'Unknown user database.');
  const variable = projectId === PRIMARY_PROJECT ? 'FIREBASE_SERVICE_ACCOUNT_JSON' : 'FIREBASE_SECONDARY_SERVICE_ACCOUNT_JSON';
  const name = `account-automation-${projectId}`;
  let app = getApps().find(candidate => candidate.name === name);
  if (!app) {
    let credentials;
    try {
      credentials = JSON.parse(process.env[variable] || '');
      if (credentials.project_id !== projectId || !credentials.client_email || !credentials.private_key) throw new Error();
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    } catch {
      throw new AutomationError(503, `Configure ${variable} on the server to connect this user database.`);
    }
    app = initializeApp({ credential: cert(credentials), projectId }, name);
  }
  return { db: getFirestore(app), auth: getAuth(app) };
}

export function siteUrl() {
  const url = new URL(process.env.SITE_URL || 'https://www.examsidemann.com');
  if (url.protocol !== 'https:' || url.username || url.password) throw new AutomationError(503, 'SITE_URL must be an HTTPS website URL.');
  return url.origin;
}

export function smtpConfig() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const user = (process.env.SMTP_USER || '').trim();
  const password = process.env.SMTP_PASS || '';
  const pass = host === 'smtp.gmail.com' ? password.replace(/\s/g, '') : password;
  if (!host || ![465, 587].includes(port) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(user) || !pass) {
    throw new AutomationError(503, 'Add SMTP_USER and SMTP_PASS to the server environment. SMTP_PORT must be 465 or 587.');
  }
  return {
    host, port, secure: port === 465, requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 8_000, greetingTimeout: 8_000, socketTimeout: 12_000,
    tls: { minVersion: 'TLSv1.2' as const },
    disableFileAccess: true, disableUrlAccess: true,
  };
}

export function mailTransport() {
  return nodemailer.createTransport(smtpConfig());
}

export function connectionStatus() {
  let smtpReady = false;
  try { smtpConfig(); smtpReady = true; } catch { /* Return configuration state, never credentials. */ }
  return {
    smtpReady,
    sender: (process.env.SMTP_USER || '').trim(),
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    projects: [PRIMARY_PROJECT, ...(process.env.FIREBASE_SECONDARY_SERVICE_ACCOUNT_JSON ? [SECONDARY_PROJECT] : [])],
  };
}
