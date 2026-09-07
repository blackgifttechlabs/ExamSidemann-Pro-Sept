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
// DATA: Great Zimbabwe Sections
// ──────────────────────────────────────────────────────────────────────────────
const SECTIONS_DATA: Section[] = [
  {
    id: 'origin',
    title: 'Origin of the Great Zimbabwe State',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The Great Zimbabwe state was one of the late Iron Age states in pre‑colonial Zimbabwe. Its origin is controversial, with two main theories: one arguing for foreign builders and another for indigenous African development.',
    details: [
      'Theory 1: Great Zimbabwe was built by foreigners (Arabs or Jews).',
      'Theory 2: Great Zimbabwe was built by local Shona‑speaking people between 1100AD and 1450AD.',
      'Evidence for local origin: artefacts indicate Shona culture, ceramics are similar to those of recent Shona people, foreign items attributed to long‑distance trade.',
      'The builders were cattle herders, crop growers, iron smelters, potters and stone builders.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase mb-2 text-center">
            Two Theories of Origin
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="font-bold text-red-600 dark:text-red-400">Foreign Builders</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Arabs or Jews built Great Zimbabwe; more “civilised” than Africans.</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="font-bold text-green-600 dark:text-green-400">Local Builders</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Indigenous Shona people built it between 1100–1450 AD, supported by local artefacts and pottery.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What are the two main theories about the origin of Great Zimbabwe?',
        answer: 'One theory argues that foreigners (Arabs or Jews) built it; the other argues that local Shona people built it between 1100AD and 1450AD.',
      },
      {
        id: 2,
        question: 'What evidence supports the theory that Great Zimbabwe was built by local people?',
        answer: 'Artefacts indicating Shona culture, local ceramics similar to those of recent Shona people, and foreign items explained by long‑distance trade.',
      },
      {
        id: 3,
        question: 'What economic activities were carried out by the people who built Great Zimbabwe?',
        answer: 'Cattle herding, crop cultivation, iron smelting, pottery making and stone building.',
      },
    ],
  },
  {
    id: 'political-rise',
    title: 'Political Reasons for the Rise of Great Zimbabwe',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Several political factors contributed to the emergence and growth of the Great Zimbabwe state, including military strength, leadership, and the decline of Mapungubwe.',
    details: [
      'A strong army led to the rise of the state.',
      'The decline of Mapungubwe allowed wealth (tribute and trade) to flow into Great Zimbabwe.',
      'Peace and stability enabled development.',
      'The hilltop location provided defence and a centre for religious worship.',
      'Ambitious leaders conquered other lineages to control trade routes, resources and collect tribute.',
      'The place was suitable for refuge during war (Nemanwa Hill).',
      'Rulers controlled religion and were regarded as divinely appointed, commanding universal respect.',
    ],
    examples: (
      <div className="p-4 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm">
        <h5 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2 text-center">
          Key Political Factors
        </h5>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
          <li>• Strong army</li>
          <li>• Decline of Mapungubwe</li>
          <li>• Peace and stability</li>
          <li>• Defensive hilltop</li>
          <li>• Ambitious leaders</li>
          <li>• Control of religion</li>
        </ul>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'How did the decline of Mapungubwe contribute to the rise of Great Zimbabwe?',
        answer: 'Wealth flowed into Great Zimbabwe in the form of tribute and control of trade.',
      },
      {
        id: 2,
        question: 'Why was the hilltop location chosen for the capital?',
        answer: 'It provided defence against enemies and served as a centre for religious worship.',
      },
      {
        id: 3,
        question: 'How did rulers use religion to strengthen their position?',
        answer: 'They were regarded as divinely appointed, commanding universal respect, which helped unify the state.',
      },
    ],
  },
  {
    id: 'economic-social-rise',
    title: 'Economic and Social Reasons for the Rise of Great Zimbabwe',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Economic prosperity and social structures were fundamental to the rise of Great Zimbabwe. Fertile land, abundant resources, trade, and social organisation all played a role.',
    details: [
      'Economic factors:',
      '• Fertile soils for crop cultivation.',
      '• Good pastures for livestock (pastoralism).',
      '• Abundant minerals (gold, iron) for trade and tool making.',
      '• Availability of game (fauna) for meat, skins and ivory.',
      '• Favourable climate and good rainfall.',
      '• Water from nearby rivers (e.g., Mutirikwi).',
      '• Accessibility to international trade via Sofala (Swahili, Arabs, Persians, Chinese).',
      '• Control of surplus production by leaders.',
      '• Area free from tsetse flies, promoting animal rearing.',
      '',
      'Social factors:',
      '• Polygamy ensured adequate labour supply and soldiers.',
      '• Loaning of cattle (kuronzera) unified people and strengthened leaders.',
      '• Increase in population.',
      '• Religion helped unify people.',
      '• The hill was regarded as sacred for religious purposes.',
      '• Availability of granite rocks for building stone walls.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2 text-center">
            Economic Assets
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Fertile soils</li>
            <li>• Pastures</li>
            <li>• Minerals (gold, iron)</li>
            <li>• Game (ivory, meat)</li>
            <li>• Good rainfall</li>
            <li>• Rivers (water)</li>
            <li>• Trade access</li>
          </ul>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase mb-2 text-center">
            Social Structures
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Polygamy</li>
            <li>• Cattle loaning</li>
            <li>• Population growth</li>
            <li>• Religious unity</li>
            <li>• Granite rocks (building)</li>
          </ul>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'Which economic factors contributed to the rise of Great Zimbabwe?',
        answer: 'Fertile soils, good pastures, abundant minerals, game, favourable climate, water, international trade, and control of surplus.',
      },
      {
        id: 2,
        question: 'How did social factors such as polygamy and cattle loaning help the state?',
        answer: 'Polygamy provided labour and soldiers; cattle loaning (kuronzera) unified people and strengthened leaders.',
      },
      {
        id: 3,
        question: 'Why was the area free from tsetse flies significant?',
        answer: 'It promoted animal rearing, especially cattle, which were central to the economy and society.',
      },
    ],
  },
  {
    id: 'construction',
    title: 'Construction of Great Zimbabwe',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Great Zimbabwe was built by the Shona people between 1100 AD and 1450 AD using granite rocks. The site consists of several areas, each with specific functions.',
    details: [
      'Built by Shona people between 1100AD and 1450AD.',
      'Granite rocks were heated, cooled, split and shaped into blocks.',
      'No mortar was used; walls were thicker at the base and narrower at the top.',
      'Slave labour was possibly used.',
      'The site comprises:',
      '  i) The Acropolis – for the king and royal family.',
      '  ii) The Great Enclosure / Conical tower – for the king’s wives.',
      '  iii) The Valley ruins.',
      '  iv) Villages.',
      '',
      'Reasons for building / functions:',
      '• Symbol of power, religious centre, privacy, prestige, administrative centre.',
      '• Living place for nobles, fortress in times of war, shelter, centre of trade.',
      '• Storage for grain and minerals, receiving visitors, tribute collection, cultural centre.',
      '• Capital, mambo’s court (Muzindawamambo).',
      '• Environmental factors like pastures, rich soils and good rainfall.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
            Main Areas of Great Zimbabwe
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Acropolis (King & Royal Family)</div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Great Enclosure (King’s Wives)</div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Valley Ruins</div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Villages</div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase mb-2 text-center">
            Functions of Great Zimbabwe
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <span className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Symbol of power</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Religious centre</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Fortress</span>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-center">Trade centre</span>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'When was Great Zimbabwe built and by whom?',
        answer: 'Built by the Shona people between 1100 AD and 1450 AD.',
      },
      {
        id: 2,
        question: 'What construction methods were used?',
        answer: 'Granite rocks were heated, cooled, split, shaped into blocks, and placed without mortar; walls were thicker at the base.',
      },
      {
        id: 3,
        question: 'What were the purposes of the Great Enclosure and the Acropolis?',
        answer: 'The Acropolis was for the king and royal family; the Great Enclosure housed the king’s wives and possibly served as a ceremonial centre.',
      },
    ],
  },
  {
    id: 'economic-organisation',
    title: 'Economic Organisation of Great Zimbabwe',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'The economy of Great Zimbabwe was diverse and sophisticated, involving trade, agriculture, mining, crafts, and tribute. It supported the state’s political and social structures.',
    details: [
      'Trade:',
      '• They traded among themselves and with foreigners (Arabs, Swahili, Indians, Chinese, Portuguese, Persians).',
      '• Exports: ivory, gold, baskets, ostrich feathers, grain, livestock, iron tools, precious skins.',
      '• Imports: glass beads, Chinese bowls, cloth, soapstone bowls, bangles, mirrors, spirits, wires, copper chains, candles.',
      '• Sofala was the main port of trade; traders paid tribute to the king.',
      '',
      'Agriculture:',
      '• Cultivated crops: sorghum, millet, rapoko, melons, pumpkins, beans, cowpeas, gourds.',
      '• Used hand hoes, shifting cultivation, slash‑and‑burn, and transhumance system.',
      '• Women did most cultivation; men herded cattle.',
      '',
      'Mining and Crafts:',
      '• Mined gold, copper, iron.',
      '• Crafts: pottery, basketry, blacksmithing, weaving (cotton), stone carving, wood carving, leather work, drum making, jewellery, building in stone.',
      '',
      'Cattle:',
      '• Kept cattle, goats, sheep.',
      '• Cattle were used for lobola, loaning, tribute, food (milk, meat, fat), skins, drums, draught power, manure, and religious ceremonies.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
            Trade Items
          </h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-bold text-green-600">Exports</p>
              <ul className="text-slate-600 dark:text-slate-400">
                <li>• Ivory</li>
                <li>• Gold</li>
                <li>• Grain</li>
                <li>• Livestock</li>
                <li>• Iron tools</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-blue-600">Imports</p>
              <ul className="text-slate-600 dark:text-slate-400">
                <li>• Glass beads</li>
                <li>• Chinese bowls</li>
                <li>• Cloth</li>
                <li>• Bangles</li>
                <li>• Mirrors</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
            Crafts Practised
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Pottery</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Basketry</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Weaving</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Blacksmithing</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Stone carving</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Wood carving</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Leather work</span>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center">Drum making</span>
          </div>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What were the main exports and imports of Great Zimbabwe?',
        answer: 'Exports: ivory, gold, baskets, grain, livestock, iron tools. Imports: glass beads, Chinese bowls, cloth, bangles, mirrors, etc.',
      },
      {
        id: 2,
        question: 'What crops were grown by the people of Great Zimbabwe?',
        answer: 'Sorghum, millet, rapoko, melons, pumpkins, beans, cowpeas, gourds.',
      },
      {
        id: 3,
        question: 'What crafts were practised?',
        answer: 'Pottery, basketry, weaving, blacksmithing, stone carving, wood carving, leather work, drum making, jewellery, and building in stone.',
      },
      {
        id: 4,
        question: 'What were the uses of cattle in Great Zimbabwe?',
        answer: 'Lobola, loaning, tribute, food (milk, meat, fat), skins (drums, shields, clothing), draught power, manure, and religious ceremonies.',
      },
    ],
  },
  {
    id: 'social-political',
    title: 'Social and Political Organisation',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Great Zimbabwe had a complex social structure with clear hierarchies, religious beliefs, and a political system headed by a powerful king. Social organisation was patrilineal and influenced by cattle ownership.',
    details: [
      'Social Organisation:',
      '• Patrilineal society.',
      '• Cattle ownership was a status symbol.',
      '• Polygamy practised.',
      '• Sexual division of labour.',
      '• Kuronzera (loaning of cattle).',
      '• Lobola (bride price) paid in cattle.',
      '• Celebrations for births and new daughters‑in‑law.',
      '• Nhimbe system (communal work).',
      '• Taboos: incest and bestiality.',
      '• Belief in God (Mwari / Musikavanhu), spirit mediums (Masvikiro), ancestral spirits (Vadzimu), and national spirit mediums (Mhondoro).',
      '• Rain‑making ceremonies (Mukwerera / Mutoro).',
      '• Belief in witchcraft.',
      '',
      'Political Organisation:',
      '• The king was head of state; kingship was hereditary.',
      '• King was commander‑in‑chief of the army, chief judge, religious leader, and chief distributor of land.',
      '• Helped by a council of elders (Dare).',
      '• Districts under district chiefs, provinces under provincial chiefs – appointed by king, hereditary.',
      '• Subjects paid tribute to the king.',
      '• Raiding other states for grain and cattle.',
      '• Important officials: Queen mother, king’s sons‑in‑law, army commanders, spirit mediums, royal doctor, district and provincial chiefs.',
    ],
    examples: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-2 text-center">
            Social Beliefs
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Patrilineal</li>
            <li>• Cattle = status</li>
            <li>• Polygamy</li>
            <li>• Lobola (cattle)</li>
            <li>• Belief in Mwari</li>
            <li>• Spirit mediums</li>
            <li>• Rain‑making ceremonies</li>
          </ul>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-2 text-center">
            Political Hierarchy
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• King (hereditary)</li>
            <li>• Council of elders (Dare)</li>
            <li>• Provincial chiefs</li>
            <li>• District chiefs</li>
            <li>• Army commanders</li>
            <li>• Spirit mediums</li>
            <li>• Subjects (tribute)</li>
          </ul>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What was the social organisation of Great Zimbabwe?',
        answer: 'Patrilineal, cattle as status, polygamy, sexual division of labour, kuronzera, lobola, ceremonies, belief in Mwari and spirit mediums, and taboos.',
      },
      {
        id: 2,
        question: 'What were the roles of the king in Great Zimbabwe?',
        answer: 'Head of state, hereditary ruler, commander of army, chief judge, religious leader, distributor of land, and controller of trade.',
      },
      {
        id: 3,
        question: 'How was the kingdom administered?',
        answer: 'Assisted by a council of elders (Dare), district chiefs, provincial chiefs, army commanders, and other officials. Chiefs were appointed by the king and positions were hereditary.',
      },
      {
        id: 4,
        question: 'What was the importance of tribute in the political system?',
        answer: 'Tribute ensured loyalty, prevented chiefs from becoming too rich and ambitious, and increased the king’s wealth and power.',
      },
    ],
  },
  {
    id: 'decline',
    title: 'Decline of Great Zimbabwe State',
    subtitle: 'HISTORY OF SOUTHERN AFRICA',
    description:
      'Great Zimbabwe declined due to a combination of political, economic, and social factors, including civil wars, exhaustion of resources, and the rise of new states.',
    details: [
      'Political reasons:',
      '• Civil wars (e.g., between Nyatsimba Mutota and Chagwa in 1450).',
      '• Succession disputes forcing losers to migrate.',
      '• The state became too large to rule effectively.',
      '• Rise of new states (Torwa, Mutapa).',
      '• Corruption, disunity in the ruling class.',
      '• Ambitious members of the royal family (e.g., Nyatsimba Mutota).',
      '• Attacks from Sotho and Tswana to the south‑west.',
      '• Weakness of the army.',
      '• Outdated means of state control.',
      '',
      'Economic reasons:',
      '• Loss of long‑distance trade to Mutapa.',
      '• Shortage of resources (salt, pastures, wood).',
      '• Soil exhaustion leading to poor harvests.',
      '• Exhaustion of minerals (gold, copper, iron).',
      '• Exhaustion of game (meat, skins, ivory).',
      '• The Dande area was rich in resources, drawing people away.',
      '• Severe droughts (1420–1430).',
      '• Plague of locusts.',
      '',
      'Social reasons:',
      '• Overpopulation causing land shortage.',
      '• Social instability and unrest.',
      '• Successive droughts and locust plagues.',
      '',
      'Contribution of trade:',
      '• Exhaustion of trade resources (gold, ivory, ostrich feathers).',
      '• Unfair trade practices with foreigners.',
      '• Opening of the Zambezi trade route favoured Mutapa.',
    ],
    examples: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase mb-2 text-center">
              Political
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Civil wars</li>
              <li>• Succession disputes</li>
              <li>• Rise of Mutapa</li>
              <li>• Army weakness</li>
            </ul>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 uppercase mb-2 text-center">
              Economic
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Resource exhaustion</li>
              <li>• Soil depletion</li>
              <li>• Droughts</li>
              <li>• Trade shift</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
            <h5 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase mb-2 text-center">
              Social
            </h5>
            <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Overpopulation</li>
              <li>• Social unrest</li>
              <li>• Locust plagues</li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-sm">
          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-2 text-center">
            Trade’s Contribution
          </h5>
          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
            <li>• Exhaustion of gold, ivory</li>
            <li>• Unfair trade practices</li>
            <li>• Zambezi route favoured Mutapa</li>
          </ul>
        </div>
      </div>
    ),
    questions: [
      {
        id: 1,
        question: 'What political factors led to the decline of Great Zimbabwe?',
        answer: 'Civil wars, succession disputes, rise of new states (Torwa, Mutapa), corruption, attacks from Sotho/Tswana, and army weakness.',
      },
      {
        id: 2,
        question: 'Which economic factors contributed to the decline?',
        answer: 'Loss of trade, shortage of resources, soil exhaustion, mineral depletion, game depletion, droughts, and locust plagues.',
      },
      {
        id: 3,
        question: 'How did trade contribute to the decline?',
        answer: 'Exhaustion of trade resources, unfair trade, and the shift of trade routes to the Zambezi (favouring Mutapa).',
      },
      {
        id: 4,
        question: 'What social problems led to the decline?',
        answer: 'Overpopulation, social instability, and successive droughts.',
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// PROFESSIONAL NOTES (structured point‑and‑explanation)
// ──────────────────────────────────────────────────────────────────────────────
const PROFESSIONAL_NOTES: Record<string, ClassNoteGroup[]> = {
  origin: [
    {
      heading: 'Theories of origin',
      introduction: 'The origin of Great Zimbabwe has been a subject of debate between those who believe it was built by foreigners and those who argue for local development.',
      notes: [
        {
          point: 'Foreign origin theory',
          explanation: 'Some historians argued that Great Zimbabwe was built by more “civilised” races such as Arabs or Jews. This theory was used to deny African achievement.',
        },
        {
          point: 'Local origin theory',
          explanation: 'Most evidence supports that Great Zimbabwe was built by indigenous Shona‑speaking people between 1100AD and 1450AD. Artefacts like pottery and local designs confirm Shona culture.',
        },
        {
          point: 'Evidence for local origin',
          explanation: 'Ceramics found at the site are similar to those of later Shona communities. A few foreign items (e.g., glass beads) can be explained by long‑distance trade.',
        },
        {
          point: 'Who were the builders?',
          explanation: 'The builders were cattle herders, crop growers, iron smelters, potters, and stone masons – all activities that can be traced to local traditions.',
        },
      ],
    },
  ],
  'political-rise': [
    {
      heading: 'Political foundations',
      introduction: 'The rise of Great Zimbabwe was driven by military power, leadership, and the favourable political situation after Mapungubwe’s decline.',
      notes: [
        {
          point: 'A strong army',
          explanation: 'The army protected the state, enabled conquest, collected tribute, and discouraged revolts. Military strength was essential for expansion and control.',
        },
        {
          point: 'Decline of Mapungubwe',
          explanation: 'When Mapungubwe fell, its influence and wealth (trade and tribute) shifted to Great Zimbabwe, giving it a boost in power and resources.',
        },
        {
          point: 'Ambitious leaders',
          explanation: 'Rulers like those of the royal family conquered other lineages to secure trade routes, resources, and tribute, thus expanding the state.',
        },
        {
          point: 'Control of religion',
          explanation: 'Rulers were seen as divinely appointed, which gave them universal respect and united the people under a sacred authority.',
        },
        {
          point: 'Defensive location',
          explanation: 'The hilltop provided natural defence and was also a centre for religious worship, reinforcing the ruler’s spiritual and military role.',
        },
      ],
    },
  ],
  'economic-social-rise': [
    {
      heading: 'Economic advantages',
      introduction: 'The natural resources and economic opportunities around Great Zimbabwe were key to its growth.',
      notes: [
        {
          point: 'Fertile soils and good rainfall',
          explanation: 'The area had rich soils and reliable rainfall, which supported crop cultivation and ensured food surpluses.',
        },
        {
          point: 'Abundant pastures and water',
          explanation: 'Good grazing lands and rivers like Mutirikwi allowed cattle herding, which was a foundation of wealth and status.',
        },
        {
          point: 'Mineral wealth',
          explanation: 'Gold and iron were plentiful, providing resources for trade (gold) and tool/weapon production (iron).',
        },
        {
          point: 'Access to international trade',
          explanation: 'Great Zimbabwe was linked to the Indian Ocean trade via Sofala, allowing exchange with Swahili, Arabs, Persians, and Chinese.',
        },
        {
          point: 'Control of surplus',
          explanation: 'Leaders controlled surplus production and used it to reward supporters, store food, and trade, enhancing their power.',
        },
      ],
    },
    {
      heading: 'Social factors',
      introduction: 'Social practices and population dynamics also contributed to the rise of Great Zimbabwe.',
      notes: [
        {
          point: 'Polygamy',
          explanation: 'Polygamous marriages provided more labour (wives and children) and produced more soldiers, strengthening the state.',
        },
        {
          point: 'Cattle loaning (kuronzera)',
          explanation: 'Loaning cattle created bonds of loyalty and dependency, extending the ruler’s influence over a wider network of subjects.',
        },
        {
          point: 'Population growth',
          explanation: 'A growing population meant more labour, more soldiers, and more consumers, which stimulated the economy and politics.',
        },
        {
          point: 'Religious unity',
          explanation: 'Shared beliefs, including the sacred hill, helped unify the diverse groups within the state.',
        },
        {
          point: 'Availability of granite',
          explanation: 'Granite rocks were abundant and suitable for building, enabling the impressive stone constructions that symbolised power.',
        },
      ],
    },
  ],
  construction: [
    {
      heading: 'Building methods and materials',
      introduction: 'The construction of Great Zimbabwe was a remarkable engineering feat using local materials and labour.',
      notes: [
        {
          point: 'Use of granite rocks',
          explanation: 'Granite was plentiful. Builders heated the rocks, cooled them with water to cause cracking, then split and shaped them into blocks.',
        },
        {
          point: 'Mortar‑less construction',
          explanation: 'No mortar was used; the walls were built using the “dry‑stone” technique, with careful placement of blocks. Walls were thicker at the base for stability.',
        },
        {
          point: 'Labour organisation',
          explanation: 'The king mobilised large labour forces, possibly including slave labour, and coordinated the work through officials and vassal chiefs.',
        },
        {
          point: 'The site layout',
          explanation: 'The complex consists of the Acropolis (royal quarters), the Great Enclosure (wives’ quarters), valley ruins, and villages. Each area had a specific function.',
        },
      ],
    },
    {
      heading: 'Functions of Great Zimbabwe',
      introduction: 'The site served multiple purposes – political, religious, economic, and defensive.',
      notes: [
        {
          point: 'Political and administrative centre',
          explanation: 'It was the capital (Muzindawamambo) where the king held court, administered justice, and collected tribute.',
        },
        {
          point: 'Religious centre',
          explanation: 'The hilltop was sacred; ceremonies and rituals were conducted here, reinforcing the king’s divine status.',
        },
        {
          point: 'Economic hub',
          explanation: 'It was a centre of trade, storage for grain and minerals, and a place for receiving visitors and tribute.',
        },
        {
          point: 'Defensive fortress',
          explanation: 'The walls and hilltop provided refuge in times of war and enabled the king to spot enemies.',
        },
        {
          point: 'Symbol of prestige and unity',
          explanation: 'The impressive stone walls demonstrated the power and wealth of the state and helped unite the people under a common identity.',
        },
      ],
    },
  ],
  'economic-organisation': [
    {
      heading: 'Trade and external contacts',
      introduction: 'Trade was vital to the economy of Great Zimbabwe, connecting it to distant markets.',
      notes: [
        {
          point: 'Local and long‑distance trade',
          explanation: 'People traded locally and internationally. They exchanged local products (iron tools, pottery, grain, cattle) with each other and with foreigners.',
        },
        {
          point: 'Major exports',
          explanation: 'Gold, ivory, ostrich feathers, grain, livestock, and iron tools were exported to the coast.',
        },
        {
          point: 'Major imports',
          explanation: 'Imports included glass beads, Chinese porcelain, cloth, soapstone bowls, bangles, mirrors, and copper items.',
        },
        {
          point: 'The port of Sofala',
          explanation: 'Sofala was the main port through which foreign goods entered and local products left. Traders paid tribute to the king.',
        },
        {
          point: 'Control of trade routes',
          explanation: 'The king controlled and protected trade routes, ensuring safe passage and collecting duties or tribute from passing traders.',
        },
      ],
    },
    {
      heading: 'Agriculture and livestock',
      introduction: 'Farming and animal husbandry were the backbone of the economy, providing food and wealth.',
      notes: [
        {
          point: 'Crop cultivation',
          explanation: 'Staples like sorghum, millet, and rapoko were grown, along with melons, pumpkins, beans, cowpeas, and gourds. Women did most of the cultivation.',
        },
        {
          point: 'Farming techniques',
          explanation: 'They used hand hoes, practised shifting cultivation, and employed the slash‑and‑burn method to clear land.',
        },
        {
          point: 'Livestock keeping',
          explanation: 'Cattle, goats, and sheep were kept. Cattle were particularly important for meat, milk, hides, and as a store of value.',
        },
        {
          point: 'Transhumance',
          explanation: 'Some communities practised transhumance – moving herds seasonally to find fresh pastures.',
        },
        {
          point: 'Cattle in ceremonies',
          explanation: 'Cattle were slaughtered at rituals such as rain‑making ceremonies and bira (ancestral ceremonies).',
        },
      ],
    },
    {
      heading: 'Mining and crafts',
      introduction: 'Minerals and specialised crafts added value to the economy and supported trade.',
      notes: [
        {
          point: 'Mined minerals',
          explanation: 'Gold, copper, and iron were mined. Gold was mainly for trade; iron was used for tools and weapons.',
        },
        {
          point: 'Blacksmithing',
          explanation: 'Iron was smelted and forged into hoes, axes, swords, and other implements.',
        },
        {
          point: 'Pottery and basketry',
          explanation: 'Women made various pots for storage and cooking, while baskets (like winnowing baskets) were woven for domestic use.',
        },
        {
          point: 'Other crafts',
          explanation: 'Weaving (cotton cloth), stone carving, wood carving, leather work, drum making, and jewellery making were also practised.',
        },
        {
          point: 'Stone building',
          explanation: 'The construction of stone walls was a distinct craft that required skilled masons.',
        },
      ],
    },
  ],
  'social-political': [
    {
      heading: 'Social structure',
      introduction: 'Great Zimbabwe society was hierarchical, with cattle and lineage determining status.',
      notes: [
        {
          point: 'Patrilineal system',
          explanation: 'Descent and inheritance were traced through the male line, which influenced family and political relations.',
        },
        {
          point: 'Cattle as status',
          explanation: 'The number of cattle a person owned was the primary indicator of wealth and social standing.',
        },
        {
          point: 'Polygamy and lobola',
          explanation: 'Polygamy was common, and lobola (bride price) was paid in cattle, which strengthened family alliances.',
        },
        {
          point: 'Division of labour',
          explanation: 'Women usually cultivated crops, while men herded cattle and hunted. There was also specialisation in crafts.',
        },
        {
          point: 'Kuronzera (cattle loaning)',
          explanation: 'Loaning cattle created patron‑client relationships, extending influence and loyalty across the state.',
        },
      ],
    },
    {
      heading: 'Religious beliefs',
      introduction: 'Religion was central to social cohesion and legitimised political authority.',
      notes: [
        {
          point: 'Belief in God (Mwari)',
          explanation: 'They believed in a supreme creator, Mwari (also called Musikavanhu), who was approached through spirit mediums.',
        },
        {
          point: 'Spirit mediums',
          explanation: 'Masvikiro (spirit mediums) communicated with ancestral spirits (Vadzimu) and national spirits (Mhondoro). They played a role in choosing and installing kings.',
        },
        {
          point: 'Rain‑making ceremonies',
          explanation: 'Ceremonies like Mukwerera/Mutoro were held to ask for rain, involving the whole community and often led by the king.',
        },
        {
          point: 'Sacred places',
          explanation: 'The hilltop and other sites like thick forests and pools were regarded as homes of spirits.',
        },
        {
          point: 'Witchcraft beliefs',
          explanation: 'Witchcraft was feared and could be used to explain misfortunes, adding a moral dimension to social life.',
        },
      ],
    },
    {
      heading: 'Political organisation',
      introduction: 'The state was centralised under a hereditary king, with a hierarchy of officials and chiefs.',
      notes: [
        {
          point: 'The king’s authority',
          explanation: 'The king was the head of state, commander of the army, chief judge, religious leader, and distributor of land. His position was hereditary.',
        },
        {
          point: 'Council of elders (Dare)',
          explanation: 'The king was advised by a council of experienced elders who helped with governance and decision‑making.',
        },
        {
          point: 'Provincial and district chiefs',
          explanation: 'The kingdom was divided into provinces and districts, each under chiefs appointed by the king. These positions were hereditary.',
        },
        {
          point: 'Tribute system',
          explanation: 'Subjects paid tribute in goods (grain, cattle, ivory, etc.) to the king, which ensured loyalty and provided revenue.',
        },
        {
          point: 'Military and officials',
          explanation: 'The army, commanded by a military leader, defended the state and enforced the king’s will. Other officials included the queen mother, sons‑in‑law, and royal doctors.',
        },
      ],
    },
  ],
  decline: [
    {
      heading: 'Political causes',
      introduction: 'Internal conflicts and external pressures weakened the state from within.',
      notes: [
        {
          point: 'Civil wars and succession disputes',
          explanation: 'Rivalries between claimants to the throne (e.g., Nyatsimba Mutota vs. Chagwa) led to civil wars, forcing defeated factions to migrate.',
        },
        {
          point: 'Over‑expansion',
          explanation: 'The state became too large to be governed effectively by one ruler, leading to administrative difficulties and loss of control.',
        },
        {
          point: 'Rise of new states',
          explanation: 'The emergence of Torwa and Mutapa states drew away resources and population, reducing Great Zimbabwe’s power.',
        },
        {
          point: 'Corruption and disunity',
          explanation: 'Disunity among the ruling class and corruption eroded central authority and undermined loyalty.',
        },
        {
          point: 'External attacks',
          explanation: 'Attacks from Sotho and Tswana groups to the south‑west weakened the state militarily.',
        },
      ],
    },
    {
      heading: 'Economic causes',
      introduction: 'Depletion of resources and environmental stress contributed to economic decline.',
      notes: [
        {
          point: 'Resource exhaustion',
          explanation: 'Gold, iron, and copper deposits were depleted; pastures and firewood became scarce; game animals were overhunted.',
        },
        {
          point: 'Soil exhaustion and drought',
          explanation: 'Continuous farming led to soil depletion, and severe droughts between 1420–1430 caused harvest failures.',
        },
        {
          point: 'Loss of trade',
          explanation: 'The opening of the Zambezi trade route favoured Mutapa, diverting trade away from Great Zimbabwe.',
        },
        {
          point: 'Unfair trade practices',
          explanation: 'Foreign traders sometimes exchanged cheap goods for valuable gold and ivory, draining wealth.',
        },
        {
          point: 'Locust plagues',
          explanation: 'Plagues of locusts destroyed crops, exacerbating food shortages.',
        },
      ],
    },
    {
      heading: 'Social causes',
      introduction: 'Social pressures also played a role in the state’s decline.',
      notes: [
        {
          point: 'Overpopulation',
          explanation: 'Large population led to land shortages, competition, and social unrest.',
        },
        {
          point: 'Social instability',
          explanation: 'Economic hardships and political strife caused social unrest and weakened the social fabric.',
        },
        {
          point: 'Migration',
          explanation: 'People moved away to areas like Dande that had richer resources, reducing the population and labour force at Great Zimbabwe.',
        },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// Helper: text for search
// ──────────────────────────────────────────────────────────────────────────────
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
// INTERACTIVE QUESTION COMPONENT (memoized)
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
// MAIN COMPONENT: LearningOutcome2
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'Great Zimbabwe was once the largest city in pre‑colonial Southern Africa, with a population estimated at 10,000–20,000 people.',
      },
      {
        title: 'Pro Tip',
        text: 'The construction of Great Zimbabwe used the “dry‑stone” technique, where stones were shaped and stacked without mortar, yet the walls have stood for centuries.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the causes of rise: Political (army, Mapungubwe decline), Economic (resources, trade), Social (polygamy, cattle loaning).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse the Great Zimbabwe state with the modern country of Zimbabwe; the state existed between 1100–1450 AD.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Great Zimbabwe was once the largest city in pre‑colonial Southern Africa, with a population estimated at 10,000–20,000 people.',
      },
      {
        title: 'Pro Tip',
        text: 'The construction of Great Zimbabwe used the “dry‑stone” technique, where stones were shaped and stacked without mortar, yet the walls have stood for centuries.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the causes of rise: Political (army, Mapungubwe decline), Economic (resources, trade), Social (polygamy, cattle loaning).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse the Great Zimbabwe state with the modern country of Zimbabwe; the state existed between 1100–1450 AD.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            LEARNING OUTCOME 2
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            The Great Zimbabwe State
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Explore the rise, construction, economy, society, politics, and decline of
            Great Zimbabwe – one of the most powerful states in pre‑colonial Southern Africa.
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
            <p><strong className="block text-xl text-white">Origin</strong>Great Zimbabwe was built by local Shona people between 1100–1450 AD, not by foreigners, as shown by local artefacts and pottery.</p>
            <p><strong className="block text-xl text-white">Rise</strong>Political factors (army, leadership), economic factors (trade, resources), and social factors (polygamy, cattle loaning) all contributed to its rise.</p>
            <p><strong className="block text-xl text-white">Economy &amp; Society</strong>Economy was based on agriculture, cattle, mining, and long‑distance trade. Society was patrilineal, with cattle as status, and had a rich religious life.</p>
            <p><strong className="block text-xl text-white">Decline</strong>Decline resulted from civil wars, resource exhaustion, droughts, and the rise of rival states like Mutapa, which shifted trade away.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningOutcome2;