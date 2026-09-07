import fs from 'fs';

let content = fs.readFileSync('src/features/practicals/tools/linux/LinuxTerminal.tsx', 'utf8');

const importsToAdd = `, Send, Bot, User, TerminalSquare, ChevronUp, ChevronDown, Play, Loader2`;
content = content.replace(/Trash2 \} from 'lucide-react';/, `Trash2${importsToAdd} } from 'lucide-react';`);

const reactSyntaxHighlighterImport = `
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
SyntaxHighlighter.registerLanguage('bash', bash);

const limeDarkStyle = {
  ...vs2015,
  'hljs': {
    ...vs2015['hljs'],
    background: '#050505',
    color: '#39ff14'
  }
};

const customAiStyles = \`
.ai-linux-input-container {
  display: flex; align-items: center; justify-content: center; position: relative; width: 100%; box-sizing: border-box;
}
.ai-linux-input {
  background-color: #010201; border: 1px solid rgba(57, 255, 20, 0.4); width: 100%; height: 48px; border-radius: 8px; color: #39ff14; padding-inline: 16px 50px; font-size: 14px; box-sizing: border-box; font-family: monospace; transition: all 0.3s ease;
}
.ai-linux-input:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.1);
  border-color: #39ff14;
}
.ai-linux-input::placeholder { color: rgba(57, 255, 20, 0.5); }

.glow-effect-lime {
  position: absolute; overflow: hidden; z-index: -1; border-radius: 8px; filter: blur(5px); height: 100%; width: 100%; 
  background: linear-gradient(90deg, rgba(57,255,20,0.1), rgba(0,0,0,0.8), rgba(57,255,20,0.1)); 
  background-size: 200% 200%; animation: lime-glow 3s ease infinite; border: 1px solid #39ff14;
}
@keyframes lime-glow {
  0% { background-position: 0% 50%; opacity: 0.5;}
  50% { background-position: 100% 50%; opacity: 1;}
  100% { background-position: 0% 50%; opacity: 0.5;}
}
.cyber-scroll::-webkit-scrollbar { width: 6px; }
.cyber-scroll::-webkit-scrollbar-track { background: #000; }
.cyber-scroll::-webkit-scrollbar-thumb { background: rgba(57, 255, 20, 0.5); border-radius: 3px; }
\`;
`;

// Inject imports
content = content.replace(/import \{ useNavigate \} from 'react-router-dom';/, `${reactSyntaxHighlighterImport}\nimport { useNavigate } from 'react-router-dom';`);

// Inject state and AI handle method
const stateToInject = `
  const [aiMessages, setAiMessages] = useState<{role: string; content: string}[]>([
    {role: "assistant", content: "Hi! I am your AI Kali Linux Assistant. Ask me how to use tools, and I can generate or run commands for you."}
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiChatExpanded, setIsAiChatExpanded] = useState(false);
  const aiEndOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiEndOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiChatExpanded]);

  const handleAiSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiInput.trim()) return;

    const newMsg = { role: "user", content: aiInput };
    setAiMessages(prev => [...prev, newMsg]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setAiMessages(prev => [...prev, { role: "assistant", content: "Please configure VITE_GROQ_API_KEY in your environment." }]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt = \`You are an expert Kali Linux and cybersecurity tutor. Help the user learn Linux commands, tools, and security concepts.
Keep your explanations concise and cyber-themed. 
If providing a command that the user can execute, place it inside a \`\\\`\\\`bash ... \`\\\`\\\` block.
Example:
\\\`\\\`\\\`bash
ls -la
\\\`\\\`\\\`\`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: \`Bearer \${apiKey}\` },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            ...aiMessages.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : '' })),
            newMsg
          ],
          temperature: 0.7,
        })
      });
      const data = await response.json();
      if (!data.error && data.choices && data.choices[0]) {
        setAiMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      } else {
        setAiMessages(prev => [...prev, { role: "assistant", content: \`Error: \${data.error?.message || "Failed"}\` }]);
      }
    } catch(err: any) {
        setAiMessages(prev => [...prev, { role: "assistant", content: \`Error: \${err.message}\` }]);
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleAiRunCommand = (cmd: string) => {
      // Execute the command directly
      // Remove backticks and trim
      const cleanCmd = cmd.replace(/^\\\`\\\`\\\`.*\n?/gm, '').replace(/\\\`\\\`\\\`/g, '').trim();
      executeCommand(cleanCmd);
  };

  const renderAiMessage = (content: string) => {
    const parts = content.split(/(\\\`\\\`\\\`[\\s\\S]*?\\n[\\s\\S]*?\\\`\\\`\\\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('\`\`\`')) {
        const match = part.match(/\\\`\\\`\\\`(?:[a-zA-Z]*)\\n([\\s\\S]*?)\\\`\\\`\\\`/);
        const code = match ? match[1].trim() : part.replace(/\\\`\\\`\\\`/g, '').trim();
        return (
          <div key={index} className="my-3 border border-[#39ff14]/30 rounded-md overflow-hidden bg-[#050505] shadow-[0_0_10px_rgba(57,255,20,0.1)]">
            <div className="flex justify-between items-center px-3 py-1.5 bg-[#0a0a0a] border-b border-[#39ff14]/20">
              <span className="text-[10px] text-[#39ff14] font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <TerminalIcon className="w-3 h-3" /> Terminal Command
              </span>
              <button 
                onClick={() => handleAiRunCommand(code)}
                className="flex items-center gap-1 text-[10px] bg-[#39ff14]/10 hover:bg-[#39ff14]/20 border border-[#39ff14]/50 text-[#39ff14] px-2 py-0.5 rounded transition-all"
              >
                <Play className="w-2.5 h-2.5" /> Execute
              </button>
            </div>
            <div className="p-2 overflow-x-auto text-xs text-[#39ff14] cyber-scroll">
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
      return <span key={index} className="whitespace-pre-wrap leading-relaxed">{part}</span>;
    });
  };
`;

