const fs = require('fs');

const file = 'courses/form-1/shona/LearningOutcome1.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /{\/\* Intro Section \*\/}[\s\S]*?(?={\/\* Quiz Section \*\/})/g;

const newContent = `
      {/* Intro Section */}
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');\`}</style>
      <section className="space-y-12">
        <div className="bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-600/10 dark:border-indigo-500/10 p-6 md:p-10 rounded-[5px]">
          <h2 className={sectionHeaderClasses}>
            CHIKAMU 1: RONDEDZERO | COMPOSITION WRITING
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
               <h3 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-xs">Tsananguro Yakadzama</h3>
               <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                 Rondedzero kunyora uchitsanangura munhu/chinhu/nzvimbo/chiitiko neudzame zvekuti muverengi anochiona mupfungwa dzake. <br/><span className="italic text-gray-500 relative mt-2 block pl-4 border-l-2 border-gray-300 dark:border-gray-600">English: Detailed descriptive writing that creates mental pictures.</span>
               </p>
            </div>
            <div className="space-y-4">
               <h3 className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-xs">Chinangwa Chikuru</h3>
               <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                 Kuedza mutauro wako, manyorerwo, kuronga pfungwa, nekushandisa tsumo kana madimikira.
               </p>
            </div>
          </div>
        </div>

        {/* 1. STRUCTURE */}
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">1. Structure Yerondedzero Yakakwana</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-indigo-600 text-white text-xs uppercase tracking-widest">
                  <th className="p-4 rounded-tl-[5px]">Chikamu</th>
                  <th className="p-4">Zvekuita</th>
                  <th className="p-4">Words/Marks</th>
                  <th className="p-4">Mazano Anokosha</th>
                  <th className="p-4 rounded-tr-[5px] bg-red-600">Exam Tip</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-[#404040]">
                <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">1. MUSORO</td>
                  <td className="p-4">Nyora musoro wakapihwa. Usakanganwe kuisa pasi pemusoro mutsetse.</td>
                  <td className="p-4 font-mono text-xs">-</td>
                  <td className="p-4">Kana iri sarudzo, sarudza musoro waunonyatsonzwisisa.</td>
                  <td className="p-4 text-red-600 dark:text-red-400 font-bold">1 mark inobviswa kana pasina musoro.</td>
                </tr>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">2. NHANGANYAYA</td>
                  <td className="p-4">Suma chidzidzo. Taura zvauri kuda kurondedzera. Shandisa hook.</td>
                  <td className="p-4 font-mono text-xs">40-50 words</td>
                  <td className="p-4">Tanga netsumo, mubvunzo, kana chirevo chinokatyamadza. Ex: "Vanoti moyo muti..."</td>
                  <td className="p-4 text-red-600 dark:text-red-400 font-bold">Marker anoverenga nhanganyaya first.</td>
                </tr>
                <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">3. MUTUMBI</td>
                  <td className="p-4">Iyi ndiyo nyama yenyaya. 3-5 ndima. Ndima imwe = pfungwa imwe.</td>
                  <td className="p-4 font-mono text-xs">200-250 words</td>
                  <td className="p-4">Tevedzanisa: Pakutanga, chechipiri, Uyezve, Pakupedzisira. Shandisa pfungwa shanu.</td>
                  <td className="p-4 text-red-600 dark:text-red-400 font-bold">Shandisa zvipikisi zvakawanda.</td>
                </tr>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400 border-b border-gray-200 dark:border-[#404040]">4. MHEDZISO</td>
                  <td className="p-4 border-b border-gray-200 dark:border-[#404040]">Pedzisa. Ipa maonero ako, chidzidzo, kana manzwiro.</td>
                  <td className="p-4 font-mono text-xs border-b border-gray-200 dark:border-[#404040]">30-40 words</td>
                  <td className="p-4 border-b border-gray-200 dark:border-[#404040]">Usasuma pfungwa itsva. Dzokorora pfungwa huru.</td>
                  <td className="p-4 text-red-600 dark:text-red-400 font-bold border-b border-gray-200 dark:border-[#404040]">Pedzisa netsumo. (2 marks emahara)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-xs font-mono bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-[5px] w-fit border border-indigo-100 dark:border-indigo-800">
             <div><span className="font-bold text-indigo-600 dark:text-indigo-400">Grade 7:</span> 250-300 words</div>
             <div><span className="font-bold text-indigo-600 dark:text-indigo-400">O Level:</span> 350-450 words</div>
          </div>
        </div>

        {/* 2. MHANDO */}
        <div className="pt-8">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">2. Mhando 4 Dzakadzama Dzerondedzero + Samples</h3>
          
          <div className="space-y-12">
            
            {/* TYPE 1 */}
            <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-[5px] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                   <h4 className="font-black text-lg md:text-xl text-indigo-600 dark:text-indigo-400 uppercase">Type 1: Rondedzero yemunhu | Character Sketch</h4>
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
                {/* SAMPLE NOTEBOOK */}
                <div className="p-6 md:p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
                   <div className="relative">
                      <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                      <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.2rem", lineHeight: "32px", transform: "rotate(-0.5deg)" }}>
                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Mukoma Wangu</div>
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
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            {/* TYPE 2 */}
            <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-[5px] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                   <h4 className="font-black text-lg md:text-xl text-indigo-600 dark:text-indigo-400 uppercase">Type 2: Rondedzero yenzvimbo | Describing a place</h4>
                   <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-4 mb-2">Zvekusanganisira:</p>
                   <p className="text-sm text-gray-600 dark:text-gray-300">Zita renzvimbo, Zvaunoona, Zvaunonzwa, Zvaunonhuwidza, Manzwiro.</p>
                </div>
                <div className="p-6 md:p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
                   <div className="relative">
                      <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                      <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.2rem", lineHeight: "32px", transform: "rotate(-0.5deg)" }}>
                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Pamarket peMbare</div>
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
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            {/* TYPE 3 */}
            <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-[5px] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                   <h4 className="font-black text-lg md:text-xl text-indigo-600 dark:text-indigo-400 uppercase">Type 3: Rondedzero yechiitiko | Narrative Event</h4>
                   <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mt-4 mb-2">Zvekusanganisira:</p>
                   <p className="text-sm text-gray-600 dark:text-gray-300">Nguva, nzvimbo, vanhu, zvakaitika nhanho-nhanho, manzwiro ako.</p>
                </div>
                <div className="p-6 md:p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
                   <div className="relative">
                      <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                      <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.2rem", lineHeight: "32px", transform: "rotate(-0.5deg)" }}>
                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Zuva ReSports paChikoro Chedu</div>
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
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            {/* TYPE 4 */}
            <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-[5px] overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-[#252525] p-4 md:p-6 border-b border-gray-200 dark:border-[#333]">
                   <h4 className="font-black text-lg md:text-xl text-indigo-600 dark:text-indigo-400 uppercase">Type 4: Rondedzero yetsanangudzo | Explanatory</h4>
                </div>
                <div className="p-6 md:p-10 bg-[#fdfbf7] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)', backgroundAttachment: 'local' }}>
                   <div className="relative">
                      <div className="absolute -left-6 md:-left-10 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                      <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.2rem", lineHeight: "32px", transform: "rotate(-0.5deg)" }}>
                         <div className="text-center font-bold underline mb-4 text-xl tracking-wide uppercase">Kurima Chibage</div>
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
                      </div>
                   </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* CHIKAMU 2 */}
      <section className="space-y-12 mt-20 pt-12 border-t-8 border-indigo-600 dark:border-indigo-500">
        <h2 className={sectionHeaderClasses}>
           CHIKAMU 2: TSAMBA | LETTER WRITING
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1e1e1e] p-6 border border-gray-200 dark:border-[#404040] rounded-[5px]">
               <h4 className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Mitemo Yese Yetsamba</h4>
               <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Kero + Zuva:</span> top right, hapana zita rako pano</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Mutauro:</span> zvinoenderana nekuti ndiyani wauri kunyorera</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Ndima:</span> siya mutsetse pakati pendima</div></li>
                  <li className="flex gap-2 items-start"><CheckCircle size={18} className="text-green-500 shrink-0"/> <div><span className="font-bold uppercase text-xs tracking-wider">Kuvhara:</span> zvinoenderana nerudzi rwetsamba</div></li>
               </ul>
            </div>
            
            <div className="bg-indigo-600 dark:bg-indigo-900 border border-indigo-500/20 text-white p-6 rounded-[5px] shadow-lg">
                <h4 className="font-black uppercase tracking-widest mb-4 text-indigo-100">TSAMBA YEUSHAMWARI VS YEPAMUTEMO</h4>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <tbody>
                         <tr className="border-b border-white/20">
                            <td className="py-2 font-bold opacity-70"> Chinangwa</td>
                            <td className="py-2">Kukurukura, kufara  <br/><span className="text-indigo-300 font-black">Vs</span> Kukumbira, kunyunyuta, kuita report</td>
                         </tr>
                         <tr className="border-b border-white/20">
                            <td className="py-2 font-bold opacity-70"> Kukwazisa</td>
                            <td className="py-2">Wadiwa..., Mudiwa... <br/><span className="text-indigo-300 font-black">Vs</span> Changamire, Madame...</td>
                         </tr>
                         <tr className="border-b border-white/20">
                            <td className="py-2 font-bold opacity-70"> Mutauro</td>
                            <td className="py-2">Wemazuva ese, majee <br/><span className="text-indigo-300 font-black">Vs</span> Unoremekedza, hapana majee</td>
                         </tr>
                         <tr className="border-b border-white/20">
                            <td className="py-2 font-bold opacity-70"> Kuvhara</td>
                            <td className="py-2">Wako, Shamwari yako <br/><span className="text-indigo-300 font-black">Vs</span> Wenyu akatendeka...</td>
                         </tr>
                         <tr>
                            <td className="py-2 font-bold opacity-70"> Kero 2</td>
                            <td className="py-2">Haina <br/><span className="text-indigo-300 font-black">Vs</span> Inodiwa (kero yekwairi kuenda)</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
            </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-16 mb-8 text-center pt-8">Letter Samples</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-8 pb-12">
            
            {/* Informal Letter */}
            <div className="rounded-[5px] bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-xl relative overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                <div className="bg-indigo-600 dark:bg-indigo-800 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
                    <span className="flex items-center gap-2"><UserCheck size={18}/> Shamwari (Informal)</span>
                </div>
                
                <div className="p-6 md:p-10 flex-1 relative" style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(156, 163, 175, 0.3) 31px, rgba(156, 163, 175, 0.3) 32px)',
                    backgroundAttachment: 'local'
                }}>
                    <div className="absolute left-10 md:left-14 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                    
                    <div className="pl-12 md:pl-16 text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.25rem", lineHeight: "32px", paddingTop: "0px" }}>
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

            {/* Formal Letter -> Kunyunyuta */}
            <div className="rounded-[5px] bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-xl relative overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                <div className="bg-indigo-800 dark:bg-indigo-950 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
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
                           <div style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.8rem", marginBottom: "0.2rem" }} className="text-indigo-900 dark:text-indigo-300 transform -rotate-3 inline-block">RMatambo</div>
                           <div className="font-bold">Rudo Matambo.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* EXAM TIPS SECTION */}
      <section className="space-y-12 mt-20 pt-12 border-t-8 border-indigo-600 dark:border-indigo-500 mb-20">
        <h2 className={sectionHeaderClasses}>
           📝 EXAM TIPS - KUPASA RONDEDZERO & TSAMBA
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded-[5px] p-6 shadow-sm">
                <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2"><Trophy className="text-yellow-500"/> Rondedzero Tips</h4>
                
                <div className="space-y-6">
                   <div>
                      <h5 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-tight text-sm">1. USATI WANYORA | PLANNING - 5 mins</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                         <li>Verenga misoro yese. Sarudza yaunogona kunyora zvakawandanezvayo.</li>
                         <li>Nyora 4-5 main points pabepa rerafhi. This is your <em>skeleton</em>.</li>
                         <li>Sarudza tsumo 2 dzaunoda kushandisa. Nyora pasi.</li>
                      </ul>
                   </div>
                   <div>
                      <h5 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-tight text-sm">2. PAKUNYORA | WRITING - 30 mins</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                         <li><span className="font-bold">Nhanganyaya inobata:</span> Tanga netsumo/mubvunzo. Ex: "Vana vangu..."</li>
                         <li><span className="font-bold">Ndima = Pfungwa:</span> Usasanganisa pfungwa. Ndima itsva, mutsetse mutsva.</li>
                         <li><span className="font-bold">Shandisa mutauro wepamusoro:</span> (Bad: Akamhanya. Good: Akamhanya semheni.)</li>
                         <li><span className="font-bold">Sanganisa tsumo/madimikira:</span> Minimum 3 murondedzero yese.</li>
                         <li><span className="font-bold">Tense:</span> Past tense kune zvakaitika. Present kune zviripo.</li>
                      </ul>
                   </div>
                   <div>
                      <h5 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-tight text-sm">3. WAPEDZA | EDITING - 5 mins</h5>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                         <li>Verenga rondedzero yako yese. Bvisa mazwi akadzokororwa.</li>
                         <li>Tarisa spelling (chikoro not chikolo) uye punctuation.</li>
                         <li>Count words roughly.</li>
                      </ul>
                   </div>
                   
                   <div className="bg-red-50 dark:bg-red-900/10 p-4 border-l-4 border-red-500 mt-4 rounded-r-[5px]">
                      <h5 className="font-bold text-red-700 dark:text-red-400 mb-2 text-xs uppercase tracking-widest">Zvinobviswa Marks:</h5>
                      <div className="text-xs text-red-600 dark:text-red-300 grid grid-cols-2 gap-2">
                         <div>-1 Hapana musoro</div>
                         <div>-1 Hapana ndima</div>
                         <div>-2 Girama yakaipa kwazvo</div>
                         <div>-5 Kana wabva pamusoro off topic</div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">
               <div className="bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded-[5px] p-6 shadow-sm">
                   <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2"><Trophy className="text-yellow-500"/> Tsamba Tips</h4>
                   <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                      <li className="flex gap-2"><span className="font-mono text-indigo-600 font-bold">1</span> <div><span className="font-bold">Kero nezuva zvinosungirwa</span> - ukakanganwa = -2 marks</div></li>
                      <li className="flex gap-2"><span className="font-mono text-indigo-600 font-bold">2</span> <div><span className="font-bold">Tsamba yepamutemo:</span> Usamboti "Hi" kana "Ndeipi". Gara uchiti Changamire/Madame.</div></li>
                      <li className="flex gap-2"><span className="font-mono text-indigo-600 font-bold">3</span> <div><span className="font-bold">Chikonzero chetsamba RE:</span> - nyora nemavara makuru, pasi pemutsetse.</div></li>
                      <li className="flex gap-2"><span className="font-mono text-indigo-600 font-bold">4</span> <div><span className="font-bold">Usanyore zita rako pakero</span> - zita rinoenda pasi pekuti Wenyu akatendeka chete.</div></li>
                      <li className="flex gap-2"><span className="font-mono text-indigo-600 font-bold">5</span> <div><span className="font-bold">Mutauro:</span> Tsamba yepamutemo = pinda straight. Tsamba yeushamwari = vhunza ufaro nezvimwe.</div></li>
                   </ul>
               </div>

               <div className="bg-indigo-600 dark:bg-indigo-900 border border-indigo-500/20 text-white rounded-[5px] p-6 shadow-xl relative overflow-hidden flex-1">
                   <div className="absolute right-0 top-0 opacity-10">
                      <CheckCircle size={150} />
                   </div>
                   <h4 className="font-black text-xl uppercase mb-4 relative z-10">🎯 Quick Revision Checklist</h4>
                   <p className="text-indigo-200 text-xs uppercase tracking-widest mb-4">Usati wapinda exam, zvibvunze:</p>
                   <div className="space-y-3 relative z-10 text-sm">
                      <label className="flex items-start gap-3 cursor-pointer group">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-400 text-indigo-900 focus:ring-0 cursor-pointer"/>
                         <span className="group-hover:text-indigo-100 transition-colors cursor-pointer">Ndinoziva structure yerondedzero - Nhanganyaya, Mutumbi, Mhedziso?</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-400 text-indigo-900 focus:ring-0 cursor-pointer"/>
                         <span className="group-hover:text-indigo-100 transition-colors cursor-pointer">Ndine tsumo 5 dzandinogona kushandisa chero murondedzero?</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-400 text-indigo-900 focus:ring-0 cursor-pointer"/>
                         <span className="group-hover:text-indigo-100 transition-colors cursor-pointer">Ndinoziva kusiyana kwetsamba yepamutemo neyeushamwari?</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-400 text-indigo-900 focus:ring-0 cursor-pointer"/>
                         <span className="group-hover:text-indigo-100 transition-colors cursor-pointer">Ndinoziva madimikira ekutsanangura giredhi nehunhu hwezvinhu?</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                         <input type="checkbox" className="mt-1 w-4 h-4 rounded border-indigo-400 text-indigo-900 focus:ring-0 cursor-pointer"/>
                         <span className="group-hover:text-indigo-100 transition-colors cursor-pointer">Ndinoziva kuronga ndima - pfungwa imwe pandima imwe?</span>
                      </label>
                   </div>
               </div>
            </div>
        </div>

        {/* TOP 10 TSUMO */}
        <div className="mt-12 bg-white dark:bg-[#1a1a1a] p-6 md:p-10 border border-gray-200 dark:border-[#404040] rounded-[5px] shadow-sm relative overflow-hidden">
           <h4 className="font-black text-2xl md:text-3xl text-center uppercase tracking-tight text-indigo-600 dark:text-indigo-400 mb-10 pb-4 border-b border-gray-100 dark:border-[#333]">Tsumo 10 Dzaunofanira Kubata Nemusoro</h4>
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
                    <span className="font-black text-gray-900 dark:text-gray-100 text-sm md:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"><span className="text-gray-400 mr-2">{idx + 1}.</span> {item[0]}</span>
                    <span className="text-[10px] md:text-xs text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-widest pl-6 font-bold mt-1">{item[1]}</span>
                 </div>
               ))}
           </div>
           
           <div className="mt-10 py-5 px-6 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 rounded-r-[5px] text-sm font-medium text-gray-800 dark:text-gray-200">
              <span className="font-black uppercase text-yellow-600 dark:text-yellow-500">Last Tip:</span> Practice! Nyora rondedzero imwe svondo rega-rega. Give it to teacher kuti a make. Unopasa ne 20+/25 kana ukatevedza izvi.
           </div>
        </div>
      </section>
`;

content = content.replace(regex, newContent);

fs.writeFileSync(file, content, 'utf8');

