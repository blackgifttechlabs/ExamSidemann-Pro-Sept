import React from 'react';
import { MathTopicLessonShell } from './MathTopicLessonShell';

export const GraphsVelocityTime: React.FC = () => (
  <MathTopicLessonShell
    chapter="Graphs (4)"
    title="Velocity–Time Curves"
    description="Read motion from velocity–time graphs and use gradient and signed area to calculate acceleration and displacement."
    outcomes={['Interpret rest, constant velocity and changing velocity', 'Calculate acceleration from gradient', 'Calculate displacement from signed area', 'Interpret motion below the time axis']}
    formulas={[
      { label: 'Acceleration', expression: 'a = change in velocity / change in time' },
      { label: 'Displacement', expression: 'displacement = signed area under the velocity–time graph' },
      { label: 'Constant velocity', expression: 'horizontal graph segment ⇒ acceleration = 0' },
    ]}
    examples={[
      { question: 'Velocity increases uniformly from 4 m/s to 16 m/s in 6 s. Find the acceleration.', working: ['a = (16 − 4)/6.', 'a = 12/6.'], answer: '2 m/s²' },
      { question: 'A vehicle travels at 10 m/s for 8 s. Find its displacement.', working: ['The area is a rectangle.', 'Area = 10 × 8.'], answer: '80 m' },
    ]}
    reminders={['Area below the time axis represents negative displacement.', 'A curved graph has changing acceleration; estimate its gradient with a tangent.']}
  />
);

export default GraphsVelocityTime;
