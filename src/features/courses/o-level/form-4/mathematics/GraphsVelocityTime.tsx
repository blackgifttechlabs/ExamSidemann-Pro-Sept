import React from 'react';
import { LessonPage, type LessonSection } from './LessonPage';
import { GRAPH_DIAGRAMS } from './graphDiagrams';
import { SPEED_READING, SPEED_ACCELERATION, SPEED_DISTANCE, SPEED_FORMULA, SPEED_DISTANCE_TIME, SPEED_LIBRARY } from './graphLessonData';

const SECTIONS: LessonSection[] = [
    {
        id: 'reading',
        title: 'Reading the Graph',
        heading: 'Speed-Time Graphs',
        intro: 'See what each shape on a speed-time graph means, and what acceleration is.',
        lesson: SPEED_READING,
    },
    {
        id: 'acceleration',
        title: 'Acceleration',
        heading: 'Finding Acceleration from the Gradient',
        intro: 'Use the gradient of a line to find acceleration and deceleration.',
        lesson: SPEED_ACCELERATION,
    },
    {
        id: 'distance',
        title: 'Distance & Average Speed',
        heading: 'Distance from the Area',
        intro: 'Find the distance travelled from the area under the graph, then the average speed.',
        lesson: SPEED_DISTANCE,
    },
    {
        id: 'formula',
        title: 'Speed from a Formula',
        heading: 'When the Speed is Given by a Formula',
        intro: 'Put a time or a speed into the formula to find the other.',
        lesson: SPEED_FORMULA,
    },
    {
        id: 'distance-time',
        title: 'Distance-Time Graphs',
        heading: 'Distance-Time Graphs',
        intro: 'Here the gradient is the speed.',
        lesson: SPEED_DISTANCE_TIME,
    },
    {
        id: 'example-library',
        eyebrow: 'Reference',
        title: 'Example Library',
        heading: 'Past-Paper Question Library',
        intro: 'Every speed-time question found in the ZIMSEC papers we checked, worked step by step.',
        lesson: SPEED_LIBRARY,
    },
];

export const GraphsVelocityTime = () => (
    <LessonPage
        id="gv-scroll-area"
        accent="emerald"
        title="Graphs (4): Speed-Time Graphs"
        subtitle={{
            en: 'Read motion from speed-time graphs: gradient is acceleration and area is distance.',
            sn: 'Verenga kufamba kubva pamagraph ekumhanya nenguva: gradient ndiyo acceleration uye area ndiyo chinhambwe.',
        }}
        sections={SECTIONS}
        diagrams={GRAPH_DIAGRAMS}
    />
);

export default GraphsVelocityTime;
