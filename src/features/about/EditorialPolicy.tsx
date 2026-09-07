import React from "react";
import { ArrowLeft, BookCheck, Bot, Copyright, Scale } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SUPPORT_EMAIL = "blackgiftechlabs@gmail.com";

export const EditorialPolicy: React.FC = () => {
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
          Editorial Policy
        </h1>

        <div className="max-w-none space-y-8 font-medium leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-lg">Last updated: August 2026</p>

          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
            <div className="mb-3 flex items-center gap-3 text-blue-800 dark:text-blue-200">
              <Scale size={22} />
              <h2 className="text-xl font-bold">Who publishes this site</h2>
            </div>
            <p>
              Exam Sidemann is an independently operated educational platform
              founded by Prominance T. Kunyadini. It is not part of, affiliated
              with, approved by, or endorsed by ZIMSEC, HEXCO, the Ministry of
              Primary and Secondary Education, or any school listed on the site.
              Examination-body and institution names are used only to describe
              the relevant curricula, qualifications and listings.
            </p>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <BookCheck className="text-blue-600 dark:text-blue-400" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Educational content and sources
              </h2>
            </div>
            <p>
              Our notes, explanations and practice materials are intended to
              help learners study. They do not replace official syllabi,
              circulars, examination instructions or advice from a qualified
              teacher. For registration deadlines, subject requirements and
              other high-stakes decisions, learners should confirm the current
              information with the responsible examination body or institution.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                We aim to use current syllabus documents, established textbooks
                and credible subject-specific references when preparing content.
              </li>
              <li>
                Sources and rights holders should be identified where practical,
                especially for documents or claims that are not our original work.
              </li>
              <li>
                Past papers, syllabi, trademarks and third-party documents remain
                the property of their respective owners. Making a resource
                discoverable does not imply ownership or endorsement.
              </li>
              <li>
                Despite review, material can contain errors or become outdated.
                We do not claim that every resource is complete, error-free or
                suitable for every learner.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Review, corrections and updates
            </h2>
            <p>
              We review content for relevance, clarity and syllabus fit, with
              extra care for factual explanations and answer guidance. When a
              confirmed error is reported, we aim to correct it promptly and to
              note a material correction where that context would help readers.
              Publication and review dates may be shown when they are useful.
            </p>
            <p className="mt-4">
              To request a correction, use the{" "}
              <Link
                to="/feedback/"
                className="font-bold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                feedback page
              </Link>{" "}
              or email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Content correction request")}`}
                className="font-bold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                {SUPPORT_EMAIL}
              </a>
              . Please include the page address, the passage in question and a
              supporting source when possible.
            </p>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <Bot className="text-purple-600 dark:text-purple-400" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Use of artificial intelligence
              </h2>
            </div>
            <p>
              AI tools may assist with research, drafting, practice questions or
              interactive explanations. AI can produce incomplete or incorrect
              answers, so its output should be checked against reliable sources
              and official requirements. AI-generated practice material is not
              an official examination paper, marking scheme or prediction of
              what will appear in an examination.
            </p>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3">
              <Copyright className="text-amber-600 dark:text-amber-400" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Copyright and attribution
              </h2>
            </div>
            <p>
              We respect copyright and aim to publish original explanations or
              material that we have permission to use. Third-party content is
              credited where the source is known. A rights holder can send a
              copyright concern to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Copyright concern")}`}
                className="font-bold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              with the work, page address, ownership details and requested action.
              We will review a sufficiently detailed notice and correct, attribute
              or remove material when appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Advertising, promotions and community content
            </h2>
            <p>
              Advertising supports the platform but does not grant an advertiser
              control over educational conclusions. Paid promotions or sponsored
              material should be clearly identified. Posts, comments and other
              community submissions express their authors&apos; views; they are not
              automatically endorsed as editorial guidance by Exam Sidemann.
            </p>
          </section>

          <section className="rounded-2xl bg-gray-100 p-6 dark:bg-white/5">
            <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
              Contact the publisher
            </h2>
            <p>
              Questions about these standards can be sent through our{" "}
              <Link
                to="/contact/"
                className="font-bold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                contact page
              </Link>{" "}
              or directly to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-bold text-blue-600 underline underline-offset-4 dark:text-blue-400"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
