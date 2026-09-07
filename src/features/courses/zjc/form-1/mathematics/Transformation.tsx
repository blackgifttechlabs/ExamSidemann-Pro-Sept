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

const translationObjectImageRulesImage = new URL('./images/translation_object_image_rules.png', import.meta.url).href;
const translationGridExampleImage = new URL('./images/translation_grid_example.png', import.meta.url).href;
const columnVectorNotationImage = new URL('./images/column_vector_notation.png', import.meta.url).href;
const translationCoordinatesStepsImage = new URL('./images/translation_coordinates_steps.png', import.meta.url).href;
const geoboardTranslationDemoImage = new URL('./images/geoboard_translation_demo.png', import.meta.url).href;
const combiningTranslationsStepsImage = new URL('./images/combining_translations_steps.png', import.meta.url).href;
const translationRealLifeExamplesImage = new URL('./images/translation_real_life_examples.png', import.meta.url).href;

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
    id: 'what-is-translation',
    eyebrow: 'Chapter 7.1',
    title: 'What is Translation?',
    intro: 'In Mathematics, the word Transformation means "change" — but it does not always mean the shape itself changes. Sometimes only its position changes. In Form 1, we focus on the simplest transformation, called Translation. Translation is just a mathematical word for a Slide. Imagine sliding a book across a flat desk: the book does not turn, and it does not get bigger or smaller — it simply moves from one spot to another, still facing the exact same way. Because every single point of the shape moves the exact same distance in the exact same direction, the shape that arrives is guaranteed to be identical to the shape that started — just in a new place. This gives us three rules that MUST always be true for a translation: Same Shape (a triangle stays a triangle), Same Size (it cannot grow or shrink), and Same Direction (it cannot turn or flip over).',
    introImage: {
      src: translationObjectImageRulesImage,
      caption: 'The three rules of translation: same shape, same size, same direction.'
    },
    method: [
      {
        title: 'The Rules of Translation',
        steps: [
          'Same Shape: The shape stays the same type – a triangle stays a triangle, a square stays a square.',
          'Same Size: The shape does not get bigger or smaller – the side lengths stay exactly the same, because every point moved the same distance, so nothing stretched or shrank.',
          'Same Direction: The shape does not rotate or flip – if the top of the triangle pointed up, it still points up after sliding, because sliding only changes position, never orientation.',
          'Important Terms: The Object is the original shape before it moves. The Image is the shape in its new position after it has moved. We label matching corners using the "prime" symbol (\') – so corner A on the Object becomes corner A\' on the Image (read as "A prime"), and it is always the exact same distance and direction from A as every other point moved.'
        ]
      }
    ],
    examples: [
      {
        question: 'What is another word for translation?',
        steps: ['Translation means sliding.', 'So another word is "Slide".'],
        answer: 'Slide'
      },
      {
        question: 'What do we call the shape after it has moved?',
        steps: ['The original is called the Object.', 'The new position is called the Image.'],
        answer: 'The Image'
      },
      {
        question: 'Does a shape change size during translation?',
        steps: ['Translation only moves the shape.', 'The size stays exactly the same.'],
        answer: 'No, the size stays the same.'
      }
    ],
    practiceZone: [
      'True or False: In translation, a shape can turn.',
      'What is the difference between an Object and an Image?',
      'If the letter A on a shape becomes A\', what does the \' symbol mean?'
    ]
  },
  {
    id: 'translation-on-grid',
    eyebrow: 'Chapter 7.2',
    title: 'Translation on a Grid',
    intro: 'To be a master of translation, we use a grid (graph paper), because it lets us measure exactly how far a shape moved, using numbers instead of vague words like "a bit right". A translation always has two parts: the Horizontal Movement (how many units left or right) and the Vertical Movement (how many units up or down). Mathematicians have a short, exact way of writing both movements together at once — a Column Vector. It looks like a fraction but is NOT one: the top number is always the horizontal movement (positive means right, negative means left), and the bottom number is always the vertical movement (positive means up, negative means down).',
    introImage: {
      src: translationGridExampleImage,
      caption: 'Triangle A (Object) is translated 4 units right and 3 units up to become Triangle A\' (Image).'
    },
    diagrams: [
      {
        title: 'Reading a Column Vector',
        content: 'The top number is always horizontal movement; the bottom number is always vertical movement.',
        image: columnVectorNotationImage
      }
    ],
    method: [
      {
        title: 'How to Describe a Translation in Words',
        steps: [
          'Step 1: Pick one corner of the Object (e.g., the bottom-left corner).',
          'Step 2: Count how many squares it moved horizontally (left or right).',
          'Step 3: Count how many squares it moved vertically (up or down).',
          'Step 4: Write your description: "The Object was translated X units Right/Left and Y units Up/Down."',
          'Example: From the diagram above, the triangle moved 4 units to the Right and 3 units Up.'
        ]
      },
      {
        title: 'How to Write a Translation as a Column Vector',
        steps: [
          'Step 1: Find the horizontal movement. Write it as a positive number if the shape moved right, or a negative number if it moved left.',
          'Step 2: Find the vertical movement. Write it as a positive number if the shape moved up, or a negative number if it moved down.',
          'Step 3: Write the horizontal number on top and the vertical number on the bottom, inside brackets.',
          'Example: "4 units right and 3 units up" becomes the column vector (4 on top, 3 on bottom).',
          'Example: "2 units left and 5 units down" becomes the column vector (-2 on top, -5 on bottom), because moving left or down always uses negative numbers.'
        ]
      },
      {
        title: 'How to Translate a Point Using Coordinates',
        steps: [
          'Step 1: Write down the starting coordinates of the point, in the form (x, y).',
          'Step 2: Add the top number of the vector to the x-coordinate.',
          'Step 3: Add the bottom number of the vector to the y-coordinate. (Remember: adding a negative number means subtracting.)',
          'Step 4: Write the new coordinates — this is exactly where the translated point lands.',
          'Example: Point (2, 3) translated by the vector (5 on top, -2 on bottom): new x = 2 + 5 = 7, new y = 3 + (-2) = 1. New point = (7, 1).'
        ],
        image: {
          src: translationCoordinatesStepsImage,
          caption: 'Step-by-step: translating a point using coordinates and a vector.'
        }
      }
    ],
    examples: [
      {
        question: 'A point sits at coordinates (2,3). It is translated 5 units to the right and 2 units up. What are the new coordinates?',
        steps: ['Add 5 to the x-number: 2 + 5 = 7.', 'Add 2 to the y-number: 3 + 2 = 5.'],
        answer: '(7,5)'
      },
      {
        question: 'Write "3 units left and 4 units down" as a column vector.',
        steps: ['Moving left means the horizontal number is negative: -3.', 'Moving down means the vertical number is negative: -4.', 'Write horizontal on top, vertical on bottom.'],
        answer: 'Column vector: -3 on top, -4 on bottom.'
      },
      {
        question: 'A point at (6, -2) is translated by the vector (-4 on top, 3 on bottom). Find the new coordinates.',
        steps: ['Add the top number to x: 6 + (-4) = 2.', 'Add the bottom number to y: -2 + 3 = 1.'],
        answer: '(2, 1)'
      }
    ],
    practiceZone: [
      'A point at (1,4) is translated 3 units right and 1 unit down. What are the new coordinates?',
      'Describe the translation that moves a shape from (2,2) to (6,5).',
      'If a shape is translated 2 units left and 4 units up, and it started at (3,1), where does it end?',
      'Write "5 units right and 2 units down" as a column vector.',
      'A point at (0, 0) is translated by the vector (-3 on top, -6 on bottom). Find the new coordinates.',
      'Explain in your own words why a negative top number in a vector means moving left.'
    ]
  },
  {
    id: 'using-geoboard',
    eyebrow: 'Chapter 7.3',
    title: 'Using a Geo-board',
    intro: 'The Geo-board is a physical tool used in many Zimbabwean classrooms to understand shapes. It is a wooden board with pegs (nails) arranged in a grid. To show translation on a Geo-board: stretch a rubber band around three pegs to make a triangle – this is your Object. Now, move the rubber band so that every corner moves 2 pegs to the left. Because every corner moved the same distance in the same direction, you have performed a Translation — this is the same reason a paper translation works, just using pegs instead of grid squares.',
    introImage: {
      src: geoboardTranslationDemoImage,
      caption: 'Showing a translation on a geo-board using rubber bands.'
    },
    method: [
      {
        title: 'How to Show Translation on a Geo-board',
        steps: [
          'Step 1: Place a rubber band around pegs to form your shape (the Object).',
          'Step 2: Decide on your translation – e.g., "2 pegs left and 3 pegs up".',
          'Step 3: Move each corner (vertex) of the shape the same number of pegs in the same direction.',
          'Step 4: Place the rubber band in the new position – this is your Image.'
        ]
      }
    ],
    examples: [
      {
        question: 'If you move one corner of a triangle 4 pegs to the right, but you move the other two corners only 2 pegs to the right, is it still a translation? Explain why.',
        steps: ['Translation requires every corner to move the same distance and direction.', 'Here, the corners moved different distances.', 'So it is not a translation.'],
        answer: 'No, because all corners must move the same distance and direction.'
      }
    ],
    practiceZone: [
      'Explain how you would use a Geo-board to show a translation of 3 pegs right.',
      'What would happen if you moved one corner of a shape differently from the others?',
      'Why is a Geo-board helpful for learning about translation?'
    ]
  },
  {
    id: 'step-by-step-translation',
    eyebrow: 'Chapter 7.4',
    title: 'Step-by-Step: How to Translate a Shape',
    intro: 'If you are asked to "Translate the rectangle 3 units left and 2 units down," follow these steps carefully. Always use a sharp pencil and a ruler so your drawing is neat and accurate. Accuracy is key in Mathematics – just like in building or cooking, small mistakes can change the whole result.',
    method: [
      {
        title: 'Step-by-Step Guide to Translating a Shape',
        steps: [
          'Step 1: Pick one corner (vertex) of the shape to start with.',
          'Step 2: Count the horizontal movement on your grid. For "3 units left", count 3 squares to the left.',
          'Step 3: From that new spot, count the vertical movement. For "2 units down", count 2 squares down. Mark this new point with a dot.',
          'Step 4: Repeat Steps 1-3 for every other corner of the shape.',
          'Step 5: Connect the new dots using a ruler. You have drawn the Image!',
          'Example: Translating a rectangle 3 left and 2 down – each corner moves the same way, and the new shape is exactly the same size.'
        ]
      }
    ],
    examples: [
      {
        question: 'Draw a square with sides of 2cm on graph paper. Label it Object S. Translate the square 3 units right and 4 units down. Draw the new image and label it Image S\'.',
        steps: ['Draw the original square.', 'Move each corner 3 right and 4 down.', 'Connect the new corners.'],
        answer: 'The new square is 3 units right and 4 units down from the original.'
      }
    ],
    practiceZone: [
      'Draw a rectangle on grid paper and translate it 2 units left and 3 units up.',
      'A triangle has corners at (1,1), (3,1), (2,4). Translate it 2 units right and 1 unit down. What are the new coordinates?',
      'Why is it important to use a ruler when drawing translations?'
    ]
  },
  {
    id: 'combining-translations',
    eyebrow: 'Chapter 7.5',
    title: 'Combining Two Translations',
    intro: 'Sometimes a shape is translated twice, one after another — first by one vector, then by a second vector. You could draw each step separately, but there is a faster way: you can combine (add) the two vectors together to find the single overall translation that gets you from the very first position straight to the very last position, skipping the middle step.',
    method: [
      {
        title: 'How to Combine Two Translations',
        steps: [
          'Step 1: Write down both column vectors.',
          'Step 2: Add the two top numbers together to get the new top number.',
          'Step 3: Add the two bottom numbers together to get the new bottom number.',
          'Step 4: This new combined vector describes the total movement — using it once gives exactly the same final position as using both original vectors one after another.',
          'Example: First vector (2 on top, 3 on bottom), then second vector (1 on top, -4 on bottom). Combined: top = 2 + 1 = 3, bottom = 3 + (-4) = -1. Combined vector = (3 on top, -1 on bottom).'
        ],
        image: {
          src: combiningTranslationsStepsImage,
          caption: 'Step-by-step: combining two translations into one overall vector.'
        }
      }
    ],
    examples: [
      {
        question: 'A shape is translated by (4 on top, 2 on bottom), then by (-1 on top, 3 on bottom). Find the single combined vector.',
        steps: ['Add the top numbers: 4 + (-1) = 3.', 'Add the bottom numbers: 2 + 3 = 5.'],
        answer: 'Combined vector: 3 on top, 5 on bottom.'
      },
      {
        question: 'A point starts at (0, 0). It is translated by (5 on top, 0 on bottom), then by (0 on top, -5 on bottom). Where does it end up, and what is the combined vector?',
        steps: ['Combined vector: top = 5 + 0 = 5, bottom = 0 + (-5) = -5.', 'New point: (0 + 5, 0 + (-5)) = (5, -5).'],
        answer: 'Combined vector: 5 on top, -5 on bottom. Final point: (5, -5).'
      }
    ],
    practiceZone: [
      'Combine the vectors (2 on top, 6 on bottom) and (3 on top, -2 on bottom) into one vector.',
      'A shape is translated by (-3 on top, 4 on bottom) and then (3 on top, -4 on bottom). What is the combined vector? What does this tell you about where the shape ends up?',
      'A point at (2, 2) is moved by two translations that combine to give the vector (0 on top, 0 on bottom). Where does the point end up? Explain why.'
    ]
  },
  {
    id: 'real-life-examples',
    eyebrow: 'Chapter 7.6',
    title: 'Real-Life Examples of Translation',
    intro: 'Translation is not just a Mathematics topic – it is all around us! A sliding door moves horizontally (left or right) – that is a translation. A lift (elevator) moves vertically (up or down) – that is a translation too. When soldiers march forward together in a parade, they are all being translated in the same direction and distance, because every soldier moves the same number of steps in the same direction — exactly matching the rule for translation. Once you start looking, you will see translations everywhere!',
    introImage: {
      src: translationRealLifeExamplesImage,
      caption: 'Everyday examples of translation: sliding doors, lifts, and marching queues.'
    },
    context: 'In Zimbabwe, you can see translation in many places: sliding doors at shops, lifts in tall buildings in Harare, and even the way people move in a queue – everyone moves forward together, just like a translation!',
    examples: [
      {
        question: 'A book is turned upside down on a table. Is this a translation? Why or why not?',
        steps: ['Translation means sliding without turning.', 'Turning a book upside down means it rotated (turned).', 'So it is not a translation.'],
        answer: 'No, because the book turned (rotated) – translation does not allow turning.'
      },
      {
        question: 'A car drives 10 km straight down a road. Is this a translation?',
        steps: ['Translation means sliding in a straight line.', 'The car moves in a straight line without turning.', 'So it is a translation.'],
        answer: 'Yes, it is a translation.'
      }
    ],
    practiceZone: [
      'Give an example of a translation you see in your daily life.',
      'Is a balloon being blown up until it is double its size a translation? Explain.',
      'When you walk straight forward from the door to your desk, is that a translation? Why?'
    ]
  },
  {
    id: 'unhu-link-translation',
    eyebrow: 'Chapter 7.7',
    title: 'Unhu/Ubuntu Link: Consistency',
    intro: 'In our culture, Unhu/Ubuntu teaches us about having a "consistent character." In Mathematics, a translated shape is consistent – it stays true to its original form no matter where it moves. As you grow and move to different places – perhaps from your village to a city, or from primary school to secondary school – your good values (honesty, respect, and hard work) should stay the same. Just like a translated shape, you move to a new position, but you remain the same person of good character!',
    context: 'The builders of Great Zimbabwe showed consistency in their work – each stone was carefully placed to create strong, lasting walls. In the same way, when we translate shapes, we must be consistent and accurate, moving every point the same distance and direction.',
    examples: [
      {
        question: 'How is a translated shape like a person with good character?',
        steps: ['A translated shape stays the same no matter where it moves.', 'A person with good character stays honest and respectful no matter where they go.'],
        answer: 'Both stay true to their original form – the shape stays the same, and a good person keeps their values.'
      }
    ],
    practiceZone: [
      'Why is consistency important in both Mathematics and daily life?',
      'What values should a person keep no matter where they move?',
      'How does accuracy in translation show respect for your work?'
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

export const Transformation: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 7
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Transformation (Translation)
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Learn how to slide shapes on a grid – a translation moves a shape without turning, flipping, or changing size.
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

export default Transformation;
