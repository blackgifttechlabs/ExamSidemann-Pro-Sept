import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { MathChapterPager, notebookPaperClassName, notebookPaperStyle, useCenteredMathChapterTab, type MathNavigationProps } from './mathLessonUtils';
import { useLessonState } from '../../../lessonProgress';

const cartesianGridImage = new URL('./images/cartesian-grid.png', import.meta.url).href;
const cartesianPlotStepsImage = new URL('./images/cartesian-plot-steps.png', import.meta.url).href;
const cartesianQuadrantsImage = new URL('./images/cartesian-quadrants.png', import.meta.url).href;
const scaleCompareImage = new URL('./images/scale-compare.png', import.meta.url).href;
const scaleConversionStepsImage = new URL('./images/scale-conversion-steps.png', import.meta.url).href;
const travelGraphAnnotatedImage = new URL('./images/travel-graph-annotated.png', import.meta.url).href;
const travelGraphReadingStepsImage = new URL('./images/travel-graph-reading-steps.png', import.meta.url).href;

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

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */
const blankCartesianSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 400 400" width="100%" height="100%">
  <rect x="-50" y="-50" width="400" height="400" fill="white" />
  <!-- Grid lines -->
  <g stroke="#eee" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => {
      const v = (i - 4) * 50;
      return `<line x1="${v}" y1="-50" x2="${v}" y2="350" /><line x1="-50" y1="${v}" x2="350" y2="${v}" />`;
    }).join('')}
  </g>
  <!-- Axes -->
  <line x1="-50" y1="150" x2="350" y2="150" stroke="black" stroke-width="2" />
  <line x1="150" y1="-50" x2="150" y2="350" stroke="black" stroke-width="2" />
  <!-- Arrow heads -->
  <polygon points="350,150 340,145 340,155" fill="black" />
  <polygon points="150,-50 145,-40 155,-40" fill="black" />
  <!-- Labels -->
  <text x="360" y="160" font-size="16" font-family="Arial" fill="black">x</text>
  <text x="160" y="-60" font-size="16" font-family="Arial" fill="black">y</text>
  <!-- Origin -->
  <circle cx="150" cy="150" r="3" fill="red" />
  <text x="155" y="165" font-size="14" font-family="Arial" fill="red">O (0,0)</text>
  <!-- Ticks and numbers -->
  ${[-3,-2,-1,1,2,3].map(v => {
    const x = 150 + v*50;
    const y = 150;
    return `<line x1="${x}" y1="${y-5}" x2="${x}" y2="${y+5}" stroke="black" />
            <text x="${x-8}" y="${y+20}" font-size="12" font-family="Arial">${v}</text>`;
  }).join('')}
  ${[-3,-2,-1,1,2,3].map(v => {
    const x = 150;
    const y = 150 - v*50;
    return `<line x1="${x-5}" y1="${y}" x2="${x+5}" y2="${y}" stroke="black" />
            <text x="${x-20}" y="${y+5}" font-size="12" font-family="Arial">${v}</text>`;
  }).join('')}
</svg>
`;

const plottedPointSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 400 400" width="100%" height="100%">
  <rect x="-50" y="-50" width="400" height="400" fill="white" />
  <g stroke="#eee" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => {
      const v = (i - 4) * 50;
      return `<line x1="${v}" y1="-50" x2="${v}" y2="350" /><line x1="-50" y1="${v}" x2="350" y2="${v}" />`;
    }).join('')}
  </g>
  <line x1="-50" y1="150" x2="350" y2="150" stroke="black" stroke-width="2" />
  <line x1="150" y1="-50" x2="150" y2="350" stroke="black" stroke-width="2" />
  <polygon points="350,150 340,145 340,155" fill="black" />
  <polygon points="150,-50 145,-40 155,-40" fill="black" />
  <text x="360" y="160" font-size="16" font-family="Arial" fill="black">x</text>
  <text x="160" y="-60" font-size="16" font-family="Arial" fill="black">y</text>
  <!-- Point (3,2) -->
  <circle cx="300" cy="50" r="6" fill="red" />
  <text x="310" y="45" font-size="14" font-family="Arial" fill="red">(3,2)</text>
  <!-- Dotted lines from point to axes -->
  <line x1="300" y1="50" x2="300" y2="150" stroke="red" stroke-dasharray="4,4" stroke-width="1.5" />
  <line x1="300" y1="50" x2="150" y2="50" stroke="red" stroke-dasharray="4,4" stroke-width="1.5" />
  <!-- Ticks and numbers -->
  ${[-3,-2,-1,1,2,3].map(v => {
    const x = 150 + v*50;
    const y = 150;
    return `<line x1="${x}" y1="${y-5}" x2="${x}" y2="${y+5}" stroke="black" />
            <text x="${x-8}" y="${y+20}" font-size="12" font-family="Arial">${v}</text>`;
  }).join('')}
  ${[-3,-2,-1,1,2,3].map(v => {
    const x = 150;
    const y = 150 - v*50;
    return `<line x1="${x-5}" y1="${y}" x2="${x+5}" y2="${y}" stroke="black" />
            <text x="${x-25}" y="${y+5}" font-size="12" font-family="Arial">${v}</text>`;
  }).join('')}
  <text x="155" y="165" font-size="14" font-family="Arial" fill="red">O</text>
</svg>
`;

const travelGraphSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect x="0" y="0" width="500" height="400" fill="white" />
  <!-- Axes -->
  <line x1="50" y1="350" x2="450" y2="350" stroke="black" stroke-width="2" />
  <line x1="50" y1="50" x2="50" y2="350" stroke="black" stroke-width="2" />
  <!-- Arrow heads -->
  <polygon points="450,350 440,345 440,355" fill="black" />
  <polygon points="50,50 55,60 45,60" fill="black" />
  <!-- Labels -->
  <text x="460" y="365" font-size="16" font-family="Arial">Time</text>
  <text x="20" y="45" font-size="16" font-family="Arial">Distance</text>
  <!-- Grid lines -->
  <g stroke="#eee" stroke-width="1">
    ${Array.from({ length: 6 }, (_, i) => `<line x1="50" y1="${350 - i*50}" x2="450" y2="${350 - i*50}" />`).join('')}
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${50 + i*50}" y1="50" x2="${50 + i*50}" y2="350" />`).join('')}
  </g>
  <!-- Travel line -->
  <polyline points="50,350 150,150 250,150 350,250 450,100" fill="none" stroke="blue" stroke-width="4" />
  <!-- Labels on segments -->
  <text x="90" y="240" font-size="14" fill="blue">Going away fast</text>
  <text x="190" y="130" font-size="14" fill="blue">Stopped (rest)</text>
  <text x="290" y="290" font-size="14" fill="blue">Going away slowly</text>
  <text x="370" y="170" font-size="14" fill="blue">Coming back</text>
  <!-- Ticks on axes -->
  ${Array.from({ length: 6 }, (_, i) => `<line x1="45" y1="${350 - i*50}" x2="55" y2="${350 - i*50}" stroke="black" />
          <text x="30" y="${355 - i*50}" font-size="12" font-family="Arial">${i*50}</text>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => `<line x1="${50 + i*50}" y1="345" x2="${50 + i*50}" y2="355" stroke="black" />
          <text x="${50 + i*50 - 8}" y="375" font-size="12" font-family="Arial">${i}</text>`).join('')}
</svg>
`;

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
    id: 'cartesian-plane',
    eyebrow: 'Chapter 8.1',
    title: 'The Cartesian Plane',
    intro: 'Imagine your classroom. Every desk has a place: some desks are in the front row, some are at the back, some are near the window, some are near the door. If a friend asks "where do you sit?", you might say "I am in the third row, second seat from the left." You just used TWO numbers to describe ONE exact spot: how far along, and how far up. That is exactly what we do in Mathematics with a special grid called the Cartesian Plane (say it: katizhen). Think of it like a map: on a map you find a place by measuring how far it is from a starting point, in two directions. Our plane has two straight lines that cross each other. The $x$-axis is a straight line going left and right (horizontal) — like the floor. The $y$-axis is a straight line going up and down (vertical) — like a wall. These two lines cross at one special point called the Origin, written $(0,0)$, because it is 0 steps right and 0 steps up — it is where every journey on the plane begins. Every other point on the plane is described using two numbers written inside brackets, like $(3,2)$. This is called an ordered pair, or coordinates. The FIRST number always tells you how far to move along the $x$-axis (left or right). The SECOND number always tells you how far to move along the $y$-axis (up or down). Why does the order matter so much? Think about walking through a building: you must walk along the hallway before you can climb the stairs. In the same way, we always move along $x$ first, then $y$. That is why the first number is called the $x$-coordinate and the second is called the $y$-coordinate — and we NEVER swap them, because $(3,2)$ and $(2,3)$ are two completely different points.',
    introImage: {
      src: cartesianGridImage,
      caption: 'A blank Cartesian plane with the x‑axis (horizontal) and y‑axis (vertical). The Origin is where they meet.'
    },
    diagrams: [
      {
        title: 'How to Plot a Point — Step by Step',
        content: 'Follow the numbered arrows: Step 1 find the Origin, Step 2 move along the x-axis, Step 3 move along the y-axis, Step 4 mark your point.',
        image: cartesianPlotStepsImage
      },
      {
        title: 'The Four Quadrants (Good to Know)',
        content: 'The plane is divided into four regions called quadrants. Notice the pattern of positive and negative signs in each one — this pattern never changes, so once you learn it, you can find any point\'s quadrant instantly.',
        image: cartesianQuadrantsImage
      }
    ],
    method: [
      {
        title: 'How to Plot a Point (Step by Step)',
        steps: [
          'Step 1: Find the Origin $(0,0)$ — this is your starting point, like the front door of a house. Every single point begins its journey from here.',
          'Step 2 (move along x →): Look at the FIRST number in the pair. This tells you how many steps to move along the $x$-axis. If it is positive, move right; if it is negative, move left. Justification: we move along $x$ first because $x$ is always written first in the pair $(x,y)$ — this is a rule everyone agrees on, so graphs from anyone in the world can be read the same way.',
          'Step 3 (move along y ↑): Now look at the SECOND number. From where you are standing after Step 2, this tells you how many steps to move along the $y$-axis. If it is positive, move up; if it is negative, move down. Justification: we do this second because $y$ is always written second — doing the steps in this order means two people will always land on the exact same point.',
          'Step 4: Mark the spot with a small dot or an "x", and write the coordinates next to it so anyone checking your work can see exactly which point you mean.',
          'Worked example: To plot $(3,2)$ — start at $(0,0)$, move 3 steps right (because $x=3$ is positive), then move 2 steps up (because $y=2$ is positive), then mark the point. This point sits exactly 3 units from the $y$-axis and 2 units from the $x$-axis — that distance is exactly what the coordinates were describing.'
        ],
        image: {
          src: cartesianPlotStepsImage,
          caption: 'Step by step: start at the Origin, move right along x, then move up along y, then mark the point.'
        }
      },
      {
        title: 'The Alphabet Rule (How to Remember the Order)',
        steps: [
          'The letter "$x$" comes before "$y$" in the alphabet — use this as a memory trick.',
          'So whenever you see $(x,y)$, always write the $x$-value first and the $y$-value second.',
          'This also reminds you which axis to move along first: $x$ (sideways) before $y$ (up/down).',
          'Common mistake to avoid: writing $(2,3)$ when you mean $(3,2)$. These look similar but are two completely different points on the plane — always double-check which number is $x$ and which is $y$ before you plot.'
        ]
      }
    ],
    examples: [
      {
        question: 'Plot the point $(2,3)$ on a Cartesian plane. Describe the steps.',
        steps: [
          'Start at $(0,0)$.',
          'Move 2 steps right (because $x=2$ is positive).',
          'Move 3 steps up (because $y=3$ is positive).',
          'Mark the spot.'
        ],
        answer: 'The point is $(2,3)$.'
      },
      {
        question: 'What are the coordinates of the Origin?',
        steps: [
          'The Origin is where the x‑axis and y‑axis cross.',
          'At that point, the distance is 0 along both axes.',
          'So the coordinates are $(0,0)$.'
        ],
        answer: '$(0,0)$'
      },
      {
        question: 'Where do you end up if you start at $(0,0)$, move 4 steps left and then 2 steps down?',
        steps: [
          'Moving left means $x$ is negative, so $x = -4$.',
          'Moving down means $y$ is negative, so $y = -2$.',
          'The point is $(-4,-2)$.'
        ],
        answer: '$(-4,-2)$'
      }
    ],
    practiceZone: [
      'Plot the point $(1,4)$ on a graph paper.',
      'Write the coordinates of a point that is 3 units right and 5 units up from the Origin.',
      'If you start at $(0,0)$ and move 2 steps left and 3 steps up, what are the coordinates?',
      'Explain why the point $(3,2)$ is not the same as $(2,3)$.',
      'On a Cartesian plane, mark the points $(0,2)$, $(2,0)$, and $(-1,-1)$.'
    ]
  },
  {
    id: 'scale',
    eyebrow: 'Chapter 8.2',
    title: 'Scale',
    intro: 'Imagine you want to draw a real elephant on a small piece of paper. You cannot draw it 3 metres tall — it would not fit! Instead, you draw it much smaller, keeping the same shape. Maps work the same way: a whole country cannot fit on paper at its real size, so mapmakers shrink everything using a rule, such as "1 centimetre on the map = 100 kilometres in real life." This rule is called a scale. In Mathematics, when we draw graphs, we face the same problem. Sometimes the numbers we need to show are very big (like 100 or 1000), but our graph paper is small. If we tried to use 1 box = 1 unit, we would need a huge piece of paper! So instead, we choose a scale that tells us how much one box (or one centimetre) on the paper represents in real numbers. For example, the instruction "Use a scale of 2 cm to represent 1 unit" means: every time you move 2 cm on your paper, you have actually moved 1 whole unit in your data. A scale is simply an agreement — a rule everyone follows so the graph makes sense and fits neatly on the page, no matter how big or small the real numbers are.',
    introImage: {
      src: scaleCompareImage,
      caption: 'Without a scale, big numbers do not fit on the page. With a scale, the same numbers fit neatly.'
    },
    method: [
      {
        title: 'How to Use a Scale: Units → Centimetres (Step by Step)',
        steps: [
          'Step 1: Find the scale given in the question, for example "1 cm = 5 units". Keep this rule in mind for the whole question.',
          'Step 2: Decide what number of units you want to draw or measure, for example "20 units".',
          'Step 3 (÷ divide): To change units into centimetres, divide the number of units by the number of units that 1 cm represents. Justification: dividing "undoes" the scaling and tells you how many centimetres are needed to represent that many units on paper.',
          'Step 4: The answer is how many centimetres you should measure and draw on your graph paper.',
          'Worked example: Scale is "1 cm = 5 units", and you want to show 20 units. Divide: $20 \\div 5 = 4$. So you draw a line 4 cm long. Justification: since every 5 units fits inside 1 cm, we are really asking "how many groups of 5 fit into 20?" — the answer, 4, is also the number of centimetres needed.'
        ],
        image: {
          src: scaleConversionStepsImage,
          caption: 'Step by step: write down the scale, take the number of units, divide by the scale number, get the answer in centimetres.'
        }
      },
      {
        title: 'Going the Other Way: Centimetres → Units',
        steps: [
          'Sometimes you are given a measured length in centimetres and asked how many units it represents. This is the reverse question, so you do the opposite calculation.',
          'Step: Look at how many centimetres the scale says equals 1 unit, then divide your measured length by that number. Justification: you are counting how many "1-unit groups" fit inside the length you measured.',
          'Worked example: Scale is "2 cm = 1 unit". You measure a line that is 6 cm long. Since every 2 cm equals 1 unit, divide: $6 \\div 2 = 3$. The line represents 3 units. Justification: we are finding how many groups of 2 cm fit into 6 cm — that count (3) is the number of units.'
        ]
      }
    ],
    examples: [
      {
        question: 'A graph uses a scale of 1 cm = 5 units. How many centimetres do you need to show 20 units?',
        steps: [
          'Divide 20 by 5: 20 ÷ 5 = 4.',
          'So you need 4 cm on the graph paper.'
        ],
        answer: '4 cm'
      },
      {
        question: 'If the scale is "2 cm represents 1 unit", how many centimetres represent 7 units?',
        steps: [
          'Each unit needs 2 cm.',
          'So 7 units need 7 × 2 = 14 cm.'
        ],
        answer: '14 cm'
      }
    ],
    practiceZone: [
      'A scale says 1 cm = 10 units. How long is a line that represents 50 units?',
      'You have a scale of 2 cm = 1 unit. Draw a line that is 6 cm long. How many units does it represent?',
      'Why is a scale important when drawing graphs?',
      'If the scale is 1 cm = 2 units, how many centimetres for 15 units?'
    ]
  },
  {
    id: 'travel-graphs',
    eyebrow: 'Chapter 8.3',
    title: 'Travel Graphs (Distance-Time)',
    intro: 'Imagine you leave home to visit a friend, then later come back. If someone recorded exactly where you were every minute, they could draw a picture of your whole trip using just two things: time (how many minutes have passed) and distance (how far you are from home). This picture is called a travel graph, or distance-time graph. On this graph, the horizontal axis (bottom, going sideways) always shows Time, and the vertical axis (side, going up) always shows Distance from the starting point. The graph is made of one connecting line that tells the whole story of a journey, like a comic strip without words. By studying the shape of the line — whether it goes up steeply, gently, stays flat, or comes back down — we can figure out exactly what happened on the journey, even though we were not there to see it. This is a genuinely useful skill: bus companies, delivery drivers, and even athletes use distance-time graphs to study movement and plan better journeys.',
    introImage: {
      src: travelGraphAnnotatedImage,
      caption: 'A distance-time graph showing different parts: moving away fast, stopping, moving slowly, and coming back.'
    },
    method: [
      {
        title: 'How to Read a Travel Graph (Step by Step)',
        steps: [
          'Step 1: Look at both axes first. Check what the bottom axis measures (usually time, in hours or minutes) and what the side axis measures (usually distance, in km or metres). Justification: you must know what the numbers mean before you can read the story of the journey.',
          'Step 2: Follow the line from left to right — this is the direction time moves, just like reading a sentence from the first word to the last.',
          'Step 3: Look at the slope (steepness) of each part of the line. A steep line going up means moving away FAST — a lot of distance covered in a little time. A gentle line going up means moving away SLOWLY. A flat (horizontal) line means NOT MOVING AT ALL — stopped or resting, because the distance is not changing even though time keeps passing. A line going down means coming BACK toward the start. Justification: the steepness of a line always tells you the speed, because speed = distance ÷ time, and a steeper line means more distance is covered for the same amount of time.',
          'Step 4: To answer questions, read the exact numbers off the axes at the points you need — for example, to find how long someone stopped, find where the line is flat and read the time values at the start and end of that flat part, then subtract them.'
        ],
        image: {
          src: travelGraphReadingStepsImage,
          caption: 'Step by step: check the axes, follow the line left to right, then read the slope to find the speed.'
        }
      }
    ],
    context: 'Zimbabwean Example: A bus leaves Masvingo at 8:00 am. It travels 50 km, then stops for 30 minutes because of a breakdown. After that, it travels slowly for another 20 km and then stops at the destination. On a distance-time graph, you would see: a steep upward line (moving fast), a flat line (stopped), a gentler upward line (moving slowly), and a flat line again (arrived).',
    examples: [
      {
        question: 'A travel graph shows a horizontal line for 2 hours. What does that mean?',
        steps: [
          'Horizontal line means the distance is not changing.',
          'So the person or vehicle is not moving.',
          'It is stopped for 2 hours.'
        ],
        answer: 'It means they stopped (rested) for 2 hours.'
      },
      {
        question: 'On a distance-time graph, the line is very steep going up. What does that tell you about the journey?',
        steps: [
          'Steep line means distance increases quickly over a short time.',
          'That means the speed is high, so they are moving fast.'
        ],
        answer: 'They are moving away very fast (high speed).'
      },
      {
        question: 'A bus travels 100 km in 2 hours, then stops for 1 hour, then returns to the start in 3 hours. Draw and describe the graph.',
        steps: [
          'First part: up steeply (100 km in 2 hrs).',
          'Second part: flat line for 1 hour (stopped).',
          'Third part: down to 0 km in 3 hours (returning).'
        ],
        answer: 'The graph has a steep upward slope, a flat line, then a downward slope.'
      }
    ],
    practiceZone: [
      'Look at a distance-time graph. How can you tell when someone is moving fastest?',
      'A horizontal line on a travel graph means what?',
      'If a line goes down, is the person moving toward or away from home?',
      'Draw a simple travel graph for a person who walks slowly for 1 hour, rests for 30 minutes, then walks back home quickly.',
      'A car travels 30 km in 30 minutes, stops for 10 minutes, then travels another 20 km in 20 minutes. Sketch the distance-time graph.'
    ]
  }
];

