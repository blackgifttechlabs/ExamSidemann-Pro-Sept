import React from 'react';
import './seriesTypography.css';
import './algebraWorkingAnimations.css';
import { LessonPage } from '../../../o-level/form-4/mathematics/LessonPage';
import { SERIES_SECTIONS } from './seriesLessonData';
import { SERIES_DIAGRAMS } from './seriesDiagrams';
export default function Series() {
  return <LessonPage id="lower6-series-scroll-area" accent="violet"
    courseLabel="A-Level Pure Mathematics • Form 5 / Lower 6" title="Series and Sequences"
    subtitle={{ en: 'Sequences, arithmetic and geometric progressions, sigma notation, the binomial series and iteration. Simple explanations, animated diagrams, pen-written steps and ten practice questions in every section.', sn: 'Sequences, arithmetic nogeometric progressions, sigma notation, binomial series ne iteration. Tsananguro nenhanho dzacho dziri muEnglish yakapfava.' }}
    sections={SERIES_SECTIONS} diagrams={SERIES_DIAGRAMS} />;
}
