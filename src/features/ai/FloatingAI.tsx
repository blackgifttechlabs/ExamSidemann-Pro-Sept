import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, MessageCircle, Mic, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { requestGroqCompletion, type GroqChatMessage } from '../../services/groq';

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
  },
};

const formatAiText = (raw: string): string => {
  if (!raw) return '';
  let text = raw.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/gi, ' ');
  text = text.replace(/(?:^|\n|\s)\[\s*(\\text|\\ce|\\frac|\\sqrt|\\xrightarrow|\\sum|\\int|\\begin|[0-9A-Za-z]+_|[0-9A-Za-z]+(?:\^[0-9]+|_\{?[0-9a-zA-Z]+\}?)|[\\{])([\s\S]*?)\](?:\n|\s|$)/g, (match, p1, p2) => {
    return `\n\n$$\n${p1}${p2}\n$$\n\n`;
  });
  return text;
};

type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const initialMessages: AiMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hi, I am Sidemann AI. Ask me to explain a topic, quiz you, summarize notes, or help you prepare for an exam.',
  },
];

export const FloatingAI: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem('ai_dismissed');
    if (dismissed === 'true') setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isPanelOpen]);

  const closePermanently = () => {
    setIsVisible(false);
    localStorage.setItem('ai_dismissed', 'true');
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: AiMessage = { id: createId(), role: 'user', text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    const groqMessages: GroqChatMessage[] = [
      {
        role: 'system',
        content:
          'You are Sidemann AI, a clear and friendly study assistant for ExamSidemann students. Explain concepts simply, use exam-ready structure, and keep answers practical. When writing math or chemical formulas and equations, format them using standard LaTeX enclosed in $$ equation $$ for block display or $ equation $ for inline (e.g. $$ 6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 $$). Never output raw unrendered bracketed expressions like [\\text{...}].',
      },
      ...nextMessages.slice(-8).map((message) => ({
        role: message.role,
        content: message.text,
      })),
    ];

    try {
      const reply = await requestGroqCompletion({
        messages: groqMessages,
        maxTokens: 900,
        temperature: 0.45,
      });
      setMessages((current) => [...current, { id: createId(), role: 'assistant', text: reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'assistant',
          text:
            error instanceof Error
              ? error.message
              : 'I could not connect right now. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 z-[9998] bg-slate-950/45 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 310 }}
              className="fixed inset-x-0 bottom-0 z-[9999] flex h-[75vh] flex-col overflow-hidden rounded-t-[28px] border border-white/20 bg-white shadow-2xl shadow-slate-950/30 dark:border-white/10 dark:bg-[#0b0f19] md:inset-y-0 md:left-auto md:right-0 md:h-screen md:w-[430px] md:rounded-none md:border-y-0 md:border-r-0"
              role="dialog"
              aria-label="Ask Sidemann AI"
            >
              <div className="shrink-0 border-b border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 px-4 py-4 text-white dark:border-white/10">
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/35 md:hidden" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                      <Bot size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">
                        Sidemann AI
                      </p>
                      <h2 className="truncate text-lg font-black">Ask Sidemann</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsPanelOpen(false)}
                      className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
                      aria-label="Close Ask Sidemann panel"
                    >
                      <X size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={closePermanently}
                      className="hidden h-9 rounded-full px-3 text-[10px] font-black uppercase tracking-widest text-white/55 transition hover:bg-white/10 hover:text-white md:block"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 dark:bg-[#090d16]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-sm">
                          <Sparkles size={15} />
                        </div>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          message.role === 'user'
                            ? 'rounded-br-md bg-slate-950 text-white dark:bg-cyan-600'
                            : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                            <MathJaxContext config={mathJaxConfig}>
                              <MathJax dynamic>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{formatAiText(message.text)}</ReactMarkdown>
                              </MathJax>
                            </MathJaxContext>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 text-white">
                        <Sparkles size={15} />
                      </div>
                      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
                        <span className="mr-2 inline-flex gap-1 align-middle">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.2s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.1s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" />
                        </span>
                        Thinking
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={sendMessage} className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#0b0f19]">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-inner dark:border-white/10 dark:bg-black/20">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about any topic..."
                    rows={1}
                    disabled={isLoading}
                    className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={isLoading}
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-slate-500 hover:text-slate-900 dark:bg-white/10 dark:text-slate-300 dark:hover:text-white'
                    }`}
                    aria-label="Use voice input"
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-7 right-7 z-[9997]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-white shadow-2xl shadow-slate-950/25 ring-1 ring-white/15 transition hover:bg-slate-900 dark:bg-white dark:text-slate-950"
          aria-label="Ask Sidemann AI"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 text-white">
            <MessageCircle size={20} />
          </span>
          <span className="hidden pr-1 text-sm font-black sm:block">Ask Sidemann</span>
        </button>
      </motion.div>
    </>
  );
};
