import React from 'react';
import { BookOpen, CheckCircle, FileText, Target } from 'lucide-react';

type ModuleKey =
  | 'money-and-banking'
  | 'introduction-to-banking-law'
  | 'customer-accounts-management'
  | 'investments-administration'
  | 'financial-mathematics-1'
  | 'esd'
  | 'national-studies'
  | 'computing-and-digital-literacy';

const modules: Record<ModuleKey, {
  title: string;
  isPdf?: boolean;
  focus: string;
  outcomes: string[];
}> = {
  'money-and-banking': {
    title: 'Money and Banking',
    focus: 'Study the role of money, banking institutions, payment systems and monetary activity in the economy.',
    outcomes: [
      'Explain the nature, functions and characteristics of money.',
      'Describe the structure and role of banking institutions in financial intermediation.',
      'Analyse how deposits, credit and payment instruments support economic activity.',
      'Relate central banking and monetary policy tools to stability in the banking sector.',
    ],
  },
  'introduction-to-banking-law': {
    title: 'Introduction to Banking Law',
    focus: 'Study the legal framework that governs banker-customer relationships and banking operations.',
    outcomes: [
      'Identify the main sources and principles of banking law.',
      'Explain the legal duties and rights of banks and customers.',
      'Describe the legal treatment of negotiable instruments and payment instructions.',
      'Apply confidentiality, disclosure and mandate rules to banking situations.',
      'Recognise regulatory and compliance obligations in banking practice.',
    ],
  },
  'customer-accounts-management': {
    title: 'Customer Accounts Management',
    focus: 'Study account opening, operation, monitoring and customer service controls in banking.',
    outcomes: [
      'Describe procedures for opening and maintaining different customer account types.',
      'Apply know-your-customer requirements and customer due diligence procedures.',
      'Explain account mandates, signatories, authorities and operational controls.',
      'Manage common customer account transactions and service issues.',
      'Identify risks linked to dormant, overdrawn, closed or suspicious accounts.',
    ],
  },
  'investments-administration': {
    title: 'Investments Administration',
    focus: 'Study the administration of investment products, client records, settlement and reporting.',
    outcomes: [
      'Explain common investment instruments and their administrative requirements.',
      'Describe client onboarding, documentation and record-keeping for investments.',
      'Apply basic procedures for investment transactions, settlement and custody.',
      'Prepare and interpret basic investment reports for clients and institutions.',
    ],
  },
  'financial-mathematics-1': {
    title: 'Financial Mathematics 1',
    focus: 'Study core calculations used in interest, discounting, annuities and financial decision-making.',
    outcomes: [
      'Calculate simple interest, compound interest and effective rates.',
      'Apply present value and future value techniques to banking transactions.',
      'Solve basic annuity, loan repayment and discounting problems.',
    ],
  },
  esd: {
    title: 'ESD',
    focus: 'Study enterprise skills, opportunity identification and business planning for professional practice.',
    outcomes: [
      'Explain entrepreneurship and enterprise development concepts.',
      'Identify viable business opportunities in a service environment.',
      'Prepare basic market, operations and finance plans for a small enterprise.',
      'Describe legal, ethical and regulatory requirements for enterprise operations.',
      'Evaluate risks, sustainability and growth options for a new venture.',
    ],
  },
  'national-studies': {
    title: 'National Studies',
    focus: 'Study citizenship, heritage, governance and national development themes.',
    outcomes: [
      'Explain national identity, heritage and citizenship responsibilities.',
      'Describe key institutions involved in governance and development.',
      'Discuss social, economic and ethical issues affecting national progress.',
      'Apply national values to professional conduct and community participation.',
    ],
  },
  'computing-and-digital-literacy': {
    title: 'Computing and Digital Literacy',
    isPdf: true,
    focus: 'Study digital productivity, information handling, online communication and safe computer use.',
    outcomes: [
      'Use common computer hardware, software and operating system functions.',
      'Create, manage and share digital documents using productivity tools.',
      'Apply safe, ethical and responsible practices when using digital systems.',
      'Use internet, email and online services effectively for academic and workplace tasks.',
    ],
  },
};

interface BankingOutcomePageProps {
  moduleKey: ModuleKey;
  outcome: number;
}

export const BankingOutcomePage: React.FC<BankingOutcomePageProps> = ({ moduleKey, outcome }) => {
  const module = modules[moduleKey];
  const outcomeText = module.outcomes[outcome - 1] || `Study Learning Outcome ${outcome} for ${module.title}.`;

  return (
    <div className="animate-dropdown-reveal space-y-6 text-left">
      <header className="border-b border-gray-200 dark:border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]">
            <BookOpen size={14} />
            Banking NC
          </span>
          {module.isPdf && (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]">
              <FileText size={14} />
              PDF Module
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
          {module.title}
        </h1>
        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
          {module.focus}
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-5 md:p-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003153] text-white">
            <Target size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400 mb-2">
              Learning Outcome {outcome}
            </p>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {outcomeText}
            </h2>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5">
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">
            Study to Understand
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex gap-3"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Read the notes for this learning outcome carefully.</li>
            <li className="flex gap-3"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Write short examples using banking or workplace situations.</li>
            <li className="flex gap-3"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Review the key terms before moving to the next outcome.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5">
          <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">
            Module Access
          </h3>
          <a
            href={`/courses/banking-nc/${moduleKey}/`}
            className="inline-flex items-center gap-2 rounded-full bg-[#003153] px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-blue-700"
          >
            View Module Overview <BookOpen size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};
