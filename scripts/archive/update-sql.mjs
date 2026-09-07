import fs from 'fs';

let content = fs.readFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', 'utf8');

// 1. Add states for Draggable resizers and Auto Run
let stateRegex = /const \[hasExecuted, setHasExecuted\] = useState\(false\);/;
if (stateRegex.test(content) && !content.includes('leftColumnRatio')) {
    content = content.replace(stateRegex, `const [hasExecuted, setHasExecuted] = useState(false);
  const [leftColumnRatio, setLeftColumnRatio] = useState(65);
  const [topRowRatio, setTopRowRatio] = useState(50);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [autoRunCommands, setAutoRunCommands] = useState(true);
  const sqlWorkspaceRef = useRef<HTMLDivElement>(null);
  const sqlLeftColRef = useRef<HTMLDivElement>(null);
  
  const handleSqlColDown = (e: React.PointerEvent) => { setIsColDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const handleSqlRowDown = (e: React.PointerEvent) => { setIsRowDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  
  const handleSqlMove = (e: React.PointerEvent) => {
    if (isColDragging && sqlWorkspaceRef.current) {
       const { left, width } = sqlWorkspaceRef.current.getBoundingClientRect();
       if (window.innerWidth < 1024) return;
       let newRatio = ((e.clientX - left) / width) * 100;
       newRatio = Math.max(30, Math.min(80, newRatio));
       setLeftColumnRatio(newRatio);
    } else if (isRowDragging && sqlLeftColRef.current) {
       const { top, height } = sqlLeftColRef.current.getBoundingClientRect();
       let newRatio = ((e.clientY - top) / height) * 100;
       newRatio = Math.max(20, Math.min(80, newRatio));
       setTopRowRatio(newRatio);
    }
  };
  
  const handleSqlUp = (e: React.PointerEvent) => {
    setIsColDragging(false);
    setIsRowDragging(false);
    e.currentTarget.releasePointerCapture && e.currentTarget.releasePointerCapture(e.pointerId);
  };
`);
}

// 2. Add Auto Run effect
let aiEffectRegex = /setMessages\(prev => \[\.\.\.prev, newMsg\]\);/g;
// Wait, we need the autoRun effect that triggers when AI responds.
let useEffectForAI = /useEffect\(\(\) => \{\n\s*chatEndRef.current\?\.scrollIntoView\(\{ behavior: "smooth" \}\);\n\s*\}, \[messages\]\);/;
if (useEffectForAI.test(content) && !content.includes('setLastExecutedSqlAiIndex')) {
    content = content.replace(useEffectForAI, `useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [lastExecutedSqlAiIndex, setLastExecutedSqlAiIndex] = useState(-1);
  useEffect(() => {
     if (autoRunCommands && messages.length > 0) {
         const lastMsg = messages[messages.length - 1];
         if (lastMsg.role === 'assistant' && messages.length - 1 > lastExecutedSqlAiIndex) {
            // Find the SQL block and execute
            const codeMatch = lastMsg.content.match(/\\\`\\\`\\\`sql\\n([\\s\\S]*?)\\\`\\\`\\\`/);
            if (codeMatch) {
               handleAiInsertCode(codeMatch[1].trim());
            }
            setLastExecutedSqlAiIndex(messages.length - 1);
         }
     }
  }, [messages, autoRunCommands, lastExecutedSqlAiIndex]);
`);
}

// 3. Inject Auto Run toggle into AI UI
let aiHeaderRegex = /<h3 className=\{\`font-bold text-sm tracking-wide \$\{isDarkMode \? "text-gray-200" : "text-gray-700"\}\`\}>\s*Database Assistant\s*<\/h3>/;
if (aiHeaderRegex.test(content) && !content.includes('Auto run')) {
    content = content.replace(aiHeaderRegex, `<h3 className={\`font-bold text-sm tracking-wide \${isDarkMode ? "text-gray-200" : "text-gray-700"}\`}>
                              Database Assistant
                            </h3>
                            <div className="flex items-center gap-2 text-xs mr-2 ml-auto">
                              <span className={\`\${isDarkMode ? 'text-gray-400' : 'text-gray-500'}\`}>Auto run</span>
                              <button 
                                onClick={() => setAutoRunCommands(!autoRunCommands)}
                                className={\`w-8 h-4 rounded-full relative transition-colors \${autoRunCommands ? 'bg-green-500' : 'bg-gray-400'}\`}
                              >
                                <div className={\`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform \${autoRunCommands ? 'translate-x-4' : 'translate-x-0.5'}\`}/>
                              </button>
                            </div>`);
}

