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

const everydaySetsImage = new URL('./images/everyday-sets.png', import.meta.url).href;
const howToWriteSetImage = new URL('./images/how-to-write-a-set.png', import.meta.url).href;
const setAnatomyImage = new URL('./images/set-anatomy.png', import.meta.url).href;
const setRightVsWrongImage = new URL('./images/set-right-vs-wrong.png', import.meta.url).href;
const setFruitDiagramImage = new URL('./images/set1.png', import.meta.url).href;
const membershipIntroImage = new URL('./images/membership-intro.png', import.meta.url).href;
const membershipSymbolsImage = new URL('./images/membership-symbols.png', import.meta.url).href;
const membershipStepsImage = new URL('./images/membership-steps.png', import.meta.url).href;
const typesOverviewImage = new URL('./images/types-overview.png', import.meta.url).href;
const finiteSetImage = new URL('./images/finite-set.png', import.meta.url).href;
const infiniteSetImage = new URL('./images/infinite-set.png', import.meta.url).href;
const emptySetImage = new URL('./images/empty-set.png', import.meta.url).href;
const universalSetImage = new URL('./images/universal-set.png', import.meta.url).href;
const equalSetsImage = new URL('./images/equal-sets.png', import.meta.url).href;
const subsetIntroImage = new URL('./images/subset-intro.jpg', import.meta.url).href;
const subsetSymbolImage = new URL('./images/subset-symbol.png', import.meta.url).href;
const subsetTestImage = new URL('./images/subset-test.png', import.meta.url).href;
const subsetVennImage = new URL('./images/subset-venn.png', import.meta.url).href;
const operationsIntroImage = new URL('./images/operations-intro.jpg', import.meta.url).href;
const intersectionImage = new URL('./images/intersection.png', import.meta.url).href;
const unionImage = new URL('./images/union.png', import.meta.url).href;
const vennIntroImage = new URL('./images/venn-intro.jpg', import.meta.url).href;
const vennDrawImage = new URL('./images/venn-draw-steps.png', import.meta.url).href;
const vennShadingImage = new URL('./images/venn-shading.png', import.meta.url).href;

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

/* ----------------------------- CONTENT ----------------------------- */

