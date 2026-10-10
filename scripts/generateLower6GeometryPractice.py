"""Generate Lower 6 Pure Mathematics: Geometry and Vectors practice (10 per section).

Every answer is computed with SymPy from the chosen numbers, so no result is typed by hand.
Questions are original practice written to the Form 5 scope; none is copied from a paper.
Run: python3 scripts/generateLower6GeometryPractice.py
"""
import json, re, math
import sympy as S
from sympy import Rational as R, sqrt
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'src/features/courses/a-level/lower-6/pure-mathematics/geometryPracticeBank.json'
SKILL = 'Practice question written to the ZIMSEC Form 5 scope. It is not copied from a past paper.'
B = {}

# ---------- formatting ----------
def n(x):
    t = S.sstr(S.nsimplify(x)).replace('-', '−')
    t = re.sub(r'(\d)\*sqrt\((\d+)\)', r'\1√\2', t)
    t = re.sub(r'sqrt\((\d+)\)', r'√\1', t)
    return t.replace('*', ' × ')
def p(x):
    return f'({n(x)})' if S.nsimplify(x) < 0 else n(x)
def pt(*c): return '(' + ', '.join(v if isinstance(v, str) else n(v) for v in c) + ')'
def term(c, sym):
    c = S.nsimplify(c)
    if c == 0: return None
    sign = '−' if c < 0 else '+'; a = abs(c)
    if sym == '': body = n(a)
    elif a == 1: body = sym
    elif a.q == 1: body = f'{a.p}{sym}'
    elif a.p == 1: body = f'{sym}/{a.q}'
    else: body = f'{a.p}{sym}/{a.q}'
    return sign, body
def poly(terms):
    out = ''
    for c, sym in terms:
        t = term(c, sym)
        if not t: continue
        sign, body = t
        out = (('−' if sign == '−' else '') + body) if not out else out + f' {sign} {body}'
    return out or '0'
def yline(m, c): return 'y = ' + poly([(m, 'x'), (c, '')])
def general(a, b, c):
    L = S.ilcm(*[S.nsimplify(v).q for v in (a, b, c)])
    a, b, c = [S.nsimplify(v) * L for v in (a, b, c)]
    g = S.igcd(int(a), int(b), int(c)) or 1
    a, b, c = a / g, b / g, c / g
    if a < 0 or (a == 0 and b < 0): a, b, c = -a, -b, -c
    return poly([(a, 'x'), (b, 'y'), (c, '')]) + ' = 0'
def sq(v, h):
    h = S.nsimplify(h)
    return f'{v}²' if h == 0 else f'({v} {"−" if h > 0 else "+"} {n(abs(h))})²'
def circle(a, b, r2): return f'{sq("x", a)} + {sq("y", b)} = {n(r2)}'
def circle_general(a, b, r2): return poly([(1, 'x²'), (1, 'y²'), (-2 * a, 'x'), (-2 * b, 'y'), (a * a + b * b - r2, '')]) + ' = 0'
def vec(v):
    out = poly([(c, s) for c, s in zip(v, 'ijk')])
    return out
def deg(radians): return f'{math.degrees(float(radians)):.1f}°'
def simp_root(v):  # exact square root text of a non-negative value
    return n(sqrt(S.nsimplify(v)))


def anim(step, src, op, pairs, why):
    """Moves are located in order; each number is matched to its first unclaimed place."""
    def starts(text, value):
        out, i = [], -1
        while True:
            i = text.find(value, i + 1)
            if i < 0: return out
            before = text[i - 1] if i else ' '; after = text[i + len(value)] if i + len(value) < len(text) else ' '
            whole = not (before in '0123456789.' or (value[0] in '0123456789' and before == '−')) and not (after in '0123456789.')
            out.append((i, whole))
    claimed_s, claimed_o, moves = [], [], []
    for frm, to in pairs:
        def pick(text, value, claimed):
            for occ, (st, whole) in enumerate(starts(text, value)):
                if whole and all(st + len(value) <= a or st >= b for a, b in claimed):
                    claimed.append((st, st + len(value))); return occ
            raise AssertionError((text, value))
        so = pick(src, frm, claimed_s); oo = pick(op, to, claimed_o)
        moves.append({'from': frm, 'to': to, 'fromOccurrence': so, 'toOccurrence': oo})
    return [step, src, op, moves, why]

def add(key, level, topic, lines, steps, anim=None):
    assert len(steps) >= 2, (key, lines)
    for a in anim or []:
        step, src, op, moves, why = a
        assert 1 <= step <= len(steps), (key, a)
        assert op in steps[step - 1] or op.replace(' ', '') in steps[step - 1].replace(' ', ''), (key, 'operation is not the written step', op, steps[step - 1])
    B.setdefault(key, []).append({'topic': topic, 'lines': lines, 'solution': steps, 'skill': SKILL,
                                  'manualStart': True, 'stepGrid': True, 'level': level, 'anim': anim or []})

x, y, t, lam, mu = S.symbols('x y t lam mu', real=True)

# ---------- section 1: distance, midpoint, gradient ----------
def distance(key, level, A, Bp):
    dx, dy = Bp[0] - A[0], Bp[1] - A[1]; d2 = dx * dx + dy * dy
    d = sqrt(d2)
    add(key, level, 'Distance between two points', [f'Find the distance between A{pt(*A)} and B{pt(*Bp)}.'], [
        'Use d² = (x₂ − x₁)² + (y₂ − y₁)².',
        f'd² = ({n(Bp[0])} − {p(A[0])})² + ({n(Bp[1])} − {p(A[1])})²',
        f'd² = {p(dx)}² + {p(dy)}² = {n(dx*dx)} + {n(dy*dy)} = {n(d2)}',
        f'Answer: AB = √{n(d2)}' + (f' = {n(d)}.' if d != sqrt(d2) or d.is_Integer else '.')],
        [anim(3, f'd² = ({n(Bp[0])} − {p(A[0])})² + ({n(Bp[1])} − {p(A[1])})²', f'd² = {p(dx)}² + {p(dy)}²',
              [(f'({n(Bp[0])} − {p(A[0])})', p(dx)), (f'({n(Bp[1])} − {p(A[1])})', p(dy))], 'Do each subtraction in its bracket first. Then square the answers.')])
