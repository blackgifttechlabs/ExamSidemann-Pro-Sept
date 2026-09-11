import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { MathChapterPager, notebookPaperClassName, notebookPaperStyle, useCenteredMathChapterTab, type MathNavigationProps } from './mathLessonUtils';
import { useLessonState } from '../../../lessonProgress';

const billFormulaFlowImage = new URL('./images/bill-formula-flow.png', import.meta.url).href;
const electricityBillExampleImage = new URL('./images/electricity-bill-example.png', import.meta.url).href;
const waterBillExampleImage = new URL('./images/water-bill-example.png', import.meta.url).href;
const phoneBillExampleImage = new URL('./images/phone-bill-example.png', import.meta.url).href;
const billCheckerImage = new URL('./images/bill-checker.png', import.meta.url).href;
const profitLossSubtractFlowImage = new URL('./images/profit-loss-subtract-flow.png', import.meta.url).href;
const profitScaleDiagramImage = new URL('./images/profit-scale-diagram.png', import.meta.url).href;
const lossScaleDiagramImage = new URL('./images/loss-scale-diagram.png', import.meta.url).href;
const marketStallTomatoesImage = new URL('./images/market-stall-tomatoes.png', import.meta.url).href;
const incomeExpenditureScaleImage = new URL('./images/income-expenditure-scale.png', import.meta.url).href;
const budgetSurplusExampleImage = new URL('./images/budget-surplus-example.png', import.meta.url).href;
const budgetDeficitExampleImage = new URL('./images/budget-deficit-example.png', import.meta.url).href;
const ubuntuCommunityCircleImage = new URL('./images/ubuntu-community-circle.png', import.meta.url).href;
const honestBillCommunityEffectImage = new URL('./images/honest-bill-community-effect.png', import.meta.url).href;
const delayedGratificationTadiwaImage = new URL('./images/delayed-gratification-tadiwa.png', import.meta.url).href;

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
};

// ------------------------------------------------------------
// Types (same as original)
// ------------------------------------------------------------
interface WorkedExample {
  question: string;
  steps: string[];
  answer: string;
  imageUrl?: string;
  imageAlt?: string;
  prediction?: {
    prompt: string;
    choices: { label: string; isCorrect: boolean }[];
    correctFeedback: string;
    incorrectFeedback: string;
    xp?: number;
  };
  hint?: string[];
}

interface TopicSection {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  diagram?: { title: string; content: string; type: 'house' | 'rainbow' | 'line' | 'triangle' | 'hill' | 'table' };
  imageUrl?: string;
  imageAlt?: string;
  method?: { title: string; steps: string[] }[];
  context?: string;
  examples: WorkedExample[];
  practiceZone: string[];
}

