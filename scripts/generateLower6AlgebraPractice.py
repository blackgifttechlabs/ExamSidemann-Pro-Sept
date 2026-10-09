import json, sympy as S
from pathlib import Path
x=S.symbols('x', real=True)
a,b,k,m,n,y=S.symbols('a b k m n y', real=True)
B={}
def f(v):
 return S.sstr(v).replace('**','^').replace('*',' × ').replace('sqrt','√').replace('log','ln').replace('-','−')
def add(key,q,*steps):
 assert len(steps)>=2,(key,q)
 B.setdefault(key,[]).append({'topic':q.split(':')[0][:65], 'lines':[q], 'solution':list(steps), 'skill':'', 'manualStart':True,'stepGrid':True})
def eq(key,expression):
 roots=S.solve(expression,x)
 assert all(S.simplify(expression.subs(x,r))==0 for r in roots)
 fact=S.factor(expression)
 steps=['Put all terms on one side: '+f(expression)+' = 0.']
 if fact!=expression:steps+=['Factorise: '+f(fact)+' = 0.','Set each factor to zero.']
 else:
  aa,bb,cc=S.Poly(expression,x).all_coeffs()
  steps+=['a = '+f(aa)+', b = '+f(bb)+', c = '+f(cc)+'.','b² − 4ac = '+f(bb*bb-4*aa*cc)+'.','Use x = (−b ± √(b² − 4ac))/(2a).']
 steps+=['Answer: '+(' or '.join('x = '+f(r) for r in roots) if roots else 'no real answers')+'.']
 add(key,'Solve `'+f(expression)+' = 0`.',*steps)
def divide(key,P,D):
 Q,R=S.div(P,D,x);assert S.expand(D*Q+R-P)==0
 cur=S.expand(P); steps=['Write powers from highest to lowest. Include any missing power with coefficient 0.']
 while cur!=0 and S.degree(cur,x)>=S.degree(D,x):
  term=S.LC(S.Poly(cur,x))/S.LC(S.Poly(D,x))*x**(S.degree(cur,x)-S.degree(D,x))
  steps+=['Next quotient term: '+f(term)+'.']
  cur=S.expand(cur-term*D);steps+=['Subtract '+f(term*(D))+': remainder so far '+f(cur)+'.']
 steps+=['Answer: quotient '+f(Q)+'; remainder '+f(R)+'.']
 add(key,'Divide `'+f(P)+'` by `'+f(D)+'`.',*steps)
def partial(key,expression):
 expr=S.cancel(expression);num,den=S.fraction(expr);quot,rem=S.div(num,den,x)
 answer=S.apart(expr,x);assert S.simplify(answer-expr)==0
 steps=['Factor the bottom: '+f(S.factor(den))+'.']
 forbidden=S.solve(den,x)
 if forbidden:steps+=['Exclude x = '+', '.join(f(r) for r in forbidden)+'.']
 if quot!=0:steps+=['Divide first: quotient '+f(quot)+'; remaining fraction '+f(rem/den)+'.']
 if rem==0:steps+=['Answer: '+f(quot)+'.'];add(key,'Split `'+f(expression)+'` into partial fractions.',*steps);return
 unknown=[];parts=[];index=0
 for factor,power in S.factor_list(den,x)[1]:
  for j in range(1,power+1):
   degree=S.degree(factor,x);coefs=S.symbols(' '.join(chr(65+index+i) for i in range(degree)),seq=True);index+=degree
   unknown+=list(coefs)
   top=sum(coefs[i]*x**(degree-1-i) for i in range(degree))
   parts.append(top/factor**j)
 exprparts=sum(parts);identity=S.Poly(S.together(rem/den-exprparts).as_numer_denom()[0],x)
 solved=S.solve(identity.all_coeffs(),unknown,dict=True)[0]
 steps+=['Use '+f(exprparts)+'.','Multiply by the full bottom expression. Match the numbers beside each power of x.']
 for var in unknown:steps+=['Find '+str(var)+' = '+f(solved[var])+'.']
 steps+=['Answer: '+f(answer)+'.']
 add(key,'Split `'+f(expression)+'` into partial fractions.',*steps)
def settext(result):
 if result==S.Reals:return 'all real x'
 if result==S.EmptySet:return 'no real x'
 if isinstance(result,S.Union):return ' or '.join(settext(i) for i in result.args)
 if isinstance(result,S.FiniteSet):return ' or '.join('x = '+f(i) for i in result)
 lo,hi=result.start,result.end
 if lo==-S.oo:return 'x '+('<' if result.right_open else '≤')+' '+f(hi)
 if hi==S.oo:return 'x '+('>' if result.left_open else '≥')+' '+f(lo)
 return f(lo)+' '+('<' if result.left_open else '≤')+' x '+('<' if result.right_open else '≤')+' '+f(hi)
def ineq(key,expression,sign):
 relation={'<':expression<0,'≤':expression<=0,'>':expression>0,'≥':expression>=0}[sign]
 result=S.solve_univariate_inequality(relation,x,relational=False)
 num,den=S.fraction(S.cancel(expression));critical=sorted(set(S.solve(num,x)+S.solve(den,x)),key=lambda r:float(r))
 steps=['Compare with zero: '+f(expression)+' '+sign+' 0.','Values to mark: '+(', '.join(f(r) for r in critical) or 'none')+'.']
 if den!=1:steps+=['Leave out bottom zeros: '+', '.join(f(r) for r in S.solve(den,x))+'.']
 edges=[-S.oo]+critical+[S.oo];signs=[]
 for lo,hi in zip(edges,edges[1:]):
  test=hi-1 if lo==-S.oo else lo+1 if hi==S.oo else (lo+hi)/2
  value=S.simplify(expression.subs(x,test));signs.append('positive' if value>0 else 'negative' if value<0 else 'zero')
 steps+=['Signs from left to right: '+', '.join(signs)+'.','Choose parts that match the question sign.','Answer: '+settext(result)+'.']
 add(key,'Solve `'+f(expression)+' '+sign+' 0`.',*steps)
