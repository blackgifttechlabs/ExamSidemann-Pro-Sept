import React, { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaCalculator,
  FaHandshake,
  FaUsers,
  FaBalanceScale,
  FaFileInvoice,
} from 'react-icons/fa';

/**
 * Topic: PartnershipsFormation – Principles of Accounts
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */
export const PartnershipsFormation: React.FC = () => {
  // ---------- CSS keyframes (reused) ----------
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
    <div className="min-w-0 rounded-[9px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
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
    <figure className="my-4 min-w-0 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
      <figcaption className="border-b border-slate-100 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-700">
        {title}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/60">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-2 py-1 font-semibold text-slate-600 ${i === 0 ? 'text-left' : 'text-right'}`}
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
                    className={`px-2 py-1 ${c === 0 ? 'text-left text-slate-700' : 'text-right text-slate-800 tabular-nums'}`}
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
        <p className="border-t border-slate-100 px-2 py-1 text-xs text-slate-500">{note}</p>
      )}
    </figure>
  );

  // ---------- Section 1: Formation ----------
  const formationContent = (
    <div className="space-y-6">
      <SubtopicCard title="Definition and Nature of a Partnership">
        <p>
          <strong>Definition:</strong> A partnership is a business relationship between two or more persons (usually 2 to 20, though exceptions exist) who agree to combine their resources (capital, skills, effort) to carry on a business with the aim of sharing profits or losses.
        </p>
        <p>
          Partnerships are governed by the Partnership Act (e.g., in the UK, the Partnership Act 1890). Unless otherwise agreed, partners share profits and losses equally.
        </p>
        <ExplainBox>
          Partnerships are common in professions like accounting, law, and medicine, as well as in small family businesses. They allow individuals to pool resources and expertise.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Partnership Agreement/Deed">
        <p>
          A <strong>partnership agreement</strong> (or deed) is a written document that sets out the terms and conditions under which the partnership operates. It is not legally required but is highly recommended to avoid disputes.
        </p>
        <p>Common contents include:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Profit-sharing ratio:</strong> How profits and losses are divided among partners.</li>
          <li><strong>Interest on capital:</strong> Whether partners receive interest on their capital contributions (usually a fixed percentage).</li>
          <li><strong>Interest on drawings:</strong> Charged to partners when they withdraw money for personal use.</li>
          <li><strong>Partners' salaries:</strong> Some partners may receive a salary for their work in the business.</li>
          <li><strong>Capital contributions:</strong> The amount each partner is required to contribute initially.</li>
          <li><strong>Duration and dissolution:</strong> How the partnership can be terminated.</li>
        </ul>
        <ExplainBox>
          Without a partnership agreement, the Partnership Act provides default rules (e.g., equal profit sharing, no interest on capital, no salaries). This may not reflect the partners' intentions, so a deed is crucial.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Advantages of Partnerships">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Shared capital:</strong> More partners mean more capital, reducing reliance on loans.</li>
          <li><strong>Shared skills:</strong> Partners can bring different expertise (e.g., one may be good at sales, another at finance).</li>
          <li><strong>Shared risk:</strong> Losses are distributed among partners, reducing the burden on any one individual.</li>
          <li><strong>Easy to form:</strong> Compared to companies, partnerships have fewer legal formalities.</li>
          <li><strong>Greater borrowing capacity:</strong> Multiple partners may increase the business's ability to obtain credit.</li>
        </ul>
      </SubtopicCard>

      <SubtopicCard title="Disadvantages of Partnerships">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Unlimited liability:</strong> Partners are personally liable for all debts of the business (unless a limited partnership is formed).</li>
          <li><strong>Shared decision-making:</strong> Disagreements can arise, delaying decisions.</li>
          <li><strong>Potential for conflict:</strong> Differences in opinion or work ethic can strain relationships.</li>
          <li><strong>Limited life:</strong> The partnership may end if a partner leaves or dies, unless the agreement provides otherwise.</li>
          <li><strong>Mutual agency:</strong> Each partner can bind the partnership to contracts, which may create unexpected obligations.</li>
        </ul>
        <ExplainBox>
          The main drawback is unlimited liability; partners may have to use personal assets to settle business debts. This is a key consideration when choosing a business structure.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const formationAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Partnership Formation</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Partnership:</strong> 2-20 persons carrying on business for profit</li>
        <li><strong>Partnership deed:</strong> sets profit-sharing, interest, salaries</li>
        <li><strong>Advantages:</strong> shared capital, skills, risk</li>
        <li><strong>Disadvantages:</strong> unlimited liability, potential conflict</li>
        <li>Without agreement, default rules apply</li>
      </ul>
    </div>
  );

  // ---------- Section 2: Financial Statements ----------
  const financialStatementsContent = (
    <div className="space-y-6">
      <SubtopicCard title="Income Statement for a Partnership">
        <p>
          The income statement (trading and profit or loss account) for a partnership is prepared in the same way as for a sole trader. It calculates the <strong>net profit</strong> (or loss) for the period.
        </p>
        <p>
          The net profit is then transferred to the <strong>appropriation account</strong>, where it is divided among the partners according to the partnership agreement.
        </p>
        <WorkedTable
          title="Income Statement – Example"
          columns={['', '$', '$']}
          rows={[
            ['Sales', '', '250,000'],
            ['Less: Cost of Sales', '', '(120,000)'],
            ['Gross Profit', '', '130,000'],
            ['Less: Expenses', '', ''],
            ['Rent', '10,000', ''],
            ['Wages', '15,000', ''],
            ['Insurance', '3,000', ''],
            ['Depreciation', '5,000', '(33,000)'],
            ['Net Profit before Appropriation', '', '97,000'],
          ]}
          note="The net profit of $97,000 will be distributed in the appropriation account."
        />
      </SubtopicCard>

      <SubtopicCard title="Appropriation Account">
        <p>
          The appropriation account shows how the net profit is distributed among the partners. It includes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Interest on capital:</strong> Paid to partners based on their capital balances.</li>
          <li><strong>Interest on drawings:</strong> Charged to partners for withdrawals; reduces their share.</li>
          <li><strong>Partners' salaries:</strong> Fixed amounts paid to partners who work in the business.</li>
          <li><strong>Residual profit:</strong> The remaining profit is split according to the profit-sharing ratio.</li>
        </ul>
        <p>
          The appropriation account is prepared after the income statement and before the statement of financial position.
        </p>
        <WorkedTable
          title="Appropriation Account – Example"
          columns={['', 'Partner A $', 'Partner B $', 'Total $']}
          rows={[
            ['Net Profit (from income statement)', '', '', '97,000'],
            ['Less: Interest on drawings', '', '', ''],
            ['Partner A', '2,000', '', ''],
            ['Partner B', '1,500', '', '(3,500)'],
            ['Adjusted Profit', '', '', '93,500'],
            ['Less: Interest on capital', '', '', ''],
            ['Partner A (5% of 50,000)', '2,500', '', ''],
            ['Partner B (5% of 30,000)', '', '1,500', '(4,000)'],
            ['Less: Salaries', '', '', ''],
            ['Partner A (salary)', '10,000', '', ''],
            ['Partner B (salary)', '8,000', '', '(18,000)'],
            ['Residual Profit', '', '', '71,500'],
            ['Share of residual profit (3:2)', '42,900', '28,600', '71,500'],
            ['Total appropriation', '57,400', '38,100', '95,500'],
          ]}
          note="The total appropriation equals the adjusted profit (93,500) after interest on drawings. The residual profit is shared according to the agreed ratio."
        />
        <ExplainBox>
          The appropriation account ensures that each partner receives their agreed entitlements before the residual profit is split. This aligns with the partnership deed.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Statement of Financial Position for a Partnership">
        <p>
          The statement of financial position (balance sheet) for a partnership shows the assets, liabilities, and partners' capital and current accounts. The capital and current accounts are shown separately.
        </p>
        <p>
          The capital account usually remains fixed (under the fixed capital method), while current accounts record changes such as interest, salaries, drawings, and share of profit.
        </p>
        <WorkedTable
          title="Statement of Financial Position – Example"
          columns={['', '$', '$']}
          rows={[
            ['Non-current Assets', '', ''],
            ['Equipment (net)', '', '75,000'],
            ['', '', ''],
            ['Current Assets', '', ''],
            ['Inventory', '25,000', ''],
            ['Trade Receivables', '20,000', ''],
            ['Cash', '8,000', '53,000'],
            ['Total Assets', '', '128,000'],
            ['', '', ''],
            ['Capital and Liabilities', '', ''],
            ['Capital Accounts', '', ''],
            ['Partner A', '50,000', ''],
            ['Partner B', '30,000', '80,000'],
            ['Current Accounts', '', ''],
            ['Partner A', '20,000', ''],
            ['Partner B', '5,000', '25,000'],
            ['Total Capital', '', '105,000'],
            ['Non-current Liabilities', '', ''],
            ['Bank Loan', '', '15,000'],
            ['Current Liabilities', '', ''],
            ['Trade Payables', '8,000', ''],
            ['Total Capital and Liabilities', '', '128,000'],
          ]}
          note="The total capital (105,000) plus liabilities (15,000+8,000=23,000) equals total assets (128,000). The current account balances represent each partner's accumulated share of profits less drawings."
        />
      </SubtopicCard>
    </div>
  );

  const financialStatementsAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Partnership Financial Statements</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>Income Statement → Net Profit</li>
        <li>Appropriation Account → distribute profit</li>
        <li>Interest on capital, drawings, salaries</li>
        <li>Residual profit shared in ratio</li>
        <li>Balance Sheet: Capital and Current accounts shown</li>
      </ul>
    </div>
  );

  // ---------- Section 3: Capital and Current Accounts ----------
  const capitalCurrentContent = (
    <div className="space-y-6">
      <SubtopicCard title="Capital Accounts">
        <p>
          Under the <strong>fixed capital method</strong>, each partner's capital account remains fixed at the amount of capital contributed. Changes to capital (e.g., additional contributions or withdrawals of capital) are recorded in the capital account, but other items (interest, salaries, drawings, share of profit) are recorded in the <strong>current account</strong>.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Credit side:</strong> Opening balance, additional capital introduced.</li>
          <li><strong>Debit side:</strong> Withdrawals of capital (rare).</li>
        </ul>
        <p>
          The capital account balance is normally a credit balance representing the partner's stake in the business.
        </p>
        <WorkedTable
          title="Capital Account (Fixed Method) – Example"
          columns={['', 'Partner A $', 'Partner B $']}
          rows={[
            ['Opening Balance (1 Jan)', '50,000', '30,000'],
            ['Add: Additional Capital', '5,000', '0'],
            ['Less: Withdrawals of Capital', '0', '(2,000)'],
            ['Closing Balance', '55,000', '28,000'],
          ]}
          note="The capital account only reflects capital movements; other items are in the current account."
        />
      </SubtopicCard>

      <SubtopicCard title="Current Accounts">
        <p>
          The current account records all transactions that affect a partner's share of profits or relationship with the business, except capital contributions/withdrawals. These include:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Credit side:</strong> Interest on capital, salaries, share of profit.</li>
          <li><strong>Debit side:</strong> Drawings, interest on drawings.</li>
        </ul>
        <p>
          The current account balance can be credit (favorable) or debit (if drawings exceed share of profit).
        </p>
        <WorkedTable
          title="Current Account – Example"
          columns={['', 'Partner A $', 'Partner B $']}
          rows={[
            ['Opening Balance (1 Jan)', '5,000', '2,000'],
            ['Add: Interest on Capital', '2,500', '1,500'],
            ['Add: Salary', '10,000', '8,000'],
            ['Add: Share of Residual Profit', '42,900', '28,600'],
            ['Less: Drawings', '(15,000)', '(10,000)'],
            ['Less: Interest on Drawings', '(2,000)', '(1,500)'],
            ['Closing Balance', '43,400', '28,600'],
          ]}
          note="The closing balance is transferred to the statement of financial position as part of partners' current accounts."
        />
      </SubtopicCard>

      <SubtopicCard title="Difference Between Capital and Current Accounts">
        <table className="w-full text-sm border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">Feature</th>
              <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">Capital Account</th>
              <th className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">Current Account</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 px-2 py-1">Purpose</td>
              <td className="border border-slate-200 px-2 py-1">Record permanent investment</td>
              <td className="border border-slate-200 px-2 py-1">Record temporary changes (profit, drawings)</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-2 py-1">Nature</td>
              <td className="border border-slate-200 px-2 py-1">Fixed (usually)</td>
              <td className="border border-slate-200 px-2 py-1">Fluctuating</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-2 py-1">Items recorded</td>
              <td className="border border-slate-200 px-2 py-1">Capital introduced, capital withdrawn</td>
              <td className="border border-slate-200 px-2 py-1">Interest, salaries, drawings, profit share</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-2 py-1">Balance</td>
              <td className="border border-slate-200 px-2 py-1">Usually credit</td>
              <td className="border border-slate-200 px-2 py-1">Can be debit or credit</td>
            </tr>
          </tbody>
        </table>
        <ExplainBox>
          Using the fixed capital method, the capital account stays constant (unless additional capital is introduced or withdrawn), while the current account absorbs all profit-related movements. This makes it easier to track each partner's entitlement.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Preparing Capital and Current Accounts in Columnar Format">
        <p>
          In practice, capital and current accounts are often prepared in a columnar format (side-by-side) for each partner. This allows for a clear presentation of each partner's balances.
        </p>
        <WorkedTable
          title="Capital and Current Accounts (Columnar) – Example"
          columns={['', 'Partner A $', 'Partner B $', 'Total $']}
          rows={[
            ['Capital Accounts (Opening)', '50,000', '30,000', '80,000'],
            ['Add: Additional Capital', '5,000', '0', '5,000'],
            ['Less: Capital Withdrawn', '0', '(2,000)', '(2,000)'],
            ['Closing Capital', '55,000', '28,000', '83,000'],
            ['', '', '', ''],
            ['Current Accounts (Opening)', '5,000', '2,000', '7,000'],
            ['Add: Interest on Capital', '2,500', '1,500', '4,000'],
            ['Add: Salaries', '10,000', '8,000', '18,000'],
            ['Add: Share of Residual Profit', '42,900', '28,600', '71,500'],
            ['Less: Drawings', '(15,000)', '(10,000)', '(25,000)'],
            ['Less: Interest on Drawings', '(2,000)', '(1,500)', '(3,500)'],
            ['Closing Current', '43,400', '28,600', '72,000'],
            ['Total Capital + Current', '98,400', '56,600', '155,000'],
          ]}
          note="The total capital and current accounts (155,000) represents the total partners' equity, which appears in the statement of financial position."
        />
      </SubtopicCard>
    </div>
  );

  const capitalCurrentAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Capital vs Current Accounts</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Capital Account:</strong> Fixed, records permanent investment</li>
        <li><strong>Current Account:</strong> Fluctuates, records profit share, drawings, interest, salaries</li>
        <li>Columnar format shows each partner's balance</li>
        <li>Total equity = Capital + Current accounts</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'formation',
      title: 'Formation',
      color: 'blue',
      content: formationContent,
      aside: formationAside,
    },
    {
      id: 'financial-statements',
      title: 'Financial Statements',
      color: 'purple',
      content: financialStatementsContent,
      aside: financialStatementsAside,
    },
    {
      id: 'capital-current',
      title: 'Capital & Current Accounts',
      color: 'green',
      content: capitalCurrentContent,
      aside: capitalCurrentAside,
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
    <div className="min-h-screen min-w-0 overflow-x-clip bg-slate-50 font-sans text-slate-900 pb-20">
      <style>{highlightStyles}</style>

      {/* Hero */}
      <TopicHero section={activeSection} index={activeIndex} />

      {/* Topic rail */}
      <div className="sticky top-0 z-50 isolate w-full bg-white border-b border-slate-200 shadow-sm">
        <TopicNav activeId={activeId} onNavigate={handleNavigate} />
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 max-w-none">{activeSection.content}</div>
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
                  <strong>Partnership Formation:</strong> A business owned by 2–20 persons, governed by a partnership deed that specifies profit-sharing, interest, and salaries.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Financial Statements:</strong> The income statement calculates net profit, which is distributed via the appropriation account (interest, salaries, residual profit sharing). The balance sheet shows capital and current accounts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Capital vs Current Accounts:</strong> Capital accounts are fixed (permanent investment); current accounts fluctuate with profit shares, drawings, and other adjustments. Columnar format is used for clarity.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Key Ratios & Checks:</strong> Ensure that the appropriation account totals match the net profit, and that assets equal liabilities plus partners' equity.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Partnerships!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default PartnershipsFormation;