import React from 'react';
import { LessonPage, type LessonSection } from './LessonPage';
import { EQUATION_DIAGRAMS } from './equationDiagrams';
import {
    LINEAR_LESSON, BRACKETS_LESSON, FRACTIONS_LESSON, BOTH_SIDES_LESSON, SIMULTANEOUS_LESSON,
    QUADRATIC_INTRO_LESSON, FACTORISING_LESSON, SOLVE_FACTOR_LESSON, COMPLETE_SQUARE_LESSON,
    FORMULA_LESSON, DISCRIMINANT_LESSON, SIM_QUAD_LESSON, WORD_LESSON, SUBJECT_LESSON,
    SUBSTITUTION_LESSON, EQUATIONS_LIBRARY,
} from './equationLessonData';

const SECTIONS: LessonSection[] = [
    { id: 'linear', title: 'Linear Equations', heading: 'Linear Equations', intro: 'Solve an equation by doing the same thing to both sides.', lesson: LINEAR_LESSON },
    { id: 'brackets', title: 'Brackets', heading: 'Equations Involving Brackets', intro: 'Expand the brackets first, then solve.', lesson: BRACKETS_LESSON },
    { id: 'fractions', title: 'Fractions', heading: 'Equations Involving Fractions', intro: 'Clear the fractions first, then solve.', lesson: FRACTIONS_LESSON },
    { id: 'both-sides', title: 'Unknown on Both Sides', heading: 'Equations with the Unknown on Both Sides', intro: 'Collect the x terms on one side and the numbers on the other.', lesson: BOTH_SIDES_LESSON },
    { id: 'simultaneous', title: 'Simultaneous Linear', heading: 'Simultaneous Linear Equations', intro: 'Two equations, two unknowns. Find the pair that works for both.', lesson: SIMULTANEOUS_LESSON },
    { id: 'quadratic', title: 'Quadratic Equations', heading: 'Quadratic Equations', intro: 'Equations with an x² term, and how to put them in standard form.', lesson: QUADRATIC_INTRO_LESSON },
    { id: 'factorising', title: 'Factorising Quadratics', heading: 'Factorising Quadratic Expressions', intro: 'Turn a quadratic into two brackets.', lesson: FACTORISING_LESSON },
    { id: 'solve-factorising', title: 'Solving by Factorisation', heading: 'Solving Quadratic Equations by Factorisation', intro: 'Factorise, then use the zero rule.', lesson: SOLVE_FACTOR_LESSON },
    { id: 'completing-square', title: 'Completing the Square', heading: 'Completing the Square', intro: 'Rewrite a quadratic as a perfect square, then solve.', lesson: COMPLETE_SQUARE_LESSON },
    { id: 'formula', title: 'Quadratic Formula', heading: 'The Quadratic Formula', intro: 'The method that always works.', lesson: FORMULA_LESSON },
    { id: 'discriminant', title: 'Discriminant', heading: 'The Discriminant', intro: 'Find how many answers a quadratic has, without solving it.', lesson: DISCRIMINANT_LESSON },
    { id: 'sim-quadratic', title: 'Linear & Quadratic', heading: 'Simultaneous Linear and Quadratic Equations', intro: 'Find where a line meets a curve.', lesson: SIM_QUAD_LESSON },
    { id: 'word-problems', title: 'Word Problems', heading: 'Equations from Word Problems', intro: 'Turn the words into an equation, then solve it.', lesson: WORD_LESSON },
    { id: 'subject', title: 'Changing the Subject', heading: 'Changing the Subject of a Formula', intro: 'Rearrange a formula so a different letter is on its own.', lesson: SUBJECT_LESSON },
    { id: 'substitution', title: 'Substitution', heading: 'Substitution into Formulae', intro: 'Put numbers in place of letters and work out the answer.', lesson: SUBSTITUTION_LESSON },
    { id: 'example-library', eyebrow: 'Reference', title: 'Example Library', heading: 'Past-Paper Question Library', intro: 'Every equation question from the ZIMSEC papers we checked, worked step by step.', lesson: EQUATIONS_LIBRARY },
];

export const Equations = () => (
    <LessonPage
        id="eq-scroll-area"
        accent="violet"
        title="Equations"
        subtitle={{
            en: 'From simple linear equations to quadratics, simultaneous equations, formulae and word problems, explained step by step.',
            sn: 'Kubva pamaequation akareruka kusvika pamaquadratic, simultaneous equations, maformula nenyaya dzemashoko, zvakatsanangurwa nhanho nenhanho.',
        }}
        sections={SECTIONS}
        diagrams={EQUATION_DIAGRAMS}
    />
);

export default Equations;
