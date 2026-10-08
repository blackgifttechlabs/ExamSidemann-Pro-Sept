/**
 * Turns a small AI-written graph spec into drawable geometry.
 * The AI only *describes* the picture; every coordinate is computed here, so a
 * transformed curve or shape can never disagree with the maths.
 */
import { compileExpression, type CompiledExpression } from './expression';

export type Pt = [number, number];

export type TransformStep =
  | { type: 'translate'; dx: number; dy: number; caption?: string }
  | { type: 'reflect'; axis: string; caption?: string }
  | { type: 'stretch'; axis: 'x' | 'y'; factor: number; caption?: string }
  | { type: 'enlarge'; factor: number; center?: Pt; caption?: string }
  | { type: 'rotate'; angle: number; center?: Pt; caption?: string };

export type GraphObject =
  | { type: 'function'; expr: string; label?: string; fixed?: boolean; domain?: [number, number] }
  | { type: 'polygon'; points: Pt[]; label?: string; vertexLabels?: string[]; fixed?: boolean }
  | { type: 'point'; x: number; y: number; label?: string; fixed?: boolean }
  | { type: 'line'; from: Pt; to: Pt; label?: string; fixed?: boolean };

export interface GraphSpec {
  title?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  degrees?: boolean;
  objects: GraphObject[];
  steps?: TransformStep[];
}

export type DrawItem =
  | { kind: 'path'; segments: Pt[][]; label?: string }
  | { kind: 'polygon'; points: Pt[]; labels: string[]; label?: string }
  | { kind: 'point'; at: Pt; label?: string }
  | { kind: 'segment'; from: Pt; to: Pt; label?: string; dashed?: boolean }
  | { kind: 'guide'; from: Pt; to: Pt }; // infinite-ish mirror line, drawn dashed

export interface Stage {
  name: string;
  caption: string;
  items: DrawItem[];
  guides: DrawItem[];
}

export interface GraphModel {
  title?: string;
  xRange: Pt;
  yRange: Pt;
  stages: Stage[];
  fixed: DrawItem[];
  equalScale: boolean;
}

export type SpecResult = { ok: true; spec: GraphSpec } | { ok: false; error: string };
export type ModelResult = { ok: true; model: GraphModel } | { ok: false; error: string };

const MAX_SOURCE = 6000;
const MAX_OBJECTS = 8;
const MAX_STEPS = 6;
const MAX_POINTS = 60;
const SAMPLES = 4000;
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isPt = (v: unknown): v is Pt => Array.isArray(v) && v.length === 2 && finite(v[0]) && finite(v[1]);
const isRange = (v: unknown): v is Pt => isPt(v) && v[0] < v[1];
const fmt = (n: number) => String(parseFloat(n.toFixed(4)));
const fmtPt = (p: Pt) => `(${fmt(p[0])}, ${fmt(p[1])})`;

const REFLECT_ALIASES: Record<string, string> = {
  x: 'x', 'x-axis': 'x', 'x axis': 'x', xaxis: 'x', 'y=0': 'x',
  y: 'y', 'y-axis': 'y', 'y axis': 'y', yaxis: 'y', 'x=0': 'y',
  'y=x': 'y=x', 'y=-x': 'y=-x',
};
const normaliseAxis = (axis: string): string | null => {
  const key = axis.trim().toLowerCase().replace(/\s+/g, ' ');
  const compact = key.replace(/\s/g, '');
  if (Object.hasOwn(REFLECT_ALIASES, key)) return REFLECT_ALIASES[key];
  if (Object.hasOwn(REFLECT_ALIASES, compact)) return REFLECT_ALIASES[compact];
  return /^(x|y)=-?\d+(\.\d+)?$/.test(compact) ? compact : null;
};