# Indices: product, division, repeated powers, zero/negative powers, equations.
K='indices'
add(K,'Simplify `x² × x⁵`.','Same base x: add 2 and 5.','Answer: x⁷.')
add(K,'Simplify `x⁹/x⁴`, x ≠ 0.','Divide the same base: 9 − 4 = 5.','Answer: x⁵.')
add(K,'Simplify `(x³)⁴`.','A power of a power: 3 × 4 = 12.','Answer: x¹².')
add(K,'Simplify `(2x²y)³`.','Cube each part: 2³ = 8, (x²)³ = x⁶, y³ stays y³.','Answer: 8x⁶y³.')
add(K,'Evaluate `5⁰ + 2^(−3)`.','5⁰ = 1. A negative power puts 1 above the positive power.','2^(−3) = 1/8.','Answer: 1 + 1/8 = 9/8.')
add(K,'Simplify `x^(−4)x³`, x ≠ 0.','Add powers: −4 + 3 = −1.','x^(−1) = 1/x.','Answer: 1/x.')
add(K,'Simplify `(6a³b^(−2))(2a^(−1)b⁴)/(3a²b)`, a,b ≠ 0.','Numbers: 6 × 2/3 = 4.','Power of a: 3 − 1 − 2 = 0. Power of b: −2 + 4 − 1 = 1.','Answer: 4b.')
add(K,'Solve `3^(2x − 1) = 27^(x − 2)`.','27 = 3³, so the right-hand power is 3x − 6.','Equal bases: 2x − 1 = 3x − 6.','Answer: x = 5.')
add(K,'Solve `2^(x+1) + 2^x = 24`.','2^(x+1) = 2 × 2^x.','3 × 2^x = 24, so 2^x = 8.','Answer: x = 3.')
add(K,'Simplify `(a^(2n+1)a^(n−3))/a^(n+2)`, a > 0.','Add the top powers, then subtract the bottom power.','2n + 1 + n − 3 − n − 2 = 2n − 4.','Answer: a^(2n−4).')
K='rational-indices'
for base,power,answer in [(16,'1/2','4'),(27,'1/3','3'),(32,'2/5','4')]:
 add(K,f'Evaluate `{base}^({power})`.',f'The bottom of {power} tells you the root; the top tells you the power.',f'Answer: {answer}.')
