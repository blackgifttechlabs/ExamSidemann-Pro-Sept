import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
  BookOpen, Mail, CheckCircle, Trophy, ArrowRight, ShieldCheck,
  RefreshCw, Zap, Eye, AudioLines, Brain, MapPin, Phone,
  Sparkles, LogIn, AlertCircle, UserCheck,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA (unchanged)
// ──────────────────────────────────────────────────────────────────────────────

interface QuizItem {
  q: string;
  o: string[];
  a: number;
}

const QUIZ_DATA: QuizItem[] = [
  {
    q: "Zvikamu zvitatu zvikuru zvinoumba chivakiro ndezvipi?",
    o: ["Kero, Muviri, Zuva", "Nhanganyaya, Muviri, Mhedziso", "Kwaziso, Muviri, Zita", "Musoro, Kero, Kwaziso"],
    a: 1
  },
  {
    q: "Rondedzero inotaura nezvengano kana zviitiko zvakamboitika inonzi rondedzero ye-...?",
    o: ["Kutura (Narrative)", "Kutsanangura (Descriptive)", "Chokwadi (Factual)", "Hofisi (Formal)"],
    a: 0
  },
  {
    q: "Mutsamba yeHofisi, kero yemunhu waunonyorera inonyorwa kupi?",
    o: ["Kurudyi kumusoro", "Kuruboshwe, pasi pekero yako", "Pakati petende rechinyoreso", "Kurudyi pasi pezuva"],
    a: 1
  },
  {
    q: "Chinhu chipi chinowanikwa mutsamba yeHofisi asi chisingawanikwi mutsamba yeshamwari?",
    o: ["Zuva (Date)", "Kwaziso (Salutation)", "Musoro weNyaya (Subject Line)", "Ndima (Paragraphs)"],
    a: 2
  },
  {
    q: "Rondedzero yekutsanangura inofanira kushandisa chii kuti in'anzve?",
    o: ["Manyorerwo etsamba", "Nhengo dzeuviri (sekuona nekunzwa)", "Kero mbiri dzehofisi", "Mazita evanhu vakura"],
    a: 1
  },
  {
    q: "Ndeapi manyorerwo ezuva echishona ari pamutemo muForm 1?",
    o: ["20/11/2023", "20-11-23", "20 Mbudzi 2023", "November 20, 2023"],
    a: 2
  },
  {
    q: "Pakugumisa tsamba yeshamwari, ndeapi mashoko akafanira kushandiswa?",
    o: ["Wenyu akavimbika", "Ndini maneja wenyu", "Shamwari yako / Mwana wenu", "Vanotumbidzwa"],
    a: 2
  },
  {
    q: "Nhanganyaya yerondedzero ine basa rei guru?",
    o: ["Kukwezva muverengi nekuvhura nyaya", "Kupeta nyaya nekupa chidzidzo", "Kunyora kero nezuva", "Kubvunza utano"],
    a: 0
  },
  {
    q: "Manyorerwo etsamba yeHofisi anoshandisa mutauro wakaita sei?",
    o: ["Wakasununguka chose", "Une ngano dzekunyepa", "Unoremekedza uye unonanga panhau yacho", "Une slang"],
    a: 2
  },
  {
    q: "Pfungwa itsva imwe neimwe murondedzero inofanira kuiswa kupi?",
    o: ["Mukero yeunonyorera", "Mundima (paragraph) itsva", "Mumusoro wenyaya chete", "Pamusi unotevera"],
    a: 1
  }
];

// ─── Proverb list for sidebar ──────────────────────────────────────────────
const PROVERBS = [
  { shona: "Chara chimwe hachitswanyi inda", english: "Unity is strength" },
  { shona: "Kugara nhaka huona dzavamwe", english: "Learn from others" },
  { shona: "Rega zvipore", english: "Let bygones be bygones" },
  { shona: "Moyo muti unomera paunoda", english: "Love is unpredictable" },
  { shona: "Kandiro enda kanobva kamwe", english: "You reap what you sow" },
  { shona: "Chinono chinengwe bere rakadya richifamba", english: "Slow but sure" },
  { shona: "Mhembwe rudzi inozvara mwana ane kazimhumhu", english: "Like father like son" },
  { shona: "Kuwanda huuya", english: "There is safety in numbers" }
];

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED COMPONENTS
// ──────────────────────────────────────────────────────────────────────────────

