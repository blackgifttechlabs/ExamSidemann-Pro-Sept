import React, { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaCalculator,
  FaFileInvoice,
  FaReceipt,
  FaMoneyBillWave,
  FaBalanceScale,
} from 'react-icons/fa';

/**
 * Topic: Single Entry and Incomplete Records – Principles of Accounts (Form 4)
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */
export const SingleEntryAndIncompleteRecords: React.FC = () => {
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

    /* Faint-ruled ledger paper background (kept for consistency) */
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

  // ---------- Section 1: Statement of Affairs ----------
  const statementOfAffairsContent = (
    <div className="space-y-6">
      <SubtopicCard title="Purpose of a Statement of Affairs">
        <p>
          <strong>Definition:</strong> A statement of affairs is a summary of a business's assets and liabilities at a given date. It is used when full double-entry records are not maintained—for example, when the business operates on a single-entry system or when records are incomplete.
        </p>
        <ExplainBox>
          Think of it as a snapshot of what the business owns and owes. It helps determine the owner's capital by applying the accounting equation: <strong>Capital = Assets − Liabilities</strong>.
        </ExplainBox>
        <p>
          The statement of affairs is essentially a balance sheet, but it may be prepared in a simplified format, often with a list of assets on one side and liabilities on the other, or in a vertical format showing net assets.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Calculating Opening Capital">
        <p>
          At the start of the period, if no opening capital figure is given, you can derive it from the opening statement of affairs:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Opening Capital = Total Assets at Start − Total Liabilities at Start
          </p>
        </div>
        <WorkedTable
          title="Opening Statement of Affairs – Example"
          columns={['Assets', '$', 'Liabilities', '$']}
          rows={[
            ['Cash', '5,000', 'Trade Payables', '12,000'],
            ['Trade Receivables', '8,000', 'Bank Loan', '10,000'],
            ['Inventory', '15,000', '', ''],
            ['Equipment', '20,000', '', ''],
            ['Total Assets', '48,000', 'Total Liabilities', '22,000'],
          ]}
          note="Opening Capital = 48,000 − 22,000 = $26,000"
        />
        <p>
          <strong>Interpretation:</strong> The opening capital is the owner's investment in the business at the beginning of the period. It is the foundation for calculating profit using the capital comparison method.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Calculating Closing Capital">
        <p>
          Similarly, the closing capital is derived from the statement of affairs at the end of the period:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Closing Capital = Total Assets at End − Total Liabilities at End
          </p>
        </div>
        <WorkedTable
          title="Closing Statement of Affairs – Example"
          columns={['Assets', '$', 'Liabilities', '$']}
          rows={[
            ['Cash', '7,000', 'Trade Payables', '14,000'],
            ['Trade Receivables', '12,000', 'Bank Loan', '8,000'],
            ['Inventory', '18,000', '', ''],
            ['Equipment', '20,000', '', ''],
            ['Total Assets', '57,000', 'Total Liabilities', '22,000'],
          ]}
          note="Closing Capital = 57,000 − 22,000 = $35,000"
        />
        <p>
          The closing capital serves as the starting point for calculating net profit (or loss) when combined with drawings and capital introduced.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Using the Accounting Equation">
        <p>
          The accounting equation is the backbone of single‑entry adjustments:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
          <p className="font-mono text-2xl font-bold text-slate-800">
            Assets = Liabilities + Capital
          </p>
        </div>
        <ExplainBox>
          This equation must always hold. Any change on one side must be balanced by a change on the other side. When records are incomplete, you can use this equation to find missing figures—for example, if you know assets and liabilities, you can find capital; if you know capital and liabilities, you can find assets; and so on.
        </ExplainBox>
        <p>
          In practice, the statement of affairs is prepared by listing all known assets and liabilities, then calculating capital as the balancing figure.
        </p>
        <WorkedTable
          title="Finding Missing Figure Using the Equation"
          columns={['Item', '$']}
          rows={[
            ['Assets (known)', '100,000'],
            ['Liabilities (known)', '40,000'],
            ['Capital (balancing figure)', '60,000'],
          ]}
          note="If any item is missing, it becomes the balancing figure."
        />
      </SubtopicCard>
    </div>
  );

  const statementOfAffairsAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Points</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Statement of Affairs:</strong> snapshot of assets and liabilities</li>
        <li><strong>Opening Capital:</strong> Assets − Liabilities at start</li>
        <li><strong>Closing Capital:</strong> Assets − Liabilities at end</li>
        <li>Accounting equation must always balance</li>
        <li>Used when double‑entry is incomplete</li>
      </ul>
    </div>
  );

  // ---------- Section 2: Missing Figures ----------
  const missingFiguresContent = (
    <div className="space-y-6">
      <SubtopicCard title="Calculating Sales">
        <p>
          When sales figures are missing, they can be derived using several approaches:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Using mark‑up or margin:</strong> If you know the cost of sales and the gross profit percentage, you can calculate sales.
          </li>
          <li>
            <strong>Using the total receivables (debtors) account:</strong> By reconciling opening and closing balances with cash received, you can find credit sales.
          </li>
        </ul>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">Mark‑up method</p>
          <p className="font-mono">Sales = Cost of Sales × (1 + Mark‑up %)</p>
          <p className="font-mono text-sm font-bold mt-2">Margin method</p>
          <p className="font-mono">Sales = Gross Profit / Margin %</p>
          <p className="font-mono text-sm font-bold mt-2">Total Receivables Account</p>
          <p className="font-mono">Credit Sales = Closing Receivables + Cash Received − Opening Receivables</p>
        </div>
        <WorkedTable
          title="Example: Sales using Mark‑up"
          columns={['', '$']}
          rows={[
            ['Cost of Sales', '100,000'],
            ['Mark‑up %', '40%'],
            ['Sales', '100,000 × 1.40 = 140,000'],
          ]}
          note="If margin is 30%, Gross Profit = 30% × Sales; you can also work backwards."
        />
        <WorkedTable
          title="Example: Credit Sales from Receivables Account"
          columns={['', '$']}
          rows={[
            ['Opening Receivables', '15,000'],
            ['Add: Credit Sales (balancing figure)', 'X'],
            ['Less: Cash Received', '48,000'],
            ['Closing Receivables', '22,000'],
            ['X = 48,000 + 22,000 − 15,000 = 55,000'],
          ]}
          note="Credit Sales = 55,000"
        />
      </SubtopicCard>

      <SubtopicCard title="Calculating Purchases">
        <p>
          Purchases can be found using the total payables (creditors) account, or by working back from cost of sales:
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">Using Payables Account</p>
          <p className="font-mono">Credit Purchases = Closing Payables + Cash Paid − Opening Payables</p>
          <p className="font-mono text-sm font-bold mt-2">From Cost of Sales</p>
          <p className="font-mono">Purchases = Cost of Sales + Closing Inventory − Opening Inventory</p>
        </div>
        <WorkedTable
          title="Example: Credit Purchases from Payables Account"
          columns={['', '$']}
          rows={[
            ['Opening Payables', '12,000'],
            ['Add: Credit Purchases (balancing)', 'X'],
            ['Less: Cash Paid', '50,000'],
            ['Closing Payables', '18,000'],
            ['X = 50,000 + 18,000 − 12,000 = 56,000'],
          ]}
          note="Credit Purchases = 56,000"
        />
        <WorkedTable
          title="Example: Purchases from Cost of Sales"
          columns={['', '$']}
          rows={[
            ['Cost of Sales', '120,000'],
            ['Add: Closing Inventory', '25,000'],
            ['Less: Opening Inventory', '20,000'],
            ['Purchases', '125,000'],
          ]}
        />
      </SubtopicCard>

      <SubtopicCard title="Calculating Expenses">
        <p>
          Expenses can be reconstructed by taking the cash paid during the period and adjusting for accruals (expenses owing) and prepayments (expenses paid in advance).
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">Expense for the period</p>
          <p className="font-mono">
            Expense = Cash Paid + Opening Accrual − Closing Accrual − Opening Prepayment + Closing Prepayment
          </p>
        </div>
        <ExplainBox>
          Accruals are expenses that have been incurred but not yet paid; prepayments are expenses paid for future periods. Adjusting for these ensures the expense relates to the correct accounting period.
        </ExplainBox>
        <WorkedTable
          title="Example: Insurance Expense"
          columns={['', '$']}
          rows={[
            ['Cash paid for insurance', '8,000'],
            ['Add: Opening accrual (owing from last year)', '0'],
            ['Less: Closing accrual (owing at end)', '600'],
            ['Less: Opening prepayment', '400'],
            ['Add: Closing prepayment', '500'],
            ['Insurance expense for year', '7,500'],
          ]}
          note="The expense is 7,500 after adjusting for prepayments and accruals."
        />
      </SubtopicCard>

      <SubtopicCard title="Calculating Gross Profit">
        <p>
          When gross profit is missing, it can be calculated using mark‑up or margin percentages applied to sales or cost of sales.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">Using Mark‑up</p>
          <p className="font-mono">Gross Profit = Cost of Sales × Mark‑up %</p>
          <p className="font-mono text-sm font-bold mt-2">Using Margin</p>
          <p className="font-mono">Gross Profit = Sales × Margin %</p>
        </div>
        <WorkedTable
          title="Example: Gross Profit from Sales and Margin"
          columns={['', '$']}
          rows={[
            ['Sales', '200,000'],
            ['Margin %', '30%'],
            ['Gross Profit', '200,000 × 30% = 60,000'],
          ]}
        />
        <WorkedTable
          title="Example: Gross Profit from Cost and Mark‑up"
          columns={['', '$']}
          rows={[
            ['Cost of Sales', '140,000'],
            ['Mark‑up %', '40%'],
            ['Gross Profit', '140,000 × 40% = 56,000'],
          ]}
        />
      </SubtopicCard>

      <SubtopicCard title="Calculating Net Profit Using Capital Comparison">
        <p>
          This is a powerful method when profits are not directly given. The change in capital, adjusted for drawings and additional capital introduced, reveals the net profit (or loss).
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Net Profit = Closing Capital − Opening Capital + Drawings − Capital Introduced
          </p>
        </div>
        <ExplainBox>
          Drawings reduce capital, so we add them back. Capital introduced increases capital, so we subtract it. The resulting figure is the profit (or loss) generated during the period.
        </ExplainBox>
        <WorkedTable
          title="Example: Calculating Net Profit"
          columns={['', '$']}
          rows={[
            ['Closing Capital', '80,000'],
            ['Less: Opening Capital', '50,000'],
            ['Increase in Capital', '30,000'],
            ['Add: Drawings', '12,000'],
            ['Less: Additional Capital Introduced', '8,000'],
            ['Net Profit', '34,000'],
          ]}
          note="The business earned $34,000 during the period."
        />
      </SubtopicCard>

      <SubtopicCard title="Calculating Drawings">
        <p>
          Drawings are amounts taken by the owner for personal use. They can be found by:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Analyzing the cash/bank summary to see cash withdrawals that are not business expenses.</li>
          <li>Using the capital account: if you know opening and closing capital, profit, and additional capital introduced, drawings can be deduced.</li>
        </ul>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">From Capital Account</p>
          <p className="font-mono">Drawings = Opening Capital + Net Profit + Additional Capital − Closing Capital</p>
        </div>
        <WorkedTable
          title="Example: Calculating Drawings from Capital"
          columns={['', '$']}
          rows={[
            ['Opening Capital', '60,000'],
            ['Add: Net Profit', '25,000'],
            ['Add: Capital Introduced', '10,000'],
            ['Less: Closing Capital', '80,000'],
            ['Drawings', '15,000'],
          ]}
          note="The owner withdrew $15,000 during the period."
        />
        <WorkedTable
          title="Example: Drawings from Cash Summary"
          columns={['', '$']}
          rows={[
            ['Cash at start', '5,000'],
            ['Cash receipts (sales etc.)', '50,000'],
            ['Cash payments (expenses etc.)', '35,000'],
            ['Cash at end', '8,000'],
            ['Drawings (balancing)', '12,000'],
          ]}
          note="The balancing figure of 12,000 is the drawings."
        />
      </SubtopicCard>
    </div>
  );

  const missingFiguresAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Missing Figures</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Sales:</strong> from mark‑up/margin or receivables account</li>
        <li><strong>Purchases:</strong> from payables account or cost of sales</li>
        <li><strong>Expenses:</strong> adjust cash paid for accruals/prepayments</li>
        <li><strong>Gross Profit:</strong> from mark‑up or margin</li>
        <li><strong>Net Profit:</strong> using capital comparison</li>
        <li><strong>Drawings:</strong> from cash summary or capital account</li>
      </ul>
    </div>
  );

  // ---------- Section 3: Financial Statements ----------
  const financialStatementsContent = (
    <div className="space-y-6">
      <SubtopicCard title="Preparing Income Statement from Incomplete Records">
        <p>
          Once all the missing figures have been reconstructed—sales, purchases, expenses, and gross profit—you can prepare a full income statement (trading and profit or loss account). The process involves:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Calculate sales (credit and cash) using the methods from the previous section.</li>
          <li>Calculate purchases (credit and cash) similarly.</li>
          <li>Determine cost of sales: opening inventory + purchases − closing inventory.</li>
          <li>Calculate gross profit: sales − cost of sales.</li>
          <li>List all expenses (reconstructed) and deduct them from gross profit to arrive at net profit.</li>
        </ol>
        <p>
          The income statement can be presented in a vertical format, showing sales, cost of sales, gross profit, expenses, and net profit.
        </p>
        <WorkedTable
          title="Income Statement from Incomplete Records – Example"
          columns={['', '$', '$']}
          rows={[
            ['Sales (reconstructed)', '', '200,000'],
            ['Less: Cost of Sales', '', ''],
            ['Opening Inventory', '20,000', ''],
            ['Add: Purchases', '130,000', ''],
            ['Less: Closing Inventory', '(25,000)', '(125,000)'],
            ['Gross Profit', '', '75,000'],
            ['Less: Expenses', '', ''],
            ['Rent', '12,000', ''],
            ['Wages', '18,000', ''],
            ['Insurance', '6,000', ''],
            ['Depreciation', '4,000', '(40,000)'],
            ['Net Profit', '', '35,000'],
          ]}
          note="All figures are reconstructed from incomplete records using the methods covered earlier."
        />
        <ExplainBox>
          The income statement ties back to the net profit calculated from the capital comparison. If they differ, check your reconstructions.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Preparing Statement of Financial Position from Incomplete Records">
        <p>
          The statement of financial position (balance sheet) shows the assets, liabilities, and capital at the end of the period. With incomplete records, you will need to reconstruct:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Assets: cash, receivables, inventory, equipment, etc.</li>
          <li>Liabilities: payables, loans, accruals, etc.</li>
          <li>Capital: opening capital plus net profit less drawings plus additional capital introduced.</li>
        </ul>
        <p>
          The closing capital can also be calculated as the balancing figure from the accounting equation.
        </p>
        <WorkedTable
          title="Statement of Financial Position – Example"
          columns={['', '$', '$']}
          rows={[
            ['Non-current Assets', '', ''],
            ['Equipment (net of depreciation)', '', '55,000'],
            ['', '', ''],
            ['Current Assets', '', ''],
            ['Inventory', '25,000', ''],
            ['Trade Receivables', '22,000', ''],
            ['Cash', '8,000', '55,000'],
            ['Total Assets', '', '110,000'],
            ['', '', ''],
            ['Capital and Liabilities', '', ''],
            ['Capital', '', ''],
            ['Opening Capital', '50,000', ''],
            ['Add: Net Profit', '35,000', ''],
            ['Less: Drawings', '(15,000)', '70,000'],
            ['Non-current Liabilities', '', ''],
            ['Bank Loan', '', '20,000'],
            ['Current Liabilities', '', ''],
            ['Trade Payables', '18,000', ''],
            ['Accruals', '2,000', '20,000'],
            ['Total Capital and Liabilities', '', '110,000'],
          ]}
          note="Total assets must equal total capital and liabilities. The closing capital is derived from the capital account."
        />
      </SubtopicCard>

      <SubtopicCard title="Compiling Cash/Bank Summary to Find Missing Figures">
        <p>
          The cash/bank summary (or cash book summary) is a powerful tool in incomplete records. It lists all cash and bank receipts and payments, allowing you to find missing amounts such as:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Cash sales or cash purchases (when only credit figures are known).</li>
          <li>Drawings.</li>
          <li>Expenses paid in cash.</li>
          <li>Balancing figures like capital introduced.</li>
        </ul>
        <p>
          The format is a simple statement showing opening balance, receipts, payments, and closing balance. Any unknown can be deduced by balancing.
        </p>
        <WorkedTable
          title="Cash/Bank Summary – Example"
          columns={['', '$']}
          rows={[
            ['Opening Cash Balance', '5,000'],
            ['Add: Receipts', ''],
            ['Cash Sales', '45,000'],
            ['Receipts from Debtors', '48,000'],
            ['Additional Capital', '10,000'],
            ['Total Receipts', '103,000'],
            ['Less: Payments', ''],
            ['Cash Purchases', '35,000'],
            ['Payments to Creditors', '50,000'],
            ['Expenses (various)', '12,000'],
            ['Drawings (balancing figure)', 'X'],
            ['Total Payments', '97,000 + X'],
            ['Closing Cash Balance', '8,000'],
          ]}
          note="Balancing: Opening + Receipts − Payments = Closing → 5,000 + 103,000 − (97,000 + X) = 8,000 → X = 3,000. Drawings = $3,000."
        />
        <ExplainBox>
          The cash/bank summary is often the first step in reconstructing missing figures. Once you have the cash summary, you can cross‑check with other accounts to ensure consistency.
        </ExplainBox>
        <p>
          In practice, you may have separate cash and bank columns if the business uses a bank account. The same principle applies: receipts and payments are analyzed to find unknowns.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Putting It All Together">
        <p>
          The full process for completing records from incomplete information is:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Prepare opening statement of affairs to find opening capital.</li>
          <li>Prepare cash/bank summary to find cash receipts/payments and drawings.</li>
          <li>Reconstruct sales, purchases, and expenses using control accounts and mark‑up/margin.</li>
          <li>Calculate gross profit and net profit.</li>
          <li>Prepare closing statement of affairs (or derive closing capital from assets/liabilities).</li>
          <li>Reconcile profit from capital comparison with profit from income statement.</li>
          <li>Prepare final income statement and statement of financial position.</li>
        </ol>
        <ExplainBox>
          Always cross‑check: the net profit from the income statement should match the net profit from capital comparison. If they don't, there is an error in your reconstructed figures.
        </ExplainBox>
        <p>
          The ability to work with incomplete records is a key skill in accounting, especially in small businesses where full double‑entry may not be maintained.
        </p>
      </SubtopicCard>
    </div>
  );

  const financialStatementsAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Financial Statements from Incomplete Records</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Income Statement:</strong> Sales − COS = GP; GP − Expenses = NP</li>
        <li><strong>Statement of Financial Position:</strong> Assets = Liabilities + Capital</li>
        <li><strong>Cash/Bank Summary:</strong> Opening + Receipts − Payments = Closing</li>
        <li>Reconcile NP from income statement with NP from capital comparison</li>
        <li>Check that the statement of financial position balances</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'statement-of-affairs',
      title: 'Statement of Affairs',
      color: 'blue',
      content: statementOfAffairsContent,
      aside: statementOfAffairsAside,
    },
    {
      id: 'missing-figures',
      title: 'Missing Figures',
      color: 'purple',
      content: missingFiguresContent,
      aside: missingFiguresAside,
    },
    {
      id: 'financial-statements',
      title: 'Financial Statements',
      color: 'green',
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
                  <strong>Statement of Affairs:</strong> Used when double‑entry is incomplete; it lists assets and liabilities to determine capital via the accounting equation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Opening & Closing Capital:</strong> Calculated as Assets − Liabilities at the respective dates. The change in capital, adjusted for drawings and additional capital, gives net profit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Missing Figures:</strong> Sales, purchases, expenses, gross profit, net profit, and drawings can all be reconstructed using mark‑up/margin, control accounts, accruals/prepayments, or capital comparison.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Financial Statements:</strong> Once all figures are reconstructed, prepare the income statement and statement of financial position. Always reconcile profit from the income statement with profit from the capital comparison.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Cash/Bank Summary:</strong> A key tool to find missing cash flows and drawings; it links the statement of affairs and income statement.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Single Entry and Incomplete Records!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default SingleEntryAndIncompleteRecords;