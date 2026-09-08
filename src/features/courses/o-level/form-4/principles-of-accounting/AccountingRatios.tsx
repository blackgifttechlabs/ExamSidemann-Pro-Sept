import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { parse as parseFont } from 'opentype.js';
import {
  FaCheckCircle,
  FaBan,
  FaExclamationCircle,
  FaEyeSlash,
  FaPlay,
  FaPause,
  FaRedo,
  FaCalculator,
  FaChartLine,
  FaBalanceScale,
} from 'react-icons/fa';

/**
 * Topic: Accounting Ratios – Profitability and Liquidity
 * Layout pattern: sticky topic navigation, container cards (9px border-radius),
 * worked-example tables, explanatory callouts, and auto-scroll navigation.
 */

// ---------- Handwriting data model ----------
// A "line" is a sequence of segments. Plain text segments are drawn as
// real cursive glyph outlines (via opentype.js). Fraction segments are
// laid out as an actual numerator / rule / denominator stack, the way a
// student writes it in an exercise book — never a "/" slash.
type TextSegment = { kind: 'text'; value: string };
type FracSegment = { kind: 'frac'; num: string; den: string };
type LineSegment = TextSegment | FracSegment;
type WorkingLine = { segments: LineSegment[]; emphasis?: boolean };

const t = (value: string): TextSegment => ({ kind: 'text', value });
const frac = (num: string, den: string): FracSegment => ({ kind: 'frac', num, den });

// ---------- Shared handwriting font loader ----------
// opentype.js needs an actual outline font (ttf/otf) to turn text into
// drawable paths. This is fetched once and cached across every
// HandwrittenWorking instance. If your bundler/CORS setup can't reach
// this URL, swap it for another font you host yourself (see note below).
let fontPromise: Promise<any> | null = null;
const HANDWRITING_FONT_URL = '/fonts/Milker.otf';

function loadHandwritingFont(): Promise<any> {
  if (!fontPromise) {
    fontPromise = fetch(HANDWRITING_FONT_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch handwriting font');
        return res.arrayBuffer();
      })
      .then((buf) => parseFont(buf));
  }
  return fontPromise;
}

