/**
 * The Fabrication Engineering drawing course: what is in it, and in what order.
 *
 * Forty drawings in six categories. The order inside each category is teaching
 * order — scales before anything is drawn to one, line-work before the line
 * types are used in anger, and the template developments last, because every
 * one of them leans on the twelve-division method the earlier sheets set up.
 */

import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import type { StudioGroup } from '../drawing-studio/studioTypes';
import { BOILER_TOPICS } from './topicsBoilerWork';
import { CONE_TOPICS } from './topicsCones';
import { DEVELOPMENT_TOPICS_A } from './topicsDevelopment';
import { LETTERING_TOPICS } from './topicsLettering';
import { LINEWORK_TOPICS } from './topicsLinework';
import { ORTHOGRAPHIC_TOPICS } from './topicsOrthographic';
import { SCALE_TOPICS } from './topicsScales';
import { SKETCHING_TOPICS } from './topicsSketching';

export const FABRICATION_TOPICS: DrawTopic[] = [
  ...SCALE_TOPICS,
  ...ORTHOGRAPHIC_TOPICS,
  ...LINEWORK_TOPICS,
  ...LETTERING_TOPICS,
  ...SKETCHING_TOPICS,
  ...DEVELOPMENT_TOPICS_A,
  ...BOILER_TOPICS,
  ...CONE_TOPICS,
];

export const findFabricationTopic = (id: string | undefined) =>
  FABRICATION_TOPICS.find((topic) => topic.id === id);

/**
 * The six category cards. Tile colours are written out in full because Tailwind
 * is loaded from the Play CDN here and class names cannot be composed.
 */
export const FABRICATION_GROUPS: StudioGroup[] = [
  {
    id: 'scales',
    title: 'Scale drawings',
    blurb: 'Full size, reduced, enlarged, and the scales you rule for yourself.',
    tile: 'bg-amber-100 dark:bg-amber-500/15',
    topicIds: [
      'scale-full-size',
      'scale-reduction',
      'scale-enlargement',
      'scale-dual',
      'scale-diagonal',
      'scale-plain',
    ],
  },
  {
    id: 'orthographic',
    title: 'Orthographic projection',
    blurb: 'First and third angle, with every construction and projection line left on.',
    tile: 'bg-sky-100 dark:bg-sky-500/15',
    topicIds: ['ortho-third-angle-stepped', 'ortho-first-angle-stepped', 'ortho-auxiliary-views'],
  },
  {
    id: 'linework',
    title: 'Line-work',
    blurb: 'The twelve line types, each one drawn, named and put to work.',
    tile: 'bg-slate-200 dark:bg-slate-500/20',
    topicIds: [
      'line-outline',
      'line-centre',
      'line-projection',
      'line-construction',
      'line-dimension',
      'line-leader',
      'line-limit',
      'line-phantom',
      'line-extension',
      'line-break',
      'line-cutting-plane',
      'line-hidden',
    ],
  },
  {
    id: 'lettering',
    title: 'Lettering styles',
    blurb: 'Open, condensed, sloping, lower case — with and without instruments.',
    tile: 'bg-violet-100 dark:bg-violet-500/15',
    topicIds: [
      'lettering-open',
      'lettering-condensed',
      'lettering-sloping',
      'lettering-open-lowercase',
      'lettering-open-freehand',
      'lettering-sloping-freehand',
    ],
  },
  {
    id: 'sketching',
    title: 'Sketching and conversion',
    blurb: 'Freehand figures and axes, choosing views, and reading a pictorial back into three.',
    tile: 'bg-emerald-100 dark:bg-emerald-500/15',
    topicIds: [
      'sketch-matchstick',
      'sketch-isometric-axes',
      'sketch-representative-views',
      'sketch-iso-to-first-angle',
    ],
  },
  {
    id: 'development',
    title: 'Template development',
    blurb: 'Pipes, funnels, boiler domes and cones — the flat plate that becomes the job.',
    tile: 'bg-rose-100 dark:bg-rose-500/15',
    topicIds: [
      'dev-cylinder-cut',
      'dev-equal-cylinders',
      'dev-funnel-rake',
      'dev-boiler-dome',
      'dev-boiler-superheater-pipe',
      'dev-boiler-front',
      'dev-egg-ended-boiler',
      'dev-cone-frustum',
      'dev-rise-and-radius',
    ],
  },
];

/** The trades that sit this paper, shown on the rail at the foot of the picker. */
export const FABRICATION_TRADES = [
  { name: 'Welding and Metal Fabrication', short: 'Fabrication', note: 'Developments, templates and plate work' },
  { name: 'Boilermaking', short: 'Boilermaking', note: 'Shells, domes and boiler plates' },
  { name: 'Sheet Metal Work', short: 'Sheet Metal', note: 'Ducting, hoppers and transitions' },
  { name: 'Structural Steel Fabrication', short: 'Structural', note: 'Marking off and cutting lists' },
  { name: 'Pipe Fitting', short: 'Pipe Fitting', note: 'Mitres, branches and bends' },
  { name: 'Mechanical Engineering', short: 'Mechanical', note: 'Machine detail and sectioning' },
  { name: 'Diesel Plant Fitting', short: 'DPF', note: 'Plant and machine detail drawings' },
  { name: 'Agricultural Engineering', short: 'Agriculture', note: 'Implement and workshop drawing' },
  { name: 'Mining Engineering', short: 'Mining', note: 'Chutes, launders and plant work' },
];
