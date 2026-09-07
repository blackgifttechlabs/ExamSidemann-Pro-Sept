import sys

path = sys.argv[1]
with open(path, encoding='utf-8') as f:
    content = f.read()

# 1. Insert 6 new diagram builder functions before the CHAPTER CONTENT marker
marker = """/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */"""

builders = '''
// --- Worked-example diagrams ---
function build_Example1Diagram() {
  const A = { x: 90, y: 150 }, B = { x: 330, y: 150 };
  const given = [mkLine(A, B, 'Suppose we want the perpendicular bisector of AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const { actions } = perpBisectorActions(A, B, {
    r: 200,
    n1: 'From A, draw an arc using some chosen compass width.',
    n2: 'From B, keep that SAME width and draw a matching arc — this is the step that must stay consistent.',
    n3: 'Because both arcs used the same width, the crossing points are equally distant from A and from B — so the line through them is a true perpendicular bisector.',
  });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_Example2Diagram() {
  const A = { x: 100, y: 260 }, B = { x: 300, y: 260 };
  const given = [mkLine(A, B, 'Start with a base line AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const tri = equilateralActions(A, B, { n3: 'Build an equilateral triangle on AB — this gives a 60° angle at A.' });
  const angle60 = angleFromCenter(A, tri.C);
  const half30 = bisectAngleActions(A, 0, angle60, { r1: 70, n1: 'Bisect this 60° angle...', n3: '...giving exactly 30°.' });
  const half15 = bisectAngleActions(A, 0, half30.bisectorAngle, { r1: 55, n1: 'Now bisect the 30° angle...', n3: '...giving exactly 15°.' });
  return { viewBox: '0 0 420 300', actions: [...given, ...tri.actions, ...half30.actions, ...half15.actions] };
}

function build_Example3Diagram() {
  const A = { x: 20, y: 240 }, B = { x: 380, y: 240 }, P = { x: 260, y: 90 };
  const Q = { x: 150, y: 240 };
  const phi = angleFromCenter(Q, P);
  const given = [mkLine(A, B, 'Line AB, with point P off the line.', { color: '#334155' }), mkPoint(P, 'P', ''),
    mkLine(Q, P, 'A transversal through Q and P.', { color: '#334155' }), mkPoint(Q, 'Q', '')];
  const { actions } = copyAngleActions(Q, phi, 0, P, phi, {
    n1: 'Mark the angle at Q between the transversal and AB.',
    n2: 'Copy that same angle at P, on the same side of the transversal.',
    n3: 'Match the gap exactly.',
    n4: 'This fixes where the new line must cross.',
    n5: 'Since the corresponding angles at Q and P are equal, this new line through P can never meet AB — it is parallel.',
  });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_Example4Diagram() {
  const O = { x: 210, y: 150 }, r = 90;
  const circle = mkCircle(O, r, 'Draw a circle of radius 5 m, centred on the light.');
  const orbit = mkOrbitCircle(O, r, 0, 360, 'Every point on this circle is exactly 5 m from the light — this circle IS the locus.', { duration: 3200 });
  return { viewBox: '0 0 420 300', actions: [mkPoint(O, 'Light', 'Start with the fixed point — the security light.'), circle, orbit] };
}

function build_Example5Diagram() {
  const A = { x: 40, y: 220 }, B = { x: 380, y: 220 }, d = 55;
  const C = { x: 130, y: 60 }, D = { x: 300, y: 60 };
  const given = [mkLine(A, B, 'The buried cable runs in a straight line.', { color: '#334155' }),
    mkPoint(C, 'Post 1', ''), mkPoint(D, 'Post 2', '')];
  const topLine = mkLine({ x: A.x, y: A.y - d }, { x: B.x, y: B.y - d }, 'Locus 1: a line 3 m above the cable...', { color: '#10b981' });
  const botLine = mkLine({ x: A.x, y: A.y + d }, { x: B.x, y: B.y + d }, '...and one 3 m below it.', { color: '#10b981' });
  const bis = perpBisectorActions(C, D, { r: 140, n3: 'Locus 2: the perpendicular bisector of the two gate posts — equidistant from both.' });
  const hit = lineLineIntersect(bis.line[0], bis.line[1], { x: A.x, y: A.y - d }, { x: B.x, y: B.y - d });
  const solMark = hit ? mkPoint(hit, '★', 'Where the two loci cross satisfies both rules — a valid spot for the tree.', { color: '#f59e0b', duration: 500 }) : null;
  const actions = [...given, topLine, botLine, ...bis.actions];
  if (solMark) actions.push(solMark);
  return { viewBox: '0 0 420 300', actions };
}

function build_Example6Diagram() {
  const A = { x: 70, y: 230 }, B = { x: 350, y: 230 }, C = { x: 300, y: 100 };
  const given = [
    mkLine(A, B, 'Here is an obtuse-angled triangle, ABC.', { color: '#334155' }), mkLine(B, C, '', { color: '#334155' }), mkLine(C, A, '', { color: '#334155' }),
    mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''),
  ];
  const bis1 = perpBisectorActions(A, B, { r: 190, n3: 'Construct the perpendicular bisector of AB.' });
  const bis2 = perpBisectorActions(B, C, { r: 190, n3: 'Construct the perpendicular bisector of BC.' });
  const O = lineLineIntersect(bis1.line[0], bis1.line[1], bis2.line[0], bis2.line[1]);
  const r = dist(O, A);
  const circle = mkCircle(O, r, 'The two bisectors cross OUTSIDE the triangle this time — that crossing point, O, is still the circumcentre.', { color: '#10b981', duration: 1500 });
  return { viewBox: '0 0 460 320', actions: [...given, ...bis1.actions, ...bis2.actions, mkPoint(O, 'O', ''), circle] };
}

''' + marker

