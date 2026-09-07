import React from 'react';
import { MathTopicLessonShell } from './MathTopicLessonShell';

export const LengthsAnglesSolids: React.FC = () => (
  <MathTopicLessonShell
    chapter="Three-Dimensional Geometry"
    title="Lengths and Angles in Solids"
    description="Use Pythagoras and trigonometry in three dimensions to calculate diagonals and angles between lines and planes."
    outcomes={['Identify useful right-angled triangles inside solids', 'Calculate face and space diagonals', 'Find angles between a line and a plane', 'Solve multi-step cuboid, prism and pyramid problems']}
    formulas={[
      { label: 'Cuboid space diagonal', expression: 'd = √(l² + w² + h²)' },
      { label: 'Angle with a plane', expression: 'tan θ = perpendicular height / projection on plane' },
      { label: 'Right triangle', expression: 'a² + b² = c²' },
    ]}
    examples={[
      { question: 'Find the space diagonal of a cuboid measuring 3 cm by 4 cm by 12 cm.', working: ['First find the base diagonal: √(3² + 4²) = 5.', 'Use the base diagonal and height: d = √(5² + 12²).', 'd = √169.'], answer: '13 cm' },
      { question: 'A line rises 8 m above a plane and its projection on the plane is 15 m. Find its angle with the plane.', working: ['tan θ = 8/15.', 'θ = tan⁻¹(8/15).'], answer: '28.1°' },
    ]}
    reminders={['Draw and label the relevant right-angled triangle before calculating.', 'An angle between a line and a plane uses the line’s projection on that plane.']}
  />
);

export default LengthsAnglesSolids;
