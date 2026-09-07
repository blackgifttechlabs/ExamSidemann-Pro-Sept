import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Search, X, ChevronUp, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA
// ──────────────────────────────────────────────────────────────────────────────

interface IdeophoneItem {
  num: number;
  shona: string;
  dudziro: string;
  sentence: string;
  english: string;
}

const IDEOPHONES: IdeophoneItem[] = [
  { num: 1, shona: "Bhu (yekurova chinhu chikukutu)", dudziro: "Sound of hitting a hard object.", sentence: "Akamurova netsvimbo ndokuti bhu pamusoro.", english: "He hit him with a stick, making a bhu sound on the head." },
  { num: 2, shona: "Tsvimbo pasi pfocho (yekuisa chinhu pasi zvinyoronyoro)", dudziro: "Placing something down gently.", sentence: "Akatora mukombe ndokuisa pasi pfocho.", english: "He took the cup and placed it down pfocho (gently)." },
  { num: 3, shona: "Piriviri (Yekutsvuka zvakanyanya)", dudziro: "Kutsvuka kwakanyanyisa.", sentence: "Maziso ake akati piriviri nehasha.", english: "His eyes turned bright red with anger." },
  { num: 4, shona: "Mbuu (Yekuchena zvakanyanya)", dudziro: "Kuchena kwakanyanya sezvemvura kana mukaka.", sentence: "Hembe yake yakati mbuu kuchena.", english: "His shirt was snow-white." },
  { num: 5, shona: "Ndoo (Yekusviba zvakanyanya)", dudziro: "Kusviba kwakanyanyisa kwerima kana muti.", sentence: "Mumba maiva makati ndoo nerima.", english: "The room was pitch black." },
  { num: 6, shona: "Dhuu (Yekuputika)", dudziro: "Ruzha rwekuputika kwechinhu.", sentence: "Bhomba rakati dhuu kuputika.", english: "The bomb went off with a loud bang (dhuu)." },
  { num: 7, shona: "Pfacha (Yekusvika)", dudziro: "Kusvika kusingatarisirwi.", sentence: "Baba vakati pfacha vachibva kubasa.", english: "Father arrived home unexpectedly." },
  { num: 8, shona: "Kwiti (Yekutiza)", dudziro: "Kutanga kumhanya nekukurumidza.", sentence: "Tsuro yakati kwiti ichiona imbwa.", english: "The rabbit took off at high speed upon seeing the dog." },
  { num: 9, shona: "Gwada (Yekupfugama)", dudziro: "Kupfugama pasi nemabvi maviri.", sentence: "Mwanasikana akati gwada kukumbira ruregerero.", english: "The girl knelt down to ask for forgiveness." },
  { num: 10, shona: "Tasu (Yekutasva kana kugara zvakanaka)", dudziro: "Kugara pamusoro pechinhu sezvebhiza kana bhasikoro.", sentence: "Mukomana akati tasu pabhiza rake.", english: "The boy sat upright/firmly on his horse." },
  { num: 11, shona: "Ngwerengwere (Ruzha rwesimbi diki)", dudziro: "Kurira kwesimbi diki dzichiroverana.", sentence: "Mari yomuhomwe yakati ngwerengwere.", english: "The coins in the pocket jingled (ngwerengwere)." },
  { num: 12, shona: "Potyo (Yekupinda)", dudziro: "Kupinda mumba kana mumwena nekukurumidza.", sentence: "Mbeva yakati potyo mumwena.", english: "The mouse darted into the hole." },
  { num: 13, shona: "N'ai (Yekubwinya)", dudziro: "Kupenya kwechinhu pamaziso.", sentence: "Dhaimani rakati n'ai kupenya.", english: "The diamond glittered/shone brightly." },
  { num: 14, shona: "Vhuu (Yekufamba kwemhepo kana motokari)", dudziro: "Kufamba nekukurumidza kunoita ruzha rwemhepo.", sentence: "Motokari yakati vhuu kupfuura.", english: "The car zoomed past." },
  { num: 15, shona: "Kanda (Yekuvhara maziso)", dudziro: "Kuvhara maziso zvakasimba.", sentence: "Akati maziso kanda nehope.", english: "He closed his eyes tightly due to sleepiness." },
  { num: 16, shona: "Pfe (Yekupinda)", dudziro: "Kupinza chinhu mune chimwe (sepoto kana homwe).", sentence: "Akati ruoko pfe muhomwe.", english: "He slid his hand into his pocket." },
  { num: 17, shona: "Dyere (Yekuzara kwemvura)", dudziro: "Kuzara kwemudziyo nemvura kusvika pamuromo.", sentence: "Chirongo chakati dyere nemvura.", english: "The clay pot was full to the brim with water." },
  { num: 18, shona: "Tsvu (Yekutora)", dudziro: "Kutora chinhu nekukurumidza.", sentence: "Gondo rakati huku tsvu.", english: "The eagle snatched the chicken." },
  { num: 19, shona: "Ngwee (Yekuchena/Kuedza kwekunze)", dudziro: "Kuedza kwekunze zvakajeka.", sentence: "Kunze kwakati ngwee kuedza.", english: "It was broad daylight/The sun shone brightly." },
  { num: 20, shona: "Gaga (Yekuseka)", dudziro: "Kuseka zvinonzwika.", sentence: "Sekuru vakati gaga kuseka.", english: "Grandfather burst out laughing." },
  { num: 21, shona: "Maku (Yekunyarara)", dudziro: "Kunyarara zvachose vanhu vakawanda vari mumba.", sentence: "Mumba makati maku kufanana nemuchitunha.", english: "The room became deathly silent." },
  { num: 22, shona: "Di (Yekudonhera pasi)", dudziro: "Kudonha kwechinhu chiremerera pasi.", sentence: "Danda rakati di pasi.", english: "The log fell to the ground with a thud." },
  { num: 23, shona: "Zii (Yekunyarara)", dudziro: "Kunyarara kwemunhu mumwe chete kana nzvimbo.", sentence: "Mwana akati zii kunyarara.", english: "The child became very quiet." },
  { num: 24, shona: "Svu (Yekunwa)", dudziro: "Kunwa mvura zvishoma (sip).", sentence: "Akati tii svu.", english: "He took a sip of tea." },
  { num: 25, shona: "Kwakari (Yekusvetuka)", dudziro: "Kusvetuka uchibva pane imwe nzvimbo uchienda pane imwe.", sentence: "Datya rakati kwakari.", english: "The frog leaped." },
  { num: 26, shona: "Byu (Yekupedza mvura)", dudziro: "Kunwa mvura yose yakadhirika.", sentence: "Akati mvura byu kunwa yose.", english: "He gulped down all the water." },
  { num: 27, shona: "Tore (Yekunhuwa)", dudziro: "Kunhuwa zvakaipa.", sentence: "Nyama yakaora inoti tore kunhuwa.", english: "Rotten meat has a pungent, bad smell." },
  { num: 28, shona: "Dzve (Yekubata)", dudziro: "Kubata chinhu chiri kutiza kana chiri kure.", sentence: "Akati mbavha dzve nepaguvhu.", english: "He grabbed the thief firmly." },
  { num: 29, shona: "Dhabhu (Yekufamba kwemunhu akafuta)", dudziro: "Kufamba zvishoma nezvishoma zvine uremu.", sentence: "Zonzi rakati dhabhu dhabhu kufamba.", english: "The heavy person walked with heavy, slow steps." },
  { num: 30, shona: "Bvubvu (Yekubuda kwemvura/ropa)", dudziro: "Kubuda kwechinhu chine mvura zvakanyanya.", sentence: "Ropa rakati bvubvu pachironda.", english: "Blood gushed out from the wound." },
  { num: 31, shona: "N'ono (Yekunhuwirira)", dudziro: "Kunhuwirira zvakanaka (sezvekudya).", sentence: "Sadza nenyama zvakati n'ono kunhuwirira.", english: "The food smelled delicious." },
  { num: 32, shona: "Bwa (Yekupwanyika)", dudziro: "Kupwanywa kwechinhu chakadai sezai.", sentence: "Zai rakati bwa pasi.", english: "The egg cracked/smashed on the floor." },
  { num: 33, shona: "Tsvoti (Yekusvipa)", dudziro: "Kusvipa mate kana mvura mumuromo.", sentence: "Akati mate tsvoti.", english: "He spat out saliva." },
  { num: 34, shona: "Guchu (Yekumwa mvura yakawanda)", dudziro: "Kunwa mvura ichiita ruzha muhuro.", sentence: "Akati mvura guchu guchu.", english: "He gulped down the water (making a sound)." },
  { num: 35, shona: "Peperere (Yekubhururuka/Mhepo)", dudziro: "Kupepereswa ne mhepo.", sentence: "Bepa rakati peperere nemhepo.", english: "The paper fluttered away in the wind." },
  { num: 36, shona: "Tsvoo (Yekudeurwa kwechinhu chine jecha kana mbeu)", dudziro: "Kudira zvinhu zvakaoma zvakawanda kamwechete.", sentence: "Akati chibage tsvoo mudura.", english: "He poured the maize into the granary." },
  { num: 37, shona: "Rurururu (Yekubvira kwemoto)", dudziro: "Moto uri kubvira zvakasimba.", sentence: "Moto wakatii rurururu kubvira.", english: "The fire blazed intensely." },
  { num: 38, shona: "Mwi (Yekunyarara)", dudziro: "Kunyarara mushure mekuita ruzha.", sentence: "Vana vakati mwi mudzidzisi paakapinda.", english: "The children fell silent when the teacher entered." },
  { num: 39, shona: "Toti (Yekudonhedza madonhwe)", dudziro: "Kudonha kwechinhu chine muto zvishoma nezvishoma.", sentence: "Dhongi rakati toti toti madonhwe eropa.", english: "The donkey left small drops of blood." },
  { num: 40, shona: "Shutu (Yekuzara mumuromo)", dudziro: "Kuzadza muromo nezvinhu (sezvekudya kana mvura).", sentence: "Akati matama shutu nenzungu.", english: "He stuffed his mouth with peanuts." },
  { num: 41, shona: "Vhu (Yekumuka)", dudziro: "Kumuka nekukurumidza.", sentence: "Akati vhu mumubhedha.", english: "He sprang out of bed." },
  { num: 42, shona: "Ngweru (Yekuedza kwayo)", dudziro: "Kuchena kwekuedza kwekunze (Dawn).", sentence: "Kunze kwakati ngweru kuedza.", english: "The day dawned brightly." },
  { num: 43, shona: "Dyu (Yekuboorwa)", dudziro: "Kubaya chinhu nechimwe chakapinza.", sentence: "Akati gumbeze dyu netsono.", english: "He pierced the blanket with a needle." },
  { num: 44, shona: "Kwi (Yekusunga)", dudziro: "Kusunga tambo zvakasimba.", sentence: "Akasunga mbudzi kwi.", english: "He tied the goat tightly." },
  { num: 45, shona: "Go (Yekugara pasi)", dudziro: "Kugara pasi pasina tsvina kana kungogara.", sentence: "Akati go pacheya.", english: "He sat down on the chair." },
  { num: 46, shona: "Tandari (Yekutambanudza makumbo)", dudziro: "Kugara wakasungunuka makumbo akatambanudzwa.", sentence: "Sekuru vakati tandari pamukova.", english: "Grandfather sat with his legs stretched out at the door." },
  { num: 47, shona: "Dzunyu (Yekutanha)", dudziro: "Kutanhura chinhu pamuti.", sentence: "Akati jaya dzunyu mumuti.", english: "He plucked the fruit from the tree." },
  { num: 48, shona: "Ruvhi (Yekurova nemvura)", dudziro: "Kunyiwa nemvura (kunyanya kunaya).", sentence: "Takanzi ruvhi nemvura tichibva kusimba.", english: "We were drenched by the rain coming from the fields." },
  { num: 49, shona: "Mvve (Yekukanda chinhu)", dudziro: "Kukanda chinhu chinofamba nemhepo.", sentence: "Akati tsvimbo mvve.", english: "He threw the stick through the air." },
  { num: 50, shona: "Didi (Yekumwa mvura/doro)", dudziro: "Kunwa zvinhu zvinoyerera pasina kuzorora.", sentence: "Akati doro didi.", english: "He gulped down the beer." },
  { num: 51, shona: "Che (Yekucheka)", dudziro: "Kucheka chinhu nebanga.", sentence: "Akati nyama che.", english: "He sliced the meat." },
  { num: 52, shona: "Tsvatstva (Yekufamba kwezvinokambaira)", dudziro: "Kufamba kwechinhu chakadai seshato kana hove.", sentence: "Nyoka yakati tsvatstva musora.", english: "The snake slithered through the grass." },
  { num: 53, shona: "Bvubvu (Yekuzunza)", dudziro: "Kuzunza chinhu chine mvura.", sentence: "Imbwa yakati bvubvu kuzunza mvura.", english: "The dog shook itself to get rid of water." },
  { num: 54, shona: "Gadu (Yekutema)", dudziro: "Kutema chinhu chakadai sedanda nembezo/demo.", sentence: "Akati danda gadu nedemo.", english: "He struck the log with an axe." },
  { num: 55, shona: "N'andu (Yekuruma)", dudziro: "Kuruma zvishoma kana kuti kurumira.", sentence: "Imbwa yakati gumbo n'andu.", english: "The dog nipped/bit the leg." },
  { num: 56, shona: "Pata pata (Ruzha rwemadonhwe)", dudziro: "Kurira kwemvura inonaya pamatezha.", sentence: "Mvura yakati pata pata padenga.", english: "The rain pattered on the roof." },
  { num: 57, shona: "Svuu (Yekusvuura)", dudziro: "Kubvisa ganda remuti kana remunhu.", sentence: "Akati ganda svuu.", english: "He peeled off the skin." },
  { num: 58, shona: "Tingini (Yekuve mutete)", dudziro: "Kuva nechiuno chidiki-diki.", sentence: "Musikana uya akati tingini muchiuno.", english: "That girl has a very slender waist." },
  { num: 59, shona: "Vata (Yekurara)", dudziro: "Kurara kwehope dzinonaka.", sentence: "Mwana akati vata hope.", english: "The child fell fast asleep." },
  { num: 60, shona: "Bha (Yekubata ramba)", dudziro: "Kupenya kwezuva zvakasimba.", sentence: "Zuva rakati bha.", english: "The sun shone brightly." },
  { num: 61, shona: "Kanhau (Yekudya zvinhu zvakaoma)", dudziro: "Kutsenga chinhu chinopwanyika mukanwa (sezvemaputi).", sentence: "Akati maputi kanhau.", english: "He crunched the popcorn." },
  { num: 62, shona: "Dzungetu (Yekudzungudza musoro)", dudziro: "Kuzunza musoro kuratidza kuramba.", sentence: "Akati musoro dzungetu.", english: "He shook his head (in disapproval)." },
  { num: 63, shona: "Kwenyu (Yekukwenya)", dudziro: "Kukwenya muviri pane ruzave kana pakunhuwa.", sentence: "Akati musana kwenyu.", english: "He scratched his back." },
  { num: 64, shona: "Tsvu (Yekutsvoda)", dudziro: "Kutsvoda munhu.", sentence: "Amai vakati mwana tsvu padama.", english: "Mother kissed the child on the cheek." },
  { num: 65, shona: "Gwengwendere (Yekudonha kwesimbi/mapoto)", dudziro: "Ruzha rwemapoto anodonha.", sentence: "Mapoto akati gwengwendere pasi.", english: "The pots fell with a clanging sound." },
  { num: 66, shona: "Ganyai (Yekufamba kwekuzvidada)", dudziro: "Kufamba uchizvitutumadza.", sentence: "Murume uya anoti ganyai kufamba.", english: "That man walks proudly/struts." },
  { num: 67, shona: "Hata hata (Yekumhanya kwembudzi/mhuka)", dudziro: "Kufamba nemhanya kwezvinhu zvina makumbo mana.", sentence: "Mbudzi dzakati hata hata kumhanya.", english: "The goats galloped away." },
  { num: 68, shona: "Kachikachi (Yekudzipwa)", dudziro: "Kudzipwa nechimwe chinhu mukanwa.", sentence: "Akati kachikachi nemapfupa.", english: "He choked on the bones." },
  { num: 69, shona: "Pfocho (Yekubuda)", dudziro: "Kubuda mune chimwe chinhu (semuropa kana mbeva).", sentence: "Mbeva yakati pfocho nepamukova.", english: "The mouse darted out through the door." },
  { num: 70, shona: "Toro (Yekureba)", dudziro: "Kuva murefu zvakanyanya.", sentence: "Mukomana uyu akati toro kureba.", english: "This boy is exceptionally tall." },
  { num: 71, shona: "Gadzidzi (Yekumira)", dudziro: "Kumira zvakasimba.", sentence: "Akati gadzidzi pakati penzira.", english: "He stood firmly in the middle of the road." },
  { num: 72, shona: "Byu (Yekuburura mweya)", dudziro: "Kubudisa mweya mukanwa (belching).", sentence: "Akati byu aguta.", english: "He belched after being full." },
  { num: 73, shona: "Kwakacha (Yekupwanyika kwemapazi)", dudziro: "Ruzha rwemapazi akaoma anotsika.", sentence: "Sango rakati kwakacha tichifamba.", english: "The dry branches crackled as we walked." },
  { num: 74, shona: "Tsvatstvatstva (Yekunaya zvishoma)", dudziro: "Kunaya kwemvura isina simba (Drizzling).", sentence: "Mvura iri kungoti tsvatstvatstva.", english: "It is just drizzling." },
  { num: 75, shona: "Dzaku (Yekusimudza chinhu chirema)", dudziro: "Kusimudza chinhu chakaoma kusimudza.", sentence: "Akati sago dzaku.", english: "He lifted the heavy sack." },
  { num: 76, shona: "Rova (Yekutsakatika)", dudziro: "Kunyangarika kwechinhu.", sentence: "Mbavha yakati rova.", english: "The thief vanished." },
  { num: 77, shona: "Gidi (Yekurova nemusi/chibhakera)", dudziro: "Kurova chinhu chinoburitsa ruzha rwakadzvinyirirwa.", sentence: "Akamurova gidi pamusana.", english: "He hit him with a dull thud on the back." },
  { num: 78, shona: "Pete (Yekupeta)", dudziro: "Kupeta chinhu (sehembe kana gumbeze).", sentence: "Akati gumbeze pete.", english: "He folded the blanket." },
  { num: 79, shona: "Chau chau (Yekucheka-cheka)", dudziro: "Kucheka-cheka muriwo kana nyama kuita zvidimbu.", sentence: "Akati muriwo chau chau.", english: "She chopped the vegetables." },
  { num: 80, shona: "Kwanyau (Yekutyora)", dudziro: "Kutyora chinhu chinyoro (semuriwo).", sentence: "Akati muriwo kwanyau.", english: "She snapped the green vegetable stalks." },
  { num: 81, shona: "Dumbunya (Yekumera)", dudziro: "Kutanga kumera kwechirimwa.", sentence: "Mbeu dzakati dumbunya.", english: "The seeds began to sprout." },
  { num: 82, shona: "N'andu (Yekugura)", dudziro: "Kugura chinhu netambo kana nemeno.", sentence: "Mbeva yakati tambo n'andu.", english: "The mouse gnawed through the rope." },
  { num: 83, shona: "Gwedee (Yekuzungunusa)", dudziro: "Kuzungunusa chinhu chisina kusimba.", sentence: "Zino riri kuti gwedee.", english: "The tooth is loose/wobbling." },
  { num: 84, shona: "Pfu (Yekunhuwa)", dudziro: "Kunhuwa kwechinhu chakaora.", sentence: "Dhongi rakaora rinoti pfu.", english: "The rotten donkey smells awful." },
  { num: 85, shona: "Nye (Yekunyora)", dudziro: "Kunyora zvakachena kana zvakanaka.", sentence: "Akati mubhuku nye.", english: "He wrote neatly in the book." },
  { num: 86, shona: "Rovve (Yekunyika mumvura)", dudziro: "Kunykia chinhu mumvura chichibva chati dhu.", sentence: "Akati jira rovve mumvura.", english: "He dipped the cloth into the water." },
  { num: 87, shona: "Bvu (Yekubvuta)", dudziro: "Kubvuta chinhu chiri mumaoko emumwe.", sentence: "Akati bhuku bvu.", english: "He snatched the book." },
  { num: 88, shona: "Tende (Yekugara pasi)", dudziro: "Kugara pasi zvakasununguka.", sentence: "Vana vakati tende pasi.", english: "The children sat down comfortably on the ground." },
  { num: 89, shona: "Dzveere (Yekuchema kwemwana)", dudziro: "Kuchema kwenguva refu kwecheche.", sentence: "Mwana akati dzveere kuchema.", english: "The baby wailed for a long time." },
  { num: 90, shona: "Gutu (Yekufukidza)", dudziro: "Kufukidza chinhu chose.", sentence: "Akati mwana gutu negumbeze.", english: "She covered the child completely with a blanket." },
  { num: 91, shona: "Bvuu (Yekubvundura mvura)", dudziro: "Kubvundura mvura yakachena ichiita tsvina.", sentence: "Mombe yakati mvura bvuu.", english: "The cow muddied the water." },
  { num: 92, shona: "Kachikachi (Yekukurumidza kudya)", dudziro: "Kudya nekukurumidza zvakanyanya.", sentence: "Akati kudya kachikachi.", english: "He ate his food very hurriedly." },
  { num: 93, shona: "Tsvitu (Yekukanda chinhu diki)", dudziro: "Kukanda chinhu chidiki kure.", sentence: "Akati dombo tsvitu.", english: "He tossed the small stone away." },
  { num: 94, shona: "Dzedzeere (Yekuzungunuka kwesimbi)", dudziro: "Ruzha rweplate inodonha ichizungunuka.", sentence: "Pureti yakati dzedzeere pasi.", english: "The plate wobbled and clattered on the floor." },
  { num: 95, shona: "Pfupfu (Yekupfupfudza)", dudziro: "Kumwaya chinhu chakaita seupfu.", sentence: "Akati munyu pfupfu munyama.", english: "He sprinkled salt on the meat." },
  { num: 96, shona: "Mvee (Yekufamba kweshamhu/tsvimbo)", dudziro: "Ruzha rwetsvimbo ichirova mhepo.", sentence: "Shamhu yakati mvee.", english: "The switch/whip whizzed through the air." },
  { num: 97, shona: "Gwa (Yekuvhara)", dudziro: "Kuvhara gonhi zvakasimba.", sentence: "Akati gonhi gwa.", english: "He shut the door firmly." },
  { num: 98, shona: "Shutuu (Yekutsamwa)", dudziro: "Kufundumwara chiso nekuda kwehasha.", sentence: "Akati kumeso shutuu.", english: "He looked sullen/angry." },
  { num: 99, shona: "Dzve (Yekudzvanya)", dudziro: "Kudzvanya chinhu mumaoko.", sentence: "Akati ramba dzve.", english: "He squeezed the beetle." },
  { num: 100, shona: "Didi (Yekutevera)", dudziro: "Kutevera munhu shure-shure pasina kumusiya.", sentence: "Imbwa yakati tenzi didi.", english: "The dog followed its master closely." },
  { num: 101, shona: "Svutu (Yekusvuta fodya kana kunwa muto)", dudziro: "Kukweva mhepo kana muto mumuromo.", sentence: "Akati fodya svutu.", english: "He took a puff of the cigarette/He sipped the soup." },
  { num: 102, shona: "Piku (Yekunhonga)", dudziro: "Kunhonga chinhu pasi nekukurumidza.", sentence: "Akati penzura piku.", english: "He picked up the pencil quickly." }
];

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const IdeophoneCard = memo(({ item, isHighlighted }: { item: IdeophoneItem; isHighlighted: boolean }) => {
  return (
    <div
      id={`ideophone-${item.num}`}
      className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
        isHighlighted
          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 ring-2 ring-cyan-500/50 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-cyan-300 dark:hover:border-cyan-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Number badge */}
        <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              isHighlighted
                ? 'bg-cyan-600 text-white'
                : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
            }`}
          >
            {item.num}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3
            className={`text-lg md:text-xl font-bold leading-snug ${
              isHighlighted
                ? 'text-cyan-900 dark:text-cyan-100'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {item.shona}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left column: Dudziro + Muenzaniso */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 block mb-1 tracking-wider">
                  Dudziro
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {item.dudziro}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1 tracking-wider">
                  Muenzaniso
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{item.sentence}"
                </p>
              </div>
            </div>

            {/* Right column: English explanation */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1 tracking-wider">
                English
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.english}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const Ideophones: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [randomItem, setRandomItem] = useState<IdeophoneItem | null>(null);

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

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }

    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = IDEOPHONES.find(
        item =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.dudziro.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.num);
        setTimeout(() => {
          const element = document.getElementById(`ideophone-${match.num}`);
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
    const random = IDEOPHONES[Math.floor(Math.random() * IDEOPHONES.length)];
    setRandomItem(random);
  }, []);

  const refreshRandom = () => {
    const random = IDEOPHONES[Math.floor(Math.random() * IDEOPHONES.length)];
    setRandomItem(random);
  };

  // ─── Sticky Navigation (single tab) ─────────────────────────────────────
  const NavTab = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          className="rounded-full px-4 py-1.5 text-xs font-semibold bg-cyan-600 text-white shadow-md shadow-cyan-200 dark:shadow-cyan-900/30"
        >
          Nyaudzosingwi Dzose ({IDEOPHONES.length})
        </button>
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
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm flex items-center gap-2">
            <ShieldCheck size={14} />
            ZVIDAVADO NEMADUDZIRWO AZVO
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Nyaudzosingwi
          </h1>
          <p className="text-lg text-cyan-100 max-w-2xl leading-relaxed">
            Zvidavado mazwi anotsanangura chiito, mamiriro, kana hunhu nenzira inopa mufananidzo mupfungwa. Zvinopa simba uye ruvara kumutauro.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-cyan-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {IDEOPHONES.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random ideophone</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-cyan-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for an ideophone or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-cyan-200/70 font-medium"
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
                  <X size={18} className="text-cyan-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTab />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of Ideophones */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Nyaudzosingwi Dzose
              </span>
              <span>{IDEOPHONES.length} shown</span>
            </div>

            {IDEOPHONES.map((item) => (
              <IdeophoneCard
                key={item.num}
                item={item}
                isHighlighted={item.num === highlightedId}
              />
            ))}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Ideophone Card */}
            <div className="rounded-2xl border border-cyan-100 dark:border-cyan-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">✨ Random Ideophone</h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-cyan-500 dark:text-cyan-400" />
                </button>
              </div>
              {randomItem && (
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {randomItem.shona}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {randomItem.dudziro}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {randomItem.english}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    “{randomItem.sentence}”
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Nyaudzosingwi Dzose</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {IDEOPHONES.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Shona entries</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {IDEOPHONES.length}
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
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Did you know?</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Ideophones are a distinctive feature of many African languages, including Shona. They vividly convey sensory experiences and are often used in storytelling, poetry, and daily conversation.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-cyan-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-cyan-300 font-bold">•</span>
              <span>
                <strong className="text-white">Ideophones:</strong> Words that vividly describe actions, sounds, or states.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dudziro:</strong> Explanation in Shona to clarify the meaning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences showing real‑life usage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-300 font-bold">•</span>
              <span>
                <strong className="text-white">English:</strong> Translation for broader understanding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-300 font-bold">•</span>
              <span>Use the search bar to find a specific ideophone or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ideophones;