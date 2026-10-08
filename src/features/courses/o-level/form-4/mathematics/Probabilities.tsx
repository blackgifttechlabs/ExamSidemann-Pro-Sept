import React from 'react';
import { LessonPage, type LessonSection } from './LessonPage';
import { PROBABILITY_DIAGRAMS } from './probabilityDiagrams';
import { BASICS_LESSON, MUTUAL_LESSON, INDEPENDENT_LESSON, TREES_LESSON, PROBABILITY_LIBRARY_LESSON } from './probabilityLessonData';

const SECTIONS: LessonSection[] = [
    {
        id: 'basics',
        eyebrow: '',
        title: 'The Basics',
        heading: 'Probability: the Basics',
        intro: 'Start here. Learn what probability means and how to work it out.',
        lesson: BASICS_LESSON,
    },
    {
        id: 'mutually-exclusive',
        eyebrow: '',
        title: 'Mutually Exclusive',
        heading: 'Mutually Exclusive Events (OR)',
        intro: 'When two events cannot happen together, add their probabilities.',
        lesson: MUTUAL_LESSON,
    },
    {
        id: 'independent',
        eyebrow: '',
        title: 'Independent Events',
        heading: 'Independent Events (AND)',
        intro: 'When one event does not change the other, multiply their probabilities.',
        lesson: INDEPENDENT_LESSON,
    },
    {
        id: 'tables-trees',
        eyebrow: '',
        title: 'Tables & Trees',
        heading: 'Possibility Tables and Tree Diagrams',
        intro: 'Draw every outcome so nothing is missed.',
        lesson: TREES_LESSON,
    },
    {
        id: 'example-library',
        eyebrow: 'Reference',
        title: 'Example Library',
        heading: 'Past-Paper Question Library',
        intro: 'Every probability question found in the ZIMSEC papers we checked, worked step by step.',
        lesson: PROBABILITY_LIBRARY_LESSON,
    },
];

export const Probabilities = () => (
    <LessonPage
        id="cg-scroll-area"
        accent="violet"
        title="Probability (2) – Combined Probabilities"
        subtitle={{
            en: 'Combining events: mutually exclusive, independent, and using tables and tree diagrams.',
            sn: 'Kubatanidza zviitiko: zvinopindirana, zvinenge zvinorambana, uye kushandisa matafura nemiti yemikana.',
        }}
        sections={SECTIONS}
        diagrams={PROBABILITY_DIAGRAMS}
    />
);
