import React, { useEffect, useMemo, useState } from 'react';
import { Bot, ExternalLink, Loader2, MessageSquare, Search, Users } from 'lucide-react';
import { subscribeToUserChatProfiles, type UserChatProfile } from '../../services/adminChatTracker';

type Props = {
  onOpenUser: (profile: UserChatProfile) => void;
};

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Africa/Harare',
});

const exactTime = (value: Date | null) => (value ? dateTime.format(value) : '—');

export const ChatTrackerManager: React.FC<Props> = ({ onOpenUser }) => {
  const [profiles, setProfiles] = useState<UserChatProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stop = subscribeToUserChatProfiles(
      (nextProfiles) => {
        setProfiles(nextProfiles);
        setLoading(false);
        setError(null);
      },
      (loadError) => {
        console.error('Could not load AI chat tracker', loadError);
        setLoading(false);
        setProfiles((current) => {
          if (current.length === 0) {
            setError('Could not load AI chat activity. Confirm this account has the Firebase admin claim and try again.');
          }
          return current;
        });
      },
    );

    return () => stop();
  }, []);

  const stats = useMemo(() => ({
    users: profiles.length,
    chats: profiles.reduce((total, profile) => total + profile.chatCount, 0),
    activeToday: profiles.filter((profile) => {
      if (!profile.lastChatAt) return false;
      const today = new Date();
      return profile.lastChatAt.toDateString() === today.toDateString();
    }).length,
  }), [profiles]);

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return profiles;
    return profiles.filter((profile) =>
      `${profile.name} ${profile.email} ${profile.userId}`.toLocaleLowerCase().includes(term),
    );
  }, [profiles, search]);

  const cards = [
    { label: 'Users with chats', value: stats.users, icon: Users, color: 'bg-violet-500' },
    { label: 'Total chat sessions', value: stats.chats, icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'Active today', value: stats.activeToday, icon: Bot, color: 'bg-emerald-500' },
  ];

  return (
    <section className="space-y-6 text-left">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">AI chat administration</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">User AI chats</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track Sidemann AI conversations by user, then open a read-only chat view to review messages sent and received.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616] sm:p-5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${card.color}`}>
              <card.icon size={18} />
            </span>
            <strong className="mt-4 block text-3xl font-black tabular-nums text-slate-900 dark:text-white">
              {loading ? '—' : card.value.toLocaleString()}
            </strong>
            <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{card.label}</span>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <div className="border-b border-slate-200 p-4 dark:border-white/10">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search user name, email or UID"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:bg-white/[0.025]">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Chats</th>
                <th className="px-5 py-3.5">Last chat</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredProfiles.map((profile) => (
                <tr key={profile.userId} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.025]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <span>
                        <strong className="block text-slate-900 dark:text-white">{profile.name}</strong>
                        <small className="text-slate-400">{profile.email || profile.userId}</small>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-200">
                      <MessageSquare size={14} className="text-blue-500" />
                      {profile.chatCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{exactTime(profile.lastChatAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onOpenUser(profile)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-black text-white hover:bg-violet-700"
                    >
                      <ExternalLink size={13} />
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm font-semibold text-slate-500">
              <Loader2 className="animate-spin text-violet-500" size={18} />
              Loading AI chat activity…
            </div>
          )}

          {!loading && !error && filteredProfiles.length === 0 && (
            <div className="py-16 text-center">
              <Bot className="mx-auto text-slate-300" size={30} />
              <p className="mt-3 text-sm font-bold text-slate-500">No AI chat activity matches this view.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