// Notebook-style sample renderer
const NotebookSample = memo(({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="p-6 md:p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
    <div className="relative">
      <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
      <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.2rem", lineHeight: "32px", transform: "rotate(-0.5deg)" }}>
        {title && <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">{title}</div>}
        {children}
      </div>
    </div>
  </div>
));

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('rondedzero');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [randomProverb, setRandomProverb] = useState(PROVERBS[0]);

  const { user, updateQuizScore } = useAuth();

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random proverb on mount
  useEffect(() => {
    const random = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    setRandomProverb(random);
  }, []);

  const refreshProverb = () => {
    const random = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    setRandomProverb(random);
  };

  // ─── Quiz handlers ──────────────────────────────────────────────────────
  const handleOptionClick = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === QUIZ_DATA[currentQuestion].a) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
      if (user) {
        const pointsEarned = score * 5;
        await updateQuizScore('form1_shona_lo1_quiz', pointsEarned);
      }
    }
  };

  // ─── Container classes ─────────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Navigation tabs ───────────────────────────────────────────────────
  const tabs = [
    { id: 'rondedzero', label: 'Rondedzero' },
    { id: 'tsamba', label: 'Tsamba' },
    { id: 'exam', label: 'Exam Tips' },
    { id: 'quiz', label: 'Quiz' }
  ];

  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Sidebar ────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
      {/* Random Proverb */}
      <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">📖 Shona Proverb</h3>
          <button
            onClick={refreshProverb}
            className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
          >
            <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">
            {randomProverb.shona}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            {randomProverb.english}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Module Stats</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex justify-between">
            <span>Sections</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
          </li>
          <li className="flex justify-between">
            <span>Sample Essays</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
          </li>
          <li className="flex justify-between">
            <span>Quiz Questions</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">{QUIZ_DATA.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Proverbs</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">{PROVERBS.length}</span>
          </li>
        </ul>
      </div>

      {/* Quick Reference */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
        <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Quick Reference</h4>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          <strong>Rondedzero:</strong> Nhanganyaya → Mutumbi (3-5 ndima) → Mhedziso.<br/>
          <strong>Tsamba:</strong> Kero + Zuva → Kero yemunhu → Musoro (formal) → Muviri → Kuvhara.
        </p>
      </div>
    </aside>
  );

  // ─── Render sections based on active tab ──────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'rondedzero':
        return (
          <div className="space-y-12">
            {/* Intro */}
            <div className="bg-orange-600/5 dark:bg-orange-500/5 border border-orange-600/10 dark:border-orange-500/10 p-6 md:p-10 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Rondedzero | Composition Writing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest text-xs">Tsananguro Yakadzama</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                    Rondedzero kunyora uchitsanangura munhu/chinhu/nzvimbo/chiitiko neudzame zvekuti muverengi anochiona mupfungwa dzake. <br/><span className="italic text-gray-500 relative mt-2 block pl-4 border-l-2 border-gray-300 dark:border-gray-600">English: Detailed descriptive writing that creates mental pictures.</span>
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest text-xs">Chinangwa Chikuru</h3>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                    Kuedza mutauro wako, manyorerwo, kuronga pfungwa, nekushandisa tsumo kana madimikira.
                  </p>
                </div>
              </div>
            </div>

            {/* Structure Table */}
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Structure Yerondedzero Yakakwana</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px] text-sm">
                  <thead>
                    <tr className="bg-orange-600 text-white text-xs uppercase tracking-widest">
                      <th className="p-4 rounded-tl-xl">Chikamu</th>
                      <th className="p-4">Zvekuita</th>
                      <th className="p-4">Words/Marks</th>
                      <th className="p-4">Mazano</th>
                      <th className="p-4 rounded-tr-xl bg-red-600">Exam Tip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                    {[
                      ['1. MUSORO', 'Nyora musoro wakapihwa. Usakanganwe kuisa pasi pemusoro mutsetse.', '-', 'Kana iri sarudzo, sarudza musoro waunonyatsonzwisisa.', '1 mark inobviswa kana pasina musoro.'],
                      ['2. NHANGANYAYA', 'Suma chidzidzo. Taura zvauri kuda kurondedzera. Shandisa hook.', '40-50 words', 'Tanga netsumo, mubvunzo, kana chirevo chinokatyamadza.', 'Marker anoverenga nhanganyaya first.'],
                      ['3. MUTUMBI', 'Iyi ndiyo nyama yenyaya. 3-5 ndima. Ndima imwe = pfungwa imwe.', '200-250 words', 'Tevedzanisa: Pakutanga, chechipiri, Uyezve, Pakupedzisira.', 'Shandisa zvipikisi zvakawanda.'],
                      ['4. MHEDZISO', 'Pedzisa. Ipa maonero ako, chidzidzo, kana manzwiro.', '30-40 words', 'Usasuma pfungwa itsva. Dzokorora pfungwa huru.', 'Pedzisa netsumo. (2 marks emahara)']
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''}>
                        <td className="p-4 font-bold text-orange-600 dark:text-orange-400">{row[0]}</td>
                        <td className="p-4">{row[1]}</td>
                        <td className="p-4 font-mono text-xs">{row[2]}</td>
                        <td className="p-4">{row[3]}</td>
                        <td className="p-4 text-[#ff7400] dark:text-red-400 font-bold">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 text-xs font-mono bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl w-fit border border-orange-100 dark:border-orange-800">
                <div><span className="font-bold text-orange-600 dark:text-orange-400">Grade 7:</span> 250-300 words</div>
                <div><span className="font-bold text-orange-600 dark:text-orange-400">O Level:</span> 350-450 words</div>
              </div>
            </div>

            {/* 4 Types */}
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Mhando 4 Dzakadzama Dzerondedzero + Samples</h3>
              
              {/* Type 1 */}
              <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                  <h4 className="font-black text-lg md:text-xl text-orange-600 dark:text-orange-400 uppercase">Type 1: Rondedzero yemunhu | Character Sketch</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Zvekusanganisira:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                        <li>Chitarisiko chekunze - kureba, muviri, chiso</li>
                        <li>Hunhu hwemukati - moyo murefu? anosetsa?</li>
                        <li>Zvaanoita - basa rake, maitiro</li>
                        <li>Maonero ako kwaari - unomuda sei?</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Madimikira Anobatsira:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                        <li>Bvudzi rakaita samakuti = very black hair</li>
                        <li>Maziso akaita senyenyedzi = bright eyes</li>
                        <li>Moyochena = kind-hearted</li>
                        <li>Shungu dzakaita semoto = very passionate</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <NotebookSample title="Mukoma Wangu">
                  <div className="indent-8 text-justify">
                    Zvinonzi nevakuru ropa harisi mvura, uye munhu kubuda panyama yamai kwete pabutiro chairo. Izvi ndozvinondipa manyawi kana ndichifunga nezvemukoma wangu wandinodada naye zvikuru muno panyika. Mukoma wangu uyu anonzi Tafadzwa. Iye iye zvino ava kusvitsa makore makumi maviri nemashanu ekuberekwa, uye ndiye dangwe mumhuri yekwedu ine vana vatatu.
                  </div>
                  <div className="indent-8 text-justify">
                    Pakatarisika, Tafadzwa imurume akareba seshongwe, mutema pachiropa akati svii, ruvara runoyevedza. Ane muviri wakasimba unoenderana neurefu hwake, zvekuti ukamuona achifamba unoti ijaya rakabikwa rikaibva. Kumeso kwake kune mufaro unokwezva, uyezve ane mazino akachena semukaka unodziya. Anogara akaveura musoro wake zvinoita kuti agare achitaridzika seane hutsanana hwepamusoro. Kana achinge apfeka nhumbi dzake, kunyanya mbatya dzekubasa dzakachakwa zvine mutsindo, anoyevedza zvikuru zvinosiya vanhu vachiyemura.
                  </div>
                  <div className="indent-8 text-justify">
                    Panyaya yehunhu netsika, Tafadzwa igudo guru kurova hwayo. Munhu anoremekedza munhu wese, kubva kuvana vadiki kusvika kuvakuru. Haasi munhu ane zhowezhowe, asi kana ataura, mashoko ake anenge azere huchenjeri zvekuti vanhu vanomuteerera. Kunyange zvazvo aine mwoyo munyoro uye achida kuseka, mukoma wangu haasekereri nzenza kana ufuza. Kana wadarika, anokutsiura nehasha dziri pakati nepakati achikuudza chokwadi chisina muti-kana.
                  </div>
                  <div className="indent-8 text-justify">
                    Mukuwedzera, ijaya rinoshinga pabasa seshumba. Anomuka machongwe asati akurura achienda kubasa rake rekuveza, achitevedzera tsumo inoti chingwa cheziya chinotapira. Haadi kuona nungo pagakava, uye ndiye anochengeta mhuri yedu kubvira pakashaya baba vedu.
                  </div>
                  <div className="indent-8 text-justify">
                    Kana awana nguva yekuzorora pakupera kwevhiki, Tafadzwa anofarira zvikuru kutamba bhora renhabvu. Iye mutambi anotyisa zvikuru pakurwisa muchikwata chekumusha kwedu. Kunze kwebhora, anofarirawo kuverenga mabhuku akasiyana-siyana uye kuteerera nziyo dzechinyakare, zvikuru nziyo dzaOliver Mtukudzi idzo dzaanoti dzinomupa mazano ekurarama.
                  </div>
                  <div className="indent-8 text-justify">
                    Muchidimbu, Tafadzwa haasi mukoma chete kwandiri, asi ndiye bango randinozembera paumbirwo wehupenyu hwangu. Ndiye gwara randinotevedzera, anondibhadharira mari yechikoro, nekundipa mazano anovaka mune zvese zvandinoita. Kudai zvainzi vanhu vanotengwa sematamba emusango, ndingadai ndisina mari yakakwana yekumutenga nekuti akakosha kudarika ndarama. Ndinogara ndichinamatira kuti Musiki amuwedzere mamwe mazuva ekupona, ararame kusvika aita raiti chairo pakuchembera.
                  </div>
                </NotebookSample>
              </div>

              {/* Type 2 */}
              <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                  <h4 className="font-black text-lg md:text-xl text-orange-600 dark:text-orange-400 uppercase">Type 2: Rondedzero yenzvimbo | Describing a place</h4>
                  <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-4 mb-2">Zvekusanganisira:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Zita renzvimbo, Zvaunoona, Zvaunonzwa, Zvaunonhuwidza, Manzwiro.</p>
                </div>
                <NotebookSample title="Kumusha Kwedu KuNyanga">
                  <div className="indent-8 text-justify">
                    Mukunyora Rondedzero yeNzvimbo (Describing a place), chinangwa chikuru kupa muverengi mufananidzo uri mupfungwa (mental picture) achishandisa mazwi anoburitsa zvinoonekwa (sight), zvinonzwika (sound), zvinonhuwirira (smell), pamwe nemamiriro ekunze (atmosphere/weather). Heino rondedzero inotevedzera mitemo yese yekunyora nezvenzvimbo:
                  </div>
                  <div className="indent-8 text-justify mt-4">
                    Vakuru vanoti chitsva chiri murutsoka, asi ini ndinoti kunyange ukafamba nyika yose uchitsvaga nzvimbo inoyevedza, haumbowani inokunda kumusha kwedu kuNyanga. Dunhu iri rinowanikwa kumabvazuva kwenyika yeZimbabwe mupurovhinzi yeManicaland. Inzvimbo yakakomborerwa neMusiki, izere nerunako rwunoita kuti ufunge kuti wasvika mumunda weEdheni.
                  </div>
                  <div className="indent-8 text-justify">
                    Kana uchipinda munharaunda yekumusha kwedu, chinotanga kukugamuchira maumbirwo epasi anoyevedza. Nyanga idunhu rakazara makomo akareba anotumira misoro yawo kumatenga, kusanganisira gomo guru reInyangani rinova ndiro rakarebesa munyika yose. Pakati pemakomo aya panoyerera nzizi dzine mvura inotonhora seyaigwa chando, yakachena kuti mbeu. Nzizi idzi, dzakaita saPungwe, hadzimbopwi kunyange munguva yekusanaya kwemvura (dry season), uye dzinoita mapopoma anodonha nemutsindo unonakidza kuteerera.
                  </div>
                  <div className="indent-8 text-justify">
                    Mamiriro ekunze ekuNyanga akasiyana zvikuru nedzimwe nzvimbo dzemuZimbabwe. Kuno, kunogara kuchitonhora, zvikuru munguva yechando apo chando chacho chinokwenga mapfuba. Mangwanani ega ega, makomo anenge akafukidzwa nemhute yakati pfumbvuvu, zvekuti haukwanisi kuona munhu ari chinhambwe chidiki kubva pauri. Mhepo inovhuvhuta ichipfuura nemumiti inoridza mhere inoita sekuimba kwakanaka, zvichisiya nzvimbo yacho yakati tonho uye iine runyararo runozorodza mweya.
                  </div>
                  <div className="indent-8 text-justify">
                    Panyaya yezvinomera nemhuka, kumusha kwedu hakusariri shure. Makomo nemipata zvakavharwa nemiti yemipaini (pine trees) nemiwattle yakasvibira kuti mbishi gore rose. Kana ari mapurazi eikoko, akazara nemichero inodonhedza mate yakaita semaapuro, mapichisi, nemapuremu. Munzizi dzedu ndimo munowanikwa hove dzinonaka zvikuru dzemutirauti (trout fish), idzo dzinokwezva vashanyi vanobva mhiri kwemakungwa kuzoredza nekuona runako urwu.
                  </div>
                  <div className="indent-8 text-justify">
                    Kunze kwerunako rwenzvimbo iyi, vanhu vekuNyanga vane rudo negamuchidzanwa. Idunhu rinogara vanhu vanoshanda nesimba, varimi vehurudza vasingadyi cheziya. Havazezi kurima chibage, mbatatisi, nemichero zvisinei nekukwidza nekudzika kwenzvimbo yacho.
                  </div>
                  <div className="indent-8 text-justify">
                    Kutaura zvokwadi, Nyanga inzvimbo inovaraidza inodadisa. Kana ndiri kure nekumusha, ndinogara ndichisuwa ruzha rwemapopoma emvura, kunhuwirira kwemiti yemipaini pamwe nemhepo inotonhorera yeko. Kudai pakuumbwa kwepasi ndaivapo, ndingadai ndakakumbira Musiki kuti vanhu vose vagare munzvimbo inoyevedza sekuNyanga kwedu.
                  </div>
                </NotebookSample>
              </div>

              {/* Type 3 */}
              <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                  <h4 className="font-black text-lg md:text-xl text-orange-600 dark:text-orange-400 uppercase">Type 3: Rondedzero yechiitiko | Narrative Event</h4>
                  <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-4 mb-2">Zvekusanganisira:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Nguva, nzvimbo, vanhu, zvakaitika nhanho-nhanho, manzwiro ako.</p>
                </div>
                <NotebookSample title="Zuva Randisingakanganwi: Muchato Wahanzvadzi Yangu">
                  <div className="indent-8 text-justify">
                    Vakuru vane tsumo inoti, "Chembere mukadzi, hazvienzani nekurara mugota." Mufaro neshungu dzekupemberera dzakanga dzazadza mhepo musi weMugovera wadarika, apo hanzvadzi yangu yandinotevera, Chipo, yakasunga pfundo dzvene remuchato nemudiwa wayo Tendai. Ndiko kekutanga mumhuri yekwedu kuti paitwe muchato mutsvene, saka zuva iri rakanyorwa nemabhii egoridhe munhoroondo yemhuri yedu.
                  </div>
                  <div className="indent-8 text-justify">
                    Zuva iri harina kutanga semazuva ose ekuzorora atakaroverera. Takamuka mashambanzou, kureva kwayedza kumakomba, mumba maita muremure wevanhu vachigadzirira. Madzimai emumusha ainge akabatikana kubika kudya kwemabiko apo ini nevamwe vakomana taigadzira matende pamwe nekuronga zvigaro panhandare. Ruzha rwemikombe, ndiro, pamwe nengoma dzairidzwa zvinyoronyoro zvaiita kuti mwoyo upfakanyike nemufaro uchiyeuchidza kuti zuva guru rasvika.
                  </div>
                  <div className="indent-8 text-justify">
                    Nguva dzegumi dzepakuseni dzisati dzakwana, takanga tava muKereke yeRoman Catholic kumusha kwedu kwaZvimba. Chipo akapinda muchechi akaperekedzwa nababa vedu. Ainge akapfeka rokwe jena kuti mbeu ranga rakarukwa nounyanzvi hukuru rine twumaruva twaipenya kuti ngwengwengwe. Kumeso kwake kwaiva nenyemwerero inobuda mumwoyo, ruzhinji rwakaombera maoko huchipururudzwa kuita sekunge kereke ichadonha pasi. Mufundisi akavatungamirira pakutsigira mhiko dzavo, apo vaviri ava vakavimbisana rudo murufaro nemunhamo kusvika rufu rwavapatsanura. Pavakapingudzana mhete nekutsvodana, mufaro wakaputika mumba imomo kusvika nekuvacheche chaivo vachisvetuka-svetuka.
                  </div>
                  <div className="indent-8 text-justify">
                    Mushure mekereke, takananga kunhandare yaiva yakashongedzwa zvine mutsindo kumabiko makuru. Pano, ndipo pakaitwa zvekudya zvemakoko chaiwo. Vanhu vakadya nyama, mupunga, masaradhi nezvimwe zvinonaka zvekuti mafuta aidonha nenzeve. Zvinwiwa zvaivapo zvisingaverengeki zvekugeza huro. Chikwata chekuimba chakazotamba nziyo dzaifadza zvekuti vanhu vakapinda paderere vakatamba bhora ravo rechipisirana guruva rikati bvuu kusvika kumatenga. Yaiva mhemberero inodadisa zvechokwadi apo hama neshamwari dzaikanda zvipo zvakasiyana-siyana mundiro kuitira kusimudzira imba itsva yainge yaumbwa.
                  </div>
                  <div className="indent-8 text-justify">
                    Zuva rakazoti rovira pamakomo, mufaro uchienderera mberi asi vamwe vachitotanga kukakasha kuenda kudzimba dzavo. Vabereki vangu vaifamba vakafongora mapepa vachidada nemwanasikana wavo. Kana ndichifunga nezvezuva iri, mwoyo wangu unofara zvikuru. Raiva zuva rinoshamisa uye ndinonamatira kuti Chipo naTendai vave nemba inofara izere chikomborero chaMwari. Zuva iri ndicharamba ndakarichengetedza mundangariro dzangu kusvika narini.
                  </div>
                </NotebookSample>
              </div>

              {/* Type 4 */}
              <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                  <h4 className="font-black text-lg md:text-xl text-orange-600 dark:text-orange-400 uppercase">Type 4: Rondedzero yetsanangudzo | Explanatory</h4>
                </div>
                <NotebookSample title="Kurima Chibage">
                  <div className="indent-8 text-justify">
                    Chibage ndicho chikafu chikuru muZimbabwe. Kurima chibage kune matanho akakosha.
                  </div>
                  <div className="indent-8 text-justify">
                    Chekutanga, gadzira munda. Bvisa sora rese worima pasi zvakanaka. Mirira mvura yekutanga yonaya.
                  </div>
                  <div className="indent-8 text-justify">
                    Chechipiri, dyara mbeu. Isa mbeu mbiri kana nhatu mugomba rimwe, woisa mafiti maviri pakati pemugomba. Fukidza nevhu zvishoma.
                  </div>
                  <div className="indent-8 text-justify">
                    Chechitatu, sakura. Kana chibage chamera, bvisa sora rese kuti chisadya chikafu chechibage. Isa fetereza kana chibage chasvika pabvi.
                  </div>
                  <div className="indent-8 text-justify">
                    Pakupedzisira, gohwo. Kana mashizha aoma uye dzinde ratsvukira, chibage chaibva. Bvura woisa mudura.
                  </div>
                  <div className="indent-8 text-justify">
                    Kana ukatevedza matanho aya, uchawana goho rakanaka. Vanoti kandiro enda kanobva kamwe, asi kana ukarima zvakanaka, kandiro kanobva kazere.
                  </div>
                </NotebookSample>
              </div>
            </div>
          </div>
        );

      case 'tsamba':
        return (
          <div className="space-y-12">
            <div className="bg-orange-600/5 dark:bg-orange-500/5 border border-orange-600/10 dark:border-orange-500/10 p-6 md:p-10 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Tsamba | Letter Writing</h2>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Tsamba itsamba inonyorwa kushamwari kana kuhama (informal) kana kumukuru webasa, chikoro, kana hofisi (formal). Mitemo yese inofanira kutevedzwa kuti tsamba ive nekurongeka.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#1e1e1e] p-6 border border-gray-200 dark:border-[#404040] rounded-xl">
                <h4 className="font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4">Mitemo Yese Yetsamba</h4>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Kero + Zuva:</span> top right, hapana zita rako pano</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Mutauro:</span> zvinoenderana nekuti ndiyani wauri kunyorera</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Ndima:</span> siya mutsetse pakati pendima</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Kuvhara:</span> zvinoenderana nerudzi rwetsamba</div></li>
                </ul>
              </div>

              <div className="bg-orange-600 dark:bg-orange-900 border border-orange-500/20 text-white p-6 rounded-xl shadow-lg">
                <h4 className="font-black uppercase tracking-widest mb-4 text-orange-100">TSAMBA YEUSHAMWARI VS YEPAMUTEMO</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-white/20">
                        <td className="py-2 font-bold opacity-70">Chinangwa</td>
                        <td className="py-2">Kukurukura, kufara  <br/><span className="text-orange-300 font-black">Vs</span> Kukumbira, kunyunyuta, kuita report</td>
                      </tr>
                      <tr className="border-b border-white/20">
                        <td className="py-2 font-bold opacity-70">Kukwazisa</td>
                        <td className="py-2">Wadiwa..., Mudiwa... <br/><span className="text-orange-300 font-black">Vs</span> Changamire, Madame...</td>
                      </tr>
                      <tr className="border-b border-white/20">
                        <td className="py-2 font-bold opacity-70">Mutauro</td>
                        <td className="py-2">Wemazuva ese, majee <br/><span className="text-orange-300 font-black">Vs</span> Unoremekedza, hapana majee</td>
                      </tr>
                      <tr className="border-b border-white/20">
                        <td className="py-2 font-bold opacity-70">Kuvhara</td>
                        <td className="py-2">Wako, Shamwari yako <br/><span className="text-orange-300 font-black">Vs</span> Wenyu akatendeka...</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold opacity-70">Kero 2</td>
                        <td className="py-2">Haina <br/><span className="text-orange-300 font-black">Vs</span> Inodiwa (kero yekwairi kuenda)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-8 mb-8 text-center">Letter Samples</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informal Letter */}
              <div className="rounded-xl bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                <div className="bg-orange-600 dark:bg-orange-800 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
                  <span className="flex items-center gap-2"><UserCheck size={18}/> Shamwari (Informal)</span>
                </div>
                <div className="p-6 md:p-10 flex-1 relative" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
                  <div className="absolute left-10 md:left-14 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                  <div className="pl-12 md:pl-16 text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.25rem", lineHeight: "32px" }}>
                    <div className="text-right">House Number 45,<br/>Highfield, Harare.<br/>20 Mbudzi 2026.</div>
                    <div className="mt-4 font-bold">Dear Simba,</div>
                    <div className="text-justify indent-8">Ndinovimba kuti tsamba ino inokuwana uine mufaro mukuru semwedzi wechirimo. Ndanyorera kukukurudzira kuti udzidze nesimba sezvo bvunzo dzedu dzepakupera kwegore dzoswedera. Wakaona here kuti nguva iri kufamba sekuya?</div>
                    <div className="text-justify indent-8">Kuno kumba vese vari kutaura nezvekuti uchauya rinhi kuzotishanyira pazororo rinouya. Rangarira zviya zvatakaronga maererano nepurojekiti yedu yekurima tomato.</div>
                    <div className="text-justify indent-8">Ndakamirira kunzwa kubva kwauri.</div>
                    <div className="mt-8 text-right">
                      <div className="mb-2">Shamwari yako,</div>
                      <div className="font-bold text-3xl font-signature">Farai.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formal Letter */}
              <div className="rounded-xl bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                <div className="bg-orange-800 dark:bg-orange-950 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
                  <span className="flex items-center gap-2"><Mail size={18}/> Basa (Formal)</span>
                </div>
                <div className="p-6 md:p-10 flex-1 relative">
                  <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Times New Roman', serif", fontSize: "1.1rem", lineHeight: "1.6" }}>
                    <div className="text-right mb-6">7890 Highfield<br/>Harare<br/>20 Chivabvu 2026</div>
                    <div className="mb-6">Mukuru Wechikoro<br/>Highfield 1 High School<br/>Highfield</div>
                    <div className="mb-4">Changamire,</div>
                    <div className="mb-6 font-bold underline uppercase tracking-wide">RE: KUNYUNYUTA PAMUSORO PEMVURA YEKUCHIMBUZI</div>
                    <p className="mb-4 text-justify">Ndini Rudo Matambo weForm 2 Blue. Ndiri kunyora ndichinyunyuta pamusoro pemvura yekuchimbuzi yave nemazuva matatu isingashandi.</p>
                    <p className="mb-4 text-justify">Izvi zviri kukonzera tsvina uye hwema hwakaipa. Vamwe vana vave kutotanga kurwara nemanyoka. Zviri kukanganisa zvidzidzo zvedu.</p>
                    <p className="mb-6 text-justify">Ndinokumbirawo kuti dambudziko iri rigadziriswe nekukurumidza. Hutano hwevadzidzi hwakakosha.</p>
                    <p className="mb-8">Ndinotenda nenguva yenyu.</p>
                    <div className="mt-8 text-right">
                      <div className="mb-4">Wenyu akatendeka,</div>
                      <div style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.8rem", marginBottom: "0.2rem" }} className="text-orange-900 dark:text-orange-300 transform -rotate-3 inline-block">RMatambo</div>
                      <div className="font-bold">Rudo Matambo.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exam':
        return (
          <div className="space-y-12">
            <div className="bg-orange-600/5 dark:bg-orange-500/5 border border-orange-600/10 dark:border-orange-500/10 p-6 md:p-10 rounded-xl">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">📝 Exam Tips - Kupasa Rondedzero &amp; Tsamba</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded-xl p-6 shadow-sm">
                <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2"><Trophy className="text-yellow-500"/> Rondedzero Tips</h4>
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-tight text-sm">USATI WANYORA | PLANNING - 5 mins</h5>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>Verenga misoro yese. Sarudza yaunogona kunyora zvakawandanezvayo.</li>
                      <li>Nyora 4-5 main points pabepa rerafhi. This is your <em>skeleton</em>.</li>
                      <li>Sarudza tsumo 2 dzaunoda kushandisa. Nyora pasi.</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-tight text-sm">PAKUNYORA | WRITING - 30 mins</h5>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li><span className="font-bold">Nhanganyaya inobata:</span> Tanga netsumo/mubvunzo. Ex: "Vana vangu..."</li>
                      <li><span className="font-bold">Ndima = Pfungwa:</span> Usasanganisa pfungwa. Ndima itsva, mutsetse mutsva.</li>
                      <li><span className="font-bold">Shandisa mutauro wepamusoro:</span> (Bad: Akamhanya. Good: Akamhanya semheni.)</li>
                      <li><span className="font-bold">Sanganisa tsumo/madimikira:</span> Minimum 3 murondedzero yese.</li>
                      <li><span className="font-bold">Tense:</span> Past tense kune zvakaitika. Present kune zviripo.</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-tight text-sm">WAPEDZA | EDITING - 5 mins</h5>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>Verenga rondedzero yako yese. Bvisa mazwi akadzokororwa.</li>
                      <li>Tarisa spelling (chikoro not chikolo) uye punctuation.</li>
                      <li>Count words roughly.</li>
                    </ul>
                  </div>
                  <div className="bg-[#ff7400]/10 dark:bg-[#ff7400]/10 p-4 mt-4 rounded-r-xl">
                    <h5 className="font-bold text-red-700 dark:text-red-400 mb-2 text-xs uppercase tracking-widest">Zvinobviswa Marks:</h5>
                    <div className="text-xs text-[#ff7400] dark:text-red-300 grid grid-cols-2 gap-2">
                      <div>-1 Hapana musoro</div>
                      <div>-1 Hapana ndima</div>
                      <div>-2 Girama yakaipa kwazvo</div>
                      <div>-5 Kana wabva pamusoro off topic</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded-xl p-6 shadow-sm">
                  <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2"><Trophy className="text-yellow-500"/> Tsamba Tips</h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    <li className="flex gap-2"><span className="font-mono text-orange-600 font-bold">1</span> <div><span className="font-bold">Kero nezuva zvinosungirwa</span> - ukakanganwa = -2 marks</div></li>
                    <li className="flex gap-2"><span className="font-mono text-orange-600 font-bold">2</span> <div><span className="font-bold">Tsamba yepamutemo:</span> Usamboti "Hi" kana "Ndeipi". Gara uchiti Changamire/Madame.</div></li>
                    <li className="flex gap-2"><span className="font-mono text-orange-600 font-bold">3</span> <div><span className="font-bold">Chikonzero chetsamba RE:</span> - nyora nemavara makuru, pasi pemutsetse.</div></li>
                    <li className="flex gap-2"><span className="font-mono text-orange-600 font-bold">4</span> <div><span className="font-bold">Usanyore zita rako pakero</span> - zita rinoenda pasi pekuti Wenyu akatendeka chete.</div></li>
                    <li className="flex gap-2"><span className="font-mono text-orange-600 font-bold">5</span> <div><span className="font-bold">Mutauro:</span> Tsamba yepamutemo = pinda straight. Tsamba yeushamwari = vhunza ufaro nezvimwe.</div></li>
                  </ul>
                </div>

                <div className="bg-orange-600 dark:bg-orange-900 border border-orange-500/20 text-white rounded-xl p-6 shadow-xl relative overflow-hidden flex-1">
                  <div className="absolute right-0 top-0 opacity-10">
                    <CheckCircle size={150} />
                  </div>
                  <h4 className="font-black text-xl uppercase mb-4 relative z-10">🎯 Quick Revision Checklist</h4>
                  <p className="text-orange-200 text-xs uppercase tracking-widest mb-4">Usati wapinda exam, zvibvunze:</p>
                  <div className="space-y-3 relative z-10 text-sm">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-orange-400 text-orange-900 focus:ring-0 cursor-pointer"/>
                      <span className="group-hover:text-orange-100 transition-colors cursor-pointer">Ndinoziva structure yerondedzero - Nhanganyaya, Mutumbi, Mhedziso?</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-orange-400 text-orange-900 focus:ring-0 cursor-pointer"/>
                      <span className="group-hover:text-orange-100 transition-colors cursor-pointer">Ndine tsumo 5 dzandinogona kushandisa chero murondedzero?</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-orange-400 text-orange-900 focus:ring-0 cursor-pointer"/>
                      <span className="group-hover:text-orange-100 transition-colors cursor-pointer">Ndinoziva kusiyana kwetsamba yepamutemo neyeushamwari?</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-orange-400 text-orange-900 focus:ring-0 cursor-pointer"/>
                      <span className="group-hover:text-orange-100 transition-colors cursor-pointer">Ndinoziva madimikira ekutsanangura giredhi nehunhu hwezvinhu?</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-orange-400 text-orange-900 focus:ring-0 cursor-pointer"/>
                      <span className="group-hover:text-orange-100 transition-colors cursor-pointer">Ndinoziva kuronga ndima - pfungwa imwe pandima imwe?</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 10 Proverbs */}
            <div className="bg-white dark:bg-[#1a1a1a] p-6 md:p-10 border border-gray-200 dark:border-[#404040] rounded-xl shadow-sm relative overflow-hidden">
              <h4 className="font-black text-2xl md:text-3xl text-center uppercase tracking-tight text-orange-600 dark:text-orange-400 mb-10 pb-4 border-b border-gray-100 dark:border-[#333]">Tsumo 10 Dzaunofanira Kubata Nemusoro</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  ["Chara chimwe hachitswanyi inda", "Unity is strength"],
                  ["Kugara nhaka huona dzavamwe", "Learn from others"],
                  ["Rega zvipore", "Let bygones be bygones"],
                  ["Moyo muti unomera paunoda", "Love is unpredictable"],
                  ["Seiko seiko hachienzi", "Stranger does not advise"],
                  ["Kandiro enda kanobva kamwe", "You reap what you sow"],
                  ["Chinono chinengwe bere rakadya richifamba", "Slow but sure"],
                  ["Mhembwe rudzi inozvara mwana ane kazimhumhu", "Like father like son"],
                  ["Atewe nerwomumwe haatori", "Learn from others' mistakes"],
                  ["Kuwanda huuya", "There is safety in numbers"]
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col border-b border-gray-100/50 dark:border-[#333]/50 pb-3 hover:bg-gray-50 dark:hover:bg-[#222] p-2 rounded transition-colors group">
                    <span className="font-black text-gray-900 dark:text-gray-100 text-sm md:text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"><span className="text-gray-400 mr-2">{idx + 1}.</span> {item[0]}</span>
                    <span className="text-[10px] md:text-xs text-orange-600/70 dark:text-orange-400/70 uppercase tracking-widest pl-6 font-bold mt-1">{item[1]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 py-5 px-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-r-xl text-sm font-medium text-gray-800 dark:text-gray-200">
                <span className="font-black uppercase text-yellow-600 dark:text-yellow-500">Last Tip:</span> Practice! Nyora rondedzero imwe svondo rega-rega. Give it to teacher kuti a make. Unopasa ne 20+/25 kana ukatevedza izvi.
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div id="quiz-section" className="space-y-8">
            {!quizStarted ? (
              <div className="p-8 md:p-16 bg-white dark:bg-[#1e1e1e] border-2 border-gray-100 dark:border-[#404040] text-center shadow-2xl rounded-xl">
                <Trophy size={48} className="text-yellow-500 mx-auto mb-6 md:mb-8 md:w-16 md:h-16" />
                <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 leading-tight">Verification Check</h2>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-8 md:mb-10">Module 1 Assessment • 50 Points</p>
                <button 
                  onClick={() => setQuizStarted(true)}
                  className="w-full md:w-auto px-10 md:px-16 py-4 md:py-5 bg-orange-600 dark:bg-orange-500 hover:bg-blue-800 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.4em] transition-all shadow-xl rounded-xl"
                >
                  Begin Exam
                </button>
              </div>
            ) : quizFinished ? (
              <div className="p-8 md:p-16 bg-orange-600 dark:bg-orange-500 text-white text-center shadow-2xl rounded-xl animate-dropdown-reveal">
                <CheckCircle size={48} className="mx-auto mb-6 text-blue-300 md:w-16 md:h-16" />
                <h2 className="text-xl md:text-4xl font-black uppercase tracking-tight mb-2">Module Validation Complete</h2>
                <div className="text-5xl md:text-8xl font-black my-8 md:my-10">{score} / {QUIZ_DATA.length}</div>
                {!user ? (
                  <div className="bg-white/10 p-6 md:p-8 border border-white/20 mb-8 animate-pulse text-left rounded-xl">
                    <p className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><AlertCircle size={14}/> Guest Status</p>
                    <p className="text-xs md:text-sm font-medium leading-relaxed mb-6 opacity-80">You have earned <span className="font-black text-blue-300">{score * 5} Points</span>. Register result to academic profile.</p>
                    <button 
                      onClick={() => (window as any).onLoginRequest?.()}
                      className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-orange-600 dark:text-orange-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-xl rounded-xl"
                    >
                      <LogIn size={16}/> Register Result
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-500/20 p-5 md:p-6 border border-green-500/30 mb-8 font-black text-[10px] md:text-sm uppercase tracking-widest text-green-300 rounded-xl">
                    + {score * 5} Registry Points Added
                  </div>
                )}
                <button 
                  onClick={() => { setQuizStarted(false); setQuizFinished(false); setCurrentQuestion(0); setScore(0); }}
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-widest underline underline-offset-8 opacity-60 hover:opacity-100 transition-opacity"
                >
                  Restart Assessment
                </button>
              </div>
            ) : (
              <div className="p-6 md:p-12 bg-white dark:bg-[#1e1e1e] border-2 md:border-4 border-orange-600 dark:border-orange-500 shadow-2xl rounded-xl animate-dropdown-reveal">
                <div className="flex justify-between items-center mb-8 md:mb-10 border-b border-gray-100 dark:border-[#404040] pb-4 md:pb-6">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Task ID</span>
                    <span className="text-sm md:text-lg font-black text-orange-600 dark:text-orange-400 uppercase">{currentQuestion + 1} / {QUIZ_DATA.length}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Performance</span>
                    <span className="text-sm md:text-lg font-black text-green-600 block">{score * 5} Pts</span>
                  </div>
                </div>

                <h3 className="text-base md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 md:mb-10 leading-snug min-h-[60px] text-left">
                  {QUIZ_DATA[currentQuestion].q}
                </h3>

                <div className="grid gap-2 md:gap-3">
                  {QUIZ_DATA[currentQuestion].o.map((opt, i) => {
                    let btnClass = "w-full p-4 md:p-5 text-left border-2 font-black text-[10px] md:text-sm uppercase tracking-widest transition-all rounded-xl ";
                    if (showFeedback) {
                      if (i === QUIZ_DATA[currentQuestion].a) btnClass += "bg-green-600 border-green-600 text-white shadow-lg";
                      else if (i === selectedOption) btnClass += "bg-red-600 border-red-600 text-white shadow-lg";
                      else btnClass += "border-gray-100 dark:border-[#404040] text-gray-300 opacity-40";
                    } else {
                      btnClass += "border-gray-100 dark:border-[#404040] hover:border-orange-600 dark:border-orange-500 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:bg-orange-500/5";
                    }
                    return (
                      <button 
                        key={i} 
                        onClick={() => handleOptionClick(i)}
                        disabled={showFeedback}
                        className={btnClass}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <button 
                    onClick={handleNext}
                    className="mt-8 md:mt-10 w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl transition-transform hover:scale-[1.02] rounded-xl"
                  >
                    Next Task <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Render ────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm flex items-center gap-2">
            <BookOpen size={14} />
            SHONA FORM 1 • LEARNING OUTCOME 1
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Kunyora Rondedzero neTsamba
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Gwaro rino rinotarisa nezve <span className="text-white font-bold underline decoration-emerald-400">Chidzidzo 1: Unyanzvi hweKunyora Rondedzero neTsamba</span>.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 4 sections</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📝 {QUIZ_DATA.length} quiz questions</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh proverb in sidebar</span>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            {renderContent()}
          </div>
          <Sidebar />
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Rondedzero:</strong> Nhanganyaya → Mutumbi (3-5 ndima) → Mhedziso.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mhando dzerondedzero:</strong> Munhu, Nzvimbo, Chiitiko, Tsanangudzo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tsamba:</strong> Kero + Zuva → Kero yemunhu → Musoro (formal) → Muviri → Kuvhara.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam Tips:</strong> Plan, Write, Edit. Use proverbs and descriptive language.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcome1;