// Hide execute button if auto run
let executeBtnRegex = /\{\/\* Avatar for AI \*\/\}/g;
if (executeBtnRegex.test(content) && !content.includes('!autoRunCommands &&')) {
    content = content.replace(/<button\s*onClick=\{([^}]+)\}\s*className=\{`flex items-center gap-1 text-xs px-2\.5 py-1\.5 rounded transition-all ml-4 shrink-0/g,
                              `{!autoRunCommands && <button 
                        onClick={$1}
                        className={\`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded transition-all ml-4 shrink-0`);
    content = content.replace(/<Play className="w-3\.5 h-3\.5" \/> Execute\s*<\/button>/g, `<Play className="w-3.5 h-3.5" /> Execute</button>}`);
}

// 4. Update the layout styles and inject resizers
// Main workspace container wrapper
let workspaceRegex = /(<div className="flex-1 flex overflow-hidden lg:flex-row flex-col">)/;
if (workspaceRegex.test(content)) {
    content = content.replace(workspaceRegex, 
    \`<div 
        ref={sqlWorkspaceRef} 
        onPointerMove={handleSqlMove} 
        onPointerUp={handleSqlUp} 
        onPointerLeave={handleSqlUp}
        className="flex-1 flex overflow-hidden lg:flex-row flex-col"
      >\`);
}

// Left column
let leftColRegex = /(<div className="flex-1 min-w-0 flex flex-col transition-all duration-500 ease-in-out relative h-full">)/;
if (leftColRegex.test(content)) {
    content = content.replace(leftColRegex, 
    \`<div 
         ref={sqlLeftColRef}
         className="flex-1 min-w-0 flex flex-col relative h-full"
         style={{ flexBasis: window.innerWidth >= 1024 ? \\\`\\\${leftColumnRatio}%\\\` : 'auto', flexGrow: window.innerWidth >= 1024 ? 0 : 1, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }}
      >\`);
}

// Top inner row (SQL Editor)
let topRowRegex = /(<div\s*className=\{`flex flex-col transition-all duration-500 ease-in-out overflow-hidden shadow-\[2px_0_8px_rgba\(0,0,0,0\.05\)\] \$\{isDarkMode \? "bg-\[#1e1e1e\]" : "bg-white"\} \$\{hasExecuted \? "h-\[50%\]" : "h-full"\}`\}>)/;
if (topRowRegex.test(content)) {
    content = content.replace(topRowRegex, 
    \`<div
        className={\\\`flex flex-col overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.05)] \\\${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}\\\`}
        style={{ flexBasis: hasExecuted ? \\\`\\\${topRowRatio}%\\\` : '100%', flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }}
      >\`);
}

// Bottom inner row (Results Panel)
let bottomRowRegex = /(<div\s*className=\{`flex flex-col transition-all duration-500 ease-in-out border-t shrink-0 \$\{isDarkMode \? "bg-\[#1e1e1e\] border-\[#404040\]" : "bg-\[#f8f9fa\] border-gray-200"\} \$\{hasExecuted \? "h-\[50%\] opacity-100" : "h-0 opacity-0 overflow-hidden border-transparent"\}`\}>)/;
if (bottomRowRegex.test(content)) {
    content = content.replace(bottomRowRegex, 
    \`<div
        className={\\\`flex flex-col border-t shrink-0 \\\${isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}\\\`}
        style={{ flexBasis: hasExecuted ? \\\`\\\${100 - topRowRatio}%\\\` : '0%', opacity: hasExecuted ? 1 : 0, overflow: hasExecuted ? 'visible' : 'hidden', flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out, opacity 0.3s' }}
      >\`);
}

// Insert Row Divider
let runQueryDividerRegex = /({\/\* Table Data View \*\/})/;
if (runQueryDividerRegex.test(content)) {
    content = content.replace(runQueryDividerRegex, 
    \`{hasExecuted && (
        <div
          className={\\\`hidden lg:flex items-center justify-center relative cursor-row-resize \\\${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-full h-2 z-20 group active:bg-blue-600 hover:bg-blue-500 transition-colors\\\`}
          onPointerDown={handleSqlRowDown}
        >
          <div className={\\\`w-8 h-1 rounded-full \\\${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-blue-300\\\`} />
        </div>
      )}
      $1\`);
}

// Insert Col Divider and fix Right panel properties
let rightColRegex = /(<div\s*className=\{`w-full lg:w-80 xl:w-\[400px\] flex-shrink-0 flex flex-col h-full border-l \$\{isDarkMode \? "bg-\[#1e1e1e\] border-\[#404040\] text-gray-300" : "bg-white border-gray-200 text-gray-700"\}`\}>)/;
if (rightColRegex.test(content)) {
    content = content.replace(rightColRegex, 
    \`<div
        className={\\\`hidden lg:flex items-center justify-center relative cursor-col-resize \\\${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-2 h-full z-20 group active:bg-blue-600 hover:bg-blue-500 transition-colors\\\`}
        onPointerDown={handleSqlColDown}
      >
        <div className={\\\`w-1 h-8 rounded-full \\\${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-blue-300\\\`} />
      </div>
      <div 
        className={\\\`w-full flex-shrink-0 flex flex-col h-full border-l \\\${isDarkMode ? "bg-[#1e1e1e] border-[#404040] text-gray-300" : "bg-white border-gray-200 text-gray-700"}\\\`}
        style={{ flexBasis: window.innerWidth >= 1024 ? \\\`\\\${100 - leftColumnRatio}%\\\` : '100%', flexGrow: 0, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }}
      >\`);
}

fs.writeFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', content);

