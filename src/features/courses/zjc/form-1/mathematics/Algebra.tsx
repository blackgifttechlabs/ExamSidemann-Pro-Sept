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

/* ---------- SVG diagrams ---------- */
const balanceScaleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="white" />
  <!-- Stand -->
  <rect x="190" y="150" width="20" height="120" fill="#8B4513" />
  <polygon points="180,150 220,150 200,130" fill="#8B4513" />
  <!-- Beam -->
  <line x1="80" y1="150" x2="320" y2="150" stroke="black" stroke-width="4" />
  <circle cx="200" cy="150" r="10" fill="black" />
  <!-- Left pan strings -->
  <line x1="100" y1="150" x2="100" y2="210" stroke="black" stroke-width="2" />
  <line x1="120" y1="150" x2="120" y2="210" stroke="black" stroke-width="2" />
  <!-- Right pan strings -->
  <line x1="280" y1="150" x2="280" y2="210" stroke="black" stroke-width="2" />
  <line x1="300" y1="150" x2="300" y2="210" stroke="black" stroke-width="2" />
  <!-- Left pan -->
  <rect x="80" y="210" width="60" height="15" fill="#ddd" stroke="black" />
  <!-- Items on left: box x and two 1kg weights -->
  <rect x="90" y="190" width="20" height="20" fill="lightblue" stroke="black" />
  <text x="92" y="204" font-size="10" font-family="Arial">x</text>
  <circle cx="120" cy="200" r="10" fill="gold" stroke="black" />
  <text x="115" y="204" font-size="10" font-family="Arial">1</text>
  <circle cx="140" cy="200" r="10" fill="gold" stroke="black" />
  <text x="135" y="204" font-size="10" font-family="Arial">1</text>
  <!-- Right pan -->
  <rect x="260" y="210" width="60" height="15" fill="#ddd" stroke="black" />
  <!-- Items on right: five 1kg weights -->
  ${[270,285,300,315,330].map((x,i) => `
    <circle cx="${x}" cy="${200 - i*5}" r="10" fill="gold" stroke="black" />
    <text x="${x-4}" y="${204 - i*5}" font-size="10" font-family="Arial">1</text>
  `).join('')}
  <!-- Level indicator -->
  <text x="10" y="160" font-size="14" font-family="Arial" fill="green">Balance is level</text>
</svg>
`;

const numberLineSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="100%" height="100%">
  <rect width="500" height="100" fill="white" />
  <line x1="50" y1="50" x2="450" y2="50" stroke="black" stroke-width="3" />
  <!-- Arrow heads -->
  <polygon points="450,50 440,45 440,55" fill="black" />
  <polygon points="50,50 60,45 60,55" fill="black" />
  <!-- Ticks and numbers -->
  ${[-2,-1,0,1,2,3,4,5,6].map(v => {
    const x = 50 + (v+2)*50;
    return `<line x1="${x}" y1="45" x2="${x}" y2="55" stroke="black" />
            <text x="${x-8}" y="75" font-size="14" font-family="Arial">${v}</text>`;
  }).join('')}
  <!-- Closed circle at 3 and arrow to right -->
  <circle cx="300" cy="50" r="8" fill="black" />
  <line x1="308" y1="50" x2="450" y2="50" stroke="black" stroke-width="4" />
  <polygon points="450,50 440,45 440,55" fill="black" />
  <text x="300" y="25" font-size="14" font-family="Arial" fill="red">x ≥ 3</text>
</svg>
`;

/* ---------- Content ---------- */
const algebraImageMap: Record<string, string> = {
  'algebra-like-terms.png': new URL('./images/algebra-like-terms.png', import.meta.url).href,
  'algebra-simplify-steps.png': new URL('./images/algebra-simplify-steps.png', import.meta.url).href,
  'algebra-substitution-steps.png': new URL('./images/algebra-substitution-steps.png', import.meta.url).href,
  'algebra-balance-scale.png': new URL('./images/algebra-balance-scale.png', import.meta.url).href,
  'algebra-solve-equation-steps.png': new URL('./images/algebra-solve-equation-steps.png', import.meta.url).href,
  'algebra-inequality-symbols.png': new URL('./images/algebra-inequality-symbols.png', import.meta.url).href,
  'algebra-number-line-inequality.png': new URL('./images/algebra-number-line-inequality.png', import.meta.url).href,
  'algebra-indices-diagram.png': new URL('./images/algebra-indices-diagram.png', import.meta.url).href,
  'algebra-word-problem-steps.png': new URL('./images/algebra-word-problem-steps.png', import.meta.url).href,
  'algebra-hcf-steps.png': new URL('./images/algebra-hcf-steps.png', import.meta.url).href,
};

