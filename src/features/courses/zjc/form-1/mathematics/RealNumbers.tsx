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
};

const naturalNumbersImage = new URL(
  "./images/child's hand pointing at three bright red apples on a wooden table.png",
  import.meta.url
).href;
const wholeNumbersImage = new URL(
  './images/A whimsical 2D vector illustration of three bowls in a row.png',
  import.meta.url
).href;
const integersImage = new URL(
  './images/A flat illustration of a horizontal thermometer number line..png',
  import.meta.url
).href;
const primeNumbersImage = new URL(
  './images/A playful flat vector graphic showing a large number 7 wrapped in chains with a heavy padlock on it..png',
  import.meta.url
).href;
 const hcfDiagramImage = new URL(
  './images/hcfwhat what.png',
  import.meta.url
).href;
const factorsExplainerImage = new URL(
  './images/Factors.png',
  import.meta.url
).href;
const multiplesExplainerImage = new URL(
  './images/Multiples.png',
  import.meta.url
).href;
const hcfExplainerImage = new URL(
  './images/HCF (Highest Common Factor).png',
  import.meta.url
).href;
const lcmExplainerImage = new URL(
  './images/LCM (Lowest Common Multiple).png',
  import.meta.url
).href;
const addingDirectedExplainerImage = new URL(
  './images/Adding Directed Numbers.png',
  import.meta.url
).href;
const subtractingDirectedExplainerImage = new URL(
  './images/Subtracting Directed Numbers.png',
  import.meta.url
).href;
const multiplyingDirectedExplainerImage = new URL(
  './images/Multiplying Directed Numbers.png',
  import.meta.url
).href;
const dividingDirectedExplainerImage = new URL(
  './images/Dividing Directed Numbers.png',
  import.meta.url
).href;
const fractionToDecimalExplainerImage = new URL(
  './images/Fraction to Decimal.png',
  import.meta.url
).href;
const decimalToPercentageExplainerImage = new URL(
  './images/Decimal to Percentage.png',
  import.meta.url
).href;
const percentageToFractionExplainerImage = new URL(
  './images/Percentage to Fraction.png',
  import.meta.url
).href;
const comparingTrioExplainerImage = new URL(
  './images/Comparing the Trio.png',
  import.meta.url
).href;
const bracketsFirstExplainerImage = new URL(
  './images/Brackets First.png',
  import.meta.url
).href;
const ofDivisionMultiplicationExplainerImage = new URL(
  './images/Of, Division & Multiplication.png',
  import.meta.url
).href;
const additionSubtractionExplainerImage = new URL(
  './images/Addition & Subtraction.png',
  import.meta.url
).href;
const mixedOperationsExplainerImage = new URL(
  './images/Mixed Operations.png',
  import.meta.url
).href;
const rounding10100_1000ExplainerImage = new URL(
  './images/Rounding to 10, 100, or 1000.png',
  import.meta.url
).href;
const roundingDecimalPlacesExplainerImage = new URL(
  './images/Rounding to Decimal Places.png',
  import.meta.url
).href;
const roundingSignificantFiguresExplainerImage = new URL(
  './images/Rounding to Significant Figures.png',
  import.meta.url
).href;
const estimatingRoundingExplainerImage = new URL(
  './images/Estimating with Rounding.png',
  import.meta.url
).href;
const base10ExplainerImage = new URL(
  './images/Base 10 (Everyday Counting).png',
  import.meta.url
).href;
const base60_24ExplainerImage = new URL(
  './images/Base 60 & 24 (Time)1.png',
  import.meta.url
).href;
const base12ExplainerImage = new URL(
  './images/Base 12 (Dozens).png',
  import.meta.url
).href;
const base2ExplainerImage = new URL(
  './images/Base 2 (Binary).png',
  import.meta.url
).href;
const hcfLcmVideoUrl = 'https://www.dropbox.com/scl/fi/4mmoc7bahi8hgocdwdsd4/How-To-Find-The-LCM-and-HCF-Quickly.mp4?rlkey=ffc5xtwb0egc6fscig94853ox&st=a9o6fhht&raw=1';
const typesOfNumbersShortUrl = 'https://www.dropbox.com/scl/fi/2956lzpm4app74g1zhmfi/Types-of-Numbers.-.mp4.mp4?rlkey=dxdrx9jt6zrxcqk5vwdic5pb0&st=o87fancs&raw=1';
const directedNumbersVideoUrl = 'https://www.dropbox.com/scl/fi/8m5btigc2ee94cznazvwp/Adding-and-Subtracting-Integers-Using-a-Simple-Method.mp4.mp4?rlkey=qvxd6n3csu6w830bdhfhhii9p&st=rijldw4w&raw=1';
const multiplyingPositiveNegativeNumbersVideoUrl = 'https://www.dropbox.com/scl/fi/d7ii7m2kbfdgigt3vbe7c/Multiplying-Positive-and-Negative-Numbers-Integer-Multiplication_.mp4.mp4?rlkey=5grhj9u6pumfmjs5h6on1uyq8&st=6bg2nb61&raw=1';
const dividingIntegersDifferentSignsTilesVideoUrl = 'https://www.dropbox.com/scl/fi/02qfr2fx570rhs08vy7d4/Dividing-Integers-Using-Tiles-both-signs-DIFFERENT.mp4.mp4?rlkey=y7ktgnivk1fxxc73swnziu2jg&st=a5w46d03&raw=1';
const dividingIntegersNegativeSignsNumberLineVideoUrl = 'https://www.dropbox.com/scl/fi/6un4e0ryw0p27hjuz823c/Dividing-Integers-Using-a-Number-Line-both-signs-NEGATIVE.mp4.mp4?rlkey=ir3lwkbqzn6d60l56bbl190hv&st=3hxjfhl9&raw=1';

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
  keyTypes?: string[];
  diagram?: { title: string; content: string; type: 'house' | 'rainbow' | 'line' | 'triangle' | 'hill' | 'table'; image?: string };
  method?: { title: string; steps: string[] }[];
  numberGroups?: { heading: string; explanation: string[]; example: string; nonExample: string; imageSrc?: string; imageAlt?: string; videoUrl?: string; videoCaption?: string; videos?: { url: string; caption: string }[]; }[];
  context?: string;
  videoUrl?: string;
  videoCaption?: string;
  shortVideoUrl?: string;
  examples: WorkedExample[];
  practiceZone: string[];
}

/* ----------------------------- CONTENT ----------------------------- */

