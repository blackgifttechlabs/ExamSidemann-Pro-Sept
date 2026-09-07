import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Search, X, ChevronUp, RefreshCw, ShieldCheck, Sparkles, List } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA
// ──────────────────────────────────────────────────────────────────────────────

interface Entry {
  num: number;
  shona: string;
  dudziro: string;
  sentence: string;
  english: string;
}

const SIMILES: Entry[] = [
  { num: 1, shona: "Kuchena kunge mukaka.", dudziro: "Kuva wakachena kwazvo.", sentence: "Mazino ake akachena kunge mukaka.", english: "To be as white as milk." },
  { num: 2, shona: "Kutsvuka kunge moto.", dudziro: "Kuva wakatsvuka zvakanyanya.", sentence: "Deme rake rakanga rakatsvuka kunge moto.", english: "To be as red as fire." },
  { num: 3, shona: "Kutsvedza kunge hove", dudziro: "Kutadza kubatika kana kuva nehunyengeri.", sentence: "Mbavha iya yakati tsvu kutsvedza kunge hove mumaoko amapurisa.", english: "To be as slippery as a fish (hard to catch)." },
  { num: 4, shona: "Kunonoka kunge kamba", dudziro: "Kuita zvinhu zvishoma nezvishoma zvakanyanya.", sentence: "Fambisa gumbo, urikutinonokera kunge kamba.", english: "To be as slow as a tortoise." },
  { num: 5, shona: "Kureba kunge mupaini", dudziro: "Munhu murefu zvakanyanya.", sentence: "Mukomana uya akakura akati toro kureba kunge mupaini.", english: "To be as tall as a pine tree." },
  { num: 6, shona: "Kusviba kunge rasha", dudziro: "Kuva neruvara rutema kwazvo.", sentence: "Hari iya yaiva yakasviba kunge rasha nekuda kwechitadzo.", english: "To be as black as coal." },
  { num: 7, shona: "Kutya kunge mbeva", dudziro: "Kuva munhu asina chivindi.", sentence: "John haadi kurwa, anotya kunge mbeva.", english: "To be as fearful as a mouse." },
  { num: 8, shona: "Kupinza kunge banga", dudziro: "Kuva nehungwaru kana mazwi anobaya.", sentence: "Pfungwa dzemwana uyu dzakapinza kunge banga.", english: "To be as sharp as a knife." },
  { num: 9, shona: "Kutizira kunge tsuro", dudziro: "Kumhanya zvakanyanya pakutiza njodzi.", sentence: "Mwana akati kwiti kutizira kunge tsuro paakaona mbavha.", english: "To flee as fast as a rabbit." },
  { num: 10, shona: "Kurema kunge dombo", dudziro: "Chinhu chisingagoni kusimudzirika zviri nyore.", sentence: "Saga rechibage riya rakange rakarema kunge dombo.", english: "To be as heavy as a stone." },
  { num: 11, shona: "Kunhuwa kunge chitunha", dudziro: "Kunhuwa zvakaipisisa.", sentence: "Nyama yakaora iya yainhuwa kunge chitunha.", english: "To stink like a corpse." },
  { num: 12, shona: "Kureruka kunge munhenga", dudziro: "Chinhu chisina uremu zvachose.", sentence: "Saga risina chiro rinoreruka kunge munhenga.", english: "To be as light as a feather." },
  { num: 13, shona: "Kutapira kunge uchi", dudziro: "Kuva nehunhu hwakanaka kana kudya kunonaka.", sentence: "Mashoko ambuya anozorodza, anotapira kunge uchi.", english: "To be as sweet as honey." },
  { num: 14, shona: "Kuvava kunge mhiripiri", dudziro: "Kutaura nehasha kana nehasha dzakaipisisa.", sentence: "Mashoko aJohn anovava kunge mhiripiri.", english: "To be as bitter/hot as chili." },
  { num: 15, shona: "Kushata kunge n'un'u", dudziro: "Kuva nechiso kana hunhu husina kunaka zvachose.", sentence: "Munhu uya ane mwoyo wakashata kunge n'un'u.", english: "To be as ugly/bad as a gnu (or a proverbially ugly creature)." },
  { num: 16, shona: "Kuchena kunge mwedzi", dudziro: "Kuva nemufaro kana kutaridzika zvakanaka.", sentence: "Chiso chake chakange chakachena kunge mwedzi.", english: "To be as bright/clear as the moon." },
  { num: 17, shona: "Kufuta kunge nguruve", dudziro: "Kuva munhu akasimba kana akafuta zvakanyanya.", sentence: "Kubva paakawana basa, akasara ave kufuta kunge nguruve.", english: "To be as fat as a pig." },
  { num: 18, shona: "Kunyarara kunge muchitunha", dudziro: "Kunyarara zvakanyanya pasina ruzha.", sentence: "Mudenga mumba makange makati zii, kunyarara kunge muchitunha.", english: "To be as silent as a grave/corpse." },
  { num: 19, shona: "Kupenya kunge zuva", dudziro: "Kuve nemukurumbira kana kubwinya.", sentence: "Basa rake rinopenya kunge zuva.", english: "To shine like the sun." },
  { num: 20, shona: "Kusimba kunge simbi", dudziro: "Kuva nesimba risingazununguki.", sentence: "Sekuru vachiri kusimba kunge simbi nanhasi.", english: "To be as strong as iron." },
  { num: 21, shona: "Kufamba sezongororo", dudziro: "Kufamba zvishoma zvine unyope.", sentence: "Rega kufamba sezongororo tiri kumhanyira bhazi.", english: "To walk (slowly) like a millipede." },
  { num: 22, shona: "Kudada kunge jongwe", dudziro: "Kuzvikudza pamberi pevamwe.", sentence: "Mukomana uya anozvida, anodada kunge jongwe.", english: "To be as proud as a rooster." },
  { num: 23, shona: "Kuzvitutumadza semuzavazi", dudziro: "Kuzvidutumadza pasina chikonzero.", sentence: "Rega kuzvitutumadza semuzavazi iwe usina chaunoziva.", english: "To be pompous (like a certain bird)." },
  { num: 24, shona: "Kuseka kunge hwenze", dudziro: "Kuseka nenzira ine ruzha rusingafadzi.", sentence: "Vakadzi vaye vanoseka kunge hwenze.", english: "To laugh like a hyena." },
  { num: 25, shona: "Kuoma kunge n'oto", dudziro: "Kuoma kwechinhu zvakanyanya (semushonga kana huni).", sentence: "Sadza ranhasi raoma kunge n'oto.", english: "To be as hard/dry as a pebble/seed." },
  { num: 26, shona: "Kupfava kunge donje", dudziro: "Kuva nehunhu munyoro kana chigadzirwa chakapfava.", sentence: "Mwoyo wamai vangu wakapfava kunge donje.", english: "To be as soft as cotton." },
  { num: 27, shona: "Kutsamwa kunge shumba", dudziro: "Kuva nehasha dzinotyisa.", sentence: "Baba vakamutsa hasha, vakatsamwa kunge shumba.", english: "To be as angry as a lion." },
  { num: 28, shona: "Kupinda kunge mbeva muna amai vayo", dudziro: "Pinda mumba nekukurumidza nekuda kwekutya.", sentence: "Mwana akati potyo pinda mumba kunge mbeva muna amai vayo.", english: "To dart in like a mouse into its mother (hole)." },
  { num: 29, shona: "Kunaka kunge ngirozi", dudziro: "Kuva nechitarisiko kana hunhu hwakanaka kwazvo.", sentence: "Muroora wenyu akanaka kunge ngirozi.", english: "To be as beautiful/good as an angel." },
  { num: 30, shona: "Kuonda kunge rutsva", dudziro: "Kuonda zvakanyanya zvisingaiti.", sentence: "Hurwere hwakamupedza, akasara ave kuonda kunge rutsva.", english: "To be as thin as a burnt stick/straw." },
  { num: 31, shona: "Kurarama kunge hove mumvura", dudziro: "Kuva munhu akasununguka munzvimbo yake.", sentence: "Kana ari kumunda, anorarama kunge hove mumvura.", english: "To live like a fish in water (be in one's element)." },
  { num: 32, shona: "Kufamba kunge mbavha", dudziro: "Kufamba nenzira yekuhwanda.", sentence: "Mukomana uyu anofamba kunge mbavha usiku.", english: "To walk (stealthily) like a thief." },
  { num: 33, shona: "Kudya kunge gora", dudziro: "Kudya nenzira yekukara.", sentence: "Mwana uyu anodya kunge gora.", english: "To eat like a vulture." },
  { num: 34, shona: "Kurwadziwa kunge nyoka yatemwa musoro", dudziro: "Kuva nekurwadziwa kukuru kunoita kuti munhu azununguke.", sentence: "Akange achirwadziwa kunge nyoka yatemwa musoro.", english: "To be in writhing pain like a snake hit on the head." },
  { num: 35, shona: "Kumira kunge muti", dudziro: "Kumira wakamirira pasina kurova pasi.", sentence: "Akati gadzidzi kumira kunge muti.", english: "To stand still like a tree." },
  { num: 36, shona: "Kutenda kunge mwana", dudziro: "Kuva nemwoyo unotenda pasina kunyengera.", sentence: "Vadzidzi vake vanomutenda kunge mwana.", english: "To believe/thank as innocently as a child." },
  { num: 37, shona: "Kupfuura kunge mhepo", dudziro: "Kufamba nekukurumidza kusingaiti.", sentence: "Motokari iya yakapfuura kunge mhepo.", english: "To pass by like the wind." },
  { num: 38, shona: "Kunwa kunge chipfuko", dudziro: "Kunwa mvura kana doro rakawanda.", sentence: "Baba vanonwa kunge chipfuko.", english: "To drink like a bottomless vessel." },
  { num: 39, shona: "Kukambaira kunge mucheche", dudziro: "Kunonoka kuita zvinhu kana kutadza kusimuka.", sentence: "Musoro uyu unokambaira kunge mucheche pakupasa.", english: "To crawl like a baby (progress slowly)." },
  { num: 40, shona: "Kuridza mhere sezizi", dudziro: "Kuita ruzha rusingadiwi nevanhu usiku.", sentence: "Rega kuridza mhere sezizi tiri kuda kurara.", english: "To hoot/shout like an owl." },
  { num: 41, shona: "Kupfura kunge mheni", dudziro: "Kumhanya kana kurova nekukasira kwazvo.", sentence: "Pfumo rake rakapfura kunge mheni.", english: "To strike or move as fast as lightning." },
  { num: 42, shona: "Kutsinzina kunge bofu", dudziro: "Kunyepedzera kusaziva zviri kuitika.", sentence: "Akaramba akatsinzina kunge bofu nyaya ichitaurwa.", english: "To close one's eyes like a blind person (ignore reality)." },
  { num: 43, shona: "Kuchema kunge chirikadzi", dudziro: "Kuchema kwenguva refu zvakanyanya.", sentence: "Mwana akachema kunge chirikadzi amai pavakaenda.", english: "To wail like a widow." },
  { num: 44, shona: "Kuve negotsi kunge mhandu", dudziro: "Kusada kubatsira kana kuvenga vamwe.", sentence: "Munhu uyu ane gotsi kunge mhandu.", english: "To turn one's back like an enemy." },
  { num: 45, shona: "Kusvetuka kunge datya", dudziro: "Kufara zvekutadza kugara pasi.", sentence: "Akasvetuka kunge datya paakanzwa mashoko akanaka.", english: "To hop like a frog (with joy)." },
  { num: 46, shona: "Kupisa kunge choto", dudziro: "Kuva nekpisa kwakanyanya muviri kana kunze.", sentence: "Mwana ane fivha, akange akapisa kunge choto.", english: "To be as hot as a fireplace." },
  { num: 47, shona: "Kutonhora kunge mazaya emvura", dudziro: "Kunze kune chando chikuru kana munhu asina mwoyo.", sentence: "Mvura ranhasi inotonhora kunge mazaya emvura.", english: "To be as cold as ice." },
  { num: 48, shona: "Kusindimara kunge mhongora", dudziro: "Kusada kuteerera mazano.", sentence: "Mwana uyu akasindimara kunge mhongora.", english: "To be as stubborn as a barren cow." },
  { num: 49, shona: "Kunhuhwirira kunge ruva", dudziro: "Kuva nekunhuwirira kwakanaka kwazvo.", sentence: "Mumba menyu munonhuhwirira kunge ruva.", english: "To smell as sweet as a flower." },
  { num: 50, shona: "Kutaura kunge tsine", dudziro: "Kutaura mazwi anorwadza kana anobaya.", sentence: "Mashoko ake anobaya kunge tsine.", english: "To speak words that prick like a grass seed." },
  { num: 51, shona: "Kushanda kunge n'un'uziri", dudziro: "Kushanda nesimba kwazvo.", sentence: "Mbuya vanoshanda kunge n'un'uziri.", english: "To work like a worker bee/wasp." },
  { num: 52, shona: "Kukora kunge damba", dudziro: "Kuva nechinhu chakakora kana doro rakasimba.", sentence: "Maheu aya akakora kunge damba.", english: "To be as thick as a wild orange." }
];

