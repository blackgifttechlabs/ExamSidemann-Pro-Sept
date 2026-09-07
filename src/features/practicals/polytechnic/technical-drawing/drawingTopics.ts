/**
 * The Technical Drawing course: which lessons exist, in what order, and which
 * polytechnic courses sit the subject.
 *
 * The lessons themselves live in `topicsConstructions.ts` (the twelve
 * geometrical constructions) and `topicsProjection.ts` (orthographic and
 * isometric). This file only puts them in order and re-exports the shared
 * types, so nothing else in the app needs to know the content is split.
 */

import type { Mark } from './drawingGeometry';
import type { DrawTopic } from './drawingLessonTypes';
import { ASSEMBLY_TOPICS } from './topicsAssembly';
import { CIRCUIT_TOPICS } from './topicsCircuits';
import { CONSTRUCTION_TOPICS } from './topicsConstructions';
import { DIMENSIONING_TOPICS } from './topicsDimensioning';
import { LETTERING_TOPICS } from './topicsLettering';
import { MACHINE_ELEMENT_TOPICS } from './topicsMachineElements';
import { PROJECTION_EXTRA_TOPICS } from './topicsProjectionExtra';
import { PROJECTION_TOPICS } from './topicsProjection';

export type { DrawStep, DrawTopic, LessonLine, ToolId } from './drawingLessonTypes';
export { preparedSheet } from './drawingLessonTypes';

/**
 * Constructions first, in the order they are taught: each one leans on the one
 * before it, and by the time a student reaches blending arcs they have used the
 * perpendicular bisector five times without being told that is what it was.
 * Orthographic and isometric projection follow, because both assume you can
 * already put a perpendicular and a 30° line where you want them.
 */
export const DRAW_TOPICS: DrawTopic[] = [
  ...CONSTRUCTION_TOPICS,
  ...PROJECTION_TOPICS,
  ...MACHINE_ELEMENT_TOPICS,
  ...DIMENSIONING_TOPICS,
  ...LETTERING_TOPICS,
  ...ASSEMBLY_TOPICS,
  ...PROJECTION_EXTRA_TOPICS,
  ...CIRCUIT_TOPICS,
];

export const findTopic = (id: string | undefined) => DRAW_TOPICS.find((topic) => topic.id === id);

/** The whole sheet as it looks when the lesson is finished. */
export function finalMarks(topic: DrawTopic): Mark[] {
  return [...topic.base, ...topic.steps.flatMap((step) => step.marks)];
}

/** Everything on the paper before `stepIndex` starts. */
export function marksBefore(topic: DrawTopic, stepIndex: number): Mark[] {
  return [...topic.base, ...topic.steps.slice(0, stepIndex).flatMap((step) => step.marks)];
}

/* -------------------------------------------------- courses that take Drawing */

export interface DrawingCourse {
  name: string;
  short: string;
  note: string;
}

/**
 * Technical Drawing is not one department's subject — it is examined across
 * almost every engineering trade in the polytechnics, which is why this one
 * practical is reached from all of them.
 */
export const DRAWING_COURSES: DrawingCourse[] = [
  { name: 'Diesel Plant Fitting', short: 'DPF', note: 'Plant and machine detail drawings' },
  { name: 'Automotive / Motor Vehicle Mechanics', short: 'Automotive', note: 'Component and assembly drawings' },
  { name: 'Mechanical Engineering', short: 'Mechanical', note: 'Machine drawing and sectioning' },
  { name: 'Fitting and Turning', short: 'Fitting', note: 'Turned part details and fits' },
  { name: 'Welding and Metal Fabrication', short: 'Fabrication', note: 'Development of surfaces' },
  { name: 'Electrical Engineering', short: 'Electrical', note: 'Layouts, schematics and panels' },
  { name: 'Refrigeration and Air Conditioning', short: 'Refrigeration', note: 'Pipework and plant layouts' },
  { name: 'Civil and Construction Engineering', short: 'Civil', note: 'Building and structural drawing' },
  { name: 'Architectural Draughtsmanship', short: 'Architectural', note: 'Plans, elevations and sections' },
  { name: 'Agricultural Engineering', short: 'Agriculture', note: 'Implement and workshop drawing' },
  { name: 'Mining Engineering', short: 'Mining', note: 'Plant and section drawings' },
  { name: 'Wood Technology / Carpentry and Joinery', short: 'Wood', note: 'Joint and furniture details' },
];
