"""Generate Lower 6 Pure Mathematics: Series and Sequences practice (10 per section).

Every answer is computed with SymPy from the chosen numbers, so no result is typed by hand.
Questions are original practice written to the Form 5 scope; none is copied from a paper.
Run: python3 scripts/generateLower6SeriesPractice.py
"""
import json, re, math
import sympy as S
from sympy import Rational as R, sqrt
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'src/features/courses/a-level/lower-6/pure-mathematics/seriesPracticeBank.json'
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

# ---------- helpers for series ----------
SUB = str.maketrans('0123456789n+-', '₀₁₂₃₄₅₆₇₈₉ₙ₊₋')
def sub(k): return str(k).translate(SUB)
def u(k): return 'u' + sub(k)
def Sn(k): return 'S' + sub(k)
def rat(x): return S.nsimplify(x)
def dec(x, places=2):
    return f'{float(x):.{places}f}'.replace('-', '−')
nn = S.Symbol('n', integer=True, positive=True)
r_, k_ = S.symbols('r k', integer=True, positive=True)
xs = S.Symbol('x')
def dv(x):
    t = n(x)
    return f'({t})' if '/' in t or ' ' in t else t
SUP = str.maketrans('0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')
def xk(k): return '' if k == 0 else 'x' if k == 1 else 'x' + str(k).translate(SUP)
def cx(c):
    c = S.nsimplify(c)
    return 'x' if c == 1 else '−x' if c == -1 else f'{n(c)}x'
def lin(a, b):  # (a + bx) as text
    return f'({n(a)} {"+" if b > 0 else "−"} {cx(abs(b))})'
def pw(base, expo): return f'{base}^({expo})'

# ---------- section 1: sequences and notation ----------
def terms_from_formula(key, level, text, fn, count=4):
    vals = [fn(i) for i in range(1, count + 1)]
    add(key, level, 'Terms from a formula', [f'A sequence has `{text}`. Find the first {count} terms.'], [
        'Put n = 1, 2, 3, … into the formula.'] + [f'{u(i)} = {n(v)}' for i, v in enumerate(vals, 1)] + [f'Answer: {", ".join(n(v) for v in vals)}.'])
terms_from_formula('sequences', 'Easy', 'uₙ = 3n − 2', lambda i: 3 * i - 2)
terms_from_formula('sequences', 'Easy', 'uₙ = n² + 1', lambda i: i * i + 1)
add('sequences', 'Medium', 'Which term?', ['A sequence has `uₙ = 4n − 3`. Which term equals 61?'], [
    'Put uₙ = 61: 4n − 3 = 61.', '4n = 64, so n = 16.', 'n must be a positive whole number. 16 is.', 'Answer: the 16th term.'],
    [anim(1, 'uₙ = 4n − 3; uₙ = 61', '4n − 3 = 61', [('4', '4'), ('3', '3'), ('61', '61')], 'Put the target value in place of uₙ and solve for n.')])
add('sequences', 'Medium', 'Is a number in the sequence?', ['A sequence has `uₙ = n² + 3n`. Is 130 a term? Is 100 a term?'], [
    'Solve n² + 3n = 130, which is n² + 3n − 130 = 0.', '(n − 10)(n + 13) = 0, so n = 10 or n = −13.', 'n = 10 is a positive whole number, so 130 is the 10th term.', 'Now n² + 3n = 100 gives n² + 3n − 100 = 0.', 'The discriminant is 9 + 400 = 409, which is not a perfect square, so n is not a whole number.', 'Answer: 130 is a term (the 10th). 100 is not a term.'])
vals = [2]
for _ in range(3): vals.append(3 * vals[-1] - 1)
add('sequences', 'Medium', 'Terms from a recurrence', ['A sequence has `u₁ = 2` and `uₙ₊₁ = 3uₙ − 1`. Find u₂, u₃ and u₄.'], [
    'Each term is found from the one before it.'] + [f'{u(i + 1)} = 3({vals[i - 1]}) − 1 = {vals[i]}' for i in range(1, 4)] + [f'Answer: {vals[1]}, {vals[2]}, {vals[3]}.'],
    [anim(2, 'u₁ = 2; uₙ₊₁ = 3uₙ − 1', f'u₂ = 3(2) − 1', [('2', '2'), ('3', '3'), ('1', '1')][:2], 'Replace uₙ by the last term to get the next one.')])
add('sequences', 'Easy', 'Find a formula', ['Find a formula for the nth term of 5, 8, 11, 14, …'], [
    'The terms go up by 3 each time.', 'So the formula starts with 3n: 3(1) = 3, but u₁ = 5, so we add 2.', 'Check: u₂ = 3(2) + 2 = 8 and u₃ = 3(3) + 2 = 11.', 'Answer: uₙ = 3n + 2.'])
add('sequences', 'Medium', 'Find a formula from a pattern', ['Find a formula for the nth term of 2, 6, 12, 20, 30, …'], [
    'Write each term as a product: 1 × 2, 2 × 3, 3 × 4, 4 × 5, 5 × 6.', 'The nth term is n × (n + 1).', 'Check: u₄ = 4 × 5 = 20.', 'Answer: uₙ = n(n + 1).'])
add('sequences', 'Easy', 'Evaluate a sum', ['Evaluate the sum of (2r + 1) for r = 1 to 4. In symbols: `Σ(r = 1 to 4) (2r + 1)`.'], [
    'Put r = 1, 2, 3, 4 into 2r + 1.', '3 + 5 + 7 + 9', 'Answer: 24.'])
d1 = sp = S.simplify(((2 * nn + 1) / (nn + 2)) - ((2 * nn - 1) / (nn + 1)))
add('sequences', 'Hard', 'Increasing sequence', ['A sequence has `uₙ = (2n − 1)/(n + 1)`. Show that it is an increasing sequence.'], [
    'A sequence is increasing if uₙ₊₁ − uₙ > 0 for every n.', 'uₙ₊₁ = (2n + 1)/(n + 2).', 'uₙ₊₁ − uₙ = [(2n + 1)(n + 1) − (2n − 1)(n + 2)]/[(n + 1)(n + 2)].', '(2n + 1)(n + 1) = 2n² + 3n + 1 and (2n − 1)(n + 2) = 2n² + 3n − 2.', 'So uₙ₊₁ − uₙ = 3/[(n + 1)(n + 2)].', 'Answer: for n ≥ 1 this is positive, so the sequence is increasing.'])
cyc = [S.Integer(2)]
for _ in range(5): cyc.append(1 / (1 - cyc[-1]))
assert cyc[3] == cyc[0]
add('sequences', 'Hard', 'A periodic sequence', ['A sequence has `u₁ = 2` and `uₙ₊₁ = 1/(1 − uₙ)`. Find u₂, u₃, u₄ and then u₂₀.'], [
    f'u₂ = 1/(1 − 2) = {n(cyc[1])}', f'u₃ = 1/(1 − ({n(cyc[1])})) = {n(cyc[2])}', f'u₄ = 1/(1 − {n(cyc[2])}) = {n(cyc[3])}, which is u₁ again.',
    'The sequence repeats every 3 terms: 2, −1, 1/2, 2, −1, 1/2, …', '20 = 3 × 6 + 2, so u₂₀ is the same as u₂.', f'Answer: u₂ = {n(cyc[1])}, u₃ = {n(cyc[2])}, u₄ = 2 and u₂₀ = {n(cyc[1])}.'])

