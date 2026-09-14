import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  School,
  UserRound,
} from 'lucide-react';
import { auth, registerWithEmail } from '../../services/firebase';
import { POLYTECHNIC_COURSE_GROUPS } from '../../data/polytechnicCourses';
import { HIGH_SCHOOL_SUBJECTS } from '../../data/constants';

import { accountAutomation } from '../../services/accountAutomation';
import { readTutorDraft, TUTOR_DRAFT_KEY } from '../tutors/tutorDraft';

type Props = {
  onNavigate: (page: string, params?: any) => void;
  onLoginRequest: () => void;
};

const TEACHING_SUBJECTS = [...HIGH_SCHOOL_SUBJECTS, 'Other'];

const PROVINCES = [
  'Bulawayo',
  'Harare',
  'Manicaland',
  'Mashonaland Central',
  'Mashonaland East',
  'Mashonaland West',
  'Masvingo',
  'Matabeleland North',
  'Matabeleland South',
  'Midlands',
  'Online only',
];

export const TeacherSignupPage: React.FC<Props> = ({ onNavigate, onLoginRequest }) => {
  const [draft] = useState(readTutorDraft);
  const signedIn = auth.currentUser;
  const [verified, setVerified] = useState(false);
  const [educationType, setEducationType] = useState<'high-school' | 'polytechnic'>('high-school');
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    firstName: (draft?.fullName || signedIn?.displayName || '').split(' ')[0],
    lastName: (draft?.fullName || signedIn?.displayName || '').split(' ').slice(1).join(' '),
    email: signedIn?.email || '',
    phone: draft?.phone || '',
    school: draft ? 'Independent tutor' : '',
    province: '',
    subject: draft?.subjects[0] || '',
    teachingMode: draft?.teachingMode || 'In-Person',
    teachingLocation: draft?.location || '',
    qualification: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateStep = (step: 1 | 2 | 3) => {
    if (step === 1 && (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim())) {
      setError('Complete your name, email address, and phone number to continue.');
      return false;
    }
    if (step === 2 && (!form.school.trim() || !form.province || !form.subject || !form.qualification.trim())) {
      setError('Complete your institution, location, teaching area, and qualification to continue.');
      return false;
    }
    setError('');
    return true;
  };

  const nextMobileStep = () => {
    if (!validateStep(mobileStep)) return;
    setMobileStep((current) => Math.min(3, current + 1) as 1 | 2 | 3);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!validateStep(1) || !validateStep(2)) return;

    if (!auth.currentUser && form.password.length < 6) {
      setError('Your password must contain at least 6 characters.');
      return;
    }
    if (!auth.currentUser && form.password !== form.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setError('Accept the terms and teacher listing requirements to continue.');
      return;
    }

    setLoading(true);
    try {
      const displayName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const teacher = auth.currentUser || await registerWithEmail(form.email.trim(), form.password, displayName);
      const result = await accountAutomation<{ verified: boolean }>('teacher-application', { application: {
        firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim(),
        school: form.school.trim(), province: form.province, subject: form.subject,
        subjects: [...new Set([form.subject, ...(draft?.subjects || [])])],
        teachingMode: form.teachingMode, teachingLocation: form.teachingLocation,
        qualification: form.qualification.trim(), educationType,
      } }, teacher);
      setVerified(result.verified);
      try { sessionStorage.removeItem(TUTOR_DRAFT_KEY); } catch { /* Optional storage. */ }
      setSubmitted(true);
    } catch (caught: any) {
      const code = String(caught?.code || '');
      if (code.includes('email-already-in-use')) {
        setError('An account already exists for this email. Sign in instead.');
      } else if (code.includes('invalid-email')) {
        setError('Enter a valid email address.');
      } else {
        setError(caught?.message || 'Could not create the teacher account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex h-dvh items-center justify-center overflow-hidden bg-[#f3f5f8] px-4 dark:bg-[#08080b]">
        <section className="w-full max-w-xl rounded-[8px] border border-slate-200 bg-white p-7 text-center shadow-xl dark:border-white/10 dark:bg-[#141419] sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"><CheckCircle size={30} /></span>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-amber-500">Application received</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Your teacher account is ready</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{verified ? 'Your teacher profile is verified. You can now publish your extra lessons from the dashboard.' : 'Your profile has been submitted for verification. Publishing classes will be available after an administrator approves the account.'}</p>
          <button onClick={() => window.location.assign('/dashboard')} className="mt-7 inline-flex items-center gap-2 rounded-[8px] bg-[#151821] px-5 py-3 text-sm font-black text-white hover:bg-amber-500 dark:bg-amber-500">Go to teacher dashboard <ArrowRight size={16} /></button>
        </section>
      </main>
    );
  }

  const inputClass = 'w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/[0.07]';
  const labelClass = 'mb-1 block text-[11px] font-black text-slate-600 dark:text-slate-300';
  const mobileSection = (step: 1 | 2 | 3) => `${mobileStep === step ? 'block' : 'hidden'} space-y-3 lg:contents`;

  return (
    <main className="fixed inset-0 z-40 grid h-dvh w-screen overflow-hidden bg-white dark:bg-[#121217] lg:grid-cols-[0.78fr_1.22fr]">
          <section className="relative hidden h-full overflow-hidden bg-slate-900 lg:block">
            <img src="/images/extra-lessons/teacher.jpg" alt="Teacher holding books" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5" />
            <button onClick={() => onNavigate('extra-lessons')} className="absolute left-7 top-7 z-10 flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs font-black text-white backdrop-blur-md hover:bg-black/55"><ArrowLeft size={16} /> Back</button>
            <div className="absolute inset-x-0 bottom-0 p-8 text-white xl:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-amber-500"><GraduationCap size={23} /></span>
              <h1 className="mt-5 text-3xl font-black leading-tight xl:text-4xl">Share your subject expertise</h1>
              <p className="mt-3 text-sm leading-6 text-white/75">Create a verified teacher profile, publish extra lessons, receive student requests, and manage your classes.</p>
              <div className="mt-6 space-y-3 border-t border-white/20 pt-5 text-sm font-bold text-white/80">
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Publish lesson schedules and fees</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Receive and approve student requests</p>
                <p className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Manage classes from your dashboard</p>
              </div>
            </div>
          </section>

          <section className="relative flex h-full min-h-0 flex-col overflow-y-auto p-4 pt-32 sm:p-6 sm:pt-36 lg:overflow-y-auto lg:p-7 xl:p-9">
            <div className="absolute inset-x-0 top-0 h-28 overflow-hidden lg:hidden">
              <img src="/images/extra-lessons/teacher.jpg" alt="Teacher holding books" className="h-full w-full object-cover object-[center_30%]" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
              <button onClick={() => onNavigate('extra-lessons')} className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-2 text-xs font-black text-white backdrop-blur-md hover:bg-black/65"><ArrowLeft size={16} /> Back</button>
            </div>
            <div className="flex shrink-0 items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-500">Teacher registration</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Create your teacher account</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Complete your teaching details to enable lesson listings.</p>
              </div>
              <button onClick={onLoginRequest} className="hidden shrink-0 text-xs font-black text-slate-500 hover:text-amber-600 lg:block dark:text-slate-300">Already registered? Sign in</button>
            </div>

            <div className="mt-4 flex shrink-0 items-center gap-2 lg:hidden">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${mobileStep >= step ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-white/10'}`}>{step}</span>
                  {step < 3 && <span className={`h-0.5 flex-1 ${mobileStep > step ? 'bg-amber-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 min-h-0 flex-1 lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-4 lg:gap-y-3">
              <section className={mobileSection(1)}>
                <div className="mb-4 lg:hidden"><p className="text-lg font-black text-slate-900 dark:text-white">Your details</p><p className="text-xs text-slate-500">Tell us how to identify and contact you.</p></div>
                <label><span className={labelClass}>First name</span><div className="relative"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} placeholder="First name" className={`${inputClass} pl-10`} /></div></label>
                <label><span className={labelClass}>Last name</span><input value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} placeholder="Last name" className={inputClass} /></label>
                <label><span className={labelClass}>Email address</span><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="email" readOnly={!!signedIn} value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="teacher@example.com" className={`${inputClass} pl-10`} /></div></label>
                <label><span className={labelClass}>Phone number</span><input type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="e.g. +263 77 000 0000" className={inputClass} /></label>
              </section>

              <section className={mobileSection(2)}>
                <div className="mb-4 lg:hidden"><p className="text-lg font-black text-slate-900 dark:text-white">Teaching profile</p><p className="text-xs text-slate-500">Choose your institution type and teaching area.</p></div>
                <div className="lg:col-span-2">
                <span className={labelClass}>Where do you teach?</span>
                <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-slate-100 p-1 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setEducationType('high-school');
                      updateField('subject', '');
                    }}
                    className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-black transition-colors ${educationType === 'high-school' ? 'bg-white text-amber-600 shadow-sm dark:bg-white/10 dark:text-amber-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    <School size={16} /> High School
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEducationType('polytechnic');
                      updateField('subject', '');
                    }}
                    className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-black transition-colors ${educationType === 'polytechnic' ? 'bg-white text-violet-600 shadow-sm dark:bg-white/10 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    <GraduationCap size={16} /> Polytechnic
                  </button>
                </div>
              </div>
                <label><span className={labelClass}>School or organisation</span><div className="relative"><School className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input required value={form.school} onChange={(event) => updateField('school', event.target.value)} placeholder="Where you teach" className={`${inputClass} pl-10`} /></div></label>
                <label><span className={labelClass}>Province</span><select required value={form.province} onChange={(event) => updateField('province', event.target.value)} className={inputClass}><option value="">Select province</option>{PROVINCES.map((province) => <option key={province}>{province}</option>)}</select></label>
                <label>
                  <span className={labelClass}>{educationType === 'polytechnic' ? 'Primary course taught' : 'Primary teaching subject'}</span>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select required value={form.subject} onChange={(event) => updateField('subject', event.target.value)} className={`${inputClass} pl-10`}>
                      <option value="">{educationType === 'polytechnic' ? 'Select course' : 'Select subject'}</option>
                      {educationType === 'polytechnic'
                        ? POLYTECHNIC_COURSE_GROUPS.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.courses.map((course) => <option key={course}>{course}</option>)}
                            </optgroup>
                          ))
                        : TEACHING_SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
                    </select>
                  </div>
                </label>
                {draft && <p className="text-xs text-slate-500 lg:col-span-2">Subjects from your invitation: {draft.subjects.join(', ')}</p>}
                <label><span className={labelClass}>Teaching mode</span><select value={form.teachingMode} onChange={e => updateField('teachingMode', e.target.value)} className={inputClass}><option>In-Person</option><option>Online</option><option>Both</option></select></label>
                <label><span className={labelClass}>City or area</span><input value={form.teachingLocation} onChange={e => updateField('teachingLocation', e.target.value)} className={inputClass} placeholder="e.g. Harare, Avondale" /></label>
                <label><span className={labelClass}>Highest relevant qualification</span><input required value={form.qualification} onChange={(event) => updateField('qualification', event.target.value)} placeholder="e.g. BSc Mathematics Education" className={inputClass} /></label>
              </section>

              <section className={mobileSection(3)}>
                <div className="mb-4 lg:hidden"><p className="text-lg font-black text-slate-900 dark:text-white">Secure your account</p><p className="text-xs text-slate-500">Set your password and submit for verification.</p></div>
                {!signedIn && <><label><span className={labelClass}>Password</span><div className="relative"><LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="At least 6 characters" className={`${inputClass} px-10`} /><button type="button" title={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
                <label><span className={labelClass}>Confirm password</span><input required minLength={6} type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} placeholder="Repeat password" className={inputClass} /></label></>}
              <label className="flex cursor-pointer items-start gap-3 rounded-[8px] bg-slate-50 p-3 dark:bg-white/5 lg:col-span-2">
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-500" />
                <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">I confirm that my teaching details are accurate and agree to the platform terms, verification process, and lesson listing requirements.</span>
              </label>
              </section>

              {error && <p role="alert" className="mt-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 lg:col-span-2 lg:mt-0">{error}</p>}

              <div className="mt-5 flex gap-3 lg:col-span-2 lg:mt-0">
                {mobileStep > 1 && <button type="button" onClick={() => { setError(''); setMobileStep((current) => Math.max(1, current - 1) as 1 | 2 | 3); }} className="flex flex-1 items-center justify-center gap-2 rounded-[8px] border border-slate-200 py-3 text-sm font-black text-slate-600 lg:hidden dark:border-white/10 dark:text-slate-300"><ArrowLeft size={16} /> Back</button>}
                {mobileStep < 3 ? (
                  <button type="button" onClick={nextMobileStep} className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-amber-500 py-3 text-sm font-black text-white hover:bg-amber-600 lg:hidden">Continue <ArrowRight size={16} /></button>
                ) : (
                  <button disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-amber-500 py-3 text-sm font-black text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? <><Loader2 className="animate-spin" size={17} /> Creating account...</> : <>Create teacher account <ArrowRight size={17} /></>}
                  </button>
                )}
                <button disabled={loading} className="hidden w-full items-center justify-center gap-2 rounded-[8px] bg-amber-500 py-3 text-sm font-black text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 lg:flex">
                {loading ? <><Loader2 className="animate-spin" size={17} /> Creating account...</> : <>Create teacher account <ArrowRight size={17} /></>}
                </button>
              </div>
            </form>

            <p className="mt-4 shrink-0 text-center text-xs text-slate-500 lg:hidden dark:text-slate-400">Already registered? <button onClick={onLoginRequest} className="font-black text-slate-900 hover:text-amber-600 dark:text-white">Sign in</button></p>
          </section>
    </main>
  );
};
