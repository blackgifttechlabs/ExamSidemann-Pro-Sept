import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { MathChapterPager, renderMathText, useCenteredMathChapterTab, type MathNavigationProps } from './mathLessonUtils';
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

const measuringToolsGalleryImage = new URL('./images/measuring_tools_gallery.png', import.meta.url).href;
const conversionLadderDiagramImage = new URL('./images/conversion_ladder_diagram.png', import.meta.url).href;
const lengthMassCapacityConversionTableImage = new URL('./images/length_mass_capacity_conversion_table.png', import.meta.url).href;
const readingRulerStepsImage = new URL('./images/reading_ruler_steps.png', import.meta.url).href;
const readingWeighingScaleStepsImage = new URL('./images/reading_weighing_scale_steps.png', import.meta.url).href;
const readingThermometerStepsImage = new URL('./images/reading_thermometer_steps.png', import.meta.url).href;
const temperatureChangeCalculationImage = new URL('./images/temperature_change_calculation.png', import.meta.url).href;
const perimeterCalculationStepsImage = new URL('./images/perimeter_calculation_steps.png', import.meta.url).href;
const areaGridMethodImage = new URL('./images/area_grid_method.png', import.meta.url).href;
const areaFormulasGalleryImage = new URL('./images/area_formulas_gallery.png', import.meta.url).href;
const triangleAreaCalculationStepsImage = new URL('./images/triangle_area_calculation_steps.png', import.meta.url).href;
const volumeCubeCuboidGalleryImage = new URL('./images/volume_cube_cuboid_gallery.png', import.meta.url).href;
const volumeCalculationStepsImage = new URL('./images/volume_calculation_steps.png', import.meta.url).href;

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
  introImage?: { src: string; caption: string; className?: string };
  diagram?: { title: string; content: string; type: string; image?: string };
  diagrams?: { title: string; content: string; image: string }[];
  method?: { title: string; steps: string[]; image?: { src: string; caption: string } }[];
  context?: string;
  examples: WorkedExample[];
  practiceZone: string[];
}

