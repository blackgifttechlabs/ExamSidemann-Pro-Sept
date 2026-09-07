import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import React from "react";

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12 px-4 md:px-[30px] mt-16 font-sans text-left">
      <div className="w-full bg-white dark:bg-navy-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 tracking-tight border-b-2 border-gray-200 dark:border-white/10 pb-6">
          Terms of Service
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed space-y-8">
          <p className="text-lg">Last updated: June 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the EXAMSIDEMANN platform ("Service"), you
              agree to be bound by these Terms of Service. If you disagree with
              any part of the terms, you do not have permission to access the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Accounts and Registration
            </h2>
            <p>
              When you create an account with us, you guarantee that the
              information you provide is accurate, complete, and current at all
              times. You are responsible for safeguarding the password and for
              all activities or actions under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Content and Copyright
            </h2>
            <p>
              Our Service provides access to educational materials. Some
              materials are created by us, while others may be user-generated.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>Our Content:</strong> The Service and its original
                content, features, and functionality are the exclusive property
                of EXAMSIDEMANN.
              </li>
              <li>
                <strong>User Content:</strong> You retain rights to content you
                submit, but you grant us a license to use, reproduce, and
                display it as part of operating the Service.
              </li>
              <li>
                <strong>Prohibited Use:</strong> You may not copy, modify,
                distribute, or sell our content without explicit written
                permission.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Acceptable Use Policy
            </h2>
            <p>You agree not to use the Service:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts.
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, or
                discriminate.
              </li>
              <li>To submit false or misleading information.</li>
              <li>
                To upload viruses or malicious code that will affect the
                functionality of the Service.
              </li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Paid Services
            </h2>
            <p>
              Exam Sidemann does not currently operate a live subscription or
              payment checkout. If paid services are introduced, the price,
              provider, billing schedule, cancellation terms, and any refund
              terms will be disclosed before a user agrees to pay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall EXAMSIDEMANN, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Changes
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. By continuing to access or use our
              Service after those revisions become effective, you agree to be
              bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
