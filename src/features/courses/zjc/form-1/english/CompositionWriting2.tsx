import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  BookOpen,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Sparkles,
  GraduationCap,
  Trophy,
  Layers,
  Target,
  AlignLeft,
  FileText,
  Edit3,
  MessageSquare,
  Scale,
  PenTool,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  Info,
  ClipboardList,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ──────────────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  answer: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  details: string[];
  examples: React.ReactNode; // rich content like sample texts
  questions: Question[];
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: Advanced Writing Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'narrative',
    title: 'Narrative Composition (The Storyteller)',
    description:
      'A narrative is a story. It has a plot (what happens), characters (who is in it), and a setting (where it happens). The most important thing is the order of time – use words like First, Suddenly, After that, and Finally.',
    details: [
      'Plot: the sequence of events (beginning, middle, end).',
      'Characters: the people or animals in the story.',
      'Setting: where and when the story takes place.',
      'Time words: help the reader follow the order of events.',
      'Conflict/Problem: creates interest and drives the story.',
    ],
    examples: (
      <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900 p-6 rounded-xl shadow-sm space-y-4 italic font-serif">
        <h4 className="not-italic font-black uppercase text-xs mb-2 text-blue-600 dark:text-blue-400 tracking-widest">
          Example: A Frightening Night
        </h4>
        <p className="text-sm leading-relaxed">
          It was a very dark Friday night in our village of Chikomba. The moon was hidden behind heavy, black clouds, and the wind was whispering through the dry maize stalks. I was home alone because my parents had gone to a funeral in the next village. I sat near the small candle, trying to do my homework, but every little sound made me jump.
        </p>
        <p className="text-sm leading-relaxed">
          Suddenly, I heard a loud thud on the roof. My heart stopped beating for a second. I thought it might be a thief or perhaps a wild animal looking for food. I stayed very still, holding my breath. Then, I heard a scratching sound against the wooden door. I was so scared that my hands were shaking like leaves in the wind.
        </p>
        <p className="text-sm leading-relaxed">
          I knew I had to be brave. I grabbed a large stick from the corner and walked slowly toward the door. "Who is there?" I shouted, but my voice was small and trembling. I slowly pushed the door open, ready to fight. To my surprise, a small, wet dog was standing there, wagging its tail. It was my neighbor's dog, Rex, who had escaped during the storm.
        </p>
        <p className="text-sm leading-relaxed">
          I felt a huge wave of relief wash over me. I laughed at myself for being so afraid of a small dog. I brought Rex inside, gave him a little bit of leftover sadza, and we both fell asleep by the warm fire. That night taught me that our imagination often makes things seem much scarier than they really are.
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the main purpose of a narrative composition?',
        answer: 'To tell a story or relate a sequence of events.',
      },
      {
        id: 2,
        question: 'Why are "time words" like Suddenly or After that important?',
        answer: 'They help the reader understand the order in which things happened.',
      },
      {
        id: 3,
        question: 'What were the three main parts of the plot in the story above?',
        answer: 'Problem: A scary sound on the roof. Action: Opening the door with a stick. Ending: Finding out it was just a dog.',
      },
      {
        id: 4,
        question: 'In the second paragraph, find a sentence that shows the character was scared.',
        answer: '"I was so scared that my hands were shaking like leaves in the wind."',
      },
      {
        id: 5,
        question: 'What is the "Setting" of the story above?',
        answer: 'A dark Friday night in Chikomba village.',
      },
    ],
  },
  {
    id: 'descriptive',
    title: 'Descriptive Composition (The Artist)',
    description:
      'In a descriptive composition, you use words to paint a picture. You want the reader to feel like they are standing right there with you. Use Adjectives and the Five Senses: see, hear, smell, taste, and touch.',
    details: [
      'Sight: describe colours, shapes, sizes, and appearances.',
      'Sound: describe noises, voices, and silence.',
      'Smell: describe scents – pleasant or unpleasant.',
      'Taste: describe flavours, textures.',
      'Touch: describe textures, temperatures, and surfaces.',
      'Use similes and metaphors for comparison (e.g., "as white as a cloud").',
    ],
    examples: (
      <div className="bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-900 p-6 rounded-xl shadow-sm space-y-4 italic font-serif">
        <h4 className="not-italic font-black uppercase text-xs mb-2 text-orange-600 dark:text-orange-400 tracking-widest">
          Example: My Grandmother
        </h4>
        <p className="text-sm leading-relaxed">
          My grandmother, whom we call Gogo, is the most beautiful person I know. She is a short woman with skin that looks like soft, brown leather, covered in many tiny wrinkles that tell stories of a long life. Her hair is as white as a cloud and is always neatly tucked under a bright, colorful headscarf. Whenever she walks, her old beaded bangles make a soft clink-clink sound.
        </p>
        <p className="text-sm leading-relaxed">
          Gogo’s kitchen is my favorite place in the world. It always smells like woodsmoke and sweet roasted nuts. When you walk inside, the air is warm and thick with the scent of the herbal tea she brews on the fire. The walls are dark from the smoke of many years, but the floor is always swept so clean that it shines in the morning light.
        </p>
        <p className="text-sm leading-relaxed">
          When Gogo speaks, her voice is low and steady, like the sound of a calm river. She has a way of looking at you with her bright, intelligent eyes that makes you feel like you are the only person in the world. She never shouts; instead, she uses proverbs to teach us how to be good people. Her hands are rough from years of working in the fields, but her touch is as gentle as a feather.
        </p>
        <p className="text-sm leading-relaxed">
          Spending time with Gogo is like sitting in the sun on a cold day. She represents the history of our family and the kindness of our culture. Every time I leave her house, I feel full of peace and happiness. She is not just a grandmother; she is the heart of our home.
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the main goal of a descriptive composition?',
        answer: 'To paint a picture in the reader\'s mind.',
      },
      {
        id: 2,
        question: 'Name the five senses used in descriptive writing.',
        answer: 'Sight, Hearing, Smell, Taste, and Touch.',
      },
      {
        id: 3,
        question: 'Find one Simile (comparison using "like" or "as") in the example above.',
        answer: '"Hair as white as a cloud" or "voice like a calm river" or "touch as gentle as a feather".',
      },
      {
        id: 4,
        question: 'How did the writer describe the sound Gogo makes when she walks?',
        answer: 'The soft clink-clink of her beaded bangles.',
      },
      {
        id: 5,
        question: 'Why does the writer describe Gogo\'s hands as "rough"?',
        answer: 'To show she has worked hard in the fields for many years.',
      },
    ],
  },
  {
    id: 'expository',
    title: 'Expository Composition (The Teacher)',
    description:
      'Expository writing is used to explain something or give information. It is not a story; it is a collection of facts. You must be very clear and organized. Each paragraph should explain one specific part of the topic.',
    details: [
      'Fact-based: uses evidence and information, not opinions.',
      'Clear organization: each paragraph covers one subtopic.',
      'Topic sentences: each paragraph starts with a clear topic sentence.',
      'Definitions and examples: help the reader understand complex ideas.',
      'Neutral tone: objective and unbiased.',
    ],
    examples: (
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm space-y-4">
        <h4 className="font-black uppercase text-xs mb-2 text-indigo-600 dark:text-indigo-400 tracking-widest">
          Example: The Importance of Clean Water
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Clean water is the most important thing for human life. Our bodies are made mostly of water, and we cannot survive for more than a few days without it. In many parts of Zimbabwe, getting clean water is a daily struggle, but it is essential for keeping our families healthy and strong.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          One major reason clean water is important is for the prevention of diseases. When people drink dirty water from unprotected wells or rivers, they can catch illnesses like cholera and typhoid. These diseases make people very sick and can even cause death. By boiling water or using boreholes, we can keep our community safe from these germs.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Furthermore, clean water is necessary for hygiene and cleaning. We use water to wash our hands after using the toilet and before eating food. This simple act stops germs from spreading from one person to another. We also need clean water to wash our clothes and keep our homes tidy, which prevents pests like flies and cockroaches from coming near us.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, clean water is needed for growing the food we eat. Plants and livestock need water to grow. If the water used for gardens is full of chemicals or dirt, the food we eat might not be healthy for us. Therefore, protecting our rivers and dams from pollution is a job for everyone. In conclusion, clean water is the foundation of a healthy and happy life.
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What does "Expository" mean?',
        answer: 'It means to explain or give information.',
      },
      {
        id: 2,
        question: 'Why is water boiling mentioned in the second paragraph?',
        answer: 'To show a way to make water safe and prevent disease.',
      },
      {
        id: 3,
        question: 'What are the two diseases mentioned that come from dirty water?',
        answer: 'Cholera and Typhoid.',
      },
      {
        id: 4,
        question: 'What is the "Topic Sentence" of the third paragraph?',
        answer: '"Furthermore, clean water is necessary for hygiene and cleaning."',
      },
      {
        id: 5,
        question: 'Does an expository composition tell a fictional story?',
        answer: 'No, it uses facts to explain a real topic.',
      },
    ],
  },
  {
    id: 'persuasive',
    title: 'Persuasive Composition (The Lawyer)',
    description:
      'In persuasive writing, you are trying to convince the reader to agree with your opinion. You must give strong reasons and use words that show you are sure of yourself, like "clearly," "certainly," or "it is vital."',
    details: [
      'State your opinion clearly in the introduction.',
      'Give supporting reasons – at least three.',
      'Use logical evidence and examples.',
      'Acknowledge counterarguments (optional but effective).',
      'End with a strong conclusion that restates your position.',
    ],
    examples: (
      <div className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-900 p-6 rounded-xl shadow-sm space-y-4">
        <h4 className="font-black uppercase text-xs mb-2 text-purple-600 dark:text-purple-400 tracking-widest">
          Example: Why Every Student Should Play Sports
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          I strongly believe that every student at our school should be required to play at least one sport. Many students prefer to sit in the shade or play on their phones during break time, but this is not good for their development. Sports offer many benefits that go far beyond just having fun.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          First of all, sports are essential for physical health. In this modern world, many children are becoming unhealthy because they do not move enough. Playing soccer, netball, or running track helps to keep our hearts strong and our muscles flexible. A healthy body leads to a healthy mind, which helps us do better in our classroom lessons.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Secondly, sports teach us important life skills like teamwork and discipline. In a game of netball, you cannot win by yourself; you must work with your teammates. You learn how to follow rules and how to respect your captain and the referee. These are the same skills we will need when we grow up and get jobs in the future.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, playing sports is a great way to reduce stress. School can be very difficult, and students often feel worried about their exams. Running on the field allows us to release our energy and forget our worries for a while. It makes us feel happy and refreshed. For these reasons, I believe the school should make sports a part of every student’s daily schedule.
        </p>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the goal of a persuasive composition?',
        answer: 'To convince the reader to agree with an opinion.',
      },
      {
        id: 2,
        question: 'What is the writer\'s opinion in the example above?',
        answer: 'Every student should be required to play a sport.',
      },
      {
        id: 3,
        question: 'Name one life skill the writer says sports can teach.',
        answer: 'Teamwork (or discipline/respect).',
      },
      {
        id: 4,
        question: 'Why does the writer think sports help with schoolwork?',
        answer: 'Because a healthy body leads to a healthy mind.',
      },
      {
        id: 5,
        question: 'What is the purpose of the word "Finally" at the start of the fourth paragraph?',
        answer: 'To show that the writer is giving their last and final reason.',
      },
    ],
  },
  {
    id: 'letters',
    title: 'Letter Writing (Formal and Informal)',
    description:
      'Letter writing is a practical skill. There are two main types: Informal letters (to friends or family) and Formal letters (to authorities or businesses). Each has its own structure and tone.',
    details: [
      'Informal: friendly tone, personal news, casual language.',
      'Informal structure: address, date, salutation (Dear...), body, closing (Your friend...), signature.',
      'Formal: respectful tone, clear purpose, professional language.',
      'Formal structure: sender address, date, recipient address, salutation (Dear Sir/Madam), subject line, body, closing (Yours faithfully), signature.',
      'Always check the tone: informal for friends, formal for officials.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informal Letter */}
        <div className="bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 p-6 rounded-xl shadow-sm relative font-mono text-xs text-slate-700 dark:text-slate-300">
          <div className="absolute top-3 right-3 opacity-10">
            <MessageSquare size={32} />
          </div>
          <h4 className="not-italic font-black uppercase text-[10px] mb-4 text-blue-600 dark:text-blue-400 border-b pb-2 text-center">
            Informal Letter (To a Friend)
          </h4>
          <div className="text-right mb-4">
            123 Muzokomba St,<br />
            Mutare.<br />
            15 May 2024.
          </div>
          <div className="mb-4 font-black">Dear Simba,</div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            How are you doing? I hope you and your family are all healthy and happy in Masvingo. I am writing to tell you that I finally passed my mid-term English exam! I worked very hard, and I am so happy that my effort paid off.
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Next month, we are having a school holiday, and my parents said you can come and stay with us for a week. We can go to the mountains and play soccer every afternoon. Please ask your parents if you can come, and let me know soon. I miss our long talks and I can't wait to see you.
          </p>
          <div className="font-black">Your best friend,<br />Chipo.</div>
        </div>

        {/* Formal Letter */}
        <div className="bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 p-6 rounded-xl shadow-sm relative font-mono text-xs text-slate-700 dark:text-slate-300">
          <div className="absolute top-3 right-3 opacity-10">
            <Scale size={32} />
          </div>
          <h4 className="not-italic font-black uppercase text-[10px] mb-4 text-indigo-600 dark:text-indigo-400 border-b border-indigo-200 dark:border-indigo-800 pb-2 text-center">
            Formal Letter (To an Authority)
          </h4>
          <div className="text-right mb-4">
            Mutare High School,<br />
            P.O. Box 45,<br />
            Mutare.<br />
            15 May 2024.
          </div>
          <div className="text-left mb-4">
            The Headmaster,<br />
            Mutare High School,<br />
            Mutare.
          </div>
          <div className="mb-4 font-black">Dear Sir,</div>
          <div className="mb-4 font-black uppercase underline text-xs">
            RE: REQUEST TO START A SCHOOL GARDEN CLUB
          </div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            I am writing to formally request your permission to start a School Garden Club. Many students at our school are interested in agriculture and want to learn how to grow their own vegetables. We believe that using the empty land behind the sports field would be a perfect place for this project.
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            The garden would provide fresh vegetables for the school hostel and teach students valuable farming skills. We have already spoken to the Agriculture teacher, Mr. Moyo, and he has agreed to help us supervise the club. We hope you will consider our request favorably as it will benefit the entire school.
          </p>
          <div className="font-black">Yours faithfully,<br />(Signature)<br />Tendai Moyo.</div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the main difference between an informal and a formal letter?',
        answer: 'Informal letters are for friends/family with a casual tone; formal letters are for officials with a respectful, professional tone.',
      },
      {
        id: 2,
        question: 'In a formal letter, where do you put the sender\'s address?',
        answer: 'At the top right or top left (standard is top right).',
      },
      {
        id: 3,
        question: 'What is the purpose of the "Subject" line in a formal letter?',
        answer: 'To immediately tell the reader what the letter is about.',
      },
      {
        id: 4,
        question: 'How do you close an informal letter?',
        answer: 'With "Your friend" or "Yours truly" followed by a signature.',
      },
      {
        id: 5,
        question: 'In a formal letter, what do you write if you don\'t know the recipient\'s name?',
        answer: 'You use "Dear Sir" or "Dear Madam" or "Dear Sir/Madam".',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Report Writing (The Messenger)',
    description:
      'A report is a factual account of something that has happened. It is usually written for someone in authority (like a teacher or a headmaster). It must be objective, meaning you don\'t talk about your feelings; you just give the facts.',
    details: [
      'Heading: includes To, From, Date, Subject.',
      'Introduction: states the purpose and background.',
      'Activities/Findings: what happened or was observed.',
      'Conclusion: summarises and may give recommendations.',
      'Objective tone: no personal opinions or emotions.',
      'Clear structure with headings or sections.',
    ],
    examples: (
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm space-y-4">
        <h4 className="font-black uppercase text-xs mb-2 text-slate-700 dark:text-slate-300 tracking-widest">
          Example: Report on a School Trip to Great Zimbabwe
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-bold uppercase mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>To: The Headmaster</div>
          <div>From: Tendai Moyo (Form 1 Class Monitor)</div>
          <div>Date: 20 May 2024</div>
          <div>Subject: Report on the Educational Trip to Great Zimbabwe</div>
        </div>
        <div className="space-y-4">
          <div>
            <h5 className="font-black text-[10px] uppercase text-indigo-600 dark:text-indigo-400">Introduction:</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              On the 15th of May, 2024, the Form 1 class went on an educational trip to the Great Zimbabwe National Monument in Masvingo. The purpose of the trip was to learn about the history of our country and see the ancient stone structures we studied in class.
            </p>
          </div>
          <div>
            <h5 className="font-black text-[10px] uppercase text-indigo-600 dark:text-indigo-400">Activities:</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We arrived at the site at 10:00 AM. Our guide, Mr. Sibanda, took us to the Hill Complex first. He explained how the ancient kings lived there many years ago. After that, we went down to the Great Enclosure. We were amazed by the high stone walls that were built without any cement or mortar. We also saw the famous Conical Tower.
            </p>
          </div>
          <div>
            <h5 className="font-black text-[10px] uppercase text-indigo-600 dark:text-indigo-400">Observation:</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The students were very well-behaved and took many notes. However, the bus was a bit late to pick us up in the afternoon, which meant we arrived back at school after dark. Also, some of the information signs at the monument were difficult to read because they were old.
            </p>
          </div>
          <div>
            <h5 className="font-black text-[10px] uppercase text-indigo-600 dark:text-indigo-400">Conclusion:</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              In conclusion, the trip was very successful. All students learned a lot about our ancestors' building skills. I recommend that next year, the school should plan to stay for two days so we can see more of the ruins.
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Who is the report written to?',
        answer: 'The Headmaster.',
      },
      {
        id: 2,
        question: 'What is the purpose of the "Subject" line?',
        answer: 'To tell the reader immediately what the report is about.',
      },
      {
        id: 3,
        question: 'Is a report based on feelings or facts?',
        answer: 'Facts.',
      },
      {
        id: 4,
        question: 'What was the main problem mentioned in the "Observation" section?',
        answer: 'The bus was late to pick them up.',
      },
      {
        id: 5,
        question: 'Who wrote this report?',
        answer: 'Tendai Moyo.',
      },
    ],
  },
  {
    id: 'summary',
    title: 'Summary Writing (The Shortcut)',
    description:
      'Summarizing is taking a long piece of writing and making it very short while keeping only the main points. You must use your own words and avoid repeating the same thing.',
    details: [
      'Read the passage carefully to understand the main idea.',
      'Identify the key points – ignore minor details and examples.',
      'Write the summary in your own words – do not copy the original.',
      'Keep it concise – usually one-third or less of the original length.',
      'Do not add your own opinions or extra information.',
      'Check that your summary flows logically.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
          <h4 className="font-black uppercase text-xs text-blue-300 tracking-widest">Step 1: Read the passage</h4>
          <div className="p-4 bg-white/10 italic text-sm leading-relaxed">
            "Cooking sadza is an art that requires patience. First, you must boil water in a large pot. While the water is boiling, you mix a little bit of mealie-meal with cold water to make a paste. When the water bubbles, you add the paste and stir quickly so there are no lumps. You must let it cook for about fifteen minutes. Finally, you add more mealie-meal and 'shonga' (stir strongly) until the sadza is thick and smooth. It is best served hot with meat or vegetables."
          </div>
          <h4 className="font-black uppercase text-xs text-blue-300 tracking-widest">Step 2: Identify the Main Points</h4>
          <ul className="list-decimal pl-5 text-sm font-medium space-y-1">
            <li>Boil water in a pot.</li>
            <li>Mix mealie-meal with cold water and add to the pot.</li>
            <li>Stir to avoid lumps and cook for 15 minutes.</li>
            <li>Add more mealie-meal and stir until thick.</li>
          </ul>
          <h4 className="font-black uppercase text-xs text-green-400 tracking-widest">Step 3: Write the Summary (in 40 words or less)</h4>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm font-black leading-relaxed">
              <span className="text-green-400">Summary:</span> To cook sadza, boil water and add a mealie-meal paste, stirring to prevent lumps. After simmering for fifteen minutes, add more mealie-meal and stir strongly until the mixture becomes thick and smooth. Serve while hot. (38 words).
            </p>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What is the goal of a summary?',
        answer: 'To make a long text short while keeping the main ideas.',
      },
      {
        id: 2,
        question: 'Should you include every small detail in a summary?',
        answer: 'No, only the most important points.',
      },
      {
        id: 3,
        question: 'Whose words should you try to use in a summary?',
        answer: 'Your own words.',
      },
      {
        id: 4,
        question: 'If a story is 100 words long, about how long should the summary be?',
        answer: 'Usually about one-third (around 30-40 words).',
      },
      {
        id: 5,
        question: 'Why is "Serve while hot" included? (Is it a main point or a detail?)',
        answer: 'It is a detail, but it tells you how to finish the process.',
      },
    ],
  },
  {
    id: 'final-practice',
    title: 'Final Writing Practice',
    subtitle: 'Put it all together',
    description:
      'Now that you have learned the different types of compositions, it\'s time to practice. Choose a task, plan your writing, and apply the skills you have learned. Remember the writing process: brainstorm, organize, draft, revise, edit.',
    details: [
      'Choose one of the prompts below.',
      'Plan your response using a mind map or outline.',
      'Write a draft (don\'t worry about mistakes).',
      'Revise for clarity and content.',
      'Proofread for spelling, grammar, and punctuation.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Narrative</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Write a story (4 paragraphs) about a time you helped someone in your village.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">Descriptive</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Write 4 paragraphs describing your school during a very rainy day.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Persuasive</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Write a letter to your local councillor asking for a new borehole in your area.</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Report</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Imagine there was a sports day at school. Write a short report to your teacher about what happened.</p>
        </div>
        <div className="md:col-span-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Summary</span>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Read a paragraph from your Science book and summarize it into just two sentences.</p>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which step of the writing process comes after drafting?',
        answer: 'Revising (then Editing/Proofreading).',
      },
      {
        id: 2,
        question: 'Why is brainstorming important before you start writing?',
        answer: 'It helps you gather ideas and see connections before you commit to a structure.',
      },
      {
        id: 3,
        question: 'What is the purpose of an outline?',
        answer: 'To organize your ideas in a logical order before you write the full draft.',
      },
      {
        id: 4,
        question: 'True or False: You should proofread your work only after you have revised it.',
        answer: 'True – proofreading is the final step for fixing small errors.',
      },
      {
        id: 5,
        question: 'If you are writing a narrative, what should you include in the introduction?',
        answer: 'The setting, characters, and a hint of the problem/conflict.',
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = SECTIONS_DATA.map((s) => ({ id: s.id, label: s.title.split(' ')[0] }));

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE QUESTION COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const InteractiveQuestion = memo(
  ({
    question,
    answer,
    index,
  }: {
    question: string;
    answer: React.ReactNode;
    index: number;
  }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Question {index}
          </span>
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isRevealed
                ? 'text-green-600 dark:text-green-400'
                : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
            }`}
          >
            {isRevealed ? (
              <>
                <CheckCircle size={14} /> Answer
              </>
            ) : (
              <>
                <HelpCircle size={14} /> Reveal
              </>
            )}
          </button>
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {question}
        </p>
        {isRevealed && (
          <div className="mt-3 animate-dropdown-reveal rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
              {answer}
            </div>
          </div>
        )}
      </div>
    );
  },
  (prev, next) => prev.index === next.index && prev.question === next.question
);

// ──────────────────────────────────────────────────────────────────────────────
// SECTION CARD COMPONENT (memoized)
// ──────────────────────────────────────────────────────────────────────────────
const SectionCard = memo(
  ({ section, isHighlighted }: { section: Section; isHighlighted: boolean }) => {
    return (
      <div
        id={`section-${section.id}`}
        className={`rounded-xl border p-4 md:p-6 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isHighlighted
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/50 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
      >
        <h3
          className={`text-xl md:text-2xl font-bold mb-1 ${
            isHighlighted
              ? 'text-indigo-900 dark:text-indigo-100'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {section.title}
        </h3>
        {section.subtitle && (
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            {section.subtitle}
          </p>
        )}
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {section.description}
        </p>

        {/* Details as bullet list */}
        <div className="mb-4 rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5">
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {section.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples (rich content) */}
        {section.examples && <div className="mb-4">{section.examples}</div>}

        {/* Questions */}
        <div className="space-y-3 mt-2">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2"> Test Your Knowledge
          </h4>
          {section.questions.map((q, idx) => (
            <InteractiveQuestion
              key={q.id}
              question={q.question}
              answer={q.answer}
              index={idx + 1}
            />
          ))}
        </div>
      </div>
    );
  },
  (prev, next) => prev.isHighlighted === next.isHighlighted
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const CompositionWriting2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!inputValue.trim()) return SECTIONS_DATA;
    const query = inputValue.toLowerCase();
    return SECTIONS_DATA.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.details.some((d) => d.toLowerCase().includes(query)) ||
        s.questions.some((q) => q.question.toLowerCase().includes(query))
    );
  }, [inputValue]);

  // Determine which section to show
  const visibleSections = useMemo(() => {
    if (filteredSections.length === 0) return [];
    if (inputValue.trim()) return filteredSections;
    const active = SECTIONS_DATA[activeSectionIndex];
    return active ? [active] : [];
  }, [filteredSections, activeSectionIndex, inputValue]);

  // Debounced search highlight
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }
    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = SECTIONS_DATA.find(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.details.some((d) => d.toLowerCase().includes(query)) ||
          s.questions.some((q) => q.question.toLowerCase().includes(query))
      );
      if (match) {
        setHighlightedId(match.id);
        window.setTimeout(() => {
          const el = document.getElementById(`section-${match.id}`);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 0);
      } else {
        setHighlightedId(null);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    setHighlightedId(null);
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "essay" comes from the French "essayer" meaning "to try." Writing is about trying to express your thoughts clearly.',
      },
      {
        title: 'Pro Tip',
        text: 'When writing a narrative, show don\'t tell. Instead of saying "he was scared," describe his heart pounding and his hands shaking.',
      },
      {
        title: 'Memory Trick',
        text: 'For descriptive writing, remember the "5 Ws" plus "How" – but focus on senses: see, hear, smell, taste, touch.',
      },
      {
        title: 'Common Mistake',
        text: 'In persuasive writing, don\'t just state your opinion; back it up with strong reasons and evidence.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The word "essay" comes from the French "essayer" meaning "to try." Writing is about trying to express your thoughts clearly.',
      },
      {
        title: 'Pro Tip',
        text: 'When writing a narrative, show don\'t tell. Instead of saying "he was scared," describe his heart pounding and his hands shaking.',
      },
      {
        title: 'Memory Trick',
        text: 'For descriptive writing, remember the "5 Ws" plus "How" – but focus on senses: see, hear, smell, taste, touch.',
      },
      {
        title: 'Common Mistake',
        text: 'In persuasive writing, don\'t just state your opinion; back it up with strong reasons and evidence.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="mx-auto px-[5px] sm:px-6 md:px-8">
        <div className="flex w-full items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_TABS.map((tab, idx) => {
            const isActive = activeSectionIndex === idx && !inputValue.trim();
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(idx)}
                className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                  isActive
                    ? 'bg-purple-600 border-b-4 border-purple-900 text-white shadow-sm'
                    : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Duolingo Gradient Header ───────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-700 border-b-4 border-purple-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-purple-400/30 text-white border border-purple-200/40 shadow-xs">
                ADVANCED WRITING
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • English
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                📚 {SECTIONS_DATA.length} sections
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                ✨ {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)} questions
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            Advanced Writing
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 font-medium">
            Master different types of compositions: narrative, descriptive,
            expository, persuasive, letters, reports, and summaries. Learn the
            structure and style of each, then practice with interactive questions.
          </p>

          {/* Duolingo Search Bar */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-black/20 backdrop-blur-md rounded-2xl border-2 border-white/25 focus-within:border-white focus-within:bg-black/30 transition-all shadow-inner">
              <Search className="ml-4 text-white/70" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a writing type or question..."
                className="w-full bg-transparent border-none outline-none py-2.5 px-3 text-sm text-white placeholder-white/60 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    setHighlightedId(null);
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-6">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {inputValue.trim()
                  ? `Search results (${filteredSections.length})`
                  : `${SECTION_TABS[activeSectionIndex]?.label || ''}`}
              </span>
              <span>{visibleSections.length} shown</span>
            </div>

            {visibleSections.length > 0 ? (
              visibleSections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  isHighlighted={section.id === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No sections match your search.
              </div>
            )}

            {/* Duolingo-Styled Next / Previous Navigation Footer */}
            {!inputValue.trim() && (
              <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 dark:border-slate-800 pt-6">
                <button
                  onClick={() => scrollToSection(Math.max(0, activeSectionIndex - 1))}
                  disabled={activeSectionIndex === 0}
                  className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-5 py-2.5 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-[#27272a] active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
                >
                  ← Previous
                </button>
                <span className="text-xs font-black tracking-wider text-slate-400">
                  {activeSectionIndex + 1} / {SECTION_TABS.length}
                </span>
                <button
                  onClick={() => scrollToSection(Math.min(SECTION_TABS.length - 1, activeSectionIndex + 1))}
                  disabled={activeSectionIndex === SECTION_TABS.length - 1}
                  className="rounded-2xl border-2 border-b-4 border-purple-800 bg-purple-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-sm transition hover:bg-purple-700 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Writing Tip
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Composition Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.length - 1} + practice
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total Questions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Example texts</span>
                  <span className="font-bold text-green-600 dark:text-green-400">✓ 6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Good writing is a process. Plan, draft, revise, and proofread. Each
                composition type has its own purpose and structure. Practice makes
                perfect!
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Narrative:</strong> Tells a story
                with a plot, characters, and setting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Descriptive:</strong> Paints a
                picture using the five senses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Expository:</strong> Explains or
                gives information clearly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Persuasive:</strong> Convinces the
                reader to agree with an opinion.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Letters &amp; Reports:</strong>{' '}
                Practical formats with specific structures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Summary:</strong> Condenses a text
                to its main points.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompositionWriting2;
