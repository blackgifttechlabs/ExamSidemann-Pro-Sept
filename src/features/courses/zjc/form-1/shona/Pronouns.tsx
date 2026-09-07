import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
  Search, X, ChevronUp, RefreshCw, ShieldCheck, List,
  Target, Hash, Info, Bookmark, HelpCircle, Globe
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA
// ──────────────────────────────────────────────────────────────────────────────

interface Entry {
  num: number;
  shona: string;
  dudziro?: string;
  english: string;
  example?: string;
  translation?: string;
}

interface PronounCategory {
  id: string;
  title: string;
  description: string;
  entries: Entry[];
}

const CATEGORIES: PronounCategory[] = [
  {
    id: "personal",
    title: "Zvisazitasingwi ZveMunhu (Personal)",
    description: "Izvi zvinomirira vanhu kana zvinhu zviri kutaurwa nezvazvo muushoma kana muuzhinji.",
    entries: [
      { num: 1, shona: "Ini", dudziro: "Munhu ari kutaura", english: "I / Me", example: "Ini ndichaenda kumusha mangwana.", translation: "I will go home tomorrow." },
      { num: 2, shona: "Iwe", dudziro: "Munhu ari kutaurwa naye (singular)", english: "You", example: "Iwe unoda kudya chii?", translation: "What do you want to eat?" },
      { num: 3, shona: "Iye", dudziro: "Munhu ari kutaurwa nezvake (He/She)", english: "He / She", example: "Iye haazive kutyaira motokari.", translation: "He/She does not know how to drive a car." },
      { num: 4, shona: "Isu", dudziro: "Vanhu vari kutaura vari vakawanda", english: "We / Us", example: "Isu tiri vana vechikoro.", translation: "We are students." },
      { num: 5, shona: "Imi", dudziro: "Vanhu vari kutaurwa navo kana munhu mukuru (plural/respectful)", english: "You", example: "Imi mose mirai panze.", translation: "All of you stand outside." },
      { num: 6, shona: "Ivo", dudziro: "Vanhu vakawanda vari kutaurwa nezvavo", english: "They / Them", example: "Ivo vakasvika usiku.", translation: "They arrived at night." },
      { num: 7, shona: "Icho", dudziro: "Chinhu chiri mumupanda wechinomwe (Class 7)", english: "It", example: "Icho chigaro changu.", translation: "That is my chair." },
      { num: 8, shona: "Izvo", dudziro: "Zvinhu zviri mumupanda wechisere (Class 8)", english: "They", example: "Izvo zvinhu zvaJohn.", translation: "Those are John's things." },
      { num: 9, shona: "Iro", dudziro: "Chinhu chemupanda wechishanu (Class 5)", english: "It", example: "Iro banga rakapinza.", translation: "That knife is sharp." },
      { num: 10, shona: "Iwo", dudziro: "Chinhu chemupanda wechitatu (Class 3)", english: "It", example: "Iwo muti uyu murefu.", translation: "This tree is tall." }
    ]
  },
  {
    id: "absolute",
    title: "Zvisazitasingwi Zvamene (Absolute/Self)",
    description: "Anosimbisa pfungwa yekuti munhu ari kuita chinhu iye amene.",
    entries: [
      { num: 11, shona: "Pachangu", english: "By myself", example: "Ndakazviita pachangu." },
      { num: 12, shona: "Pachako", english: "By yourself", example: "Zviite pachako." },
      { num: 13, shona: "Pachake", english: "By himself / herself", example: "Akauya pachake." },
      { num: 14, shona: "Pachedu", english: "By ourselves", example: "Tichavaka pachedu." },
      { num: 15, shona: "Pachenyu", english: "By yourselves", example: "Gadzirai pachenyu." },
      { num: 16, shona: "Pavo", english: "By themselves", example: "Vachafamba pavo." },
      { num: 17, shona: "Pachacho", english: "By itself (Class 7)", example: "Chigaro chakaputsika pachacho." },
      { num: 18, shona: "Pazvo", english: "By themselves (Class 8)", example: "Zvikoro zvakavharwa pazvo." },
      { num: 19, shona: "Pacharo", english: "By itself (Class 5)", example: "Banga rakaguma pacharo." },
      { num: 20, shona: "Pawo", english: "By itself (Class 3)", example: "Muti wakawa pawo." }
    ]
  },
  {
    id: "quantitative",
    title: "Zvisazitasingwi zvoUwandu (Quantitative)",
    description: "Mazwi anoratidza huwandu achimirira mazita.",
    entries: [
      { num: 21, shona: "Tese", english: "All of us", example: "Tese tiri kuenda." },
      { num: 22, shona: "Vese", english: "All of them", example: "Vese vakasvika." },
      { num: 23, shona: "Mwese", english: "All of you", example: "Mwese mudye." },
      { num: 24, shona: "Chese", english: "Everything (Class 7)", example: "Idya chese." },
      { num: 25, shona: "Zvese", english: "Everything (Class 8)", example: "Zvese zvaparadzwa." },
      { num: 26, shona: "Rese", english: "The whole (Class 5)", example: "Zai rese rakashata." },
      { num: 27, shona: "Mese", english: "The whole (Class 3)", example: "Muti mese waoma." },
      { num: 28, shona: "Wose", english: "Everyone (Class 1)", example: "Munhu wose anoziva." },
      { num: 29, shona: "Ose", english: "All of them (Class 6)", example: "Mabasa ose apedzwa." },
      { num: 30, shona: "Rose", english: "The whole (Class 11)", example: "Ruoko rose rwakazvimba." }
    ]
  },
  {
    id: "demonstrative",
    title: "Zvisazitasingwi Kuratidza (Demonstrative)",
    description: "Zvinomirira zita zvichiratidza kwa riri kana kunongedzera.",
    entries: [
      { num: 31, shona: "Uyu", english: "This one (Class 1)", example: "Uyu ndiye mukoma." },
      { num: 32, shona: "Ava", english: "These ones (Class 2)", example: "Ava ndivo vadzidzi." },
      { num: 33, shona: "Uyu", english: "This one (Class 3)", example: "Uyu muti wangu." },
      { num: 34, shona: "Iyi", english: "These ones (Class 4)", example: "Iyi migwagwa yakaipa." },
      { num: 35, shona: "Iri", english: "This one (Class 5)", example: "Iri banga raJohn." },
      { num: 36, shona: "Aya", english: "These ones (Class 6)", example: "Aya mapfumo amambo." },
      { num: 37, shona: "Ichi", english: "This one (Class 7)", example: "Ichi chigaro chakatyoka." },
      { num: 38, shona: "Izvi", english: "These ones (Class 8)", example: "Izvi zvinhu zvakaora." },
      { num: 39, shona: "Ino", english: "This one (Class 9)", example: "Ino imbwa inoruma." },
      { num: 40, shona: "Idzi", english: "These ones (Class 10)", example: "Idzi huni dzaoma." },
      { num: 41, shona: "Uru", english: "This one (Class 11)", example: "Uru rurimi rwangu." },
      { num: 42, shona: "Aka", english: "This one (Class 12)", example: "Aka kamwana kanochema." },
      { num: 43, shona: "Utu", english: "These ones (Class 13)", example: "Utu tumbwa tunotiza." },
      { num: 44, shona: "Uhu", english: "This one (Class 14)", example: "Uhu hwahwa hunovava." },
      { num: 45, shona: "Uku", english: "This one (Class 15)", example: "Uku kudya kunonaka." },
      { num: 46, shona: "Apa", english: "This place (Class 16)", example: "Apa ndipo pamba pedu." },
      { num: 47, shona: "Uku", english: "This direction (Class 17)", example: "Uku ndiko kumunda." },
      { num: 48, shona: "Umu", english: "This inside (Class 18)", example: "Umu ndimo mumba." },
      { num: 49, shona: "Uyo", english: "That one (Class 1)", example: "Uyo mukomana anomhanya." },
      { num: 50, shona: "Avo", english: "Those ones (Class 2)", example: "Avo vanhu vakatiza." },
      { num: 51, shona: "Uyo", english: "That tree/thing (Class 3)" },
      { num: 52, shona: "Iyo", english: "Those trees/things (Class 4)" },
      { num: 53, shona: "Iro", english: "That egg/thing (Class 5)" },
      { num: 54, shona: "Ayo", english: "Those eggs/things (Class 6)" },
      { num: 55, shona: "Icho", english: "That chair (Class 7)" },
      { num: 56, shona: "Izvo", english: "Those chairs (Class 8)" },
      { num: 57, shona: "Iyo", english: "That dog (Class 9)" },
      { num: 58, shona: "Idzo", english: "Those dogs (Class 10)" },
      { num: 59, shona: "Urwo", english: "That tongue (Class 11)" },
      { num: 60, shona: "Ako", english: "That small child (Class 12)" },
      { num: 61, shona: "Utwo", english: "Those small dogs (Class 13)" },
      { num: 62, shona: "Uhwo", english: "That beer (Class 14)" },
      { num: 63, shona: "Ukwo", english: "That eating (Class 15)" },
      { num: 64, shona: "Apo", english: "That place (Class 16)" },
      { num: 65, shona: "Ukwo", english: "That direction (Class 17)" },
      { num: 66, shona: "Umo", english: "That inside (Class 18)" },
      { num: 67, shona: "Uya", english: "That one mentioned before (Class 1)" },
      { num: 68, shona: "Vaya", english: "Those mentioned before (Class 2)" },
      { num: 69, shona: "Uya", english: "That tree mentioned (Class 3)" },
      { num: 70, shona: "Iya", english: "Those trees mentioned (Class 4)" },
      { num: 71, shona: "Riya", english: "That knife mentioned (Class 5)" },
      { num: 72, shona: "Aya", english: "Those knives mentioned (Class 6)" },
      { num: 73, shona: "Chiya", english: "That chair mentioned (Class 7)" },
      { num: 74, shona: "Zviya", english: "Those chairs mentioned (Class 8)" },
      { num: 75, shona: "Iya", english: "That cow mentioned (Class 9)" },
      { num: 76, shona: "Dziya", english: "Those cows mentioned (Class 10)" },
      { num: 77, shona: "Ruya", english: "That arm mentioned (Class 11)" },
      { num: 78, shona: "Kaya", english: "That small child mentioned (Class 12)" },
      { num: 79, shona: "Tuya", english: "Those small things mentioned (Class 13)" },
      { num: 80, shona: "Huya", english: "That character mentioned (Class 14)" },
      { num: 81, shona: "Kuya", english: "That school mentioned (Class 15/17)" },
      { num: 82, shona: "Paya", english: "That place mentioned (Class 16)" },
      { num: 83, shona: "Muya", english: "That room mentioned (Class 18)" }
    ]
  },
  {
    id: "possessive",
    title: "Zvisazitasingwi zveMuiti/Zvaanazvo (Possessive)",
    description: "Izvi zvinomirira zita zvichiratidza muridzi.",
    entries: [
      { num: 84, shona: "Wangu", english: "Mine (Class 1/3)", example: "Uyu ndewangu." },
      { num: 85, shona: "Vangu", english: "Mine (Class 2)", example: "Ava ndevangu." },
      { num: 86, shona: "Changu", english: "Mine (Class 7)", example: "Ichi ndechangu." },
      { num: 87, shona: "Zvangu", english: "Mine (Class 8)", example: "Izvi ndezvangu." },
      { num: 88, shona: "Wako", english: "Yours (Class 1/3)", example: "Uyu ndewako." },
      { num: 89, shona: "Chako", english: "Yours (Class 7)", example: "Ichi ndechako." },
      { num: 90, shona: "Wake", english: "His / Hers (Class 1)", example: "Uyu ndewake." },
      { num: 91, shona: "Chake", english: "His / Hers (Class 7)", example: "Ichi ndechake." },
      { num: 92, shona: "Wedu", english: "Ours (Class 1)", example: "Uyu ndewedu." },
      { num: 93, shona: "Chedu", english: "Ours (Class 7)", example: "Ichi ndechedu." },
      { num: 94, shona: "Wenyu", english: "Yours plural (Class 1)", example: "Uyu ndewenyu." },
      { num: 95, shona: "Chenyu", english: "Yours plural (Class 7)", example: "Ichi ndechenyu." },
      { num: 96, shona: "Wavo", english: "Theirs (Class 1)", example: "Uyu ndewavo." },
      { num: 97, shona: "Chavo", english: "Theirs (Class 7)", example: "Ichi ndechavo." },
      { num: 98, shona: "Yangu", english: "Mine (Class 4/9)", example: "Idzi ndedzangu." },
      { num: 99, shona: "Rwangu", english: "Mine (Class 11)", example: "Uru ndorwangu." },
      { num: 100, shona: "Kwangu", english: "Mine / My place (Class 15/17)", example: "Uku ndekwangu." }
    ]
  }
];