# ---------- section 2: arithmetic progressions ----------
def ap_nth(key, level, a, d, k):
    v = a + (k - 1) * d
    add(key, level, 'nth term of an AP', [f'An arithmetic progression has first term {n(a)} and common difference {n(d)}. Find the {k}th term.'], [
        'Use uₙ = a + (n − 1)d.', f'{u(k)} = {n(a)} + {k - 1}({n(d)})', f'{u(k)} = {n(a)} + {p((k - 1) * d)} = {n(v)}', f'Answer: {u(k)} = {n(v)}.'],
        [anim(2, f'a = {n(a)}; d = {n(d)}; n = {k}', f'{u(k)} = {n(a)} + {k - 1}({n(d)})', [(n(a), n(a)), (n(d), n(d))], 'Put a and d into a + (n − 1)d. The bracket holds n − 1.')])
def ap_from_terms(key, level, i, ui, j, uj):
    d = S.Rational(uj - ui, j - i); a = ui - (i - 1) * d
    add(key, level, 'Find a and d from two terms', [f'An AP has {u(i)} = {ui} and {u(j)} = {uj}. Find the first term and the common difference.'], [
        'Use uₙ = a + (n − 1)d for each term.', f'{u(i)}: a + {i - 1}d = {ui}', f'{u(j)}: a + {j - 1}d = {uj}', f'Subtract: {j - i}d = {uj - ui}, so d = {n(d)}.', f'a = {ui} − {i - 1}({p(d)}) = {n(a)}', f'Answer: a = {n(a)}, d = {n(d)}.'])
def ap_sum(key, level, a, d, k):
    s = k * (2 * a + (k - 1) * d) / S.Integer(2)
    add(key, level, 'Sum of an AP', [f'Find the sum of the first {k} terms of the AP {n(a)}, {n(a + d)}, {n(a + 2 * d)}, …'], [
        'Use Sₙ = n/2 [2a + (n − 1)d].', f'a = {n(a)}, d = {n(d)}, n = {k}.', f'{Sn(k)} = {k}/2 [2({n(a)}) + {k - 1}({n(d)})]', f'{Sn(k)} = {k}/2 × {n(2 * a + (k - 1) * d)} = {n(s)}', f'Answer: {Sn(k)} = {n(s)}.'],
        [anim(3, f'a = {n(a)}; d = {n(d)}; n = {k}', f'{Sn(k)} = {k}/2 [2({n(a)}) + {k - 1}({n(d)})]', [(str(k), str(k)), (n(a), n(a)), (n(d), n(d))], 'n is the number of terms. Put a, d and n into the sum formula.')])
ap_nth('ap', 'Easy', S.Integer(5), S.Integer(3), 20)
ap_from_terms('ap', 'Medium', 3, 11, 8, 26)
ap_sum('ap', 'Easy', S.Integer(4), S.Integer(5), 12)
add('ap', 'Medium', 'Sum between two values', ['Find the sum of the series 3 + 7 + 11 + … + 59.'], [
    'This is an AP with a = 3, d = 4 and last term l = 59.', 'Find n: 3 + (n − 1)4 = 59, so (n − 1)4 = 56 and n = 15.', 'Use Sₙ = n/2 (a + l).', 'S₁₅ = 15/2 (3 + 59) = 15/2 × 62 = 465.', 'Answer: 465.'])
ans = S.solve(S.Eq(nn * (2 * 2 + (nn - 1) * 3) / 2, 77), nn)
add('ap', 'Hard', 'Find the number of terms', ['The sum of the first n terms of the AP 2, 5, 8, … is 77. Find n.'], [
    'a = 2 and d = 3. Sₙ = n/2 [4 + 3(n − 1)] = 77.', 'n(3n + 1) = 154, so 3n² + n − 154 = 0.', '(n − 7)(3n + 22) = 0, so n = 7 or n = −22/3.', 'n must be a positive whole number.', 'Answer: n = 7.'])
add('ap', 'Hard', 'Multiples in a range', ['Find the sum of all the multiples of 7 between 100 and 500.'], [
    'The first multiple of 7 above 100 is 105. The last below 500 is 497.', 'The multiples form an AP with a = 105, d = 7 and l = 497.', 'Find n: 105 + (n − 1)7 = 497, so (n − 1)7 = 392 and n = 57.', 'S₅₇ = 57/2 (105 + 497) = 57/2 × 602 = 17157.', 'Answer: 17157.'])
add('ap', 'Medium', 'Show that it is an AP', ['A sequence has `uₙ = 6n − 1`. Show that it is an AP. Find its common difference and the sum of the first 10 terms.'], [
    'uₙ₊₁ − uₙ = [6(n + 1) − 1] − [6n − 1] = 6.', 'The difference is the same for every n, so it is an AP with d = 6.', 'u₁ = 5. S₁₀ = 10/2 [2(5) + 9(6)] = 5 × 64 = 320.', 'Answer: d = 6 and S₁₀ = 320.'])
add('ap', 'Hard', 'Three numbers in AP', ['Three numbers are in AP. Their sum is 27 and their product is 693. Find them.'], [
    'Call them a − d, a and a + d.', 'Sum: 3a = 27, so a = 9.', 'Product: (9 − d)(9)(9 + d) = 693, so 81 − d² = 77.', 'd² = 4, so d = 2 or −2.', 'Answer: the numbers are 7, 9 and 11 (or 11, 9, 7).'])
add('ap', 'Medium', 'A savings plan', ['Tendai saves $50 in week 1, and saves $10 more each week than the week before. How much has she saved after 12 weeks?'], [
    'The weekly amounts form an AP: a = 50, d = 10.', 'S₁₂ = 12/2 [2(50) + 11(10)]', 'S₁₂ = 6 × 210 = 1260', 'Answer: $1260.'])
add('ap', 'Hard', 'Use two conditions', ['An AP has 5th term equal to three times the 2nd term, and the sum of the first 4 terms is 40. Find a and d.'], [
    'u₅ = a + 4d and u₂ = a + d. So a + 4d = 3(a + d).', 'a + 4d = 3a + 3d, so d = 2a.', 'S₄ = 4/2 [2a + 3d] = 2(2a + 6a) = 16a.', '16a = 40, so a = 5/2.', 'd = 2a = 5.', 'Answer: a = 5/2 and d = 5.'])

# ---------- section 3: geometric progressions ----------
def gp_nth(key, level, a, r, k):
    v = a * r ** (k - 1)
    add(key, level, 'nth term of a GP', [f'A geometric progression has first term {n(a)} and common ratio {n(r)}. Find the {k}th term.'], [
        'Use uₙ = ar^(n − 1).', f'{u(k)} = {n(a)} × {p(r)}^{k - 1}', f'{u(k)} = {n(a)} × {n(r ** (k - 1))} = {n(v)}', f'Answer: {u(k)} = {n(v)}.'],
        [anim(2, f'a = {n(a)}; r = {n(r)}; n = {k}', f'{u(k)} = {n(a)} × {p(r)}^{k - 1}', [(n(a), n(a)), (n(r), p(r))], 'Put a and r into ar^(n − 1). The power is n − 1.')])
