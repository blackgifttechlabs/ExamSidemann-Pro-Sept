import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  School,
  Award,
  ArrowRight,
  AlertCircle,
  MapPin,
  Check,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Search,
  X,
  Building2,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, db } from '../../services/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { POLYTECHNIC_COURSE_GROUPS } from '../../data/polytechnicCourses';
import { searchSchools, type SchoolSuggestion } from '../../data/schoolRegistry';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type UserRole = 'student' | 'teacher' | 'parent';
type EducationType = 'high-school' | 'polytechnic';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successLogin, setSuccessLogin] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3 | 4>(1);
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    school: '',
    grade: '',
    educationType: '' as EducationType | '',
    subject: '',
  });

  const isPolytechnic = formData.educationType === 'polytechnic';

  const schoolSuggestions = useMemo(() => {
    return searchSchools(schoolSearch, {
      educationType: formData.educationType || undefined,
      maximum: 8,
    });
  }, [schoolSearch, formData.educationType]);

  const selectedSchoolRecord = useMemo(() => {
    if (!formData.school.trim()) return undefined;
    return schoolSuggestions.find((s) => s.name.toLowerCase() === formData.school.trim().toLowerCase());
  }, [formData.school, schoolSuggestions]);

  const filteredPolytechnicGroups = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();
    return POLYTECHNIC_COURSE_GROUPS.map((group) => ({
      ...group,
      courses: group.courses.filter((course) =>
        `${group.label} ${course}`.toLowerCase().includes(query)
      ),
    })).filter((group) => group.courses.length > 0);
  }, [courseSearch]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const selectEducationType = (educationType: EducationType) => {
    setFormData((current) => ({
      ...current,
      educationType,
      grade: '',
      school: '',
    }));
    setCourseSearch('');
    setSchoolSearch('');
    setError(null);
  };

  const selectSchool = (school: SchoolSuggestion) => {
    setFormData((current) => ({ ...current, school: school.name }));
    setSchoolSearch(school.name);
    setSchoolMenuOpen(false);
    setError(null);
  };

  const openTeacherSignup = () => {
    onClose();
    window.location.assign('/teacher-signup/');
  };

  const handleSuccess = () => {
    setSuccessLogin(true);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess();
      else onClose();
      setSuccessLogin(false);
      setLoading(false);
    }, 2000);
  };

  const passwordStrength = [
    formData.password.length >= 8,
    /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    /\d/.test(formData.password),
    /[^A-Za-z0-9]/.test(formData.password),
  ].filter(Boolean).length;
  const passwordStrengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

  const advanceSignup = () => {
    setError(null);
    if (signupStep === 1) {
      if (role === 'teacher') {
        openTeacherSignup();
        return;
      }
      setSignupStep(2);
      return;
    }
    if (signupStep === 2) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Enter your first and last name to continue.');
        return;
      }
      if (role === 'student') {
        if (!formData.educationType) {
          setError('Choose High School or Polytechnic to continue.');
          return;
        }
        if (!formData.grade) {
          setError(isPolytechnic ? 'Choose your Polytechnic course to continue.' : 'Choose your current Form to continue.');
          return;
        }
        setSignupStep(3);
      } else {
        setSignupStep(4);
      }
      return;
    }
    if (signupStep === 3) {
      // School is optional: if left empty or skipped, default to 'Private'
      if (!formData.school.trim()) {
        setFormData((c) => ({ ...c, school: 'Private' }));
      }
      setSignupStep(4);
      return;
    }
  };

  const skipSchoolStep = () => {
    setFormData((c) => ({ ...c, school: 'Private' }));
    setError(null);
    setSignupStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && signupStep < 4) {
      advanceSignup();
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await loginWithEmail(formData.email, formData.password);
        handleSuccess();
      } else {
        if (role === 'teacher') {
          openTeacherSignup();
          return;
        }
        const user = await registerWithEmail(formData.email, formData.password, `${formData.firstName.trim()} ${formData.lastName.trim()}`);
        
        const finalSchool = formData.school.trim() || 'Private';

        const userData: any = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          school: finalSchool,
          role: role,
          streak: 1,
          visitCount: 1,
          totalPoints: 0,
          createdAt: Timestamp.now(),
          lastLoginDate: Timestamp.now(),
        };

        if (role === 'student') {
          userData.educationType = formData.educationType;
          userData.grade = formData.grade;
          userData.school = finalSchool;
          userData.profileCompleted = true;
          if (formData.educationType === 'polytechnic') userData.course = formData.grade;
          userData.enrolledSubjects = [];
          userData.completedTopics = {};
          userData.topicScores = {};
          userData.friendRequests = [];
          userData.friends = [];
          userData.parentRequests = [];
          userData.linkedParents = [];
        } else if (role === 'parent') {
          userData.linkedStudents = [];
        }

        await setDoc(doc(db, 'users', user.uid), userData);
        handleSuccess();
      }
    } catch (err: any) {
      setLoading(false);
      const code = String(err?.code || '');
      setError(
        code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please sign in.'
          : code === 'auth/weak-password'
            ? 'Password is too weak. Please use at least 8 characters.'
            : code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
              ? 'Invalid email or password.'
              : err?.message || 'Authentication failed. Please try again.'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      handleSuccess();
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      const code = String(err?.code || '');
      setError(
        code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was closed before it finished.'
          : code === 'auth/popup-blocked'
            ? 'Sign-in popup was blocked by your browser. Please allow popups.'
            : code === 'auth/unauthorized-domain'
              ? 'Google sign-in is not enabled for this domain.'
              : err?.message || 'Google sign-in failed. Please try again.',
      );
    }
  };

  if (successLogin) {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white text-center">
        <style>{`
          @keyframes loginSuccessCircle {
            from { stroke-dashoffset: 190; transform: rotate(-90deg); }
            to { stroke-dashoffset: 0; transform: rotate(-90deg); }
          }
          @keyframes loginSuccessTick {
            0%, 35% { stroke-dashoffset: 56; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes loginSuccessPop {
            0% { opacity: 0; transform: scale(.72); }
            65% { opacity: 1; transform: scale(1.08); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes redirectDot {
            0%, 25%, 100% { opacity: .2; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-2px); }
          }
          .login-success-circle {
            stroke-dasharray: 190;
            stroke-dashoffset: 190;
            transform-origin: center;
            animation: loginSuccessCircle .55s ease-out forwards;
          }
          .login-success-tick {
            stroke-dasharray: 56;
            stroke-dashoffset: 56;
            animation: loginSuccessTick .75s .12s ease-out forwards;
          }
          .login-success-mark {
            animation: loginSuccessPop .48s cubic-bezier(.34,1.56,.64,1) both;
          }
          .redirect-dot {
            display: inline-block;
            animation: redirectDot .9s ease-in-out infinite;
          }
        `}</style>
        <div className="login-success-mark mb-6 h-24 w-24">
          <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
            <circle className="login-success-circle" cx="40" cy="40" r="30" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
            <path className="login-success-tick" d="M25 40.5 35.5 51 57 29" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Login Successful!</h2>
        <p className="mt-2 text-sm font-semibold text-slate-400" aria-live="polite">
          Redirecting
          <span className="redirect-dot ml-0.5">.</span>
          <span className="redirect-dot" style={{ animationDelay: '.15s' }}>.</span>
          <span className="redirect-dot" style={{ animationDelay: '.3s' }}>.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full overflow-y-auto bg-[#182033]">
      <style>{`
        @keyframes popBounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          75% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .animate-pop-bounce {
          animation: popBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .auth-visual-bg {
          background-image: url('/images/people/graduation.jpeg');
          background-size: cover;
          background-position: center top;
        }
        .auth-form-panel input,
        .auth-form-panel select {
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          color: #111827 !important;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }
        .auth-form-panel input::placeholder {
          color: #9ca3af !important;
        }
        .auth-form-panel input:focus,
        .auth-form-panel select:focus {
          border-color: #64748b !important;
          box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.12);
        }
        .thin-scroll::-webkit-scrollbar { width: 4px; }
        .thin-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* Full-page authentication layout */}
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#182033] md:flex-row">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/15 text-white backdrop-blur-md transition-colors hover:bg-black/30 md:left-5 md:top-5"
          aria-label="Leave login page"
        >
          <ArrowLeft size={18} />
        </button>

        {/* 1. Visual Panel */}
        <div className="auth-visual-bg relative h-72 w-full shrink-0 overflow-hidden p-6 md:h-auto md:min-h-dvh md:w-[45%]">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/5 via-transparent to-slate-950/65"></div>
          <div className="absolute bottom-10 left-8 right-8 z-10 hidden text-white md:block">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">Learn. Grow. Achieve.</p>
            <h2 className="mt-3 max-w-md text-4xl font-black leading-tight">Your learning journey starts here.</h2>
          </div>
        </div>

        {/* 2. Form Panel */}
        <div className="auth-form-panel relative z-20 -mt-8 flex flex-1 flex-col overflow-y-auto rounded-t-[28px] bg-[#fbfbfc] px-6 pb-8 pt-10 text-slate-800 thin-scroll md:-ml-8 md:mt-0 md:h-dvh md:justify-center md:rounded-l-[34px] md:rounded-tr-none md:p-10 lg:p-14">
          <div className="mb-7 w-full max-w-sm self-center text-center">
            <h3 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
              {mode === 'signin'
                ? 'Welcome back'
                : signupStep === 1
                  ? 'Choose your role'
                  : signupStep === 2
                    ? 'Tell us about you'
                    : signupStep === 3
                      ? (isPolytechnic ? 'Your Polytechnic' : 'Your High School')
                      : 'Secure your account'}
            </h3>
            <p className="text-sm text-slate-500">
              {mode === 'signin'
                ? `Sign in to your ${role} account.`
                : `Step ${signupStep} of ${role === 'student' ? 4 : 3}`}
            </p>
          </div>

          {(mode === 'signin' || (mode === 'signup' && signupStep === 1)) && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex w-full max-w-sm self-center items-center justify-center gap-2.5 rounded-[10px] border border-slate-200 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.99] disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {mode === 'signin' ? 'Sign in with Google' : 'Continue with Google'}
            </button>
          )}

          {(mode === 'signin' || (mode === 'signup' && signupStep === 1)) && (
            <div className="my-5 flex w-full max-w-sm self-center items-center gap-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Or with email</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 flex w-full max-w-sm self-center items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-sm self-center space-y-3">
            {(mode === 'signin' || signupStep === 1) && (
              <div className="relative z-40">
                <button
                  type="button"
                  onClick={() => setRoleMenuOpen((current) => !current)}
                  aria-expanded={roleMenuOpen}
                  aria-haspopup="listbox"
                  className={`flex w-full items-center gap-3 rounded-[10px] border bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 ${roleMenuOpen ? 'border-slate-400 ring-4 ring-slate-200/70' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-slate-600">
                    {role === 'teacher' ? <GraduationCap size={14} /> : <User size={14} />}
                  </span>
                  <span className="flex-1 capitalize">{role}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${roleMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${roleMenuOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
                  <div
                    role="listbox"
                    className="min-h-0 overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,.12)]"
                  >
                    {(['student', 'teacher', 'parent'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={role === option}
                        onClick={() => {
                          setRoleMenuOpen(false);
                          setRole(option);
                          setError(null);
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold capitalize transition-colors ${role === option ? 'bg-emerald-50 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span className="flex h-7 w-7 items-center justify-center text-slate-600">
                          {option === 'teacher' ? <GraduationCap size={14} /> : <User size={14} />}
                        </span>
                        {option}
                        {role === option && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check size={13} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && signupStep === 2 && (
              <div className="grid grid-cols-2 gap-3 animate-dropdown-reveal">
                <div className="col-span-1 space-y-1">
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div className="col-span-1 space-y-1">
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {role === 'student' && (
                  <div className="col-span-2 space-y-2">
                    <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Where do you study?</p>
                    <div className="grid grid-cols-2 gap-2 rounded-[9px] bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => selectEducationType('high-school')}
                        aria-expanded={formData.educationType === 'high-school'}
                        className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition-colors ${formData.educationType === 'high-school' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                      >
                        <School size={14} /> High School
                      </button>
                      <button
                        type="button"
                        onClick={() => selectEducationType('polytechnic')}
                        aria-expanded={formData.educationType === 'polytechnic'}
                        className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-bold transition-colors ${isPolytechnic ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
                      >
                        <GraduationCap size={14} /> Polytechnic
                      </button>
                    </div>

                    <div
                      id="student-education-details"
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                        formData.educationType
                          ? 'mt-2 grid-rows-[1fr] opacity-100'
                          : 'mt-0 grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        {formData.educationType === 'high-school' && (
                          <div className="rounded-[9px] border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Award size={14} className="text-violet-600" /> Choose your current level
                            </div>
                            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="High School Form">
                              {['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'].map((level) => (
                                <button
                                  key={level}
                                  type="button"
                                  role="radio"
                                  aria-checked={formData.grade === level}
                                  onClick={() => {
                                    setFormData((current) => ({ ...current, grade: level }));
                                    setError(null);
                                  }}
                                  className={`rounded-lg border px-2 py-2 text-xs font-bold transition-all ${
                                    formData.grade === level
                                      ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:bg-violet-50'
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.educationType === 'polytechnic' && (
                          <div className="rounded-[9px] border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <BookOpen size={14} className="text-violet-600" /> Choose your course
                              </span>
                              {formData.grade && (
                                <span className="max-w-[155px] truncate rounded-full bg-violet-500/15 px-2 py-1 text-[9px] font-bold text-violet-700" title={formData.grade}>
                                  {formData.grade}
                                </span>
                              )}
                            </div>

                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                              <input
                                type="search"
                                value={courseSearch}
                                onChange={(event) => setCourseSearch(event.target.value)}
                                placeholder="Search courses"
                                aria-label="Search Polytechnic courses"
                                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 py-2 pl-8 pr-8 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                              />
                              {courseSearch && (
                                <button
                                  type="button"
                                  onClick={() => setCourseSearch('')}
                                  aria-label="Clear course search"
                                  className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>

                            <div className="mt-2 max-h-48 space-y-3 overflow-y-auto overscroll-contain pr-1 custom-scrollbar" role="listbox" aria-label="Polytechnic courses">
                              {filteredPolytechnicGroups.map((group) => (
                                <div key={group.label}>
                                  <p className="mb-1 px-1 text-[9px] font-black uppercase tracking-wider text-slate-500">{group.label}</p>
                                  <div className="space-y-1">
                                    {group.courses.map((course) => (
                                      <button
                                        key={course}
                                        type="button"
                                        role="option"
                                        aria-selected={formData.grade === course}
                                        onClick={() => {
                                          setFormData((current) => ({ ...current, grade: course }));
                                          setError(null);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-semibold transition-colors ${
                                          formData.grade === course
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-800'
                                        }`}
                                      >
                                        <span className="min-w-0 flex-1">{course}</span>
                                        {formData.grade === course && <Check size={13} className="shrink-0" />}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              {filteredPolytechnicGroups.length === 0 && (
                                <div className="py-5 text-center text-[11px] text-slate-500">
                                  No courses match &ldquo;{courseSearch.trim()}&rdquo;.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: School Selection Step with Modern Indexed Suggestion Dropdown */}
            {mode === 'signup' && signupStep === 3 && (
              <div className="space-y-3 animate-dropdown-reveal">
                <div className="text-left">
                  <div className="flex items-center justify-between gap-2">
                    <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {isPolytechnic ? 'Choose your Polytechnic / College' : 'Choose your High School'}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                      Optional
                    </span>
                  </div>
                  <p className="px-1 text-xs text-slate-500 mt-0.5">
                    {isPolytechnic
                      ? 'Select your institution or skip (will be saved as "Private")'
                      : 'Select your school or skip (will be saved as "Private")'}
                  </p>
                </div>

                {formData.school ? (
                  <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                          {isPolytechnic ? <GraduationCap size={16} /> : <School size={16} />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">{formData.school}</p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-500">
                            <MapPin size={10} className="shrink-0 text-violet-500" />
                            {selectedSchoolRecord?.location || selectedSchoolRecord?.province || (isPolytechnic ? 'Polytechnic Institution' : 'High School')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((c) => ({ ...c, school: '' }));
                          setSchoolSearch('');
                          setSchoolMenuOpen(true);
                        }}
                        className="shrink-0 rounded-md px-2.5 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      {isPolytechnic ? (
                        <GraduationCap className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                      ) : (
                        <School className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                      )}
                      <input
                        type="text"
                        name="school"
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={schoolMenuOpen}
                        aria-controls="signup-school-dropdown"
                        value={schoolSearch}
                        onChange={(event) => {
                          setSchoolSearch(event.target.value);
                          setSchoolMenuOpen(true);
                          setError(null);
                        }}
                        onFocus={() => setSchoolMenuOpen(true)}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') setSchoolMenuOpen(false);
                          if (event.key === 'Enter' && schoolSuggestions.length > 0) {
                            event.preventDefault();
                            selectSchool(schoolSuggestions[0]);
                          }
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-8 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder={isPolytechnic ? 'Search your polytechnic...' : 'Search your high school...'}
                      />
                      {schoolSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setSchoolSearch('');
                            setSchoolMenuOpen(true);
                          }}
                          aria-label="Clear school search"
                          className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>

                    {/* Modern Dropdown */}
                    {schoolMenuOpen && (
                      <div
                        id="signup-school-dropdown"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto overscroll-contain rounded-[14px] border border-slate-200 bg-white/95 p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.18)] backdrop-blur-xl custom-scrollbar"
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFormData((c) => ({ ...c, school: 'Private' }));
                            setSchoolMenuOpen(false);
                            setError(null);
                          }}
                          className="mb-1 flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-200 text-slate-700">
                            <UserRound size={13} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-bold text-slate-900">
                              Private / Independent Candidate
                            </span>
                            <span className="text-[9px] text-slate-400">Save my school as &ldquo;Private&rdquo;</span>
                          </span>
                        </button>

                        {schoolSearch.trim().length > 1 && (
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setFormData((c) => ({ ...c, school: schoolSearch.trim() }));
                              setSchoolMenuOpen(false);
                              setError(null);
                            }}
                            className="mb-1 flex w-full items-center gap-2.5 rounded-lg border border-dashed border-violet-300 bg-violet-50/70 px-2.5 py-2 text-left text-xs font-bold text-violet-700 hover:bg-violet-100"
                          >
                            <Sparkles size={13} className="shrink-0 text-violet-600" />
                            <span className="truncate">Use &ldquo;{schoolSearch.trim()}&rdquo; as my school</span>
                          </button>
                        )}

                        {schoolSuggestions.map((school) => {
                          const isSelected = school.name.toLowerCase() === formData.school.trim().toLowerCase();
                          const typeLabel = school.type === 'poly' || school.type === 'college'
                            ? 'Polytechnic'
                            : 'High School';

                          return (
                            <button
                              key={`${school.id}-${school.name}`}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectSchool(school)}
                              className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                                isSelected ? 'bg-violet-50 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm">
                                {isPolytechnic ? <GraduationCap size={13} /> : <School size={13} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[11px] font-bold text-slate-900 group-hover:text-violet-700">
                                  {school.name}
                                </span>
                                <span className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-slate-400">
                                  <MapPin size={9} className="shrink-0" />
                                  {[school.location, school.province].filter(Boolean).join(' · ') || 'Zimbabwe'}
                                </span>
                              </span>
                              <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700">
                                {typeLabel}
                              </span>
                              {isSelected && <Check size={13} className="shrink-0 text-violet-600" />}
                            </button>
                          );
                        })}

                        {schoolSuggestions.length === 0 && (
                          <div className="py-4 text-center text-xs text-slate-400">
                            No schools match &ldquo;{schoolSearch.trim()}&rdquo;.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4 (or Sign In): Email & Password */}
            {(mode === 'signin' || signupStep === 4) && (
              <div className="space-y-3 animate-dropdown-reveal">
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      required
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      placeholder="Password"
                      minLength={8}
                    />
                  </div>
                  {mode === 'signin' && (
                    <div className="flex justify-end">
                      <button type="button" className="text-[10px] text-blue-500 hover:text-blue-600">Forgot Password?</button>
                    </div>
                  )}
                  {mode === 'signup' && (
                    <div className="pt-2">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Password strength</span>
                        <span className="text-emerald-600">{passwordStrengthLabel}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5" aria-label={`Password strength: ${passwordStrengthLabel}`}>
                        {[1, 2, 3, 4].map((level) => (
                          <span
                            key={level}
                            className={`h-1.5 rounded-full transition-colors duration-300 ${passwordStrength >= level ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <p className="mt-1.5 text-[10px] leading-4 text-slate-400">Use 8+ characters with upper and lowercase letters, a number, and a symbol.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            {mode === 'signup' && signupStep < 4 && (
              <div className="flex items-center justify-center gap-3 pt-3">
                {signupStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setSignupStep((current) => (current - 1) as any)}
                    className="rounded-[8px] border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}
                {signupStep === 3 && (
                  <button
                    type="button"
                    onClick={skipSchoolStep}
                    className="rounded-[8px] border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={advanceSignup}
                  className="inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-7 py-2.5 text-sm font-bold text-white hover:bg-slate-800 active:scale-[0.99]"
                >
                  Next <ArrowRight size={15} />
                </button>
              </div>
            )}

            {(mode === 'signin' || signupStep === 4) && (
              <button
                type="submit"
                disabled={loading}
                className="mx-auto mt-4 flex w-full items-center justify-center gap-2 rounded-[8px] bg-slate-950 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,.16)] transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:w-44"
              >
                {loading && !successLogin ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}

            {mode === 'signup' && signupStep === 4 && (
              <button
                type="button"
                onClick={() => setSignupStep(role === 'student' ? 3 : 2)}
                className="mx-auto block text-xs font-bold text-slate-500 hover:text-slate-900 pt-1"
              >
                Back to {role === 'student' ? 'school selection' : 'your details'}
              </button>
            )}
          </form>

          <p className="mt-5 w-full max-w-sm self-center text-center text-xs text-slate-500">
            {mode === 'signin' ? 'New here?' : 'Have an account?'}
            <button
              onClick={() => {
                if (mode === 'signin' && role === 'teacher') {
                  openTeacherSignup();
                  return;
                }
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setSignupStep(1);
                setRoleMenuOpen(false);
                setError(null);
              }}
              className="ml-1 font-bold text-slate-900 outline-none hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
