import fs from 'fs';

let content = fs.readFileSync('src/features/practicals/tools/linux/LinuxTerminal.tsx', 'utf8');

// The goal is to:
// 1. Add autoRunCommands state.
// 2. Add an extra resizer between GUI pane and AI pane.
// 3. Update the AI pane colors and structure to match the prompt's screenshot.
// 4. Update the logic for AI execute command.

// First, inject state
let stateMatch = content.match(/const \[aiMessages, setAiMessages\] = useState.*?;\n/);
if (stateMatch) {
    if (!content.includes('const [autoRunCommands, setAutoRunCommands]')) {
        content = content.replace(
            stateMatch[0],
            `const [autoRunCommands, setAutoRunCommands] = useState(true);\n  ${stateMatch[0]}`
        );
    }
}

// Update handleAiRunCommand to handle autoRun
let runCmdMatch = content.match(/const handleAiRunCommand = \(cmd: string\) => {([\s\S]*?)};/);
if (runCmdMatch) {
    content = content.replace(
        runCmdMatch[0],
        `const handleAiRunCommand = (cmd: string) => {
      const cleanCmd = cmd.replace(/^\\s*\\$\\s+/gm, '').replace(/^\\\`\\\`\\\`.*\\n?/gm, '').replace(/\\\`\\\`\\\`/g, '').trim();
      executeCommand(cleanCmd);
  };`
    );
}

// In handleAiSendMessage, if autoRunCommands is true, how do we run it?
// Actually, it runs when the user clicks 'Execute', or automatically if it is returned? 
// If it's returning from AI in a block, we parse it out and execute it immediately if autoRunCommands is true.
// To do this properly, we can do it inside the useEffect that listens to aiMessages.
let aiEffectMatch = content.match(/useEffect\(\(\) => \{\n\s*aiEndOfMessagesRef.current\?\.scrollIntoView\(\{ behavior: 'smooth' \}\);\n\s*\}, \[aiMessages, isAiChatExpanded\]\);/);

if (aiEffectMatch && !content.includes('// Auto-run effect')) {
    let newEffect = `${aiEffectMatch[0]}
  
  // Auto-run effect
  const [lastExecutedMessageIndex, setLastExecutedMessageIndex] = useState(-1);
  useEffect(() => {
     if (autoRunCommands && aiMessages.length > 0) {
         const lastMsg = aiMessages[aiMessages.length - 1];
         if (lastMsg.role === 'assistant' && aiMessages.length - 1 > lastExecutedMessageIndex) {
             const codeMatch = lastMsg.content.match(/\\\`\\\`\\\`(?:[a-zA-Z]*)\\n([\\s\\S]*?)\\\`\\\`\\\`/);
             if (codeMatch) {
                 const code = codeMatch[1].trim();
                 handleAiRunCommand(code);
             }
             setLastExecutedMessageIndex(aiMessages.length - 1);
         }
     }
  }, [aiMessages, autoRunCommands, lastExecutedMessageIndex]);
  `;
    content = content.replace(aiEffectMatch[0], newEffect);
}

// Now replace AI chat visual design:
// From: {/* AI Assistant Chat Right Sidebar */}
// To the end of it.

