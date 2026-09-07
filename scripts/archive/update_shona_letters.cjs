const fs = require('fs');
let file = 'courses/form-1/shona/LearningOutcome1.tsx';
let content = fs.readFileSync(file, 'utf8');

let newLetters = `        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12 pb-12">
            
            {/* Informal Letter */}
            <div className="rounded-[5px] bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-[2px_4px_16px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                {/* Header */}
                <div className="bg-indigo-600 dark:bg-indigo-800 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
                    <span className="flex items-center gap-2"><UserCheck size={18}/> Tsamba yeShamwari (Informal)</span>
                </div>
                
                {/* Paper Body */}
                <div className="p-6 md:p-8 flex-1 relative" style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, var(--line-color) 31px, var(--line-color) 32px)',
                    backgroundAttachment: 'local',
                    '--line-color': 'rgba(156, 163, 175, 0.3)'
                }}>
                    {/* Vertical margin line */}
                    <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-400/50 dark:bg-red-900/50"></div>
                    
                    <div className="pl-10 text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.1rem", lineHeight: "32px", paddingTop: "0px" }}>
                        <div className="text-right">House Number 45,<br/>Highfield, Harare.<br/>20 Mbudzi 2023.</div>
                        <div className="mt-4 font-bold">Dear Simba,</div>
                        <div className="mt-4 text-justify indent-8">Ndinovimba kuti tsamba ino inokuwana uine mufaro mukuru semwedzi wechirimo. Ndanyorera kukukurudzira kuti udzidze nesimba sezvo bvunzo dzedu dzepakupera kwegore dzoswedera. Wakaona here kuti nguva iri kufamba sekuya?</div>
                        <div className="mt-4 text-justify indent-8">Kuno kumba vese vari kutaura nezvekuti uchauya rinhi kuzotishanyira pazororo rinouya. Rangarira zviya zvatakaronga maererano nepurojekiti yedu yekurima tomato.</div>
                        <div className="mt-4 text-justify indent-8">Ndakamirira kunzwa kubva kwauri.</div>
                        
                        <div className="mt-8 text-right">
                           <div className="mb-2">Shamwari yako,</div>
                           <div className="font-bold text-2xl font-signature">Farai.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formal Letter */}
            <div className="rounded-[5px] bg-[#fdfbf7] dark:bg-[#1a1a1a] shadow-[2px_4px_16px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col border border-gray-200 dark:border-[#333]">
                {/* Header */}
                <div className="bg-indigo-800 dark:bg-indigo-950 text-white font-bold px-4 py-2 uppercase flex items-center justify-between z-10 shrink-0">
                    <span className="flex items-center gap-2"><Mail size={18}/> Tsamba yeBasa (Formal)</span>
                </div>
                
                {/* Paper Body */}
                <div className="p-6 md:p-8 flex-1 relative">
                    <div className="text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Times New Roman', serif", fontSize: "1.05rem", lineHeight: "1.6" }}>
                        <div className="text-right mb-6">Unit L, Chitungwiza.<br/>20 Mbudzi 2023.</div>
                        
                        <div className="mb-6">Mudzidzisi Mukuru,<br/>Seke High School.</div>
                        
                        <div className="mb-4">Dear Sir,</div>
                        
                        <div className="mb-6 font-bold underline uppercase tracking-wide">RE: KUKUMBIRA KUSHANDISA RAIHUBHURARI</div>
                        
                        <p className="mb-4 text-justify">Ndiri mudzidzi weForm 1 wekirasi ye 1B pachikoro chenyu. Ndinokumbirawo kuti mundipewo mvumo yekushandisa raihubhurari yechikoro panguva yedining.</p>
                        
                        <p className="mb-4 text-justify">Izvi zvichandibatsira kudzidza zvakanyanya nekuita tsvagiridzo yeZimsec NASS projects dzangu dzesainzi nerurimi rweShona pasina ruzha rwevamwe vadzidzi.</p>
                        
                        <p className="mb-6 text-justify">Ndino vimbisa kuti ndichatevera mitemo yese inochengetedza mabhuku nerunyararo muraihubhurari.</p>
                        
                        <div className="mt-8 text-right">
                           <div className="mb-4">Wenyu akavimbika,</div>
                           <div style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: "1.5rem", marginBottom: "0.5rem" }} className="text-indigo-900 dark:text-indigo-300 transform -rotate-2 inline-block">TMushando.</div>
                           <div className="font-bold">Tariro Mushando.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

let match = /<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
content = content.replace(match, newLetters + '\n      </div>\n    </div>');

// also replace all rounded-X with rounded-[5px]
content = content.replace(/rounded-(xl|2xl|3xl|lg|md|full)/g, 'rounded-[5px]');

fs.writeFileSync(file, content);