const METAPHORS: Entry[] = [
  { num: 1, shona: "Upenyu irwizi.", dudziro: "Upenyu hune mafambiro ahwo.", sentence: "Upenyu irwizi, unofanira kugara wakagadzirira.", english: "Life is a river." },
  { num: 2, shona: "Mwoyo imombe.", dudziro: "Mwoyo unoda kutarisirwa.", sentence: "Mwoyo imombe inoda mufudzi.", english: "The heart is a cow." },
  { num: 53, shona: "Mwana ibadza", dudziro: "Mwana anobatsira pakushanda kumunda kana kuchengeta vabereki.", sentence: "Ndine mufaro nekuti mwana ibadza.", english: "A child is a hoe (source of labor and support)." },
  { num: 54, shona: "Upenyu irwizi", dudziro: "Upenyu hunoyerera huzere nematambudziko kana mufaro unopfuura.", sentence: "Upenyu irwizi runoyerera nenguva.", english: "Life is a river." },
  { num: 55, shona: "Mudzimai idombo", dudziro: "Mudzimai ndiye musimboti weimba asingazununguki.", sentence: "Amai idombo rinotsigira mhuri.", english: "A wife is a rock." },
  { num: 56, shona: "Rudo imoto", dudziro: "Rudo runopisa mwoyo rukaunza mufaro kana kurwadziwa.", sentence: "Rudo imoto unoparadza.", english: "Love is a fire." },
  { num: 57, shona: "Munhu ishumba", dudziro: "Kureva munhu ane ushingi kana ane hasha.", sentence: "Baba ishumba kana vakatsamwa.", english: "A man is a lion." },
  { num: 58, shona: "Mazwi imiseve", dudziro: "Mashoko anotaurwa anogona kubaya mwoyo zvakanyanya.", sentence: "Mashoko ake aiva imiseve yakatibaya.", english: "Words are arrows." },
  { num: 59, shona: "Pfungwa imhepo", dudziro: "Pfungwa dzinofamba kwese kwese pasina kumira.", sentence: "Pfungwa dzipenga, pfungwa imhepo.", english: "Thoughts are the wind." },
  { num: 60, shona: "Dzidzo inhengo yeuviri", dudziro: "Dzidzo yakakosha sekuvapo kwemaoko kana makumbo.", sentence: "Dzidzo inhengo yeuviri yaunofamba nayo kwese.", english: "Education is a body limb." },
  { num: 61, shona: "Nhamo igungwa", dudziro: "Matambudziko anogona kuva makuru zvekutadza kuyambuka.", sentence: "Nhamo igungwa rakadzika.", english: "Poverty/Trouble is an ocean." },
  { num: 62, shona: "Mashoko imvura", dudziro: "Mashoko anogona kunyaradza kana kugeza mwoyo.", sentence: "Mashoko ako imvura inotonhorera.", english: "Words are water." },
  { num: 63, shona: "Muroora imbeu", dudziro: "Muroora ndiye anounza vana vatsva mumhuri.", sentence: "Muroora mbeu inokudza dzinza.", english: "A daughter-in-law is a seed." },
  { num: 64, shona: "Sekuru igomo", dudziro: "Sekuru munhu akachenjera uye anovimbwa naye semuzinda wezivo.", sentence: "Sekuru igomo redu ratinotizira.", english: "A grandfather is a mountain (sanctuary of wisdom)." },
  { num: 65, shona: "Tariro inyeredzi", dudziro: "Tariro inotitungamirira panguva yerima.", sentence: "Tariro inyeredzi panguva yenhamo.", english: "Hope is a star." },
  { num: 66, shona: "Hana imba", dudziro: "Hana ndiyo nzvimbo inochengeterwa zvakavandika.", sentence: "Hana imba isingapindwi nemunhu wese.", english: "The conscience is a house." },
  { num: 67, shona: "Meso idiva", dudziro: "Meso anogona kuratidza zvose zviri mukati memwoyo.", sentence: "Meso ako idiva rerudo.", english: "Eyes are a pool/lake." },
  { num: 68, shona: "Shungu imoto", dudziro: "Kuva nehavi huru kwekuda kuita chimwe chinhu.", sentence: "Shungu imoto unomubvira mwoyo.", english: "Determination/Passion is a fire." },
  { num: 69, shona: "Uchenjeri ipfuma", dudziro: "Kuva nehungwaru kwakakosha kudarika kuva nemari.", sentence: "Chengetedza kudzidza nekuti uchenjeri ipfuma.", english: "Wisdom is wealth." },
  { num: 70, shona: "Ruregerero imvura", dudziro: "Kuregerera kunogeza mwoyo kubva paukasha.", sentence: "Ruregerero imvura inotonhodza hasha.", english: "Forgiveness is water." },
  { num: 71, shona: "Kunyarara igoridhe", dudziro: "Kunyarara kunopa ruremekedzo kana kuchengetedza rugare.", sentence: "Mumamiriro aya, kunyarara igoridhe.", english: "Silence is gold." },
  { num: 72, shona: "Mutauro ipfuma", dudziro: "Mutauro wedu ndiyo nhaka yakakosha kudarika zvese.", sentence: "Mutauro ipfuma yenyika.", english: "Language is wealth." },
  { num: 73, shona: "Tsika ibandauko", dudziro: "Tsika dzinotsigira munhu kuti aremekedzwe.", sentence: "Tsika dzedu ibandauko rechivanhu.", english: "Culture/Manners are a support." },
  { num: 74, shona: "Muzukuru imbeu yenyika", dudziro: "Vazukuru ndivo vachachengetedza nyika munguva inouya.", sentence: "Muzukuru mbeu yenyika yemberi.", english: "A grandchild is the seed of the nation." },
  { num: 75, shona: "Hasha igunhu", dudziro: "Hasha dzinopedza simba remunhu asina kururama.", sentence: "Hasha igunhu rakanamatira.", english: "Anger is an inherent burden (like a thumb)." },
  { num: 76, shona: "Nungo imwenje", dudziro: "Nungo dzinoratidza urombo huri kuuya.", sentence: "Nungo imwenje unotungamirira kunhamo.", english: "Laziness is a lamp (leading to poverty)." },
  { num: 77, shona: "Rufu ishamwari", dudziro: "Rufu chinhu chinogara chiripo chinogona kusvika chero nguva.", sentence: "Rufu ishamwari isingazivisi kuti riri kuuya.", english: "Death is a constant companion." },
  { num: 78, shona: "Kushanda imoto", dudziro: "Kushanda kunoburitsa goho rinoonekwa semoto unovhenekera.", sentence: "Kushanda imoto unovaraidza.", english: "Work is fire." },
  { num: 79, shona: "Hushe idande", dudziro: "Utungamiri chinhu chinogona kuputsika kana kusimba (fragile).", sentence: "Hushe idande rinogona kutsemuka.", english: "Leadership is a log." },
  { num: 80, shona: "Mwoyo idziva", dudziro: "Mwoyo unochengeta zvinhu zvakadzika zvisingazivikanwi nemunhu.", sentence: "Mwoyo idziva rakadzika, usariyerere.", english: "The heart is a deep pool." },
  { num: 81, shona: "Munhu mheni", dudziro: "Munhu ane simba rinotyisa rinoita zvinhu nekukurumidza.", sentence: "Mambo uya munhu mheni.", english: "A man is lightning." },
  { num: 82, shona: "Musoro idura", dudziro: "Musoro unochengetera ruzivo rwose rwamunhu.", sentence: "Musoro idura rezivo.", english: "The head is a granary." },
  { num: 83, shona: "Guta ijecha", dudziro: "Mumaguta mune vanhu vakawanda sejecha asi hamuna hama.", sentence: "Guta ijecha risingabatiki.", english: "The city is sand (lacks kinship/cohesion)." },
  { num: 84, shona: "Nguva imari", dudziro: "Nguva chinhu chakakosha kudarika chero chii zvacho.", sentence: "Shandisa nguva yako zvakanaka, nguva imari.", english: "Time is money." },
  { num: 85, shona: "Mwana ipfuma", dudziro: "Kuve nevana ndiko kupfuma kwemhuri.", sentence: "Kuve nevana mufaro, mwana ipfuma.", english: "A child is wealth." },
  { num: 86, shona: "Shoko imbeu", dudziro: "Shoko rikataurwa rinogona kukura richiita chinhu chikuru.", sentence: "Shoko imbeu, rinogona kuroverwa pasi.", english: "A word is a seed." },
  { num: 87, shona: "Hama igungwa", dudziro: "Hama dzakawanda uye dzine simba.", sentence: "Hama igungwa risina parunogumira.", english: "Relatives are an ocean." },
  { num: 88, shona: "Shamwari igirozi", dudziro: "Shamwari yechokwadi inobatsira munguva yenhamo.", sentence: "Tinashe shamwari yangu, ishamwari igirozi.", english: "A friend is an angel." },
  { num: 89, shona: "Utano ipfuma", dudziro: "Kuva nemuviri wakasimba ndiko kupfuma kwechokwadi.", sentence: "Chengetedza muviri, utano ipfuma.", english: "Health is wealth." },
  { num: 90, shona: "Kurwadziwa ipfumo", dudziro: "Kurwadziwa kunobaya mwoyo somunhu abayiwa pfumo.", sentence: "Kurwadziwa nenhau idzi ipfumo pamwoyo.", english: "Pain is a spear." },
  { num: 91, shona: "Mufaro izuva", dudziro: "Mufaro unovhenekera upenyu hwemunhu.", sentence: "Mufaro izuva rinovhenekera nhamo.", english: "Happiness is the sun." },
  { num: 92, shona: "Nyika isango", dudziro: "Munyika mune zvakaipa nehunyengeri sezvesango.", sentence: "Nyika isango rakapanduka.", english: "The world is a wilderness." },
  { num: 93, shona: "Mvura iupenyu", dudziro: "Pasina mvura hakuna upenyu.", sentence: "Mvura iupenyu, tichengetedze mvura.", english: "Water is life." },
  { num: 94, shona: "Musha idura", dudziro: "Pamusha ndipo panowanikwa chikafu nerugare.", sentence: "Musha wedu idura rine rudo.", english: "Home is a granary." },
  { num: 95, shona: "Zita idombo", dudziro: "Zita rakanaka rinogara nekusingaperi.", sentence: "Zita rako idombo risingaparari.", english: "A (good) name is a rock." },
  { num: 96, shona: "Kufa ndiko kuzorora", dudziro: "Kufa kuguma kwematambudziko enyika.", sentence: "Rega acheme, kufa ndiko kuzorora.", english: "Death is rest." },
  { num: 97, shona: "Mwoyo in'anga", dudziro: "Mwoyo unoziva zviri kure kana zvisati zvaitika.", sentence: "Mwoyo wangu in'anga, unondiudza chokwadi.", english: "The heart is a diviner (it knows/predicts)." },
  { num: 98, shona: "Dzvene iuchi", dudziro: "Munhu ane hunhu hwakanaka kwazvo.", sentence: "Musikana uya dzvene iuchi.", english: "Purity/Goodness is honey." },
  { num: 99, shona: "Kurara ihope", dudziro: "Kuzorodza pfungwa nemuviri.", sentence: "Kurara ihope dzinonaka.", english: "Sleep is restorative rest." },
  { num: 100, shona: "Denda iupfu", dudziro: "Chirwere chinopedza munhu kuita upfu.", sentence: "Denda iupfu hunopera.", english: "Disease wastes the person away." },
  { num: 101, shona: "Mhandu ishasha", dudziro: "Muvengi anogona kuva nehunyanzvi pakutsvaka mhosva.", sentence: "Mhandu ishasha pakutsvaka mhosva.", english: "An enemy is a expert at finding faults." },
  { num: 102, shona: "Hana indaza", dudziro: "Hana inodzoreredza munhu panzira yayo.", sentence: "Hana indaza yechokwadi.", english: "The conscience is a guiding ornament." }
];

