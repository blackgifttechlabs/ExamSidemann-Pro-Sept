'use client';

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

/**
 * Checkout.
 *
 * NOTE FOR WHOEVER WIRES THE MONEY UP: nothing here talks to a payment
 * processor yet. `submit` only moves this component into its own "sent" state —
 * no card number, no PIN and no phone number leaves the browser. Before this
 * page takes a single real payment:
 *
 *   • EcoCash goes through an aggregator (Paynow / Pesepay). You post the
 *     amount and the subscriber number, they raise the USSD prompt, and you
 *     confirm the result server-side — never trust the browser's word for it.
 *   • Card details must NOT be collected by these inputs in production. Swap
 *     the card block for the processor's hosted field or redirect, so the PAN
 *     never touches our origin and PCI scope stays with them.
 *
 * The plan a user ends up on has to be written by that server-side callback,
 * not by this component.
 */

type PlanId = 'monthly' | 'termly' | 'yearly';

const PLANS: Record<PlanId, { name: string; price: string; period: string; note: string }> = {
  monthly: { name: 'Monthly', price: '$4.80', period: 'per month', note: 'Renews every month until cancelled' },
  termly: { name: 'Termly', price: '$10.00', period: 'per school term', note: 'One payment, covers three months' },
  yearly: { name: 'Yearly', price: '$25.00', period: 'per year', note: 'One payment, covers twelve months' },
};

type Method = 'ecocash' | 'card';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const planId = (params.get('plan') as PlanId) in PLANS ? (params.get('plan') as PlanId) : 'termly';
  const plan = PLANS[planId];

  const [method, setMethod] = useState<Method>('ecocash');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  /** 07xx xxx xxx / 077… — the shape EcoCash subscriber numbers take. */
  const phoneOk = /^0(77|78)\d{7}$/.test(phone.replace(/\s/g, ''));
  const cardOk =
    cardName.trim().length > 2 &&
    cardNumber.replace(/\s/g, '').length >= 15 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvv);

  const ready = useMemo(() => (method === 'ecocash' ? phoneOk : cardOk), [method, phoneOk, cardOk]);

  const submit = () => {
    if (!ready || busy) return;
    setBusy(true);
    // Stands in for the aggregator call. Nothing is transmitted.
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <div className="min-h-full bg-slate-50 px-6 py-20 dark:bg-[#0b0b0c]">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center ring-1 ring-slate-200 dark:bg-[#141416] dark:ring-white/10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Check size={30} strokeWidth={3} />
          </span>
          <h1 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
            {method === 'ecocash' ? 'Check your phone' : 'Card details captured'}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {method === 'ecocash'
              ? `An EcoCash prompt for ${plan.price} is on its way to ${phone}. Enter your PIN to approve it, and your ${plan.name} plan opens as soon as the payment clears.`
              : `Your ${plan.name} plan opens as soon as the payment clears with your bank.`}
          </p>
          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Payments are not connected yet — nothing has been charged and no details were sent
            anywhere.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 w-full rounded-xl bg-violet-600 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-violet-500"
          >
            Back to Exam Sidemann
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-900 dark:bg-[#0b0b0c] dark:text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
        <button
          onClick={() => navigate('/pricing/')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to plans
        </button>

        <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Complete your payment</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Pay with EcoCash or a Visa / Mastercard. Your plan opens the moment the payment clears.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">

          {/* ------------------------------------------------ method + form */}
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#141416] dark:ring-white/10 sm:p-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Payment method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setMethod('ecocash')}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  method === 'ecocash'
                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e2001a] text-white">
                  <Smartphone size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black">EcoCash</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Approve on your phone
                  </span>
                </span>
              </button>

              <button
                onClick={() => setMethod('card')}
                className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  method === 'card'
                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5'
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white/10">
                  <CreditCard size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black">Visa / Mastercard</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Debit or credit card
                  </span>
                </span>
              </button>
            </div>

            <div className="my-7 border-t border-slate-200 dark:border-white/10" />

            {method === 'ecocash' ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    EcoCash number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0771 234 567"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                  {phone && !phoneOk && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
                      Enter a registered EcoCash number, e.g. 0771234567.
                    </p>
                  )}
                </div>

                <ol className="space-y-2.5 rounded-2xl bg-slate-50 p-5 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                  {[
                    'Tap Pay — a prompt is pushed to the number above.',
                    'Enter your EcoCash PIN on your phone to approve it.',
                    'Your plan opens here as soon as the payment clears.',
                  ].map((line, i) => (
                    <li key={line} className="flex gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-600 text-[10px] font-black text-white">
                        {i + 1}
                      </span>
                      {line}
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Name on card
                  </label>
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="As printed on the card"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Card number
                  </label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      inputMode="numeric"
                      autoComplete="off"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim(),
                        )
                      }
                      placeholder="4111 1111 1111 1111"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 tracking-wider outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Expiry
                    </label>
                    <input
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                      }}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      CVV
                    </label>
                    <input
                      inputMode="numeric"
                      autoComplete="off"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  Your bank may ask you to confirm the payment with a 3-D Secure code before it
                  goes through.
                </p>
              </div>
            )}

            <p className="mt-7 rounded-xl bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Payments are not switched on yet. This form does not send your details anywhere and
              nothing will be charged.
            </p>
          </div>

          {/* --------------------------------------------------- order side */}
          <aside className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 dark:bg-[#141416] dark:ring-white/10 lg:sticky lg:top-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Your order
            </h2>

            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-lg font-black">{plan.name} plan</span>
              <span className="text-2xl font-black">{plan.price}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{plan.period}</p>
            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{plan.note}</p>

            <div className="my-6 border-t border-slate-200 dark:border-white/10" />

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {[
                'Unlimited practicals',
                'Every past paper and marking scheme',
                'Unlimited AI tutor',
                'Works offline, no ads',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="my-6 border-t border-slate-200 dark:border-white/10" />

            <div className="flex items-baseline justify-between text-sm font-black">
              <span>Total due today</span>
              <span className="text-xl">{plan.price}</span>
            </div>

            <button
              onClick={submit}
              disabled={!ready || busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-white/10"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Sending
                </>
              ) : (
                <>
                  <Lock size={14} /> Pay {plan.price}
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-slate-400">
              Prices in USD. Change plan on the{' '}
              <button onClick={() => navigate('/pricing/')} className="font-bold underline">
                pricing page
              </button>
              .
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};
