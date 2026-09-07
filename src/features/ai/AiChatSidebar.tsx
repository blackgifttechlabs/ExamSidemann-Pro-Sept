/**
 * AiChatSidebar.tsx
 * Desktop sidebar for the AI chat interface.
 * Displays clean text menu actions (no icons) and chat history (no icons).
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BrainCircuit,
  Activity,
  FileDown,
  Trash2,
  Search,
  History,
  Loader2,
  Compass,
  Library,
  Bot,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToChatSessions,
  AiChatSession,
} from '../../services/aiChatHistory';
import { formatDistanceToNow } from '../../utils/dateFormat';

interface AiChatSidebarProps {
  /** The currently active chat session id */
  activeChatId: string | null;
  /** Daily tokens used so far */
  tokensUsed: number;
  /** Called when the user clicks a past session */
  onSelectSession: (session: AiChatSession) => void;
  /** Called when the user starts a new chat */
  onNewChat: () => void;
  /** 3-dots actions now in menu */
  onExamPredictor?: () => void;
  onPdfExport?: () => void;
  onDiagramHelper?: () => void;
  onClearConversation?: () => void;
}

export const AiChatSidebar: React.FC<AiChatSidebarProps> = ({
  activeChatId,
  tokensUsed,
  onSelectSession,
  onNewChat,
  onExamPredictor,
  onPdfExport,
  onDiagramHelper,
  onClearConversation,
}) => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToChatSessions(user.uid, (data) => {
      setSessions(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const filtered = searchQuery.trim()
    ? sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sessions;

  const photoURL = userProfile?.photoURL || user?.photoURL;
  const initials = userProfile
    ? `${userProfile.firstName?.[0] ?? ''}${userProfile.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : user?.email?.[0]?.toUpperCase() ?? '?';
  const navItemClass =
    'w-full flex items-center gap-4 rounded-[8px] px-3 py-2 text-left text-[13px] font-medium leading-5 text-black transition-colors hover:bg-[#e9e9e9] dark:text-slate-100 dark:hover:bg-white/10';
  const activeNavItemClass =
    'bg-[#e9e9e9] text-black dark:bg-white/[0.12] dark:text-white';
  const iconClass = 'shrink-0 text-black dark:text-slate-100';
  const collapsedItemClass =
    'flex h-9 w-9 items-center justify-center rounded-[8px] text-black transition-colors hover:bg-[#e9e9e9] dark:text-slate-100 dark:hover:bg-white/10';

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 212 : 56 }}
      transition={{ type: 'spring', damping: 30, stiffness: 260 }}
      className="hidden md:flex flex-col h-screen shrink-0 bg-white dark:bg-[#0d0f14] border-r border-slate-200/80 dark:border-white/[0.06] overflow-hidden z-20 select-none"
      aria-label="AI Chat sidebar"
    >
      {/* ── Top Header / Logo + Toggle ───────────────────────────── */}
      <div className="flex flex-col items-start pt-3.5 pb-2 px-3 gap-1 shrink-0 border-b border-slate-200/60 dark:border-white/[0.04]">
        <div className="flex items-center justify-between w-full h-9 mb-1">
          {expanded ? (
            <div className="flex items-center">
              <img
                src="https://i.ibb.co/HDtTcsP1/LOGObg.png"
                alt="Exam Sidemann"
                className="h-6 w-auto max-w-[180px] object-contain block dark:hidden cursor-pointer"
                onClick={() => navigate('/dashboard')}
              />
              <img
                src="https://i.ibb.co/SwGTG6Wt/Gemini-Generated-Image-o9ijg1o9ijg1o9ij-removebg-preview.png"
                alt="Exam Sidemann"
                className="h-5 w-auto max-w-[180px] object-contain hidden dark:block cursor-pointer"
                onClick={() => navigate('/dashboard')}
              />
            </div>
          ) : (
            <div
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg overflow-hidden shadow-sm cursor-pointer mx-auto"
              onClick={() => setExpanded(true)}
            >
              <img
                src="/app-icon-192.png"
                alt="Exam Sidemann"
                className="h-7 w-7 object-contain rounded-md"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/favicon-48.png';
                }}
              />
            </div>
          )}

          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-white/5 transition-colors"
              title="Collapse sidebar"
            >
              «
            </button>
          )}
        </div>

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-center py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Expand sidebar"
          >
            »
          </button>
        )}
      </div>

      {/* ── Menu Action List ──────────────────────────────────────── */}
      {expanded && (
        <div className="flex flex-col gap-1 px-3 pt-2 pb-3 shrink-0 border-b border-slate-200/60 dark:border-white/[0.04]">
          <button
            onClick={() => navigate('/dashboard')}
            className={navItemClass}
          >
            <Home size={16} strokeWidth={1.8} className={iconClass} />
            <span>Home</span>
          </button>

          <button
            onClick={onNewChat}
            className={navItemClass}
          >
            <Compass size={16} strokeWidth={1.8} className={iconClass} />
            <span>New Chat</span>
          </button>

          <button
            onClick={() => setShowSearch((v) => !v)}
            className={`${navItemClass} ${showSearch ? activeNavItemClass : ''}`}
          >
            <Search size={16} strokeWidth={1.8} className={iconClass} />
            <span>Search</span>
          </button>

          <button
            onClick={() => navigate('/chat/history')}
            className={navItemClass}
          >
            <History size={16} strokeWidth={1.8} className={iconClass} />
            <span>History</span>
          </button>

          {onExamPredictor && (
            <button
              onClick={onExamPredictor}
              className={navItemClass}
            >
              <BrainCircuit size={16} strokeWidth={1.8} className={iconClass} />
              <span>Exam Predictor</span>
            </button>
          )}

          {onDiagramHelper && (
            <button
              onClick={onDiagramHelper}
              className={navItemClass}
            >
              <Activity size={16} strokeWidth={1.8} className={iconClass} />
              <span>Diagram Helper</span>
            </button>
          )}

          {onPdfExport && (
            <button
              onClick={onPdfExport}
              className={navItemClass}
            >
              <FileDown size={16} strokeWidth={1.8} className={iconClass} />
              <span>Export PDF</span>
            </button>
          )}

          {onClearConversation && (
            <button
              onClick={onClearConversation}
              className={navItemClass}
            >
              <Trash2 size={16} strokeWidth={1.8} className={iconClass} />
              <span>Clear Conversation</span>
            </button>
          )}

          <button
            onClick={() => navigate('/library')}
            className={navItemClass}
          >
            <Library size={16} strokeWidth={1.8} className={iconClass} />
            <span>Library</span>
          </button>

          <button
            onClick={() => navigate('/code-agent')}
            className={`${navItemClass} relative overflow-hidden`}
          >
            <span className="absolute inset-0 rounded-[8px] bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={16} strokeWidth={1.8} className="shrink-0 text-violet-500 dark:text-violet-400" />
            <span className="font-semibold text-violet-700 dark:text-violet-300">Black-Tonet</span>
            <span className="ml-auto flex items-center gap-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300 leading-none">
              AI
            </span>
          </button>

          <AnimatePresence>
            {showSearch && (
              <motion.input
                key="search-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 30 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full mt-1 rounded-[8px] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-400 dark:focus:border-white/30"
                autoFocus
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {!expanded && (
        <div className="flex flex-col items-center gap-1 px-2 pt-2 pb-3 shrink-0 border-b border-slate-200/60 dark:border-white/[0.04]">
          <button
            onClick={() => navigate('/dashboard')}
            className={collapsedItemClass}
            title="Home"
            aria-label="Home"
          >
            <Home size={17} strokeWidth={1.8} />
          </button>
          <button
            onClick={onNewChat}
            className={collapsedItemClass}
            title="New Chat"
            aria-label="New Chat"
          >
            <Compass size={17} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => {
              setExpanded(true);
              setShowSearch(true);
            }}
            className={`${collapsedItemClass} ${showSearch ? activeNavItemClass : ''}`}
            title="Search"
            aria-label="Search"
          >
            <Search size={17} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => navigate('/chat/history')}
            className={collapsedItemClass}
            title="History"
            aria-label="History"
          >
            <History size={17} strokeWidth={1.8} />
          </button>
          {onExamPredictor && (
            <button
              onClick={onExamPredictor}
              className={collapsedItemClass}
              title="Exam Predictor"
              aria-label="Exam Predictor"
            >
              <BrainCircuit size={17} strokeWidth={1.8} />
            </button>
          )}
          {onDiagramHelper && (
            <button
              onClick={onDiagramHelper}
              className={collapsedItemClass}
              title="Diagram Helper"
              aria-label="Diagram Helper"
            >
              <Activity size={17} strokeWidth={1.8} />
            </button>
          )}
          {onPdfExport && (
            <button
              onClick={onPdfExport}
              className={collapsedItemClass}
              title="Export PDF"
              aria-label="Export PDF"
            >
              <FileDown size={17} strokeWidth={1.8} />
            </button>
          )}
          {onClearConversation && (
            <button
              onClick={onClearConversation}
              className={collapsedItemClass}
              title="Clear Conversation"
              aria-label="Clear Conversation"
            >
              <Trash2 size={17} strokeWidth={1.8} />
            </button>
          )}
          <button
            onClick={() => navigate('/library')}
            className={collapsedItemClass}
            title="Library"
            aria-label="Library"
          >
            <Library size={17} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => navigate('/code-agent')}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-violet-500 dark:text-violet-400 transition-colors hover:bg-violet-100/60 dark:hover:bg-violet-500/15"
            title="Black-Tonet Agent"
            aria-label="Black-Tonet Agent"
          >
            <Bot size={17} strokeWidth={1.8} />
          </button>
        </div>
      )}

      {/* ── Chat History list (NO icons for titles) ────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-2">
        {expanded && (
          <>
            <div className="px-1 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
              Chats
            </div>

            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={16} className="animate-spin text-slate-400" />
              </div>
            )}

            {!loading && user && filtered.length === 0 && (
              <p className="text-[11px] text-slate-400 dark:text-gray-600 px-2 py-3 text-center">
                {searchQuery ? 'No matching chats' : 'No past chats yet'}
              </p>
            )}

            {!loading && !user && (
              <p className="text-[11px] text-slate-400 dark:text-gray-600 px-2 py-3 text-center leading-5">
                Sign in to save & see history
              </p>
            )}

            {filtered.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`w-full flex flex-col text-left rounded-[7px] px-2.5 py-1.5 mb-0.5 transition-colors group ${
                  session.id === activeChatId
                    ? 'bg-slate-200/80 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                <span className="truncate text-[12px] leading-snug">
                  {session.title}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">
                  {session.updatedAt?.toDate
                    ? formatDistanceToNow(session.updatedAt.toDate())
                    : 'Recently'}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* ── Bottom: User info ────────────────────────────────────────── */}
      <div className="shrink-0 pb-3 pt-2 px-3 border-t border-slate-200/60 dark:border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 shrink-0 relative flex items-center justify-center rounded-full overflow-hidden bg-slate-200 dark:bg-white/10 ring-1 ring-slate-300/60 dark:ring-white/10 shadow-sm">
            {photoURL && !imageError ? (
              <img
                src={photoURL}
                alt="User Profile"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">
                {initials}
              </span>
            )}
          </div>

          {expanded && (
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                {userProfile
                  ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || user?.displayName || 'Student'
                  : user?.displayName || user?.email?.split('@')[0] || 'Guest'}
              </p>
              <p className="text-[9px] text-slate-400 dark:text-gray-500">
                {user ? 'Signed in' : 'Guest'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