const sections: TopicSection[] = [
  {
    id: 'what-is-a-set',
    eyebrow: 'Chapter 2.1',
    title: 'What is a Set?',
    intro: 'Look around you. A family is a group of people who live together. The fruits in a basket, the days of the week, even the letters in your name — these are all groups of things that belong together. In Mathematics, we give this kind of group a special name: a Set. A Set is simply a collection of things that belong together. Each thing inside the set is called a member, or an element.',
    introImage: {
      src: everydaySetsImage,
      caption: 'Sets are all around you: a family, the days of the week, a fruit basket, and the letters in a name are all examples of sets.'
    },
    method: [
      {
        title: 'How to Write a Set on Paper',
        steps: [
          'Step 1: Give your set a short name. We use one capital letter, like A, B, or S.',
          'Step 2: Draw curly brackets like this: { }',
          'Step 3: Write the members inside the brackets, and put a comma between each one.',
          'Example: If your set is called F and has a Mango and an Apple, you write $F = \\{ \\text{Mango, Apple} \\}$',
          'That is it! You have just written your first set.'
        ],
        image: {
          src: howToWriteSetImage,
          caption: 'Follow the three steps in order: name it, bracket it, then fill it with members separated by commas.'
        }
      },
      {
        title: 'Naming the Parts of a Set',
        steps: [
          'Look at $F = \\{ \\text{Mango, Apple} \\}$ — every part of it has a name.',
          '"F" is the name of the set.',
          '"=" means "is equal to" or "contains".',
          '"{ }" are the curly brackets that hold everything.',
          '"Mango" and "Apple" are members, and the comma separates them.'
        ],
        image: {
          src: setAnatomyImage,
          caption: 'Each part of the notation has its own name — the set name, the brackets, the members, and the commas.'
        }
      },
      {
        title: 'Three Simple Rules to Remember',
        steps: [
          'Rule 1: Write each member only ONE time. Do not repeat a member in the same set.',
          'Rule 2: The order does not matter. $\\{ \\text{Pen, Pencil} \\}$ is the same set as $\\{ \\text{Pencil, Pen} \\}$.',
          'Rule 3: Always use curly brackets { }, never round ( ) or square [ ] brackets.'
        ],
        image: {
          src: setRightVsWrongImage,
          caption: 'Compare the two: writing a member twice is wrong, writing it once is correct.'
        }
      }
    ],
    diagrams: [
      {
        title: 'Visualizing a Set',
        image: setFruitDiagramImage,
        content: 'Set $A = \\{ \\text{apple, banana, orange} \\}$ is shown as one circle containing three members.'
      }
    ],
    examples: [
      {
        question: 'How would you write the "School Set" (S) containing a Pen, Pencil, and Eraser?',
        steps: ['Identify the items: Pen, Pencil, Eraser.', 'Place them inside curly brackets.', 'Assign the capital letter S.'],
        answer: '$S = \\{ \\text{Pen, Pencil, Eraser} \\}$'
      },
      {
        question: 'Write a set (N) of the first five counting numbers.',
        steps: ['List the numbers: 1, 2, 3, 4, 5.', 'Separate with commas and add brackets.'],
        answer: '$N = \\{ 1, 2, 3, 4, 5 \\}$'
      },
      {
        question: 'Write a set (A) of animals you can find on a farm: a cow, a goat, and a chicken.',
        steps: ['Identify the items: cow, goat, chicken.', 'Write them inside curly brackets separated by commas.', 'Give the set the name A.'],
        answer: '$A = \\{ \\text{cow, goat, chicken} \\}$'
      },
      {
        question: 'Is $\\{ \\text{apple, apple, banana} \\}$ written correctly? Why or why not?',
        steps: ['Look at the members: apple appears two times.', 'Remember Rule 1: never repeat a member.', 'Remove the extra apple.'],
        answer: 'No, it is not correct. The right way is $\\{ \\text{apple, banana} \\}$.'
      }
    ],
    practiceZone: [
      'Write a set (C) containing three colors of the Zimbabwean flag.',
      'List the members of the set $V = \\{ \\text{a, e, i, o, u} \\}$.',
      'Give a name and write a set for the subjects you study at school.',
      'Write a set (D) of three animals you would find in a home.',
      'True or False: $\\{ \\text{1, 2, 3} \\}$ and $\\{ \\text{3, 2, 1} \\}$ are the same set. Explain your answer.'
    ]
  },
  {
    id: 'membership',
    eyebrow: 'Chapter 2.2',
    title: 'Set Membership',
    intro: 'Think about your classroom. If your name is on the class register, you belong to the class. If your name is not there, you do not belong. Sets work the same way. Something is either inside a set, or it is outside a set. In Mathematics, we do not always want to write "is inside" or "is not inside" in full words, so we use two short symbols instead.',
    introImage: {
      src: membershipIntroImage,
      caption: 'Just like a name on a class register, a member either belongs inside the set, or it does not.'
    },
    method: [
      {
        title: 'The Two Symbols',
        steps: [
          '$\\in$ means "is a member of". It tells us something IS inside the set.',
          '$\\notin$ means "is NOT a member of". It tells us something is NOT inside the set.',
          'A simple way to remember: the symbol $\\in$ looks like it is "entering" the set.',
          'The symbol $\\notin$ has a small line through it, like a "no entry" sign — it is being kept out.'
        ],
        image: {
          src: membershipSymbolsImage,
          caption: 'The symbol ∈ means "in", and ∉ means "not in" — the small slash is like a "no entry" sign.'
        }
      },
      {
        title: 'How to Use Them: Step by Step',
        steps: [
          'Step 1: Look at the set and see exactly which members are written inside it.',
          'Step 2: Take the item you are checking, and ask: "Is this item written inside the set?"',
          'Step 3: If YES, write the item, then $\\in$, then the set name.',
          'Step 4: If NO, write the item, then $\\notin$, then the set name.',
          'Example: For $F = \\{ \\text{Mango, Apple} \\}$, Mango is inside, so we write $\\text{Mango} \\in F$. Carrot is not inside, so we write $\\text{Carrot} \\notin F$.'
        ],
        image: {
          src: membershipStepsImage,
          caption: 'Check the set first, then decide: does the item belong inside, or does it stay outside?'
        }
      }
    ],
    examples: [
      {
        question: 'If $F = \\{ \\text{Mango, Apple} \\}$, use symbols to describe Mango and Carrot.',
        steps: ['Mango is inside the brackets, so use $\\in$.', 'Carrot is not in the list, so use $\\notin$.'],
        answer: '$\\text{Mango} \\in F$ and $\\text{Carrot} \\notin F$'
      },
      {
        question: 'If $A = \\{ 2, 4, 6, 8 \\}$, is $4 \\in A$ or $4 \\notin A$?',
        steps: ['Look inside set A: 2, 4, 6, 8.', 'Check if 4 is written there: Yes, it is.', 'Since it is inside, we use $\\in$.'],
        answer: '$4 \\in A$'
      },
      {
        question: 'If $D = \\{ \\text{Dog, Cat, Goat} \\}$, is Chicken a member of D?',
        steps: ['Look at the members of D: Dog, Cat, Goat.', 'Chicken is not one of them.', 'Since it is outside, we use $\\notin$.'],
        answer: '$\\text{Chicken} \\notin D$'
      }
    ],
    practiceZone: [
      'Fill in the gap: Zimbabwe ___ {African Countries}',
      'Fill in the gap: Bread ____ {Tools in a Toolbox}',
      'Fill in the gap: 2 ____ {Odd Numbers}',
      'If $A = \\{ 2, 4, 6 \\}$, is $5 \\in A$? Explain.',
      'If $L = \\{ \\text{a, b, c, d} \\}$, write TRUE symbol statements for the letter "c" and the letter "z".'
    ]
  },
  {
    id: 'types-of-sets',
    eyebrow: 'Chapter 2.3',
    title: 'Types of Sets',
    intro: 'Not all sets are the same. Some sets you can count and finish counting, like the students in your classroom. Some sets never end, like all the counting numbers. Some sets have nothing at all inside them. Knowing the different types of sets helps you describe any group of things correctly.',
    introImage: {
      src: typesOverviewImage,
      caption: 'Five different kinds of sets: some you can count and finish, some go on forever, and some have nothing inside.'
    },
    method: [
      {
        title: 'Type 1: Finite Set',
        steps: [
          'A Finite Set is a set where you CAN finish counting all the members.',
          'Example: the students sitting in your classroom right now. You can count them and get a final number.',
          'Example: the days of the week — there are exactly 7, no more, no less.'
        ],
        image: {
          src: finiteSetImage,
          caption: 'A finite set has a last member — you can count to the end and stop.'
        }
      },
      {
        title: 'Type 2: Infinite Set',
        steps: [
          'An Infinite Set is a set that NEVER ends. You can never finish counting it.',
          'Example: all the counting numbers, $\\{1, 2, 3, 4, \\dots \\}$.',
          'The three dots $(\\dots)$ at the end mean "and this carries on forever".'
        ],
        image: {
          src: infiniteSetImage,
          caption: 'The three dots mean the set keeps going forever and never reaches a last member.'
        }
      },
      {
        title: 'Type 3: Empty (Null) Set',
        steps: [
          'An Empty Set has NOTHING inside it at all.',
          'We write it using the symbol $\\varnothing$, or with empty brackets $\\{ \\}$.',
          'Example: "The set of elephants that can fly" — since no elephant can fly, this set has zero members.'
        ],
        image: {
          src: emptySetImage,
          caption: 'An empty set is like an empty box — the brackets are there, but nothing is inside.'
        }
      },
      {
        title: 'Type 4: Universal Set',
        steps: [
          'The Universal Set is the big set that contains EVERYTHING we are talking about in a problem.',
          'We use the symbol $\\xi$ for the Universal Set.',
          'Example: if we are talking about numbers 1 to 10, then $\\xi = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\}$, and every other set in that problem must fit inside it.'
        ],
        image: {
          src: universalSetImage,
          caption: 'The Universal Set is the big outer group that holds every other set inside a problem.'
        }
      },
      {
        title: 'Type 5: Equal Sets',
        steps: [
          'Two sets are Equal Sets if they have EXACTLY the same members.',
          'The order you write the members in does not matter.',
          'Example: $\\{A, B\\}$ and $\\{B, A\\}$ are equal sets, because both contain exactly A and B.'
        ],
        image: {
          src: equalSetsImage,
          caption: 'Two sets are equal when they hold the exact same members, no matter what order they are written in.'
        }
      }
    ],
    examples: [
      {
        question: 'What type of set is "The set of cows that can fly"?',
        steps: ['Since no cows can fly, the set has no members.', 'A set with no members is an empty set.'],
        answer: 'Empty Set ($\\varnothing$)'
      },
      {
        question: 'What type of set is "The set of all whole numbers greater than 5"?',
        steps: ['Start counting: 6, 7, 8, 9, 10...', 'This list never stops — it keeps going forever.', 'A set that never ends is infinite.'],
        answer: 'Infinite Set'
      },
      {
        question: 'What type of set is "The set of provinces in Zimbabwe"?',
        steps: ['Zimbabwe has a fixed, countable number of provinces.', 'You can count them all and reach a final total.', 'A set you can finish counting is finite.'],
        answer: 'Finite Set'
      },
      {
        question: 'Are $\\{ \\text{red, blue, green} \\}$ and $\\{ \\text{green, red, blue} \\}$ equal sets?',
        steps: ['List the members of the first set: red, blue, green.', 'List the members of the second set: green, red, blue.', 'Both sets contain exactly the same three members, just in a different order.'],
        answer: 'Yes, they are equal sets.'
      }
    ],
    practiceZone: [
      'Is the set of stars in the sky Finite or Infinite?',
      'Write the symbol for a Universal Set.',
      'Are $\\{1, 2, 3\\}$ and $\\{3, 1, 2\\}$ equal sets?',
      'Give an example of a Finite set from your daily life.',
      'Write the symbol for an Empty Set in two different ways.',
      'If $\\xi = \\{1, 2, 3, 4, 5\\}$, name one set that could fit inside this Universal Set.'
    ]
  },
  {
    id: 'subsets',
    eyebrow: 'Chapter 2.4',
    title: 'Subsets',
    intro: 'Think about your school. Your classroom is a small group of people. Your whole school is a much bigger group of people. Every single person in your classroom is also a person in your school — there is no one in your class who is not part of the school. Because of this, we say your classroom is a "subset" of your school. A Subset is simply a small set where EVERY member also belongs to a bigger set. Nothing in the small set is allowed to be missing from the big set.',
    introImage: {
      src: subsetIntroImage,
      caption: 'Your classroom is a small group inside the bigger group of the whole school. This is exactly what a subset is.'
    },
    method: [
      {
        title: 'The Subset Symbol',
        steps: [
          'The symbol for subset is $\\subset$.',
          'We write $B \\subset A$ and we read it out loud as "B is a subset of A".',
          'This tells us that every member found in Set B is also found in Set A.',
          'The small set (B) always fits fully inside the big set (A). Nothing from B is left out.'
        ],
        image: {
          src: subsetSymbolImage,
          caption: 'B is the small set, A is the big set. Every member of B fits inside A — that is what B ⊂ A means.'
        }
      },
      {
        title: 'Step by Step: How to Check for a Subset',
        steps: [
          'Step 1: Write down the bigger set first, then the smaller set next to it.',
          'Step 2: Take the FIRST member of the small set. Look inside the big set — is it there?',
          'Step 3: If it is there, put a small tick next to it, then check the next member.',
          'Step 4: Keep checking every single member of the small set, one at a time.',
          'Step 5: If ALL the members get a tick, then the small set IS a subset of the big set.',
          'Step 6: If even ONE member does not get a tick, the small set is NOT a subset.'
        ],
        image: {
          src: subsetTestImage,
          caption: 'Check every member one at a time. Only when all of them are found inside the big set can you say it is a subset.'
        }
      }
    ],
    context: 'Zimbabwean Example: Let set $A = \\{ \\text{Harare, Bulawayo, Midlands, Masvingo} \\}$ be a set of Zimbabwean provinces. Let set $B = \\{ \\text{Harare, Masvingo} \\}$. We check Harare: it is in A. We check Masvingo: it is also in A. Both members of B are found inside A, so we can say $B \\subset A$.',
    diagrams: [
      {
        title: 'Picturing a Subset',
        image: subsetVennImage,
        content: 'The big circle stands for Set A. The smaller circle sits completely inside it and stands for Set B. Everything inside the small circle is also inside the big circle. This picture shows $B \\subset A$.'
      }
    ],
    examples: [
      {
        question: 'If $P = \\{1, 2, 3, 4, 5\\}$ and $Q = \\{2, 3\\}$, is $Q \\subset P$?',
        steps: ['Check if 2 is in P: Yes.', 'Check if 3 is in P: Yes.', 'Every member of Q is in P.'],
        answer: 'Yes, $Q \\subset P$.'
      },
      {
        question: 'If $A = \\{ \\text{red, blue, green} \\}$ and $B = \\{ \\text{red, yellow} \\}$, is $B \\subset A$?',
        steps: ['Check red: red is in A.', 'Check yellow: yellow is not in A.', 'Because one member of B is missing from A, B is not a subset of A.'],
        answer: 'No, $B \\not\\subset A$.'
      }
    ],
    practiceZone: [
      'If $X = \\{ \\text{Dogs, Cats, Cows} \\}$ and $Y = \\{ \\text{Dogs} \\}$, is $Y$ a subset of $X$?',
      'Draw a circle diagram showing $S \\subset T$.',
      'True or False: $\\{1, 5\\} \\subset \\{1, 2, 3, 4\\}$.',
      'If $M = \\{2, 4, 6, 8\\}$ and $N = \\{4, 8\\}$, write a true subset statement.',
      'Give one example of a subset from your classroom.'
    ]
  },
  {
    id: 'operations',
    eyebrow: 'Chapter 2.5',
    title: 'Intersection and Union',
    intro: 'Sometimes two sets share some of the same members. Sometimes we want to join two sets into one big set. To do this clearly, Mathematics gives us two special tools: Intersection and Union. Intersection helps us find only what is SHARED by both sets. Union helps us JOIN both sets together into one, without writing any member down twice.',
    introImage: {
      src: operationsIntroImage,
      caption: 'Two overlapping fruit baskets show the idea clearly: the shared fruit in the middle, and all the fruit together.'
    },
    method: [
      {
        title: 'A. Intersection ($\\cap$)',
        steps: [
          'Intersection means: find only the members that are in BOTH sets at the same time.',
          'We write $A \\cap B$ and read it as "A intersection B".',
          'Step 1: Look at every member of Set A, one at a time.',
          'Step 2: Check if that same member is also written in Set B.',
          'Step 3: If it is in both sets, write it down as part of the answer.',
          'Step 4: If a member is only in one of the two sets, leave it out.',
          'If nothing at all is shared, the intersection is empty: $A \\cap B = \\varnothing$.'
        ],
        image: {
          src: intersectionImage,
          caption: 'Only the middle part, where the two circles overlap, belongs to A ∩ B.'
        }
      },
      {
        title: 'B. Union ($\\cup$)',
        steps: [
          'Union means: put together EVERY member from both sets into one big set.',
          'We write $A \\cup B$ and read it as "A union B".',
          'Step 1: Write down every member of Set A first.',
          'Step 2: Now add every member of Set B.',
          'Step 3: If a member already appears (because it was in both sets), do NOT write it a second time — remember Rule 1 from Chapter 2.1: never repeat a member.',
          'The union set is usually bigger than either set on its own, because it holds everything.'
        ],
        image: {
          src: unionImage,
          caption: 'The union joins the whole of both circles together, without writing a shared member twice.'
        }
      }
    ],
    context: 'Zimbabwean Example: Let $A = \\{ \\text{Maths, Science, Shona} \\}$ be Tapiwa\'s favourite subjects, and $B = \\{ \\text{Science, English, Shona} \\}$ be Rudo\'s favourite subjects. The subjects they both enjoy are $A \\cap B = \\{ \\text{Science, Shona} \\}$. All the subjects either of them enjoys, without repeating any, is $A \\cup B = \\{ \\text{Maths, Science, Shona, English} \\}$.',
    examples: [
      {
        question: 'If $A = \\{1, 2, 3\\}$ and $B = \\{3, 4, 5\\}$, find $A \\cap B$ and $A \\cup B$.',
        steps: [
          'Intersection: Only "3" is in both.',
          'Union: Combine all: 1, 2, 3, 4, 5.'
        ],
        answer: '$A \\cap B = \\{3\\}$ and $A \\cup B = \\{1, 2, 3, 4, 5\\}$'
      },
      {
        question: 'If $X = \\{ \\text{red, blue} \\}$ and $Y = \\{ \\text{green, yellow} \\}$, find $X \\cap Y$.',
        steps: ['Look for colors that appear in both sets.', 'No color appears in both X and Y.', 'So the intersection has no members.'],
        answer: '$X \\cap Y = \\varnothing$'
      }
    ],
    practiceZone: [
      'Find the intersection of $\\{ \\text{Red, Blue} \\}$ and $\\{ \\text{Blue, Green} \\}$.',
      'Find the union of $\\{a, b, c\\}$ and $\\{c, d, e\\}$.',
      'If two sets have nothing in common, what is their intersection?',
      'If $A = \\{1, 3, 5\\}$ and $B = \\{2, 3, 4\\}$, find $A \\cap B$ and $A \\cup B$.'
    ]
  },
  {
    id: 'venn-diagrams',
    eyebrow: 'Chapter 2.6',
    title: 'The Venn Diagram',
    intro: 'Sets can be hard to picture using only words and symbols. The best way to SEE a set is to draw it. A Venn diagram uses a rectangle and circles to show sets clearly, so you can see at a glance what belongs to one set only, what belongs to both sets, and what belongs to neither.',
    introImage: {
      src: vennIntroImage,
      caption: 'Two overlapping hoops on the ground work just like a Venn diagram — some children stand in one hoop, some in the other, and some in the middle where both hoops cross.'
    },
    method: [
      {
        title: 'How to Draw a Venn Diagram',
        steps: [
          'Step 1: Draw a rectangle first. This rectangle stands for the Universal Set, and we label it with the symbol $\\xi$.',
          'Step 2: Inside the rectangle, draw a circle for each set you are working with, such as A and B.',
          'Step 3: If the two sets share members, draw the circles so they overlap in the middle.',
          'Step 4: Write the shared members inside the overlapping part.',
          'Step 5: Write the members that belong to only one set inside that set\'s own part, away from the overlap.'
        ],
        image: {
          src: vennDrawImage,
          caption: 'First draw the rectangle, then add two overlapping circles, then place each member in the correct part.'
        }
      },
      {
        title: 'How to Shade a Venn Diagram',
        steps: [
          'To shade $A \\cap B$: shade only the small middle part where the two circles cross.',
          'To shade $A \\cup B$: shade the whole area covered by both circles, including the middle.',
          'To shade "A only": shade the part of circle A that does NOT touch circle B.',
          'To shade "outside both sets": shade the part of the rectangle that is outside both circles.'
        ],
        image: {
          src: vennShadingImage,
          caption: 'Each shading rule highlights a different part of the diagram — the overlap, the whole, one circle only, or the empty space outside.'
        }
      }
    ],
    examples: [
      {
        question: 'Where do you put an element that belongs to both Set A and Set B?',
        steps: ['Elements belonging to both are called the intersection.', 'In a Venn diagram, this is the shared space.'],
        answer: 'In the overlap (middle part) of the two circles.'
      },
      {
        question: 'If $A = \\{2, 4\\}$ and $B = \\{4, 6\\}$, where does 4 go in the Venn diagram?',
        steps: ['Check set A: 4 is in A.', 'Check set B: 4 is also in B.', 'Because 4 belongs to both sets, it goes in the overlap.'],
        answer: '$4$ goes in $A \\cap B$, the overlapping part.'
      }
    ],
    practiceZone: [
      'Draw a Venn diagram for $A = \\{2, 4\\}$ and $B = \\{4, 6\\}$.',
      'In a Venn diagram, what does the outer rectangle represent?',
      'Shade a diagram to show the Union of two sets.'
    ]
  }
];

/* --------------------------- COMPONENTS --------------------------- */

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

export const Sets: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 2
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Introduction to Sets
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Learn how to group things, use set symbols, and understand Venn diagrams.
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

export default Sets;
