import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Search, X, ChevronUp, RefreshCw } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ──────────────────────────────────────────────────────────────────────────────
interface MadimikiraItem {
  num: number;
  shona: string;
  dudziro: string;
  sentence: string;
  english: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// MADIMIKIRA LIST
// ──────────────────────────────────────────────────────────────────────────────
interface MadimikiraItem {
  num: number;
  shona: string;
  dudziro: string;
  sentence: string;
  english: string;
}

const MADIMIKIRA_LIST: MadimikiraItem[] = [
  
  {
    num: 51,
    shona: "Kubata kumeso",
    dudziro: "Kunyengedza munhu; to deceive or trick someone.",
    sentence: "Vatengesi ava vari kubata vanhu kumeso nezvinhu zvakaora.",
    english: "These vendors are deceiving people with rotten goods."
  },
  {
    num: 52,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura chinhu chausingakwanisi kuva nacho; to admire something you cannot have.",
    sentence: "Ngoshi iyoyo inodhura zvokuti tichaitira kudya nemeso chete.",
    english: "That suit is so expensive that we will only admire it from afar."
  },
  {
    num: 53,
    shona: "Chitsoka ndibereke",
    dudziro: "Kumhanya zvakanyanya nekutya kana nekuchimbidza; to run very fast.",
    sentence: "Mbavha payakaona mapurisa, yakati chitsoka ndibereke.",
    english: "When the thief saw the police, he ran away as fast as he could."
  },
  {
    num: 54,
    shona: "Kupura nyemba nemusana",
    dudziro: "Kugara muupfumi nekufara; to live in luxury and comfort.",
    sentence: "Mhuri yekwaVaMoyo iri kupura nyemba nemusana kubva zvakadzoka mwanakomana wavo.",
    english: "The Moyo family is living in absolute luxury since their son returned."
  },
  {
    num: 55,
    shona: "Kurova imbwa nemukaka",
    dudziro: "Kuva nepfuma yakawanda kwazvo; to be extremely wealthy.",
    sentence: "Muzvinabhizimusi uyu anorova imbwa nemukaka.",
    english: "This businessman is incredibly wealthy (he hits dogs with milk)."
  },
  {
    num: 56,
    shona: "Kuva nemapapiro",
    dudziro: "Kudada kana kuzvitutumadza; to be proud or boastful.",
    sentence: "Kubva zvaakakwidzwa chigaro, ava nemapapiro.",
    english: "Since he was promoted, he has become very boastful."
  },
  {
    num: 57,
    shona: "Kurara netsoka",
    dudziro: "Kugara wakagadzirira kutiza kana kuita chimwe chinhu; to be on high alert.",
    sentence: "Munguva yehondo, vanhu vairara netsoka.",
    english: "During the war, people lived on high alert, ready to flee."
  },
  {
    num: 58,
    shona: "Kuseka nhamo",
    dudziro: "Kutsungirira nematambudziko uchiratidza kufara; to endure hardship with a brave face.",
    sentence: "Murombo anoseka nhamo, haaverengi mazuva.",
    english: "A poor person endures hardship bravely; they don't count the days."
  },
  {
    num: 59,
    shona: "Kusunga doro",
    dudziro: "Kugadzira doro remabiko kana remushando; to brew beer for a ceremony.",
    sentence: "Mbuya vari kusunga doro rekupemberera goho.",
    english: "Grandmother is brewing beer to celebrate the harvest."
  },
  {
    num: 60,
    shona: "Kuita ganyazeza",
    dudziro: "Kuita zvinhu uchizvidadisa; to act in a showy or arrogant manner.",
    sentence: "Rega kuita ganyazeza nekamari ikako kashoma.",
    english: "Stop acting so showy with that little bit of money."
  },
  {
    num: 61,
    shona: "Kutsenga mukanwa",
    dudziro: "Kutaura uchizvinyongonyedza kana kunyara; to speak hesitantly or shyly.",
    sentence: "Taura zvauri kuda, rega kutsenga mukanwa.",
    english: "Say what you want; stop speaking so hesitantly."
  },
  {
    num: 62,
    shona: "Kupa musana",
    dudziro: "Kusafuratira munhu kana kumusiya; to turn one's back on someone/neglect.",
    sentence: "Vabereki havafaniri kupa vana vavo musana.",
    english: "Parents should not turn their backs on their children."
  },
  {
    num: 63,
    shona: "Kufira rutsoka",
    dudziro: "Kufarira kufamba nzendo dzakawanda; to love traveling.",
    sentence: "Sekuru vangu vaifira rutsoka, vaishanyira vana vose.",
    english: "My grandfather loved traveling; he visited all his children."
  },
  {
    num: 64,
    shona: "Kubuda mwoyo",
    dudziro: "Kutyisa kana kuvhunduka zvakanyanya; to be terrified.",
    sentence: "Ndakabuda mwoyo pandakaona mbavha yakabata banga.",
    english: "I was terrified when I saw a thief holding a knife."
  },
  {
    num: 65,
    shona: "Kudya marasha",
    dudziro: "Kutsamwa zvakanyanya; to be extremely angry.",
    sentence: "Baba vakadya marasha pavakanzwa kuti mwana atiza chikoro.",
    english: "Father was furious when he heard that the child skipped school."
  },
  {
    num: 66,
    shona: "Kuva nemusoro wakaoma",
    dudziro: "Kusateerera kana kusadzidzeka; to be stubborn or slow to learn.",
    sentence: "Mwana uyu ane musoro wakaoma, haateereri yambiro.",
    english: "This child is stubborn; he doesn't listen to warnings."
  },
  {
    num: 67,
    shona: "Kufamba netsoka",
    dudziro: "Kufamba uchishandisa makumbo (kwete motokari); to travel on foot.",
    sentence: "Takafamba netsoka kubva kwaMutare kusvika kwaBvumba.",
    english: "We traveled on foot from Mutare to Bvumba."
  },
  {
    num: 68,
    shona: "Kusvipa mwoyo",
    dudziro: "Kushuva chinhu uchichida kwazvo; to desire something intensely.",
    sentence: "Arikusvipa mwoyo kuda motokari itsva iyoyo.",
    english: "He is intensely desiring that new car."
  },
  {
    num: 69,
    shona: "Kufumura guva",
    dudziro: "Kutaura zvakaipa zvemufi kana kutaura zvinhu zvekare zvakaipa; to speak ill of the dead or reveal old secrets.",
    sentence: "Hazvina kunaka kufumura guva remunhu akazorora.",
    english: "It is not good to speak ill of a person who has passed away."
  },
  {
    num: 70,
    shona: "Kubata dombo",
    dudziro: "Kupika chokwadi; to swear the truth.",
    sentence: "Ndakabata dombo kuti handina kumubira mari yake.",
    english: "I swore the truth that I did not steal his money."
  },
  {
    num: 71,
    shona: "Kudya mazwi",
    dudziro: "Kukanganisa kutaura nekuda kwekutya; to mumble or swallow words due to fear.",
    sentence: "Pamberi pedare, akatanga kudya mazwi nekutya.",
    english: "Before the court, he started mumbling due to fear."
  },
  {
    num: 72,
    shona: "Kuva nerurimi rurefu",
    dudziro: "Kuva munhu anogara achitaura makuhwa; to be a gossip.",
    sentence: "Mainini vanoita zvekuita, vane rurimi rurefu.",
    english: "My aunt is trouble; she has a long tongue (she's a gossip)."
  },
  {
    num: 73,
    shona: "Kuisa munyu",
    dudziro: "Kuwedzera mufaro kana manyepo pane imwe nyaya; to exaggerate or spice up a story.",
    sentence: "Akaisa munyu panyaya yekuti akarwa neshumba.",
    english: "He exaggerated the story about fighting a lion."
  },
  {
    num: 74,
    shona: "Kugara panyanga",
    dudziro: "Kuva nechigaro chikuru kana simba; to be in a position of power/authority.",
    sentence: "Ishe vari kugara panyanga kwemakore gumi iye zvino.",
    english: "The Chief has been in power for ten years now."
  },
  {
    num: 75,
    shona: "Kupika nenzara",
    dudziro: "Kupika chokwadi chaicho; to swear honestly.",
    sentence: "Ndinopika nenzara kuti handina kumuziva.",
    english: "I swear by my hunger (honestly) that I didn't know him."
  },
  {
    num: 76,
    shona: "Kupaza imba",
    dudziro: "Kuba nekurapa madziro kana kuvhura gonhi nechisimba; to break into a house.",
    sentence: "Mbavha dzakapaza imba yedu usiku hwanhasi.",
    english: "Thieves broke into our house tonight."
  },
  {
    num: 77,
    shona: "Kuva nerombo",
    dudziro: "Kuva neraki; to be lucky.",
    sentence: "Akava nerombo rekuwana mari muvhiri.",
    english: "He was lucky to find money on the road."
  },
  {
    num: 78,
    shona: "Kudya tsvina",
    dudziro: "Kutaura zvinonyadzisa; to speak profanely or shamefully.",
    sentence: "Mwana uyu ava kudya tsvina nekuti haacharangwi.",
    english: "This child is now speaking profanely because he is no longer disciplined."
  },
  {
    num: 79,
    shona: "Kurova guva",
    dudziro: "Mutambo wekurangarira mufi unoitwa mushure megore; a ceremony to bring back the spirit of the deceased.",
    sentence: "Mhuri yekwaChitepo iri kurova guva remusoro wemhuri.",
    english: "The Chitepo family is performing the 'bringing back' ceremony for the head of the family."
  },
  {
    num: 80,
    shona: "Kudzipwa negonye",
    dudziro: "Kunyimwa zvinhu zvidiki nezvepedyo; to be denied basic/small things.",
    sentence: "Tinodzipwa negonye mumba medu mune zvose.",
    english: "We are being denied basics even though we have everything."
  },
  {
    num: 81,
    shona: "Kuseka zvakaoma",
    dudziro: "Kuseka zvekuti unotoomerwa; to laugh heartily/hard.",
    sentence: "Vakaseka zvakaoma nekuda kwejee raTuku.",
    english: "They laughed heartily at Tuku's joke."
  },
  {
    num: 82,
    shona: "Kutsvaga rutsoka",
    dudziro: "Kufamba uchitsvaga basa kana ruyamuro; to travel looking for work or help.",
    sentence: "Ari kutsvaga rutsoka muHarare kuti awane basa.",
    english: "He is traveling around Harare looking for a job."
  },
  {
    num: 83,
    shona: "Kudya mafuta",
    dudziro: "Kupfuma kana kuva nemuviri wakanaka; to be wealthy or healthy-looking.",
    sentence: "Mwana iyeye adya mafuta kubva zvaakatanga basa.",
    english: "That child looks healthy and wealthy since starting work."
  },
  {
    num: 84,
    shona: "Kuita ziso ritsvuku",
    dudziro: "Kutsamwa zvakaipisisa; to be extremely angry.",
    sentence: "Mupurisa akaita ziso ritsvuku payakatiza mbavha.",
    english: "The policeman was extremely angry when the thief escaped."
  },
  {
    num: 85,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Sekuru vakarova pasi vaine makore makumi masere.",
    english: "Grandfather passed away at the age of eighty."
  },
  {
    num: 86,
    shona: "Kuva neganda gobvu",
    dudziro: "Kusanzwa kutsiurwa kana kunyadziswa; to be thick-skinned/shameless.",
    sentence: "Ane ganda gobvu, haanyari kusekwa nevanhu.",
    english: "He is thick-skinned; he is not ashamed of being laughed at."
  },
  {
    num: 87,
    shona: "Kugara negona",
    dudziro: "Kushandisa mishonga kana huroyi; to use traditional medicines or charms.",
    sentence: "Vanhu vekwaMambo vanonzi vanogara negona.",
    english: "The people of the Chief's lineage are said to use charms."
  },
  {
    num: 88,
    shona: "Kudya huku neminhenga yayo",
    dudziro: "Kuba chinhu chose usina kusiya huchapupu; to steal everything without leaving a trace.",
    sentence: "Mbavha idzi dzakadya huku neminhenga yayo muchitoro umu.",
    english: "The thieves cleared out everything in this shop without a trace."
  },
  {
    num: 89,
    shona: "Kuva nerudo rwebofu",
    dudziro: "Kuda munhu zvakaipisisa usina hanya nekukanganisa kwake; to have blind love.",
    sentence: "Ane rudo rwebofu kumurume wake anomurova.",
    english: "She has blind love for her husband who beats her."
  },
  {
    num: 90,
    shona: "Kufamba nehana",
    dudziro: "Kufamba uine kutya; to travel with anxiety/fear.",
    sentence: "Takafamba nehana musango muya mune shumba.",
    english: "We traveled with anxiety through that forest which has lions."
  },
  {
    num: 91,
    shona: "Kubata kumeso",
    dudziro: "Kunyengedza; to deceive.",
    sentence: "Usandibata kumeso, ndoziva chokwadi.",
    english: "Don't deceive me; I know the truth."
  },
  {
    num: 92,
    shona: "Kurova mhere",
    dudziro: "Kuungudza kana kuchema nenzwi riri pamusoro; to wail or scream loudly.",
    sentence: "Vakadzi vakarova mhere parufu rwamambo.",
    english: "The women wailed loudly at the king's funeral."
  },
  {
    num: 93,
    shona: "Kukanda makumbo",
    dudziro: "Kufamba-famba uchizvitsvagira mufaro; to wander around for pleasure.",
    sentence: "Kupera kwesvondo tinokanda makumbo mudhorobha.",
    english: "At the weekend, we wander around the city."
  },
  {
    num: 94,
    shona: "Kuva musoro wepwere",
    dudziro: "Kuva nepfungwa dzevana; to be childish in thinking.",
    sentence: "Murume mukuru akadaro asi ane musoro wepwere.",
    english: "A big man like that, yet he is so childish."
  },
  {
    num: 95,
    shona: "Kudya zvisingagayiki",
    dudziro: "Kutaura zvinorwadza kana zvinonyadzisa kwazvo; to say things that are hard to swallow.",
    sentence: "Zvaakataura kudare rava sabhuku zvaidya zvisingagayiki.",
    english: "What he said at the headman's court was hard to swallow."
  },
  {
    num: 96,
    shona: "Kugara padare",
    dudziro: "Kutonga nyaya dzevanhu; to preside over a traditional court.",
    sentence: "Vakuru vari kugara padare nhasi vachitonga mhondi.",
    english: "The elders are presiding over the court today judging a murderer."
  },
  {
    num: 97,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa mari nezvinhu nenzira yekuzvifadza; to enjoy wealth.",
    sentence: "Vana vake vari kudya hupfumi hwavakasiirwa nababa vavo.",
    english: "His children are enjoying the wealth left to them by their father."
  },
  {
    num: 98,
    shona: "Kuva nemakumbo marefu",
    dudziro: "Kufamba zvakanyanya; to be someone who travels a lot.",
    sentence: "Tinashe ane makumbo marefu, haagari pamba.",
    english: "Tinashe travels a lot; he doesn't stay home."
  },
  {
    num: 99,
    shona: "Kurova hana",
    dudziro: "Kuvhunduka; to be startled.",
    sentence: "Kudzvanya kwebhazi kwakarova hana yangu.",
    english: "The bus hooting startled me."
  },
  {
    num: 100,
    shona: "Kusvitsa mwoyo",
    dudziro: "Kuita chinhu nekuzvipira kwese; to do something with total commitment.",
    sentence: "Mudzidzi uyu akasvitsa mwoyo panyaya dzechikoro.",
    english: "This student is totally committed to his schoolwork."
  },
  {
    num: 101,
    shona: "Kuva neruoko runopa",
    dudziro: "Kuva munhu ane rupo; to be generous.",
    sentence: "Mai vangu vane ruoko runopa kuvarombo.",
    english: "My mother is very generous to the poor."
  },
  {
    num: 102,
    shona: "Kurova pasi nehana",
    dudziro: "Kuora mwoyo kana kupererwa netariro; to be despondent or lose hope.",
    sentence: "Akarova pasi nehana paakanzwa kuti haana kupasa bvunzo.",
    english: "He was despondent when he heard he failed the exam."
  },
  {
    num: 103,
    shona: "Kudya muto webeche",
    dudziro: "Kunyengedzwa nemukadzi nekuda kwerudo (vulgar/informal); to be pussy-whipped.",
    sentence: "Murume iyeye akadya muto webeche, haachanzwi zvevabereki.",
    english: "That man is pussy-whipped; he no longer listens to his parents."
  },
  {
    num: 104,
    shona: "Kusunga masaga",
    dudziro: "Kugadzirira kuenda parwendo; to pack bags for a journey.",
    sentence: "Tave kusunga masaga edu kuti tiende kumusha.",
    english: "We are packing our bags to go home."
  },
  {
    num: 105,
    shona: "Kupfeka magirazi",
    dudziro: "Kudada; to be snobbish or proud.",
    sentence: "Kubva zvaakaenda kuUK, ava kutopfeka magirazi pamberi pedu.",
    english: "Since going to the UK, he has become very snobbish towards us."
  },
  {
    num: 106,
    shona: "Kudya hura",
    dudziro: "Kunyengera; to betray.",
    sentence: "Shamwari yangu yakandidya hura ikataura chakavanzika changu.",
    english: "My friend betrayed me and told my secret."
  },
  {
    num: 107,
    shona: "Kufamba nemuromo",
    dudziro: "Kutaura nezvechimwe chinhu chisati chaitika; to speak prematurely about something.",
    sentence: "Rega kufamba nemuromo nyaya isati yapera.",
    english: "Don't speak prematurely before the matter is finished."
  },
  {
    num: 108,
    shona: "Kugara mugate",
    dudziro: "Kuva mumatambudziko makuru; to be in deep trouble.",
    sentence: "Mbavha yakabatwa yakabva yagara mugate.",
    english: "The thief was caught and immediately found himself in deep trouble."
  },
  {
    num: 109,
    shona: "Kudya nemwoyo",
    dudziro: "Kuitira godo kana shanje; to be envious or jealous.",
    sentence: "Vavakidzani vedu vari kudya nemwoyo nekuda kwekurimisa kwedu.",
    english: "Our neighbors are envious of our farming success."
  },
  {
    num: 110,
    shona: "Kupisira mwoyo",
    dudziro: "Kushuvira chinhu zvikuru; to yearn deeply for something.",
    sentence: "Aripupisira mwoyo kuroora musikana uyu.",
    english: "He is yearning deeply to marry this girl."
  },
  {
    num: 111,
    shona: "Kunwisa mvura",
    dudziro: "Kuva munhu akanaka kwazvo pachiso kana kuyevedza; to be exceptionally beautiful or handsome.",
    sentence: "Musikana akauya nezuro anonwisa mvura chaizvo.",
    english: "The girl who came yesterday is exceptionally beautiful."
  },
  {
    num: 112,
    shona: "Kufira mudutu sembeva",
    dudziro: "Kuwirwa nenhamo kana kufa usingazivi chikonzero; to perish or suffer without knowing why.",
    sentence: "Akafira mudutu sembeva mutsaona iyoyo asina kana chaakaziva.",
    english: "He perished in that accident without even knowing what happened."
  },
  {
    num: 113,
    shona: "Kurasa muswe",
    dudziro: "Kufarisa zvekutadza kuzvibata kana kuita unhu hwakaipa; to misbehave due to excessive excitement.",
    sentence: "Vakomana vakarasa muswe vachipemberera kukunda kwebhora.",
    english: "The boys misbehaved because they were too excited celebrating the football win."
  },
  {
    num: 114,
    shona: "Kudya mwoto",
    dudziro: "Kupopota zvikuru kana kutaura nehasha dzinotyisa; to scold or shout very angrily.",
    sentence: "Mukuru wechikoro akadya mwoto vana pavakatiza mugedhe.",
    english: "The headmaster was fuming with anger when the children escaped through the gate."
  },
  {
    num: 115,
    shona: "Kucheka nyora",
    dudziro: "Kuwirwa nematambudziko anorwadza kana kurangwa zvakaomarara; to experience severe hardship or punishment.",
    sentence: "Mbavha iyoyo yakachekwa nyora nemapurisa payakabatwa.",
    english: "That thief was severely dealt with by the police when he was caught."
  },
  {
    num: 116,
    shona: "Kutsika mutsvanzva",
    dudziro: "Kuvamba kana kutanga chinhu chitsva; to start or initiate something new.",
    sentence: "Nhasi ndatsika mutsvanzva nekurima munda wangu mutsva.",
    english: "Today I have started the journey of tilling my new field."
  },
  {
    num: 117,
    shona: "Kuita muonera pamwe",
    dudziro: "Kubatsirana pakuita basa; to cooperate or work together on a task.",
    sentence: "Musha wedu unozivikanwa nekuita muonera pamwe muminda.",
    english: "Our village is known for working together in the fields."
  },
  {
    num: 118,
    shona: "Kudya makomo",
    dudziro: "Kudya zvasara (musarirwa) kana kutsvaga zvekudya musango; to scavenge or eat leftovers/wild fruits.",
    sentence: "Vana vainge vava kudya makomo nekuda kwenzara yaivepo.",
    english: "The children were now scavenging for wild fruits due to the prevailing hunger."
  },
  {
    num: 119,
    shona: "Kunakurira munhu nyoka",
    dudziro: "Kukuchidzira munhu kuita zvakaipa kana kumuunza munjodzi; to incite someone to do wrong or lead them into danger.",
    sentence: "Rega kundinakurira nyoka mhenyu, ndinoziva zvakaipa nezvakanaka.",
    english: "Stop inciting me to do wrong; I know right from wrong."
  },
  {
    num: 120,
    shona: "Kubura munhu mumoto",
    dudziro: "Kubatsira munhu anenge ari mumatambudziko; to rescue someone from trouble.",
    sentence: "Ndatenda nekundibura mumoto panyaya yemari iyi.",
    english: "Thank you for rescuing me from this financial trouble."
  },
  {
    num: 121,
    shona: "Kukanganwa chazuro nehope",
    dudziro: "Kusatenda rubatsiro rwausati wambopiwa kare; to be ungrateful for past help.",
    sentence: "Munhu anokanganwa chazuro nehope haabatsiriki kechipiri.",
    english: "An ungrateful person who forgets past favors is never helped twice."
  },
  {
    num: 122,
    shona: "Kubayira zanhi",
    dudziro: "Kuchengeta chakavanzika zvakasimba; to keep a secret very strictly.",
    sentence: "Ndakakubayira zanhi, hapana achaziva zvataura.",
    english: "I have kept your secret strictly; no one will know what was said."
  },
  {
    num: 123,
    shona: "Kurovera matama pasi",
    dudziro: "Kuchembera zvakanyanya kana kudonha; to be very old or to fall down heavily.",
    sentence: "Mbuya vedu vave kurovera matama pasi neukuru.",
    english: "Our grandmother is now very elderly."
  },
  {
    num: 124,
    shona: "Kupururudza mheni",
    dudziro: "Kuita chinhu chinoshamisa kana chisingakarirwi nevanhu; to do something extraordinary or shocking.",
    sentence: "Akarova bhora rikapinda mugedhe achibva apururudza mheni chaiyo.",
    english: "He struck the ball into the net and performed a truly amazing feat."
  },
  {
    num: 125,
    shona: "Kudya cheziya",
    dudziro: "Kudya zvinhu zvawakashandira nemuviri wako; to enjoy the fruits of one's hard labor.",
    sentence: "Kudya cheziya kunofadza mwoyo kupinda kuba.",
    english: "Enjoying the fruits of your own labor is more satisfying than stealing."
  },
  {
    num: 126,
    shona: "Kubata jongwe muromo",
    dudziro: "Kumuka nenguva pfupi mambakwedza; to wake up very early before dawn.",
    sentence: "Ndichabata jongwe muromo kuitira kuti ndichimbidze kusvika.",
    english: "I will wake up before dawn so that I arrive early."
  },
  {
    num: 127,
    shona: "Kuve nechinya chiri pahuma",
    dudziro: "Kukurumidza kutsamwa; to be short-tempered.",
    sentence: "Usatambe naye, ane chinya chiri pahuma.",
    english: "Don't play with him; he is very short-tempered."
  },
  {
    num: 128,
    shona: "Kutsika madziro",
    dudziro: "Kurambisisa chinhu zvakasimba; to strongly deny or refuse something.",
    sentence: "Akatsika madziro achiti haasiriye akaba huku.",
    english: "He adamantly denied that he was the one who stole the chicken."
  },
  {
    num: 129,
    shona: "Kuzvimbirwa nenyemba dzevabvuwi",
    dudziro: "Kuita pamuviri usina kuroorwa; to get pregnant out of wedlock.",
    sentence: "Musikana uyo anonzi akazvimbirwa nenyemba dzevabvuwi.",
    english: "That girl is said to have fallen pregnant unexpectedly."
  },
  {
    num: 130,
    shona: "Kusviba mwoyo",
    dudziro: "Kusuwa zvakanyanya kana kuva nehutsinye; to be very sad or to have a cruel heart.",
    sentence: "Ndakasviba mwoyo pandakanzwa rufu rwaambuya.",
    english: "I was deeply saddened when I heard of grandmother's death."
  },
  {
    num: 131,
    shona: "Kupakata gona",
    dudziro: "Kuzvigadzirira nekurapa kana huroyi; to use traditional charms or medicine for protection.",
    sentence: "Vamwe vanofunga kuti akapakata gona ndosaka achibudirira.",
    english: "Some think he uses traditional charms, which is why he succeeds."
  },
  {
    num: 132,
    shona: "Kuoma mate",
    dudziro: "Kuvhunduka kana kushamiswa zvekutadza kutaura; to be speechless with shock or fear.",
    sentence: "Ndakaoma mate mukanwa pandakaona shumba padhuze neni.",
    english: "I was speechless with shock when I saw a lion close to me."
  },
  {
    num: 133,
    shona: "Kurovera mwoyo padombo",
    dudziro: "Kutsungirira mudambudziko; to steel oneself or endure in the face of adversity.",
    sentence: "Rovera mwoyo padombo mwanangu, dambudziko iri richapfuura.",
    english: "Be patient and endure, my child; this trouble will pass."
  },
  {
    num: 134,
    shona: "Kufamba nedivi segakanje",
    dudziro: "Kusakanganisa kutaura chokwadi kana kutaura zvisina kunanga; to be evasive or indirect.",
    sentence: "Usafambe nedivi segakanje, taura chokwadi chiri kudiwa.",
    english: "Don't be evasive like a crab; speak the truth that is needed."
  },
  {
    num: 135,
    shona: "Kugara maoko",
    dudziro: "Kuva neusimbe kana kusashanda; to be idle or lazy.",
    sentence: "Regai kugara maoko pane basa rakawanda kudai.",
    english: "Don't just sit idle when there is so much work."
  },
  {
    num: 136,
    shona: "Kubatiswa manhenga",
    dudziro: "Kunyengedzwa; to be deceived or tricked into believing something false.",
    sentence: "Ndakabatiswa manhenga ndichifunga kuti ndawana basa.",
    english: "I was tricked into believing I had found a job."
  },
  {
    num: 137,
    shona: "Kudyirwa danga",
    dudziro: "Kutorerwa pfuma kana zvinhu; to have one's possessions or wealth taken away.",
    sentence: "Varume vaya vakadyirwa danga nembavha.",
    english: "Those men had their livestock stolen by thieves."
  },
  {
    num: 138,
    shona: "Kukanda mapfumo pasi",
    dudziro: "Kubvuma kukundwa kana kuregera kurwa; to surrender or give up.",
    sentence: "Mushure mekuedza kwenguva refu, akazokanda mapfumo pasi.",
    english: "After trying for a long time, he finally gave up."
  },
  {
    num: 139,
    shona: "Kufudza mombe negotsi",
    dudziro: "Kusangwarira kana kuita chinhu usina hanya; to be careless or unwatchful.",
    sentence: "Ukafudza mombe negotsi, dzinodya minda yevanhu.",
    english: "If you are unwatchful (herd cattle with your back), they will eat people's crops."
  },
  {
    num: 140,
    shona: "Kuisa muromo mumhuno",
    dudziro: "Kunyarara; to keep quiet or shut up.",
    sentence: "Itai muromo mumhuno titange musangano wedu.",
    english: "Keep quiet so we can start our meeting."
  },
  {
    num: 141,
    shona: "Kusunga hura",
    dudziro: "Kutsungirira nzara kana kudzibata; to endure hunger or practice self-control.",
    sentence: "Takasunga hura kusvika taenda kumusha kundo dya.",
    english: "We endured hunger until we went home to eat."
  },
  {
    num: 142,
    shona: "Kuguta nguva shoma senzara",
    dudziro: "Kuva nemufaro unopfuura nekukurumidza; to have short-lived satisfaction or success.",
    sentence: "Hupfumi hwake hwaiva hwekuguta nguva shoma senzara.",
    english: "His wealth was short-lived (like hunger satisfied for a moment)."
  },
  {
    num: 143,
    shona: "Kuve nenzeve dzakananzwa nembwa",
    dudziro: "Kusateerera zvaunoudzwa; to be disobedient or naughty.",
    sentence: "Mwana uyo ane nzeve dzakananzwa nembwa, haanzwi tsiuro.",
    english: "That child is very disobedient; he doesn't listen to advice."
  },
  {
    num: 144,
    shona: "Kufura iwete",
    dudziro: "Kuzorora kana kugara zvakanaka pasina chinokunetsa; to relax or live comfortably without worries.",
    sentence: "Vave kufura iwete mushure mekushanda nesimba.",
    english: "They are now relaxing comfortably after working hard."
  },
  {
    num: 145,
    shona: "Kupinda nemwenje mudziva",
    dudziro: "Kuzvipira kuita chinhu chine njodzi huru kana chisina tariro; to undertake a very risky or hopeless task.",
    sentence: "Kupinda muzvematongerwo enyika kupinda nemwenje mudziva.",
    english: "Entering politics is like entering a pool with a lit lamp (very risky)."
  },
  {
    num: 146,
    shona: "Kudya zvavapfupi nekureba",
    dudziro: "Kushandisa simba kana chigaro kutorera vasina simba; to use one's height (power) to take from the short (weak).",
    sentence: "Sabhuku uyu anodya zvavapfupi nekureba mumusha umu.",
    english: "This headman uses his power to exploit the weak in this village."
  },
  {
    num: 147,
    shona: "Kudya mutupo",
    dudziro: "Kuita chinhu chinorambidzwa nemagariro kana mutemo wechivanhu; to commit a taboo act.",
    sentence: "Kuroora mwana wehama yako kudya mutupo chaiwo.",
    english: "Marrying your relative's child is a serious taboo."
  },
  {
    num: 148,
    shona: "Kudya arere",
    dudziro: "Kurarama nepfuma yeumwe munhu iwe usingashandi; to live off someone else's labor while being idle.",
    sentence: "Muzukuru anongoda kudya arere mumba maambuya.",
    english: "The nephew just wants to live off others in grandmother's house."
  },
  {
    num: 149,
    shona: "Kudyiwa munyati",
    dudziro: "Kurasikirwa kana kubirwa zvinhu zvako; to suffer a loss or be cheated of possessions.",
    sentence: "Takadyiwa munyati patakatenga motokari yakafa.",
    english: "We suffered a loss when we bought a broken car."
  },
  {
    num: 150,
    shona: "Kudzika midzi",
    dudziro: "Kugara panzvimbo zvachose kana kuva nesimba risingazununguki; to settle permanently or be firmly established.",
    sentence: "Dzidzo yakadzika midzi mumhuri yekwaSibanda.",
    english: "Education is firmly established in the Sibanda family."
  },
  {
    num: 151,
    shona: "Kudzora tsvimbo",
    dudziro: "Kuregera kurwa kana kuratidza moyo murefu; to refrain from fighting or show patience.",
    sentence: "Dzora tsvimbo mwanangu, hondo haivaki musha.",
    english: "Be patient and don't fight, my child; war doesn't build a home."
  },
  {
    num: 152,
    shona: "Kufira mafufu segonzo",
    dudziro: "Kufa nekuda kwechinhu chidiki-diki kana nekuda kwekukarira; to die for something trivial or out of greed.",
    sentence: "Rega kufira mafufu segonzo pane zvinhu zvisina basa.",
    english: "Don't perish over trivial matters out of greed."
  },
  {
    num: 153,
    shona: "Kufura maticha nerekeni",
    dudziro: "Kuva nemusikanzwa zvakanyanya; to be very mischievous or rebellious (especially at school).",
    sentence: "Mwana uyu anofura maticha nerekeni, haadzoreki.",
    english: "This child is extremely rebellious and uncontrollable."
  },
  {
    num: 154,
    shona: "Kufuga rake ega",
    dudziro: "Kufa; to die (literally: to cover oneself alone).",
    sentence: "Sekuru vakafuga ravo voga mushure mekurwara kwenguva refu.",
    english: "Grandfather passed away after a long illness."
  },
  {
    num: 155,
    shona: "Kugota moto wembavha",
    dudziro: "Kuwirwa nenhamo nekuda kwekushamwaridzana nevanhu vakaipa; to get into trouble by associating with bad people.",
    sentence: "Ndakazogota moto wembavha nekufamba naTino.",
    english: "I ended up in trouble because of my association with Tino."
  },
  {
    num: 156,
    shona: "Kukanda nhano",
    dudziro: "Kufambira mberi kana kukurumidza; to make progress or move fast.",
    sentence: "Misha yava kukanda nhano nekuda kwechirongwa chitsva ichi.",
    english: "Homes are making progress thanks to this new program."
  },
  {
    num: 157,
    shona: "Kukohwa pamusakarima",
    dudziro: "Kuunza mufaro kana pfuma pasina kushanda; to reap where one did not sow.",
    sentence: "Anoda kukohwa pamusakarima, usimbe huchamuuraya.",
    english: "He wants to reap where he didn't sow; laziness will be his downfall."
  },
  {
    num: 158,
    shona: "Kukuvarira mukati",
    dudziro: "Kutambura mupfungwa usingaudzi vamwe; to suffer in silence or internalize pain.",
    sentence: "Akakuvarira mukati nekuda kwekushaya kwevana vake.",
    english: "He suffered in silence over the loss of his children."
  },
  {
    num: 159,
    shona: "Kukwenya mhunho",
    dudziro: "Kuratidza kana kunongedza chinhu nenzira yekuhwandira; to hint at something or tease.",
    sentence: "Regai kundikwenya mhunho, taurai pachena zviri kudiwa.",
    english: "Don't tease or drop hints; speak clearly about what is needed."
  },
  {
    num: 160,
    shona: "Kukwinya nguo",
    dudziro: "Kuzvigadzirira kuita basa guru kana kurwa; to gird one's loins or prepare for hard work/fight.",
    sentence: "Vakakwinya nguo vachigadzirira nguva yekukohwa.",
    english: "They prepared themselves for the harvest season."
  },
  {
    num: 161,
    shona: "Kumazivandadzoka",
    dudziro: "Panzvimbo ine njodzi huru zvekuti unogona kusadzoka; a very dangerous place.",
    sentence: "Hondo yaiva kumazivandadzoka, vazhinji vakafira ikoko.",
    english: "The war was a point of no return; many died there."
  },
  {
    num: 162,
    shona: "Kumera manhenga",
    dudziro: "Kutanga kuzvidada kana kuva nemapapiro; to become proud or arrogant.",
    sentence: "Kubva zvaakawana mari, akabva amera manhenga.",
    english: "Since he got money, he has become very arrogant."
  },
  {
    num: 163,
    shona: "Kumera zenze",
    dudziro: "Kuva nepfungwa dzekuzvidada kana kusateerera; to be defiant or proud.",
    sentence: "Mwana uyu amera zenze haridi kutumwa.",
    english: "This child has become defiant and doesn't want to be sent on errands."
  },
  {
    num: 164,
    shona: "Kunen'ena meno",
    dudziro: "Kunyemwerera nenzira yekunyengedza kana yekutsamwa; to smile falsely or show teeth in anger.",
    sentence: "Akaunanzira meno achiedza kuratidza kufara asi ane hasha.",
    english: "He smiled falsely, trying to look happy while he was angry."
  },
  {
    num: 165,
    shona: "Kungwarira paduri sehuku",
    dudziro: "Kungwarira chete kana paine mufaro kana zvekudya; to be alert only for selfish gain/food.",
    sentence: "Shamwari dzako dzinongwarira paduri sehuku.",
    english: "Your friends are only around when there is something to gain (food)."
  },
  {
    num: 166,
    shona: "Kunyima sechapungu",
    dudziro: "Kuomera zvakanyanya; to be extremely stingy.",
    sentence: "Murume uyo anonyima sechapungu, haapi kana nherera.",
    english: "That man is extremely stingy; he doesn't even give to orphans."
  },
  {
    num: 167,
    shona: "Kuoma mate mukanwa",
    dudziro: "Kuva nenyota huru kana kuvhunduka zvakaipisisa; to be very thirsty or terrified.",
    sentence: "Ndakaoma mate mukanwa nekuvhunduswa nemheni.",
    english: "I was terrified and my mouth went dry from the thunderbolt."
  },
  {
    num: 168,
    shona: "Kuoma musoro sedemhe rekamba",
    dudziro: "Kusateerera zvachose; to be exceptionally stubborn.",
    sentence: "Mwana wenyu akaoma musoro sedemhe rekamba.",
    english: "Your child is as stubborn as a tortoise shell."
  },
  {
    num: 169,
    shona: "Kuora mwoyo",
    dudziro: "Kupererwa netariro kana kusuwa zvikuru; to be discouraged or heartbroken.",
    sentence: "Akaora mwoyo paakaona goho rake raparadzwa nemombe.",
    english: "He was discouraged when he saw his harvest destroyed by cattle."
  },
  {
    num: 170,
    shona: "Kupenya semheni",
    dudziro: "Kuva neungwaru huri pamusoro; to be very bright or intelligent.",
    sentence: "Muzukuru wake anopenya semheni muzvidzidzo zvose.",
    english: "His nephew is brilliant in all his studies."
  },
  {
    num: 171,
    shona: "Kurova bere nemisana",
    dudziro: "Kuita chinhu chisingatombokarirwi kana cheushingi hukuru; to do something brave or impossible.",
    sentence: "Kutema shumba neruoko kurova bere nemisana.",
    english: "Attacking a lion with bare hands is a feat of great bravery."
  },
  {
    num: 172,
    shona: "Kusava nemukanwa",
    dudziro: "Kuva munhu munyoro asingapopoteri vamwe; to be humble and soft-spoken.",
    sentence: "Musikana uyo haana mukanwa, anongoteerera zvose.",
    english: "That girl is very humble and soft-spoken; she just listens."
  },
  {
    num: 173,
    shona: "Kutura mafemo",
    dudziro: "Kuzorora mushure mekuita basa kana dambudziko; to sigh with relief or rest after a struggle.",
    sentence: "Takazotura mafemo mushure mekupedza bvunzo.",
    english: "We finally sighed with relief after finishing the exams."
  },
  {
    num: 174,
    shona: "Kutwasanudza makumbo",
    dudziro: "Kufamba-famba uchizorora kana kufa; to go for a walk or to die.",
    sentence: "Sekuru vabuda kunotwasanudza makumbo panze.",
    english: "Grandfather has gone outside to stretch his legs (walk)."
  },
  {
    num: 175,
    shona: "Kuva nemwoyo mutete",
    dudziro: "Kukurumidza kusuwa kana kuva nemoyo weunhu; to be sensitive or easily moved to emotion.",
    sentence: "Mai vake vane mwoyo mutete, vanochema nekukurumidza.",
    english: "His mother is very sensitive; she cries easily."
  },
  {
    num: 176,
    shona: "Kuzvionera pamhuno sefodya",
    dudziro: "Kuona chinhu iwe pachenyu kana kuwirwa nenhamo zviri pedyo; to experience something firsthand or suffer consequences.",
    sentence: "Ndakazvionera pamhuno sefodya kuti dhorobha rakaoma.",
    english: "I experienced firsthand that city life is tough."
  },
  {
    num: 177,
    shona: "Kuda zvinoputsa matenga",
    dudziro: "Kuva nezvishuwo zvisingakwanisiki; to have impossible or overly ambitious desires.",
    sentence: "Mwana uyu anoda zvinoputsa matenga achiri mudiki kudai.",
    english: "This child has impossible ambitions at such a young age."
  },
  {
    num: 178,
    shona: "Moyo uchidzimba semoto",
    dudziro: "Kutsamwa kana kurwadziwa mupfungwa kwazvo; to be deeply pained or fuming.",
    sentence: "Moyo wangu unodzimba semoto kana ndichifunga zvawakaita.",
    english: "My heart burns with pain when I think about what you did."
  },
  {
    num: 179,
    shona: "Kubata denga",
    dudziro: "Kufara zvisingaiti; to be extremely happy or on top of the world.",
    sentence: "Akabata denga paakanzwa kuti adyiwa mari muvhiri.",
    english: "He was on top of the world when he heard he won the lottery."
  },
  {
    num: 180,
    shona: "Kudzima moto wapfutidza",
    dudziro: "Kugadzirisa kukanganisa kwawakaita wega; to undo a problem you caused yourself.",
    sentence: "Iye zvino ava kuedza kudzima moto waakafutidza mumhuri.",
    english: "Now he is trying to fix the trouble he caused in the family."
  },
  {
    num: 181,
    shona: "Kunyevenutsa mwoyo",
    dudziro: "Kuderedza hasha dzemunhu; to calm someone down or soften their heart.",
    sentence: "Zvapupu zvakakwanisa kunyevenutsa mwoyo wemurume ainge akatsamwa.",
    english: "The witnesses managed to calm the angry man down."
  },
  {
    num: 182,
    shona: "Kunge achapinda pasi",
    dudziro: "Kunyara zvakanyanya; to be extremely ashamed.",
    sentence: "Musikana uya ainge achida kupinda pasi nekunyara payakabatwa achiba.",
    english: "The girl wanted to sink into the ground with shame when she was caught stealing."
  },
  {
    num: 183,
    shona: "Kuva rombe remunzara",
    dudziro: "Kuva munhu anotambura mupfuma; to be poor despite being surrounded by wealth.",
    sentence: "Mwana wamambo aiva rombe remunzara mubhazi.",
    english: "The chief's son was poor and struggling despite his background."
  },
  {
    num: 184,
    shona: "Kuva mudenga rechinomwe",
    dudziro: "Kufara zvakanyanya; to be in seventh heaven (extremely happy).",
    sentence: "Vachangowana vana vaiva mudenga rechinomwe.",
    english: "The new parents were in seventh heaven."
  },
  {
    num: 185,
    shona: "Kuita ushamwari hwomukombe nechirongo",
    dudziro: "Kuva shamwari dzinofamba dzose nguva dzose; to be inseparable friends.",
    sentence: "Tinashe naJohn vaiita ushamwari hwomukombe nechirongo.",
    english: "Tinashe and John were inseparable friends."
  },
  {
    num: 186,
    shona: "Kushaya chokubata",
    dudziro: "Kupererwa nepfungwa dzekuita; to be confused or at a loss.",
    sentence: "Akatoshaya chokubata payakatsva imba yake.",
    english: "He was at a total loss when his house burnt down."
  },
  {
    num: 187,
    shona: "Kuita chidoko chapinda",
    dudziro: "Kuita pfungwa kana kunzwa mumuviri kuti pane chichaitika; to have a premonition or gut feeling.",
    sentence: "Ndakaita chidoko chapinda ndikabva ndadzoka kumba.",
    english: "I had a gut feeling and immediately returned home."
  },
  {
    num: 188,
    shona: "Kutamba chapamusoro",
    dudziro: "Kuita zvinhu usina kunyatsogadzirira kana usina udzamu; to be superficial or unprepared.",
    sentence: "Rega kutamba chapamusoro, basa iri rinoda pfungwa.",
    english: "Don't be superficial; this job requires serious thinking."
  },
  {
    num: 189,
    shona: "Kuita pfungwa yechinomwe",
    dudziro: "Kuwana zano rinoshamisa kana renguva yekupedzisira; to have a clever or last-minute idea.",
    sentence: "Akazoita pfungwa yechinomwe akabudirira parwendo rwacho.",
    english: "He came up with a clever idea at the last minute and succeeded."
  },
  {
    num: 190,
    shona: "Kugarira guyo sembwa",
    dudziro: "Kumirira rubatsiro nemoyo murefu pane mumwe munhu; to wait patiently for leftovers or help.",
    sentence: "Anongogarira guyo sembwa kumirira mari dzehama.",
    english: "He just waits patiently (like a dog by a grinding stone) for money from relatives."
  },
  {
    num: 191,
    shona: "Kunhonga nemarara ose",
    dudziro: "Kutora chinhu nemutowo usingasarudzi; to take everything, including the bad.",
    sentence: "Akatora mukadzi iyeye akamunhonga nemarara ose.",
    english: "He took that woman along with all her baggage/flaws."
  },
  {
    num: 192,
    shona: "Kuita tsvimbo nechirongo",
    dudziro: "Kufamba pamwe chete; to be constant companions.",
    sentence: "Vakaramba vari tsvimbo nechirongo kusvika pakufa kwavo.",
    english: "They remained constant companions until their death."
  },
  {
    num: 193,
    shona: "Kudyira pfinhi",
    dudziro: "Kudya nekukurumidza nekuda kwekutya kupedzerwa; to eat hastily and greedily.",
    sentence: "Vana vanodyira pfinhi kana vakapiwa masi.",
    english: "The children eat greedily and fast when given treats."
  },
  {
    num: 194,
    shona: "Kudya mupinyi",
    dudziro: "Kudya zvinhu zvakaoma kana kutambura; to struggle or endure hardship.",
    sentence: "Takatodya mupinyi gore rakapera nekuda kwekushaya mvura.",
    english: "We really struggled last year because of the drought."
  },
  {
    num: 195,
    shona: "Kuva nezino",
    dudziro: "Kuva neutsinye kana kugara wakashata; to be mean-spirited or cruel.",
    sentence: "Murume uyo ane zino, haada kuona vamwe vachifara.",
    english: "That man is mean-spirited; he doesn't want to see others happy."
  },
  {
    num: 196,
    shona: "Kurova nhire",
    dudziro: "Kuita chinhu chisingatombokarirwi; to do something extraordinary or impossible.",
    sentence: "Kukunda timu iyi kurova nhire chaiko.",
    english: "Beating this team is an extraordinary achievement."
  },
  {
    num: 197,
    shona: "Kubata shaya",
    dudziro: "Kushamiswa kwazvo; to be completely amazed or astonished.",
    sentence: "Takabata shaya nekurima kwaakaita munda uyu ari oga.",
    english: "We were astonished by how he tilled this whole field alone."
  },
  {
    num: 198,
    shona: "Kurova bere nemisana",
    dudziro: "Kuita zvinhu zvakaoma kwazvo; to perform very difficult tasks.",
    sentence: "Kuvaka imba huru kudai kurova bere nemisana.",
    english: "Building such a big house is a very difficult task."
  },
  {
    num: 199,
    shona: "Kuva nematama",
    dudziro: "Kuva nemakuhwa; to be a gossip monger.",
    sentence: "Chenjera naye, mwana uyu ane matama.",
    english: "Be careful with her; this girl is a gossip."
  },
  {
    num: 200,
    shona: "Kusvitsa kumagumo",
    dudziro: "Kupedza basa rawakatanga; to complete what you started.",
    sentence: "Tinofanira kusvitsa basa iri kumagumo nhasi.",
    english: "We must complete this task today."
  },
  {
    num: 201,
    shona: "Kuona pfuti yemvura",
    dudziro: "Kuwirwa nenhamo huru kana kufa; to experience great trouble or death.",
    sentence: "Vakange vaona pfuti yemvura pavakarasika musango muna mupandira.",
    english: "They faced great peril when they got lost in the forest during the cold season."
  },
  {
    num: 202,
    shona: "Kubata maoko",
    dudziro: "Kunyaradza vanenge vafirwa; to offer condolences to the bereaved.",
    sentence: "Musha wose wakaenda kunobata maoko kwaVaMoyo.",
    english: "The whole village went to offer condolences at the Moyo homestead."
  },
  {
    num: 203,
    shona: "Kudya mazvokuda",
    dudziro: "Kuwirwa nematambudziko awakazvikokera; to suffer self-inflicted consequences.",
    sentence: "Rega kuchema, uri kudya mazvokuda nekusateerera vabereki.",
    english: "Stop crying; you are suffering the consequences of your own choices by not listening to your parents."
  },
  {
    num: 204,
    shona: "Kufamba mudenga",
    dudziro: "Kufara zvakanyanya; to be extremely happy/walking on air.",
    sentence: "Kubva zvaakawana bhengi, ari kungofamba mudenga.",
    english: "Since he got a scholarship, he has been walking on air."
  },
  {
    num: 205,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Sekuru vakarova pasi nezuro manheru.",
    english: "Grandfather passed away yesterday evening."
  },
  {
    num: 206,
    shona: "Kutsenga makuhwa",
    dudziro: "Kutaura zvisina chokwadi nezvevamwe; to engage in gossip.",
    sentence: "Vakadzi avo vanopedza zuva rose vachitsenga makuhwa.",
    english: "Those women spend the whole day gossiping."
  },
  {
    num: 207,
    shona: "Kudya pfuma yenhaka",
    dudziro: "Kushandisa pfuma yakasiiwa nemufi; to use inherited wealth.",
    sentence: "Mwana uyu ari kudya pfuma yenhaka zvisina maturo.",
    english: "This child is wasting the inherited wealth recklessly."
  },
  {
    num: 208,
    shona: "Kuva neganyazeza",
    dudziro: "Kuva munhu anodada nekuzviratidza; to be showy or boastful.",
    sentence: "Rega kuita ganyazeza nehembe dzevamwe.",
    english: "Stop being showy with other people's clothes."
  },
  {
    num: 209,
    shona: "Kurova shumba",
    dudziro: "Kudhakwa zvakanyanya; to be very drunk.",
    sentence: "Tinashe akarova shumba zvekutadza kufamba mumba muno.",
    english: "Tinashe got so drunk he couldn't walk in this house."
  },
  {
    num: 210,
    shona: "Kuita maziso maviri",
    dudziro: "Kungwarira zvakanyanya; to be very watchful/alert.",
    sentence: "Panyaya dzeuchuru, munhu unofanira kuita maziso maviri.",
    english: "When it comes to business, one must be very alert."
  },
  {
    num: 211,
    shona: "Kupisa mutsvairo",
    dudziro: "Kuva munhu mutsva panzvimbo anoda kushanda nesimba; to be a 'new broom' (hardworking new arrival).",
    sentence: "Muroora mutsva ari kupisa mutsvairo pamusha pano.",
    english: "The new daughter-in-law is working very hard at this homestead."
  },
  {
    num: 212,
    shona: "Kufira mudariro",
    dudziro: "Kufa uchiita chinhu chaunoda kana basa rako; to die doing what you love or on duty.",
    sentence: "Mudzidzisi uyu akafira mudariro ari kudzidzisa vana.",
    english: "This teacher died while on duty teaching the children."
  },
  {
    num: 213,
    shona: "Kutora mudzimu",
    dudziro: "Kufa; to die (referring to the spirit joining ancestors).",
    sentence: "Mambo wedu akatorwa nemudzimu mushure mekurwara.",
    english: "Our king passed away after an illness."
  },
  {
    num: 214,
    shona: "Kudya nemuromo wepfuti",
    dudziro: "Kumanikidzwa kuita chinhu usina kusununguka; to be forced to do something under duress.",
    sentence: "Vanhu vairarama nekudya nemuromo wepfuti panguva yehondo.",
    english: "People lived under duress during the time of war."
  },
  {
    num: 215,
    shona: "Kupfeka ngetani",
    dudziro: "Kusungwa nemapurisa; to be arrested or put in chains.",
    sentence: "Mbavha yakazopfeka ngetani mushure mekubira chitoro.",
    english: "The thief was eventually arrested after robbing the shop."
  },
  {
    num: 216,
    shona: "Kuzunza muviri",
    dudziro: "Kutamba nziyo kana mhanzi; to dance.",
    sentence: "Vechidiki vari kuzunza muviri kumberi uko.",
    english: "The youth are dancing over there."
  },
  {
    num: 217,
    shona: "Kusvitsa kure",
    dudziro: "Kuita chinhu chinokubatsira mune ramangwana; to do something that benefits you in the long run.",
    sentence: "Dzidzo ichakusvitsa kure muupenyu.",
    english: "Education will take you far in life."
  },
  {
    num: 218,
    shona: "Kurova nhindi",
    dudziro: "Kunyora kana kutaura zvinhu zvine musoro; to write or say something substantial/important.",
    sentence: "Mudzidzi uyu akarova nhindi mubvunzo dzake.",
    english: "This student wrote substantial points in his exams."
  },
  {
    num: 219,
    shona: "Kuita huni nepfuti",
    dudziro: "Kurwa kana kupopotedzana zvakanyanya; to be at loggerheads or fighting.",
    sentence: "Vavakidzani avo vanoita huni nepfuti mazuva ose.",
    english: "Those neighbors are always at loggerheads."
  },
  {
    num: 220,
    shona: "Kudya hupenyu",
    dudziro: "Kunwa doro nekutamba; to enjoy life/party.",
    sentence: "Varume avo vari kudya hupenyu mubhawa.",
    english: "Those men are enjoying life in the bar."
  },
  {
    num: 221,
    shona: "Kutsika pasi",
    dudziro: "Kusvika panzvimbo; to arrive at a destination.",
    sentence: "Ndichangotsika pasi muHarare ndichakufonera.",
    english: "As soon as I arrive in Harare, I will call you."
  },
  {
    num: 222,
    shona: "Kudonha mudziva",
    dudziro: "Kuwira mumatambudziko awakashaya mhinduro; to fall into a problem you can't solve.",
    sentence: "Akadonha mudziva panyaya yehuori yaakapomerwa.",
    english: "He fell into deep trouble regarding the corruption allegations he faced."
  },
  {
    num: 223,
    shona: "Kupisa mwoyo",
    dudziro: "Kushuva chinhu kwazvo; to desire something intensely.",
    sentence: "Musikana uyu anondipisa mwoyo, ndinoda kumuroora.",
    english: "This girl makes my heart burn (with desire); I want to marry her."
  },
  {
    num: 224,
    shona: "Kugara pamuromo",
    dudziro: "Kugara wakagadzirira kutaura kana kupindura; to be ready to speak or answer back.",
    sentence: "Mwana uyu anogara pamuromo, haadi kutaurirwa.",
    english: "This child is quick to talk back; he doesn't like being corrected."
  },
  {
    num: 225,
    shona: "Kuva negumbo rurefu",
    dudziro: "Kufarira kufamba nzendo dzakawanda; to love traveling.",
    sentence: "Baba vangu vane gumbo rurefu, havagari pamba.",
    english: "My father loves traveling; he doesn't stay at home."
  },
  {
    num: 226,
    shona: "Kurova datu",
    dudziro: "Kudya zvakanyanya; to eat a lot/gorge oneself.",
    sentence: "Takarova datu pamuchato nezuro.",
    english: "We ate a lot at the wedding yesterday."
  },
  {
    num: 227,
    shona: "Kukanda sora mumaziso",
    dudziro: "Kunyengedza munhu kuti asaone chokwadi; to deceive someone or distract them from the truth.",
    sentence: "Usandikande sora mumaziso, ndinoziva chokwadi.",
    english: "Don't deceive me; I know the truth."
  },
  {
    num: 228,
    shona: "Kuva nepfungwa dzekunze",
    dudziro: "Kusateerera zvirikutaurwa nekufunga zvimwe; to be absent-minded or distracted.",
    sentence: "Mudzidzi ane pfungwa dzekunze haagoni kuteerera mudzidzisi.",
    english: "A distracted student cannot listen to the teacher."
  },
  {
    num: 229,
    shona: "Kukweva mweya",
    dudziro: "Kufema kana kupona; to breathe or survive.",
    sentence: "Mugonhi achiri kukweva mweya, haasati afa.",
    english: "The patient is still breathing; he hasn't died yet."
  },
  {
    num: 230,
    shona: "Kurova chiporo",
    dudziro: "Kushanda nesimba; to work very hard.",
    sentence: "Tinofanira kurova chiporo kuti tipedze kuvaka imba ino.",
    english: "We must work hard to finish building this house."
  },
  {
    num: 231,
    shona: "Kudya nemeso",
    dudziro: "Kutarisa chinhu chaunoyemura asi chausingakwanisi kuwana; to admire with the eyes but not possess.",
    sentence: "Tiri kungodya nemeso motokari iyoyo inodhura.",
    english: "We are just admiring that expensive car with our eyes."
  },
  {
    num: 232,
    shona: "Kusviba mukanwa",
    dudziro: "Kuva nenyota; to be thirsty.",
    sentence: "Ndichangopedza kumhanya, ndasviba mukanwa.",
    english: "I just finished running and I am very thirsty."
  },
  {
    num: 233,
    shona: "Kupihwa doro remahara",
    dudziro: "Kunyengedzwa nemashoko anotapira; to be deceived by sweet talk.",
    sentence: "Mwanasikana uyu akapihwa doro remahara nemukomana uyu.",
    english: "This girl was deceived by this boy's sweet talk."
  },
  {
    num: 234,
    shona: "Kuita rurimi nemukanwa",
    dudziro: "Kuva shamwari dzepedyo dzinonzwanana; to be very close friends.",
    sentence: "Vaviri avo vanoita rurimi nemukanwa.",
    english: "Those two are very close friends."
  },
  {
    num: 235,
    shona: "Kudya mhodzi dzemanhanga",
    dudziro: "Kutaura mashoko anorwadza; to speak hurtful words.",
    sentence: "Usandidyire mhodzi dzemanhanga, taura zvakanaka.",
    english: "Don't say hurtful words to me; speak kindly."
  },
  {
    num: 236,
    shona: "Kurova mutumbi pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Sekuru vakarova mutumbi pasi mushure mekurwara.",
    english: "Grandfather passed away after an illness."
  },
  {
    num: 237,
    shona: "Kusimudza musoro",
    dudziro: "Kutanga kuzvidada kana kuzvitutumadza; to become proud/arrogant.",
    sentence: "Kubva zvaakawana mari, akatanga kusimudza musoro.",
    english: "Since he got money, he started becoming arrogant."
  },
  {
    num: 238,
    shona: "Kuva nehasha dzembwa",
    dudziro: "Kuva nehasha dzinoonekwa nekukasira dzinopfuura; to have a quick but short-lived temper.",
    sentence: "Baba vane hasha dzembwa, vanokanganwa nekukasira.",
    english: "Father has a quick temper, but he forgets quickly."
  },
  {
    num: 239,
    shona: "Kudya magaka nemunyu",
    dudziro: "Kuva mumatambudziko kana muhurombo; to live in poverty or hardship.",
    sentence: "Kubva zvakafa vabereki vake, mwana uyu ava kudya magaka nemunyu.",
    english: "Since his parents died, this child has been living in poverty."
  },
  {
    num: 240,
    shona: "Kurova nhunduma",
    dudziro: "Kuva munhu ane rurimi rwekutaura; to be eloquent or talkative.",
    sentence: "Mukomana uyu anorova nhunduma kana achitaura nevanasikana.",
    english: "This boy is very eloquent when talking to girls."
  },
  {
    num: 241,
    shona: "Kuchemera pasi",
    dudziro: "Kusuwa zvakanyanya usingatauri; to grieve silently.",
    sentence: "Mai vari kuchemera pasi nekuda kwemwana akarasika.",
    english: "Mother is grieving silently for her lost child."
  },
  {
    num: 242,
    shona: "Kudya mari",
    dudziro: "Kushandisa mari zvisina maturo; to waste money.",
    sentence: "Rega kudya mari yetuition mubhawa.",
    english: "Stop wasting tuition money in the bar."
  },
  {
    num: 243,
    shona: "Kuva nemhino inonzwa",
    dudziro: "Kuva nemakuhwa kana kukurumidza kuziva zvinhu; to be the first to know secrets/gossip.",
    sentence: "Mai Chipo vane mhino inonzwa, vanoziva zvose zviri kuitika mumusha.",
    english: "Mrs. Chipo always knows the latest gossip in the village."
  },
  {
    num: 244,
    shona: "Kukanda makumbo",
    dudziro: "Kufamba rwendo rurefu; to travel a long distance on foot.",
    sentence: "Takakanda makumbo kubva kwaMutare kusvika kwaRusape.",
    english: "We walked a long distance from Mutare to Rusape."
  },
  {
    num: 245,
    shona: "Kuva nenzeve dzakananzwa nembwa",
    dudziro: "Kusateerera zvaunoudzwa; to be disobedient.",
    sentence: "Mwana uyu ane nzeve dzakananzwa nembwa, haanzwi tsiuro.",
    english: "This child is very disobedient; he doesn't listen to advice."
  },
  {
    num: 246,
    shona: "Kurova mwoyo",
    dudziro: "Kuva neshungu; to be bitter or grieving deeply.",
    sentence: "Akarova mwoyo paakaziva kuti shamwari yake yamubira.",
    english: "He was bitter when he found out his friend had stolen from him."
  },
  {
    num: 247,
    shona: "Kudya nemuromo mumwe",
    dudziro: "Kubvumirana panyaya imwechete; to be in agreement.",
    sentence: "Mhuri yose yakadya nemuromo mumwe panyaya yemunda.",
    english: "The whole family agreed on the land issue."
  },
  {
    num: 248,
    shona: "Kupfeka dehwe reshumba",
    dudziro: "Kuzviita munhu ane simba kana ushingi iwe usina; to pretend to be brave or powerful.",
    sentence: "Usazviita mhare, uri kupfeka dehwe reshumba.",
    english: "Don't pretend to be a hero; you are just acting brave."
  },
  {
    num: 249,
    shona: "Kurova pasi nehana",
    dudziro: "Kutyisa kana kuvhunduka zvikuru; to be terrified.",
    sentence: "Ndakarova pasi nehana pandakaona nyoka muimba mangu.",
    english: "I was terrified when I saw a snake in my room."
  },
  {
    num: 250,
    shona: "Kuva nemusoro wakaoma",
    dudziro: "Kusateerera; to be stubborn.",
    sentence: "Mwana uyu ane musoro wakaoma, haateereri vadzidzisi.",
    english: "This child is stubborn; he doesn't listen to teachers."
  },
  {
    num: 251,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya; to sleep too much/oversleep.",
    sentence: "Rega kudya hope uchifanira kunge uri kubasa.",
    english: "Stop oversleeping when you should be at work."
  },
  {
    num: 252,
    shona: "Kucheka makumbo",
    dudziro: "Kushanyira munhu kazhinji; to visit someone frequently.",
    sentence: "Mukomana uyu ari kucheka makumbo kumba kwasekuru.",
    english: "This boy is frequently visiting grandfather's house."
  },
  {
    num: 253,
    shona: "Kuva neruoko runobatsira",
    dudziro: "Kuva munhu ane rupo; to be generous/helpful.",
    sentence: "Mai vangu vane ruoko runobatsira nherera.",
    english: "My mother is very generous to orphans."
  },
  {
    num: 254,
    shona: "Kurova dumbu",
    dudziro: "Kuguta zvakanyanya; to be very full after eating.",
    sentence: "Takapedza kurova dumbu pamabiko aVaMoyo.",
    english: "We were very full after the Moyo's feast."
  },
  {
    num: 255,
    shona: "Kudya marara",
    dudziro: "Kutaura zvisina musoro kana zvakaipa; to talk nonsense or use foul language.",
    sentence: "Murume uyu ari kudya marara pamberi pevana.",
    english: "This man is talking nonsense in front of children."
  },
  {
    num: 256,
    shona: "Kupinda nemukanwa",
    dudziro: "Kunyengedzwa nemashoko; to be deceived by words.",
    sentence: "Musikana uyu akapinda nemukanwa ndokuzvitakura.",
    english: "This girl was deceived by words and got pregnant."
  },
  {
    num: 257,
    shona: "Kuva nemhino rurefu",
    dudziro: "Kudada kana kuzvitutumadza; to be proud/arrogant.",
    sentence: "Kubva zvaakatenga motokari, ane mhino rurefu.",
    english: "Since he bought a car, he has become very arrogant."
  },
  {
    num: 258,
    shona: "Kurova nhindi",
    dudziro: "Kutaura zvinonzwisisika kana chokwadi; to speak sense or the truth.",
    sentence: "Sabhuku akarova nhindi panyaya yekubiwa kwemombe.",
    english: "The headman spoke sense regarding the cattle theft."
  },
  {
    num: 259,
    shona: "Kudya hura",
    dudziro: "Kunyengera; to betray.",
    sentence: "Shamwari yangu yakandidya hura payakataura zvangu kumupurisa.",
    english: "My friend betrayed me when he told the police my secrets."
  },
  {
    num: 260,
    shona: "Kuzvidya mwoyo",
    dudziro: "Kunetseka mupfungwa; to worry or be anxious.",
    sentence: "Mai vari kuzvidya mwoyo nekuda kwemwanakomana wavo ari mutirongo.",
    english: "Mother is worrying about her son who is in prison."
  },
  {
    num: 261,
    shona: "Kukweva dumbu",
    dudziro: "Kuve nenzara huru; to be very hungry.",
    sentence: "Tiri kukweva dumbu kubva mangwanani.",
    english: "We have been very hungry since morning."
  },
  {
    num: 262,
    shona: "Kuva nenzeve dzakaoma",
    dudziro: "Kusateerera; to be deaf to advice/stubborn.",
    sentence: "Mwana uyu ane nzeve dzakaoma, haanzwi tsiuro dzevabereki.",
    english: "This child is stubborn; he doesn't listen to parental advice."
  },
  {
    num: 263,
    shona: "Kurova nhare",
    dudziro: "Kufonera munhu; to make a phone call.",
    sentence: "Ndirikuda kurova nhare kumusha nhasi.",
    english: "I want to call home today."
  },
  {
    num: 264,
    shona: "Kudya sipo",
    dudziro: "Kusawana chawakanga uchitarisira; to be disappointed or fail to get something.",
    sentence: "Ndakadya sipo pandakaenda kundoona musikana uya asipo.",
    english: "I was disappointed when I went to see that girl and she wasn't there."
  },
  {
    num: 265,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Mbuya vakarova pasi nemusi weMugovera.",
    english: "Grandmother passed away on Saturday."
  },
  {
    num: 266,
    shona: "Kuva nemukanwa unotapira",
    dudziro: "Kuva munhu anoziva kunyengetedza vamwe; to be persuasive/sweet-talker.",
    sentence: "Tinashe ane mukanwa unotapira, anowanza vanasikana vose.",
    english: "Tinashe is a sweet-talker; he charms all the girls."
  },
  {
    num: 267,
    shona: "Kudya nemuromo",
    dudziro: "Kutaura mashoko pasina zviito; to talk without taking action.",
    sentence: "Vanoita zvekuita, vari kungodya nemuromo chete.",
    english: "They are all talk and no action."
  },
  {
    num: 268,
    shona: "Kupfeka gumbo",
    dudziro: "Kumhanya zvakanyanya; to run very fast.",
    sentence: "Mbavha yakabva yapfeka gumbo payakaona mupurisa.",
    english: "The thief ran away very fast when he saw the policeman."
  },
  {
    num: 269,
    shona: "Kurova pasi nemuromo",
    dudziro: "Kutaura manyepo; to tell lies.",
    sentence: "Rega kurova pasi nemuromo, tese tinoziva chokwadi.",
    english: "Stop telling lies; we all know the truth."
  },
  {
    num: 270,
    shona: "Kuva nenzeve dzekurota",
    dudziro: "Kuteerera zvinhu zvisipo kana manyepo; to believe fantasies or lies.",
    sentence: "Ane nzeve dzekurota murume uyu, anotenda zvose zvaanoudzwa.",
    english: "This man believes everything he's told, no matter how unbelievable."
  },
  {
    num: 271,
    shona: "Kudya mari yechembere",
    dudziro: "Kubira munhu asina simba; to rob/cheat a defenseless person.",
    sentence: "Kudya mari yechembere kutuka mudzimu.",
    english: "Cheating an old woman is like cursing the ancestors."
  },
  {
    num: 272,
    shona: "Kupfeka maziso mumaoko",
    dudziro: "Kusangwarira paunenge uchishanda; to be careless while working.",
    sentence: "Rega kupfeka maziso mumaoko, ungazvikuvarisa.",
    english: "Don't be careless while working; you might hurt yourself."
  },
  {
    num: 273,
    shona: "Kurova nhindi nhete",
    dudziro: "Kuita chinhu chidiki; to do something minor/small.",
    sentence: "Ndangorova nhindi nhete pakushanda kwangu nhasi.",
    english: "I only did a small amount of work today."
  },
  {
    num: 274,
    shona: "Kuva neruoko runorova",
    dudziro: "Kuva netsika yekurova vamwe; to be physically aggressive/prone to hitting.",
    sentence: "Sekuru vane ruoko runorova, usatambe navo.",
    english: "Grandfather is prone to hitting people; don't play with him."
  },
  {
    num: 275,
    shona: "Kudya zvasara",
    dudziro: "Kutora chinhu chakasiyiwa nevamwe; to take leftovers/what others rejected.",
    sentence: "Tiri kungodya zvasara kubva kuvapfumi.",
    english: "We are just living on what the wealthy have left behind."
  },
  {
    num: 276,
    shona: "Kurova huni",
    dudziro: "Kutsvaga huni dzekubikisa; to gather firewood.",
    sentence: "Vakadzi vaenda kunorova huni musango.",
    english: "The women have gone to gather firewood in the forest."
  },
  {
    num: 277,
    shona: "Kuva nemhino isinganzwi",
    dudziro: "Kusakurumidza kuziva zviri kuitika; to be out of the loop/last to know.",
    sentence: "Sekuru vane mhino isinganzwi, havazivi kuti vabirwa.",
    english: "Grandfather is clueless; he doesn't even know he's been robbed."
  },
  {
    num: 278,
    shona: "Kupisa rutsoka",
    dudziro: "Kufamba rwendo rurefu; to travel a long distance.",
    sentence: "Tiri kupisa rutsoka kuti tisvike dhorobha mambakwedza.",
    english: "We are walking a long way to reach the city by dawn."
  },
  {
    num: 279,
    shona: "Kurova matumbu",
    dudziro: "Kuguta zvakanyanya; to stuff oneself with food.",
    sentence: "Takapedza kurova matumbu kumuchato wemwanasikana waSabhuku.",
    english: "We stuffed ourselves at the headman's daughter's wedding."
  },
  {
    num: 280,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva munhu akanaka; to be kind-hearted.",
    sentence: "Mbuya vane mwoyo muchena, vanobatsira nherera.",
    english: "Grandmother is kind-hearted; she helps orphans."
  },
  {
    num: 281,
    shona: "Kudya nemuromo munyoro",
    dudziro: "Kutaura zvakanaka kune vamwe; to speak kindly/politely.",
    sentence: "Unofanira kudya nemuromo munyoro kune vakuru.",
    english: "You should speak politely to elders."
  },
  {
    num: 282,
    shona: "Kurova nhindi nhete",
    dudziro: "Kutaura zvinhu zvishoma; to say very little.",
    sentence: "Akarova nhindi nhete mupfungwa dzake.",
    english: "He shared very little of his thoughts."
  },
  {
    num: 283,
    shona: "Kuva nemukanwa wakashata",
    dudziro: "Kuva nemukanwa unotuka kana kutaura zvinogumbura; to have a foul mouth/be rude.",
    sentence: "Musikana uyu ane mukanwa wakashata, anotuka vose.",
    english: "This girl has a foul mouth; she insults everyone."
  },
  {
    num: 284,
    shona: "Kudya marasha",
    dudziro: "Kutsamwa zvakanyanya; to be extremely angry.",
    sentence: "Baba vakadya marasha mushure mekunzwa kuti ndatadza bvunzo.",
    english: "Father was furious after hearing that I failed the exams."
  },
  {
    num: 285,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Vakarova pasi muna mupandira.",
    english: "They passed away in June."
  },
  {
    num: 286,
    shona: "Kuva nenzeve dzinonzwa",
    dudziro: "Kuteerera tsiuro; to be obedient/listen to advice.",
    sentence: "Mwana uyu ane nzeve dzinonzwa, anoteerera vadzidzisi vake.",
    english: "This child is obedient; he listens to his teachers."
  },
  {
    num: 287,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma; to enjoy/spend wealth.",
    sentence: "Mwana wasabhuku ari kudya hupfumi hwekwawo.",
    english: "The headman's son is enjoying his family's wealth."
  },
  {
    num: 288,
    shona: "Kurova bere",
    dudziro: "Kunyengera munhu uchienda; to sneak away/leave without telling.",
    sentence: "Akarova bere mumba macho kwasviba.",
    english: "He snuck away from the house after dark."
  },
  {
    num: 289,
    shona: "Kuva nemusoro muchena",
    dudziro: "Kuchembera; to be old (have white hair).",
    sentence: "Sekuru vane musoro muchena zvino.",
    english: "Grandfather is elderly now (has white hair)."
  },
  {
    num: 290,
    shona: "Kudya nezino rimwe",
    dudziro: "Kuseka uine hasha kana usina mufaro; to smile falsely or while angry.",
    sentence: "Mai vake vari kungodya nezino rimwe chete pamberi pevaenzi.",
    english: "His mother is putting on a fake smile in front of the guests."
  },
  {
    num: 291,
    shona: "Kurova mwoyo",
    dudziro: "Kusuwa zvakanyanya; to be heartbroken.",
    sentence: "Mwoyo wangu unonzi kurova kana ndichifunga nezverufu rwavo.",
    english: "My heart aches when I think of their death."
  },
  {
    num: 292,
    shona: "Kuva nemhino rurefu",
    dudziro: "Kudada; to be snobbish/proud.",
    sentence: "Akaenda kuUK ndokudzoka ave nemhino rurefu.",
    english: "He went to the UK and returned very snobbish."
  },
  {
    num: 293,
    shona: "Kudya nemukanwa",
    dudziro: "Kutaura zvinhu zvausingaiti; to make empty promises.",
    sentence: "Vatungamiri vanodya nemukanwa mazuva emavhoti.",
    english: "Leaders make empty promises during election days."
  },
  {
    num: 294,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do significant work.",
    sentence: "Takarova nhindi huru pakurima munda uyu.",
    english: "We did a significant amount of work tilling this field."
  },
  {
    num: 295,
    shona: "Kuva nemoyo mutete",
    dudziro: "Kukurumidza kusuwa kana kuchema; to be sensitive/easily moved to tears.",
    sentence: "Mai vane moyo mutete, vanochema nebasa rega-rega.",
    english: "Mother is very sensitive; she cries over everything."
  },
  {
    num: 296,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura chinhu chausingagoni kuva nacho; to admire something you cannot afford.",
    sentence: "Ndari kungodya nemeso dhorobha iri.",
    english: "I am just admiring this city with my eyes (without having much)."
  },
  {
    num: 297,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Mambo vakarova pasi mwedzi wakapera.",
    english: "The chief died last month."
  },
  {
    num: 298,
    shona: "Kuva nenzeve dzinonzwa",
    dudziro: "Kuteerera tsiuro dzevabereki; to be obedient to parents.",
    sentence: "Mwana uyo ane nzeve dzinonzwa.",
    english: "That child is obedient."
  },
  {
    num: 299,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya; to oversleep.",
    sentence: "Akadya hope kusvika zuva rabuda.",
    english: "He overslept until sunrise."
  },
  {
    num: 300,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a lot of work.",
    sentence: "Takarova nhindi nekuvaka danga iri.",
    english: "We did a lot of work building this kraal."
  },
  {
    num: 301,
    shona: "Kurova mapipi",
    dudziro: "Kuita manenji kana zvinhu zvinoshamisa; to perform wonders or miracles.",
    sentence: "Muzvinabhizimusi uyu ari kurova mapipi nekupfuma kwaari kuita.",
    english: "This businessman is performing wonders with the way he is getting rich."
  },
  {
    num: 302,
    shona: "Kudya mafuta",
    dudziro: "Kuratidza kuva nemuviri wakanaka nekuda kwekuguta kana kupfuma; to look healthy and well-fed/prosperous.",
    sentence: "Mwana uyu adya mafuta kubva zvaakaenda kumayunivhesiti.",
    english: "This child looks very healthy and prosperous since going to university."
  },
  {
    num: 303,
    shona: "Kuva nengere",
    dudziro: "Kuva nenjere dzekubiridzira kana dzekunyengedza; to be cunning or craftily clever.",
    sentence: "Chenjera naTinashe, ane ngere panyaya dzemari.",
    english: "Be careful with Tinashe; he is very cunning when it comes to money."
  },
  {
    num: 304,
    shona: "Kutsenga fodya",
    dudziro: "Kuve munhu mukuru ane ruzivo kana hasha; to be an elderly, experienced, or grumpy person.",
    sentence: "Sekuru avo vanotsenga fodya, usatambe navo panyaya dzetsika.",
    english: "That old man is very experienced and strict; don't mess with him on cultural matters."
  },
  {
    num: 305,
    shona: "Kupaza doro",
    dudziro: "Kuenda kumabiko edoro usina kukokwa; to gatecrash a beer party.",
    sentence: "Vakomana vepajunction vanofarira kupaza doro revanhu.",
    english: "The boys from the junction love gatecrashing people's beer parties."
  },
  {
    num: 306,
    shona: "Kutsika mheni",
    dudziro: "Kumhanya kana kufamba nekukurumidza kwazvo; to walk or run at lightning speed.",
    sentence: "Ndakatsika mheni kuti ndibate bhazi renguva dzechinomwe.",
    english: "I moved at lightning speed to catch the seven o'clock bus."
  },
  {
    num: 307,
    shona: "Kurova nyama",
    dudziro: "Kudya zvakanaka zvekupfuma; to eat well (meat) as a sign of wealth.",
    sentence: "Mazuva ano tave kurova nyama nekuda kwebasa idzva.",
    english: "These days we are eating very well (meat) because of the new job."
  },
  {
    num: 308,
    shona: "Kucheka zano",
    dudziro: "Kuwana mhinduro pane dambudziko; to devise a plan or find a solution.",
    sentence: "Vabereki vakagara pasi ndokucheka zano rekubhadhara chikoro.",
    english: "The parents sat down and devised a plan to pay the school fees."
  },
  {
    num: 309,
    shona: "Kuva nemuromo wepfuti",
    dudziro: "Kutaura zvakanyanya kana kupopotera vanhu; to be extremely talkative or verbally aggressive.",
    sentence: "Mukadzi uyo ane muromo wepfuti, anopedza musha nekupopota.",
    english: "That woman has a mouth like a gun; she ruins the village with her scolding."
  },
  {
    num: 310,
    shona: "Kuguta masi",
    dudziro: "Kufara zvakanyanya nekuda kwechinhu chakanaka; to be extremely happy/satisfied.",
    sentence: "Ndakaguta masi pandakaona mwanangu achipasa magiredhi ose.",
    english: "I was extremely happy when I saw my child passing all their grades."
  },
  {
    num: 311,
    shona: "Kukanda nhamo",
    dudziro: "Kusiya mararamiro ekutambura; to overcome or cast away poverty/troubles.",
    sentence: "Vakakanda nhamo mushure mekunge mwana wavo atanga basa rekuUK.",
    english: "They overcame their poverty after their child started working in the UK."
  },
  {
    num: 312,
    shona: "Kuva nerunako rwemheni",
    dudziro: "Kuyevedza kwazvo zvekushamisa; to be strikingly beautiful.",
    sentence: "Muroora akauya mumhuri muno ane runako rwemheni.",
    english: "The daughter-in-law who joined this family is strikingly beautiful."
  },
  {
    num: 313,
    shona: "Kurova pasi nezvibhakera",
    dudziro: "Kutsamwa zvakanyanya; to be extremely angry or frustrated.",
    sentence: "Akarova pasi nezvibhakera paakanzwa kuti mari yake yabirwa.",
    english: "He was extremely frustrated and angry when he heard his money was stolen."
  },
  {
    num: 314,
    shona: "Kudya zvenyika",
    dudziro: "Kurarama hupenyu hwekufara nekutamba; to enjoy the worldly pleasures.",
    sentence: "Vachiri vadiki, vari kuda kudya zvenyika vasati varoora.",
    english: "While they are young, they want to enjoy worldly pleasures before they marry."
  },
  {
    num: 315,
    shona: "Kuva nehana inorova",
    dudziro: "Kunetseka mupfungwa nekutya; to be anxious or fearful.",
    sentence: "Ndine hana inorova nekuda kwebvunzo dzirikusvika.",
    english: "I am very anxious because of the upcoming exams."
  },
  {
    num: 316,
    shona: "Kupfeka ngetani",
    dudziro: "Kusungwa nemapurisa; to be arrested/chained.",
    sentence: "Mbavha yakazopfeka ngetani mushure mekutiza kwenguva refu.",
    english: "The thief was finally arrested after being on the run for a long time."
  },
  {
    num: 317,
    shona: "Kutsika dope",
    dudziro: "Kuwira mumatambudziko; to get into trouble.",
    sentence: "Usatsika dope nekuda kwekutevera shamwari dzakaipa.",
    english: "Don't get into trouble by following bad friends."
  },
  {
    num: 318,
    shona: "Kucheka mazuva",
    dudziro: "Kutambisa nguva; to waste days/time.",
    sentence: "Rega kungogara muHarare uchicheka mazuva usina basa.",
    english: "Don't just stay in Harare wasting time without a job."
  },
  {
    num: 319,
    shona: "Kurova dare",
    dudziro: "Kuenda kumusangano wevakuru kana kudare remhosva; to attend a traditional court or high-level meeting.",
    sentence: "Ishe vari kurova dare nhasi vachigadzirisa makakatanwa eminda.",
    english: "The Chief is presiding over the court today settling land disputes."
  },
  {
    num: 320,
    shona: "Kuva neshamhu inorova",
    dudziro: "Kuva munhu anotonga zvakasimba kana anoranga; to be strict or a disciplinarian.",
    sentence: "Baba vake vane shamhu inorova, hapana mwana anoita musikanzwa.",
    english: "His father is a strict disciplinarian; no child misbehaves."
  },
  {
    num: 321,
    shona: "Kudya huku dzevamwe",
    dudziro: "Kuda zvinhu zvevamwe usina kushandira; to depend on or covet others' possessions.",
    sentence: "Rega kudya huku dzevamwe, tsvaga rako basa.",
    english: "Stop coveting others' things; find your own work."
  },
  {
    num: 322,
    shona: "Kurova huni",
    dudziro: "Kutsunhunyidza kana kumanikidza munhu; to pressure or force someone.",
    sentence: "Vakamurova huni kusvika abvuma kuti ndiye akaba.",
    english: "They pressured him until he admitted that he was the one who stole."
  },
  {
    num: 323,
    shona: "Kuva negotsi rine vhudzi",
    dudziro: "Kuva nerombo rakanaka; to be very lucky.",
    sentence: "Ane gotsi rine vhudzi, akawana basa pasina kana chitupa.",
    english: "He is very lucky; he found a job without even having a certificate."
  },
  {
    num: 324,
    shona: "Kutsenga butu",
    dudziro: "Kukundikana pane chawaishuvira; to fail or be disappointed in one's goals.",
    sentence: "Vadzidzi vazhinji vakatsenga butu panyaya yemasvomhu.",
    english: "Many students failed (chewed chaff) in the mathematics exam."
  },
  {
    num: 325,
    shona: "Kurova mhere",
    dudziro: "Kuungudza parufu kana mutsaona; to wail or cry out loudly in distress.",
    sentence: "Musha wose wakarova mhere mutsaona iyoyo yaityisa.",
    english: "The whole village wailed loudly in that terrifying accident."
  },
  {
    num: 326,
    shona: "Kuva nezeve dzinonzwa",
    dudziro: "Kuteerera kune zvinotaurwa; to be attentive or obedient.",
    sentence: "Mwana uyu ane nzeve dzinonzwa, anotora tsiuro dzevabereki.",
    english: "This child is obedient; he takes parental advice to heart."
  },
  {
    num: 327,
    shona: "Kudya nemuromo mumwe",
    dudziro: "Kubvumirana zvakazara; to be in complete agreement.",
    sentence: "Dare rose rakadya nemuromo mumwe kuti mbavha idzingwe mumusha.",
    english: "The whole council agreed unanimously that the thief should be expelled from the village."
  },
  {
    num: 328,
    shona: "Kurova tsvimbo pasi",
    dudziro: "Kutora mutongo wekupedzisira; to make a final decision.",
    sentence: "Baba vakarova tsvimbo pasi kuti hapana mwana anoenda kumutambo.",
    english: "Father made a final decision that no child is going to the party."
  },
  {
    num: 329,
    shona: "Kuva nemusoro muchena",
    dudziro: "Kuchembera kana kuva nechena; to be elderly (literally: to have a white head).",
    sentence: "Sekuru vave nemusoro muchena, vanoda kuremekedzwa.",
    english: "Grandfather is now elderly; he deserves respect."
  },
  {
    num: 330,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya panguva yebasa; to oversleep or be idle during work time.",
    sentence: "Usangodya hope pano, vanhu vari kushanda mumunda.",
    english: "Don't just be idle here while people are working in the field."
  },
  {
    num: 331,
    shona: "Kurova nhindi",
    dudziro: "Kutaura chokwadi chaicho kana zvinangwa; to speak the core truth or address the main point.",
    sentence: "Taurai kurova nhindi, regai kutenderera nenyaya.",
    english: "Speak the core truth; stop beating around the bush."
  },
  {
    num: 332,
    shona: "Kuva nemvura mupfungwa",
    dudziro: "Kusava neungwaru kana kuita zvinhu zveupenzi; to be foolish or slow-witted.",
    sentence: "Murume uyo ane mvura mupfungwa, anoita zvinhu zvisina musoro.",
    english: "That man is foolish; he does things that don't make sense."
  },
  {
    num: 333,
    shona: "Kutsika madziro",
    dudziro: "Kuramba zvakasimba; to refuse or deny adamantly.",
    sentence: "Akatsika madziro achiti haana kumbobvira amuona.",
    english: "He adamantly denied ever having seen him."
  },
  {
    num: 334,
    shona: "Kurova maputi",
    dudziro: "Kutaura ngano kana manyepo; to talk nonsense or tell tall tales.",
    sentence: "Rega kurova maputi, taura zvaunoziva kuti ndechokwadi.",
    english: "Stop telling tall tales; say what you know to be true."
  },
  {
    num: 335,
    shona: "Kuva nemoyo mutete",
    dudziro: "Kukurumidza kusuwa kana kuchema; to be sensitive or easily moved to tears.",
    sentence: "Mai vane moyo mutete, vanochema kana vakaona munhu achitambura.",
    english: "Mother is sensitive; she cries when she sees someone suffering."
  },
  {
    num: 336,
    shona: "Kudya sadza nebadza",
    dudziro: "Kushanda nesimba zvikuru; to work very hard (literally: to eat porridge with a hoe).",
    sentence: "Mhuri yekwaMoyo inodya sadza nebadza, ndosaka vaine goho guru.",
    english: "The Moyo family works very hard; that's why they have a huge harvest."
  },
  {
    num: 337,
    shona: "Kurova pasi nehana",
    dudziro: "Kuvhunduka kana kutya zvakanyanya; to be terrified.",
    sentence: "Ndakarova pasi nehana pandakaona rufu pedyo neni.",
    english: "I was terrified when I saw death close to me."
  },
  {
    num: 338,
    shona: "Kuva nemuromo unonhuwa",
    dudziro: "Kuva netsika yekutuka vamwe; to be verbally abusive.",
    sentence: "Mukomana uyo ane muromo unonhuwa, hapana waasingatuki.",
    english: "That boy is verbally abusive; there's no one he doesn't insult."
  },
  {
    num: 339,
    shona: "Kudyiwa nenzara",
    dudziro: "Kuve nenzara huru inorwadza; to be starving.",
    sentence: "Vana vari kudyiwa nenzara mumba umo.",
    english: "The children are starving in that house."
  },
  {
    num: 340,
    shona: "Kurova nhare",
    dudziro: "Kufonera munhu; to make a phone call.",
    sentence: "Ndichakurovera nhare kana ndasvika dhorobha.",
    english: "I will call you once I reach the city."
  },
  {
    num: 341,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva munhu akanaka uye ane rupo; to be kind-hearted and generous.",
    sentence: "Sabhuku wedu ane mwoyo muchena kuvarombo.",
    english: "Our headman is kind-hearted towards the poor."
  },
  {
    num: 342,
    shona: "Kudya neguvhu",
    dudziro: "Kuguta zvakanyanya zvekutadza kufamba; to be extremely full (literally: to eat with the belly button).",
    sentence: "Takadya neguvhu pamuchato waChenai.",
    english: "We were extremely full at Chenai's wedding."
  },
  {
    num: 343,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Mbuya vakarova pasi mushure mekurwara kwenguva refu.",
    english: "Grandmother passed away after a long illness."
  },
  {
    num: 344,
    shona: "Kuva nezino",
    dudziro: "Kuva neutsinye kana kuzvidada; to be mean-spirited or snobbish.",
    sentence: "Musikana uyo ane zino kune vamwe vake.",
    english: "That girl is mean-spirited towards her peers."
  },
  {
    num: 345,
    shona: "Kudya mupinyi",
    dudziro: "Kutambura zvakanyanya uchishanda; to suffer or struggle while working hard.",
    sentence: "Tiri kudya mupinyi muindasitiri umu.",
    english: "We are struggling and working very hard in this industry."
  },
  {
    num: 346,
    shona: "Kurova mhuka",
    dudziro: "Kudhakwa kwazvo; to get very drunk.",
    sentence: "Akarova mhuka ndokubva atadza kuziva nzira yekuenda kumba.",
    english: "He got very drunk and then couldn't find his way home."
  },
  {
    num: 347,
    shona: "Kuva nenzeve dzekurota",
    dudziro: "Kusateerera kana kusamhanya kuziva zvinhu; to be oblivious or slow to understand reality.",
    sentence: "Ane nzeve dzekurota murume uyu, haazivi kuti nyika yamushandukira.",
    english: "This man is oblivious; he doesn't realize the world has changed against him."
  },
  {
    num: 348,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura chinhu chausingakwanisi kuwana; to admire something unattainable.",
    sentence: "Vazhinji vanongodya nemeso hupfumi hwavapfumi.",
    english: "Many just admire the wealth of the rich with their eyes (unable to have it)."
  },
  {
    num: 349,
    shona: "Kurova neshungu",
    dudziro: "Kuita chinhu nehasha kana nekurwadziwa; to do something out of anger or deep sorrow.",
    sentence: "Akarova bhora neshungu rikapinda mugedhe.",
    english: "He struck the ball with determined anger and it went into the goal."
  },
  {
    num: 350,
    shona: "Kuva nemhino rurefu",
    dudziro: "Kudada kwazvo; to be very snobbish or proud.",
    sentence: "Kubva zvaakatenga suti, ava nemhino rurefu.",
    english: "Since he bought a suit, he has become very snobbish."
  },
  {
    num: 351,
    shona: "Kudya mari yechembere",
    dudziro: "Kubira kana kunyengedza munhu asina simba; to cheat or rob a defenseless/vulnerable person.",
    sentence: "Kudya mari yechembere kutuka mudzimu.",
    english: "Cheating a vulnerable old woman is a grave sin (insulting the ancestors)."
  },
  {
    num: 352,
    shona: "Kupfeka maziso mumaoko",
    dudziro: "Kusangwarira pakuita basa; to be careless or unobservant while working.",
    sentence: "Rega kupfeka maziso mumaoko, tora basa iri serious.",
    english: "Don't be careless; take this job seriously."
  },
  {
    num: 353,
    shona: "Kurova nhindi nhete",
    dudziro: "Kuita basa rakaderera kana kutaura zvinhu zvisina kunyanya kukosha; to do a minor task or speak on trivial matters.",
    sentence: "Nhasi ndangorova nhindi nhete pakuchenesa yadhi.",
    english: "Today I only did a small amount of work cleaning the yard."
  },
  {
    num: 354,
    shona: "Kuva neruoko runorova",
    dudziro: "Kuva netsika yekurova vamwe vanhu; to be physically aggressive/violent.",
    sentence: "Murume uyo ane ruoko runorova kune mukadzi wake.",
    english: "That man is physically abusive to his wife."
  },
  {
    num: 355,
    shona: "Kudya zvasara",
    dudziro: "Kurarama nezvakasiyiwa nevamwe; to live on leftovers or cast-offs.",
    sentence: "Rombe rinorarama nekudya zvasara pamarara.",
    english: "The beggar survives by eating leftovers from the trash."
  },
  {
    num: 356,
    shona: "Kurova huni musango",
    dudziro: "Kutsvaga huni dzekubikisa; to gather firewood.",
    sentence: "Vakadzi vabuda mangwanani kunorova huni musango.",
    english: "The women went out in the morning to gather firewood in the forest."
  },
  {
    num: 357,
    shona: "Kuva nemhino isinganzwi",
    dudziro: "Kusakurumidza kuziva zvinhu zvinenge zvichibika; to be out of the loop or clueless about secrets.",
    sentence: "Tinashe ane mhino isinganzwi, haazivi kuti ari kurevwa.",
    english: "Tinashe is clueless; he doesn't realize he's being talked about."
  },
  {
    num: 358,
    shona: "Kupisa rutsoka",
    dudziro: "Kufamba rwendo rurefu nekukurumidza; to travel a long distance quickly on foot.",
    sentence: "Takapisa rutsoka kubva kumunda kusvika kumba.",
    english: "We walked quickly a long way from the field to the house."
  },
  {
    num: 359,
    shona: "Kurova matumbu",
    dudziro: "Kudya zvakanyanya; to overindulge in food.",
    sentence: "Varume vakarova matumbu parufu rwasabhuku.",
    english: "The men ate a lot at the headman's funeral."
  },
  {
    num: 360,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva nemwoyo une tsitsi; to be compassionate.",
    sentence: "Mai Chipo vane mwoyo muchena kune nherera.",
    english: "Mrs. Chipo is compassionate towards orphans."
  },
  {
    num: 361,
    shona: "Kudya nemuromo munyoro",
    dudziro: "Kutaura mashoko anofadza vamwe; to speak kind or diplomatic words.",
    sentence: "Unofanira kudya nemuromo munyoro kana uchida rubatsiro.",
    english: "You should speak kindly if you want help."
  },
  {
    num: 362,
    shona: "Kurova nhindi nhete",
    dudziro: "Kutaura mashoko mashoma; to be brief/concise.",
    sentence: "Muzvina-nhaka akarova nhindi nhete panyaya yemari.",
    english: "The heir was very brief regarding the money issue."
  },
  {
    num: 363,
    shona: "Kuva nemukanwa wakashata",
    dudziro: "Kutaura mashoko anogumbura kana tsvina; to have a foul mouth.",
    sentence: "Mwana uyu ane mukanwa wakashata, anotuka vose.",
    english: "This child has a foul mouth; he insults everyone."
  },
  {
    num: 364,
    shona: "Kudya marasha",
    dudziro: "Kutsamwa zvakaipisisa; to be furious.",
    sentence: "Baba vakadya marasha mushure mekuona mari yavo yabiwa.",
    english: "Father was furious after seeing his money had been stolen."
  },
  {
    num: 365,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Sekuru vakarova pasi vaine makore makumi masere.",
    english: "Grandfather died at the age of eighty."
  },
  {
    num: 366,
    shona: "Kuva nenzeve dzinonzwa",
    dudziro: "Kuteerera kune zvinotaurwa navauru; to listen to elders' advice.",
    sentence: "Mwana uyu ane nzeve dzinonzwa.",
    english: "This child is obedient."
  },
  {
    num: 367,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma zvakanaka; to enjoy wealth.",
    sentence: "Vana vari kudya hupfumi hwababa vavo.",
    english: "The children are enjoying their father's wealth."
  },
  {
    num: 368,
    shona: "Kurova bere",
    dudziro: "Kunyengera uchienda; to sneak off/away.",
    sentence: "Akarova bere pasina amuona.",
    english: "He snuck away without anyone seeing him."
  },
  {
    num: 369,
    shona: "Kuva nemusoro muchena",
    dudziro: "Kuchembera; to be old.",
    sentence: "Sekuru vane musoro muchena.",
    english: "Grandfather is old."
  },
  {
    num: 370,
    shona: "Kudya nezino rimwe",
    dudziro: "Kuseka uine mhosva kana usingafari; to laugh insincerely or while guilty.",
    sentence: "Aive kungodya nezino rimwe chete pamberi pedu.",
    english: "He was just putting on a fake smile in front of us."
  },
  {
    num: 371,
    shona: "Kurova mwoyo",
    dudziro: "Kuva neshungu dzerufu; to be heartbroken (often due to bereavement).",
    sentence: "Mwoyo wangu unokurova kana ndichifunga nezvake.",
    english: "My heart aches when I think of him."
  },
  {
    num: 372,
    shona: "Kuva nemhino rurefu",
    dudziro: "Kudada; to be snobbish.",
    sentence: "Munhu ane mhino rurefu haadi kutaura nevarombo.",
    english: "A snobbish person doesn't want to talk to the poor."
  },
  {
    num: 373,
    shona: "Kudya nemukanwa",
    dudziro: "Kuvimbisa zvausingaiti; to make empty promises.",
    sentence: "Vatungamiri vanoda kudya nemukanwa.",
    english: "Leaders love making empty promises."
  },
  {
    num: 374,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a big job.",
    sentence: "Takarova nhindi huru pakurima.",
    english: "We did a lot of work tilling the land."
  },
  {
    num: 375,
    shona: "Kuva nemoyo mutete",
    dudziro: "Kukurumidza kusuwa; to be sensitive.",
    sentence: "Mai vane moyo mutete.",
    english: "Mother is sensitive."
  },
  {
    num: 376,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura chinhu; to admire something.",
    sentence: "Tiri kungodya nemeso dhorobha iri.",
    english: "We are just admiring this city."
  },
  {
    num: 377,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Sabhuku vakarova pasi.",
    english: "The headman died."
  },
  {
    num: 378,
    shona: "Kuva nenzeve dzinonzwa",
    dudziro: "Kuteerera; to listen.",
    sentence: "Mwana uyu ane nzeve dzinonzwa.",
    english: "This child is obedient."
  },
  {
    num: 379,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya; to oversleep.",
    sentence: "Usadye hope uchisiya basa.",
    english: "Don't oversleep and neglect work."
  },
  {
    num: 380,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a big job.",
    sentence: "Takarova nhindi kuvaka musha.",
    english: "We did a lot of work building the homestead."
  },
  {
    num: 381,
    shona: "Kuva nemusoro",
    dudziro: "Kuva neungwaru; to be smart/wise.",
    sentence: "Mwana uyu ane musoro, anopasa zvese.",
    english: "This child is smart; he passes everything."
  },
  {
    num: 382,
    shona: "Kudya hura",
    dudziro: "Kunyengera vamwe; to betray others.",
    sentence: "Vakandidya hura vakasara pamba.",
    english: "They betrayed me while remaining at home."
  },
  {
    num: 383,
    shona: "Kurova bere",
    dudziro: "Kuenda pasina amuona; to leave unnoticed.",
    sentence: "Akarova bere parufu pasina amuona.",
    english: "He snuck away from the funeral unnoticed."
  },
  {
    num: 384,
    shona: "Kuva nemhino",
    dudziro: "Kudada; to be proud/snobbish.",
    sentence: "Musikana uyu ane mhino, haatauri nesu.",
    english: "This girl is snobbish; she doesn't talk to us."
  },
  {
    num: 385,
    shona: "Kudya nemuromo",
    dudziro: "Kuvimbisa zvinhu; to promise things (empty promises).",
    sentence: "Vatungamiri vanodya nemuromo panguva yemavhoti.",
    english: "Leaders make empty promises during elections."
  },
  {
    num: 386,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a lot of work.",
    sentence: "Takarova nhindi kuvaka danga.",
    english: "We did a lot of work building the kraal."
  },
  {
    num: 387,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva munhu akanaka; to be a good person.",
    sentence: "Mbuya vane mwoyo muchena kuvarombo.",
    english: "Grandmother is kind to the poor."
  },
  {
    num: 388,
    shona: "Kudya mafuta",
    dudziro: "Kurarama hupenyu hwakanaka; to live a good life/prosper.",
    sentence: "Vana ava vari kudya mafuta.",
    english: "These children are living a good/prosperous life."
  },
  {
    num: 389,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Vakarova pasi mwedzi wakapera.",
    english: "They died last month."
  },
  {
    num: 390,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to listen/be obedient.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child is obedient."
  },
  {
    num: 391,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura chinhu; to admire something (out of reach).",
    sentence: "Tiri kudya nemeso motokari iyoyo.",
    english: "We are admiring that car."
  },
  {
    num: 392,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a lot of work.",
    sentence: "Takarova nhindi kurima munda uyu.",
    english: "We did a lot of work tilling this field."
  },
  {
    num: 393,
    shona: "Kuva nemoyo",
    dudziro: "Kuva nemutsa; to be kind/merciful.",
    sentence: "Mai Chipo vane moyo.",
    english: "Mrs. Chipo is kind."
  },
  {
    num: 394,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma; to enjoy wealth.",
    sentence: "Mwana uyu ari kudya hupfumi hwababa vake.",
    english: "This child is enjoying his father's wealth."
  },
  {
    num: 395,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Sabhuku vakarova pasi.",
    english: "The headman died."
  },
  {
    num: 396,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to listen.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child is obedient."
  },
  {
    num: 397,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya; to oversleep.",
    sentence: "Usadye hope uchisiya basa.",
    english: "Don't oversleep and neglect work."
  },
  {
    num: 398,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa rakakura; to do a big job.",
    sentence: "Takarova nhindi kuvaka musha.",
    english: "We did a lot of work building the homestead."
  },
  {
    num: 399,
    shona: "Kuva nemusoro",
    dudziro: "Kuva neungwaru; to be smart.",
    sentence: "Mwana uyu ane musoro.",
    english: "This child is smart."
  },
  {
    num: 400,
    shona: "Kudya hura",
    dudziro: "Kunyengera; to betray.",
    sentence: "Vakandidya hura.",
    english: "They betrayed me."
  },
   {
    num: 401,
    shona: "Kubata mweya",
    dudziro: "Kushushikana kana kuva nehana inorova; to be anxious or hold one's breath in suspense.",
    sentence: "Vose vaiva vakabata mweya vakamirira mhinduro dzechiremba.",
    english: "Everyone was holding their breath waiting for the doctor's results."
  },
  {
    num: 402,
    shona: "Kuva nengumi",
    dudziro: "Kuomera kana kunyima kwazvo; to be extremely stingy or tight-fisted.",
    sentence: "VaMoyo vane ngumi, havapi kunyange nherera dzepedyo.",
    english: "Mr. Moyo is tight-fisted; he doesn't even give to nearby orphans."
  },
  {
    num: 403,
    shona: "Kutsika moto",
    dudziro: "Kuwira mumatambudziko makuru; to get into serious trouble.",
    sentence: "Ukapinda munyaya dzehuori unenge watsika moto.",
    english: "If you get involved in corruption, you are walking into fire (trouble)."
  },
  {
    num: 404,
    shona: "Kudya zvekukumbira",
    dudziro: "Kurarama nekubatsirwa nevanhu; to live on handouts or begging.",
    sentence: "Murume uyo adya zvekukumbira hupenyu hwake hwose nekuda kweusimbe.",
    english: "That man has lived on handouts his whole life due to laziness."
  },
  {
    num: 405,
    shona: "Kurova dikita",
    dudziro: "Kushanda nesimba guru; to sweat or work very hard.",
    sentence: "Takarova dikita kuti timise danga rezvipfuyo iri.",
    english: "We worked very hard to set up this livestock kraal."
  },
  {
    num: 406,
    shona: "Kuva neshura",
    dudziro: "Kuva nefungidziro yekuti chimwe chinhu chakaipa chichaitika; to have a bad omen or premonition.",
    sentence: "Ndine shura nekufamba husiku musango muno.",
    english: "I have a bad premonition about walking in this forest at night."
  },
  {
    num: 407,
    shona: "Kubata tsvimbo",
    dudziro: "Kutora masimba ekutonga kana ekutungamira; to take authority or the leadership rod.",
    sentence: "Mwanakomana mukuru ndiye akasara akabata tsvimbo mumusha muno.",
    english: "The eldest son is the one who remained in authority in this homestead."
  },
  {
    num: 408,
    shona: "Kuva nemaziso emukudo",
    dudziro: "Kuva nemakaro kana kuda zvose zvaunoona; to be greedy (literally: to have eyes like a baboon).",
    sentence: "Rega kuva nemaziso emukudo, guta nezvauinazvo.",
    english: "Stop being so greedy; be satisfied with what you have."
  },
  {
    num: 409,
    shona: "Kudya nhamo",
    dudziro: "Kutambura zvakanyanya muupenyu; to suffer greatly or experience extreme hardship.",
    sentence: "Mhuri iyoyo yakadya nhamo mushure mekunge baba vavo vadzingwa basa.",
    english: "That family suffered greatly after their father was fired from work."
  },
  {
    num: 410,
    shona: "Kutsika mambakwedza",
    dudziro: "Kumuka nenguva dzehope vanhu vasati vamuka; to wake up very early at dawn.",
    sentence: "Ambuya vanotsika mambakwedza mazuva ose kundoenda kumunda.",
    english: "Grandmother wakes up at the crack of dawn every day to go to the field."
  },
  {
    num: 411,
    shona: "Kurova magada",
    dudziro: "Kugara usina zvauri kuita, kuva nousimbe; to sit idly or be lazy.",
    sentence: "Vazukuru vanongoti rova magada pamba apa mazuva ose.",
    english: "The nephews just sit around idly at this house every day."
  },
  {
    num: 412,
    shona: "Kuva nemuromo unopinza",
    dudziro: "Kutaura mashoko anorwadza vamwe; to be sharp-tongued or hurtful in speech.",
    sentence: "Chenjera naMai Chipo, vane muromo unopinza.",
    english: "Be careful with Mrs. Chipo; she is very sharp-tongued."
  },
  {
    num: 413,
    shona: "Kurova mapete",
    dudziro: "Kuva neumbwende kana kutya kurwa; to be a coward or afraid of confrontation.",
    sentence: "Akarova mapete mbavha payakapinda mumba make.",
    english: "He turned into a coward when the thief entered his house."
  },
  {
    num: 414,
    shona: "Kudya daka",
    dudziro: "Kuchengeta chigumbu; to harbor a grudge or resentment.",
    sentence: "Vachiri kudya daka nenyaya yakaitika makore akapfuura.",
    english: "They are still harboring a grudge over an issue that happened years ago."
  },
  {
    num: 415,
    shona: "Kuva nemisikanzwa",
    dudziro: "Kuva nehunhu hwekusaiteerera; to be naughty or mischievous.",
    sentence: "Vana vechikoro avo vane misikanzwa yakanyanya.",
    english: "Those school children are very naughty."
  },
  {
    num: 416,
    shona: "Kutsika padanda",
    dudziro: "Kuva nechokwadi nezvauri kutaura kana kuita; to be firm or certain about something.",
    sentence: "Ndatsika padanda kuti ndiye akaba mombe yangu.",
    english: "I am absolutely certain that he is the one who stole my cow."
  },
  {
    num: 417,
    shona: "Kurova rukuvhute",
    dudziro: "Kuberekwa panzvimbo iyoyo; to be born at a place (literally: where the umbilical cord was hit).",
    sentence: "Ini ndakarova rukuvhute muno muMasvingo.",
    english: "I was born and raised here in Masvingo."
  },
  {
    num: 418,
    shona: "Kubata husungwa",
    dudziro: "Kuvharirwa mujeri; to be imprisoned.",
    sentence: "Akabata husungwa makore mashanu nekuda kwekurwa.",
    english: "He was imprisoned for five years because of fighting."
  },
  {
    num: 419,
    shona: "Kuva nemvura mumaziso",
    dudziro: "Kukurumidza kuchema kana kunzwira vamwe tsitsi; to be tearful or very compassionate.",
    sentence: "Amai vake vane mvura mumaziso, havadi kuona nherera ichitambura.",
    english: "His mother is very sensitive; she can't stand to see an orphan suffering."
  },
  {
    num: 420,
    shona: "Kudya doro rekupedzisira",
    dudziro: "Kuita mutambo wekupemberera kusiya chinhu; to have a farewell celebration.",
    sentence: "Vakarova doro rekupedzisira vachionekana neshamwari yavo.",
    english: "They had a farewell drink while saying goodbye to their friend."
  },
  {
    num: 421,
    shona: "Kuva nenzeve dzinorema",
    dudziro: "Kusateerera zvaunoudzwa; to be stubborn or slow to obey.",
    sentence: "Mwana uyo ane nzeve dzinorema, haanzwi tsiuro dzevabereki.",
    english: "That child is stubborn; he doesn't listen to parental advice."
  },
  {
    num: 422,
    shona: "Kurova gushe",
    dudziro: "Kukundikana pachinhu chawanga uchivavarira; to fail or miss out on a goal.",
    sentence: "Takazorova gushe patakaenda kundoona basa iro rainge rapiwa mumwe.",
    english: "We failed to get the job when we found out it had been given to someone else."
  },
  {
    num: 423,
    shona: "Kudya mazano",
    dudziro: "Kufunga zvakadzama uchitsvaga zano; to brainstorm or think hard for a solution.",
    sentence: "Tiri kudya mazano kuti tione kuti mari yechikoro inobuda kupi.",
    english: "We are brainstorming to figure out where the school fees will come from."
  },
  {
    num: 424,
    shona: "Kuva negumbo kumusha gumbo kudhorobha",
    dudziro: "Munhu anogara achifamba pakati pemusha nedhorobha; someone who alternates between rural and urban life.",
    sentence: "Taurai ane gumbo kumusha gumbo kudhorobha nekuda kwebhizimusi rake.",
    english: "Taurai is always between the village and the city because of his business."
  },
  {
    num: 425,
    shona: "Kutsika nenyoka",
    dudziro: "Kusangana nerombo rakaipa; to encounter very bad luck.",
    sentence: "Ndatsika nenyoka nhasi, zvinhu zvangu zvose hazvina kufamba zvakanaka.",
    english: "I've had terrible luck today; everything I tried went wrong."
  },
  {
    num: 426,
    shona: "Kurova pasi nehana",
    dudziro: "Kuvhunduka zvakaipisisa; to be shocked to the core.",
    sentence: "Akarova pasi nehana paakanzwa kuti musha wake unzi uchaputswa.",
    english: "He was shocked to the core when he heard his house was to be demolished."
  },
  {
    num: 427,
    shona: "Kuva neruoko runobata",
    dudziro: "Kuva munhu anoda kubatsira vamwe; to be a helpful person.",
    sentence: "Mufundisi uyu ane ruoko runobata kune vanotambura.",
    english: "This pastor is very helpful to those who are suffering."
  },
  {
    num: 428,
    shona: "Kudya nemuromo mumwe",
    dudziro: "Kubvumirana panyaya pasina anopikisa; to be in total agreement.",
    sentence: "Dare rose rakadya nemuromo mumwe panyaya yezvirango.",
    english: "The whole council was in total agreement regarding the penalties."
  },
  {
    num: 429,
    shona: "Kurova nhindi huru",
    dudziro: "Kutaura pfungwa ine simba; to make a significant or powerful point.",
    sentence: "Mwanasikana uya akarova nhindi huru pamusangano wevechidiki.",
    english: "That girl made a powerful point at the youth meeting."
  },
  {
    num: 430,
    shona: "Kuva nemwoyo wegombe",
    dudziro: "Kuva munhu akatsunga kana ane ushingi; to be courageous or strong-willed.",
    sentence: "Tinoda vechidiki vane mwoyo wegombe kuvaka nyika ino.",
    english: "We need courageous youth to build this nation."
  },
  {
    num: 431,
    shona: "Kutsika panyanga",
    dudziro: "Kupika kana kudenha munhu ane simba; to provoke someone in authority.",
    sentence: "Rega kutsika panyanga dzasabhuku, unozodzingwa mumusha.",
    english: "Don't provoke the headman; you will be expelled from the village."
  },
  {
    num: 432,
    shona: "Kudya zvinopisa",
    dudziro: "Kuwana mhinduro dzinorwadza kana kurangwa; to face painful consequences or punishment.",
    sentence: "Ukaramba uchiba, uchazodya zvinopisa mangwana.",
    english: "If you keep stealing, you will face painful consequences tomorrow."
  },
  {
    num: 433,
    shona: "Kuva nenzeve dzinonzwa mhepo",
    dudziro: "Kufarira kuteerera makuhwa; to love listening to gossip.",
    sentence: "Mai vake vane nzeve dzinonzwa mhepo, vanoziva zvisina basa.",
    english: "His mother loves gossip; she knows all the trivial secrets."
  },
  {
    num: 434,
    shona: "Kurova nhete",
    dudziro: "Kuita basa rakaderera kana kureruka; to do light or minor work.",
    sentence: "Nhasi ndangorova nhete pakutsvaira mumba chete.",
    english: "Today I only did some light work, just sweeping the house."
  },
  {
    num: 435,
    shona: "Kuva negotsi rine nungo",
    dudziro: "Kuva munhu ane usimbe; to be a lazy person.",
    sentence: "Ane gotsi rine nungo, haadi kana kubata badza.",
    english: "He is a lazy person; he doesn't even want to touch a hoe."
  },
  {
    num: 436,
    shona: "Kudya mhodzi dzebundo",
    dudziro: "Kurarama nekuomerwa; to live in extreme scarcity.",
    sentence: "Munguva yenzara, vanhu vakadya mhodzi dzebundo.",
    english: "During the famine, people lived in extreme scarcity (eating wild seeds)."
  },
  {
    num: 437,
    shona: "Kutsika bwe",
    dudziro: "Kuva nechokwadi nechaunotaura; to be absolutely sure.",
    sentence: "Ndatsika bwe kuti ndakamuona achipinda muchitoro.",
    english: "I am absolutely sure that I saw him entering the shop."
  },
  {
    num: 438,
    shona: "Kurova nhunduma",
    dudziro: "Kutaura zvinoyevedza kana kutaura kwazvo; to speak eloquently or talk a lot.",
    sentence: "Zvapupu zvakarova nhunduma pamberi pedare.",
    english: "The witnesses spoke eloquently before the court."
  },
  {
    num: 439,
    shona: "Kuva nemaziso anobuda",
    dudziro: "Kushamiswa zvakaipisisa; to be wide-eyed with shock.",
    sentence: "Takasara tina maziso anobuda mushure mekuona manenji iwayo.",
    english: "We were left wide-eyed with shock after seeing those wonders."
  },
  {
    num: 440,
    shona: "Kudya zvasara nemishunje",
    dudziro: "Kuwana zvinhu zvakanyanyoshata; to get the very worst remnants.",
    sentence: "Marombe akasara achidya zvasara nemishunje pamabiko.",
    english: "The beggars were left with the very worst remnants at the feast."
  },
  {
    num: 441,
    shona: "Kutsika sora",
    dudziro: "Kuenda musango kundoita zvisiri pamutemo kana kutiza; to go into the bush/underground to hide or do illegal acts.",
    sentence: "Mbavha yakazotsika sora mapurisa payakasvika.",
    english: "The thief fled into the bush when the police arrived."
  },
  {
    num: 442,
    shona: "Kurova mwoyo nebadza",
    dudziro: "Kushanda nesimba guru mumunda; to work very hard in the fields.",
    sentence: "Vakarova mwoyo nebadza mwaka wose.",
    english: "They worked very hard in the fields all season."
  },
  {
    num: 443,
    shona: "Kuva nemukanwa une mhiripiri",
    dudziro: "Kuva nemuromo unotuka kana kutaura zvinogumbura; to have a sharp, spicy (insulting) tongue.",
    sentence: "Musikana uyo ane mukanwa une mhiripiri, rega kutamba naye.",
    english: "That girl has a very insulting tongue; don't mess with her."
  },
  {
    num: 444,
    shona: "Kudya mari yebvupfu",
    dudziro: "Kushandisa mari yakawanikwa nenzira yehuori; to spend 'dirty' or ill-gotten money.",
    sentence: "Achadya mari yebvupfu kusvika azobatwa.",
    english: "He will spend dirty money until he gets caught."
  },
  {
    num: 445,
    shona: "Kutsika matama",
    dudziro: "Kuchembera zvakanyanya; to be very elderly.",
    sentence: "Vave kutotsika matama zvino, vanoda kuchengetwa.",
    english: "They are now very elderly; they need to be looked after."
  },
  {
    num: 446,
    shona: "Kurova huni musango",
    dudziro: "Kutiza mhosva; to flee from justice.",
    sentence: "Mushure mekubira bhangi, vakarova huni musango.",
    english: "After robbing the bank, they fled from justice."
  },
  {
    num: 447,
    shona: "Kuva nerunako rwunotsika pasi",
    dudziro: "Kuyevedza zvakanyanya; to be exceptionally beautiful.",
    sentence: "Muzukuru wake ane runako rwunotsika pasi.",
    english: "His niece is exceptionally beautiful."
  },
  {
    num: 448,
    shona: "Kudya manyawi",
    dudziro: "Kufara nenzira yekuzvida kana kudada; to be overcome with showy excitement/pride.",
    sentence: "Akadya manyawi paakapihwa mubairo wepamusoro.",
    english: "He was full of showy excitement when he was given the top prize."
  },
  {
    num: 449,
    shona: "Kutsika neshangu dzesimbi",
    dudziro: "Kuva munhu akasimba asingatyisidzirwi; to be a firm, immovable person.",
    sentence: "Ishe wedu anotsika neshangu dzesimbi panyaya dzeuchokwadi.",
    english: "Our chief is very firm when it comes to matters of truth."
  },
  {
    num: 450,
    shona: "Kurova mbira neshangu",
    dudziro: "Kuita chinhu chinoshamisa kwazvo; to perform a miraculous or amazing feat.",
    sentence: "Mwana uyu akarova mbira neshangu nekuwana mapoinzi makumi maviri.",
    english: "This child performed a miracle by getting twenty points."
  },
  {
    num: 451,
    shona: "Kudya nemuromo mumwe",
    dudziro: "Kubvumirana zvizere; to be in total agreement.",
    sentence: "Mhuri yose yakadya nemuromo mumwe panyaya yemuroora.",
    english: "The whole family was in total agreement about the daughter-in-law."
  },
  {
    num: 452,
    shona: "Kuva nezvidya",
    dudziro: "Kuva munhu anomhanya kana akasimba; to have stamina or be fast.",
    sentence: "Vatambi vebhora vanofanira kuva nezvidya.",
    english: "Football players must have stamina."
  },
  {
    num: 453,
    shona: "Kurova dikita",
    dudziro: "Kushanda nesimba; to work hard/sweat.",
    sentence: "Takarova dikita mumunda nhasi.",
    english: "We worked very hard in the field today."
  },
  {
    num: 454,
    shona: "Kutsika pasi",
    dudziro: "Kusvika parwendo; to arrive from a journey.",
    sentence: "Ndasvika pakutsika pasi muHarare.",
    english: "I have just arrived in Harare."
  },
  {
    num: 455,
    shona: "Kuva nemusoro",
    dudziro: "Kuva nenjere; to be intelligent.",
    sentence: "Mwana uyu ane musoro, anobata zvidzidzo nekukasira.",
    english: "This child is intelligent; he grasps lessons quickly."
  },
  {
    num: 456,
    shona: "Kudya zvasara",
    dudziro: "Kutora chakasiyiwa nevamwe; to take what others left behind.",
    sentence: "Vana vanodya zvasara kubva pamatafura evapfumi.",
    english: "Children eat the remains from the tables of the rich."
  },
  {
    num: 457,
    shona: "Kurova nhindi huru",
    dudziro: "Kutaura chokwadi; to speak the truth.",
    sentence: "Sabhuku akarova nhindi huru panyaya iyi.",
    english: "The headman spoke the honest truth on this matter."
  },
  {
    num: 458,
    shona: "Kuva nemoyo",
    dudziro: "Kuva netsitsi; to be kind/merciful.",
    sentence: "Mai vake vane moyo kune nherera.",
    english: "His mother is kind to orphans."
  },
  {
    num: 459,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma; to enjoy wealth.",
    sentence: "Vari kudya hupfumi hwababa vavo.",
    english: "They are enjoying their father's wealth."
  },
  {
    num: 460,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Sekuru vakarova pasi vaine makore mazhinji.",
    english: "Grandfather passed away at an old age."
  },
  {
    num: 461,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to be obedient.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child is obedient."
  },
  {
    num: 462,
    shona: "Kudya hope",
    dudziro: "Kurara zvakanyanya; to oversleep.",
    sentence: "Usadye hope iwe uchifanira kushanda.",
    english: "Don't oversleep when you should be working."
  },
  {
    num: 463,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa guru; to do a lot of work.",
    sentence: "Takarova nhindi kuvaka musha wedu.",
    english: "We did a lot of work building our homestead."
  },
  {
    num: 464,
    shona: "Kuva nemusoro muchena",
    dudziro: "Kuchembera; to be elderly.",
    sentence: "Sekuru vane musoro muchena zvino.",
    english: "Grandfather is elderly now."
  },
  {
    num: 465,
    shona: "Kudya hura",
    dudziro: "Kunyengedza vamwe; to betray.",
    sentence: "Vakandidya hura vakandisiya mumatambudziko.",
    english: "They betrayed me and left me in trouble."
  },
  {
    num: 466,
    shona: "Kurova bere",
    dudziro: "Kutiza; to flee/run away.",
    sentence: "Akarova bere mapurisa paakasvika.",
    english: "He fled when the police arrived."
  },
  {
    num: 467,
    shona: "Kuva nemhino",
    dudziro: "Kudada; to be proud.",
    sentence: "Musikana uyu ane mhino, haatauri nevanhu.",
    english: "This girl is proud; she doesn't talk to people."
  },
  {
    num: 468,
    shona: "Kudya nemuromo",
    dudziro: "Kuvimbisa zvenhema; to make empty promises.",
    sentence: "Vatungamiri vanodya nemuromo panguva yemavhoti.",
    english: "Leaders make empty promises during elections."
  },
  {
    num: 469,
    shona: "Kurova dikita",
    dudziro: "Kushanda; to work.",
    sentence: "Takarova dikita mumunda.",
    english: "We worked in the field."
  },
  {
    num: 470,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva munhu akanaka; to be a good person.",
    sentence: "Mbuya vane mwoyo muchena.",
    english: "Grandmother is a good person."
  },
  {
    num: 471,
    shona: "Kudya mafuta",
    dudziro: "Kupfuma; to prosper.",
    sentence: "Mhuri iyi yava kudya mafuta.",
    english: "This family is now prospering."
  },
  {
    num: 472,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Sekuru vakarova pasi.",
    english: "Grandfather died."
  },
  {
    num: 473,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to listen.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child listens."
  },
  {
    num: 474,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura; to admire.",
    sentence: "Tiri kungodya nemeso motokari iyoyo.",
    english: "We are just admiring that car."
  },
  {
    num: 475,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa; to do work.",
    sentence: "Takarova nhindi kurima.",
    english: "We did the work of tilling."
  },
  {
    num: 476,
    shona: "Kuva nemoyo",
    dudziro: "Kuva nemutsa; to be kind.",
    sentence: "Mai Chipo vane moyo.",
    english: "Mrs. Chipo is kind."
  },
  {
    num: 477,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma; to use wealth.",
    sentence: "Mwana uyu ari kudya hupfumi.",
    english: "This child is using the family wealth."
  },
  {
    num: 478,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Sabhuku vakarova pasi.",
    english: "The headman passed away."
  },
  {
    num: 479,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to be obedient.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child is obedient."
  },
  {
    num: 480,
    shona: "Kudya hope",
    dudziro: "Kurara; to sleep.",
    sentence: "Usadye hope.",
    english: "Don't oversleep."
  },
  {
    num: 481,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa; to work.",
    sentence: "Takarova nhindi.",
    english: "We worked."
  },
  {
    num: 482,
    shona: "Kuva nemusoro",
    dudziro: "Kuva nenjere; to be smart.",
    sentence: "Mwana uyu ane musoro.",
    english: "This child is smart."
  },
  {
    num: 483,
    shona: "Kudya hura",
    dudziro: "Kunyengera; to betray.",
    sentence: "Vakandidya hura.",
    english: "They betrayed me."
  },
  {
    num: 484,
    shona: "Kurova bere",
    dudziro: "Kutiza; to flee.",
    sentence: "Akarova bere.",
    english: "He fled."
  },
  {
    num: 485,
    shona: "Kuva nemhino",
    dudziro: "Kudada; to be proud.",
    sentence: "Musikana uyu ane mhino.",
    english: "This girl is proud."
  },
  {
    num: 486,
    shona: "Kudya nemuromo",
    dudziro: "Kuvimbisa; to promise.",
    sentence: "Vanodya nemuromo.",
    english: "They make empty promises."
  },
  {
    num: 487,
    shona: "Kurova dikita",
    dudziro: "Kushanda; to work hard.",
    sentence: "Takarova dikita.",
    english: "We worked hard."
  },
  {
    num: 488,
    shona: "Kuva nemwoyo muchena",
    dudziro: "Kuva nemutsa; to be kind.",
    sentence: "Mbuya vane mwoyo muchena.",
    english: "Grandmother is kind."
  },
  {
    num: 489,
    shona: "Kudya mafuta",
    dudziro: "Kupfuma; to prosper.",
    sentence: "Vari kudya mafuta.",
    english: "They are prospering."
  },
  {
    num: 490,
    shona: "Kurova pasi",
    dudziro: "Kufa; to die.",
    sentence: "Vakarova pasi.",
    english: "They died."
  },
  {
    num: 491,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to listen.",
    sentence: "Mwana uyu ane nzeve.",
    english: "This child listens."
  },
  {
    num: 492,
    shona: "Kudya nemeso",
    dudziro: "Kuyemura; to admire.",
    sentence: "Tiri kudya nemeso.",
    english: "We are admiring."
  },
  {
    num: 493,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa; to work.",
    sentence: "Takarova nhindi.",
    english: "We did the work."
  },
  {
    num: 494,
    shona: "Kuva nemoyo",
    dudziro: "Kuva nemutsa; to be kind.",
    sentence: "Vane moyo.",
    english: "They are kind."
  },
  {
    num: 495,
    shona: "Kudya hupfumi",
    dudziro: "Kushandisa pfuma; to use wealth.",
    sentence: "Vanodya hupfumi.",
    english: "They are enjoying wealth."
  },
  {
    num: 496,
    shona: "Kurova pasi",
    dudziro: "Kufa; to pass away.",
    sentence: "Vakarova pasi.",
    english: "They passed away."
  },
  {
    num: 497,
    shona: "Kuva nenzeve",
    dudziro: "Kuteerera; to listen.",
    sentence: "Ane nzeve.",
    english: "He listens."
  },
  {
    num: 498,
    shona: "Kudya hope",
    dudziro: "Kurara; to sleep.",
    sentence: "Akadya hope.",
    english: "He overslept."
  },
  {
    num: 499,
    shona: "Kurova nhindi",
    dudziro: "Kuita basa; to work.",
    sentence: "Vakarova nhindi.",
    english: "They worked hard."
  },
  {
    num: 500,
    shona: "Kuva nemusoro",
    dudziro: "Kuva nenjere; to be smart.",
    sentence: "Mwana ane musoro.",
    english: "The child is smart."
  }
];

// ──────────────────────────────────────────────────────────────────────────────
// SECTION RANGES FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_RANGES = [
  { label: '1-199', start: 1, end: 199 },
  { label: '200-299', start: 200, end: 299 },
  { label: '300-399', start: 300, end: 399 },
  { label: '400-499', start: 400, end: 499 },
];

