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
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Info,
  ClipboardList,
  Shirt,
  Bug,
  Zap,
  User,
  MessageSquare,
  AlertCircle,
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
  examples: React.ReactNode;
  questions: Question[];
}

interface ClassNote {
  point: string;
  explanation: string;
}

interface ClassNoteGroup {
  heading: string;
  introduction: string;
  notes: ClassNote[];
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: History of Southern Africa Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'late-stone-age',
    title: 'The Late Stone Age Period',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The Late Stone Age was characterised by the use of bone, wood and stone tools. Tools of the Late Stone Age were digging sticks, scrapers, clubs, flakes, stone tipped arrows, hand axes and stone hammers.',
    details: [
      'Economic activities of the Late Stone Age:',
      '• They hunted small animals like hares and teamed up for bigger ones like kudus and impalas.',
      '• They used snares to catch rabbits and they used traps to catch big game like buffaloes.',
      '• They also used poisoned arrows to kill animals. They extracted poison from reptiles such as snakes and from insects such as spiders and from scorpions.',
      '• They gathered wild fruits, roots, vegetables, and insects.',
      '• They caught fish using hooks made from bones.',
      '• They domesticated dogs.',
      '',
      'Social system of the Late Stone Age:',
      '• They lived in caves.',
      '• They were nomadic, that is they moved from one place to another in search of animals, fruits and the like.',
      '• They worked communally.',
      '• There was division of labour, for instance, women and children gathered while men hunted.',
      '• They married a single wife.',
      '• They lived and travelled in small groups.',
      '• They had small families.',
      '',
      'Political organisation of the Late Stone Age:',
      '• There was no ruling class and subject people.',
      '• There were no states.',
      '• There was no centralised political system.',
      '• They settled their disputes communally.',
      '• They were ruled by a family head.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
            Key Tools of the Late Stone Age
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center text-sm">
              <span className="font-bold">Digging</span>
              <span className="block text-xs text-slate-500">Sticks</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center text-sm">
              <span className="font-bold">Scrapers</span>
              <span className="block text-xs text-slate-500">Bone/Stone</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center text-sm">
              <span className="font-bold">Clubs</span>
              <span className="block text-xs text-slate-500">Wood</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center text-sm">
              <span className="font-bold">Hand Axes</span>
              <span className="block text-xs text-slate-500">Stone</span>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What type of tools were used during the Late Stone Age?',
        answer: 'Bone, wood and stone tools.',
      },
      {
        id: 2,
        question: 'How did Late Stone Age people catch big game like buffaloes?',
        answer: 'They used traps and poisoned arrows.',
      },
      {
        id: 3,
        question: 'What was the social system like during the Late Stone Age?',
        answer: 'They lived in caves, were nomadic, worked communally, had division of labour, married a single wife, lived in small groups, and had small families.',
      },
      {
        id: 4,
        question: 'How were disputes settled during the Late Stone Age?',
        answer: 'They settled their disputes communally.',
      },
      {
        id: 5,
        question: 'Who ruled the people during the Late Stone Age?',
        answer: 'They were ruled by a family head.',
      },
    ],
  },
  {
    id: 'early-iron-age',
    title: 'The Changes from Late Stone Age to Early Iron Age',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The Early Iron Age brought significant economic, social and political changes to Southern Africa. Iron tools replaced stone tools, leading to more efficient farming, hunting and trade.',
    details: [
      'Economic Changes during the Early Iron Age:',
      '• People began to make iron tools like hoes, arrow heads, spear heads, axes, knives, iron swords, fishing hooks and the like. These were more efficient than wood and stone tools of the Stone Age.',
      '• Iron tools enabled people to cut trees and clear more land for agriculture.',
      '• They began to grow crops like sorghum and millet using iron tools.',
      '• Production of food resulted in surplus.',
      '• There was food security.',
      '• Hunting was improved by the use of iron tools which were more efficient than stone tools.',
      '• Fishing was improved by the use of iron fishing hooks. They began to catch fish on a large scale.',
      '• They began to domesticate animals like cattle, goats and sheep along river valleys.',
      '• They began to mine minerals like gold, copper, iron and tin, lead and silver.',
      '• They began to trade in gold, iron and ivory as well as with surplus products.',
      '• They began to raid each other for grain and cattle.',
      '• They began to pay tribute to the chiefs in form of grain, cattle, ivory and iron tools.',
      '• Basketry was introduced. They wove baskets like the winnowing basket.',
      '• Pottery was introduced. They made clay pots to carry and store water and milk.',
      '',
      'Social Changes during the Early Iron Age:',
      '• Availability of food resulted in a rise in population.',
      '• They began to build permanent shelters of pole and dagga.',
      '• Polygamy was practiced. This was due to production of surplus.',
      '• They began to pay lobola to their in-laws in form of cattle and iron tools.',
      '• Cattle were a symbol of status.',
      '• There was clear division of labour, women cultivated crops while men hunted and herded.',
      '• There was specialisation in areas such as mining, blacksmithing, weaving, basketry, trade, fishing and hunting.',
      '• They began to live in large groups of about 200 people.',
      '• Classes emerged as some became rich whilst others remained poor.',
      '• Exploitation of men by men became more apparent, for example, those with many cattle employed those without as herd boys.',
      '• There was development of cattle loaning system [kuronzera].',
      '• They began to bury the dead in graves.',
      '• There was emergence of religious ceremonies such as rain making ceremony.',
      '',
      'Political Changes during the Early Iron Age:',
      '• They lived in clans.',
      '• There was emergence of chiefs and headmen.',
      '• Chiefs and headmen made laws.',
      '• Chiefs and headmen distributed land to the people.',
      '• Subjects paid tribute to the chiefs to show loyalty.',
      '• Chiefs controlled trade.',
      '• Stronger chiefs began to raid weaker ones.',
      '• Chiefs and headmen judged cases.',
      '• Chiefs led at religious ceremonies.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              Animals Kept
            </h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Cattle</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Goats</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Sheep</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Pigs</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Chicken</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Donkeys</span>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
              Crops Grown
            </h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Sorghum</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Finger Millet</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Cowpeas</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Beans</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Pumpkins</span>
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Melons</span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
            Crafts Practised
          </h5>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Weaving</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Basketry</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Pottery</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Blacksmithing</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Leather Work</span>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-center">Wood Carving</span>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What were the economic changes during the Early Iron Age?',
        answer: 'People began to make iron tools, grow crops like sorghum and millet, domesticate animals, mine minerals, trade, and introduce basketry and pottery.',
      },
      {
        id: 2,
        question: 'What animals were kept by Early Iron Age people?',
        answer: 'Cattle, goats, sheep, pigs, cats, chicken, donkeys and dogs.',
      },
      {
        id: 3,
        question: 'What social changes occurred during the Early Iron Age?',
        answer: 'Rise in population, permanent shelters, polygamy, lobola payment, cattle as status symbol, division of labour, specialisation, living in large groups, emergence of classes, cattle loaning system, burial in graves, and religious ceremonies.',
      },
      {
        id: 4,
        question: 'What political changes happened during the Early Iron Age?',
        answer: 'Emergence of chiefs and headmen who made laws, distributed land, controlled trade, raided weaker chiefs, judged cases, and led religious ceremonies.',
      },
      {
        id: 5,
        question: 'What minerals were mined during the Early Iron Age?',
        answer: 'Gold, copper, iron, tin, lead and silver.',
      },
    ],
  },
  {
    id: 'early-iron-age-benefits',
    title: 'Benefits and Effects of Early Iron Age Changes',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The changes from the Stone Age to the Early Iron Age had both positive and negative effects on the communities of Southern Africa.',
    details: [
      'Benefits of these changes to the communities of Southern Africa:',
      '• The iron agers had more food and balanced diet [meat, milk and grain].',
      '• They were able to clear more land for crop cultivation.',
      '• They began to settle at one place.',
      '• They began to build more permanent shelters.',
      '• They were able to kill larger animals due to efficient iron tools.',
      '• Trade developed as a source of foreign goods.',
      '• They had better weapons.',
      '',
      'Negative Effects of these changes to communities of Southern Africa:',
      '• There was competition for hunting grounds, pastures and land for cultivation.',
      '• Classes began to emerge-lower classes were exploited.',
      '• Women were exploited as they were given more arduous tasks like crop cultivation.',
      '• They began to raid each other for cattle and grain.',
      '• The manufacture of iron tools promoted warfare and increased killing rate of animals.',
      '• Poor classes in weaker societies began to pay tribute in form of labour, cattle and grain to stronger and wealthy political units.',
      '',
      'Contribution of iron technology to the rise of classes:',
      '• Iron technology engendered [resulted in] surplus production and emergence of haves and have nots.',
      '• Iron technology led to the emergence of miners, blacksmiths and traders as separate classes.',
      '• Surplus production begot [resulted in] polygamy, a source of labour.',
      '• Craft workers such as potters, weavers, basket makers and the like, could concentrate on their work.',
      '',
      'Other factors which led to emergence of classes:',
      '• Lineage and clan leaders developed into ruling classes.',
      '• Defeat in wars resulted in vassalage.',
      '• Trade before iron technology also contributed.',
      '• Charisma of people made them candidates for leadership.',
      '',
      'Contribution of Iron Age Changes to development of chiefdoms:',
      '• Cattle loaning led to extension of political influence.',
      '• Surplus grain led to rise in status and need to control areas with valuable resources such as gold and ivory.',
      '• The growth of larger communities necessitated the rise of chiefdoms to maintain law and order in the community.',
      '• Polygamy promoted marriage alliances.',
      '• Desire to control trade routes led to rise of chiefdoms.',
      '',
      'Other factors which led to the development of chiefdoms:',
      '• Rise of ambitious leaders.',
      '• Military prowess leading to conquest of other people.',
      '• The desire to collect tribute.',
      '• The desire for protection from invaders.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase mb-2 text-center">
            ✅ Benefits
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• More food and balanced diet</li>
            <li>• Clear more land for crops</li>
            <li>• Permanent settlements</li>
            <li>• Better shelters</li>
            <li>• Kill larger animals</li>
            <li>• Trade developed</li>
            <li>• Better weapons</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase mb-2 text-center">
            ❌ Negative Effects
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Competition for resources</li>
            <li>• Classes emerged</li>
            <li>• Women exploited</li>
            <li>• Raids for cattle and grain</li>
            <li>• Warfare increased</li>
            <li>• Tribute paid to stronger units</li>
          </ul>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What were the benefits of Early Iron Age changes?',
        answer: 'More food and balanced diet, ability to clear more land, permanent settlements, better shelters, ability to kill larger animals, development of trade, and better weapons.',
      },
      {
        id: 2,
        question: 'What were the negative effects of Early Iron Age changes?',
        answer: 'Competition for resources, emergence of classes, exploitation of women, raids for cattle and grain, increased warfare, and payment of tribute to stronger political units.',
      },
      {
        id: 3,
        question: 'How did iron technology contribute to the rise of classes?',
        answer: 'It led to surplus production, emergence of haves and have nots, separate classes of miners, blacksmiths and traders, polygamy as a source of labour, and craft specialisation.',
      },
      {
        id: 4,
        question: 'How did Iron Age changes contribute to the development of chiefdoms?',
        answer: 'Through cattle loaning, surplus grain, growth of larger communities, polygamy promoting marriage alliances, and desire to control trade routes.',
      },
      {
        id: 5,
        question: 'What other factors led to the development of chiefdoms?',
        answer: 'Rise of ambitious leaders, military prowess, desire to collect tribute, and desire for protection from invaders.',
      },
    ],
  },
  {
    id: 'late-iron-age',
    title: 'The Changes from Early Iron Age to Late Iron Age',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The Late Iron Age saw the formation of states like Great Zimbabwe, Mutapa and Rozvi. There were significant political, social and economic changes during this period.',
    details: [
      'Political Changes during the Late Iron Age:',
      '• There was formation of states like Great Zimbabwe, Mutapa and Rozvi.',
      '• There was emergence of kingship.',
      '• The king was the head of the state.',
      '• Kingship was hereditary.',
      '• The king was the chief judge.',
      '• The king was the religious leader.',
      '• The king controlled trade.',
      '• All subjects began to pay tribute to the king to show loyalty.',
      '• The king kept an army for raiding and for defence.',
      '• The king levied fines to his subjects who misbehaved.',
      '• Wars were arising out of disputes over succession.',
      '• The king appointed chiefs.',
      '',
      'Contribution of trade to state formation:',
      '• Communities fought to control resources or trade like gold mines and forests with elephants, leading to formation of large states.',
      '• Communities fought to control trade routes and expanded states.',
      '• Rulers demanded tribute in form of valuable commodities.',
      '• Wealth and power developed from trade.',
      '',
      'Other factors which led to formation of states:',
      '• The rise of ambitious leaders.',
      '• Succession disputes.',
      '• State formation resulted from the need to control fertile soils and pastures.',
      '• Loaning of cattle to other communities led to spread of political influence.',
      '• Polygamy was an important source of labour and power.',
      '• Strong armies helped in state formation.',
      '',
      'Importance of the king\'s role in the Shona states:',
      '• The king had overall authority.',
      '• The king appointed chiefs.',
      '• The provided security to his people.',
      '• The king gave royal fire to the chiefs.',
      '• The king commanded the army.',
      '• The king distributed land to the people.',
      '• The king controlled trade.',
      '• The king was the religious leader.',
      '• The king was the chief judge.',
      '',
      'Other factors important in the Shona states:',
      '• Spirit mediums that chose and installed the kings.',
      '• The army defended the state, protected the king and collected tribute.',
      '• The army commander was also important.',
      '• Council of advisers was also important.',
      '• The ordinary people were also important for their allegiance.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
            Key States Formed
          </h5>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <span className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center font-bold">Great Zimbabwe</span>
            <span className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center font-bold">Mutapa</span>
            <span className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center font-bold">Rozvi</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
              King's Roles
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Overall authority</li>
              <li>• Appointed chiefs</li>
              <li>• Provided security</li>
              <li>• Commanded army</li>
              <li>• Distributed land</li>
              <li>• Controlled trade</li>
              <li>• Religious leader</li>
              <li>• Chief judge</li>
            </ul>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
              Important Factors
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Spirit mediums</li>
              <li>• Army defended state</li>
              <li>• Army commander</li>
              <li>• Council of advisers</li>
              <li>• Ordinary people</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What political changes occurred during the Late Iron Age?',
        answer: 'Formation of states like Great Zimbabwe, Mutapa and Rozvi, emergence of kingship, kings as heads of state, hereditary kingship, kings as chief judges and religious leaders, kings controlling trade, tribute payment, armies, and fines.',
      },
      {
        id: 2,
        question: 'How did trade contribute to state formation?',
        answer: 'Communities fought to control resources and trade routes, rulers demanded tribute in valuable commodities, and wealth and power developed from trade.',
      },
      {
        id: 3,
        question: 'What other factors led to the formation of states?',
        answer: 'Rise of ambitious leaders, succession disputes, need to control fertile soils and pastures, cattle loaning, polygamy, and strong armies.',
      },
      {
        id: 4,
        question: 'What was the importance of the king\'s role in Shona states?',
        answer: 'Overall authority, appointed chiefs, provided security, gave royal fire, commanded army, distributed land, controlled trade, religious leader, and chief judge.',
      },
      {
        id: 5,
        question: 'What other factors were important in the Shona states?',
        answer: 'Spirit mediums, the army, army commander, council of advisers, and ordinary people.',
      },
    ],
  },
  {
    id: 'late-iron-age-social-economic',
    title: 'Social and Economic Changes of the Late Iron Age',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The Late Iron Age brought significant social and economic changes to Southern Africa, including more permanent settlements, larger villages, belief systems, and expanded economic activities.',
    details: [
      'Social Changes during the Late Iron Age:',
      '• They began to build more permanent settlements.',
      '• During this period there began to appear stone buildings.',
      '• They began to prefer to settle near water sites and hills.',
      '• They preferred good farming lands and defensive sites.',
      '• There was an increase in the size of settled villages.',
      '• They believed in God [Mwari].',
      '• They believed in spirit mediums and ancestral spirits.',
      '',
      'Economic Changes during the Late Iron Age:',
      '• They reared animals like cattle, goats and sheep on a large scale.',
      '• They cultivated crops like sorghum, millet and Rapoko on a large scale.',
      '• They began to store grain for a long time in granaries.',
      '• There was a clear association of wealth, cattle and social status.',
      '• External trade became more pronounced.',
      '• There was an increase in minerals mined.',
      '• Hunting and gathering continued but became less important as people mainly concentrated on crop cultivation and animal rearing.',
      '• Subjects began to pay tribute to the king in form of cattle, grain and the like.',
      '• They raided weaker states for grain and cattle.',
      '',
      'Minerals mined during the Late Iron Age:',
      '• Gold, Copper, Iron, Lead, Zinc, Silver, Tin, Coal, Salt, Diamonds, Chrome, Nickel, Lithium, Platinum, Asbestos, Emeralds.',
      '',
      'Uses of gold during the Late Iron Age:',
      '• Trade, status symbol, payment of tribute, making jewellery like bangles and ear rings.',
      '',
      'Problems faced by miners during the Late Iron Age Period:',
      '• Flooding of mines in the rain season - loss of lives.',
      '• Poor mining tools - they used slow methods of mining.',
      '• Collapse of mines.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
              Social Changes
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Permanent settlements</li>
              <li>• Stone buildings</li>
              <li>• Settled near water and hills</li>
              <li>• Good farming lands</li>
              <li>• Larger villages</li>
              <li>• Belief in God [Mwari]</li>
              <li>• Spirit mediums</li>
            </ul>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
              Economic Changes
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Large scale animal rearing</li>
              <li>• Large scale crop cultivation</li>
              <li>• Grain storage in granaries</li>
              <li>• Wealth = cattle = status</li>
              <li>• External trade</li>
              <li>• More minerals mined</li>
              <li>• Tribute payment</li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
            Minerals Mined
          </h5>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Gold</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Copper</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Iron</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Tin</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Coal</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Salt</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Diamonds</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Chrome</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Nickel</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Lithium</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Platinum</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Asbestos</span>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What were the social changes during the Late Iron Age?',
        answer: 'Permanent settlements, stone buildings, settled near water and hills, larger villages, belief in God [Mwari], and belief in spirit mediums and ancestral spirits.',
      },
      {
        id: 2,
        question: 'What were the economic changes during the Late Iron Age?',
        answer: 'Large scale animal rearing and crop cultivation, grain storage, association of wealth with cattle, external trade, more minerals mined, tribute payment, and raids for grain and cattle.',
      },
      {
        id: 3,
        question: 'What minerals were mined during the Late Iron Age?',
        answer: 'Gold, copper, iron, lead, zinc, silver, tin, coal, salt, diamonds, chrome, nickel, lithium, platinum, asbestos, and emeralds.',
      },
      {
        id: 4,
        question: 'What were the uses of gold during the Late Iron Age?',
        answer: 'Trade, status symbol, payment of tribute, and making jewellery like bangles and ear rings.',
      },
      {
        id: 5,
        question: 'What problems did miners face during the Late Iron Age?',
        answer: 'Flooding of mines causing loss of lives, poor mining tools with slow methods, and collapse of mines.',
      },
    ],
  },
  {
    id: 'late-iron-age-importance',
    title: 'Importance of Cattle and Trade',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Cattle and trade were extremely important to the Late Iron Age communities of Southern Africa. They shaped the economy, social structure, and political organisation of these societies.',
    details: [
      'Importance of cattle to the Late Iron Age communities of Southern Africa:',
      '• Cattle ownership was a status symbol.',
      '• Cattle were a source of food such as milk and meat.',
      '• Cattle were slaughtered on special occasions such as ritual ceremonies.',
      '• Cattle skins were used for making drums, shields and leather clothes.',
      '• Cattle were used for paying lobola.',
      '• They were loaned so as to establish political influence.',
      '• They were used for paying tribute.',
      '• For paying fines.',
      '• For trade.',
      '• For transport.',
      '• Draught power.',
      '• For inheritance.',
      '• Embodiment of spirits.',
      '• For paying avenging spirits [Ngozi].',
      '• For manure.',
      '',
      'Importance of trade to the Late Iron Age communities of Southern Africa:',
      '• People of Southern Africa traded locally and externally. Items traded were cattle, grain, iron tools, ornaments, pottery and the like.',
      '• They imported glass beads, cloth, sea shells, guns and the like.',
      '• Glass beads were a sign of status.',
      '• Powerful rulers conquered new areas to control resources for trade in gold, ivory and trade routes.',
      '• Rulers demanded tribute in form of trade commodities, grew rich and powerful.',
      '• Trade brought influence of foreigners like Swahili, Arabs and Portuguese.',
      '• The king distributed trade items to reward subjects and lesser chiefs.',
      '• Trade unified people.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase mb-2 text-center">
            🐄 Importance of Cattle
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Status symbol</li>
            <li>• Source of food (milk, meat)</li>
            <li>• Ritual ceremonies</li>
            <li>• Drums, shields, leather</li>
            <li>• Lobola payment</li>
            <li>• Political influence</li>
            <li>• Tribute and fines</li>
            <li>• Trade and transport</li>
            <li>• Inheritance</li>
            <li>• Embodiment of spirits</li>
            <li>• Manure</li>
          </ul>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase mb-2 text-center">
            📦 Importance of Trade
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Local and external trade</li>
            <li>• Items: cattle, grain, tools</li>
            <li>• Imports: beads, cloth, guns</li>
            <li>• Glass beads = status</li>
            <li>• Control resources/routes</li>
            <li>• Tribute in commodities</li>
            <li>• Foreign influence</li>
            <li>• Rewarded subjects</li>
            <li>• Unified people</li>
          </ul>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What was the importance of cattle to Late Iron Age communities?',
        answer: 'Status symbol, source of food, ritual ceremonies, drums and shields, lobola payment, political influence, tribute and fines, trade, transport, inheritance, embodiment of spirits, avenging spirits, and manure.',
      },
      {
        id: 2,
        question: 'What items were traded during the Late Iron Age?',
        answer: 'Cattle, grain, iron tools, ornaments, pottery, and other local products.',
      },
      {
        id: 3,
        question: 'What items were imported during the Late Iron Age?',
        answer: 'Glass beads, cloth, sea shells, guns and the like.',
      },
      {
        id: 4,
        question: 'How did trade affect political power?',
        answer: 'Powerful rulers conquered new areas to control resources and trade routes, demanded tribute in commodities, grew rich and powerful, and distributed trade items to reward subjects.',
      },
      {
        id: 5,
        question: 'What foreign influences came through trade?',
        answer: 'Swahili, Arabs and Portuguese.',
      },
    ],
  },
];