const sidebarRegex = /\{\/\* AI Assistant Chat Right Sidebar \*\/\}[\s\S]*?<\/form>\s*<\/div>\s*<\/div>/;
const newSidebar = `
         {/* AI Assistant Chat Right Sidebar */}
         <div 
           className={\`w-full md:w-80 h-[50vh] md:h-full flex flex-col \${isDark ? 'bg-[#1c1c1c] border-[#333]' : 'bg-[#f4f4f5] border-gray-300'} border-t md:border-t-0 md:border-l shrink-0 order-3 md:order-2\`}
           style={{ flexBasis: \`calc(\${aiSplitRatio}%)\`, flexGrow: 0, flexShrink: 0 }}
         >
            <div className={\`px-4 py-3 flex justify-between items-center \${isDark ? 'bg-[#212121] border-b border-[#333]' : 'bg-white border-b border-gray-300'}\`}>
              <div className="flex items-center gap-2">
                <Bot className={\`w-5 h-5 \${isDark ? 'text-gray-200' : 'text-gray-800'}\`} />
                <span className={\`text-sm font-bold \${isDark ? 'text-gray-200' : 'text-gray-800'} tracking-wide\`}>AI Chat</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                 <span className={\`\${isDark ? 'text-gray-400' : 'text-gray-500'}\`}>Auto run</span>
                 <button 
                   onClick={() => setAutoRunCommands(!autoRunCommands)}
                   className={\`w-8 h-4 rounded-full relative transition-colors \${autoRunCommands ? 'bg-green-500' : 'bg-gray-400'}\`}
                 >
                   <div className={\`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform \${autoRunCommands ? 'translate-x-4' : 'translate-x-0.5'}\`}/>
                 </button>
              </div>
            </div>

            <div className={\`flex-1 overflow-y-auto p-4 flex flex-col gap-6 \${isDark ? 'bg-[#141414]' : 'bg-[#fafafa]'}\`}>
              {aiMessages.map((msg, i) => (
                <div key={i} className="flex flex-col gap-1 text-sm font-sans">
                  {msg.role === 'user' ? (
                     <>
                        <div className="font-semibold text-[#ea4335] text-xs uppercase mb-1 tracking-wider">You</div>
                        <div className={\`self-start px-3 py-2 rounded-lg \${isDark ? 'bg-[#2a2a2a] text-gray-200' : 'bg-[#e0e0e0] text-gray-800'}\`}>
                           {msg.content}
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="font-semibold text-green-500 text-xs uppercase mb-1 tracking-wider">AI</div>
                        <div className={\`self-start px-0 py-1 w-full \${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed\`}>
                           {renderAiMessage(msg.content, isDark)}
                        </div>
                     </>
                  )}
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className={\`flex items-center gap-2 p-3 text-sm \${isDark ? 'text-gray-400' : 'text-gray-600'}\`}>
                     <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={aiEndOfMessagesRef} />
            </div>

            <div className={\`p-3 \${isDark ? 'bg-[#1c1c1c] border-t border-[#333]' : 'bg-white border-t border-gray-300'}\`}>
              <form onSubmit={handleAiSendMessage} className="relative flex items-center">
                 <input 
                   className={\`w-full h-10 rounded-full pl-4 pr-10 text-sm focus:outline-none transition-colors \${isDark ? 'bg-[#2a2a2a] text-gray-200 border-[#444] focus:border-gray-500 border' : 'bg-gray-100 text-gray-800 border-gray-300 focus:border-gray-400 border'}\`}
                   placeholder="Ask anything..."
                   value={aiInput}
                   onChange={(e) => setAiInput(e.target.value)}
                 />
                 <button 
                   type="submit"
                   disabled={!aiInput.trim() || isAiLoading}
                   className={\`absolute right-1 w-8 h-8 flex items-center justify-center rounded-full transition-colors \${aiInput.trim() && !isAiLoading ? 'bg-[#ea4335] text-white hover:bg-red-600' : (isDark ? 'bg-[#444] text-gray-500' : 'bg-gray-300 text-gray-500')}\`}
                 >
                   <Send className="w-4 h-4 ml-[-2px]" />
                 </button>
              </form>
            </div>
         </div>
`;

content = content.replace(sidebarRegex, newSidebar);


// Also update renderAiMessage since we pass isDark
const renderRegex = /const renderAiMessage = \(content: string\) => \{([\s\S]*?)\n  \};\n/;
const newRenderAiMessage = `
  const renderAiMessage = (content: string, isDark: boolean) => {
    const parts = content.split(/(\\\`\\\`\\\`[\\s\\S]*?\\n[\\s\\S]*?\\\`\\\`\\\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('\`\`\`')) {
        const match = part.match(/\\\`\\\`\\\`(?:[a-zA-Z]*)\\n([\\s\\S]*?)\\\`\\\`\\\`/);
        const code = match ? match[1].trim() : part.replace(/\\\`\\\`\\\`/g, '').trim();
        return (
          <div key={index} className={\`my-3 border rounded-md overflow-hidden \${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-gray-50 border-gray-200'}\`}>
            <div className={\`flex justify-between items-center px-3 py-2 \${isDark ? 'bg-[#252525] border-b border-[#333]' : 'bg-gray-100 border-b border-gray-200'}\`}>
              <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              {!autoRunCommands && (
                  <button 
                    onClick={() => handleAiRunCommand(code)}
                    className={\`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-all \${isDark ? 'bg-[#333] hover:bg-[#444] text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}\`}
                  >
                    <Play className="w-2.5 h-2.5" /> Run
                  </button>
              )}
            </div>
            <div className="p-3 overflow-x-auto text-sm cyber-scroll">
              <SyntaxHighlighter
                   style={limeDarkStyle as any}
                   customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                   language="bash"
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }
      // Handle normal code backticks
      return <span key={index} className="whitespace-pre-wrap">{
          part.split(/(\\\`[^\\\`]+\\\`)/g).map((subPart, i) => {
              if (subPart.startsWith('\`') && subPart.endsWith('\`')) {
                  return <code key={i} className={\`px-1.5 py-0.5 rounded text-[13px] \${isDark ? 'bg-[#2a2a2a] text-green-400' : 'bg-gray-200 text-green-600'} font-mono\`}>{subPart.slice(1, -1)}</code>;
              }
              return subPart;
          })
      }</span>;
    });
  };
`;

