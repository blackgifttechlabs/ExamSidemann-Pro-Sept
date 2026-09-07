import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Search, X, ChevronUp, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE & DATA
// ──────────────────────────────────────────────────────────────────────────────

interface EuphemismItem {
  shona: string;
  literal: string;
  euphemistic: string;
  sentence: string;
  english: string;
}

interface EuphemismSection {
  category: string;
  items: EuphemismItem[];
}

// ─── Flattened item with category and unique id ────────────────────────────
interface FlattenedItem extends EuphemismItem {
  id: number;
  category: string;
}

const SECTIONS: EuphemismSection[] = [
  {
    category: "NezveRufu (About Death)",
    items: [
      { shona: "Kushaya", literal: "To lack.", euphemistic: "Kufa; to die.", sentence: "Sekuru vangu vakashaya nezuro manheru.", english: "My grandfather passed away yesterday evening." },
      { shona: "Kuenda musango", literal: "To go into the bush/forest.", euphemistic: "Kufa; to die.", sentence: "Takanzwa kuti mudhara Mhofu akaenda musango.", english: "We heard that old man Mhofu has passed on." },
      { shona: "Kuzorora", literal: "To rest.", euphemistic: "Kufa (Kuzorora mumatambudziko enyika).", sentence: "Mbuya vakazorora muna mwedzi waGumiguru.", english: "Grandmother passed away in the month of October." },
      { shona: "Kusiya nyika", literal: "To leave the world.", euphemistic: "Kufa.", sentence: "Baba vaChipo vakasiya nyika svondo rakapera.", english: "Chipo’s father passed away last week." },
      { shona: "Kuidira kune vasingadzoke", literal: "To pour/go to those who do not return.", euphemistic: "Kufa.", sentence: "Sekuru vakaidira kune vasingadzoke.", english: "Grandfather has passed on to the afterlife." },
      { shona: "Kuguma rwendo", literal: "To end the journey.", euphemistic: "Kufa (kupedza kurarama pano pasi).", sentence: "Rwendo rwaMai mufundisi rwakaguma nezuro.", english: "The pastor's wife's life journey came to an end yesterday." },
      { shona: "Kuputsika kwedanda", literal: "The falling of a large log.", euphemistic: "Kufa kwemunhu anoremekedzwa kana mutungamiri.", sentence: "Mambo vakaidza kuputsika kwedanda munharaunda yedu.", english: "The chief’s passing was a great loss to our community." },
      { shona: "Kudzimika kwechiedza", literal: "The extinguishing of a light.", euphemistic: "Kufa kwemunhu anga ari mbiri kana muenzaniso.", sentence: "Chiedza chemhuri chakadzimika.", english: "The shining star of the family has died." },
      { shona: "Kuva nenyika", literal: "To belong to the earth.", euphemistic: "Kuvigwa kana kufa.", sentence: "Sekuru vave nenyika.", english: "Grandfather has been buried / has passed away." },
      { shona: "Kupinda muna amai vavo", literal: "To enter into their mother.", euphemistic: "Kuvigwa muvhu (amai vemunhu vose).", sentence: "Mufi akapinda muna amai vavo masikati ano.", english: "The deceased was laid to rest this afternoon." },
      { shona: "Kurara hope dzisingamuki", literal: "To sleep a sleep that one doesn't wake up from.", euphemistic: "Kufa.", sentence: "Mukoma vakarara hope dzisingamuki.", english: "My brother has passed away (eternal sleep)." },
      { shona: "Kudaidzwa naIshe", literal: "To be called by the Lord.", euphemistic: "Kufa (kunyanya kuvanhu vanonamata).", sentence: "Mufundisi vakadaidzwa naIshe.", english: "The pastor has been called to glory/passed away." }
    ]
  },
  {
    category: "NezveNhumbu neKusununguka (Pregnancy and Birth)",
    items: [
      { shona: "Kuva nepamuviri", literal: "To have something on the body.", euphemistic: "Kuva nenhumbu (pregnant).", sentence: "Mainini vari nepamuviri.", english: "My aunt is pregnant." },
      { shona: "Kuzvitakura", literal: "To carry oneself.", euphemistic: "Kuva nenhumbu.", sentence: "Mudzimai wake akazvitakura.", english: "His wife is expecting/pregnant." },
      { shona: "Kuva nemuviri unorema", literal: "To have a heavy body.", euphemistic: "Kuva nenhumbu yasvika pedyo.", sentence: "Sisi vave nemuviri unorema mazuva ano.", english: "My sister is in the late stages of pregnancy." },
      { shona: "Kusununguka", literal: "To be untied/set free.", euphemistic: "Kubereka mwana.", sentence: "Ambuya vakabatsira amai kusununguka.", english: "The midwife helped mother give birth." },
      { shona: "Kuwana mwana", literal: "To find a child.", euphemistic: "Kubereka mwana mutsva.", sentence: "VakwaMutasa vakawana mwana mukomana.", english: "The Mutasa family were blessed with a baby boy." },
      { shona: "Kuva netsoka mbiri", literal: "To have two pairs of feet.", euphemistic: "Kuva nenhumbu.", sentence: "Muroora wenyu ava netsoka mbiri.", english: "Your daughter-in-law is pregnant." },
      { shona: "Kubuda mumba", literal: "To come out of the room.", euphemistic: "Kupedza mazuva ekuzvarwa kwemwana (post-partum seclusion).", sentence: "Mai mwana vabuda mumba nhasi.", english: "The mother has completed her post-birth seclusion period." },
      { shona: "Kupfumbatira", literal: "To clutch or hold in the hand.", euphemistic: "Kubereka mwana (kunyanya mwana mupenyu).", sentence: "Mwari akamuitira nyasha akapfumbatira mwana.", english: "God was merciful and she safely delivered a baby." }
    ]
  },
  {
    category: "NezveKurwara (About Illness)",
    items: [
      { shona: "Asina kusimba", literal: "One who is not strong.", euphemistic: "Munhu ari kurwara.", sentence: "Baba havasi kusimba mazuva ano.", english: "Father is not feeling well (sick) these days." },
      { shona: "Kugara pasi", literal: "To sit down.", euphemistic: "Kurwara zvekutotadza kufamba kana kuita mabasa.", sentence: "Sekuru vakagara pasi nehurwere.", english: "Grandfather is bedridden due to illness." },
      { shona: "Kubatwa nemuviri", literal: "To be caught by the body.", euphemistic: "Kurwara.", sentence: "Mwana akabatwa nemuviri usiku.", english: "The child fell ill during the night." },
      { shona: "Kurasika pfungwa", literal: "To lose one's mind.", euphemistic: "Kupenga (mentally ill).", sentence: "Mukomana uyu akamborasika pfungwa.", english: "This boy once suffered from mental illness." },
      { shona: "Chirwere chemazuva ano", literal: "The disease of these days.", euphemistic: "HIV/AIDS (euphemism used to avoid stigma).", sentence: "Vanhu vazhinji vakapera nechirwere chemazuva ano.", english: "Many people were affected by the modern disease (HIV/AIDS)." },
      { shona: "Kubatwa nehope", literal: "To be caught by sleep.", euphemistic: "Kukotsira munhu achitaura kana ari pavanhu.", sentence: "Mbuya vakabatwa nehope vachitaura nesu.", english: "Grandmother drifted off to sleep while talking to us." },
      { shona: "Kushaya simba", literal: "To lack strength.", euphemistic: "Kuneta zvakanyanya kana kurwara.", sentence: "Amai vakati vashaya simba nekurwara.", english: "Mother said she feels very weak due to illness." }
    ]
  },
  {
    category: "NezveZvepanze/Tsvina (Bodily Functions/Toilet)",
    items: [
      { shona: "Kuenda panze", literal: "To go outside.", euphemistic: "Kuenda kuchimbuzi (to go to the toilet).", sentence: "Ndokumbirawo kuenda panze.", english: "May I please go to the restroom." },
      { shona: "Kuzvibatsira", literal: "To help oneself.", euphemistic: "Kuita tsvina kana mupfunga (relieving oneself).", sentence: "Mwana aenda kunozvibatsira.", english: "The child has gone to relieve himself." },
      { shona: "Kugeza maoko", literal: "To wash hands.", euphemistic: "Kuenda kuchimbuzi (kunyanya kuvarume).", sentence: "Sekuru vati vari kunogeza maoko.", english: "Grandfather said he is going to the restroom." },
      { shona: "Kushanyira mazuva ose", literal: "To visit the daily ones.", euphemistic: "Kuenda kuchimbuzi.", sentence: "Rega ndimomboti shanyirei mazuva ose.", english: "Let me quickly go to the restroom." },
      { shona: "Kuenda kusango", literal: "To go to the bush.", euphemistic: "Kuita tsvina (kunyanya kumaruzevha kusina zvimbuzi).", sentence: "Vafudzi vaenda kusango.", english: "The herders have gone to relieve themselves in the bush." },
      { shona: "Kuona madzimai", literal: "To see the women/ladies.", euphemistic: "Kutevera kumwedzi (menstruation).", sentence: "Sisi vari kuona madzimai nhasi.", english: "My sister is on her menstrual period." },
      { shona: "Kugeza muviri", literal: "To wash the body.", euphemistic: "Kugeza (bathing).", sentence: "Baba vari kunogeza muviri.", english: "Father is taking a bath." },
      { shona: "Kusvasvanyira", literal: "To scatter/sprinkle.", euphemistic: "Kuburitsa mweya (farting - used politely for children).", sentence: "Mwana asvasvanyira mumba.", english: "The child has passed gas in the room." }
    ]
  },
  {
    category: "NezveUrombo neKushaya (Poverty and Lack)",
    items: [
      { shona: "Vakaderera", literal: "The lowered ones.", euphemistic: "Varombo (the poor).", sentence: "Hurumende inobatsira vanhu vakaderera.", english: "The government helps the underprivileged/poor people." },
      { shona: "Asina kubata zvakanaka", literal: "One who has not held well.", euphemistic: "Munhu asina mari kana pfuma.", sentence: "Panguva ino haana kubata zvakanaka.", english: "At the moment, he is financially struggling." },
      { shona: "Vatambudzi", literal: "The troubled ones.", euphemistic: "Varombo kana vanoshaya.", sentence: "Mhuri iyoyo ivatambudzi.", english: "That family is very poor." },
      { shona: "Kudya zvemanheru masikati", literal: "Eating dinner at lunch.", euphemistic: "Kushaya zvekudya zvakakwana.", sentence: "Mazuva ano tiri kudya zvemanheru masikati.", english: "These days we are struggling to have enough meals." },
      { shona: "Kusunga bhande", literal: "To tighten the belt.", euphemistic: "Kutsungirira nzara kana kushaya.", sentence: "Gore rino tichasunga bhande.", english: "This year we will have to endure hardship/poverty." }
    ]
  },
  {
    category: "NezveKukanganisika kweMuviri (Physical Disabilities)",
    items: [
      { shona: "Asingaoni", literal: "One who does not see.", euphemistic: "Bofu (Blind person).", sentence: "Takaona harahwa isingaoni ichiyambuka mugwagwa.", english: "We saw a blind old man crossing the road." },
      { shona: "Asinganzwi", literal: "One who does not hear.", euphemistic: "Matsi (Deaf person).", sentence: "Mwana uyu haanzwi nzeve.", english: "This child is deaf." },
      { shona: "Asingatauri", literal: "One who does not speak.", euphemistic: "Mbeveve (Mute person).", sentence: "Shamwari yangu haitauri.", english: "My friend is mute." },
      { shona: "Akaremara", literal: "One who is hindered/disabled.", euphemistic: "Munhu ane hurema hupi ne hupi.", sentence: "Zvikoro zvinofanira kubatsira vana vakaremara.", english: "Schools should assist children with disabilities." },
      { shona: "Asingafambi", literal: "One who does not walk.", euphemistic: "Chirema chemakumbo (Crippled).", sentence: "Ane mwana asingafambi.", english: "He has a child who is unable to walk." }
    ]
  },
  {
    category: "NezveHukama neTsika (Relationships and Social Conduct)",
    items: [
      { shona: "Kurova imbwa nemupinyi", literal: "To hit a dog with a handle.", euphemistic: "Kurova mudzimai (Domestic violence).", sentence: "Kurova imbwa nemupinyi hachisi chinhu chakanaka.", english: "Beating one's wife is not a good thing." },
      { shona: "Kupindwa nemhepo", literal: "To be entered by wind.", euphemistic: "Kupengereka kana kuita manyoka.", sentence: "Mwana akapindwa nemhepo.", english: "The child has a stomach upset/diarrhea." },
      { shona: "Kuraswa nemasaisai", literal: "To be thrown away by waves.", euphemistic: "Kuratidza hunhu husingagamuchiriki munharaunda.", sentence: "Mukomana uyu akaraswa nemasaisai.", english: "This boy has lost his way/is misbehaving badly." },
      { shona: "Kubata kumeso", literal: "To touch the face.", euphemistic: "Kunyengedza munhu (To deceive someone).", sentence: "Rega kundibata kumeso ini ndakura.", english: "Stop deceiving me, I am an adult." },
      { shona: "Kutsika madziro", literal: "To step on walls.", euphemistic: "Kudhakwa zvakanyanya (being drunk).", sentence: "Tazviona vachitsika madziro vachibva kubhawa.", english: "We saw them staggering home drunk from the bar." },
      { shona: "Kudya mari", literal: "To eat money.", euphemistic: "Kushandisa mari zvisizvo kana kuisapamura.", sentence: "Sabhuku akadya mari yebhuku.", english: "The village head misappropriated the community funds." },
      { shona: "Kupfeka kumeso", literal: "To wear a face.", euphemistic: "Kunyepedzera kuva nemufaro kana ruregerero.", sentence: "Akangopfeka kumeso asi ane hasha.", english: "He is just pretending to be happy, but he is angry." },
      { shona: "Kutsika pasi", literal: "To step on the ground.", euphemistic: "Kusvika pane imwe nzvimbo.", sentence: "Nguva yawatsika pasi pano yafadza vanhu.", english: "The time you arrived here has made everyone happy." },
      { shona: "Kudyira mundiro imwe", literal: "Eating from the same plate.", euphemistic: "Kuva neushamwari hwepedyo kwazvo.", sentence: "John naPeter vanodyira mundiro imwe.", english: "John and Peter are very close friends." },
      { shona: "Kupa gotsi", literal: "To give the back of the head.", euphemistic: "Kuratidza kusada munhu kana kufuratira.", sentence: "Akandipa gotsi pandakaenda kunokumbira ruregerero.", english: "He ignored/snubbed me when I went to apologize." },
      { shona: "Kuva neruoko rurefu", literal: "To have a long hand.", euphemistic: "Kuva mbavha (being a thief).", sentence: "Chenjerai mwana iyeye ane ruoko rurefu.", english: "Be careful, that child is a thief." },
      { shona: "Kutsvaka ruregerero", literal: "To seek forgiveness.", euphemistic: "Kukumbira ruregerero (Apologizing).", sentence: "Ndaronga kunotsvaka ruregerero kuna sekuru.", english: "I have planned to go and apologize to my grandfather." },
      { shona: "Kusekerera nhamo", literal: "To smile at trouble.", euphemistic: "Kushingirira mumatambudziko.", sentence: "Mbuya vaiva munhu aikwanisa kusekerera nhamo.", english: "Grandmother was someone who could endure hardships gracefully." },
      { shona: "Kuva nemuromo", literal: "To have a mouth.", euphemistic: "Kuva munhu anopindura vakuru kana anotuka.", sentence: "Musikana uyu ane muromo.", english: "This girl is disrespectful/talks back." },
      { shona: "Kutsika matama", literal: "To step on cheeks.", euphemistic: "Kunyadzisa munhu pamberi pevamwe.", sentence: "Akanditsika matama pamberi pevamwene vangu.", english: "She embarrassed me in front of my mother-in-law." },
      { shona: "Kuve nemwoyo muchena", literal: "To have a white heart.", euphemistic: "Kuva nemutsa (being kind/generous).", sentence: "Amai ava vane mwoyo muchena.", english: "This woman is very kind-hearted." },
      { shona: "Kuve nemwoyo mutema", literal: "To have a black heart.", euphemistic: "Kuva noutsinye kana shanje (being cruel/wicked).", sentence: "Munhu ane mwoyo mutema haadi kuona vamwe vachibudirira.", english: "A wicked person does not want to see others succeed." },
      { shona: "Kusimudza musoro", literal: "To lift the head.", euphemistic: "Kuzvitutumadza kana kuzvida.", sentence: "Anotonzi akasima musoro kubva paakawana mari.", english: "He has become arrogant since he got money." },
      { shona: "Kurasikirwa", literal: "To be lost.", euphemistic: "Kufirwa nemunhu (bereavement).", sentence: "Mhuri yekwaMoyo yakarasikirwa nezuro.", english: "The Moyo family suffered a bereavement yesterday." },
      { shona: "Kuwana imba", literal: "To find a house.", euphemistic: "Kuroorwa (for a woman to get married).", sentence: "Chipo akawana imba kuBulawayo.", english: "Chipo got married and settled in Bulawayo." },
      { shona: "Kutsvaka mushonga", literal: "To seek medicine.", euphemistic: "Kun'anga kana kunotsvaka rubatsiro rwechivanhu.", sentence: "Vakaenda kunotsvaka mushonga kumakomo.", english: "They went to seek traditional help in the mountains." },
      { shona: "Kuchengeta mumba", literal: "To keep in the house.", euphemistic: "Kuita zvechihure/Zvikomba (Having an affair).", sentence: "Zvinonzi ari kuchengeta mumwe murume mumba.", english: "It is said she is having an extramarital affair." },
      { shona: "Kurova pasi", literal: "To hit the ground.", euphemistic: "Kufamba rwendo rurefu netsoka.", sentence: "Takarova pasi kubva kwaMutare.", english: "We walked a long distance from Mutare." },
      { shona: "Kuteerera mhepo", literal: "To listen to the wind.", euphemistic: "Kunzwa makuhwa kana hwenye.", sentence: "Usafarire kuteerera mhepo.", english: "Do not like listening to rumors." },
      { shona: "Kupedza mazuva", literal: "To finish days.", euphemistic: "Kukwegura (growing old).", sentence: "Sekuru vari kupedza mazuva avo murugare.", english: "Grandfather is spending his old age in peace." },
      { shona: "Kudya cheziya", literal: "To eat sweat.", euphemistic: "Kudya zvawakashandira (Eating the fruits of your labor).", sentence: "Munhu wese anofanira kudya cheziya rake.", english: "Everyone should eat what they have worked for." },
      { shona: "Kushanda nesimba", literal: "To work with strength.", euphemistic: "Kushanda zvakasimba (Diligent work).", sentence: "Vadzidzi vanofanira kushanda nesimba.", english: "Students should study/work hard." },
      { shona: "Kusungwa mwoyo", literal: "To have the heart tied.", euphemistic: "Kuda munhu zvakanyanya kana kupengeswa nerudo.", sentence: "Mukomana akasungwa mwoyo nemusikana uya.", english: "The boy is deeply in love with that girl." },
      { shona: "Kuva negodo", literal: "To have a bone (metaphorical).", euphemistic: "Kuva neshanje (being jealous).", sentence: "Munhu ane godo haafari vamwe vakatenga motokari.", english: "A jealous person is not happy when others buy cars." },
      { shona: "Kubvisa guva", literal: "To remove the grave.", euphemistic: "Mutambo wekurova makuva (traditional ceremony to bring back the spirit).", sentence: "VekwaMoyo vari kubvisa guva raisekuru vavo nhasi.", english: "The Moyo family is holding a memorial ceremony today." },
      { shona: "Kuomesa mwoyo", literal: "To harden the heart.", euphemistic: "Kusava netsitsi (being cold-hearted).", sentence: "Akange akaomesa mwoyo kune vana vake.", english: "He was very cold-hearted toward his children." },
      { shona: "Kupfumbatira maoko", literal: "To fold hands.", euphemistic: "Kuva nungo (being lazy).", sentence: "Kupfumbatira maoko hakuunzi kudya patafura.", english: "Being lazy doesn't bring food to the table." },
      { shona: "Kusima musoro", literal: "To plant the head.", euphemistic: "Kunyara (being shy).", sentence: "Musikana akasima musoro pasi paakaona vamwene vake.", english: "The girl looked down shyly when she saw her mother-in-law." },
      { shona: "Kusekerera", literal: "To smile.", euphemistic: "Kuratidza mufaro (showing happiness).", sentence: "Mwana akasekerera paakaona amai.", english: "The child smiled when he saw his mother." },
      { shona: "Kutsika madhaka", literal: "To step on mud.", euphemistic: "Kupindana mumatambudziko (getting into trouble).", sentence: "Tatsika madhaka nezvavakaita izvi.", english: "We are in a mess because of what they did." },
      { shona: "Kupfuura nemumvura", literal: "To pass through water.", euphemistic: "Kupfuura mumatambudziko akakura.", sentence: "Mhuri iyoyo yakapfuura nemumvura gore rino.", english: "That family went through very difficult times this year." },
      { shona: "Kubvarura muromo", literal: "To tear the mouth.", euphemistic: "Kutaura zvinorwadza kana zvinonyadzisa.", sentence: "Akabvarura muromo pamberi pevanhu.", english: "He spoke rudely in front of people." },
      { shona: "Kusangana", literal: "To meet.", euphemistic: "Kuita zvepabonde (Sexual intercourse - used in marriage contexts).", sentence: "Murume nemudzimai vanosungirwa kusangana.", english: "A husband and wife are expected to be intimate." },
      { shona: "Kutamba nemoto", literal: "To play with fire.", euphemistic: "Kuzvipinza muna mupata wepfuti (risking danger).", sentence: "Zvauri kuita kuseka mambo kuseka nemoto.", english: "Mocking the chief is like playing with fire." },
      { shona: "Kukandira mapfumo pasi", literal: "To throw spears down.", euphemistic: "Kukanda mapfumo pasi (Surrendering/Giving up).", sentence: "Masimba akakandira mapfumo pasi pakurwa.", english: "Masimba surrendered during the fight." },
      { shona: "Kugara nhaka", literal: "To sit on the inheritance.", euphemistic: "Kuroora mudzimai wehama yakafa (Wife inheritance).", sentence: "Mukuwasha akabvuma kugara nhaka.", english: "The son-in-law agreed to the traditional wife inheritance." },
      { shona: "Kutema ugariri", literal: "To cut for waiting.", euphemistic: "Kushanda pamusha pevamwene kuti uwane mukadzi (Working for a wife).", sentence: "Sekuru vakatemera ugariri kwaMurehwa.", english: "Grandfather worked for his bride's family in Murehwa as dowry." },
      { shona: "Kubata maoko", literal: "To hold hands.", euphemistic: "Kunonyaradza vakafirwa (paying condolences).", sentence: "Tinoda kunobata maoko kwaMoyo.", english: "We want to go and offer our condolences to the Moyo family." },
      { shona: "Kurova gusvi", literal: "To clap hands hollowly.", euphemistic: "Kuratidza ruremekedzo (showing respect).", sentence: "Vana vakarova gusvi vachitenda chipo.", english: "The children clapped respectfully while thanking for the gift." },
      { shona: "Kuchema", literal: "To cry.", euphemistic: "Kunamatira munhu (Supplicating/Praying for someone or a cause).", sentence: "Mbuya vari kuchema kunyika yedu.", english: "Grandmother is praying fervently for our country." },
      { shona: "Kudya hwenye", literal: "To eat rumors.", euphemistic: "Kufarira makuhwa.", sentence: "Vakadzi avo vanofarira kudya hwenye.", english: "Those women enjoy gossiping." },
      { shona: "Kufuka machira maviri", literal: "To wear two blankets.", euphemistic: "Kuva munhu ane chivindi kana anotyisa.", sentence: "Harahwa iyoyo inofuka machira maviri.", english: "That old man is a formidable/powerful character." },
      { shona: "Kushaya hope", literal: "To lack sleep.", euphemistic: "Kuva nekuzvidya mwoyo (being worried).", sentence: "Ndave nenguva ndichishaya hope nenyaya iyi.", english: "I have been worried about this matter for a while." },
      { shona: "Kupwanyira mwoyo", literal: "To crush for the heart.", euphemistic: "Kunyara munhu zvekutadza kutaura chokwadi.", sentence: "Ndakamupwanyira mwoyo ndikarega kumubvunza mari yangu.", english: "I was too shy/respectful to ask him for my money." },
      { shona: "Kuwana munhu", literal: "To find a person.", euphemistic: "Kuroora kana kuroorwa (getting a spouse).", sentence: "Tinashe akazowana munhu gore rino.", english: "Tinashe finally got married this year." },
      { shona: "Kusvitsa shoko", literal: "To deliver the word.", euphemistic: "Kuudza vamwe zviri kuitika (Reporting or proposing).", sentence: "Ndakandotsvitsa shoko kuna mambo.", english: "I went to deliver the report to the chief." },
      { shona: "Kutsika mutsvairo", literal: "To step on the broom.", euphemistic: "Kusvika mumba mune munhu ari kurwara zvakanyanya.", sentence: "Tatsika mutsvairo kwaMhofu nhasi.", english: "We visited the Mhofu household where someone is very ill." },
      { shona: "Kuraswa nemvura", literal: "To be thrown by water.", euphemistic: "Kunyudzwa mumatambudziko.", sentence: "Mhuri yekwaChari yakaraswa nemvura nenzara.", english: "The Chari family was overwhelmed by the famine." },
      { shona: "Kupa gumi", literal: "To give ten.", euphemistic: "Kufa (kusiya zvose zvepano pasi - kashoma kushandiswa).", sentence: "Harahwa yakazopa gumi.", english: "The old man eventually passed away." },
      { shona: "Kuzunza musoro", literal: "To shake the head.", euphemistic: "Kuramba kana kushamisika.", sentence: "Akazunza musoro paakanzwa nyaya iyoyo.", english: "He shook his head in disbelief when he heard that story." },
      { shona: "Kuva nematombo", literal: "To have stones.", euphemistic: "Kuva nehasha (being temperamental).", sentence: "Sekuru vaye vane matombo mudenga.", english: "That grandfather is very hot-tempered." },
      { shona: "Kuenda kunogadzira", literal: "To go and prepare.", euphemistic: "Kuenda kunobika (Going to cook).", sentence: "Mai vari kunogadzira zvekudya mumba.", english: "Mother is in the kitchen preparing food." }
    ]
  }
];

