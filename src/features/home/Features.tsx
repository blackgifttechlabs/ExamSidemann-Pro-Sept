import React, { useState, useEffect } from 'react';
import { Eye, Calendar, ArrowRight } from 'lucide-react';
import { db, auth } from '../../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  createdAt: any;
  author: string;
  views?: number;
  likedBy?: string[];
}

interface FeaturesProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3 posts for the specific layout
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(3));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  return (
    <section id="news" className="bg-gray-50/50 dark:bg-[#0f0f0f] py-12 md:py-20 relative overflow-hidden">
      <div className="w-full px-[20px] max-w-none relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b365d]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b365d]"></span>
              </span>
              <span className="text-[#1b365d] dark:text-blue-400 font-bold text-xs uppercase tracking-widest leading-none">News & Updates</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              Latest News & Updates
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
              Stay informed with the latest school, education and national stories.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate?.('news/all')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1b365d] to-[#122543] hover:from-[#122543] hover:to-[#0c1a30] text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5 shrink-0"
          >
            View All News <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-[4/5] bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse"></div>
                <div className="flex flex-col gap-6">
                    <div className="flex-1 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse"></div>
                    <div className="flex-1 bg-gray-200 dark:bg-white/5 rounded-lg animate-pulse"></div>
                </div>
            </div>
        ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Main Feature Article (Left) */}
                {posts[0] && (
                  <div 
                    onClick={() => onNavigate?.('news/article', { id: posts[0].id })}
                    className="group relative flex flex-col justify-end rounded-2xl overflow-hidden cursor-pointer min-h-[420px] sm:min-h-[480px] lg:h-[540px] xl:h-[600px] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 bg-neutral-950"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full z-0">
                      <img 
                          src={posts[0].image || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070'} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          alt={posts[0].title}
                      />
                      {/* Rich, protective high-contrast gradient overlay to ensure text is perfectly visible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent"></div>
                    </div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
                      <span className="px-3.5 py-2 bg-[#1b365d] text-white text-[10px] lg:text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                        <span className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">🏛</span>
                        {posts[0].category || 'School News'}
                      </span>
                    </div>

                    {/* Content Section (Positioned dynamic relative bottom, avoiding badge clutter) */}
                    <div className="relative z-10 p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-end w-full">
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-300 mb-2.5">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#ff7400]/80" /> {formatRelativeTime(posts[0].createdAt)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <span className="flex items-center gap-1.5"><Eye size={13} className="text-[#ff7400]/80" /> {posts[0].views || 0} views</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl lg:text-3.5xl font-black text-white leading-tight mb-3 group-hover:text-[#ff7400] transition-colors line-clamp-2">
                        {posts[0].title}
                      </h3>
                      
                      {posts[0].content && (
                        <p className="hidden sm:block text-gray-200/90 text-sm leading-relaxed mb-5 font-normal max-w-2xl">
                          {stripHtml(posts[0].content).slice(0, 160) + (stripHtml(posts[0].content).length > 160 ? '...' : '')}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-sky-350 dark:text-blue-400 font-bold text-sm group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all">
                        Read Full Article <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Side Stacked Articles */}
                <div className="flex flex-col gap-4 lg:gap-6 lg:h-[540px] xl:h-[600px]">
                  {posts.slice(1, 3).map((post, idx) => (
                    <div 
                      key={post.id}
                      onClick={() => onNavigate?.('news/article', { id: post.id })}
                      className="group bg-white dark:bg-[#131313] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-row border border-gray-100 dark:border-white/5 lg:flex-1 min-h-[140px] sm:min-h-[160px]"
                    >
                      {/* Image side - elegant fixed aspect/width thumbnail */}
                      <div className="relative w-[130px] sm:w-[180px] md:w-[220px] lg:w-[160px] xl:w-[220px] shrink-0 h-full overflow-hidden">
                        <img 
                          src={post.image || (idx === 0 ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070' : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070')} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt={post.title}
                        />
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="px-2 py-1 bg-[#1b365d]/95 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-md">
                             <span>📈</span>
                             <span className="truncate max-w-[80px]">{post.category || 'News'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-center flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 text-[9px] sm:text-xs font-medium text-gray-400 mb-1.5 lg:mb-2.5">
                          <span className="flex items-center gap-1"><Calendar size={12} /> <span>{formatRelativeTime(post.createdAt)}</span></span>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                          <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0} views</span>
                        </div>
                        
                        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 lg:mb-4 group-hover:text-[#1b365d] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 text-[#1b365d] dark:text-blue-400 text-[10px] sm:text-xs font-bold mt-auto group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        ) : (
            <div className="py-24 text-center bg-white dark:bg-[#0f0f0f] rounded-lg max-w-2xl mx-auto border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No recent news</h3>
                <p className="text-gray-500">Check back later for updates.</p>
            </div>
        )}
      </div>
    </section>
  );
};