def gp_from_terms(key, level, i, ui, j, uj):
    r3 = S.Rational(uj, ui) ; r = S.real_root(r3, j - i); a = S.Rational(ui) / r ** (i - 1)
    add(key, level, 'Find a and r from two terms', [f'A GP has {u(i)} = {ui} and {u(j)} = {uj}. Find the common ratio and the first term.'], [
        'Use uₙ = ar^(n − 1) for each term.', f'{u(i)}: ar^{i - 1} = {ui}', f'{u(j)}: ar^{j - 1} = {uj}', f'Divide: r^{j - i} = {uj}/{ui} = {n(r3)}.', f'r = {n(r)}', f'a = {ui}/{p(r)}^{i - 1} = {n(a)}', f'Answer: r = {n(r)}, a = {n(a)}.'])
def gp_sum(key, level, a, r, k):
    s = a * (1 - r ** k) / (1 - r)
    add(key, level, 'Sum of a GP', [f'Find the sum of the first {k} terms of the GP {n(a)}, {n(a * r)}, {n(a * r * r)}, …'], [
        'Use Sₙ = a(1 − rⁿ)/(1 − r), or a(rⁿ − 1)/(r − 1) when r > 1.', f'a = {n(a)}, r = {n(r)}, n = {k}.', f'{Sn(k)} = {n(a)}(1 − {p(r)}^{k})/(1 − {p(r)})', f'{Sn(k)} = {n(a)}({n(1 - r ** k)})/({n(1 - r)}) = {n(s)}', f'Answer: {Sn(k)} = {n(s)}' + ('.' if s.is_Integer else f' = {dec(s, 3)}.')],
        [anim(3, f'a = {n(a)}; r = {n(r)}; n = {k}', f'{Sn(k)} = {n(a)}(1 − {p(r)}^{k})/(1 − {p(r)})', [(n(a), n(a)), (n(r), p(r)), (str(k), str(k))], 'Put a, r and n into the sum formula. r appears twice.')])
gp_nth('gp', 'Easy', S.Integer(3), S.Integer(2), 8)
gp_from_terms('gp', 'Medium', 2, 6, 5, 162)
gp_sum('gp', 'Easy', S.Integer(2), S.Integer(3), 6)
gp_sum('gp', 'Medium', S.Integer(100), R(1, 2), 8)
add('gp', 'Medium', 'First term to exceed a value', ['The GP 5, 10, 20, … has uₙ = 5 × 2^(n − 1). Find the first term that is greater than 1000.'], [
    'Solve 5 × 2^(n − 1) > 1000, so 2^(n − 1) > 200.', 'Take logs: (n − 1) ln 2 > ln 200, so n − 1 > 7.64….', 'n − 1 must be a whole number, so n − 1 = 8 and n = 9.', 'u₉ = 5 × 2⁸ = 1280. Check u₈ = 640, which is below 1000.', 'Answer: the 9th term, 1280.'])
nsol = next(i for i in range(1, 40) if 3 * (2 ** i - 1) > 3000)
add('gp', 'Hard', 'Smallest n for a sum', ['For the GP 3, 6, 12, …, find the least n for which Sₙ > 3000.'], [
    'a = 3, r = 2. Sₙ = 3(2ⁿ − 1)/(2 − 1) = 3(2ⁿ − 1).', '3(2ⁿ − 1) > 3000, so 2ⁿ > 1001.', 'n ln 2 > ln 1001, so n > 9.97….', f'S₁₀ = 3(1024 − 1) = 3069 > 3000, and S₉ = 3(512 − 1) = 1533 < 3000.', f'Answer: n = {nsol}.'])
add('gp', 'Hard', 'Three terms in GP', ['x + 2, x + 5 and x + 11 are three consecutive terms of a GP. Find x and the common ratio.'], [
    'In a GP, the ratio is the same: (x + 5)/(x + 2) = (x + 11)/(x + 5).', '(x + 5)² = (x + 2)(x + 11).', 'x² + 10x + 25 = x² + 13x + 22.', '3 = 3x, so x = 1.', 'The terms are 3, 6, 12, so r = 2.', 'Answer: x = 1 and r = 2.'])
val = 2000 * R(105, 100) ** 10
add('gp', 'Medium', 'Compound interest', ['$2000 is invested at 5% compound interest per year. Find its value after 10 years, to the nearest cent.'], [
    'Each year the amount is multiplied by 1.05.', 'This is a GP with ratio 1.05. After 10 years: 2000 × 1.05^10.', f'2000 × {float(R(105, 100) ** 10):.6f} = {float(val):.2f}', f'Answer: ${float(val):.2f}.'],
    [anim(2, 'start = 2000; rate 5%; years = 10', 'After 10 years: 2000 × 1.05^10', [('2000', '2000'), ('10', '10')], 'The amount is multiplied by 1.05 once for each year.')])
val = 12000 * R(85, 100) ** 5
add('gp', 'Medium', 'Depreciation', ['A car is worth $12 000 when new. Its value falls by 15% each year. Find its value after 5 years, to the nearest dollar.'], [
    'Each year the value is multiplied by 0.85.', 'After 5 years: 12 000 × 0.85⁵.', f'= 12 000 × {float(R(85, 100) ** 5):.6f} = {float(val):.2f}', f'Answer: ${round(float(val))}.'])
add('gp', 'Hard', 'Find r from a sum', ['A GP has first term 3 and the sum of its first three terms is 21. Find the possible values of r.'], [
    'S₃ = 3 + 3r + 3r² = 21.', '3r² + 3r − 18 = 0, so r² + r − 6 = 0.', '(r + 3)(r − 2) = 0.', 'Answer: r = 2 or r = −3. (Terms: 3, 6, 12 or 3, −9, 27.)'])

# ---------- section 4: sum to infinity ----------
def s_inf(key, level, a, r):
    s = a / (1 - r)
    add(key, level, 'Sum to infinity', [f'Find the sum to infinity of the GP {n(a)}, {n(a * r)}, {n(a * r * r)}, …'], [
        f'The common ratio is r = {n(r)}. Since |r| < 1, the series converges.', 'Use S∞ = a/(1 − r).', f'S∞ = {dv(a)}/(1 − {p(r)}) = {dv(a)}/{dv(1 - r)}', f'Answer: S∞ = {n(s)}.'],
        [anim(3, f'a = {n(a)}; r = {n(r)}', f'S∞ = {n(a)}/(1 − {p(r)})', [(n(a), n(a)), (n(r), p(r))], 'Put a on top, and 1 minus r below.')])
s_inf('suminf', 'Easy', S.Integer(8), R(1, 2))
s_inf('suminf', 'Easy', S.Integer(27), R(1, 3))
add('suminf', 'Easy', 'Does it converge?', ['State whether each GP has a sum to infinity: (a) 5 + 10 + 20 + …  (b) 6 − 4 + 8/3 − …  (c) 1 + 0.9 + 0.81 + …'], [
    'A GP has a sum to infinity only if |r| < 1.', '(a) r = 10/5 = 2. |r| > 1, so no sum to infinity.', '(b) r = −4/6 = −2/3. |r| < 1, so it converges.', '(c) r = 0.9. |r| < 1, so it converges.', 'Answer: (a) no; (b) yes, S∞ = 6/(1 + 2/3) = 18/5; (c) yes, S∞ = 10.'])
