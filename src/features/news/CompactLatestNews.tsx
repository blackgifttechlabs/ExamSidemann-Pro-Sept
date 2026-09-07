import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Eye, Newspaper } from 'lucide-react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';

type NewsPost = {
  id: string;
  title: string;
  category?: string;
  image?: string;
  createdAt?: any;
  views?: number;
};

type Props = {
  onNavigate?: (page: string, params?: any) => void;
};

const relativeTime = (timestamp: any) => {
  if (!timestamp?.toDate) return 'Just now';
  const seconds = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return timestamp.toDate().toLocaleDateString();
};

export const CompactLatestNews: React.FC<Props> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(6));
    return onSnapshot(newsQuery, (snapshot) => {
      setPosts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as NewsPost)));
      setLoading(false);
    });
  }, []);

  return (
    <section id="news" className="bg-[#f7f8fa] text-left dark:bg-[#060608]">
      <div className="relative overflow-hidden px-4 pb-24 pt-20 md:px-8">
        <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale-[25%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/95 via-[#10233d]/90 to-[#f7f8fa] dark:to-[#060608]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row lg:items-start">
          <div className="max-w-2xl text-center lg:pt-3 lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
                <Newspaper size={14} /> News & updates
              </div>
              <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">Latest News & Updates</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65 md:text-base lg:mx-0">School announcements, education stories, opportunities, and important national updates.</p>
            <button onClick={() => onNavigate?.('news/all')} className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-[12px] bg-cyan-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 lg:mx-0">
              View all news <ArrowRight size={15} />
            </button>
          </div>

          <div className="grid w-full max-w-xl shrink-0 grid-cols-2 gap-3">
            {loading ? (
              [1, 2, 3, 4].map((item) => <div key={item} className="h-[150px] animate-pulse rounded-[15px] bg-white/10 sm:h-[168px]" />)
            ) : posts.length ? posts.slice(0, 4).map((post, index) => (
              <button
                key={post.id}
                onClick={() => onNavigate?.('news/article', { id: post.id })}
                className="group h-[150px] overflow-hidden rounded-[15px] border border-white/15 bg-white/95 text-left shadow-lg transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-2xl dark:bg-[#111] sm:h-[168px]"
              >
                <div className="relative h-20 overflow-hidden bg-slate-200 sm:h-24">
                  <img src={post.image || `https://images.unsplash.com/photo-${index % 2 ? '1523240795612-9a054b0db644' : '1577896851231-70ef18881754'}?q=80&w=700`} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute left-2 top-2 rounded-[8px] bg-slate-950/70 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white backdrop-blur-sm">{post.category || 'Education'}</span>
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-[10px] font-black uppercase leading-5 tracking-wide text-slate-900 dark:text-white sm:text-xs">{post.title}</h3>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[9px] font-bold text-slate-400 sm:mt-2">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {relativeTime(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye size={10} /> {post.views || 0}</span>
                  </div>
                </div>
              </button>
            )) : (
              <div className="col-span-full rounded-[15px] border border-dashed border-white/20 bg-white/5 py-16 text-center text-white/60">No recent news yet.</div>
            )}
          </div>
          </div>
      </div>
    </section>
  );
};