const sections: TopicSection[] = [
  {
    id: 'types-of-numbers',
    eyebrow: 'Chapter 1.1',
    title: 'Types of Numbers',
    intro: 'Numbers are the language of the world. We use them every day — to tell the time, to count money, to measure distance, and to share things fairly. Students must be able to identify and list different groups of numbers.',
    keyTypes: ['Natural Numbers', 'Whole Numbers', 'Integers', 'Prime Numbers'],
    shortVideoUrl: typesOfNumbersShortUrl,
    numberGroups: [
      {
        heading: 'Natural Numbers',
        explanation: [
          'Natural numbers are the counting numbers. They are the positive whole numbers that start from 1 and continue without ending. We use them when counting real objects such as books, apples, learners in a class, or days in a week.',
          'Natural numbers do not include zero, negative numbers, fractions, or decimals. This means \\(0\\), \\(-2\\), \\(\\frac{1}{2}\\), and \\(3.5\\) are not natural numbers.',
          'The set of natural numbers is usually represented by the letter \\(N\\). We write it as \\(N = \\{1, 2, 3, 4, 5, 6, \\ldots\\}\\). The three dots mean the numbers continue forever.',
          'Every natural number is also a whole number, but not every whole number is a natural number, because whole numbers include \\(0\\) while natural numbers start at \\(1\\).'
        ],
        example: '\\(N = \\{1, 2, 3, 4, 5, 6, \\ldots\\}\\)',
        nonExample: '\\(0, -5, 1.5\\) (Zero, negative numbers, and decimals are NOT natural numbers).',
        imageSrc: naturalNumbersImage,
        imageAlt: 'A child points at three apples labelled 1, 2 and 3 to show counting numbers.'
      },
      {
        heading: 'Whole Numbers',
        explanation: [
          'Whole numbers are the natural numbers together with zero. They start from \\(0\\) and continue to the right forever: \\(0, 1, 2, 3, 4, 5, \\ldots\\).',
          'Whole numbers are useful when a quantity can be nothing or more than nothing. For example, an empty basket has \\(0\\) apples, then \\(1\\) apple, then \\(2\\) apples.',
          'Whole numbers do not include negative numbers, fractions, or decimals. So \\(-1\\), \\(2.5\\), and \\(\\frac{3}{4}\\) are not whole numbers.',
          'The important difference is this: natural numbers begin at \\(1\\), while whole numbers begin at \\(0\\).'
        ],
        example: '\\(W = \\{0, 1, 2, 3, 4, 5, \\ldots\\}\\)',
        nonExample: '\\(-2, 3.14, \\frac{1}{2}\\) (Negative numbers and fractions are NOT whole numbers).',
        imageSrc: wholeNumbersImage,
        imageAlt: 'Three bowls showing zero objects, one apple and two apples to explain whole numbers.'
      },
      {
        heading: 'Integers',
        explanation: [
          'Integers are all whole numbers and their negative opposites. They include negative numbers, zero, and positive whole numbers.',
          'Integers are used when values can go below zero, such as temperature below freezing, money owed, or floors below ground level.',
          'Integers do not include fractions or decimals. This means \\(\\frac{1}{2}\\), \\(0.75\\), and \\(4.6\\) are not integers.',
          'On a number line, integers extend forever in both directions, with \\(0\\) in the middle.'
        ],
        example: '\\(Z = \\{\\ldots, -3, -2, -1, 0, 1, 2, 3, \\ldots\\}\\)',
        nonExample: '\\(2.5, \\frac{3}{4}\\) (Decimals and fractions are NOT integers).',
        imageSrc: integersImage,
        imageAlt: 'A horizontal thermometer number line showing negative numbers, zero and positive numbers.'
      },
      {
        heading: 'Prime Numbers',
        explanation: [
          'Prime numbers are whole numbers greater than \\(1\\) that have exactly two factors: \\(1\\) and the number itself.',
          'This means a prime number cannot be divided exactly by any other whole number. For example, \\(7\\) is prime because only \\(1\\) and \\(7\\) divide into it without a remainder.',
          'The number \\(1\\) is not a prime number because it has only one factor. Numbers such as \\(4\\), \\(6\\), \\(8\\), and \\(9\\) are not prime because they have more than two factors.',
          'Prime numbers are important in mathematics because they are the building blocks used to make other whole numbers through multiplication.'
        ],
        example: '\\(P = \\{2, 3, 5, 7, 11, 13, \\ldots\\}\\)',
        nonExample: '\\(4, 6, 9\\) (These can be divided by other numbers, so they are called composite numbers).',
        imageSrc: primeNumbersImage,
        imageAlt: 'The number 7 locked with two keys labelled 1 and 7 to show prime number factors.'
      }
    ],
    diagram: {
      title: 'Diagram: The Number House',
      type: 'house',
      content: 'ROOF: INTEGERS \\((\\ldots, -2, -1, 0, 1, 2, \\ldots)\\) \n UPPER FLOOR: WHOLE NUMBERS \\((0, 1, 2, 3, \\ldots)\\) \n GROUND FLOOR (FOUNDATION): NATURAL NUMBERS \\((1, 2, 3, \\ldots)\\)',
      image: 'https://i.postimg.cc/TYGRrCSN/realnums1.png'
    },
    examples: [
      {
        question: 'Is \\(-5\\) a whole number?',
        steps: ['Whole numbers start from \\(0\\) and go upwards \\((0, 1, 2, \\ldots)\\).', 'Negative numbers are not included in the set of whole numbers.'],
        answer: 'No. \\(-5\\) is an Integer, because Whole Numbers cannot be negative.'
      }
    ],
    practiceZone: [
      'List the first five Natural Numbers.',
      'List the first five Whole Numbers.',
      'Write down three Integers that are not Whole Numbers.',
      'Is \\(0\\) a Natural Number or a Whole Number?',
      'Name two Prime Numbers between \\(1\\) and \\(10\\).',
      'Is \\(-3\\) a Natural Number? Explain your answer.',
      'Sort these numbers into Natural, Whole, or Integer: \\(-2, 0, 7, -10, 1\\).'
    ]
  },
  {
    id: 'factors-multiples',
    eyebrow: 'Chapter 1.2',
    title: 'Factors and Multiples (HCF & LCM)',
    intro: 'Every whole number is connected to other numbers through multiplication and division. In this chapter, students learn to find Factors, Multiples, the Highest Common Factor (HCF), and the Lowest Common Multiple (LCM) — skills used constantly in fractions, ratios, and simplifying.',
    keyTypes: ['Factors', 'Multiples', 'HCF', 'LCM'],
    numberGroups: [
      {
        heading: 'Factors',
        explanation: [
          'A factor is a whole number that divides exactly into another number, leaving no remainder. Factors always come in pairs that multiply together to make the original number.',
          'To find all the factors of a number, we test whole numbers starting from \\(1\\) and check which ones divide in evenly. For \\(12\\), we check \\(1, 2, 3, 4\\ldots\\) and stop once the pairs start repeating.',
          'Every number has at least two factors: \\(1\\) and itself. Numbers with exactly two factors are Prime Numbers, and numbers with more than two factors are Composite Numbers.',
          'Factors are always less than or equal to the number itself, and there is a limited (finite) list of them.'
        ],
        example: '\\(12 = 1 \\times 12,\\ 2 \\times 6,\\ 3 \\times 4\\)',
        nonExample: '\\(5\\) is NOT a factor of \\(12\\), because \\(12 \\div 5\\) leaves a remainder.',
        imageSrc: factorsExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to find the factors of 12 using the rainbow method.'
      },
      {
        heading: 'Multiples',
        explanation: [
          'A multiple is the answer you get when you multiply a number by any whole number \\(1, 2, 3, 4, \\ldots\\). Multiples of a number are found in its times table.',
          'Unlike factors, multiples of a number never stop — they continue forever, getting bigger and bigger. For example, the multiples of \\(4\\) are \\(4, 8, 12, 16, 20, \\ldots\\)',
          'Every number is a multiple of itself and of \\(1\\). A multiple is always greater than or equal to the original number.',
          'Multiples and factors are opposites: if \\(3\\) is a factor of \\(12\\), then \\(12\\) is a multiple of \\(3\\).'
        ],
        example: 'Multiples of \\(5\\): \\(5, 10, 15, 20, 25, \\ldots\\)',
        nonExample: '\\(13\\) is NOT a multiple of \\(5\\), because \\(5\\) does not divide into it evenly.',
        imageSrc: multiplesExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to find the multiples of 5 on a number line.'
      },
      {
        heading: 'Highest Common Factor (HCF)',
        explanation: [
          'The Highest Common Factor (HCF) of two or more numbers is the largest number that divides exactly into all of them.',
          'To find the HCF, list the factors of each number, identify the factors they share (Common Factors), then pick the biggest one.',
          'For larger numbers, Factor Trees (breaking a number down into prime factors) are faster than listing every factor.',
          'The HCF is useful for simplifying fractions to their lowest terms and for sharing items into equal groups.'
        ],
        example: 'HCF of \\(12\\) and \\(18\\) is \\(6\\)',
        nonExample: '\\(2\\) is a common factor of \\(12\\) and \\(18\\), but it is NOT the highest one.',
        imageSrc: hcfExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to find the HCF of 12 and 18 using a Venn diagram.'
      },
      {
        heading: 'Lowest Common Multiple (LCM)',
        explanation: [
          'The Lowest Common Multiple (LCM) of two or more numbers is the smallest number that appears in the multiples list of all of them.',
          'To find the LCM, list the multiples of each number until a number appears in both lists, then pick the smallest one that matches.',
          'The LCM is essential for adding and subtracting fractions with different denominators, and for solving problems involving repeating events.',
          'A quick check: multiplying the HCF and LCM of two numbers together always gives the same result as multiplying the two original numbers together.'
        ],
        example: 'LCM of \\(4\\) and \\(6\\) is \\(12\\)',
        nonExample: '\\(24\\) is a common multiple of \\(4\\) and \\(6\\), but it is NOT the lowest one.',
        imageSrc: lcmExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to find the LCM of 4 and 6 using stacked number lines.'
      }
    ],
    diagram: {
      title: 'Finding the HCF and LCM using Factor Trees',
      type: 'rainbow',
      content: '\\(36 = 2 \\times 2 \\times 3 \\times 3\\) | \\(48 = 2 \\times 2 \\times 2 \\times 2 \\times 3\\)',
      image: hcfDiagramImage
    },
    method: [
      {
        title: 'Step-by-Step: Finding the HCF using Factor Trees',
        steps: [
          'Break each number down into its prime factors using a Factor Tree.',
          'Write each number as a multiplication of primes (e.g. \\(12 = 2 \\times 2 \\times 3\\)).',
          'Circle the prime factors that appear in BOTH trees.',
          'Multiply the circled (common) primes together to get the HCF.'
        ]
      },
      {
        title: 'Step-by-Step: Finding the LCM using Factor Trees',
        steps: [
          'Break each number down into its prime factors using a Factor Tree.',
          'List every prime factor that appears in either number.',
          'For any prime that appears in both, use it the highest number of times it appears in either tree.',
          'Multiply all of these primes together to get the LCM.'
        ]
      }
    ],
    videoUrl: hcfLcmVideoUrl,
    videoCaption: 'Watch: How To Find The LCM and HCF Quickly',
    examples: [
      {
        question: 'Find the HCF of \\(12\\) and \\(18\\).',
        steps: [
          'Factors of \\(12\\): \\(1, 2, 3, 4, 6, 12\\)',
          'Factors of \\(18\\): \\(1, 2, 3, 6, 9, 18\\)',
          'Common Factors: \\(1, 2, 3, 6\\)'
        ],
        answer: 'The highest number they share is \\(6\\). So the HCF of \\(12\\) and \\(18\\) is \\(6\\).'
      },
      {
        question: 'Find the LCM of \\(4\\) and \\(6\\).',
        steps: [
          'Multiples of \\(4\\): \\(4, 8, 12, 16, 20, \\ldots\\)',
          'Multiples of \\(6\\): \\(6, 12, 18, 24, \\ldots\\)',
          'The smallest number in both lists is \\(12\\).'
        ],
        answer: 'The LCM of \\(4\\) and \\(6\\) is \\(12\\).'
      },
      {
        question: 'Find the HCF of \\(36\\) and \\(48\\) using Factor Trees.',
        steps: [
          '\\(36 = 2 \\times 2 \\times 3 \\times 3\\)',
          '\\(48 = 2 \\times 2 \\times 2 \\times 2 \\times 3\\)',
          'Common primes: \\(2, 2, 3\\)',
          'Multiply the common primes: \\(2 \\times 2 \\times 3 = 12\\)'
        ],
        answer: 'The HCF of \\(36\\) and \\(48\\) is \\(12\\).'
      },
      {
        question: 'Three bells ring every \\(8\\), \\(12\\), and \\(20\\) minutes. If they all ring together at 12:00, when will they next ring together?',
        steps: [
          '\\(8 = 2 \\times 2 \\times 2\\)',
          '\\(12 = 2 \\times 2 \\times 3\\)',
          '\\(20 = 2 \\times 2 \\times 5\\)',
          'Take the highest power of each prime: \\(2 \\times 2 \\times 2 \\times 3 \\times 5 = 120\\)'
        ],
        answer: 'The LCM is \\(120\\) minutes, so all three bells ring together again after \\(120\\) minutes (2 hours), at 2:00.'
      }
    ],
    practiceZone: [
      'List all the factors of \\(20\\).',
      'List all the factors of \\(30\\).',
      'Find the HCF of \\(20\\) and \\(30\\).',
      'List the first five multiples of \\(4\\).',
      'List the first five multiples of \\(6\\).',
      'Find the LCM of \\(4\\) and \\(6\\).',
      'Draw a Rainbow Method diagram for the factors of \\(16\\).',
      'Find the HCF of \\(15\\) and \\(25\\).',
      'Use Factor Trees to find the HCF of \\(24\\) and \\(60\\).',
      'Use Factor Trees to find the LCM of \\(9\\) and \\(15\\).',
      'Two ropes measuring \\(18\\text{m}\\) and \\(24\\text{m}\\) must be cut into equal pieces with no rope left over. What is the longest possible length of each piece?',
      'Find the HCF and LCM of \\(15\\), \\(20\\), and \\(30\\) (three numbers at once).',
      'Explain, in your own words, why the HCF of two numbers can never be bigger than the smaller of the two numbers.'
    ]
  },
  {
    id: 'directed-numbers',
    eyebrow: 'Chapter 1.3',
    title: 'Directed Numbers (Positive & Negative)',
    intro: 'Directed numbers are numbers that have a direction as well as a size — positive numbers point one way, negative numbers point the other. Students must learn how to add, subtract, multiply, and divide with them, since they appear constantly in money, temperature, height, and time problems.',
    keyTypes: ['Adding Directed Numbers', 'Subtracting Directed Numbers', 'Multiplying Directed Numbers', 'Dividing Directed Numbers'],
    numberGroups: [
      {
        heading: 'Adding Directed Numbers',
        explanation: [
          'Adding a positive number always moves you to the right on the number line — the total gets bigger. Adding a negative number moves you to the left — the total gets smaller.',
          'When the two numbers have the SAME sign, add their sizes together and keep that sign. For example, \\(-3 + (-4)\\) means moving left twice, giving \\(-7\\).',
          'When the two numbers have DIFFERENT signs, find the difference between their sizes, and keep the sign of the bigger one. For example, \\(-7 + 3\\) gives \\(-4\\), because \\(7\\) is bigger than \\(3\\) and its sign is negative.',
          'A helpful way to picture this is a bank account: adding a positive number is like depositing money, and adding a negative number is like a bill or a debt being added.'
        ],
        example: '\\(-3 + (-4) = -7,\\quad -7 + 3 = -4\\)',
        nonExample: '\\(-7 + 3 \\ne -10\\) (Different signs are NOT simply added together like same signs).',
        imageSrc: addingDirectedExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to add directed numbers using a number line.'
      },
      {
        heading: 'Subtracting Directed Numbers',
        explanation: [
          'Subtracting a number is the same as adding its opposite. This is the single most important rule in this section: "minus a minus" becomes "plus".',
          'To subtract a positive number, move left, exactly like normal subtraction: \\(5 - 8 = -3\\).',
          'To subtract a negative number, the two negative signs cancel and become a positive, so you move right instead. For example, \\(5 - (-8)\\) becomes \\(5 + 8 = 13\\).',
          'This rule explains why the temperature difference between \\(-2^\\circ\\text{C}\\) and \\(6^\\circ\\text{C}\\) is found using \\(6 - (-2) = 6 + 2 = 8\\) degrees.'
        ],
        example: '\\(5 - (-8) = 5 + 8 = 13\\)',
        nonExample: '\\(5 - (-8) \\ne -3\\) (A double negative does NOT stay negative — it becomes a positive).',
        imageSrc: subtractingDirectedExplainerImage,
        imageAlt: 'Step-by-step diagram showing how subtracting a negative number becomes addition.'
      },
      {
        heading: 'Multiplying Directed Numbers',
        explanation: [
          'When multiplying two directed numbers, first multiply the sizes as normal, then work out the sign separately using a simple rule.',
          'If both numbers have the SAME sign (both positive or both negative), the answer is POSITIVE. For example, \\((-3) \\times (-4) = 12\\).',
          'If the numbers have DIFFERENT signs (one positive, one negative), the answer is NEGATIVE. For example, \\((-3) \\times 4 = -12\\).',
          'A quick way to remember it: "same signs make a positive, different signs make a negative" — this rule works for both multiplication and division.'
        ],
        example: '\\((-3) \\times (-4) = 12,\\quad (-3) \\times 4 = -12\\)',
        nonExample: '\\((-3) \\times (-4) \\ne -12\\) (Two negative numbers multiplied together do NOT give a negative answer).',
        imageSrc: multiplyingDirectedExplainerImage,
        imageAlt: 'Step-by-step diagram showing the sign rule for multiplying directed numbers.',
        videoUrl: multiplyingPositiveNegativeNumbersVideoUrl,
        videoCaption: 'Watch: Multiplying Positive and Negative Numbers'
      },
      {
        heading: 'Dividing Directed Numbers',
        explanation: [
          'Dividing directed numbers uses exactly the same sign rule as multiplying: work out the size first, then decide the sign separately.',
          'If both numbers have the SAME sign, the answer is POSITIVE. For example, \\((-12) \\div (-3) = 4\\).',
          'If the numbers have DIFFERENT signs, the answer is NEGATIVE. For example, \\(12 \\div (-3) = -4\\).',
          'This rule matters when sharing a debt equally: if a group owes \\(-\\$20\\) between \\(4\\) people, each person\'s share is \\(-20 \\div 4 = -\\$5\\).'
        ],
        example: '\\((-12) \\div (-3) = 4,\\quad 12 \\div (-3) = -4\\)',
        nonExample: '\\(12 \\div (-3) \\ne 4\\) (One negative and one positive number do NOT give a positive answer).',
        imageSrc: dividingDirectedExplainerImage,
        imageAlt: 'Step-by-step diagram showing the sign rule for dividing directed numbers.',
        videos: [
          {
            url: dividingIntegersDifferentSignsTilesVideoUrl,
            caption: 'Watch: Dividing Integers Using Tiles - Different Signs'
          },
          {
            url: dividingIntegersNegativeSignsNumberLineVideoUrl,
            caption: 'Watch: Dividing Integers Using a Number Line - Both Signs Negative'
          }
        ]
      }
    ],
    diagram: {
      title: 'The Number Line',
      type: 'line',
      content: '\\(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5\\) (Left is negative, Right is positive)'
    },
    context: 'Think of a Thermometer or a Bank Account balance. If you have \\$10 and spend \\$15, you have \\(-\\$5\\). That \\(-\\$5\\) is a debt — you owe money.',
    method: [
      {
        title: 'The Golden Rule for Add/Subtract',
        steps: [
          'Same signs: add the sizes and keep the sign.',
          'Different signs: subtract the sizes and keep the sign of the bigger number.',
          'A minus followed by a minus becomes a plus: \\(a - (-b) = a + b\\).'
        ]
      },
      {
        title: 'The Golden Rule for Multiply/Divide',
        steps: [
          'Same signs (\\(+\\times+\\) or \\(-\\times-\\)) give a POSITIVE answer.',
          'Different signs (\\(+\\times-\\) or \\(-\\times+\\)) give a NEGATIVE answer.',
          'Work out the size first, then apply the sign rule last.'
        ]
      }
    ],
    videoUrl: directedNumbersVideoUrl,
    videoCaption: 'Watch: Adding and Subtracting Integers Using a Simple Method',
    examples: [
      {
        question: 'You have \\$10 in your bank account. You spend \\$15.',
        steps: ['Start at \\(10\\).', 'Move \\(15\\) places to the left.', '\\(\\$10 - \\$15 = -\\$5\\)'],
        answer: 'This means you now owe \\$5 (you are in debt).'
      },
      {
        question: 'Work out \\(-6 - (-9)\\).',
        steps: [
          'Spot the double negative: minus a minus becomes plus.',
          'Rewrite as \\(-6 + 9\\).',
          'Different signs, so subtract the sizes: \\(9 - 6 = 3\\), keep the sign of the bigger number \\((+9)\\).'
        ],
        answer: '\\(-6 - (-9) = 3\\)'
      },
      {
        question: 'Work out \\((-5) \\times (-6) \\div (-3)\\).',
        steps: [
          'First multiply: \\((-5) \\times (-6)\\) — same signs, so the answer is positive: \\(30\\).',
          'Then divide: \\(30 \\div (-3)\\) — different signs, so the answer is negative.',
          '\\(30 \\div (-3) = -10\\)'
        ],
        answer: '\\((-5) \\times (-6) \\div (-3) = -10\\)'
      },
      {
        question: 'The temperature at midnight was \\(-8^\\circ\\text{C}\\). By midday it had risen by \\(15^\\circ\\text{C}\\), but then dropped by \\(4^\\circ\\text{C}\\) by evening. What was the evening temperature?',
        steps: [
          'Start at \\(-8\\).',
          'Rise by \\(15\\): \\(-8 + 15 = 7\\).',
          'Drop by \\(4\\): \\(7 - 4 = 3\\).'
        ],
        answer: 'The evening temperature was \\(3^\\circ\\text{C}\\).'
      }
    ],
    practiceZone: [
      'Use the number line to work out: \\(-3 + 5\\)',
      'Use the number line to work out: \\(2 - 6\\)',
      'You have \\$20 and you spend \\$25. What is your new balance?',
      'The temperature is \\(-4^\\circ\\text{C}\\) and it rises by \\(6^\\circ\\text{C}\\). What is the new temperature?',
      'Work out: \\(-7 + (-2)\\)',
      'Work out: \\(8 - (-3)\\)',
      'Is \\(-10\\) greater than or less than \\(-2\\)? Use the number line to explain.',
      'Work out: \\((-9) \\times (-2)\\)',
      'Work out: \\(18 \\div (-6)\\)',
      'Work out: \\((-4) \\times 5 \\div (-2)\\)',
      'A submarine is at \\(-120\\text{m}\\). It rises by \\(45\\text{m}\\). What is its new depth?',
      'Explain, in your own words, why subtracting a negative number is the same as adding a positive number.'
    ]
  },
  {
    id: 'trio',
    eyebrow: 'Chapter 1.4',
    title: 'Fractions, Decimals, and Percentages',
    intro: 'Fractions, decimals, and percentages are three different ways of writing the exact same amount. Students must learn how to convert freely between this "Trio", since real-life problems mix all three — a discount might be given as a percentage, a measurement as a decimal, and a recipe as a fraction.',
    keyTypes: ['Fraction → Decimal', 'Decimal → Percentage', 'Percentage → Fraction', 'Comparing the Trio'],
    numberGroups: [
      {
        heading: 'Fraction to Decimal',
        explanation: [
          'A fraction shows a part of a whole using a numerator (top number) and a denominator (bottom number). To convert it into a decimal, simply divide the numerator by the denominator.',
          'For example, \\(\\frac{3}{4}\\) means \\(3 \\div 4\\), which gives \\(0.75\\).',
          'Some fractions divide evenly and stop (terminating decimals, like \\(0.75\\)), while others repeat forever (recurring decimals, like \\(\\frac{1}{3} = 0.333\\ldots\\)).',
          'A quick shortcut: fractions with a denominator of \\(10\\), \\(100\\), or \\(1000\\) can be converted just by moving the decimal point — \\(\\frac{7}{100} = 0.07\\).'
        ],
        example: '\\(\\frac{3}{4} = 3 \\div 4 = 0.75\\)',
        nonExample: '\\(\\frac{3}{4} \\ne 0.34\\) (Do NOT just write the numerator and denominator next to each other).',
        imageSrc: fractionToDecimalExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to convert a fraction into a decimal by dividing.'
      },
      {
        heading: 'Decimal to Percentage',
        explanation: [
          'A percentage means "out of 100" — the symbol \\(\\%\\) literally replaces the words "divided by 100".',
          'To convert a decimal into a percentage, multiply it by \\(100\\), which simply moves the decimal point two places to the right.',
          'For example, \\(0.25 \\times 100 = 25\\), so \\(0.25 = 25\\%\\).',
          'This also works in reverse: to turn a percentage back into a decimal, divide by \\(100\\) (move the decimal point two places left). So \\(25\\% = 0.25\\).'
        ],
        example: '\\(0.25 \\times 100 = 25\\%\\)',
        nonExample: '\\(0.25 \\ne 0.25\\%\\) (Forgetting to multiply by \\(100\\) gives the wrong percentage).',
        imageSrc: decimalToPercentageExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to convert a decimal into a percentage by moving the decimal point.'
      },
      {
        heading: 'Percentage to Fraction',
        explanation: [
          'Since a percentage means "out of 100", any percentage can be written directly as a fraction over \\(100\\).',
          'For example, \\(40\\%\\) means \\(\\frac{40}{100}\\).',
          'Once written as a fraction, always simplify it by dividing the top and bottom by their Highest Common Factor. \\(\\frac{40}{100}\\) simplifies to \\(\\frac{2}{5}\\) because the HCF of \\(40\\) and \\(100\\) is \\(20\\).',
          'This connects directly back to Chapter 1.2 — simplifying the Trio always relies on finding the HCF.'
        ],
        example: '\\(40\\% = \\frac{40}{100} = \\frac{2}{5}\\)',
        nonExample: '\\(40\\% \\ne \\frac{40}{100}\\) left unsimplified (Always reduce the fraction to its lowest terms).',
        imageSrc: percentageToFractionExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to convert a percentage into a simplified fraction using the HCF.'
      },
      {
        heading: 'Comparing the Trio',
        explanation: [
          'To compare numbers written in different forms (a fraction, a decimal, and a percentage), first convert them all into the SAME form — decimals are usually easiest for comparing.',
          'For example, to compare \\(0.6\\) and \\(55\\%\\), convert the percentage to a decimal first: \\(55\\% = 0.55\\). Since \\(0.6 > 0.55\\), we know \\(0.6\\) is bigger.',
          'A common mistake is comparing the numbers without converting first — comparing \\(0.6\\) and \\(55\\) directly would wrongly suggest \\(55\\) is bigger.',
          'This skill is essential for real situations like comparing discounts, exam scores, or ingredient proportions given in different formats.'
        ],
        example: '\\(0.6\\) vs \\(55\\%\\): convert to \\(0.6\\) vs \\(0.55\\), so \\(0.6\\) is bigger.',
        nonExample: 'Comparing \\(0.6\\) directly to \\(55\\) (without converting) gives a WRONG comparison.',
        imageSrc: comparingTrioExplainerImage,
        imageAlt: 'A number line comparing zero point six and fifty-five percent after converting to the same form.'
      }
    ],
    diagram: {
      title: 'The Conversion Triangle',
      type: 'triangle',
      content: 'TOP: Fractions | LEFT: Decimals | RIGHT: Percentages. Arrows show how to move between them (e.g., divide numerator by denominator).'
    },
    method: [
      {
        title: 'The Three Golden Rules',
        steps: [
          'Fraction → Decimal: divide the numerator by the denominator.',
          'Decimal → Percentage: multiply by \\(100\\) (move the decimal point two places right).',
          'Percentage → Fraction: write it over \\(100\\), then simplify using the HCF.'
        ]
      }
    ],
    examples: [
      {
        question: '\\(25\\) out of \\(100\\) squares are shaded in a grid.',
        steps: [
          'Fraction: \\(\\frac{25}{100} = \\frac{1}{4}\\)',
          'Decimal: \\(0.25\\)',
          'Percentage: \\(25\\%\\)'
        ],
        answer: 'The representation is \\(\\frac{1}{4}\\), \\(0.25\\), and \\(25\\%\\).'
      },
      {
        question: 'Convert \\(\\frac{7}{8}\\) into a decimal and a percentage.',
        steps: [
          'Divide: \\(7 \\div 8 = 0.875\\)',
          'Multiply by \\(100\\): \\(0.875 \\times 100 = 87.5\\)'
        ],
        answer: '\\(\\frac{7}{8} = 0.875 = 87.5\\%\\)'
      },
      {
        question: 'Convert \\(65\\%\\) into a fraction in its simplest form.',
        steps: [
          'Write over \\(100\\): \\(\\frac{65}{100}\\)',
          'Find the HCF of \\(65\\) and \\(100\\): it is \\(5\\)',
          'Divide top and bottom by \\(5\\): \\(\\frac{13}{20}\\)'
        ],
        answer: '\\(65\\% = \\frac{13}{20}\\)'
      },
      {
        question: 'A shop offers \\(30\\%\\) off, another offers \\(\\frac{1}{4}\\) off, and a third offers \\(0.28\\) off. Which discount is the biggest?',
        steps: [
          'Convert all three into decimals: \\(30\\% = 0.30\\), \\(\\frac{1}{4} = 0.25\\), and \\(0.28\\) stays as is.',
          'Compare: \\(0.30 > 0.28 > 0.25\\)'
        ],
        answer: 'The \\(30\\%\\) discount is the biggest.'
      }
    ],
    practiceZone: [
      'Shade \\(50\\) squares out of \\(100\\) on a grid. What fraction, decimal, and percentage does this show?',
      'Convert \\(\\frac{1}{2}\\) into a decimal and a percentage.',
      'Convert \\(0.75\\) into a fraction and a percentage.',
      'Convert \\(40\\%\\) into a fraction and a decimal.',
      'Convert \\(\\frac{3}{10}\\) into a decimal and a percentage.',
      'Which is bigger: \\(0.6\\) or \\(55\\%\\)?',
      'Draw your own Conversion Triangle and label the arrows.',
      'Convert \\(\\frac{9}{20}\\) into a decimal and a percentage.',
      'Convert \\(84\\%\\) into a fraction in its simplest form.',
      'Arrange these from smallest to biggest: \\(0.4\\), \\(35\\%\\), \\(\\frac{1}{2}\\).',
      'A test score is \\(18\\) out of \\(25\\). Write this as a fraction, a decimal, and a percentage.',
      'Explain, in your own words, why converting to decimals is often the easiest way to compare the Trio.'
    ]
  },
  {
    id: 'bodmas',
    eyebrow: 'Chapter 1.5',
    title: 'Order of Operations (BODMAS)',
    intro: 'When a math string contains several different operations, solving it in the wrong order gives a completely different (and wrong) answer. BODMAS is a fixed set of rules that tells us exactly which operation to do first, so that everyone always gets the same, correct answer.',
    keyTypes: ['Brackets First', 'Of, Division & Multiplication', 'Addition & Subtraction', 'Mixed Operations'],
    numberGroups: [
      {
        heading: 'Brackets First',
        explanation: [
          'Brackets are always solved FIRST, no matter what is inside them or what surrounds them. They act like a "priority box" that must be emptied before anything else happens.',
          'If there are brackets inside other brackets (nested brackets), always solve the INNERMOST ones first, then work outward.',
          'For example, in \\((4 + 2) \\times 3\\), we must solve \\(4 + 2 = 6\\) inside the brackets first, before multiplying by \\(3\\).',
          'Ignoring the brackets and solving left to right instead would give a completely different, incorrect answer.'
        ],
        example: '\\((4 + 2) \\times 3 = 6 \\times 3 = 18\\)',
        nonExample: '\\(4 + 2 \\times 3 = 4 + 6 = 10\\) (Without brackets, multiplication happens first — a DIFFERENT answer).',
        imageSrc: bracketsFirstExplainerImage,
        imageAlt: 'Step-by-step diagram showing why brackets are always solved first in BODMAS.'
      },
      {
        heading: 'Of, Division & Multiplication',
        explanation: [
          'After brackets, "Of" (meaning multiplication, e.g. "half OF 20"), Division, and Multiplication are all solved together, working strictly from LEFT to RIGHT.',
          'A common misunderstanding is that ALL multiplication must happen before ALL division — this is FALSE. They have equal priority and are done in the order they appear, left to right.',
          'For example, in \\(20 \\div 4 \\times 2\\), we do the division first only because it appears first: \\(20 \\div 4 = 5\\), then \\(5 \\times 2 = 10\\).',
          'This is one of the most common sources of errors in BODMAS, so always check which one appears first in the string.'
        ],
        example: '\\(20 \\div 4 \\times 2 = 5 \\times 2 = 10\\)',
        nonExample: '\\(20 \\div (4 \\times 2) = 20 \\div 8 = 2.5\\) (Doing multiplication first here is WRONG, since division appears first).',
        imageSrc: ofDivisionMultiplicationExplainerImage,
        imageAlt: 'Step-by-step diagram showing division and multiplication solved left to right in BODMAS.'
      },
      {
        heading: 'Addition & Subtraction',
        explanation: [
          'Addition and Subtraction are always done LAST, after brackets, of/division/multiplication have all been completed.',
          'Just like division and multiplication, Addition and Subtraction have EQUAL priority to each other, and must be solved strictly from LEFT to RIGHT, not "all addition first".',
          'For example, in \\(10 - 4 + 3\\), we subtract first only because it comes first: \\(10 - 4 = 6\\), then \\(6 + 3 = 9\\).',
          'Doing all the addition before the subtraction (or vice versa) without checking the order they appear in is a common mistake that gives the wrong answer.'
        ],
        example: '\\(10 - 4 + 3 = 6 + 3 = 9\\)',
        nonExample: '\\(10 - (4 + 3) = 10 - 7 = 3\\) (Adding first here is WRONG, since subtraction appears first).',
        imageSrc: additionSubtractionExplainerImage,
        imageAlt: 'Step-by-step diagram showing addition and subtraction solved left to right in BODMAS.'
      },
      {
        heading: 'Mixed Operations',
        explanation: [
          'Real exam questions usually mix all the operations together in one long string, so BODMAS must be applied in full, one step at a time, working through the whole priority order.',
          'The safest method is to rewrite the calculation after every single step, rather than trying to do it all in your head at once.',
          'For example, in \\(6 \\times 2 + 8 \\div 4\\), we first solve BOTH the multiplication and division (since they share top priority), working left to right: \\(6 \\times 2 = 12\\) and \\(8 \\div 4 = 2\\). Only then do we add: \\(12 + 2 = 14\\).',
          'A useful check: circle every bracket, box every multiplication/division, and underline every addition/subtraction before starting — this visually confirms the correct order.'
        ],
        example: '\\(6 \\times 2 + 8 \\div 4 = 12 + 2 = 14\\)',
        nonExample: '\\(6 \\times (2 + 8) \\div 4 = 6 \\times 10 \\div 4 = 15\\) (Adding \\(2 + 8\\) first here is WRONG unless brackets are actually present).',
        imageSrc: mixedOperationsExplainerImage,
        imageAlt: 'Step-by-step diagram showing a full mixed BODMAS calculation solved in the correct order.'
      }
    ],
    method: [
      {
        title: 'BODMAS Definition',
        steps: [
          'B - Brackets',
          'O - Of (Multiplication)',
          'D - Division',
          'M - Multiplication',
          'A - Addition',
          'S - Subtraction'
        ]
      },
      {
        title: 'The Golden Rule',
        steps: [
          'Brackets are always solved first, innermost first if nested.',
          'Of, Division, and Multiplication share equal priority — solve left to right.',
          'Addition and Subtraction share equal priority — solve left to right, done last.'
        ]
      }
    ],
    examples: [
      {
        question: 'Work out: \\(2 + 3 \\times 4\\)',
        steps: [
          'Wrong way: \\(2 + 3 = 5\\), then \\(5 \\times 4 = 20\\).',
          'BODMAS way: \\(3 \\times 4 = 12\\) first.',
          'Then \\(2 + 12 = 14\\).'
        ],
        answer: 'The correct answer is \\(14\\).'
      },
      {
        question: 'Work out: \\(18 \\div 3 \\times 2\\)',
        steps: [
          'Division and multiplication share equal priority, so work left to right.',
          '\\(18 \\div 3 = 6\\) (division appears first)',
          '\\(6 \\times 2 = 12\\)'
        ],
        answer: 'The correct answer is \\(12\\).'
      },
      {
        question: 'Work out: \\((5 + 3) \\times (10 - 6) \\div 4\\)',
        steps: [
          'Solve both brackets first: \\(5 + 3 = 8\\) and \\(10 - 6 = 4\\).',
          'Rewrite: \\(8 \\times 4 \\div 4\\)',
          'Multiplication and division share equal priority, left to right: \\(8 \\times 4 = 32\\), then \\(32 \\div 4 = 8\\).'
        ],
        answer: 'The correct answer is \\(8\\).'
      },
      {
        question: 'Work out: \\(15 - 2 \\times (4 + 1) \\div 5\\)',
        steps: [
          'Solve the bracket first: \\(4 + 1 = 5\\)',
          'Rewrite: \\(15 - 2 \\times 5 \\div 5\\)',
          'Multiplication and division, left to right: \\(2 \\times 5 = 10\\), then \\(10 \\div 5 = 2\\)',
          'Rewrite: \\(15 - 2\\)'
        ],
        answer: 'The correct answer is \\(13\\).'
      }
    ],
    practiceZone: [
      'Work out: \\(5 + 2 \\times 3\\)',
      'Work out: \\((4 + 2) \\times 3\\)',
      'Work out: \\(20 - 4 \\div 2\\)',
      'Work out: \\(6 \\times 2 + 8 \\div 4\\)',
      'Work out: \\((10 - 4) \\times (3 + 1)\\)',
      'Explain why BODMAS gives a different answer from solving left to right.',
      'Work out: \\(24 \\div 6 \\times 2\\)',
      'Work out: \\(30 - 5 \\times (2 + 2)\\)',
      'Work out: \\((6 + 4) \\div 2 \\times 3\\)',
      'Work out: \\(50 \\div (5 + 5) + 3 \\times 2\\)',
      'Insert brackets into \\(2 + 3 \\times 4 - 1\\) so that the answer becomes \\(19\\).',
      'Explain why Division and Multiplication are said to have "equal priority" instead of Division always coming before Multiplication.'
    ]
  },
  {
    id: 'approximation',
    eyebrow: 'Chapter 1.6',
    title: 'Approximation (Rounding Off)',
    intro: 'Rounding off means replacing an exact number with a simpler, nearby number that is easier to work with. Students must learn how to round to the nearest 10, 100, 1000, and to a given number of decimal places — a skill used constantly for estimating, checking answers, and reporting figures like money or population sizes.',
    keyTypes: ['Rounding to 10, 100, 1000', 'Rounding to Decimal Places', 'Rounding to Significant Figures', 'Estimating with Rounding'],
    numberGroups: [
      {
        heading: 'Rounding to 10, 100, or 1000',
        explanation: [
          'To round a whole number to the nearest \\(10\\), \\(100\\), or \\(1000\\), look at the digit immediately to the RIGHT of the place value you are rounding to.',
          'If that digit is \\(0, 1, 2, 3,\\) or \\(4\\), round DOWN — the digit you are rounding stays the same, and everything to its right becomes zero.',
          'If that digit is \\(5, 6, 7, 8,\\) or \\(9\\), round UP — the digit you are rounding increases by one, and everything to its right becomes zero.',
          'For example, to round \\(452\\) to the nearest \\(100\\), we look at the tens digit \\(5\\). Since \\(5\\) rounds up, \\(452\\) becomes \\(500\\).'
        ],
        example: '\\(452\\) rounded to the nearest \\(100\\) is \\(500\\)',
        nonExample: '\\(452\\) rounded to the nearest \\(100\\) is NOT \\(400\\) (the tens digit \\(5\\) means we round UP, not down).',
        imageSrc: rounding10100_1000ExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to round 452 to the nearest 100 using the rounding hill.'
      },
      {
        heading: 'Rounding to Decimal Places',
        explanation: [
          'Rounding to a number of decimal places (d.p.) means keeping only that many digits after the decimal point.',
          'To round to \\(1\\) decimal place, look at the SECOND decimal digit to decide whether to round the first digit up or down.',
          'For example, to round \\(4.67\\) to \\(1\\) decimal place, look at the second digit \\(7\\). Since \\(7\\) rounds up, the first digit \\(6\\) becomes \\(7\\), giving \\(4.7\\).',
          'The same rule extends to \\(2\\) or more decimal places — always look at the digit just after the last one you are keeping.'
        ],
        example: '\\(4.67\\) rounded to \\(1\\) decimal place is \\(4.7\\)',
        nonExample: '\\(4.67\\) rounded to \\(1\\) decimal place is NOT \\(4.6\\) (the second decimal digit \\(7\\) means we round UP).',
        imageSrc: roundingDecimalPlacesExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to round 4.67 to 1 decimal place.'
      },
      {
        heading: 'Rounding to Significant Figures',
        explanation: [
          'A significant figure (s.f.) is any digit that contributes to how precise a number is. Counting starts from the first non-zero digit, reading left to right.',
          'Zeros between other digits ARE significant (e.g. in \\(304\\), all three digits count). Leading zeros before the first non-zero digit are NEVER significant (e.g. in \\(0.0056\\), only \\(5\\) and \\(6\\) count).',
          'To round to a given number of significant figures, count that many significant digits from the left, then apply the normal rounding rule to the next digit.',
          'For example, \\(3847\\) rounded to \\(2\\) significant figures looks at the first two digits (\\(3\\) and \\(8\\)), then rounds based on the third digit (\\(4\\)), giving \\(3800\\).'
        ],
        example: '\\(3847\\) rounded to \\(2\\) significant figures is \\(3800\\)',
        nonExample: '\\(3847\\) rounded to \\(2\\) significant figures is NOT \\(38\\) (the place value must be kept — trailing digits become zero, not disappear).',
        imageSrc: roundingSignificantFiguresExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to round 3847 to 2 significant figures.'
      },
      {
        heading: 'Estimating with Rounding',
        explanation: [
          'Estimation uses rounding to quickly check whether an answer is reasonable, without doing the full exact calculation.',
          'The usual method is to round every number in the problem to \\(1\\) significant figure first, then perform the simpler calculation.',
          'For example, to estimate \\(48 \\times 22\\), round each number to \\(1\\) significant figure: \\(48 \\to 50\\) and \\(22 \\to 20\\), giving an estimate of \\(50 \\times 20 = 1000\\) (the exact answer is \\(1056\\), so the estimate is reasonable).',
          'Estimating BEFORE calculating helps catch mistakes — if your exact answer is very far from your estimate, you likely made an error somewhere.'
        ],
        example: 'Estimate for \\(48 \\times 22\\): \\(50 \\times 20 = 1000\\)',
        nonExample: 'Estimating \\(48 \\times 22\\) as \\(48 \\times 22\\) worked out in full is NOT an estimate — it defeats the purpose of a quick check.',
        imageSrc: estimatingRoundingExplainerImage,
        imageAlt: 'Step-by-step diagram showing how to estimate 48 times 22 by rounding to 1 significant figure.'
      }
    ],
    diagram: {
      title: 'The Rounding Hill',
      type: 'hill',
      content: '\\(0, 1, 2, 3, 4\\): Stay on ground (Round DOWN) | \\(5, 6, 7, 8, 9\\): Push over hill (Round UP)'
    },
    method: [
      {
        title: 'The Golden Rule',
        steps: [
          'Identify the place value or decimal position you are rounding to.',
          'Look at the very next digit to its right.',
          '\\(0\\)-\\(4\\): round down (keep the digit, zero out the rest). \\(5\\)-\\(9\\): round up (increase the digit by one, zero out the rest).'
        ]
      }
    ],
    examples: [
      {
        question: 'Round \\(4.67\\) to \\(1\\) decimal place.',
        steps: [
          'Look at the second decimal digit: it is \\(7\\).',
          '\\(7\\) is a "push" number according to the hill.',
          'So we round the \\(6\\) up to \\(7\\).'
        ],
        answer: '\\(4.67\\) becomes \\(4.7\\)'
      },
      {
        question: 'Round \\(6,789\\) to the nearest \\(1,000\\).',
        steps: [
          'Look at the hundreds digit: it is \\(7\\).',
          '\\(7\\) rounds up, so the thousands digit \\(6\\) becomes \\(7\\).',
          'Everything after the thousands place becomes zero.'
        ],
        answer: '\\(6,789\\) becomes \\(7,000\\)'
      },
      {
        question: 'Round \\(0.03456\\) to \\(2\\) significant figures.',
        steps: [
          'Leading zeros are not significant, so the first significant figure is \\(3\\), and the second is \\(4\\).',
          'Look at the next digit after those two: it is \\(5\\).',
          '\\(5\\) rounds up, so the \\(4\\) becomes \\(5\\).'
        ],
        answer: '\\(0.03456\\) rounded to \\(2\\) s.f. is \\(0.035\\)'
      },
      {
        question: 'Estimate the answer to \\(198 \\div 21\\) by rounding to \\(1\\) significant figure.',
        steps: [
          'Round \\(198\\) to \\(1\\) s.f.: it becomes \\(200\\).',
          'Round \\(21\\) to \\(1\\) s.f.: it becomes \\(20\\).',
          'Calculate the simpler estimate: \\(200 \\div 20 = 10\\)'
        ],
        answer: 'The estimate is \\(10\\) (the exact answer is \\(9.43\\), so this is a reasonable check).'
      }
    ],
    practiceZone: [
      'Round \\(38\\) to the nearest \\(10\\).',
      'Round \\(452\\) to the nearest \\(100\\).',
      'Round \\(6,789\\) to the nearest \\(1,000\\).',
      'Round \\(5.32\\) to \\(1\\) decimal place.',
      'Round \\(9.86\\) to \\(1\\) decimal place.',
      'Round \\(12.049\\) to \\(2\\) decimal places.',
      'Explain, using the Rounding Hill, why \\(4.5\\) rounds up to \\(5\\).',
      'Round \\(52,384\\) to \\(3\\) significant figures.',
      'Round \\(0.00789\\) to \\(1\\) significant figure.',
      'Estimate \\(312 \\times 19\\) by rounding each number to \\(1\\) significant figure.',
      'A school has \\(2,847\\) learners. Round this to the nearest \\(100\\) for a newsletter.',
      'Explain why estimating before doing an exact calculation is a useful checking habit.'
    ]
  },
  {
    id: 'number-bases',
    eyebrow: 'Chapter 1.7',
    title: 'Number Bases in Everyday Life',
    intro: 'A "base" is simply the number of units it takes before we group them into the next larger unit. We normally count in Base \\(10\\) (ten ones make a ten), but students must learn that many everyday systems — time, calendars, computers — use completely different bases.',
    keyTypes: ['Base 10 (Everyday Counting)', 'Base 60 & 24 (Time)', 'Base 12 (Dozens)', 'Base 2 (Binary)'],
    numberGroups: [
      {
        heading: 'Base 10 (Everyday Counting)',
        explanation: [
          'Base \\(10\\) is the counting system we use for almost everything — money, measurements, and general counting. It is called Base \\(10\\) because it takes \\(10\\) units before we group them into the next place value.',
          'In Base \\(10\\), each place value column (units, tens, hundreds) is worth \\(10\\) times the one before it.',
          'We likely use Base \\(10\\) because humans have \\(10\\) fingers, making it a natural counting tool historically.',
          'Understanding that \\(10\\) is just ONE possible base — not the only option — makes it easier to understand other bases used around us.'
        ],
        example: 'In Base \\(10\\): \\(10\\) units \\(= 1\\) ten, \\(10\\) tens \\(= 1\\) hundred',
        nonExample: 'Not every system groups in \\(10\\)s — time and computers use very different groupings.',
        imageSrc: base10ExplainerImage,
        imageAlt: 'Diagram showing place value columns in Base 10 grouping units into tens and hundreds.'
      },
      {
        heading: 'Base 60 & 24 (Time)',
        explanation: [
          'Telling time uses two different bases mixed together. Seconds and minutes use Base \\(60\\): it takes \\(60\\) seconds before we group them into \\(1\\) minute, and \\(60\\) minutes before we group them into \\(1\\) hour.',
          'Hours in a day use Base \\(24\\): it takes \\(24\\) hours before we group them into \\(1\\) day.',
          'Base \\(60\\) is believed to come from ancient Babylonian mathematics, and it is still used today because \\(60\\) divides evenly by many numbers (\\(2, 3, 4, 5, 6, 10, 12\\), etc.), making it convenient for splitting time into fractions.',
          'This is why "half past" or "quarter to" work so neatly with clocks, but would not work as cleanly in Base \\(10\\).'
        ],
        example: '\\(60\\) seconds \\(= 1\\) minute, \\(60\\) minutes \\(= 1\\) hour, \\(24\\) hours \\(= 1\\) day',
        nonExample: 'Time does NOT reset every \\(10\\) units the way money does — it resets every \\(60\\) (or \\(24\\) for hours).',
        imageSrc: base60_24ExplainerImage,
        imageAlt: 'Diagram showing Base 60 for seconds and minutes, and Base 24 for hours in a day.'
      },
      {
        heading: 'Base 12 (Dozens)',
        explanation: [
          'A dozen is a grouping of \\(12\\), making it Base \\(12\\). It takes \\(12\\) individual items before we group them into \\(1\\) dozen.',
          'Base \\(12\\) is common for selling eggs, buns, and other goods because \\(12\\) divides evenly into halves, thirds, quarters, and sixths (\\(6, 4, 3, 2\\)) — far more ways than \\(10\\) divides evenly.',
          'A "gross" extends this idea further: \\(12\\) dozen \\(= 144\\), forming a Base \\(12\\) system with two levels, similar to how tens and hundreds work in Base \\(10\\).',
          'For example, \\(3\\) dozen eggs means \\(3 \\times 12 = 36\\) eggs, since each "dozen" group is worth \\(12\\) units.'
        ],
        example: '\\(3\\) dozen \\(= 3 \\times 12 = 36\\) eggs',
        nonExample: '\\(3\\) dozen is NOT \\(30\\) eggs — dozens group in \\(12\\)s, not \\(10\\)s.',
        imageSrc: base12ExplainerImage,
        imageAlt: 'Diagram showing egg cartons grouped in dozens to explain Base 12.'
      },
      {
        heading: 'Base 2 (Binary)',
        explanation: [
          'Base \\(2\\), also called binary, is the number system used inside every computer and digital device. It only uses two digits: \\(0\\) and \\(1\\).',
          'In binary, each place value column is worth double the one before it: \\(1\\)s, \\(2\\)s, \\(4\\)s, \\(8\\)s, \\(16\\)s, and so on — instead of \\(1\\)s, \\(10\\)s, \\(100\\)s like in Base \\(10\\).',
          'Computers use binary because electronic circuits naturally have two states — "on" (represented as \\(1\\)) and "off" (represented as \\(0\\)) — making Base \\(2\\) a perfect match for how hardware works.',
          'For example, the binary number \\(101\\) represents \\((1 \\times 4) + (0 \\times 2) + (1 \\times 1) = 5\\) in Base \\(10\\).'
        ],
        example: 'Binary \\(101 = (1\\times4)+(0\\times2)+(1\\times1) = 5\\) in Base \\(10\\)',
        nonExample: 'Binary place values are NOT \\(1, 10, 100\\) like Base \\(10\\) — they are \\(1, 2, 4, 8, 16,\\ldots\\)',
        imageSrc: base2ExplainerImage,
        imageAlt: 'Diagram showing a binary number converted to Base 10 using place values 4, 2, and 1.'
      }
    ],
    diagram: {
      title: 'Comparison Table',
      type: 'table',
      content: 'Base \\(10\\): Units, Tens, Hundreds | Base \\(2\\): \\(1\\)s, \\(2\\)s, \\(4\\)s, \\(8\\)s'
    },
    method: [
      {
        title: 'Bases we use everyday',
        steps: [
          'Time: \\(60\\) seconds \\(= 1\\) minute (Base \\(60\\))',
          'Days: \\(24\\) hours \\(= 1\\) day (Base \\(24\\))',
          'Eggs: \\(12\\) eggs \\(= 1\\) dozen (Base \\(12\\))',
          'Computers: everything stored as \\(0\\)s and \\(1\\)s (Base \\(2\\))'
        ]
      }
    ],
    examples: [
      {
        question: 'How many eggs are in \\(3\\) dozen?',
        steps: [
          'We use Base \\(12\\) for dozens.',
          '\\(3 \\times 12 = 36\\)'
        ],
        answer: '\\(36\\) eggs.'
      },
      {
        question: 'A movie is \\(2\\) hours and \\(45\\) minutes long. How many minutes is that in total?',
        steps: [
          'Convert hours to minutes using Base \\(60\\): \\(2 \\times 60 = 120\\) minutes.',
          'Add the extra \\(45\\) minutes: \\(120 + 45 = 165\\)'
        ],
        answer: 'The movie is \\(165\\) minutes long.'
      },
      {
        question: 'Convert the binary number \\(1101\\) into Base \\(10\\).',
        steps: [
          'Place values from right to left: \\(1, 2, 4, 8\\).',
          'Multiply each binary digit by its place value: \\((1\\times8)+(1\\times4)+(0\\times2)+(1\\times1)\\)',
          '\\(8 + 4 + 0 + 1 = 13\\)'
        ],
        answer: 'Binary \\(1101 = 13\\) in Base \\(10\\).'
      }
    ],
    practiceZone: [
      'How many seconds are in \\(3\\) minutes?',
      'How many hours are in \\(2\\) days?',
      'How many eggs are in \\(2\\) dozen?',
      'What base do we use for counting hours in a day?',
      'Why do you think eggs are sold in dozens instead of tens?',
      'How many minutes are in \\(4\\) hours?',
      'Convert the binary number \\(111\\) into Base \\(10\\).',
      'Convert the binary number \\(1010\\) into Base \\(10\\).',
      'A recipe needs \\(1.5\\) dozen buns. How many individual buns is that?',
      'Explain why Base \\(60\\) is useful for splitting time into halves, thirds, and quarters, while Base \\(10\\) is not as flexible.'
    ]
  }
];