const sections: TopicSection[] = [
  {
    id: 'types-of-measures',
    eyebrow: 'Chapter 6.1',
    title: 'The Different Types of Measures',
    intro: 'Measurement is how we describe the world using numbers instead of just words like "big" or "heavy". Instead of saying a road is "far", we say it is 15 km. Instead of saying mealie-meal is "heavy", we say it is 10 kg. This is useful because numbers are exact — everyone understands them the same way, no matter who is speaking. In Form 1, we focus on four main types of measurement: Length (how long something is), Mass (how heavy something is), Capacity (how much liquid a container holds), and Temperature (how hot or cold something is). Each type has its own units (the "labels" we attach to numbers) and its own tools for measuring.',
    introImage: {
      src: measuringToolsGalleryImage,
      caption: 'The main tools used for each type of measurement.'
    },
    method: [
      {
        title: 'Four Types of Measurement',
        steps: [
          'Length: The distance between two points. Units: mm (small, like the width of a fly), cm (pen or notebook), m (classroom), km (between towns). Tools: Ruler, Tape Measure.',
          'Mass: How much "stuff" is inside an object — we often call this weight in everyday speech. Units: g (light things like salt), kg (bags of sugar), tonnes (a truck or a harvest). Tools: Kitchen Scale, Bathroom Scale, Beam Balance.',
          'Capacity: The amount of liquid a container can hold. Units: ml (a small spoon of medicine), L (a bottle of Mazoe or a bucket). Tools: Measuring jug, Measuring cylinder.',
          'Temperature: How hot or cold something is. Unit: Degrees Celsius (°C). Tool: Thermometer. Water freezes at 0°C and boils at 100°C — these two fixed points are how the whole Celsius scale was built.'
        ]
      }
    ],
    examples: [
      {
        question: 'Which unit would you use to measure the distance from Bulawayo to Victoria Falls?',
        steps: ['The distance between towns is large.', 'Kilometers (km) are used for long distances.'],
        answer: 'Kilometers (km)'
      },
      {
        question: 'Convert 5 kg of sugar into grams.',
        steps: ['1 kg = 1000 g.', '5 × 1000 = 5000 g.'],
        answer: '5000 g'
      }
    ],
    practiceZone: [
      'Which unit would you use to measure the length of your pen?',
      'What tool do you use to measure the temperature of water?',
      'Name one thing you would measure in tonnes.'
    ]
  },
  {
    id: 'conversion-ladder',
    eyebrow: 'Chapter 6.2',
    title: 'The Conversion Ladder',
    intro: 'Sometimes a measurement is given in a unit that is not convenient for what we need, so we must convert it. The rule is simple once you understand why it works: to change from a BIG unit to a SMALL unit, we multiply — because it takes many small units to make one big unit, so the number must get bigger. To change from a SMALL unit to a BIG unit, we divide — because we are grouping small units into fewer, bigger groups, so the number must get smaller. Think of a ladder: big units live at the top, small units live at the bottom. Moving down the ladder means multiplying (×), and moving up means dividing (÷).',
    introImage: {
      src: conversionLadderDiagramImage,
      caption: 'The Conversion Ladder: multiply when going down (big to small), divide when going up (small to big).',
      className: 'w-full max-w-xs sm:max-w-sm'
    },
    diagrams: [
      {
        title: 'Conversion Numbers to Memorise',
        content: 'These are the exact multiply/divide numbers for length, mass, and capacity conversions.',
        image: lengthMassCapacityConversionTableImage
      }
    ],
    method: [
      {
        title: 'How to Use the Conversion Ladder',
        steps: [
          'Step 1: Look at the unit you HAVE and the unit you WANT.',
          'Step 2: Decide which one is bigger and which one is smaller.',
          'Step 3: If you are going from big to small, multiply. If you are going from small to big, divide.',
          'Step 4: Use the correct conversion number: × 1000 for km↔m, g↔kg, ml↔L; × 100 for m↔cm; × 10 for cm↔mm.',
          'Example: 2 L to ml. Liters is bigger than milliliters, so we multiply. 2 × 1000 = 2000 ml.',
          'Example: 15000 ml to L. Milliliters is smaller than Liters, so we divide. 15000 ÷ 1000 = 15 L.',
          'Example: 3.5 km to m. Multiply because km is bigger than m. 3.5 × 1000 = 3500 m.'
        ]
      }
    ],
    examples: [
      {
        question: 'A large bottle of Mazoe holds 2 Liters. How many milliliters (ml) is that?',
        steps: ['Liters is the bigger unit, so we multiply to convert to the smaller unit ml.', '1 L = 1000 ml.', '2 × 1000 = 2000 ml.'],
        answer: '2000 ml'
      },
      {
        question: 'A bucket holds 15,000 ml of water. How many Liters is that?',
        steps: ['Milliliters is the smaller unit, so we divide to convert to the bigger unit L.', '1000 ml = 1 L.', '15000 ÷ 1000 = 15 L.'],
        answer: '15 L'
      },
      {
        question: 'A bag of rice weighs 4.2 kg. How many grams is that?',
        steps: ['kg is bigger than g, so we multiply.', '4.2 × 1000 = 4200 g.'],
        answer: '4200 g'
      },
      {
        question: 'A road is 4500 m long. How many km is that?',
        steps: ['m is smaller than km, so we divide.', '4500 ÷ 1000 = 4.5 km.'],
        answer: '4.5 km'
      }
    ],
    practiceZone: [
      'Convert 3 km to meters.',
      'How many grams are in 2.5 kg?',
      'Convert 2500 ml to Liters.',
      'Convert 750 cm to meters.',
      'A truck carries 2.3 tonnes of maize. How many kg is that?'
    ]
  },
  {
    id: 'reading-instruments',
    eyebrow: 'Chapter 6.3',
    title: 'Reading Measuring Instruments Correctly',
    intro: 'Knowing the units is not enough — you must also be able to read the actual tool correctly, or your measurement will be wrong even if your maths is right. Many mistakes in real life happen not because someone cannot calculate, but because they read the ruler, scale, or thermometer incorrectly. Below are the correct methods for reading the four tools we use most often.',
    method: [
      {
        title: 'How to Read a Ruler',
        steps: [
          'Step 1: Line up the 0 cm mark exactly with the start of the object you are measuring.',
          'Step 2: Look at exactly where the other end of the object lines up on the ruler.',
          'Step 3: Read the number at that point, including the small marks between the main numbers (each small mark is usually 1 mm, since 1 cm = 10 mm).'
        ],
        image: {
          src: readingRulerStepsImage,
          caption: 'Step-by-step: reading a length off a ruler.'
        }
      },
      {
        title: 'How to Read a Weighing Scale',
        steps: [
          'Step 1: Place the object gently on the scale.',
          'Step 2: Wait until the needle or number stops moving and settles — reading it too early gives a wrong value.',
          'Step 3: Read the number the needle points to, or the number shown on the digital display.'
        ],
        image: {
          src: readingWeighingScaleStepsImage,
          caption: 'Step-by-step: reading a weighing scale.'
        }
      },
      {
        title: 'How to Read a Measuring Cylinder (Liquid Capacity)',
        steps: [
          'Step 1: Place the measuring cylinder on a flat, level surface so the liquid settles evenly.',
          'Step 2: Bend down so your eye is exactly level with the liquid surface — looking from above or below gives a wrong reading.',
          'Step 3: Liquid forms a small curve called a meniscus. Always read the measurement at the BOTTOM of this curve, not the top.'
        ]
      },
      {
        title: 'How to Read a Thermometer',
        steps: [
          'Step 1: Find the top of the red (or silver) liquid line inside the thermometer.',
          'Step 2: Match that point to the nearest mark on the printed scale beside it.',
          'Step 3: Read the temperature in degrees Celsius (°C) at that mark.'
        ],
        image: {
          src: readingThermometerStepsImage,
          caption: 'Step-by-step: reading a thermometer.'
        }
      }
    ],
    examples: [
      {
        question: 'Why must you read a measuring cylinder at eye level instead of from above?',
        steps: ['Looking from above or below changes the angle you see the liquid line at, which makes the reading look higher or lower than it really is.', 'Reading at eye level with the bottom of the curve gives the true, accurate volume.'],
        answer: 'Reading from the wrong angle causes an inaccurate reading — always read at eye level, at the bottom of the curve.'
      },
      {
        question: 'A ruler is placed against a pencil, but the 0 cm mark is not lined up with the start of the pencil — it starts at the 2 cm mark instead. The pencil ends at 9 cm. How long is the pencil?',
        steps: ['Since the ruler did not start at 0, we cannot just read 9 cm directly.', 'We subtract the starting point from the ending point: 9 cm − 2 cm = 7 cm.'],
        answer: '7 cm'
      }
    ],
    practiceZone: [
      'Use a ruler to measure the length of your pencil case to the nearest mm.',
      'Explain in your own words why you should wait for a weighing scale needle to settle before reading it.',
      'Look at a measuring cylinder with water at 340 ml. Draw what the meniscus (curve) would look like.',
      'A thermometer reads exactly halfway between the 36°C and 38°C marks. What is the temperature?'
    ]
  },
  {
    id: 'temperature',
    eyebrow: 'Chapter 6.4',
    title: 'Temperature',
    intro: 'Temperature tells us how hot or cold something is. We measure it using a thermometer in Degrees Celsius (°C). In Zimbabwe, we experience hot summers (over 30°C) and cool winters (around 10°C). Knowing how to read and calculate temperature changes is useful for weather forecasts, cooking, and even checking if someone has a fever.',
    method: [
      {
        title: 'Key Temperature Facts',
        steps: [
          'Temperature is measured in Degrees Celsius (°C).',
          'Water freezes at 0°C — this is the point where water turns to ice.',
          'Water boils at 100°C — this is the point where water turns to steam.',
          'A healthy human body temperature is about 37°C. A temperature above this can mean someone has a fever.'
        ]
      },
      {
        title: 'How to Calculate a New Temperature After a Change',
        steps: [
          'Step 1: Write down the starting temperature.',
          'Step 2: Decide if the temperature is rising or falling.',
          'Step 3: If it is rising, ADD the change. If it is falling, SUBTRACT the change.',
          'Step 4: Write your final answer with the °C symbol.',
          'Example: Morning temperature is 15°C. It rises by 12°C by noon. New temperature = 15 + 12 = 27°C.',
          'Example: Afternoon temperature is 28°C. It falls by 9°C by evening. New temperature = 28 − 9 = 19°C.'
        ],
        image: {
          src: temperatureChangeCalculationImage,
          caption: 'Step-by-step: calculating a new temperature after a rise.'
        }
      }
    ],
    examples: [
      {
        question: 'If the temperature in Chinhoyi is 15°C in the morning and rises by 12°C by noon, what is the new temperature?',
        steps: ['Start at 15°C.', 'Since it is rising, we add the change.', '15 + 12 = 27°C.'],
        answer: '27°C'
      },
      {
        question: 'The temperature in Mutare is 24°C at midday and falls by 10°C by night. What is the night temperature?',
        steps: ['Start at 24°C.', 'Since it is falling, we subtract the change.', '24 − 10 = 14°C.'],
        answer: '14°C'
      },
      {
        question: 'A patient has a temperature of 39°C. Normal body temperature is 37°C. How far above normal is the patient?',
        steps: ['We find the difference between the two temperatures.', '39 − 37 = 2°C above normal.'],
        answer: '2°C above normal — this could indicate a fever.'
      }
    ],
    practiceZone: [
      'What is the boiling point of water in °C?',
      'If the temperature drops from 28°C to 20°C, how much did it drop?',
      'A freezer is at -5°C. The temperature rises by 8°C. What is the new temperature?',
      'The temperature at 6am is 12°C and rises steadily by 3°C every hour. What is the temperature at 10am?',
      'Explain in your own words why 0°C and 100°C are important reference points on the Celsius scale.'
    ]
  },
  {
    id: 'perimeter',
    eyebrow: 'Chapter 6.5',
    title: 'Perimeter (The Outside)',
    intro: 'Perimeter is the total distance all the way around the outside of a shape. Think of it like a fence around a yard or a cattle kraal — the perimeter is exactly how much wire you would need to go all the way around. To find the perimeter, we simply add all the side lengths together, because we are literally walking around the edge and counting the distance. For a square, all 4 sides are equal, so instead of adding four times, we can multiply the side length by 4. For a rectangle, opposite sides are equal, so we add the length and width once, then double it (because each appears twice around the shape).',
    method: [
      {
        title: 'How to Calculate Perimeter',
        steps: [
          'Step 1: Identify the shape (square, rectangle, or other).',
          'Step 2: Write down all the side lengths.',
          'Step 3: Add them all together for the perimeter — this works for ANY shape, even an irregular one.',
          'Step 4: For a square, use the shortcut P = 4 × side, since all four sides are the same.',
          'Step 5: For a rectangle, use the shortcut P = (L + W) × 2, since L appears twice and W appears twice.',
          'Example (square): side = 5m, P = 4 × 5 = 20m.',
          'Example (rectangle): L = 10m, W = 5m, P = (10 + 5) × 2 = 30m.'
        ],
        image: {
          src: perimeterCalculationStepsImage,
          caption: 'Step-by-step: calculating the perimeter of a rectangle.'
        }
      }
    ],
    examples: [
      {
        question: 'A farmer wants to fence a rectangular kraal that is 12m long and 8m wide. How much fencing wire does he need?',
        steps: ['Rectangle perimeter: P = (L + W) × 2.', 'P = (12 + 8) × 2 = 20 × 2 = 40m.'],
        answer: '40 meters of fencing wire.'
      },
      {
        question: 'A square tile has a side of 30 cm. Find its perimeter.',
        steps: ['Square perimeter: P = 4 × side.', 'P = 4 × 30 = 120 cm.'],
        answer: '120 cm'
      }
    ],
    practiceZone: [
      'Find the perimeter of a square with side 7 cm.',
      'A rectangle is 6 m long and 4 m wide. What is its perimeter?',
      'A triangular garden has sides of 3 m, 4 m, and 5 m. What is its perimeter?'
    ]
  },
  {
    id: 'area',
    eyebrow: 'Chapter 6.6',
    title: 'Area (The Inside)',
    intro: 'Area is the amount of flat surface inside a shape — not the edge, but everything covered by it. Think of it like the floor tiles covering a room, or the grass covering a football pitch. We measure area in "squared" units like cm² or m², because we are really counting how many small unit-squares (like 1cm × 1cm squares) fit inside the shape. For rectangles and squares, multiplying the sides together is really just a fast way of counting all those squares — the grid method below shows exactly why this works. For a right-angled triangle, notice that two identical right-angled triangles can always be joined to form a rectangle, so a triangle\'s area is always exactly half of that matching rectangle: half of base × height.',
    introImage: {
      src: areaGridMethodImage,
      caption: 'The Grid Method: count the squares inside the rectangle to find the area.'
    },
    diagrams: [
      {
        title: 'The Three Area Formulas',
        content: 'Compare the formulas for a square, rectangle, and triangle side by side.',
        image: areaFormulasGalleryImage
      }
    ],
    method: [
      {
        title: 'How to Calculate Area',
        steps: [
          'Step 1: Identify the shape (square, rectangle, or triangle).',
          'Step 2: Find the required measurements (side, length & width, or base & height).',
          'Step 3: Use the matching formula below.',
          'Square: Area = side × side (s²). Example: side = 6m, A = 6 × 6 = 36m².',
          'Rectangle: Area = L × W. Example: L = 8m, W = 7m, A = 8 × 7 = 56m².',
          'Triangle: Area = ½ × base × height. Example: base = 6cm, height = 4cm, A = ½ × 6 × 4 = 12cm².'
        ]
      },
      {
        title: 'Why the Triangle Formula Has a ½',
        steps: [
          'Step 1: Identify the base and the height of the right-angled triangle (the height must meet the base at a right angle).',
          'Step 2: Multiply base × height. This actually gives you the area of the full rectangle that the triangle sits inside.',
          'Step 3: Divide that answer by 2, because the triangle is exactly half of that rectangle.',
          'Example: base = 10 cm, height = 5 cm. Rectangle area = 10 × 5 = 50 cm². Triangle area = 50 ÷ 2 = 25 cm².'
        ],
        image: {
          src: triangleAreaCalculationStepsImage,
          caption: 'Step-by-step: calculating the area of a right-angled triangle.'
        }
      }
    ],
    examples: [
      {
        question: 'A classroom floor is 8 m long and 7 m wide. What is the area of the floor?',
        steps: ['Area of rectangle = L × W.', '8 × 7 = 56 m².'],
        answer: '56 m²'
      },
      {
        question: 'Calculate the area of a right-angled triangle with a base of 10 cm and a height of 5 cm.',
        steps: ['Area = ½ × base × height.', '½ × 10 × 5 = 5 × 5 = 25 cm².'],
        answer: '25 cm²'
      },
      {
        question: 'A square tile has a side of 30 cm. Find its area.',
        steps: ['Area of square = side × side.', '30 × 30 = 900 cm².'],
        answer: '900 cm²'
      }
    ],
    practiceZone: [
      'Find the area of a square with side 7 cm.',
      'A rectangle is 6 m long and 4 m wide. What is its area?',
      'Calculate the area of a triangle with base 8 m and height 6 m.',
      'Which has a bigger area: a square with 6 m sides, or a rectangle that is 8 m long and 4 m wide?',
      'Explain in your own words why we divide by 2 when finding the area of a triangle.',
      'A garden is a rectangle 10 m by 6 m, with a triangular flower bed of base 4 m and height 3 m cut out of one corner. Find the remaining area of the garden.'
    ]
  },
  {
    id: 'volume',
    eyebrow: 'Chapter 6.7',
    title: 'Volume (Filling a Solid Shape)',
    intro: 'Volume is the amount of space a solid 3D object takes up, or the amount it can hold inside — think of it like how many sugar cubes you would need to completely fill a box, with no gaps. Area only needed length and width because it is flat (2D), but volume needs a third measurement: height. Because we are now measuring space in three directions instead of two, we measure volume in "cubed" units, like cm³ or m³. In Form 1, we focus on two solids: a Cube (a box where every side is exactly equal, like a dice) and a Cuboid (a rectangular box where length, width, and height can all be different, like a matchbox or a classroom).',
    introImage: {
      src: volumeCubeCuboidGalleryImage,
      caption: 'A cube and a cuboid, with their volume formulas.'
    },
    method: [
      {
        title: 'How to Calculate the Volume of a Cuboid',
        steps: [
          'Step 1: Identify the length, width, and height of the box.',
          'Step 2: Multiply all three together: Volume = length × width × height.',
          'Step 3: Write your answer in cubic units (cm³, m³), because you are filling a 3D space, not just covering a flat surface.',
          'Example: length = 5 cm, width = 4 cm, height = 3 cm. Volume = 5 × 4 × 3 = 60 cm³.'
        ],
        image: {
          src: volumeCalculationStepsImage,
          caption: 'Step-by-step: calculating the volume of a cuboid.'
        }
      },
      {
        title: 'How to Calculate the Volume of a Cube',
        steps: [
          'Step 1: Since every side of a cube is exactly the same length, you only need to know one measurement: the side length.',
          'Step 2: Multiply the side by itself three times: Volume = side × side × side.',
          'Step 3: Write your answer in cubic units.',
          'Example: side = 4 cm. Volume = 4 × 4 × 4 = 64 cm³.'
        ]
      }
    ],
    examples: [
      {
        question: 'A box is 6 cm long, 3 cm wide, and 2 cm high. Find its volume.',
        steps: ['Volume of a cuboid = length × width × height.', '6 × 3 × 2 = 36 cm³.'],
        answer: '36 cm³'
      },
      {
        question: 'A dice-shaped box (a cube) has a side of 5 cm. Find its volume.',
        steps: ['Volume of a cube = side × side × side.', '5 × 5 × 5 = 125 cm³.'],
        answer: '125 cm³'
      },
      {
        question: 'A water tank is a cuboid 2 m long, 1 m wide, and 1.5 m high. How much water can it hold?',
        steps: ['Volume = length × width × height.', '2 × 1 × 1.5 = 3 m³.'],
        answer: '3 m³'
      }
    ],
    practiceZone: [
      'Find the volume of a cuboid box 8 cm long, 5 cm wide, and 4 cm high.',
      'Find the volume of a cube with a side of 3 cm.',
      'Explain in your own words why volume is measured in "cubed" units (cm³) but area is measured in "squared" units (cm²).',
      'Two boxes both have a volume of 60 cm³. Box A is 5 × 4 × 3 cm. Suggest a different set of length, width, and height for Box B that also gives 60 cm³.'
    ]
  },
  {
    id: 'unhu-link-measures',
    eyebrow: 'Chapter 6.8',
    title: 'Unhu/Ubuntu Link: Accuracy in Measurement',
    intro: 'In our communities, we value accuracy and honesty. When you measure ingredients for cooking or building a structure, being precise shows respect for the work and the people. Just like the builders of Great Zimbabwe used careful measurements to create their stone walls, we should always measure carefully and check our work.',
    context: 'In Zimbabwean culture, we value hard work and precision. When you measure, make sure you do it correctly – whether it is weighing mealie-meal for your family or measuring the length of a field for planting.',
    examples: [
      {
        question: 'Why is it important to measure accurately when cooking?',
        steps: ['If you use too much or too little, the food may not taste right.', 'Accurate measurements show respect for the people you are cooking for.'],
        answer: 'Accurate measurements ensure good results and show respect.'
      }
    ],
    practiceZone: [
      'Give one example of when accurate measurement is important in daily life.',
      'How can being careful with measurements show respect for others?'
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

      <div
        className={`border-t border-slate-100 bg-emerald-50/40 p-5 space-y-2 ${open ? 'block' : 'hidden'}`}
      >
        {example.steps.map((step, i) => (
          <div key={i} className="flex gap-2 text-sm text-slate-700">
            <span className="font-semibold text-emerald-500 shrink-0">Step {i + 1}:</span>
            <span className="leading-relaxed">{renderMathText(step)}</span>
          </div>
        ))}
        <div className="mt-3 rounded-lg bg-white border border-emerald-200 px-4 py-2.5">
          <span className="font-semibold text-slate-500 text-sm mr-1">Answer:</span>
          <span className="inline text-slate-900 font-medium">{renderMathText(example.answer)}</span>
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
          <figure className={section.introImage.className ?? 'w-full max-w-lg'}>
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

export const MeasuresAndMensuration: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 6
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Measures and Mensuration
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Measurement is how we describe the world in numbers. Learn about units, conversions, perimeter, and area.
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

export default MeasuresAndMensuration;
