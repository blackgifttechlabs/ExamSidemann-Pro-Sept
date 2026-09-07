import React, { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

type ProgressSignInPromptProps = {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
};

const learners = [
  '/images/people/graduation.jpeg',
  '/images/people/student-boy-backpack.avif',
  '/images/people/student-boy-navy-uniform.avif',
  '/images/people/student-boy-purple-uniform.avif',
  '/images/people/student-boy-white-shirt.avif',
  '/images/people/student-boy-writing.avif',
  '/images/people/student-girl-braids.avif',
  '/images/people/student-girl-school-uniform.avif',
  '/images/people/student-girl-winter-uniform.avif',
  '/images/people/teacher-man-blue-blazer.avif',
  '/images/people/teacher-man-suit.avif',
] as const;

const benefits = [
  'Save progress',
  'AI Technical Drawing Guider',
  'CPF Notes Creator',
  'Daily Streak Builder',
  'Human Learning Support',
  'Personalised Study Plans',
] as const;

const CLOSE_DURATION = 200;

export const ProgressSignInPrompt: React.FC<ProgressSignInPromptProps> = ({ open, onClose, onSignIn }) => {
  const [isClosing, setIsClosing] = useState(false);

  const closeWithAnimation = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, CLOSE_DURATION);
  };

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeWithAnimation();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isClosing]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[190] flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/45 p-4 backdrop-blur-[16px] transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeWithAnimation();
      }}
    >
      <style>{`
        @keyframes progressSigninModalIn {
          0% { opacity: 0; transform: scale(0.3); }
          55% { opacity: 1; transform: scale(1.06); }
          75% { transform: scale(0.96); }
          90% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes progressSigninModalOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.15); }
        }
        .progress-signin-modal-in {
          animation: progressSigninModalIn 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .progress-signin-modal-out {
          animation: progressSigninModalOut 200ms cubic-bezier(0.4, 0, 1, 1) both;
        }
      `}</style>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-signin-title"
        className={`relative grid w-full max-w-[1240px] overflow-hidden rounded-[9px] bg-white shadow-[0_30px_90px_rgba(15,23,42,.28)] md:min-h-[720px] md:grid-cols-[1.08fr_.92fr] dark:bg-[#11131a] ${isClosing ? 'progress-signin-modal-out' : 'progress-signin-modal-in'}`}
      >
        <button
          type="button"
          onClick={closeWithAnimation}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center transition hover:scale-105"
          aria-label="Close sign-in suggestion"
        >
          <img
            src="/images/icons/close-9067909.png"
            alt=""
            className="h-10 w-10 object-contain"
            aria-hidden="true"
          />
        </button>

        <div className="flex flex-col items-center px-7 pb-8 pt-20 text-center md:px-10 md:pb-12 md:pt-24">
          <h2 id="progress-signin-title" className="text-[42px] font-black leading-tight tracking-[-.04em] text-slate-950 dark:text-white md:text-[56px]">
            Sign in to track<br className="hidden md:block" /> your progress
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-300">
            Let Sidemann help you improve the way you learn.
          </p>

          <div className="mx-auto mt-6 hidden w-full max-w-[520px] gap-x-8 gap-y-3 text-left text-sm font-bold text-slate-600 dark:text-slate-300 sm:grid sm:translate-x-3 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <span key={benefit} className={`inline-flex items-center justify-start gap-2.5 ${benefits.length % 2 === 1 && index === benefits.length - 1 ? 'sm:col-span-2 sm:justify-self-center' : ''}`}>
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </span>
                {benefit}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onSignIn}
            className="mt-auto inline-flex h-14 w-full items-center justify-center gap-2 self-center rounded-[9px] bg-slate-950 px-6 text-sm font-black text-white shadow-[0_10px_25px_rgba(15,23,42,.22)] transition hover:-translate-y-0.5 hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-200 md:w-[400px]"
          >
            Sign in and continue <ArrowRight size={17} />
          </button>
          <button type="button" onClick={closeWithAnimation} className="mt-3 w-full self-center text-center text-xs font-bold text-slate-400 transition hover:text-slate-700 dark:hover:text-white md:w-[400px]">
            Maybe later
          </button>
        </div>

        <div className="relative hidden min-h-[720px] overflow-hidden rounded-r-[5px] bg-slate-900 md:block">
          <img
            src="/images/people/graduation.jpeg"
            alt="Graduate"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
          />
          <span className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/55" />
          <div className="absolute bottom-6 left-1/2 z-10 flex w-[94%] -translate-x-1/2 justify-center -space-x-3">
            {learners.map((learner, index) => (
              <span key={learner} className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_10px_24px_rgba(0,0,0,.35)]" style={{ zIndex: index + 1 }}>
                <img src={learner} alt="" className="h-full w-full object-cover" loading="eager" />
              </span>
            ))}
          </div>
          <div className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/20 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[.16em] text-white backdrop-blur-md">
            This could be you — start today
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressSignInPrompt;
