import React from 'react';
import { Database, ExternalLink, Mail, MessageSquare, Shield } from 'lucide-react';

const SUPPORT_EMAIL = 'blackgiftechlabs@gmail.com';

const supportHref = (subject: string) =>
  `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const Settings: React.FC = () => (
  <main className="min-h-[calc(100vh_-_var(--app-header-h))] overflow-y-auto bg-[#1e1e1e] p-6 font-sans text-gray-200 md:p-10">
    <div className="mx-auto max-w-4xl pb-20">
      <h1 className="text-3xl font-bold text-white">Account help</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
        Self-service privacy, security, and account controls are not available in this version of Exam Sidemann. This page does not pretend to change settings that the service does not yet enforce.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-[#333] bg-[#1a1a1a] p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-purple-600 p-2.5 text-white"><MessageSquare size={20} /></span>
            <h2 className="text-lg font-bold text-white">Messages and reports</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            In-app blocking and reporting controls are not currently available. Do not send sensitive information in messages. To report a user, message, or community post, email the publisher with the relevant account name and a description of the issue.
          </p>
          <a
            href={supportHref('Report a user or content')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-300 hover:bg-purple-500/20"
          >
            <Mail size={17} /> Continue in email
          </a>
        </section>

        <section className="rounded-3xl border border-[#333] bg-[#1a1a1a] p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-600 p-2.5 text-white"><Database size={20} /></span>
            <h2 className="text-lg font-bold text-white">Data requests</h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Automatic exports, study-history deletion, AI-memory deletion, and account deletion are not implemented here. You can ask the publisher to access, correct, or delete account data by email. Your request is not submitted until you send it from your email app.
          </p>
          <a
            href={supportHref('Account data request')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-300 hover:bg-blue-500/20"
          >
            <Mail size={17} /> Start a data request
          </a>
        </section>

        <section className="rounded-3xl border border-[#333] bg-[#1a1a1a] p-6 shadow-lg md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-600 p-2.5 text-white"><Shield size={20} /></span>
            <h2 className="text-lg font-bold text-white">Security and privacy information</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-400">
            This page cannot change your password, manage devices, enable login alerts, alter message visibility, or change notification delivery. For the data the site may process and the choices currently available, read the privacy policy. For account access concerns, contact the publisher directly.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="/privacy/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Read privacy policy <ExternalLink size={16} />
            </a>
            <a
              href={supportHref('Account access or security concern')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#444] px-4 py-3 text-sm font-bold text-gray-200 hover:bg-[#252525]"
            >
              <Mail size={17} /> Contact the publisher
            </a>
          </div>
        </section>
      </div>
    </div>
  </main>
);