// Combine for search across both
const ALL_ITEMS = [...SIMILES, ...METAPHORS];

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const EntryCard = memo(({ item, isHighlighted }: { item: Entry; isHighlighted: boolean }) => {
  return (
    <div
      id={`figurative-${item.num}`}
      className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
        isHighlighted
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/50 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-blue-300 dark:hover:border-blue-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Number badge */}
        <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              isHighlighted
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
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
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {item.shona}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left column: Dudziro + Muenzaniso */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1 tracking-wider">
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

            {/* Right column: English meaning */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1 tracking-wider">
                Meaning
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
export const SimilesMetaphors: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'similes' | 'metaphors'>('similes');
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

  // Get current list based on tab
  const currentItems = useMemo(() => {
    return activeTab === 'similes' ? SIMILES : METAPHORS;
  }, [activeTab]);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }

    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      // Search across all items to find match, then switch tab if needed
      const match = ALL_ITEMS.find(
        item =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.dudziro.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.num);
        // Determine which tab this item belongs to
        const isSimile = SIMILES.some(s => s.num === match.num);
        setActiveTab(isSimile ? 'similes' : 'metaphors');
        setTimeout(() => {
          const element = document.getElementById(`figurative-${match.num}`);
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
    const random = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setRandomItem(random);
  }, []);

  const refreshRandom = () => {
    const random = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setRandomItem(random);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => { setActiveTab('similes'); setHighlightedId(null); }}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'similes'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Fanano ({SIMILES.length})
        </button>
        <button
          onClick={() => { setActiveTab('metaphors'); setHighlightedId(null); }}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'metaphors'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
              : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Metaphors ({METAPHORS.length})
        </button>
      </div>
    </div>
  );

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
      {/* Random Item */}
      <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">✨ Random Figurative</h3>
          <button
            onClick={refreshRandom}
            className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
            <span>Fanano Dzose</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{SIMILES.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Total Metaphors</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{METAPHORS.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Total</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{ALL_ITEMS.length}</span>
          </li>
          <li className="flex justify-between">
            <span>Translated</span>
            <span className="font-bold text-green-600 dark:text-green-400">✓ 100%</span>
          </li>
        </ul>
      </div>

      {/* Quick Tip */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
        <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">💡 Did you know?</h4>
        <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
          <strong>Similes</strong> use "kunge" or "se" (like/as) to compare, while <strong>metaphors</strong> state a direct comparison without these words. Both enrich Shona speech and writing.
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
            <ShieldCheck size={14} />
            KUFANANIDZA NEKUSHASA
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Fanano neFananidzo
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Madimikira okufananidza (similes) nemadimikira okushasa (metaphors) inzira dzinoshandiswa mumutauro weChiShona kuenzanisa zvinhu kana pfungwa kuti kutaura kuve nehudzamu uye kunakidze.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {ALL_ITEMS.length} total</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random expression</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a simile or metaphor..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
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
                  <X size={18} className="text-blue-200" />
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
          {/* List of items */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {activeTab === 'similes' ? 'Similes' : 'Metaphors'}
              </span>
              <span>{currentItems.length} shown</span>
            </div>

            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <EntryCard
                  key={item.num}
                  item={item}
                  isHighlighted={item.num === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No items in this category.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <Sidebar />
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Similes:</strong> Comparisons using "kunge" (like/as) – e.g., "kuchena kunge mukaka".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Metaphors:</strong> Direct comparisons without "kunge" – e.g., "Upenyu irwizi".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dudziro:</strong> Explanation in Shona to clarify the figurative meaning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences showing real‑life usage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>Use the search bar to find a specific expression or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimilesMetaphors;