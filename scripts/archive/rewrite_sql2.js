const fs = require('fs');

let content = fs.readFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', 'utf-8');

// 1. Remove pendingCodeSnippet state
content = content.replace("  const [pendingCodeSnippet, setPendingCodeSnippet] = useState<string | null>(null);\n", "");
content = content.replace("  const [isTyping, setIsTyping] = useState(false);", "  const [isTyping, setIsTyping] = useState(false);\n  const [attachedImage, setAttachedImage] = useState<string | null>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);");

// 2. Add customInputStyles before the component
const styles = `
const customInputStyles = \`
.grid-bg-ai { background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 1rem 1rem; background-position: center center; position: absolute; inset: 0; z-index: 0; }
.ai-w, .ai-b, .ai-db, .ai-g {
  height: 100%; width: 100%; position: absolute; overflow: hidden; z-index: -1; border-radius: 12px; filter: blur(3px);
}
.ai-input {
  background-color: #010201; border: none; width: 100%; height: 56px; border-radius: 10px; color: white; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box;
}
#poda { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; box-sizing: border-box; }
.ai-input::placeholder { color: #c0b9c0; }
.ai-input:focus { outline: none; }
#main:focus-within > #input-mask { display: none; }
#input-mask { pointer-events: none; width: 100px; height: 20px; position: absolute; background: linear-gradient(90deg, transparent, black); top: 18px; left: 70px; }
#pink-mask { pointer-events: none; width: 30px; height: 20px; position: absolute; background: #cf30aa; top: 10px; left: 5px; filter: blur(20px); opacity: 0.8; transition: all 2s; }
#main:hover > #pink-mask { opacity: 0; }
.ai-w::before, .ai-b::before, .ai-db::before, .ai-g:before { content: ""; z-index: -2; text-align: center; top: 50%; left: 50%; position: absolute; width: 600px; height: 600px; background-repeat: no-repeat; background-position: 0 0; transition: all 2s; }
.ai-w::before { transform: translate(-50%, -50%) rotate(83deg); filter: brightness(1.4); background-image: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%); }
.ai-b::before { transform: translate(-50%, -50%) rotate(70deg); filter: brightness(1.3); background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%); }
.ai-db::before { transform: translate(-50%, -50%) rotate(82deg); background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%); }
#poda:hover > .ai-db::before { transform: translate(-50%, -50%) rotate(-98deg); }
#poda:hover > .ai-g::before { transform: translate(-50%, -50%) rotate(-120deg); }
#poda:hover > .ai-w::before { transform: translate(-50%, -50%) rotate(-97deg); }
#poda:hover > .ai-b::before { transform: translate(-50%, -50%) rotate(-110deg); }
#poda:focus-within > .ai-db::before { transform: translate(-50%, -50%) rotate(442deg); transition: all 4s; }
#poda:focus-within > .ai-g::before { transform: translate(-50%, -50%) rotate(420deg); transition: all 4s; }
#poda:focus-within > .ai-w::before { transform: translate(-50%, -50%) rotate(443deg); transition: all 4s; }
#poda:focus-within > .ai-b::before { transform: translate(-50%, -50%) rotate(430deg); transition: all 4s; }
.ai-g { filter: blur(30px); opacity: 0.4; overflow: hidden; max-height: 200px; border-radius: 20px;}
.ai-g:before { content: ""; position: absolute; transform: translate(-50%, -50%) rotate(60deg); width: 900px; height: 900px; background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%); }
#main { position: relative; width: 100%; box-sizing: border-box; }
#search-icon { position: absolute; left: 15px; top: 16px; pointer-events: none; }
#filter-icon { position: absolute; top: 8px; right: 8px; display: flex; align-items: center; justify-content: center; z-index: 2; height: 40px; width: 40px; isolation: isolate; overflow: hidden; border-radius: 10px; background: linear-gradient(180deg, #161329, black, #1d1b4b); border: 1px solid transparent; cursor: pointer; transition: transform 0.2s; }
#filter-icon:active { transform: scale(0.95); }
.filterBorder { height: 42px; width: 42px; position: absolute; overflow: hidden; top: -1px; right: -1px; border-radius: 10px; z-index: -1; }
.filterBorder::before { content: ""; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg); position: absolute; width: 100px; height: 100px; background-repeat: no-repeat; background-position: 0 0; filter: brightness(1.35); background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%); animation: ai-rotate 4s linear infinite; }
@keyframes ai-rotate { 100% { transform: translate(-50%, -50%) rotate(450deg); } }
\`;
`;
content = content.replace("export const SQLPractice: React.FC<Props> = ({ onBack }) => {", styles + "\nexport const SQLPractice: React.FC<Props> = ({ onBack }) => {");

