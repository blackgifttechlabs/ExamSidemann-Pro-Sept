import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaPlay,
  FaPause,
  FaRedo,
} from 'react-icons/fa';

/**
 * Topic: Trial Balance and Errors – Principles of Accounts (Form 4)
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, interactive stroke-by-stroke faint-ruled accounting paper,
 * and auto-scroll + double-highlight on the heading when jumping to a section.
 */
export const TrialBalanceAndErrors: React.FC = () => {
  // ---------- CSS keyframes for double highlight & animated handwriting ----------
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

    /* Faint-ruled ledger paper background */
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

    /* Human pen stroke animations */
    .ink-stroke {
      fill: none;
      stroke: #1a237e; /* Royal Blue Fountain Pen Ink */
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

  // Comparison table: which errors break the trial balance vs which hide from it
  const ErrorTypesTable: React.FC = () => {
    interface Row {
      type: string;
      example: string;
      effect: string;
    }

    const affectingRows: Row[] = [
      { type: '(i) Wrong Casting', example: 'Purchases book total overstated by $1,000', effect: 'Debit side $1,000 too high' },
      { type: '(ii) Posting to the Wrong Side', example: '$2,000 purchase posted to debit instead of credit', effect: 'Difference of $4,000' },
      { type: '(iii) Posting the Wrong Amount', example: '$600 posted as $60', effect: 'Credit side short by $540' },
      { type: '(iv) One-Sided Posting', example: '$500 received posted only in the cash book', effect: 'Credit side short by $500' },
      { type: '(v) Double Posting', example: '$500 posted twice to a supplier’s credit side', effect: 'Credit side $500 too high' },
      { type: '(vi) Totalling/Balancing Errors', example: 'A ledger account wrongly totalled or balanced', effect: 'Produces an incorrect balance' },
    ];

    const notAffectingRows: Row[] = [
      { type: '(i) Errors of Omission', example: 'A sale of $2,000 left out of the books completely', effect: 'No debit or credit recorded at all' },
      { type: '(ii) Errors of Original Entry', example: '$240 posted instead of $420, same wrong figure both sides', effect: 'Both sides equal — but both wrong' },
      { type: '(iii) Compensating Errors', example: '$500 posted as $50 in one account, $50 posted as $500 in another', effect: 'The two mistakes cancel each other out' },
      { type: '(iv) Errors of Principle', example: 'Furniture purchase debited to Purchases A/c instead of Furniture A/c', effect: 'Correct amount, wrong class of account' },
      { type: '(v) Errors of Commission', example: 'Sale to one customer wrongly debited to another customer’s account', effect: 'Both sides correct amount, wrong person' },
    ];

    return (
      <div
        className="my-4 overflow-hidden rounded-none bg-white"
        style={{ border: '2px solid #E5E7EB' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr style={{ backgroundColor: '#FFC800' }}>
                <th className="w-[22%] px-4 py-3 font-extrabold text-[#4A3500] border-r-2 border-white/40">
                  Type of Error
                </th>
                <th className="w-[35%] px-4 py-3 font-extrabold text-[#4A3500] border-r-2 border-white/40">
                  Example
                </th>
                <th className="w-[28%] px-4 py-3 font-extrabold text-[#4A3500] border-r-2 border-white/40">
                  Effect on the Trial Balance
                </th>
                <th className="w-[15%] px-4 py-3 text-center font-extrabold text-[#4A3500]">
                  Caught by the Trial Balance?
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Section: AFFECTING */}
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-3 text-center text-base font-extrabold uppercase tracking-wide text-white"
                  style={{ backgroundColor: '#58CC02' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaExclamationCircle className="text-lg" />
                    Errors That AFFECT the Trial Balance
                  </span>
                </td>
              </tr>
              {affectingRows.map((row, i) => (
                <tr
                  key={row.type}
                  className="border-t-2"
                  style={{ borderColor: '#F0FFE1', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F7FDF0' }}
                >
                  <td className="px-4 py-3 font-bold text-slate-800 align-top">{row.type}</td>
                  <td className="px-4 py-3 text-slate-600 align-top">{row.example}</td>
                  <td className="px-4 py-3 text-slate-600 align-top">{row.effect}</td>
                  {i === 0 && (
                    <td
                      rowSpan={affectingRows.length}
                      className="etb-detect-cell px-3 py-3 text-center align-middle"
                      style={{ backgroundColor: '#F0FFE1', borderLeft: '3px solid #58CC02' }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span
                          className="etb-detect-label text-xs font-extrabold uppercase tracking-wide"
                          style={{ color: '#3F7D00' }}
                        >
                          Balance won&apos;t tally
                        </span>
                        <FaCheckCircle className="text-2xl" style={{ color: '#3F7D00' }} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {/* Section: NOT AFFECTING */}
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-3 text-center text-base font-extrabold uppercase tracking-wide text-white"
                  style={{ backgroundColor: '#FF9600' }}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaEyeSlash className="text-lg" />
                    Errors That Do NOT Affect the Trial Balance
                  </span>
                </td>
              </tr>
              {notAffectingRows.map((row, i) => (
                <tr
                  key={row.type}
                  className="border-t-2"
                  style={{ borderColor: '#FFF3E0', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FFFAF2' }}
                >
                  <td className="px-4 py-3 font-bold text-slate-800 align-top">{row.type}</td>
                  <td className="px-4 py-3 text-slate-600 align-top">{row.example}</td>
                  <td className="px-4 py-3 text-slate-600 align-top">{row.effect}</td>
                  {i === 0 && (
                    <td
                      rowSpan={notAffectingRows.length}
                      className="etb-detect-cell px-3 py-3 text-center align-middle"
                      style={{ backgroundColor: '#FFF3E0', borderLeft: '3px solid #FF9600' }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span
                          className="etb-detect-label text-xs font-extrabold uppercase tracking-wide"
                          style={{ color: '#B35F00' }}
                        >
                          Balance still tallies
                        </span>
                        <FaBan className="text-2xl" style={{ color: '#B35F00' }} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="px-4 py-4 text-center text-base font-extrabold text-white"
          style={{ backgroundColor: '#1e1b4b' }}
        >
          <span className="inline-flex items-center gap-2">
            A trial balance that tallies is not proof the books are correct!
            <FaBan className="text-lg" />
            <FaCheckCircle className="text-lg" />
          </span>
        </div>
      </div>
    );
  };

  const ledgerGlyphAdvance = (character: string, size: number) => {
    if (/\s/.test(character)) return size * 0.32;
    if (/[1ilI.,'()]/.test(character)) return size * 0.38;
    if (/[mwMW]/.test(character)) return size * 0.88;
    if (/[A-Z]/.test(character)) return size * 0.68;
    return size * 0.58;
  };

  // Handwriting reveal: every label and number is drawn one glyph at a time.
  const HandText: React.FC<{
    value: string;
    x: number;
    y: number;
    size?: number;
    bold?: boolean;
    color?: string;
    delayMs?: number;
    anchor?: 'start' | 'middle' | 'end';
  }> = ({ value, x, y, size = 22, bold = false, color = '#1a237e', delayMs = 0, anchor = 'start' }) => {
    const characters = Array.from(value);
    const totalWidth = characters.reduce((sum, character) => sum + ledgerGlyphAdvance(character, size), 0);
    const startX = anchor === 'middle' ? x - totalWidth / 2 : anchor === 'end' ? x - totalWidth : x;
    let cursor = 0;

    return (
      <g aria-label={value}>
        {characters.map((character, index) => {
          const currentX = startX + cursor;
          cursor += ledgerGlyphAdvance(character, size);

          if (/\s/.test(character)) {
            return null;
          }

          return (
            <text
              key={`${character}-${index}`}
              x={currentX}
              y={y}
              fontFamily="'Caveat', 'Segoe Print', cursive, sans-serif"
              fontSize={size}
              fontWeight={bold ? 'bold' : 'normal'}
              fill={color}
              stroke={color}
              strokeWidth={bold ? 0.62 : 0.48}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="140"
              strokeDashoffset="140"
              style={{
                fillOpacity: 0,
                animation: `ledgerWriteGlyph 0.28s ease-out ${delayMs + index * 34}ms forwards`,
              }}
            >
              {character}
            </text>
          );
        })}
      </g>
    );
  };

  const HandDigits: React.FC<{
    value: string;
    x: number;
    y: number;
    size?: number;
    bold?: boolean;
    color?: string;
    delayMs?: number;
    anchor?: 'start' | 'middle' | 'end';
  }> = (props) => <HandText size={22} color="#1a237e" {...props} />;

  const LedgerGuideLines: React.FC = () => {
    const horizontalRules = Array.from({ length: 12 }, (_, i) => 48 + i * 34);

    return (
      <g>
        {horizontalRules.map((y, i) => (
          <line
            key={`rule-${y}`}
            x1="18"
            y1={y}
            x2="842"
            y2={y}
            className="ledger-guide-line ledger-guide-line--blue"
            style={{ animationDelay: `${i * 42}ms` }}
          />
        ))}
        <line x1="86" y1="8" x2="86" y2="420" className="ledger-guide-line ledger-guide-line--red" style={{ animationDelay: '220ms' }} />
        <line x1="90" y1="8" x2="90" y2="420" className="ledger-guide-line ledger-guide-line--red" style={{ animationDelay: '290ms', opacity: 0.55 }} />
        <line x1="620" y1="52" x2="620" y2="420" className="ledger-guide-line ledger-guide-line--column" style={{ animationDelay: '520ms' }} />
        <line x1="730" y1="52" x2="730" y2="420" className="ledger-guide-line ledger-guide-line--column" style={{ animationDelay: '620ms' }} />
      </g>
    );
  };

    // Interactive animated paper with faint rules & human handwriting strokes
  const AnimatedPaperLedger: React.FC = () => {
    const totalSteps = 9; // 0 guide lines, then heading/columns and one accounting row per step
    const [step, setStep] = useState<number>(totalSteps);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(3000); // ms per step
    const [guideRun, setGuideRun] = useState<number>(0);
    const labelThenGrossDelay = 1200;
    const labelThenNetDelay = 1550;

    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (isPlaying) {
        if (step < totalSteps) {
          timer = setTimeout(() => {
            setStep((prev) => prev + 1);
          }, speed);
        } else {
          setIsPlaying(false);
        }
      }
      return () => clearTimeout(timer);
    }, [isPlaying, step, speed, totalSteps]);

    const handlePlayPause = () => {
      if (step >= totalSteps) {
        setStep(0);
        setGuideRun((run) => run + 1);
        setIsPlaying(true);
      } else {
        if (!isPlaying && step === 0) {
          setGuideRun((run) => run + 1);
        }
        setIsPlaying(!isPlaying);
      }
    };

    const timelinePercent = (step / totalSteps) * 100;
    const penPositions = [
      { x: 842, y: 48 },
      { x: 530, y: 38 },
      { x: 830, y: 82 },
      { x: 786, y: 108 },
      { x: 786, y: 144 },
      { x: 786, y: 180 },
      { x: 720, y: 232 },
      { x: 786, y: 256 },
      { x: 786, y: 292 },
      { x: 834, y: 344 },
    ];
    const penPosition = penPositions[Math.min(step, penPositions.length - 1)];
    const isFinishedReview = !isPlaying && step >= totalSteps;

    return (
      <div className="my-4 -mx-4 overflow-hidden border-y border-slate-200 bg-white px-2 py-3 shadow-sm sm:mx-0 sm:rounded-xl sm:border sm:p-4">
        {/* Paper Header / Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-blue-800">
              ✍️ Handwritten Accounting Sheet
            </span>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              Live Stroke-by-Stroke Statement of Corrected Profit
            </h4>
          </div>

        </div>

        {/* Faint-Ruled Notebook Paper Canvas */}
        <div className="ledger-paper mt-3 overflow-hidden rounded-lg border border-slate-300/80 p-1 shadow-inner sm:p-2">
          <svg
            viewBox="0 0 860 430"
            className={`h-auto w-full select-none ${isFinishedReview ? 'ledger-finished' : ''}`}
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.04))' }}
          >
            {/* Faints Background */}
            <rect x="0" y="0" width="860" height="430" fill="#faf9f5" />
            <LedgerGuideLines key={`guides-${guideRun}`} />

            {/* Column Headers (Handwritten style) */}
            {step >= 1 && (
              <g opacity="0.95">
                <HandText key="heading" value="Statement of Corrected Profit for the year ended 31 December" x={106} y={30} size={20} bold color="#0f172a" />
                <path className="ink-stroke" d="M 104,38 C 230,36 392,37 530,36" />
              </g>
            )}
            {step >= 2 && (
              <g opacity="0.95">
                <HandText key="gross-head-1" value="Gross Profit" x={674} y={56} size={15} bold color="#1e3a8a" anchor="middle" delayMs={160} />
                <HandText key="gross-head-2" value="($)" x={674} y={74} size={15} bold color="#1e3a8a" anchor="middle" delayMs={560} />
                <HandText key="net-head-1" value="Net Profit" x={786} y={56} size={15} bold color="#1e3a8a" anchor="middle" delayMs={820} />
                <HandText key="net-head-2" value="($)" x={786} y={74} size={15} bold color="#1e3a8a" anchor="middle" delayMs={1160} />
                <line x1="100" y1="84" x2="842" y2="84" stroke="#1e3a8a" strokeWidth="1.4" />
              </g>
            )}

            {/* ----------------- STEP 0: Draft Profit ----------------- */}
            {step >= 3 && (
            <g>
              <HandText key="s1-label" value="Draft profit as per draft accounts" x={106} y={106} size={21} color="#1e293b" />
              {/* 48 000 */}
              <HandDigits key="s1-gross" value="48 000" x={674} y={108} anchor="middle" delayMs={labelThenGrossDelay} />
              {/* 18 420 */}
              <HandDigits key="s1-net" value="18 420" x={786} y={108} anchor="middle" delayMs={labelThenNetDelay} />
            </g>
            )}

            {/* ----------------- STEP 1: Add Closing Stock ----------------- */}
            {step >= 4 && (
              <g>
                <HandText key="s2-label" value="Add: Closing stock undervalued" x={106} y={142} size={21} color="#1e293b" />
                {/* 1 200 (Gross) */}
                <HandDigits key="s2-g" value="1 200" x={674} y={144} anchor="middle" delayMs={labelThenGrossDelay} />
                {/* 1 200 (Net) */}
                <HandDigits key="s2-n" value="1 200" x={786} y={144} anchor="middle" delayMs={labelThenNetDelay} />
              </g>
            )}

            {/* ----------------- STEP 2: Add Sales Understated ----------------- */}
            {step >= 5 && (
              <g>
                <HandText key="s3-label" value="Add: Sales understated ($800 recorded as $80)" x={106} y={178} size={21} color="#1e293b" />
                {/* 720 (Gross) */}
                <HandDigits key="s3-g" value="720" x={674} y={180} anchor="middle" delayMs={labelThenGrossDelay + 260} />
                {/* 720 (Net) */}
                <HandDigits key="s3-n" value="720" x={786} y={180} anchor="middle" delayMs={labelThenNetDelay + 260} />
              </g>
            )}

            {/* ----------------- STEP 3: Strike Corrected Gross Profit ----------------- */}
            {step >= 6 && (
              <g>
                {/* Rule under Gross figures */}
                <line x1="628" y1="192" x2="720" y2="192" className="ink-rule" />
                <HandText key="s4-label" value="Corrected Gross Profit" x={106} y={216} size={22} bold color="#047857" delayMs={220} />
                {/* 49 920 */}
                <HandDigits key="s4-gp" value="49 920" x={674} y={218} bold anchor="middle" delayMs={labelThenGrossDelay} />
                {/* Double Rule closing the Gross Profit column */}
                <line x1="628" y1="228" x2="720" y2="228" className="ink-rule" />
                <line x1="628" y1="232" x2="720" y2="232" className="ink-double-rule" />
              </g>
            )}

            {/* ----------------- STEP 4: Add Insurance Prepaid ----------------- */}
            {step >= 7 && (
              <g>
                <HandText key="s5-label" value="Add: Insurance prepaid (not adjusted in draft)" x={106} y={254} size={21} color="#1e293b" />
                <HandText key="s5-dash" value="-" x={674} y={254} size={21} color="#94a3b8" anchor="middle" delayMs={labelThenGrossDelay} />
                {/* 600 (Net only) */}
                <HandDigits key="s5-ins" value="600" x={786} y={256} anchor="middle" delayMs={labelThenNetDelay} />
              </g>
            )}

            {/* ----------------- STEP 5: Less Depreciation ----------------- */}
            {step >= 8 && (
              <g>
                <HandText key="s6-label" value="Less: Depreciation on equipment omitted" x={106} y={290} size={21} color="#b91c1c" />
                <HandText key="s6-dash" value="-" x={674} y={290} size={21} color="#94a3b8" anchor="middle" delayMs={labelThenGrossDelay} />
                {/* (1 400) bracketed in Net */}
                <HandDigits key="s6-dep" value="(1 400)" x={786} y={292} color="#b91c1c" anchor="middle" delayMs={labelThenNetDelay} />
              </g>
            )}

            {/* ----------------- STEP 6: Final Corrected Net Profit ----------------- */}
            {step >= 9 && (
              <g>
                {/* Rule line over final total */}
                <line x1="740" y1="304" x2="834" y2="304" className="ink-rule" />
                <HandText key="s7-label" value="Corrected Net Profit for the year" x={106} y={328} size={22} bold color="#1e3a8a" delayMs={180} />
                {/* 17 620 in Net Column */}
                <HandDigits key="s7-net" value="17 620" x={786} y={330} bold anchor="middle" delayMs={labelThenNetDelay} />
                {/* Double Rule closing the Net Profit column */}
                <line x1="740" y1="340" x2="834" y2="340" className="ink-rule" />
                <line x1="740" y1="344" x2="834" y2="344" className="ink-double-rule" />
              </g>
            )}

            {/* Accounting Pen Nib Indicator */}
            {isPlaying && (
              <g className="pen-nib" transform={`translate(${penPosition.x}, ${penPosition.y})`}>
                <polygon points="0,0 -8,-24 8,-24" fill="#1e3a8a" />
                <line x1="0" y1="0" x2="0" y2="-18" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
              </g>
            )}
          </svg>
        </div>

        {/* Scrubbable Player Timeline */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1CB0F6] text-white shadow hover:bg-[#0da0e4] active:translate-y-0.5 transition-all"
            title={isPlaying ? 'Pause handwriting' : step >= totalSteps ? 'Replay handwriting' : 'Play handwriting'}
            aria-label={isPlaying ? 'Pause handwriting' : step >= totalSteps ? 'Replay handwriting' : 'Play handwriting'}
          >
            {isPlaying ? <FaPause className="text-xs" /> : step >= totalSteps ? <FaRedo className="text-xs" /> : <FaPlay className="text-xs" />}
          </button>
          <input
            type="range"
            min={0}
            max={totalSteps}
            step={1}
            value={step}
            onChange={(event) => {
              const nextStep = Number(event.target.value);
              setIsPlaying(false);
              if (nextStep === 0) {
                setGuideRun((run) => run + 1);
              }
              setStep(nextStep);
            }}
            aria-label="Handwriting player timeline"
            className="ledger-timeline block w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1CB0F6 0%, #1CB0F6 ${timelinePercent}%, #374151 ${timelinePercent}%, #374151 100%)`,
            }}
          />
          <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-500">{step} / {totalSteps}</span>
        </div>

        {/* Speed Controls & Note */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Handwriting speed:</span>
            {[
              { label: 'Normal (1x)', val: 3000 },
              { label: 'Fast (1.5x)', val: 2200 },
              { label: 'Turbo (2x)', val: 1600 },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => setSpeed(s.val)}
                className={`rounded px-2 py-0.5 font-bold transition-colors ${
                  speed === s.val ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const sections: TopicSection[] = [
    {
      id: 'effect-on-profit',
      title: 'Effect of Errors on Profit',
      color: 'green',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Errors That Affect the Trial Balance vs Errors That Don't">
            <p>
              A trial balance is just a list of all the account balances, added up to
              check that total debits equal total credits. If the two totals don't
              match, you know a mistake was made. But here is the tricky part: some
              mistakes still leave the totals equal, even though the accounts are wrong.
            </p>

            <ExplainBox>
              A trial balance only checks arithmetic. It cannot tell you if a figure
              was posted to the wrong account, as long as a debit was still matched by
              an equal credit. It is like checking that a shopping receipt adds up
              correctly — it does not check that you bought the right items.
            </ExplainBox>

            <p>
              Here is the full picture, side by side — which errors break the trial
              balance, and which ones slip through it unnoticed.
            </p>

            <ErrorTypesTable />

            <ExplainBox label="Why this matters">
              A trial balance agreeing does not prove the books are correct — it only
              proves that, for every debit posted, an equal credit was posted
              somewhere. That is why accountants still have to check for these
              &quot;hidden&quot; errors even when the trial balance balances.
            </ExplainBox>
          </SubtopicCard>

          <SubtopicCard title="How Errors Overstate or Understate Profit">
            <p>
              To work out what an error does to profit, always ask two questions:
              first, <strong>which account was affected</strong> — is it a trading
              account item (sales, purchases, returns, closing stock) that changes
              gross profit, or an expense/income item that changes net profit?
              Second, <strong>was the figure too high or too low</strong>?
            </p>

            <ExplainBox>
              <strong>Overstated</strong> means the figure was recorded too high — the
              profit looks better than it really is. <strong>Understated</strong>{' '}
              means the figure was recorded too low — the profit looks worse than it
              really is. Always work out the effect on profit, not just the effect on
              the single account.
            </ExplainBox>

            <h4 className="text-2xl font-semibold text-[#1CB0F6] mt-4">Effect on Gross Profit</h4>
            <p>Gross profit comes from the trading account, so only these items change it: sales, purchases, returns inwards, returns outwards, carriage inwards, and closing stock (opening stock too, but it is less commonly tested).</p>
            <WorkedTable
              title="How common errors change gross profit"
              columns={['Error', 'Effect on gross profit']}
              rows={[
                ['Sales understated (recorded too low)', 'Gross profit understated'],
                ['Sales overstated (recorded too high)', 'Gross profit overstated'],
                ['Purchases understated', 'Gross profit overstated'],
                ['Purchases overstated', 'Gross profit understated'],
                ['Closing stock undervalued', 'Gross profit understated'],
                ['Closing stock overvalued', 'Gross profit overstated'],
                ['Carriage inwards omitted', 'Gross profit overstated'],
                ['Returns inwards omitted', 'Gross profit overstated'],
              ]}
              note="Rule of thumb: anything that makes purchases or costs look smaller, or sales/closing stock look bigger, pushes gross profit up — and the other way round."
            />

            <h4 className="text-2xl font-semibold text-[#1CB0F6] mt-4">Effect on Net Profit</h4>
            <p>
              Net profit is gross profit minus all other running expenses, plus any
              other income. So net profit is affected in two ways: anything that
              changes gross profit automatically changes net profit too, and on top
              of that, any expense or income account that was recorded wrongly will
              also change net profit directly.
            </p>
            <WorkedTable
              title="How common errors change net profit"
              columns={['Error', 'Effect on net profit']}
              rows={[
                ['Rent expense understated', 'Net profit overstated'],
                ['Rent expense overstated', 'Net profit understated'],
                ['Commission income omitted', 'Net profit understated'],
                ['Depreciation not charged', 'Net profit overstated'],
                ['Wages recorded twice', 'Net profit understated'],
                ['Discount received omitted', 'Net profit understated'],
              ]}
            />
          </SubtopicCard>

          <SubtopicCard title="Which Errors Affect Profit, and Which Don't">
            <p>
              Not every error changes profit. Some errors only move figures between
              balance sheet items, and never touch the trading account or the
              expense/income accounts — so profit stays exactly the same.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[9px] border border-emerald-100 bg-emerald-50/60 p-4">
                <h5 className="font-bold text-emerald-700 mb-2">Affects profit</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Wrong figure for sales, purchases, returns, or closing stock</li>
                  <li>An expense or income account posted with the wrong amount</li>
                  <li>An expense/income transaction left out completely</li>
                  <li>An item wrongly classified between a trading item and an expense (error of principle)</li>
                </ul>
              </div>
              <div className="rounded-[9px] border border-amber-100 bg-amber-50/60 p-4">
                <h5 className="font-bold text-amber-700 mb-2">Does NOT affect profit</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>An error between two debtor (customer) accounts — error of commission among debtors</li>
                  <li>An error between two creditor (supplier) accounts</li>
                  <li>A fixed asset posted to the wrong fixed asset account (e.g. equipment instead of fixtures)</li>
                  <li>A bank error posted to the wrong bank/cash account</li>
                </ul>
              </div>
            </div>

            <ExplainBox label="Quick test">
              Ask: &quot;Does this account appear inside the trading account or the profit
              or loss account?&quot; If yes, profit changes. If the account only ever
              appears on the statement of financial position (assets, liabilities,
              capital), profit is not affected — only the balance sheet is affected.
            </ExplainBox>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Trial balance:</strong> list of balances checking debits = credits</li>
            <li><strong>Overstated:</strong> recorded too high</li>
            <li><strong>Understated:</strong> recorded too low</li>
            <li><strong>Error of omission:</strong> transaction left out entirely</li>
            <li><strong>Error of commission:</strong> right type of account, wrong person</li>
            <li><strong>Error of principle:</strong> wrong class of account</li>
            <li><strong>Compensating errors:</strong> two errors that cancel out</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'adjustments',
      title: 'Adjustments on Gross and Net Profit',
      color: 'blue',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Correcting Entries After the Draft Accounts Are Prepared">
            <p>
              Sometimes a business prepares its &quot;draft&quot; (first-attempt) final accounts,
              and only afterwards finds out that some errors were made. Rather than
              redoing the whole set of accounts from the beginning, accountants make{' '}
              <strong>correcting adjustments</strong> — small additions or subtractions
              that turn the wrong (draft) profit into the correct profit.
            </p>

            <ExplainBox>
              Think of the draft profit as a rough first answer. Each error you find
              is like a small correction slip: some slips add money back, some slips
              take money away. Once you have applied every slip, you land on the true,
              correct profit.
            </ExplainBox>

            <h4 className="text-2xl font-semibold text-[#1CB0F6] mt-4">The three steps</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Read the error carefully and decide which account(s) it affects.</li>
              <li>
                Decide whether the account is a <strong>trading account item</strong>{' '}
                (changes gross profit) or an <strong>expense/income item</strong>{' '}
                (changes net profit only).
              </li>
              <li>
                Work out whether the correction should be <strong>added to</strong>{' '}
                profit (because profit was too low) or <strong>subtracted from</strong>{' '}
                profit (because profit was too high).
              </li>
            </ol>
          </SubtopicCard>

          <SubtopicCard title="Adjusting Gross Profit — Trading Account Items">
            <p>
              Only four things live inside the trading account: sales, purchases,
              returns, and closing stock (carriage inwards too, since it is added to
              purchases). If an error touches any of these, gross profit must be
              corrected.
            </p>

            <WorkedTable
              title="Worked example: correcting gross profit"
              columns={['Item', '$']}
              rows={[
                ['Draft gross profit', '48 000'],
                ['Add: Closing stock undervalued by $1 200', '1 200'],
                ['Less: Sales invoice of $800 recorded as $80 (understated by $720)', '(reverse — see note)'],
                ['Corrected gross profit', '49 920'],
              ]}
              note="Note: an understated sale of $720 is ADDED, not subtracted, because it means real sales were higher than recorded. Always ask 'was the true figure higher or lower than what was recorded?' before deciding + or −."
            />

            <ExplainBox label="Common trap">
              Students often add or subtract the wrong way round. The safe method:
              write down the correct figure and the recorded (wrong) figure side by
              side, then find the difference and its direction — don't guess from memory.
            </ExplainBox>
          </SubtopicCard>

          <SubtopicCard title="Adjusting Net Profit — Expense and Income Items">
            <p>
              Once gross profit is corrected, move on to the expense and income
              accounts (rent, wages, commission received, discounts, depreciation,
              and so on). Any error here affects net profit only — it does not touch
              gross profit at all.
            </p>

            <WorkedTable
              title="Worked example: correcting net profit"
              columns={['Item', '$']}
              rows={[
                ['Corrected gross profit (brought down)', '49 920'],
                ['Less: Total expenses (as drafted)', '(31 500)'],
                ['Draft net profit', '18 420'],
                ['Add: Insurance prepaid, wrongly treated as an expense in full', '600'],
                ['Less: Depreciation on equipment omitted', '(1 400)'],
                ['Corrected net profit', '17 620'],
              ]}
            />

            <ExplainBox>
              A prepaid expense is money already paid for a period that has not
              happened yet — so it should not reduce this year's profit fully. That
              is why it is added back. Depreciation that was left out reduces profit
              because it is a real cost of using the asset, so it must be subtracted.
            </ExplainBox>
          </SubtopicCard>

          <SubtopicCard title="Statement Showing Corrected Gross Profit and Net Profit">
            <p>
              Examiners usually want the corrections shown in one clear statement, so
              the marker can see the draft figure, every adjustment, and the final
              corrected figure — a simple before-and-after comparison. Watch below
              as each line is handwritten into the exam book step by step:
            </p>

            {/* Interactive animated paper with faint rules & ink stroke handwriting */}
            <AnimatedPaperLedger />

            <WorkedTable
              title="Reference Table: Statement of Corrected Profit"
              columns={['', 'Gross profit $', 'Net profit $']}
              rows={[
                ['Draft profit as per draft accounts', '48 000', '18 420'],
                ['Add: closing stock undervalued', '1 200', '1 200'],
                ['Add: sales understated', '720', '720'],
                ['Add: insurance prepaid not adjusted', '—', '600'],
                ['Less: depreciation omitted', '—', '(1 400)'],
                ['Corrected profit', '49 920', '17 620'],
              ]}
              note="Notice a change to gross profit always flows through to net profit as well, which is why the gross-profit adjustments repeat in the net-profit column."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Remember</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Trading account items → gross profit</li>
            <li>Expense/income items → net profit only</li>
            <li>A change in gross profit always carries into net profit</li>
            <li>Always compare correct figure vs recorded figure to find + or −</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'revised-profit-statement',
      title: 'Revised Statement of Profit',
      color: 'purple',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Recalculating the Income Statement">
            <p>
              After every error has been corrected, the business prepares a full,
              clean income statement (trading and profit or loss account) again —
              this time with the right figures built in from the start, instead of
              being shown as a list of add/less adjustments.
            </p>

            <ExplainBox>
              There are two acceptable ways to present corrected profit: the
              reconciliation style you saw above (draft profit, then adjustments), or
              a full, freshly redrawn trading and profit or loss account. Examiners
              often ask for both — the reconciliation to show your workings, and the
              full account to show the final, correct picture.
            </ExplainBox>

            <h4 className="text-2xl font-semibold text-[#1CB0F6] mt-4">Reconciliation format</h4>
            <p>This is the quickest way to show how the draft profit becomes the corrected profit, step by step.</p>
            <WorkedTable
              title="Draft profit → Adjustments → Corrected profit"
              columns={['', '$', '$']}
              rows={[
                ['Draft net profit', '', '18 420'],
                ['Add:', '', ''],
                ['Closing stock undervalued', '1 200', ''],
                ['Sales understated', '720', ''],
                ['Insurance prepaid', '600', '2 520'],
                ['', '', '20 940'],
                ['Less:', '', ''],
                ['Depreciation omitted', '1 400', '(1 400)'],
                ['Corrected net profit', '', '17 620'],
              ]}
            />
          </SubtopicCard>

          <SubtopicCard title="The Revised Trading and Profit or Loss Account">
            <p>
              This is the full, final account — built with the corrected figures
              already inside it, as if the errors had never happened.
            </p>
            <WorkedTable
              title="Trading and Profit or Loss Account for the year ended 31 December (extract)"
              columns={['', '$', '$']}
              rows={[
                ['Sales (corrected)', '', '150 720'],
                ['Less: Cost of sales', '', ''],
                ['Opening stock', '20 000', ''],
                ['Add: Purchases', '90 000', ''],
                ['', '110 000', ''],
                ['Less: Closing stock (corrected)', '(21 200)', '(88 800)'],
                ['Gross profit', '', '49 920'],
                ['Less: Expenses (corrected)', '', ''],
                ['Rent, wages and other expenses', '30 500', ''],
                ['Depreciation', '1 400', '(31 900)'],
                ['Net profit', '', '17 620'],
              ]}
              note="Both routes must reach the same corrected net profit — $17 620 in this example. If they don't match, an adjustment was applied to the wrong side or the wrong account."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Check Yourself</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Reconciliation and full account must give the same final profit</li>
            <li>Closing stock appears in both the trading account and as a current asset</li>
            <li>Keep workings clear — markers give credit for method, not just the final number</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'revised-sfp',
      title: 'Revised Statement of Financial Position (Extracts)',
      color: 'orange',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Which Balance Sheet Items Are Affected">
            <p>
              Some errors also change the statement of financial position (what used
              to be called the balance sheet), not just profit. Before you can adjust
              it, list every account the error touched and ask whether that account
              is an asset, a liability, or part of capital.
            </p>

            <WorkedTable
              title="Tracing errors through to the statement of financial position"
              columns={['Error', 'Statement of financial position effect']}
              rows={[
                ['Closing stock undervalued by $1 200', 'Inventory (current asset) understated by $1 200'],
                ['Insurance prepaid $600 not recorded', 'Prepayments (current asset) understated by $600'],
                ['Depreciation on equipment omitted, $1 400', 'Equipment (non-current asset) overstated by $1 400'],
                ['Sales invoice understated by $720', 'Trade receivables (debtors) understated by $720'],
              ]}
            />

            <ExplainBox>
              Every correction to profit that involves an asset or a liability must
              also change that same asset or liability on the statement of financial
              position — the two statements are always linked. For example, if
              closing stock was too low on the income statement, it was also too low
              as a current asset.
            </ExplainBox>
          </SubtopicCard>

          <SubtopicCard title="Adjusting Asset and Liability Balances">
            <p>
              Once you know which items are affected, adjust each balance by the same
              amount you used to correct profit — no new figures are invented, you
              simply carry the correction through.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Start with the asset or liability balance as it appeared in the draft accounts.</li>
              <li>Add or subtract the same correction amount used for the profit adjustment.</li>
              <li>Also adjust capital, because capital changes by the same amount as the change in net profit (profit belongs to the owner).</li>
            </ol>
          </SubtopicCard>

          <SubtopicCard title="Preparing the Extract">
            <p>
              An &quot;extract&quot; means you only show the section(s) that changed — not the
              whole statement of financial position. This saves time and keeps the
              answer focused on what the question actually asked for.
            </p>
            <WorkedTable
              title="Statement of Financial Position (extract) as at 31 December"
              columns={['', '$']}
              rows={[
                ['Non-current assets', ''],
                ['Equipment (net of corrected depreciation)', '18 600'],
                ['', ''],
                ['Current assets', ''],
                ['Inventory (corrected)', '21 200'],
                ['Trade receivables (corrected)', '12 720'],
                ['Prepayments', '600'],
                ['', ''],
                ['Capital', ''],
                ['Capital (opening) + corrected net profit', '67 620'],
              ]}
              note="Only the lines that changed, or that are needed to keep the statement balancing, are shown in an extract — full detail on unaffected sections is not required."
            />
          </SubtopicCard>

          <SubtopicCard title="Making Sure the Statement Still Balances">
            <p>
              A statement of financial position must always follow the accounting
              equation: <strong>Assets = Capital + Liabilities</strong>. After making
              corrections, always add up both sides again to check they are still
              equal — this is your final proof that every correction was applied
              consistently.
            </p>
            <ExplainBox label="Final check">
              If your corrected assets no longer equal capital plus liabilities, you
              have either forgotten to adjust one side of an entry, or adjusted profit
              without carrying the matching change through to the asset or liability.
              Go back to the list of affected accounts and check each one again.
            </ExplainBox>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">SFP Extract Rules</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Show only the affected section(s), not the full statement</li>
            <li>Every profit correction linked to an asset/liability must also update that asset/liability</li>
            <li>Capital moves by the same amount as the change in net profit</li>
            <li>Assets = Capital + Liabilities must still hold true</li>
          </ul>
        </div>
      ),
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

      {/* This topic's own top bar */}
      <TopicHero section={activeSection} index={activeIndex} />

      {/* Topic rail — pinned while scrolling */}
      <div className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
        <TopicNav activeId={activeId} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Area */}
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
                  <strong>Effect of Errors:</strong> Some errors
                  break the trial balance (e.g. single entry, casting errors); others
                  don't (omission, commission, principle, original entry, reversal,
                  compensating errors) — and a balanced trial balance never proves the
                  books are fully correct.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Adjustments:</strong> Trading account
                  items (sales, purchases, returns, stock) adjust gross profit; expense
                  and income items adjust net profit only — always compare the correct
                  figure against the recorded figure to know whether to add or subtract.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Revised Statement of Profit:</strong>{' '}
                  Show corrections as a reconciliation (draft → adjustments →
                  corrected) or redraw the full trading and profit or loss account —
                  both must reach the same corrected net profit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Revised Statement of Financial Position:</strong>{' '}
                  Trace each profit correction to its matching asset, liability, or
                  capital, present only the affected sections as an extract, and
                  confirm assets still equal capital plus liabilities.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Trial Balance and Errors!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default TrialBalanceAndErrors;