export const parseGraphSpec = (source: string): SpecResult => {
  if (source.length > MAX_SOURCE) return { ok: false, error: 'The graph description is too large.' };
  let raw: any;
  try { raw = JSON.parse(source); } catch { return { ok: false, error: 'The graph description is not valid JSON.' }; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'The graph description must be an object.' };

  const objectsIn: unknown[] = Array.isArray(raw.objects) ? raw.objects : [];
  // Convenience: allow {"functions":["x^2"]} / {"curves":[...]} alongside objects.
  for (const key of ['functions', 'curves']) {
    if (Array.isArray(raw[key])) for (const entry of raw[key]) {
      objectsIn.push(typeof entry === 'string' ? { type: 'function', expr: entry } : { type: 'function', ...entry });
    }
  }
  if (!objectsIn.length) return { ok: false, error: 'Nothing to draw: add at least one object.' };
  if (objectsIn.length > MAX_OBJECTS) return { ok: false, error: `Too many objects (max ${MAX_OBJECTS}).` };

  const objects: GraphObject[] = [];
  for (const o of objectsIn as any[]) {
    if (!o || typeof o !== 'object') return { ok: false, error: 'Each object must be an object.' };
    const label = typeof o.label === 'string' ? o.label.slice(0, 60) : undefined;
    const fixed = o.fixed === true;
    if (o.type === 'function') {
      if (typeof o.expr !== 'string') return { ok: false, error: 'A function needs an "expr" string.' };
      const compiled = compileExpression(o.expr, raw.degrees === true);
      if (compiled.ok === false) return { ok: false, error: `Cannot read "${o.expr}": ${compiled.error}.` };
      objects.push({ type: 'function', expr: o.expr, label, fixed, domain: isRange(o.domain) ? o.domain : undefined });
    } else if (o.type === 'polygon') {
      if (!Array.isArray(o.points) || o.points.length < 2 || o.points.length > MAX_POINTS || !o.points.every(isPt)) {
        return { ok: false, error: 'A polygon needs 2–60 [x, y] points.' };
      }
      const vertexLabels = Array.isArray(o.vertexLabels) ? o.vertexLabels.map((v: unknown) => String(v).slice(0, 8)) : undefined;
      objects.push({ type: 'polygon', points: o.points, label, vertexLabels, fixed });
    } else if (o.type === 'point') {
      if (!finite(o.x) || !finite(o.y)) return { ok: false, error: 'A point needs numeric x and y.' };
      objects.push({ type: 'point', x: o.x, y: o.y, label, fixed });
    } else if (o.type === 'line') {
      if (!isPt(o.from) || !isPt(o.to)) return { ok: false, error: 'A line needs "from" and "to" [x, y] points.' };
      objects.push({ type: 'line', from: o.from, to: o.to, label, fixed });
    } else return { ok: false, error: `Unknown object type "${String(o.type)}".` };
  }

  const stepsIn: any[] = Array.isArray(raw.steps) ? raw.steps : [];
  if (stepsIn.length > MAX_STEPS) return { ok: false, error: `Too many steps (max ${MAX_STEPS}).` };
  const steps: TransformStep[] = [];
  for (const s of stepsIn) {
    if (!s || typeof s !== 'object') return { ok: false, error: 'Each step must be an object.' };
    const caption = typeof s.caption === 'string' ? s.caption.slice(0, 120) : undefined;
    const center = s.center === undefined ? undefined : s.center;
    if (center !== undefined && !isPt(center)) return { ok: false, error: 'A step centre must be [x, y].' };
    switch (s.type) {
      case 'translate':
        if (!finite(s.dx) || !finite(s.dy)) return { ok: false, error: 'translate needs numeric dx and dy.' };
        steps.push({ type: 'translate', dx: s.dx, dy: s.dy, caption }); break;
      case 'reflect': {
        const axis = typeof s.axis === 'string' ? normaliseAxis(s.axis) : null;
        if (!axis) return { ok: false, error: 'reflect axis must be "x", "y", "y=x", "y=-x", "x=c" or "y=c".' };
        steps.push({ type: 'reflect', axis, caption }); break;
      }
      case 'stretch':
        if ((s.axis !== 'x' && s.axis !== 'y') || !finite(s.factor) || s.factor === 0) return { ok: false, error: 'stretch needs axis "x" or "y" and a non-zero factor.' };
        steps.push({ type: 'stretch', axis: s.axis, factor: s.factor, caption }); break;
      case 'enlarge':
        if (!finite(s.factor) || s.factor === 0) return { ok: false, error: 'enlarge needs a non-zero factor.' };
        steps.push({ type: 'enlarge', factor: s.factor, center, caption }); break;
      case 'rotate':
        if (!finite(s.angle)) return { ok: false, error: 'rotate needs an angle in degrees.' };
        steps.push({ type: 'rotate', angle: s.angle, center, caption }); break;
      default: return { ok: false, error: `Unknown step type "${String(s.type)}".` };
    }
  }

  let xRange: Pt | undefined, yRange: Pt | undefined;
  if (raw.xRange !== undefined) { if (!isRange(raw.xRange)) return { ok: false, error: 'xRange must be [min, max].' }; xRange = raw.xRange; }
  if (raw.yRange !== undefined) { if (!isRange(raw.yRange)) return { ok: false, error: 'yRange must be [min, max].' }; yRange = raw.yRange; }
  return {
    ok: true,
    spec: {
      title: typeof raw.title === 'string' ? raw.title.slice(0, 100) : undefined,
      xRange, yRange, degrees: raw.degrees === true, objects, steps,
    },
  };
};