content = content.replace(/const navigate = useNavigate\(\);/, \`const navigate = useNavigate();\n\${stateToInject}\`);

// Add custom styles at the top level
content = content.replace(/<div className=\{\`w-full h-screen/, \`<style>{customAiStyles}</style>\n    <div className={\`w-full h-screen\`);

// Inject the AI UI snippet inside the Terminal Pane
// Currently terminal pane ends where { promptState === 'NANO' ? ... : ... }
// We want to place the AI Chat right below the terminal div, taking up flex space.
const terminalUiRegex = /(<div\s+ref=\{terminalRef\}[\s\S]*?)(\{\/\* Divider \*\/\})/;

const newTerminalUi = \`$1
            {/* AI Assistant Chat Section */}
            {promptState !== 'NANO' && (
              <div className={\`flex flex-col border-t \${isDark ? 'border-[#333]' : 'border-gray-500'} bg-[#020202] \${isAiChatExpanded ? 'h-[40vh] md:h-1/2' : 'h-16 md:h-64'}\`} style={{ transition: 'height 0.3s ease' }}>
                <div 
                  className="px-4 py-2 flex justify-between items-center bg-[#050505] border-b border-[#111] cursor-pointer"
                  onClick={() => setIsAiChatExpanded(!isAiChatExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#39ff14]" />
                    <span className="text-xs font-bold text-[#39ff14] font-mono tracking-widest uppercase">SysAdmin AI</span>
                  </div>
                  <button className="text-[#39ff14] hover:bg-[#39ff14]/20 p-1 rounded transition-colors hidden md:block">
                    {isAiChatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  {/* Mobile toggle */}
                  <span className="text-[10px] text-[#39ff14]/60 md:hidden ml-auto">
                    {isAiChatExpanded ? 'Tap to minimize' : 'Tap to expand AI'}
                  </span>
                </div>

                <div className={\`flex-1 overflow-y-auto p-4 flex-col gap-4 cyber-scroll \${isAiChatExpanded || window.innerWidth >= 768 ? 'flex' : 'hidden md:flex'}\`}>
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                      <div className={\`max-w-[90%] md:max-w-[85%] rounded-lg p-3 text-sm font-mono \${
                        msg.role === 'user' 
                          ? 'bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14]' 
                          : 'bg-[#0a0a0a] border border-[#222] text-[#c0b9c0] shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
                      }\`}>
                        {msg.role === 'assistant' ? (
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#333]">
                                <Bot className="w-4 h-4 text-[#39ff14]" /> <span className="text-xs text-[#39ff14] font-bold">ROOT@AI</span>
                             </div>
                             {renderAiMessage(msg.content)}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                             <User className="w-4 h-4 opacity-70" />
                             {msg.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#0a0a0a] border border-[#39ff14]/30 text-[#39ff14] rounded-lg p-3 text-sm font-mono flex items-center gap-2">
                         <Loader2 className="w-4 h-4 animate-spin" /> Processing output...
                      </div>
                    </div>
                  )}
                  <div ref={aiEndOfMessagesRef} />
                </div>

                <div className={\`p-3 bg-[#050505] border-t border-[#111] \${isAiChatExpanded || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}\`}>
                  <form onSubmit={handleAiSendMessage} className="ai-linux-input-container">
                     <div className="glow-effect-lime"></div>
                     <input 
                       className="ai-linux-input"
                       placeholder="Message AI or request a command..."
                       value={aiInput}
                       onChange={(e) => setAiInput(e.target.value)}
                     />
                     <button 
                       type="submit"
                       disabled={!aiInput.trim() || isAiLoading}
                       className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#39ff14] hover:bg-[#39ff14]/20 rounded-md transition-colors disabled:opacity-30"
                     >
                       <Send className="w-4 h-4" />
                     </button>
                  </form>
                </div>
              </div>
            )}
         </div>

$2\`;

// We must apply the replacement carefully.
content = content.replace(/(<div \\n\s*ref=\{terminalRef\}[\s\S]*?<\/div>\\n\s*<\/div>\\n\s*\)}[\s\S]*?<\/div>\s*)({\/\* Divider \*\/})/, newTerminalUi);

fs.writeFileSync('src/features/practicals/tools/linux/LinuxTerminal.tsx', content);
