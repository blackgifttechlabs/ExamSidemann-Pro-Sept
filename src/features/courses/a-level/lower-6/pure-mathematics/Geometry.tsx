import React from 'react';
import './geometryTypography.css';
import './algebraWorkingAnimations.css';
import { LessonPage } from '../../../o-level/form-4/mathematics/LessonPage';
import { GEOMETRY_SECTIONS } from './geometryLessonData';
import { GEOMETRY_DIAGRAMS } from './geometryDiagrams';
export default function Geometry() {
  return <LessonPage id="lower6-geometry-scroll-area" accent="violet"
    courseLabel="A-Level Pure Mathematics • Form 5 / Lower 6" title="Geometry and Vectors"
    subtitle={{ en: 'Coordinate geometry, straight lines, circles and vectors in two and three dimensions. Simple explanations, animated diagrams, pen-written steps and ten practice questions in every section.', sn: 'Coordinate geometry, mitsara, madenderedzwa nema vectors mumativi maviri nemana. Tsananguro nenhanho dzacho dziri muEnglish yakapfava.' }}
    sections={GEOMETRY_SECTIONS} diagrams={GEOMETRY_DIAGRAMS} />;
}
