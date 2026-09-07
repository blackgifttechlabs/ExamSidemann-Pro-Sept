const fs = require('fs');
const file = 'courses/form-1/shona/LearningOutcome1.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldContent = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Mukoma Wangu</div>
                         <div className="indent-8 text-justify">
                            Nhanganyaya: Mukoma wangu Tonderai ndicho chiedza chemhuri yedu. Haangori mukoma chete, ishamwari yangu chaiyo.
                         </div>
                         <div className="indent-8 text-justify">
                            Mutumbi: Mukoma Tonderai murefu sederanhanga. Muviri wake wakasimba nekuti anotamba bhora mazuva ese. Chiso chake chakatenderera uye anogara achisekerera, zvekuti makomba anobuda mumatama ake. Anofarira kupfeka hembe nhema nejean.
                         </div>
                         <div className="indent-8 text-justify">
                            Hunhu hwake hwakanaka kwazvo. Ane moyo murefu kunyangwe ndikamushungurudza. Kana ndikasanzwisisa homuweki, anogara pasi neni achinditsanangurira kusvika ndanzwisisa. Haambondirovi. Asi akatsamwa, inzwi rake rinodengenyeka sedutu.
                         </div>
                         <div className="indent-8 text-justify">
                            Mukoma anoshanda nesimba. Mangwanani anomuka na 5am kuzodzidzira bhora obva aenda kubasa. Manheru anondibatsira kuverenga.
                         </div>
                         <div className="indent-8 text-justify">
                            Mhedziso: Kana ndikakura, ndinoda kuzoita semukoma wangu. Vanoti ukama igasva hunozadziswa nekudya, asi ukama hwangu namukoma hunozadziswa nerudo. Ndinotenda Mwari nekumupa kwandiri.
                         </div>`;

const newContent = `                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Mukoma Wangu</div>
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
                         </div>`;

if(content.includes('Tonderai ndicho chiedza chemhuri yedu')) {
   fs.writeFileSync(file, content.replace(oldContent, newContent), 'utf8');
   console.log('Replaced old content with new content');
} else {
   console.log('Could not find old content');
}