export const AccountingRatios: React.FC = () => {
  // ---------- CSS keyframes (reused from the trial balance component) ----------
  const highlightStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');

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

    @keyframes pulsePen {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.3); opacity: 1; }
    }
    .pen-nib {
      animation: pulsePen 1s infinite ease-in-out;
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

  // ---------- Handwritten working (real stroke-drawn glyphs + stacked fractions) ----------
  interface DrawPrimitive {
    d: string;
    kind: 'glyph' | 'bar';
  }
  interface LineLayout {
    primitives: DrawPrimitive[];
    height: number;
  }

  const HandwrittenWorking: React.FC<{ title: string; lines: WorkingLine[]; note?: string }> = ({
    title,
    lines,
    note,
  }) => {
    const [font, setFont] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [lengths, setLengths] = useState<number[]>([]);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef<number | null>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
      let cancelled = false;
      loadHandwritingFont()
        .then((f) => {
          if (!cancelled) setFont(f);
        })
        .catch(() => {
          // The widget keeps its loading state if the hosted font cannot be read.
        });
      return () => {
        cancelled = true;
      };
    }, []);

    const startX = 16;
    const svgWidth = 520;
    const ink = '#1a237e';
    const normalFontSize = 22;
    const emphasisFontSize = 25;
    const fracFontSize = 17;
    const normalLineHeight = 40;
    const fracLineHeight = 64;

    // Lay every line out into real glyph paths (and numerator/bar/denominator
    // paths for fractions) once the font is available.
    const { lineLayouts, svgHeight } = React.useMemo(() => {
      if (!font) {
        return { lineLayouts: [] as LineLayout[], svgHeight: normalLineHeight * lines.length + 24 };
      }

      let cumulativeY = 30;
      const layouts: LineLayout[] = lines.map((line) => {
        const fontSize = line.emphasis ? emphasisFontSize : normalFontSize;
        const hasFrac = line.segments.some((s) => s.kind === 'frac');
        const lineHeight = hasFrac ? fracLineHeight : normalLineHeight;
        const baselineY = cumulativeY + (hasFrac ? lineHeight * 0.62 : lineHeight * 0.55);
        let cursorX = startX;
        const primitives: DrawPrimitive[] = [];

        line.segments.forEach((seg) => {
          if (seg.kind === 'text') {
            const width = font.getAdvanceWidth(seg.value, fontSize);
            const path = font.getPath(seg.value, cursorX, baselineY, fontSize);
            primitives.push({ d: path.toPathData(2), kind: 'glyph' });
            cursorX += width + 4;
          } else {
            // Real fraction: numerator on top, a drawn rule, denominator below.
            const numWidth = font.getAdvanceWidth(seg.num, fracFontSize);
            const denWidth = font.getAdvanceWidth(seg.den, fracFontSize);
            const segWidth = Math.max(numWidth, denWidth) + 14;
            const barY = baselineY - fontSize * 0.34;
            const numPath = font.getPath(
              seg.num,
              cursorX + (segWidth - numWidth) / 2,
              barY - 8,
              fracFontSize
            );
            const denPath = font.getPath(
              seg.den,
              cursorX + (segWidth - denWidth) / 2,
              barY + fracFontSize * 1.05,
              fracFontSize
            );
            const barD = `M ${cursorX + 4} ${barY} L ${cursorX + segWidth - 4} ${barY}`;
            // Writing order: numerator, then the rule, then the denominator —
            // the order a student actually fills a fraction in.
            primitives.push({ d: numPath.toPathData(2), kind: 'glyph' });
            primitives.push({ d: barD, kind: 'bar' });
            primitives.push({ d: denPath.toPathData(2), kind: 'glyph' });
            cursorX += segWidth + 6;
          }
        });

        cumulativeY += lineHeight;
        return { primitives, height: lineHeight };
      });

      return { lineLayouts: layouts, svgHeight: cumulativeY + 16 };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [font, lines]);

    const flatPrimitives = React.useMemo(
      () => lineLayouts.flatMap((l) => l.primitives),
      [lineLayouts]
    );

    // Measure the real on-screen length of every path so the stroke
    // animation follows its actual curve, not an estimate.
    useEffect(() => {
      const next = pathRefs.current.slice(0, flatPrimitives.length).map((el) => {
        try {
          return el ? el.getTotalLength() : 0;
        } catch {
          return 0;
        }
      });
      setLengths(next);
    }, [flatPrimitives]);

    useEffect(() => {
      if (!playing) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        lastTsRef.current = null;
        return;
      }
      const step = (ts: number) => {
        if (lastTsRef.current == null) lastTsRef.current = ts;
        const dt = ts - lastTsRef.current;
        lastTsRef.current = ts;
        setProgress((p) => {
          const next = p + dt / 45;
          if (next >= 100) {
            setPlaying(false);
            return 100;
          }
          return next;
        });
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [playing]);

    const totalLength = lengths.reduce((a, b) => a + b, 0);
    const drawnLength = (progress / 100) * totalLength;

    let running = 0;
    let penPoint: { x: number; y: number } | null = null;
    const renderedPaths = flatPrimitives.map((prim, i) => {
      const len = lengths[i] ?? 0;
      const before = running;
      running += len;
      let localFrac = 0;
      if (len > 0) {
        if (drawnLength >= running) localFrac = 1;
        else if (drawnLength <= before) localFrac = 0;
        else localFrac = (drawnLength - before) / len;
      }
      if (localFrac > 0 && localFrac < 1) {
        const el = pathRefs.current[i];
        if (el) {
          try {
            const point = el.getPointAtLength(len * localFrac);
            penPoint = { x: point.x, y: point.y };
          } catch {
            penPoint = null;
          }
        }
      }
      const isBar = prim.kind === 'bar';
      return (
        <path
          key={i}
          ref={(el): void => {
            pathRefs.current[i] = el;
          }}
          d={prim.d}
          fill={isBar ? 'none' : ink}
          fillOpacity={isBar ? 0 : localFrac}
          stroke={ink}
          strokeWidth={isBar ? 2 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len || 1}
          strokeDashoffset={len ? len * (1 - localFrac) : 0}
        />
      );
    });

    const ready = !!font && lengths.length === flatPrimitives.length && flatPrimitives.length > 0;
    const activePenPoint = penPoint as { x: number; y: number } | null;

    return (
      <figure className="my-4 min-w-0 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        <figcaption className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
          <span>{title}</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={() => setPlaying((p) => !p)}
              disabled={!ready}
              className="text-slate-500 hover:text-slate-800 disabled:opacity-40"
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>
            <button
              type="button"
              aria-label="Replay"
              onClick={() => {
                setPlaying(false);
                setProgress(0);
              }}
              disabled={!ready}
              className="text-slate-500 hover:text-slate-800 disabled:opacity-40"
            >
              <FaRedo />
            </button>
          </div>
        </figcaption>
        <div className="ledger-paper px-4 py-3">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width="100%"
            preserveAspectRatio="xMinYMin meet"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          >
            {font && flatPrimitives.length > 0 ? (
              <>
                {renderedPaths}
                {ready && activePenPoint && progress < 100 && (
                  <circle cx={activePenPoint.x} cy={activePenPoint.y} r={3.5} fill="#1CB0F6" className="pen-nib" />
                )}
              </>
            ) : (
              <text x={startX} y={28} fontSize={14} fill="#94a3b8">
                Loading handwriting…
              </text>
            )}
          </svg>
          <input
            type="range"
            className="ledger-timeline w-full mt-2"
            min={0}
            max={100}
            value={progress}
            disabled={!ready}
            onChange={(e) => {
              setPlaying(false);
              setProgress(Number(e.target.value));
            }}
          />
        </div>
        {note && <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500">{note}</p>}
      </figure>
    );
  };

  // ---------- Section content ----------

  // Profitability ratios section
  const profitabilityContent = (
    <div className="space-y-6">
      <SubtopicCard title="Mark-up">
        <p>
          <strong>Definition:</strong> Mark-up is the percentage of gross profit earned on the cost of sales. It tells you how much profit is added to the cost price to arrive at the selling price.
        </p>
        <div className="max-w-full overflow-x-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Mark-up = (Gross Profit / Cost of Sales) × 100
          </p>
        </div>
        <ExplainBox>
          If you buy goods for $100 and sell them for $140, your gross profit is $40. The mark-up is 40% because the profit is 40% of the cost ($40/$100). Every dollar of cost earns 40 cents of profit.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Mark-up"
          lines={[
            { segments: [t('Sales = $200 000')] },
            { segments: [t('Cost of Sales = $140 000')] },
            { segments: [t('Gross Profit = 200 000 - 140 000 = $60 000')] },
            { segments: [t('Mark-up = '), frac('60 000', '140 000'), t(' x 100')] },
            { segments: [t('Mark-up = 42.9%')], emphasis: true },
          ]}
          note="The business earns 42.9% profit on every dollar of cost."
        />
        <p>
          <strong>Interpretation:</strong> A higher mark-up generally indicates more profit per unit sold, but it can also mean higher prices that may reduce sales volume. Mark-up should be compared with industry averages and past periods to assess pricing strategy and cost control.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Margin (Gross Profit Margin)">
        <p>
          <strong>Definition:</strong> Margin is the percentage of gross profit earned on sales revenue. It shows how much of each sales dollar is left after covering the cost of goods sold.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Margin = (Gross Profit / Sales) × 100
          </p>
        </div>
        <ExplainBox>
          Using the same example: selling price $140, cost $100, gross profit $40. The margin is 40/140 × 100 = 28.6%. For every dollar of sales, the business keeps 28.6 cents as gross profit.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Margin"
          lines={[
            { segments: [t('Sales = $200 000')] },
            { segments: [t('Cost of Sales = $140 000')] },
            { segments: [t('Gross Profit = 200 000 - 140 000 = $60 000')] },
            { segments: [t('Margin = '), frac('60 000', '200 000'), t(' x 100')] },
            { segments: [t('Margin = 30%')], emphasis: true },
          ]}
          note="30% of each sales dollar is gross profit."
        />
        <p>
          <strong>Interpretation:</strong> Margin is a widely used profitability metric. A higher margin means better profitability per sale, but it must be balanced against sales volume and market competition. It is often compared across periods to spot trends.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Relationship Between Mark-up and Margin">
        <p>
          Mark-up and margin are two sides of the same coin. They both use gross profit, but the denominator differs. You can convert one to the other using these formulas:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-mono text-sm font-bold">Mark-up → Margin</p>
            <p className="font-mono">Margin = Mark-up / (1 + Mark-up)</p>
            <p className="text-xs text-slate-600 mt-1">(where mark-up is expressed as a decimal, e.g. 40% = 0.40)</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="font-mono text-sm font-bold">Margin → Mark-up</p>
            <p className="font-mono">Mark-up = Margin / (1 − Margin)</p>
            <p className="text-xs text-slate-600 mt-1">(margin as a decimal)</p>
          </div>
        </div>
        <HandwrittenWorking
          title="Conversion Example"
          lines={[
            { segments: [t('Mark-up 40% to Margin')] },
            { segments: [t('Margin = '), frac('0.40', '1 + 0.40'), t(' = 28.6%')], emphasis: true },
            { segments: [t('Margin 30% to Mark-up')] },
            { segments: [t('Mark-up = '), frac('0.30', '1 - 0.30'), t(' = 42.9%')], emphasis: true },
          ]}
          note="Always check that margin is less than mark-up (except when both are 0% or 100%)."
        />
        <ExplainBox label="Quick trick">
          If you know the mark-up is 25%, the cost is 100% and the selling price is 125%, so margin = 25/125 = 20%. This works for any numbers.
        </ExplainBox>
      </SubtopicCard>

      <SubtopicCard title="Net Profit Percentage">
        <p>
          <strong>Definition:</strong> Net profit percentage (or net profit margin) shows the proportion of sales that remains as net profit after all expenses, including operating costs, interest, and tax, have been deducted.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Net Profit Percentage = (Net Profit / Sales) × 100
          </p>
        </div>
        <ExplainBox>
          If a business has sales of $500,000 and net profit of $50,000, its net profit percentage is 10%. That means for every dollar of sales, the company keeps 10 cents as net profit after all costs.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Net Profit Percentage"
          lines={[
            { segments: [t('Gross Profit = $200 000')] },
            { segments: [t('Operating Expenses = $150 000')] },
            { segments: [t('Net Profit = 200 000 - 150 000 = $50 000')] },
            { segments: [t('Net Profit % = '), frac('50 000', '500 000'), t(' x 100')] },
            { segments: [t('Net Profit % = 10%')], emphasis: true },
          ]}
          note="This ratio measures overall efficiency; a higher percentage indicates better cost control and profitability."
        />
        <p>
          <strong>Interpretation:</strong> Net profit percentage reflects the business's ability to control expenses and generate profit from sales. It is a key measure of overall performance and is often used to compare businesses of similar size and industry.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Using Ratios to Compare Performance">
        <p>
          Ratios are most useful when compared over time (trend analysis) or against other businesses (benchmarking). A single ratio in isolation gives little insight.
        </p>
        <WorkedTable
          title="Comparing Profitability Ratios – Two Years"
          columns={['', '2023', '2024', 'Change']}
          rows={[
            ['Mark-up', '40%', '38%', '↓ 2%'],
            ['Margin', '28.6%', '27.5%', '↓ 1.1%'],
            ['Net Profit %', '12%', '10.5%', '↓ 1.5%'],
          ]}
          note="A declining margin might indicate rising costs or price pressure; the business should investigate the cause."
        />
        <ExplainBox>
          When comparing with other businesses, ensure you use the same accounting policies and industry standards. Differences in size, age, and market position can affect ratios.
        </ExplainBox>
        <p>
          <strong>Benchmarking:</strong> Compare your ratios to industry averages or to a leading competitor. If your margin is lower, you may need to reduce costs, increase prices, or improve sales mix.
        </p>
      </SubtopicCard>
    </div>
  );

  const profitabilityAside = (
    <div className="rounded-[9px] border border-[#84D8FF] bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Profitability Ratios</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Mark-up:</strong> Profit as % of cost</li>
        <li><strong>Margin:</strong> Profit as % of sales</li>
        <li><strong>Net profit %:</strong> Net profit as % of sales</li>
        <li>Higher is generally better</li>
        <li>Compare over time and with competitors</li>
      </ul>
    </div>
  );

  // Liquidity ratios section
  const liquidityContent = (
    <div className="space-y-6">
      <SubtopicCard title="Current Ratio">
        <p>
          <strong>Definition:</strong> The current ratio measures a business's ability to pay its short-term obligations (due within one year) using its current assets (cash, receivables, inventory, etc.).
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Current Ratio = Current Assets / Current Liabilities
          </p>
        </div>
        <ExplainBox>
          A current ratio of 2:1 means the business has twice as many current assets as current liabilities. It is often considered a comfortable buffer.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Current Ratio"
          lines={[
            { segments: [t('Current Assets = $120 000')] },
            { segments: [t('Current Liabilities = $60 000')] },
            { segments: [t('Current Ratio = '), frac('120 000', '60 000')] },
            { segments: [t('Current Ratio = 2.0 : 1')], emphasis: true },
          ]}
          note="An ideal ratio is around 2:1, but this varies by industry. Too high may indicate idle assets; too low may signal liquidity risk."
        />
        <p>
          <strong>Interpretation:</strong> A ratio above 1 indicates the business can cover short-term debts. A very high ratio (e.g., 4:1) might mean excess inventory or cash that could be invested for better returns. A ratio below 1 suggests potential difficulty meeting short-term obligations.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Quick Ratio (Acid Test)">
        <p>
          <strong>Definition:</strong> The quick ratio is a more stringent measure of liquidity that excludes inventory from current assets, as inventory may not be easily converted to cash quickly.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Quick Ratio = (Current Assets − Inventory) / Current Liabilities
          </p>
        </div>
        <ExplainBox>
          If a business has current assets of $120,000, inventory of $40,000, and current liabilities of $60,000, the quick ratio is (120,000 − 40,000) / 60,000 = 1.33 : 1. This shows the business can cover short-term debts even if it cannot sell inventory quickly.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Quick Ratio"
          lines={[
            { segments: [t('Current Assets = $120 000')] },
            { segments: [t('Inventory = $40 000')] },
            { segments: [t('Quick Assets = 120 000 - 40 000 = $80 000')] },
            { segments: [t('Current Liabilities = $60 000')] },
            { segments: [t('Quick Ratio = '), frac('80 000', '60 000')] },
            { segments: [t('Quick Ratio = 1.33 : 1')], emphasis: true },
          ]}
          note="A quick ratio of 1:1 is often considered ideal, but again varies by industry."
        />
        <p>
          <strong>Interpretation:</strong> A quick ratio below 1 may indicate that the business relies heavily on inventory to meet short-term obligations. This could be risky if inventory cannot be sold quickly. A ratio significantly above 1 suggests strong liquidity.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Rate of Inventory Turnover">
        <p>
          <strong>Definition:</strong> Inventory turnover measures how many times a business sells and replaces its inventory during a period. It indicates how efficiently inventory is managed.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="font-mono text-lg font-bold text-slate-800">
            Inventory Turnover = Cost of Sales / Average Inventory
          </p>
          <p className="text-sm text-slate-600 mt-1">(or use closing inventory if average is not available)</p>
        </div>
        <ExplainBox>
          If the cost of sales is $500,000 and average inventory is $100,000, the turnover is 5 times per year. That means the business sells and replaces its inventory five times a year.
        </ExplainBox>
        <HandwrittenWorking
          title="Calculating Inventory Turnover"
          lines={[
            { segments: [t('Cost of Sales = $500 000')] },
            { segments: [t('Average Inventory = $100 000')] },
            { segments: [t('Inventory Turnover = '), frac('500 000', '100 000')] },
            { segments: [t('Inventory Turnover = 5 times')], emphasis: true },
          ]}
          note="A higher turnover indicates efficient inventory management and less money tied up in stock. However, too high may mean lost sales due to stock shortages."
        />
        <p>
          <strong>Interpretation:</strong> A low turnover may indicate overstocking, obsolescence, or weak sales. A high turnover suggests strong sales and efficient inventory management. Compare with industry averages and past periods.
        </p>
      </SubtopicCard>

      <SubtopicCard title="Using Liquidity Ratios to Assess Short-term Obligations">
        <p>
          Liquidity ratios are essential for assessing the financial health of a business in the short term. They help stakeholders (creditors, suppliers, investors) understand whether the business can pay its bills when they fall due.
        </p>
        <WorkedTable
          title="Comparing Liquidity Ratios – Two Periods"
          columns={['', '2023', '2024', 'Change']}
          rows={[
            ['Current Ratio', '1.8 : 1', '2.2 : 1', '↑ 0.4'],
            ['Quick Ratio', '1.1 : 1', '1.5 : 1', '↑ 0.4'],
            ['Inventory Turnover', '6.0 times', '5.2 times', '↓ 0.8'],
          ]}
          note="An improving current and quick ratio suggests better liquidity, but a declining turnover could indicate slower sales or excess inventory."
        />
        <ExplainBox>
          A business with a current ratio of 2:1 and a quick ratio of 1:1 is generally considered healthy. But if inventory turnover is falling, it may have too much stock that is not selling, which could hurt cash flow.
        </ExplainBox>
        <p>
          <strong>Trends:</strong> Monitoring these ratios over time helps spot emerging problems. For example, a declining current ratio might indicate that the business is taking on too much short-term debt, while a declining inventory turnover might signal a buildup of obsolete stock.
        </p>
      </SubtopicCard>
    </div>
  );

  const liquidityAside = (
    <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
      <h3 className="mb-3 text-xl font-bold text-[#1CB0F6]">Key Liquidity Ratios</h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li><strong>Current ratio:</strong> Current assets / current liabilities</li>
        <li><strong>Quick ratio:</strong> (Current assets − inventory) / current liabilities</li>
        <li><strong>Inventory turnover:</strong> Cost of sales / average inventory</li>
        <li>Ideal current ratio ~2:1, quick ~1:1</li>
        <li>Compare trends and industry norms</li>
      </ul>
    </div>
  );

  // ---------- Sections array ----------
  const sections: TopicSection[] = [
    {
      id: 'profitability-ratios',
      title: 'Profitability Ratios',
      color: 'blue',
      content: profitabilityContent,
      aside: profitabilityAside,
    },
    {
      id: 'liquidity-ratios',
      title: 'Liquidity Ratios',
      color: 'purple',
      content: liquidityContent,
      aside: liquidityAside,
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
      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
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
                  <strong>Profitability Ratios:</strong> Mark-up, margin, and net profit percentage help assess earning performance. Compare over time and with competitors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Liquidity Ratios:</strong> Current ratio, quick ratio, and inventory turnover measure short-term financial health. They indicate whether the business can meet its immediate obligations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Relationship:</strong> Mark-up and margin are interlinked; you can convert one to the other using simple formulas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Comparison:</strong> Ratios are most valuable when compared over time (trends) or against industry benchmarks.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed Accounting Ratios!' : `Topic ${activeIndex + 1} of ${sections.length}`}
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

export default AccountingRatios;