import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { MathChapterPager, notebookPaperClassName, notebookPaperStyle, renderMathText, useCenteredMathChapterTab, type MathNavigationProps } from './mathLessonUtils';
import { useLessonState } from '../../../lessonProgress';

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
  },
};

const angleTypesGalleryImage = new URL('./images/angle_types_gallery.png', import.meta.url).href;
const circlePartsDiagramImage = new URL('./images/circle_parts_diagram.png', import.meta.url).href;
const specialAnglePairsImage = new URL('./images/special_angle_pairs.png', import.meta.url).href;
const parallelLinesTransversalImage = new URL('./images/parallel_lines_transversal.png', import.meta.url).href;
const triangleTypesGalleryImage = new URL('./images/triangle_types_gallery.png', import.meta.url).href;
const quadrilateralTypesGalleryImage = new URL('./images/quadrilateral_types_gallery.png', import.meta.url).href;
const triangleAngleSumCalculationImage = new URL('./images/triangle_angle_sum_calculation.png', import.meta.url).href;
const polygonAngleSumFormulaImage = new URL('./images/polygon_angle_sum_formula.png', import.meta.url).href;
const angleBisectorConstructionImage = new URL('./images/angle_bisector_construction.png', import.meta.url).href;
const perpendicularBisectorConstructionImage = new URL('./images/perpendicular_bisector_construction.png', import.meta.url).href;

/* ---------- Content ---------- */
interface WorkedExample {
  question: string;
  steps: string[];
  answer: string;
}

interface TopicSection {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  introImage?: { src: string; caption: string };
  diagram?: { title: string; content: string; type: string; image?: string };
  diagrams?: { title: string; content: string; image: string }[];
  method?: { title: string; steps: string[]; image?: { src: string; caption: string } }[];
  context?: string;
  examples: WorkedExample[];
  practiceZone: string[];
}