def recurring(key, level, whole, rep_digits, pre=''):
    # 0.pre rep rep rep ...
    k = len(rep_digits)
    if pre == '':
        first = S.Rational(int(rep_digits), 10 ** k); r = R(1, 10 ** k)
        total = first / (1 - r)
        text = '0.' + rep_digits * 3 + '…'
        steps = [f'Write it as a GP: {n(first)} + {n(first * r)} + {n(first * r * r)} + …', f'a = {n(first)} and r = {n(r)}.', f'S∞ = {dv(first)}/(1 − {n(r)}) = {dv(first)}/{dv(1 - r)}', f'Answer: {n(total)}.']
    else:
        pr = S.Rational(int(pre), 10 ** len(pre)); first = S.Rational(int(rep_digits), 10 ** (len(pre) + k)); r = R(1, 10 ** k)
        total = pr + first / (1 - r)
        text = '0.' + pre + rep_digits * 3 + '…'
        steps = [f'Split it: {n(pr)} + the repeating part.', f'The repeating part is {n(first)} + {n(first * r)} + … , a GP with a = {n(first)}, r = {n(r)}.', f'Its sum is {dv(first)}/(1 − {n(r)}) = {n(first / (1 - r))}.', f'{n(pr)} + {n(first / (1 - r))} = {n(total)}', f'Answer: {n(total)}.']
    assert abs(float(total) - float(text.replace('…', '')[:8])) < 1e-3, (text, total)
    add(key, level, 'Recurring decimal as a fraction', [f'Express the recurring decimal {text} as a fraction, using a GP.'], steps)
recurring('suminf', 'Medium', 0, '27')
recurring('suminf', 'Hard', 0, '3', pre='4')
add('suminf', 'Medium', 'Find r', ['A GP has first term 12 and sum to infinity 18. Find the common ratio.'], [
    'S∞ = a/(1 − r), so 18 = 12/(1 − r).', '18(1 − r) = 12, so 1 − r = 2/3.', 'r = 1/3.', 'Check: |r| < 1, and 12/(1 − 1/3) = 18.', 'Answer: r = 1/3.'])
add('suminf', 'Medium', 'Values of x for convergence', ['For which values of x does the series 1 + 2x + 4x² + 8x³ + … converge? Find its sum to infinity.'], [
    'This is a GP with a = 1 and r = 2x.', 'It converges when |2x| < 1.', '−1 < 2x < 1, so −1/2 < x < 1/2.', 'S∞ = 1/(1 − 2x).', 'Answer: −1/2 < x < 1/2, and S∞ = 1/(1 − 2x).'])
add('suminf', 'Hard', 'How close is Sₙ to S∞?', ['A GP has a = 5 and r = 1/2. Find S∞ − Sₙ. Hence find the least n for which S∞ − Sₙ < 0.01.'], [
    'S∞ = 5/(1 − 1/2) = 10.', 'Sₙ = 5(1 − (1/2)ⁿ)/(1/2) = 10(1 − (1/2)ⁿ).', 'S∞ − Sₙ = 10(1/2)ⁿ = 10/2ⁿ.', '10/2ⁿ < 0.01 means 2ⁿ > 1000.', 'n ln 2 > ln 1000, so n > 9.97….', 'Answer: S∞ − Sₙ = 10/2ⁿ, and the least n is 10.'])
add('suminf', 'Hard', 'Two conditions', ['A GP has sum to infinity 9 and second term 2. Find the possible values of a and r.'], [
    'S∞: a/(1 − r) = 9. Second term: ar = 2, so a = 2/r.', '2/[r(1 − r)] = 9, so 9r(1 − r) = 2.', '9r² − 9r + 2 = 0, so (3r − 1)(3r − 2) = 0.', 'r = 1/3 or r = 2/3. Both satisfy |r| < 1.', 'a = 2/r: a = 6 (when r = 1/3) or a = 3 (when r = 2/3).', 'Answer: a = 6, r = 1/3 or a = 3, r = 2/3.'])
add('suminf', 'Hard', 'A bouncing ball', ['A ball is dropped from a height of 10 m. After each bounce it rises to 60% of the previous height. Find the total distance it travels before it stops.'], [
    'First fall: 10 m. After that, each rise is followed by an equal fall.', 'Rise heights: 6, 3.6, 2.16, … a GP with a = 6, r = 0.6.', 'Sum of rises = 6/(1 − 0.6) = 15.', 'Each rise is also a fall, so up and down = 2 × 15 = 30.', 'Total = 10 + 30 = 40.', 'Answer: 40 m.'])

# ---------- section 5: sigma notation and standard sums ----------
def sigma_value(key, level, text, f_, hi, formula_text, lo=1):
    r = S.Symbol('r', integer=True)
    val = sum(f_(i) for i in range(lo, hi + 1))
    add(key, level, 'Evaluate a sum', [f'Evaluate `Σ(r = {lo} to {hi}) {text}`.'], [
        formula_text[0], formula_text[1].replace('N', str(hi)), f'Answer: {n(val)}.'])
sigma_value('sigma', 'Easy', 'r²', lambda i: i * i, 5, ('Use Σr² = n(n + 1)(2n + 1)/6 with n = 5.', '5 × 6 × 11/6 = 55'))
sigma_value('sigma', 'Easy', 'r', lambda i: i, 20, ('Use Σr = n(n + 1)/2 with n = 20.', '20 × 21/2 = 210'))
sigma_value('sigma', 'Easy', 'r³', lambda i: i ** 3, 10, ('Use Σr³ = [n(n + 1)/2]² with n = 10.', '(10 × 11/2)² = 55² = 3025'))
rrs = S.Symbol('r', integer=True, positive=True)
add('sigma', 'Medium', 'Find a formula for a sum', ['Show that `Σ(r = 1 to n) (3r + 2) = n(3n + 7)/2`.'], [
    'Split it up: 3Σr + Σ2.', 'Σr = n(n + 1)/2, and adding the number 2 n times gives 2n.', '3n(n + 1)/2 + 2n = [3n² + 3n + 4n]/2', f'= n(3n + 7)/2', 'Answer: shown.'])
assert S.simplify(S.summation(3 * rrs + 2, (rrs, 1, nn)) - nn * (3 * nn + 7) / 2) == 0
add('sigma', 'Medium', 'Find a formula for a sum', ['Show that `Σ(r = 1 to n) (r² − r) = (n − 1)n(n + 1)/3`.'], [
    'Split it up: Σr² − Σr.', 'n(n + 1)(2n + 1)/6 − n(n + 1)/2', 'Take out n(n + 1)/6: n(n + 1)/6 × [(2n + 1) − 3]', '= n(n + 1)(2n − 2)/6 = n(n + 1)(n − 1)/3', 'Answer: shown.'])
assert S.simplify(S.summation(rrs ** 2 - rrs, (rrs, 1, nn)) - (nn - 1) * nn * (nn + 1) / 3) == 0
add('sigma', 'Medium', 'Find a formula for a sum', ['Find `Σ(r = 1 to n) r(r + 2)` in factorised form.'], [
    'r(r + 2) = r² + 2r.', 'Σr² + 2Σr = n(n + 1)(2n + 1)/6 + n(n + 1)', 'Take out n(n + 1)/6: n(n + 1)/6 × [(2n + 1) + 6]', 'Answer: n(n + 1)(2n + 7)/6.'])
assert S.simplify(S.summation(rrs * (rrs + 2), (rrs, 1, nn)) - nn * (nn + 1) * (2 * nn + 7) / 6) == 0
add('sigma', 'Medium', 'A sum that does not start at 1', ['Evaluate `Σ(r = 6 to 15) r`.'], [
    'Sum from 1 to 15, then take away the sum from 1 to 5.', 'Σ(1 to 15) r = 15 × 16/2 = 120.', 'Σ(1 to 5) r = 5 × 6/2 = 15.', '120 − 15 = 105', 'Answer: 105.'])