export const applyStep = (step: TransformStep, [x, y]: Pt): Pt => {
  switch (step.type) {
    case 'translate': return [x + step.dx, y + step.dy];
    case 'stretch': return step.axis === 'y' ? [x, y * step.factor] : [x * step.factor, y];
    case 'enlarge': {
      const [cx, cy] = step.center ?? [0, 0];
      return [cx + (x - cx) * step.factor, cy + (y - cy) * step.factor];
    }
    case 'rotate': {
      const [cx, cy] = step.center ?? [0, 0];
      const a = (step.angle * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
      const dx = x - cx, dy = y - cy;
      return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
    }
    case 'reflect': {
      if (step.axis === 'x') return [x, -y];
      if (step.axis === 'y') return [-x, y];
      if (step.axis === 'y=x') return [y, x];
      if (step.axis === 'y=-x') return [-y, -x];
      const c = Number(step.axis.slice(2));
      return step.axis[0] === 'x' ? [2 * c - x, y] : [x, 2 * c - y];
    }
  }
};

const stepCaption = (step: TransformStep): string => {
  if (step.caption) return step.caption;
  switch (step.type) {
    case 'translate': return `Translate by (${fmt(step.dx)}, ${fmt(step.dy)})`;
    case 'stretch': return `Stretch parallel to the ${step.axis}-axis, scale factor ${fmt(step.factor)}`;
    case 'enlarge': return `Enlarge by scale factor ${fmt(step.factor)}, centre ${fmtPt(step.center ?? [0, 0])}`;
    case 'rotate': return `Rotate ${fmt(Math.abs(step.angle))}° ${step.angle >= 0 ? 'anticlockwise' : 'clockwise'} about ${fmtPt(step.center ?? [0, 0])}`;
    case 'reflect': {
      const a = step.axis;
      return `Reflect in ${a === 'x' ? 'the x-axis' : a === 'y' ? 'the y-axis' : `the line ${a}`}`;
    }
  }
};

/** Sample a function, breaking the line at gaps and asymptotes. */
export const sampleFunction = (fn: CompiledExpression, from: number, to: number, count = SAMPLES): Pt[][] => {
  const segments: Pt[][] = [];
  let current: Pt[] = [];
  let prev: Pt | null = null;
  const flush = () => { if (current.length > 1) segments.push(current); current = []; };
  for (let i = 0; i <= count; i += 1) {
    const x = from + ((to - from) * i) / count;
    const y = fn(x);
    if (!Number.isFinite(y) || Math.abs(y) > 1e6) { flush(); prev = null; continue; }
    if (prev) {
      const jump = Math.abs(y - prev[1]);
      const flipped = Math.sign(y) !== Math.sign(prev[1]) && Math.abs(y) > 8 && Math.abs(prev[1]) > 8;
      if (flipped || jump > 5e4) flush();
    }
    current.push([x, y]);
    prev = [x, y];
  }
  flush();
  return segments;
};

const niceLetter = (i: number) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? String(Math.floor(i / 26)) : '');