// ─── Flatten with unique IDs ──────────────────────────────────────────────────
const FLATTENED_ITEMS: FlattenedItem[] = SECTIONS.flatMap((section, idx) =>
  section.items.map((item, i) => ({
    ...item,
    id: idx * 100 + i + 1, // simple unique id
    category: section.category,
  }))
);

// ─── Category list for navigation ───────────────────────────────────────────
const CATEGORIES = SECTIONS.map(s => s.category);

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const EuphemismCard = memo(({ item, isHighlighted }: { item: FlattenedItem; isHighlighted: boolean }) => {
  return (
    <div
      id={`euphemism-${item.id}`}
      className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
        isHighlighted
          ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20 ring-2 ring-fuchsia-500/50 scale-[1.01]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-fuchsia-300 dark:hover:border-fuchsia-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Number badge */}
        <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
              isHighlighted
                ? 'bg-fuchsia-600 text-white'
                : 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300'
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
                ? 'text-fuchsia-900 dark:text-fuchsia-100'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {item.shona}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left column: Literal + Euphemistic + Sentence */}
            <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-fuchsia-600 dark:text-fuchsia-400 block mb-1 tracking-wider">
                  Literal Meaning
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {item.literal}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1 tracking-wider">
                  Euphemistic Meaning
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.euphemistic}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1 tracking-wider">
                  Muenzaniso
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{item.sentence}"
                </p>
              </div>
            </div>

            {/* Right column: English */}
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
export const Euphemisms: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [randomItem, setRandomItem] = useState<FlattenedItem | null>(null);

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

  // Filter items by active category
  const visibleItems = useMemo(() => {
    return FLATTENED_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Debounced search
  useEffect(() => {
    if (!inputValue.trim()) {
      setHighlightedId(null);
      return;
    }

    const timer = setTimeout(() => {
      const query = inputValue.toLowerCase();
      const match = FLATTENED_ITEMS.find(
        item =>
          item.shona.toLowerCase().includes(query) ||
          item.euphemistic.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.literal.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.id);
        setActiveCategory(match.category);
        setTimeout(() => {
          const element = document.getElementById(`euphemism-${match.id}`);
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

  // Scroll to category
  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    setHighlightedId(null);
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Random item on mount
  useEffect(() => {
    const random = FLATTENED_ITEMS[Math.floor(Math.random() * FLATTENED_ITEMS.length)];
    setRandomItem(random);
  }, []);

  const refreshRandom = () => {
    const random = FLATTENED_ITEMS[Math.floor(Math.random() * FLATTENED_ITEMS.length)];
    setRandomItem(random);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollToCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200 dark:shadow-fuchsia-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
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
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm flex items-center gap-2">
            <ShieldCheck size={14} />
            MADIMIKIRA ERUREMEKEDZO
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Mazwi eRuremekedzo
          </h1>
          <p className="text-lg text-fuchsia-100 max-w-2xl leading-relaxed">
            Madimikira eruremekedzo mashoko kana mitsara inoshandiswa panzvimbo yemamwe mashoko angatorwa seasingafadzi, anonyadzisa, kana anorwadza. Inzira yekutaura nenzira yeUnhu uye nekuremekedza vamwe.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-fuchsia-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {FLATTENED_ITEMS.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random euphemism</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-fuchsia-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a euphemism or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-fuchsia-200/70 font-medium"
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
                  <X size={18} className="text-fuchsia-200" />
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
          {/* List of Euphemisms */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {activeCategory}
              </span>
              <span>{visibleItems.length} shown</span>
            </div>

            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <EuphemismCard
                  key={item.id}
                  item={item}
                  isHighlighted={item.id === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No euphemisms in this category.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Euphemism Card */}
            <div className="rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400">✨ Random Euphemism</h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-fuchsia-500 dark:text-fuchsia-400" />
                </button>
              </div>
              {randomItem && (
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {randomItem.shona}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {randomItem.euphemistic}
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
                  <span>Mazwi eRuremekedzo Ose</span>
                  <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">
                    {FLATTENED_ITEMS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Categories</span>
                  <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">
                    {CATEGORIES.length}
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
                Euphemisms are used in Shona to show respect (unhu) and avoid directly mentioning sensitive topics like death, illness, or bodily functions. They are an essential part of polite discourse.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600 text-white rounded-xl shadow-lg hover:shadow-fuchsia-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-fuchsia-600 to-fuchsia-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-fuchsia-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-fuchsia-300 font-bold">•</span>
              <span>
                <strong className="text-white">Euphemisms:</strong> Polite alternatives for sensitive topics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-fuchsia-300 font-bold">•</span>
              <span>
                <strong className="text-white">Literal Meaning:</strong> The direct translation of the phrase.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-fuchsia-300 font-bold">•</span>
              <span>
                <strong className="text-white">Euphemistic Meaning:</strong> The intended polite interpretation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-fuchsia-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences show context.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-fuchsia-300 font-bold">•</span>
              <span>Use the search bar to find a specific euphemism or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Euphemisms;