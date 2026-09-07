const fs = require('fs');
let code = fs.readFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', 'utf8');

code = code.replace(
  /<details key=\{idx\} className=\{`\$\{isDarkMode \? 'bg-\[#1e1e1e\]\/80' : 'bg-gray-50'\} border \$\{isDarkMode \? 'border-purple-500\/30' : 'border-purple-200'\} rounded-lg overflow-hidden group`\}>[\s\S]*?<\/details>/g,
  `<details key={idx} className={\`border rounded-lg overflow-hidden group shadow-sm \${isDarkMode ? 'bg-[#1a1128] border-purple-500/30' : 'bg-purple-50/50 border-purple-200'}\`}>
                                                      <summary className={\`px-4 py-3 cursor-pointer text-sm font-semibold flex items-center justify-between list-none transition-colors \${isDarkMode ? 'text-purple-200 hover:bg-[#251a3a]' : 'text-purple-900 hover:bg-purple-100/50'}\`}>
                                                        <span className="flex items-center gap-2">
                                                            <Database className="w-4 h-4 text-purple-500" />
                                                            {q.title}
                                                        </span>
                                                        <span className={\`px-2 py-1 text-[11px] rounded-md border font-medium \${isDarkMode ? 'bg-[#251a3a] border-purple-500/30 text-purple-300' : 'bg-white border-purple-200 text-purple-700'}\`}>Click to expand</span>
                                                      </summary>
                                                      <div className={\`p-0 border-t \${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'}\`}>
                                                         <div className={\`flex justify-between items-center px-4 py-2 border-b \${isDarkMode ? 'bg-[#251a3a] border-purple-500/30' : 'bg-white border-purple-200'}\`}>
                                                           <span className={\`text-[11px] font-mono font-semibold uppercase tracking-wider \${isDarkMode ? 'text-purple-400' : 'text-purple-600'}\`}>SQL</span>
                                                           <button 
                                                             onClick={(e) => { e.preventDefault(); handleSnippetClick(q.sql, true); }}
                                                             className={\`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border shadow-sm \${isDarkMode ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 hover:bg-purple-600/40 hover:border-purple-400' : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'}\`}
                                                           >
                                                             <Play className={\`w-3 h-3 \${isDarkMode ? 'text-purple-300' : 'text-purple-50'}\`} /> Auto run
                                                           </button>
                                                         </div>
                                                         <div className={\`p-4 overflow-x-auto text-[13px] \${isDarkMode ? 'bg-[#110b1a]' : 'bg-[#fcfaff]'}\`}>
                                                            <SyntaxHighlighter
                                                               {...rest}
                                                               PreTag="div"
                                                               className="!m-0 !p-0 !bg-transparent font-mono leading-relaxed"
                                                               children={q.sql}
                                                               language="sql"
                                                               style={isDarkMode ? vscDarkPlus : vs}
                                                            />
                                                         </div>
                                                      </div>
                                                    </details>`
);

code = code.replace(
  /<div className=\{`\$\{isDarkMode \? 'bg-\[#1e1e1e\] border-indigo-500\/30' : 'bg-gray-50 border-indigo-200'\} border rounded-lg overflow-hidden my-3 shadow-md`\}>[\s\S]*?<\/div>\n                                       \);/g,
  `<div className={\`border rounded-xl overflow-hidden my-4 shadow-sm \${isDarkMode ? 'bg-[#1a1128] border-purple-500/30' : 'bg-purple-50/50 border-purple-200'}\`}>
                                             <div className={\`flex justify-between items-center px-4 py-2 border-b \${isDarkMode ? 'bg-[#251a3a] border-purple-500/30' : 'bg-white border-purple-200'}\`}>
                                               <span className={\`text-[11px] font-mono font-semibold uppercase tracking-wider \${isDarkMode ? 'text-purple-400' : 'text-purple-600'}\`}>SQL</span>
                                               <button 
                                                 onClick={() => handleSnippetClick(codeString, true)}
                                                 className={\`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border shadow-sm \${isDarkMode ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 hover:bg-purple-600/40 hover:border-purple-400' : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'}\`}
                                               >
                                                 <Play className={\`w-3 h-3 \${isDarkMode ? 'text-purple-300' : 'text-purple-50'}\`} /> Auto run
                                               </button>
                                             </div>
                                             <div className={\`p-4 overflow-x-auto text-[13px] \${isDarkMode ? 'bg-[#110b1a]' : 'bg-[#fcfaff]'}\`}>
                                                <SyntaxHighlighter
                                                   {...rest}
                                                   PreTag="div"
                                                   className="!m-0 !p-0 !bg-transparent font-mono leading-relaxed"
                                                   children={codeString}
                                                   language={match[1]}
                                                   style={isDarkMode ? vscDarkPlus : vs}
                                                />
                                             </div>
                                          </div>
                                        );`
);

fs.writeFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', code);
