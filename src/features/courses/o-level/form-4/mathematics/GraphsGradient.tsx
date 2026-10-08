import React from 'react';
import { LessonPage, type LessonSection } from './LessonPage';
import { GRAPH_DIAGRAMS } from './graphDiagrams';
import { GRADIENT_BASICS, GRADIENT_LINES, GRADIENT_EQUATION, GRADIENT_CURVES, GRADIENT_LIBRARY } from './graphLessonData';

const SECTIONS: LessonSection[] = [
    {
        id: 'gradient-basics',
        title: 'Gradient of a Line',
        heading: 'Gradient of a Straight Line',
        intro: 'Learn what gradient means and how to work it out from two points.',
        lesson: GRADIENT_BASICS,
    },
    {
        id: 'graphing-equations',
        title: 'Drawing Lines',
        heading: 'Drawing and Reading Lines: y = mx + c',
        intro: 'Read the gradient and the y-intercept from an equation, and draw the line.',
        lesson: GRADIENT_LINES,
    },
    {
        id: 'equation-of-line',
        title: 'Equation of a Line',
        heading: 'Finding the Equation of a Straight Line',
        intro: 'Work out the equation from a gradient and a point, from two points, or for a parallel line.',
        lesson: GRADIENT_EQUATION,
    },
    {
        id: 'gradient-of-curve',
        title: 'Gradient of a Curve',
        heading: 'Gradient of a Curve',
        intro: 'Use a tangent to find how steep a curve is at one point.',
        lesson: GRADIENT_CURVES,
    },
    {
        id: 'example-library',
        eyebrow: 'Reference',
        title: 'Example Library',
        heading: 'Past-Paper Question Library',
        intro: 'Every gradient question found in the ZIMSEC papers we checked, worked step by step.',
        lesson: GRADIENT_LIBRARY,
    },
];

export const GraphsGradient = () => (
    <LessonPage
        id="gr-scroll-area"
        accent="sky"
        title="Graphs & Gradient"
        subtitle={{
            en: 'Drawing and interpreting straight-line graphs, finding equations, and reading the gradient of a curve.',
            sn: 'Kudhirowa nekutsanangura magraph emutsetse wakatwasuka, kutsvaga equation, uye kuverenga gradient yekakona.',
        }}
        sections={SECTIONS}
        diagrams={GRAPH_DIAGRAMS}
    />
);

export default GraphsGradient;
