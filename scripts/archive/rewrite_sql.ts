import fs from 'fs';

let content = fs.readFileSync('./components/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', 'utf8');

// 1. Add lucide react icons
content = content.replace("Lightbulb, X, Sun, Moon", "Lightbulb, X, Sun, Moon, MessageSquare, Send, Bot");

// 2. Add state
const stateToAdd = `
  const [activeTab, setActiveTab] = useState<'snippets' | 'ai'>('snippets');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{role: 'assistant', content: 'Hi! I am your AI SQL tutor. Ask me a question or tell me what to write for you!'}]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading, activeTab]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMsg = {role: 'user', content: chatInput};
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) {
            setMessages(prev => [...prev, {role: 'assistant', content: "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI tutor. You can get a free key from console.groq.com."}]);
            setIsAiLoading(false);
            return;
        }

        const systemPrompt = "You are an expert SQL database tutor for students. Help them learn SQL. Keep explanations concise. If they ask you to write code, you MUST provide it inside \`\`\`sql ... \`\`\` blocks so the app can extract and inject it into the editor.";

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${apiKey}\`
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    {role: 'system', content: systemPrompt},
                    ...messages.map(m => ({role: m.role, content: m.content})),
                    newMsg
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }
        
        let aiText = data.choices[0].message.content || '';
        setMessages(prev => [...prev, {role: 'assistant', content: aiText}]);

        const sqlMatch = aiText.match(/\`\`\`sql\n?([\s\S]*?)\`\`\`/i) || aiText.match(/\`\`\`\n?([\s\S]*?)\`\`\`/i);
        if (sqlMatch && sqlMatch[1]) {
            handleSnippetClick(sqlMatch[1].trim());
        }
        
    } catch (e: any) {
        setMessages(prev => [...prev, {role: 'assistant', content: \`Error: \${e.message}\`}]);
    } finally {
        setIsAiLoading(false);
    }
  };
`;

content = content.replace("const [isTyping, setIsTyping] = useState(false);", stateToAdd + "\n  const [isTyping, setIsTyping] = useState(false);");

// 3. Update the UI
const sidebarRegex = /\{\/\* Right Sidebar: Snippets \*\/\}([\s\S]*?)<\/div>\n\n        <\/div>/;
const sidebarReplacement = `
          {/* Right Sidebar: Tabs */}
          <div className={\`w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col max-h-[80vh] shadow-sm rounded-xl border \${isDarkMode ? 'bg-[#1e1e1e] border-[#404040] text-gray-300' : 'bg-white border-gray-200 text-gray-700'}\`}>
            
            {/* Tabs Header */}
            <div className={\`flex border-b \${isDarkMode ? 'border-[#404040]' : 'border-gray-200'}\`}>
               <button 
                 onClick={() => setActiveTab('snippets')}
                 className={\`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors border-b-2 \${activeTab === 'snippets' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}\`}
               >
                 <Lightbulb className="w-4 h-4" /> Snippets
               </button>
               <button 
                 onClick={() => setActiveTab('ai')}
                 className={\`flex-1 py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors border-b-2 \${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}\`}
               >
                 <Bot className="w-4 h-4" /> Study with AI
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar flex flex-col gap-4 relative min-h-[400px]">
              {activeTab === 'snippets' ? (
                <>
                  {isTyping && (
                    <div className={\`p-4 rounded-xl text-center text-sm font-semibold animate-pulse border \${isDarkMode ? 'bg-indigo-900/40 text-blue-300 border-indigo-700' : 'bg-blue-50 text-blue-600 border-blue-200'}\`}>
                      {typingMessage || 'Typing...'}
                    </div>
                  )}

                  {!isTyping && snippetData.map((snippet, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleSnippetClick(snippet.code)}
                        className={\`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md \${
                          isDarkMode ? 'bg-[#252526] border-[#404040] hover:border-indigo-500' : 'bg-[#f8f9fa] border-gray-200 hover:border-indigo-500 hover:bg-white'
                        }\`}
                      >
                        <h4 className="font-bold text-sm mb-1 text-indigo-600 dark:text-indigo-400">{snippet.title}</h4>
                        <p className="text-xs opacity-80 leading-relaxed">{snippet.description}</p>
                      </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col h-full absolute inset-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                     {messages.map((m, i) => (
                       <div key={i} className={\`flex flex-col \${m.role === 'user' ? 'items-end' : 'items-start'}\`}>
                         <div className={\`max-w-[85%] rounded-2xl p-3 text-sm \${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : (isDarkMode ? 'bg-[#333] rounded-bl-none' : 'bg-gray-100 rounded-bl-none')}\`}>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                         </div>
                       </div>
                     ))}
                     {isAiLoading && (
                       <div className="flex flex-col items-start">
                         <div className={\`max-w-[85%] rounded-2xl p-3 text-sm flex gap-1 items-center \${isDarkMode ? 'bg-[#333] rounded-bl-none' : 'bg-gray-100 rounded-bl-none'}\`}>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                         </div>
                       </div>
                     )}
                     <div ref={endOfMessagesRef} />
                  </div>
                  <div className={\`p-3 border-t \${isDarkMode ? 'border-[#404040]' : 'border-gray-200'}\`}>
                     <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask AI or say 'Write code for...'"
                          className={\`flex-1 min-w-0 rounded-full px-4 py-2 text-sm outline-none border \${isDarkMode ? 'bg-[#252526] border-[#404040] focus:border-indigo-500' : 'bg-gray-50 border-gray-200 focus:border-indigo-500'}\`}
                        />
                        <button 
                          type="submit" 
                          disabled={isAiLoading || !chatInput.trim()}
                          className="bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50 shrink-0"
                        >
                           <Send className="w-4 h-4" />
                        </button>
                     </form>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
`;

content = content.replace(sidebarRegex, sidebarReplacement);

fs.writeFileSync('./components/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', content);