assert sum(range(6, 16)) == 105
add('sigma', 'Hard', 'Find a formula for a sum', ['Show that `Σ(r = 1 to n) (2r − 1)² = n(2n − 1)(2n + 1)/3`.'], [
    '(2r − 1)² = 4r² − 4r + 1.', '4Σr² − 4Σr + n = 4 × n(n + 1)(2n + 1)/6 − 4 × n(n + 1)/2 + n', 'Put over 3: n[2(n + 1)(2n + 1) − 6(n + 1) + 3]/3', '2(2n² + 3n + 1) − 6n − 6 + 3 = 4n² − 1', 'So the sum is n(4n² − 1)/3 = n(2n − 1)(2n + 1)/3.', 'Answer: shown.'])
assert S.simplify(S.summation((2 * rrs - 1) ** 2, (rrs, 1, nn)) - nn * (2 * nn - 1) * (2 * nn + 1) / 3) == 0
add('sigma', 'Medium', 'Find n from a sum', ['`Σ(r = 1 to n) r = 465`. Find n.'], [
    'n(n + 1)/2 = 465, so n² + n − 930 = 0.', '(n − 30)(n + 31) = 0.', 'n must be positive, so n = 30.', 'Check: 30 × 31/2 = 465.', 'Answer: n = 30.'])
add('sigma', 'Hard', 'Find a formula for a sum', ['Show that `Σ(r = 1 to n) r(r + 1)(r + 2) = n(n + 1)(n + 2)(n + 3)/4`.'], [
    'Expand: r(r + 1)(r + 2) = r³ + 3r² + 2r.', 'Σr³ = n²(n + 1)²/4, 3Σr² = n(n + 1)(2n + 1)/2, 2Σr = n(n + 1).', 'Take out n(n + 1)/4: n(n + 1)/4 × [n(n + 1) + 2(2n + 1) + 4]', 'n² + n + 4n + 2 + 4 = n² + 5n + 6 = (n + 2)(n + 3)', 'Answer: n(n + 1)(n + 2)(n + 3)/4.'])
assert S.simplify(S.summation(rrs * (rrs + 1) * (rrs + 2), (rrs, 1, nn)) - nn * (nn + 1) * (nn + 2) * (nn + 3) / 4) == 0

# ---------- section 6: method of differences ----------
def telescoping_check(term, closed, lo=1):
    assert S.simplify(S.summation(term(rrs), (rrs, lo, nn)) - closed) == 0
add('differences', 'Easy', 'Telescoping sum', ['Show that `Σ(r = 1 to n) [(r + 1)² − r²] = n² + 2n`.'], [
    'Write out the first few terms: (2² − 1²) + (3² − 2²) + (4² − 3²) + … + ((n + 1)² − n²).', 'Each square cancels with the next term, except the first and the last.', 'What remains is (n + 1)² − 1².', '= n² + 2n + 1 − 1 = n² + 2n', 'Answer: shown.'])
telescoping_check(lambda r: (r + 1) ** 2 - r ** 2, nn ** 2 + 2 * nn)
add('differences', 'Medium', 'Partial fractions then cancel', ['Show that `Σ(r = 1 to n) 1/[r(r + 1)] = n/(n + 1)`.'], [
    'Split: 1/[r(r + 1)] = 1/r − 1/(r + 1).', 'Write out: (1 − 1/2) + (1/2 − 1/3) + (1/3 − 1/4) + … + (1/n − 1/(n + 1)).', 'Every middle term cancels. Left: 1 − 1/(n + 1).', '1 − 1/(n + 1) = n/(n + 1)', 'Answer: shown.'],
    [anim(1, '1/[r(r + 1)]', '1/r − 1/(r + 1)', [('1', '1')], 'Partial fractions: the top 1 is split over the two factors.')][:0])
telescoping_check(lambda r: 1 / (r * (r + 1)), nn / (nn + 1))
add('differences', 'Easy', 'Sum to infinity of a telescoping series', ['Find the sum to infinity of `Σ(r = 1 to ∞) 1/[r(r + 1)]`.'], [
    'From above, Sₙ = 1 − 1/(n + 1).', 'As n gets very large, 1/(n + 1) gets close to 0.', 'So Sₙ gets close to 1.', 'Answer: 1.'])
add('differences', 'Easy', 'Evaluate a telescoping sum', ['Use the result Σ(r = 1 to n) 1/[r(r + 1)] = n/(n + 1) to evaluate the sum for n = 50.'], [
    'Put n = 50 in n/(n + 1).', '50/51', 'Answer: 50/51.'])
add('differences', 'Medium', 'Partial fractions then cancel', ['Show that `Σ(r = 1 to n) 1/[r(r + 2)] = 3/4 − (2n + 3)/[2(n + 1)(n + 2)]`.'], [
    'Split: 1/[r(r + 2)] = ½[1/r − 1/(r + 2)].', 'Write out the terms: ½[(1 − 1/3) + (1/2 − 1/4) + (1/3 − 1/5) + … + (1/(n − 1) − 1/(n + 1)) + (1/n − 1/(n + 2))].', 'Each term cancels two steps later. Left: 1, 1/2, −1/(n + 1) and −1/(n + 2).', 'Sum = ½[1 + 1/2 − 1/(n + 1) − 1/(n + 2)]', '= 3/4 − ½[(2n + 3)/((n + 1)(n + 2))]', 'Answer: shown.'])
telescoping_check(lambda r: 1 / (r * (r + 2)), R(3, 4) - (2 * nn + 3) / (2 * (nn + 1) * (nn + 2)))
add('differences', 'Medium', 'Odd numbers in the bottom', ['Show that `Σ(r = 1 to n) 1/[(2r − 1)(2r + 1)] = n/(2n + 1)`.'], [
    'Split: 1/[(2r − 1)(2r + 1)] = ½[1/(2r − 1) − 1/(2r + 1)].', 'Write out: ½[(1 − 1/3) + (1/3 − 1/5) + … + (1/(2n − 1) − 1/(2n + 1))].', 'Only the first and last remain: ½[1 − 1/(2n + 1)].', '= ½ × 2n/(2n + 1) = n/(2n + 1)', 'Answer: shown.'])
telescoping_check(lambda r: 1 / ((2 * r - 1) * (2 * r + 1)), nn / (2 * nn + 1))
add('differences', 'Medium', 'Infinite sum', ['Find the sum to infinity of `Σ(r = 1 to ∞) 2/[r(r + 2)]`.'], [
    'Split: 2/[r(r + 2)] = 1/r − 1/(r + 2).', 'Sₙ = (1 + 1/2) − 1/(n + 1) − 1/(n + 2).', 'As n gets large, 1/(n + 1) and 1/(n + 2) both get close to 0.', 'Answer: 3/2.'])
telescoping_check(lambda r: 2 / (r * (r + 2)), R(3, 2) - 1 / (nn + 1) - 1 / (nn + 2))
add('differences', 'Hard', 'Three factors', ['Show that `Σ(r = 1 to n) 1/[r(r + 1)(r + 2)] = 1/4 − 1/[2(n + 1)(n + 2)]`.'], [
    'Split: 1/[r(r + 1)(r + 2)] = ½[1/(r(r + 1)) − 1/((r + 1)(r + 2))].', 'Check: 1/(r(r + 1)) − 1/((r + 1)(r + 2)) = 2/[r(r + 1)(r + 2)].', 'Write out: ½[(1/2 − 1/6) + (1/6 − 1/12) + … + (1/(n(n + 1)) − 1/((n + 1)(n + 2)))].', 'Left: ½[1/2 − 1/((n + 1)(n + 2))].', '= 1/4 − 1/[2(n + 1)(n + 2)]', 'Answer: shown.'])
