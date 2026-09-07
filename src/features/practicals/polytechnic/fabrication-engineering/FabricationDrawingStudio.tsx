'use client';

import { DrawingStudio } from '../drawing-studio/DrawingStudio';
import type { StudioCourse } from '../drawing-studio/studioTypes';
import { FABRICATION_TOPICS, FABRICATION_TRADES } from './fabricationTopics';

/**
 * Fabrication Engineering technical drawing, handed to the shared studio.
 *
 * Fabrication opens directly onto every drawing so learners can scan or search
 * the complete list without stepping through category screens.
 */
const FABRICATION_ENGINEERING: StudioCourse = {
  basePath: '/practicals/polytechnic/fabrication',
  backPath: '/practicals/',
  eyebrow: 'Polytechnic practicals',
  title: 'Fabrication Engineering',
  tagline: 'Scales, line-work, projection and the template developments a plater lives on.',
  chips: [
    `${FABRICATION_TOPICS.length} drawings`,
    'All drawings in one list',
    'Every step spoken',
    'Voice guided drawing',
  ],
  topics: FABRICATION_TOPICS,
  footer: {
    heading: 'Trades that sit this paper',
    blurb:
      'Development and template work is examined across the plate trades, so this one board is reached from all of them.',
    items: FABRICATION_TRADES,
  },
  upsell: {
    title: 'Access more Fabrication drawings',
    blurb: `Open all ${FABRICATION_TOPICS.length} drawings on the board, set out step by step — from $2.08 a month.`,
  },
};

export function FabricationDrawingStudio() {
  return <DrawingStudio course={FABRICATION_ENGINEERING} />;
}

export default FabricationDrawingStudio;
