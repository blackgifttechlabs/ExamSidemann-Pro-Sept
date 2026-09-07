/**
 * AiChatHistoryPage.tsx
 * Full-page view of all saved AI chat sessions.
 * Navigates to /chat?session={id} to resume a conversation.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Loader2,
  Bot,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { loadChatSessions, AiChatSession, DAILY_TOKEN_LIMIT, subscribeToTokens } from '../../services/aiChatHistory';
import { formatDistanceToNow } from '../../utils/dateFormat';

export const AiChatHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load sessions
    loadChatSessions(user.uid)
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));

    // Subscribe to token usage
    const unsub = subscribeToTokens(user.uid, setTokensUsed);
    return () => unsub();
  }, [user]);

  const filtered = searchQuery.trim()
    ? sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sessions;

  const tokenPct = Math.min((tokensUsed / DAILY_TOKEN_LIMIT) * 100, 100);

  const handleSelect = (session: AiChatSession) => {
    navigate(`/chat?session=${session.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0d0f14] text-slate-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 border-b border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#0d0f14]/95 backdrop-blur-md">
        <button
          onClick={() => navigate('/chat')}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 transition-colors"
          aria-label="Back to chat"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/app-icon-192.png"
            alt="Exam Sidemann"
            className="h-6 w-6 object-contain rounded-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/favicon-48.png';
            }}
          />
          <h1 className="text-sm font-bold text-slate-900 dark:text-white">Chat History</h1>
        </div>

        {/* Token pill */}
        {user && (
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/10 rounded-full px-3 py-1">
              <Zap
                size={12}
                className={
                  tokenPct >= 90
                    ? 'text-red-500 fill-red-500'
                    : tokenPct >= 70
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-amber-500 fill-amber-500'
                }
              />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {(DAILY_TOKEN_LIMIT - tokensUsed).toLocaleString()}{' '}
                <span className="font-normal text-slate-400">/ {DAILY_TOKEN_LIMIT.toLocaleString()} tokens left</span>
              </span>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Not signed in */}
        {!user && (
          <div className="text-center py-20">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 dark:bg-white/5 grid place-items-center text-slate-400">
              <Bot size={30} />
            </div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Sign in to view history
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Your chat history is saved to your account when you&apos;re signed in.
            </p>
          </div>
        )}

        {/* Signed in */}
        {user && (
          <>
            {/* Token bar */}
            <div className="mb-6 p-4 rounded-[12px] bg-white dark:bg-[#151820] border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Daily Tokens
                  </span>
                </div>
                <span
                  className={`text-xs font-bold ${
                    tokenPct >= 90
                      ? 'text-red-500'
                      : tokenPct >= 70
                      ? 'text-amber-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {(DAILY_TOKEN_LIMIT - tokensUsed).toLocaleString()} / {DAILY_TOKEN_LIMIT.toLocaleString()} remaining
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    tokenPct >= 90
                      ? 'bg-red-500'
                      : tokenPct >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(100 - tokenPct, 0)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400 dark:text-gray-500">
                Tokens reset daily at midnight.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
              />
              <input
                type="text"
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151820] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-400 dark:focus:border-white/20 transition-colors"
              />
            </div>

            {/* Session list */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-slate-100 dark:bg-white/5 grid place-items-center">
                  <MessageSquare size={22} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                  {searchQuery ? 'No matching conversations' : 'No chat history yet'}
                </p>
                <p className="text-xs text-slate-400 dark:text-gray-600 mt-1">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Start a chat and it will appear here'}
                </p>
              </div>
            )}

            {!loading && (
              <div className="space-y-2">
                {filtered.map((session, index) => (
                  <motion.button
                    key={session.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.18 }}
                    onClick={() => handleSelect(session)}
                    className="w-full flex items-center justify-between p-4 rounded-[12px] bg-white dark:bg-[#151820] border border-slate-200 dark:border-white/[0.08] hover:border-slate-400 dark:hover:border-white/20 shadow-sm transition-all text-left group active:scale-[0.99]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 dark:text-gray-500">
                          {session.updatedAt?.toDate
                            ? formatDistanceToNow(session.updatedAt.toDate())
                            : 'Recently'}
                        </span>
                        {session.messages?.length > 0 && (
                          <>
                            <span className="text-slate-300 dark:text-gray-700">·</span>
                            <span className="text-[11px] text-slate-400 dark:text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