add(K,'Evaluate `81^(−3/4)`.','The fourth root of 81 is 3.','Cube 3 to get 27, then put 1 above it.','Answer: 1/27.')
add(K,'Evaluate `64^(5/6)`.','The sixth root of 64 is 2.','Raise 2 to power 5: 2⁵ = 32.','Answer: 32.')
add(K,'Solve `x^(3/2) = 27` for real x.','An even root requires x ≥ 0. Put u = √x.','u³ = 27, so u = 3.','Answer: x = 3² = 9.')
add(K,'Solve `(∛x)² = 9` for real x.','Put u = ∛x. Then u² = 9.','u = 3 or u = −3. Cube both values.','Answer: x = 27 or x = −27.')
add(K,'Solve `16^(x+1/2) = 8^(2x−1)`.','Write both sides using base 2.','4x + 2 = 6x − 3.','Answer: x = 5/2.')
add(K,'Simplify `a^(1/2)a^(2/3)/a^(−1/6)`, a > 0.','Power = 1/2 + 2/3 + 1/6 = 3/6 + 4/6 + 1/6.','Answer: a^(4/3).')
add(K,'Solve `√x + x = 6`.','Put u = √x, so u ≥ 0 and x = u².','u² + u − 6 = (u + 3)(u − 2) = 0.','Keep u = 2; reject −3 because √x ≥ 0.','Answer: x = 4.')
K='direct-inverse'
add(K,'y varies directly as x. y = 20 when x = 5. Find y when x = 8.','y = kx; 20 = 5k, so k = 4.','y = 4 × 8.','Answer: y = 32.')
add(K,'y varies inversely as x. y = 6 when x = 4. Find y when x = 8.','y = k/x; k = 6 × 4 = 24.','y = 24/8.','Answer: y = 3.')
add(K,'y varies as x². y = 18 when x = 3. Find y when x = 5.','y = kx²; 18 = 9k, so k = 2.','y = 2 × 25.','Answer: y = 50.')
add(K,'y varies inversely as x². y = 27 when x = 2. Find y when x = 6.','y = k/x²; k = 27 × 4 = 108.','y = 108/36.','Answer: y = 3.')
add(K,'y varies as √x. y = 15 when x = 9. Find y when x = 25.','y = k√x; 15 = 3k, so k = 5.','y = 5 × 5.','Answer: y = 25.')
add(K,'y varies inversely as √x. y = 4 when x = 9. Find y when x = 36.','y = k/√x; 4 = k/3, so k = 12.','y = 12/6.','Answer: y = 2.')
add(K,'y varies as x³. y = 16 when x = 2. Find y when x = 3.','16 = k × 8, so k = 2.','y = 2 × 27.','Answer: y = 54.')
add(K,'y = k/(x − 2). y = 12 when x = 5. Find x when y = 6.','12 = k/3, so k = 36.','6 = 36/(x − 2), so x − 2 = 6.','Answer: x = 8; x = 2 is excluded.')
add(K,'x doubles. State the effect on y if (a) y ∝ x²; (b) y ∝ 1/x³.','For (a), (2x)² = 4x².','For (b), 1/(2x)³ = 1/(8x³).','Answer: (a) y becomes 4 times as big; (b) y becomes 1/8 of its old value.')
add(K,'y = k/∛x. y = 6 when x = 8. Find x when y = 3.','6 = k/2, so k = 12.','3 = 12/∛x, so ∛x = 4.','Answer: x = 64.')
K='joint-partial'
add(K,'y = kxz. y = 12 when x = 2, z = 3. Find y when x = 5, z = 2.','12 = 6k, so k = 2.','y = 2 × 5 × 2.','Answer: y = 20.')
add(K,'y = kx/z. y = 12 when x = 4, z = 2. Find y when x = 3, z = 6.','12 = 2k, so k = 6.','y = 6 × 3/6.','Answer: y = 3.')
add(K,'C = a + bd. C = 14 when d = 2; C = 26 when d = 5. Find a and b.','a + 2b = 14 and a + 5b = 26.','Subtract: 3b = 12, so b = 4.','Answer: a = 6, b = 4.')
add(K,'y = a/x + bx. y = 5 when x = 1; y = 4 when x = 2. Find a and b.','a + b = 5. a/2 + 2b = 4.','Multiply the second equation by 2: a + 4b = 8.','Subtract: 3b = 3.','Answer: b = 1 and a = 4.')
add(K,'y = ax + bx². y = 5 when x = 1; y = 14 when x = 2. Find y when x = 3.','a + b = 5; 2a + 4b = 14.','Subtract twice the first equation: 2b = 4, so b = 2, a = 3.','Answer: y = 3 × 3 + 2 × 9 = 27.')
add(K,'y = a + b√x. y = 5 when x = 1; y = 8 when x = 4. Find y when x = 9.','a + b = 5; a + 2b = 8.','b = 3, a = 2.','Answer: y = 2 + 3 × 3 = 11.')
add(K,'y = a + b/x. y = 8 when x = 2; y = 5 when x = 8. Find y when x = 4.','a + b/2 = 8; a + b/8 = 5.','Subtract: 3b/8 = 3, so b = 8, a = 4.','Answer: y = 4 + 8/4 = 6.')
add(K,'y ∝ x²/z. x becomes 3 times as big and z doubles. Find the multiplier for y.','The x² part becomes 3² = 9 times as big.','The bottom z becomes twice as big.','Answer: y becomes 9/2 times as big.')
add(K,'y = ax² + b/x. y = 3 when x = 1; y = 9 when x = 2. Find a and b.','a + b = 3; 4a + b/2 = 9.','Multiply second by 2: 8a + b = 18.','Subtract: 7a = 15.','Answer: a = 15/7, b = 6/7.')
add(K,'y = k√x/z². y = 6 when x = 9, z = 2. Find z > 0 when y = 8 and x = 16.','6 = 3k/4, so k = 8.','8 = 32/z², so z² = 4.','Answer: z = 2, because z > 0.')
# Polynomial operations and division.
K='polynomials'
add(K,'State the degree, leading coefficient and constant term of `2x⁴ − 3x² + 5`.','The highest power is 4; the number beside it is 2.','The term with no x is 5.','Answer: degree 4, leading coefficient 2, constant 5.')
for P,Q,op in [(2*x*x+3*x-1,x*x-4*x+5,'+'),(2*x*x+3*x-1,x*x-4*x+5,'−')]:
 ans=S.expand(P+Q if op=='+' else P-Q)
 add(K,'Find `('+f(P)+') '+op+' ('+f(Q)+')`.','Remove brackets, changing every sign in the second bracket if subtracting.','Collect terms with the same power of x.','Answer: '+f(ans)+'.')
for expr in [(x+2)*(x+3),(x+2)*(x*x-3*x+4),(2*x-1)*(x*x+x+3)]:
 add(K,'Expand `'+f(expr)+'`.','Multiply every term in one bracket by every term in the other.','Collect matching powers of x.','Answer: '+f(S.expand(expr))+'.')
add(K,'For `P(x) = 2x³ − x + 4`, find P(−2).','P(−2) = 2(−2)³ − (−2) + 4.','= −16 + 2 + 4.','Answer: −10.')
add(K,'Factorise `3x³ − 12x`.','Take out the common factor 3x: 3x(x² − 4).','x² − 4 is a difference of squares.','Answer: 3x(x − 2)(x + 2).')
add(K,'P(x) = 2x³ − 3x + 5. Find and simplify P(x) − P(−x).','P(−x) = −2x³ + 3x + 5.','Subtract: 2x³ − 3x + 5 + 2x³ − 3x − 5.','Answer: 4x³ − 6x.')
add(K,'Expand `(x² − x + 1)(x² + 4x + 3)`.','Multiply all terms and collect matching powers.','The x² terms cancel.','Answer: x⁴ + 3x³ + x + 3.')
K='division'
for P,D in [(x*x-1,x-1),(x*x+3*x+2,x+1),(x**3+1,x+1),(x**3-2*x*x-5*x+6,x-3),(x**3-1,x-1),(2*x**3+3*x*x-x+4,x+2),(x**4-1,x*x+1),(x**4+2*x*x+3,x*x+1),(x**4+3*x**3+x+3,x*x-x+1)]:divide(K,P,D)
add(K,'A polynomial divided by x − 2 has quotient x² + x + 1 and remainder 3. Find the polynomial.','P(x) = (x − 2)(x² + x + 1) + 3.','Expand: x³ − x² − x − 2 + 3.','Answer: P(x) = x³ − x² − x + 1.')
K='factor-remainder'
for P,D in [(x**3-2*x+5,x+1),(2*x**3-x+4,x-2),(x**3-6*x*x+11*x-6,x-1)]:
 r=S.solve(D,x)[0];val=S.simplify(P.subs(x,r))
 add(K,'Find the remainder when `'+f(P)+'` is divided by `'+f(D)+'`.','Set the divisor to zero: x = '+f(r)+'.','Evaluate P('+f(r)+').','Answer: remainder '+f(val)+'.'+(' The divisor is a factor.' if val==0 else ''))
