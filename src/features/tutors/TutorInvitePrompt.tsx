import React, { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { HIGH_SCHOOL_SUBJECTS } from '../../data/constants';
import { TUTOR_DRAFT_KEY, readTutorDraft } from './tutorDraft';
import './tutorInvite.css';

const DISMISSED = 'examsidemann:tutor-invite-dismissed';
const ELAPSED = 'examsidemann:tutor-invite-elapsed';
const subjects = [...new Set([...HIGH_SCHOOL_SUBJECTS, 'Accounting', 'Information Technology', 'Electrical Engineering', 'Other'])];
export function TutorInvitePrompt({ eligible, onContinue }: { eligible: boolean; onContinue: () => void }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => { try { return !!sessionStorage.getItem(DISMISSED); } catch { return false; } });
  const [draft, setDraft] = useState(() => readTutorDraft() || { fullName: '', phone: '', subjects: [] as string[], teachingMode: 'In-Person', location: '', savedAt: 0 });
  const [error, setError] = useState('');
  useEffect(() => {
    if (dismissed) return;
    let elapsed = 0;
    try { elapsed = Number(sessionStorage.getItem(ELAPSED)) || 0; } catch { /* Optional storage. */ }
    let previous = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') elapsed += Math.min(now - previous, 1500);
      previous = now;
      try { sessionStorage.setItem(ELAPSED, String(elapsed)); } catch { /* Optional storage. */ }
      const blocked = !!document.querySelector('[aria-modal="true"], .privacy-consent-backdrop');
      if (blocked) setOpen(false);
      else if (elapsed >= 120_000 && eligible) setOpen(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [dismissed, eligible]);
  const dismiss = () => {
    setDismissed(true); setOpen(false);
    try { sessionStorage.setItem(DISMISSED, '1'); } catch { /* In-memory dismissal still works. */ }
  };
  if (!open || !eligible || dismissed) return null;
  return <aside className="tutor-invite" role="dialog" aria-label="List your extra lessons" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); dismiss(); } }}>
    <button className="tutor-invite-close" aria-label="Close tutor invitation" onClick={dismiss}><X size={18} /></button>
    <h2>List Your Extra Lessons &amp; Get Discovered</h2>
    <p className="tutor-invite-subtitle">Reach local and remote students searching for tutors in your subjects. Display your location, schedule, and direct contact details so students can connect with you instantly.</p>
    <ul className="tutor-invite-benefits">
      <li><strong>Direct Student Leads:</strong> Students and parents can contact you directly via phone or WhatsApp.</li>
      <li><strong>Flexible Listing:</strong> Local or online lessons across ZJC, O Level, A Level, and Polytechnic subjects.</li>
      <li><strong>100% Control:</strong> You set your fees, teaching location, and schedule.</li>
    </ul>
    <form onSubmit={event => {
      event.preventDefault();
      if (!draft.fullName.trim() || draft.phone.replace(/\D/g, '').length < 7 || draft.phone.replace(/\D/g, '').length > 15 || !draft.subjects.length || (draft.teachingMode !== 'Online' && !draft.location.trim())) { setError('Enter your name, a valid phone number, subjects, and teaching location.'); return; }
      try { sessionStorage.setItem(TUTOR_DRAFT_KEY, JSON.stringify({ ...draft, savedAt: Date.now() })); }
      catch { setError('Allow session storage so we can carry your details into signup.'); return; }
      dismiss(); onContinue();
    }}>
      <label>Full Name<input autoComplete="name" required maxLength={120} value={draft.fullName} onChange={e => setDraft({ ...draft, fullName: e.target.value })} /></label>
      <label>Phone Number / WhatsApp<input type="tel" autoComplete="tel" required maxLength={25} placeholder="+263…" value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} /></label>
      <details className="tutor-invite-subjects"><summary>Primary Subjects Offered <span>{draft.subjects.length ? `${draft.subjects.length} selected` : 'Select'} <ChevronDown size={13} /></span></summary><div>{subjects.map(subject => <label key={subject}><input type="checkbox" checked={draft.subjects.includes(subject)} onChange={e => setDraft({ ...draft, subjects: e.target.checked ? [...draft.subjects, subject] : draft.subjects.filter(s => s !== subject) })} />{subject}</label>)}</div></details>
      <label>Teaching Mode &amp; Location<select value={draft.teachingMode} onChange={e => setDraft({ ...draft, teachingMode: e.target.value })}><option>In-Person</option><option>Online</option><option>Both</option></select></label>
      <label className="tutor-invite-location">City or area {draft.teachingMode === 'Online' && '(optional)'}<input required={draft.teachingMode !== 'Online'} autoComplete="address-level2" maxLength={120} placeholder="e.g. Harare, Avondale" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} /></label>
      {error && <p role="alert">{error}</p>}
      <button className="tutor-invite-primary" type="submit">List My Lessons Now</button>
      <p className="tutor-invite-note">Complete your teacher profile next to publish lessons.</p>
      <button className="tutor-invite-dismiss" type="button" onClick={dismiss}>Maybe Later</button>
    </form>
  </aside>;
}