telescoping_check(lambda r: 1 / (r * (r + 1) * (r + 2)), R(1, 4) - 1 / (2 * (nn + 1) * (nn + 2)))
add('differences', 'Hard', 'Starting from 2', ['Find `Σ(r = 2 to n) 1/(r² − 1)` in terms of n.'], [
    'r² − 1 = (r − 1)(r + 1). Split: 1/(r² − 1) = ½[1/(r − 1) − 1/(r + 1)].', 'Write out from r = 2: ½[(1 − 1/3) + (1/2 − 1/4) + (1/3 − 1/5) + … + (1/(n − 1) − 1/(n + 1))].', 'Left: ½[1 + 1/2 − 1/n − 1/(n + 1)].', 'Answer: ½[3/2 − 1/n − 1/(n + 1)] = 3/4 − 1/(2n) − 1/(2(n + 1)).'])
assert S.simplify(S.summation(1 / (rrs ** 2 - 1), (rrs, 2, nn)) - (R(3, 4) - 1 / (2 * nn) - 1 / (2 * (nn + 1)))) == 0
add('differences', 'Hard', 'Use differences to find Σr²', ['(a) Show that (r + 1)³ − r³ = 3r² + 3r + 1.  (b) Use the method of differences to show that Σ(r = 1 to n) r² = n(n + 1)(2n + 1)/6.'], [
    '(a) (r + 1)³ = r³ + 3r² + 3r + 1, so the difference is 3r² + 3r + 1.', '(b) Σ[(r + 1)³ − r³] telescopes to (n + 1)³ − 1.', 'It also equals 3Σr² + 3Σr + n.', 'So 3Σr² = (n + 1)³ − 1 − 3n(n + 1)/2 − n.', '(n + 1)³ − 1 − n = n³ + 3n² + 2n, so 3Σr² = n³ + 3n² + 2n − 3n(n + 1)/2 = n(2n² + 3n + 1)/2.', 'Σr² = n(2n + 1)(n + 1)/6.', 'Answer: shown.'])

# ---------- section 7: binomial expansion, positive integer n ----------
from sympy import binomial as C
add('binomint', 'Easy', 'Binomial coefficients', ['Evaluate ⁵C₂ and ⁸C₃.'], [
    'Use ⁿCᵣ = n!/[r!(n − r)!].', '⁵C₂ = 5 × 4/(2 × 1) = 10', '⁸C₃ = 8 × 7 × 6/(3 × 2 × 1) = 56', 'Answer: ⁵C₂ = 10 and ⁸C₃ = 56.'])
assert C(5, 2) == 10 and C(8, 3) == 56
def expand_bin(key, level, a, b, nexp, title='Expand a binomial'):
    expr = S.expand((a + b * xs) ** nexp); co = S.Poly(expr, xs).all_coeffs()[::-1]
    parts = []
    for k in range(nexp + 1):
        bx = cx(b) if k else ''
        parts.append(f'k = {k}: {int(C(nexp, k))} × {p(a)}^{nexp - k}' + (f' × ({bx})^{k}' if k else '') + f' = {poly([(co[k], xk(k))])}')
    ans = poly([(c, xk(k)) for k, c in enumerate(co)])
    add(key, level, title, [f'Expand `{lin(a, b)}^{nexp}` in ascending powers of x.'],
        [f'Use (a + bx)ⁿ = Σ ⁿCₖ a^(n − k) (bx)ᵏ. Here n = {nexp}.'] + parts + [f'Answer: {ans}.'])
expand_bin('binomint', 'Easy', S.Integer(1), S.Integer(1), 4)
expand_bin('binomint', 'Medium', S.Integer(2), S.Integer(1), 5)
expand_bin('binomint', 'Medium', S.Integer(1), S.Integer(-2), 4)
def coeff_q(key, level, a, b, nexp, k):
    co = C(nexp, k) * a ** (nexp - k) * b ** k
    add(key, level, 'A single coefficient', [f'Find the coefficient of {xk(k)} in the expansion of `{lin(a, b)}^{nexp}`.'], [
        f'The term in {xk(k)} is ⁿCₖ a^(n − k) (bx)ᵏ with n = {nexp}, k = {k}.', f'{int(C(nexp, k))} × {n(a)}^{nexp - k} × ({n(b)})^{k}', f'= {int(C(nexp, k))} × {n(a ** (nexp - k))} × {p(b ** k)}', f'Answer: {n(co)}.'])
coeff_q('binomint', 'Medium', S.Integer(2), S.Integer(3), 6, 3)
coeff_q('binomint', 'Medium', S.Integer(2), S.Integer(-1), 7, 2)
add('binomint', 'Hard', 'Term independent of x', ['Find the term independent of x in the expansion of `(x + 2/x)^6`.'], [
    'The general term is ⁶Cₖ x^(6 − k) (2/x)ᵏ = ⁶Cₖ 2ᵏ x^(6 − 2k).', 'Independent of x means the power of x is 0: 6 − 2k = 0, so k = 3.', '⁶C₃ × 2³ = 20 × 8 = 160', 'Answer: 160.'])
assert S.expand((xs + 2 / xs) ** 6).coeff(xs, 0) == 160
approx = 1 + 6 * R(2, 100) + 15 * R(2, 100) ** 2
add('binomint', 'Medium', 'Approximate a power', ['Use the first three terms of the expansion of (1 + x)⁶ to estimate 1.02⁶.'], [
    '(1 + x)⁶ = 1 + 6x + 15x² + …', 'Put x = 0.02: 1 + 6(0.02) + 15(0.02)².', '= 1 + 0.12 + 0.006', f'Answer: {float(approx):.3f}. (The exact value is {float(R(102, 100) ** 6):.5f}.)'])
co = S.Poly(S.expand((1 + xs) * (1 + 2 * xs) ** 5), xs).all_coeffs()[::-1]
add('binomint', 'Hard', 'Product of brackets', ['Find the coefficient of x² in the expansion of `(1 + x)(1 + 2x)^5`.'], [
    'Expand (1 + 2x)⁵ = 1 + 10x + 40x² + …', 'The x² term comes from two places: 1 × 40x² and x × 10x.', '40 + 10 = 50', 'Answer: 50.'])
assert co[2] == 50
add('binomint', 'Hard', 'Find n', ['The coefficient of x² in the expansion of `(1 + x)^n` is 45. Find n.'], [
    'The x² coefficient is ⁿC₂ = n(n − 1)/2.', 'n(n − 1)/2 = 45, so n² − n − 90 = 0.', '(n − 10)(n + 9) = 0.', 'n must be a positive whole number, so n = 10.', 'Answer: n = 10.'])

# ---------- section 8: binomial series, any n ----------
def ser(expr, upto=4):
    return S.series(expr, xs, 0, upto).removeO()
def sx(co_list):
    return poly([(c, '' if k == 0 else 'x' if k == 1 else f'x^{k}') for k, c in enumerate(co_list)]).replace('x^2', 'x²').replace('x^3', 'x³')
