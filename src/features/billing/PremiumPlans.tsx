import React from 'react';
import { ArrowRight, BookOpen, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PremiumPlans: React.FC = () => (
  <main className="min-h-screen bg-gray-50 px-4 py-24 text-left dark:bg-[#050505] md:px-8">
    <section className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-[#111] md:p-12">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
        <Clock size={15} /> Not currently available
      </div>
      <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
        Paid subscriptions are not live
      </h1>
      <p className="mt-5 text-base font-medium leading-7 text-gray-600 dark:text-gray-300">
        Exam Sidemann does not currently operate a payment checkout or sell the plans that were previously previewed here. This page does not collect a phone number or payment information, and visiting it does not create a subscription.
      </p>
      <p className="mt-4 text-base font-medium leading-7 text-gray-600 dark:text-gray-300">
        You can continue using the learning resources that are publicly available. Any future paid service will show its provider, complete price, renewal and cancellation terms, and a working confirmation process before accepting payment.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/courses/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white hover:bg-purple-700">
          <BookOpen size={17} /> Browse free resources <ArrowRight size={16} />
        </Link>
        <Link to="/contact/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-black text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:text-gray-200 dark:hover:bg-white/5">
          <Mail size={17} /> Contact the publisher
        </Link>
      </div>
    </section>
  </main>
);
