/**
 * What one drawing course tells the studio about itself.
 *
 * The board, the player, the briefing and the lesson stage are identical for
 * every drawing course in the polytechnic — the only things that differ are the
 * lessons, the copy at the top of the picker, and whether the lessons are
 * grouped into categories. So those are the only things this describes.
 */

import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';

export interface StudioGroup {
  id: string;
  title: string;
  /** One line under the title on the category card. */
  blurb: string;
  /** The lessons in this category, in teaching order, by topic id. */
  topicIds: string[];
  /**
   * Written out in full — Tailwind is loaded from the Play CDN here, so class
   * names cannot be composed at runtime.
   */
  tile: string;
}

export interface StudioCourse {
  /** Route the lessons live under, with no trailing slash. */
  basePath: string;
  /** Where the back arrow on the picker goes. */
  backPath: string;
  eyebrow: string;
  title: string;
  tagline: string;
  /** The three little chips under the tagline. */
  chips: string[];
  topics: DrawTopic[];
  /**
   * When present, the picker opens on category cards and the lessons sit
   * inside them. Forty lessons in one flat grid is a wall, not a menu.
   */
  groups?: StudioGroup[];
  /** The rail of courses at the foot of the picker. */
  footer?: {
    heading: string;
    blurb: string;
    items: { name: string; short: string; note: string }[];
  };
  upsell: { title: string; blurb: string };
}
