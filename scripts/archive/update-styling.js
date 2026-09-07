const fs = require('fs');
let code = fs.readFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', 'utf8');

code = code.replace(
  `                                                    <details key={idx} className={\`\${isDarkMode ? 'bg-[#1e1e1e]/80' : 'bg-gray-50'} border \${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-lg overflow-hidden group\`}>
                                                      <summary className={\`p-3 cursor-pointer text-sm font-semibold flex items-center justify-between \${isDarkMode ? 'text-indigo-100 hover:bg-white/5' : 'text-indigo-900 hover:bg-black/5'} list-none\`}>
                                                        <span>{q.title}</span>
                                                        <span className={\`bg-indigo-600 px-2 py-1 text-[10px] rounded shadow-md text-white transition-colors\`}>Expand Code</span>
                                                      </summary>
                                                      <div className={\`p-0 border-t \${isDarkMode ? 'border-purple-500/30 bg-black/40' : 'border-purple-200 bg-white'}\`}>
                                                         <div className={\`flex justify-between items-center px-3 py-2 border-b \${isDarkMode ? 'bg-[#2d2d2d] border-indigo-500/30' : 'bg-gray-100 border-indigo-200'}\`}>
                                                           <span className={\`text-xs font-semibold \${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}\`}>SQL Code</span>
                                                           <button 
                                                             onClick={(e) => { e.preventDefault(); handleSnippetClick(q.sql); }}
                                                             className="flex flex-row items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors shadow-sm"
                                                           >
                                                             <Play className="w-3 h-3" /> Run / Insert
                                                           </button>
                                                         </div>
                                                         <SyntaxHighlighter
                                                            {...rest}
                                                            PreTag="div"
                                                            className="!m-0 !bg-transparent text-xs"
                                                            children={q.sql}
                                                            language="sql"
                                                            style={isDarkMode ? vscDarkPlus : vs}
                                                         />
                                                      </div>
                                                    </details>`,
  \`                                                    <details key={idx} className={\\\`\${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'} border rounded-md overflow-hidden group shadow-sm\\\`}>
                                                      <summary className={\\\`px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between \${isDarkMode ? 'text-[#c9d1d9] hover:bg-[#161b22]' : 'text-[#24292f] hover:bg-[#f6f8fa]'} list-none transition-colors\\\`}>
                                                        <span className="font-sans flex items-center gap-2">
                                                            <Database className="w-4 h-4 text-indigo-500" />
                                                            {q.title}
                                                        </span>
                                                        <span className={\\\`text-[11px] px-2 py-1 rounded-md border \${isDarkMode ? 'bg-[#21262d] border-[#363b42] text-[#8b949e]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#57606a]'}\\\`}>Click to expand</span>
                                                      </summary>
                                                      <div className={\\\`p-0 border-t \${isDarkMode ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'}\\\`}>
                                                         <div className={\\\`flex justify-between items-center px-4 py-2 border-b \${isDarkMode ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-[#f6f8fa]'}\\\`}>
                                                           <span className={\\\`text-[11px] font-mono uppercase tracking-wider \${isDarkMode ? 'text-[#8b949e]' : 'text-[#57606a]'}\\\`}>sql</span>
                                                           <button 
                                                             onClick={(e) => { e.preventDefault(); handleSnippetClick(q.sql, true); }}
                                                             className={\\\`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border \${isDarkMode ? 'bg-[#21262d] border-[#363b42] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e]' : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'} shadow-sm\\\`}
                                                           >
                                                             <Play className="w-3 h-3 text-green-500" /> Auto run
                                                           </button>
                                                         </div>
                                                         <div className={\\\`p-4 overflow-x-auto text-[13px] \${isDarkMode ? 'bg-[#010409]' : 'bg-white'}\\\`}>
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
                                                    </details>\`
);

code = code.replace(
  `                                          <div className={\`\${isDarkMode ? 'bg-[#1e1e1e] border-indigo-500/30' : 'bg-gray-50 border-indigo-200'} border rounded-lg overflow-hidden my-3 shadow-md\`}>
                                             <div className={\`flex justify-between items-center px-3 py-2 border-b \${isDarkMode ? 'bg-[#2d2d2d] border-indigo-500/30' : 'bg-gray-100 border-indigo-200'}\`}>
                                               <span className={\`text-xs font-semibold \${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}\`}>SQL Code</span>
                                               <button 
                                                 onClick={() => handleSnippetClick(codeString)}
                                                 className="flex flex-row items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors shadow-sm"
                                               >
                                                 <Play className="w-3 h-3" /> Run / Insert
                                               </button>
                                             </div>
                                             <SyntaxHighlighter
                                                {...rest}
                                                PreTag="div"
                                                className="!m-0 !bg-transparent text-xs"
                                                children={codeString}
                                                language={match[1]}
                                                style={isDarkMode ? vscDarkPlus : vs}
                                             />
                                          </div>`,
  \`                                          <div className={\\\`\${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'} border rounded-md overflow-hidden my-4 shadow-sm\\\`}>
                                             <div className={\\\`flex justify-between items-center px-4 py-2 border-b \${isDarkMode ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-[#f6f8fa]'}\\\`}>
                                               <span className={\\\`text-[11px] font-mono uppercase tracking-wider \${isDarkMode ? 'text-[#8b949e]' : 'text-[#57606a]'}\\\`}>sql</span>
                                               <button 
                                                 onClick={() => handleSnippetClick(codeString, true)}
                                                 className={\\\`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border \${isDarkMode ? 'bg-[#21262d] border-[#363b42] text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e]' : 'bg-white border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6]'} shadow-sm\\\`}
                                               >
                                                 <Play className="w-3 h-3 text-green-500" /> Auto run
                                               </button>
                                             </div>
                                             <div className={\\\`p-4 overflow-x-auto text-[13px] \${isDarkMode ? 'bg-[#010409]' : 'bg-white'}\\\`}>
                                                <SyntaxHighlighter
                                                   {...rest}
                                                   PreTag="div"
                                                   className="!m-0 !p-0 !bg-transparent font-mono leading-relaxed"
                                                   children={codeString}
                                                   language={match[1]}
                                                   style={isDarkMode ? vscDarkPlus : vs}
                                                />
                                             </div>
                                          </div>\`
);

fs.writeFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', code);
console.log('done');
