import React from 'react';
import { MathTopicLessonShell } from './MathTopicLessonShell';

export const MensurationSolidShapes: React.FC = () => (
  <MathTopicLessonShell
    chapter="Mensuration"
    title="Mensuration of Solid Shapes"
    description="Calculate surface area and volume for prisms, cylinders, pyramids, cones, spheres and compound solids."
    outcomes={['Select the correct surface-area and volume formula', 'Use consistent length, area and volume units', 'Solve compound-solid and capacity problems', 'Work backwards from a volume or surface area']}
    formulas={[
      { label: 'Prism and cylinder', expression: 'V = area of cross-section × length; cylinder V = πr²h' },
      { label: 'Pyramid and cone', expression: 'V = ⅓ × base area × perpendicular height' },
      { label: 'Sphere', expression: 'V = ⁴⁄₃πr³; surface area = 4πr²' },
    ]}
    examples={[
      { question: 'Find the volume of a cylinder of radius 3 cm and height 10 cm.', working: ['V = πr²h.', 'V = π × 3² × 10.', 'V = 90π.'], answer: '90π cm³ ≈ 282.7 cm³' },
      { question: 'Find the volume of a cone with radius 6 m and height 5 m.', working: ['V = ⅓πr²h.', 'V = ⅓ × π × 36 × 5.', 'V = 60π.'], answer: '60π m³ ≈ 188.5 m³' },
    ]}
    reminders={['Use perpendicular height, not slant height, when calculating volume.', 'Area units are squared and volume units are cubed.']}
  />
);

export default MensurationSolidShapes;