content = content.replace(renderRegex, newRenderAiMessage);


// To add a resizer for the AI panel, we need a new state for its AI ratio
let layoutStateMatch = content.match(/const \[splitRatio, setSplitRatio\] = useState\(50\);\n\s*const \[isDragging, setIsDragging\] = useState\(false\);\n/);
if (layoutStateMatch && !content.includes('aiSplitRatio')) {
    content = content.replace(
        layoutStateMatch[0],
        `${layoutStateMatch[0]}  const [aiSplitRatio, setAiSplitRatio] = useState(25);
  const [isAiDragging, setIsAiDragging] = useState(false);
`
    );
}

// Add the drag handlers for AI panel
let handlePointerDownMatch = content.match(/const handlePointerDown = \(e: React\.PointerEvent\) => \{\n\s*setIsDragging\(true\);\n\s*\};/);
if (handlePointerDownMatch && !content.includes('handleAiPointerDown')) {
    content = content.replace(
        handlePointerDownMatch[0],
        `${handlePointerDownMatch[0]}
  const handleAiPointerDown = (e: React.PointerEvent) => {
    setIsAiDragging(true);
  };
`
    );
}

let handlePointerUpMatch = content.match(/const handlePointerUp = \(\) => \{\n\s*setIsDragging\(false\);\n\s*\};/);
if (handlePointerUpMatch && !content.includes('setIsAiDragging(false)')) {
    content = content.replace(
        handlePointerUpMatch[0],
        `const handlePointerUp = () => {
    setIsDragging(false);
    setIsAiDragging(false);
  };`
    );
}

let handlePointerMoveMatch = content.match(/const handlePointerMove = \(e: React\.PointerEvent\) => \{([\s\S]*?)\n\s*\};/);
if (handlePointerMoveMatch && !content.includes('if (isAiDragging)')) {
    const moveLogic = `const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const { top, left, width, height } = containerRef.current.getBoundingClientRect();
    
    if (isAiDragging) {
       if (window.innerWidth < 768) return; 
       let newRatio = ((width - (e.clientX - left)) / width) * 100;
       newRatio = Math.max(15, Math.min(40, newRatio)); // 15% to 40% for AI
       setAiSplitRatio(newRatio);
       return;
    }

    if (!isDragging) return;

    if (window.innerWidth < 768) {
      let newRatio = ((e.clientY - top) / height) * 100;
      newRatio = Math.max(20, Math.min(80, newRatio));
      setSplitRatio(newRatio);
    } else {
      // splitRatio represents GUI percentage. GUI is on the right of the split area (which is 100 - aiSplitRatio).
      // Wait, the "container" is the wrapper of [Terminal, Divider, GUI, AI].
      // Actually containerRef is on the inner wrapper of [Terminal, Divider, GUI]?
      // Let's check the layout.
      
      let newRatio = ((width - (e.clientX - left)) / width) * 100;
      newRatio = Math.max(20, Math.min(80, newRatio));
      setSplitRatio(newRatio);
    }
  };`;
    content = content.replace(handlePointerMoveMatch[0], moveLogic);
}

// Add the Divider between GUI and AI chat
const secondDivider = `
      {/* Second Divider for AI Chat */}
      <div
         className={\`hidden md:flex items-center justify-center relative z-40 cursor-col-resize \${isDark ? 'bg-[#333]' : 'bg-gray-300'} w-1 h-full group hover:bg-red-500 transition-colors shrink-0 order-2 md:order-2 active:bg-red-600\`}
         onPointerDown={handleAiPointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}
      >
          <div className={\`w-1 h-8 rounded-full \${isDark ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-red-300\`} />
      </div>
`;
// Put it right before {/* AI Assistant Chat Right Sidebar */}
content = content.replace(/\{\/\* AI Assistant Chat Right Sidebar \*\/\}/, `${secondDivider}\n         {/* AI Assistant Chat Right Sidebar */}`);

// We need to inject `onMouseMove={handlePointerMove}` into the main wrapper since now there are two drag zones. Unchanged for now, as onMouseMove handles both `isDragging` and `isAiDragging`.
// One adjustment for the GUI pane style flexBasis: We need it to shrink to the remaining space if AI is taking e.g. 25%.
// Right now the inner wrapper for Terminal + GUI has \`flex-1\`. Its size is 100% - AI pane size.
// The splitRatio splits that inner wrapper. So existing splitRatio math is fine IF containerRef is on that inner wrapper.

fs.writeFileSync('src/features/practicals/tools/linux/LinuxTerminal.tsx', content);