// ------------------------------------------------------------
// CONTENT – Financial Mathematics (all text preserved)
// ------------------------------------------------------------
const sections: TopicSection[] = [
  {
    id: 'household-bills',
    eyebrow: 'Chapter 1',
    title: 'Household Bills (ZESA, Water, Phone)',
    imageUrl: billFormulaFlowImage,
    imageAlt: 'Diagram showing Fixed Charge plus Units Used times Price per Unit equals Total Amount Due',
    intro: `Every month, a bill arrives at your house — maybe from ZESA for electricity, from the council for water, or from your phone company. A bill is simply a piece of paper (or a message on your phone) that tells your family how much money to pay, and why. Many students feel scared when they see a bill full of numbers, but here is a secret: every single bill in the world is built using the very same simple rule. Once you understand that one rule, you can check ANY bill — ZESA, water, phone, even a bill from another country — and know straight away if the amount is correct. This is not just "school maths." This is a real skill that will help you your whole life, whether you are helping your parents check a bill today, or paying your own bills as an adult one day.`,
    method: [
      {
        title: 'Key Vocabulary',
        steps: [
          'Fixed Charge — money you must pay just for being connected to the service, even if you use nothing at all that month. Think of it like a school registration fee: you pay it just to be a student, whether you attend every day or you are away sick for two weeks. Some bills call this a "standing charge" or "connection fee" — it means the same thing.',
          'Consumption — the actual amount of the service you used. If you left the lights on all month, your electricity consumption is high. If you were careful and switched things off, it is low. Consumption changes every month because it depends on YOU.',
          'Unit — the fixed "basket size" used to measure how much you used. Electricity is measured in kWh (kilowatt-hours), water in cubic metres (m³), and phone usage in minutes, SMS, or MB/GB of data. You cannot pay for "a little bit" — everything is counted in these fixed units.',
          'Price per Unit (or "tariff") — how much money ONE single unit costs. If electricity costs $0.10 per kWh, then every 1 kWh you use costs 10 cents.',
          'Total Amount Due — the final number at the bottom of the bill — the actual amount of money you must pay.',
        ],
      },
      {
        title: 'The Universal Bill Formula',
        steps: [
          'Total Amount = Fixed Charge + (Units Used × Price per Unit)',
          'Follow the arrows to see how the formula flows: Units Used → × Price per Unit → gives you the Cost of Usage → + Fixed Charge → gives you the Total Amount Due.',
          'Why does this work? Because a bill always has two separate parts glued together: money you owe no matter what (Fixed Charge), and money you owe because of how much you actually used (Units × Price). Add the two parts, and you get the whole bill.',
          'This exact pattern is used for almost every bill on Earth — electricity, water, phone, even a taxi fare (base fare + cost per km). Learn this one pattern, and you understand billing everywhere.',
        ],
      },
    ],
    examples: [
      {
        imageUrl: electricityBillExampleImage,
        imageAlt: 'Electricity meter and lightbulb showing 100 kWh times $0.10 equals $10.00',
        question: 'ZETDC – Electricity Bill — Fixed Monthly Fee: $5.00, Energy Used: 100 kWh, Price per Unit: $0.10',
        steps: [
          'Step 1: Find the Fixed Fee → $5.00 (charged no matter how much electricity was used — it never changes)',
          'Step 2: Calculate the cost of usage → 100 kWh × $0.10 = $10.00 (multiply how much was used by the price of ONE unit — this turns "kWh used" into "money owed")',
          'Step 3: Add the fixed fee and the usage cost → $5.00 + $10.00 = $15.00 (this matches our formula: Total = Fixed Charge + (Units × Price) — we already have both halves, so we just add them)',
        ],
        answer: 'TOTAL AMOUNT DUE: $15.00 ✓ (Even if this family had used 0 kWh, they would still owe at least $5.00 — that is the whole point of a Fixed Charge.)',
      },
      {
        imageUrl: waterBillExampleImage,
        imageAlt: 'Water tap dripping into a bucket showing 8 cubic metres times $1.50 equals $12.00',
        question: 'City Council – Water Bill — Fixed Monthly Fee: $3.00, Water Used: 8 m³, Price per m³: $1.50',
        steps: [
          'Step 1: Find the Fixed Fee → $3.00 (this is owed even if the family used almost no water)',
          'Step 2: Calculate the cost of usage → 8 m³ × $1.50 = $12.00 (multiply the amount used by the price per unit)',
          'Step 3: Add the fixed fee and the usage cost → $3.00 + $12.00 = $15.00',
        ],
        answer: 'TOTAL AMOUNT DUE: $15.00 ✓ (Notice this is the SAME total as the electricity bill above, even though the numbers inside are different — proof that one formula fits every bill.)',
      },
      {
        imageUrl: phoneBillExampleImage,
        imageAlt: 'Smartphone icon split into minutes and data usage costs',
        question: 'Phone Company – Monthly Bill — Fixed Line Rental: $2.00, Minutes Used: 50 min at $0.05/min, Data Used: 1 GB at $4.00/GB',
        steps: [
          'Step 1: Find the Fixed Line Rental → $2.00 (paid just to have a working phone line, before making a single call)',
          'Step 2: Calculate the cost of minutes → 50 min × $0.05 = $2.50 (multiply minutes used by price per minute)',
          'Step 3: Calculate the cost of data → 1 GB × $4.00 = $4.00 (multiply data used by price per GB — this is a SECOND type of "usage", added the same way as minutes)',
          'Step 4: Add all three parts together → $2.00 + $2.50 + $4.00 = $10.50',
        ],
        answer: 'TOTAL AMOUNT DUE: $10.50 ✓ (A phone bill just has an extra usage part compared to electricity or water — but the idea is identical: Fixed Charge + all the usage costs added together.)',
      },
      {
        imageUrl: billCheckerImage,
        imageAlt: 'Magnifying glass checking a bill against the expected and actual charged amounts',
        question: 'Checking a bill: Your neighbour receives a ZESA bill of $25.00. The paper says: Fixed Fee $5.00, Usage: 150 kWh at $0.10 per unit. Is the bill correct?',
        steps: [
          'Step 1: Calculate the expected cost of usage → 150 kWh × $0.10 = $15.00',
          'Step 2: Add the fixed fee → $5.00 + $15.00 = $20.00 (this is what the bill SHOULD say)',
          'Step 3: Compare your answer to what was actually charged → Expected $20.00, but the bill says $25.00',
        ],
        answer: 'The bill is WRONG — it is $5.00 too high! Your neighbour can now go back to ZESA with this exact working and ask for a correction. This is why learning the formula matters — it gives you the power to check any bill yourself.',
      },
    ],
    practiceZone: [
      'A ZESA bill has a fixed fee of $4.00, uses 120 kWh, at $0.08 per unit. What is the total bill?',
      'A water bill has a fixed fee of $2.50, uses 6 m³, at $2.00 per m³. What is the total bill?',
      "A family's electricity bill comes to $19.00 in total. If the fixed fee is $5.00 and they used 100 units, what was the price per unit? (Hint: rearrange the formula! Price per Unit = (Total − Fixed Charge) ÷ Units Used)",
    ],
  },
  {
    id: 'profit-loss',
    eyebrow: 'Chapter 2',
    title: 'Profit and Loss',
    imageUrl: profitLossSubtractFlowImage,
    imageAlt: 'Diagram showing Bigger Number minus Smaller Number equals the Profit or Loss answer',
    intro: `All over Zimbabwe — at Mbare Musika, at small tuck-shops, with airtime vendors, cross-border traders, and market stalls in every town — people buy things and then sell them again. But here is the important question every business owner must answer honestly: after selling, did I end up with MORE money, LESS money, or the SAME money I started with? Answering this correctly is the difference between a business that grows and a business that quietly loses money without anyone noticing. This chapter teaches you the two simple words that answer that question: Profit and Loss.`,
    method: [
      {
        title: 'Key Vocabulary',
        steps: [
          'Cost Price (CP) — the money that leaves your pocket to buy or make something. This is money going OUT, before you have even started selling.',
          'Selling Price (SP) — the money that comes back INTO your pocket when a customer pays you for the item.',
          'Profit — the "reward" money. It is the extra money you gain because you sold something for more than it cost you. Profit only exists when SP is bigger than CP.',
          'Loss — the "penalty" money. It is money you lose because you sold something for less than it cost you. Loss only exists when CP is bigger than SP.',
          'Break-even — Selling Price equals Cost Price exactly. No reward, no penalty — you simply got your original money back, nothing more and nothing less.',
        ],
      },
      {
        title: 'The Two Key Formulas',
        steps: [
          'First, compare CP and SP — this comparison decides everything that follows.',
          'If SP is bigger than CP → Profit: Profit = Selling Price − Cost Price',
          'If CP is bigger than SP → Loss: Loss = Cost Price − Selling Price',
          'Easy trick: always subtract the SMALLER number from the BIGGER number. Then look back at which one was bigger — that tells you if it was a profit or a loss.',
        ],
      },
      {
        title: 'Picture It: The Profit Scale',
        steps: [
          'Imagine an old-fashioned balance scale with two pans — one holds the Cost Price, the other holds the Selling Price.',
          'If the Selling Price pan is heavier (a bigger number) → the scale tips down on that side → this is Profit.',
          'If the Cost Price pan is heavier (buying cost more than what you sold it for) → the scale tips down on that side → this is Loss.',
          'If both pans weigh exactly the same → the scale stays level → this is Break-even.',
        ],
      },
    ],
    examples: [
      {
        imageUrl: profitScaleDiagramImage,
        imageAlt: 'Balance scale tipping toward Selling Price showing a Profit of $3.00',
        question: 'Tinashe buys a bucket of tomatoes at Mbare Musika for $10.00 (CP) and sells them all for $13.00 (SP).',
        steps: [
          'Step 1: Write down the Cost Price → CP = $10.00 (money Tinashe paid to buy the tomatoes)',
          'Step 2: Write down the Selling Price → SP = $13.00 (money Tinashe received from customers)',
          'Step 3: Compare → SP ($13.00) is bigger than CP ($10.00), so this is a PROFIT situation',
          'Step 4: Subtract the smaller from the bigger → $13.00 − $10.00 = $3.00',
        ],
        answer: 'Tinashe made a Profit of $3.00 (He now has $3.00 more than he started with — his reward for good buying and selling.)',
      },
      {
        imageUrl: lossScaleDiagramImage,
        imageAlt: 'Balance scale tipping toward Cost Price showing a Loss of $4.00',
        question: 'Rudo buys a box of bread loaves for $20.00 (CP) but only sells everything for $16.00 (SP).',
        steps: [
          'Step 1: Write down the Cost Price → CP = $20.00 (money Rudo paid for the bread)',
          'Step 2: Write down the Selling Price → SP = $16.00 (money Rudo received from customers)',
          'Step 3: Compare → CP ($20.00) is bigger than SP ($16.00), so this is a LOSS situation',
          'Step 4: Subtract the smaller from the bigger → $20.00 − $16.00 = $4.00',
        ],
        answer: 'Rudo made a Loss of $4.00 (He ended up with $4.00 less than what he originally spent.)',
      },
      {
        question: 'Farai buys airtime vouchers for $50.00 (CP) and sells all of them for exactly $50.00 (SP).',
        steps: [
          'Step 1: Write down the Cost Price → CP = $50.00',
          'Step 2: Write down the Selling Price → SP = $50.00',
          'Step 3: Compare → CP and SP are EQUAL, so there is nothing to subtract',
        ],
        answer: 'Farai broke even — he neither gained nor lost money. He simply got back exactly what he spent.',
      },
      {
        imageUrl: marketStallTomatoesImage,
        imageAlt: 'Small market stall with a basket of produce',
        question: 'Chipo buys a crate of eggs for $8.00 (CP) and sells them for $11.00 (SP). What is her profit, and what is her profit as a percentage of the Cost Price?',
        steps: [
          'Step 1: Compare CP and SP → SP ($11.00) is bigger than CP ($8.00), so this is profit',
          'Step 2: Find the Profit amount → $11.00 − $8.00 = $3.00',
          'Step 3: Turn the profit into a percentage → (Profit ÷ CP) × 100 = ($3.00 ÷ $8.00) × 100 = 37.5%',
          'Step 4: Justify why we divide by CP and not SP → percentage profit is always measured against what you originally paid (CP), because CP is your "starting point" — not what you managed to sell it for.',
        ],
        answer: 'Chipo made a Profit of $3.00, which is a 37.5% profit on her Cost Price.',
      },
    ],
    practiceZone: [
      'Chipo buys a crate of eggs for $8.00 and sells them all for $11.00. Did she make a profit or loss, and how much?',
      'Tapiwa buys second-hand shoes for $15.00 per pair, but sells them for only $12.00. Did he make a profit or loss, and how much?',
      "Using Chipo's eggs (CP $8.00, SP $11.00), calculate her Profit % based on Cost Price.",
      'A trader buys maize for $30.00 and sells it for $30.00. What do we call this situation?',
    ],
  },
  {
    id: 'discount',
    eyebrow: 'Chapter 3',
    title: 'Discount',
    intro: `You've probably seen signs in shop windows saying "50% OFF!" or "SALE — 20% Discount!" Shops use discounts to attract customers, clear out old stock, or celebrate special occasions like Christmas or back-to-school season. Understanding discounts helps you know exactly how much money you're really saving — and helps you avoid being confused when shopping.`,
    method: [
      {
        title: 'Key Vocabulary',
        steps: [
          'Discount — a reduction in the original price of an item. It is "money off." Discounts are usually given as a percentage (%).',
          'Original Price (or Marked Price) — the price of the item before any discount is applied.',
          'Discount Amount — the actual amount of money taken off the price.',
          'New Price (or Sale Price / Selling Price) — the price you actually pay after the discount has been subtracted.',
        ],
      },
      {
        title: 'The Two-Step Formula',
        steps: [
          'Step 1 — Find the Discount Amount: Discount Amount = Discount % ÷ 100 × Original Price',
          'Step 2 — Find the New Price: New Price = Original Price − Discount Amount',
        ],
      },
      {
        title: 'A Handy Shortcut',
        steps: [
          'New Price = Original Price × (100 − Discount %) ÷ 100',
          'Example: For a $20 item with 10% off: $20.00 × (100 − 10) ÷ 100 = $20.00 × 90 ÷ 100 = $18.00 ✓',
        ],
      },
    ],
    examples: [
      {
        question: 'At a "Back to School" sale, a school bag costs $20.00 with a 10% discount.',
        steps: [
          'Step 1: Find the discount amount → 10/100 × $20.00 = $2.00',
          'Step 2: Subtract from original price → $20.00 − $2.00 = $18.00',
        ],
        answer: 'The student pays only $18.00 for the bag, saving $2.00.',
      },
      {
        question: 'A pair of shoes costs $35.00 with a 20% discount during a Christmas sale.',
        steps: [
          'Step 1: Find the discount amount → 20/100 × $35.00 = $7.00',
          'Step 2: Subtract from original price → $35.00 − $7.00 = $28.00',
        ],
        answer: 'The customer pays $28.00 instead of $35.00.',
      },
      {
        question: 'A shirt is on sale for $24.00 after a 20% discount was applied. What was the original price?',
        steps: [
          'Step 1: If 20% was taken off, then the customer paid the remaining 80% of the original price.',
          'Step 2: So $24.00 represents 80% of the original price.',
          'Step 3: Find 1% → $24.00 ÷ 80 = $0.30',
          'Step 4: Find 100% (the original price) → $0.30 × 100 = $30.00',
        ],
        answer: 'The original price was $30.00. (Check: 20% of $30.00 = $6.00, and $30.00 − $6.00 = $24.00 ✓)',
      },
    ],
    practiceZone: [
      'A dress costs $40.00 with a 15% discount. What is the discount amount and the new price?',
      'A pair of trousers costs $18.00 with a 25% discount. What is the new price?',
      'A backpack is on sale for $17.00 after a 15% discount. What was the original price?',
      'Two shops sell the same watch for $50.00. Shop A offers 10% off. Shop B offers 15% off. Which shop gives the better deal, and what is the price difference?',
    ],
  },
  {
    id: 'household-budgets',
    eyebrow: 'Chapter 4',
    title: 'Household Budgets',
    imageUrl: incomeExpenditureScaleImage,
    imageAlt: 'Income and expenditure scale showing how budgets can balance, create a surplus, or create a deficit',
    intro: `Every family has money coming in and money going out. Without a plan, it's easy to spend on small things and then not have enough left for important things like food, rent, or school fees. A budget is simply a plan on paper (or in your head) that helps a family — or a person, or even a country — manage money wisely and avoid running short before the next payday.`,
    method: [
      {
        title: 'Key Vocabulary',
        steps: [
          'Budget — a plan that shows how much money you expect to receive and how you intend to spend it.',
          'Income — money coming in, such as a salary, wages, money from selling vegetables, or remittances from relatives.',
          'Expenditure — money going out, meaning everything you spend money on.',
          'Needs — things you must have to survive and function, like food, water, electricity, and school fees.',
          'Wants — things that are nice to have but not essential, like sweets, new clothes you don\'t need, or entertainment.',
          'Savings — money you set aside and do not spend, kept for future needs or emergencies.',
          'Balanced Budget — when Income equals Expenditure exactly (no extra, no shortfall).',
          'Deficit — when Expenditure is more than Income (you don\'t have enough money to cover your costs).',
          'Surplus — when Income is more than Expenditure (you have money left over).',
        ],
      },
      {
        title: 'The Golden Budget Rule',
        steps: [
          'Income should always be greater than or equal to Expenditure.',
          'Income ≥ Expenditure',
          'If this rule is broken — if Expenditure is bigger than Income — a family will run into debt or be unable to pay for important things.',
        ],
      },
    ],
    examples: [
      {
        imageUrl: budgetSurplusExampleImage,
        imageAlt: 'Budget surplus example showing income of $70 and expenditure of $60',
        question: 'A family\'s budget: Food $10.00, Electricity $15.00, School Fees Savings $20.00, Transport $15.00. Total Expenditure $60.00. Income is $70.00.',
        steps: [
          'Step 1: Total Expenditure → $60.00',
          'Step 2: Total Income → $70.00',
          'Step 3: Compare: Income ($70.00) is greater than Expenditure ($60.00)',
          'Step 4: Find the surplus → $70.00 − $60.00 = $10.00',
        ],
        answer: 'Yes, they have enough money, and they will have $10.00 left over — this can go toward savings or an emergency fund.',
      },
      {
        imageUrl: budgetDeficitExampleImage,
        imageAlt: 'Budget deficit example showing income of $65 and expenditure of $75',
        question: 'A family\'s budget: Rent $25.00, Food $20.00, Electricity $12.00, Transport $10.00, Airtime/Data $8.00. Total Expenditure $75.00. Income is $65.00.',
        steps: [
          'Step 1: Total Expenditure → $75.00',
          'Step 2: Total Income → $65.00',
          'Step 3: Compare: Expenditure ($75.00) is greater than Income ($65.00)',
          'Step 4: Find the shortfall → $75.00 − $65.00 = $10.00',
        ],
        answer: 'This family has a deficit of $10.00. They do not have enough money to cover all their planned spending.',
      },
    ],
    practiceZone: [
      'A family has monthly expenses: Food $18.00, Electricity $12.00, Transport $10.00, School Fees Savings $15.00. Income is $60.00. Do they have a surplus or a deficit, and by how much?',
      "A family's total expenditure is $85.00 and income is $85.00. What do we call this type of budget?",
      'A student receives $5.00 pocket money per week. They spend $2.00 on transport (a need) and want to spend $4.00 on sweets (a want). Can they afford both? What should they prioritize?',
      'A family earns $50.00 but expenses add up to $58.00. What is their deficit, and name two ways they could fix this problem.',
    ],
  },
  {
    id: 'unhu-ubuntu',
    eyebrow: 'Chapter 5',
    title: 'Unhu/Ubuntu: Honesty and Discipline',
    imageUrl: ubuntuCommunityCircleImage,
    imageAlt: 'Community circle illustrating Unhu Ubuntu values of honesty, discipline, and shared responsibility',
    intro: `Money is not only a personal matter — it is also a community matter. In Zimbabwean culture, we live by the philosophy of Unhu/Ubuntu, often summed up in the saying "Munhu munhu nevanhu" — a person is a person because of other people. This means our choices about money don't just affect us; they affect our families, neighbours, and the whole community. This lesson looks at two Unhu/Ubuntu values that are especially important when it comes to money: Honesty and Discipline.`,
    method: [
      {
        title: 'Key Vocabulary',
        steps: [
          'Unhu/Ubuntu — a Southern African philosophy of humanity, community, and shared responsibility. It teaches that our wellbeing is connected to the wellbeing of others.',
          'Honesty — telling the truth and doing the right thing, even when no one is watching.',
          'Discipline — the ability to control yourself and make wise choices, even when it is difficult or when you\'d rather do something else.',
          'Citizen — a member of a community or country who has both rights and responsibilities.',
          'Delayed Gratification — choosing to wait for a bigger or more important reward later, instead of a smaller reward right now.',
        ],
      },
    ],
    context: `When we pay our ZESA, water, and other bills on time and in full, we are practicing honesty as citizens. This might seem like just a personal task — paying a bill — but it actually has a much bigger impact. The money collected from electricity bills is used to maintain power lines and power stations — so if people don't pay, there isn't enough money to fix faults, and the whole neighbourhood can suffer from more frequent power cuts. The money from water bills is used to repair burst pipes and maintain clean water systems — if not enough people pay, pipes may burst and go unrepaired, affecting everyone's water supply, not just those who didn't pay. Being honest about bills, and even about small things like giving correct change or not stealing electricity through illegal connections, builds trust between citizens and the companies or council that serve them.`,
    examples: [
      {
        imageUrl: honestBillCommunityEffectImage,
        imageAlt: 'Honest bill payments helping the wider community through reliable services',
        question: 'Imagine a suburb where every family pays their ZESA bill honestly and on time.',
        steps: [
          'ZESA has enough money to repair a broken transformer quickly.',
          'But in a suburb where many people refuse to pay or find illegal ways to connect electricity, ZESA has no money to fix problems — and everyone, including the honest payers, suffers longer power cuts.',
          'This shows how one person\'s honesty (or dishonesty) about money affects the whole community — this is the heart of Unhu/Ubuntu.',
        ],
        answer: 'Honesty with bills benefits the whole community.',
      },
      {
        imageUrl: delayedGratificationTadiwaImage,
        imageAlt: 'Tadiwa choosing to save money for exercise books instead of buying ice cream',
        question: 'Tadiwa has $5.00 in pocket money. His friends are buying ice creams for $2.00 each. He wants one but needs to save $3.00 for school exercise books.',
        prediction: {
          prompt: 'What should Tadiwa do?',
          choices: [
            { label: 'Buy the ice cream', isCorrect: false },
            { label: 'Save the money', isCorrect: true },
          ],
          correctFeedback:
            'Buying the ice cream leaves exactly $3.00, but saving for school books is the wiser decision because the books are a need while the ice cream is a want.',
          incorrectFeedback: 'Not quite. Think about what is a need and what is a want before opening the full solution.',
          xp: 10,
        },
        hint: [
          'Think about this first.',
          'How much money will remain after buying the ice cream?',
          '$5.00 − $2.00 = ?',
        ],
        steps: [
          '$5.00 − $2.00 = $3.00',
          'The books cost $3.00, so buying the ice cream leaves exactly enough for the books and nothing extra.',
          'Saving the money now is a better financial decision because books are a need while ice cream is a want.',
        ],
        answer: 'Tadiwa chooses to save the money.',
      },
    ],
    practiceZone: [
      'Explain in your own words why paying your family\'s water bill honestly and on time helps people other than just your own family.',
      'Tanaka has $10.00. She wants to buy a new phone cover for $8.00, but she knows she needs $6.00 for transport to school for the rest of the week. What should Tanaka do, and which Unhu/Ubuntu value does this show?',
      'Give one example of dishonesty related to household bills, and explain how it could negatively affect the wider community.',
      'Why do you think a disciplined person is often more respected in their community than someone who spends carelessly?',
    ],
  },
  {
    id: 'final-practice',
    eyebrow: 'Practice',
    title: 'Final Practice Questions — All Topics',
    intro: 'Test your understanding across all topics. Try each question on your own, then check the answers below.',
    examples: [],
    method: [
      {
        title: 'Answers – Topic 1: Household Bills',
        steps: [
          '1. 80 × $0.12 = $9.60; $6.00 + $9.60 = $15.60',
          '2. 10 × $1.20 = $12.00; $4.00 + $12.00 = $16.00',
          '3. Minutes: 60 × $0.05 = $3.00; Data: 2 × $3.50 = $7.00; Total = $3.00 + $3.00 + $7.00 = $13.00',
          '4. ($22.00 − $6.00) ÷ 160 = $16.00 ÷ 160 = $0.10 per unit',
          '5. Because of the Fixed Charge — a set monthly fee charged just for being connected to the service, regardless of how much is used.',
        ],
      },
      {
        title: 'Answers – Topic 2: Profit and Loss',
        steps: [
          '1. SP ($17.00) > CP ($12.00): $17.00 − $12.00 = Profit of $5.00',
          '2. CP ($25.00) > SP ($21.00): $25.00 − $21.00 = Loss of $4.00',
          '3. Profit = $9.00 − $6.00 = $3.00; Profit % = (3.00 ÷ 6.00) × 100 = 50%',
          '4. This is called break-even (no profit, no loss)',
          '5. Cost Price is the money paid to buy or make an item; Selling Price is the money received when the item is sold to a customer.',
        ],
      },
      {
        title: 'Answers – Topic 3: Discount',
        steps: [
          '1. Discount = 10/100 × $30.00 = $3.00; New Price = $30.00 − $3.00 = $27.00',
          '2. Discount = 20/100 × $50.00 = $10.00; New Price = $50.00 − $10.00 = $40.00',
          '3. $34.00 represents 85% of original price → $34.00 ÷ 85 = $0.40 (1%) → $0.40 × 100 = $40.00',
          '4. Shop A: 5% of $12.00 = $0.60, New Price = $11.40. Shop B: 10% of $12.00 = $1.20, New Price = $10.80. Shop B is better, saving an extra $0.60.',
          '5. Because a discount percentage represents a fraction of the price, not a flat dollar amount — 10% of $20.00 is $2.00, not $10.00, so you must calculate the actual discount amount first before subtracting.',
        ],
      },
      {
        title: 'Answers – Topic 4: Household Budgets',
        steps: [
          '1. Total Expenditure = $15.00 + $10.00 + $12.00 + $18.00 = $55.00. Income ($50.00) is less than Expenditure ($55.00) → Deficit of $5.00',
          '2. This is called a balanced budget',
          '3. Deficit = $53.00 − $45.00 = $8.00. Possible fix: earn extra income or cut back on non-essential spending (wants).',
          '4. Needs: food, electricity/water, school fees, transport to work/school. Wants: sweets, extra airtime, new clothes not needed, entertainment. (Any two of each are acceptable.)',
          '5. Because needs are essential for survival and daily life (like food and shelter), while wants are optional. If wants are paid for first and money runs out, the family may not be able to afford essential things, causing greater hardship.',
        ],
      },
      {
        title: 'Answers – Topic 5: Unhu/Ubuntu',
        steps: [
          '1. Money from ZESA bills is used to maintain power lines and fix faults; when everyone pays honestly, there is enough money to keep the whole community\'s electricity supply reliable, not just the individual payer\'s.',
          '2. Tapiwa should not buy the sweets, and should keep the money for kombi fare, since transport is a need and sweets are a want. This shows discipline.',
          '3. Example: a shopkeeper giving a customer incorrect change on purpose, or a person illegally connecting electricity without paying. This harms the wider community because it reduces trust in transactions and can reduce funds available to maintain shared services like the power grid.',
          '4. Discipline means resisting an immediate temptation (like buying a treat) in order to achieve a more important goal later (like having enough money for food or school books). Example: choosing to save pocket money for exercise books instead of spending it all on snacks.',
          '5. This phrase reflects the idea that our actions with money don\'t only affect ourselves — they affect the whole community. Being honest and disciplined with money strengthens trust, resources, and wellbeing for everyone, not just the individual.',
        ],
      },
    ],
    practiceZone: [
      'Topic 1 — Household Bills: Q1. A ZESA bill has a fixed monthly fee of $6.00. The household used 80 kWh at $0.12 per unit. Calculate the total bill.',
      'Topic 1 — Household Bills: Q2. A water bill has a fixed fee of $4.00 and the family used 10 m³ at $1.20 per m³. What is the total amount due?',
      'Topic 1 — Household Bills: Q3. A phone bill has a fixed line rental of $3.00, plus 60 minutes used at $0.05 per minute, plus 2 GB of data at $3.50 per GB. What is the total bill?',
      'Topic 1 — Household Bills: Q4. A family\'s total electricity bill was $22.00. The fixed fee was $6.00 and they used 160 units. What was the price per unit?',
      'Topic 1 — Household Bills: Q5. Why do families still have to pay something on their ZESA bill even in a month where they used almost no electricity?',
      'Topic 2 — Profit and Loss: Q1. Mai Chido buys a box of tomatoes for $12.00 and sells them all for $17.00. Did she make a profit or loss, and how much?',
      'Topic 2 — Profit and Loss: Q2. A vendor buys second-hand clothes for $25.00 but sells them for $21.00 due to a slow market day. Did he make a profit or loss, and how much?',
      'Topic 2 — Profit and Loss: Q3. A trader buys 50 eggs for $6.00 and sells all of them for $9.00. What is the profit, and what is the profit as a percentage of the cost price?',
      'Topic 2 — Profit and Loss: Q4. A shop owner buys stock for $40.00 and sells it for exactly $40.00. What do we call this outcome?',
      'Topic 2 — Profit and Loss: Q5. Explain in your own words the difference between Cost Price and Selling Price.',
      'Topic 3 — Discount: Q1. A pair of school shoes costs $30.00 with a 10% discount. What is the discount amount and the new price?',
      'Topic 3 — Discount: Q2. A jacket costs $50.00 with a 20% discount during a winter sale. What is the new price?',
      'Topic 3 — Discount: Q3. A backpack is on sale for $34.00 after a 15% discount was applied. What was the original price?',
      'Topic 3 — Discount: Q4. A calculator costs $12.00. Shop A offers 5% off, Shop B offers 10% off. Which shop offers the better deal, and by how much?',
      'Topic 3 — Discount: Q5. Why is it incorrect to simply subtract the percentage number directly from the price (e.g., $20.00 − 10 = $10.00) when calculating a 10% discount?',
      'Topic 4 — Household Budgets: Q1. A family\'s monthly expenses are: Food $15.00, Electricity $10.00, Transport $12.00, School Fees Savings $18.00. Income is $50.00. Do they have a surplus or deficit, and by how much?',
      'Topic 4 — Household Budgets: Q2. A family\'s total expenditure is $90.00 and total income is $90.00. What do we call this type of budget?',
      'Topic 4 — Household Budgets: Q3. A family earns $45.00 but planned expenses total $53.00. What is their deficit, and suggest one way to fix it.',
      'Topic 4 — Household Budgets: Q4. List two examples of "needs" and two examples of "wants" in a household budget.',
      'Topic 4 — Household Budgets: Q5. Why should a family prioritize needs over wants when planning a budget?',
      'Topic 5 — Unhu/Ubuntu: Q1. Explain how paying your ZESA bill honestly and on time benefits people beyond just your own household.',
      'Topic 5 — Unhu/Ubuntu: Q2. Tapiwa has $8.00. He wants to buy sweets for $5.00, but he knows he needs $4.00 for kombi fare tomorrow. What should Tapiwa do, and which Unhu/Ubuntu value does this represent?',
      'Topic 5 — Unhu/Ubuntu: Q3. Give an example of dishonesty connected to money (bills, business, or shopping) and explain who it could harm besides the dishonest person.',
      'Topic 5 — Unhu/Ubuntu: Q4. Why is discipline described as "the strength to say no"? Give an example from everyday life.',
      'Topic 5 — Unhu/Ubuntu: Q5. Explain in your own words the meaning of the phrase "Munhu munhu nevanhu" (a person is a person because of other people) in relation to money and community.',
    ],
  },
];

// ------------------------------------------------------------
// COMPONENTS (identical to original design)
// ------------------------------------------------------------
const financialMathPattern =
  /(\$?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*(?:kWh|m³|GB|MB|min|units?|per unit|per m³|\/min|\/GB))?(?:\s*(?:[+−×÷=<>≥≤]|→)\s*\$?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*(?:kWh|m³|GB|MB|min|units?|per unit|per m³|\/min|\/GB))?)*%?|\d+(?:\.\d+)?%|[+−×÷=<>≥≤%→])/g;
const isFinancialMathPart =
  /^(\$?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*(?:kWh|m³|GB|MB|min|units?|per unit|per m³|\/min|\/GB))?(?:\s*(?:[+−×÷=<>≥≤]|→)\s*\$?\d+(?:\.\d+)?(?:\/\d+)?(?:\s*(?:kWh|m³|GB|MB|min|units?|per unit|per m³|\/min|\/GB))?)*%?|\d+(?:\.\d+)?%|[+−×÷=<>≥≤%→])$/;

const toFinancialMathExpression = (value: string) =>
  value
    .replace(/\$(?=\d)/g, '\\$')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/−/g, '-')
    .replace(/→/g, '\\to ')
    .replace(/%/g, '\\%')
    .replace(/\s*kWh\b/g, '\\ \\text{kWh}')
    .replace(/\s*m³\b/g, '\\ \\text{m}^3')
    .replace(/\s*GB\b/g, '\\ \\text{GB}')
    .replace(/\s*MB\b/g, '\\ \\text{MB}')
    .replace(/\s*min\b/g, '\\ \\text{min}')
    .replace(/\s*units\b/g, '\\ \\text{units}')
    .replace(/\s*unit\b/g, '\\ \\text{unit}')
    .replace(/\/min/g, '/\\text{min}')
    .replace(/\/GB/g, '/\\text{GB}');

const renderFinancialMath = (value: string) => {
  const parts = value.split(financialMathPattern);

  return parts.map((part, index) => {
    if (!part) return null;

    return isFinancialMathPart.test(part) ? (
      <MathJax inline key={`${part}-${index}`} className="inline">
        {`\\(${toFinancialMathExpression(part)}\\)`}
      </MathJax>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    );
  });
};

const splitWorkedExampleQuestion = (question: string) => {
  if (question.length < 90) return [question];

  return question
    .split(/(?<=\.)\s+|,\s+(?=[A-Z])/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const LearningCard: React.FC<{
  title: string;
  description: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ title, description, active, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg border p-4 text-left transition-colors ${
      active
        ? 'border-indigo-300 bg-indigo-50 text-indigo-950'
        : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-200 hover:bg-indigo-50/50'
    } ${disabled ? 'cursor-not-allowed opacity-50 hover:border-slate-200 hover:bg-white' : ''}`}
  >
    <span className="block font-bold">{title}</span>
    <span className="mt-1 block text-sm text-slate-500">{description}</span>
  </button>
);

const ExampleCard: React.FC<{ index: number; example: WorkedExample }> = ({ index, example }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [activeCard, setActiveCard] = useState<'hint' | 'solution' | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const questionLines = splitWorkedExampleQuestion(example.question);
  const selectedPrediction = example.prediction?.choices.find((choice) => choice.label === selectedChoice);
  const canCheck = example.prediction ? Boolean(selectedChoice) : true;
  const isCorrect = checked && selectedPrediction?.isCorrect;
  const hintLines =
    example.hint ||
    [
      'Think about the important numbers or words first.',
      'Decide what the question is asking before opening the full solution.',
    ];

  const openLearningCard = (card: 'hint' | 'solution') => {
    setActiveCard(card);
    if (card === 'solution' && visibleSteps === 0) setVisibleSteps(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between">
        {example.imageUrl && (
          <img loading="lazy" decoding="async"
            src={example.imageUrl}
            alt={example.imageAlt || example.question}
            className="order-2 w-full max-h-80 object-contain rounded-lg border border-slate-100 bg-slate-50 p-3 md:w-80 md:shrink-0 lg:w-96"
          />
        )}
        <div className="order-1 flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {index}
          </div>
          <div className="min-w-0 space-y-1 text-slate-800 font-medium pt-1">
            {questionLines.map((line, lineIndex) => (
              <div key={`${line}-${lineIndex}`} className="leading-relaxed">
                {renderFinancialMath(line)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-bold text-slate-900">Predict before showing</h4>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
              ⭐ Easy
            </span>
          </div>

          {example.prediction ? (
            <>
              <p className="mb-3 text-slate-800">{example.prediction.prompt}</p>
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {example.prediction.choices.map((choice) => (
                  <button
                    type="button"
                    key={choice.label}
                    onClick={() => {
                      setSelectedChoice(choice.label);
                      setChecked(false);
                      setActiveCard(null);
                    }}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      selectedChoice === choice.label
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'
                    }`}
                  >
                    ○ {choice.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mb-4 text-sm text-slate-600">
              Work out your answer first. When you are ready, unlock the hint and solution cards.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              if (!canCheck) return;
              setChecked(true);
              setActiveCard(null);
            }}
            disabled={!canCheck}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check Answer
          </button>

          {checked && example.prediction && (
            <div
              className={`mt-4 rounded-lg border p-4 text-sm ${
                isCorrect
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-900'
              }`}
            >
              <p className="font-bold">{isCorrect ? '✅ Correct!' : '❌ Not quite.'}</p>
              <p className="mt-1">
                {isCorrect ? example.prediction.correctFeedback : example.prediction.incorrectFeedback}
              </p>
              {isCorrect && example.prediction.xp && (
                <p className="mt-2 font-bold text-emerald-700">+{example.prediction.xp} XP</p>
              )}
            </div>
          )}

          {checked && !example.prediction && (
            <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
              Prediction saved. Use only the card you need next.
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <LearningCard
            title="💡 Hint"
            description="Tap to open"
            active={activeCard === 'hint'}
            disabled={!checked}
            onClick={() => openLearningCard('hint')}
          />
          <LearningCard
            title="📝 Worked Solution"
            description="Tap to open"
            active={activeCard === 'solution'}
            disabled={!checked}
            onClick={() => openLearningCard('solution')}
          />
        </div>

        {activeCard === 'hint' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <h4 className="mb-3 font-bold">💡 Hint</h4>
            <div className="space-y-2">
              {hintLines.map((line, i) => (
                <p key={`${line}-${i}`}>{renderFinancialMath(line)}</p>
              ))}
            </div>
          </div>
        )}

        {activeCard === 'solution' && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h4 className="mb-4 font-bold text-indigo-950">📝 Worked Example</h4>
            <div className={notebookPaperClassName} style={notebookPaperStyle}>
              {example.steps.slice(0, visibleSteps).map((step, i) => (
                <div key={step} className="flex gap-2 border-b border-stone-200/70 py-2 text-sm leading-relaxed text-slate-700 last:border-0">
                  <span className="shrink-0 font-semibold text-rose-400">Step {i + 1}:</span>
                  <p className="min-w-max flex-1 text-slate-800">{renderFinancialMath(step)}</p>
                </div>
              ))}
              {visibleSteps >= example.steps.length && (
                <div className="border-t border-stone-200/70 pt-2 text-sm leading-relaxed">
                  <span className="font-semibold text-slate-500 mr-1">Result:</span>
                  <span className="text-slate-900">{renderFinancialMath(example.answer)}</span>
                </div>
              )}
            </div>
            {visibleSteps < example.steps.length ? (
              <button
                type="button"
                onClick={() => setVisibleSteps((current) => Math.min(current + 1, example.steps.length))}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Reveal Next Step
              </button>
            ) : null}
          </div>
        )}

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
      <p className="text-slate-700 leading-relaxed mb-6">{section.intro}</p>

      {section.imageUrl && (
        <img loading="lazy" decoding="async"
          src={section.imageUrl}
          alt={section.imageAlt || section.title}
          className="w-full max-w-lg mx-auto rounded-xl border border-slate-200 bg-white p-2 mb-6 shadow-sm"
        />
      )}

      {section.method?.map((m, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {m.title}
          </h3>
          <ul className="space-y-2 text-slate-700 ml-4">
            {m.steps.map((step, j) => (
              <li key={j} className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>{renderFinancialMath(step)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {section.context && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-blue-800 text-sm">
          <strong>Why does this matter?</strong> {section.context}
        </div>
      )}
    </div>

    {section.examples && section.examples.length > 0 && (
      <div className="grid md:grid-cols-1 gap-6 mb-10">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-5 tracking-widest">Worked Examples</h3>
          <div className="space-y-8">
          {section.examples.map((ex, i) => (
            <ExampleCard key={i} index={i + 1} example={ex} />
          ))}
          </div>
        </div>
      </div>
    )}

    {section.practiceZone && section.practiceZone.length > 0 && (
      <div className="rounded-2xl bg-indigo-900 p-4 sm:p-6 shadow-lg text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">📝</span> Practice Zone
        </h3>
        <div className="space-y-4">
          {section.practiceZone.map((q, i) => (
            <div key={i} className="flex gap-3 border-b border-indigo-800 pb-3 last:border-0 last:pb-0">
              <span className="font-bold text-indigo-300">{i + 1}.</span>
              <span className="text-indigo-50">{renderFinancialMath(q)}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </section>
);

// ------------------------------------------------------------
// MAIN COMPONENT (exported as FinancialMathematics)
// ------------------------------------------------------------
export const FinancialMathematics: React.FC<MathNavigationProps> = ({ onNextTopic, nextTopicTitle }) => {
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
        {/* Hero Header */}
        <div className="relative overflow-hidden border-b border-slate-200 pt-12 pb-8">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center blur-md opacity-35"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1800&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-white/82" />
          <div className="relative w-full min-w-0 max-w-full px-3 sm:px-5 md:px-8 lg:px-10">
            <div className="inline-block px-3 py-1 bg-indigo-100/95 text-indigo-700 rounded-full text-xs font-bold mb-4">
              CHAPTER 1 – 5
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              FINANCIAL MATHEMATICS
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Learn how to manage money — household bills, profit &amp; loss, discounts,
              budgets, and the values of Unhu/Ubuntu in everyday financial decisions.
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

// Also export as default if you prefer
export default FinancialMathematics;
export const Financialmathematics = FinancialMathematics;
export const FinancialMaths = FinancialMathematics;