if content.count(marker) != 1:
    print(f"ERROR: CHAPTER CONTENT marker found {content.count(marker)} times, expected 1. Aborting.")
    sys.exit(1)
content = content.replace(marker, builders)

# 2. Wire diagram computation into ExampleCard
old_a = """const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  return ("""
new_a = """const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  const diagram = useMemo(() => (open && example.build ? example.build() : null), [open, example]);
  return ("""
if content.count(old_a) != 1:
    print(f"WARNING: ExampleCard header pattern found {content.count(old_a)} times (expected 1) — skipped.")
else:
    content = content.replace(old_a, new_a)

old_b = """      {open && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          <div className="rounded-lg bg-blue-50/40 p-4 pl-6">"""
new_b = """      {open && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          {diagram && (
            <ConstructionPlayer title="Diagram" viewBox={diagram.viewBox} actions={diagram.actions} caption={diagram.caption} />
          )}
          <div className="rounded-lg bg-blue-50/40 p-4 pl-6">"""
if content.count(old_b) != 1:
    print(f"WARNING: ExampleCard body pattern found {content.count(old_b)} times (expected 1) — skipped.")
else:
    content = content.replace(old_b, new_b)

# 3. Wire build: into each of the 6 example objects (unique answer strings)
replacements = [
    ("answer: 'Because the equal width is what makes the resulting line truly perpendicular / a true bisector.' },",
     "answer: 'Because the equal width is what makes the resulting line truly perpendicular / a true bisector.', build: build_Example1Diagram },"),

    ("answer: 'Bisect 60° down to 30°, then bisect 30° down to 15°.' },",
     "answer: 'Bisect 60° down to 30°, then bisect 30° down to 15°.', build: build_Example2Diagram },"),

    ("answer: 'Equal corresponding angles is the defining test for two lines being parallel.' },",
     "answer: 'Equal corresponding angles is the defining test for two lines being parallel.', build: build_Example3Diagram },"),

    ("answer: 'A circle of radius 5 m, centred on the light.' },",
     "answer: 'A circle of radius 5 m, centred on the light.', build: build_Example4Diagram },"),

    ("answer: 'The tree can go at any crossing point between the parallel-line locus and the perpendicular bisector.' },",
     "answer: 'The tree can go at any crossing point between the parallel-line locus and the perpendicular bisector.', build: build_Example5Diagram },"),

    ('answer: "Same method every time — but for an obtuse triangle, the circumcentre lies outside the triangle." },',
     'answer: "Same method every time — but for an obtuse triangle, the circumcentre lies outside the triangle.", build: build_Example6Diagram },'),
]

missing = []
for old, new in replacements:
    count = content.count(old)
    if count != 1:
        missing.append((count, old[:60]))
    else:
        content = content.replace(old, new)

if missing:
    print("WARNING - these did not match exactly once (count, snippet):")
    for count, snippet in missing:
        print(f"  [{count}] {snippet}...")
else:
    print("All 6 example 'build:' wires applied successfully.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done — builder functions inserted, ExampleCard updated, examples wired.")
