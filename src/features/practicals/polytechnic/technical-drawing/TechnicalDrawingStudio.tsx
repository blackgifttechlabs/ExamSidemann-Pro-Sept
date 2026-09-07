'use client';

import { DrawingStudio } from '../drawing-studio/DrawingStudio';
import type { StudioCourse } from '../drawing-studio/studioTypes';
import { DRAWING_COURSES, DRAW_TOPICS } from './drawingTopics';

/**
 * Technical Drawing, as a course description handed to the shared studio.
 *
 * Everything that used to live in this file — the picker, the briefing, the
 * board, the player — now lives in `drawing-studio/DrawingStudio.tsx`, because
 * Fabrication Engineering runs on exactly the same machinery. What is left here
 * is what is actually particular to this subject.
 */
const TECHNICAL_DRAWING: StudioCourse = {
  basePath: '/practicals/polytechnic/drawing',
  // Straight back to the practicals catalogue: the polytechnic "select your
  // domain" page is a step nobody wants on the way out.
  backPath: '/practicals/',
  eyebrow: 'Polytechnic practicals',
  title: 'Technical Drawing',
  tagline: 'The board, the T-square and the compass — from your very first line.',
  chips: [
    `${DRAW_TOPICS.length} lessons`,
    'Every step spoken',
    'No experience needed',
    'Voice guided drawing',
  ],
  topics: DRAW_TOPICS,
  footer: {
    heading: 'One subject, taken by these courses',
    blurb:
      'Technical Drawing is examined right across the engineering trades, so this one board is reached from all of them.',
    items: DRAWING_COURSES,
  },
  upsell: {
    title: 'Access more Technical Drawing topics',
    blurb: `Open all ${DRAW_TOPICS.length} lessons on the board, drawn out step by step — from $2.08 a month.`,
  },
};

export function TechnicalDrawingStudio() {
  return <DrawingStudio course={TECHNICAL_DRAWING} />;
}

export default TechnicalDrawingStudio;