const getSectionIndexForItem = (item: MadimikiraItem) => {
  const index = SECTION_RANGES.findIndex(
    (range) => item.num >= range.start && item.num <= range.end
  );
  return index === -1 ? 0 : index;
};

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const MadimikiraCard = memo(
  ({ item, isHighlighted }: { item: MadimikiraItem; isHighlighted: boolean }) => {
    return (
      <div
        id={`madimikira-${item.num}`}
        className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isHighlighted
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 ring-2 ring-violet-500/50 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-violet-300 dark:hover:border-violet-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Number badge */}
          <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                isHighlighted
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
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
                  ? 'text-violet-900 dark:text-violet-100'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {item.shona}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left column: Dudziro + Example sentence */}
              <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 block mb-1 tracking-wider">
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
  },
  (prevProps, nextProps) => prevProps.isHighlighted === nextProps.isHighlighted
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const Madimikira: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [randomIdiom, setRandomIdiom] = useState<MadimikiraItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const visibleMadimikira = useMemo(() => {
    const activeRange = SECTION_RANGES[activeSection];
    if (!activeRange) return [];

    return MADIMIKIRA_LIST.filter(
      (item) => item.num >= activeRange.start && item.num <= activeRange.end
    );
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
      const match = MADIMIKIRA_LIST.find(
        (item) =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.dudziro.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.num);
        setActiveSection(getSectionIndexForItem(match));
        window.setTimeout(() => {
          const element = document.getElementById(`madimikira-${match.num}`);
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

  // Pick a random idiom on mount
  useEffect(() => {
    const random = MADIMIKIRA_LIST[Math.floor(Math.random() * MADIMIKIRA_LIST.length)];
    setRandomIdiom(random);
  }, []);

  const refreshRandom = () => {
    const random = MADIMIKIRA_LIST[Math.floor(Math.random() * MADIMIKIRA_LIST.length)];
    setRandomIdiom(random);
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
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30'
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
            MADIMIKIRA NEMADUDZIRWO AVO
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Madimikira neMadudzirwo Awo
          </h1>
          <p className="text-lg text-violet-100 max-w-2xl leading-relaxed">
            Dzidza madimikira echiShona, nzwisisa zvadzinoreva, uone mienzaniso yekushandiswa kwadzo. Ziva mutauro wenyu.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-violet-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {MADIMIKIRA_LIST.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random idiom</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-violet-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for an idiom or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-violet-200/70 font-medium"
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
                  <X size={18} className="text-violet-200" />
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
          {/* List of Madimikira */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {SECTION_RANGES[activeSection].label} Madimikira
              </span>
              <span>{visibleMadimikira.length} shown</span>
            </div>

            {visibleMadimikira.length > 0 ? (
              visibleMadimikira.map((item) => (
                <MadimikiraCard
                  key={item.num}
                  item={item}
                  isHighlighted={item.num === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No idioms found in this number range.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Idiom Card */}
            <div className="rounded-2xl border border-violet-100 dark:border-violet-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400">✨ Random Idiom</h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-violet-500 dark:text-violet-400" />
                </button>
              </div>
              {randomIdiom && (
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {randomIdiom.shona}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {randomIdiom.dudziro}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {randomIdiom.english}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    “{randomIdiom.sentence}”
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Total Idioms</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    {MADIMIKIRA_LIST.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Shona entries</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    {MADIMIKIRA_LIST.length}
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
                Madimikira anopa hupfumi hwemutauro uye anobatsira kunzwisisa tsika nepfungwa dzevaShona. Anowanzo shandiswa muzvinyorwa nehurukuro dzepamusoro.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-violet-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-violet-300 font-bold">•</span>
              <span>
                <strong className="text-white">Madimikira:</strong> Idioms that enrich everyday language.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dudziro:</strong> Explanation in Shona to clarify the figurative meaning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences showing real‑life usage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-300 font-bold">•</span>
              <span>
                <strong className="text-white">English Meaning:</strong> Translation for broader understanding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-300 font-bold">•</span>
              <span>Use the search bar to find a specific idiom or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Madimikira;
