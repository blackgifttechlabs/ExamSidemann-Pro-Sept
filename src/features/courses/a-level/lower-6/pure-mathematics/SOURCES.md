# Lower 6 Pure Mathematics: Algebra

## Curriculum source

User-provided `Zimsec A Level Pure Maths Syllabus 2022.pdf` in
`/home/watchman-admin/Documents/scribd/scribdl-py/output`.
This is a 37-page scanned document; text extraction returned no usable text.
Pages were rendered and read visually:

- PDF page 7 / printed page 3: seven full-course topic headings.
- PDF page 8 / printed page 4: Algebra scope and sequence, Form 5 column.
- PDF pages 14–15 / printed pages 10–11: complete Form 5 Algebra competency matrix.
- PDF page 13 / printed page 9: Numerical Methods is Form 6 only; Complex Numbers has Form 5 content.

Lower 6 lists six topics in the syllabus order, omitting Form 6-only Numerical
Methods. Only Algebra is implemented. Rational and modulus functions and their
inequalities are included because they are explicitly in the Form 5 competency
matrix even though the shorter scope-and-sequence table lists only logarithmic
and exponential functions.

## Original ZIMSEC question scans

Downloaded and visually inspected on 9 October 2026. Mathematical data and
question numbers were transcribed from the actual scans, not the host site's
summaries. Wording is condensed. Original PDFs are linked from the lesson;
they are not redistributed in the repository.

- [June 2020, 6042/1](https://sytbay.co.zw/downloads/zimsec-a-level-pure-mathematics-paper-1-6042-1-june-2020-pdf/): printed pages 2–3, Q1, Q3, Q7, Q8, Q11, Q12(a).
- [November 2021, 6042/1](https://sytbay.co.zw/downloads/zimsec-a-level-pure-mathematics-paper-1-6042-1-november-2021-pdf/): printed pages 2–3, Q1, Q4, Q5, Q8(a,b), Q10, Q11(a,b).

- [June 2024, 6042/1](https://unopasa.com/zimbabwe/a-level/pure-mathematics/question-papers/zimsec-paper-1-june-2024-dowikru): original scanned pages 2–3, Q2–5, Q9(a–c), Q11(a)(ii).
- [November 2024, 6042/1](https://unopasa.com/zimbabwe/a-level/pure-mathematics/question-papers/zimsec-paper-1-november-2024-adwpdhh): original scanned pages 2–4, Q1, Q3–6, Q11(a,b), Q16.
- November 2021 Q13(a), scanned page 4: simultaneous line and rational curve.

Each of 22 Algebra sections has ten answered questions (220 cards), mixing
Easy, Medium and Hard. Verified questions carry the session, question number
and original scan link. Original practice is explicitly labelled. Related
questions are identified as related; where no direct question was found, the
lesson says so. This is a checked sample, not exhaustive coverage or a forecast.
Solutions are original teaching solutions, not official mark schemes.

`python3 scripts/generateLower6AlgebraPractice.py` reproducibly generates the
practice candidates with SymPy checks of polynomial identities, division,
partial fractions, equation solutions and inequality intervals. The final bank
mixes selected candidates with verified paper questions.

Teaching examples play automatically with controls below their question.
Question cards reveal and start worked solutions only on “Show me working”.

## Mathematical reference

[OpenStax Precalculus 2e](https://openstax.org/books/precalculus-2e/pages/1-introduction-to-functions),
especially polynomial division (3.5), factor and remainder theorems (3.6),
logarithmic functions (4.3), exponential/logarithmic equations (4.6) and partial
fractions (9.4). Explanations and teaching examples in this lesson are original.

Original ZIMSEC question workings include 66 authored calculation scenes across
29 distinct questions (some questions appear in more than one relevant section).
Red terms travel from measured positions in the displayed source expression to
the calculation; the result keeps the SVG pen-stroke writing. Pause, replay and
speed share the working clock. Solutions remain click-to-start.

# Lower 6 Pure Mathematics: Geometry and Vectors (topic 2)

## What was and was not verified

The 2022 syllabus PDF and the ZIMSEC past papers could not be opened while building this
topic: the sandbox blocks the paper sites and page fetches failed. Web search returned only
snippets, so **no past-paper question is reproduced and none is labelled as a ZIMSEC question.**

- Topic order follows `src/data/constants.ts` (Algebra, **Geometry and Vectors**, Series and
  Sequences, Trigonometry, Calculus, Complex Numbers).
- Scope was written from the usual A Level scope for this heading, not read from the syllabus
  text: distance, midpoint and gradient; line equations; parallel and perpendicular lines;
  circles; tangents, normals and line–circle intersections; vectors in 2D and 3D; position
  vectors and ratios; the scalar product; vector lines, intersections, skew lines and distance
  from a point to a line. **Circles may sit in a different year or paper of the real syllabus,
  and planes (not included) may belong here. Please check the scope against the syllabus PDF.**
- Search pointed to the ZIMSEC 6042/2 examiner reports and specimen paper as places where
  vector, line and plane questions appear. Only the November 2022 examiner report link is shown
  in the lesson, and it was not opened.

## Practice bank

`python3 scripts/generateLower6GeometryPractice.py` writes `geometryPracticeBank.json`: 11 sections ×
10 questions (110), mixing Easy, Medium and Hard. Every numerical answer is computed with SymPy
from the chosen numbers; the written steps were then read through by hand. Cards say they are
practice questions. 21 steps have number-travel animations generated alongside them; each
animated expression must appear in the written step or generation fails.

## Replacing practice cards with verified paper questions

When the papers are available, add verified questions as `kind: 'past-paper'` cards (with
`sourceUrl`) in `geometryQuestionBanks.ts`, as Algebra does. The question-set heading then
switches to "What ZIMSEC has asked before" automatically.

# Lower 6 Pure Mathematics: Series and Sequences (topic 3)

## What was and was not verified

As for Geometry and Vectors, the syllabus PDF and the ZIMSEC past papers could not be opened,
so **no past-paper question is reproduced and none is labelled as a ZIMSEC question.**

- Scope was written from the usual A Level scope for this heading, not read from the syllabus
  text: sequences and notation; arithmetic and geometric progressions; sum to infinity;
  sigma notation and the standard sums; the method of differences; the binomial expansion for
  positive integer n and for other n; recurrence relations, limits and fixed-point iteration.
  **Some of these (for example the binomial series for any n, or iteration) may sit in Form 6
  in the real syllabus, and Maclaurin series and proof by induction are not included. Please
  check the scope against the syllabus PDF.**

## Practice bank

`python3 scripts/generateLower6SeriesPractice.py` writes `seriesPracticeBank.json`: 10 sections ×
10 questions (100). Closed forms (sums, telescoping results, binomial series, recurring decimals)
are verified with SymPy assertions while generating; numeric answers are computed, not typed.
The written steps were then read through by hand. Cards say they are practice questions.
Number-travel animations are generated alongside the steps and checked against the written step.

## Shared code

`lowerSixLessonKit.ts` holds the lesson helpers (worked example, practice list, animation
pairing, section builder). `geometryDiagrams.tsx` exports the coordinate-plane drawing helpers
used by `seriesDiagrams.tsx`; `Plane` accepts `equal`, `xStep` and `yStep` for non-square axes.