add(K,'x − 1 is a factor of x² + kx + 3. Find k.','Put x = 1 and set the answer to zero.','1 + k + 3 = 0.','Answer: k = −4.')
add(K,'x − 2 is a factor of x³ + kx − 10. Find k.','P(2) = 0, so 8 + 2k − 10 = 0.','2k = 2.','Answer: k = 1.')
add(K,'Find the remainder when `4x³ − 2x + 1` is divided by `2x − 1`.','2x − 1 = 0 gives x = 1/2.','P(1/2) = 4/8 − 1 + 1.','Answer: remainder 1/2.')
add(K,'Factorise `x³ − 2x² − 5x + 6` completely.','P(1) = 0, so x − 1 is a factor.','Divide: quotient x² − x − 6 = (x − 3)(x + 2).','Answer: (x − 1)(x − 3)(x + 2).')
add(K,'P(3) = −9 and P(1/2) = −6. Find the remainder on division by `(x − 3)(2x − 1)`.','The remainder has form Ax + B, because its degree is less than 2.','3A + B = −9; A/2 + B = −6.','Subtract: 5A/2 = −3, so A = −6/5.','B = −27/5.','Answer: remainder −6x/5 − 27/5.')
add(K,'P(x) = ax³ + bx + 1. P(1) = 4 and P(−1) = −2. Can a and b be found separately?','P(1) gives a + b = 3.','P(−1) gives −a − b = −3, the same information.','Answer: no. Only a + b = 3 is known; another condition giving different information is needed.')
add(K,'P(x) = x³ + ax + b. x − 1 and x + 2 are factors. Find a and b.','P(1) = 0 gives 1 + a + b = 0.','P(−2) = 0 gives −8 − 2a + b = 0.','Subtract: 3a = −9.','Answer: a = −3, b = 2; P(x) = (x − 1)²(x + 2).')
K='quadratics'
eq(K,x*x-5*x+6)
add(K,'Complete the square in `x² + 6x + 5`.','Half of 6 is 3; 3² = 9.','x² + 6x + 5 = (x + 3)² − 9 + 5.','Answer: (x + 3)² − 4.')
add(K,'Find the minimum value of `x² − 4x + 7`.','Complete the square: (x − 2)² + 3.','The square is at least zero.','Answer: minimum 3, when x = 2.')
add(K,'Complete the square in `2x² + 8x + 3`.','Factor 2 out of the first two terms: 2(x² + 4x) + 3.','= 2[(x + 2)² − 4] + 3.','Answer: 2(x + 2)² − 5.')
eq(K,x*x+2*x-1);eq(K,3*x*x-2*x-1)
add(K,'The graph y = x² + px + q has turning point (2, −3). Find p and q.','Use square form y = (x − 2)² − 3.','Expand: x² − 4x + 1.','Answer: p = −4, q = 1.')
add(K,'Complete the square in `(1/2)x² − 3x + 1`.','Take out 1/2: (1/2)(x² − 6x) + 1.','= (1/2)[(x − 3)² − 9] + 1.','Answer: (1/2)(x − 3)² − 7/2.')
eq(K,2*x*x+x-4)
add(K,'For y = −2x² + 8x − 3, find the maximum value and where it occurs.','y = −2(x² − 4x) − 3.','= −2(x − 2)² + 5.','The square is at least zero; multiplying it by −2 makes it zero or negative.','Answer: maximum 5 at x = 2.')
K='discriminant'
for P in [x*x-3*x+2,x*x+2*x+1,x*x+x+1]:
 aa,bb,cc=S.Poly(P,x).all_coeffs();D=bb*bb-4*aa*cc
 ans='two different real roots' if D>0 else 'one repeated real root' if D==0 else 'no real roots'
 add(K,'How many real roots does `'+f(P)+' = 0` have?','D = b² − 4ac = '+f(D)+'.','Answer: '+ans+'.')
add(K,'Find k if `x² + 4x + k = 0` has equal roots.','Equal roots need D = 0.','16 − 4k = 0.','Answer: k = 4.')
add(K,'Find k if `x² + kx + 9 = 0` has two different real roots.','D = k² − 36. Two different roots need D > 0.','k² > 36.','Answer: k < −6 or k > 6.')
add(K,'For k ≠ 0, find k if `kx² + 2x + 1 = 0` has real roots.','D = 4 − 4k. Real roots need D ≥ 0.','k ≤ 1, but the question excludes k = 0.','Answer: k ≤ 1 and k ≠ 0.')
add(K,'Show that `x² − mx − 1 = 0` always has two different real roots for real m.','D = m² + 4.','m² ≥ 0, so D ≥ 4 > 0.','Answer: two different real roots for every real m.')
add(K,'Find k if `x² − 2(k + 1)x + k² = 0` has two different real roots.','D = 4(k + 1)² − 4k² = 4(2k + 1).','Need 2k + 1 > 0.','Answer: k > −1/2.')
add(K,'Find k if the line y = 2x + k touches the curve y = x² at one point.','At an intersection: x² − 2x − k = 0.','One point needs D = 4 + 4k = 0.','Answer: k = −1. The touching point is (1,1).')
add(K,'Find the range of `y = x/(x² + 1)` using the discriminant.','Rearrange: yx² − x + y = 0.','For y ≠ 0, D = 1 − 4y² ≥ 0, so −1/2 ≤ y ≤ 1/2.','For y = 0, x = 0 works too.','Answer: −1/2 ≤ y ≤ 1/2.')
K='identities'
add(K,'Is `x + 1 = 3` an identity? Explain.','It is true only when x = 2.','An identity must be true for every allowed x.','Answer: it is an equation, not an identity.')
add(K,'Find a,b,c if `ax² + bx + c ≡ (x + 2)²`.','Expand: (x + 2)² = x² + 4x + 4.','Match each power of x.','Answer: a = 1, b = 4, c = 4.')
add(K,'Find A,B,C if `Ax² + Bx + C ≡ x² + 5x − 2`.','Match x², x and the term with no x.','Answer: A = 1, B = 5, C = −2.')
add(K,'Find A and B if `A(x + 1) + B(x − 2) ≡ 3x + 5`.','x coefficients: A + B = 3. Constants: A − 2B = 5.','Subtract: −3B = 2.','Answer: B = −2/3, A = 11/3.')
add(K,'Find a,b,c if `ax² + bx + c ≡ (2x − 1)(x + 3)`.','Expand the right side: 2x² + 5x − 3.','Match coefficients.','Answer: a = 2, b = 5, c = −3.')
add(K,'Find A,B,C if `2x² + 3x + 5 ≡ A(x − 1)² + B(x − 1) + C`.','Expand the right side: Ax² + (B − 2A)x + A − B + C.','A = 2; B − 4 = 3, so B = 7.','2 − 7 + C = 5.','Answer: A = 2, B = 7, C = 10.')
add(K,'Find a and b if `(x + a)(x + b) ≡ x² + 7x + 10`.','Match coefficients: a + b = 7 and ab = 10.','The pair 2 and 5 has this sum and product.','Answer: (a,b) = (2,5) or (5,2).')
add(K,'Someone checks x = 0 in x² ≡ x and says it is an identity. Explain the mistake.','Both sides are zero at x = 0, but one value is not enough.','At x = 2, the left side is 4 and the right side is 2.','Answer: it is not an identity.')
add(K,'Find A,B,C if `x³ + 2x² − x − 2 ≡ (x + 2)(Ax² + Bx + C)`.','Expand the right side: Ax³ + (2A + B)x² + (2B + C)x + 2C.','Match: A = 1; 2A + B = 2 gives B = 0.','2C = −2 gives C = −1.','Answer: A = 1, B = 0, C = −1.')
add(K,'Show that `(x − 1)³ + 3(x − 1)² + 3(x − 1) + 1 ≡ x³`.','Expand each bracket: x³ − 3x² + 3x − 1 + 3x² − 6x + 3 + 3x − 3 + 1.','The x² terms, x terms and constants cancel.','Answer: the left side is x³ for every x, so it is an identity.')
K='simultaneous'
for eq1,eq2 in [(x+y-5,x-y-1),(2*x+y-7,x-y-2)]:
 sol=S.solve([eq1,eq2],[x,y]);assert all(S.simplify(e.subs(sol))==0 for e in [eq1,eq2])
 add(K,'Solve `'+f(eq1)+' = 0` and `'+f(eq2)+' = 0`.','Rearrange one equation to make y the subject.','Put that y expression into the other equation.','Answer: x = '+f(sol[x])+', y = '+f(sol[y])+'.')
def simultaneous(line,curve):
 xs=S.solve(curve.subs(y,line),x)
 pairs=[(r,S.simplify(line.subs(x,r))) for r in xs]
 assert all(S.simplify(curve.subs({x:r,y:t}))==0 for r,t in pairs)
 add(K,'Solve `y = '+f(line)+'` and `'+f(curve)+' = 0`.','Replace y in the second equation by '+f(line)+'.','Simplify to '+f(S.expand(curve.subs(y,line)))+' = 0.','Solve for x, then use the line to find the matching y.','Answer: '+ ' or '.join('('+f(r)+', '+f(t)+')' for r,t in pairs)+'.')
simultaneous(2*x,x*x+y*y-20)
simultaneous(x+1,x*x+y*y-13)
simultaneous(2*x-1,y-x*x+2)
simultaneous(5-x,x*y-6)
simultaneous(3-x,y-x*x+3)
simultaneous(2*x+3,x*x+y*y-5)
simultaneous(S.Rational(1,2)*x,y-x*x+1)
add(K,'For real m, solve `y = mx + 1` and `x² + y² = 1`.','Replace y: (1 + m²)x² + 2mx = 0.','x[(1 + m²)x + 2m] = 0.','x = 0 or x = −2m/(1 + m²).','Answer: (0,1) and (−2m/(1 + m²), (1 − m²)/(1 + m²)). If m = 0, these are the same point.')
K='partial-fractions'
for expr in [1/(x*(x+1)),5/((x+1)*(x+6)),(2*x+3)/((x+1)*(x+2)),(3*x+5)/((x+1)*(x+2)),1/(x*x-4),(x+4)/((2*x+1)*(x+1)),(2*x-1)/((x-2)*(x+3)),1/(x*(x-1)*(x+1)),(3*x*x+1)/(x*(x+1)*(x+2)),(2*x+3)/((x-1)*(x+2))]:partial(K,expr)
K='advanced-partial'
for expr in [1/(x*(x+1)**2),(x+2)/(x+1)**2,x*x/(x+1),(2*x+3)/(x*(x+1)**2),(x+1)/(x*(x*x+1)),(x*x+1)/(x*(x+1)),(2*x+3)/((x-1)*(x*x+1)),(x**4+1)/(x*x+1),x**3/(x*x-5*x+6),(2*x-3)/(x*x*(x*x-4))]:partial(K,expr)
K='inequalities'
for expr,sign in [(x-2,'>'),(-2*x-4,'>'),(x*x-1,'<'),(x*x-5*x+6,'≤'),((x-1)*(x+4),'>'),((x+2)**2*(x-3),'≥'),(x**3-x,'<'),(x**4-5*x*x+4,'≤'),(x*x-4*x-5,'≥'),(6*x*x-24*x-25,'>')]:ineq(K,expr,sign)
K='rational-inequalities'
for expr,sign in [(1/x,'>'),(x/(x-2),'<'),((x-1)/(x+2),'≥'),((x+2)/(x-1),'≤'),(1/((x-1)*(x+3)),'>'),((x-2)**2/(x+1),'≥'),(x/(x*x-4),'≥'),(1/(x-1)-2,'>'),((x-1)/(x+2)-1,'≥'),((x*x-1)/(x-2),'<')]:ineq(K,expr,sign)
K='functions'
add(K,'f(x) = 2x + 1. Find f(3).','Put 3 in place of x: 2 × 3 + 1.','Answer: f(3) = 7.')
add(K,'f(x) = 2x + 1 and g(x) = x². Find f(g(x)).','Use g first: its answer is x².','Put x² into f: 2x² + 1.','Answer: f(g(x)) = 2x² + 1.')
add(K,'Find the inverse of f(x) = 3x − 2.','y = 3x − 2 gives x = (y + 2)/3.','Swap the input and output names.','Answer: f⁻¹(x) = (x + 2)/3.')
add(K,'Find the inverse of f(x) = x² for x ≥ 0, and state its domain.','y = x². Since x ≥ 0, x = √y.','The outputs of f are all y ≥ 0.','Answer: f⁻¹(x) = √x, with domain x ≥ 0.')
add(K,'Find the inverse of f(x) = √(x − 2), and state its domain.','The original rule needs x ≥ 2 and gives y ≥ 0.','Square y = √(x − 2): x = y² + 2.','Answer: f⁻¹(x) = x² + 2, domain x ≥ 0, range y ≥ 2.')
add(K,'f(x) = 1/(x + 2), g(x) = x − 1. Find f(g(x)) and its domain.','Replace x in f with x − 1.','f(g(x)) = 1/(x + 1). The bottom cannot be zero.','Answer: 1/(x + 1), domain x ≠ −1.')
add(K,'f(x) = 2x + 1, g(x) = x². Find f(g(2)) and g(f(2)).','g(2) = 4, then f(4) = 9.','f(2) = 5, then g(5) = 25.','Answer: 9 and 25. Changing the order changes the answer.')
add(K,'Find the inverse of f(x) = (2x + 1)/(x − 3), with x ≠ 3.','y(x − 3) = 2x + 1.','x(y − 2) = 3y + 1.','x = (3y + 1)/(y − 2).','Answer: f⁻¹(x) = (3x + 1)/(x − 2), domain x ≠ 2.')
add(K,'For f(x) = x² on all real x, explain why an inverse function is not possible without limiting the domain.','Both x = 2 and x = −2 give output 4.','The inverse would have to give two answers for input 4.','Answer: limit the domain, for example to x ≥ 0; then the inverse is √x.')
add(K,'f(x) = x + 1 and g(x) = √x. Find the domain of g(f(x)) and f(g(x)).','g(f(x)) = √(x + 1), so x + 1 ≥ 0.','f(g(x)) = √x + 1, so x ≥ 0.','Answer: g(f(x)) needs x ≥ −1; f(g(x)) needs x ≥ 0.')
K='exponentials'
for base,exp,answer in [(2,'x','3'),(4,'x','1/2'),(5,'x − 1','3')]:
 target={2:8,4:2,5:25}[base]
 add(K,f'Solve `{base}^({exp}) = {target}`.',f'Write {target} using the same base {base}.','Match the powers and solve for x.',f'Answer: x = {answer}.')
add(K,'Solve `2^(2x+1) = 16`.','16 = 2⁴, so 2x + 1 = 4.','2x = 3.','Answer: x = 3/2.')
add(K,'A population starts at 200 and grows by 10% each hour. Find the model value after 3 hours.','Each hour multiply by 1.1.','N(3) = 200(1.1)³ = 266.2.','Answer: model value 266.2, about 266 whole individuals.')
add(K,'A value of 1000 decreases by 20% each year. Find its value after 2 years.','The yearly multiplier is 1 − 20/100 = 0.8.','Value = 1000(0.8)².','Answer: 640.')
add(K,'Solve `e^x = 7` exactly.','Take ln of both sides.','ln(e^x) = x.','Answer: x = ln 7.')
add(K,'N(t) = 500e^(−0.2t). Find the time when N is half its starting value.','250 = 500e^(−0.2t), so e^(−0.2t) = 1/2.','−0.2t = ln(1/2) = −ln 2.','Answer: t = 5 ln 2, about 3.47 time units.')
add(K,'Solve `e^(2x) − 5e^x + 6 = 0`.','Put u = e^x, so u > 0.','u² − 5u + 6 = (u − 2)(u − 3) = 0.','u = 2 or 3.','Answer: x = ln 2 or x = ln 3.')
add(K,'A population follows P(n) = 100(1.2)^n. Find the first whole year when P exceeds 200.','1.2^n > 2, so n > ln 2/ln 1.2.','ln 2/ln 1.2 is about 3.802.','Answer: year 4; year 3 is below 200 and year 4 is above 200.')
K='logarithms'
add(K,'Evaluate log₂ 32.','2⁵ = 32.','Answer: log₂ 32 = 5.')
add(K,'Evaluate ln(e³).','ln undoes the power of e.','Answer: 3.')
add(K,'Evaluate log₁₀ 0.01.','0.01 = 10^(−2).','Answer: −2.')
add(K,'Solve `log₂(x − 1) = 3`.','The log needs x > 1.','x − 1 = 2³ = 8.','Answer: x = 9, which is allowed.')
add(K,'Solve `ln(x − 1) + ln(x + 1) = ln 8`.','Both log inputs must be positive, so x > 1.','ln(x² − 1) = ln 8, so x² = 9.','x = 3 or −3; only 3 has x > 1.','Answer: x = 3.')
add(K,'Solve `log₃ x + log₃(x − 2) = 1`.','Need x > 2. Combine logs: log₃[x(x − 2)] = 1.','x² − 2x = 3, so (x − 3)(x + 1) = 0.','Reject −1 because x > 2.','Answer: x = 3.')
add(K,'Using logarithm base 1/2, solve `log(x + 1) > 2`.','Need x + 1 > 0. The base 1/2 is between zero and 1, so reverse the comparison.','x + 1 < (1/2)² = 1/4.','Answer: −1 < x < −3/4.')
add(K,'Solve `log₂ x + log₄ x = 3`.','Need x > 0. Put u = log₂ x.','log₄ x = u/2, so u + u/2 = 3.','u = 2, so x = 2².','Answer: x = 4.')
add(K,'Solve `ln(x − 2) ≥ ln(5 − x)`.','The logs need 2 < x < 5.','ln is increasing, so x − 2 ≥ 5 − x.','x ≥ 7/2.','Answer: 7/2 ≤ x < 5.')
add(K,'Solve `log₂ x = log₂(6 − x) + 1`.','Both log inputs need 0 < x < 6.','1 = log₂ 2, so log₂ x = log₂[2(6 − x)].','x = 12 − 2x.','Answer: x = 4, which is allowed.')
K='linearising'
add(K,'For y = 3x², x > 0, find the slope and intercept when ln y is plotted against ln x.','ln y = ln 3 + 2 ln x.','Compare with vertical value = slope × horizontal value + intercept.','Answer: slope 2, intercept ln 3.')
add(K,'For y = 5e^(−0.2x), find the slope and intercept when ln y is plotted against x.','ln y = ln 5 − 0.2x.','Read the x coefficient and constant.','Answer: slope −0.2, intercept ln 5.')
add(K,'A plot of ln y against ln x has slope 3 and intercept ln 4. Find y in terms of x.','ln y = 3 ln x + ln 4 = ln(4x³).','Undo ln.','Answer: y = 4x³, for x > 0.')
add(K,'y = AB^x has y = 6 when x = 1 and y = 18 when x = 2. Find A and B > 0.','AB = 6 and AB² = 18.','Divide: B = 3. Then A = 2.','Answer: y = 2 × 3^x.')
add(K,'y = Ax^n, x > 0. y = 12 when x = 2 and y = 48 when x = 4. Find A and n.','A × 2^n = 12; A × 4^n = 48.','Divide: 2^n = 4, so n = 2.','Answer: A = 3; y = 3x².')
add(K,'Write the model when ln y = (1/2)ln x + ln 8.','(1/2)ln x = ln(√x), with x > 0.','ln y = ln(8√x).','Answer: y = 8√x.')
add(K,'y = ax² + bx. The points are (1,3), (2,8), (3,15). Use a straight-line form to find a and b.','Divide by x: y/x = ax + b.','The pairs (x, y/x) are (1,3), (2,4), (3,5).','Slope = 1, intercept = 2.','Answer: a = 1, b = 2.')
add(K,'A plot of ln y against ln x has slope −2 and intercept ln 9. Find the model.','ln y = −2 ln x + ln 9 = ln(9/x²).','Undo ln.','Answer: y = 9/x², for x > 0.')
add(K,'For y = a × 2^x, the point (x, ln y) is (0, ln 7). Find a and the slope of the ln y graph.','ln y = ln a + x ln 2.','At x = 0, ln a = ln 7.','Answer: a = 7 and slope = ln 2.')
add(K,'A plot of log₁₀ y against x has slope 2 and intercept 3. Find the model.','log₁₀ y = 2x + 3.','y = 10^(2x+3) = 1000 × 100^x.','Answer: y = 1000 × 100^x.')
K='rational-functions'
add(K,'For f(x) = 1/(x − 2), state the domain and both asymptotes.','The bottom is zero at x = 2.','For very large |x|, the fraction gets close to zero.','Answer: x ≠ 2; vertical asymptote x = 2; horizontal asymptote y = 0.')
add(K,'For f(x) = 2/(x + 1) + 3, state the range and both asymptotes.','The fraction never equals zero, so f(x) never equals 3.','The bottom is zero at x = −1.','Answer: y ≠ 3; asymptotes x = −1 and y = 3.')
add(K,'For y = x/(x − 1), find the intercepts.','Set x = 0: y = 0.','Set y = 0: the top x must be zero.','Answer: the graph crosses both axes at (0,0); x = 1 is excluded.')
add(K,'Simplify `(x² − 1)/(x − 1)` and describe its missing point.','Factor x² − 1 = (x − 1)(x + 1).','Cancel x − 1, but x = 1 is still excluded.','Answer: y = x + 1 with a hole at (1,2).')
add(K,'Find the range of y = 1/(x² + 1) for real x.','x² + 1 ≥ 1, so the fraction is positive and at most 1.','At x = 0, y = 1. As |x| grows, y approaches zero without reaching it.','Answer: 0 < y ≤ 1.')
add(K,'Find the range of y = 1/(x² − 4), excluding x = ±2.','The bottom takes values from −4 upwards, except zero.','Negative bottoms run from −4 to zero: y ≤ −1/4. Positive bottoms give y > 0.','Answer: y ≤ −1/4 or y > 0.')
add(K,'Find the inverse of f(x) = (2x + 1)/(x − 3).','y(x − 3) = 2x + 1.','x = (3y + 1)/(y − 2).','Answer: f⁻¹(x) = (3x + 1)/(x − 2), with x ≠ 2.')
add(K,'Find the range of y = x/(x² + 1).','For y ≠ 0, rearrange to yx² − x + y = 0.','Real x needs 1 − 4y² ≥ 0. Also y = 0 is reached at x = 0.','Answer: −1/2 ≤ y ≤ 1/2, with end values reached at x = ±1.')
add(K,'For f(x) = (x² − 4)/(x − 2), is f(2) equal to 4? Explain.','For x ≠ 2, cancel x − 2 to get f(x) = x + 2.','The original bottom is zero at x = 2, so f(2) is not defined.','Answer: no. There is a hole at (2,4).')
add(K,'For y = (2x + 1)/(x − 1), find the domain, range and intercepts.','y = 2 + 3/(x − 1), so x ≠ 1 and y ≠ 2.','At x = 0, y = −1. At y = 0, x = −1/2.','Answer: domain x ≠ 1; range y ≠ 2; intercepts (0,−1) and (−1/2,0).')
K='modulus'
add(K,'Evaluate |−7|.','Modulus is distance from zero.','Answer: 7.')
add(K,'Solve |x − 1| = 3.','x − 1 = 3 or x − 1 = −3.','Answer: x = 4 or x = −2.')
add(K,'Solve |x + 2| < 4.','−4 < x + 2 < 4.','Subtract 2 from every part.','Answer: −6 < x < 2.')
add(K,'Solve |2x − 1| ≥ 5.','2x − 1 ≤ −5 or 2x − 1 ≥ 5.','Solve both parts.','Answer: x ≤ −2 or x ≥ 3.')
add(K,'Solve |x − 3| = x + 1.','The right side must be zero or positive, so x ≥ −1.','For x ≥ 3, x − 3 = x + 1 has no answer.','For x < 3, 3 − x = x + 1 gives x = 1.','Answer: x = 1; checking gives 2 = 2.')
add(K,'For y = |x − 2| + 1, state the corner and range.','The modulus is smallest when x − 2 = 0.','Then x = 2 and y = 1.','Answer: corner (2,1); range y ≥ 1.')
add(K,'Solve |x| + |x − 2| = 2.','Between 0 and 2: x + (2 − x) = 2 for every x.','For x < 0 the sum is 2 − 2x > 2. For x > 2 it is 2x − 2 > 2.','Answer: 0 ≤ x ≤ 2.')
add(K,'Solve |x − 1| > |2x + 3|.','Both sides are zero or positive, so square them.','(x − 1)² > (2x + 3)² gives 3x² + 14x + 8 < 0.','(3x + 2)(x + 4) < 0.','Answer: −4 < x < −2/3.')
add(K,'Solve |x + 1| ≤ 2x − 1.','The right side must be zero or positive, so x ≥ 1/2.','Then x + 1 is positive: x + 1 ≤ 2x − 1.','Answer: x ≥ 2.')
add(K,'Find where y = |x| and y = x/2 + 1 meet.','For x ≥ 0: x = x/2 + 1 gives x = 2, y = 2.','For x < 0: −x = x/2 + 1 gives x = −2/3, y = 2/3.','Answer: (2,2) and (−2/3,2/3).')
# Ten mixed revision questions drawn from ten different skills.
K='revision'
for key,index in [('indices',0),('rational-indices',2),('direct-inverse',2),('quadratics',4),('functions',5),('partial-fractions',3),('inequalities',5),('discriminant',7),('linearising',6),('modulus',7)]:
 item=json.loads(json.dumps(B[key][index]));B.setdefault(K,[]).append(item)
