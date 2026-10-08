import assert from 'node:assert/strict';
import { build } from 'esbuild';

const { outputFiles } = await build({
  entryPoints: ['src/features/ai/graph/graphModel.ts'],
  bundle: true, write: false, platform: 'node', format: 'esm',
});
const { buildFromSource, parseGraphSpec, applyStep } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const { outputFiles: exprFiles } = await build({
  entryPoints: ['src/features/ai/graph/expression.ts'],
  bundle: true, write: false, platform: 'node', format: 'esm',
});
const { compileExpression } = await import(`data:text/javascript;base64,${Buffer.from(exprFiles[0].text).toString('base64')}`);

const ev = (src, x, degrees = false) => { const r = compileExpression(src, degrees); assert.ok(r.ok, `${src}: ${r.error}`); return r.fn(x); };
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} != ${b}`);

// Expression evaluator
near(ev('x^2', 3), 9, 'power');
near(ev('-x^2', 3), -9, 'unary minus binds looser than ^');
near(ev('2x+1', 3), 7, 'implicit multiplication');
near(ev('3(x+1)', 2), 9, 'implicit with parentheses');
near(ev('(x+1)(x-1)', 3), 8, 'adjacent parentheses');
near(ev('2^-x', 2), 0.25, 'negative exponent');
near(ev('2^3^2', 0), 512, 'right associative power');
near(ev('sin(pi/2)', 0), 1, 'sin and pi');
near(ev('sin(x)', 90, true), 1, 'degrees');
near(ev('y = x/2', 4), 2, 'y= prefix');
near(ev('f(x) = 3x - 2', 2), 4, 'f(x)= prefix');
near(ev('log(100)', 0), 2, 'log is base 10');
near(ev('ln(e)', 0), 1, 'ln');
near(ev('2e', 1), 2 * Math.E, '2e is 2*e');
near(ev('x²', 3), 9, 'superscript two');
near(ev('sqrt(x)', 16), 4, 'sqrt');
for (const bad of ['', 'x +', 'foo(x)', 'alert(1)', 'x; y', '(x', 'constructor', '__proto__', 'x.constructor']) {
  assert.equal(compileExpression(bad).ok, false, `rejects ${JSON.stringify(bad)}`);
}
assert.equal(compileExpression('x'.repeat(200)).ok, false, 'rejects very long input');
assert.equal(compileExpression('('.repeat(100) + 'x' + ')'.repeat(100)).ok, false, 'rejects deep nesting');

// Transformations of points
const pt = (step, p) => applyStep(step, p);
assert.deepEqual(pt({ type: 'translate', dx: 2, dy: -1 }, [1, 1]), [3, 0]);
assert.deepEqual(pt({ type: 'reflect', axis: 'x' }, [2, 3]), [2, -3]);
assert.deepEqual(pt({ type: 'reflect', axis: 'y' }, [2, 3]), [-2, 3]);
assert.deepEqual(pt({ type: 'reflect', axis: 'y=x' }, [2, 3]), [3, 2]);
assert.deepEqual(pt({ type: 'reflect', axis: 'y=-x' }, [2, 3]), [-3, -2]);
assert.deepEqual(pt({ type: 'reflect', axis: 'x=4' }, [1, 3]), [7, 3]);
assert.deepEqual(pt({ type: 'reflect', axis: 'y=-1' }, [1, 3]), [1, -5]);
assert.deepEqual(pt({ type: 'enlarge', factor: 2, center: [1, 1] }, [3, 2]), [5, 3]);
assert.deepEqual(pt({ type: 'enlarge', factor: -1 }, [3, 2]), [-3, -2]);
const r = pt({ type: 'rotate', angle: 90, center: [0, 0] }, [1, 0]);
near(r[0], 0, 'rotate x'); near(r[1], 1, 'rotate y');
const r2 = pt({ type: 'rotate', angle: -90, center: [1, 1] }, [3, 1]);
near(r2[0], 1, 'clockwise about centre x'); near(r2[1], -1, 'clockwise about centre y');

// Graph model: y = x^2 translated by (2, 1) must satisfy y = (x-2)^2 + 1 exactly.
const parabola = buildFromSource(JSON.stringify({
  objects: [{ type: 'function', expr: 'x^2' }],
  steps: [{ type: 'translate', dx: 2, dy: 1 }, { type: 'reflect', axis: 'x' }],
}));
assert.ok(parabola.ok, parabola.error);
assert.equal(parabola.model.stages.length, 3);
for (const [x, y] of parabola.model.stages[1].items[0].segments.flat()) near(y, (x - 2) ** 2 + 1, 'translated parabola');
for (const [x, y] of parabola.model.stages[2].items[0].segments.flat()) near(y, -((x - 2) ** 2 + 1), 'reflected parabola');
assert.match(parabola.model.stages[1].caption, /Translate by \(2, 1\)/);

// Reflecting y = 2^x in y = x gives the inverse: x = 2^y.
const inverse = buildFromSource(JSON.stringify({
  objects: [{ type: 'function', expr: '2^x' }], steps: [{ type: 'reflect', axis: 'y=x' }], xRange: [-4, 4],
}));
assert.ok(inverse.ok, inverse.error);
for (const [x, y] of inverse.model.stages[1].items[0].segments.flat()) near(x, 2 ** y, 'inverse function');

// Asymptotes must split the line instead of joining branches.
const hyperbola = buildFromSource(JSON.stringify({ objects: [{ type: 'function', expr: '1/x' }] }));
assert.ok(hyperbola.ok, hyperbola.error);
for (const segment of hyperbola.model.stages[0].items[0].segments) {
  assert.ok(segment.every(([x]) => x > 0) || segment.every(([x]) => x < 0), '1/x branches are not joined across 0');
}
const tangent = buildFromSource(JSON.stringify({ objects: [{ type: 'function', expr: 'tan(x)' }], xRange: [-6, 6] }));
assert.ok(tangent.ok, tangent.error);
assert.ok(tangent.model.stages[0].items[0].segments.length >= 4, 'tan(x) is split at each asymptote');
assert.ok(tangent.model.yRange[1] < 100, 'y range ignores asymptote spikes');

// Geometry: triangle ABC enlarged then rotated, with prime labels and square scale.
const shape = buildFromSource(JSON.stringify({
  objects: [{ type: 'polygon', points: [[1, 1], [3, 1], [2, 3]] }],
  steps: [{ type: 'enlarge', factor: 2 }, { type: 'rotate', angle: 90 }],
}));
assert.ok(shape.ok, shape.error);
assert.deepEqual(shape.model.stages[1].items[0].points, [[2, 2], [6, 2], [4, 6]]);
assert.deepEqual(shape.model.stages[1].items[0].labels, ["A'", "B'", "C'"]);
assert.deepEqual(shape.model.stages[2].items[0].labels, ["A''", "B''", "C''"]);
near(shape.model.stages[2].items[0].points[1][0], -2, 'rotated B x');
near(shape.model.stages[2].items[0].points[1][1], 6, 'rotated B y');
assert.ok(shape.model.equalScale);
const [xr, yr] = [shape.model.xRange, shape.model.yRange];
for (const stage of shape.model.stages) for (const p of stage.items[0].points) {
  assert.ok(p[0] >= xr[0] && p[0] <= xr[1] && p[1] >= yr[0] && p[1] <= yr[1], 'every vertex is inside the view');
}

// Fixed objects are not transformed.
const mirror = buildFromSource(JSON.stringify({
  objects: [{ type: 'function', expr: 'x^3' }, { type: 'function', expr: 'x', fixed: true }], steps: [{ type: 'reflect', axis: 'y=x' }],
}));
assert.ok(mirror.ok, mirror.error);
assert.equal(mirror.model.fixed.length, 1);
assert.ok(mirror.model.stages[1].guides.length === 1, 'mirror line guide is drawn');

// Validation rejects hostile or malformed specs with a message, never throwing.
for (const bad of [
  'not json', '[]', '{}', '{"objects":[{"type":"function","expr":"alert(1)"}]}',
  '{"objects":[{"type":"banana"}]}', '{"objects":[{"type":"polygon","points":[[1,1]]}]}',
  '{"objects":[{"type":"function","expr":"x"}],"steps":[{"type":"reflect","axis":"diagonal"}]}',
  '{"objects":[{"type":"function","expr":"x"}],"steps":[{"type":"stretch","axis":"x","factor":0}]}',
  '{"objects":[{"type":"function","expr":"x"}],"xRange":[5,1]}',
  '{"objects":[{"type":"function","expr":"x"}],"steps":[{"type":"reflect","axis":"constructor"}]}',
  JSON.stringify({ objects: Array.from({ length: 20 }, () => ({ type: 'function', expr: 'x' })) }),
  JSON.stringify({ objects: [{ type: 'function', expr: 'x' }], steps: Array.from({ length: 10 }, () => ({ type: 'translate', dx: 1, dy: 1 })) }),
]) {
  const result = parseGraphSpec(bad);
  assert.equal(result.ok, false, `rejects ${bad.slice(0, 60)}`);
  assert.ok(typeof result.error === 'string' && result.error.length > 0);
}
// Convenience forms.
assert.ok(parseGraphSpec('{"functions":["x^2","2x+1"]}').ok, 'functions shorthand');
assert.ok(parseGraphSpec('{"objects":[{"type":"function","expr":"x"}],"steps":[{"type":"reflect","axis":"x-axis"}]}').ok, 'axis alias');
console.log('PASS: expression evaluator, transformations, asymptotes, view window, validation.');