const sections: TopicSection[] = [
  {
    id: 'points-lines-angles',
    eyebrow: 'Chapter 4.1',
    title: 'Points, Lines, and Angles',
    intro: 'Let us start with three simple ideas. A Point is just a dot — one exact spot. A Line is a straight path. It keeps going forever in both directions, but we only draw a small part of it. An Angle is made when two lines meet at a point, and it measures how much one line has "turned" away from the other — like opening a door. We use degrees (°) to measure angles. There are four types you must know: Acute (small — less than 90°), Right (exactly 90°, like the sharp corner of a book), Obtuse (bigger than 90° but less than 180°), and Reflex (bigger than 180°). Two facts will help you solve almost every angle problem in this chapter: angles that sit on a straight line always add up to 180°, and angles that go all the way around one point always add up to 360°. Why? Because a straight line is itself a straight angle of 180°, and a full turn around a point is 360° — like turning all the way around in a circle back to where you started.',
    introImage: {
      src: angleTypesGalleryImage,
      caption: 'Four main angles: acute, right, obtuse, and reflex.'
    },
    method: [
      {
        title: 'How to Calculate a Missing Angle',
        steps: [
          'Step 1: Look carefully. Are the angles sitting on a straight line, or going all the way around a point?',
          'Step 2: If they are on a straight line, remember the total must be 180°.',
          'Step 3: If they are around a point, remember the total must be 360°.',
          'Step 4: Add up all the angles you already know.',
          'Step 5: Subtract that total from 180° (line) or 360° (point) to find the missing angle.',
          'Example: Two angles sit on a straight line. One is 120°. So the missing angle is 180° − 120° = 60°. We subtract because the two angles together must fill up the whole straight line, which is 180°.'
        ]
      },
      {
        title: 'Special Angle Pairs You Must Know',
        steps: [
          'Complementary angles: two angles that add up to exactly 90°. Example: 30° and 60° are complementary because 30° + 60° = 90°.',
          'Supplementary angles: two angles that add up to exactly 180°. Example: 110° and 70° are supplementary because 110° + 70° = 180°. Notice this is the same rule as "angles on a straight line".',
          'Vertically opposite angles: when two straight lines cross each other, they make an X shape with 4 angles. The two angles directly across from each other (opposite each other) are always exactly equal. This happens because each pair sits on the same straight line as its neighbour, so they must balance out equally on both sides.'
        ],
        image: {
          src: specialAnglePairsImage,
          caption: 'Complementary, supplementary, and vertically opposite angles.'
        }
      },
      {
        title: 'Angles Formed by Parallel Lines and a Transversal',
        steps: [
          'Parallel lines are two lines that never meet, no matter how far you extend them — like the two rails of a train track. A transversal is a straight line that cuts across both parallel lines.',
          'Where the transversal crosses each parallel line, it creates 4 angles at each crossing point (8 angles total). These angles follow three special rules.',
          'Corresponding angles: angles in the "same position" at each crossing point (for example, both top-right). They are always equal. Look for an "F" shape to spot them.',
          'Alternate angles: angles on opposite sides of the transversal, both sitting between the two parallel lines. They are always equal. Look for a "Z" shape to spot them.',
          'Co-interior angles: angles on the same side of the transversal, both sitting between the two parallel lines. These always add up to 180° (they are NOT equal). Look for a "C" shape to spot them.',
          'Why this matters: if you know just one angle where a transversal crosses parallel lines, you can work out all 8 angles using these three rules plus the straight-line and vertically-opposite rules.'
        ],
        image: {
          src: parallelLinesTransversalImage,
          caption: 'Corresponding, alternate, and co-interior angles on parallel lines.'
        }
      }
    ],
    examples: [
      {
        question: 'What do we call an angle of 45°? What about 200°?',
        steps: ['45° is less than 90°, so it is acute.', '200° is more than 180° but less than 360°, so it is reflex.'],
        answer: '45° is acute, 200° is reflex.'
      },
      {
        question: 'Two angles sit on a straight line. Angle A = 70°. Calculate Angle B.',
        steps: ['Angles on a straight line add to 180°.', 'Angle B = 180° − 70° = 110°.'],
        answer: '110°'
      },
      {
        question: 'Angle P is 35°. What size angle is complementary to it?',
        steps: ['Complementary angles add to 90°.', 'The other angle = 90° − 35° = 55°.'],
        answer: '55°'
      },
      {
        question: 'Two straight lines cross. One of the four angles formed is 65°. Find the angle vertically opposite to it, and find the two angles next to it.',
        steps: ['The angle vertically opposite 65° is equal to it, so it is also 65° (vertically opposite angles are always equal).', 'The two angles next to it sit on a straight line with the 65° angle, so each one = 180° − 65° = 115°.'],
        answer: 'Vertically opposite = 65°. The two neighbouring angles = 115° each.'
      },
      {
        question: 'Two parallel lines are cut by a transversal. One angle is 75°. Find its corresponding angle and its co-interior angle.',
        steps: ['Corresponding angles are equal, so the corresponding angle is also 75°.', 'Co-interior angles add up to 180°, so the co-interior angle = 180° − 75° = 105°.'],
        answer: 'Corresponding angle = 75°, co-interior angle = 105°.'
      }
    ],
    practiceZone: [
      'Name the angle that is exactly 90°.',
      'If three angles around a point are 100°, 120°, and 80°, find the fourth angle.',
      'Draw an acute angle and a right angle using a protractor.',
      'Two angles are complementary. One is 22°. Find the other.',
      'Two straight lines cross and form an angle of 48°. Find all three other angles at that crossing.',
      'Draw two parallel lines with a transversal. Label one angle 60°, then work out and label all 7 other angles.'
    ]
  },
  {
    id: 'polygons',
    eyebrow: 'Chapter 4.2',
    title: 'Polygons',
    intro: 'A polygon is a flat shape that is completely closed, and every one of its sides must be a straight line (no curves allowed). The name of a polygon comes from counting its sides — that is the whole trick. Count the straight sides, then match the number to its name: 3 sides is a Triangle, 4 sides is a Quadrilateral, 5 sides is a Pentagon, 6 sides is a Hexagon, 8 sides is an Octagon, and 10 sides is a Decagon. You already see polygons every day. Look at the Zimbabwean flag: the white triangle on the left has 3 sides, and the coloured stripes are rectangles, which are a type of quadrilateral with 4 sides.',
    method: [
      {
        title: 'How to Name Any Polygon',
        steps: [
          'Step 1: Count the number of straight sides on the shape.',
          'Step 2: Match that number to the naming list below.',
          '3 sides → Triangle',
          '4 sides → Quadrilateral',
          '5 sides → Pentagon',
          '6 sides → Hexagon',
          '8 sides → Octagon',
          '10 sides → Decagon',
          'Tip: if the shape has a curve anywhere, it is NOT a polygon.'
        ]
      },
      {
        title: 'Regular vs. Irregular Polygons',
        steps: [
          'A regular polygon has all sides the same length AND all angles the same size. Example: a square is regular because every side is equal and every angle is 90°.',
          'An irregular polygon has sides and/or angles that are different sizes. Example: a rectangle is irregular in this sense, because although its angles are all 90°, its sides are not all equal (length ≠ width).',
          'Quick check: to know if a polygon is regular, measure every side and every angle. If even one is different, it is irregular.'
        ]
      },
      {
        title: 'Four Types of Triangle (by sides and angles)',
        steps: [
          'Equilateral triangle: all 3 sides equal, and all 3 angles equal to 60°.',
          'Isosceles triangle: exactly 2 sides equal, and the 2 angles opposite those sides (the base angles) are also equal.',
          'Scalene triangle: no sides equal and no angles equal — every side and angle is a different size.',
          'Right-angled triangle: has one angle that is exactly 90°. This can happen alongside being scalene or isosceles.'
        ],
        image: {
          src: triangleTypesGalleryImage,
          caption: 'The four main types of triangle.'
        }
      },
      {
        title: 'Six Types of Quadrilateral',
        steps: [
          'Square: all 4 sides equal, all 4 angles 90°.',
          'Rectangle: opposite sides equal, all 4 angles 90°.',
          'Parallelogram: opposite sides equal AND parallel, opposite angles equal.',
          'Rhombus: all 4 sides equal, opposite sides parallel, opposite angles equal (like a "leaning square").',
          'Trapezium: exactly one pair of opposite sides is parallel.',
          'Kite: two pairs of adjacent (neighbouring) sides are equal, but opposite sides are not.'
        ],
        image: {
          src: quadrilateralTypesGalleryImage,
          caption: 'Six common quadrilaterals and their properties.'
        }
      },
      {
        title: 'The Angle Sum of a Triangle (always 180°)',
        steps: [
          'Step 1: Add together the two angles you already know.',
          'Step 2: Subtract that total from 180°, because the interior angles of every triangle always add up to exactly 180° — this is a fixed rule that never changes, no matter the triangle\'s shape or size.',
          'Example: A triangle has angles of 50° and 70°. The third angle = 180° − (50° + 70°) = 180° − 120° = 60°.'
        ],
        image: {
          src: triangleAngleSumCalculationImage,
          caption: 'Step-by-step: finding a missing angle in a triangle.'
        }
      },
      {
        title: 'The Angle Sum of Any Polygon',
        steps: [
          'Step 1: Count the number of sides of the polygon. Call this number "n".',
          'Step 2: Use the formula: Sum of interior angles = (n − 2) × 180°. This works because any polygon can be split into triangles by drawing lines from one corner, and each triangle always contributes 180°.',
          'Step 3: Work out (n − 2) first, then multiply by 180°.',
          'Example: A pentagon has 5 sides. Sum = (5 − 2) × 180° = 3 × 180° = 540°.',
          'Check it works for a quadrilateral: (4 − 2) × 180° = 2 × 180° = 360°, which matches what we already know.'
        ],
        image: {
          src: polygonAngleSumFormulaImage,
          caption: 'Step-by-step: using the (n − 2) × 180° formula.'
        }
      }
    ],
    examples: [
      {
        question: 'A shape has 6 straight sides. What is its mathematical name?',
        steps: ['Count the sides: 6.', 'From the table, 6 sides is a hexagon.'],
        answer: 'Hexagon'
      },
      {
        question: 'A triangle has sides of 5 cm, 5 cm, and 5 cm. What type of triangle is it, and what is each angle?',
        steps: ['All three sides are equal, so it is an equilateral triangle.', 'In an equilateral triangle all angles are equal too, and they must add to 180°.', 'Each angle = 180° ÷ 3 = 60°.'],
        answer: 'Equilateral triangle, each angle = 60°.'
      },
      {
        question: 'A triangle has angles of 40° and 40°. Find the third angle, and name the triangle type.',
        steps: ['Add the two known angles: 40° + 40° = 80°.', 'Subtract from 180°: 180° − 80° = 100°.', 'Two angles are equal (40° and 40°), so this is an isosceles triangle.'],
        answer: 'Third angle = 100°. It is an isosceles triangle.'
      },
      {
        question: 'A quadrilateral has angles of 90°, 90°, 90°, and one unknown angle. Find the unknown angle.',
        steps: ['All angles in a quadrilateral add up to 360°.', 'Add the known angles: 90° + 90° + 90° = 270°.', 'Unknown angle = 360° − 270° = 90°.'],
        answer: '90° (this confirms the shape is likely a rectangle or square)'
      },
      {
        question: 'Find the sum of the interior angles of an octagon.',
        steps: ['An octagon has 8 sides, so n = 8.', 'Use the formula (n − 2) × 180°.', '(8 − 2) × 180° = 6 × 180° = 1080°.'],
        answer: '1080°'
      }
    ],
    practiceZone: [
      'Name a polygon with 5 sides.',
      'How many sides does an octagon have?',
      'Find an example of a quadrilateral in your classroom.',
      'Sort these shapes into regular or irregular: a square, a rectangle, a stop sign (regular octagon).',
      'A triangle has one 90° angle and two other equal angles. Find those two angles and name the triangle type.',
      'A rhombus and a square both have 4 equal sides. What is the one difference between them?',
      'Use the formula (n − 2) × 180° to find the angle sum of a decagon (10 sides).'
    ]
  },
  {
    id: 'circle-parts',
    eyebrow: 'Chapter 4.3',
    title: 'Parts of a Circle',
    intro: 'A circle is different from every shape we have seen so far — it has no straight sides at all, only one smooth curve. Because of this, we need special names for its parts. The Centre is the exact middle point of the circle. The Circumference is the outer curved edge — think of it like the crust around a pie. The Radius is a straight line from the centre out to the edge. The Diameter is a straight line that goes all the way across the circle, passing through the centre — it is exactly twice as long as the radius, because it is really just two radii placed end to end. An Arc is any curved piece of the circumference. A Chord is a straight line joining two points on the edge, but it does NOT pass through the centre. A Sector is the area between two radii and an arc — exactly like one slice of a pizza.',
    introImage: {
      src: circlePartsDiagramImage,
      caption: 'The different parts of a circle: centre, radius, diameter, circumference, arc, chord, sector.'
    },
    method: [
      {
        title: 'How to Find the Diameter from the Radius',
        steps: [
          'Step 1: Find the length of the radius.',
          'Step 2: Multiply it by 2, because the diameter is simply two radii placed end to end across the circle.',
          'Step 3: Write your answer with the correct unit (cm, m, etc).',
          'Example: If the radius is 5 cm, the diameter = 2 × 5 cm = 10 cm.'
        ]
      }
    ],
    examples: [
      {
        question: 'What is the name for the distance all the way around a circle?',
        steps: ['This edge is the curved boundary of the circle, like the crust around a pie.', 'This distance is called the circumference.'],
        answer: 'Circumference'
      },
      {
        question: 'If a radius is 5 cm, how long is the diameter?',
        steps: ['The diameter is always twice the radius, because it is two radii joined end to end through the centre.', 'Diameter = 2 × 5 cm = 10 cm.'],
        answer: '10 cm'
      },
      {
        question: 'A circle has a diameter of 18 cm. What is the radius?',
        steps: ['Since diameter = 2 × radius, we work backwards.', 'Radius = diameter ÷ 2 = 18 cm ÷ 2 = 9 cm.'],
        answer: '9 cm'
      }
    ],
    practiceZone: [
      'Name the part of a circle that is like a "pizza slice".',
      'Draw a circle and label the centre, radius, and diameter.',
      'Is a chord longer or shorter than the diameter? Explain.'
    ]
  },
  {
    id: 'construction',
    eyebrow: 'Chapter 4.4',
    title: 'Construction (Drawing and Measuring)',
    intro: 'To draw and measure shapes accurately, we need three simple tools. A ruler draws straight lines and measures their length. A protractor measures and draws angles — it is the half-circle tool with numbers around the edge. Compasses draw perfect circles, because one point stays fixed while the other point spins around it. Always use a sharp pencil. A blunt pencil makes thick, messy lines, and thick lines make your measurements less accurate.',
    method: [
      {
        title: 'How to Measure an Angle with a Protractor',
        steps: [
          'Step 1: Place the small centre mark of the protractor exactly on the vertex — the point where the two lines of the angle meet. If this is not exact, every other step will be wrong.',
          'Step 2: Line up the 0° line of the protractor exactly along one arm (side) of the angle.',
          'Step 3: Follow the other arm of the angle until it crosses the curved scale of the protractor.',
          'Step 4: Read the number where it crosses. That number is the size of the angle in degrees.'
        ]
      },
      {
        title: 'How to Draw an Angle with a Protractor',
        steps: [
          'Step 1: Draw a straight line (the base line).',
          'Step 2: Place the protractor on the line so the centre mark is at the endpoint.',
          'Step 3: Mark the desired angle on the scale.',
          'Step 4: Remove the protractor and draw a line from the endpoint through the mark.'
        ]
      },
      {
        title: 'How to Bisect an Angle Using a Compass',
        steps: [
          'Bisect means to cut exactly in half. Bisecting an angle means splitting it into two equal smaller angles.',
          'Step 1: Put the compass point on the vertex of the angle and draw an arc that crosses both arms of the angle.',
          'Step 2: Without changing the compass width, put the compass point on each place where the first arc crossed an arm, and draw two new small arcs so that they cross each other.',
          'Step 3: Draw a straight line from the vertex through the point where those two small arcs cross.',
          'Step 4: This new line splits the original angle into two exactly equal angles. This works because every point on the new line is the same distance from both arms of the angle.'
        ],
        image: {
          src: angleBisectorConstructionImage,
          caption: 'Step-by-step: bisecting an angle with a compass.'
        }
      },
      {
        title: 'How to Construct a Perpendicular Bisector',
        steps: [
          'A perpendicular bisector is a line that cuts another line exactly in half AND crosses it at a perfect right angle (90°).',
          'Step 1: Open your compass wider than half the length of the line. Put the point on one end of the line and draw a large arc above and below the line.',
          'Step 2: Without changing the compass width, put the point on the other end of the line and draw another large arc above and below, so it crosses the first arc in two places.',
          'Step 3: Draw a straight line joining the two points where the arcs cross. This new line cuts the original line exactly in half, at exactly 90°.'
        ],
        image: {
          src: perpendicularBisectorConstructionImage,
          caption: 'Step-by-step: constructing a perpendicular bisector.'
        }
      }
    ],
    examples: [
      {
        question: 'Describe how to use a protractor to measure a given angle.',
        steps: ['Place centre mark on vertex.', 'Align 0° with one side.', 'Read where the other side crosses the scale.'],
        answer: 'Follow the three steps above.'
      },
      {
        question: 'You bisect a 70° angle using a compass. What size is each new angle?',
        steps: ['Bisecting means splitting into two exactly equal parts.', 'Each new angle = 70° ÷ 2 = 35°.'],
        answer: '35° and 35°'
      },
      {
        question: 'Why must the compass width stay the same when drawing the two crossing arcs in a bisector construction?',
        steps: ['If the width changes, the two arcs will not cross at a point that is equally distant from both original points/arms.', 'Keeping the width the same is what guarantees the line found afterward is exactly in the middle.'],
        answer: 'Keeping the same compass width ensures the construction is accurate and truly bisects the angle or line.'
      }
    ],
    practiceZone: [
      'Use your protractor to measure a 60° angle in your book.',
      'Draw an angle of 130° (obtuse) using a protractor.',
      'List the tools you need for drawing a circle.',
      'Draw an 80° angle, then bisect it using only a compass and ruler. Measure both new angles with your protractor to check they are equal.',
      'Draw a straight line 8 cm long. Construct its perpendicular bisector, then measure to confirm it crosses at exactly 90° and cuts the line into two 4 cm halves.'
    ]
  },
  {
    id: 'zimbabwe-geometry',
    eyebrow: 'Chapter 4.5',
    title: 'Geometry in Zimbabwe',
    intro: 'Zimbabwe has a rich history of geometry. The ancient walls of Great Zimbabwe are built with stones fitted together without cement – the Conical Tower shows a perfect circular base. Modern buildings in Harare and Bulawayo use rectangles, cubes, and triangles. Geometry is all around us!',
    context: 'Look at the Zimbabwean flag: it has a white triangle and rectangles. The Great Zimbabwe monument uses circular shapes. Can you spot geometric shapes in your daily life?',
    examples: [
      {
        question: 'What shape is the Conical Tower at Great Zimbabwe?',
        steps: ['It has a circular base and goes up like a cylinder.', 'So it is based on a circle.'],
        answer: 'It is a cylindrical shape with a circular base.'
      }
    ],
    practiceZone: [
      'Find three geometric shapes in your classroom (e.g., rectangle, triangle).',
      'Draw a simple floor plan of a room using only rectangles and squares.',
      'Why do you think the builders of Great Zimbabwe used circular shapes?'
    ]
  },
  {
    id: 'hands-on-activity',
    eyebrow: 'Chapter 4.6',
    title: 'Hands-on Activity: The Right Angle Hunt',
    intro: 'Look around your classroom right now. Can you find five "Right Angles" (90°)? Hint: check the corners of your desk, the chalkboard, the door frame, or your textbook. Use your protractor to check if they are exactly 90°!',
    examples: [
      {
        question: 'Name one place you found a right angle in your classroom.',
        steps: ['Look at objects with corners.', 'A book, a desk, a window frame.'],
        answer: 'Example: the corner of my desk.'
      }
    ],
    practiceZone: [
      'List five right angles you found in your classroom.',
      'Draw a picture of your classroom showing at least three right angles.'
    ]
  }
];

