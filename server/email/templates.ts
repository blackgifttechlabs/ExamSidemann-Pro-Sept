import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { siteUrl } from './config';

export type EmailKind = 'sign-in' | 'teacher-approved' | 'test';
let template: string | undefined;
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

export function renderEmail(kind: EmailKind, name: string, occurredAt: number, baseUrl = siteUrl()) {
  template ??= readFileSync(join(process.cwd(), 'server/email/template.html'), 'utf8');
  const teacher = kind === 'teacher-approved';
  const test = kind === 'test';
  const time = new Date(occurredAt).toLocaleString('en-GB', { timeZone: 'Africa/Harare', dateStyle: 'medium', timeStyle: 'short' });
  const fields = {
    subject: teacher ? 'Your teacher account is approved — Exam Sidemann' : test ? 'Your email connection works — Exam Sidemann' : 'You signed in to Exam Sidemann',
    heading: teacher ? 'Your Educator Account is Ready' : test ? 'Your Email Connection is Ready' : 'Welcome to Exam Sidemann',
    subtitle: teacher ? 'Start offering extra lessons on Exam Sidemann 🎉' : 'Your learning journey continues here',
    name: name.trim().slice(0, 160) || 'there',
    intro: teacher
      ? 'Your teacher application has been approved. Complete your teacher profile and list your extra lessons so students across Zimbabwe can find you and book sessions.'
      : test ? 'This test message confirms that your Exam Sidemann email connection is working. Automatic messages will use this design.'
        : `You successfully signed in to Exam Sidemann on ${time} (Harare time). Open your dashboard to continue learning.`,
    ctaUrl: `${baseUrl}/dashboard/`,
    ctaLabel: teacher ? 'Set Up Your Tutor Profile' : 'Open Your Dashboard',
    sectionTitle: teacher ? 'How To Grow Your Potential Income' : 'Make the most of your account',
    featureTitle: teacher ? 'List Extra Lessons & Tutors' : 'Continue learning at your own pace',
    featureText: teacher ? 'Add your subject specializations, schedules, and rates so students searching for extra tuition can reach out directly.'
      : 'Find your class notes, past papers, practical experiments, and saved progress in one place.',
    reason: teacher ? 'You received this email because your teacher application on Exam Sidemann was approved.'
      : test ? 'You requested this test email from the administrator dashboard.'
        : 'You received this email because your account signed in. If this was not you, reset your password from the sign-in page.',
    siteUrl: baseUrl,
  };
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, key: keyof typeof fields) => escapeHtml(fields[key] ?? ''));
  const text = `${fields.heading}\n\nHi ${fields.name},\n\n${fields.intro}\n\n${fields.ctaLabel}: ${fields.ctaUrl}\n\n${fields.featureTitle}\n${fields.featureText}\n\n${fields.reason}\n\nThe Exam Sidemann Team`;
  return { subject: fields.subject, html, text };
}