def coeffs(e): return [S.nsimplify(e.coeff(xs, k)) for k in range(4)]
def binom_rat(key, level, expo, c, title='Binomial series'):
    expo = S.nsimplify(expo); c = S.nsimplify(c)
    e = ser((1 + c * xs) ** expo); co = coeffs(e)
    cn = [S.Integer(1), expo, expo * (expo - 1) / 2, expo * (expo - 1) * (expo - 2) / 6]
    test = [cn[k] * c ** k for k in range(4)]
    assert test == co, (expo, c, test, co)
    form = lin(1, c)
    lim = 1 / abs(c)
    add(key, level, title, [f'Expand `{form}^({n(expo)})` in ascending powers of x up to and including x³. State the values of x for which it is valid.'], [
        'Use (1 + u)ⁿ = 1 + nu + n(n − 1)u²/2! + n(n − 1)(n − 2)u³/3! + …, valid for |u| < 1.', f'Here n = {n(expo)} and u = {cx(c)}.',
        f'n(n − 1)/2! = {n(cn[2])} and n(n − 1)(n − 2)/3! = {n(cn[3])}.', f'The terms are 1, ({n(cn[1])})u, ({n(cn[2])})u², ({n(cn[3])})u³ with u = {cx(c)}.', f'Answer: {sx(co)} + …', f'Valid when |{cx(c)}| < 1, that is |x| < {n(lim)}.'])
binom_rat('binomrat', 'Easy', -1, 1)
binom_rat('binomrat', 'Easy', -2, -1)
binom_rat('binomrat', 'Medium', R(1, 2), 1)
binom_rat('binomrat', 'Medium', -1, 2)
binom_rat('binomrat', 'Medium', R(1, 3), -3)
e = ser(S.sqrt(4 + xs)); co = coeffs(e)
add('binomrat', 'Hard', 'Take out a factor first', ['Expand `√(4 + x)` in ascending powers of x up to and including x³. State the values of x for which the expansion is valid.'], [
    '√(4 + x) = [4(1 + x/4)]^(1/2) = 2(1 + x/4)^(1/2).', 'Expand (1 + u)^(1/2) = 1 + u/2 − u²/8 + u³/16 − … with u = x/4.', '1 + x/8 − x²/128 + x³/1024 − …', 'Multiply by 2: 2 + x/4 − x²/64 + x³/512 − …', f'Answer: {sx(co)} + …', 'Valid when |x/4| < 1, that is |x| < 4.'])
assert co == [2, R(1, 4), -R(1, 64), R(1, 512)]
appr = 1 + R(1, 2) * R(2, 100) - R(1, 8) * R(2, 100) ** 2
add('binomrat', 'Medium', 'Approximate a root', ['Use the first three terms of the expansion of (1 + x)^(1/2) to estimate √1.02, to 5 decimal places.'], [
    '(1 + x)^(1/2) = 1 + x/2 − x²/8 + …', 'Put x = 0.02: 1 + 0.01 − (0.0004)/8.', '= 1 + 0.01 − 0.00005', f'Answer: {float(appr):.5f}. (The calculator gives {math.sqrt(1.02):.5f}.)'])
e = ser(1 / ((1 - xs) * (1 + 2 * xs))); co = coeffs(e)
add('binomrat', 'Hard', 'Partial fractions first', ['(a) Express `1/[(1 − x)(1 + 2x)]` in partial fractions.  (b) Hence expand it in ascending powers of x up to and including x³, and state when the expansion is valid.'], [
    '(a) 1/[(1 − x)(1 + 2x)] = A/(1 − x) + B/(1 + 2x). So 1 = A(1 + 2x) + B(1 − x).', 'Put x = 1: 1 = 3A, so A = 1/3. Put x = −1/2: 1 = (3/2)B, so B = 2/3.', '(b) (1/3)(1 − x)^(−1) = (1/3)(1 + x + x² + x³ + …)', '(2/3)(1 + 2x)^(−1) = (2/3)(1 − 2x + 4x² − 8x³ + …)', f'Add: {sx(co)} + …', 'Both expansions need |x| < 1 and |2x| < 1, so the combined expansion is valid for |x| < 1/2.', f'Answer: (a) 1/[3(1 − x)] + 2/[3(1 + 2x)]; (b) {sx(co)} + …, valid for |x| < 1/2.'])
assert co == [1, -1, 3, -5]
e = S.expand((2 - xs) * ser((1 + xs) ** -2)); e = sum(S.nsimplify(e.coeff(xs, k)) * xs ** k for k in range(4)); co = coeffs(e)
add('binomrat', 'Hard', 'Product with a series', ['Expand `(2 − x)(1 + x)^(−2)` in ascending powers of x up to and including x³.'], [
    '(1 + x)^(−2) = 1 − 2x + 3x² − 4x³ + …', 'Multiply by 2: 2 − 4x + 6x² − 8x³.', 'Multiply by −x: −x + 2x² − 3x³ + …', f'Add the two lines: {sx(co)}.', f'Answer: {sx(co)} + …'])
assert co == [2, -5, 8, -11]
e = ser(1 / (2 + xs) ** 2); co = coeffs(e)
add('binomrat', 'Hard', 'Negative index with a constant', ['Expand `1/(2 + x)²` in ascending powers of x up to and including x³.'], [
    '1/(2 + x)² = (2 + x)^(−2) = 2^(−2)(1 + x/2)^(−2) = ¼(1 + x/2)^(−2).', '(1 + u)^(−2) = 1 − 2u + 3u² − 4u³ + …, with u = x/2.', '1 − x + 3x²/4 − x³/2 + …', 'Multiply by ¼: 1/4 − x/4 + 3x²/16 − x³/8 + …', f'Answer: {sx(co)} + …, valid for |x| < 2.'])
assert co == [R(1, 4), -R(1, 4), R(3, 16), -R(1, 8)]

# ---------- section 9: recurrence relations and convergence ----------
add('recurrence', 'Easy', 'Terms from a recurrence', ['A sequence has `u₁ = 1` and `uₙ₊₁ = 2uₙ + 1`. Find u₂, u₃ and u₄.'], [
    'u₂ = 2(1) + 1 = 3', 'u₃ = 2(3) + 1 = 7', 'u₄ = 2(7) + 1 = 15', 'Answer: 3, 7, 15.'],
    [anim(1, 'u₁ = 1; uₙ₊₁ = 2uₙ + 1', 'u₂ = 2(1) + 1', [('1', '1'), ('2', '2')], 'Put the last term where uₙ is, then work it out.')][:0])
add('recurrence', 'Easy', 'Terms from a recurrence', ['A sequence has `u₁ = 3` and `uₙ₊₁ = uₙ² − 2`. Find u₂, u₃ and u₄.'], [
    'u₂ = 3² − 2 = 7', 'u₃ = 7² − 2 = 47', 'u₄ = 47² − 2 = 2207', 'Answer: 7, 47, 2207.'])
add('recurrence', 'Medium', 'Find the limit', ['A sequence has `u₁ = 2` and `uₙ₊₁ = (uₙ + 6)/2`. Find u₂, u₃, u₄ and the limit of the sequence.'], [
    'u₂ = (2 + 6)/2 = 4', 'u₃ = (4 + 6)/2 = 5', 'u₄ = (5 + 6)/2 = 5.5', 'If the sequence converges to L, then uₙ and uₙ₊₁ both approach L.', 'L = (L + 6)/2, so 2L = L + 6 and L = 6.', 'Answer: 4, 5, 5.5, … and the limit is 6.'])
