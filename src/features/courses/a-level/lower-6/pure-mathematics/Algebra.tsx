import React from 'react';
import './algebraTypography.css';
import { LessonPage } from '../../../o-level/form-4/mathematics/LessonPage';
import { ALGEBRA_SECTIONS } from './algebraLessonData';
import { ALGEBRA_DIAGRAMS } from './algebraDiagrams';
export default function Algebra() {
  return <LessonPage id="lower6-algebra-scroll-area" accent="violet"
    courseLabel="A-Level Pure Mathematics • Form 5 / Lower 6" title="Algebra"
    subtitle={{ en: 'Powers, variation, polynomials, equations, inequalities and functions. Simple explanations, pen-written steps and checked ZIMSEC questions.', sn: 'Mapowers, variation, polynomials, equations, inequalities nemafunctions. Tsananguro nenhanho dzacho dziri muEnglish yakapfava.' }}
    sections={ALGEBRA_SECTIONS} diagrams={ALGEBRA_DIAGRAMS} />;
}