/* ---------- Components (same as Sets) ---------- */
const ExampleCard: React.FC<{ index: number; example: WorkedExample }> = ({ index, example }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {index}
        </div>
        <div className="text-slate-800 font-medium pt-1">
           <MathJax inline>{example.question}</MathJax>
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
            <MathJax inline className="min-w-max flex-1 leading-relaxed">{step}</MathJax>
          </div>
          ))}
          <div className="border-t border-stone-200/70 pt-2 text-sm leading-relaxed">
            <span className="font-semibold text-slate-500 mr-1">Answer:</span>
            <MathJax inline className="inline text-slate-900 font-medium">{example.answer}</MathJax>
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
    <div className="lesson-topic-navigation sticky top-0 z-30 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200 py-3">
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

const renderMethodTitle = (title: string) => {
  const marker = '(Step by Step)';
  const markerIndex = title.indexOf(marker);

  if (markerIndex === -1) return title;

  return (
    <>
      {title.slice(0, markerIndex)}
      <span className="font-extrabold text-slate-950">{marker}</span>
      {title.slice(markerIndex + marker.length)}
    </>
  );
};

const renderMethodStep = (step: string) => {
  const match = step.match(/^((?:Step\s+\d+(?:\s*\([^)]*\))?|Worked example):)(\s*)(.*)$/);

  if (!match) {
    return <MathJax inline>{step}</MathJax>;
  }

  const [, prefix, spacing, rest] = match;

  if (prefix.startsWith('Worked example')) {
    return (
      <div className={notebookPaperClassName} style={notebookPaperStyle}>
        <div className="text-sm font-extrabold text-slate-950">{prefix}</div>
        <div className="mt-1 pl-5 text-sm leading-relaxed text-slate-700">
          <span className="mr-2 font-bold text-rose-400" aria-hidden="true">→</span>
          <MathJax inline>{rest}</MathJax>
        </div>
      </div>
    );
  }

  return (
    <span>
      <strong className="font-extrabold text-slate-950">{prefix}</strong>
      {spacing}
      <span className="[&_mjx-container]:whitespace-nowrap">
        <MathJax inline>{rest}</MathJax>
      </span>
    </span>
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
        <MathJax inline>{section.intro}</MathJax>
      </p>

      {section.introImage && (
        <div className="mb-6 flex justify-center">
          <figure className="w-full max-w-lg">
            <img loading="lazy" decoding="async"
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
                <img loading="lazy" decoding="async" 
                  src={section.diagram.image} 
                  alt={section.diagram.title} 
                  className="h-24 w-auto object-contain rounded-lg shadow-sm bg-white p-1 border border-emerald-100" 
                />
              </div>
            )}
            <p className="text-center"><MathJax inline>{section.diagram.content}</MathJax></p>
          </div>
        </div>
      )}

      {section.diagrams && section.diagrams.map((d, i) => (
        <div key={i} className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-600 uppercase mb-3 flex items-center gap-2">
            <span className="p-1 bg-emerald-100 rounded">🎨</span> {d.title}
          </h4>
          <div className="flex justify-center mb-3">
            <img loading="lazy" decoding="async"
              src={d.image}
              alt={d.title}
              className="w-full max-w-lg h-auto object-contain rounded-lg shadow-sm bg-white p-2 border border-emerald-100"
            />
          </div>
          <p className="text-center text-slate-600 text-sm leading-relaxed italic">
            <MathJax inline>{d.content}</MathJax>
          </p>
        </div>
      ))}

      {section.method?.map((m, i) => (
        <div key={i} className="mb-6 last:mb-0">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{renderMethodTitle(m.title)}</span>
          </h3>
          <ul className="space-y-2 text-slate-700 ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="leading-relaxed">{renderMethodStep(step)}</span>
              </li>
            ))}
          </ul>
          {m.image && (
            <div className="mt-4 flex justify-center">
              <figure className="w-full max-w-lg">
                <img loading="lazy" decoding="async"
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
          <strong>Context:</strong> <MathJax inline>{section.context}</MathJax>
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
            <MathJax className="text-slate-200">{q}</MathJax>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Graphs: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 8
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Graphs
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Learn how to use the Cartesian plane, choose a scale, and read travel graphs.
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

export default Graphs;
