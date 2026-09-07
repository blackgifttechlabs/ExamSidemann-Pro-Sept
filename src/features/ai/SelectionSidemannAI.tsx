import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Loader2, Plus, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { requestGroqCompletion, type GroqChatMessage } from '../../services/groq';
import { usePageScrollLock } from '../../components/ui/pageScrollLock';

type PanelMode = 'chip' | 'chat';

type AnchorPosition = {
  top: number;
  left: number;
};

type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isError?: boolean;
};

const MAX_SELECTED_TEXT_LENGTH = 4000;
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const starterPrompts = [
  'Explain this simply',
  'Turn this into study notes',
  'Quiz me on this',
];

const createWelcomeMessage = (): AiMessage => ({
  id: createId(),
  role: 'assistant',
  text: 'I have your highlighted text. What would you like me to help you understand?',
});

export const SelectionSidemannAI: React.FC = () => {
  const ignoreSelectionUntilRef = useRef(0);
  const modeRef = useRef<PanelMode>('chip');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<AnchorPosition | null>(null);
  const [mode, setMode] = useState<PanelMode>('chip');
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isChipVisible = Boolean(selectedText && position && mode === 'chip');
  const isChatOpen = Boolean(selectedText && mode === 'chat');
  usePageScrollLock(isChatOpen);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let selectionTimer: number | undefined;

    const handleSelection = () => {
      if (modeRef.current === 'chat' || Date.now() < ignoreSelectionUntilRef.current) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      const activeElement = document.activeElement;
      const isTypingTarget =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute('contenteditable') === 'true';

      if (!text || isTypingTarget) return;

      const widget = document.getElementById('selection-sidemann-ai-chip');
      if (widget && selection?.anchorNode && widget.contains(selection.anchorNode)) return;

      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const rect = range?.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return;

      const panelWidth = 220;
      const left = clamp(
        rect.left + rect.width / 2 - panelWidth / 2,
        12,
        window.innerWidth - panelWidth - 12,
      );
      const top = rect.top > 70 ? rect.top - 56 : rect.bottom + 12;

      setSelectedText(text.slice(0, MAX_SELECTED_TEXT_LENGTH));
      setPosition({ top: clamp(top, 12, window.innerHeight - 90), left });
      setMessages([]);
      setInput('');
      setMode('chip');
    };

    const queueSelectionCheck = () => {
      window.clearTimeout(selectionTimer);
      selectionTimer = window.setTimeout(handleSelection, 80);
    };

    document.addEventListener('selectionchange', queueSelectionCheck);
    document.addEventListener('mouseup', queueSelectionCheck);
    document.addEventListener('keyup', queueSelectionCheck);
    document.addEventListener('touchend', queueSelectionCheck);

    return () => {
      window.clearTimeout(selectionTimer);
      document.removeEventListener('selectionchange', queueSelectionCheck);
      document.removeEventListener('mouseup', queueSelectionCheck);
      document.removeEventListener('keyup', queueSelectionCheck);
      document.removeEventListener('touchend', queueSelectionCheck);
    };
  }, []);

  const close = () => {
    ignoreSelectionUntilRef.current = Date.now() + 700;
    modeRef.current = 'chip';
    window.getSelection()?.removeAllRanges();
    setMode('chip');
    setSelectedText('');
    setPosition(null);
    setMessages([]);
    setInput('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isChatOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const chipStyle = useMemo<React.CSSProperties>(() => {
    if (!position) return {};
    return {
      top: position.top,
      left: clamp(position.left, 12, window.innerWidth - 232),
      width: 220,
    };
  }, [position]);

  const openChat = () => {
    ignoreSelectionUntilRef.current = Date.now() + 700;
    modeRef.current = 'chat';
    window.getSelection()?.removeAllRanges();
    setMessages([createWelcomeMessage()]);
    setMode('chat');
  };

  const startNewChat = () => {
    setMessages([createWelcomeMessage()]);
    setInput('');
  };

  const sendMessage = async (prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text || !selectedText || isLoading) return;

    const userMessage: AiMessage = { id: createId(), role: 'user', text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    const groqMessages: GroqChatMessage[] = [
      {
        role: 'system',
        content: `You are Sidemann AI, a friendly study assistant for ExamSidemann students. Use the highlighted passage below as the main context. Explain clearly, use exam-ready structure, and guide the learner step by step. If a question goes beyond the passage, say so clearly.\n\nHighlighted passage:\n"""${selectedText}"""`,
      },
      ...nextMessages.slice(-10).map((message) => ({
        role: message.role,
        content: message.text,
      })),
    ];

    try {
      const reply = await requestGroqCompletion({
        messages: groqMessages,
        maxTokens: 900,
        temperature: 0.4,
      });
      setMessages((current) => [
        ...current,
        { id: createId(), role: 'assistant', text: reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: 'assistant',
          text: error instanceof Error ? error.message : 'I could not connect right now. Please try again.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const ignoreWidgetSelection = () => {
    ignoreSelectionUntilRef.current = Date.now() + 700;
  };

  return (
    <>
      {isChipVisible && (
        <div
          id="selection-sidemann-ai-chip"
          className="fixed z-[10001] text-left"
          style={chipStyle}
          onMouseDown={(event) => {
            ignoreWidgetSelection();
            event.stopPropagation();
          }}
          onTouchStart={(event) => {
            ignoreWidgetSelection();
            event.stopPropagation();
          }}
        >
          <div className="flex w-full items-center gap-1 rounded-full border border-violet-200 bg-white p-1.5 pl-2 shadow-2xl shadow-violet-900/20 dark:border-white/10 dark:bg-[#11101c]">
            <button
              type="button"
              onMouseDown={(event) => {
                ignoreWidgetSelection();
                event.preventDefault();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openChat();
              }}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 py-1 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 dark:text-white"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-white">
                <Sparkles size={15} />
              </span>
              <span className="truncate">Ask Sidemann AI</span>
            </button>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                close();
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close Sidemann AI"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[10000] bg-slate-950/45 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 310 }}
              className="fixed inset-x-0 bottom-0 z-[10001] flex h-[75dvh] flex-col overflow-hidden rounded-t-[28px] border border-white/20 bg-white shadow-2xl shadow-slate-950/30 dark:border-white/10 dark:bg-[#0b0f19] md:inset-y-0 md:left-auto md:right-0 md:h-screen md:w-[440px] md:rounded-none md:border-y-0 md:border-r-0"
              role="dialog"
              aria-modal="true"
              aria-label="Ask Sidemann AI about selected text"
              onMouseDown={ignoreWidgetSelection}
              onTouchStart={ignoreWidgetSelection}
            >
              <header className="shrink-0 border-b border-white/10 bg-gradient-to-br from-[#170b3b] via-violet-900 to-indigo-700 px-4 py-4 text-white">
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/35 md:hidden" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                      <Bot size={22} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-200">
                        Sidemann AI
                      </p>
                      <h2 className="truncate text-lg font-black">Ask about this text</h2>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                        Ready to help
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={startNewChat}
                      disabled={isLoading}
                      className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                      aria-label="Start a new chat"
                      title="New chat"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
                      aria-label="Close Ask Sidemann panel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 dark:bg-[#090d16]">
                <div className="mb-5 rounded-2xl border border-violet-100 bg-violet-50/80 p-3.5 dark:border-violet-400/15 dark:bg-violet-500/10">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                    Selected context
                  </p>
                  <p className="line-clamp-4 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    “{selectedText}”
                  </p>
                </div>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm">
                          <Sparkles size={15} />
                        </span>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          message.role === 'user'
                            ? 'rounded-br-md bg-slate-950 text-white dark:bg-violet-600'
                            : message.isError
                              ? 'rounded-bl-md border border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200'
                              : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {messages.length === 1 && !isLoading && (
                    <div className="grid gap-2 pl-11 pt-1">
                      {starterPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void sendMessage(prompt)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-bold text-slate-600 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                        <Sparkles size={15} />
                      </span>
                      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
                        <span className="mr-2 inline-flex gap-1 align-middle">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.2s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.1s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                        </span>
                        Thinking
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
                className="shrink-0 border-t border-slate-200 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 dark:border-white/10 dark:bg-[#0b0f19]"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-inner transition focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 dark:border-white/10 dark:bg-black/20 dark:focus-within:border-violet-500/50 dark:focus-within:ring-violet-500/10">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Ask about your highlighted text..."
                    rows={1}
                    autoFocus
                    disabled={isLoading}
                    className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] font-medium text-slate-400">
                  Sidemann AI can make mistakes. Check important answers.
                </p>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
