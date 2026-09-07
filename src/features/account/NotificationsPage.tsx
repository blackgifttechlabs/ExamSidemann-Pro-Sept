import React, { useState, useEffect } from 'react';
import {
  Bell,
  ArrowLeft,
  UserPlus,
  Check,
  X,
  Loader2,
  Sparkles,
  Users,
  CheckCircle2,
  Flame,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  type FriendRequestNotification,
} from '../../services/notifications';
import { LoginRequiredView } from '../auth/LoginRequiredView';

interface NotificationsPageProps {
  onBack?: () => void;
  onNavigate?: (page: string, params?: any) => void;
  onLoginRequest?: () => void;
}

type NotificationTab = 'requests' | 'general';

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onBack,
  onNavigate,
  onLoginRequest,
}) => {
  const { user, userProfile } = useAuth();
  const [requests, setRequests] = useState<FriendRequestNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationTab>('requests');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ id: string; message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToPendingFriendRequests(user.uid, ({ requests }) => {
      setRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (req: FriendRequestNotification) => {
    if (!user || processingId) return;
    setProcessingId(req.id);
    try {
      await acceptFriendRequest(user.uid, req.senderId);
      setStatusMessage({
        id: req.id,
        message: `You and ${req.senderName} are now friends!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (req: FriendRequestNotification) => {
    if (!user || processingId) return;
    setProcessingId(req.id);
    try {
      await declineFriendRequest(user.uid, req.senderId);
      setStatusMessage({
        id: req.id,
        message: `Declined request from ${req.senderName}`,
        type: 'info',
      });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Error declining friend request:', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (!user) {
    return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Notifications" />;
  }

  const streak = userProfile?.streak || 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#08090c] text-slate-900 dark:text-white pb-20">
      {/* Top sticky header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (onBack ? onBack() : onNavigate ? onNavigate('dashboard') : window.history.back())}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors"
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <Bell size={18} className="text-[#ef2b3f]" />
              Notifications
              {requests.length > 0 && (
                <span className="ml-1 rounded-full bg-[#ef2b3f] px-2 py-0.5 text-[10px] font-black text-white">
                  {requests.length}
                </span>
              )}
            </h1>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-[#ef2b3f] hover:underline"
          >
            Dashboard
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-[9px] bg-slate-200/60 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.04]">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[9px] text-xs font-black transition-all ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-[#1c1f26] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus size={15} className={activeTab === 'requests' ? 'text-violet-500' : ''} />
            <span>Friend Requests</span>
            {requests.length > 0 && (
              <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ef2b3f] px-1 text-[9px] font-black text-white shadow-sm">
                {requests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[9px] text-xs font-black transition-all ${
              activeTab === 'general'
                ? 'bg-white dark:bg-[#1c1f26] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={15} className={activeTab === 'general' ? 'text-amber-500' : ''} />
            <span>General Updates</span>
          </button>
        </div>

        {statusMessage && (
          <div
            className={`flex items-center gap-2.5 rounded-[9px] p-3.5 text-xs font-bold transition-all shadow-sm ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300'
            }`}
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{statusMessage.message}</span>
          </div>
        )}

        {/* Tab 1: Friend Requests */}
        {activeTab === 'requests' && (
          <section className="space-y-3 animate-dropdown-reveal">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 flex items-center gap-2">
                <UserPlus size={14} className="text-violet-500" />
                Pending Connections
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                {requests.length} waiting
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 size={24} className="animate-spin text-[#ef2b3f]" />
                <p className="text-xs font-semibold text-slate-400">Loading friend requests...</p>
              </div>
            ) : requests.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05] rounded-[9px] border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#12141c] overflow-hidden shadow-sm">
                {requests.map((req) => {
                  const isProcessing = processingId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className="flex items-center gap-3.5 min-w-0 cursor-pointer"
                        onClick={() => onNavigate?.('public-profile', { id: req.senderId })}
                      >
                        <div className="relative h-11 w-11 shrink-0 rounded-full border-2 border-violet-500/20 dark:border-violet-400/20 overflow-hidden bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-sm font-black text-violet-600 dark:text-violet-300">
                          {req.senderPhoto ? (
                            <img src={req.senderPhoto} alt={req.senderName} className="h-full w-full object-cover rounded-full" />
                          ) : (
                            req.senderName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate hover:text-[#ef2b3f] transition-colors">
                            {req.senderName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                            {req.senderSchool || req.senderGrade || 'Exam Sidemann Student'}
                          </p>
                          <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 mt-0.5">
                            Sent you a friend request
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleAccept(req)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 rounded-[9px] bg-[#ef2b3f] hover:bg-[#d62033] text-white px-3.5 py-2 text-xs font-black shadow-sm active:scale-95 transition-all disabled:opacity-60"
                        >
                          {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
                          Accept
                        </button>

                        <button
                          onClick={() => handleDecline(req)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 rounded-[9px] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 px-3 py-2 text-xs font-bold active:scale-95 transition-all disabled:opacity-60"
                        >
                          <X size={14} />
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[9px] border border-dashed border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#12141c] p-8 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-2.5">
                  <UserPlus size={22} />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  No friend requests
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-gray-400 max-w-sm">
                  When classmates visit your profile and send a friend request, they will appear here.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: General Notifications & Activity */}
        {activeTab === 'general' && (
          <section className="space-y-3 animate-dropdown-reveal">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 flex items-center gap-2 px-1">
              <Sparkles size={14} className="text-amber-500" />
              Learning Activity & Updates
            </h2>

            {/* Streak Card */}
            <div className="rounded-[9px] border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#12141c] p-4 sm:p-4.5 flex items-start gap-3.5 shadow-sm">
              <div className="h-9 w-9 shrink-0 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Flame size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    {streak > 0 ? `${streak}-Day Study Streak Active` : 'Start Your Study Streak'}
                  </p>
                  <span className="text-[10px] font-bold text-orange-500">{streak} days</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  Log in and complete lessons daily to maintain your streak and earn star rewards on the global leaderboard.
                </p>
              </div>
            </div>

            {/* Dedicated Learners Tip */}
            <div className="rounded-[9px] border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#12141c] p-4 sm:p-4.5 flex items-start gap-3.5 shadow-sm">
              <div className="h-9 w-9 shrink-0 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  Check your Dedicated Learners Standing
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  See where you rank among top students nationwide and celebrate your achievements on the Dedicated Learners tab on your dashboard.
                </p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    View Dedicated Learners →
                  </button>
                )}
              </div>
            </div>

            {/* Study Buddies Tip */}
            <div className="rounded-[9px] border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#12141c] p-4 sm:p-4.5 flex items-start gap-3.5 shadow-sm">
              <div className="h-9 w-9 shrink-0 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  Connect with classmates
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  Join subject groups and find friends studying the same syllabus to share revision notes and discuss past exam questions.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