/* --------------------------- COMPONENTS --------------------------- */

const ExampleCard: React.FC<{ index: number; example: WorkedExample }> = ({ index, example }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
          {index}
        </div>
        <div className="text-slate-800 font-medium pt-1">
           <MathJax inline>{example.question}</MathJax>
        </div>
      </div>
      
      <button
        onClick={() => setOpen(!open)}
        className="w-full border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-indigo-600 hover:bg-slate-100 transition-colors flex items-center justify-between"
      >
        <span>{open ? 'Hide Worked Example' : 'Show Worked Example'}</span>
        <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
          <div className={notebookPaperClassName} style={notebookPaperStyle}>
            {example.steps.map((step, i) => (
            <div key={i} className="flex gap-2 border-b border-stone-200/70 py-2 text-sm leading-relaxed text-slate-700 last:border-0">
              <span className="shrink-0 font-semibold text-rose-400">Step {i + 1}:</span>
              <MathJax inline className="min-w-max flex-1 leading-relaxed">{step}</MathJax>
            </div>
            ))}
            <div className="border-t border-stone-200/70 pt-2 text-sm leading-relaxed">
              <span className="font-semibold text-slate-500 mr-1">Result:</span>
              <MathJax inline className="inline text-slate-900 font-medium">{example.answer}</MathJax>
            </div>
          </div>
        </div>
      )}
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
                activeId === s.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
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
  <section id={section.id} className="mb-12 scroll-mt-24">
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">{section.eyebrow}</span>
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
    </div>

    <div className="mb-6">
      {section.shortVideoUrl && (
        <div className="float-none sm:float-right sm:ml-6 mb-4 w-full sm:w-64 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-black shadow-md">
          <video
            controls
            preload="metadata"
            playsInline
            className="w-full aspect-[9/16] object-cover bg-black"
          >
            <source src={section.shortVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <p className="text-slate-700 leading-relaxed mb-6">
        <MathJax inline>{section.intro}</MathJax>
      </p>

      {section.keyTypes && (
        <div className="mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {section.keyTypes.map((type) => (
            <div key={type} className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">✓</span>
              <span>{type}</span>
            </div>
          ))}
        </div>
      )}

      {section.diagram && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 w-fit mx-auto md:mx-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
            <span className="p-1 bg-slate-200 rounded">💡</span> {section.diagram.title}
          </h4>
          {section.diagram.image ? (
            <img loading="lazy" decoding="async"
              src={section.diagram.image}
              alt={section.diagram.title}
              className="max-w-full md:max-w-lg rounded-lg"
            />
          ) : (
            <div className="text-slate-600 font-mono text-sm whitespace-pre-line leading-relaxed">
              <MathJax>{section.diagram.content}</MathJax>
            </div>
          )}
        </div>
      )}

      {section.method?.map((m, i) => (
        <div key={i} className="mb-4">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {m.title}
          </h3>
          <ul className="space-y-2 text-slate-700 ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <MathJax inline>{step}</MathJax>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {section.videoUrl && (
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
          {section.videoCaption && (
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5">
              <span className="text-sm">🎬</span>
              <span className="text-sm font-semibold text-slate-100">{section.videoCaption}</span>
            </div>
          )}
          <video
            controls
            preload="metadata"
            className="w-full max-h-[420px] bg-black"
          >
            <source src={section.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {section.numberGroups?.map((group, i) => (
          <div key={i} className="mb-8 last:mb-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-indigo-100/50 px-4 sm:px-5 py-3 border-b border-slate-200">
            <h3 className="font-bold text-lg text-indigo-900">{group.heading}</h3>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-3 text-slate-700 leading-relaxed">
              {group.explanation.map((paragraph, index) => (
                <p key={paragraph}>
                  {index === 0 && (
                    <strong className="text-slate-900 font-semibold mr-1">What is it?</strong>
                  )}
                  <MathJax inline>{paragraph}</MathJax>
                </p>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-100">
                <strong className="block text-emerald-900 mb-2 text-xs uppercase tracking-wider font-bold">✓ Examples</strong>
                <div className="overflow-x-auto text-xl sm:text-2xl font-black leading-relaxed">
                  <MathJax>{group.example}</MathJax>
                </div>
              </div>
              <div className="bg-rose-50 text-rose-800 p-4 rounded-lg border border-rose-100">
                <strong className="block text-rose-900 mb-2 text-xs uppercase tracking-wider font-bold">✗ Not a {group.heading}</strong>
                <div className="font-medium"><MathJax inline>{group.nonExample}</MathJax></div>
              </div>
            </div>

            {group.imageSrc && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white w-fit mx-auto md:mx-0">
                <img
                  src={group.imageSrc}
                  alt={group.imageAlt}
                  className="max-w-full md:max-w-lg max-h-[280px] object-contain bg-slate-50"
                  loading="lazy"
                />
              </div>
            )}

            {[
              ...(group.videoUrl ? [{ url: group.videoUrl, caption: group.videoCaption }] : []),
              ...(group.videos ?? [])
            ].map((video) => (
              <div key={video.url} className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
                {video.caption && (
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5">
                    <span className="text-sm">🎬</span>
                    <span className="text-sm font-semibold text-slate-100">{video.caption}</span>
                  </div>
                )}
                <video
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full max-h-[420px] bg-black"
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      ))}

      {section.context && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-blue-800 text-sm">
          <strong>Why does this matter?</strong> <MathJax inline>{section.context}</MathJax>
        </div>
      )}
    </div>

    <div className="grid md:grid-cols-1 gap-6 mb-8">
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-widest">Worked Example</h3>
        {section.examples.map((ex, i) => (
          <ExampleCard key={i} index={i + 1} example={ex} />
        ))}
      </div>
    </div>

    <div className="rounded-2xl bg-indigo-900 p-4 sm:p-6 shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">📝</span> Practice Zone
      </h3>
      <div className="space-y-4">
        {section.practiceZone.map((q, i) => (
          <div key={i} className="flex gap-3 border-b border-indigo-800 pb-3 last:border-0 last:pb-0">
            <span className="font-bold text-indigo-300">{i + 1}.</span>
            <MathJax className="text-indigo-50">{q}</MathJax>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const RealNumbers: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 [&_mjx-container]:font-bold [&_mjx-container_*]:font-bold">
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-slate-200 pt-12 pb-8">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://i.postimg.cc/0QQkJQHL/maths1.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full min-w-0 max-w-full px-3 sm:px-5 md:px-8 lg:px-10">
            <div className="inline-block px-3 py-1 bg-indigo-500/90 text-white rounded-full text-xs font-bold mb-4">
              CHAPTER 1
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              REAL NUMBERS
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
              A simple, easy-to-follow guide for Form 1 learners. Master integers, 
              fractions, factors, and more.
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

export default RealNumbers;
export const Realnumbers = RealNumbers;