const algebraImage = (filename: string) => {
  return algebraImageMap[filename] || svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
      <rect width="900" height="520" rx="36" fill="#ffffff"/>
      <rect x="24" y="24" width="852" height="472" rx="28" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="4"/>
      <text x="450" y="250" text-anchor="middle" font-size="32" font-family="Arial, sans-serif" font-weight="700" fill="#047857">Missing image: ${filename}</text>
    </svg>
  `);
};

interface WorkedExample {
  question: string;
  steps: string[];
  answer: string;
}

interface MethodTableRow {
  symbol: string;
  meaning: string;
  example: string;
  note: string;
}

interface TopicSection {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  introImage?: { src: string; caption: string };
  diagram?: { title: string; content: string; type: string; image?: string };
  diagrams?: { title: string; content: string; image: string }[];
  method?: { title: string; steps: string[]; table?: MethodTableRow[]; image?: { src: string; caption: string } }[];
  myth?: string;
  examples: WorkedExample[];
  practiceZone: string[];
}

const sections: TopicSection[] = [
  {
    id: 'algebraic-manipulation',
    eyebrow: 'Chapter 3.1',
    title: 'Algebraic Manipulation',
    intro: 'Before Algebra, you have only worked with numbers you already know, like 5 or 12. But sometimes we do not know a number yet — maybe it is a mystery number, or a number that changes. Instead of leaving a blank space, Mathematicians agreed to use letters like $x$, $y$, $a$, or $b$ to stand in for that unknown number. Think of a letter as an empty box: it is a container waiting to hold a number, and different problems can put different numbers inside the same-shaped box. This is the whole idea of Algebra — working with these "boxes" using the same rules you already know for numbers, like adding, subtracting, multiplying, and dividing. There is one very important rule though: you can only combine boxes that are labelled the SAME. Think about sorting fruit — you can add 3 apples and 2 apples together to get 5 apples, because they are the same type of thing. But you cannot add 3 apples and 2 bananas and call the answer "5" of anything, because apples and bananas are different things. In Algebra, $x$ and $y$ (or $a$ and $b$) are different "types of fruit" — so $3x$ and $5x$ can combine, but $3x$ and $3y$ cannot.',
    method: [
      {
        title: 'Like Terms — The Fruit Basket Rule',
        steps: [
          'Terms are "like terms" when they have exactly the same letter part. For example, $3x$ and $5x$ are like terms because they both have just "$x$". But $3x$ and $3y$ are NOT like terms, because one has $x$ and the other has $y$ — different letters.',
          'Rule: We are only allowed to add or subtract like terms. We cannot combine unlike terms into one term — they must stay separate.',
          'Worked example: $3a + 2a = 5a$. Justification: this is exactly the same as saying "3 apples + 2 apples = 5 apples" — we are counting how many $a$\'s we have in total, so we just add the numbers in front (3 and 2) and keep the letter $a$.',
          'Worked example: $3a + 2b$ cannot be simplified further — it stays as $3a + 2b$. Justification: this is like having 3 apples and 2 bananas — you cannot squash them into one type of fruit, so the answer must show both parts separately.'
        ],
        image: {
          src: algebraImage('algebra-like-terms.png'),
          caption: 'Like terms combine (apples + apples), but unlike terms cannot combine (apples + bananas stay separate).'
        }
      },
      {
        title: 'How to Simplify Expressions (Step by Step)',
        steps: [
          'Step 1: Scan the whole expression and find terms that share the exact same letter — these are your like terms. Justification: you must sort them first, the same way you would sort a mixed pile of fruit before counting each type.',
          'Step 2: Add or subtract the numbers in front of the matching letters (these numbers are called coefficients). Justification: the letter tells you WHAT you are counting, and the coefficient tells you HOW MANY — so combining coefficients is just normal addition/subtraction of the counts.',
          'Step 3: Keep the letter exactly as it was — do not change it or add a power to it. Justification: the letter is just a label for the type of "fruit"; simplifying only changes how many you have, not what type they are.',
          'Worked example: Simplify $5x + 2x - x$. First combine $5x + 2x = 7x$ (5 + 2 = 7, keep the $x$). Then $7x - x = 6x$ (7 − 1 = 6, remember a lone $x$ means $1x$). Final answer: $6x$.',
          'Worked example: Simplify $4a + 3b + 2a$. Group the matching letters first: $4a$ and $2a$ are like terms, so $4a + 2a = 6a$. The $3b$ has no matching partner, so it must stay exactly as it is. Final answer: $6a + 3b$.'
        ],
        image: {
          src: algebraImage('algebra-simplify-steps.png'),
          caption: 'Step by step: find the like terms, add or subtract their coefficients, then keep the letter unchanged.'
        }
      },
      {
        title: 'Substitution — Filling the Empty Box',
        steps: [
          'Substitution means replacing a letter with an actual number you have been given, then working out the answer using normal arithmetic.',
          'Step 1: Write out the expression exactly as given, so you know what you are working with.',
          'Step 2: Wherever a letter appears, replace it with the number value you were told it equals. Justification: this is the whole point of a letter being a "box" — once you know what number is inside the box, you swap the letter for that number.',
          'Step 3: Calculate the result using the normal order of operations (multiply/divide before add/subtract). Justification: once the letters are gone and only numbers remain, it becomes an ordinary arithmetic problem you already know how to solve.',
          'Worked example: If $x = 5$, find $x + 10$. Replace $x$ with $5$: $5 + 10 = 15$.',
          'Worked example: If $a = 3$ and $b = 4$, find $2a + b$. Remember $2a$ means "$2$ times $a$" — a number written right next to a letter always means multiply. Replace: $(2 \\times 3) + 4 = 6 + 4 = 10$.'
        ],
        image: {
          src: algebraImage('algebra-substitution-steps.png'),
          caption: 'Step by step: write the expression, swap each letter for its given number, then calculate the answer.'
        }
      }
    ],
    myth: 'Math Myth Box: Algebra is hard because of the letters. Fact: Letters are just "empty boxes." Algebra actually makes Math easier because it allows us to solve problems that are too big for just numbers!',
    examples: [
      {
        question: 'Simplify $3x + 5x + x$.',
        steps: ['All terms are like (all have $x$).', 'Add coefficients: $3+5+1 = 9$.', 'Keep the $x$.'],
        answer: '$9x$'
      },
      {
        question: 'Simplify $10a - 4a$.',
        steps: ['Both have $a$, so subtract: $10 - 4 = 6$.'],
        answer: '$6a$'
      },
      {
        question: 'Simplify $2x + 3y + 4x + y$.',
        steps: ['Group $x$: $2x+4x = 6x$.', 'Group $y$: $3y+y = 4y$.', 'Answer: $6x+4y$.'],
        answer: '$6x + 4y$'
      },
      {
        question: 'If $p = 2$ and $q = 10$, find $q - p$.',
        steps: ['Replace $q$ with 10 and $p$ with 2.', '$10 - 2 = 8$.'],
        answer: '$8$'
      },
      {
        question: 'If $p = 2$, find $3p + 5$.',
        steps: ['$3p$ means $3 \\times p = 3 \\times 2 = 6$.', '$6 + 5 = 11$.'],
        answer: '$11$'
      }
    ],
    practiceZone: [
      'Simplify: a) $3x + 5x + x$ b) $10a - 4a$ c) $2x + 3y + 4x + y$',
      'If $p = 2$ and $q = 10$, find: a) $q - p$ b) $3p + 5$ c) $p + q + 2$',
      'Simplify $7m + 3n - 2m + n$.',
      'If $a = 4$ and $b = 6$, evaluate $3a - 2b$.'
    ]
  },
  {
    id: 'linear-equations',
    eyebrow: 'Chapter 3.2',
    title: 'Linear Equations',
    intro: 'Picture a real balance scale, the kind with two pans hanging from a bar. If you put the exact same weight on both sides, the bar stays perfectly flat and level — it is balanced. An equation works exactly like this: the equals sign ($=$) is the middle of the balance scale, and it tells you that whatever is on the left side weighs exactly the same as whatever is on the right side. Our goal when we "solve an equation" is to figure out what number an unknown letter (like $x$) must equal in order to keep the scale balanced. To do this, we get $x$ completely alone on one side of the equals sign. But there is a golden rule of balance scales: whatever you do to one side, you must also do to the other side, or the scale will tip and stop being equal. In practice, the easiest way to think about this is: to remove something from one side, we do the OPPOSITE operation on that same value, and it "moves" to the other side already changed into its opposite. This keeps everything perfectly balanced while letting us isolate $x$.',
    introImage: {
      src: algebraImage('algebra-balance-scale.png'),
      caption: 'A balance scale: left side has x + 2 (box x and two 1kg weights), right side has five 1kg weights. The scale is level, meaning x + 2 = 5.'
    },
    method: [
      {
        title: 'The Rule of Opposites (Step by Step)',
        steps: [
          'Opposites table — every operation has an exact opposite that "undoes" it: $+$ undoes with $-$, $-$ undoes with $+$, $\\times$ undoes with $\\div$, and $\\div$ undoes with $\\times$.',
          'Step 1: Look at the equation and identify what is attached to $x$ (what is being added, subtracted, multiplied, or divided).',
          'Step 2: Apply the OPPOSITE operation to both sides of the equation, so the attached value cancels out on the $x$ side and appears (already flipped) on the other side. Justification: doing the opposite operation on both sides keeps the scale balanced, while removing the extra value from the $x$ side.',
          'Step 3: If there is more than one thing attached to $x$, undo them one at a time, working from the outside in — usually undo addition/subtraction first, then multiplication/division.',
          'Worked example: Solve $x + 5 = 15$. Since $+5$ is attached, do the opposite: subtract 5 from both sides. $x = 15 - 5 = 10$.',
          'Worked example: Solve $x - 3 = 7$. Since $-3$ is attached, do the opposite: add 3 to both sides. $x = 7 + 3 = 10$.',
          'Worked example: Solve $3x = 12$. Here $3$ is multiplying $x$, so the opposite is to divide both sides by 3. $x = 12 \\div 3 = 4$.',
          'Worked example (two steps): Solve $2x + 4 = 10$. Step 1 — undo the $+4$ first by subtracting 4 from both sides: $2x = 10 - 4 = 6$. Step 2 — undo the $\\times 2$ by dividing both sides by 2: $x = 6 \\div 2 = 3$. Justification for the order: we undo addition/subtraction before multiplication/division because $2x + 4$ was built by first multiplying then adding, so we unbuild it in the reverse order — last thing added, first thing removed.'
        ],
        image: {
          src: algebraImage('algebra-solve-equation-steps.png'),
          caption: 'Step by step: move the added number to the other side (opposite sign), then move the multiplied number to the other side (opposite operation).'
        }
      }
    ],
    examples: [
      {
        question: 'Solve $x + 5 = 15$.',
        steps: ['Move $+5$ to the other side as $-5$.', '$x = 15 - 5 = 10$.'],
        answer: '$x = 10$'
      },
      {
        question: 'Solve $x - 3 = 7$.',
        steps: ['Move $-3$ as $+3$.', '$x = 7 + 3 = 10$.'],
        answer: '$x = 10$'
      },
      {
        question: 'Solve $3x = 12$.',
        steps: ['The $3$ is multiplying $x$, so move as $\\div 3$.', '$x = 12 \\div 3 = 4$.'],
        answer: '$x = 4$'
      },
      {
        question: 'Solve $2x + 1 = 9$.',
        steps: ['Move $+1$ as $-1$: $2x = 9 - 1 = 8$.', 'Move $\\times 2$ as $\\div 2$: $x = 8 \\div 2 = 4$.'],
        answer: '$x = 4$'
      }
    ],
    practiceZone: [
      'Solve: a) $x + 5 = 15$ b) $x - 3 = 7$ c) $3x = 12$ d) $2x + 1 = 9$',
      'Solve: $4x - 3 = 13$',
      'Solve: $\\frac{x}{2} = 6$',
      'Solve: $5x + 2 = 22$'
    ]
  },
  {
    id: 'inequalities',
    eyebrow: 'Chapter 3.3',
    title: 'Inequalities',
    intro: 'So far, the equals sign ($=$) has always told us two things are exactly the same. But in real life, things are not always exactly equal — sometimes we only know that one amount is bigger or smaller than another. For example, "you must be at least 12 years old" does not mean exactly 12 — it means 12 or any age above. This is where inequalities come in: they are special symbols that compare two values without saying they are equal. A fun way to remember them is the "hungry crocodile" trick: imagine the inequality symbol as a crocodile\'s mouth. The crocodile is always hungry and always wants to eat the BIGGER number, so his open mouth always points toward the larger value, and his closed pointy end faces the smaller value.',
    method: [
      {
        title: 'The Inequality Symbols (What Each One Means)',
        table: [
          {
            symbol: '$<$',
            meaning: 'is less than',
            example: '$3 < 5$ reads as "3 is less than 5"',
            note: 'The open (wide) side faces the bigger number, so the mouth opens toward 5.'
          },
          {
            symbol: '$>$',
            meaning: 'is greater than',
            example: '$5 > 3$ reads as "5 is greater than 3"',
            note: 'The mouth opens toward the bigger number again, just written the other way round.'
          },
          {
            symbol: '$\\le$',
            meaning: 'is less than OR equal to',
            example: '$x \\le 4$ means x can be 4 or any number less than 4',
            note: 'The small line under the symbol means the boundary value is included.'
          },
          {
            symbol: '$\\ge$',
            meaning: 'is greater than OR equal to',
            example: '$x \\ge 3$ means x can be 3 or any number greater than 3',
            note: 'Same idea as greater than, but the boundary value is included.'
          }
        ],
        steps: [
          'Justification for why this matters: in word problems like "you need at least 3 units", the correct symbol is $\\ge 3$ (3 counts as enough), not $> 3$ (which would wrongly exclude 3 itself).'
        ],
        image: {
          src: algebraImage('algebra-inequality-symbols.png'),
          caption: 'The crocodile-mouth trick: the open side of the symbol always faces the bigger number.'
        }
      },
      {
        title: 'Showing Inequalities on a Number Line (Step by Step)',
        steps: [
          'A number line lets us draw EVERY number that makes an inequality true, since there are often infinitely many correct answers (not just one, like in an equation).',
          'Step 1: Find the boundary number in the inequality (for example, in $x \\ge 3$, the boundary number is 3) and locate it on the number line.',
          'Step 2: Decide the circle type at that boundary number. Use an OPEN circle $\\circ$ for $<$ or $>$, because that exact number is NOT included as an answer. Use a CLOSED (filled-in) circle $\\bullet$ for $\\le$ or $\\ge$, because that exact number IS included as an answer. Justification: the circle is a visual flag telling the reader "does this exact boundary count or not?"',
          'Step 3: Draw an arrow starting from the circle, pointing in the direction of all the other numbers that also satisfy the inequality — right for "greater than" types, left for "less than" types. Justification: since there are infinitely many correct values, the arrow represents "and every number this way too", so you never have to list them all.',
          'Worked example: $x \\ge 3$ — plot a CLOSED circle at 3 (because 3 itself is allowed), then draw an arrow pointing right toward 4, 5, 6, and beyond (because all bigger numbers also satisfy $x \\ge 3$).'
        ],
        image: {
          src: algebraImage('algebra-number-line-inequality.png'),
          caption: 'Number line for x ≥ 3: closed circle at 3 (3 is included) and arrow pointing right (all bigger numbers work too).'
        }
      }
    ],
    examples: [
      {
        question: 'Draw a number line for $x > 2$. Should the circle be open or closed?',
        steps: ['$>$ means "greater than", so 2 is NOT included.', 'Use an open circle at 2, arrow to the right.'],
        answer: 'Open circle at 2 with arrow right.'
      },
      {
        question: 'Write the symbol for "greater than or equal to".',
        steps: ['The symbol is $\\ge$.'],
        answer: '$\\ge$'
      }
    ],
    practiceZone: [
      'Draw a number line to show $x > 2$. (Should the circle be open or closed?)',
      'Write the symbol for "less than or equal to".',
      'Graph $x \\le 4$ on a number line.',
      'Graph $x < -1$ on a number line.'
    ]
  },
  {
    id: 'indices',
    eyebrow: 'Chapter 3.4',
    title: 'Indices (Powers)',
    intro: 'Imagine you have to write $2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2$ — that is ten 2\'s multiplied together! It is long, slow to write, and easy to make a mistake counting the 2\'s. Mathematicians needed a shorter way to write repeated multiplication of the same number, so they invented indices (also called powers or exponents). Instead of writing all ten 2\'s, we write $2^{10}$ — a small raised number tucked next to the main number. This small number is simply a counter that tells you exactly how many times to multiply the main number by itself. It is not addition, and it is not just any multiplication — indices ONLY apply when the SAME number is being multiplied by itself repeatedly.',
    method: [
      {
        title: 'Reading and Writing Indices (Step by Step)',
        steps: [
          'Every index expression has two parts: the BASE (the large number being multiplied) and the INDEX or POWER (the small raised number telling you how many times to multiply the base by itself).',
          'Step 1: Identify the base — this is the number you will repeat.',
          'Step 2: Identify the index — this tells you exactly how many times the base appears in the multiplication.',
          'Step 3: Expand it out by writing the base that many times, joined by multiplication signs, to check your understanding. Justification: expanding it out is the proof of what the short form actually means — it is just a shortcut, not a new operation.',
          'Worked example: $a^4$ means $a \\times a \\times a \\times a$ — the base $a$ is multiplied by itself 4 times, because the index is 4.',
          'Worked example: $5^2$ (read as "five squared") means $5 \\times 5 = 25$. Justification for the name "squared": a square shape has 2 equal sides, so multiplying a number by itself exactly twice is called "squaring" it.',
          'Worked example: $10^3$ (read as "ten cubed") means $10 \\times 10 \\times 10 = 1000$. Justification for the name "cubed": a cube shape has 3 equal dimensions (length, width, height), so multiplying a number by itself exactly three times is called "cubing" it.',
          'Special rule to remember: $x^1 = x$. Justification: if the index is 1, the base is only "multiplied by itself" 1 time — meaning it just stays as itself, with no extra multiplication happening at all.'
        ],
        image: {
          src: algebraImage('algebra-indices-diagram.png'),
          caption: 'The base is the number being repeated; the index tells you how many times to multiply it by itself.'
        }
      }
    ],
    examples: [
      {
        question: 'Write $b \\times b \\times b$ in index form.',
        steps: ['There are three $b$ multiplied.', 'So it is $b^3$.'],
        answer: '$b^3$'
      },
      {
        question: 'Write $7 \\times 7 \\times 7 \\times 7 \\times 7$ in index form.',
        steps: ['Count the sevens: there are 5.', 'So it is $7^5$.'],
        answer: '$7^5$'
      }
    ],
    practiceZone: [
      'Write in index form: a) $b \\times b \\times b$ b) $7 \\times 7 \\times 7 \\times 7 \\times 7$',
      'Evaluate: a) $3^2$ b) $2^4$ c) $10^2$',
      'Write $x \\times x \\times x \\times x \\times x$ in index form.'
    ]
  },
  {
    id: 'word-problems',
    eyebrow: 'Chapter 3.5',
    title: 'Word Problems (Formulating Equations)',
    intro: 'Word problems can feel tricky because the Mathematics is hidden inside sentences written in ordinary English. But really, this is just a translation task — like translating a sentence from Shona to English, we are translating a sentence from English words into Mathematical symbols. Once it is translated, it becomes a normal equation you already know how to solve. The trick is learning to recognise certain keywords and knowing exactly which symbol each one turns into: "doubles" or "twice" means multiply by 2 ($\\times 2$); "more than", "sum", "increased by", or "added to" means add ($+$); "less than", "decreased by", or "reduced by" means subtract ($-$); and "is" or "gives" or "the result is" usually becomes the equals sign ($=$).',
    method: [
      {
        title: 'Steps to Formulate an Equation (Step by Step)',
        steps: [
          'Step 1: Read the whole problem carefully, and find the unknown quantity — the thing whose value you do not yet know. Give it a letter, usually $x$. Justification: naming the unknown first means every other sentence in the problem can now be written in terms of that one letter.',
          'Step 2: Go sentence by sentence, and translate each action described in words into its matching Mathematical operation using $x$. Justification: this is where the keyword list helps — spotting "doubles", "more than", "less than" tells you exactly which symbol to write.',
          'Step 3: Find the final result given in the problem, and set your expression from Step 2 equal to it, using $=$. Justification: this is what turns a plain expression into a solvable equation — without the $=$ and a result, you cannot solve for $x$.',
          'Step 4: Solve the equation using the Rule of Opposites you learned earlier (undo each operation on both sides until $x$ is alone).',
          'Worked example: "Farai thinks of a number $x$. He doubles it. The result is 10." Translate: "doubles" means $2x$. The result is 10, so the equation is $2x = 10$. Solve: divide both sides by 2, giving $x = 5$.',
          'Worked example: "Chipo has some tomatoes ($x$). She buys 5 more. Now she has 12." Translate: "buys 5 more" means $+5$, so the equation is $x + 5 = 12$. Solve: subtract 5 from both sides, giving $x = 7$.'
        ],
        image: {
          src: algebraImage('algebra-word-problem-steps.png'),
          caption: 'Step by step: find the unknown, translate the words into symbols, write the equation, then solve it.'
        }
      }
    ],
    examples: [
      {
        question: 'A number $x$ is increased by 7 gives 15. Write an equation and solve.',
        steps: ['Increase by 7: $x + 7$.', 'This equals 15: $x + 7 = 15$.', 'Solve: $x = 15 - 7 = 8$.'],
        answer: '$x = 8$'
      },
      {
        question: 'Three times a number is 21. Find the number.',
        steps: ['Three times a number: $3x$.', 'Set equal to 21: $3x = 21$.', 'Divide by 3: $x = 7$.'],
        answer: '$x = 7$'
      }
    ],
    practiceZone: [
      'Farai thinks of a number, adds 4, and gets 10. Write the equation and solve.',
      'The sum of a number and 8 is 20. Find the number.',
      'A bus has $x$ passengers. After 12 get off, 18 remain. Find $x$.',
      'The cost of 5 pens is $\\$15$. Write an equation to find the cost of one pen.'
    ]
  },
  {
    id: 'hcf',
    eyebrow: 'Chapter 3.6',
    title: 'HCF in Algebra (Highest Common Factor)',
    intro: 'You may already know how to find the Highest Common Factor (HCF) of two plain numbers — the biggest number that divides evenly into both of them. In Algebra, we can do exactly the same thing with algebraic terms like $4x$ and $8x$, because these terms are also built by multiplying smaller factors together (some numbers, and sometimes a letter too). The HCF of two algebraic terms is the biggest expression that divides evenly into both of them, and finding it is very useful later on, when we need to simplify or factorise more complicated expressions.',
    method: [
      {
        title: 'Finding the HCF of Algebraic Terms (Step by Step)',
        steps: [
          'Step 1: Break each term down completely into its smallest building blocks — write it as a string of numbers and letters multiplied together (this is called writing it as a product of factors). Justification: you cannot compare two terms properly until you can see exactly what each one is made of.',
          'Step 2: Line up the two broken-down terms and pick out every factor that appears in BOTH lists — these are the common factors. Justification: a factor can only be part of the HCF if it truly divides into both original terms; comparing the broken-down lists makes it easy to see which ones match.',
          'Step 3: Multiply all the common factors together — this product is the HCF. Justification: multiplying the shared building blocks back together rebuilds the largest expression that both original terms have in common.',
          'Worked example: Find the H.C.F of $4x$ and $8x$. Break down: $4x = 2 \\times 2 \\times x$, and $8x = 2 \\times 2 \\times 2 \\times x$. Comparing the two lists, both share $2 \\times 2 \\times x$ (the third "2" in $8x$ has no partner in $4x$, so it is left out). Multiply the common factors: $2 \\times 2 \\times x = 4x$. So the H.C.F is $4x$.',
          'Worked example: Find the H.C.F of $3a$ and $9a$. Break down: $3a = 3 \\times a$, and $9a = 3 \\times 3 \\times a$. Comparing, both share $3 \\times a$ (the extra "3" in $9a$ has no partner). Multiply: $3 \\times a = 3a$. So the H.C.F is $3a$.'
        ],
        image: {
          src: algebraImage('algebra-hcf-steps.png'),
          caption: 'Step by step: break each term into factors, circle the common factors, then multiply them to get the HCF.'
        }
      }
    ],
    examples: [
      {
        question: 'Find the HCF of $4x$ and $8x$.',
        steps: ['$4x = 2^2 \\times x$', '$8x = 2^3 \\times x$', 'Take lowest powers: $2^2 \\times x = 4x$.'],
        answer: '$4x$'
      },
      {
        question: 'Find the HCF of $3a$ and $9a$.',
        steps: ['$3a = 3 \\times a$', '$9a = 3^2 \\times a$', 'Common: $3 \\times a = 3a$.'],
        answer: '$3a$'
      }
    ],
    practiceZone: [
      'Find the HCF of: a) $4x$ and $8x$ b) $3a$ and $9a$',
      'Find the HCF of $6y$ and $15y$.',
      'Find the HCF of $2ab$ and $4a$.'
    ]
  }
];

/* ---------- Helper to convert SVG to data URI ---------- */
function svgToDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ---------- Components (same as Sets/Graphs) ---------- */
const renderInlineMathText = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g).filter(Boolean);

  return parts.map((part, index) =>
    part.startsWith('$') && part.endsWith('$') ? (
      <span key={index} className="inline-block whitespace-nowrap align-baseline">
        <MathJax inline>{part}</MathJax>
      </span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const splitProcessSentences = (text: string) => {
  // Keep the abbreviation H.C.F. together instead of displaying it as three sentences.
  const normalizedText = text.replace(/\bH\.C\.F\.?\b/g, 'HCF');
  return normalizedText.match(/[^.!?]+[.!?]?/g)?.map((part) => part.trim()).filter(Boolean) || [normalizedText];
};

const hasMathWorking = (text: string) => {
  const mathParts = text.match(/\$[^$]+\$/g) || [];
  return mathParts.some((part) => /(?:=|\\times|\\div|\\frac|\\le|\\ge|[+\-−×÷<>^])/.test(part));
};

const renderProcessText = (text: string) => {
  const sentences = splitProcessSentences(text);

  return (
    <div className="space-y-2">
      {sentences.map((sentence, index) =>
        hasMathWorking(sentence) ? (
          <div
            key={index}
            className="mx-auto my-3 w-full max-w-2xl border border-stone-200 bg-[#fffdf5] px-5 py-3 text-left text-base font-normal text-slate-800 shadow-[0_2px_5px_rgba(0,0,0,0.08)] [&_mjx-container]:font-bold [&_mjx-container_*]:font-bold [&_mjx-container]:text-[1.08em]"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(148, 163, 184, 0.16) 32px)',
            }}
          >
            {renderInlineMathText(sentence)}
          </div>
        ) : (
          <p key={index} className="leading-relaxed text-slate-700">
            {renderInlineMathText(sentence)}
          </p>
        )
      )}
    </div>
  );
};

const renderWorkedExampleText = (text: string) => {
  const normalizedText = text.replace(/\bH\.C\.F\.?\b/g, 'HCF');
  const sentences = splitProcessSentences(normalizedText);

  return (
    <div
      className="my-3 w-full rounded-sm border border-stone-200 bg-[#fffdf5] px-4 py-3 text-slate-800 shadow-[0_2px_5px_rgba(0,0,0,0.08)]"
      style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(148, 163, 184, 0.16) 32px)',
      }}
    >
      {sentences.map((sentence, index) => {
        const isWorking = hasMathWorking(sentence);

        return (
          <div key={index} className={`py-1.5 leading-relaxed ${isWorking ? 'pl-5' : ''} ${/^Justification:/i.test(sentence) ? 'mt-2 border-t border-stone-200 pt-3 text-sm italic text-slate-600' : ''}`}>
            {isWorking && <span className="mr-2 font-bold text-rose-400" aria-hidden="true">→</span>}
            {renderInlineMathText(sentence)}
          </div>
        );
      })}
    </div>
  );
};

const renderMethodStep = (step: string) => {
  const match = step.match(/^((?:Step\s+\d+(?:\s*\([^)]*\))?|Worked example(?:\s*\([^)]*\))?|Rule|Opposites table):)(\s*)(.*)$/);

  if (!match) return renderProcessText(step);

  const [, prefix, , rest] = match;

  return (
    <div className="space-y-2">
      <strong className="block font-extrabold text-slate-950">{prefix}</strong>
      {prefix.startsWith('Worked example:') ? renderWorkedExampleText(rest) : renderProcessText(rest)}
    </div>
  );
};

const ExampleCard: React.FC<{ index: number; example: WorkedExample }> = ({ index, example }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-4">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {index}
        </div>
        <div className="text-slate-800 font-medium pt-1 whitespace-nowrap">
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

      <div
        className={`border-t border-slate-100 bg-slate-50 p-4 sm:p-5 ${open ? 'block' : 'hidden'}`}
      >
        <div className={notebookPaperClassName} style={notebookPaperStyle}>
          {example.steps.map((step, i) => (
          <div key={i} className="flex gap-2 border-b border-stone-200/70 py-2 text-sm leading-relaxed text-slate-700 last:border-0">
            <span className="shrink-0 font-semibold text-rose-400">Step {i + 1}:</span>
            <div className="min-w-max flex-1">{renderProcessText(step)}</div>
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

      {section.myth && (
        <div className="mb-6 p-4 bg-amber-50 rounded-r-lg text-amber-800 text-sm">
          <strong>💡 {section.myth.split(':')[0]}:</strong> {section.myth.split(':')[1]}
        </div>
      )}

      {section.introImage && (
        <div className="mb-6 flex justify-center">
          <figure className="w-full max-w-lg">
            <img
              loading="lazy"
              decoding="async"
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
                  loading="lazy"
                  decoding="async"
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
              loading="lazy"
              decoding="async"
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
          {m.table && (
            <div className="mb-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-emerald-50 text-xs uppercase tracking-wide text-emerald-700">
                    <tr>
                      <th className="px-4 py-3 font-extrabold">Symbol</th>
                      <th className="px-4 py-3 font-extrabold">Meaning</th>
                      <th className="px-4 py-3 font-extrabold">Example</th>
                      <th className="px-4 py-3 font-extrabold">Remember</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {m.table.map((row, rowIndex) => (
                      <tr key={rowIndex} className="align-top">
                        <td className="px-4 py-4 text-center text-xl font-extrabold text-slate-950 [&_mjx-container]:font-bold [&_mjx-container_*]:font-bold">
                          <MathJax inline>{row.symbol}</MathJax>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{row.meaning}</td>
                        <td className="px-4 py-4 text-slate-700">{renderInlineMathText(row.example)}</td>
                        <td className="px-4 py-4 text-slate-700">{renderInlineMathText(row.note)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <ul className="space-y-3 text-slate-700 ml-0 sm:ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-3 rounded-2xl border border-slate-100 bg-white/70 p-3 shadow-sm">
                <span className="text-emerald-400 font-bold">•</span>
                <div className="min-w-0 flex-1">{renderMethodStep(step)}</div>
              </li>
            ))}
          </ul>
          {m.image && (
            <div className="mt-4 flex justify-center">
              <figure className="w-full max-w-lg">
                <img
                  loading="lazy"
                  decoding="async"
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

export const Algebra: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
              CHAPTER 3
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Introduction to Algebra
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Many students think Algebra is difficult because it uses letters. But here is a secret: Letters are just placeholders for numbers we haven’t found yet.
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

export default Algebra;
