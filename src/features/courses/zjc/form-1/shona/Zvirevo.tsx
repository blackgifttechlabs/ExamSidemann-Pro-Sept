import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Search, X, ChevronUp, RefreshCw } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACE
// ──────────────────────────────────────────────────────────────────────────────
interface ZvirevoItem {
  num: number;
  shona: string;
  dudziro: string;
  english: string;
  sentence: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// ZVIREVO LIST (full dataset from the original)
// ──────────────────────────────────────────────────────────────────────────────
const ZVIREVO_LIST: ZvirevoItem[] = [
  { num: 1, shona: "Kutaura kuzhinji kuzvidzika.", dudziro: "Usataure zvakawandisa.", english: "Too much talk lowers your dignity.", sentence: "Keep your secret to yourself; remember, kutaura kuzhinji kuzvidzika." },
  { num: 2, shona: "Chokwadi chinobuda pachena.", dudziro: "Nhema dzinozivikanwa chete.", english: "Truth will always come out.", sentence: "He tried to hide the theft, but chokwadi chinobuda pachena." },
  { num: 3, shona: "Nguva haimiriri munhu.", dudziro: "Nguva inofamba nguva dzose.", english: "Time waits for no one.", sentence: "Start your homework now; nguva haimiriri munhu." },
  { num: 4, shona: "Kudzidza hakuperi.", dudziro: "Munhu anodzidza kusvika afa.", english: "Learning never ends.", sentence: "My grandfather is 80 and still reading; kudzidza hakuperi." },
  { num: 5, shona: "Kushivirira kunobereka.", dudziro: "Mirira uone zvakanaka.", english: "Patience pays off.", sentence: "Work hard and wait; kushivirira kunobereka." },
  { num: 6, shona: "Kutsamwa hakuvaki musha.", dudziro: "Hasha dzinoparadza.", english: "Anger does not build a home.", sentence: "Don't fight with your brother; kutsamwa hakuvaki musha." },
  { num: 7, shona: "Usimbe hunouraya.", dudziro: "Kusashanda kunounza nhamo.", english: "Laziness leads to ruin/poverty.", sentence: "If you don't plough the fields, you will starve because usimbe hunouraya." },
  { num: 8, shona: "Chakanaka chakanaka...", dudziro: "Chinhu chakanaka hachidi kuitwa nani.", english: "Good things don't need artificial improvement.", sentence: "She is naturally kind; chakanaka chakanaka, mukaka haurungwi munyu." },
  { num: 9, shona: "Rudo ibofu.", dudziro: "Rudo haruoni zvakaipa.", english: "Love is blind.", sentence: "He ignores her bad habits because rudo ibofu." },
  { num: 10, shona: "Kugarisana kubatsirana.", dudziro: "Batsira vamwe mugare zvakanaka.", english: "Living together means helping each other.", sentence: "I helped my neighbor fix his fence because kugarisana kubatsirana." },
  { num: 11, shona: "Chara chimwe hachitswanyi inda.", dudziro: "Tinoda kubatana.", english: "Many hands make light work / Unity is strength.", sentence: "Let's all carry the logs together; chara chimwe hachitswanyi inda." },
  { num: 12, shona: "Mbudzi kudya mufenje kufana nyina.", dudziro: "Mwana anotevedzera vabereki.", english: "Like father, like son / Like mother, like daughter.", sentence: "Tendai is a great farmer just like his dad; mbudzi kudya mufenje kufana nyina." },
  { num: 13, shona: "Kandiro kanoenda kunobva kamwe.", dudziro: "Ukapa vamwe, naivowo vanokupa.", english: "Give and take / One good turn deserves another.", sentence: "I shared my food today, knowing that kandiro kanoenda kunobva kamwe." },
  { num: 14, shona: "Itsva rutsoka, itsva muromo.", dudziro: "Munhu anofamba anonzwa zvakawanda.", english: "He who travels hears/learns much.", sentence: "Travel to the city and see the world; itsva rutsoka, itsva muromo." },
  { num: 15, shona: "Ateya mariva murutsoka haatyi mbeva.", dudziro: "Munhu asarudza kuita chinhu anofanira kutsungirira.", english: "Once you start a task, don't fear the challenges.", sentence: "The exam is hard, but ateya mariva murutsoka haatyi mbeva." },
  { num: 16, shona: "Kuudza munhu nzeve dzinonzwa.", dudziro: "Teerera kurairwa.", english: "To warn those who are willing to listen.", sentence: "I warned him about the fire; kuudza munhu nzeve dzinonzwa." },
  { num: 17, shona: "Chinono chinengwa nemukaka.", dudziro: "Kunonoka kunoita kuti urasikirwe.", english: "Too much delay leads to missed opportunities.", sentence: "Hurry to the market; chinono chinengwa nemukaka." },
  { num: 18, shona: "Kupururudza kuri mberi.", dudziro: "Usapembera usati wapedza basa.", english: "Don't celebrate before the victory is certain.", sentence: "The race isn't over yet; kupururudza kuri mberi." },
  { num: 19, shona: "Kakubva kune mumwe kune mumwe kunonzi kunaka.", dudziro: "Kunatsa vamwe kune mubairo.", english: "Kindness to others brings goodness back to you.", sentence: "Help the widow, for kakubva kune mumwe kunonzi kunaka." },
  { num: 20, shona: "Mwana asingachemi afira mumbereko.", dudziro: "Ukasataura nhamo yako haubatsirwi.", english: "A closed mouth catches no flies / Ask and you shall receive.", sentence: "Tell the teacher you are confused; mwana asingachemi afira mumbereko." },
  { num: 21, shona: "Gudo guru peta muswe kuti vadiki vakutye.", dudziro: "Vakuru vanofanira kuzvibata kuti varemekedzwe.", english: "Respect is earned through humble and wise behavior.", sentence: "The chief sat quietly because gudo guru peta muswe." },
  { num: 22, shona: "Kuramba dzvuku hupfumi.", dudziro: "Usazvidza zvidiki zvaunazvo.", english: "Don't reject small things; they lead to wealth.", sentence: "Save every cent; kuramba dzvuku hupfumi." },
  { num: 23, shona: "Chembere yeadzoka kupfuma.", dudziro: "Kusvika kumba wakachengeteka chinhu chikuru.", english: "Coming back safe is a form of wealth.", sentence: "He returned from the war alive; chembere yeadzoka kupfuma." },
  { num: 24, shona: "Totenda dzamwa.", dudziro: "Tinotenda kana chinhu chaitika.", english: "We believe it when we see the results.", sentence: "I will believe the rain is coming when I see the clouds; totenda dzamwa." },
  { num: 25, shona: "Chinokanganwa idemo, kwete muti.", dudziro: "Munhu anogumbura anokanganwa, asi akagumburwa haakanganwi.", english: "The axe forgets, but the tree remembers.", sentence: "He forgot he insulted me, but chinokanganwa idemo, muti hau." },
  { num: 26, shona: "Mapudzi anowira kune vasina hari.", dudziro: "Rombo rakanaka rinowira kune vasingagoni kurishandisa.", english: "Luck often falls on those who are unprepared or ungrateful.", sentence: "He won the lottery but wasted it; mapudzi anowira kune vasina hari." },
  { num: 27, shona: "Zviururwi zvinofamba nemvura.", dudziro: "Munhu anotevedzera zviriko panguva iyoyo.", english: "People move with the trends/times.", sentence: "Everyone is buying phones now; zviururwi zvinofamba nemvura." },
  { num: 28, shona: "Mura mbeu mbeu imwe haisiri munda.", dudziro: "Usatumbidze chinhu chimwe chete.", english: "One seed does not make a whole field.", sentence: "One good grade is good, but you need more; mbeu imwe haisiri munda." },
  { num: 29, shona: "Zano ndega akasiya jira mumoto.", dudziro: "Munhu asingateereri mazano evamwe anorasikirwa.", english: "He who refuses advice ends up in trouble.", sentence: "Listen to your elders; zano ndega akasiya jira mumoto." },
  { num: 30, shona: "Chakafukidza dzimba matenga.", dudziro: "Mhuri imwe neimwe ine matambudziko ayo akavanzika.", english: "Every family has its own hidden problems.", sentence: "Don't judge them; chakafukidza dzimba matenga." },
  { num: 31, shona: "Muzvinaguhwa haana shamwari.", dudziro: "Munhu anoita makuhwa haavimbwi naye.", english: "A gossip has no true friends.", sentence: "Don't tell her your secrets; muzvinaguhwa haana shamwari." },
  { num: 32, shona: "Murombo haarovi chine mwoyo.", dudziro: "Munhu asina chake haabudiriri nyore.", english: "A poor person struggles to get what they desire.", sentence: "He tried his best, but murombo haarovi chine mwoyo." },
  { num: 33, shona: "Rega zvipore maoko haana nembe.", dudziro: "Mirira kutsamwa kupere usati waita chinhu.", english: "Let things cool down before you act in anger.", sentence: "Don't fight now; rega zvipore maoko haana nembe." },
  { num: 34, shona: "Shiri yakangwara inovaka dendere neminhenga yeimwe.", dudziro: "Munhu akangwara anoshandisa ruzivo rwevamwe.", english: "A wise person learns from the success of others.", sentence: "Observe how he studies; shiri yakangwara inovaka dendere neminhenga yeimwe." },
  { num: 35, shona: "Charira chigutsa kureva kuti pane chaitika.", dudziro: "Pane chiratidzo chekuti pane zviri kuitika.", english: "There is no smoke without fire.", sentence: "I heard a rumor; charira chigutsa." },
  { num: 36, shona: "Roora rouswa rinotsva.", dudziro: "Chinhu chinogara chose.", english: "Things not built on a strong foundation will perish.", sentence: "Their friendship ended quickly; roora rouswa rinotsva." },
  { num: 37, shona: "Kurairwa kunonzwa anotya.", dudziro: "Munhu anoteerera ndiye anopona.", english: "Only those who fear consequences listen to advice.", sentence: "He stayed away from the river; kurairwa kunonzwa anotya." },
  { num: 38, shona: "Benzi rinoshamira rine racho.", dudziro: "Munhu wese ane zvaanoziva.", english: "Even a fool has something they are good at.", sentence: "Don't laugh at him; benzi rinoshamira rine racho." },
  { num: 39, shona: "Kunaka kwehara kuratwa.", dudziro: "Chinhu chinoyemurwa kana chashandiswa.", english: "The proof of the pudding is in the eating.", sentence: "Try the food first; kunaka kwehara kuratwa." },
  { num: 40, shona: "Mbiri haitengi sadza.", dudziro: "Kuve nemukurumbira hakuzadzi dumbu.", english: "Fame does not put food on the table.", sentence: "He is famous but poor; mbiri haitengi sadza." },
  { num: 41, shona: "Mukuyu wekuzvarwa hauna muchenje.", dudziro: "Munhu waunoziva haatyisi.", english: "Someone you grew up with doesn't intimidate you.", sentence: "He is my brother; mukuyu wekuzvarwa hauna muchenje." },
  { num: 42, shona: "Ane ganda ane nyama.", dudziro: "Ane zvishoma ndiye anokwanisa kuwana zvakawanda.", english: "He who has a little is better off than him with nothing.", sentence: "At least I have a dollar; ane ganda ane nyama." },
  { num: 43, shona: "Kusatenda huroyi.", dudziro: "Kutoshaya kutenda kwakafanana nekuroya.", english: "Ingratitude is like witchcraft (being very ungrateful is evil).", sentence: "Say thank you; kusatenda huroyi." },
  { num: 44, shona: "Chirere chigokurerawo.", dudziro: "Chengetedza mwana anozokuchengetawo.", english: "Look after a child, and they will look after you in old age.", sentence: "I send my son to school because chirere chigokurerawo." },
  { num: 45, shona: "Chiri parugwaro chiri parugwaro.", dudziro: "Chinhu chakanyorwa hachishanduki.", english: "What is written is written.", sentence: "The contract is signed; chiri parugwaro chiri parugwaro." },
  { num: 46, shona: "Chinomwa chivhurumukira hachipedzi nyota.", dudziro: "Kuita zvinhu nekuchimbidza hakubatsiri.", english: "Haste makes waste.", sentence: "Take your time on the exam; chinomwa chivhurumukira hachipedzi nyota." },
  { num: 47, shona: "Munhu munhu nekuda kwevamwe.", dudziro: "Tiri vanhu nekuda kwekugarisana.", english: "A person is a person because of other people (Ubuntu).", sentence: "Help your neighbor, for munhu munhu nekuda kwevamwe." },
  { num: 48, shona: "Afamba asiya hupfu...", dudziro: "Munhu anofa anosiya nhaka.", english: "He who dies leaves his property behind.", sentence: "He left his farm to his kids; afamba asiya hupfu." },
  { num: 49, shona: "Seka urema wafa.", dudziro: "Usaseka vamwe uchiri mupenyu.", english: "Don't mock the disabled/unlucky while you are still alive.", sentence: "Don't laugh at his limp; seka urema wafa." },
  { num: 50, shona: "Arumwa nechisvo anofutira.", dudziro: "Akarasikirwa anozwaraira.", english: "Once bitten, twice shy.", sentence: "I won't lend him money again; arumwa nechisvo anofutira." },
  { num: 51, shona: "Musha rume.", dudziro: "Murume ndiye musimboti wemba.", english: "A man is the pillar of the home.", sentence: "He works hard for his family; musha rume." },
  { num: 52, shona: "Mbavha haina mwana.", dudziro: "Munhu akaipa haana anomureverera.", english: "A thief has no one to defend them.", sentence: "No one helped him in court; mbavha haina mwana." },
  { num: 53, shona: "Ukama igasva, hunozadziswa nekudya.", dudziro: "Ukama hunosimbiswa nekudya pamwe chete.", english: "Relationships are completed by sharing meals.", sentence: "Come eat with us; ukama igasva." },
  { num: 54, shona: "Zano kwaro unopiwa nemuvengi.", dudziro: "Dzimwe nguva muvengi ndiye anokupa zano chairo.", english: "Sometimes an enemy gives the best advice.", sentence: "Listen to his criticism; zano kwaro unopiwa nemuvengi." },
  { num: 55, shona: "Mukombe wezuro hauna mvura.", dudziro: "Zvanezuro zvakapfuura.", english: "Yesterday's cup has no water (Don't live in the past).", sentence: "Forget the old fight; mukombe wezuro hauna mvura." },
  { num: 56, shona: "Chitsva chiri mutsoka.", dudziro: "Unowana zvitsva nekufamba.", english: "New things are found through travel/action.", sentence: "Go out and look for a job; chitsva chiri mutsoka." },
  { num: 57, shona: "Rwaivhi haruna kumhanya...", dudziro: "Munhu munyoro ane zvaanoziva.", english: "A slow person can still reach the goal.", sentence: "He is slow but steady; rwaivhi haruna kumhanya asi rinosvika." },
  { num: 58, shona: "Kugocha rumbabvu...", dudziro: "Kuzvitsvakira dambudziko.", english: "To invite trouble upon yourself.", sentence: "By lying to the boss, he was kugocha rumbabvu." },
  { num: 59, shona: "Mazvokuda mavanga enyora.", dudziro: "Matambudziko awakazvikokera.", english: "Problems you brought upon yourself.", sentence: "You chose to skip school; mazvokuda mavanga enyora." },
  { num: 60, shona: "Chivi chinodzoka kune mwene wacho.", dudziro: "Zvakaipa zvaunoita zvinodzoka kwauri.", english: "Evil returns to the doer / What goes around comes around.", sentence: "He was mean, and now he is alone; chivi chinodzoka kune mwene wacho." },
  { num: 61, shona: "Hapana asina kake.", dudziro: "Munhu wese ane dambudziko rake.", english: "Everyone has a little something (a flaw or problem).", sentence: "Don't act perfect; hapana asina kake." },
  { num: 62, shona: "Mombe yetsiru haina mukaka.", dudziro: "Chinhu chisina kuibva hachina zvibereko.", english: "You cannot get milk from a heifer (Don't expect results from the immature).", sentence: "He is too young for that job; mombe yetsiru haina mukaka." },
  { num: 63, shona: "Kare haagari kare.", dudziro: "Zvinhu zvinoshanduka.", english: "The old days don't stay the same (Times change).", sentence: "We use tractors now, not hoes; kare haagari kare." },
  { num: 64, shona: "Imba imba nekuda kwevanhu.", dudziro: "Imba haisi zvidhina chete.", english: "A house is made of people, not just bricks.", sentence: "Without my children, the house is empty; imba imba nekuda kwevanhu." },
  { num: 65, shona: "Nzombe haichemi...", dudziro: "Murume akasimba haachemi nhamo.", english: "A strong person does not cry over hardship.", sentence: "He worked through the pain; nzombe haichemi." },
  { num: 66, shona: "Kuramba mhandu hupenyu.", dudziro: "Kuziva muvengi kunoita kuti upone.", english: "Avoiding the enemy ensures survival.", sentence: "Stay away from bad company; kuramba mhandu hupenyu." },
  { num: 67, shona: "Natsa kwawabva kwaunoenda usiku.", dudziro: "Siya nzvimbo zvakanaka.", english: "Leave a place in good standing, for the future is uncertain.", sentence: "Don't quit your job rudely; natsa kwawabva." },
  { num: 68, shona: "Rwizi runozara nemvura...", dudziro: "Zvishoma zvishoma zvinoti pfee.", english: "Little by little fills the river.", sentence: "Save a dollar every day; rwizi runozara nemvura." },
  { num: 69, shona: "Simbi inorohwa ichapisa.", dudziro: "Ita basa panguva yaro.", english: "Strike while the iron is hot.", sentence: "Apply for the job now; simbi inorohwa ichapisa." },
  { num: 70, shona: "Mukadzi weumwe munhu...", dudziro: "Usachiva zvisiri zvako.", english: "Respect other people's property/spouses.", sentence: "Do not take what is not yours; mukadzi weumwe ndiamai." },
  { num: 71, shona: "Kure kwemeso, nzeve dzinonzwa.", dudziro: "Kunyange uri kure, mashoko anosvika.", english: "Though far from the eyes, the ears still hear.", sentence: "I heard about the party in London; kure kwemeso nzeve dzinonzwa." },
  { num: 72, shona: "Mapfumo ose kuseka...", dudziro: "Nhamo haina anoichema kunze kwemuridzi.", english: "Others may laugh at your pain.", sentence: "They laughed when I fell; mapfumo ose kuseka." },
  { num: 73, shona: "Kufa kwemujeri...", dudziro: "Kurasikirwa neanoziva basa.", english: "The loss of an expert is a great loss.", sentence: "The doctor died; kufa kwemujeri." },
  { num: 74, shona: "Kure kwegava ndokusina...", dudziro: "Munhu anoenda kwese kwaanoda.", english: "No place is too far if you want to get there.", sentence: "He walked 20km for love; kure kwegava ndokusina mutsubvu." },
  { num: 75, shona: "Zviri mudumbu hazvizivikanwi.", dudziro: "Pfungwa dzevamwe hadzizivikanwi.", english: "What is in the stomach is unknown (Thoughts are private).", sentence: "I don't know what he is planning; zviri mudumbu." },
  { num: 76, shona: "Chomungozva chinodyiwa...", dudziro: "Batsira ane nhamo.", english: "What is given to the needy is rewarded.", sentence: "Feed the hungry; chomungozva chinodyiwa neanosungira." },
  { num: 77, shona: "Mudzimu waunoziva...", dudziro: "Zviri nani kuziva muvengi wako.", english: "Better the devil you know than the arrow you don't.", sentence: "I prefer my old boss; mudzimu waunoziva." },
  { num: 78, shona: "Kuronga hakusi kuita.", dudziro: "Kutaura hakusi kushanda.", english: "Planning is not doing.", sentence: "Stop talking and start working; kuronga hakusi kuita." },
  { num: 79, shona: "Chembere yeadzoka...", dudziro: "Safe return is a blessing.", english: "Safe return is a blessing.", sentence: "He is back from the mines; chembere yeadzoka." },
  { num: 80, shona: "Gondo haridyi...", dudziro: "Munhu mukuru haaiti zvinhu zvidiki.", english: "An eagle does not catch flies (Great people don't waste time on trifles).", sentence: "The CEO ignored the gossip; gondo haridyi zvine ruzha." },
  { num: 81, shona: "Kuona rina manyanga...", dudziro: "Kuziva kuti pane dambudziko.", english: "To see the danger coming.", sentence: "He saw the police and ran; kuona rina manyanga." },
  { num: 82, shona: "Kupfuura nemunzira...", dudziro: "Kuremekedza nzvimbo.", english: "Respecting the path you travel.", sentence: "Be polite to strangers; kupfuura nemunzira." },
  { num: 83, shona: "Gudo harizvioni...", dudziro: "Munhu haazvioni chikanganiso chake.", english: "A baboon doesn't see its own backside (People ignore their own flaws).", sentence: "He criticizes me but he is worse; gudo harizvioni makanda." },
  { num: 84, shona: "Shungu hadziurayi.", dudziro: "Kuda chinhu hakukupi chinhu chacho.", english: "Ambition alone doesn't kill (you must act).", sentence: "He wants to be rich but sleeps all day; shungu hadziurayi." },
  { num: 85, shona: "Panofunuka...", dudziro: "Pane dambudziko pane nzira.", english: "Where there is a struggle, there is a way.", sentence: "Keep trying; panofunuka pane rutsoka." },
  { num: 86, shona: "Pfuti hairidze...", dudziro: "Usavimbe nechinhu chisina kuongororwa.", english: "Don't trust a tool that hasn't been tested.", sentence: "Test the car before buying; pfuti hairidze." },
  { num: 87, shona: "Chirauro hachina...", dudziro: "Usavimbe nezvinhu zvekungopiwa.", english: "Free things often have a catch.", sentence: "Be careful of 'free' gifts; chirauro hachina." },
  { num: 88, shona: "Murombo munhu.", dudziro: "Usazvidze varombo.", english: "A poor person is still a human being.", sentence: "Respect everyone; murombo munhu." },
  { num: 89, shona: "Kupenga huroyi.", dudziro: "Maitiro akaipa akafanana nehuroyi.", english: "Bad behavior is as bad as witchcraft.", sentence: "His rudeness is shocking; kupenga huroyi." },
  { num: 90, shona: "Kugarisana...", dudziro: "Batsira vamwe mugare zvakanaka.", english: "Helping each other.", sentence: "We share tools; kugarisana kubatsirana." },
  { num: 91, shona: "Rega hako...", dudziro: "Usazvitsvakira dambudziko.", english: "Don't invite trouble.", sentence: "Stay away from that flag; rega hako." },
  { num: 92, shona: "Chidoma...", dudziro: "Chinhu chisingazivikanwi chinotyisa.", english: "The unknown is frightening.", sentence: "They fear the new law; chidoma." },
  { num: 93, shona: "Ukama hwekuzvarwa...", dudziro: "Hukama hweropa hahusukurudzwi.", english: "Blood is thicker than water.", sentence: "I must help my brother; ukama hweropa hahusukurudzwi." },
  { num: 94, shona: "Usapedzere tsvimbo...", dudziro: "Usaparadze simba paman'a.", english: "Don't waste your energy on ghosts (imaginary problems).", sentence: "Ignore the rumors; usapedzere tsvimbo paman'a." },
  { num: 95, shona: "Munhenga wezizi...", dudziro: "Chinhu chinoyemurika asi chisina maturo.", english: "Something pretty but useless.", sentence: "That car looks nice but doesn't run; munhenga wezizi." },
  { num: 96, shona: "Mombe yokweretwa...", dudziro: "Chinhu chekukwereta hachisi chako.", english: "A borrowed cow is not yours (Don't act like a boss with borrowed things).", sentence: "Give back the pen; mombe yokweretwa." },
  { num: 97, shona: "Kandiro...", dudziro: "Ukapa vamwe, naivowo vanokupa.", english: "One good turn deserves another.", sentence: "I'll help you today; kandiro kanoenda." },
  { num: 98, shona: "Dzoro rimwe...", dudziro: "Maitiro anochinjana.", english: "Everyone takes a turn.", sentence: "It's my turn to lead; dzoro rimwe." },
  { num: 99, shona: "Kutsva kwendebvu...", dudziro: "Kuzvitsvakira dambudziko.", english: "To cause your own trouble.", sentence: "He started the fight; kutsva kwendebvu." },
  { num: 100, shona: "Garwe haridyi...", dudziro: "Usatya zvisingatyisi.", english: "A crocodile doesn't eat its own (Don't fear your own people).", sentence: "The chief won't hurt us; garwe haridyi." },
  { num: 101, shona: "Zvinhu zvinofamba...", dudziro: "Zvinhu zvinoshanduka.", english: "Things change.", sentence: "Life is different now; zvinhu zvinofamba." },
  { num: 102, shona: "Munhu haazivi...", dudziro: "Hapana anoziva remangwana.", english: "No one knows tomorrow.", sentence: "Save for the future; munhu haazivi." },
  { num: 103, shona: "Musha wevashanyi...", dudziro: "Kuda vanhu kunounza makomborero.", english: "Being hospitable brings blessings.", sentence: "Welcome the guest; musha wevashanyi." },
  { num: 104, shona: "Kushaya kuziva...", dudziro: "Kusaziva kufanana nekufa.", english: "Ignorance is like death (Ignorance is dangerous).", sentence: "Read your books; kushaya kuziva." },
  { num: 105, shona: "Munhu anoziva...", dudziro: "Munhu akadzidza anozvibata.", english: "A knowledgeable person behaves well.", sentence: "He is very polite; munhu anoziva." },
  { num: 106, shona: "Kare...", dudziro: "Zvinhu zvinoshanduka.", english: "Times change.", sentence: "Forget the past; kare." },
  { num: 107, shona: "Chinono...", dudziro: "Kunonoka kunoita kuti urasikirwe.", english: "Delay is dangerous.", sentence: "Hurry up; chinono." },
  { num: 108, shona: "Chara...", dudziro: "Tinoda kubatana.", english: "Unity is strength.", sentence: "Join us; chara." },
  { num: 109, shona: "Mombe yetsiru...", dudziro: "Chinhu chisina kuibva hachina zvibereko.", english: "No results from the immature.", sentence: "He is just a boy; mombe yetsiru." },
  { num: 110, shona: "Rudo...", dudziro: "Rudo haruoni zvakaipa.", english: "Love is blind.", sentence: "She loves him anyway; rudo ibofu." }
];

// ──────────────────────────────────────────────────────────────────────────────
// DYNAMIC SECTION RANGES (based on first letters of Shona)
// ──────────────────────────────────────────────────────────────────────────────
const buildSectionRanges = (items: ZvirevoItem[]) => {
  const letters = items
    .map(item => {
      const match = item.shona.trim().match(/[A-Za-z]/);
      return match ? match[0].toUpperCase() : '';
    })
    .filter(l => l !== '')
    .sort();

  const uniqueLetters = Array.from(new Set(letters));

  // Group letters into ranges of up to 3 per section
  const ranges: { label: string; letters: string[] }[] = [];
  for (let i = 0; i < uniqueLetters.length; i += 3) {
    const group = uniqueLetters.slice(i, i + 3);
    const label = group.join('-');
    ranges.push({ label, letters: group });
  }
  return ranges;
};

const getFirstLetter = (value: string) => {
  const match = value.trim().match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : '';
};

// ──────────────────────────────────────────────────────────────────────────────
// MEMOIZED CARD COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const ZvirevoCard = memo(
  ({ item, isHighlighted }: { item: ZvirevoItem; isHighlighted: boolean }) => {
    return (
      <div
        id={`zvirevo-${item.num}`}
        className={`rounded-xl border p-4 md:p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-md ${
          isHighlighted
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-500/50 scale-[1.01]'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] hover:border-amber-300 dark:hover:border-amber-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Number badge */}
          <div className="flex-shrink-0 flex items-center sm:items-start justify-center">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                isHighlighted
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
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
                  ? 'text-amber-900 dark:text-amber-100'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {item.shona}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left column: Dudziro + Example sentence */}
              <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-3 border border-slate-100 dark:border-white/5 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1 tracking-wider">
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
export const Zvirevo: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [randomProverb, setRandomProverb] = useState<ZvirevoItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Build section ranges dynamically
  const SECTION_RANGES = useMemo(() => buildSectionRanges(ZVIREVO_LIST), []);

  const visibleZvirevo = useMemo(() => {
    const activeLetters = SECTION_RANGES[activeSection]?.letters ?? [];
    return ZVIREVO_LIST.filter((item) => activeLetters.includes(getFirstLetter(item.shona)));
  }, [activeSection, SECTION_RANGES]);

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
      const match = ZVIREVO_LIST.find(
        (item) =>
          item.shona.toLowerCase().includes(query) ||
          item.english.toLowerCase().includes(query) ||
          item.dudziro.toLowerCase().includes(query) ||
          item.sentence.toLowerCase().includes(query)
      );

      if (match) {
        setHighlightedId(match.num);
        // Find the section index for the matched item
        const firstLetter = getFirstLetter(match.shona);
        const sectionIndex = SECTION_RANGES.findIndex((range) =>
          range.letters.includes(firstLetter)
        );
        if (sectionIndex !== -1) setActiveSection(sectionIndex);

        window.setTimeout(() => {
          const element = document.getElementById(`zvirevo-${match.num}`);
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
  }, [inputValue, SECTION_RANGES]);

  // Scroll to section
  const scrollToSection = (index: number) => {
    setActiveSection(index);
    setHighlightedId(null);
    listContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Pick a random proverb on mount
  useEffect(() => {
    const random = ZVIREVO_LIST[Math.floor(Math.random() * ZVIREVO_LIST.length)];
    setRandomProverb(random);
  }, []);

  const refreshRandom = () => {
    const random = ZVIREVO_LIST[Math.floor(Math.random() * ZVIREVO_LIST.length)];
    setRandomProverb(random);
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(64px,1fr))] items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_RANGES.map((range, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className={`w-full rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              activeSection === idx
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200 dark:shadow-amber-900/30'
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
            ZVIREVO NEMADUDZIRWO AZVO
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Zvirevo zveChiShona
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl leading-relaxed">
            Dzidza zvirevo zvechiShona, nzwisisa zvadzinoreva, uone mienzaniso yekushandiswa kwadzo. Ziva mutauro wenyu.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-amber-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">📚 {ZVIREVO_LIST.length} entries</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🔄 Refresh for random proverb</span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-amber-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a proverb or meaning..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-amber-200/70 font-medium"
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
                  <X size={18} className="text-amber-200" />
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
          {/* List of Zvirevo */}
          <div ref={listContainerRef} className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#121212] dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {SECTION_RANGES[activeSection]?.label || 'All'} Zvirevo
              </span>
              <span>{visibleZvirevo.length} shown</span>
            </div>

            {visibleZvirevo.length > 0 ? (
              visibleZvirevo.map((item) => (
                <ZvirevoCard
                  key={item.num}
                  item={item}
                  isHighlighted={item.num === highlightedId}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-400">
                No proverbs found in this letter range.
              </div>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Proverb Card */}
            <div className="rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">✨ Random Proverb</h3>
                <button
                  onClick={refreshRandom}
                  className="p-1.5 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-amber-500 dark:text-amber-400" />
                </button>
              </div>
              {randomProverb && (
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {randomProverb.shona}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {randomProverb.dudziro}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {randomProverb.english}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                    “{randomProverb.sentence}”
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Total Proverbs</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {ZVIREVO_LIST.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Shona entries</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {ZVIREVO_LIST.length}
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
                Zvirevo zvinopa hupfumi hwemutauro uye zvinobatsira kunzwisisa tsika nepfungwa dzevaShona. Zvinowanzoshandiswa muzvinyorwa nehurukuro dzepamusoro.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-amber-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Zvirevo:</strong> Proverbs that convey wisdom and life lessons.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dudziro:</strong> Explanation in Shona to clarify the meaning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">Muenzaniso:</strong> Example sentences showing real‑life usage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>
                <strong className="text-white">English Meaning:</strong> Translation for broader understanding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-300 font-bold">•</span>
              <span>Use the search bar to find a specific proverb or meaning instantly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Zvirevo;