import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ──────────────────────────────────────────────────────────────────────────────
interface ClassItem {
  id: string;
  label: string;
  prefix: string;
  description: string;
  examples: string[];
  challenge: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// NOUN CLASSES DATA
// ──────────────────────────────────────────────────────────────────────────────
const CLASSES_DATA: ClassItem[] = [
  {
    id: '1',
    label: 'Mupanda 1',
    prefix: 'Mu- / Mw-',
    description:
      'Uyu mupanda unomirira vanhu vari muushoma (singular). Chivakashure chinoti mu- chinogona kushanduka kuva mw- kana dzitsi racho richitanga nenzvovera (vowel).',
    examples: ['Munhu', 'Mukadzi', 'Mwana', 'Mudzidzi', 'Mwenga'],
    challenge:
      'Chivakashure cheMupanda 1 chinoshanduka kuva chiipi kana dzitsi rezita riri "–eni"?',
  },
  {
    id: '1a',
    label: 'Mupanda 1a',
    prefix: 'Ø- (Null)',
    description:
      'Mumupanda umu mune mazita asingaratidzi chivakashure pachena (null prefix). Unosanganisira mazita evanhu chaiwo, hukama, nemabasa.',
    examples: ['Baba', 'Sekuru', 'Chipo', 'Mambo', 'Chiremba'],
    challenge:
      'Sei zita rekuti "Sekuru" richinzi riri muMupanda 1a kwete Mupanda 1?',
  },
  {
    id: '2',
    label: 'Mupanda 2',
    prefix: 'Va-',
    description:
      'Uyu ndiye uzhinji (plural) hweMupanda 1. Unomirira vanhu vakawanda.',
    examples: ['Vanhu', 'Vakadzi', 'Vadzidzi', 'Vachati', 'Varimi'],
    challenge:
      'Nyora uzhinji hwezita rekuti "Muimbi" ugoisa muMupanda 2.',
  },
  {
    id: '2a',
    label: 'Mupanda 2a',
    prefix: 'Va- / Vana-',
    description:
      'Unoshandiswa pakuremekedza munhu mumwe chete (honorific) kana kureva boka revanhu rakabatana nezita remunhu iyeye.',
    examples: ['Vasekuru', 'VaMutasa', 'VanaAmai', 'VaMambo', 'VanaSekuru'],
    challenge:
      'Musiyano upi uripo pakati pekuti "Vadzidzi" (Mupanda 2) uye "VaMufundisi" (Mupanda 2a)?',
  },
  {
    id: '3',
    label: 'Mupanda 3',
    prefix: 'Mu- / Mw-',
    description:
      'Unomirira miti, nhengo dzeuviri, nemamwe mazita asiri evanhu ari muushoma.',
    examples: ['Muti', 'Mugwagwa', 'Muromo', 'Munda', 'Mweya'],
    challenge:
      'Ndeapi mamwe mazita maviri enhengo dzeuviri anopinda muMupanda 3?',
  },
  {
    id: '4',
    label: 'Mupanda 4',
    prefix: 'Mi-',
    description: 'Uyu ndiye uzhinji hweMupanda 3.',
    examples: ['Miti', 'Migwagwa', 'Miromo', 'Minda', 'Miedzi'],
    challenge: 'Nyora uwandu (plural) hwezita rekuti "Musoro".',
  },
  {
    id: '5',
    label: 'Mupanda 5',
    prefix: 'Ri- / Ø-',
    description:
      'Unomirira michero, nhengo dzeuviri dzinowanikwa dziri mbiri (semeso), uye zvinhu zvakakura. Chivakashure ri- hachiwanzi kuonekwa pachena.',
    examples: ['Zino (ri + ino)', 'Banga', 'Zai', 'Danda', 'Gumbo'],
    challenge:
      'Chivakashure "ri-" chinowanikwa muzita ripi pakati peaya: Muti, Zino, Izi?',
  },
  {
    id: '6',
    label: 'Mupanda 6',
    prefix: 'Ma-',
    description:
      'Uyu ndiye uzhinji hweMupanda 5, 11, uye 21. Unomirirazve zvinhu zvinoyerera.',
    examples: ['Mazino', 'Mvura', 'Mapadza', 'Maoko', 'Mazai'],
    challenge: 'Nyora mazita maviri ezvinhu zvinoyerera anopinda muMupanda 6.',
  },
  {
    id: '7',
    label: 'Mupanda 7',
    prefix: 'Chi-',
    description:
      'Unomirira zvishandiso, mitauro, hurema, kana zvinhu zviduku zvichienzaniswa nehunhu hwawo.',
    examples: ['Chigaro', 'Chishona', 'Chikoro', 'Chirema', 'Chingwa'],
    challenge: 'Sei mutauro weChishona uchiiswa muMupanda 7?',
  },
  {
    id: '8',
    label: 'Mupanda 8',
    prefix: 'Zvi-',
    description: 'Uyu ndiye uzhinji hweMupanda 7.',
    examples: ['Zvigaro', 'Zvikoro', 'Zvirema', 'Zvingwa', 'Zvipo'],
    challenge: 'Nyora uzhinji hwezita rekuti "Chidya".',
  },
  {
    id: '9',
    label: 'Mupanda 9',
    prefix: 'N- / Ø- / I-',
    description:
      'Mumupanda uyu mune mazita emhuka zhinji, zvinhu zvemumba, uye mazita akatorwa mune mimwe mitauro. Ushoma hwawo.',
    examples: ['Imbwa', 'Mbudzi', 'Imba', 'Mombe', 'Huku'],
    challenge:
      'Nderipi zita riri muMupanda 9 pakati peaya: Zuva, Chikoro, Nzira?',
  },
  {
    id: '10',
    label: 'Mupanda 10',
    prefix: 'Dzi- / Ø- / N-',
    description:
      'Uyu ndiye uzhinji hweMupanda 9 uye 11. Chivakashure dzi- chinonyatsooneka kana tave kupa sungawirirano (concords).',
    examples: ['Dzimba', 'Mbudzi', 'Huni', 'Nzira', 'Mhosva'],
    challenge: 'Nyora uwandu hwezita rekuti "Imba".',
  },
  {
    id: '11',
    label: 'Mupanda 11',
    prefix: 'Ru-',
    description:
      'Unomirira zvinhu zvakareba kana nhengo dzeuviri. Uzhinji hwawo hunopinda muMupanda 6 kana 10.',
    examples: ['Ruoko', 'Rurimi', 'Rukuni', 'Rutsoka', 'Rudo'],
    challenge: 'Uzhinji hwezita rekuti "Rukuni" unopinda mupanda upi?',
  },
  {
    id: '12',
    label: 'Mupanda 12',
    prefix: 'Ka-',
    description:
      'Unoshandiswa kuderedza chinhu (diminutives), kureva chinhu chidiki zvakanyanya.',
    examples: ['Kambwa', 'Kamwana', 'Kamoto', 'Kasikana', 'Kamuti'],
    challenge: 'Shandura zita rekuti "Mbaura" kuti rive muMupanda 12.',
  },
  {
    id: '13',
    label: 'Mupanda 13',
    prefix: 'Tu- / Twu-',
    description: 'Uyu ndiye uzhinji hweMupanda 12.',
    examples: ['Tumbwa', 'Tuwana', 'Tumoto', 'Tusikana', 'Tumiti'],
    challenge: 'Nyora uzhinji hwa "Kambeva".',
  },
  {
    id: '14',
    label: 'Mupanda 14',
    prefix: 'U- / Hu- / Hw-',
    description:
      'Unomirira mazita asingabatiki (abstract nouns) kana upfu nemamiriro ehu-unhu.',
    examples: ['Upfu', 'Upenyu', 'Unhu', 'Hwahwa', 'Huori'],
    challenge: 'Nyora mazita maviri asingabatiki ari muMupanda 14.',
  },
  {
    id: '15',
    label: 'Mupanda 15',
    prefix: 'Ku-',
    description:
      'Unomirira zviito (infinitives/verbs) kana zvikazove mazita.',
    examples: ['Kudya', 'Kumhanya', 'Kuseka', 'Kurara', 'Kunyora'],
    challenge: 'Sei zwi rekuti "Kufamba" richinzi izita remupanda?',
  },
  {
    id: '16',
    label: 'Mupanda 16',
    prefix: 'Pa-',
    description:
      'Unoratidza nzvimbo iri pedyo kana chaiyo (Specific locative).',
    examples: ['Pamba', 'Pachikoro', 'Pasi', 'Pamusoro', 'Pachoto'],
    challenge: 'Gadzira chirevo uchishandisa zita riri muMupanda 16.',
  },
  {
    id: '17',
    label: 'Mupanda 17',
    prefix: 'Ku-',
    description:
      'Unoratidza nzvimbo yakati kure kana divi (Directional locative).',
    examples: ['Kumusha', 'Kuchikoro', 'Kure', 'Kumabvazuva', 'Kuminda'],
    challenge: 'Musiyano upi uripo pakati pekuti "Pamba" (16) uye "Kumba" (17)?',
  },
  {
    id: '18',
    label: 'Mupanda 18',
    prefix: 'Mu-',
    description: 'Unoratidza nzvimbo iri mukati (Interior locative).',
    examples: ['Mumba', 'Mudura', 'Muhomwe', 'Musango', 'Mukanwa'],
    challenge:
      'Chivakashure "mu-" chinoshandiswa sei muMupanda 18 kupa pfungwa yenzvimbo?',
  },
  {
    id: '19',
    label: 'Mupanda 19',
    prefix: 'Svi- / Sv-',
    description:
      'Unoshandiswa mururimi rweChiKaranga kureva zvinhu zvidiki zvichishoreka (Diminutives).',
    examples: ['Svimbudzi', 'Svimvura', 'Svimwana', 'Svinyama', 'Svichembere'],
    challenge:
      'Mumutauro upi weChishona munonyanya kushandiswa Mupanda 19?',
  },
  {
    id: '20',
    label: 'Mupanda 20',
    prefix: 'Haashandiswi',
    description:
      'Mupanda 20 hauwanzooneka muStandard Shona. Dzimwe nguva unonzi wakasiiwa nekuti unogona kureva zvinhu zvinonyadzisa kana kuti wakatsiviwa nemimwe mipanda.',
    examples: ['N/A'],
    challenge:
      'Tsvakurudza chikonzero nei mupanda uyu usisashandiswi muChishona chamazuva ano.',
  },
  {
    id: '21',
    label: 'Mupanda 21',
    prefix: 'Zi-',
    description:
      'Unoshandiswa kukurisa chinhu (Augmentative), dzimwe nguva nenzira yekushoreka kana kutyisa. Uzhinji hwawo unopinda muMupanda 6.',
    examples: ['Zimbwa', 'Zigomana', 'Zinyoka', 'Zimba', 'Zibanga'],
    challenge: 'Nyora uzhinji hwezita rekuti "Zibanga".',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION RANGES FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_RANGES = [
  { label: '1–5', start: 1, end: 5 },
  { label: '6–10', start: 6, end: 10 },
  { label: '11–15', start: 11, end: 15 },
  { label: '16–21', start: 16, end: 21 },
];

const getNumericId = (id: string): number => {
  const num = parseInt(id, 10);
  return isNaN(num) ? 0 : num;
};

const getSectionIndexForItem = (item: ClassItem) => {
  const num = getNumericId(item.id);
  const index = SECTION_RANGES.findIndex(
    (range) => num >= range.start && num <= range.end
  );
  return index === -1 ? 0 : index;
};

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const NounClassCard = memo(
  ({ item, isHighlighted }: { item: ClassItem; isHighlighted: boolean }) => {
    return (
      <div
        id={`class-${item.id}`}
        className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isHighlighted
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-2 ring-teal-500/50 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-teal-300 dark:hover:border-teal-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Number badge */}
          <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
            <span
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                isHighlighted
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
              }`}
            >
              {item.id}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <h3
              className={`text-lg md:text-xl font-bold leading-snug ${
                isHighlighted
                  ? 'text-teal-900 dark:text-teal-100'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {item.label}
              <span className="ml-2 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-700">
                {item.prefix}
              </span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left column: Description + Examples */}
              <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 block mb-1 tracking-wider">
                    Tsananguro
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1 tracking-wider">
                    Mienzaniso
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.examples.map((ex, idx) => (
                      <span
                        key={idx}
                        className="inline-block text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Challenge */}
              <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 block mb-1 tracking-wider">
                    Knowledge Challenge
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                    {item.challenge}
                  </p>
                </div>
                <button className="mt-2 self-start text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors flex items-center gap-1">
                  Think about it <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.isHighlighted === nextProps.isHighlighted
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const NounClasses: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [randomClass, setRandomClass] = useState<ClassItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const visibleClasses = useMemo(() => {
    const activeRange = SECTION_RANGES[activeSection];
    if (!activeRange) return [];

    return CLASSES_DATA.filter((item) => {
      const num = getNumericId(item.id);
      return num >= activeRange.start && num <= activeRange.end;
    });
  }, [activeSection]);

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }

    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = CLASSES_DATA.find(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.prefix.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.examples.some((ex) => ex.toLowerCase().includes(query)) ||
          item.challenge.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.id);
        setActiveSection(getSectionIndexForItem(match));
        window.setTimeout(() => {
          const element = document.getElementById(`class-${match.id}`);
          if (element) {
            const yOffset = -120;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 0);
      } else {
        setHighlightedId(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Scroll to section
  const scrollToSection = (index: number) => {
    setActiveSection(index);
    setHighlightedId(null);
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Pick a random class on mount
  useEffect(() => {
    const random = CLASSES_DATA[Math.floor(Math.random() * CLASSES_DATA.length)];
    setRandomClass(random);
  }, []);

  const refreshRandom = () => {
    const random = CLASSES_DATA[Math.floor(Math.random() * CLASSES_DATA.length)];
    setRandomClass(random);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="grid w-full grid-cols-[repeat(4,minmax(96px,1fr))] items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_RANGES.map((range, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className={`w-full rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              activeSection === idx
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200 dark:shadow-teal-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            MIPANDA YEMAZITA
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mipanda yeMazita
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl leading-relaxed">
            Dzidza mipanda yemazita echiShona. Nzwisisa chivakashure chega chega,
            mienzaniso, uye kushandiswa kwazvo. Ziva mutauro wenyu.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-teal-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {CLASSES_DATA.length} mipanda
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              🔄 Refresh for random class
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-teal-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a class or description..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-teal-200/70 font-medium"
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
                  <X size={18} className="text-teal-200" />
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
          {/* List of classes */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {SECTION_RANGES[activeSection].label} Mipanda
              </span>
              <span>{visibleClasses.length} shown</span>
            </div>

            {visibleClasses.length > 0 ? (
              visibleClasses.map((item) => (
                <NounClassCard
                  key={item.id}
                  item={item}
                  isHighlighted={item.id === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No classes in this number range.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Class Card */}
            <div className="rounded-2xl border border-teal-100 dark:border-teal-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  ✨ Random Class
                </h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-teal-500 dark:text-teal-400" />
                </button>
              </div>
              {randomClass && (
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {randomClass.label}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Prefix:</span> {randomClass.prefix}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                    {randomClass.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {randomClass.examples.map((ex, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
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
                  <span>Total Classes</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {CLASSES_DATA.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Shona entries</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {CLASSES_DATA.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Translated</span>
                  <span className="font-bold text-green-600 dark:text-green-400">✓ 100%</span>
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                💡 Did you know?
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Kuziva mipanda kunobatsira mudzidzi mukupa sungawirirano (concords)
                nemazvo uye kutaura Chishona chine hudzamu (Standard Shona).
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-teal-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mupanda:</strong> Noun class – a way to
                categorize nouns with specific prefixes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Chivakashure:</strong> The prefix that
                determines the class and concord.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mienzaniso:</strong> Example words
                showing the prefix in action.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Challenge:</strong> Test your
                understanding with a quick question.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>Use the search bar to find a specific class instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NounClasses;