// The source material above is retained for the questions and syllabus facts.
// These structured notes present the same ideas as proper point-and-explanation
// class notes instead of a long list of unexplained bullets.
const PROFESSIONAL_NOTES: Record<string, ClassNoteGroup[]> = {
  'late-stone-age': [
    {
      heading: 'Tools and economic activities',
      introduction: 'Late Stone Age communities survived by using the materials available around them and by working together to obtain food.',
      notes: [
        {
          point: 'They made tools from stone, bone and wood.',
          explanation: 'Their tools included hand axes, stone hammers, scrapers, flakes, digging sticks, clubs and stone-tipped arrows. Each tool had a purpose: scrapers cleaned animal skins, digging sticks helped people find roots, and arrows made hunting safer and more effective.',
        },
        {
          point: 'Hunting was an important source of food.',
          explanation: 'Individuals could hunt small animals such as hares, while groups worked together to hunt larger animals such as kudu, impala and buffalo. They also used snares, traps and arrows coated with poison obtained from snakes, spiders and scorpions.',
        },
        {
          point: 'Gathering provided food when hunting was unsuccessful.',
          explanation: 'Women and children commonly collected wild fruits, roots, vegetables and edible insects. Gathering was important because it gave the community a regular supply of food even when hunters returned without meat.',
        },
        {
          point: 'Fishing added variety to the diet.',
          explanation: 'People living near rivers and lakes caught fish with hooks made from bone. Fish supplied protein and reduced the community’s dependence on hunting alone.',
        },
        {
          point: 'Dogs were domesticated.',
          explanation: 'Dogs could help hunters track animals, warn people about danger and protect camps. Domestication therefore made daily life and hunting more secure.',
        },
      ],
    },
    {
      heading: 'Social organisation',
      introduction: 'Their way of life was shaped by the need to follow seasonal food and water supplies.',
      notes: [
        {
          point: 'They lived a nomadic life.',
          explanation: 'Nomadic means moving from one place to another instead of living permanently in one settlement. Communities moved when animals migrated or when local supplies of fruit, roots and water became scarce.',
        },
        {
          point: 'Caves and simple shelters provided temporary homes.',
          explanation: 'Caves protected people from rain, wind, cold weather and wild animals. Because groups moved regularly, they did not build the large permanent houses associated with later farming societies.',
        },
        {
          point: 'Work was communal and divided among members.',
          explanation: 'People shared important tasks for the good of the whole group. Men often hunted, while women and children gathered food, although everyone’s work contributed to survival.',
        },
        {
          point: 'Families and travelling groups were small.',
          explanation: 'Small groups could move quickly and required less food. Marriage was generally monogamous, meaning one husband had one wife, and families had fewer possessions to carry.',
        },
        {
          point: 'Food and possessions were shared.',
          explanation: 'A successful hunt or gathering trip benefited the whole group rather than one person. Sharing reduced hunger during difficult times and strengthened cooperation between families.',
        },
      ],
    },
    {
      heading: 'Political organisation',
      introduction: 'Political organisation was simple because communities were small and did not control large territories.',
      notes: [
        {
          point: 'The family head provided leadership.',
          explanation: 'The most senior or respected family member guided the group and helped it make decisions. Leadership was based on family responsibility rather than on a powerful king or government.',
        },
        {
          point: 'There were no centralised states or permanent ruling classes.',
          explanation: 'A centralised state has a ruler, officials, laws and control over a large area. Late Stone Age groups had none of these because they were small, mobile communities in which members were broadly equal.',
        },
        {
          point: 'Disputes were settled communally.',
          explanation: 'When a disagreement occurred, members discussed it together and sought an answer acceptable to the group. This helped preserve cooperation, which was essential for hunting and survival.',
        },
        {
          point: 'Leadership depended on age, experience and respect.',
          explanation: 'Skilled hunters and older members could influence decisions because the group trusted their knowledge. Their authority came from respect, not from a permanent or hereditary political office.',
        },
        {
          point: 'There was no permanent army or taxation system.',
          explanation: 'Small mobile groups defended one another when danger arose and did not need full-time soldiers. They also had no large government that required people to pay regular taxes.',
        },
      ],
    },
  ],
  'early-iron-age': [
    {
      heading: 'Economic changes',
      introduction: 'Iron technology changed how people produced food, obtained resources and exchanged goods.',
      notes: [
        {
          point: 'Iron tools were stronger and more efficient than stone tools.',
          explanation: 'Blacksmiths produced hoes, axes, knives, spearheads, arrowheads, swords and fishing hooks. These tools lasted longer, cut more effectively and allowed people to complete work more quickly.',
        },
        {
          point: 'Agriculture expanded and produced food surpluses.',
          explanation: 'Iron axes helped people clear woodland, while iron hoes made cultivation easier. Farmers grew sorghum and millet and stored surplus grain for poor seasons. Protecting fields and food stores also encouraged communities to build permanent settlements.',
        },
        {
          point: 'Animal keeping became more important.',
          explanation: 'Communities kept cattle, goats and sheep, especially near river valleys where water and grazing were available. Livestock supplied meat, milk, hides and wealth.',
        },
        {
          point: 'Mining, crafts and trade developed.',
          explanation: 'People mined resources such as iron, gold, copper and tin. Specialists made metal goods, pots and baskets, while traders exchanged minerals, ivory, tools and surplus food with other communities.',
        },
        {
          point: 'Raiding and tribute became part of the economy.',
          explanation: 'Some communities attacked others to obtain cattle and grain. Subjects also gave chiefs cattle, grain, ivory or iron tools as tribute, showing loyalty and supporting the leadership.',
        },
      ],
    },
    {
      heading: 'Social changes',
      introduction: 'Reliable food and settled life caused communities to grow larger and become more specialised.',
      notes: [
        {
          point: 'Population and village size increased.',
          explanation: 'A more dependable food supply supported more people. Families built permanent pole-and-dagga houses and lived in villages that could contain about two hundred people.',
        },
        {
          point: 'Division of labour and specialisation became clearer.',
          explanation: 'Women commonly cultivated crops, while men hunted and herded livestock. Some people became skilled miners, blacksmiths, potters, basket makers, weavers, fishers or traders instead of everyone doing exactly the same work.',
        },
        {
          point: 'Cattle shaped marriage, wealth and social status.',
          explanation: 'Families paid lobola with cattle or iron goods. Owning many cattle showed wealth, and cattle could be loaned through kuronzera, creating long-term relationships between rich owners and borrowers.',
        },
        {
          point: 'Social classes began to appear.',
          explanation: 'Some households controlled more cattle, grain or specialised skills than others. This created differences between rich and poor people, and poorer people could work for wealthy cattle owners as herd boys or labourers.',
        },
        {
          point: 'Religious and burial practices became more organised.',
          explanation: 'Communities buried the dead in graves and held ceremonies such as rain-making rituals. These practices strengthened shared beliefs and community identity.',
        },
      ],
    },
    {
      heading: 'Political changes',
      introduction: 'Larger settlements needed recognised leaders to allocate resources, settle disputes and maintain order.',
      notes: [
        {
          point: 'Clans were led by chiefs and headmen.',
          explanation: 'A clan was a group of related families. Chiefs and headmen became more powerful because they coordinated the larger community and represented it in dealings with neighbouring groups.',
        },
        {
          point: 'Leaders made laws and administered justice.',
          explanation: 'Chiefs and headmen judged cases, settled disputes and set rules. Their authority helped reduce conflict within growing settlements.',
        },
        {
          point: 'Leaders distributed land and controlled trade.',
          explanation: 'The chief decided where families could farm or graze livestock and supervised valuable trading activities. This control increased the chief’s wealth and political influence.',
        },
        {
          point: 'Tribute and warfare strengthened some chiefdoms.',
          explanation: 'Subjects paid tribute to show loyalty, while stronger chiefs sometimes raided weaker communities. Successful leaders gained cattle, grain, followers and territory.',
        },
        {
          point: 'Chiefs led important religious ceremonies.',
          explanation: 'Chiefs took part in rain-making ceremonies and communicated with ancestral spirits through religious specialists. This sacred role strengthened their authority because people linked good leadership with the welfare of the community.',
        },
      ],
    },
  ],
  'early-iron-age-benefits': [
    {
      heading: 'Benefits of Early Iron Age changes',
      introduction: 'Iron technology improved production and living conditions in several important ways.',
      notes: [
        {
          point: 'Communities produced more food and ate a more balanced diet.',
          explanation: 'Crop farming supplied grain, livestock supplied milk and meat, and hunting continued. Having different food sources improved nutrition and reduced the danger of relying on only one source.',
        },
        {
          point: 'Efficient tools increased agricultural production.',
          explanation: 'Iron axes cleared more land and iron hoes prepared soil more easily than stone or wooden tools. Larger cultivated areas could support bigger communities.',
        },
        {
          point: 'Permanent settlements and stronger shelters developed.',
          explanation: 'Farmers needed to remain near fields, livestock and stored grain. They therefore built durable pole-and-dagga houses and established settled village life.',
        },
        {
          point: 'Hunting, defence and trade improved.',
          explanation: 'Iron weapons helped hunters kill larger animals and allowed communities to defend themselves. Surplus food, minerals and manufactured goods also gave people more products to exchange through trade.',
        },
        {
          point: 'Pottery and basketry improved storage and daily work.',
          explanation: 'Clay pots kept water, milk and grain, while baskets helped people carry and winnow crops. These crafts made it easier to protect food and manage the larger harvests produced by farming.',
        },
      ],
    },
    {
      heading: 'Negative effects',
      introduction: 'The same changes that created wealth also caused competition, inequality and conflict.',
      notes: [
        {
          point: 'Competition for land and natural resources increased.',
          explanation: 'Farmers wanted fertile land, herders wanted pasture and hunters wanted good hunting grounds. As populations grew, neighbouring communities sometimes fought over these limited resources.',
        },
        {
          point: 'Economic classes and exploitation developed.',
          explanation: 'People who controlled cattle, grain, mines or trade became wealthy, while others remained poor. Poorer people could be required to work for the rich or pay tribute in labour and goods.',
        },
        {
          point: 'Women carried a heavier workload.',
          explanation: 'As crop cultivation expanded, women were often expected to perform demanding farm work as well as domestic duties. This produced an unequal division of labour.',
        },
        {
          point: 'Raiding and warfare became more destructive.',
          explanation: 'Iron weapons made attacks more effective. Communities raided one another for cattle and grain, and efficient weapons also increased the number of wild animals killed.',
        },
        {
          point: 'Pressure on the environment increased.',
          explanation: 'People cleared woodland for fields and cut trees to obtain fuel for iron smelting. Larger settlements and more effective hunting also reduced some forests, wild animals and other natural resources.',
        },
      ],
    },
    {
      heading: 'How social classes developed',
      introduction: 'A class is a group of people with a similar level of wealth, occupation or power.',
      notes: [
        {
          point: 'Surplus production separated the wealthy from the poor.',
          explanation: 'Families with extra grain, many cattle or control of valuable resources accumulated wealth. Families without these resources depended on wealthier households, creating “haves” and “have-nots.”',
        },
        {
          point: 'Specialist occupations formed distinct groups.',
          explanation: 'Miners, blacksmiths, traders, potters, weavers and basket makers developed valuable skills. A food surplus allowed them to concentrate on a craft instead of farming full-time.',
        },
        {
          point: 'Clan leadership developed into a ruling class.',
          explanation: 'Lineage and clan leaders gained control over land, tribute and decision-making. Their positions gave them greater authority and access to wealth than ordinary members of the community.',
        },
        {
          point: 'Cattle ownership increased inequality.',
          explanation: 'Herds reproduced and could grow over time, making successful cattle owners increasingly wealthy. They loaned animals or employed poorer people, who then became economically dependent on them.',
        },
        {
          point: 'War created subject and vassal groups.',
          explanation: 'Victorious communities could force defeated people to obey their rulers, provide labour and pay tribute. This placed conquered groups below the ruling community in the social order.',
        },
      ],
    },
    {
      heading: 'How chiefdoms developed',
      introduction: 'A chiefdom is a group of communities ruled by a chief with recognised political authority.',
      notes: [
        {
          point: 'Cattle loaning extended political influence.',
          explanation: 'A wealthy leader who loaned cattle to other families created obligations of loyalty. The network of borrowers increased the leader’s influence beyond the immediate family.',
        },
        {
          point: 'Surplus food and valuable resources increased a leader’s power.',
          explanation: 'Chiefs who controlled grain stores, gold, ivory or trade routes could support followers, collect tribute and reward loyal people.',
        },
        {
          point: 'Large communities needed law, order and protection.',
          explanation: 'As villages grew, disputes and security problems became more complex. Chiefs organised justice, defence and the use of land and water.',
        },
        {
          point: 'Marriage alliances and military success expanded chiefdoms.',
          explanation: 'Polygamous marriages connected leading families, while ambitious leaders with strong armies conquered or absorbed neighbouring communities.',
        },
        {
          point: 'People accepted chiefs in return for protection and order.',
          explanation: 'Subjects gave tribute and loyalty because the chief defended the community, settled disputes and coordinated access to resources. This exchange made chiefly authority more stable.',
        },
      ],
    },
  ],
  'late-iron-age': [
    {
      heading: 'Political changes and the rise of states',
      introduction: 'During the Late Iron Age, smaller chiefdoms developed into larger, more centralised states such as Great Zimbabwe, Mutapa and Rozvi.',
      notes: [
        {
          point: 'Kingship became the centre of government.',
          explanation: 'The king was head of state and usually inherited the position through the royal family. This hereditary system gave the state continuity, although disagreements over the rightful successor could cause wars.',
        },
        {
          point: 'The king combined political, legal and religious authority.',
          explanation: 'He appointed chiefs, judged serious cases, distributed land and led important religious activities. Holding these roles made the king the highest authority in the state.',
        },
        {
          point: 'The king controlled trade and collected tribute.',
          explanation: 'Subjects showed loyalty by paying cattle, grain, ivory, gold or labour. Control of trade and tribute gave the ruler resources to govern, reward supporters and maintain the royal court.',
        },
        {
          point: 'A permanent army defended and expanded the state.',
          explanation: 'The army protected the king and the population, collected tribute and raided enemies. Military strength allowed successful states to control more people and territory.',
        },
        {
          point: 'Appointed chiefs and fines helped the king enforce authority.',
          explanation: 'Local chiefs carried out royal decisions in different districts, while courts punished law-breaking with fines. This allowed the king to maintain order across a territory larger than he could govern alone.',
        },
      ],
    },
    {
      heading: 'How trade encouraged state formation',
      introduction: 'Trade created wealth, but it also created competition for the places and resources that made trade possible.',
      notes: [
        {
          point: 'Communities competed for valuable resources.',
          explanation: 'Gold mines and forests containing elephants supplied gold and ivory for trade. Leaders who controlled these resources became wealthier and more powerful.',
        },
        {
          point: 'Control of trade routes helped states expand.',
          explanation: 'A ruler who controlled the roads linking inland producers to external traders could supervise exchange and demand payments. Communities fought to secure these profitable routes.',
        },
        {
          point: 'Trade wealth supported government and armies.',
          explanation: 'Rulers received valuable goods as tribute or tax. They used this wealth to reward followers, support soldiers and persuade smaller communities to accept their authority.',
        },
        {
          point: 'Trade encouraged rulers to collect regular tribute.',
          explanation: 'Producers and traders sent gold, ivory, cattle or labour to the political centre. Regular tribute connected distant communities to the ruler and supplied the state with resources.',
        },
        {
          point: 'Imported goods helped rulers build loyalty.',
          explanation: 'Kings distributed rare beads, cloth and other imported goods to chiefs and trusted followers. These rewards showed royal wealth and encouraged powerful people to support the state.',
        },
      ],
    },
    {
      heading: 'Other causes of state formation',
      introduction: 'Trade was important, but states also grew because of leadership, farming, cattle and warfare.',
      notes: [
        {
          point: 'Ambitious leaders and strong armies united communities.',
          explanation: 'Capable leaders attracted followers and used military power to defend their people or conquer neighbours. Conquered territories increased the size of the state.',
        },
        {
          point: 'Fertile land and good pasture needed organised control.',
          explanation: 'Productive farmland and grazing land supported large populations and herds. Political leaders controlled access to these important resources.',
        },
        {
          point: 'Cattle loaning and marriage created alliances.',
          explanation: 'Loaning cattle won loyalty, while polygamous marriages linked the ruler to several influential families. These relationships widened the ruler’s support.',
        },
        {
          point: 'Succession disputes could divide or create states.',
          explanation: 'Rival heirs sometimes fought for the throne after a ruler died. A defeated claimant and their supporters could move away and establish a separate political community.',
        },
        {
          point: 'The need for protection encouraged political unity.',
          explanation: 'Smaller communities sometimes accepted one ruler and army to defend themselves against raids or invasion. Shared defence brought separate groups under a common authority.',
        },
      ],
    },
    {
      heading: 'Institutions that supported Shona states',
      introduction: 'The king did not govern alone. Several groups helped the state function effectively.',
      notes: [
        {
          point: 'Spirit mediums gave religious legitimacy.',
          explanation: 'Spirit mediums communicated ancestral approval and took part in selecting or installing rulers. Their support helped people accept the king’s authority.',
        },
        {
          point: 'The council of advisers guided the king.',
          explanation: 'Experienced advisers discussed political, legal and economic matters with the ruler. Their advice reduced the danger of one person making every decision without consultation.',
        },
        {
          point: 'The army and its commander protected the state.',
          explanation: 'Soldiers defended borders, protected the royal family, enforced decisions and collected tribute under the direction of an army commander.',
        },
        {
          point: 'Ordinary people sustained the state.',
          explanation: 'Farmers, herders, miners, craftspeople and traders produced food and wealth. Their labour, tribute and loyalty made government possible.',
        },
        {
          point: 'Appointed chiefs governed local districts.',
          explanation: 'Local chiefs communicated the king’s orders, allocated land, settled minor disputes and collected tribute. They linked the central government with communities across the state.',
        },
      ],
    },
  ],
  'late-iron-age-social-economic': [
    {
      heading: 'Social and settlement changes',
      introduction: 'Late Iron Age communities became larger, more permanent and more carefully located.',
      notes: [
        {
          point: 'Permanent settlements and stone buildings appeared.',
          explanation: 'People invested labour in durable homes and, in some centres, impressive stone structures. This shows that communities expected to remain in one place and had leaders able to organise large building projects.',
        },
        {
          point: 'Settlement sites were chosen for practical reasons.',
          explanation: 'Water sources supported people, crops and livestock; fertile soils supported farming; hills offered visibility and defence. A good site therefore improved both survival and security.',
        },
        {
          point: 'Villages increased in size.',
          explanation: 'Large-scale farming, livestock keeping and grain storage supported more people. Larger populations also supplied labour for mining, building, trade and defence.',
        },
        {
          point: 'Religion remained central to community life.',
          explanation: 'People believed in Mwari, ancestral spirits and spirit mediums. Religious beliefs explained events, guided rulers and connected the living community with its ancestors.',
        },
        {
          point: 'Permanent settlement encouraged specialised work.',
          explanation: 'Reliable food and larger populations allowed some people to become skilled builders, potters, miners or traders. Their specialised work supported the growth of complex towns and states.',
        },
      ],
    },
    {
      heading: 'Economic changes',
      introduction: 'Farming and livestock remained the foundation of the economy, while mining and external trade became more important.',
      notes: [
        {
          point: 'Crop cultivation and livestock keeping expanded.',
          explanation: 'Communities grew sorghum, millet and rapoko and kept large herds of cattle, goats and sheep. These activities supplied food, wealth and goods for tribute or trade.',
        },
        {
          point: 'Granaries improved long-term food storage.',
          explanation: 'Stored grain could feed people between harvests, during droughts and while armies or traders were away. Food reserves also allowed rulers to assist or reward followers.',
        },
        {
          point: 'Cattle became closely linked with wealth and status.',
          explanation: 'A person with many cattle could pay lobola, lend animals, support dependants and meet tribute obligations. Large herds therefore brought both social respect and political influence.',
        },
        {
          point: 'External trade and mining increased.',
          explanation: 'Gold, ivory and other products moved through long-distance trade networks. Mining and trade connected inland states with Swahili, Arab and later Portuguese merchants on the coast.',
        },
        {
          point: 'Hunting and gathering became less central.',
          explanation: 'People still hunted and gathered, but settled agriculture and animal rearing supplied most food. This change made communities less dependent on wild resources.',
        },
      ],
    },
    {
      heading: 'Mining and the use of gold',
      introduction: 'Mineral production supplied tools, ornaments and valuable goods for local and external exchange.',
      notes: [
        {
          point: 'Communities worked several mineral resources.',
          explanation: 'Important resources included gold, copper, iron, tin, lead, zinc, silver and salt. Different minerals were used for tools, decoration or trade, depending on their properties and value.',
        },
        {
          point: 'Gold had economic, political and social value.',
          explanation: 'Gold was exchanged with traders, paid as tribute and made into jewellery such as bangles and earrings. Because it was rare and attractive, owning gold also showed high status.',
        },
        {
          point: 'Mining was dangerous and technically difficult.',
          explanation: 'Rain could flood shafts, weak tunnels could collapse and simple tools made excavation slow. These dangers could injure or kill miners and interrupt production.',
        },
        {
          point: 'Iron mining supported farming and warfare.',
          explanation: 'Smelters turned iron ore into metal for hoes, axes, spearheads and other equipment. These products improved food production, hunting and the defence of communities.',
        },
        {
          point: 'Mining strengthened trade and state wealth.',
          explanation: 'Gold, copper and other minerals were exchanged locally or sent to the coast. Rulers collected some mineral output as tribute and used that wealth to support courts, armies and followers.',
        },
      ],
    },
  ],
  'late-iron-age-importance': [
    {
      heading: 'Economic importance of cattle',
      introduction: 'Cattle were a practical resource and a widely accepted form of wealth.',
      notes: [
        {
          point: 'Cattle supplied food and useful materials.',
          explanation: 'Communities obtained milk and meat from cattle. Hides were turned into leather clothing, shields and drum coverings, while dung was used as manure to improve fields.',
        },
        {
          point: 'Cattle supported farming and transport.',
          explanation: 'Oxen provided draught power for pulling loads and could transport goods between communities. This reduced human labour and helped production and trade.',
        },
        {
          point: 'Cattle could be exchanged as wealth.',
          explanation: 'People used cattle in trade and to pay tribute, fines and lobola. Unlike food that was quickly consumed, a living herd could reproduce and increase a family’s wealth.',
        },
        {
          point: 'Herds stored and increased wealth over time.',
          explanation: 'Families could keep cattle for future needs, and healthy animals produced calves that enlarged the herd. Cattle therefore acted as a dependable store of value during good seasons.',
        },
        {
          point: 'Cattle supported specialist livelihoods.',
          explanation: 'Large herds created work for herders and supplied hides for leather workers. Oxen also helped transport goods, connecting cattle keeping with craft production and trade.',
        },
      ],
    },
    {
      heading: 'Social, cultural and political importance of cattle',
      introduction: 'Cattle connected families, rulers, religious beliefs and generations.',
      notes: [
        {
          point: 'Cattle ownership showed social status.',
          explanation: 'A large herd showed that a household controlled valuable resources and could support many dependants. Wealthy cattle owners therefore gained respect and influence.',
        },
        {
          point: 'Cattle were central to marriage and inheritance.',
          explanation: 'Lobola joined two families through marriage, while inherited cattle transferred wealth from one generation to the next and preserved the family’s position.',
        },
        {
          point: 'Cattle had ceremonial and spiritual uses.',
          explanation: 'Animals were slaughtered at important rituals and could be offered when settling matters involving an avenging spirit, or ngozi. Some beliefs also connected cattle with ancestral spirits.',
        },
        {
          point: 'Cattle loaning extended political influence.',
          explanation: 'A ruler or wealthy owner could lend cattle to followers. Borrowers became loyal to the lender, so cattle helped create political relationships and expand authority.',
        },
        {
          point: 'Cattle settled political and legal obligations.',
          explanation: 'People paid cattle as tribute to rulers or as fines after breaking the law. These payments demonstrated loyalty, compensated for wrongdoing and helped restore order.',
        },
      ],
    },
    {
      heading: 'Local and external trade',
      introduction: 'Trade allowed communities to exchange what they produced for goods they did not make locally.',
      notes: [
        {
          point: 'Local trade exchanged everyday products.',
          explanation: 'Neighbouring communities traded cattle, grain, iron tools, ornaments and pottery. This encouraged specialisation because a skilled producer could exchange goods for food or other needs.',
        },
        {
          point: 'External trade brought imported luxuries and new contacts.',
          explanation: 'Southern African traders exchanged gold and ivory for glass beads, cloth, seashells and, in later periods, guns. Contact introduced influences from Swahili, Arab and Portuguese traders.',
        },
        {
          point: 'Imported goods became signs of status.',
          explanation: 'Rare objects such as glass beads were difficult to obtain. Rulers and wealthy people displayed them to show their access to distant trade networks.',
        },
        {
          point: 'Trade reduced local shortages.',
          explanation: 'A community could exchange its surplus for food, tools or materials that were scarce in its own area. This made communities less dependent on only the resources found nearby.',
        },
        {
          point: 'Trade spread skills, ideas and technology.',
          explanation: 'Contact between merchants and producers allowed communities to learn new craft methods and ways of organising exchange. Cultural influences also travelled with goods and people.',
        },
      ],
    },
    {
      heading: 'Political effects of trade',
      introduction: 'Trade did more than move goods: it changed relationships between rulers, subjects and neighbouring states.',
      notes: [
        {
          point: 'Control of resources and routes increased political power.',
          explanation: 'Powerful rulers conquered gold-producing areas, elephant-rich forests and trade routes. Control allowed them to supervise exchange and demand tribute from traders and producers.',
        },
        {
          point: 'Trade wealth helped rulers reward loyalty.',
          explanation: 'Kings distributed imported goods to chiefs and faithful subjects. These rewards strengthened political alliances and encouraged continued service to the state.',
        },
        {
          point: 'Trade connected and sometimes unified communities.',
          explanation: 'Regular exchange created shared interests and relationships between different groups. Communities that depended on the same markets or routes had reasons to cooperate under a common authority.',
        },
        {
          point: 'Tribute tied distant communities to the central state.',
          explanation: 'Regular payments of goods or labour showed that outlying communities accepted the ruler’s authority. Tribute also supplied the royal court, officials and army.',
        },
        {
          point: 'Competition over trade could cause conquest and conflict.',
          explanation: 'Rulers fought to control mines, elephant-rich areas and profitable routes. Victory could enlarge a state, but the competition also caused raids, warfare and the loss of independence for weaker groups.',
        },
      ],
    },
  ],
};