assert len(B)==22,len(B)
for key,items in B.items():
 assert len(items)==10,(key,len(items))
 assert len({i['lines'][0] for i in items})==10,key
 for i,item in enumerate(items):item['level']='Easy' if i<3 else 'Medium' if i<7 else 'Hard'
names={'indices':'Laws of Indices','rational-indices':'Rational Indices','direct-inverse':'Direct and Inverse Variation','joint-partial':'Joint and Partial Variation','polynomials':'Polynomial Operations','division':'Polynomial Division','factor-remainder':'Factor and Remainder Theorems','quadratics':'Quadratics and Square Form','discriminant':'The Discriminant','identities':'Identities and Coefficients','simultaneous':'Simultaneous Equations','partial-fractions':'Partial Fractions','advanced-partial':'Repeated and Improper Fractions','inequalities':'Polynomial Inequalities','rational-inequalities':'Rational Inequalities','functions':'Functions and Inverses','exponentials':'Exponential Functions','logarithms':'Logarithms','linearising':'Making a Straight-Line Graph','rational-functions':'Rational Functions','modulus':'Modulus','revision':'Mixed Revision'}
for key,items in B.items():
 for item in items:item['topic']=names[key]
Path('src/features/courses/a-level/lower-6/pure-mathematics/algebraPracticeBank.json').write_text(json.dumps(B,ensure_ascii=False,indent=2)+'\n')
print('Generated 220 worked practice candidates across 22 sections; exact polynomial, partial fraction, equation and inequality computations checked with SymPy.')
