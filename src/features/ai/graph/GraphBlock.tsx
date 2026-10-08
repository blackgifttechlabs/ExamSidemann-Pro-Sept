import React, { useId, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, LineChart } from 'lucide-react';
import { buildFromSource, type DrawItem, type GraphModel, type Pt } from './graphModel';

const W = 600;
const PALETTE = ['#2563eb', '#e11d48', '#059669', '#d97706', '#7c3aed', '#0891b2', '#db2777'];
const FIXED_COLOR = '#64748b';

const niceStep = (rough: number) => {
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const f = rough / pow;
  return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * pow;
};
const ticks = (min: number, max: number, target = 10) => {
  const step = niceStep((max - min) / target);
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) out.push(parseFloat(v.toPrecision(12)));
  return { step, values: out };
};
const label = (n: number) => String(parseFloat(n.toPrecision(6)));

const itemColor = (stageIndex: number, itemIndex: number, hasSteps: boolean) =>
  PALETTE[(hasSteps ? stageIndex : itemIndex) % PALETTE.length];

const GraphView: React.FC<{ model: GraphModel }> = ({ model }) => {
  const uid = useId().replace(/:/g, '');
  const hasSteps = model.stages.length > 1;
  const last = model.stages.length - 1;
  const [step, setStep] = useState(last);
  const current = Math.min(step, last);

  const [x0, x1] = model.xRange, [y0, y1] = model.yRange;
  const H = Math.round(model.equalScale ? W * ((y1 - y0) / (x1 - x0)) : W * 0.6);
  const sx = (x: number) => ((x - x0) / (x1 - x0)) * W;
  const sy = (y: number) => H - ((y - y0) / (y1 - y0)) * H;
  const px = (p: Pt) => `${sx(p[0]).toFixed(2)} ${sy(p[1]).toFixed(2)}`;

  const xt = useMemo(() => ticks(x0, x1), [x0, x1]);
  const yt = useMemo(() => ticks(y0, y1, model.equalScale ? 10 : 7), [y0, y1, model.equalScale]);
  const axisX = Math.min(Math.max(sy(0), 0), H);   // y position of the x-axis
  const axisY = Math.min(Math.max(sx(0), 0), W);   // x position of the y-axis
  const xLabelBelow = axisX < H - 16;
  const yLabelLeft = axisY > 30;

  const draw = (item: DrawItem, key: string, color: string, faded: boolean) => {
    const opacity = faded ? 0.38 : 1;
    switch (item.kind) {
      case 'path':
        return <path key={key} d={item.segments.map((s) => 'M' + s.map(px).join('L')).join('')} fill="none" stroke={color}
          strokeWidth={faded ? 1.6 : 2.6} strokeLinejoin="round" strokeLinecap="round" opacity={opacity} strokeDasharray={faded ? '5 4' : undefined} />;
      case 'polygon': {
        const cx = item.points.reduce((a, p) => a + p[0], 0) / item.points.length;
        const cy = item.points.reduce((a, p) => a + p[1], 0) / item.points.length;
        return <g key={key} opacity={opacity}>
          <polygon points={item.points.map((p) => `${sx(p[0]).toFixed(2)},${sy(p[1]).toFixed(2)}`).join(' ')}
            fill={color} fillOpacity={0.13} stroke={color} strokeWidth={faded ? 1.5 : 2.4} strokeLinejoin="round" strokeDasharray={faded ? '5 4' : undefined} />
          {item.points.map((p, i) => {
            const dx = sx(p[0]) - sx(cx), dy = sy(p[1]) - sy(cy), len = Math.hypot(dx, dy) || 1;
            const lx = sx(p[0]) + (dx / len) * 13, ly = sy(p[1]) + (dy / len) * 13 + 4;
            return <g key={i}>
              <circle cx={sx(p[0])} cy={sy(p[1])} r={3.4} fill={color} />
              {item.labels[i] && <text x={lx} y={ly} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}
                strokeWidth={3} paintOrder="stroke" className="stroke-white dark:stroke-[#0d1117]">{item.labels[i]}</text>}
            </g>;
          })}
        </g>;
      }
      case 'point':
        return <g key={key} opacity={opacity}>
          <circle cx={sx(item.at[0])} cy={sy(item.at[1])} r={4.2} fill={color} strokeWidth={1.5} className="stroke-white dark:stroke-[#0d1117]" />
          {item.label && <text x={sx(item.at[0]) + 8} y={sy(item.at[1]) - 8} fontSize={12} fontWeight={700} fill={color}
            strokeWidth={3} paintOrder="stroke" className="stroke-white dark:stroke-[#0d1117]">{item.label}</text>}
        </g>;
      case 'segment':
        return <g key={key} opacity={opacity}>
          <line x1={sx(item.from[0])} y1={sy(item.from[1])} x2={sx(item.to[0])} y2={sy(item.to[1])} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
          {item.label && <text x={(sx(item.from[0]) + sx(item.to[0])) / 2 + 6} y={(sy(item.from[1]) + sy(item.to[1])) / 2 - 6} fontSize={12} fontWeight={700} fill={color}>{item.label}</text>}
        </g>;
      case 'guide':
        return <line key={key} x1={sx(item.from[0])} y1={sy(item.from[1])} x2={sx(item.to[0])} y2={sy(item.to[1])}
          stroke={FIXED_COLOR} strokeWidth={1.6} strokeDasharray="7 5" />;
    }
  };

  const shown = model.stages.slice(0, current + 1);
  const fixedLegend = model.fixed
    .map((it) => ('label' in it && it.label ? { color: FIXED_COLOR, text: it.label } : null))
    .filter((entry): entry is { color: string; text: string } => !!entry);
  const legend: { color: string; text: string }[] = hasSteps
    ? [...shown.map((stage, i) => ({
        color: itemColor(i, 0, true),
        text: i === 0
          ? `Original${stage.items.map((it) => ('label' in it && it.label ? it.label : '')).filter(Boolean).length ? ': ' + stage.items.map((it) => ('label' in it && it.label ? it.label : '')).filter(Boolean).join(', ') : ''}`
          : `${stage.name}: ${stage.caption}`,
      })), ...fixedLegend]
    : model.stages[0].items.concat(model.fixed).map((it, i) => ({ color: itemColor(0, i, false), text: 'label' in it && it.label ? it.label : '' })).filter((l) => l.text);

  const description = [model.title, ...shown.map((s) => s.caption)].filter(Boolean).join('. ');

  return (
    <div className="not-prose my-3.5 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs dark:border-white/10 dark:bg-[#0d1117] dark:text-slate-300">
      <div>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-white/10">
          <LineChart size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{model.title || 'Graph'}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={description || 'Graph'} className="block h-auto w-full select-none">
          <defs><clipPath id={`clip-${uid}`}><rect x={0} y={0} width={W} height={H} /></clipPath></defs>
          <g className="text-slate-300 dark:text-white/10" stroke="currentColor" strokeWidth={1}>
            {xt.values.map((v) => <line key={`gx${v}`} x1={sx(v)} y1={0} x2={sx(v)} y2={H} />)}
            {yt.values.map((v) => <line key={`gy${v}`} x1={0} y1={sy(v)} x2={W} y2={sy(v)} />)}
          </g>
          <g className="text-slate-600 dark:text-slate-400" stroke="currentColor" strokeWidth={1.6}>
            <line x1={0} y1={axisX} x2={W} y2={axisX} /><line x1={axisY} y1={0} x2={axisY} y2={H} />
          </g>
          <g className="fill-slate-500 dark:fill-slate-400" fontSize={11}>
            {xt.values.filter((v) => v !== 0 && sx(v) > 14 && sx(v) < W - 14).map((v) =>
              <text key={`tx${v}`} x={sx(v)} y={xLabelBelow ? axisX + 14 : axisX - 6} textAnchor="middle">{label(v)}</text>)}
            {yt.values.filter((v) => v !== 0 && sy(v) > 10 && sy(v) < H - 6).map((v) =>
              <text key={`ty${v}`} x={yLabelLeft ? axisY - 6 : axisY + 6} y={sy(v) + 4} textAnchor={yLabelLeft ? 'end' : 'start'}>{label(v)}</text>)}
            {sx(0) >= 0 && sx(0) <= W && sy(0) >= 0 && sy(0) <= H && <text x={axisY - 6} y={axisX + 14} textAnchor="end">0</text>}
            <text x={W - 6} y={Math.max(12, axisX - 8)} textAnchor="end" fontStyle="italic" fontWeight={700}>x</text>
            <text x={Math.min(W - 10, axisY + 10)} y={12} fontStyle="italic" fontWeight={700}>y</text>
          </g>
          <g clipPath={`url(#clip-${uid})`}>
            {model.fixed.map((item, i) => draw(item, `f${i}`, hasSteps ? FIXED_COLOR : itemColor(0, model.stages[0].items.length + i, false), false))}
            {shown.map((stage, si) => si < current
              ? stage.items.map((item, i) => draw(item, `s${si}-${i}`, itemColor(si, i, hasSteps), true))
              : null)}
            {shown[current].guides.map((g, i) => draw(g, `g${i}`, FIXED_COLOR, false))}
            {shown[current].items.map((item, i) => draw(item, `c${i}`, itemColor(current, i, hasSteps), false))}
          </g>
        </svg>
        {legend.length > 0 && (
          <ul className="flex flex-col gap-1 border-t border-slate-200 px-4 py-2.5 text-xs dark:border-white/10">
            {legend.map((entry, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.color }} />
                <span className={(hasSteps ? i === current : true) ? 'font-semibold text-slate-800 dark:text-slate-100' : ''}>{entry.text}</span>
              </li>
            ))}
          </ul>
        )}
        {hasSteps && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2 dark:border-white/10">
            <button type="button" onClick={() => setStep(Math.max(0, current - 1))} disabled={current === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5">
              <ChevronLeft size={14} />Back
            </button>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400" aria-live="polite">
              {current === 0 ? 'Original' : `Step ${current} of ${last}`}
            </span>
            <button type="button" onClick={() => setStep(Math.min(last, current + 1))} disabled={current === last}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40">
              Next<ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/** Renders a ```graph code block: a JSON spec drawn by deterministic code. */
export const GraphBlock: React.FC<{ source: string; isStreaming?: boolean }> = ({ source, isStreaming = false }) => {
  const result = useMemo(() => buildFromSource(source), [source]);
  if (result.ok === false) {
    return (
      <div className="not-prose my-3.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" role="status">
        {isStreaming ? 'Drawing graph…' : `This graph could not be drawn. ${result.error}`}
      </div>
    );
  }
  return <GraphView key={source} model={result.model} />;
};
