const fs = require('fs');
const file = 'courses/form-1/shona/LearningOutcome1.tsx';
let content = fs.readFileSync(file, 'utf8');

const type2Old = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Pamarket peMbare</div>
                         <div className="indent-8 text-justify">
                            Pamarket peMbare pane upenyu chaihwo. Kana usati wambosvikako, hausati waona Harare.
                         </div>
                         <div className="indent-8 text-justify">
                            Ukangobva mubhazi, ruzha runokurova sefungu. Vatengesi vanodaidzira, "Madomasi mawai! Mbambaira dzinotapira!" Munhuwi wemhiripiri nehove dzakaomeswa unozadza mhino dzako. Pasi pakazara vanhu vanotsikana setsikidzi.
                         </div>
                         <div className="indent-8 text-justify">
                            Matafura akatevedzana akazara nemiriwo yakasvibira, madomasi matsvuku kunge ropa, nemahonyi yeyero. Kumadziro kune mbatya dzakarembedzwa dzemavara ese - dzvuku, girini, yero. Kana zuva rarova, mavara acho anopenya.
                         </div>
                         <div className="indent-8 text-justify">
                            Kuseri kwemusika kune chikamu chenyama. Kunonhuwirira ropa, asi vatengesi vanosekerera vachitema nyama nedemo. Mari inofamba semvura - mari apa, mari apo.
                         </div>
                         <div className="indent-8 text-justify">
                            Mbare musika ine bishi, asi yakanaka. Inoratidza kuti vanhu veZimbabwe vanoshanda nesimba. Pandinobvapo, ndinenge ndaneta asi ndaguta nemweya wekuZimbabwe.
                         </div>`;

const type2New = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">KUMUSHA KWEDU KUNYANGA</div>
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
                            Mamiriro ekunze ekuNyanga akasiyana zvikuru nedzimwe nzvimbo dzemuZimbabwe. Kuno, kunogara kuchitonhora, zvikuru munguva yechando apo chando chacho chinokwenga mapfupa. Mangwanani ega ega, makomo anenge akafukidzwa nemhute yakati pfumbvuvu, zvekuti haukwanisi kuona munhu ari chinhambwe chidiki kubva pauri. Mhepo inovhuvhuta ichipfuura nemumiti inoridza mhere inoita sekuimba kwakanaka, zvichisiya nzvimbo yacho yakati tonho uye iine runyararo runozorodza mweya.
                         </div>
                         <div className="indent-8 text-justify">
                            Panyaya yezvinomera nemhuka, kumusha kwedu hakusariri shure. Makomo nemipata zvakavharwa nemiti yemipaini (pine trees) nemiwattle yakasvibira kuti mbishi gore rose. Kana ari mapurazi eikoko, akazara nemichero inodonhedza mate yakaita semaapuro, mapichisi, nemapuremu. Munzizi dzedu ndimo munowanikwa hove dzinonaka zvikuru dzemutirauti (trout fish), idzo dzinokwezva vashanyi vanobva mhiri kwemakungwa kuzoredza nekuona runako urwu.
                         </div>
                         <div className="indent-8 text-justify">
                            Kunze kwerunako rwenzvimbo iyi, vanhu vekuNyanga vane rudo negamuchidzanwa. Idunhu rinogara vanhu vanoshanda nesimba, varimi vehurudza vasingadyi cheziya. Havazezi kurima chibage, mbatatisi, nemichero zvisinei nekukwidza nekudzika kwenzvimbo yacho.
                         </div>
                         <div className="indent-8 text-justify">
                            Kutaura zvokwadi, Nyanga inzvimbo inovaraidza inodadisa. Kana ndiri kure nekumusha, ndinogara ndichisuwa ruzha rwemapopoma emvura, kunhuwirira kwemiti yemipaini pamwe nemhepo inotonhorera yeko. Kudai pakuumbwa kwepasi ndaivapo, ndingadai ndakakumbira Musiki kuti vanhu vose vagare munzvimbo inoyevedza sekuNyanga kwedu.
                         </div>`;

const type3Old = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Zuva ReSports paChikoro Chedu</div>
                         <div className="indent-8 text-justify">
                            15 Chikumi raive zuva ratakanga takamirira tese - Sports Day!
                         </div>
                         <div className="indent-8 text-justify">
                            Mangwanani takamuka denga risati ratsvuka. Chikoro chainge chakashongedzwa nemabhanzi egreen ne yellow. Vabereki vakagara pamitsetse, vakabata maamburera.
                         </div>
                         <div className="indent-8 text-justify">
                            Chekutanga kwaive 100m race. Ini ndakamhanya mune yevakomana veGrade 7. Pandakanzwa "On your marks", moyo wangu wairova kunge ngoma. Paaa! Ndakabva ndangomhanya semhepo. Mhepo yaindirova kumeso, makumbo angu aipisa. Ndakapedza ndiri wechipiri! Nguva yandakagamuchira menduru yesirivha, ndakanzwa kudada semambo.
                         </div>
                         <div className="indent-8 text-justify">
                            Pakazoti sack race, vanhu vakaseka kusvika misodzi yobuda. Mudhiri wedu Mai Chipo akawira pasi ndokukunguruka kunge dhiramu. Tese takamira kumhanya tichiseka.
                         </div>
                         <div className="indent-8 text-justify">
                            Pakupedzisira kwakazouya tug-of-war yevabereki nevadzidzisi. Vabereki vakahwina ndokubva vaita mhere-mhere.
                         </div>
                         <div className="indent-8 text-justify">
                            Zuva iri rakapera tave kuneta asi takafara. Ndakadzidza kuti kuhwina hakusi kwese - kutamba pamwe chete ndiko kunokosha.
                         </div>`;

const type3New = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">ZUVA RANDISINGAKANGANWI: MUCHATO WAHANZVADZI YANGU</div>
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
                         </div>`;

let modified = false;

if (content.includes('Pamarket peMbare pane upenyu chaihwo')) {
    content = content.replace(type2Old, type2New);
    modified = true;
    console.log('Replaced Type 2 content');
}

if (content.includes('Zuva ReSports paChikoro Chedu')) {
    content = content.replace(type3Old, type3New);
    modified = true;
    console.log('Replaced Type 3 content');
}

if (modified) {
    fs.writeFileSync(file, content, 'utf8');
}
