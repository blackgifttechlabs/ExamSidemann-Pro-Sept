'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Check,
  ChevronDown,
  FlaskConical,
  Minus,
  Sparkles,
} from 'lucide-react';

/**
 * Pricing.
 *
 * The free tier is metered, not crippled: every feature is reachable, a few of
 * them just run out. That is what the limits table further down is for — it is
 * the honest version of "what do I actually lose by not paying", and it is the
 * part students read before the price.
 */

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  perMonth: string;
  note: string;
  cta: string;
  featured?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Start learning with no card at all',
    price: '$0',
    cadence: 'forever',
    perMonth: 'Always free',
    note: 'Metered access to every tool',
    cta: 'Continue free',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    tagline: 'Unlimited access, cancel any month',
    price: '$4.80',
    cadence: 'per month',
    perMonth: '$4.80 / month',
    note: 'Best for a short exam push',
    cta: 'Go monthly',
  },
  {
    id: 'termly',
    name: 'Termly',
    tagline: 'One payment that covers a whole term',
    price: '$10',
    cadence: 'per school term',
    perMonth: '$3.33 / month',
    note: 'Save 30% against monthly',
    cta: 'Get a term',
    featured: true,
    badge: 'Most popular',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    tagline: 'All three terms plus the holidays',
    price: '$25',
    cadence: 'per year',
    perMonth: '$2.08 / month',
    note: 'Save 57% against monthly',
    cta: 'Get a year',
    badge: 'Best value',
  },
];