/* ---------- Components ---------- */
const ExampleCard: React.FC<{ index: number; example: WorkedExample }> = ({ index, example }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {index}
        </div>
        <div className="text-slate-800 font-medium pt-1">
           {renderMathText(example.question)}
        </div>
      </div>
      
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-emerald-600 hover:bg-slate-100 transition-colors flex items-center justify-between"
      >
        <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
        <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      <div className={`border-t border-slate-100 bg-slate-50 p-4 sm:p-5 ${open ? 'block' : 'hidden'}`}>
        <div className={notebookPaperClassName} style={notebookPaperStyle}>
          {example.steps.map((step, i) => (
          <div key={i} className="flex gap-2 border-b border-stone-200/70 py-2 text-sm leading-relaxed text-slate-700 last:border-0">
            <span className="shrink-0 font-semibold text-rose-400">Step {i + 1}:</span>
            <span className="min-w-max flex-1 leading-relaxed">{renderMathText(step)}</span>
          </div>
          ))}
          <div className="border-t border-stone-200/70 pt-2 text-sm leading-relaxed">
            <span className="font-semibold text-slate-500 mr-1">Answer:</span>
            <span className="inline text-slate-900 font-medium">{renderMathText(example.answer)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useCenteredMathChapterTab(activeId);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 py-3">
      <div className="relative flex w-full min-w-0 max-w-full items-center px-3 sm:px-5 md:px-8 lg:px-10">
        <button onClick={() => scroll('left')} className="mr-2 shrink-0 rounded-full border bg-white p-1 text-slate-600 shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div ref={scrollRef} className="flex min-w-0 max-w-full flex-1 gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <button
              key={s.id}
              data-topic-id={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeId === s.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="ml-2 shrink-0 rounded-full border bg-white p-1 text-slate-600 shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
    </div>

    <div className="mb-6">
      <p className="text-slate-700 leading-relaxed mb-6">
        {renderMathText(section.intro)}
      </p>

      {section.introImage && (
        <div className="mb-6 flex justify-center">
          <figure className="w-full max-w-lg">
            <img
              src={section.introImage.src}
              alt={section.introImage.caption}
              className="w-full h-auto object-contain rounded-lg shadow-sm bg-white p-2 border border-emerald-100"
            />
            <figcaption className="mt-2 text-center text-sm text-slate-500 italic">
              {section.introImage.caption}
            </figcaption>
          </figure>
        </div>
      )}

      {section.diagram && (
        <div className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-600 uppercase mb-2 flex items-center gap-2">
            <span className="p-1 bg-emerald-100 rounded">🎨</span> {section.diagram.title}
          </h4>
          <div className="text-slate-600 text-sm leading-relaxed italic">
            {section.diagram.image && (
              <div className="flex justify-center mb-4">
                <img 
                  src={section.diagram.image} 
                  alt={section.diagram.title} 
                  className="h-24 w-auto object-contain rounded-lg shadow-sm bg-white p-1 border border-emerald-100" 
                />
              </div>
            )}
            <p className="text-center">{renderMathText(section.diagram.content)}</p>
          </div>
        </div>
      )}

      {section.diagrams && section.diagrams.map((d, i) => (
        <div key={i} className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
            <span className="p-1 bg-emerald-100 rounded">🎨</span> {d.title}
          </h4>
          <div className="flex justify-center mb-3">
            <img
              src={d.image}
              alt={d.title}
              className="w-full max-w-lg h-auto object-contain rounded-lg shadow-sm bg-white p-2 border border-emerald-100"
            />
          </div>
          <p className="text-center text-slate-600 text-sm leading-relaxed italic">
            {renderMathText(d.content)}
          </p>
        </div>
      ))}

      {section.method?.map((m, i) => (
        <div key={i} className="mb-6 last:mb-0">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {renderMathText(m.title)}
          </h3>
          <ul className="space-y-2 text-slate-700 ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{renderMathText(step)}</span>
              </li>
            ))}
          </ul>
          {m.image && (
            <div className="mt-4 flex justify-center">
              <figure className="w-full max-w-lg">
                <img
                  src={m.image.src}
                  alt={m.image.caption}
                  className="w-full h-auto object-contain rounded-lg shadow-sm bg-white p-2 border border-emerald-100"
                />
                <figcaption className="mt-2 text-center text-sm text-slate-500 italic">
                  {m.image.caption}
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      ))}

      {section.context && (
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-sm">
          <strong>Context:</strong> {renderMathText(section.context)}
        </div>
      )}
    </div>

    <div className="mb-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-widest">Examples</h3>
      {section.examples.map((ex, i) => (
        <ExampleCard key={i} index={i + 1} example={ex} />
      ))}
    </div>

    <div className="rounded-2xl bg-slate-900 p-4 sm:p-6 shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">✍️</span> Practice Zone
      </h3>
      <div className="space-y-4">
        {section.practiceZone.map((q, i) => (
          <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
            <span className="font-bold text-emerald-400">{i + 1}.</span>
            <span className="text-slate-200">{renderMathText(q)}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Geometry: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === active));
  const activeSection = sections[activeIndex] || sections[0];

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextChapter = () => {
    const nextSection = sections[activeIndex + 1];
    if (!nextSection) return;
    handleNavigate(nextSection.id);
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 [&_mjx-container]:font-bold [&_mjx-container_*]:font-bold [&_mjx-container]:text-[1.12em]">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 pt-12 pb-8">
          <div className="w-full min-w-0 max-w-full px-3 sm:px-5 md:px-8 lg:px-10">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-4">
              CHAPTER 4
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Geometry
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Geometry is the study of shapes, sizes, and positions. From the ancient stone walls of Great Zimbabwe to the design of the Zimbabwean flag, geometry is everywhere in our country and our daily lives.
            </p>
          </div>
        </div>

        <TopicNav activeId={active} onNavigate={handleNavigate} />

        <div className="w-full min-w-0 max-w-full px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
          <div key={activeSection.id} className="animate-[mathChapterEnter_320ms_ease-out]">
            <Section section={activeSection} />
          </div>

          <MathChapterPager
            currentIndex={activeIndex}
            totalChapters={sections.length}
            nextTopicTitle={nextTopicTitle}
            onNextChapter={goToNextChapter}
            onNextTopic={onNextTopic}
          />
        </div>
      </div>
    </MathJaxContext>
  );
};

export default Geometry;