// Flatten for search
const ALL_ENTRIES = CATEGORIES.flatMap(cat => cat.entries.map(e => ({ ...e, categoryId: cat.id })));

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const PronounCard = memo(({ item, isHighlighted }: { item: Entry; isHighlighted: boolean }) => {
  return (
    <div
      id={`pronoun-${item.num}`}
      className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
        isHighlighted
          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 ring-2 ring-rose-500/50 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-rose-300 dark:hover:border-rose-700'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Top: number + English tag */}
        <div className="flex justify-between items-start">
          <span className="text-2xl md:text-3xl font-black text-rose-600 dark:text-rose-400/10 dark:text-white/5 group-hover:text-rose-600 dark:text-rose-400/20 transition-colors leading-none">
            {item.num}
          </span>
          <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest rounded-full">
            {item.english}
          </span>
        </div>

        {/* Shona term */}
        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-rose-600 dark:text-rose-400 transition-colors">
          {item.shona}
        </h3>

        {/* Dudziro if present */}
        {item.dudziro && (
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {item.dudziro}
          </p>
        )}

        {/* Example and translation */}
        {item.example && (
          <div className="mt-2 pt-3 border-t border-gray-100 dark:border-[#404040] space-y-1">
            <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Muenzaniso</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{item.example}"</p>
            {item.translation && (
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.translation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const Pronouns: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [randomItem, setRandomItem] = useState<Entry | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Get current category entries
  const currentCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === activeCategory);
  }, [activeCategory]);

  const currentEntries = useMemo(() => {
    return currentCategory?.entries || [];
  }, [currentCategory]);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }

    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = ALL_ENTRIES.find(
        item =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          (item.dudziro && item.dudziro.toLowerCase().includes(query)) ||
          (item.example && item.example.toLowerCase().includes(query))
      );

      if (match) {
        setHighlightedId(match.num);
        setActiveCategory(match.categoryId);
        setTimeout(() => {
          const element = document.getElementById(`pronoun-${match.num}`);
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

  // Random item on mount
  useEffect(() => {
    const random = ALL_ENTRIES[Math.floor(Math.random() * ALL_ENTRIES.length)];
    setRandomItem(random);
  }, []);

  const refreshRandom = () => {
    const random = ALL_ENTRIES[Math.floor(Math.random() * ALL_ENTRIES.length)];
    setRandomItem(random);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setHighlightedId(null); }}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.title.split('(')[0].trim()} ({cat.entries.length})
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
      {/* Random Pronoun */}
      <div className="rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">📖 Random Pronoun</h3>
          <button
            onClick={refreshRandom}
            className="p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
          >
            <RefreshCw size={16} className="text-rose-500 dark:text-rose-400" />
          </button>
        </div>
        {randomItem && (
          <div className="space-y-2">
            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
              {randomItem.shona}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              {randomItem.english}
            </p>
            {randomItem.dudziro && (
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {randomItem.dudziro}
              </p>
            )}
            {randomItem.example && (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                “{randomItem.example}”
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex justify-between">
            <span>Zvisazitasingwi Zvose</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{ALL_ENTRIES.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Categories</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{CATEGORIES.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Current Category</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[120px]">
              {currentCategory?.title.split('(')[0].trim()}
            </span>
          </li>
        </ul>
      </div>

      {/* Quick Tip */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
        <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Tip</h4>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          Pronouns (zvisazitasingwi) replace nouns to avoid repetition. They agree with the noun class of the noun they replace.
        </p>
      </div>
    </aside>
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
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm flex items-center gap-2">
            <Target size={14} />
            ZVISAZITASINGWI • PRONOUNS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Zvisazitasingwi
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl leading-relaxed">
            Zvisazitasingwi zvinomirira mazita (zita) mumutauro. Zvinobatsira kudzivisa kudzokorora mazita uye zvinoratidza munhu, nhamba, uye mupanda wezita.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-rose-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {ALL_ENTRIES.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random pronoun</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-rose-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a pronoun or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-rose-200/70 font-medium"
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
                  <X size={18} className="text-rose-200" />
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
          {/* List of pronouns */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {currentCategory?.title}
              </span>
              <span>{currentEntries.length} shown</span>
            </div>

            {currentEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentEntries.map((item) => (
                  <PronounCard
                    key={item.num}
                    item={item}
                    isHighlighted={item.num === highlightedId}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No pronouns in this category.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <Sidebar />
        </div>
      </div>

      {/* ─── Summary Table ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] shadow-sm overflow-hidden">
          <div className="bg-rose-600 dark:bg-rose-500 px-6 py-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Bookmark size={18} /> Muchidimbu (Summary) – Personal Pronouns
            </h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <th className="p-3 font-bold">Munhu (Person)</th>
                  <th className="p-3 font-bold">Ushoma (Singular)</th>
                  <th className="p-3 font-bold">Uwandu (Plural/Respect)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-slate-600 dark:text-slate-300">weKutanga (1st)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Ini (I/Me)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Isu (We/Us)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-slate-600 dark:text-slate-300">weChipiri (2nd)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Iwe (You)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Imi (You)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-bold text-slate-600 dark:text-slate-300">weChitatu (3rd)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Iye (He/She)</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Ivo (They/Them)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-rose-600 to-rose-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-rose-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Personal Pronouns:</strong> Replace nouns for people/things (Ini, Iwe, Iye, etc.)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Absolute/Self:</strong> Emphasise the subject (Pachangu, Pachako, etc.)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Quantitative:</strong> Indicate quantity (Tese, Vese, etc.)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Demonstrative:</strong> Point to specific things (Uyu, Aya, Ichi, etc.)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-300 font-bold">•</span>
              <span>
                <strong className="text-white">Possessive:</strong> Show ownership (Wangu, Chako, etc.)
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pronouns;