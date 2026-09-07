import React, { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaCalculator,
  FaChartLine,
  FaBalanceScale,
  FaBuilding,
  FaShieldAlt,
} from 'react-icons/fa';

/**
 * Topic: Business Ethics – Principles of Accounts
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */
export const BusinessEthics: React.FC = () => {
  // ---------- CSS keyframes (reused from trial balance component) ----------
  const highlightStyles = `
    html, body {
      scroll-behavior: auto !important;
    }
    .etb-detect-label {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    @media (max-width: 768px) {
      .etb-detect-label {
        writing-mode: horizontal-tb;
        transform: none;
      }
      .etb-detect-cell {
        writing-mode: horizontal-tb;
      }
    }

    .ledger-paper {
      background-color: #faf9f5;
      background-image: linear-gradient(90deg, rgba(255,255,255,0.38), rgba(255,255,255,0));
    }

    .ledger-timeline {
      appearance: none;
      -webkit-appearance: none;
      border-radius: 999px;
      height: 6px;
      outline: none;
    }

    .ledger-timeline::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border: 0;
      border-radius: 999px;
      background: #1CB0F6;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(15, 23, 42, 0.25);
    }

    .ledger-timeline::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border: 0;
      border-radius: 999px;
      background: #1CB0F6;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(15, 23, 42, 0.25);
    }

    .ledger-finished .ledger-guide-line,
    .ledger-finished .ink-stroke,
    .ledger-finished .ink-rule,
    .ledger-finished .ink-double-rule {
      stroke-dashoffset: 0;
      animation: none;
    }

    .ledger-finished text {
      fill-opacity: 1 !important;
      stroke-dashoffset: 0;
      animation: none !important;
    }

    .ink-stroke {
      fill: none;
      stroke: #1a237e;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 450;
      stroke-dashoffset: 450;
      animation: drawInk 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .ink-rule {
      fill: none;
      stroke: #1e3a8a;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-dasharray: 500;
      stroke-dashoffset: 500;
      animation: drawInk 0.5s ease-out forwards;
    }

    .ink-double-rule {
      fill: none;
      stroke: #1e3a8a;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-dasharray: 500;
      stroke-dashoffset: 500;
      animation: drawInk 0.5s ease-out 0.15s forwards;
    }

    .ledger-guide-line {
      fill: none;
      stroke-dasharray: 920;
      stroke-dashoffset: 920;
      animation: drawGuideLine 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .ledger-guide-line--red {
      stroke: #fb7185;
      stroke-width: 1.5;
    }

    .ledger-guide-line--blue {
      stroke: #bfdbfe;
      stroke-width: 1;
    }

    .ledger-guide-line--column {
      stroke: #93c5fd;
      stroke-width: 1.2;
      stroke-dasharray: 4 5;
    }

    @keyframes drawInk {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes drawGuideLine {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes pulsePen {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.3); opacity: 1; }
    }
    .pen-nib {
      animation: pulsePen 1s infinite ease-in-out;
    }

    @keyframes handWrite {
      from { opacity: 0; filter: blur(1px); transform: translateY(1px); }
      to { opacity: 1; filter: blur(0); transform: translateY(0); }
    }

    @keyframes ledgerWriteGlyph {
      0% {
        fill-opacity: 0;
        stroke-dashoffset: 140;
      }
      72% {
        fill-opacity: 0;
        stroke-dashoffset: 0;
      }
      100% {
        fill-opacity: 1;
        stroke-dashoffset: 0;
      }
    }
  `;

  // ---------- Duolingo-style color palette ----------
  type ColorName = 'green' | 'blue' | 'purple' | 'orange';
  const colorMap: Record<ColorName, { bg: string; dark: string; light: string; text: string }> = {
    green: { bg: '#58CC02', dark: '#46A302', light: '#F0FFE1', text: '#3F7D00' },
    blue: { bg: '#1CB0F6', dark: '#0A94D4', light: '#E5F6FF', text: '#0B75A6' },
    purple: { bg: '#CE82FF', dark: '#A568D6', light: '#F5E9FF', text: '#7B3FC4' },
    orange: { bg: '#FF9600', dark: '#E08600', light: '#FFF3E0', text: '#B35F00' },
  };

  // ---------- Section definitions ----------
  interface TopicSection {
    id: string;
    title: string;
    color: ColorName;
    content: React.ReactNode;
    aside?: React.ReactNode;
  }

  // Reusable container card
  const SubtopicCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rounded-[9px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-6">
        <h3 className="text-3xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
          {title}
        </h3>
        <div className="text-slate-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  // A plain-English "callout" box
  const ExplainBox: React.FC<{ label?: string; children: React.ReactNode }> = ({ label = 'In simple terms', children }) => (
    <div className="rounded-2xl border-2 border-[#84D8FF] bg-[#E5F6FF] p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[#0B75A6] mb-1">💡 {label}</p>
      <div className="text-slate-700 text-sm leading-relaxed">{children}</div>
    </div>
  );

  // A worked-numbers table (kept for consistency but may not be heavily used here)
  const WorkedTable: React.FC<{
    title: string;
    columns: string[];
    rows: (string | number)[][];
    note?: string;
  }> = ({ title, columns, rows, note }) => (
    <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
      <figcaption className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
        {title}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-2 font-semibold text-slate-600 ${i === 0 ? 'text-left' : 'text-right'}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-slate-100">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`px-4 py-2 ${c === 0 ? 'text-left text-slate-700' : 'text-right text-slate-800 tabular-nums'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">{note}</p>
      )}
    </figure>
  );

  // ---------- Section 1: Ethics Introduction ----------
  const introductionContent = (
    <div className="space-y-6">
      <SubtopicCard title="Definition of Ethics in Business/Accounting">
        <p>
          <strong>Business ethics</strong> refers to the moral principles and standards that guide behaviour in the business world. In accounting, ethics are the rules and values that govern the conduct of accountants and financial professionals.
        </p>
        <p>
          Ethics in accounting is essential because financial information is used by many stakeholders—investors, creditors, employees, regulators—to make important decisions. Ethical behaviour ensures that this information is reliable, transparent, and trustworthy.
        </p>
        <ExplainBox>
          Think of ethics as the 'moral compass' that helps professionals choose the right course of action, even when no one is watching. It goes beyond simply complying with the law.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Importance of Ethical Behaviour in Accounting">
        <p>
          Ethical behaviour is critical in accounting for several reasons:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Trust:</strong> Stakeholders rely on accountants to provide accurate and honest financial information. Without trust, the financial system breaks down.</li>
          <li><strong>Reputation:</strong> Accountants who act ethically enhance the reputation of their profession and their organisation.</li>
          <li><strong>Legal compliance:</strong> Unethical behaviour often leads to violations of laws and regulations, resulting in fines, penalties, and even imprisonment.</li>
          <li><strong>Economic stability:</strong> Widespread unethical accounting practices (e.g., Enron, WorldCom) can destabilise economies and harm millions of people.</li>
          <li><strong>Professional standards:</strong> Accountants are bound by professional codes of ethics (e.g., ACCA, CPA) that require ethical conduct.</li>
        </ul>
        <WorkedTable
          title="Consequences of Unethical Behaviour – Examples"
          columns={['Case', 'Unethical Action', 'Consequence']}
          rows={[
            ['Enron (2001)', 'Falsifying financial statements', 'Bankruptcy, loss of jobs, new regulations (Sarbanes-Oxley)'],
            ['WorldCom (2002)', 'Inflated assets, understated expenses', 'Bankruptcy, criminal charges'],
            ['Lehman Brothers (2008)', 'Misleading investors with off-balance-sheet transactions', 'Global financial crisis, bankruptcy'],
          ]}
          note="These cases highlight the devastating impact of unethical behaviour on businesses, employees, and the economy."
        />
        <ExplainBox label="Why it matters to you">
          As an accounting student or professional, your integrity is your most valuable asset. A single ethical lapse can end a career, while a reputation for honesty can open doors.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const introductionAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Points</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Ethics:</strong> Moral principles guiding behaviour</li>
        <li>Essential for trust, reputation, and legal compliance</li>
        <li>Unethical behaviour can have severe consequences</li>
        <li>Professional codes enforce ethical standards</li>
      </ul>
    </div>
  );

  // ---------- Section 2: Core Principles ----------
  const corePrinciplesContent = (
    <div className="space-y-6">
      <SubtopicCard title="Core Principles of Accounting Ethics">
        <p>
          Professional accounting bodies (e.g., IFAC, ACCA, AICPA) have established a set of fundamental ethical principles. These principles guide accountants in their daily work and decision-making.
        </p>
        <p>
          The six core principles are: <strong>Professionalism, Integrity, Confidentiality, Competence, Objectivity, and Compliance</strong>.
        </p>
      </SubtopicCard>

      <SubtopicCard title="1. Professionalism">
        <p>
          <strong>Professionalism</strong> means acting in accordance with the standards of the profession. This includes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Maintaining a professional appearance and demeanour.</li>
          <li>Adhering to professional standards and best practices.</li>
          <li>Continually improving skills and knowledge.</li>
          <li>Acting with courtesy and respect towards colleagues, clients, and the public.</li>
        </ul>
        <ExplainBox>
          Professionalism builds trust and confidence in the accounting profession. It shows that you take your role seriously and are committed to delivering high-quality work.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="2. Integrity">
        <p>
          <strong>Integrity</strong> means being honest, fair, and straightforward in all professional relationships. It requires:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Being truthful and transparent in financial reporting.</li>
          <li>Not being associated with information that is misleading or false.</li>
          <li>Acting with moral courage to do the right thing, even when it is difficult.</li>
          <li>Standing up against unethical practices.</li>
        </ul>
        <ExplainBox>
          Integrity is the foundation of all ethical behaviour. Without integrity, an accountant's work has no value.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="3. Confidentiality">
        <p>
          <strong>Confidentiality</strong> is the duty to respect and protect sensitive information obtained during the course of professional work.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Not disclosing client or employer information without proper authority.</li>
          <li>Not using confidential information for personal gain.</li>
          <li>Safeguarding data against unauthorised access or theft.</li>
          <li>Disposing of confidential documents securely.</li>
        </ul>
        <ExplainBox>
          Clients and employers trust accountants with highly sensitive data. Breaching confidentiality destroys that trust and may have legal consequences.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="4. Competence">
        <p>
          <strong>Competence</strong> means maintaining professional knowledge and skill at the level required to ensure that clients or employers receive competent professional service.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Keeping up to date with changes in accounting standards, laws, and regulations.</li>
          <li>Pursuing continuing professional development (CPD).</li>
          <li>Only undertaking work for which you have the necessary expertise.</li>
          <li>Seeking guidance or advice when needed.</li>
        </ul>
        <ExplainBox>
          Competence protects the public from incompetent advice. It is not just about initial qualifications—it requires lifelong learning.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="5. Objectivity">
        <p>
          <strong>Objectivity</strong> is the principle of not allowing bias, conflict of interest, or undue influence to override professional judgement.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Remaining impartial and independent when performing duties.</li>
          <li>Disclosing any relationships or interests that could create a conflict of interest.</li>
          <li>Basing professional decisions on facts and evidence, not personal feelings.</li>
          <li>Avoiding situations where professional judgement could be compromised.</li>
        </ul>
        <ExplainBox>
          Objectivity ensures that financial statements and advice are reliable. If an accountant is biased, the information loses credibility.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="6. Compliance">
        <p>
          <strong>Compliance</strong> means adhering to all relevant laws, regulations, and professional codes of conduct.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Following accounting standards (e.g., IFRS, GAAP).</li>
          <li>Complying with tax laws, company law, and anti-money laundering regulations.</li>
          <li>Reporting any illegal or unethical practices through proper channels.</li>
          <li>Ensuring that all financial reporting is complete and accurate.</li>
        </ul>
        <ExplainBox>
          Compliance protects both the accountant and the business from legal penalties. It is the minimum standard; ethical behaviour often goes beyond mere legal compliance.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Summary Table of Core Principles">
        <WorkedTable
          title="Core Ethical Principles – Overview"
          columns={['Principle', 'Meaning', 'Key Behaviour']}
          rows={[
            ['Professionalism', 'Acting in accordance with professional standards', 'Professional attitude, continuous learning'],
            ['Integrity', 'Honest and straightforward in all dealings', 'Truthfulness, moral courage'],
            ['Confidentiality', 'Respecting and protecting sensitive information', 'Safeguarding data, not disclosing without authority'],
            ['Competence', 'Maintaining professional knowledge and skill', 'CPD, staying up-to-date'],
            ['Objectivity', 'Not allowing bias or conflict of interest', 'Impartiality, independence'],
            ['Compliance', 'Adhering to laws and professional codes', 'Following regulations, reporting irregularities'],
          ]}
        />
      </SubtopicCard>
    </div>
  );

  const corePrinciplesAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Core Principles</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Professionalism:</strong> Professional standards</li>
        <li><strong>Integrity:</strong> Honesty and fairness</li>
        <li><strong>Confidentiality:</strong> Protecting sensitive data</li>
        <li><strong>Competence:</strong> Maintaining knowledge and skills</li>
        <li><strong>Objectivity:</strong> Impartial and independent judgement</li>
        <li><strong>Compliance:</strong> Adhering to laws and codes</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'introduction',
      title: 'Ethics Introduction',
      color: 'blue',
      content: introductionContent,
      aside: introductionAside,
    },
    {
      id: 'core-principles',
      title: 'Core Principles',
      color: 'purple',
      content: corePrinciplesContent,
      aside: corePrinciplesAside,
    },
  ];

  // ---------- State ----------
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const topRef = useRef<HTMLDivElement>(null);

  // ---------- Navigation handlers ----------
  const resetScroll = () => {
    const lessonArea = document.getElementById('lesson-scroll-area');
    if (lessonArea) lessonArea.scrollTop = 0;

    let node: HTMLElement | null = topRef.current;
    while (node) {
      if (node.scrollTop !== 0) node.scrollTop = 0;
      node = node.parentElement;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (document.scrollingElement) {
      (document.scrollingElement as HTMLElement).scrollTop = 0;
    }
  };

  const handleNavigate = (id: string) => {
    setActiveId(id);
    resetScroll();
    requestAnimationFrame(resetScroll);
    setTimeout(resetScroll, 0);
    setTimeout(resetScroll, 50);
    setTimeout(resetScroll, 150);
  };

  const activeIndex = Math.max(sections.findIndex((s) => s.id === activeId), 0);
  const activeSection = sections[activeIndex];
  const isLastChapter = activeIndex >= sections.length - 1;

  // ---------- Sub-components ----------
  const TopicNav: React.FC<{
    activeId: string;
    onNavigate: (id: string) => void;
  }> = ({ activeId, onNavigate }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const { scrollLeft } = scrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
        scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    };

    return (
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3">
        <div className="w-full px-[5px] sm:px-6 md:px-8 relative flex items-center">
          <button
            type="button"
            aria-label="Scroll topics left"
            onClick={() => scroll('left')}
            className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
          >
            <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s, i) => {
              const c = colorMap[s.color];
              return (
                <button
                  key={s.id}
                  onClick={() => onNavigate(s.id)}
                  aria-current={activeId === s.id ? 'page' : undefined}
                  style={
                    activeId === s.id
                      ? { backgroundColor: c.bg, boxShadow: `0 3px 0 ${c.dark}` }
                      : undefined
                  }
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    activeId === s.id
                      ? 'text-white'
                      : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}. {s.title}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="Scroll topics right"
            onClick={() => scroll('right')}
            className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
          >
            <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const TopicHero: React.FC<{ section: TopicSection; index: number }> = ({ section, index }) => {
    const c = colorMap[section.color];
    return (
      <div
        className="relative overflow-hidden pt-10 pb-10 sm:pt-12 sm:pb-12"
        style={{ backgroundColor: c.bg, borderBottom: `6px solid ${c.dark}` }}
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-24 bottom-[-60px] h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-[-40px] top-10 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative w-full px-[5px] sm:px-6 md:px-8">
          <div
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-1.5 text-xs font-extrabold mb-4 shadow-sm"
            style={{ color: c.text }}
          >
            TOPIC {index + 1} OF {sections.length}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {section.title}
          </h1>
        </div>
      </div>
    );
  };

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <style>{highlightStyles}</style>

      {/* Hero */}
      <TopicHero section={activeSection} index={activeIndex} />

      {/* Topic rail */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
        <TopicNav activeId={activeId} onNavigate={handleNavigate} />
      </div>

      {/* Main Content */}
      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="max-w-none">{activeSection.content}</div>
          {activeSection.aside && <aside className="lg:sticky lg:top-24 space-y-5">{activeSection.aside}</aside>}
        </div>

        {/* Footer - Key Takeaways, shown on final topic */}
        {isLastChapter && (
          <div
            className="mt-12 p-6 sm:p-8 rounded-2xl text-white"
            style={{ backgroundColor: '#58CC02', borderBottom: '6px solid #46A302' }}
          >
            <h3 className="font-extrabold text-2xl mb-3">🎉 Key Takeaways</h3>
            <ul className="space-y-3 text-white text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Business Ethics:</strong> Moral principles guiding behaviour in business and accounting. Essential for trust, reputation, and legal compliance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Core Principles:</strong> Professionalism, Integrity, Confidentiality, Competence, Objectivity, and Compliance form the foundation of ethical accounting practice.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  Each principle requires specific behaviours: maintaining standards, honesty, protecting data, continuous learning, impartiality, and following laws.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  Ethical lapses can have severe personal, organisational, and societal consequences. Integrity is an accountant's most valuable asset.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Business Ethics!' : `Topic ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to the <span className="text-[#1CB0F6]">next topic</span>?</>
            ) : (
              <>Next: <span className="text-[#1CB0F6]">{sections[activeIndex + 1].title}</span></>
            )}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!isLastChapter) {
                handleNavigate(sections[activeIndex + 1].id);
              } else {
                alert('Proceed to the next topic');
              }
            }}
            style={{
              backgroundColor: colorMap[isLastChapter ? sections[0].color : sections[activeIndex + 1].color].bg,
              boxShadow: `0 4px 0 ${colorMap[isLastChapter ? sections[0].color : sections[activeIndex + 1].color].dark}`,
            }}
            className="px-8 py-3 text-white rounded-full font-extrabold transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {isLastChapter ? 'Continue →' : 'Next Topic →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessEthics;