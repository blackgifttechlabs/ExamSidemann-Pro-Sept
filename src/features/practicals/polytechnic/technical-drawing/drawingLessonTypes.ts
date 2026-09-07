/**
 * The shape of a drawing lesson, and the sheet every lesson opens on.
 *
 * Kept apart from the lessons themselves so the content files can grow without
 * the scene, the player and the studio page having to import a megabyte of
 * narration to learn what a step is.
 */

import {
  frameMarks,
  projectionSymbol,
  pt,
  titleBlockLettering,
  titleBlockMarks,
  type Mark,
  type Pt,
} from './drawingGeometry';

export type ToolId = 'tsquare' | 'set45' | 'set30' | 'compass' | 'pencil' | 'eraser' | 'hand';

/**
 * Something the board should do while one line is being spoken. This is what
 * keeps the demonstration honest: when the narrator says "open it to ninety"
 * the compass opens to ninety as he says it, and when he says "do not touch
 * that screw" the camera is already on the screw.
 */
export interface LineCue {
  /** Opens the compass to this radius, in mm, while the line is spoken. */
  compassRadius?: number;
  /** Leans the camera onto this circle of the sheet, overriding the step's. */
  focus?: { at: Pt; r: number };
  /** Calls attention to one part of the instrument in the learner's hand. */
  alert?: {
    part: 'screw';
    /** Adds the red no-entry sign over it, for "never do this". */
    forbidden?: boolean;
  };
}

export interface LessonLine extends LineCue {
  /** One spoken thought. Keep it short — it becomes one caption. */
  text: string;
  /** Where the pointing hand should sit while this line is spoken, in sheet mm. */
  at?: Pt;
  /** Little chip that rides with the hand. */
  label?: string;
}

export interface DrawStep {
  id: string;
  /** Heading shown on the step rail, e.g. "Swing two arcs from A". */
  title: string;
  /** The instrument in the student's hand for this step. */
  tool: ToolId;
  lines: LessonLine[];
  /** What appears on the paper during this step, drawn in order. */
  marks: Mark[];
  /**
   * Which narration line each mark belongs to, so the pencil draws a thing
   * while it is being talked about rather than crawling through the step. One
   * entry per mark; leave the whole field off and the marks are simply drawn
   * one after another at a natural pencil speed.
   */
  markLines?: number[];
  /**
   * The word inside that line the mark should be drawn on — which is what keeps
   * a count honest. "Keep walking up the line. Three. Four. Five." carries three
   * dots and three figures, and the third dot has to land on the word *three*,
   * not a second before it.
   *
   * One entry per mark, matched against the words of the spoken line: a string
   * is matched on the word itself (punctuation and case ignored, and a phrase
   * of several words is allowed), a number is a plain word index. Cues are
   * searched in mark order, so a word said twice in one sentence can be used
   * twice. Anything left `undefined` is spread across whatever room the
   * sentence has left between the cues around it.
   */
  markWords?: (string | number | undefined)[];
  /** One examinable fact, pinned to the notes card while the step runs. */
  tip?: string;
  /** Overrides the T-square blade position, in sheet mm down the page. */
  teeY?: number;
  /** Compass opening for this step, in mm. */
  compassRadius?: number;
  /** Where the camera should lean in: a circle on the sheet, in mm. */
  focus?: { at: Pt; r: number };
}

export interface DrawTopic {
  id: string;
  title: string;
  /** One line under the title on the picker card. */
  subtitle: string;
  /** What the student will be able to do at the end. */
  goal: string;
  /** Realistic bench time, in minutes. */
  minutes: number;
  level: 'Start here' | 'Basic' | 'Core' | 'Exam';
  tools: string[];
  /** Already on the paper when the lesson opens. */
  base: Mark[];
  steps: DrawStep[];
}

/**
 * Lessons open on a sheet that is already bordered and titled, so the border
 * and title block are never presented as something that appears by magic — and
 * so the drawing area the construction has to fit inside is honest.
 */
export function preparedSheet(title: string, number: string): Mark[] {
  return [
    ...frameMarks(),
    ...titleBlockMarks(),
    ...titleBlockLettering({
      name: 'YOUR NAME',
      course: 'YOUR COURSE',
      title,
      scale: '1:1',
      date: 'TODAY',
      number,
    }),
    ...projectionSymbol(pt(390, 276), 0.62),
  ];
}
