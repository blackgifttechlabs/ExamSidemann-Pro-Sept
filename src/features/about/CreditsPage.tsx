import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreditsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 text-left font-sans dark:bg-navy-900 md:px-[30px] mt-16">
      <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-navy-800 md:p-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-semibold text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="mb-8 border-b-2 border-gray-200 pb-6 text-4xl font-black tracking-tight text-gray-900 dark:border-white/10 dark:text-white md:text-5xl">
          Licences &amp; Credits
        </h1>

        <div className="max-w-none space-y-8 font-medium leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Exam Sidemann uses selected third-party resources. Their creators retain ownership,
            and each resource is used under its applicable licence or attribution terms.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Icons</h2>
            <a
              href="https://www.flaticon.com/free-icons/success"
              title="success icons"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-violet-600 hover:underline dark:text-violet-400"
            >
              Success icons created by hqrloveq - Flaticon
              <ExternalLink size={16} aria-hidden="true" />
            </a>
            <br />
            <a
              href="https://www.flaticon.com/free-icon/close_9067909"
              title="close icon"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-bold text-violet-600 hover:underline dark:text-violet-400"
            >
              Close icon from Flaticon
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