// 3. Add handlePaste & handleFileChange hooks inside the component
const hooks = `
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) setAttachedImage(event.target.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onload = (event) => {
         if (event.target?.result) setAttachedImage(event.target.result as string);
       };
       reader.readAsDataURL(file);
    }
  };
`;
content = content.replace("  const endOfMessagesRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {", hooks + "\n  const endOfMessagesRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {");

// 4. Update handleSendMessage and models
const oldSend = `  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMsg = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI tutor. You can get a free key from console.groq.com.",
          },
        ]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt =
        "You are an expert SQL database tutor for students. Help them learn SQL. Keep explanations concise. If they ask you to write code, you MUST provide it inside \`\`\`sql ... \`\`\` blocks so the app can extract and inject it into the editor.";

      const models = [
        "llama-3.1-8b-instant",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
      ];
      let data: any = null;
      let lastError = null;

      for (const model of models) {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: \`Bearer \${apiKey}\`,
              },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: "system", content: systemPrompt },
                  ...messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                  })),
                  newMsg,
                ],
                temperature: 0.7,
                max_tokens: 1024,
              }),
            },
          );

          data = await response.json();
          if (!data.error) {
            break; // Success!
          } else {
            lastError = new Error(data.error.message || "API Error");
          }
        } catch (e: any) {
          lastError = e;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error("All models failed to respond.");
      }

      let aiText = data.choices[0].message.content || "";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: \`Error: \${e.message}\` },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };`;

const newSend = `  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() && !attachedImage) return;

    let userContent: any = chatInput;
    if (attachedImage) {
      userContent = [];
      if (chatInput.trim()) {
        userContent.push({ type: "text", text: chatInput });
      }
      userContent.push({
        type: "image_url",
        image_url: { url: attachedImage },
      });
    }

    const newMsg = { role: "user", content: userContent };
    
    // Convert previous messages array of objects to format safely.
    // If we have any images in history or currently, use vision models.
    const hasAnyImages = messages.some((m: any) => Array.isArray(m.content)) || !!attachedImage;
    
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setAttachedImage(null);
    setIsAiLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [...prev, {
            role: "assistant",
            content: "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI tutor. You can get a free key from console.groq.com."
        }]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt = "You are an expert SQL database tutor for students. Help them learn SQL. Keep explanations concise. If they ask you to write code, you MUST provide it inside \`\`\`sql ... \`\`\` blocks so the app can extract and inject it into the editor.";

      const modelsToTry = hasAnyImages 
           ? ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"] 
           : ["llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"];
           
      let data: any = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: \`Bearer \${apiKey}\` },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: "system", content: systemPrompt },
                  ...messages.map((m) => ({ role: m.role, content: m.content })),
                  newMsg,
                ],
                temperature: 0.7,
                max_tokens: 1024,
              }),
            }
          );

          data = await response.json();
          if (!data.error) break; // Success!
          else lastError = new Error(data.error.message || "API Error");
        } catch (e: any) {
          lastError = e;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error(data.error?.message || "All models failed to respond.");
      }

      let aiText = data.choices[0].message.content || "";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
      
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: \`Error: \${e.message}\` }]);
    } finally {
      setIsAiLoading(false);
    }
  };`;

content = content.replace(oldSend, newSend);

// 5. Replace chat UI block: Replace from `<div className="flex flex-col h-full absolute inset-0">` until the end of the ui.
const chatUiRegex = /(<div className="flex flex-col h-full absolute inset-0">)[\s\S]*?(<\/div>\n\s*\)\n\s*<\/div>\n\s*<\/div>)/m;

