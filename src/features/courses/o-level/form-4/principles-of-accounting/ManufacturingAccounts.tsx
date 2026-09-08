import React, { useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaCalculator,
  FaIndustry,
  FaBoxes,
  FaClipboardList,
} from 'react-icons/fa';

/**
 * Topic: Manufacturing Accounts – Principles of Accounts
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */
export const ManufacturingAccounts: React.FC = () => {
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

  // ---------- Section 1: Cost Classification ----------
  const costClassificationContent = (
    <div className="space-y-6">
      <SubtopicCard title="Direct Costs">
        <p>
          <strong>Definition:</strong> Direct costs are costs that can be directly traced to the production of specific goods. They are part of the prime cost.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Direct Materials:</strong> Raw materials that become part of the finished product (e.g., timber for furniture, flour for bread).
          </li>
          <li>
            <strong>Direct Labour:</strong> Wages paid to workers who physically manufacture the product (e.g., machine operators, assembly line workers).
          </li>
          <li>
            <strong>Direct Expenses:</strong> Other expenses that are directly attributable to the production process (e.g., hire of special machinery, royalties).
          </li>
        </ul>
        <ExplainBox>
          Direct costs are sometimes called 'variable costs' because they tend to vary with the level of production. If you produce more units, you need more materials and labour.
        </ExplainBox>
        <WorkedTable
          title="Examples of Direct Costs"
          columns={['Cost Type', 'Example']}
          rows={[
            ['Direct Materials', 'Steel, wood, fabric, flour, sugar'],
            ['Direct Labour', "Factory workers' wages, machine operators"],
            ['Direct Expenses', 'Royalties, special moulds, subcontractor costs'],
          ]}
        />
      </SubtopicCard>

      <SubtopicCard title="Indirect Costs (Factory Overheads)">
        <p>
          <strong>Definition:</strong> Indirect costs are costs that cannot be directly traced to a specific product. They are also called factory overheads or manufacturing overheads. These costs are incurred in the factory but are not directly part of the product.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Indirect Materials:</strong> Materials used in the factory but not part of the final product (e.g., lubricants, cleaning supplies).</li>
          <li><strong>Indirect Labour:</strong> Wages of factory staff who do not work directly on the product (e.g., supervisors, cleaners, maintenance staff).</li>
          <li><strong>Other Indirect Expenses:</strong> Factory rent, factory insurance, factory electricity, depreciation of factory equipment.</li>
        </ul>
        <ExplainBox>
          Indirect costs are often fixed or semi-variable. They need to be allocated or apportioned to products to determine the total cost of production.
        </ExplainBox>
        <WorkedTable
          title="Examples of Indirect Costs"
          columns={['Cost Type', 'Example']}
          rows={[
            ['Indirect Materials', 'Lubricants, cleaning materials, small tools'],
            ['Indirect Labour', 'Factory supervisors, quality inspectors, storekeepers'],
            ['Other Overheads', 'Rent, rates, insurance, electricity, depreciation of plant'],
          ]}
        />
      </SubtopicCard>

      <SubtopicCard title="Prime Cost">
        <p>
          <strong>Definition:</strong> Prime cost is the total of all direct costs. It is the cost that can be directly attributed to the production of goods.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Prime Cost = Direct Materials + Direct Labour + Direct Expenses
          </p>
        </div>
        <ExplainBox>
          Prime cost is the 'basic' cost of production. It excludes any indirect costs (factory overheads). It is often the starting point for calculating the total cost of production.
        </ExplainBox>
        <WorkedTable
          title="Calculating Prime Cost – Example"
          columns={['', '$']}
          rows={[
            ['Direct Materials Used', '50,000'],
            ['Direct Labour', '30,000'],
            ['Direct Expenses', '5,000'],
            ['Prime Cost', '85,000'],
          ]}
          note="Prime cost is the sum of all direct costs."
        />
      </SubtopicCard>

      <SubtopicCard title="Work in Progress (WIP)">
        <p>
          <strong>Definition:</strong> Work in progress (WIP) refers to partially completed goods that are still in the production process at the end of an accounting period. They have incurred some costs (materials, labour, overheads) but are not yet finished.
        </p>
        <p>
          In the manufacturing account, opening and closing WIP must be adjusted to determine the cost of finished goods produced.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-sm font-bold">Adjustment for WIP</p>
          <p className="font-mono">
            Cost of Production = Prime Cost + Factory Overheads + Opening WIP − Closing WIP
          </p>
        </div>
        <ExplainBox>
          Opening WIP is added because it represents costs from previous periods that are now completed. Closing WIP is subtracted because it represents costs that will be carried forward to the next period.
        </ExplainBox>
        <WorkedTable
          title="WIP Adjustment – Example"
          columns={['', '$']}
          rows={[
            ['Prime Cost', '85,000'],
            ['Factory Overheads', '25,000'],
            ['Add: Opening WIP', '8,000'],
            ['Less: Closing WIP', '(10,000)'],
            ['Cost of Production', '108,000'],
          ]}
          note="The cost of production is the total cost of goods completed during the period."
        />
      </SubtopicCard>
    </div>
  );

  const costClassificationAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Cost Classification Key Terms</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Direct Costs:</strong> Traceable to specific products</li>
        <li><strong>Indirect Costs:</strong> Not traceable; factory overheads</li>
        <li><strong>Prime Cost:</strong> Direct materials + labour + expenses</li>
        <li><strong>WIP:</strong> Partially completed goods</li>
        <li>WIP adjustment: + opening − closing</li>
      </ul>
    </div>
  );

  // ---------- Section 2: Manufacturing Account ----------
  const manufacturingAccountContent = (
    <div className="space-y-6">
      <SubtopicCard title="Preparing a Manufacturing Account">
        <p>
          The manufacturing account is used to calculate the <strong>cost of production</strong> of finished goods. It summarizes all manufacturing costs (direct and indirect) and adjusts for work in progress.
        </p>
        <p>
          The typical format is:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Start with <strong>raw materials consumed</strong> (opening stock + purchases − closing stock).</li>
          <li>Add <strong>direct labour</strong> and <strong>direct expenses</strong> to get prime cost.</li>
          <li>Add <strong>factory overheads</strong> (indirect costs).</li>
          <li>Add <strong>opening work in progress</strong> and deduct <strong>closing work in progress</strong>.</li>
          <li>The result is the <strong>cost of production</strong> (cost of goods completed).</li>
        </ol>
        <WorkedTable
          title="Manufacturing Account – Example"
          columns={['', '$', '$']}
          rows={[
            ['Raw Materials', '', ''],
            ['Opening Stock of Raw Materials', '12,000', ''],
            ['Add: Purchases of Raw Materials', '45,000', ''],
            ['Less: Closing Stock of Raw Materials', '(10,000)', ''],
            ['Raw Materials Consumed', '', '47,000'],
            ['Direct Labour', '', '30,000'],
            ['Direct Expenses', '', '5,000'],
            ['Prime Cost', '', '82,000'],
            ['Factory Overheads', '', ''],
            ['Indirect Materials', '3,000', ''],
            ['Indirect Labour', '12,000', ''],
            ['Factory Rent', '8,000', ''],
            ['Factory Insurance', '2,000', ''],
            ['Depreciation of Plant', '4,000', ''],
            ['Total Factory Overheads', '', '29,000'],
            ['Add: Opening Work in Progress', '', '6,000'],
            ['Less: Closing Work in Progress', '', '(8,000)'],
            ['Cost of Production', '', '109,000'],
          ]}
          note="The cost of production (109,000) is transferred to the trading account as the cost of goods manufactured."
        />
        <ExplainBox>
          The manufacturing account is a separate statement, usually prepared before the trading account. The cost of production is then transferred to the trading account, replacing purchases (for a manufacturing business, there are no 'purchases' of finished goods; instead, they are transferred from the manufacturing account).
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Income Statement Incorporating Manufacturing Account">
        <p>
          After preparing the manufacturing account, the cost of production is transferred to the trading account. The trading account then calculates gross profit by deducting the cost of goods sold from sales.
        </p>
        <p>
          The income statement (trading and profit or loss account) for a manufacturing business follows this structure:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Trading Account:</strong> Sales − Cost of Goods Sold = Gross Profit</li>
          <li><strong>Cost of Goods Sold:</strong> Opening Finished Goods + Cost of Production − Closing Finished Goods</li>
          <li><strong>Profit or Loss Account:</strong> Gross Profit − Operating Expenses = Net Profit</li>
        </ol>
        <WorkedTable
          title="Income Statement (extract) for a Manufacturing Business"
          columns={['', '$', '$']}
          rows={[
            ['Sales', '', '250,000'],
            ['Less: Cost of Goods Sold', '', ''],
            ['Opening Stock of Finished Goods', '15,000', ''],
            ['Add: Cost of Production (from manufacturing account)', '109,000', ''],
            ['Less: Closing Stock of Finished Goods', '(18,000)', ''],
            ['Cost of Goods Sold', '', '(106,000)'],
            ['Gross Profit', '', '144,000'],
            ['Less: Operating Expenses', '', ''],
            ['Selling & Distribution Expenses', '20,000', ''],
            ['Administrative Expenses', '30,000', '(50,000)'],
            ['Net Profit', '', '94,000'],
          ]}
          note="The cost of production from the manufacturing account is used instead of purchases."
        />
        <ExplainBox>
          Notice that the trading account now uses 'Cost of Production' instead of 'Purchases'. The finished goods stock (opening and closing) are also included. This correctly reflects the manufacturing nature of the business.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const manufacturingAccountAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Manufacturing Account</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>Raw Materials Consumed → Prime Cost</li>
        <li>Add Factory Overheads</li>
        <li>Adjust for WIP (opening +, closing −)</li>
        <li>= Cost of Production</li>
        <li>Transferred to Trading Account</li>
      </ul>
    </div>
  );

  // ---------- Section 3: Statement of Financial Position for a Manufacturing Business ----------
  const sfpContent = (
    <div className="space-y-6">
      <SubtopicCard title="Statement of Financial Position – Manufacturing Business">
        <p>
          The statement of financial position (balance sheet) for a manufacturing business differs from a trading business in that it has three types of inventory:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Raw Materials:</strong> Materials not yet used in production.</li>
          <li><strong>Work in Progress:</strong> Partially completed goods.</li>
          <li><strong>Finished Goods:</strong> Completed goods ready for sale.</li>
        </ul>
        <p>
          All three are classified as current assets. Additionally, the business will have non-current assets like plant and equipment, and liabilities such as payables, loans, etc.
        </p>
        <WorkedTable
          title="Statement of Financial Position (extract) – Example"
          columns={['', '$', '$']}
          rows={[
            ['Non-current Assets', '', ''],
            ['Plant and Equipment (net)', '', '180,000'],
            ['', '', ''],
            ['Current Assets', '', ''],
            ['Inventory: Raw Materials', '10,000', ''],
            ['Inventory: Work in Progress', '8,000', ''],
            ['Inventory: Finished Goods', '18,000', ''],
            ['Trade Receivables', '25,000', ''],
            ['Cash', '12,000', '73,000'],
            ['Total Assets', '', '253,000'],
            ['', '', ''],
            ['Capital and Liabilities', '', ''],
            ['Capital', '', ''],
            ['Opening Capital', '150,000', ''],
            ['Add: Net Profit', '94,000', ''],
            ['Less: Drawings', '(20,000)', '224,000'],
            ['Non-current Liabilities', '', ''],
            ['Bank Loan', '', '20,000'],
            ['Current Liabilities', '', ''],
            ['Trade Payables', '9,000', ''],
            ['Total Capital and Liabilities', '', '253,000'],
          ]}
          note="The three inventory categories are shown separately. The net profit is taken from the income statement."
        />
        <ExplainBox>
          The key difference from a trading business is the presence of raw materials and work in progress as separate inventory items. This reflects the manufacturing process.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Interpreting the Statement of Financial Position">
        <p>
          Analyzing the statement helps assess the business's financial health. Key points:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Liquidity:</strong> The current ratio (current assets / current liabilities) can be calculated. The presence of three inventory types may affect liquidity, as work in progress may be less liquid than finished goods.</li>
          <li><strong>Asset Structure:</strong> A manufacturing business often has significant non-current assets (plant, machinery) relative to a trading business.</li>
          <li><strong>Working Capital:</strong> The three inventory categories represent a large portion of current assets; efficient management of raw materials, WIP, and finished goods is crucial.</li>
        </ul>
        <WorkedTable
          title="Liquidity Ratio Example"
          columns={['', '$']}
          rows={[
            ['Current Assets (from above)', '73,000'],
            ['Current Liabilities', '9,000'],
            ['Current Ratio', '73,000 / 9,000 = 8.1 : 1'],
            ['Quick Assets (excluding inventory)', '73,000 − (10,000+8,000+18,000) = 37,000'],
            ['Quick Ratio', '37,000 / 9,000 = 4.1 : 1'],
          ]}
          note="The ratios are high, indicating strong liquidity, but this may be typical for a manufacturing business with large inventory holdings."
        />
        <ExplainBox>
          While high liquidity is generally positive, too much inventory could indicate inefficiency. Comparing these ratios with industry averages and past periods gives a better picture.
        </ExplainBox>
      </SubtopicCard>
    </div>
  );

  const sfpAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">SFP for Manufacturing</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>Three inventory categories: raw materials, WIP, finished goods</li>
        <li>All are current assets</li>
        <li>Non-current assets include plant & equipment</li>
        <li>Capital = opening capital + profit − drawings</li>
        <li>Check: Assets = Liabilities + Capital</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'cost-classification',
      title: 'Cost Classification',
      color: 'blue',
      content: costClassificationContent,
      aside: costClassificationAside,
    },
    {
      id: 'manufacturing-account',
      title: 'Manufacturing Account',
      color: 'purple',
      content: manufacturingAccountContent,
      aside: manufacturingAccountAside,
    },
    {
      id: 'financial-statements',
      title: 'Financial Statements',
      color: 'green',
      content: sfpContent,
      aside: sfpAside,
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
                  <strong>Cost Classification:</strong> Direct costs (materials, labour, expenses) form prime cost. Indirect costs are factory overheads. Work in progress must be adjusted.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Manufacturing Account:</strong> Calculates the cost of production by summing prime cost, factory overheads, and adjusting for WIP. This cost is transferred to the trading account.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Income Statement:</strong> Uses cost of production instead of purchases. Gross profit is sales minus cost of goods sold (opening finished goods + production − closing finished goods).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Statement of Financial Position:</strong> Shows three inventory categories (raw materials, WIP, finished goods). The accounting equation (Assets = Liabilities + Capital) must balance.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Manufacturing Accounts!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default ManufacturingAccounts;