def midpoint(key, level, A, Bp):
    M = ((A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2)
    add(key, level, 'Midpoint of a line', [f'Find the midpoint of A{pt(*A)} and B{pt(*Bp)}.'], [
        'Add the x values and halve. Add the y values and halve.',
        f'x = ({n(A[0])} + {p(Bp[0])})/2 = {n(M[0])}',
        f'y = ({n(A[1])} + {p(Bp[1])})/2 = {n(M[1])}',
        f'Answer: M{pt(*M)}.'],
        [anim(2, f'A{pt(*A)}, B{pt(*Bp)}', f'x = ({n(A[0])} + {p(Bp[0])})/2', [(n(A[0]), n(A[0])), (n(Bp[0]), n(Bp[0]))], 'Take the two x values from the points. Add them, then halve.'),
         anim(3, f'A{pt(*A)}, B{pt(*Bp)}', f'y = ({n(A[1])} + {p(Bp[1])})/2', [(n(A[1]), n(A[1])), (n(Bp[1]), n(Bp[1]))], 'Take the two y values from the points. Add them, then halve.')])
def gradient(key, level, A, Bp):
    m = S.Rational(Bp[1] - A[1], Bp[0] - A[0])
    add(key, level, 'Gradient of a line', [f'Find the gradient of the line through A{pt(*A)} and B{pt(*Bp)}.'], [
        'Gradient = change in y ÷ change in x.',
        f'm = ({n(Bp[1])} − {p(A[1])})/({n(Bp[0])} − {p(A[0])})',
        f'm = {n(Bp[1]-A[1])}/{p(Bp[0]-A[0])} = {n(m)}',
        f'Answer: gradient = {n(m)}.'],
        [anim(2, f'A{pt(*A)}, B{pt(*Bp)}', f'm = ({n(Bp[1])} − {p(A[1])})/({n(Bp[0])} − {p(A[0])})', [(n(Bp[1]), n(Bp[1])), (n(A[1]), n(A[1])), (n(Bp[0]), n(Bp[0])), (n(A[0]), n(A[0]))], 'The top uses the y values. The bottom uses the x values. Keep B first in both.')])

distance('distance', 'Easy', (1, 2), (4, 6))
distance('distance', 'Easy', (-2, 3), (4, -5))
distance('distance', 'Medium', (-3, -1), (2, 4))
midpoint('distance', 'Easy', (2, 7), (8, -3))
midpoint('distance', 'Easy', (-4, 5), (6, 1))
gradient('distance', 'Easy', (-1, 4), (3, -2))
add('distance', 'Medium', 'Find the other end of a line', ['M(3, 1) is the midpoint of AB. A is (−2, 5). Find B.'], [
    'The midpoint is the average of the ends.', '(−2 + x)/2 = 3, so x = 8.', '(5 + y)/2 = 1, so y = −3.', 'Answer: B(8, −3).'])
# find k with distance 10
k = S.symbols('k', real=True)
ks = sorted(S.solve(S.Eq((k - 1) ** 2 + (8 - 2) ** 2, 100), k))
add('distance', 'Hard', 'Unknown coordinate from a distance', ['A is (1, 2) and B is (k, 8). AB = 10. Find the possible values of k.'], [
    'Square both sides of the distance rule: (k − 1)² + (8 − 2)² = 100.', '(k − 1)² + 36 = 100, so (k − 1)² = 64.', 'k − 1 = 8 or k − 1 = −8.', f'Answer: k = {n(ks[1])} or k = {n(ks[0])}.'])
def isosceles(key, A, Bp, C):
    sides = {'AB': (A, Bp), 'BC': (Bp, C), 'CA': (C, A)}
    sq2 = {k_: (v[1][0] - v[0][0]) ** 2 + (v[1][1] - v[0][1]) ** 2 for k_, v in sides.items()}
    equal = [k_ for k_ in sq2 if list(sq2.values()).count(sq2[k_]) == 2]
    assert len(equal) == 2, sq2
    add(key, 'Medium', 'Type of triangle', [f'A{pt(*A)}, B{pt(*Bp)} and C{pt(*C)} are vertices of a triangle. Show that it is isosceles.'], [
        'Find the square of each side length.'] + [f'{k_}² = {n(v)}' for k_, v in sq2.items()] + [
        f'{equal[0]} and {equal[1]} have the same length √{n(sq2[equal[0]])}.', 'Answer: two sides are equal, so the triangle is isosceles.'])
isosceles('distance', (1, 1), (5, 1), (3, 5))
# area of triangle
def area_tri(key, A, Bp, C):
    s = (A[0] * (Bp[1] - C[1]) + Bp[0] * (C[1] - A[1]) + C[0] * (A[1] - Bp[1])) / S.Integer(2)
    add(key, 'Hard', 'Area of a triangle', [f'Find the area of the triangle with vertices A{pt(*A)}, B{pt(*Bp)} and C{pt(*C)}.'], [
        'Use area = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|.',
        f'= ½|{n(A[0])}({n(Bp[1]-C[1])}) + {p(Bp[0])}({n(C[1]-A[1])}) + {p(C[0])}({n(A[1]-Bp[1])})|',
        f'= ½|{n(A[0]*(Bp[1]-C[1]))} + {p(Bp[0]*(C[1]-A[1]))} + {p(C[0]*(A[1]-Bp[1]))}| = ½|{n(2*s)}|',
        f'Answer: area = {n(abs(s))} square units.'])
area_tri('distance', (1, 1), (7, 3), (3, 6))

# ---------- section 2: straight lines ----------
def line_point_gradient(key, level, P, m):
    c = P[1] - m * P[0]
    add(key, level, 'Line from a point and a gradient', [f'Find the equation of the line through {pt(*P)} with gradient {n(m)}.'], [
        'Use y − y₁ = m(x − x₁).', f'y − {p(P[1])} = {n(m)}(x − {p(P[0])})',
        f'y = {poly([(m, "x"), (-m*P[0]+P[1], "")])}', f'Answer: {yline(m, c)}.'],
        [anim(2, f'{pt(*P)}, m = {n(m)}', f'y − {p(P[1])} = {n(m)}(x − {p(P[0])})', [(n(P[1]), n(P[1])), (n(m), n(m)), (n(P[0]), n(P[0]))], 'Put y₁ and x₁ from the point, and m from the gradient, into y − y₁ = m(x − x₁).')])
def line_two_points(key, level, A, Bp):
    m = S.Rational(Bp[1] - A[1], Bp[0] - A[0]); c = A[1] - m * A[0]
    add(key, level, 'Line through two points', [f'Find the equation of the line through A{pt(*A)} and B{pt(*Bp)}.'], [
        f'Gradient m = ({n(Bp[1])} − {p(A[1])})/({n(Bp[0])} − {p(A[0])}) = {n(m)}.',
        f'Use y − y₁ = m(x − x₁) with A: y − {p(A[1])} = {p(m)}(x − {p(A[0])}).', f'Answer: {yline(m, c)}.'])
line_point_gradient('lines', 'Easy', (2, 5), S.Integer(3))
line_point_gradient('lines', 'Easy', (-1, 4), S.Integer(-2))
line_point_gradient('lines', 'Medium', (4, -3), R(1, 2))
line_two_points('lines', 'Easy', (1, 3), (3, 9))
line_two_points('lines', 'Medium', (-2, 5), (4, -1))
line_two_points('lines', 'Medium', (0, 2), (6, 5))
def intercepts(key, a, b, c):
    m = S.Rational(-a, b); yi = S.Rational(-c, b); xi = S.Rational(-c, a)
    add(key, 'Medium', 'Gradient and intercepts from general form', [f'The line L has equation `{poly([(a,"x"),(b,"y"),(c,"")])} = 0`. Find its gradient and where it meets both axes.'], [
        f'Make y the subject: {poly([(b,"y")])} = {poly([(-a,"x"),(-c,"")])}.', f'{yline(m, yi)}, so the gradient is {n(m)}.',
        f'Put x = 0: y = {n(yi)}. Put y = 0: x = {n(xi)}.', f'Answer: gradient {n(m)}; meets the y axis at (0, {n(yi)}) and the x axis at ({n(xi)}, 0).'])
intercepts('lines', 2, 3, -12)
intercepts('lines', 3, -4, 24)
add('lines', 'Hard', 'Line in general form', ['Find the equation of the line through A(−1, 2) and B(3, −4) in the form `ax + by + c = 0`, where a, b and c are integers.'], [
    'Gradient = (−4 − 2)/(3 − (−1)) = −6/4 = −3/2.', 'y − 2 = −3/2(x + 1).', 'Multiply by 2: 2y − 4 = −3x − 3.', f'Answer: {general(3, 2, -1)}.'])
sol = S.solve([2 * x + 3 * y - 12, x - y - 1], [x, y])
add('lines', 'Hard', 'Where two lines meet', ['Find the point where `2x + 3y = 12` and `x − y = 1` meet.'], [
    'From the second equation, x = y + 1.', '2(y + 1) + 3y = 12.', '5y + 2 = 12, so y = 2.', f'x = 2 + 1 = 3.', f'Answer: ({n(sol[x])}, {n(sol[y])}). It works in both equations.'])

# ---------- section 3: parallel and perpendicular ----------
def parallel(key, level, m, c, P):
    c2 = P[1] - m * P[0]
    add(key, level, 'Parallel line', [f'Find the line through {pt(*P)} parallel to `{yline(m, c)}`.'], [
        f'Parallel lines have the same gradient: m = {n(m)}.', f'y − {p(P[1])} = {n(m)}(x − {p(P[0])}).', f'Answer: {yline(m, c2)}.'])
def perpendicular(key, level, m, c, P):
    m2 = -1 / S.nsimplify(m); c2 = P[1] - m2 * P[0]
    add(key, level, 'Perpendicular line', [f'Find the line through {pt(*P)} perpendicular to `{yline(m, c)}`.'], [
        f'The given gradient is {n(m)}. For perpendicular lines, m₁ × m₂ = −1.', f'New gradient = −1/{p(m)}' + (f' = {n(m2)}.' if n(m2) != f'−1/{p(m)}' else '.'),
        f'y − {p(P[1])} = {p(m2)}(x − {p(P[0])}).', f'Answer: {yline(m2, c2)}.'])
parallel('perp', 'Easy', S.Integer(2), S.Integer(1), (1, 7))
parallel('perp', 'Easy', S.Integer(-3), S.Integer(4), (2, -1))
perpendicular('perp', 'Easy', S.Integer(2), S.Integer(5), (4, 1))
perpendicular('perp', 'Medium', R(-3, 4), S.Integer(2), (-3, 6))
add('perp', 'Medium', 'Test for perpendicular lines', ['Show that `3y = x + 6` and `y = −3x + 2` are perpendicular.'], [
    '3y = x + 6 gives y = x/3 + 2, so m₁ = 1/3.', 'The second line has m₂ = −3.', 'm₁ × m₂ = 1/3 × (−3) = −1.', 'Answer: the product is −1, so the lines are perpendicular.'])
def perp_bisector(key, level, A, Bp):
    M = ((A[0] + Bp[0]) / S.Integer(2), (A[1] + Bp[1]) / S.Integer(2)); m = S.Rational(Bp[1] - A[1], Bp[0] - A[0])
    m2 = -1 / m; c = M[1] - m2 * M[0]
    add(key, level, 'Perpendicular bisector', [f'Find the perpendicular bisector of A{pt(*A)} and B{pt(*Bp)}.'], [
        f'Midpoint M = {pt(*M)}.', f'Gradient AB = {n(m)}, so the bisector has gradient {n(m2)}.',
        f'y − {p(M[1])} = {p(m2)}(x − {p(M[0])}).', f'Answer: {yline(m2, c)}.'])
perp_bisector('perp', 'Medium', (1, 2), (5, 4))
perp_bisector('perp', 'Medium', (-2, 1), (4, 5))
perp_bisector('perp', 'Hard', (0, 6), (6, 0))
# foot of perpendicular from a point to a line
def foot(key, P, m, c):
    m2 = -1 / S.nsimplify(m); c2 = P[1] - m2 * P[0]
    xf = S.Rational(c2 - c) / (m - m2); yf = m * xf + c
    add(key, 'Hard', 'Foot of a perpendicular', [f'Find the point on `{yline(m, c)}` that is closest to {pt(*P)}.'], [
        f'The shortest distance is along the perpendicular. Its gradient is {n(m2)}.', f'The perpendicular through {pt(*P)} is {yline(m2, c2)}.',
        f'Set the two y values equal: {poly([(m,"x"),(c,"")])} = {poly([(m2,"x"),(c2,"")])}.', f'x = {n(xf)}, y = {n(yf)}.', f'Answer: ({n(xf)}, {n(yf)}).'])
foot('perp', (6, 3), S.Integer(2), S.Integer(-1))
k = S.symbols('k')
add('perp', 'Hard', 'Unknown gradient condition', ['The lines `kx + 2y = 7` and `3x − y = 4` are perpendicular. Find k.'], [
    'First line: y = −kx/2 + 7/2, so m₁ = −k/2.', 'Second line: y = 3x − 4, so m₂ = 3.', 'm₁ × m₂ = −1 gives (−k/2) × 3 = −1.', '−3k/2 = −1, so k = 2/3.', 'Answer: k = 2/3.'])

# ---------- section 4: equation of a circle ----------
def circle_cr(key, level, C, r):
    add(key, level, 'Circle from centre and radius', [f'Write the equation of the circle with centre {pt(*C)} and radius {n(r)}.'], [
        'Use (x − a)² + (y − b)² = r².', f'a = {n(C[0])}, b = {n(C[1])}, r² = {n(r*r)}.', f'Answer: {circle(C[0], C[1], r*r)}.'])
def circle_complete(key, level, C, r2):
    a, b = C; gen = circle_general(a, b, r2)
    add(key, level, 'Centre and radius from general form', [f'Find the centre and radius of the circle `{gen}`.'], [
        'Group x terms and y terms, then complete each square.',
        f'{sq("x", a)} − {n(a*a)} + {sq("y", b)} − {n(b*b)} + {n(a*a+b*b-r2)} = 0'.replace('− 0 ', '').replace('+ −', '− '),
        f'{circle(a, b, r2)}', f'Answer: centre {pt(a, b)}; radius {simp_root(r2)}.'])
def circle_diameter(key, level, A, Bp):
    C = ((A[0] + Bp[0]) / S.Integer(2), (A[1] + Bp[1]) / S.Integer(2)); r2 = ((A[0]-Bp[0])**2 + (A[1]-Bp[1])**2) / S.Integer(4)
    add(key, level, 'Circle on a diameter', [f'A{pt(*A)} and B{pt(*Bp)} are the ends of a diameter. Find the equation of the circle.'], [
        f'The centre is the midpoint of AB: {pt(*C)}.', f'r² = (distance from the centre to A)² = ({n(A[0])} − {p(C[0])})² + ({n(A[1])} − {p(C[1])})² = {n(r2)}.', f'Answer: {circle(C[0], C[1], r2)}.'])
circle_cr('circle', 'Easy', (0, 0), S.Integer(5))
circle_cr('circle', 'Easy', (3, -2), S.Integer(4))
circle_complete('circle', 'Medium', (2, 3), S.Integer(16))
circle_complete('circle', 'Medium', (-1, 4), S.Integer(9))
circle_complete('circle', 'Hard', (3, -5), S.Integer(12))
circle_diameter('circle', 'Medium', (-7, 3), (1, 9))
circle_diameter('circle', 'Medium', (2, 1), (8, 9))
r2 = (4 - 1) ** 2 + (6 - 2) ** 2
add('circle', 'Medium', 'Circle through a point', ['A circle has centre (1, 2) and passes through (4, 6). Find its equation.'], [
    'The radius is the distance from the centre to (4, 6).', f'r² = (4 − 1)² + (6 − 2)² = 9 + 16 = {r2}.', f'Answer: {circle(1, 2, r2)}.'])
add('circle', 'Hard', 'Is a point inside the circle?', ['The circle is `(x − 2)² + (y + 1)² = 25`. State whether (5, 3), (6, 2) and (1, 1) are inside, on or outside it.'], [
    'Work out (x − 2)² + (y + 1)² for each point and compare it with 25.', '(5, 3): 9 + 16 = 25, so it is on the circle.', '(6, 2): 16 + 9 = 25, so it is on the circle.', '(1, 1): 1 + 4 = 5, which is less than 25, so it is inside the circle.', 'Answer: (5, 3) and (6, 2) are on the circle; (1, 1) is inside.'])
add('circle', 'Hard', 'Unknown in a circle equation', ['The circle `x² + y² − 6x + 4y + k = 0` has radius 5. Find k.'], [
    'Complete the squares: (x − 3)² + (y + 2)² = 13 − k.', 'The right side is r² = 25.', '13 − k = 25, so k = −12.', 'Answer: k = −12.'])

# ---------- section 5: circles and lines ----------
def tangent(key, level, C, Pp, r2, normal=False):
    mcp = S.Rational(Pp[1] - C[1], Pp[0] - C[0]); mt = -1 / mcp; c = Pp[1] - mt * Pp[0]
    if normal:
        c = Pp[1] - mcp * Pp[0]
        add(key, level, 'Normal to a circle', [f'The circle is `{circle(C[0], C[1], r2)}`. Find the normal at {pt(*Pp)}.'], [
            f'The centre is {pt(*C)}. A normal to a circle passes through the centre.', f'Gradient = ({n(Pp[1])} − {p(C[1])})/({n(Pp[0])} − {p(C[0])}) = {n(mcp)}.', f'Answer: {yline(mcp, c)}.'])
        return
    add(key, level, 'Tangent to a circle', [f'The circle is `{circle(C[0], C[1], r2)}`. Find the tangent at {pt(*Pp)}.'], [
        f'The centre is C{pt(*C)}. Check: ({n(Pp[0])} − {p(C[0])})² + ({n(Pp[1])} − {p(C[1])})² = {n(r2)}.',
        f'Gradient of the radius CP = {n(mcp)}.', f'The tangent is perpendicular to the radius: m = −1/' + (f'({n(mcp)})' if S.nsimplify(mcp).q != 1 or mcp < 0 else n(mcp)) + f' = {n(mt)}.',
        f'y − {p(Pp[1])} = {p(mt)}(x − {p(Pp[0])}).', f'Answer: {yline(mt, c)}.'])
tangent('circle-line', 'Medium', (0, 0), (3, 4), S.Integer(25))
tangent('circle-line', 'Medium', (1, 2), (4, 6), S.Integer(25))
tangent('circle-line', 'Hard', (2, -1), (5, 3), S.Integer(25))
tangent('circle-line', 'Medium', (1, 2), (4, 6), S.Integer(25), normal=True)
def line_meets_circle(key, level, C, r2, m, c):
    expr = sp = S.expand((x - C[0]) ** 2 + (m * x + c - C[1]) ** 2 - r2); xs = sorted(S.solve(expr, x))
    pts = [(xv, m * xv + c) for xv in xs]
    q = S.Poly(expr, x).all_coeffs()
    add(key, level, 'Where a line meets a circle', [f'Find where `{yline(m, c)}` meets the circle `{circle(C[0], C[1], r2)}`.'], [
        f'Replace y: {sq("x", C[0])} + ({poly([(m,"x"),(c-C[1],"")])})² = {n(r2)}.', f'Expand: {poly([(q[0],"x²"),(q[1],"x"),(q[2],"")])} = 0.',
        'Factorise or use the quadratic formula.', f'x = {" or x = ".join(n(v) for v in xs)}.', 'Use y from the line.', 'Answer: ' + ' and '.join(pt(*pp) for pp in pts) + '.'])
line_meets_circle('circle-line', 'Medium', (0, 0), S.Integer(25), S.Integer(1), S.Integer(1))
line_meets_circle('circle-line', 'Hard', (1, 1), S.Integer(10), S.Integer(2), S.Integer(-1))
def count_points(key):
    add(key, 'Medium', 'How many intersections?', ['Use the discriminant to say how many points the line `y = x + 6` has in common with the circle `x² + y² = 16`.'], [
        'Replace y: x² + (x + 6)² = 16.', '2x² + 12x + 20 = 0, so x² + 6x + 10 = 0.', 'b² − 4ac = 36 − 40 = −4.', 'The discriminant is negative, so there are no real solutions.', 'Answer: the line does not meet the circle.'])
count_points('circle-line')
add('circle-line', 'Hard', 'Tangent condition', ['The line `y = x + k` is a tangent to the circle `x² + y² = 8`. Find the values of k.'], [
    'Replace y: x² + (x + k)² = 8.', '2x² + 2kx + k² − 8 = 0.', 'A tangent touches once, so b² − 4ac = 0.', '(2k)² − 4(2)(k² − 8) = 0.', '4k² − 8k² + 64 = 0, so k² = 16.', 'Answer: k = 4 or k = −4.'])
add('circle-line', 'Hard', 'Length of a tangent', ['T is the point (7, 1). Find the length of the tangent from T to the circle `x² + y² = 25`.'], [
    'The radius to the point of contact is perpendicular to the tangent, so Pythagoras applies.', 'OT² = 7² + 1² = 50.', 'Tangent² = OT² − r² = 50 − 25 = 25.', 'Answer: the tangent length is 5.'])
add('circle-line', 'Medium', 'Tangent from the circle equation', ['Show that (−3, 4) is on the circle `x² + y² = 25` and find the tangent there.'], [
    '(−3)² + 4² = 9 + 16 = 25, so the point is on the circle.', 'Radius gradient = 4/(−3) = −4/3.', 'Tangent gradient = 3/4.', 'y − 4 = 3/4(x + 3).', 'Answer: y = 3x/4 + 25/4, or 3x − 4y + 25 = 0.'])

# ---------- section 6: vectors in two and three dimensions ----------
def magnitude(key, level, v):
    sqv = sum(c * c for c in v)
    add(key, level, 'Magnitude of a vector', [f'Find |a| when a = {vec(v)}.'], [
        'Use |a| = √(sum of the squared components).', 'The size is √(' + ' + '.join(f'{p(c)}²' for c in v) + ').', f'= √({" + ".join(n(c*c) for c in v)}) = √{n(sqv)}', f'Answer: |a| = {simp_root(sqv)}.'],
        [anim(2, f'a = {pt(*v)}', 'The size is √(' + ' + '.join(f'{p(c)}²' for c in v) + ')', [(n(c), p(c)) for c in v], 'Square every component, then add. The size is the square root of the total.')])
magnitude('vectors', 'Easy', (3, 4)); magnitude('vectors', 'Easy', (-5, 12)); magnitude('vectors', 'Medium', (2, -3, 6))
def combine(key, level, a, b, ca, cb):
    r = tuple(ca * u + cb * w for u, w in zip(a, b))
    add(key, level, 'Add and scale vectors', [f'a = {vec(a)} and b = {vec(b)}. Find {n(ca) if ca != 1 else ""}a {"+" if cb > 0 else "−"} {n(abs(cb)) if abs(cb) != 1 else ""}b.'], [
        'Work with each component separately.', ' ; '.join(f'{s}: {n(ca)}({n(u)}) {"+" if cb > 0 else "−"} {n(abs(cb))}({n(w)}) = {n(c)}' for s, u, w, c in zip('ijk', a, b, r)), f'Answer: {vec(r)}.'])
combine('vectors', 'Easy', (2, 3), (4, -1), 2, 1)
combine('vectors', 'Medium', (1, -2, 3), (4, 0, -1), 3, -2)
def unit(key, level, v):
    m = sqrt(sum(c * c for c in v))
    add(key, level, 'Unit vector', [f'Find the unit vector in the direction of {vec(v)}.'], [
        'A unit vector has size 1. Divide the vector by its size.', f'Size = √({" + ".join(n(c*c) for c in v)}) = {n(m)}.', f'Answer: ({vec(v)})/{n(m)}, which is ' + vec(tuple(S.nsimplify(c) / m for c in v)) + '.'])
unit('vectors', 'Medium', (6, 8)); unit('vectors', 'Medium', (2, -1, 2))
add('vectors', 'Medium', 'Parallel vectors', ['a = 2i + 3j − k and b = 6i + pj − 3k are parallel. Find p.'], [
    'Parallel vectors are multiples of each other.', 'b = 3a because 6 = 3 × 2 and −3 = 3 × (−1).', 'p = 3 × 3 = 9.', 'Answer: p = 9.'])
add('vectors', 'Medium', 'Vector of a given size', ['Find the vector of magnitude 10 that is parallel to 3i + 4j.'], [
    '|3i + 4j| = √(9 + 16) = 5.', 'The unit vector is (3i + 4j)/5.', 'Multiply by 10: 10/5 = 2.', 'Answer: 6i + 8j (or −6i − 8j in the opposite direction).'])
add('vectors', 'Hard', 'Unknown component from a magnitude', ['Find the values of p for which |pi + 2j − 2k| = 6.'], [
    'Square the size: p² + 2² + (−2)² = 36.', 'p² + 8 = 36, so p² = 28.', 'p = ±√28 = ±2√7.', 'Answer: p = 2√7 or p = −2√7.'])

# ---------- section 7: position vectors ----------
def ab_vec(key, level, a, b, name_a='A', name_b='B'):
    d = tuple(w - u for u, w in zip(a, b)); l = sqrt(sum(c * c for c in d))
    add(key, level, 'Vector between two points', [f'OA = {vec(a)} and OB = {vec(b)}. Find AB and |AB|.'], [
        'AB = OB − OA. Go from A back to O, then on to B.', f'AB = ({vec(b)}) − ({vec(a)})', f'AB = {vec(d)}', f'|AB| = √({" + ".join(n(c*c) for c in d)}) = {n(l)}', f'Answer: AB = {vec(d)}; |AB| = {n(l)}.'],
        [anim(2, f'OA = {vec(a)}; OB = {vec(b)}', f'AB = ({vec(b)}) − ({vec(a)})', [(vec(b), vec(b)), (vec(a), vec(a))], 'AB means B minus A: end point first, then take away the start point.')])
ab_vec('position', 'Easy', (1, 2), (4, 6)); ab_vec('position', 'Medium', (2, -1, 3), (5, 3, 3))
def section_point(key, level, a, b, m, n_):
    pv = tuple((n_ * u + m * w) / S.Integer(m + n_) for u, w in zip(a, b))
    add(key, level, 'Dividing a line in a ratio', [f'OA = {vec(a)}, OB = {vec(b)}. P divides AB in the ratio {m} : {n_}. Find OP.'], [
        f'AP : PB = {m} : {n_}, so AP = {m}/{m+n_} of AB.', 'Use OP = OA + (m/(m + n))AB, or OP = (n·OA + m·OB)/(m + n).', f'OP = ({n_}({vec(a)}) + {m}({vec(b)}))/{m+n_}', f'Answer: OP = {vec(pv)}.'])
section_point('position', 'Medium', (1, 2), (7, 8), 1, 2)
section_point('position', 'Medium', (2, -1, 4), (8, 5, -2), 2, 1)
section_point('position', 'Hard', (-3, 1, 2), (7, 11, -3), 3, 2)
add('position', 'Easy', 'Midpoint using vectors', ['OA = 4i − 2j + 6k and OB = 2i + 8j − 2k. Find the position vector of the midpoint of AB.'], [
    'Midpoint = (OA + OB)/2.', '(4 + 2)/2 = 3, (−2 + 8)/2 = 3, (6 − 2)/2 = 2.', 'Answer: 3i + 3j + 2k.'])
add('position', 'Hard', 'External division', ['OA = 2i + j and OB = 5i + 4j. P lies on AB extended beyond B so that AP = 3AB. Find OP.'], [
    'AB = OB − OA = 3i + 3j.', 'AP = 3AB = 9i + 9j.', 'OP = OA + AP = (2i + j) + (9i + 9j)', 'Answer: OP = 11i + 10j.'])
add('position', 'Medium', 'Collinear points', ['A(1, 2, 3), B(3, 6, 7) and C(6, 12, 13) are three points. Show that they are collinear.'], [
    'AB = (3 − 1, 6 − 2, 7 − 3) = (2, 4, 4).', 'BC = (6 − 3, 12 − 6, 13 − 7) = (3, 6, 6).', 'BC = 3/2 × AB, so the vectors are parallel.', 'They share the point B.', 'Answer: A, B and C lie on one straight line.'])
add('position', 'Hard', 'Parallelogram', ['ABCD is a parallelogram with A(1, 1), B(5, 2) and C(6, 6). Find D.'], [
    'In a parallelogram, AD = BC.', 'BC = (6 − 5, 6 − 2) = (1, 4).', 'OD = OA + BC = (1, 1) + (1, 4)', 'Answer: D(2, 5).'])
add('position', 'Medium', 'Show a triangle is right-angled', ['A(1, 1), B(4, 2) and C(0, 4). Find AB and AC and show that angle BAC is a right angle.'], [
    'AB = (3, 1) and AC = (−1, 3).', 'AB · AC = 3(−1) + 1(3) = 0.', 'Answer: the dot product is zero, so angle BAC = 90°.'])

# ---------- section 8: scalar product ----------
def dot(key, level, a, b):
    d = sum(u * w for u, w in zip(a, b))
    add(key, level, 'Scalar product', [f'Find a · b when a = {vec(a)} and b = {vec(b)}.'], [
        'Multiply matching components and add.', ' + '.join(f'({n(u)})({n(w)})' for u, w in zip(a, b)), f'= {" + ".join(p(u*w) for u, w in zip(a, b))}', f'Answer: a · b = {n(d)}.'],
        [anim(2, f'a = {pt(*a)}; b = {pt(*b)}', ' + '.join(f'({n(u)})({n(w)})' for u, w in zip(a, b)), [(n(c), n(c)) for pair in zip(a, b) for c in pair], 'Pair the i parts, the j parts and the k parts. Multiply each pair.')])
dot('scalar', 'Easy', (2, 3), (4, -1)); dot('scalar', 'Easy', (1, -2, 3), (4, 5, 2))
def angle(key, level, a, b):
    d = sum(u * w for u, w in zip(a, b)); ma = sqrt(sum(c * c for c in a)); mb = sqrt(sum(c * c for c in b)); cs = S.nsimplify(d) / (ma * mb)
    th = math.acos(float(cs))
    add(key, level, 'Angle between two vectors', [f'Find the angle between {vec(a)} and {vec(b)}.'], [
        'Use cos θ = (a · b)/(|a||b|).', f'a · b = {n(d)}.', f'|a| = {n(ma)} and |b| = {n(mb)}.', f'cos θ = {n(d)}/({n(ma)} × {n(mb)}) = {float(cs):.4f}'.replace('-', '−'), f'Answer: θ = {deg(th)}.'])
angle('scalar', 'Medium', (3, 4), (5, -12)); angle('scalar', 'Medium', (1, 2, 2), (2, -3, 6)); angle('scalar', 'Hard', (2, -1, 1), (1, 3, -2))
add('scalar', 'Medium', 'Perpendicular vectors', ['a = 3i + pj − 2k and b = 2i − j + 4k are perpendicular. Find p.'], [
    'Perpendicular vectors have scalar product 0.', '3(2) + p(−1) + (−2)(4) = 0', '6 − p − 8 = 0, so p = −2.', 'Answer: p = −2.'])
add('scalar', 'Hard', 'Perpendicular with an unknown in two places', ['a = qi + 2j + k and b = qi − 5j + 2k are perpendicular. Find the values of q.'], [
    'a · b = 0.', 'q(q) + 2(−5) + 1(2) = 0', 'q² − 10 + 2 = 0, so q² = 8.', 'Answer: q = 2√2 or q = −2√2.'])
def tri_angle(key, A, Bp, C):
    BA = tuple(u - w for u, w in zip(A, Bp)); BC = tuple(u - w for u, w in zip(C, Bp))
    d = sum(u * w for u, w in zip(BA, BC)); ma = sqrt(sum(c * c for c in BA)); mc = sqrt(sum(c * c for c in BC)); cs = d / (ma * mc)
    add(key, 'Hard', 'Angle in a triangle', [f'A{pt(*A)}, B{pt(*Bp)} and C{pt(*C)}. Find angle ABC.'], [
        'Angle ABC is between BA and BC, both starting at B.', f'BA = {vec(BA)} and BC = {vec(BC)}.', f'BA · BC = {n(d)}; |BA| = {n(ma)}; |BC| = {n(mc)}.', f'cos ABC = {n(d)}/({n(ma)} × {n(mc)}) = {float(cs):.4f}'.replace('-', '−'), f'Answer: angle ABC = {deg(math.acos(float(cs)))}.'])
tri_angle('scalar', (1, 2, 3), (2, 0, 1), (4, 1, 5))
add('scalar', 'Medium', 'Component along a direction', ['Find the component of a = 3i + 4j in the direction of b = 5i + 12j.'], [
    'Component of a along b = (a · b)/|b|.', 'a · b = 15 + 48 = 63; |b| = 13.', 'Answer: 63/13.'])
add('scalar', 'Medium', 'Angle with an axis', ['Find the angle between the vector 2i + 2j + k and the x axis (the vector i).'], [
    'Use cos θ = (a · i)/(|a||i|).', 'a · i = 2; |a| = 3; |i| = 1.', f'cos θ = 2/3 = 0.6667', f'Answer: θ = {deg(math.acos(2/3))}.'])

# ---------- section 9: vector equation of a line ----------
def line_pd(key, level, a, d):
    add(key, level, 'Line from a point and a direction', [f'Write the vector equation of the line through A{pt(*a)} parallel to {vec(d)}.'], [
        'Use r = a + λd: a is a point on the line, d is the direction.', f'a = {vec(a)}', f'Answer: r = {vec(a)} + λ({vec(d)}).'])
def line_two(key, level, a, b):
    d = tuple(w - u for u, w in zip(a, b))
    add(key, level, 'Line through two points', [f'Find a vector equation of the line through A{pt(*a)} and B{pt(*b)}.'], [
        f'Direction = AB = OB − OA = {vec(d)}.', f'Use A as the point on the line.', f'Answer: r = {vec(a)} + λ({vec(d)}).'])
line_pd('vline', 'Easy', (1, 2), (3, 4)); line_pd('vline', 'Easy', (2, -1, 5), (1, 0, -2))
line_two('vline', 'Easy', (1, 3), (4, 7)); line_two('vline', 'Medium', (2, 0, -1), (5, 3, 4))
def on_line(key, level, a, d, Pp, on=True):
    lam_vals = []
    for u, dd, w in zip(a, d, Pp):
        lam_vals.append(S.Rational(w - u, dd) if dd != 0 else None)
    consistent = all(v == lam_vals[0] for v in lam_vals if v is not None) if on else False
    add(key, level, 'Does a point lie on a line?', [f'The line is r = {vec(a)} + λ({vec(d)}). Does the point P{pt(*Pp)} lie on it?'], [
        'Put OP equal to the line and find λ from each component.'] + [f'{s}: {poly([(u, ""), (dd, "λ")])} = {n(w)}, so λ = {n(v)}.' for s, u, dd, w, v in zip('ijk', a, d, Pp, lam_vals) if v is not None] + [
        'Answer: ' + ('the λ values agree, so P is on the line.' if consistent else 'the λ values are different, so P is not on the line.')])
on_line('vline', 'Medium', (1, 2, 3), (2, 1, -1), (5, 4, 1)); on_line('vline', 'Medium', (1, 2, 3), (2, 1, -1), (5, 4, 2), on=False)
add('vline', 'Medium', 'Cartesian form of a line', ['Write r = (1, −2, 3) + λ(2, 3, −1) in Cartesian form.'], [
    'Components: x = 1 + 2λ, y = −2 + 3λ, z = 3 − λ.', 'Make λ the subject of each: λ = (x − 1)/2, λ = (y + 2)/3, λ = (z − 3)/(−1).', 'Answer: (x − 1)/2 = (y + 2)/3 = (z − 3)/(−1).'])
add('vline', 'Hard', 'Point on a line with a condition', ['Line l: r = (2, 1, 0) + λ(1, 2, −1). Find the point on l where the x-coordinate is 5.'], [
    'The x-coordinate is 2 + λ.', '2 + λ = 5, so λ = 3.', 'y = 1 + 2(3) = 7; z = 0 − 3 = −3.', 'Answer: (5, 7, −3).'])
add('vline', 'Hard', 'Are two lines perpendicular?', ['l₁: r = (1, 0, 2) + λ(2, −1, 3) and l₂: r = (0, 4, 1) + μ(1, 5, 1). Show their directions are perpendicular.'], [
    'Directions: d₁ = (2, −1, 3), d₂ = (1, 5, 1).', 'd₁ · d₂ = 2(1) + (−1)(5) + 3(1) = 2 − 5 + 3 = 0.', 'Answer: the directions are perpendicular.'])
th = math.acos(float(S.Rational(2 * 1 + 1 * 2 + 0, 1) / (sqrt(5) * sqrt(5))))
add('vline', 'Hard', 'Angle between two lines', ['l₁ has direction 2i + j and l₂ has direction i + 2j. Find the acute angle between the lines.'], [
    'The angle between the lines is the angle between their directions.', 'd₁ · d₂ = 2(1) + 1(2) = 4; |d₁| = |d₂| = √5.', 'cos θ = 4/5 = 0.8', f'Answer: θ = {deg(math.acos(0.8))}.'])

# ---------- section 10: intersections, skew lines and distance ----------
def intersect(key, level, a, d, b, e):
    sol = S.solve([a[i] + lam * d[i] - b[i] - mu * e[i] for i in range(2)], [lam, mu], dict=True)[0]
    third_ok = (a[2] + sol[lam] * d[2] - b[2] - sol[mu] * e[2]) == 0
    assert third_ok
    pt3 = tuple(a[i] + sol[lam] * d[i] for i in range(3))
    add(key, level, 'Intersection of two lines', [f'l₁: r = {pt(*a)} + λ{pt(*d)} and l₂: r = {pt(*b)} + μ{pt(*e)}. Show that they meet and find the point.'], [
        'Equate the i, j, k parts.', f'i: {poly([(a[0], ""), (d[0], "λ")])} = {poly([(b[0], ""), (e[0], "μ")])}', f'j: {poly([(a[1], ""), (d[1], "λ")])} = {poly([(b[1], ""), (e[1], "μ")])}',
        f'Solve the first two: λ = {n(sol[lam])}, μ = {n(sol[mu])}.', f'k check: {p(a[2])} + {p(d[2])}({n(sol[lam])}) = {n(a[2] + sol[lam]*d[2])} and {p(b[2])} + {p(e[2])}({n(sol[mu])}) = {n(b[2]+sol[mu]*e[2])}. They match.', f'Answer: the lines meet at {pt(*pt3)}.'])
def skew(key, level, a, d, b, e):
    sol = S.solve([a[i] + lam * d[i] - b[i] - mu * e[i] for i in range(2)], [lam, mu], dict=True)[0]
    l3 = a[2] + sol[lam] * d[2]; r3 = b[2] + sol[mu] * e[2]; assert l3 != r3
    add(key, level, 'Skew lines', [f'l₁: r = {pt(*a)} + λ{pt(*d)} and l₂: r = {pt(*b)} + μ{pt(*e)}. Show that they do not meet.'], [
        'The directions are not parallel, so check whether the lines meet.', f'Solve the i and j equations: λ = {n(sol[lam])}, μ = {n(sol[mu])}.',
        f'k with λ: {n(l3)}. k with μ: {n(r3)}.', 'Answer: the k values differ, so the lines do not meet. They are not parallel, so they are skew.'])
# choose meeting point (3, 4, 5): l1 from (1,2,1) dir (1,1,2) at λ=2; l2 from (6,1,4) dir (3,-3,1)... build l2 through meeting point
def build(m_pt, d1, d2, l, m_):
    a = tuple(m_pt[i] - l * d1[i] for i in range(3)); b = tuple(m_pt[i] - m_ * d2[i] for i in range(3)); return a, b
a, b = build((3, 4, 5), (1, 1, 2), (2, -1, 1), 2, 1); intersect('lintersect', 'Medium', a, (1, 1, 2), b, (2, -1, 1))
a, b = build((2, -1, 4), (1, 2, -1), (3, 1, 2), 1, 2); intersect('lintersect', 'Medium', a, (1, 2, -1), b, (3, 1, 2))
a, b = build((0, 5, -2), (2, 1, 3), (1, -1, 4), 3, 2); intersect('lintersect', 'Hard', a, (2, 1, 3), b, (1, -1, 4))
a, b = build((4, 1, 0), (1, -1, 2), (0, 1, 3), 1, 1); intersect('lintersect', 'Medium', a, (1, -1, 2), b, (0, 1, 3))
skew('lintersect', 'Hard', (1, 2, 3), (1, 1, 2), (4, 1, 0), (2, -1, 1))
skew('lintersect', 'Hard', (0, 0, 1), (1, 2, 0), (1, 0, 5), (0, 1, 1))
add('lintersect', 'Medium', 'Parallel lines', ['l₁: r = (1, 2, 3) + λ(2, 4, −2) and l₂: r = (0, 1, 1) + μ(−1, −2, 1). Are the lines parallel? Do they meet?'], [
    'd₁ = (2, 4, −2) and d₂ = (−1, −2, 1).', 'd₁ = −2d₂, so the lines are parallel.', 'Does (0, 1, 1) lie on l₁? i: 1 + 2λ = 0 gives λ = −1/2; j: 2 + 4λ = 1 gives λ = −1/4.', 'The λ values differ, so the point is not on l₁.', 'Answer: the lines are parallel and distinct, so they never meet.'])
def dist_point_line(key, level, a, d, Pp):
    ap = tuple(w - u for u, w in zip(a, Pp)); lamv = S.Rational(sum(u * w for u, w in zip(ap, d)), sum(c * c for c in d))
    F = tuple(u + lamv * dd for u, dd in zip(a, d)); PF = tuple(f - w for f, w in zip(F, Pp)); dist = sqrt(sum(c * c for c in PF))
    add(key, level, 'Shortest distance from a point to a line', [f'Find the shortest distance from P{pt(*Pp)} to the line r = {pt(*a)} + λ{pt(*d)}.'], [
        'A general point on the line is F = ' + pt(*[poly([(u, ''), (dd, 'λ')]) for u, dd in zip(a, d)]) + '.',
        f'PF = ' + pt(*[poly([(u - w, ''), (dd, 'λ')]) for u, dd, w in zip(a, d, Pp)]) + '.',
        f'The shortest distance has PF perpendicular to d: PF · d = 0.', f'This gives λ = {n(lamv)}, so F = {pt(*F)} and PF = {pt(*PF)}.', f'Answer: shortest distance = |PF| = {n(dist)}.'])
dist_point_line('lintersect', 'Hard', (1, 2, 3), (1, 1, 1), (4, 0, 1))
dist_point_line('lintersect', 'Hard', (2, 0, 1), (0, 1, 1), (5, 2, 5))
add('lintersect', 'Hard', 'Angle at an intersection', ['Lines with directions (1, 2, 2) and (2, −1, 2) meet at a point. Find the acute angle between them.'], [
    'The angle between the lines is the angle between their directions.', 'd₁ · d₂ = 2 − 2 + 4 = 4; |d₁| = 3; |d₂| = 3.', 'cos θ = 4/9 = 0.4444', f'Answer: θ = {deg(math.acos(4/9))}.'])

# ---------- section 11: mixed revision ----------
distance('mixed', 'Easy', (0, -1), (5, 11)); midpoint('mixed', 'Easy', (3, 3), (-1, 9)); line_two_points('mixed', 'Medium', (2, 3), (6, 11))
perp_bisector('mixed', 'Medium', (-1, 0), (3, 2)); circle_diameter('mixed', 'Medium', (-1, 1), (5, 9))
tangent('mixed', 'Hard', (3, 1), (7, 4), S.Integer(25)); section_point('mixed', 'Medium', (0, 3, 1), (6, 9, 7), 1, 2)
angle('mixed', 'Medium', (2, 1, -2), (3, 0, 4)); line_two('mixed', 'Medium', (1, 1, 1), (3, 0, 4))
a, b = build((1, 3, 2), (2, 1, -1), (1, 2, 0), 2, 3); intersect('mixed', 'Hard', a, (2, 1, -1), b, (1, 2, 0))

# ---------- verify and write ----------
for key, items in B.items():
    assert len(items) == 10, (key, len(items))
    for q in items:
        assert not re.search(r'\.\.\.|\bNone\b', json.dumps(q, ensure_ascii=False)), q
OUT.write_text(json.dumps(B, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print({k: len(v) for k, v in B.items()})