/** The honest comparison. Everything is reachable free; some of it runs out. */
const LIMITS: { feature: string; free: string; premium: string }[] = [
  { feature: 'Class notes, all levels', free: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Syllabus library', free: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Video tutorials', free: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Practical simulations', free: '3 per month', premium: 'Unlimited' },
  { feature: 'Past papers', free: '5 per month', premium: 'Unlimited' },
  { feature: 'Marking schemes', free: '—', premium: 'Every paper' },
  { feature: 'AI study assistant', free: '10 questions / month', premium: 'Unlimited' },
  { feature: 'IQ Trainer', free: '1 session per day', premium: 'Unlimited + progress tracking' },
  { feature: 'Downloads for offline study', free: '—', premium: 'Everything' },
  { feature: 'Use the app without internet', free: 'Online only', premium: 'Full offline mode' },
  { feature: 'Advertisements', free: 'Shown', premium: 'None' },
];

const FAQS = [
  {
    q: 'What exactly do I get for free?',
    a: 'Everything on Exam Sidemann is reachable on the free plan. Class notes, the syllabus library and video tutorials are unlimited and always will be. The tools that cost us money to run — practical simulations, past papers and the AI assistant — are metered, so you get a real amount of each month rather than a locked door.',
  },
  {
    q: 'How long is a term?',
    a: 'A school term, so roughly three months. The termly plan runs for three months from the day you pay, which works out at $3.33 a month — about 30% cheaper than paying monthly.',
  },
  {
    q: 'What happens when I hit a free limit?',
    a: 'Nothing is deleted and you are never locked out of the site. That particular counter simply pauses until the next month, and you can either wait for it to reset or upgrade to lift it immediately.',
  },
  {
    q: 'Can I really use it without internet?',
    a: 'Yes. Install Exam Sidemann to your home screen and a premium plan keeps your notes, syllabi, past papers and practicals on the device, so they open with the data off or the network down. You only need a connection to sign in, to sync new material, and for the things that genuinely live on a server — the AI tutor and video tutorials.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. The monthly plan can be cancelled at any time and stays active until the end of the month you have paid for. The termly and yearly plans are one-off payments — they simply run out at the end of the period unless you renew.',
  },
  {
    q: 'Do I need a card?',
    a: 'Not for the free plan. For paid plans we accept the payment methods most Zimbabwean students already use, and you only need to pay once per term or per year rather than setting up a recurring card.',
  },
  {
    q: 'I am a teacher. Does this apply to me?',
    a: 'Teacher publishing — listing extra lessons and uploading tutorials — stays free once an administrator has verified you. A premium plan only affects what you consume as a learner.',
  },
  {
    q: 'Does one plan cover every subject and level?',
    a: 'Yes. There is no per-subject or per-level pricing. One plan opens ZJC, O Level, A Level and Polytechnic material together.',
  },
];

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-full bg-white font-sans text-[#16143a] dark:bg-[#0b0b0c] dark:text-white">

      {/* ======================================================= the cards */}
      <section id="plans" className="scroll-mt-20 bg-slate-50 pb-16 pt-14 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-[2.4rem]">
            Pick Your Plan Today
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col bg-white px-8 py-12 text-center dark:bg-[#141416] ${
                  plan.featured
                    ? 'ring-2 ring-violet-600 dark:ring-violet-500'
                    : 'ring-1 ring-slate-200 dark:ring-white/10'
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] ${
                      plan.featured
                        ? 'bg-violet-600 text-white'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <h3 className="text-4xl font-black">{plan.name}</h3>
                <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {plan.tagline}
                </p>

                <div className="my-7 border-t border-slate-200 dark:border-white/10" />

                <p className="text-base text-slate-600 dark:text-slate-300">{plan.perMonth}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.note}</p>

                <div className="my-7 border-t border-slate-200 dark:border-white/10" />

                <strong className="block text-5xl font-black">{plan.price}</strong>
                <p className="mb-10 mt-4 text-base text-slate-500 dark:text-slate-400">{plan.cadence}</p>

                <button
                  onClick={() => navigate(plan.id === 'free' ? '/' : `/checkout?plan=${plan.id}`)}
                  className={`mt-auto w-full py-4 text-[11px] font-black uppercase tracking-[0.14em] transition ${
                    plan.featured
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
            Prices are in USD. A term is three months.
          </p>
        </div>
      </section>

      {/* ================================================== limits table */}
      <section className="bg-slate-50 py-20 dark:bg-white/[0.02]">
        <div className="mx-auto w-[70%] min-w-[320px] max-w-[1200px] px-2">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-[2.4rem]">
            Free Versus Premium, Line By Line
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-center text-base leading-7 text-slate-600 dark:text-slate-300">
            Nothing is hidden behind the paywall. These are the counters, and what happens to them
            when you upgrade.
          </p>

          <div className="mt-12 overflow-x-auto bg-white ring-1 ring-slate-200 dark:bg-[#141416] dark:ring-white/10">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    Feature
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    Free
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.15em] text-violet-600 dark:text-violet-400">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {LIMITS.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-slate-100 last:border-0 dark:border-white/5"
                  >
                    <td className="px-8 py-5 font-bold">{row.feature}</td>
                    <td className="px-8 py-5 text-slate-500 dark:text-slate-400">
                      {row.free === '—' ? (
                        <Minus size={15} className="text-slate-300 dark:text-slate-600" />
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="px-8 py-5 font-bold text-violet-700 dark:text-violet-300">
                      <span className="flex items-center gap-2">
                        <Check size={15} className="shrink-0" />
                        {row.premium}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================== faq */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-black tracking-tight sm:text-[2.4rem]">
            Frequently Asked Questions
          </h2>

          <div className="mt-10">
            {FAQS.map((faq) => {
              const open = openFaq === faq.q;
              return (
                <div key={faq.q} className="border-b border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setOpenFaq(open ? null : faq.q)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 py-6 text-left"
                  >
                    <span className="flex-1 text-base font-black sm:text-lg">{faq.q}</span>
                    <ChevronDown
                      size={22}
                      className={`shrink-0 text-violet-600 transition-transform dark:text-violet-400 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <p className="-mt-1 pb-6 pr-10 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== closing */}
      <section className="bg-gradient-to-br from-violet-600 to-indigo-800 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <Sparkles size={30} className="mx-auto" />
          <h2 className="mt-5 text-3xl font-black tracking-tight">Still Deciding?</h2>
          <p className="mt-5 text-base leading-7 text-white/85">
            Keep using the free plan. Work through your three practicals and five papers this month,
            and upgrade the day you run out — nothing you have done disappears.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/practicals/')}
              className="bg-white px-8 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-violet-700 transition hover:bg-white/90"
            >
              <span className="flex items-center gap-2">
                <FlaskConical size={15} /> Open a practical
              </span>
            </button>
            <button
              onClick={() => navigate('/courses/')}
              className="border border-white/40 px-8 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={15} /> Browse free notes
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
