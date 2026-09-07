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
  FaFileInvoice,
} from 'react-icons/fa';

/**
 * Topic: Company Accounts – Principles of Accounts (Form 4)
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */
export const CompanyAccounts: React.FC = () => {
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

  // A worked-numbers table
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

  // ---------- Section 1: Key Terms ----------
  const keyTermsContent = (
    <div className="space-y-6">
      <SubtopicCard title="Shares">
        <p>
          <strong>Shares</strong> represent ownership in a company. When a person buys shares, they become a shareholder (part-owner) of the company.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Ordinary shares</strong> (also called equity shares): These carry voting rights and a variable dividend based on the company's performance. Ordinary shareholders are last to be paid in the event of liquidation.
          </li>
          <li>
            <strong>Preference shares</strong>: These typically have a fixed dividend rate and are paid before ordinary shareholders. They may or may not carry voting rights. In liquidation, preference shareholders have priority over ordinary shareholders.
          </li>
        </ul>
        <ExplainBox>
          Ordinary shares are riskier but offer higher potential returns. Preference shares are more like a hybrid between shares and loans.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Debentures">
        <p>
          <strong>Debentures</strong> are a form of long-term loan taken by the company from the public or financial institutions. Debenture holders are creditors of the company, not owners.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Interest on debentures is paid regardless of profit.</li>
          <li>Debentures are secured against the company's assets.</li>
          <li>They are shown as a liability (long-term loan) in the statement of financial position, not as part of shareholders' equity.</li>
        </ul>
        <ExplainBox>
          Debentures are a way for companies to raise finance without diluting ownership. However, they increase financial risk because interest must be paid.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Share Capital Terms">
        <p>
          Various terms are used to describe the different stages of share capital:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Authorised share capital</strong> (also called nominal or registered capital): The maximum amount of share capital that a company is allowed to issue, as stated in its memorandum of association.
          </li>
          <li>
            <strong>Issued share capital</strong>: The portion of authorised capital that has actually been offered for sale to the public.
          </li>
          <li>
            <strong>Called up share capital</strong>: The amount of the issued capital that the company has requested shareholders to pay. In some cases, shares are issued with a call for payment later.
          </li>
          <li>
            <strong>Paid up share capital</strong>: The amount that shareholders have actually paid on the shares they hold. This may be less than called-up capital if some payments are in arrears.
          </li>
        </ul>
        <ExplainBox>
          In practice, most companies have fully paid shares, so called‑up capital equals paid‑up capital. Authorised capital is often higher than issued capital to allow for future issues.
        </ExplainBox>
        <WorkedTable
          title="Share Capital Example"
          columns={['', '$']}
          rows={[
            ['Authorised share capital (1,000,000 shares of $1 each)', '1,000,000'],
            ['Issued share capital (800,000 shares of $1 each)', '800,000'],
            ['Called up capital (80% of issued)', '640,000'],
            ['Paid up capital (shareholders have paid 90% of called-up)', '576,000'],
          ]}
          note="The unpaid portion is shown as calls in arrears (a current asset) or deducted from share capital."
        />
      </SubtopicCard>

      <SubtopicCard title="Shareholders' Funds">
        <p>
          <strong>Shareholders' funds</strong> represent the total equity belonging to shareholders. It is the residual interest in the assets after deducting liabilities.
        </p>
        <p>Components include:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Issued share capital (ordinary and preference).</li>
          <li>Share premium (amount received above the nominal value).</li>
          <li>General reserves (transfers from profits for future use).</li>
          <li>Retained profits (profits kept in the business).</li>
        </ul>
        <WorkedTable
          title="Shareholders' Funds – Example"
          columns={['', '$']}
          rows={[
            ['Issued Ordinary Share Capital ($1 each)', '500,000'],
            ['Share Premium Account', '80,000'],
            ['General Reserve', '120,000'],
            ['Retained Profits (Income Surplus)', '200,000'],
            ['Total Shareholders\' Funds', '900,000'],
          ]}
          note="Shareholders' funds appear in the equity section of the statement of financial position."
        />
      </SubtopicCard>

      <SubtopicCard title="Dividends">
        <p>
          <strong>Dividends</strong> are payments made to shareholders out of the company's profits. They represent a return on investment.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Interim dividends</strong>: Paid during the year before the annual accounts are finalised. They are paid out of current profits.
          </li>
          <li>
            <strong>Final dividends</strong>: Recommended by the directors and approved by shareholders at the annual general meeting. They are based on the full year's profit.
          </li>
        </ul>
        <p>
          Dividends are not a business expense; they are an appropriation of profit. They are shown in the Statement of Changes in Equity.
        </p>
        <ExplainBox>
          A company is not obliged to pay dividends. Retaining profits can help fund growth, but some shareholders prefer regular income.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="General Reserves and Retained Profits">
        <p>
          <strong>General reserves</strong> are amounts set aside from profits for a specific purpose (e.g., expansion) or simply to strengthen the financial position. They are not distributed as dividends.
        </p>
        <p>
          <strong>Retained profits</strong> (also called retained earnings) are the accumulated profits that have not been distributed as dividends or transferred to reserves. They are part of shareholders' funds.
        </p>
        <ExplainBox>
          Both reserves and retained profits belong to shareholders, but they are retained in the business to finance reinvestment or to act as a buffer against future losses.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const keyTermsAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Company Terms</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Shares:</strong> Ordinary (variable dividend) vs Preference (fixed dividend)</li>
        <li><strong>Debentures:</strong> Long-term loans, not equity</li>
        <li><strong>Authorised, issued, called-up, paid-up</strong> share capital</li>
        <li><strong>Shareholders' funds:</strong> Capital + reserves + retained profits</li>
        <li><strong>Dividends:</strong> Interim and final; not an expense</li>
        <li><strong>Reserves:</strong> Appropriated profits; retained profits are accumulated</li>
      </ul>
    </div>
  );

  // ---------- Section 2: Financial Statements ----------
  const financialStatementsContent = (
    <div className="space-y-6">
      <SubtopicCard title="Statement of Changes in Equity">
        <p>
          The <strong>Statement of Changes in Equity</strong> (SOCE) reconciles the opening and closing balances of each component of shareholders' equity. It shows:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>The issue of new shares and share premium.</li>
          <li>Transfers to/from reserves.</li>
          <li>Total comprehensive income (profit after tax).</li>
          <li>Dividends paid during the period.</li>
        </ul>
        <p>
          The SOCE is a primary financial statement for companies and must be prepared as part of the financial statements.
        </p>
        <WorkedTable
          title="Statement of Changes in Equity – Example"
          columns={['', 'Share Capital $', 'Share Premium $', 'General Reserve $', 'Retained Profits $', 'Total $']}
          rows={[
            ['Balance at 1 Jan', '500,000', '50,000', '100,000', '180,000', '830,000'],
            ['Issue of shares (cash)', '100,000', '20,000', '', '', '120,000'],
            ['Transfer from retained profits', '', '', '30,000', '(30,000)', '0'],
            ['Profit after tax', '', '', '', '80,000', '80,000'],
            ['Dividends paid', '', '', '', '(40,000)', '(40,000)'],
            ['Balance at 31 Dec', '600,000', '70,000', '130,000', '190,000', '990,000'],
          ]}
          note="The total at the end equals the shareholders' funds in the statement of financial position."
        />
        <ExplainBox>
          The SOCE provides a link between the income statement (which shows profit) and the statement of financial position (which shows equity). It is essential for understanding changes in equity over time.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Statement of Financial Position (Extract) – Equity Section">
        <p>
          In the statement of financial position, the equity and reserves section is presented as follows:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Issued share capital (ordinary and preference).</li>
          <li>Share premium account (if any).</li>
          <li>Reserves (general reserve, revaluation reserve, etc.).</li>
          <li>Retained profits (accumulated profits not distributed).</li>
        </ul>
        <p>
          The total of these items equals the shareholders' funds. Non-current liabilities (like debentures) are shown separately.
        </p>
        <WorkedTable
          title="Statement of Financial Position (extract) – Equity and Reserves"
          columns={['', '$']}
          rows={[
            ['Equity', ''],
            ['Issued ordinary share capital ($1 each)', '600,000'],
            ['Share premium account', '70,000'],
            ['General reserve', '130,000'],
            ['Retained profits', '190,000'],
            ['Total Equity (Shareholders\' Funds)', '990,000'],
            ['', ''],
            ['Non-current Liabilities', ''],
            ['Debentures (long-term loan)', '200,000'],
            ['', ''],
            ['Current Liabilities', ''],
            ['Trade payables', '50,000'],
            ['Total Capital and Liabilities', '1,240,000'],
          ]}
          note="The equity section is shown after assets, so the statement balances."
        />
        <ExplainBox>
          The equity section may be further broken down by class of share (ordinary vs preference) if applicable. Always check that the total equity plus liabilities equals total assets.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const financialStatementsAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Company Financial Statements</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Statement of Changes in Equity:</strong> Shows movements in share capital, reserves, retained profits</li>
        <li>Includes: share issues, profit, dividends, transfers to reserves</li>
        <li><strong>SFP Extract:</strong> Equity section shows share capital, premium, reserves, retained profits</li>
        <li>Debentures are liabilities, not equity</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'key-terms',
      title: 'Key Terms',
      color: 'blue',
      content: keyTermsContent,
      aside: keyTermsAside,
    },
    {
      id: 'financial-statements',
      title: 'Financial Statements',
      color: 'purple',
      content: financialStatementsContent,
      aside: financialStatementsAside,
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
                  <strong>Shares & Debentures:</strong> Shares represent ownership (ordinary vs preference), debentures are loans. Share capital has multiple stages: authorised, issued, called-up, paid-up.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Shareholders' Funds:</strong> Comprise share capital, share premium, reserves, and retained profits. Dividends are appropriations of profit, not expenses.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Statement of Changes in Equity:</strong> Reconciles opening and closing equity, showing share issues, profit, dividends, and transfers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>SFP Equity Extract:</strong> Equity section includes issued capital, premium, reserves, and retained profits. Debentures are shown as liabilities.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Company Accounts!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default CompanyAccounts;