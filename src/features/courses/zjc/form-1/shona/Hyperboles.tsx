import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Search, X, ChevronUp, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA
// ──────────────────────────────────────────────────────────────────────────────

interface HyperboleItem {
  num: number;
  shona: string;
  dudziro: string;
  sentence: string;
  english: string;
}

const HYPERBOLES: HyperboleItem[] = [
  { num: 1, shona: "Ndakafa nenzara.", dudziro: "Ndine nzara yakanyanyisa.", sentence: "Chimbondipaiwo chekudya, ndakafa nenzara.", english: "I am dying of hunger (I am extremely hungry)." },
  { num: 2, shona: "Ndakamirira kwezana remakore.", dudziro: "Ndakamirira kwenguva refu kwazvo.", sentence: "Makasvika masikati iwayo, ndakakumirirai kwezana remakore.", english: "I waited for a hundred years (I waited for a very long time)." },
  { num: 3, shona: "Mbabvu dzakada kubuda nekuseka", dudziro: "Kuseka zvakanyanya zvisingaiti.", sentence: "Vatapi venhau vakati tese mbabvu dzakada kubuda nekuseka.", english: "We laughed so hard our ribs almost burst." },
  { num: 4, shona: "Kuchema rwizi", dudziro: "Kuchema kwenguva refu misodzi ichiyerera zvakanyanya.", sentence: "Mwana uyu akachema rwizi amai vakaenda.", english: "The child cried a river when the mother left." },
  { num: 5, shona: "Kudya gomo resadza", dudziro: "Kudya chikafu chakawanda kwazvo panguva imwe chete.", sentence: "Chipo anodya gomo resadza asi haafuti.", english: "Chipo eats a mountain of sadza but doesn't get fat." },
  { num: 6, shona: "Gumbo rimwe riri mumba, rimwe riri kumunda", dudziro: "Kufamba nekukurumidza kusingaiti.", sentence: "Tinashe akati gumbo rimwe mumba rimwe kumunda kunotora mbeu.", english: "Tinashe went at lightning speed (one leg in the house, one in the field)." },
  { num: 7, shona: "Kutamba nemusoro", dudziro: "Munhu ane huchenjeri husingatarisirwi.", sentence: "Mukomana uyu anotamba nemusoro pamasvomhu.", english: "This boy is a genius at mathematics (plays with his head)." },
  { num: 8, shona: "Munhu mutete kunge tsvimbo", dudziro: "Munhu akawonda zvakanyanya.", sentence: "Akarwara akasara ave mutete kunge tsvimbo.", english: "He was so sick he became as thin as a stick." },
  { num: 9, shona: "Kumedza mweya", dudziro: "Kuva nekutya kukuru kunoita kuti munhu atadze kufema.", sentence: "Paakaona nyoka, akabva amedza mweya.", english: "He gasped in extreme fear (swallowed the air)." },
  { num: 10, shona: "Kutsika pasi pakaoma", dudziro: "Kuzvikudza zvekuti unofamba uchizviona sekuti uri n’anga.", sentence: "Kubva paakawana basa, ava kutsika pasi pakaoma.", english: "Since he got a job, he is walking with extreme arrogance." },
  { num: 11, shona: "Mvura inopisa zvekubvisa mwoyo", dudziro: "Mvura inopisa zvakanyanya zvisingaiti.", sentence: "Geza nemvura iyoyo, inopisa zvekubvisa mwoyo.", english: "The water is boiling hot (hot enough to remove the heart)." },
  { num: 12, shona: "Kufamba nedenga", dudziro: "Kufara zvakanyanya zvisingaiti.", sentence: "Akange ave kufamba nedenga paakanzwa kuti akapasa bvunzo.", english: "He was walking on air (over the moon) when he heard he passed." },
  { num: 13, shona: "Kumedza nzungu nemate", dudziro: "Kushuvira chinhu zvakanyanya.", sentence: "Amai vaive vakabata huku yakagochwa, vana vakabva vamedza nzungu nemate.", english: "Their mouths watered excessively looking at the chicken." },
  { num: 14, shona: "Musoro unenge dende", dudziro: "Munhu ane musoro mukuru zvakanyanya.", sentence: "Mukomana uya ane musoro unenge dende.", english: "That boy has a head as big as a gourd." },
  { num: 15, shona: "Kupedza mvura yose murwizi", dudziro: "Kunwa mvura yakawanda zvakanyanya nekuda kwenyota.", sentence: "Ndine nyota zvekuti ndinogona kupedza mvura yose murwizi.", english: "I am so thirsty I could drink the whole river dry." },
  { num: 16, shona: "Kumira negumbo rimwe chete", dudziro: "Kumirira chinhu uchinetseka kana uchishushikana.", sentence: "Ndakamumirira negumbo rimwe chete kusvika adzoka.", english: "I waited for him with extreme impatience/tension." },
  { num: 17, shona: "Kupenya kwekuti maziso anoda kutobuda", dudziro: "Chinhu chinopenya zvakanyanya zvekutadza kuchitarisa.", sentence: "Zuva rakapenya zvekuti maziso aida kutobuda.", english: "The sun was so bright it was blinding." },
  { num: 18, shona: "Kupwanya mapfupa nemukanwa", dudziro: "Kutaura nehasha dzakanyanya zvekutyisa.", sentence: "Baba vakataura vachipwanya mapfupa nemukanwa nehasha.", english: "Father spoke with such ferocity it was as if he was crushing bones in his mouth." },
  { num: 19, shona: "Rima rekuita kumedza", dudziro: "Rima rakasviba zvakanyanya zvekutadza kuona.", sentence: "Mumba maiva nerima rekuita kumedza.", english: "The room was pitch black (dark enough to swallow you)." },
  { num: 20, shona: "Kutaura kusvika rurimi rwakada kubuda", dudziro: "Kutaura kwenguva refu zvakanyanya.", sentence: "Mudzidzisi akataura kusvika rurimi rwakada kubuda.", english: "The teacher talked until his tongue almost fell out." },
  { num: 21, shona: "Kunhuwa zvekudonha", dudziro: "Kunhuwa zvakanyanya zvinokonzeresa dzungu.", sentence: "Chitunha chembeva chinoti pfu kunhuwa zvekudonha.", english: "The dead mouse stinks so much it could make you faint." },
  { num: 22, shona: "Kuneta zvekuti munhu anogona kufira ipapo", dudziro: "Kuneta zvakanyanya zvisingaiti.", sentence: "Kubva kumunda kusvika kumba ndaneta zvekuti ndinogona kufira ipapo.", english: "I am so tired I could drop dead right here." },
  { num: 23, shona: "Kuva nemwoyo unenge gungwa", dudziro: "Kuva nemutsa mukuru kwazvo.", sentence: "Amai vangu vane mwoyo unenge gungwa.", english: "My mother has a heart as big as the ocean." },
  { num: 24, shona: "Kuseka kusvika matumbu arwadza", dudziro: "Kuseka zvakanyanya kwenguva refu.", sentence: "Takatamba tichiseka kusvika matumbu arwadza.", english: "We laughed until our stomachs ached." },
  { num: 25, shona: "Kumhanya kunge mheni", dudziro: "Kumhanya nekukurumidza kusingaiti.", sentence: "Shumba yakamhanya ichitevera nhoro kunge mheni.", english: "The lion ran as fast as lightning." },
  { num: 26, shona: "Kusviba kunge rasha", dudziro: "Munhu akasviba zvakanyanya.", sentence: "Uyo mukomana akasviba kunge rasha.", english: "That boy is as dark as coal." },
  { num: 27, shona: "Nzara inocheka mwoyo", dudziro: "Kuva nenzara inonzwika kukurwadza.", sentence: "Ndinoda kudya izvozvi, nzara iri kucheka mwoyo.", english: "I have a hunger that is cutting through my heart." },
  { num: 28, shona: "Kurova munhu kusvika ave upfu", dudziro: "Kurova munhu zvakaipisisa.", sentence: "Mbavha yakarohwa kusvika yave upfu.", english: "The thief was beaten into dust (severely beaten)." },
  { num: 29, shona: "Zuva rinopisa zvekuti matombo anotsemuka", dudziro: "Kupisa kwezuva kwakanyanya.", sentence: "Nhasi zuva riri kupisa zvekuti matombo anotsemuka.", english: "Today the sun is hot enough to crack stones." },
  { num: 30, shona: "Kupfuma zvekuti mari inoraswa", dudziro: "Kupfuma zvakanyanya zvisingaiti.", sentence: "Murume uya akapfuma zvekuti mari inoraswa.", english: "That man is so rich he has money to throw away." },
  { num: 31, shona: "Kufuta kunge dhibhi", dudziro: "Munhu akasimba kana akafuta zvakanyanya.", sentence: "John akasara ave kufuta kunge dhibhi.", english: "John has become as fat as a dip tank." },
  { num: 32, shona: "Kuwonda zvekuti unogona kupfuura nepamukaha wegonhi", dudziro: "Kuwonda zvakanyanya zvisingaiti.", sentence: "Nekuda kwehurwere, akawonda zvekuti anogona kupfuura nepamukaha wegonhi.", english: "He is so thin he could fit through the crack of a door." },
  { num: 33, shona: "Munhu anogona kudya mombe yose akapedza", dudziro: "Munhu anodya chikafu chakawanda zvakanyanya.", sentence: "Sekuru vane nzara, vanogona kudya mombe yose vakapedza.", english: "Grandfather is so hungry he could eat a whole cow." },
  { num: 34, shona: "Kugara pazvigunwe", dudziro: "Kutya kana kushushikana nekumirira chinhu.", sentence: "Tese takange takagara pazvigunwe panguva yemutambo.", english: "We were all on our toes (extremely anxious)." },
  { num: 35, shona: "Kupwanya musoro nemazwi", dudziro: "Kutuka munhu zvakaipisisa kana kutaura zvinhu zvinorema.", sentence: "Akandipwanya musoro nemazwi ake anorwadza.", english: "He crushed my head (spirit) with his painful words." },
  { num: 36, shona: "Kuchema misodzi yeropa", dudziro: "Kurwadziwa zvakanyanya neshungu.", sentence: "Akachema misodzi yeropa mwana wake paakafa.", english: "He cried tears of blood (intense grief)." },
  { num: 37, shona: "Nzira haina mugumo", dudziro: "Rwendo rwakareba zvakanyanya.", sentence: "Rwendo rwekuenda kuDande rwakaita sekuti nzira haina mugumo.", english: "The journey felt like the road had no end." },
  { num: 38, shona: "Kutsveta rurimi pasi", dudziro: "Kunyara zvakanyanya.", sentence: "Akatsveta rurimi pasi paakaudzwa mhosva yake.", english: "He was extremely ashamed (tongue touched the ground)." },
  { num: 39, shona: "Kukwira makomo nemisoro", dudziro: "Kuita mabasa akaoma zvakanyanya.", sentence: "Kuti uwane mari mazuva ano, unotokwira makomo nemisoro.", english: "To make money these days, you have to climb mountains with your head (do the impossible)." },
  { num: 40, shona: "Kusvetuka denga", dudziro: "Kufara zvisingaite.", sentence: "Akasvetuka denga paakapiwa motokari.", english: "He jumped to the heavens with joy." },
  { num: 41, shona: "Kutaura kusvika mapapu aoma", dudziro: "Kutaura zvakanyanya zvekuti unonzwa kuneta muhuro.", sentence: "Ndakataura naye kusvika mapapu aoma.", english: "I talked to him until my lungs were dry." },
  { num: 42, shona: "Munhu murefu kunge muti wemupaini", dudziro: "Munhu murefu zvakanyanya.", sentence: "Mukomana uya murefu kunge muti wemupaini.", english: "That boy is as tall as a pine tree." },
  { num: 43, shona: "Kumedza matombo", dudziro: "Kutsungirira nhamo yakanyanya.", sentence: "Mhuri iyoyo yakamedza matombo panguva yenzara.", english: "That family endured extreme hardships (swallowed stones)." },
  { num: 44, shona: "Mhepo inovhuvhuta zvekubvisa dzimba", dudziro: "Mhepo ine simba rakanyanya.", sentence: "Mhepo yakavhuvhuta zvekubvisa dzimba usiku.", english: "The wind blew hard enough to move houses." },
  { num: 45, shona: "Kupaza mwoyo", dudziro: "Kurwadziwa zvakanyanya.", sentence: "Mashoko aya anopaza mwoyo.", english: "These words are heartbreaking." },
  { num: 46, shona: "Kurota ndakamuka", dudziro: "Kuva nepfungwa dzekufungidzira zvinhu zvisipo.", sentence: "Kuti ndichawana mari iyoyo kurota ndakamuka.", english: "To think I'll get that money is daydreaming." },
  { num: 47, shona: "Doro rinodhaka zvekukanganwa zita", dudziro: "Doro rine simba rakanyanya.", sentence: "Ukanwa mupanda iwoyo, unodhaka zvekukanganwa zita.", english: "If you drink that, you'll get so drunk you'll forget your own name." },
  { num: 48, shona: "Kunyarara zvekuti unonzwa tsono ichidonha", dudziro: "Kunyarara kwakanyanya.", sentence: "Mufundisi paaitaura, vanhu vakati zii kunyarara zvekuti unonzwa tsono ichidonha.", english: "It was so quiet you could hear a pin drop." },
  { num: 49, shona: "Kutakura nyika pamapfudzi", dudziro: "Kuva nematambudziko mazhinji kana mabasa akawandisa.", sentence: "Amai vanonzwa sekuti vakatakura nyika pamapfudzi nekuchengeta nherera.", english: "Mother feels like she is carrying the whole world on her shoulders." },
  { num: 50, shona: "Chiso chakashata zvekuti imbwa inotiza", dudziro: "Munhu akashata kumeso zvakanyanya.", sentence: "Munhu uya ane chiso chakashata zvekuti imbwa inotiza.", english: "That person is so ugly even a dog would run away." },
  { num: 51, shona: "Kuseka ruzha runonzwika kuHarare", dudziro: "Kuseka zvine ruzha rukuru kwazvo.", sentence: "Saka maseka ruzha runonzwika kuHarare.", english: "You are laughing so loudly it can be heard in Harare." },
  { num: 52, shona: "Kufudza mombe dzedenga", dudziro: "Kuita basa risina zvachinobatsira kana kurota zvisingaitike.", sentence: "Kufunga kuti uchapfuma usina kushanda kufudza mombe dzedenga.", english: "Thinking you'll be rich without working is daydreaming (herding heaven's cattle)." },
  { num: 53, shona: "Munhu anofamba kunge asina mapfupa", dudziro: "Kufamba nenzira inoratidza kuneta kana unyope hwakanyanya.", sentence: "Kufamba kwaunoita kunge usina mapfupa.", english: "You walk as if you have no bones (lazy/sluggish)." },
  { num: 54, shona: "Zuva rakarara munzira", dudziro: "Rwendo rwakatora nguva yakareba zvisingaiti.", sentence: "Takafamba kusvika zuva rakarara munzira.", english: "We walked until the sun slept on the road (a very long time)." },
  { num: 55, shona: "Kupfeka hembe dzinobata moto", dudziro: "Kupfeka zvakanaka zvakanyanya.", sentence: "Nhasi wakapfeka hembe dzinobata moto.", english: "Today you are dressed incredibly well (clothes that catch fire)." },
  { num: 56, shona: "Mwoyo wakafa", dudziro: "Kusava nemanzwiro kana kupererwa netariro.", sentence: "Kubva paakafirwa nemudzimai, mwoyo wake wakafa.", english: "His heart died (he lost all emotion/hope)." },
  { num: 57, shona: "Kutsvaka tsono musora", dudziro: "Kuita basa rakaoma zvakanyanya zvekutoshaya mukana wekubudirira.", sentence: "Kutsvaka mwana uya muguta reHarare kwakafanana nekutsvaka tsono musora.", english: "Looking for that child in Harare is like looking for a needle in a haystack." },
  { num: 58, shona: "Kumedza ruzha", dudziro: "Kunyarara nekutya.", sentence: "Paakaona mambo, akabva amedza ruzha.", english: "He swallowed his noise (became deathly silent out of fear)." },
  { num: 59, shona: "Kudya nemoyo", dudziro: "Kushuvira chinhu zvakanyanya (chishuwo).", sentence: "Sadza iro ndiri kuridya nemoyo.", english: "I am eating that sadza with my heart (intense craving)." },
  { num: 60, shona: "Kuchembera kwekuti munhu anosara ave mwana", dudziro: "Kukwegura zvakanyanya.", sentence: "Sekuru vakachembera kwekuti vakasara vave mwana.", english: "Grandfather grew so old he became like a child again." },
  { num: 61, shona: "Kupaza matama nekuseka", dudziro: "Kuseka zvakanyanya.", sentence: "Nyaya yenyu yatipaza matama nekuseka.", english: "Your story made our cheeks burst with laughter." },
  { num: 62, shona: "Kumirira kusvika vhudzi rachena", dudziro: "Kumirira kwenguva refu zvakanyanya.", sentence: "Ndinogona kumukumirirai kusvika vhudzi rachena.", english: "I can wait for you until my hair turns white." },
  { num: 63, shona: "Kudira muto pakaoma", dudziro: "Kuita chinhu chinoita kuti nyaya iwedzere kunaka kana kuipa (exaggerating).", sentence: "Nyaya yaChipo inonakidza, anogona kudira muto pakaoma.", english: "Chipo knows how to spice up a story (pour soup on dry ground)." },
  { num: 64, shona: "Kuvhara denga nemichindo", dudziro: "Kuzvikudza nekuvimbisa zvinhu zvisingaitike.", sentence: "Vezvematongerwo enyika vanovimbisa kuvhara denga nemichindo.", english: "Politicians promise to cover the sky with mats (impossible promises)." },
  { num: 65, shona: "Kufema moto", dudziro: "Kuva nehasha dzakanyanya.", sentence: "Baba vari kufema moto nhasi.", english: "Father is breathing fire today (very angry)." },
  { num: 66, shona: "Kurara hope dzekufa", dudziro: "Kurara zvakasimba zvekutadza kunzwa kana ruzha.", sentence: "Mwana akarara hope dzekufa.", english: "The child is sleeping like the dead (very deep sleep)." },
  { num: 67, shona: "Kupfira mate pasi akasadzoka", dudziro: "Kutsidza chinhu zvakasimba.", sentence: "Ndakatsidza kuti handichaba, ndakapfira mate pasi akasadzoka.", english: "I swore never to steal again (spat on the ground and it won't come back)." },
  { num: 68, shona: "Kupaza dura remashoko", dudziro: "Kutaura zvakawanda zvakavandika.", sentence: "Paakatanga kutaura, akapaza dura remashoko.", english: "When he started talking, he broke open a granary of words (revealed everything)." },
  { num: 69, shona: "Zuva riri kurova mapfupa", dudziro: "Kupisa kwezuva kunonzwika mukati memuviri.", sentence: "Buda panze unzwe zuva riri kurova mapfupa.", english: "The sun is beating down on the bones (very hot)." },
  { num: 70, shona: "Munhu anodya zvese zvinofamba", dudziro: "Munhu anodya chero chikafu chaawana (eating too much/anything).", sentence: "Zonzi uyu anodya zvese zvinofamba.", english: "This guy eats everything that moves." },
  { num: 71, shona: "Kupenya kunge sirivha", dudziro: "Kuchena zvakanyanya.", sentence: "Hembe yake yakati mbuu kupenya kunge sirivha.", english: "His shirt was as bright as silver." },
  { num: 72, shona: "Kurasika kusvika pakushaya nzira yekumba", dudziro: "Kuvhiringidzika zvakanyanya.", sentence: "Ndakavhiringidzika nekubvunza kusvika ndarasika nzira yekumba.", english: "I was so confused I forgot the way home." },
  { num: 73, shona: "Gomo rinozunguzika", dudziro: "Munhu ane simba guru kana ane uremu hukuru anofamba.", sentence: "Murume uya kana achifamba kunge gomo rinozunguzika.", english: "When that man walks, it's like a mountain is shaking." },
  { num: 74, shona: "Kuguma kwenyika", dudziro: "Chinhu chinotyisa kana chinoshamisa zvakanyanya.", sentence: "Zvaakaita izvi kuguma kwenyika.", english: "What he did is like the end of the world." },
  { num: 75, shona: "Kupedza makungwa nemadziva", dudziro: "Kunwa mvura yakawanda zvakanyanya.", sentence: "Nyota yandivava, ndinopedza makungwa nemadziva.", english: "My thirst is so bad I'll finish oceans and pools." },
  { num: 76, shona: "Musoro wakaita kunge ibwe", dudziro: "Munhu asingateereri kana akaomarara pfungwa.", sentence: "Mwana uyu ane musoro wakaita kunge ibwe.", english: "This child has a head like a stone (stubborn)." },
  { num: 77, shona: "Kutamba nemheni", dudziro: "Kuita chinhu chine njodzi huru.", sentence: "Kuba kumapurisa kutamba nemheni.", english: "Stealing from the police is like playing with lightning." },
  { num: 78, shona: "Kupinda mugomba remakonzo", dudziro: "Kutya zvekuda kuhwanda kusingaonekwi.", sentence: "Mbavha paakaona mapurisa akada kupinda mugomba remakonzo.", english: "When the thief saw the police, he wanted to crawl into a rat hole." },
  { num: 79, shona: "Kudya rurimi", dudziro: "Kutadza kutaura nekuda kwekutya kana kunyara.", sentence: "Paakabvunzwa nemukuru, akadya rurimi.", english: "When he was questioned by the superior, he 'ate his tongue' (was speechless)." },
  { num: 80, shona: "Kurova pasi nehana", dudziro: "Kutya zvakanyanya hana ichirova.", sentence: "Ndakati pasi nehana kurova pandakaona nyoka.", english: "My heart beat against the floor with fear." },
  { num: 81, shona: "Kucheka mhepo", dudziro: "Kumhanya nekukurumidza.", sentence: "Bhasikoro riya raicheka mhepo.", english: "That bicycle was cutting through the wind." },
  { num: 82, shona: "Kupisika nemwoyo", dudziro: "Kushushikana zvakanyanya.", sentence: "Ari kupisika nemwoyo nekuda kwerubatsiro rwaari kutsvaka.", english: "He is burning with anxiety/distress." },
  { num: 83, shona: "Nzara yekutokanganwa zita raamai", dudziro: "Nzara yakanyanya.", sentence: "Ndine nzara yekutokanganwa zita raamai.", english: "I am so hungry I could forget my mother's name." },
  { num: 84, shona: "Munhu mupfupi kunge chigutsa", dudziro: "Munhu mupfupi zvakanyanya.", sentence: "Munhu uya mupfupi kunge chigutsa.", english: "That person is as short as a tree stump." },
  { num: 85, shona: "Kumedza nungo", dudziro: "Kuva neunyope hwakanyanya.", sentence: "Mukomana uyu akamedza nungo dzenyika yose.", english: "This boy swallowed the laziness of the whole world." },
  { num: 86, shona: "Kutsveta hana parutivi", dudziro: "Kuita zvakaipa usina tsitsi kana kutya.", sentence: "Akatsveta hana parutivi ndokubira nherera.", english: "He set his conscience aside and robbed the orphans." },
  { num: 87, shona: "Mvura inonaya semadhaka", dudziro: "Kunaya kwemvura yakawanda zvakanyanya.", sentence: "Mvura yanaya semadhaka nhasi.", english: "It rained 'mud' today (heavy downpour)." },
  { num: 88, shona: "Kufuta zvekutadza kuzviona tsoka", dudziro: "Kufuta zvakanyanya.", sentence: "Sekuru vakafuta zvekutadza kuzviona tsoka.", english: "Grandfather is so fat he can't see his own feet." },
  { num: 89, shona: "Kutsemuka mwoyo", dudziro: "Kuvhunduka zvakanyanya.", sentence: "Ndakatsemuka mwoyo pandakanzwa mhere usiku.", english: "My heart broke/split with fear when I heard the scream at night." },
  { num: 90, shona: "Zino rinocheka kunge banga", dudziro: "Kuva nezino rakapinza kana kurwadziwa nezino.", sentence: "Zino riri kundicheka kunge banga.", english: "My tooth is cutting me like a knife." },
  { num: 91, shona: "Kufamba segakanje", dudziro: "Kufamba nenzira isina kunaka kana isina kurongeka.", sentence: "Doro raita kuti afambe segakanje.", english: "The beer made him walk like a crab." },
  { num: 92, shona: "Kumedza mazwi", dudziro: "Kutadza kutaura zvakajeka nekuda kwekutya.", sentence: "Mwana akamedza mazwi paakatukwa.", english: "The child swallowed his words when he was scolded." },
  { num: 93, shona: "Kutsika moto", dudziro: "Kupinda mumatambudziko makuru.", sentence: "Ukaenda ikoko unenge watsika moto.", english: "If you go there, you will be stepping on fire (entering trouble)." },
  { num: 94, shona: "Kuvhara nzeve nemoto", dudziro: "Kusada kuteerera mazano zvachose.", sentence: "Musikana uya akavhara nzeve nemoto.", english: "This girl has closed her ears with fire (won't listen to anything)." },
  { num: 95, shona: "Kupfeka dehenya", dudziro: "Kusava nenjere kana kutaura zvisina musoro.", sentence: "Zvaari kutaura unenge akapfeka dehenya.", english: "What he's saying sounds like he's wearing an empty skull." },
  { num: 96, shona: "Kudya rudo", dudziro: "Kupengeswa nerudo rwemunhu.", sentence: "John akadya rudo rwaMary.", english: "John is consumed (crazy) by his love for Mary." },
  { num: 97, shona: "Kutakura denga", dudziro: "Kuzvikudza zvekuzviona semunhu akakosha kupfuura vamwe.", sentence: "Murume uya anofamba kunge akatakura denga.", english: "That man walks like he's carrying the heavens." },
  { num: 98, shona: "Kunyimwa kusvika pakuva hura", dudziro: "Kunyimwa chikafu zvakanyanya.", sentence: "Vana avo vanonyimwa kusvika pakuva hura.", english: "Those children are so starved they are just 'guts' (skin and bones)." },
  { num: 99, shona: "Kupisa mwoyo", dudziro: "Kuita shanje.", sentence: "Zvaakatenga motokari zvinomupisa mwoyo.", english: "It burns his heart (he is jealous) that he bought a car." },
  { num: 100, shona: "Kutaura nehana", dudziro: "Kutaura pfungwa dzako dzomukati-kati.", sentence: "Panguva iyoyo ndakataura nehana yangu.", english: "At that moment, I spoke from my very soul/conscience." },
  { num: 101, shona: "Kupedza mhepo", dudziro: "Kutaura zvinhu zvisina basa kwenguva refu.", sentence: "Rega kupedza mhepo uchitaura makuhwa.", english: "Stop wasting air talking about gossip." },
  { num: 102, shona: "Kupona nepaburi retsono", dudziro: "Kupukunyuka munjodzi nenzira yemanenji.", sentence: "Ndakapona nepaburi retsono pangozi yemotokari iya.", english: "I survived through the eye of a needle (a narrow escape)." }
];

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const HyperboleCard = memo(({ item, isHighlighted }: { item: HyperboleItem; isHighlighted: boolean }) => {
  return (
    <div
      id={`hyperbole-${item.num}`}
      className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
        isHighlighted
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500/50 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-red-300 dark:hover:border-red-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Number badge */}
        <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              isHighlighted
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
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
                ? 'text-red-900 dark:text-red-100'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {item.shona}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left column: Dudziro + Muenzaniso */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block mb-1 tracking-wider">
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
export const Hyperboles: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [randomItem, setRandomItem] = useState<HyperboleItem | null>(null);

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
      const match = HYPERBOLES.find(
        item =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.dudziro.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.num);
        setTimeout(() => {
          const element = document.getElementById(`hyperbole-${match.num}`);
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
    const random = HYPERBOLES[Math.floor(Math.random() * HYPERBOLES.length)];
    setRandomItem(random);
  }, []);

  const refreshRandom = () => {
    const random = HYPERBOLES[Math.floor(Math.random() * HYPERBOLES.length)];
    setRandomItem(random);
  };

  // ─── Sticky Navigation (single tab) ─────────────────────────────────────
  const NavTab = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          className="rounded-full px-4 py-1.5 text-xs font-semibold bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-900/30"
        >
          Kuwedzeredza Kwose ({HYPERBOLES.length})
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
            MADIMIKIRA EKUWEDZEREDZA
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Kuwedzeredza
          </h1>
          <p className="text-lg text-red-100 max-w-2xl leading-relaxed">
            Madimikira ekuwedzeredza (Hyperboles) anotsanangura chinhu nenzira inodarika chokwadi kuitira kusimbisa pfungwa, kuratidza kunyanya kwechinhu, kana kusekesa.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-red-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {HYPERBOLES.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random hyperbole</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-red-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a hyperbole or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-red-200/70 font-medium"
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
                  <X size={18} className="text-red-200" />
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
          {/* List of Hyperboles */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Kuwedzeredza Kwose
              </span>
              <span>{HYPERBOLES.length} shown</span>
            </div>

            {HYPERBOLES.map((item) => (
              <HyperboleCard
                key={item.num}
                item={item}
                isHighlighted={item.num === highlightedId}
              />
            ))}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Hyperbole Card */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">✨ Random Hyperbole</h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-red-500 dark:text-red-400" />
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
                  <span>Kuwedzeredza Kwose</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {HYPERBOLES.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Shona entries</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {HYPERBOLES.length}
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
                Hyperboles are used to create emphasis, drama, and humor. In Shona, they enrich storytelling and everyday speech, making descriptions more vivid and memorable.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-red-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Hyperboles:</strong> Exaggerated expressions for emphasis.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dudziro:</strong> Explanation in Shona to clarify the figurative meaning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences showing real‑life usage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>
                <strong className="text-white">English Meaning:</strong> Translation for broader understanding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-300 font-bold">•</span>
              <span>Use the search bar to find a specific hyperbole or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hyperboles;