const searchableSectionText = (section: Section) => {
  const notes = PROFESSIONAL_NOTES[section.id] ?? [];
  return [
    section.title,
    section.description,
    ...notes.flatMap((group) => [group.heading, group.introduction, ...group.notes.flatMap((note) => [note.point, note.explanation])]),
    ...section.questions.flatMap((question) => [question.question, String(question.answer)]),
  ].join(' ').toLowerCase();
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = SECTIONS_DATA.map((s) => ({ id: s.id, label: s.title.split(' ').slice(0, 3).join(' ') }));

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
      <div className="border-b border-slate-200 py-5 dark:border-slate-800">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
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
        <p className="text-base font-bold leading-relaxed text-slate-900 dark:text-slate-100 md:text-lg">
          {question}
        </p>
        {isRevealed && (
          <div className="mt-4 animate-dropdown-reveal py-1 pl-4">
            <div className="text-base font-medium leading-relaxed text-green-700 dark:text-green-400">
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
      <article
        id={`section-${section.id}`}
        className={`scroll-mt-28 py-3 transition-colors duration-300 md:py-6 ${
          isHighlighted
            ? ' pl-4 md:pl-6'
            : ''
        }`}
      >
        {section.subtitle && (
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
            {section.subtitle}
          </p>
        )}
        <h3
          className={`mb-5 text-3xl font-black leading-tight tracking-tight md:text-5xl ${
            isHighlighted
              ? 'text-indigo-900 dark:text-indigo-100'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {section.title}
        </h3>
        <p className="mb-10 max-w-5xl text-lg font-medium leading-8 text-slate-700 dark:text-slate-300 md:text-xl">
          {section.description}
        </p>

        <div className="space-y-12">
          {(PROFESSIONAL_NOTES[section.id] ?? []).map((group) => (
            <section key={group.heading}>
              <h4 className="mb-3 text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-3xl">
                {group.heading}
              </h4>
              <p className="mb-6 max-w-5xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
                {group.introduction}
              </p>
              <div className="space-y-7">
                {group.notes.map((note, index) => (
                  <div key={note.point}>
                    <p className="text-lg font-extrabold leading-7 text-slate-900 dark:text-slate-100 md:text-xl">
                      <span className="mr-2 text-indigo-600 dark:text-indigo-400">{index + 1}.</span>
                      {note.point}
                    </p>
                    <p className="mt-2 max-w-5xl text-base leading-7 text-slate-700 dark:text-slate-300 md:text-lg md:leading-8">
                      {note.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Questions */}
        <div className="mt-14 border-t-2 border-slate-300 pt-8 dark:border-slate-700">
          <h4 className="mb-3 flex items-center gap-3 text-2xl font-black text-slate-950 dark:text-white md:text-3xl"> Test Your Knowledge
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
      </article>
    );
  },
  (prev, next) => prev.isHighlighted === next.isHighlighted
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const chapterTabsRef = useRef<HTMLDivElement>(null);

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
    return SECTIONS_DATA.filter((section) => searchableSectionText(section).includes(query));
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
      const match = SECTIONS_DATA.find((section) => searchableSectionText(section).includes(query));
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

  const showChapter = (index: number) => {
    setActiveSectionIndex(Math.max(0, Math.min(SECTIONS_DATA.length - 1, index)));
    setHighlightedId(null);
    window.requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) {
        lessonScrollArea.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  // Keep the selected chapter centred inside the existing horizontal top bar.
  useEffect(() => {
    const activeTab = chapterTabsRef.current?.querySelector<HTMLElement>(
      `[data-chapter-index="${activeSectionIndex}"]`,
    );
    activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeSectionIndex]);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Late Stone Age people used poisoned arrows to kill animals. They extracted poison from reptiles such as snakes, insects such as spiders, and from scorpions.',
      },
      {
        title: 'Pro Tip',
        text: 'Iron tools were more efficient than stone tools, enabling people to clear more land for agriculture and improve hunting and fishing.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the Late Iron Age states: Great Zimbabwe, Mutapa, and Rozvi. All three were powerful states in Southern Africa.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse the Late Stone Age with the Late Iron Age. The Late Stone Age used stone tools, while the Late Iron Age used iron tools and had states.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Late Stone Age people used poisoned arrows to kill animals. They extracted poison from reptiles such as snakes, insects such as spiders, and from scorpions.',
      },
      {
        title: 'Pro Tip',
        text: 'Iron tools were more efficient than stone tools, enabling people to clear more land for agriculture and improve hunting and fishing.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the Late Iron Age states: Great Zimbabwe, Mutapa, and Rozvi. All three were powerful states in Southern Africa.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse the Late Stone Age with the Late Iron Age. The Late Stone Age used stone tools, while the Late Iron Age used iron tools and had states.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div ref={chapterTabsRef} className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            data-chapter-index={idx}
            onClick={() => showChapter(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx && !inputValue.trim()
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-white text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            LEARNING OUTCOME 1
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            History of Southern Africa
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Explore the history of Southern Africa from the Late Stone Age through the
            Early Iron Age to the Late Iron Age. Learn about the tools, economies,
            social systems, political organisations, and the changes that shaped the region.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTIONS_DATA.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ✨ {SECTIONS_DATA.reduce((acc, s) => acc + s.questions.length, 0)} questions
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a topic, rule, or question..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
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

      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className="px-[5px] sm:px-6 md:px-8 py-10 md:px-[5px] sm:px-6 md:px-8 md:py-14">
        <div ref={listContainerRef} className="max-w-6xl">
          <div className="mb-10 flex items-center justify-between border-b-2 border-slate-300 pb-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
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
            <p className="border-y border-dashed border-slate-300 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No sections match your search.
            </p>
          )}

          {randomTip && (
            <aside className="mt-14 border-y-2 border-indigo-200 py-7 dark:border-indigo-900/60">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-black text-slate-950 dark:text-white">History study tip</h3>
                <button
                  onClick={refreshRandomTip}
                  className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                  <RefreshCw size={17} /> New tip
                </button>
              </div>
              <p className="mt-3 text-lg font-extrabold text-slate-900 dark:text-slate-100">{randomTip.title}</p>
              <p className="mt-1 max-w-4xl text-base leading-7 text-slate-700 dark:text-slate-300 md:text-lg">
                {randomTip.text}
              </p>
            </aside>
          )}

          {!inputValue.trim() && (
            <nav className="mt-14 flex items-center justify-between gap-5 border-t-2 border-slate-300 pt-7 dark:border-slate-700" aria-label="Bottom chapter navigation">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Chapter {activeSectionIndex + 1} of {SECTIONS_DATA.length}
                </p>
                <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                  {SECTIONS_DATA[activeSectionIndex]?.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => showChapter(activeSectionIndex + 1)}
                disabled={activeSectionIndex >= SECTIONS_DATA.length - 1}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:shadow-indigo-950/40 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
              >
                {activeSectionIndex >= SECTIONS_DATA.length - 1 ? 'All chapters complete' : 'Next chapter'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </main>

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
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-[5px] sm:px-6 md:px-8 py-10 text-white md:px-[5px] sm:px-6 md:px-8">
        <div className="max-w-6xl">
          <h3 className="mb-6 text-3xl font-black">Key takeaways</h3>
          <div className="space-y-6 text-base leading-7 text-indigo-100 md:text-lg">
            <p><strong className="block text-xl text-white">Late Stone Age</strong>People relied on stone, bone and wooden tools, hunting, gathering and fishing. Their small nomadic groups worked communally and were led mainly by family heads.</p>
            <p><strong className="block text-xl text-white">Early Iron Age</strong>Stronger iron tools increased farming and food production. Permanent villages, specialist occupations, social classes, chiefs, trade and tribute then became more important.</p>
            <p><strong className="block text-xl text-white">Late Iron Age</strong>Large states such as Great Zimbabwe, Mutapa and Rozvi developed. Kings, armies, religion, cattle, mining and long-distance trade supported their authority and economies.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningOutcome1;