const newChatUiInner = \`
                <div className="flex flex-col h-full absolute inset-0 bg-[#07070b]">
                  <style>{customInputStyles}</style>
                  
                  {/* Background grid */}
                  <div className="grid-bg-ai"></div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10">
                     {messages.map((m, i) => (
                       <div key={i} className={\`flex flex-col \${m.role === "user" ? "items-end" : "items-start"}\`}>
                         
                         {/* Avatar for AI */}
                         {m.role === 'assistant' && (
                           <div className="flex items-end gap-2 mb-2 ml-1">
                             <div className="w-9 h-9 rounded-full bg-[#1c191c] border border-purple-500/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                               <Bot className="w-5 h-5 text-purple-400" />
                             </div>
                           </div>
                         )}

                         <div className={\`max-w-[90%] rounded-2xl p-4 text-sm shadow-md \${m.role === "user" ? "bg-indigo-600/90 text-white rounded-br-none" : "bg-[#18112e]/90 border border-purple-900/50 text-gray-200 rounded-bl-none overflow-x-auto"}\`}>
                           {m.role === "user" ? (
                             <>
                               {typeof m.content === 'string' ? (
                                   <p className="whitespace-pre-wrap">{m.content}</p>
                               ) : (
                                   <div className="flex flex-col gap-2">
                                     {m.content.map((item: any, idx: number) => {
                                        if (item.type === 'text') return <p key={idx} className="whitespace-pre-wrap">{item.text}</p>;
                                        if (item.type === 'image_url') return <img key={idx} src={item.image_url.url} alt="Uploaded" className="rounded-lg max-w-full h-auto max-h-48 object-contain border border-white/20 bg-black/20" />;
                                        return null;
                                     })}
                                   </div>
                               )}
                             </>
                           ) : (
                             <div className="markdown-body text-sm text-gray-200">
                               <ReactMarkdown
                                 components={{
                                   code(props) {
                                     const { children, className, node, ...rest } = props as any;
                                     const match = /language-(\\w+)/.exec(className || "");
                                     const codeString = String(children).replace(/\\n$/, "");
                                     
                                     if (match && match[1] === 'sql') {
                                       return (
                                         <div className="border border-indigo-500/30 rounded-lg overflow-hidden my-3 shadow-md bg-[#1e1e1e]">
                                            <div className="flex justify-between items-center bg-[#2d2d2d] px-3 py-2 border-b border-indigo-500/30">
                                              <span className="text-xs font-semibold text-indigo-400">SQL Code</span>
                                              <button 
                                                onClick={() => handleSnippetClick(codeString)}
                                                className="flex flex-row items-center gap-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors"
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
                                               style={vscDarkPlus}
                                            />
                                         </div>
                                       );
                                     }

                                     return match ? (
                                       <SyntaxHighlighter
                                          {...rest}
                                          PreTag="div"
                                          className="rounded-md !my-2 text-xs"
                                          children={codeString}
                                          language={match[1]}
                                          style={vscDarkPlus}
                                       />
                                     ) : (
                                       <code {...rest} className={className + " bg-black/30 rounded px-1 text-[#dfa2da]"}>
                                         {children}
                                       </code>
                                     );
                                   },
                                 }}
                               >
                                 {m.content}
                               </ReactMarkdown>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                     
                     {isAiLoading && (
                       <div className="flex flex-col items-start mb-2">
                           <div className="flex items-end gap-2 mb-1 ml-1">
                             <div className="w-9 h-9 rounded-full bg-[#1c191c] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_purple] animate-pulse">
                               <Bot className="w-5 h-5 text-purple-400" />
                             </div>
                           </div>
                         <div className="max-w-[85%] rounded-2xl p-4 text-sm flex gap-1 items-center bg-[#18112e]/90 border border-purple-900/40 rounded-bl-none text-gray-200">
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                         </div>
                       </div>
                     )}
                     <div ref={endOfMessagesRef} />
                  </div>
                  
                  <div className="p-4 z-10 flex flex-col gap-2 relative">
                    
                    {attachedImage && (
                        <div className="relative inline-block self-start mb-2 ml-4">
                            <img src={attachedImage} alt="Attachment" className="h-16 rounded-md border border-white/20 object-cover" />
                            <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                        </div>
                    )}
                    
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    
                    <div id="poda">
                      <div className="ai-g"></div>
                      <div className="ai-db"></div>
                      <div className="ai-db"></div>
                      <div className="ai-db"></div>
                      <div className="ai-w"></div>
                      <div className="ai-b"></div>

                      <div id="main">
                        <input 
                           placeholder="Ask AI or say 'Write code for...'" 
                           type="text" 
                           name="text" 
                           className="ai-input" 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => { if(e.key === 'Enter') handleSendMessage(e) }}
                           onPaste={handlePaste}
                        />
                        <div id="input-mask"></div>
                        <div id="pink-mask"></div>
                        <div className="filterBorder"></div>
                        <div id="filter-icon" onClick={() => fileInputRef.current?.click()}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d6d6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                          </svg>
                        </div>
                        <div id="search-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="24" fill="none">
                            <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                            <line stroke="url(#searchl)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
                            <defs>
                              <linearGradient gradientTransform="rotate(50)" id="search">
                                <stop stopColor="#f8e7f8" offset="0%"></stop>
                                <stop stopColor="#b6a9b7" offset="50%"></stop>
                              </linearGradient>
                              <linearGradient id="searchl">
                                <stop stopColor="#b6a9b7" offset="0%"></stop>
                                <stop stopColor="#837484" offset="50%"></stop>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>\`;

content = content.replace(chatUiRegex, (match, p1, p2) => {
   return newChatUiInner + "\n" + p2;
});

// Write it back
fs.writeFileSync('src/features/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx', content);