const guideFor = (step: TransformStep, span: number): DrawItem[] => {
  if (step.type === 'reflect') {
    const a = step.axis, big = span * 4;
    if (a === 'y=x') return [{ kind: 'guide', from: [-big, -big], to: [big, big] }];
    if (a === 'y=-x') return [{ kind: 'guide', from: [-big, big], to: [big, -big] }];
    if (a.includes('=')) {
      const c = Number(a.slice(2));
      return a[0] === 'x' ? [{ kind: 'guide', from: [c, -big], to: [c, big] }] : [{ kind: 'guide', from: [-big, c], to: [big, c] }];
    }
    return [];
  }
  if (step.type === 'enlarge' || step.type === 'rotate') {
    return [{ kind: 'point', at: step.center ?? [0, 0], label: `centre ${fmtPt(step.center ?? [0, 0])}` }];
  }
  return [];
};

const percentile = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))];

export const buildGraphModel = (spec: GraphSpec): ModelResult => {
  const hasFunction = spec.objects.some((o) => o.type === 'function');
  const steps = spec.steps ?? [];

  // View window for sampling. Without functions, derive it from the shapes later.
  let sampleX: Pt = spec.xRange ?? [-6, 6];
  const sampleSpan = sampleX[1] - sampleX[0];
  const sampleFrom = sampleX[0] - sampleSpan * 3;
  const sampleTo = sampleX[1] + sampleSpan * 3;

  const baseItems = (objects: GraphObject[]): { object: GraphObject; item: DrawItem }[] =>
    objects.map((object): { object: GraphObject; item: DrawItem } => {
      switch (object.type) {
        case 'function': {
          const compiled = compileExpression(object.expr, spec.degrees);
          const fn = compiled.ok ? compiled.fn : () => NaN;
          const [from, to] = object.domain ?? [sampleFrom, sampleTo];
          return { object, item: { kind: 'path', segments: sampleFunction(fn, from, to), label: object.label ?? `y = ${object.expr.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/i, '').replace(/\^2\b/g, '²').replace(/\^3\b/g, '³')}` } };
        }
        case 'polygon': {
          const labels = object.vertexLabels ?? object.points.map((_, i) => niceLetter(i));
          return { object, item: { kind: 'polygon', points: object.points, labels, label: object.label } };
        }
        case 'point': return { object, item: { kind: 'point', at: [object.x, object.y], label: object.label } };
        case 'line': return { object, item: { kind: 'segment', from: object.from, to: object.to, label: object.label } };
      }
    });

  const bases = baseItems(spec.objects);
  const mapItem = (item: DrawItem, apply: (p: Pt) => Pt, primes: number): DrawItem => {
    const tick = "'".repeat(primes);
    switch (item.kind) {
      case 'path': return { ...item, segments: item.segments.map((s) => s.map(apply)) };
      case 'polygon': return { ...item, points: item.points.map(apply), labels: item.labels.map((l) => (l ? l + tick : l)) };
      case 'point': return { ...item, at: apply(item.at), label: item.label ? item.label + tick : item.label };
      case 'segment': return { ...item, from: apply(item.from), to: apply(item.to), label: item.label ? item.label + tick : item.label };
      case 'guide': return item;
    }
  };

  const fixed: DrawItem[] = bases.filter(({ object }) => object.fixed).map(({ item }) => item);
  const moving = bases.filter(({ object }) => !object.fixed);

  const stages: Stage[] = [{ name: 'Original', caption: 'Original', items: moving.map(({ item }) => item), guides: [] }];
  const spanGuess = Math.max(sampleSpan, 12);
  steps.forEach((step, index) => {
    const apply = (p: Pt) => applyStep(step, p);
    const prior = stages[index].items;
    stages.push({
      name: `Step ${index + 1}`,
      caption: stepCaption(step),
      items: prior.map((item) => mapItem(item, apply, 1)).map((item, i) => relabel(item, prior[i], index + 1)),
      guides: guideFor(step, spanGuess),
    });
  });

  // ---- choose the view window ----
  const everything = [...fixed, ...stages.flatMap((s) => s.items)];
  const xs: number[] = [], ys: number[] = [];
  const addPt = (p: Pt) => { xs.push(p[0]); ys.push(p[1]); };
  const inWindow = (p: Pt, window: Pt) => p[0] >= window[0] && p[0] <= window[1];
  let xRange = spec.xRange;
  const shapePoints = everything.flatMap((it): Pt[] =>
    it.kind === 'polygon' ? it.points : it.kind === 'point' ? [it.at] : it.kind === 'segment' ? [it.from, it.to] : []);
  const stagePoints = stages.flatMap((s) => s.guides.filter((g) => g.kind === 'point').map((g) => (g as { at: Pt }).at));

  if (!xRange) {
    if (hasFunction) xRange = [-6, 6];
    else {
      const px = [...shapePoints, ...stagePoints, [0, 0] as Pt].map((p) => p[0]);
      xRange = [Math.min(...px), Math.max(...px)];
    }
  }
  const window = xRange;
  shapePoints.forEach(addPt);
  stagePoints.forEach(addPt);
  for (const it of everything) {
    if (it.kind !== 'path') continue;
    for (const seg of it.segments) for (const p of seg) if (inWindow(p, window)) addPt(p);
  }
  if (!spec.yRange) { xs.push(0); ys.push(0); } // keep the origin visible
  let yRange = spec.yRange;
  if (!yRange) {
    if (!ys.length) return { ok: false, error: 'Nothing visible to draw.' };
    const sorted = [...ys].sort((a, b) => a - b);
    // Robust bounds: ignore the extreme tails of steep curves (e.g. near asymptotes).
    let lo = hasFunction ? percentile(sorted, 0.02) : sorted[0];
    let hi = hasFunction ? percentile(sorted, 0.98) : sorted[sorted.length - 1];
    lo = Math.min(lo, 0); hi = Math.max(hi, 0);
    if (hasFunction) { // steep curves (x², 2^x) would otherwise flatten everything else
      const limit = (xRange[1] - xRange[0]) * 0.7;
      lo = Math.max(lo, -limit); hi = Math.min(hi, limit);
    }
    if (shapePoints.length) { lo = Math.min(lo, ...shapePoints.map((p) => p[1])); hi = Math.max(hi, ...shapePoints.map((p) => p[1])); }
    yRange = [lo, hi];
  }
  if (!spec.xRange) {
    const all = xs.length ? xs : [0];
    xRange = [Math.min(...all, xRange[0]), Math.max(...all, xRange[1])];
  }
  const pad = (r: Pt, f: number): Pt => { const d = (r[1] - r[0]) || 2; return [r[0] - d * f, r[1] + d * f]; };
  let finalX = spec.xRange ? xRange : pad(xRange, 0.08);
  let finalY = spec.yRange ? yRange : pad(yRange, 0.1);
  const equalScale = !hasFunction;
  if (equalScale) { // keep unit squares square so shapes are not distorted
    const sx = finalX[1] - finalX[0], sy = finalY[1] - finalY[0];
    const aspect = Math.min(1.1, Math.max(0.55, sy / sx));
    const wantY = sx * aspect, wantX = sy / aspect;
    if (wantY > sy) { const m = (finalY[0] + finalY[1]) / 2; finalY = [m - wantY / 2, m + wantY / 2]; }
    else { const m = (finalX[0] + finalX[1]) / 2; finalX = [m - wantX / 2, m + wantX / 2]; }
  }
  if (!(finalX[1] > finalX[0]) || !(finalY[1] > finalY[0])) return { ok: false, error: 'The graph range is empty.' };
  return { ok: true, model: { title: spec.title, xRange: finalX, yRange: finalY, stages, fixed, equalScale } };
};

/** Prime marks accumulate per stage; rebuild from the original item's label. */
const relabel = (mapped: DrawItem, original: DrawItem, primes: number): DrawItem => {
  const tick = "'".repeat(primes);
  const strip = (s: string) => s.replace(/'+$/, '');
  if (mapped.kind === 'polygon' && original.kind === 'polygon') return { ...mapped, labels: original.labels.map((l) => (l ? strip(l) + tick : l)) };
  if (mapped.kind === 'point' && original.kind === 'point') return { ...mapped, label: original.label ? strip(original.label) + tick : original.label };
  if (mapped.kind === 'segment' && original.kind === 'segment') return { ...mapped, label: original.label ? strip(original.label) + tick : original.label };
  return mapped;
};

export const buildFromSource = (source: string): ModelResult => {
  const parsed = parseGraphSpec(source);
  return parsed.ok === false ? { ok: false, error: parsed.error } : buildGraphModel(parsed.spec);
};
