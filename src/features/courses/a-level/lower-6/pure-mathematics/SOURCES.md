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