add('recurrence', 'Medium', 'Find the limit', ['A sequence has `uₙ₊₁ = 0.5uₙ + 4` and u₁ = 10. Show that it converges and find its limit.'], [
    'The multiplier 0.5 has |0.5| < 1, so the sequence converges.', 'Let the limit be L: L = 0.5L + 4.', '0.5L = 4, so L = 8.', 'Check: u₂ = 9, u₃ = 8.5, u₄ = 8.25, … getting closer to 8.', 'Answer: the limit is 8.'])
add('recurrence', 'Medium', 'A limit that needs a quadratic', ['A sequence has `u₁ = 1` and `uₙ₊₁ = √(2uₙ + 3)`. Find the limit.'], [
    'Let the limit be L. Then L = √(2L + 3).', 'Square both sides: L² = 2L + 3.', 'L² − 2L − 3 = 0, so (L − 3)(L + 1) = 0.', 'L = 3 or L = −1. Every term is a positive square root, so L cannot be −1.', 'Check: u₂ = √5 = 2.24, u₃ = √7.47 = 2.73, … approaching 3.', 'Answer: L = 3.'])
g = lambda t: (t + 1) ** R(1, 3)
xsq = [1.0]
for _ in range(5): xsq.append((xsq[-1] + 1) ** (1 / 3))
add('recurrence', 'Medium', 'An iteration for a root', ['The equation `x³ − x − 1 = 0` can be rearranged as `x = (x + 1)^(1/3)`. Use x₀ = 1 and `xₙ₊₁ = (xₙ + 1)^(1/3)` to find x₁, x₂, x₃, x₄, to 4 decimal places.'], [
    f'x₁ = (1 + 1)^(1/3) = {xsq[1]:.4f}', f'x₂ = ({xsq[1]:.4f} + 1)^(1/3) = {xsq[2]:.4f}', f'x₃ = ({xsq[2]:.4f} + 1)^(1/3) = {xsq[3]:.4f}', f'x₄ = ({xsq[3]:.4f} + 1)^(1/3) = {xsq[4]:.4f}', f'Answer: {xsq[1]:.4f}, {xsq[2]:.4f}, {xsq[3]:.4f}, {xsq[4]:.4f}. The values settle near 1.3247.'])
f_ = lambda t: t ** 3 - t - 1
add('recurrence', 'Medium', 'A sign change shows a root', ['Show that `x³ − x − 1 = 0` has a root between 1 and 2.'], [
    'Let f(x) = x³ − x − 1. f is continuous.', f'f(1) = 1 − 1 − 1 = {n(f_(1))}, which is negative.', f'f(2) = 8 − 2 − 1 = {f_(2)}, which is positive.', 'f changes sign between 1 and 2, so it crosses zero there.', 'Answer: there is a root between 1 and 2.'])
seq = [S.Integer(3)]
for _ in range(5): seq.append((seq[-1] + 1) / (seq[-1] - 1))
assert seq[2] == seq[0]
add('recurrence', 'Hard', 'A sequence that repeats', ['A sequence has `u₁ = 3` and `uₙ₊₁ = (uₙ + 1)/(uₙ − 1)`. Find u₂, u₃ and u₁₀₀.'], [
    f'u₂ = (3 + 1)/(3 − 1) = {n(seq[1])}', f'u₃ = ({n(seq[1])} + 1)/({n(seq[1])} − 1) = {n(seq[2])}', 'u₃ = u₁, so the sequence repeats every 2 terms: 3, 2, 3, 2, …', 'Even terms are 2 and odd terms are 3.', 'Answer: u₂ = 2, u₃ = 3 and u₁₀₀ = 2.'])
add('recurrence', 'Easy', 'A recurrence that is an AP', ['A sequence has `u₁ = 2` and `uₙ₊₁ = uₙ + 3`. Find a formula for uₙ and find u₂₀.'], [
    'Each term is 3 more than the one before, so this is an AP with a = 2 and d = 3.', 'uₙ = 2 + 3(n − 1) = 3n − 1.', 'u₂₀ = 3(20) − 1 = 59.', 'Answer: uₙ = 3n − 1 and u₂₀ = 59.'])
add('recurrence', 'Hard', 'Limit with an unknown', ['A sequence has `uₙ₊₁ = 0.2uₙ + k`. It converges to 6.25. Find k, and say why it converges.'], [
    'The multiplier 0.2 satisfies |0.2| < 1, so the sequence converges whatever u₁ is.', 'Let L = 6.25 be the limit: L = 0.2L + k.', '6.25 = 1.25 + k', 'k = 5.', 'Answer: k = 5.'])

# ---------- section 10: mixed revision ----------
ap_nth('mixed', 'Easy', S.Integer(7), S.Integer(-2), 15)
gp_sum('mixed', 'Medium', S.Integer(5), S.Integer(2), 7)
s_inf('mixed', 'Medium', S.Integer(20), R(1, 5))
ap_from_terms('mixed', 'Medium', 4, 17, 9, 37)
recurring('mixed', 'Medium', 0, '45')
add('mixed', 'Medium', 'Sigma and standard sums', ['Evaluate `Σ(r = 1 to 12) (r² + 2r)`.'], [
    'Σr² = 12 × 13 × 25/6 = 650.', 'Σ2r = 2 × 12 × 13/2 = 156.', '650 + 156 = 806', 'Answer: 806.'])
assert sum(i * i + 2 * i for i in range(1, 13)) == 806
add('mixed', 'Hard', 'Telescoping', ['Show that `1/[r(r + 3)] = ⅓[1/r − 1/(r + 3)]` and hence find `Σ(r = 1 to ∞) 1/[r(r + 3)]`.'], [
    '⅓[1/r − 1/(r + 3)] = ⅓ × 3/[r(r + 3)] = 1/[r(r + 3)]. Shown.', 'Write out: ⅓[(1 − 1/4) + (1/2 − 1/5) + (1/3 − 1/6) + (1/4 − 1/7) + …].', 'The terms 1/4, 1/5, 1/6, … all cancel. What remains of Sₙ: ⅓[1 + 1/2 + 1/3 − 1/(n + 1) − 1/(n + 2) − 1/(n + 3)].', 'As n gets large the last three terms approach 0.', 'S∞ = ⅓ × 11/6 = 11/18.', 'Answer: 11/18.'])
assert S.limit(S.summation(1 / (rrs * (rrs + 3)), (rrs, 1, nn)), nn, S.oo) == R(11, 18)
coeff_q('mixed', 'Medium', S.Integer(3), S.Integer(2), 5, 2)
binom_rat('mixed', 'Medium', R(-1, 2), -2)
add('mixed', 'Hard', 'GP and AP together', ['The first, second and fourth terms of an AP are in GP. The AP has first term 3 and a non-zero common difference d. Find d.'], [
    'The terms are 3, 3 + d and 3 + 3d.', 'In GP: (3 + d)² = 3(3 + 3d).', '9 + 6d + d² = 9 + 9d, so d² − 3d = 0.', 'd(d − 3) = 0, so d = 0 or d = 3. d is not zero.', 'Check: 3, 6, 12 is a GP with ratio 2.', 'Answer: d = 3.'])

# ---------- verify and write ----------
for key, items in B.items():
    assert len(items) == 10, (key, len(items))
    for q in items:
        assert not re.search(r'\.\.\.|\bNone\b', json.dumps(q, ensure_ascii=False)), q
OUT.write_text(json.dumps(B, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print({k: len(v) for k, v in B.items()})
