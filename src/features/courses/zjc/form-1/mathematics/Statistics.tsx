import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { MathChapterPager, notebookPaperClassName, notebookPaperStyle, useCenteredMathChapterTab, type MathNavigationProps } from './mathLessonUtils';
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

const dataHandlingCycleImage = new URL('./images/data_handling_cycle.png', import.meta.url).href;
const tallyTableSnacksExampleImage = new URL('./images/tally_table_snacks_example.png', import.meta.url).href;
const translationGridExampleImage = new URL('./images/translation_grid_example.png', import.meta.url).href;
const barGraphConstructionStepsImage = new URL('./images/bar_graph_construction_steps.png', import.meta.url).href;
const pictogramExampleImage = new URL('./images/pictogram_example.png', import.meta.url).href;
const meanCalculationStepsImage = new URL('./images/mean_calculation_steps.png', import.meta.url).href;
const modeRangeDiagramImage = new URL('./images/mode_range_diagram.png', import.meta.url).href;
const threeTransformationsGalleryImage = new URL('./images/three_transformations_gallery.png', import.meta.url).href;
const reflectionConstructionStepsImage = new URL('./images/reflection_construction_steps.png', import.meta.url).href;

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
    id: 'collecting-data',
    eyebrow: 'Chapter 5.1',
    title: 'Collecting Data',
    intro: 'Statistics is the science of collecting, organizing, and looking at information so we can answer real questions. Data is simply the word for information — numbers, words, or facts we gather. To answer a question like "What is the most popular drink in our school?" we cannot just guess — we must go and collect real data first, then organize it, then display it clearly, and finally interpret it to reach a conclusion. This whole process is called the Data Handling Cycle, and every statistics problem you will ever face follows these same four stages. There are three main ways to collect the data in stage one: Observation (watching and recording something yourself), Questionnaires (giving written questions to many people at once), and Interviews (talking to one person and asking questions directly, face to face).',
    introImage: {
      src: dataHandlingCycleImage,
      caption: 'The Data Handling Cycle: collect, sort, display, and interpret.'
    },
    method: [
      {
        title: 'Three Ways to Collect Data',
        steps: [
          'Observation: Watch what happens and write it down. Example: Count how many cars pass the school gate in 10 minutes. It is accurate because you see it yourself.',
          'Questionnaire: A list of questions given to many people. Example: Give a paper to every student asking: "Which house are you in: Red, Blue, Green, or Yellow?" It is fast and easy to get many answers.',
          'Interview: A conversation where you ask someone questions directly. Example: Ask the headmaster what his favorite subject was. You get detailed answers and can ask "Why?"'
        ]
      }
    ],
    examples: [
      {
        question: 'You want to find out the most common type of shoe worn by students. Which method would you use: Observation, Questionnaire, or Interview? Why?',
        steps: ['You could observe students in the hallway, but that might not include everyone.', 'A questionnaire could ask every student directly.', 'Interviews are too slow for many people.'],
        answer: 'Questionnaire, because it reaches many students quickly.'
      }
    ],
    practiceZone: [
      'Define the word "Data" in your own words.',
      'List one advantage of using an Interview to collect data.',
      'You want to know how many learners walk to school. Which method is best?'
    ]
  },
  {
    id: 'sorting-data',
    eyebrow: 'Chapter 5.2',
    title: 'Sorting Data (Tally Tables)',
    intro: 'When you collect data, you often have a messy list of answers. You need to organize it. The best tool is a Tally Table. The "Gate Method" (or bundle method) helps you count quickly: every time you count to 5, you draw a line across the four previous marks to make a "gate" (like this: ||||). This makes counting easy because you can count in groups of five. The total number for each item is called the Frequency.',
    introImage: {
      src: tallyTableSnacksExampleImage,
      caption: 'A tally table showing snacks chosen by 20 students. The tally marks are grouped in fives, and the frequency (total) is shown.'
    },
    method: [
      {
        title: 'How to Make a Tally Table',
        steps: [
          'Step 1: List all the possible items in the first column.',
          'Step 2: Go through your raw data one by one. For each answer, put a tally mark in the second column next to the correct item.',
          'Step 3: Use the gate method: |||| = five marks. After four marks, draw a diagonal line across them to make a group of five, because groups of five are much faster to count than counting single marks one by one.',
          'Step 4: Count the tally marks for each item and write the total in the Frequency column.',
          'Example: The canteen asked 20 students for their favorite snack. The tally table above shows that Mazoe got 10 votes, Biscuits 4, and Fruit 6.'
        ]
      },
      {
        title: 'How to Draw a Bar Graph from a Frequency Table',
        steps: [
          'A bar graph turns numbers into a picture, which makes it much faster to compare items at a glance than reading a table of numbers.',
          'Step 1: Draw a horizontal axis and a vertical axis. Label the horizontal axis with the item names, and the vertical axis with "Frequency", including even number gaps (0, 2, 4, 6...).',
          'Step 2: For each item, draw a bar. The height of the bar must exactly match its frequency.',
          'Step 3: Leave an equal, small gap between each bar — bars must never touch each other, and all bars should be the same width.',
          'Step 4: Give your graph a clear title so anyone reading it knows what it shows.'
        ],
        image: {
          src: barGraphConstructionStepsImage,
          caption: 'Step-by-step: building a bar graph from a frequency table.'
        }
      },
      {
        title: 'How to Read and Make a Pictogram',
        steps: [
          'A pictogram uses small pictures or icons instead of bars to show frequency. It is easy to read but needs a KEY to explain what each picture means.',
          'Step 1: Choose one simple icon to represent the data (e.g., one fruit icon).',
          'Step 2: Decide what one icon is worth — this is called the key. Example: 1 icon = 2 students.',
          'Step 3: Draw the correct number of icons for each row so the total matches the real frequency. If the key is "1 icon = 2 students" and 6 students chose mango, draw 3 icons.',
          'Step 4: Always check the key before reading any pictogram — never assume 1 icon always equals 1 unit.'
        ],
        image: {
          src: pictogramExampleImage,
          caption: 'A pictogram with a key showing 1 icon = 2 students.'
        }
      }
    ],
    examples: [
      {
        question: 'Look at these test marks for 15 students: 5, 7, 5, 8, 9, 5, 7, 10, 8, 5, 5, 7, 9, 10, 5. Create a tally table showing the frequency of each mark.',
        steps: ['List marks: 5, 7, 8, 9, 10.', 'Go through the list and tally each mark.', 'Count tally groups (five = gate) and write frequencies.'],
        answer: 'Mark 5: 6, Mark 7: 3, Mark 8: 2, Mark 9: 2, Mark 10: 2.'
      },
      {
        question: 'Using the snack frequency table (Mazoe = 10, Biscuits = 4, Fruit = 6), describe how you would draw the tallest bar.',
        steps: ['Compare all frequencies: 10, 4, 6.', 'The tallest bar belongs to the highest frequency, which is Mazoe with 10.', 'This bar should reach exactly the 10-mark on the vertical axis.'],
        answer: 'The Mazoe bar would be the tallest, reaching up to 10 on the frequency axis.'
      },
      {
        question: 'A pictogram key says "1 icon = 2 students". A row shows 4 icons. How many students does this represent?',
        steps: ['Each icon is worth 2 students.', 'Multiply the number of icons by the value of the key: 4 × 2 = 8.'],
        answer: '8 students'
      }
    ],
    practiceZone: [
      'Define "Frequency" in statistics.',
      'You stand at a corner and see: 5 white cars, 3 blue cars, 8 white cars, and 2 blue cars. Create a tally table for this data.',
      'Explain why the "Gate Method" is useful.',
      'Using your tally table of cars, draw a bar graph with correctly labeled axes.',
      'A pictogram key is "1 icon = 5 books". How many icons are needed to represent 25 books?'
    ]
  },
  {
    id: 'averages',
    eyebrow: 'Chapter 5.3',
    title: 'Averages: Mean, Mode, and Range',
    intro: 'Once data is collected and displayed, we often want ONE single number that describes the whole set — this is called an average. There are three important averages in Form 1: the Mean (what most people simply call "the average" — sharing everything out equally), the Mode (the value that appears the most often), and the Range (a measure of how spread out the data is, from lowest to highest). Each one tells us something different about the same set of data, so we often calculate all three.',
    method: [
      {
        title: 'How to Calculate the Mean',
        steps: [
          'Step 1: Add up all the numbers in the data set to get the total.',
          'Step 2: Count how many numbers there are in the data set.',
          'Step 3: Divide the total by the count. This is the mean, because it shows what each number would be if the total were shared out equally among all of them.',
          'Example: 5, 7, 8, 9, 6. Total = 5+7+8+9+6 = 35. Count = 5. Mean = 35 ÷ 5 = 7.'
        ],
        image: {
          src: meanCalculationStepsImage,
          caption: 'Step-by-step: calculating the mean of a data set.'
        }
      },
      {
        title: 'How to Find the Mode and the Range',
        steps: [
          'Mode: look through the data and find the value that appears most often. There can be more than one mode, or none at all if every value is different.',
          'Range: subtract the smallest value from the largest value. This tells us how spread out the data is — a bigger range means more variation, a smaller range means the data is more tightly grouped.',
          'Example (Mode): 3, 5, 5, 7, 5, 8. The number 5 appears three times, more than any other. Mode = 5.',
          'Example (Range): 4, 9, 2, 7, 6. Largest = 9, Smallest = 2. Range = 9 − 2 = 7.'
        ],
        image: {
          src: modeRangeDiagramImage,
          caption: 'Finding the mode and the range of a data set.'
        }
      }
    ],
    examples: [
      {
        question: 'Find the mean of these test scores: 6, 8, 10, 8, 8.',
        steps: ['Add them up: 6+8+10+8+8 = 40.', 'Count the values: 5.', 'Divide: 40 ÷ 5 = 8.'],
        answer: 'Mean = 8'
      },
      {
        question: 'Find the mode of these shoe sizes: 3, 4, 4, 5, 4, 6.',
        steps: ['Count how many times each number appears: 3 appears once, 4 appears three times, 5 appears once, 6 appears once.', '4 appears the most often.'],
        answer: 'Mode = 4'
      },
      {
        question: 'Find the range of these temperatures: 18°C, 25°C, 15°C, 30°C, 22°C.',
        steps: ['Find the largest value: 30°C.', 'Find the smallest value: 15°C.', 'Subtract: 30 − 15 = 15°C.'],
        answer: 'Range = 15°C'
      }
    ],
    practiceZone: [
      'Find the mean of: 10, 12, 14, 16, 18.',
      'Find the mode of: 2, 3, 3, 3, 5, 6, 6.',
      'Find the range of: 45, 12, 78, 33, 60.',
      'Explain in your own words the difference between the mean and the mode.',
      'A class has test scores of 5, 6, 7, 7, 7, 9, 10. Find the mean, mode, and range.'
    ]
  },
  {
    id: 'designing-questionnaire',
    eyebrow: 'Chapter 5.4',
    title: 'Designing a Good Questionnaire',
    intro: 'If you ask bad questions, you get bad data! A good questionnaire is clear and simple. Two golden rules: Be specific (ask exactly what you want to know) and Do not be "leading" (do not push people toward a certain answer).',
    method: [
      {
        title: 'Rules for Good Questions',
        steps: [
          'Rule 1: Be Specific. Bad: "Do you like sports?" Good: "Which sport do you play: Football, Netball, or Athletics?"',
          'Rule 2: Don\'t be Leading. Bad: "Don\'t you agree that Math is the best subject?" Good: "What is your favorite subject?"',
          'Always make sure the question can be answered honestly and easily.'
        ]
      }
    ],
    examples: [
      {
        question: 'Identify which question is good and which is bad: a) "Do you like the delicious food at the canteen?" b) "How many times a week do you eat at the canteen?"',
        steps: ['a) uses "delicious" which pushes a positive answer – leading.', 'b) asks for a number, specific – good.'],
        answer: 'a) is bad (leading), b) is good.'
      }
    ],
    practiceZone: [
      'Write a good question to find out how many students have a pet.',
      'Rewrite this bad question: "Don\'t you think homework is helpful?"',
      'Why is it important to be specific in a questionnaire?'
    ]
  },
  {
    id: 'translation',
    eyebrow: 'Chapter 5.5',
    title: 'Transformations: Translation, Reflection, and Rotation',
    intro: 'In Mathematics, a transformation is a way to move or change the position of a shape. There are three main transformations in Form 1, and it is important not to mix them up. Translation slides an object in a straight line without turning, flipping, or changing size — think of a bus moving along a straight road. Reflection flips a shape over a mirror line, so the image looks like a mirror image of the object — like looking at yourself in a mirror. Rotation turns a shape around a fixed centre point by a certain angle — like the hands of a clock turning around the centre. In all three, the shape itself never changes size — only its position (and sometimes its facing direction) changes.',
    introImage: {
      src: threeTransformationsGalleryImage,
      caption: 'The three transformations: translation, reflection, and rotation.'
    },
    method: [
      {
        title: 'The Three "No" Rules of Translation',
        steps: [
          'The shape does NOT turn (it stays upright – no rotation).',
          'The shape does NOT change size (it doesn\'t get bigger or smaller – no scaling).',
          'The shape does NOT flip over (no reflection).',
          'Translation is just a slide — every point of the shape moves the exact same distance in the exact same direction.'
        ]
      },
      {
        title: 'How to Reflect a Shape Across a Mirror Line',
        steps: [
          'Step 1: Draw the mirror line (this could be given to you, or it could be an axis on a grid).',
          'Step 2: For each corner of the shape, measure how far it is from the mirror line, moving at a right angle to that line.',
          'Step 3: Mark a new point the exact same distance away, but on the OPPOSITE side of the mirror line.',
          'Step 4: Join up all the new points to draw the reflected image. The image will always be the same distance from the mirror as the object, just on the other side — this is exactly what makes it look like a true mirror image.'
        ],
        image: {
          src: reflectionConstructionStepsImage,
          caption: 'Step-by-step: reflecting a shape across a mirror line.'
        }
      },
      {
        title: 'How to Rotate a Shape Around a Centre Point',
        steps: [
          'Step 1: Identify the centre of rotation — the fixed point that the shape turns around (it does not move).',
          'Step 2: Identify the angle of turn (for example, 90°) and the direction (clockwise or anticlockwise).',
          'Step 3: Turn every corner of the shape around the centre point by that same angle and direction — every point stays the same distance from the centre, it only changes position around it.',
          'Step 4: Join up the new points to draw the rotated image. Unlike translation, the shape changes direction (it looks turned), but unlike reflection, it is not mirrored — it is still facing "the same way round", just rotated.'
        ]
      }
    ],
    examples: [
      {
        question: 'True or False: In translation, a shape can get bigger.',
        steps: ['Translation means sliding without changing size.', 'So it cannot get bigger.'],
        answer: 'False.'
      },
      {
        question: 'A square moves from (2,2) to (6,2). Describe the translation.',
        steps: ['The x-coordinate increased from 2 to 6 (moved 4 right).', 'The y-coordinate stayed the same (no up/down).'],
        answer: '4 units Right and 0 units Up (or just 4 units Right).'
      },
      {
        question: 'Look at your reflection in a mirror. Why does your right hand appear to be on the left side of the mirror image?',
        steps: ['A mirror line flips everything to the opposite side, at the same distance.', 'This flipping reverses left and right, which is why a reflection always looks "backwards" compared to the real object.'],
        answer: 'Reflection flips the object, so left and right appear swapped in the image.'
      },
      {
        question: 'A shape is rotated 180° around a centre point. Will it look upside down, or just moved sideways?',
        steps: ['180° is a half turn.', 'A half turn flips the shape so it ends up facing completely the opposite way — this looks upside down compared to the original, but it has NOT been mirrored (no flip over a line), it has been turned.'],
        answer: 'It will look upside down/turned around, but it is a rotation, not a reflection.'
      }
    ],
    practiceZone: [
      'True or False: In translation, the shape stays the same way up.',
      'Describe a translation that moves a shape 3 units left and 2 units down.',
      'Give an example of a translation in everyday life.',
      'Give an example of a reflection in everyday life (hint: think about water or mirrors).',
      'Give an example of a rotation in everyday life (hint: think about clocks or wheels).',
      'Explain in your own words the difference between a reflection and a rotation.'
    ]
  },
  {
    id: 'translation-on-grid',
    eyebrow: 'Chapter 5.6',
    title: 'Translation on a Grid',
    intro: 'To describe a translation precisely, we use a grid. We say how far it moved left or right (horizontal) and how far it moved up or down (vertical). The original shape is called the Object, and the new shape is called the Image.',
    introImage: {
      src: translationGridExampleImage,
      caption: 'Triangle A (Object) is translated 3 units right and 2 units up to become Triangle B (Image).'
    },
    method: [
      {
        title: 'How to Describe a Translation',
        steps: [
          'Step 1: Pick one corner of the Object (e.g., the bottom-left corner).',
          'Step 2: Count how many squares it moved horizontally (left or right).',
          'Step 3: Count how many squares it moved vertically (up or down).',
          'Step 4: Write your description: "The object was translated X units Right/Left and Y units Up/Down."',
          'Example: Triangle A moved 3 units Right and 2 units Up to become Image B.'
        ]
      }
    ],
    examples: [
      {
        question: 'A square is at (2,2). It is moved to (6,2). Describe the translation.',
        steps: ['Horizontal: from 2 to 6 = 4 units right.', 'Vertical: from 2 to 2 = 0 units up/down.'],
        answer: '4 units Right and 0 units Up (or simply 4 units Right).'
      }
    ],
    practiceZone: [
      'On grid paper, draw a rectangle and translate it 4 squares Left and 1 square Down. Label the Image.',
      'Describe the translation that moves a shape from (1,3) to (4,5).',
      'If a shape is translated 2 units right and 3 units up, and its starting point is (2,1), where does it end up?'
    ]
  },
  {
    id: 'unhu-link',
    eyebrow: 'Chapter 5.7',
    title: 'Unhu/Ubuntu Link: Discipline and Accuracy',
    intro: 'Being a Data Detective requires Discipline. If you skip one person while tallying, your frequency will be wrong. In our culture, being accurate and honest with information shows respect for the community. When we translate shapes, we must be Accurate so that the shape remains exactly the same – this is like having a consistent character in life!',
    context: 'In Zimbabwe, we value honesty and hard work. When you collect data, make sure you count every person fairly. When you translate, make sure you count the squares carefully so the shape does not change.',
    examples: [
      {
        question: 'Why is it important to be accurate when tallying data?',
        steps: ['If you make a mistake, the frequency totals will be wrong.', 'The community might make wrong decisions based on your data.'],
        answer: 'Accuracy ensures the data is reliable and decisions are fair.'
      }
    ],
    practiceZone: [
      'Give one reason why honesty is important in statistics.',
      'How can being careful when translating shapes show respect for your work?'
    ]
  }
];

/* ---------- Components (same as Geometry) ---------- */
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
        <MathJax inline>{section.intro}</MathJax>
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
            <img
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
            <MathJax inline>{m.title}</MathJax>
          </h3>
          <ul className="space-y-2 text-slate-700 ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <MathJax inline>{step}</MathJax>
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

export const Statistics: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 5
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Statistics and Translation
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Learn how to collect, organize, and understand data, and how to slide shapes on a grid.
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

export default Statistics;
