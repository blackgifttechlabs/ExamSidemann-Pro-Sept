import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Bot, Loader2, MessageSquare, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadUserChatSessions } from '../../services/adminChatTracker';
import type { AiChatSession, StoredChatMessage } from '../../services/aiChatHistory';

type Props = {
  userId: string;
  userName: string;
  userEmail: string;
  onBack: () => void;
};

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Africa/Harare',
});

const asDate = (value: unknown): Date | null => {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (value && typeof value === 'object' && 'seconds' in value && typeof (value as { seconds: number }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
};

const ChatMessageBubble: React.FC<{ message: StoredChatMessage; index: number }> = ({ message, index }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${isUser ? 'flex-row-reverse text-slate-400' : 'text-violet-500'}`}>
        {isUser ? <User size={12} /> : <Bot size={12} />}
        {isUser ? 'User' : 'Sidemann AI'}
      </div>
      {isUser ? (
        <div className="max-w-[90%] rounded-[12px] bg-slate-100 px-4 py-3.5 text-sm leading-relaxed text-slate-900 shadow-sm dark:bg-[#1c202a] dark:text-white sm:max-w-[85%]">
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      ) : (
        <div className="w-full pt-1 text-slate-900 dark:text-gray-100">
          <div className="prose prose-sm dark:prose-invert max-w-none text-[14.5px] leading-7 font-normal">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-800 dark:text-slate-200" {...props} />,
                ul: ({ ...props }) => <ul className="my-2.5 list-outside list-disc space-y-1 pl-5 text-slate-800 dark:text-slate-200" {...props} />,
                ol: ({ ...props }) => <ol className="my-2.5 list-outside list-decimal space-y-1 pl-5 text-slate-800 dark:text-slate-200" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-slate-900 dark:text-white" {...props} />,
                a: ({ ...props }) => (
                  <a className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400" target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminUserChatView: React.FC<Props> = ({ userId, userName, userEmail, onBack }) => {
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadUserChatSessions(userId)
      .then((loaded) => {
        if (cancelled) return;
        setSessions(loaded);
        setSelectedSessionId(loaded[0]?.id ?? null);
      })
      .catch((loadError) => {
        console.error('Could not load user chat sessions', loadError);
        if (!cancelled) {
          setError('Could not load chat history. Confirm this account has the Firebase admin claim and try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [selectedSessionId, sessions],
  );

  const messages = selectedSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSessionId, messages.length]);

  return (
    <section className="space-y-4 text-left">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black text-gray-500 transition hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-300"
      >
        <ArrowLeft size={16} /> Back to AI chats
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:px-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">User chat history</p>
          <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">{userName}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{userEmail || 'No email on profile'}</p>
        </div>

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center py-16">
            <Loader2 className="animate-spin text-violet-500" size={28} />
          </div>
        ) : error ? (
          <div className="px-5 py-16 text-center text-sm font-semibold text-red-500">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <MessageSquare className="mx-auto text-slate-300" size={30} />
            <p className="mt-3 text-sm font-bold text-slate-500">This user has no saved AI chats yet.</p>
          </div>
        ) : (
          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.02] lg:border-b-0 lg:border-r">
              <div className="border-b border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:border-white/10">
                {sessions.length} chat{sessions.length === 1 ? '' : 's'}
              </div>
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar lg:max-h-[560px]">
                {sessions.map((session) => {
                  const updatedAt = asDate(session.updatedAt) ?? asDate(session.createdAt);
                  const isActive = session.id === selectedSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition dark:border-white/5 ${
                        isActive
                          ? 'bg-violet-50 dark:bg-violet-500/10'
                          : 'hover:bg-white dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <strong className="block truncate text-sm text-slate-900 dark:text-white">{session.title || 'Untitled chat'}</strong>
                      <span className="mt-1 block text-[11px] text-slate-400">
                        {updatedAt ? dateTime.format(updatedAt) : 'Unknown time'}
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {(session.messages?.length ?? 0).toLocaleString()} message{(session.messages?.length ?? 0) === 1 ? '' : 's'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="flex min-h-[420px] flex-col bg-[#fcfcfd] dark:bg-[#0d0f14]">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10 sm:px-5">
                <h3 className="truncate text-sm font-black text-slate-900 dark:text-white">
                  {selectedSession?.title || 'Select a chat'}
                </h3>
                {selectedSession && (
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Read-only view of messages sent and received
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 custom-scrollbar">
                <div className="mx-auto max-w-2xl space-y-6">
                  {messages.map((message, index) => (
                    <ChatMessageBubble
                      key={message.id || `${selectedSessionId}-${index}`}
                      message={message}
                      index={index}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
